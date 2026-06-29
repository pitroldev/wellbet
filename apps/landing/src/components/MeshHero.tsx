"use client";

import type { JSX } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";

/**
 * Fundo do hero = mesh-gradient WebGL animado (Paper Shaders) na iridescência
 * do GYMBET (roxo→magenta→pink sobre o ink navy #0A0D16). Carregado client-only
 * (next/dynamic ssr:false) sobre um gradiente CSS estático que pinta de imediato
 * (bom LCP) e serve de fallback / reduce-motion. Decorativo (aria-hidden).
 */
const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false },
);

const COLORS = ["#0A0D16", "#5B21B6", "#7A1BD6", "#FF00FF", "#FF80E1"];

const CSS_BASE =
  "radial-gradient(120% 85% at 16% -12%, rgba(255,0,255,0.30), transparent 55%)," +
  "radial-gradient(115% 90% at 94% 12%, rgba(122,27,214,0.34), transparent 55%)," +
  "radial-gradient(95% 80% at 60% 115%, rgba(255,128,225,0.14), transparent 55%)," +
  "#0a0d16";

export function MeshHero(): JSX.Element {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: CSS_BASE }} />
      {!reduce && (
        <MeshGradient
          colors={COLORS}
          distortion={1.1}
          swirl={0.85}
          speed={0.18}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.92 }}
        />
      )}
    </div>
  );
}
