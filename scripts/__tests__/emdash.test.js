const { countEmDashes, fixEmDashes } = require('../lib/emdash');

describe('countEmDashes', () => {
  it('retourne 0 quand le texte ne contient pas d\'em dash', () => {
    expect(countEmDashes('Texte normal avec des tirets - simples')).toBe(0);
  });

  it('compte un seul em dash', () => {
    expect(countEmDashes('Texte \u2014 avec em dash')).toBe(1);
  });

  it('compte plusieurs em dashes', () => {
    expect(countEmDashes('A \u2014 B \u2014 C \u2014 D')).toBe(3);
  });

  it('retourne 0 pour une chaine vide', () => {
    expect(countEmDashes('')).toBe(0);
  });

  it('ne compte pas les tirets simples ni les en dashes', () => {
    expect(countEmDashes('a - b -- c \u2013 d')).toBe(0);
  });
});

describe('fixEmDashes', () => {
  it('remplace un em dash par un tiret simple', () => {
    expect(fixEmDashes('Texte \u2014 corrige')).toBe('Texte - corrige');
  });

  it('remplace plusieurs em dashes', () => {
    expect(fixEmDashes('A \u2014 B \u2014 C')).toBe('A - B - C');
  });

  it('ne modifie pas un texte sans em dash', () => {
    const texte = 'Texte normal sans em dash';
    expect(fixEmDashes(texte)).toBe(texte);
  });

  it('preserve le reste du contenu', () => {
    const input = '# Titre\n\nTexte \u2014 avec em dash\n\n```bash\ncommande\n```';
    const expected = '# Titre\n\nTexte - avec em dash\n\n```bash\ncommande\n```';
    expect(fixEmDashes(input)).toBe(expected);
  });
});
