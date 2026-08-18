const { isValidFilename, isValidDirname } = require('../lib/filenames');

describe('isValidFilename', () => {
  it('accepte 01-concepts-base.md', () => {
    expect(isValidFilename('01-concepts-base.md')).toBe(true);
  });

  it('accepte 12-api-design.md', () => {
    expect(isValidFilename('12-api-design.md')).toBe(true);
  });

  it('accepte 99-dernier.md', () => {
    expect(isValidFilename('99-dernier.md')).toBe(true);
  });

  it('accepte index.md (fichier special)', () => {
    expect(isValidFilename('index.md')).toBe(true);
  });

  it('accepte tags.md (fichier special)', () => {
    expect(isValidFilename('tags.md')).toBe(true);
  });

  it('accepte accessibility-audit.md (rapport a11y)', () => {
    expect(isValidFilename('accessibility-audit.md')).toBe(true);
  });

  it('rejette les majuscules', () => {
    expect(isValidFilename('01-Concepts.md')).toBe(false);
  });

  it('rejette les espaces', () => {
    expect(isValidFilename('01-concepts base.md')).toBe(false);
  });

  it('rejette sans numero', () => {
    expect(isValidFilename('concepts-base.md')).toBe(false);
  });

  it('rejette un seul chiffre', () => {
    expect(isValidFilename('1-concepts.md')).toBe(false);
  });

  it('rejette sans extension .md', () => {
    expect(isValidFilename('01-concepts.txt')).toBe(false);
  });
});

describe('isValidDirname', () => {
  it('accepte 01-docker', () => {
    expect(isValidDirname('01-docker')).toBe(true);
  });

  it('accepte 10-architecture', () => {
    expect(isValidDirname('10-architecture')).toBe(true);
  });

  it('accepte fiches-reference (exception)', () => {
    expect(isValidDirname('fiches-reference')).toBe(true);
  });

  it('accepte epitech (exception)', () => {
    expect(isValidDirname('epitech')).toBe(true);
  });

  it('accepte devops (exception)', () => {
    expect(isValidDirname('devops')).toBe(true);
  });

  it('accepte ia (exception)', () => {
    expect(isValidDirname('ia')).toBe(true);
  });

  it('accepte cybersecurite (exception)', () => {
    expect(isValidDirname('cybersecurite')).toBe(true);
  });

  it('accepte crypto-monnaies (exception)', () => {
    expect(isValidDirname('crypto-monnaies')).toBe(true);
  });

  it('accepte diagrams (figures HTML autonomes)', () => {
    expect(isValidDirname('diagrams')).toBe(true);
  });

  it('accepte BC01 (dossier special)', () => {
    expect(isValidDirname('BC01')).toBe(true);
  });

  it('accepte BC08 (dossier special)', () => {
    expect(isValidDirname('BC08')).toBe(true);
  });

  it('rejette les noms avec majuscules non-BC', () => {
    expect(isValidDirname('MonDossier')).toBe(false);
  });

  it('rejette les noms avec espaces', () => {
    expect(isValidDirname('mon dossier')).toBe(false);
  });
});
