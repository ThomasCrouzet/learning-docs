#!/usr/bin/env node
/**
 * Scan (and optionally fix) French accent residuals in docs/crypto-monnaies
 * using project applyRules, including pedagogical text/markdown fences.
 *
 * Usage:
 *   node scripts/scan-crypto-accent-residual.js           # write residual JSON
 *   node scripts/scan-crypto-accent-residual.js --fix    # apply fixes then rescan
 *   node scripts/scan-crypto-accent-residual.js --stdout
 */

const fs = require('fs');
const path = require('path');
const {
  processCryptoMarkdown,
  scanCryptoTree,
} = require('./lib/crypto-accent-scan');

const ROOT = path.join(__dirname, '..');
const CRYPTO = path.join(ROOT, 'docs', 'crypto-monnaies');
const OUT = path.join(ROOT, 'audit-reports', 'editorial', 'crypto-accent-residual.json');

const args = process.argv.slice(2);
const doFix = args.includes('--fix');
const stdout = args.includes('--stdout');

function walk(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full, rel));
    else if (e.name.endsWith('.md')) out.push(rel);
  }
  return out;
}

const files = walk(CRYPTO).sort();

if (doFix) {
  let fixedFiles = 0;
  let fixedLines = 0;
  for (const rel of files) {
    const full = path.join(CRYPTO, rel);
    const raw = fs.readFileSync(full, 'utf8');
    const { content, hitCount } = processCryptoMarkdown(raw);
    if (hitCount > 0) {
      fs.writeFileSync(full, content);
      fixedFiles++;
      fixedLines += hitCount;
    }
  }
  console.error(`Fixed ${fixedLines} line(s) in ${fixedFiles} file(s).`);
}

const report = scanCryptoTree(files, (rel) =>
  fs.readFileSync(path.join(CRYPTO, rel), 'utf8')
);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2));

if (stdout) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(
    `crypto accent residual: hit_count=${report.hit_count} files=${report.files_with_hits} → ${path.relative(ROOT, OUT)}`
  );
}

process.exit(0);
