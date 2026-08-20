#!/usr/bin/env node
/**
 * Clears seal-assigned second-review completion flags on local dossiers.
 * Keeps second_review_done only when a hostile finding file lists the path.
 */

const fs = require('fs');
const path = require('path');
const {
  collectSecondReviewArtifacts,
  applyHonestSecondReviewToDossier,
} = require('./lib/campaign-final');

const ROOT = path.join(__dirname, '..');
const STATE = path.join(ROOT, 'research-audit', 'campaign-2026-08');
const REVIEWS = path.join(STATE, 'page-reviews');
const FINDINGS = path.join(STATE, 'findings');

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

if (!fs.existsSync(REVIEWS)) {
  console.log('reset-seal-second-review: no local page-reviews directory');
  process.exit(0);
}

const artifacts = collectSecondReviewArtifacts(loadFindingDocs(FINDINGS));
let kept = 0;
let cleared = 0;
for (const name of fs.readdirSync(REVIEWS)) {
  if (!name.endsWith('.json')) continue;
  const file = path.join(REVIEWS, name);
  const d = load(file);
  const rel = d.page_id || name.replace(/__/g, '/').replace(/\.json$/, '');
  const next = applyHonestSecondReviewToDossier(d, rel, artifacts);
  if (next.second_review_done) kept += 1;
  else cleared += 1;
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + '\n');
}
console.log(
  `reset-seal-second-review: kept=${kept} cleared=${cleared} artifacts=${Object.keys(artifacts).length}`
);
