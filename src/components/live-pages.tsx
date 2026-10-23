import { SITE_URL, abs } from "@/lib/site";
import { graph, pageNode } from "@/lib/schema";
import { useEffect, useRef, useState } from "react";
import { useLeadForm } from "@/lib/use-lead-form";
import { YouTube } from "@/components/youtube";
import { ChevronRight, CheckCircle2, ArrowRightCircle, MapPin, Star, Smile, DoorOpen, Facebook, Linkedin, Twitter, ChevronDown, ArrowRight } from "lucide-react";
import { Header, Footer, MobileCallBar } from "@/components/home/sections";
import logoWhite from "@/assets/logo-white.png.asset.json";
import raw from "@/data/pages.json";
import { Link } from "@tanstack/react-router";
import blogIndex from "@/data/blog-index.json";
import downloadsOrder from "@/data/downloads-order.json";
import allReviews from "@/data/reviews-all.json";

type Ptr = { url: string };
const LIVE = import.meta.glob("../assets/live/*.asset.json", { eager: true, import: "default" }) as Record<string, Ptr>;
const PAGES = import.meta.glob("../assets/pages/*.asset.json", { eager: true, import: "default" }) as Record<string, Ptr>;
const lv = (n: string) => LIVE[`../assets/live/${n}.asset.json`]?.url ?? "";
const pg = (n: string) => PAGES[`../assets/pages/${n}.asset.json`]?.url ?? "";

type Faq = { q: string; a: string };
const faqData = ((raw as unknown as { pages: Record<string, { sections: { type: string; items?: Faq[] }[] }> }).pages["about/faq"]!.sections.find((s) => s.type === "faq")!.items ?? []) as Faq[];

export function liveHead(title: string, desc: string, path: string, faq = false) {
  return {
    meta: [
      { title }, { name: "description", content: desc },
      { property: "og:title", content: title }, { property: "og:description", content: desc },
      { property: "og:type", content: "website" }, { property: "og:url", content: abs(path) },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: abs(path) }],
    scripts: [graph(pageNode(path, title)), ...(faq ? [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqData.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }] : [])],
  };
}

/* ---------- shared live-site building blocks ---------- */

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="pb-20 font-body text-foreground md:pb-0">
    <Header />
    <main>{children}</main>
    <Footer />
    <MobileCallBar />
  </div>
);
const Box = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={`mx-auto w-full max-w-[1280px] px-5 md:px-8 ${className}`}>{children}</div>;

function Hero({ img, h1, red, sub, center = false, h = "md:min-h-[460px]" }: { img: string; h1: string; red?: string; sub?: string; center?: boolean; h?: string }) {
  return (
    <section className={`relative isolate flex min-h-[300px] items-center overflow-hidden bg-ink py-14 text-ink-foreground ${h}`}>
      <img fetchPriority="high" src={img} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/60" />
      <Box className={center ? "text-center" : ""}>
        <h1 className="font-display text-[32px] font-bold uppercase leading-[1.1] md:text-[52px]">{h1}{red && <> <span className="text-brand">{red}</span></>}</h1>
        {sub && <p className={`mt-6 font-lato text-[16px] leading-relaxed md:text-[17px] ${center ? "mx-auto max-w-[520px]" : "max-w-[880px]"}`}>{sub}</p>}
      </Box>
    </section>
  );
}

const RedBtn = ({ href, children, className = "", download }: { href: string; children: React.ReactNode; className?: string; download?: string | undefined }) => (
  <a href={href} download={download} className={`inline-flex items-center gap-2 bg-brand px-5 py-3.5 font-display text-[15px] font-bold uppercase text-brand-foreground transition hover:bg-brand-deep ${className}`}>{children}<ArrowRightCircle className="h-4 w-4 fill-brand-foreground text-brand" /></a>
);

function Count({ v }: { v: string }) {
  const m = v.match(/^([^\d]*)([\d,]+)(.*)$/)!;
  const target = Number(m[2]!.replace(/,/g, ""));
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(target); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => { const p = Math.min(1, (t - t0) / 1800); setN(Math.round(target * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    io.observe(el); return () => io.disconnect();
  }, [target]);
  return <span ref={ref} className="tabular-nums">{m[1]}{n.toLocaleString("en-US")}{m[3]}</span>;
}

function Stats() {
  const s = [["5,000+", "Active customers"], ["100M+", "Calls Answered"], ["25M+", "Cases Opened"], ["$100M+", "Revenue Created"]];
  return (
    <section className="bg-secondary py-6">
      <Box className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
        {s.map(([v, l]) => (
          <div key={l} className="text-center">
            <p className="font-body text-[34px] font-bold leading-none text-brand md:text-[42px]"><Count v={v!} /></p>
            <p className="mt-2 font-body text-[18px] text-foreground/80">{l}</p>
          </div>
        ))}
      </Box>
    </section>
  );
}

export const Textured = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`relative isolate ${className}`}>
    <img loading="lazy" decoding="async" src={lv("tex.jpg")} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
    {children}
  </section>
);

export function LiveForm({ title = true, heading }: { title?: boolean; heading?: string }) {
  const { sent, pending, error, onSubmit } = useLeadForm("live_form");
  const lbl = "block font-body text-[14px] font-bold";
  const inp = "mt-1 w-full border border-ink/40 bg-background px-2 py-1.5 text-[14px] text-foreground outline-none focus:border-ink";
  return (
    <div className="rounded-[20px] bg-gradient-to-b from-brand to-brand-deep px-5 pb-10 pt-12 text-brand-foreground shadow-xl">
      {heading && <h2 className="text-center font-display text-[32px] font-bold uppercase leading-[1.1]">{heading}</h2>}
      {title && !heading && <h2 className="text-center font-display text-[32px] font-light uppercase leading-[1.1]">Get Your<br /><span className="font-bold">Personalized</span><br />Quote</h2>}
      {sent ? <p className="mt-10 text-center font-display text-xl font-bold">Thank you! Your request has been received.</p> : (
        <form className="mt-8 space-y-3" onSubmit={onSubmit} aria-busy={pending}>
          {[["Full name", "text", "name"], ["Email address", "email", "email"], ["Company", "text", "company"], ["Phone Number", "tel", "phone"]].map(([l, t, n]) => (
            <label key={n} className={lbl}>{l} <span className="text-brand-foreground/70">*</span><input required type={t} name={n} className={inp} /></label>
          ))}
          <label className={lbl}>Tell us more<input name="message" className={inp} /></label>
          <FormConsent />
          {error && <p role="alert" className="text-sm md:col-span-full">{error}</p>}
          <button disabled={pending} className="mt-2 w-full bg-ink py-2.5 font-body text-[15px] uppercase text-ink-foreground hover:bg-ink/85">Submit Request</button>
        </form>
      )}
    </div>
  );
}

