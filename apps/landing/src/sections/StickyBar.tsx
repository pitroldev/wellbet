"use client";

import { useState, type JSX } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "@/ui";
import { appUrl } from "@/config";

/**
 * Barra fixa de conversão — aparece deslizando depois que o hero sai da tela,
 * mantendo marca + CTA sempre ao alcance (UX de conversão + orientação). Some
 * de volta no topo. Respeita reduced-motion.
 */
export function StickyBar(): JSX.Element {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const threshold = typeof window !== "undefined" ? window.innerHeight * 0.85 : 700;
    setShow(y > threshold);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-[60] border-b-2 border-magenta bg-ink/95 backdrop-blur"
      initial={false}
      animate={{ y: show ? 0 : "-105%" }}
      transition={reduce ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2.5">
        <a href="#topo" aria-label="Voltar ao topo" className="shrink-0">
          <Wordmark size={24} tone="light" />
        </a>
        <a
          href={appUrl}
          className="group inline-flex items-center gap-2 bg-magenta px-5 py-2.5 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.08em] text-ink transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
          style={{ clipPath: "var(--stub)" }}
        >
          Apostar agora
          <ArrowRight
            className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </a>
      </div>
    </motion.header>
  );
}
