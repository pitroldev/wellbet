"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Check } from "lucide-react";
import { R, odd, halftoneBar, halftone, PRINT_SHADOW, STAMP_SPRING } from "./tokens";

type Row = { goal: string; sub: string; odd: number; trend: number; fill: number };
const ROWS: Row[] = [
  { goal: "Perder 2kg", sub: "7 dias", odd: 1.85, trend: -3, fill: 0.62 },
  { goal: "Perder 4kg", sub: "14 dias", odd: 2.45, trend: 5, fill: 0.84 },
  { goal: "Treinar 5×", sub: "semana", odd: 1.6, trend: -2, fill: 0.5 },
  { goal: "10k passos/dia", sub: "5 dias", odd: 2.1, trend: 8, fill: 0.74 },
  { goal: "Sem açúcar", sub: "7 dias", odd: 1.95, trend: 0, fill: 0.66 },
];
const INKS = [R.magenta, R.blue, R.indigo, R.pink, R.green];

/** Odds board impresso — tabela de tom com barras de halftone por linha. */
export function OddsBoard() {
  const [picked, setPicked] = useState<number | null>(1);

  return (
    <div
      className="relative overflow-hidden p-5"
      style={{ background: R.paper, border: `2.5px solid ${R.ink}`, boxShadow: PRINT_SHADOW }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0" style={{ ...halftone(R.indigo, 10, 0.26), mixBlendMode: "multiply", opacity: 0.25 }} />

      <div className="relative flex items-baseline justify-between">
        <p className="font-[family-name:var(--font-archivo)] text-xl font-extrabold uppercase" style={{ color: R.ink }}>
          Quadro de odds
        </p>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider" style={{ color: R.ink }}>
          tiragem · semana 26
        </span>
      </div>

      <div className="relative mt-4 space-y-1.5">
        {ROWS.map((r, i) => {
          const on = picked === i;
          return (
            <motion.button
              key={r.goal}
              type="button"
              onClick={() => setPicked((p) => (p === i ? null : i))}
              whileTap={{ scale: 0.99 }}
              transition={STAMP_SPRING}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
              style={{
                background: on ? R.ink : "transparent",
                color: on ? R.paper : R.ink,
                border: `2.5px solid ${R.ink}`,
              }}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center" style={{ background: on ? R.green : "transparent", border: `2px solid ${on ? R.green : R.ink}` }}>
                {on && <Check size={14} strokeWidth={3.5} style={{ color: R.greenInk }} />}
              </span>

              <span className="w-24 shrink-0 sm:w-32">
                <span className="block truncate text-sm font-extrabold uppercase leading-none" style={{ fontFamily: "var(--font-archivo)" }}>
                  {r.goal}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[10px]" style={{ opacity: 0.75 }}>
                  {r.sub}
                </span>
              </span>

              {/* barra de halftone (densidade = "favoritismo") */}
              <span className="relative h-4 flex-1" style={{ border: `1.5px solid ${on ? R.paper : R.ink}` }}>
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0"
                  style={{ width: `${r.fill * 100}%`, ...halftoneBar(on ? R.green : INKS[i], 6) }}
                />
              </span>

              <span className="inline-flex w-12 shrink-0 items-center justify-end gap-0.5 font-[family-name:var(--font-mono)] text-[10px] tabular-nums" style={{ color: r.trend < 0 ? (on ? R.green : R.indigo) : on ? R.pink : R.magenta }}>
                {r.trend < 0 ? <TrendingDown size={11} /> : r.trend > 0 ? <TrendingUp size={11} /> : null}
                {r.trend > 0 ? "+" : ""}
                {r.trend}%
              </span>

              <span className="w-12 shrink-0 text-right font-[family-name:var(--font-mono)] text-base font-semibold tabular-nums">
                {odd(r.odd)}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="relative mt-3 font-[family-name:var(--font-mono)] text-[11px]" style={{ color: R.ink }}>
        {picked === null ? "toque numa linha pra montar o cupom." : `selecionado: ${ROWS[picked].goal} · odd ${odd(ROWS[picked].odd)}`}
      </p>
    </div>
  );
}
