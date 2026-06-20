"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shield, Check, Layers, Lock, RotateCcw, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { GLOW, HudLabel, mono, OddsTick, Panel } from "./primitives";

/* ──────────────────────────────────────────────────────────────────────────
   ACUMULADORA (= STREAK) — cada dia é uma "perna"/leg da múltipla.
   Bater o check-in acende a próxima perna em VERDE com ripple "deu green",
   o multiplicador da acumuladora cresce ao vivo (count-up). Shield protege
   um dia perdido. Reset para brincar de novo. Visual de bilhete acumulado.
   ────────────────────────────────────────────────────────────────────────── */

type Leg = {
  label: string;
  desc: string;
  /** cotação desta perna */
  odd: number;
};

const LEGS: Leg[] = [
  { label: "Seg", desc: "Treino A", odd: 1.18 },
  { label: "Ter", desc: "Corrida 5k", odd: 1.22 },
  { label: "Qua", desc: "Mobilidade", odd: 1.15 },
  { label: "Qui", desc: "Treino B", odd: 1.2 },
  { label: "Sex", desc: "HIIT", odd: 1.25 },
  { label: "Sáb", desc: "Trilha", odd: 1.3 },
  { label: "Dom", desc: "Descanso ativo", odd: 1.12 },
];

const STAKE = 150;

function multAt(n: number) {
  // produto das cotações das `n` primeiras pernas
  return LEGS.slice(0, n).reduce((acc, l) => acc * l.odd, 1);
}

