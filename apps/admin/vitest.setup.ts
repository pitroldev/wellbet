import "@testing-library/react";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Desmonta a árvore React entre testes para evitar vazamento de DOM.
afterEach(() => {
  cleanup();
});
