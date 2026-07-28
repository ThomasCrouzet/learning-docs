/**
 * Fonctions pures pour la generation des sections "En Bref".
 */

/**
 * Extrait estimated_time du frontmatter brut.
 * @param {string} content
 * @returns {string|null} Ex: "15 min"
 */
function getEstimatedTime(content) {
  if (!content.startsWith('---')) return null;
  const secondDash = content.indexOf('---', 3);
  if (secondDash === -1) return null;
  const fm = content.substring(3, secondDash);
  const match = fm.match(/estimated_time:\s*"?(\d+\s*min)"?/);
  return match ? match[1] : null;
}

/**
 * Extrait le texte de la section "Objectif de cette fiche".
 * @param {string} body - Le contenu sans frontmatter
 * @returns {string|null}
 */
function getObjectif(body) {
  const patterns = [
    /## Objectif de cette fiche\s*\n+([\s\S]*?)(?=\n---|\n## )/,
    /## Objectif\s*\n+([\s\S]*?)(?=\n---|\n## )/,
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    if (match) {
      let text = match[1].trim();

      const lines = text.split('\n');
      const introLines = [];
      const bulletItems = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
          const item = trimmed.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '');
          bulletItems.push(item);
        } else if (trimmed.length > 0) {
          introLines.push(trimmed);
        }
      }

      if (bulletItems.length > 0) {
        const intro = introLines.join(' ').trim();
        const cleanItems = bulletItems.map(item =>
          item
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/_(.+?)_/g, '$1')
            .replace(/\[(.+?)\]\(.+?\)/g, '$1')
            .replace(/`(.+?)`/g, '$1')
            .trim()
            .replace(/\.$/, '')
        );
        let joined;
        if (cleanItems.length === 1) {
          joined = cleanItems[0];
        } else {
          joined = cleanItems.slice(0, -1).join(', ') + ' et ' + cleanItems[cleanItems.length - 1];
        }
        if (intro.endsWith(':')) {
          text = intro.slice(0, -1) + ' ' + joined.charAt(0).toLowerCase() + joined.slice(1);
        } else if (intro) {
          text = intro + ' ' + joined;
        } else {
          text = joined;
        }
      } else {
        const firstParagraph = text.split('\n\n')[0];
        text = firstParagraph.replace(/\n/g, ' ');
      }

      text = text
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .trim();
      if (text.startsWith('"') || text.startsWith('\u00ab')) {
        text = text.replace(/^["\u00ab\s]+/, '').replace(/["\u00bb\s]+$/, '');
      }
      return text;
    }
  }
  return null;
}

/**
 * Verifie si un blockquote "En bref" existe deja.
 * @param {string} content
 * @returns {boolean}
 */
function hasEnBref(content) {
  return /> \*\*En bref\*\*/.test(content);
}

/**
 * Construit le blockquote "En bref".
 * @param {string} objectif
 * @param {string|null} estimatedTime
 * @returns {string}
 */
function buildEnBrefBlockquote(objectif, estimatedTime) {
  let enBref = objectif;
  if (!enBref.endsWith('.') && !enBref.endsWith('!') && !enBref.endsWith(':')) {
    enBref += '.';
  }
  if (estimatedTime) {
    enBref += ` Lecture estim\u00e9e : ${estimatedTime}.`;
  }
  return `> **En bref** : ${enBref}`;
}

module.exports = { getEstimatedTime, getObjectif, hasEnBref, buildEnBrefBlockquote };
