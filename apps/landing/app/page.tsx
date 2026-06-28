import type { JSX } from "react";
import {
  Hero,
  Problema,
  ComoFunciona,
  Manifesto,
  Credibilidade,
  CTAFinal,
  Footer,
} from "@/components";

/**
 * Landing de marketing da Charya Bet — identidade wellbet & Co. (BRAND.md).
 * SSG: Server Components estáticos + ilhas de motion (Reveal). Estrutura:
 * Hero → problema (sanfona) → como funciona → manifesto → credibilidade →
 * CTA final → footer.
 */
export default function HomePage(): JSX.Element {
  return (
    <main>
      <Hero />
      <Problema />
      <ComoFunciona />
      <Manifesto />
      <Credibilidade />
      <CTAFinal />
      <Footer />
    </main>
  );
}
