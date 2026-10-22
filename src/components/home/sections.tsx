import { HERO } from "@/lib/hero";
import { useState, useEffect } from "react";
import type React from "react";

function L({ to, children }: { to: string; children: React.ReactNode }) {
  return <a href={to} className="font-semibold text-brand underline underline-offset-2 hover:text-brand-deep">{children}</a>;
}
import reviewData from "@/data/reviews.json";
import { YouTube } from "@/components/youtube";
import { Link, useRouterState } from "@tanstack/react-router";
import { serviceNav } from "@/data/service-nav";
import { team } from "@/data/service-team";
import { whoWeServe, aboutNav, type NavLink } from "@/data/site-nav";
import { Phone, Star, ChevronRight, ChevronDown, ChevronLeft, ArrowRightCircle, CheckCircle2, Scale, BadgeCheck, PhoneCall, ListChecks, FileSignature, ArrowRight, Facebook, Linkedin, Twitter, Menu, X } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import logoWhite from "@/assets/logo-white.png.asset.json";
import avatars from "@/assets/avatars.png.asset.json";
import svcInbound from "@/assets/svc-inbound.png.asset.json";
import svcIntake from "@/assets/svc-intake.png.asset.json";
import svcMass from "@/assets/svc-masstort.png.asset.json";
import svcChat from "@/assets/svc-chat.png.asset.json";
import expect from "@/assets/expect.jpg.asset.json";
import decisions from "@/assets/decisions.jpg.asset.json";
import retainer from "@/assets/retainer.jpg.asset.json";
import texture from "@/assets/bg-texture.jpg.asset.json";
import diagonal from "@/assets/bg-diagonal.png.asset.json";
import pA from "@/assets/p-salesforce.png.asset.json";
import pB from "@/assets/p-smartadvocate.png.asset.json";
import pC from "@/assets/p-lawruler.png.asset.json";
import pD from "@/assets/p-zapier.png.asset.json";
import pE from "@/assets/p-litify.png.asset.json";

const TEL = "tel:844-236-2485";
const CONTACT = "/contact";
const textureBg = { backgroundImage: `url(${texture.url})`, backgroundSize: "cover" };

export function CTA({ children = "Get Your Free Assessment", href = CONTACT, sub = "Contact us. Free, no obligation.", scrollTo }: { children?: string; href?: string; sub?: string; scrollTo?: string }) {
  const onClick = scrollTo ? (e: React.MouseEvent) => { const el = document.getElementById(scrollTo); if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth", block: "start" }); } } : undefined;
  return (
    <>
      <a href={TEL} className="group inline-flex w-full max-w-sm items-center gap-3 rounded-full bg-gradient-to-r from-brand to-brand-deep py-2 pl-2 pr-5 text-brand-foreground shadow-[0_14px_34px_-12px] shadow-brand/70 ring-1 ring-brand/40 md:hidden">
        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-background text-brand">
          <span className="absolute inset-0 animate-ping rounded-full bg-background/60 [animation-duration:2.4s]" />
          <PhoneCall className="relative h-5 w-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col text-left leading-tight">
          <span className="font-display text-[15px] font-extrabold uppercase">Call for a Free Assessment</span>
          <span className="font-lato text-[13px] text-brand-foreground/85">Tap to call 844-236-2485</span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0" />
      </a>
      <a href={scrollTo ? `#${scrollTo}` : href} onClick={onClick} className="group hidden items-center gap-4 rounded-full bg-gradient-to-r from-brand to-brand-deep py-2 pl-2 pr-6 text-brand-foreground shadow-[0_14px_34px_-12px] shadow-brand/70 ring-1 ring-brand/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_-12px] hover:shadow-brand/80 md:inline-flex">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-background text-brand"><ArrowRightCircle className="h-5 w-5" /></span>
        <span className="flex flex-col text-left leading-tight">
          <span className="whitespace-nowrap font-display text-[15px] font-extrabold uppercase tracking-wide">{children}</span>
          <span className="font-lato text-xs text-brand-foreground/80">{sub}</span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
      </a>
    </>
  );
}

export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-border bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px] shadow-ink/40 backdrop-blur md:hidden">
      <a href={TEL} className="flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-display text-sm font-bold uppercase tracking-wide text-brand-foreground"><PhoneCall className="h-4 w-4" />Call Now</a>
      <a href={CONTACT} className="flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 font-display text-sm font-bold uppercase tracking-wide text-ink-foreground"><ArrowRightCircle className="h-4 w-4" />Contact Us</a>
    </div>
  );
}

function Check({ light = false }: { light?: boolean }) {
  return <CheckCircle2 className={`h-4 w-4 shrink-0 ${light ? "text-brand-foreground" : "text-brand"}`} />;
}

function CallMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex justify-center" onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)} onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-center gap-2 bg-background px-5 py-2.5 font-lato font-semibold text-brand sm:w-auto sm:py-0">
        <Phone className="h-4 w-4" /> Give Us A Call <ChevronDown className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-[60] w-60 -translate-x-1/2 sm:left-0 sm:translate-x-0 border border-border bg-background p-4 font-lato shadow-xl">
          <p className="text-xs text-brand">Customer Service</p>
          <a href="tel:844-863-4407" className="mt-1 block text-base font-bold text-brand hover:underline">844-863-4407</a>
          <div className="my-3 h-px bg-border" />
          <p className="text-xs text-brand">Sales</p>
          <a href="tel:844-236-2485" className="mt-1 block text-base font-bold text-brand hover:underline">844-236-2485</a>
        </div>
      )}
    </div>
  );
}

