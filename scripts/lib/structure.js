/**
 * Fonctions pures pour le lint de structure des fiches pedagogiques.
 *
 * Verifie, pour chaque fiche eligible :
 *  - presence du blockquote "En bref" immediatement apres le H1, au format exact
 *    `> **En bref** : ... Lecture estimee : XX min.` ;
 *  - presence d'une section `## Navigation` ;
 *  - presence des liens precedent ET suivant dans cette section
 *    (sauf aux frontieres de groupe : la 1re fiche peut ne pas avoir de "precedent",
 *     la derniere peut ne pas avoir de "suivant").
 *
 * La logique de detection du bloc "En bref" reutilise `lib/en-bref.js`.
 */

const { FILE_PATTERN } = require('./filenames');
const { hasEnBref } = require('./en-bref');

// Dossiers techniques jamais consideres comme du contenu pedagogique.
const NON_CONTENT_DIRS = new Set(['overrides', 'stylesheets', 'javascripts', 'includes', 'fonts']);

/**
 * Determine si un fichier (par son chemin relatif a docs/) est une fiche eligible.
 *
 * Une fiche eligible :
 *  - a un nom de base au format `NN-nom.md` (ex: `01-introduction.md`). Cela exclut
 *    automatiquement index.md, tags.md, carte-cursus.md, glossary.md, parcours.md,
 *    et toute page meta non numerotee ;
 *  - n'est dans aucun dossier technique (overrides, stylesheets, etc.).
 *
 * @param {string} relativePath - Chemin relatif a docs/ (separateurs `/`).
 * @returns {boolean}
 */
function isFiche(relativePath) {
  const parts = relativePath.split('/');
  const basename = parts[parts.length - 1];
  if (!FILE_PATTERN.test(basename)) return false;
  return !parts.slice(0, -1).some((dir) => NON_CONTENT_DIRS.has(dir));
}

/**
 * Extrait le numero de fiche depuis le nom de base `NN-...`.
 * @param {string} relativePath
 * @returns {number|null}
 */
function ficheNumberFromName(relativePath) {
  const basename = relativePath.split('/').pop();
  const match = basename.match(/^(\d{2})-/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Regroupe une liste de fiches (chemins relatifs) par dossier parent.
 * Un GROUPE = un dossier feuille contenant des fiches numerotees.
 * Le tri se fait par numero de fiche extrait du nom de fichier.
 *
 * @param {string[]} ficheRelPaths
 * @returns {Map<string, string[]>} cle = dossier parent, valeur = fiches triees par numero.
 */
function groupByDir(ficheRelPaths) {
  const groups = new Map();
  for (const rel of ficheRelPaths) {
    const dir = rel.split('/').slice(0, -1).join('/');
    if (!groups.has(dir)) groups.set(dir, []);
    groups.get(dir).push(rel);
  }
  for (const [, files] of groups) {
    files.sort((a, b) => {
      const na = ficheNumberFromName(a) ?? 0;
      const nb = ficheNumberFromName(b) ?? 0;
      if (na !== nb) return na - nb;
      return a.localeCompare(b);
    });
  }
  return groups;
}

/**
 * Verifie le bloc "En bref" : present, immediatement apres le H1, au format attendu.
 *
 * Format exact attendu : `> **En bref** : <texte>. Lecture estimee : XX min.`
 *
 * @param {string} content - Contenu Markdown complet (frontmatter inclus).
 * @returns {string|null} Message d'erreur, ou null si conforme.
 */
function checkEnBref(content) {
  if (!hasEnBref(content)) {
    return 'bloc "En bref" absent';
  }

  // Localiser le premier H1.
  const lines = content.split('\n');
  let h1Index = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^#\s+\S/.test(lines[i])) {
      h1Index = i;
      break;
    }
  }
  if (h1Index === -1) {
    return 'titre H1 absent';
  }

  // Le bloc "En bref" doit etre la premiere ligne non vide apres le H1.
  let next = h1Index + 1;
  while (next < lines.length && lines[next].trim() === '') next++;

  if (next >= lines.length || !/^>\s+\*\*En bref\*\*/.test(lines[next])) {
    return 'bloc "En bref" pas immediatement apres le H1';
  }

  // Le format complet peut s'etaler sur plusieurs lignes de blockquote ; on agrege
  // les lignes de blockquote consecutives pour valider le format global.
  const blockLines = [];
  let j = next;
  while (j < lines.length && /^>/.test(lines[j])) {
    blockLines.push(lines[j].replace(/^>\s?/, ''));
    j++;
  }
  const blockText = blockLines.join(' ').trim();

  // Format attendu : "**En bref** : ... Lecture estimee : XX min."
  const formatRe = /^\*\*En bref\*\*\s*:\s*.+\bLecture estim[ée]e\s*:\s*\d+\s*min\.?\s*$/;
  if (!formatRe.test(blockText)) {
    return 'bloc "En bref" mal forme (attendu : "> **En bref** : ... Lecture estimee : XX min.")';
  }

  return null;
}

