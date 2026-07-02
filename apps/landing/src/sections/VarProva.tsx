"use client";

import type { JSX } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Check, ShieldCheck, Lock, Users, type LucideIcon } from "lucide-react";
import { Secao, SectionHeader, Eyebrow, Card, IconTile } from "@/ui";
import { Reveal, EASE } from "@/motion";

/** Os critérios reais da revisão — o que a pessoa do VAR confere em cada vídeo. */
const CHECKLIST = ["Vídeo contínuo", "Balança zerada", "Mesma pessoa", "Visor em close"] as const;

type Tone = "violet" | "blue" | "cyan";

interface Pilar {
  readonly Icon: LucideIcon;
  readonly tone: Tone;
  readonly titulo: string;
  readonly descricao: string;
}

/** Pilares de prova — processo, contrato e gente. Nenhum tile verde (verde = só vitória). */
const PILARES: readonly Pilar[] = [
  {
    Icon: ShieldCheck,
    tone: "violet",
    titulo: "Pesagem auditada",
    descricao: "100% das pesagens revisadas por gente.",
  },
  {
    Icon: Lock,
    tone: "blue",
    titulo: "Seu dinheiro, suas regras",
    descricao: "Você define meta e valor; é contrato com você, não com a sorte.",
  },
  {
    Icon: Users,
    tone: "cyan",
    titulo: "Gente real",
    descricao: "Aqui não tem corpo de revista nem humilhação de ranking. Tem progresso.",
  },
];

/* Carimbo sóbrio: cada item assenta no lugar (escala 1.12 → 1), um por vez. */
const trilhaChecklist: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.1 } },
};

const itemChecklist: Variants = {
  hidden: { opacity: 0, scale: 1.12 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.34, ease: EASE } },
};

/**
 * Dobra "A prova" — a mais QUIETA da página, de propósito: prova é sóbria
 * (a dopamina mora na recompensa, nunca na auditoria). O checklist carimba
 * item a item no scroll, sem confete e sem verde — check em ciano neutro.
 */
export function VarProva(): JSX.Element {
  const reduce = useReducedMotion();

  return (
    <Secao id="prova" surface="ink">
      <Reveal>
        <SectionHeader
          tone="dark"
          kicker={<Eyebrow>A prova</Eyebrow>}
          title="Aqui, o VAR é gente."
          lede="Toda pesagem é vídeo contínuo revisado por uma pessoa. Balança zerada, visor legível, a mesma pessoa do início ao fim. Ou vale, ou não vale."
        />
      </Reveal>

      {/* o checklist da revisão — reduced-motion (initial={false}) já carimbado */}
      <motion.ul
        className="mt-10 flex flex-wrap gap-3"
        variants={trilhaChecklist}
        initial={reduce ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {CHECKLIST.map((label) => (
          <motion.li
            key={label}
            variants={itemChecklist}
            className="inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em] text-fog"
          >
            {label}
            <Check className="size-4 shrink-0 text-cyan" strokeWidth={3} aria-hidden />
          </motion.li>
        ))}
      </motion.ul>

      <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-3">
        {PILARES.map(({ Icon, tone, titulo, descricao }, i) => (
          <Reveal key={titulo} delay={0.05 * i}>
            <Card surface="ink">
              <div className="flex items-start justify-between">
                <IconTile tone={tone}>
                  <Icon className="size-5" strokeWidth={2.4} aria-hidden />
                </IconTile>
                <span
                  aria-hidden
                  className="font-[family-name:var(--font-geist-mono)] text-sm font-bold tabular-nums text-fog-mute"
                >
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-archivo)] text-xl font-extrabold leading-[1.15] tracking-[-0.02em] text-white">
                {titulo}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-fog">{descricao}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Secao>
  );
}
