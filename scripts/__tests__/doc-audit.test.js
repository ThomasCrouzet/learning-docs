const {
  slugifyHeading,
  extractHeadings,
  extractMarkdownLinks,
  extractCodeFences,
  detectPedagogySections,
  checkPedagogyGaps,
  resolveHref,
  extractMkdocsNavPaths,
  runDocAudit,
  formatReportMarkdown,
  detectHeuristicIssues,
  isTemporalHistoricalOk,
  isTemporalStaleContext,
} = require('../lib/doc-audit');

describe('slugifyHeading', () => {
  it('slugifie un titre français', () => {
    expect(slugifyHeading('Prérequis et objectifs')).toBe('prerequis-et-objectifs');
  });

  it('retire la ponctuation', () => {
    expect(slugifyHeading('Qu\'est-ce que Docker ?')).toBe('quest-ce-que-docker');
  });
});

describe('extractHeadings', () => {
  it('ignore les titres dans les blocs de code', () => {
    const content = '# Real\n\n```md\n# Fake\n```\n\n## Section\n';
    const h = extractHeadings(content);
    expect(h.map((x) => x.text)).toEqual(['Real', 'Section']);
  });
});

describe('extractMarkdownLinks', () => {
  it('extrait les liens hors code', () => {
    const content = 'Voir [a](01-a.md) et `non`.\n\n```\n[b](02-b.md)\n```\n\n[c](03-c.md#ancre)\n';
    const links = extractMarkdownLinks(content);
    expect(links.map((l) => l.href)).toEqual(['01-a.md', '03-c.md#ancre']);
  });
});

describe('extractCodeFences', () => {
  it('détecte les blocs sans langage', () => {
    const content = '```bash\necho ok\n```\n\n```\nplain\n```\n';
    const fences = extractCodeFences(content);
    expect(fences).toHaveLength(2);
    expect(fences[0].bare).toBe(false);
    expect(fences[0].lang).toBe('bash');
    expect(fences[1].bare).toBe(true);
  });
});

describe('detectPedagogySections', () => {
  it('détecte les sections cles', () => {
    const content = [
      '# 01 - Test',
      '',
      '> **En bref** : x. Lecture estimée : 10 min.',
      '',
      '## Prérequis',
      '',
      '- Aucun',
      '',
      '## Objectif de cette fiche',
      '',
      'Savoir faire X.',
      '',
      '```bash',
      'echo hi',
      '```',
      '',
      '## Exercice Pratique',
      '',
      'Faire Y.',
      '',
      '## Navigation',
      '',
      '→ Fiche suivante : **[Next](02.md)**',
    ].join('\n');
    const s = detectPedagogySections(content);
    expect(s.hasPrerequis).toBe(true);
    expect(s.hasObjectif).toBe(true);
    expect(s.hasExemple).toBe(true);
    expect(s.hasExercice).toBe(true);
    expect(s.hasNavigation).toBe(true);
    expect(s.hasEnBref).toBe(true);
  });
});

describe('checkPedagogyGaps', () => {
  it('signale les gaps sur une fiche vide', () => {
    const gaps = checkPedagogyGaps('# 01 - Vide\n\nTexte.\n', '01-docker/01-vide.md');
    const cats = gaps.map((g) => g.category);
    expect(cats).toContain('missing_prerequis');
    expect(cats).toContain('missing_objectif');
    expect(cats).toContain('missing_validation');
  });

  it('ignore les pages non-fiches', () => {
    expect(checkPedagogyGaps('# Index\n', 'index.md')).toEqual([]);
  });
});

describe('resolveHref', () => {
  it('resolut un chemin relatif', () => {
    const r = resolveHref('01-docker/01-a.md', '../02-php/01-b.md#x');
    expect(r.path).toBe('02-php/01-b.md');
    expect(r.anchor).toBe('x');
    expect(r.external).toBe(false);
  });

  it('detecte les liens externes', () => {
    expect(resolveHref('a.md', 'https://example.com').external).toBe(true);
  });

  it('gere les ancres locales', () => {
    const r = resolveHref('01-docker/01-a.md', '#section');
    expect(r.path).toBe('01-docker/01-a.md');
    expect(r.anchor).toBe('section');
  });
});

describe('extractMkdocsNavPaths', () => {
  it('extrait les chemins .md de la nav', () => {
    const yml = `
site_name: Test
nav:
  - Accueil: index.md
  - Docker:
    - Concepts: 01-docker/01-concepts.md
    - 01-docker/02-install.md
theme:
  name: material
`;
    const paths = extractMkdocsNavPaths(yml);
    expect(paths).toContain('index.md');
    expect(paths).toContain('01-docker/01-concepts.md');
    expect(paths).toContain('01-docker/02-install.md');
  });
});

