/**
 * Onboarding passo 8 — guia da captura de vídeo (a prova do baseline). Explica o
 * roteiro contínuo de 6 etapas, com ícones, antes de abrir a câmera.
 */
import { ScrollView, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Card, Screen, Tag, Text } from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";

type FeatherName = keyof typeof Feather.glyphMap;

const STEP_ICONS: FeatherName[] = ["user", "hash", "minimize-2", "grid", "user-check", "maximize-2"];
const STEP_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6"] as const;

export default function CaptureIntro() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen>
      <View className="flex-1 justify-between py-3">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 18, paddingTop: 8 }}>
          <Animated.View entering={FadeIn.duration(500)} className="items-center">
            <View
              style={{ backgroundColor: arenaAlpha.violetWash }}
              className="h-20 w-20 items-center justify-center rounded-3xl border border-arena-hairline-strong"
            >
              <Feather name="video" size={34} color={arena.violetSoft} />
            </View>
          </Animated.View>
          <View className="items-center gap-2">
            <Tag label={t("onboarding.guide.eyebrow")} align="center" />
            <Text variant="title" className="text-center">
              {t("onboarding.guide.title")}
            </Text>
            <Text variant="body" className="text-center text-muted">
              {t("onboarding.guide.body")}
            </Text>
          </View>

          <View className="gap-2.5">
            {/* Stagger SÓBRIO (timing seco, sem spring) — captura é prova, não dopamina. */}
            {STEP_KEYS.map((k, i) => (
              <Animated.View key={k} entering={FadeInDown.delay(80 + i * 55).duration(320)}>
                <Card className="flex-row items-center gap-3">
                  <View className="h-10 w-10 items-center justify-center rounded-2xl border border-arena-hairline bg-arena-glass">
                    <Feather name={STEP_ICONS[i] ?? "circle"} size={18} color={arena.violetSoft} />
                  </View>
                  <Text variant="body" className="flex-1 text-sm">
                    {t(`onboarding.guide.steps.${k}`)}
                  </Text>
                  <Text className="font-mono-bold text-xs text-muted-foreground">{i + 1}</Text>
                </Card>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
        <Button
          label={t("onboarding.guide.cta")}
          icon="camera"
          onPress={() => router.push("/(onboarding)/capture")}
        />
      </View>
    </Screen>
  );
}
