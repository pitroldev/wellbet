import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wellbet.com.br";

/**
 * `robots.txt` gerado pelo App Router (SSG). Landing é pública → indexação
 * liberada, com referência ao sitemap para os crawlers.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
