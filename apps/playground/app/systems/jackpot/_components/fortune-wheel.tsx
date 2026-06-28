"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { J, SPRING, GLOW_PINK, seeded } from "./tokens";

/**
 * FortuneWheel — roda da fortuna. Gira em TWEEN com desaceleração (rotação
 * acumulada -> várias voltas + offset do setor alvo). Resultado DETERMINÍSTICO
 * por contador de giro (seeded). Prêmio: free bet / multiplicador / coins.
 *
 * Regra dura: rotação anima entre 2 valores (from -> to) com tween/easeOut —
 * sem array de 3+ keyframes, sem spring no giro.
 */

type Prize = { label: string; color: string };
const PRIZES: Prize[] = [
  { label: "Free bet", color: J.green },
  { label: "x2", color: J.pink },
  { label: "+50 fichas", color: J.gold },
  { label: "x5", color: J.magenta },
  { label: "Free spin", color: J.blueSoft },
  { label: "x10", color: J.green },
  { label: "+100 fichas", color: J.gold },
  { label: "Quase!", color: J.indigoSoft },
];
const N = PRIZES.length;
const SEG = 360 / N;

export function FortuneWheel() {
  const [rot, setRot] = useState(0); // rotação acumulada (graus)
  const [spin, setSpin] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<number | null>(null);
  const pendingIdx = useRef(0);

  function go() {
    if (spinning) return;
    setSpinning(true);
    setLanded(null);
    const next = spin + 1;
    const idx = Math.floor(seeded(next * 9.13) * N) % N; // setor alvo determinístico
    // ponteiro no topo (12h). Setor i centrado em i*SEG. Para alinhar ao topo:
    const turns = 4 + (next % 3); // 4..6 voltas
    const target = turns * 360 + (360 - (idx * SEG + SEG / 2));
    setSpin(next);
    setRot((r) => r + target); // sempre soma -> animação from->to (2 valores)
    // o índice fica registrado pra revelar no onAnimationComplete
    pendingIdx.current = idx;
  }

  const prize = landed !== null ? PRIZES[landed] : null;
  const winning = prize && prize.label !== "Quase!";

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{ background: "linear-gradient(160deg,#3215AD,#220C82)", boxShadow: "inset 0 0 0 1px " + J.line }}
    >
      {winning && <Confetti key={spin} count={30} colors={[J.pink, J.magenta, J.green, J.gold]} spread={200} />}

      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold" style={{ color: J.text }}>
          Roda da fortuna
        </span>
        <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold" style={{ background: J.surfaceUp, color: J.pink }}>
          <Sparkles size={12} /> 1 giro grátis/dia
        </span>
      </div>

      {/* roda */}
      <div className="relative mx-auto mt-5 grid h-[230px] w-[230px] place-items-center">
        {/* ponteiro no topo */}
        <div
          className="absolute -top-1 left-1/2 z-30 -translate-x-1/2"
          style={{ width: 0, height: 0, borderLeft: "11px solid transparent", borderRight: "11px solid transparent", borderTop: `18px solid ${J.gold}`, filter: "drop-shadow(0 0 6px rgba(255,212,94,.8))" }}
        />
        <motion.div
          className="h-full w-full rounded-full"
          animate={{ rotate: rot }}
          transition={{ duration: 3.4, ease: [0.16, 0.84, 0.2, 1] }}
          onAnimationComplete={() => {
            if (spin > 0 && spinning) {
              setSpinning(false);
              setLanded(pendingIdx.current);
            }
          }}
          style={{
            background: conic(),
            boxShadow: "inset 0 0 0 6px rgba(255,255,255,.12), 0 0 0 4px rgba(255,212,94,.4)",
          }}
        >
          {PRIZES.map((p, i) => {
            const angle = i * SEG + SEG / 2;
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 origin-left font-[family-name:var(--font-jakarta)] text-[11px] font-extrabold"
                style={{
                  transform: `rotate(${angle}deg) translateX(34px)`,
                  color: "#fff",
                  textShadow: "0 1px 2px rgba(0,0,0,.6)",
                  whiteSpace: "nowrap",
                }}
              >
                {p.label}
              </span>
            );
          })}
        </motion.div>
        {/* hub central */}
        <div
          className="absolute grid h-12 w-12 place-items-center rounded-full"
          style={{ background: J.magenta, boxShadow: GLOW_PINK }}
        >
          <Sparkles size={20} color="#fff" />
        </div>
      </div>

      {/* resultado */}
      <div className="mt-4 min-h-[24px] text-center">
        {spinning ? (
          <span className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: J.pink }}>
            girando…
          </span>
        ) : prize ? (
          <motion.span
            key={spin}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 16 }}
            className="text-base font-extrabold"
            style={{ color: prize.color }}
          >
            {winning ? `Caiu: ${prize.label} 🎉` : "Quase! Tenta de novo amanhã."}
          </motion.span>
        ) : (
          <span className="text-sm" style={{ color: J.textMute }}>
            Gira a roda e leva seu prêmio.
          </span>
        )}
      </div>

      <motion.button
        type="button"
        onClick={go}
        disabled={spinning}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold disabled:opacity-70"
        style={{ background: J.pink, color: J.greenInk, boxShadow: GLOW_PINK }}
      >
        <RotateCcw size={16} /> {spin === 0 ? "Girar a roda" : "Girar de novo"}
      </motion.button>
    </div>
  );
}

/** gradiente cônico com os setores da roda */
function conic() {
  const stops = PRIZES.map((p, i) => `${p.color} ${i * SEG}deg ${(i + 1) * SEG}deg`).join(",");
  return `conic-gradient(${stops})`;
}
