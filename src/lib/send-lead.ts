import { getAttribution } from "./tracking";
import { gaEvent } from "./analytics";

/** Resolves only after Catalyst confirms the submission was saved. */
export async function sendLead(formEl: HTMLFormElement, form: string) {
  const fields: Record<string, string> = {};
  new FormData(formEl).forEach((v, k) => { if (typeof v === "string") fields[k] = fields[k] ? `${fields[k]}; ${v}` : v; });
  const url = import.meta.env["VITE_CATALYST_FORM_URL"] ||
    "https://lead-form-management-918580965.development.catalystserverless.com/server/Alert_Lead_Management/";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ form, fields, attribution: getAttribution() }),
    credentials: "omit",
    signal: AbortSignal.timeout(45000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.ok !== true) throw new Error("Submission could not be saved");
  const w = window as unknown as { dataLayer?: unknown[]; fbq?: (...a: unknown[]) => void };
  // Analytics failures must not turn an accepted submission into a failed form.
  try {
    gaEvent("web_form_lead", { form_name: form, page_path: location.pathname });
    w.fbq?.("track", "Lead", { content_name: form });
  } catch { /* submission is already saved */ }
}
