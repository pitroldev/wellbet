"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cherry, Crown, Diamond, Gem, Bell } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { J, SPRING, CARD, GLOW_MAGENTA, GLOW_GREEN, brl0, seeded } from "./tokens";
import { MarqueeFrame } from "./marquee";

/**
 * SlotMachine — caça-níqueis de 3 ROLOS (HERO). Puxa a alavanca:
 *  - cada rolo gira numa fita longa (TWEEN com desaceleração), com motion-blur;
 *  - os rolos PARAM ESCALONADOS (delays/durações crescentes — ka-chunk);
 *  - resultado DETERMINÍSTICO por contador de giro (seeded), com jackpot
 *    "plantado" a cada 3 giros pra a recompensa acontecer de verdade.
 * Match dos 3 símbolos = JACKPOT: chuva de moedas (Confetti dourado/magenta)
 * + count-up grande + glow neon.
 *
 * Regra dura: render condicional + key no rolo (sem AnimatePresence na
 * repetição de giro); símbolos giram em tween (3+ keyframes), nunca spring.
 */

type Sym = { Icon: typeof Cherry; color: string };

const SYMBOLS: Sym[] = [
  { Icon: Cherry, color: J.pink },
  { Icon: Diamond, color: J.blueSoft },
  { Icon: Bell, color: J.gold },
  { Icon: Gem, color: J.green },
  { Icon: Crown, color: J.magenta },
];

const CELL = 92; // altura de cada símbolo
const STRIP = 24; // símbolos por fita de giro
const PAYOUTS = [0, 0, 0, 0, 4200]; // multiplicado pela aposta; índice = símbolo do jackpot

/** Símbolo determinístico por (rolo, índice, giro) — sem random em render. */
function symAt(reel: number, i: number, spin: number) {
  return Math.floor(seeded(reel * 31.7 + i * 2.3 + spin * 7.1) * SYMBOLS.length) % SYMBOLS.length;
}

/** Resultado plantado: a cada 3 giros é JACKPOT (3 iguais); senão, 2 iguais ou misto. */
function plannedResult(spin: number): [number, number, number] {
  if (spin === 0) return [0, 2, 4]; // estado inicial (sem premiação)
  const jackpot = spin % 3 === 0;
  const base = Math.floor(seeded(spin * 5.5) * SYMBOLS.length) % SYMBOLS.length;
  if (jackpot) return [base, base, base];
  const b = (base + 1) % SYMBOLS.length;
  const c = (base + 2) % SYMBOLS.length;
  // 2 iguais (quase): green do "deu green" leve
  return spin % 2 === 0 ? [base, base, c] : [base, b, c];
}

function Reel({
  reel,
  spin,
  result,
  spinning,
  onStop,
}: {
  reel: number;
  spin: number;
  result: number;
  spinning: boolean;
  onStop: () => void;
}) {
  // fita: fillers determinísticos + símbolo final na penúltima célula
  const target = STRIP - 2;
  const strip = Array.from({ length: STRIP }, (_, i) =>
    i === target ? result : symAt(reel, i, spin),
  );
  const restY = -(target * CELL);
  const dur = 1.0 + reel * 0.45; // rolos param escalonados (ka-chunk)

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        width: CELL,
        height: CELL,
        background: "rgba(10,4,48,.85)",
        boxShadow: "inset 0 0 0 2px rgba(255,255,255,.14), inset 0 -10px 20px -10px rgba(0,0,0,.8)",
      }}
    >
      {/* fades de profundidade topo/baixo */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-4" style={{ background: "linear-gradient(rgba(10,4,48,1),transparent)" }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-4" style={{ background: "linear-gradient(transparent,rgba(10,4,48,1))" }} />
      {/* linha de premiação */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-[2px] -translate-y-1/2" style={{ background: "rgba(255,0,255,.35)" }} />

      <motion.div
        key={spin}
        initial={{ y: spin === 0 ? restY : 0 }}
        animate={
          spin === 0
            ? { y: restY }
            : {
                y: [0, restY - 18, restY],
                filter: ["blur(0px)", "blur(4px)", "blur(0px)"],
              }
        }
        transition={
          spin === 0
            ? { duration: 0 }
            : { duration: dur, ease: [0.12, 0.6, 0.18, 1], times: [0, 0.86, 1] }
        }
        onAnimationComplete={() => {
          if (spin > 0 && reel === 2) onStop(); // último rolo dispara o resultado
        }}
      >
        {strip.map((s, i) => {
          const Sy = SYMBOLS[s];
          return (
            <div key={i} className="grid place-items-center" style={{ height: CELL }}>
              <Sy.Icon
                size={CELL * 0.5}
                color={Sy.color}
                strokeWidth={1.8}
                style={{ filter: `drop-shadow(0 0 8px ${Sy.color}88)` }}
              />
            </div>
          );
        })}
      </motion.div>

      {spinning && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          animate={{ opacity: [0, 0.25, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ background: "rgba(255,128,225,.4)" }}
        />
      )}
    </div>
  );
}

