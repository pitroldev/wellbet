"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap } from "lucide-react";
import { useCountUp } from "@/app/components/use-count-up";
import { B, BORDER, TWEEN, brl, odd } from "./tokens";
import { Block, BrutalButton, MonoLabel } from "./primitives";

const DAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
const BLOCKS = [B.magenta, B.green, B.blue, B.pink, B.indigo, B.green, B.magenta];
const ON_FG = ["#FFFFFF", B.ink, "#FFFFFF", B.ink, "#FFFFFF", B.ink, "#FFFFFF"];
const LEG_ODD = 1.18;
const STAKE = 20;

/** Acumuladora em grid de 7 blocos CHAPADOS — cada dia = uma perna. */
export function Accumulator() {
  const [legs, setLegs] = useState<boolean[]>([true, true, false, false, false, false, false]);
  const count = legs.filter(Boolean).length;
  const totalOdd = Math.pow(LEG_ODD, count);
  const payout = STAKE * totalOdd;
  const animated = useCountUp(payout, 460, count);

  function toggle(i: number) {
    setLegs((arr) => arr.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <Block bg={B.white} className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3" style={{ background: B.ink }}>
        <span className="font-[family-name:var(--font-archivo)] text-base font-black uppercase tracking-wide text-white">
          ACUMULADORA
        </span>
        <span className="font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums" style={{ color: B.green }}>
          {odd(totalOdd)}×
        </span>
      </div>

      <div className="p-4">
        <MonoLabel style={{ color: B.ink, opacity: 0.6 }}>CADA DIA = 1 PERNA · TOQUE PRA MARCAR</MonoLabel>

        <div className="mt-3 grid grid-cols-7 gap-2">
          {DAYS.map((d, i) => {
            const on = legs[i];
            return (
              <button key={d} type="button" onClick={() => toggle(i)} className="flex flex-col items-center gap-1.5">
                <motion.span
                  initial={false}
                  animate={{ y: on ? 0 : 0 }}
                  whileTap={{ scale: 0.9 }}
                  transition={TWEEN}
                  className="grid aspect-square w-full place-items-center"
                  style={{
                    background: on ? BLOCKS[i] : B.white,
                    color: on ? ON_FG[i] : B.ink,
                    border: BORDER,
                    boxShadow: on ? `3px 3px 0 ${B.ink}` : "none",
                  }}
                >
                  {on ? (
                    <Check size={18} strokeWidth={3.5} />
                  ) : (
                    <span className="h-1.5 w-1.5" style={{ background: B.ink, opacity: 0.3 }} />
                  )}
                </motion.span>
                <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold" style={{ color: on ? B.ink : B.ink, opacity: on ? 1 : 0.45 }}>
                  {d}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-end justify-between px-4 py-3" style={{ background: B.green, border: BORDER }}>
          <div>
            <span className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-wide" style={{ color: B.ink }}>
              {count}/7 PERNAS · {brl(STAKE)}
            </span>
            <p className="font-[family-name:var(--font-mono)] text-[10px] uppercase" style={{ color: B.ink, opacity: 0.6 }}>
              feche a semana pra resgatar
            </p>
          </div>
          <motion.span
            key={Math.round(animated)}
            className="font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums"
            style={{ color: B.ink }}
          >
            {brl(animated)}
          </motion.span>
        </div>

        <BrutalButton
          bg={count === 7 ? B.green : B.ink}
          fg={count === 7 ? B.ink : "#FFFFFF"}
          className="mt-3 w-full"
          style={{ minHeight: 52 }}
        >
          <Zap size={16} fill="currentColor" />
          {count === 7 ? "ACUMULADA COMPLETA — RESGATAR" : `FECHAR ACUMULADA (${count}/7)`}
        </BrutalButton>
      </div>
    </Block>
  );
}
