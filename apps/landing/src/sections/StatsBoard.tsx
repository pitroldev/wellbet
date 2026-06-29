"use client";

import { useRef, type JSX } from "react";
import { useInView } from "framer-motion";
import { AnimatedNumber } from "@/motion";

interface StatDef {
  value: number;
  suffix: string;
  label: string;
  tone: "magenta" | "green";
}

/**
 * Três números DISTINTOS (sem inflar). 10% e 50% são os dois braços do MESMO
 * estudo (sem nada × apostando — a comparação honesta); 2,25× é o mecanismo
 * (aversão à perda) que explica a diferença.
 */
const STATS: readonly StatDef[] = [
  { value: 10, suffix: "%", tone: "magenta", label: "batem a meta sem nada em jogo." },
  { value: 50, suffix: "%", tone: "green", label: "batem a meta apostando o próprio dinheiro." },
  {
    value: 2.25,
    suffix: "×",
    tone: "magenta",
    label: "o quanto perder pesa mais que ganhar — a força que explica a diferença.",
  },
];

function Cell({ s, inView }: { s: StatDef; inView: boolean }): JSX.Element {
  const accent =
    s.tone === "green"
      ? "text-[color:var(--color-green-text)]"
      : "text-[color:var(--color-magenta-deep)]";
  return (
    <div className="px-6 py-9 sm:px-8 sm:py-12">
      <p className="font-[family-name:var(--font-geist-mono)] text-[clamp(3.4rem,8vw,5.6rem)] font-bold leading-none tabular-nums text-ink">
        <AnimatedNumber value={inView ? s.value : 0} />
        <span className={accent}>{s.suffix}</span>
      </p>
      <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-[color:var(--color-paper-mute)]">
        {s.label}
      </p>
    </div>
  );
}

/** Placar de odds (ilha client — só o count-up hidrata; a seção continua SSG). */
export function StatsBoard(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });

  return (
    <div
      ref={ref}
      className="mt-12 grid divide-y-2 divide-ink border-2 border-ink sm:mt-14 sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0"
    >
      {STATS.map((s) => (
        <Cell key={s.label} s={s} inView={inView} />
      ))}
    </div>
  );
}
