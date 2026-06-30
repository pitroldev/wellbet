/**
 * Onboarding passo 10 — revisar o vídeo e confirmar. Confirmar FECHA o onboarding
 * (cria a aposta a partir do rascunho + marca o baseline revisado) e cai na home,
 * que pede o Pix. Gravar de novo volta pra câmera.
 *
 * (A reprodução do vídeo em si exige um player nativo — expo-video — que ainda não
 * está no projeto; por ora mostramos o resumo da gravação + checklist do roteiro.)
 */
import { ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Card, Screen, Tag, Text } from "@/shared/ui";
import { hapticDone } from "@/shared/motion";
import { arena, arenaAlpha } from "@/theme/tokens";
import { formatKg, useJourney } from "@/features/journey";
import { useWeighInStore } from "@/features/weighin/model/store";

const STEP_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

export default function CaptureReview() {
  const router = useRouter();
  const { t } = useTranslation();
  const video = useWeighInStore((s) => s.video);
  const weightKg = useJourney((s) => s.baselineWeightKg);
  const completeOnboarding = useJourney((s) => s.completeOnboarding);

  if (video == null) return <Redirect href="/(onboarding)/capture-intro" />;

  const seconds = Math.max(1, Math.round(video.durationMs / 1000));

  function confirm() {
    completeOnboarding();
    useWeighInStore.getState().reset();
    hapticDone();
    router.replace("/");
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 18, paddingTop: 8 }}>
          <View className="gap-2">
            <Tag label={t("onboarding.review.eyebrow")} tone="green" />
            <Text variant="title">{t("onboarding.review.title")}</Text>
            <Text variant="body" className="text-muted">
              {t("onboarding.review.body")}
            </Text>
          </View>

          {/* "player" — resumo da gravação */}
          <Card glow className="items-center justify-center gap-3 py-10">
            <View
              style={{ backgroundColor: arenaAlpha.magentaWash }}
              className="h-16 w-16 items-center justify-center rounded-full border border-arena-hairline-strong"
            >
              <Feather name="play" size={26} color={arena.white} />
            </View>
            <Text variant="label">{t("onboarding.review.recorded", { seconds })}</Text>
            {weightKg != null ? (
              <Text variant="body" className="text-arena-mint">
                {t("onboarding.review.declared", { kg: formatKg(weightKg) })}
              </Text>
            ) : null}
          </Card>

          <View className="gap-2.5">
            <Text variant="label">{t("onboarding.review.checklist")}</Text>
            {STEP_KEYS.map((k) => (
              <View key={k} className="flex-row items-center gap-2.5">
                <Feather name="check-circle" size={16} color={arena.green} />
                <Text variant="caption" className="flex-1">
                  {t(`onboarding.guide.steps.${k}`)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View className="gap-3">
          <Button label={t("onboarding.review.confirm")} icon="check" onPress={confirm} />
          <Button
            label={t("onboarding.review.retake")}
            tone="secondary"
            icon="rotate-ccw"
            onPress={() => router.replace("/(onboarding)/capture")}
          />
        </View>
      </View>
    </Screen>
  );
}
