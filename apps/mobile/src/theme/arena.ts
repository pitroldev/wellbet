/**
 * CHAMA VIOLETA — direção visual do app WellBet (consumidor), sobre a estrutura
 * Midnight Aurora (ver docs/WellBet_Design_System.md).
 *
 * Premium escuro com brilho neon suave: grounds em ink-petróleo (não preto
 * morto), superfícies de VIDRO translúcido sobre uma aurora animada, cantos
 * generosos, e a assinatura violeta→azul→ciano nos gradientes. Dopamina vem de
 * LUZ, GLOW e MOVIMENTO — nunca de sombra RN (que vira cinza no Android).
 *
 * Por que viver AQUI e não em `@charya/ui-tokens`: aquele pacote é compartilhado
 * com o admin e codifica DELIBERADAMENTE a marca sóbria. Este override é LOCAL ao
 * app de consumidor.
 *
 * Uso: valores crus (hex/rgba) para estilo IMPERATIVO — Skia, Reanimated, props
 * nativas que não aceitam className. O estilo estático vem das classes do
 * NativeWind (ver tailwind.config.js, espelho desta paleta — mantenha em sincronia).
 */

/** Paleta CHAMA VIOLETA. */
export const arena = {
  // Grounds — ink-petróleo, com vida (não preto chapado).
  void: "#050D13", // ground mais fundo do app (atrás da aurora; poços/scrim)
  ink: "#08161E", // background do app
  surface: "#0E202B", // cartões sólidos
  surfaceElevated: "#132836", // surface elevada / segmento pressionado
  line: "#1B3A4D", // bordas / hairlines opacas

  // Papel — superfície CLARA ocasional (ritmo claro/escuro).
  paper: "#FAFBFC",
  paperInk: "#08161E", // texto sobre papel
  paperMute: "#53626E", // texto secundário sobre papel
  paperLine: "#E2E7EB", // bordas sobre papel

  // Primária da marca (o violeta do símbolo — blocos, CTAs, fills).
  violet: "#5032FC",
  violetDeep: "#3D22D6", // pressed/hover de CTA, bordas fortes
  violetSoft: "#9D8FFF", // texto/ícone violeta legível SOBRE ESCURO (AA)

  // Acentos azuis — família dos assets 3D (rim de neon).
  blue: "#4A96FF",
  cyan: "#3EC0FF",

  // Vitória / "green".
  green: "#41FFCA",
  greenDeep: "#10B981",
  mint: "#7BFFDC", // verde suave para texto/realce sobre escuro
  greenText: "#047857", // verde legível como TEXTO sobre papel (AA)
  greenInk: "#0A2920",

  // Erro / perigo.
  danger: "#FF4D6D",
  dangerDeep: "#E23A57",

  // Texto sobre escuro.
  white: "#FFFFFF",
  fog: "#B0C4D4", // secundário
  fogMute: "#7D93A4", // terciário
} as const;

export type ArenaColor = keyof typeof arena;

/**
 * Tokens TRANSLÚCIDOS (rgba) — a alma do "frosted". Vidro = branco a baixa opacidade
 * sobre a aurora; hairlines = bordas de 1px que captam a luz; washes = tinta de cor
 * difusa atrás de chips/realces.
 */
export const arenaAlpha = {
  glass: "rgba(255,255,255,0.045)", // preenchimento de card frosted
  glassStrong: "rgba(255,255,255,0.07)", // card de herói
  glassPressed: "rgba(255,255,255,0.10)",
  hairline: "rgba(255,255,255,0.10)", // borda de 1px padrão
  hairlineStrong: "rgba(255,255,255,0.18)",

  violetWash: "rgba(80,50,252,0.20)",
  violetGlow: "rgba(80,50,252,0.55)",
  blueWash: "rgba(74,150,255,0.14)",
  cyanGlow: "rgba(62,192,255,0.45)",
  greenWash: "rgba(65,255,202,0.14)",
  greenGlow: "rgba(65,255,202,0.5)",
  dangerWash: "rgba(255,77,109,0.16)",

  scrim: "rgba(5,13,19,0.60)", // véu sobre mídia (legibilidade)
  whiteSoft: "rgba(255,255,255,0.08)",
} as const;

/** Escala de raio (px) — cantos generosos. Espelha o `borderRadius` do Tailwind. */
export const radius = {
  xs: 10,
  sm: 14,
  md: 18,
  lg: 22,
  xl: 28,
  "2xl": 34,
  pill: 999,
} as const;

/**
 * Stops de gradiente para `expo-linear-gradient` e Skia. A assinatura da marca
 * (violeta→azul→ciano) é montada com estes arrays. Use `start={{x:0,y:0}}
 * end={{x:1,y:1}}` (≈125°) salvo indicação.
 */
export const gradients = {
  /** Assinatura: violeta → azul → ciano (botão primário, régua, realces). */
  brand: ["#5032FC", "#4A96FF", "#3EC0FF"] as readonly [string, string, string],
  /** Variante clara (texto/realce suave, hairline gradiente). */
  brandSoft: ["#9D8FFF", "#4A96FF", "#6ECCFB"] as readonly [string, string, string],
  /** Base do app — azul-noite → ink → void (fundo vertical da aurora). */
  aurora: ["#0D1E33", "#08161E", "#050D13"] as readonly [string, string, string],
  /** Anel de progresso (sweep violeta→azul→verde — termina no green). */
  ring: ["#5032FC", "#4A96FF", "#41FFCA"] as readonly [string, string, string],
  /** Brilho de topo do vidro (sheen). */
  glassSheen: ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.0)"] as readonly [string, string],
  /** Hairline gradiente (borda viva de cards de herói). */
  hairline: [
    "rgba(80,50,252,0.55)",
    "rgba(74,150,255,0.35)",
    "rgba(65,255,202,0.45)",
  ] as readonly [string, string, string],
  /** Vitória (green). */
  victory: ["#41FFCA", "#10B981"] as readonly [string, string],
} as const;

export type GradientName = keyof typeof gradients;

/**
 * Elevação NEUTRA suave para cartões (sombra preta discreta — nunca sombra
 * COLORIDA, que vira cinza no Android). Espalhe num `style={{ ...glow.card }}`.
 * Use com parcimônia; a profundidade principal vem do vidro + aurora + hairline.
 */
export const glow = {
  card: {
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
} as const;
