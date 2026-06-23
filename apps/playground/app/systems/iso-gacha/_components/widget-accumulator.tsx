"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Shield, RotateCcw, Plus } from "lucide-react";
import { ISO, SPRING, brl } from "./tokens";
import { IsoCube } from "./iso-primitives";
import { useCountUp } from "./use-count-up";

const STAKE = 100;
const PER_LEG = 0.28; // cada perna soma ao multiplicador
const BASE = 1;
const TOTAL_LEGS = 7;

const DAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/**
 * WidgetAccumulator — a ACUMULADORA (múltipla) onde cada dia é uma PERNA/leg.
 * Cada check-in empilha um cubo 3D (perna literal) e o multiplicador cresce
 * com pulso. Tem um SHIELD que cobre uma falha sem quebrar a múltipla.
 */
export function WidgetAccumulator() {
  const [legs, setLegs] = useState(3);
  const [shield, setShield] = useState(true);
  const [pulse, setPulse] = useState(0);
  const [broke, setBroke] = useState(false);

  const mult = BASE + legs * PER_LEG;
  const payout = Math.round(STAKE * mult);
  const shownPayout = useCountUp(payout, 480, pulse);
  const shownMultRaw = useCountUp(Math.round(mult * 100), 420, pulse);
  const shownMult = (shownMultRaw / 100).toFixed(2);

  function checkIn() {
    if (legs >= TOTAL_LEGS || broke) return;
    setLegs((l) => l + 1);
    setPulse((p) => p + 1);
  }
  function miss() {
    if (broke || legs === 0) return;
    if (shield) {
      // shield cobre a falha — perna mantida
      setShield(false);
      setPulse((p) => p + 1);
    } else {
      setBroke(true);
    }
  }
  function reset() {
    setLegs(3);
    setShield(true);
    setBroke(false);
    setPulse((p) => p + 1);
  }

  return (
    <div
      className="flex h-full flex-col rounded-[24px] p-5"
      style={{
        background: "#FFFFFF",
        border: `3px solid ${ISO.ink}`,
        boxShadow: `8px 9px 0 ${ISO.green}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className="font-[family-name:var(--font-display)] text-lg font-bold leading-none"
            style={{ color: ISO.ink }}
          >
            Acumuladora da semana
          </p>
          <p className="text-xs" style={{ color: ISO.inkSoft }}>
            Cada treino = uma perna da múltipla
          </p>
        </div>
        <motion.div
          animate={shield ? { rotate: [-4, 4, -4] } : { rotate: 0 }}
          transition={{ duration: 2, repeat: shield ? Infinity : 0 }}
          className="grid h-11 w-11 place-items-center rounded-xl"
          style={{
            background: shield ? ISO.green : ISO.baseDeep,
            border: `2.5px solid ${ISO.ink}`,
            opacity: shield ? 1 : 0.5,
          }}
          aria-label={shield ? "Shield ativo" : "Shield usado"}
        >
          <Shield
            size={20}
            color={shield ? "#FFFFFF" : ISO.inkSoft}
            strokeWidth={2.6}
            fill={shield ? "#FFFFFF" : "none"}
            fillOpacity={0.2}
          />
        </motion.div>
      </div>

      {/* pilha de cubos = pernas literais */}
      <div
        className="relative mt-4 flex min-h-[150px] items-end justify-center gap-1.5 rounded-2xl p-3"
        style={{ background: ISO.base, border: `2.5px solid ${ISO.baseDeep}` }}
      >
        {broke && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 grid place-items-center rounded-2xl"
            style={{ background: "rgba(217,69,69,0.12)" }}
          >
            <span
              className="rounded-xl px-3 py-1.5 font-[family-name:var(--font-display)] text-sm font-bold"
              style={{
                background: ISO.coral,
                color: "#FFFFFF",
                border: `2.5px solid ${ISO.ink}`,
              }}
            >
              Múltipla quebrou — recomeça hoje
            </span>
          </motion.div>
        )}
        {Array.from({ length: TOTAL_LEGS }).map((_, i) => {
          const filled = i < legs;
          return (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1">
              <AnimatePresence>
                {filled ? (
                  <motion.div
                    initial={{ y: -40, scale: 0, opacity: 0 }}
                    animate={{ y: 0, scale: 1, opacity: broke ? 0.4 : 1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 14 }}
                  >
                    <IsoCube size={26} top="#54EFB0" left={ISO.green} right={ISO.greenDeep} />
                  </motion.div>
                ) : (
                  <div
                    className="h-[18px] w-[18px] rounded-md"
                    style={{
                      background: "#FFFFFF",
                      border: `2px dashed ${ISO.baseDeep}`,
                    }}
                  />
                )}
              </AnimatePresence>
              <span
                className="text-[9px] font-bold"
                style={{ color: filled ? ISO.greenDeep : ISO.inkSoft }}
              >
                {DAY_LABELS[i]}
              </span>
            </div>
          );
        })}
      </div>

      {/* multiplicador + retorno */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: ISO.inkSoft }}
          >
            Multiplicador
          </p>
          <motion.p
            key={`m-${pulse}`}
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            transition={SPRING}
            className="font-[family-name:var(--font-display)] text-4xl font-bold leading-none tabular-nums"
            style={{ color: ISO.purple }}
          >
            {shownMult}x
          </motion.p>
        </div>
        <div className="text-right">
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: ISO.inkSoft }}
          >
            Retorno potencial
          </p>
          <p
            className="font-[family-name:var(--font-display)] text-2xl font-bold leading-none tabular-nums"
            style={{ color: ISO.greenDeep }}
          >
            {brl(shownPayout, false)}
          </p>
        </div>
      </div>

      {/* ações */}
      <div className="mt-4 flex gap-2">
        {!broke ? (
          <>
            <motion.button
              type="button"
              onClick={checkIn}
              disabled={legs >= TOTAL_LEGS}
              whileTap={{ scale: 0.95, y: 2 }}
              transition={SPRING}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-3 font-[family-name:var(--font-display)] text-sm font-bold uppercase disabled:opacity-50"
              style={{
                minHeight: 48,
                background: ISO.green,
                color: ISO.ink,
                border: `2.5px solid ${ISO.ink}`,
                boxShadow: `0 4px 0 ${ISO.greenDeep}`,
              }}
            >
              {legs >= TOTAL_LEGS ? (
                <>
                  <CheckCircle2 size={16} /> Semana fechada!
                </>
              ) : (
                <>
                  <Plus size={16} strokeWidth={3} /> Treino feito
                </>
              )}
            </motion.button>
            <button
              type="button"
              onClick={miss}
              disabled={legs === 0}
              className="rounded-2xl px-3 py-3 text-xs font-bold uppercase disabled:opacity-40"
              style={{
                minHeight: 48,
                background: "#FFFFFF",
                color: ISO.inkSoft,
                border: `2.5px solid ${ISO.baseDeep}`,
              }}
            >
              Pulei
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl py-3 font-[family-name:var(--font-display)] text-sm font-bold uppercase"
            style={{
              minHeight: 48,
              background: ISO.purple,
              color: "#FFFFFF",
              border: `2.5px solid ${ISO.ink}`,
              boxShadow: `0 4px 0 ${ISO.purpleDeep}`,
            }}
          >
            <RotateCcw size={16} /> Recomeçar
          </button>
        )}
      </div>
      <p className="mt-3 text-center text-xs" style={{ color: ISO.inkSoft }}>
        {shield
          ? "Shield no bolso: cobre 1 falha sem quebrar a múltipla."
          : broke
            ? "Sem humilhação — todo mundo recomeça. Bora hoje."
            : "Shield já foi usado. Próxima falha quebra a múltipla."}
      </p>
    </div>
  );
}
