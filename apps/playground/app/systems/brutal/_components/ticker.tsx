"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { B, BORDER } from "./tokens";
import { odd } from "./tokens";

type Quote = { label: string; o: number; up: boolean };
const QUOTES: Quote[] = [
  { label: "PERDER 2KG/7D", o: 1.85, up: true },
  { label: "TREINAR 5×", o: 1.6, up: false },
  { label: "10K PASSOS", o: 1.42, up: true },
  { label: "SEM AÇÚCAR 7D", o: 2.1, up: true },
  { label: "DORMIR 8H", o: 1.55, up: false },
  { label: "CORRER 5KM", o: 1.9, up: true },
  { label: "JEJUM 16H", o: 1.72, up: false },
  { label: "STREAK 30D", o: 3.4, up: true },
];

function Row({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden}>
      {QUOTES.map((q, i) => (
        <span key={q.label + i} className="flex items-center gap-2 px-5 py-2.5">
          <span className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-wide text-white">
            {q.label}
          </span>
          <span
            className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums"
            style={{ color: q.up ? B.green : B.pink }}
          >
            {q.up ? <TrendingUp size={13} strokeWidth={3} /> : <TrendingDown size={13} strokeWidth={3} />}
            {odd(q.o)}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-white/30">/</span>
        </span>
      ))}
    </div>
  );
}

/** Ticker/marquee de cotações em loop infinito. Duas cópias para loop contínuo. */
export function Ticker() {
  return (
    <div className="overflow-hidden" style={{ background: B.ink, border: BORDER }}>
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <Row />
        <Row ariaHidden />
      </motion.div>
    </div>
  );
}
