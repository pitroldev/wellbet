/**
 * Nova aposta. Coleta a meta de peso + o valor do stake, cria a aposta e mostra
 * o BR Code (Pix copia-e-cola) para pagar. A aposta nasce `pending_payment`; o
 * webhook do Stark Bank confirma o pagamento e a abre.
 */
import { useState } from "react";
import { View } from "react-native";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, Screen, Text } from "@/shared/ui";
import { apiErrorMessage } from "@/shared/lib/http";
import { usePlaceBet } from "@/features/bet/api/usePlaceBet";
import { uuidV4 } from "@/shared/lib/uuid";

function parseWeight(v: string): number {
  return Number(v.replace(",", ".").trim());
}

export default function NewBetScreen() {
  const { t } = useTranslation();
  const place = usePlaceBet();
  // Chave de idempotência fixa por tela (reusada em retries).
  const [idempotencyKey] = useState(() => uuidV4());
  const [targetWeight, setTargetWeight] = useState("");
  const [startWeight, setStartWeight] = useState("");
  const [stake, setStake] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Aposta criada → tela de pagamento (BR Code).
  if (place.data) {
    const bet = place.data;
    return (
      <Screen>
        <View className="flex-1 gap-8 py-6">
          <View className="gap-2">
            <Text variant="label" className="text-arena-magenta">
              Pix
            </Text>
            <Text variant="title">{t("bet.pay.title")}</Text>
            <Text variant="body" className="text-muted">
              {t("bet.pay.body")}
            </Text>
          </View>

          <View className="gap-2">
            <Text variant="label">{t("bet.pay.label")}</Text>
            <View className="border-2 border-border bg-arena-ink px-4 py-3">
              <Text variant="mono" selectable className="text-xs">
                {bet.brcode}
              </Text>
            </View>
            <Text variant="caption" className="text-muted">
              {t("bet.pay.expires", {
                date: new Date(bet.chargeExpiresAt).toLocaleString("pt-BR"),
              })}
            </Text>
          </View>

          <View className="mt-auto gap-3">
            <Link href="/" asChild>
              <Button label={t("common.backHome")} />
            </Link>
          </View>
        </View>
      </Screen>
    );
  }

  async function onSubmit(): Promise<void> {
    setError(null);
    const target = parseWeight(targetWeight);
    const start = startWeight.trim() ? parseWeight(startWeight) : null;
    const stakeAmount = stake.replace(",", ".").trim();

    if (!Number.isFinite(target) || target <= 0) {
      setError(t("bet.error.target"));
      return;
    }
    if (start !== null && (!Number.isFinite(start) || start <= target)) {
      setError(t("bet.error.start"));
      return;
    }
    if (stakeAmount.length === 0 || !Number.isFinite(Number(stakeAmount))) {
      setError(t("bet.error.stake"));
      return;
    }
    try {
      await place.mutateAsync({
        idempotencyKey,
        body: { targetWeightKg: target, startWeightKg: start, stakeAmount, currency: "BRL" },
      });
    } catch (e) {
      setError(apiErrorMessage(e) ?? t("bet.error.create"));
    }
  }

  return (
    <Screen>
      <View className="flex-1 gap-8 py-6">
        <View className="gap-2">
          <Text variant="label" className="text-arena-magenta">
            Charya
          </Text>
          <Text variant="title">{t("bet.create.title")}</Text>
          <Text variant="body" className="text-muted">
            {t("bet.create.body")}
          </Text>
        </View>

        <View className="gap-4">
          <Input
            label={t("bet.field.target")}
            value={targetWeight}
            onChangeText={setTargetWeight}
            placeholder={t("bet.field.targetPlaceholder")}
            keyboardType="decimal-pad"
          />
          <Input
            label={t("bet.field.start")}
            value={startWeight}
            onChangeText={setStartWeight}
            placeholder={t("bet.field.startPlaceholder")}
            keyboardType="decimal-pad"
          />
          <Input
            label={t("bet.field.stake")}
            value={stake}
            onChangeText={setStake}
            placeholder={t("bet.field.stakePlaceholder")}
            keyboardType="decimal-pad"
          />
          {error != null ? (
            <Text variant="caption" className="text-danger">
              {error}
            </Text>
          ) : null}
        </View>

        <View className="mt-auto gap-3">
          <Button
            label={place.isPending ? t("bet.create.submitting") : t("bet.create.submit")}
            onPress={() => void onSubmit()}
            disabled={place.isPending}
          />
          <Button label={t("common.cancel")} tone="ghost" onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}
