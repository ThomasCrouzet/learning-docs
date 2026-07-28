#!/usr/bin/env node
/**
 * Audit documentaire unifie — runner CLI.
 *
 * Usage :
 *   node scripts/doc-audit.js              # ecrit rapport JSON + MD sous audit-reports/
 *   node scripts/doc-audit.js --stdout     # affiche le resume Markdown sur stdout
 *   node scripts/doc-audit.js --json       # affiche le JSON complet sur stdout
 *   node scripts/doc-audit.js --fail-on high  # exit 1 si findings high (defaut: never)
 *
 * Sortie :
 *   audit-reports/doc-audit-latest.json
 *   audit-reports/doc-audit-latest.md
 *   audit-reports/doc-audit-YYYY-MM-DD.json (copie datee)
 */

const fs = require('fs');
const path = require('path');
const {
  inventaireMarkdown,
  runDocAudit,
  formatReportMarkdown,
} = require('./lib/doc-audit');

const ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const REPORTS_DIR = path.join(ROOT, 'audit-reports');
const MKDOCS = path.join(ROOT, 'mkdocs.yml');

const args = process.argv.slice(2);
const wantStdout = args.includes('--stdout');
const wantJson = args.includes('--json');
const failOnIdx = args.indexOf('--fail-on');
const failOn = failOnIdx >= 0 ? args[failOnIdx + 1] : 'never';

function listDir(p) {
  return fs.readdirSync(p);
}
function isDir(p) {
  try {
    return fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}
function exists(p) {
  return fs.existsSync(p);
}

const pages = inventaireMarkdown(DOCS_DIR, {
  readFile: (p) => fs.readFileSync(p, 'utf8'),
  listDir,
  isDir,
  exists,
});

const contentCache = new Map();
function readContent(rel) {
  if (contentCache.has(rel)) return contentCache.get(rel);
  const c = fs.readFileSync(path.join(DOCS_DIR, rel), 'utf8');
  contentCache.set(rel, c);
  return c;
}
function fileExists(rel) {
  return fs.existsSync(path.join(DOCS_DIR, rel));
}

let mkdocsYml = null;
if (fs.existsSync(MKDOCS)) {
  mkdocsYml = fs.readFileSync(MKDOCS, 'utf8');
}

const report = runDocAudit({
  pages,
  readContent,
  fileExists,
  mkdocsYml,
  options: { heuristics: true },
});

// Persist full page list for coverage checks
report.inventory.pages = pages;

const md = formatReportMarkdown(report, {
  remaining:
    '- Exactitude technique profonde (exécution des exemples) : relecture éditoriale par cursus.\n' +
    '- Liens externes : non vérifiés par défaut (utiliser --check-external si implémenté).\n' +
    '- Actualité juillet 2026 des stacks hors heuristiques de versions : vérification manuelle / web.',
});

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

const dateStamp = new Date().toISOString().slice(0, 10);
const jsonPath = path.join(REPORTS_DIR, 'doc-audit-latest.json');
const mdPath = path.join(REPORTS_DIR, 'doc-audit-latest.md');
const datedJson = path.join(REPORTS_DIR, `doc-audit-${dateStamp}.json`);

// Strip full findings from "latest" display? Keep full for tooling.
// Cap findings in dated? No — full JSON is the machine-readable source.
const jsonOut = JSON.stringify(report, null, 2);
fs.writeFileSync(jsonPath, jsonOut);
fs.writeFileSync(mdPath, md);
fs.writeFileSync(datedJson, jsonOut);

// Compact page coverage list (status only) for coverage gating
const coveragePath = path.join(REPORTS_DIR, 'doc-audit-coverage.json');
const coverage = {
  generated_at: report.generated_at,
  total: pages.length,
  pages: pages.map((p) => ({
    path: p,
    issues: report.page_status[p]?.issues ?? 0,
    is_fiche: report.page_status[p]?.isFiche ?? false,
    automated_audit: true,
  })),
};
fs.writeFileSync(coveragePath, JSON.stringify(coverage, null, 2));

if (wantJson) {
  console.log(jsonOut);
} else if (wantStdout) {
  console.log(md);
} else {
  console.log(`Audit documentaire : ${report.inventory.total_pages} pages inventoriées`);
  console.log(`  Fiches : ${report.inventory.fiches} | Méta : ${report.inventory.meta_pages}`);
  console.log(`  Findings : ${report.findings_count} (${report.controlled.with_issues} pages concernées)`);
  console.log('  Par catégorie :');
  const cats = Object.entries(report.by_category).sort((a, b) => b[1] - a[1]);
  for (const [cat, n] of cats.slice(0, 15)) {
    console.log(`    ${cat}: ${n}`);
  }
  if (cats.length > 15) console.log(`    … +${cats.length - 15} catégories`);
  console.log(`  Rapports : ${path.relative(ROOT, mdPath)}, ${path.relative(ROOT, jsonPath)}`);
}

const severityRank = { high: 3, medium: 2, low: 1, never: 99 };
const threshold = severityRank[failOn] ?? 99;
if (threshold < 99) {
  const bad = report.findings.some((f) => (severityRank[f.severity] || 0) >= threshold);
  if (bad) {
    console.error(`\nÉchec : findings de sévérité >= ${failOn} détectés.`);
    process.exit(1);
  }
}

process.exit(0);
