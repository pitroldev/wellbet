/**
 * Onboarding passo 5 — quanto perder + prazo. Guarda o rascunho da aposta (meta +
 * prazo); o valor apostado entra no passo 6 (odds).
 */
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Chip, Input, Screen, Tag, Text } from "@/shared/ui";
import { formatKg, useJourney } from "@/features/journey";

const DURATIONS = [4, 8, 12];
const DEFAULT_STAKE = 100;

export default function Goal() {
  const router = useRouter();
  const { t } = useTranslation();
  const baseline = useJourney((s) => s.baselineWeightKg ?? 0);
  const existing = useJourney((s) => s.betDraft);
  const setBetDraft = useJourney((s) => s.setBetDraft);

  const [lossRaw, setLossRaw] = useState("");
  const [weeks, setWeeks] = useState(existing?.weeks ?? 8);

  const lossKg = parseFloat(lossRaw.replace(",", "."));
  const lossOk = Number.isFinite(lossKg) && lossKg >= baseline * 0.03 && lossKg < baseline * 0.5;
  const targetKg = Number.isFinite(lossKg) ? baseline - lossKg : 0;

  function next() {
    if (!lossOk) return;
    setBetDraft({
      targetWeightKg: targetKg,
      weeks,
      stakeAmount: existing?.stakeAmount ?? DEFAULT_STAKE,
    });
    router.push("/(onboarding)/odds");
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 22, paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-2">
            <Tag label={t("onboarding.goal.eyebrow")} />
            <Text variant="title">{t("onboarding.goal.title")}</Text>
            <Text variant="body" className="text-muted">
              {t("onboarding.goal.body")}
            </Text>
          </View>

          <View className="gap-2">
            <Input
              label={t("onboarding.goal.lossLabel")}
              value={lossRaw}
              onChangeText={setLossRaw}
              keyboardType="decimal-pad"
              placeholder={t("onboarding.goal.lossPlaceholder")}
              autoFocus
            />
            {lossOk ? (
              <Text variant="caption" className="text-arena-mint">
                {t("onboarding.goal.target", { kg: formatKg(targetKg) })}
              </Text>
            ) : lossRaw.length > 0 ? (
              <Text variant="caption" className="text-danger">
                {t("onboarding.goal.invalid")}
              </Text>
            ) : null}
          </View>

          <View className="gap-2.5">
            <Text variant="label">{t("onboarding.goal.durationLabel")}</Text>
            <View className="flex-row gap-2.5">
              {DURATIONS.map((w) => (
                <Chip
                  key={w}
                  label={t("onboarding.goal.weeks", { n: w })}
                  selected={weeks === w}
                  onPress={() => setWeeks(w)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
        <Button label={t("onboarding.goal.cta")} icon="arrow-right" onPress={next} disabled={!lossOk} />
      </View>
    </Screen>
  );
}
