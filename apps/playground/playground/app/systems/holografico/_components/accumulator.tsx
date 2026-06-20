"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Check, Zap } from "lucide-react";
import { FOIL, HOLO, brl, odd } from "./tokens";
import { GlassLabel, IridBurst } from "./primitives";
import { useCountUp } from "./use-count-up";

/**
 * ACUMULADORA = streak de metas. Cada perna acende o foil; o multiplicador e o
 * retorno potencial sobem em count-up. Adicionar perna = pop + faísca.
 */

type Leg = { id: string; label: string; odd: number };

const POOL: Leg[] = [
  { id: "l1", label: "Treino seg/qua/sex", odd: 1.4 },
  { id: "l2", label: "Dormir 7h por 14 dias", odd: 1.55 },
  { id: "l3", label: "Sem açúcar · 30 dias", odd: 1.7 },
  { id: "l4", label: "Ler 20 min/dia", odd: 1.35 },
  { id: "l5", label: "10k passos/dia", odd: 1.5 },
];

const STAKE = 50;

export function Accumulator() {
  const [picked, setPicked] = useState<string[]>(["l1", "l2"]);
  const [burst, setBurst] = useState(0);

  const legs = POOL.filter((l) => picked.includes(l.id));
  const mult = legs.reduce((acc, l) => acc * l.odd, 1);
  const payout = STAKE * mult;

  const animMult = useCountUp(mult, 520);
  const animPayout = useCountUp(payout, 600);

  function toggle(id: string) {
    setPicked((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      setBurst((b) => b + 1);
      return [...cur, id];
    });
  }

  return (
    <div className="relative space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 p-4 text-center backdrop-blur-md">
        <span
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{ background: FOIL, backgroundSize: "200% 200%" }}
        />
        <IridBurst burstKey={burst} count={14} />
        <div className="relative">
          <GlassLabel className="text-[#A6A6C8]">multiplicador acumulado</GlassLabel>
          <motion.div
            key={Math.round(mult * 100)}
            initial={{ scale: 1.16 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 18 }}
            className="mt-1 font-[family-name:var(--font-display)] text-4xl font-extrabold tabular-nums text-[#F2F2FA]"
          >
            {odd(animMult)}x
          </motion.div>
          <p className="mt-1 text-[11px] text-[#A6A6C8]">
            {legs.length} {legs.length === 1 ? "perna" : "pernas"} · stake R$ {brl(STAKE)} ·{" "}
            <span className="font-[family-name:var(--font-mono)] font-bold text-[#34F5A0]">
              R$ {brl(animPayout)}
            </span>{" "}
            se der green
          </p>
        </div>
      </div>

      <div className="grid gap-2">
        {POOL.map((l) => {
          const on = picked.includes(l.id);
          return (
            <motion.button
              key={l.id}
              type="button"
              onClick={() => toggle(l.id)}
              whileTap={{ scale: 0.98 }}
              aria-pressed={on}
              className="flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors"
              style={{
                borderColor: on ? "rgba(52, 245, 160,0.4)" : "rgba(255,255,255,0.10)",
                background: on ? "rgba(52, 245, 160,0.07)" : "rgba(255,255,255,0.03)",
              }}
            >
              <span className="flex items-center gap-2.5">
                <span
                  className="grid h-6 w-6 place-items-center rounded-md"
                  style={{
                    background: on ? HOLO.green : "rgba(255,255,255,0.06)",
                    color: on ? "#06140C" : HOLO.inkSoft,
                  }}
                >
                  {on ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
                <span className="text-sm font-medium text-[#F2F2FA]">{l.label}</span>
              </span>
              <span
                className="font-[family-name:var(--font-mono)] text-sm font-bold tabular-nums"
                style={{ color: on ? HOLO.green : HOLO.inkSoft }}
              >
                {odd(l.odd)}x
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-[#A6A6C8]">
        <Zap className="h-3 w-3 text-[#22D3EE]" />
        toque para empilhar metas — todas têm que dar green para pagar.
      </p>
    </div>
  );
}
