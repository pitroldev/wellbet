"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Zap, Check } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { B, BORDER, BORDER_THIN, shadow, TWEEN, brl, odd } from "./tokens";
import { Block, BrutalButton, MonoLabel, RecDot } from "./primitives";

type Goal = { label: string; sub: string; odd: number };
const GOALS: Goal[] = [
  { label: "PERDER 2KG", sub: "EM 7 DIAS", odd: 1.85 },
  { label: "PERDER 4KG", sub: "EM 14 DIAS", odd: 2.45 },
  { label: "TREINAR 5×", sub: "ESTA SEMANA", odd: 1.6 },
];

export function BetSlip() {
  const [gi, setGi] = useState(1);
  const [stake, setStake] = useState(50);
  const [placed, setPlaced] = useState(false);
  const [run, setRun] = useState(0);

  const o = GOALS[gi].odd;
  const payout = stake * o;
  const animatedPayout = useCountUp(payout, 480, run + gi * 1000 + stake);

  function reset() {
    setPlaced(false);
  }
  function place() {
    setPlaced(true);
    setRun((r) => r + 1);
  }

  return (
    <Block bg={B.white} off={8} className="overflow-hidden">
      {placed && <Confetti key={run} colors={[B.magenta, B.green, B.blue, B.pink]} />}

      {/* cabeçalho — talão de aposta */}
      <div className="flex items-center justify-between px-4 py-3" style={{ background: B.ink }}>
        <span className="font-[family-name:var(--font-archivo)] text-base font-black uppercase tracking-wide text-white">
          CUPOM // APOSTE EM VOCÊ
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold tabular-nums" style={{ color: B.green }}>
          #BR-2026
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <MonoLabel style={{ color: B.ink, opacity: 0.6 }}>METAS // ESCOLHA 1</MonoLabel>
          <RecDot />
        </div>

        {/* tabela mono de metas */}
        <div className="mt-3" style={{ border: BORDER }}>
          {GOALS.map((g, i) => {
            const active = i === gi;
            return (
              <button
                key={g.label}
                type="button"
                onClick={() => {
                  setGi(i);
                  reset();
                }}
                className="flex w-full items-center justify-between px-3 py-3 text-left"
                style={{
                  background: active ? B.magenta : B.white,
                  color: active ? "#FFFFFF" : B.ink,
                  borderBottom: i < GOALS.length - 1 ? BORDER_THIN : "none",
                  minHeight: 56,
                }}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="grid h-5 w-5 place-items-center"
                    style={{ border: `2px solid ${active ? "#FFFFFF" : B.ink}`, background: active ? "#FFFFFF" : "transparent" }}
                  >
                    {active && <Check size={13} strokeWidth={4} style={{ color: B.magenta }} />}
                  </span>
                  <span>
                    <span className="block font-[family-name:var(--font-archivo)] text-sm font-black uppercase tracking-wide">
                      {g.label}
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider opacity-80">
                      {g.sub}
                    </span>
                  </span>
                </span>
                <span className="font-[family-name:var(--font-mono)] text-xl font-bold tabular-nums">
                  {odd(g.odd)}
                </span>
              </button>
            );
          })}
        </div>

        {/* stake */}
        <div className="mt-4 flex items-center justify-between px-3 py-3" style={{ border: BORDER }}>
          <MonoLabel style={{ color: B.ink }}>STAKE</MonoLabel>
          <div className="flex items-center gap-3">
            <ChunkyStep onClick={() => { setStake((s) => Math.max(10, s - 10)); reset(); }} bg={B.white} fg={B.ink}>
              <Minus size={18} strokeWidth={3.5} />
            </ChunkyStep>
            <span className="min-w-[96px] text-center font-[family-name:var(--font-mono)] text-xl font-bold tabular-nums" style={{ color: B.ink }}>
              {brl(stake)}
            </span>
            <ChunkyStep onClick={() => { setStake((s) => Math.min(500, s + 10)); reset(); }} bg={B.blue} fg="#FFFFFF">
              <Plus size={18} strokeWidth={3.5} />
            </ChunkyStep>
          </div>
        </div>

        {/* payout mono GIGANTE */}
        <div className="mt-4 px-4 py-4" style={{ background: B.green, border: BORDER }}>
          <div className="flex items-center justify-between">
            <MonoLabel style={{ color: B.ink }}>RETORNO POSSÍVEL</MonoLabel>
            <span className="font-[family-name:var(--font-mono)] text-xs font-bold tabular-nums" style={{ color: B.ink }}>
              ×{odd(o)}
            </span>
          </div>
          <motion.p
            key={Math.round(animatedPayout)}
            className="mt-1 font-[family-name:var(--font-mono)] text-4xl font-bold leading-none tabular-nums sm:text-5xl"
            style={{ color: B.ink }}
          >
            {brl(animatedPayout)}
          </motion.p>
        </div>

        <BrutalButton
          onClick={place}
          bg={placed ? B.ink : B.magenta}
          fg={placed ? B.green : "#FFFFFF"}
          off={8}
          className="mt-4 w-full"
          style={{ minHeight: 56 }}
        >
          {placed ? (
            <>
              <Check size={18} strokeWidth={3.5} /> APOSTA REGISTRADA
            </>
          ) : (
            <>
              <Zap size={18} fill="currentColor" /> FAZER APOSTA
            </>
          )}
        </BrutalButton>
        {placed && (
          <p className="mt-2 text-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-wide" style={{ color: B.ink, opacity: 0.6 }}>
            sem firula. só foco. toque numa meta pra refazer.
          </p>
        )}
      </div>
    </Block>
  );
}

function ChunkyStep({
  children,
  onClick,
  bg,
  fg,
}: {
  children: React.ReactNode;
  onClick: () => void;
  bg: string;
  fg: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={false}
      animate={{ x: 0, y: 0, boxShadow: shadow(4) }}
      whileTap={{ x: 4, y: 4, boxShadow: shadow(0) }}
      transition={TWEEN}
      className="grid h-11 w-11 place-items-center"
      style={{ background: bg, color: fg, border: BORDER }}
    >
      {children}
    </motion.button>
  );
}
