"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { R, INKS, halftone, PRINT_SHADOW, STAMP_SPRING } from "./tokens";

export function Palette() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(hex: string) {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      /* sem clipboard — segue mostrando "copiado" */
    }
    setCopied(hex);
    setTimeout(() => setCopied((c) => (c === hex ? null : c)), 1100);
  }

  return (
    <div>
      <h3
        className="mb-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em]"
        style={{ color: R.ink }}
      >
        [ tintas ] · toque pra copiar o hex
      </h3>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {INKS.map((s, i) => {
          const isCopied = copied === s.hex;
          const tilt = (i % 2 === 0 ? -1 : 1) * 0.6;
          return (
            <motion.button
              key={s.hex}
              type="button"
              onClick={() => copy(s.hex)}
              whileTap={{ scale: 0.95, rotate: 0 }}
              animate={{ rotate: tilt }}
              transition={STAMP_SPRING}
              className="group relative flex aspect-[5/4] flex-col justify-between overflow-hidden p-3 text-left"
              style={{
                background: s.hex,
                color: s.fg,
                border: `2.5px solid ${R.ink}`,
                boxShadow: PRINT_SHADOW,
              }}
            >
              {/* halftone da própria tinta, sobreposto multiply */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ ...halftone(R.ink, 7, 0.3), mixBlendMode: "multiply", opacity: 0.18 }}
              />
              <span className="relative flex items-center justify-between">
                <span
                  className="font-[family-name:var(--font-archivo)] text-[15px] font-extrabold uppercase tracking-tight"
                >
                  {s.name}
                </span>
                <span className="opacity-70 transition-opacity group-hover:opacity-100">
                  {isCopied ? <Check size={15} strokeWidth={3} /> : <Copy size={14} />}
                </span>
              </span>
              <span className="relative">
                <span className="block font-[family-name:var(--font-mono)] text-[12px] tabular-nums">
                  {isCopied ? "copiado!" : s.hex}
                </span>
                <span className="mt-0.5 block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider opacity-75">
                  {s.note}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* faixa de overprint: magenta + blue = violeta (multiply) */}
      <div
        className="relative mt-3 flex items-center gap-2 overflow-hidden px-4 py-3"
        style={{ background: R.paper, border: `2.5px solid ${R.ink}`, boxShadow: PRINT_SHADOW }}
      >
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.18em]" style={{ color: R.ink }}>
          overprint
        </span>
        <span className="relative h-7 w-16" style={{ background: R.magenta }} />
        <span
          className="relative -ml-8 h-7 w-16"
          style={{ background: R.blue, mixBlendMode: "multiply" }}
        />
        <span className="ml-1 font-[family-name:var(--font-mono)] text-[11px]" style={{ color: R.ink }}>
          magenta × blue → violeta
        </span>
      </div>
    </div>
  );
}
