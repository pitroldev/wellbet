import type { JSX } from "react";
import { Marquee } from "@/motion";
import { FlameMark } from "@/ui";

interface Fato {
  texto: string;
  /** "Deu green" é a única entrada em verde — palavra de vitória, nunca decoração. */
  green?: boolean;
}

/**
 * Os FATOS do produto, direto — o que um visitante frio precisa saber em 3
 * segundos, sem rótulo pra decodificar. Vocabulário REAL (pesagem em vídeo,
 * revisão humana, Pix), fechando no green.
 */
const FATOS: readonly Fato[] = [
  { texto: "Pesagem em vídeo" },
  { texto: "Revisão humana" },
  { texto: "Meta do seu tamanho" },
  { texto: "Pix na hora" },
  { texto: "Sem mensalidade" },
  { texto: "Deu green", green: true },
];

/**
 * Faixa de fatos — a gramática de LED de estádio fica, o jargão sai. O
 * movimento pausa no hover e vira faixa estática em reduced-motion (Marquee);
 * como o marquee é decorativo (aria-hidden), a sequência existe também em
 * texto puro para leitores de tela.
 */
export function TickerBand(): JSX.Element {
  return (
    <div className="relative z-10 border-y border-violet bg-ink py-4">
      <p className="sr-only">{FATOS.map(({ texto }) => `${texto}.`).join(" ")}</p>
      <Marquee durationSec={44}>
        {FATOS.map(({ texto, green }) => (
          <span
            key={texto}
            className="mx-6 inline-flex items-center gap-6 font-[family-name:var(--font-archivo)] text-xl font-bold uppercase tracking-tight sm:text-2xl"
          >
            <span className={green ? "text-green" : "text-white"}>{texto}</span>
            <FlameMark className="h-4 w-auto text-violet-soft" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
