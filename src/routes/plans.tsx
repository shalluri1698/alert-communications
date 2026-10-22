import { HERO } from "@/lib/hero";
import { createFileRoute } from "@tanstack/react-router";
import { graph, pageNode } from "@/lib/schema";
import { CalendarClock, Receipt, CreditCard } from "lucide-react";
import { Header, Footer, MobileCallBar, Pricing, TexturedMain, CTA } from "@/components/home/sections";
import { useReveal } from "@/hooks/use-reveal";

const title = "Plans & Pricing for Law Firms | Alert Communications";
const description = "Flexible legal answering and intake plans start at $2.50/min. Basic, Advanced, Premier and Alert Go plans include 24/7 coverage and HIPAA compliance.";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [graph(pageNode("/plans", title))],
  }),
  component: PlansPage,
});

const billing = [
  { icon: CalendarClock, t: "Flexible Billing Options", d: "Choose between monthly and annual billing based on what works best for your practice." },
  { icon: Receipt, t: "Transparent Plan Pricing", d: "Clearly understand what your plan includes, how usage is billed, and what additional services are available." },
  { icon: CreditCard, t: "Easy Payment Methods", d: "Pay securely using the payment method that's most convenient for your firm." },
];

function PlansPage() {
  useReveal("plans");
  return (
    <div className="pb-20 font-body text-foreground md:pb-0">
      <Header />
      <main>
        <section className="relative isolate overflow-hidden bg-ink text-ink-foreground">
          <img fetchPriority="high" src={HERO.src} srcSet={HERO.srcSet} sizes={HERO.sizes} alt="" className="hero-zoom absolute inset-0 -z-10 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/85 to-ink" />
          <div className="mx-auto max-w-[1000px] px-5 pb-6 pt-16 text-center md:pb-8 md:pt-24">
            <span className="hero-rise inline-block rounded-full border border-brand/50 bg-brand/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.3em]">Choose the right plan</span>
            <h1 className="hero-rise mt-6 font-display text-4xl font-bold leading-tight md:text-6xl">Flexible Plans For <span className="text-brand">Every Law Firm</span></h1>
            <p className="hero-rise mx-auto mt-5 max-w-xl font-lato text-[17px] text-ink-foreground/80">Alert Communications has a plan designed to capture every opportunity. Live legal intake specialists are available around the clock.</p>
          </div>
        </section>
        <Pricing compact />
        <TexturedMain>
          <section className="px-5 py-20 md:py-24">
            <div className="mx-auto max-w-[1200px]">
              <div className="mx-auto max-w-3xl text-center">
                <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-brand">Billing &amp; Payment</p>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-[44px]">Simple, Transparent Billing Built for Law Firms</h2>
                <p className="mt-5 font-lato text-[16px] leading-relaxed text-muted-foreground">We believe pricing should be straightforward and easy to understand. There are no hidden fees, no surprise charges, and no long-term commitments unless you choose one. Our plans are designed to grow alongside your firm.</p>
              </div>
              <div className="mt-12 grid gap-5 md:grid-cols-3">
                {billing.map((b) => (
                  <div key={b.t} className="group relative overflow-hidden rounded-2xl border border-brand/15 bg-gradient-to-br from-brand/[0.07] via-background to-background p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
                    <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand to-brand-deep" />
                    <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-deep text-brand-foreground shadow-md shadow-brand/25"><b.icon className="h-5 w-5" /></span>
                    <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-wide">{b.t}</h3>
                    <span className="mt-3 block h-0.5 w-10 bg-brand transition-all group-hover:w-16" />
                    <p className="mt-3 font-lato text-[15px] leading-relaxed text-muted-foreground">{b.d}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex justify-center"><CTA /></div>
            </div>
          </section>
        </TexturedMain>
      </main>
      <Footer />
      <MobileCallBar />
    </div>
  );
}
