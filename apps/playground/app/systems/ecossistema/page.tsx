"use client";

import { useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import { Sparkles, Wallet, Trophy, Gift, CheckCircle2, ArrowRight, Layers } from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { WellbetCoLogo, BoltMark } from "@/app/components/wellbet-logo";
import { E, GLASS, GLASS_LINE, SPRING, GRADIENT } from "./_components/tokens";
import { ProductProvider, useProduct } from "./_components/product-context";
import { ProductToggle } from "./_components/product-toggle";
import { LiquidM } from "./_components/liquid-m";
import { Palette } from "./_components/palette";
import { TypeSpecimen } from "./_components/type-specimen";
import { BaseComponents } from "./_components/base-components";
import { Dashboard } from "./_components/dashboard";
import { BetSlip } from "./_components/bet-slip";
import { Leaderboard } from "./_components/leaderboard";
import { GreenFlip } from "./_components/green-flip";
import { FreeBet } from "./_components/free-bet";
import { PhoneScreens } from "./_components/phone-screens";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: SPRING,
};

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  const { theme } = useProduct();
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className="grid h-9 w-9 place-items-center rounded-xl text-sm font-extrabold text-white"
        style={{ background: theme.accent }}
      >
        {n}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm" style={{ color: E.peri }}>
        {children}
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-[family-name:var(--font-fraunces)] leading-[1.02] tracking-[-0.02em] text-white"
      style={{ fontSize: "clamp(2rem,7vw,3.2rem)", fontVariationSettings: '"SOFT" 50,"opsz" 144' }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: E.peri }}>
      {children}
    </p>
  );
}

function WidgetTitle({ Icon, children }: { Icon: typeof Sparkles; children: React.ReactNode }) {
  const { theme } = useProduct();
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: GLASS }}>
        <Icon size={15} style={{ color: theme.accentSoft }} strokeWidth={2.4} />
      </span>
      <span className="text-base font-extrabold text-white">{children}</span>
    </div>
  );
}

export default function EcossistemaPage() {
  return (
    <MotionConfig reducedMotion="user">
      <ProductProvider>
        <main
          className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-jakarta)]"
          style={{ background: E.field, color: "#fff" }}
        >
          {/* brilho radial de fundo */}
          <div
            className="pointer-events-none absolute inset-0 -z-0"
            style={{
              background:
                "radial-gradient(60% 40% at 50% 0%, rgba(101,111,255,.35), transparent 70%), radial-gradient(50% 30% at 90% 20%, rgba(255,128,225,.18), transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <BackToHub className="border-white/15 bg-white/10 text-white hover:bg-white/20" />
            <Hero />
            <SectionFoundations />
            <SectionPlayground />
            <SectionScreens />
            <Footer />
          </div>
        </main>
      </ProductProvider>
    </MotionConfig>
  );
}

