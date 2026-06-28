"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Zap, Check, ChevronRight, Ticket } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { J, SPRING, GLOW_MAGENTA, GLOW_GREEN, brl, odd } from "./tokens";

/**
 * BetSlip — cupom/ticket de aposta do salão: escolhe a aposta (odd) ->
 * ajusta o stake -> payout com count-up -> confirma (confete + green).
 */
type Pick = { label: string; sub: string; odd: number };
const PICKS: Pick[] = [
  { label: "Cair um 777", sub: "no próximo giro", odd: 12.0 },
  { label: "Bater 2 iguais", sub: "linha do meio", odd: 2.4 },
  { label: "Free spin", sub: "na roda da fortuna", odd: 1.7 },
];

export function BetSlip() {
  const [pi, setPi] = useState(0);
  const [stake, setStake] = useState(20);
  const [placed, setPlaced] = useState(false);
  const [run, setRun] = useState(0);

  const o = PICKS[pi].odd;
  const payout = stake * o;
  const animatedPayout = useCountUp(payout, 500, run + pi + stake);

  function place() {
    setPlaced(true);
    setRun((r) => r + 1);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 sm:p-6"
      style={{ background: "linear-gradient(160deg,#3215AD,#220C82)", boxShadow: "inset 0 0 0 1px " + J.line }}
    >
      {placed && <Confetti key={run} colors={[J.magenta, J.pink, J.green, J.gold]} />}

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-extrabold" style={{ color: J.text }}>
          <Ticket size={16} style={{ color: J.pink }} /> Cupom · sala de jogo
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: J.textMute }}>
          #JKP-777
        </span>
      </div>

      {/* apostas (odds) */}
      <div className="mt-4 space-y-2">
        {PICKS.map((g, i) => {
          const active = i === pi;
          return (
            <button
              key={g.label}
              type="button"
              onClick={() => {
                setPi(i);
                setPlaced(false);
              }}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors"
              style={{
                background: active ? "rgba(255,0,255,.16)" : J.surface,
                boxShadow: active ? `inset 0 0 0 1.5px ${J.magenta}` : "inset 0 0 0 1px " + J.line,
              }}
            >
              <span>
                <span className="block text-sm font-bold" style={{ color: J.text }}>
                  {g.label}
                </span>
                <span className="text-xs" style={{ color: J.textMute }}>
                  {g.sub}
                </span>
              </span>
              <span
                className="font-[family-name:var(--font-mono)] text-base font-semibold tabular-nums"
                style={{ color: active ? J.pink : J.textSoft }}
              >
                {odd(g.odd)}
              </span>
            </button>
          );
        })}
      </div>

      {/* stake */}
      <div className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: J.surface }}>
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: J.textMute }}>
          Stake
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setStake((s) => Math.max(5, s - 5));
              setPlaced(false);
            }}
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: J.surfaceUp, color: J.text }}
          >
            <Minus size={16} />
          </button>
          <span className="min-w-[88px] text-center font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums" style={{ color: J.text }}>
            {brl(stake)}
          </span>
          <button
            type="button"
            onClick={() => {
              setStake((s) => Math.min(500, s + 5));
              setPlaced(false);
            }}
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: J.magenta, color: "#fff", boxShadow: GLOW_MAGENTA }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* payout */}
      <div className="mt-4 flex items-end justify-between">
        <span className="text-sm font-semibold" style={{ color: J.textSoft }}>
          Retorno possível
        </span>
        <motion.span
          key={Math.round(animatedPayout)}
          className="font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
          style={{ color: J.green, textShadow: "0 0 14px rgba(65,255,202,.4)" }}
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
          background: placed ? J.green : J.magenta,
          color: placed ? J.greenInk : "#fff",
          boxShadow: placed ? GLOW_GREEN : GLOW_MAGENTA,
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
              <Check size={18} strokeWidth={3} /> Cupom registrado — boa sorte!
            </motion.span>
          ) : (
            <motion.span
              key="go"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2"
            >
              <Zap size={18} fill="#fff" /> Confirmar aposta <ChevronRight size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
