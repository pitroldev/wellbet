"use client";

import { useState, type JSX } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Secao, SectionHeader, Tag, Slab } from "@/ui";
import { AnimatedNumber, EASE, Reveal } from "@/motion";
import { useAposta } from "@/state/aposta";
import { BRL } from "@/lib/formatters";

type Desfecho = "bater" | "nao-bater";

const ROTULO: Record<Desfecho, string> = {
  bater: "E se você bater?",
  "nao-bater": "E se você não bater?",
};

/** Tipografia única dos dois desfechos — o ganho e a perda com a MESMA produção. */
const LINHA_DESFECHO =
  "font-[family-name:var(--font-archivo)] text-[clamp(1.4rem,3.4vw,2rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-ink";

/**
 * Dobra "O DINHEIRO NA MESA" — a página acende a luz (papel) pra responder de
 * onde vem o prêmio, com o valor REAL escolhido no bilhete do hero. Toggle de
 * dois estados (mesma linguagem do painel da ciência): o ganho é projeção
 * ROTULADA (carimbo SIMULAÇÃO, neutro/violeta — o green fica pro clímax final)
 * e a perda é dita com as mesmas letras garrafais. Moeda 3D cifrão como
 * presença única da dobra, com micro-deslocamento entre os estados
 * (reduced-motion: corte seco).
 */
export function DinheiroNaMesa(): JSX.Element {
  const reduce = useReducedMotion();
  const { stake } = useAposta();
  const [desfecho, setDesfecho] = useState<Desfecho>("bater");
  const bateu = desfecho === "bater";

  return (
    <Secao id="dinheiro" surface="paper">
      <Reveal>
        <SectionHeader
          tone="light"
          kicker={<Tag>O dinheiro na mesa</Tag>}
          title={
            <>
              Sem mágica: <Slab>o prêmio vem de quem desistiu.</Slab>
            </>
          }
          lede="Não tem casa lucrando com a sua derrota. Quem não bate alimenta o bolo; quem bate divide."
        />
      </Reveal>

      <Reveal className="mt-12 sm:mt-14">
        <div className="relative max-w-3xl rounded-3xl border border-paper-line bg-white p-6 shadow-panel sm:p-10">
          {/* moeda 3D cifrão — presença única da dobra, desloca entre os estados */}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-12 z-10 w-24 sm:-right-8 sm:-top-10 sm:w-32"
            animate={bateu ? { y: -6, rotate: 8 } : { y: 10, rotate: -8 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 }}
          >
            <Image
              src="/brand/3d-coin-cifrao-violeta.png"
              alt=""
              width={947}
              height={992}
              sizes="128px"
              className="h-auto w-full select-none drop-shadow-[0_16px_28px_rgba(8,22,30,0.25)]"
            />
          </motion.span>

          {/* toggle dos dois futuros — pergunta de quem tem algo em jogo */}
          <div className="inline-flex max-w-full rounded-full bg-ink/[0.06] p-1 font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.12em]">
            {(["bater", "nao-bater"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDesfecho(d)}
                aria-pressed={desfecho === d}
                className={`min-h-11 rounded-full px-4 py-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet ${
                  desfecho === d ? "bg-ink text-paper" : "text-ink hover:bg-ink/[0.1]"
                }`}
              >
                {ROTULO[d]}
              </button>
            ))}
          </div>

          {/* o desfecho, com o SEU número — mesma produção nos dois estados */}
          <div aria-live="polite" className="mt-8 min-h-36">
            <motion.div
              key={desfecho}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              {bateu ? (
                <>
                  <p className={LINHA_DESFECHO}>
                    <span className="font-[family-name:var(--font-geist-mono)]">
                      <AnimatedNumber value={stake} format={BRL} />
                    </span>{" "}
                    de volta + sua fatia do bolo
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <span className="rounded-full border border-paper-line px-3 py-1 font-[family-name:var(--font-geist-mono)] text-[10px] font-bold uppercase tracking-[0.14em] text-[color:var(--color-paper-mute)]">
                      varia com o bolo
                    </span>
                    {/* carimbo neutro/violeta de propósito — o green fica pro clímax final */}
                    <span className="inline-block -rotate-2 rounded-md bg-violet px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                      Simulação
                    </span>
                  </div>
                </>
              ) : (
                <p className={LINHA_DESFECHO}>
                  Seu{" "}
                  <span className="font-[family-name:var(--font-geist-mono)]">
                    <AnimatedNumber value={stake} format={BRL} />
                  </span>{" "}
                  vai pro bolo de quem bateu. Por isso dói.
                </p>
              )}
            </motion.div>
          </div>

          <p className="mt-6 border-t border-paper-line pt-5 text-[13px] leading-relaxed text-[color:var(--color-paper-mute)]">
            A fatia varia com o bolo — ninguém aqui te promete número.
          </p>
        </div>
      </Reveal>

      <p className="mt-6 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em] text-[color:var(--color-paper-mute)]">
        Você define o valor. Pix na hora do desfecho.
      </p>
    </Secao>
  );
}
