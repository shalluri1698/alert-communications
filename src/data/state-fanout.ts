import type { PageTeam } from "@/data/service-team";

type Rep = "tammy" | "jill" | "michelle" | "liz";

/** Data lives per state in src/data/states/{slug}.json. State-level fan-out table, definition box and team for a service-area page. Replaces that page's numbered-cards section. */
export type StateFanout = {
  paa: { q: string; a: string }[];
  heroEyebrow?: string;
  h1?: string;
  lead?: string;
  eyebrow: string;
  h2: string;
  intro: string;
  columns: [string, string, string];
  rows: [string, string, string][];
  tools: string[][];
  help: [Rep, string][];
  ecosystem: string[];
  proof: string[];
  team: PageTeam;
  /** In-body links to national service pages, long-tail anchors. */
  crossLinks: (string | { text: string; slug: string } | { text: string; state: string })[];
};

