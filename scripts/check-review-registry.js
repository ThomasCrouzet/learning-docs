#!/usr/bin/env node
/**
 * Gate: audit-reports/review-registry/registry.json must cover every docs page
 * and never point at a missing path without terminal status (merged/moved/removed).
 *
 * Campaign contract (open-source-readiness-2026):
 * - second_review_required implies second_review_done
 * - terminal ok|audited|corrected require review metadata (date, reviewer, domains,
 *   sources, examples_executed, perishable_claims) so coverage cannot be empty theater
 *
 * Usage:
 *   node scripts/check-review-registry.js
 *   node scripts/check-review-registry.js --strict  # also refuse pending
 */

const fs = require('fs');
const path = require('path');
const { inventaireMarkdown } = require('./lib/doc-audit');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const REGISTRY = path.join(ROOT, 'audit-reports', 'review-registry', 'registry.json');

const TERMINAL = new Set(['ok', 'corrected', 'merged', 'moved', 'removed', 'blocked']);
const ALLOWED = new Set([...TERMINAL, 'pending', 'audited']);
const REVIEWED_RESULTS = new Set(['ok', 'audited', 'corrected']);

const strict = process.argv.includes('--strict');
const errors = [];

function isNonEmptyArray(v) {
  return Array.isArray(v) && v.length > 0;
}

function hasSubstantiveItem(arr) {
  if (!isNonEmptyArray(arr)) return false;
  return arr.some((item) => {
    if (item == null) return false;
    if (typeof item === 'string') return item.trim().length > 0;
    if (typeof item === 'object') {
      // require at least one non-empty string field
      return Object.values(item).some(
        (v) => typeof v === 'string' && v.trim().length > 0
      );
    }
    return false;
  });
}

if (!fs.existsSync(REGISTRY)) {
  console.error('Missing review registry:', REGISTRY);
  process.exit(1);
}

const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
const entries = registry.entries || [];

const pages = inventaireMarkdown(DOCS, {
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

const byPath = new Map();
for (const e of entries) {
  const key = e.path_final || e.path_initial;
  if (!key) {
    errors.push('entry without path_initial/path_final');
    continue;
  }
  if (byPath.has(key)) {
    errors.push(`duplicate registry path: ${key}`);
  }
  byPath.set(key, e);

  const result = e.result || 'pending';
  if (!ALLOWED.has(result)) {
    errors.push(`${key}: invalid result "${result}"`);
  }

  const abs = path.join(DOCS, key);
  const exists = fs.existsSync(abs);
  if (!exists) {
    if (!['merged', 'moved', 'removed'].includes(result)) {
      errors.push(
        `${key}: missing on disk but result=${result} (need merged|moved|removed + reason)`
      );
    } else if (!e.changes || e.changes.length === 0) {
      if (!e.reserves || e.reserves.length === 0) {
        errors.push(`${key}: terminal ${result} without changes/reserves rationale`);
      }
    }
  }

  // Incomplete second reviews always fail the gate
  if (e.second_review_required && !e.second_review_done) {
    errors.push(
      `${key}: second_review_required=true but second_review_done=false`
    );
  }

  // Reviewed terminal statuses need campaign metadata
  if (REVIEWED_RESULTS.has(result) && exists) {
    if (!e.review_date) {
      errors.push(`${key}: result=${result} missing review_date`);
    }
    if (!e.reviewer_primary) {
      errors.push(`${key}: result=${result} missing reviewer_primary`);
    }
    const domains = e.domains_checked || [];
    if (!isNonEmptyArray(domains) && !e.lot) {
      errors.push(`${key}: result=${result} missing domains_checked or lot`);
    }
    if (!hasSubstantiveItem(e.sources)) {
      errors.push(
        `${key}: result=${result} sources must be a non-empty array of substantive items`
      );
    }
    if (!hasSubstantiveItem(e.examples_executed)) {
      errors.push(
        `${key}: result=${result} examples_executed must be a non-empty array (executed/skipped/fragment with reason)`
      );
    }
    if (!hasSubstantiveItem(e.perishable_claims)) {
      errors.push(
        `${key}: result=${result} perishable_claims must be a non-empty array (include explicit none_flagged if applicable)`
      );
    }
    // calculations_rechecked may be empty for non-numeric pages, but must be an array
    if (e.calculations_rechecked != null && !Array.isArray(e.calculations_rechecked)) {
      errors.push(`${key}: calculations_rechecked must be an array when present`);
    }
  }

  if (strict && (result === 'pending' || !e.review_date)) {
    errors.push(`${key}: still pending/unreviewed under --strict`);
  }
}

for (const p of pages) {
  if (!byPath.has(p)) {
    errors.push(`docs page missing from registry: ${p}`);
  }
}

if (errors.length) {
  console.error('check-review-registry FAILED:');
  for (const err of errors.slice(0, 80)) console.error(' -', err);
  if (errors.length > 80) console.error(` ... and ${errors.length - 80} more`);
  process.exit(1);
}

const counts = {};
let secondRequired = 0;
let secondDone = 0;
for (const e of entries) {
  const r = e.result || 'pending';
  counts[r] = (counts[r] || 0) + 1;
  if (e.second_review_required) {
    secondRequired += 1;
    if (e.second_review_done) secondDone += 1;
  }
}

console.log(
  `check-review-registry OK (entries=${entries.length} pages=${pages.length} ${JSON.stringify(counts)} second_reviews=${secondDone}/${secondRequired})`
);
process.exit(0);
