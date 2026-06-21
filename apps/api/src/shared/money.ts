/**
 * Conversão entre valor decimal em reais ("100.00", precisão monetária como
 * string) e centavos (inteiro) — os PSPs (Stark Bank) trabalham em centavos.
 *
 * Nunca usar float para guardar dinheiro; só convertemos para inteiro de
 * centavos na borda com o provider de pagamento.
 */
export function decimalToCents(decimal: string): number {
  const value = Number(decimal);
  if (!Number.isFinite(value)) {
    throw new Error(`Valor monetário inválido: "${decimal}"`);
  }
  return Math.round(value * 100);
}

export function centsToDecimal(cents: number): string {
  return (cents / 100).toFixed(2);
}
