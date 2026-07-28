#!/usr/bin/env node
/**
 * Gate: final-report coverage counts must match coverage.json;
 * if report claims zero crypto accents, residual hit_count must be 0.
 */

const fs = require('fs');
const path = require('path');
const {
  coverageSummary,
  parseFinalReportCoverageClaims,
  reportClaimsZeroCryptoAccents,
} = require('./lib/crypto-accent-scan');

const ROOT = path.join(__dirname, '..');
const COVERAGE = path.join(ROOT, 'audit-reports', 'editorial', 'coverage.json');
const RESIDUAL = path.join(ROOT, 'audit-reports', 'editorial', 'crypto-accent-residual.json');
const REPORT = path.join(ROOT, 'audit-reports', 'final-report-2026-07.md');

const errors = [];

if (!fs.existsSync(COVERAGE) || !fs.existsSync(REPORT)) {
  console.error('Missing coverage.json or final-report');
  process.exit(1);
}

const coverage = JSON.parse(fs.readFileSync(COVERAGE, 'utf8'));
const summary = coverageSummary(coverage);
const report = fs.readFileSync(REPORT, 'utf8');
const claims = parseFinalReportCoverageClaims(report);

for (const key of ['corrected', 'audited', 'uncertain']) {
  if (claims[key] === null) {
    errors.push(`final-report missing table count for ${key}`);
  } else if (claims[key] !== summary[key]) {
    errors.push(
      `final-report ${key}=${claims[key]} != coverage.json ${key}=${summary[key]}`
    );
  }
}

if (reportClaimsZeroCryptoAccents(report)) {
  if (!fs.existsSync(RESIDUAL)) {
    errors.push('report claims zero accents but crypto-accent-residual.json missing');
  } else {
    const residual = JSON.parse(fs.readFileSync(RESIDUAL, 'utf8'));
    if ((residual.hit_count || 0) !== 0) {
      errors.push(
        `report claims zero accents but residual hit_count=${residual.hit_count}`
      );
    }
  }
}

if (errors.length) {
  console.error('check-final-report-claims FAILED:');
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}

console.log(
  `check-final-report-claims OK (corrected=${summary.corrected} audited=${summary.audited} uncertain=${summary.uncertain})`
);
process.exit(0);
