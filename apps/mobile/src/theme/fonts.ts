/**
 * Fontes da Arena (carregadas em runtime via expo-font / @expo-google-fonts).
 *
 * A direção gymbet-arena pede três papéis tipográficos:
 *  - DISPLAY: Archivo black/extra-bold, caixa-alta itálico nas manchetes.
 *  - UI/TEXTO: Plus Jakarta Sans (corpo, botões, rótulos).
 *  - NÚMEROS: Geist Mono tabular (peso, streak, prêmio — dígitos que não
 *    "dançam" ao animar).
 *
 * Cada PESO é uma família própria (o RN não sintetiza peso de forma confiável a
 * partir de um único arquivo). Por isso o componente `Text`/`Button` escolhe a
 * família explícita via classe `font-*` (ver tailwind.config.js) em vez de
 * combinar uma família única com `font-bold`.
 */
import {
  Archivo_700Bold,
  Archivo_800ExtraBold,
  Archivo_900Black,
  Archivo_900Black_Italic,
} from "@expo-google-fonts/archivo";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_600SemiBold,
} from "@expo-google-fonts/geist-mono";

/**
 * Mapa passado para `useFonts(...)` no layout raiz. As CHAVES são exatamente os
 * nomes de família que o RN/NativeWind referenciam (ver `fontFamilies` e o
 * `fontFamily` do Tailwind). NÃO renomeie sem atualizar os dois.
 */
export const fontMap = {
  Archivo_700Bold,
  Archivo_800ExtraBold,
  Archivo_900Black,
  Archivo_900Black_Italic,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  GeistMono_400Regular,
  GeistMono_500Medium,
  GeistMono_600SemiBold,
} as const;

/**
 * Nomes de família por PAPEL — para uso imperativo (Skia/inline `style`) onde
 * não há className. Espelha as chaves `fontFamily` do tailwind.config.js.
 */
export const fontFamilies = {
  display: "Archivo_900Black",
  displayItalic: "Archivo_900Black_Italic",
  archivo: "Archivo_800ExtraBold",
  sans: "PlusJakartaSans_500Medium",
  sansSemibold: "PlusJakartaSans_600SemiBold",
  sansBold: "PlusJakartaSans_700Bold",
  sansExtra: "PlusJakartaSans_800ExtraBold",
  mono: "GeistMono_500Medium",
  monoBold: "GeistMono_600SemiBold",
} as const;

export type FontFamilyRole = keyof typeof fontFamilies;
