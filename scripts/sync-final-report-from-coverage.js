#!/usr/bin/env node
/**
 * Rewrite coverage counts (and accent residual claim) in
 * audit-reports/final-report-2026-07.md from machine sources:
 *  - audit-reports/editorial/coverage.json
 *  - audit-reports/editorial/crypto-accent-residual.json (if present)
 */

const fs = require('fs');
const path = require('path');
const {
  coverageSummary,
  syncFinalReportMarkdown,
} = require('./lib/crypto-accent-scan');

const ROOT = path.join(__dirname, '..');
const COVERAGE = path.join(ROOT, 'audit-reports', 'editorial', 'coverage.json');
const RESIDUAL = path.join(ROOT, 'audit-reports', 'editorial', 'crypto-accent-residual.json');
const REPORT = path.join(ROOT, 'audit-reports', 'final-report-2026-07.md');

if (!fs.existsSync(COVERAGE)) {
  console.error('Missing', COVERAGE);
  process.exit(1);
}
if (!fs.existsSync(REPORT)) {
  console.error('Missing', REPORT);
  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(COVERAGE, 'utf8'));
const summary = coverageSummary(coverage);

let accentHitCount = null;
if (fs.existsSync(RESIDUAL)) {
  const residual = JSON.parse(fs.readFileSync(RESIDUAL, 'utf8'));
  accentHitCount = residual.hit_count ?? null;
}

const before = fs.readFileSync(REPORT, 'utf8');
const after = syncFinalReportMarkdown(before, summary, { accentHitCount });
fs.writeFileSync(REPORT, after);

console.log(
  `Synced final-report from coverage: corrected=${summary.corrected} audited=${summary.audited} uncertain=${summary.uncertain}` +
    (accentHitCount === null ? '' : ` accent_hit_count=${accentHitCount}`)
);
