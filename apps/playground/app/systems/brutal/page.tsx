"use client";

import { motion, MotionConfig } from "framer-motion";
import { Zap, Layers, Trophy, Play, Stamp } from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { ProductWordmark, BoltMark } from "@/app/components/wellbet-logo";
import { B, BORDER, shadow } from "./_components/tokens";
import { Block, BrutalButton, Sticker, Rule, RecDot, Caret, MonoLabel } from "./_components/primitives";
import { Palette } from "./_components/palette";
import { TypeSpecimen } from "./_components/type-specimen";
import { BaseComponents } from "./_components/base-components";
import { Ticker } from "./_components/ticker";
import { BetSlip } from "./_components/bet-slip";
import { Accumulator } from "./_components/accumulator";
import { GreenStamp } from "./_components/green-stamp";
import { Leaderboard } from "./_components/leaderboard";
import { Slot } from "./_components/slot";
import { PhoneScreens } from "./_components/phone-screens";

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.18, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
};

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span
        className="grid h-10 w-10 place-items-center font-[family-name:var(--font-archivo)] text-base font-black"
        style={{ background: B.ink, color: B.green, border: BORDER, boxShadow: shadow(4) }}
      >
        {n}
      </span>
      <MonoLabel style={{ color: B.ink }}>{children}</MonoLabel>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-[family-name:var(--font-archivo)] font-black uppercase leading-[0.88] tracking-[-0.02em]"
      style={{ color: B.ink, fontSize: "clamp(2.2rem,8vw,4rem)" }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-3 max-w-2xl font-[family-name:var(--font-mono)] text-sm leading-relaxed sm:text-base" style={{ color: B.ink, opacity: 0.75 }}>
      {children}
    </p>
  );
}

function WidgetTitle({ Icon, children }: { Icon: typeof Zap; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="grid h-7 w-7 place-items-center" style={{ background: B.ink }}>
        <Icon size={15} style={{ color: B.green }} strokeWidth={2.6} />
      </span>
      <span className="font-[family-name:var(--font-archivo)] text-base font-black uppercase tracking-wide" style={{ color: B.ink }}>
        {children}
      </span>
    </div>
  );
}

export default function BrutalPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main
        className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-jakarta)]"
        style={{ background: B.paper, color: B.ink }}
      >
        <BackToHub className="rounded-none border-[3px] border-[#08161E] bg-[#FAFBFC] text-[#08161E] shadow-[4px_4px_0_#08161E] backdrop-blur-none hover:bg-[#41FFCA]" />
        <Hero />
        <Ticker />
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
    <section className="mx-auto max-w-6xl px-5 pb-8 pt-20 sm:px-10 sm:pt-24">
      <motion.div {...reveal} className="flex flex-wrap items-center gap-3">
        <span
          className="inline-flex items-center gap-2 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest"
          style={{ background: B.ink, color: B.green, border: BORDER, boxShadow: shadow(4), padding: "8px 12px" }}
        >
          <BoltMark style={{ height: 12, width: "auto", color: B.green }} /> DESIGN SYSTEM // BRUTALISTA
        </span>
        <RecDot label="AO VIVO" />
      </motion.div>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className="font-[family-name:var(--font-archivo)] font-black uppercase leading-[0.84] tracking-[-0.03em]"
            style={{ color: B.ink, fontSize: "clamp(3rem,13vw,6.5rem)" }}
          >
            SEM
            <br />
            FIRULA.
            <span className="mt-1 block" style={{ color: B.magenta }}>
              SÓ APOSTA<Caret color={B.magenta} />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="mt-5 max-w-lg font-[family-name:var(--font-mono)] text-sm leading-relaxed"
            style={{ color: B.ink, opacity: 0.8 }}
          >
            &gt; SAÚDE + DINHEIRO = WELLBET. Bordas duras, mono de terminal, blocos chapados.
            Aposte na meta, registre a evolução, veja o <strong>GREEN</strong> bater na banca.
            Cru. Honesto. Mecânico.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.18 }}
            className="mt-7 flex flex-wrap gap-4"
          >
            <BrutalButton bg={B.magenta} fg="#FFFFFF" off={6}>
              <Zap size={16} fill="currentColor" /> FAZER APOSTA
            </BrutalButton>
            <BrutalButton bg={B.white} fg={B.ink} off={6}>
              VER COTAÇÕES
            </BrutalButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.22 }}
          className="relative"
        >
          <span className="absolute -left-3 -top-4 z-10">
            <Sticker bg={B.green} fg={B.ink} rotate={-5}>BANCA ATIVA</Sticker>
          </span>
          <Block bg={B.ink} off={8} className="p-5">
            <div className="flex items-center justify-between">
              <MonoLabel style={{ color: "#FFFFFF", opacity: 0.55 }}>{"// PAINEL"}</MonoLabel>
              <ProductWordmark brand="well" size={18} tone="light" />
            </div>
            <Rule char="=" className="my-3" />
            <div className="font-[family-name:var(--font-mono)] text-sm">
              <Line k="BANCA" v="R$ 347,50" vColor={B.green} />
              <Line k="STREAK" v="07 DIAS" vColor="#FFFFFF" />
              <Line k="META 7D" v="-2,4/-4 KG" vColor={B.pink} />
              <Line k="FREE BET" v="DISPONÍVEL" vColor={B.green} />
            </div>
            <Rule char="=" className="my-3" />
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "ODD", v: "1,85", bg: B.magenta, fg: "#FFFFFF" },
                { label: "STAKE", v: "R$50", bg: B.blue, fg: "#FFFFFF" },
                { label: "PAYOUT", v: "R$92", bg: B.green, fg: B.ink },
              ].map((s) => (
                <div key={s.label} className="p-2 text-center" style={{ background: s.bg, color: s.fg, border: `2px solid ${B.ink}` }}>
                  <span className="block font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider opacity-80">{s.label}</span>
                  <span className="font-[family-name:var(--font-mono)] text-base font-bold tabular-nums">{s.v}</span>
                </div>
              ))}
            </div>
          </Block>
        </motion.div>
      </div>
    </section>
  );
}

