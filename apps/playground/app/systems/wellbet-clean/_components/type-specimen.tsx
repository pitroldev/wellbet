"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { W, SPRING } from "./tokens";

const WORDS = ["Disciplina", "Consistência", "Evolução", "Green", "Recompensa"];

export function TypeSpecimen() {
  const [wi, setWi] = useState(0);
  const [weight, setWeight] = useState(800); // peso variável do Fraunces (display)

  return (
    <div>
      <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.16em]" style={{ color: W.inkMute }}>
        Tipografia · interativa
      </h3>

      {/* Display serif (Fraunces) — clique a palavra, arraste o peso */}
      <div
        className="mt-4 rounded-3xl p-5 ring-1 ring-inset sm:p-7"
        style={{ background: W.surface, boxShadow: "inset 0 0 0 1px " + W.line }}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: W.inkMute }}>
            Fraunces · display
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: W.blue }}>
            wght {weight}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setWi((i) => (i + 1) % WORDS.length)}
          className="mt-2 block w-full text-left"
        >
          <motion.span
            key={wi}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="block leading-[0.95] tracking-[-0.02em]"
            style={{
              color: W.ink,
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(2.4rem,11vw,4.5rem)",
              fontWeight: weight,
              fontVariationSettings: '"SOFT" 40,"WONK" 1,"opsz" 144',
            }}
          >
            {WORDS[wi]}.
          </motion.span>
        </button>

        <input
          type="range"
          min={300}
          max={900}
          step={10}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full"
          style={{ accentColor: W.blue, background: W.surfaceMute }}
          aria-label="Peso da fonte"
        />
        <p className="mt-2 text-xs" style={{ color: W.inkMute }}>
          Toque a palavra pra trocar · arraste pra variar o peso.
        </p>
      </div>

      {/* Sans + mono */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl p-5 ring-1 ring-inset" style={{ background: W.surface, boxShadow: "inset 0 0 0 1px " + W.line }}>
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: W.inkMute }}>
            Plus Jakarta Sans · UI
          </span>
          <p className="mt-2 text-2xl font-extrabold tracking-tight" style={{ color: W.ink }}>
            Aa Bb Cc 123
          </p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: W.inkSoft }}>
            Sua disciplina agora vale mais. Mais consistência, mais ganhos.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 font-[family-name:var(--font-jakarta)] text-[11px] font-bold">
            {["Regular", "Medium", "Semibold", "Bold", "Extrabold"].map((w, i) => (
              <span key={w} className="rounded-full px-2.5 py-1" style={{ background: W.blueWash, color: W.blueDeep, fontWeight: 400 + i * 150 }}>
                {w}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-5 ring-1 ring-inset" style={{ background: W.ink, boxShadow: "inset 0 0 0 1px " + W.line }}>
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-white/50">
            Geist Mono · números
          </span>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums" style={{ color: W.green }}>
            R$ 2.450,00
          </p>
          <div className="mt-2 flex gap-4 font-[family-name:var(--font-mono)] text-sm tabular-nums text-white/70">
            <span>odd 2,45</span>
            <span style={{ color: W.green }}>+18%</span>
            <span>-12kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
