/**
 * Quiz de personalização (NOOM) — objetivo, porquê, o que travou. Conclui o
 * onboarding e guarda o "porquê" pra munição do treinador (Fase 5). Local.
 *
 * Visual: barra de progresso, ÍCONE (Feather) por passo num tile, escolhas com
 * ícone + check ao selecionar. Animação: cada passo entra deslizando, o tile dá
 * zoom e as escolhas entram em cascata (stagger).
 */
import { useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeInDown, FadeInRight, ZoomIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, PressableScale, Screen, Tag, Text } from "@/shared/ui";
import { arena } from "@/theme/tokens";
import { type QuizBlocker, type QuizGoal, useJourney } from "@/features/journey";

type FeatherName = keyof typeof Feather.glyphMap;

const GOALS: { key: QuizGoal; icon: FeatherName }[] = [
  { key: "lose", icon: "trending-down" },
  { key: "health", icon: "activity" },
  { key: "confidence", icon: "smile" },
  { key: "event", icon: "calendar" },
];
const BLOCKERS: { key: QuizBlocker; icon: FeatherName }[] = [
  { key: "consistency", icon: "repeat" },
  { key: "motivation", icon: "battery-charging" },
  { key: "stress", icon: "wind" },
  { key: "alone", icon: "user" },
];
const STEP_ICON: FeatherName[] = ["target", "heart", "shield"];

function Choice({
  icon,
  label,
  selected,
  onPress,
}: {
  icon: FeatherName;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress}>
      <View
        className={`flex-row items-center gap-3 border-2 px-4 py-4 ${
          selected ? "border-arena-magenta bg-arena-navy-soft" : "border-border bg-arena-ink"
        }`}
      >
        <Feather name={icon} size={22} color={selected ? arena.magenta : arena.fog} />
        <Text variant="body" className={`flex-1 ${selected ? "text-foreground" : "text-muted"}`}>
          {label}
        </Text>
        {selected ? <Feather name="check" size={20} color={arena.magenta} /> : null}
      </View>
    </PressableScale>
  );
}

export default function Quiz() {
  const router = useRouter();
  const { t } = useTranslation();
  const finishOnboarding = useJourney((s) => s.finishOnboarding);

  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<QuizGoal | null>(null);
  const [why, setWhy] = useState("");
  const [blocker, setBlocker] = useState<QuizBlocker | null>(null);

  const canAdvance =
    step === 0 ? goal != null : step === 1 ? why.trim().length > 0 : blocker != null;

  function advance() {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    if (goal == null || blocker == null) return;
    finishOnboarding({ goal, why: why.trim(), blocker });
    router.replace("/");
  }

  return (
    <Screen>
      <View className="flex-1 py-4">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 22 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Tag label={t("quiz.eyebrow")} />
              <Text variant="label" className="text-muted-foreground">
                {t("quiz.step", { current: step + 1, total: 3 })}
              </Text>
            </View>
            <View className="flex-row gap-2">
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  className={`h-1.5 flex-1 ${i <= step ? "bg-arena-magenta" : "bg-border"}`}
                />
              ))}
            </View>
          </View>

          <Animated.View key={step} entering={FadeInRight.duration(300)} className="gap-5">
            <Animated.View entering={ZoomIn.delay(60).springify()} className="items-center">
              <View className="h-20 w-20 items-center justify-center bg-arena-magenta">
                <Feather name={STEP_ICON[step] ?? "zap"} size={34} color={arena.ink} />
              </View>
            </Animated.View>

            {step === 0 ? (
              <View className="gap-3">
                <Text variant="title" className="text-center text-3xl">
                  {t("quiz.goalQ")}
                </Text>
                <View className="gap-2.5">
                  {GOALS.map((g, i) => (
                    <Animated.View key={g.key} entering={FadeInDown.delay(120 + i * 70).springify()}>
                      <Choice
                        icon={g.icon}
                        label={t(`quiz.goal.${g.key}`)}
                        selected={goal === g.key}
                        onPress={() => setGoal(g.key)}
                      />
                    </Animated.View>
                  ))}
                </View>
              </View>
            ) : null}

            {step === 1 ? (
              <View className="gap-3">
                <Text variant="title" className="text-center text-3xl">
                  {t("quiz.whyQ")}
                </Text>
                <Input
                  value={why}
                  onChangeText={setWhy}
                  placeholder={t("quiz.whyPlaceholder")}
                  autoFocus
                  returnKeyType="done"
                />
                <Text variant="caption" className="text-center text-muted">
                  {t("quiz.whyHint")}
                </Text>
              </View>
            ) : null}

            {step === 2 ? (
              <View className="gap-3">
                <Text variant="title" className="text-center text-3xl">
                  {t("quiz.blockerQ")}
                </Text>
                <View className="gap-2.5">
                  {BLOCKERS.map((b, i) => (
                    <Animated.View key={b.key} entering={FadeInDown.delay(120 + i * 70).springify()}>
                      <Choice
                        icon={b.icon}
                        label={t(`quiz.blocker.${b.key}`)}
                        selected={blocker === b.key}
                        onPress={() => setBlocker(b.key)}
                      />
                    </Animated.View>
                  ))}
                </View>
              </View>
            ) : null}
          </Animated.View>
        </ScrollView>

        <View className="pt-3">
          <Button
            label={step < 2 ? t("quiz.next") : t("quiz.finish")}
            onPress={advance}
            disabled={!canAdvance}
          />
        </View>
      </View>
    </Screen>
  );
}
