/**
 * Hook de idioma — lê o idioma atual e troca (persistindo em MMKV).
 *
 * Trocar idioma: `setLanguage("en")` → atualiza o i18next (re-render via
 * react-i18next) e grava o override no MMKV para as próximas aberturas.
 */
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { kv, StorageKeys } from "@/shared/lib/storage";

import { normalizeLanguage, FALLBACK_LANGUAGE } from "./index";
import { SUPPORTED_LANGUAGES, type AppLanguage } from "./messages";

export interface UseLocale {
  /** Idioma ativo (sempre um suportado). */
  language: AppLanguage;
  /** Lista de idiomas suportados (para montar o seletor). */
  languages: readonly AppLanguage[];
  /** Troca o idioma e persiste a escolha. */
  setLanguage: (lang: AppLanguage) => void;
}

export function useLocale(): UseLocale {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.language) ?? FALLBACK_LANGUAGE;

  const setLanguage = useCallback(
    (lang: AppLanguage) => {
      kv.setString(StorageKeys.language, lang);
      void i18n.changeLanguage(lang);
    },
    [i18n],
  );

  return { language, languages: SUPPORTED_LANGUAGES, setLanguage };
}
