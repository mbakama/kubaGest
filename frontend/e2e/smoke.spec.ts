import { expect, test } from '@playwright/test';

test('navigation, réponse API puis nouvelle tentative après une erreur', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  let available = true;
  await page.route('**/api/', (route) =>
    route.fulfill({
      status: available ? 200 : 503,
      contentType: 'text/plain',
      body: available ? 'Hello World!' : 'Unavailable',
    }),
  );
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Votre espace prend forme.');
  await page.getByRole('link', { name: 'Connexion au serveur', exact: true }).click();
  await page.getByRole('button', { name: 'Vérifier la connexion' }).click();
  await expect(page.getByRole('heading', { name: 'Le serveur répond' })).toBeVisible();
  available = false;
  await page.getByRole('button', { name: 'Vérifier la connexion' }).click();
  await expect(page.getByRole('heading', { name: 'Connexion indisponible' })).toBeVisible();
  available = true;
  await page.getByRole('button', { name: 'Vérifier la connexion' }).click();
  await expect(page.getByRole('heading', { name: 'Le serveur répond' })).toBeVisible();
  expect(errors).toEqual([]);
});

test('une réponse HTML ne doit pas être considérée comme une API disponible', async ({ page }) => {
  await page.route('**/api/', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<html>Fallback</html>' }),
  );
  await page.goto('/connexion');
  await page.getByRole('button', { name: 'Vérifier la connexion' }).click();
  await expect(page.getByRole('heading', { name: 'Connexion indisponible' })).toBeVisible();
});

test('une adresse inconnue permet de revenir à l’accueil', async ({ page }) => {
  await page.goto('/adresse-inconnue');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
  await page.getByRole('link', { name: 'Revenir à l’accueil' }).click();
  await expect(page).toHaveURL(/\/accueil$/);
});

for (const width of [320, 768, 1024, 1440]) {
  test(`accueil sans débordement à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/accueil');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused();
    await page.screenshot({ path: `test-results/accueil-${width}.png`, fullPage: true });
  });
}
