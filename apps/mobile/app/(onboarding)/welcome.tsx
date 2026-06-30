/**
 * Onboarding — boas-vindas. Herói com o RAIO da marca (Skia, glowing) + os dois
 * desfechos honestos em cards com ÍCONES, tudo entrando em CASCATA. Visual-first,
 * com pop e movimento — mas transparente (nomeia a perda) e frictionless (um CTA).
 */
import { ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { BrandBolt, Button, Card, Screen, Tag, Text } from "@/shared/ui";
import { arena } from "@/theme/tokens";

export default function OnboardingWelcome() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen>
      <View className="flex-1 py-3">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 18, paddingBottom: 8 }}
        >
          <Animated.View entering={FadeIn.duration(700)} className="items-center">
            <BrandBolt size={138} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(180).springify()}>
            <Tag label={t("onboarding.welcome.eyebrow")} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(280).springify()}>
            <Text variant="title" className="text-5xl">
              {t("onboarding.welcome.title")}
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(380).springify()}>
            <Text variant="body" className="text-lg text-muted">
              {t("onboarding.welcome.body")}
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(480).springify()} className="gap-3">
            <Card accent="green" className="flex-row items-center gap-3">
              <Feather name="check-circle" size={26} color={arena.green} />
              <Text variant="body" className="flex-1">
                <Text className="font-sans-bold text-arena-green">
                  {t("onboarding.welcome.hitTitle")}
                </Text>
                {" — "}
                {t("onboarding.welcome.hit")}
              </Text>
            </Card>

            <Card className="flex-row items-center gap-3">
              <Feather name="x-circle" size={26} color={arena.fogMute} />
              <Text variant="body" className="flex-1">
                <Text className="font-sans-bold text-foreground">
                  {t("onboarding.welcome.missTitle")}
                </Text>
                {" — "}
                {t("onboarding.welcome.miss")}
              </Text>
            </Card>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(600)}>
            <Text variant="caption" className="text-center text-muted">
              {t("onboarding.welcome.proof")}
            </Text>
          </Animated.View>
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(720)} className="pt-3">
          <Button
            label={t("onboarding.welcome.cta")}
            onPress={() => router.push("/(onboarding)/quiz")}
          />
        </Animated.View>
      </View>
    </Screen>
  );
}
