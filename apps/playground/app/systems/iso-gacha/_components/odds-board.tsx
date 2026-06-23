"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { ISO, SPRING, brl, odd } from "./tokens";
import { IsoAvatarCircle } from "./iso-avatar";

type Row = {
  user: (typeof USERS)[number];
  goal: string;
  cot: number;
  payout: number;
};

const ROWS: Row[] = [
  { user: USERS[8], goal: "Perdeu 8 kg", cot: 2.4, payout: 480 },
  { user: USERS[1], goal: "100 km no mês", cot: 1.85, payout: 370 },
  { user: USERS[11], goal: "Maratona em 5 meses", cot: 3.1, payout: 930 },
  { user: USERS[6], goal: "5x/semana · 8 semanas", cot: 2.2, payout: 440 },
  { user: USERS[13], goal: "Largou o açúcar 60 dias", cot: 2.75, payout: 550 },
];

/**
 * OddsBoard — leaderboard "QUEM DEU GREEN HOJE" com avatares reais em anel
 * isométrico. Cara de painel de cotações de sportsbook: meta, cotação fechada
 * e payout pago. Verde = ganho real.
 */
export function OddsBoard() {
  return (
    <div
      className="overflow-hidden rounded-[24px]"
      style={{
        background: "#FFFFFF",
        border: `3px solid ${ISO.ink}`,
        boxShadow: `8px 9px 0 ${ISO.greenDeep}`,
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ background: ISO.green }}
      >
        <span
          className="font-[family-name:var(--font-display)] text-base font-bold"
          style={{ color: ISO.ink }}
        >
          Quem deu green hoje
        </span>
        <span
          className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest"
          style={{ color: ISO.ink }}
        >
          <TrendingUp size={14} strokeWidth={2.8} /> ao vivo
        </span>
      </div>

      <ul>
        {ROWS.map((r, i) => (
          <motion.li
            key={r.user.handle}
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: i * 0.06 }}
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderTop: i === 0 ? "none" : `2px solid ${ISO.base}` }}
          >
            <IsoAvatarCircle
              src={r.user.avatar}
              alt={r.user.name}
              size={48}
              ring={i === 0 ? ISO.yellow : ISO.purple}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold leading-tight" style={{ color: ISO.ink }}>
                {r.user.name}
              </p>
              <p className="truncate text-xs" style={{ color: ISO.inkSoft }}>
                {r.goal}
              </p>
            </div>
            <span
              className="shrink-0 rounded-lg px-2 py-1 font-[family-name:var(--font-display)] text-xs font-bold tabular-nums"
              style={{
                background: ISO.base,
                color: ISO.purple,
                border: `2px solid ${ISO.baseDeep}`,
              }}
            >
              {odd(r.cot)}
            </span>
            <span
              className="shrink-0 rounded-lg px-2.5 py-1 font-[family-name:var(--font-display)] text-sm font-bold tabular-nums"
              style={{
                background: ISO.green,
                color: ISO.ink,
                border: `2px solid ${ISO.ink}`,
              }}
            >
              {brl(r.payout, false)}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
