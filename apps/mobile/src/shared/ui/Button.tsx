/**
 * Botão de ação — SPORTSBOOK BRUTAL.
 *
 * - `primary`   → BLOCO chapado de magenta, texto ink (sem gradiente/glow). A
 *   assinatura da marca, agora flat.
 * - `secondary` → fio duro 2px sobre surface navy.
 * - `ghost`     → transparente, rótulo magenta.
 *
 * Canto vivo (sem rounded). Rótulo em Space Mono caixa-alta (DNA de bilhete).
 * Compõe PressableScale (feel/háptico na UI thread) + Text.
 */
import { View } from "react-native";

import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

type Tone = "primary" | "secondary" | "ghost";

const boxTone: Record<Tone, string> = {
  primary: "bg-arena-magenta",
  secondary: "border-2 border-border bg-arena-navy-soft",
  ghost: "bg-transparent",
};

const labelTone: Record<Tone, string> = {
  primary: "text-on-primary",
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
  return (
    <PressableScale onPress={onPress} disabled={disabled} className={className}>
      <View className={`h-14 items-center justify-center px-6 ${boxTone[tone]}`}>
        <Text className={`font-mono-bold text-sm uppercase tracking-[0.08em] ${labelTone[tone]}`}>
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}
