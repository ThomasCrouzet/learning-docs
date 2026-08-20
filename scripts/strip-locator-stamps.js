#!/usr/bin/env node
/**
 * Removes glued `[locator for path]` stamps from local campaign dossiers.
 * Does not set pedagogical_verdict.verified.
 */

const fs = require('fs');
const path = require('path');
const { stripLocatorStampFromSource, isLocatorStampExcerpt } = require('./lib/campaign-sources');

const ROOT = path.join(__dirname, '..');
const REVIEWS = path.join(ROOT, 'research-audit', 'campaign-2026-08', 'page-reviews');

if (!fs.existsSync(REVIEWS)) {
  console.log('strip-locator-stamps: no local page-reviews directory');
  process.exit(0);
}

let files = 0;
let sources = 0;
for (const name of fs.readdirSync(REVIEWS)) {
  if (!name.endsWith('.json')) continue;
  const file = path.join(REVIEWS, name);
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = false;
  if (Array.isArray(d.sources)) {
    d.sources = d.sources.map((s) => {
      if (!s || typeof s !== 'object') return s;
      if (
        isLocatorStampExcerpt(s.excerpt) ||
        isLocatorStampExcerpt(s.locator) ||
        isLocatorStampExcerpt(s.section) ||
        isLocatorStampExcerpt(s.passage)
      ) {
        sources += 1;
        changed = true;
        return stripLocatorStampFromSource(s);
      }
      return s;
    });
  }
  if (Array.isArray(d.claim_source_matrix)) {
    d.claim_source_matrix = d.claim_source_matrix.map((row) => {
      if (!row || typeof row !== 'object') return row;
      if (isLocatorStampExcerpt(row.excerpt) || isLocatorStampExcerpt(row.locator)) {
        changed = true;
        return stripLocatorStampFromSource(row);
      }
      return row;
    });
  }
  if (changed) {
    files += 1;
    fs.writeFileSync(file, JSON.stringify(d, null, 2) + '\n');
  }
}
console.log(`strip-locator-stamps: files=${files} sources=${sources}`);
