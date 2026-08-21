// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

async function openOrientation(page) {
  const response = await page.goto('/parcours/', { waitUntil: 'networkidle' });
  expect(response && response.status()).toBe(200);
  await expect(page.locator('#orientation-objective')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explorer librement' }).first()).toBeVisible();
}

test.describe('orientation cursus v2', () => {
  test('propose plusieurs fiches, explique le choix et conserve l’exploration libre', async ({ page }) => {
    await openOrientation(page);
    await page.locator('#orientation-objective').selectOption('discover-web');
    await page.getByRole('button', { name: 'Afficher des propositions' }).click();
    const cards = page.locator('.orientation-card');
    expect(await cards.count()).toBeGreaterThan(1);
    await expect(cards.first()).toContainText(/objectif|prochaine étape|prérequis/);
    await expect(page.getByRole('link', { name: 'Explorer librement' }).first()).toBeVisible();
  });

  test('permet de commencer malgré un prérequis recommandé', async ({ page }) => {
    await openOrientation(page);
    await page.locator('#orientation-objective').selectOption('understand-infrastructure');
    await page.getByRole('button', { name: 'Afficher des propositions' }).click();
    const override = page.getByRole('link', { name: 'Commencer malgré les prérequis' }).first();
    if ((await override.count()) > 0) await expect(override).toHaveAttribute('href', /\/$/);
    await expect(page.getByText('Voir les prérequis recommandés').first()).toBeAttached();
  });

  test('tolère un stockage local corrompu et réinitialise les choix', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('learning-docs:orientation:v2', '{'));
    await openOrientation(page);
    await page.locator('#orientation-objective').selectOption('explore-ai');
    await page.getByRole('button', { name: 'Afficher des propositions' }).click();
    await page.getByRole('button', { name: 'Réinitialiser mes choix locaux' }).click();
    await expect(page.locator('#orientation-objective')).toHaveValue('');
    expect(await page.evaluate(() => localStorage.getItem('learning-docs:orientation:v2'))).toBeNull();
  });

  test('fonctionne lorsque localStorage est indisponible', async ({ page }) => {
    await page.addInitScript(() => {
      Storage.prototype.setItem = function () { throw new Error('indisponible'); };
    });
    await openOrientation(page);
    await page.locator('#orientation-objective').selectOption('find-specific');
    await page.getByRole('button', { name: 'Afficher des propositions' }).click();
    await expect(page.locator('.orientation-card').first()).toBeVisible();
  });

  test('reste accessible au clavier, sur mobile et en mouvement réduit', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'dark' });
    await openOrientation(page);
    await page.locator('#orientation-objective').focus();
    await expect(page.locator('#orientation-objective')).toBeFocused();
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement && document.activeElement.tagName)).toMatch(/INPUT|BUTTON|A/);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(results.violations).toEqual([]);
  });

  test('se réinitialise après navigation instantanée', async ({ page }) => {
    await openOrientation(page);
    await page.evaluate(() => {
      const container = document.getElementById('curriculum-orientation');
      container.dataset.initialized = 'false';
      container.replaceChildren();
      window.CurriculumOrientation.init();
    });
    await expect(page.locator('#orientation-objective')).toBeVisible();
    await expect(page.locator('#curriculum-orientation')).toHaveAttribute('data-initialized', 'true');
    await expect(page.locator('#orientation-objective')).toHaveCount(1);
  });

  test('n’ajoute aucune requête externe ni mécanisme de pression', async ({ page }) => {
    const external = [];
    const consoleErrors = [];
    const pageErrors = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (!['127.0.0.1', 'localhost'].includes(url.hostname)) external.push(request.url());
    });
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
    page.on('pageerror', (error) => pageErrors.push(error.message));
    await openOrientation(page);
    expect(external).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    const text = (await page.locator('#curriculum-orientation').innerText()).toLowerCase();
    for (const forbidden of ['score', 'streak', 'deadline', 'projet final', 'classement']) expect(text).not.toContain(forbidden);
  });
});
