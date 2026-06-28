import type { JSX } from "react";
import { ShieldCheck, Lock, Users, type LucideIcon } from "lucide-react";
import { Secao } from "@/components/Secao";
import { Eyebrow, Glow, Display, GradText } from "@/components/ui";
import { Reveal } from "@/components/motion";

type Tone = "green" | "magenta" | "pink";

interface Prova {
  readonly Icon: LucideIcon;
  readonly tone: Tone;
  readonly titulo: string;
  readonly descricao: string;
}

/**
 * Seção "Por que confiar" — Server Component estático. Três pilares de
 * credibilidade (pesagem auditada, contrato consigo mesmo, gente real) que
 * sustentam a promessa séria da marca: saúde e compromisso, não dinheiro fácil.
 * Direção GYMBET ARENA — tiles positivos (verde/magenta/rosa), hairline em
 * gradiente e descrições legíveis em fog. Confiança que parece premium.
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
  green: "bg-green/10 text-green ring-green/25",
  magenta: "bg-magenta/10 text-pink ring-magenta/25",
  pink: "bg-pink/10 text-pink ring-pink/30",
};

export function Credibilidade(): JSX.Element {
  return (
    <Secao id="credibilidade" surface="ink">
      <Glow
        className="right-[-12%] top-[6%] h-[32rem] w-[32rem]"
        color="#FF00FF"
        style={{ opacity: 0.24 }}
      />
      <Glow
        className="right-[14%] bottom-[-8%] h-[24rem] w-[24rem]"
        color="#FF80E1"
        style={{ opacity: 0.16 }}
      />

      <Reveal y={26} className="relative max-w-2xl">
        <Eyebrow tone="magenta">Por que confiar</Eyebrow>
        <Display level={2} className="mt-5 text-[clamp(2rem,5vw,3.4rem)]">
          Sério, transparente e <GradText>do seu lado.</GradText>
        </Display>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fog">
          A Charya vende saúde e compromisso — não promessa de dinheiro fácil. Cada detalhe é
          construído para você confiar.
        </p>
      </Reveal>

      <div className="relative mt-12 grid gap-6 md:grid-cols-3">
        {provas.map(({ Icon, tone, titulo, descricao }, i) => (
          <Reveal key={titulo} delay={0.05 * i} y={26}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-navy-line bg-navy-soft p-6 transition-colors hover:border-magenta/40">
              {/* hairline em gradiente — assinatura gymbet */}
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: "var(--gradient-gymbet)" }}
              />

              <div className="flex items-start justify-between">
                <span
                  className={`grid size-11 place-items-center rounded-xl ring-1 ${toneTile[tone]}`}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span
                  aria-hidden
                  className="font-[family-name:var(--font-geist-mono)] text-sm font-medium tabular-nums text-fog-mute"
                >
                  0{i + 1}
                </span>
              </div>

              <h3 className="mt-5 text-lg font-bold text-white">{titulo}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-fog">{descricao}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Secao>
  );
}
