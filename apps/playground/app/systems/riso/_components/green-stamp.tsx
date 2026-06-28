"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stamp as StampIcon, Flame, CalendarCheck } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { R, brl, halftone, PRINT_SHADOW, STAMP_SPRING } from "./tokens";

/** Carimbo "DEU GREEN" — bate com grão + rotação no check-in (assenta com peso). */
export function GreenStamp() {
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(6);
  const [run, setRun] = useState(0);
  const reward = 8.5;
  const animated = useCountUp(done ? reward : 0, 600, run);

  function checkIn() {
    if (done) {
      setDone(false);
      return;
    }
    setDone(true);
    setStreak((s) => s + 1);
    setRun((r) => r + 1);
  }

  return (
    <div>
      <div
        className="relative grid place-items-center overflow-hidden"
        style={{ background: R.paper, border: `2.5px solid ${R.ink}`, boxShadow: PRINT_SHADOW, minHeight: 230 }}
      >
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ ...halftone(R.blue, 9, 0.3), mixBlendMode: "multiply", opacity: 0.4 }} />
        {done && <Confetti key={run} colors={[R.green, R.magenta, R.ink]} spread={140} />}

        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="green"
              initial={{ scale: 2.4, opacity: 0, rotate: -28 }}
              animate={{ scale: 1, opacity: 1, rotate: -9 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={STAMP_SPRING}
              className="relative px-6 py-4 text-center"
              style={{ border: `4px solid ${R.green}`, outline: `2px solid ${R.green}`, outlineOffset: 4 }}
            >
              <span aria-hidden className="pointer-events-none absolute inset-0" style={{ ...halftone(R.green, 5, 0.34), mixBlendMode: "multiply", opacity: 0.6 }} />
              <p className="relative font-[family-name:var(--font-archivo)] text-4xl font-extrabold uppercase leading-none tracking-tight" style={{ color: R.green }}>
                Deu green
              </p>
              <p className="relative mt-1 font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: R.ink }}>
                +{brl(animated)} na banca
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={STAMP_SPRING}
              className="relative px-6 text-center"
            >
              <CalendarCheck size={40} strokeWidth={2.5} style={{ color: R.blue }} className="mx-auto" />
              <p className="mt-3 font-[family-name:var(--font-archivo)] text-xl font-extrabold uppercase" style={{ color: R.ink }}>
                Bateu a meta de hoje?
              </p>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px]" style={{ color: R.ink }}>
                carimbe e veja o green cair na banca
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <motion.button
          type="button"
          onClick={checkIn}
          whileTap={{ scale: 0.96, x: 2, y: 2 }}
          transition={STAMP_SPRING}
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-extrabold uppercase"
          style={{
            background: done ? R.paperDeep : R.green,
            color: R.ink,
            border: `2.5px solid ${R.ink}`,
            boxShadow: "3px 3px 0 0 " + R.ink,
            fontFamily: "var(--font-archivo)",
          }}
        >
          <StampIcon size={16} strokeWidth={2.5} /> {done ? "Próximo dia" : "Carimbar check-in"}
        </motion.button>

        <div className="flex items-center gap-1.5 px-3.5 py-2.5" style={{ background: R.paper, border: `2.5px solid ${R.ink}` }}>
          <Flame size={16} style={{ color: R.magenta }} fill={R.magenta} />
          <AnimatePresence mode="popLayout">
            <motion.span
              key={streak}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={STAMP_SPRING}
              className="font-[family-name:var(--font-mono)] text-base font-bold tabular-nums"
              style={{ color: R.ink }}
            >
              {streak}
            </motion.span>
          </AnimatePresence>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase" style={{ color: R.ink }}>
            streak
          </span>
        </div>
      </div>
    </div>
  );
}
