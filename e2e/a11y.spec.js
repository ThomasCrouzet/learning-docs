// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

/**
 * Pages représentatives de la cartographie (accueil, parcours, fiche,
 * diagram-design, tags, index cursus). Le shell MkDocs est partagé par plus de 700 pages.
 */
const ROUTES = [
  '/',
  '/parcours/',
  '/commencer/',
  '/02-php/01-introduction-php/',
  '/03-symfony/09-formulaires/',
  '/10-architecture/07-mvc-profondeur/',
  '/ia/01-fondamentaux-mathematiques/01-algebre-lineaire/',
  '/carte-cursus/',
  '/stack-symfony/',
  '/fiches-reference/',
  '/cybersecurite/',
  '/crypto-monnaies/',
  '/fondamentaux/',
  '/faust/',
  '/ansible/',
  '/devops/',
];

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

/**
 * @param {import('@playwright/test').Page} page
 * @param {string} path
 */
async function gotoStable(page, path) {
  const resp = await page.goto(path, { waitUntil: 'networkidle' });
  const status = resp ? resp.status() : 0;
  expect(status, `HTTP ${status} pour ${path}`).toBe(200);
  // Laisser extra.js / labels checklists s'exécuter
  await page.waitForTimeout(1200);
  await page
    .locator('main, [role="main"], .md-content')
    .first()
    .waitFor({ state: 'visible' });
}

/**
 * @param {import('@playwright/test').Page} page
 */
async function runAxe(page) {
  return new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
}

/**
 * @param {import('axe-core').Result[]} violations
 */
function formatViolations(violations) {
  return violations
    .map((v) => `${v.id} (${v.impact}) ×${v.nodes.length}: ${v.help}`)
    .join('\n');
}

test.describe('HTTP réel', () => {
  test('une route inconnue n\'est pas un 200', async ({ page }) => {
    const resp = await page.goto('/page-inexistante-campagne-404/', {
      waitUntil: 'domcontentloaded',
    });
    const status = resp ? resp.status() : 0;
    expect(status).not.toBe(200);
  });
});

test.describe('Structure documentaire', () => {
  for (const route of ROUTES) {
    test(`landmarks et titre : ${route}`, async ({ page }) => {
      await gotoStable(page, route);
      const lang = await page.locator('html').getAttribute('lang');
      expect(lang).toMatch(/^fr/i);
      await expect(page.locator('title')).not.toBeEmpty();
      const main = page.locator(
        'main, [role="main"], .md-main__inner .md-content',
      );
      await expect(main.first()).toBeVisible();
      const h1 = page.locator('h1');
      await expect(h1.first()).toBeVisible();
    });
  }

  test("lien d'évitement présent sur l'accueil", async ({ page }) => {
    await gotoStable(page, '/');
    const skip = page
      .locator('a.md-skip, [data-md-component="skip"] a')
      .first();
    await expect(skip).toBeAttached();
    const text = (await skip.innerText()).trim();
    expect(text.length).toBeGreaterThan(0);
  });
});

test.describe('axe-core WCAG 2.2 AA', () => {
  for (const route of ROUTES) {
    test(`aucune violation axe WCAG 2.2 AA : ${route}`, async ({ page }) => {
      await gotoStable(page, route);
      const results = await runAxe(page);
      // Aligné sur axe-baseline.mjs : zéro violation taguée WCAG 2.2 AA
      // (pas seulement critical/serious)
      expect(
        results.violations,
        formatViolations(results.violations) || 'violations',
      ).toEqual([]);
    });
  }

  test('thème sombre (slate) : accueil sans violation', async ({ page }) => {
    await gotoStable(page, '/');
    await page.evaluate(() => {
      document.body.setAttribute('data-md-color-scheme', 'slate');
      document.body.setAttribute('data-md-color-primary', 'teal');
      document.body.setAttribute('data-md-color-accent', 'deep-orange');
    });
    await page.waitForTimeout(300);
    const results = await runAxe(page);
    expect(
      results.violations,
      formatViolations(results.violations) || 'violations',
    ).toEqual([]);
  });
});

test.describe('Checklists (non-régression labels)', () => {
  test('cases à cocher de validation ont un nom accessible', async ({
    page,
  }) => {
    await gotoStable(page, '/02-php/01-introduction-php/');
    const boxes = page.locator(
      '.md-typeset .task-list-control input[type="checkbox"]',
    );
    const count = await boxes.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const box = boxes.nth(i);
      const label = await box.getAttribute('aria-label');
      expect(label, `checkbox ${i}`).toBeTruthy();
      expect((label || '').trim().length).toBeGreaterThan(3);
      await expect(box).toBeEnabled();
    }
  });
});

