"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, RotateCcw } from "lucide-react";
import { BoltMark } from "@/app/components/wellbet-logo";
import { useCountUp } from "@/app/components/use-count-up";
import { V, GRAD, SPRING, SPRING_POP, brl } from "./tokens";
import { Sparks } from "./spark";

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const PER_DAY = 5; // R$ por elo carregado
const BONUS = 30; // bônus de cadeia completa

/** Streak como CADEIA DE RAIOS carregados — toque um elo pra carregá-lo. */
export function StreakChain() {
  const [links, setLinks] = useState<boolean[]>([true, true, true, false, false, false, false]);
  const [run, setRun] = useState(0);
  const count = links.filter(Boolean).length;
  const full = count === DAYS.length;
  const total = count * PER_DAY + (full ? BONUS : 0);
  const animated = useCountUp(total, 500, count + run);

  function toggle(i: number) {
    setLinks((arr) => {
      const next = arr.map((v, idx) => (idx === i ? !v : v));
      if (next.every(Boolean)) setRun((r) => r + 1);
      return next;
    });
  }

  function reset() {
    setLinks([false, false, false, false, false, false, false]);
    setRun((r) => r + 1);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 sm:p-6"
      style={{ background: V.glass, backdropFilter: "blur(16px)", boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
    >
      {full && <Sparks key={"sc" + run} count={16} spread={160} />}

      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold" style={{ color: V.white }}>
          Streak · cadeia de raios
        </span>
        <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums" style={{ color: V.green }}>
          <Flame size={14} fill={V.green} /> {count}
        </span>
      </div>

      {/* a cadeia */}
      <div className="mt-5 flex items-center justify-between">
        {DAYS.map((d, i) => {
          const on = links[i];
          const prevOn = i > 0 && links[i - 1];
          return (
            <div key={d} className="flex flex-1 items-center">
              {/* conector */}
              {i > 0 && (
                <div className="mx-0.5 h-0.5 flex-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.10)" }}>
                  <motion.div
                    className="h-full"
                    style={{ background: GRAD.flow }}
                    animate={{ width: on && prevOn ? "100%" : "0%" }}
                    transition={SPRING}
                  />
                </div>
              )}
              <button type="button" onClick={() => toggle(i)} className="flex flex-col items-center gap-1.5">
                <motion.span
                  whileTap={{ scale: 0.82 }}
                  animate={{ scale: on ? 1 : 0.9 }}
                  transition={on ? SPRING_POP : SPRING}
                  className="grid h-10 w-10 place-items-center rounded-full"
                  style={{
                    background: on ? "transparent" : "rgba(255,255,255,.06)",
                    backgroundImage: on ? GRAD.bolt : undefined,
                    boxShadow: on ? "0 0 14px -2px rgba(65,255,202,.7)" : `inset 0 0 0 1px ${V.glassLine}`,
                  }}
                >
                  <BoltMark style={{ width: 15, height: "auto", color: on ? V.greenInk : V.inkFaint }} />
                </motion.span>
                <span className="text-[10px] font-bold" style={{ color: on ? V.green : V.inkFaint }}>
                  {d}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-end justify-between rounded-2xl px-4 py-3" style={{ background: "rgba(65,255,202,.07)", boxShadow: `inset 0 0 0 1px rgba(65,255,202,.25)` }}>
        <div>
          <span className="text-xs font-bold" style={{ color: V.green }}>
            {count}/7 elos carregados
          </span>
          <p className="text-[11px]" style={{ color: V.inkFaint }}>
            {full ? `Cadeia completa · +${brl(BONUS)} de bônus` : "Feche a semana pra liberar o bônus."}
          </p>
        </div>
        <motion.span
          key={Math.round(animated)}
          className="font-[family-name:var(--font-mono)] text-2xl font-medium tabular-nums"
          style={{ color: V.green }}
        >
          {brl(animated)}
        </motion.span>
      </div>

      <button
        type="button"
        onClick={reset}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold"
        style={{ background: "rgba(255,255,255,.08)", color: V.inkSoft, boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
      >
        <RotateCcw size={15} /> Recomeçar a cadeia
      </button>
    </div>
  );
}
