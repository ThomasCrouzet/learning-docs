#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {
  PHRASE_RULES,
  WORD_RULES,
  protectInlineCode,
  protectUrls,
  processFile,
  stripAccents,
} = require('./lib/accents');

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const FIX_MODE = process.argv.includes('--fix');
const DISCOVER_MODE = process.argv.includes('--discover');

// Accept file arguments (used by lint-staged) or scan all docs/
const explicitFiles = process.argv.filter(a => a !== '--fix' && !a.startsWith('-') && a.endsWith('.md'));

function getAllMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['overrides', 'stylesheets', 'javascripts'].includes(entry.name)) continue;
      results.push(...getAllMdFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// --- Discovery mode ---

function extractWordsFromLine(line) {
  // Protect inline code and URLs before extracting words
  const code = protectInlineCode(line);
  const urls = protectUrls(code.line);
  // Extract lowercase words (3+ chars to avoid noise)
  const words = urls.line.match(/\b[a-zA-Z\u00C0-\u024F]{3,}\b/g) || [];
  return words.map(w => w.toLowerCase());
}

function buildCoveredPatterns() {
  // Build a function that checks if a word is matched by any existing rule
  const allRules = [...WORD_RULES, ...PHRASE_RULES];
  return {
    has(word) {
      for (const rule of allRules) {
        // Test the word against the actual regex pattern
        const re = new RegExp(rule.pattern.source, rule.pattern.flags.replace('g', ''));
        if (re.test(word)) return true;
      }
      return false;
    }
  };
}

// Technical/English words to exclude from discovery (would cause false positives)
const DISCOVER_EXCLUDE = new Set([
  'git', 'email', 'the', 'event', 'events', 'select', 'gate', 'gates',
  'real', 'bela', 'series', 'omega', 'alpha', 'beta', 'delta', 'lambda',
  'complete', 'global', 'module', 'modules', 'interface', 'interfaces',
  'simple', 'stable', 'table', 'tables', 'code', 'codes', 'node', 'nodes',
  'mode', 'modes', 'note', 'notes', 'type', 'types', 'pipe', 'pipes',
  'file', 'files', 'rule', 'rules', 'page', 'pages', 'route', 'routes',
  'cache', 'plugin', 'plugins', 'service', 'services', 'volume', 'volumes',
  'image', 'images', 'bridge', 'merge', 'range', 'stage', 'scope',
  'structure', 'programme', 'programmes', 'architecture', 'base', 'class',
  'instance', 'instances', 'promise', 'remote', 'template', 'templates',
  'fixture', 'fixtures', 'middleware', 'provider', 'container', 'containers',
  'bundle', 'bundles', 'handle', 'handler', 'handlers', 'channel', 'channels',
  'cluster', 'clusters', 'release', 'releases', 'replica', 'replicas',
  'resource', 'resources', 'secret', 'secrets', 'probe', 'role', 'roles',
  'label', 'labels', 'expose', 'import', 'export', 'inline', 'native',
  'override', 'private', 'public', 'static', 'super', 'volatile',
  'abstract', 'final', 'double', 'continue', 'false', 'true', 'null',
  'undefined', 'object', 'string', 'number', 'boolean', 'symbol',
  'function', 'return', 'delete', 'default', 'switch', 'case',
  'break', 'while', 'for', 'new', 'var', 'let', 'const', 'class',
  'extends', 'implements', 'throw', 'try', 'catch', 'finally',
  'from', 'with', 'this', 'super', 'void', 'enum', 'async', 'await',
  'yield', 'get', 'set', 'of', 'in', 'on', 'at', 'to', 'by', 'as', 'if',
  'up', 'run', 'use', 'end', 'add', 'all', 'and', 'not', 'but', 'or',
  'has', 'had', 'are', 'was', 'were', 'been', 'being', 'have', 'has',
  'did', 'does', 'will', 'would', 'should', 'could', 'can', 'may',
  'shall', 'must', 'need', 'dare', 'used', 'like', 'some', 'any',
  'each', 'every', 'such', 'than', 'then', 'when', 'where', 'while',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'old', 'out', 'off', 'over', 'into', 'back', 'down', 'our',
  'who', 'what', 'how', 'why', 'yes', 'yet', 'just', 'only', 'also',
  'here', 'there', 'them', 'their', 'more', 'less', 'make', 'made',
  'well', 'very', 'much', 'many', 'same', 'own', 'other', 'another',
  'part', 'take', 'done', 'give', 'tell', 'time', 'long', 'high',
  'look', 'work', 'call', 'name', 'come', 'open', 'keep', 'last',
  'line', 'lines', 'list', 'found', 'next', 'first', 'test', 'tests',
  'spec', 'build', 'start', 'stop', 'create', 'update', 'remove',
  'index', 'input', 'output', 'error', 'warn', 'debug', 'info',
  'push', 'pull', 'fetch', 'clone', 'commit', 'branch', 'tag', 'diff',
  'patch', 'log', 'show', 'describe', 'status', 'config', 'init',
  'listen', 'bind', 'close', 'send', 'receive', 'read', 'write',
  'print', 'parse', 'render', 'compile', 'deploy', 'install', 'package',
  'defi', 'token', 'tokens', 'blockchain', 'block', 'blocks',
  'hash', 'hashes', 'mining', 'miner', 'miners', 'wallet', 'wallets',
  'staking', 'stake', 'unstake', 'yield', 'pool', 'pools', 'swap',
  'bridge', 'oracle', 'oracles', 'smart', 'contract', 'contracts',
  'mainnet', 'testnet', 'gas', 'wei', 'gwei', 'ether', 'bitcoin',
  'decoder', 'encode', 'encoder', 'molecule', 'molecules',
  'signal', 'signals', 'process', 'filter', 'filters',
  'sample', 'samples', 'buffer', 'buffers', 'stream', 'streams',
  'frame', 'frames', 'trigger', 'triggers', 'delay', 'delays',
  // Mots souvent techniques ou prefixes
  'pre', 'dep', 'fee', 'fees', 'theta', 'meta', 'age', 'ages',
  'log', 'logs', 'map', 'maps', 'set', 'sets', 'bit', 'bits',
  'pod', 'pods', 'job', 'jobs', 'key', 'keys', 'value', 'values',
  'state', 'states', 'store', 'stores', 'queue', 'queues',
  'trait', 'traits', 'spec', 'specs', 'mock', 'mocks',
  'hook', 'hooks', 'slot', 'slots', 'prop', 'props',
  'span', 'spans', 'stack', 'stacks', 'heap', 'heaps',
  'task', 'tasks', 'thread', 'threads', 'lock', 'locks',
  'lease', 'leases', 'claim', 'claims', 'rule', 'rules',
  'host', 'hosts', 'peer', 'peers', 'retry', 'retries',
  'legacy', 'audit', 'alert', 'alerts',
  'cast', 'match', 'matches', 'check', 'checks',
  'reset', 'assert', 'asserts', 'resolve', 'reject',
  'require', 'define', 'declare', 'spread',
  'tuple', 'union', 'alias', 'generic', 'generics',
  'delta', 'sigma', 'gamma', 'epsilon', 'omega', 'alpha', 'beta',
  'idle', 'prime', 'factor',
  // Mots anglais courants dans contexte tech
  'echo', 'medium', 'media', 'resume', 'consider', 'considere',
  'exec', 'execute', 'leader', 'leaders', 'review', 'reviews',
  'issue', 'issues', 'version', 'versions', 'date', 'dates',
  'action', 'actions', 'source', 'sources', 'target', 'targets',
  'header', 'headers', 'footer', 'footers', 'body', 'title',
  'chart', 'charts', 'metric', 'metrics', 'probe', 'probes',
  'plan', 'plans', 'minute', 'minutes', 'second', 'seconds',
]);

function runDiscovery(files) {
  let frenchWords;
  try {
    frenchWords = require('an-array-of-french-words');
  } catch {
    console.error('  Erreur : installez le dictionnaire avec : npm install --save-dev an-array-of-french-words');
    process.exit(1);
  }

  // Build set of all valid French words
  const validFrench = new Set(frenchWords);

  // Build map: unaccented -> Set<accented forms>
  const accentMap = new Map();
  for (const word of frenchWords) {
    const stripped = stripAccents(word);
    if (stripped !== word && stripped.length >= 3) {
      if (!accentMap.has(stripped)) accentMap.set(stripped, new Set());
      accentMap.get(stripped).add(word);
    }
  }

  // Get patterns already covered by rules
  const covered = buildCoveredPatterns();

  // Scan all files
  const candidates = new Map(); // unaccented -> { accented: Set, count: number, files: Set }
  const ambiguous = new Map();

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    let inCodeBlock = false;
    const relativePath = path.relative(path.join(__dirname, '..'), file);

    for (const line of lines) {
      if (line.trimStart().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      const words = extractWordsFromLine(line);
      for (const word of words) {
        // Skip if this word contains accented chars (already correct)
        if (word !== stripAccents(word)) continue;
        // Skip if not in the accent map (no accented version exists)
        if (!accentMap.has(word)) continue;
        // Skip if already covered by existing rules
        if (covered.has(word)) continue;
        // Skip known technical/English terms
        if (DISCOVER_EXCLUDE.has(word)) continue;

        const accentedForms = accentMap.get(word);
        const isAmbiguous = validFrench.has(word);

        const target = isAmbiguous ? ambiguous : candidates;
        if (!target.has(word)) {
          target.set(word, { accented: accentedForms, count: 0, files: new Set() });
        }
        target.get(word).count++;
        target.get(word).files.add(relativePath);
      }
    }
  }

  // Sort by count descending
  const sortByCount = (a, b) => b[1].count - a[1].count;

  // Display results
  const candidateList = [...candidates.entries()].sort(sortByCount);
  const ambiguousList = [...ambiguous.entries()].sort(sortByCount);

  if (candidateList.length === 0 && ambiguousList.length === 0) {
    console.log('  Aucun mot non couvert trouv\u00e9.');
    return;
  }

  if (candidateList.length > 0) {
    console.log(`\n  Candidats pour nouvelles r\u00e8gles (${candidateList.length} mots non ambigus) :\n`);
    for (const [word, data] of candidateList.slice(0, 50)) {
      const forms = [...data.accented].join(', ');
      console.log(`    ${word} -> ${forms} (${data.count} occ. dans ${data.files.size} fichier(s))`);
    }
    if (candidateList.length > 50) {
      console.log(`    ... et ${candidateList.length - 50} autres mots`);
    }
  }

  if (ambiguousList.length > 0) {
    console.log(`\n  Mots ambigus - v\u00e9rification manuelle (${ambiguousList.length} mots) :\n`);
    for (const [word, data] of ambiguousList.slice(0, 30)) {
      const forms = [...data.accented].join(', ');
      console.log(`    ${word} -> ${forms} (${data.count} occ.) -- "${word}" est aussi un mot valide`);
    }
    if (ambiguousList.length > 30) {
      console.log(`    ... et ${ambiguousList.length - 30} autres mots`);
    }
  }

  const totalCandidates = candidateList.reduce((sum, [, d]) => sum + d.count, 0);
  const totalAmbiguous = ambiguousList.reduce((sum, [, d]) => sum + d.count, 0);
  console.log(`\n  Total : ${totalCandidates} occurrences non ambigu\u00ebs, ${totalAmbiguous} ambigu\u00ebs.`);
}

// --- Main ---

const files = explicitFiles.length > 0
  ? explicitFiles.map(f => path.resolve(f))
  : getAllMdFiles(DOCS_DIR);

if (DISCOVER_MODE) {
  runDiscovery(files);
  process.exit(0);
}

let totalCount = 0;
const affected = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8');
  const { content: fixed, changeCount } = processFile(content);

  if (changeCount === 0) continue;

  totalCount += changeCount;
  const relativePath = path.relative(path.join(__dirname, '..'), file);
  affected.push({ path: relativePath, count: changeCount });

  if (FIX_MODE) {
    fs.writeFileSync(file, fixed, 'utf-8');
  }
}

if (affected.length === 0) {
  console.log('  Aucun accent manquant trouv\u00e9.');
  process.exit(0);
}

if (FIX_MODE) {
  console.log(`  ${totalCount} accent(s) corrig\u00e9(s) dans ${affected.length} fichier(s).`);
} else {
  console.error(`\n  ${totalCount} accent(s) manquant(s) dans ${affected.length} fichier(s) :\n`);
  for (const { path: p, count } of affected) {
    console.error(`  - ${p} (${count})`);
  }
  console.error('\n  Corrigez avec : npm run lint:accents:fix\n');
  process.exit(1);
}
