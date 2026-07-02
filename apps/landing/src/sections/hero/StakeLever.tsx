"use client";

import { useRef, type ChangeEvent, type JSX } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AnimatedNumber } from "@/motion";
import { BRL } from "@/lib/formatters";
import { STAKE_MAX, STAKE_MIN, STAKE_STEP, useAposta } from "@/state/aposta";

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
 * Alavanca de stake — instrumento tátil ligado à aposta da página (useAposta):
 * o número definido aqui alimenta o bilhete e TODOS os CTAs de apostar. O gesto
 * dispara odômetro + barra no gradiente da marca enchendo + rótulo de tier +
 * detente háptico (mobile). O <input range> nativo (transparente, por cima)
 * carrega toda a interação e a a11y; os visuais são aria-hidden e o foco de
 * teclado aparece como anel ciano no polegar (padrão peer — o input opacity-0
 * apagaria o outline). Honesto: a barra = risco EXATO (sem ganho inventado).
 */
export function StakeLever(): JSX.Element {
  const reduce = useReducedMotion();
  const { stake, setStake } = useAposta();
  const stepRef = useRef(Math.round(stake / STAKE_STEP));
  const pct = (stake - STAKE_MIN) / (STAKE_MAX - STAKE_MIN);
  const fillPct = Math.round(pct * 100);
  const tier = tierFor(stake);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setStake(v);
    const s = Math.round(v / STAKE_STEP);
    if (s !== stepRef.current) {
      stepRef.current = s;
      if (!reduce && typeof navigator !== "undefined" && navigator.vibrate) {
        if (window.matchMedia("(pointer:coarse)").matches) navigator.vibrate(6);
      }
    }
  };

  return (
    <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-fog">Quanto você põe em jogo?</span>
        <span className="font-[family-name:var(--font-geist-mono)] text-lg font-bold text-white">
          <AnimatedNumber value={stake} format={BRL} />
        </span>
      </div>

      {/* alavanca com alvo de toque de 44px: o input (peer) vem primeiro no DOM
          e fica por cima (z-10); trilho e polegar são espelhos visuais atrás */}
      <div className="relative mt-3 h-11">
        <input
          type="range"
          min={STAKE_MIN}
          max={STAKE_MAX}
          step={STAKE_STEP}
          value={stake}
          onChange={onChange}
          aria-label="Quanto você põe em jogo?"
          aria-valuetext={`R$ ${stake}`}
          className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-navy-line"
        >
          <div
            className="relative h-full rounded-full transition-[width] duration-100 ease-out"
            style={{ width: `${fillPct}%`, background: "var(--gradient-brand)" }}
          >
            {/* faísca no bordo de ataque */}
            <span
              className="absolute -right-px top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-cyan"
              style={{ boxShadow: "0 0 12px 2px var(--glow-cyan)" }}
            />
          </div>
        </div>
        {/* polegar circular — espelha o foco de teclado do input em anel ciano */}
        <span
          aria-hidden
          className="pointer-events-none absolute top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_10px_rgba(5,13,19,0.45)] transition-[left] duration-100 ease-out peer-focus-visible:ring-2 peer-focus-visible:ring-cyan peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink"
          style={{ left: `${fillPct}%` }}
        />
      </div>

      <div className="mt-2.5 flex items-center justify-between font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em]">
        <span className="text-fog-mute">mín R$ {STAKE_MIN}</span>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={tier}
            className="font-bold text-violet-soft"
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {tier}
          </motion.span>
        </AnimatePresence>
        <span className="text-fog-mute">máx R$ {STAKE_MAX}</span>
      </div>
    </div>
  );
}
