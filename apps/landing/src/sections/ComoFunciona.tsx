"use client";

import { useRef, type JSX } from "react";
import { motion, useReducedMotion, useScroll, type Variants } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { Secao, SectionHeader, Eyebrow, GradText, Card } from "@/ui";
import { Reveal, EASE } from "@/motion";

interface Passo {
  readonly titulo: string;
  readonly descricao: string;
}

/** Os 4 passos do produto — começo, meio e fim declarados antes de qualquer Pix. */
const PASSOS: readonly Passo[] = [
  {
    titulo: "Monte seu bilhete",
    descricao:
      "Meta, prazo e quanto você põe em jogo. Meta do seu tamanho, nada de milagre.",
  },
  {
    titulo: "Prove o ponto de partida",
    descricao: "Pesagem em vídeo contínuo, revisada por gente.",
  },
  {
    titulo: "Cumpra o período",
    descricao: "O jogo corre todo dia: check-ins, streak, o placar sempre à vista.",
  },
  {
    titulo: "Pesagem final + revisão humana",
    descricao: "A janela é sorteada perto do prazo. Mesma prova, mesmo rigor.",
  },
];

/*
 * Trava de ordem do veredito: o container orquestra os dois desfechos com
 * stagger — a PERDA sempre entra primeiro no tempo (e no DOM, para leitura),
 * e o green só carimba depois que ela já está na mesa.
 */
const DESFECHOS_VAR: Variants = {
  fora: {},
  visivel: { transition: { delayChildren: 0.15, staggerChildren: 0.6 } },
};

const PERDA_VAR: Variants = {
  fora: { opacity: 0, y: 24 },
  visivel: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const GREEN_VAR: Variants = {
  fora: { opacity: 0, scale: 1.14 },
  visivel: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 420, damping: 24 },
  },
};

/** Produção idêntica nos dois desfechos — a perda nunca é letra miúda. */
const CARTAO_DESFECHO =
  "relative flex h-full flex-col rounded-2xl border bg-surface p-6 shadow-panel";
const CARIMBO_DESFECHO =
  "inline-flex w-fit -rotate-3 items-center gap-2 rounded-lg px-3 py-1.5 font-[family-name:var(--font-archivo)] text-xl font-black uppercase leading-none";

/**
 * Dobra COMO FUNCIONA — os 4 passos do produto, numerados e diretos, com a
 * honestidade estrutural do fork. A LINHA (gradient-brand) se desenha com o
 * progresso de scroll scoped à seção (sem pin, sem scroll-jacking) ligando os
 * 4 nós-passo; no fim a revisão humana bifurca em dois desfechos de MESMA
 * produção, com a perda entrando primeiro. Reduced-motion: tudo estático,
 * linha já desenhada.
 */
export function ComoFunciona(): JSX.Element {
  const reduce = useReducedMotion();
  const trilhaRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trilhaRef,
    offset: ["start 0.82", "end 0.55"],
  });

  return (
    <Secao id="como-funciona" surface="ink">
      <Reveal>
        <SectionHeader
          kicker={<Eyebrow>Como funciona</Eyebrow>}
          title={
            <>
              Da meta ao green. <GradText>Sem letra miúda.</GradText>
            </>
          }
        />
      </Reveal>

      <div ref={trilhaRef} className="relative mt-12 max-w-3xl sm:mt-14">
        {/* trilho apagado + LINHA que se desenha conforme você desce */}
        <span
          aria-hidden
          className="absolute bottom-4 left-[11px] top-4 w-0.5 rounded-full bg-white/10"
        />
        <motion.span
          aria-hidden
          className="absolute bottom-4 left-[11px] top-4 w-0.5 origin-top rounded-full"
          style={{ background: "var(--gradient-brand)", scaleY: reduce ? 1 : scrollYProgress }}
        />

        <ol className="space-y-5 sm:space-y-6">
          {PASSOS.map(({ titulo, descricao }, i) => (
            <li key={titulo} className="relative pl-10 sm:pl-14">
              {/* nó do passo sobre a linha */}
              <span
                aria-hidden
                className="absolute left-0 top-8 grid size-6 place-items-center"
              >
                <span className="size-3 rounded-full border-2 border-cyan bg-ink" />
              </span>

              <Reveal delay={0.06 * i}>
                <Card surface="ink" accent="violet" interactive>
                  <h3 className="font-[family-name:var(--font-archivo)] text-lg font-extrabold uppercase leading-[1.1] tracking-[-0.01em] text-white sm:text-xl">
                    {/* numeral visível "1 ·"; leitores de tela ouvem "Passo 1:" */}
                    <span aria-hidden className="text-violet-soft">
                      {i + 1} ·{" "}
                    </span>
                    <span className="sr-only">Passo {i + 1}: </span>
                    {titulo}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-fog">{descricao}</p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      {/* FORK — a revisão humana bifurca o caminho em dois desfechos */}
      <div className="mt-14 max-w-3xl sm:mt-16">
        <Reveal>
          <p className="flex items-center gap-2.5 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.22em] text-cyan">
            Revisão humana
            <span className="sr-only">vira</span>
            <ArrowRight className="size-3.5 shrink-0" aria-hidden />
            Veredito
          </p>
        </Reveal>

        <motion.div
          className="mt-6 grid gap-5 sm:grid-cols-2"
          variants={DESFECHOS_VAR}
          initial={reduce ? false : "fora"}
          whileInView="visivel"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* a perda vem PRIMEIRO — quem lê o veredito encara o downside antes da festa */}
          <motion.article variants={PERDA_VAR} className={`${CARTAO_DESFECHO} border-white/10`}>
            <span className={`${CARIMBO_DESFECHO} bg-white/10 text-fog`}>
              <X className="size-5 shrink-0" strokeWidth={3} aria-hidden />
              Não bateu
            </span>
            <p className="mt-5 text-[15px] leading-relaxed text-fog">
              Seu valor vai pro bolo de quem bateu. Por isso dói.
            </p>
          </motion.article>

          {/* o green só carimba depois — é o desfecho condicional de vitória */}
          <motion.article variants={GREEN_VAR} className={`${CARTAO_DESFECHO} border-green/40`}>
            <span
              className={`${CARIMBO_DESFECHO} bg-green text-green-ink shadow-[0_16px_40px_-12px_rgba(65,255,202,0.4)]`}
            >
              <Check className="size-5 shrink-0" strokeWidth={3} aria-hidden />
              Deu green
            </span>
            <p className="mt-5 text-[15px] leading-relaxed text-fog">
              Seu valor de volta + sua fatia do bolo, no Pix.
            </p>
          </motion.article>
        </motion.div>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-fog-mute">
            Você acabou de ler o caminho da derrota. Agora escolhe não passar por ele.
          </p>
        </Reveal>
      </div>
    </Secao>
  );
}
