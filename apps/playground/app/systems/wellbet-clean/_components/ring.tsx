"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, TrendingDown } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { W, SPRING, brl } from "./tokens";
import { seeded } from "@/lib/brand";

const GOAL = 4; // -4kg na semana
const STEP_FALLBACK = 0.6;

export function EvolutionRing() {
  const [lost, setLost] = useState(1.2); // kg perdidos
  const [click, setClick] = useState(0);
  const pct = Math.min(1, lost / GOAL);
  const done = lost >= GOAL;
  const animatedKg = useCountUp(lost, 600, click);

  const R = 86;
  const CIRC = 2 * Math.PI * R;

  function weighIn() {
    const drop = STEP_FALLBACK + seeded(click) * 0.5; // determinístico
    setLost((v) => Math.min(GOAL, +(v + drop).toFixed(1)));
    setClick((c) => c + 1);
  }

  return (
    <div
      className="relative mx-auto flex max-w-md flex-col items-center overflow-hidden rounded-[32px] p-7"
      style={{ background: W.surface, boxShadow: "inset 0 0 0 1px " + W.line }}
    >
      {done && <Confetti key={click} colors={[W.green, W.blue, W.pink]} />}

      <div className="flex w-full items-center justify-between">
        <span className="text-sm font-bold" style={{ color: W.ink }}>
          Sua evolução semanal
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ background: W.greenWash, color: W.greenDeep }}
        >
          meta -{GOAL}kg
        </span>
      </div>

      <div className="relative mt-5 grid place-items-center">
        <svg width={208} height={208} viewBox="0 0 208 208" className="-rotate-90">
          <circle cx={104} cy={104} r={R} fill="none" stroke={W.surfaceMute} strokeWidth={16} />
          <motion.circle
            cx={104}
            cy={104}
            r={R}
            fill="none"
            stroke="url(#ringgrad)"
            strokeWidth={16}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            animate={{ strokeDashoffset: CIRC * (1 - pct) }}
            transition={SPRING}
          />
          <defs>
            <linearGradient id="ringgrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={W.blue} />
              <stop offset="100%" stopColor={W.green} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-[family-name:var(--font-mono)] text-[40px] font-medium leading-none tabular-nums" style={{ color: W.ink }}>
            −{animatedKg.toFixed(1)}
          </span>
          <span className="text-xs font-semibold" style={{ color: W.inkMute }}>
            kg · {Math.round(pct * 100)}% da meta
          </span>
        </div>
      </div>

      <motion.button
        type="button"
        onClick={weighIn}
        disabled={done}
        whileTap={{ scale: 0.96 }}
        transition={SPRING}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-extrabold disabled:opacity-60"
        style={{ background: done ? W.green : W.blue, color: done ? W.greenInk : "#fff" }}
      >
        {done ? (
          <>
            <TrendingDown size={16} /> Meta batida — free bet liberada
          </>
        ) : (
          <>
            <Scale size={16} /> Registrar pesagem
          </>
        )}
      </motion.button>

      <p className="mt-3 text-center text-xs" style={{ color: W.inkMute }}>
        Bateu a meta? A banca devolve <strong style={{ color: W.greenDeep }}>{brl(25)}</strong> de free bet.
      </p>
    </div>
  );
}