describe('runDocAudit', () => {
  const pages = {
    'index.md': '# Accueil\n\nVoir [Docker](01-docker/01-concepts.md).\n',
    '01-docker/01-concepts.md': [
      '---',
      'tags: [Docker]',
      'description: "x"',
      'estimated_time: "10 min"',
      'fiche_number: 1',
      'total_fiches: 2',
      'cursus: "Docker"',
      '---',
      '',
      '# 01 - Concepts',
      '',
      '> **En bref** : Comprendre Docker. Lecture estimée : 10 min.',
      '',
      '## Prérequis',
      '',
      '- Aucun',
      '',
      '## Objectif de cette fiche',
      '',
      'Comprendre les conteneurs.',
      '',
      '```bash',
      'docker --version',
      '```',
      '',
      '## Checklist de Validation',
      '',
      '- [ ] OK',
      '',
      '## Navigation',
      '',
      '→ Fiche suivante : **[Install](02-install.md)**',
    ].join('\n'),
    '01-docker/02-install.md': [
      '# 02 - Install',
      '',
      'Texte sans structure.',
      '',
      'Lien mort : [x](99-missing.md)',
      '',
      '```',
      'no lang',
      '```',
    ].join('\n'),
    'orphan/01-alone.md': '# Alone\n\nOrpheline.\n',
  };

  const pageList = Object.keys(pages);

  function readContent(rel) {
    if (!(rel in pages)) throw new Error('missing ' + rel);
    return pages[rel];
  }
  function fileExists(rel) {
    return rel in pages;
  }

  it('inventorie et detecte liens cassés, bare fence, gaps, orphelins', () => {
    const report = runDocAudit({
      pages: pageList,
      readContent,
      fileExists,
      mkdocsYml: 'nav:\n  - Home: index.md\n  - C: 01-docker/01-concepts.md\n',
    });

    expect(report.inventory.total_pages).toBe(4);
    expect(report.findings_count).toBeGreaterThan(0);

    const cats = report.by_category;
    expect(cats.broken_internal_link).toBeGreaterThanOrEqual(1);
    expect(cats.bare_code_fence).toBeGreaterThanOrEqual(1);
    expect(cats.orphan_page).toBeGreaterThanOrEqual(1);

    // Coverage: every page has status
    for (const p of pageList) {
      expect(report.page_status[p]).toBeDefined();
      expect(report.page_status[p].audited).toBe(true);
    }
  });

  it('signale une entrée nav manquante', () => {
    const report = runDocAudit({
      pages: ['index.md'],
      readContent: () => '# x\n',
      fileExists: (r) => r === 'index.md',
      mkdocsYml: 'nav:\n  - Home: index.md\n  - Gone: missing/page.md\n',
    });
    expect(report.by_category.nav_missing_file).toBe(1);
  });
});

describe('temporal heuristics', () => {
  it('accepte l historique de creation comme ok', () => {
    expect(
      isTemporalHistoricalOk(
        '**Définition** : React est une bibliothèque créée par Facebook en 2013.'
      )
    ).toBe(true);
  });

  it('detecte un contexte de version actuelle stale', () => {
    expect(
      isTemporalStaleContext('La version actuelle recommandée en 2021 est Node 14.')
    ).toBe(true);
  });

  it('ne signale plus les dates d origine sans contexte stale', () => {
    const findings = detectHeuristicIssues(
      '# t\n\nTypeScript a été créé par Microsoft en 2012.\n',
      'x.md'
    );
    expect(findings.filter((f) => f.category === 'temporal_suspect')).toHaveLength(0);
  });
});

describe('formatReportMarkdown', () => {
  it('produit un resume lisible', () => {
    const report = {
      generated_at: '2026-07-22T00:00:00.000Z',
      inventory: { total_pages: 2, fiches: 1, meta_pages: 1, nav_entries: 1 },
      controlled: { pages: 2, with_issues: 1, clean: 1 },
      findings_count: 1,
      by_category: { bare_code_fence: 1 },
      confidence: { level: 'deterministic_heuristics', note: 'test' },
      findings: [
        {
          category: 'bare_code_fence',
          severity: 'medium',
          file: 'a.md',
          line: 3,
          message: 'bloc sans langage',
        },
      ],
    };
    const md = formatReportMarkdown(report);
    expect(md).toContain('Pages Markdown inventoriées');
    expect(md).toContain('bare_code_fence');
  });
});
