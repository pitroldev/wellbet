import type { JSX } from "react";
import { Secao, CTA, Eyebrow, Display, GradText, BoltMark } from "@/ui";
import { Reveal, Magnetic } from "@/motion";
import { appUrl, ctaLabel } from "@/config";

/**
 * CTAFinal — pico ÚNICO colado à ação. Absorve o clímax do antigo Manifesto como
 * manchete (acaba o pico-duplo magenta) e oferece UMA só decisão (sem CTA de
 * fuga "relembrar como funciona"). Painel de moldura magenta dura, sem glow.
 */
export function CTAFinal(): JSX.Element {
  return (
    <Secao id="comecar" surface="ink" size="tight">
      <Reveal className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden border-2 border-magenta bg-navy px-6 py-16 text-center sm:px-16 sm:py-20">
          {/* barra magenta chapada no topo */}
          <span aria-hidden className="absolute inset-x-0 top-0 h-2 bg-magenta" />

          {/* grade técnica sutil (textura de placar) */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-navy-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-navy-line) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse 70% 70% at 50% 0%, black, transparent)",
            }}
          />

          <div className="relative flex flex-col items-center">
            <span aria-hidden className="mb-6 grid size-14 place-items-center bg-magenta">
              <BoltMark className="h-6 w-auto text-ink" />
            </span>

            <Eyebrow tone="green">Sua vez</Eyebrow>

            <Display level={2} size="display" className="mt-5 text-white">
              Mudança real acontece quando tem <GradText>algo em jogo.</GradText>
            </Display>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-fog">
              A próxima tentativa pode ser a definitiva — porque desta vez tem algo de verdade em
              jogo. Faça a aposta em quem você quer se tornar.
            </p>

            <div className="mt-9">
              <Magnetic>
                <CTA href={appUrl} onDark>
                  {ctaLabel}
                </CTA>
              </Magnetic>
            </div>

            <p className="mt-7 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em] text-fog">
              Sem mensalidade · você define o valor · Pix na hora.
            </p>
          </div>
        </div>
      </Reveal>
    </Secao>
  );
}
