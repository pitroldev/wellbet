"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { B, BORDER, TWEEN } from "./tokens";
import { Block, MonoLabel, Caret } from "./primitives";

const WORDS = ["APOSTA", "GREEN", "STREAK", "BANCA", "JACKPOT"];
const BLOCKS = [B.magenta, B.green, B.blue, B.pink, B.indigo];
const ON_BLOCKS = [B.onMagenta, B.onGreen, B.onBlue, B.onPink, B.onIndigo];

export function TypeSpecimen() {
  const [wi, setWi] = useState(0);
  const [size, setSize] = useState(76);

  const bg = BLOCKS[wi];
  const fg = ON_BLOCKS[wi];

  return (
    <div>
      <MonoLabel style={{ color: B.ink }}>{"// TIPOGRAFIA — TOQUE A PALAVRA, ARRASTE O CORPO"}</MonoLabel>

      {/* Archivo Black GIGANTE em bloco chapado */}
      <button
        type="button"
        onClick={() => setWi((i) => (i + 1) % WORDS.length)}
        className="mt-3 block w-full text-left"
        style={{ background: bg, border: BORDER, boxShadow: `6px 6px 0 ${B.ink}` }}
      >
        <div className="flex items-center justify-between px-4 pt-3">
          <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: fg }}>
            ARCHIVO BLACK
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tabular-nums" style={{ color: fg }}>
            {size}PX
          </span>
        </div>
        <div className="overflow-hidden px-4 pb-3">
          <motion.span
            key={wi}
            initial={{ x: -14, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={TWEEN}
            className="block font-[family-name:var(--font-archivo)] font-black uppercase leading-[0.9] tracking-[-0.02em]"
            style={{ color: fg, fontSize: size }}
          >
            {WORDS[wi]}
          </motion.span>
        </div>
      </button>

      <input
        type="range"
        min={44}
        max={104}
        step={2}
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
        aria-label="Corpo da fonte"
        className="mt-3 h-3 w-full cursor-pointer appearance-none"
        style={{ accentColor: B.magenta, background: B.white, border: BORDER }}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {/* Geist Mono — terminal */}
        <Block bg={B.ink} className="p-4">
          <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
            GEIST MONO · TERMINAL
          </span>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-2xl font-bold tabular-nums" style={{ color: B.green }}>
            R$ 2.450,00
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums text-white/75">
            <span>odd 2,45</span>
            <span style={{ color: B.green }}>+18%</span>
            <span style={{ color: B.pink }}>-12kg</span>
          </div>
          <p className="mt-2 font-[family-name:var(--font-mono)] text-xs text-white/55">
            &gt; aposta_registrada<Caret color={B.green} />
          </p>
        </Block>

        {/* Jakarta — corpo pequeno */}
        <Block bg={B.white} className="p-4">
          <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: B.ink, opacity: 0.55 }}>
            JAKARTA · CORPO
          </span>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: B.ink }}>
            Sem firula. Só aposta. O mono carrega os números, o Archivo grita as
            manchetes e o Jakarta segura o corpo pequeno — exatamente onde precisa.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {["Regular", "Medium", "Bold"].map((w, i) => (
              <span
                key={w}
                className="px-2 py-1 text-[11px]"
                style={{ background: B.paper, border: `2px solid ${B.ink}`, color: B.ink, fontWeight: 400 + i * 200 }}
              >
                {w}
              </span>
            ))}
          </div>
        </Block>
      </div>
    </div>
  );
}
