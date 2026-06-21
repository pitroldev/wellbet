/**
 * Home. Ponto de entrada: leva ao onboarding (primeira vez) ou direto à
 * pesagem. Mantém o feel snappy com componentes base animados.
 */
import { View } from "react-native";
import { Link, Redirect } from "expo-router";

import { Button, Screen, Text } from "@/shared/ui";
import { kv, StorageKeys } from "@/shared/lib/storage";
import { useWeighInHistory } from "@/features/home/api/useWeighInHistory";
import { WeighInHistoryList } from "@/features/home/components/WeighInHistoryList";

export default function HomeScreen() {
  const onboardingDone = kv.getBool(StorageKeys.onboardingDone) ?? false;
  const { data: history = [] } = useWeighInHistory();

  if (!onboardingDone) {
    return <Redirect href="/(onboarding)" />;
  }

  return (
    <Screen>
      <View className="flex-1 gap-8 py-6">
        <View className="gap-2">
          <Text variant="title">Charya</Text>
          <Text variant="body" className="text-muted">
            Aposte em você. Emagreça de verdade.
          </Text>
        </View>

        <View className="flex-1">
          <Text variant="heading" className="mb-3">
            Suas pesagens
          </Text>
          <WeighInHistoryList data={history} />
        </View>

        <View className="gap-3">
          <Link href="/weighin" asChild>
            <Button label="Nova pesagem" />
          </Link>
          <Link href="/profile" asChild>
            <Button label="Meu perfil" tone="secondary" />
          </Link>
          <Link href="/(onboarding)" asChild>
            <Button label="Como funciona" tone="ghost" />
          </Link>
        </View>
      </View>
    </Screen>
  );
}
