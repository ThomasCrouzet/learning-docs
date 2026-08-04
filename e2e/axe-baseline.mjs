import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173';
const pages = [
  '/',
  '/parcours/',
  '/02-php/01-introduction-php/',
  '/03-symfony/09-formulaires/',
  '/ia/01-fondamentaux-mathematiques/01-algebre-lineaire/',
  '/10-architecture/07-mvc-profondeur/',
  '/carte-cursus/',
  '/commencer/',
  '/stack-symfony/',
  '/fiches-reference/',
  '/cybersecurite/',
  '/crypto-monnaies/',
  '/epitech/',
];

const browser = await chromium.launch();
const results = [];

function summarize(axe) {
  return {
    violations: axe.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.length,
      targets: v.nodes.slice(0, 8).map((n) => n.target),
      html: v.nodes.slice(0, 3).map((n) => n.html.slice(0, 240)),
      failureSummary: v.nodes.slice(0, 2).map((n) => n.failureSummary),
    })),
    incomplete: axe.incomplete.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
    })),
    passes: axe.passes.length,
    violationCount: axe.violations.length,
    nodeCount: axe.violations.reduce((s, v) => s + v.nodes.length, 0),
  };
}

async function auditPage(context, pagePath, label = pagePath) {
  const page = await context.newPage();
  try {
    await page.goto(BASE + pagePath, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1500);
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const summary = {
      path: label,
      url: BASE + pagePath,
      title: await page.title(),
      ...summarize(axe),
    };
    results.push(summary);
    console.log(
      `${label}: ${summary.violationCount} violations (${summary.nodeCount} nodes), incomplete=${summary.incomplete.length}`,
    );
    for (const v of summary.violations) {
      console.log(`  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes} nodes)`);
    }
    return summary;
  } catch (e) {
    console.error(`FAIL ${label}: ${e.message}`);
    results.push({ path: label, error: e.message });
  } finally {
    await page.close();
  }
}

const context = await browser.newContext();
for (const pagePath of pages) {
  await auditPage(context, pagePath);
}

// Dark theme
{
  const page = await context.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.body.setAttribute('data-md-color-scheme', 'slate');
    document.body.setAttribute('data-md-color-primary', 'teal');
    document.body.setAttribute('data-md-color-accent', 'deep-orange');
  });
  await page.waitForTimeout(500);
  const darkAxe = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const summary = { path: '/ (slate)', ...summarize(darkAxe) };
  results.push(summary);
  console.log(`DARK /: ${summary.violationCount} violations (${summary.nodeCount} nodes)`);
  for (const v of summary.violations) {
    console.log(`  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes} nodes)`);
  }
  await page.close();
}

// Mobile
{
  const mobileCtx = await browser.newContext({
    viewport: { width: 375, height: 812 },
  });
  await auditPage(mobileCtx, '/02-php/01-introduction-php/', '/02-php/01-introduction-php/ (mobile)');
  await mobileCtx.close();
}

// 404-ish
await auditPage(context, '/page-inexistante-a11y-test/', '/404-ish/');

const out = path.join(root, 'audit-artifacts/a11y-baseline/axe-baseline.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(results, null, 2));
console.log('\nWrote', out);
await context.close();
await browser.close();