/**
 * Localise la section `## Navigation` et renvoie ses lignes.
 * @param {string} content
 * @returns {string[]|null} lignes de la section (titre inclus), ou null si absente.
 */
function extractNavigationLines(content) {
  const lines = content.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^##\s+Navigation\s*$/.test(lines[i])) {
      start = i;
      break;
    }
  }
  if (start === -1) return null;

  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end);
}

// Un lien "precedent" : fleche unicode gauche + label + lien Markdown.
const PREV_LINK_RE = /^←\s+(?:Fiche|Phase|Cursus|Section)\s+pr[ée]c[ée]dente\s*:.*\[.+?\]\(.+?\)/;
// Un lien "suivant" : fleche unicode droite + label + lien Markdown.
const NEXT_LINK_RE = /^→\s+(?:Fiche|Phase|Cursus|Section)\s+suivante\s*:.*\[.+?\]\(.+?\)/;

/**
 * Indique si les lignes de navigation contiennent un lien "precedent" conforme.
 * @param {string[]} navLines
 * @returns {boolean}
 */
function hasPrevLink(navLines) {
  return navLines.some((l) => PREV_LINK_RE.test(l.trim()));
}

/**
 * Indique si les lignes de navigation contiennent un lien "suivant" conforme.
 * @param {string[]} navLines
 * @returns {boolean}
 */
function hasNextLink(navLines) {
  return navLines.some((l) => NEXT_LINK_RE.test(l.trim()));
}

/**
 * Verifie la structure complete d'une fiche.
 *
 * @param {object} params
 * @param {string} params.content - Contenu Markdown complet.
 * @param {boolean} [params.isFirstInGroup=false] - La fiche est-elle la 1re de son groupe ?
 * @param {boolean} [params.isLastInGroup=false] - La fiche est-elle la derniere de son groupe ?
 * @returns {string[]} Tableau de messages d'erreur (vide si conforme).
 */
function checkFicheStructure({ content, isFirstInGroup = false, isLastInGroup = false }) {
  const errors = [];

  const enBrefError = checkEnBref(content);
  if (enBrefError) errors.push(enBrefError);

  const navLines = extractNavigationLines(content);
  if (navLines === null) {
    errors.push('section "## Navigation" absente');
    return errors;
  }

  // Lien precedent requis sauf pour la 1re fiche du groupe.
  if (!isFirstInGroup && !hasPrevLink(navLines)) {
    errors.push('lien "Fiche precedente" absent de la section Navigation');
  }
  // Lien suivant requis sauf pour la derniere fiche du groupe.
  if (!isLastInGroup && !hasNextLink(navLines)) {
    errors.push('lien "Fiche suivante" absent de la section Navigation');
  }

  return errors;
}

module.exports = {
  NON_CONTENT_DIRS,
  PREV_LINK_RE,
  NEXT_LINK_RE,
  isFiche,
  ficheNumberFromName,
  groupByDir,
  checkEnBref,
  extractNavigationLines,
  hasPrevLink,
  hasNextLink,
  checkFicheStructure,
};
