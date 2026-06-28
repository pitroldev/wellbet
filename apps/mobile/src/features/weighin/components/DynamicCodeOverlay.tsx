/**
 * Overlay do código dinâmico exibido AO VIVO sobre a câmera (C2 do MVP).
 *
 * Mostra palavra + número + gesto pedido. É o anti-replay: o revisor confere
 * que o código no vídeo bate com o emitido para a sessão (nonce) e que o gesto
 * foi feito (MVP §4/§5).
 *
 * SOBRIEDADE: esta é a tela de captura — sem animação custosa competindo com o
 * vídeo (Orçamento de performance). Só um pulso CSS discreto para chamar
 * atenção ao código, respeitando reduce-motion.
 */
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { Text } from "@/shared/ui";
import { pulse, useMotionDuration } from "@/shared/motion";
import { durations } from "@/theme/tokens";

import type { Challenge } from "../model/types";

/** Chaves i18n dos gestos da api (challenge.gesture é string no contrato). */
const GESTURE_KEYS = {
  thumbs_up: "weighin.code.gestures.thumbs_up",
  open_palm: "weighin.code.gestures.open_palm",
  peace_sign: "weighin.code.gestures.peace_sign",
  wave: "weighin.code.gestures.wave",
  point_up: "weighin.code.gestures.point_up",
} as const;

export interface DynamicCodeOverlayProps {
  challenge: Challenge;
}

export function DynamicCodeOverlay({ challenge }: DynamicCodeOverlayProps) {
  const { t } = useTranslation();
  const pulseDuration = useMotionDuration(durations.slow);

  const gKey = GESTURE_KEYS[challenge.gesture as keyof typeof GESTURE_KEYS];
  const gestureLabel = gKey ? t(gKey) : challenge.gesture;

  return (
    <View pointerEvents="none" className="absolute left-0 right-0 top-0 items-center pt-16">
      <Animated.View
        className="items-center rounded-2xl bg-black/55 px-5 py-3"
        style={pulseDuration > 0 ? pulse(pulseDuration) : undefined}
      >
        <Text variant="caption" className="text-white/70">
          {t("weighin.code.prompt")}
        </Text>
        <Text variant="mono" className="mt-1 text-white">
          {challenge.word} · {challenge.code}
        </Text>
        <Text variant="caption" className="mt-1 text-white">
          {t("weighin.code.gesture", { gesture: gestureLabel })}
        </Text>
      </Animated.View>
    </View>
  );
}
