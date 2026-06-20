"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { HudLabel, PixelCoin, PixelStar, PixelShield, PixelFlame, seeded } from "./primitives";
import { CoinRain } from "./coin-rain";
import { brl, useCountUp } from "./use-count-up";

/**
 * FREE BET / recompensa por consistência — agora um CAÇA-NÍQUEL 8-bit.
 * Manter a streak enche o medidor e libera o giro. Puxar a alavanca gira 3
 * rolos que sobem rápido (com motion-blur), param escalonados com "ka-chunk"
 * (overshoot), acendem a payline e estouram chuva de moedas + count-up.
 * O resultado é SEMPRE positivo (aposta grátis / boost) — recompensa por
 * esforço, nunca um jogo de azar contra a casa.
 *
 * Runtime-safe: símbolos derivados do index via `seeded` (sem Math.random no
 * render); animações de 3+ keyframes usam TWEEN; spring só em 2 valores.
 */

type Sym = "coin" | "star" | "shield" | "flame" | "seven";
const ALL: Sym[] = ["coin", "star", "shield", "flame", "seven"];

const PRIZES = [
  { sym: "coin" as Sym, label: "Aposta grátis", value: 25, accent: "#FFD60A" },
  { sym: "shield" as Sym, label: "Shield extra", value: 0, accent: "#22E06B" },
  {
    sym: "star" as Sym,
    label: "Boost de cotação +0,30x",
    value: 0,
    accent: "#8B5CF6",
  },
];

const CELL = 76; // altura de uma célula / janela do rolo
const STRIP = 24; // comprimento da fita (giro longo = whip rápido)
const TARGET_AT = STRIP - 3; // alvo perto do fim (sobram 2 fillers p/ overshoot)

function SymGlyph({ s, size = 42 }: { s: Sym; size?: number }) {
  switch (s) {
    case "coin":
      return <PixelCoin size={size} />;
    case "star":
      return <PixelStar size={size} fill="#8B5CF6" />;
    case "shield":
      return <PixelShield size={size} fill="#22E06B" />;
    case "flame":
      return <PixelFlame size={size} />;
    case "seven":
      return (
        <span
          className="font-[family-name:var(--font-display)] leading-none text-[#FFD60A]"
          style={{ fontSize: Math.round(size * 0.62) }}
        >
          7
        </span>
      );
  }
}

/** Fita determinística: fillers variados + o alvo em TARGET_AT (símbolos iguais nos 3 rolos = match). */
function buildStrip(target: Sym, reel: number, spin: number): Sym[] {
  const arr: Sym[] = [];
  for (let i = 0; i < STRIP; i++) {
    if (i === TARGET_AT) {
      arr.push(target);
    } else {
      const pick = Math.floor(seeded(i * 3.1 + reel * 17.7 + spin * 0.13) * ALL.length);
      arr.push(ALL[pick % ALL.length]);
    }
  }
  return arr;
}

