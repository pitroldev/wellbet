"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Sparkles, Check, ChevronRight } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { useProduct } from "./product-context";
import { E, GLASS, GLASS_STRONG, GLASS_LINE, SPRING, brl, odd } from "./tokens";

type Goal = { label: string; sub: string; odd: number };

const GOALS: Record<"well" | "gym", Goal[]> = {
  well: [
    { label: "Perder 2kg", sub: "em 7 dias", odd: 1.85 },
    { label: "Perder 4kg", sub: "em 14 dias", odd: 2.45 },
    { label: "Sem açúcar", sub: "a semana toda", odd: 1.6 },
  ],
  gym: [
    { label: "Treinar 4×", sub: "esta semana", odd: 1.7 },
    { label: "Treinar 6×", sub: "esta semana", odd: 2.6 },
    { label: "Streak 30 dias", sub: "sem furar", odd: 3.2 },
  ],
};

export function BetSlip({ onWin }: { onWin?: () => void }) {
  const { product, theme } = useProduct();
  const [gi, setGi] = useState(1);
  const [stake, setStake] = useState(80);
  const [placed, setPlaced] = useState(false);
  const [run, setRun] = useState(0);

  const goals = GOALS[product];
  const safeGi = Math.min(gi, goals.length - 1);
  const o = goals[safeGi].odd;
  const payout = stake * o;
  const animatedPayout = useCountUp(payout, 500, run + safeGi + stake + (product === "well" ? 0 : 1000));

  function place() {
    setPlaced(true);
    setRun((r) => r + 1);
    onWin?.();
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 sm:p-6"
      style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}
    >
      {placed && <Confetti key={run} colors={[theme.accent, E.green, E.pink]} />}

      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold text-white">Cupom · meta de {theme.metric}</span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: E.peri, opacity: 0.7 }}>
          {product === "well" ? "#WB-2026" : "#GB-2026"}
        </span>
      </div>

      {/* metas (cotações) — trocam com o produto */}
      <div className="mt-4 space-y-2">
        {goals.map((g, i) => {
          const active = i === safeGi;
          return (
            <button
              key={`${product}-${g.label}`}
              type="button"
              onClick={() => {
                setGi(i);
                setPlaced(false);
              }}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors"
              style={{
                background: active ? GLASS_STRONG : "rgba(8,4,40,.35)",
                boxShadow: active ? `inset 0 0 0 2px ${theme.accent}` : "inset 0 0 0 1px " + GLASS_LINE,
              }}
            >
              <span>
                <span className="block text-sm font-bold text-white">{g.label}</span>
                <span className="text-xs" style={{ color: E.peri, opacity: 0.7 }}>
                  {g.sub}
                </span>
              </span>
              <span
                className="font-[family-name:var(--font-mono)] text-base font-semibold tabular-nums"
                style={{ color: active ? theme.accentSoft : "rgba(204,209,255,.7)" }}
              >
                {odd(g.odd)}
              </span>
            </button>
          );
        })}
      </div>

      {/* stake */}
      <div className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: "rgba(8,4,40,.4)" }}>
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: E.peri, opacity: 0.7 }}>
          Stake
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setStake((s) => Math.max(10, s - 10));
              setPlaced(false);
            }}
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: GLASS_STRONG, color: "#fff" }}
          >
            <Minus size={16} />
          </button>
          <span className="min-w-[92px] text-center font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums text-white">
            {brl(stake)}
          </span>
          <button
            type="button"
            onClick={() => {
              setStake((s) => Math.min(500, s + 10));
              setPlaced(false);
            }}
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: theme.accent, color: "#fff" }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* payout */}
      <div className="mt-4 flex items-end justify-between">
        <span className="text-sm font-semibold" style={{ color: E.peri }}>
          Retorno possível
        </span>
        <motion.span
          key={Math.round(animatedPayout)}
          className="font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
          style={{ color: E.green }}
        >
          {brl(animatedPayout)}
        </motion.span>
      </div>

      <motion.button
        type="button"
        onClick={place}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold"
        style={{ background: placed ? E.green : theme.accent, color: placed ? E.greenInk : "#fff" }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {placed ? (
            <motion.span
              key="ok"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
              className="inline-flex items-center gap-2"
            >
              <Check size={18} strokeWidth={3} /> Aposta feita — agora é foco!
            </motion.span>
          ) : (
            <motion.span
              key="go"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              <Sparkles size={18} /> Apostar em mim <ChevronRight size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
