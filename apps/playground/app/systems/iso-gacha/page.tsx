"use client";

import { motion, MotionConfig } from "framer-motion";
import { Sparkles, Zap, Shield, Coins, TrendingUp } from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { ISO, SPRING } from "./_components/tokens";
import { IsoCube, IsoCard, IsoTag, IsoButton } from "./_components/iso-primitives";
import { IsoVault } from "./_components/iso-vault";
import { WidgetBetSlip } from "./_components/widget-bet-slip";
import { WidgetAccumulator } from "./_components/widget-accumulator";
import { WidgetCashOut } from "./_components/widget-cashout";
import { WidgetGreen } from "./_components/widget-green";
import { OddsBoard } from "./_components/odds-board";
import { PaletteSwatches } from "./_components/palette-swatches";
import { TypographySpecimen } from "./_components/typography-specimen";
import { BaseComponents } from "./_components/base-components";
import { PhonePrototype } from "./_components/phone-prototype";
import { GachaSlot } from "./_components/iso-slot";

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
        className="flex h-9 w-9 items-center justify-center rounded-xl font-[family-name:var(--font-display)] text-sm font-bold"
        style={{ background: ISO.ink, color: ISO.yellow }}
      >
        {n}
      </span>
      <span
        className="text-xs font-bold uppercase tracking-[0.18em] sm:text-sm"
        style={{ color: ISO.inkSoft }}
      >
        {children}
      </span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="font-[family-name:var(--font-display)] font-bold leading-[1.05]"
      style={{ color: ISO.ink, fontSize: "clamp(1.9rem, 7vw, 3.2rem)" }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="mt-3 max-w-2xl text-base leading-relaxed sm:text-lg"
      style={{ color: ISO.inkSoft }}
    >
      {children}
    </p>
  );
}

export default function IsoGachaPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main
        className="relative min-h-screen overflow-x-hidden font-[family-name:var(--font-body)]"
        style={{ background: ISO.base, color: ISO.ink }}
      >
        <BackToHub className="border-black/10 bg-white/70 text-[#1B1230] hover:bg-white" />

        {/* malha de pontos tátil de fundo */}
        <div
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            backgroundImage: `radial-gradient(${ISO.purple}22 1.5px, transparent 1.5px)`,
            backgroundSize: "26px 26px",
          }}
        />

        <Hero />
        <SectionFoundations />
        <SectionPlayground />
        <SectionScreens />
        <Footer />
      </main>
    </MotionConfig>
  );
}

/* ─────────────────────────── HERO ─────────────────────────── */
function Hero() {
  const cubes = [
    { top: ISO.purpleSoft, left: ISO.purple, right: ISO.purpleDeep, d: 0 },
    { top: "#54EFB0", left: ISO.green, right: ISO.greenDeep, d: 0.1 },
    { top: ISO.yellow, left: ISO.yellowDeep, right: "#B07C09", d: 0.2 },
  ];
  return (
    <section className="mx-auto max-w-6xl px-5 pb-10 pt-20 sm:px-10 sm:pt-28">
      <motion.div {...reveal}>
        <IsoTag bg={ISO.green} fg={ISO.ink}>
          <Sparkles size={13} /> Design System · Iso-Gacha · BET
        </IsoTag>
      </motion.div>

      <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="font-[family-name:var(--font-display)] font-bold leading-[0.95]"
            style={{ color: ISO.ink, fontSize: "clamp(2.6rem, 12vw, 5.5rem)" }}
          >
            Aposte
            <span className="block" style={{ color: ISO.purple }}>
              em você.
            </span>
            <span className="block" style={{ color: ISO.greenDeep }}>
              Dê green.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: ISO.inkSoft }}
          >
            A única aposta em que você torce para{" "}
            <strong style={{ color: ISO.ink }}>você ganhar</strong>. Monte o cupom, veja a cotação
            subir, empilhe a acumuladora — tudo em 3D tátil e colecionável.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, ...SPRING }}
            className="mt-7 flex flex-wrap gap-3"
          >
            <IsoButton bg={ISO.green} fg={ISO.ink} shadow={ISO.greenDeep}>
              <Zap size={16} className="mr-1 inline" fill={ISO.ink} /> Fazer aposta
            </IsoButton>
            <IsoButton bg="#FFFFFF" fg={ISO.ink} shadow={ISO.inkSoft}>
              Ver cotações
            </IsoButton>
          </motion.div>
        </div>

        {/* pilha de cubos = pernas da acumuladora */}
        <div className="flex items-end justify-center gap-2 lg:justify-end">
          {cubes.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -60, rotate: -8 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ ...SPRING, delay: 0.2 + c.d }}
              whileHover={{ y: -14 }}
            >
              <IsoCube size={72 + i * 12} top={c.top} left={c.left} right={c.right} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ SEÇÃO 1 · FUNDAMENTOS ═══════════ */
