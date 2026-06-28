"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Coins, RotateCcw, TrendingUp } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { G, SPRING, brl, seeded } from "./tokens";

const STAKE = 80;

export function CashOut() {
  const [mult, setMult] = useState(1.0);
  const [cashed, setCashed] = useState(false);
  const [run, setRun] = useState(0);
  const tick = useRef(0);

  useEffect(() => {
    if (cashed) return;
    const id = setInterval(() => {
      tick.current += 1;
      const wobble = (seeded(tick.current) - 0.42) * 0.05;
      setMult((m) => Math.max(1, +(m + 0.04 + wobble).toFixed(3)));
    }, 90);
    return () => clearInterval(id);
  }, [cashed, run]);

  const value = STAKE * mult;
  const profit = value - STAKE;

  function cashOut() {
    setCashed(true);
    setRun((r) => r + 1);
  }
  function again() {
    setMult(1.0);
    tick.current = 0;
    setCashed(false);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{ background: G.ink, color: "#fff", boxShadow: "inset 0 0 0 1px " + G.navyLine }}
    >
      {cashed && <Confetti key={run} colors={[G.green, G.magenta, "#fff"]} />}
      <span className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-25 blur-2xl" style={{ background: cashed ? G.green : G.magenta }} />

      <div className="relative flex items-center justify-between">
        <span className="text-sm font-bold">Cash out ao vivo</span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ background: cashed ? G.green : "rgba(255,0,255,.18)", color: cashed ? G.greenInk : G.pinkPale }}
        >
          <TrendingUp size={12} /> {cashed ? "garantido" : "ao vivo"}
        </span>
      </div>

      <div className="relative mt-6 flex items-end justify-center gap-1">
        <span className="mb-1 font-[family-name:var(--font-mono)] text-lg opacity-50">x</span>
        <motion.span
          animate={{ scale: cashed ? [1, 1.16, 1] : 1 }}
          transition={{ duration: 0.4 }}
          className="font-[family-name:var(--font-mono)] text-6xl font-medium leading-none tabular-nums"
          style={{ color: cashed ? G.green : G.magenta, textShadow: cashed ? "0 0 24px rgba(65,255,202,.6)" : "0 0 24px rgba(255,0,255,.6)" }}
        >
          {mult.toFixed(2)}
        </motion.span>
      </div>

      <div className="relative mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,.06)" }}>
        <span className="text-xs opacity-70">stake {brl(STAKE)}</span>
        <span className="font-[family-name:var(--font-mono)] text-xl font-medium tabular-nums" style={{ color: cashed ? G.green : G.pinkPale }}>
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
          style={{ background: G.magenta, color: "#fff", boxShadow: "0 12px 28px -10px rgba(255,0,255,.8)" }}
        >
          <Coins size={18} /> Cash out · {brl(value)}
        </motion.button>
      ) : (
        <div className="relative mt-4">
          <p className="text-center text-sm font-extrabold" style={{ color: G.green }}>
            +{brl(profit)} no bolso. DEU GREEN!
          </p>
          <button
            type="button"
            onClick={again}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold"
            style={{ background: "rgba(255,255,255,.1)", color: "#fff" }}
          >
            <RotateCcw size={15} /> Apostar de novo
          </button>
        </div>
      )}
    </div>
  );
}