const FormConsent = () => (
  <div className="space-y-3 pt-1 font-body text-[11px] leading-snug">
    <input hidden type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
    <label className="flex items-start gap-1.5 italic"><input required type="checkbox" name="privacy" className="mt-0.5" />Accept Privacy Policy*</label>
    <p>I accept the <a href="/privacy-policy/" className="underline">Privacy Policy</a> and <a href="/data-processing-addendum/" className="underline">Data Processing Addendum</a>. *</p>
    <label className="flex items-start gap-1.5 italic"><input type="checkbox" name="sms_consent" className="mt-0.5" />Accept SMS Policy</label>
    <p>By checking this box, I consent to receive customer care, account notification, or marketing/promotional SMS messages from Alert Communications. Reply STOP to opt out; reply HELP for support or visit the respective brand <a href="/contact/" className="underline">contact page</a>. Message and data rates may apply, and messaging frequency may vary. For more information on how we protect your privacy, please review our <a href="/privacy-policy/" className="underline">Privacy Policy</a> and SMS <a href="/contract-terms-and-conditions/" className="underline">Terms &amp; Conditions</a>.</p>
  </div>
);

const WithForm = ({ children }: { children: React.ReactNode }) => (
  <section className="py-6 md:py-6">
    <Box className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_480px] xl:gap-16">
      <div className="min-w-0">{children}</div>
      <div><div className="lg:sticky lg:top-28"><LiveForm /></div></div>
    </Box>
  </section>
);

const Check = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <li className="flex items-center gap-3"><CheckCircle2 className={`h-5 w-5 shrink-0 ${light ? "fill-brand text-brand-foreground" : "fill-brand text-background"}`} /><span>{children}</span></li>
);

function LiveCTA({ tel = "tel:844-236-2485", h2 = "Stop Leaving Money On The Table", download = false }: { tel?: string; h2?: string; download?: boolean }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink py-12 md:py-[50px]">
      <img loading="lazy" decoding="async" src={lv("cta-bg.png")} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-ink/70" />
      <Box>
        <div className="grid items-center gap-8 rounded-sm border border-ink-foreground/15 bg-gradient-to-r from-brand-deep/80 to-ink/40 p-6 md:grid-cols-2 md:p-6">
          <div className="text-ink-foreground">
            <h2 className="max-w-[420px] font-display text-[36px] font-bold leading-[1.1] md:text-[46px]">{h2}</h2>
            <p className="mt-5 max-w-[470px] font-body text-[14px] leading-relaxed">Join the elite law firms that trust Alert Communications to capture every lead, answer every call, and drive explosive growth.</p>
            <ul className="mt-6 grid gap-3 font-body text-[14px] font-bold">
              {["No Long-Term Contracts", "24/7 Legal Answering Services", "Client Intake Procedure Mapped To Your Practice", "Live Chat & Communication Available"].map((x) => <Check key={x} light>{x}</Check>)}
            </ul>
          </div>
          <div className="rounded-md bg-background p-8 text-center md:p-10">
            {download ? (
              <>
                <h2 className="font-display text-[34px] font-bold leading-tight md:text-[44px]">Free Download</h2>
                <p className="mx-auto mt-5 max-w-[460px] font-body text-[14px] leading-relaxed text-muted-foreground">If you’re looking to increase law firm revenue, capturing, qualifying and converting prospective clients is crucial – and it starts with a prompt response. Leaving calls unanswered and neglecting web leads is the easiest way to miss out on new business. Our legal-only call, intake and retainer services are designed to save you time and maximize a firm’s revenue.</p>
                <RedBtn href="/blog/" className="mt-6">Learn More</RedBtn>
              </>
            ) : (
              <>
                <h2 className="font-display text-[32px] font-bold leading-tight md:text-[40px]">Let's Build Your <span className="text-brand">Growth Plan</span></h2>
                <p className="mx-auto mt-5 max-w-[460px] font-body text-[15px] leading-relaxed text-muted-foreground">Every law firm is different. Get a custom communication strategy designed for your goals and budget.</p>
                <RedBtn href={tel} className="mt-6">Call For A Free Assessment</RedBtn>
                <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 font-body text-[14px]"><Check>Personalized Recommendations</Check><Check>Fast Response</Check></ul>
              </>
            )}
          </div>
        </div>
      </Box>
    </section>
  );
}

const Watermark = ({ className = "opacity-[0.07]" }: { className?: string }) => <img loading="lazy" decoding="async" src={logoWhite.url} alt="" className={`pointer-events-none absolute left-1/2 top-1/2 w-[90%] -translate-x-1/2 -translate-y-1/2 ${className}`} />;
const Stars = ({ className = "" }: { className?: string }) => <div className={`flex gap-0.5 ${className}`}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-5 w-5 fill-current" />)}</div>;

