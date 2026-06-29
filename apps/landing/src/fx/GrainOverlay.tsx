import type { JSX } from "react";

/**
 * Grão de filme fixo sobre toda a página (SVG feTurbulence inline, sem request).
 * É o detalhe que separa "premium/cartaz impresso" de "neon chapado". Sutil
 * (~4–5% opacity, mix-blend), puramente decorativo, sem custo de JS.
 */
export function GrainOverlay(): JSX.Element {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.045] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
