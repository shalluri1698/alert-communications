import { HERO } from "@/lib/hero";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { abs } from "@/lib/site";
import { graph, webPage, ORG_ID, SERVICES, serviceId } from "@/lib/schema";
import { serviceNav } from "@/data/service-nav";
import { Header, Footer, MobileCallBar, TexturedMain } from "@/components/home/sections";

const title = "Legal Answering, Intake & Retainer Services | Alert Communications";
const description =
  "Explore Alert Communications services for law firms: 24/7 legal call answering, legal intake, contract and retainer services, live chat and text, virtual receptionists, mass tort, post retainer and Voice + AI.";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: abs("/services") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: abs("/services") }],
    scripts: [
      graph(
        webPage("/services", title, {
          about: { "@id": ORG_ID },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: SERVICES.map(([s], i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": serviceId(s) } })),
          },
        }, "CollectionPage"),
      ),
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="pb-20 font-body text-foreground md:pb-0">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
          <img fetchPriority="high" src={HERO.src} srcSet={HERO.srcSet} sizes={HERO.sizes} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />
          <div className="mx-auto max-w-[1000px] px-5 pb-14 pt-16 text-center md:pb-16 md:pt-24">
            <span className="inline-block rounded-full border border-brand/50 bg-brand/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.3em]">Our Services</span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight md:text-[52px]">Legal Communication Services Built for Law Firms</h1>
            <p className="mx-auto mt-5 max-w-2xl font-lato text-[17px] text-ink-foreground/80">
              From the first ring to the signed retainer and beyond, Alert Communications answers, qualifies and supports your callers 24/7 with bilingual specialists and CRM sync for Filevine, Clio, Lead Docket, CASEpeer and Lawmatics.
            </p>
          </div>
        </section>
        <TexturedMain>
          <section className="px-5 py-20 md:py-24">
            <div className="mx-auto max-w-[1200px]">
              <div className="mx-auto max-w-3xl text-center">
                <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-brand">Eight services, one partner</p>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-[40px]">Choose the Service Your Firm Needs</h2>
                <p className="mt-4 font-lato text-[16px] leading-relaxed text-muted-foreground">Each service works on its own or together, so your firm can start with call answering and add intake, retainers or follow-up as you grow.</p>
              </div>
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {serviceNav.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug/"
                    params={{ slug: s.slug }}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={s.image} alt={s.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-lg bg-brand text-brand-foreground shadow-md"><s.icon className="h-5 w-5" /></span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-lg font-bold leading-snug">{s.name}</h3>
                      <p className="mt-2 flex-1 font-lato text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
                        Explore {s.name} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-14 flex flex-col items-center gap-3 text-center">
                <p className="font-lato text-muted-foreground">Not sure which service fits? Talk to a specialist.</p>
                <a href="tel:8442362485" className="inline-flex items-center gap-2 rounded-md bg-brand px-6 py-3 font-display text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-md transition-colors hover:bg-brand-deep">
                  <Phone className="h-4 w-4" /> 844-236-2485
                </a>
              </div>
            </div>
          </section>
        </TexturedMain>
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
}
