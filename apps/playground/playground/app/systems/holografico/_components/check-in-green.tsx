"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";
import { FOIL, HOLO, brl } from "./tokens";
import { GlassLabel, HoloCheck, IridBurst, ScanSweep } from "./primitives";

/**
 * CHECK-IN → DEU GREEN. Sequência de dias; o último check-in resolve a meta:
 * varredura de shimmer + burst iridescente + flash resolvendo em verde.
 */

const TOTAL = 5;
const REWARD = 168;

export function CheckInGreen() {
  const [days, setDays] = useState(3);
  const [scan, setScan] = useState(0);
  const [burst, setBurst] = useState(0);

  const green = days >= TOTAL;

  function check() {
    if (green) return;
    const next = days + 1;
    setDays(next);
    setScan((s) => s + 1);
    if (next >= TOTAL) setBurst((b) => b + 1);
  }

  function reset() {
    setDays(0);
    setBurst(0);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 p-5 backdrop-blur-md">
      <ScanSweep run={scan} tone={green ? "green" : "cyan"} />
      <IridBurst burstKey={burst} count={24} />

      <div className="flex items-center justify-between">
        <GlassLabel className="text-[#A6A6C8]">check-in da meta</GlassLabel>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#A855F7]">
          <Flame className="h-3.5 w-3.5" /> {days}/{TOTAL} dias
        </span>
      </div>

      {/* trilha de dias */}
      <div className="mt-4 flex items-center justify-between gap-1.5">
        {Array.from({ length: TOTAL }).map((_, i) => {
          const lit = i < days;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <motion.span
                className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold"
                animate={{ scale: lit ? 1 : 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 18 }}
                style={{
                  background: lit ? FOIL : "rgba(255,255,255,0.05)",
                  color: lit ? "#0A0A12" : HOLO.inkFaint,
                }}
              >
                {i + 1}
              </motion.span>
              <span
                className="h-1 w-full rounded-full"
                style={{
                  background: lit ? HOLO.green : "rgba(255,255,255,0.08)",
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="relative mt-5 min-h-[112px]">
        <AnimatePresence mode="wait">
          {!green ? (
            <motion.button
              key="cta"
              type="button"
              onClick={check}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileTap={{ scale: 0.97 }}
              className="block min-h-[52px] w-full rounded-2xl px-5 text-base font-bold text-[#0A0A12]"
              style={{
                background: FOIL,
                boxShadow: "0 14px 36px -14px rgba(168, 85, 247,0.7)",
              }}
            >
              Fazer check-in de hoje
            </motion.button>
          ) : (
            <motion.div
              key="green"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 460, damping: 20 }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[#34F5A0]/40 bg-[#34F5A0]/[0.08] px-4 py-4 text-center"
            >
              <HoloCheck size={48} />
              <motion.p
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.18, repeat: 2 }}
                className="font-[family-name:var(--font-display)] text-lg font-extrabold text-[#34F5A0]"
              >
                DEU GREEN!
              </motion.p>
              <p className="text-sm text-[#F2F2FA]">
                Meta cumprida · você recebeu{" "}
                <strong className="font-[family-name:var(--font-mono)] text-[#34F5A0]">
                  R$ {brl(REWARD)}
                </strong>
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-1 inline-flex min-h-[44px] items-center text-xs uppercase tracking-widest text-[#A6A6C8] transition-colors hover:text-[#F2F2FA]"
              >
                ↺ recomeçar ciclo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
