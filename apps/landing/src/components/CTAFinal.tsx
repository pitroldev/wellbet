import type { JSX } from "react";
import { Secao } from "@/components/Secao";
import { CTA } from "@/components/CTA";
import { Eyebrow, Glow, Display, GradText } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { BoltMark } from "@/components/brand";
import { appUrl, ctaLabel } from "@/config";

/**
 * CTAFinal — o clímax de fechamento da landing, na direção GYMBET ARENA. Painel
 * grande com hairline em gradiente gymbet sobre ground bg-navy, glows magenta
 * fortes e o convite direto: faça a aposta em quem você quer se tornar. O único
 * green aqui é o "Dê green." — o momento de vitória.
 */
export function CTAFinal(): JSX.Element {
  return (
    <Secao id="comecar" surface="ink">
      {/* luz ambiente magenta/roxo da seção — sem azul/verde */}
      <Glow
        className="left-1/2 top-[-7rem] h-[30rem] w-[44rem] -translate-x-1/2"
        color="#FF00FF"
        style={{ opacity: 0.32 }}
      />
      <Glow
        className="bottom-[-9rem] left-1/2 h-[26rem] w-[34rem] -translate-x-1/2"
        color="#7A1BD6"
        style={{ opacity: 0.26 }}
      />

      <Reveal y={30} className="mx-auto max-w-5xl">
        {/* hairline em gradiente gymbet (anel fino) envolvendo o painel escuro */}
        <div
          className="relative rounded-[2rem] p-px"
          style={{ background: "var(--gradient-gymbet)", boxShadow: "var(--glow-magenta)" }}
        >
          <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-navy px-6 py-16 text-center sm:px-16 sm:py-20">
            {/* glows internos magenta/rosa + grade sutil */}
            <Glow
              className="left-1/2 top-[-5rem] h-[20rem] w-[26rem] -translate-x-1/2"
              color="#FF00FF"
              style={{ opacity: 0.28 }}
            />
            <Glow
              className="bottom-[-6rem] left-1/2 h-[16rem] w-[22rem] -translate-x-1/2"
              color="#FF80E1"
              style={{ opacity: 0.18 }}
            />
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
              <span
                aria-hidden
                className="mb-6 grid size-14 place-items-center rounded-2xl"
                style={{ background: "var(--gradient-gymbet)", boxShadow: "var(--glow-magenta)" }}
              >
                <BoltMark className="h-6 w-auto text-white" />
              </span>

              <Eyebrow tone="green">Sua vez</Eyebrow>

              <Display level={2} className="mt-4 text-[clamp(2.2rem,6vw,3.6rem)]">
                Comprometa-se. Evolua.{" "}
                <GradText gradient="var(--gradient-voltage)">Dê green.</GradText>
              </Display>

              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-fog">
                A próxima tentativa pode ser a definitiva — porque desta vez tem algo de verdade em
                jogo. Faça a aposta em quem você quer se tornar.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <CTA href={appUrl}>{ctaLabel}</CTA>
                <CTA href="#como-funciona" variant="secondary">
                  Relembrar como funciona
                </CTA>
              </div>

              <p className="mt-6 font-[family-name:var(--font-geist-mono)] text-xs tracking-wide text-fog">
                Sem mensalidade · Pix · cancele quando quiser.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </Secao>
  );
}
