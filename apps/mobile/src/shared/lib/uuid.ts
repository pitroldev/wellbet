/**
 * UUID v4 para chaves de idempotência (escrita financeira). Não precisa ser
 * cripto-forte: só único por tentativa de criação. Evita uma dep nativa só
 * para isto (RN/Hermes não expõe `crypto.randomUUID` de forma garantida).
 */
export function uuidV4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r % 4) + 8;
    return v.toString(16);
  });
}
