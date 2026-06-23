"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, Ticket, Target, Zap, RotateCcw, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { GLOW, HudLabel, mono, OddsChip, OddsTick, Panel } from "./primitives";

/* ──────────────────────────────────────────────────────────────────────────
   CUPOM DE APOSTA — o coração dopaminérgico.
   Escolhe a meta → ajusta o STAKE (slider + steppers, toque-amigável) →
   cotação e retorno potencial sobem em count-up AO VIVO → "FAZER APOSTA"
   com slam + confete + "Aposta feita!". Reset pra brincar de novo.
   ────────────────────────────────────────────────────────────────────────── */

type Goal = {
  id: string;
  titulo: string;
  prazo: string;
  /** cotação base — metas mais difíceis pagam mais */
  odd: number;
};

const GOALS: Goal[] = [
  { id: "peso", titulo: "Perder 8 kg", prazo: "4 meses", odd: 2.4 },
  { id: "corrida", titulo: "Correr 100 km", prazo: "30 dias", odd: 1.85 },
  { id: "academia", titulo: "Treinar 20x", prazo: "este mês", odd: 1.62 },
  { id: "sono", titulo: "Dormir 7h por 21 dias", prazo: "3 semanas", odd: 3.1 },
];

const STAKE_MIN = 25;
const STAKE_MAX = 1500;
const STAKE_STEP = 25;
const brl = (n: number) =>
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const CONFETTI = 26;

