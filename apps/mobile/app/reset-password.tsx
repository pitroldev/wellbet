/**
 * Nova senha — alvo do deep link `charya://reset-password?token=...` (do email de
 * reset). Lê o token e troca a senha (Better Auth /reset-password).
 */
import { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, Screen, Tag, Text } from "@/shared/ui";
import { resetPassword } from "@/features/auth";

export default function ResetPassword() {
  const router = useRouter();
  const { t } = useTranslation();
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const valid = password.length >= 8 && token != null && !loading;

  async function submit() {
    if (!valid || token == null) return;
    setLoading(true);
    setError(null);
    try {
      await resetPassword({ token, newPassword: password });
      setDone(true);
    } catch {
      setError(t("journey.auth.errGeneric"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <View className="gap-5 pt-6">
          <Tag label={t("journey.auth.resetTitle")} />
          <Text variant="title">{t("journey.auth.resetTitle")}</Text>
          <Text variant="body" className="text-muted">
            {done ? t("journey.auth.resetDone") : t("journey.auth.resetBody")}
          </Text>
          {!done ? (
            <Input
              label={t("journey.auth.newPassword")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoFocus
              error={error ?? undefined}
            />
          ) : null}
        </View>

        {done ? (
          <Button label={t("journey.auth.signIn")} onPress={() => router.replace("/(auth)/sign-in")} />
        ) : (
          <Button label={loading ? "…" : t("journey.auth.resetCta")} onPress={submit} disabled={!valid} />
        )}
      </View>
    </Screen>
  );
}
