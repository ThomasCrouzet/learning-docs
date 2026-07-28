const { extractFrontmatter, validateFields, isExcluded } = require('../lib/frontmatter');

describe('extractFrontmatter', () => {
  it('extrait un frontmatter YAML valide', () => {
    const content = '---\ntags:\n  - Docker\ndescription: "Test"\n---\n\n# Titre';
    const fm = extractFrontmatter(content);
    expect(fm).toEqual({ tags: ['Docker'], description: 'Test' });
  });

  it('retourne null sans frontmatter', () => {
    expect(extractFrontmatter('# Titre\n\nContenu')).toBeNull();
  });

  it('retourne null pour un YAML invalide', () => {
    const content = '---\n: invalid: [\n---\n';
    expect(extractFrontmatter(content)).toBeNull();
  });

  it('gere les tags comme tableau', () => {
    const content = '---\ntags:\n  - PHP\n  - Symfony\n---\n';
    const fm = extractFrontmatter(content);
    expect(fm.tags).toEqual(['PHP', 'Symfony']);
  });

  it('gere le frontmatter complet', () => {
    const content = '---\ntags:\n  - Docker\ndescription: "Desc"\nestimated_time: "15 min"\nfiche_number: 1\ntotal_fiches: 3\ncursus: "Docker"\n---\n';
    const fm = extractFrontmatter(content);
    expect(fm.fiche_number).toBe(1);
    expect(fm.total_fiches).toBe(3);
    expect(fm.cursus).toBe('Docker');
  });
});

describe('validateFields', () => {
  it('retourne un tableau vide avec tous les champs requis', () => {
    const fm = {
      tags: ['Docker'],
      description: 'Test',
      estimated_time: '15 min',
      fiche_number: 1,
      total_fiches: 3,
      cursus: 'Docker',
    };
    expect(validateFields(fm, 'test.md')).toEqual([]);
  });

  it('echoue si un champ manque', () => {
    const fm = {
      tags: ['Docker'],
      description: 'Test',
      // estimated_time manquant
      fiche_number: 1,
      total_fiches: 3,
      cursus: 'Docker',
    };
    const errors = validateFields(fm, 'test.md');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('estimated_time');
  });

  it('echoue si un champ est vide', () => {
    const fm = {
      tags: ['Docker'],
      description: '',
      estimated_time: '15 min',
      fiche_number: 1,
      total_fiches: 3,
      cursus: 'Docker',
    };
    const errors = validateFields(fm, 'test.md');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('description');
  });

  it('echoue si un champ est null', () => {
    const fm = {
      tags: ['Docker'],
      description: 'Test',
      estimated_time: null,
      fiche_number: 1,
      total_fiches: 3,
      cursus: 'Docker',
    };
    const errors = validateFields(fm, 'test.md');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('estimated_time');
  });

  it('echoue si tags n\'est pas un tableau', () => {
    const fm = {
      tags: 'Docker',
      description: 'Test',
      estimated_time: '15 min',
      fiche_number: 1,
      total_fiches: 3,
      cursus: 'Docker',
    };
    const errors = validateFields(fm, 'test.md');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('tableau');
  });

  it('retourne une erreur si frontmatter est null', () => {
    const errors = validateFields(null, 'test.md');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('manquant');
  });
});

describe('isExcluded', () => {
  it('exclut index.md', () => {
    expect(isExcluded('01-docker/index.md')).toBe(true);
  });

  it('exclut tags.md', () => {
    expect(isExcluded('tags.md')).toBe(true);
  });

  it('exclut carte-cursus.md', () => {
    expect(isExcluded('carte-cursus.md')).toBe(true);
  });

  it('n\'exclut pas une fiche normale', () => {
    expect(isExcluded('01-docker/01-concepts-base.md')).toBe(false);
  });

  it('n\'exclut pas un fichier contenant index dans le nom', () => {
    expect(isExcluded('01-docker/01-index-avance.md')).toBe(false);
  });
});
