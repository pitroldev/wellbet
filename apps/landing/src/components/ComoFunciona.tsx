import type { JSX } from "react";
import { Target, Wallet, Camera, Trophy, type LucideIcon } from "lucide-react";
import { Secao } from "@/components/Secao";

interface Passo {
  readonly numero: string;
  readonly titulo: string;
  readonly descricao: string;
  readonly Icon: LucideIcon;
}

/**
 * Os 4 passos do CHARYA BET (Ecossistema §2): define meta → aposta → cumpre →
 * ganha. Cada passo é factual e sóbrio, reforçando o contrato de compromisso.
 */
const passos: readonly Passo[] = [
  {
    numero: "01",
    titulo: "Defina sua meta",
    descricao:
      "Escolha quanto quer perder e em quanto tempo. Uma meta realista, validada e do seu tamanho — nada de promessa milagrosa.",
    Icon: Target,
  },
  {
    numero: "02",
    titulo: "Aposte em você",
    descricao:
      "Coloque um valor real em jogo na sua própria meta. É o skin in the game que transforma intenção em compromisso de verdade.",
    Icon: Wallet,
  },
  {
    numero: "03",
    titulo: "Cumpra e comprove",
    descricao:
      "Acompanhe sua evolução e registre cada pesagem por vídeo seguro. Auditoria de verdade — sem trapaça, sem atalho.",
    Icon: Camera,
  },
  {
    numero: "04",
    titulo: "Ganhe sua recompensa",
    descricao:
      "Bateu a meta no prazo? Você recebe de volta com recompensa. A vitória é dupla: o prêmio e a transformação que fica.",
    Icon: Trophy,
  },
];

/**
 * Seção "Como funciona" — Server Component estático. Grade de 4 passos.
 */
export function ComoFunciona(): JSX.Element {
  return (
    <Secao id="como-funciona" surface="muted">
      <div className="mb-14 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Como funciona</h2>
        <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">
          Quatro passos. Um compromisso. A sua transformação.
        </p>
      </div>

      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {passos.map(({ numero, titulo, descricao, Icon }) => (
          <li
            key={numero}
            className="flex flex-col rounded-2xl border border-neutral-200 bg-[var(--color-background)] p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="flex size-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="font-numeric text-sm font-semibold text-neutral-400">{numero}</span>
            </div>
            <h3 className="text-lg font-semibold">{titulo}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              {descricao}
            </p>
          </li>
        ))}
      </ol>
    </Secao>
  );
}
