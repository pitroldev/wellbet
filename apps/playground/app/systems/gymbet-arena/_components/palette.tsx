"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { G, SPRING } from "./tokens";

type Swatch = { name: string; hex: string; note: string; fg: string };

const SWATCHES: Swatch[] = [
  { name: "Magenta", hex: "#FF00FF", note: "Primária · ação, glow", fg: "#FFFFFF" },
  { name: "Roxo", hex: "#7A1BD6", note: "Profundidade · gradiente", fg: "#FFFFFF" },
  { name: "Indigo", hex: "#3215AD", note: "Base do gradiente", fg: "#FFFFFF" },
  { name: "Green", hex: "#41FFCA", note: "Vitória · jackpot", fg: "#0A2920" },
  { name: "Pink Pale", hex: "#FDC0FF", note: "Acento · destaque", fg: "#08161E" },
  { name: "Navy", hex: "#0B1226", note: "Ground da arena", fg: "#FFFFFF" },
  { name: "Navy Soft", hex: "#151D3A", note: "Cartões · superfície", fg: "#FFFFFF" },
  { name: "Ink", hex: "#08161E", note: "Quase-preto · sombra", fg: "#FFFFFF" },
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
      <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: G.fogMute }}>
        Paleta · toque pra copiar hex
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SWATCHES.map((s) => {
          const isCopied = copied === s.hex;
          const isMagenta = s.hex === "#FF00FF";
          return (
            <motion.button
              key={s.hex}
              type="button"
              onClick={() => copy(s.hex)}
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -3 }}
              transition={SPRING}
              className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl p-3 text-left"
              style={{
                background: s.hex,
                color: s.fg,
                boxShadow: isMagenta
                  ? "inset 0 0 0 1px rgba(255,255,255,.14), 0 12px 30px -12px rgba(255,0,255,.7)"
                  : "inset 0 0 0 1px rgba(255,255,255,.1)",
              }}
            >
              {/* estilhaço diagonal decorativo */}
              <span
                className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rotate-[18deg] opacity-15"
                style={{ background: s.fg }}
              />
              <span className="relative flex items-center justify-between">
                <span className="text-[13px] font-extrabold">{s.name}</span>
                <span className="opacity-70 transition-opacity group-hover:opacity-100">
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                </span>
              </span>
              <span className="relative">
                <span className="block font-[family-name:var(--font-mono)] text-[11px] tabular-nums opacity-95">
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
