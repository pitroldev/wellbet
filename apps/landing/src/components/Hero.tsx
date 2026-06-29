"use client";

import { useState, type JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { CTA } from "@/components/CTA";
import { Eyebrow, GradText } from "@/components/ui";
import { RevealText } from "@/components/RevealText";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Wordmark, BoltMark } from "@/components/brand";
import { fireGreen } from "@/lib/confetti";
import { appUrl, ctaLabel } from "@/config";

const EASE = [0.22, 1, 0.36, 1] as const;
const BRL = { style: "currency", currency: "BRL", maximumFractionDigits: 0 } as const;

/**
 * Hero v3 — SPORTSBOOK BRUTAL. Seção PAPEL (cartaz): manchete Anton gigante em
 * caixa-alta, estilhaço magenta CHAPADO sangrando à direita e o CUPOM como
 * bilhete de aposta REAL (entalhado/perfurado, tudo em mono) com SIMULADOR:
 * arrasta o stake → o payout ROLA (odômetro) → "deu green" (confete).
 */
export function Hero(): JSX.Element {
  return (
    <section className="relative w-full overflow-hidden bg-paper px-6 pb-16 pt-5 text-ink sm:pb-24">
      {/* estilhaço magenta CHAPADO sangrando pela direita (atrás do bilhete) */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[46%] bg-magenta lg:block"
        style={{ clipPath: "polygon(22% 0, 100% 0, 100% 100%, 0 100%)" }}
      />
      {/* halftone de cartaz no canto inferior-esquerdo (textura impressa) */}
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-80 text-ink/[0.10]"
        style={{
          backgroundImage: "var(--halftone)",
          backgroundSize: "10px 10px",
          maskImage: "radial-gradient(ellipse 80% 80% at 0% 100%, black, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* nav */}
        <nav className="flex items-center justify-between py-2">
          <Wordmark size={30} tone="ink" />
          <div className="flex items-center gap-3">
            <a
              href="#como-funciona"
              className="hidden font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em] text-ink/70 transition-colors hover:text-ink sm:inline-flex"
            >
              Como funciona
            </a>
            <a
              href={appUrl}
              className="inline-flex items-center border-2 border-ink px-4 py-2 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Entrar
            </a>
          </div>
        </nav>

        <div className="mt-12 grid items-center gap-12 sm:mt-16 lg:grid-cols-[1.08fr_0.92fr]">
          <HeroCopy />
          <HeroCupom />
        </div>
      </div>

      {/* fio duro de fechamento (transição pro ticker preto) */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-ink" />
    </section>
  );
}

function HeroCopy(): JSX.Element {
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
        <Eyebrow>A bet que você torce pra ganhar</Eyebrow>
      </motion.div>

      <h1 className="mt-5 font-[family-name:var(--font-archivo)] text-hero uppercase leading-[0.95] tracking-[-0.01em] text-ink">
        <RevealText immediate delay={0.1}>
          Quanto você
        </RevealText>
        <RevealText immediate delay={0.2}>
          apostaria
        </RevealText>
        <RevealText immediate delay={0.3}>
          <GradText>em você?</GradText>
        </RevealText>
      </h1>

      <motion.p
        {...rise(0.5)}
        className="mt-7 max-w-xl text-lg leading-relaxed text-[color:var(--color-paper-mute)] sm:text-xl"
      >
        Coloque dinheiro real na sua meta de peso. Bateu no prazo?{" "}
        <strong className="font-bold text-ink">
          Deu <span className="text-green-deep">green</span>
        </strong>{" "}
        — recebe de volta com recompensa. A única aposta em que perder é você que ganha.
      </motion.p>

      <motion.div {...rise(0.62)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <CTA href={appUrl}>{ctaLabel}</CTA>
        <CTA href="#como-funciona" variant="secondary">
          Como funciona
        </CTA>
      </motion.div>

      <motion.div {...rise(0.74)} className="mt-9 flex items-center gap-4">
        <AvatarStack />
        <p className="text-sm text-[color:var(--color-paper-mute)]">
          <span className="font-[family-name:var(--font-geist-mono)] font-bold text-ink">
            +2.140
          </span>{" "}
          pessoas com algo em jogo agora
        </p>
      </motion.div>
    </div>
  );
}

function AvatarStack(): JSX.Element {
  const grads = [
    "var(--gradient-gymbet)",
    "var(--gradient-jackpot)",
    "var(--gradient-muma)",
    "var(--gradient-voltage)",
    "var(--gradient-gymbet-bright)",
  ];
  return (
    <div className="flex -space-x-2">
      {grads.map((g, i) => (
        <span key={i} className="size-9 ring-2 ring-paper" style={{ background: g }} aria-hidden />
      ))}
    </div>
  );
}

/** Cupom = bilhete de aposta entalhado + simulador de payout. */
function HeroCupom(): JSX.Element {
  const reduce = useReducedMotion();
  const [stake, setStake] = useState(200);
  const payout = stake * 2;

  return (
    <motion.div
      {...(reduce
        ? {}
        : {
            initial: { opacity: 0, y: 28 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, ease: EASE, delay: 0.3 },
          })}
      className="relative mx-auto w-full max-w-sm text-white"
    >
      <div
        className="relative overflow-hidden bg-ink"
        style={{
          clipPath: "var(--ticket)",
          filter: "drop-shadow(10px 12px 0 rgba(10,13,22,0.14))",
        }}
      >
        {/* header — barra magenta chapada */}
        <div className="flex items-center justify-between bg-magenta px-5 py-3 text-ink">
          <span className="inline-flex items-center gap-2 font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.18em]">
            <BoltMark className="h-3.5 w-auto" /> Cupom
          </span>
          <span className="font-[family-name:var(--font-geist-mono)] text-xs font-bold tracking-[0.12em]">
            #0007
          </span>
        </div>

        <div className="px-5 pb-6 pt-5 sm:px-6">
          {/* meta */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.18em] text-fog-mute">
                Sua meta
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-archivo)] text-4xl uppercase leading-[0.9] text-white">
                Perder 8&nbsp;kg
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-geist-mono)] text-xs text-fog">
                4 meses · vídeo
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-geist-mono)] text-[10px] font-bold uppercase tracking-[0.16em] text-magenta">
              <span
                className="size-2 bg-magenta"
                style={{ animation: "float 2.5s ease-in-out infinite" }}
              />
              Ativo
            </span>
          </div>

          {/* simulador: arrasta o stake */}
          <div className="mt-5 border border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.12em] text-fog">
                Quanto você aposta?
              </span>
              <span className="font-[family-name:var(--font-geist-mono)] text-base font-bold text-white">
                <AnimatedNumber value={stake} format={BRL} />
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={500}
              step={10}
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
              aria-label="Valor da aposta"
              className="mt-2.5 h-1 w-full cursor-pointer appearance-none bg-navy-line accent-magenta"
            />
            <div className="mt-1.5 flex items-center justify-between font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-fog-mute">
              <span>Cotação 2,00</span>
              <span>arraste →</span>
            </div>
          </div>

          {/* perfuração — fio tracejado + furos cor de papel nas bordas */}
          <div className="relative my-5" aria-hidden>
            <span className="block h-px w-full border-t border-dashed border-white/20" />
            <span className="absolute left-0 top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper" />
            <span className="absolute right-0 top-1/2 size-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-paper" />
          </div>

          {/* payout + deu green */}
          <button
            type="button"
            onClick={(e) =>
              fireGreen({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
            }
            className="group flex w-full items-end justify-between text-left"
          >
            <div>
              <p className="font-[family-name:var(--font-geist-mono)] text-[11px] font-bold uppercase tracking-[0.18em] text-fog-mute">
                Se der green
              </p>
              <p className="mt-1 font-[family-name:var(--font-geist-mono)] text-4xl font-bold leading-none text-green">
                <AnimatedNumber value={payout} format={BRL} />
              </p>
              <p className="mt-1.5 font-[family-name:var(--font-geist-mono)] text-[10px] uppercase tracking-[0.1em] text-fog-mute">
                toque pra comemorar
              </p>
            </div>
            <span
              className="grid size-14 shrink-0 place-items-center bg-green text-green-ink transition-transform group-hover:scale-105"
              style={{ boxShadow: "var(--glow-green)" }}
            >
              <Check className="size-7" strokeWidth={3} aria-hidden />
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
