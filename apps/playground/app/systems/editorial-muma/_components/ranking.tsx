"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Crown, TrendingUp } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { useCountUp } from "@/app/components/use-count-up";
import { M, SPRING, brl0, FRAUNCES_DISPLAY } from "./tokens";

type Row = { name: string; avatar: string; handle: string; kg: number; me: boolean };

const BASE: Row[] = USERS.slice(0, 5).map((u, i) => ({
  name: u.name,
  avatar: u.avatar,
  handle: u.handle,
  kg: +(5.4 - i * 0.7).toFixed(1),
  me: i === 2,
}));

const POT = 1840;

export function Ranking() {
  // "torcer" pela própria posição: clicar sobe seu -kg e reordena
  const [rows, setRows] = useState<Row[]>(BASE);
  const [run, setRun] = useState(0);
  const pot = useCountUp(POT, 600, run);

  function cheer() {
    setRows((prev) => {
      const next = prev.map((r) => (r.me ? { ...r, kg: +(r.kg + 0.6).toFixed(1) } : r));
      return [...next].sort((a, b) => b.kg - a.kg);
    });
    setRun((r) => r + 1);
  }

  return (
    <div className="rounded-[6px] bg-white" style={{ boxShadow: `inset 0 0 0 1px ${M.hair}` }}>
      <div className="flex items-baseline justify-between border-b px-6 pb-4 pt-5" style={{ borderColor: M.hair }}>
        <span
          className="font-[family-name:var(--font-fraunces)] text-2xl leading-none"
          style={{ color: M.ink, fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 500 }}
        >
          A liga
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em]" style={{ color: M.inkMute }}>
          quem continua, conquista
        </span>
      </div>

      <ul className="px-6">
        {rows.map((r, i) => (
          <motion.li
            layout
            key={r.handle}
            transition={SPRING}
            className="flex items-center gap-4 border-b py-3.5 last:border-b-0"
            style={{ borderColor: M.hair }}
          >
            <span
              className="w-9 font-[family-name:var(--font-fraunces)] text-2xl leading-none tabular-nums"
              style={{
                color: i === 0 ? M.pink : M.inkMute,
                fontVariationSettings: FRAUNCES_DISPLAY,
                fontWeight: 600,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-2 ring-white" style={{ boxShadow: `0 0 0 1px ${M.hair}` }}>
              <Image src={r.avatar} alt={r.name} fill sizes="44px" className="object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className="flex items-center gap-1.5 truncate font-[family-name:var(--font-fraunces)] text-lg leading-none"
                style={{ color: M.ink, fontVariationSettings: '"SOFT" 40,"WONK" 1,"opsz" 80', fontWeight: r.me ? 600 : 400 }}
              >
                {r.me ? "Você" : r.name.split(" ")[0] + " " + r.name.split(" ")[1]}
                {i === 0 && <Crown size={15} style={{ color: M.pink }} fill={M.pink} />}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[11px]" style={{ color: M.inkMute }}>
                {r.handle}
              </span>
            </span>
            <span className="font-[family-name:var(--font-mono)] text-base tabular-nums" style={{ color: r.me ? M.indigo : M.greenDeep }}>
              -{r.kg.toFixed(1)}kg
            </span>
          </motion.li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t px-6 py-4" style={{ borderColor: M.hair, background: M.peri }}>
        <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em]" style={{ color: M.indigo }}>
          <TrendingUp size={14} /> Pote da liga
        </span>
        <motion.span
          key={Math.round(pot)}
          className="font-[family-name:var(--font-fraunces)] text-3xl leading-none tabular-nums"
          style={{ color: M.indigo, fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 600 }}
        >
          {brl0(pot)}
        </motion.span>
      </div>

      <div className="px-6 pb-5 pt-4">
        <motion.button
          type="button"
          onClick={cheer}
          whileTap={{ scale: 0.98 }}
          transition={SPRING}
          className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold"
          style={{ background: M.pink, color: M.ink }}
        >
          Registrar -0,6kg e subir
        </motion.button>
      </div>
    </div>
  );
}
