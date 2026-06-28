"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Stamp } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { B, BORDER, STAMP_TWEEN, brl } from "./tokens";
import { Block, BrutalButton, MonoLabel } from "./primitives";

/** Check-in: ao confirmar, o carimbo "DEU GREEN" BATE na tela (scale+rotate, tween duro). */
export function GreenStamp() {
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(6);
  const [run, setRun] = useState(0);
  const reward = 8.5;
  const animatedReward = useCountUp(done ? reward : 0, 520, run);

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
    <Block bg={done ? B.green : B.white} className="overflow-hidden">
      {done && <Confetti key={run} colors={[B.ink, B.magenta, B.blue]} spread={150} />}

      <div className="relative grid h-[230px] place-items-center p-5 text-center">
        <div className="flex items-center gap-2" style={{ position: "absolute", top: 14, left: 14 }}>
          <MonoLabel style={{ color: B.ink }}>CHECK-IN DE HOJE</MonoLabel>
        </div>

        {!done ? (
          <div className="flex flex-col items-center">
            <Stamp size={44} strokeWidth={2.2} style={{ color: B.ink }} />
            <p className="mt-3 font-[family-name:var(--font-archivo)] text-xl font-black uppercase" style={{ color: B.ink }}>
              BATEU A META?
            </p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide" style={{ color: B.ink, opacity: 0.6 }}>
              carimbe e veja o green cair na banca
            </p>
          </div>
        ) : (
          <motion.div
            key={run}
            initial={{ scale: 2.4, rotate: -18, opacity: 0 }}
            animate={{ scale: [2.4, 0.9, 1.05, 1], rotate: [-18, -8, -6, -7], opacity: [0, 1, 1, 1] }}
            transition={STAMP_TWEEN}
            className="px-5 py-3"
            style={{ background: B.ink, border: `4px solid ${B.green}`, boxShadow: `6px 6px 0 rgba(8,22,30,0.35)` }}
          >
            <p className="font-[family-name:var(--font-archivo)] text-4xl font-black uppercase leading-none tracking-tight" style={{ color: B.green }}>
              DEU GREEN!
            </p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums" style={{ color: "#FFFFFF" }}>
              +{brl(animatedReward)} NA BANCA
            </p>
          </motion.div>
        )}
      </div>

      <div className="flex items-stretch gap-3 border-t p-4" style={{ borderTop: BORDER }}>
        <BrutalButton
          onClick={checkIn}
          bg={done ? B.white : B.magenta}
          fg={done ? B.ink : "#FFFFFF"}
          className="flex-1"
          style={{ minHeight: 52 }}
        >
          {done ? "PRÓXIMO DIA" : "CARIMBAR CHECK-IN"}
        </BrutalButton>
        <div className="flex items-center gap-2 px-3" style={{ background: B.white, border: BORDER }}>
          <Flame size={16} style={{ color: B.magenta }} fill={B.magenta} />
          <motion.span
            key={streak}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="font-[family-name:var(--font-mono)] text-lg font-bold tabular-nums"
            style={{ color: B.ink }}
          >
            {streak}
          </motion.span>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase" style={{ color: B.ink, opacity: 0.55 }}>
            STREAK
          </span>
        </div>
      </div>
    </Block>
  );
}
