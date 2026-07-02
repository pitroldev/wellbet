import type { JSX } from "react";
import { BellOff, Receipt, RotateCcw, type LucideIcon } from "lucide-react";
import { Secao, SectionHeader, Eyebrow, GradText, Card, IconTile } from "@/ui";
import { Reveal } from "@/motion";

interface Dor {
  Icon: LucideIcon;
  titulo: string;
  corpo: string;
}

/**
 * As três dores do ciclo — nomeadas direto, sem persona nem metáfora que
 * precise de manual. O título carrega a dor; o corpo continua a frase depois
 * do travessão.
 */
const DORES: readonly Dor[] = [
  {
    Icon: RotateCcw,
    titulo: "O efeito sanfona",
    corpo: "você perde uns quilos e semanas depois está tudo de volta.",
  },
  {
    Icon: BellOff,
    titulo: "Nenhum app te cobra",
    corpo: "sem consequência real, o sofá vence na terça chuvosa.",
  },
  {
    Icon: Receipt,
    titulo: "Cada recomeço custa",
    corpo: "dieta, academia, autoestima: toda tentativa que evapora cobra um preço.",
  },
];

/**
 * Seção de DOR — o ciclo que se repete, dito na cara: você já tentou várias
 * vezes e não foi falta de vontade, foi falta de consequência. Três cards de
 * dor direta (sanfona / ninguém cobra / recomeço custa) e o fecho de
 * pertencimento. Cutuca a desistência, nunca o corpo.
 */
export function Dores(): JSX.Element {
  return (
    <Secao id="dores" surface="ink">
      <Reveal>
        <SectionHeader
          kicker={<Eyebrow tone="violet-soft">O ciclo que se repete</Eyebrow>}
          title={
            <>
              Você já tentou. <GradText>Várias vezes.</GradText>
            </>
          }
          lede="Não é falta de vontade — é falta de consequência."
        />
      </Reveal>

      <div className="mt-12 grid gap-5 sm:mt-14 md:grid-cols-3">
        {DORES.map(({ Icon, titulo, corpo }, i) => (
          <Reveal key={titulo} delay={0.05 * i}>
            <Card surface="ink" interactive className="border-l-[3px] border-l-violet">
              <div className="flex items-center gap-3">
                <IconTile tone="muted">
                  <Icon className="size-5" strokeWidth={2} aria-hidden />
                </IconTile>
                <span className="font-[family-name:var(--font-geist-mono)] text-xs font-bold tracking-[0.2em] text-fog-mute">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-[family-name:var(--font-archivo)] text-xl font-extrabold leading-[1.1] tracking-[-0.02em] text-white">
                {titulo}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-fog">— {corpo}</p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mx-auto mt-12 max-w-2xl text-center font-[family-name:var(--font-geist-mono)] text-xs font-bold uppercase tracking-[0.14em] text-fog-mute sm:mt-14">
          É pra você que cansou de recomeçar do zero.
        </p>
      </Reveal>
    </Secao>
  );
}
