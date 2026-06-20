"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, RotateCcw, Dumbbell } from "lucide-react";
import { ISO, SPRING, brl } from "./tokens";
import { Confetti } from "./confetti";
import { useCountUp } from "./use-count-up";

/**
 * WidgetGreen — o momento "DEU GREEN". Bater o check-in do treino aproxima do
 * payout: o badge 3D dá FLIP de "?" pra "GREEN", o valor pago hoje sobe em
 * count-up, confete + "O treino de hoje tá pago!".
 */
export function WidgetGreen() {
  const [green, setGreen] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const paidToday = 34; // valor que esse check-in "destrava" rumo ao payout
  const shown = useCountUp(green ? paidToday : 0, 700, confettiKey);

  function check() {
    if (green) return;
    setGreen(true);
    setConfettiKey((k) => k + 1);
  }
  function reset() {
    setGreen(false);
  }

  return (
    <div
      className="relative flex h-full flex-col items-center justify-between overflow-hidden rounded-[24px] p-6 text-center"
      style={{
        background: "#FFFFFF",
        border: `3px solid ${ISO.ink}`,
        boxShadow: `8px 9px 0 ${green ? ISO.greenDeep : ISO.purpleDeep}`,
      }}
    >
      {confettiKey > 0 && green && <Confetti key={confettiKey} count={42} />}

      {/* badge que dá FLIP */}
      <div className="mt-2" style={{ perspective: 800 }}>
        <motion.div
          animate={{ rotateY: green ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="relative"
          style={{ width: 120, height: 120, transformStyle: "preserve-3d" }}
        >
          {/* frente — "?" em repouso */}
          <div
            className="absolute inset-0 grid place-items-center rounded-3xl"
            style={{
              background: ISO.purple,
              border: `3px solid ${ISO.ink}`,
              boxShadow: `0 6px 0 ${ISO.purpleDeep}`,
              backfaceVisibility: "hidden",
            }}
          >
            <Dumbbell size={48} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          {/* verso — GREEN */}
          <div
            className="absolute inset-0 grid place-items-center rounded-3xl"
            style={{
              background: ISO.green,
              border: `3px solid ${ISO.ink}`,
              boxShadow: `0 6px 0 ${ISO.greenDeep}`,
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <CheckCircle2 size={52} color={ISO.ink} strokeWidth={2.6} />
          </div>
        </motion.div>
      </div>

      <div className="mt-4">
        <p
          className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight"
          style={{ color: green ? ISO.greenDeep : ISO.ink }}
        >
          {green ? "O treino de hoje tá pago!" : "Bora bater o ponto?"}
        </p>
        <AnimatePresence>
          {green && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm"
              style={{ color: ISO.inkSoft }}
            >
              Check-in registrado. Você destravou{" "}
              <span className="font-bold tabular-nums" style={{ color: ISO.greenDeep }}>
                {brl(shown, false)}
              </span>{" "}
              rumo ao seu payout. <strong style={{ color: ISO.greenDeep }}>Deu green</strong> no
              dia.
            </motion.p>
          )}
          {!green && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm"
              style={{ color: ISO.inkSoft }}
            >
              Registre o treino e veja a aposta dar green.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 w-full">
        {!green ? (
          <motion.button
            type="button"
            onClick={check}
            whileTap={{ scale: 0.95, y: 3 }}
            transition={SPRING}
            className="w-full rounded-2xl py-4 font-[family-name:var(--font-display)] text-lg font-bold uppercase"
            style={{
              minHeight: 56,
              background: ISO.green,
              color: ISO.ink,
              border: `3px solid ${ISO.ink}`,
              boxShadow: `0 6px 0 ${ISO.greenDeep}`,
            }}
          >
            Fazer check-in
          </motion.button>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold"
            style={{
              color: ISO.inkSoft,
              border: `2px solid ${ISO.baseDeep}`,
              minHeight: 44,
            }}
          >
            <RotateCcw size={14} /> Comemorar de novo
          </button>
        )}
      </div>
    </div>
  );
}
