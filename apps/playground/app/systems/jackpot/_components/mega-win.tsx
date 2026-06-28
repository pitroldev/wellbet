"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Coins, RotateCcw } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { J, GRAD, SPRING, GLOW_GOLD, brl0, seeded } from "./tokens";
import { MarqueeFrame } from "./marquee";

/**
 * MegaWin — o momento de recompensa máxima: toca -> chuva de moedas + confete
 * + count-up GIGANTE + glow neon. Coins caem em tween (3+ keyframes), posições
 * determinísticas por índice (seeded), nada de Math.random em render.
 */
const PRIZE = 18_750;
const COINS = 18;

export function MegaWin() {
  const [run, setRun] = useState(0);
  const [won, setWon] = useState(false);
  const animated = useCountUp(won ? PRIZE : 0, 1100, run);

  function fire() {
    setWon(true);
    setRun((r) => r + 1);
  }
  function reset() {
    setWon(false);
  }

  return (
    <div
      className="relative flex min-h-[260px] flex-col items-center justify-center overflow-hidden rounded-[28px] p-7 text-center"
      style={{ background: GRAD.gymbet, boxShadow: "inset 0 0 0 1px " + J.line }}
    >
      <MarqueeFrame count={26} color={J.gold} glow={J.goldDeep} />
      {won && <Confetti key={`c-${run}`} count={36} colors={[J.gold, J.magenta, J.pink, J.green]} spread={230} />}

      {/* chuva de moedas */}
      {won && (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
          {Array.from({ length: COINS }).map((_, i) => {
            const x = (seeded(i) - 0.5) * 300;
            const delay = seeded(i + 40) * 0.4;
            const dur = 1.1 + seeded(i + 7) * 0.6;
            const size = 16 + Math.floor(seeded(i + 3) * 12);
            return (
              <motion.span
                key={`${run}-${i}`}
                className="absolute left-1/2 top-0 grid place-items-center rounded-full"
                style={{
                  width: size,
                  height: size,
                  marginLeft: x,
                  background: `radial-gradient(circle at 35% 30%, #FFE9A8, ${J.gold} 55%, ${J.goldDeep})`,
                  boxShadow: GLOW_GOLD,
                }}
                initial={{ y: -30, opacity: 0, rotate: 0 }}
                animate={{ y: [-30, 120, 320], opacity: [0, 1, 0.9], rotate: [0, 180, 360] }}
                transition={{ duration: dur, delay, ease: [0.3, 0.2, 0.4, 1], times: [0, 0.5, 1] }}
              >
                <Coins size={size * 0.6} color={J.goldDeep} strokeWidth={2.4} />
              </motion.span>
            );
          })}
        </div>
      )}

      <div className="relative z-20">
        <motion.span
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]"
          style={{ background: "rgba(0,0,0,.25)", color: J.gold }}
        >
          <Trophy size={13} /> momento mega win
        </motion.span>

        <motion.div
          key={run}
          initial={{ scale: won ? 0.6 : 1, opacity: won ? 0 : 1 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 360, damping: 14 }}
          className="mt-3"
        >
          <span
            className="block font-[family-name:var(--font-archivo)] text-4xl font-black uppercase leading-[0.9] sm:text-5xl"
            style={{ color: "#fff", textShadow: "0 0 24px rgba(255,128,225,.8)" }}
          >
            {won ? "Mega Win!" : "Quer ver?"}
          </span>
          <span
            className="mt-2 block font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums sm:text-4xl"
            style={{ color: J.gold, textShadow: "0 0 22px rgba(255,212,94,.7)" }}
          >
            + {brl0(animated)}
          </span>
        </motion.div>

        {!won ? (
          <motion.button
            type="button"
            onClick={fire}
            whileTap={{ scale: 0.96 }}
            transition={SPRING}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-extrabold"
            style={{ background: J.gold, color: J.greenInk, boxShadow: GLOW_GOLD }}
          >
            <Coins size={16} /> Soltar o jackpot
          </motion.button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="mt-5 inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold"
            style={{ background: "rgba(0,0,0,.25)", color: "#fff" }}
          >
            <RotateCcw size={15} /> De novo
          </button>
        )}
      </div>
    </div>
  );
}
