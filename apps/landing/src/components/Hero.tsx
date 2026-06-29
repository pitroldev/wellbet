"use client";

import { useState, type JSX } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { CTA } from "@/components/CTA";
import { Eyebrow, GradText } from "@/components/ui";
import { RevealText } from "@/components/RevealText";
import { TiltCard } from "@/components/TiltCard";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { MeshHero } from "@/components/MeshHero";
import { Wordmark, BoltMark } from "@/components/brand";
import { fireGreen } from "@/lib/confetti";
import { appUrl, ctaLabel } from "@/config";

const EASE = [0.22, 1, 0.36, 1] as const;
const BRL = { style: "currency", currency: "BRL", maximumFractionDigits: 0 } as const;

/**
 * Hero v2 — gymbet-arena award-level. Mesh-gradient WebGL + grão, manchete
 * Archivo gigante com reveal mascarado, e o CUPOM holográfico interativo com
 * SIMULADOR: arrasta o stake → o payout ROLA (odômetro) → "deu green" (confete).
 */
export function Hero(): JSX.Element {
  return (
    <section className="relative w-full overflow-hidden px-6 pb-20 pt-6 sm:pb-28">
      <MeshHero />

      {/* scrim de legibilidade sobre o mesh (escurece o lado do texto) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,22,30,0.82) 0%, rgba(8,22,30,0.5) 38%, rgba(8,22,30,0.1) 64%, transparent 100%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40"
        style={{ background: "linear-gradient(180deg, transparent, var(--color-ink))" }}
      />

      {/* grade técnica sutil */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-navy-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-navy-line) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        {/* nav */}
        <nav className="flex items-center justify-between py-2">
          <Wordmark size={30} />
          <a
            href={appUrl}
            className="hidden rounded-full px-5 py-2.5 text-sm font-bold text-white ring-1 ring-inset ring-white/15 backdrop-blur-sm transition hover:bg-white/5 sm:inline-flex"
          >
            Entrar
          </a>
        </nav>

        <div className="mt-14 grid items-center gap-12 sm:mt-20 lg:grid-cols-[1.06fr_0.94fr]">
          <HeroCopy />
          <HeroCupom />
        </div>
      </div>
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

      <h1 className="mt-5 font-[family-name:var(--font-archivo)] text-hero font-black uppercase italic leading-[0.86] tracking-[-0.035em] text-white">
        <RevealText immediate delay={0.1}>
          A melhor
        </RevealText>
        <RevealText immediate delay={0.2}>
          aposta é
        </RevealText>
        <RevealText immediate delay={0.3}>
          <GradText>em você.</GradText>
        </RevealText>
      </h1>

      <motion.p
        {...rise(0.5)}
        className="mt-7 max-w-xl text-lg leading-relaxed text-fog sm:text-xl"
      >
        Coloque dinheiro real na sua meta de peso. Bateu no prazo?{" "}
        <strong className="font-semibold text-green">Deu green</strong> — recebe de volta com
        recompensa. A única aposta em que perder é você que ganha.
      </motion.p>

      <motion.div {...rise(0.62)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <CTA href={appUrl}>{ctaLabel}</CTA>
        <CTA href="#como-funciona" variant="secondary">
          Como funciona
        </CTA>
      </motion.div>

      <motion.div {...rise(0.74)} className="mt-9 flex items-center gap-4">
        <AvatarStack />
        <p className="text-sm text-fog">
          <span className="font-[family-name:var(--font-geist-mono)] font-semibold text-white">
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
    <div className="flex -space-x-3">
      {grads.map((g, i) => (
        <span
          key={i}
          className="size-9 rounded-full ring-2 ring-ink"
          style={{ background: g }}
          aria-hidden
        />
      ))}
    </div>
  );
}

/** Cupom holográfico interativo + simulador de payout. */
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
      className="relative mx-auto w-full max-w-sm"
    >
      <TiltCard className="rounded-[1.75rem]">
        <div
          className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-navy/45 p-6 backdrop-blur-xl sm:p-7"
          style={{ boxShadow: "var(--glow-magenta)" }}
        >
          {/* header */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 font-[family-name:var(--font-archivo)] text-xs font-extrabold uppercase tracking-[0.18em] text-fog">
              <BoltMark className="h-3.5 w-auto text-magenta" /> Cupom
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-magenta">
              <span
                className="size-2 rounded-full bg-magenta"
                style={{ animation: "float 2.5s ease-in-out infinite" }}
              />
              Ativo
            </span>
          </div>

          {/* meta */}
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-fog-mute">Sua meta</p>
            <p className="mt-1 font-[family-name:var(--font-archivo)] text-4xl font-black uppercase italic leading-none text-white">
              Perder 8&nbsp;kg
            </p>
            <p className="mt-1.5 text-sm text-fog">em 4 meses · pesagem por vídeo</p>
          </div>

          {/* simulador: arrasta o stake */}
          <div className="mt-5 rounded-2xl bg-ink/50 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-fog">Quanto você aposta?</span>
              <span className="font-[family-name:var(--font-geist-mono)] text-base font-semibold text-white">
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
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-navy-line accent-magenta"
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-fog-mute">
              <span>cotação 2,00</span>
              <span>arraste pra ver o payout subir</span>
            </div>
          </div>

          {/* perfuração */}
          <div className="my-5 flex items-center gap-1" aria-hidden>
            <span className="size-4 rounded-full bg-ink" />
            <span className="h-px flex-1 border-t border-dashed border-white/15" />
            <span className="size-4 rounded-full bg-ink" />
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
              <p className="text-xs font-bold uppercase tracking-wide text-fog-mute">
                Se der green
              </p>
              <p className="font-[family-name:var(--font-geist-mono)] text-4xl font-medium leading-none text-green">
                <AnimatedNumber value={payout} format={BRL} />
              </p>
              <p className="mt-1 text-xs text-fog-mute">toque pra comemorar 🎉</p>
            </div>
            <span
              className="grid size-14 shrink-0 place-items-center rounded-full text-green-ink transition-transform group-hover:scale-105"
              style={{ background: "var(--gradient-voltage)", boxShadow: "var(--glow-green)" }}
            >
              <Check className="size-7" strokeWidth={3} aria-hidden />
            </span>
          </button>
        </div>
      </TiltCard>
    </motion.div>
  );
}
