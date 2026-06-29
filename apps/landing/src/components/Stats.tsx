"use client";

import { useRef, type JSX } from "react";
import { useInView } from "framer-motion";
import { Secao } from "./Secao";
import { Tag, Display, GradText } from "./ui";
import { RevealText } from "./RevealText";
import { AnimatedNumber } from "./AnimatedNumber";

interface StatDef {
  value: number;
  suffix?: string;
  label: string;
  tone: "magenta" | "green";
}

const STATS: readonly StatDef[] = [
  {
    value: 5,
    suffix: "×",
    tone: "magenta",
    label: "mais chance de bater a meta com dinheiro em jogo",
  },
  {
    value: 50,
    suffix: "%",
    tone: "green",
    label: "atingem a meta apostando — vs. 10% sem nada (BMJ)",
  },
  {
    value: 100,
    suffix: "%",
    tone: "magenta",
    label: "das pesagens revisadas por gente, em vídeo",
  },
];

function Cell({ s }: { s: StatDef }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  const color = s.tone === "green" ? "text-[color:var(--color-green-deep)]" : "text-magenta";
  return (
    <div ref={ref} className="px-6 py-9 sm:px-8 sm:py-12">
      <p
        className={`font-[family-name:var(--font-geist-mono)] text-[clamp(3.4rem,8vw,5.6rem)] font-bold leading-none tabular-nums ${color}`}
      >
        <AnimatedNumber value={inView ? s.value : 0} suffix={s.suffix} />
      </p>
      <p className="mt-4 font-[family-name:var(--font-geist-mono)] text-[13px] uppercase leading-relaxed tracking-[0.04em] text-[color:var(--color-paper-mute)]">
        {s.label}
      </p>
    </div>
  );
}

/** Prova social = ciência do commitment device. Placar de odds em papel. */
export function Stats(): JSX.Element {
  return (
    <Secao id="ciencia" surface="paper">
      <div className="max-w-2xl">
        <Tag tone="green">A ciência por trás</Tag>
        <Display level={2} className="mt-5 text-display text-ink">
          <RevealText>
            Apostar em você <GradText>funciona</GradText>.
          </RevealText>
        </Display>
        <p className="mt-5 text-lg leading-relaxed text-[color:var(--color-paper-mute)]">
          Não é motivação de domingo — é o{" "}
          <strong className="font-bold text-ink">commitment device</strong>: a gente se esforça
          muito mais quando perder dói. A perda pesa ~2,25× mais que o ganho.
        </p>
      </div>

      {/* placar — grade de fios duros */}
      <div className="mt-10 grid border-2 border-ink divide-y-2 divide-ink sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
        {STATS.map((s) => (
          <Cell key={s.label} s={s} />
        ))}
      </div>

      <p className="mt-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.06em] text-[color:var(--color-paper-mute)]">
        Baseado em pesquisa de commitment devices · stickK · estudo publicado no BMJ.
      </p>
    </Secao>
  );
}
