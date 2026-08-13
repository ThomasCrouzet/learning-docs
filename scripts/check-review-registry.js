#!/usr/bin/env node
/**
 * Gate: audit-reports/review-registry/registry.json must cover every docs page
 * and never point at a missing path without terminal status (merged/moved/removed).
 *
 * Honesty rules (open-source-readiness-2026):
 * - second_review_done requires a non-empty second_reviewer (ban rubber stamps)
 * - incomplete second reviews (required && !done) are allowed and reported
 * - result=ok is refused when review_depth is only lot_pass / lot_structural_sampled
 *   without content changes (use audited instead)
 * - sources must be path-plausible (see lib/review-registry-sources.js)
 * - sole generic no_perishable_flagged_in_lot_pass with status=ok is refused
 * - reserves must not contain "[object Object]"
 *
 * Usage:
 *   node scripts/check-review-registry.js
 *   node scripts/check-review-registry.js --strict  # refuse pending; incomplete seconds are reported, not stamped
 *   node scripts/check-review-registry.js --json > coverage.json
 */

const fs = require('fs');
const path = require('path');
const { inventaireMarkdown } = require('./lib/doc-audit');
const {
  sourcesMatchPath,
  isGenericPerishableOnly,
} = require('./lib/review-registry-sources');
const { isPageOwnedEntry } = require('./lib/review-registry-page-owned');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const REGISTRY = path.join(ROOT, 'audit-reports', 'review-registry', 'registry.json');

const TERMINAL = new Set(['ok', 'corrected', 'merged', 'moved', 'removed', 'blocked']);
const ALLOWED = new Set([...TERMINAL, 'pending', 'audited']);
const REVIEWED_RESULTS = new Set(['ok', 'audited', 'corrected']);
const SHALLOW_DEPTH = new Set(['lot_pass', 'lot_structural_sampled', undefined, null, '']);

const strict = process.argv.includes('--strict');
const jsonOut = process.argv.includes('--json');
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
let incompleteSecond = 0;
let stampSecond = 0;
let pathMismatch = 0;
let genericPerishable = 0;
let shallowOk = 0;
let notPageOwned = 0;

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

  // Rubber-stamp second reviews always fail
  if (e.second_review_done) {
    const reviewer =
      typeof e.second_reviewer === 'string' ? e.second_reviewer.trim() : '';
    if (!reviewer) {
      stampSecond += 1;
      errors.push(
        `${key}: second_review_done=true without second_reviewer (rubber stamp banned)`
      );
    }
  }
  if (e.second_review_required && !e.second_review_done) {
    incompleteSecond += 1;
    // Incomplete seconds stay visible. --strict must not force a rubber stamp.
  }

  // Reserves must not contain Object stringification bugs
  if (Array.isArray(e.reserves)) {
    for (const r of e.reserves) {
      if (String(r).includes('[object Object]')) {
        errors.push(`${key}: reserves contains "[object Object]" (serialization bug)`);
      }
    }
  }

  // Source path plausibility for reviewed entries
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
    } else if (!sourcesMatchPath(key, e.sources)) {
      pathMismatch += 1;
      errors.push(
        `${key}: sources do not match path-prefix official docs (topic mismatch)`
      );
    }
    if (!hasSubstantiveItem(e.examples_executed)) {
      errors.push(
        `${key}: result=${result} examples_executed must be a non-empty array (executed/skipped/fragment with reason)`
      );
    }
    if (!hasSubstantiveItem(e.perishable_claims)) {
      errors.push(
        `${key}: result=${result} perishable_claims must be a non-empty array`
      );
    } else if (isGenericPerishableOnly(e.perishable_claims)) {
      const only = e.perishable_claims[0];
      const status = typeof only === 'object' && only ? only.status : '';
      if (status === 'ok') {
        genericPerishable += 1;
        errors.push(
          `${key}: sole perishable claim no_perishable_flagged_in_lot_pass with status=ok is banned (use unchecked + honest note, or real claims)`
        );
      }
    }
    if (e.calculations_rechecked != null && !Array.isArray(e.calculations_rechecked)) {
      errors.push(`${key}: calculations_rechecked must be an array when present`);
    }

    // result=ok requires content_fix depth or real applied fixes (not finding: notes)
    if (result === 'ok' && SHALLOW_DEPTH.has(e.review_depth)) {
      const hasRealFix =
        Array.isArray(e.changes) &&
        e.changes.some(
          (c) =>
            typeof c === 'string' &&
            !c.startsWith('finding:') &&
            c.trim().length > 0
        );
      if (!hasRealFix) {
        shallowOk += 1;
        errors.push(
          `${key}: result=ok with review_depth=${e.review_depth || 'empty'} without applied fixes is banned (use audited)`
        );
      }
    }

    if (!isPageOwnedEntry(key, e)) {
      notPageOwned += 1;
      if (strict) {
        errors.push(
          `${key}: not a page-owned review (lot overlay / generic claims / missing path-scoped sources)`
        );
      }
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

const counts = {};
let secondRequired = 0;
let secondDone = 0;
let secondWithReviewer = 0;
for (const e of entries) {
  const r = e.result || 'pending';
  counts[r] = (counts[r] || 0) + 1;
  if (e.second_review_required) {
    secondRequired += 1;
    if (e.second_review_done) {
      secondDone += 1;
      if (e.second_reviewer) secondWithReviewer += 1;
    }
  }
}

const coverage = {
  generated_at: new Date().toISOString(),
  entries: entries.length,
  pages: pages.length,
  results: counts,
  second_reviews: {
    required: secondRequired,
    done: secondDone,
    with_named_reviewer: secondWithReviewer,
    incomplete: incompleteSecond,
    stamp_blocked_if_any: stampSecond,
  },
  quality_flags: {
    path_source_mismatches: pathMismatch,
    generic_perishable_ok_banned: genericPerishable,
    shallow_ok_banned: shallowOk,
    not_page_owned: notPageOwned,
  },
  campaign_notes: registry.campaign_notes || null,
  full_corpus_page_level_review:
    errors.length === 0 &&
    notPageOwned === 0 &&
    entries.length === pages.length &&
    pages.length > 0,
  not_a_human_expert_certification: true,
  gate_errors: errors.length,
  ok: errors.length === 0,
};

if (strict && !coverage.full_corpus_page_level_review) {
  errors.push(
    'full_corpus_page_level_review=false (--strict requires a page-owned entry for every docs page)'
  );
  coverage.ok = false;
  coverage.gate_errors = errors.length;
  coverage.full_corpus_page_level_review = false;
}

if (errors.length) {
  coverage.ok = false;
  coverage.gate_errors = errors.length;
  coverage.sample_errors = errors.slice(0, 40);
  if (jsonOut) {
    process.stdout.write(JSON.stringify(coverage, null, 2) + '\n');
  } else {
    console.error('check-review-registry FAILED:');
    for (const err of errors.slice(0, 80)) console.error(' -', err);
    if (errors.length > 80) {
      console.error(` ... and ${errors.length - 80} more`);
    }
  }
  process.exit(1);
}

if (jsonOut) {
  process.stdout.write(JSON.stringify(coverage, null, 2) + '\n');
} else {
  console.log(
    `check-review-registry OK (entries=${entries.length} pages=${pages.length} ${JSON.stringify(counts)} second_reviews=${secondDone}/${secondRequired} named=${secondWithReviewer} incomplete=${incompleteSecond} full_corpus_page_level_review=${coverage.full_corpus_page_level_review})`
  );
}
process.exit(0);
