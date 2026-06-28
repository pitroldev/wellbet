"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { J, SPRING } from "./tokens";

const WORDS = ["JACKPOT", "MEGA WIN", "DEU GREEN", "GIROU", "BORA?"];

export function TypeSpecimen() {
  const [wi, setWi] = useState(0);
  const [tracking, setTracking] = useState(2); // tracking do caixa-alta (em px/100)

  return (
    <div>
      <h3 className="mb-1 text-sm font-bold uppercase tracking-[0.16em]" style={{ color: J.textMute }}>
        Tipografia · interativa
      </h3>

      {/* Display caixa-alta (Archivo Black) — clique a palavra, arraste o tracking */}
      <div
        className="mt-4 overflow-hidden rounded-3xl p-5 sm:p-7"
        style={{ background: J.surface, boxShadow: "inset 0 0 0 1px " + J.line }}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: J.textMute }}>
            Archivo Black · manchete
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: J.pink }}>
            tracking {tracking}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setWi((i) => (i + 1) % WORDS.length)}
          className="mt-2 block w-full text-left"
        >
          <motion.span
            key={wi}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={SPRING}
            className="block font-[family-name:var(--font-archivo)] uppercase leading-[0.9]"
            style={{
              fontWeight: 900,
              fontSize: "clamp(2.2rem,11vw,4.4rem)",
              letterSpacing: `${tracking / 100}em`,
              backgroundImage: "linear-gradient(120deg,#FF00FF 0%,#FF80E1 50%,#41FFCA 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {WORDS[wi]}
          </motion.span>
        </button>

        <input
          type="range"
          min={-4}
          max={14}
          step={1}
          value={tracking}
          onChange={(e) => setTracking(Number(e.target.value))}
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full"
          style={{ accentColor: J.magenta, background: J.surfaceUp }}
          aria-label="Espaçamento das letras"
        />
        <p className="mt-2 text-xs" style={{ color: J.textMute }}>
          Toque a palavra pra trocar · arraste pra abrir o tracking.
        </p>
      </div>

      {/* Sans + mono */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl p-5" style={{ background: J.surface, boxShadow: "inset 0 0 0 1px " + J.line }}>
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: J.textMute }}>
            Plus Jakarta Sans · UI
          </span>
          <p className="mt-2 text-2xl font-extrabold tracking-tight" style={{ color: J.text }}>
            Aa Bb Cc 123
          </p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: J.textSoft }}>
            Puxa a alavanca, gira os rolos. A melhor aposta é na sua mudança.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 font-[family-name:var(--font-jakarta)] text-[11px] font-bold">
            {["Regular", "Medium", "Semibold", "Bold", "Extrabold"].map((w, i) => (
              <span key={w} className="rounded-full px-2.5 py-1" style={{ background: J.surfaceUp, color: J.pink, fontWeight: 400 + i * 150 }}>
                {w}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-5" style={{ background: J.indigo, boxShadow: "inset 0 0 0 1px " + J.line }}>
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em] text-white/50">
            Geist Mono · contadores
          </span>
          <p
            className="mt-2 font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
            style={{ color: J.green, textShadow: "0 0 18px rgba(65,255,202,.6)" }}
          >
            R$ 248.910
          </p>
          <div className="mt-2 flex gap-4 font-[family-name:var(--font-mono)] text-sm tabular-nums text-white/70">
            <span>odd 12,00</span>
            <span style={{ color: J.green }}>x250</span>
            <span style={{ color: J.gold }}>777</span>
          </div>
        </div>
      </div>
    </div>
  );
}
