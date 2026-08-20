#!/usr/bin/env node
/**
 * audit:routes - manifeste déterministe des routes HTML + HTTP 200 réel.
 * Une page 404 joliment rendue échoue.
 *
 * Usage:
 *   node scripts/audit-routes.js --site-dir site
 *   node scripts/audit-routes.js --base-url http://127.0.0.1:4173
 *   node scripts/audit-routes.js --json
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const { listHtmlRoutes, assertHttpDocumentOk, siteFileToRoute } = require('./lib/campaign-http');

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

function fetchUrl(url, timeoutMs = 15000) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { timeout: timeoutMs }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (c) => {
        if (body.length < 80000) body += c;
      });
      res.on('end', () => {
        resolve({
          status: res.statusCode || 0,
          body,
          contentType: String(res.headers['content-type'] || ''),
        });
      });
    });
    req.on('error', (err) => resolve({ status: 0, body: '', error: err.message, contentType: '' }));
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 0, body: '', error: 'timeout', contentType: '' });
    });
  });
}

async function main() {
  const siteDir = path.resolve(argValue('--site-dir') || path.join(ROOT, 'site'));
  const baseUrl = (argValue('--base-url') || process.env.BASE_URL || '').replace(/\/$/, '');
  const files = walkHtml(siteDir);
  const routes = listHtmlRoutes(files);
  const report = {
    generated_at: new Date().toISOString(),
    site_dir: path.relative(ROOT, siteDir),
    route_count: routes.length,
    routes,
    probes: [],
    ok: true,
    errors: [],
  };

  if (routes.length === 0) {
    report.ok = false;
    report.errors.push(`no HTML routes under ${report.site_dir}`);
  }

  if (baseUrl) {
    for (const route of routes) {
      const url = baseUrl + route;
      const res = await fetchUrl(url);
      const verdict = assertHttpDocumentOk(res.status, res.body, res.contentType);
      report.probes.push({ route, status: res.status, ok: verdict.ok, reason: verdict.reason });
      if (!verdict.ok) {
        report.ok = false;
        report.errors.push(`${route}: ${verdict.reason} (http ${res.status})`);
      }
    }
  }

  const outDir = path.join(ROOT, 'audit-reports');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'routes-latest.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  if (jsonOut) process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  else {
    console.log(`audit:routes routes=${report.route_count} probes=${report.probes.length} ok=${report.ok}`);
    if (!report.ok) {
      for (const e of report.errors.slice(0, 40)) console.error(' -', e);
    }
  }
  process.exit(report.ok ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

module.exports = { walkHtml, siteFileToRoute };
