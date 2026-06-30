/**
 * Chip selecionável — pílula de escolha (duração da aposta, idioma, opção). Vidro
 * quando ocioso; wash magenta + borda viva + texto magenta quando selecionado.
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
          backgroundColor: selected ? arenaAlpha.magentaWash : arenaAlpha.glass,
          borderColor: selected ? arena.magenta : arena.navyLine,
        }}
        className="flex-row items-center gap-2 rounded-full border px-4 py-2.5"
      >
        {icon != null ? (
          <Feather name={icon} size={16} color={selected ? arena.magenta : arena.fogMute} />
        ) : null}
        <Text
          className={`font-sans-bold text-sm ${selected ? "text-arena-magenta" : "text-muted"}`}
        >
          {label}
        </Text>
      </View>
    </PressableScale>
  );
}
