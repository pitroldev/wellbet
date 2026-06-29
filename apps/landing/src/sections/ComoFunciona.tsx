import type { JSX } from "react";
import { Target, Wallet, Camera, Trophy, type LucideIcon } from "lucide-react";
import { Secao, SectionHeader, Eyebrow, GradText, CardBrutal, IconTile } from "@/ui";
import { Reveal } from "@/motion";
import { cn } from "@/lib/utils";

interface Passo {
  readonly numero: string;
  readonly titulo: string;
  readonly descricao: string;
  readonly Icon: LucideIcon;
  /** O passo do green nomeia o DOWNSIDE (objeção nº1) e ganha acento verde. */
  readonly destaque?: boolean;
}

const PASSOS: readonly Passo[] = [
  {
    numero: "01",
    Icon: Target,
    titulo: "Defina sua meta",
    descricao:
      "Escolha quanto quer perder e em quanto tempo. Uma meta realista, do seu tamanho — nada de promessa milagrosa.",
  },
  {
    numero: "02",
    Icon: Wallet,
    titulo: "Ponha algo em jogo",
    descricao:
      "Coloque um valor real na sua própria meta. É esse dinheiro em risco que vira compromisso de verdade — não mais uma promessa de ano-novo.",
  },
  {
    numero: "03",
    Icon: Camera,
    titulo: "Cumpra e comprove",
    descricao:
      "Registre cada pesagem em vídeo contínuo, revisada por gente. Sem trapaça, sem atalho — e se não comprovar, conta como não bateu.",
  },
  {
    numero: "04",
    Icon: Trophy,
    titulo: "Deu green",
    destaque: true,
    descricao:
      "Bateu no prazo? Recebe o dinheiro de volta + recompensa, no Pix. Não bateu? Seu valor vai pro bolo de quem conseguiu — é o que faz a coisa funcionar.",
  },
];

/**
 * Seção "Como funciona" — os 4 passos da meta ao green E, sem letra miúda, o que
 * acontece se você NÃO bater (a maior objeção de dar Pix contra si mesmo).
 * 100% PT-BR (sem skin in the game / payout). Superfície navy, sem glow.
 */
export function ComoFunciona(): JSX.Element {
  return (
    <Secao id="como-funciona" surface="navy">
      <Reveal>
        <SectionHeader
          kicker={<Eyebrow tone="magenta">Como funciona</Eyebrow>}
          title={
            <>
              Quatro passos. Um <GradText>compromisso.</GradText>
            </>
          }
          lede="Da meta ao green — e o que acontece se você não bater. Tudo na mesa, sem letra miúda."
        />
      </Reveal>

      <div className="relative mt-12 sm:mt-14">
        {/* fio da progressão (lg) — régua magenta dura entre os cards */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-[3.6rem] hidden h-0.5 bg-magenta lg:block"
        />

        <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PASSOS.map(({ numero, titulo, descricao, Icon, destaque }, i) => (
            <Reveal key={numero} delay={0.05 * i}>
              <CardBrutal surface="ink" accent={destaque ? "green" : "magenta"}>
                <div className="flex items-center justify-between">
                  <IconTile tone={destaque ? "green" : "magenta"}>
                    <Icon className="size-5" strokeWidth={2.4} aria-hidden />
                  </IconTile>
                  <span
                    className={cn(
                      "font-[family-name:var(--font-geist-mono)] text-5xl font-bold leading-none tabular-nums",
                      destaque ? "text-green" : "text-magenta",
                    )}
                  >
                    {numero}
                  </span>
                </div>
                <h3
                  className={cn(
                    "mt-5 font-[family-name:var(--font-archivo)] text-xl uppercase leading-[0.95] tracking-tight",
                    destaque ? "text-green" : "text-white",
                  )}
                >
                  {titulo}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-fog">{descricao}</p>
              </CardBrutal>
            </Reveal>
          ))}
        </div>
      </div>
    </Secao>
  );
}
