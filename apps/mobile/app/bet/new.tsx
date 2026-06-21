/**
 * Nova aposta. Coleta a meta de peso + o valor do stake, cria a aposta e mostra
 * o BR Code (Pix copia-e-cola) para pagar. A aposta nasce `pending_payment`; o
 * webhook do Stark Bank confirma o pagamento e a abre.
 */
import { useState } from "react";
import { View } from "react-native";
import { Link, router } from "expo-router";

import { Button, Input, Screen, Text } from "@/shared/ui";
import { usePlaceBet } from "@/features/bet/api/usePlaceBet";
import { uuidV4 } from "@/shared/lib/uuid";

function parseWeight(v: string): number {
  return Number(v.replace(",", ".").trim());
}

export default function NewBetScreen() {
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
            <Text variant="title">Pague para ativar</Text>
            <Text variant="body" className="text-muted">
              Copie o código Pix e pague o valor da aposta. Assim que o pagamento cair, sua aposta
              fica ativa.
            </Text>
          </View>

          <View className="gap-2">
            <Text variant="caption">Pix copia e cola</Text>
            <View className="rounded-2xl border border-border bg-surface px-4 py-3">
              <Text variant="mono" selectable className="text-xs">
                {bet.brcode}
              </Text>
            </View>
            <Text variant="caption" className="text-muted">
              Expira em {new Date(bet.chargeExpiresAt).toLocaleString("pt-BR")}.
            </Text>
          </View>

          <View className="mt-auto gap-3">
            <Link href="/" asChild>
              <Button label="Voltar ao início" />
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
      setError("Informe uma meta de peso válida (kg).");
      return;
    }
    if (start !== null && (!Number.isFinite(start) || start <= target)) {
      setError("O peso inicial deve ser maior que a meta.");
      return;
    }
    if (stakeAmount.length === 0 || !Number.isFinite(Number(stakeAmount))) {
      setError("Informe o valor da aposta (R$).");
      return;
    }
    try {
      await place.mutateAsync({
        idempotencyKey,
        body: { targetWeightKg: target, startWeightKg: start, stakeAmount, currency: "BRL" },
      });
    } catch {
      setError(
        "Não foi possível criar a aposta. Confira se seu perfil (CPF/Pix) está completo e tente de novo.",
      );
    }
  }

  return (
    <Screen>
      <View className="flex-1 gap-8 py-6">
        <View className="gap-2">
          <Text variant="title">Nova aposta</Text>
          <Text variant="body" className="text-muted">
            Aposte em você: defina sua meta e o valor. Você recupera o valor ao atingir a meta.
          </Text>
        </View>

        <View className="gap-4">
          <Input
            label="Meta de peso (kg)"
            value={targetWeight}
            onChangeText={setTargetWeight}
            placeholder="ex.: 75"
            keyboardType="decimal-pad"
          />
          <Input
            label="Peso inicial (kg) — opcional"
            value={startWeight}
            onChangeText={setStartWeight}
            placeholder="ex.: 85"
            keyboardType="decimal-pad"
          />
          <Input
            label="Valor da aposta (R$)"
            value={stake}
            onChangeText={setStake}
            placeholder="ex.: 100"
            keyboardType="decimal-pad"
          />
          {error != null ? (
            <Text variant="caption" className="text-red-500">
              {error}
            </Text>
          ) : null}
        </View>

        <View className="mt-auto gap-3">
          <Button
            label={place.isPending ? "Criando…" : "Criar aposta"}
            onPress={() => void onSubmit()}
            disabled={place.isPending}
          />
          <Button label="Cancelar" tone="ghost" onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}
