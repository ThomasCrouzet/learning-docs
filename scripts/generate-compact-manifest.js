#!/usr/bin/env node
/**
 * Construit review-evidence/manifest.json depuis les dossiers de campagne.
 * N'émet `verified` que si preuves suffisantes + deux run_id distincts.
 */

const fs = require('fs');
const path = require('path');
const { sha256 } = require('./lib/campaign-inventory');
const { sourceIsSufficientProof } = require('./lib/campaign-sources');
const { validateCampaignFinal } = require('./lib/campaign-final');

const ROOT = path.join(__dirname, '..');
const STATE = path.join(ROOT, 'research-audit', 'campaign-2026-08');
const OUT = path.join(ROOT, 'review-evidence', 'manifest.json');

function load(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const inventory = load(path.join(STATE, 'final-inventory.json'));
const primary = load(path.join(STATE, 'primary-partition.json'));
const counter = load(path.join(STATE, 'counter-partition.json'));
const reviewsDir = path.join(STATE, 'page-reviews');

const reviewerPrimary = {};
for (const lot of primary.lots) {
  for (const p of lot.paths) reviewerPrimary[p] = { lot: lot.id, reviewer: lot.reviewer, run: `primary:${lot.id}` };
}
const reviewerHostile = {};
for (const lot of counter.lots) {
  for (const p of lot.paths) reviewerHostile[p] = { lot: lot.id, reviewer: lot.reviewer, run: `hostile:${lot.id}` };
}

const pages = [];
const errors = [];
for (const page of inventory.docs_pages) {
  const rel = page.docs_rel;
  const file = path.join(reviewsDir, `${rel.replace(/[\\/]/g, '__')}.json`);
  if (!fs.existsSync(file)) {
    errors.push(`missing dossier ${rel}`);
    continue;
  }
  const d = load(file);
  const sources = (d.sources || []).filter((s) => sourceIsSufficientProof(s) || s.kind === 'confirmed');
  const confirmed = (d.sources || []).filter((s) => sourceIsSufficientProof(s));
  const pr = reviewerPrimary[rel];
  const ho = reviewerHostile[rel];
  const secondDone = Boolean(d.second_review_done && d.second_review_run_id && d.second_reviewer);
  const primaryDone = Boolean(d.status === 'reviewed' || d.status === 'corrected' || d.primary_run_id);
  if (!primaryDone || confirmed.length === 0 || !secondDone) {
    errors.push(`${rel}: not ready for verified (primary=${primaryDone} sources=${confirmed.length} second=${secondDone})`);
    continue;
  }
  const abs = path.join(ROOT, 'docs', rel);
  const hash = sha256(fs.readFileSync(abs, 'utf8'));
  const primaryRun = d.primary_run_id || (pr && pr.run);
  const secondRun = d.second_review_run_id || (ho && ho.run);
  if (!primaryRun || !secondRun || primaryRun === secondRun) {
    errors.push(`${rel}: run_id missing or identical`);
    continue;
  }
  pages.push({
    page_id: rel,
    path: rel,
    kind: page.kind,
    hash,
    status: 'verified',
    date: d.date || new Date().toISOString().slice(0, 10),
    primary_run_id: primaryRun,
    second_review_run_id: secondRun,
    primary_reviewer: d.primary_reviewer || (pr && pr.reviewer),
    second_reviewer: d.second_reviewer || (ho && ho.reviewer),
    second_review_required: true,
    second_review_done: true,
    claim_ids: (d.claims || []).map((c) => c.id).filter(Boolean),
    sources: confirmed,
    snippet_verdict: d.snippet_verdict || null,
    revalidation: d.revalidation || '2027-02-20',
    dossier_digest: sha256(JSON.stringify(d)),
  });
}

const manifest = {
  schema_version: 1,
  campaign: 'monumental-deepsearch-2026-08',
  base_sha: load(path.join(STATE, 'campaign-state.json')).base_sha,
  generated_at: new Date().toISOString(),
  not_a_human_expert_certification: true,
  initial_page_ids: inventory.docs_pages.map((p) => p.docs_rel),
  created_page_ids: [],
  transitions: [],
  pages,
  primary_partition: primary.lots,
  counter_partition: counter.lots,
};

const check = validateCampaignFinal({
  inventoryPaths: inventory.docs_pages.map((p) => p.docs_rel),
  pagesFinales: pages,
  transitions: [],
  initialPageIds: inventory.docs_pages.map((p) => p.docs_rel),
  createdPageIds: [],
  primaryPartition: primary.lots,
  counterPartition: counter.lots,
  manifest,
  hashes: Object.fromEntries(pages.map((p) => [p.path, p.hash])),
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
if (process.argv.includes('--write-even-if-incomplete')) {
  fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
}

console.log(
  `compact manifest ready=${check.ok} pages=${pages.length}/${inventory.docs_pages.length} errors=${errors.length}`
);
if (!check.ok || errors.length) {
  for (const e of errors.slice(0, 20)) console.error(' -', e);
  for (const e of check.errors.slice(0, 20)) console.error(' -', e);
  process.exit(1);
}
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
