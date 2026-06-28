/**
 * i18n do app — i18next + react-i18next, detecção via expo-localization e
 * override persistido em MMKV.
 *
 * Produto brasileiro: o idioma-base é **pt**. Na primeira execução seguimos o
 * idioma do dispositivo se for suportado (pt/en); caso contrário, pt. O usuário
 * pode trocar manualmente (ver `useLocale` / tela de perfil), e a escolha fica
 * salva no MMKV (sobrepõe a detecção do dispositivo nas próximas aberturas).
 *
 * A init é SÍNCRONA (sem I/O assíncrono): `getLocales()` e o MMKV são síncronos,
 * então o `t()` já funciona no primeiro render — não há gate de carregamento.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import { kv, StorageKeys } from "@/shared/lib/storage";

import { resources, SUPPORTED_LANGUAGES, type AppLanguage } from "./messages";

export const FALLBACK_LANGUAGE: AppLanguage = "pt";

/** Normaliza um código BCP-47 ("pt-BR", "en-US") para um idioma suportado. */
export function normalizeLanguage(input: string | null | undefined): AppLanguage | null {
  if (input == null) return null;
  const base = input.toLowerCase().split("-")[0] ?? "";
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(base) ? (base as AppLanguage) : null;
}

/** Idioma do dispositivo, se suportado. */
function detectDeviceLanguage(): AppLanguage | null {
  try {
    const locales = getLocales();
    for (const l of locales) {
      const match = normalizeLanguage(l.languageCode ?? l.languageTag);
      if (match != null) return match;
    }
  } catch {
    // expo-localization pode falhar em ambientes sem módulo nativo (teste): ignora.
  }
  return null;
}

/** Resolve o idioma inicial: override salvo → dispositivo → fallback. */
export function resolveInitialLanguage(): AppLanguage {
  const saved = normalizeLanguage(kv.getString(StorageKeys.language));
  if (saved != null) return saved;
  return detectDeviceLanguage() ?? FALLBACK_LANGUAGE;
}

// Inicializa uma única vez (idempotente — `index.ts` é importado no boot).
if (!i18n.isInitialized) {
  // `i18n.use` é o método da instância default (não o named export `use`).
  // eslint-disable-next-line import/no-named-as-default-member
  void i18n.use(initReactI18next).init({
    resources,
    lng: resolveInitialLanguage(),
    fallbackLng: FALLBACK_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
    defaultNS: "translation",
    interpolation: {
      // RN/React já escapam a saída — desligar evita escape duplo.
      escapeValue: false,
    },
    returnNull: false,
    // Recursos são síncronos (sem backend) — não precisamos de Suspense, e não
    // há boundary configurado no app.
    react: { useSuspense: false },
  });
}

export default i18n;
