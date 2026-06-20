"use client";

import { motion } from "framer-motion";
import { BackToHub } from "@/app/components/back-to-hub";
import { HudLabel, PixelCoin, PixelShield, PixelHeart } from "./_components/primitives";
import { BetSlip } from "./_components/bet-slip";
import { Accumulator } from "./_components/accumulator";
import { CashOut } from "./_components/cash-out";
import { CheckInGreen } from "./_components/check-in-green";
import { FreeBetDrop } from "./_components/free-bet-drop";
import { GreenLeaderboard } from "./_components/green-leaderboard";
import { PhoneScreens } from "./_components/phone-screens";
import {
  PaletteGrid,
  TypeLab,
  ButtonShowcase,
  ChipsAndBadges,
  StakeStepper,
} from "./_components/foundations";

/* ── tokens ──────────────────────────────────────────────────────────────── */
const PALETTE = [
  { hex: "#120A24", name: "bg / ink", note: "fundo de fliperama" },
  { hex: "#1C1140", name: "surface", note: "cupons / HUD" },
  { hex: "#6D28D9", name: "roxo", note: "estrutura" },
  { hex: "#8B5CF6", name: "roxo claro", note: "XP / cotação" },
  { hex: "#22E06B", name: "win-verde", note: "GREEN · só vitória" },
  { hex: "#FFD60A", name: "coin", note: "stake / moeda" },
  { hex: "#EDE9FE", name: "texto", note: "leitura" },
  { hex: "#9D8FC7", name: "muted", note: "apoio" },
  { hex: "#FF5470", name: "red", note: "risco · sem humilhar" },
];

const sectionV = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "linear" as const },
  },
};

/* ── shared chrome ───────────────────────────────────────────────────────── */
function SectionHead({
  n,
  tag,
  title,
  children,
}: {
  n: string;
  tag: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="bg-[#FFD60A] px-2 py-1 font-[family-name:var(--font-display)] text-[10px] text-[#120A24]"
          style={{ boxShadow: "2px 2px 0 0 #B8860B" }}
        >
          {n}
        </span>
        <HudLabel className="text-[11px] text-[#9D8FC7]">{tag}</HudLabel>
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-xl leading-[1.4] text-[#EDE9FE] sm:text-3xl sm:leading-[1.35]">
        {title}
      </h2>
      {children ? (
        <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-[#9D8FC7] sm:text-base">
          {children}
        </p>
      ) : null}
    </div>
  );
}

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      variants={sectionV}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className={`mx-auto w-full max-w-5xl px-4 py-12 sm:px-8 sm:py-16 ${className ?? ""}`}
    >
      {children}
    </motion.section>
  );
}

