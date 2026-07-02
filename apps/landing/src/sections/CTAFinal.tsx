"use client";

import type { JSX, ReactNode } from "react";
import { Secao, CTA, Eyebrow, Display, GradText, FlameMark } from "@/ui";
import { Reveal, Magnetic } from "@/motion";
import { GreenClimax } from "./GreenClimax";
import { useAposta, useApostaHref } from "@/state/aposta";
import { BRL } from "@/lib/formatters";

const brl = (n: number) => new Intl.NumberFormat("pt-BR", BRL).format(n);

/** Linha do bilhete — rótulo apagado à esquerda, valor em branco à direita. */
function LinhaBilhete({ rotulo, valor }: { rotulo: string; valor: ReactNode }): JSX.Element {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-fog-mute">{rotulo}</dt>
      <dd className="text-lg font-bold tabular-nums text-white">{valor}</dd>
    </div>
  );
}

/**
 * Dobra final — o pico ÚNICO de recompensa (GreenClimax, rotulado) e o
 * fechamento "vire o jogo": o RESUMO DO BILHETE que a própria pessoa montou no
 * hero (meta + prazo + valor — nada inventado, nada pra decodificar) com os
 * dois desfechos nomeados na mesma produção, e a decisão é UMA só, levando o
 * bilhete inteiro no href. Ink afundando pro void.
 */
export function CTAFinal(): JSX.Element {
  const { stake, metaKg, prazoMeses } = useAposta();
  const href = useApostaHref();

  return (
    <Secao id="comecar" surface="ink" className="bg-gradient-to-b from-ink to-void">
      {/* o pico único de recompensa da página — verde-festa SÓ aqui, rotulado */}
      <Reveal>
        <GreenClimax />
      </Reveal>

      {/* o bilhete montado — gramática de slip: os números que a pessoa escolheu */}
      <Reveal className="mx-auto mt-14 w-full max-w-md sm:mt-16">
        <div className="rounded-2xl border border-white/10 bg-surface px-6 py-7 font-[family-name:var(--font-geist-mono)] shadow-panel sm:px-8">
          <p className="flex items-center justify-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-violet-soft">
            <FlameMark className="h-3.5 w-auto" aria-hidden />
            Seu bilhete
          </p>

          <dl className="mt-7 space-y-3.5">
            <LinhaBilhete
              rotulo="Meta"
              valor={
                <>
                  {/* − é U+2212; sr-only soletra pro leitor de tela */}
                  <span aria-hidden>−{metaKg} kg</span>
                  <span className="sr-only">menos {metaKg} quilos</span>
                </>
              }
            />
            <LinhaBilhete rotulo="Prazo" valor={`${prazoMeses} meses`} />
            <LinhaBilhete rotulo="Em jogo" valor={brl(stake)} />
          </dl>

          {/* os dois desfechos, uma frase cada — a perda nomeada, mesma produção */}
          <div className="mt-7 space-y-2 border-t border-dashed border-white/15 pt-5 text-left text-xs leading-relaxed text-fog">
            <p>Bateu a meta: seu valor volta + sua fatia do bolo.</p>
            <p>Não bateu: seu valor vira bolo de quem bateu.</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-14 sm:mt-16">
        <div className="flex flex-col items-center text-center">
          <Eyebrow tone="cyan">Sua vez</Eyebrow>

          <Display level={2} size="display" className="mt-5 text-white">
            Vire o <GradText>jogo.</GradText>
          </Display>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fog">
            Mudanças reais acontecem quando existe algo em jogo. Seu bilhete põe na mesa dinheiro,
            prova em vídeo, prazo — e um bolo de verdade no fim.
          </p>

          <div className="mt-9">
            <Magnetic>
              <CTA href={href} onDark>
                {`Apostar ${brl(stake)} em mim`}
              </CTA>
            </Magnetic>
          </div>

          <p className="mt-7 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em] text-fog">
            Sem mensalidade · você define o valor · Pix na hora.
          </p>

          <p className="mx-auto mt-8 max-w-2xl text-[13px] leading-relaxed text-fog-mute">
            A WellBet é um instrumento de compromisso para saúde e bem-estar — não uma casa de
            apostas. O resultado depende de você cumprir a sua meta, não da sorte. Comprometa-se
            com responsabilidade.
          </p>
        </div>
      </Reveal>
    </Secao>
  );
}
