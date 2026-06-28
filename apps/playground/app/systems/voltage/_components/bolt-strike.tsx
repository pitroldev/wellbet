"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame, CalendarCheck } from "lucide-react";
import { useCountUp } from "@/app/components/use-count-up";
import { BoltMark } from "@/app/components/wellbet-logo";
import { V, GRAD, SPRING, SPRING_POP, brl } from "./tokens";
import { Sparks } from "./spark";

/**
 * Check-in → "deu green" como um RAIO QUE ATINGE (bolt-strike reveal).
 * O raio desce, atinge o card, e o resultado verde se revela com faíscas.
 */
export function BoltStrike() {
  const [done, setDone] = useState(false);
  const [streak, setStreak] = useState(6);
  const [run, setRun] = useState(0);
  const reward = 8.5;
  const animatedReward = useCountUp(done ? reward : 0, 600, run);

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
        className="relative h-[230px] w-full overflow-hidden rounded-[28px] p-6"
        style={{
          background: done ? "rgba(65,255,202,.10)" : V.glass,
          backdropFilter: "blur(16px)",
          boxShadow: done ? `inset 0 0 0 1.5px rgba(65,255,202,.5)` : `inset 0 0 0 1px ${V.glassLine}`,
        }}
      >
        {/* o raio que atinge */}
        <AnimatePresence>
          {done && (
            <motion.div
              key={"strike" + run}
              className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2"
              initial={{ y: -120, opacity: 0, scale: 0.7 }}
              animate={{ y: [-120, 10, 0], opacity: [0, 1, 1], scale: [0.7, 1.1, 1] }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1], times: [0, 0.6, 1] }}
            >
              <BoltMark style={{ width: 64, height: "auto", color: V.green, filter: "drop-shadow(0 0 16px rgba(65,255,202,.9))" }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* flash do impacto */}
        <AnimatePresence>
          {done && (
            <motion.div
              key={"flash" + run}
              className="pointer-events-none absolute inset-0 z-10"
              style={{ background: GRAD.halo }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0.2] }}
              transition={{ duration: 0.6, times: [0, 0.4, 1] }}
            />
          )}
        </AnimatePresence>

        {done && <Sparks key={"bs" + run} count={14} spread={150} />}

        <AnimatePresence mode="wait" initial={false}>
          {!done ? (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-center text-center"
            >
              <span className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: V.inkFaint }}>
                Check-in de hoje
              </span>
              <CalendarCheck size={40} style={{ color: V.blueSoft }} className="mt-3" />
              <p className="mt-3 text-lg font-extrabold" style={{ color: V.white }}>
                Bateu a meta de hoje?
              </p>
              <p className="text-sm" style={{ color: V.inkFaint }}>
                Confirme e o raio atinge a banca.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="green"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-20 flex h-full flex-col items-center justify-center text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...SPRING_POP, delay: 0.3 }}
                className="grid h-14 w-14 place-items-center rounded-full"
                style={{ background: GRAD.bolt }}
              >
                <Check size={30} strokeWidth={3.4} style={{ color: V.greenInk }} />
              </motion.span>
              <p
                className="mt-3 bg-clip-text text-2xl font-extrabold text-transparent"
                style={{ backgroundImage: GRAD.flow }}
              >
                DEU GREEN!
              </p>
              <p className="font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: V.green }}>
                +{brl(animatedReward)} na banca
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <motion.button
          type="button"
          onClick={checkIn}
          whileTap={{ scale: 0.97 }}
          transition={SPRING}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold"
          style={
            done
              ? { background: "rgba(255,255,255,.10)", color: V.white, boxShadow: `inset 0 0 0 1px ${V.glassLine}` }
              : { background: GRAD.bolt, color: V.greenInk }
          }
        >
          {done ? "Próximo dia" : "Fazer check-in"}
        </motion.button>
        <div className="flex items-center gap-1.5 rounded-2xl px-3.5 py-2.5" style={{ background: "rgba(255,255,255,.06)", boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}>
          <Flame size={16} style={{ color: V.green }} fill={V.green} />
          <AnimatePresence mode="popLayout">
            <motion.span
              key={streak}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={SPRING}
              className="font-[family-name:var(--font-mono)] text-base font-bold tabular-nums"
              style={{ color: V.white }}
            >
              {streak}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs font-semibold" style={{ color: V.inkFaint }}>
            streak
          </span>
        </div>
      </div>
    </div>
  );
}