function CardLabel({ children, title }: { children?: React.ReactNode; title: string }) {
  return (
    <div className="mb-3">
      <HudLabel className="block text-[11px] text-[#8B5CF6]">{title}</HudLabel>
      {children ? (
        <p className="mt-1 font-[family-name:var(--font-body)] text-xs leading-relaxed text-[#9D8FC7]">
          {children}
        </p>
      ) : null}
    </div>
  );
}

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#120A24] font-[family-name:var(--font-body)] text-[#EDE9FE]">
      <BackToHub className="border-[#6D28D9]/50 bg-[#1C1140]/80 text-[#EDE9FE] hover:bg-[#1C1140]" />

      <style>{`
        @keyframes neoArcade-blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        .neoArcade-grid {
          background-image:
            linear-gradient(rgba(109,40,217,0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(109,40,217,0.14) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .neoArcade-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          width: 18px;
          background: #FFD60A;
          border: 2px solid #120A24;
          box-shadow: 2px 2px 0 0 #B8860B;
          cursor: pointer;
          border-radius: 0;
        }
        .neoArcade-range::-moz-range-thumb {
          height: 18px;
          width: 18px;
          background: #FFD60A;
          border: 2px solid #120A24;
          box-shadow: 2px 2px 0 0 #B8860B;
          cursor: pointer;
          border-radius: 0;
        }
      `}</style>

      {/* ╔═══════════════════════ HERO ═══════════════════════╗ */}
      <header className="relative overflow-hidden px-4 pb-12 pt-24 sm:px-8 sm:pt-28">
        <div className="neoArcade-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#6D28D9]/30 blur-[140px]" />
        <div className="pointer-events-none absolute -bottom-40 right-[-10%] h-[460px] w-[460px] rounded-full bg-[#22E06B]/10 blur-[150px]" />

        <div className="relative mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 bg-[#1C1140] px-4 py-2"
            style={{ boxShadow: "0 0 0 2px #6D28D9" }}
          >
            <span
              className="h-2.5 w-2.5 bg-[#22E06B]"
              style={{ animation: "neoArcade-blink 1s steps(1) infinite" }}
            />
            <HudLabel className="text-[11px] text-[#9D8FC7]">CHARYA · NEO-ARCADE</HudLabel>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,6.2vw,3.25rem)] leading-[1.45] text-[#EDE9FE]"
          >
            APOSTE
            <br />
            <span className="text-[#8B5CF6]">EM VOCÊ.</span>
            <br className="sm:hidden" /> <span className="text-[#22E06B]">DÊ GREEN.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-[#9D8FC7] sm:text-lg"
          >
            A bet onde a casa é o seu esforço. Monte o cupom, veja a{" "}
            <strong className="font-semibold text-[#EDE9FE]">cotação</strong> e o{" "}
            <strong className="font-semibold text-[#22E06B]">retorno</strong> subindo ao vivo num
            placar 8-bit. A única aposta em que você{" "}
            <span className="text-[#22E06B]">torce para você ganhar.</span>
          </motion.p>

          {/* hero HUD strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <div
              className="flex items-center gap-2 bg-[#1C1140] px-4 py-3"
              style={{ boxShadow: "0 0 0 3px #FFD60A" }}
            >
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <PixelCoin size={22} />
              </motion.span>
              <HudLabel className="text-xs text-[#FFD60A]">BANCA 340,00</HudLabel>
            </div>
            <div
              className="flex items-center gap-2 bg-[#1C1140] px-4 py-3"
              style={{ boxShadow: "0 0 0 3px #22E06B" }}
            >
              <PixelShield size={22} />
              <HudLabel className="text-xs text-[#22E06B]">STREAK 18</HudLabel>
            </div>
            <div
              className="flex items-center gap-1.5 bg-[#1C1140] px-4 py-3"
              style={{ boxShadow: "0 0 0 3px #6D28D9" }}
            >
              {[true, true, true, false].map((on, i) => (
                <PixelHeart key={i} size={18} empty={!on} />
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* ╔══════════════ SEÇÃO 1 · FUNDAMENTOS ══════════════╗ */}
      <Section>
        <SectionHead n="01" tag="FUNDAMENTOS · STYLE GUIDE" title="A LINGUAGEM">
          A base do sistema: paleta de fliperama, três vozes tipográficas e os componentes em
          repouso. Pixel é tempero de conquista sobre uma estrutura adulta e legível — uma bet
          premium, nunca um cassino que pisca.
        </SectionHead>

        {/* paleta · clicar = COIN GRAB (copia o hex) */}
        <CardLabel title="PALETA · 9 TOKENS · TOQUE PARA COPIAR">
          Roxo estrutura, verde só celebra (GREEN), amarelo é a moeda/stake, vermelho marca risco
          sem humilhar quem deu red. Toque num swatch para copiar o hex.
        </CardLabel>
        <PaletteGrid tokens={PALETTE} />

        {/* tipografia · controle ao vivo */}
        <div className="mt-10">
          <CardLabel title="TIPOGRAFIA · 3 VOZES · AO VIVO">
            Pixel só em títulos curtos e labels de HUD. Todo número de R$/cotação fica na fonte
            legível — nunca em pixel. Troque a voz, edite o texto e ajuste o tamanho.
          </CardLabel>
          <TypeLab />
        </div>

        {/* componentes interativos */}
        <div className="mt-10">
          <CardLabel title="COMPONENTES · TUDO RESPONDE AO TOQUE">
            Bordas pixeladas em degraus (box-shadow empilhado, sem radius), botões com sombra dura
            que afunda no clique, chips de cotação selecionáveis, stepper de stake e ícones 8-bit.
          </CardLabel>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ButtonShowcase />
            <ChipsAndBadges />
            <StakeStepper />
          </div>
        </div>
      </Section>

      <Divider />

      {/* ╔══════════════ SEÇÃO 2 · PLAYGROUND ══════════════╗ */}
      <Section>
        <SectionHead
          n="02"
          tag="PLAYGROUND DOPAMINÉRGICO"
          title={
            <>
              MONTE O CUPOM.
              <br />
              <span className="text-[#22E06B]">VEJA SUBIR.</span>
            </>
          }
        >
          Tudo aqui é interativo de verdade — clique, ajuste, comemore e repita. Cinco mecânicas de
          aposta: o cupom com cotação e retorno ao vivo, a acumuladora que acende pernas, o cash out
          pulsando, o check-in que dá green e o drop de aposta grátis.
        </SectionHead>

        <div className="grid gap-12 lg:grid-cols-2">
          <Widget title="01 · CUPOM · INSERT COIN">
            <BetSlip />
          </Widget>
          <Widget title="02 · ACUMULADORA · MÚLTIPLA">
            <Accumulator />
          </Widget>
          <Widget title="03 · CASH OUT · AO VIVO">
            <CashOut />
          </Widget>
          <Widget title="04 · CHECK-IN · DEU GREEN">
            <CheckInGreen />
          </Widget>
          <Widget title="05 · FREE BET · DROP" className="lg:col-span-2">
            <div className="lg:mx-auto lg:max-w-md">
              <FreeBetDrop />
            </div>
          </Widget>
        </div>
      </Section>

      <Divider />

      {/* ╔══════════════ SEÇÃO 3 · TELAS ══════════════╗ */}
      <Section>
        <SectionHead n="03" tag="EXEMPLOS DE TELA · O APP REAL" title="A CHARYA NO CELULAR">
          O sistema vestindo o app real: home arcade com banca e score, cupom com placar de cotação,
          a tela de payout “deu green” e o leaderboard de high scores. Mobile-first do primeiro
          pixel.
        </SectionHead>
        <PhoneScreens />
      </Section>

      <Divider />

      {/* ╔══════════════ HIGH SCORES (componente full) ══════════════╗ */}
      <Section>
        <SectionHead n="+" tag="QUEM DEU GREEN HOJE" title="HIGH SCORES">
          O leaderboard de quem cumpriu a aposta hoje — pessoas reais em molduras pixel. Celebra o
          topo e a sua linha; sem mural de últimos lugares.
        </SectionHead>
        <GreenLeaderboard />
      </Section>

      <Divider />

      <footer className="mx-auto max-w-5xl px-4 pb-20 pt-2 sm:px-8">
        <div className="border-t border-[#2E1065] pt-6">
          <HudLabel className="text-[10px] text-[#9D8FC7]">
            CHARYA · NEO-ARCADE · INSERT COIN TO CONTINUE
          </HudLabel>
          <p className="mt-2 text-xs text-[#9D8FC7]">
            A única aposta em que você torce para você ganhar. Press Start 2P · Silkscreen · Space
            Grotesk.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ── helpers ───────────────────────────────────────────────────────────────── */

function Divider() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-8">
      <div className="flex gap-1.5">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="h-1.5 flex-1"
            style={{ background: i % 2 === 0 ? "#2E1065" : "transparent" }}
          />
        ))}
      </div>
    </div>
  );
}

function Widget({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-2">
        <span
          className="inline-flex min-h-6 items-center bg-[#6D28D9] px-2 py-1 font-[family-name:var(--font-hud)] text-[10px] uppercase leading-none tracking-[0.16em] text-[#EDE9FE]"
          style={{ boxShadow: "2px 2px 0 0 #2E1065" }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
