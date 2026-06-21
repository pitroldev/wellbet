import { Inject, Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { dictKey, event, Invoice, invoice, Project, Transfer, transfer } from "starkbank";

import { ENV, type Env } from "../../config/config.module.js";
import { ValidationError } from "../../shared/errors.js";
import type {
  CreatePayoutInput,
  CreatePixChargeInput,
  PaymentEventKind,
  PaymentPort,
  PaymentStatus,
  PaymentWebhookEvent,
  Payout,
  PixCharge,
} from "./payment.port.js";

/**
 * Adapter Stark Bank do {@link PaymentPort} (Pix in/out).
 *
 * - Receber stake → `Invoice` (cobrança Pix com BR Code).
 * - Pagar payout  → resolve a chave Pix no DICT (`dictKey.get`) e emite um
 *   `Transfer` (ISPB de 8 dígitos no `bankCode` ⇒ transferência Pix).
 * - Webhook       → `event.parse` (verifica a assinatura; lança se inválida).
 *
 * Single-tenant: o `Project` (credencial) é criado uma vez no boot e passado
 * explicitamente em cada chamada (`{ user }`), sem mutar estado global do SDK.
 * Trocar de PSP = novo adapter; o domínio (place-bet/settle-bet) não muda.
 */
@Injectable()
export class StarkBankPaymentAdapter implements PaymentPort, OnModuleInit {
  private readonly logger = new Logger(StarkBankPaymentAdapter.name);
  private project: Project | undefined;

  constructor(@Inject(ENV) private readonly env: Env) {}

  onModuleInit(): void {
    const { STARKBANK_PROJECT_ID, STARKBANK_PRIVATE_KEY, STARKBANK_ENVIRONMENT } = this.env;

    if (!STARKBANK_PROJECT_ID || !STARKBANK_PRIVATE_KEY) {
      // Sem credencial a api SOBE (dev/sem pagamentos); usar o adapter falha
      // com erro claro (ver requireProject).
      this.logger.warn(
        "Stark Bank não configurado (STARKBANK_PROJECT_ID/PRIVATE_KEY ausentes) — pagamentos desabilitados.",
      );
      return;
    }

    this.project = new Project({
      environment: STARKBANK_ENVIRONMENT,
      id: STARKBANK_PROJECT_ID,
      privateKey: STARKBANK_PRIVATE_KEY,
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Cobrança (receber o stake)                                              */
  /* ---------------------------------------------------------------------- */

  async createPixCharge(input: CreatePixChargeInput): Promise<PixCharge> {
    const user = this.requireProject();

    // Idempotência: o Invoice do Stark Bank NÃO tem `externalId` (ao contrário
    // do Transfer), então deduplicamos por TAG (= externalId). Se já existe uma
    // cobrança viva para esta aposta, reaproveita em vez de criar duplicata
    // (retry-safe — sem cobrar o usuário duas vezes).
    const existing = await invoice.query({ tags: [input.externalId], user });
    const reusable = existing.find(
      (i) => i.status === "created" || i.status === "registered" || i.status === "paid",
    );
    if (reusable) {
      return this.toPixCharge(reusable);
    }

    const expiration = input.expiresInSeconds ?? this.env.STARKBANK_INVOICE_EXPIRATION_SECONDS;

    // `due = agora` + `expiration` (segundos) ⇒ janela curta de pagamento do
    // stake, em vez do default do Stark Bank (now + 2 dias).
    const due = new Date().toISOString();

    const [created] = await invoice.create(
      [
        new Invoice({
          amount: input.amountCents,
          name: input.payer.name,
          taxId: input.payer.taxId,
          due,
          expiration,
          tags: [input.externalId],
          descriptions: [{ key: "ref", value: input.description }],
        }),
      ],
      { user },
    );

    if (!created) {
      throw new Error("Stark Bank: criação de cobrança não retornou Invoice.");
    }
    return this.toPixCharge(created);
  }

  async getCharge(providerId: string): Promise<PixCharge> {
    const user = this.requireProject();
    const found = await invoice.get(providerId, { user });
    return this.toPixCharge(found);
  }

  /* ---------------------------------------------------------------------- */
  /* Payout (pagar o prêmio)                                                 */
  /* ---------------------------------------------------------------------- */

  async createPayout(input: CreatePayoutInput): Promise<Payout> {
    const user = this.requireProject();

    // 1) Resolve a chave Pix no DICT → dados bancários autoritativos do titular.
    const key = await dictKey.get(input.recipient.pixKey, { user });

    // Segurança: o payout só pode ir para o CPF/CNPJ do beneficiário esperado
    // (ex.: o dono da aposta). Bloqueia chave Pix de terceiro.
    if (normalizeTaxId(key.taxId) !== normalizeTaxId(input.recipient.taxId)) {
      throw new ValidationError(
        "A chave Pix informada pertence a outro CPF/CNPJ que não o do beneficiário.",
        { pixKey: input.recipient.pixKey },
      );
    }

    // 2) Emite a transferência Pix (ISPB de 8 dígitos no bankCode).
    const [created] = await transfer.create(
      [
        new Transfer({
          amount: input.amountCents,
          name: key.name,
          taxId: key.taxId,
          bankCode: key.ispb,
          branchCode: key.branchCode,
          accountNumber: key.accountNumber,
          accountType: mapAccountType(key.accountType),
          externalId: input.externalId,
          description: input.description,
          tags: [input.externalId],
        }),
      ],
      { user },
    );

    if (!created) {
      throw new Error("Stark Bank: criação de payout não retornou Transfer.");
    }
    return {
      providerId: created.id,
      amountCents: created.amount,
      status: mapTransferStatus(created.status),
    };
  }

  /* ---------------------------------------------------------------------- */
  /* Webhook                                                                 */
  /* ---------------------------------------------------------------------- */

  async verifyAndParseWebhook(rawBody: string, signature: string): Promise<PaymentWebhookEvent> {
    const user = this.requireProject();
    // `event.parse` VERIFICA a assinatura (lança InvalidSignatureError se não
    // bater com a chave pública do Stark Bank) e retorna o evento parseado.
    const parsed = await event.parse({ content: rawBody, signature, user });
    return this.toWebhookEvent(parsed);
  }

  /* ---------------------------------------------------------------------- */
  /* Internos                                                                */
  /* ---------------------------------------------------------------------- */

  private requireProject(): Project {
    if (!this.project) {
      throw new Error(
        "Stark Bank não configurado: defina STARKBANK_PROJECT_ID e STARKBANK_PRIVATE_KEY.",
      );
    }
    return this.project;
  }

  private toPixCharge(inv: Invoice): PixCharge {
    const dueMs = Date.parse(inv.due);
    const expiresAt = Number.isNaN(dueMs)
      ? new Date(Date.now() + inv.expiration * 1000)
      : new Date(dueMs + inv.expiration * 1000);

    return {
      providerId: inv.id,
      brcode: inv.brcode,
      amountCents: inv.amount,
      status: mapInvoiceStatus(inv.status),
      expiresAt,
    };
  }

  private toWebhookEvent(parsed: {
    subscription: string;
    id: string;
    log: unknown;
  }): PaymentWebhookEvent {
    // O `log` é uma união de Logs por recurso; narrowing por `subscription`.
    const log = parsed.log as {
      type?: string;
      invoice?: { id: string; tags?: string[] | null };
      transfer?: { id: string; externalId?: string | null };
    };

    if (parsed.subscription === "invoice" && log.invoice) {
      return {
        kind: invoiceEventKind(log.type),
        providerId: log.invoice.id,
        externalId: log.invoice.tags?.[0],
        raw: parsed,
      };
    }

    if (parsed.subscription === "transfer" && log.transfer) {
      return {
        kind: transferEventKind(log.type),
        providerId: log.transfer.id,
        externalId: log.transfer.externalId ?? undefined,
        raw: parsed,
      };
    }

    return { kind: "unknown", providerId: parsed.id, raw: parsed };
  }
}

/* -------------------------------------------------------------------------- */
/* Mapeamento de status / eventos                                              */
/* -------------------------------------------------------------------------- */

function mapInvoiceStatus(status: string): PaymentStatus {
  switch (status) {
    case "paid":
      return "paid";
    case "canceled":
      return "canceled";
    case "expired":
    case "overdue":
      return "expired";
    case "created":
    case "registered":
      return "created";
    default:
      return "pending";
  }
}

function mapTransferStatus(status: string): PaymentStatus {
  switch (status) {
    case "success":
      return "paid";
    case "failed":
    case "canceled":
      return "failed";
    default:
      return "pending"; // created | processing
  }
}

function invoiceEventKind(type: string | undefined): PaymentEventKind {
  switch (type) {
    case "paid":
      return "charge.paid";
    case "canceled":
      return "charge.canceled";
    case "expired":
    case "overdue":
      return "charge.expired";
    default:
      return "unknown";
  }
}

function transferEventKind(type: string | undefined): PaymentEventKind {
  switch (type) {
    case "success":
      return "payout.completed";
    case "failed":
      return "payout.failed";
    default:
      return "unknown";
  }
}

/**
 * O DICT (`dictKey`) retorna `accountType` como `'saving'` (singular), mas o
 * `Transfer` espera `'savings'` (plural). Normaliza para o vocabulário do
 * Transfer; os demais valores ('checking'/'salary'/'payment') passam direto.
 */
function mapAccountType(accountType: string): string {
  return accountType === "saving" ? "savings" : accountType;
}

/** Remove formatação de CPF/CNPJ para comparar só os dígitos. */
function normalizeTaxId(taxId: string): string {
  return taxId.replace(/\D/g, "");
}
