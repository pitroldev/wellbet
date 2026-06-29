import type { JSX } from "react";
import { ShieldCheck, Lock, Users, type LucideIcon } from "lucide-react";
import { Secao, SectionHeader, Tag, Slab, Display, CardBrutal, IconTile } from "@/ui";
import { Reveal } from "@/motion";
import { FaqList } from "./FaqList";

type Tone = "green" | "magenta" | "pink";

interface Pilar {
  readonly Icon: LucideIcon;
  readonly tone: Tone;
  readonly titulo: string;
  readonly descricao: string;
}

/**
 * Os pilares de confiança — pesagem auditada absorve a prova operacional (100%
 * revisado), antes solta na seção de Ciência. Sem inventar depoimento.
 */
const PILARES: readonly Pilar[] = [
  {
    Icon: ShieldCheck,
    tone: "green",
    titulo: "Pesagem auditada",
    descricao:
      "100% das pesagens em vídeo contínuo, revisadas por uma pessoa. Sem foto antiga, sem balança maquiada — o resultado é seu de verdade ou não vale.",
  },
  {
    Icon: Lock,
    tone: "magenta",
    titulo: "Seu dinheiro, suas regras",
    descricao:
      "Você define a meta e o valor. Cumpriu, recebe de volta com recompensa. É um contrato de compromisso com você mesmo, não com a sorte.",
  },
  {
    Icon: Users,
    tone: "pink",
    titulo: "Gente real, evolução real",
    descricao:
      "Pessoas comuns, corpos diferentes, a mesma decisão de mudar. Aqui não tem corpo de revista nem humilhação de ranking — tem progresso.",
  },
];

/**
 * Seção "Confiança & objeções" — derruba o medo de dar Pix contra si mesmo com
 * prova de PROCESSO (não prova social fabricada) + a FAQ que encara a objeção
 * nº1. Funde a antiga Credibilidade. Superfície papel.
 */
export function Confianca(): JSX.Element {
  return (
    <Secao id="confianca" surface="paper">
      <Reveal>
        <SectionHeader
          tone="light"
          kicker={<Tag>Por que confiar</Tag>}
          title={
            <>
              Sério, transparente e <Slab>do seu lado.</Slab>
            </>
          }
          lede="A WellBet vende saúde e compromisso — não promessa de dinheiro fácil. Cada detalhe é construído para você confiar."
        />
      </Reveal>

      <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-3">
        {PILARES.map(({ Icon, tone, titulo, descricao }, i) => (
          <Reveal key={titulo} delay={0.05 * i}>
            <CardBrutal surface="paper" interactive>
              <div className="flex items-start justify-between">
                <IconTile tone={tone}>
                  <Icon className="size-5" strokeWidth={2.4} aria-hidden />
                </IconTile>
                <span
                  aria-hidden
                  className="font-[family-name:var(--font-geist-mono)] text-sm font-bold tabular-nums text-[color:var(--color-paper-mute)]"
                >
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-archivo)] text-xl uppercase leading-[0.95] text-ink">
                {titulo}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[color:var(--color-paper-mute)]">
                {descricao}
              </p>
            </CardBrutal>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 sm:mt-20">
        <Display level={2} size="section" className="text-ink">
          Ainda com o <Slab>pé atrás?</Slab>
        </Display>
        <div className="mt-7">
          <FaqList />
        </div>
      </Reveal>
    </Secao>
  );
}