function SectionFoundations() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="01">Fundamentos · Style guide</SectionLabel>
        <H2>A linguagem da casa.</H2>
        <Lead>
          Cores de brinquedo com contorno de adulto, sombras <strong>sólidas e deslocadas</strong>{" "}
          (sem blur neon) e tipografia arredondada. Tudo parece um objeto que você pega na mão.
        </Lead>
      </motion.div>

      <div className="space-y-16 sm:space-y-20">
        <PaletteSwatches />
        <TypographySpecimen />
        <BaseComponents />
      </div>
    </section>
  );
}

/* ═══════════ SEÇÃO 2 · PLAYGROUND DOPAMINÉRGICO ═══════════ */
function SectionPlayground() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24 flex flex-col gap-6">
      <motion.div {...reveal}>
        <SectionLabel n="02">Playground · Tudo clicável</SectionLabel>
        <H2>Monte. Aposte. Dê green.</H2>
        <Lead>
          Tudo aqui é <strong>de verdade</strong>: stake, cotação ao vivo, acumuladora empilhando,
          cash out e o flip do “deu green”. Toque, repita, brinque de novo.
        </Lead>
      </motion.div>

      {/* o cupom — protagonista, full no mobile */}
      <motion.div {...reveal} className="mt-8">
        <WidgetTitle Icon={Zap} color={ISO.green}>
          Cupom de aposta
        </WidgetTitle>
        <div className="mx-auto max-w-md">
          <WidgetBetSlip />
        </div>
      </motion.div>

      {/* acumuladora + cash out lado a lado em telas grandes */}
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={TrendingUp} color={ISO.purple}>
            Acumuladora (cada dia = uma perna)
          </WidgetTitle>
          <WidgetAccumulator />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Coins} color={ISO.yellowDeep}>
            Cash out ao vivo
          </WidgetTitle>
          <WidgetCashOut />
        </motion.div>
      </div>

      {/* deu green + free bet */}
      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        <motion.div {...reveal}>
          <WidgetTitle Icon={Zap} color={ISO.greenDeep}>
            Check-in → deu green
          </WidgetTitle>
          <WidgetGreen />
        </motion.div>
        <motion.div {...reveal}>
          <WidgetTitle Icon={Shield} color={ISO.purple}>
            Free bet por consistência
          </WidgetTitle>
          <IsoCard
            className="flex h-full flex-col items-center justify-center py-8"
            shadow={ISO.purpleDeep}
            bg="#FFFFFF"
          >
            <IsoVault freeBet={25} />
          </IsoCard>
        </motion.div>
      </div>

      {/* gacha — caça-níquel de 1 rolo */}
      <motion.div {...reveal} className="mt-10">
        <WidgetTitle Icon={Sparkles} color={ISO.yellowDeep}>
          Caça-níquel · gira e ganha
        </WidgetTitle>
        <div className="mx-auto max-w-md">
          <GachaSlot />
        </div>
      </motion.div>

      {/* odds board */}
      <motion.div {...reveal} className="mt-10">
        <WidgetTitle Icon={TrendingUp} color={ISO.greenDeep}>
          Odds board · quem deu green
        </WidgetTitle>
        <div className="mx-auto max-w-lg">
          <OddsBoard />
        </div>
      </motion.div>
    </section>
  );
}

function WidgetTitle({
  children,
  Icon,
  color,
}: {
  children: React.ReactNode;
  Icon: typeof Zap;
  color: string;
}) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span
        className="grid h-7 w-7 place-items-center rounded-lg"
        style={{ background: color, border: `2px solid ${ISO.ink}` }}
      >
        <Icon size={15} color="#FFFFFF" strokeWidth={2.6} />
      </span>
      <span
        className="font-[family-name:var(--font-display)] text-lg font-bold"
        style={{ color: ISO.ink }}
      >
        {children}
      </span>
    </div>
  );
}

/* ═══════════ SEÇÃO 3 · TELAS DO APP ═══════════ */
function SectionScreens() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16 sm:px-10 sm:py-24">
      <motion.div {...reveal}>
        <SectionLabel n="03">Telas · O app da Charya</SectionLabel>
        <H2>Como vira produto.</H2>
        <Lead>
          As mesmas peças, montadas no app real: home com banca, montar cupom, o momento “deu green”
          e o ranking de quem ganhou a aposta.
        </Lead>
      </motion.div>

      <motion.div {...reveal} className="mt-10 flex justify-center">
        <PhonePrototype />
      </motion.div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-10">
      <div
        className="flex flex-wrap items-center justify-between gap-4 border-t-[3px] pt-6"
        style={{ borderColor: ISO.ink }}
      >
        <div className="flex items-center gap-3">
          <IsoCube size={36} />
          <span
            className="font-[family-name:var(--font-display)] text-lg font-bold"
            style={{ color: ISO.ink }}
          >
            CHARYA · Iso-Gacha
          </span>
        </div>
        <p className="text-sm" style={{ color: ISO.inkSoft }}>
          A única aposta em que você torce para você ganhar. · Fredoka + Space Grotesk
        </p>
      </div>
    </footer>
  );
}
