/**
 * Perfil — CPF/CNPJ + chave Pix. Pré-requisito para apostar e receber o prêmio
 * (a api exige `taxId`/`pixKey`). Lê e grava via @charya/contracts.
 */
import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { Button, Input, PressableScale, Screen, Text } from "@/shared/ui";
import { apiErrorMessage } from "@/shared/lib/http";
import { useLocale } from "@/shared/i18n/useLocale";
import { useMe } from "@/features/profile/api/useMe";
import { useUpdateProfile } from "@/features/profile/api/useUpdateProfile";

const LANGUAGE_LABEL = {
  pt: "common.languagePt",
  en: "common.languageEn",
} as const;

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { language, languages, setLanguage } = useLocale();
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
      <View className="flex-1 gap-8 py-6">
        <View className="gap-2">
          <Text variant="label" className="text-arena-magenta">
            Charya
          </Text>
          <Text variant="title">{t("profile.title")}</Text>
          <Text variant="body" className="text-muted">
            {t("profile.body")}
          </Text>
        </View>

        <View className="gap-2">
          <Text variant="label">{t("common.language")}</Text>
          <View className="flex-row gap-2">
            {languages.map((lang) => {
              const active = lang === language;
              return (
                <PressableScale
                  key={lang}
                  onPress={() => setLanguage(lang)}
                  className={
                    active
                      ? "rounded-full bg-primary-600 px-4 py-2"
                      : "rounded-full border border-border bg-arena-navy-soft px-4 py-2"
                  }
                >
                  <Text variant="label" className={active ? "text-on-primary" : "text-muted"}>
                    {t(LANGUAGE_LABEL[lang])}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </View>

        <View className="gap-4">
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

        <View className="mt-auto gap-3">
          <Button
            label={update.isPending ? t("common.saving") : t("common.save")}
            onPress={() => void onSave()}
            disabled={update.isPending || isLoading}
          />
          <Button label={t("common.cancel")} tone="ghost" onPress={() => router.back()} />
        </View>
      </View>
    </Screen>
  );
}
