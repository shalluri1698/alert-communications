import { HERO } from "@/lib/hero";
import { SITE_URL, abs } from "@/lib/site";
import { graph, pageNode } from "@/lib/schema";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, ArrowRight, Phone, MapPin, Quote, Clock, PhoneCall } from "lucide-react";
import { Header, Footer, MobileCallBar, Testimonials, Integrations, CTA, TexturedMain, FinalCTA } from "@/components/home/sections";
import { QuoteForm } from "@/components/quote-form";
import { aboutNav } from "@/data/site-nav";
import { useReveal } from "@/hooks/use-reveal";
import raw from "@/data/pages.json";

type Item = { title?: string; text?: string; image?: string | null; kicker?: string; lead?: string; href?: string; more?: string; bullets?: string[]; name?: string | null; q?: string; a?: string };
type Sec = { type: string; eyebrow?: string; h2?: string; h3?: string; sub?: string; paras?: string[]; bullets?: string[]; after?: string; items?: (Item | string)[]; video?: string; src?: string; text?: string; by?: string; link?: { label: string; href: string } };
export type PageData = {
  title: string; desc: string;
  hero: { eyebrow?: string; h1: string; accent?: string; lead: string; lead2?: string; note?: string; apply?: boolean; image?: string; left?: boolean };
  sections: Sec[]; form?: boolean; contact?: boolean; support?: boolean; cta?: boolean;
};
const pages = (raw as unknown as { pages: Record<string, PageData> }).pages;
export const getPage = (key: string) => pages[key]!;

export function pageHead(key: string, path: string) {
  const p = getPage(key);
  const faq = p.sections.find((s) => s.type === "faq");
  return {
    meta: [
      { title: p.title }, { name: "description", content: p.desc },
      { property: "og:title", content: p.title }, { property: "og:description", content: p.desc },
      { property: "og:type", content: "website" }, { property: "og:url", content: abs(path) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: abs(path) }],
    scripts: [graph(pageNode(path, p.title)), ...(faq ? [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: (faq.items as Item[]).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }] : [])],
  };
}

const Eyebrow = ({ children }: { children?: string | undefined }) => children ? <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-brand">{children}</p> : null;
const H2 = ({ children, center = false }: { children?: string | undefined; center?: boolean }) => children ? <h2 className={`mt-3 font-display text-3xl font-bold leading-tight md:text-[42px] ${center ? "text-center" : ""}`}>{children}</h2> : null;
const Head = ({ s }: { s: Sec }) => (
  <div className="mx-auto max-w-3xl text-center">
    <Eyebrow>{s.eyebrow}</Eyebrow><H2>{s.h2}</H2>
    {s.sub && <p className="mt-4 font-lato text-[16px] leading-relaxed text-muted-foreground">{s.sub}</p>}
  </div>
);
const Wrap = ({ children }: { children: React.ReactNode }) => <section className="px-5 py-16 md:py-24"><div className="mx-auto max-w-[1200px]">{children}</div></section>;
const Checks = ({ items }: { items: string[] }) => (
  <ul className="grid gap-3">
    {items.map((b) => {
      const [l, ...r] = b.split(": ");
      return <li key={b} className="flex gap-3 rounded-xl border border-border bg-background p-4 shadow-sm"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" /><span className="font-lato text-[15px] leading-relaxed">{r.length ? <><strong className="font-display font-bold">{l}: </strong><span className="text-muted-foreground">{r.join(": ")}</span></> : <span className="text-muted-foreground">{b}</span>}</span></li>;
    })}
  </ul>
);

