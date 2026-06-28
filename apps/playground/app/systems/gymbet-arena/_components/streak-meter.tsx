"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Check } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { G, SPRING, SPRING_POP } from "./tokens";

const NEXT_MILESTONE = (s: number) => Math.ceil((s + 1) / 7) * 7;

export function StreakMeter() {
  const [streak, setStreak] = useState(13);
  const [doneToday, setDoneToday] = useState(false);
  const [run, setRun] = useState(0);
  const [milestone, setMilestone] = useState(false);

  const target = NEXT_MILESTONE(streak);
  const prevTarget = target - 7;
  const within = (streak - prevTarget) / 7; // 0..1 dentro do bloco atual

  function train() {
    if (doneToday) return;
    const next = streak + 1;
    setStreak(next);
    setDoneToday(true);
    setRun((r) => r + 1);
    if (next % 7 === 0) setMilestone(true);
  }

  function reset() {
    setDoneToday(false);
    setMilestone(false);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{ background: G.ink, boxShadow: "inset 0 0 0 1px " + G.navyLine }}
    >
      {milestone && <Confetti key={run} colors={[G.magenta, G.pink, G.green, "#fff"]} spread={170} />}

      {/* estilhaços decorativos */}
      <span className="pointer-events-none absolute -left-10 top-8 h-40 w-40 -rotate-12 rounded-full opacity-20 blur-2xl" style={{ background: G.magenta }} />

      <div className="relative flex items-center justify-between">
        <span className="text-sm font-extrabold" style={{ color: G.white }}>
          Seu streak
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ background: G.magentaWash, color: G.pinkPale }}
        >
          <Flame size={12} fill={G.magenta} style={{ color: G.magenta }} /> em chamas
        </span>
      </div>

      {/* número gigante mono */}
      <div className="relative mt-4 flex items-end justify-center gap-2">
        <Flame size={40} fill={G.magenta} style={{ color: G.magenta }} className="mb-3" />
        <AnimatePresence mode="popLayout">
          <motion.span
            key={streak}
            initial={{ y: 30, opacity: 0, scale: 0.7 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.7 }}
            transition={SPRING_POP}
            className="font-[family-name:var(--font-mono)] text-7xl font-medium leading-none tabular-nums sm:text-8xl"
            style={{ color: G.white, textShadow: "0 0 28px rgba(255,0,255,.6)" }}
          >
            {streak}
          </motion.span>
        </AnimatePresence>
        <span className="mb-3 text-sm font-bold uppercase tracking-wide" style={{ color: G.fogMute }}>
          dias
        </span>
      </div>

      {/* barra magenta até o próximo milestone */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[11px] font-bold" style={{ color: G.fog }}>
          <span>{prevTarget}d</span>
          <span style={{ color: G.magenta }}>próximo marco: {target}d</span>
        </div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full" style={{ background: G.navySoft }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg,#7A1BD6,#FF00FF)", boxShadow: "0 0 16px -2px rgba(255,0,255,.8)" }}
            animate={{ width: `${Math.max(6, within * 100)}%` }}
            transition={SPRING}
          />
        </div>
      </div>

      <motion.button
        type="button"
        onClick={doneToday ? reset : train}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold"
        style={{
          background: doneToday ? G.navySoft : "linear-gradient(100deg,#FF00FF,#7A1BD6)",
          color: doneToday ? G.fog : "#fff",
          boxShadow: doneToday ? "inset 0 0 0 1px " + G.navyLine : "0 12px 28px -10px rgba(255,0,255,.7)",
        }}
      >
        {doneToday ? (
          <>
            <Check size={18} strokeWidth={3} style={{ color: G.green }} /> Treino de hoje registrado
          </>
        ) : (
          <>
            <Flame size={18} fill="#fff" /> Treinei hoje — estende o streak
          </>
        )}
      </motion.button>
      {milestone && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="mt-3 text-center text-sm font-extrabold"
          style={{ color: G.green }}
        >
          MARCO DE {streak} DIAS! Free bet liberada na arena.
        </motion.p>
      )}
    </div>
  );
}
