/**
 * Guia do roteiro de captura (MVP §4) exibido de forma sóbria durante a
 * gravação: indica a etapa atual (1..6) sem poluir nem competir com o vídeo.
 */
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Text } from "@/shared/ui";

import { CAPTURE_STEPS, type CaptureStep } from "../model/types";

export interface CaptureStepsProps {
  current: CaptureStep;
}

export function CaptureSteps({ current }: CaptureStepsProps) {
  const { t } = useTranslation();
  const index = CAPTURE_STEPS.indexOf(current);

  return (
    <View pointerEvents="none" className="absolute bottom-28 left-0 right-0 items-center px-6">
      <View className="rounded-xl bg-black/55 px-4 py-2">
        <Text variant="caption" className="text-white/70">
          {t("weighin.steps.progress", { current: index + 1, total: CAPTURE_STEPS.length })}
        </Text>
        <Text className="text-center text-white">{t(`weighin.steps.${current}`)}</Text>
      </View>
    </View>
  );
}
