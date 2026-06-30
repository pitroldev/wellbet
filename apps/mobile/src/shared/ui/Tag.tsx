/**
 * Tag/eyebrow — pílula de VIDRO com um ponto de luz da cor do tom. Substitui o
 * bloco chapado brutal por algo premium e arredondado. Texto Geist Mono caixa-alta.
 *  - `magenta` (padrão) · `green` · `ink` (neutro).
 */
import { View } from "react-native";

import { arena, arenaAlpha } from "@/theme/tokens";

import { Text } from "./Text";

type Tone = "magenta" | "green" | "ink";

const toneBg: Record<Tone, string> = {
  magenta: arenaAlpha.orchidWash,
  green: arenaAlpha.greenWash,
  ink: arenaAlpha.glass,
};

const toneDot: Record<Tone, string> = {
  magenta: arena.magenta,
  green: arena.green,
  ink: arena.fog,
};

const toneText: Record<Tone, string> = {
  magenta: "text-arena-magenta",
  green: "text-arena-mint",
  ink: "text-muted",
};

export interface TagProps {
  label: string;
  tone?: Tone;
  /** Alinhamento no eixo cruzado. "center" centraliza (eyebrow de tela-herói). */
  align?: "start" | "center";
  className?: string;
}

export function Tag({ label, tone = "magenta", align = "start", className }: TagProps) {
  return (
    <View
      style={{ backgroundColor: toneBg[tone] }}
      className={`flex-row items-center gap-2 ${
        align === "center" ? "self-center" : "self-start"
      } rounded-full border border-arena-hairline px-3 py-1.5${className ? ` ${className}` : ""}`}
    >
      <View style={{ backgroundColor: toneDot[tone] }} className="h-1.5 w-1.5 rounded-full" />
      <Text className={`font-mono-medium text-[11px] uppercase tracking-[0.16em] ${toneText[tone]}`}>
        {label}
      </Text>
    </View>
  );
}
