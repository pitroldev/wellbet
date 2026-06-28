"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Trophy, Crown } from "lucide-react";
import { USERS } from "@/lib/avatars";
import { B, BORDER, BORDER_THIN, TWEEN } from "./tokens";
import { Block, MonoLabel } from "./primitives";

type Row = { name: string; handle: string; avatar: string; kg: number };

const BASE: Row[] = USERS.slice(0, 7).map((u, i) => ({
  name: u.name,
  handle: u.handle,
  avatar: u.avatar,
  kg: +(4.6 - i * 0.45).toFixed(1),
}));

const ME_INDEX = 3;

export function Leaderboard() {
  // toque numa linha pra "torcer" — apenas micro-feedback (sobe a posição visual destacada)
  const [poke, setPoke] = useState<number | null>(null);

  return (
    <Block bg={B.white} className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3" style={{ background: B.ink }}>
        <span className="inline-flex items-center gap-2 font-[family-name:var(--font-archivo)] text-base font-black uppercase tracking-wide text-white">
          <Trophy size={16} style={{ color: B.green }} /> RANKING // SUA LIGA
        </span>
        <MonoLabel style={{ color: B.green }}>-KG</MonoLabel>
      </div>

      <div>
        {/* header da tabela */}
        <div className="flex items-center gap-3 px-3 py-2" style={{ borderBottom: BORDER }}>
          <span className="w-6 text-center font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase" style={{ color: B.ink, opacity: 0.5 }}>
            #
          </span>
          <span className="flex-1 font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase tracking-wider" style={{ color: B.ink, opacity: 0.5 }}>
            ATLETA
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[10px] font-bold uppercase" style={{ color: B.ink, opacity: 0.5 }}>
            EVOLUÇÃO
          </span>
        </div>

        {BASE.map((u, i) => {
          const me = i === ME_INDEX;
          const poked = poke === i;
          return (
            <motion.button
              key={u.handle}
              type="button"
              onClick={() => setPoke(i)}
              initial={false}
              animate={{ x: poked ? 4 : 0 }}
              transition={TWEEN}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
              style={{
                // sua linha INVERTIDA: preto <-> cor
                background: me ? B.magenta : B.white,
                color: me ? "#FFFFFF" : B.ink,
                borderBottom: i < BASE.length - 1 ? BORDER_THIN : "none",
                minHeight: 52,
              }}
            >
              <span className="w-6 text-center font-[family-name:var(--font-mono)] text-base font-bold tabular-nums">
                {i + 1}
              </span>
              <span
                className="relative h-9 w-9 shrink-0 overflow-hidden"
                style={{ border: `2px solid ${me ? "#FFFFFF" : B.ink}`, background: B.paper }}
              >
                <Image src={u.avatar} alt={u.name} fill sizes="36px" className="object-cover" style={{ filter: "grayscale(1) contrast(1.1)" }} />
              </span>
              <span className="flex-1 truncate">
                <span className="block font-[family-name:var(--font-archivo)] text-sm font-black uppercase tracking-wide">
                  {me ? "VOCÊ" : u.name.split(" ")[0]}
                  {i === 0 && <Crown size={13} className="-mt-0.5 ml-1 inline" style={{ color: me ? "#FFFFFF" : B.magenta }} />}
                </span>
                <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-wide opacity-70">
                  {u.handle}
                </span>
              </span>
              <span className="font-[family-name:var(--font-mono)] text-lg font-bold tabular-nums">
                -{u.kg.toFixed(1)}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-between px-4 py-3" style={{ background: B.green, borderTop: BORDER }}>
        <MonoLabel style={{ color: B.ink }}>POTE DA LIGA</MonoLabel>
        <span className="font-[family-name:var(--font-mono)] text-xl font-bold tabular-nums" style={{ color: B.ink }}>
          R$ 1.840,00
        </span>
      </div>
    </Block>
  );
}
