"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { N, SPRING, neonText } from "./tokens";

const WORDS = ["Roleta", "Jackpot", "Banca", "Green", "Royale"];

export function TypeSpecimen() {
  const [wi, setWi] = useState(0);
  const [weight, setWeight] = useState(700);

  return (
    <div>
      <h3
        className="mb-4 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.24em]"
        style={{ color: N.mute }}
      >
        Tipografia · interativa
      </h3>

      {/* Display serif (Fraunces) — "royale" elegante, com glow neon. */}
      <div
        className="rounded-3xl p-5 sm:p-7"
        style={{
          background: `linear-gradient(180deg, ${N.panel}, ${N.ground})`,
          border: `1px solid ${N.line}`,
        }}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em]"
            style={{ color: N.mute }}
          >
            Fraunces · display royale
          </span>
          <span
            className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums"
            style={{ color: N.pink }}
          >
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
              color: N.green,
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(2.4rem,11vw,4.5rem)",
              fontWeight: weight,
              fontVariationSettings: '"SOFT" 60,"WONK" 1,"opsz" 144',
              textShadow: neonText(N.green),
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
          style={{ accentColor: N.magenta, background: N.panelSoft }}
          aria-label="Peso da fonte"
        />
        <p className="mt-2 text-xs" style={{ color: N.mute }}>
          Toque a palavra pra trocar · arraste pra variar o peso.
        </p>
      </div>

      {/* Caixa-alta (Archivo) + mono dos números */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div
          className="rounded-3xl p-5"
          style={{
            background: N.groundDeep,
            border: `1px solid ${N.line}`,
          }}
        >
          <span
            className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em]"
            style={{ color: N.mute }}
          >
            Archivo · letreiro
          </span>
          <p
            className="mt-2 font-[family-name:var(--font-archivo)] text-3xl font-black uppercase leading-none tracking-tight"
            style={{ color: N.white, textShadow: neonText(N.magenta) }}
          >
            MEGA WIN
          </p>
          <p
            className="mt-2 font-[family-name:var(--font-jakarta)] text-sm leading-relaxed"
            style={{ color: N.mute }}
          >
            Mudanças reais acontecem quando existe algo em jogo. Bora? Bora!
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 font-[family-name:var(--font-jakarta)] text-[11px] font-bold">
            {["Regular", "Medium", "Semibold", "Bold", "Black"].map((w, i) => (
              <span
                key={w}
                className="rounded-full px-2.5 py-1"
                style={{
                  background: "rgba(255,0,255,.12)",
                  color: N.pink,
                  fontWeight: 400 + i * 130,
                }}
              >
                {w}
              </span>
            ))}
          </div>
        </div>

        <div
          className="rounded-3xl p-5"
          style={{
            background: N.groundDeep,
            border: `1px solid ${N.line}`,
          }}
        >
          <span
            className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em]"
            style={{ color: N.mute }}
          >
            Geist Mono · saldo / odds
          </span>
          <p
            className="mt-2 font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
            style={{ color: N.green, textShadow: neonText(N.green) }}
          >
            R$ 2.450,00
          </p>
          <div className="mt-2 flex gap-4 font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: N.mute }}>
            <span>odd 2,45</span>
            <span style={{ color: N.green }}>+18%</span>
            <span style={{ color: N.gold }}>x12</span>
          </div>
        </div>
      </div>
    </div>
  );
}
