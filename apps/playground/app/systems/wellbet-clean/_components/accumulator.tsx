"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { useCountUp } from "@/app/components/use-count-up";
import { W, SPRING, brl, odd } from "./tokens";

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const LEG_ODD = 1.18; // cada perna multiplica
const STAKE = 20;

export function Accumulator() {
  const [legs, setLegs] = useState<boolean[]>([true, true, false, false, false, false, false]);
  const count = legs.filter(Boolean).length;
  const totalOdd = Math.pow(LEG_ODD, count);
  const payout = STAKE * totalOdd;
  const animated = useCountUp(payout, 500, count);

  function toggle(i: number) {
    setLegs((arr) => arr.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div
      className="rounded-[28px] p-5 sm:p-6"
      style={{ background: W.surface, boxShadow: "inset 0 0 0 1px " + W.line }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold" style={{ color: W.ink }}>
          Acumuladora · cada dia = uma perna
        </span>
        <span className="font-[family-name:var(--font-mono)] text-sm font-semibold tabular-nums" style={{ color: W.blue }}>
          {odd(totalOdd)}×
        </span>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {DAYS.map((d, i) => {
          const on = legs[i];
          return (
            <button key={d} type="button" onClick={() => toggle(i)} className="flex flex-col items-center gap-1.5">
              <motion.span
                whileTap={{ scale: 0.86 }}
                animate={{
                  background: on ? W.green : W.surfaceMute,
                  scale: on ? 1 : 0.96,
                }}
                transition={SPRING}
                className="grid h-10 w-full place-items-center rounded-xl"
              >
                {on ? (
                  <Check size={16} strokeWidth={3} style={{ color: W.greenInk }} />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: W.inkMute }} />
                )}
              </motion.span>
              <span className="text-[10px] font-bold" style={{ color: on ? W.greenDeep : W.inkMute }}>
                {d}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-end justify-between rounded-2xl px-4 py-3" style={{ background: W.blueWash }}>
        <div>
          <span className="text-xs font-bold" style={{ color: W.blueDeep }}>
            {count}/7 pernas · stake {brl(STAKE)}
          </span>
          <p className="text-[11px]" style={{ color: W.inkMute }}>
            Complete a semana pra fechar o acumulado.
          </p>
        </div>
        <motion.span
          key={Math.round(animated)}
          className="font-[family-name:var(--font-mono)] text-2xl font-medium tabular-nums"
          style={{ color: W.greenDeep }}
        >
          {brl(animated)}
        </motion.span>
      </div>

      <button
        type="button"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-extrabold"
        style={{ background: count === 7 ? W.green : W.ink, color: count === 7 ? W.greenInk : "#fff" }}
      >
        <Zap size={16} fill={count === 7 ? W.greenInk : "#fff"} />
        {count === 7 ? "Acumulada completa — resgatar" : `Fechar acumulada (${count}/7)`}
      </button>
    </div>
  );
}
