/**
 * Selo de recompensa animado (Skia + Reanimated 4 na UI thread).
 *
 * Glow/partícula contínuos via Skia (GPU, UI thread) — o lugar certo para
 * efeito contínuo (Orçamento de performance). A escala de entrada vem da CSS
 * Animations API. Respeita reduce-motion (sem o pulso de glow).
 */
import { View } from "react-native";
import { Canvas, Circle, Group, Blur, RadialGradient, vec } from "@shopify/react-native-skia";
import Animated, {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

import { Text } from "@/shared/ui";
import { pop, useMotionDuration, useReducedMotion } from "@/shared/motion";
import { palette, durations } from "@/theme/tokens";

export interface RewardBadgeProps {
  emoji?: string;
  label: string;
  size?: number;
}

export function RewardBadge({ emoji = "🏆", label, size = 220 }: RewardBadgeProps) {
  const reduced = useReducedMotion();
  const popDuration = useMotionDuration(durations.slow);

  // Glow contínuo (raio pulsando) na UI thread, desligado em reduce-motion.
  const glow = useSharedValue(reduced ? 1 : 0);
  useEffect(() => {
    if (reduced) return;
    glow.value = withRepeat(withTiming(1, { duration: 1400 }), -1, true);
  }, [glow, reduced]);

  const radius = useDerivedValue(() => (size / 2) * (0.82 + glow.value * 0.12));

  return (
    <Animated.View style={pop(popDuration)} className="items-center">
      <View style={{ width: size, height: size }}>
        <Canvas style={{ flex: 1 }}>
          <Group>
            <Circle cx={size / 2} cy={size / 2} r={radius}>
              <RadialGradient
                c={vec(size / 2, size / 2)}
                r={size / 2}
                colors={[palette.primary, palette.background]}
              />
              <Blur blur={18} />
            </Circle>
          </Group>
        </Canvas>
        <View className="absolute inset-0 items-center justify-center">
          <Text variant="title" className="text-6xl">
            {emoji}
          </Text>
        </View>
      </View>
      <Text variant="title" className="mt-3 text-center text-3xl">
        {label}
      </Text>
    </Animated.View>
  );
}
