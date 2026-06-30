/**
 * Onboarding — boas-vindas. Herói com o RAIO da marca (Skia, glow) + os dois
 * desfechos honestos em cards frosted com ÍCONES, tudo entrando em CASCATA.
 * Visual-first, com pop e movimento — mas transparente (nomeia a perda) e
 * frictionless (um CTA).
 */
import { ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { BrandBolt, Button, Card, PressableScale, Screen, Tag, Text } from "@/shared/ui";
import { arena } from "@/theme/tokens";

export default function OnboardingWelcome() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen>
      <View className="flex-1 py-2">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 18, paddingBottom: 8 }}>
          <Animated.View entering={FadeIn.duration(700)} className="items-center pt-2">
            <BrandBolt size={150} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).springify()} className="items-center">
            <Tag label={t("onboarding.welcome.eyebrow")} align="center" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(280).springify()}>
            <Text variant="title" className="text-center">
              {t("onboarding.welcome.title")}
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(380).springify()}>
            <Text variant="body" className="text-center text-muted">
              {t("onboarding.welcome.body")}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(480).springify()} className="mt-1 gap-3">
            <Card accent="green" className="flex-row items-center gap-4">
              <View className="h-11 w-11 items-center justify-center rounded-2xl border border-arena-hairline bg-arena-glass">
                <Feather name="check-circle" size={24} color={arena.green} />
              </View>
              <Text variant="body" className="flex-1">
                <Text className="font-sans-bold text-arena-mint">{t("onboarding.welcome.hitTitle")}</Text>
                {" — "}
                {t("onboarding.welcome.hit")}
              </Text>
            </Card>

            <Card className="flex-row items-center gap-4">
              <View className="h-11 w-11 items-center justify-center rounded-2xl border border-arena-hairline bg-arena-glass">
                <Feather name="x-circle" size={24} color={arena.fogMute} />
              </View>
              <Text variant="body" className="flex-1">
                <Text className="font-sans-bold text-foreground">{t("onboarding.welcome.missTitle")}</Text>
                {" — "}
                {t("onboarding.welcome.miss")}
              </Text>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)} className="flex-row items-center justify-center gap-2 px-2">
            <Feather name="video" size={14} color={arena.fogMute} />
            <Text variant="caption" className="flex-1 text-muted-foreground">
              {t("onboarding.welcome.proof")}
            </Text>
          </Animated.View>
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(720)} className="gap-3 pt-3">
          <Button
            label={t("onboarding.welcome.cta")}
            icon="arrow-right"
            onPress={() => router.push("/(onboarding)/quiz")}
          />
          <PressableScale onPress={() => router.push("/(auth)/sign-in")} className="items-center">
            <Text variant="label" className="text-muted-foreground">
              {t("onboarding.welcome.login")}
            </Text>
          </PressableScale>
        </Animated.View>
      </View>
    </Screen>
  );
}
