/**
 * Layout raiz do expo-router.
 *
 * Providers globais, na ordem correta:
 * - GestureHandlerRootView (precisa envolver tudo para gestos/Reanimated).
 * - SafeAreaProvider (insets).
 * - QueryClientProvider (TanStack Query — estado de servidor).
 *
 * `ReducedMotionConfig` no nível raiz respeita a preferência do sistema para
 * todas as animações declarativas (acessibilidade, §3).
 *
 * Importa `global.css` para ativar o NativeWind (estilo estático).
 */
import "../global.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ReducedMotionConfig, ReduceMotion } from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { queryClient } from "@/shared/lib/query-client";
import { setupApiClient } from "@/shared/lib/http";

// Configura o cliente de API (base URL + injeção de token) uma vez no boot.
setupApiClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          {/* Respeita a preferência de reduzir movimento do sistema. */}
          <ReducedMotionConfig mode={ReduceMotion.System} />
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="weighin" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
