"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { R, halftone, PRINT_SHADOW, STAMP_SPRING } from "./tokens";
import { Stamp } from "./print-kit";

type Variant = { quote: string; sign: string; a: string; b: string };
const VARIANTS: Variant[] = [
  { quote: "Quanto você apostaria em si mesmo?", sign: "campanha · WellBet", a: R.magenta, b: R.blue },
  { quote: "Mudanças reais acontecem quando existe algo em jogo.", sign: "masterbrand", a: R.blue, b: R.green },
  { quote: "Treine. Compita. Faturar.", sign: "campanha · GymBet", a: R.indigo, b: R.pink },
];

/** Pull-quote / pôster de campanha com overprint (duas tintas em multiply). */
export function Campaign() {
  const [vi, setVi] = useState(0);
  const v = VARIANTS[vi];

  return (
    <motion.button
      type="button"
      onClick={() => setVi((i) => (i + 1) % VARIANTS.length)}
      whileTap={{ scale: 0.99 }}
      transition={STAMP_SPRING}
      className="relative block w-full overflow-hidden p-7 text-left sm:p-9"
      style={{ background: R.paper, border: `2.5px solid ${R.ink}`, boxShadow: PRINT_SHADOW }}
      aria-label="Trocar campanha"
    >
      {/* dois campos de halftone sobrepostos em multiply -> 3a cor */}
      <span aria-hidden className="pointer-events-none absolute -left-10 -top-10 h-52 w-52 rounded-full" style={{ ...halftone(v.a, 10, 0.4), mixBlendMode: "multiply", opacity: 0.85 }} />
      <span aria-hidden className="pointer-events-none absolute -bottom-12 right-0 h-56 w-56 rounded-full" style={{ ...halftone(v.b, 9, 0.4), mixBlendMode: "multiply", opacity: 0.85 }} />

      <div className="relative">
        <div className="flex items-center justify-between">
          <Quote size={34} fill={v.a} style={{ color: v.a, mixBlendMode: "multiply" }} />
          <Stamp color={v.b} rotate={-7} style={{ fontSize: 10 }}>
            ed. limitada
          </Stamp>
        </div>

        <motion.p
          key={vi}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={STAMP_SPRING}
          className="mt-3 leading-[0.96]"
          style={{
            color: R.ink,
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(1.9rem,6vw,3rem)",
            fontVariationSettings: '"SOFT" 60,"WONK" 1,"opsz" 144',
          }}
        >
          {v.quote}
        </motion.p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em]" style={{ color: R.ink }}>
            {v.sign}
          </span>
          <span className="font-[family-name:var(--font-mono)] text-[11px]" style={{ color: R.magenta }}>
            toque pra rodar a tinta →
          </span>
        </div>
      </div>
    </motion.button>
  );
}
