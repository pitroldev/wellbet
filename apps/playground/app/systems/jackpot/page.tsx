"use client";

import { motion, MotionConfig } from "framer-motion";
import { Zap, Ticket, Crown, RotateCcw, Gem, Trophy, Coins } from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { ProductWordmark, BoltMark } from "@/app/components/wellbet-logo";
import { J, SPRING, GLOW_MAGENTA } from "./_components/tokens";
import { Palette } from "./_components/palette";
import { TypeSpecimen } from "./_components/type-specimen";
import { BaseComponents } from "./_components/base-components";
import { SlotMachine } from "./_components/slot-machine";
import { ProgressiveJackpot } from "./_components/progressive-jackpot";
import { FortuneWheel } from "./_components/fortune-wheel";
import { ScratchCard } from "./_components/scratch-card";
import { BetSlip } from "./_components/bet-slip";
import { MegaWin } from "./_components/mega-win";
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
        style={{ background: J.magenta, color: "#fff", boxShadow: GLOW_MAGENTA }}
      >
        {n}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm" style={{ color: J.textMute }}>
        {children}
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-[family-name:var(--font-archivo)] uppercase leading-[0.95] tracking-[-0.01em]"
      style={{ color: J.text, fontSize: "clamp(2rem,7vw,3.2rem)", fontWeight: 900 }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: J.textSoft }}>
      {children}
    </p>
  );
}

function WidgetTitle({ Icon, children }: { Icon: typeof Zap; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: J.surfaceUp }}>
        <Icon size={15} style={{ color: J.pink }} strokeWidth={2.4} />
      </span>
      <span className="text-base font-extrabold" style={{ color: J.text }}>
        {children}
      </span>
    </div>
  );
}

export default function JackpotPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main
        className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-jakarta)]"
        style={{ background: J.bg, color: J.text }}
      >
        {/* glows de palco no fundo */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,0,255,.28), transparent 70%)" }} />
          <div className="absolute -right-40 top-40 h-96 w-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(101,111,255,.26), transparent 70%)" }} />
          <div className="absolute bottom-0 left-1/2 h-96 w-[120%] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(255,128,225,.16), transparent 70%)" }} />
        </div>

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
      <motion.div {...reveal}>
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ background: J.surfaceUp, color: J.pink }}
        >
          <BoltMark style={{ height: 12, width: "auto", color: J.magenta }} /> Design System · Jackpot / Slots
        </span>
      </motion.div>

      <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="font-[family-name:var(--font-archivo)] uppercase leading-[0.86] tracking-[-0.01em]"
            style={{ color: J.text, fontSize: "clamp(2.8rem,12vw,5.6rem)", fontWeight: 900 }}
          >
            Puxa.
            <span
              className="block"
              style={{
                backgroundImage: "linear-gradient(110deg,#FF00FF,#FF80E1 55%,#41FFCA)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(255,0,255,.4)",
              }}
            >
              Gira. Fatura.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: J.textSoft }}
          >
            O palácio de caça-níqueis da wellbet & Co. Três rolos, jackpot progressivo, roda da
            fortuna e raspadinha — luzes piscando, <strong style={{ color: J.green }}>green</strong> de
            verdade. Premium, brilhante, dopamina no talo.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...SPRING }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <a
              href="#playground"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold"
              style={{ background: J.magenta, color: "#fff", boxShadow: GLOW_MAGENTA }}
            >
              <Zap size={16} fill="#fff" /> Girar agora
            </a>
            <a
              href="#screens"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold"
              style={{ background: J.surfaceUp, color: J.text, boxShadow: "inset 0 0 0 1.5px " + J.line }}
            >
              Ver o app
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.2 }}
        >
          <SlotMachine bet={20} />
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
        <H2>A linguagem do palácio.</H2>
        <Lead>
          Indigo profundo no chão, magenta e pink no palco, o green do prêmio e dourado só nas
          moedas. Cada peça é <strong>tocável</strong> — copie uma cor, varie a manchete, mexa nos
          controles.
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
    <section id="playground" className="relative mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="02">Playground · Tudo clicável</SectionLabel>
        <H2>Puxa. Gira. Fatura.</H2>
        <Lead>
          Slot de 3 rolos, pote que sobe sozinho, roda da fortuna, raspadinha, o cupom e o momento
          Mega Win. Toque, repita, brinque de novo — tudo de verdade.
        </Lead>
      </motion.div>

      {/* slot protagonista + jackpot progressivo */}
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.85fr]">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Zap}>Caça-níqueis · 3 rolos</WidgetTitle>
          <SlotMachine bet={20} />
        </motion.div>
        <motion.div {...reveal} className="flex flex-col gap-6">
          <div>
            <WidgetTitle Icon={Crown}>Pote progressivo</WidgetTitle>
            <ProgressiveJackpot />
          </div>
          <div>
            <WidgetTitle Icon={Ticket}>Cupom de aposta</WidgetTitle>
            <BetSlip />
          </div>
        </motion.div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={RotateCcw}>Roda da fortuna</WidgetTitle>
          <FortuneWheel />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Gem}>Raspadinha</WidgetTitle>
          <ScratchCard />
        </motion.div>
      </div>

      <motion.div {...reveal} className="mt-12">
        <WidgetTitle Icon={Trophy}>Momento Mega Win</WidgetTitle>
        <div className="mx-auto max-w-md">
          <MegaWin />
        </div>
      </motion.div>
    </section>
  );
}

function SectionScreens() {
  return (
    <section id="screens" className="relative mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="03">Telas · O app Jackpot</SectionLabel>
        <H2>Como vira produto.</H2>
        <Lead>
          As mesmas peças, montadas no app real: a máquina de caça-níqueis, o jackpot com a roda da
          fortuna e a tela de Mega Win com os ganhadores. Arraste lateralmente no celular.
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: J.line }}>
        <span className="inline-flex items-center gap-2">
          <ProductWordmark brand="gym" size={22} tone="light" accent={J.magenta} />
          <Coins size={16} style={{ color: J.gold }} />
        </span>
        <p className="text-sm" style={{ color: J.textMute }}>
          A melhor aposta é na sua mudança. · Archivo + Plus Jakarta Sans + Geist Mono
        </p>
      </div>
    </footer>
  );
}
