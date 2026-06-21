import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "@/app.module.js";
import { QUEUE } from "@/infra/queue/queue.port.js";
import { AUTH } from "@/infra/auth/auth.js";
import { PAYMENT } from "@/infra/payment/payment.port.js";
import {
  IDEMPOTENCY_STORE,
  type IdempotencyRecord,
} from "@/shared/idempotency/idempotency.port.js";
import { USER_REPOSITORY } from "@/modules/identity/application/user.repository.port.js";
import { BET_REPOSITORY } from "@/modules/bet/application/bet.repository.port.js";
import { Bet } from "@/modules/bet/domain/bet.entity.js";
import { User } from "@/modules/identity/domain/user.entity.js";

/**
 * E2E do app REAL: sobe o AppModule INTEIRO (todos os módulos + pipes/guards
 * globais) e exercita a camada HTTP via Supertest. Cobre o que os testes
 * unitários NÃO pegam: a DI de ponta a ponta, o AuthGuard fail-closed, o caminho
 * autenticado e o caminho FINANCEIRO (criar aposta + idempotência anti-cobrança-
 * dupla) — tudo sem tocar Postgres (adapters de borda fakeados).
 */
const TEST_USER = { id: "auth-user-1", email: "tester@charya.app", role: "user" as const };

// Usuário de domínio com perfil COMPLETO (taxId/pixKey) — exigido para apostar.
const TEST_USER_ENTITY = User.create({
  id: TEST_USER.id,
  email: TEST_USER.email,
  name: "Tester",
  role: "user",
  taxId: "12345678909",
  pixKey: TEST_USER.email,
});

const fakeQueue = {
  publish: (): Promise<string | null> => Promise.resolve(null),
  subscribe: (): Promise<void> => Promise.resolve(),
};

const fakeAuth = {
  // toNodeHandler(this.auth) é montado em /api/auth/* (não exercitado aqui).
  handler: (): Response => new Response(null, { status: 404 }),
  api: {
    getSession: ({ headers }: { headers: Headers }) =>
      Promise.resolve(headers.get("x-test-auth") ? { user: TEST_USER } : null),
  },
};

const fakeUserRepo = {
  findByAuthUserId: () => Promise.resolve(undefined),
  findById: () => Promise.resolve(TEST_USER_ENTITY),
  findByEmail: () => Promise.resolve(undefined),
  save: () => Promise.resolve(),
};

// Aposta aguardando pagamento, vinculada à cobrança `charge-test-1`.
function pendingBet(): Bet {
  return Bet.create({
    id: "bet-webhook-1",
    userId: TEST_USER.id,
    startWeightKg: 85,
    targetWeightKg: 75,
    stakeAmount: "100.00",
    payoutAmount: "100.00",
    currency: "BRL",
    status: "pending_payment",
    stakeChargeId: "charge-test-1",
    payoutTransferId: null,
    settledAt: null,
  });
}

// Captura das apostas salvas — para conferir a transição de estado no webhook.
const savedBets: Bet[] = [];

const fakeBetRepo = {
  save: (bet: Bet) => {
    savedBets.push(bet);
    return Promise.resolve();
  },
  findById: () => Promise.resolve(undefined),
  findByStakeChargeId: () => Promise.resolve(pendingBet()),
  listByUser: () => Promise.resolve([]),
  listAll: () => Promise.resolve([]),
};

const fakePayment = {
  createPixCharge: () =>
    Promise.resolve({
      providerId: "charge-test-1",
      brcode: "00020101br-code-de-teste-5204",
      expiresAt: new Date("2026-12-31T23:59:59.000Z"),
    }),
  // A assinatura É a auth do PSP: só `valid-sig` "verifica" e devolve o evento.
  verifyAndParseWebhook: (_rawBody: string, signature: string) =>
    signature === "valid-sig"
      ? Promise.resolve({ kind: "charge.paid" as const, providerId: "charge-test-1" })
      : Promise.reject(new Error("invalid signature")),
};

// Store de idempotência in-memory: cobre o replay (mesma chave → mesma resposta).
const idemStore = new Map<string, IdempotencyRecord>();
const fakeIdempotencyStore = {
  find: (key: string) => Promise.resolve(idemStore.get(key)),
  save: (record: IdempotencyRecord) => {
    idemStore.set(record.key, record);
    return Promise.resolve();
  },
};

