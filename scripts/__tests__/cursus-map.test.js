const { collectFiches, findIndexPath, computeStats, buildMarkdown } = require('../lib/cursus-map');

describe('collectFiches', () => {
  const mockGetFrontmatter = (filePath) => {
    if (filePath.includes('index.md') || filePath.includes('tags.md')) return null;
    return {
      tags: ['Docker', 'D\u00e9butant'],
      estimated_time: '15 min',
    };
  };

  it('collecte les fiches depuis une liste plate', () => {
    const navItems = ['docker/01-concepts.md', 'docker/02-install.md'];
    const result = collectFiches(navItems, mockGetFrontmatter);
    expect(result).toHaveLength(2);
  });

  it('ignore index.md', () => {
    const navItems = ['docker/index.md', 'docker/01-concepts.md'];
    const result = collectFiches(navItems, mockGetFrontmatter);
    expect(result).toHaveLength(1);
  });

  it('ignore tags.md', () => {
    const navItems = ['tags.md', 'docker/01-concepts.md'];
    const result = collectFiches(navItems, mockGetFrontmatter);
    expect(result).toHaveLength(1);
  });

  it('gere les structures imbriquees', () => {
    const navItems = [
      { 'Docker': [
        { '01 - Concepts': 'docker/01-concepts.md' },
        { '02 - Install': 'docker/02-install.md' },
      ]},
    ];
    const result = collectFiches(navItems, mockGetFrontmatter);
    expect(result).toHaveLength(2);
  });

  it('retourne vide si getFrontmatter retourne null', () => {
    const navItems = ['docker/01-concepts.md'];
    const result = collectFiches(navItems, () => null);
    expect(result).toHaveLength(0);
  });
});

describe('findIndexPath', () => {
  it('retourne index.md quand present', () => {
    const navItems = ['docker/index.md', 'docker/01-concepts.md'];
    expect(findIndexPath(navItems)).toBe('docker/index.md');
  });

  it('retourne le premier fichier sinon', () => {
    const navItems = ['docker/01-concepts.md', 'docker/02-install.md'];
    expect(findIndexPath(navItems)).toBe('docker/01-concepts.md');
  });

  it('cherche dans les structures imbriquees', () => {
    const navItems = [
      { 'Docker': ['docker/index.md', 'docker/01-concepts.md'] },
    ];
    expect(findIndexPath(navItems)).toBe('docker/index.md');
  });

  it('retourne null pour une liste vide', () => {
    expect(findIndexPath([])).toBeNull();
  });
});

describe('computeStats', () => {
  it('calcule le temps total', () => {
    const fiches = [
      { estimated_time: '15 min', tags: ['D\u00e9butant'] },
      { estimated_time: '20 min', tags: ['D\u00e9butant'] },
    ];
    const { timeStr } = computeStats(fiches);
    expect(timeStr).toBe('35min');
  });

  it('formate en heures et minutes', () => {
    const fiches = [
      { estimated_time: '45 min', tags: [] },
      { estimated_time: '30 min', tags: [] },
    ];
    const { timeStr } = computeStats(fiches);
    expect(timeStr).toBe('1h 15min');
  });

  it('identifie les niveaux depuis les tags', () => {
    const fiches = [
      { estimated_time: '10 min', tags: ['D\u00e9butant'] },
      { estimated_time: '10 min', tags: ['Interm\u00e9diaire'] },
      { estimated_time: '10 min', tags: ['Avanc\u00e9'] },
    ];
    const { levels } = computeStats(fiches);
    expect(levels).toContain('D\u00e9butant');
    expect(levels).toContain('Avanc\u00e9');
  });

  it('gere les fiches sans estimated_time', () => {
    const fiches = [
      { tags: ['D\u00e9butant'] },
      { estimated_time: '10 min', tags: [] },
    ];
    const { timeStr } = computeStats(fiches);
    expect(timeStr).toBe('10min');
  });

  it('retourne "Tous niveaux" sans tags de niveau', () => {
    const fiches = [
      { estimated_time: '10 min', tags: ['Docker'] },
    ];
    const { levels } = computeStats(fiches);
    expect(levels).toBe('Tous niveaux');
  });
});

describe('buildMarkdown', () => {
  const groups = [
    {
      tabName: 'Développement Web',
      cursus: [
        { name: 'Docker', count: 2, time: '3h 30min', levels: 'Débutant', indexPath: '01-docker/index.md' },
        { name: 'PHP', count: 14, time: '15h', levels: 'Débutant → Avancé', indexPath: '02-php/index.md' },
      ],
    },
  ];

  it('calcule le total de fiches et de cursus dans le contenu', () => {
    const content = buildMarkdown(groups);
    // 2 + 14 = 16 fiches, 2 cursus
    expect(content).toContain('**16 fiches** au total, réparties sur **2 cursus**.');
    expect(content).toContain("Vue d'ensemble des 16 fiches réparties sur 2 cursus.");
  });

  it('est deterministe : meme entree, meme contenu (mode --check vert)', () => {
    // La logique de --check compare deux generations du contenu : elles doivent
    // etre strictement identiques quand l'entree ne change pas.
    const a = buildMarkdown(groups);
    const b = buildMarkdown(groups);
    expect(a).toBe(b);
  });

  it('produit un contenu different quand un count change (drift detecte)', () => {
    // Simule le drift que --check doit detecter : une fiche ajoutee a un cursus
    // modifie le contenu, donc la comparaison au fichier sur disque echouerait.
    const reference = buildMarkdown(groups);
    const drifted = buildMarkdown([
      {
        tabName: 'Développement Web',
        cursus: [
          { name: 'Docker', count: 2, time: '3h 30min', levels: 'Débutant', indexPath: '01-docker/index.md' },
          // PHP passe de 14 a 15 fiches
          { name: 'PHP', count: 15, time: '16h', levels: 'Débutant → Avancé', indexPath: '02-php/index.md' },
        ],
      },
    ]);
    expect(drifted).not.toBe(reference);
    expect(drifted).toContain('**17 fiches** au total');
  });

  it('inclut une ligne de tableau par cursus avec le lien index', () => {
    const content = buildMarkdown(groups);
    expect(content).toContain('| **[Docker](01-docker/index.md)** | 2 | 3h 30min | Débutant |');
    expect(content).toContain('## Développement Web');
  });
});
