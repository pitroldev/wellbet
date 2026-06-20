/**
 * Paleta da marca Charya.
 *
 * REGRA DO DOSSIÊ (identidade visual): "pessoas reais, limpo, sem vibe de
 * aposta barata". A Charya é sobre emagrecer de verdade com dinheiro real em
 * jogo — confiança e clareza valem mais que espetáculo. Por isso esta paleta:
 *
 *  - EVITA neon ácido, gradientes "cassino", dourado de fliperama e vermelho/
 *    verde berrante de plataforma de aposta barata.
 *  - Usa tons SÓBRIOS e terrosos/naturais (verde-eucalipto, areia, grafite),
 *    legíveis e calmos, que combinam com fotos/vídeos de pessoas reais.
 *  - A "dopamina" (streak, meta, recompensa) vem da ANIMAÇÃO (ver motion.ts),
 *    não de cor estridente. A cor sustenta confiança; o movimento recompensa.
 *
 * Cada matiz tem escala 50→950 (padrão Tailwind) para funcionar tanto no
 * Tailwind v4 do admin quanto no NativeWind do mobile.
 */

/** Uma escala de cor completa (chaves numéricas estilo Tailwind). */
export interface ColorScale {
  readonly 50: string;
  readonly 100: string;
  readonly 200: string;
  readonly 300: string;
  readonly 400: string;
  readonly 500: string;
  readonly 600: string;
  readonly 700: string;
  readonly 800: string;
  readonly 900: string;
  readonly 950: string;
}

/**
 * Neutros quentes (grafite levemente amornado, não cinza-clínico).
 * Base de texto, superfícies e bordas — o "limpo" do dossiê mora aqui.
 */
const neutral: ColorScale = {
  50: "#faf9f7",
  100: "#f3f1ed",
  200: "#e7e3db",
  300: "#d3ccc0",
  400: "#a9a094",
  500: "#7d7568",
  600: "#5f584d",
  700: "#4a443b",
  800: "#322e28",
  900: "#1f1c18",
  950: "#121009",
};

/**
 * Verde-eucalipto: cor primária da marca. Natural, sóbrio e associado a
 * saúde/progresso real — deliberadamente longe do "verde de mesa de aposta".
 */
const brand: ColorScale = {
  50: "#f0f7f4",
  100: "#dbece4",
  200: "#b9d9cb",
  300: "#8cbfa9",
  400: "#5c9f84",
  500: "#3d8268",
  600: "#2d6852",
  700: "#265344",
  800: "#214338",
  900: "#1d3830",
  950: "#0e1f1a",
};

/**
 * Areia/âmbar: acento secundário e quente (CTAs de destaque, conquista).
 * Um dourado APAGADO e terroso — NÃO o dourado metálico de cassino.
 */
const accent: ColorScale = {
  50: "#fbf7ef",
  100: "#f5ebd6",
  200: "#ead4ac",
  300: "#ddb777",
  400: "#d29c4f",
  500: "#c5853a",
  600: "#a96a2f",
  700: "#8a4f2a",
  800: "#714028",
  900: "#5f3624",
  950: "#361b10",
};

/** Sucesso — alinhado ao veredito `APROVADO` (§7 da validação de peso). */
const success: ColorScale = {
  50: "#eff8f0",
  100: "#d8eeda",
  200: "#b3ddb8",
  300: "#83c48c",
  400: "#52a55f",
  500: "#358a42",
  600: "#266e34",
  700: "#20582c",
  800: "#1d4726",
  900: "#193b21",
  950: "#0a210f",
};

/** Atenção — alinhado ao veredito `PENDENTE` (recaptura orientada, §7). */
const warning: ColorScale = {
  50: "#fdf8ec",
  100: "#faedcb",
  200: "#f4d893",
  300: "#edbd5b",
  400: "#e6a234",
  500: "#d9851f",
  600: "#bb6317",
  700: "#9b4717",
  800: "#7f3819",
  900: "#6a2f18",
  950: "#3d1709",
};

/** Erro — alinhado ao veredito `REPROVADO` / bloqueio da regra dura (§6, §7). */
const danger: ColorScale = {
  50: "#fdf3f2",
  100: "#fbe2df",
  200: "#f7c9c4",
  300: "#efa49c",
  400: "#e37265",
  500: "#d24c3e",
  600: "#bd3527",
  700: "#9e2a1f",
  800: "#83271e",
  900: "#6e2520",
  950: "#3b0e0a",
};

export const colors = {
  /** Texto/superfície neutra quente. */
  neutral,
  /** Cor primária da marca (verde-eucalipto). */
  brand,
  /** Acento secundário (areia/âmbar terroso). */
  accent,
  /** Semânticos de veredito/estado (ver Charya_Validacao_Peso_MVP.md §7). */
  success,
  warning,
  danger,
} as const;

export type Colors = typeof colors;
export type ColorName = keyof Colors;
