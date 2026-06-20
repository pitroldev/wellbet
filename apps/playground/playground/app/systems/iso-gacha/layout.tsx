import type { Metadata } from "next";
import { Fredoka, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const display = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "CHARYA — Iso-Gacha",
  description:
    "Iso-Gacha: design system 3D gamificado e colecionável. Seu esforço, em 3D, na palma da mão.",
};

export default function IsoGachaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(display.variable, body.variable, "min-h-screen bg-[#F4F1FA]")}>
      {children}
    </div>
  );
}
