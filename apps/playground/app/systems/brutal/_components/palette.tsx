"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { B, BORDER, shadow, TWEEN } from "./tokens";
import { MonoLabel } from "./primitives";

type Swatch = { name: string; hex: string; note: string; fg: string };

const SWATCHES: Swatch[] = [
  { name: "INK", hex: "#08161E", note: "bordas · sombras · texto", fg: "#FFFFFF" },
  { name: "MAGENTA", hex: "#FF00FF", note: "bloco primário", fg: "#FFFFFF" },
  { name: "GREEN", hex: "#41FFCA", note: "deu green · vitória", fg: "#08161E" },
  { name: "BLUE", hex: "#3945FF", note: "ação · link", fg: "#FFFFFF" },
  { name: "PINK", hex: "#FF80E1", note: "acento lúdico", fg: "#08161E" },
  { name: "INDIGO", hex: "#3215AD", note: "bloco profundo", fg: "#FFFFFF" },
  { name: "PAPER", hex: "#FAFBFC", note: "ground de papel", fg: "#08161E" },
  { name: "WHITE", hex: "#FFFFFF", note: "superfície de bloco", fg: "#08161E" },
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
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1100);
  }

  return (
    <div>
      <MonoLabel style={{ color: B.ink }}>{"// PALETA — TOQUE PRA COPIAR HEX"}</MonoLabel>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SWATCHES.map((s) => {
          const isCopied = copied === s.hex;
          return (
            <motion.button
              key={s.hex}
              type="button"
              onClick={() => copy(s.hex)}
              initial={false}
              animate={{ x: 0, y: 0, boxShadow: shadow(6) }}
              whileTap={{ x: 6, y: 6, boxShadow: shadow(0) }}
              transition={TWEEN}
              className="flex aspect-[4/3] flex-col justify-between p-3 text-left"
              style={{ background: s.hex, color: s.fg, border: BORDER }}
            >
              <span className="flex items-center justify-between">
                <span className="font-[family-name:var(--font-archivo)] text-[13px] font-black uppercase tracking-wide">
                  {s.name}
                </span>
                {isCopied ? <Check size={15} strokeWidth={3} /> : <Copy size={14} strokeWidth={2.6} />}
              </span>
              <span>
                <span className="block font-[family-name:var(--font-mono)] text-[12px] font-bold tabular-nums">
                  {isCopied ? "COPIADO!" : s.hex}
                </span>
                <span className="mt-0.5 block font-[family-name:var(--font-mono)] text-[10px] leading-tight opacity-80">
                  {s.note}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