describe("App (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(QUEUE)
      .useValue(fakeQueue)
      .overrideProvider(AUTH)
      .useValue(fakeAuth)
      .overrideProvider(USER_REPOSITORY)
      .useValue(fakeUserRepo)
      .overrideProvider(BET_REPOSITORY)
      .useValue(fakeBetRepo)
      .overrideProvider(PAYMENT)
      .useValue(fakePayment)
      .overrideProvider(IDEMPOTENCY_STORE)
      .useValue(fakeIdempotencyStore)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api", { exclude: ["docs", "docs-json"] });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  function server(): Parameters<typeof request>[0] {
    return app.getHttpServer() as Parameters<typeof request>[0];
  }

  it("sobe o AppModule inteiro (a DI de todos os módulos resolve)", () => {
    expect(app).toBeDefined();
  });

  it("GET /api/health → 200 (rota @Public)", async () => {
    const res = await request(server()).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok" });
  });

  it("GET /api/me sem sessão → 401 (AuthGuard fail-closed)", async () => {
    const res = await request(server()).get("/api/me");
    expect(res.status).toBe(401);
  });

  it("POST /api/bets sem sessão → 401 (escrita protegida pelo guard global)", async () => {
    const res = await request(server()).post("/api/bets").send({ targetWeightKg: 75 });
    expect(res.status).toBe(401);
  });

  it("rota inexistente → 404", async () => {
    const res = await request(server()).get("/api/nao-existe-mesmo");
    expect(res.status).toBe(404);
  });

  it("GET /api/me COM sessão → 200 + perfil (get-or-create no 1º acesso)", async () => {
    const res = await request(server()).get("/api/me").set("x-test-auth", TEST_USER.id);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      email: TEST_USER.email,
      role: "user",
      taxId: null,
      pixKey: null,
    });
  });

  it("PUT /api/me/profile COM sessão + body inválido → 400 (auth passou, validação barra)", async () => {
    const res = await request(server())
      .put("/api/me/profile")
      .set("x-test-auth", TEST_USER.id)
      .send({});
    expect(res.status).toBe(400);
  });

  it("POST /api/bets COM sessão + Idempotency-Key → cria a aposta + BR Code do Pix", async () => {
    const res = await request(server())
      .post("/api/bets")
      .set("x-test-auth", TEST_USER.id)
      .set("Idempotency-Key", "place-key-1")
      .send({ targetWeightKg: 75, startWeightKg: 85, stakeAmount: "100.00", currency: "BRL" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      status: "pending_payment",
      brcode: "00020101br-code-de-teste-5204",
    });
    expect(typeof (res.body as { betId?: unknown }).betId).toBe("string");
  });

  it("POST /api/bets repetido com a MESMA Idempotency-Key → replay (mesmo betId, sem cobrar 2x)", async () => {
    const body = { targetWeightKg: 70, stakeAmount: "50.00" };
    const first = await request(server())
      .post("/api/bets")
      .set("x-test-auth", TEST_USER.id)
      .set("Idempotency-Key", "idem-key-1")
      .send(body);
    const second = await request(server())
      .post("/api/bets")
      .set("x-test-auth", TEST_USER.id)
      .set("Idempotency-Key", "idem-key-1")
      .send(body);

    expect(first.status).toBe(201);
    const firstBody = first.body as { betId: string };
    const secondBody = second.body as { betId: string };
    expect(secondBody.betId).toBe(firstBody.betId);
  });

  it("POST /api/webhooks/starkbank charge.paid (assinatura válida) → 200 + aposta aberta", async () => {
    savedBets.length = 0;
    const res = await request(server())
      .post("/api/webhooks/starkbank")
      .set("digital-signature", "valid-sig")
      .send({ event: { log: { invoice: { id: 1 } } } });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true });
    expect(savedBets.some((b) => b.status === "open")).toBe(true);
  });

  it("POST /api/webhooks/starkbank com assinatura inválida → 401 (rejeitado, não processa)", async () => {
    savedBets.length = 0;
    const res = await request(server())
      .post("/api/webhooks/starkbank")
      .set("digital-signature", "forjada")
      .send({ event: {} });
    expect(res.status).toBe(401);
    expect(savedBets).toHaveLength(0);
  });
});
