/**
 * Fronteira de env tipada do admin.
 *
 * A validação canônica vive em @charya/env (t3-env / Standard Schema), que
 * valida no boot e falha cedo se faltar variável (Arquitetura §5/§7). Este
 * módulo é o ponto único de leitura no app: reexporta o `clientEnv` validado de
 * `@charya/env/client` (todas as chaves sob o prefixo NEXT_PUBLIC_, lidas
 * estaticamente lá para o Next inliná-las no bundle client).
 *
 * Código server-side (Server Components / route handlers) que precise de
 * segredos deve importar `serverEnv` de `@charya/env/server` — nunca daqui.
 */
export { clientEnv as env } from "@charya/env/client";
