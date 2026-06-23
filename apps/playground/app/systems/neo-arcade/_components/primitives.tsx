"use client";

import { cn } from "@/lib/utils";

/**
 * Neo-Arcade shared primitives.
 * Pixel borders are built from stacked box-shadows (stepped, NO border-radius),
 * so the chrome reads "8-bit" while the layout underneath stays adult & legible.
 */

/* Stepped pixel border via stacked box-shadows. `c` = border color. */
export function pixelBorder(c: string, t = 4): string {
  // four offset hard shadows = crisp 1-step pixel frame
  return [
    `${t}px 0 0 0 ${c}`,
    `-${t}px 0 0 0 ${c}`,
    `0 ${t}px 0 0 ${c}`,
    `0 -${t}px 0 0 ${c}`,
  ].join(", ");
}

/* A deeper, dropped pixel shadow used on raised cards / buttons. */
export function pixelDrop(c: string, d = 6): string {
  return `${d}px ${d}px 0 0 ${c}`;
}

type FrameProps = {
  children: React.ReactNode;
  className?: string;
  border?: string;
  drop?: string;
  style?: React.CSSProperties;
};

/** Card with a hard pixel frame + dropped shadow. No radius, ever. */
export function PixelFrame({
  children,
  className,
  border = "#6D28D9",
  drop = "#2E1065",
  style,
}: FrameProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{
        boxShadow: `${pixelBorder(border, 4)}, ${pixelDrop(drop, 8)}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Deterministic pseudo-random in [0,1) derived from an integer seed.
 * Lets us build hand-made confetti/particle bursts whose layout depends only
 * on the particle index (stable across server/client — no Math.random in render).
 */
export function seeded(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export type Particle = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  delay: number;
  color: string;
};

/**
 * Build N pixel particles fanning outward in a ring, with index-derived jitter.
 * Pure + deterministic so it can be regenerated on every burst (key bump).
 */
export function makeBurst(count: number, colors: string[], spread = 120): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const ang = (i / count) * Math.PI * 2 + seeded(i) * 0.9;
    const dist = spread * (0.55 + seeded(i + 99) * 0.6);
    return {
      id: i,
      x: Math.cos(ang) * dist,
      y: Math.sin(ang) * dist - spread * 0.25, // bias upward, like confetti
      rotate: (seeded(i + 7) - 0.5) * 540,
      scale: 0.7 + seeded(i + 31) * 0.9,
      delay: seeded(i + 53) * 0.06,
      color: colors[i % colors.length],
    };
  });
}

/** HUD label in Silkscreen. */
export function HudLabel({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("font-[family-name:var(--font-hud)] uppercase tracking-[0.18em]", className)}
      style={style}
    >
      {children}
    </span>
  );
}

/** Pixel shield icon (SVG, stepped). Used for streak protection. */
export function PixelShield({
  size = 28,
  fill = "#22E06B",
  stroke = "#120A24",
}: {
  size?: number;
  fill?: string;
  stroke?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path fill={fill} d="M3 2h10v2h1v5h-1v1h-1v1h-1v1h-1v1H6v-1H5v-1H4v-1H3V9H2V4h1z" />
      <path fill={stroke} d="M6 6h1v1H6zM9 6h1v1H9zM7 9h2v1H7zM6 8h1v1H6zM9 8h1v1H9z" />
    </svg>
  );
}

/** Pixel coin icon (SVG). Used for score / wallet accents. */
export function PixelCoin({ size = 24, fill = "#FFD60A" }: { size?: number; fill?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path fill={fill} d="M5 1h6v1h2v1h1v10h-1v1h-2v1H5v-1H3v-1H2V3h1V2h2z" />
      <path fill="#B8860B" d="M5 1h6v1H5zM3 2h2v1H3zM13 3h1v10h-1zM11 13h2v1h-2zM5 14h6v1H5z" />
      <path fill="#FFF3B0" d="M6 4h2v8H6z" />
    </svg>
  );
}

/**
 * Pixel heart icon (SVG). Used for streak "lives".
 * Default fill is the playful coin-amarelo — win-verde is sacred and must be
 * passed EXPLICITLY (fill="#22E06B") only where a heart marks a real victory
 * (a day already hit, a squad member already done). Never green by default.
 */
export function PixelHeart({
  size = 22,
  fill = "#FFD60A",
  empty = false,
}: {
  size?: number;
  fill?: string;
  empty?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path
        fill={empty ? "transparent" : fill}
        stroke={empty ? "#4A3A7A" : "none"}
        d="M3 2h4v1h2V2h4v1h1v4h-1v2h-1v1h-1v1h-1v1h-1v1H9v1H7v-1H6v-1H5v-1H4v-1H3V9H2V7H1V3h2z"
      />
    </svg>
  );
}

/** Pixel star icon (SVG). Used for XP / sparkle accents. */
export function PixelStar({ size = 20, fill = "#8B5CF6" }: { size?: number; fill?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path fill={fill} d="M7 1h2v4h2v1h4v2h-4v1h-2v4H7v-4H5V8H1V6h4V5h2z" />
    </svg>
  );
}

/** Pixel flame icon (SVG). Used for streak fire — grows/blinks as it climbs. */
export function PixelFlame({
  size = 26,
  fill = "#FFD60A",
  inner = "#FF7A00",
}: {
  size?: number;
  fill?: string;
  inner?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      <path
        fill={fill}
        d="M8 1h1v2h1v1h1v1h1v2h1v3h-1v2h-1v1h-1v1H6v-1H5v-1H4v-2H3V7h1V5h1V3h1V2h1z"
      />
      <path fill={inner} d="M8 6h1v1h1v3H9v2H7v-2H6V8h1V7h1z" />
      <path fill="#FFF3B0" d="M7 9h1v2H7z" />
    </svg>
  );
}
