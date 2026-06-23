"use client";

import { MotionConfig, motion } from "framer-motion";
import {
  Ticket,
  HandCoins,
  Layers,
  LineChart,
  Gift,
  ShieldCheck,
  Sparkles,
  Lock,
  Zap,
} from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { cn } from "@/lib/utils";
import { EASE_SOFT, GLOW, HudLabel, mono, OddsChip, Panel } from "./_components/primitives";
import { BetSlip } from "./_components/bet-slip";
import { Accumulator } from "./_components/accumulator";
import { CashOut } from "./_components/cashout";
import { LiveOddsChart } from "./_components/live-odds-chart";
import { GreenBoard } from "./_components/green-board";
import { PhoneScreens } from "./_components/phone-screens";
import { PaletteSwatches, TypeSpecimen, ComponentBoard } from "./_components/foundations-lab";

function SectionHeader({
  index,
  kicker,
  title,
  sub,
}: {
  index: string;
  kicker: string;
  title: string;
  sub?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE_SOFT }}
      className="mb-8"
    >
      <div className="flex items-center gap-3">
        <span className={cn(mono(), "text-xs text-[#8B5CF6]")}>{index}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-[#8B5CF6]/40 to-transparent" />
        <HudLabel>{kicker}</HudLabel>
      </div>
      <h2 className="mt-3 text-[clamp(1.6rem,6vw,2.4rem)] font-bold leading-[1.05] tracking-tight text-[#EDEAF7]">
        {title}
      </h2>
      {sub && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8B83A8]">{sub}</p>}
    </motion.div>
  );
}

