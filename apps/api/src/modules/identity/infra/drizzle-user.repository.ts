import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import { DATABASE, type DbHandle } from "../../../infra/db/client.js";
import { users } from "../../../infra/db/schema.js";
import { User, type UserRole } from "../domain/user.entity.js";
import type { UserRepositoryPort } from "../application/user.repository.port.js";

/** Adapter Drizzle/Postgres do UserRepositoryPort. */
@Injectable()
export class DrizzleUserRepository implements UserRepositoryPort {
  constructor(@Inject(DATABASE) private readonly handle: DbHandle) {}

  async save(user: User): Promise<void> {
    const p = user.toJSON();
    await this.handle.db
      .insert(users)
      .values({
        id: p.id,
        email: p.email,
        name: p.name ?? null,
        role: p.role,
        authUserId: p.authUserId ?? null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { name: p.name ?? null, role: p.role },
      });
  }

  async findById(id: string): Promise<User | undefined> {
    const [row] = await this.handle.db.select().from(users).where(eq(users.id, id)).limit(1);
    return row ? this.toDomain(row) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [row] = await this.handle.db.select().from(users).where(eq(users.email, email)).limit(1);
    return row ? this.toDomain(row) : undefined;
  }

  async findByAuthUserId(authUserId: string): Promise<User | undefined> {
    const [row] = await this.handle.db
      .select()
      .from(users)
      .where(eq(users.authUserId, authUserId))
      .limit(1);
    return row ? this.toDomain(row) : undefined;
  }

  private toDomain(row: typeof users.$inferSelect): User {
    return User.create({
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role as UserRole,
      authUserId: row.authUserId,
    });
  }
}
