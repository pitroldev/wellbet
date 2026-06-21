import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "@/app.module.js";
import { QUEUE } from "@/infra/queue/queue.port.js";
import { AUTH } from "@/infra/auth/auth.js";
import { USER_REPOSITORY } from "@/modules/identity/application/user.repository.port.js";

/**
 * E2E do app REAL: sobe o AppModule INTEIRO (todos os módulos + pipes/guards
 * globais) e exercita a camada HTTP via Supertest. Verifica o que os testes
 * unitários NÃO cobrem: a DI de ponta a ponta (o app inicializa de fato?), o
 * prefixo global, o AuthGuard fail-closed e o caminho AUTENTICADO ponta a ponta
 * (middleware popula req.user → guard → controller → use-case → serialização).
 *
 * Infra fakeada (mínima):
 *  - QUEUE: seu onModuleInit faz `pgboss.start()` (conecta no Postgres).
 *  - AUTH: o middleware chama `auth.api.getSession`; o fake devolve uma sessão
 *    quando há o header `x-test-auth` (e nada sem ele → continua fail-closed).
 *  - USER_REPOSITORY: in-memory, para o GET /me autenticado não tocar o Postgres.
 */
const TEST_USER = { id: "auth-user-1", email: "tester@charya.app", role: "user" as const };

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
  findById: () => Promise.resolve(undefined),
  findByEmail: () => Promise.resolve(undefined),
  save: () => Promise.resolve(),
};

describe("App (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QUEUE)
      .useValue(fakeQueue)
      .overrideProvider(AUTH)
      .useValue(fakeAuth)
      .overrideProvider(USER_REPOSITORY)
      .useValue(fakeUserRepo)
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
});
