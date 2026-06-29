import type { JSX } from "react";
import {
  Hero,
  TickerBand,
  Problema,
  Stats,
  ComoFunciona,
  Manifesto,
  Credibilidade,
  CTAFinal,
  Footer,
  SmoothScroll,
  GrainOverlay,
} from "@/components";

/**
 * Landing de marketing da Charya Bet — gymbet-arena, award-level (LP v2).
 * SSG no above-the-fold; ilhas client (mesh WebGL, smooth-scroll, cupom
 * interativo, contadores) hidratam por cima. Estrutura: hero (com simulador) →
 * ticker → problema → ciência (commitment device) → como funciona → manifesto →
 * credibilidade → CTA final → footer.
 */
export default function HomePage(): JSX.Element {
  return (
    <main>
      <SmoothScroll />
      <GrainOverlay />
      <Hero />
      <TickerBand />
      <Problema />
      <Stats />
      <ComoFunciona />
      <Manifesto />
      <Credibilidade />
      <CTAFinal />
      <Footer />
    </main>
  );
}
