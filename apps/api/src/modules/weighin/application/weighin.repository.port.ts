/**
 * Port do repositório de pesagens (camada application).
 *
 * Interface na application, adapter Drizzle na infra (§2 do doc). O use-case
 * depende SÓ deste contrato — trocar a persistência não muda o use-case.
 */
import type { WeighIn, WeighInKind } from "@/modules/weighin/domain/weighin.entity.js";

export interface WeighInRepositoryPort {
  save(weighin: WeighIn): Promise<void>;

  findById(id: string): Promise<WeighIn | undefined>;

  /** Pesagem anterior do usuário (para calcular perda/semana na sanidade). */
  findPrevious(args: {
    userId: string;
    betId?: string | null;
    before: Date;
  }): Promise<WeighIn | undefined>;

  /** Lista pesagens de um usuário, opcionalmente por tipo (T0/T1/T2). */
  listByUser(args: { userId: string; kind?: WeighInKind }): Promise<WeighIn[]>;
}

export const WEIGHIN_REPOSITORY = Symbol("WEIGHIN_REPOSITORY");