function DropPanel({ links, cols, onPick }: { links: NavLink[]; cols: 1 | 3; onPick: () => void }) {
  return (
    <div className={`grid gap-1.5 ${cols === 3 ? "grid-cols-3" : "grid-cols-1"}`}>
      {links.map((l) => (
        <a key={l.href} href={l.href} onClick={onPick} className="group flex items-start gap-3.5 rounded-xl p-3 transition-colors hover:bg-secondary">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground"><l.icon className="h-[18px] w-[18px]" /></span>
          <span className="min-w-0">
            <span className="flex items-center gap-1.5 font-display text-[15px] font-bold text-foreground">{l.name}<ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-brand opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" /></span>
            <span className="mt-0.5 block font-lato text-[13px] text-muted-foreground">{l.blurb}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

function PromoBox() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-ink p-7 text-ink-foreground">
      <img loading="lazy" decoding="async" src={serviceNav[0]?.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-brand-deep/40" />
      <div className="relative flex h-full flex-col justify-end">
        <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-brand-foreground/80">Free Assessment</p>
        <p className="mt-2 font-display text-2xl font-bold leading-tight">Not sure which service fits your firm?</p>
        <p className="mt-2 font-lato text-sm text-ink-foreground/80">Talk to a specialist and get a plan built around your caseload.</p>
        <a href={TEL} className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 font-display text-sm font-bold uppercase text-brand-foreground"><PhoneCall className="h-4 w-4" />844-236-2485</a>
      </div>
    </div>
  );
}

type MenuKey = "services" | "who" | "about" | null;

export function Header() {
  const [menu, setMenu] = useState<MenuKey>(null);
  const [mobile, setMobile] = useState(false);
  const [mOpen, setMOpen] = useState<MenuKey>(null);
  const path = useRouterState({ select: (st) => st.location.pathname });
  const item = "relative flex items-center gap-1.5 whitespace-nowrap px-3 py-3 font-lato text-[15px] transition-colors hover:text-brand after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand after:transition-transform hover:after:scale-x-100";
  const on = "text-brand after:scale-x-100";
  const active = (k: MenuKey) =>
    k === "services" ? path.startsWith("/services") : k === "who" ? whoWeServe.some((l) => path.startsWith(l.href)) : aboutNav.some((l) => path === l.href);
  const Drop = ({ k, label }: { k: Exclude<MenuKey, null>; label: string }) => (
    <button type="button" onMouseEnter={() => setMenu(k)} onClick={() => setMenu(k)} aria-expanded={menu === k} className={`${item} ${menu === k || active(k) ? on : "text-foreground"}`}>
      {label} <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${menu === k ? "rotate-180" : ""}`} />
    </button>
  );
  const plain = (n: string, h: string) => <a key={h} href={h} onMouseEnter={() => setMenu(null)} className={`${item} ${path.startsWith(h) ? on : "text-foreground"}`}>{n}</a>;
  const panel = (k: Exclude<MenuKey, null>) => `absolute inset-x-0 top-full hidden origin-top transition-all duration-300 xl:block ${menu === k ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`;
  const close = () => setMenu(null);
  const mGroup = (k: Exclude<MenuKey, null>, label: string, links: { name: string; href: string; icon: NavLink["icon"] }[]) => (
    <div key={k}>
      <button type="button" onClick={() => setMOpen(mOpen === k ? null : k)} className="flex w-full items-center justify-between border-b border-border py-4 font-display font-bold">
        {label} <ChevronDown className={`h-5 w-5 text-brand transition-transform ${mOpen === k ? "rotate-180" : ""}`} />
      </button>
      {mOpen === k && (
        <div className="grid gap-1 border-b border-border py-2">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobile(false)} className="flex items-center gap-3 rounded-lg px-2 py-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand"><l.icon className="h-4 w-4" /></span>
              <span className="font-lato text-[15px] font-semibold">{l.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
  return (
    <>
      <div className="relative z-[60] flex flex-col items-stretch justify-center bg-topbar text-sm sm:flex-row">
        <p className="flex items-center justify-center px-4 py-2.5 text-center text-xs sm:py-3 sm:text-sm font-lato font-bold text-topbar-foreground">*Intended for law firms only. We do not provide legal advice.</p>
        <CallMenu />
      </div>
      <header className="sticky top-0 z-50 bg-background shadow-sm" onMouseLeave={close}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-3.5 lg:px-10">
          <Link to="/" className="shrink-0"><img src={logo.url} alt="Alert Communications" className="h-9 w-auto md:h-10" /></Link>
          <nav className="hidden items-center gap-1 xl:flex">
            <Link to="/" onMouseEnter={close} className={`${item} ${path === "/" ? on : "text-foreground"}`}>Home</Link>
            <Link to="/services/" onMouseEnter={() => setMenu("services")} onFocus={() => setMenu("services")} aria-expanded={menu === "services"} className={`${item} ${menu === "services" || active("services") ? on : "text-foreground"}`}>
              Services <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${menu === "services" ? "rotate-180" : ""}`} />
            </Link>
            {plain("Integrations", "/integrations/")}
            {plain("Plans", "/plans/")}
            <Drop k="who" label="Who We Serve" />
            <Drop k="about" label="About" />
            {plain("Blog", "/blog/")}
          </nav>
          <div className="flex shrink-0 items-center gap-3 md:gap-5">
            <a href={CONTACT} className="rounded-md bg-brand px-4 py-2.5 font-display text-sm font-bold uppercase text-brand-foreground md:px-5 md:text-base">Contact Us</a>
            <a href="https://secure.alertcommunications.com/" className="hidden rounded-md bg-foreground px-5 py-2.5 font-display text-base font-bold uppercase text-background sm:inline-block">Login</a>
            <button type="button" onClick={() => setMobile((m) => !m)} aria-label="Menu" aria-expanded={mobile} className="grid h-10 w-10 place-items-center rounded-md border border-border xl:hidden">
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className={panel("services")}>
          <div className="border-t border-border bg-background shadow-2xl">
            <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_340px] gap-8 px-10 py-8">
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-brand">Our Services</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {serviceNav.map((sv) => (
                    <Link key={sv.slug} to="/services/$slug/" params={{ slug: sv.slug }} onClick={close} className="group flex items-start gap-4 rounded-xl p-3.5 transition-colors hover:bg-secondary">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground"><sv.icon className="h-5 w-5" /></span>
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 font-display text-[15px] font-bold text-foreground">{sv.name}<ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-brand opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" /></span>
                        <span className="mt-0.5 block font-lato text-sm text-muted-foreground">{sv.blurb}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
              <PromoBox />
            </div>
          </div>
        </div>
        <div className={`absolute left-1/2 top-full hidden w-[380px] origin-top transition-all duration-300 xl:block ${menu === "who" ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
          <div className="rounded-b-2xl border border-t-0 border-border bg-background p-3 shadow-2xl">
            <DropPanel links={whoWeServe} cols={1} onPick={close} />
          </div>
        </div>
        <div className={panel("about")}>
          <div className="border-t border-border bg-background shadow-2xl">
            <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_300px] gap-8 px-10 py-8">
              <div>
                <p className="font-display text-xs font-bold uppercase tracking-[0.25em] text-brand">About Alert</p>
                <div className="mt-4"><DropPanel links={aboutNav} cols={3} onPick={close} /></div>
              </div>
              <PromoBox />
            </div>
          </div>
        </div>
        {mobile && (
          <div className="max-h-[calc(100svh-110px)] overflow-y-auto border-t border-border bg-background px-5 pb-6 xl:hidden">
            <Link to="/" onClick={() => setMobile(false)} className="block border-b border-border py-4 font-display font-bold">Home</Link>
            {mGroup("services", "Services", [{ name: "All Services", href: "/services/", icon: ListChecks }, ...serviceNav.map((sv) => ({ name: sv.name, href: `/services/${sv.slug}/`, icon: sv.icon }))])}
            <a href="/integrations/" className="block border-b border-border py-4 font-display font-bold">Integrations</a>
            <a href="/plans/" className="block border-b border-border py-4 font-display font-bold">Plans</a>
            {mGroup("who", "Who We Serve", whoWeServe)}
            {mGroup("about", "About", aboutNav)}
            <a href="/blog/" className="block border-b border-border py-4 font-display font-bold">Blog</a>
            <a href="https://secure.alertcommunications.com/" className="mt-5 block rounded-md bg-foreground py-3 text-center font-display font-bold uppercase text-background">Login</a>
          </div>
        )}
      </header>
    </>
  );
}

export function Hero() {
  const stats = [[Scale, "5,000+ Active Customers", "Trust Our Team"], [Phone, "24/7", "Live Answering"], [Scale, "HIPAA & Legal", "Industry Compliant"]] as const;
  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      <img fetchPriority="high" src={HERO.src} srcSet={HERO.srcSet} sizes={HERO.sizes} alt="" className="absolute inset-0 h-full w-full animate-[hero-zoom_14s_ease-out_both] object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/40" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink/70 to-transparent" />
      <div className="hero-rise relative mx-auto flex min-h-[calc(100svh-120px)] max-w-[1440px] flex-col justify-center px-6 py-28 lg:px-16 lg:py-36">
        <h1 className="max-w-[1080px] font-display text-3xl font-bold uppercase leading-[1.12] tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] md:text-[44px] xl:text-[50px]">
          24/7 Legal Lead Management &amp; Intake Solutions for Law Firms
        </h1>
        <p className="mt-8 max-w-[760px] font-lato text-[17px] leading-relaxed text-ink-foreground/85 md:text-lg">Turn inbound inquiries into signed retainers, maintain 24/7 call coverage, and scale your firm's front-desk operations with specialized legal communication teams. Bilingual English and Spanish specialists qualify every caller with your scripts and sync each case to Filevine, Clio or Lead Docket, so your attorneys start every morning with ready-to-sign leads.</p>
        <ul className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
          {stats.map(([Icon, a, b]) => (
            <li key={a} className="flex items-center gap-4">
              <Icon className="h-10 w-10 shrink-0 text-brand" fill={Icon === Phone ? "currentColor" : "none"} />
              <span className="font-lato text-base font-bold leading-snug md:text-lg">{a}<br />{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-12"><CTA /></div>
        <div className="mt-10 flex items-center gap-6">
          <img src={avatars.url} alt="Law firm clients" className="h-12 w-auto" />
          <div className="font-lato text-sm">
            <div className="flex text-star">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}</div>
            <span className="mt-1 block">Trusted by 5,000+ Customers Nationwide</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServiceRouter() {
  const rows = [
    { slug: "legal-call-answering", t: "Legal Call Answering", d: "24/7 phone line triage, overflow management, and after-hours coverage.", pre: "Protect your practice around the clock with our ", link: "24/7 law firm call answering and overflow triage services", post: ".", tools: ["24/7/365", "Overflow routing", "On-call escalation"], rep: "liz", help: "Liz sets up routing and escalation rules." },
    { slug: "virtual-assistant-receptionists", t: "Virtual Receptionist", d: "Daily front-desk management, calendar sync, and warm transfers.", pre: "Streamline daily front-desk operations and appointment booking using a ", link: "dedicated virtual legal receptionist", post: ".", tools: ["Microsoft Outlook", "Google Calendar", "Warm transfers"], rep: "michelle", help: "Michelle programs your greeting and calendar rules." },
    { slug: "legal-intake", t: "Legal Intake Services", d: "High-volume qualification, custom screening scripts, and instant e-sign retainers.", pre: "Convert high-volume marketing leads into clients with ", link: "24/7 legal intake services and instant e-sign retainers", post: ".", tools: ["Filevine", "Clio", "Lead Docket", "Bilingual"], rep: "tammy", help: "Tammy shapes your intake strategy around your goals." },
    { slug: "contract-retainer", t: "Contract & Retainer", d: "Retainer agreements sent and followed up for qualified leads.", pre: "Close the gap between qualified lead and signed client with ", link: "contract and retainer services", post: ".", tools: ["E-signature", "Text and email", "Follow-up"], rep: "jill", help: "Jill builds your retainer workflow step by step." },
    { slug: "mass-tort", t: "Mass Tort & Class Action", d: "Dedicated agents, eligibility screening, and surge capacity.", pre: "Scale campaign intake without losing claimants through ", link: "mass tort intake and class action call services", post: ".", tools: ["Campaign scripts", "Eligibility criteria", "Surge coverage"], rep: "liz", help: "Liz keeps high-volume campaigns running smoothly." },
    { slug: "live-chat-text", t: "Live Chat & Text", d: "Real-time web chat and text replies that book appointments.", pre: "Turn website visitors into consultations with ", link: "live chat and text services for law firms", post: ".", tools: ["Website chat", "SMS", "Lead handoff"], rep: "michelle", help: "Michelle draws on her live chat background to set it up." },
  ] as const;
  return (
    <section className="px-5 py-24">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-brand">Legal Intake and Answering Solutions</p>
        <h2 className="mt-3 font-display text-3xl font-bold leading-tight md:text-[44px]">Our Tailored Legal Communication Services</h2>
        <p className="mt-4 max-w-3xl font-body text-[16px] leading-relaxed text-muted-foreground">Compare our <a href="/services/legal-call-answering/" className="font-semibold text-brand underline-offset-2 hover:underline">24/7 Legal Call Answering</a>, <a href="/services/virtual-assistant-receptionists/" className="font-semibold text-brand underline-offset-2 hover:underline">Virtual Legal Receptionist</a>, and <a href="/services/legal-intake/" className="font-semibold text-brand underline-offset-2 hover:underline">Full Legal Intake Solutions</a> to find the right fit for your practice.</p>
        <div className="mt-10 overflow-x-auto rounded-2xl border border-border bg-background shadow-lg">
          <table className="rtable w-full min-w-[1040px] border-collapse text-left">
            <thead>
              <tr className="bg-ink text-ink-foreground">
                {["Service", "What it covers", "Works with", "Your Alert specialist"].map((c) => <th key={c} scope="col" className="border-b-2 border-brand px-5 py-4 font-display text-xs font-bold uppercase tracking-[0.15em]">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const m = team[r.rep];
                return (
                  <tr key={r.slug} className="border-b border-border transition-colors last:border-0 odd:bg-secondary/50 hover:bg-brand/[0.05]">
                    <th scope="row" className="w-[20%] px-5 py-5 align-top">
                      <Link to="/services/$slug/" params={{ slug: r.slug }} className="group inline-flex items-center gap-2 font-display text-[16px] font-bold hover:text-brand">{r.t}<ArrowRight className="h-4 w-4 text-brand transition-transform group-hover:translate-x-1" /></Link>
                    </th>
                    <td data-label={(["Service", "What it covers", "Works with", "Your Alert specialist"])[1]} className="px-5 py-5 align-top font-body text-[15px] leading-relaxed">
                      <span className="font-semibold">{r.d}</span>{" "}
                      <span className="text-muted-foreground">{r.pre}<Link to="/services/$slug/" params={{ slug: r.slug }} className="font-bold text-brand underline-offset-2 hover:underline">{r.link}</Link>{r.post}</span>
                    </td>
                    <td data-label={(["Service", "What it covers", "Works with", "Your Alert specialist"])[2]} className="w-[20%] px-5 py-5 align-top"><span className="flex flex-wrap gap-1.5">{r.tools.map((t) => <span key={t} className="rounded-md border border-brand/20 bg-brand/[0.06] px-2 py-0.5 font-display text-[11px] font-bold text-brand-deep">{t}</span>)}</span></td>
                    <td data-label={(["Service", "What it covers", "Works with", "Your Alert specialist"])[3]} className="w-[22%] px-5 py-5 align-top">
                      <span className="flex gap-3"><img src={m.photo} alt={m.name} loading="lazy" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-brand/20" /><span className="font-body text-[14px] leading-snug"><b className="block font-display text-[13px]">{m.name}</b><span className="text-muted-foreground">{r.help}</span></span></span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function BrandDefinition() {
  return (
    <section className="px-5 py-12">
      <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-2xl border border-brand/20 bg-gradient-to-br from-brand/[0.07] via-background to-background p-7 shadow-sm md:p-9">
        <span className="absolute inset-y-0 left-0 w-1 bg-brand" />
        <h2 className="font-display text-2xl font-bold md:text-3xl">What is Alert Communications?</h2>
        <p className="mt-3 font-lato text-[17px] leading-relaxed">Alert Communications provides 24/7 legal intake, call answering, and virtual receptionist services tailored for law firms. Specializing in bilingual lead screening, custom qualification scripts, fast e-signature retainer dispatch, and direct CRM integration, Alert converts inbound legal leads into signed retainers for practices nationwide.</p>
      </div>
    </section>
  );
}

export function Services() {
  const items = [
    { slug: "legal-call-answering", t: "Inbound & Outbound Calling", d: "We answer every call through trained intake specialists who qualify cases, capture lead details, and route urgent matters in accordance with 24/7 call triage protocols.", img: svcChat.url },
    { slug: "legal-intake", t: "Intake & Retainer Services", d: "Our bilingual teams screen prospects, document case facts, and coordinate retainer delivery through secure data capture and calendar integration workflows.", img: svcInbound.url },
    { slug: "mass-tort", t: "Mass Tort & Class Action Services", d: "We manage high-volume campaigns with dedicated agents who follow practice-specific scripts, verify eligibility criteria, and schedule consultations during surge periods.", img: svcMass.url },
    { slug: "live-chat-text", t: "Live Chat Services", d: "Our specialists respond to web inquiries in real time, answer qualification questions, and convert chat visitors into scheduled appointments across all hours.", img: svcIntake.url },
  ];
  return (
    <section className="px-5 py-24">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="font-display text-4xl font-bold leading-tight text-foreground md:text-[48px]">24/7 Legal Intake, Bilingual Support, and Overflow Coverage for Law Firms</h2>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <article key={s.t} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img loading="lazy" decoding="async" src={s.img} alt={s.t} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                <span className="absolute bottom-4 left-5 font-display text-4xl font-extrabold text-ink-foreground/90">0{i + 1}</span>
              </div>
              <div className="flex flex-1 flex-col border-t-4 border-brand p-6">
                <h3 className="font-display text-xl font-bold leading-tight">{s.t}</h3>
                <p className="mt-3 flex-1 font-body text-[15px] leading-relaxed text-muted-foreground">{s.d}</p>
                <Link to="/services/$slug/" params={{ slug: s.slug }} className="mt-6 inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-brand">
                  Learn More<span className="sr-only"> about {s.t}</span> <ArrowRightCircle className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Convert() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto grid max-w-[1360px] items-center gap-6 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-10 lg:gap-y-0">
        <h2 className="font-display text-[26px] font-bold leading-tight md:text-[38px] lg:self-end">How 24/7 Legal Call Answering Converts Missed Calls Into Signed Retainers</h2>
        <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
          <p className="font-body leading-relaxed lg:mt-10">If you have ever called a law firm after hours and reached a voicemail that promised a callback within 24 hours, you already know what happens next. You called the second firm on the search results page, spoke to a live legal receptionist, and scheduled the consultation before the first firm ever knew you existed.</p>
          <p className="mt-4 font-body leading-relaxed">This fails quietly because the intake form captured the caller's name and number, but nobody ran the case qualification questions that separate a viable case from a referral. The retainer never gets sent because the lead was never actually qualified, and the firm discovers the gap only when they review why conversion dropped that month.</p>
          <div className="mt-10"><CTA /></div>
        </div>
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-ink shadow-xl max-lg:row-start-2 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <YouTube id="Tl6z49pd8NA" title="How 24/7 Legal Call Answering Converts Missed Calls Into Signed Retainers" />
        </div>
      </div>
    </section>
  );
}

function Review({ r }: { r: (typeof reviewData)[number] }) {
  return (
    <a href={r.url} target="_blank" rel="noopener noreferrer" aria-label={`Read ${r.name}'s review on Google`} className="group relative flex h-[330px] flex-col overflow-hidden rounded-2xl border border-border bg-background p-6 text-foreground shadow-sm transition-all before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-brand hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 font-bold text-brand">{r.name.charAt(0)}</span>
        <span className="min-w-0">
          <span className="flex items-center gap-1 truncate text-sm font-bold">{r.name}<BadgeCheck className="h-4 w-4 shrink-0 text-brand" /></span>
        </span>
      </div>
      <div className="mt-4 flex text-star">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}</div>
      <blockquote className="mt-2 line-clamp-6 font-body text-[15px] leading-relaxed text-muted-foreground">&ldquo;{r.text}&rdquo;</blockquote>
      <div className="mt-auto flex items-end justify-between pt-3">
        <p className="text-xl font-medium"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span></p>
        <span className="inline-flex items-center gap-1 text-sm font-bold text-brand">Read full review <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
      </div>
    </a>
  );
}

export function Testimonials() {
  const [per, setPer] = useState(1);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = reviewData.length;
  useEffect(() => {
    const f = () => setPer(window.innerWidth >= 1024 ? 4 : window.innerWidth >= 640 ? 2 : 1);
    f(); window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  const max = total - per;
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x >= max ? 0 : x + 1)), 5000);
    return () => clearInterval(t);
  }, [paused, max]);
  const idx = Math.min(i, max);
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-[1280px] text-center">
        <p className="font-display text-4xl text-brand">CLIENT TESTIMONIALS</p>
        <h2 className="mt-6 font-display text-5xl font-bold md:text-6xl">Why Choose Alert?</h2>
        <p className="mx-auto mt-8 max-w-3xl font-body text-xl">We have the experience to know what works, and our services can be customized to suit your specific practice area, geography, and client base.</p>
        <div className="relative mt-12 text-left" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${(idx * 100) / per}%)` }}>
              {reviewData.map((r) => <div key={r.url} className="w-full shrink-0 px-2.5 sm:w-1/2 lg:w-1/4"><Review r={r} /></div>)}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <button aria-label="Previous reviews" onClick={() => setI(idx <= 0 ? max : idx - 1)} className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-brand hover:text-brand-foreground"><ChevronLeft className="h-5 w-5" /></button>
            <div className="flex gap-1.5">{Array.from({ length: max + 1 }).map((_, d) => <button key={d} aria-label={`Show reviews ${d + 1}`} onClick={() => setI(d)} className={`h-2 rounded-full transition-all ${d === idx ? "w-6 bg-brand" : "w-2 bg-muted-foreground/40"}`} />)}</div>
            <button aria-label="Next reviews" onClick={() => setI(idx >= max ? 0 : idx + 1)} className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-brand hover:text-brand-foreground"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bullets({ items }: { items: [string, string][] }) {
  return (
    <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-background/80 font-body shadow-sm">
      {items.map(([b, t]) => (
        <li key={b} className="flex items-start gap-3 px-4 py-3">
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/10"><CheckCircle2 className="h-4 w-4 text-brand" /></span>
          <span className="text-sm leading-relaxed"><b className="font-display font-bold">{b}:</b> <span className="text-muted-foreground">{t}</span></span>
        </li>
      ))}
    </ul>
  );
}

export function Expect() {
  return (
    <section className="px-5 pb-32 pt-20 lg:px-10">
      <div className="mx-auto grid max-w-[1240px] items-stretch gap-12 lg:grid-cols-2 lg:gap-16">
        <img loading="lazy" decoding="async" src={expect.url} alt="Hand holding phone with AI assistant" className="hidden w-full rounded-2xl object-cover shadow-xl lg:block lg:h-full" />
        <div>
          <h2 className="font-display text-[26px] font-bold leading-tight md:text-[30px] xl:text-[32px]">What Should Law Firms Expect When They Outsource Legal Intake Services?</h2>
          <img loading="lazy" decoding="async" src={expect.url} alt="" className="mt-6 aspect-[4/3] w-full rounded-2xl object-cover shadow-xl lg:hidden" />
          <p className="mt-5 font-body text-[15px] leading-relaxed text-muted-foreground">Onboarding exposes undocumented intake workflows that most firms did not realize they were running on memory alone, not process.</p>
          <h3 className="mt-7 font-display text-lg font-bold text-brand md:text-xl">The Intake Handoff That Actually Works</h3>
          <Bullets items={[["Script Collaboration", "Firms co-author intake decision trees."], ["CRM Integration Mapping", "Fields sync to Filevine, Clio, Lead Docket and more."], ["Agent Certification", "Training includes practice-area qualification criteria."], ["Live Transfer Protocol", "On-call routing is tested before launch."], ["Weekly Calibration", "QA reviews refine accuracy continuously."]]} />
          <div className="mt-6"><CTA /></div>
        </div>
      </div>
    </section>
  );
}

const base = ["24/7 Coverage", "Free Message Delivery", "Secure Client Portal Access", "Fully HIPAA Compliant"];
const plans = [
  { tier: "Tier 1", name: "Basic", price: "$240/mo", mins: "100 minutes", f: ["Message Taking", ...base] },
  { tier: "Tier 2", name: "Advanced", price: "$590/mo", mins: "250 minutes", f: ["Message Taking", "Intake", ...base], featured: true },
  { tier: "Tier 3", name: "Premier", price: "$550/mo + $75/Retainer", mins: "250 minutes", f: ["Message Taking", "Intake", "Retainers", ...base] },
];

function Started({ variant = "brand" }: { variant?: "brand" | "light" }) {
  return (
    <a href={CONTACT} className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider transition-all ${variant === "light" ? "bg-ink-foreground text-brand shadow-lg hover:bg-brand hover:text-brand-foreground" : "border border-brand/60 bg-brand/10 text-brand-foreground hover:bg-brand"}`}>
      Get Started <ArrowRightCircle className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  );
}

