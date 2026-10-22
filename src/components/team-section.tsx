import { Linkedin } from "lucide-react";
import { team, type PageTeam } from "@/data/service-team";
import { LINKEDIN } from "@/lib/schema";

export function TeamSection({ t }: { t: PageTeam }) {
  const cols = t.people.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : t.people.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2";
  return (
    <section className="px-5 py-20 md:py-24">
      <div className="mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand">{t.eyebrow}</span>
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">{t.h2}</h2>
          <p className="mt-4 text-muted-foreground">{t.intro}</p>
        </div>
        <div className={`mt-12 grid gap-6 ${cols}`}>
          {t.people.map((p) => {
            const m = team[p.id];
            return (
              <article key={p.id} className="flex flex-col rounded-2xl border border-border border-t-4 border-t-brand bg-background p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={m.photo} alt={`${m.name}, ${m.title} at Alert Communications`} loading="lazy" width={80} height={80} className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-brand/10" />
                  <div>
                    <h3 className="font-display text-lg font-bold">{m.name}</h3>
                    <p className="text-sm font-semibold text-brand">{m.title}</p>
                    {m.since && <p className="text-xs text-muted-foreground">{m.since}</p>}
                    {LINKEDIN[p.id] && (
                      <a href={LINKEDIN[p.id]} target="_blank" rel="noopener noreferrer me" aria-label={`${m.name} on LinkedIn`} className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline">
                        <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-wider text-foreground">{p.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.bio}</p>
                <p className="mt-4 border-t border-border pt-4 text-sm italic text-muted-foreground">{m.personal}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
