import type { JSX } from "react";
import { Secao } from "@/components/Secao";
import { Glow, Display, GradText } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { BoltMark } from "@/components/brand";

/**
 * Manifesto — pico emocional da página (gymbet arena). Banda de respiro centrada,
 * com glows magenta + roxo empilhados e fortes por trás. Sem cards: só a marca,
 * a frase em Archivo black caixa-alta itálico, e o ar. A aposta é na sua mudança.
 */
export function Manifesto(): JSX.Element {
  return (
    <Secao
      surface="navy"
      className="py-32 sm:py-44"
      containerClassName="flex flex-col items-center text-center"
    >
      {/* luz central empilhada — magenta + roxo por trás da frase */}
      <Glow
        className="left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2"
        color="#7A1BD6"
        style={{ opacity: 0.5 }}
      />
      <Glow
        className="left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2"
        color="#FF00FF"
        style={{ opacity: 0.42 }}
      />
      <Glow
        className="left-[18%] top-[30%] h-[20rem] w-[20rem]"
        color="#FF80E1"
        style={{ opacity: 0.22 }}
      />

      {/* shard diagonal sutil — banda de gradiente atrás da frase */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[18rem] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-[0.14]"
        style={{ background: "var(--gradient-gymbet)", clipPath: "var(--shard)" }}
      />

      <Reveal y={28} className="relative mx-auto flex max-w-4xl flex-col items-center">
        <BoltMark
          className="mx-auto h-8 w-auto text-magenta"
          style={{ filter: "drop-shadow(0 6px 22px rgba(255,0,255,0.55))" }}
        />

        <Display
          level={2}
          className="mx-auto mt-8 max-w-4xl text-center text-[clamp(2.2rem,6vw,4rem)]"
        >
          Mudanças reais acontecem quando existe <GradText>algo em jogo</GradText>.
        </Display>

        <p className="mt-8 text-lg text-fog sm:text-xl">A melhor aposta é na sua mudança.</p>
      </Reveal>
    </Secao>
  );
}
