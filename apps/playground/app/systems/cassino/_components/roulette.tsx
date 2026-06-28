"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Coins } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { N, SPRING, brl, odd, seeded, neonText } from "./tokens";

/**
 * Roleta neon. Toque "Girar" -> a roda gira em TWEEN com easing de
 * desaceleração (~3.4s) -> o ponteiro (topo) para num número -> paga (green)
 * ou perde. Resultado determinístico por contador de giro (seeded). Confete
 * + count-up no green. NÃO usa AnimatePresence no giro — rotação simples + key.
 */

// 12 casas: alternam verde (par "green") e magenta (ímpar "perde"), determinístico.
const SLOTS = 12;
const SEG = 360 / SLOTS;
const NUMBERS = [7, 11, 3, 21, 9, 14, 5, 17, 2, 23, 8, 19];

// Aposta: "no green" (verde). Casas verdes = índices pares. Odd da casa verde.
const ODD = 2.0;
const STAKE = 50;

function isGreen(i: number) {
  return i % 2 === 0;
}

export function Roulette() {
  const [spins, setSpins] = useState(0);
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landed, setLanded] = useState<number | null>(null);

  const win = landed !== null && isGreen(landed);
  const payout = STAKE * ODD;
  const animatedPayout = useCountUp(win ? payout : 0, 700, spins);

  function spin() {
    if (spinning) return;
    const next = spins + 1;
    // índice de destino determinístico
    const targetIdx = Math.floor(seeded(next * 3.1 + 1.7) * SLOTS) % SLOTS;
    // o ponteiro fica no topo (12h). Para alinhar o segmento targetIdx ao topo,
    // giramos várias voltas + o offset. Segmentos crescem no sentido horário.
    const turns = 5 + (next % 3); // 5..7 voltas
    const targetAngle =
      angle + turns * 360 + ((360 - targetIdx * SEG - SEG / 2) % 360) - (angle % 360);

    setSpinning(true);
    setLanded(null);
    setSpins(next);
    setAngle(targetAngle);
  }

  const R = 132;
  const cx = 150;
  const cy = 150;

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{
        background: `radial-gradient(circle at 50% 30%, ${N.indigo}33, ${N.ground} 70%), ${N.groundDeep}`,
        border: `1px solid ${N.line}`,
        boxShadow: `0 30px 70px -30px rgba(0,0,0,.9), 0 0 40px ${N.magenta}22`,
      }}
    >
      {win && <Confetti key={spins} colors={[N.green, N.gold, "#fff", N.blue]} spread={180} />}

      <div className="flex items-center justify-between">
        <span
          className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-[0.18em]"
          style={{ color: N.magenta, textShadow: neonText(N.magenta) }}
        >
          Roleta · aposte no green
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: N.mute }}>
          odd {odd(ODD)}
        </span>
      </div>

      {/* roda */}
      <div className="relative mx-auto mt-5 grid place-items-center" style={{ width: 300, height: 300 }}>
        {/* ponteiro no topo */}
        <div
          className="absolute left-1/2 top-[6px] z-30 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "11px solid transparent",
            borderRight: "11px solid transparent",
            borderTop: `20px solid ${N.gold}`,
            filter: `drop-shadow(0 0 6px ${N.gold})`,
          }}
        />
        <motion.svg
          width={300}
          height={300}
          viewBox="0 0 300 300"
          animate={{ rotate: angle }}
          transition={
            spinning
              ? { duration: 3.4, ease: [0.16, 0.84, 0.28, 1] }
              : { duration: 0 }
          }
          onAnimationComplete={() => {
            if (spinning) {
              const next = spins;
              const targetIdx = Math.floor(seeded(next * 3.1 + 1.7) * SLOTS) % SLOTS;
              setSpinning(false);
              setLanded(targetIdx);
            }
          }}
          style={{ filter: `drop-shadow(0 0 18px ${N.blue}55)` }}
        >
          {/* aro externo */}
          <circle cx={cx} cy={cy} r={R + 8} fill="none" stroke={N.gold} strokeWidth={3} opacity={0.7} />
          {NUMBERS.map((num, i) => {
            const start = i * SEG;
            const end = start + SEG;
            const green = isGreen(i);
            const a0 = ((start - 90) * Math.PI) / 180;
            const a1 = ((end - 90) * Math.PI) / 180;
            const x0 = cx + R * Math.cos(a0);
            const y0 = cy + R * Math.sin(a0);
            const x1 = cx + R * Math.cos(a1);
            const y1 = cy + R * Math.sin(a1);
            const fill = green ? N.green : N.magenta;
            // posição do rótulo
            const mid = ((start + SEG / 2 - 90) * Math.PI) / 180;
            const lx = cx + R * 0.72 * Math.cos(mid);
            const ly = cy + R * 0.72 * Math.sin(mid);
            return (
              <g key={i}>
                <path
                  d={`M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1} Z`}
                  fill={fill}
                  stroke={N.groundDeep}
                  strokeWidth={2}
                  opacity={green ? 0.92 : 0.85}
                />
                <text
                  x={lx}
                  y={ly}
                  fill={green ? N.greenInk : "#fff"}
                  fontSize={15}
                  fontWeight={800}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  transform={`rotate(${start + SEG / 2} ${lx} ${ly})`}
                >
                  {num}
                </text>
              </g>
            );
          })}
          {/* miolo */}
          <circle cx={cx} cy={cy} r={34} fill={N.groundDeep} stroke={N.gold} strokeWidth={2} />
          <circle cx={cx} cy={cy} r={10} fill={N.gold} />
        </motion.svg>
      </div>

      {/* resultado */}
      <div
        className="mt-4 flex min-h-[64px] items-center justify-center rounded-2xl px-4 py-3 text-center"
        style={{ background: N.groundDeep, border: `1px solid ${N.line}` }}
      >
        {spinning ? (
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="font-[family-name:var(--font-mono)] text-sm font-bold uppercase tracking-[0.2em]"
            style={{ color: N.mute }}
          >
            girando…
          </motion.span>
        ) : landed === null ? (
          <span className="text-sm" style={{ color: N.mute }}>
            Stake {brl(STAKE)} no green. Gire a roleta.
          </span>
        ) : win ? (
          <motion.div
            key={spins}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 480, damping: 16 }}
          >
            <p
              className="font-[family-name:var(--font-archivo)] text-lg font-black uppercase tracking-tight"
              style={{ color: N.green, textShadow: neonText(N.green) }}
            >
              Deu green! Caiu no {NUMBERS[landed]}
            </p>
            <p className="font-[family-name:var(--font-mono)] text-2xl font-medium tabular-nums" style={{ color: N.green }}>
              +{brl(animatedPayout)}
            </p>
          </motion.div>
        ) : (
          <motion.div key={spins} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={SPRING}>
            <p className="text-base font-extrabold" style={{ color: N.pink }}>
              Caiu no {NUMBERS[landed]} (magenta).
            </p>
            <p className="text-sm" style={{ color: N.mute }}>
              Não foi dessa vez — bora de novo?
            </p>
          </motion.div>
        )}
      </div>

      <motion.button
        type="button"
        onClick={spin}
        disabled={spinning}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold disabled:opacity-60"
        style={{ background: N.magenta, color: "#fff", boxShadow: `0 0 22px ${N.magenta}88` }}
      >
        {landed !== null ? <RotateCcw size={18} /> : <Coins size={18} />}
        {landed !== null ? "Girar de novo" : "Girar a roleta"}
      </motion.button>
    </div>
  );
}
