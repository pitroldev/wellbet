/**
 * Layout do fluxo de pesagem. A tela de captura é apresentada em modal/sem
 * gesto de dismiss acidental durante a gravação.
 */
import { Stack } from "expo-router";

export default function WeighInLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="result" options={{ animation: "fade", gestureEnabled: false }} />
    </Stack>
  );
}
