"use client";

import type { JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Target, Wallet, Camera, Trophy, type LucideIcon } from "lucide-react";
import { Secao, SectionHeader, Eyebrow, GradText, CardBrutal, IconTile } from "@/ui";
import { Reveal, EASE } from "@/motion";
import { fireGreen } from "@/fx";
import { cn } from "@/lib/utils";

interface Passo {
  readonly numero: string;
  readonly titulo: string;
  readonly descricao: string;
  readonly Icon: LucideIcon;
  /** O passo do green nomeia o DOWNSIDE (objeção nº1) e é tocável (comemora). */
  readonly destaque?: boolean;
}

const PASSOS: readonly Passo[] = [
  {
    numero: "01",
    Icon: Target,
    titulo: "Defina sua meta",
    descricao:
      "Escolha quanto quer perder e em quanto tempo. Uma meta realista, do seu tamanho — nada de promessa milagrosa.",
  },
  {
    numero: "02",
    Icon: Wallet,
    titulo: "Ponha algo em jogo",
    descricao:
      "Coloque um valor real na sua própria meta. É esse dinheiro em risco que vira compromisso de verdade — não mais uma promessa de ano-novo.",
  },
  {
    numero: "03",
    Icon: Camera,
    titulo: "Cumpra e comprove",
    descricao:
      "Registre cada pesagem em vídeo contínuo, revisada por gente. Sem trapaça, sem atalho — e se não comprovar, conta como não bateu.",
  },
  {
    numero: "04",
    Icon: Trophy,
    titulo: "Deu green",
    destaque: true,
    descricao:
      "Bateu no prazo? Recebe o dinheiro de volta + recompensa, no Pix. Não bateu? Seu valor vai pro bolo de quem conseguiu — é o que faz a coisa funcionar.",
  },
];

/**
 * Seção "Como funciona" — 4 passos com vida: a régua de progressão SE DESENHA ao
 * entrar na tela, os cards reagem ao hover e o passo do green é TOCÁVEL (confete
 * honesto, é o conceito "deu green"). O downside continua nomeado, 100% PT-BR.
 */
export function ComoFunciona(): JSX.Element {
  const reduce = useReducedMotion();

  const onGreen = (_e: unknown, info: { point: { x: number; y: number } }) => {
    void fireGreen({
      x: info.point.x / window.innerWidth,
      y: info.point.y / window.innerHeight,
    });
  };

  return (
    <Secao id="como-funciona" surface="navy">
      <Reveal>
        <SectionHeader
          kicker={<Eyebrow tone="magenta">Como funciona</Eyebrow>}
          title={
            <>
              Quatro passos. Um <GradText>compromisso.</GradText>
            </>
          }
          lede="Da meta ao green — e o que acontece se você não bater. Tudo na mesa, sem letra miúda."
        />
      </Reveal>

      <div className="relative mt-12 sm:mt-14">
        {/* régua da progressão (lg) — se DESENHA da esquerda pra direita */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-[3.6rem] hidden h-0.5 origin-left bg-magenta lg:block"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        />

        <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map(({ numero, titulo, descricao, Icon, destaque }, i) => {
            const card = (
              <CardBrutal surface="ink" accent={destaque ? "green" : "magenta"} interactive>
                <div className="flex items-center justify-between">
                  <IconTile tone={destaque ? "green" : "magenta"}>
                    <Icon className="size-5" strokeWidth={2.4} aria-hidden />
                  </IconTile>
                  <span
                    className={cn(
                      "font-[family-name:var(--font-geist-mono)] text-5xl font-bold leading-none tabular-nums",
                      destaque ? "text-green" : "text-magenta",
                    )}
                  >
                    {numero}
                  </span>
                </div>
                <h3
                  className={cn(
                    "mt-5 font-[family-name:var(--font-archivo)] text-xl uppercase leading-[0.95] tracking-tight",
                    destaque ? "text-green" : "text-white",
                  )}
                >
                  {titulo}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-fog">{descricao}</p>
                {destaque ? (
                  <span className="mt-4 inline-flex items-center gap-1.5 font-[family-name:var(--font-geist-mono)] text-[10px] font-bold uppercase tracking-[0.14em] text-green">
                    ▸ toque pra comemorar
                  </span>
                ) : null}
              </CardBrutal>
            );

            return (
              <Reveal key={numero} delay={0.05 * i}>
                {destaque ? (
                  <motion.div
                    onTap={onGreen}
                    whileTap={reduce ? undefined : { scale: 0.98 }}
                    className="h-full cursor-pointer"
                  >
                    {card}
                  </motion.div>
                ) : (
                  card
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </Secao>
  );
}
