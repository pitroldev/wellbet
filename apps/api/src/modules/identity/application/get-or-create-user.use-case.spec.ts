import { describe, expect, it, vi } from "vitest";

import { User } from "@/modules/identity/domain/user.entity.js";
import { GetOrCreateUserUseCase } from "./get-or-create-user.use-case.js";

function makeDeps() {
  const repo = {
    save: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByAuthUserId: vi.fn(),
  };
  const uc = new GetOrCreateUserUseCase(repo);
  return { repo, uc };
}

const cmd = { authUserId: "auth-1", email: "fulano@example.com", name: "Fulano" };

describe("GetOrCreateUserUseCase (sync domínio ↔ Better Auth)", () => {
  it("já existe para o authUserId → retorna o existente, sem criar/salvar", async () => {
    const { repo, uc } = makeDeps();
    const existing = User.create({
      id: "u-existente",
      email: "fulano@example.com",
      name: "Fulano",
      role: "reviewer",
      authUserId: "auth-1",
    });
    repo.findByAuthUserId.mockResolvedValue(existing);

    const result = await uc.execute(cmd);

    expect(result).toBe(existing);
    expect(repo.findByAuthUserId).toHaveBeenCalledWith("auth-1");
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("não existe → cria com role 'user', vincula authUserId e persiste", async () => {
    const { repo, uc } = makeDeps();
    repo.findByAuthUserId.mockResolvedValue(undefined);

    const result = await uc.execute(cmd);

    expect(repo.save).toHaveBeenCalledTimes(1);
    const saved = repo.save.mock.calls[0]?.[0] as User;
    expect(saved).toBe(result);
    expect(result).toBeInstanceOf(User);
    expect(result.toJSON()).toMatchObject({
      email: "fulano@example.com",
      name: "Fulano",
      role: "user",
      authUserId: "auth-1",
    });
  });

  it("ao criar, gera um id (uuid) não vazio", async () => {
    const { repo, uc } = makeDeps();
    repo.findByAuthUserId.mockResolvedValue(undefined);

    const result = await uc.execute(cmd);

    expect(result.id).toEqual(expect.any(String));
    expect(result.id.length).toBeGreaterThan(0);
  });

  it("ids gerados são únicos entre criações distintas", async () => {
    const { repo, uc } = makeDeps();
    repo.findByAuthUserId.mockResolvedValue(undefined);

    const a = await uc.execute({ authUserId: "auth-a", email: "a@example.com" });
    const b = await uc.execute({ authUserId: "auth-b", email: "b@example.com" });

    expect(a.id).not.toBe(b.id);
  });

  it("sem name no comando → name null no usuário criado", async () => {
    const { repo, uc } = makeDeps();
    repo.findByAuthUserId.mockResolvedValue(undefined);

    const result = await uc.execute({ authUserId: "auth-1", email: "fulano@example.com" });

    expect(result.name).toBeNull();
  });

  it("name null explícito no comando → name null", async () => {
    const { repo, uc } = makeDeps();
    repo.findByAuthUserId.mockResolvedValue(undefined);

    const result = await uc.execute({
      authUserId: "auth-1",
      email: "fulano@example.com",
      name: null,
    });

    expect(result.name).toBeNull();
  });

  it("o usuário criado começa sem perfil de pagamento (taxId/pixKey null)", async () => {
    const { repo, uc } = makeDeps();
    repo.findByAuthUserId.mockResolvedValue(undefined);

    const result = await uc.execute(cmd);

    expect(result.taxId).toBeNull();
    expect(result.pixKey).toBeNull();
  });

  it("busca sempre pelo authUserId da sessão (não por email)", async () => {
    const { repo, uc } = makeDeps();
    repo.findByAuthUserId.mockResolvedValue(undefined);

    await uc.execute(cmd);

    expect(repo.findByAuthUserId).toHaveBeenCalledWith("auth-1");
    expect(repo.findByEmail).not.toHaveBeenCalled();
  });
});
