/**
 * Botão de ação primário/secundário. Compõe PressableScale (feel) + Text.
 * Estilo estático via NativeWind; movimento via Reanimated dentro do
 * PressableScale.
 */
import { View } from "react-native";

import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

type Tone = "primary" | "secondary" | "ghost";

const toneClass: Record<Tone, string> = {
  primary: "bg-primary-600",
  secondary: "bg-surface border border-border",
  ghost: "bg-transparent",
};

const toneText: Record<Tone, string> = {
  primary: "text-on-primary",
  secondary: "text-foreground",
  ghost: "text-primary-400",
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
  return (
    <PressableScale onPress={onPress} disabled={disabled} className={className}>
      <View className={`h-14 items-center justify-center rounded-2xl px-6 ${toneClass[tone]}`}>
        <Text className={`text-base font-semibold ${toneText[tone]}`}>{label}</Text>
      </View>
    </PressableScale>
  );
}
