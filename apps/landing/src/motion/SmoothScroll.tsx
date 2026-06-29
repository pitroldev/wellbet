"use client";

import { useEffect } from "react";

/**
 * Smooth-scroll (Lenis) integrado ao GSAP ScrollTrigger. Desliga em
 * prefers-reduced-motion (scroll nativo). Intercepta âncoras (#secao).
 *
 * Lenis/GSAP são importados DENTRO do efeito (dynamic import) — assim não entram
 * no grafo de SSR/prerender (evita o erro de prerender do /_global-error no
 * Next 16). Sem DOM (Lenis opera o scroll da janela).
 */
export function SmoothScroll(): null {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let destroy = () => {};

    void (async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement | null)?.closest?.(
          'a[href^="#"]',
        ) as HTMLAnchorElement | null;
        const href = a?.getAttribute("href");
        if (!href || href === "#") return;
        const el = document.querySelector(href);
        if (el) {
          e.preventDefault();
          lenis.scrollTo(el as HTMLElement, { offset: 0 });
        }
      };
      document.addEventListener("click", onClick);

      destroy = () => {
        document.removeEventListener("click", onClick);
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    })();

    return () => {
      cancelled = true;
      destroy();
    };
  }, []);

  return null;
}