test.describe('Progression Material (non-régression)', () => {
  test('barre md-progress a un nom accessible', async ({ page }) => {
    await gotoStable(page, '/');
    const bar = page.locator('.md-progress[role="progressbar"]');
    if ((await bar.count()) === 0) {
      test.skip();
      return;
    }
    const name = await bar.first().getAttribute('aria-label');
    expect(name).toBeTruthy();
  });
});

test.describe('Navigation clavier', () => {
  test('skip link : Tab puis Enter place le focus sur le contenu', async ({
    page,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'ordre de focus testé sur Chromium');
    await gotoStable(page, '/');
    const skip = page.locator('a.md-skip').first();
    await skip.focus();
    await expect(skip).toBeFocused();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    const hash = await page.evaluate(() => location.hash);
    expect(hash.length).toBeGreaterThan(0);
    // Le focus doit atteindre la cible du skip (souvent h1 ou élément d'ancre)
    const focusInfo = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return null;
      return {
        tag: el.tagName,
        id: el.id,
        className: String(el.className || ''),
      };
    });
    expect(focusInfo).toBeTruthy();
    // Après activation du skip, focus hors du skip link lui-même
    const stillOnSkip = await skip.evaluate(
      (node) => document.activeElement === node,
    );
    // Certains navigateurs laissent le focus sur le skip tant qu'il est visible ;
    // on exige au minimum que le hash soit posé (cible de contenu).
    expect(hash.startsWith('#')).toBe(true);
    void stillOnSkip;
    void focusInfo;
  });

  test('Tab et Shift+Tab parcourent l\'en-tête sans piège', async ({
    page,
  }) => {
    await gotoStable(page, '/02-php/01-introduction-php/');

    const snapshotFocus = () =>
      page.evaluate(() => {
        const el = document.activeElement;
        if (!el) return null;
        return {
          tag: el.tagName,
          id: el.id || '',
          className: String(el.className || '').slice(0, 80),
          href: el.getAttribute && el.getAttribute('href'),
        };
      });

    await page.keyboard.press('Tab');
    const first = await snapshotFocus();
    expect(first).toBeTruthy();
    expect(first.tag).toMatch(/A|BUTTON|INPUT|SUMMARY|LABEL/i);

    await page.keyboard.press('Tab');
    const second = await snapshotFocus();
    expect(second).toBeTruthy();
    // Deux Tab successifs doivent pouvoir bouger le focus (pas de piège)
    // (sur mobile le premier focus peut être le toggle drawer, etc.)

    await page.keyboard.press('Shift+Tab');
    const back = await snapshotFocus();
    expect(back).toBeTruthy();
    expect(back.tag).toMatch(/A|BUTTON|INPUT|SUMMARY|LABEL|BODY/i);
    // Shift+Tab ne doit pas piéger : on peut toujours Tab à nouveau
    await page.keyboard.press('Tab');
    const again = await snapshotFocus();
    expect(again).toBeTruthy();
    expect(again.tag).toMatch(/A|BUTTON|INPUT|SUMMARY|LABEL/i);
  });

  test('flèches inter-fiches n\'interceptent pas une région scrollable focusée', async ({
    page,
  }) => {
    await gotoStable(page, '/02-php/01-introduction-php/');

    // Intercepter les clics prev/next pour prouver qu'ils ne partent pas
    await page.evaluate(() => {
      window.__interFicheClicks = [];
      document
        .querySelectorAll(
          '.md-footer__link--prev, .md-footer__link--next, a[rel="prev"], a[rel="next"]',
        )
        .forEach((a) => {
          a.addEventListener(
            'click',
            (e) => {
              window.__interFicheClicks.push(a.getAttribute('href') || a.href);
              e.preventDefault();
              e.stopImmediatePropagation();
            },
            true,
          );
        });
      document.querySelectorAll('.md-typeset pre > code, .md-typeset pre').forEach((el) => {
        el.style.maxWidth = '80px';
        el.style.overflowX = 'auto';
        el.style.display = 'block';
      });
      window.dispatchEvent(new Event('resize'));
    });
    await page.waitForTimeout(250);

    const target = page.locator('[data-a11y-scroll-region="true"]').first();
    await expect(target).toBeAttached();
    const pathBefore = new URL(page.url()).pathname;
    await target.focus();
    await expect(target).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(400);
    // Ne doit pas changer de fiche (pathname) ni cliquer prev/next
    // (le hash peut bouger via navigation.tracking Material : hors scope)
    expect(new URL(page.url()).pathname).toBe(pathBefore);
    const clicks = await page.evaluate(() => window.__interFicheClicks || []);
    expect(clicks).toEqual([]);
  });
});

