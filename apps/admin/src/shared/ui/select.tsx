"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui-components/react/select";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Select composável estilo shadcn/ui, sobre o Base UI (mesma base do Button).
 * Substitui o `<select>` nativo. Uso:
 *   <Select value={v} onValueChange={setV} items={{ a: "A", b: "B" }}>
 *     <SelectTrigger><SelectValue /></SelectTrigger>
 *     <SelectContent>
 *       <SelectItem value="a">A</SelectItem>
 *       <SelectItem value="b">B</SelectItem>
 *     </SelectContent>
 *   </Select>
 * O `items` (mapa value→label) faz o SelectValue exibir o rótulo selecionado.
 */
export function Select(props: React.ComponentProps<typeof BaseSelect.Root>): React.JSX.Element {
  return <BaseSelect.Root {...props} />;
}

export function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Trigger>): React.JSX.Element {
  return (
    <BaseSelect.Trigger
      className={cn(
        "flex h-9 w-full items-center justify-between gap-2 rounded-md border border-[var(--color-input)] bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
      <BaseSelect.Icon className="shrink-0 text-[var(--color-muted-foreground)]">
        <ChevronsUpDown className="size-4" aria-hidden />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export function SelectValue(
  props: React.ComponentProps<typeof BaseSelect.Value>,
): React.JSX.Element {
  return <BaseSelect.Value {...props} />;
}

export function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Popup>): React.JSX.Element {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner align="start" className="z-50 outline-none">
        <BaseSelect.Popup
          className={cn(
            "mt-1 max-h-[min(24rem,var(--available-height))] min-w-[var(--anchor-width)] origin-[var(--transform-origin)] overflow-y-auto rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-1 text-sm text-[var(--color-foreground)] shadow-lg",
            className,
          )}
          {...props}
        >
          {children}
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof BaseSelect.Item>): React.JSX.Element {
  return (
    <BaseSelect.Item
      className={cn(
        "flex cursor-pointer select-none items-center justify-between gap-2 rounded px-2 py-1.5 outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[highlighted]:bg-[var(--color-muted)]",
        className,
      )}
      {...props}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="shrink-0 text-[var(--color-foreground)]">
        <Check className="size-4" aria-hidden />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
}
