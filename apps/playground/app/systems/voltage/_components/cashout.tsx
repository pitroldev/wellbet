"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Coins, RotateCcw, TrendingUp } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { V, GRAD, SPRING, GLOW_GREEN, brl, seeded } from "./tokens";
import { Sparks } from "./spark";

const STAKE = 50;

export function CashOut() {
  const [mult, setMult] = useState(1.0);
  const [cashed, setCashed] = useState(false);
  const [run, setRun] = useState(0);
  const tick = useRef(0);

  useEffect(() => {
    if (cashed) return;
    const id = setInterval(() => {
      tick.current += 1;
      const wobble = (seeded(tick.current) - 0.45) * 0.05;
      setMult((m) => Math.max(1, +(m + 0.035 + wobble).toFixed(3)));
    }, 90);
    return () => clearInterval(id);
  }, [cashed, run]);

  const value = STAKE * mult;
  const profit = value - STAKE;

  function cashOut() {
    setCashed(true);
  }
  function again() {
    setMult(1.0);
    tick.current = 0;
    setCashed(false);
    setRun((r) => r + 1);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{ background: V.glass, backdropFilter: "blur(16px)", boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
    >
      {cashed && <Confetti key={run} colors={[V.green, V.blue, V.white]} />}
      {cashed && <Sparks key={"cs" + run} count={12} spread={140} />}

      {/* halo elétrico que intensifica com o multiplicador */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: GRAD.halo }}
        animate={{ opacity: cashed ? 0.9 : Math.min(0.7, 0.2 + (mult - 1) * 0.12) }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative flex items-center justify-between">
        <span className="text-sm font-bold" style={{ color: V.white }}>
          Cash out · voltagem ao vivo
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ background: cashed ? V.green : "rgba(255,255,255,.10)", color: cashed ? V.greenInk : V.white }}
        >
          <TrendingUp size={12} /> {cashed ? "garantido" : "ao vivo"}
        </span>
      </div>

      <div className="relative mt-6 flex items-end justify-center gap-1">
        <motion.span
          animate={{ scale: cashed ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.4 }}
          className="bg-clip-text font-[family-name:var(--font-mono)] text-6xl font-bold leading-none tabular-nums text-transparent"
          style={{ backgroundImage: cashed ? `linear-gradient(90deg,${V.green},${V.green})` : GRAD.flow }}
        >
          {mult.toFixed(2)}
        </motion.span>
        <span className="mb-1 font-[family-name:var(--font-mono)] text-2xl font-bold" style={{ color: cashed ? V.green : V.blueSoft }}>
          ×
        </span>
      </div>

      <div className="relative mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,.06)" }}>
        <span className="text-xs" style={{ color: V.inkSoft }}>
          stake {brl(STAKE)}
        </span>
        <span className="font-[family-name:var(--font-mono)] text-xl font-medium tabular-nums" style={{ color: V.green }}>
          {brl(value)}
        </span>
      </div>

      {!cashed ? (
        <motion.button
          type="button"
          onClick={cashOut}
          whileTap={{ scale: 0.97 }}
          transition={SPRING}
          className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold"
          style={{ background: GRAD.bolt, color: V.greenInk, boxShadow: GLOW_GREEN }}
        >
          <Coins size={18} /> Cash out · {brl(value)}
        </motion.button>
      ) : (
        <div className="relative mt-4">
          <p className="text-center text-sm font-bold" style={{ color: V.green }}>
            +{brl(profit)} no bolso. Deu green!
          </p>
          <button
            type="button"
            onClick={again}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold"
            style={{ background: "rgba(255,255,255,.10)", color: V.white, boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
          >
            <RotateCcw size={15} /> Apostar de novo
          </button>
        </div>
      )}
    </div>
  );
}