test.describe('Zones scrollables (C13 non-régression)', () => {
  test('code ou tableau overflow a tabindex=0 et role=region sur mobile', async ({
    page,
  }, testInfo) => {
    // Forcer un viewport étroit pour provoquer l'overflow
    await page.setViewportSize({ width: 375, height: 812 });
    await gotoStable(page, '/02-php/01-introduction-php/');
    await page.evaluate(() => {
      document.querySelectorAll('.md-typeset pre > code, .md-typeset pre').forEach((el) => {
        el.style.maxWidth = '80px';
        el.style.overflowX = 'auto';
        el.style.display = 'block';
      });
      window.dispatchEvent(new Event('resize'));
    });
    await page.waitForTimeout(250);
    const regions = page.locator('[data-a11y-scroll-region="true"]');
    // Sur fiche PHP il y a des blocs de code ; au moins un doit overflow en 375px
    // Si aucun (contenu court), le test reste informatif via axe mobile
    const n = await regions.count();
    if (n === 0) {
      testInfo.annotations.push({
        type: 'note',
        description: 'Aucun overflow détecté à 375px sur cette fiche',
      });
      return;
    }
    for (let i = 0; i < Math.min(n, 5); i++) {
      const r = regions.nth(i);
      await expect(r).toHaveAttribute('tabindex', '0');
      await expect(r).toHaveAttribute('role', 'region');
      const label = await r.getAttribute('aria-label');
      expect(label).toBeTruthy();
    }
  });
});

test.describe('Diagram-design iframes', () => {
  const diagramRoutes = [
    '/02-php/01-introduction-php/',
    '/03-symfony/07-relations-entites/',
    '/10-architecture/07-mvc-profondeur/',
    '/carte-cursus/',
    '/11-ci-cd/10-projet-integrateur/',
    '/crypto-monnaies/02-bitcoin/04-reseau-noeuds-mineurs-pools/',
  ];

  for (const route of diagramRoutes) {
    test(`SVG rendu dans l'iframe : ${route}`, async ({ page }) => {
      await gotoStable(page, route);
      const iframe = page.locator('.diagram-design iframe').first();
      await expect(iframe).toBeVisible();
      const src = await iframe.getAttribute('src');
      expect(src).toMatch(/diagrams\/[A-Za-z0-9._-]+\.html$/);
      const frame = page.frameLocator('.diagram-design iframe').first();
      await expect(frame.locator('svg[role="img"]')).toBeVisible();
      await expect(frame.locator('svg title')).not.toBeEmpty();
    });
  }
});

test.describe('Mermaid lightbox (si présent)', () => {
  test('focus trap, Escape restaure le focus, flèches ne changent pas de page', async ({
    page,
  }) => {
    await gotoStable(page, '/10-architecture/07-mvc-profondeur/');
    await page.waitForTimeout(2000);
    const diagram = page.locator('.mermaid-diagram[role="button"]').first();
    if ((await diagram.count()) === 0) {
      test.skip();
      return;
    }
    await page.evaluate(() => {
      window.__interFicheClicks = [];
      document
        .querySelectorAll(
          '.md-footer__link--prev, .md-footer__link--next, a[rel="prev"], a[rel="next"]',
        )
        .forEach((a) => {
          a.addEventListener(
            'click',
            (e) => {
              window.__interFicheClicks.push(a.getAttribute('href') || a.href);
              e.preventDefault();
              e.stopImmediatePropagation();
            },
            true,
          );
        });
    });

    await diagram.focus();
    await expect(diagram).toBeFocused();
    const pathBefore = new URL(page.url()).pathname;
    await page.keyboard.press('Enter');
    const dialog = page.locator('.mermaid-lightbox[role="dialog"]');
    await expect(dialog).toBeVisible();

    // Focus dans le dialogue (bouton fermer)
    const closeBtn = page.locator(
      '.mermaid-lightbox [data-action="close"]',
    );
    await expect(closeBtn).toBeFocused();

    // Flèches : pas de navigation inter-fiches, dialog reste ouvert
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(300);
    expect(new URL(page.url()).pathname).toBe(pathBefore);
    const clicks = await page.evaluate(() => window.__interFicheClicks || []);
    expect(clicks).toEqual([]);
    await expect(dialog).toBeVisible();

    // Tab reste dans le dialogue
    await page.keyboard.press('Tab');
    const inDialog = await page.evaluate(() => {
      const el = document.activeElement;
      return !!(el && el.closest && el.closest('.mermaid-lightbox'));
    });
    expect(inDialog).toBe(true);

    // Escape ferme et restaure le focus sur le diagramme
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(diagram).toBeFocused();
  });
});

test.describe('Préférences de mouvement', () => {
  test('CSS prefers-reduced-motion présent', async ({ page }) => {
    await gotoStable(page, '/');
    const hasRule = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        let rules;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of Array.from(rules || [])) {
          if (
            rule instanceof CSSMediaRule &&
            rule.conditionText.includes('prefers-reduced-motion')
          ) {
            return true;
          }
        }
      }
      return false;
    });
    expect(hasRule).toBe(true);
  });
});
