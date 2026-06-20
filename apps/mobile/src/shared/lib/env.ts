/**
 * Variáveis de ambiente públicas do app, tipadas e validadas no boot.
 *
 * Só `EXPO_PUBLIC_*` chega ao bundle. Validamos com Zod (mesma lib do resto do
 * monorepo) para falhar cedo se algo estiver mal configurado.
 *
 * Observação: o app não usa @t3-oss/env-core diretamente (isso é o pacote
 * `@charya/env`, voltado a Node). No cliente Expo, `process.env.EXPO_PUBLIC_*`
 * é inlined em build-time, então validamos o objeto literal.
 */
import { z } from "zod";

const EnvSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url(),
  EXPO_PUBLIC_ENV: z.enum(["development", "staging", "production"]).default("development"),
  EXPO_PUBLIC_R2_PUBLIC_URL: z.url().optional(),
});

// Acesso por chave literal: o transform do Expo só inlina referências estáticas
// a process.env.EXPO_PUBLIC_*.
const parsed = EnvSchema.safeParse({
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
  EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
  EXPO_PUBLIC_R2_PUBLIC_URL: process.env.EXPO_PUBLIC_R2_PUBLIC_URL,
});

if (!parsed.success) {
  // Falha cedo e com mensagem clara em dev.
  throw new Error(`Variáveis EXPO_PUBLIC_* inválidas:\n${z.prettifyError(parsed.error)}`);
}

export const env = parsed.data;
