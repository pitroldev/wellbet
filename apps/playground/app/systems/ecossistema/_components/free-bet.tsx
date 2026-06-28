"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, RotateCcw } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { useProduct } from "./product-context";
import { E, GLASS, GLASS_LINE, SPRING, brl, seeded } from "./tokens";

const PRIZES = [10, 15, 25, 40, 60, 100];

export function FreeBet({ onWin }: { onWin?: () => void }) {
  const { product, theme } = useProduct();
  const [opened, setOpened] = useState(false);
  const [run, setRun] = useState(0);
  const [prize, setPrize] = useState(0);
  const animated = useCountUp(opened ? prize : 0, 700, run);

  function reveal() {
    // sorteio determinístico (seeded por run+produto) — sem Math.random em render
    const idx = Math.floor(seeded(run + (product === "well" ? 3 : 17)) * PRIZES.length);
    setPrize(PRIZES[idx]);
    setOpened(true);
    onWin?.();
  }

  function again() {
    setOpened(false);
    setRun((r) => r + 1);
  }

  return (
    <div
      className="relative flex h-[230px] flex-col items-center justify-center overflow-hidden rounded-[28px] p-6 text-center"
      style={{ background: theme.gradient, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}
    >
      {opened && <Confetti key={run} colors={[E.green, "#fff", E.pink]} spread={150} />}

      <AnimatePresence mode="wait" initial={false}>
        {!opened ? (
          <motion.button
            key="closed"
            type="button"
            onClick={reveal}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileTap={{ scale: 0.94 }}
            transition={SPRING}
            className="flex flex-col items-center"
          >
            <motion.span
              animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 2.4, ease: "easeInOut", times: [0, 0.5, 1], repeat: Infinity }}
              className="grid h-20 w-20 place-items-center rounded-3xl"
              style={{ background: "rgba(255,255,255,.16)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.3)" }}
            >
              <Gift size={40} color="#fff" />
            </motion.span>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-5 py-2.5 text-sm font-extrabold" style={{ color: E.field }}>
              <Sparkles size={16} /> Abrir free bet
            </span>
            <span className="mt-2 text-xs font-semibold text-white/80">
              Recompensa por bater a meta de {theme.metric}
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="open"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={SPRING}
            className="flex flex-col items-center"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">Free bet liberada</span>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-5xl font-medium tabular-nums" style={{ color: "#fff" }}>
              {brl(animated)}
            </p>
            <p className="mt-1 text-sm font-bold" style={{ color: E.green }}>
              Aposte de graça — o green é seu.
            </p>
            <button
              type="button"
              onClick={again}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-bold text-white"
            >
              <RotateCcw size={13} /> De novo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
