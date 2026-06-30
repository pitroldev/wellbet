/**
 * Onboarding passo 6 — o GANCHO, na voz do manual. Escolhe o valor e vê o que está
 * em jogo: **o valor de volta + a fatia do bolo** se bater a meta. Honesto (Manual
 * §5.4): SEM cotação/multiplicador inventado; a recompensa **varia com o bolo** — e
 * a gente diz isso. Quanto mais dura a meta, maior a fatia (em palavras, não número).
 * CTA → criar conta.
 */
import { useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Card, Chip, Screen, Tag, Text } from "@/shared/ui";
import { arena } from "@/theme/tokens";
import { AnimatedNumber, challengePace, formatMoney, useJourney } from "@/features/journey";

const STAKES = [50, 100, 200, 500];

export default function Odds() {
  const router = useRouter();
  const { t } = useTranslation();
  const baseline = useJourney((s) => s.baselineWeightKg ?? 0);
  const draft = useJourney((s) => s.betDraft);
  const setBetDraft = useJourney((s) => s.setBetDraft);

  const [stake, setStake] = useState(draft?.stakeAmount ?? 100);

  if (draft == null) return <Redirect href="/(onboarding)/goal" />;

  // Só o ritmo/dificuldade é usado na UI (em palavras) — sem multiplicador exibido.
  const { weeklyPct, aggressive } = challengePace(baseline, draft.targetWeightKg, draft.weeks);

  function confirm() {
    if (draft == null) return;
    setBetDraft({ ...draft, stakeAmount: stake });
    router.push("/(onboarding)/account");
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingTop: 8 }}>
          <View className="items-center gap-2">
            <Tag label={t("onboarding.odds.eyebrow")} align="center" />
            <Text variant="title" className="text-center">
              {t("onboarding.odds.title")}
            </Text>
          </View>

          {/* O que está em jogo: valor de volta + fatia do bolo (que varia). */}
          <Animated.View entering={FadeInDown.duration(450)}>
            <Card glow className="items-center gap-1 py-7">
              <AnimatedNumber
                value={stake}
                prefix="R$ "
                mountFrom={0}
                durationMs={700}
                variant="display"
                className="text-[56px] text-foreground"
              />
              <Text variant="label">{t("onboarding.odds.back")}</Text>
              <View className="mt-3 flex-row items-center gap-2">
                <Feather name="gift" size={16} color={arena.green} />
                <Text variant="heading" className="text-lg text-arena-mint">
                  {t("onboarding.odds.slice")}
                </Text>
              </View>
              <Text variant="caption" className="mt-1 text-center text-muted-foreground">
                {t("onboarding.odds.varies")}
              </Text>
            </Card>
          </Animated.View>

          {/* valor da aposta */}
          <View className="gap-2.5">
            <Text variant="label">{t("onboarding.odds.stakeLabel")}</Text>
            <View className="flex-row flex-wrap gap-2.5">
              {STAKES.map((v) => (
                <Chip key={v} label={formatMoney(v)} selected={stake === v} onPress={() => setStake(v)} />
              ))}
            </View>
          </View>

          {/* dificuldade em palavras (não número) + honestidade */}
          <View className="gap-2.5">
            <View className="flex-row items-center gap-2">
              <Feather
                name={aggressive ? "alert-triangle" : "activity"}
                size={14}
                color={aggressive ? arena.danger : arena.green}
              />
              <Text variant="caption" className="flex-1">
                {t("onboarding.odds.pace", { pct: weeklyPct.toFixed(1).replace(".", ",") })}
                {" · "}
                {aggressive ? t("onboarding.odds.strong") : t("onboarding.odds.steady")}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Feather name="shield" size={14} color={arena.fogMute} />
              <Text variant="caption" className="flex-1 text-muted-foreground">
                {t("onboarding.odds.honest")}
              </Text>
            </View>
          </View>
        </ScrollView>
        <Button label={t("onboarding.odds.cta")} icon="zap" onPress={confirm} />
      </View>
    </Screen>
  );
}
