// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';

/**
 * Suite E2E d'accessibilité WCAG 2.2 AA pour le wiki MkDocs Material.
 * Les tests ciblent le build de production servi en statique (dossier site/).
 */
module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'audit-artifacts/playwright-report' }]],
  outputDir: 'audit-artifacts/playwright-results',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['iPhone 13'], browserName: 'chromium' },
    },
  ],
  // webServer démarré manuellement en CI/local pour le build de production :
  // npx serve site -l 4173
  // (éviter de lancer un serveur de dev comme validation finale)
});