function Hero() {
  const { theme, morphKey } = useProduct();
  return (
    <section className="mx-auto max-w-6xl px-5 pb-8 pt-20 sm:px-10 sm:pt-28">
      <motion.div {...reveal} className="flex flex-wrap items-center justify-between gap-4">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-white"
          style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}
        >
          <BoltMark style={{ height: 12, width: "auto", color: E.peri }} /> Masterbrand · Sistema operacional
        </span>
        <ProductToggle />
      </motion.div>

      <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="font-[family-name:var(--font-fraunces)] leading-[0.98] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(2.4rem,9vw,4.6rem)", fontVariationSettings: '"SOFT" 55,"WONK" 1,"opsz" 144' }}
          >
            Mudanças reais
            <span className="block" style={{ color: E.peri }}>
              acontecem quando
            </span>
            <span className="block">existe algo em jogo.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: E.peri }}
          >
            Uma engenharia de marca, dois mundos. <strong className="text-white">WellBet</strong> para a saúde,{" "}
            <strong className="text-white">GymBet</strong> para o treino — banca, ranking e o “green”
            num só ecossistema. Toque o seletor e veja o painel inteiro se re-tematizar.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...SPRING }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <button
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold text-white"
              style={{ background: theme.accent, boxShadow: `0 16px 34px -16px ${theme.accent}` }}
            >
              <Sparkles size={16} /> Conheça o ecossistema
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold text-white"
              style={{ background: GLASS, boxShadow: "inset 0 0 0 1.5px " + GLASS_LINE }}
            >
              Ver produtos <ArrowRight size={15} />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...SPRING, delay: 0.2 }}
          className="grid place-items-center"
        >
          <LiquidM size={300} pulse={morphKey} gradient={GRADIENT.muma} />
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
        <H2>A linguagem do sistema.</H2>
        <Lead>
          Indigo como campo, periwinkle como vidro e dois acentos de produto. Cada peça é{" "}
          <strong className="text-white">tocável</strong> — copie uma cor, varie a Fraunces, mexa nos
          controles. O seletor lá em cima re-tematiza tudo.
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
  const { morphKey } = useProduct();
  const [, setPulse] = useState(0);
  const bump = () => setPulse((p) => p + 1);

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel n="02">Playground · Tudo clicável</SectionLabel>
          <H2>Um painel, dois mundos.</H2>
          <Lead>
            Alterne WellBet ↔ GymBet e veja banca, cupom, ranking e check-in morfarem juntos.
            Cada toque tem antecipação, ação e recompensa.
          </Lead>
        </div>
        <ProductToggle />
      </motion.div>

      {/* destaque: M reage + toggle */}
      <motion.div
        {...reveal}
        className="mt-10 grid gap-6 rounded-[28px] p-6 sm:grid-cols-[auto_1fr] sm:items-center"
        style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}
      >
        <div className="grid place-items-center">
          <LiquidM size={140} pulse={morphKey} gradient={GRADIENT.iris} />
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: E.peri, opacity: 0.7 }}>
            Toggle-assinatura
          </span>
          <p className="mt-1 text-lg font-extrabold text-white">
            O “M” líquido pulsa a cada troca de produto.
          </p>
          <p className="mt-1 text-sm" style={{ color: E.peri }}>
            Magenta de um lado, azul-menta do outro — a marca respirando em tempo real.
          </p>
          <div className="mt-3">
            <ProductToggle />
          </div>
        </div>
      </motion.div>

      {/* cupom (signature) + dashboard */}
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Sparkles}>Cupom · adapta ao produto</WidgetTitle>
          <BetSlip onWin={bump} />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Wallet}>Dashboard de banca unificado</WidgetTitle>
          <Dashboard />
        </motion.div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Trophy}>Ranking · liga premium</WidgetTitle>
          <Leaderboard />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={CheckCircle2}>Check-in → deu green</WidgetTitle>
          <GreenFlip onWin={bump} />
        </motion.div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Gift}>Free bet · recompensa</WidgetTitle>
          <FreeBet onWin={bump} />
        </motion.div>
        <motion.div {...reveal} className="grid">
          <WidgetTitle Icon={Layers}>O ecossistema em um toque</WidgetTitle>
          <div
            className="flex flex-1 flex-col justify-center rounded-[28px] p-6"
            style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}
          >
            <p
              className="text-white"
              style={{ fontFamily: "var(--font-fraunces)", fontSize: "1.6rem", lineHeight: 1.15, fontVariationSettings: '"SOFT" 60,"opsz" 144' }}
            >
              “A melhor aposta é na sua mudança.”
            </p>
            <p className="mt-3 text-sm" style={{ color: E.peri }}>
              Saúde e treino, banca e ranking, disciplina e dopamina — a mesma engenharia de marca,
              dois produtos, um só lugar.
            </p>
            <div className="mt-4">
              <ProductToggle compact />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SectionScreens() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="03">Telas · O ecossistema vivo</SectionLabel>
        <H2>Como vira produto.</H2>
        <Lead>
          O site masterbrand, o app unificado com o toggle de verdade e o ranking da liga. Arraste
          lateralmente no celular.
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
      <div
        className="flex flex-wrap items-center justify-between gap-4 border-t pt-6"
        style={{ borderColor: GLASS_LINE }}
      >
        <WellbetCoLogo size={22} tone="light" />
        <p className="text-sm" style={{ color: E.peri, opacity: 0.8 }}>
          Mudanças reais acontecem quando existe algo em jogo. · Fraunces + Plus Jakarta Sans
        </p>
      </div>
    </footer>
  );
}
