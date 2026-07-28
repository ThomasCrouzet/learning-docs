#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { stripCustomTags } = require('./lib/yaml-utils');
const { collectFiches: collectFichesLib, findIndexPath, computeStats, buildMarkdown } = require('./lib/cursus-map');
const { isFiche } = require('./lib/structure');

const ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const MKDOCS_PATH = path.join(ROOT, 'mkdocs.yml');
const OUTPUT_PATH = path.join(DOCS_DIR, 'carte-cursus.md');

function extractFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;
    return yaml.load(match[1]);
  } catch {
    return null;
  }
}

function collectFiches(navItems) {
  return collectFichesLib(navItems, (itemPath) => extractFrontmatter(path.join(DOCS_DIR, itemPath)));
}

// Tabs to skip
const SKIP_TABS = new Set(['Accueil', 'Carte des cursus']);
// Sub-sections to skip (tab-level index pages, not real cursus)
const SKIP_SECTIONS = new Set(['Changelog']);

// Parse mkdocs.yml nav
const mkdocsConfig = yaml.load(stripCustomTags(fs.readFileSync(MKDOCS_PATH, 'utf-8')));
const nav = mkdocsConfig.nav || [];

const groups = []; // { tabName, cursus: [{ name, count, time, levels, indexPath }] }

for (const tabEntry of nav) {
  if (typeof tabEntry !== 'object') continue;

  for (const [tabName, tabContent] of Object.entries(tabEntry)) {
    if (SKIP_TABS.has(tabName)) continue;
    if (!Array.isArray(tabContent)) continue;

    const cursusInTab = [];
    // Collect direct file entries (not sub-sections) to group them
    const directFiles = [];
    let tabIndexPath = null;

    for (const subEntry of tabContent) {
      // Tab-level index.md
      if (typeof subEntry === 'string') {
        if (subEntry.endsWith('index.md')) tabIndexPath = subEntry;
        continue;
      }
      if (typeof subEntry !== 'object') continue;

      for (const [subName, subContent] of Object.entries(subEntry)) {
        if (SKIP_SECTIONS.has(subName)) continue;

        // Direct file reference (not a sub-section with array content)
        if (typeof subContent === 'string') {
          const fm = extractFrontmatter(path.join(DOCS_DIR, subContent));
          if (fm) directFiles.push({ path: subContent, ...fm });
          continue;
        }

        if (!Array.isArray(subContent)) continue;

        const fiches = collectFiches(subContent);
        if (fiches.length === 0) continue;

        const indexPath = findIndexPath(subContent);
        const stats = computeStats(fiches);

        cursusInTab.push({
          name: subName,
          count: fiches.length,
          time: stats.timeStr,
          levels: stats.levels,
          indexPath,
        });
      }
    }

    // Direct .md entries in the tab (e.g. aide-mémoires under Références).
    // Previously counted only when the tab had zero nested sections, which
    // dropped docs/fiches-reference/* whenever "Certification" lived in the
    // same tab (604 numbered on disk vs 586 on the carte). Always count
    // numbered fiches (isFiche) among direct files.
    const directFiches = directFiles.filter((f) => isFiche(f.path));
    if (directFiches.length > 0) {
      const stats = computeStats(directFiches);
      const name =
        cursusInTab.length === 0
          ? tabName
          : tabName === 'Références'
            ? 'Aide-mémoires'
            : `${tabName} (fiches directes)`;
      cursusInTab.push({
        name,
        count: directFiches.length,
        time: stats.timeStr,
        levels: stats.levels,
        indexPath: tabIndexPath,
      });
    }

    if (cursusInTab.length > 0) {
      groups.push({ tabName, cursus: cursusInTab });
    }
  }
}

// Totaux
const allCursus = groups.flatMap(g => g.cursus);
const totalFiches = allCursus.reduce((s, c) => s + c.count, 0);
const totalCursus = allCursus.length;

// Genere le contenu de la page (fonction pure, sans I/O)
const content = buildMarkdown(groups);

// Mode --check : compare le contenu regenere au fichier sur disque sans ecrire.
// Sort en erreur (exit 1) si divergence, exit 0 sinon. Utilise par lint:ci / la CI.
const isCheck = process.argv.includes('--check');

if (isCheck) {
  let current = null;
  try {
    current = fs.readFileSync(OUTPUT_PATH, 'utf-8');
  } catch {
    current = null;
  }

  if (current === content) {
    console.log(`Carte des cursus à jour (${totalCursus} cursus, ${totalFiches} fiches).`);
    process.exit(0);
  }

  console.error(
    `Carte des cursus périmée : ${path.relative(ROOT, OUTPUT_PATH)} ne correspond plus aux fiches.\n` +
    `Régénération attendue : ${totalCursus} cursus, ${totalFiches} fiches.\n` +
    `Lance "npm run generate:cursus-map" puis commit le résultat.`
  );
  process.exit(1);
}

fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
console.log(`Carte des cursus générée : ${path.relative(ROOT, OUTPUT_PATH)} (${totalCursus} cursus, ${totalFiches} fiches)`);
