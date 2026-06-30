import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";

import { DATABASE, type DbHandle } from "@/infra/db/client.js";
import { session as authSession, user as authUser } from "@/infra/db/auth-schema.js";
import { bets, reviews, users, weighins } from "@/infra/db/schema.js";
import type {
  AdminUserRepositoryPort,
  AdminUserRow,
  ListUsersOpts,
  Role,
  UserDetailData,
} from "@/modules/admin-user/application/admin-user.repository.port.js";

/** Adapter Drizzle/Postgres da gestão de usuários (suporte/admin). */
@Injectable()
export class DrizzleAdminUserRepository implements AdminUserRepositoryPort {
  constructor(@Inject(DATABASE) private readonly handle: DbHandle) {}

  private get db(): DbHandle["db"] {
    return this.handle.db;
  }

  private whereFrom(opts: ListUsersOpts): SQL | undefined {
    const conds: SQL[] = [];
    if (opts.role) conds.push(eq(authUser.role, opts.role));
    if (opts.emailVerified !== undefined) conds.push(eq(authUser.emailVerified, opts.emailVerified));
    if (opts.q) {
      const like = `%${opts.q}%`;
      const digits = opts.q.replace(/\D/g, "");
      const ors: SQL[] = [
        ilike(authUser.name, like),
        ilike(authUser.email, like),
        ilike(users.pixKey, like),
      ];
      if (digits.length >= 3) ors.push(ilike(users.taxId, `%${digits}%`));
      const orExpr = or(...ors);
      if (orExpr) conds.push(orExpr);
    }
    return conds.length ? and(...conds) : undefined;
  }

  async list(opts: ListUsersOpts): Promise<{ items: AdminUserRow[]; total: number }> {
    const where = this.whereFrom(opts);

    // Contagens via subquery escalar correlacionada — evita inflar (cartesiano)
    // que dois LEFT JOINs de bets×weighins causariam.
    const rows = await this.db
      .select({
        authUserId: authUser.id,
        email: authUser.email,
        name: authUser.name,
        role: authUser.role,
        emailVerified: authUser.emailVerified,
        banned: authUser.banned,
        createdAt: authUser.createdAt,
        domainUserId: users.id,
        taxId: users.taxId,
        pixKey: users.pixKey,
        betsCount: sql<number>`(select count(*)::int from ${bets} b where b.user_id = ${users.id})`,
        weighinsCount: sql<number>`(select count(*)::int from ${weighins} w where w.user_id = ${users.id})`,
      })
      .from(authUser)
      .leftJoin(users, eq(users.authUserId, authUser.id))
      .where(where)
      .orderBy(desc(authUser.createdAt))
      .limit(opts.limit)
      .offset(opts.offset);

    const totalRows = await this.db
      .select({ total: sql<number>`count(*)::int` })
      .from(authUser)
      .leftJoin(users, eq(users.authUserId, authUser.id))
      .where(where);

    return {
      total: totalRows[0]?.total ?? 0,
      items: rows.map((r) => ({
        authUserId: r.authUserId,
        email: r.email,
        name: r.name,
        role: r.role as Role,
        emailVerified: r.emailVerified,
        banned: r.banned,
        createdAt: r.createdAt,
        domainUserId: r.domainUserId,
        taxId: r.taxId,
        pixKey: r.pixKey,
        betsCount: r.betsCount ?? 0,
        weighinsCount: r.weighinsCount ?? 0,
      })),
    };
  }

