import { describe, expect, it, vi } from "vitest";

import { User } from "@/modules/identity/domain/user.entity.js";
import { GetOrCreateUserUseCase } from "./get-or-create-user.use-case.js";
import { UpdateMyProfileUseCase } from "./update-my-profile.use-case.js";

function makeDeps() {
  const repo = {
    save: vi.fn(),
    findById: vi.fn(),
    findByEmail: vi.fn(),
    findByAuthUserId: vi.fn(),
  };
  const getOrCreate = new GetOrCreateUserUseCase(repo);
  const uc = new UpdateMyProfileUseCase(getOrCreate, repo);
  return { repo, getOrCreate, uc };
}

const cmd = {
  authUserId: "auth-1",
  email: "fulano@example.com",
  taxId: "12345678900",
  pixKey: "fulano@pix.com",
};

describe("UpdateMyProfileUseCase (grava taxId + pixKey)", () => {
  it("usuário já existe → grava perfil de pagamento e persiste", async () => {
    const { repo, uc } = makeDeps();
    const existing = User.create({
      id: "u-1",
      email: "fulano@example.com",
      name: "Fulano",
      role: "user",
      authUserId: "auth-1",
    });
    repo.findByAuthUserId.mockResolvedValue(existing);

    const result = await uc.execute(cmd);

    expect(result).toBe(existing);
    expect(result.taxId).toBe("12345678900");
    expect(result.pixKey).toBe("fulano@pix.com");
    expect(repo.save).toHaveBeenCalledWith(existing);
  });

  it("usuário não existe → get-or-create cria (role user) e grava o perfil", async () => {
    const { repo, uc } = makeDeps();
    repo.findByAuthUserId.mockResolvedValue(undefined);

    const result = await uc.execute(cmd);

    expect(result).toBeInstanceOf(User);
    expect(result.toJSON()).toMatchObject({
      email: "fulano@example.com",
      role: "user",
      authUserId: "auth-1",
      taxId: "12345678900",
      pixKey: "fulano@pix.com",
    });
  });

  it("o objeto persistido carrega taxId/pixKey gravados", async () => {
    const { repo, uc } = makeDeps();
    repo.findByAuthUserId.mockResolvedValue(undefined);

    await uc.execute(cmd);

    const saved = repo.save.mock.calls.at(-1)?.[0] as User;
    expect(saved.taxId).toBe("12345678900");
    expect(saved.pixKey).toBe("fulano@pix.com");
  });

  it("persiste o MESMO usuário resolvido pelo get-or-create", async () => {
    const { repo, uc } = makeDeps();
    repo.findByAuthUserId.mockResolvedValue(undefined);

    const result = await uc.execute(cmd);

    const saved = repo.save.mock.calls.at(-1)?.[0] as User;
    expect(saved).toBe(result);
  });

  it("sobrescreve um perfil de pagamento pré-existente", async () => {
    const { repo, uc } = makeDeps();
    const existing = User.create({
      id: "u-1",
      email: "fulano@example.com",
      role: "user",
      authUserId: "auth-1",
      taxId: "00000000000",
      pixKey: "antiga@pix.com",
    });
    repo.findByAuthUserId.mockResolvedValue(existing);

    const result = await uc.execute(cmd);

    expect(result.taxId).toBe("12345678900");
    expect(result.pixKey).toBe("fulano@pix.com");
  });

  it("resolve o usuário pela sessão (authUserId), não cria duplicata quando já existe", async () => {
    const { repo, uc } = makeDeps();
    const existing = User.create({
      id: "u-1",
      email: "fulano@example.com",
      role: "reviewer",
      authUserId: "auth-1",
    });
    repo.findByAuthUserId.mockResolvedValue(existing);

    const result = await uc.execute(cmd);

    expect(repo.findByAuthUserId).toHaveBeenCalledWith("auth-1");
    // preserva o papel existente — update de perfil não rebaixa para 'user'.
    expect(result.role).toBe("reviewer");
  });
});
