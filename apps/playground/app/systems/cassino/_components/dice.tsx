"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Dice5, RotateCcw } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { N, SPRING, seeded, neonText } from "./tokens";

/**
 * Dado que rola. Toque -> rola (tween multi-keyframe: tumble) -> face final
 * determinística por contador de rolagem (seeded). Tira 7+ na soma de 2 dados
 * = deu green. Tumble usa tween (3+ keyframes); o assentamento final é simples.
 */

const PIPS: Record<number, [number, number][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

function rollFace(roll: number, die: number) {
  return (Math.floor(seeded(roll * 5.3 + die * 2.1 + 0.9) * 6) % 6) + 1;
}

function Die({ value, rolling, delay }: { value: number; rolling: boolean; delay: number }) {
  return (
    <motion.div
      className="relative grid place-items-center rounded-2xl"
      style={{
        width: 76,
        height: 76,
        background: "linear-gradient(150deg, #fff, #E8ECFF)",
        border: `2px solid ${N.line}`,
        boxShadow: `0 8px 18px rgba(0,0,0,.5), 0 0 18px ${N.blue}44`,
      }}
      animate={
        rolling
          ? { rotate: [0, 220, 540, 360], scale: [1, 1.12, 0.96, 1] }
          : { rotate: 0, scale: 1 }
      }
      transition={
        rolling
          ? { duration: 0.9, ease: [0.3, 0.7, 0.4, 1], times: [0, 0.4, 0.8, 1], delay }
          : { duration: 0 }
      }
    >
      <div className="grid h-[58px] w-[58px] grid-cols-3 grid-rows-3 gap-0.5 p-1">
        {Array.from({ length: 9 }).map((_, idx) => {
          const r = Math.floor(idx / 3);
          const c = idx % 3;
          const on = PIPS[value].some(([pr, pc]) => pr === r && pc === c);
          return (
            <span key={idx} className="grid place-items-center">
              {on && <span className="block h-2.5 w-2.5 rounded-full" style={{ background: N.groundDeep }} />}
            </span>
          );
        })}
      </div>
    </motion.div>
  );
}

export function DiceRoll() {
  const [roll, setRoll] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [done, setDone] = useState(false);

  const d1 = rollFace(roll, 0);
  const d2 = rollFace(roll, 1);
  const sum = d1 + d2;
  const green = done && sum >= 7;

  function go() {
    if (rolling) return;
    setRoll((r) => r + 1);
    setRolling(true);
    setDone(false);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{
        background: `radial-gradient(circle at 50% 20%, ${N.blue}22, transparent 60%), linear-gradient(180deg, ${N.panel}, ${N.ground})`,
        border: `1px solid ${N.line}`,
      }}
    >
      {green && <Confetti key={roll} colors={[N.green, N.blue, "#fff"]} spread={150} />}

      <div className="flex items-center justify-between">
        <span
          className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-[0.18em]"
          style={{ color: N.blue, textShadow: neonText(N.blue) }}
        >
          Dados · 7 ou mais
        </span>
        <span className="font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: N.white }}>
          {done ? `soma ${sum}` : "—"}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <Die value={d1} rolling={rolling} delay={0} />
        <Die value={d2} rolling={rolling} delay={0.08} />
      </div>

      <div
        className="mt-6 flex min-h-[44px] items-center justify-center rounded-2xl px-4 py-2 text-center"
        style={{ background: N.groundDeep, border: `1px solid ${N.line}` }}
      >
        {!done && !rolling ? (
          <span className="text-sm" style={{ color: N.mute }}>
            Role os dados — soma 7+ dá green.
          </span>
        ) : rolling ? (
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-[0.2em]"
            style={{ color: N.mute }}
          >
            rolando…
          </motion.span>
        ) : green ? (
          <span
            className="font-[family-name:var(--font-archivo)] text-lg font-black uppercase tracking-tight"
            style={{ color: N.green, textShadow: neonText(N.green) }}
          >
            Deu green! {d1} + {d2} = {sum}
          </span>
        ) : (
          <span className="text-base font-bold" style={{ color: N.pink }}>
            {d1} + {d2} = {sum}. Faltou — de novo!
          </span>
        )}
      </div>

      <motion.button
        type="button"
        onClick={go}
        disabled={rolling}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold disabled:opacity-60"
        style={{ background: N.blue, color: "#fff", boxShadow: `0 0 20px ${N.blue}77` }}
      >
        {done ? <RotateCcw size={18} /> : <Dice5 size={18} />}
        {done ? "Rolar de novo" : "Rolar os dados"}
      </motion.button>

      {/* sentinela: quando a animação dos dados termina, marca done */}
      <RollSettle rolling={rolling} onSettle={() => { setRolling(false); setDone(true); }} />
    </div>
  );
}

/** Espera a duração da rolagem e marca o resultado (sem setInterval em render). */
function RollSettle({ rolling, onSettle }: { rolling: boolean; onSettle: () => void }) {
  return (
    <motion.span
      key={rolling ? "rolling" : "idle"}
      className="sr-only"
      initial={{ opacity: 0 }}
      animate={{ opacity: rolling ? 1 : 0 }}
      transition={{ duration: rolling ? 1.0 : 0 }}
      onAnimationComplete={() => {
        if (rolling) onSettle();
      }}
    />
  );
}
