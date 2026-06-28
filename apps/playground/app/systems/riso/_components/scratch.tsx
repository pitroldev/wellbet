"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Gift, Scissors } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { R, brl0, seeded, halftone, PRINT_SHADOW, STAMP_SPRING } from "./tokens";

const COLS = 6;
const ROWS = 4;
const TOTAL = COLS * ROWS;
const PRIZE = 25;
const REVEAL_AT = 0.55; // % de blocos raspados que dispara o prêmio

/**
 * RASPADINHA de free bet — grade de blocos de "tinta" cobre o prêmio.
 * Cada toque/arrasto rasga um bloco; ao passar do limiar, revela R$25 + confete.
 * Determinístico (seeded por índice), render condicional simples + key.
 */
export function Scratch() {
  const [scratched, setScratched] = useState<boolean[]>(() => Array(TOTAL).fill(false));
  const [run, setRun] = useState(0);

  const count = scratched.filter(Boolean).length;
  const ratio = count / TOTAL;
  const revealed = ratio >= REVEAL_AT;
  const animated = useCountUp(revealed ? PRIZE : 0, 500, run);

  // ordem/rotação determinística de cada lasca
  const flecks = useMemo(
    () =>
      Array.from({ length: TOTAL }, (_, i) => ({
        rot: (seeded(i) - 0.5) * 26,
        dx: (seeded(i + 9) - 0.5) * 16,
        dy: (seeded(i + 4) - 0.5) * 16,
        ink: [R.magenta, R.blue, R.indigo, R.pink][i % 4],
      })),
    [],
  );

  function scratch(i: number) {
    setScratched((arr) => (arr[i] ? arr : arr.map((v, idx) => (idx === i ? true : v))));
  }

  function reset() {
    setScratched(Array(TOTAL).fill(false));
    setRun((r) => r + 1);
  }

  return (
    <div className="relative" style={{ filter: `drop-shadow(${PRINT_SHADOW})` }}>
      {revealed && <Confetti key={run} colors={[R.green, R.magenta, R.pink, R.blue]} spread={150} />}

      <div className="relative overflow-hidden p-5" style={{ background: R.paper, border: `2.5px solid ${R.ink}` }}>
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: R.ink }}>
            free bet · raspe a tinta
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: R.magenta }}>
            {count}/{TOTAL}
          </span>
        </div>

        {/* área de raspar */}
        <div className="relative mt-3 select-none" style={{ aspectRatio: "3 / 2", border: `2.5px solid ${R.ink}` }}>
          {/* PRÊMIO por baixo */}
          <div className="absolute inset-0 grid place-items-center" style={{ background: R.green }}>
            <span aria-hidden className="pointer-events-none absolute inset-0" style={{ ...halftone(R.ink, 7, 0.34), mixBlendMode: "multiply", opacity: 0.2 }} />
            <div className="relative text-center">
              <Gift size={26} strokeWidth={2.5} style={{ color: R.greenInk }} className="mx-auto" />
              <p className="mt-1 font-[family-name:var(--font-archivo)] text-3xl font-extrabold uppercase leading-none" style={{ color: R.greenInk }}>
                Free bet
              </p>
              <p className="font-[family-name:var(--font-mono)] text-2xl font-medium tabular-nums" style={{ color: R.greenInk }}>
                {brl0(animated)}
              </p>
            </div>
          </div>

          {/* CAMADA de tinta (blocos) — só renderiza os não raspados */}
          <div
            className="absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${COLS},1fr)`, gridTemplateRows: `repeat(${ROWS},1fr)` }}
          >
            {scratched.map((done, i) =>
              done ? (
                <span key={i} />
              ) : (
                <motion.button
                  key={i}
                  type="button"
                  aria-label="Raspar"
                  onMouseDown={() => scratch(i)}
                  onMouseEnter={(e) => {
                    if (e.buttons === 1) scratch(i);
                  }}
                  onTouchStart={() => scratch(i)}
                  whileTap={{ scale: 0.9 }}
                  className="relative overflow-hidden"
                  style={{
                    background: flecks[i].ink,
                    boxShadow: `inset 0 0 0 0.5px ${R.ink}`,
                    transform: `rotate(${flecks[i].rot}deg)`,
                    mixBlendMode: "multiply",
                  }}
                >
                  <span aria-hidden className="pointer-events-none absolute inset-0" style={{ ...halftone(R.ink, 5, 0.42), mixBlendMode: "multiply", opacity: 0.5 }} />
                </motion.button>
              ),
            )}
          </div>
        </div>

        <p className="mt-3 font-[family-name:var(--font-mono)] text-[11px]" style={{ color: R.ink }}>
          {revealed ? "DEU GREEN! free bet liberada — é sua." : "arraste pra raspar a tinta e revelar o prêmio."}
        </p>

        <div className="mt-3 flex gap-2">
          <motion.button
            type="button"
            onClick={reset}
            whileTap={{ scale: 0.97, x: 2, y: 2 }}
            transition={STAMP_SPRING}
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-extrabold uppercase"
            style={{ background: R.paperDeep, color: R.ink, border: `2.5px solid ${R.ink}`, boxShadow: "3px 3px 0 0 " + R.ink, fontFamily: "var(--font-archivo)" }}
          >
            <RotateCcw size={15} strokeWidth={3} /> Nova raspadinha
          </motion.button>
          <button
            type="button"
            onClick={() => setScratched(Array(TOTAL).fill(true))}
            className="grid place-items-center px-4"
            style={{ background: R.paper, color: R.ink, border: `2.5px solid ${R.ink}` }}
            aria-label="Revelar tudo"
            title="Revelar tudo"
          >
            <Scissors size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
