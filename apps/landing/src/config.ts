/**
 * Configuração pública da landing.
 *
 * Valores públicos (expostos ao bundle do cliente, prefixo `NEXT_PUBLIC_`) com
 * fallback seguro para dev. A landing não usa @charya/env porque é estática e
 * de marketing — não há segredos nem validação de boot crítica aqui.
 */

/** URL do app (download / abrir app) para onde os CTAs apontam. */
export const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.wellbet.com.br";

/** Texto único de CTA reutilizado nos botões primários. */
export const ctaLabel = "Começar minha aposta";
