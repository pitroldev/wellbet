/**
 * Tela de captura da pesagem.
 *
 * Orquestra: iniciar sessão (gera código dinâmico + URL pré-assinada R2) →
 * gravar take contínuo → enviar direto ao R2 com retry → registrar a pesagem
 * (backend aplica a regra dura de sanidade e enfileira a revisão humana).
 *
 * SÓBRIA por design (Orçamento de performance): nada de dopamina aqui.
 *
 * O payload é VALIDADO com o schema Zod compartilhado (`CapturePayload`) antes
 * de enviar (§3 "Schemas Zod compartilhados validam ... payload antes de
 * enviar").
 */
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { useRouter } from "expo-router";
import { CapturePayload } from "@charya/schemas";
import Constants from "expo-constants";

import { Button, Screen, Text } from "@/shared/ui";
import { useStartWeighIn, useSubmitWeighIn, useUploadVideo } from "@/features/weighin/api";
import { CameraCapture } from "@/features/weighin/camera/CameraCapture";
import { useWeighInStore } from "@/features/weighin/model/store";
import type { RecordedVideo } from "@/features/weighin/model/types";

export default function WeighInCaptureScreen() {
  const router = useRouter();

  const phase = useWeighInStore((s) => s.phase);
  const challenge = useWeighInStore((s) => s.challenge);
  const capturePoint = useWeighInStore((s) => s.capturePoint);
  const begin = useWeighInStore((s) => s.begin);
  const setVideo = useWeighInStore((s) => s.setVideo);
  const setError = useWeighInStore((s) => s.setError);

  const start = useStartWeighIn();
  const upload = useUploadVideo();
  const submit = useSubmitWeighIn();

  // Inicia a sessão ao abrir a tela (busca o código dinâmico + URL de upload).
  useEffect(() => {
    if (phase !== "idle") return;
    start.mutate(
      // TODO: derivar betId e o ponto de captura (T0/T1/T2) do estado da aposta.
      { betId: "TODO-bet-id", capturePoint: "T0" },
      {
        onSuccess: (res) => begin("T0", res.challenge),
        onError: () => setError("Não foi possível iniciar a pesagem."),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRecordingFinished(video: RecordedVideo) {
    setVideo(video);
    const session = start.data;
    if (session == null || challenge == null) {
      setError("Sessão inválida.");
      return;
    }
    try {
      // Upload direto p/ R2 com retry (não toca o backend).
      await upload.mutateAsync({ video, uploadUrl: session.upload.url });

      // Monta e VALIDA o payload com o schema compartilhado antes de enviar.
      // O parse falha cedo se algo estiver fora do contrato (ex.: peso inválido).
      const capture = CapturePayload.parse({
        challengeId: challenge.id,
        // Referência ao objeto que acabou de subir no R2 (URL pública/derivada).
        videoRef: publicUrlFor(session.upload.objectKey),
        displayedNonce: challenge.nonce,
        // TODO: capturar o peso lido pelo usuário no visor antes do submit.
        declaredWeight: 0,
        deviceMeta: {
          platform: Platform.OS === "ios" ? "ios" : "android",
          osVersion: String(Platform.Version),
          appVersion: Constants.expoConfig?.version ?? "0.0.0",
          capturedInApp: true,
        },
        recordedAt: new Date().toISOString(),
      });

      // Registra a pesagem (regra dura de sanidade roda no backend).
      await submit.mutateAsync({
        betId: "TODO-bet-id",
        capturePoint,
        capture,
      });
      router.replace("/weighin/result");
    } catch {
      setError("Falha no envio. Tente novamente.");
    }
  }

  if (start.isPending || challenge == null) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-3">
          <Text variant="heading">Preparando a pesagem…</Text>
          <Text variant="caption" className="text-center text-muted">
            Gerando o código de verificação.
          </Text>
        </View>
      </Screen>
    );
  }

  if (phase === "error") {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-4">
          <Text variant="heading">Algo deu errado</Text>
          <Button label="Tentar de novo" onPress={() => router.replace("/weighin")} />
        </View>
      </Screen>
    );
  }

  if (upload.isPending || submit.isPending) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-3">
          <Text variant="heading">Enviando o vídeo…</Text>
          <Text variant="caption" className="text-center text-muted">
            Mantemos tentando mesmo com a conexão instável.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <CameraCapture
      challenge={challenge}
      onRecordingFinished={handleRecordingFinished}
      onError={setError}
    />
  );
}

/** Deriva a URL pública do objeto no R2 a partir da chave. */
function publicUrlFor(objectKey: string): string {
  const base = process.env.EXPO_PUBLIC_R2_PUBLIC_URL ?? "";
  return `${base.replace(/\/$/, "")}/${objectKey}`;
}
