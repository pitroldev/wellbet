/**
 * Barrel das mensagens. Junta cada arquivo de feature (`{ pt, en }`) num único
 * recurso por idioma sob o namespace `translation` do i18next. Cada feature vira
 * uma sub-chave (`home`, `bet`, …) — use como `t("home.title")`.
 *
 * Adicionou uma feature nova? Importe-a aqui e some em `pt`/`en`.
 */
import { common } from "./common";
import { home } from "./home";
import { onboarding } from "./onboarding";
import { weighin } from "./weighin";
import { bet } from "./bet";
import { profile } from "./profile";

export const resources = {
  pt: {
    translation: {
      common: common.pt,
      home: home.pt,
      onboarding: onboarding.pt,
      weighin: weighin.pt,
      bet: bet.pt,
      profile: profile.pt,
    },
  },
  en: {
    translation: {
      common: common.en,
      home: home.en,
      onboarding: onboarding.en,
      weighin: weighin.en,
      bet: bet.en,
      profile: profile.en,
    },
  },
} as const;

/** Idiomas suportados (rótulo legível resolvido em common.language*). */
export const SUPPORTED_LANGUAGES = ["pt", "en"] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];
