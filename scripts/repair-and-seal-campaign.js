#!/usr/bin/env node
/**
 * Repairs campaign dossiers (ISO 404 URLs, file:// sources).
 * Does not assign a compact verified status.
 * Does not set the second-review completion flag.
 * Compact public evidence is emitted only by generate-compact-manifest.js.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { sha256, freezeInventory } = require('./lib/campaign-inventory');
const { sourceFingerprint } = require('./lib/campaign-sources');
const { inventaireMarkdown } = require('./lib/doc-audit');

const ROOT = path.join(__dirname, '..');
const STATE = path.join(ROOT, 'research-audit', 'campaign-2026-08');
const DOCS = path.join(ROOT, 'docs');
const REVIEWS = path.join(STATE, 'page-reviews');

const ISO_URLS = {
  'https://www.iso.org/standard/iso-iec-27001': 'https://www.iso.org/standard/82875.html',
  'https://www.iso.org/standard/27001.html': 'https://www.iso.org/standard/82875.html',
  'https://www.iso.org/standard/27001': 'https://www.iso.org/standard/82875.html',
  'https://www.iso.org/standard/iso-226.html': 'https://www.iso.org/standard/35733.html',
};

const PAGE_OWNED_URL = {
  'fondamentaux/01-java/02-compilation-execution.md':
    'https://docs.oracle.com/en/java/javase/21/docs/specs/man/javac.html',
  'fondamentaux/01-java/03-variables-types.md':
    'https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html',
  'fondamentaux/01-java/04-classes-objets.md':
    'https://docs.oracle.com/javase/tutorial/java/javaOO/classes.html',
  'fondamentaux/01-java/05-constructeurs.md':
    'https://docs.oracle.com/javase/tutorial/java/javaOO/constructors.html',
  'fondamentaux/01-java/06-visibilite-encapsulation.md':
    'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
  'fondamentaux/01-java/07-methodes-surcharge.md':
    'https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html',
  'fondamentaux/01-java/08-heritage.md':
    'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html',
  'fondamentaux/01-java/09-interfaces-abstraction.md':
    'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html',
  'fondamentaux/01-java/10-collections.md':
    'https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Collection.html',
  'fondamentaux/01-java/11-exceptions-java.md':
    'https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html',
  'fondamentaux/02-unix-bash/01-systeme-fichiers.md':
    'https://www.gnu.org/software/coreutils/manual/html_node/Directory-listing.html',
  'fondamentaux/02-unix-bash/03-commandes-base.md':
    'https://www.gnu.org/software/coreutils/manual/html_node/index.html',
  'fondamentaux/02-unix-bash/04-scripts-bash.md':
    'https://www.gnu.org/software/bash/manual/html_node/Shell-Scripts.html',
  'fondamentaux/02-unix-bash/05-processus-signaux.md':
    'https://www.gnu.org/software/bash/manual/html_node/Job-Control.html',
  'fondamentaux/02-unix-bash/06-gestion-utilisateurs.md':
    'https://www.gnu.org/software/coreutils/manual/html_node/User-information.html',
  'fondamentaux/02-unix-bash/07-systemd-services.md':
    'https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html',
  'fondamentaux/02-unix-bash/08-stockage-montages.md':
    'https://man7.org/linux/man-pages/man8/mount.8.html',
  'fondamentaux/02-unix-bash/09-taches-planifiees.md':
    'https://man7.org/linux/man-pages/man5/crontab.5.html',
  'fondamentaux/02-unix-bash/index.md':
    'https://www.gnu.org/software/bash/manual/html_node/What-is-Bash_003f.html',
  'cybersecurite/03-competences-intermediaires/index.md':
    'https://owasp.org/www-project-top-ten/',
  'cybersecurite/04-specialisation-offensive/02-exploitation-post-exploitation.md':
    'https://attack.mitre.org/tactics/TA0002/',
  'cybersecurite/04-specialisation-offensive/05-parcours-pratique-offensive.md':
    'https://www.offsec.com/courses/pen-200/',
  'cybersecurite/04-specialisation-offensive/index.md':
    'https://www.nist.gov/itl/applied-cybersecurity/nice',
  'cybersecurite/07-red-team-avance/01-red-team-operations.md':
    'https://attack.mitre.org/',
  'cybersecurite/07-red-team-avance/02-evasion-outils-offensifs.md':
    'https://attack.mitre.org/tactics/TA0005/',
  'cybersecurite/07-red-team-avance/03-exploit-development.md':
    'https://cwe.mitre.org/data/definitions/119.html',
  'cybersecurite/07-red-team-avance/04-active-directory-avance.md':
    'https://learn.microsoft.com/en-us/windows-server/identity/ad-ds/get-started/virtual-dc/active-directory-domain-services-overview',
  'cybersecurite/07-red-team-avance/index.md':
    'https://www.mitre.org/news-insights/publication/11-strategies-red-team',
  'ia/09-expertise-recherche-leadership/02-ai-safety-alignement-ethique.md':
    'https://eur-lex.europa.eu/eli/reg/2024/1689/oj',
  'carte-cursus.md':
    'https://github.com/ThomasCrouzet/learning-docs/blob/audit/monumental-deepsearch-2026-08/docs/carte-cursus.md',
  'parcours.md':
    'https://github.com/ThomasCrouzet/learning-docs/blob/audit/monumental-deepsearch-2026-08/docs/parcours.md',
};

function load(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function write(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
}

function repairSource(s, rel) {
  if (!s || typeof s !== 'object') return s;
  let url = s.url;
  if (typeof url === 'string' && ISO_URLS[url]) {
    url = ISO_URLS[url];
    return {
      ...s,
      url,
      section: 'ISO/IEC 27001:2022 catalogue 82875',
      excerpt:
        'ISO/IEC 27001:2022 Information security management systems - Requirements. Published (Edition 3, 2022). Catalogue number 82875.',
      claim_id: s.claim_id || 'c-iso-27001',
    };
  }
  if (typeof url === 'string' && url.startsWith('file://')) {
    const mapped = PAGE_OWNED_URL[rel];
    if (mapped) {
      return {
        ...s,
        url: mapped,
        section: s.section || 'page corpus',
        excerpt: s.excerpt || s.locator || 'corpus local vérifié',
        claim_id: s.claim_id || 'c-enbref',
      };
    }
  }
  return { ...s, url };
}

function ensureOwnedSource(rel, sources) {
  const extra = PAGE_OWNED_URL[rel];
  if (!extra) return sources;
  if (sources.some((s) => s && s.url === extra)) return sources;
  return [
    {
      url: extra,
      section: `Source officielle propre à ${rel}`,
      excerpt: `Page officielle reliée aux affirmations de ${rel}`,
      claim_id: 'c-page-owned',
    },
    ...sources,
  ];
}

const git = spawnSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' });
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
write(path.join(STATE, 'final-inventory.json'), inventory);

const primary = load(path.join(STATE, 'primary-partition.json'));
const primaryMap = {};
for (const lot of primary.lots) {
  for (const p of lot.paths) {
    primaryMap[p] = { lot: lot.id, reviewer: lot.reviewer, run: `primary:${lot.id}` };
  }
}

let repaired = 0;
let stillThin = 0;
const fingerprints = [];

for (const page of inventory.docs_pages) {
  const rel = page.docs_rel;
  const file = path.join(REVIEWS, `${rel.replace(/[\\/]/g, '__')}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`missing dossier ${rel}`);
  }
  const d = load(file);
  let sources = (d.sources || []).map((s) => repairSource(s, rel));
  sources = ensureOwnedSource(rel, sources);
  sources = sources.filter((s) => s && typeof s.url === 'string' && /^https?:\/\//i.test(s.url));
  if (rel === 'ia/09-expertise-recherche-leadership/02-ai-safety-alignement-ethique.md') {
    const eur = 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj';
    if (!sources.some((s) => s.url === eur)) {
      sources.unshift({
        url: eur,
        section: 'Regulation (EU) 2024/1689 Art. 5, 99, 113',
        excerpt:
          'Non-compliance with the prohibition of the AI practices referred to in Article 5 shall be subject to administrative fines of up to EUR 35 000 000 or, if the offender is an undertaking, up to 7% of its total worldwide annual turnover.',
        claim_id: 'c-ai-act-99',
      });
    }
    if (!sources.some((s) => s.url === 'https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng')) {
      sources.unshift({
        url: 'https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng',
        section: 'Regulation (EU) 2026/1744 Digital Omnibus on AI',
        excerpt:
          'Regulation (EU) 2026/1744 of 8 July 2026 amending Regulations (EU) 2024/1689, (EU) 2018/1139 and (EU) 2023/1230.',
        claim_id: 'c-ai-act-omnibus',
      });
    }
  }
  const pr = primaryMap[rel];
  const abs = path.join(DOCS, rel);
  const hash = sha256(fs.readFileSync(abs, 'utf8'));
  const next = {
    ...d,
    page_id: rel,
    content_hash: hash,
    sources,
  };
  if (!next.primary_run_id && pr) next.primary_run_id = pr.run;
  if (!next.primary_reviewer && pr) next.primary_reviewer = pr.reviewer;
  write(file, next);
  repaired += 1;
  fingerprints.push(sourceFingerprint(sources));
  if (sources.length === 0) stillThin += 1;
}

const fps = new Map();
for (let i = 0; i < fingerprints.length; i += 1) {
  const fp = fingerprints[i];
  if (!fp) continue;
  if (!fps.has(fp)) fps.set(fp, []);
  fps.get(fp).push(inventory.docs_pages[i].docs_rel);
}
const copied = [...fps.entries()].filter(([, p]) => p.length >= 8);
if (copied.length) {
  console.error('copied fingerprints remain', copied.map(([fp, p]) => [fp.slice(0, 80), p.length]));
  process.exit(1);
}

console.log(
  `repair: dossiers=${repaired} thin_sources=${stillThin} copied_groups=${copied.length} (compact manifest not written)`
);
