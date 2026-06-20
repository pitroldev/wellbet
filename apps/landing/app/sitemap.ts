import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://charya.com.br";

/**
 * `sitemap.xml` gerado pelo App Router (SSG). Hoje a landing é uma página única;
 * novas rotas de marketing devem ser adicionadas aqui conforme surgirem.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
