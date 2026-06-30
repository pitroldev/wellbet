import { Stack } from "expo-router";

export default function BetLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="new" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="pay" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="result" options={{ animation: "fade", gestureEnabled: false }} />
    </Stack>
  );
}
