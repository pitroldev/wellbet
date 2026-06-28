"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Zap, Check, ChevronRight } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { W, SPRING, brl, odd } from "./tokens";

type Goal = { label: string; sub: string; odd: number };
const GOALS: Goal[] = [
  { label: "Perder 2kg", sub: "em 7 dias", odd: 1.85 },
  { label: "Perder 4kg", sub: "em 14 dias", odd: 2.45 },
  { label: "Treinar 5×", sub: "esta semana", odd: 1.6 },
];

export function BetSlip() {
  const [gi, setGi] = useState(1);
  const [stake, setStake] = useState(50);
  const [placed, setPlaced] = useState(false);
  const [run, setRun] = useState(0);

  const o = GOALS[gi].odd;
  const payout = stake * o;
  const animatedPayout = useCountUp(payout, 500, run + gi + stake);

  function place() {
    setPlaced(true);
    setRun((r) => r + 1);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 sm:p-6"
      style={{ background: W.surface, boxShadow: "inset 0 0 0 1px " + W.line }}
    >
      {placed && <Confetti key={run} colors={[W.blue, W.green, W.pink]} />}

      {/* header do cupom */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold" style={{ color: W.ink }}>
          Cupom · aposte em você
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: W.inkMute }}>
          #WB-2026
        </span>
      </div>

      {/* metas (cotações) */}
      <div className="mt-4 space-y-2">
        {GOALS.map((g, i) => {
          const active = i === gi;
          return (
            <button
              key={g.label}
              type="button"
              onClick={() => {
                setGi(i);
                setPlaced(false);
              }}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors"
              style={{
                background: active ? W.blueWash : W.surfaceMute,
                boxShadow: active ? `inset 0 0 0 2px ${W.blue}` : "none",
              }}
            >
              <span>
                <span className="block text-sm font-bold" style={{ color: W.ink }}>
                  {g.label}
                </span>
                <span className="text-xs" style={{ color: W.inkMute }}>
                  {g.sub}
                </span>
              </span>
              <span
                className="font-[family-name:var(--font-mono)] text-base font-semibold tabular-nums"
                style={{ color: active ? W.blue : W.inkSoft }}
              >
                {odd(g.odd)}
              </span>
            </button>
          );
        })}
      </div>

      {/* stake */}
      <div className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: W.surfaceMute }}>
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: W.inkMute }}>
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
            style={{ background: W.surface, color: W.ink, boxShadow: "inset 0 0 0 1px " + W.line }}
          >
            <Minus size={16} />
          </button>
          <span className="min-w-[88px] text-center font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums" style={{ color: W.ink }}>
            {brl(stake)}
          </span>
          <button
            type="button"
            onClick={() => {
              setStake((s) => Math.min(500, s + 10));
              setPlaced(false);
            }}
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: W.blue, color: "#fff" }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* payout */}
      <div className="mt-4 flex items-end justify-between">
        <span className="text-sm font-semibold" style={{ color: W.inkSoft }}>
          Retorno possível
        </span>
        <motion.span
          key={Math.round(animatedPayout)}
          className="font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
          style={{ color: W.greenDeep }}
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
        style={{ background: placed ? W.green : W.blue, color: placed ? W.greenInk : "#fff" }}
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
              <Check size={18} strokeWidth={3} /> Aposta feita — boa sorte… ou melhor, foco!
            </motion.span>
          ) : (
            <motion.span
              key="go"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              <Zap size={18} fill="#fff" /> Fazer aposta <ChevronRight size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
