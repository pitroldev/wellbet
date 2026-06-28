"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { V, GRAD, SPRING } from "./tokens";

type Swatch = { name: string; hex: string; note: string; fg: string; grad?: string };

const SWATCHES: Swatch[] = [
  { name: "Bolt", hex: "#41FFCA→#3945FF", note: "Gradiente herói", fg: "#08161E", grad: GRAD.bolt },
  { name: "Green", hex: "#41FFCA", note: "Green · faísca", fg: "#0A2920" },
  { name: "Blue", hex: "#3945FF", note: "Carga · ação", fg: "#FFFFFF" },
  { name: "Blue Soft", hex: "#656FFF", note: "Glow · destaque", fg: "#FFFFFF" },
  { name: "Ground", hex: "#08161E", note: "Fundo quase-preto", fg: "#EAF6FF" },
  { name: "Glass", hex: "rgba(255,255,255,.07)", note: "Vidro translúcido", fg: "#EAF6FF" },
];

export function Palette() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      /* clipboard pode falhar — segue o feedback visual */
    }
    setCopied(hex);
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1200);
  }

  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: V.inkFaint }}>
        Paleta · toque pra copiar
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {SWATCHES.map((s) => {
          const isCopied = copied === s.hex;
          const glassy = s.name === "Glass";
          return (
            <motion.button
              key={s.hex}
              type="button"
              onClick={() => copy(s.hex)}
              whileTap={{ scale: 0.96 }}
              transition={SPRING}
              className="group relative flex aspect-[5/4] flex-col justify-between overflow-hidden rounded-2xl p-3.5 text-left"
              style={{
                background: s.grad ?? (glassy ? V.glassUp : s.hex),
                backdropFilter: glassy ? "blur(12px)" : undefined,
                color: s.fg,
                boxShadow: glassy
                  ? `inset 0 0 0 1px ${V.glassLine}`
                  : "inset 0 0 0 1px rgba(255,255,255,.14)",
              }}
            >
              <span className="flex items-center justify-between">
                <span className="text-[13px] font-extrabold">{s.name}</span>
                <span className="opacity-70 transition-opacity group-hover:opacity-100">
                  {isCopied ? <Check size={14} /> : <Copy size={14} />}
                </span>
              </span>
              <span>
                <span className="block truncate font-[family-name:var(--font-mono)] text-[10.5px] tabular-nums opacity-90">
                  {isCopied ? "copiado!" : s.hex}
                </span>
                <span className="mt-0.5 block text-[10px] leading-tight opacity-70">{s.note}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
