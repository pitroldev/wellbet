/**
 * GymBet Arena — paleta da direção visual adotada pelo app (o "system"
 * gymbet-arena do playground, agora promovido a tema do produto mobile).
 *
 * Por que viver AQUI e não em `@charya/ui-tokens`: aquele pacote é
 * compartilhado com o admin e codifica DELIBERADAMENTE a marca sóbria
 * ("verde-eucalipto, sem vibe de aposta barata"). A Arena é o oposto — navy
 * escuro, magenta neon, glows e gradiente competitivo. Mantemos esse override
 * LOCAL ao app de consumidor; o admin (console interno de revisão) segue sóbrio.
 *
 * Uso: valores crus (hex) para estilo IMPERATIVO — Skia, Reanimated, gradientes
 * e props nativas que não aceitam className. O estilo estático vem das classes
 * do NativeWind (ver tailwind.config.js, que deriva os aliases semânticos
 * — background/surface/foreground/primary/… — destas mesmas cores).
 */

/** Paleta da Arena (amostrada da identidade oficial wellbet & Co.). */
export const arena = {
  // Grounds escuros
  navy: "#0B1226", // ground principal (background)
  navySoft: "#151D3A", // cartões / surface
  navyLine: "#232C50", // bordas
  ink: "#08161E", // quase-preto (trilhos, poços)

  // Primária
  magenta: "#FF00FF",
  magentaDeep: "#C800D6",

  // Roxo / indigo (profundidade do gradiente)
  purple: "#7A1BD6",
  purpleDeep: "#5A12A0",
  indigo: "#3215AD",

  // Vitória / jackpot
  green: "#41FFCA",
  greenDeep: "#18B488",
  greenInk: "#0A2920",

  // Acentos rosa
  pink: "#FF80E1",
  pinkPale: "#FDC0FF",

  // Erro / perigo — vermelho-neon que lê bem sobre navy e harmoniza com
  // magenta/pink (a marca não tem dourado/vermelho de aposta barata).
  danger: "#FF4D6D",
  dangerDeep: "#E23A57",

  // Texto sobre escuro
  white: "#FFFFFF",
  fog: "#B9C0E0", // secundário
  fogMute: "#7A85B5", // terciário
} as const;

export type ArenaColor = keyof typeof arena;

/** Versões translúcidas usadas em washes/realces (rgba para sobrepor no navy). */
export const arenaAlpha = {
  magentaWash: "rgba(255,0,255,0.12)",
  magentaGlow: "rgba(255,0,255,0.55)",
  greenWash: "rgba(65,255,202,0.12)",
  greenGlow: "rgba(65,255,202,0.5)",
  whiteSoft: "rgba(255,255,255,0.08)",
  whiteLine: "rgba(255,255,255,0.14)",
} as const;

/**
 * Stops de gradiente para `expo-linear-gradient`. O RN não tem gradiente CSS;
 * a assinatura da marca (botão/realce magenta→roxo→indigo) é montada com estes
 * arrays. Use `start={{x:0,y:0}} end={{x:1,y:1}}` (≈125°) salvo indicação.
 */
export const gradients = {
  /** Assinatura GymBet: magenta → roxo → indigo. */
  gymbet: ["#FF00FF", "#7A1BD6", "#3215AD"] as readonly [string, string, string],
  /** Variante clara (texto/realce). */
  gymbetSoft: ["#FF00FF", "#FDC0FF", "#7A1BD6"] as readonly [string, string, string],
  /** Jackpot/celebração. */
  jackpot: ["#FF00FF", "#FF80E1", "#41FFCA"] as readonly [string, string, string],
  /** Vitória (green). */
  victory: ["#41FFCA", "#18B488"] as readonly [string, string],
} as const;

export type GradientName = keyof typeof gradients;

/**
 * Presets de "glow" (sombra colorida). Props de sombra do RN — iOS via
 * shadow*, Android via elevation (sombra cinza) + boxShadow colorido na New
 * Architecture quando disponível. Espalhe num `style={{ ...glow.magenta }}`.
 */
export const glow = {
  magenta: {
    shadowColor: "#FF00FF",
    shadowOpacity: 0.55,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  green: {
    shadowColor: "#41FFCA",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  /** Sombra neutra de elevação (cartões sobre o navy). */
  card: {
    shadowColor: "#000000",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;
