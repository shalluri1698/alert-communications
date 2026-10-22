import { heroFor } from "@/lib/hero";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ChevronDown, ShieldCheck, Star, Lock, ArrowRight, MapPin } from "lucide-react";
import { SITE_URL, abs } from "@/lib/site";
import { graph, webPage, serviceId, personNode, stateId, toolNodes, ORG_ID } from "@/lib/schema";
import { QuoteForm } from "@/components/quote-form";
import { Header, Footer, MobileCallBar, Testimonials, Integrations, CTA, TexturedMain, FinalCTA } from "@/components/home/sections";
import { serviceNav } from "@/data/service-nav";
import { useReveal } from "@/hooks/use-reveal";
import type { StateFanout } from "@/data/state-fanout";
import { team } from "@/data/service-team";
import { TeamSection } from "@/components/team-section";
import heroImg from "@/assets/services/callcenter.jpg.asset.json";
import i1 from "@/assets/services/night-agent.jpg.asset.json";
import i2 from "@/assets/services/woman-call.jpg.asset.json";
import i3 from "@/assets/services/attorneys.jpg.asset.json";
import i4 from "@/assets/services/team-headsets.jpg.asset.json";

type Block = { t: "p" | "h"; text: string } | { t: "ul"; items: { label: string; text: string }[] };
type Sec = { h2: string; blocks: Block[]; items?: { title: string; text: string }[]; cards?: { title: string; text: string }[] };
type StatePage = { name: string; h1: string; lead: string; heroBullets: { label: string; text: string }[]; sections: Sec[]; cta: { h2: string; text: string }; faqs: { q: string; a: Block[] }[] };

const txt = (b: Block[]) => b.map((x) => (x.t === "ul" ? x.items.map((i) => `${i.label ? i.label + ": " : ""}${i.text}`).join(" ") : x.text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"))).join(" ");

const STATES = import.meta.glob("/src/data/states/*.json", { import: "default" });

export const Route = createFileRoute("/service-area/$state")({
  loader: async ({ params }) => {
    const load = STATES[`/src/data/states/${params.state}.json`];
    if (!load) throw notFound();
    const { page, fan } = (await load()) as { page: StatePage; fan?: StateFanout };
    return { page, fan, state: params.state };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Page not found | Alert Communications" }, { name: "robots", content: "noindex" }] };
    const { page, fan } = loaderData;
    const title = `${page.name} Legal Answering & Intake Services | Alert Communications`;
    const desc = page.lead.length > 158 ? page.lead.slice(0, 155).replace(/\s\S*$/, "") + "..." : page.lead;
    const url = abs(`/service-area/${params.state}`);
    return {
      meta: [
        { title }, { name: "description", content: desc },
        { property: "og:title", content: title }, { property: "og:description", content: desc },
        { property: "og:type", content: "website" }, { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: txt(f.a) } })) }) }, stateGraph(params.state, page.name, title, fan)],
    };
  },
  notFoundComponent: StateNotFound,
  errorComponent: StateNotFound,
  component: StatePageView,
});

function StateNotFound() {
  return (
    <div className="font-body"><Header />
      <main className="mx-auto max-w-xl px-5 py-32 text-center">
        <h1 className="font-display text-3xl font-bold">Page not found</h1>
        <Link to="/service-area/" className="mt-6 inline-block font-bold text-brand">View our service area</Link>
      </main><Footer /></div>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        if (b.t === "ul") return (
          <ul key={i} className="grid gap-2">
            {b.items.map((it) => (
              <li key={it.label + it.text} className="flex gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span className="font-lato text-[14px] leading-snug">{it.label && <strong className="font-display font-bold">{it.label}: </strong>}<span className="text-muted-foreground">{it.text}</span></span>
              </li>
            ))}
          </ul>
        );
        if (b.t === "h") return <h3 key={i} className="pt-1 font-display text-lg font-bold md:text-xl">{b.text}</h3>;
        return <p key={i} className="font-lato text-[15px] leading-relaxed text-muted-foreground"><Inline text={b.text} /></p>;
      })}
    </div>
  );
}

