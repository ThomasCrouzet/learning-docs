/**
 * Fonctions pures pour la detection et correction de liens de fiches.
 */

const path = require('path');

/**
 * Trouve la fiche correspondante a une reference textuelle.
 * @param {Array} index - Index de toutes les fiches {filename, relPath, dir, num, title, titleLower}
 * @param {string} ref - La reference textuelle (ex: "01 - Concepts de base")
 * @param {string} currentFileDir - Le dossier du fichier courant
 * @returns {object|null}
 */
function findFiche(index, ref, currentFileDir) {
  const refLower = ref.toLowerCase().trim();

  // Pattern "02-php/07 - Titre" : contient un chemin de dossier
  const dirMatch = refLower.match(/^(\d+-[a-z-]+)\/(\d+)\s*-\s*(.+)/);
  if (dirMatch) {
    const dirPart = dirMatch[1];
    const numPart = dirMatch[2].padStart(2, '0');
    const candidates = index.filter(f =>
      f.dir.endsWith(dirPart) && f.num === numPart
    );
    if (candidates.length === 1) return candidates[0];
    if (candidates.length > 1) {
      const titlePart = dirMatch[3].trim();
      const best = candidates.find(f => f.titleLower.includes(titlePart.toLowerCase()));
      return best || candidates[0];
    }
  }

  // Pattern "01-docker/01-docker-compose-symfony.md" : chemin de fichier direct
  const pathMatch = refLower.match(/^(\d+-[a-z-]+\/\d+-[a-z-]+\.md)/);
  if (pathMatch) {
    const target = index.find(f => f.relPath.endsWith(pathMatch[1]));
    if (target) return target;
  }

  // Pattern "NN - Titre" : numero + titre
  const numTitleMatch = refLower.match(/^(\d+)\s*-\s*(.+)/);
  if (numTitleMatch) {
    const num = numTitleMatch[1].padStart(2, '0');
    const titlePart = numTitleMatch[2].trim().toLowerCase();

    // D'abord chercher dans le meme dossier
    let candidates = index.filter(f =>
      f.num === num && f.dir === currentFileDir
    );
    if (candidates.length === 1) return candidates[0];

    if (candidates.length > 1) {
      const best = candidates.find(f => f.titleLower.includes(titlePart));
      if (best) return best;
    }

    const parentDir = currentFileDir.split('/').slice(0, -1).join('/');
    if (candidates.length === 0) {
      candidates = index.filter(f =>
        f.num === num && (f.dir === currentFileDir || f.dir.startsWith(parentDir + '/'))
      );
      if (candidates.length > 1) {
        const best = candidates.find(f => f.titleLower.includes(titlePart));
        if (best) return best;
      }
      if (candidates.length >= 1) return candidates[0];
    }

    candidates = index.filter(f => f.num === num && f.titleLower.includes(titlePart));
    if (candidates.length === 1) return candidates[0];

    candidates = index.filter(f => f.num === num && f.dir === currentFileDir);
    if (candidates.length === 1) return candidates[0];
  }

  return null;
}

/**
 * Calcule le chemin relatif entre deux fichiers.
 * @param {string} fromRelPath
 * @param {string} toRelPath
 * @returns {string}
 */
function relativePath(fromRelPath, toRelPath) {
  const fromDir = path.dirname(fromRelPath);
  const rel = path.relative(fromDir, toRelPath);
  return rel.replace(/\\/g, '/');
}

module.exports = { findFiche, relativePath };
