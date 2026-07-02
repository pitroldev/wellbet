"use client";

import type { JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GradText, CTA } from "@/ui";
import { RevealText, EASE, Magnetic } from "@/motion";
import { BRL } from "@/lib/formatters";
import { useAposta, useApostaHref } from "@/state/aposta";
import { HeroProof } from "./HeroProof";

const brl = (n: number) => new Intl.NumberFormat("pt-BR", BRL).format(n);

/**
 * Coluna de texto do hero — sem urgência inventada (o relógio "ao vivo"
 * morreu): eyebrow com a frase-assinatura da marca, a pergunta com ênfase em
 * ciano (superfície escura: Slab é de papel) e CTAs alimentados pelo bilhete
 * que a própria pessoa monta ao lado (useAposta — um estado só na página).
 */
export function HeroCopy(): JSX.Element {
  const reduce = useReducedMotion();
  const { stake } = useAposta();
  const href = useApostaHref();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <div>
      {/* eyebrow-pílula — só a frase-assinatura, nada de LED nem relógio */}
      <motion.div {...rise(0.1)}>
        <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.18em] text-white">
          A bet que você torce pra ganhar
        </span>
      </motion.div>

      <h1 className="mt-5 font-[family-name:var(--font-archivo)] text-hero font-black leading-[1.08] tracking-[-0.02em] text-white">
        <RevealText immediate delay={0.1}>
          Quanto você
        </RevealText>
        <RevealText immediate delay={0.2}>
          apostaria
        </RevealText>
        <RevealText immediate delay={0.3}>
          <GradText tone="cyan">em você?</GradText>
        </RevealText>
      </h1>

      <motion.p {...rise(0.5)} className="mt-7 max-w-xl text-lg leading-relaxed text-fog sm:text-xl">
        Dinheiro real, via Pix, na sua meta de peso. Bateu no prazo: recebe de volta + sua fatia do
        bolo de quem desistiu. Não bateu: perde o valor. É por isso que funciona.
      </motion.p>

      <motion.div {...rise(0.62)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Magnetic>
          <CTA href={href} onDark>
            {`Apostar ${brl(stake)} em mim`}
          </CTA>
        </Magnetic>
        <CTA href="#como-funciona" variant="secondary" onDark>
          Como funciona
        </CTA>
      </motion.div>

      <motion.div {...rise(0.74)} className="mt-9">
        <HeroProof />
      </motion.div>
    </div>
  );
}
