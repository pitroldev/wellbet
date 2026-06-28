"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Check, Gift, Lock } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { G, SPRING, SPRING_POP, GRAD, brl0 } from "./tokens";

const TOTAL = 5; // 5 treinos no desafio
const REWARD = 250; // free bet ao completar

export function Challenge() {
  const [done, setDone] = useState(2);
  const [revealed, setRevealed] = useState(false);
  const [run, setRun] = useState(0);
  const pct = done / TOTAL;
  const complete = done >= TOTAL;
  const animatedReward = useCountUp(revealed ? REWARD : 0, 700, run);

  function tick() {
    if (done < TOTAL) {
      setDone((d) => d + 1);
    }
  }

  function claim() {
    setRevealed(true);
    setRun((r) => r + 1);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 sm:p-6"
      style={{ background: G.navySoft, boxShadow: "inset 0 0 0 1px " + G.navyLine }}
    >
      {revealed && <Confetti key={run} colors={[G.magenta, G.green, G.pink, "#fff"]} spread={170} />}

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-extrabold" style={{ color: G.white }}>
          <Target size={15} style={{ color: G.magenta }} /> Desafio da semana
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em]" style={{ color: G.fogMute }}>
          {done}/{TOTAL} treinos
        </span>
      </div>

      <p className="mt-3 font-[family-name:var(--font-archivo)] text-xl font-black uppercase italic leading-none tracking-tight" style={{ color: G.pinkPale }}>
        5 treinos, free bet liberada
      </p>

      {/* trilha de pontos */}
      <div className="mt-4 grid grid-cols-5 gap-2">
        {Array.from({ length: TOTAL }).map((_, i) => {
          const on = i < done;
          return (
            <button
              key={i}
              type="button"
              onClick={tick}
              className="flex flex-col items-center gap-1.5"
              aria-label={`Treino ${i + 1}`}
            >
              <motion.span
                whileTap={{ scale: 0.85 }}
                animate={{ background: on ? G.magenta : G.ink, scale: on ? 1 : 0.96 }}
                transition={SPRING}
                className="grid h-11 w-full place-items-center rounded-xl"
                style={{ boxShadow: on ? "0 0 16px -4px rgba(255,0,255,.8)" : "inset 0 0 0 1px " + G.navyLine }}
              >
                {on ? <Check size={16} strokeWidth={3} style={{ color: "#fff" }} /> : <span className="h-1.5 w-1.5 rounded-full" style={{ background: G.fogMute }} />}
              </motion.span>
              <span className="text-[10px] font-bold" style={{ color: on ? G.magenta : G.fogMute }}>
                T{i + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* barra de progresso */}
      <div className="mt-4 h-3 overflow-hidden rounded-full" style={{ background: G.ink }}>
        <motion.div className="h-full rounded-full" style={{ background: GRAD.gymbet }} animate={{ width: `${pct * 100}%` }} transition={SPRING} />
      </div>

      {/* recompensa / CTA */}
      <div className="mt-4">
        <AnimatePresence mode="wait" initial={false}>
          {revealed ? (
            <motion.div
              key="rev"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={SPRING_POP}
              className="flex items-center justify-between rounded-2xl px-4 py-3.5"
              style={{ background: GRAD.jackpot, color: G.greenInk }}
            >
              <span className="inline-flex items-center gap-1.5 text-sm font-extrabold">
                <Gift size={16} /> Free bet liberada
              </span>
              <span className="font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums">{brl0(animatedReward)}</span>
            </motion.div>
          ) : complete ? (
            <motion.button
              key="claim"
              type="button"
              onClick={claim}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold"
              style={{ background: G.green, color: G.greenInk, boxShadow: "0 12px 28px -10px rgba(65,255,202,.6)" }}
            >
              <Gift size={18} /> Resgatar free bet de {brl0(REWARD)}
            </motion.button>
          ) : (
            <motion.div
              key="lock"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between rounded-2xl px-4 py-3.5"
              style={{ background: G.ink, boxShadow: "inset 0 0 0 1px " + G.navyLine }}
            >
              <span className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: G.fog }}>
                <Lock size={15} style={{ color: G.fogMute }} /> Complete os treinos pra liberar
              </span>
              <span className="font-[family-name:var(--font-mono)] text-base font-bold tabular-nums" style={{ color: G.pinkPale }}>
                {brl0(REWARD)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <p className="mt-2 text-center text-xs" style={{ color: G.fogMute }}>
          Toque nos treinos pra marcar — quem chega primeiro fatura.
        </p>
      </div>
    </div>
  );
}
