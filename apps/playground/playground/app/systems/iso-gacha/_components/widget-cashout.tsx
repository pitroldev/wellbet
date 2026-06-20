"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Coins, RotateCcw, CheckCircle2 } from "lucide-react";
import { ISO, brl } from "./tokens";
import { Confetti } from "./confetti";

const STAKE = 100;
const TARGET = 240; // valor cheio se levar até o fim (deu green)
const TICK_MS = 90;

/**
 * WidgetCashOut — aposta EM ANDAMENTO com o valor de cash out subindo ao vivo.
 * O botão "CASH OUT" pulsa com uma moeda 3D; tocar trava o ganho parcial com
 * satisfação. Ou segura até o fim pra "deu green" cheio.
 */
export function WidgetCashOut() {
  const [progress, setProgress] = useState(0.18); // 0..1 da meta
  const [status, setStatus] = useState<"running" | "cashed" | "green">("running");
  const [confettiKey, setConfettiKey] = useState(0);
  const [lockedValue, setLockedValue] = useState(0);

  const liveValue = STAKE + (TARGET - STAKE) * progress;

  useEffect(() => {
    if (status !== "running") return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + 0.012;
        if (next >= 1) {
          setStatus("green");
          setLockedValue(TARGET);
          setConfettiKey((k) => k + 1);
          return 1;
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [status]);

  function cashOut() {
    if (status !== "running") return;
    setStatus("cashed");
    setLockedValue(Math.round(liveValue));
    setConfettiKey((k) => k + 1);
  }
  function reset() {
    setProgress(0.18);
    setStatus("running");
    setLockedValue(0);
  }

  const pct = Math.round(progress * 100);

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden rounded-[24px] p-5"
      style={{
        background: "#FFFFFF",
        border: `3px solid ${ISO.ink}`,
        boxShadow: `8px 9px 0 ${ISO.yellowDeep}`,
      }}
    >
      {confettiKey > 0 && status !== "running" && <Confetti key={confettiKey} count={32} />}

      <div className="flex items-center justify-between">
        <div>
          <p
            className="font-[family-name:var(--font-display)] text-lg font-bold leading-none"
            style={{ color: ISO.ink }}
          >
            Aposta ao vivo
          </p>
          <p className="text-xs" style={{ color: ISO.inkSoft }}>
            Perder 8 kg · banca {brl(STAKE, false)}
          </p>
        </div>
        <span
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
          style={{
            background: status === "running" ? ISO.coral : ISO.green,
            color: status === "running" ? "#FFFFFF" : ISO.ink,
          }}
        >
          <span
            className="inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: status === "running" ? "#FFFFFF" : ISO.ink }}
          />
          {status === "running" ? "ao vivo" : "fechada"}
        </span>
      </div>

      {/* trilho de progresso da meta */}
      <div className="mt-5">
        <div
          className="mb-1.5 flex justify-between text-[11px] font-bold"
          style={{ color: ISO.inkSoft }}
        >
          <span>Progresso da meta</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <div
          className="h-5 w-full overflow-hidden rounded-full"
          style={{ background: ISO.base, border: `2.5px solid ${ISO.ink}` }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: ISO.green }}
            animate={{ width: `${pct}%` }}
            transition={{ ease: "linear", duration: TICK_MS / 1000 }}
          />
        </div>
      </div>

      {/* valor ao vivo */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <TrendingUp size={20} color={ISO.greenDeep} strokeWidth={2.6} />
        <p
          className="font-[family-name:var(--font-display)] text-4xl font-bold leading-none tabular-nums"
          style={{ color: ISO.greenDeep }}
        >
          {brl(status === "running" ? liveValue : lockedValue, false)}
        </p>
      </div>
      <p className="text-center text-xs" style={{ color: ISO.inkSoft }}>
        {status === "running"
          ? "valor de cash out agora"
          : status === "green"
            ? "retorno cheio — deu green!"
            : "ganho travado"}
      </p>

      {/* ação */}
      <div className="mt-auto pt-5">
        <AnimatePresence mode="wait">
          {status === "running" ? (
            <motion.button
              key="cashout"
              type="button"
              onClick={cashOut}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 1.1, repeat: Infinity }}
              whileTap={{ scale: 0.95, y: 3 }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-[family-name:var(--font-display)] text-lg font-bold uppercase"
              style={{
                minHeight: 56,
                background: ISO.yellow,
                color: ISO.ink,
                border: `3px solid ${ISO.ink}`,
                boxShadow: `0 6px 0 ${ISO.yellowDeep}`,
              }}
            >
              {/* moeda 3D girando */}
              <motion.span
                animate={{ rotateY: [0, 180, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="grid h-7 w-7 place-items-center rounded-full"
                style={{
                  background: ISO.yellowDeep,
                  border: `2px solid ${ISO.ink}`,
                }}
              >
                <Coins size={16} color={ISO.ink} strokeWidth={2.6} />
              </motion.span>
              Cash out {brl(liveValue, false)}
            </motion.button>
          ) : (
            <motion.div
              key="done"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 340, damping: 13 }}
              className="rounded-2xl p-4 text-center"
              style={{ background: ISO.green, border: `3px solid ${ISO.ink}` }}
            >
              <p
                className="flex items-center justify-center gap-2 font-[family-name:var(--font-display)] text-xl font-bold"
                style={{ color: ISO.ink }}
              >
                <CheckCircle2 size={22} strokeWidth={2.6} />
                {status === "green" ? "Deu green cheio!" : "Cash out garantido!"}
              </p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums" style={{ color: ISO.ink }}>
                {brl(lockedValue, false)} na conta
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold"
                style={{
                  color: ISO.ink,
                  border: `2px solid ${ISO.ink}`,
                  minHeight: 36,
                }}
              >
                <RotateCcw size={13} /> Nova aposta ao vivo
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
