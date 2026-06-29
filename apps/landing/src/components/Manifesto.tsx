import type { JSX } from "react";
import { Secao } from "@/components/Secao";
import { Display } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { BoltMark } from "@/components/brand";

/**
 * Manifesto — pico emocional da página. BLOCO CHAPADO de magenta, tipo ink em
 * caixa-alta condensada e textura de cartaz (halftone). Sem cards, sem glow: só
 * a marca, a frase e o ar. A aposta é na sua mudança.
 */
export function Manifesto(): JSX.Element {
  return (
    <Secao
      surface="magenta"
      className="py-32 sm:py-44"
      containerClassName="flex flex-col items-center text-center"
    >
      {/* halftone de cartaz impresso (pontos ink) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 text-ink/[0.10]"
        style={{
          backgroundImage: "var(--halftone)",
          backgroundSize: "12px 12px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 50%, black, transparent)",
        }}
      />

      <Reveal y={28} className="relative mx-auto flex max-w-4xl flex-col items-center">
        <BoltMark className="mx-auto h-9 w-auto text-ink" />

        <Display
          level={2}
          className="mx-auto mt-8 max-w-4xl text-center text-[clamp(2.4rem,6.5vw,4.6rem)] text-ink"
        >
          Mudanças reais acontecem quando existe{" "}
          <span className="bg-ink px-[0.18em] py-[0.02em] text-magenta">algo em jogo</span>.
        </Display>

        <p className="mt-8 font-[family-name:var(--font-geist-mono)] text-base uppercase tracking-[0.12em] text-ink/80 sm:text-lg">
          A melhor aposta é na sua mudança.
        </p>
      </Reveal>
    </Secao>
  );
}
