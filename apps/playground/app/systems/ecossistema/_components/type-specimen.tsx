"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { E, GLASS, GLASS_LINE } from "./tokens";
import { SPRING } from "./tokens";

const WORDS = ["Mudança", "Ecossistema", "Disciplina", "Algo em jogo", "Transformação"];

export function TypeSpecimen() {
  const [wi, setWi] = useState(0);
  const [soft, setSoft] = useState(60); // eixo SOFT do Fraunces (ar fashion)
  const [weight, setWeight] = useState(620);

  return (
    <div>
      <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.16em]" style={{ color: E.peri }}>
        Tipografia · a voz institucional
      </h3>

      {/* Display serif (Fraunces) — clique a palavra, varie SOFT/peso */}
      <div
        className="mt-4 rounded-3xl p-5 sm:p-7"
        style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span
            className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]"
            style={{ color: E.peri, opacity: 0.7 }}
          >
            Fraunces · display
          </span>
          <span className="flex gap-3 font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: E.blueSoft }}>
            <span>SOFT {soft}</span>
            <span>wght {weight}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setWi((i) => (i + 1) % WORDS.length)}
          className="mt-2 block w-full text-left"
        >
          <motion.span
            key={wi}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="block leading-[0.95] tracking-[-0.02em]"
            style={{
              color: "#fff",
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(2.2rem,10vw,4.2rem)",
              fontWeight: weight,
              fontVariationSettings: `"SOFT" ${soft},"WONK" 1,"opsz" 144`,
            }}
          >
            {WORDS[wi]}.
          </motion.span>
        </button>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] font-semibold" style={{ color: E.peri, opacity: 0.75 }}>
              eixo SOFT · ar fashion
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={2}
              value={soft}
              onChange={(e) => setSoft(Number(e.target.value))}
              className="mt-1.5 h-2 w-full cursor-pointer appearance-none rounded-full"
              style={{ accentColor: E.pink, background: "rgba(204,209,255,.18)" }}
              aria-label="Eixo SOFT da fonte"
            />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold" style={{ color: E.peri, opacity: 0.75 }}>
              peso
            </span>
            <input
              type="range"
              min={300}
              max={900}
              step={10}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-1.5 h-2 w-full cursor-pointer appearance-none rounded-full"
              style={{ accentColor: E.blueSoft, background: "rgba(204,209,255,.18)" }}
              aria-label="Peso da fonte"
            />
          </label>
        </div>
        <p className="mt-3 text-xs" style={{ color: E.peri, opacity: 0.6 }}>
          Toque a palavra pra trocar · arraste pra dar o ar curvy do muma.
        </p>
      </div>

      {/* Sans + mono */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl p-5" style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}>
          <span
            className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]"
            style={{ color: E.peri, opacity: 0.7 }}
          >
            Plus Jakarta Sans · UI
          </span>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-white">Aa Bb Cc 123</p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: E.peri }}>
            Conheça nosso ecossistema. Uma engenharia de marca, dois mundos.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 font-[family-name:var(--font-jakarta)] text-[11px] font-bold">
            {["Regular", "Medium", "Semibold", "Bold", "Extrabold"].map((w, i) => (
              <span
                key={w}
                className="rounded-full px-2.5 py-1"
                style={{ background: "rgba(204,209,255,.14)", color: "#fff", fontWeight: 400 + i * 150 }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-5" style={{ background: "rgba(8,4,40,.45)", boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}>
          <span
            className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]"
            style={{ color: E.peri, opacity: 0.55 }}
          >
            Geist Mono · números
          </span>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums" style={{ color: E.green }}>
            R$ 12.480,00
          </p>
          <div className="mt-2 flex gap-4 font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: E.peri }}>
            <span>odd 2,45</span>
            <span style={{ color: E.green }}>+24%</span>
            <span style={{ color: E.pink }}>streak 18</span>
          </div>
        </div>
      </div>
    </div>
  );
}
