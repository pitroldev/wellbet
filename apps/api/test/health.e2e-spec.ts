import { Controller, Get, type INestApplication, Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

/**
 * Exemplo de teste e2e com Supertest (runner Vitest, ver §2/§7 do doc).
 *
 * Usa um módulo mínimo isolado (sem db/queue reais) para demonstrar o setup
 * do harness HTTP. Os e2e de feature (que tocam Postgres) usarão Testcontainers
 * — fora do escopo deste scaffold. Marcado como TODO no MANIFEST.
 */
@Controller()
class HealthController {
  @Get("health")
  health(): { status: "ok" } {
    return { status: "ok" };
  }
}

@Module({ controllers: [HealthController] })
class HealthModule {}

describe("Health (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await NestFactory.create(HealthModule, { logger: false });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /health → 200 { status: ok }", async () => {
    const server = app.getHttpServer() as Parameters<typeof request>[0];
    const res = await request(server).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
