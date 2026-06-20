import { Inject, Injectable } from "@nestjs/common";

import { ConflictError, ErrorCode, NotFoundError } from "../../../shared/errors.js";
import {
  WEIGHIN_REPOSITORY,
  type WeighInRepositoryPort,
} from "../../weighin/application/weighin.repository.port.js";
import type { BetStatus } from "../domain/bet.entity.js";
import { BET_REPOSITORY, type BetRepositoryPort } from "./bet.repository.port.js";

export interface SettleBetCommand {
  readonly betId: string;
  /** Pesagem final APROVADA que dispara o settlement. */
  readonly weighinId: string;
}

export interface SettleBetResult {
  readonly betId: string;
  readonly status: BetStatus;
}

/**
 * SettleBetUseCase — liquida a aposta após veredito APROVADO (doc §7).
 *
 * Consumido pelo worker da fila `bet.settle` (publicado por SubmitVerdict).
 * Idempotência:
 *  - a publicação usa singletonKey por pesagem (dedup na fila);
 *  - aqui, só liquida apostas em estado liquidável (open/settling); apostas já
 *    won/lost/voided são no-op seguro (replay do job não re-credita).
 */
@Injectable()
export class SettleBetUseCase {
  constructor(
    @Inject(BET_REPOSITORY) private readonly bets: BetRepositoryPort,
    @Inject(WEIGHIN_REPOSITORY)
    private readonly weighins: WeighInRepositoryPort,
  ) {}

  async execute(cmd: SettleBetCommand): Promise<SettleBetResult> {
    const bet = await this.bets.findById(cmd.betId);
    if (!bet) {
      throw new NotFoundError("Aposta não encontrada.", { betId: cmd.betId });
    }

    // Replay seguro: aposta já liquidada → retorna estado atual sem reprocessar.
    if (!bet.isSettleable()) {
      return { betId: bet.id, status: bet.status };
    }

    const weighin = await this.weighins.findById(cmd.weighinId);
    if (!weighin) {
      throw new NotFoundError("Pesagem final não encontrada.", {
        weighinId: cmd.weighinId,
      });
    }
    if (weighin.status !== "approved") {
      throw new ConflictError(
        ErrorCode.BET_NOT_SETTLEABLE,
        "Settlement exige pesagem final APROVADA pela revisão.",
      );
    }

    bet.beginSettlement();
    const status = bet.settleWith(weighin.weightKg);
    await this.bets.save(bet);

    // TODO(payment): em caso de vitória, pagar o prêmio via PaymentPort (já
    // existe: infra/payment, token PAYMENT, adapter Stark Bank):
    //   await this.payment.createPayout({
    //     externalId: `bet:${bet.id}`, amountCents: payout,
    //     recipient: { name, taxId, pixKey }, description: "Prêmio Charya",
    //   });
    // Requer no modelo: chave Pix + CPF do vencedor (perfil) e o valor do
    // prêmio. Idempotência via externalId. O adapter resolve a chave no DICT e
    // emite a transferência Pix; o webhook confirma o `payout.completed`.

    return { betId: bet.id, status };
  }
}
