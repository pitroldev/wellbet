/**
 * Onboarding — boas-vindas. Claro, transparente e frictionless: o que é (aposta
 * em você), o mecanismo HONESTO (os dois desfechos, incl. a perda), e a prova
 * (vídeo revisado). Sem mascote, sem dopamina forçada — só a verdade do produto.
 */
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Screen, Tag, Text } from "@/shared/ui";

export default function OnboardingWelcome() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen>
      <View className="flex-1 justify-between py-6">
        <View className="gap-8">
          {/* hero */}
          <View className="gap-3">
            <Tag label={t("onboarding.welcome.eyebrow")} />
            <Text variant="title">{t("onboarding.welcome.title")}</Text>
            <Text variant="body" className="text-muted">
              {t("onboarding.welcome.body")}
            </Text>
          </View>

          {/* os dois desfechos reais — transparência (nomeia a perda) */}
          <View className="gap-3">
            <View className="flex-row items-start gap-3">
              <View className="h-7 w-7 items-center justify-center bg-arena-green">
                <Text className="font-mono-bold text-base text-arena-green-ink">✓</Text>
              </View>
              <Text variant="body" className="flex-1">
                <Text className="font-sans-bold text-arena-green">
                  {t("onboarding.welcome.hitTitle")}
                </Text>
                {" — "}
                {t("onboarding.welcome.hit")}
              </Text>
            </View>
            <View className="flex-row items-start gap-3">
              <View className="h-7 w-7 items-center justify-center bg-surface-elevated">
                <Text className="font-mono-bold text-base text-muted">✕</Text>
              </View>
              <Text variant="body" className="flex-1">
                <Text className="font-sans-bold text-foreground">
                  {t("onboarding.welcome.missTitle")}
                </Text>
                {" — "}
                {t("onboarding.welcome.miss")}
              </Text>
            </View>
          </View>

          {/* prova */}
          <Text variant="caption" className="text-muted">
            {t("onboarding.welcome.proof")}
          </Text>
        </View>

        <Button
          label={t("onboarding.welcome.cta")}
          onPress={() => router.push("/(onboarding)/quiz")}
        />
      </View>
    </Screen>
  );
}
