"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/shared/ui";
import { THEME_STORAGE_KEY } from "./theme-script";

/**
 * Tema claro/escuro/sistema sem dependência externa.
 *
 * Sessões de revisão são longas e às vezes de madrugada — o dark mode reduz a
 * fadiga ocular. Os tokens `.dark` já existem em globals.css; aqui só alternamos
 * a classe no <html> e persistimos a escolha. O script anti-flash (no <head> do
 * layout) aplica o tema ANTES da hidratação para não piscar branco.
 */
type Theme = "light" | "dark" | "system";

function systemPrefersDark(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: Theme): void {
  const dark = theme === "dark" || (theme === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", dark);
}

const ORDER: Theme[] = ["light", "dark", "system"];
const ICON: Record<Theme, React.ReactNode> = {
  light: <Sun className="size-4" aria-hidden />,
  dark: <Moon className="size-4" aria-hidden />,
  system: <Monitor className="size-4" aria-hidden />,
};
const LABEL: Record<Theme, string> = { light: "Claro", dark: "Escuro", system: "Sistema" };

export function ThemeToggle(): React.JSX.Element {
  const [theme, setTheme] = React.useState<Theme>("system");

  // Lê a preferência salva no mount (cliente) e mantém o <html> em sincronia com
  // mudanças do sistema enquanto estiver no modo "system".
  React.useEffect(() => {
    const saved = (localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) ?? "system";
    setTheme(saved);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if ((localStorage.getItem(THEME_STORAGE_KEY) as Theme | null) === "system") applyTheme("system");
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function cycle(): void {
    const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]!;
    setTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycle}
      className="w-full justify-start"
      aria-label={`Tema: ${LABEL[theme]}. Clique para alternar.`}
      title={`Tema: ${LABEL[theme]}`}
    >
      {ICON[theme]}
      Tema: {LABEL[theme]}
    </Button>
  );
}
