"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HudLabel, PixelShield, PixelFlame } from "./primitives";
import { useCountUp, odds, brl } from "./use-count-up";

/**
 * ACUMULADORA (= STREAK). Each training day is a "perna"/leg of the multiple;
 * confirming a check-in lights the next leg and the multiplier slams up on an
 * 8-bit board. One "shield" protects a missed day so the streak doesn't break
 * (and never humiliates). Live payout climbs with the multiplier.
 *
 * Snappy, stepped, dopaminergic — a fliperama odds board, not a slot.
 */

const STAKE = 80;
const LEGS = 7; // 7-leg multiple (a training week)
const STEP = 0.32; // each leg adds this to the multiplier

function multAt(legsDone: number) {
  return Number((1 + legsDone * STEP).toFixed(2));
}

export function Accumulator() {
  const [done, setDone] = useState(3); // legs already won this week
  const [shield, setShield] = useState(true);
  const [pulse, setPulse] = useState(0);

  const mult = multAt(done);
  const payout = STAKE * mult;
  const animMult = useCountUp(mult, 450);
  const animPayout = useCountUp(payout, 550);

  const allDone = done >= LEGS;

  const confirm = () => {
    if (allDone) return;
    setDone((d) => Math.min(LEGS, d + 1));
    setPulse((p) => p + 1);
  };

  const missDay = () => {
    if (allDone) return;
    if (shield) {
      // shield absorbs the miss — streak survives, no humiliation
      setShield(false);
      setPulse((p) => p + 1);
    } else {
      // streak breaks back to start (no red shaming, just resets)
      setDone(0);
      setPulse((p) => p + 1);
    }
  };

  const reset = () => {
    setDone(3);
    setShield(true);
    setPulse(0);
  };

  return (
    <div
      className="relative bg-[#1C1140] p-5 sm:p-6"
      style={{ boxShadow: "0 0 0 4px #6D28D9, 10px 10px 0 0 #2E1065" }}
    >
      <div className="flex items-center justify-between">
        <HudLabel className="text-[11px] text-[#9D8FC7]">ACUMULADORA · MÚLTIPLA</HudLabel>
        <span
          className="flex items-center gap-1.5 px-2.5 py-1.5"
          style={{
            background: "#120A24",
            boxShadow: shield ? "0 0 0 2px #22E06B" : "0 0 0 2px #4A3A7A",
          }}
        >
          <PixelShield size={16} fill={shield ? "#22E06B" : "#4A3A7A"} />
          <HudLabel className="text-[10px]" style={{ color: shield ? "#22E06B" : "#9D8FC7" }}>
            {shield ? "SHIELD ON" : "SHIELD USADO"}
          </HudLabel>
        </span>
      </div>

      {/* multiplier board (digit slam) */}
      <div
        className="relative mt-4 overflow-hidden bg-[#06140C] p-4 text-center"
        style={{ boxShadow: "inset 0 0 0 3px #047857" }}
      >
        <HudLabel className="block text-[9px] text-[#22E06B]">MULTIPLICADOR</HudLabel>
        <motion.div
          key={pulse}
          initial={{ scale: 1.25 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 14 }}
          className="font-[family-name:var(--font-body)] text-5xl font-extrabold tabular-nums leading-none text-[#22E06B]"
          style={{ textShadow: "0 0 18px rgba(34,224,107,0.45)" }}
        >
          {odds(animMult)}x
        </motion.div>
        <p className="mt-2 font-[family-name:var(--font-body)] text-sm text-[#EDE9FE]/80">
          R$ {brl(STAKE)} viram{" "}
          <span className="font-bold text-[#22E06B]">R$ {brl(animPayout)}</span>
        </p>
      </div>

      {/* legs lighting up */}
      <div className="mt-4">
        <HudLabel className="mb-2 block text-[10px] text-[#9D8FC7]">
          PERNAS DA MÚLTIPLA · {Math.min(done, LEGS)}/{LEGS} DIAS
        </HudLabel>
        <div className="flex gap-1.5">
          {Array.from({ length: LEGS }).map((_, i) => {
            const lit = i < done;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  className="flex h-11 w-full items-center justify-center"
                  style={{
                    background: lit ? "#0F3D2E" : "#120A24",
                    boxShadow: lit ? "0 0 0 2px #22E06B" : "0 0 0 2px #2E1065",
                  }}
                  animate={lit && i === done - 1 && pulse > 0 ? { scale: [1, 1.18, 1] } : {}}
                  transition={{ duration: 0.3, ease: "linear" }}
                >
                  {lit ? (
                    <PixelFlame size={20} fill="#22E06B" inner="#FFD60A" />
                  ) : (
                    <span className="font-[family-name:var(--font-hud)] text-[10px] text-[#4A3A7A]">
                      {i + 1}
                    </span>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* actions */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <motion.button
          onClick={confirm}
          disabled={allDone}
          whileTap={{ x: 3, y: 3 }}
          className="min-h-[48px] bg-[#22E06B] px-3 font-[family-name:var(--font-display)] text-[10px] text-[#06140C] disabled:opacity-40"
          style={{ boxShadow: "4px 4px 0 0 #047857" }}
        >
          ✓ TREINO FEITO
        </motion.button>
        <motion.button
          onClick={missDay}
          disabled={allDone}
          whileTap={{ x: 3, y: 3 }}
          className="min-h-[48px] bg-[#1C1140] px-3 font-[family-name:var(--font-hud)] text-[10px] uppercase tracking-[0.16em] text-[#9D8FC7] disabled:opacity-40"
          style={{ boxShadow: "0 0 0 2px #FF5470" }}
        >
          furei o dia
        </motion.button>
      </div>

      {/* contextual line */}
      <AnimatePresence mode="wait">
        <motion.p
          key={`${done}-${shield}-${allDone}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-4 text-center font-[family-name:var(--font-body)] text-sm leading-relaxed"
        >
          {allDone ? (
            <span className="text-[#22E06B]">
              Semana fechada! Múltipla de {LEGS} pernas <strong>deu green</strong> — R${" "}
              {brl(payout)} liberados.{" "}
              <button
                onClick={reset}
                className="inline-block py-1 font-[family-name:var(--font-hud)] text-[10px] uppercase tracking-[0.16em] text-[#9D8FC7] underline underline-offset-4 transition-colors hover:text-[#EDE9FE] active:text-[#EDE9FE]"
              >
                ↺ recomeçar
              </button>
            </span>
          ) : done === 0 ? (
            <span className="text-[#FF5470]">
              A múltipla quebrou e voltou ao início — sem drama, é só recomeçar a sequência amanhã.
            </span>
          ) : !shield ? (
            <span className="text-[#FFD60A]">
              O shield segurou o dia furado. A múltipla continua de pé — não fure de novo!
            </span>
          ) : (
            <span className="text-[#9D8FC7]">
              Cada treino acende uma perna e empurra o multiplicador. Falte um dia e o shield te
              cobre uma vez.
            </span>
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
