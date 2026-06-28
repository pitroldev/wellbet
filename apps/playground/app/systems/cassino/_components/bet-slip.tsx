"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Check, ChevronRight, Coins } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { N, SPRING, brl, odd, neonText } from "./tokens";

type Mesa = { label: string; sub: string; odd: number };
const MESAS: Mesa[] = [
  { label: "Roleta · no green", sub: "casa verde", odd: 2.0 },
  { label: "Blackjack · 21", sub: "fechar a mão", odd: 2.45 },
  { label: "Dados · 7+", sub: "soma dos dados", odd: 1.85 },
];

export function BetSlip() {
  const [mi, setMi] = useState(0);
  const [stake, setStake] = useState(50);
  const [placed, setPlaced] = useState(false);
  const [run, setRun] = useState(0);

  const o = MESAS[mi].odd;
  const payout = stake * o;
  const animatedPayout = useCountUp(payout, 500, run + mi + stake);

  function place() {
    setPlaced(true);
    setRun((r) => r + 1);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 sm:p-6"
      style={{
        background: `linear-gradient(180deg, ${N.panel}, ${N.groundDeep})`,
        border: `1px solid ${N.line}`,
        boxShadow: `0 30px 70px -30px rgba(0,0,0,.9), 0 0 30px ${N.green}22`,
      }}
    >
      {placed && <Confetti key={run} colors={[N.green, N.magenta, N.gold, "#fff"]} />}

      {/* serrilha de ticket no topo */}
      <div
        className="pointer-events-none absolute -top-2 left-0 right-0 h-3"
        style={{
          background: `radial-gradient(circle at 6px 0, transparent 6px, ${N.panel} 6px) 0 0 / 16px 100% repeat-x`,
        }}
      />

      <div className="flex items-center justify-between">
        <span
          className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-[0.18em]"
          style={{ color: N.green, textShadow: neonText(N.green) }}
        >
          Cupom · cassino neon
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: N.mute }}>
          #CN-2026
        </span>
      </div>

      {/* mesas (cotações) */}
      <div className="mt-4 space-y-2">
        {MESAS.map((m, i) => {
          const active = i === mi;
          return (
            <button
              key={m.label}
              type="button"
              onClick={() => {
                setMi(i);
                setPlaced(false);
              }}
              className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition-colors"
              style={{
                background: active ? "rgba(65,255,202,.10)" : N.panelSoft,
                boxShadow: active ? `inset 0 0 0 1.5px ${N.green}, 0 0 16px ${N.green}33` : "none",
              }}
            >
              <span>
                <span className="block text-sm font-bold" style={{ color: N.white }}>
                  {m.label}
                </span>
                <span className="text-xs" style={{ color: N.mute }}>
                  {m.sub}
                </span>
              </span>
              <span
                className="font-[family-name:var(--font-mono)] text-base font-semibold tabular-nums"
                style={{ color: active ? N.green : N.mute }}
              >
                {odd(m.odd)}
              </span>
            </button>
          );
        })}
      </div>

      {/* stake */}
      <div className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: N.panelSoft }}>
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: N.mute }}>
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
            style={{ background: N.ground, color: N.white, boxShadow: `inset 0 0 0 1px ${N.line}` }}
          >
            <Minus size={16} />
          </button>
          <span
            className="min-w-[88px] text-center font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums"
            style={{ color: N.white }}
          >
            {brl(stake)}
          </span>
          <button
            type="button"
            onClick={() => {
              setStake((s) => Math.min(500, s + 10));
              setPlaced(false);
            }}
            className="grid h-9 w-9 place-items-center rounded-full"
            style={{ background: N.green, color: N.greenInk, boxShadow: `0 0 12px ${N.green}66` }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* linha pontilhada de ticket */}
      <div className="my-4 border-t border-dashed" style={{ borderColor: N.line }} />

      {/* payout */}
      <div className="flex items-end justify-between">
        <span className="text-sm font-semibold" style={{ color: N.mute }}>
          Retorno possível
        </span>
        <motion.span
          key={Math.round(animatedPayout)}
          className="font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
          style={{ color: N.green, textShadow: neonText(N.green) }}
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
          background: placed ? N.green : N.magenta,
          color: placed ? N.greenInk : "#fff",
          boxShadow: placed ? `0 0 22px ${N.green}88` : `0 0 22px ${N.magenta}88`,
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
              <Coins size={18} /> Confirmar aposta <ChevronRight size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
