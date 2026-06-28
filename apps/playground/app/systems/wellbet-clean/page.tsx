"use client";

import { motion, MotionConfig } from "framer-motion";
import { Zap, TrendingUp, Coins, CalendarCheck, Layers, Activity } from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { ProductWordmark, BoltMark } from "@/app/components/wellbet-logo";
import { W, SPRING } from "./_components/tokens";
import { Palette } from "./_components/palette";
import { TypeSpecimen } from "./_components/type-specimen";
import { BaseComponents } from "./_components/base-components";
import { EvolutionRing } from "./_components/ring";
import { BetSlip } from "./_components/bet-slip";
import { CashOut } from "./_components/cashout";
import { GreenFlip } from "./_components/green-flip";
import { Accumulator } from "./_components/accumulator";
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
        style={{ background: W.blue, color: "#fff" }}
      >
        {n}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm" style={{ color: W.inkMute }}>
        {children}
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-[family-name:var(--font-fraunces)] leading-[1.02] tracking-[-0.02em]"
      style={{ color: W.ink, fontSize: "clamp(2rem,7vw,3.2rem)", fontVariationSettings: '"SOFT" 30,"opsz" 144' }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: W.inkSoft }}>
      {children}
    </p>
  );
}

function WidgetTitle({ Icon, children }: { Icon: typeof Zap; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: W.blueWash }}>
        <Icon size={15} style={{ color: W.blue }} strokeWidth={2.4} />
      </span>
      <span className="text-base font-extrabold" style={{ color: W.ink }}>
        {children}
      </span>
    </div>
  );
}

export default function WellbetCleanPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main
        className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-jakarta)]"
        style={{ background: W.paper, color: W.ink }}
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
    <section className="mx-auto max-w-6xl px-5 pb-8 pt-20 sm:px-10 sm:pt-28">
      <motion.div {...reveal}>
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ background: W.blueWash, color: W.blueDeep }}
        >
          <BoltMark style={{ height: 12, width: "auto", color: W.blue }} /> Design System · WellBet Clean
        </span>
      </motion.div>

      <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="font-[family-name:var(--font-fraunces)] leading-[0.95] tracking-[-0.02em]"
            style={{ color: W.ink, fontSize: "clamp(2.6rem,11vw,5rem)", fontVariationSettings: '"SOFT" 40,"WONK" 1,"opsz" 144' }}
          >
            Sua disciplina
            <span className="block" style={{ color: W.blue }}>
              agora vale mais.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: W.inkSoft }}
          >
            SAÚDE + DINHEIRO = WellBet. Aposte na sua meta, registre a evolução e veja o{" "}
            <strong style={{ color: W.greenDeep }}>green</strong> cair na banca. Calmo, confiável,
            com polimento de banco.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...SPRING }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <button className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold" style={{ background: W.blue, color: "#fff", boxShadow: "0 14px 30px -14px rgba(57,69,255,.7)" }}>
              <Zap size={16} fill="#fff" /> Fazer aposta
            </button>
            <button className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold" style={{ background: W.surface, color: W.ink, boxShadow: "inset 0 0 0 1.5px " + W.line }}>
              Ver cotações
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.2 }}
        >
          <EvolutionRing />
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
        <H2>A linguagem do produto.</H2>
        <Lead>
          Superfícies claras, azul para a ação, menta para a vitória e tipografia que respira.
          Cada peça aqui é <strong>tocável</strong> — copie uma cor, varie a fonte, mexa nos controles.
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
        <H2>Monte. Aposte. Dê green.</H2>
        <Lead>
          Stake, cotação ao vivo, acumuladora, cash out e o flip do “deu green”. Toque, repita,
          brinque de novo — tudo de verdade.
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
          <WidgetTitle Icon={Layers}>Acumuladora da semana</WidgetTitle>
          <Accumulator />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Coins}>Cash out ao vivo</WidgetTitle>
          <CashOut />
        </motion.div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={CalendarCheck}>Check-in → deu green</WidgetTitle>
          <GreenFlip />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Activity}>Evolução semanal</WidgetTitle>
          <EvolutionRing />
        </motion.div>
      </div>
    </section>
  );
}

function SectionScreens() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="03">Telas · O app WellBet</SectionLabel>
        <H2>Como vira produto.</H2>
        <Lead>
          As mesmas peças, montadas no app real: home com banca e evolução, montar cupom e o
          ranking da sua liga. Arraste lateralmente no celular.
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: W.line }}>
        <ProductWordmark brand="well" size={22} />
        <p className="text-sm" style={{ color: W.inkMute }}>
          Sua disciplina agora vale mais. · Fraunces + Plus Jakarta Sans
        </p>
      </div>
    </footer>
  );
}
