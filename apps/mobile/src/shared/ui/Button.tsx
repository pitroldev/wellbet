/**
 * Botão de ação — agora com POP de bet.
 *
 * - `primary`   → bloco com GRADIENTE magenta→roxo→indigo + GLOW magenta (sombra
 *   colorida). A assinatura da marca, energética.
 * - `secondary` → fio magenta 2px sobre surface navy.
 * - `ghost`     → transparente, rótulo magenta.
 *
 * Canto vivo. Rótulo em Space Mono caixa-alta (DNA de bilhete). Compõe
 * PressableScale (afundar + háptico na UI thread).
 */
import { View } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { pop, useMotionDuration } from "@/shared/motion";
import { durations, gradients } from "@/theme/tokens";

import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

type Tone = "primary" | "secondary" | "ghost";

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  tone?: Tone;
  disabled?: boolean;
  className?: string;
}

const LABEL = "font-mono-bold text-sm uppercase tracking-[0.1em]";

export function Button({ label, onPress, tone = "primary", disabled = false, className }: ButtonProps) {
  const popDuration = useMotionDuration(durations.base);

  if (tone === "primary") {
    return (
      <Animated.View style={pop(popDuration)}>
        <PressableScale onPress={onPress} disabled={disabled} className={className}>
          <LinearGradient
            colors={gradients.gymbet}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 56,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 24,
            }}
          >
            <Text className={`${LABEL} text-white`}>{label}</Text>
          </LinearGradient>
        </PressableScale>
      </Animated.View>
    );
  }

  return (
    <PressableScale onPress={onPress} disabled={disabled} className={className}>
      <View
        className={`h-14 items-center justify-center px-6 ${
          tone === "secondary" ? "border-2 border-arena-magenta bg-arena-navy-soft" : "bg-transparent"
        }`}
      >
        <Text className={`${LABEL} ${tone === "secondary" ? "text-foreground" : "text-arena-magenta"}`}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}
