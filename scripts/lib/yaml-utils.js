/**
 * Utilitaires pour le parsing YAML avec tags custom.
 */

/**
 * Supprime les tags YAML custom que js-yaml ne peut pas parser.
 * - !!python/name:xxx -> "__python_tag__"
 * - !ENV [...] -> ""
 * @param {string} content
 * @returns {string}
 */
function stripCustomTags(content) {
  let result = content.replace(/!!python\/name:\S+/g, '"__python_tag__"');
  result = result.replace(/!ENV \[.*?\]/g, '""');
  return result;
}

module.exports = { stripCustomTags };
