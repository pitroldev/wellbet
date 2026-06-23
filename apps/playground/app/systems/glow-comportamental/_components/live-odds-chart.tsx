"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_SOFT, GLOW, HudLabel, mono, OddsTick, Panel } from "./primitives";

/* ──────────────────────────────────────────────────────────────────────────
   COTAÇÃO AO VIVO — gráfico de cotação desenhado à mão em SVG que ganha
   um ponto a cada "treino concluído" (toque). A cotação da acumuladora sobe
   com pulso; o último ponto pisca em verde. Reset para brincar de novo.
   ────────────────────────────────────────────────────────────────────────── */

const W = 520;
const H = 200;
const PAD = { top: 18, right: 16, bottom: 22, left: 34 };

// cotação inicial ao longo de "dias" — sobe a cada check-in
const SEED = [1.0, 1.12, 1.28, 1.31, 1.49, 1.62];

function nextOdd(prev: number, i: number) {
  // incremento determinístico, levemente variável (sem Math.random)
  const inc = 0.12 + ((i * 17) % 9) / 100;
  return Number((prev + inc).toFixed(2));
}

export function LiveOddsChart() {
  const [series, setSeries] = useState<number[]>(SEED);

  const min = 1.0;
  const max = Math.max(2.6, Math.ceil((series[series.length - 1] + 0.4) * 10) / 10);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const n = Math.max(series.length, 8); // mantém escala estável no eixo X
  const x = (i: number) => PAD.left + (i / (n - 1)) * innerW;
  const y = (v: number) => PAD.top + innerH - ((v - min) / (max - min)) * innerH;

  const line = series
    .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
    .join(" ");
  const area =
    series.length > 1
      ? `${line} L${x(series.length - 1).toFixed(1)},${(H - PAD.bottom).toFixed(1)} L${x(0).toFixed(1)},${(H - PAD.bottom).toFixed(1)} Z`
      : "";

  const last = series[series.length - 1];
  const lastPt = { cx: x(series.length - 1), cy: y(last) };

  const addPoint = () =>
    setSeries((s) => (s.length >= 8 ? s : [...s, nextOdd(s[s.length - 1], s.length)]));
  const reset = () => setSeries(SEED);
  const full = series.length >= 8;

  return (
    <Panel className="overflow-hidden p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#8B5CF6]/12">
            <LineChart className="h-5 w-5" color={GLOW.purple} />
          </div>
          <div>
            <HudLabel tone="purple">Cotação ao vivo</HudLabel>
            <h3 className="text-base font-semibold text-[#EDEAF7] sm:text-lg">
              Multiplicador da acumuladora
            </h3>
          </div>
        </div>
        <div className="text-right">
          <OddsTick
            value={last}
            decimals={2}
            suffix="×"
            className="block text-2xl font-bold text-[#34F5A0]"
          />
          <span className="text-[11px] text-[#8B83A8]">{series.length}/8 check-ins</span>
        </div>
      </div>

      <div className="mt-4 w-full overflow-hidden rounded-xl border border-[rgba(139,131,168,0.14)] bg-[#0E0B1A]/50 p-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Gráfico de cotação ao vivo, atual ${last.toFixed(2)} vezes`}
        >
          <defs>
            <linearGradient id="odds-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GLOW.green} stopOpacity="0.28" />
              <stop offset="100%" stopColor={GLOW.green} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="odds-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={GLOW.purple} />
              <stop offset="100%" stopColor={GLOW.green} />
            </linearGradient>
          </defs>

          {/* gridlines */}
          {[1.5, 2.0, 2.5].map((v) =>
            v < max ? (
              <g key={v}>
                <line
                  x1={PAD.left}
                  x2={W - PAD.right}
                  y1={y(v)}
                  y2={y(v)}
                  stroke="rgba(139,131,168,0.12)"
                  strokeWidth={1}
                />
                <text
                  x={PAD.left - 6}
                  y={y(v) + 3}
                  textAnchor="end"
                  className={mono()}
                  fontSize="9"
                  fill={GLOW.muted}
                >
                  {v.toFixed(1)}
                </text>
              </g>
            ) : null,
          )}

          {area && <path d={area} fill="url(#odds-area)" />}

          {series.length > 1 && (
            <motion.path
              key={series.length}
              d={line}
              fill="none"
              stroke="url(#odds-line)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0.86 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: EASE_SOFT }}
              style={{ filter: "drop-shadow(0 0 4px rgba(52,245,160,0.5))" }}
            />
          )}

          {/* pontos */}
          {series.map((v, i) => (
            <circle
              key={i}
              cx={x(i)}
              cy={y(v)}
              r={i === series.length - 1 ? 5 : 2.5}
              fill={i === series.length - 1 ? GLOW.green : GLOW.bg}
              stroke={i === series.length - 1 ? GLOW.green : GLOW.purple}
              strokeWidth={1.5}
            />
          ))}

          {/* halo pulsante no último ponto */}
          <motion.circle
            key={`halo-${series.length}`}
            cx={lastPt.cx}
            cy={lastPt.cy}
            r={5}
            fill="none"
            stroke={GLOW.green}
            strokeWidth={1.5}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: [0.8, 0, 0.8], scale: [1, 2.6, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${lastPt.cx}px ${lastPt.cy}px` }}
          />
        </svg>
      </div>

      <div className="mt-4 flex gap-2.5">
        <motion.button
          type="button"
          onClick={addPoint}
          disabled={full}
          whileTap={full ? undefined : { scale: 0.97 }}
          className={cn(
            mono(),
            "flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-semibold uppercase tracking-[0.1em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#34F5A0]/60",
            full
              ? "cursor-not-allowed border-[rgba(139,131,168,0.2)] text-[#8B83A8]"
              : "border-[#34F5A0]/45 bg-[#34F5A0]/12 text-[#34F5A0] hover:bg-[#34F5A0]/18",
          )}
        >
          <Plus className="h-4 w-4" />
          {full ? "Semana completa" : "Concluir treino · +1 ponto"}
        </motion.button>
        <button
          type="button"
          onClick={reset}
          aria-label="Resetar gráfico"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-[rgba(139,131,168,0.24)] bg-[#0E0B1A]/60 text-[#8B83A8] transition hover:border-[#8B5CF6]/60 hover:text-[#EDEAF7]"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
    </Panel>
  );
}
