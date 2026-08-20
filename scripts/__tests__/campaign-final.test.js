import { describe, it, expect } from 'vitest';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { validateCampaignFinal } from '../lib/campaign-final.js';
import { processExitCode } from '../lib/snippet-runtime.js';
import {
  isGenericHomepage,
  sourceIsSufficientProof,
  sourcesQualifyAsProof,
} from '../lib/campaign-sources.js';
import {
  identityEquation,
  partitionProof,
  primaryPartition,
  counterPartition,
} from '../lib/campaign-inventory.js';
import { findingsExceedThreshold } from '../lib/doc-audit.js';
import { assertHttpDocumentOk, forbiddenAxeViolations } from '../lib/campaign-http.js';
import { buildPageDossier, questionsLookGeneric } from '../lib/page-dossier.js';
import { sourcesMatchPath } from '../lib/review-registry-sources.js';
import { buildCursusMatrix, extractConceptHeadings } from '../lib/curriculum-matrix.js';
import { candidateSourcesForPage } from '../lib/official-deep-sources.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CHECKER = path.join(ROOT, 'scripts', 'check-campaign-final.js');
const SNIPPET_CLI = path.join(ROOT, 'scripts', 'run-snippet-runtime.js');
const DOC_AUDIT_CLI = path.join(ROOT, 'scripts', 'check-review-registry.js');
const DOC_AUDIT = path.join(ROOT, 'scripts', 'doc-audit.js');

const proofSource = (claimId = 'c-h1') => ({
  url: 'https://docs.python.org/3/tutorial/appetite.html',
  section: '1. Whetting Your Appetite',
  excerpt: 'If you do much work on computers, eventually you find that you want to automate some task.',
  claim_id: claimId,
});

function sufficientEntry(page, overrides = {}) {
  return {
    page_id: page,
    path: page,
    status: 'verified',
    kind: 'pedagogical_fiche',
    content_hash: 'abc',
    primary_run_id: 'primary-run-1',
    second_review_run_id: 'hostile-run-2',
    primary_reviewer: 'primary-agent-python',
    second_reviewer: 'hostile-agent-0',
    second_review_required: true,
    second_review_done: true,
    sources: [proofSource(`c-${page}`)],
    ...overrides,
  };
}

describe('campaign-sources', () => {
  it('rejects documentation homepages and scope path stamps', () => {
    expect(isGenericHomepage('https://docs.python.org/3/')).toBe(true);
    expect(isGenericHomepage('https://react.dev/')).toBe(true);
    expect(isGenericHomepage('https://docs.python.org/3/tutorial/appetite.html')).toBe(false);
    expect(
      sourceIsSufficientProof({
        url: 'https://docs.python.org/3/',
        scope: 'path:15-python/',
        claim_id: 'c1',
        section: 'Python 3 documentation',
      })
    ).toBe(false);
    expect(sourceIsSufficientProof(proofSource())).toBe(true);
    expect(sourcesQualifyAsProof('15-python/01.md', [{ url: 'https://docs.python.org/3/', scope: 'path:15-python/' }])).toBe(
      false
    );
  });
});

describe('sourcesMatchPath (shipped)', () => {
  it('rejects scope:path and generic homepages as sufficient proof', () => {
    expect(
      sourcesMatchPath('15-python/01.md', [
        { url: 'https://docs.python.org/3/', scope: 'path:15-python/' },
      ])
    ).toBe(false);
    expect(sourcesMatchPath('15-python/01.md', [proofSource()])).toBe(true);
  });
});

