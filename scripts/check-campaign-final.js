#!/usr/bin/env node
/**
 * Gate lint:campaign-final
 *
 * Usage:
 *   node scripts/check-campaign-final.js
 *   node scripts/check-campaign-final.js --json
 */

const fs = require('fs');
const path = require('path');
const { validateCampaignFinal } = require('./lib/campaign-final');
const { sha256 } = require('./lib/campaign-inventory');

const ROOT = path.join(__dirname, '..');
const jsonOut = process.argv.includes('--json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadOptional(p) {
  return fs.existsSync(p) ? readJson(p) : null;
}

const evidenceDir = path.join(ROOT, 'review-evidence');
const manifestPath = path.join(evidenceDir, 'manifest.json');
const closurePath = path.join(evidenceDir, 'closure.json');
const stateDir = path.join(ROOT, 'research-audit', 'campaign-2026-08');

if (!fs.existsSync(manifestPath)) {
  const msg = `Missing compact manifest: ${path.relative(ROOT, manifestPath)}`;
  if (jsonOut) {
    process.stdout.write(JSON.stringify({ ok: false, errors: [msg] }, null, 2) + '\n');
  } else {
    console.error('lint:campaign-final FAILED:', msg);
  }
  process.exit(1);
}

const manifest = readJson(manifestPath);
const closure = loadOptional(closurePath);
const { inventaireMarkdown } = require('./lib/doc-audit');
const DOCS = path.join(ROOT, 'docs');
const diskInventory = inventaireMarkdown(DOCS, {
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
const inventory = loadOptional(path.join(stateDir, 'final-inventory.json'))
  || loadOptional(path.join(stateDir, 'initial-inventory.json'));
const partitions = {
  primary: loadOptional(path.join(stateDir, 'primary-partition.json')),
  counter: loadOptional(path.join(stateDir, 'counter-partition.json')),
};

const pagesFinales = manifest.pages_finales || manifest.pages || manifest.entries || [];
const inventoryPaths = diskInventory;

const hashes = {};
for (const e of pagesFinales) {
  const rel = String(e.path || e.page_id || '').replace(/^docs\//, '');
  const abs = path.join(ROOT, 'docs', rel);
  if (fs.existsSync(abs)) hashes[rel] = sha256(fs.readFileSync(abs, 'utf8'));
}

const result = validateCampaignFinal({
  inventoryPaths,
  pagesFinales,
  transitions: manifest.transitions || [],
  initialPageIds: (manifest.initial_page_ids || inventoryPaths),
  createdPageIds: manifest.created_page_ids || [],
  primaryPartition: (partitions.primary && partitions.primary.lots) || manifest.primary_partition || [],
  counterPartition: (partitions.counter && partitions.counter.lots) || manifest.counter_partition || [],
  manifest,
  hashes,
  closure,
  requireClosure: Boolean(closure) || process.argv.includes('--require-closure'),
});

if (jsonOut) {
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} else if (!result.ok) {
  console.error('lint:campaign-final FAILED:');
  for (const err of result.errors.slice(0, 80)) console.error(' -', err);
  if (result.errors.length > 80) {
    console.error(` ... and ${result.errors.length - 80} more`);
  }
} else {
  console.log(
    `lint:campaign-final OK (pages=${result.stats.pages_finales} inventory=${result.stats.inventory})`
  );
}

process.exit(result.ok ? 0 : 1);
