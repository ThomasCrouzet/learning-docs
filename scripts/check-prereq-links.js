#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { extractPrereqSections, hasUnlinkedReference } = require('./lib/prereq-links');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

function getAllMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
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
  if (file.endsWith('index.md') || file.endsWith('tags.md') || file.endsWith('carte-cursus.md')) continue;

  const content = fs.readFileSync(file, 'utf-8');
  const prereqSections = extractPrereqSections(content);

  for (const section of prereqSections) {
    for (let i = 0; i < section.lines.length; i++) {
      const line = section.lines[i];
      const lineNum = section.start + i + 1;

      if (hasUnlinkedReference(line)) {
        const relativePath = path.relative(DOCS_DIR, file);
        errors.push({
          file: relativePath,
          line: lineNum,
          text: line.trim(),
        });
      }
    }
  }
}

if (errors.length === 0) {
  console.log(`  ${files.length} fichiers verifies, tous les prerequis ont des liens.`);
  process.exit(0);
}

console.error(`\n  ${errors.length} prerequis sans lien :\n`);
for (const { file, line, text } of errors) {
  console.error(`  ${file}:${line}`);
  console.error(`    ${text}\n`);
}
process.exit(1);
