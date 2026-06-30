/**
 * Perfil — identidade + CPF/CNPJ + chave Pix + idioma. CPF/Pix são pré-requisito
 * para apostar e receber o prêmio (a api exige `taxId`/`pixKey`). Lê e grava via
 * @charya/contracts. Cabeçalho de identidade + seções com ícone (Midnight Aurora).
 */
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Chip, Input, Screen, Text } from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";
import { apiErrorMessage } from "@/shared/lib/http";
import { useLocale } from "@/shared/i18n/useLocale";
import { useMe } from "@/features/profile/api/useMe";
import { useUpdateProfile } from "@/features/profile/api/useUpdateProfile";
import { signOut } from "@/features/auth";
import { useJourney } from "@/features/journey";

const LANGUAGE_LABEL = {
  pt: "common.languagePt",
  en: "common.languageEn",
} as const;

function SectionLabel({ icon, label }: { icon: keyof typeof Feather.glyphMap; label: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <Feather name={icon} size={14} color={arena.fogMute} />
      <Text variant="label">{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { language, languages, setLanguage } = useLocale();
  const { data: me, isLoading } = useMe();
  const update = useUpdateProfile();
  const setHasAccount = useJourney((s) => s.setHasAccount);
  const name = useJourney((s) => s.name);

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

  const initial = (name ?? "").trim().charAt(0).toUpperCase();

  async function onSignOut(): Promise<void> {
    await signOut();
    setHasAccount(false);
    router.replace("/");
  }

  async function onSave(): Promise<void> {
    setError(null);
    const tax = taxId.trim();
    const pix = pixKey.trim();
    if (tax.length === 0 || pix.length === 0) {
      setError(t("profile.error.required"));
      return;
    }
    try {
      await update.mutateAsync({ taxId: tax, pixKey: pix });
      router.back();
    } catch (e) {
      setError(apiErrorMessage(e) ?? t("profile.error.save"));
    }
  }

  return (
    <Screen>
      <View className="flex-1 py-4">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 24, paddingBottom: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Identidade */}
          <View className="items-center gap-3 pt-2">
            <View
              style={{ backgroundColor: arenaAlpha.magentaWash }}
              className="h-20 w-20 items-center justify-center rounded-full border border-arena-hairline-strong"
            >
              {initial.length > 0 ? (
                <Text variant="display" className="text-3xl text-arena-magenta">
                  {initial}
                </Text>
              ) : (
                <Feather name="user" size={32} color={arena.magenta} />
              )}
            </View>
            <View className="items-center gap-0.5">
              <Text variant="heading" className="text-xl">
                {name?.trim() ? name : t("profile.account")}
              </Text>
              {name?.trim() ? (
                <Text variant="label" className="text-muted-foreground">
                  {t("profile.account")}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Recebimento (CPF/Pix) */}
          <View className="gap-3">
            <SectionLabel icon="credit-card" label={t("profile.section.payout")} />
            <Text variant="caption" className="text-muted">
              {t("profile.body")}
            </Text>
            <Input
              label={t("profile.field.taxId")}
              value={taxId}
              onChangeText={setTaxId}
              placeholder={t("profile.field.taxIdPlaceholder")}
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
              editable={!isLoading}
            />
            <Input
              label={t("profile.field.pix")}
              value={pixKey}
              onChangeText={setPixKey}
              placeholder={t("profile.field.pixPlaceholder")}
              autoCapitalize="none"
              editable={!isLoading}
            />
            {error != null ? (
              <Text variant="caption" className="text-danger">
                {error}
              </Text>
            ) : null}
          </View>

          {/* Idioma */}
          <View className="gap-3">
            <SectionLabel icon="globe" label={t("common.language")} />
            <View className="flex-row gap-2.5">
              {languages.map((lang) => (
                <Chip
                  key={lang}
                  label={t(LANGUAGE_LABEL[lang])}
                  selected={lang === language}
                  onPress={() => setLanguage(lang)}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View className="gap-3 pt-3">
          <Button
            label={update.isPending ? t("common.saving") : t("common.save")}
            icon="check"
            onPress={() => void onSave()}
            disabled={update.isPending || isLoading}
            loading={update.isPending}
          />
          <Button label={t("common.cancel")} tone="ghost" onPress={() => router.back()} />
          <Button
            label={t("journey.auth.signOut")}
            tone="secondary"
            icon="log-out"
            onPress={() => void onSignOut()}
          />
        </View>
      </View>
    </Screen>
  );
}
