import type { JSX } from "react";
import { UserCheck, Video, Banknote, type LucideIcon } from "lucide-react";

/**
 * Prova do hero — substitui o AvatarStack/"+2.140" FABRICADO por sinais REAIS do
 * mecanismo. Numa marca de auditoria humana honesta, prova social inventada é a
 * desonestidade que ela diz combater; aqui só o que é verdade do produto.
 */
const SINAIS: readonly { Icon: LucideIcon; label: string }[] = [
  { Icon: UserCheck, label: "Revisão humana" },
  { Icon: Video, label: "Vídeo contínuo" },
  { Icon: Banknote, label: "Saque via Pix" },
];

export function HeroProof(): JSX.Element {
  return (
    <ul className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
      {SINAIS.map(({ Icon, label }) => (
        <li key={label} className="inline-flex items-center gap-2 text-ink">
          <Icon className="size-4 text-indigo" strokeWidth={2.4} aria-hidden />
          <span className="font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.12em]">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
