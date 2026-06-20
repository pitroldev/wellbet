import type { Metadata } from "next";
import type { JSX, ReactNode } from "react";
import { Providers } from "@/shared/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Charya — Console de Revisão",
  description: "Console interno de revisão humana das pesagens (MVP manual-first).",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
