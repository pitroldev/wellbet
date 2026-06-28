"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { M, SPRING, FRAUNCES_DISPLAY } from "./tokens";

const WORDS = ["Mudança", "Disciplina", "Constância", "Conquista", "Green"];

export function TypeSpecimen() {
  const [wi, setWi] = useState(0);
  const [weight, setWeight] = useState(420); // peso variável da Fraunces (display)
  const [soft, setSoft] = useState(60); // eixo SOFT — o "ar" curvy

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between border-b pb-3" style={{ borderColor: M.hair }}>
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.3em]" style={{ color: M.inkMute }}>
          A tipografia
        </span>
        <span className="text-xs" style={{ color: M.inkMute }}>
          a serifa manda
        </span>
      </div>

      {/* Display Fraunces — clique a palavra, arraste peso e SOFT */}
      <div className="rounded-[6px] bg-white p-6 sm:p-9" style={{ boxShadow: `inset 0 0 0 1px ${M.hair}` }}>
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
            Fraunces · display
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: M.indigo }}>
            wght {weight} · soft {soft}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setWi((i) => (i + 1) % WORDS.length)}
          className="mt-3 block w-full text-left"
          aria-label="Trocar palavra"
        >
          <span
            className="inline-flex items-baseline leading-[0.92] tracking-[-0.02em]"
            style={{ color: M.ink }}
          >
            <motion.span
              key={wi}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={SPRING}
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "clamp(2.6rem,12vw,5rem)",
                fontWeight: weight,
                fontVariationSettings: `"SOFT" ${soft},"WONK" 1,"opsz" 144`,
              }}
            >
              {WORDS[wi]}
            </motion.span>
            {/* ponto-final gigante rosa — o motivo */}
            <span
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "clamp(2.6rem,12vw,5rem)",
                fontWeight: 700,
                color: M.pink,
                fontVariationSettings: FRAUNCES_DISPLAY,
              }}
            >
              .
            </span>
          </span>
        </button>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em]" style={{ color: M.inkMute }}>
              Peso
            </span>
            <input
              type="range"
              min={300}
              max={700}
              step={10}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="mt-1 h-2 w-full cursor-pointer appearance-none rounded-full"
              style={{ accentColor: M.indigo, background: M.paperMute }}
              aria-label="Peso da fonte"
            />
          </label>
          <label className="block">
            <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em]" style={{ color: M.inkMute }}>
              Soft (curvy)
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={soft}
              onChange={(e) => setSoft(Number(e.target.value))}
              className="mt-1 h-2 w-full cursor-pointer appearance-none rounded-full"
              style={{ accentColor: M.pink, background: M.paperMute }}
              aria-label="Eixo SOFT da fonte"
            />
          </label>
        </div>
        <p className="mt-3 text-xs" style={{ color: M.inkMute }}>
          Toque a palavra pra trocar · arraste pra esculpir o peso e a curva.
        </p>
      </div>

      {/* virgula gigante — "Bora? , Bora!" motivo + sans/mono */}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div
          className="relative flex items-center overflow-hidden rounded-[6px] p-6"
          style={{ background: M.indigo, color: "#fff" }}
        >
          <span
            className="absolute -left-2 -top-10 select-none leading-none"
            style={{
              fontFamily: "var(--font-fraunces)",
              fontSize: "16rem",
              color: M.pink,
              fontVariationSettings: FRAUNCES_DISPLAY,
              opacity: 0.9,
            }}
          >
            ,
          </span>
          <div className="relative ml-auto max-w-[60%] text-right">
            <p
              className="leading-[1.05]"
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "clamp(1.6rem,5vw,2.4rem)",
                fontWeight: 500,
                fontVariationSettings: FRAUNCES_DISPLAY,
              }}
            >
              Bora?{" "}
              <span style={{ color: M.pink }}>Bora!</span>
            </p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] opacity-70">
              o motivo da casa
            </p>
          </div>
        </div>

        <div className="rounded-[6px] bg-white p-6" style={{ boxShadow: `inset 0 0 0 1px ${M.hair}` }}>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
            Jakarta · UI · números mono
          </span>
          <p className="mt-2 text-xl font-extrabold tracking-tight" style={{ color: M.ink }}>
            Aa Bb Cc 123
          </p>
          <p className="mt-1 text-sm leading-relaxed" style={{ color: M.inkSoft }}>
            A melhor aposta é na sua mudança. Quem continua, conquista.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-3" style={{ borderColor: M.hair }}>
            <span className="font-[family-name:var(--font-mono)] text-lg tabular-nums" style={{ color: M.indigo }}>
              R$ 2.450,00
            </span>
            <span className="font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: M.inkMute }}>
              odd 2,45
            </span>
            <span className="font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: M.greenDeep }}>
              -12kg
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
