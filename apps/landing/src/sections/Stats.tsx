import type { JSX } from "react";
import { Secao, SectionHeader, Tag, Slab } from "@/ui";
import { StatsBoard } from "./StatsBoard";

/**
 * Seção "A ciência por trás" — por que o mecanismo funciona (commitment device).
 * Server Component; só o placar (StatsBoard) é ilha client (count-up). Numerais
 * em ink (contraste); acento de cor só no sufixo.
 */
export function Stats(): JSX.Element {
  return (
    <Secao id="ciencia" surface="paper">
      <SectionHeader
        tone="light"
        kicker={<Tag tone="green">A ciência por trás</Tag>}
        title={
          <>
            Apostar em você <Slab>funciona</Slab>.
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
