import { expect, test } from '@playwright/test';

test('vérification API depuis la page de connexion', async ({ page }) => {
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
  await expect(page).toHaveURL(/\/authentification$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Connexion à KubaGest');
  await page.getByRole('button', { name: 'Vérifier la connexion au serveur' }).click();
  await expect(page.getByText('Serveur joignable')).toBeVisible();
  available = false;
  await page.reload();
  await page.getByRole('button', { name: 'Vérifier la connexion au serveur' }).click();
  await expect(page.getByRole('button', { name: 'Serveur indisponible — réessayer' })).toBeVisible();
  available = true;
  await page.getByRole('button', { name: 'Serveur indisponible — réessayer' }).click();
  await expect(page.getByText('Serveur joignable')).toBeVisible();
  expect(errors).toEqual([]);
});

test('validation et affichage du mot de passe', async ({ page }) => {
  await page.goto('/authentification');
  const password = page.getByLabel('Mot de passe', { exact: true });
  await expect(password).toHaveAttribute('type', 'password');
  await page.getByRole('button', { name: 'Afficher le mot de passe' }).click();
  await expect(password).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Masquer le mot de passe' }).click();
  await expect(password).toHaveAttribute('type', 'password');

  await page.getByLabel('Adresse e-mail').fill('adresse-invalide');
  await page.getByLabel('Adresse e-mail').blur();
  await expect(page.getByText('Saisissez une adresse e-mail valide.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Se connecter', exact: true })).toBeEnabled();
});

test('lien mot de passe oublié', async ({ page }) => {
  await page.goto('/authentification');
  await page.getByRole('link', { name: 'Mot de passe oublié ?' }).click();
  await expect(page).toHaveURL(/\/mot-de-passe-oublie$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Mot de passe/);
});

test('ancienne URL /connexion redirige vers authentification', async ({ page }) => {
  await page.goto('/connexion');
  await expect(page).toHaveURL(/\/authentification$/);
});

test('alias mot de passe oublié sous authentification redirige', async ({ page }) => {
  await page.goto('/authentification/mot-de-passe-oublie');
  await expect(page).toHaveURL(/\/mot-de-passe-oublie$/);
});

test('ancienne URL sous /connexion redirige (mot de passe oublié)', async ({ page }) => {
  await page.goto('/connexion/mot-de-passe-oublie');
  await expect(page).toHaveURL(/\/mot-de-passe-oublie$/);
});

test('page d’inscription accessible par URL directe', async ({ page }) => {
  await page.goto('/inscription');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Lancez votre point de vente');
  await expect(page.getByRole('heading', { level: 2, name: /Créer votre/ })).toBeVisible();
});

test('une réponse HTML ne doit pas être considérée comme une API disponible', async ({ page }) => {
  await page.route('**/api/', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<html>Fallback</html>' }),
  );
  await page.goto('/authentification');
  await page.getByRole('button', { name: 'Vérifier la connexion au serveur' }).click();
  await expect(page.getByRole('button', { name: 'Serveur indisponible — réessayer' })).toBeVisible();
});

test('une adresse inconnue permet de revenir à la connexion', async ({ page }) => {
  await page.goto('/adresse-inconnue');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
  await page.getByRole('link', { name: 'Revenir à la connexion' }).click();
  await expect(page).toHaveURL(/\/authentification$/);
});

test('redirection depuis /accueil vers authentification (invité)', async ({ page }) => {
  await page.goto('/accueil');
  await expect(page).toHaveURL(/\/authentification$/);
});

for (const width of [320, 768, 1024, 1440, 1680, 1822]) {
  test(`connexion sans débordement horizontal à ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/authentification');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Aller au contenu' })).toBeFocused();
    await page.screenshot({ path: `test-results/connexion-${width}.png`, fullPage: true });
  });
}
