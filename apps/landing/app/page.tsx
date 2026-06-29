import type { JSX } from "react";
import {
  Hero,
  StickyBar,
  TickerBand,
  Problema,
  Stats,
  ComoFunciona,
  Confianca,
  CTAFinal,
  Footer,
} from "@/sections";
import { SmoothScroll, ScrollProgress } from "@/motion";
import { GrainOverlay } from "@/fx";

/**
 * Landing de marketing da WellBet — sportsbook brutal, award-level.
 * Narrativa de conversão, cada seção com um ofício único:
 * hero (fisga + simulador honesto) → ticker (arena) → problema (a dor) →
 * ciência (por que funciona) → como funciona (o como + o downside) →
 * confiança & objeções (derruba o medo + FAQ) → CTA (pico único) → footer (legal).
 */
export default function HomePage(): JSX.Element {
  return (
    <main>
      <SmoothScroll />
      <ScrollProgress />
      <StickyBar />
      <GrainOverlay />
      <Hero />
      <TickerBand />
      <Problema />
      <Stats />
      <ComoFunciona />
      <Confianca />
      <CTAFinal />
      <Footer />
    </main>
  );
}
