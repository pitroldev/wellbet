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
import { type ReactNode, useEffect, useState } from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, Screen, Text } from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";
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

type FeatherName = keyof typeof Feather.glyphMap;

/** Tela de estado (sem-aposta / concluído / erro) no padrão Midnight Aurora:
 * tile de ícone de vidro + título + corpo + ação. (A captura/câmera segue sóbria.) */
function StateView({
  icon,
  tone = "magenta",
  title,
  body,
  children,
}: {
  icon: FeatherName;
  tone?: "magenta" | "green";
  title: string;
  body?: string;
  children: ReactNode;
}) {
  const color = tone === "green" ? arena.green : arena.magenta;
  const wash = tone === "green" ? arenaAlpha.greenWash : arenaAlpha.magentaWash;
  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-5">
        <View
          style={{ backgroundColor: wash }}
          className="h-24 w-24 items-center justify-center rounded-3xl border border-arena-hairline-strong"
        >
          <Feather name={icon} size={42} color={color} />
        </View>
        <Text variant="title" className="text-center">
          {title}
        </Text>
        {body != null ? (
          <Text variant="body" className="text-center text-muted">
            {body}
          </Text>
        ) : null}
        <View className="w-full pt-2">{children}</View>
      </View>
    </Screen>
  );
}

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
      <StateView icon="flag" title={t("weighin.noBet.title")} body={t("weighin.noBet.body")}>
        <Link href="/bet/new" asChild>
          <Button label={t("weighin.noBet.cta")} icon="zap" />
        </Link>
      </StateView>
    );
  }
  if (target.status === "done") {
    return (
      <StateView icon="check-circle" tone="green" title={t("weighin.done.title")} body={t("weighin.done.body")}>
        <Link href="/" asChild>
          <Button label={t("common.backHome")} />
        </Link>
      </StateView>
    );
  }

  if (phase === "error") {
    return (
      <StateView icon="alert-triangle" title={t("weighin.error.title")} body={errorMsg ?? undefined}>
        <Button label={t("weighin.error.retry")} icon="refresh-cw" onPress={() => router.replace("/weighin")} />
      </StateView>
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
