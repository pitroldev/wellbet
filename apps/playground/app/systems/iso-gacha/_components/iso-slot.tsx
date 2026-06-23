"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Star, Shield, Gift, Zap } from "lucide-react";
import { ISO, SPRING, brl } from "./tokens";
import { IsoCard, IsoButton, IsoTag } from "./iso-primitives";
import { Confetti } from "./confetti";
import { useCountUp } from "./use-count-up";

/**
 * GachaSlot — caça-níquel de UM rolo só (gacha). Girar manda a fita de
 * símbolos pra cima num whip (motion-blur), desacelera e trava com bounce
 * de mola; aí estoura confete e revela o prêmio (sempre positivo). 3D tátil,
 * base clara, zero pisca-pisca de cassino.
 *
 * Runtime-safe: símbolos de filler derivados do index (sem Math.random no
 * render); o scroll usa TWEEN (3+ keyframes); spring só em 2 valores.
 */

type Sym = "coin" | "star" | "shield" | "gift" | "bolt";

const SYMS: Record<Sym, { Icon: typeof Coins; bg: string; shadow: string; fg: string }> = {
  coin: { Icon: Coins, bg: ISO.yellow, shadow: ISO.yellowDeep, fg: ISO.ink },
  star: { Icon: Star, bg: ISO.purple, shadow: ISO.purpleDeep, fg: "#FFFFFF" },
  shield: { Icon: Shield, bg: ISO.green, shadow: ISO.greenDeep, fg: ISO.ink },
  gift: { Icon: Gift, bg: ISO.coral, shadow: ISO.coralDeep, fg: "#FFFFFF" },
  bolt: { Icon: Zap, bg: ISO.purpleSoft, shadow: ISO.purpleDeep, fg: ISO.ink },
};
const ORDER: Sym[] = ["coin", "star", "shield", "gift", "bolt"];

const PRIZES = [
  {
    sym: "coin" as Sym,
    label: "Aposta grátis",
    value: 25,
    accent: ISO.yellowDeep,
  },
  {
    sym: "shield" as Sym,
    label: "Shield extra",
    value: 0,
    accent: ISO.greenDeep,
  },
  {
    sym: "star" as Sym,
    label: "Boost de cotação +0,30x",
    value: 0,
    accent: ISO.purple,
  },
];

const CELL = 116;
const STRIP = 16;
const TARGET_AT = STRIP - 3; // alvo perto do fim, 2 fillers depois (overshoot)

/** Pseudo-random determinístico por index — sem Math.random no render. */
function pick(seed: number) {
  const x = Math.sin(seed * 91.7 + 47.3) * 43758.5453;
  return Math.floor((x - Math.floor(x)) * ORDER.length) % ORDER.length;
}

function Tile({ s, size = 80 }: { s: Sym; size?: number }) {
  const cfg = SYMS[s];
  return (
    <div
      className="grid place-items-center rounded-[22px]"
      style={{
        width: size,
        height: size,
        background: cfg.bg,
        border: `3px solid ${ISO.ink}`,
        boxShadow: `4px 5px 0 ${cfg.shadow}`,
      }}
    >
      <cfg.Icon size={size * 0.46} color={cfg.fg} strokeWidth={2.4} />
    </div>
  );
}

function Payout({ value }: { value: number }) {
  const v = useCountUp(value, 600, value);
  return <>{brl(v, false)}</>;
}

