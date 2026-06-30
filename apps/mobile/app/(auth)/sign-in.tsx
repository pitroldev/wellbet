/**
 * Entrar / Criar conta — auth REAL (Better Auth via Bearer). Em sucesso guarda o
 * token (SecureStore, dentro do client) e sincroniza o journey store
 * (`createAccount`), destravando o fluxo. Alterna entre sign in e sign up.
 */
import { useState } from "react";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, PressableScale, Screen, Tag, Text } from "@/shared/ui";
import { AuthError, signIn, signUp } from "@/features/auth";
import { useJourney } from "@/features/journey";

type Mode = "signin" | "signup";

export default function AuthScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const createAccount = useJourney((s) => s.createAccount);

  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === "signup";
  const emailOk = /\S+@\S+\.\S+/.test(email.trim());
  const passOk = password.length >= 8;
  const nameOk = !isSignup || name.trim().length > 0;
  const valid = emailOk && passOk && nameOk && !loading;

  function friendly(e: unknown): string {
    if (e instanceof AuthError) {
      const c = `${e.code ?? ""} ${e.message}`.toUpperCase();
      if (c.includes("EXIST")) return t("journey.auth.errTaken");
      if (c.includes("PASSWORD") && c.includes("SHORT")) return t("journey.auth.errWeak");
      if (e.status === 401 || c.includes("INVALID")) return t("journey.auth.errInvalid");
    }
    return t("journey.auth.errGeneric");
  }

  async function submit() {
    if (!valid) return;
    setLoading(true);
    setError(null);
    try {
      const user = isSignup
        ? await signUp({ name: name.trim(), email: email.trim(), password })
        : await signIn({ email: email.trim(), password });
      createAccount(user.name ?? name.trim());
      router.replace("/");
    } catch (e) {
      setError(friendly(e));
    } finally {
      setLoading(false);
    }
  }

  function toggle() {
    setMode(isSignup ? "signin" : "signup");
    setError(null);
  }

  return (
    <Screen>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 20, paddingVertical: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <Tag label="WellBet" />
        <Text variant="title">
          {isSignup ? t("journey.auth.signUpTitle") : t("journey.auth.signInTitle")}
        </Text>
        <Text variant="body" className="text-muted">
          {isSignup ? t("journey.auth.signUpBody") : t("journey.auth.signInBody")}
        </Text>

        {isSignup ? (
          <Input
            label={t("journey.auth.name")}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
          />
        ) : null}
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

        {!isSignup ? (
          <PressableScale onPress={() => router.push("/(auth)/forgot")} className="self-start">
            <Text variant="label" className="text-arena-magenta">
              {t("journey.auth.forgot")}
            </Text>
          </PressableScale>
        ) : (
          <Text variant="caption" className="text-muted">
            {t("journey.auth.note")}
          </Text>
        )}

        <Button
          label={loading ? "…" : isSignup ? t("journey.auth.signUp") : t("journey.auth.signIn")}
          onPress={submit}
          disabled={!valid}
          className="mt-2"
        />
        <PressableScale onPress={toggle} className="items-center">
          <Text variant="label" className="text-muted-foreground">
            {isSignup ? t("journey.auth.toSignIn") : t("journey.auth.toSignUp")}
          </Text>
        </PressableScale>
      </ScrollView>
    </Screen>
  );
}
