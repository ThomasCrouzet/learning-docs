/**
 * Inventaire campagne : git ls-files + disque, partitions orthogonales,
 * équation d'identité initial / transitions / pages finales.
 */

const crypto = require('crypto');
const path = require('path');
const { isFiche, NON_CONTENT_DIRS } = require('./structure');

const GOVERNANCE = new Set([
  'README.md',
  'AGENTS.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'LICENSE',
  'LICENSE-CODE',
  'NOTICE',
  'package.json',
  'package-lock.json',
  'requirements.txt',
  'docker-compose.yml',
  'mkdocs.yml',
  'vitest.config.js',
  'playwright.config.js',
  '.gitleaks.toml',
  '.markdownlint.json',
]);

const META_BASENAMES = new Set([
  'index.md',
  'carte-cursus.md',
  'parcours.md',
  'tags.md',
  'a-propos.md',
  'politique-fraicheur.md',
  'accessibility-audit.md',
]);

function sha256(content) {
  return crypto.createHash('sha256').update(String(content), 'utf8').digest('hex');
}

function pageIdFromDocsRel(rel) {
  return String(rel || '')
    .replace(/^docs\//, '')
    .replace(/\\/g, '/');
}

function classifyDocsMarkdown(rel) {
  const p = pageIdFromDocsRel(rel);
  const parts = p.split('/');
  const base = parts[parts.length - 1];
  const dirs = parts.slice(0, -1);
  if (dirs.some((d) => NON_CONTENT_DIRS.has(d))) return 'excluded_non_content';
  if (p.startsWith('includes/')) return 'include';
  if (isFiche(p)) return 'pedagogical_fiche';
  if (base === 'index.md' || META_BASENAMES.has(base)) return 'meta_index';
  return 'meta_other';
}

function classifyTrackedPath(gitPath) {
  const p = String(gitPath || '').replace(/\\/g, '/');
  if (p.startsWith('docs/') && p.endsWith('.md')) {
    return classifyDocsMarkdown(p.slice(5));
  }
  if (p.startsWith('docs/diagrams/')) return 'diagram';
  if (p.startsWith('docs/javascripts/') || p.startsWith('docs/stylesheets/')) return 'asset';
  if (p.startsWith('docs/overrides/')) return 'override';
  if (p.startsWith('scripts/')) return 'script';
  if (p.startsWith('e2e/')) return 'e2e';
  if (p.startsWith('.github/')) return 'ci';
  if (p.startsWith('review-evidence/')) return 'campaign_evidence';
  if (GOVERNANCE.has(p)) return 'governance';
  return 'other_tracked';
}

function usefulTrackedText(gitPath) {
  const p = String(gitPath || '');
  if (p.startsWith('docs/stylesheets/fonts/')) return false;
  if (/\.(woff2|png|jpg|jpeg|gif|webp|ico)$/i.test(p)) return false;
  return true;
}

/**
 * @param {object} opts
 * @param {string[]} opts.gitFiles
 * @param {string[]} opts.diskDocsMarkdown  relative to docs/
 * @param {(absOrRel: string) => string} opts.readFile
 * @param {string[]} [opts.excludeDocs]
 */
function freezeInventory({ gitFiles, diskDocsMarkdown, readFile, excludeDocs = [] }) {
  const tracked = (gitFiles || []).map((p) => String(p).replace(/\\/g, '/')).sort();
  const classified = tracked.filter(usefulTrackedText).map((p) => {
    const kind = classifyTrackedPath(p);
    let hash = null;
    if (kind !== 'other_tracked' || p.endsWith('.md') || p.endsWith('.js') || p.endsWith('.yml')) {
      try {
        hash = sha256(readFile(p));
      } catch {
        hash = null;
      }
    }
    return { path: p, kind, hash, useful: true };
  });

  const gitDocsMd = tracked
    .filter((p) => p.startsWith('docs/') && p.endsWith('.md'))
    .map((p) => p.slice(5));
  const disk = (diskDocsMarkdown || []).map(pageIdFromDocsRel).sort();
  const gitSet = new Set(gitDocsMd);
  const diskSet = new Set(disk);
  const onlyGit = gitDocsMd.filter((p) => !diskSet.has(p));
  const onlyDisk = disk.filter((p) => !gitSet.has(p));

  const docsPages = [...new Set([...gitDocsMd, ...disk])].sort().map((rel) => {
    const kind = classifyDocsMarkdown(rel);
    let hash = null;
    try {
      hash = sha256(readFile(`docs/${rel}`));
    } catch {
      hash = null;
    }
    return {
      page_id: rel,
      path: `docs/${rel}`,
      docs_rel: rel,
      kind,
      hash,
      excluded: (excludeDocs || []).some((ex) => rel === ex || rel.startsWith(ex)),
    };
  });

  return {
    schema_version: 1,
    generated_at: new Date().toISOString(),
    tracked_useful: classified,
    docs_pages: docsPages,
    divergences: { only_git: onlyGit, only_disk: onlyDisk },
    counts: {
      tracked_useful: classified.length,
      docs_markdown: docsPages.length,
      pedagogical_fiche: docsPages.filter((p) => p.kind === 'pedagogical_fiche').length,
      meta: docsPages.filter((p) => p.kind.startsWith('meta') || p.kind === 'include').length,
    },
    inventory_hash: sha256(
      JSON.stringify({
        tracked: classified.map((c) => [c.path, c.hash]),
        docs: docsPages.map((p) => [p.page_id, p.hash]),
      })
    ),
  };
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function primaryPartition(pageIds, lotSize = 12) {
  const groups = new Map();
  for (const id of pageIds) {
    const g = String(id).split('/')[0] || 'root';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(id);
  }
  const lots = [];
  for (const g of [...groups.keys()].sort()) {
    const list = groups.get(g).slice().sort();
    chunk(list, lotSize).forEach((paths, i) => {
      lots.push({
        id: `primary:${g}:${String(i + 1).padStart(2, '0')}`,
        owner: `primary-${g}`,
        reviewer: `primary-agent-${g}`,
        paths,
      });
    });
  }
  return lots;
}

function counterPartition(pageIds, bucketCount = 32) {
  const buckets = Array.from({ length: bucketCount }, (_, i) => ({
    id: `counter:${String(i).padStart(2, '0')}`,
    owner: `hostile-${i}`,
    reviewer: `hostile-agent-${i}`,
    paths: [],
  }));
  for (const id of [...pageIds].sort()) {
    const idx = parseInt(sha256(id).slice(0, 8), 16) % bucketCount;
    buckets[idx].paths.push(id);
  }
  return buckets.filter((b) => b.paths.length > 0);
}

function lotOverlap(lots) {
  const seen = new Set();
  const overlap = [];
  for (const lot of lots || []) {
    for (const p of lot.paths || []) {
      if (seen.has(p)) overlap.push(p);
      seen.add(p);
    }
  }
  return { union: seen, overlap };
}

function partitionProof(primary, counter, inventoryPageIds) {
  const inv = new Set(inventoryPageIds);
  const p = lotOverlap(primary);
  const c = lotOverlap(counter);
  const errors = [];
  if (p.overlap.length) errors.push(`primary overlap: ${p.overlap.slice(0, 8).join(', ')}`);
  if (c.overlap.length) errors.push(`counter overlap: ${c.overlap.slice(0, 8).join(', ')}`);
  for (const id of inv) {
    if (!p.union.has(id)) errors.push(`primary missing ${id}`);
    if (!c.union.has(id)) errors.push(`counter missing ${id}`);
  }
  for (const id of p.union) {
    if (!inv.has(id)) errors.push(`primary extra ${id}`);
  }
  for (const id of c.union) {
    if (!inv.has(id)) errors.push(`counter extra ${id}`);
  }
  const ownerOverlap = [];
  const pOwner = new Map();
  for (const lot of primary || []) {
    for (const path of lot.paths || []) pOwner.set(path, lot.reviewer);
  }
  for (const lot of counter || []) {
    for (const path of lot.paths || []) {
      if (pOwner.get(path) === lot.reviewer) ownerOverlap.push(path);
    }
  }
  if (ownerOverlap.length) {
    errors.push(`same reviewer on both partitions: ${ownerOverlap.slice(0, 8).join(', ')}`);
  }
  return { ok: errors.length === 0, errors };
}

const TRANSITION_OPS = new Set(['moved', 'merged', 'removed', 'split']);

/**
 * Chaque page_id initial est encore dans pages_finales, ou consommé
 * exactement une fois par une transition.
 */
function identityEquation({ initialPageIds, createdPageIds = [], transitions = [], finalPageIds }) {
  const errors = [];
  const initial = [...new Set(initialPageIds || [])];
  const created = new Set(createdPageIds || []);
  const finales = new Set(finalPageIds || []);
  const consumed = new Map();

  for (const t of transitions || []) {
    if (!TRANSITION_OPS.has(t.op)) {
      errors.push(`invalid transition op ${t.op}`);
      continue;
    }
    const sources = t.source_ids || t.sources || [];
    if (!Array.isArray(sources) || sources.length === 0) {
      errors.push(`transition ${t.id || t.op} missing source_ids`);
      continue;
    }
    for (const s of sources) {
      if (consumed.has(s)) errors.push(`page_id ${s} consumed twice`);
      consumed.set(s, t.op);
    }
    if (finales.has(t.id)) {
      errors.push(`transition id ${t.id} must not appear in pages_finales`);
    }
  }

  for (const id of initial) {
    const inFinal = finales.has(id);
    const wasConsumed = consumed.has(id);
    if (inFinal && wasConsumed) {
      errors.push(`${id} still in pages_finales after ${consumed.get(id)}`);
    }
    if (!inFinal && !wasConsumed) {
      errors.push(`${id} missing from pages_finales and transitions`);
    }
  }

  for (const id of finales) {
    const known = initial.includes(id) || created.has(id);
    if (!known) errors.push(`final ${id} is neither initial nor created`);
  }

  for (const id of consumed.keys()) {
    if (finales.has(id)) {
      errors.push(`consumed ${id} still listed as final path`);
    }
  }

  return { ok: errors.length === 0, errors };
}

module.exports = {
  sha256,
  pageIdFromDocsRel,
  classifyDocsMarkdown,
  classifyTrackedPath,
  usefulTrackedText,
  freezeInventory,
  chunk,
  primaryPartition,
  counterPartition,
  lotOverlap,
  partitionProof,
  identityEquation,
  TRANSITION_OPS,
  GOVERNANCE,
  META_BASENAMES,
};
