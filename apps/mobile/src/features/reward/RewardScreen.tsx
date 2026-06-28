/**
 * Tela de RECOMPENSA — onde mora a dopamina (§3 Animação/Feel).
 *
 * Combina, na UI thread:
 * - Reanimated 4 (entrada/pop via CSS API) + Skia (glow contínuo) no badge;
 * - Lottie discreto (confete) que se DESMONTA ao terminar;
 * - Rive para o mascote reativo (state-machine);
 * - Haptics de sucesso ao montar (retorno tátil + visual + sonoro).
 *
 * Contraste com a tela de captura, que é deliberadamente SÓBRIA.
 * Respeita reduce-motion em todos os efeitos decorativos.
 */
import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import Rive from "rive-react-native";
import * as Haptics from "expo-haptics";

import { Button, Screen, Text } from "@/shared/ui";
import { useReducedMotion } from "@/shared/motion";

import { Confetti } from "./components/Confetti";
import { RewardBadge } from "./components/RewardBadge";

export interface RewardScreenProps {
  title: string;
  subtitle?: string;
  onContinue?: () => void;
}

export function RewardScreen({ title, subtitle, onContinue }: RewardScreenProps) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const [showConfetti, setShowConfetti] = useState(true);

  // Retorno tátil de sucesso ao chegar na recompensa.
  useEffect(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: tocar som de vitória via expo-audio (feedback sonoro de streak).
  }, []);

  return (
    <Screen animateIn={false} className="flex-1 items-center justify-center px-6">
      {/* Mascote reativo (Rive, state-machine). */}
      <View className="h-40 w-40">
        <Rive
          // TODO: substituir pelo asset real do mascote em assets/rive/.
          resourceName="mascot"
          stateMachineName="reward"
          autoplay={!reduced}
          style={{ flex: 1 }}
        />
      </View>

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
