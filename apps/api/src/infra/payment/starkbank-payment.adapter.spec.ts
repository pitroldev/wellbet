import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Testes do StarkBankPaymentAdapter com o SDK `starkbank` mockado.
 *
 * Cobrem a LÓGICA do adapter (mapeamentos, idempotência, segurança), não a API
 * real do Stark Bank — um smoke test de sandbox (atrás de credencial) fica como
 * verificação de runtime separada.
 */
vi.mock("starkbank", () => ({
  Project: class {
    constructor(public params: unknown) {}
  },
  Invoice: class {
    constructor(public params: unknown) {}
  },
  Transfer: class {
    constructor(public params: unknown) {}
  },
  invoice: { create: vi.fn(), get: vi.fn(), query: vi.fn() },
  transfer: { create: vi.fn() },
  dictKey: { get: vi.fn() },
  event: { parse: vi.fn() },
}));

import { dictKey, event, invoice, transfer } from "starkbank";

import type { Env } from "../../config/config.module.js";
import { ValidationError } from "../../shared/errors.js";
import { StarkBankPaymentAdapter } from "./starkbank-payment.adapter.js";

type InvoiceT = Awaited<ReturnType<typeof invoice.get>>;
type TransferT = Awaited<ReturnType<typeof transfer.create>>[number];
type DictKeyT = Awaited<ReturnType<typeof dictKey.get>>;
type EventT = Awaited<ReturnType<typeof event.parse>>;

const fakeEnv = {
  STARKBANK_ENVIRONMENT: "sandbox",
  STARKBANK_PROJECT_ID: "proj-1",
  STARKBANK_PRIVATE_KEY: "pem",
  STARKBANK_INVOICE_EXPIRATION_SECONDS: 3600,
} as unknown as Env;

function makeAdapter(env: Env = fakeEnv): StarkBankPaymentAdapter {
  const adapter = new StarkBankPaymentAdapter(env);
  adapter.onModuleInit();
  return adapter;
}

function invoiceFixture(over: Record<string, unknown> = {}): InvoiceT {
  return {
    id: "inv-1",
    brcode: "00020101...br.gov.bcb.pix",
    amount: 20000,
    status: "created",
    due: new Date().toISOString(),
    expiration: 3600,
    tags: ["bet:1"],
    ...over,
  } as unknown as InvoiceT;
}

function dictFixture(over: Record<string, unknown> = {}): DictKeyT {
  return {
    name: "Vencedor",
    taxId: "98765432100",
    ispb: "20018183",
    branchCode: "0001",
    accountNumber: "12345-6",
    accountType: "saving", // DICT usa o singular
    ...over,
  } as unknown as DictKeyT;
}

describe("StarkBankPaymentAdapter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createPixCharge", () => {
    it("cria a Invoice e mapeia para PixCharge quando não há cobrança prévia", async () => {
      vi.mocked(invoice.query).mockResolvedValue([]);
      vi.mocked(invoice.create).mockResolvedValue([invoiceFixture()]);

      const charge = await makeAdapter().createPixCharge({
        externalId: "bet:1",
        amountCents: 20000,
        payer: { name: "Fulano", taxId: "12345678900" },
        description: "Stake",
      });

      expect(invoice.create).toHaveBeenCalledTimes(1);
      expect(charge).toMatchObject({
        providerId: "inv-1",
        amountCents: 20000,
        status: "created",
      });
      expect(charge.brcode).toContain("pix");
    });

    it("é idempotente: reaproveita uma cobrança viva existente (não cria duplicata)", async () => {
      vi.mocked(invoice.query).mockResolvedValue([
        invoiceFixture({ id: "inv-existing", status: "created" }),
      ]);

      const charge = await makeAdapter().createPixCharge({
        externalId: "bet:1",
        amountCents: 20000,
        payer: { name: "F", taxId: "1" },
        description: "Stake",
      });

      expect(invoice.create).not.toHaveBeenCalled();
      expect(charge.providerId).toBe("inv-existing");
    });
  });

  describe("createPayout", () => {
    function transferFixture(over: Record<string, unknown> = {}): TransferT {
      return { id: "tr-1", amount: 50000, status: "processing", ...over } as unknown as TransferT;
    }

    it("resolve a chave no DICT e emite Transfer, mapeando accountType saving→savings", async () => {
      vi.mocked(dictKey.get).mockResolvedValue(dictFixture());
      vi.mocked(transfer.create).mockResolvedValue([transferFixture()]);

      const payout = await makeAdapter().createPayout({
        externalId: "bet:1",
        amountCents: 50000,
        recipient: { name: "Vencedor", taxId: "987.654.321-00", pixKey: "v@x.com" },
        description: "Prêmio",
      });

      const built = vi.mocked(transfer.create).mock.calls[0]?.[0]?.[0] as unknown as {
        params: Record<string, unknown>;
      };
      expect(built.params.accountType).toBe("savings");
      expect(built.params.bankCode).toBe("20018183"); // ISPB → Pix
      expect(payout).toMatchObject({ providerId: "tr-1", amountCents: 50000, status: "pending" });
    });

    it("bloqueia (ValidationError) quando a chave Pix pertence a outro CPF", async () => {
      vi.mocked(dictKey.get).mockResolvedValue(dictFixture({ taxId: "11111111111" }));

      await expect(
        makeAdapter().createPayout({
          externalId: "bet:1",
          amountCents: 50000,
          recipient: { name: "V", taxId: "99999999999", pixKey: "v@x.com" },
          description: "Prêmio",
        }),
      ).rejects.toBeInstanceOf(ValidationError);
      expect(transfer.create).not.toHaveBeenCalled();
    });
  });

  describe("verifyAndParseWebhook", () => {
    it("mapeia invoice paid → charge.paid (com externalId da tag)", async () => {
      vi.mocked(event.parse).mockResolvedValue({
        id: "ev-1",
        subscription: "invoice",
        log: { type: "paid", invoice: { id: "inv-9", tags: ["bet:1"] } },
      } as unknown as EventT);

      const result = await makeAdapter().verifyAndParseWebhook("{}", "sig");

      expect(result).toMatchObject({
        kind: "charge.paid",
        providerId: "inv-9",
        externalId: "bet:1",
      });
    });

    it("mapeia transfer success → payout.completed", async () => {
      vi.mocked(event.parse).mockResolvedValue({
        id: "ev-2",
        subscription: "transfer",
        log: { type: "success", transfer: { id: "tr-9", externalId: "bet:1" } },
      } as unknown as EventT);

      const result = await makeAdapter().verifyAndParseWebhook("{}", "sig");

      expect(result).toMatchObject({ kind: "payout.completed", providerId: "tr-9" });
    });
  });

  it("falha com erro claro quando o Stark Bank não está configurado", async () => {
    const adapter = makeAdapter({ STARKBANK_ENVIRONMENT: "sandbox" } as unknown as Env);
    await expect(adapter.getCharge("x")).rejects.toThrow(/não configurado/);
  });
});
