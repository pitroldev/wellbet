"use client";

import { useRef, type JSX } from "react";
import { useInView } from "framer-motion";
import { Secao } from "./Secao";
import { Eyebrow, Display, GradText, Glow } from "./ui";
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
    label: "mais chance de bater a meta quando você tem dinheiro em jogo",
  },
  {
    value: 50,
    suffix: "%",
    tone: "green",
    label: "atingem a meta de peso apostando — vs. 10% sem nada em jogo (estudo BMJ)",
  },
  {
    value: 100,
    suffix: "%",
    tone: "magenta",
    label: "das pesagens revisadas por uma pessoa de verdade, em vídeo",
  },
];

function Stat({ s }: { s: StatDef }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  const color = s.tone === "green" ? "text-green" : "text-magenta";
  return (
    <div ref={ref} className="rounded-2xl border border-navy-line bg-navy-soft p-7">
      <p
        className={`font-[family-name:var(--font-archivo)] text-[clamp(3rem,7vw,4.6rem)] font-black italic leading-none ${color}`}
      >
        <AnimatedNumber value={inView ? s.value : 0} suffix={s.suffix} />
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-fog">{s.label}</p>
    </div>
  );
}

/** Prova social = ciência do commitment device. Números contam ao entrar na tela. */
export function Stats(): JSX.Element {
  return (
    <Secao id="ciencia" surface="navy">
      <Glow
        className="left-1/2 top-[-6rem] h-[26rem] w-[40rem] -translate-x-1/2"
        color="#7A1BD6"
        style={{ opacity: 0.3 }}
      />
      <div className="relative max-w-2xl">
        <Eyebrow tone="green">A ciência por trás</Eyebrow>
        <Display level={2} className="mt-4 text-display">
          <RevealText>
            Apostar em você <GradText>funciona</GradText>.
          </RevealText>
        </Display>
        <p className="mt-4 text-lg text-fog">
          Não é motivação de domingo — é o{" "}
          <strong className="font-semibold text-white">commitment device</strong>: a gente se
          esforça muito mais quando perder dói de verdade. A perda pesa ~2,25× mais que o ganho.
        </p>
      </div>

      <div className="relative mt-12 grid gap-6 md:grid-cols-3">
        {STATS.map((s) => (
          <Stat key={s.label} s={s} />
        ))}
      </div>

      <p className="relative mt-6 font-[family-name:var(--font-geist-mono)] text-xs text-fog-mute">
        Baseado em pesquisa de commitment devices (stickK · estudo publicado no BMJ).
      </p>
    </Secao>
  );
}
