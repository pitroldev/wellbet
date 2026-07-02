import type { JSX } from "react";
import {
  Hero,
  CanhotoBar,
  TickerBand,
  Dores,
  ComoFunciona,
  DinheiroNaMesa,
  Stats,
  VarProva,
  FaqList,
  CTAFinal,
  Footer,
} from "@/sections";
import { ApostaProvider } from "@/state/aposta";
import { SmoothScroll, ScrollProgress } from "@/motion";
import { GrainOverlay } from "@/fx";

/**
 * Landing do MONTADOR DE BILHETE — a aposta em você mesmo, sem manual. Um único
 * estado (ApostaProvider: meta + prazo + valor em jogo) atravessa a página
 * inteira, do montador do hero ao canhoto sticky e ao resumo do fechamento.
 * Ritmo de superfícies: tensão no escuro (montador → dores → como funciona),
 * luz pra falar de dinheiro e estatística (dinheiro → ciência), escuro quieto
 * na prova (VAR), papel nas objeções (FAQ) e o clímax afundando de ink pro
 * void (green rotulado SIMULAÇÃO + decisão única).
 */
export default function HomePage(): JSX.Element {
  return (
    <main>
      <SmoothScroll />
      <ScrollProgress />
      <GrainOverlay />
      <ApostaProvider>
        <CanhotoBar />
        <Hero />
        <TickerBand />
        <Dores />
        <ComoFunciona />
        <DinheiroNaMesa />
        <Stats />
        <VarProva />
        <FaqList />
        <CTAFinal />
      </ApostaProvider>
      <Footer />
    </main>
  );
}
