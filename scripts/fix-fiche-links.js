#!/usr/bin/env node
/**
 * Détecte les mentions de fiches sans lien actif et les transforme en liens markdown.
 *
 * Patterns détectés :
 *   1. "Fiche **01 - Titre**"         → "Fiche **[01 - Titre](chemin.md)**"
 *   2. "Fiche 02-php/07 - Titre"      → "Fiche [02-php/07 - Titre](chemin.md)"
 *   3. "Fiche **01 - Titre** (...)     → "Fiche **[01 - Titre](chemin.md)** (...)"
 *   4. "fiche **01 - Titre**"          → "fiche **[01 - Titre](chemin.md)**"
 */

const fs = require('fs');
const path = require('path');
const { findFiche: findFicheLib, relativePath: relativePathLib } = require('./lib/fiche-links');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

// Construire un index de toutes les fiches
function buildIndex(dir, basePath = '') {
  const index = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relPath = basePath ? `${basePath}/${item.name}` : item.name;
    if (item.isDirectory()) {
      if (!item.name.startsWith('.') && item.name !== 'node_modules' &&
          item.name !== 'stylesheets' && item.name !== 'javascripts' && item.name !== 'overrides') {
        index.push(...buildIndex(fullPath, relPath));
      }
    } else if (item.name.endsWith('.md') && item.name !== 'index.md' && item.name !== 'tags.md') {
      // Extraire le numéro et le titre H1
      const content = fs.readFileSync(fullPath, 'utf-8');
      const h1Match = content.match(/^#\s+(.+)$/m);
      const title = h1Match ? h1Match[1].trim() : '';
      const numMatch = item.name.match(/^(\d+)-/);
      const num = numMatch ? numMatch[1] : '';

      index.push({
        filename: item.name,
        relPath,
        fullPath,
        dir: basePath,
        num,
        title,
        // Titre normalisé pour la recherche
        titleLower: title.toLowerCase().replace(/[^a-zàâäéèêëïîôùûüÿçœæ0-9\s]/g, '').trim(),
      });
    }
  }
  return index;
}

// Aliases pour compatibilite
const findFiche = findFicheLib;
const relativePath = relativePathLib;

function processFile(filepath, index) {
  let content = fs.readFileSync(filepath, 'utf-8');
  const fileRelPath = path.relative(DOCS_DIR, filepath);
  const fileDir = path.dirname(fileRelPath);
  let changes = 0;

  // Pattern 1: "Fiche **NN - Titre**" (sans lien)
  // Ne pas matcher si déjà un lien à l'intérieur
  content = content.replace(
    /([Ff]iche )\*\*(?!\[)(\d+\s*-\s*[^*]+)\*\*/g,
    (match, prefix, refText) => {
      const fiche = findFiche(index, refText.trim(), fileDir);
      if (fiche) {
        const rel = relativePath(fileRelPath, fiche.relPath);
        changes++;
        return `${prefix}**[${refText.trim()}](${rel})**`;
      }
      return match;
    }
  );

  // Pattern 2: "Fiche NN-dir/NN - Titre" (avec chemin dossier, sans bold ni lien)
  content = content.replace(
    /([Ff]iche )(\d+-[a-z-]+\/\d+\s*-\s*[^\n([\]]+?)(\s*\(|$)/gm,
    (match, prefix, refText, suffix) => {
      // Vérifier que ce n'est pas déjà dans un lien
      if (match.includes('](') || match.includes('](')) return match;
      const fiche = findFiche(index, refText.trim(), fileDir);
      if (fiche) {
        const rel = relativePath(fileRelPath, fiche.relPath);
        changes++;
        return `${prefix}[${refText.trim()}](${rel})${suffix}`;
      }
      return match;
    }
  );

  // Pattern 3: "avoir lu la fiche **NN - Titre**" (même traitement que pattern 1)
  // Déjà couvert par Pattern 1

  // Pattern 4: "Fiche **01-docker/01-docker-compose-symfony.md**" (chemin de fichier en bold)
  content = content.replace(
    /([Ff]iche )\*\*(?!\[)(\d+-[a-z-]+\/\d+-[a-z-]+\.md)\*\*/g,
    (match, prefix, filePath) => {
      const target = index.find(f => f.relPath === filePath || f.relPath.endsWith(filePath));
      if (target) {
        const rel = relativePath(fileRelPath, target.relPath);
        const displayName = target.title || filePath;
        changes++;
        return `${prefix}**[${displayName}](${rel})**`;
      }
      return match;
    }
  );

  // Pattern 5: "Fiche **00 - Titre** (`chemin`)" - contient un chemin entre backticks
  content = content.replace(
    /([Ff]iche )\*\*(?!\[)(\d+\s*-\s*[^*]+)\*\*\s*\(`([^`]+)`\)/g,
    (match, prefix, refText, filePath) => {
      // Utiliser le chemin fourni
      const target = index.find(f => f.relPath === filePath || f.relPath.endsWith(filePath.replace(/^\.\.\//, '')));
      if (target) {
        const rel = relativePath(fileRelPath, target.relPath);
        changes++;
        return `${prefix}**[${refText.trim()}](${rel})**`;
      }
      return match;
    }
  );

  if (changes > 0) {
    fs.writeFileSync(filepath, content, 'utf-8');
  }
  return changes;
}

// === Exécution ===
console.log('Construction de l\'index des fiches...');
const index = buildIndex(DOCS_DIR);
console.log(`${index.length} fiches indexées.\n`);

console.log('Correction des liens manquants...\n');
let totalChanges = 0;
let filesChanged = 0;

// Traiter toutes les fiches
for (const fiche of index) {
  const changes = processFile(fiche.fullPath, index);
  if (changes > 0) {
    const rel = path.relative(DOCS_DIR, fiche.fullPath);
    console.log(`  ${rel} : ${changes} lien(s) ajouté(s)`);
    totalChanges += changes;
    filesChanged++;
  }
}

console.log(`\nTotal: ${totalChanges} liens ajoutés dans ${filesChanged} fichiers`);

// Vérifier ce qui reste non résolu
console.log('\n--- Vérification des références non résolues ---\n');
let unresolved = 0;
for (const fiche of index) {
  const content = fs.readFileSync(fiche.fullPath, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Chercher les patterns qui n'ont toujours pas de lien
    const matches = line.matchAll(/[Ff]iche \*\*(?!\[)(\d+[^*]*)\*\*/g);
    for (const m of matches) {
      const rel = path.relative(DOCS_DIR, fiche.fullPath);
      console.log(`  UNRESOLVED: ${rel}:${i + 1} -> "${m[0]}"`);
      unresolved++;
    }
    // Pattern sans bold
    const matches2 = line.matchAll(/[Ff]iche (\d+-[a-z-]+\/\d+\s*-\s*[^\n([\]]+)/g);
    for (const m of matches2) {
      if (!m[0].includes('](') && !m[0].includes('[')) {
        const rel = path.relative(DOCS_DIR, fiche.fullPath);
        console.log(`  UNRESOLVED: ${rel}:${i + 1} -> "${m[0].trim()}"`);
        unresolved++;
      }
    }
  }
}

if (unresolved === 0) {
  console.log('  Aucune référence non résolue !');
} else {
  console.log(`\n  ${unresolved} référence(s) non résolue(s)`);
}
