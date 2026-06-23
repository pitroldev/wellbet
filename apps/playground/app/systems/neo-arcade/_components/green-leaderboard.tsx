"use client";

import { motion } from "framer-motion";
import { HudLabel, PixelCoin } from "./primitives";
import { PixelAvatar } from "./pixel-avatar";
import { brl, odds } from "./use-count-up";
import { USERS } from "@/lib/avatars";

/**
 * HIGH SCORES — "quem deu green hoje". An arcade leaderboard of people who hit
 * their bet, real avatars in pixel rings. Celebrates the top + your own line;
 * no wall of last places, no humiliation. The win column is in win-verde.
 */

type Row = {
  user: (typeof USERS)[number];
  meta: string;
  cotacao: number;
  ganho: number;
  me?: boolean;
};

const ROWS: Row[] = [
  { user: USERS[0], meta: "-8 kg em 4 meses", cotacao: 2.4, ganho: 480 },
  { user: USERS[10], meta: "5 km abaixo de 25min", cotacao: 1.9, ganho: 285 },
  { user: USERS[4], meta: "90 dias de treino", cotacao: 3.1, ganho: 248 },
  {
    user: USERS[8],
    meta: "-8 kg em 4 meses",
    cotacao: 2.4,
    ganho: 192,
    me: true,
  },
  { user: USERS[2], meta: "Maratona sub-4h", cotacao: 2.05, ganho: 164 },
];

const MEDAL = ["#FFD60A", "#C0C0C0", "#CD7F32"];

export function GreenLeaderboard({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className="bg-[#1C1140] p-4 sm:p-5"
      style={{ boxShadow: "0 0 0 3px #6D28D9, 8px 8px 0 0 #2E1065" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PixelCoin size={18} />
          <HudLabel className="text-[11px] text-[#FFD60A]">HIGH SCORES · DEU GREEN HOJE</HudLabel>
        </div>
        {!compact && <HudLabel className="text-[10px] text-[#9D8FC7]">13 JUN</HudLabel>}
      </div>

      <ul className="space-y-2">
        {ROWS.map((r, i) => {
          const ring = i < 3 ? MEDAL[i] : r.me ? "#22E06B" : "#6D28D9";
          return (
            <motion.li
              key={r.user.handle}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.05,
                type: "spring",
                stiffness: 400,
                damping: 26,
              }}
              className="flex items-center gap-3 px-2.5 py-2"
              style={{
                background: r.me ? "#0F3D2E" : "#120A24",
                boxShadow: r.me ? "0 0 0 2px #22E06B" : "0 0 0 2px #2E1065",
              }}
            >
              <span
                className="w-5 shrink-0 text-center font-[family-name:var(--font-hud)] text-sm"
                style={{ color: i < 3 ? MEDAL[i] : "#9D8FC7" }}
              >
                {i + 1}
              </span>
              <PixelAvatar
                src={r.user.avatar}
                alt={r.user.name}
                size={compact ? 36 : 40}
                ring={ring}
                glow={i === 0 ? "#FFD60A" : undefined}
              />
              <div className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 truncate font-[family-name:var(--font-body)] text-sm font-semibold text-[#EDE9FE]">
                  {r.user.name.split(" ")[0]}
                  {r.me && (
                    <span className="bg-[#22E06B] px-1.5 py-0.5 font-[family-name:var(--font-hud)] text-[8px] uppercase tracking-wider text-[#06140C]">
                      você
                    </span>
                  )}
                </span>
                <span className="block truncate font-[family-name:var(--font-body)] text-[11px] text-[#9D8FC7]">
                  {r.meta} · {odds(r.cotacao)}x
                </span>
              </div>
              <span className="shrink-0 text-right font-[family-name:var(--font-body)] text-sm font-bold tabular-nums text-[#22E06B]">
                +R$ {brl(r.ganho)}
              </span>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
