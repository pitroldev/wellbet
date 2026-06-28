"use client";

import { motion, MotionConfig } from "framer-motion";
import { Zap, Coins, Crown, Flame, Sparkles } from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { ProductWordmark, BoltMark } from "@/app/components/wellbet-logo";
import { V, GRAD, SPRING } from "./_components/tokens";
import { Palette } from "./_components/palette";
import { TypeSpecimen } from "./_components/type-specimen";
import { BaseComponents } from "./_components/base-components";
import { ChargeMeter } from "./_components/charge-meter";
import { BetSlip } from "./_components/bet-slip";
import { CashOut } from "./_components/cashout";
import { BoltStrike } from "./_components/bolt-strike";
import { EnergySpin } from "./_components/energy-spin";
import { StreakChain } from "./_components/streak-chain";
import { Leaderboard } from "./_components/leaderboard";
import { PhoneScreens } from "./_components/phone-screens";
import { ElectricLine } from "./_components/spark";

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
        style={{ background: GRAD.bolt, color: V.greenInk }}
      >
        {n}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm" style={{ color: V.inkFaint }}>
        {children}
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-[family-name:var(--font-jakarta)] font-extrabold leading-[0.98] tracking-tight"
      style={{ color: V.white, fontSize: "clamp(2rem,7vw,3.2rem)" }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: V.inkSoft }}>
      {children}
    </p>
  );
}

function WidgetTitle({ Icon, children }: { Icon: typeof Zap; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: "rgba(65,255,202,.12)" }}>
        <Icon size={15} style={{ color: V.green }} strokeWidth={2.4} />
      </span>
      <span className="text-base font-extrabold" style={{ color: V.white }}>
        {children}
      </span>
    </div>
  );
}

export default function VoltagePage() {
  return (
    <MotionConfig reducedMotion="user">
      <main
        className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-jakarta)]"
        style={{ background: V.groundDeep, color: V.ink }}
      >
        {/* malha de gradiente de fundo */}
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(70% 50% at 50% -5%, rgba(57,69,255,0.22) 0%, rgba(8,22,30,0) 60%), radial-gradient(50% 40% at 90% 10%, rgba(65,255,202,0.14) 0%, rgba(8,22,30,0) 55%), #040D13",
          }}
        />
        <BackToHub className="border-white/15 bg-white/10 text-white backdrop-blur-md hover:bg-white/20" />
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
      <motion.div {...reveal}>
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ background: "rgba(255,255,255,.07)", color: V.green, boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
        >
          <BoltMark style={{ height: 12, width: "auto", color: V.green }} /> Design System · Voltage
        </span>
      </motion.div>

      <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="font-[family-name:var(--font-jakarta)] font-extrabold leading-[0.9] tracking-tight"
            style={{ color: V.white, fontSize: "clamp(2.8rem,12vw,5.4rem)" }}
          >
            Sua disciplina,
            <span
              className="block bg-clip-text text-transparent"
              style={{ backgroundImage: GRAD.bolt }}
            >
              carregada.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: V.inkSoft }}
          >
            Energia elétrica, o raio como motivo vivo. Carregue a meta, segure o gatilho e veja a{" "}
            <strong style={{ color: V.green }}>voltagem</strong> subir. Cada green solta uma faísca.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...SPRING }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <button
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold"
              style={{ background: GRAD.bolt, color: V.greenInk, boxShadow: "0 16px 40px -16px rgba(57,69,255,.8)" }}
            >
              <Zap size={16} fill={V.greenInk} /> Carregar aposta
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold"
              style={{ background: "rgba(255,255,255,.07)", color: V.white, boxShadow: `inset 0 0 0 1px ${V.glassLineUp}` }}
            >
              Ver cotações
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.2 }}
        >
          <ChargeMeter />
        </motion.div>
      </div>
    </section>
  );
}

function SectionFoundations() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="01">Fundamentos · Style guide</SectionLabel>
        <H2>A linguagem da energia.</H2>
        <Lead>
          Fundo quase-preto, vidro translúcido e o gradiente menta→azul que carrega tudo. Cada peça
          aqui é <strong style={{ color: V.green }}>tocável</strong> — copie uma cor, varie a fonte, mexa nos controles.
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
    <section className="relative mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <ElectricLine className="top-0" />
      <motion.div {...reveal}>
        <SectionLabel n="02">Playground · Tudo clicável</SectionLabel>
        <H2>Carregue. Aposte. Dê green.</H2>
        <Lead>
          Charge meter, cupom em gradiente, voltagem ao vivo, raio que atinge, spin de energia e a
          cadeia de raios. Segure, toque, repita — tudo de verdade.
        </Lead>
      </motion.div>

      <motion.div {...reveal} className="mt-10">
        <WidgetTitle Icon={Zap}>Cupom de aposta</WidgetTitle>
        <div className="mx-auto max-w-md">
          <BetSlip />
        </div>
      </motion.div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Coins}>Cash out · voltagem</WidgetTitle>
          <CashOut />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Zap}>Check-in → deu green</WidgetTitle>
          <BoltStrike />
        </motion.div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Sparkles}>Spin de energia</WidgetTitle>
          <EnergySpin />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Flame}>Streak · cadeia de raios</WidgetTitle>
          <StreakChain />
        </motion.div>
      </div>

      <motion.div {...reveal} className="mt-12">
        <WidgetTitle Icon={Crown}>Ranking de voltagem</WidgetTitle>
        <div className="mx-auto max-w-md">
          <Leaderboard />
        </div>
      </motion.div>
    </section>
  );
}

function SectionScreens() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <ElectricLine className="top-0" />
      <motion.div {...reveal}>
        <SectionLabel n="03">Telas · O app Voltage</SectionLabel>
        <H2>Como vira produto.</H2>
        <Lead>
          As mesmas peças, montadas no app real: home com banca e carga, montar cupom e a tela de
          “deu green” com ranking. Arraste lateralmente no celular.
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
    <footer className="relative mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: V.glassLine }}>
        <ProductWordmark brand="well" size={22} tone="light" />
        <p className="text-sm" style={{ color: V.inkFaint }}>
          Sua disciplina, carregada. · Plus Jakarta Sans + Fraunces + Geist Mono
        </p>
      </div>
    </footer>
  );
}
