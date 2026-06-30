/**
 * Onboarding passo 7 — cria a conta (Better Auth via Bearer) pra TRAVAR o desafio.
 * Em sucesso, sincroniza o journey store e segue pro guia de captura do vídeo.
 * (Quem já tem conta vai pro login.)
 */
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, PressableScale, Screen, Tag, Text } from "@/shared/ui";
import { AuthError, signUp } from "@/features/auth";
import { useJourney } from "@/features/journey";

export default function OnboardingAccount() {
  const router = useRouter();
  const { t } = useTranslation();
  const createAccount = useJourney((s) => s.createAccount);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailOk = /\S+@\S+\.\S+/.test(email.trim());
  const valid = name.trim().length > 0 && emailOk && password.length >= 8 && !loading;

  function friendly(e: unknown): string {
    if (e instanceof AuthError) {
      const c = `${e.code ?? ""} ${e.message}`.toUpperCase();
      if (c.includes("EXIST")) return t("journey.auth.errTaken");
      if (c.includes("PASSWORD") && c.includes("SHORT")) return t("journey.auth.errWeak");
      if (e.status === 401 || c.includes("INVALID")) return t("journey.auth.errInvalid");
      if (e.message && e.message !== "auth_failed") return e.message;
      return t("journey.auth.errGeneric");
    }
    return t("journey.auth.errNetwork");
  }

  async function submit() {
    if (!valid) return;
    setLoading(true);
    setError(null);
    try {
      const user = await signUp({ name: name.trim(), email: email.trim(), password });
      createAccount(user.name ?? name.trim());
      router.replace("/(onboarding)/capture-intro");
    } catch (e) {
      if (__DEV__) console.warn("[auth] onboarding signup:", e);
      setError(friendly(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 18, paddingVertical: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-2">
          <Tag label={t("onboarding.account.eyebrow")} />
          <Text variant="title">{t("onboarding.account.title")}</Text>
          <Text variant="body" className="text-muted">
            {t("onboarding.account.body")}
          </Text>
        </View>

        <Input
          label={t("journey.auth.name")}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
        />
        <Input
          label={t("journey.auth.email")}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
        <Input
          label={t("journey.auth.password")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={submit}
          error={error ?? undefined}
        />

        <Button
          label={t("onboarding.account.cta")}
          onPress={submit}
          disabled={!valid}
          loading={loading}
          icon="arrow-right"
          className="mt-2"
        />
        <PressableScale onPress={() => router.push("/(auth)/sign-in")} className="items-center">
          <Text variant="label" className="text-muted-foreground">
            {t("onboarding.account.login")}
          </Text>
        </PressableScale>
      </ScrollView>
    </Screen>
  );
}
