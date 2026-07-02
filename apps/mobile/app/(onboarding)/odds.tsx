/**
 * Onboarding passo 6 — o GANCHO e o AHA da jornada. Escolhe o valor e VÊ, num
 * diagrama vivo (BoloFlow), de onde vem o prêmio: **o valor de volta + a fatia
 * do bolo** de quem desistiu. Honesto (Manual §5.4): SEM cotação/multiplicador
 * inventado; a recompensa **varia com o bolo** — e a gente diz isso. Quanto mais
 * dura a meta, maior a fatia (em palavras, não número). SEM verde: apostar não é
 * vitória — o deleite aqui é ENTENDER o mecanismo vendo ele funcionar.
 * CTA → criar conta.
 */
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Redirect, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { useReducedMotion } from "@/shared/motion";
import { Button, Card, Chip, Screen, Tag, Text } from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";
import { AnimatedNumber, challengePace, formatMoney, useJourney } from "@/features/journey";
import { BoloFlow } from "@/features/onboarding/components";

const STAKES = [50, 100, 200, 500];
/** Espelha o CYCLE_MS interno do BoloFlow — 1 volta completa do diagrama. */
const BOLO_CYCLE_MS = 6000;

export default function Odds() {
  const router = useRouter();
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const baseline = useJourney((s) => s.baselineWeightKg ?? 0);
  const draft = useJourney((s) => s.betDraft);
  const setBetDraft = useJourney((s) => s.setBetDraft);

  const [stake, setStake] = useState(draft?.stakeAmount ?? 100);

  // Timer do pulso tátil pós-troca de stake. Vive num ref (não é estado de
  // render); limpo no unmount pra nunca vibrar fora desta tela.
  const cycleHaptic = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const timer = cycleHaptic;
    return () => {
      if (timer.current != null) clearTimeout(timer.current);
    };
  }, []);

  if (draft == null) return <Redirect href="/(onboarding)/goal" />;

  // Só o ritmo/dificuldade é usado na UI (em palavras) — sem multiplicador exibido.
  const { weeklyPct, aggressive } = challengePace(baseline, draft.targetWeightKg, draft.weeks);

  /**
   * Troca o stake: o número re-anima (AnimatedNumber) e o BoloFlow reage (mais
   * moedas no bolo). Quando o diagrama fecha o PRIMEIRO ciclo completo após a
   * troca (~6s), um impacto leve "assenta" a escolha — throttled: re-trocar
   * reinicia o timer, então é no máximo 1 pulso por mudança. Com reduce-motion
   * o diagrama é estático (nenhum ciclo roda), então nenhum pulso é agendado.
   */
  function selectStake(v: number) {
    if (v === stake) return;
    setStake(v);
    if (cycleHaptic.current != null) clearTimeout(cycleHaptic.current);
    if (!reduced) {
      cycleHaptic.current = setTimeout(() => {
        cycleHaptic.current = null;
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, BOLO_CYCLE_MS);
    }
  }

  function confirm() {
    if (draft == null) return;
    // Navegar empilha a tela (odds segue montada) — cancela o pulso pendente.
    if (cycleHaptic.current != null) {
      clearTimeout(cycleHaptic.current);
      cycleHaptic.current = null;
    }
    setBetDraft({ ...draft, stakeAmount: stake });
    router.push("/(onboarding)/account");
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 20, paddingTop: 8 }}>
          {/* (1) o gancho, nomeado */}
          <Animated.View entering={FadeInDown.duration(450)} className="items-center gap-2">
            <Tag label={t("onboarding.odds.eyebrow")} align="center" />
            <Text variant="title" className="text-center">
              {t("onboarding.odds.title")}
            </Text>
          </Animated.View>

          {/* (2) CARD-HERÓI do aha: o valor de volta + a fatia, e o diagrama VIVO
              de onde vem o prêmio (a moeda 3D saiu — o BoloFlow é o herói agora,
              e o pote com glow já é a presença física do bolo). */}
          <Animated.View entering={FadeInDown.delay(90).duration(450)}>
            <Card glow className="items-center gap-1 pb-5 pt-7">
              <AnimatedNumber
                value={stake}
                prefix="R$ "
                mountFrom={0}
                durationMs={700}
                variant="display"
                className="text-[56px] text-foreground"
              />
              <Text variant="label">{t("onboarding.odds.bolo.back")}</Text>
              <Text variant="heading" className="text-lg text-arena-violet-soft">
                {t("onboarding.odds.bolo.slice")}
              </Text>

              <View
                className="mt-4 w-full"
                style={{ height: 1, backgroundColor: arenaAlpha.hairline }}
              />

              {/* o mecanismo, visto funcionando: quem desistiu → o bolo → você */}
              <Text variant="label" className="mt-4">
                {t("onboarding.odds.bolo.title")}
              </Text>
              <BoloFlow
                stake={stake}
                labelLeft={t("onboarding.odds.bolo.left")}
                labelPot={t("onboarding.odds.bolo.pot")}
                labelRight={t("onboarding.odds.bolo.right")}
                style={{ alignSelf: "stretch", marginTop: 2 }}
              />
              <Text variant="caption" className="text-center">
                {t("onboarding.odds.bolo.note")}
              </Text>
            </Card>
          </Animated.View>

          {/* (3) valor da aposta — trocar re-anima o número e o diagrama */}
          <Animated.View entering={FadeInDown.delay(180).duration(450)} className="gap-2.5">
            <Text variant="label">{t("onboarding.odds.stakeLabel")}</Text>
            <View className="flex-row flex-wrap gap-2.5">
              {STAKES.map((v) => (
                <Chip
                  key={v}
                  label={formatMoney(v)}
                  selected={stake === v}
                  onPress={() => selectStake(v)}
                />
              ))}
            </View>
          </Animated.View>

          {/* (4) dificuldade em palavras (não número) + honestidade */}
          <Animated.View entering={FadeInDown.delay(260).duration(450)} className="gap-2.5">
            <View className="flex-row items-center gap-2">
              <Feather
                name={aggressive ? "alert-triangle" : "activity"}
                size={14}
                color={aggressive ? arena.danger : arena.cyan}
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
                {t("onboarding.odds.varies")}
              </Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* (5) CTA — topar o desafio */}
        <Button label={t("onboarding.odds.cta")} icon="zap" onPress={confirm} />
      </View>
    </Screen>
  );
}
