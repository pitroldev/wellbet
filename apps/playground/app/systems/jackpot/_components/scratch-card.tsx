"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gem, RotateCcw, Sparkles } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { J, SPRING, GLOW_GREEN, brl0, seeded } from "./tokens";

/**
 * ScratchCard — raspadinha. Camada de blocos cobre o prêmio; raspar (passar o
 * dedo / clicar / arrastar) faz cada bloco sumir. Quando ~70% revelado, o
 * prêmio "estoura". Prêmio DETERMINÍSTICO por rodada (seeded), sem random em
 * render. A grade que some é só opacity/scale por bloco (2 valores -> spring ok).
 */

const COLS = 5;
const ROWS = 4;
const TOTAL = COLS * ROWS;
const REVEAL_AT = 0.62; // % de blocos raspados pra revelar

const PRIZES = [120, 50, 777, 25, 300]; // valores possíveis em fichas/R$

export function ScratchCard() {
  const [round, setRound] = useState(0);
  const [scratched, setScratched] = useState<boolean[]>(() => Array(TOTAL).fill(false));

  const prize = PRIZES[round % PRIZES.length];
  const count = scratched.filter(Boolean).length;
  const ratio = count / TOTAL;
  const revealed = ratio >= REVEAL_AT;
  const animatedPrize = useCountUp(revealed ? prize : 0, 700, round);

  function scratch(i: number) {
    setScratched((arr) => (arr[i] ? arr : arr.map((v, idx) => (idx === i ? true : v))));
  }

  function reset() {
    setRound((r) => r + 1);
    setScratched(Array(TOTAL).fill(false));
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{ background: "linear-gradient(160deg,#3215AD,#220C82)", boxShadow: "inset 0 0 0 1px " + J.line }}
    >
      {revealed && <Confetti key={round} count={28} colors={[J.green, J.gold, J.pink]} spread={180} />}

      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold" style={{ color: J.text }}>
          Raspadinha premiada
        </span>
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: J.surfaceUp, color: J.gold }}>
          <Gem size={12} /> raspe pra ganhar
        </span>
      </div>

      {/* área da raspadinha */}
      <div
        className="relative mt-4 overflow-hidden rounded-2xl"
        style={{ boxShadow: revealed ? GLOW_GREEN : "inset 0 0 0 1px " + J.line }}
      >
        {/* prêmio por baixo */}
        <div
          className="flex h-[180px] flex-col items-center justify-center gap-1"
          style={{ background: "radial-gradient(circle at 50% 40%, rgba(65,255,202,.22), rgba(10,4,48,.9))" }}
        >
          <Sparkles size={26} color={J.gold} style={{ filter: "drop-shadow(0 0 8px rgba(255,212,94,.7))" }} />
          <span
            className="font-[family-name:var(--font-archivo)] text-3xl font-black uppercase leading-none"
            style={{ color: J.green, textShadow: "0 0 18px rgba(65,255,202,.6)" }}
          >
            {revealed ? "Ganhou!" : "?????"}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-xl font-medium tabular-nums" style={{ color: J.gold }}>
            {revealed ? `+ ${brl0(animatedPrize)}` : "+ R$ ???"}
          </span>
        </div>

        {/* camada raspável */}
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS},1fr)`, gridTemplateRows: `repeat(${ROWS},1fr)` }}>
          {Array(TOTAL)
            .fill(0)
            .map((_, i) => {
              const gone = scratched[i] || revealed;
              const tint = seeded(i + round * 13) > 0.5 ? J.indigo : J.indigoSoft;
              return (
                <motion.button
                  key={i}
                  type="button"
                  onMouseEnter={() => scratch(i)}
                  onPointerDown={() => scratch(i)}
                  onFocus={() => scratch(i)}
                  className="relative"
                  style={{ background: tint, boxShadow: "inset 0 0 0 0.5px rgba(255,255,255,.08)", touchAction: "none" }}
                  animate={{ opacity: gone ? 0 : 1, scale: gone ? 0.4 : 1 }}
                  transition={SPRING}
                  aria-label="Raspar"
                >
                  {!gone && (
                    <span
                      className="pointer-events-none absolute inset-0 grid place-items-center text-[10px] font-bold"
                      style={{ color: "rgba(255,255,255,.35)" }}
                    >
                      ✦
                    </span>
                  )}
                </motion.button>
              );
            })}
        </div>
      </div>

      <p className="mt-3 text-center text-xs" style={{ color: J.textMute }}>
        {revealed ? "Prêmio liberado — caiu na banca!" : `Raspe os quadradinhos · ${Math.round(ratio * 100)}%`}
      </p>

      <motion.button
        type="button"
        onClick={reset}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-extrabold"
        style={{ background: revealed ? J.green : J.surfaceUp, color: revealed ? J.greenInk : J.text }}
      >
        <RotateCcw size={15} /> Nova raspadinha
      </motion.button>
    </div>
  );
}
