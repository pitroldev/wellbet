"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Crown } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { R, brl0, halftoneBar, halftone, PRINT_SHADOW, STAMP_SPRING } from "./tokens";

const RANGE: ("Semana" | "Mês")[] = ["Semana", "Mês"];
const INKS = [R.magenta, R.blue, R.indigo, R.pink, R.green, R.magenta];

/** Leaderboard impresso — USERS, barras de meio-tom proporcionais aos -kg. */
export function Leaderboard() {
  const [range, setRange] = useState(0);

  const board = USERS.slice(0, 6).map((u, i) => {
    const base = range === 0 ? 4.2 : 9.6;
    const kg = +(base - i * (range === 0 ? 0.5 : 1.1)).toFixed(1);
    return { ...u, kg, me: i === 2 };
  });
  const maxKg = board[0].kg;

  return (
    <div
      className="relative overflow-hidden p-5"
      style={{ background: R.paper, border: `2.5px solid ${R.ink}`, boxShadow: PRINT_SHADOW }}
    >
      <span aria-hidden className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full" style={{ ...halftone(R.pink, 7, 0.4), mixBlendMode: "multiply", opacity: 0.5 }} />

      <div className="relative flex items-center justify-between">
        <p className="inline-flex items-center gap-2 font-[family-name:var(--font-archivo)] text-xl font-extrabold uppercase" style={{ color: R.ink }}>
          <Trophy size={18} strokeWidth={2.5} style={{ color: R.magenta }} /> Ranking impresso
        </p>
        <div className="flex p-0.5" style={{ border: `2.5px solid ${R.ink}`, background: R.paperDeep }}>
          {RANGE.map((o, idx) => (
            <button
              key={o}
              type="button"
              onClick={() => setRange(idx)}
              className="relative px-2.5 py-1 text-[11px] font-extrabold uppercase"
              style={{ color: range === idx ? "#fff" : R.ink, fontFamily: "var(--font-archivo)" }}
            >
              {range === idx && (
                <motion.span layoutId="riso-lb-seg" transition={STAMP_SPRING} className="absolute inset-0 -z-10" style={{ background: R.blue }} />
              )}
              {o}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4 space-y-2">
        {board.map((u, i) => (
          <div
            key={u.handle}
            className="flex items-center gap-3 px-3 py-2"
            style={{
              background: u.me ? R.green : R.paper,
              border: `2.5px solid ${R.ink}`,
              boxShadow: u.me ? "3px 3px 0 0 " + R.ink : "none",
            }}
          >
            <span className="w-5 text-center font-[family-name:var(--font-archivo)] text-lg font-extrabold tabular-nums" style={{ color: R.ink }}>
              {i + 1}
            </span>
            <span className="relative h-9 w-9 shrink-0 overflow-hidden" style={{ border: `2px solid ${R.ink}`, background: R.paperDeep }}>
              <Image src={u.avatar} alt={u.name} fill sizes="36px" className="object-cover" style={{ filter: "grayscale(1) contrast(1.1)", mixBlendMode: "multiply" }} />
            </span>
            <div className="min-w-0 flex-1">
              <span className="flex items-center gap-1 truncate text-sm font-extrabold uppercase" style={{ color: R.ink, fontFamily: "var(--font-archivo)" }}>
                {i === 0 && <Crown size={13} fill={R.magenta} style={{ color: R.magenta }} />}
                {u.me ? "Você" : u.name.split(" ")[0]}
              </span>
              {/* barra de halftone proporcional */}
              <span className="relative mt-1 block h-2.5 w-full" style={{ border: `1.5px solid ${R.ink}` }}>
                <span aria-hidden className="absolute inset-y-0 left-0" style={{ width: `${(u.kg / maxKg) * 100}%`, ...halftoneBar(u.me ? R.ink : INKS[i], 5) }} />
              </span>
            </div>
            <span className="font-[family-name:var(--font-mono)] text-sm font-semibold tabular-nums" style={{ color: R.ink }}>
              -{u.kg}kg
            </span>
          </div>
        ))}
      </div>

      <div className="relative mt-3 flex items-center justify-between px-4 py-3" style={{ background: R.ink, color: R.paper }}>
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider">pote da liga</span>
        <span className="font-[family-name:var(--font-mono)] text-xl font-medium tabular-nums" style={{ color: R.green }}>
          {brl0(range === 0 ? 1840 : 6420)}
        </span>
      </div>
    </div>
  );
}