/* ---------- 1. About ---------- */
export function LiveAbout() {
  return (
    <Shell>
      <Hero img={pg("hero-about.png")} h1="About Us" center sub="We combine decades of legal intake expertise, 24/7/365 bilingual support, and state-of-the-art infrastructure to ensure your practice never misses an opportunity." />
      <Stats />
      <Textured className="py-14 md:py-16">
        <Box>
          <h2 className="text-center font-display text-[30px] font-bold uppercase text-brand md:text-[42px]">Alert</h2>
          <h2 className="mt-2 text-center font-display text-[32px] font-bold md:text-[50px]">24/7/365 Legal Intake</h2>
          <div className="mt-10 grid items-start gap-8 md:grid-cols-[55%_1fr]">
            <div className="aspect-video overflow-hidden rounded-xl bg-ink">
              <YouTube id="Tl6z49pd8NA" title="Alert Partners with Law Firms to Improve ROI" />
            </div>
            <p className="font-body text-[17px] leading-relaxed">Alert Communications supports law firms and legal marketing agencies nationwide by reducing missed calls, screening potential clients to identify the right cases and opportunities and converting those opportunities into paying clients. The goal? Grow law firm revenue. Founded in 1965, we serve only the legal industry. Our expertly trained and empathetic intake specialists act as an extension of any law firm, working 24/7/365 in both English and Spanish – or just for overflow or off-hours – so you can focus on what you do best, while we take care of the rest.</p>
          </div>
        </Box>
      </Textured>
      <section className="py-14 md:py-20">
        <Box className="md:px-[30px]">
          <h2 className="font-display text-[32px] font-bold md:text-[50px]">Our Partners</h2>
          <div className="mt-10 grid max-w-[600px] grid-cols-2 gap-3 sm:grid-cols-3 md:mt-14">
            {[5, 4, 3, 2, 1].map((i) => (
              <div key={i} className="grid h-[108px] place-items-center border border-border bg-background p-4 shadow-[0_0_8px_rgba(0,0,0,0.25)]">
                <img src={pg(`aff-${i}.png`)} alt="Partner law firm" loading="lazy" className="max-h-[70px] w-auto object-contain" />
              </div>
            ))}
          </div>
        </Box>
      </section>
    </Shell>
  );
}

