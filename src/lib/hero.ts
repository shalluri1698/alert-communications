import d from "@/assets/legal-call-center-hero.webp.asset.json";
import m from "@/assets/legal-call-center-hero-mobile.webp.asset.json";
import bd from "@/assets/alert-blog-hero.webp.asset.json";
import bm from "@/assets/alert-blog-hero-mobile.webp.asset.json";

/** Responsive WebP hero photos: phones get the 760px file, desktops the 1600px one. */
export const HERO = { src: d.url, srcSet: `${m.url} 760w, ${d.url} 1600w`, sizes: "100vw" };
export const BLOG_HERO = { src: bd.url, srcSet: `${bm.url} 760w, ${bd.url} 1600w`, sizes: "100vw" };

import variants from "@/data/hero-variants.json";
/** Responsive WebP attrs for a service photo URL; falls back to the original. */
export function heroFor(url: string) {
  const v = (variants as Record<string, { d: string; "-mobile": string }>)[url];
  return v ? { src: v.d, srcSet: `${v["-mobile"]} 760w, ${v.d} 1600w`, sizes: "100vw" } : { src: url };
}
