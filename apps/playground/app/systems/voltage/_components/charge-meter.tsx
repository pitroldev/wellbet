"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Zap, RotateCcw } from "lucide-react";
import { BoltMark } from "@/app/components/wellbet-logo";
import { useCountUp } from "@/app/components/use-count-up";
import { V, GRAD, SPRING, SPRING_POP, GLOW, brl } from "./tokens";
import { Sparks } from "./spark";

const STAKE = 50;
const PAYOUT = STAKE * 4.2; // recompensa ao 100%

/**
 * Charge meter ASSINATURA — segure (ou toque e mantenha) para carregar.
 * O raio enche com gradiente; ao 100% solta o payout com faíscas + count-up.
 */
export function ChargeMeter() {
  const [charge, setCharge] = useState(0); // 0..100
  const [done, setDone] = useState(false);
  const [run, setRun] = useState(0);
  const holding = useRef(false);
  const raf = useRef(0);

  const animatedPayout = useCountUp(done ? PAYOUT : 0, 700, run);

  useEffect(() => {
    return () => cancelAnimationFrame(raf.current);
  }, []);

  function loop() {
    if (!holding.current) return;
    setCharge((c) => {
      const next = Math.min(100, c + 1.7);
      if (next >= 100 && !done) {
        holding.current = false;
        setDone(true);
        setRun((r) => r + 1);
        return 100;
      }
      return next;
    });
    raf.current = requestAnimationFrame(loop);
  }

  function startHold() {
    if (done) return;
    holding.current = true;
    raf.current = requestAnimationFrame(loop);
  }
  function stopHold() {
    holding.current = false;
    cancelAnimationFrame(raf.current);
    // escorre de volta se soltar antes de 100
    if (!done) {
      const drain = () => {
        setCharge((c) => {
          if (holding.current || c <= 0) return c;
          const n = Math.max(0, c - 3);
          if (n > 0) raf.current = requestAnimationFrame(drain);
          return n;
        });
      };
      raf.current = requestAnimationFrame(drain);
    }
  }

  function reset() {
    setDone(false);
    setCharge(0);
    setRun((r) => r + 1);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-6"
      style={{ background: V.glass, backdropFilter: "blur(16px)", boxShadow: `inset 0 0 0 1px ${V.glassLine}, ${GLOW}` }}
    >
      {done && <Sparks key={run} count={16} spread={150} />}

      <div className="flex items-center justify-between">
        <span className="text-sm font-extrabold" style={{ color: V.white }}>
          Charge meter · segure pra carregar
        </span>
        <span className="font-[family-name:var(--font-mono)] text-[11px] tabular-nums" style={{ color: V.green }}>
          {Math.round(charge)}%
        </span>
      </div>

      {/* raio que enche */}
      <div className="relative mx-auto mt-5 grid h-44 w-44 place-items-center">
        {/* halo pulsante */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: GRAD.halo }}
          animate={{ opacity: done ? 0.9 : 0.3 + (charge / 100) * 0.6, scale: done ? 1.05 : 1 }}
          transition={SPRING}
        />
        {/* raio base (fundo) */}
        <BoltMark style={{ width: 96, height: "auto", color: "rgba(255,255,255,.10)" }} />
        {/* raio preenchido por cima, clipado pela carga (de baixo pra cima) */}
        <div
          className="absolute grid place-items-center"
          style={{ inset: 0, clipPath: `inset(${100 - charge}% 0 0 0)` }}
        >
          <BoltMark style={{ width: 96, height: "auto", color: V.green, filter: "drop-shadow(0 0 12px rgba(65,255,202,.7))" }} />
        </div>
        {/* badge ao completar */}
        {done && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={SPRING_POP}
            className="absolute -bottom-1 rounded-full px-3 py-1 text-[11px] font-extrabold"
            style={{ background: GRAD.bolt, color: V.greenInk }}
          >
            100% · CARREGADO
          </motion.span>
        )}
      </div>

      {/* barra de carga */}
      <div className="mt-4 h-3 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,.08)" }}>
        <motion.div className="h-full rounded-full" style={{ width: `${charge}%`, background: GRAD.flow }} transition={{ duration: 0 }} />
      </div>

      {/* payout */}
      <div className="mt-4 flex items-end justify-between">
        <span className="text-sm font-semibold" style={{ color: V.inkSoft }}>
          {done ? "Descarregou" : "Carregue pra liberar"}
        </span>
        <motion.span
          key={Math.round(animatedPayout)}
          className="font-[family-name:var(--font-mono)] text-3xl font-medium tabular-nums"
          style={{ color: done ? V.green : V.inkFaint }}
        >
          {brl(animatedPayout)}
        </motion.span>
      </div>

      {!done ? (
        <motion.button
          type="button"
          onPointerDown={startHold}
          onPointerUp={stopHold}
          onPointerLeave={stopHold}
          onPointerCancel={stopHold}
          whileTap={{ scale: 0.98 }}
          transition={SPRING}
          className="mt-4 flex w-full select-none items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold"
          style={{ background: GRAD.bolt, color: V.greenInk, touchAction: "none" }}
        >
          <Zap size={18} fill={V.greenInk} /> Segure pra carregar
        </motion.button>
      ) : (
        <button
          type="button"
          onClick={reset}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-bold"
          style={{ background: "rgba(255,255,255,.10)", color: V.white, boxShadow: `inset 0 0 0 1px ${V.glassLine}` }}
        >
          <RotateCcw size={15} /> Carregar de novo
        </button>
      )}
    </div>
  );
}
