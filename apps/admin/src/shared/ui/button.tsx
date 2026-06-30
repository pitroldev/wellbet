"use client";

import * as React from "react";
import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Botão base (shadcn-style + Base UI).
 *
 * Usa o hook `useRender` da Base UI (sucessora do Radix, Arquitetura §4) em vez
 * do `asChild`/Slot do Radix: `render` permite trocar o elemento renderizado
 * (ex.: por um `<Link>`) preservando classes e props mesclados.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90",
        outline: "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-muted)]",
        ghost: "hover:bg-[var(--color-muted)]",
        approved: "bg-[var(--color-verdict-approved)] text-white hover:opacity-90",
        pending: "bg-[var(--color-verdict-pending)] text-black hover:opacity-90",
        rejected: "bg-[var(--color-verdict-rejected)] text-white hover:opacity-90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Elemento alternativo a renderizar (Base UI), ex.: <a> ou <Link>. */
  render?: useRender.RenderProp;
}

export function Button({
  className,
  variant,
  size,
  render,
  type,
  ...props
}: ButtonProps): React.JSX.Element {
  // `type` NÃO pode ser fixado no `defaultRender`: o `useRender` da Base UI dá
  // precedência às props do elemento de render sobre as props mescladas, então
  // um `<button type="button" />` aqui descartaria o `type="submit"` do consumidor
  // (era por isso que o botão de login não submetia o form). Passamos `type` pelas
  // props mescladas, com default "button" (evita submit acidental dos demais botões).
  const defaultRender = <button />;
  const element = useRender({
    render: render ?? defaultRender,
    props: {
      type: type ?? "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props,
    },
  });
  return element as React.JSX.Element;
}

export { buttonVariants };
