/**
 * Recuperar senha — pede o e-mail e dispara o link de reset (Better Auth
 * /forget-password). Em dev, o backend loga o link; o app abre via deep link
 * `charya://reset-password?token=...`. Não revela se a conta existe.
 */
import { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, Screen, Tag, Text } from "@/shared/ui";
import { forgotPassword } from "@/features/auth";

export default function Forgot() {
  const router = useRouter();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const emailOk = /\S+@\S+\.\S+/.test(email.trim());

  async function submit() {
    if (!emailOk || loading) return;
    setLoading(true);
    try {
      await forgotPassword(email.trim());
    } catch {
      // Não revelamos se a conta existe — sempre mostramos "enviado".
    } finally {
      setLoading(false);
      setSent(true);
    }
  }

  return (
    <Screen>
      <View className="flex-1 justify-between py-4">
        <View className="gap-5 pt-6">
          <Tag label={t("journey.auth.forgotTitle")} />
          <Text variant="title">{t("journey.auth.forgotTitle")}</Text>
          <Text variant="body" className="text-muted">
            {sent ? t("journey.auth.forgotSent") : t("journey.auth.forgotBody")}
          </Text>
          {!sent ? (
            <Input
              label={t("journey.auth.email")}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
          ) : null}
        </View>

        {sent ? (
          <Button label={t("journey.auth.back")} onPress={() => router.back()} />
        ) : (
          <View className="gap-3">
            <Button
              label={loading ? "…" : t("journey.auth.forgotCta")}
              onPress={submit}
              disabled={!emailOk || loading}
            />
            <Button label={t("journey.auth.back")} tone="ghost" onPress={() => router.back()} />
          </View>
        )}
      </View>
    </Screen>
  );
}
