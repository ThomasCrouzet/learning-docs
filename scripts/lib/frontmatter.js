/**
 * Fonctions pures pour l'extraction et la validation du frontmatter YAML.
 */

const yaml = require('js-yaml');

const REQUIRED_FIELDS = [
  'tags',
  'description',
  'estimated_time',
  'fiche_number',
  'total_fiches',
  'cursus',
  'id',
  'course_id',
  'content_type',
  'order',
];
const CONTENT_TYPES = new Set(['lesson', 'lab', 'project', 'review', 'reference']);

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

  if (fm.content_type && !CONTENT_TYPES.has(fm.content_type)) {
    errors.push(`${relativePath}: "content_type" invalide`);
  }

  if (fm.order !== undefined && (!Number.isInteger(fm.order) || fm.order < 1)) {
    errors.push(`${relativePath}: "order" doit être un entier positif`);
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

module.exports = { REQUIRED_FIELDS, CONTENT_TYPES, EXCLUDED_PATTERNS, extractFrontmatter, validateFields, isExcluded };
