"use client";

import type { JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Eyebrow, Slab, CTA } from "@/ui";
import { RevealText, EASE, Magnetic } from "@/motion";
import { appUrl, ctaLabel } from "@/config";
import { HeroProof } from "./HeroProof";

/**
 * Coluna de texto do hero. Ênfase via Slab (bloco magenta + ink) — em papel,
 * magenta-texto reprovaria contraste; o bloco é o grifo legível e mais brutal.
 */
export function HeroCopy(): JSX.Element {
  const reduce = useReducedMotion();
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
      <motion.div {...rise(0.1)}>
        <Eyebrow tone="indigo">A bet que você torce pra ganhar</Eyebrow>
      </motion.div>

      <h1 className="mt-5 font-[family-name:var(--font-archivo)] text-hero uppercase leading-[1.2] tracking-[-0.01em] text-ink">
        <RevealText immediate delay={0.1}>
          Quanto você
        </RevealText>
        <RevealText immediate delay={0.2}>
          apostaria
        </RevealText>
        <RevealText immediate delay={0.3}>
          <Slab>em você?</Slab>
        </RevealText>
      </h1>

      <motion.p
        {...rise(0.5)}
        className="mt-7 max-w-xl text-lg leading-relaxed text-[color:var(--color-paper-mute)] sm:text-xl"
      >
        Coloque dinheiro real na sua meta de peso. Bateu no prazo?{" "}
        <strong className="font-bold text-ink">
          Deu <span className="text-[color:var(--color-green-text)]">green</span>
        </strong>{" "}
        — recebe de volta com recompensa. Aqui você joga contra a sua própria desistência.
      </motion.p>

      <motion.div {...rise(0.62)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Magnetic>
          <CTA href={appUrl}>{ctaLabel}</CTA>
        </Magnetic>
        <CTA href="#como-funciona" variant="secondary">
          Como funciona
        </CTA>
      </motion.div>

      <motion.div {...rise(0.74)} className="mt-9">
        <HeroProof />
      </motion.div>
    </div>
  );
}
