"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { FOIL, HOLO, brl, odd } from "./tokens";
import { useFoil, FoilSheen, GlassLabel, IridBurst, ScanSweep, IridText } from "./primitives";
import { useCountUp } from "./use-count-up";

/**
 * ★ ASSINATURA DOPAMINÉRGICA ★
 * O CUPOM é um PASSE HOLOGRÁFICO. Arrastar/inclinar o cartão move o FOIL
 * iridescente (desliza com o ponteiro) + parallax de profundidade — brilho
 * tátil viciante. Escolha a meta + stake → cotação e retorno em COUNT-UP ao
 * vivo. "FAZER APOSTA" = o passe se VALIDA com varredura de shimmer + flash;
 * depois "DEU GREEN" resolve em verde iridescente + burst.
 *
 * Runtime-safe: pointer só em handlers; partículas com offset por index;
 * tweens para loops; spring só em 2 valores.
 */

type Goal = {
  id: string;
  emoji: string;
  label: string;
  prazo: string;
  baseOdd: number;
};

const GOALS: Goal[] = [
  {
    id: "peso",
    emoji: "🔥",
    label: "Perder 8 kg em 4 meses",
    prazo: "13/10/2026",
    baseOdd: 2.4,
  },
  {
    id: "corrida",
    emoji: "🏃",
    label: "Correr 5 km em 30 min",
    prazo: "01/09/2026",
    baseOdd: 1.85,
  },
  {
    id: "treino",
    emoji: "🏋️",
    label: "Treinar 5x/semana · 90 dias",
    prazo: "11/09/2026",
    baseOdd: 3.1,
  },
];

const STEPS = [25, 50, 100];
const MIN = 20;
const MAX = 500;

type Phase = "build" | "validated" | "green";

