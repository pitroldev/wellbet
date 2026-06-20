/**
 * Entidade de domínio Challenge — código dinâmico exibido ao vivo na captura.
 *
 * Doc de Validação §4/C2: o app GERA server-side um código (palavra + número +
 * gesto), de USO ÚNICO e com TTL curto (anti-replay, §5 "frescor"). A pessoa
 * mostra e executa o gesto no vídeo; o revisor confere que bate com o emitido.
 *
 * Pura, sem Nest — a geração do nonce/escolha do gesto é injetada (porta de
 * randomização) para manter testabilidade determinística.
 */
export type Gesture = "thumbs_up" | "peace_sign" | "open_palm" | "wave" | "point_up";

export const GESTURES: readonly Gesture[] = [
  "thumbs_up",
  "peace_sign",
  "open_palm",
  "wave",
  "point_up",
];

export interface ChallengeProps {
  readonly id: string;
  readonly userId: string;
  readonly word: string;
  readonly number: number;
  readonly gesture: Gesture;
  readonly nonce: string;
  readonly issuedAt: Date;
  readonly expiresAt: Date;
  readonly consumedAt?: Date | null;
}

export class Challenge {
  private constructor(private props: ChallengeProps) {}

  static create(props: ChallengeProps): Challenge {
    return new Challenge(props);
  }

  get id(): string {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get nonce(): string {
    return this.props.nonce;
  }

  /** Expirado se passou do TTL. */
  isExpired(now: Date = new Date()): boolean {
    return now.getTime() > this.props.expiresAt.getTime();
  }

  /** Já consumido (uso único). */
  isConsumed(): boolean {
    return this.props.consumedAt != null;
  }

  /** Válido para consumo: não expirado e não usado. */
  isValid(now: Date = new Date()): boolean {
    return !this.isExpired(now) && !this.isConsumed();
  }

  /** Marca como consumido (idempotente: só seta na primeira vez). */
  consume(now: Date = new Date()): void {
    if (this.isConsumed()) return;
    this.props = { ...this.props, consumedAt: now };
  }

  toJSON(): ChallengeProps {
    return { ...this.props };
  }
}
