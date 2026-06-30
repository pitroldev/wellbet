/**
 * Onboarding passo 3 — frase motivadora. Fecha o "combinado" e devolve o PORQUÊ
 * do usuário (do quiz) como citação, pra ancorar emoção antes de pedir números.
 */
import { ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Card, Screen, Tag, Text } from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";
import { useJourney } from "@/features/journey";

export default function Motivation() {
  const router = useRouter();
  const { t } = useTranslation();
  const why = useJourney((s) => s.quiz?.why ?? "");

  return (
    <Screen>
      <View className="flex-1 justify-between py-3">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingTop: 24 }}>
          <Animated.View entering={FadeIn.duration(500)} className="items-center">
            <View
              style={{ backgroundColor: arenaAlpha.magentaWash }}
              className="h-20 w-20 items-center justify-center rounded-3xl border border-arena-hairline-strong"
            >
              <Feather name="zap" size={36} color={arena.magenta} />
            </View>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150).springify()} className="items-center">
            <Tag label={t("onboarding.motivation.eyebrow")} align="center" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(260).springify()}>
            <Text variant="title" className="text-center">
              {t("onboarding.motivation.title")}
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(360).springify()}>
            <Text variant="body" className="text-center text-muted">
              {t("onboarding.motivation.body")}
            </Text>
          </Animated.View>
          {why.length > 0 ? (
            <Animated.View entering={FadeInDown.delay(460).springify()}>
              <Card glow accent="magenta">
                <Text variant="label" className="text-arena-magenta">
                  {t("onboarding.motivation.whyLabel")}
                </Text>
                <Text variant="heading" className="mt-2 text-lg">
                  “{why}”
                </Text>
              </Card>
            </Animated.View>
          ) : null}
        </ScrollView>
        <Animated.View entering={FadeInDown.delay(560)} className="pt-3">
          <Button
            label={t("onboarding.motivation.cta")}
            icon="arrow-right"
            onPress={() => router.push("/(onboarding)/measures")}
          />
        </Animated.View>
      </View>
    </Screen>
  );
}
