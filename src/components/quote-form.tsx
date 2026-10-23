import { useLeadForm } from "@/lib/use-lead-form";
import { CheckCircle2, Lock, ArrowRight, User, Mail, Building2, Phone, MessageSquare } from "lucide-react";

export function QuoteForm({ title = <>Get Your <span className="font-extrabold">Personalized</span> Quote</>, eyebrow = "Free, no obligation", button = "Get My Quote" }: { title?: React.ReactNode; eyebrow?: string; button?: string } = {}) {
  const { sent, pending, error, onSubmit } = useLeadForm("quote_form");
  const wrap = "group relative flex items-center rounded-xl border border-border bg-background transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15";
  const icon = "pointer-events-none ml-3.5 h-4 w-4 shrink-0 text-muted-foreground transition group-focus-within:text-brand";
  const input = "w-full bg-transparent px-3 py-3 font-lato text-[15px] text-foreground outline-none placeholder:text-muted-foreground/70";
  return (
    <div id="quote" className="relative scroll-mt-28 overflow-hidden rounded-3xl bg-background text-foreground shadow-2xl shadow-ink/40 ring-1 ring-ink-foreground/10">
      <div className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-deep px-6 py-5 text-center text-brand-foreground md:px-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-foreground/10 blur-2xl" />
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-brand-foreground/80">{eyebrow}</p>
        <h2 className="mt-1 font-display text-[23px] font-light uppercase leading-tight md:text-[27px]">{title}</h2>
      </div>
      {sent ? (
        <div className="p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 fill-brand text-background" />
          <p className="mt-4 font-display text-xl font-bold">Thanks, request received.</p>
          <p className="mt-2 font-lato text-muted-foreground">Our team will reach out shortly.</p>
        </div>
      ) : (
        <form className="space-y-3 p-6 md:p-7" onSubmit={onSubmit} aria-busy={pending}>
          <input hidden type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
          <label className={wrap}><User className={icon} /><input required name="name" placeholder="Full name *" aria-label="Full name" className={input} /></label>
          <label className={wrap}><Mail className={icon} /><input required type="email" name="email" placeholder="Email address *" aria-label="Email address" className={input} /></label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={wrap}><Building2 className={icon} /><input required name="company" placeholder="Law firm *" aria-label="Company" className={input} /></label>
            <label className={wrap}><Phone className={icon} /><input required type="tel" name="phone" placeholder="Phone *" aria-label="Phone number" className={input} /></label>
          </div>
          <label className={`${wrap} items-start`}><MessageSquare className={`${icon} mt-3.5`} /><textarea name="message" rows={2} placeholder="Tell us about your practice" aria-label="Tell us more" className={`${input} resize-none`} /></label>
          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2 font-lato text-xs leading-snug text-muted-foreground"><input required type="checkbox" name="privacy" className="mt-0.5 accent-brand" /><span><strong className="font-semibold text-foreground">Accept Privacy Policy *</strong><br />I accept the <a href="/privacy-policy/" className="underline hover:text-brand">Privacy Policy</a> and <a href="/data-processing-addendum/" className="underline hover:text-brand">Data Processing Addendum</a>.</span></label>
            <label className="flex items-start gap-2 font-lato text-[11px] leading-snug text-muted-foreground"><input type="checkbox" name="sms_consent" className="mt-0.5 accent-brand" /><span><strong className="text-xs font-semibold text-foreground">Accept SMS Policy</strong><br />By checking this box, I consent to receive customer care, account notification, or marketing/promotional SMS messages from Alert Communications. Reply STOP to opt out; Reply HELP for support or visit the respective brand <a href="/contact/" className="underline hover:text-brand">contact page</a>. Message and data rates may apply, and messaging frequency may vary. For more information on how we protect your privacy, please review our <a href="/privacy-policy/" className="underline hover:text-brand">Privacy Policy</a> and SMS <a href="/contract-terms-and-conditions/" className="underline hover:text-brand">Terms &amp; Conditions</a>.</span></label>
          </div>
          {error && <p role="alert" className="text-sm">{error}</p>}
          <button disabled={pending} type="submit" className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand to-brand-deep py-4 font-display text-[15px] font-bold uppercase tracking-wide text-brand-foreground shadow-lg shadow-brand/30 transition hover:-translate-y-0.5 hover:shadow-xl">{button} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
          <p className="flex items-center justify-center gap-1.5 font-lato text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5 text-brand" />Your information stays 100% confidential</p>
        </form>
      )}
    </div>
  );
}
