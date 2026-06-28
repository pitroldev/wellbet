"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { PRODUCT, type Product } from "./tokens";

type Ctx = {
  product: Product;
  setProduct: (p: Product) => void;
  toggle: () => void;
  /** Incrementa a cada troca — use como `key`/`pulse` p/ disparar microvitórias. */
  morphKey: number;
  theme: (typeof PRODUCT)[Product];
};

const ProductCtx = createContext<Ctx | null>(null);

/**
 * Provider do produto selecionado (WellBet ↔ GymBet). O toggle re-tematiza TODO
 * o painel: acentos, conteúdo e o "M" líquido reagem juntos.
 */
export function ProductProvider({ children }: { children: ReactNode }) {
  const [product, setProductState] = useState<Product>("well");
  const [morphKey, setMorphKey] = useState(0);

  const value = useMemo<Ctx>(() => {
    const setProduct = (p: Product) => {
      setProductState((cur) => {
        if (cur !== p) setMorphKey((k) => k + 1);
        return p;
      });
    };
    return {
      product,
      setProduct,
      toggle: () => setProduct(product === "well" ? "gym" : "well"),
      morphKey,
      theme: PRODUCT[product],
    };
  }, [product, morphKey]);

  return <ProductCtx.Provider value={value}>{children}</ProductCtx.Provider>;
}

export function useProduct() {
  const ctx = useContext(ProductCtx);
  if (!ctx) throw new Error("useProduct deve estar dentro de <ProductProvider>");
  return ctx;
}
