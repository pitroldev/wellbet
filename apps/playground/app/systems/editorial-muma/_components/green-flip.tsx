"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { M, SPRING, brl, FRAUNCES_DISPLAY } from "./tokens";

export function GreenFlip() {
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(6);
  const [run, setRun] = useState(0);
  const reward = 8.5;
  const animatedReward = useCountUp(done ? reward : 0, 700, run);

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
    <div className="rounded-[6px] bg-white" style={{ boxShadow: `inset 0 0 0 1px ${M.hair}` }}>
      <div className="flex items-baseline justify-between border-b px-6 pb-4 pt-5" style={{ borderColor: M.hair }}>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
          Check-in de hoje
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: M.inkMute }}>
          dia {streak + 1}
        </span>
      </div>

      {/* painel reveal: pink -> green */}
      <div
        className="relative overflow-hidden p-6 transition-colors"
        style={{ background: done ? M.green : M.pinkWash }}
      >
        {done && <Confetti key={run} colors={[M.indigo, M.ink, "#fff"]} spread={140} />}

        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="green"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING}
              className="relative text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...SPRING, delay: 0.2 }}
                className="mx-auto grid h-12 w-12 place-items-center rounded-full"
                style={{ background: M.greenInk }}
              >
                <Check size={26} strokeWidth={3.4} color={M.green} />
              </motion.span>
              <p
                className="mt-3 font-[family-name:var(--font-fraunces)] leading-[0.9]"
                style={{
                  color: M.greenInk,
                  fontSize: "clamp(2.2rem,9vw,3rem)",
                  fontVariationSettings: FRAUNCES_DISPLAY,
                  fontWeight: 600,
                }}
              >
                Deu green.
              </p>
              <p className="mt-1 font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: M.greenInk }}>
                +{brl(animatedReward)} na banca
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p
                className="font-[family-name:var(--font-fraunces)] leading-[0.95]"
                style={{
                  color: M.ink,
                  fontSize: "clamp(1.8rem,7vw,2.4rem)",
                  fontVariationSettings: FRAUNCES_DISPLAY,
                  fontWeight: 500,
                }}
              >
                Bateu a meta
                <br />
                de hoje<span style={{ color: M.pink }}>?</span>
              </p>
              <p className="mt-2 text-sm" style={{ color: M.inkSoft }}>
                Confirme e veja o green cair na banca.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 px-6 py-5">
        <motion.button
          type="button"
          onClick={checkIn}
          whileTap={{ scale: 0.97 }}
          transition={SPRING}
          className="flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold"
          style={{ background: done ? M.white : M.indigo, color: done ? M.ink : "#fff", boxShadow: done ? `inset 0 0 0 1.5px ${M.hair}` : "none" }}
        >
          {done ? "Próximo dia" : "Fazer check-in"}
        </motion.button>
        <div className="flex items-center gap-1.5 rounded-full px-4 py-2.5" style={{ background: M.pinkWash }}>
          <Flame size={16} style={{ color: M.pink }} fill={M.pink} />
          <AnimatePresence mode="popLayout">
            <motion.span
              key={streak}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={SPRING}
              className="font-[family-name:var(--font-mono)] text-base font-bold tabular-nums"
              style={{ color: M.ink }}
            >
              {streak}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs font-semibold" style={{ color: M.inkMute }}>
            streak
          </span>
        </div>
      </div>
    </div>
  );
}
