/** Service-role Supabase REST helpers for the AI redirect system. */

type Env = Record<string, string | undefined>;

function readEnv(env?: unknown): Env {
  const injected = (env ?? {}) as Env;
  const fromProcess = (typeof process !== "undefined" ? process.env : {}) as Env;
  return { ...fromProcess, ...injected };
}

export function restConfig(env?: unknown): { url: string; key: string } | null {
  const e = readEnv(env);
  const url = e["SUPABASE_URL"];
  const key = e["SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function rest(
  cfg: { url: string; key: string },
  path: string,
  init: RequestInit & { prefer?: string } = {},
): Promise<Response> {
  const { prefer, ...rest } = init;
  return fetch(`${cfg.url}/rest/v1/${path}`, {
    ...rest,
    headers: headers(cfg.key, prefer ? { Prefer: prefer } : {}),
  });
}

export type StoredRedirect = { to_path: string; status: number };

/** Look up an existing redirect rule for a 404 path. */
export async function findRedirect(path: string, env?: unknown): Promise<StoredRedirect | null> {
  const cfg = restConfig(env);
  if (!cfg) return null;
  try {
    const res = await rest(
      cfg,
      `redirects?select=to_path,status&from_path=eq.${encodeURIComponent(path)}&limit=1`,
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as StoredRedirect[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

/** Queue a 404 for the AI matcher (idempotent on path). */
export async function recordMiss(path: string, referrer: string | null, env?: unknown): Promise<void> {
  const cfg = restConfig(env);
  if (!cfg) return;
  try {
    const existing = await rest(
      cfg,
      `redirect_misses?select=id,hit_count&path=eq.${encodeURIComponent(path)}&limit=1`,
    );
    if (existing.ok) {
      const rows = (await existing.json()) as { id: string; hit_count: number }[];
      const row = rows[0];
      if (row) {
        await rest(cfg, `redirect_misses?id=eq.${row.id}`, {
          method: "PATCH",
          body: JSON.stringify({ hit_count: row.hit_count + 1, last_seen: new Date().toISOString() }),
        });
        return;
      }
    }
    await rest(cfg, "redirect_misses", {
      method: "POST",
      prefer: "resolution=merge-duplicates,return=minimal",
      body: JSON.stringify({ path, referrer }),
    });
  } catch {
    // Never let redirect bookkeeping break the response.
  }
}

/** Bump the hit counter on a served redirect. Best effort. */
export async function countRedirectHit(path: string, env?: unknown): Promise<void> {
  const cfg = restConfig(env);
  if (!cfg) return;
  try {
    const res = await rest(cfg, `redirects?select=id,hits&from_path=eq.${encodeURIComponent(path)}&limit=1`);
    if (!res.ok) return;
    const rows = (await res.json()) as { id: string; hits: number }[];
    const row = rows[0];
    if (!row) return;
    await rest(cfg, `redirects?id=eq.${row.id}`, {
      method: "PATCH",
      body: JSON.stringify({ hits: row.hits + 1, updated_at: new Date().toISOString() }),
    });
  } catch {
    /* ignore */
  }
}
