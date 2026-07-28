const {
  extractNavigationLines,
  getNextTarget,
  getPrevTarget,
  extractInternalLinks,
  resolveRelative,
  checkGroup,
} = require('../lib/consistency');

// Construit le contenu d'une fiche avec frontmatter et navigation controles.
function makeFiche({
  ficheNumber = 1,
  totalFiches = 2,
  cursus = 'Test',
  prev = null,
  next = null,
  prereqLinks = [],
} = {}) {
  const navLines = ['## Navigation', ''];
  if (prev) navLines.push(`← Fiche précédente : **[Titre](${prev})**`, '');
  if (next) navLines.push(`→ Fiche suivante : **[Titre](${next})**`, '');

  const prereqSection = ['## Prérequis', ''];
  for (const link of prereqLinks) {
    prereqSection.push(`- Lire la fiche [Titre](${link})`);
  }
  prereqSection.push('');

  return [
    '---',
    'tags:',
    '  - Test',
    'description: "Test"',
    'estimated_time: "15 min"',
    `fiche_number: ${ficheNumber}`,
    `total_fiches: ${totalFiches}`,
    `cursus: "${cursus}"`,
    '---',
    '',
    '# 01 - Titre',
    '',
    '> **En bref** : Resume. Lecture estimee : 15 min.',
    '',
    ...prereqSection,
    '## Contenu',
    '',
    'Texte.',
    '',
    '---',
    '',
    ...navLines,
  ].join('\n');
}

// Predicat exists par defaut : tout chemin de fiche fabrique existe.
const ALWAYS_EXISTS = () => true;

describe('extractNavigationLines', () => {
  it('extrait la section Navigation', () => {
    const content = makeFiche({ next: '02-b.md' });
    const lines = extractNavigationLines(content);
    expect(lines[0]).toBe('## Navigation');
    expect(lines.join('\n')).toContain('Fiche suivante');
  });

  it('retourne un tableau vide sans section Navigation', () => {
    expect(extractNavigationLines('# Titre\n\nTexte.')).toEqual([]);
  });
});

describe('getNextTarget / getPrevTarget', () => {
  it('extrait la cible du lien suivant', () => {
    const content = makeFiche({ next: '02-b.md' });
    expect(getNextTarget(content)).toBe('02-b.md');
  });

  it('extrait la cible du lien precedent', () => {
    const content = makeFiche({ prev: '01-a.md' });
    expect(getPrevTarget(content)).toBe('01-a.md');
  });

  it('ignore une ancre dans la cible', () => {
    const content = makeFiche({ next: '02-b.md' }).replace('02-b.md)', '02-b.md#section)');
    expect(getNextTarget(content)).toBe('02-b.md');
  });

  it('retourne null sans lien', () => {
    const content = makeFiche({});
    expect(getNextTarget(content)).toBeNull();
    expect(getPrevTarget(content)).toBeNull();
  });
});

describe('extractInternalLinks', () => {
  it('collecte les liens de Navigation et des prerequis', () => {
    const content = makeFiche({ next: '02-b.md', prereqLinks: ['../autre/01-x.md'] });
    const links = extractInternalLinks(content);
    expect(links).toContain('02-b.md');
    expect(links).toContain('../autre/01-x.md');
  });

  it('ignore les liens externes', () => {
    const content = makeFiche({ prereqLinks: ['https://example.com/doc.md'] });
    expect(extractInternalLinks(content)).not.toContain('https://example.com/doc.md');
  });
});

describe('resolveRelative', () => {
  it('resout un lien dans le meme dossier', () => {
    expect(resolveRelative('a/01-x.md', '02-y.md')).toBe('a/02-y.md');
  });

  it('resout un lien vers le dossier parent', () => {
    expect(resolveRelative('a/b/01-x.md', '../01-y.md')).toBe('a/01-y.md');
  });

  it('resout un lien vers un index de phase voisine', () => {
    expect(resolveRelative('crypto/04-x/01-a.md', '../05-y/index.md')).toBe('crypto/05-y/index.md');
  });
});

