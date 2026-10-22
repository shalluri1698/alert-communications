import heads from "@/data/page-heads.json";
import blogIndex from "@/data/blog-index.json";
import { SERVICES } from "@/lib/schema";

export type SitePage = {
  path: string;
  title: string;
  /** Short summary used by the AI matcher. */
  summary: string;
  kind: "core" | "hub" | "service" | "city" | "city-service" | "blog";
};

const STATE_SLUGS = Object.keys(import.meta.glob("/src/data/states/*.json")).map((k) => k.split("/").pop()!.replace(".json", ""));
const titleCase = (s: string) => s.split("-").map((w) => w[0]!.toUpperCase() + w.slice(1)).join(" ");

let cache: SitePage[] | null = null;

/** Every canonical, indexable page on the site (trailing-slash paths). Used by the redirect matcher. */
export function sitePages(): SitePage[] {
  if (cache) return cache;

  const pages: SitePage[] = [
    { path: "/", title: "Alert Communications: legal intake and answering for law firms", summary: "Homepage. 24/7 legal call answering, intake, virtual receptionists, retainers.", kind: "core" },
    { path: "/services/", title: "Legal answering, intake and retainer services", summary: "All Alert services for law firms.", kind: "core" },
    { path: "/plans/", title: "Plans and pricing", summary: "Pricing, plans, cost, billing for legal answering and intake.", kind: "core" },
    { path: "/blog/", title: "Blog", summary: "All legal intake, answering and law firm marketing articles, guides and downloads.", kind: "core" },
  ];

  for (const [key, h] of Object.entries(heads as Record<string, { title: string; desc: string }>)) {
    if (key === "downloads") continue;
    pages.push({ path: `/${key}/`, title: h.title, summary: h.desc, kind: "core" });
  }

  for (const [slug, name, type, desc] of SERVICES) {
    pages.push({ path: `/services/${slug}/`, title: `${name} (${type})`, summary: desc, kind: "hub" });
  }

  for (const slug of STATE_SLUGS) {
    const name = titleCase(slug);
    pages.push({ path: `/service-area/${slug}/`, title: `${name} legal answering and intake`, summary: `Law firm call answering and intake services in ${name}.`, kind: "city" });
  }

  for (const p of blogIndex as { slug: string; title: string; excerpt?: string }[]) {
    pages.push({ path: `/blog/${p.slug}/`, title: p.title, summary: p.excerpt ?? "", kind: "blog" });
  }

  cache = pages;
  return pages;
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((t) => t.length > 2);
}

/** Cheap lexical prefilter so the AI only ranks a short candidate list. */
export function shortlistPages(brokenPath: string, limit = 30): SitePage[] {
  return scorePages(brokenPath)
    .slice(0, limit)
    .map((s) => s.page);
}

function scorePages(brokenPath: string): { page: SitePage; score: number }[] {
  const wanted = new Set(tokenize(brokenPath));
  const scored = sitePages().map((page) => {
    const haystack = tokenize(`${page.path} ${page.title} ${page.summary}`);
    let score = 0;
    for (const token of haystack) if (wanted.has(token)) score += 1;
    // Path token matches are the strongest signal.
    for (const token of tokenize(page.path)) if (wanted.has(token)) score += 2;
    if (page.kind === "hub" || page.kind === "core") score += 0.5;
    // Prefer service/location pages over articles for dead URLs.
    if (page.kind === "blog") score -= 2.5;
    return { page, score };
  });
  return scored.sort((a, b) => b.score - a.score);
}

/**
 * Instant, zero-latency guess for a dead URL so visitors never see a 404.
 * Requires a real token overlap, otherwise returns null.
 */
export function instantMatch(brokenPath: string): SitePage | null {
  const wantedCount = tokenize(brokenPath).length;
  if (wantedCount === 0) return null;
  const [best, second] = scorePages(brokenPath);
  if (!best) return null;
  // Need at least one strong path-token hit, and a clear-ish winner.
  if (best.score < 2.5) return null;
  if (second && best.score - second.score < 0.5 && best.score < 4) return null;
  return best.page;
}
