"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { W, SPRING } from "./tokens";

type Swatch = { name: string; hex: string; note: string; fg: string };

const SWATCHES: Swatch[] = [
  { name: "Blue", hex: "#3945FF", note: "Primária · ações, links", fg: "#FFFFFF" },
  { name: "Green", hex: "#41FFCA", note: "“Deu green” · vitória", fg: "#0A2920" },
  { name: "Ink", hex: "#08161E", note: "Texto · logo", fg: "#FFFFFF" },
  { name: "Blue Soft", hex: "#656FFF", note: "Hover · destaque", fg: "#FFFFFF" },
  { name: "Green Deep", hex: "#18B488", note: "Texto verde sobre claro", fg: "#FFFFFF" },
  { name: "Pink", hex: "#FF80E1", note: "Acento lúdico", fg: "#08161E" },
  { name: "Paper", hex: "#FAFBFC", note: "Fundo do app", fg: "#08161E" },
  { name: "Line", hex: "#E2E5EE", note: "Bordas · divisores", fg: "#08161E" },
];

export function Palette() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1200);
    } catch {
      setCopied(hex);
      setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1200);
    }
  }

  return (
    <div>
      <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.16em]" style={{ color: W.inkMute }}>
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
              className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl p-3 text-left ring-1 ring-inset"
              style={{
                background: s.hex,
                color: s.fg,
                // anel só pra cores claras não sumirem no fundo branco
                boxShadow: "inset 0 0 0 1px rgba(8,22,30,.08)",
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
                <span className="mt-0.5 block text-[10px] leading-tight opacity-70">{s.note}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
