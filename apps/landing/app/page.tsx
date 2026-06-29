import type { JSX } from "react";
import {
  Hero,
  TickerBand,
  Problema,
  Stats,
  ComoFunciona,
  Confianca,
  CTAFinal,
  Footer,
} from "@/sections";
import { SmoothScroll } from "@/motion";
import { GrainOverlay } from "@/fx";

/**
 * Landing de marketing da Charya Bet — sportsbook brutal, award-level.
 * Narrativa de conversão, cada seção com um ofício único:
 * hero (fisga + simulador honesto) → ticker (arena) → problema (a dor) →
 * ciência (por que funciona) → como funciona (o como + o downside) →
 * confiança & objeções (derruba o medo + FAQ) → CTA (pico único) → footer (legal).
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
      <Confianca />
      <CTAFinal />
      <Footer />
    </main>
  );
}
