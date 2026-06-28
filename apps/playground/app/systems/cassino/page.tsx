"use client";

import { motion, MotionConfig } from "framer-motion";
import {
  Coins,
  Spade,
  Dice5,
  Gem,
  TrendingUp,
  CircleDollarSign,
  Layers,
  Zap,
} from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { WellbetCoLogo, BoltMark } from "@/app/components/wellbet-logo";
import { N, SPRING, GRADIENT, neonText } from "./_components/tokens";
import { Palette } from "./_components/palette";
import { TypeSpecimen } from "./_components/type-specimen";
import { BaseComponents } from "./_components/base-components";
import { Roulette } from "./_components/roulette";
import { CardHand } from "./_components/card-hand";
import { DiceRoll } from "./_components/dice";
import { ChipStack } from "./_components/chip-stack";
import { BetSlip } from "./_components/bet-slip";
import { CashOut } from "./_components/cashout";
import { JackpotSlot } from "./_components/jackpot-slot";
import { PhoneScreens } from "./_components/phone-screens";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: SPRING,
};

function SectionLabel({ n, color, children }: { n: string; color: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className="grid h-9 w-9 place-items-center rounded-xl font-[family-name:var(--font-mono)] text-sm font-extrabold"
        style={{ background: color, color: "#fff", boxShadow: `0 0 16px ${color}88` }}
      >
        {n}
      </span>
      <span
        className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.24em] sm:text-sm"
        style={{ color, textShadow: neonText(color) }}
      >
        {children}
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-[family-name:var(--font-fraunces)] leading-[1.02] tracking-[-0.02em]"
      style={{ color: N.white, fontSize: "clamp(2rem,7vw,3.2rem)", fontVariationSettings: '"SOFT" 40,"opsz" 144' }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: N.mute }}>
      {children}
    </p>
  );
}

function WidgetTitle({ Icon, color, children }: { Icon: typeof Zap; color: string; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: `${color}22` }}>
        <Icon size={15} style={{ color }} strokeWidth={2.4} />
      </span>
      <span className="text-base font-extrabold" style={{ color: N.white }}>
        {children}
      </span>
    </div>
  );
}

export default function CassinoPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main
        className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-jakarta)]"
        style={{
          background: `radial-gradient(circle at 18% -5%, ${N.indigo}40, transparent 45%), radial-gradient(circle at 85% 8%, ${N.magenta}26, transparent 40%), ${N.ground}`,
          color: N.white,
        }}
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
    <section className="mx-auto max-w-6xl px-5 pb-8 pt-20 sm:px-10 sm:pt-28">
      <motion.div {...reveal}>
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
          style={{ background: "rgba(255,0,255,.12)", color: N.pink, boxShadow: `0 0 16px ${N.magenta}44` }}
        >
          <BoltMark style={{ height: 12, width: "auto", color: N.magenta }} /> Design System · Cassino Neon
        </span>
      </motion.div>

      <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="font-[family-name:var(--font-fraunces)] leading-[0.95] tracking-[-0.02em]"
            style={{ color: N.white, fontSize: "clamp(2.6rem,11vw,5rem)", fontVariationSettings: '"SOFT" 60,"WONK" 1,"opsz" 144' }}
          >
            A mesa está
            <span className="block" style={{ color: N.green, textShadow: neonText(N.green) }}>
              acesa hoje.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: N.mute }}
          >
            Roleta, fichas, cartas e dados sob neon. Gire, distribua, faça o{" "}
            <strong style={{ color: N.green }}>green</strong> cair na banca. Cassino-cripto premium,
            feltro de verdade — <strong style={{ color: N.pink }}>Bora? Bora!</strong>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...SPRING }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <button
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold"
              style={{ background: N.magenta, color: "#fff", boxShadow: `0 0 26px ${N.magenta}99` }}
            >
              <Coins size={16} /> Entrar na mesa
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-extrabold"
              style={{ background: "transparent", color: N.white, boxShadow: `inset 0 0 0 1.5px ${N.line}` }}
            >
              Ver odds ao vivo
            </button>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ ...SPRING, delay: 0.2 }}>
          <Roulette />
        </motion.div>
      </div>
    </section>
  );
}

function SectionFoundations() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="01" color={N.magenta}>
          Fundamentos · Style guide
        </SectionLabel>
        <H2>A linguagem da mesa.</H2>
        <Lead>
          Feltro verde, letreiro neon, fichas nas cores da marca e tipografia royale. Cada peça é{" "}
          <strong style={{ color: N.green }}>tocável</strong> — copie uma cor, varie a fonte, mexa nos
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
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="02" color={N.green}>
          Playground · Tudo clicável
        </SectionLabel>
        <H2>Gire. Distribua. Dê green.</H2>
        <Lead>
          Roleta, cartas, dados, fichas, cupom, cash out e o caça-níquel do jackpot. Antecipação,
          ação e recompensa — toque, repita, brinque de novo.
        </Lead>
      </motion.div>

      {/* Cupom — destaque, largura média */}
      <motion.div {...reveal} className="mt-10">
        <WidgetTitle Icon={CircleDollarSign} color={N.green}>
          Cupom · ticket de cassino
        </WidgetTitle>
        <div className="mx-auto max-w-md">
          <BetSlip />
        </div>
      </motion.div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Spade} color={N.green}>
            Mão de cartas · blackjack
          </WidgetTitle>
          <CardHand />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Dice5} color={N.blue}>
            Dados · role e some
          </WidgetTitle>
          <DiceRoll />
        </motion.div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Layers} color={N.gold}>
            Fichas · monte o stake
          </WidgetTitle>
          <ChipStack />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={TrendingUp} color={N.magenta}>
            Cash out ao vivo
          </WidgetTitle>
          <CashOut />
        </motion.div>
      </div>

      <motion.div {...reveal} className="mt-12">
        <WidgetTitle Icon={Gem} color={N.gold}>
          Caça-níquel · jackpot
        </WidgetTitle>
        <div className="mx-auto max-w-md">
          <JackpotSlot />
        </div>
      </motion.div>
    </section>
  );
}

function SectionScreens() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="03" color={N.blue}>
          Telas · O app na mão
        </SectionLabel>
        <H2>Como vira produto.</H2>
        <Lead>
          As mesmas peças no app real: salão com a banca de fichas, a mesa de roleta e a tela de
          payout “deu green”. Arraste lateralmente no celular.
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: N.line }}>
        <WellbetCoLogo size={22} tone="light" />
        <p className="text-sm" style={{ color: N.mute }}>
          A melhor aposta é na sua mudança. · Fraunces + Archivo + Geist Mono
        </p>
        <span
          className="h-2 w-24 rounded-full"
          style={{ background: GRADIENT.jackpot, boxShadow: `0 0 18px ${N.magenta}66` }}
        />
      </div>
    </footer>
  );
}
