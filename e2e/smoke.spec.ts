import { expect, test, type Page } from '@playwright/test';

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

async function login(page: Page) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email ?? '');
  await page.getByLabel('Senha').fill(password ?? '');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await expect(page).toHaveURL(/\/$/);
}

test('rota protegida redireciona visitantes sem sessão', async ({ page }) => {
  await page.goto('/leads');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Entrar no workspace' })).toBeVisible();
});

test('login e navegação principal', async ({ page }) => {
  test.skip(!email || !password, 'Defina E2E_USER_EMAIL e E2E_USER_PASSWORD para o smoke autenticado.');
  await login(page);
  await expect(page.getByRole('heading', { name: /Olá,/ })).toBeVisible();
  await page.getByRole('link', { name: 'Leads' }).click();
  await expect(page).toHaveURL(/\/leads$/);
  await expect(page.getByRole('heading', { name: 'Leads' })).toBeVisible();
});

test('lead intelligence abre o dossiê', async ({ page }) => {
  test.skip(!email || !password, 'Defina E2E_USER_EMAIL e E2E_USER_PASSWORD para o smoke autenticado.');
  await login(page);
  await page.getByRole('link', { name: /Oficina|Barbearia|Auto|Brilho/ }).first().click();
  await expect(page.getByText('Serviço recomendado')).toBeVisible();
});

test('logout volta a proteger a aplicação', async ({ page }) => {
  test.skip(!email || !password, 'Defina E2E_USER_EMAIL e E2E_USER_PASSWORD para o smoke autenticado.');
  await login(page);
  await page.getByRole('button', { name: 'Sair' }).first().click();
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
});
