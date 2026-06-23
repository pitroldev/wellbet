"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TrendingUp, HandCoins, RotateCcw, Check, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_SOFT, GLOW, HudLabel, mono, OddsTick, Panel } from "./primitives";

/* ──────────────────────────────────────────────────────────────────────────
   CASH OUT — aposta em andamento com valor subindo AO VIVO. O botão
   "CASH OUT R$X" pulsa; tocar confirma com satisfação (slam + green).
   Reset volta a aposta a "ao vivo". Mostra também progresso da meta.
   ────────────────────────────────────────────────────────────────────────── */

const STAKE = 300;
const FULL_PAYOUT = 720; // se levar até o fim
const START = 384; // cash out inicial
const STEP = 6.2; // sobe a cada tick

export function CashOut() {
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(START);
  const [cashed, setCashed] = useState(false);
  const [finalValue, setFinalValue] = useState(START);
  const valueRef = useRef(START);

  // valor de cash out sobe ao vivo enquanto a aposta segue
  useEffect(() => {
    if (cashed || reduceMotion) return;
    const id = setInterval(() => {
      valueRef.current = Math.min(FULL_PAYOUT - 4, valueRef.current + STEP);
      setValue(Number(valueRef.current.toFixed(0)));
    }, 700);
    return () => clearInterval(id);
  }, [cashed, reduceMotion]);

  const progress = (value - STAKE) / (FULL_PAYOUT - STAKE);
  const profit = value - STAKE;

  const doCashOut = () => {
    setFinalValue(value);
    setCashed(true);
  };

  const reset = () => {
    valueRef.current = START;
    setValue(START);
    setCashed(false);
  };

  return (
    <Panel
      glow={cashed ? "green" : "purple"}
      className="relative overflow-hidden p-5 transition-shadow duration-500 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#34F5A0]/12">
            <HandCoins className="h-5 w-5" color={GLOW.green} />
          </div>
          <div>
            <HudLabel tone="green">Cash out · aposta ativa</HudLabel>
            <h3 className="text-base font-semibold text-[#EDEAF7] sm:text-lg">
              Perder 8 kg em 4 meses
            </h3>
          </div>
        </div>
        {!cashed && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#34F5A0]/30 bg-[#34F5A0]/10 px-2.5 py-1">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-[#34F5A0]"
              animate={reduceMotion ? undefined : { opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className={cn(mono(), "text-[10px] uppercase tracking-[0.18em] text-[#34F5A0]")}>
              ao vivo
            </span>
          </span>
        )}
      </div>

      {/* progresso da meta */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <HudLabel>Progresso da meta · 5,4 / 8 kg</HudLabel>
          <span className={cn(mono(), "text-[11px] text-[#34F5A0]")}>68%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-[rgba(139,131,168,0.16)]">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${GLOW.green}, ${GLOW.purple})`,
              boxShadow: `0 0 12px ${GLOW.green}88`,
            }}
            initial={{ width: 0 }}
            whileInView={{ width: "68%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE_SOFT }}
          />
        </div>
      </div>

      {/* valor de cash out ao vivo */}
      <div className="mt-5 rounded-2xl border border-[rgba(139,131,168,0.16)] bg-[#0E0B1A]/60 p-4">
        <div className="flex items-end justify-between">
          <div>
            <HudLabel tone="green">
              {cashed ? "Cash out garantido" : "Cash out disponível agora"}
            </HudLabel>
            <div className="mt-1 flex items-baseline gap-2">
              <OddsTick
                value={cashed ? finalValue : value}
                decimals={0}
                prefix="R$ "
                duration={cashed ? 0.5 : 0.6}
                className="text-4xl font-bold text-[#34F5A0]"
              />
              {!cashed && (
                <motion.span
                  className="flex items-center gap-0.5 text-[#34F5A0]"
                  animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  <TrendingUp className="h-4 w-4" />
                </motion.span>
              )}
            </div>
            <span className={cn(mono(), "text-[11px] text-[#8B83A8]")}>
              banca R$ {STAKE} · lucro +R$ {Math.max(0, profit).toFixed(0)}
            </span>
          </div>
          <div className="text-right">
            <HudLabel>Se levar até o fim</HudLabel>
            <span className={cn(mono(), "mt-1 block text-lg font-semibold text-[#EDEAF7]")}>
              R$ {FULL_PAYOUT}
            </span>
          </div>
        </div>

        {/* barra do valor entre stake e payout total */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[rgba(139,131,168,0.16)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(0, progress * 100))}%`,
              background: GLOW.green,
              boxShadow: `0 0 10px ${GLOW.green}`,
            }}
          />
        </div>
      </div>

      {/* botão de cash out pulsante */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {cashed ? (
            <motion.div
              key="cashed"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#34F5A0]/40 bg-[#34F5A0]/12 p-4 text-center"
            >
              <span className="flex items-center gap-2">
                <Check className="h-5 w-5" strokeWidth={3} color={GLOW.green} />
                <span
                  className={cn(
                    mono(),
                    "text-lg font-bold uppercase tracking-[0.06em] text-[#34F5A0]",
                  )}
                  style={{ textShadow: "0 0 16px rgba(52,245,160,0.5)" }}
                >
                  Cash out feito · R$ {finalValue}
                </span>
              </span>
              <p className="text-[12px] text-[#8B83A8]">
                Você garantiu o lucro e mantém a meta viva. Inteligente.
              </p>
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1.5 text-[12px] text-[#8B83A8] transition hover:text-[#EDEAF7]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                voltar a aposta ao vivo
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="cashbtn"
              type="button"
              onClick={doCashOut}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                mono(),
                "relative flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#34F5A0] px-5 text-sm font-bold uppercase tracking-[0.12em] text-[#0E0B1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34F5A0]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#171327]",
              )}
            >
              <motion.span
                aria-hidden
                className="absolute inset-0 rounded-xl"
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        boxShadow: [
                          "0 0 0px rgba(52,245,160,0)",
                          "0 0 26px 2px rgba(52,245,160,0.7)",
                          "0 0 0px rgba(52,245,160,0)",
                        ],
                      }
                }
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <HandCoins className="relative h-5 w-5" />
              <span className="relative">Cash out · R$ {value}</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-[#8B83A8]">
        <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0" color={GLOW.green} />
        <span>
          O cash out cresce conforme você avança na meta. Tirar agora trava o lucro; seguir até o
          fim paga o retorno cheio. Você decide o risco.
        </span>
      </p>
    </Panel>
  );
}
