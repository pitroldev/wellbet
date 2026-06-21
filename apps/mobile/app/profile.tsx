/**
 * Perfil — CPF/CNPJ + chave Pix. Pré-requisito para apostar e receber o prêmio
 * (a api exige `taxId`/`pixKey`). Lê e grava via @charya/contracts.
 */
import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";

import { Button, Input, Screen, Text } from "@/shared/ui";
import { useMe } from "@/features/profile/api/useMe";
import { useUpdateProfile } from "@/features/profile/api/useUpdateProfile";

export default function ProfileScreen() {
  const { data: me, isLoading } = useMe();
  const update = useUpdateProfile();

  const [taxId, setTaxId] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [hydratedId, setHydratedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pré-preenche uma vez quando o /me chega — padrão "ajustar estado durante o
  // render" do React (sem efeito; evita o aviso de renders em cascata).
  if (me && hydratedId !== me.id) {
    setHydratedId(me.id);
    setTaxId(me.taxId ?? "");
    setPixKey(me.pixKey ?? "");
  }

  async function onSave(): Promise<void> {
    setError(null);
    const tax = taxId.trim();
    const pix = pixKey.trim();
    if (tax.length === 0 || pix.length === 0) {
      setError("Preencha o CPF/CNPJ e a chave Pix.");
      return;
    }
    try {
      await update.mutateAsync({ taxId: tax, pixKey: pix });
      router.back();
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    }
  }

  return (
    <Screen>
      <View className="flex-1 gap-8 py-6">
        <View className="gap-2">
          <Text variant="title">Seu perfil</Text>
          <Text variant="body" className="text-muted">
            CPF/CNPJ e chave Pix são necessários para apostar e receber o prêmio.
          </Text>
        </View>

        <View className="gap-4">
          <Input
            label="CPF/CNPJ"
            value={taxId}
            onChangeText={setTaxId}
            placeholder="000.000.000-00"
            keyboardType="numbers-and-punctuation"
            autoCapitalize="none"
            editable={!isLoading}
          />
          <Input
            label="Chave Pix"
            value={pixKey}
            onChangeText={setPixKey}
            placeholder="CPF, e-mail, telefone ou chave aleatória"
            autoCapitalize="none"
            editable={!isLoading}
          />
          {error != null ? (
            <Text variant="caption" className="text-red-500">
              {error}
            </Text>
          ) : null}
        </View>

        <View className="mt-auto gap-3">
          <Button
            label={update.isPending ? "Salvando…" : "Salvar"}
            onPress={() => void onSave()}
            disabled={update.isPending || isLoading}
          />
          <Button label="Cancelar" tone="ghost" onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}
