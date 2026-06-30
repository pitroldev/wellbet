/**
 * Montar a aposta (o BILHETE VIVO). Ancorado no baseline verificado (pesar→pagar).
 *
 * Cria a aposta local (betPhase=payment) e VOLTA PRA HOME — daí a home orquestra o
 * commitment: se ainda não há conta, pede a conta (compromisso antes do dinheiro);
 * só depois o Pix (`bet/pay`). O placeBet real (com sessão) é a próxima costura.
 */
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Card, Chip, Input, Screen, Tag, Text } from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";
import { formatKg, formatMoney, useJourney } from "@/features/journey";

const WEEK_MS = 7 * 86_400_000;
const DURATIONS = [4, 8, 12];

function Outcome({ ok, text }: { ok: boolean; text: string }) {
  return (
    <View className="flex-row items-center gap-3">
      <View
        style={{ backgroundColor: ok ? arenaAlpha.greenWash : arenaAlpha.glass }}
        className="h-8 w-8 items-center justify-center rounded-full border border-arena-hairline"
      >
        <Feather name={ok ? "check" : "x"} size={16} color={ok ? arena.green : arena.fogMute} />
      </View>
      <Text variant="body" className="flex-1">
        {text}
      </Text>
    </View>
  );
}

export default function NewBet() {
  const router = useRouter();
  const { t } = useTranslation();
  const s = useJourney();

  const baseline = s.baselineWeightKg ?? 0;
  const [target, setTarget] = useState("");
  const [weeks, setWeeks] = useState(8);
  const [stakeStr, setStakeStr] = useState("");

  const targetKg = parseFloat(target.replace(",", "."));
  const stake = parseFloat(stakeStr.replace(",", "."));
  const lossKg = baseline - targetKg;
  const targetValid = Number.isFinite(targetKg) && targetKg > 30 && lossKg >= baseline * 0.03;
  const stakeValid = Number.isFinite(stake) && stake >= 20;
  const valid = targetValid && stakeValid;

  function submit() {
    if (!valid) return;
    s.createBet({
      startWeightKg: baseline,
      targetWeightKg: targetKg,
      stakeAmount: stake,
      deadlineAt: Date.now() + weeks * WEEK_MS,
    });
    router.replace("/"); // a home decide o próximo passo: conta (se faltar) → Pix
  }

  return (
    <Screen>
      <View className="flex-1 py-4">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 22 }}>
          <View className="gap-2">
            <Tag label={t("journey.bilhete.eyebrow")} />
            <Text variant="title">{t("journey.bilhete.title")}</Text>
            <Text className="font-mono text-sm text-muted-foreground">
              {t("journey.bilhete.anchored", { weight: formatKg(baseline) })}
            </Text>
          </View>

          <Input
            label={t("journey.bilhete.targetLabel")}
            value={target}
            onChangeText={setTarget}
            keyboardType="decimal-pad"
            placeholder={formatKg(Math.max(30, baseline - 6))}
          />

          <View className="gap-2.5">
            <Text variant="label">{t("journey.bilhete.durationLabel")}</Text>
            <View className="flex-row gap-2.5">
              {DURATIONS.map((w) => (
                <Chip
                  key={w}
                  label={t("journey.bilhete.weeks", { n: w })}
                  selected={weeks === w}
                  onPress={() => setWeeks(w)}
                />
              ))}
            </View>
          </View>

          <View className="gap-2.5">
            <Input
              label={t("journey.bilhete.stakeLabel")}
              value={stakeStr}
              onChangeText={setStakeStr}
              keyboardType="decimal-pad"
              placeholder="200"
            />
            <Text variant="caption" className="text-muted">
              {t("journey.bilhete.stakeHint")}
            </Text>
          </View>

          <Card glow>
            <View className="gap-3.5">
              <Outcome ok text={t("journey.bilhete.hit")} />
              <Outcome ok={false} text={t("journey.bilhete.miss")} />
            </View>
          </Card>
        </ScrollView>

        <View className="pt-3">
          <Button
            label={t("journey.bilhete.cta", { money: formatMoney(stakeValid ? stake : 0) })}
            icon="zap"
            onPress={submit}
            disabled={!valid}
          />
        </View>
      </View>
    </Screen>
  );
}
