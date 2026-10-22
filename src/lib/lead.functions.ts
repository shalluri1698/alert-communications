import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  form: z.string().max(100),
  fields: z.record(z.string(), z.string().max(5000)),
  attribution: z.record(z.string(), z.unknown()),
});

/** Forwards a lead plus its attribution to LEAD_WEBHOOK_URL (kept server-side). */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => schema.parse(d))
  .handler(async ({ data }) => {
    const url = process.env["LEAD_WEBHOOK_URL"];
    const payload = { ...data, received_at: new Date().toISOString() };
    if (!url) {
      console.log("[lead] no LEAD_WEBHOOK_URL set, lead captured:", JSON.stringify(payload));
      return { ok: true, delivered: false };
    }
    try {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) console.error("[lead] webhook failed", res.status, await res.text());
      return { ok: true, delivered: res.ok };
    } catch (e) {
      console.error("[lead] webhook error", e);
      return { ok: true, delivered: false };
    }
  });
