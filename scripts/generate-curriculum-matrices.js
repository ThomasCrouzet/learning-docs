#!/usr/bin/env node
/**
 * Génère une matrice par cursus sous research-audit/campaign-2026-08/curriculum-matrices/.
 */

const fs = require('fs');
const path = require('path');
const { inventaireMarkdown } = require('./lib/doc-audit');
const { isFiche } = require('./lib/structure');
const { extractFrontmatter } = require('./lib/frontmatter');
const {
  extractPrereqLines,
  extractObjective,
  extractConceptHeadings,
  buildCursusMatrix,
} = require('./lib/curriculum-matrix');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const OUT = path.join(ROOT, 'research-audit', 'campaign-2026-08', 'curriculum-matrices');

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

const byCursus = new Map();
for (const rel of pages) {
  if (!isFiche(rel)) continue;
  const body = fs.readFileSync(path.join(DOCS, rel), 'utf8');
  const fm = extractFrontmatter(body) || {};
  const cursus = String(fm.cursus || rel.split('/')[0]).replace(/^["']|["']$/g, '');
  if (!byCursus.has(cursus)) byCursus.set(cursus, []);
  byCursus.get(cursus).push({
    path: rel,
    concepts: extractConceptHeadings(body),
    objective: extractObjective(body),
    prereqs: extractPrereqLines(body),
  });
}

fs.mkdirSync(OUT, { recursive: true });
const index = [];
for (const [cursus, list] of [...byCursus.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const matrix = buildCursusMatrix({ cursus, pages: list });
  const slug = cursus
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const file = path.join(OUT, `${slug}.json`);
  fs.writeFileSync(file, JSON.stringify(matrix, null, 2) + '\n');
  index.push({ cursus, file: path.relative(ROOT, file), pages: list.length, overlaps: matrix.overlaps.length });
}

fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ generated_at: new Date().toISOString(), cursus: index }, null, 2) + '\n');
console.log(`curriculum matrices: ${index.length} cursus, ${index.reduce((s, c) => s + c.pages, 0)} fiches`);
