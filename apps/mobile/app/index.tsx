/**
 * Home. Ponto de entrada: leva ao onboarding (primeira vez) ou direto à
 * pesagem. Mantém o feel snappy com componentes base animados.
 */
import { View } from "react-native";
import { Link, Redirect } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Screen, Text } from "@/shared/ui";
import { kv, StorageKeys } from "@/shared/lib/storage";
import { useWeighInHistory } from "@/features/home/api/useWeighInHistory";
import { WeighInHistoryList } from "@/features/home/components/WeighInHistoryList";

export default function HomeScreen() {
  const { t } = useTranslation();
  const onboardingDone = kv.getBool(StorageKeys.onboardingDone) ?? false;
  const { data: history = [] } = useWeighInHistory();

  if (!onboardingDone) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Screen>
      <View className="flex-1 gap-8 py-6">
        <View className="gap-2">
          <Text variant="title">{t("home.title")}</Text>
          <Text variant="body" className="text-muted">
            {t("home.tagline")}
          </Text>
        </View>

        <View className="flex-1">
          <Text variant="heading" className="mb-3">
            {t("home.weighinsTitle")}
          </Text>
          <WeighInHistoryList data={history} />
        </View>

        <View className="gap-3">
          <Link href="/bet/new" asChild>
            <Button label={t("home.newBet")} />
          </Link>
          <Link href="/weighin" asChild>
            <Button label={t("home.newWeighin")} tone="secondary" />
          </Link>
          <Link href="/profile" asChild>
            <Button label={t("home.myProfile")} tone="secondary" />
          </Link>
          <Link href="/(onboarding)" asChild>
            <Button label={t("home.howItWorks")} tone="ghost" />
          </Link>
        </View>
      </View>
    </Screen>
  );
}
