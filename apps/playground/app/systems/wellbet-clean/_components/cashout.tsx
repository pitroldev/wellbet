"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Coins, RotateCcw, TrendingUp } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { W, SPRING, brl } from "./tokens";
import { seeded } from "@/lib/brand";

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
      const wobble = (seeded(tick.current) - 0.45) * 0.04;
      setMult((m) => Math.max(1, +(m + 0.03 + wobble).toFixed(3)));
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
      style={{ background: W.ink, color: "#fff" }}
    >
      {cashed && <Confetti key={run} colors={[W.green, W.blue, "#fff"]} />}

      {/* sparkline decorativa */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">Cash out ao vivo</span>
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: cashed ? W.green : "rgba(255,255,255,.12)", color: cashed ? W.greenInk : "#fff" }}>
          <TrendingUp size={12} /> {cashed ? "garantido" : "ao vivo"}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-center gap-1">
        <span className="mb-1 font-[family-name:var(--font-mono)] text-lg opacity-60">x</span>
        <motion.span
          animate={{ scale: cashed ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.4 }}
          className="font-[family-name:var(--font-mono)] text-6xl font-medium leading-none tabular-nums"
          style={{ color: cashed ? W.green : "#fff" }}
        >
          {mult.toFixed(2)}
        </motion.span>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,.07)" }}>
        <span className="text-xs opacity-70">stake {brl(STAKE)}</span>
        <span className="font-[family-name:var(--font-mono)] text-xl font-medium tabular-nums" style={{ color: W.green }}>
          {brl(value)}
        </span>
      </div>

      {!cashed ? (
        <motion.button
          type="button"
          onClick={cashOut}
          whileTap={{ scale: 0.97 }}
          transition={SPRING}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold"
          style={{ background: W.green, color: W.greenInk }}
        >
          <Coins size={18} /> Cash out · {brl(value)}
        </motion.button>
      ) : (
        <div className="mt-4">
          <p className="text-center text-sm font-bold" style={{ color: W.green }}>
            +{brl(profit)} no bolso. Deu green! 🟢
          </p>
          <button
            type="button"
            onClick={again}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold"
            style={{ background: "rgba(255,255,255,.12)", color: "#fff" }}
          >
            <RotateCcw size={15} /> Apostar de novo
          </button>
        </div>
      )}
    </div>
  );
}
