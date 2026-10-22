import { BLOG_HERO } from "@/lib/hero";
import { SITE_URL, abs } from "@/lib/site";
import { graph, webPage, linkedEntities, ORG_ID, personId } from "@/lib/schema";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Facebook, Linkedin, Mail, Calendar, Clock, PenLine, ArrowLeft, Link as LinkIcon, Check } from "lucide-react";
import { Header, Footer, MobileCallBar } from "@/components/home/sections";
import { LiveForm, Textured } from "@/components/live-pages";

type Post = { slug: string; title: string; date: string; image: string | null; excerpt: string; html: string };
const files = import.meta.glob<Post>("../data/blog/*.json", { import: "default" });

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const load = files[`../data/blog/${params.slug}.json`];
    if (!load) throw notFound();
    return await load();
  },
  head: ({ loaderData: p, params }) => {
    if (!p) return { meta: [{ title: "Article not found | Alert Communications" }, { name: "robots", content: "noindex" }] };
    const title = `${p.title} | Alert Communications`;
    const meta = [
      { title }, { name: "description", content: p.excerpt },
      { property: "og:title", content: title }, { property: "og:description", content: p.excerpt },
      { property: "og:type", content: "article" }, { property: "og:url", content: abs(`/blog/${params.slug}`) },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    return {
      meta,
      links: [{ rel: "canonical", href: abs(`/blog/${params.slug}`) }],
      scripts: [blogGraph(p, params.slug, title)],
    };
  },
  notFoundComponent: () => <div className="p-20 text-center font-display text-2xl">Article not found.</div>,
  component: BlogPost,
});

const XIcon = (props: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}><path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z" /></svg>
);

function BlogPost() {
  const p = Route.useLoaderData();
  const words = p.title.split(" ");
  const cut = Math.floor(words.length / 2);
  const [copied, setCopied] = useState(false);
  const mins = Math.max(1, Math.round(p.html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 225));
  const copy = () => { navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const url = typeof window !== "undefined" ? window.location.href : "";
  const share = [
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, Icon: Facebook },
    { label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(p.title)}`, Icon: XIcon },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, Icon: Linkedin },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(p.title)}&body=${encodeURIComponent(url)}`, Icon: Mail },
  ];
  return (
    <div className="pb-20 font-body text-foreground md:pb-0">
      <Header />
      <main>
        <section className="relative isolate flex min-h-[340px] items-center overflow-hidden bg-ink py-14 text-ink-foreground md:min-h-[460px]">
          <img fetchPriority="high" src={BLOG_HERO.src} srcSet={BLOG_HERO.srcSet} sizes={BLOG_HERO.sizes} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink/90 via-ink/65 to-ink/25" />
          <div className="mx-auto w-full max-w-[1300px] px-5 md:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-lato text-[13px] text-ink-foreground/70">
              <Link to="/blog/" className="inline-flex items-center gap-1.5 hover:text-ink-foreground"><ArrowLeft className="h-3.5 w-3.5" />Blog</Link>
              <span>/</span><span className="truncate">Article</span>
            </nav>
            <h1 className="mt-5 max-w-[900px] font-display text-[30px] font-bold uppercase leading-[1.1] md:text-[50px]">
              {words.slice(0, cut).join(" ")} <span className="text-brand">{words.slice(cut).join(" ")}</span>
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-lato text-[15px] text-ink-foreground/85">
              <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-brand" />{p.date}</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-brand" />{mins} min read</span>
              <span className="inline-flex items-center gap-2"><PenLine className="h-4 w-4 text-brand" />Alert Communications Editorial Team</span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="mr-1 font-display text-[13px] font-bold uppercase tracking-[0.2em] text-ink-foreground/70">Share</span>
              {share.map(({ label, href, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={`Share on ${label}`} className="grid h-11 w-11 place-items-center rounded-full border border-ink-foreground/25 bg-ink-foreground/10 backdrop-blur transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand"><Icon className="h-[18px] w-[18px]" /></a>
              ))}
              <button type="button" onClick={copy} className="inline-flex h-11 items-center gap-2 rounded-full border border-ink-foreground/25 bg-ink-foreground/10 px-5 font-lato text-[14px] backdrop-blur transition hover:border-brand hover:bg-brand">
                {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}{copied ? "Link copied" : "Copy link"}
              </button>
            </div>
          </div>
        </section>
        <Textured className="py-14 md:py-16">
          <div className="mx-auto grid w-full max-w-[1300px] gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,760px)_440px] lg:justify-between">
            <article className="blog-content min-w-0" dangerouslySetInnerHTML={{ __html: p.html }} />
            <aside><div className="lg:sticky lg:top-28"><LiveForm heading="Get A Quote" /></div></aside>
          </div>
        </Textured>
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
}

const REPS: Record<string, string> = { "Tammy Porter": "tammy", "Jill Rydberg": "jill", "Michelle Garcia": "michelle", "Liz York": "liz" };

/** BlogPosting tied to the site graph: about = services it links to, mentions = states, tools and quoted reps. */
function blogGraph(p: Post, slug: string, title: string) {
  const path = `/blog/${slug}`; const url = abs(path);
  const { about, mentions } = linkedEntities(p.html);
  const reps = Object.entries(REPS).filter(([n]) => p.html.includes(`<strong>${n}</strong>`)).map(([, id]) => ({ "@id": personId(id) }));
  const d = new Date(p.date); const iso = isNaN(d.getTime()) ? p.date : d.toISOString().slice(0, 10);
  return graph(
    webPage(path, title, { primaryImageOfPage: p.image ? { "@type": "ImageObject", url: p.image.startsWith("http") ? p.image : SITE_URL + p.image } : undefined }),
    {
      "@type": "BlogPosting", "@id": `${url}#article`, headline: p.title, description: p.excerpt, url, datePublished: iso,
      mainEntityOfPage: { "@id": `${url}#webpage` }, isPartOf: { "@id": `${SITE_URL}/#website` },
      author: { "@id": ORG_ID }, publisher: { "@id": ORG_ID },
      ...(p.image ? { image: p.image.startsWith("http") ? p.image : SITE_URL + p.image } : {}),
      ...(about.length ? { about } : {}),
      ...(mentions.length || reps.length ? { mentions: [...mentions, ...reps] } : {}),
      inLanguage: "en-US",
    },
  );
}
