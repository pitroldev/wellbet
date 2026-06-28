"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Crown, Heart, Trophy, Coins } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { useCountUp } from "@/app/components/use-count-up";
import { G, SPRING, SPRING_POP, GRAD, brl0 } from "./tokens";

type Row = { name: string; handle: string; avatar: string; streak: number; me: boolean; cheers: number };

const BASE: Omit<Row, "cheers">[] = [
  { ...USERS[6], streak: 28, me: false }, // Gustavo
  { ...USERS[2], streak: 26, me: false }, // Rafael
  { ...USERS[0], streak: 21, me: false }, // Bruno
  { ...USERS[4], streak: 17, me: true }, // Você (Lucas)
  { ...USERS[5], streak: 14, me: false }, // Felipe
  { ...USERS[3], streak: 11, me: false }, // Thiago
].map((r) => ({ ...r }));

export function Ranking() {
  const [rows, setRows] = useState<Row[]>(() => BASE.map((r) => ({ ...r, cheers: 0 })));
  const [pot, setPot] = useState(4200);

  // ordena por streak desc (estável o suficiente para a demo)
  const sorted = useMemo(() => [...rows].sort((a, b) => b.streak - a.streak), [rows]);
  const max = sorted[0]?.streak || 1;
  const animatedPot = useCountUp(pot, 600, pot);

  function cheer(handle: string) {
    setRows((rs) =>
      rs.map((r) => {
        if (r.handle !== handle) return r;
        // torcer dá +1 dia de impulso ao atleta e engorda o pote
        return { ...r, streak: r.streak + 1, cheers: r.cheers + 1 };
      }),
    );
    setPot((p) => p + 50);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 sm:p-6"
      style={{ background: G.navySoft, boxShadow: "inset 0 0 0 1px " + G.navyLine }}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-extrabold" style={{ color: G.white }}>
          <Trophy size={16} style={{ color: G.magenta }} /> Ranking semanal
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em]" style={{ color: G.fogMute }}>
          Liga Magenta
        </span>
      </div>
      <p className="mt-1 text-xs" style={{ color: G.fogMute }}>
        Toque pra torcer — o atleta sobe e o pote engorda.
      </p>

      <div className="mt-4 space-y-2">
        {sorted.map((u, i) => {
          const w = Math.max(14, (u.streak / max) * 100);
          return (
            <motion.button
              key={u.handle}
              type="button"
              layout
              onClick={() => cheer(u.handle)}
              whileTap={{ scale: 0.98 }}
              transition={SPRING}
              className="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-3 py-2.5 text-left"
              style={{
                background: u.me ? "rgba(255,0,255,.14)" : G.ink,
                boxShadow: u.me ? "inset 0 0 0 1.5px " + G.magenta : "inset 0 0 0 1px " + G.navyLine,
              }}
            >
              {/* barra de streak ao fundo */}
              <motion.span
                className="pointer-events-none absolute inset-y-0 left-0 -z-0 rounded-2xl opacity-30"
                style={{ background: u.me ? GRAD.gymbet : "linear-gradient(90deg,#7A1BD6,#3215AD)" }}
                animate={{ width: `${w}%` }}
                transition={SPRING}
              />
              <span
                className="relative z-10 w-6 text-center font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums"
                style={{ color: i === 0 ? G.green : u.me ? G.pinkPale : G.fogMute }}
              >
                {i + 1}
              </span>
              <span className="relative z-10 inline-block h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2" style={{ boxShadow: "0 0 0 2px " + (u.me ? G.magenta : G.navyLine) }}>
                <Image src={u.avatar} alt={u.name} fill sizes="36px" className="object-cover" />
              </span>
              <span className="relative z-10 flex-1 truncate">
                <span className="flex items-center gap-1.5 text-sm font-bold" style={{ color: u.me ? G.white : G.fog }}>
                  {i === 0 && <Crown size={13} style={{ color: G.green }} fill={G.green} />}
                  {u.me ? "Você" : u.name.split(" ")[0]}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: G.fogMute }}>
                  {u.handle}
                </span>
              </span>
              <span className="relative z-10 flex items-center gap-2">
                <motion.span
                  key={u.streak}
                  initial={{ scale: 0.7, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={SPRING_POP}
                  className="font-[family-name:var(--font-mono)] text-base font-bold tabular-nums"
                  style={{ color: u.me ? G.magenta : G.white }}
                >
                  {u.streak}
                </motion.span>
                <span className="text-[10px] font-semibold" style={{ color: G.fogMute }}>
                  dias
                </span>
                <span
                  className="ml-1 grid h-8 w-8 place-items-center rounded-full"
                  style={{ background: u.cheers > 0 ? G.magentaWash : "transparent" }}
                >
                  <Heart size={15} style={{ color: G.magenta }} fill={u.cheers > 0 ? G.magenta : "transparent"} />
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* pote / jackpot no rodapé com count-up */}
      <div
        className="mt-4 flex items-center justify-between rounded-2xl px-4 py-3.5"
        style={{ background: GRAD.jackpot, color: G.greenInk }}
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide">
          <Coins size={15} /> Pote da liga
        </span>
        <span className="font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums">
          {brl0(animatedPot)}
        </span>
      </div>
    </div>
  );
}
