"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity, Dumbbell } from "lucide-react";
import { useProduct } from "./product-context";
import { PRODUCT } from "./tokens";
import { SPRING, GLASS, GLASS_LINE } from "./tokens";

/**
 * Toggle-assinatura WellBet ↔ GymBet. Ao alternar, o "pill" desliza (layoutId),
 * a cor-acento morfa e o subtítulo troca com motion. Re-tematiza o painel inteiro
 * via contexto. Alvo de toque ≥ 44px.
 */
export function ProductToggle({ compact = false }: { compact?: boolean }) {
  const { product, setProduct, theme } = useProduct();

  return (
    <div
      className="inline-flex items-center rounded-full p-1"
      style={{ background: GLASS, boxShadow: "inset 0 0 0 1px " + GLASS_LINE }}
    >
      {(["well", "gym"] as const).map((id) => {
        const p = PRODUCT[id];
        const active = product === id;
        const Icon = id === "well" ? Activity : Dumbbell;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setProduct(id)}
            aria-pressed={active}
            className="relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold transition-colors"
            style={{ color: active ? (id === "well" ? "#fff" : "#fff") : "rgba(255,255,255,.6)" }}
          >
            {active && (
              <motion.span
                layoutId="product-pill"
                transition={SPRING}
                className="absolute inset-0 -z-10 rounded-full"
                style={{ background: p.accent, boxShadow: `0 8px 22px -8px ${p.accent}` }}
              />
            )}
            <Icon size={16} strokeWidth={2.6} />
            {!compact && p.name}
          </button>
        );
      })}

      {!compact && (
        <div className="ml-2 mr-3 hidden min-w-[150px] sm:block">
          <AnimatePresence mode="wait">
            <motion.span
              key={product}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="block text-[11px] font-semibold leading-tight"
              style={{ color: theme.accentSoft }}
            >
              {theme.world}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