export function GachaSlot() {
  const [spin, setSpin] = useState(0); // 0 = nunca girou; também é a key do rolo
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState(false);

  const prize = PRIZES[(spin === 0 ? 0 : spin - 1) % PRIZES.length];
  const restY = -(TARGET_AT * CELL);

  // fita: fillers determinísticos + alvo em TARGET_AT
  const strip: Sym[] = Array.from({ length: STRIP }, (_, i) =>
    i === TARGET_AT ? prize.sym : ORDER[pick(i * 2.3 + spin * 0.7)],
  );

  const girar = () => {
    if (spinning) return;
    setWon(false);
    setSpinning(true);
    setSpin((s) => s + 1);
  };

  return (
    <IsoCard className="relative overflow-hidden p-6 sm:p-7" shadow={ISO.purpleDeep} bg="#FFFFFF">
      {won && <Confetti count={26} />}

      <div className="flex items-center justify-between">
        <IsoTag bg={ISO.yellow} fg={ISO.ink}>
          <Sparkle /> Gacha · 1 rolo
        </IsoTag>
        <span
          className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-wide"
          style={{ color: ISO.inkSoft }}
        >
          gira e ganha
        </span>
      </div>

      {/* rolo único */}
      <div className="relative mt-5 flex items-center justify-center gap-3">
        <Arrow dir="right" />
        <div
          className="relative overflow-hidden rounded-[26px]"
          style={{
            width: 150,
            height: CELL,
            background: ISO.base,
            border: `3px solid ${ISO.ink}`,
            boxShadow: won ? `inset 0 0 0 3px ${ISO.green}` : `inset 0 0 0 0 transparent`,
            transition: "box-shadow 0.2s",
          }}
        >
          {/* fades de profundidade topo/baixo */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-5"
            style={{ background: `linear-gradient(${ISO.base}, transparent)` }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-5"
            style={{ background: `linear-gradient(transparent, ${ISO.base})` }}
          />

          <motion.div
            key={spin}
            initial={{ y: spin === 0 ? restY : 0 }}
            animate={
              spin === 0
                ? { y: restY }
                : {
                    y: [0, restY - 16, restY],
                    filter: ["blur(0px)", "blur(3px)", "blur(0px)"],
                  }
            }
            transition={
              spin === 0
                ? { duration: 0 }
                : {
                    duration: 1.45,
                    ease: [0.1, 0.62, 0.18, 1],
                    times: [0, 0.88, 1],
                  }
            }
            onAnimationComplete={() => {
              if (spin > 0) {
                setSpinning(false);
                setWon(true);
              }
            }}
          >
            {strip.map((s, i) => (
              <div key={i} className="grid place-items-center" style={{ height: CELL }}>
                <Tile s={s} />
              </div>
            ))}
          </motion.div>

          {/* pulso verde do prêmio ao travar */}
          {won && !spinning && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-10 rounded-[26px]"
              style={{ boxShadow: `inset 0 0 22px ${ISO.green}66` }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </div>
        <Arrow dir="left" />
      </div>

      {/* resultado */}
      <div
        className="mt-5 flex min-h-[52px] items-center justify-center rounded-2xl px-4 py-2 text-center"
        style={{ background: ISO.base, border: `2.5px solid ${ISO.baseDeep}` }}
      >
        {spinning ? (
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: ISO.inkSoft }}
          >
            girando…
          </motion.span>
        ) : won ? (
          <motion.div
            key={spin}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 520, damping: 16 }}
            className="flex flex-wrap items-baseline justify-center gap-x-2"
          >
            <span
              className="font-[family-name:var(--font-display)] text-xl font-bold tabular-nums"
              style={{ color: prize.accent }}
            >
              {prize.value > 0 ? <Payout value={prize.value} /> : "BOOST!"}
            </span>
            <span className="text-sm font-bold" style={{ color: ISO.ink }}>
              {prize.label}
            </span>
          </motion.div>
        ) : (
          <span className="text-sm font-medium" style={{ color: ISO.inkSoft }}>
            Manteve a streak? Gire e pegue seu prêmio.
          </span>
        )}
      </div>

      <div className="mt-5 flex justify-center">
        <IsoButton
          onClick={girar}
          disabled={spinning}
          bg={ISO.green}
          fg={ISO.ink}
          shadow={ISO.greenDeep}
        >
          <Coins size={16} className="mr-1 inline" /> {won ? "Girar de novo" : "Girar"}
        </IsoButton>
      </div>
    </IsoCard>
  );
}

function Sparkle() {
  return <Star size={12} fill={ISO.ink} color={ISO.ink} />;
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <span
      aria-hidden
      style={{
        width: 0,
        height: 0,
        borderTop: "9px solid transparent",
        borderBottom: "9px solid transparent",
        [dir === "right" ? "borderLeft" : "borderRight"]: `12px solid ${ISO.green}`,
      }}
    />
  );
}
