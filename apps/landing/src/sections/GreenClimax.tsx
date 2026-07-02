"use client";

import { useEffect, useRef, useState, type JSX, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Play } from "lucide-react";
import { AnimatedNumber } from "@/motion";
import { useAposta } from "@/state/aposta";
import { BRL } from "@/lib/formatters";
import { fireGreen } from "@/fx";

/**
 * O clímax do green — o ÚNICO lugar da página onde o verde-festa acontece.
 * Clique explícito → carimbo
 * "DEU GREEN" + confete one-shot + o PRÓPRIO stake da alavanca rolando de
 * volta (zero número inventado) + marca-d'água SIMULAÇÃO indelével +
 * auto-reset. Reduced-motion: sem confete, carimbo estático, ainda rotulado.
 */
export function GreenClimax(): JSX.Element {
  const reduce = useReducedMotion();
  const { stake } = useAposta();
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
    timer.current = setTimeout(() => setOpen(false), 4200);
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-surface px-6 py-14 text-center shadow-panel sm:px-12 sm:py-16">
      <div className="flex flex-col items-center">
        <button
          type="button"
          onClick={commit}
          className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-green/40 bg-green/10 px-8 py-3 font-[family-name:var(--font-geist-mono)] text-sm font-bold uppercase tracking-[0.14em] text-green transition-colors hover:bg-green/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
        >
          <Play className="size-3.5" fill="currentColor" aria-hidden />
          {open ? "ver de novo" : "ver como é o green"}
        </button>

        <p className="mt-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em] text-fog-mute">
          O green de verdade só vem com a pesagem por vídeo aprovada.
        </p>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="absolute inset-0 z-20 grid place-items-center overflow-hidden bg-ink/95 px-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {/* marca-d'água indelével — a festa é rotulada ou não é */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 grid place-items-center"
            >
              <span className="-rotate-12 font-[family-name:var(--font-geist-mono)] text-6xl font-bold uppercase tracking-[0.3em] text-white/[0.07] sm:text-7xl">
                Simulação
              </span>
            </span>

            <div className="relative">
              <motion.span
                className="inline-grid -rotate-6 place-items-center rounded-xl bg-green px-6 py-2.5 text-green-ink shadow-[0_16px_40px_-12px_rgba(65,255,202,0.4)]"
                initial={reduce ? false : { scale: 1.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 600, damping: 18 }}
              >
                <span className="inline-flex items-center gap-2.5 font-[family-name:var(--font-archivo)] text-3xl font-black uppercase leading-none sm:text-4xl">
                  <Check className="size-7" strokeWidth={3} aria-hidden /> Deu green
                </span>
              </motion.span>

              <p className="mt-7 font-[family-name:var(--font-geist-mono)] text-5xl font-bold leading-none text-green sm:text-6xl">
                <AnimatedNumber value={reduce ? stake : shown} format={BRL} />
              </p>
              <p className="mt-3 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em] text-fog">
                de volta + sua fatia do bolo (varia)
              </p>
              <p className="mx-auto mt-5 max-w-[30ch] text-xs leading-relaxed text-fog-mute">
                O green de verdade só vem com a pesagem por vídeo aprovada.
              </p>
            </div>

            <span className="sr-only" aria-live="polite">
              Simulação: deu green — seu valor de volta mais sua fatia do bolo (varia).
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
