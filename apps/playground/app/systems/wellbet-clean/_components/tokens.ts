/** WellBet Clean — tokens derivados da marca oficial (lib/brand). */
import { C, brl, brl0, odd, pct } from "@/lib/brand";

export const W = {
  paper: C.paper,
  surface: "#FFFFFF",
  surfaceMute: "#F2F4FB",

  ink: C.ink,
  inkSoft: C.inkSoft,
  inkMute: C.inkMute,
  line: C.line,

  blue: C.blue,
  blueDeep: C.blueDeep,
  blueSoft: C.blueSoft,
  blueWash: C.blueWash,

  green: C.green,
  greenDeep: C.greenDeep,
  greenInk: C.greenInk,
  greenWash: C.greenWash,

  pink: C.pink,
};

/** Spring suave (só entre 2 valores). */
export const SPRING = { type: "spring", stiffness: 320, damping: 26 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 180, damping: 22 } as const;

/** Sombra de cartão "fintech" — sutil, sem neon. */
export const CARD_SHADOW =
  "0 1px 2px rgba(8,22,30,.05), 0 12px 30px -16px rgba(8,22,30,.22)";
export const CARD_SHADOW_LG =
  "0 2px 6px rgba(8,22,30,.06), 0 28px 60px -24px rgba(57,69,255,.28)";

export { brl, brl0, odd, pct };
