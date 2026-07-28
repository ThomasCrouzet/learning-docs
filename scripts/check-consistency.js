#!/usr/bin/env node
/**
 * Lint de coherence inter-fiches.
 *
 * Parcourt docs/**\/*.md, retient les fiches eligibles, les regroupe par dossier
 * (un GROUPE = un dossier feuille de fiches numerotees), puis verifie pour chaque
 * groupe : fiche_number continu, total_fiches coherent et homogene, cursus homogene,
 * liens internes (Navigation + prerequis) existants, et chaine de navigation.
 *
 * Sortie : exit 1 s'il existe au moins un defaut, sinon message "OK" et exit 0.
 */

const fs = require('fs');
const path = require('path');
const { isFiche, groupByDir } = require('./lib/structure');
const { checkGroup } = require('./lib/consistency');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

function getAllMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
      results.push(...getAllMdFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Predicat d'existence : un chemin relatif a docs/ pointe-t-il vers un fichier reel ?
function exists(relPath) {
  return fs.existsSync(path.join(DOCS_DIR, relPath));
}

const ficheRelPaths = getAllMdFiles(DOCS_DIR)
  .map((f) => path.relative(DOCS_DIR, f).split(path.sep).join('/'))
  .filter(isFiche);

const groups = groupByDir(ficheRelPaths);

const errors = [];

for (const [dir, files] of groups) {
  const fiches = files.map((rel) => ({
    rel,
    content: fs.readFileSync(path.join(DOCS_DIR, rel), 'utf-8'),
  }));
  errors.push(...checkGroup({ dir, fiches, exists }));
}

if (errors.length === 0) {
  console.log(`  ${groups.size} groupes verifies (${ficheRelPaths.length} fiches), coherence OK.`);
  process.exit(0);
}

console.error(`\n  ${errors.length} probleme(s) de coherence :\n`);
for (const message of errors) {
  console.error(`  - ${message}`);
}
console.error('');
process.exit(1);
