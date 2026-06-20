"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";
import { BackToHub } from "@/app/components/back-to-hub";
import { FOIL, HOLO } from "./_components/tokens";
import { GlassLabel, IridText, useFoil, FoilSheen } from "./_components/primitives";
import {
  PaletteGrid,
  TypeLab,
  ButtonShowcase,
  ChipsAndBadges,
  StakeStepper,
} from "./_components/foundations";
import { HoloPass } from "./_components/holo-pass";
import { Accumulator } from "./_components/accumulator";
import { CashOut } from "./_components/cash-out";
import { CheckInGreen } from "./_components/check-in-green";
import { FreeBet } from "./_components/free-bet";
import { Leaderboard } from "./_components/leaderboard";
import { PhonePrototype } from "./_components/phone-prototype";

/* ── tokens da paleta exibidos na Seção 1 ── */
const PALETTE = [
  { hex: "#0A0A12", name: "ink / fundo", note: "escuro neutro" },
  { hex: "#12121E", name: "vidro", note: "superfície fosca" },
  { hex: "#A855F7", name: "roxo", note: "iridescente" },
  { hex: "#22D3EE", name: "ciano", note: "iridescente" },
  { hex: "#34F5A0", name: "verde", note: "GREEN · só vitória" },
  { hex: "#F2F2FA", name: "texto", note: "leitura · AA" },
  { hex: "#A6A6C8", name: "muted", note: "apoio" },
  { hex: "#5B5B7E", name: "faint", note: "metadados" },
  { hex: "#FF5470", name: "red", note: "risco · sem humilhar" },
];