export function HoloPass() {
  const [goalId, setGoalId] = useState(GOALS[0].id);
  const [stake, setStake] = useState(100);
  const [phase, setPhase] = useState<Phase>("build");
  const [scan, setScan] = useState(0);
  const [burst, setBurst] = useState(0);

  const goal = useMemo(() => GOALS.find((g) => g.id === goalId)!, [goalId]);

  // a cotação fecha um tico conforme você bota mais skin in the game
  const liveOdd = useMemo(() => {
    const nudge = Math.min(0.4, ((stake - MIN) / (MAX - MIN)) * 0.5);
    return Math.max(1.2, goal.baseOdd - nudge);
  }, [goal, stake]);

  const payout = stake * liveOdd;
  const animOdd = useCountUp(liveOdd, 480);
  const animPayout = useCountUp(payout, 560);

  const foil = useFoil(14);

  function validate() {
    setPhase("validated");
    setScan((s) => s + 1);
  }
  function settleGreen() {
    setPhase("green");
    setScan((s) => s + 1);
    setBurst((b) => b + 1);
  }
  function reset() {
    setPhase("build");
    setBurst(0);
  }

  const locked = phase !== "build";
  const isGreen = phase === "green";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* ── O PASSE (cartão 3D foil) ── */}
      <motion.div
        {...foil.bind}
        style={{
          rotateX: foil.rotX,
          rotateY: foil.rotY,
          transformPerspective: 900,
          transformStyle: "preserve-3d",
        }}
        whileTap={{ scale: 0.99 }}
        className="relative w-full max-w-[360px] cursor-grab touch-none select-none overflow-hidden rounded-[26px] border border-white/12 active:cursor-grabbing"
        // a cor de fundo migra para verde no green
        animate={{
          boxShadow: isGreen
            ? "0 30px 70px -30px rgba(52, 245, 160,0.7), inset 0 0 0 1px rgba(52, 245, 160,0.4)"
            : "0 30px 70px -34px rgba(168, 85, 247,0.7), inset 0 0 0 1px rgba(255,255,255,0.10)",
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* base de vidro */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(165deg, rgba(20,20,34,0.92), rgba(10,10,18,0.96))",
          }}
        />
        {/* foil reativo ao ponteiro/tilt */}
        <FoilSheen
          sx={foil.sx}
          sy={foil.sy}
          sActive={foil.sActive}
          intensity={isGreen ? 0.35 : 0.6}
        />
        {/* wash verde no green */}
        <AnimatePresence>
          {isGreen && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 100% at 50% 0%, rgba(52, 245, 160,0.28), transparent 60%)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </AnimatePresence>

        {/* varredura de validação / green */}
        <ScanSweep run={scan} tone={isGreen ? "green" : "cyan"} />
        <IridBurst burstKey={burst} count={22} />

        {/* conteúdo do passe (camada com leve parallax/depth) */}
        <div className="relative z-10 p-5 sm:p-6" style={{ transform: "translateZ(40px)" }}>
          {/* topo do passe */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="grid h-7 w-7 place-items-center rounded-lg text-[#0A0A12]"
                style={{ background: FOIL }}
              >
                <Sparkles className="h-4 w-4" />
              </span>
              <GlassLabel className="text-[#F2F2FA]/90">CHARYA · PASSE</GlassLabel>
            </div>
            <GlassLabel className="text-[#A6A6C8]">Banca R$ 340,00</GlassLabel>
          </div>

          {/* faixa holográfica + status */}
          <div className="mt-4 flex items-center justify-between">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={phase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{
                  color: isGreen ? HOLO.green : phase === "validated" ? HOLO.cyan : HOLO.inkSoft,
                }}
              >
                {phase === "build"
                  ? "monte seu passe"
                  : phase === "validated"
                    ? "passe validado ✓"
                    : "deu green ✓"}
              </motion.span>
            </AnimatePresence>
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[#5B5B7E]">
              #CHY-{goal.id.toUpperCase().slice(0, 3)}-26
            </span>
          </div>

          {/* meta selecionada (grande) */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{goal.emoji}</span>
              <IridText
                className="font-[family-name:var(--font-display)] text-xl font-extrabold leading-tight"
                animate={!isGreen}
              >
                {goal.label}
              </IridText>
            </div>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] text-[#A6A6C8]">
              prazo {goal.prazo}
            </p>
          </div>

          {/* números ao vivo */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <PassStat label="cotação" value={`${odd(animOdd)}x`} tone="cyan" />
            <PassStat label="stake" value={`R$ ${brl(stake)}`} tone="purple" />
            <PassStat label="se der green" value={`R$ ${brl(animPayout)}`} tone="green" />
          </div>
        </div>
      </motion.div>

      <p className="-mt-1 flex items-center gap-1.5 text-[11px] text-[#A6A6C8]">
        <Sparkles className="h-3 w-3 text-[#A855F7]" />
        arraste o passe — o foil desliza com o seu dedo
      </p>

      {/* ── CONTROLES (fora do cartão 3D para clique confiável) ── */}
      <div className="w-full max-w-[360px] space-y-3">
        {/* meta */}
        <div className="grid gap-2">
          {GOALS.map((g) => {
            const active = g.id === goalId;
            return (
              <motion.button
                key={g.id}
                type="button"
                onClick={() => !locked && setGoalId(g.id)}
                disabled={locked}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-between gap-3 rounded-2xl border px-3.5 py-3 text-left backdrop-blur-md transition-colors disabled:opacity-50"
                style={{
                  borderColor: active ? "rgba(168, 85, 247,0.5)" : "rgba(255,255,255,0.10)",
                  background: active ? "rgba(168, 85, 247,0.10)" : "rgba(255,255,255,0.03)",
                }}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-lg">{g.emoji}</span>
                  <span className="text-sm font-medium leading-tight text-[#F2F2FA]">
                    {g.label}
                  </span>
                </span>
                <span
                  className="shrink-0 rounded-lg px-2 py-1 font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums"
                  style={{
                    color: active ? "#0A0A12" : HOLO.cyan,
                    background: active ? HOLO.cyan : "rgba(34,211,238,0.10)",
                  }}
                >
                  {odd(g.baseOdd)}x
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* stake */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-md">
          <div className="flex items-end justify-between">
            <GlassLabel className="text-[#A6A6C8]">você aposta</GlassLabel>
            <span className="font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums text-[#F2F2FA]">
              R$ {brl(stake)}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {STEPS.map((s) => (
              <motion.button
                key={s}
                type="button"
                onClick={() => !locked && setStake((v) => Math.min(MAX, v + s))}
                disabled={locked}
                whileTap={{ scale: 0.94 }}
                className="min-h-[44px] flex-1 rounded-xl px-3 font-[family-name:var(--font-mono)] text-sm font-bold text-[#0A0A12] disabled:opacity-50"
                style={{ background: FOIL }}
              >
                +R${s}
              </motion.button>
            ))}
            <motion.button
              type="button"
              onClick={() => !locked && setStake(MIN)}
              disabled={locked}
              whileTap={{ scale: 0.94 }}
              className="min-h-[44px] rounded-xl border border-white/10 bg-white/[0.03] px-4 text-xs uppercase tracking-widest text-[#A6A6C8] disabled:opacity-50"
            >
              zerar
            </motion.button>
          </div>
        </div>

        {/* CTA */}
        <div className="relative min-h-[56px]">
          <AnimatePresence mode="wait">
            {phase === "build" && (
              <motion.button
                key="cta"
                type="button"
                onClick={validate}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                whileTap={{ scale: 0.97 }}
                className="relative block min-h-[56px] w-full overflow-hidden rounded-2xl px-5 font-[family-name:var(--font-display)] text-base font-extrabold text-[#0A0A12]"
                style={{
                  background: FOIL,
                  backgroundSize: "180% 180%",
                  boxShadow: "0 16px 40px -14px rgba(168, 85, 247,0.7)",
                }}
              >
                <span className="relative z-10 inline-flex items-center justify-center gap-2">
                  FAZER APOSTA <ChevronRight className="h-5 w-5" />
                </span>
              </motion.button>
            )}

            {phase === "validated" && (
              <motion.div
                key="validated"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                <div className="rounded-2xl border border-[#22D3EE]/30 bg-[#22D3EE]/[0.07] px-4 py-3 text-center">
                  <p className="text-sm font-semibold text-[#22D3EE]">
                    Passe validado · aposta ativa
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#A6A6C8]">
                    cumpra a meta para resolver o passe em verde
                  </p>
                </div>
                <motion.button
                  type="button"
                  onClick={settleGreen}
                  whileTap={{ scale: 0.97 }}
                  className="min-h-[52px] w-full rounded-2xl px-5 text-base font-extrabold text-[#06140C]"
                  style={{
                    background: HOLO.green,
                    boxShadow: "0 16px 40px -14px rgba(52, 245, 160,0.7)",
                  }}
                >
                  Cumpri a meta → DEU GREEN
                </motion.button>
              </motion.div>
            )}

            {phase === "green" && (
              <motion.div
                key="green"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 480, damping: 20 }}
                className="rounded-2xl border border-[#34F5A0]/40 bg-[#34F5A0]/[0.08] px-4 py-4 text-center"
              >
                <motion.p
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.18, repeat: 2 }}
                  className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[#34F5A0]"
                >
                  DEU GREEN!
                </motion.p>
                <p className="mt-1.5 text-sm text-[#F2F2FA]">
                  Você recebeu{" "}
                  <strong className="font-[family-name:var(--font-mono)] text-[#34F5A0]">
                    R$ {brl(payout)}
                  </strong>{" "}
                  por cumprir <strong>{goal.label}</strong>.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-xs uppercase tracking-widest text-[#A6A6C8] underline-offset-4 transition-colors hover:text-[#F2F2FA]"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> apostar de novo
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PassStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "purple" | "green";
}) {
  const color = tone === "green" ? HOLO.green : tone === "cyan" ? HOLO.cyan : HOLO.purple;
  return (
    <div
      className="rounded-xl border border-white/10 bg-black/30 px-2.5 py-2 backdrop-blur-sm"
      style={{ boxShadow: `inset 0 0 0 1px ${color}22` }}
    >
      <GlassLabel className="block text-[9px]" style={{ color }}>
        {label}
      </GlassLabel>
      <span className="mt-0.5 block font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums text-[#F2F2FA]">
        {value}
      </span>
    </div>
  );
}
