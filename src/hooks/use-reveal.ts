import { useEffect } from "react";

/** Adds scroll-in reveal animations to headings, section children and list items. */
export function useReveal(dep?: unknown) {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("main section:not(:first-child) h2, main section:not(:first-child) > div > *, main section li, footer > div > *");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach((el) => {
      if (el.closest(".hero-rise") || el.closest("[class*=marquee]") || el.classList.contains("is-in")) return;
      const sibs = el.parentElement ? Array.from(el.parentElement.children) : [];
      el.style.setProperty("--reveal-delay", `${Math.min(sibs.indexOf(el), 5) * 90}ms`);
      el.classList.add("reveal");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [dep]);
}
