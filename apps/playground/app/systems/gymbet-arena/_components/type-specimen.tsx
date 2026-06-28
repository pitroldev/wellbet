"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { G, SPRING } from "./tokens";

const WORDS = ["TREINE", "COMPITA", "FATURE", "DOMINE", "STREAK"];

export function TypeSpecimen() {
  const [wi, setWi] = useState(0);
  const [weight, setWeight] = useState(640); // peso variável do Fraunces (display)

  return (
    <div>
      <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: G.fogMute }}>
        Tipografia · interativa
      </h3>

      {/* Manchete Archivo PESADA caixa-alta — clique pra trocar a palavra */}
      <button
        type="button"
        onClick={() => setWi((i) => (i + 1) % WORDS.length)}
        className="mt-4 block w-full overflow-hidden rounded-3xl p-5 text-left sm:p-7"
        style={{
          background: G.navySoft,
          boxShadow: "inset 0 0 0 1px " + G.navyLine,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: G.fogMute }}>
            Archivo · manchete
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[11px]" style={{ color: G.magenta }}>
            toque pra trocar
          </span>
        </div>
        <motion.span
          key={wi}
          initial={{ opacity: 0, x: -18, skewX: 8 }}
          animate={{ opacity: 1, x: 0, skewX: -6 }}
          transition={SPRING}
          className="mt-2 block font-[family-name:var(--font-archivo)] font-black uppercase italic leading-[0.88] tracking-[-0.03em]"
          style={{
            color: G.white,
            fontSize: "clamp(2.6rem,13vw,5rem)",
            background: "linear-gradient(100deg,#FF00FF,#FDC0FF 60%,#7A1BD6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {WORDS[wi]}.
        </motion.span>
      </button>

      {/* Fraunces display — varia o peso */}
      <div
        className="mt-4 rounded-3xl p-5 sm:p-6"
        style={{ background: G.navySoft, boxShadow: "inset 0 0 0 1px " + G.navyLine }}
      >
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: G.fogMute }}>
            Fraunces · display
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: G.green }}>
            wght {weight}
          </span>
        </div>
        <span
          className="mt-1 block leading-[0.95] tracking-[-0.02em]"
          style={{
            color: G.white,
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(1.8rem,8vw,3rem)",
            fontWeight: weight,
            fontVariationSettings: '"SOFT" 60,"WONK" 1,"opsz" 144',
          }}
        >
          Qual seu maior streak?
        </span>
        <input
          type="range"
          min={300}
          max={900}
          step={10}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full"
          style={{ accentColor: G.magenta, background: G.navyLine }}
          aria-label="Peso da fonte Fraunces"
        />
        <p className="mt-2 text-xs" style={{ color: G.fogMute }}>
          Arraste pra variar o peso da serifa display.
        </p>
      </div>

      {/* Sans + mono */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl p-5" style={{ background: G.navySoft, boxShadow: "inset 0 0 0 1px " + G.navyLine }}>
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: G.fogMute }}>
            Plus Jakarta Sans · UI
          </span>
          <p className="mt-2 text-2xl font-extrabold tracking-tight" style={{ color: G.white }}>
            Aa Bb Cc 123
          </p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: G.fog }}>
            Entre no ranking. Estenda seu streak. Conquiste o jackpot.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] font-bold">
            {["Regular", "Medium", "Semibold", "Bold", "Extrabold"].map((w, i) => (
              <span key={w} className="rounded-full px-2.5 py-1" style={{ background: G.magentaWash, color: G.pinkPale, fontWeight: 400 + i * 150 }}>
                {w}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-5" style={{ background: G.ink, boxShadow: "inset 0 0 0 1px " + G.navyLine }}>
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: G.fogMute }}>
            Geist Mono · streaks & números
          </span>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums" style={{ color: G.magenta }}>
            28 dias
          </p>
          <div className="mt-2 flex gap-4 font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: G.fog }}>
            <span>odd 3,40</span>
            <span style={{ color: G.green }}>+240%</span>
            <span>R$ 4.800</span>
          </div>
        </div>
      </div>
    </div>
  );
}
