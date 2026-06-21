import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { AppModule } from "@/app.module.js";
import { QUEUE } from "@/infra/queue/queue.port.js";

/**
 * E2E do app REAL: sobe o AppModule INTEIRO (todos os módulos + pipes/guards
 * globais) e exercita a camada HTTP via Supertest. Verifica o que os testes
 * unitários NÃO cobrem: a DI de ponta a ponta (o app inicializa de fato?), o
 * prefixo global e o AuthGuard fail-closed (toda rota exige sessão por padrão).
 *
 * Infra fakeada: só a QUEUE precisa de override — seu `onModuleInit` chama
 * `pgboss.start()`, que conecta no Postgres. DATABASE/AUTH são lazy e não são
 * tocados pelas rotas sem sessão aqui testadas (o guard barra antes do handler).
 */
const fakeQueue = {
  publish: (): Promise<string | null> => Promise.resolve(null),
  subscribe: (): Promise<void> => Promise.resolve(),
};

describe("App (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QUEUE)
      .useValue(fakeQueue)
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
});
