/**
 * Calcule le temps de lecture d'un contenu Markdown.
 * Formule : max(5, round(((mots_hors_code / 200) + (blocs_code * 2)) / 5) * 5) min
 */

/**
 * @param {string} content - Le contenu Markdown (body sans frontmatter)
 * @returns {string} Ex: "15 min"
 */
function calculateReadingTime(content) {
  const lines = content.split('\n');
  let inCodeBlock = false;
  let wordCount = 0;
  let codeBlockCount = 0;

  for (const line of lines) {
    if (line.trimStart().startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockCount++;
      } else {
        inCodeBlock = false;
      }
      continue;
    }

    if (!inCodeBlock) {
      // Compter les mots hors blocs de code
      const words = line.trim().split(/\s+/).filter(w => w.length > 0);
      wordCount += words.length;
    }
  }

  // Formule : max(5, round(((mots / 200) + (blocs * 2)) / 5) * 5)
  const rawMinutes = (wordCount / 200) + (codeBlockCount * 2);
  const rounded = Math.round(rawMinutes / 5) * 5;
  return Math.max(5, rounded) + ' min';
}

module.exports = { calculateReadingTime };
