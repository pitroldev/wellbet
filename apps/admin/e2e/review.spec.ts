import { expect, test } from "@playwright/test";

/**
 * Fluxo do revisor (esqueleto E2E).
 *
 * Sem sessão, qualquer rota do dashboard deve cair no login. Os fluxos com
 * sessão real (login → fila → revisão → veredito) dependem de seed/auth da API
 * e serão completados quando o ambiente de E2E estiver provisionado.
 */
test("rota protegida redireciona para login sem sessão", async ({ page }) => {
  await page.goto("/review");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Console de Revisão")).toBeVisible();
});

// TODO: test autenticado — logar com usuário de teste, abrir uma pesagem da
// fila, marcar itens do checklist, gravar veredito PENDENTE com motivo e
// validar o retorno à fila.
test.fixme("revisor grava veredito de uma pesagem", async () => {});
