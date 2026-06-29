import type { JSX } from "react";
import { Marquee } from "./Marquee";
import { BoltMark } from "./brand";

const WORDS = [
  "Cupom",
  "Stake",
  "Cotação",
  "Deu green",
  "Payout",
  "Streak",
  "Banca",
  "Free bet",
  "Cash out",
  "Acumuladora",
];

/**
 * Faixa de LED de estádio — vocabulário de bet rolando em Anton condensado sobre
 * o ink, entre dois fios duros de magenta. Assinatura de arena (CSS puro, 0 JS).
 */
export function TickerBand(): JSX.Element {
  return (
    <div className="relative z-10 border-y-2 border-magenta bg-ink py-4">
      <Marquee durationSec={32}>
        {WORDS.map((w) => (
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
