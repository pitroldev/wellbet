"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, Flame } from "lucide-react";
import { useCountUp } from "@/app/components/use-count-up";
import { ArcGauge } from "./gauge";
import { useProduct } from "./product-context";
import { E, GLASS, GLASS_LINE, SPRING, brl, seeded } from "./tokens";

/** Sparkline determinística (seeded). 0..1 valores. */
function spark(seedBase: number, n: number) {
  return Array.from({ length: n }, (_, i) => 0.25 + seeded(seedBase + i * 3) * 0.7);
}

export function Dashboard() {
  const { product, theme, morphKey } = useProduct();
  const [bump, setBump] = useState(0);

  // banca unificada — muda conforme o produto p/ reforçar o morph
  const banca = product === "well" ? 12480 : 9320;
  const goal = product === "well" ? 0.72 : 0.58;
  const streak = product === "well" ? 12 : 18;
  const lucro = product === "well" ? 24 : 31;

  const animatedBanca = useCountUp(banca, 700, morphKey + bump);
  const pts = spark(product === "well" ? 1 : 99, 16);
  const maxP = Math.max(...pts);

  function deposit() {
    setBump((b) => b + 1);
  }

  return (
    <div
      className="relative overflow-hidden rounded-[28px] p-5 sm:p-6"
      style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg" style={{ background: theme.accent }}>
            <Wallet size={15} color="#fff" strokeWidth={2.4} />
          </span>
          <span className="text-sm font-extrabold text-white">Banca unificada</span>
        </div>
        <motion.span
          key={product}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-full px-2.5 py-1 text-[11px] font-bold"
          style={{ background: theme.accent, color: "#fff" }}
        >
          {theme.name}
        </motion.span>
      </div>

      {/* saldo herói com count-up */}
      <div className="mt-4">
        <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: E.peri, opacity: 0.7 }}>
          Saldo disponível
        </span>
        <p className="font-[family-name:var(--font-mono)] text-4xl font-medium tabular-nums" style={{ color: E.green }}>
          {brl(animatedBanca)}
        </p>

        {/* sparkline */}
        <div className="mt-3 flex h-12 items-end gap-1">
          {pts.map((p, i) => (
            <motion.span
              key={`${product}-${i}`}
              initial={{ height: 4, opacity: 0.4 }}
              animate={{ height: `${(p / maxP) * 100}%`, opacity: 1 }}
              transition={{ ...SPRING, delay: i * 0.012 }}
              className="flex-1 rounded-full"
              style={{ background: i === pts.length - 1 ? E.green : theme.accentSoft, opacity: 0.85 }}
            />
          ))}
        </div>
      </div>

      {/* gauges */}
      <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl p-3" style={{ background: "rgba(8,4,40,.4)" }}>
        <div className="flex flex-col items-center">
          <ArcGauge
            value={goal}
            color={theme.accent}
            size={104}
            sub="meta"
            label={
              <span className="font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums text-white">
                {Math.round(goal * 100)}%
              </span>
            }
          />
        </div>
        <div className="flex flex-col items-center">
          <ArcGauge
            value={Math.min(1, streak / 21)}
            color={E.pink}
            size={104}
            sub="streak"
            label={
              <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums text-white">
                <Flame size={14} style={{ color: E.pink }} fill={E.pink} />
                {streak}
              </span>
            }
          />
        </div>
        <div className="flex flex-col items-center">
          <ArcGauge
            value={Math.min(1, lucro / 40)}
            color={E.green}
            size={104}
            sub="lucro"
            label={
              <span className="inline-flex items-center gap-0.5 font-[family-name:var(--font-mono)] text-lg font-medium tabular-nums" style={{ color: E.green }}>
                <TrendingUp size={13} />+{lucro}%
              </span>
            }
          />
        </div>
      </div>

      <motion.button
        type="button"
        onClick={deposit}
        whileTap={{ scale: 0.97 }}
        transition={SPRING}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold"
        style={{ background: theme.accent, color: "#fff" }}
      >
        <Wallet size={16} /> Recarregar banca · {theme.world}
      </motion.button>
    </div>
  );
}
