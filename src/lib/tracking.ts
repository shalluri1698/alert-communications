// Browser-only lead attribution: captures UTMs and ad click IDs, keeps first and last touch.
export const TRACK_KEYS = [
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_id",
  "gclid", "gbraid", "wbraid", "gad_source", "fbclid", "msclkid", "ttclid", "li_fat_id",
] as const;

export type Touch = Partial<Record<(typeof TRACK_KEYS)[number], string>> & {
  landing_page: string;
  referrer: string;
  timestamp: string;
};

const FIRST = "alert_first_touch";
const LAST = "alert_last_touch";
const MAX_AGE_DAYS = 90;

function read(key: string): Touch | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const t = JSON.parse(raw) as Touch;
    if (Date.now() - new Date(t.timestamp).getTime() > MAX_AGE_DAYS * 864e5) return null;
    return t;
  } catch {
    return null;
  }
}

function write(key: string, t: Touch) {
  try { localStorage.setItem(key, JSON.stringify(t)); } catch { /* storage blocked */ }
}

function cookie(name: string) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m?.[1] !== undefined ? decodeURIComponent(m[1]) : undefined;
}

/** Derive a channel label when no utm_source is present. */
export function channelOf(t: Touch | null): string {
  if (!t) return "direct";
  if (t.gclid || t.gbraid || t.wbraid) return "google_ads";
  if (t.fbclid) return t.utm_medium?.includes("paid") || t.utm_medium === "cpc" ? "meta_ads" : "facebook";
  if (t.msclkid) return "microsoft_ads";
  if (t.utm_source) return `${t.utm_source}${t.utm_medium ? " / " + t.utm_medium : ""}`;
  if (!t.referrer) return "direct";
  try {
    const host = new URL(t.referrer).hostname;
    if (/google\.|bing\.|yahoo\.|duckduckgo\./.test(host)) return "organic_search";
    if (/facebook\.|instagram\.|linkedin\.|t\.co|twitter\.|x\.com/.test(host)) return "organic_social";
    return "referral";
  } catch {
    return "referral";
  }
}

/** Call once per page load. Records a touch only when the visit carries campaign data or an external referrer. */
export function captureAttribution() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const t: Touch = { landing_page: window.location.href, referrer: document.referrer, timestamp: new Date().toISOString() };
  let hasParams = false;
  for (const k of TRACK_KEYS) {
    const v = params.get(k);
    if (v) { t[k] = v.slice(0, 500); hasParams = true; }
  }
  let external = false;
  try { external = !!document.referrer && new URL(document.referrer).hostname !== window.location.hostname; } catch { /* ignore */ }

  const first = read(FIRST);
  if (!first) write(FIRST, t);
  if (hasParams || external || !read(LAST)) write(LAST, t);
}

/** Full attribution payload to send with a lead. */
export function getAttribution() {
  const first = read(FIRST);
  const last = read(LAST);
  return {
    first_touch: first,
    last_touch: last,
    channel: channelOf(last ?? first),
    first_channel: channelOf(first),
    page_url: window.location.href,
    page_title: document.title,
    fbp: cookie("_fbp"),
    fbc: cookie("_fbc") ?? (last?.fbclid ? `fb.1.${Date.now()}.${last.fbclid}` : undefined),
    ga_client_id: cookie("_ga")?.split(".").slice(-2).join("."),
    user_agent: navigator.userAgent,
    submitted_at: new Date().toISOString(),
  };
}
