/**
 * Onboarding passo 5 — a meta vira BRINQUEDO SÉRIO: régua tátil pros kg a perder,
 * prazo em chips e um medidor de RITMO (PaceGauge) vivo em kg/semana.
 *
 * Régua de plausibilidade IGUAL à da landing (RITMO_MAX = 1 kg/semana): meta que
 * estoura o ritmo sobe o prazo SOZINHA pro mínimo saudável — com aviso e háptico
 * de alerta (treinador durão não deixa meta insalubre passar batido). Prazos
 * curtos demais pra meta atual ficam indisponíveis (paridade com a landing).
 *
 * Guarda o MESMO rascunho de sempre (meta + prazo); o valor apostado entra no
 * passo 6 (odds).
 */
import { useState } from "react";
import { ScrollView, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useReducedMotion } from "@/shared/motion";
import { Button, Card, Chip, Screen, Tag, Text } from "@/shared/ui";
import { arena } from "@/theme/tokens";
import { AnimatedNumber, formatKg, useJourney } from "@/features/journey";
import { PaceGauge, SnapRuler } from "@/features/onboarding/components";

const DURATIONS = [4, 8, 12];
const DEFAULT_STAKE = 100;

// Régua da meta. majorEvery 6 (= 3 kg por rótulo) deixa TODOS os rótulos
// inteiros (1, 4, 7, …, 28) — com 5, metade cairia em x,5 e a fita leria quebrada.
const LOSS_RULER = { min: 1, max: 30, step: 0.5, majorEvery: 6 } as const;
// Ritmo máximo saudável — a MESMA régua da landing (RITMO_MAX_KG_SEMANA = 1).
const HEALTHY_KG_WEEK = 1;
// Sugestão de partida: ~5% do peso (assusta um pouquinho, mas dá pra bater).
const SUGGESTED_PCT = 0.05;

/** Menor prazo do domínio em que a meta cabe num ritmo saudável (paridade landing). */
function minHealthyWeeks(lossKg: number): number {
  return DURATIONS.find((w) => lossKg / w <= HEALTHY_KG_WEEK) ?? Math.max(...DURATIONS);
}

/** Snap de um valor arbitrário pra grade da régua (clampado no range). */
function snapLoss(v: number): number {
  const clamped = Math.min(LOSS_RULER.max, Math.max(LOSS_RULER.min, v));
  const idx = Math.round((clamped - LOSS_RULER.min) / LOSS_RULER.step);
  return Math.round((LOSS_RULER.min + idx * LOSS_RULER.step) * 10) / 10;
}

