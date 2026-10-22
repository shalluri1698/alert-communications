import { useState } from "react";
import { Play } from "lucide-react";

/** Lightweight YouTube player: shows the thumbnail and only loads the real player on click. */
export function YouTube({ id, title, className = "" }: { id: string; title: string; className?: string }) {
  const [on, setOn] = useState(false);
  if (on) return <iframe className={`h-full w-full ${className}`} src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
  return (
    <button type="button" onClick={() => setOn(true)} aria-label={`Play video: ${title}`} className={`group relative block h-full w-full ${className}`}>
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" width={480} height={360} className="h-full w-full object-cover" />
      <span className="absolute inset-0 grid place-items-center bg-ink/20 transition group-hover:bg-ink/10">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-brand text-brand-foreground shadow-xl transition group-hover:scale-110"><Play className="ml-1 h-7 w-7 fill-current" /></span>
      </span>
    </button>
  );
}
