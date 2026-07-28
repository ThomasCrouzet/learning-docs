/**
 * Fonctions pures pour la detection de references sans liens dans les sections Prerequis.
 */

const UNLINKED_PATTERNS = [
  /(?<!\[.*?)Cursus\s+\S+.*?\(`?[\w/-]+\/`?\)/,
  /(?<!\[.*?)Phase\s+\d+[,\s]+[Ff]iche\s+\d+/,
  /(?<!\])\(`?\d{2}-[\w-]+\/?`?\)/,
  /(?<!\[.*?)[Ff]iches?\s+\d{2}\s+\u00e0\s+\d{2}/,
  /[Tt]outes les fiches.*?\(\d{2}-[\w-]+/,
  /[Tt]outes les fiches.*?\(docs\//,
  /^\s*-\s+Phase\s+\d+\s+-\s+(?!\[)/,
  /Phase\s+\d+\s+-\s+[A-Z\u00c0-\u00da][\w\u00c0-\u00fa\s]+:\s+toutes/,
];

const SAFE_PATTERNS = [
  /\[.*?\]\(.*?\)/,
];

/**
 * Extrait les sections Prerequis d'un contenu Markdown.
 * @param {string} content
 * @returns {Array<{start: number, end: number, lines: string[]}>}
 */
function extractPrereqSections(content) {
  const lines = content.split('\n');
  const sections = [];
  let inPrereq = false;
  let startLine = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+Pr[\u00e9e]requis/.test(line)) {
      inPrereq = true;
      startLine = i;
    } else if (inPrereq && /^##\s/.test(line)) {
      sections.push({ start: startLine, end: i, lines: lines.slice(startLine, i) });
      inPrereq = false;
    }
  }
  if (inPrereq) {
    sections.push({ start: startLine, end: lines.length, lines: lines.slice(startLine) });
  }
  return sections;
}

/**
 * Verifie si une ligne contient une reference sans lien Markdown.
 * @param {string} line
 * @returns {boolean}
 */
function hasUnlinkedReference(line) {
  if (/^##/.test(line) || line.trim() === '') return false;
  const hasLink = SAFE_PATTERNS.some(p => p.test(line));
  if (hasLink) return false;
  return UNLINKED_PATTERNS.some(p => p.test(line));
}

module.exports = { UNLINKED_PATTERNS, SAFE_PATTERNS, extractPrereqSections, hasUnlinkedReference };
