<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Service pages render from src/data/services.json through one template route (src/routes/services.$slug.tsx); nav/menu metadata lives in src/data/service-nav.ts. Why: all eight service pages share one layout, so content stays as data.
- Service page FAQs come from the live site's visible FAQ text and are emitted as FAQPage JSON-LD in head(). Why: keeps schema in sync with on-page FAQs.
- Company/about/who-we-serve pages render from src/data/pages.json through src/components/content-page.tsx (section types keyed by `type`); each route file is a thin wrapper. Why: 16 pages share one layout, so content stays as data.
- Header menus (Who We Serve, About) read from src/data/site-nav.ts. Why: one source for desktop panels, mobile menu and footer.
- The 12 About-menu pages (about, who-we-are, faq, partnerships, service-area, downloads, virtual-tour, our-clients, testimonials, careers, case-studies, client-support) render from per-page components in src/components/live-pages.tsx, not the generic ContentPage. Why: they mirror the live site's differing templates one to one.
- Blog posts render from per-post JSON in src/data/blog/ (lazy-loaded by src/routes/blog.$slug.tsx); the list reads src/data/blog-index.json. Why: 385 imported posts would bloat the bundle if loaded together.
- Route head() reads SEO-only data (src/lib/page-head.ts + src/data/page-heads.json; services loader imports data dynamically). Why: anything head() or a loader touches eagerly ships in the shared bundle on every page.
- Fonts are self-hosted via @fontsource imports in src/styles.css and YouTube embeds use the click-to-load src/components/youtube.tsx. Why: Lighthouse mobile scores.
- Canonical and og:url are absolute, built from SITE_URL in src/lib/site.ts. Why: Lighthouse/Google need absolute canonicals.
- State service-area pages load one JSON per state from src/data/states/{slug}.json (page copy + fan-out) via import.meta.glob. Why: 50 states in one file would ship to every state page.
- Lead attribution: src/lib/tracking.ts captures UTMs/click IDs (first + last touch in localStorage, 90 days) on root mount; all forms call sendLead, which posts via a server function to the LEAD_WEBHOOK_URL secret. Why: webhook URL stays private and ad source survives page-to-page browsing.
- Structured data is one linked entity graph built in src/lib/schema.ts (stable @ids for Organization, WebSite, Services, Persons, States); the root route emits the sitewide graph and each page head() adds a WebPage/BlogPosting that references those @ids. Why: entities stay consistent and are defined once.
- URLs end with a trailing slash (router trailingSlash: "always"; canonicals via abs() in src/lib/site.ts; internal links written with the slash). Why: matches the WordPress URLs so rankings carry over.
- 404s are handled in src/server.ts: stored rules (redirects table, 303) first, else instant 302 guess from src/lib/site-pages.ts or home; misses are queued and resolved by /api/public/redirect-ai on a 15-minute cron. Why: visitors never see a 404 and Google learns durable mappings. Add new page types to site-pages.ts.
