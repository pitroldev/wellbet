/**
 * Quiz de personalização (NOOM) — objetivo, porquê, o que travou. Conclui o
 * onboarding e guarda o "porquê" pra munição do treinador (Fase 5). Local.
 */
import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, PressableScale, Screen, Tag, Text } from "@/shared/ui";
import { type QuizBlocker, type QuizGoal, useJourney } from "@/features/journey";

const GOALS: QuizGoal[] = ["lose", "health", "confidence", "event"];
const BLOCKERS: QuizBlocker[] = ["consistency", "motivation", "stress", "alone"];

function Choice({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress}>
      <View
        className={`border-2 px-4 py-4 ${
          selected ? "border-arena-magenta bg-arena-navy-soft" : "border-border bg-arena-ink"
        }`}
      >
        <Text variant="body" className={selected ? "text-foreground" : "text-muted"}>
          {label}
        </Text>
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

  const canAdvance = step === 0 ? goal != null : step === 1 ? why.trim().length > 0 : blocker != null;

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
      <View className="flex-1 justify-between py-4">
        <View className="gap-5">
          <View className="gap-2">
            <Tag label={t("quiz.eyebrow")} />
            <Text variant="label" className="text-muted-foreground">
              {t("quiz.step", { current: step + 1, total: 3 })}
            </Text>
          </View>

          {step === 0 ? (
            <View className="gap-3">
              <Text variant="title">{t("quiz.goalQ")}</Text>
              <View className="gap-2.5">
                {GOALS.map((g) => (
                  <Choice
                    key={g}
                    label={t(`quiz.goal.${g}`)}
                    selected={goal === g}
                    onPress={() => setGoal(g)}
                  />
                ))}
              </View>
            </View>
          ) : null}

          {step === 1 ? (
            <View className="gap-3">
              <Text variant="title">{t("quiz.whyQ")}</Text>
              <Input
                value={why}
                onChangeText={setWhy}
                placeholder={t("quiz.whyPlaceholder")}
                autoFocus
                returnKeyType="done"
              />
              <Text variant="caption" className="text-muted">
                {t("quiz.whyHint")}
              </Text>
            </View>
          ) : null}

          {step === 2 ? (
            <View className="gap-3">
              <Text variant="title">{t("quiz.blockerQ")}</Text>
              <View className="gap-2.5">
                {BLOCKERS.map((b) => (
                  <Choice
                    key={b}
                    label={t(`quiz.blocker.${b}`)}
                    selected={blocker === b}
                    onPress={() => setBlocker(b)}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </View>

        <Button
          label={step < 2 ? t("quiz.next") : t("quiz.finish")}
          onPress={advance}
          disabled={!canAdvance}
        />
      </View>
    </Screen>
  );
}
