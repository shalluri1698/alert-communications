import { heroFor } from "@/lib/hero";
import { SITE_URL, abs } from "@/lib/site";
import { graph, webPage, serviceId, personNode, toolNodes, ORG_ID } from "@/lib/schema";
import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, ChevronDown, ShieldCheck, Star, Lock, ArrowRight, User, Mail, Building2, Phone, MessageSquare, Clock } from "lucide-react";
import { QuoteForm } from "@/components/quote-form";
import { Header, Footer, MobileCallBar, Testimonials, Integrations, CTA, TexturedMain, FinalCTA } from "@/components/home/sections";

import type { Block, Section } from "@/data/services";
import { serviceNav } from "@/data/service-nav";
import { serviceFanout, type Fanout } from "@/data/service-fanout";
import { serviceTeam, team } from "@/data/service-team";
import { TeamSection } from "@/components/team-section";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const { getServicePage, blockText } = await import("@/data/services");
    const page = getServicePage(params.slug);
    const nav = serviceNav.find((s) => s.slug === params.slug);
    if (!page || !nav) throw notFound();
    return { page, slug: params.slug, faqLd: page.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: blockText(f.a) } })) };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Service not found | Alert Communications" }, { name: "robots", content: "noindex" }] };
    const { page } = loaderData;
    return {
      meta: [
        { title: page.seoTitle },
        { name: "description", content: page.seoDescription },
        { property: "og:title", content: page.seoTitle },
        { property: "og:description", content: page.seoDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: abs(`/services/${params.slug}`) },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: abs(`/services/${params.slug}`) }, ...(() => { const n = serviceNav.find((x) => x.slug === params.slug); const h = n ? heroFor(n.image) : null; return h?.srcSet ? [{ rel: "preload", as: "image", href: h.src, imagesrcset: h.srcSet, imagesizes: h.sizes, fetchpriority: "high" }] : []; })()],
      scripts: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: loaderData.faqLd,
        }),
      }, graph(webPage(`/services/${params.slug}`, page.seoTitle, {
        about: { "@id": serviceId(params.slug) },
        mainEntity: { "@id": serviceId(params.slug) },
        mentions: [...toolNodes(), { "@id": ORG_ID }],
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#tldr h2", "#tldr p"] },
        ...(serviceTeam[params.slug] ? { author: serviceTeam[params.slug]!.people.map((p) => personNode(p.id, team[p.id].photo)) } : {}),
      }))],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServicePageView,
});

function ServiceNotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-5 text-center">
      <div>
        <h1 className="font-display text-4xl font-bold">Service not found</h1>
        <Link to="/" className="mt-6 inline-block font-display font-bold text-brand">Back to home</Link>
      </div>
    </div>
  );
}

function Blocks({ blocks, dark = false }: { blocks: Block[]; dark?: boolean }) {
  const muted = dark ? "text-ink-foreground/80" : "text-muted-foreground";
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        if (b.t === "ul") return (
          <ul key={i} className="grid gap-2.5">
            {b.items.map((it) => (
              <li key={it.label + it.text} className={`flex gap-3 rounded-xl border px-4 py-3 ${dark ? "border-ink-foreground/15 bg-ink-foreground/[0.06]" : "border-border bg-background shadow-sm"}`}>
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span className="font-lato text-[14px] leading-relaxed">{it.label && <strong className="font-display font-bold">{it.label}: </strong>}<span className={muted}>{it.text}</span></span>
              </li>
            ))}
          </ul>
        );
        if (b.t === "h") return <h3 key={i} className="pt-1 font-display text-lg font-bold md:text-xl">{b.text}</h3>;
        if (b.t === "lead") return <p key={i} className="border-l-2 border-brand pl-4 font-display font-semibold leading-relaxed">{b.text}</p>;
        return <p key={i} className={`font-lato text-[15px] leading-relaxed ${muted}`}>{b.text}</p>;
      })}
    </div>
  );
}

const Eyebrow = ({ children, light = false }: { children: string; light?: boolean }) => (
  <p className={`font-display text-xs font-bold uppercase tracking-[0.25em] ${light ? "text-brand-foreground/80" : "text-brand"}`}>{children}</p>
);

const STARTER = ["legal-call-answering", "legal-intake", "virtual-assistant-receptionists"];

