"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Coins } from "lucide-react";
import { N, SPRING, brl, neonText } from "./tokens";
import { Chip } from "./primitives";

/**
 * Fichas pra stake. Toque numa denominação (5/25/100) -> a ficha "voa" pra
 * pilha e SOMA o stake. A pilha cresce empilhando discos. Determinístico:
 * cada ficha lançada recebe um id sequencial (sem random em render).
 */

const DENOMS = [
  { v: 5, ring: N.blue },
  { v: 25, ring: N.magenta },
  { v: 100, ring: N.green },
];

type Tossed = { id: number; v: number; ring: string };

export function ChipStack() {
  const [pile, setPile] = useState<Tossed[]>([]);
  const [nextId, setNextId] = useState(1);

  const total = pile.reduce((s, c) => s + c.v, 0);

  function add(v: number, ring: string) {
    setPile((p) => [...p, { id: nextId, v, ring }]);
    setNextId((n) => n + 1);
  }
  function clear() {
    setPile([]);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{
        background: `linear-gradient(180deg, ${N.panel}, ${N.ground})`,
        border: `1px solid ${N.line}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-[0.18em]"
          style={{ color: N.gold, textShadow: neonText(N.gold) }}
        >
          Fichas · monte o stake
        </span>
        <motion.span
          key={total}
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING}
          className="font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums"
          style={{ color: N.green }}
        >
          {brl(total)}
        </motion.span>
      </div>

      {/* pilha (mesa de feltro) */}
      <div
        className="relative mt-4 grid h-[170px] place-items-end justify-center overflow-hidden rounded-2xl"
        style={{
          background: `radial-gradient(circle at 50% 120%, ${N.green}1f, ${N.feltDeep} 70%)`,
          border: `1px solid ${N.line}`,
        }}
      >
        {pile.length === 0 && (
          <span className="absolute top-1/2 -translate-y-1/2 text-sm" style={{ color: N.muteSoft }}>
            toque uma ficha pra apostar
          </span>
        )}
        <div className="relative mb-4" style={{ width: 60, height: Math.min(140, pile.length * 9 + 10) }}>
          <AnimatePresence initial={false}>
            {pile.map((c, i) => (
              <motion.div
                key={c.id}
                className="absolute left-0"
                style={{ bottom: i * 9 }}
                initial={{ y: -160, opacity: 0, rotate: -18 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ ...SPRING, stiffness: 420, damping: 22 }}
              >
                <Chip value={c.v} ring={c.ring} size={60} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* denominações clicáveis */}
      <div className="mt-4 flex items-center justify-center gap-4">
        {DENOMS.map((d) => (
          <motion.button
            key={d.v}
            type="button"
            onClick={() => add(d.v, d.ring)}
            whileTap={{ scale: 0.88 }}
            whileHover={{ y: -3 }}
            transition={SPRING}
            aria-label={`Adicionar ficha de ${d.v}`}
          >
            <Chip value={d.v} ring={d.ring} size={58} />
          </motion.button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold"
          style={{ background: total > 0 ? N.green : N.panelSoft, color: total > 0 ? N.greenInk : N.mute }}
        >
          <Coins size={16} /> {total > 0 ? `Apostar ${brl(total)}` : "Sem fichas ainda"}
        </div>
        <button
          type="button"
          onClick={clear}
          className="grid h-12 w-12 place-items-center rounded-2xl"
          style={{ background: N.panelSoft, color: N.white }}
          aria-label="Limpar pilha"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}
