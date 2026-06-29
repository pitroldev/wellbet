"use client";

import { useRef, type ChangeEvent, type JSX } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/motion";
import { BRL } from "@/lib/formatters";
import type { StakeSim } from "./useStakeSimulator";

/** O tier reformula COMPROMISSO (o quanto vai doer desistir), não prêmio. */
const TIERS = [
  { max: 90, label: "um empurrãozinho" },
  { max: 250, label: "agora dói desistir" },
  { max: Infinity, label: "sem desculpa" },
] as const;

function tierFor(stake: number): string {
  const t = TIERS.find((tier) => stake <= tier.max);
  return t ? t.label : "sem desculpa";
}

/**
 * Alavanca de stake — instrumento tátil. O mesmo gesto dispara odômetro + barra
 * magenta enchendo + rótulo de tier + detente háptico (mobile). O <input range>
 * nativo (transparente, por cima) carrega toda a interação e a a11y; os visuais
 * são aria-hidden. Honesto: a barra magenta = risco EXATO (sem ganho inventado).
 */
export function StakeLever({ stake, setStake, min, max, step, pct }: StakeSim): JSX.Element {
  const reduce = useReducedMotion();
  const stepRef = useRef(Math.round(stake / step));
  const fillPct = Math.round(pct * 100);
  const tier = tierFor(stake);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setStake(v);
    const s = Math.round(v / step);
    if (s !== stepRef.current) {
      stepRef.current = s;
      if (!reduce && typeof navigator !== "undefined" && navigator.vibrate) {
        if (window.matchMedia("(pointer:coarse)").matches) navigator.vibrate(6);
      }
    }
  };

  return (
    <div className="mt-5 border border-white/10 bg-white/[0.03] px-4 py-3.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-fog">Quanto você põe em jogo?</span>
        <span className="font-[family-name:var(--font-geist-mono)] text-lg font-bold text-white">
          <AnimatedNumber value={stake} format={BRL} />
        </span>
      </div>

      {/* alavanca: trilho + barra (visual) sob o input nativo transparente */}
      <div className="relative mt-3 h-7">
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 bg-navy-line">
          <div
            className="relative h-full bg-magenta transition-[width] duration-100 ease-out"
            style={{ width: `${fillPct}%` }}
          >
            {/* faísca no bordo de ataque */}
            <span
              className="absolute -right-px top-1/2 h-4 w-1 -translate-y-1/2 bg-pink"
              style={{ boxShadow: "0 0 12px 2px var(--color-magenta)" }}
            />
          </div>
        </div>
        {/* polegar chapado (canto de bilhete) */}
        <span
          aria-hidden
          className="absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 bg-paper transition-[left] duration-100 ease-out"
          style={{ left: `${fillPct}%`, clipPath: "var(--stub)" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={stake}
          onChange={onChange}
          aria-label="Quanto você põe em jogo?"
          aria-valuetext={`R$ ${stake}`}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em]">
        <span className="text-fog-mute">mín R$ {min}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={tier}
            className="font-bold text-magenta"
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {tier}
          </motion.span>
        </AnimatePresence>
        <span className="text-fog-mute">máx R$ {max}</span>
      </div>
    </div>
  );
}