const Eyebrow = ({ children }: { children: string }) => <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-brand">{children}</p>;
const CARD_LINKS = ["legal-call-answering", "legal-intake", "virtual-assistant-receptionists"];

function StatePageView() {
  const { page, fan, state } = Route.useLoaderData();
  useReveal(state);
  const [s0, s1, s2, s3, s4, s5] = page.sections;
  const imgs = [i1.url, i2.url, i3.url, i4.url];

  return (
    <div className="pb-20 font-body text-foreground md:pb-0">
      <Header />
      <main><TexturedMain>
        <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
          <img fetchPriority="high" {...heroFor(heroImg.url)} alt="" className="hero-zoom absolute inset-0 -z-10 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 py-14 md:py-20 lg:grid-cols-[1.35fr_1fr] lg:px-10">
            <div className="hero-rise">
              <span className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/25 bg-ink-foreground/10 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.2em]"><MapPin className="h-3.5 w-3.5 text-brand" />{fan?.heroEyebrow ?? `Service Area · ${page.name}`}</span>
              <h1 className="mt-5 max-w-3xl font-display text-[28px] font-bold leading-[1.12] drop-shadow md:text-[40px] lg:text-[44px]">{fan?.h1 ?? page.h1}</h1>
              <p className="mt-5 max-w-2xl font-lato text-[15px] leading-relaxed text-ink-foreground/80 md:text-[17px]">{fan?.lead ?? page.lead}</p>
              <ul className="mt-7 grid max-w-2xl gap-2.5 sm:grid-cols-2">
                {page.heroBullets.map((b) => (
                  <li key={b.label} className="flex items-start gap-3 rounded-xl border border-ink-foreground/10 bg-ink-foreground/[0.06] p-3.5 font-lato text-[14px] leading-snug backdrop-blur-sm">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-brand-deep"><CheckCircle2 className="h-3.5 w-3.5 text-brand-foreground" /></span>
                    <span><b className="font-semibold">{b.label}:</b> <span className="text-ink-foreground/75">{b.text}</span></span>
                  </li>
                ))}
              </ul>
              <div className="mt-8"><CTA href="tel:8442362485" sub="Call sales: 844-236-2485">Call For A Free Assessment</CTA></div>
              <div className="mt-8 grid max-w-2xl grid-cols-3 divide-x divide-ink-foreground/10 border-t border-ink-foreground/10 pt-6">
                {["100% Confidential", "Secure Client Portal", "4.9/5 Firm Rating"].map((b, i) => {
                  const I = i === 0 ? Lock : i === 1 ? ShieldCheck : Star;
                  return (
                    <div key={b} className="flex items-center gap-3 px-3 first:pl-0">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/15 ring-1 ring-brand/30"><I className={`h-4 w-4 text-brand ${i === 2 ? "fill-brand" : ""}`} /></span>
                      <span className="font-lato text-[13px] font-semibold leading-tight text-ink-foreground/85">{b}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <QuoteForm />
          </div>
        </section>

        {fan && (
          <section className="px-5 pt-14">
            <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/[0.07] via-background to-background p-6 shadow-sm md:p-8">
              <span className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand to-brand-deep" />
              <h2 className="font-display text-xl font-bold md:text-2xl">{fan.paa[0]?.q}</h2>
              <p className="mt-3 font-lato text-[16px] leading-relaxed">{fan.paa[0]?.a}</p>
            </div>
          </section>
        )}

        <Testimonials />

        {s0 && (
          <section className="px-5 py-20 md:py-24">
            <div className="mx-auto max-w-[1280px]">
              <div className="mx-auto max-w-3xl text-center">
                <Eyebrow>{`What We Handle in ${page.name}`}</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-[44px]">{s0.h2}</h2>
                <div className="mt-5"><Blocks blocks={s0.blocks} /></div>
              </div>
              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {(s0.cards ?? []).map((c, i) => (
                  <Link key={c.title} to="/services/$slug/" params={{ slug: CARD_LINKS[i] ?? "legal-call-answering" }} className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl shadow-lg">
                    <img src={imgs[i]} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/10" />
                    <div className="relative p-7 text-ink-foreground">
                      <span className="block h-1 w-10 bg-brand transition-all group-hover:w-16" />
                      <h3 className="mt-4 font-display text-2xl font-bold leading-tight">{c.title}</h3>
                      <p className="mt-3 font-lato text-[15px] leading-relaxed text-ink-foreground/85">{c.text}</p>
                      <span className="mt-4 inline-flex items-center gap-2 font-display text-sm font-bold text-brand-bright">Learn more <ArrowRight className="h-4 w-4" /></span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {[s1, s2].map((s, k) => s && (
          <section key={s.h2} className="px-5 py-20 md:py-24">
            <div className="mx-auto grid max-w-[1280px] items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
              <div className={k === 1 ? "lg:order-2" : ""}>
                <h2 className="font-display text-2xl font-bold leading-tight md:text-[32px]">{s.h2}</h2>
                <img src={imgs[(k + 1) % 4]} alt="" loading="lazy" className="mt-6 aspect-[4/3] w-full rounded-2xl object-cover shadow-xl lg:hidden" />
                <div className="mt-6"><Blocks blocks={s.blocks} /></div>
                <div className="mt-8"><CTA scrollTo="quote" sub="Free, no obligation. Fill out the form above." /></div>
              </div>
              <img src={imgs[(k + 1) % 4]} alt="" loading="lazy" className={`hidden h-full min-h-[520px] w-full rounded-2xl object-cover shadow-xl lg:block ${k === 1 ? "lg:order-1" : ""}`} />
            </div>
          </section>
        ))}

        {fan ? <StateFanoutSection f={fan} /> : s3 && (
          <section className="px-5 py-20 md:py-24">
            <div className="mx-auto max-w-[1280px]">
              <h2 className="font-display text-3xl font-bold leading-tight md:text-[44px]">{s3.h2}</h2>
              <div className="mt-5 max-w-3xl"><Blocks blocks={s3.blocks} /></div>
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {(s3.items ?? []).map((it, i) => (
                  <div key={it.title} className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-secondary to-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl md:p-8">
                    <span className="block font-display text-4xl font-extrabold text-brand md:text-5xl">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-5 font-display text-xl font-bold leading-tight md:text-2xl">{it.title}</h3>
                    <span className="mt-4 block h-0.5 w-10 bg-brand transition-all group-hover:w-16" />
                    <p className="mt-4 font-lato text-[15px] leading-relaxed text-muted-foreground">{it.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-center"><CTA scrollTo="quote" sub="Free, no obligation. Fill out the form above." /></div>
            </div>
          </section>
        )}

        {[s4, s5].map((s, k) => s && (
          <section key={s.h2} className="px-5 py-20 md:py-24">
            <div className="mx-auto grid max-w-[1280px] items-stretch gap-10 lg:grid-cols-2 lg:gap-14">
              <div className={k === 1 ? "lg:order-2" : ""}>
                <h2 className="font-display text-2xl font-bold leading-tight md:text-[32px]">{s.h2}</h2>
                <img src={imgs[(k + 3) % 4]} alt="" loading="lazy" className="mt-6 aspect-[4/3] w-full rounded-2xl object-cover shadow-xl lg:hidden" />
                <div className="mt-6"><Blocks blocks={s.blocks} /></div>
                <div className="mt-8"><CTA scrollTo="quote" sub="Free, no obligation. Fill out the form above." /></div>
              </div>
              <img src={imgs[(k + 3) % 4]} alt="" loading="lazy" className={`hidden h-full min-h-[520px] w-full rounded-2xl object-cover shadow-xl lg:block ${k === 1 ? "lg:order-1" : ""}`} />
            </div>
          </section>
        ))}

        <Integrations />

        {fan && <TeamSection t={fan.team} />}

        <FaqSection faqs={page.faqs} />

        <FinalCTA title="Stop Letting High-Intent Calls Reach Voicemail" text="Get a custom 24/7 legal intake plan built around your practice areas, qualification rules, calendar and case-management workflow." bullets={["Customized scripts, conflict checks and priority routing", "Live appointment booking, warm transfers and retainer support", "Bilingual coverage for nights, weekends and holidays"]} />

        <section className="border-t border-border px-5 py-16">
          <div className="mx-auto max-w-[1280px]">
            <h2 className="text-center font-display text-2xl font-bold md:text-3xl">Services Available in {page.name}</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {serviceNav.map((s) => (
                <Link key={s.slug} to="/services/$slug/" params={{ slug: s.slug }} className="group flex items-center gap-3 rounded-xl border border-border bg-background p-4 transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand"><s.icon className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1 font-display text-sm font-bold">{s.name}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-brand transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </TexturedMain></main>
      <Footer />
      <MobileCallBar />
    </div>
  );
}

function FaqSection({ faqs }: { faqs: { q: string; a: Block[] }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="px-5 py-20 md:py-24">
      <div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div>
          <Eyebrow>Got Questions?</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-[44px]">Frequently Asked Questions</h2>
          <div className="mt-8"><CTA scrollTo="quote" sub="Free, no obligation. Fill out the form above." /></div>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`overflow-hidden rounded-2xl border bg-background ${isOpen ? "border-brand/40 shadow-lg" : "border-border"}`}>
                <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6">
                  <span className="font-display text-[16px] font-bold leading-snug md:text-lg">{f.q}</span>
                  <ChevronDown className={`h-6 w-6 shrink-0 rounded-full p-1 transition-transform ${isOpen ? "rotate-180 bg-brand text-brand-foreground" : "bg-secondary text-brand"}`} />
                </button>
                {isOpen && <div className="border-t border-border px-5 pb-6 pt-4 md:px-6"><Blocks blocks={f.a} /></div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StateFanoutSection({ f }: { f: StateFanout }) {
  return (
    <section className="px-5 py-20 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <Eyebrow>{f.eyebrow}</Eyebrow>
        <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-[44px]">{f.h2}</h2>
        <p className="mt-5 max-w-3xl font-lato text-[16px] leading-relaxed text-muted-foreground">{f.intro}</p>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-background shadow-lg">
          <table className="rtable w-full min-w-[1040px] border-collapse text-left">
            <thead>
              <tr className="bg-ink text-ink-foreground">
                {[...f.columns, "Your Alert specialist"].map((c) => <th key={c} scope="col" className="border-b-2 border-brand px-5 py-4 font-display text-xs font-bold uppercase tracking-[0.15em]">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {f.rows.map(([a, b, c], i) => {
                const h = f.help[i]; const m = h ? team[h[0]] : undefined;
                return (
                  <tr key={a} className="border-b border-border last:border-0 odd:bg-secondary/50 hover:bg-brand/[0.05]">
                    <th scope="row" className="w-[22%] px-5 py-4 align-top font-display text-[15px] font-bold"><span className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{a}</span></th>
                    <td data-label={([...f.columns, "Your Alert specialist"])[1]} className="px-5 py-4 align-top font-lato text-[15px] leading-relaxed">
                      {b}
                      {f.tools[i] && <span className="mt-2 flex flex-wrap gap-1.5">{f.tools[i].map((t) => <span key={t} className="rounded-md border border-brand/20 bg-brand/[0.06] px-2 py-0.5 font-display text-[11px] font-bold text-brand-deep">{t}</span>)}</span>}
                    </td>
                    <td data-label={([...f.columns, "Your Alert specialist"])[2]} className="px-5 py-4 align-top font-lato text-[15px] leading-relaxed text-muted-foreground">{c}</td>
                    <td data-label={([...f.columns, "Your Alert specialist"])[3]} className="w-[22%] px-5 py-4 align-top">
                      {m && h && <span className="flex gap-3"><img src={m.photo} alt={m.name} loading="lazy" width={36} height={36} className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-brand/20" /><span className="font-lato text-[14px] leading-snug"><b className="block font-display text-[13px]">{m.name.split(" ")[0]}</b>{h[1]}</span></span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-display text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Works with</span>
          {f.ecosystem.map((e) => <span key={e} className="rounded-full bg-ink px-3 py-1 font-display text-[12px] font-bold text-ink-foreground">{e}</span>)}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {f.proof.map((p) => <span key={p} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 font-display text-[13px] font-bold shadow-sm"><ShieldCheck className="h-4 w-4 text-brand" />{p}</span>)}
        </div>
        <p className="mt-8 max-w-4xl font-lato text-[16px] leading-relaxed text-muted-foreground">
          {f.crossLinks.map((c, i) => typeof c === "string" ? <span key={i}>{c}</span> : "state" in c ? <Link key={i} to="/service-area/$state/" params={{ state: c.state }} className={linkCls}>{c.text}</Link> : <Link key={i} to="/services/$slug/" params={{ slug: c.slug }} className={linkCls}>{c.text}</Link>)}
        </p>
      </div>
    </section>
  );
}

const linkCls = "font-semibold text-brand underline underline-offset-2 hover:text-brand-deep";
/** Renders [anchor](/services/slug) and [anchor](/service-area/state) inside paragraph text as in-body links. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\(\/[a-z-]+\/[a-z-]+\))/);
  return <>{parts.map((p, i) => {
    const m = p.match(/^\[([^\]]+)\]\(\/(services|service-area)\/([a-z-]+)\)$/);
    if (!m) return p;
    return m[2] === "services"
      ? <Link key={i} to="/services/$slug/" params={{ slug: m[3]! }} className={linkCls}>{m[1]}</Link>
      : <Link key={i} to="/service-area/$state/" params={{ state: m[3]! }} className={linkCls}>{m[1]}</Link>;
  })}</>;
}

/** Entity graph for a state page: the State place, a state-scoped Service tied to the national hubs, and the WebPage. */
function stateGraph(slug: string, name: string, title: string, fan?: StateFanout) {
  const path = `/service-area/${slug}`;
  const links = fan?.crossLinks ?? [];
  const hubs = [...new Set(["legal-call-answering", "legal-intake", ...links.flatMap((c) => (typeof c === "object" && "slug" in c ? [c.slug] : []))])];
  const near = links.flatMap((c) => (typeof c === "object" && "state" in c ? [{ "@id": stateId(c.state) }] : []));
  const svcId = `${SITE_URL}${path}#service`;
  return graph(
    { "@type": "State", "@id": stateId(slug), name, containedInPlace: { "@type": "Country", name: "United States" } },
    { "@type": "Service", "@id": svcId, name: `Legal answering and intake services in ${name}`, serviceType: "Legal call answering and intake", provider: { "@id": ORG_ID }, areaServed: { "@id": stateId(slug) }, availableLanguage: ["English", "Spanish"], audience: { "@type": "BusinessAudience", audienceType: `${name} law firms` }, isRelatedTo: hubs.map((h) => ({ "@id": serviceId(h) })) },
    webPage(path, title, { about: [{ "@id": svcId }, { "@id": stateId(slug) }], mainEntity: { "@id": svcId }, mentions: [...hubs.map((h) => ({ "@id": serviceId(h) })), ...near, ...toolNodes()], ...(fan ? { author: fan.team.people.map((p) => personNode(p.id, team[p.id].photo)) } : {}) }),
  );
}
