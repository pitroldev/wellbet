import type { JSX } from "react";
import { ShieldCheck, Lock, Users, type LucideIcon } from "lucide-react";
import { Secao } from "@/components/Secao";
import { Tag, Display, GradText } from "@/components/ui";
import { Reveal } from "@/components/motion";

type Tone = "green" | "magenta" | "pink";

interface Prova {
  readonly Icon: LucideIcon;
  readonly tone: Tone;
  readonly titulo: string;
  readonly descricao: string;
}

/**
 * Seção "Por que confiar" — superfície PAPEL (confiança = claro, limpo, sério).
 * Três pilares (pesagem auditada, contrato consigo mesmo, gente real) em cards de
 * fio duro com selo magenta no hover. Saúde e compromisso, não dinheiro fácil.
 */
const provas: readonly Prova[] = [
  {
    Icon: ShieldCheck,
    tone: "green",
    titulo: "Pesagem auditada",
    descricao:
      "Cada pesagem é registrada em vídeo contínuo e revisada por uma pessoa. Sem foto antiga, sem balança maquiada — o resultado é seu de verdade ou não vale.",
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

const toneTile: Record<Tone, string> = {
  green: "bg-green",
  magenta: "bg-magenta",
  pink: "bg-pink",
};

export function Credibilidade(): JSX.Element {
  return (
    <Secao id="credibilidade" surface="paper">
      <Reveal y={26} className="relative max-w-2xl">
        <Tag>Por que confiar</Tag>
        <Display level={2} className="mt-5 text-[clamp(2rem,5.4vw,3.6rem)] text-ink">
          Sério, transparente e <GradText>do seu lado.</GradText>
        </Display>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[color:var(--color-paper-mute)]">
          A Charya vende saúde e compromisso — não promessa de dinheiro fácil. Cada detalhe é
          construído para você confiar.
        </p>
      </Reveal>

      <div className="relative mt-12 grid gap-6 md:grid-cols-3">
        {provas.map(({ Icon, tone, titulo, descricao }, i) => (
          <Reveal key={titulo} delay={0.05 * i} y={26}>
            <article className="group flex h-full flex-col border-2 border-ink bg-paper p-6 transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#ff00ff]">
              <div className="flex items-start justify-between">
                <span className={`grid size-11 place-items-center text-ink ${toneTile[tone]}`}>
                  <Icon className="size-5" strokeWidth={2.4} aria-hidden />
                </span>
                <span
                  aria-hidden
                  className="font-[family-name:var(--font-geist-mono)] text-sm font-bold tabular-nums text-[color:var(--color-paper-mute)]"
                >
                  0{i + 1}
                </span>
              </div>

              <h3 className="mt-5 font-[family-name:var(--font-archivo)] text-2xl uppercase leading-[0.95] text-ink">
                {titulo}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-[color:var(--color-paper-mute)]">
                {descricao}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Secao>
  );
}
