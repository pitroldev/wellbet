/**
 * Layout do grupo de onboarding. Transições entre telas via
 * react-native-screen-transitions (Shared Element Transitions do Reanimated
 * seguem experimentais atrás de flag — §3).
 */
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // TODO: aplicar presets de react-native-screen-transitions aqui quando
        // o pacote estiver instalado (transição custom entre passos).
        animation: "fade",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="capture-guide" />
    </Stack>
  );
}