export default function GlowComportamentalPage() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen overflow-hidden bg-[#0E0B1A] font-[family-name:var(--font-body)] text-[#EDEAF7]">
        <BackToHub className="border-[#8B5CF6]/30 bg-[#171327]/80 text-[#EDEAF7]" />

        {/* ambient glow de fundo */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute -left-32 top-[-10%] h-[460px] w-[460px] rounded-full bg-[#8B5CF6]/20 blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[520px] w-[520px] rounded-full bg-[#34F5A0]/10 blur-[160px]" />
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(237,234,247,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(237,234,247,0.6) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          {/* ───────────────────────── HERO ───────────────────────── */}
          <section className="flex min-h-[78vh] flex-col justify-center py-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_SOFT }}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-[#8B5CF6]/30 bg-[#171327]/70 px-4 py-1.5"
            >
              <motion.span
                className="h-2 w-2 rounded-full bg-[#34F5A0]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span
                className={cn(mono(), "text-[10px] uppercase tracking-[0.24em] text-[#8B83A8]")}
              >
                Glow Comportamental · sportsbook premium
              </span>
            </motion.div>

            <div className="mt-7 grid items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: EASE_SOFT, delay: 0.05 }}
                  className="text-balance text-[clamp(2.6rem,11vw,5rem)] font-bold leading-[0.96] tracking-tight"
                >
                  Aposte em{" "}
                  <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#34F5A0] bg-clip-text text-transparent">
                    você.
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_SOFT, delay: 0.2 }}
                  className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-[#8B83A8] sm:text-lg"
                >
                  Defina a meta, ajuste a banca, veja a{" "}
                  <em className="not-italic text-[#EDEAF7]">cotação</em> e o{" "}
                  <span className="text-[#34F5A0]">retorno</span> subindo ao vivo. Cumpriu?{" "}
                  <span className="text-[#34F5A0]">Deu green.</span> O sportsbook dark premium com
                  credibilidade de saúde.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE_SOFT, delay: 0.32 }}
                  className="mt-7 flex flex-wrap items-center gap-2.5"
                >
                  <OddsChip tone="green" active>
                    <Zap className="h-3.5 w-3.5" />
                    2.40× ao vivo
                  </OddsChip>
                  <span
                    className={cn(
                      mono(),
                      "rounded-lg border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1.5 text-xs text-[#EDEAF7]",
                    )}
                  >
                    A única aposta em que você torce pra você ganhar.
                  </span>
                </motion.div>
              </div>

              {/* mini-cupom como assinatura no hero */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: EASE_SOFT, delay: 0.3 }}
                className="w-full max-w-sm justify-self-center lg:max-w-none"
              >
                <Panel glow="purple" className="p-5">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4" color={GLOW.purple} />
                    <HudLabel tone="purple">Cupom #CHY-8842</HudLabel>
                  </div>
                  <p className="mt-2 text-lg font-semibold text-[#EDEAF7]">
                    Perder 8 kg em 4 meses
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      ["Stake", "R$ 200", "text-[#EDEAF7]"],
                      ["Cotação", "2.40×", "text-[#8B5CF6]"],
                      ["Retorno", "R$ 480", "text-[#34F5A0]"],
                    ].map(([k, v, c]) => (
                      <div
                        key={k}
                        className="rounded-lg border border-[rgba(139,131,168,0.16)] bg-[#0E0B1A]/60 p-2"
                      >
                        <div className="text-[9px] uppercase tracking-wider text-[#8B83A8]">
                          {k}
                        </div>
                        <div className={cn(mono(), "mt-0.5 text-base font-bold", c)}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-[#34F5A0]/10 py-2 text-[11px] text-[#34F5A0]">
                    <motion.span
                      className="h-1.5 w-1.5 rounded-full bg-[#34F5A0]"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    />
                    <span className={mono()}>68% rumo ao green</span>
                  </div>
                </Panel>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-12 flex items-center gap-2 text-[#8B83A8]"
            >
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={cn(mono(), "text-[11px] uppercase tracking-[0.2em]")}
              >
                role pra montar o cupom ↓
              </motion.span>
            </motion.div>
          </section>

          {/* ═══════════ SEÇÃO 1 — FUNDAMENTOS ═══════════ */}
          <section className="py-14">
            <SectionHeader
              index="01"
              kicker="Fundamentos"
              title="A linguagem do sportsbook"
              sub="Paleta, tipografia e os componentes de bet em repouso. Roxo é estrutura. Verde é sagrado — só green e ganho. Vermelho só acende em risco real."
            />

            {/* paleta · toque pra copiar o hex */}
            <div className="mb-10">
              <PaletteSwatches />
            </div>

            {/* tipografia · controle ao vivo */}
            <div className="mb-10">
              <TypeSpecimen />
            </div>

            {/* componentes de bet · tudo responde ao toque */}
            <Panel className="p-5 sm:p-7">
              <ComponentBoard />
            </Panel>
          </section>

          {/* ═══════════ SEÇÃO 2 — PLAYGROUND DOPAMINÉRGICO ═══════════ */}
          <section className="py-14">
            <SectionHeader
              index="02"
              kicker="Playground dopaminérgico"
              title="Monte, acumule, dê cash out, dê green"
              sub="Tudo aqui é de verdade: ajuste o stake e veja a cotação subir, acenda as pernas da acumuladora, faça cash out com o valor ao vivo. Clique em tudo — dá pra resetar e brincar de novo."
            />

            {/* cupom + cash out lado a lado em telas grandes */}
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <WidgetTag icon={Ticket} label="Cupom de aposta" />
                <BetSlip />
              </div>
              <div>
                <WidgetTag icon={HandCoins} label="Cash out ao vivo" />
                <CashOut />
              </div>
            </div>

            <div className="mt-5 grid gap-12 lg:grid-cols-2">
              <div>
                <WidgetTag icon={Layers} label="Acumuladora (streak)" />
                <Accumulator />
              </div>
              <div>
                <WidgetTag icon={LineChart} label="Cotação ao vivo" />
                <LiveOddsChart />
              </div>
            </div>

            <div className="mt-5">
              <WidgetTag icon={Gift} label="Odds board · quem deu green" />
              <GreenBoard />
            </div>
          </section>

          {/* ═══════════ SEÇÃO 3 — TELAS DO APP ═══════════ */}
          <section className="py-14">
            <SectionHeader
              index="03"
              kicker="Telas do app"
              title="A Charya neste design system"
              sub="Mockups reais do app mobile: home com saldo e aposta ativa, montagem do cupom e o momento do green. Mobile-first — é assim que 90% das pessoas vão apostar em si."
            />
            <PhoneScreens />
          </section>

          {/* ─────────────────── FOOTER ─────────────────── */}
          <footer className="border-t border-[rgba(139,131,168,0.16)] py-10">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" color={GLOW.green} />
                <div>
                  <div className={cn(mono(), "text-sm font-semibold text-[#EDEAF7]")}>
                    CHARYA · Glow Comportamental
                  </div>
                  <p className="mt-0.5 text-xs text-[#8B83A8]">
                    A única aposta em que você torce para você ganhar.
                  </p>
                </div>
              </div>
              <span className={cn(mono(), "text-[11px] text-[#8B83A8]")}>
                Next.js 16 · React 19 · Tailwind v4 · Framer Motion
              </span>
            </div>
          </footer>
        </div>
      </main>
    </MotionConfig>
  );
}

/* etiqueta acima de cada widget do playground */
function WidgetTag({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string; color?: string }>;
  label: string;
}) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <Icon className="h-3.5 w-3.5" color={GLOW.purple} />
      <HudLabel>{label}</HudLabel>
    </div>
  );
}
