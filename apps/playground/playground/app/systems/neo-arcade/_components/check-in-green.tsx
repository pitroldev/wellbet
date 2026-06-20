"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HudLabel } from "./primitives";
import { PixelAvatar } from "./pixel-avatar";
import { CoinRain } from "./coin-rain";
import { brl } from "./use-count-up";
import { USERS } from "@/lib/avatars";

/**
 * CHECK-IN -> "DEU GREEN". Registering today's training pushes the bet toward
 * payout. The confirm slams into a LEVEL UP toast: glitch blink + sparkle +
 * coin pop, with the win-verde reserved for this real victory. Celebrates
 * EFFORT ("o treino de hoje tá pago!"), never easy money.
 */

const ME = USERS[8]; // Mariana Costa
const DAY_VALUE = 14.5; // each green day chips this off the payout pot

export function CheckInGreen() {
  const [done, setDone] = useState(false);
  const [burst, setBurst] = useState(0);

  const confirm = () => {
    setDone(true);
    setBurst((b) => b + 1);
  };

  return (
    <div
      className="relative overflow-hidden bg-[#1C1140] p-5 sm:p-6"
      style={{ boxShadow: "0 0 0 4px #6D28D9, 10px 10px 0 0 #2E1065" }}
    >
      <CoinRain burstKey={burst} mode="pop" count={24} />

      <div className="flex items-center gap-3">
        <PixelAvatar
          src={ME.avatar}
          alt={ME.name}
          size={56}
          ring={done ? "#22E06B" : "#6D28D9"}
          glow={done ? "#22E06B" : undefined}
        />
        <div>
          <HudLabel className="block text-[10px] text-[#9D8FC7]">CHECK-IN DE HOJE</HudLabel>
          <span className="font-[family-name:var(--font-body)] text-sm font-semibold text-[#EDE9FE]">
            {ME.name}
          </span>
          <span className="block font-[family-name:var(--font-body)] text-xs text-[#9D8FC7]">
            Treino de força · agachamento 3x12
          </span>
        </div>
      </div>

      <div className="relative mt-5 min-h-[148px]">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key="cta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed text-[#EDE9FE]">
                Fechou o treino? Confirme o check-in e veja a perna de hoje
                <span className="text-[#22E06B]"> dar green</span>. Falta pouco pro payout da
                semana.
              </p>
              <motion.button
                onClick={confirm}
                whileTap={{ x: 3, y: 3 }}
                className="mt-4 block w-full bg-[#6D28D9] px-5 py-4 font-[family-name:var(--font-display)] text-xs text-[#EDE9FE]"
                style={{ boxShadow: "5px 5px 0 0 #2E1065" }}
              >
                ✓ CONFIRMAR CHECK-IN
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="green"
              initial={{ scale: 0.65, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, x: [0, -3, 3, -2, 0] }}
              transition={{
                scale: { type: "spring", stiffness: 700, damping: 15 },
                x: { duration: 0.18, ease: "linear" },
              }}
              className="bg-[#06140C] px-4 py-5 text-center"
              style={{ boxShadow: "0 0 0 4px #22E06B, 6px 6px 0 0 #047857" }}
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.1, repeat: 3 }}
                className="font-[family-name:var(--font-display)] text-lg text-[#22E06B]"
              >
                DEU GREEN!
              </motion.div>
              <p className="mt-3 font-[family-name:var(--font-display)] text-[11px] leading-relaxed text-[#EDE9FE]">
                O TREINO DE HOJE
                <br />
                TÁ PAGO!
              </p>
              <p className="mt-3 font-[family-name:var(--font-body)] text-sm text-[#EDE9FE]/80">
                +R$ {brl(DAY_VALUE)} no pote · streak mantida · +40 XP
              </p>
              <button
                onClick={() => setDone(false)}
                className="mt-2 inline-flex min-h-[44px] items-center justify-center px-3 font-[family-name:var(--font-hud)] text-[10px] uppercase tracking-[0.18em] text-[#9D8FC7] underline underline-offset-4 transition-colors hover:text-[#EDE9FE] active:text-[#EDE9FE]"
              >
                ↺ rever a comemoração
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
