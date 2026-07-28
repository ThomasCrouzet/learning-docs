/**
 * Fonctions pures pour le lint de coherence inter-fiches.
 *
 * Un GROUPE = un dossier feuille contenant des fiches numerotees
 * (convention « une phase = un cursus »). Pour chaque groupe on verifie :
 *  1. fiche_number continu de 1 a N, sans trou ni doublon ;
 *  2. total_fiches egal a N ET identique sur toutes les fiches du groupe ;
 *  3. champ cursus homogene sur le groupe ;
 *  4. cibles des liens internes (Navigation + prerequis) existantes sur le disque ;
 *  5. chaine de navigation : pour deux fiches adjacentes K et K+1, le lien
 *     « suivant » de K pointe vers K+1 et le lien « precedent » de K+1 vers K.
 *
 * CALIBRAGE ANTI-FAUX-POSITIF : les frontieres de groupe (1er « precedent »,
 * dernier « suivant ») peuvent pointer vers une autre phase / un index ou etre
 * absentes -> ce ne sont PAS des erreurs. La chaine n'est verifiee que lorsque
 * le lien est PRESENT, en comparant des chemins relatifs normalises.
 *
 * Les fonctions sont pures : elles recoivent les contenus / resolveurs en
 * parametres pour rester testables sur des cas fabriques.
 */

const path = require('path');
const { extractFrontmatter } = require('./frontmatter');
const { extractPrereqSections } = require('./prereq-links');

// Liens de navigation (fleche unicode + label + lien Markdown vers un .md).
const NEXT_LINK_RE = /^→\s+(?:Fiche|Phase|Cursus|Section)\s+suivante\s*:.*\[.+?\]\(([^)#]+\.md)(?:#[^)]*)?\)/;
const PREV_LINK_RE = /^←\s+(?:Fiche|Phase|Cursus|Section)\s+pr[ée]c[ée]dente\s*:.*\[.+?\]\(([^)#]+\.md)(?:#[^)]*)?\)/;

/**
 * Extrait les lignes de la section "## Navigation".
 * @param {string} content
 * @returns {string[]}
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
  if (start === -1) return [];
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end);
}

/**
 * Renvoie la cible du lien "suivant" de la section Navigation, ou null.
 * @param {string} content
 * @returns {string|null}
 */
function getNextTarget(content) {
  for (const line of extractNavigationLines(content)) {
    const m = line.trim().match(NEXT_LINK_RE);
    if (m) return m[1];
  }
  return null;
}

/**
 * Renvoie la cible du lien "precedent" de la section Navigation, ou null.
 * @param {string} content
 * @returns {string|null}
 */
function getPrevTarget(content) {
  for (const line of extractNavigationLines(content)) {
    const m = line.trim().match(PREV_LINK_RE);
    if (m) return m[1];
  }
  return null;
}

/**
 * Extrait toutes les cibles `.md` referencees dans Navigation + prerequis.
 * @param {string} content
 * @returns {string[]} chemins relatifs (tels qu'ecrits dans le Markdown).
 */
function extractInternalLinks(content) {
  const navText = extractNavigationLines(content).join('\n');
  const prereqText = extractPrereqSections(content)
    .flatMap((s) => s.lines)
    .join('\n');
  const scope = `${navText}\n${prereqText}`;

  const targets = [];
  const linkRe = /\[[^\]]*\]\(([^)]+\.md)(?:#[^)]*)?\)/g;
  let m;
  while ((m = linkRe.exec(scope)) !== null) {
    const target = m[1];
    if (/^https?:\/\//.test(target)) continue;
    targets.push(target);
  }
  return targets;
}

/**
 * Normalise une cible relative en chemin relatif a la racine docs/.
 * @param {string} fromRel - Chemin relatif (a docs/) du fichier source.
 * @param {string} target - Cible relative telle qu'ecrite dans le lien.
 * @returns {string} chemin relatif a docs/, separateurs `/`.
 */
function resolveRelative(fromRel, target) {
  const fromDir = path.posix.dirname(fromRel);
  const joined = path.posix.join(fromDir, target);
  return path.posix.normalize(joined);
}

/**
 * Verifie la coherence d'un groupe de fiches.
 *
 * @param {object} params
 * @param {string} params.dir - Chemin du dossier-groupe (relatif a docs/).
 * @param {Array<{rel: string, content: string}>} params.fiches - Fiches du groupe,
 *        TRIEES par numero croissant (rel = chemin relatif a docs/).
 * @param {(relPath: string) => boolean} params.exists - Predicat d'existence d'un
 *        chemin relatif a docs/ (injection de dependance pour la testabilite).
 * @returns {string[]} messages d'erreur (vide si conforme).
 */
function checkGroup({ dir, fiches, exists }) {
  const errors = [];
  const N = fiches.length;
  if (N === 0) return errors;

  const parsed = fiches.map(({ rel, content }) => ({
    rel,
    content,
    fm: extractFrontmatter(content) || {},
  }));

  // 1. fiche_number continu de 1 a N (sans trou ni doublon).
  const nums = parsed.map((p) => p.fm.fiche_number);
  const sorted = [...nums].sort((a, b) => a - b);
  const expected = Array.from({ length: N }, (_, i) => i + 1);
  if (JSON.stringify(sorted) !== JSON.stringify(expected)) {
    errors.push(`${dir}: fiche_number non continu (trouve ${JSON.stringify(nums)}, attendu 1..${N})`);
  }

  // 2. total_fiches == N ET identique partout.
  const totals = new Set(parsed.map((p) => p.fm.total_fiches));
  if (totals.size > 1) {
    errors.push(`${dir}: total_fiches heterogene (${JSON.stringify([...totals])})`);
  } else if ([...totals][0] !== N) {
    errors.push(`${dir}: total_fiches=${[...totals][0]} different du nombre de fiches (${N})`);
  }

  // 3. cursus homogene.
  const cursusSet = new Set(parsed.map((p) => p.fm.cursus));
  if (cursusSet.size > 1) {
    errors.push(`${dir}: cursus heterogene (${JSON.stringify([...cursusSet])})`);
  }

  // 4. cibles des liens internes (Navigation + prerequis) existantes.
  for (const { rel, content } of parsed) {
    for (const target of extractInternalLinks(content)) {
      const resolved = resolveRelative(rel, target);
      if (!exists(resolved)) {
        errors.push(`${rel}: lien interne casse -> ${target}`);
      }
    }
  }

  // 5. chaine de navigation (boundary-tolerant : seulement si le lien existe).
  for (let i = 0; i < N - 1; i++) {
    const a = parsed[i];
    const b = parsed[i + 1];

    const nextTarget = getNextTarget(a.content);
    if (nextTarget) {
      const resolved = resolveRelative(a.rel, nextTarget);
      if (resolved !== b.rel) {
        errors.push(`${a.rel}: lien "suivant" -> ${resolved} (attendu ${b.rel})`);
      }
    }

    const prevTarget = getPrevTarget(b.content);
    if (prevTarget) {
      const resolved = resolveRelative(b.rel, prevTarget);
      if (resolved !== a.rel) {
        errors.push(`${b.rel}: lien "precedent" -> ${resolved} (attendu ${a.rel})`);
      }
    }
  }

  return errors;
}

module.exports = {
  NEXT_LINK_RE,
  PREV_LINK_RE,
  extractNavigationLines,
  getNextTarget,
  getPrevTarget,
  extractInternalLinks,
  resolveRelative,
  checkGroup,
};