export function BetSlip() {
  const [goalId, setGoalId] = useState<string>("peso");
  const [stake, setStake] = useState(200);
  const [placed, setPlaced] = useState(false);

  const goal = useMemo(() => GOALS.find((g) => g.id === goalId)!, [goalId]);

  // Cotação reage levemente ao stake: stakes maiores = compromisso mais sério,
  // engine concede um micro-boost (até +0.18). Nunca "dinheiro fácil".
  const odd = useMemo(() => {
    const boost = ((stake - STAKE_MIN) / (STAKE_MAX - STAKE_MIN)) * 0.18;
    return Number((goal.odd + boost).toFixed(2));
  }, [goal, stake]);

  const payout = Math.round(stake * odd);
  const profit = payout - stake;
  const pct = (stake - STAKE_MIN) / (STAKE_MAX - STAKE_MIN);

  const step = (d: number) => setStake((s) => Math.min(STAKE_MAX, Math.max(STAKE_MIN, s + d)));

  return (
    <Panel
      glow={placed ? "green" : "purple"}
      className="relative overflow-hidden p-5 transition-shadow duration-500 sm:p-6"
    >
      {/* cabeçalho cupom */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#8B5CF6]/12">
            <Ticket className="h-5 w-5" color={GLOW.purple} />
          </div>
          <div>
            <HudLabel tone="purple">Cupom · WellBet</HudLabel>
            <h3 className="text-base font-semibold text-[#EDEAF7] sm:text-lg">Aposte em você</h3>
          </div>
        </div>
        <OddsChip tone="green" active>
          1 perna
        </OddsChip>
      </div>

      {/* escolher a meta */}
      <div className="mt-5">
        <HudLabel>Escolha o palpite (sua meta)</HudLabel>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {GOALS.map((g) => {
            const on = g.id === goalId;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  setGoalId(g.id);
                  setPlaced(false);
                }}
                aria-pressed={on}
                className={cn(
                  "flex min-h-[56px] items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/60",
                  on
                    ? "border-[#8B5CF6] bg-[#8B5CF6]/15 shadow-[0_0_18px_-6px_rgba(139,92,246,0.9)]"
                    : "border-[rgba(139,131,168,0.2)] bg-[#0E0B1A]/60 hover:border-[#8B5CF6]/50",
                )}
              >
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4 shrink-0" color={on ? GLOW.purple : GLOW.muted} />
                  <span>
                    <span className="block text-sm font-medium text-[#EDEAF7]">{g.titulo}</span>
                    <span className="block text-[11px] text-[#8B83A8]">{g.prazo}</span>
                  </span>
                </span>
                <OddsChip tone={on ? "green" : "muted"} active={on}>
                  {g.odd.toFixed(2)}×
                </OddsChip>
              </button>
            );
          })}
        </div>
      </div>

      {/* stake — slider + steppers */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <HudLabel>Sua banca (stake)</HudLabel>
          <span className={cn(mono(), "text-[11px] text-[#8B83A8]")}>
            R$ {STAKE_MIN}–{brl(STAKE_MAX)}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              step(-STAKE_STEP);
              setPlaced(false);
            }}
            disabled={stake <= STAKE_MIN}
            aria-label="Diminuir stake"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[rgba(139,131,168,0.24)] bg-[#0E0B1A]/60 text-[#EDEAF7] transition hover:border-[#8B5CF6]/60 hover:bg-[#8B5CF6]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/60 disabled:opacity-35"
          >
            <Minus className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-baseline justify-center rounded-xl border border-[rgba(139,131,168,0.16)] bg-[#0E0B1A]/60 py-2.5">
            <span className={cn(mono(), "text-sm text-[#8B83A8]")}>R$</span>
            <OddsTick
              value={stake}
              decimals={0}
              duration={0.35}
              className="ml-1 text-3xl font-bold text-[#EDEAF7]"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              step(STAKE_STEP);
              setPlaced(false);
            }}
            disabled={stake >= STAKE_MAX}
            aria-label="Aumentar stake"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[rgba(139,131,168,0.24)] bg-[#0E0B1A]/60 text-[#EDEAF7] transition hover:border-[#8B5CF6]/60 hover:bg-[#8B5CF6]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]/60 disabled:opacity-35"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* slider nativo, estilizado, toque-amigável */}
        <input
          type="range"
          min={STAKE_MIN}
          max={STAKE_MAX}
          step={STAKE_STEP}
          value={stake}
          onChange={(e) => {
            setStake(Number(e.target.value));
            setPlaced(false);
          }}
          aria-label="Ajustar stake"
          className="glow-range mt-3 h-11 w-full cursor-pointer appearance-none bg-transparent"
          style={{
            // preenchimento verde-glow do track
            background: `linear-gradient(90deg, ${GLOW.green} 0%, ${GLOW.purple} ${pct * 100}%, rgba(139,131,168,0.18) ${pct * 100}%)`,
            borderRadius: 999,
            height: 10,
            marginTop: 14,
          }}
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[100, 200, 500, 1000].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                setStake(v);
                setPlaced(false);
              }}
              className={cn(
                mono(),
                "rounded-md border px-2.5 py-1 text-[11px] transition",
                stake === v
                  ? "border-[#8B5CF6] bg-[#8B5CF6]/15 text-[#EDEAF7]"
                  : "border-[rgba(139,131,168,0.2)] bg-[#0E0B1A]/60 text-[#8B83A8] hover:text-[#EDEAF7]",
              )}
            >
              R$ {brl(v)}
            </button>
          ))}
        </div>
      </div>

      {/* cotação + retorno AO VIVO */}
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <div className="rounded-xl border border-[rgba(139,131,168,0.16)] bg-[#0E0B1A]/60 p-3">
          <HudLabel>Cotação</HudLabel>
          <OddsTick
            value={odd}
            decimals={2}
            suffix="×"
            className="mt-1 block text-xl font-bold text-[#8B5CF6]"
          />
          <span className="mt-0.5 block text-[10px] text-[#8B83A8]">odds ao vivo</span>
        </div>
        <div className="rounded-xl border border-[#34F5A0]/30 bg-[#34F5A0]/[0.07] p-3">
          <HudLabel tone="green">Retorno</HudLabel>
          <OddsTick
            value={payout}
            decimals={0}
            prefix="R$ "
            className="mt-1 block text-xl font-bold text-[#34F5A0]"
          />
          <span className="mt-0.5 block text-[10px] text-[#8B83A8]">se deu green</span>
        </div>
        <div className="rounded-xl border border-[rgba(139,131,168,0.16)] bg-[#0E0B1A]/60 p-3">
          <HudLabel>Lucro</HudLabel>
          <OddsTick
            value={profit}
            decimals={0}
            prefix="+R$ "
            className="mt-1 block text-xl font-bold text-[#34F5A0]"
          />
          <span className="mt-0.5 block text-[10px] text-[#8B83A8]">esforço pago</span>
        </div>
      </div>

      {/* CTA — FAZER APOSTA com slam + confete */}
      <div className="relative mt-5">
        <motion.button
          type="button"
          onClick={() => setPlaced(true)}
          disabled={placed}
          whileTap={placed ? undefined : { scale: 0.96 }}
          className={cn(
            mono(),
            "relative flex min-h-[52px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-5 text-sm font-bold uppercase tracking-[0.14em] transition",
            placed
              ? "bg-[#34F5A0] text-[#0E0B1A]"
              : "bg-[#8B5CF6] text-white shadow-[0_0_28px_-6px_rgba(139,92,246,0.9)]",
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {placed ? (
              <motion.span
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2"
              >
                <Check className="h-5 w-5" strokeWidth={3} />
                Aposta feita! Boa sorte (pra você)
              </motion.span>
            ) : (
              <motion.span
                key="cta"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2"
              >
                <Zap className="h-5 w-5" />
                Fazer aposta · R$ {brl(stake)}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* confete A MÃO ao confirmar */}
        <AnimatePresence>
          {placed && (
            <div className="pointer-events-none absolute inset-x-0 top-1/2 grid place-items-center">
              {Array.from({ length: CONFETTI }).map((_, i) => {
                const angle = (i / CONFETTI) * Math.PI * 2;
                const dist = 70 + ((i * 29) % 60);
                const c = i % 3 === 0 ? GLOW.green : i % 3 === 1 ? GLOW.purple : "#EDEAF7";
                return (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="absolute rounded-[1px]"
                    style={{ width: 6, height: 10, background: c }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
                    animate={{
                      x: Math.cos(angle) * dist,
                      y: Math.sin(angle) * dist - 10,
                      opacity: 0,
                      scale: 0.3,
                      rotate: (i % 2 ? 1 : -1) * 220,
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                      delay: (i % 5) * 0.015,
                    }}
                  />
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {placed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex items-center justify-between rounded-xl border border-[#34F5A0]/25 bg-[#34F5A0]/[0.06] px-3 py-2.5">
              <p className="text-[12px] leading-snug text-[#8B83A8]">
                Cupom <span className={cn(mono(), "text-[#EDEAF7]")}>#CHY-8842</span> confirmado ·{" "}
                {goal.titulo} · {odd.toFixed(2)}×
              </p>
              <button
                type="button"
                onClick={() => setPlaced(false)}
                className="flex items-center gap-1.5 text-[12px] text-[#8B83A8] transition hover:text-[#EDEAF7]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                refazer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-4 text-[11px] leading-relaxed text-[#8B83A8]">
        O <span className="text-[#EDEAF7]">Engine CHARYA™</span> calcula a cotação pela dificuldade
        da meta e seu histórico. Aqui não se promete dinheiro fácil —{" "}
        <span className="text-[#34F5A0]">o green é a sua transformação cumprida.</span>
      </p>

      {/* estilo do slider (escopado por classe) */}
      <style>{`
        .glow-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: ${GLOW.green};
          border: 3px solid #0E0B1A;
          box-shadow: 0 0 14px ${GLOW.green}, 0 0 0 1px ${GLOW.green};
          cursor: pointer;
          margin-top: -8px;
        }
        .glow-range::-moz-range-thumb {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: ${GLOW.green};
          border: 3px solid #0E0B1A;
          box-shadow: 0 0 14px ${GLOW.green};
          cursor: pointer;
        }
        .glow-range:focus-visible {
          outline: 2px solid ${GLOW.purple};
          outline-offset: 4px;
        }
      `}</style>
    </Panel>
  );
}
