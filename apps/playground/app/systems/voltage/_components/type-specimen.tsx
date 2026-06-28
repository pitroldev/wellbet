"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { V, GRAD, SPRING } from "./tokens";

const WORDS = ["Carregada", "Elétrica", "Voltagem", "Faísca", "Green"];

export function TypeSpecimen() {
  const [wi, setWi] = useState(0);
  const [weight, setWeight] = useState(820);

  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: V.inkFaint }}>
        Tipografia · interativa
      </h3>

      {/* Display — Jakarta extrabold (manchete) com palavra trocável */}
      <div
        className="relative overflow-hidden rounded-3xl p-5 sm:p-7"
        style={{ background: V.glass, backdropFilter: "blur(14px)", boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: V.inkFaint }}>
            Plus Jakarta · manchete
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: V.green }}>
            wght {weight}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setWi((i) => (i + 1) % WORDS.length)}
          className="mt-2 block w-full text-left"
        >
          <span className="block text-[13px] font-bold" style={{ color: V.inkSoft }}>
            Sua disciplina,
          </span>
          <motion.span
            key={wi}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="block bg-clip-text leading-[0.92] tracking-tight text-transparent"
            style={{
              fontFamily: "var(--font-jakarta)",
              fontWeight: 800,
              fontSize: "clamp(2.6rem,12vw,4.8rem)",
              backgroundImage: GRAD.bolt,
            }}
          >
            {WORDS[wi]}.
          </motion.span>
        </button>

        {/* range controla um número-herói em Fraunces ao lado */}
        <div className="mt-5 flex items-center gap-5">
          <input
            type="range"
            min={300}
            max={900}
            step={10}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="h-2 flex-1 cursor-pointer appearance-none rounded-full"
            style={{ accentColor: V.green, background: "rgba(255,255,255,.10)" }}
            aria-label="Peso da Fraunces"
          />
          <span
            className="font-[family-name:var(--font-fraunces)] leading-none"
            style={{ color: V.white, fontSize: 56, fontWeight: weight, fontVariationSettings: '"SOFT" 50,"WONK" 1,"opsz" 144' }}
          >
            7
          </span>
        </div>
        <p className="mt-2 text-xs" style={{ color: V.inkFaint }}>
          Toque a palavra pra trocar · arraste pra variar a Fraunces (número-herói).
        </p>
      </div>

      {/* Mono pesado + corpo */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl p-5" style={{ background: V.glass, backdropFilter: "blur(14px)", boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}>
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: V.inkFaint }}>
            Plus Jakarta · UI
          </span>
          <p className="mt-2 text-2xl font-extrabold tracking-tight" style={{ color: V.white }}>
            Aa Bb Cc 123
          </p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: V.inkSoft }}>
            Sua disciplina, carregada. Cada green solta uma faísca.
          </p>
        </div>

        <div
          className="relative overflow-hidden rounded-3xl p-5"
          style={{ background: V.glass, backdropFilter: "blur(14px)", boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
        >
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: V.inkFaint }}>
            Geist Mono · voltagem
          </span>
          <p
            className="mt-1 bg-clip-text font-[family-name:var(--font-mono)] text-5xl font-bold tabular-nums text-transparent"
            style={{ backgroundImage: GRAD.flow }}
          >
            8.40×
          </p>
          <div className="mt-2 flex gap-4 font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: V.inkSoft }}>
            <span>odd 2,45</span>
            <span style={{ color: V.green }}>+18%</span>
            <span>R$ 2.450</span>
          </div>
        </div>
      </div>
    </div>
  );
}
