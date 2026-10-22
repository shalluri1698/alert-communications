import raw from "./services.json";

export type Bullet = { label: string; text: string };
export type Block = { t: "p" | "h" | "lead"; text: string } | { t: "ul"; items: Bullet[] };
export type Item = { title: string; text: string; num?: boolean };
export type Section = { h2: string; blocks: Block[]; items: Item[]; cards: { title: string; text: string }[] };
export type ServicePage = {
  slug: string; seoTitle: string; seoDescription: string; h1: string; lead: string;
  heroBullets: string[]; badges: string[]; sections: Section[];
  faqs: { q: string; a: Block[] }[];
  cta: { h2: string; text: string; bullets: string[] };
};

export const servicePages = raw as unknown as ServicePage[];
export const getServicePage = (slug: string) => servicePages.find((p) => p.slug === slug);

export const blockText = (b: Block[]) =>
  b.map((x) => (x.t === "ul" ? x.items.map((i) => (i.label ? `${i.label}: ${i.text}` : i.text)).join(" ") : x.text)).join(" ");