  async detail(authUserId: string): Promise<UserDetailData | undefined> {
    const [identity] = await this.db
      .select()
      .from(authUser)
      .where(eq(authUser.id, authUserId))
      .limit(1);
    if (!identity) return undefined;

    const [domain] = await this.db
      .select()
      .from(users)
      .where(eq(users.authUserId, authUserId))
      .limit(1);

    let betRows: UserDetailData["bets"] = [];
    let weighinRows: UserDetailData["weighins"] = [];

    if (domain) {
      const bs = await this.db
        .select()
        .from(bets)
        .where(eq(bets.userId, domain.id))
        .orderBy(desc(bets.createdAt));
      betRows = bs.map((b) => ({
        betId: b.id,
        status: b.status,
        targetWeightKg: b.targetWeightKg,
        stakeAmount: b.stakeAmount,
        payoutAmount: b.payoutAmount,
        currency: b.currency,
        payoutTransferId: b.payoutTransferId,
        createdAt: b.createdAt,
        settledAt: b.settledAt,
      }));

      const ws = await this.db
        .select({
          id: weighins.id,
          kind: weighins.kind,
          status: weighins.status,
          weightKg: weighins.weightKg,
          lossPerWeekKg: weighins.lossPerWeekKg,
          capturedAt: weighins.capturedAt,
          verdict: reviews.verdict,
        })
        .from(weighins)
        .leftJoin(reviews, eq(reviews.weighinId, weighins.id))
        .where(eq(weighins.userId, domain.id))
        .orderBy(desc(weighins.capturedAt));
      weighinRows = ws.map((w) => ({
        id: w.id,
        kind: w.kind,
        status: w.status,
        weightKg: w.weightKg,
        lossPerWeekKg: w.lossPerWeekKg,
        capturedAt: w.capturedAt,
        verdict: w.verdict ?? null,
      }));
    }

    return {
      identity: {
        authUserId: identity.id,
        email: identity.email,
        name: identity.name,
        emailVerified: identity.emailVerified,
        role: identity.role as Role,
        image: identity.image,
        banned: identity.banned,
        banReason: identity.banReason,
        bannedAt: identity.bannedAt,
        createdAt: identity.createdAt,
        updatedAt: identity.updatedAt,
      },
      domain: domain
        ? {
            userId: domain.id,
            name: domain.name,
            taxId: domain.taxId,
            pixKey: domain.pixKey,
            createdAt: domain.createdAt,
          }
        : null,
      bets: betRows,
      weighins: weighinRows,
    };
  }

  async findAuthUser(
    authUserId: string,
  ): Promise<{ id: string; email: string; role: Role } | undefined> {
    const [row] = await this.db
      .select({ id: authUser.id, email: authUser.email, role: authUser.role })
      .from(authUser)
      .where(eq(authUser.id, authUserId))
      .limit(1);
    return row ? { id: row.id, email: row.email, role: row.role as Role } : undefined;
  }

  async countAdmins(): Promise<number> {
    const [row] = await this.db
      .select({ c: sql<number>`count(*)::int` })
      .from(authUser)
      .where(eq(authUser.role, "admin"));
    return row?.c ?? 0;
  }

  async updateAuthUser(
    authUserId: string,
    patch: { name?: string; role?: Role; emailVerified?: boolean },
  ): Promise<void> {
    const set: Record<string, unknown> = { updatedAt: new Date() };
    if (patch.name !== undefined) set.name = patch.name;
    if (patch.role !== undefined) set.role = patch.role;
    if (patch.emailVerified !== undefined) set.emailVerified = patch.emailVerified;
    await this.db.update(authUser).set(set).where(eq(authUser.id, authUserId));
  }

  async updateDomainByAuthUserId(
    authUserId: string,
    patch: { name?: string; role?: Role; taxId?: string | null; pixKey?: string | null },
  ): Promise<void> {
    const set: Record<string, unknown> = { updatedAt: new Date() };
    if (patch.name !== undefined) set.name = patch.name;
    if (patch.role !== undefined) set.role = patch.role;
    if (patch.taxId !== undefined) set.taxId = patch.taxId;
    if (patch.pixKey !== undefined) set.pixKey = patch.pixKey;
    await this.db.update(users).set(set).where(eq(users.authUserId, authUserId));
  }

  async setBan(
    authUserId: string,
    patch: { banned: boolean; banReason: string | null; bannedAt: Date | null },
  ): Promise<void> {
    await this.db
      .update(authUser)
      .set({
        banned: patch.banned,
        banReason: patch.banReason,
        bannedAt: patch.bannedAt,
        updatedAt: new Date(),
      })
      .where(eq(authUser.id, authUserId));
  }

  async revokeSessions(authUserId: string): Promise<void> {
    await this.db.delete(authSession).where(eq(authSession.userId, authUserId));
  }
}
