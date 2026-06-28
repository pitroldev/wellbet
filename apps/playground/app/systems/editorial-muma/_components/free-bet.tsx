"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { M, SPRING, FRAUNCES_DISPLAY } from "./tokens";

const AMOUNT = 25;

export function FreeBet() {
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState(0);
  const value = useCountUp(open ? AMOUNT : 0, 700, run);

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    setRun((r) => r + 1);
  }

  return (
    <div className="rounded-[6px] bg-white" style={{ boxShadow: `inset 0 0 0 1px ${M.hair}` }}>
      <div className="flex items-baseline justify-between border-b px-6 pb-4 pt-5" style={{ borderColor: M.hair }}>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
          Free bet · prêmio
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px]" style={{ color: M.inkMute }}>
          {open ? "aberta" : "lacrada"}
        </span>
      </div>

      {/* envelope */}
      <div className="relative grid place-items-center px-6 py-8">
        <button
          type="button"
          onClick={toggle}
          className="relative h-[180px] w-full max-w-[300px]"
          style={{ perspective: 900 }}
          aria-label={open ? "Fechar envelope" : "Abrir envelope"}
        >
          {open && <Confetti key={run} colors={[M.pink, M.indigo, M.green]} spread={150} />}

          {/* corpo do envelope */}
          <div
            className="absolute inset-0 grid place-items-center overflow-hidden rounded-[8px]"
            style={{ background: M.indigo }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.div
                  key="card"
                  initial={{ y: 40, opacity: 0, scale: 0.92 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  transition={SPRING}
                  className="mx-4 w-full max-w-[240px] rounded-[6px] bg-white px-5 py-4 text-center"
                  style={{ boxShadow: "0 18px 40px -20px rgba(0,0,0,.5)" }}
                >
                  <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
                    Sua free bet
                  </span>
                  <div className="mt-1 flex items-end justify-center gap-1">
                    <span className="mb-2 font-[family-name:var(--font-mono)] text-base" style={{ color: M.inkMute }}>
                      R$
                    </span>
                    <span
                      className="font-[family-name:var(--font-fraunces)] leading-[0.8] tabular-nums"
                      style={{ color: M.pink, fontSize: "3.4rem", fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 600 }}
                    >
                      {Math.round(value)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs" style={{ color: M.inkSoft }}>
                    Aposte sem tirar da banca.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="sealed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center text-center text-white"
                >
                  <Gift size={40} />
                  <p
                    className="mt-3 font-[family-name:var(--font-fraunces)] leading-none"
                    style={{ fontSize: "1.6rem", fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 500 }}
                  >
                    Um presente
                  </p>
                  <p className="mt-1 text-xs text-white/70">Toque pra abrir.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* aba do envelope — gira ao abrir (2 valores: spring ok) */}
          <motion.div
            className="absolute left-0 right-0 top-0 origin-top"
            style={{ transformStyle: "preserve-3d", height: 70 }}
            animate={{ rotateX: open ? -168 : 0 }}
            transition={SPRING}
          >
            <div
              className="h-full w-full rounded-t-[8px]"
              style={{
                background: M.indigoDeep,
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backfaceVisibility: "hidden",
              }}
            />
          </motion.div>
        </button>
      </div>

      <div className="border-t px-6 py-4" style={{ borderColor: M.hair }}>
        <p className="flex items-center justify-center gap-1.5 text-center text-xs" style={{ color: M.inkMute }}>
          <Sparkles size={13} style={{ color: M.pink }} />
          {open ? "Crédito liberado. Bora apostar de novo." : "Você desbloqueou por 7 dias de streak."}
        </p>
      </div>
    </div>
  );
}
