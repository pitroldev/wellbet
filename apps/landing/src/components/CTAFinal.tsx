import type { JSX } from "react";
import { Secao } from "@/components/Secao";
import { CTA } from "@/components/CTA";
import { Eyebrow, Glow, Display, GradText } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { BoltMark } from "@/components/brand";
import { appUrl, ctaLabel } from "@/config";

/**
 * CTAFinal — clímax de fechamento. Painel de MOLDURA MAGENTA dura sobre navy,
 * barra magenta chapada no topo e o convite direto: faça a aposta em quem você
 * quer se tornar. O único green é o "Dê green." — o momento de vitória.
 */
export function CTAFinal(): JSX.Element {
  return (
    <Secao id="comecar" surface="ink">
      <Glow
        className="left-1/2 top-[-7rem] h-[30rem] w-[44rem] -translate-x-1/2"
        color="#FF00FF"
        style={{ opacity: 0.26 }}
      />

      <Reveal y={30} className="mx-auto max-w-5xl">
        <div className="relative overflow-hidden border-2 border-magenta bg-navy px-6 py-16 text-center sm:px-16 sm:py-20">
          {/* barra magenta chapada no topo */}
          <span aria-hidden className="absolute inset-x-0 top-0 h-2 bg-magenta" />

          {/* grade técnica sutil */}
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

            <Display level={2} className="mt-4 text-[clamp(2.4rem,6.5vw,4rem)] text-white">
              Comprometa-se. Evolua. <GradText tone="green">Dê green.</GradText>
            </Display>

            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-fog">
              A próxima tentativa pode ser a definitiva — porque desta vez tem algo de verdade em
              jogo. Faça a aposta em quem você quer se tornar.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <CTA href={appUrl} onDark>
                {ctaLabel}
              </CTA>
              <CTA href="#como-funciona" variant="secondary" onDark>
                Relembrar como funciona
              </CTA>
            </div>

            <p className="mt-7 font-[family-name:var(--font-geist-mono)] text-[11px] uppercase tracking-[0.1em] text-fog">
              Sem mensalidade · Pix · cancele quando quiser.
            </p>
          </div>
        </div>
      </Reveal>
    </Secao>
  );
}
