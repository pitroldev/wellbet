"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Zap, Check, ChevronRight } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { R, brl, odd, halftone, PRINT_SHADOW, STAMP_SPRING } from "./tokens";
import { Stamp } from "./print-kit";

type Goal = { label: string; sub: string; odd: number };
const GOALS: Goal[] = [
  { label: "Perder 2kg", sub: "em 7 dias", odd: 1.85 },
  { label: "Perder 4kg", sub: "em 14 dias", odd: 2.45 },
  { label: "Treinar 5×", sub: "esta semana", odd: 1.6 },
];

/** Cupom-pôster: ticket impresso, linha tracejada de perfuração, halftone, stake, payout. */
export function Ticket() {
  const [gi, setGi] = useState(1);
  const [stake, setStake] = useState(50);
  const [placed, setPlaced] = useState(false);
  const [run, setRun] = useState(0);

  const o = GOALS[gi].odd;
  const payout = stake * o;
  const animated = useCountUp(payout, 520, run + gi + stake);

  function place() {
    setPlaced(true);
    setRun((r) => r + 1);
  }

  return (
    <div className="relative" style={{ filter: `drop-shadow(${PRINT_SHADOW})` }}>
      {placed && <Confetti key={run} colors={[R.magenta, R.blue, R.green, R.pink]} />}

      <div className="relative overflow-hidden" style={{ background: R.paper, border: `2.5px solid ${R.ink}` }}>
        {/* halftone de fundo */}
        <span aria-hidden className="pointer-events-none absolute inset-0" style={{ ...halftone(R.pink, 9, 0.3), mixBlendMode: "multiply", opacity: 0.5 }} />

        {/* topo do ticket */}
        <div className="relative flex items-start justify-between gap-3 px-5 pt-5">
          <div>
            <p className="font-[family-name:var(--font-archivo)] text-2xl font-extrabold uppercase leading-none" style={{ color: R.ink }}>
              Cupom
            </p>
            <p className="mt-1 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wider" style={{ color: R.ink }}>
              aposte em você · #RISO-2026
            </p>
          </div>
          <Stamp color={R.magenta} rotate={6} style={{ fontSize: 11 }}>
            ed. limitada
          </Stamp>
        </div>

        {/* metas / odds */}
        <div className="relative mt-4 space-y-2 px-5">
          {GOALS.map((g, i) => {
            const active = i === gi;
            return (
              <motion.button
                key={g.label}
                type="button"
                onClick={() => {
                  setGi(i);
                  setPlaced(false);
                }}
                whileTap={{ scale: 0.98 }}
                transition={STAMP_SPRING}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
                style={{
                  background: active ? R.blue : R.paper,
                  color: active ? "#fff" : R.ink,
                  border: `2.5px solid ${R.ink}`,
                  boxShadow: active ? "3px 3px 0 0 " + R.ink : "none",
                }}
              >
                <span>
                  <span className="block text-sm font-extrabold uppercase" style={{ fontFamily: "var(--font-archivo)" }}>
                    {g.label}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-[11px]" style={{ opacity: 0.8 }}>
                    {g.sub}
                  </span>
                </span>
                <span className="font-[family-name:var(--font-mono)] text-lg font-semibold tabular-nums">
                  {odd(g.odd)}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* stake */}
        <div className="relative mt-4 flex items-center justify-between px-5">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: R.ink }}>
            stake
          </span>
          <div className="flex items-center gap-3">
            <StakeBtn onClick={() => { setStake((s) => Math.max(10, s - 10)); setPlaced(false); }} bg={R.paper}>
              <Minus size={16} strokeWidth={3} />
            </StakeBtn>
            <span className="min-w-[92px] text-center font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums" style={{ color: R.ink }}>
              {brl(stake)}
            </span>
            <StakeBtn onClick={() => { setStake((s) => Math.min(500, s + 10)); setPlaced(false); }} bg={R.blue} fg="#fff">
              <Plus size={16} strokeWidth={3} />
            </StakeBtn>
          </div>
        </div>

        {/* perfuração / linha de corte */}
        <Perforation />

        {/* payout */}
        <div className="relative flex items-end justify-between px-5 pt-4">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.16em]" style={{ color: R.ink }}>
            retorno possível
          </span>
          <motion.span
            key={Math.round(animated)}
            className="font-[family-name:var(--font-mono)] text-4xl font-medium tabular-nums"
            style={{ color: R.indigo }}
          >
            {brl(animated)}
          </motion.span>
        </div>

        <div className="relative px-5 pb-5 pt-4">
          <motion.button
            type="button"
            onClick={place}
            whileTap={{ scale: 0.98, x: 2, y: 2 }}
            transition={STAMP_SPRING}
            className="flex w-full items-center justify-center gap-2 py-4 text-base font-extrabold uppercase"
            style={{
              background: placed ? R.green : R.magenta,
              color: placed ? R.greenInk : "#fff",
              border: `2.5px solid ${R.ink}`,
              boxShadow: "4px 4px 0 0 " + R.ink,
              fontFamily: "var(--font-archivo)",
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {placed ? (
                <motion.span key="ok" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={STAMP_SPRING} className="inline-flex items-center gap-2">
                  <Check size={18} strokeWidth={3.5} /> Impressa — boa sorte… ou melhor, foco!
                </motion.span>
              ) : (
                <motion.span key="go" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-2">
                  <Zap size={18} fill="#fff" /> Imprimir cupom <ChevronRight size={16} strokeWidth={3} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function StakeBtn({ children, onClick, bg, fg = R.ink }: { children: React.ReactNode; onClick: () => void; bg: string; fg?: string }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      transition={STAMP_SPRING}
      className="grid h-9 w-9 place-items-center"
      style={{ background: bg, color: fg, border: `2.5px solid ${R.ink}` }}
    >
      {children}
    </motion.button>
  );
}

/** Linha de perfuração com "furos" semicirculares nas laterais (estética ticket). */
function Perforation() {
  return (
    <div className="relative mt-4 h-5">
      <span className="absolute left-[-13px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full" style={{ background: R.paperDeep, border: `2.5px solid ${R.ink}` }} />
      <span className="absolute right-[-13px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full" style={{ background: R.paperDeep, border: `2.5px solid ${R.ink}` }} />
      <span
        aria-hidden
        className="absolute left-3 right-3 top-1/2 -translate-y-1/2 border-t-[2.5px]"
        style={{ borderColor: R.ink, borderStyle: "dashed" }}
      />
    </div>
  );
}
