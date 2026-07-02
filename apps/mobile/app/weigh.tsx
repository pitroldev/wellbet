/**
 * Pesagem (baseline ou final). `?kind=baseline|final`.
 *
 * - **baseline** (grátis, pré-conta): registro SIMPLES do peso, sem câmera —
 *   baixo atrito no topo do funil; é só o ponto de partida.
 * - **final** (vale o prêmio, pós-pagamento): a PROVA real — declara o peso e
 *   GRAVA o vídeo contínuo (vision-camera, código dinâmico, roteiro de 6 passos).
 *   A câmera entra onde tem consequência.
 */
import { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Card, Input, Screen, Tag, Text } from "@/shared/ui";
import { hapticDone } from "@/shared/motion";
import { useJourney } from "@/features/journey";
import { CameraCapture } from "@/features/weighin/camera/CameraCapture";
import { localChallenge } from "@/features/weighin/model/localChallenge";
import { useWeighInStore } from "@/features/weighin/model/store";
import type { Challenge } from "@/features/weighin/model/types";

export default function Weigh() {
  const router = useRouter();
  const { t } = useTranslation();
  const { kind } = useLocalSearchParams<{ kind?: string }>();
  const isFinal = kind === "final";
  const s = useJourney();

  const [raw, setRaw] = useState("");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [error, setError] = useState<string | null>(null);

  const kg = parseFloat(raw.replace(",", "."));
  const valid = Number.isFinite(kg) && kg > 20 && kg < 400;

  // baseline: registro simples, sem câmera (baixo atrito, pré-conta).
  function registerBaseline() {
    if (!valid) return;
    s.setBaseline(kg);
    hapticDone();
    router.replace("/");
  }

  // final: grava a prova em vídeo.
  function startRecording() {
    if (!valid) return;
    setError(null);
    useWeighInStore.getState().reset();
    setChallenge(localChallenge());
  }
  function handleRecorded() {
    useWeighInStore.getState().reset();
    s.submitFinal(kg);
    hapticDone();
    router.replace("/");
  }
  function handleError(message: string) {
    setChallenge(null);
    setError(message);
  }

  // --- Modo gravação (só na final): câmera em tela cheia ---
  if (challenge != null) {
    return (
      <CameraCapture
        challenge={challenge}
        onRecordingFinished={handleRecorded}
        onError={handleError}
      />
    );
  }

  // --- Modo declaração ---
  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <View className="gap-5 pt-6">
          {/* Final é PROVA, não festa — green fica pro settlement; aqui o tom é sóbrio. */}
          <Tag
            label={isFinal ? t("journey.home.windowTitle") : t("journey.baseline.eyebrow")}
            tone={isFinal ? "ink" : "violet"}
          />
          <Text variant="title">
            {isFinal ? t("journey.home.windowTitle") : t("journey.baseline.title")}
          </Text>
          <Text variant="body" className="text-muted">
            {isFinal ? t("journey.home.windowBody") : t("journey.baseline.body")}
          </Text>

          <Input
            label={t("journey.baseline.weightLabel")}
            value={raw}
            onChangeText={setRaw}
            placeholder={t("journey.baseline.weightPlaceholder")}
            keyboardType="decimal-pad"
            autoFocus
          />

          {isFinal ? (
            <Card accent="violet">
              <Text variant="label" className="text-arena-violet-soft">
                A prova
              </Text>
              <Text variant="body" className="mt-1">
                {t("journey.baseline.protocol")}
              </Text>
            </Card>
          ) : (
            <Text variant="caption" className="text-muted">
              {t("journey.baseline.note")}
            </Text>
          )}

          {error != null ? (
            <Text variant="caption" className="text-danger">
              {error}
            </Text>
          ) : null}
        </View>

        {isFinal ? (
          <Button
            label={t("journey.baseline.recordCta")}
            onPress={startRecording}
            disabled={!valid}
          />
        ) : (
          <Button
            label={t("journey.baseline.cta")}
            onPress={registerBaseline}
            disabled={!valid}
          />
        )}
      </View>
    </Screen>
  );
}
