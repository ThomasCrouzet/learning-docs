const {
  isFiche,
  ficheNumberFromName,
  groupByDir,
  checkEnBref,
  extractNavigationLines,
  hasPrevLink,
  hasNextLink,
  checkFicheStructure,
} = require('../lib/structure');

// Construit une fiche valide minimale, avec controle des liens de navigation.
function makeFiche({ enBref, prev, next } = {}) {
  const enBrefLine =
    enBref === undefined
      ? '> **En bref** : Tu sauras faire quelque chose. Lecture estimee : 15 min.'
      : enBref;

  const navLines = ['## Navigation', ''];
  if (prev) navLines.push(prev, '');
  if (next) navLines.push(next, '');

  return [
    '---',
    'tags:',
    '  - Test',
    'description: "Test"',
    'estimated_time: "15 min"',
    'fiche_number: 1',
    'total_fiches: 1',
    'cursus: "Test"',
    '---',
    '',
    '# 01 - Titre de la fiche',
    '',
    enBrefLine,
    '',
    '## Contenu',
    '',
    'Du texte.',
    '',
    '---',
    '',
    ...navLines,
  ].join('\n');
}

const VALID_PREV = '← Fiche précédente : **[Titre](00-prec.md)**';
const VALID_NEXT = '→ Fiche suivante : **[Titre](02-suiv.md)**';

describe('isFiche', () => {
  it('reconnait une fiche numerotee', () => {
    expect(isFiche('01-docker/01-concepts.md')).toBe(true);
  });

  it('exclut index.md', () => {
    expect(isFiche('01-docker/index.md')).toBe(false);
  });

  it('exclut une page meta non numerotee', () => {
    expect(isFiche('carte-cursus.md')).toBe(false);
    expect(isFiche('commencer/parcours.md')).toBe(false);
  });

  it('exclut un fichier dans includes/', () => {
    expect(isFiche('includes/glossary.md')).toBe(false);
  });

  it('exclut un fichier dans un dossier technique', () => {
    expect(isFiche('stylesheets/01-extra.md')).toBe(false);
  });

  it('reconnait une fiche en sous-dossier de phase', () => {
    expect(isFiche('crypto-monnaies/01-fondamentaux/02-cryptographie.md')).toBe(true);
  });
});

describe('ficheNumberFromName', () => {
  it('extrait le numero de fiche', () => {
    expect(ficheNumberFromName('01-docker/03-volumes.md')).toBe(3);
  });

  it('retourne null sans prefixe numerique', () => {
    expect(ficheNumberFromName('docker/index.md')).toBeNull();
  });
});

describe('groupByDir', () => {
  it('regroupe les fiches par dossier et trie par numero', () => {
    const groups = groupByDir([
      'a/02-b.md',
      'a/01-a.md',
      'a/10-j.md',
      'b/01-x.md',
    ]);
    expect(groups.get('a')).toEqual(['a/01-a.md', 'a/02-b.md', 'a/10-j.md']);
    expect(groups.get('b')).toEqual(['b/01-x.md']);
  });
});

describe('checkEnBref', () => {
  it('valide un bloc En bref bien forme', () => {
    expect(checkEnBref(makeFiche({ prev: VALID_PREV, next: VALID_NEXT }))).toBeNull();
  });

  it('detecte un En bref absent', () => {
    const content = '# Titre\n\n## Contenu\n\nTexte.';
    expect(checkEnBref(content)).toMatch(/absent/);
  });

  it('detecte un En bref pas immediatement apres le H1', () => {
    const content =
      '# Titre\n\n## Prerequis\n\nAucun.\n\n> **En bref** : Resume. Lecture estimee : 10 min.';
    expect(checkEnBref(content)).toMatch(/immediatement/);
  });

  it('detecte un En bref sans "Lecture estimee"', () => {
    const content = '# Titre\n\n> **En bref** : Resume sans temps de lecture.';
    expect(checkEnBref(content)).toMatch(/mal forme/);
  });
});

