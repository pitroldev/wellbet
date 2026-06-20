/**
 * Junta classes condicionais. Versão enxuta da convenção shadcn (`cn`): a
 * landing não depende de clsx/tailwind-merge (mínimo de runtime no cliente),
 * então fazemos a junção simples de strings/condicionais aqui.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
