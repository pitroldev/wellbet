import { describe, expect, it } from "vitest";
import { verdictFormSchema } from "./schema";
import { CHECKLIST_ITEMS } from "./types";

function baseItems(): Record<string, "ok" | "fail" | "na"> {
  return Object.fromEntries(CHECKLIST_ITEMS.map((i) => [i.key, "ok"]));
}

describe("verdictFormSchema", () => {
  it("aceita APROVADO sem motivo", () => {
    const result = verdictFormSchema.safeParse({
      verdict: "APROVADO",
      reason: "",
      items: baseItems(),
    });
    expect(result.success).toBe(true);
  });

  it("exige motivo para PENDENTE", () => {
    const result = verdictFormSchema.safeParse({
      verdict: "PENDENTE",
      reason: "",
      items: baseItems(),
    });
    expect(result.success).toBe(false);
  });

  it("exige motivo para REPROVADO", () => {
    const result = verdictFormSchema.safeParse({
      verdict: "REPROVADO",
      reason: "ab",
      items: baseItems(),
    });
    expect(result.success).toBe(false);
  });

  it("aceita REPROVADO com motivo válido", () => {
    const result = verdictFormSchema.safeParse({
      verdict: "REPROVADO",
      reason: "Vídeo com corte evidente entre o zero e a subida.",
      items: { ...baseItems(), continuous_video: "fail" },
    });
    expect(result.success).toBe(true);
  });
});
