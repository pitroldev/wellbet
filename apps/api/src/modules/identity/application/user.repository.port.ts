/**
 * Port do repositório de usuários (camada application).
 */
import type { User } from "../domain/user.entity.js";

export interface UserRepositoryPort {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findByAuthUserId(authUserId: string): Promise<User | undefined>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");
