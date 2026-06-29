import type { JSX } from "react";

interface Faq {
  readonly q: string;
  readonly a: string;
}

/** As objeções reais de dar Pix contra si mesmo — encaradas de frente. */
const FAQS: readonly Faq[] = [
  {
    q: "E se eu não bater a meta?",
    a: "Você perde o valor que pôs — ele vai pro bolo de quem bateu. É exatamente esse risco que te impede de desistir no primeiro perrengue. Sendo honesto: dá pra perder, e é por isso que funciona.",
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
 * Acordeão de objeções — `<details>` nativo (acessível, zero JS). Pergunta em
 * Anton, resposta em sans. Mora dentro de Confiança (papel).
 */
export function FaqList(): JSX.Element {
  return (
    <div className="divide-y-2 divide-ink border-2 border-ink">
      {FAQS.map(({ q, a }) => (
        <details key={q} className="group px-5 py-4 sm:px-6">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-[family-name:var(--font-archivo)] text-lg uppercase leading-tight tracking-tight text-ink [&::-webkit-details-marker]:hidden">
            {q}
            <span
              aria-hidden
              className="font-[family-name:var(--font-geist-mono)] text-2xl leading-none text-[color:var(--color-magenta-deep)] transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[color:var(--color-paper-mute)]">
            {a}
          </p>
        </details>
      ))}
    </div>
  );
}
