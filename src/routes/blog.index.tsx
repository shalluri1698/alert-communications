import { HERO } from "@/lib/hero";
import { SITE_URL, abs } from "@/lib/site";
import { graph, webPage, ORG_ID } from "@/lib/schema";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { Header, Footer, MobileCallBar, TexturedMain, FinalCTA } from "@/components/home/sections";
import { useReveal } from "@/hooks/use-reveal";
import raw from "@/data/blog-index.json";

type Post = { title: string; image?: string | null; date: string; slug: string; excerpt?: string };
const posts = raw as Post[];
const PER = 12;
const title = "Legal Intake & Answering Service Blog | Alert Communications";
const description = "Insights on legal intake, answering services, AI, CRM integrations and client communication for law firms.";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { property: "og:url", content: abs("/blog") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: abs("/blog") }],
    scripts: [graph(webPage("/blog", title, { about: { "@id": ORG_ID } }, "CollectionPage"))],
  }),
  component: Blog,
});

function Blog() {
  useReveal("blog");
  const [q, setQ] = useState("");
  const [shown, setShown] = useState(PER);
  const list = posts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
  const rest = list.slice(0, shown);
  return (
    <div className="pb-20 font-body text-foreground md:pb-0">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
          <img fetchPriority="high" src={HERO.src} srcSet={HERO.srcSet} sizes={HERO.sizes} alt="" className="hero-zoom absolute inset-0 -z-10 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/75 via-ink/85 to-ink" />
          <div className="hero-rise mx-auto max-w-3xl px-5 py-16 text-center md:py-24">
            <span className="inline-flex rounded-full border border-brand/50 bg-brand/10 px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.25em]">Insights</span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight md:text-6xl">The Alert <span className="text-brand">Blog</span></h1>
            <p className="mx-auto mt-5 max-w-xl font-lato text-[17px] text-ink-foreground/80">{description}</p>
            <label className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-full border border-ink-foreground/15 bg-ink-foreground/10 px-5 py-3 backdrop-blur focus-within:border-brand">
              <Search className="h-4 w-4 text-ink-foreground/60" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setShown(PER); }} placeholder="Search articles" aria-label="Search articles" className="w-full bg-transparent font-lato text-[15px] outline-none placeholder:text-ink-foreground/50" />
            </label>
          </div>
        </section>
        <TexturedMain>
          <section className="px-5 py-16 md:py-20">
            <div className="mx-auto max-w-[1200px]">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <Link key={p.slug} to="/blog/$slug/" params={{ slug: p.slug }} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className="aspect-[16/10] overflow-hidden bg-secondary">{p.image && <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}</div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="flex items-center gap-2 font-lato text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5 text-brand" />{p.date}</p>
                      <h3 className="mt-2 font-display text-lg font-bold leading-snug">{p.title}</h3>
                      <span className="mt-3 block h-0.5 w-10 bg-brand transition-all group-hover:w-16" />
                      {p.excerpt && <p className="mt-3 line-clamp-3 flex-1 font-lato text-[15px] leading-relaxed text-muted-foreground">{p.excerpt}…</p>}
                      <span className="mt-5 inline-flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wide text-brand">Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                    </div>
                  </Link>
                ))}
              </div>
              {shown < list.length && (
                <div className="mt-12 text-center">
                  <button onClick={() => setShown((n) => n + PER)} className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-brand-foreground transition hover:bg-brand-deep">Load More Articles <ArrowRight className="h-4 w-4" /></button>
                  <p className="mt-3 font-lato text-sm text-muted-foreground">Showing {rest.length} of {list.length} articles</p>
                </div>
              )}
              {!list.length && <p className="py-16 text-center font-lato text-muted-foreground">No articles match your search.</p>}
            </div>
          </section>
        </TexturedMain>
        <FinalCTA />
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
}
