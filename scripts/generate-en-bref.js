#!/usr/bin/env node
/**
 * Génère la section "En Bref" pour chaque fiche pédagogique.
 * Extrait le titre H1, la section "Objectif de cette fiche",
 * et le estimated_time du frontmatter.
 * Insère un blockquote après le H1.
 * Génère review-en-bref.md avec tous les résumés pour relecture.
 */

const fs = require('fs');
const path = require('path');
const { getEstimatedTime, getObjectif, hasEnBref, buildEnBrefBlockquote } = require('./lib/en-bref');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const REVIEW_FILE = path.join(__dirname, '..', 'review-en-bref.md');

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

function processFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf-8');

  // Skip si déjà présent
  if (hasEnBref(content)) {
    // Mettre à jour le temps si nécessaire
    const time = getEstimatedTime(content);
    if (time) {
      const timePattern = /Lecture estimée : \d+ min\./;
      if (timePattern.test(content)) {
        content = content.replace(timePattern, `Lecture estimée : ${time}.`);
        fs.writeFileSync(filepath, content, 'utf-8');
      }
    }
    // Retourner le résumé existant pour le review
    const match = content.match(/> \*\*En bref\*\* : (.+)/);
    return match ? match[1] : null;
  }

  const time = getEstimatedTime(content);

  // Séparer frontmatter et body
  let body = content;
  if (content.startsWith('---')) {
    const secondDash = content.indexOf('---', 3);
    if (secondDash !== -1) {
      body = content.substring(secondDash + 3);
    }
  }

  const objectif = getObjectif(body);
  if (!objectif) return null;

  // Construire le blockquote
  let enBref = objectif;
  // S'assurer que ça finit par un point
  if (!enBref.endsWith('.') && !enBref.endsWith('!') && !enBref.endsWith(':')) {
    enBref += '.';
  }
  if (time) {
    enBref += ` Lecture estimée : ${time}.`;
  }

  const blockquote = `\n> **En bref** : ${enBref}\n`;

  // Trouver le H1 et insérer après
  const h1Match = body.match(/^(# .+)$/m);
  if (!h1Match) return null;

  const h1Index = body.indexOf(h1Match[0]);
  const h1End = h1Index + h1Match[0].length;

  // Vérifier s'il y a déjà une ligne vide après le H1
  const afterH1 = body.substring(h1End);
  const newBody = body.substring(0, h1End) + '\n' + blockquote + afterH1;

  // Reconstruire le fichier
  if (content.startsWith('---')) {
    const secondDash = content.indexOf('---', 3);
    const fm = content.substring(0, secondDash + 3);
    content = fm + newBody;
  } else {
    content = newBody;
  }

  fs.writeFileSync(filepath, content, 'utf-8');
  return enBref;
}

// Exécution
console.log('Génération des sections "En Bref"...\n');

const files = walkDir(DOCS_DIR).sort();
let count = 0;
const reviewEntries = [];

for (const file of files) {
  const rel = path.relative(DOCS_DIR, file);
  const summary = processFile(file);
  if (summary) {
    console.log(`  ${rel}`);
    reviewEntries.push({ file: rel, summary });
    count++;
  } else {
    console.log(`  ${rel} (skip: pas d'objectif trouvé)`);
  }
}

// Générer le fichier de review
const reviewContent = `# Review — Sections "En Bref" générées

${reviewEntries.map(e => `## ${e.file}\n\n> **En bref** : ${e.summary}\n`).join('\n')}
`;

fs.writeFileSync(REVIEW_FILE, reviewContent, 'utf-8');
console.log(`\nTotal: ${count} fiches avec "En Bref"`);
console.log(`Fichier de review: review-en-bref.md`);
