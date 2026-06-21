/**
 * Entidade de domínio User — pura, sem Nest.
 *
 * O backend mantém o registro de usuário do domínio; o Better Auth cuida das
 * credenciais/sessão (vínculo via `authUserId`). Papéis controlam acesso ao
 * console de revisão (RolesGuard).
 */
export type UserRole = "user" | "reviewer" | "admin";

export interface UserProps {
  readonly id: string;
  readonly email: string;
  readonly name?: string | null;
  readonly role: UserRole;
  /** CPF/CNPJ (só dígitos) — necessário para cobrar/pagar via Pix. */
  readonly taxId?: string | null;
  /** Chave Pix para receber o payout. */
  readonly pixKey?: string | null;
  readonly authUserId?: string | null;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: UserProps): User {
    return new User(props);
  }

  get id(): string {
    return this.props.id;
  }
  get email(): string {
    return this.props.email;
  }
  get role(): UserRole {
    return this.props.role;
  }
  get name(): string | null {
    return this.props.name ?? null;
  }
  get taxId(): string | null {
    return this.props.taxId ?? null;
  }
  get pixKey(): string | null {
    return this.props.pixKey ?? null;
  }

  isReviewer(): boolean {
    return this.props.role === "reviewer" || this.props.role === "admin";
  }

  toJSON(): UserProps {
    return { ...this.props };
  }
}
