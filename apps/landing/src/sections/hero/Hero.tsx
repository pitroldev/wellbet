import type { JSX } from "react";
import { SiteHeader } from "./SiteHeader";
import { HeroCopy } from "./HeroCopy";
import { BetTicket } from "./BetTicket";

/**
 * Hero — o MONTADOR DE BILHETE: a pergunta da marca de um lado e, do outro, o
 * bilhete editável (meta + prazo + valor) que a pessoa monta na hora — a
 * "prize calculator" honesta, sem urgência inventada. Só a casca: superfície
 * ink, glows radiais violeta/ciano muito sutis (o grão global cobre a textura)
 * e a grade copy + bilhete. Estado e conteúdo vivem nos filhos.
 */
export function Hero(): JSX.Element {
  return (
    <section
      id="topo"
      className="relative w-full overflow-hidden bg-ink px-6 pb-16 pt-6 text-paper sm:pb-24 sm:pt-8"
    >
      {/* campo de glow violeta/ciano muito sutil (clareza > efeito) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-12%] size-[34rem] rounded-full opacity-[0.16]"
        style={{ background: "radial-gradient(closest-side, var(--glow-violet), transparent 72%)" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-48 left-[-14%] size-[30rem] rounded-full opacity-[0.12]"
        style={{ background: "radial-gradient(closest-side, var(--glow-cyan), transparent 72%)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <SiteHeader />
        <div className="mt-12 grid items-center gap-12 sm:mt-16 lg:grid-cols-[1.08fr_0.92fr]">
          <HeroCopy />
          <BetTicket />
        </div>
      </div>
    </section>
  );
}
