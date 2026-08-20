/**
 * Fonctions pures pour la validation des noms de fichiers et dossiers.
 */

const FILE_PATTERN = /^\d{2}-[a-z0-9-]+\.md$/;

const SPECIAL_FILES = [
  'index.md',
  'tags.md',
  'carte-cursus.md',
  'glossary.md',
  'parcours.md',
  'a-propos.md',
  'accessibility-audit.md',
  'politique-fraicheur.md',
];

const DIR_PATTERN = /^(\d{2}-[a-z0-9-]+|fiches-reference|fondamentaux|competences-metier|devops|ansible|thomas|commencer|stack-symfony|stylesheets|javascripts|overrides|ia|cybersecurite|faust|includes|fonts|crypto-monnaies|diagrams)$/;

const SPECIAL_DIRS = [];

/**
 * Verifie si un nom de fichier Markdown est valide.
 * @param {string} name
 * @returns {boolean}
 */
function isValidFilename(name) {
  return FILE_PATTERN.test(name) || SPECIAL_FILES.includes(name);
}

/**
 * Verifie si un nom de dossier est valide.
 * @param {string} name
 * @returns {boolean}
 */
function isValidDirname(name) {
  if (SPECIAL_DIRS.length > 0) {
    const isSpecialDir = SPECIAL_DIRS.some((prefix) => prefix && name.startsWith(prefix));
    if (isSpecialDir) return true;
  }
  return DIR_PATTERN.test(name);
}

module.exports = { FILE_PATTERN, SPECIAL_FILES, DIR_PATTERN, SPECIAL_DIRS, isValidFilename, isValidDirname };
