const { getEstimatedTime, getObjectif, hasEnBref, buildEnBrefBlockquote } = require('../lib/en-bref');

describe('getEstimatedTime', () => {
  it('extrait le temps avec guillemets', () => {
    const content = '---\nestimated_time: "15 min"\n---\n# Titre';
    expect(getEstimatedTime(content)).toBe('15 min');
  });

  it('extrait le temps sans guillemets', () => {
    const content = '---\nestimated_time: 20 min\n---\n# Titre';
    expect(getEstimatedTime(content)).toBe('20 min');
  });

  it('retourne null sans frontmatter', () => {
    expect(getEstimatedTime('# Titre\n\nContenu')).toBeNull();
  });

  it('retourne null si le champ est absent', () => {
    const content = '---\ntags:\n  - Docker\n---\n# Titre';
    expect(getEstimatedTime(content)).toBeNull();
  });
});

describe('getObjectif', () => {
  it('extrait un objectif simple', () => {
    const body = '\n## Objectif de cette fiche\n\nTu sauras creer des tests.\n\n## Concepts\n';
    expect(getObjectif(body)).toBe('Tu sauras creer des tests.');
  });

  it('fusionne une liste a puces en phrase', () => {
    const body = '\n## Objectif de cette fiche\n\nTu sauras :\n\n- Creer des fichiers\n- Lire des donnees\n- Ecrire des tests\n\n## Concepts\n';
    const result = getObjectif(body);
    expect(result).toContain('creer des fichiers');
    expect(result).toContain(' et ');
  });

  it('nettoie le Markdown inline', () => {
    const body = '\n## Objectif de cette fiche\n\nTu sauras utiliser **Docker** avec `docker run`.\n\n## Concepts\n';
    const result = getObjectif(body);
    expect(result).not.toContain('**');
    expect(result).not.toContain('`');
  });

  it('retourne null sans section Objectif', () => {
    const body = '\n## Concepts\n\nContenu\n\n## Etapes\n';
    expect(getObjectif(body)).toBeNull();
  });

  it('gere la section "## Objectif" sans "de cette fiche"', () => {
    const body = '\n## Objectif\n\nComprendre les conteneurs.\n\n## Concepts\n';
    expect(getObjectif(body)).toBe('Comprendre les conteneurs.');
  });
});

describe('hasEnBref', () => {
  it('detecte un blockquote En bref existant', () => {
    const content = '# Titre\n\n> **En bref** : Resume. Lecture estimee : 15 min.';
    expect(hasEnBref(content)).toBe(true);
  });

  it('retourne false sans En bref', () => {
    const content = '# Titre\n\n## Prerequis\n\nAucun';
    expect(hasEnBref(content)).toBe(false);
  });
});

describe('buildEnBrefBlockquote', () => {
  it('construit le blockquote avec temps', () => {
    const result = buildEnBrefBlockquote('Tu sauras creer des tests', '15 min');
    expect(result).toBe('> **En bref** : Tu sauras creer des tests. Lecture estim\u00e9e : 15 min.');
  });

  it('construit le blockquote sans temps', () => {
    const result = buildEnBrefBlockquote('Tu sauras creer des tests', null);
    expect(result).toBe('> **En bref** : Tu sauras creer des tests.');
  });

  it('ne double pas le point final', () => {
    const result = buildEnBrefBlockquote('Tu sauras creer des tests.', '15 min');
    expect(result).not.toContain('.. ');
  });
});
