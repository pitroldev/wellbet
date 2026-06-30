/**
 * Selo de recompensa animado (Skia + Reanimated 4 na UI thread).
 *
 * Glow contínuo via Skia (GPU, UI thread) — o lugar certo para efeito contínuo
 * (Orçamento de performance). A escala de entrada vem da CSS Animations API.
 * Respeita reduce-motion (sem o pulso de glow). Ícone Feather (sem emoji).
 */
import { useEffect } from "react";
import { View } from "react-native";
import { Blur, Canvas, Circle, Group, RadialGradient, vec } from "@shopify/react-native-skia";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Text } from "@/shared/ui";
import { pop, useMotionDuration, useReducedMotion } from "@/shared/motion";
import { arena, palette, durations } from "@/theme/tokens";

type FeatherName = keyof typeof Feather.glyphMap;

export interface RewardBadgeProps {
  icon?: FeatherName;
  label: string;
  size?: number;
}

export function RewardBadge({ icon = "award", label, size = 220 }: RewardBadgeProps) {
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
                colors={[palette.primary, "rgba(14,11,32,0)"]}
              />
              <Blur blur={18} />
            </Circle>
          </Group>
        </Canvas>
        <View className="absolute inset-0 items-center justify-center">
          <View
            className="items-center justify-center rounded-full border border-arena-hairline-strong bg-arena-glass-strong"
            style={{ width: size * 0.42, height: size * 0.42 }}
          >
            <Feather name={icon} size={size * 0.2} color={arena.white} />
          </View>
        </View>
      </View>
      <Text variant="title" className="mt-3 text-center text-3xl">
        {label}
      </Text>
    </Animated.View>
  );
}
