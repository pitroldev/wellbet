"use client";

import { useEffect, useRef, useState, type JSX, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Play } from "lucide-react";
import { AnimatedNumber } from "@/motion";
import { BRL } from "@/lib/formatters";
import { fireGreen } from "@/fx";

/**
 * "Ver como é o green" — clímax de dopamina HONESTO. Clique explícito (não
 * press-and-hold, que seria tell de caça-níquel) → carimbo GREEN + confete
 * one-shot + o PRÓPRIO valor do usuário rolando de volta (zero payout inventado)
 * + marca-d'água SIMULAÇÃO indelével + auto-reset. Reduced-motion: sem confete/
 * spring, estado verde instantâneo, ainda rotulado.
 */
export function GreenPreview({ stake }: { stake: number }): JSX.Element {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const commit = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOpen(true);
    setShown(0);
    requestAnimationFrame(() => setShown(stake));
    void fireGreen({
      x: (r.left + r.width / 2) / window.innerWidth,
      y: (r.top + r.height / 2) / window.innerHeight,
    });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 3600);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <>
      <button
        type="button"
        onClick={commit}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-green/40 bg-green/10 py-2.5 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em] text-green transition-colors hover:bg-green/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
      >
        <Play className="size-3" fill="currentColor" aria-hidden />
        {open ? "ver de novo" : "ver como é o green"}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute inset-0 z-20 grid place-items-center overflow-hidden bg-ink/95 px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 grid place-items-center"
            >
              <span className="-rotate-12 font-[family-name:var(--font-geist-mono)] text-5xl font-bold uppercase tracking-[0.3em] text-white/[0.07]">
                Simulação
              </span>
            </span>

            <div className="relative">
              <motion.span
                className="inline-grid -rotate-6 place-items-center bg-green px-4 py-1.5 text-green-ink"
                style={{ clipPath: "var(--stub)", boxShadow: "var(--stamp-green)" }}
                initial={reduce ? false : { scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 600, damping: 18 }}
              >
                <span className="inline-flex items-center gap-2 font-[family-name:var(--font-archivo)] text-2xl uppercase leading-none">
                  <Check className="size-5" strokeWidth={3} aria-hidden /> Deu green
                </span>
              </motion.span>

              <p className="mt-6 font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.18em] text-fog">
                Você recebe de volta
              </p>
              <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-4xl font-bold leading-none text-green">
                <AnimatedNumber value={reduce ? stake : shown} format={BRL} />
              </p>
              <p className="mt-2 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em] text-fog-mute">
                + sua fatia do bolo · varia
              </p>
              <p className="mx-auto mt-4 max-w-[26ch] text-xs leading-relaxed text-fog-mute">
                Exemplo: o green de verdade só vem com a pesagem por vídeo aprovada.
              </p>
            </div>

            <span className="sr-only" aria-live="polite">
              Simulação: meta batida — você recebe seu valor de volta mais sua fatia do bolo.
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
