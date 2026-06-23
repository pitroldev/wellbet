"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { FOIL, HOLO, brl, odd } from "./tokens";
import { AvatarHolo, GlassLabel } from "./primitives";

/**
 * ODDS BOARD / LEADERBOARD — quem deu green hoje, em passes holográficos.
 * Tabs filtram a visão (cotação alta / maior payout). Avatares REAIS com anel
 * iridescente. Celebra o topo; sem mural de quem deu red.
 */

type Row = {
  user: (typeof USERS)[number];
  goal: string;
  oddVal: number;
  payout: number;
};

const ROWS: Row[] = [
  { user: USERS[4], goal: "Correr 100 km no mês", oddVal: 3.1, payout: 620 },
  { user: USERS[8], goal: "Treinar 5x/semana · 90d", oddVal: 2.8, payout: 504 },
  { user: USERS[1], goal: "Perder 6 kg em 3 meses", oddVal: 2.4, payout: 432 },
  { user: USERS[11], goal: "Sem açúcar · 30 dias", oddVal: 1.95, payout: 351 },
  { user: USERS[6], goal: "Ler 12 livros no ano", oddVal: 1.7, payout: 289 },
  { user: USERS[14], goal: "Meditar 10 min/dia", oddVal: 1.5, payout: 225 },
];

type Sort = "payout" | "odd";

export function Leaderboard() {
  const [sort, setSort] = useState<Sort>("payout");
  const rows = [...ROWS].sort((a, b) =>
    sort === "payout" ? b.payout - a.payout : b.oddVal - a.oddVal,
  );

  return (
    <div className="rounded-2xl border border-white/10 p-4 backdrop-blur-md sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-[#34F5A0]" />
          <GlassLabel className="text-[#F2F2FA]">deu green hoje</GlassLabel>
        </div>
        <div className="flex gap-1.5">
          {(
            [
              { id: "payout", label: "maior payout" },
              { id: "odd", label: "cotação alta" },
            ] as { id: Sort; label: string }[]
          ).map((t) => {
            const on = sort === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSort(t.id)}
                className="min-h-[36px] rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors"
                style={{
                  color: on ? "#0A0A12" : HOLO.inkSoft,
                  background: on ? FOIL : "rgba(255,255,255,0.04)",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        {rows.map((r, i) => {
          const top = i === 0;
          return (
            <motion.div
              key={r.user.handle}
              layout
              transition={{ type: "spring", stiffness: 480, damping: 32 }}
              className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
              style={{
                borderColor: top ? "rgba(52, 245, 160,0.4)" : "rgba(255,255,255,0.08)",
                background: top ? "rgba(52, 245, 160,0.07)" : "rgba(255,255,255,0.02)",
              }}
            >
              <span
                className="w-5 shrink-0 text-center font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums"
                style={{ color: top ? HOLO.green : HOLO.inkFaint }}
              >
                {i + 1}
              </span>
              <AvatarHolo src={r.user.avatar} alt={r.user.name} size={38} ring={top} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-[#F2F2FA]">
                  {r.user.name}
                </span>
                <span className="block truncate text-[11px] text-[#A6A6C8]">{r.goal}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end">
                <span className="font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums text-[#34F5A0]">
                  R$ {brl(r.payout)}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[10px] text-[#22D3EE]">
                  {odd(r.oddVal)}x
                </span>
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* sua linha (você) */}
      <div
        className="mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5"
        style={{
          background: "rgba(168, 85, 247,0.10)",
          boxShadow: "inset 0 0 0 1px rgba(168, 85, 247,0.35)",
        }}
      >
        <span className="w-5 shrink-0 text-center font-[family-name:var(--font-mono)] text-sm font-bold text-[#A855F7]">
          12
        </span>
        <AvatarHolo src={USERS[2].avatar} alt="Você" size={38} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-[#F2F2FA]">Você</span>
          <span className="block text-[11px] text-[#A6A6C8]">Perder 8 kg em 4 meses</span>
        </span>
        <span className="font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums text-[#A855F7]">
          em curso
        </span>
      </div>
    </div>
  );
}
