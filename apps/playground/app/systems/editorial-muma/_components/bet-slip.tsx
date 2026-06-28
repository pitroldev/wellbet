"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Check, ArrowRight } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { M, SPRING, brl0, odd, FRAUNCES_DISPLAY } from "./tokens";

type Goal = { label: string; sub: string; odd: number };
const GOALS: Goal[] = [
  { label: "Perder 2kg", sub: "em 7 dias", odd: 1.85 },
  { label: "Perder 4kg", sub: "em 14 dias", odd: 2.45 },
  { label: "Treinar 5×", sub: "esta semana", odd: 1.6 },
];

export function BetSlip() {
  const [gi, setGi] = useState(1);
  const [stake, setStake] = useState(50);
  const [placed, setPlaced] = useState(false);
  const [run, setRun] = useState(0);

  const o = GOALS[gi].odd;
  const payout = stake * o;
  const animatedPayout = useCountUp(payout, 550, run + gi + stake);

  function place() {
    setPlaced(true);
    setRun((r) => r + 1);
  }

  return (
    <div className="relative overflow-hidden rounded-[6px] bg-white" style={{ boxShadow: `inset 0 0 0 1px ${M.hair}` }}>
      {placed && <Confetti key={run} colors={[M.pink, M.indigo, M.green]} />}

      {/* cabeçalho editorial */}
      <div className="flex items-baseline justify-between border-b px-6 pb-4 pt-5" style={{ borderColor: M.hair }}>
        <span
          className="font-[family-name:var(--font-fraunces)] text-2xl leading-none"
          style={{ color: M.ink, fontVariationSettings: FRAUNCES_DISPLAY, fontWeight: 500 }}
        >
          O cupom
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: M.inkMute }}>
          ed. nº 01 · 2026
        </span>
      </div>

      <div className="px-6 py-5">
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
          A sua meta
        </span>
        {/* metas como lista refinada com fios */}
        <div className="mt-2 divide-y" style={{ borderColor: M.hair }}>
          {GOALS.map((g, i) => {
            const active = i === gi;
            return (
              <button
                key={g.label}
                type="button"
                onClick={() => {
                  setGi(i);
                  setPlaced(false);
                }}
                className="flex w-full items-center justify-between py-3.5 text-left"
                style={{ borderColor: M.hair }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="grid h-6 w-6 place-items-center rounded-full transition-colors"
                    style={{
                      background: active ? M.indigo : "transparent",
                      boxShadow: active ? "none" : `inset 0 0 0 1.5px ${M.hair}`,
                    }}
                  >
                    {active && <Check size={13} strokeWidth={3} color="#fff" />}
                  </span>
                  <span>
                    <span
                      className="block font-[family-name:var(--font-fraunces)] text-lg leading-none"
                      style={{ color: M.ink, fontVariationSettings: '"SOFT" 40,"WONK" 1,"opsz" 80', fontWeight: active ? 600 : 400 }}
                    >
                      {g.label}
                    </span>
                    <span className="text-xs" style={{ color: M.inkMute }}>
                      {g.sub}
                    </span>
                  </span>
                </span>
                <span
                  className="font-[family-name:var(--font-mono)] text-base tabular-nums"
                  style={{ color: active ? M.indigo : M.inkMute }}
                >
                  {odd(g.odd)}
                </span>
              </button>
            );
          })}
        </div>

        {/* stake slim */}
        <div className="mt-5 flex items-center justify-between border-t pt-4" style={{ borderColor: M.hair }}>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
            Stake
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStake((s) => Math.max(10, s - 10));
                setPlaced(false);
              }}
              className="grid h-9 w-9 place-items-center rounded-full"
              style={{ background: M.white, color: M.ink, boxShadow: `inset 0 0 0 1px ${M.hair}` }}
              aria-label="Diminuir stake"
            >
              <Minus size={15} />
            </button>
            <span className="min-w-[72px] text-center font-[family-name:var(--font-mono)] text-lg tabular-nums" style={{ color: M.ink }}>
              {brl0(stake)}
            </span>
            <button
              type="button"
              onClick={() => {
                setStake((s) => Math.min(500, s + 10));
                setPlaced(false);
              }}
              className="grid h-9 w-9 place-items-center rounded-full"
              style={{ background: M.indigo, color: "#fff" }}
              aria-label="Aumentar stake"
            >
              <Plus size={15} />
            </button>
          </div>
        </div>

        {/* payout — número serif gigante com count-up */}
        <div className="mt-5 border-t pt-5" style={{ borderColor: M.hair }}>
          <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
            Retorno possível
          </span>
          <div className="mt-1 flex items-end gap-2">
            <span
              className="font-[family-name:var(--font-mono)] text-lg leading-none"
              style={{ color: M.inkMute }}
            >
              R$
            </span>
            <motion.span
              key={Math.round(animatedPayout)}
              className="font-[family-name:var(--font-fraunces)] leading-[0.8] tabular-nums"
              style={{
                color: M.indigo,
                fontSize: "clamp(3rem,16vw,4.5rem)",
                fontVariationSettings: FRAUNCES_DISPLAY,
                fontWeight: 500,
              }}
            >
              {animatedPayout.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.span>
          </div>
        </div>

        <motion.button
          type="button"
          onClick={place}
          whileTap={{ scale: 0.98 }}
          transition={SPRING}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full py-4 text-base font-bold"
          style={{ background: placed ? M.green : M.indigo, color: placed ? M.greenInk : "#fff" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {placed ? (
              <motion.span
                key="ok"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={SPRING}
                className="inline-flex items-center gap-2"
              >
                <Check size={18} strokeWidth={3} /> Aposta feita. Bora!
              </motion.span>
            ) : (
              <motion.span
                key="go"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="inline-flex items-center gap-2"
              >
                Apostar em mim <ArrowRight size={17} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        <p className="mt-2 text-center text-xs" style={{ color: M.inkMute }}>
          {placed ? "Cotação " + odd(o) + " travada. Agora é constância." : "A melhor aposta é na sua mudança."}
        </p>
      </div>
    </div>
  );
}
