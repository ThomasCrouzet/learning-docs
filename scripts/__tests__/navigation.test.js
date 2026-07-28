const { extractNavFiles, extractCursus, relativeLink } = require('../lib/navigation');

describe('extractNavFiles', () => {
  it('extrait un chemin direct', () => {
    const result = extractNavFiles('docker/01-concepts.md');
    expect(result).toEqual([{ title: '', path: 'docker/01-concepts.md' }]);
  });

  it('extrait un objet titre/chemin', () => {
    const result = extractNavFiles({ '01 - Concepts': 'docker/01-concepts.md' });
    expect(result).toEqual([{ title: '01 - Concepts', path: 'docker/01-concepts.md' }]);
  });

  it('ignore index.md', () => {
    const result = extractNavFiles('docker/index.md');
    expect(result).toHaveLength(0);
  });

  it('ignore tags.md', () => {
    const result = extractNavFiles('tags.md');
    expect(result).toHaveLength(0);
  });

  it('ignore les fichiers dans fiches-reference', () => {
    const result = extractNavFiles('fiches-reference/git.md');
    expect(result).toHaveLength(0);
  });

  it('gere les structures imbriquees', () => {
    const item = {
      'Docker': [
        'docker/index.md',
        { '01 - Concepts': 'docker/01-concepts.md' },
        { '02 - Install': 'docker/02-installation.md' },
      ]
    };
    const result = extractNavFiles(item);
    expect(result).toHaveLength(2);
    expect(result[0].path).toBe('docker/01-concepts.md');
    expect(result[1].path).toBe('docker/02-installation.md');
  });
});

describe('extractCursus', () => {
  it('extrait les cursus depuis une nav simple', () => {
    const nav = [
      { 'Docker': [
        { '01 - Concepts': 'docker/01-concepts.md' },
        { '02 - Install': 'docker/02-installation.md' },
      ]},
    ];
    const result = extractCursus(nav);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Docker');
    expect(result[0].files).toHaveLength(2);
  });

  it('ignore les index.md dans les fichiers', () => {
    const nav = [
      { 'Docker': [
        'docker/index.md',
        { '01 - Concepts': 'docker/01-concepts.md' },
      ]},
    ];
    const result = extractCursus(nav);
    expect(result).toHaveLength(1);
    expect(result[0].files).toHaveLength(1);
  });

  it('extrait plusieurs cursus', () => {
    const nav = [
      { 'Docker': [
        { '01 - Concepts': 'docker/01-concepts.md' },
      ]},
      { 'PHP': [
        { '01 - Syntaxe': 'php/01-syntaxe.md' },
      ]},
    ];
    const result = extractCursus(nav);
    expect(result).toHaveLength(2);
  });
});

describe('relativeLink', () => {
  it('calcule le chemin relatif dans le meme dossier', () => {
    expect(relativeLink('docker/01-concepts.md', 'docker/02-install.md')).toBe('02-install.md');
  });

  it('calcule le chemin relatif entre dossiers differents', () => {
    expect(relativeLink('docker/01-concepts.md', 'php/01-syntaxe.md')).toBe('../php/01-syntaxe.md');
  });

  it('gere les sous-dossiers', () => {
    expect(relativeLink('devops/01-podman/01-intro.md', 'devops/02-openshift/01-intro.md'))
      .toBe('../02-openshift/01-intro.md');
  });
});
