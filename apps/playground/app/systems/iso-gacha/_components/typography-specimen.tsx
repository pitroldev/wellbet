"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Type } from "lucide-react";
import { ISO, SPRING, brl, odd } from "./tokens";
import { IsoCard } from "./iso-primitives";

const WEIGHTS = [
  { label: "Light", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Bold", value: 700 },
] as const;

/**
 * TypographySpecimen — espécime de tipografia AO VIVO: texto editável (input),
 * slider de tamanho e toggle de peso que mudam o display na hora. O segundo
 * card mantém o argumento de legibilidade financeira com numerais tabulares.
 */
export function TypographySpecimen() {
  const [text, setText] = useState("DEU GREEN!");
  const [size, setSize] = useState(56);
  const [weight, setWeight] = useState<number>(700);

  return (
    <div className="mt-12">
      <div className="mb-4 flex items-center gap-2">
        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: ISO.inkSoft }}>
          Tipografia
        </p>
        <span className="text-xs font-medium" style={{ color: ISO.inkSoft }}>
          · controle ao vivo
        </span>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <IsoCard shadow={ISO.purple} className="p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: ISO.inkSoft }}
            >
              Display · Fredoka
            </span>
            <span className="font-mono text-xs tabular-nums" style={{ color: ISO.inkSoft }}>
              {size}px · {weight}
            </span>
          </div>

          {/* espécime que reage aos controles */}
          <div
            className="mt-3 flex min-h-[88px] items-center overflow-hidden rounded-2xl px-3 py-2"
            style={{
              background: ISO.base,
              border: `2.5px solid ${ISO.baseDeep}`,
            }}
          >
            <motion.p
              key={`${size}-${weight}`}
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              transition={SPRING}
              className="font-[family-name:var(--font-display)] leading-none"
              style={{
                color: ISO.greenDeep,
                fontSize: size,
                fontWeight: weight,
                wordBreak: "break-word",
              }}
            >
              {text || "Digite algo…"}
            </motion.p>
          </div>

          {/* controle: texto editável */}
          <label className="mt-4 block">
            <span
              className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest"
              style={{ color: ISO.inkSoft }}
            >
              <Type size={12} /> Texto
            </span>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={28}
              placeholder="Edite o espécime…"
              className="w-full rounded-xl px-3 py-2.5 font-[family-name:var(--font-display)] text-base font-bold outline-none"
              style={{
                background: "#FFFFFF",
                color: ISO.ink,
                border: `2.5px solid ${ISO.ink}`,
              }}
            />
          </label>

          {/* controle: slider de tamanho */}
          <label className="mt-4 block">
            <span
              className="mb-1 block text-[11px] font-bold uppercase tracking-widest"
              style={{ color: ISO.inkSoft }}
            >
              Tamanho
            </span>
            <input
              type="range"
              min={24}
              max={84}
              step={1}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="h-2 w-full cursor-pointer touch-manipulation appearance-none rounded-full"
              style={{ accentColor: ISO.purple, background: ISO.baseDeep }}
              aria-label="Tamanho da tipografia"
            />
          </label>

          {/* controle: toggle de peso */}
          <div className="mt-4 flex gap-2">
            {WEIGHTS.map((w) => {
              const on = w.value === weight;
              return (
                <button
                  key={w.value}
                  type="button"
                  onClick={() => setWeight(w.value)}
                  className="flex-1 touch-manipulation rounded-xl py-2.5 text-sm transition-colors"
                  style={{
                    minHeight: 44,
                    fontWeight: w.value,
                    fontFamily: "var(--font-display)",
                    background: on ? ISO.purple : "#FFFFFF",
                    color: on ? "#FFFFFF" : ISO.inkSoft,
                    border: `2.5px solid ${on ? ISO.purple : ISO.baseDeep}`,
                  }}
                >
                  {w.label}
                </button>
              );
            })}
          </div>
        </IsoCard>

        <IsoCard shadow={ISO.green} className="p-6 sm:p-8">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: ISO.inkSoft }}
          >
            Corpo · Space Grotesk
          </span>
          <p className="mt-2 text-5xl font-bold leading-none" style={{ color: ISO.ink }}>
            Aa
          </p>
          <p className="mt-3 text-base leading-relaxed" style={{ color: ISO.ink }}>
            Legibilidade financeira é inegociável: lidamos com dinheiro de verdade. Numerais
            tabulares mantêm <span className="font-semibold tabular-nums">{brl(200)}</span> e a
            cotação <span className="font-semibold tabular-nums">{odd(2.4)}</span> alinhados.
          </p>
          <p className="mt-4 text-xs" style={{ color: ISO.inkSoft }}>
            Dica: edite o display ao lado e veja a fonte Fredoka responder em tempo real — mesmo
            peso e tamanho do app real.
          </p>
        </IsoCard>
      </div>
    </div>
  );
}
