import { createFileRoute } from "@tanstack/react-router";

import { restConfig, rest } from "@/lib/redirects.server";
import { shortlistPages, sitePages } from "@/lib/site-pages";

const JOB_KEY = "ai-redirects";
const BATCH_SIZE = 8;
const LEASE_MINUTES = 5;
const MODEL = "google/gemini-3-flash-preview";

type JobState = {
  key: string;
  lease_until: string | null;
  paused: boolean;
  paused_reason: string | null;
};

type Miss = { id: string; path: string; attempts: number };

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function pickTarget(brokenPath: string, apiKey: string) {
  const candidates = shortlistPages(brokenPath, 30);
  const list = candidates.map((c) => `${c.path} | ${c.title} | ${c.summary.slice(0, 160)}`).join("\n");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You map dead URLs on Alert Communications, a legal call answering and intake company for law firms to the closest living page. Answer with strict JSON only: {\"path\":\"/some/path\",\"confidence\":0.0-1.0,\"reason\":\"short\"}. The path MUST be copied exactly from the candidate list. Prefer the most topically specific match. If nothing is a reasonable match, return the closest hub page or \"/\" with a low confidence.",
        },
        {
          role: "user",
          content: `Dead URL: ${brokenPath}\n\nCandidate pages (path | title | summary):\n${list}`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`AI gateway ${res.status}: ${body}`) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = data.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw.replace(/^```json\s*|```$/g, "")) as {
    path?: string;
    confidence?: number;
    reason?: string;
  };

  const known = new Set(sitePages().map((p) => p.path));
  const target = parsed.path && known.has(parsed.path) ? parsed.path : null;
  if (!target) return null;
  return { path: target, confidence: parsed.confidence ?? 0.5, reason: parsed.reason ?? "" };
}

async function run(): Promise<Response> {
  const cfg = restConfig();
  if (!cfg) return json({ error: "Database not configured" }, 500);
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return json({ error: "Missing LOVABLE_API_KEY" }, 500);

  // 1. Paused-state + single-flight guard.
  const stateRes = await rest(cfg, `redirect_job_state?key=eq.${JOB_KEY}&limit=1`);
  const state = ((await stateRes.json()) as JobState[])[0];
  if (!state) return json({ error: "Job state row missing" }, 500);

  const now = Date.now();
  const leased = state.lease_until ? Date.parse(state.lease_until) > now : false;
  if (leased) return json({ skipped: "already running" });

  let probeOnly = false;
  if (state.paused) probeOnly = true;

  const leaseUntil = new Date(now + LEASE_MINUTES * 60_000).toISOString();
  await rest(cfg, `redirect_job_state?key=eq.${JOB_KEY}`, {
    method: "PATCH",
    body: JSON.stringify({ lease_until: leaseUntil, last_run_at: new Date().toISOString() }),
  });

  const results: { path: string; to?: string; error?: string }[] = [];
  let paused: string | null = null;

  try {
    // 2. Bounded batch of unresolved 404s (one probe item while paused).
    const limit = probeOnly ? 1 : BATCH_SIZE;
    const missRes = await rest(
      cfg,
      `redirect_misses?select=id,path,attempts&status=eq.pending&attempts=lt.3&order=hit_count.desc,last_seen.desc&limit=${limit}`,
    );
    const misses = (await missRes.json()) as Miss[];

    for (const miss of misses) {
      try {
        const match = await pickTarget(miss.path, apiKey);
        if (!match) {
          await rest(cfg, `redirect_misses?id=eq.${miss.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              attempts: miss.attempts + 1,
              status: miss.attempts + 1 >= 3 ? "failed" : "pending",
              last_error: "No confident match",
            }),
          });
          results.push({ path: miss.path, error: "no match" });
          continue;
        }

        // 3. Idempotent progress: write the rule, then mark the miss resolved.
        await rest(cfg, "redirects", {
          method: "POST",
          prefer: "resolution=merge-duplicates,return=minimal",
          body: JSON.stringify({
            from_path: miss.path,
            to_path: match.path,
            status: 303,
            source: "ai",
            confidence: match.confidence,
            reason: match.reason,
          }),
        });
        await rest(cfg, `redirect_misses?id=eq.${miss.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "resolved", attempts: miss.attempts + 1, last_error: null }),
        });
        results.push({ path: miss.path, to: match.path });

        if (probeOnly) {
          // Probe succeeded: clear the pause and resume normal batches next run.
          probeOnly = false;
          await rest(cfg, `redirect_job_state?key=eq.${JOB_KEY}`, {
            method: "PATCH",
            body: JSON.stringify({ paused: false, paused_reason: null }),
          });
        }
      } catch (error) {
        const status = (error as { status?: number }).status;
        // 4. Circuit breaker: halt the whole job on billing/policy or repeated rate limits.
        if (status === 402 || status === 403 || status === 429) {
          paused = `AI gateway ${status}: ${(error as Error).message.slice(0, 300)}`;
          break;
        }
        await rest(cfg, `redirect_misses?id=eq.${miss.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            attempts: miss.attempts + 1,
            status: miss.attempts + 1 >= 3 ? "failed" : "pending",
            last_error: String((error as Error).message).slice(0, 300),
          }),
        });
        results.push({ path: miss.path, error: String((error as Error).message).slice(0, 200) });
      }
    }
  } finally {
    await rest(cfg, `redirect_job_state?key=eq.${JOB_KEY}`, {
      method: "PATCH",
      body: JSON.stringify({
        lease_until: null,
        paused: paused ? true : state.paused && probeOnly,
        paused_reason: paused ?? (probeOnly ? state.paused_reason : null),
        updated_at: new Date().toISOString(),
      }),
    });
  }

  return json({ processed: results.length, paused, results });
}

export const Route = createFileRoute("/api/public/redirect-ai")({
  server: {
    handlers: {
      // Bearer check screens stray traffic; the job is idempotent and only writes redirect rules.
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace("Bearer ", "");
        if (!token) return json({ error: "Unauthorized" }, 401);
        return run();
      },
    },
  },
});
