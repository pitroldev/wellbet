/** GymBet Arena — tokens derivados da marca oficial (lib/brand). Arena escura, magenta+roxo. */
import { C, GRADIENT, brl, brl0, odd, pct, seeded } from "@/lib/brand";

export const G = {
  // grounds escuros
  navy: C.navy, // #0B1226 — ground principal
  navySoft: C.navySoft, // #151D3A — cartões
  navyLine: C.navyLine, // #232C50 — bordas
  ink: C.ink, // #08161E — quase-preto

  // primária
  magenta: C.magenta, // #FF00FF
  magentaDeep: C.magentaDeep, // #C800D6
  magentaWash: "rgba(255,0,255,.12)",

  // roxo / indigo
  purple: "#7A1BD6",
  purpleDeep: "#5A12A0",
  indigo: C.indigo, // #3215AD
  indigoSoft: C.indigoSoft,

  // vitória / jackpot
  green: C.green, // #41FFCA
  greenDeep: C.greenDeep,
  greenInk: C.greenInk,

  // acentos rosa
  pink: C.pink, // #FF80E1
  pinkPale: C.pinkPale, // #FDC0FF

  // texto sobre escuro
  white: "#FFFFFF",
  fog: "#B9C0E0", // texto secundário sobre navy
  fogMute: "#7A85B5", // texto terciário
} as const;

export const GRAD = GRADIENT;

/** Spring (só entre 2 valores — NUNCA em arrays de 3+ keyframes). */
export const SPRING = { type: "spring", stiffness: 360, damping: 24 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 200, damping: 22 } as const;
export const SPRING_POP = { type: "spring", stiffness: 520, damping: 18 } as const;

/** Glow magenta sutil (box-shadow colorido). */
export const GLOW_MAGENTA = "0 0 0 1px rgba(255,0,255,.35), 0 18px 48px -18px rgba(255,0,255,.55)";
export const GLOW_GREEN = "0 0 0 1px rgba(65,255,202,.4), 0 18px 48px -16px rgba(65,255,202,.5)";

/** Estilhaço diagonal (clip-path polygon) — motivo da marca. */
export const SHARD_CLIP = "polygon(0 0, 100% 0, 100% 78%, 0 100%)";
export const SHARD_CLIP_R = "polygon(0 0, 100% 0, 100% 100%, 0 78%)";

export { brl, brl0, odd, pct, seeded };
