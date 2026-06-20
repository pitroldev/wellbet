import type { NextConfig } from "next";

/**
 * Console de revisão da Charya.
 *
 * `output: 'standalone'` empacota apenas o necessário (server + node_modules
 * tracados) em `.next/standalone`, para uma imagem Docker enxuta rodando em
 * Cloud Run — sem lock-in de plataforma (NÃO Vercel). Ver Arquitetura §4.
 */
const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,

  // Pacotes internos do monorepo são consumidos como TS-source (workspace:*);
  // o Next precisa transpilá-los já que não publicam build próprio.
  transpilePackages: ["@charya/contracts", "@charya/schemas", "@charya/env", "@charya/ui-tokens"],

  // Next 16: typedRoutes saiu de `experimental` para top-level.
  typedRoutes: true,

  // TODO: quando escalar além de 1 instância, plugar um cache handler externo
  // (ex.: @neshca/cache-handler com Redis) via `cacheHandler`/`cacheMaxMemorySize: 0`.
};

export default nextConfig;
