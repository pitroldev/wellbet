"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { ISO, SPRING, solidShadow } from "./tokens";

type Swatch = { name: string; hex: string; note: string };

const SWATCHES: Swatch[] = [
  { name: "Base", hex: ISO.base, note: "fundo claro" },
  { name: "Roxo", hex: ISO.purple, note: "estrutura / odds" },
  { name: "Verde", hex: ISO.green, note: "green / ganho" },
  { name: "Toy-Yellow", hex: ISO.yellow, note: "cash out / moeda" },
  { name: "Toy-Coral", hex: ISO.coral, note: "red / risco" },
  { name: "Ink", hex: ISO.ink, note: "contorno / texto" },
];

/**
 * PaletteSwatches — paleta CLICÁVEL: tocar em um swatch COPIA o hex para a
 * área de transferência (navigator.clipboard dentro do handler) com feedback
 * "copiado!" e um leve afundar tátil. Nada decorativo.
 */
export function PaletteSwatches() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      // clipboard pode falhar (permissão/sem suporte) — feedback mesmo assim
    }
    setCopied(hex);
    window.setTimeout(() => {
      setCopied((c) => (c === hex ? null : c));
    }, 1100);
  }

  return (
    <div className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: ISO.inkSoft }}>
          Paleta
        </p>
        <span className="text-xs font-medium" style={{ color: ISO.inkSoft }}>
          · toque para copiar o hex
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {SWATCHES.map((s, i) => {
          const isCopied = copied === s.hex;
          return (
            <motion.button
              key={s.name}
              type="button"
              onClick={() => copy(s.hex)}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95, y: 2 }}
              className="touch-manipulation rounded-2xl text-left"
              style={{ minHeight: 44 }}
              aria-label={`Copiar ${s.name} ${s.hex}`}
            >
              <div
                className="relative grid h-20 place-items-center overflow-hidden rounded-2xl"
                style={{
                  background: s.hex,
                  border: `3px solid ${ISO.ink}`,
                  boxShadow: solidShadow(ISO.ink, 4, 5),
                }}
              >
                <AnimatePresence>
                  {isCopied && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={SPRING}
                      className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
                      style={{
                        background: ISO.ink,
                        color: ISO.green,
                        border: `2px solid ${ISO.green}`,
                      }}
                    >
                      <Check size={12} strokeWidth={3.2} /> copiado!
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p className="mt-2.5 flex items-center gap-1 font-bold" style={{ color: ISO.ink }}>
                {s.name}
                <Copy size={11} style={{ color: ISO.inkSoft }} aria-hidden />
              </p>
              <p
                className="font-mono text-xs uppercase"
                style={{ color: isCopied ? ISO.greenDeep : ISO.inkSoft }}
              >
                {s.hex}
              </p>
              <p className="text-xs" style={{ color: ISO.inkSoft }}>
                {s.note}
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
