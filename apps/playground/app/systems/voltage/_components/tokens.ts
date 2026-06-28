/**
 * VOLTAGE — tokens de marca (derivados de @/lib/brand).
 * Energia elétrica: ground quase-preto, herói gradiente menta→azul (GRADIENT.voltage),
 * superfícies de VIDRO (translúcidas, backdrop-blur, borda branca translúcida),
 * iridescência green↔blue. O raio (BoltMark) é o motivo vivo.
 * Agentes: derive daqui; NUNCA edite @/lib/brand.
 */
import { C, GRADIENT, brl, brl0, odd, pct, seeded } from "@/lib/brand";

export const V = {
  // ground quase-preto
  ground: C.ink, // #08161E
  groundDeep: "#040D13", // ainda mais fundo (vinheta)

  // herói
  green: C.green, // #41FFCA
  greenDeep: C.greenDeep, // #18B488
  greenInk: C.greenInk, // texto sobre verde
  blue: C.blue, // #3945FF
  blueSoft: C.blueSoft, // #656FFF
  blueDeep: C.blueDeep,

  // texto sobre escuro
  white: "#FFFFFF",
  ink: "#EAF6FF", // branco levemente frio (corpo)
  inkSoft: "rgba(234,246,255,0.66)",
  inkFaint: "rgba(234,246,255,0.42)",

  // vidro
  glass: "rgba(255,255,255,0.045)",
  glassUp: "rgba(255,255,255,0.075)",
  glassLine: "rgba(255,255,255,0.12)",
  glassLineUp: "rgba(255,255,255,0.20)",
} as const;

export const GRAD = {
  /** herói green→blue (GRADIENT.voltage oficial). */
  bolt: GRADIENT.voltage,
  /** mais ar — green→blueSoft. */
  boltSoft: GRADIENT.voltageSoft,
  /** texto/linha iridescente, 90deg pra width-fills. */
  flow: "linear-gradient(90deg,#41FFCA 0%,#3945FF 100%)",
  /** halo radial elétrico. */
  halo: "radial-gradient(60% 60% at 50% 0%, rgba(65,255,202,0.18) 0%, rgba(57,69,255,0.10) 45%, rgba(8,22,30,0) 80%)",
} as const;

/** Spring suave — APENAS entre 2 valores (regra de runtime). */
export const SPRING = { type: "spring", stiffness: 360, damping: 26 } as const;
export const SPRING_POP = { type: "spring", stiffness: 560, damping: 20 } as const;

/** Sombra de glow elétrico (para botões/cards herói). */
export const GLOW = "0 18px 50px -18px rgba(57,69,255,0.65)";
export const GLOW_GREEN = "0 18px 50px -18px rgba(65,255,202,0.55)";

/** Borda + brilho de vidro reutilizável. */
export const GLASS_RING = `inset 0 0 0 1px ${V.glassLine}, inset 0 1px 0 0 rgba(255,255,255,0.10)`;

export { brl, brl0, odd, pct, seeded };
