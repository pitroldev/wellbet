/**
 * Idade relativa legível + nível de urgência (cor) para triagem por SLA.
 * Compartilhado entre a fila de revisão e a tabela de apostas.
 */
export function relativeAge(iso: string): { label: string; level: "fresh" | "warn" | "late" } {
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (diffMin < 1) return { label: "agora", level: "fresh" };
  if (diffMin < 60) return { label: `há ${String(diffMin)} min`, level: "fresh" };
  const h = Math.floor(diffMin / 60);
  if (h < 24) return { label: `há ${String(h)} h`, level: h >= 12 ? "warn" : "fresh" };
  const d = Math.floor(h / 24);
  return { label: `há ${String(d)} d`, level: "late" };
}

export const AGE_CLASS: Record<"fresh" | "warn" | "late", string> = {
  fresh: "text-[var(--color-muted-foreground)]",
  warn: "text-[var(--color-verdict-pending)] font-medium",
  late: "text-[var(--color-verdict-rejected)] font-medium",
};
