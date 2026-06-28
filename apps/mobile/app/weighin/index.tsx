/**
 * Tela de captura da pesagem.
 *
 * Orquestra: resolver a aposta ativa + o ponto de captura (T0/T1/T2) → declarar
 * o peso → iniciar sessão (código dinâmico + URL pré-assinada R2) → gravar take
 * contínuo → enviar ao R2 com retry → registrar a pesagem (o backend aplica a
 * regra dura de sanidade e enfileira a revisão humana).
 *
 * SÓBRIA por design (Orçamento de performance): nada de dopamina aqui. O payload
 * é validado no backend (SubmitWeighInDto); o vídeo é referenciado pela objectKey
 * devolvida no start.
 */
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, Screen, Text } from "@/shared/ui";
import { apiErrorMessage } from "@/shared/lib/http";
import {
  useActiveWeighInTarget,
  useStartWeighIn,
  useSubmitWeighIn,
  useUploadVideo,
} from "@/features/weighin/api";
import { CameraCapture } from "@/features/weighin/camera/CameraCapture";
import { useWeighInStore } from "@/features/weighin/model/store";
import type { RecordedVideo } from "@/features/weighin/model/types";

export default function WeighInCaptureScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const target = useActiveWeighInTarget();

  const phase = useWeighInStore((s) => s.phase);
  const challenge = useWeighInStore((s) => s.challenge);
  const capturePoint = useWeighInStore((s) => s.capturePoint);
  const begin = useWeighInStore((s) => s.begin);
  const setVideo = useWeighInStore((s) => s.setVideo);
  const setError = useWeighInStore((s) => s.setError);
  const errorMsg = useWeighInStore((s) => s.error);

  const start = useStartWeighIn();
  const upload = useUploadVideo();
  const submit = useSubmitWeighIn();

  const [weight, setWeight] = useState("");
  const [weightConfirmed, setWeightConfirmed] = useState(false);
  const [weightError, setWeightError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Inicia a sessão assim que sabemos a aposta + o ponto de captura.
  useEffect(() => {
    if (phase !== "idle") return;
    if (target.status !== "ready") return;
    const { betId, capturePoint: point } = target;
    start.mutate(
      { betId, capturePoint: point },
      {
        onSuccess: (res) => begin(point, res.challenge),
        onError: () => setError(t("weighin.error.start")),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.status, phase]);

  function confirmWeight(): void {
    setWeightError(null);
    const kg = Number(weight.replace(",", ".").trim());
    if (!Number.isFinite(kg) || kg <= 0) {
      setWeightError(t("weighin.weightGate.invalid"));
      return;
    }
    setWeightConfirmed(true);
  }

  async function handleRecordingFinished(video: RecordedVideo): Promise<void> {
    setVideo(video);
    const session = start.data;
    if (session == null || challenge == null || target.status !== "ready") {
      setError(t("weighin.error.session"));
      return;
    }
    try {
      // Upload direto p/ R2 com retry + progresso (não toca o backend).
      setUploadProgress(0);
      await upload.mutateAsync({
        video,
        uploadUrl: session.upload.url,
        onProgress: setUploadProgress,
      });

      // Registra a pesagem (regra dura + validação rodam no backend).
      await submit.mutateAsync({
        betId: target.betId,
        capturePoint,
        weightKg: Number(weight.replace(",", ".").trim()),
        nonce: challenge.nonce,
        videoObjectKey: session.upload.objectKey,
      });
      router.replace("/weighin/result");
    } catch (e) {
      setError(apiErrorMessage(e) ?? t("weighin.error.upload"));
    }
  }

  // --- destino da pesagem (antes de qualquer captura) ---
  if (target.status === "loading") {
    return <CenteredMessage heading={t("common.loading")} />;
  }
  if (target.status === "no-bet") {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text variant="heading" className="text-center">
            {t("weighin.noBet.title")}
          </Text>
          <Text variant="caption" className="text-center text-muted">
            {t("weighin.noBet.body")}
          </Text>
          <Link href="/bet/new" asChild>
            <Button label={t("weighin.noBet.cta")} />
          </Link>
        </View>
      </Screen>
    );
  }
  if (target.status === "done") {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text variant="heading" className="text-center">
            {t("weighin.done.title")}
          </Text>
          <Text variant="caption" className="text-center text-muted">
            {t("weighin.done.body")}
          </Text>
          <Link href="/" asChild>
            <Button label={t("common.backHome")} />
          </Link>
        </View>
      </Screen>
    );
  }

  if (phase === "error") {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text variant="heading" className="text-center">
            {t("weighin.error.title")}
          </Text>
          {errorMsg != null ? (
            <Text variant="caption" className="text-center text-muted">
              {errorMsg}
            </Text>
          ) : null}
          <Button label={t("weighin.error.retry")} onPress={() => router.replace("/weighin")} />
        </View>
      </Screen>
    );
  }

  if (upload.isPending || submit.isPending) {
    return (
      <CenteredMessage
        heading={t("weighin.uploading.title")}
        caption={t("weighin.uploading.caption")}
        progress={upload.isPending ? uploadProgress : undefined}
      />
    );
  }

  // Gate de peso: o usuário DECLARA o peso antes de gravar (prova no vídeo).
  if (!weightConfirmed) {
    return (
      <Screen>
        <View className="flex-1 gap-8 py-6">
          <View className="gap-2">
            <Text variant="title">{t("weighin.weightGate.title")}</Text>
            <Text variant="body" className="text-muted">
              {t("weighin.weightGate.body")}
            </Text>
          </View>
          <Input
            label={t("weighin.weightGate.label")}
            value={weight}
            onChangeText={setWeight}
            placeholder={t("weighin.weightGate.placeholder")}
            keyboardType="decimal-pad"
            error={weightError ?? undefined}
          />
          <View className="mt-auto">
            <Button label={t("weighin.weightGate.cta")} onPress={confirmWeight} />
          </View>
        </View>
      </Screen>
    );
  }

  if (start.isPending || challenge == null) {
    return (
      <CenteredMessage
        heading={t("weighin.preparing.title")}
        caption={t("weighin.preparing.caption")}
      />
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

function CenteredMessage({
  heading,
  caption,
  progress,
}: {
  heading: string;
  caption?: string;
  /** 0..1 — quando presente, mostra a % do envio. */
  progress?: number;
}) {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-3">
        <Text variant="heading">{heading}</Text>
        {progress != null ? <Text variant="numeric">{Math.round(progress * 100)}%</Text> : null}
        {caption != null ? (
          <Text variant="caption" className="text-center text-muted">
            {caption}
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}
