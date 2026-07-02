import type { JSX } from "react";
import { Secao, Display, Slab } from "@/ui";
import { Reveal } from "@/motion";

interface Faq {
  readonly q: string;
  readonly a: string;
}

/** As objeções reais de dar Pix contra si mesmo — encaradas de frente, a pior primeiro. */
const FAQS: readonly Faq[] = [
  {
    q: "E se eu não bater?",
    a: "Você perde o valor que pôs. Vai pro bolo de quem bateu. É exatamente esse risco que te impede de desistir.",
  },
  {
    q: "Isso é jogo de azar?",
    a: "Não. Não existe sorte aqui: o resultado depende só de você cumprir a sua meta. É um contrato de compromisso com você mesmo (commitment device), não uma roleta.",
  },
  {
    q: "Como recebo se bater?",
    a: "Direto no seu Pix: o valor de volta + sua fatia do bolo de quem não cumpriu. Sem mensalidade e sem pegadinha.",
  },
  {
    q: "Quem garante que ninguém trapaceia?",
    a: "Cada pesagem é registrada em vídeo contínuo e revisada por uma pessoa de verdade. Foto antiga ou balança maquiada não passam.",
  },
];

/**
 * Dobra "Pergunta na lata" — acordeão de objeções em `<details>` nativo
 * (acessível, zero JS), com a objeção nº1 ("e se eu não bater?") em primeiro.
 * O padding vertical mora no <summary> para o alvo de toque inteiro (≥44px)
 * abrir/fechar. Superfície papel.
 */
export function FaqList(): JSX.Element {
  return (
    <Secao id="faq" surface="paper">
      <Reveal>
        <Display level={2} size="section" className="text-ink">
          Ainda com o pé atrás? <Slab>Pergunta na lata.</Slab>
        </Display>
      </Reveal>

      <Reveal className="mt-8 sm:mt-10" delay={0.05}>
        <div className="divide-y divide-paper-line overflow-hidden rounded-2xl border border-paper-line bg-paper shadow-panel">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="group px-5 sm:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-[family-name:var(--font-archivo)] text-lg font-extrabold leading-tight tracking-[-0.02em] text-ink [&::-webkit-details-marker]:hidden">
                {q}
                <span
                  aria-hidden
                  className="font-[family-name:var(--font-geist-mono)] text-2xl leading-none text-violet transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-2xl pb-4 text-[15px] leading-relaxed text-[color:var(--color-paper-mute)]">
                {a}
              </p>
            </details>
          ))}
        </div>
      </Reveal>
    </Secao>
  );
}
