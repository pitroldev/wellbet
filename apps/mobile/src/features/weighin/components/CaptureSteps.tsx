/**
 * Guia do roteiro de captura (MVP §4) exibido de forma sóbria durante a
 * gravação: indica a etapa atual (1..6) sem poluir nem competir com o vídeo.
 */
import { View } from "react-native";

import { Text } from "@/shared/ui";

import { CAPTURE_STEPS, type CaptureStep } from "../model/types";

const STEP_LABEL: Record<CaptureStep, string> = {
  face: "Mostre o rosto de frente",
  challenge: "Mostre o código e faça o gesto",
  scaleZero: "Balança vazia marcando 0,0",
  floor: "Mostre o piso e os 4 pés da balança",
  body: "Suba na balança, mãos à vista, sem apoio",
  display: "Aproxime o visor: número saindo do zero",
};

export interface CaptureStepsProps {
  current: CaptureStep;
}

export function CaptureSteps({ current }: CaptureStepsProps) {
  const index = CAPTURE_STEPS.indexOf(current);

  return (
    <View pointerEvents="none" className="absolute bottom-28 left-0 right-0 items-center px-6">
      <View className="rounded-xl bg-black/55 px-4 py-2">
        <Text variant="caption" className="text-white/70">
          Etapa {index + 1} de {CAPTURE_STEPS.length}
        </Text>
        <Text className="text-center text-white">{STEP_LABEL[current]}</Text>
      </View>
    </View>
  );
}