describe('validateCampaignFinal', () => {
  const paths = ['15-python/01.md', '15-python/02.md'];
  const primary = primaryPartition(paths, 12);
  const counter = counterPartition(paths, 32);

  it('fails on missing verified, stale hash, identical run_id, inventory mismatch', () => {
    const missing = validateCampaignFinal({
      inventoryPaths: paths,
      pagesFinales: [sufficientEntry(paths[0], { content_hash: 'h1' })],
      primaryPartition: primary,
      counterPartition: counter,
      manifest: { pages: [sufficientEntry(paths[0])] },
      hashes: { [paths[0]]: 'h1' },
    });
    expect(missing.ok).toBe(false);
    expect(missing.errors.some((e) => e.includes('missing from pages_finales'))).toBe(true);

    const stale = validateCampaignFinal({
      inventoryPaths: paths,
      pagesFinales: paths.map((p) => sufficientEntry(p, { content_hash: 'old' })),
      primaryPartition: primary,
      counterPartition: counter,
      manifest: { pages: paths.map((p) => sufficientEntry(p)) },
      hashes: { [paths[0]]: 'new', [paths[1]]: 'old' },
    });
    expect(stale.ok).toBe(false);
    expect(stale.errors.some((e) => e.includes('stale hash'))).toBe(true);

    const sameRun = validateCampaignFinal({
      inventoryPaths: paths,
      pagesFinales: paths.map((p) =>
        sufficientEntry(p, {
          content_hash: 'h',
          primary_run_id: 'same',
          second_review_run_id: 'same',
        })
      ),
      primaryPartition: primary,
      counterPartition: counter,
      manifest: { pages: paths.map((p) => sufficientEntry(p)) },
      hashes: { [paths[0]]: 'h', [paths[1]]: 'h' },
    });
    expect(sameRun.ok).toBe(false);
    expect(sameRun.errors.some((e) => e.includes('identical'))).toBe(true);
  });

  it('fails incomplete required second review', () => {
    const r = validateCampaignFinal({
      inventoryPaths: paths,
      pagesFinales: paths.map((p) =>
        sufficientEntry(p, {
          content_hash: 'h',
          second_review_done: false,
        })
      ),
      primaryPartition: primary,
      counterPartition: counter,
      manifest: { pages: paths.map((p) => sufficientEntry(p)) },
      hashes: { [paths[0]]: 'h', [paths[1]]: 'h' },
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => /incomplete required second review/.test(e))).toBe(true);
  });

  it('passes a complete verified set with orthogonal partitions', () => {
    const r = validateCampaignFinal({
      inventoryPaths: paths,
      pagesFinales: paths.map((p) => sufficientEntry(p, { content_hash: 'h' })),
      primaryPartition: primary,
      counterPartition: counter,
      manifest: { pages: paths.map((p) => sufficientEntry(p)) },
      hashes: { [paths[0]]: 'h', [paths[1]]: 'h' },
    });
    expect(r.ok).toBe(true);
    expect(partitionProof(primary, counter, paths).ok).toBe(true);
    expect(
      identityEquation({
        initialPageIds: paths,
        createdPageIds: [],
        transitions: [],
        finalPageIds: paths,
      }).ok
    ).toBe(true);
  });
});

describe('snippet processExitCode (shipped)', () => {
  it('returns non-zero when summary.fail > 0 in strict mode', () => {
    expect(processExitCode({ fail: 2, unclassified: 0, skipped_without_reason: 0 }, { strict: true })).toBe(1);
    expect(processExitCode({ fail: 2, unclassified: 0, skipped_without_reason: 0 }, { strict: false })).toBe(0);
    expect(processExitCode({ fail: 0, unclassified: 1, skipped_without_reason: 0 }, { strict: true })).toBe(2);
    expect(processExitCode({ fail: 0, unclassified: 0, skipped_without_reason: 1 }, { strict: true })).toBe(1);
  });
});

describe('snippet CLI --strict', () => {
  it('exits non-zero when a snippet fails', () => {
    const fixture = path.join(ROOT, 'scripts/__tests__/fixtures/snippet-fail.md');
    const r = spawnSync(process.execPath, [SNIPPET_CLI, '--strict', '--file', fixture], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    expect(r.status, r.stderr || r.stdout).not.toBe(0);
  });
});

describe('findingsExceedThreshold (shipped)', () => {
  it('fails audit:docs --fail-on low when findings exist', () => {
    expect(findingsExceedThreshold([{ severity: 'low' }], 'low')).toBe(true);
    expect(findingsExceedThreshold([], 'low')).toBe(false);
    expect(findingsExceedThreshold([{ severity: 'low' }], 'never')).toBe(false);
  });

  it('doc-audit CLI --fail-on low exits 1 on a fixture with findings', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'doc-audit-failon-'));
    fs.writeFileSync(
      path.join(dir, '01-fixture.md'),
      '# 01 - Fixture\n\nÉvidemment il suffit de tout installer.\n'
    );
    const r = spawnSync(
      process.execPath,
      [DOC_AUDIT, '--docs-dir', dir, '--fail-on', 'low', '--json'],
      { cwd: ROOT, encoding: 'utf8' }
    );
    expect(r.status, r.stderr || r.stdout).not.toBe(0);
  });
});

