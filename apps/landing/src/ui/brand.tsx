import type { CSSProperties, JSX } from "react";
import { cn } from "@/lib/utils";

/**
 * Brandmark oficial wellbet & Co. — o raio-seta (path vetorial REAL do deck,
 * BRAND.md §4). `fill: currentColor`, recolorível. Nunca distorça.
 */
const BOLT_PATH =
  "M 1203.457031 429.820312 C 1164.347656 497.035156 1022.339844 731.679688 1022.332031 731.691406 L 999.492188 597.003906 L 707.671875 688.765625 L 911.476562 431.011719 L 832.222656 350.699219 L 833.445312 348.308594 L 1151.824219 348.308594 C 1232.558594 348.308594 1212.242188 414.71875 1203.457031 429.820312";
const BOLT_VIEWBOX = "707.67 348.31 524.89 383.38";

/**
 * Raio-seta DECORATIVO (aria-hidden): nunca é o único portador de significado —
 * vive como bullet de eyebrow e ao lado do texto "Charya" no Wordmark, então
 * anunciá-lo geraria ruído ("Charya Charya") para leitores de tela.
 */
export function BoltMark({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}): JSX.Element {
  return (
    <svg
      viewBox={BOLT_VIEWBOX}
      className={className}
      style={style}
      aria-hidden
      focusable="false"
      fill="currentColor"
    >
      <path d={BOLT_PATH} />
    </svg>
  );
}

/** Raio num quadrado de CANTO VIVO, magenta CHAPADO (consistente com os blocos). */
function BoltTile({ size = 36, className }: { size?: number; className?: string }): JSX.Element {
  return (
    <span
      className={cn("inline-grid place-items-center", className)}
      style={{ width: size, height: size, background: "var(--color-magenta)", borderRadius: 0 }}
    >
      <BoltMark style={{ width: size * 0.54, height: "auto", color: "#0A0D16" }} />
    </span>
  );
}

/** Lockup do produto: tile + "CHARYA" em Anton condensada. `tone` ajusta a cor. */
export function Wordmark({
  size = 30,
  tone = "light",
  className,
}: {
  size?: number;
  tone?: "light" | "ink";
  className?: string;
}): JSX.Element {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BoltTile size={size} />
      <span
        className="font-[family-name:var(--font-archivo)] uppercase leading-none tracking-[0.01em]"
        style={{ color: tone === "light" ? "#FFFFFF" : "#0A0D16", fontSize: size * 0.82 }}
      >
        Charya
      </span>
    </span>
  );
}
