const { extractPrereqSections, hasUnlinkedReference } = require('../lib/prereq-links');

describe('extractPrereqSections', () => {
  it('extrait une section Prerequis', () => {
    const content = '# Titre\n\n## Pr\u00e9requis\n\n- Fiche 01\n\n## Objectif';
    const sections = extractPrereqSections(content);
    expect(sections).toHaveLength(1);
    expect(sections[0].lines).toContain('- Fiche 01');
  });

  it('retourne un tableau vide sans section Prerequis', () => {
    const content = '# Titre\n\n## Objectif\n\nContenu';
    expect(extractPrereqSections(content)).toHaveLength(0);
  });

  it('s\'arrete au prochain H2', () => {
    const content = '## Pr\u00e9requis\n\n- Item 1\n- Item 2\n\n## Objectif\n\nAutre contenu';
    const sections = extractPrereqSections(content);
    expect(sections).toHaveLength(1);
    expect(sections[0].lines).not.toContain('Autre contenu');
  });

  it('gere la section Prerequis en fin de fichier', () => {
    const content = '# Titre\n\n## Pr\u00e9requis\n\n- Item 1\n- Item 2';
    const sections = extractPrereqSections(content);
    expect(sections).toHaveLength(1);
    expect(sections[0].lines).toHaveLength(4);
  });

  it('detecte "Prerequis" sans accent', () => {
    const content = '## Prerequis\n\n- Item';
    const sections = extractPrereqSections(content);
    expect(sections).toHaveLength(1);
  });
});

describe('hasUnlinkedReference', () => {
  it('detecte "Phase 1, Fiche 01" sans lien', () => {
    expect(hasUnlinkedReference('- Phase 1, Fiche 01 - Introduction')).toBe(true);
  });

  it('ne detecte pas si un lien Markdown est present', () => {
    expect(hasUnlinkedReference('- [Phase 1, Fiche 01](../01-docker/01-intro.md)')).toBe(false);
  });

  it('detecte les chemins nus entre parentheses', () => {
    expect(hasUnlinkedReference('- Voir le cursus Docker (`01-docker/`)')).toBe(true);
  });

  it('ne detecte pas les lignes vides', () => {
    expect(hasUnlinkedReference('')).toBe(false);
  });

  it('ne detecte pas les titres H2', () => {
    expect(hasUnlinkedReference('## Pr\u00e9requis')).toBe(false);
  });

  it('ne detecte pas une ligne de texte normale', () => {
    expect(hasUnlinkedReference('- Aucune connaissance pr\u00e9alable requise')).toBe(false);
  });

  it('detecte "Phase 1 - Titre" comme puce prerequis', () => {
    expect(hasUnlinkedReference('  - Phase 1 - Introduction au Docker')).toBe(true);
  });
});
