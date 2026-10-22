import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/site";

const RULES = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /`;

/** Sitemap line follows whichever domain serves the site (Lovable address now, client domain after launch). */
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const origin = SITE_URL;
        return new Response(`${RULES.trim()}\n\nSitemap: ${origin}/sitemap.xml\n`, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