export function Accumulator() {
  // quantas pernas já "deram green"
  const [done, setDone] = useState(3);
  // ripple key para re-disparar a animação
  const [ripple, setRipple] = useState(0);

  const mult = multAt(done);
  const potential = Math.round(STAKE * multAt(LEGS.length));
  const current = Math.round(STAKE * (done === 0 ? 1 : mult));
  const complete = done >= LEGS.length;

  const checkin = () => {
    if (complete) return;
    setDone((d) => Math.min(LEGS.length, d + 1));
    setRipple((r) => r + 1);
  };

  return (
    <Panel
      glow={complete ? "green" : "purple"}
      className="relative overflow-hidden p-5 transition-shadow duration-500 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#8B5CF6]/12">
            <Layers className="h-5 w-5" color={GLOW.purple} />
          </div>
          <div>
            <HudLabel tone="purple">Acumuladora · 7 pernas</HudLabel>
            <h3 className="text-base font-semibold text-[#EDEAF7] sm:text-lg">
              Sua múltipla da semana
            </h3>
          </div>
        </div>
        <span
          className={cn(
            mono(),
            "inline-flex items-center gap-1.5 rounded-lg border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-2.5 py-1.5 text-xs text-[#EDEAF7]",
          )}
        >
          <Shield className="h-3.5 w-3.5" color={GLOW.purple} />2 shields
        </span>
      </div>

      {/* bilhete acumulado — pernas */}
      <ol className="relative mt-5 space-y-1.5">
        {LEGS.map((leg, i) => {
          const greened = i < done;
          const next = i === done && !complete;
          return (
            <li
              key={leg.label}
              className={cn(
                "relative flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                greened
                  ? "border-[#34F5A0]/35 bg-[#34F5A0]/[0.08]"
                  : next
                    ? "border-[#8B5CF6]/50 bg-[#8B5CF6]/[0.08]"
                    : "border-[rgba(139,131,168,0.16)] bg-[#0E0B1A]/50",
              )}
            >
              {/* indicador de perna */}
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold",
                  greened
                    ? "bg-[#34F5A0] text-[#0E0B1A]"
                    : next
                      ? "border border-[#8B5CF6] text-[#8B5CF6]"
                      : "border border-[rgba(139,131,168,0.3)] text-[#8B83A8]",
                )}
              >
                {greened ? (
                  <Check className="h-4 w-4" strokeWidth={3} />
                ) : next ? (
                  i + 1
                ) : (
                  <Lock className="h-3 w-3" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      greened || next ? "text-[#EDEAF7]" : "text-[#8B83A8]",
                    )}
                  >
                    {leg.label} · {leg.desc}
                  </span>
                  <span
                    className={cn(
                      mono(),
                      "text-sm font-semibold",
                      greened ? "text-[#34F5A0]" : next ? "text-[#8B5CF6]" : "text-[#8B83A8]",
                    )}
                  >
                    {leg.odd.toFixed(2)}×
                  </span>
                </div>
                {greened && (
                  <span
                    className={cn(mono(), "text-[10px] uppercase tracking-[0.14em] text-[#34F5A0]")}
                  >
                    deu green
                  </span>
                )}
              </div>

              {/* ripple verde ao acender a perna recém-batida */}
              <AnimatePresence>
                {greened && i === done - 1 && (
                  <motion.span
                    key={`ripple-${ripple}`}
                    aria-hidden
                    className="pointer-events-none absolute left-3 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full"
                    initial={{ opacity: 0.6, scale: 1 }}
                    animate={{ opacity: 0, scale: 4 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    style={{ background: GLOW.green }}
                  />
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>

      {/* HUD do multiplicador + retorno ao vivo */}
      <div className="mt-5 grid grid-cols-3 gap-2.5">
        <div className="rounded-xl border border-[rgba(139,131,168,0.16)] bg-[#0E0B1A]/60 p-3">
          <HudLabel>Multiplicador</HudLabel>
          <OddsTick
            value={done === 0 ? 1 : mult}
            decimals={2}
            suffix="×"
            className="mt-1 block text-xl font-bold text-[#8B5CF6]"
          />
        </div>
        <div className="rounded-xl border border-[#34F5A0]/30 bg-[#34F5A0]/[0.07] p-3">
          <HudLabel tone="green">Acumulado</HudLabel>
          <OddsTick
            value={current}
            decimals={0}
            prefix="R$ "
            className="mt-1 block text-xl font-bold text-[#34F5A0]"
          />
        </div>
        <div className="rounded-xl border border-[rgba(139,131,168,0.16)] bg-[#0E0B1A]/60 p-3">
          <HudLabel>Se fechar</HudLabel>
          <span className={cn(mono(), "mt-1 block text-xl font-bold text-[#EDEAF7]")}>
            R$ {potential.toLocaleString("pt-BR")}
          </span>
        </div>
      </div>

      {/* CTA check-in / estado fechado */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {complete ? (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-[#34F5A0]/40 bg-[#34F5A0]/10 p-4 text-center"
            >
              <span className="flex items-center gap-2">
                <Gift className="h-5 w-5" color={GLOW.green} />
                <span
                  className={cn(
                    mono(),
                    "text-lg font-bold uppercase tracking-[0.06em] text-[#34F5A0]",
                  )}
                  style={{ textShadow: "0 0 16px rgba(52,245,160,0.5)" }}
                >
                  Múltipla fechada · deu green!
                </span>
              </span>
              <p className="text-[12px] text-[#8B83A8]">
                7/7 pernas. Free bet de R$ 50 liberada pela consistência.
              </p>
              <button
                type="button"
                onClick={() => setDone(3)}
                className="flex items-center gap-1.5 text-[12px] text-[#8B83A8] transition hover:text-[#EDEAF7]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                recomeçar semana
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="checkin"
              type="button"
              onClick={checkin}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                mono(),
                "flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-[#34F5A0]/45 bg-[#34F5A0]/12 px-5 text-sm font-bold uppercase tracking-[0.12em] text-[#34F5A0] transition hover:bg-[#34F5A0]/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34F5A0]/60",
              )}
            >
              <Check className="h-5 w-5" strokeWidth={3} />
              Bater check-in · acender perna {done + 1}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-[#8B83A8]">
        Cada dia é uma perna da acumuladora. Perdeu um dia? Um{" "}
        <span className="text-[#8B5CF6]">shield</span> protege a múltipla — sem humilhação, recomeço
        &gt; perfeição.
      </p>
    </Panel>
  );
}
