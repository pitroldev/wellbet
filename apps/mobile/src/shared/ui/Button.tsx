/**
 * Botão de ação — direção GymBet Arena.
 *
 * - `primary`   → gradiente magenta→roxo→indigo (expo-linear-gradient) + glow
 *   magenta. A assinatura da marca.
 * - `secondary` → cartão navy com borda (navyLine).
 * - `ghost`     → transparente, rótulo magenta.
 *
 * Compõe PressableScale (feel/háptico na UI thread) + Text. Rótulo em
 * caixa-alta, Jakarta extrabold. Estilo estático via NativeWind; gradiente e
 * glow via props/estilo nativo (não há gradiente CSS no RN).
 */
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { gradients, glow } from "@/theme/tokens";

import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

type Tone = "primary" | "secondary" | "ghost";

const labelTone: Record<Tone, string> = {
  primary: "text-white",
  secondary: "text-foreground",
  ghost: "text-arena-magenta",
};

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  tone?: Tone;
  disabled?: boolean;
  className?: string;
}

export function Button({
  label,
  onPress,
  tone = "primary",
  disabled = false,
  className,
}: ButtonProps) {
  const labelEl = (
    <Text className={`font-sans-extra text-base uppercase tracking-[0.04em] ${labelTone[tone]}`}>
      {label}
    </Text>
  );

  if (tone === "primary") {
    return (
      <PressableScale onPress={onPress} disabled={disabled} className={className}>
        {/* Host da sombra (não recortado) → recorte do gradiente por dentro. */}
        <View className="rounded-2xl" style={glow.magenta}>
          <View className="overflow-hidden rounded-2xl">
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
              {labelEl}
            </LinearGradient>
          </View>
        </View>
      </PressableScale>
    );
  }

  const boxClass =
    tone === "secondary" ? "border border-border bg-arena-navy-soft" : "bg-transparent";

  return (
    <PressableScale onPress={onPress} disabled={disabled} className={className}>
      <View className={`h-14 items-center justify-center rounded-2xl px-6 ${boxClass}`}>
        {labelEl}
      </View>
    </PressableScale>
  );
}
