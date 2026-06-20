"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Zap, CheckCircle2, RotateCcw } from "lucide-react";
import { ISO, SPRING, brl, odd } from "./tokens";
import { useCountUp } from "./use-count-up";
import { Confetti } from "./confetti";

type Goal = {
  id: string;
  emoji: string;
  title: string;
  detail: string;
  /** cotação base da meta (mais difícil = cotação maior) */
  baseOdd: number;
};

const GOALS: Goal[] = [
  {
    id: "peso",
    emoji: "🔥",
    title: "Perder 8 kg em 4 meses",
    detail: "3 treinos/semana + dieta",
    baseOdd: 2.4,
  },
  {
    id: "corrida",
    emoji: "🏃",
    title: "Correr 100 km no mês",
    detail: "check-in a cada corrida",
    baseOdd: 1.85,
  },
  {
    id: "forca",
    emoji: "🏋️",
    title: "Treinar 5x/semana por 8 semanas",
    detail: "musculação registrada",
    baseOdd: 3.1,
  },
];

const STAKES = [20, 50, 100, 200, 350, 500];
const STEP = 10;
const MIN = 20;
const MAX = 500;

/**
 * WidgetBetSlip — o CUPOM de aposta da Charya (coração da seção 2).
 * Escolhe a meta, ajusta o STAKE (stepper toque-amigável), vê a COTAÇÃO e o
 * RETORNO POTENCIAL subindo em count-up ao vivo. "FAZER APOSTA" dá slam +
 * confete + "Aposta feita!". Reset pra brincar de novo.
 */
