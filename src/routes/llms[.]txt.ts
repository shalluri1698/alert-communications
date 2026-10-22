import { createFileRoute } from "@tanstack/react-router";
import { sitePages, type SitePage } from "@/lib/site-pages";
import { abs } from "@/lib/site";

const line = (p: SitePage) => `- [${p.title}](${abs(p.path)})${p.summary ? `: ${p.summary.replace(/\s+/g, " ").trim()}` : ""}`;

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const pages = sitePages();
        const group = (k: SitePage["kind"]) => pages.filter((p) => p.kind === k).map(line).join("\n");
        const body = `# Alert Communications

> Alert Communications provides 24/7 legal call answering, legal intake, virtual receptionists, retainer services, live chat and mass tort intake for law firms nationwide. Founded in 1965 and based in Camarillo, California, Alert serves only the legal industry with bilingual English and Spanish specialists.

## Main pages
${group("core")}

## Services
${group("hub")}

## Service areas
${group("city")}

## Blog
${group("blog")}
`;
        return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
