"use client";

import { useState } from "react";
import { R, PRINT_SHADOW } from "./tokens";
import { MisprintTitle } from "./print-kit";

const WORDS = ["GREEN", "STREAK", "JACKPOT", "STAKE", "BANCA"];
const INK_PAIRS: { a: string; b: string }[] = [
  { a: R.magenta, b: R.blue },
  { a: R.blue, b: R.green },
  { a: R.pink, b: R.indigo },
  { a: R.green, b: R.magenta },
  { a: R.indigo, b: R.pink },
];

export function TypeSpecimen() {
  const [wi, setWi] = useState(0);
  const [shift, setShift] = useState(3); // desalinho de registro (px)

  const pair = INK_PAIRS[wi % INK_PAIRS.length];

  return (
    <div>
      <h3
        className="mb-1 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.22em]"
        style={{ color: R.ink }}
      >
        [ tipo ] · pôster interativo
      </h3>

      {/* Manchete misprint — toca pra trocar palavra+tintas; arrasta o registro */}
      <div
        className="relative mt-4 overflow-hidden p-5 sm:p-7"
        style={{ background: R.paper, border: `2.5px solid ${R.ink}`, boxShadow: PRINT_SHADOW }}
      >
        <div className="flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em]" style={{ color: R.ink }}>
            Archivo Black · 900
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: R.magenta }}>
            registro {shift}px
          </span>
        </div>

        <button
          type="button"
          onClick={() => setWi((i) => (i + 1) % WORDS.length)}
          className="mt-3 block w-full text-left"
          aria-label="Trocar palavra e tintas"
        >
          <MisprintTitle ink1={pair.a} ink2={pair.b} shift={shift}>
            <span style={{ display: "inline-block" }}>{WORDS[wi]}</span>
          </MisprintTitle>
        </button>

        <input
          type="range"
          min={0}
          max={8}
          step={1}
          value={shift}
          onChange={(e) => setShift(Number(e.target.value))}
          className="mt-5 h-2 w-full cursor-pointer appearance-none"
          style={{ accentColor: R.magenta, background: R.paperDeep }}
          aria-label="Desalinho de registro"
        />
        <p className="mt-2 font-[family-name:var(--font-mono)] text-[11px]" style={{ color: R.ink }}>
          toca a palavra pra rodar as tintas · arrasta pra desalinhar o registro
        </p>
      </div>

      {/* Serif Fraunces + Mono */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div
          className="p-5"
          style={{ background: R.paper, border: `2.5px solid ${R.ink}`, boxShadow: PRINT_SHADOW }}
        >
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em]" style={{ color: R.ink }}>
            Fraunces · serifa manchete
          </span>
          <p
            className="mt-1 leading-[0.98]"
            style={{
              color: R.indigo,
              fontFamily: "var(--font-fraunces)",
              fontSize: "clamp(1.9rem,7vw,2.8rem)",
              fontVariationSettings: '"SOFT" 60,"WONK" 1,"opsz" 144',
            }}
          >
            Impressa na sua mudança.
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: R.ink }}>
            Edição limitada. Tinta sobre papel — cada cupom sai um pouco diferente.
          </p>
        </div>

        <div
          className="relative overflow-hidden p-5"
          style={{ background: R.ink, color: R.paper, border: `2.5px solid ${R.ink}`, boxShadow: PRINT_SHADOW }}
        >
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em] opacity-60">
            Geist Mono · números
          </span>
          <p
            className="mt-2 font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
            style={{ color: R.green }}
          >
            R$ 2.450,00
          </p>
          <div className="mt-2 flex gap-4 font-[family-name:var(--font-mono)] text-sm tabular-nums" style={{ color: R.pink }}>
            <span>odd 2,45</span>
            <span style={{ color: R.green }}>+18%</span>
            <span>-12kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
