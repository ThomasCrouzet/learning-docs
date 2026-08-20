/**
 * Scanner du corpus publié : le wiki doit rester centré sur les cours,
 * sans branding d'école ni cadre de diplôme / titre (RNCP, etc.).
 *
 * Fonction pure vis-à-vis du filesystem : `walk` et `readFile` sont injectables.
 */

const path = require('path');

const FORBIDDEN_PATTERNS = [
  { id: 'epitech', re: /\bEpitech\b/i },
  { id: 'rncp', re: /RNCP/ },
  { id: 'france-competences', re: /France\s+Comp[ée]tences/i },
  { id: 'etna', re: /\bETNA\b/ },
  { id: 'bc-code', re: /\bBC0[1-8]\b/ },
  { id: 'moulinette', re: /\bmoulinette\b/i },
];

const SKIP_DIR_NAMES = new Set([
  'node_modules',
  'site',
  'coverage',
  '.git',
  'javascripts',
  'stylesheets',
  'fonts',
  'overrides',
]);

const TEXT_EXTENSIONS = new Set(['.md', '.yml', '.yaml', '.html', '.js']);

const BANNED_DIRS_UNDER_DOCS = ['epitech', '00-blocs-competences'];

const BANNED_ROOT_FILES = [
  'EPITECH-Programme_MasterOfScience-E236.md',
  'EPITECH-Programme_MasterOfScience-E236-V1_2025.05 (1).pdf',
];

function defaultWalk(dir, acc = []) {
  let entries;
  try {
    entries = require('fs').readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const entry of entries) {
    if (SKIP_DIR_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) defaultWalk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function defaultReadFile(filePath) {
  return require('fs').readFileSync(filePath, 'utf8');
}

function defaultExists(filePath) {
  return require('fs').existsSync(filePath);
}

function isScannedFile(absPath, root) {
  const rel = path.relative(root, absPath).split(path.sep).join('/');
  const ext = path.extname(absPath).toLowerCase();
  if (!TEXT_EXTENSIONS.has(ext)) return false;
  if (rel.startsWith('docs/') && (rel.endsWith('.md') || rel.startsWith('docs/diagrams/'))) {
    return true;
  }
  if (rel === 'mkdocs.yml' || rel === 'README.md' || rel === 'AGENTS.md') return true;
  if (rel.startsWith('e2e/') && ext === '.js') return true;
  return false;
}

function scanText(text, fileLabel) {
  const hits = [];
  const lines = String(text).split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    for (const { id, re } of FORBIDDEN_PATTERNS) {
      re.lastIndex = 0;
      if (re.test(line)) {
        hits.push({
          file: fileLabel,
          line: i + 1,
          id,
          excerpt: line.trim().slice(0, 180),
        });
      }
    }
  }
  return hits;
}

/**
 * @param {string} root
 * @param {{ walk?: Function, readFile?: Function, exists?: Function }} [io]
 * @returns {{ hits: Array, structural: Array }}
 */
function scanCourseFocusBranding(root, io = {}) {
  const walk = io.walk || ((dir) => defaultWalk(dir));
  const readFile = io.readFile || defaultReadFile;
  const exists = io.exists || defaultExists;

  const hits = [];
  const structural = [];

  for (const banned of BANNED_DIRS_UNDER_DOCS) {
    const p = path.join(root, 'docs', banned);
    if (exists(p)) {
      structural.push({ file: `docs/${banned}`, id: 'banned-dir', excerpt: 'dossier interdit' });
    }
  }
  for (const banned of BANNED_ROOT_FILES) {
    const p = path.join(root, banned);
    if (exists(p)) {
      structural.push({ file: banned, id: 'banned-root-file', excerpt: 'fichier programme / diplôme' });
    }
  }

  const fsMod = require('fs');
  const targets = [
    path.join(root, 'docs'),
    path.join(root, 'e2e'),
    path.join(root, 'mkdocs.yml'),
    path.join(root, 'README.md'),
    path.join(root, 'AGENTS.md'),
  ];
  const files = [];
  for (const target of targets) {
    if (!exists(target)) continue;
    const stat = io.statSync
      ? io.statSync(target)
      : fsMod.statSync(target);
    if (stat.isDirectory()) files.push(...walk(target));
    else files.push(target);
  }
  for (const abs of files.filter((f) => isScannedFile(f, root))) {
    const rel = path.relative(root, abs).split(path.sep).join('/');
    let text;
    try {
      text = readFile(abs);
    } catch {
      continue;
    }
    hits.push(...scanText(text, rel));
  }

  return { hits, structural };
}

module.exports = {
  FORBIDDEN_PATTERNS,
  BANNED_DIRS_UNDER_DOCS,
  BANNED_ROOT_FILES,
  scanText,
  scanCourseFocusBranding,
  isScannedFile,
};
