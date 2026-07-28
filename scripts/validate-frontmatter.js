#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { REQUIRED_FIELDS, extractFrontmatter, validateFields, isExcluded } = require('./lib/frontmatter');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

function getAllMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip non-content directories
      if (['overrides', 'stylesheets', 'javascripts', 'includes'].includes(entry.name)) continue;
      results.push(...getAllMdFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Support fichiers en argument (pour validation ciblée)
const args = process.argv.slice(2);
const files = args.length > 0
  ? args.map(f => path.resolve(f)).filter(f => f.endsWith('.md') && fs.existsSync(f))
  : getAllMdFiles(DOCS_DIR);
const errors = [];

for (const file of files) {
  const relativePath = path.relative(DOCS_DIR, file);

  if (isExcluded(relativePath)) continue;

  const content = fs.readFileSync(file, 'utf-8');
  const fm = extractFrontmatter(content);
  errors.push(...validateFields(fm, relativePath));
}

if (errors.length > 0) {
  console.error(`\n  ${errors.length} erreur(s) de frontmatter :\n`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error('');
  process.exit(1);
} else {
  console.log(`  ${files.length} fichiers v\u00e9rifi\u00e9s, frontmatter OK.`);
}
