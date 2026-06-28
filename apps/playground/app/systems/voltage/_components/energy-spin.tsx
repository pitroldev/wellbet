"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Zap, RotateCcw } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { V, GRAD, SPRING, brl, seeded } from "./tokens";
import { Sparks } from "./spark";

/** Símbolos de energia — 1 elemento por giro (regra de slot). */
const SYMBOLS = ["⚡", "🔋", "✨", "💎", "🔥", "🟢"] as const;
const MULTS = [1.5, 2, 3, 5, 8, 1.2];
const STAKE = 20;

type Phase = "idle" | "spinning" | "result";

export function EnergySpin() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [idx, setIdx] = useState(0);
  const [run, setRun] = useState(0);
  const spinRef = useRef(0);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  function spin() {
    if (phase === "spinning") return;
    setPhase("spinning");
    setRun((r) => r + 1);
    const start = performance.now();
    const duration = 1500;
    const final = Math.floor(seeded(spinRef.current * 7 + 3) * SYMBOLS.length);
    spinRef.current += 1;

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // desacelera: troca menos no fim
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = Math.floor(eased * 22 + 0) % SYMBOLS.length;
      setIdx(t < 1 ? cur : final);
      if (t < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        setIdx(final);
        setPhase("result");
      }
    };
    raf.current = requestAnimationFrame(step);
  }

  const win = phase === "result" && MULTS[idx] >= 3;
  const mult = MULTS[idx];

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{ background: V.glass, backdropFilter: "blur(16px)", boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
    >
      {win && <Confetti key={"c" + run} colors={[V.green, V.blue, V.blueSoft]} />}
      {win && <Sparks key={"s" + run} count={12} spread={140} />}

      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold" style={{ color: V.white }}>
          Spin de energia · free bet
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: V.inkFaint }}>
          stake {brl(STAKE)}
        </span>
      </div>

      {/* janela do reel — 1 símbolo, render condicional + key */}
      <div
        className="relative mx-auto mt-5 grid h-36 w-full place-items-center overflow-hidden rounded-2xl"
        style={{ background: "rgba(255,255,255,.05)", boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
      >
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: GRAD.halo }} animate={{ opacity: win ? 0.9 : 0.25 }} transition={{ duration: 0.3 }} />
        <motion.div
          key={phase + "-" + idx}
          initial={{ y: phase === "spinning" ? -28 : 0, opacity: phase === "spinning" ? 0.5 : 0 }}
          animate={{ y: 0, opacity: 1, scale: phase === "result" ? [1, 1.18, 1] : 1 }}
          transition={phase === "result" ? { duration: 0.4 } : SPRING}
          className="relative z-10 text-7xl leading-none"
          style={{ filter: win ? "drop-shadow(0 0 18px rgba(65,255,202,.7))" : undefined }}
        >
          {SYMBOLS[idx]}
        </motion.div>
      </div>

      {/* resultado */}
      <div className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,.06)" }}>
        <span className="text-xs" style={{ color: V.inkSoft }}>
          {phase === "result" ? (win ? "Voltagem máxima!" : "Mantém a carga") : "Multiplicador"}
        </span>
        <span
          className="bg-clip-text font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums text-transparent"
          style={{ backgroundImage: GRAD.flow }}
        >
          {phase === "result" ? `${mult}×` : "—"}
        </span>
      </div>

      <motion.button
        type="button"
        onClick={spin}
        disabled={phase === "spinning"}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold disabled:opacity-60"
        style={{ background: GRAD.bolt, color: V.greenInk }}
      >
        {phase === "result" ? (
          <>
            <RotateCcw size={17} /> Girar de novo
          </>
        ) : (
          <>
            <Zap size={18} fill={V.greenInk} /> {phase === "spinning" ? "Carregando…" : "Girar a energia"}
          </>
        )}
      </motion.button>
    </div>
  );
}