/* ---------- 2. Who We Are ---------- */
const NumCard = ({ n, title, children }: { n: string; title: string; children: React.ReactNode }) => (
  <div className="rounded-[20px] bg-gradient-to-b from-secondary to-background p-5 md:p-6">
    <h2 className="font-display text-[30px] font-bold leading-none text-brand">{n}</h2>
    <h2 className="mt-3 font-display text-[24px] font-medium md:text-[28px]">{title}</h2>
    <div className="mt-4 space-y-3 font-body text-[15px] leading-relaxed">{children}</div>
  </div>
);
export function LiveWhoWeAre() {
  return (
    <Shell>
      <Hero img={pg("hero-who.png")} h1="Who" red="We Are" />
      <WithForm>
        <div className="space-y-6 pt-6">
          <p className="font-body text-[15px] leading-relaxed">Alert is a 55,000-square-foot, 400+ person legal-only call center located in Camarillo, CA. Founded in 1965, Alert services thousands of attorneys and law firms across the nation. We have completed millions of new client intakes and helped with retainer e-signing for thousands of new clients with law firms and legal marketing agencies. Our customer service and expertly trained intake specialists act as an extension of your law firm working 24/7/365 in both English and Spanish.</p>
          <div>
            <h3 className="font-body text-[20px] leading-snug">"Our mission: To serve as the voice of our clients, driving their growth through exceptional experiences."</h3>
            <p className="mt-4 font-body text-[14px] text-muted-foreground">David Lord, President</p>
          </div>
          <NumCard n="01" title="MTVA Founding Member"><p>As an MTVA Member, we strive to set vendor standards for “Best Practices” within the mass tort legal community based on ethical ideals and practices that will elevate the quality of client services, distinguish members to existing and potential clients, and earn the trust of trial lawyers.</p></NumCard>
          <NumCard n="02" title="ATSI Gold 24/7 Call Center Certification">
            <p>In July 2007, Alert received the Association of Teleservices International (ATSI) Gold 24/7 Call Center Certification.</p>
            <p>The certification program sets forth nearly sixty [60] criteria that need to be met or exceeded. They represent a collection of the best practices and guidelines that telephone answering service sites adhere to. Upon receiving Certification status, Alert has demonstrated to the satisfaction of the Certification Committee (which includes on-site inspections) a high level of proficiency in recovery techniques, exceptional business practices, documentation of procedures, and levels of redundancy necessary for 24/7 preparedness.</p>
          </NumCard>
          <NumCard n="03" title="Technology">
            <p>The latest technology is the driving force behind Alert, and it impacts the quality of every call. From the way your calls are handled to the way important data is collected, we prioritize new methodologies. Alert employs the Startel Windows-based Call Management Center and other advanced call-routing technologies which allow us to bring your business:</p>
            <ul className="mt-5 space-y-4 font-semibold">
              {["Advanced scripting functionality with both menu and response-based prompts to accommodate even the most complex accounts with the utmost speed and efficiency.", "Call routing and management capabilities for the optimal use of our Centers’ resources.", "Web-based workstations allowing Alert Agents access to the Internet enabling them to quickly collect important information during calls."].map((x) => <li key={x} className="flex gap-4"><CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 fill-brand text-background" />{x}</li>)}
            </ul>
          </NumCard>
        </div>
      </WithForm>
      <div className="h-10" />
    </Shell>
  );
}

/* ---------- 3. FAQ ---------- */
function FaqRow({ f }: { f: Faq }) {
  const [o, setO] = useState(false);
  return (
    <div className="border border-border bg-background">
      <button type="button" onClick={() => setO(!o)} aria-expanded={o} className="flex w-full items-center justify-between gap-4 px-3 py-3.5 text-left font-body text-[15px] font-bold uppercase md:text-[16px]">
        {f.q.toUpperCase()}<ChevronRight className={`h-5 w-5 shrink-0 text-brand transition-transform ${o ? "rotate-90" : ""}`} />
      </button>
      {o && <p className="px-3 pb-4 font-body text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>}
    </div>
  );
}
export function LiveFaq() {
  return (
    <Shell>
      <Hero img={pg("hero-faq.png")} h1="Frequently Asked" red="Questions" />
      <Textured className="py-14 md:py-20">
        <Box>
          <h2 className="text-center font-display text-[24px] text-brand md:text-[32px]">Got questions?</h2>
          <h2 className="mt-4 text-center font-display text-[32px] font-bold md:text-[54px]">Frequently Asked Questions</h2>
          <div className="mt-10 space-y-4">{faqData.map((f) => <FaqRow key={f.q} f={f} />)}</div>
        </Box>
      </Textured>
    </Shell>
  );
}

/* ---------- 4. Partnerships ---------- */
const partnerLogos = ["Agency Bell", "CAMO", "Data-Vative", "Exults", "Haskins Company", "Justrice HQ", "Lawfty", "Leads to Cases", "Premier Marketing", "Rob Levine Legal Solutions", "Rocket Pilots", "Sanguine Strategic Partners"];
const Bul = ({ items }: { items: [string, string][] }) => (
  <ul className="mt-4 list-disc space-y-2 pl-5 font-body text-[14px] leading-relaxed">
    {items.map(([b, t]) => <li key={b}><strong>{b}</strong> {t}</li>)}
  </ul>
);
export function LivePartnerships() {
  return (
    <Shell>
      <section className="relative isolate flex min-h-[340px] items-center overflow-hidden bg-ink py-14 text-ink-foreground md:min-h-[480px]">
        <img fetchPriority="high" src={pg("hero-team.jpg")} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-ink/60" />
        <Box>
          <h1 className="max-w-[1200px] font-display text-[32px] font-bold uppercase leading-[1.1] md:text-[52px]">Partnerships: Empower Your Team and Protect Your Clients</h1>
          <p className="mt-6 max-w-[880px] font-lato text-[17px] leading-relaxed">The Value of Partnership: Our partnership program offers competitive commissions and full technical support, allowing you to provide clients with trusted emergency communication solutions while generating revenue without implementation overhead.</p>
          <p className="mt-4 max-w-[880px] font-lato text-[17px] leading-relaxed">Alert Communications’ partnership programs connect organizations with integrated emergency notification, physical security, and business continuity solutions through technology integrations, regional reseller networks, and referral opportunities.</p>
          <RedBtn href="tel:844-236-2485" className="mt-8">Call For A Free Assessment</RedBtn>
        </Box>
      </section>
      <div className="pt-10" />
      <WithForm>
        <h2 className="font-display text-[32px] font-bold md:text-[50px]">List of Partners</h2>
        <p className="mt-8 font-body text-[17px] leading-relaxed">Our Partner Network: Our certified partner ecosystem connects emergency communication systems with enterprise risk platforms, physical security infrastructure, and business continuity solutions to provide seamless protection across your organization.</p>
        <p className="mt-4 font-body text-[17px] leading-relaxed">We collaborate with leading technology providers to deliver comprehensive emergency communication solutions.</p>
        <div className="mt-16 grid max-w-[320px] grid-cols-2 gap-5 sm:max-w-none sm:grid-cols-2 md:max-w-[640px]">
          {partnerLogos.map((n, i) => (
            <div key={n} className="grid aspect-[384/268] place-items-center overflow-hidden rounded-sm border border-border bg-background shadow-[0_0_6px_rgba(0,0,0,0.2)]">
              <img src={pg(`pp-${i + 1}.${i === 10 ? "avif" : "png"}`)} alt={n} loading="lazy" className="max-h-full w-full object-contain" />
            </div>
          ))}
        </div>
      </WithForm>
      <section className="py-14 md:py-20">
        <Box className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-[30px] font-bold leading-[1.1] md:text-[38px]">Stronger Support. Faster Results. A Partnership You Can Rely On.</h2>
            <h2 className="mt-8 font-display text-[20px] font-bold text-brand">Why Partner with Alert</h2>
            <p className="mt-4 font-body text-[14px] leading-relaxed">Alert Communications offers partners comprehensive technical support, competitive revenue opportunities, and dedicated resources. Our certified integration expertise and proven methodologies help partners deliver reliable emergency communication solutions while building sustainable business growth through trusted collaboration.</p>
            <p className="mt-4 font-body text-[14px] leading-relaxed">Choosing the right partnership means finding a team that understands your business goals and supports your growth. We bring decades of emergency communication expertise and proven integration capabilities to every partnership. Our approach focuses on your success through comprehensive support and revenue opportunities.</p>
            <h2 className="mt-8 font-display text-[20px] font-bold leading-snug text-brand">Partner Benefits That Strengthen Your Service and Revenue Models</h2>
            <Bul items={[["Technical Integration Support:", "Certified expertise ensures seamless platform connectivity and implementation."], ["Revenue Generation Framework:", "Competitive commission structures create sustainable income streams."], ["Ongoing Partner Resources:", "Dedicated account management provides training and marketing support."]]} />
            <p className="mt-4 font-body text-[14px] leading-relaxed">We’ve built our partnership program around your needs and market opportunities. Our team provides the tools and expertise you need to deliver exceptional emergency communication solutions. Join a network of successful partners who trust our commitment to mutual growth.</p>
            <RedBtn href="tel:844-236-2485" className="mt-6">Call For A Free Assessment</RedBtn>
          </div>
          <img src={lv("handshake.png")} alt="" loading="lazy" className="h-full max-h-[900px] w-full rounded-xl object-cover" />
        </Box>
      </section>
      <section className="py-14 md:py-20">
        <Box className="grid items-center gap-10 md:grid-cols-2">
          <img src={lv("teamwork.png")} alt="" loading="lazy" className="w-full rounded-xl object-cover" />
          <div>
            <h2 className="font-display text-[30px] font-bold leading-[1.1] md:text-[38px]">Unified Collaboration for Seamless Security and Communication</h2>
            <h2 className="mt-8 font-display text-[20px] font-bold text-brand">Why Partnerships Work:</h2>
            <p className="mt-4 font-body text-[14px] leading-relaxed">We coordinate multi-vendor security integrations through stakeholder alignment and continuous monitoring. Our collaborative approach eliminates compatibility issues while ensuring consistent policy enforcement. Teams receive hands-on training and ongoing technical support throughout implementation.</p>
            <h2 className="mt-8 font-display text-[20px] font-bold leading-snug text-brand">Our Proven Framework for Building Integrated, Resilient Systems</h2>
            <Bul items={[["Multi-Vendor Coordination:", "We manage technical relationships across your entire security stack seamlessly."], ["Stakeholder Alignment Workshops:", "Your teams receive training to ensure consistent policy enforcement organization-wide."], ["Continuous Integration Monitoring:", "We monitor system performance and proactively resolve compatibility issues."]]} />
            <RedBtn href="tel:844-236-2485" className="mt-6">Call For A Free Assessment</RedBtn>
          </div>
        </Box>
      </section>
      <section className="py-14 md:py-20">
        <Box>
          <h2 className="text-center font-display text-[20px] font-bold text-brand md:text-[24px]">Save Time And Increase Revenue With Business Automation</h2>
          <h2 className="mt-6 text-center font-display text-[30px] font-bold uppercase md:text-[44px]">Benefits of CRM/CMS Integrations</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[["crm-1.jpg", "ico-new.png", "Streamline Processes", "Make client intake, sales and marketing, case management and staff performance tracking easier and more transparent through automation."], ["crm-2.jpg", "ico-human.png", "Retain More Clients", "Keep client data stored in a safe and easily accessible database to improve communication and build better working relationships."], ["crm-3.png", "ico-new.png", "Know Your Numbers", "Generate reports to monitor revenue, identify opportunities for growth and zero in on intake errors for sounder decision-making."]].map(([bg, ic, t, p]) => (
              <div key={t} className="relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-xl p-8 text-center text-ink-foreground">
                <img src={lv(bg!)} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/30 via-ink/70 to-ink/95" />
                <img loading="lazy" decoding="async" src={lv(ic!)} alt="" className="mx-auto h-10 w-10" />
                <h2 className="mt-4 font-display text-[24px] font-bold">{t}</h2>
                <p className="mt-4 font-body text-[13px] leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </Box>
      </section>
      <LiveCTA />
    </Shell>
  );
}

/* ---------- 5. Service Area ---------- */
const states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "Washington, DC", "West Virginia", "Wisconsin", "Wyoming"];
const ABBR: Record<string, string> = { Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO", Connecticut: "CT", Delaware: "DE", Florida: "FL", Georgia: "GA", Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY", Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN", Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT", Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY" };
const REGION: Record<string, string> = {};
([["Northeast", "Connecticut,Maine,Massachusetts,New Hampshire,New Jersey,New York,Pennsylvania,Rhode Island,Vermont"], ["Southeast", "Alabama,Arkansas,Delaware,Florida,Georgia,Kentucky,Louisiana,Maryland,Mississippi,North Carolina,South Carolina,Tennessee,Virginia,West Virginia"], ["Midwest", "Illinois,Indiana,Iowa,Kansas,Michigan,Minnesota,Missouri,Nebraska,North Dakota,Ohio,South Dakota,Wisconsin"], ["Southwest", "Arizona,New Mexico,Oklahoma,Texas"], ["West", "Alaska,California,Colorado,Hawaii,Idaho,Montana,Nevada,Oregon,Utah,Washington,Wyoming"]] as const).forEach(([r, l]) => l.split(",").forEach((s) => (REGION[s] = r)));
const slugOf = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

export function LiveServiceArea() {
  const list = states.filter((s) => ABBR[s]);
  return (
    <Shell>
      <Hero img={pg("hero-area.jpg")} h1="Markets" red="We Serve" />
      <section className="bg-background px-0 py-20 md:py-24">
        <Box>
          <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-brand">States and markets we serve</p>
          <h2 className="mt-4 font-display text-[26px] font-bold leading-tight md:text-[30px] xl:text-[32px]">Pick your state</h2>
          <p className="mt-5 max-w-[760px] font-body text-[15px] leading-relaxed text-muted-foreground">Alert offers cutting-edge legal answering and intake services across the United States. While our headquarters is in California, we have strategic teams on the East and West Coasts to ensure reliable legal support for our clients nationwide. Select your state to see how we cover law firms there.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => (
              <Link key={s} to="/service-area/$state/" params={{ state: slugOf(s) }} className="group flex flex-col rounded-xl border border-border border-t-4 border-t-brand bg-background p-7 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                <span className="flex items-center gap-2 font-display text-[12px] font-bold uppercase tracking-[0.14em] text-muted-foreground"><MapPin className="h-4 w-4 text-brand" />{ABBR[s]} · {REGION[s]}</span>
                <h3 className="mt-3 font-display text-xl font-bold leading-tight md:text-2xl">{s}</h3>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-muted-foreground">24/7 live answering, bilingual intake and CRM sync for {s} law firms.</p>
                <span className="mt-auto flex items-center gap-2 pt-6 font-display text-[13px] font-bold uppercase tracking-[0.16em] text-brand">Explore {s} coverage <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </Box>
      </section>
      <LiveCTA />
    </Shell>
  );
}

/* ---------- 6. Downloads ---------- */
type DlPost = { slug: string; title: string; date: string; image: string | null; excerpt: string };
const dlBySlug = new Map((blogIndex as DlPost[]).map((p) => [p.slug, p]));
const downloads = (downloadsOrder as string[]).map((s) => dlBySlug.get(s)).filter(Boolean) as DlPost[];
const DL_PER = 9;
export function LiveDownloads() {
  const [page, setPage] = useState(1);
  const pages = Math.ceil(downloads.length / DL_PER);
  const items = downloads.slice((page - 1) * DL_PER, page * DL_PER);
  const go = (n: number) => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);
  return (
    <Shell>
      <Hero img={pg("hero-about.png")} h1="Downloads" center />
      <section className="py-14">
        <Box className="max-w-[1140px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]">
            {items.map((p) => (
              <article key={p.slug} className="flex flex-col overflow-hidden rounded-[6px] bg-gradient-to-b from-brand-deep to-ink text-ink-foreground shadow-[0_0_10px_rgba(0,0,0,0.25)]">
                {p.image ? (
                  <Link to="/blog/$slug/" params={{ slug: p.slug }}><img src={p.image} alt="" loading="lazy" className="aspect-[360/252] w-full bg-background object-cover" /></Link>
                ) : null}
                <div className={`flex flex-1 flex-col px-7 pt-7 ${p.image ? "" : "bg-gradient-to-b from-brand to-brand-deep"}`}>
                  <h3 className="font-display text-[21px] font-bold uppercase leading-tight">
                    <Link to="/blog/$slug/" params={{ slug: p.slug }}>{p.title}</Link>
                  </h3>
                  <p className="mt-5 font-lato text-[14px] leading-relaxed tracking-wide text-ink-foreground/85">{p.excerpt.slice(0, 180)}</p>
                  <Link to="/blog/$slug/" params={{ slug: p.slug }} className="mt-auto pb-6 pt-8 font-display text-[12px] font-bold uppercase">Read More »</Link>
                </div>
                <div className="border-t border-ink-foreground/10 bg-ink px-7 py-4 font-lato text-[12px] text-ink-foreground/70">{p.date}</div>
              </article>
            ))}
          </div>
          <nav className="mt-16 flex flex-wrap items-center justify-center gap-3 font-display text-[18px] text-brand md:text-[22px]" aria-label="Pagination">
            {page > 1 ? <button onClick={() => go(page - 1)}>« Previous</button> : null}
            {nums.map((n) => (
              <button key={n} onClick={() => go(n)} aria-current={n === page ? "page" : undefined} className={`grid h-11 w-9 place-items-center border-2 border-brand ${n === page ? "bg-brand text-brand-foreground" : ""}`}>{n}</button>
            ))}
            {page < pages ? <button onClick={() => go(page + 1)}>Next »</button> : null}
          </nav>
        </Box>
      </section>
    </Shell>
  );
}

/* ---------- 7. Virtual Tour ---------- */
export function LiveVirtualTour() {
  const rest = ["vt-02.jpg", "vt-04.jpg", "vt-05.jpg", "vt-06.jpg", "vt-07.jpg", "vt-08.jpg", "vt-09.jpg", "vt-10.jpg", "vt-11.jpg"];
  const Img = ({ n }: { n: string }) => <a href={lv(n)} target="_blank" rel="noreferrer" className="block border-[3px] border-ink"><img src={lv(n)} alt="Alert Communications call center" loading="lazy" className="aspect-[3/2] w-full object-cover" /></a>;
  return (
    <Shell>
      <Hero img={pg("hero-tour.png")} h1="Virtual Tour of Alert’s Legal Call Center" sub="Alert has a 55,000-square-foot, 425-seat call center located in Camarillo, CA." />
      <section className="py-10">
        <Box>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">{["vt-01.jpg", "vt-02.jpg", "vt-03.jpg"].map((n) => <Img key={n} n={n} />)}</div>
          <iframe src="https://walkinto.in/tour/-JFDE7YfRgWJetwNmKfAl" title="Alert Communications 3D virtual tour" className="mt-5 h-[420px] w-full md:h-[600px]" allowFullScreen loading="lazy" />
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">{rest.map((n, i) => <Img key={n + i} n={n} />)}</div>
        </Box>
      </section>
    </Shell>
  );
}

/* ---------- 8. Our Clients ---------- */
const clientQuotes = [
  ["The Derrick Law Firm", "“Alert is rocking our 24/7 availability and has been so wonderful to work with! I can’t say enough about Jenilee Ramos and the way she has been so attentive to our needs! I highly recommend this company.”"],
  ["Scott Law Firm", "“Alert has been a huge help to our office. They now handle our after-hours and overflow phone calls. This gives us peace of mind knowing that people calling are getting a live person on the line. Our account manager, Farrokh, has also been very helpful with any questions we have. I highly recommend them!”"],
  ["Telleria, Telleria, & Levy", "“I have worked with Alert for over six months now and the service has been outstanding. Arturo and Miya in client services are always helpful, and are quick to respond when we need to add services or make adjustments to meet our firm’s needs. I would recommend Alert.”"],
  ["Ryan, LLP", "“We switched from another service that was not answering our calls effectively. Alert service reps are highly trained and have the access to input new callers directly into our case management system. This allows us to focus on the best cases and existing clients, while not being disrupted to speak to potential clients that do not have valid claims. I highly recommend Alert for any personal injury law firm seeking to increase their firm’s productivity.”"],
  ["Dordick Law Firm", "“Prior to hiring Alert, we were using an in-house voicemail system. At first, I was skeptical about hiring an outside service for our after-hours and overflow calls, but from the get-go, I was very pleased with Alert’s professionalism and attention to our needs. Even the initial setup with our account manager, Brittney Ahearn, was painless and seamless. I did a lot of research prior to hiring Alert. I am extremely satisfied with their ability to answer our calls within one or two rings, screen our calls properly and know when to patch a call through after hours and/or advise our clients on simple things like directions to our office and where to park.”"],
];
export function LiveOurClients() {
  return (
    <Shell>
      <Hero img={pg("hero-team.jpg")} h1="Who Are" red="Our Clients" />
      <Stats />
      <section className="py-14 md:py-16">
        <Box>
          <h2 className="text-center font-display text-[24px] font-bold text-brand md:text-[28px]">Hear From Our Clients</h2>
          <h2 className="mx-auto mt-6 max-w-[1100px] text-center font-display text-[30px] font-bold leading-[1.1] md:text-[54px]">Better Results With Alert Call, Intake and Retainer Services</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {clientQuotes.map(([n, q]) => (
              <figure key={n} className="relative isolate min-h-[560px] overflow-hidden rounded-[20px] bg-gradient-to-b from-ink to-brand-deep p-7 text-ink-foreground md:min-h-[620px]">
                <Watermark />
                <Stars />
                <figcaption className="mt-4 font-display text-[28px] font-semibold">{n}</figcaption>
                <blockquote className="mt-6 font-body text-[19px] font-bold italic leading-relaxed">{q}</blockquote>
              </figure>
            ))}
          </div>
        </Box>
      </section>
      <LiveCTA h2="How Alert Can Help Law Firms" download />
    </Shell>
  );
}

/* ---------- 9. Testimonials ---------- */
function ReviewCard({ r }: { r: (typeof allReviews)[number] }) {
  const [open, setOpen] = useState(false);
  const long = r.text.length > 260;
  return (
    <figure className="relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm transition-all before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-brand hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand/10 font-bold text-brand">{r.name.charAt(0)}</span>
        <span className="truncate font-display text-sm font-bold">{r.name}</span>
      </div>
      <Stars className="mt-4 text-star" />
      <blockquote className={`mt-2 font-body text-[15px] leading-relaxed text-muted-foreground ${open || !long ? "" : "line-clamp-5"}`}>&ldquo;{r.text}&rdquo;</blockquote>
      {long && (
        <button onClick={() => setOpen(!open)} aria-expanded={open} className="mt-2 inline-flex items-center gap-1 self-start text-sm font-bold text-foreground hover:text-brand">
          {open ? "Show less" : "Read more"} <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      )}
      <div className="mt-auto flex items-end justify-between pt-4">
        <p className="text-xl font-medium"><span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span></p>
        <a href={r.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-sm font-bold text-brand">View on Google <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
      </div>
    </figure>
  );
}

export function LiveTestimonials() {
  const [shown, setShown] = useState(12);
  return (
    <Shell>
      <Hero img={pg("hero-testi.png")} h1="Hear From" red="Our Clients" />
      <section className="py-14">
        <Box>
          <h2 className="mx-auto max-w-[900px] text-center font-display text-[30px] font-bold leading-[1.1] md:text-[44px]">Better Results With Alert Call, Intake and Retainer Services</h2>
          <div className="mt-10 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {allReviews.slice(0, shown).map((r) => <ReviewCard key={r.url} r={r} />)}
          </div>
          {shown < allReviews.length && (
            <div className="mt-10 text-center">
              <button onClick={() => setShown((s) => s + 12)} className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 font-display text-sm font-bold uppercase tracking-wider text-brand-foreground shadow-lg shadow-brand/30 hover:opacity-90">
                View More Reviews <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
        </Box>
      </section>
      <LiveCTA tel="tel:8054772120" />
    </Shell>
  );
}

/* ---------- 10. Careers ---------- */
export function LiveCareers() {
  return (
    <Shell>
      <Hero img={pg("hero-careers.jpg")} h1="Join Our Team" red="| Careers" />
      <section className="py-12">
        <Box className="grid items-center gap-10 md:grid-cols-2">
          <img src={lv("teamwork.png")} alt="" loading="lazy" className="w-full rounded-xl object-cover md:max-w-[600px]" />
          <div>
            <h2 className="font-display text-[24px] font-bold text-brand">Join our Team</h2>
            <h2 className="mt-6 font-display text-[44px] font-bold md:text-[54px]">CAREERS</h2>
            <p className="mt-4 max-w-[460px] font-body text-[20px] leading-relaxed">Join our team of driven, curious, kind, innovative and resourceful professionals. Fill out the form below or call us today!</p>
            <RedBtn href="https://alertcommunications.applicantpro.com/jobs/" className="mt-6">Apply Now</RedBtn>
          </div>
        </Box>
      </section>
      <section className="py-14 md:py-20">
        <Box>
          <h2 className="text-center font-display text-[20px] font-bold text-brand md:text-[24px]">Learn, Grow and Excel in a Thriving Environment</h2>
          <h2 className="mt-6 text-center font-display text-[32px] font-bold md:text-[54px]">Benefits Of Working At Alert</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[[Smile, "Positive Work Culture", "Our core values are teamwork, obsession (with our clients’ business!), accountability, integrity and diversity – fostering a positive work environment for all."], [DoorOpen, "Career Opportunities", "Alert is on a great tide of expansion, so the opportunities for growth are practically endless for every employee."], [Star, "Excellent Benefits", "Employee benefits include 401k, medical, dental and vision with a generous company contribution towards the cost."]].map(([I, t, p]) => {
              const Icon = I as typeof Star;
              return (
                <div key={t as string} className="min-h-[540px] rounded-[10px] bg-gradient-to-b from-brand via-brand-deep to-ink px-8 pt-8 text-center text-brand-foreground">
                  <Icon className="mx-auto h-12 w-12 fill-brand-foreground text-brand" />
                  <h2 className="mt-6 font-display text-[30px] font-bold">{t as string}</h2>
                  <p className="mt-6 text-left font-body text-[16px] leading-relaxed">{p as string}</p>
                </div>
              );
            })}
          </div>
        </Box>
      </section>
      <LiveCTA tel="tel:8054772120" />
    </Shell>
  );
}

/* ---------- 11. Case Studies ---------- */
export function LiveCaseStudies() {
  const cs = [
    ["cs-1.png", "Personal Injury", "Collaborative Growth Strategy for Maryland Law Firm", "Maryland Law Firm", "Legal_Alert-Communications_Case-Study_Maryland.docx"],
    ["cs-2.png", "Criminal Defense", "A Decade Of Delivering Criminal Defense Intake & Call Services", "Meehan Law Firm", "Legal_Alert-Communications_Case-Study_Meehan-R1.docx"],
  ];
  return (
    <Shell>
      <Hero img={pg("hero-cases.jpg")} h1="Case" red="Studies" />
      <div className="pt-6" />
      <WithForm>
        <div className="space-y-5">
          {cs.map(([img, tag, t, client, doc]) => (
            <article key={t} className="max-w-[720px] rounded-md bg-ink p-5 text-ink-foreground shadow-xl md:p-5">
              <div className="relative">
                <img src={lv(img!)} alt="" loading="lazy" className="aspect-[630/330] w-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-background px-8 py-3.5 font-body text-[22px] font-bold uppercase text-foreground">{tag}</span>
              </div>
              <h3 className="mt-6 font-body text-[26px] leading-tight">{t}</h3>
              <p className="mt-5 font-body text-[15px]"><strong>Client Name: {client}</strong> (3 min read)</p>
              <RedBtn href={lv(doc!)} download={doc} className="my-5">Keep Reading</RedBtn>
            </article>
          ))}
        </div>
      </WithForm>
      <div className="h-10" />
      <LiveCTA />
    </Shell>
  );
}

/* ---------- 12. Client Support ---------- */
export function LiveClientSupport() {
  const { sent, pending, error, onSubmit } = useLeadForm("client_support");
  const inp = "mt-1 w-full border border-ink/40 bg-background px-2 py-1 text-[14px] text-foreground outline-none";
  return (
    <Shell>
      <Hero img={pg("hero-contact.png")} h1="Client Support" center sub="Need help? Contact us by phone, email, or via the web. All inquiries submitted during business hours will be responded to within 2 business days. Inquiries submitted outside of business hours will be responded to within 3 business days." />
      <section className="py-5">
        <Box className="grid gap-5 md:grid-cols-[1fr_2fr]">
          <div className="relative isolate flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-[10px] bg-brand px-8 text-center text-brand-foreground">
            <Watermark className="opacity-[0.1]" />
            <div className="w-full border-y border-brand-foreground/30 py-24">
              <p className="mx-auto max-w-[300px] font-lato text-[17px] leading-relaxed">This service is intended for law firms only. We do not provide legal advice.</p>
              <div className="mx-auto my-6 h-px w-24 bg-brand-foreground/60" />
              <h2 className="font-display text-[28px] font-bold">Stay In Touch</h2>
              <div className="mt-5 flex justify-center gap-3">
                {([[Facebook, "Facebook", "https://www.facebook.com/AlertComm/"], [Linkedin, "LinkedIn", "https://www.linkedin.com/company/alert-communications_2/"]] as const).map(([I, label, url], i) => <a key={i} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Alert Communications on ${label}`} className="grid h-9 w-9 place-items-center bg-background text-foreground"><I className="h-4 w-4" /></a>)}
              </div>
            </div>
          </div>
          <div className="rounded-[10px] bg-muted-foreground p-5 text-ink-foreground">
            {sent ? <p className="py-20 text-center font-display text-xl font-bold">Thank you! Your request has been received.</p> : (
              <form className="space-y-3" onSubmit={onSubmit} aria-busy={pending}>
                {[["Full name", "text", "name"], ["Email address", "email", "email"], ["Company", "text", "company"], ["Phone Number", "tel", "phone"]].map(([l, t, n]) => (
                  <label key={n} className="block font-body text-[14px] font-bold">{l} <span className="text-brand">*</span><input required type={t} name={n} className={inp} /></label>
                ))}
                <label className="block font-body text-[14px] font-bold">Tell us more<input name="message" className={inp} /></label>
                <FormConsent />
                {error && <p role="alert" className="text-sm md:col-span-full">{error}</p>}
                <button disabled={pending} className="w-full bg-ink py-2.5 font-body text-[15px] uppercase text-ink-foreground">Submit Request</button>
              </form>
            )}
          </div>
        </Box>
      </section>
      <div className="h-5" />
    </Shell>
  );
}

/* ---------- Legal documents (Privacy, Terms, DPA) ---------- */
export function LiveLegal({ title, html }: { title: string; html: string }) {
  return (
    <Shell>
      <Hero img={pg("hero-contact.png")} h1={title} center h="md:min-h-[300px]" />
      <section className="py-12">
        <Box>
          <article className="legal-doc mx-auto max-w-[960px] font-lato text-[16px] leading-relaxed text-foreground" dangerouslySetInnerHTML={{ __html: html }} />
        </Box>
      </section>
    </Shell>
  );
}

/* ---------- CCPA Information Request ---------- */
export function LiveCCPA() {
  const { sent, pending, error, onSubmit } = useLeadForm("ccpa_request");
  const inp = "mt-1 w-full border border-ink/40 bg-background px-2 py-1.5 text-[14px] text-foreground outline-none";
  const lab = "block font-body text-[14px] font-bold";
  const req = <span className="text-brand">*</span>;
  return (
    <Shell>
      <Hero img={pg("hero-contact.png")} h1="CCPA Information Request" center h="md:min-h-[300px]" sub="All inquiries will be responded to in a timely manner" />
      <section className="py-8">
        <Box className="mx-auto max-w-[900px]">
          <div className="rounded-[10px] bg-muted-foreground p-6 text-ink-foreground">
            {sent ? <p className="py-20 text-center font-display text-xl font-bold">Thank you! Your request has been received.</p> : (
              <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit} aria-busy={pending}>
                <label className={lab}>Date {req}<input required type="date" name="date" className={inp} /></label>
                <div />
                {[["First Name", "text", "first_name"], ["Last Name", "text", "last_name"], ["Phone Number", "tel", "phone"], ["Your Email", "email", "email"], ["Confirm Email", "email", "email_confirm"]].map(([l, t, n]) => (
                  <label key={n} className={lab}>{l} {req}<input required type={t} name={n} className={inp} /></label>
                ))}
                <div />
                <fieldset className="md:col-span-2">
                  <legend className={lab}>Inquiry Type {req}</legend>
                  <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 font-lato text-[14px]">
                    {["Data Access", "Data Transfer", "Data Edit", "Data Deletion"].map((o) => <label key={o} className="flex items-center gap-2"><input type="checkbox" name="inquiry_type" value={o} className="accent-brand" />{o}</label>)}
                  </div>
                </fieldset>
                <label className={`${lab} md:col-span-2`}>Address {req}<input required name="address" className={inp} /></label>
                <label className={`${lab} md:col-span-2`}>Address 2<input name="address2" className={inp} /></label>
                <label className={lab}>City {req}<input required name="city" className={inp} /></label>
                <label className={lab}>ZIP / Postal Code {req}<input required name="zip" className={inp} /></label>
                <label className={lab}>Country {req}<input required name="country" defaultValue="United States" className={inp} /></label>
                <div />
                <label className={`${lab} md:col-span-2`}>Type Your Message Here<textarea name="message" rows={4} className={inp} /></label>
                <div className="md:col-span-2"><FormConsent /></div>
                {error && <p role="alert" className="text-sm md:col-span-full">{error}</p>}
                <button disabled={pending} className="w-full bg-ink py-2.5 font-body text-[15px] uppercase text-ink-foreground md:col-span-2">Submit</button>
              </form>
            )}
          </div>
        </Box>
      </section>
    </Shell>
  );
}
