import type { NextConfig } from "next";

/**
 * Landing page de marketing da WellBet.
 *
 * `output: 'standalone'` empacota apenas o necessário (server + node_modules
 * tracados) em `.next/standalone`, para uma imagem Docker enxuta rodando em
 * Cloud Run — sem lock-in de plataforma (NÃO Vercel). Ver Stack Tecnológica §3.
 *
 * A landing é PÚBLICA e otimizada para SEO: as páginas são Server Components
 * estáticos (SSG) sem fetch de dados em runtime, então o Next as pré-renderiza
 * em HTML no build. Mínimo de JS no cliente = melhor LCP/SEO.
 */
const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  // O pacote interno @charya/ui-tokens é consumido como TS-source (workspace:*);
  // o Next precisa transpilá-lo já que não publica um build próprio consumível.
  transpilePackages: ["@charya/ui-tokens"],

  // Next 16: typedRoutes saiu de `experimental` para top-level.
  typedRoutes: true,
};

export default nextConfig;
