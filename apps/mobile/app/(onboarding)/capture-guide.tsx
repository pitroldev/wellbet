/**
 * Guia do roteiro de captura (MVP §4). Explica as 6 etapas do vídeo contínuo
 * ANTES da gravação, para a tela de captura ficar enxuta. Conclui o onboarding.
 */
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Screen, Text } from "@/shared/ui";
import { kv, StorageKeys } from "@/shared/lib/storage";

export default function CaptureGuide() {
  const router = useRouter();
  const { t } = useTranslation();

  function finish() {
    kv.setBool(StorageKeys.onboardingDone, true);
    router.replace("/");
  }

  return (
    <Screen>
      <View className="flex-1 gap-6 py-6">
        <View className="gap-2">
          <Text variant="label" className="text-arena-magenta">
            WellBet
          </Text>
          <Text variant="title">{t("onboarding.guide.title")}</Text>
          <Text variant="body" className="text-muted">
            {t("onboarding.guide.body")}
          </Text>
        </View>

        <View className="flex-1 gap-4">
          {([1, 2, 3, 4, 5, 6] as const).map((n) => (
            <View key={n} className="flex-row gap-3">
              <View className="h-7 w-7 items-center justify-center bg-arena-magenta">
                <Text className="font-mono-bold text-base text-on-primary">{n}</Text>
              </View>
              <Text variant="body" className="flex-1">
                {t(`onboarding.guide.steps.s${n}`)}
              </Text>
            </View>
          ))}
        </View>

        <Button label={t("onboarding.guide.cta")} onPress={finish} />
      </View>
    </Screen>
  );
}
