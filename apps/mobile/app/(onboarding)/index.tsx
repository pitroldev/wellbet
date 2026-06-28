/**
 * Onboarding — boas-vindas. Mascote (Skia, desenhado em código) e CTA para o
 * guia de captura. Aqui pode haver feel/dopamina (não é a tela de captura).
 */
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Screen, Text } from "@/shared/ui";
import { Mascot } from "@/features/reward/components/Mascot";

export default function OnboardingWelcome() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen>
      <View className="flex-1 justify-between py-10">
        <View className="flex-1 items-center justify-center gap-6">
          <Mascot variant="welcome" size={200} />
          <View className="gap-2">
            <Text variant="label" className="text-center text-arena-magenta">
              Charya
            </Text>
            <Text variant="title" className="text-center">
              {t("onboarding.welcome.title")}
            </Text>
            <Text variant="body" className="text-center text-muted">
              {t("onboarding.welcome.body")}
            </Text>
          </View>
        </View>

        <Button
          label={t("onboarding.welcome.cta")}
          onPress={() => router.push("/(onboarding)/capture-guide")}
        />
      </View>
    </Screen>
  );
}
