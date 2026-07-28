#!/usr/bin/env node
/**
 * Merge structured second-pass / content-expand findings into
 * audit-reports/review-registry/registry.json.
 *
 * Env:
 *   FINDINGS_ROOT - directory containing second-pass/*.json and content-expand/*.json
 *
 * Usage:
 *   FINDINGS_ROOT=... node scripts/apply-second-pass-findings.js
 */

const fs = require('fs');
const path = require('path');
const { sourcesForPath, stringifyReserve } = require('./lib/review-registry-sources');

const ROOT = path.join(__dirname, '..');
const REG_PATH = path.join(ROOT, 'audit-reports', 'review-registry', 'registry.json');
const FINDINGS_ROOT =
  process.env.FINDINGS_ROOT ||
  process.env.SCRATCH_FINDINGS ||
  '';

function loadJson(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function walkJsonFiles(dir, acc = []) {
  if (!dir || !fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkJsonFiles(full, acc);
    else if (name.endsWith('.json')) acc.push(full);
  }
  return acc;
}

function normalizePath(p) {
  return String(p || '')
    .replace(/^docs\//, '')
    .replace(/^\.\//, '');
}

function main() {
  if (!FINDINGS_ROOT) {
    console.error('Set FINDINGS_ROOT to the findings directory');
    process.exit(1);
  }
  const reg = loadJson(REG_PATH);
  if (!reg) {
    console.error('Missing registry', REG_PATH);
    process.exit(1);
  }
  const byPath = new Map();
  for (const e of reg.entries || []) {
    const k = e.path_final || e.path_initial;
    if (k) byPath.set(k, e);
  }

  // Only merge structured second-pass / content-expand campaign outputs
  const files = [
    ...walkJsonFiles(path.join(FINDINGS_ROOT, 'second-pass')),
    ...walkJsonFiles(path.join(FINDINGS_ROOT, 'content-expand')),
  ];
  let secondClosed = 0;
  let contentUpdated = 0;
  let unknownPaths = 0;

  function normalizeSources(raw, scope) {
    if (!Array.isArray(raw)) return [];
    const out = [];
    for (const s of raw) {
      if (typeof s === 'string' && s.startsWith('http')) {
        out.push({
          url: s,
          topic: 'primary source',
          date: '2026-07-28',
          scope,
        });
      } else if (s && typeof s === 'object' && typeof s.url === 'string') {
        out.push({
          url: s.url,
          topic: s.topic || s.title || 'source',
          date: s.date || '2026-07-28',
          scope: s.scope || scope,
        });
      }
    }
    return out;
  }

  function normalizePerishables(raw, note) {
    if (!Array.isArray(raw) || raw.length === 0) return null;
    return raw.map((c) =>
      typeof c === 'string'
        ? { claim: c, status: 'noted', note }
        : {
            claim: (c && (c.claim || c.text)) || 'claim',
            status: (c && c.status) || 'noted',
            note: (c && c.note) || note,
          }
    );
  }

  function normalizeExamples(raw) {
    if (Array.isArray(raw) && raw.length) return raw;
    if (raw === false || raw == null) {
      return [
        {
          status: 'not_run',
          reason: 'static second/content pass; no runtime harness in this lot',
        },
      ];
    }
    return null;
  }

  for (const file of files) {
    const data = loadJson(file);
    if (!data || !Array.isArray(data.pages)) continue;
    const defaultReviewer = data.reviewer || path.basename(file, '.json');
    const isSecond = file.includes(`${path.sep}second-pass${path.sep}`);
    const isContent = file.includes(`${path.sep}content-expand${path.sep}`);

    for (const page of data.pages) {
      const rel = normalizePath(page.path || page.file);
      if (!rel) continue;
      const e = byPath.get(rel);
      if (!e) {
        unknownPaths += 1;
        continue;
      }

      const scope = isSecond ? 'second_pass' : 'content_expand';
      const base = sourcesForPath(rel);
      const extra = normalizeSources(page.sources, scope);
      e.sources = [...base, ...extra];

      const perish = normalizePerishables(page.perishable_claims, defaultReviewer);
      if (perish) e.perishable_claims = perish;

      const examples = normalizeExamples(page.examples_executed);
      if (examples) e.examples_executed = examples;

      const changes = Array.isArray(page.changes)
        ? page.changes.map(stringifyReserve).filter(Boolean)
        : [];
      if (changes.length) {
        e.changes = Array.from(
          new Set([...(e.changes || []).map(stringifyReserve), ...changes])
        );
      }

      const reserves = Array.isArray(page.reserves)
        ? page.reserves.map(stringifyReserve).filter(Boolean)
        : [];
      if (reserves.length) {
        e.reserves = Array.from(
          new Set([
            ...(e.reserves || []).map(stringifyReserve).filter(Boolean),
            ...reserves,
          ])
        );
      }

      const verdict = String(page.verdict || page.result || '').toLowerCase();
      const corrected =
        verdict === 'corrected' ||
        verdict.includes('fix') ||
        (changes.length > 0 &&
          /fix|correct|ajout|remplac|mis à jour|updated|changed/i.test(
            changes.join(' ')
          ));

      if (corrected) {
        e.result = 'corrected';
        e.review_depth = 'content_fix';
      } else if (verdict === 'blocked') {
        e.result = 'blocked';
        e.review_depth = e.review_depth || 'lot_structural_sampled';
      } else if (isContent || isSecond) {
        if (e.result !== 'corrected') e.result = 'audited';
        const depthHint = String(page.review_depth || '');
        if (depthHint.includes('content_fix') || changes.length) {
          e.review_depth = 'content_fix';
        } else if (
          !e.review_depth ||
          e.review_depth === 'lot_pass' ||
          e.review_depth === 'lot_structural_sampled'
        ) {
          e.review_depth = 'lot_structural_sampled';
        }
        contentUpdated += 1;
      }

      if (isSecond) {
        e.second_review_required = true;
        e.second_review_done = true;
        e.second_reviewer = page.second_reviewer || defaultReviewer;
        e.second_review_verdict = page.verdict || page.result || 'pass_with_reserves';
        e.second_review_notes =
          page.second_review_notes ||
          page.notes ||
          `Independent second pass (${defaultReviewer}). Not a human expert certification.`;
        secondClosed += 1;
      }

      e.review_date = '2026-07-28';
      e.revalidation_needed = true;
      if (!e.reviewer_primary) e.reviewer_primary = defaultReviewer;
    }
  }

  reg.generated_at = new Date().toISOString();
  reg.campaign_notes = {
    ...(reg.campaign_notes || {}),
    apply_second_pass: 'apply-second-pass-findings.js',
    apply_date: '2026-07-28',
    full_corpus_page_level_review: false,
    not_a_human_expert_certification: true,
  };

  fs.writeFileSync(REG_PATH, JSON.stringify(reg, null, 2) + '\n');

  const incomplete = (reg.entries || []).filter(
    (e) => e.second_review_required && !e.second_review_done
  );
  console.log(
    JSON.stringify(
      {
        files: files.length,
        secondClosed,
        contentUpdated,
        unknownPaths,
        incompleteSecondRemaining: incomplete.length,
        incompleteSample: incomplete.slice(0, 10).map((e) => e.path_final),
      },
      null,
      2
    )
  );
}

main();
