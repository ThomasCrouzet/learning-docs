import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { inventaireMarkdown } from '../lib/doc-audit.js';
import { spawnSync } from 'child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DOCS = path.join(ROOT, 'docs');
const REGISTRY = path.join(ROOT, 'audit-reports', 'review-registry', 'registry.json');
const CHECKER = path.join(ROOT, 'scripts', 'check-review-registry.js');

function hasSubstantiveItem(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
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

const describeReviewRegistry = fs.existsSync(REGISTRY) ? describe : describe.skip;

describeReviewRegistry('review registry (local audit artefact)', () => {
  it('exists and covers every docs page without phantom non-terminal paths', () => {
    expect(fs.existsSync(REGISTRY)).toBe(true);
    const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
    const entries = registry.entries || [];
    expect(entries.length).toBeGreaterThan(0);

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
      expect(key).toBeTruthy();
      expect(byPath.has(key)).toBe(false);
      byPath.set(key, e);
      const result = e.result || 'pending';
      const abs = path.join(DOCS, key);
      if (!fs.existsSync(abs)) {
        expect(['merged', 'moved', 'removed']).toContain(result);
      }
    }

    for (const p of pages) {
      expect(byPath.has(p)).toBe(true);
    }
  });

  it('bans rubber-stamp second reviews and stores campaign metadata on reviewed pages', () => {
    const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
    const reviewed = new Set(['ok', 'audited', 'corrected']);
    for (const e of registry.entries) {
      // Incomplete second reviews are honest; done requires a named reviewer
      if (e.second_review_done) {
        expect(typeof e.second_reviewer).toBe('string');
        expect(e.second_reviewer.trim().length).toBeGreaterThan(0);
      }
      if (!reviewed.has(e.result)) continue;
      const abs = path.join(DOCS, e.path_final || e.path_initial);
      if (!fs.existsSync(abs)) continue;
      expect(e.review_date).toBeTruthy();
      expect(e.reviewer_primary).toBeTruthy();
      expect(
        (Array.isArray(e.domains_checked) && e.domains_checked.length > 0) || e.lot
      ).toBe(true);
      expect(hasSubstantiveItem(e.sources)).toBe(true);
      expect(hasSubstantiveItem(e.examples_executed)).toBe(true);
      expect(hasSubstantiveItem(e.perishable_claims)).toBe(true);
      // sole generic ok stamp banned
      const claims = e.perishable_claims || [];
      if (claims.length === 1) {
        const c = claims[0];
        const claim = typeof c === 'string' ? c : c?.claim;
        const status = typeof c === 'object' ? c?.status : '';
        if (typeof claim === 'string' && claim.includes('no_perishable_flagged_in_lot_pass')) {
          expect(status).not.toBe('ok');
        }
      }
      // no serialization bugs
      for (const r of e.reserves || []) {
        expect(String(r)).not.toContain('[object Object]');
      }
    }
  });

  it('runs the shipped check-review-registry entry point successfully', () => {
    const r = spawnSync(process.execPath, [CHECKER], {
      encoding: 'utf8',
      cwd: ROOT,
    });
    expect(r.status).toBe(0);
    expect(r.stdout).toMatch(/check-review-registry OK/);
  });
});
