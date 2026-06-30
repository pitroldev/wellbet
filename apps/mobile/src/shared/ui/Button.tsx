/**
 * Botão de ação — Midnight Aurora. Pílula de canto redondo, com POP de bet.
 *
 * - `primary`   → pílula com GRADIENTE magenta→roxo→índigo + sheen de vidro no
 *   topo. A assinatura da marca, energética. Entrada em `pop`.
 * - `secondary` → pílula de VIDRO (glass + hairline). Sólida, discreta.
 * - `ghost`     → transparente, rótulo magenta.
 *
 * Sem sombra RN (vira cinza no Android) — a profundidade vem do gradiente + sheen
 * + movimento. Rótulo em Plus Jakarta ExtraBold. Compõe PressableScale (afundar +
 * háptico na UI thread). Suporta ícone (Feather) e estado de carregamento.
 */
import { ActivityIndicator, View } from "react-native";
import Animated from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { pop, useMotionDuration } from "@/shared/motion";
import { arena, durations, gradients } from "@/theme/tokens";

import { PressableScale } from "./PressableScale";
import { Text } from "./Text";

type Tone = "primary" | "secondary" | "ghost";
type FeatherName = keyof typeof Feather.glyphMap;

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  tone?: Tone;
  disabled?: boolean;
  loading?: boolean;
  icon?: FeatherName;
  className?: string;
}

const LABEL = "font-sans-extra text-base tracking-[0.01em]";
const HEIGHT = 58;

export function Button({
  label,
  onPress,
  tone = "primary",
  disabled = false,
  loading = false,
  icon,
  className,
}: ButtonProps) {
  const popDuration = useMotionDuration(durations.base);
  const isDisabled = disabled || loading;

  const content = (
    <View className="flex-row items-center justify-center gap-2.5">
      {loading ? (
        <ActivityIndicator color={tone === "primary" ? arena.white : arena.magenta} />
      ) : (
        <>
          <Text
            className={`${LABEL} ${
              tone === "primary"
                ? "text-white"
                : tone === "secondary"
                  ? "text-foreground"
                  : "text-arena-magenta"
            }`}
          >
            {label}
          </Text>
          {icon != null ? (
            <Feather
              name={icon}
              size={19}
              color={tone === "ghost" ? arena.magenta : arena.white}
            />
          ) : null}
        </>
      )}
    </View>
  );

  if (tone === "primary") {
    return (
      <Animated.View style={pop(popDuration)}>
        <PressableScale onPress={onPress} disabled={isDisabled} className={className}>
          <LinearGradient
            colors={gradients.gymbet}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: HEIGHT,
              borderRadius: 999,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 24,
              overflow: "hidden",
            }}
          >
            {/* sheen de vidro no topo (brilho premium, sem sombra) */}
            <LinearGradient
              colors={gradients.glassSheen}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ position: "absolute", left: 0, right: 0, top: 0, height: HEIGHT * 0.55 }}
            />
            {content}
          </LinearGradient>
        </PressableScale>
      </Animated.View>
    );
  }

  return (
    <PressableScale onPress={onPress} disabled={isDisabled} className={className}>
      <View
        style={{ height: HEIGHT, borderRadius: 999 }}
        className={`items-center justify-center px-6 ${
          tone === "secondary"
            ? "border border-arena-hairline-strong bg-arena-glass-strong"
            : "bg-transparent"
        }`}
      >
        {content}
      </View>
    </PressableScale>
  );
}
