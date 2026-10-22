import { SITE_URL, abs } from "@/lib/site";
import { graph, pageNode } from "@/lib/schema";
import heads from "@/data/page-heads.json";

type Head = { title: string; desc: string; faq?: string[][] };

/** Route head() metadata. Reads a small SEO-only file so page content stays out of the shared bundle. */
export function pageHead(key: string, path: string) {
  const p = (heads as Record<string, Head>)[key]!;
  return {
    meta: [
      { title: p.title }, { name: "description", content: p.desc },
      { property: "og:title", content: p.title }, { property: "og:description", content: p.desc },
      { property: "og:type", content: "website" }, { property: "og:url", content: abs(path) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: abs(path) }],
    scripts: [graph(pageNode(path, p.title)), ...(p.faq ? [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: p.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }) }] : [])],
  };
}
