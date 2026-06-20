/**
 * @charya/ui-tokens — design tokens compartilhados da Charya.
 *
 * Fonte única da verdade de cor, espaço, tipografia e motion, consumida pelo
 * admin (Tailwind v4) e pelo mobile (NativeWind). Importe tokens tipados daqui
 * (`@charya/ui-tokens`) para lógica/inline; importe o preset Tailwind de
 * `@charya/ui-tokens/tailwind` para a config de tema dos dois apps.
 *
 * Identidade visual (dossiê): "pessoas reais, limpo, sem vibe de aposta barata".
 * A cor sustenta confiança (sóbria, terrosa); o MOVIMENTO recompensa (snappy).
 * Detalhe de cada decisão vive nos arquivos por domínio.
 */

export { colors } from "./colors.js";
export type { Colors, ColorName, ColorScale } from "./colors.js";

export { spacing, radii } from "./spacing.js";
export type { Spacing, SpacingToken, Radii, RadiusToken } from "./spacing.js";

export { typography, fontFamily, fontSize, fontWeight, letterSpacing } from "./typography.js";
export type {
  Typography,
  FontFamily,
  FontFamilyToken,
  FontSize,
  FontSizeToken,
  FontWeight,
  FontWeightToken,
  LetterSpacing,
  LetterSpacingToken,
} from "./typography.js";

export { motion, durations, durationsMs, easing, springs } from "./motion.js";
export type {
  Motion,
  Durations,
  DurationsMs,
  DurationToken,
  Easing,
  EasingToken,
  Springs,
  SpringToken,
  SpringConfig,
} from "./motion.js";

import { colors } from "./colors.js";
import { spacing, radii } from "./spacing.js";
import { typography } from "./typography.js";
import { motion } from "./motion.js";

/**
 * Objeto agregado com todos os tokens, tipado e `readonly`.
 * Útil para consumo programático (ex.: theme provider) sem importar 4 módulos.
 */
export const tokens = {
  colors,
  spacing,
  radii,
  typography,
  motion,
} as const;

export type Tokens = typeof tokens;
