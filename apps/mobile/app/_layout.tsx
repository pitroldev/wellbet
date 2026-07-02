/**
 * Layout raiz do expo-router.
 *
 * Providers globais, na ordem correta:
 * - GestureHandlerRootView (precisa envolver tudo para gestos/Reanimated).
 * - SafeAreaProvider (insets).
 * - I18nextProvider (i18n pt/en — instância inicializada no import de @/shared/i18n).
 * - QueryClientProvider (TanStack Query — estado de servidor).
 *
 * Tipografia da marca: as fontes (Outfit/Plus Jakarta/Geist Mono) são
 * carregadas em runtime com `useFonts`; seguramos o render num fundo escuro até
 * carregarem para evitar flash da fonte do sistema.
 *
 * `ReducedMotionConfig` no nível raiz respeita a preferência do sistema para
 * todas as animações declarativas (acessibilidade, §3).
 *
 * Importa `global.css` para ativar o NativeWind (estilo estático).
 */
import "../global.css";

import { useEffect } from "react";
import { View } from "react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { I18nextProvider } from "react-i18next";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ReducedMotionConfig, ReduceMotion } from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import i18n from "@/shared/i18n";
import { queryClient } from "@/shared/lib/query-client";
import { setupApiClient } from "@/shared/lib/http";
import { tokenStore } from "@/shared/lib/secure-store";
import { useJourney } from "@/features/journey";
import { arena } from "@/theme/arena";
import { fontMap } from "@/theme/fonts";

// Configura o cliente de API (base URL + injeção de token) uma vez no boot.
setupApiClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontMap);

  // Reconcilia a sessão no boot: se o app acha que tem conta mas o token sumiu
  // (expirou ou foi limpo num 401), volta pro estado deslogado.
  useEffect(() => {
    void (async () => {
      const token = await tokenStore.getAccessToken();
      const journey = useJourney.getState();
      if (journey.hasAccount && token == null) journey.setHasAccount(false);
    })();
  }, []);

  // Gate curto: espera as fontes (ou um erro de carga) antes do primeiro render
  // para não piscar do system font para Outfit/Jakarta. Fundo ink = sem flash.
  if (!fontsLoaded && fontError == null) {
    return <View style={{ flex: 1, backgroundColor: arena.ink }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: arena.ink }}>
      <SafeAreaProvider>
        <I18nextProvider i18n={i18n}>
          <QueryClientProvider client={queryClient}>
            {/* Respeita a preferência de reduzir movimento do sistema. */}
            <ReducedMotionConfig mode={ReduceMotion.System} />
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: { backgroundColor: arena.ink },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="bet" />
              <Stack.Screen name="weighin" />
            </Stack>
          </QueryClientProvider>
        </I18nextProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
