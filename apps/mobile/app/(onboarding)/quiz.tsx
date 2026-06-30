/**
 * Quiz de personalização (NOOM) — objetivo, porquê, o que travou. Conclui o
 * onboarding e guarda o "porquê" pra munição do treinador (Fase 5). Local.
 *
 * Visual: progresso em segmentos de gradiente, tile de ÍCONE (Feather) por passo,
 * escolhas frosted com ícone + check. Animação: cada passo entra deslizando, o
 * tile dá zoom e as escolhas entram em cascata (stagger).
 */
import { type ReactNode, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeInRight,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, PressableScale, Screen, Tag, Text } from "@/shared/ui";
import { hapticDone, useMotionDuration } from "@/shared/motion";
import { arena, arenaAlpha, durations, gradients } from "@/theme/tokens";
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

function Segment({ filled }: { filled: boolean }) {
  const sv = useSharedValue(filled ? 1 : 0);
  const dur = useMotionDuration(durations.base);

  useEffect(() => {
    sv.value = withTiming(filled ? 1 : 0, { duration: dur });
  }, [filled, dur, sv]);

  const style = useAnimatedStyle(() => ({ width: `${sv.value * 100}%` }));

  return (
    <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-arena-ink">
      <Animated.View style={[{ height: "100%" }, style]}>
        <LinearGradient
          colors={gradients.gymbet}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

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
        style={{
          backgroundColor: selected ? arenaAlpha.magentaWash : arenaAlpha.glass,
          borderColor: selected ? arena.magenta : arena.navyLine,
        }}
        className="flex-row items-center gap-3 rounded-2xl border px-4 py-3.5"
      >
        <View className="h-9 w-9 items-center justify-center rounded-xl border border-arena-hairline bg-arena-glass">
          <Feather name={icon} size={18} color={selected ? arena.magenta : arena.fog} />
        </View>
        <Text variant="body" className={`flex-1 ${selected ? "text-foreground" : "text-muted"}`}>
          {label}
        </Text>
        {selected ? <Feather name="check-circle" size={20} color={arena.magenta} /> : null}
      </View>
    </PressableScale>
  );
}

function StepFrame({ children }: { children: ReactNode }) {
  return <View className="gap-3">{children}</View>;
}

export default function Quiz() {
  const router = useRouter();
  const { t } = useTranslation();
  const setQuiz = useJourney((s) => s.setQuiz);

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
    setQuiz({ goal, why: why.trim(), blocker });
    hapticDone();
    router.push("/(onboarding)/motivation");
  }

  return (
    <Screen>
      <View className="flex-1 py-4">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 24 }}
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
                <Segment key={i} filled={i <= step} />
              ))}
            </View>
          </View>

          <Animated.View key={step} entering={FadeInRight.duration(300)} className="gap-6">
            <Animated.View entering={ZoomIn.delay(60).springify()} className="items-center">
              <View
                style={{ backgroundColor: arenaAlpha.magentaWash }}
                className="h-20 w-20 items-center justify-center rounded-3xl border border-arena-hairline-strong"
              >
                <Feather name={STEP_ICON[step] ?? "zap"} size={32} color={arena.magenta} />
              </View>
            </Animated.View>

            {step === 0 ? (
              <StepFrame>
                <Text variant="title" className="text-center">
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
              </StepFrame>
            ) : null}

            {step === 1 ? (
              <StepFrame>
                <Text variant="title" className="text-center">
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
              </StepFrame>
            ) : null}

            {step === 2 ? (
              <StepFrame>
                <Text variant="title" className="text-center">
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
              </StepFrame>
            ) : null}
          </Animated.View>
        </ScrollView>

        <View className="pt-3">
          <Button
            label={step < 2 ? t("quiz.next") : t("quiz.finish")}
            icon={step < 2 ? "arrow-right" : "check"}
            onPress={advance}
            disabled={!canAdvance}
          />
        </View>
      </View>
    </Screen>
  );
}
