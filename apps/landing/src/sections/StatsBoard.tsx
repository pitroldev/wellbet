"use client";

import { useRef, useState, type JSX } from "react";
import { useInView } from "framer-motion";
import { AnimatedNumber } from "@/motion";

type Mode = "solo" | "bet";

const SCEN: Record<
  Mode,
  { pct: number; label: string; line: string; accent: string; fill: string }
> = {
  solo: {
    pct: 10,
    label: "Na força de vontade",
    line: "Só 1 em cada 10 chega lá sozinho.",
    accent: "text-[color:var(--color-magenta-deep)]",
    fill: "bg-[color:var(--color-magenta-deep)]",
  },
  bet: {
    pct: 50,
    label: "Com dinheiro de verdade em jogo",
    line: "5× mais chance — metade bate a meta.",
    accent: "text-[color:var(--color-green-text)]",
    fill: "bg-[color:var(--color-green-text)]",
  },
};

/**
 * Placar de ciência INTERATIVO — alterne os dois braços do mesmo estudo (BMJ) e
 * a barra salta de 10% a 50% (5×) com o número rolando. Dopamina honesta: é a
 * comparação real, controlada pelo usuário (sem inventar nada).
 */
export function StatsBoard(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  const [mode, setMode] = useState<Mode>("bet");
  const scen = SCEN[mode];
  const shown = inView ? scen.pct : 0;

  return (
    <div ref={ref} className="mt-12 sm:mt-14">
      {/* toggle */}
      <div className="inline-flex border-2 border-ink font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.12em]">
        {(["solo", "bet"] as const).map((m, i) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={`px-4 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta ${
              i === 1 ? "border-l-2 border-ink" : ""
            } ${mode === m ? "bg-ink text-paper" : "text-ink hover:bg-ink/[0.06]"}`}
          >
            {SCEN[m].label}
          </button>
        ))}
      </div>

      {/* número + barra */}
      <p className="mt-8 font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--color-paper-mute)]">
        Sua chance de bater a meta
      </p>
      <p
        className={`mt-1 font-[family-name:var(--font-geist-mono)] text-[clamp(2.6rem,7vw,4.2rem)] font-bold leading-none tabular-nums ${scen.accent}`}
      >
        <AnimatedNumber value={shown} suffix="%" />
      </p>

      <div className="mt-4 h-10 w-full border-2 border-ink p-1">
        <div
          className={`h-full transition-[width] duration-700 ease-out ${scen.fill}`}
          style={{ width: `${shown}%` }}
        />
      </div>

      <p className="mt-3 font-[family-name:var(--font-archivo)] text-xl uppercase leading-none tracking-tight text-ink">
        {scen.line}
      </p>

      <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-paper-mute)]">
        Por quê? Perder pesa <strong className="font-bold text-ink">2,25× mais que ganhar</strong> —
        é a aversão à perda que te faz cumprir.
      </p>
    </div>
  );
}
