"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { FOIL, brl } from "./tokens";
import { GlassLabel, HoloCheck, ScanSweep } from "./primitives";

/**
 * CASH OUT — valor ao vivo subindo (drift determinístico por tick, sem random
 * no render: incremento vem de uma sequência fixa indexada). Sacar = card vira
 * revelando o verso holográfico "validado" com sweep + check.
 */

const STAKE = 120;
const TARGET_PAYOUT = 288; // se levar até o fim
// deltas determinísticos (somados no tick por effect) — nada de random no render
const DELTAS = [0.42, 0.61, 0.35, 0.77, 0.5, 0.68, 0.44, 0.59, 0.72, 0.4];

export function CashOut() {
  const [value, setValue] = useState(STAKE * 1.18);
  const [done, setDone] = useState(false);
  const [scan, setScan] = useState(0);
  const idx = useRef(0);

  useEffect(() => {
    if (done) return;
    const t = window.setInterval(() => {
      setValue((v) => {
        const d = DELTAS[idx.current % DELTAS.length];
        idx.current += 1;
        const next = v + d;
        return next >= TARGET_PAYOUT ? TARGET_PAYOUT : next;
      });
    }, 320);
    return () => window.clearInterval(t);
  }, [done]);

  const progress = Math.min(1, (value - STAKE) / (TARGET_PAYOUT - STAKE));

  function cashOut() {
    setDone(true);
    setScan((s) => s + 1);
  }

  return (
    <div className="relative h-[320px] w-full" style={{ perspective: 1100 }}>
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: done ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
      >
        {/* FRENTE — valor ao vivo */}
        <div
          className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 p-5 backdrop-blur-md"
          style={{
            backfaceVisibility: "hidden",
            background: "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
          }}
        >
          <div className="flex items-center justify-between">
            <GlassLabel className="text-[#A6A6C8]">cash out · ao vivo</GlassLabel>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#34F5A0]">
              <TrendingUp className="h-3.5 w-3.5" /> subindo
            </span>
          </div>

          <div className="text-center">
            <GlassLabel className="text-[#5B5B7E]">valor disponível agora</GlassLabel>
            <div className="mt-1 font-[family-name:var(--font-mono)] text-5xl font-bold tabular-nums text-[#F2F2FA]">
              R$ {brl(value)}
            </div>
            <p className="mt-1 text-[11px] text-[#A6A6C8]">
              stake R$ {brl(STAKE)} · alvo R$ {brl(TARGET_PAYOUT)}
            </p>
          </div>

          <div>
            <div className="mb-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full"
                style={{ background: FOIL, width: `${progress * 100}%` }}
              />
            </div>
            <motion.button
              type="button"
              onClick={cashOut}
              whileTap={{ scale: 0.97 }}
              className="min-h-[52px] w-full rounded-2xl px-5 text-base font-bold text-[#0A0A12]"
              style={{
                background: FOIL,
                boxShadow: "0 14px 36px -14px rgba(34,211,238,0.7)",
              }}
            >
              Sacar R$ {brl(value)}
            </motion.button>
          </div>
        </div>

        {/* VERSO — validado holográfico */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-[#34F5A0]/30 p-5"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background:
              "radial-gradient(120% 90% at 50% 0%, rgba(52, 245, 160,0.16), rgba(10,10,18,0.95) 70%)",
          }}
        >
          <span
            aria-hidden
            className="absolute inset-0 opacity-20"
            style={{ background: FOIL, backgroundSize: "200% 200%" }}
          />
          <ScanSweep run={scan} tone="green" />
          {done && <HoloCheck size={64} />}
          <div className="relative text-center">
            <p className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[#34F5A0]">
              Cash out validado
            </p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums text-[#F2F2FA]">
              R$ {brl(value)}
            </p>
            <p className="mt-1 text-[11px] text-[#A6A6C8]">
              creditado na sua banca · sem azar, foi seu esforço
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setValue(STAKE * 1.18);
              idx.current = 0;
            }}
            className="relative mt-1 inline-flex min-h-[44px] items-center text-xs uppercase tracking-widest text-[#A6A6C8] transition-colors hover:text-[#F2F2FA]"
          >
            ↺ rodar de novo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
