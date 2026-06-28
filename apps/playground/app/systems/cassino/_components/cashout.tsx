"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Coins, RotateCcw, TrendingUp } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { N, SPRING, brl, seeded, neonText } from "./tokens";

const STAKE = 50;

/**
 * Cash out ao vivo neon. O multiplicador sobe via setInterval (em useEffect,
 * nunca em render). Toque "Cash out" pra travar o valor antes que estoure.
 * Wobble determinístico por tick (seeded). Confete no cash out.
 */
export function CashOut() {
  const [mult, setMult] = useState(1.0);
  const [cashed, setCashed] = useState(false);
  const [run, setRun] = useState(0);
  const tick = useRef(0);

  useEffect(() => {
    if (cashed) return;
    const id = setInterval(() => {
      tick.current += 1;
      const wobble = (seeded(tick.current + run * 17) - 0.45) * 0.05;
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
      style={{
        background: `radial-gradient(circle at 50% 0%, ${N.magenta}1f, transparent 55%), ${N.groundDeep}`,
        color: "#fff",
        border: `1px solid ${N.line}`,
        boxShadow: cashed ? `0 0 30px ${N.green}33` : `0 0 30px ${N.magenta}22`,
      }}
    >
      {cashed && <Confetti key={run} colors={[N.green, N.gold, N.blue, "#fff"]} />}

      <div className="flex items-center justify-between">
        <span
          className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-[0.18em]"
          style={{ color: cashed ? N.green : N.magenta, textShadow: neonText(cashed ? N.green : N.magenta) }}
        >
          Cash out ao vivo
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{
            background: cashed ? N.green : "rgba(255,255,255,.10)",
            color: cashed ? N.greenInk : "#fff",
          }}
        >
          <TrendingUp size={12} /> {cashed ? "garantido" : "subindo"}
        </span>
      </div>

      <div className="mt-6 flex items-end justify-center gap-1">
        <span className="mb-1 font-[family-name:var(--font-mono)] text-lg opacity-50">x</span>
        <motion.span
          animate={{ scale: cashed ? [1, 1.15, 1] : 1 }}
          transition={{ duration: 0.4 }}
          className="font-[family-name:var(--font-mono)] text-6xl font-medium leading-none tabular-nums"
          style={{
            color: cashed ? N.green : "#fff",
            textShadow: neonText(cashed ? N.green : N.magenta),
          }}
        >
          {mult.toFixed(2)}
        </motion.span>
      </div>

      <div
        className="mt-5 flex items-center justify-between rounded-2xl px-4 py-3"
        style={{ background: "rgba(255,255,255,.06)" }}
      >
        <span className="text-xs opacity-60">stake {brl(STAKE)}</span>
        <span className="font-[family-name:var(--font-mono)] text-xl font-medium tabular-nums" style={{ color: N.green }}>
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
          style={{ background: N.green, color: N.greenInk, boxShadow: `0 0 22px ${N.green}88` }}
        >
          <Coins size={18} /> Cash out · {brl(value)}
        </motion.button>
      ) : (
        <div className="mt-4">
          <p
            className="text-center font-[family-name:var(--font-archivo)] text-base font-black uppercase tracking-tight"
            style={{ color: N.green, textShadow: neonText(N.green) }}
          >
            +{brl(profit)} no bolso · deu green
          </p>
          <button
            type="button"
            onClick={again}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold"
            style={{ background: "rgba(255,255,255,.10)", color: "#fff" }}
          >
            <RotateCcw size={15} /> Apostar de novo
          </button>
        </div>
      )}
    </div>
  );
}
