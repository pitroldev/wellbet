"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Flame } from "lucide-react";
import { J, seeded } from "./tokens";
import { BulbRow } from "./marquee";

/**
 * ProgressiveJackpot — pote progressivo que SOBE sozinho. Incremento via
 * setInterval dentro de useEffect (nunca em render); o "aleatório" usa seeded
 * por tick (determinístico, sem Math.random). Mono + glow dourado.
 */
const START = 248_910;

export function ProgressiveJackpot() {
  const [pot, setPot] = useState(START);
  const tick = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      tick.current += 1;
      const bump = 3 + Math.floor(seeded(tick.current) * 40); // R$3..R$43 por tick
      setPot((p) => p + bump);
    }, 700);
    return () => clearInterval(id);
  }, []);

  // formata com separador de milhar pt-BR (sem centavos — pote redondo)
  const formatted = pot.toLocaleString("pt-BR");

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6 text-center"
      style={{ background: "linear-gradient(160deg,#3215AD,#190960)", boxShadow: "inset 0 0 0 1px " + J.line }}
    >
      {/* brilho pulsante de fundo */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ opacity: [0.25, 0.5] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle at 50% 30%, rgba(255,212,94,.25), transparent 60%)" }}
      />

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em]" style={{ background: J.surfaceUp, color: J.gold }}>
          <Crown size={13} /> Pote progressivo
        </span>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          <span className="mt-2 font-[family-name:var(--font-mono)] text-2xl" style={{ color: J.gold }}>
            R$
          </span>
          <motion.span
            key={Math.floor(pot / 1000)}
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="font-[family-name:var(--font-mono)] text-5xl font-medium tabular-nums sm:text-6xl"
            style={{ color: J.gold, textShadow: "0 0 28px rgba(255,212,94,.6)" }}
          >
            {formatted}
          </motion.span>
        </div>

        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: J.pink }}>
          <Flame size={14} fill={J.pink} /> sobe a cada segundo — pode cair pra você
        </p>

        <div className="mt-5">
          <BulbRow count={14} color={J.gold} glow={J.goldDeep} />
        </div>
      </div>
    </div>
  );
}
