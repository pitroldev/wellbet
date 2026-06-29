import type { JSX } from "react";
import { Marquee } from "@/motion";
import { BoltMark } from "@/ui";

/**
 * Faixa de LED de estádio. Vocabulário REAL do produto (meta, pesagem, vídeo,
 * Pix, prazo) — não jargão de casa de apostas (free bet, cash out, cotação),
 * que daria o tom errado (parece site de bet) e traz risco regulatório.
 */
const PALAVRAS = [
  "Meta",
  "Em jogo",
  "Pesagem",
  "Vídeo",
  "Prazo",
  "Pix",
  "Compromisso",
  "Deu green",
];

export function TickerBand(): JSX.Element {
  return (
    <div className="relative z-10 border-y-2 border-magenta bg-ink py-4">
      <Marquee durationSec={32}>
        {PALAVRAS.map((w) => (
          <span
            key={w}
            className="mx-6 inline-flex items-center gap-6 font-[family-name:var(--font-archivo)] text-2xl uppercase tracking-tight sm:text-3xl"
          >
            <span className={w === "Deu green" ? "text-green" : "text-white"}>{w}</span>
            <BoltMark className="h-4 w-auto text-magenta" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
