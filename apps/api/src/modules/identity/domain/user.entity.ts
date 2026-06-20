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

  isReviewer(): boolean {
    return this.props.role === "reviewer" || this.props.role === "admin";
  }

  toJSON(): UserProps {
    return { ...this.props };
  }
}
