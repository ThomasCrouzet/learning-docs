#!/usr/bin/env node
/**
 * Applies a page-owned second-review report onto local dossiers.
 * Usage: node scripts/apply-pageowned-second-review.js <report.json>
 */

const fs = require('fs');
const path = require('path');
const { applyPageOwnedSecondReview, pageOwnedNotesLookCopied } = require('./lib/campaign-final');

const ROOT = path.join(__dirname, '..');
const REVIEWS = path.join(ROOT, 'research-audit', 'campaign-2026-08', 'page-reviews');
const reportPath = process.argv[2];
if (!reportPath) {
  console.error('usage: node scripts/apply-pageowned-second-review.js <report.json>');
  process.exit(2);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const pages = Array.isArray(report.pages) ? report.pages : [];
if (pageOwnedNotesLookCopied(pages)) {
  console.error('apply-pageowned-second-review: copied notes across the lot (not page-owned)');
  process.exit(1);
}

const runId = report.run_id || report.runId;
const reviewer = report.reviewer;
if (!runId || !reviewer) {
  console.error('report needs run_id and reviewer');
  process.exit(1);
}

let applied = 0;
let verified = 0;
for (const page of pages) {
  const rel = page.path || page.page_id;
  const file = path.join(REVIEWS, `${String(rel).replace(/[\\/]/g, '__')}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`missing dossier ${rel}`);
  }
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  const next = applyPageOwnedSecondReview(d, page, { runId, reviewer });
  fs.writeFileSync(file, JSON.stringify(next, null, 2) + '\n');
  applied += 1;
  if (next.pedagogical_verdict && next.pedagogical_verdict.verified) verified += 1;
}
console.log(`apply-pageowned-second-review: applied=${applied} verified=${verified} run=${runId}`);