describe('checkGroup', () => {
  // Groupe de 2 fiches valides et chainees.
  function validGroup() {
    return {
      dir: 'cursus',
      fiches: [
        { rel: 'cursus/01-a.md', content: makeFiche({ ficheNumber: 1, totalFiches: 2, next: '02-b.md' }) },
        { rel: 'cursus/02-b.md', content: makeFiche({ ficheNumber: 2, totalFiches: 2, prev: '01-a.md' }) },
      ],
      exists: ALWAYS_EXISTS,
    };
  }

  it('valide un groupe coherent', () => {
    expect(checkGroup(validGroup())).toEqual([]);
  });

  it('detecte un trou dans fiche_number', () => {
    const g = validGroup();
    g.fiches[1].content = makeFiche({ ficheNumber: 3, totalFiches: 2, prev: '01-a.md' });
    const errors = checkGroup(g);
    expect(errors.some((e) => /fiche_number/.test(e))).toBe(true);
  });

  it('detecte un doublon de fiche_number', () => {
    const g = validGroup();
    g.fiches[1].content = makeFiche({ ficheNumber: 1, totalFiches: 2, prev: '01-a.md' });
    const errors = checkGroup(g);
    expect(errors.some((e) => /fiche_number/.test(e))).toBe(true);
  });

  it('detecte un total_fiches different du nombre de fiches', () => {
    const g = validGroup();
    g.fiches[0].content = makeFiche({ ficheNumber: 1, totalFiches: 5, next: '02-b.md' });
    g.fiches[1].content = makeFiche({ ficheNumber: 2, totalFiches: 5, prev: '01-a.md' });
    const errors = checkGroup(g);
    expect(errors.some((e) => /total_fiches/.test(e))).toBe(true);
  });

  it('detecte un total_fiches heterogene', () => {
    const g = validGroup();
    g.fiches[1].content = makeFiche({ ficheNumber: 2, totalFiches: 3, prev: '01-a.md' });
    const errors = checkGroup(g);
    expect(errors.some((e) => /total_fiches heterogene/.test(e))).toBe(true);
  });

  it('detecte un cursus heterogene', () => {
    const g = validGroup();
    g.fiches[1].content = makeFiche({
      ficheNumber: 2,
      totalFiches: 2,
      cursus: 'Autre',
      prev: '01-a.md',
    });
    const errors = checkGroup(g);
    expect(errors.some((e) => /cursus heterogene/.test(e))).toBe(true);
  });

  it('detecte un lien interne casse', () => {
    const g = validGroup();
    // La cible 02-b.md du lien suivant n'existe pas sur le disque.
    g.exists = (rel) => rel !== 'cursus/02-b.md';
    const errors = checkGroup(g);
    expect(errors.some((e) => /lien interne casse/.test(e))).toBe(true);
  });

  it('detecte une chaine de navigation incorrecte', () => {
    const g = validGroup();
    // Le lien suivant de la fiche 1 pointe vers une mauvaise cible.
    g.fiches[0].content = makeFiche({ ficheNumber: 1, totalFiches: 2, next: '99-mauvais.md' });
    const errors = checkGroup(g);
    expect(errors.some((e) => /suivant/.test(e))).toBe(true);
  });

  it('tolere les frontieres : prev absent sur la 1re, next absent sur la derniere', () => {
    const g = {
      dir: 'cursus',
      fiches: [
        { rel: 'cursus/01-a.md', content: makeFiche({ ficheNumber: 1, totalFiches: 2, next: '02-b.md' }) },
        { rel: 'cursus/02-b.md', content: makeFiche({ ficheNumber: 2, totalFiches: 2, prev: '01-a.md' }) },
      ],
      exists: ALWAYS_EXISTS,
    };
    // 01-a n'a pas de prev (frontiere) et 02-b n'a pas de next (frontiere) : OK.
    expect(checkGroup(g)).toEqual([]);
  });

  it('tolere un lien de frontiere vers une autre phase', () => {
    const g = {
      dir: 'cursus/04-phase',
      fiches: [
        {
          rel: 'cursus/04-phase/01-a.md',
          // prev pointe vers l'index de la phase precedente : NE doit PAS etre une erreur de chaine.
          content: makeFiche({ ficheNumber: 1, totalFiches: 2, prev: '../03-prec/index.md', next: '02-b.md' }),
        },
        {
          rel: 'cursus/04-phase/02-b.md',
          // next pointe vers l'index de la phase suivante : NE doit PAS etre une erreur de chaine.
          content: makeFiche({ ficheNumber: 2, totalFiches: 2, prev: '01-a.md', next: '../05-suiv/index.md' }),
        },
      ],
      exists: ALWAYS_EXISTS,
    };
    expect(checkGroup(g)).toEqual([]);
  });

  it('gere un groupe d\'une seule fiche', () => {
    const g = {
      dir: 'cursus',
      fiches: [{ rel: 'cursus/01-a.md', content: makeFiche({ ficheNumber: 1, totalFiches: 1 }) }],
      exists: ALWAYS_EXISTS,
    };
    expect(checkGroup(g)).toEqual([]);
  });
});
