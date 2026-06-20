"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Gift, Sparkles, RotateCcw } from "lucide-react";
import { ISO, SPRING, brl } from "./tokens";
import { Confetti } from "./confetti";

/**
 * IsoVault — FREE BET como cofre 3D tátil que ABRE no toque (spring + drop +
 * confete). Recompensa por consistência: manteve a acumuladora viva → ganhou
 * uma aposta grátis. O valor revelado é GANHO (verde sagrado).
 */
export function IsoVault({ freeBet = 25 }: { freeBet?: number }) {
  const [open, setOpen] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  function pop() {
    if (open) return;
    setOpen(true);
    setConfettiKey((k) => k + 1);
  }
  function reset() {
    setOpen(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={pop}
        className="relative grid place-items-center"
        style={{ width: 230, height: 210, minHeight: 44 }}
        aria-label={open ? "Aposta grátis liberada" : "Abrir cofre de aposta grátis"}
      >
        {open && <Confetti key={confettiKey} count={34} />}

        {/* item que SALTA do cofre */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ y: 30, scale: 0, opacity: 0, rotate: -12 }}
              animate={{ y: -96, scale: 1, opacity: 1, rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 13 }}
              className="absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 rounded-2xl px-4 py-2"
              style={{
                background: ISO.green,
                border: `3px solid ${ISO.ink}`,
                boxShadow: `0 6px 0 ${ISO.greenDeep}`,
              }}
            >
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-white">
                <Sparkles size={11} /> Free bet
              </span>
              <span className="font-[family-name:var(--font-display)] text-2xl font-bold leading-none text-white tabular-nums">
                {brl(freeBet, false)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* corpo do cofre */}
        <motion.div
          animate={open ? { y: [0, -5, 0] } : { y: 0 }}
          whileHover={!open ? { y: -4, rotate: -1 } : undefined}
          transition={open ? { duration: 0.55, ease: "easeInOut" } : SPRING}
          className="relative"
          style={{ width: 168, height: 150 }}
        >
          {/* sombra sólida */}
          <div
            className="absolute rounded-2xl"
            style={{ inset: 0, top: 10, left: 12, background: ISO.purpleDeep }}
          />
          {/* face do cofre */}
          <div
            className="absolute inset-0 grid place-items-center overflow-hidden rounded-2xl"
            style={{ background: ISO.purple, border: `4px solid ${ISO.ink}` }}
          >
            {/* topo isométrico */}
            <div
              className="absolute -top-[2px] left-0 h-5 w-full"
              style={{ background: ISO.purpleSoft, opacity: 0.5 }}
            />
            {/* saldo revelado atrás da porta */}
            <div className="z-0 flex flex-col items-center px-2 text-center">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-white/70">
                Sua aposta grátis
              </span>
              <span className="font-[family-name:var(--font-display)] text-xl font-bold leading-none text-white">
                liberada!
              </span>
            </div>

            {/* porta — gira como dobradiça */}
            <motion.div
              className="absolute inset-0 z-10 grid place-items-center rounded-xl"
              style={{
                background: ISO.purpleDeep,
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
              }}
              animate={{ rotateY: open ? -118 : 0 }}
              transition={SPRING}
            >
              <div
                className="grid h-16 w-16 place-items-center rounded-full"
                style={{
                  background: ISO.yellow,
                  border: `4px solid ${ISO.ink}`,
                }}
              >
                {open ? (
                  <Gift size={26} color={ISO.ink} strokeWidth={2.6} />
                ) : (
                  <Lock size={24} color={ISO.ink} strokeWidth={2.6} />
                )}
              </div>
              <span className="absolute bottom-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
                WellBet
              </span>
            </motion.div>
          </div>
        </motion.div>
      </button>

      {open ? (
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold"
          style={{
            color: ISO.inkSoft,
            border: `2px solid ${ISO.baseDeep}`,
            minHeight: 36,
          }}
        >
          <RotateCcw size={13} /> Guardar de novo
        </button>
      ) : (
        <p className="text-center text-sm font-medium" style={{ color: ISO.inkSoft }}>
          7 dias de acumuladora viva = <strong style={{ color: ISO.greenDeep }}>1 free bet</strong>.
          <br />
          Toque pra abrir.
        </p>
      )}
    </div>
  );
}
