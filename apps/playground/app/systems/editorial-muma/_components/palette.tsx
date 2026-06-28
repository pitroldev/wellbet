"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { M, SPRING, FRAUNCES_TEXT } from "./tokens";

type Swatch = { name: string; hex: string; note: string; fg: string };

const SWATCHES: Swatch[] = [
  { name: "Pink", hex: "#FF80E1", note: "Protagonista · lúdico", fg: "#08161E" },
  { name: "Indigo", hex: "#3215AD", note: "Protagonista · campo", fg: "#FFFFFF" },
  { name: "Ink", hex: "#08161E", note: "Texto · serifa", fg: "#FFFFFF" },
  { name: "Pink Pale", hex: "#FDC0FF", note: "Superfície rosa", fg: "#08161E" },
  { name: "Periwinkle", hex: "#CCD1FF", note: "Superfície indigo", fg: "#3215AD" },
  { name: "Green", hex: "#41FFCA", note: "Só p/ vitória · green", fg: "#0A2920" },
  { name: "Paper", hex: "#FAFBFC", note: "O papel · fundo", fg: "#08161E" },
  { name: "Line", hex: "#E2E5EE", note: "Fios · grade 1px", fg: "#08161E" },
];

export function Palette() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      // clipboard pode falhar (permissão/contexto) — segue mostrando o feedback
    }
    setCopied(hex);
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1200);
  }

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between border-b pb-3" style={{ borderColor: M.hair }}>
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em]" style={{ color: M.inkMute }}>
          A paleta
        </span>
        <span className="text-xs" style={{ color: M.inkMute }}>
          toque pra copiar o hex
        </span>
      </div>

      {/* grade editorial com fios finos */}
      <div
        className="grid grid-cols-2 overflow-hidden rounded-[4px] sm:grid-cols-4"
        style={{ boxShadow: `inset 0 0 0 1px ${M.hair}`, gap: 1, background: M.hair }}
      >
        {SWATCHES.map((s, i) => {
          const isCopied = copied === s.hex;
          return (
            <motion.button
              key={s.hex}
              type="button"
              onClick={() => copy(s.hex)}
              whileTap={{ scale: 0.97 }}
              transition={SPRING}
              className="group relative flex aspect-[5/6] flex-col justify-between p-4 text-left"
              style={{ background: s.hex, color: s.fg }}
            >
              <span className="flex items-start justify-between">
                <span
                  className="font-[family-name:var(--font-fraunces)] text-2xl leading-none"
                  style={{ fontVariationSettings: FRAUNCES_TEXT, fontWeight: 600 }}
                >
                  {s.name}
                </span>
                <span className="opacity-60 transition-opacity group-hover:opacity-100">
                  {isCopied ? <Check size={15} /> : <Copy size={15} />}
                </span>
              </span>
              <span>
                <span className="font-[family-name:var(--font-mono)] text-[10px] tabular-nums opacity-70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-0.5 block font-[family-name:var(--font-mono)] text-[11px] tabular-nums opacity-95">
                  {isCopied ? "copiado." : s.hex}
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
