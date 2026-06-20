/**
 * Captura de vídeo da pesagem — react-native-vision-camera v5 (Nitro).
 *
 * Garantias do MVP (Validação de Peso §2/§4 + Arquitetura §3):
 * - Gravação CONTÍNUA, sem corte: um único take. Não há pausa/retomada; parar
 *   encerra o take. Cortes reprovam na revisão.
 * - Overlay do CÓDIGO DINÂMICO ao vivo sobre a câmera (C2 / anti-replay).
 * - BLOQUEIO de upload de galeria: esta tela só grava internamente; não há
 *   import de mídia externa em lugar nenhum do fluxo (C1).
 * - O upload direto p/ R2 com retry é feito FORA daqui (hook useUploadVideo),
 *   mas expomos o callback `onRecordingFinished` com o arquivo local.
 *
 * SOBRIEDADE (Orçamento de performance): a câmera já consome CPU/GPU/memória;
 * esta tela é enxuta — nada de Lottie/Skia full-screen aqui. A dopamina mora
 * nas telas de resultado/recompensa.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
  Camera,
  CommonResolutions,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
  useVideoOutput,
} from "react-native-vision-camera";
import type { CameraRef, Recorder } from "react-native-vision-camera";

import { Button, Screen, Text } from "@/shared/ui";

import { CaptureSteps } from "../components/CaptureSteps";
import { DynamicCodeOverlay } from "../components/DynamicCodeOverlay";
import { selectCurrentStep, useWeighInStore } from "../model/store";
import type { Challenge, RecordedVideo } from "../model/types";

export interface CameraCaptureProps {
  challenge: Challenge;
  onRecordingFinished: (video: RecordedVideo) => void;
  onError: (message: string) => void;
}

export function CameraCapture({ challenge, onRecordingFinished, onError }: CameraCaptureProps) {
  const cameraRef = useRef<CameraRef>(null);
  // Recorder ativo do take corrente (vision-camera v5 grava via Recorder, não
  // mais via `camera.startRecording`). Mantemos em ref para o stop alcançá-lo.
  const recorderRef = useRef<Recorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const { hasPermission: hasMic, requestPermission: requestMic } = useMicrophonePermission();

  // v5: o vídeo agora é um OUTPUT da câmera (Nitro). Áudio é habilitado aqui,
  // não mais via prop `audio` no <Camera>. Gravação contínua => take único.
  const videoOutput = useVideoOutput({
    enableAudio: true,
    targetResolution: CommonResolutions.FHD_16_9,
  });

  const currentStep = useWeighInStore(selectCurrentStep);
  const setPhase = useWeighInStore((s) => s.setPhase);

  // Pede permissões ao montar. Sem galeria envolvida: só câmera + microfone.
  useEffect(() => {
    if (!hasPermission) void requestPermission();
    if (!hasMic) void requestMic();
  }, [hasPermission, hasMic, requestPermission, requestMic]);

  const startRecording = useCallback(() => {
    if (isRecording || recorderRef.current != null) return;

    setIsRecording(true);
    setPhase("recording");

    // Gravação contínua: um único take. O Recorder grava uma vez só; parar
    // encerra o take. Sem segmentação/pausa.
    // TODO: fixar codec/qualidade via setOutputSettings para tamanho
    // previsível; manter HEVC (h265) quando suportado.
    void videoOutput
      .createRecorder({})
      .then((recorder) => {
        recorderRef.current = recorder;
        return recorder.startRecording(
          (filePath: string) => {
            // `recordedDuration` é lido antes do stop (abaixo); aqui só
            // entregamos o arquivo já finalizado. duration vem em segundos.
            const durationMs = Math.round(recorder.recordedDuration * 1000);
            recorderRef.current = null;
            setIsRecording(false);
            onRecordingFinished({ uri: filePath, durationMs });
          },
          (error: Error) => {
            recorderRef.current = null;
            setIsRecording(false);
            onError(error.message);
          },
        );
      })
      .catch((error: unknown) => {
        recorderRef.current = null;
        setIsRecording(false);
        onError(error instanceof Error ? error.message : String(error));
      });
  }, [isRecording, onError, onRecordingFinished, setPhase, videoOutput]);

  const stopRecording = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder == null || !isRecording) return;
    // Encerra o take. O resultado chega no onRecordingFinished acima.
    void recorder.stopRecording();
  }, [isRecording]);

  if (!hasPermission || !hasMic) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-4">
          <Text variant="heading">Precisamos da câmera e do microfone</Text>
          <Text variant="caption" className="text-center">
            A pesagem é gravada dentro do app. Não é possível enviar vídeo da galeria.
          </Text>
          <Button
            label="Conceder acesso"
            onPress={() => {
              void requestPermission();
              void requestMic();
            }}
          />
        </View>
      </Screen>
    );
  }

  if (device == null) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <Text variant="heading">Câmera indisponível</Text>
        </View>
      </Screen>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        device={device}
        isActive
        // v5: vídeo+áudio vêm do output; nada de props `video`/`audio` aqui.
        outputs={[videoOutput]}
        // Sem frame processor pesado durante a gravação (sobriedade).
      />

      {/* Overlays sóbrios sobre a câmera. */}
      <DynamicCodeOverlay challenge={challenge} />
      <CaptureSteps current={currentStep} />

      <View className="absolute bottom-10 left-0 right-0 items-center px-6">
        {isRecording ? (
          <Button label="Encerrar gravação" tone="secondary" onPress={stopRecording} />
        ) : (
          <Button label="Iniciar gravação" onPress={startRecording} />
        )}
      </View>
    </View>
  );
}
