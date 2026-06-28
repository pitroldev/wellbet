"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { J, SPRING } from "./tokens";

type Swatch = { name: string; hex: string; note: string; fg: string };

const SWATCHES: Swatch[] = [
  { name: "Magenta", hex: "#FF00FF", note: "Protagonista · neon", fg: "#FFFFFF" },
  { name: "Pink", hex: "#FF80E1", note: "Protagonista · brilho", fg: "#220C82" },
  { name: "Green", hex: "#41FFCA", note: "WIN · jackpot", fg: "#0A2920" },
  { name: "Indigo Deep", hex: "#220C82", note: "Chão do palácio", fg: "#FFFFFF" },
  { name: "Indigo", hex: "#3215AD", note: "Painéis · molduras", fg: "#FFFFFF" },
  { name: "Blue Soft", hex: "#656FFF", note: "Acento · luzes", fg: "#FFFFFF" },
  { name: "Gold", hex: "#FFD45E", note: "Só moedas/ornamento", fg: "#220C82" },
  { name: "White", hex: "#FFFFFF", note: "Texto sobre escuro", fg: "#220C82" },
];

export function Palette() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      /* ambiente sem clipboard — ainda mostramos o feedback */
    }
    setCopied(hex);
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1200);
  }

  return (
    <div>
      <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.16em]" style={{ color: J.textMute }}>
        Paleta · toque pra copiar
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SWATCHES.map((s) => {
          const isCopied = copied === s.hex;
          return (
            <motion.button
              key={s.hex}
              type="button"
              onClick={() => copy(s.hex)}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
              className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl p-3 text-left"
              style={{
                background: s.hex,
                color: s.fg,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18), 0 8px 24px -12px rgba(0,0,0,.6)",
              }}
            >
              <span className="flex items-center justify-between">
                <span className="text-[13px] font-extrabold">{s.name}</span>
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
