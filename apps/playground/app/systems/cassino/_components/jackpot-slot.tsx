"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gem, Crown, Coins, Bell, Star, RotateCcw } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { N, SPRING, brl0, seeded, neonText } from "./tokens";

/**
 * Caça-níquel de UM rolo (jackpot). Toque "Girar" -> a fita sobe num whip
 * com blur, desacelera em TWEEN (3+ keyframes) e trava no símbolo-alvo
 * determinístico (seeded por giro). Coroa = JACKPOT dourado + count-up.
 * Render condicional + key no rolo (sem AnimatePresence no giro infinito).
 */

type Sym = "crown" | "gem" | "bell" | "star" | "coin";
const SYMS: Record<Sym, { Icon: typeof Gem; color: string; label: string; prize: number }> = {
  crown: { Icon: Crown, color: N.gold, label: "JACKPOT", prize: 5000 },
  gem: { Icon: Gem, color: N.green, label: "Green grande", prize: 800 },
  bell: { Icon: Bell, color: N.pink, label: "Free bet", prize: 200 },
  star: { Icon: Star, color: N.blue, label: "Boost", prize: 120 },
  coin: { Icon: Coins, color: N.magenta, label: "Fichas", prize: 60 },
};
const ORDER: Sym[] = ["crown", "gem", "bell", "star", "coin"];

const CELL = 104;
const STRIP = 18;
const TARGET_AT = STRIP - 3;

function pick(seed: number) {
  return Math.floor(seeded(seed) * ORDER.length) % ORDER.length;
}

export function JackpotSlot() {
  const [spin, setSpin] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState(false);

  // símbolo-alvo determinístico por giro (jackpot raro: índice 0 só às vezes)
  const targetSym: Sym = spin === 0 ? "gem" : ORDER[pick(spin * 4.7 + 2.3)];
  const cfg = SYMS[targetSym];
  const isJackpot = targetSym === "crown";
  const payout = useCountUp(won ? cfg.prize : 0, 700, spin);

  const restY = -(TARGET_AT * CELL);
  const strip: Sym[] = Array.from({ length: STRIP }, (_, i) =>
    i === TARGET_AT ? targetSym : ORDER[pick(i * 2.7 + spin * 1.3)],
  );

  function go() {
    if (spinning) return;
    setWon(false);
    setSpinning(true);
    setSpin((s) => s + 1);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{
        background: `radial-gradient(circle at 50% 0%, ${N.gold}1a, transparent 55%), linear-gradient(180deg, ${N.panel}, ${N.groundDeep})`,
        border: `1px solid ${N.line}`,
        boxShadow: won && isJackpot ? `0 0 40px ${N.gold}55` : "0 30px 70px -30px rgba(0,0,0,.9)",
      }}
    >
      {won && <Confetti key={spin} colors={isJackpot ? [N.gold, "#fff", N.magenta] : [N.green, N.gold, "#fff"]} spread={170} />}

      <div className="flex items-center justify-between">
        <span
          className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-[0.18em]"
          style={{ color: N.gold, textShadow: neonText(N.gold) }}
        >
          Jackpot · 1 rolo
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: N.mute }}>
          pote {brl0(5000)}
        </span>
      </div>

      {/* rolo */}
      <div className="relative mx-auto mt-5 flex items-center justify-center">
        <div
          className="relative overflow-hidden rounded-[24px]"
          style={{
            width: 150,
            height: CELL,
            background: N.groundDeep,
            border: `2px solid ${N.gold}66`,
            boxShadow: won ? `inset 0 0 0 2px ${cfg.color}, 0 0 24px ${cfg.color}55` : "inset 0 0 24px rgba(0,0,0,.6)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-5"
            style={{ background: `linear-gradient(${N.groundDeep}, transparent)` }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-5"
            style={{ background: `linear-gradient(transparent, ${N.groundDeep})` }}
          />

          <motion.div
            key={spin}
            initial={{ y: spin === 0 ? restY : 0 }}
            animate={
              spin === 0
                ? { y: restY }
                : { y: [0, restY - 18, restY], filter: ["blur(0px)", "blur(4px)", "blur(0px)"] }
            }
            transition={spin === 0 ? { duration: 0 } : { duration: 1.6, ease: [0.1, 0.62, 0.18, 1], times: [0, 0.86, 1] }}
            onAnimationComplete={() => {
              if (spin > 0) {
                setSpinning(false);
                setWon(true);
              }
            }}
          >
            {strip.map((s, i) => {
              const sc = SYMS[s];
              return (
                <div key={i} className="grid place-items-center" style={{ height: CELL }}>
                  <sc.Icon size={52} style={{ color: sc.color }} strokeWidth={2} />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* resultado */}
      <div
        className="mt-5 flex min-h-[52px] items-center justify-center rounded-2xl px-4 py-2 text-center"
        style={{ background: N.groundDeep, border: `1px solid ${N.line}` }}
      >
        {spinning ? (
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-[0.2em]"
            style={{ color: N.mute }}
          >
            girando…
          </motion.span>
        ) : won ? (
          <motion.div
            key={spin}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 480, damping: 16 }}
            className="flex flex-wrap items-baseline justify-center gap-x-2"
          >
            <span
              className="font-[family-name:var(--font-archivo)] text-xl font-black uppercase tracking-tight"
              style={{ color: cfg.color, textShadow: neonText(cfg.color) }}
            >
              {isJackpot ? "JACKPOT!" : cfg.label}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums" style={{ color: N.green }}>
              +{brl0(payout)}
            </span>
          </motion.div>
        ) : (
          <span className="text-sm" style={{ color: N.mute }}>
            Gire — coroa dourada paga o pote.
          </span>
        )}
      </div>

      <motion.button
        type="button"
        onClick={go}
        disabled={spinning}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold disabled:opacity-60"
        style={{ background: N.gold, color: N.groundDeep, boxShadow: `0 0 22px ${N.gold}77` }}
      >
        {won ? <RotateCcw size={18} /> : <Coins size={18} />}
        {won ? "Girar de novo" : "Girar o caça-níquel"}
      </motion.button>
    </div>
  );
}
