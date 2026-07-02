import type { JSX } from "react";
import { Secao, SectionHeader, Tag, Slab } from "@/ui";
import { StatsBoard } from "./StatsBoard";

/**
 * Dobra "A CIÊNCIA" — a evidência de que apostar em si funciona (commitment
 * device com dado real, BMJ + Kahneman), dita sem frame de metáfora: um
 * visitante frio entende em 3 segundos. Server Component; só o painel
 * (StatsBoard) é ilha client (count-up). Numerais em ink (contraste); acento de
 * cor só no sufixo.
 */
export function Stats(): JSX.Element {
  return (
    // hairline no topo — delimita o painel dentro do bloco claro (dinheiro → ciência)
    <Secao id="ciencia" surface="paper" className="border-t border-paper-line">
      <SectionHeader
        tone="light"
        kicker={<Tag>A ciência</Tag>}
        title={
          <>
            Apostar em você <Slab>funciona.</Slab>
          </>
        }
        lede={
          <>
            Não é motivação de domingo — é um{" "}
            <strong className="font-bold text-ink">contrato de compromisso</strong>: a gente se
            esforça muito mais quando perder dói de verdade.
          </>
        }
      />

      <StatsBoard />

      <p className="mt-5 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.06em] text-[color:var(--color-paper-mute)]">
        Deposit-contract: estudo publicado no BMJ · aversão à perda: Kahneman &amp; Tversky.
      </p>
    </Secao>
  );
}