export default function Goal() {
  const router = useRouter();
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const baseline = useJourney((s) => s.baselineWeightKg ?? 0);
  const existing = useJourney((s) => s.betDraft);
  const setBetDraft = useJourney((s) => s.setBetDraft);

  // Partida: rascunho existente, senão a sugestão de ~5% (sempre na grade).
  const initialLoss = snapLoss(
    existing != null
      ? baseline - existing.targetWeightKg
      : baseline > 0
        ? baseline * SUGGESTED_PCT
        : 5,
  );
  const [lossKg, setLossKg] = useState(initialLoss);
  // O prazo nunca nasce agressivo: rascunho antigo sobe pro mínimo saudável.
  const [weeks, setWeeks] = useState(() =>
    Math.max(existing?.weeks ?? 8, minHealthyWeeks(initialLoss)),
  );
  // Rascunho existente = escolha da pessoa; numeral já nasce colado no gesto.
  const [touched, setTouched] = useState(existing != null);
  const [adjusted, setAdjusted] = useState(false);

  // MESMA validação de antes (só mudou a mão): ≥3% do peso e <50%.
  const lossOk = lossKg >= baseline * 0.03 && lossKg < baseline * 0.5;
  const targetKg = baseline - lossKg;
  const pace = lossKg / weeks;
  const aggressive = pace > HEALTHY_KG_WEEK;
  const minWeeks = minHealthyWeeks(lossKg);

  // Entrada decorativa dos blocos — corte seco com reduce-motion.
  const enter = (delayMs: number) =>
    reduced ? undefined : FadeInDown.duration(420).delay(delayMs);

  function handleLoss(v: number) {
    const minW = minHealthyWeeks(v);
    if (minW > weeks) {
      // Estourou o ritmo e HÁ prazo maior no domínio: ajusta sozinho + avisa
      // (um warning por cruzamento — o bump devolve o ritmo pra zona saudável).
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setWeeks(minW);
      setAdjusted(true);
    } else if (v / weeks > HEALTHY_KG_WEEK && lossKg / weeks <= HEALTHY_KG_WEEK) {
      // Cruzou pra zona agressiva SEM prazo pra subir (meta > 12 kg): avisa 1x;
      // o medidor fica no vermelho dizendo a verdade.
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setLossKg(v);
    if (!touched) setTouched(true);
  }

  function pickWeeks(w: number) {
    setWeeks(w);
    setAdjusted(false); // escolha manual de prazo dispensa o aviso (paridade landing)
  }

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
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 24, paddingTop: 8 }}>
          <View className="gap-2">
            <Tag label={t("onboarding.goal.eyebrow")} />
            <Text variant="title">{t("onboarding.goal.title")}</Text>
            <Text variant="body" className="text-muted">
              {t("onboarding.goal.body")}
            </Text>
          </View>

          {/* A META — numeral gigante colado na régua tátil. O numeral fica fora
              da acessibilidade: quem fala o valor é a régua (accessibilityValue). */}
          <Animated.View entering={enter(60)} className="gap-2">
            <Text variant="label">{t("onboarding.goal.lossLabel")}</Text>
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              className="flex-row items-end justify-center gap-1.5"
            >
              <AnimatedNumber
                value={Math.trunc(lossKg)}
                suffix={`,${Math.round((lossKg - Math.trunc(lossKg)) * 10)}`}
                mountFrom={touched ? undefined : 0}
                durationMs={touched ? 0 : 650}
                variant="numeric"
                className="text-[52px] leading-[58px]"
              />
              <Text variant="mono" className="pb-2.5 text-sm text-muted-foreground">
                {t("onboarding.measures.unitKg")}
              </Text>
            </View>
            <SnapRuler
              min={LOSS_RULER.min}
              max={LOSS_RULER.max}
              step={LOSS_RULER.step}
              majorEvery={LOSS_RULER.majorEvery}
              value={lossKg}
              onChange={handleLoss}
              unitLabel={t("onboarding.measures.unitKg")}
            />
            <Text
              variant="caption"
              className={`text-center ${lossOk ? "text-arena-cyan" : "text-danger"}`}
            >
              {lossOk
                ? t("onboarding.goal.target", { kg: formatKg(targetKg) })
                : t("onboarding.goal.invalid")}
            </Text>
          </Animated.View>

          {/* O PRAZO — chips; curto demais pra meta atual fica indisponível */}
          <Animated.View entering={enter(140)} className="gap-2.5">
            <Text variant="label">{t("onboarding.goal.durationLabel")}</Text>
            <View className="flex-row gap-2.5">
              {DURATIONS.map((w) => {
                const tooShort = w < minWeeks;
                return (
                  <View
                    key={w}
                    pointerEvents={tooShort ? "none" : "auto"}
                    accessibilityElementsHidden={tooShort}
                    importantForAccessibility={tooShort ? "no-hide-descendants" : "auto"}
                    style={{ opacity: tooShort ? 0.35 : 1 }}
                  >
                    <Chip
                      label={t("onboarding.goal.weeks", { n: w })}
                      selected={weeks === w}
                      onPress={() => pickWeeks(w)}
                    />
                  </View>
                );
              })}
            </View>
            {adjusted ? (
              <Animated.View
                entering={enter(0)}
                accessibilityLiveRegion="polite"
                className="flex-row items-center gap-2"
              >
                <Feather name="info" size={14} color={arena.cyan} />
                <Text variant="caption" className="flex-1 text-arena-cyan">
                  {t("onboarding.goal.pace.adjusted")}
                </Text>
              </Animated.View>
            ) : null}
          </Animated.View>

          {/* O RITMO — medidor vivo em kg/semana; zona saudável em ciano (verde é
              SÓ vitória), agressiva em danger. */}
          <Animated.View entering={enter(220)}>
            <Card className="flex-row items-center gap-5">
              <PaceGauge kgPerWeek={pace} healthyMax={HEALTHY_KG_WEEK} />
              <View className="flex-1 gap-1">
                <Text variant="label">{t("onboarding.goal.pace.label")}</Text>
                <Text
                  variant="mono"
                  className={`text-lg ${aggressive ? "text-danger" : "text-arena-cyan"}`}
                >
                  {t("onboarding.goal.pace.perWeek", { kg: formatKg(pace) })}
                </Text>
                {!aggressive ? (
                  <Text variant="caption" className="text-muted-foreground">
                    {t("onboarding.goal.pace.healthy")}
                  </Text>
                ) : (
                  // Caso sem saída (meta > ritmo mesmo no prazo máximo): nomeia a
                  // verdade em texto — o gauge no vermelho não fala sozinho.
                  <Text variant="caption" className="text-danger">
                    {t("onboarding.goal.pace.aggressive")}
                  </Text>
                )}
              </View>
            </Card>
          </Animated.View>
        </ScrollView>
        <Button label={t("onboarding.goal.cta")} icon="arrow-right" onPress={next} disabled={!lossOk} />
      </View>
    </Screen>
  );
}
