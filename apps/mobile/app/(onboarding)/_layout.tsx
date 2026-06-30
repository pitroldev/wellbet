/**
 * Layout do grupo de onboarding — funil LINEAR (welcome → quiz → motivação →
 * medidas → meta → odds → conta → guia de captura → câmera → revisão). Avança
 * deslizando pra frente; cada tela navega pra próxima (não pela home).
 */
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="motivation" />
      <Stack.Screen name="measures" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="odds" />
      <Stack.Screen name="account" />
      <Stack.Screen name="capture-intro" />
      <Stack.Screen name="capture" />
      <Stack.Screen name="capture-review" />
    </Stack>
  );
}
