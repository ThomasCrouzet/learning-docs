/**
 * Fonctions pures pour l'extraction et la validation du frontmatter YAML.
 */

const yaml = require('js-yaml');

const REQUIRED_FIELDS = ['tags', 'description', 'estimated_time', 'fiche_number', 'total_fiches', 'cursus'];

const EXCLUDED_PATTERNS = [
  /index\.md$/,
  /tags\.md$/,
  /carte-cursus\.md$/,
  /^parcours\.md$/,
  /^a-propos\.md$/,
  /^politique-fraicheur\.md$/,
  /^accessibility-audit\.md$/,
];

/**
 * Extrait le frontmatter YAML d'un contenu Markdown.
 * @param {string} content
 * @returns {object|null}
 */
function extractFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch {
    return null;
  }
}

/**
 * Valide les champs obligatoires d'un objet frontmatter.
 * @param {object|null} fm
 * @param {string} relativePath
 * @returns {string[]} Tableau d'erreurs (vide si OK)
 */
function validateFields(fm, relativePath) {
  const errors = [];

  if (!fm) {
    errors.push(`${relativePath}: frontmatter YAML manquant`);
    return errors;
  }

  for (const field of REQUIRED_FIELDS) {
    if (fm[field] === undefined || fm[field] === null || fm[field] === '') {
      errors.push(`${relativePath}: champ "${field}" manquant`);
    }
  }

  if (fm.tags && !Array.isArray(fm.tags)) {
    errors.push(`${relativePath}: "tags" doit \u00eatre un tableau`);
  }

  return errors;
}

/**
 * Verifie si un fichier doit etre exclu de la validation.
 * @param {string} relativePath
 * @returns {boolean}
 */
function isExcluded(relativePath) {
  return EXCLUDED_PATTERNS.some(p => p.test(relativePath));
}

module.exports = { REQUIRED_FIELDS, EXCLUDED_PATTERNS, extractFrontmatter, validateFields, isExcluded };
