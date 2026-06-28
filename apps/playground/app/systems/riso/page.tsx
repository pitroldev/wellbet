"use client";

import { motion, MotionConfig } from "framer-motion";
import { Zap, Gift, Stamp as StampIcon, Trophy, Megaphone, Table2, Scissors } from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { ProductWordmark } from "@/app/components/wellbet-logo";
import { R, SETTLE } from "./_components/tokens";
import { Grain, MisprintTitle, Stamp, HalftoneField } from "./_components/print-kit";
import { Palette } from "./_components/palette";
import { TypeSpecimen } from "./_components/type-specimen";
import { BaseComponents } from "./_components/base-components";
import { Ticket } from "./_components/ticket";
import { Scratch } from "./_components/scratch";
import { GreenStamp } from "./_components/green-stamp";
import { OddsBoard } from "./_components/odds-board";
import { Leaderboard } from "./_components/leaderboard";
import { Campaign } from "./_components/campaign";
import { PhoneScreens } from "./_components/phone-screens";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: SETTLE,
};

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className="grid h-10 w-10 place-items-center font-[family-name:var(--font-archivo)] text-base font-extrabold"
        style={{ background: R.magenta, color: "#fff", border: `2.5px solid ${R.ink}`, boxShadow: "3px 3px 0 0 " + R.ink }}
      >
        {n}
      </span>
      <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.22em]" style={{ color: R.ink }}>
        {children}
      </span>
    </div>
  );
}

function H2({ children, ink1 = R.magenta, ink2 = R.blue }: { children: React.ReactNode; ink1?: string; ink2?: string }) {
  return (
    <MisprintTitle ink1={ink1} ink2={ink2} size="clamp(1.9rem,8vw,3.4rem)" className="mt-1">
      {children}
    </MisprintTitle>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: R.ink }}>
      {children}
    </p>
  );
}

function WidgetTitle({ Icon, children }: { Icon: typeof Zap; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-8 w-8 place-items-center" style={{ background: R.paper, border: `2.5px solid ${R.ink}` }}>
        <Icon size={15} style={{ color: R.ink }} strokeWidth={2.6} />
      </span>
      <span className="font-[family-name:var(--font-archivo)] text-base font-extrabold uppercase" style={{ color: R.ink }}>
        {children}
      </span>
    </div>
  );
}

export default function RisoPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main
        className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-jakarta)]"
        style={{ background: R.paper, color: R.ink }}
      >
        {/* grão sobre a folha inteira */}
        <Grain opacity={0.3} />

        <BackToHub className="border-[#08161E] bg-[#F3EEE3] text-[#08161E] hover:bg-[#E9E2D2]" />

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
    <section className="relative mx-auto max-w-6xl px-5 pb-10 pt-20 sm:px-10 sm:pt-28">
      <motion.div {...reveal} className="flex flex-wrap items-center gap-3">
        <Stamp color={R.magenta} rotate={-6}>
          <Zap size={13} fill={R.magenta} /> Design System · Riso
        </Stamp>
        <Stamp color={R.blue} rotate={4} style={{ fontSize: 11 }}>
          edição limitada
        </Stamp>
      </motion.div>

      <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={SETTLE}>
            <MisprintTitle ink1={R.magenta} ink2={R.blue} size="clamp(2.6rem,13vw,5.5rem)">
              Impressa na sua mudança.
            </MisprintTitle>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-6 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: R.ink }}
          >
            Tinta sobre papel quente. Meio-tom, sobreposição de tintas e grão. Aposte na sua meta,
            carimbe a evolução e veja o <strong style={{ color: R.indigo }}>green</strong> sair impresso.
            Cada cupom é <strong>edição limitada</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...SETTLE }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <button className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-extrabold uppercase" style={{ background: R.magenta, color: "#fff", border: `2.5px solid ${R.ink}`, boxShadow: "4px 4px 0 0 " + R.ink, fontFamily: "var(--font-archivo)" }}>
              <Zap size={16} fill="#fff" /> Imprimir cupom
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-extrabold uppercase" style={{ background: R.paper, color: R.ink, border: `2.5px solid ${R.ink}`, fontFamily: "var(--font-archivo)" }}>
              Ver odds
            </button>
          </motion.div>
        </div>

        {/* pôster lateral: campos de halftone sobrepostos (overprint) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
          transition={{ ...SETTLE, delay: 0.2 }}
          className="relative aspect-[4/5] overflow-hidden"
          style={{ background: R.green, border: `2.5px solid ${R.ink}`, boxShadow: "6px 6px 0 0 " + R.ink }}
        >
          <HalftoneField color={R.magenta} size={11} dot={0.42} opacity={0.9} />
          <HalftoneField color={R.blue} size={9} dot={0.4} opacity={0.85} style={{ backgroundPosition: "4px 4px" }} />
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div>
              <p className="font-[family-name:var(--font-archivo)] text-5xl font-extrabold uppercase leading-[0.85]" style={{ color: R.ink }}>
                Deu<br />green
              </p>
              <p className="mt-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em]" style={{ color: R.ink }}>
                serigrafia · 1 de 1.284
              </p>
            </div>
          </div>
          <Grain opacity={0.35} />
        </motion.div>
      </div>
    </section>
  );
}

function SectionFoundations() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="01">Fundamentos · prova de impressão</SectionLabel>
        <H2>A folha de estilo.</H2>
        <Lead>
          Tintas da marca sobre papel creme, tipo de pôster com erro de registro e componentes que
          assentam no toque. Tudo aqui é <strong>tocável</strong> — copie um hex, desalinhe a manchete, mexa nos controles.
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
      <motion.div {...reveal}>
        <SectionLabel n="02">Playground · tudo clicável</SectionLabel>
        <H2 ink1={R.blue} ink2={R.green}>Monte. Raspe. Dê green.</H2>
        <Lead>
          Cupom impresso, raspadinha de free bet, carimbo &ldquo;deu green&rdquo;, quadro de odds e ranking de tinta.
          Toque, raspe, carimbe de novo — tudo de verdade.
        </Lead>
      </motion.div>

      {/* Cupom (assinatura) + Raspadinha (assinatura) lado a lado */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Zap}>Cupom-pôster</WidgetTitle>
          <Ticket />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Gift}>Raspadinha · free bet</WidgetTitle>
          <Scratch />
        </motion.div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={StampIcon}>Carimbo &ldquo;deu green&rdquo; · check-in</WidgetTitle>
          <GreenStamp />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Table2}>Quadro de odds</WidgetTitle>
          <OddsBoard />
        </motion.div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Trophy}>Ranking impresso</WidgetTitle>
          <Leaderboard />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Megaphone}>Pôster de campanha</WidgetTitle>
          <Campaign />
        </motion.div>
      </div>
    </section>
  );
}

function SectionScreens() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="03">Telas · o zine vira app</SectionLabel>
        <H2 ink1={R.indigo} ink2={R.pink}>Como vira produto.</H2>
        <Lead>
          As mesmas tintas montadas no app: capa-pôster com a banca, o cupom impresso e o ranking-zine.
          Arraste lateralmente no celular.
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
      <div className="flex flex-wrap items-center justify-between gap-4 border-t-[2.5px] pt-6" style={{ borderColor: R.ink }}>
        <div className="flex items-center gap-3">
          <ProductWordmark brand="well" size={22} />
          <Scissors size={16} style={{ color: R.ink }} />
        </div>
        <p className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider" style={{ color: R.ink }}>
          Edição limitada · Archivo + Fraunces · tinta sobre papel
        </p>
      </div>
    </footer>
  );
}
