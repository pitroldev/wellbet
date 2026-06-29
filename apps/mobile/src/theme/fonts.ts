/**
 * Fontes do app (carregadas em runtime via expo-font / @expo-google-fonts).
 *
 * Direção SPORTSBOOK BRUTAL (igual à landing), três papéis tipográficos:
 *  - DISPLAY: Anton — condensada pesadíssima, CAIXA-ALTA (cartaz/placar). Sem itálico.
 *  - UI/TEXTO: Plus Jakarta Sans (corpo, botões, rótulos).
 *  - NÚMEROS/CÓDIGOS: Space Mono (peso, streak, prêmio, stake — DNA de bilhete).
 *
 * Cada PESO é uma família própria (o RN não sintetiza peso de forma confiável a
 * partir de um único arquivo). Por isso o componente escolhe a família explícita
 * via classe `font-*` (ver tailwind.config.js) em vez de `font-bold`.
 */
import { Anton_400Regular } from "@expo-google-fonts/anton";
import { SpaceMono_400Regular, SpaceMono_700Bold } from "@expo-google-fonts/space-mono";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";

/**
 * Mapa passado para `useFonts(...)` no layout raiz. As CHAVES são exatamente os
 * nomes de família que o RN/NativeWind referenciam (ver `fontFamilies` e o
 * `fontFamily` do Tailwind). NÃO renomeie sem atualizar os dois.
 */
export const fontMap = {
  Anton_400Regular,
  SpaceMono_400Regular,
  SpaceMono_700Bold,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} as const;

/**
 * Nomes de família por PAPEL — para uso imperativo (Skia/inline `style`) onde
 * não há className. Espelha as chaves `fontFamily` do tailwind.config.js.
 */
export const fontFamilies = {
  display: "Anton_400Regular",
  sans: "PlusJakartaSans_500Medium",
  sansSemibold: "PlusJakartaSans_600SemiBold",
  sansBold: "PlusJakartaSans_700Bold",
  sansExtra: "PlusJakartaSans_800ExtraBold",
  mono: "SpaceMono_400Regular",
  monoBold: "SpaceMono_700Bold",
} as const;

export type FontFamilyRole = keyof typeof fontFamilies;
