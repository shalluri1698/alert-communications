import { z } from "zod";

const submissionSchema = z.object({
  form: z.enum(["quote_form", "live_form", "client_support", "ccpa_request"]),
  fields: z.record(z.string(), z.string().max(5000)),
  attribution: z.record(z.string(), z.unknown()),
}).superRefine(({ fields, form }, ctx) => {
  if (fields["website"]) return;
  const required = form === "ccpa_request"
    ? ["first_name", "last_name", "phone"]
    : ["name", "company", "phone"];
  for (const field of required) {
    if (!fields[field]?.trim()) ctx.addIssue({ code: "custom", message: "Required", path: ["fields", field] });
  }
  if (!z.string().email().safeParse(fields["email"]?.trim()).success || fields["privacy"] !== "on") {
    ctx.addIssue({ code: "custom", message: "Email and privacy acceptance required" });
  }
  if (form === "ccpa_request" && fields["email"]?.trim().toLowerCase() !== fields["email_confirm"]?.trim().toLowerCase()) {
    ctx.addIssue({ code: "custom", message: "Email confirmation does not match" });
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/** Same-origin browser intake; only this server contacts Catalyst. */
export async function handleLeadSubmission(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== new URL(request.url).origin)) {
    return json({ ok: false, error: "Origin not allowed" }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ ok: false, error: "JSON required" }, 415);
  }
  let raw: unknown;
  try {
    // Bound the body while reading, including requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return json({ ok: false, error: "Invalid submission" }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 65536) {
        await reader.cancel();
        return json({ ok: false, error: "Submission too large" }, 413);
      }
      chunks.push(value);
    }
    const body = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    raw = JSON.parse(new TextDecoder().decode(body));
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }
  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) return json({ ok: false, error: "Check the form fields and privacy acceptance" }, 400);
  if (parsed.data.fields["website"]) return json({ ok: true });

  const endpoint = process.env["CATALYST_FORM_URL"] ||
    "https://lead-form-management-918580965.development.catalystserverless.com/server/Alert_Lead_Management/";
  const key = process.env["CATALYST_FORM_API_KEY"];
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(key ? { "X-API-Key": key } : {}) },
      body: JSON.stringify(parsed.data),
      signal: AbortSignal.timeout(30000),
    });
    const result = await response.json().catch(() => null);
    if (response.ok && (result?.success === true || result?.ok === true)) return json({ ok: true });
    console.error("[lead] Catalyst rejected submission", { status: response.status });
  } catch {
    console.error("[lead] Catalyst request failed");
  }
  return json({ ok: false, error: "Unable to save submission. Please try again." }, 502);
}