function CountUp({ value }: { value: string }) {
  const m = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const target = m ? Number(m[2]!.replace(/,/g, "")) : 0;
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el || !m) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(target); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return; io.disconnect();
      const t0 = performance.now(), dur = 1800;
      const tick = (t: number) => { const k = Math.min((t - t0) / dur, 1); setN(Math.round(target * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, [target]);
  if (!m) return <span>{value}</span>;
  return <span ref={ref} className="tabular-nums">{m[1]}{n.toLocaleString("en-US")}{m[3]}</span>;
}

function Faq({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-4xl space-y-3">
      {items.map((f, i) => {
        const o = open === i;
        return (
          <div key={f.q} className={`overflow-hidden rounded-2xl border bg-background transition-shadow ${o ? "border-brand/40 shadow-lg" : "border-border"}`}>
            <button type="button" onClick={() => setOpen(o ? null : i)} aria-expanded={o} className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6">
              <span className="font-display text-[16px] font-bold leading-snug md:text-lg">{f.q}</span>
              <ChevronDown className={`h-6 w-6 shrink-0 rounded-full p-1 transition-transform ${o ? "rotate-180 bg-brand text-brand-foreground" : "bg-secondary text-brand"}`} />
            </button>
            {o && <div className="border-t border-border px-5 pb-6 pt-4 font-lato leading-relaxed text-muted-foreground md:px-6">{f.a}</div>}
          </div>
        );
      })}
    </div>
  );
}

function Section({ s }: { s: Sec }) {
  const items = (s.items ?? []) as Item[];
  switch (s.type) {
    case "logos": return <div>{s.h2 && <div className="px-5 pt-16 md:pt-20"><Head s={s} /></div>}<Integrations /></div>;
    case "reviews": return <Testimonials />;
    case "cards": return (
      <Wrap><Head s={s} />
        <div className={`mt-12 grid gap-6 ${items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
          {items.map((c, i) => (
            <div key={c.title} className="group relative overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/[0.07] via-background to-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand to-brand-deep" />
              {c.image ? <img src={c.image} alt="" loading="lazy" className="h-14 w-14 object-contain" /> : <span className="font-display text-4xl font-extrabold text-brand">{String(i + 1).padStart(2, "0")}</span>}
              <h3 className="mt-5 font-display text-xl font-bold">{c.title}</h3>
              <span className="mt-3 block h-0.5 w-10 bg-brand transition-all group-hover:w-16" />
              <p className="mt-3 font-lato text-[15px] leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </Wrap>
    );
    case "stats": return (
      <section className="border-b border-border bg-background/80 px-5 py-8 backdrop-blur">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((it) => (
            <div key={it.text} className="text-center">
              <p className="font-display text-3xl font-extrabold text-brand md:text-[42px]"><CountUp value={it.title ?? ""} /></p>
              <p className="mt-1 font-lato text-[15px] text-muted-foreground md:text-base">{it.text}</p>
            </div>
          ))}
        </div>
      </section>
    );
    case "photoCards": return (
      <Wrap><Head s={s} />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {items.map((c) => (
            <div key={c.title} className="group overflow-hidden rounded-2xl border border-border bg-background shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[16/9] overflow-hidden"><img src={c.image ?? ""} alt={c.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
              <div className="border-t-2 border-brand px-7 py-8 text-center">
                <h3 className="font-display text-2xl font-bold md:text-[28px]">{c.title}</h3>
                <p className="mx-auto mt-3 max-w-md font-lato text-[15px] leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    );
    case "checklist": return (
      <Wrap><Head s={s} />
        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2">
          {(s.items as string[]).map((c) => <li key={c} className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3.5 font-lato text-[15px] font-semibold shadow-sm transition hover:border-brand/50"><CheckCircle2 className="h-5 w-5 shrink-0 text-brand" />{c}</li>)}
        </ul>
      </Wrap>
    );
    case "zigzag": return (
      <Wrap><Head s={s} />
        <div className="mt-12 space-y-16 md:space-y-24">
          {items.map((it, i) => (
            <div key={it.title} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
              <div className={`overflow-hidden rounded-3xl shadow-xl ${i % 2 ? "lg:order-2" : ""}`}><img src={it.image ?? ""} alt={it.title} loading="lazy" className="aspect-[4/3] h-full w-full object-cover" /></div>
              <div>
                <Eyebrow>{it.kicker}</Eyebrow>
                <h3 className="mt-3 font-display text-3xl font-bold uppercase leading-tight md:text-4xl">{it.title}</h3>
                {it.lead && <p className="mt-5 border-l-2 border-brand pl-4 font-display text-[17px] font-semibold">{it.lead}</p>}
                <p className="mt-4 font-lato text-[15px] leading-relaxed text-muted-foreground">{it.text}</p>
                {it.href && <a href={it.href} className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-deep px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-brand-foreground shadow-lg shadow-brand/25 transition hover:-translate-y-0.5">Learn More <ArrowRight className="h-4 w-4" /></a>}
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    );
    case "chips": return (
      <Wrap><Head s={s} />
        <div className="mt-10 flex flex-wrap justify-center gap-2.5">
          {(s.items as string[]).map((c) => <span key={c} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 font-lato text-[15px] font-semibold shadow-sm transition hover:border-brand hover:text-brand"><CheckCircle2 className="h-4 w-4 text-brand" />{c}</span>)}
        </div>
      </Wrap>
    );
    case "steps": return (
      <Wrap><Head s={s} />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <div key={it.title} className="group relative flex flex-col rounded-2xl border border-border bg-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl md:p-8">
              <div className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep font-display text-lg font-extrabold text-brand-foreground shadow-md shadow-brand/30">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0">{it.kicker && <p className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-brand">{it.kicker}</p>}<h3 className="font-display text-xl font-bold leading-tight md:text-2xl">{it.title}</h3></div>
              </div>
              {it.lead && <p className="mt-5 border-l-2 border-brand pl-4 font-display font-semibold">{it.lead}</p>}
              <p className="mt-4 font-lato text-[15px] leading-relaxed text-muted-foreground">{it.text}</p>
              {it.more && <p className="mt-3 font-lato text-[15px] leading-relaxed text-muted-foreground">{it.more}</p>}
              {it.bullets && <div className="mt-5"><Checks items={it.bullets} /></div>}
              {it.href && <a href={it.href} className="mt-6 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-brand">Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>}
            </div>
          ))}
        </div>
      </Wrap>
    );
    case "text": return (
      <Wrap>
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{s.eyebrow}</Eyebrow><H2>{s.h2}</H2>
          <div className="mt-5 space-y-4">{s.paras?.map((p) => <p key={p} className="font-lato text-[16px] leading-relaxed text-muted-foreground">{p}</p>)}</div>
          {s.link && <a href={s.link.href} className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-deep px-7 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-brand-foreground shadow-lg shadow-brand/25">{s.link.label} <ArrowRight className="h-4 w-4" /></a>}
        </div>
      </Wrap>
    );
    case "split": return (
      <Wrap>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div><Eyebrow>{s.eyebrow}</Eyebrow><H2>{s.h2}</H2>
            <div className="mt-5 space-y-4">{s.paras?.map((p) => <p key={p} className="font-lato text-[16px] leading-relaxed text-muted-foreground">{p}</p>)}</div>
          </div>
          <div>{s.h3 && <h3 className="font-display text-xl font-bold md:text-2xl">{s.h3}</h3>}<div className="mt-5">{s.bullets && <Checks items={s.bullets} />}</div>
            {s.after && <p className="mt-5 font-lato text-[15px] leading-relaxed text-muted-foreground">{s.after}</p>}
          </div>
        </div>
      </Wrap>
    );
    case "video": return (
      <Wrap>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div><Eyebrow>{s.eyebrow}</Eyebrow><H2>{s.h2}</H2>
            <div className="mt-5 space-y-4">{s.paras?.map((p) => <p key={p} className="font-lato text-[16px] leading-relaxed text-muted-foreground">{p}</p>)}</div>
            <div className="mt-8"><CTA /></div>
          </div>
          <div className="aspect-video overflow-hidden rounded-2xl shadow-2xl ring-1 ring-border"><iframe src={s.video} title={s.h2} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen /></div>
        </div>
      </Wrap>
    );
    case "links": return (
      <Wrap><Head s={s} />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {aboutNav.filter((l) => l.href !== "/about").map((l) => (
            <a key={l.href} href={l.href} className="group flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand"><l.icon className="h-5 w-5" /></span>
              <span className="min-w-0 flex-1 font-display text-sm font-bold">{l.name}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-brand transition-transform group-hover:translate-x-1" />
            </a>
          ))}
        </div>
      </Wrap>
    );
    case "quote": return (
      <section className="px-5 py-16 md:py-20">
        <figure className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-ink to-brand-deep px-8 py-12 text-center text-ink-foreground shadow-2xl md:px-16 md:py-16">
          <Quote className="mx-auto h-10 w-10 text-brand" />
          <blockquote className="mt-6 font-display text-2xl font-bold leading-snug md:text-[32px]">{s.text}</blockquote>
          <figcaption className="mt-6 font-lato text-sm uppercase tracking-[0.2em] text-ink-foreground/75">{s.by}</figcaption>
        </figure>
      </section>
    );
    case "partners": return (
      <Wrap><Head s={s} />
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((l, i) => (
            <div key={i} className="grid h-24 place-items-center rounded-2xl border border-border bg-background p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <img src={l.image ?? undefined} alt={l.title ?? "Partner law firm"} loading="lazy" className="max-h-14 w-auto object-contain" />
            </div>
          ))}
        </div>
      </Wrap>
    );
    case "quotes": return (
      <Wrap>
        <div className="columns-1 gap-6 md:columns-2 lg:columns-3 [&>*]:mb-6">
          {items.map((q) => (
            <figure key={q.text} className="relative break-inside-avoid overflow-hidden rounded-2xl bg-gradient-to-b from-ink to-brand-deep p-7 text-ink-foreground shadow-xl transition hover:-translate-y-1">
              <Quote className="absolute -right-2 -top-2 h-24 w-24 text-ink-foreground/5" />
              <div className="flex gap-0.5 text-star">{"★★★★★"}</div>
              <figcaption className="mt-3 font-display text-lg font-bold">{q.name}</figcaption>
              <blockquote className="mt-3 font-lato text-[15px] italic leading-relaxed text-ink-foreground/85">“{q.text}”</blockquote>
            </figure>
          ))}

        </div>
      </Wrap>
    );
    case "faq": return <Wrap><Faq items={items} /></Wrap>;
    case "posts": return (
      <Wrap>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <article key={p.title} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-[16/10] overflow-hidden bg-secondary">{p.image && <img src={p.image} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}</div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold leading-snug">{p.title}</h3>
                <span className="mt-3 block h-0.5 w-10 bg-brand transition-all group-hover:w-16" />
                {p.text && <p className="mt-3 line-clamp-4 flex-1 font-lato text-[15px] leading-relaxed text-muted-foreground">{p.text}</p>}
              </div>
            </article>
          ))}
        </div>
      </Wrap>
    );
    case "tour": return (
      <Wrap><Head s={s} />
        <div className="mt-10 aspect-video overflow-hidden rounded-3xl shadow-2xl ring-1 ring-border"><iframe src={s.src} title="Virtual tour" className="h-full w-full" allowFullScreen /></div>
      </Wrap>
    );
    case "gallery": return (
      <Wrap><Head s={s} />
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {(s.items as string[]).map((src) => <img key={src} src={src} alt="Alert Communications call center" loading="lazy" className="w-full break-inside-avoid rounded-2xl object-cover shadow-md transition-transform duration-500 hover:scale-[1.02]" />)}
        </div>
      </Wrap>
    );
    default: return null;
  }
}

function ContactCards({ support }: { support?: boolean }) {
  const rows = [
    { icon: PhoneCall, label: "Sales", value: "805-516-7409", href: "tel:805-516-7409" },
    { icon: Phone, label: "Customer Service", value: "805-477-2120", href: "tel:805-477-2120" },
    { icon: MapPin, label: "Office", value: "3601 Calle Tecate STE 200, Camarillo, CA 93012" },
    { icon: Clock, label: "Response time", value: support ? "Within 2 business days" : "Same day during business hours" },
  ];
  return (
    <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
      {rows.map((r) => {
        const inner = <><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/15 ring-1 ring-brand/30"><r.icon className="h-4 w-4 text-brand" /></span><span className="min-w-0"><span className="block font-display text-[11px] font-bold uppercase tracking-[0.2em] text-ink-foreground/60">{r.label}</span><span className="block font-lato text-[15px] font-semibold leading-snug">{r.value}</span></span></>;
        const cls = "flex items-center gap-3 rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.06] p-4 backdrop-blur-sm";
        return r.href ? <a key={r.label} href={r.href} className={`${cls} transition hover:border-brand/50`}>{inner}</a> : <div key={r.label} className={cls}>{inner}</div>;
      })}
    </div>
  );
}

export function ContentPage({ pageKey }: { pageKey: string }) {
  const p = getPage(pageKey);
  useReveal(pageKey);
  const h = p.hero;
  return (
    <div className="pb-20 font-body text-foreground md:pb-0">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
          <img fetchPriority="high" src={h.image ?? HERO.src} srcSet={h.image ? undefined : HERO.srcSet} sizes={HERO.sizes} alt="" className="hero-zoom absolute inset-0 -z-10 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/50" />
          <div className={`mx-auto grid max-w-[1280px] items-center gap-10 px-5 lg:px-10 ${h.image ? "min-h-[460px] py-16 md:min-h-[560px] md:py-24" : "py-14 md:py-20"} ${p.form ? "lg:grid-cols-[1.25fr_1fr]" : ""}`}>
            <div className={`hero-rise ${p.form || h.left ? "max-w-3xl" : "mx-auto max-w-3xl text-center"}`}>
              {h.eyebrow && <span className="inline-flex items-center rounded-full border border-brand/50 bg-brand/10 px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-[0.25em]">{h.eyebrow}</span>}
              <h1 className={`mt-5 font-display text-[30px] font-bold leading-[1.08] ${h.accent ? "uppercase" : ""} drop-shadow md:text-[44px] lg:text-[54px]`}>{h.h1}{h.accent && <span className="block text-brand">{h.accent}</span>}</h1>
              <p className={`mt-5 font-lato text-[16px] leading-relaxed text-ink-foreground/80 md:text-[17px] ${p.form || h.left ? "max-w-2xl" : "mx-auto max-w-2xl"}`}>{h.lead}</p>
              {h.lead2 && <p className={`mt-4 font-lato text-[15px] leading-relaxed text-ink-foreground/70 ${p.form || h.left ? "max-w-2xl" : "mx-auto max-w-2xl"}`}>{h.lead2}</p>}
              {p.contact && <ContactCards support={!!p.support} />}
              {h.note && <p className="mt-6 font-lato text-xs font-semibold uppercase tracking-wider text-ink-foreground/60">{h.note}</p>}
              {!p.contact && <div className={`mt-8 ${p.form || h.left ? "" : "flex justify-center"}`}><span className="hidden md:inline-flex"><CTA href="/contact/" sub="Contact us. Free, no obligation.">Get Your Free Assessment</CTA></span><span className="md:hidden"><CTA href="tel:8442362485" sub="Call sales: 844-236-2485">Call For A Free Assessment</CTA></span></div>}
            </div>
            {p.form && (h.apply ? <QuoteForm eyebrow="Join our team" title={<>Apply <span className="font-extrabold">Now</span></>} button="Submit Application" /> : <QuoteForm />)}
          </div>
        </section>
        <TexturedMain>
          {p.sections.map((s, i) => <Section key={i} s={s} />)}
        </TexturedMain>
        {p.cta && <FinalCTA />}
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
}


