import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge condicional de classes Tailwind: `clsx` resolve a lógica condicional e
 * `tailwind-merge` desfaz conflitos (ex.: `px-2 px-4` → `px-4`).
 * Convenção shadcn/ui.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
