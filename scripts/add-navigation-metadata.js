#!/usr/bin/env node
/**
 * Lit mkdocs.yml, calcule la numérotation par cursus,
 * et met à jour chaque fiche avec fiche_number, total_fiches, cursus
 * + navigation bidirectionnelle (liens prev/next).
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { stripCustomTags } = require('./lib/yaml-utils');
const { extractCursus, relativeLink } = require('./lib/navigation');

const ROOT_DIR = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT_DIR, 'docs');

/**
 * Extrait le titre H1 d'un fichier markdown
 */
function getH1Title(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    const match = content.match(/^#\s+(.+)$/m);
    if (match) {
      // Nettoyer le titre (enlever le numéro au début si présent)
      return match[1].trim();
    }
  } catch {
    // fichier inexistant
  }
  return null;
}

/**
 * Met à jour le frontmatter d'un fichier
 */
function updateFrontmatter(filepath, metadata) {
  const content = fs.readFileSync(filepath, 'utf-8');

  if (!content.startsWith('---')) return false;

  const secondDash = content.indexOf('---', 3);
  if (secondDash === -1) return false;

  const fmContent = content.substring(3, secondDash).trim();
  const body = content.substring(secondDash + 3);

  const lines = fmContent.split('\n');

  // Supprimer les anciennes valeurs si elles existent
  const keysToSet = Object.keys(metadata);
  const filteredLines = lines.filter(line => {
    const key = line.split(':')[0].trim();
    return !keysToSet.includes(key);
  });

  // Ajouter les nouvelles valeurs après description/estimated_time
  const insertIdx = filteredLines.findIndex(l =>
    l.startsWith('estimated_time:') || l.startsWith('description:')
  );

  const metaLines = Object.entries(metadata).map(([k, v]) => {
    if (typeof v === 'number') return `${k}: ${v}`;
    return `${k}: "${v}"`;
  });

  if (insertIdx !== -1) {
    // Trouver le dernier des champs existants (description, estimated_time)
    let lastIdx = insertIdx;
    for (let i = insertIdx + 1; i < filteredLines.length; i++) {
      if (filteredLines[i].startsWith('estimated_time:') || filteredLines[i].startsWith('description:')) {
        lastIdx = i;
      }
    }
    filteredLines.splice(lastIdx + 1, 0, ...metaLines);
  } else {
    filteredLines.push(...metaLines);
  }

  const newContent = `---\n${filteredLines.join('\n')}\n---${body}`;
  fs.writeFileSync(filepath, newContent, 'utf-8');
  return true;
}

/**
 * Remplace la section "Fiche Suivante" ou ajoute "Navigation" en fin de fichier
 */
function updateNavigation(filepath, prev, next) {
  let content = fs.readFileSync(filepath, 'utf-8');

  // Construire la section navigation
  const navLines = ['', '---', '', '## Navigation', ''];

  if (prev) {
    const link = relativeLink(prev.path, prev.linkedPath);
    navLines.push(`\u2190 Fiche pr\u00e9c\u00e9dente : **[${prev.title}](${link})**`);
    if (next) navLines.push('');
  }

  if (next) {
    const link = relativeLink(next.path, next.linkedPath);
    navLines.push(`\u2192 Fiche suivante : **[${next.title}](${link})**`);
  }

  navLines.push('');

  const navSection = navLines.join('\n');

  // Chercher une section "Fiche Suivante" ou "Navigation" existante
  const patterns = [
    /\n---\n\n## Fiche Suivante[\s\S]*$/,
    /\n---\n\n## Navigation[\s\S]*$/,
    /\n## Fiche Suivante[\s\S]*$/,
    /\n## Navigation[\s\S]*$/,
  ];

  let replaced = false;
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, navSection);
      replaced = true;
      break;
    }
  }

  if (!replaced) {
    // Ajouter à la fin
    content = content.trimEnd() + '\n' + navSection;
  }

  fs.writeFileSync(filepath, content, 'utf-8');
}

// === Exécution principale ===

console.log('Mise à jour des métadonnées de navigation...\n');

// Lire et parser mkdocs.yml (en neutralisant les tags custom non supportes par js-yaml)
let mkdocsContent = fs.readFileSync(path.join(ROOT_DIR, 'mkdocs.yml'), 'utf-8');
mkdocsContent = stripCustomTags(mkdocsContent);
const mkdocsConfig = yaml.load(mkdocsContent);
const nav = mkdocsConfig.nav;

// Extraire les cursus
const allCursus = extractCursus(nav);

console.log(`Cursus détectés: ${allCursus.length}\n`);

let totalUpdated = 0;

for (const cursus of allCursus) {
  const { name, files } = cursus;
  const total = files.length;
  console.log(`  ${name} (${total} fiches)`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filepath = path.join(DOCS_DIR, file.path);

    if (!fs.existsSync(filepath)) {
      console.log(`    SKIP ${file.path} (fichier inexistant)`);
      continue;
    }

    // Titre pour les liens de navigation
    const h1 = getH1Title(filepath) || file.title || path.basename(file.path, '.md');

    // Mettre à jour le frontmatter
    updateFrontmatter(filepath, {
      fiche_number: i + 1,
      total_fiches: total,
      cursus: name,
    });

    // Mettre à jour la navigation
    const prev = i > 0 ? {
      path: file.path,
      linkedPath: files[i - 1].path,
      title: getH1Title(path.join(DOCS_DIR, files[i - 1].path)) || files[i - 1].title || path.basename(files[i - 1].path, '.md'),
    } : null;

    const next = i < files.length - 1 ? {
      path: file.path,
      linkedPath: files[i + 1].path,
      title: getH1Title(path.join(DOCS_DIR, files[i + 1].path)) || files[i + 1].title || path.basename(files[i + 1].path, '.md'),
    } : null;

    if (prev || next) {
      updateNavigation(filepath, prev, next);
    }

    totalUpdated++;
  }
}

console.log(`\nTotal: ${totalUpdated} fichiers mis à jour`);
