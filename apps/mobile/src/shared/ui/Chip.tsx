/**
 * Chip selecionável — pílula de escolha (duração da aposta, idioma, opção). Vidro
 * quando ocioso; wash violeta + borda viva + texto violeta-claro quando selecionado.
 * Compõe PressableScale (afundar + háptico). Ícone Feather opcional.
 */
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { arena, arenaAlpha } from "@/theme/tokens";

import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

type FeatherName = keyof typeof Feather.glyphMap;

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: FeatherName;
  className?: string;
}

export function Chip({ label, selected = false, onPress, icon, className }: ChipProps) {
  return (
    <PressableScale onPress={onPress} className={className}>
      <View
        style={{
          backgroundColor: selected ? arenaAlpha.violetWash : arenaAlpha.glass,
          borderColor: selected ? arena.violet : arena.line,
        }}
        className="flex-row items-center gap-2 rounded-full border px-4 py-2.5"
      >
        {icon != null ? (
          <Feather name={icon} size={16} color={selected ? arena.violetSoft : arena.fogMute} />
        ) : null}
        <Text
          className={`font-sans-bold text-sm ${selected ? "text-arena-violet-soft" : "text-muted"}`}
        >
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}
