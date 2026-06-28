"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, TrendingUp, Zap } from "lucide-react";
import Image from "next/image";
import { USERS } from "@/lib/avatars";
import { BoltMark } from "@/app/components/wellbet-logo";
import { V, GRAD, SPRING, brl } from "./tokens";
import { Sparks } from "./spark";

type Row = { name: string; handle: string; avatar: string; volts: number; me: boolean };

const BASE: Row[] = USERS.slice(0, 6).map((u, i) => ({
  ...u,
  volts: 920 - i * 70,
  me: i === 3,
}));

/** Ranking/leaderboard de voltagem — toque "+1 carga" e seu elo sobe (re-sort animado). */
export function Leaderboard() {
  const [rows, setRows] = useState<Row[]>(BASE);
  const [run, setRun] = useState(0);

  function charge() {
    setRun((r) => r + 1);
    setRows((prev) => {
      const next = prev.map((r) => (r.me ? { ...r, volts: r.volts + 95 } : r));
      return [...next].sort((a, b) => b.volts - a.volts);
    });
  }

  const myRank = rows.findIndex((r) => r.me) + 1;

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 sm:p-6"
      style={{ background: V.glass, backdropFilter: "blur(16px)", boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
    >
      {run > 0 && myRank === 1 && <Sparks key={"lb" + run} count={14} spread={150} />}

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-extrabold" style={{ color: V.white }}>
          <Crown size={16} style={{ color: V.green }} /> Ranking de voltagem
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: V.inkFaint }}>
          sua liga
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {rows.map((u, i) => (
            <motion.div
              key={u.handle}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5"
              style={{
                background: u.me ? "rgba(65,255,202,.10)" : "rgba(255,255,255,.05)",
                boxShadow: u.me ? "inset 0 0 0 1.5px rgba(65,255,202,.5)" : `inset 0 0 0 1px ${V.glassLine}`,
              }}
            >
              <span
                className="w-5 text-center font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums"
                style={{ color: i === 0 ? V.green : V.inkFaint }}
              >
                {i + 1}
              </span>
              <span className="relative h-9 w-9 overflow-hidden rounded-full" style={{ boxShadow: `0 0 0 2px ${V.ground}, 0 0 0 3px ${i === 0 ? V.green : "rgba(255,255,255,.18)"}` }}>
                <Image src={u.avatar} alt={u.name} fill sizes="36px" className="object-cover" />
              </span>
              <span className="flex-1 truncate text-sm font-bold" style={{ color: V.white }}>
                {u.me ? "Você" : u.name.split(" ")[0]}
              </span>
              <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-sm font-semibold tabular-nums" style={{ color: V.green }}>
                <BoltMark style={{ height: 12, width: "auto", color: V.green }} />
                {u.volts}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,.06)" }}>
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold" style={{ color: V.green }}>
          <TrendingUp size={14} /> Pote da liga
        </span>
        <span className="font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums" style={{ color: V.green }}>
          {brl(1840)}
        </span>
      </div>

      <motion.button
        type="button"
        onClick={charge}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold"
        style={{ background: GRAD.bolt, color: V.greenInk }}
      >
        <Zap size={16} fill={V.greenInk} /> +1 carga · subir no ranking
      </motion.button>
    </div>
  );
}
