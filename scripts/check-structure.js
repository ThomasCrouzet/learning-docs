#!/usr/bin/env node
/**
 * Lint de structure des fiches pedagogiques.
 *
 * Parcourt docs/**\/*.md, retient les fiches eligibles (cf. lib/structure.js),
 * et verifie pour chacune :
 *  - bloc "En bref" immediatement apres le H1, au format attendu ;
 *  - section "## Navigation" presente ;
 *  - liens precedent ET suivant presents (sauf aux frontieres de groupe).
 *
 * Sortie : exit 1 s'il existe au moins un defaut, sinon message "OK" et exit 0.
 */

const fs = require('fs');
const path = require('path');
const { isFiche, groupByDir, checkFicheStructure } = require('./lib/structure');

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

// Liste des fiches eligibles (chemins relatifs a docs/).
const ficheRelPaths = getAllMdFiles(DOCS_DIR)
  .map((f) => path.relative(DOCS_DIR, f).split(path.sep).join('/'))
  .filter(isFiche);

// Regroupement par dossier pour determiner les frontieres (1re / derniere fiche).
const groups = groupByDir(ficheRelPaths);

const errors = [];

for (const [, files] of groups) {
  for (let i = 0; i < files.length; i++) {
    const rel = files[i];
    const content = fs.readFileSync(path.join(DOCS_DIR, rel), 'utf-8');
    const fileErrors = checkFicheStructure({
      content,
      isFirstInGroup: i === 0,
      isLastInGroup: i === files.length - 1,
    });
    for (const message of fileErrors) {
      errors.push({ file: rel, message });
    }
  }
}

if (errors.length === 0) {
  console.log(`  ${ficheRelPaths.length} fiches verifiees, structure OK.`);
  process.exit(0);
}

console.error(`\n  ${errors.length} defaut(s) de structure :\n`);
for (const { file, message } of errors) {
  console.error(`  ${file}`);
  console.error(`    ${message}\n`);
}
process.exit(1);
