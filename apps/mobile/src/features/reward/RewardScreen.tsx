/**
 * Tela de RECOMPENSA — onde mora a dopamina (§3 Animação/Feel).
 *
 * Combina, na UI thread:
 * - Reanimated 4 (entrada/pop via CSS API) + Skia (glow contínuo) no badge;
 * - confete em Skia que se DESMONTA ao terminar;
 * - Haptics + som de vitória (expo-audio) ao montar (tátil + visual + sonoro).
 *
 * Contraste com a tela de captura, que é deliberadamente SÓBRIA.
 * Respeita reduce-motion em todos os efeitos decorativos.
 */
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";

import { Button, Screen, Text } from "@/shared/ui";

import { Confetti } from "./components/Confetti";
import { RewardBadge } from "./components/RewardBadge";

// Som de vitória (asset real em assets/audio/). Carregado uma vez pelo player.
const WIN_SOUND = require("../../../assets/audio/win.wav");

export interface RewardScreenProps {
  title: string;
  subtitle?: string;
  onContinue?: () => void;
}

export function RewardScreen({ title, subtitle, onContinue }: RewardScreenProps) {
  const { t } = useTranslation();
  const [showConfetti, setShowConfetti] = useState(true);
  const winSound = useAudioPlayer(WIN_SOUND);

  // Retorno tátil + sonoro de sucesso ao chegar na recompensa.
  useEffect(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    winSound.seekTo(0);
    winSound.play();
  }, [winSound]);

  return (
    <Screen animateIn={false} className="flex-1 items-center justify-center px-6">
      <RewardBadge label={title} />

      {subtitle != null ? (
        <Text variant="body" className="mt-3 text-center text-muted">
          {subtitle}
        </Text>
      ) : null}

      <View className="mt-10 w-full">
        <Button label={t("common.continue")} onPress={onContinue} />
      </View>

      {/* Confete decorativo que se desmonta ao terminar. */}
      {showConfetti ? <Confetti onFinish={() => setShowConfetti(false)} /> : null}
    </Screen>
  );
}
