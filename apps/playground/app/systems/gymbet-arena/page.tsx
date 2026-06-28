"use client";

import { motion, MotionConfig } from "framer-motion";
import { Flame, Trophy, Coins, Target, Zap, TrendingUp, Sparkles, Dumbbell } from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { ProductWordmark, BoltMark } from "@/app/components/wellbet-logo";
import { G, SPRING, GRAD } from "./_components/tokens";
import { Palette } from "./_components/palette";
import { TypeSpecimen } from "./_components/type-specimen";
import { BaseComponents } from "./_components/base-components";
import { StreakMeter } from "./_components/streak-meter";
import { Ranking } from "./_components/ranking";
import { Jackpot } from "./_components/jackpot";
import { BetSlip } from "./_components/bet-slip";
import { CashOut } from "./_components/cashout";
import { Challenge } from "./_components/challenge";
import { PhoneScreens } from "./_components/phone-screens";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: SPRING,
};

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className="grid h-9 w-9 place-items-center rounded-xl text-sm font-extrabold"
        style={{ background: GRAD.gymbet, color: "#fff", boxShadow: "0 0 18px -4px rgba(255,0,255,.8)" }}
      >
        {n}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm" style={{ color: G.fogMute }}>
        {children}
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-[family-name:var(--font-archivo)] font-black uppercase italic leading-[0.9] tracking-[-0.03em]"
      style={{ color: G.white, fontSize: "clamp(2rem,8vw,3.4rem)" }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: G.fog }}>
      {children}
    </p>
  );
}

function WidgetTitle({ Icon, children }: { Icon: typeof Zap; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: G.magentaWash }}>
        <Icon size={15} style={{ color: G.magenta }} strokeWidth={2.4} />
      </span>
      <span className="text-base font-extrabold" style={{ color: G.white }}>
        {children}
      </span>
    </div>
  );
}

export default function GymBetArenaPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main
        className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-jakarta)]"
        style={{ background: G.navy, color: G.white }}
      >
        <BackToHub className="border-white/15 bg-black/40 text-white hover:bg-black/70" />
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
    <section className="relative mx-auto max-w-6xl px-5 pb-8 pt-20 sm:px-10 sm:pt-28">
      {/* estilhaços diagonais de fundo */}
      <span className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full opacity-25 blur-3xl" style={{ background: G.magenta }} />
      <span className="pointer-events-none absolute right-0 top-40 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ background: G.purple }} />

      <motion.div {...reveal} className="relative">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ background: G.magentaWash, color: G.pinkPale, boxShadow: "inset 0 0 0 1px rgba(255,0,255,.3)" }}
        >
          <BoltMark style={{ height: 12, width: "auto", color: G.magenta }} /> Design System · GymBet Arena
        </span>
      </motion.div>

      <div className="relative mt-6 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="font-[family-name:var(--font-archivo)] font-black uppercase italic leading-[0.84] tracking-[-0.04em]"
            style={{ color: G.white, fontSize: "clamp(2.8rem,12vw,5.4rem)" }}
          >
            Treine.
            <br />
            Compita.
            <span
              className="block"
              style={{
                background: "linear-gradient(100deg,#FF00FF,#FDC0FF 55%,#7A1BD6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Fature.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: G.fog }}
          >
            Qual seu maior streak? Entre no ranking, estenda a sequência e{" "}
            <strong style={{ color: G.green }}>conquiste o jackpot</strong>. Arena competitiva de
            alta octanagem — premium, nunca cassino barato.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...SPRING }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <button
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold"
              style={{ background: GRAD.gymbet, color: "#fff", boxShadow: "0 14px 32px -12px rgba(255,0,255,.8)" }}
            >
              <Flame size={16} fill="#fff" /> Entrar na arena
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold"
              style={{ background: "transparent", color: G.white, boxShadow: "inset 0 0 0 1.5px " + G.navyLine }}
            >
              <Trophy size={16} style={{ color: G.magenta }} /> Ver ranking
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.2 }}
        >
          <StreakMeter />
        </motion.div>
      </div>
    </section>
  );
}

function SectionFoundations() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="01">Fundamentos · Style guide</SectionLabel>
        <H2>A linguagem da arena.</H2>
        <Lead>
          Navy de fundo, magenta pra ação, roxo na profundidade e green pra vitória. Archivo pesado
          nas manchetes, mono nos streaks. Cada peça aqui é <strong style={{ color: G.pinkPale }}>tocável</strong> —
          copie uma cor, varie a fonte, mexa nos controles.
        </Lead>
      </motion.div>

      <div className="mt-10 space-y-14 sm:space-y-20">
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
        <SectionLabel n="02">Playground · Tudo clicável</SectionLabel>
        <H2>Qual seu maior streak?</H2>
        <Lead>
          Ranking semanal, roleta de jackpot, cupom de treino, cash out ao vivo e o desafio da
          semana. Toque, gire, torça, repita — tudo de verdade, tudo dopaminérgico.
        </Lead>
      </motion.div>

      {/* Ranking protagonista */}
      <motion.div {...reveal} className="mt-10">
        <WidgetTitle Icon={Trophy}>Ranking semanal · protagonista</WidgetTitle>
        <div className="mx-auto max-w-xl">
          <Ranking />
        </div>
      </motion.div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Dumbbell}>Cupom de treino</WidgetTitle>
          <BetSlip />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Sparkles}>Roleta da arena · jackpot</WidgetTitle>
          <Jackpot />
        </motion.div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Coins}>Cash out ao vivo</WidgetTitle>
          <CashOut />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Target}>Desafio da semana</WidgetTitle>
          <Challenge />
        </motion.div>
      </div>
    </section>
  );
}

function SectionScreens() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="03">Telas · O app GymBet</SectionLabel>
        <H2>Como vira produto.</H2>
        <Lead>
          As mesmas peças no app real: ranking semanal com streaks, o desafio da semana e o convite
          pra entrar na arena. Arraste lateralmente no celular.
        </Lead>
      </motion.div>

      <motion.div {...reveal} className="mt-10">
        <PhoneScreens />
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: G.navyLine }}>
        <ProductWordmark brand="gym" size={22} tone="light" />
        <p className="text-sm" style={{ color: G.fogMute }}>
          Treine. Compita. Fature. · Archivo + Plus Jakarta Sans
        </p>
      </div>
    </footer>
  );
}