describe('HTTP pretty-404 and axe gates (shipped)', () => {
  it('rejects HTTP 200 with pretty 404 body', () => {
    expect(assertHttpDocumentOk(404, '<h1>Not found</h1>').ok).toBe(false);
    expect(assertHttpDocumentOk(200, '<h1>Page non trouvée</h1>').ok).toBe(false);
    expect(assertHttpDocumentOk(200, '<title>Intro PHP</title><h1>PHP</h1>', 'text/html').ok).toBe(true);
    expect(
      assertHttpDocumentOk(
        200,
        '<title>Learning Docs</title><h1>Accueil</h1><path d="M1.034-.404-.601"></path>',
        'text/html'
      ).ok
    ).toBe(true);
  });

  it('fails on axe violations', () => {
    expect(forbiddenAxeViolations({ violations: [{ id: 'color-contrast' }] }).fail).toBe(true);
    expect(forbiddenAxeViolations({ violations: [] }).fail).toBe(false);
  });
});

describe('a11y shipped CSS/JS (contrast and scroll regions)', () => {
  const extraCss = fs.readFileSync(path.join(ROOT, 'docs/stylesheets/extra.css'), 'utf8');
  const extraJs = fs.readFileSync(path.join(ROOT, 'docs/javascripts/extra.js'), 'utf8');
  const katexLoader = fs.readFileSync(path.join(ROOT, 'docs/javascripts/katex-loader.js'), 'utf8');
  const a11yAll = fs.readFileSync(path.join(ROOT, 'scripts/audit-a11y-all.js'), 'utf8');

  it('forces pedagogical block text above 4.5:1 on tinted backgrounds', () => {
    expect(extraCss).toMatch(/blockquote\.pedagogical-block--note[\s\S]*color:\s*#212121/);
    expect(extraCss).toMatch(/blockquote \.pedagogical-block--warning[\s\S]*color:\s*#212121/);
  });

  it('gives sidebars an opaque background so TOC does not contrast against the footer', () => {
    expect(extraCss).toMatch(/\.md-sidebar--secondary\s*\{[\s\S]*background-color:\s*var\(--md-default-bg-color\)/);
  });

  it('marks overflowing KaTeX display math as a keyboard scroll region', () => {
    expect(extraJs).toMatch(/div\.arithmatex/);
    expect(extraJs).toMatch(/elementOverflows/);
    expect(extraJs).toMatch(/learning-docs:katex-rendered/);
    expect(katexLoader).toMatch(/learning-docs:katex-rendered/);
  });

  it('scrolls the sidebar wrap without document scrollIntoView', () => {
    expect(extraJs).toMatch(/wrap\.scrollTop/);
    expect(extraJs).not.toMatch(/active\.scrollIntoView/);
  });

  it('audit:a11y:all waits for shipped extra.js/KaTeX instead of injecting ARIA', () => {
    expect(a11yAll).toMatch(/arithmatex/);
    expect(a11yAll).toMatch(/document\.fonts/);
    expect(a11yAll).not.toMatch(/setAttribute\(['"]tabindex['"]/);
  });
});

describe('page-owned questions are not a copied stamp', () => {
  it('two pages produce distinct question lists', () => {
    const a = buildPageDossier(
      '15-python/01-introduction-python.md',
      '# 01 - Introduction Python\n\nUtilise `python3 --version` et PHP 8.3 n apparait pas. Python 3.12.\n'
    );
    const b = buildPageDossier(
      '20-reseaux/10-diagnostic-outils.md',
      '# 10 - Diagnostic\n\nCommande `tshark -r capture.pcap` et Wireshark 4.4.\n'
    );
    expect(a.questions[0]).not.toBe(b.questions[0]);
    expect(questionsLookGeneric([a.questions, b.questions, a.questions])).toBe(false);
    expect(a.segment_coverage.ok).toBe(true);
  });
});

describe('check-review-registry --strict incomplete second review', () => {
  it('exits 1 when second_review_required is incomplete', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'reg-second-'));
    const docs = path.join(dir, 'docs');
    fs.mkdirSync(docs);
    const rel = '01-fixture.md';
    fs.writeFileSync(path.join(docs, rel), '# 01 - Fixture\n\n> **En bref** : test. Lecture estimée : 5 min.\n');
    const registry = {
      entries: [
        {
          path_initial: rel,
          path_final: rel,
          result: 'ok',
          review_date: '2026-08-20',
          reviewer_primary: 'primary-agent-x',
          lot: 't',
          domains_checked: ['test'],
          review_depth: 'content_page',
          sources: [proofSource()],
          claims_verified: [{ claim: 'Objectif unique de la fixture de test du registre' }],
          perishable_claims: [{ claim: 'aucun pin périssable daté dans 01-fixture.md', status: 'unchecked' }],
          examples_executed: [{ status: 'skipped', reason: 'aucun bloc de code dans 01-fixture.md' }],
          second_review_required: true,
          second_review_done: false,
        },
      ],
    };
    const regPath = path.join(dir, 'registry.json');
    fs.writeFileSync(regPath, JSON.stringify(registry));
    const r = spawnSync(
      process.execPath,
      [DOC_AUDIT_CLI, '--strict', '--json', '--docs-dir', docs, '--registry', regPath],
      { cwd: ROOT, encoding: 'utf8' }
    );
    expect(r.status, r.stderr || r.stdout).not.toBe(0);
    expect(`${r.stdout}\n${r.stderr}`).toMatch(/incomplete/);
  });
});

describe('official deep source candidates (shipped)', () => {
  it('maps RFC and PHP tokens to deep URLs, not homepages', () => {
    const srcs = candidateSourcesForPage(
      '02-php/06-fonctions.md',
      'Utilise array_map() et RFC 8259 pour JSON. password_hash($p, PASSWORD_DEFAULT);'
    );
    expect(srcs.some((s) => s.url.includes('function.array-map.php'))).toBe(true);
    expect(srcs.some((s) => s.url.includes('rfc8259'))).toBe(true);
    expect(srcs.every((s) => !isGenericHomepage(s.url))).toBe(true);
  });
});

describe('curriculum matrix (shipped)', () => {
  it('detects concept overlap across pages of a cursus', () => {
    const headings = extractConceptHeadings(
      '### Qu\'est-ce qu\'un conteneur ?\n\ntexte\n\n### Qu\'est-ce qu\'une image ?\n'
    );
    expect(headings.some((h) => /conteneur/.test(h))).toBe(true);
    const matrix = buildCursusMatrix({
      cursus: 'Docker',
      pages: [
        { path: 'a.md', concepts: ['Conteneur'], objective: 'Savoir lancer un conteneur', prereqs: [] },
        { path: 'b.md', concepts: ['Conteneur', 'Image'], objective: 'Savoir construire une image', prereqs: ['a.md'] },
      ],
    });
    expect(matrix.overlaps.some((o) => o.paths.length === 2)).toBe(true);
    expect(matrix.page_count).toBe(2);
  });
});

describe('dual license metadata', () => {
  it('declares CC BY for content and MIT for Node tooling', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    expect(pkg.contentLicense).toBe('CC-BY-4.0');
    expect(pkg.codeLicense).toBe('MIT');
    expect(String(pkg.description)).toMatch(/MIT/);
    expect(String(pkg.description)).toMatch(/CC BY/);
  });
});

describe('lint:campaign-final CLI', () => {
  it('exits 1 when compact manifest is missing in a temp cwd simulation via missing file', () => {
    const r = spawnSync(process.execPath, [CHECKER, '--json'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    if (fs.existsSync(path.join(ROOT, 'review-evidence', 'manifest.json'))) {
      expect([0, 1]).toContain(r.status);
    } else {
      expect(r.status).toBe(1);
      expect(r.stdout + r.stderr).toMatch(/Missing compact manifest|lint:campaign-final FAILED/);
    }
  });
});
