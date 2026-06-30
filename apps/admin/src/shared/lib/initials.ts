/** Deriva 1–2 iniciais de um nome ("Ana Silva" → "AS") ou e-mail
 *  ("revisor@charya.dev" → "RE"), ignorando o domínio. */
export function deriveInitials(label: string): string {
  const raw = label.includes("@") ? (label.split("@")[0] ?? label) : label;
  const parts = raw.split(/[\s._-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return (parts[0] ?? "?").slice(0, 2).toUpperCase();
  return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
}
