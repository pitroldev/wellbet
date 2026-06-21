import { describe, expect, it } from "vitest";

import { User, type UserProps } from "./user.entity.js";

function makeUser(over: Partial<UserProps> = {}): User {
  return User.create({
    id: "u-1",
    email: "fulano@example.com",
    name: "Fulano",
    role: "user",
    authUserId: "auth-1",
    ...over,
  });
}

describe("User — entidade de domínio", () => {
  describe("getters", () => {
    it("expõe id/email/role/name/taxId/pixKey das props", () => {
      const user = makeUser({ taxId: "12345678900", pixKey: "fulano@pix.com" });
      expect(user.id).toBe("u-1");
      expect(user.email).toBe("fulano@example.com");
      expect(user.role).toBe("user");
      expect(user.name).toBe("Fulano");
      expect(user.taxId).toBe("12345678900");
      expect(user.pixKey).toBe("fulano@pix.com");
    });

    it("name ausente (undefined) → null", () => {
      const user = makeUser({ name: undefined });
      expect(user.name).toBeNull();
    });

    it("name explicitamente null → null", () => {
      const user = makeUser({ name: null });
      expect(user.name).toBeNull();
    });

    it("taxId/pixKey ausentes → null (default do perfil de pagamento)", () => {
      const user = makeUser();
      expect(user.taxId).toBeNull();
      expect(user.pixKey).toBeNull();
    });

    it("taxId/pixKey explicitamente null → null", () => {
      const user = makeUser({ taxId: null, pixKey: null });
      expect(user.taxId).toBeNull();
      expect(user.pixKey).toBeNull();
    });
  });

  describe("setPaymentProfile", () => {
    it("grava taxId e pixKey (pré-requisito de cobrança/payout)", () => {
      const user = makeUser();
      user.setPaymentProfile("98765432100", "chave-pix-1");
      expect(user.taxId).toBe("98765432100");
      expect(user.pixKey).toBe("chave-pix-1");
    });

    it("sobrescreve um perfil de pagamento já existente", () => {
      const user = makeUser({ taxId: "11111111111", pixKey: "antiga" });
      user.setPaymentProfile("22222222222", "nova");
      expect(user.taxId).toBe("22222222222");
      expect(user.pixKey).toBe("nova");
    });

    it("preserva os demais campos (id/email/role/name) ao gravar pagamento", () => {
      const user = makeUser({ role: "reviewer" });
      user.setPaymentProfile("33333333333", "chave");
      expect(user.id).toBe("u-1");
      expect(user.email).toBe("fulano@example.com");
      expect(user.role).toBe("reviewer");
      expect(user.name).toBe("Fulano");
    });

    it("reflete no toJSON()", () => {
      const user = makeUser();
      user.setPaymentProfile("44444444444", "pix-json");
      expect(user.toJSON()).toMatchObject({ taxId: "44444444444", pixKey: "pix-json" });
    });
  });

  describe("isReviewer", () => {
    it("role 'user' → false (não acessa o console de revisão)", () => {
      expect(makeUser({ role: "user" }).isReviewer()).toBe(false);
    });

    it("role 'reviewer' → true", () => {
      expect(makeUser({ role: "reviewer" }).isReviewer()).toBe(true);
    });

    it("role 'admin' → true", () => {
      expect(makeUser({ role: "admin" }).isReviewer()).toBe(true);
    });
  });

  describe("toJSON", () => {
    it("devolve uma cópia das props (snapshot imutável)", () => {
      const props: UserProps = {
        id: "u-2",
        email: "ciclano@example.com",
        name: "Ciclano",
        role: "admin",
        taxId: "55555555555",
        pixKey: "ciclano@pix.com",
        authUserId: "auth-2",
      };
      const user = User.create(props);
      const json = user.toJSON();
      expect(json).toEqual(props);

      // É uma cópia: mutar o retorno não afeta a entidade.
      (json as { taxId: string }).taxId = "00000000000";
      expect(user.taxId).toBe("55555555555");
    });
  });
});
