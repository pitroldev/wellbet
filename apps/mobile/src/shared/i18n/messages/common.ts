/**
 * Mensagens compartilhadas (botões, rótulos genéricos, idioma). Cada arquivo de
 * mensagens exporta `{ pt, en }` com a MESMA forma; o índice junta tudo sob o
 * namespace `translation`. Use as chaves como `t("common.cancel")`.
 */
export const common = {
  pt: {
    cancel: "Cancelar",
    back: "Voltar",
    backHome: "Voltar ao início",
    continue: "Continuar",
    save: "Salvar",
    saving: "Salvando…",
    loading: "Carregando…",
    language: "Idioma",
    languagePt: "Português",
    languageEn: "Inglês",
  },
  en: {
    cancel: "Cancel",
    back: "Back",
    backHome: "Back to home",
    continue: "Continue",
    save: "Save",
    saving: "Saving…",
    loading: "Loading…",
    language: "Language",
    languagePt: "Portuguese",
    languageEn: "English",
  },
} as const;