function Line({ k, v, vColor }: { k: string; v: string; vColor: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="uppercase tracking-wide text-white/55">{k}</span>
      <span className="font-bold tabular-nums" style={{ color: vColor }}>
        {v}
      </span>
    </div>
  );
}

function SectionFoundations() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
      <motion.div {...reveal}>
        <SectionLabel n="01">FUNDAMENTOS // STYLE GUIDE</SectionLabel>
        <H2>
          A LÍNGUA <span style={{ color: B.magenta }}>CRUA</span>
          <br />
          DO PRODUTO.
        </H2>
        <Lead>
          &gt; Papel, tinta, blocos chapados e sombras sólidas. Cada peça é TOCÁVEL — copie um
          hex, troque a manchete, mexa nos controles. Tudo afunda quando você aperta.
        </Lead>
      </motion.div>

      <div className="mt-10 space-y-12">
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
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
      <motion.div {...reveal}>
        <SectionLabel n="02">PLAYGROUND // TUDO CLICÁVEL</SectionLabel>
        <H2>
          MONTE.
          <br />
          APOSTE. <span style={{ color: B.magenta }}>GREEN.</span>
        </H2>
        <Lead>
          &gt; Cupom, acumuladora, slot de 1 rolo, carimbo do green e ranking da liga. Toque,
          repita, gire de novo — tudo de verdade, sem firula.
        </Lead>
      </motion.div>

      <motion.div {...reveal} className="mt-10">
        <WidgetTitle Icon={Zap}>CUPOM DE APOSTA</WidgetTitle>
        <div className="mx-auto max-w-md">
          <BetSlip />
        </div>
      </motion.div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Layers}>ACUMULADORA DA SEMANA</WidgetTitle>
          <Accumulator />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Stamp}>CHECK-IN // CARIMBO DO GREEN</WidgetTitle>
          <GreenStamp />
        </motion.div>
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Play}>SLOT MECÂNICO · 1 ROLO</WidgetTitle>
          <Slot />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Trophy}>RANKING DA LIGA</WidgetTitle>
          <Leaderboard />
        </motion.div>
      </div>
    </section>
  );
}

function SectionScreens() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-20">
      <motion.div {...reveal}>
        <SectionLabel n="03">TELAS // O APP CRU</SectionLabel>
        <H2>
          COMO VIRA <span style={{ color: B.magenta }}>PRODUTO.</span>
        </H2>
        <Lead>
          &gt; As mesmas peças montadas no app: home com banca, montar cupom e o ranking da
          liga. Bordas duras até no bolso. Arraste de lado no celular.
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
      <Rule char="=" className="mb-5" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ProductWordmark brand="well" size={22} />
        <p className="flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wide" style={{ color: B.ink, opacity: 0.65 }}>
          SEM FIRULA. SÓ APOSTA. · ARCHIVO + GEIST MONO<Caret />
        </p>
      </div>
    </footer>
  );
}
