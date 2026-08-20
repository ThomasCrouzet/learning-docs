#!/usr/bin/env node
/**
 * Fige l'inventaire git+disque, les partitions et la file de travail
 * sous research-audit/campaign-2026-08/ (gitignored).
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
  freezeInventory,
  primaryPartition,
  counterPartition,
  partitionProof,
  sha256,
} = require('./lib/campaign-inventory');
const { inventaireMarkdown } = require('./lib/doc-audit');
const { buildPageDossier, questionsLookGeneric } = require('./lib/page-dossier');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const OUT = path.join(ROOT, 'research-audit', 'campaign-2026-08');

function writeAtomic(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2) + '\n');
  fs.renameSync(tmp, file);
}

const git = spawnSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' });
if (git.status !== 0) {
  console.error(git.stderr || 'git ls-files failed');
  process.exit(1);
}
const gitFiles = git.stdout.split('\n').filter(Boolean);
const diskDocs = inventaireMarkdown(DOCS, {
  readFile: (p) => fs.readFileSync(p, 'utf8'),
  listDir: (p) => fs.readdirSync(p),
  isDir: (p) => {
    try {
      return fs.statSync(p).isDirectory();
    } catch {
      return false;
    }
  },
  exists: (p) => fs.existsSync(p),
});

const inventory = freezeInventory({
  gitFiles,
  diskDocsMarkdown: diskDocs,
  readFile: (p) => fs.readFileSync(path.join(ROOT, p), 'utf8'),
});

const pageIds = inventory.docs_pages.map((p) => p.docs_rel);
const primary = { lots: primaryPartition(pageIds) };
const counter = { lots: counterPartition(pageIds) };
const proof = partitionProof(primary.lots, counter.lots, pageIds);

const dossiersDir = path.join(OUT, 'page-reviews');
fs.mkdirSync(dossiersDir, { recursive: true });
const questionLists = [];
for (const page of inventory.docs_pages) {
  const abs = path.join(DOCS, page.docs_rel);
  const body = fs.readFileSync(abs, 'utf8');
  const dossier = buildPageDossier(page.docs_rel, body);
  const safe = page.docs_rel.replace(/[\\/]/g, '__');
  writeAtomic(path.join(dossiersDir, `${safe}.json`), dossier);
  questionLists.push(dossier.questions);
}

const queue = {
  schema_version: 1,
  lots: primary.lots.map((lot) => ({
    ...lot,
    status: 'unstarted',
    hash: sha256(JSON.stringify(lot.paths)),
  })),
};

const state = {
  schema_version: 1,
  repo: 'ThomasCrouzet/learning-docs',
  branch: 'audit/monumental-deepsearch-2026-08',
  base_sha: spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).stdout.trim(),
  inventory_hash: inventory.inventory_hash,
  queue_hash: sha256(JSON.stringify(queue)),
  next: queue.lots[0] ? queue.lots[0].id : null,
  stamp_questions: questionsLookGeneric(questionLists),
};

writeAtomic(path.join(OUT, 'initial-inventory.json'), inventory);
writeAtomic(path.join(OUT, 'primary-partition.json'), primary);
writeAtomic(path.join(OUT, 'counter-partition.json'), counter);
writeAtomic(path.join(OUT, 'partition-proof.json'), proof);
writeAtomic(path.join(OUT, 'work-queue.json'), queue);
writeAtomic(path.join(OUT, 'campaign-state.json'), state);

console.log(
  `campaign freeze: docs=${inventory.counts.docs_markdown} fiches=${inventory.counts.pedagogical_fiche} lots=${queue.lots.length} partitions_ok=${proof.ok} generic_questions=${state.stamp_questions}`
);
if (!proof.ok) {
  for (const e of proof.errors.slice(0, 20)) console.error(' -', e);
  process.exit(1);
}
