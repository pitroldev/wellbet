import { Controller, HttpCode, Inject, Post, type RawBodyRequest, Req } from "@nestjs/common";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";
import type { Request } from "express";

import { PAYMENT, type PaymentPort } from "../../infra/payment/payment.port.js";
import { Public } from "../../shared/guards/auth.guard.js";
import { ProcessPaymentEventUseCase } from "./process-payment-event.use-case.js";

/**
 * Webhook do Stark Bank: confirma pagamentos.
 *
 * - `@Public()`: rota aberta (o PSP não envia sessão). A SEGURANÇA é a
 *   verificação da ASSINATURA (header `digital-signature`) feita no adapter.
 * - Lê o RAW body (`req.rawBody`): o `event.parse` exige o corpo CRU, não o JSON
 *   re-serializado. `rawBody: true` é habilitado no bootstrap (main.ts).
 * - `@SkipThrottle()`: não limitar reentregas legítimas do PSP.
 */
@Controller("webhooks/starkbank")
export class PaymentWebhookController {
  constructor(
    @Inject(PAYMENT) private readonly payment: PaymentPort,
    private readonly process: ProcessPaymentEventUseCase,
  ) {}

  @Post()
  @Public()
  @SkipThrottle()
  @HttpCode(200)
  @ApiExcludeEndpoint()
  async handle(@Req() req: RawBodyRequest<Request>): Promise<{ ok: true }> {
    const header = req.headers["digital-signature"];
    const signature = Array.isArray(header) ? (header[0] ?? "") : (header ?? "");
    const rawBody = req.rawBody?.toString() ?? "";

    const event = await this.payment.verifyAndParseWebhook(rawBody, signature);
    await this.process.execute(event);
    return { ok: true };
  }
}
