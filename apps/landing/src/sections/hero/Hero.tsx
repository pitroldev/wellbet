import type { JSX } from "react";
import { SiteHeader } from "./SiteHeader";
import { HeroCopy } from "./HeroCopy";
import { BetTicket } from "./BetTicket";

/**
 * Hero v3 — SPORTSBOOK BRUTAL, seção PAPEL (cartaz). Só a casca: superfície,
 * textura halftone, costura inferior e a grade copy + bilhete. Estado e
 * conteúdo vivem nos filhos (SiteHeader / HeroCopy / BetTicket).
 */
export function Hero(): JSX.Element {
  return (
    <section className="relative w-full overflow-hidden bg-paper px-6 pb-16 pt-6 text-ink sm:pb-24 sm:pt-8">
      {/* halftone de cartaz no canto inferior-esquerdo (textura impressa) */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-80 text-ink/[0.10]"
        style={{
          backgroundImage: "var(--halftone)",
          backgroundSize: "10px 10px",
          maskImage: "radial-gradient(ellipse 80% 80% at 0% 100%, black, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <SiteHeader />
        <div className="mt-12 grid items-center gap-12 sm:mt-16 lg:grid-cols-[1.08fr_0.92fr]">
          <HeroCopy />
          <BetTicket />
        </div>
      </div>

      {/* costura dura de fechamento (transição pro ticker preto) */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-ink" />
    </section>
  );
}
