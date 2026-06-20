/**
 * Port de pagamentos (Pix in/out) — fronteira de PSP atrás de interface.
 *
 * O domínio fala com `PaymentPort`; trocar Stark Bank por outro provedor de
 * pagamento = novo adapter, zero mudança no use-case (ports & adapters, §0/§2).
 *
 * Consumido por:
 *  - `bet/place-bet`  → {@link PaymentPort.createPixCharge} (recebe o stake)
 *  - `bet/settle-bet` → {@link PaymentPort.createPayout} (paga o prêmio)
 *  - um webhook HTTP  → {@link PaymentPort.verifyAndParseWebhook} (confirma pago)
 *
 * Valores SEMPRE em centavos (inteiro), coerente com `Money` de @charya/schemas.
 */

export type PaymentStatus = "created" | "pending" | "paid" | "failed" | "canceled" | "expired";

/* -------------------------------------------------------------------------- */
/* Cobrança (receber o stake)                                                  */
/* -------------------------------------------------------------------------- */

export interface CreatePixChargeInput {
  /** Idempotência/rastreio — use o id da aposta (ex.: `bet:{betId}`). */
  readonly externalId: string;
  /** Valor em centavos (>= 0). */
  readonly amountCents: number;
  /** Pagador — nome e CPF/CNPJ (só dígitos). */
  readonly payer: { readonly name: string; readonly taxId: string };
  readonly description: string;
  /** Validade da cobrança em segundos (default no adapter/env). */
  readonly expiresInSeconds?: number;
}

export interface PixCharge {
  /** Id do recurso no PSP. */
  readonly providerId: string;
  /** Pix copia-e-cola (BR Code) para o app exibir. */
  readonly brcode: string;
  readonly amountCents: number;
  readonly status: PaymentStatus;
  readonly expiresAt: Date;
}

/* -------------------------------------------------------------------------- */
/* Payout (pagar o prêmio)                                                     */
/* -------------------------------------------------------------------------- */

export interface CreatePayoutInput {
  /** Idempotência/rastreio — use o id da aposta. */
  readonly externalId: string;
  readonly amountCents: number;
  /** Beneficiário e a chave Pix de destino. */
  readonly recipient: {
    readonly name: string;
    readonly taxId: string;
    readonly pixKey: string;
  };
  readonly description: string;
}

export interface Payout {
  readonly providerId: string;
  readonly amountCents: number;
  readonly status: PaymentStatus;
}

/* -------------------------------------------------------------------------- */
/* Webhook                                                                     */
/* -------------------------------------------------------------------------- */

export type PaymentEventKind =
  | "charge.paid"
  | "charge.expired"
  | "charge.canceled"
  | "payout.completed"
  | "payout.failed"
  | "unknown";

export interface PaymentWebhookEvent {
  readonly kind: PaymentEventKind;
  /** Id do recurso (invoice/transfer) que disparou o evento. */
  readonly providerId: string;
  /** `externalId` original, quando o PSP o propaga. */
  readonly externalId?: string;
  /** Payload bruto verificado (para auditoria/depuração). */
  readonly raw: unknown;
}

/* -------------------------------------------------------------------------- */
/* Port                                                                        */
/* -------------------------------------------------------------------------- */

export interface PaymentPort {
  /** Cria uma cobrança Pix (recebe o stake). */
  createPixCharge(input: CreatePixChargeInput): Promise<PixCharge>;

  /** Consulta o status de uma cobrança. */
  getCharge(providerId: string): Promise<PixCharge>;

  /** Envia um pagamento Pix (paga o payout ao vencedor). */
  createPayout(input: CreatePayoutInput): Promise<Payout>;

  /**
   * Verifica a assinatura e parseia um webhook do PSP. DEVE lançar se a
   * assinatura for inválida (anti-spoofing).
   */
  verifyAndParseWebhook(rawBody: string, signature: string): Promise<PaymentWebhookEvent>;
}

/** Token de DI do provedor de pagamento. */
export const PAYMENT = Symbol("PAYMENT");
