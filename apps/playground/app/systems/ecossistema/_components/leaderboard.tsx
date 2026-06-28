"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, TrendingUp, ChevronRight } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/lib/avatars";
import { useProduct } from "./product-context";
import { E, GLASS, GLASS_STRONG, GLASS_LINE, SPRING, brl, seeded } from "./tokens";

type Row = { name: string; avatar: string; handle: string; score: number; me: boolean };

function buildBoard(product: "well" | "gym"): Row[] {
  const base = USERS.slice(0, 6).map((u, i) => {
    const s =
      product === "well"
        ? +(5.4 - i * 0.6 + seeded(i + 1) * 0.2).toFixed(1) // kg perdidos
        : Math.round(42 - i * 4 + seeded(i + 50) * 3); // dias de streak
    return { name: u.name, avatar: u.avatar, handle: u.handle, score: s, me: false };
  });
  // "Você" entra na posição 3
  base[2] = { ...base[2], name: "Você", me: true };
  return base.sort((a, b) => b.score - a.score);
}

export function Leaderboard() {
  const { product, theme } = useProduct();
  const [board] = useState<Record<string, Row[]>>({
    well: buildBoard("well"),
    gym: buildBoard("gym"),
  });
  const rows = board[product];
  const pote = product === "well" ? 4820 : 6240;
  const unit = product === "well" ? "kg" : "dias";

  return (
    <div className="rounded-[28px] p-5 sm:p-6" style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crown size={18} style={{ color: E.pink }} fill={E.pink} />
          <span className="text-sm font-extrabold text-white">Ranking · sua liga</span>
        </div>
        <span className="text-[11px] font-semibold" style={{ color: E.peri, opacity: 0.7 }}>
          {product === "well" ? "quem mais evoluiu" : "maior streak"}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {rows.map((u, i) => (
            <motion.div
              key={`${product}-${u.handle}`}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ ...SPRING, delay: i * 0.03 }}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5"
              style={{
                background: u.me ? theme.accent : GLASS_STRONG,
                boxShadow: u.me ? `0 10px 26px -12px ${theme.accent}` : "inset 0 0 0 1px " + GLASS_LINE,
              }}
            >
              <span
                className="w-6 text-center font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums"
                style={{ color: i === 0 ? E.pink : u.me ? "#fff" : "rgba(204,209,255,.8)" }}
              >
                {i + 1}
              </span>
              <span className="relative h-9 w-9 overflow-hidden rounded-full ring-2" style={{ "--tw-ring-color": u.me ? "#fff" : E.field } as React.CSSProperties}>
                <Image src={u.avatar} alt={u.name} fill sizes="36px" className="object-cover" />
              </span>
              <span className="flex-1 truncate text-sm font-bold" style={{ color: u.me ? "#fff" : "#fff" }}>
                {u.me ? "Você" : u.name.split(" ")[0]}
                {i === 0 && <Crown size={12} className="ml-1 inline" style={{ color: E.pink }} />}
              </span>
              <span
                className="font-[family-name:var(--font-mono)] text-sm font-semibold tabular-nums"
                style={{ color: u.me ? "#fff" : E.green }}
              >
                {product === "well" ? `-${u.score.toFixed(1)}${unit}` : `${u.score} ${unit}`}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: "rgba(8,4,40,.4)" }}>
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold" style={{ color: E.green }}>
          <TrendingUp size={14} /> Pote da liga
        </span>
        <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums" style={{ color: E.green }}>
          {brl(pote)} <ChevronRight size={15} style={{ color: E.peri }} />
        </span>
      </div>
    </div>
  );
}
