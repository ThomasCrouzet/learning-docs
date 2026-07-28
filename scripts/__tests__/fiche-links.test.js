const { findFiche, relativePath } = require('../lib/fiche-links');

const sampleIndex = [
  { filename: '01-concepts.md', relPath: '01-docker/01-concepts.md', dir: '01-docker', num: '01', title: '01 - Concepts de base', titleLower: '01 concepts de base' },
  { filename: '02-installation.md', relPath: '01-docker/02-installation.md', dir: '01-docker', num: '02', title: '02 - Installation', titleLower: '02 installation' },
  { filename: '01-syntaxe.md', relPath: '02-php/01-syntaxe.md', dir: '02-php', num: '01', title: '01 - Syntaxe de base', titleLower: '01 syntaxe de base' },
  { filename: '07-controllers.md', relPath: '02-php/07-controllers.md', dir: '02-php', num: '07', title: '07 - Controllers', titleLower: '07 controllers' },
];

describe('findFiche', () => {
  it('trouve par numero et titre dans le meme dossier', () => {
    const result = findFiche(sampleIndex, '01 - Concepts de base', '01-docker');
    expect(result).not.toBeNull();
    expect(result.relPath).toBe('01-docker/01-concepts.md');
  });

  it('trouve par chemin dossier/numero', () => {
    const result = findFiche(sampleIndex, '02-php/07 - Controllers', '01-docker');
    expect(result).not.toBeNull();
    expect(result.relPath).toBe('02-php/07-controllers.md');
  });

  it('retourne null si non trouve', () => {
    const result = findFiche(sampleIndex, '99 - Inexistant', '01-docker');
    expect(result).toBeNull();
  });

  it('trouve par numero dans le meme dossier sans titre exact', () => {
    const result = findFiche(sampleIndex, '02 - Install Docker', '01-docker');
    expect(result).not.toBeNull();
    expect(result.num).toBe('02');
  });

  it('gere les numeros sans zero en tete', () => {
    const result = findFiche(sampleIndex, '02-php/7 - Controllers', '01-docker');
    expect(result).not.toBeNull();
    expect(result.num).toBe('07');
  });
});

describe('relativePath', () => {
  it('chemin relatif dans le meme dossier', () => {
    expect(relativePath('01-docker/01-concepts.md', '01-docker/02-install.md')).toBe('02-install.md');
  });

  it('chemin relatif entre dossiers', () => {
    expect(relativePath('01-docker/01-concepts.md', '02-php/01-syntaxe.md')).toBe('../02-php/01-syntaxe.md');
  });

  it('chemin relatif vers un sous-dossier', () => {
    expect(relativePath('devops/01-podman/01-intro.md', 'devops/02-openshift/01-intro.md'))
      .toBe('../02-openshift/01-intro.md');
  });
});
