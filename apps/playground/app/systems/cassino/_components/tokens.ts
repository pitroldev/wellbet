/**
 * Cassino Neon — tokens derivados da marca oficial (lib/brand).
 * Salão de cassino à noite sob neon: ground navy/ink, feltro green,
 * letreiros em magenta/blue/pink, profundidade indigo. Dourado quente SÓ
 * em moedas/jackpot, com parcimônia. Agentes: deriva daqui, não invente cor.
 */
import { C, GRADIENT, brl, brl0, odd, pct, seeded } from "@/lib/brand";

export const N = {
  // salão (ground escuro)
  ground: "#0B1226", // navy — o salão
  groundDeep: "#08161E", // ink — o mais fundo
  feltDeep: "#062A22", // sombra do feltro
  panel: "#0F1838", // superfície de cartão sobre o salão
  panelSoft: "#15204A",
  line: "rgba(255,255,255,.10)",
  lineSoft: "rgba(255,255,255,.06)",

  // feltro / dinheiro / vitória
  green: C.green, // #41FFCA
  greenDeep: C.greenDeep,
  greenInk: C.greenInk,

  // neon do letreiro
  magenta: C.magenta, // #FF00FF
  magentaDeep: C.magentaDeep,
  blue: C.blue, // #3945FF
  blueSoft: C.blueSoft,
  pink: C.pink, // #FF80E1
  indigo: C.indigo, // #3215AD profundidade
  indigoSoft: C.indigoSoft,

  // texto
  white: "#FFFFFF",
  mute: "#9BA6CF", // texto secundário sobre escuro
  muteSoft: "#6B76A8",

  // dourado quente discreto — SÓ moedas/jackpot
  gold: "#F4C95D",
  goldDeep: "#C9962B",
} as const;

export { GRADIENT, brl, brl0, odd, pct, seeded };

/** Spring só entre 2 valores. */
export const SPRING = { type: "spring", stiffness: 320, damping: 26 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 180, damping: 22 } as const;

/** Glow neon reutilizável (text-shadow). */
export const neonText = (c: string) =>
  `0 0 4px ${c}, 0 0 12px ${c}, 0 0 28px ${c}99`;

/** Glow neon de borda/caixa (box-shadow). */
export const neonBox = (c: string, strength = 1) =>
  `0 0 0 1px ${c}66, 0 0 18px ${c}${strength >= 1 ? "55" : "33"}, inset 0 0 22px ${c}22`;

/** Sombra de cartão premium do salão. */
export const CARD_SHADOW =
  "0 2px 8px rgba(0,0,0,.4), 0 30px 70px -30px rgba(0,0,0,.8)";

/** Textura sutil do feltro (radial dots) como background-image. */
export const FELT_TEXTURE =
  "radial-gradient(circle at 1px 1px, rgba(255,255,255,.05) 1px, transparent 0)";
