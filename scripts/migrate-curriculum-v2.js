#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { loadCurriculum, listMarkdownFiles, expectedMetadata, inferContentType } = require('./lib/curriculum-v2');
const { extractFrontmatter } = require('./lib/frontmatter');
const { isFiche } = require('./lib/structure');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const { catalog, errors } = loadCurriculum(ROOT);
if (errors.length) throw new Error(errors.join('\n'));
const files = listMarkdownFiles(DOCS).filter(isFiche);
const typeCounts = {};

for (const relativePath of files) {
  const absolute = path.join(DOCS, relativePath);
  const content = fs.readFileSync(absolute, 'utf8');
  const frontmatter = extractFrontmatter(content) || {};
  const metadata = expectedMetadata(relativePath, frontmatter, catalog);
  if (!metadata) throw new Error(`${relativePath}: rattachement canonique introuvable`);
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error(`${relativePath}: frontmatter absent`);
  const controlled = new Set(['id', 'course_id', 'module_id', 'content_type', 'order']);
  const retained = match[1].split('\n').filter((line) => !controlled.has(line.split(':')[0].trim()));
  const insertAfter = retained.findIndex((line) => line.startsWith('cursus:'));
  const metadataLines = [
    `id: "${metadata.id}"`,
    `course_id: "${metadata.course_id}"`,
    ...(metadata.module_id ? [`module_id: "${metadata.module_id}"`] : []),
    `content_type: "${metadata.content_type}"`,
    `order: ${metadata.order}`,
  ];
  retained.splice(insertAfter + 1, 0, ...metadataLines);
  let updated = content.replace(match[0], `---\n${retained.join('\n')}\n---`);
  updated = updated.replace(/^> \*\*Projet facultatif\*\*/m, '**Projet facultatif**');
  if (metadata.content_type === 'project' && !updated.includes('**Projet facultatif**')) {
    const lines = updated.split('\n');
    const enBrefIndex = lines.findIndex((line) => line.startsWith('> **En bref**'));
    if (enBrefIndex === -1) throw new Error(`${relativePath}: bloc En bref introuvable`);
    let insertAt = enBrefIndex + 1;
    while (insertAt < lines.length && lines[insertAt].startsWith('>')) insertAt++;
    lines.splice(insertAt, 0, '', '**Projet facultatif** : Ce projet est autonome. Tu peux le réaliser, l’adapter ou le passer sans bloquer l’accès aux autres fiches.');
    updated = lines.join('\n');
  }
  fs.writeFileSync(absolute, updated, 'utf8');
  typeCounts[inferContentType(relativePath, frontmatter)] = (typeCounts[inferContentType(relativePath, frontmatter)] || 0) + 1;
}

const report = `# Rapport de migration du cursus v2

Ce rapport décrit la migration déterministe exécutée par \`scripts/migrate-curriculum-v2.js\`.

- Fiches migrées : ${files.length}
- Règle d’identifiant : identifiant du cursus ou du module, puis nom stable de la fiche sans son numéro d’ordre
- Rattachement : racine de contenu la plus spécifique déclarée dans \`curriculum/catalog.yml\`
- Ordre : valeur historique \`fiche_number\`, conservée pour compatibilité
- Champs historiques : \`cursus\`, \`fiche_number\` et \`total_fiches\` conservés pendant la transition

## Types attribués

${Object.entries(typeCounts).sort().map(([type, count]) => `- \`${type}\` : ${count}`).join('\n')}

## Ambiguïtés résolues

- Les phases Cybersécurité et Intelligence artificielle deviennent des modules, comme les phases Faust et Crypto-monnaies.
- Les sous-ensembles de Compétences métier deviennent des modules d’un seul cursus.
- Les fichiers contenant « projet » ou « fil-rouge » restent des projets autonomes et facultatifs. Ils ne sont jamais des prérequis globaux.
- Les liens vers une fiche dans la section Prérequis deviennent \`requires_ids\`. Les liens vers un index deviennent \`requires_course_ids\`.
- Aucun lien situé hors de la section Prérequis n’est utilisé par le graphe.

## Réserves documentées

- Les objectifs pédagogiques ne sont pas synthétisés automatiquement.
- Le sens humain des prérequis existants est conservé. Le validateur garantit leur résolution et l’absence de cycle, pas leur pertinence éditoriale.
- Le champ historique \`cursus\` est déprécié au profit de \`course_id\`, mais son retrait n’est pas planifié avant une migration publique séparée.
`;
fs.writeFileSync(path.join(ROOT, 'CURRICULUM_V2_MIGRATION.md'), report, 'utf8');
console.log(`Migration v2 terminée: ${files.length} fiches (${JSON.stringify(typeCounts)})`);
