"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { FOIL, HOLO, brl } from "./tokens";
import { GlassLabel, IridBurst, ScanSweep } from "./primitives";

/**
 * FREE BET — um passe de luz lacrado. Tocar "abrir" rompe o selo holográfico:
 * sweep + burst, revelando uma aposta grátis de valor fixo (plausível CHARYA).
 */

const AMOUNT = 30;

export function FreeBet() {
  const [opened, setOpened] = useState(false);
  const [scan, setScan] = useState(0);
  const [burst, setBurst] = useState(0);

  function open() {
    setOpened(true);
    setScan((s) => s + 1);
    setBurst((b) => b + 1);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 p-5 text-center backdrop-blur-md">
      <span
        aria-hidden
        className="absolute inset-0 opacity-[0.18]"
        style={{ background: FOIL, backgroundSize: "200% 200%" }}
      />
      <ScanSweep run={scan} tone="cyan" />
      <IridBurst burstKey={burst} count={20} />

      <div className="relative">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-4 w-4 text-[#22D3EE]" />
          <GlassLabel className="text-[#A6A6C8]">free bet · passe de luz</GlassLabel>
        </div>

        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-3 flex flex-col items-center gap-3"
            >
              <motion.span
                className="grid h-20 w-20 place-items-center rounded-3xl text-[#0A0A12]"
                style={{ background: FOIL, backgroundSize: "200% 200%" }}
                animate={{ rotate: [0, -3, 3, 0], scale: [1, 1.03, 1] }}
                transition={{
                  duration: 2.4,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                <Gift className="h-9 w-9" />
              </motion.span>
              <p className="text-sm text-[#F2F2FA]">Você ganhou um passe holográfico lacrado.</p>
              <motion.button
                type="button"
                onClick={open}
                whileTap={{ scale: 0.96 }}
                className="min-h-[48px] rounded-2xl px-6 text-sm font-bold text-[#0A0A12]"
                style={{
                  background: HOLO.green,
                  boxShadow: "0 12px 32px -12px rgba(52, 245, 160,0.7)",
                }}
              >
                Romper o selo
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 460, damping: 18 }}
              className="mt-3 flex flex-col items-center gap-1"
            >
              <GlassLabel className="text-[#34F5A0]">aposta grátis liberada</GlassLabel>
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="font-[family-name:var(--font-display)] text-5xl font-extrabold text-[#34F5A0]"
              >
                R$ {brl(AMOUNT)}
              </motion.div>
              <p className="mt-1 text-[11px] text-[#A6A6C8]">
                use numa nova meta sem tocar na sua banca
              </p>
              <button
                type="button"
                onClick={() => setOpened(false)}
                className="mt-2 inline-flex min-h-[44px] items-center text-xs uppercase tracking-widest text-[#A6A6C8] transition-colors hover:text-[#F2F2FA]"
              >
                ↺ de novo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
