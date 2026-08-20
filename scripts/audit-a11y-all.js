#!/usr/bin/env node
/**
 * audit:a11y:all - axe sur les routes listées, échec sur violation.
 *
 * Usage:
 *   node scripts/audit-a11y-all.js --base-url http://127.0.0.1:4173
 *   node scripts/audit-a11y-all.js --json
 *
 * Si Playwright ne démarre pas, exit 2 (environnement, pas un faux vert).
 */

const fs = require('fs');
const path = require('path');
const { forbiddenAxeViolations, listHtmlRoutes } = require('./lib/campaign-http');

const ROOT = path.join(__dirname, '..');
const jsonOut = process.argv.includes('--json');

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : null;
}

function walkHtml(dir, base = '') {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'overrides' && !base) continue;
      out.push(...walkHtml(full, rel));
    } else if (e.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

async function main() {
  const siteDir = path.resolve(argValue('--site-dir') || path.join(ROOT, 'site'));
  const baseUrl = (argValue('--base-url') || process.env.BASE_URL || '').replace(/\/$/, '');
  const files = walkHtml(siteDir);
  const routes = listHtmlRoutes(files);
  const report = {
    generated_at: new Date().toISOString(),
    route_count: routes.length,
    ok: true,
    errors: [],
    pages: [],
    playwright: true,
  };

  if (!baseUrl) {
    report.ok = false;
    report.errors.push('missing --base-url or BASE_URL');
    writeReport(report);
    process.exit(1);
  }

  let chromium;
  let AxeBuilder;
  try {
    ({ chromium } = require('@playwright/test'));
    AxeBuilder = require('@axe-core/playwright').default;
  } catch (e) {
    report.ok = false;
    report.playwright = false;
    report.errors.push(`playwright_unavailable: ${e.message}`);
    writeReport(report);
    process.exit(2);
  }

  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    report.ok = false;
    report.playwright = false;
    report.errors.push(`playwright_launch_failed: ${e.message}`);
    writeReport(report);
    process.exit(2);
  }

  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    for (const route of routes) {
      const page = await context.newPage();
      try {
        const resp = await page.goto(baseUrl + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
        const status = resp ? resp.status() : 0;
        if (status !== 200) {
          report.ok = false;
          report.errors.push(`${route}: http_${status}`);
          report.pages.push({ route, status, ok: false });
          continue;
        }
        // Attendre le JS livre (extra.js, KaTeX) sans injecter d'ARIA.
        await page.waitForFunction(() => document.readyState === 'complete', { timeout: 15000 }).catch(() => {});
        await page.evaluate(async () => {
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          if (document.fonts && document.fonts.ready) {
            try {
              await document.fonts.ready;
            } catch (e) {
              /* polices optionnelles */
            }
          }
          if (document.querySelector('.arithmatex')) {
            const start = Date.now();
            await new Promise((resolve) => {
              const tick = () => {
                if (document.querySelector('.katex') || Date.now() - start > 8000) resolve();
                else setTimeout(tick, 50);
              };
              tick();
            });
            await new Promise((r) => setTimeout(r, 50));
          }
        });
        const axe = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        const gate = forbiddenAxeViolations(axe);
        report.pages.push({
          route,
          status,
          violations: gate.violations.map((v) => v.id),
          ok: !gate.fail,
        });
        if (gate.fail) {
          report.ok = false;
          report.errors.push(
            `${route}: axe ${gate.violations.map((v) => v.id).join(',')}`
          );
        }
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
  }

  writeReport(report);
  process.exit(report.ok ? 0 : 1);
}

function writeReport(report) {
  const outDir = path.join(ROOT, 'audit-reports');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'a11y-all-latest.json'), JSON.stringify(report, null, 2));
  if (jsonOut) process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  else {
    console.log(`audit:a11y:all pages=${report.pages.length} ok=${report.ok}`);
    for (const e of report.errors.slice(0, 40)) console.error(' -', e);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
