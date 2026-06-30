/**
 * Onboarding passo 9 — câmera. Grava o take contínuo da pesagem de partida
 * (reusa CameraCapture + desafio local, como a pesagem final). Em sucesso guarda
 * o vídeo no store de captura e segue pra revisão; erro volta pro guia.
 */
import { useState } from "react";
import { useRouter } from "expo-router";

import { CameraCapture } from "@/features/weighin/camera/CameraCapture";
import { localChallenge } from "@/features/weighin/model/localChallenge";
import { useWeighInStore } from "@/features/weighin/model/store";
import type { Challenge } from "@/features/weighin/model/types";

export default function Capture() {
  const router = useRouter();
  // Reseta o store de captura e gera o desafio local UMA vez (lazy initializer).
  const [challenge] = useState<Challenge>(() => {
    useWeighInStore.getState().reset();
    return localChallenge();
  });

  return (
    <CameraCapture
      challenge={challenge}
      onRecordingFinished={(video) => {
        useWeighInStore.getState().setVideo(video);
        router.replace("/(onboarding)/capture-review");
      }}
      onError={() => router.replace("/(onboarding)/capture-intro")}
    />
  );
}