describe('extractNavigationLines', () => {
  it('extrait la section Navigation', () => {
    const lines = extractNavigationLines(makeFiche({ prev: VALID_PREV, next: VALID_NEXT }));
    expect(lines[0]).toBe('## Navigation');
    expect(lines.join('\n')).toContain('Fiche précédente');
  });

  it('retourne null sans section Navigation', () => {
    const content = '# Titre\n\n> **En bref** : Resume. Lecture estimee : 10 min.\n\n## Contenu';
    expect(extractNavigationLines(content)).toBeNull();
  });
});

describe('hasPrevLink / hasNextLink', () => {
  it('detecte un lien precedent au format canonique', () => {
    expect(hasPrevLink([VALID_PREV])).toBe(true);
  });

  it('accepte "Phase precedente" comme lien precedent', () => {
    expect(hasPrevLink(['← Phase précédente : **[Phase 1](../01-x/index.md)**'])).toBe(true);
  });

  it('rejette un lien precedent sans fleche unicode', () => {
    expect(hasPrevLink(['<- Fiche précédente : **[Titre](00-prec.md)**'])).toBe(false);
    expect(hasPrevLink(['- Fiche précédente : **[Titre](00-prec.md)**'])).toBe(false);
  });

  it('detecte un lien suivant au format canonique', () => {
    expect(hasNextLink([VALID_NEXT])).toBe(true);
  });

  it('rejette un lien suivant sans lien Markdown', () => {
    expect(hasNextLink(['→ Fiche suivante : **A venir**'])).toBe(false);
  });
});

describe('checkFicheStructure', () => {
  it('valide une fiche complete au milieu d\'un groupe', () => {
    const content = makeFiche({ prev: VALID_PREV, next: VALID_NEXT });
    expect(checkFicheStructure({ content })).toEqual([]);
  });

  it('signale un En bref manquant', () => {
    const content = makeFiche({ enBref: '', prev: VALID_PREV, next: VALID_NEXT });
    const errors = checkFicheStructure({ content });
    expect(errors.some((e) => /En bref/.test(e))).toBe(true);
  });

  it('signale une section Navigation manquante', () => {
    const content = [
      '---',
      'cursus: "Test"',
      '---',
      '',
      '# 01 - Titre',
      '',
      '> **En bref** : Resume. Lecture estimee : 10 min.',
      '',
      '## Contenu',
      '',
      'Texte.',
    ].join('\n');
    const errors = checkFicheStructure({ content });
    expect(errors.some((e) => /Navigation/.test(e))).toBe(true);
  });

  it('signale un lien precedent manquant pour une fiche non-frontiere', () => {
    const content = makeFiche({ next: VALID_NEXT }); // pas de prev
    const errors = checkFicheStructure({ content });
    expect(errors.some((e) => /precedente/.test(e))).toBe(true);
  });

  it('signale un lien suivant manquant pour une fiche non-frontiere', () => {
    const content = makeFiche({ prev: VALID_PREV }); // pas de next
    const errors = checkFicheStructure({ content });
    expect(errors.some((e) => /suivante/.test(e))).toBe(true);
  });

  it('tolere l\'absence de prev pour la premiere fiche du groupe', () => {
    const content = makeFiche({ next: VALID_NEXT }); // pas de prev
    expect(checkFicheStructure({ content, isFirstInGroup: true })).toEqual([]);
  });

  it('tolere l\'absence de next pour la derniere fiche du groupe', () => {
    const content = makeFiche({ prev: VALID_PREV }); // pas de next
    expect(checkFicheStructure({ content, isLastInGroup: true })).toEqual([]);
  });

  it('tolere une fiche unique (premiere ET derniere)', () => {
    const content = makeFiche({}); // ni prev ni next
    expect(checkFicheStructure({ content, isFirstInGroup: true, isLastInGroup: true })).toEqual([]);
  });
});
