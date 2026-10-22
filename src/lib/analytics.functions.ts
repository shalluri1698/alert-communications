import { createServerFn } from "@tanstack/react-start";

/** GA4 measurement IDs are public by design; served from the stored secret so it can change without a code edit. */
export const getGaId = createServerFn({ method: "GET" }).handler(async () => {
  const id = process.env["GOOGLE_ANALYTICS_MEASUREMENT_ID"]?.trim() ?? "";
  return /^G-[A-Z0-9]+$/i.test(id) ? id : null;
});
