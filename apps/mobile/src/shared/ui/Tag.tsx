/**
 * Tag de bilhete — chip RETANGULAR chapado, texto Space Mono. É o "eyebrow"
 * brutal (bloco em vez de texto magenta, que reprovaria contraste sobre claro).
 * `tone="ink"` inverte (bloco escuro + texto magenta).
 */
import { View } from "react-native";

import { Text } from "./Text";

type Tone = "magenta" | "green" | "ink";

const bgTone: Record<Tone, string> = {
  magenta: "bg-arena-magenta",
  green: "bg-arena-green",
  ink: "bg-arena-ink",
};

const fgTone: Record<Tone, string> = {
  magenta: "text-arena-ink",
  green: "text-arena-ink",
  ink: "text-arena-magenta",
};

export interface TagProps {
  label: string;
  tone?: Tone;
  className?: string;
}

export function Tag({ label, tone = "magenta", className }: TagProps) {
  return (
    <View className={`self-start px-2.5 py-1 ${bgTone[tone]}${className ? ` ${className}` : ""}`}>
      <Text className={`font-mono-bold text-[11px] uppercase tracking-[0.18em] ${fgTone[tone]}`}>
        {label}
      </Text>
    </View>
  );
}