function MobilePlans() {
  const [open, setOpen] = useState<string | null>(null);
  const rows = [
    ...plans.map((p) => ({ tier: p.tier, name: p.name, price: (p.price.split(" + ")[0] ?? "").replace("/mo", ""), unit: "/mo", extra: p.price.includes("+") ? "+ $75 per retainer" : "", mins: p.mins, f: p.f, featured: !!p.featured })),
    { tier: "Campaign", name: "Alert Go", price: "$2.50", unit: "/min", extra: "+ $100 per retainer", mins: "Pay as you go", f: ["Pay-as-you-go", "No monthly minimum", "Free Message Delivery", "Secure Client Portal Access", "Fully HIPAA Compliant"], featured: false },
  ];
  return (
    <div className="mt-10 space-y-3 md:hidden">
      {rows.map((r) => {
        const isOpen = open === r.name;
        return (
          <div key={r.name} className={`overflow-hidden rounded-2xl border transition-colors ${r.featured ? "border-brand bg-brand text-brand-foreground shadow-lg shadow-brand/40" : "border-transparent bg-background text-foreground"}`}>
            <button type="button" onClick={() => setOpen(isOpen ? null : r.name)} aria-expanded={isOpen} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-5 text-left">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`font-display text-xs font-bold uppercase tracking-[0.2em] ${r.featured ? "text-brand-foreground/90" : "text-brand"}`}>{r.tier}</span>
                  {r.featured && <span className="rounded-full bg-background px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-brand">Popular</span>}
                </div>
                <p className="mt-1 truncate font-display text-xl font-extrabold uppercase">{r.name}</p>
                <p className={`mt-1 font-lato text-sm font-semibold ${r.featured ? "text-brand-foreground/90" : "text-muted-foreground"}`}>{r.mins}{r.name !== "Alert Go" ? " included" : ""}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right font-display">
                  <p className="text-[28px] font-extrabold leading-none">{r.price}<span className="text-sm font-semibold opacity-75">{r.unit}</span></p>
                  {r.extra && <p className={`mt-1.5 font-lato text-sm font-bold ${r.featured ? "" : "text-brand"}`}>{r.extra}</p>}
                </div>
                <ChevronDown className={`h-6 w-6 shrink-0 rounded-full p-1 ${r.featured ? "bg-background text-brand" : "bg-brand text-brand-foreground"} transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </button>
            {isOpen && (
              <div className="border-t border-current/15 px-5 pb-5 pt-4">
                <ul className="space-y-2.5 font-lato text-base">
                  {r.f.map((x) => <li key={x} className="flex items-center gap-2.5"><CheckCircle2 className={`h-5 w-5 shrink-0 ${r.featured ? "" : "text-brand"}`} />{x}</li>)}
                </ul>
                <div className="mt-5">{r.featured ? <Started variant="light" /> : <a href={CONTACT} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-lg shadow-brand/30">Get Started <ArrowRightCircle className="h-4 w-4" /></a>}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Pricing({ compact = false }: { compact?: boolean } = {}) {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br from-ink via-ink to-brand-deep px-5 pb-24 text-ink-foreground md:pb-44 ${compact ? "pt-4 md:pt-6" : "pt-20 md:pt-28"}`}>
      {!compact && <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand/30 blur-[140px]" />}
      <div aria-hidden className="pointer-events-none absolute -bottom-[4vw] left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[17vw] font-extrabold uppercase leading-none tracking-tight text-transparent opacity-[0.14] [-webkit-text-stroke:1.5px_var(--ink-foreground)]">Alert Comm</div>
      <div className="relative mx-auto max-w-[1200px]">
        {!compact && (
        <div className="text-center">
          <span className="inline-block rounded-full border border-brand/50 bg-brand/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-[0.3em] text-brand-foreground">Choose the right plan</span>
          <h2 className="mt-6 font-display text-4xl font-bold md:text-5xl">Plans Built For <span className="text-brand md:bg-gradient-to-r md:from-brand md:to-ink-foreground md:bg-clip-text md:text-transparent">Your Practice</span></h2>
          <p className="mx-auto mt-4 max-w-xl font-lato text-ink-foreground/85">Live legal intake specialists, around the clock. Pick the coverage that fits your caseload.</p>
        </div>
        )}
        <MobilePlans />
        <div className="mt-16 hidden items-stretch gap-6 md:grid md:grid-cols-3">
          {plans.map((p) => {
            const f = !!p.featured;
            const [amt, extra] = p.price.split(" + ");
            return (
              <div key={p.name} className={`group relative rounded-3xl p-px transition-transform duration-300 hover:-translate-y-2 ${f ? "bg-gradient-to-b from-brand via-brand/60 to-brand-deep shadow-[0_30px_80px_-20px] shadow-brand/60 md:scale-105" : "bg-gradient-to-b from-ink-foreground/25 to-ink-foreground/5"}`}>
                {f && <span className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-brand px-4 py-1.5 font-display text-[11px] font-bold uppercase tracking-widest text-brand-foreground shadow-lg">Most Popular</span>}
                <div className={`flex h-full flex-col rounded-3xl p-8 ${f ? "bg-gradient-to-b from-brand-deep to-ink" : "bg-gradient-to-b from-ink-foreground/[0.08] to-ink/95 bg-ink backdrop-blur"}`}>
                  <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand">{p.tier}</p>
                  <h3 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-wide">{p.name}</h3>
                  <div className="mt-6 flex items-end gap-1 font-display">
                    <span className="text-5xl font-extrabold leading-none">{(amt ?? "").replace("/mo", "")}</span>
                    <span className="pb-1 text-sm text-ink-foreground/60">/month</span>
                  </div>
                  <p className="mt-2 h-5 font-lato text-sm text-brand">{extra ? `+ ${extra.replace("/Retainer", " per retainer")}` : ""}</p>
                  <div className={`mt-6 flex items-center justify-between rounded-xl px-4 py-3 font-display text-sm border ${f ? "border-ink-foreground/25 bg-brand/60" : "border-ink-foreground/20 bg-ink-foreground/15"}`}>
                    <span className="text-ink-foreground/90">Included</span><span className="font-bold">{p.mins}</span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3 font-lato text-[15px] text-ink-foreground">
                    {p.f.map((x) => <li key={x} className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />{x}</li>)}
                  </ul>
                  <div className="mt-8"><Started variant={f ? "light" : "brand"} /></div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-14 hidden rounded-3xl bg-gradient-to-r from-brand via-ink-foreground/20 to-brand p-px md:block">
          <div className="grid gap-8 rounded-3xl bg-ink p-8 md:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center">
            <div>
              <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand">Campaign · Pay as you go</p>
              <h3 className="mt-2 font-display text-4xl font-extrabold">ALERT GO</h3>
              <p className="mt-3 font-display"><span className="text-3xl font-extrabold">$2.50</span><span className="text-sm text-ink-foreground/60">/min</span><span className="mx-3 text-ink-foreground/30">|</span><span className="text-lg font-bold">$100</span><span className="text-sm text-ink-foreground/60">/retainer</span></p>
            </div>
            <ul className="grid gap-x-8 gap-y-3 font-lato text-[15px] text-ink-foreground/85 sm:grid-cols-2 lg:border-l lg:border-ink-foreground/10 lg:pl-10">
              {["Pay-as-you-go", "No monthly minimum", "Free Message Delivery", "Secure Client Portal Access", "Fully HIPAA Compliant"].map((x) => (
                <li key={x} className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />{x}</li>
              ))}
            </ul>
            <div className="lg:w-56"><Started /></div>
          </div>
        </div>
        <p className="mt-8 text-center font-lato text-sm text-ink-foreground/75">*Additional usage, overages, setup fees, and add-ons may apply.</p>
      </div>
    </section>
  );
}

export function Decisions() {
  const qs: [string, React.ReactNode][] = [
    ["Why does confidential call handling fail when the intake script looks compliant on paper?", <>Scripts that include disclaimers but lack agent training on when to stop asking questions create exposure. The language is correct, but the conversation crosses into advice territory when the agent misses the boundary. Our <L to="/services/legal-call-answering/">legal call answering</L> and <L to="/services/virtual-assistant-receptionists/">virtual receptionist</L> teams follow firm-approved boundaries on every call.</>],
    ["What causes qualified leads to disappear between the intake call and the retainer signature?", <>The handoff breaks when intake data does not map directly into the case management system. Attorneys receive incomplete notes, delay follow-up, and the prospect calls another firm. <L to="/services/legal-intake/">Legal intake services</L> that sync to your CRM, paired with <L to="/services/contract-retainer/">contract and retainer services</L>, close that gap.</>],
    ["Does bilingual intake actually increase conversion, or just call volume?", <>Spanish-speaking callers who reach an English-only service hang up and try the next firm. Bilingual coverage captures those inquiries, but conversion depends on whether the Spanish script matches the rigor of the English one. Our <L to="/services/legal-intake/">bilingual legal intake</L> uses the same qualification steps in both languages.</>],
  ];
  return (
    <section className="px-5 py-20">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <h2 className="font-display text-[26px] font-bold leading-tight md:text-[30px] xl:text-[32px]">Legal Intake and Answering Decisions That Catch Law Firms Off Guard</h2>
          <img loading="lazy" decoding="async" src={decisions.url} alt="" className="mt-6 aspect-[4/3] w-full rounded-2xl object-cover shadow-xl lg:hidden" />
          {qs.map(([q, a]) => (
            <div key={q} className="mt-8 border-l-2 border-brand pl-5">
              <h3 className="font-display text-lg font-bold leading-snug text-brand md:text-xl">{q}</h3>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-muted-foreground">{a}</p>
            </div>
          ))}
          <div className="mt-8"><CTA /></div>
        </div>
        <img loading="lazy" decoding="async" src={decisions.url} alt="Legal intake specialists at work" className="hidden aspect-[4/5] w-full lg:block rounded-2xl object-cover shadow-xl" />
      </div>
    </section>
  );
}

export function RetainerSystem() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative hidden pb-24 lg:block">
          <img loading="lazy" decoding="async" src={retainer.url} alt="Attorney on a call" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-xl" />
          <div className="absolute bottom-0 left-6 right-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-background p-5 text-center shadow-lg"><p className="font-display text-2xl font-bold text-brand">67%</p><p className="mt-2 font-display text-xs font-bold uppercase leading-snug tracking-wide">Of clients hire the first lawyer they speak to</p><p className="mt-1 font-body text-[10px] text-muted-foreground">Source: Clio Legal Trends Report</p></div>
            <div className="rounded-xl border border-border bg-background p-5 text-center shadow-lg"><p className="font-display text-2xl font-bold font-semibold text-brand">24/7/365</p><p className="mt-2 font-display text-xs font-bold uppercase leading-snug tracking-wide">Live legal intake coverage</p></div>
          </div>
        </div>
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-brand">Stop Losing Leads</p>
          <h2 className="mt-4 font-display text-[26px] font-bold leading-tight md:text-[30px] xl:text-[32px]">The Intake-to-Retainer System That Turns Qualified Leads Into Signed Clients</h2>
          <img loading="lazy" decoding="async" src={retainer.url} alt="" className="mt-6 aspect-[4/3] w-full rounded-2xl object-cover shadow-xl lg:hidden" />
          <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden"><div className="rounded-xl border border-border bg-background p-4 text-center shadow"><p className="font-display text-xl font-bold text-brand">67%</p><p className="mt-1 font-display text-[10px] font-bold uppercase leading-snug tracking-wide">Of clients hire the first lawyer they speak to</p><p className="mt-1 font-body text-[10px] text-muted-foreground">Source: Clio Legal Trends Report</p></div><div className="rounded-xl border border-border bg-background p-4 text-center shadow"><p className="font-display text-xl font-bold text-brand">24/7/365</p><p className="mt-1 font-display text-[10px] font-bold uppercase leading-snug tracking-wide">Live legal intake coverage</p></div></div>
          <p className="mt-5 font-body text-[15px] leading-relaxed text-muted-foreground">The part that stresses most firms is not the intake call itself but the gap between qualification and signature. Qualified leads who leave the conversation without a signed retainer rarely circle back, and most firms discover that gap only after reviewing conversion data months later.</p>
          <h3 className="mt-7 font-display text-lg font-bold text-brand md:text-xl">What Separates Qualification From Conversion</h3>
          <p className="mt-4 font-body text-[15px] leading-relaxed text-muted-foreground">When a firm relies on next-day staff follow-up, lead momentum drops fast. Sending the retainer by text or email right after qualification removes that delay before the caller starts dialing competing firms. Our <L to="/services/contract-retainer/">contract and retainer team</L> handles that dispatch and follow-up for you.</p>
          <Bullets items={[["E-Signature Integration", "The retainer is sent within minutes of qualification."], ["Follow-Up Architecture", "Multi-touch sequences recover unsigned retainer agreements."], ["CRM Field Mapping", "Intake data flows directly into case management."]]} />
          <p className="mt-6 font-body text-[15px] leading-relaxed text-muted-foreground">According to the Clio Legal Trends Report, 67% of legal clients hire the first attorney they speak with. That is why every qualified call follows a firm-approved checklist, with intake data mapped into Clio, Filevine or Lead Docket so your attorneys see the full case before they call back.</p>
          <div className="mt-9"><CTA /></div>
        </div>
      </div>
    </section>
  );
}

export function Integrations() {
  const logos = [[pD, "Zapier"], [pE, "Litify"], [pC, "Salesforce"], [pB, "SmartAdvocate"], [pA, "Law Ruler"]] as const;
  return (
    <section className="px-5 py-24">
      <div className="mx-auto max-w-[1400px] text-center">
        <p className="font-display text-4xl text-brand">Seamless Workflow</p>
        <h2 className="mt-10 font-display text-5xl font-bold leading-tight md:text-[56px]">Integrates Directly With<br />Your Tech Stack</h2>
        <p className="mx-auto mt-10 max-w-[840px] font-display text-base leading-relaxed">The intake platform that integrates directly with your tech stack eliminates the manual data entry that creates audit gaps and slows retainer turnaround. When call data flows into Clio or Filevine without human handoff, the qualified lead who called at midnight already exists as a matter record by morning.</p>
        <div className="group relative mt-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-8 group-hover:[animation-play-state:paused]">
            {[...logos, ...logos, ...logos, ...logos].map(([l, n], i) => (
              <div key={i} className="grid h-40 w-64 shrink-0 place-items-center rounded-xl bg-background p-6 shadow-sm"><img loading="lazy" decoding="async" src={l.url} alt={n} className="max-h-28 w-auto object-contain" /></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const faqs: [string, React.ReactNode][] = [
  ["Why do so many qualified callers hang up before a law firm answers?", <>Callers under stress hang up quickly when nobody picks up, and the next firm is one tap away. Retention improves when a live person answers right away and opens with case-specific language instead of a generic greeting. <L to="/services/legal-call-answering/">24/7 legal call answering</L> keeps a trained specialist on every call, day or night.</>],
  ["How does Alert Communications handle after-hours calls differently from voicemail or automated systems?", <>Alert Communications uses live operators trained in legal intake protocols to answer after-hours calls, capturing case details and urgency markers that voicemail cannot. They ask qualifying questions, assess urgency, and route cases based on practice area. High-value cases trigger immediate attorney notification through our <L to="/services/legal-call-answering/">after-hours legal call answering</L>, not next-day follow-up.</>],
  ["How does Alert Communications train receptionists to handle sensitive legal intake calls?", <>Alert Communications trains intake specialists on your practice-area qualification scripts, firm-approved conflict screening rules, and how your CRM fields map in Clio, Filevine or Lead Docket. Training also covers empathy without legal advice. See how it works on our <L to="/services/legal-intake/">legal intake services</L> page.</>],
  ["What information do legal intake specialists actually need to collect before an attorney reviews a case?", <>Intake specialists gather conflict checks, incident details, statute of limitations triggers, and insurance coverage before attorney review. The depth collected determines whether the handoff becomes a consultation, which is why our <L to="/services/legal-intake/">legal intake team</L> uses a checklist built for each practice area.</>],
  ["What happens when a law firm's intake process conflicts with how their best referral sources actually send cases?", "Intake friction occurs when referral attorneys or professional networks prefer informal case discussions, but the firm requires structured form completion. Conversion rates drop when process design ignores how high-value referrals actually arrive."],
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="px-5 pb-40 pt-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center">
          <p className="font-display text-4xl text-brand">Got questions?</p>
          <h2 className="mt-8 font-display text-5xl font-bold md:text-[56px]">Frequently Asked Questions</h2>
        </div>
        <div className="mt-14 space-y-8">
          {faqs.map(([q, a], i) => (
            <div key={q} className="rounded-sm border border-border bg-background">
              <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-6 py-7 text-left font-body text-xl font-bold">
                {q}<ChevronRight className={`h-6 w-6 shrink-0 text-brand transition-transform ${open === i ? "rotate-90" : ""}`} />
              </button>
              {open === i && <p className="px-6 pb-7 font-body leading-relaxed">{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const steps = [[PhoneCall, "Immediate Response", "Trained legal specialists answer calls live 24/7/365, with real-time attorney escalation instead of voicemail."], [ListChecks, "Custom Qualification", "Agents screen callers using your firm's exact criteria and scripts."], [FileSignature, "Live Retainer Dispatch", "Qualified leads are sent e-sign retainers by text or email right after qualification."]] as const;
  return (
    <section className="relative overflow-hidden bg-background px-5 py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `url(${diagonal.url})`, backgroundSize: "cover" }} />
      <div className="relative mx-auto max-w-[1200px] text-center">
        <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-brand">Proven Process</p>
        <h2 className="mt-4 font-display text-[30px] font-bold md:text-[44px]">From Ring To Retained</h2>
        <p className="mx-auto mt-5 max-w-[680px] font-body text-[15px] leading-relaxed text-muted-foreground">We have the experience to know what works, and our services can be customized to suit your specific practice area, geography, and client base.</p>
        <ol className="relative mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
          <div aria-hidden className="absolute left-[16.66%] right-[16.66%] top-[60px] hidden border-t-2 border-dashed border-brand/25 md:block" />
          {steps.map(([Icon, t, d], i) => (
            <li key={t} className="group relative rounded-2xl border border-border bg-background px-7 pb-8 pt-7 text-left shadow-[0_10px_30px_-18px] shadow-ink/30 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_24px_48px_-20px] hover:shadow-brand/40">
              <div className="flex items-center justify-between">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-ink text-ink-foreground transition-colors duration-300 group-hover:bg-brand"><Icon className="h-7 w-7" strokeWidth={1.8} /></span>
                <span className="font-display text-5xl font-extrabold text-transparent [-webkit-text-stroke:1.5px_var(--muted-foreground)] opacity-40 group-hover:opacity-100 transition-colors group-hover:[-webkit-text-stroke:1px_var(--brand)]">0{i + 1}</span>
              </div>
              <p className="mt-6 font-display text-[11px] font-bold uppercase tracking-[0.25em] text-brand">Step {i + 1}</p>
              <h3 className="mt-2 font-display text-xl font-bold md:text-[22px]">{t}</h3>
              <div className="mt-4 h-0.5 w-10 bg-brand transition-all duration-300 group-hover:w-20" />
              <p className="mt-4 font-body text-[15px] leading-relaxed text-muted-foreground">{d}</p>
              {i < 2 && <span aria-hidden className="absolute -right-[34px] top-[60px] z-10 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-brand text-brand-foreground shadow-md ring-4 ring-background md:grid"><ArrowRight className="h-4 w-4" /></span>}
              {i < 2 && <span aria-hidden className="absolute -bottom-6 left-1/2 z-10 grid h-8 w-8 -translate-x-1/2 translate-y-1/2 rotate-90 place-items-center rounded-full bg-brand text-brand-foreground ring-4 ring-background md:hidden"><ArrowRight className="h-4 w-4" /></span>}
            </li>
          ))}
        </ol>
        <div className="mt-14"><CTA /></div>
      </div>
    </section>
  );
}

export function FinalCTA({ title, text, bullets }: { title?: string; text?: string; bullets?: string[] } = {}) {
  return (
    <section className="relative overflow-hidden px-4 py-14 md:px-5 md:py-24">
      <img loading="lazy" decoding="async" src={HERO.src} srcSet={HERO.srcSet} sizes={HERO.sizes} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-ink/75" />
      <div className="relative mx-auto grid max-w-[1400px] items-center gap-10 rounded-2xl border border-ink-foreground/20 bg-gradient-to-br from-brand-deep/95 via-brand-deep/70 to-ink/60 p-4 shadow-2xl md:p-9 lg:grid-cols-2 [&>*]:min-w-0 grid-cols-1">
        <div className="px-1 pt-3 text-center text-ink-foreground md:px-0 md:pt-0 lg:text-left">
          <span className="inline-block rounded-full border border-ink-foreground/30 bg-ink-foreground/10 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.25em]">Ready to grow?</span>
          {title ? <h2 className="mt-4 font-display text-[30px] font-bold leading-[1.1] md:text-[46px]">{title}</h2> : <h2 className="mt-4 font-display text-[34px] font-bold leading-[1.05] md:text-[58px]">Stop Leaving Money <br className="hidden md:block" />On The Table</h2>}
          <p className="mx-auto mt-4 max-w-[520px] font-lato text-[15px] leading-relaxed text-ink-foreground/90 md:mt-8 md:text-base lg:mx-0">{text ?? "Join the elite law firms that trust Alert Communications to capture every lead, answer every call, and drive explosive growth."}</p>
          <ul className="mt-6 grid grid-cols-2 gap-2.5 text-left font-lato text-[13px] font-bold md:mt-9 md:block md:space-y-4 md:text-base">
            {(bullets?.length ? bullets : ["No Long-Term Contracts", "24/7 Legal Answering Services", "Client Intake Procedure Mapped To Your Practice", "Live Chat & Communication Available"]).map((x) => (
              <li key={x} className="flex items-start gap-2 rounded-xl border border-ink-foreground/15 bg-ink-foreground/10 p-3 leading-snug md:items-center md:gap-3 md:border-0 md:bg-transparent md:p-0"><CheckCircle2 className="h-5 w-5 shrink-0 fill-brand text-ink-foreground md:h-7 md:w-7" />{x}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl bg-background px-4 py-8 text-center shadow-xl md:px-6 md:py-14">
          <h3 className="font-display text-[28px] font-bold leading-tight md:text-[46px]">Let's Build Your <span className="text-brand">Growth Plan</span></h3>
          <p className="mx-auto mt-3 max-w-[480px] font-lato text-[15px] text-muted-foreground md:mt-6 md:text-base">Every law firm is different. Get a custom communication strategy designed for your goals and budget.</p>
          <div className="mt-6 md:mt-9"><CTA /></div>
          <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 font-lato text-sm md:mt-6 md:text-base">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 fill-brand text-background md:h-7 md:w-7" />Personalized Recommendations</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 fill-brand text-background md:h-7 md:w-7" />Fast Response</span>
          </div>
        </div>
      </div>
    </section>
  );
}

const FOOT: Record<string, string> = { "About Us": "/about", Plans: "/plans", FAQs: "/about/faq", "Service Area": "/service-area", Blog: "/blog", Testimonials: "/testimonials", "Join Our Team": "/careers", "Case Studies": "/case-studies", "Client Support": "/client-support/", DPA: "/data-processing-addendum/", "Terms & Conditions": "/contract-terms-and-conditions/", "Privacy Policy": "/privacy-policy/", "CCPA Information Request": "/ccpa-information-request/" };

function DisclaimerLink() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="hover:text-brand">Disclaimer</button>
      {open && (
        <div role="dialog" aria-modal="true" aria-labelledby="disclaimer-title" onClick={() => setOpen(false)} className="fixed inset-0 z-[100] grid place-items-center bg-ink/80 p-5">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[900px] bg-footer px-8 py-12 text-left text-ink-foreground shadow-2xl md:px-14">
            <button type="button" aria-label="Close disclaimer" onClick={() => setOpen(false)} className="absolute right-4 top-3 text-2xl leading-none text-ink-foreground hover:text-brand">×</button>
            <h2 id="disclaimer-title" className="font-display text-[25px] font-bold uppercase md:text-[36px]">Disclaimer</h2>
            <p className="mt-5 font-lato text-[16px] leading-relaxed md:text-[18px]">The information on this website is for informational purposes only; it is deemed accurate but not guaranteed. It does not constitute professional advice. All information is subject to change at any time without notice. Contact us for complete details.</p>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const cols: [string, string[]][] = [
    ["Services", ["Legal Answering Services", "Legal Intake Services", "Legal Contract & Retainer Services", "Legal Live Chat & Text Services", "Legal Virtual Receptionists", "Mass Tort Services", "Post Retainer Services", "Voice + AI Services"]],
    ["Our Company", ["About Us", "Plans", "FAQs", "Service Area", "Blog", "Testimonials", "Join Our Team", "Case Studies"]],
    ["Support & Legal", ["Client Support", "DPA", "Terms & Conditions", "Privacy Policy", "CCPA Information Request"]],
  ];
  return (
    <footer className="bg-footer px-5 pt-16 text-ink-foreground">
      <div className="mx-auto grid max-w-[1400px] gap-10 pb-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div>
          <img loading="lazy" decoding="async" src={logoWhite.url} alt="Alert Communications" className="ml-5 h-12 w-auto" />
          <p className="mt-10 flex items-center gap-4 font-lato text-xl"><Phone className="h-6 w-6 text-brand" />Phone:</p>
          <div className="ml-11 mt-4 font-lato">
            <p>Sales:</p><a href="tel:805-516-7409" className="text-2xl font-semibold">805-516-7409</a>
            <p className="mt-3">Customer Service:</p><a href="tel:805-477-2120" className="text-2xl font-semibold">805-477-2120</a>
            <p className="mt-2 text-xs">*Intended for law firms only. We do not provide legal advice.</p>
          </div>
          <p className="mt-6 font-display text-xl font-bold">STAY IN TOUCH</p>
          <div className="mt-4 flex gap-1.5">
            {([[Facebook, "Facebook", "https://www.facebook.com/AlertComm/"], [Linkedin, "LinkedIn", "https://www.linkedin.com/company/alert-communications_2/"]] as const).map(([I, label, url], i) => <a key={i} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Alert Communications on ${label}`} className="grid h-12 w-12 place-items-center rounded-full bg-background text-foreground"><I className="h-5 w-5" /></a>)}
          </div>
        </div>
        {cols.map(([h, ls]) => (
          <div key={h}>
            <h4 className="font-display text-xl font-bold uppercase">{h}</h4>
            <ul className="mt-8 space-y-4 font-lato text-sm">
              {h === "Services" ? serviceNav.map((sv) => <li key={sv.slug}><Link to="/services/$slug/" params={{ slug: sv.slug }} className="hover:text-brand">{sv.name}</Link></li>) : ls.map((l) => <li key={l}><a href={FOOT[l] ?? "#"} className="hover:text-brand">{l}</a></li>)}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="font-display text-xl font-bold uppercase">Office Location</h4>
          <p className="mt-8 font-lato text-sm">3601 Calle Tecate STE 200<br />Camarillo, CA 93012</p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 border-t border-ink-foreground/10 py-5 font-lato text-sm text-ink-foreground/80">
        <span>© {new Date().getFullYear()} Alert</span>|<DisclaimerLink /><a href="/privacy-policy/" className="hover:text-brand">Privacy Policy</a><a href="/contract-terms-and-conditions/" className="hover:text-brand">Terms</a><a href="/data-processing-addendum/" className="hover:text-brand">DPA</a>
      </div>
    </footer>
  );
}

export function TexturedMain({ children }: { children: React.ReactNode }) {
  return <div style={textureBg}>{children}</div>;
}
