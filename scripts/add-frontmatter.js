#!/usr/bin/env node
/**
 * Ajoute un front matter YAML à chaque fiche Markdown qui n'en a pas.
 * Génère les tags basés sur le chemin du fichier.
 * Ignore les index.md et tags.md (déjà traités).
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

// Mapping chemin -> tag technologie
const TECH_TAGS = [
  { pattern: /01-docker/, tag: 'Docker' },
  { pattern: /02-php/, tag: 'PHP' },
  { pattern: /03-symfony/, tag: 'Symfony' },
  { pattern: /04-postgresql/, tag: 'PostgreSQL' },
  { pattern: /epitech\/01-java/, tag: 'Java' },
  { pattern: /epitech\/02-unix-bash/, tag: 'Unix/Bash' },
  { pattern: /epitech\/03-git/, tag: 'Git' },
  { pattern: /epitech\/04-html-css/, tag: 'HTML/CSS' },
  { pattern: /epitech\/05-javascript/, tag: 'JavaScript' },
  { pattern: /epitech\/07-nodejs/, tag: 'Node.js' },
  { pattern: /epitech\/08-rust/, tag: 'Rust' },
  { pattern: /epitech\/06-projets/, tag: 'Projet' },
  { pattern: /devops\/01-podman/, tag: 'Podman' },
  { pattern: /devops\/02-openshift/, tag: 'OpenShift' },
  { pattern: /ansible\/01-ansible/, tag: 'Ansible' },
  { pattern: /00-outils-ia/, tag: 'Outils IA' },
  { pattern: /00-blocs-competences/, tag: 'Certification' },
  { pattern: /fiches-reference/, tag: 'Référence' },
];

// Mapping chemin -> tag niveau (basé sur le numéro de la fiche)
function getLevelTag(filepath) {
  const basename = path.basename(filepath);
  const match = basename.match(/^(\d+)-/);
  if (!match) return 'Débutant';
  const num = parseInt(match[1], 10);
  if (num <= 3) return 'Débutant';
  if (num <= 7) return 'Intermédiaire';
  return 'Avancé';
}

// Mapping chemin -> tag type
function getTypeTag(filepath) {
  const lower = filepath.toLowerCase();
  if (lower.includes('aide-memoire') || lower.includes('guide-debug') || lower.includes('fiches-reference')) {
    return 'Référence';
  }
  if (lower.includes('projet') || lower.includes('popeye') || lower.includes('jeu-2d')) {
    return 'Projet';
  }
  if (lower.includes('introduction') || lower.includes('concepts') || lower.includes('architecture') || lower.includes('presentation')) {
    return 'Concept';
  }
  return 'Pratique';
}

function getTechTag(filepath) {
  const rel = path.relative(DOCS_DIR, filepath).replace(/\\/g, '/');
  for (const { pattern, tag } of TECH_TAGS) {
    if (pattern.test(rel)) return tag;
  }
  return null;
}

function getDescription(content) {
  // Extrait le H1 (potentiellement après du whitespace)
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].trim();
  return '';
}

function processFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');

  // Vérifie si le front matter existe déjà
  if (content.startsWith('---')) {
    return false;
  }

  const tags = [];
  const tech = getTechTag(filepath);
  if (tech) tags.push(tech);

  const level = getLevelTag(filepath);
  tags.push(level);

  const type = getTypeTag(filepath);
  // Évite de dupliquer "Référence" si déjà ajouté comme tech
  if (!tags.includes(type)) {
    tags.push(type);
  }

  const description = getDescription(content);

  // Construit le front matter
  const tagsYaml = tags.map(t => `  - ${t}`).join('\n');
  const escapedDesc = description.replace(/"/g, '\\"');
  const frontmatter = `---\ntags:\n${tagsYaml}\ndescription: "${escapedDesc}"\n---\n\n`;

  fs.writeFileSync(filepath, frontmatter + content, 'utf-8');
  return true;
}

// Parcours récursif
function walkDir(dir) {
  const results = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!item.name.startsWith('.') && item.name !== 'node_modules' && item.name !== 'stylesheets' && item.name !== 'overrides') {
        results.push(...walkDir(fullPath));
      }
    } else if (item.name.endsWith('.md') && item.name !== 'index.md' && item.name !== 'tags.md') {
      results.push(fullPath);
    }
  }
  return results;
}

// Exécution
console.log('Ajout du front matter YAML...\n');
const files = walkDir(DOCS_DIR).sort();
let count = 0;

for (const file of files) {
  const rel = path.relative(DOCS_DIR, file);
  const added = processFile(file);
  if (added) {
    const content = fs.readFileSync(file, 'utf-8');
    const tagsMatch = content.match(/^tags:\n([\s\S]*?)^description:/m);
    const tags = tagsMatch ? tagsMatch[1].trim() : '';
    console.log(`  ${rel}`);
    console.log(`    Tags: ${tags.replace(/\n/g, ', ').replace(/  - /g, '')}`);
    count++;
  } else {
    console.log(`  ${rel} (déjà traité)`);
  }
}

console.log(`\nTotal: ${count} fichiers modifiés`);
