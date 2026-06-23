"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { cn } from "@/lib/utils";
import { EASE_SOFT, GLOW, HudLabel, mono, OddsChip, Panel } from "./primitives";
import { AvatarMedallion } from "./avatar-medallion";

/* ──────────────────────────────────────────────────────────────────────────
   GREEN BOARD — leaderboard "quem deu green hoje" (odds board ao vivo).
   Pessoas REAIS em medalhões glow. Celebra ganho, nunca humilha quem deu red.
   ────────────────────────────────────────────────────────────────────────── */

type Row = {
  user: (typeof USERS)[number];
  meta: string;
  odd: number;
  retorno: number;
  you?: boolean;
};

const ROWS: Row[] = [
  { user: USERS[1], meta: "Correr 100 km", odd: 2.85, retorno: 1140 },
  { user: USERS[8], meta: "Treinar 20x no mês", odd: 1.92, retorno: 768 },
  { user: USERS[11], meta: "Dormir 7h · 21 dias", odd: 3.1, retorno: 620 },
  { user: USERS[0], meta: "Perder 8 kg", odd: 2.4, retorno: 480, you: true },
  { user: USERS[6], meta: "Sem açúcar · 30 dias", odd: 2.2, retorno: 440 },
];

const brl = (n: number) => n.toLocaleString("pt-BR");

export function GreenBoard({ compact = false }: { compact?: boolean }) {
  return (
    <Panel className={cn("p-5", compact ? "" : "sm:p-6")}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#34F5A0]/12">
            <Trophy className="h-5 w-5" color={GLOW.green} />
          </div>
          <div>
            <HudLabel tone="green">Odds board · ao vivo</HudLabel>
            <h3 className="text-base font-semibold text-[#EDEAF7] sm:text-lg">
              Quem deu green hoje
            </h3>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#34F5A0]/30 bg-[#34F5A0]/10 px-2.5 py-1">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-[#34F5A0]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className={cn(mono(), "text-[10px] uppercase tracking-[0.16em] text-[#34F5A0]")}>
            312 greens
          </span>
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {ROWS.map((r, i) => (
          <motion.li
            key={r.user.handle}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, ease: EASE_SOFT }}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-3 py-2.5",
              r.you
                ? "border-[#34F5A0]/40 bg-[#34F5A0]/[0.08]"
                : "border-[rgba(139,131,168,0.16)] bg-[#0E0B1A]/50",
            )}
          >
            <span
              className={cn(mono(), "w-5 shrink-0 text-center text-sm font-bold text-[#8B83A8]")}
            >
              {i + 1}
            </span>
            <AvatarMedallion
              src={r.user.avatar}
              alt={r.user.name}
              size={40}
              tone={r.you ? "green" : "purple"}
              pulse={r.you}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-medium text-[#EDEAF7]">
                  {r.you ? "Você" : r.user.name}
                </span>
                {r.you && (
                  <span
                    className={cn(
                      mono(),
                      "rounded bg-[#34F5A0]/15 px-1.5 text-[9px] uppercase tracking-wide text-[#34F5A0]",
                    )}
                  >
                    você
                  </span>
                )}
              </div>
              <span className="truncate text-[11px] text-[#8B83A8]">{r.meta}</span>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <OddsChip tone="purple">{r.odd.toFixed(2)}×</OddsChip>
              <span
                className={cn(
                  mono(),
                  "flex items-center gap-0.5 text-[11px] font-semibold text-[#34F5A0]",
                )}
              >
                <TrendingUp className="h-3 w-3" />
                R$ {brl(r.retorno)}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>

      <p className="mt-3 text-[11px] leading-relaxed text-[#8B83A8]">
        Sem ranking de &ldquo;últimos&rdquo;: o board celebra quem deu green. Quem deu red recomeça
        amanhã — sem exposição, com um shield no bolso.
      </p>
    </Panel>
  );
}
