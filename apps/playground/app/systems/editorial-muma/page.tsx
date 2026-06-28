"use client";

import { motion, MotionConfig } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { WellbetCoLogo, BoltMark } from "@/app/components/wellbet-logo";
import { M, SPRING, FRAUNCES_DISPLAY } from "./_components/tokens";
import { Palette } from "./_components/palette";
import { TypeSpecimen } from "./_components/type-specimen";
import { BaseComponents } from "./_components/base-components";
import { BetSlip } from "./_components/bet-slip";
import { GreenFlip } from "./_components/green-flip";
import { FreeBet } from "./_components/free-bet";
import { Ranking } from "./_components/ranking";
import { PullQuote } from "./_components/pull-quote";
import { PhoneScreens } from "./_components/phone-screens";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: SPRING,
};

function Kicker({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-4">
      <span
        className="font-[family-name:var(--font-fraunces)] text-4xl leading-none tabular-nums"
        style={{ color: M.pink, fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 600 }}
      >
        {n}
      </span>
      <span className="h-px flex-1" style={{ background: M.hair }} />
      <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em]" style={{ color: M.inkMute }}>
        {children}
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-[family-name:var(--font-fraunces)] leading-[0.98] tracking-[-0.02em]"
      style={{ color: M.ink, fontSize: "clamp(2.2rem,8vw,3.6rem)", fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 500 }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: M.inkSoft }}>
      {children}
    </p>
  );
}

function WidgetTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
        {children}
      </span>
    </div>
  );
}

export default function EditorialMumaPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main
        className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-jakarta)]"
        style={{ background: M.paper, color: M.ink }}
      >
        <BackToHub className="border-black/10 bg-white/80 text-[#08161E] hover:bg-white" />
        <Hero />
        <SectionFoundations />
        <SectionPlayground />
        <SectionScreens />
        <Footer />
      </main>
    </MotionConfig>
  );
}

function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-12 pt-20 sm:px-10 sm:pt-28">
      <motion.div {...reveal} className="flex items-center justify-between">
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em]" style={{ color: M.inkMute }}>
          wellbet &amp; Co. · muma
        </span>
        <span className="hidden font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em] sm:block" style={{ color: M.inkMute }}>
          Design System · ed. nº 01
        </span>
      </motion.div>
      <div className="mt-4 h-px w-full" style={{ background: M.ink }} />

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.p
            {...reveal}
            className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.32em]"
            style={{ color: M.indigo }}
          >
            Editorial / muma
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="mt-4 font-[family-name:var(--font-fraunces)] leading-[0.9] tracking-[-0.03em]"
            style={{ color: M.ink, fontSize: "clamp(2.8rem,13vw,6rem)", fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 500 }}
          >
            A melhor aposta
            <br />
            é na sua{" "}
            <span style={{ color: M.indigo }}>mudança</span>
            <span style={{ color: M.pink }}>.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-6 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: M.inkSoft }}
          >
            Uma bet de transformação, com cara de revista. Stake na meta, constância no jogo
            e o <strong style={{ color: M.greenDeep }}>green</strong> caindo na banca. Muito
            respiro, a serifa no comando. Quem continua, conquista.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...SPRING }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <button
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
              style={{ background: M.indigo, color: "#fff", boxShadow: "0 14px 30px -14px rgba(50,21,173,.7)" }}
            >
              Apostar em mim <ArrowRight size={16} />
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold"
              style={{ background: M.white, color: M.ink, boxShadow: `inset 0 0 0 1.5px ${M.hair}` }}
            >
              Ver o cupom
            </button>
          </motion.div>
        </div>

        {/* prancha-capa: bloco full-bleed indigo com serif */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.2 }}
          className="relative overflow-hidden rounded-[8px] px-7 py-9"
          style={{ background: M.indigo, color: "#fff" }}
        >
          <span
            className="pointer-events-none absolute -right-2 -top-10 select-none leading-none"
            style={{ fontFamily: "var(--font-fraunces)", fontSize: "13rem", color: M.pink, fontVariationSettings: FRAUNCES_DISPLAY, opacity: 0.9 }}
            aria-hidden
          >
            ,
          </span>
          <div className="relative">
            <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em]" style={{ color: M.pink }}>
              o motivo
            </span>
            <p
              className="mt-4 font-[family-name:var(--font-fraunces)] leading-[0.95]"
              style={{ fontSize: "clamp(2.4rem,8vw,3.4rem)", fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 500 }}
            >
              Bora?{" "}
              <span style={{ color: M.pink }}>Bora!</span>
            </p>
            <div className="mt-8 flex items-center gap-2 border-t border-white/15 pt-5">
              <BoltMark style={{ height: 16, width: "auto", color: M.pink }} />
              <span className="text-sm text-white/80">Mudanças reais quando há algo em jogo.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionFoundations() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <Kicker n="01">Fundamentos · style guide</Kicker>
        <H2>A linguagem da casa.</H2>
        <Lead>
          Papel claro, rosa e indigo como protagonistas, a serifa Fraunces no comando e muito
          respiro. Cada peça aqui é <strong>tocável</strong> — copie uma cor, esculpa a fonte,
          mexa nos controles.
        </Lead>
      </motion.div>

      <div className="mt-12 space-y-16 sm:space-y-20">
        <motion.div {...reveal}>
          <Palette />
        </motion.div>
        <motion.div {...reveal}>
          <TypeSpecimen />
        </motion.div>
        <motion.div {...reveal}>
          <BaseComponents />
        </motion.div>
      </div>
    </section>
  );
}

function SectionPlayground() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <Kicker n="02">Playground · tudo clicável</Kicker>
        <H2>Monte. Aposte. Dê green.</H2>
        <Lead>
          Elegante, nunca barulhento. O cupom editorial, o check-in que vira green, a free bet
          que abre e a liga que reordena — toque, repita, brinque de novo.
        </Lead>
      </motion.div>

      {/* Cupom — protagonista, centralizado */}
      <motion.div {...reveal} className="mt-12">
        <WidgetTitle>O cupom editorial</WidgetTitle>
        <div className="mx-auto max-w-md">
          <BetSlip />
        </div>
      </motion.div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle>Check-in → deu green</WidgetTitle>
          <GreenFlip />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle>Free bet · envelope</WidgetTitle>
          <FreeBet />
        </motion.div>
      </div>

      <motion.div {...reveal} className="mt-14">
        <WidgetTitle>A liga · ranking editorial</WidgetTitle>
        <div className="mx-auto max-w-md">
          <Ranking />
        </div>
      </motion.div>

      <motion.div {...reveal} className="mt-14">
        <WidgetTitle>Depoimento · pull-quote</WidgetTitle>
        <PullQuote />
      </motion.div>
    </section>
  );
}

function SectionScreens() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <Kicker n="03">Telas · a campanha</Kicker>
        <H2>Como vira capa.</H2>
        <Lead>
          As mesmas peças, montadas como pranchas muma: a capa rosa, o editorial indigo e o
          cupom no app real. Arraste lateralmente no celular.
        </Lead>
      </motion.div>

      <motion.div {...reveal} className="mt-12">
        <PhoneScreens />
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: M.hair }}>
        <WellbetCoLogo size={22} tone="ink" />
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em]" style={{ color: M.inkMute }}>
          A melhor aposta é na sua mudança · Fraunces + Jakarta
        </p>
      </div>
    </footer>
  );
}
