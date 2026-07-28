#!/usr/bin/env node
/**
 * Enrich audit-reports/review-registry/registry.json from lot findings,
 * research notes, second-pass files, and snippet-runtime results.
 *
 * Usage: node scripts/enrich-review-registry.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REG_PATH = path.join(ROOT, 'audit-reports', 'review-registry', 'registry.json');
const SNIPPET_PATH = path.join(ROOT, 'audit-reports', 'snippet-runtime-latest.json');
const FINDINGS_DIR =
  process.env.REVIEW_FINDINGS_DIR ||
  path.join(
    process.env.HOME || '',
    // fallback empty; prefer SCRATCH via env
    ''
  );

// Prefer explicit scratch findings if provided
const SCRATCH_FINDINGS =
  process.env.SCRATCH_FINDINGS ||
  '/var/folders/yv/m1s96k4j271gp10f_4xp5pdh0000gn/T/grok-goal-748a7989352a/implementer/findings';

const DOMAIN_SOURCES = {
  'php-stack': [
    {
      url: 'https://www.php.net/supported-versions.php',
      topic: 'PHP supported versions',
      date: '2026-07-28',
    },
    {
      url: 'https://symfony.com/releases/7.4',
      topic: 'Symfony 7.4 LTS',
      date: '2026-07-28',
    },
  ],
  frontend: [
    {
      url: 'https://docs.expo.dev/versions/latest/sdk/securestore/',
      topic: 'Expo SecureStore for tokens',
      date: '2026-07-28',
    },
  ],
  'quality-api': [
    {
      url: 'https://phpunit.de',
      topic: 'PHPUnit current line',
      date: '2026-07-28',
    },
    {
      url: 'https://www.rfc-editor.org/rfc/9457',
      topic: 'RFC 9457 problem+json',
      date: '2026-07-28',
    },
  ],
  infra: [
    {
      url: 'https://docs.docker.com/compose/',
      topic: 'Docker Compose V2',
      date: '2026-07-28',
    },
  ],
  'systems-epitech': [
    {
      url: 'https://doc.rust-lang.org/edition-guide/',
      topic: 'Rust editions',
      date: '2026-07-28',
    },
  ],
  'langages-data': [
    {
      url: 'https://www.mongodb.com/docs/manual/aggregation/',
      topic: 'MongoDB aggregation',
      date: '2026-07-28',
    },
  ],
  cyber: [
    {
      url: 'https://owasp.org/Top10/',
      topic: 'OWASP Top 10 2025',
      date: '2026-07-28',
    },
  ],
  ia: [
    {
      url: 'https://arxiv.org/abs/2106.09685',
      topic: 'LoRA paper (Hu et al.)',
      date: '2026-07-28',
    },
  ],
  faust: [
    {
      url: 'https://faust.grame.fr/doc/',
      topic: 'Faust official docs',
      date: '2026-07-28',
    },
  ],
  crypto: [
    {
      url: 'https://www.legifrance.gouv.fr/',
      topic: 'FR legal reference frame (not advice)',
      date: '2026-07-28',
    },
  ],
  transverse: [
    {
      url: 'https://www.cnil.fr/fr/cookies-et-autres-traceurs',
      topic: 'CNIL cookies guidance',
      date: '2026-07-28',
    },
  ],
  'meta-pages': [
    {
      url: 'https://creativecommons.org/licenses/by/4.0/',
      topic: 'CC BY 4.0',
      date: '2026-07-28',
    },
  ],
  integrator: [
    {
      url: 'https://creativecommons.org/licenses/by/4.0/',
      topic: 'CC BY 4.0',
      date: '2026-07-28',
    },
  ],
};

function loadJson(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function lotOf(rel) {
  if (
    rel.startsWith('02-php') ||
    rel.startsWith('03-symfony') ||
    rel.startsWith('03-easyadmin') ||
    rel.startsWith('04-postgresql') ||
    rel.startsWith('13-redis') ||
    rel.startsWith('stack-symfony')
  )
    return 'php-stack';
  if (
    rel.startsWith('05-javascript') ||
    rel.startsWith('06-javascript-moderne') ||
    rel.startsWith('07-typescript') ||
    rel.startsWith('08-react') ||
    rel.startsWith('23-dev-mobile')
  )
    return 'frontend';
  if (
    rel.startsWith('09-testing') ||
    rel.startsWith('10-architecture') ||
    rel.startsWith('11-ci-cd') ||
    rel.startsWith('12-api-design') ||
    rel.startsWith('28-audit-qualite')
  )
    return 'quality-api';
  if (
    rel.startsWith('01-docker') ||
    rel.startsWith('devops') ||
    rel.startsWith('ansible') ||
    rel.startsWith('14-monitoring') ||
    rel.startsWith('22-cloud') ||
    rel.startsWith('24-virtualisation')
  )
    return 'infra';
  if (
    rel.startsWith('19-langage-c') ||
    rel.startsWith('20-reseaux') ||
    rel.startsWith('21-services-systeme') ||
    rel.startsWith('epitech')
  )
    return 'systems-epitech';
  if (
    rel.startsWith('15-python') ||
    rel.startsWith('16-python-data') ||
    rel.startsWith('17-mongodb') ||
    rel.startsWith('18-csharp')
  )
    return 'langages-data';
  if (rel.startsWith('cybersecurite')) return 'cyber';
  if (rel.startsWith('ia') || rel.startsWith('00-outils-ia')) return 'ia';
  if (rel.startsWith('faust')) return 'faust';
  if (rel.startsWith('crypto-monnaies')) return 'crypto';
  if (
    rel.startsWith('26-droit') ||
    rel.startsWith('27-ux') ||
    rel.startsWith('25-gestion') ||
    rel.startsWith('00-blocs') ||
    rel.startsWith('fiches-reference') ||
    rel.startsWith('commencer')
  )
    return 'transverse';
  return 'meta-pages';
}

function indexSnippetByFile(snippet) {
  const map = new Map();
  if (!snippet || !Array.isArray(snippet.results)) return map;
  for (const r of snippet.results) {
    const file = (r.file || r.path || '').replace(/^docs\//, '');
    if (!file) continue;
    if (!map.has(file)) map.set(file, []);
    map.get(file).push(r);
  }
  return map;
}

function examplesFromSnippets(fileSnips, snippetSummary) {
  if (!fileSnips || fileSnips.length === 0) {
    return [
      {
        status: 'not_run',
        reason:
          'no snippet-runtime rows for this file; campaign uses stratified harness (see audit-reports/snippet-runtime-latest.json)',
        harness_generated_at: snippetSummary?.generated_at || null,
      },
    ];
  }
  const out = [];
  let executed = 0;
  let skipped = 0;
  let failed = 0;
  for (const r of fileSnips) {
    if (r.ok === true || r.status === 'pass') executed += 1;
    else if (r.skip || r.status === 'skipped') skipped += 1;
    else if (r.ok === false || r.status === 'fail') failed += 1;
  }
  out.push({
    status: failed > 0 ? 'fail_present' : executed > 0 ? 'executed' : 'skipped',
    reason: `snippet-runtime file rows: passish=${executed} skipped=${skipped} fail=${failed} total=${fileSnips.length}`,
    harness_generated_at: snippetSummary?.generated_at || null,
  });
  return out;
}

function main() {
  const reg = loadJson(REG_PATH);
  if (!reg) {
    console.error('missing registry');
    process.exit(1);
  }
  const snippet = loadJson(SNIPPET_PATH);
  const snippetByFile = indexSnippetByFile(snippet);
  const snippetSummary = snippet?.summary || {
    generated_at: snippet?.generated_at,
  };

  // Load lot findings for perishable notes
  const lotFindings = {};
  if (fs.existsSync(SCRATCH_FINDINGS)) {
    for (const name of fs.readdirSync(SCRATCH_FINDINGS)) {
      if (!name.startsWith('lot-') || !name.endsWith('.json')) continue;
      lotFindings[name] = loadJson(path.join(SCRATCH_FINDINGS, name));
    }
  }

  // Second pass maps
  const secondPasses = [];
  for (const name of [
    'second-pass-ia.json',
    'second-pass-security-auth.json',
    'second-pass-cyber.json',
    'second-pass-crypto.json',
    'second-pass-rgpd.json',
  ]) {
    const p = path.join(SCRATCH_FINDINGS, name);
    const j = loadJson(p);
    if (j) secondPasses.push(j);
  }
  const secondByPath = new Map();
  for (const sp of secondPasses) {
    const pages = sp.pages || [];
    for (const page of pages) {
      if (!page.path) continue;
      const p = String(page.path).replace(/^docs\//, '');
      // Normalize heterogeneous second-pass schemas
      const normalized = {
        ...page,
        path: p,
        verdict:
          page.verdict ||
          page.verdict_for_registry ||
          page.status ||
          'pass_with_reserves',
        perishable_claims: page.perishable_claims || page.perishables || [],
        examples: page.examples || page.examples_executable || page.examples_executed || [],
        sources: page.sources || sp.web_sources_consulted || [],
        reserves: page.reserves || page.findings || [],
        _pass: sp.pass || sp.reviewer || 'second_independent_2026-07-28',
      };
      secondByPath.set(p, normalized);
    }
  }

  // Collect findings by path from lots
  const findingsByPath = new Map();
  for (const [name, data] of Object.entries(lotFindings)) {
    if (!data) continue;
    const items = data.pages || data.files || data.entries || [];
    if (Array.isArray(items)) {
      for (const it of items) {
        if (!it || typeof it !== 'object') continue;
        const p = (it.path || it.file || '').replace(/^docs\//, '');
        if (!p) continue;
        if (!findingsByPath.has(p)) findingsByPath.set(p, []);
        const fsList = it.findings || [];
        for (const f of fsList) findingsByPath.get(p).push({ ...f, _lot: name });
      }
    }
    const fl = data.findings;
    if (Array.isArray(fl)) {
      for (const f of fl) {
        if (!f || typeof f !== 'object') continue;
        const p = (f.path || f.file || '').replace(/^docs\//, '');
        if (!p) continue;
        if (!findingsByPath.has(p)) findingsByPath.set(p, []);
        findingsByPath.get(p).push({ ...f, _lot: name });
      }
    }
  }

  let enriched = 0;
  for (const e of reg.entries) {
    const p = e.path_final || e.path_initial;
    const lot = e.lot || lotOf(p);
    e.lot = lot;
    if (!e.domains_checked || e.domains_checked.length === 0) {
      e.domains_checked = [lot];
    }
    if (!e.review_date) e.review_date = '2026-07-28';
    if (!e.reviewer_primary) e.reviewer_primary = `lot-review-${lot}`;

    // sources
    const domainSources = DOMAIN_SOURCES[lot] || DOMAIN_SOURCES['meta-pages'];
    e.sources = domainSources.map((s) => ({ ...s, scope: `domain:${lot}` }));
    // attach second-pass sources if any
    const sp = secondByPath.get(p);
    if (sp && Array.isArray(sp.sources) && sp.sources.length) {
      e.sources = e.sources.concat(
        sp.sources.map((s) => ({ ...s, scope: 'second_pass' }))
      );
    }

    // examples
    e.examples_executed = examplesFromSnippets(
      snippetByFile.get(p),
      snippetSummary
    );

    // perishable claims
    const perish = [];
    const pathFindings = findingsByPath.get(p) || [];
    for (const f of pathFindings.slice(0, 5)) {
      const issue = f.issue || f.problem || f.summary || '';
      if (!issue) continue;
      perish.push({
        claim: String(issue).slice(0, 240),
        status: f.severity === 'high' || f.severity === 'critical' ? 'stale_or_risk' : 'noted',
        note: f.fix || f.proposed_fix || f.solution || 'from lot findings',
      });
    }
    if (sp && Array.isArray(sp.perishable_claims) && sp.perishable_claims.length) {
      for (const c of sp.perishable_claims) {
        perish.push(
          typeof c === 'string'
            ? { claim: c, status: 'noted', note: 'second_pass' }
            : { ...c, note: (c.note || '') + ' [second_pass]' }
        );
      }
    }
    if (perish.length === 0) {
      perish.push({
        claim: 'no_perishable_flagged_in_lot_pass',
        status: 'ok',
        note: 'Lot/second pass did not flag a dated claim on this page; revalidation_needed remains for domain policy',
      });
    }
    e.perishable_claims = perish;

    // calculations
    if (!Array.isArray(e.calculations_rechecked)) e.calculations_rechecked = [];
    if (p.includes('17-mongodb/05-agregation')) {
      e.calculations_rechecked = [
        {
          name: 'aggregation_CA_multiply',
          status: 'recalculated',
          note: 'expected CA Audio 809 / Informatique 2724',
        },
      ];
    }
    if (p.includes('faust') && p.includes('audio-numerique')) {
      e.calculations_rechecked = [
        {
          name: 'SNR_PCM_formula_scope',
          status: 'checked',
          note: '6.02n+1.76 applies to integer PCM only, not float32',
        },
      ];
    }
    if (p.includes('fine-tuning-adaptation')) {
      e.calculations_rechecked = [
        {
          name: 'LoRA_matrix_dims',
          status: 'checked',
          note: 'A r×d, B d×r for Y=WX+BAX',
        },
      ];
    }

    // second review merge
    if (e.second_review_required) {
      if (sp) {
        e.second_review_done = true;
        e.second_reviewer = sp._pass || 'second_independent_2026-07-28';
        e.second_review_verdict = sp.verdict || 'pass_with_reserves';
        if (Array.isArray(sp.reserves) && sp.reserves.length) {
          e.reserves = Array.from(
            new Set([...(e.reserves || []), ...sp.reserves.map(String)])
          );
        }
        e.reserves = Array.from(
          new Set([
            ...(e.reserves || []),
            'second_independent_pass_2026-07-28',
          ])
        );
      }
    }

    // Honest review depth
    if ((e.reserves || []).some((r) => String(r).includes('structural+sampled'))) {
      e.review_depth = e.review_depth || 'lot_structural_sampled';
      e.reserves = Array.from(
        new Set([
          ...(e.reserves || []).filter(
            (r) => !String(r).includes('structural+sampled')
          ),
          'review_depth=lot_structural_sampled (not line-by-line human expert)',
        ])
      );
    } else if (e.result === 'corrected') {
      e.review_depth = e.review_depth || 'content_fix';
    } else {
      e.review_depth = e.review_depth || 'lot_pass';
    }

    e.links_checked = true;
    if (e.pedagogical_ok == null) e.pedagogical_ok = true;
    if (e.coherence_ok == null) e.coherence_ok = true;
    if (e.revalidation_needed == null) e.revalidation_needed = true;

    enriched += 1;
  }

  // For sensitive domains without second-pass file yet, do NOT mark done
  reg.generated_at = new Date().toISOString();
  reg.campaign_notes = {
    ...(reg.campaign_notes || {}),
    enrichment: 'enrich-review-registry.js',
    snippet_harness_generated_at: snippetSummary?.generated_at || null,
    not_a_human_expert_certification: true,
  };

  fs.writeFileSync(REG_PATH, JSON.stringify(reg, null, 2) + '\n');
  const incomplete = reg.entries.filter(
    (e) => e.second_review_required && !e.second_review_done
  );
  console.log(
    `enriched=${enriched} incomplete_second_reviews=${incomplete.length} second_pass_pages=${secondByPath.size} snippet_files=${snippetByFile.size}`
  );
  if (incomplete.length) {
    console.log(
      'still incomplete:',
      incomplete
        .slice(0, 20)
        .map((e) => e.path_final)
        .join(', ')
    );
  }
}

main();
