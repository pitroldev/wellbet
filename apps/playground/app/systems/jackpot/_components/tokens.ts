/** Jackpot / Slots — tokens derivados da marca oficial (lib/brand).
 *  Palácio de caça-níqueis: indigo profundo, magenta/pink protagonistas,
 *  verde menta pro WIN, dourado DISCRETO só pra moedas/ornamentos. */
import { C, GRADIENT, brl, brl0, odd, pct, seeded } from "@/lib/brand";

export const J = {
  // grounds (palácio)
  bg: C.indigoDeep, // #220C82
  bgDeep: "#190960",
  indigo: C.indigo, // #3215AD
  indigoSoft: C.indigoSoft,
  navy: C.navy,

  // superfícies escuras translúcidas (vidro do salão)
  surface: "rgba(255,255,255,0.06)",
  surfaceUp: "rgba(255,255,255,0.10)",
  line: "rgba(255,255,255,0.14)",
  lineSoft: "rgba(255,255,255,0.08)",

  // texto
  text: "#FFFFFF",
  textSoft: "rgba(255,255,255,0.74)",
  textMute: "rgba(255,255,255,0.50)",

  // protagonistas
  magenta: C.magenta, // #FF00FF
  magentaDeep: C.magentaDeep,
  pink: C.pink, // #FF80E1
  pinkPale: C.pinkPale,

  // win / jackpot
  green: C.green, // #41FFCA
  greenDeep: C.greenDeep,
  greenInk: C.greenInk,

  // acentos
  blue: C.blue,
  blueSoft: C.blueSoft,

  // dourado DISCRETO — só moedas/ornamentos de jackpot
  gold: "#FFD45E",
  goldDeep: "#E0A21B",
} as const;

export const GRAD = {
  jackpot: GRADIENT.jackpot, // magenta -> pink -> menta
  gymbet: GRADIENT.gymbet, // magenta -> indigo
  // brilho de palco / marquee
  marquee: "radial-gradient(circle, #FF80E1 0%, #FF00FF 60%, transparent 70%)",
} as const;

/** Spring suave — SÓ entre 2 valores (regra dura). */
export const SPRING = { type: "spring", stiffness: 320, damping: 26 } as const;
export const SPRING_SOFT = { type: "spring", stiffness: 180, damping: 20 } as const;

/** Glow neon magenta/pink reaproveitável. */
export const GLOW_MAGENTA = "0 0 0 1px rgba(255,0,255,.5), 0 0 28px -4px rgba(255,0,255,.65)";
export const GLOW_PINK = "0 0 0 1px rgba(255,128,225,.5), 0 0 26px -6px rgba(255,128,225,.6)";
export const GLOW_GREEN = "0 0 0 1px rgba(65,255,202,.6), 0 0 30px -4px rgba(65,255,202,.7)";
export const GLOW_GOLD = "0 0 22px -4px rgba(255,212,94,.7)";

export const CARD =
  "0 2px 8px rgba(0,0,0,.35), 0 30px 60px -30px rgba(255,0,255,.35), inset 0 0 0 1px rgba(255,255,255,.12)";

export { brl, brl0, odd, pct, seeded };
