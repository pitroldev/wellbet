"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Zap, Check, ChevronRight, Dumbbell } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { G, SPRING, GRAD, brl, odd } from "./tokens";

type Goal = { label: string; sub: string; odd: number };
const GOALS: Goal[] = [
  { label: "Treinar 5× na semana", sub: "ranking + streak", odd: 1.9 },
  { label: "Streak de 30 dias", sub: "sem falhar um treino", odd: 3.4 },
  { label: "Bater seu PR no agacho", sub: "carga máxima", odd: 2.6 },
];

export function BetSlip() {
  const [gi, setGi] = useState(0);
  const [stake, setStake] = useState(80);
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
      style={{ background: G.navySoft, boxShadow: placed ? "inset 0 0 0 1.5px " + G.magenta : "inset 0 0 0 1px " + G.navyLine }}
    >
      {placed && <Confetti key={run} colors={[G.magenta, G.pink, G.green, "#fff"]} />}

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-extrabold" style={{ color: G.white }}>
          <Dumbbell size={15} style={{ color: G.magenta }} /> Cupom de treino
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: G.fogMute }}>
          #GB-2026
        </span>
      </div>

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
                background: active ? "rgba(255,0,255,.14)" : G.ink,
                boxShadow: active ? `inset 0 0 0 2px ${G.magenta}` : "inset 0 0 0 1px " + G.navyLine,
              }}
            >
              <span>
                <span className="block text-sm font-bold" style={{ color: G.white }}>
                  {g.label}
                </span>
                <span className="text-xs" style={{ color: G.fogMute }}>
                  {g.sub}
                </span>
              </span>
              <span
                className="font-[family-name:var(--font-mono)] text-base font-semibold tabular-nums"
                style={{ color: active ? G.magenta : G.fog }}
              >
                {odd(g.odd)}
              </span>
            </button>
          );
        })}
      </div>

      {/* stake */}
      <div className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: G.ink }}>
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: G.fogMute }}>
          Stake
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setStake((s) => Math.max(20, s - 20));
              setPlaced(false);
            }}
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: G.navySoft, color: G.white, boxShadow: "inset 0 0 0 1px " + G.navyLine }}
          >
            <Minus size={16} />
          </button>
          <span className="min-w-[88px] text-center font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums" style={{ color: G.white }}>
            {brl(stake)}
          </span>
          <button
            type="button"
            onClick={() => {
              setStake((s) => Math.min(500, s + 20));
              setPlaced(false);
            }}
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: G.magenta, color: "#fff", boxShadow: "0 0 16px -4px rgba(255,0,255,.8)" }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* payout */}
      <div className="mt-4 flex items-end justify-between">
        <span className="text-sm font-semibold" style={{ color: G.fog }}>
          Retorno possível
        </span>
        <motion.span
          key={Math.round(animatedPayout)}
          className="font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
          style={{ color: G.green }}
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
        style={{
          background: placed ? G.green : GRAD.gymbet,
          color: placed ? G.greenInk : "#fff",
          boxShadow: placed ? "0 12px 28px -10px rgba(65,255,202,.6)" : "0 12px 28px -10px rgba(255,0,255,.7)",
        }}
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
              <Check size={18} strokeWidth={3} /> Cupom na arena — agora é treinar!
            </motion.span>
          ) : (
            <motion.span
              key="go"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              <Zap size={18} fill="#fff" /> Confirmar cupom <ChevronRight size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
