import type { JSX } from "react";
import { Target, Wallet, Camera, Trophy, type LucideIcon } from "lucide-react";
import { Secao } from "@/components/Secao";
import { Eyebrow, Glow, Display, GradText } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

interface Passo {
  readonly numero: string;
  readonly titulo: string;
  readonly descricao: string;
  readonly Icon: LucideIcon;
  /** O payoff (04) ganha destaque green/voltage. */
  readonly destaque?: boolean;
}

/**
 * Os 4 passos do CHARYA BET: da meta ao green. Cada passo é factual e sóbrio,
 * com vocabulário de aposta (stake, skin in the game, payout via Pix). O passo
 * 04 — "deu green" — recebe acento green/voltage por ser a recompensa.
 */
const passos: readonly Passo[] = [
  {
    numero: "01",
    titulo: "Defina sua meta",
    descricao:
      "Escolha quanto quer perder e em quanto tempo. Uma meta realista, do seu tamanho — nada de promessa milagrosa.",
    Icon: Target,
  },
  {
    numero: "02",
    titulo: "Aposte em você",
    descricao:
      "Coloque um valor real (o stake) em jogo na sua própria meta. É o skin in the game que vira compromisso de verdade.",
    Icon: Wallet,
  },
  {
    numero: "03",
    titulo: "Cumpra e comprove",
    descricao:
      "Registre cada pesagem por vídeo contínuo, revisada por gente. Auditoria de verdade — sem trapaça, sem atalho.",
    Icon: Camera,
  },
  {
    numero: "04",
    titulo: "Deu green",
    descricao:
      "Bateu a meta no prazo? Recebe o stake de volta com recompensa, via Pix. A vitória é dupla: o prêmio e a transformação.",
    Icon: Trophy,
    destaque: true,
  },
];

/**
 * Seção "Como funciona" — Server Component estático. Quatro passos no ground
 * navy da GYMBET ARENA: numerais magenta gigantes, um fio-gradiente ligando a
 * progressão da esquerda pra direita, e o passo do green em voltage (o payoff).
 */
export function ComoFunciona(): JSX.Element {
  return (
    <Secao id="como-funciona" surface="navy">
      <Glow
        className="left-[-8%] top-[4%] h-[28rem] w-[28rem]"
        color="#FF00FF"
        style={{ opacity: 0.24 }}
      />
      <Glow
        className="right-[-10%] bottom-[6%] h-[24rem] w-[24rem]"
        color="#7A1BD6"
        style={{ opacity: 0.22 }}
      />

      <Reveal y={26} className="max-w-2xl">
        <Eyebrow tone="magenta">Como funciona</Eyebrow>
        <Display level={2} className="mt-4 text-[clamp(2rem,5vw,3.4rem)]">
          Quatro passos. Um <GradText>compromisso.</GradText>
        </Display>
        <p className="mt-4 max-w-2xl text-lg text-fog">
          Da meta ao green. Simples de entender, sério de cumprir.
        </p>
      </Reveal>

      <div className="relative mt-12 sm:mt-14">
        {/* fio-gradiente da progressão (lg) — atravessa os vãos entre os cards */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 right-0 top-[3.6rem] hidden h-px lg:block"
          style={{ background: "var(--gradient-gymbet)", opacity: 0.5 }}
        />

        <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map(({ numero, titulo, descricao, Icon, destaque }, i) => (
            <Reveal key={numero} delay={0.05 * i} y={22}>
              <article
                className={cn(
                  "group relative h-full overflow-hidden rounded-2xl border bg-navy-soft p-6 transition-colors",
                  destaque
                    ? "border-green/40 hover:border-green/70"
                    : "border-navy-line hover:border-magenta/40",
                )}
                style={destaque ? { boxShadow: "var(--glow-green)" } : undefined}
              >
                {/* top-bar de acento (voltage no payoff, gymbet nos demais) */}
                <span
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute inset-x-0 top-0 h-1 transition-opacity",
                    destaque ? "opacity-90" : "opacity-60 group-hover:opacity-100",
                  )}
                  style={{
                    background: destaque ? "var(--gradient-voltage)" : "var(--gradient-gymbet)",
                  }}
                />

                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid size-11 place-items-center rounded-xl ring-1",
                      destaque
                        ? "bg-green/10 text-green ring-green/25"
                        : "bg-magenta/10 text-pink ring-magenta/20",
                    )}
                  >
                    <Icon className="size-5" strokeWidth={2} aria-hidden />
                  </span>
                  <span
                    className={cn(
                      "font-[family-name:var(--font-geist-mono)] text-5xl font-semibold leading-none tabular-nums",
                      destaque ? "text-green" : "text-magenta",
                    )}
                  >
                    {numero}
                  </span>
                </div>

                <h3
                  className={cn(
                    "mt-6 text-lg font-bold tracking-[-0.01em]",
                    destaque ? "text-green" : "text-white",
                  )}
                >
                  {titulo}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-fog">{descricao}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Secao>
  );
}
