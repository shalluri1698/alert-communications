import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";
import { sitePages } from "@/lib/site-pages";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const origin = SITE_URL;
        const urls = sitePages().map((p) => `  <url><loc>${(origin + p.path).replace(/&/g, "&amp;")}</loc></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
