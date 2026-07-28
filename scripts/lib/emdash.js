/**
 * Fonctions pures pour la detection et correction des em dashes.
 */

/**
 * Compte le nombre d'em dashes (\u2014) dans un texte.
 * @param {string} content
 * @returns {number}
 */
function countEmDashes(content) {
  return (content.match(/\u2014/g) || []).length;
}

/**
 * Remplace tous les em dashes par des tirets simples.
 * @param {string} content
 * @returns {string}
 */
function fixEmDashes(content) {
  return content.replace(/\u2014/g, '-');
}

module.exports = { countEmDashes, fixEmDashes };
