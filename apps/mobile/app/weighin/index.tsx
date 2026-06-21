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

import { Button, Input, Screen, Text } from "@/shared/ui";
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
  const router = useRouter();
  const target = useActiveWeighInTarget();

  const phase = useWeighInStore((s) => s.phase);
  const challenge = useWeighInStore((s) => s.challenge);
  const capturePoint = useWeighInStore((s) => s.capturePoint);
  const begin = useWeighInStore((s) => s.begin);
  const setVideo = useWeighInStore((s) => s.setVideo);
  const setError = useWeighInStore((s) => s.setError);

  const start = useStartWeighIn();
  const upload = useUploadVideo();
  const submit = useSubmitWeighIn();

  const [weight, setWeight] = useState("");
  const [weightConfirmed, setWeightConfirmed] = useState(false);
  const [weightError, setWeightError] = useState<string | null>(null);

  // Inicia a sessão assim que sabemos a aposta + o ponto de captura.
  useEffect(() => {
    if (phase !== "idle") return;
    if (target.status !== "ready") return;
    const { betId, capturePoint: point } = target;
    start.mutate(
      { betId, capturePoint: point },
      {
        onSuccess: (res) => begin(point, res.challenge),
        onError: () => setError("Não foi possível iniciar a pesagem."),
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.status, phase]);

  function confirmWeight(): void {
    setWeightError(null);
    const kg = Number(weight.replace(",", ".").trim());
    if (!Number.isFinite(kg) || kg <= 0) {
      setWeightError("Informe o peso que a balança mostra (kg).");
      return;
    }
    setWeightConfirmed(true);
  }

  async function handleRecordingFinished(video: RecordedVideo): Promise<void> {
    setVideo(video);
    const session = start.data;
    if (session == null || challenge == null || target.status !== "ready") {
      setError("Sessão inválida.");
      return;
    }
    try {
      // Upload direto p/ R2 com retry (não toca o backend).
      await upload.mutateAsync({ video, uploadUrl: session.upload.url });

      // Registra a pesagem (regra dura + validação rodam no backend).
      await submit.mutateAsync({
        betId: target.betId,
        capturePoint,
        weightKg: Number(weight.replace(",", ".").trim()),
        nonce: challenge.nonce,
        videoObjectKey: session.upload.objectKey,
      });
      router.replace("/weighin/result");
    } catch {
      setError("Falha no envio. Tente novamente.");
    }
  }

  // --- destino da pesagem (antes de qualquer captura) ---
  if (target.status === "loading") {
    return <CenteredMessage heading="Carregando…" />;
  }
  if (target.status === "no-bet") {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center gap-4 px-6">
          <Text variant="heading" className="text-center">
            Nenhuma aposta ativa
          </Text>
          <Text variant="caption" className="text-center text-muted">
            Crie uma aposta e pague o stake para começar a pesar.
          </Text>
          <Link href="/bet/new" asChild>
            <Button label="Criar aposta" />
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
            Pesagens concluídas
          </Text>
          <Text variant="caption" className="text-center text-muted">
            Você já fez as 3 pesagens desta aposta. Aguarde o resultado.
          </Text>
          <Link href="/" asChild>
            <Button label="Voltar ao início" />
          </Link>
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
      <CenteredMessage
        heading="Enviando o vídeo…"
        caption="Mantemos tentando mesmo com a conexão instável."
      />
    );
  }

  // Gate de peso: o usuário DECLARA o peso antes de gravar (prova no vídeo).
  if (!weightConfirmed) {
    return (
      <Screen>
        <View className="flex-1 gap-8 py-6">
          <View className="gap-2">
            <Text variant="title">Qual o seu peso?</Text>
            <Text variant="body" className="text-muted">
              Informe o peso que a balança mostra. Você vai prová-lo no vídeo a seguir.
            </Text>
          </View>
          <Input
            label="Peso (kg)"
            value={weight}
            onChangeText={setWeight}
            placeholder="ex.: 82,5"
            keyboardType="decimal-pad"
            error={weightError ?? undefined}
          />
          <View className="mt-auto">
            <Button label="Continuar para a gravação" onPress={confirmWeight} />
          </View>
        </View>
      </Screen>
    );
  }

  if (start.isPending || challenge == null) {
    return (
      <CenteredMessage heading="Preparando a pesagem…" caption="Gerando o código de verificação." />
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

function CenteredMessage({ heading, caption }: { heading: string; caption?: string }) {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center gap-3">
        <Text variant="heading">{heading}</Text>
        {caption != null ? (
          <Text variant="caption" className="text-center text-muted">
            {caption}
          </Text>
        ) : null}
      </View>
    </Screen>
  );
}
