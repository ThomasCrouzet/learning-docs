#!/usr/bin/env node
/**
 * audit:links - liens internes (fichiers) et externes (HTTP borné).
 *
 * Usage:
 *   node scripts/audit-links.js
 *   node scripts/audit-links.js --external
 *   node scripts/audit-links.js --json
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { inventaireMarkdown, extractMarkdownLinks, resolveHref } = require('./lib/doc-audit');
const { classifyLinkResult } = require('./lib/campaign-http');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const jsonOut = process.argv.includes('--json');
const wantExternal = process.argv.includes('--external');

function walkFs() {
  return inventaireMarkdown(DOCS, {
    readFile: (p) => fs.readFileSync(p, 'utf8'),
    listDir: (p) => fs.readdirSync(p),
    isDir: (p) => {
      try {
        return fs.statSync(p).isDirectory();
      } catch {
        return false;
      }
    },
    exists: (p) => fs.existsSync(p),
  });
}

function fetchHead(url, timeoutMs = 8000) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(
      url,
      { method: 'GET', timeout: timeoutMs },
      (res) => {
        res.resume();
        resolve({
          status: res.statusCode || 0,
          redirected: Boolean(res.headers.location) && res.statusCode >= 300 && res.statusCode < 400,
        });
      }
    );
    req.on('error', (err) => resolve({ status: 0, error: err.message }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, error: 'timeout' });
    });
    req.end();
  });
}

async function main() {
  const pages = walkFs();
  const pageSet = new Set(pages);
  const internal = [];
  const external = [];
  const errors = [];

  for (const rel of pages) {
    const content = fs.readFileSync(path.join(DOCS, rel), 'utf8');
    for (const link of extractMarkdownLinks(content)) {
      const href = link.href || '';
      if (/^https?:\/\//i.test(href)) {
        external.push({ file: rel, href });
        continue;
      }
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
      const resolved = resolveHref(rel, href);
      if (!resolved || resolved.external) continue;
      const target = resolved.path;
      if (!target) continue;
      const onDisk = fs.existsSync(path.join(DOCS, target));
      if (!pageSet.has(target) && !onDisk) {
        internal.push({ file: rel, href, target, ok: false });
        errors.push(`${rel}: broken internal ${href}`);
      } else {
        internal.push({ file: rel, href, target, ok: true });
      }
    }
  }

  const extResults = [];
  if (wantExternal) {
    const unique = [...new Set(external.map((e) => e.href))].slice(0, 200);
    for (const url of unique) {
      const res = await fetchHead(url);
      const klass = classifyLinkResult({ ...res, url });
      extResults.push({ url, status: res.status, class: klass });
      if (klass === 'dead') errors.push(`external dead ${url}`);
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    internal_checked: internal.length,
    internal_broken: internal.filter((i) => i.ok === false).length,
    external_checked: extResults.length,
    external: extResults,
    ok: errors.length === 0,
    errors: errors.slice(0, 200),
  };

  const outDir = path.join(ROOT, 'audit-reports');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'links-latest.json'), JSON.stringify(report, null, 2));
  if (jsonOut) process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  else {
    console.log(
      `audit:links internal=${report.internal_checked} broken=${report.internal_broken} external=${report.external_checked} ok=${report.ok}`
    );
    for (const e of errors.slice(0, 40)) console.error(' -', e);
  }
  process.exit(report.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
