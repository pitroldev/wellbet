/**
 * Onboarding — boas-vindas. Momento CINEMATOGRÁFICO de marca: campo de brasas
 * (EmberField, Skia) subindo atrás do herói BrandFlame, e o conteúdo entrando em
 * CASCATA orquestrada — nada estoura ao mesmo tempo. Os dois desfechos honestos
 * assentam um após o outro com rise+tilt (spring). Visual-first, mas transparente
 * (nomeia a perda) e frictionless (um CTA). Tudo respeita reduce-motion.
 */
import { ScrollView, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  withDelay,
  withSpring,
  withTiming,
  type EntryExitAnimationFunction,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { EmberField } from "@/features/onboarding/components";
import { useReducedMotion } from "@/shared/motion";
import { BrandFlame, Button, Card, PressableScale, Screen, Tag, Text } from "@/shared/ui";
import { arena } from "@/theme/tokens";

/**
 * Entrada dos cards de desfecho: sobem com uma inclinação leve e ASSENTAM em
 * spring. Custom porque os builders prontos não combinam translateY + rotação;
 * o delay vive DENTRO da animação (withDelay) — builder custom não tem `.delay()`.
 * Reduce-motion é tratado na tela (entering condicional), não aqui.
 */
function makeCardEnter(delayMs: number, tilt: string): EntryExitAnimationFunction {
  return () => {
    "worklet";
    return {
      initialValues: { opacity: 0, transform: [{ translateY: 28 }, { rotate: tilt }] },
      animations: {
        opacity: withDelay(delayMs, withTiming(1, { duration: 240 })),
        transform: [
          { translateY: withDelay(delayMs, withSpring(0, { damping: 15, stiffness: 150 })) },
          {
            rotate: withDelay(
              delayMs,
              withTiming("0deg", { duration: 420, easing: Easing.out(Easing.cubic) }),
            ),
          },
        ],
      },
    };
  };
}
// Um desfecho por vez: o "bateu" assenta primeiro, o "não bateu" logo atrás.
const enterHitCard = makeCardEnter(520, "-2deg");
const enterMissCard = makeCardEnter(680, "2deg");

export default function OnboardingWelcome() {
  const router = useRouter();
  const { t } = useTranslation();
  const reduced = useReducedMotion();

  return (
    <Screen>
      <View className="flex-1 py-2">
        {/* A fogueira da marca — brasas subindo ATRÁS de todo o conteúdo (decorativo). */}
        <EmberField intensity={0.5} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 18, paddingBottom: 8 }}>
          <Animated.View entering={FadeIn.duration(700)} className="items-center pt-2">
            <BrandFlame size={150} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).springify()} className="items-center">
            <Tag label={t("onboarding.welcome.eyebrow")} align="center" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(320).springify()}>
            <Text variant="title" className="text-center">
              {t("onboarding.welcome.title")}
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(440).springify()}>
            <Text variant="body" className="text-center text-muted">
              {t("onboarding.welcome.body")}
            </Text>
          </Animated.View>

          <View className="mt-1 gap-3">
            <Animated.View entering={reduced ? undefined : enterHitCard}>
              {/* Verde é SÓ vitória — aqui o desfecho bom brilha em ciano (realce informacional). */}
              <Card accent="cyan" className="flex-row items-center gap-4">
                <View className="h-11 w-11 items-center justify-center rounded-2xl border border-arena-hairline bg-arena-glass">
                  <Feather name="check-circle" size={24} color={arena.cyan} />
                </View>
                <Text variant="body" className="flex-1">
                  <Text className="font-sans-bold text-arena-cyan">{t("onboarding.welcome.hitTitle")}</Text>
                  {" — "}
                  {t("onboarding.welcome.hit")}
                </Text>
              </Card>
            </Animated.View>

            <Animated.View entering={reduced ? undefined : enterMissCard}>
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
          </View>

          <Animated.View entering={FadeInDown.delay(860)} className="flex-row items-center justify-center gap-2 px-2">
            <Feather name="video" size={14} color={arena.fogMute} />
            <Text variant="caption" className="flex-1 text-muted-foreground">
              {t("onboarding.welcome.proof")}
            </Text>
          </Animated.View>
        </ScrollView>

        <Animated.View entering={FadeInUp.delay(940)} className="gap-3 pt-3">
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
