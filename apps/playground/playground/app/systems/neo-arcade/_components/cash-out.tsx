"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HudLabel, PixelCoin } from "./primitives";
import { CoinRain } from "./coin-rain";
import { brl } from "./use-count-up";

/**
 * CASH OUT — a bet in progress whose live value climbs toward the full payout.
 * The big arcade button pulses and shows the current cash-out figure ticking
 * up; tapping it locks the gain with a coin pop + satisfying confirmation.
 *
 * Framing: you're 71% to the goal; you can secure part of the green now, or
 * hold for the full payout. No loss-shaming — it's your call.
 */

const STAKE = 120;
const FULL_PAYOUT = 288; // R$ 120 @ 2.40x
const FLOOR = 150; // cash-out value at current progress
const PROGRESS = 71; // % of the goal already done

export function CashOut() {
  const [value, setValue] = useState(FLOOR);
  const [cashed, setCashed] = useState(false);
  const [burst, setBurst] = useState(0);
  const rafRef = useRef<number | null>(null);

  // live ticker: value drifts up toward the full payout while the bet runs
  useEffect(() => {
    if (cashed) return;
    let v = value;
    const tick = () => {
      v += (FULL_PAYOUT - v) * 0.012 + 0.06;
      if (v >= FULL_PAYOUT - 0.5) v = FLOOR; // loop so it always feels alive
      setValue(v);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cashed]);

  const doCashOut = () => {
    setCashed(true);
    setBurst((b) => b + 1);
  };
  const reset = () => {
    setCashed(false);
    setValue(FLOOR);
  };

  return (
    <div
      className="relative overflow-hidden bg-[#1C1140] p-5 sm:p-6"
      style={{ boxShadow: "0 0 0 4px #6D28D9, 10px 10px 0 0 #2E1065" }}
    >
      <CoinRain burstKey={burst} mode="rain" count={22} />

      <div className="flex items-center justify-between">
        <HudLabel className="text-[11px] text-[#9D8FC7]">APOSTA AO VIVO · CASH OUT</HudLabel>
        <span className="flex items-center gap-1.5 bg-[#120A24] px-2.5 py-1.5">
          <span className="h-2 w-2 animate-pulse bg-[#22E06B]" />
          <HudLabel className="text-[10px] text-[#22E06B]">AO VIVO</HudLabel>
        </span>
      </div>

      <p className="mt-3 font-[family-name:var(--font-body)] text-sm leading-relaxed text-[#EDE9FE]">
        Meta <strong>“Correr 10 km sem parar”</strong> · stake R$ {brl(STAKE)} @ 2,40x
      </p>

      {/* progress to goal */}
      <div className="mt-3">
        <div className="flex items-center justify-between font-[family-name:var(--font-body)] text-xs text-[#9D8FC7]">
          <span>Progresso da meta</span>
          <span className="font-bold text-[#22E06B]">{PROGRESS}%</span>
        </div>
        <div className="mt-1.5 flex h-3 gap-[2px] bg-[#2E1065] p-[2px]">
          {Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="h-full flex-1"
              style={{
                background: i < Math.round((PROGRESS / 100) * 16) ? "#22E06B" : "transparent",
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative mt-5 min-h-[120px]">
        <AnimatePresence mode="wait">
          {!cashed ? (
            <motion.div
              key="live"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <HudLabel className="block text-[9px] text-[#9D8FC7]">CASH OUT AGORA</HudLabel>
                  <span className="font-[family-name:var(--font-body)] text-xs text-[#9D8FC7]">
                    Se segurar até o fim: R$ {brl(FULL_PAYOUT)}
                  </span>
                </div>
                <span className="font-[family-name:var(--font-body)] text-xs text-[#9D8FC7]">
                  +R$ {brl(value - STAKE)} de lucro
                </span>
              </div>
              {/* the pulsing arcade button */}
              <motion.button
                onClick={doCashOut}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileTap={{ scale: 0.96, x: 3, y: 3 }}
                className="flex w-full items-center justify-center gap-2 bg-[#FFD60A] px-5 py-5 text-[#120A24]"
                style={{ boxShadow: "5px 5px 0 0 #B8860B" }}
              >
                <PixelCoin size={22} />
                <span className="font-[family-name:var(--font-display)] text-xs">CASH OUT</span>
                <span className="font-[family-name:var(--font-body)] text-2xl font-extrabold tabular-nums">
                  R$ {brl(value)}
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="cashed"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 16 }}
              className="bg-[#120A24] px-4 py-5 text-center"
              style={{ boxShadow: "0 0 0 4px #22E06B, 6px 6px 0 0 #047857" }}
            >
              <div className="font-[family-name:var(--font-display)] text-sm text-[#22E06B]">
                CASH OUT FEITO!
              </div>
              <p className="mt-2 font-[family-name:var(--font-body)] text-base text-[#EDE9FE]">
                Você garantiu <strong className="text-[#22E06B]">R$ {brl(value)}</strong> — lucro de
                R$ {brl(value - STAKE)} travado.
              </p>
              <button
                onClick={reset}
                className="mt-2 inline-flex min-h-[44px] items-center justify-center px-3 font-[family-name:var(--font-hud)] text-[10px] uppercase tracking-[0.18em] text-[#9D8FC7] underline underline-offset-4 transition-colors hover:text-[#EDE9FE] active:text-[#EDE9FE]"
              >
                ↺ ver a aposta correndo de novo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
