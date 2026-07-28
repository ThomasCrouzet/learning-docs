#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { countEmDashes, fixEmDashes } = require('./lib/emdash');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const FIX_MODE = process.argv.includes('--fix');

// Accept file arguments (used by lint-staged) or scan all docs/
const explicitFiles = process.argv.filter(a => a !== '--fix' && a.endsWith('.md'));

function getAllMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['overrides', 'stylesheets', 'javascripts'].includes(entry.name)) continue;
      results.push(...getAllMdFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = explicitFiles.length > 0
  ? explicitFiles.map(f => path.resolve(f))
  : getAllMdFiles(DOCS_DIR);
let totalCount = 0;
const affected = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const count = countEmDashes(content);

  if (count === 0) continue;

  totalCount += count;
  const relativePath = path.relative(DOCS_DIR, file);
  affected.push({ path: relativePath, count });

  if (FIX_MODE) {
    const fixed = fixEmDashes(content);
    fs.writeFileSync(file, fixed, 'utf-8');
  }
}

if (affected.length === 0) {
  console.log('  Aucun em dash (\u2014) trouvé.');
  process.exit(0);
}

if (FIX_MODE) {
  console.log(`  ${totalCount} em dash(s) corrigé(s) dans ${affected.length} fichier(s).`);
} else {
  console.error(`\n  ${totalCount} em dash(s) trouvé(s) dans ${affected.length} fichier(s) :\n`);
  for (const { path: p, count } of affected) {
    console.error(`  - ${p} (${count})`);
  }
  console.error('\n  Corrigez avec : npm run lint:emdash:fix\n');
  process.exit(1);
}
