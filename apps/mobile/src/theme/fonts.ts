/**
 * Fontes do app (carregadas em runtime via expo-font / @expo-google-fonts).
 *
 * Direção MIDNIGHT AURORA — três papéis tipográficos:
 *  - DISPLAY: Outfit — geométrica arredondada, confiante, premium (manchete/placar/herói).
 *    Caixa natural (não força CAIXA-ALTA); pesos 600→900.
 *  - UI/TEXTO: Plus Jakarta Sans (corpo, botões, rótulos) — par caloroso da Outfit.
 *  - NÚMEROS/CÓDIGOS: Geist Mono — DNA de bilhete (peso, streak, prêmio, stake, Pix).
 *
 * Cada PESO é uma família própria (o RN não sintetiza peso de forma confiável a
 * partir de um único arquivo). Por isso o componente escolhe a família explícita
 * via classe `font-*` (ver tailwind.config.js) em vez de `font-bold`.
 */
import { GeistMono_400Regular, GeistMono_500Medium, GeistMono_700Bold } from "@expo-google-fonts/geist-mono";
import {
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
} from "@expo-google-fonts/outfit";
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
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_700Bold,
} as const;

/**
 * Nomes de família por PAPEL — para uso imperativo (Skia/inline `style`) onde
 * não há className. Espelha as chaves `fontFamily` do tailwind.config.js.
 */
export const fontFamilies = {
  display: "Outfit_800ExtraBold",
  displayBlack: "Outfit_900Black",
  displayBold: "Outfit_700Bold",
  displaySemibold: "Outfit_600SemiBold",
  sans: "PlusJakartaSans_500Medium",
  sansSemibold: "PlusJakartaSans_600SemiBold",
  sansBold: "PlusJakartaSans_700Bold",
  sansExtra: "PlusJakartaSans_800ExtraBold",
  mono: "GeistMono_400Regular",
  monoMedium: "GeistMono_500Medium",
  monoBold: "GeistMono_700Bold",
} as const;

export type FontFamilyRole = keyof typeof fontFamilies;
