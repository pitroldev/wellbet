"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { N, SPRING, neonText } from "./tokens";

type Swatch = { name: string; hex: string; note: string; fg: string; glow?: boolean };

const SWATCHES: Swatch[] = [
  { name: "Feltro", hex: "#41FFCA", note: "Mesa · dinheiro · green", fg: "#0A2920" },
  { name: "Neon Magenta", hex: "#FF00FF", note: "Letreiro · jackpot", fg: "#FFFFFF", glow: true },
  { name: "Neon Blue", hex: "#3945FF", note: "Brilho · ação", fg: "#FFFFFF", glow: true },
  { name: "Neon Pink", hex: "#FF80E1", note: "Acento lúdico", fg: "#08161E", glow: true },
  { name: "Indigo", hex: "#3215AD", note: "Profundidade do salão", fg: "#FFFFFF" },
  { name: "Salão", hex: "#0B1226", note: "Ground · navy", fg: "#9BA6CF" },
  { name: "Ink", hex: "#08161E", note: "O mais fundo", fg: "#9BA6CF" },
  { name: "Ouro", hex: "#F4C95D", note: "SÓ moeda · jackpot", fg: "#08161E" },
];

export function Palette() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      /* clipboard pode falhar — feedback visual mesmo assim */
    }
    setCopied(hex);
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1200);
  }

  return (
    <div>
      <h3
        className="mb-4 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.24em]"
        style={{ color: N.mute }}
      >
        Paleta · toque pra copiar o hex
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SWATCHES.map((s) => {
          const isCopied = copied === s.hex;
          return (
            <motion.button
              key={s.hex}
              type="button"
              onClick={() => copy(s.hex)}
              whileTap={{ scale: 0.96 }}
              whileHover={{ y: -2 }}
              transition={SPRING}
              className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl p-3 text-left"
              style={{
                background: s.hex,
                color: s.fg,
                boxShadow: s.glow
                  ? `inset 0 0 0 1px rgba(255,255,255,.14), 0 0 22px ${s.hex}66`
                  : "inset 0 0 0 1px rgba(255,255,255,.10)",
              }}
            >
              <span className="flex items-center justify-between">
                <span
                  className="text-[13px] font-extrabold"
                  style={s.glow ? { textShadow: neonText(s.fg) } : undefined}
                >
                  {s.name}
                </span>
                <span className="opacity-70 transition-opacity group-hover:opacity-100">
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                </span>
              </span>
              <span>
                <span className="block font-[family-name:var(--font-mono)] text-[11px] tabular-nums opacity-90">
                  {isCopied ? "copiado!" : s.hex}
                </span>
                <span className="mt-0.5 block text-[10px] leading-tight opacity-75">{s.note}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