const sectionV = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A12] font-[family-name:var(--font-body)] text-[#F2F2FA]">
      <BackToHub className="border-[#A855F7]/40 bg-[#12121E]/70 text-[#F2F2FA] hover:bg-[#12121E]" />

      <style>{`
        .holo-range {
          background: linear-gradient(90deg,#A855F7,#22D3EE,#34F5A0);
        }
        .holo-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          height: 22px; width: 22px; border-radius: 9999px;
          background: #F2F2FA;
          border: 3px solid #0A0A12;
          box-shadow: 0 0 0 2px #22D3EE, 0 4px 12px -2px rgba(34,211,238,0.8);
          cursor: pointer;
        }
        .holo-range::-moz-range-thumb {
          height: 22px; width: 22px; border-radius: 9999px;
          background: #F2F2FA; border: 3px solid #0A0A12;
          box-shadow: 0 0 0 2px #22D3EE, 0 4px 12px -2px rgba(34,211,238,0.8);
          cursor: pointer;
        }
        @keyframes holoFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* fundo ambiente: flares de luz */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[460px] w-[460px] rounded-full bg-[#A855F7]/20 blur-[150px]" />
        <div className="absolute right-[-15%] top-[20%] h-[420px] w-[420px] rounded-full bg-[#22D3EE]/14 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[10%] h-[460px] w-[460px] rounded-full bg-[#34F5A0]/8 blur-[160px]" />
      </div>

      {/* ╔═══════════════════════ HERO ═══════════════════════╗ */}
      <Hero />

      {/* ╔══════════════ SEÇÃO 1 · FUNDAMENTOS ══════════════╗ */}
      <Section>
        <SectionHead n="01" tag="FUNDAMENTOS · STYLE GUIDE" title="A linguagem de luz">
          A base do sistema: paleta iridescente sobre vidro fosco, três vozes tipográficas e os
          componentes em repouso. Roxo e verde são a marca; o verde só celebra vitória de verdade.
          Premium-tech otimista, nunca cassino que pisca.
        </SectionHead>

        <CardLabel title="paleta · 9 tokens · toque para copiar">
          Iridescência desliza entre roxo, ciano e verde sobre o escuro neutro. Toque num swatch
          para copiar o hex.
        </CardLabel>
        <PaletteGrid tokens={PALETTE} />

        <div className="mt-10">
          <CardLabel title="tipografia · 3 vozes · ao vivo">
            Sora geométrica nos títulos, Space Grotesk no corpo e JetBrains Mono leve em todo número
            de R$/cotação. Troque a voz, edite o texto e ajuste tamanho e peso.
          </CardLabel>
          <TypeLab />
        </div>

        <div className="mt-10">
          <CardLabel title="componentes · tudo responde ao toque">
            Botões com foil, chips de cotação selecionáveis, badges que alternam e stepper de stake
            com retorno ao vivo.
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
              Monte o passe.{" "}
              <IridText className="font-[family-name:var(--font-display)]">Veja brilhar.</IridText>
            </>
          }
        >
          Tudo aqui é interativo de verdade. O cupom é um passe holográfico:{" "}
          <strong className="text-[#F2F2FA]">arraste-o e o foil desliza com o seu dedo</strong>; ao
          fazer a aposta ele se valida com varredura de shimmer e resolve em verde com burst.
          Acumuladora, cash out, check-in, free bet e ranking completam a mesa.
        </SectionHead>

        {/* assinatura em destaque */}
        <div className="mb-6 flex items-center gap-2">
          <span
            className="grid h-7 w-7 place-items-center rounded-lg text-[#0A0A12]"
            style={{ background: FOIL }}
          >
            <Sparkles className="h-4 w-4" />
          </span>
          <GlassLabel className="text-[#F2F2FA]">
            interação-assinatura · o passe holográfico
          </GlassLabel>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Widget title="01 · cupom · passe holográfico" highlight>
            <HoloPass />
          </Widget>
          <div className="flex flex-col gap-6">
            <Widget title="02 · acumuladora · streak">
              <Accumulator />
            </Widget>
            <Widget title="03 · cash out · ao vivo">
              <CashOut />
            </Widget>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Widget title="04 · check-in · deu green">
            <CheckInGreen />
          </Widget>
          <Widget title="05 · free bet · passe de luz">
            <FreeBet />
          </Widget>
        </div>

        <div className="mt-6">
          <Widget title="06 · ranking · quem deu green">
            <Leaderboard />
          </Widget>
        </div>
      </Section>

      <Divider />

      {/* ╔══════════════ SEÇÃO 3 · TELAS ══════════════╗ */}
      <Section>
        <SectionHead n="03" tag="EXEMPLOS DE TELA · O APP REAL" title="A CHARYA no celular">
          O sistema vestindo o app: home com banca em passe foil, cupom com o passe que desliza ao
          toque, validação com varredura e o payout “deu green” iridescente. Tab bar funcional,
          fluxo completo. Mobile-first do primeiro pixel.
        </SectionHead>
        <div className="mx-auto max-w-sm">
          <PhonePrototype />
        </div>
      </Section>

      <Divider />

      <footer className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-2 sm:px-8">
        <div className="border-t border-white/10 pt-6">
          <GlassLabel className="text-[#A6A6C8]">CHARYA · HOLOGRÁFICO · futuro luminoso</GlassLabel>
          <p className="mt-2 text-xs text-[#A6A6C8]">
            A única aposta em que você torce para você ganhar. Sora · Space Grotesk · JetBrains
            Mono.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* ── HERO ──────────────────────────────────────────────────────────────── */
function Hero() {
  const foil = useFoil(16);
  return (
    <header className="relative z-10 overflow-hidden px-4 pb-14 pt-24 sm:px-8 sm:pt-28">
      <div className="relative mx-auto max-w-5xl">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* texto */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 backdrop-blur-md"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: HOLO.green,
                  boxShadow: `0 0 10px ${HOLO.green}`,
                }}
              />
              <GlassLabel className="text-[#A6A6C8]">CHARYA · HOLOGRÁFICO</GlassLabel>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="font-[family-name:var(--font-display)] text-[clamp(2rem,8vw,4rem)] font-extrabold leading-[1.05] tracking-tight text-[#F2F2FA]"
            >
              Aposte em você.
              <br />
              <IridText className="font-[family-name:var(--font-display)]">Deu green.</IridText>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-[#A6A6C8] sm:text-lg"
            >
              O cupom é um <strong className="text-[#F2F2FA]">passe holográfico</strong> que brilha
              ao toque. Monte a meta, veja a <strong className="text-[#22D3EE]">cotação</strong> e o{" "}
              <strong className="text-[#34F5A0]">retorno</strong> subindo ao vivo. A única aposta em
              que você torce para você ganhar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {[
                { label: "Banca R$ 340,00", c: HOLO.purple },
                { label: "Streak 18", c: HOLO.cyan },
                { label: "12 greens este mês", c: HOLO.green },
              ].map((s) => (
                <span
                  key={s.label}
                  className="rounded-full border px-4 py-2 font-[family-name:var(--font-mono)] text-xs font-semibold backdrop-blur-md"
                  style={{
                    color: s.c,
                    borderColor: s.c + "44",
                    background: s.c + "12",
                  }}
                >
                  {s.label}
                </span>
              ))}
            </motion.div>
          </div>

          {/* mini-cupom de assinatura (passe foil reativo) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto w-full max-w-[320px]"
          >
            <motion.div
              {...foil.bind}
              style={{
                rotateX: foil.rotX,
                rotateY: foil.rotY,
                transformPerspective: 1000,
                transformStyle: "preserve-3d",
                animation: "holoFloat 6s ease-in-out infinite",
              }}
              className="relative touch-none overflow-hidden rounded-[28px] border border-white/14 p-6"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(165deg,rgba(20,20,34,0.92),rgba(10,10,18,0.96))",
                }}
              />
              <FoilSheen sx={foil.sx} sy={foil.sy} sActive={foil.sActive} intensity={0.7} />
              <div className="relative" style={{ transform: "translateZ(50px)" }}>
                <div className="flex items-center justify-between">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-lg text-[#0A0A12]"
                    style={{ background: FOIL }}
                  >
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <GlassLabel className="text-[#A6A6C8]">#CHY-PESO-26</GlassLabel>
                </div>
                <div className="mt-5">
                  <span className="text-3xl">🔥</span>
                  <IridText className="mt-1 block font-[family-name:var(--font-display)] text-2xl font-extrabold leading-tight">
                    Perder 8 kg em 4 meses
                  </IridText>
                  <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] text-[#A6A6C8]">
                    prazo 13/10/2026
                  </p>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {[
                    { l: "cotação", v: "2,40x", c: HOLO.cyan },
                    { l: "stake", v: "R$100", c: HOLO.purple },
                    { l: "green", v: "R$240", c: HOLO.green },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-xl border border-white/10 bg-black/30 px-2 py-1.5"
                    >
                      <GlassLabel className="block text-[9px]" style={{ color: s.c }}>
                        {s.l}
                      </GlassLabel>
                      <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[#F2F2FA]">
                        {s.v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#A6A6C8]">
              <Sparkles className="h-3 w-3 text-[#A855F7]" /> arraste o passe — o foil desliza
            </p>
          </motion.div>
        </div>
      </div>
    </header>
  );
}

/* ── chrome compartilhado ────────────────────────────────────────────────── */
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
          className="grid h-7 w-7 place-items-center rounded-lg font-[family-name:var(--font-mono)] text-xs font-bold text-[#0A0A12]"
          style={{ background: FOIL }}
        >
          {n}
        </span>
        <GlassLabel className="text-[#A6A6C8]">{tag}</GlassLabel>
      </div>
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold leading-tight text-[#F2F2FA] sm:text-4xl">
        {title}
      </h2>
      {children ? (
        <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-[#A6A6C8] sm:text-base">
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
      className={`relative z-10 mx-auto w-full max-w-5xl px-4 py-12 sm:px-8 sm:py-16 ${className ?? ""}`}
    >
      {children}
    </motion.section>
  );
}

function CardLabel({ children, title }: { children?: React.ReactNode; title: string }) {
  return (
    <div className="mb-3">
      <GlassLabel className="block text-[#22D3EE]">{title}</GlassLabel>
      {children ? <p className="mt-1 text-xs leading-relaxed text-[#A6A6C8]">{children}</p> : null}
    </div>
  );
}

function Widget({
  title,
  children,
  highlight,
}: {
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className="relative rounded-3xl border p-4 backdrop-blur-md sm:p-5"
      style={{
        borderColor: highlight ? "rgba(168, 85, 247,0.35)" : "rgba(255,255,255,0.08)",
        background: "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
        boxShadow: highlight ? "0 24px 60px -30px rgba(168, 85, 247,0.5)" : undefined,
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="inline-flex min-h-6 items-center rounded-md px-2 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.16em]"
          style={{
            color: highlight ? "#0A0A12" : HOLO.inkSoft,
            background: highlight ? FOIL : "rgba(255,255,255,0.06)",
          }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-8">
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(168, 85, 247,0.5), rgba(34,211,238,0.5), rgba(52, 245, 160,0.5), transparent)",
        }}
      />
    </div>
  );
}