function StarterPlan() {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-ink to-brand-deep p-px shadow-xl shadow-ink/20">
      <div className="grid gap-5 rounded-2xl bg-ink/95 p-6 text-ink-foreground sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <div className="min-w-0">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Campaign · Alert Go</p>
          <p className="mt-2 font-display"><span className="text-xs text-ink-foreground/60">Starting at </span><span className="text-4xl font-extrabold">$2.50</span><span className="text-sm text-ink-foreground/60">/min</span></p>
          <p className="mt-1 font-lato text-sm text-ink-foreground/75">$100/retainer · Pay as you go · No monthly minimum</p>
        </div>
        <Link to="/plans/" className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-brand-deep px-6 py-3.5 font-display text-sm font-bold uppercase tracking-wide text-brand-foreground shadow-lg shadow-brand/30 transition hover:-translate-y-0.5">View All Plans <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
      </div>
    </div>
  );
}

function ServicePageView() {
  const { page, slug } = Route.useLoaderData();
  const nav = serviceNav.find((s) => s.slug === slug)!;
  useReveal(slug);
  const [s0, s1, s2, s3, s4, s5] = page.sections as (Section | undefined)[];
  const img = (i: number) => nav.gallery[i % nav.gallery.length];

  return (
    <div className="pb-20 font-body text-foreground md:pb-0">
      <Header />
      <main><TexturedMain>
        {/* Hero */}
        <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
          <img fetchPriority="high" {...heroFor(nav.image)} alt="" className="hero-zoom absolute inset-0 -z-10 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
          <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 py-14 md:py-20 lg:grid-cols-[1.35fr_1fr] lg:px-10">
          <div className="hero-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-foreground/25 bg-ink-foreground/10 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.2em]"><nav.icon className="h-3.5 w-3.5 text-brand" />{nav.name}</span>
            <h1 className="mt-5 max-w-3xl font-display text-[28px] font-bold leading-[1.12] drop-shadow md:text-[40px] lg:text-[44px]">{page.h1}</h1>
            <p className="mt-5 max-w-2xl font-lato text-[15px] leading-relaxed text-ink-foreground/80 md:text-[17px]">{page.lead}</p>
            <div className="mt-8"><CTA href="tel:8442362485" sub="Call sales: 844-236-2485">Call For A Free Assessment</CTA></div>
            <div className="mt-8 grid max-w-2xl grid-cols-3 divide-x divide-ink-foreground/10 border-t border-ink-foreground/10 pt-6">
              {page.badges.map((b, i) => {
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

        {serviceFanout[slug] && (
          <section className="bg-secondary px-5 py-14 md:py-16" aria-labelledby="tldr-heading">
            <aside id="tldr" className="tldr-summary mx-auto max-w-[920px] rounded-2xl border border-border border-l-4 border-l-brand bg-background p-7 shadow-lg md:p-9">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand px-3 py-1 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground">TL;DR</span>
                <span className="font-display text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Quick answer</span>
              </div>
              <h2 id="tldr-heading" className="mt-4 font-display text-[22px] font-bold leading-tight md:text-[26px]">{serviceFanout[slug].definitionTerm}</h2>
              <p className="mt-3 font-lato text-[16px] leading-relaxed text-foreground/80 md:text-[17px]">{serviceFanout[slug].definition}</p>
            </aside>
          </section>
        )}

        <Testimonials />

        {/* S0: intro + 6 cards */}
        {s0 && (
          <section className="px-5 py-20 md:py-24">
            <div className="mx-auto max-w-[1280px]">
              <div className="mx-auto max-w-3xl text-center">
                <Eyebrow>What We Handle</Eyebrow>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-[44px]">{s0.h2}</h2>
                <div className="mt-5"><Blocks blocks={s0.blocks} /></div>
              </div>
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {s0.cards.map((c, i) => (
                  <div key={c.title} className="group relative overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/[0.07] via-background to-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10">
                    <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand to-brand-deep" />
                    <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-brand/10 transition-colors group-hover:text-brand/20">{String(i + 1).padStart(2, "0")}</span>
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-deep text-brand-foreground shadow-md shadow-brand/25"><nav.icon className="h-5 w-5" /></span>
                    <h3 className="mt-5 font-display text-lg font-bold">{c.title}</h3>
                    <span className="mt-3 block h-0.5 w-10 bg-brand transition-all group-hover:w-16" />
                    <p className="mt-3 font-lato text-[15px] leading-relaxed text-muted-foreground">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* S1: centered intro + image overlay cards */}
        {s1 && (
          <section className="px-5 py-20 md:py-24">
            <div className="mx-auto max-w-[1280px]">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-display text-3xl font-bold leading-tight md:text-[44px]">{s1.h2}</h2>
                <div className="mt-5"><Blocks blocks={s1.blocks} /></div>
              </div>
              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {s1.items.filter((it) => it.text).map((it, i) => (
                  <div key={it.title} className="group relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-2xl shadow-lg">
                    <img src={img(i)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/10" />
                    <div className="relative p-7 text-ink-foreground">
                      <span className="block h-1 w-10 bg-brand transition-all group-hover:w-16" />
                      <h3 className="mt-4 font-display text-2xl font-bold leading-tight">{it.title}</h3>
                      <p className="mt-3 font-lato text-[15px] leading-relaxed text-ink-foreground/85">{it.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* S2: image left with check badges, text right */}
        {s2 && (
          <section className="px-5 py-20 md:py-24">
            <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12">
              <h2 className="font-display text-[26px] font-bold leading-tight md:text-[32px] lg:hidden">{s2.h2}</h2>
              <div className="relative lg:min-h-[420px] lg:pb-14">
                <img src={img(3)} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl lg:absolute lg:inset-x-0 lg:top-0 lg:bottom-14 lg:aspect-auto lg:h-[calc(100%-3.5rem)]" />
                {s1?.items.some((it) => !it.text) && (
                  <div className="-mt-10 grid gap-3 px-3 sm:grid-cols-2 lg:absolute lg:inset-x-3 lg:bottom-0 lg:mt-0 lg:px-0">
                    {s1.items.filter((it) => !it.text).map((it) => (
                      <div key={it.title} className="relative flex items-center gap-3 rounded-2xl border border-border bg-background p-4 shadow-lg">
                        <CheckCircle2 className="h-9 w-9 shrink-0 fill-brand text-background" /><span className="font-display font-bold leading-snug">{it.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="lg:self-center">
                <h2 className="hidden font-display text-[26px] font-bold leading-tight md:text-[32px] lg:block">{s2.h2}</h2>
                <div className="mt-5"><Blocks blocks={s2.blocks} /></div>
                {STARTER.includes(slug) ? <StarterPlan /> : <div className="mt-8"><CTA scrollTo="quote" sub="Free, no obligation. Fill out the form above." /></div>}
              </div>
            </div>
          </section>
        )}

        {/* S3: fan-out table (selected pages) or numbered cards */}
        {serviceFanout[slug] ? <FanoutSection f={serviceFanout[slug]} /> : s3 && (
          <section className="px-5 py-20 md:py-24">
            <div className="mx-auto max-w-[1280px]">
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
                <div>
                  <h2 className="font-display text-3xl font-bold leading-tight md:text-[44px]">{s3.h2}</h2>
                  <div className="mt-5 max-w-3xl"><Blocks blocks={s3.blocks} /></div>
                </div>
                <a href="#quote" className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-gradient-to-r from-brand to-brand-deep px-7 py-4 font-display text-[15px] font-bold uppercase tracking-wide text-brand-foreground shadow-lg shadow-brand/25 transition-transform hover:-translate-y-0.5 lg:self-center">
                  Get Your Quote <ArrowRight className="h-5 w-5" />
                </a>
              </div>
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {s3.items.map((it, i) => (
                  <div key={it.title} className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-secondary to-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl md:p-8">
                    <span className="block font-display text-4xl font-extrabold text-brand md:text-5xl">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-5 font-display text-xl font-bold leading-tight md:text-2xl">{it.title}</h3>
                    <span className="mt-4 block h-0.5 w-10 bg-brand transition-all group-hover:w-16" />
                    <p className="mt-4 font-lato text-[15px] leading-relaxed text-muted-foreground">{it.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* S4 / S5: alternating image + text */}
        {[s4, s5].map((s, k) => s && (
          <section key={s.h2} className="px-5 py-20 md:py-24">
            <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-2 lg:gap-12">
              <div className={k === 1 ? "lg:order-2" : ""}>
                <h2 className="font-display text-[26px] font-bold leading-tight md:text-[32px]">{s.h2}</h2>
                <img src={img(4 + k)} alt="" loading="lazy" className="mt-6 aspect-[4/3] w-full rounded-2xl object-cover shadow-xl lg:hidden" />
                <div className="mt-5"><Blocks blocks={s.blocks} /></div>
                <div className="mt-8"><CTA scrollTo="quote" sub="Free, no obligation. Fill out the form above." /></div>
              </div>
              <img src={img(4 + k)} alt="" loading="lazy" className={`hidden h-full max-h-[540px] w-full rounded-2xl object-cover shadow-xl lg:block ${k === 1 ? "lg:order-1" : ""}`} />
            </div>
          </section>
        ))}

        <Integrations />

        {serviceTeam[slug] && <TeamSection t={serviceTeam[slug]} />}

        <FaqSection faqs={page.faqs} />

        <FinalCTA title={page.cta.h2} text={page.cta.text} bullets={page.cta.bullets} />

        {/* Other services */}
        <section className="border-t border-border px-5 py-16">
          <div className="mx-auto max-w-[1280px]">
            <h2 className="text-center font-display text-2xl font-bold md:text-3xl">Explore More Services</h2>
            {serviceFanout[slug] && (
              <p className="mx-auto mt-4 max-w-3xl text-center font-lato text-[16px] leading-relaxed text-muted-foreground">
                {serviceFanout[slug].crossLinks.map((c, i) => typeof c === "string" ? <span key={i}>{c}</span> : <Link key={i} to="/services/$slug/" params={{ slug: c.slug }} className="font-bold text-brand underline-offset-2 hover:underline">{c.text}</Link>)}
              </p>
            )}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {serviceNav.filter((s) => s.slug !== slug).map((s) => (
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

function FanoutSection({ f }: { f: Fanout }) {
  return (
    <section className="px-5 py-20 md:py-24">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <Eyebrow>{f.eyebrow}</Eyebrow>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-[44px]">{f.h2}</h2>
            <p className="mt-5 max-w-3xl font-lato text-[16px] leading-relaxed text-muted-foreground">{f.intro}</p>
          </div>
          <a href="#quote" className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-gradient-to-r from-brand to-brand-deep px-7 py-4 font-display text-[15px] font-bold uppercase tracking-wide text-brand-foreground shadow-lg shadow-brand/25 transition-transform hover:-translate-y-0.5 lg:self-end">Get Your Quote <ArrowRight className="h-5 w-5" /></a>
        </div>


        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-background shadow-lg">
          <table className="rtable w-full min-w-[1040px] border-collapse text-left">
            <thead>
              <tr className="bg-ink text-ink-foreground">
                {f.columns.map((c) => <th key={c} scope="col" className="border-b-2 border-brand px-5 py-4 font-display text-xs font-bold uppercase tracking-[0.15em]">{c}</th>)}
                <th scope="col" className="border-b-2 border-brand px-5 py-4 font-display text-xs font-bold uppercase tracking-[0.15em]">Your Alert specialist</th>
              </tr>
            </thead>
            <tbody>
              {f.rows.map(([a, b, c], i) => {
                const h = f.help[i]; const m = h ? team[h[0]] : undefined;
                return (
                <tr key={a} className="border-b border-border transition-colors last:border-0 odd:bg-secondary/50 hover:bg-brand/[0.05]">
                  <th scope="row" className="w-[24%] px-5 py-4 align-top font-display text-[15px] font-bold"><span className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{a}</span></th>
                  <td data-label={([...f.columns, "Your Alert specialist"])[1]} className="px-5 py-4 align-top font-lato text-[15px] leading-relaxed">
                    {b}
                    {f.tools[i] && <span className="mt-2 flex flex-wrap gap-1.5">{f.tools[i].map((t) => <span key={t} className="rounded-md border border-brand/20 bg-brand/[0.06] px-2 py-0.5 font-display text-[11px] font-bold text-brand-deep">{t}</span>)}</span>}
                  </td>
                  <td data-label={([...f.columns, "Your Alert specialist"])[2]} className="px-5 py-4 align-top font-lato text-[15px] leading-relaxed text-muted-foreground">{c}</td>
                  <td data-label={([...f.columns, "Your Alert specialist"])[3]} className="w-[24%] px-5 py-4 align-top">
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

        <p className="mt-8 rounded-xl border border-border bg-secondary/60 p-5 font-lato text-[16px] leading-relaxed">
          {f.callout.text}{" "}
          <Link to="/services/$slug/" params={{ slug: f.callout.slug }} className="font-bold text-brand underline-offset-2 hover:underline">{f.callout.link}</Link>.
        </p>
      </div>
    </section>
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
          <p className="mt-4 font-lato text-muted-foreground">Straight answers from our intake team.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`overflow-hidden rounded-2xl border bg-background transition-shadow ${isOpen ? "border-brand/40 shadow-lg" : "border-border"}`}>
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

