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

/** Faixa marquee do vocabulário de bet — assinatura de arena (CSS puro). */
export function TickerBand(): JSX.Element {
  return (
    <div className="relative z-10 border-y border-navy-line bg-ink/70 py-5 backdrop-blur-sm">
      <Marquee durationSec={34}>
        {WORDS.map((w) => (
          <span
            key={w}
            className="mx-7 inline-flex items-center gap-7 font-[family-name:var(--font-archivo)] text-xl font-black uppercase italic sm:text-2xl"
          >
            <span className={w === "Deu green" ? "text-green" : "text-white/80"}>{w}</span>
            <BoltMark className="h-3.5 w-auto text-magenta sm:h-4" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
