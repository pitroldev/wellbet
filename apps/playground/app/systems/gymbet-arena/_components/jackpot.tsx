"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Coins, RotateCcw, Sparkles } from "lucide-react";
import { Confetti } from "@/app/components/confetti";
import { useCountUp } from "@/app/components/use-count-up";
import { G, SPRING, GRAD, brl0, seeded } from "./tokens";

type Prize = { label: string; value: number; color: string };
const PRIZES: Prize[] = [
  { label: "FREE BET", value: 50, color: "#7A1BD6" },
  { label: "JACKPOT", value: 2400, color: "#41FFCA" },
  { label: "x2 STAKE", value: 160, color: "#FF80E1" },
  { label: "+30 DIAS", value: 300, color: "#FF00FF" },
  { label: "CASHBACK", value: 90, color: "#FDC0FF" },
];

export function Jackpot() {
  const [spinning, setSpinning] = useState(false);
  const [face, setFace] = useState(0); // índice mostrado durante a rolagem
  const [result, setResult] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  const spinCount = useRef(0);

  // rolagem: render condicional simples + key (regra de slot), NÃO AnimatePresence
  useEffect(() => {
    if (!spinning) return;
    const id = setInterval(() => {
      setFace((f) => (f + 1) % PRIZES.length);
    }, 85);
    const stop = setTimeout(() => {
      clearInterval(id);
      // resultado determinístico por spin (sem random em render)
      const idx = Math.floor(seeded(spinCount.current * 7 + 3) * PRIZES.length);
      setFace(idx);
      setResult(idx);
      setSpinning(false);
      setRun((r) => r + 1);
    }, 1500);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [spinning]);

  const won = result !== null ? PRIZES[result] : null;
  const animatedWin = useCountUp(won ? won.value : 0, 700, run);
  const isJackpot = won?.label === "JACKPOT";

  function spin() {
    if (spinning) return;
    spinCount.current += 1;
    setResult(null);
    setSpinning(true);
  }

  const shown = PRIZES[face];

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6 text-center"
      style={{ background: G.ink, boxShadow: "inset 0 0 0 1px " + G.navyLine }}
    >
      {result !== null && !spinning && (
        <Confetti
          key={run}
          colors={isJackpot ? [G.green, G.magenta, "#fff", G.pink] : [G.magenta, G.pink, G.purple]}
          spread={isJackpot ? 190 : 150}
        />
      )}

      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-extrabold" style={{ color: G.white }}>
          <Sparkles size={15} style={{ color: G.magenta }} /> Roleta da arena
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em]" style={{ color: G.fogMute }}>
          1 giro / dia
        </span>
      </div>

      {/* janela da roleta — 1 elemento via key */}
      <div
        className="relative mx-auto mt-5 grid h-36 place-items-center overflow-hidden rounded-3xl"
        style={{ background: G.navy, boxShadow: "inset 0 0 0 1px " + G.navyLine }}
      >
        {/* linha de mira */}
        <span className="pointer-events-none absolute inset-x-6 top-1/2 h-px -translate-y-1/2" style={{ background: "rgba(255,0,255,.35)" }} />
        <motion.div
          key={`${spinning ? "s" : "r"}-${face}`}
          initial={{ y: spinning ? -28 : 0, opacity: spinning ? 0.2 : 0, scale: spinning ? 0.9 : 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={spinning ? { duration: 0.09 } : SPRING}
          className="font-[family-name:var(--font-archivo)] font-black uppercase italic leading-none tracking-[-0.03em]"
          style={{
            color: shown.color,
            fontSize: "clamp(2rem,11vw,3.4rem)",
            textShadow: spinning ? "none" : `0 0 28px ${shown.color}99`,
          }}
        >
          {shown.label}
        </motion.div>
      </div>

      {/* prêmio */}
      <div className="mt-4 h-7">
        {result !== null && !spinning && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING}
            className="font-[family-name:var(--font-mono)] text-xl font-bold tabular-nums"
            style={{ color: isJackpot ? G.green : G.magenta }}
          >
            {isJackpot ? "JACKPOT! " : "Você ganhou "}
            {brl0(animatedWin)}
          </motion.p>
        )}
      </div>

      {result === null || spinning ? (
        <motion.button
          type="button"
          onClick={spin}
          disabled={spinning}
          whileTap={{ scale: 0.96 }}
          transition={SPRING}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold disabled:opacity-80"
          style={{ background: GRAD.gymbet, color: "#fff", boxShadow: "0 12px 28px -10px rgba(255,0,255,.7)" }}
        >
          <Coins size={18} /> {spinning ? "Girando…" : "Girar a roleta"}
        </motion.button>
      ) : (
        <button
          type="button"
          onClick={spin}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold"
          style={{ background: G.navySoft, color: G.white, boxShadow: "inset 0 0 0 1px " + G.navyLine }}
        >
          <RotateCcw size={15} /> Girar de novo
        </button>
      )}
    </div>
  );
}
