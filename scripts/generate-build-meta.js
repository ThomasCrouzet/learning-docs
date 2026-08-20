#!/usr/bin/env node
/**
 * Écrit site/build-meta.json (GITHUB_SHA + digests des manifestes).
 */

const fs = require('fs');
const path = require('path');
const { sha256 } = require('./lib/campaign-inventory');
const { listHtmlRoutes } = require('./lib/campaign-http');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');

function walkHtml(dir, base = '') {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkHtml(full, rel));
    else if (e.name.endsWith('.html')) out.push(rel);
  }
  return out;
}

function fileDigest(p) {
  if (!fs.existsSync(p)) return null;
  return sha256(fs.readFileSync(p));
}

const routes = listHtmlRoutes(walkHtml(SITE));
const manifest = {
  GITHUB_SHA: process.env.GITHUB_SHA || process.env.GIT_SHA || '',
  built_at: new Date().toISOString(),
  routes_manifest_sha256: sha256(JSON.stringify(routes)),
  route_count: routes.length,
  review_manifest_sha256: fileDigest(path.join(ROOT, 'review-evidence', 'manifest.json')),
  closure_sha256: fileDigest(path.join(ROOT, 'review-evidence', 'closure.json')),
};

fs.mkdirSync(SITE, { recursive: true });
fs.writeFileSync(path.join(SITE, 'build-meta.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(
  `build-meta.json SHA=${manifest.GITHUB_SHA || '(unset)'} routes=${manifest.route_count}`
);
