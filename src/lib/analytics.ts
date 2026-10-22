import { getGaId } from "./analytics.functions";

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };

/** Sales lines only. Customer Service numbers are deliberately excluded. */
export const SALES_NUMBERS = ["8442362485", "8055167409"];
export const isSalesTel = (href: string) => SALES_NUMBERS.includes(href.replace(/^tel:/i, "").replace(/\D/g, "").replace(/^1(?=\d{10}$)/, ""));

export function gaEvent(name: string, params: Record<string, unknown> = {}) {
  const w = window as W;
  w.gtag?.("event", name, params);
}

let started = false;
/** Loads gtag.js, tracks route changes, and fires click_to_call for sales phone taps. Call once from useEffect. */
export async function initAnalytics(subscribe: (cb: () => void) => void) {
  if (started) return;
  started = true;
  const id = await getGaId().catch(() => null);
  if (!id) return;
  const w = window as W;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () { (w.dataLayer as unknown[]).push(arguments); };
  w.gtag("js", new Date());
  w.gtag("config", id);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(s);

  let last = location.pathname;
  subscribe(() => {
    if (location.pathname === last) return;
    last = location.pathname;
    w.gtag?.("event", "page_view", { page_path: location.pathname, page_location: location.href, page_title: document.title });
  });

  document.addEventListener("click", (e) => {
    const a = (e.target as Element | null)?.closest?.("a[href^='tel:']") as HTMLAnchorElement | null;
    if (!a || !isSalesTel(a.getAttribute("href") ?? "")) return;
    gaEvent("click_to_call", { phone_number: a.getAttribute("href")!.replace(/^tel:/i, ""), page_path: location.pathname, link_text: a.textContent?.trim().slice(0, 80) });
  }, { capture: true });
}