export function SlotMachine({ bet = 20 }: { bet?: number }) {
  const [spin, setSpin] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [settled, setSettled] = useState(true);

  const result = plannedResult(spin);
  const isJackpot = settled && spin > 0 && result[0] === result[1] && result[1] === result[2];
  const win = isJackpot ? bet * (PAYOUTS[result[0]] || 800) : 0;
  const animatedWin = useCountUp(win, 900, spin);

  function pull() {
    if (spinning) return;
    setSettled(false);
    setSpinning(true);
    setSpin((s) => s + 1);
  }
  function settle() {
    setSpinning(false);
    setSettled(true);
  }

  return (
    <div
      className="relative mx-auto max-w-md overflow-hidden rounded-[32px] p-6 sm:p-7"
      style={{ background: "linear-gradient(160deg,#3215AD,#220C82 70%)", boxShadow: CARD }}
    >
      <MarqueeFrame count={30} />
      {isJackpot && <Confetti key={spin} count={40} colors={[J.gold, J.magenta, J.pink, J.green]} spread={220} />}

      {/* topo: caixa-alta "JACKPOT" */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className="font-[family-name:var(--font-archivo)] text-lg font-black uppercase tracking-[0.12em]"
          style={{ color: J.gold, textShadow: "0 0 16px rgba(255,212,94,.5)" }}
        >
          Jackpot 777
        </span>
        <span
          className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase"
          style={{ background: J.surfaceUp, color: J.pink }}
        >
          aposta {brl0(bet)}
        </span>
      </div>

      {/* 3 rolos */}
      <div className="relative z-10 mt-5 flex items-center justify-center gap-2.5">
        {[0, 1, 2].map((r) => (
          <Reel key={r} reel={r} spin={spin} result={result[r]} spinning={spinning} onStop={settle} />
        ))}
      </div>

      {/* faixa de resultado */}
      <div
        className="relative z-10 mt-5 flex min-h-[56px] items-center justify-center rounded-2xl px-4 text-center"
        style={{
          background: "rgba(0,0,0,.3)",
          boxShadow: isJackpot ? GLOW_GREEN : "inset 0 0 0 1px " + J.line,
        }}
      >
        {spinning ? (
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-sm font-bold uppercase tracking-[0.2em]"
            style={{ color: J.pink }}
          >
            girando…
          </motion.span>
        ) : isJackpot ? (
          <div className="flex flex-col py-2">
            <span
              className="font-[family-name:var(--font-archivo)] text-2xl font-black uppercase leading-none"
              style={{ color: J.green, textShadow: "0 0 20px rgba(65,255,202,.7)" }}
            >
              Mega Win!
            </span>
            <span className="mt-1 font-[family-name:var(--font-mono)] text-xl font-medium tabular-nums" style={{ color: J.gold }}>
              + {brl0(animatedWin)}
            </span>
          </div>
        ) : spin === 0 ? (
          <span className="text-sm font-medium" style={{ color: J.textSoft }}>
            Puxa a alavanca e gira os 3 rolos.
          </span>
        ) : (
          <span className="text-sm font-semibold" style={{ color: J.textSoft }}>
            Quase! Gira de novo — o 777 tá perto.
          </span>
        )}
      </div>

      {/* alavanca / botão */}
      <div className="relative z-10 mt-5 flex items-center gap-3">
        <motion.button
          type="button"
          onClick={pull}
          disabled={spinning}
          whileTap={{ scale: 0.97 }}
          transition={SPRING}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold disabled:opacity-70"
          style={{ background: J.magenta, color: "#fff", boxShadow: GLOW_MAGENTA }}
        >
          {spin === 0 ? "Puxar a alavanca" : spinning ? "Girando…" : "Girar de novo"}
        </motion.button>
        <Lever spinning={spinning} onPull={pull} />
      </div>
    </div>
  );
}

/** Alavanca tátil — a "antecipação" antes do giro (rotação entre 2 valores). */
function Lever({ spinning, onPull }: { spinning: boolean; onPull: () => void }) {
  return (
    <button
      type="button"
      onClick={onPull}
      disabled={spinning}
      aria-label="Puxar alavanca"
      className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl disabled:opacity-70"
      style={{ background: J.surfaceUp, boxShadow: "inset 0 0 0 1px " + J.line }}
    >
      <span className="absolute bottom-2 h-2 w-2 rounded-full" style={{ background: J.gold }} />
      <motion.span
        className="block h-9 w-2 origin-bottom rounded-full"
        style={{ background: `linear-gradient(${J.pink},${J.magenta})` }}
        animate={{ rotate: spinning ? 14 : -8 }}
        transition={SPRING}
      >
        <span
          className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full"
          style={{ background: J.gold, boxShadow: "0 0 12px rgba(255,212,94,.8)" }}
        />
      </motion.span>
    </button>
  );
}
