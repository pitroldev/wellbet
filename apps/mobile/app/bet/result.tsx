/**
 * Desfecho da aposta — o CLÍMAX. Deu green = celebração FORTE (badge com glow +
 * som win.wav + háptico + confete + o prêmio subindo em count-up de R$ 0). Não
 * bateu = sóbrio e honesto, com caminho pra frente. Lê o journey store.
 */
import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";

import { Button, Screen, Tag, Text } from "@/shared/ui";
import { Confetti, RewardBadge } from "@/features/reward";
import { AnimatedNumber, formatMoney, useJourney } from "@/features/journey";

const WIN_SOUND = require("../../assets/audio/win.wav");

export default function BetResult() {
  const router = useRouter();
  const { t } = useTranslation();
  const s = useJourney();

  const won = s.betPhase === "won";
  const stake = s.bet?.stakeAmount ?? 0;
  const bonus = Math.round(stake * 0.3); // demo: fatia do bolo
  const total = stake + bonus;
  const winSound = useAudioPlayer(WIN_SOUND);

  useEffect(() => {
    if (!won) return;
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    winSound.seekTo(0);
    winSound.play();
  }, [won, winSound]);

  const actions = (
    <View className="gap-3">
      <Button
        label={t("journey.settlement.again")}
        onPress={() => {
          s.newRound();
          router.replace("/bet/new");
        }}
      />
      <Button
        label={t("journey.settlement.home")}
        tone="secondary"
        onPress={() => {
          s.newRound();
          router.replace("/");
        }}
      />
    </View>
  );

  if (won) {
    return (
      <Screen animateIn={false}>
        <View className="flex-1 justify-between py-4">
          <View className="flex-1 items-center justify-center gap-3">
            <RewardBadge label={t("journey.settlement.wonTitle")} size={190} />
            <Text variant="label" className="text-arena-green">
              você recebe
            </Text>
            <AnimatedNumber
              value={total}
              prefix="R$ "
              mountFrom={0}
              durationMs={1100}
              variant="numeric"
              className="text-5xl text-arena-green"
            />
            <Text variant="body" className="text-center">
              {t("journey.settlement.wonBody", {
                stake: formatMoney(stake),
                bonus: formatMoney(bonus),
              })}
            </Text>
            <Text variant="caption" className="text-center text-muted">
              {t("journey.settlement.wonSource")}
            </Text>
          </View>
          {actions}
        </View>
        <Confetti onFinish={() => {}} />
      </Screen>
    );
  }

  return (
    <Screen animateIn={false}>
      <View className="flex-1 justify-between py-4">
        <View className="flex-1 justify-center gap-4">
          <Tag label="Resultado" tone="ink" />
          <Text variant="title">{t("journey.settlement.lostTitle")}</Text>
          <Text variant="body">
            {t("journey.settlement.lostBody", { stake: formatMoney(stake) })}
          </Text>
          <Text variant="caption" className="text-muted">
            {t("journey.settlement.lostKind")}
          </Text>
        </View>
        {actions}
      </View>
    </Screen>
  );
}
