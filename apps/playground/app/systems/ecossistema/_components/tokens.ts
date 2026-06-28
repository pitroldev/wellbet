/**
 * Ecossistema / & Co. — tokens derivados da marca oficial (lib/brand).
 * O "sistema operacional" da holding: indigo real como campo, periwinkle/glass
 * como superfície, e dois acentos de produto que re-tematizam o painel inteiro
 * (WellBet azul/menta ↔ GymBet magenta). Agentes: derive daqui, não invente cor.
 */
import { C, GRADIENT, brl, brl0, odd, pct, seeded } from "@/lib/brand";

export const E = {
  /** Campo do masterbrand (ground escuro indigo). */
  field: C.indigo, // #3215AD
  fieldDeep: C.indigoDeep, // #220C82
  fieldSoft: C.indigoSoft, // #4B2BD6

  /** Superfícies "glass" periwinkle sobre indigo. */
  peri: C.periwinkle, // #CCD1FF
  periSoft: C.periSoft, // #E4E7FF

  ink: C.ink,
  white: C.white,

  blue: C.blue,
  blueSoft: C.blueSoft,
  blueDeep: C.blueDeep,

  green: C.green,
  greenDeep: C.greenDeep,
  greenInk: C.greenInk,

  magenta: C.magenta,
  magentaDeep: C.magentaDeep,
  pink: C.pink,
  pinkPale: C.pinkPale,
} as const;

/** Vidro periwinkle sobre indigo (superfície-padrão do painel). */
export const GLASS = "rgba(204,209,255,0.10)";
export const GLASS_STRONG = "rgba(204,209,255,0.16)";
export const GLASS_LINE = "rgba(204,209,255,0.22)";
export const GLASS_LINE_SOFT = "rgba(204,209,255,0.14)";

/** Acentos de produto — o toggle WellBet ↔ GymBet morfa entre estes. */
export type Product = "well" | "gym";

export const PRODUCT = {
  well: {
    id: "well" as Product,
    name: "WellBet",
    world: "Emagrecimento · saúde",
    accent: C.blue,
    accentSoft: C.blueSoft,
    glow: C.green, // o "green" da vitória
    glowInk: C.greenInk,
    gradient: GRADIENT.voltage, // menta → azul
    promise: "Sua disciplina agora vale mais.",
    metric: "peso",
  },
  gym: {
    id: "gym" as Product,
    name: "GymBet",
    world: "Treino · streak · ranking",
    accent: C.magenta,
    accentSoft: C.pink,
    glow: C.pink,
    glowInk: C.ink,
    gradient: GRADIENT.gymbet, // magenta → indigo
    promise: "Treine. Compita. Fature.",
    metric: "treino",
  },
} as const;

/** Spring suave — SÓ entre 2 valores (nunca em keyframes 3+). */
export const SPRING = { type: "spring", stiffness: 280, damping: 26 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 170, damping: 22 } as const;

/** Sombra de painel premium sobre indigo. */
export const PANEL_SHADOW =
  "0 1px 0 rgba(255,255,255,.06) inset, 0 24px 60px -28px rgba(8,4,40,.7)";

export { GRADIENT, brl, brl0, odd, pct, seeded };
