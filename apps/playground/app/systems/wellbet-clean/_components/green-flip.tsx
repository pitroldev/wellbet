"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame, CalendarCheck } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { W, SPRING, brl } from "./tokens";

export function GreenFlip() {
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(6);
  const [run, setRun] = useState(0);
  const reward = 8.5;
  const animatedReward = useCountUp(done ? reward : 0, 600, run);

  function checkIn() {
    if (done) {
      // "novo dia"
      setDone(false);
      return;
    }
    setDone(true);
    setStreak((s) => s + 1);
    setRun((r) => r + 1);
  }

  return (
    <div className="relative" style={{ perspective: 1200 }}>
      <motion.div
        className="relative h-[230px] w-full"
        animate={{ rotateY: done ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* frente — check-in pendente */}
        <Face
          style={{ background: W.surface, boxShadow: "inset 0 0 0 1px " + W.line }}
          hiddenWhenFlipped
        >
          <span className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: W.inkMute }}>
            Check-in de hoje
          </span>
          <CalendarCheck size={40} style={{ color: W.blue }} className="mt-3" />
          <p className="mt-3 text-lg font-extrabold" style={{ color: W.ink }}>
            Bateu a meta de hoje?
          </p>
          <p className="text-sm" style={{ color: W.inkMute }}>
            Confirme e veja o green cair na banca.
          </p>
        </Face>

        {/* verso — deu green */}
        <Face style={{ background: W.green, transform: "rotateY(180deg)" }}>
          {done && <Confetti key={run} colors={[W.blue, W.ink, "#fff"]} spread={130} />}
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: done ? 1 : 0 }}
            transition={{ ...SPRING, delay: 0.35 }}
            className="grid h-14 w-14 place-items-center rounded-full"
            style={{ background: W.greenInk }}
          >
            <Check size={30} strokeWidth={3.4} style={{ color: W.green }} />
          </motion.span>
          <p className="mt-3 text-2xl font-extrabold" style={{ color: W.greenInk }}>
            DEU GREEN!
          </p>
          <p className="font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: W.greenInk }}>
            +{brl(animatedReward)} na banca
          </p>
        </Face>
      </motion.div>

      <div className="mt-4 flex items-center gap-3">
        <motion.button
          type="button"
          onClick={checkIn}
          whileTap={{ scale: 0.97 }}
          transition={SPRING}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold"
          style={{ background: done ? W.surfaceMute : W.blue, color: done ? W.ink : "#fff" }}
        >
          {done ? "Próximo dia" : "Fazer check-in"}
        </motion.button>
        <div className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5" style={{ background: W.surfaceMute }}>
          <Flame size={16} style={{ color: W.pink }} fill={W.pink} />
          <AnimatePresence mode="popLayout">
            <motion.span
              key={streak}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={SPRING}
              className="font-[family-name:var(--font-mono)] text-base font-bold tabular-nums"
              style={{ color: W.ink }}
            >
              {streak}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs font-semibold" style={{ color: W.inkMute }}>
            streak
          </span>
        </div>
      </div>
    </div>
  );
}

function Face({
  children,
  style,
  hiddenWhenFlipped,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  hiddenWhenFlipped?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center rounded-[28px] p-6 text-center"
      style={{
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        ...style,
      }}
      aria-hidden={hiddenWhenFlipped ? undefined : undefined}
    >
      {children}
    </div>
  );
}