function Reel({
  target,
  reel,
  spin,
  dur,
  spinning,
  won,
  onSettle,
}: {
  target: Sym;
  reel: number;
  spin: number;
  dur: number;
  spinning: boolean;
  won: boolean;
  onSettle?: () => void;
}) {
  const [flash, setFlash] = useState(0);
  const strip = useMemo(() => buildStrip(target, reel, spin), [target, reel, spin]);
  const restY = -(TARGET_AT * CELL);

  return (
    <div
      className="relative flex-1 overflow-hidden bg-[#06140C]"
      style={{
        height: CELL,
        boxShadow: won
          ? "inset 0 0 0 3px #22E06B, inset 0 0 22px rgba(34,224,107,0.55)"
          : "inset 0 0 0 3px #2E1065",
        transition: "box-shadow 0.15s",
      }}
    >
      {/* sombras de topo/baixo da janela (profundidade do rolo) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-4 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-4 bg-gradient-to-t from-black/70 to-transparent" />

      <motion.div
        key={spin}
        initial={{ y: spin === 0 ? restY : 0 }}
        animate={
          spin === 0
            ? { y: restY }
            : {
                y: [0, restY - 14, restY],
                filter: ["blur(0px)", "blur(2.5px)", "blur(0px)"],
              }
        }
        transition={
          spin === 0
            ? { duration: 0 }
            : {
                duration: dur,
                ease: [0.12, 0.62, 0.18, 1],
                times: [0, 0.88, 1],
              }
        }
        onAnimationComplete={() => {
          if (spin > 0) {
            setFlash((f) => f + 1);
            onSettle?.();
          }
        }}
      >
        {strip.map((s, i) => (
          <div key={i} className="grid place-items-center" style={{ height: CELL }}>
            <SymGlyph s={s} />
          </div>
        ))}
      </motion.div>

      {/* flash de "ka-chunk" quando o rolo trava */}
      <AnimatePresence>
        {flash > 0 && (
          <motion.span
            key={flash}
            className="pointer-events-none absolute inset-0 z-10 bg-[#22E06B]"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* glow pulsante do símbolo vencedor */}
      {won && !spinning && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          style={{ boxShadow: "inset 0 0 18px rgba(34,224,107,0.6)" }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

/** Count-up do prêmio em R$, anima de 0 → value a cada giro (key por spin). */
function Payout({ value }: { value: number }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    setT(value);
  }, [value]);
  const v = useCountUp(t, 600);
  return <>R$ {brl(v)}</>;
}

export function FreeBetDrop() {
  const [spin, setSpin] = useState(0); // 0 = nunca girou; também é a key de remontagem dos rolos
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState(false);
  const [burst, setBurst] = useState(0);
  const cabinet = useAnimationControls();

  // prêmio do giro atual (cicla — determinístico, sem Math.random)
  const prize = PRIZES[(spin === 0 ? 0 : spin - 1) % PRIZES.length];

  // durações escalonadas: o rolo 2 para por último e dispara o payoff
  const DURS = [1.05, 1.45, 1.9];

  const pull = () => {
    if (spinning) return;
    setWon(false);
    setSpinning(true);
    setSpin((s) => s + 1);
  };

  const handleSettle = () => {
    // disparado pelo onAnimationComplete do rolo mais lento (índice 2)
    setSpinning(false);
    setWon(true);
    setBurst((b) => b + 1);
    cabinet.start({
      x: [0, -6, 6, -5, 5, -3, 3, 0],
      transition: { duration: 0.5, ease: "easeOut" },
    });
  };

  return (
    <motion.div
      animate={cabinet}
      className="relative overflow-hidden bg-[#1C1140] p-5 sm:p-6"
      style={{ boxShadow: "0 0 0 4px #6D28D9, 10px 10px 0 0 #2E1065" }}
    >
      <CoinRain burstKey={burst} mode="rain" count={28} />

      <div className="flex items-center justify-between">
        <HudLabel className="text-[11px] text-[#9D8FC7]">FREE BET · CONSISTÊNCIA</HudLabel>
        <span className="flex items-center gap-1.5 bg-[#120A24] px-2.5 py-1.5">
          <PixelStar size={14} fill="#FFD60A" />
          <HudLabel className="text-[10px] text-[#FFD60A]">DESBLOQUEADO</HudLabel>
        </span>
      </div>

      <p className="mt-3 font-[family-name:var(--font-body)] text-sm leading-relaxed text-[#EDE9FE]">
        <strong className="text-[#FFD60A]">7 dias seguidos</strong> de check-in encheram o medidor.
        Puxe a alavanca e gire — o drop é sempre <span className="text-[#22E06B]">a seu favor</span>
        .
      </p>

      {/* marquee da máquina */}
      <div
        className="relative mt-4 flex items-center justify-center gap-2 bg-[#120A24] py-2"
        style={{ boxShadow: "inset 0 0 0 3px #2E1065" }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2"
            style={{ background: i % 2 ? "#22E06B" : "#FFD60A" }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.12,
              ease: "easeInOut",
            }}
          />
        ))}
        <HudLabel className="px-2 text-[11px] text-[#EDE9FE]">FREE BET</HudLabel>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={`r${i}`}
            className="h-2 w-2"
            style={{ background: i % 2 ? "#FFD60A" : "#22E06B" }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.12 + 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* rolos + payline */}
      <div className="relative mt-3 flex items-stretch">
        {/* seta payline esquerda */}
        <motion.span
          className="absolute -left-1 top-1/2 z-30 -translate-y-1/2 font-[family-name:var(--font-display)] text-sm text-[#22E06B]"
          animate={won ? { x: [0, 4, 0], opacity: 1 } : { opacity: 0.5 }}
          transition={{ duration: 0.6, repeat: won ? Infinity : 0 }}
        >
          ▶
        </motion.span>

        <div className="flex w-full gap-[3px] bg-[#2E1065] p-[3px]">
          {[0, 1, 2].map((r) => (
            <Reel
              key={r}
              reel={r}
              target={prize.sym}
              spin={spin}
              dur={DURS[r]}
              spinning={spinning}
              won={won}
              onSettle={r === 2 ? handleSettle : undefined}
            />
          ))}
        </div>

        <motion.span
          className="absolute -right-1 top-1/2 z-30 -translate-y-1/2 font-[family-name:var(--font-display)] text-sm text-[#22E06B]"
          animate={won ? { x: [0, -4, 0], opacity: 1 } : { opacity: 0.5 }}
          transition={{ duration: 0.6, repeat: won ? Infinity : 0 }}
        >
          ◀
        </motion.span>
      </div>

      {/* faixa de resultado */}
      <div
        className="mt-3 flex min-h-[44px] items-center justify-center bg-[#120A24] px-3 py-2"
        style={{ boxShadow: "inset 0 0 0 3px #2E1065" }}
      >
        {spinning ? (
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="font-[family-name:var(--font-hud)] text-[11px] uppercase tracking-[0.2em] text-[#9D8FC7]"
          >
            girando os rolos…
          </motion.span>
        ) : won ? (
          <motion.div
            key={spin}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 560, damping: 16 }}
            className="flex items-center gap-2 text-center"
          >
            <SymGlyph s={prize.sym} size={22} />
            <span>
              <span
                className="font-[family-name:var(--font-display)] text-sm"
                style={{ color: prize.accent }}
              >
                {prize.value > 0 ? <Payout value={prize.value} /> : "BOOST!"}
              </span>
              <span className="ml-2 font-[family-name:var(--font-body)] text-xs text-[#EDE9FE]">
                {prize.label}
              </span>
            </span>
          </motion.div>
        ) : (
          <span className="font-[family-name:var(--font-hud)] text-[11px] uppercase tracking-[0.18em] text-[#9D8FC7]">
            três iguais = prêmio · puxe a alavanca ↓
          </span>
        )}
      </div>

      {/* botão-alavanca arcade */}
      <motion.button
        onClick={pull}
        disabled={spinning}
        whileTap={{ x: 3, y: 3 }}
        className="mt-4 flex w-full items-center justify-center gap-2 bg-[#FFD60A] px-5 py-4 font-[family-name:var(--font-display)] text-xs text-[#120A24] disabled:opacity-60"
        style={{ boxShadow: "5px 5px 0 0 #B8860B" }}
      >
        <motion.span
          animate={spinning ? { rotate: [0, -18, 0] } : { rotate: 0 }}
          transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
          className="inline-flex"
        >
          <PixelCoin size={18} />
        </motion.span>
        {spinning ? "GIRANDO…" : won ? "GIRAR DE NOVO" : "PUXAR ALAVANCA"}
      </motion.button>
    </motion.div>
  );
}
