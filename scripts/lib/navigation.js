/**
 * Fonctions pures pour l'extraction de la navigation MkDocs.
 */

const path = require('path');

const EXCLUDED_FILES = new Set(['index.md', 'tags.md']);
const EXCLUDED_DIRS = new Set(['fiches-reference']);

/**
 * Extraire tous les chemins de fichiers d'un item de nav (recursif).
 * @param {object|string} navItem
 * @returns {Array<{title: string, path: string}>}
 */
function extractNavFiles(navItem) {
  const results = [];
  if (typeof navItem === 'string') {
    const basename = path.basename(navItem);
    if (!EXCLUDED_FILES.has(basename) && !EXCLUDED_DIRS.has(navItem.split('/')[0])) {
      results.push({ title: '', path: navItem });
    }
  } else if (typeof navItem === 'object' && navItem !== null) {
    const entries = Object.entries(navItem);
    for (const [title, value] of entries) {
      if (typeof value === 'string') {
        const basename = path.basename(value);
        const firstDir = value.split('/')[0];
        if (!EXCLUDED_FILES.has(basename) && !EXCLUDED_DIRS.has(firstDir)) {
          results.push({ title, path: value });
        }
      } else if (Array.isArray(value)) {
        for (const sub of value) {
          results.push(...extractNavFiles(sub));
        }
      }
    }
  }
  return results;
}

/**
 * Identifie les cursus depuis la nav MkDocs.
 * @param {Array} nav
 * @returns {Array<{name: string, files: Array<{title: string, path: string}>}>}
 */
function extractCursus(nav) {
  const cursus = [];

  function processNavLevel(items, parentName) {
    for (const item of items) {
      if (typeof item === 'string') continue;
      if (typeof item !== 'object' || item === null) continue;

      const entries = Object.entries(item);
      for (const [name, value] of entries) {
        if (typeof value === 'string') continue;
        if (!Array.isArray(value)) continue;

        const files = [];
        let hasSubSections = false;

        for (const sub of value) {
          if (typeof sub === 'string') {
            const basename = path.basename(sub);
            const firstDir = sub.split('/')[0];
            if (!EXCLUDED_FILES.has(basename) && !EXCLUDED_DIRS.has(firstDir)) {
              files.push({ title: '', path: sub });
            }
          } else if (typeof sub === 'object' && sub !== null) {
            const subEntries = Object.entries(sub);
            for (const [subName, subValue] of subEntries) {
              if (typeof subValue === 'string') {
                const basename = path.basename(subValue);
                const firstDir = subValue.split('/')[0];
                if (!EXCLUDED_FILES.has(basename) && !EXCLUDED_DIRS.has(firstDir)) {
                  files.push({ title: subName, path: subValue });
                }
              } else if (Array.isArray(subValue)) {
                hasSubSections = true;
                processNavLevel([sub], name);
              }
            }
          }
        }

        if (files.length > 0 && !hasSubSections) {
          cursus.push({ name, files });
        }
      }
    }
  }

  processNavLevel(nav, '');
  return cursus;
}

/**
 * Calcule le chemin relatif entre deux fichiers.
 * @param {string} fromFile
 * @param {string} toFile
 * @returns {string}
 */
function relativeLink(fromFile, toFile) {
  const fromDir = path.dirname(fromFile);
  const rel = path.relative(fromDir, toFile);
  return rel.replace(/\\/g, '/');
}

module.exports = { EXCLUDED_FILES, EXCLUDED_DIRS, extractNavFiles, extractCursus, relativeLink };
