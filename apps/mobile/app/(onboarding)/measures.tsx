/**
 * Onboarding passo 4 — peso + altura viram GESTO: duas réguas táteis (SnapRuler)
 * com numeral gigante colado no dedo e IMC ao vivo. Vira o baseline (ainda NÃO
 * revisado: a prova em vídeo vem no fim) + alimenta o cálculo do prêmio.
 *
 * MESMOS writes de antes (setMeasures no CTA). O CTA só libera depois que a
 * pessoa MEXEU nas duas réguas — número default não é dado real (paridade com o
 * formulário antigo, que exigia digitar). Voltando com medidas guardadas, as
 * réguas partem delas e o CTA já nasce liberado.
 */
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useReducedMotion } from "@/shared/motion";
import { Button, Screen, Tag, Text } from "@/shared/ui";
import { arena } from "@/theme/tokens";
import { AnimatedNumber, bmi, useJourney } from "@/features/journey";
import { SnapRuler } from "@/features/onboarding/components";

// ——— Domínio das réguas (dentro da validação antiga: 30<peso<400, 100<altura<250) ———
const WEIGHT_RULER = { min: 40, max: 200, step: 0.5, majorEvery: 10 } as const;
const HEIGHT_RULER = { min: 140, max: 210, step: 1, majorEvery: 10 } as const;
// Agulha de partida quando não há medida guardada (default neutro ≠ dado real).
const DEFAULT_WEIGHT_KG = 70;
const DEFAULT_HEIGHT_CM = 170;

/** Snap de um valor arbitrário pra grade da régua (clampado no range). */
function snapToRuler(v: number, r: { min: number; max: number; step: number }): number {
  const idx = Math.round((Math.min(r.max, Math.max(r.min, v)) - r.min) / r.step);
  return Math.round((r.min + idx * r.step) * 10) / 10;
}

/**
 * Numeral gigante da régua — inteiro via AnimatedNumber; a casa decimal viaja no
 * `suffix` (mesmo Text, mesma fonte), com vírgula (mesma régua do formatKg da
 * home). Antes do 1º toque conta do zero até o default (reveal); depois fica
 * COLADO no gesto (durationMs 0 — manipulação direta não tolera atraso). Fica
 * fora da árvore de acessibilidade: quem fala o valor é a régua
 * (accessibilityValue) — aqui é espetáculo.
 */
function GiantValue({
  value,
  decimal,
  unit,
  glued,
}: {
  value: number;
  decimal: boolean;
  unit: string;
  glued: boolean;
}) {
  const int = Math.trunc(value);
  const frac = Math.round((value - int) * 10);
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="flex-row items-end justify-center gap-1.5"
    >
      <AnimatedNumber
        value={int}
        suffix={decimal ? `,${frac}` : ""}
        mountFrom={glued ? undefined : 0}
        durationMs={glued ? 0 : 650}
        variant="numeric"
        className="text-[44px] leading-[50px]"
      />
      <Text variant="mono" className="pb-2 text-sm text-muted-foreground">
        {unit}
      </Text>
    </View>
  );
}

/** Convite discreto ao gesto — some no primeiro arrasto. */
function RulerHint({ label }: { label: string }) {
  return (
    <View className="flex-row items-center justify-center gap-1.5">
      <Feather name="chevrons-left" size={13} color={arena.fogMute} />
      <Text variant="caption" className="text-xs text-muted-foreground">
        {label}
      </Text>
      <Feather name="chevrons-right" size={13} color={arena.fogMute} />
    </View>
  );
}

export default function Measures() {
  const router = useRouter();
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const setMeasures = useJourney((s) => s.setMeasures);
  const savedWeight = useJourney((s) => s.baselineWeightKg);
  const savedHeight = useJourney((s) => s.heightCm);

  const [weight, setWeight] = useState(() =>
    snapToRuler(savedWeight ?? DEFAULT_WEIGHT_KG, WEIGHT_RULER),
  );
  const [height, setHeight] = useState(() =>
    snapToRuler(savedHeight ?? DEFAULT_HEIGHT_CM, HEIGHT_RULER),
  );
  // "Tocou" = o número é da pessoa (medida guardada conta como dado real).
  const [weightTouched, setWeightTouched] = useState(savedWeight != null);
  const [heightTouched, setHeightTouched] = useState(savedHeight != null);

  const ready = weightTouched && heightTouched;
  const bmiVal = ready ? bmi(weight, height) : 0;

  // Entrada decorativa dos blocos — corte seco com reduce-motion.
  const enter = (delayMs: number) =>
    reduced ? undefined : FadeInDown.duration(420).delay(delayMs);

  function handleWeight(v: number) {
    setWeight(v);
    if (!weightTouched) setWeightTouched(true);
  }

  function handleHeight(v: number) {
    setHeight(v);
    if (!heightTouched) setHeightTouched(true);
  }

  function next() {
    if (!ready) return;
    setMeasures(weight, height);
    router.push("/(onboarding)/goal");
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 26, paddingTop: 8 }}>
          <View className="gap-2">
            <Tag label={t("onboarding.measures.eyebrow")} />
            <Text variant="title">{t("onboarding.measures.title")}</Text>
            <Text variant="body" className="text-muted">
              {t("onboarding.measures.body")}
            </Text>
          </View>

          {/* PESO — a balança na mão: numeral gigante + régua tátil */}
          <Animated.View entering={enter(60)} className="gap-2">
            <Text variant="label">{t("onboarding.measures.weightLabel")}</Text>
            <GiantValue value={weight} decimal unit={t("onboarding.measures.unitKg")} glued={weightTouched} />
            <SnapRuler
              min={WEIGHT_RULER.min}
              max={WEIGHT_RULER.max}
              step={WEIGHT_RULER.step}
              majorEvery={WEIGHT_RULER.majorEvery}
              value={weight}
              onChange={handleWeight}
              unitLabel={t("onboarding.measures.unitKg")}
            />
            {!weightTouched ? <RulerHint label={t("onboarding.measures.rulerHint")} /> : null}
          </Animated.View>

          {/* ALTURA — mesma mão, passo inteiro */}
          <Animated.View entering={enter(140)} className="gap-2">
            <Text variant="label">{t("onboarding.measures.heightLabel")}</Text>
            <GiantValue value={height} decimal={false} unit={t("onboarding.measures.unitCm")} glued={heightTouched} />
            <SnapRuler
              min={HEIGHT_RULER.min}
              max={HEIGHT_RULER.max}
              step={HEIGHT_RULER.step}
              majorEvery={HEIGHT_RULER.majorEvery}
              value={height}
              onChange={handleHeight}
              unitLabel={t("onboarding.measures.unitCm")}
            />
            {weightTouched && !heightTouched ? (
              <Animated.View entering={enter(0)}>
                <RulerHint label={t("onboarding.measures.rulerHint")} />
              </Animated.View>
            ) : null}
          </Animated.View>

          {/* IMC ao vivo — aparece quando as DUAS medidas são da pessoa */}
          {ready ? (
            <Animated.View
              entering={enter(0)}
              className="flex-row items-center justify-center gap-2"
            >
              <Feather name="activity" size={14} color={arena.fogMute} />
              <Text variant="caption" className="text-muted-foreground">
                {t("onboarding.measures.bmi", { value: bmiVal.toFixed(1).replace(".", ",") })}
              </Text>
            </Animated.View>
          ) : null}
        </ScrollView>
        <Button label={t("onboarding.measures.cta")} icon="arrow-right" onPress={next} disabled={!ready} />
      </View>
    </Screen>
  );
}
