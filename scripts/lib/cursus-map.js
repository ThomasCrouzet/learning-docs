/**
 * Fonctions pures pour la generation de la carte des cursus.
 */

/**
 * Collecte les fiches a partir des items de navigation.
 * @param {Array} navItems
 * @param {function} getFrontmatter - (filePath) => object|null (injection de dependance)
 * @returns {Array}
 */
function collectFiches(navItems, getFrontmatter) {
  const fiches = [];
  for (const item of navItems) {
    if (typeof item === 'string') {
      if (!/(?:^|\/)(?:index|tags)\.md$/.test(item)) {
        const fm = getFrontmatter(item);
        if (fm) fiches.push({ path: item, ...fm });
      }
    } else if (typeof item === 'object') {
      for (const [, value] of Object.entries(item)) {
        if (typeof value === 'string') {
          if (!/(?:^|\/)(?:index|tags)\.md$/.test(value)) {
            const fm = getFrontmatter(value);
            if (fm) fiches.push({ path: value, ...fm });
          }
        } else if (Array.isArray(value)) {
          fiches.push(...collectFiches(value, getFrontmatter));
        }
      }
    }
  }
  return fiches;
}

/**
 * Trouve le chemin d'entree (index.md ou premiere fiche) dans une section nav.
 * @param {Array} navItems
 * @returns {string|null}
 */
function findIndexPath(navItems) {
  let firstFiche = null;
  for (const item of navItems) {
    if (typeof item === 'string') {
      if (/(?:^|\/)index\.md$/.test(item)) return item;
      if (!firstFiche) firstFiche = item;
    }
    if (typeof item === 'object') {
      for (const [, value] of Object.entries(item)) {
        if (typeof value === 'string') {
          if (/(?:^|\/)index\.md$/.test(value)) return value;
          if (!firstFiche) firstFiche = value;
        }
        if (Array.isArray(value)) {
          const found = findIndexPath(value);
          if (found) return found;
        }
      }
    }
  }
  return firstFiche;
}

/**
 * Construit le contenu Markdown complet de la carte des cursus.
 * Fonction pure : ne lit ni n'ecrit aucun fichier. Sert a la fois pour la
 * generation (ecriture sur disque) et pour le mode --check (comparaison memoire).
 * @param {Array} groups - [{ tabName, cursus: [{ name, count, time, levels, indexPath }] }]
 * @returns {string} contenu Markdown du fichier carte-cursus.md
 */
function buildMarkdown(groups) {
  const allCursus = groups.flatMap((g) => g.cursus);
  const totalFiches = allCursus.reduce((s, c) => s + c.count, 0);
  const totalCursus = allCursus.length;

  const lines = [
    '---',
    'hide:',
    '  - navigation',
    '  - toc',
    `description: "Vue d'ensemble des ${totalFiches} fiches réparties sur ${totalCursus} cursus."`,
    '---',
    '',
    '# Carte des cursus',
    '',
    `> **En bref** : Vue d'ensemble de tous les cursus disponibles, avec le nombre de fiches et le temps estimé.`,
    '',
    `**${totalFiches} fiches** au total, réparties sur **${totalCursus} cursus**.`,
    '',
  ];

  // Diagramme de dependances (HTML + SVG diagram-design, pas Mermaid)
  lines.push('## Dépendances entre cursus');
  lines.push('');
  lines.push('<div class="diagram-design">');
  lines.push('<p><a href="../diagrams/carte-cursus-1.html">Dépendances entre cursus (HTML + SVG)</a></p>');
  lines.push('<iframe src="../diagrams/carte-cursus-1.html" title="Dépendances entre cursus" style="width:100%;min-height:676px;border:0;background:transparent"></iframe>');
  lines.push('</div>');
  lines.push('');
  lines.push('Les cursus en bleu sont **indépendants** : ils ne nécessitent aucun prérequis et peuvent être suivis directement.');
  lines.push('');

  // Tables groupees par onglet
  for (const group of groups) {
    lines.push(`## ${group.tabName}`);
    lines.push('');
    lines.push('| Cursus | Fiches | Temps estimé | Niveaux |');
    lines.push('| ------ | -----: | -----------: | ------- |');
    for (const c of group.cursus) {
      const link = c.indexPath ? `[${c.name}](${c.indexPath})` : c.name;
      lines.push(`| **${link}** | ${c.count} | ${c.time} | ${c.levels} |`);
    }
    lines.push('');
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * Calcule les statistiques pour un ensemble de fiches.
 * @param {Array} fiches
 * @returns {{ timeStr: string, levels: string }}
 */
function computeStats(fiches) {
  const totalMinutes = fiches.reduce((sum, f) => {
    const match = String(f.estimated_time || '').match(/(\d+)/);
    return sum + (match ? parseInt(match[1], 10) : 0);
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeStr = hours > 0 ? `${hours}h${mins > 0 ? ` ${mins}min` : ''}` : `${mins}min`;

  const levels = new Set();
  for (const f of fiches) {
    if (f.tags) {
      for (const tag of f.tags) {
        if (['\u00c9butant', 'D\u00e9butant', 'Interm\u00e9diaire', 'Avanc\u00e9', 'Expert'].includes(tag)) {
          levels.add(tag);
        }
      }
    }
  }
  const levelOrder = ['D\u00e9butant', 'Interm\u00e9diaire', 'Avanc\u00e9', 'Expert'];
  const sortedLevels = levelOrder.filter(l => levels.has(l));

  return { timeStr, levels: sortedLevels.join(' \u2192 ') || 'Tous niveaux' };
}

module.exports = { collectFiches, findIndexPath, computeStats, buildMarkdown };
