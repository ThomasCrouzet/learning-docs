#!/usr/bin/env node
/**
 * Construit review-evidence/manifest.json depuis les dossiers de campagne.
 * Seul émetteur de `verified`. N'émet ce statut que si preuves suffisantes,
 * deux run_id distincts, seconde relecture substantive, et dossier non bloqué.
 */

const fs = require('fs');
const path = require('path');
const { sha256 } = require('./lib/campaign-inventory');
const { sourceIsSufficientProof } = require('./lib/campaign-sources');
const {
  validateCampaignFinal,
  collectSecondReviewArtifacts,
  secondReviewIsSubstantive,
  dossierBlocksVerified,
} = require('./lib/campaign-final');

const ROOT = path.join(__dirname, '..');
const STATE = path.join(ROOT, 'research-audit', 'campaign-2026-08');
const OUT = path.join(ROOT, 'review-evidence', 'manifest.json');
const OUT_CLOSURE = path.join(ROOT, 'review-evidence', 'closure.json');

function load(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function loadFindingDocs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((n) => /^second-[A-D]\.json$/i.test(n))
    .sort()
    .map((n) => load(path.join(dir, n)));
}

const inventory = load(path.join(STATE, 'final-inventory.json'));
const primary = load(path.join(STATE, 'primary-partition.json'));
const counter = load(path.join(STATE, 'counter-partition.json'));
const reviewsDir = path.join(STATE, 'page-reviews');
const artifacts = collectSecondReviewArtifacts(loadFindingDocs(path.join(STATE, 'findings')));

const reviewerPrimary = {};
for (const lot of primary.lots) {
  for (const p of lot.paths) reviewerPrimary[p] = { lot: lot.id, reviewer: lot.reviewer, run: `primary:${lot.id}` };
}
const reviewerHostile = {};
for (const lot of counter.lots) {
  for (const p of lot.paths) reviewerHostile[p] = { lot: lot.id, reviewer: lot.reviewer, run: `hostile:${lot.id}` };
}

const created = inventory.docs_pages
  .map((p) => p.docs_rel)
  .filter((p) => p.startsWith('30-analyse-reseau/'));
const initial = inventory.docs_pages
  .map((p) => p.docs_rel)
  .filter((p) => !p.startsWith('30-analyse-reseau/'));

const pages = [];
const errors = [];
const dossiers = {};
for (const page of inventory.docs_pages) {
  const rel = page.docs_rel;
  const file = path.join(reviewsDir, `${rel.replace(/[\\/]/g, '__')}.json`);
  if (!fs.existsSync(file)) {
    errors.push(`missing dossier ${rel}`);
    continue;
  }
  const d = load(file);
  dossiers[rel] = d;
  const confirmed = (d.sources || []).filter((s) => sourceIsSufficientProof(s));
  const pr = reviewerPrimary[rel];
  const ho = reviewerHostile[rel];
  const notes =
    (d.pedagogical_verdict && typeof d.pedagogical_verdict.notes === 'string'
      ? d.pedagogical_verdict.notes
      : '') ||
    (typeof d.notes === 'string' ? d.notes : '');
  const sourcesChecked =
    (d.pedagogical_verdict && Array.isArray(d.pedagogical_verdict.sources_checked)
      ? d.pedagogical_verdict.sources_checked
      : []) || [];
  const secondDone = secondReviewIsSubstantive(
    {
      path: rel,
      second_review_done: d.second_review_done,
      second_review_run_id: d.second_review_run_id,
      second_reviewer: d.second_reviewer,
      notes,
      finding_ids: d.finding_ids,
      confirmed_ok: d.confirmed_ok,
    },
    { artifacts, dossiers: { [rel]: d } }
  );
  const primaryDone = Boolean(d.status === 'reviewed' || d.status === 'corrected' || d.primary_run_id);
  const blocked = dossierBlocksVerified(d, artifacts[rel]);
  if (!primaryDone || confirmed.length === 0 || !secondDone || blocked) {
    errors.push(
      `${rel}: not ready for verified (primary=${primaryDone} sources=${confirmed.length} second=${secondDone} blocked=${blocked})`
    );
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
    notes: notes.trim(),
    sources_checked: sourcesChecked,
    claim_ids: (d.claims || []).map((c) => c.id).filter(Boolean),
    sources: confirmed,
    snippet_verdict: d.snippet_verdict || null,
    revalidation: d.revalidation || '2027-02-20',
    dossier_digest: sha256(JSON.stringify(d)),
  });
}

let baseSha = 'unknown';
try {
  baseSha = load(path.join(STATE, 'campaign-state.json')).base_sha;
} catch {
  baseSha = 'unknown';
}

const manifest = {
  schema_version: 1,
  campaign: 'monumental-deepsearch-2026-08',
  base_sha: baseSha,
  generated_at: new Date().toISOString(),
  not_a_human_expert_certification: true,
  initial_page_ids: initial,
  created_page_ids: created,
  transitions: [],
  pages,
  primary_partition: primary.lots,
  counter_partition: counter.lots,
};

const check = validateCampaignFinal({
  inventoryPaths: inventory.docs_pages.map((p) => p.docs_rel),
  pagesFinales: pages,
  transitions: [],
  initialPageIds: initial,
  createdPageIds: created,
  primaryPartition: primary.lots,
  counterPartition: counter.lots,
  manifest,
  hashes: Object.fromEntries(pages.map((p) => [p.path, p.hash])),
  secondReviewArtifacts: artifacts,
  dossiers,
  closure: null,
  requireClosure: false,
});

const complete = check.ok && errors.length === 0 && pages.length === inventory.docs_pages.length;
const closure = {
  derived_from: 'registers',
  generated_at: new Date().toISOString(),
  base_sha: baseSha,
  not_a_human_expert_certification: true,
  criteria: {
    inventory_match: pages.length === inventory.docs_pages.length,
    two_run_ids: pages.length === inventory.docs_pages.length && check.ok,
    sources_sufficient: complete,
    second_reviews: complete,
    identity_equation: check.ok && pages.length === inventory.docs_pages.length,
    no_copied_stamp: !check.errors.some((e) => /copied source stamp/.test(e)),
    campaign_complete: complete,
  },
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(OUT_CLOSURE, JSON.stringify(closure, null, 2) + '\n');

console.log(
  `compact manifest ready=${complete} pages=${pages.length}/${inventory.docs_pages.length} errors=${errors.length} gate_errors=${check.errors.length}`
);
if (!complete) {
  for (const e of errors.slice(0, 20)) console.error(' -', e);
  for (const e of check.errors.slice(0, 20)) console.error(' -', e);
  process.exit(1);
}
