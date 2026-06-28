/** Editorial / muma — tokens derivados da marca oficial (lib/brand).
 *  Revista de moda encontra fintech: paper claro, pink + indigo protagonistas,
 *  a serifa manda. Agentes: derivam daqui, não editam lib/brand. */
import { C, GRADIENT, brl, brl0, odd, pct, seeded } from "@/lib/brand";

export const M = {
  // superfícies claras — MUITO respiro
  paper: C.paper, // #FAFBFC
  white: C.white,
  paperMute: C.paperMute, // #EEF0F6
  peri: C.periwinkle, // superfície indigo clara
  periSoft: C.periSoft,
  pinkWash: "#FFF1FB", // wash rosa pálido (derivado, p/ superfície clara)

  // tinta
  ink: C.ink,
  inkSoft: C.inkSoft,
  inkMute: C.inkMute,
  line: C.line,
  hair: "#D9DCE6", // fio fino 1px ligeiramente mais escuro que line p/ grade

  // protagonistas
  pink: C.pink, // #FF80E1
  pinkPale: C.pinkPale, // #FDC0FF
  indigo: C.indigo, // #3215AD
  indigoSoft: C.indigoSoft,
  indigoDeep: C.indigoDeep,

  // green SÓ p/ vitória
  green: C.green,
  greenDeep: C.greenDeep,
  greenInk: C.greenInk,
} as const;

/** Eixos da Fraunces — o ar "muma" fashion (curvy, alto-contraste). */
export const FRAUNCES_DISPLAY = '"SOFT" 60,"WONK" 1,"opsz" 144';
export const FRAUNCES_TEXT = '"SOFT" 40,"WONK" 0,"opsz" 80';

/** Springs — só entre 2 valores (HARD RULE). */
export const SPRING = { type: "spring", stiffness: 320, damping: 26 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 180, damping: 22 } as const;

/** Sombra editorial — discreta, "papel premium". */
export const CARD_SHADOW =
  "0 1px 2px rgba(8,22,30,.04), 0 18px 44px -28px rgba(50,21,173,.30)";

export { GRADIENT, brl, brl0, odd, pct, seeded };
