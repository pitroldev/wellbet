/**
 * Onboarding passo 4 — peso + altura. Vira o baseline (ainda NÃO revisado: a prova
 * em vídeo vem no fim) + alimenta o IMC e o cálculo do prêmio.
 */
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, Screen, Tag, Text } from "@/shared/ui";
import { bmi, useJourney } from "@/features/journey";

export default function Measures() {
  const router = useRouter();
  const { t } = useTranslation();
  const setMeasures = useJourney((s) => s.setMeasures);

  const [weightRaw, setWeightRaw] = useState("");
  const [heightRaw, setHeightRaw] = useState("");

  const weight = parseFloat(weightRaw.replace(",", "."));
  const height = parseFloat(heightRaw.replace(",", "."));
  const weightOk = Number.isFinite(weight) && weight > 30 && weight < 400;
  const heightOk = Number.isFinite(height) && height > 100 && height < 250;
  const valid = weightOk && heightOk;
  const bmiVal = valid ? bmi(weight, height) : 0;

  function next() {
    if (!valid) return;
    setMeasures(weight, height);
    router.push("/(onboarding)/goal");
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20, paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-2">
            <Tag label={t("onboarding.measures.eyebrow")} />
            <Text variant="title">{t("onboarding.measures.title")}</Text>
            <Text variant="body" className="text-muted">
              {t("onboarding.measures.body")}
            </Text>
          </View>

          <Input
            label={t("onboarding.measures.weightLabel")}
            value={weightRaw}
            onChangeText={setWeightRaw}
            keyboardType="decimal-pad"
            placeholder={t("onboarding.measures.weightPlaceholder")}
            autoFocus
          />
          <Input
            label={t("onboarding.measures.heightLabel")}
            value={heightRaw}
            onChangeText={setHeightRaw}
            keyboardType="number-pad"
            placeholder={t("onboarding.measures.heightPlaceholder")}
          />
          {bmiVal > 0 ? (
            <Text variant="caption" className="text-muted-foreground">
              {t("onboarding.measures.bmi", { value: bmiVal.toFixed(1).replace(".", ",") })}
            </Text>
          ) : null}
        </ScrollView>
        <Button label={t("onboarding.measures.cta")} icon="arrow-right" onPress={next} disabled={!valid} />
      </View>
    </Screen>
  );
}