export function WidgetBetSlip() {
  const [goalId, setGoalId] = useState(GOALS[0].id);
  const [stake, setStake] = useState(100);
  const [placed, setPlaced] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [runKey, setRunKey] = useState(0);

  const goal = GOALS.find((g) => g.id === goalId) ?? GOALS[0];
  // cotação cresce levemente com stake maior (mais "pele em jogo")
  const liveOdd = goal.baseOdd + Math.min(0.6, (stake - MIN) / 1000);
  const payout = Math.round(stake * liveOdd);

  const shownPayout = useCountUp(payout, 520, runKey + stake + goalId.length);
  const shownOddRaw = useCountUp(Math.round(liveOdd * 100), 420, runKey + stake);
  const shownOdd = (shownOddRaw / 100).toFixed(2);

  function bump(dir: 1 | -1) {
    if (placed) return;
    setStake((s) => Math.max(MIN, Math.min(MAX, s + dir * STEP)));
    setRunKey((k) => k + 1);
  }
  function pickStake(v: number) {
    if (placed) return;
    setStake(v);
    setRunKey((k) => k + 1);
  }
  function pickGoal(id: string) {
    if (placed) return;
    setGoalId(id);
    setRunKey((k) => k + 1);
  }
  function placeBet() {
    if (placed) return;
    setPlaced(true);
    setConfettiKey((k) => k + 1);
  }
  function reset() {
    setPlaced(false);
    setRunKey((k) => k + 1);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[24px]"
      style={{
        background: "#FFFFFF",
        border: `3px solid ${ISO.ink}`,
        boxShadow: `8px 9px 0 ${ISO.purpleDeep}`,
      }}
    >
      {confettiKey > 0 && placed && <Confetti key={confettiKey} count={40} />}

      {/* cabeçalho do cupom — recortado tipo ticket */}
      <div className="flex items-center justify-between px-5 py-3" style={{ background: ISO.ink }}>
        <span className="flex items-center gap-2 font-[family-name:var(--font-display)] text-base font-bold text-white">
          <Zap size={16} color={ISO.yellow} fill={ISO.yellow} /> Cupom WellBet
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: ISO.green, color: ISO.ink }}
        >
          Simples
        </span>
      </div>

      <div className="p-5">
        {/* escolha da meta */}
        <p
          className="mb-2 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: ISO.inkSoft }}
        >
          No que você aposta em você
        </p>
        <div className="flex flex-col gap-2">
          {GOALS.map((g) => {
            const active = g.id === goalId;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => pickGoal(g.id)}
                disabled={placed}
                className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors disabled:opacity-60"
                style={{
                  minHeight: 52,
                  background: active ? ISO.base : "#FFFFFF",
                  border: `2.5px solid ${active ? ISO.purple : ISO.baseDeep}`,
                  boxShadow: active ? `3px 4px 0 ${ISO.purple}` : "none",
                }}
              >
                <span className="text-xl" aria-hidden>
                  {g.emoji}
                </span>
                <span className="flex-1">
                  <span
                    className="block text-sm font-bold leading-tight"
                    style={{ color: ISO.ink }}
                  >
                    {g.title}
                  </span>
                  <span className="block text-xs" style={{ color: ISO.inkSoft }}>
                    {g.detail}
                  </span>
                </span>
                <span
                  className="shrink-0 rounded-lg px-2 py-1 font-[family-name:var(--font-display)] text-sm font-bold tabular-nums"
                  style={{
                    background: active ? ISO.purple : ISO.base,
                    color: active ? "#FFFFFF" : ISO.inkSoft,
                    border: `2px solid ${ISO.ink}`,
                  }}
                >
                  {odd(g.baseOdd)}
                </span>
              </button>
            );
          })}
        </div>

        {/* stake */}
        <p
          className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: ISO.inkSoft }}
        >
          Sua banca (stake)
        </p>
        <div className="flex items-center gap-3">
          <StepBtn onClick={() => bump(-1)} disabled={placed || stake <= MIN}>
            <Minus size={22} strokeWidth={3} />
          </StepBtn>
          <div
            className="flex flex-1 flex-col items-center justify-center rounded-2xl py-2"
            style={{ background: ISO.base, border: `2.5px solid ${ISO.ink}` }}
          >
            <motion.span
              key={stake}
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              transition={SPRING}
              className="font-[family-name:var(--font-display)] text-3xl font-bold leading-none tabular-nums"
              style={{ color: ISO.ink }}
            >
              {brl(stake, false)}
            </motion.span>
          </div>
          <StepBtn onClick={() => bump(1)} disabled={placed || stake >= MAX}>
            <Plus size={22} strokeWidth={3} />
          </StepBtn>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {STAKES.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => pickStake(v)}
              disabled={placed}
              className="rounded-full px-3.5 py-2 text-sm font-bold tabular-nums transition-colors disabled:opacity-60"
              style={{
                minHeight: 40,
                background: stake === v ? ISO.purple : "#FFFFFF",
                color: stake === v ? "#FFFFFF" : ISO.inkSoft,
                border: `2px solid ${stake === v ? ISO.purple : ISO.baseDeep}`,
              }}
            >
              {brl(v, false)}
            </button>
          ))}
        </div>

        {/* cotação + retorno ao vivo */}
        <div
          className="mt-5 grid grid-cols-2 gap-3 rounded-2xl p-4"
          style={{
            background: ISO.base,
            border: `2.5px solid ${ISO.baseDeep}`,
          }}
        >
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: ISO.inkSoft }}
            >
              Cotação ao vivo
            </p>
            <p
              className="font-[family-name:var(--font-display)] text-2xl font-bold leading-none tabular-nums"
              style={{ color: ISO.purple }}
            >
              {shownOdd}x
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: ISO.inkSoft }}
            >
              Retorno se der green
            </p>
            <p
              className="font-[family-name:var(--font-display)] text-2xl font-bold leading-none tabular-nums"
              style={{ color: ISO.greenDeep }}
            >
              {brl(shownPayout, false)}
            </p>
          </div>
        </div>

        {/* ação */}
        <div className="mt-5">
          <AnimatePresence mode="wait">
            {!placed ? (
              <motion.button
                key="place"
                type="button"
                onClick={placeBet}
                whileTap={{ scale: 0.96, y: 3 }}
                transition={SPRING}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-wide"
                style={{
                  minHeight: 56,
                  background: ISO.green,
                  color: ISO.ink,
                  border: `3px solid ${ISO.ink}`,
                  boxShadow: `0 6px 0 ${ISO.greenDeep}`,
                }}
              >
                <Zap size={20} fill={ISO.ink} /> Fazer aposta
              </motion.button>
            ) : (
              <motion.div
                key="placed"
                initial={{ scale: 0.6, opacity: 0, y: -10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 360, damping: 13 }}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: ISO.green,
                  border: `3px solid ${ISO.ink}`,
                }}
              >
                <p
                  className="flex items-center justify-center gap-2 font-[family-name:var(--font-display)] text-2xl font-bold"
                  style={{ color: ISO.ink }}
                >
                  <CheckCircle2 size={24} strokeWidth={2.6} /> Aposta feita!
                </p>
                <p className="mt-1 text-sm font-semibold" style={{ color: ISO.ink }}>
                  {brl(stake, false)} em você · pode pagar{" "}
                  <span className="tabular-nums">{brl(payout, false)}</span>
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold"
                  style={{
                    color: ISO.ink,
                    border: `2px solid ${ISO.ink}`,
                    minHeight: 36,
                  }}
                >
                  <RotateCcw size={13} /> Montar outro cupom
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StepBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={disabled ? undefined : { scale: 0.9, y: 2 }}
      transition={SPRING}
      className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl disabled:opacity-40"
      style={{
        background: ISO.purple,
        color: "#FFFFFF",
        border: `2.5px solid ${ISO.ink}`,
        boxShadow: `0 4px 0 ${ISO.purpleDeep}`,
      }}
    >
      {children}
    </motion.button>
  );
}
