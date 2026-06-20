import type { JSX } from "react";
import {
  TrendingDown,
  RotateCcw,
  HeartCrack,
  ShieldCheck,
  Users,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { Hero, ComoFunciona, Secao, CTA } from "@/components";
import { appUrl, ctaLabel } from "@/config";

/**
 * Landing de marketing da Charya Bet.
 *
 * Página 100% Server Component estática (SSG): o Next pré-renderiza este HTML no
 * build, sem fetch em runtime. Estrutura: Hero → o problema (sanfona/falta de
 * consistência) → como funciona → prova/credibilidade → CTA final.
 *
 * Copy fiel ao dossiê: séria, motivacional, credível. Vende saúde + compromisso,
 * NUNCA "dinheiro fácil" nem estética de aposta barata.
 */

interface DorItem {
  readonly Icon: LucideIcon;
  readonly titulo: string;
  readonly descricao: string;
}

const dores: readonly DorItem[] = [
  {
    Icon: RotateCcw,
    titulo: "O efeito sanfona",
    descricao:
      "Você começa firme, perde uns quilos e, semanas depois, está tudo de volta. De novo. O problema nunca foi sua força de vontade — foi a falta de algo real te segurando.",
  },
  {
    Icon: HeartCrack,
    titulo: "App nenhum te cobra de verdade",
    descricao:
      "Contador de calorias, planilha, mais um aplicativo passivo. Quando não há consequência, o sofá sempre vence na terça-feira chuvosa.",
  },
  {
    Icon: TrendingDown,
    titulo: "Disciplina sozinha não para de pé",
    descricao:
      "Manter a rotina por meses exige mais que motivação de domingo. Exige um motivo que doa abandonar — e uma recompensa que valha terminar.",
  },
];

interface ProvaItem {
  readonly Icon: LucideIcon;
  readonly titulo: string;
  readonly descricao: string;
}

const provas: readonly ProvaItem[] = [
  {
    Icon: ShieldCheck,
    titulo: "Pesagem auditada",
    descricao:
      "Cada pesagem é registrada em vídeo contínuo e revisada. Sem foto antiga, sem balança maquiada — o resultado é seu de verdade ou não vale.",
  },
  {
    Icon: Lock,
    titulo: "Seu dinheiro, suas regras",
    descricao:
      "Você define a meta e o valor. Cumpriu, recebe de volta com recompensa. É um contrato de compromisso com você mesmo, não com a sorte.",
  },
  {
    Icon: Users,
    titulo: "Gente real, evolução real",
    descricao:
      "Pessoas comuns, corpos diferentes, a mesma decisão de mudar. Aqui não tem corpo perfeito de revista nem humilhação de ranking — tem progresso.",
  },
];

export default function HomePage(): JSX.Element {
  return (
    <main>
      <Hero />

      {/* ── O problema: sanfona / falta de consistência ── */}
      <Secao id="o-problema">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Você já tentou. Várias vezes.
          </h2>
          <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">
            O ciclo se repete porque falta o ingrediente que muda o jogo: algo real em jogo. Sem
            isso, a rotina sempre afrouxa.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {dores.map(({ Icon, titulo, descricao }) => (
            <article
              key={titulo}
              className="rounded-2xl border border-neutral-200 bg-[var(--color-muted)] p-6"
            >
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-neutral-200 text-neutral-700">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="text-lg font-semibold">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {descricao}
              </p>
            </article>
          ))}
        </div>
      </Secao>

      {/* ── Como funciona: define meta → aposta → cumpre → ganha ── */}
      <ComoFunciona />

      {/* ── Prova / credibilidade ── */}
      <Secao id="credibilidade">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Sério, transparente e do seu lado
          </h2>
          <p className="mt-4 text-lg text-[var(--color-muted-foreground)]">
            A Charya vende saúde e compromisso — não promessa de dinheiro fácil. Por isso, cada
            detalhe é construído para você confiar.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {provas.map(({ Icon, titulo, descricao }) => (
            <article
              key={titulo}
              className="rounded-2xl border border-neutral-200 bg-[var(--color-background)] p-6"
            >
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="text-lg font-semibold">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                {descricao}
              </p>
            </article>
          ))}
        </div>
      </Secao>

      {/* ── CTA final ── */}
      <Secao id="comecar" surface="brand" containerClassName="text-center">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          Comprometa-se. Evolua. Ganhe.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
          A próxima tentativa pode ser a definitiva — porque desta vez tem algo de verdade em jogo.
          Faça a aposta em quem você quer se tornar.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <CTA href={appUrl}>{ctaLabel}</CTA>
          <a
            href="#como-funciona"
            className="text-base font-medium text-brand-100 underline-offset-4 hover:text-neutral-50 hover:underline"
          >
            Relembrar como funciona
          </a>
        </div>
      </Secao>

      <footer className="border-t border-neutral-200 bg-[var(--color-background)] px-6 py-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 text-sm text-[var(--color-muted-foreground)] sm:flex-row">
          <p>© {new Date().getFullYear()} Charya. Aposte na sua transformação.</p>
          <p>Charya Saúde e Bem-Estar LTDA</p>
        </div>
      </footer>
    </main>
  );
}
