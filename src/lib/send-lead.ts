import { getAttribution } from "./tracking";
import { submitLead } from "./lead.functions";
import { gaEvent } from "./analytics";

/** Collects form fields, attaches attribution, sends to the webhook. Never blocks the thank-you screen. */
export async function sendLead(formEl: HTMLFormElement, form: string) {
  const fields: Record<string, string> = {};
  new FormData(formEl).forEach((v, k) => { if (typeof v === "string") fields[k] = v; });
  try {
    await submitLead({ data: { form, fields, attribution: getAttribution() as Record<string, unknown> } });
  } catch (e) {
    console.error("lead submit failed", e);
  }
  const w = window as unknown as { dataLayer?: unknown[]; fbq?: (...a: unknown[]) => void };
  gaEvent("web_form_lead", { form_name: form, page_path: location.pathname });
  w.fbq?.("track", "Lead", { content_name: form });
}
