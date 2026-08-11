#!/usr/bin/env node
/**
 * Calcule et injecte estimated_time dans le frontmatter YAML de chaque fiche.
 * Formule : max(5, round(((mots_hors_code / 200) + (blocs_code * 2)) / 5) * 5) min
 * Exclut : index.md, tags.md
 */

const fs = require('fs');
const path = require('path');
const { calculateReadingTime } = require('./lib/reading-time');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

function walkDir(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!item.name.startsWith('.') && item.name !== 'node_modules' && item.name !== 'stylesheets' && item.name !== 'javascripts' && item.name !== 'overrides') {
        results.push(...walkDir(fullPath));
      }
    } else if (item.name.endsWith('.md') && item.name !== 'index.md' && item.name !== 'tags.md') {
      results.push(fullPath);
    }
  }
  return results;
}

function updateFrontmatter(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');

  // Séparer le frontmatter du contenu
  if (!content.startsWith('---')) {
    // Pas de frontmatter : on en crée un minimal
    const time = calculateReadingTime(content);
    const fm = `---\nestimated_time: "${time}"\n---\n\n`;
    fs.writeFileSync(filepath, fm + content, 'utf-8');
    return { time, created: true };
  }

  // Parse le frontmatter existant
  const secondDash = content.indexOf('---', 3);
  if (secondDash === -1) return null;

  const fmContent = content.substring(3, secondDash).trim();
  const body = content.substring(secondDash + 3);
  const time = calculateReadingTime(body);

  // Mettre à jour ou ajouter estimated_time
  const lines = fmContent.split('\n');
  let found = false;
  const newLines = lines.map(line => {
    if (line.startsWith('estimated_time:')) {
      found = true;
      return `estimated_time: "${time}"`;
    }
    return line;
  });

  if (!found) {
    // Insérer après description: si elle existe, sinon à la fin
    const descIdx = newLines.findIndex(l => l.startsWith('description:'));
    if (descIdx !== -1) {
      newLines.splice(descIdx + 1, 0, `estimated_time: "${time}"`);
    } else {
      newLines.push(`estimated_time: "${time}"`);
    }
  }

  const newContent = `---\n${newLines.join('\n')}\n---${body}`;
  fs.writeFileSync(filepath, newContent, 'utf-8');
  return { time, created: false };
}

// Exécution
console.log('Calcul du temps de lecture...\n');
const files = walkDir(DOCS_DIR).sort();
let count = 0;

for (const file of files) {
  const rel = path.relative(DOCS_DIR, file);
  const result = updateFrontmatter(file);
  if (result) {
    console.log(`  ${rel} → ${result.time}`);
    count++;
  }
}

console.log(`\nTotal: ${count} fichiers mis à jour`);
