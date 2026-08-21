const fs = require('fs');
const os = require('os');
const path = require('path');
const yaml = require('js-yaml');
const { execFileSync } = require('child_process');
const {
  loadCurriculum,
  validateCatalogRelations,
  expectedMetadata,
  extractPrerequisiteLinks,
  normalizeTarget,
  findCycles,
  buildInventory,
  buildNavigation,
  buildMap,
  buildPathsPage,
  buildManifest,
  replaceGeneratedRegion,
  generateArtifacts,
  replaceNavigation,
  createState,
} = require('../lib/curriculum-v2');
const orientation = require('../../docs/javascripts/orientation-v2.js');

const ROOT = path.join(__dirname, '..', '..');

describe('catalogue et inventaire du cursus v2', () => {
  const loaded = loadCurriculum(ROOT);

  it('parse le catalogue et les parcours conformément aux schémas', () => {
    expect(loaded.errors).toEqual([]);
    expect(loaded.catalog.schema_version).toBe(2);
    expect(loaded.paths.schema_version).toBe(2);
  });

  it('garantit les identifiants uniques et les références connues', () => {
    expect(validateCatalogRelations(loaded.catalog, loaded.paths)).toEqual([]);
  });

  it('rattache chaque fiche exactement une fois avec un type et un ordre valides', () => {
    const state = createState(ROOT);
    expect(state.errors).toEqual([]);
    expect(state.inventory.records).toHaveLength(state.inventory.filePaths.length);
    expect(new Set(state.inventory.records.map((item) => item.id)).size).toBe(state.inventory.records.length);
    expect(state.inventory.records.every((item) => item.order > 0)).toBe(true);
    expect(state.inventory.records.filter((item) => item.content_type === 'project').length).toBeGreaterThan(0);
  });

  it('attribue un module parent valide lorsqu’il existe', () => {
    const frontmatter = { fiche_number: 1, tags: [] };
    expect(expectedMetadata('ia/01-fondamentaux-mathematiques/01-algebre-lineaire.md', frontmatter, loaded.catalog)).toMatchObject({
      course_id: 'ai.artificial-intelligence',
      module_id: 'ai.artificial-intelligence.math',
    });
  });
});

describe('graphe de prérequis', () => {
  it('ne lit que les liens de la section Prérequis', () => {
    const body = '# Titre\n\n## Prérequis\n\n- [Base](01-base.md)\n\n## Concepts\n\n[Connexe](02-connexe.md)';
    expect(extractPrerequisiteLinks(body)).toEqual(['01-base.md']);
  });

  it('résout un chemin relatif de façon déterministe', () => {
    expect(normalizeTarget('cours/02-suite.md', '../base/01-debut.md#ancre')).toBe('base/01-debut.md');
  });

  it('détecte un cycle direct et un cycle indirect', () => {
    expect(findCycles([{ id: 'a', requires_ids: ['a'] }])).toHaveLength(1);
    expect(findCycles([
      { id: 'a', requires_ids: ['b'] },
      { id: 'b', requires_ids: ['c'] },
      { id: 'c', requires_ids: ['a'] },
    ])).toHaveLength(1);
  });

  it('accepte une fiche sans prérequis et plusieurs chemins valides', () => {
    expect(findCycles([
      { id: 'a', requires_ids: [] },
      { id: 'b', requires_ids: ['a'] },
      { id: 'c', requires_ids: ['a'] },
      { id: 'd', requires_ids: ['b', 'c'] },
    ])).toEqual([]);
  });

  it('bloque un prérequis Markdown introuvable', () => {
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'curriculum-v2-'));
    fs.mkdirSync(path.join(temporary, 'docs', 'course'), { recursive: true });
    fs.writeFileSync(path.join(temporary, 'docs', 'course', '01-test.md'), `---\ntags: []\ndescription: Test\nestimated_time: 5 min\nfiche_number: 1\ntotal_fiches: 1\ncursus: Test\nid: test.course.test\ncourse_id: test.course\ncontent_type: lesson\norder: 1\n---\n# Test\n\n## Prérequis\n\n- [Absent](02-absent.md)\n`);
    const catalog = { courses: [{ id: 'test.course', content_root: 'course', index_path: 'course/index.md' }], modules: [] };
    const inventory = buildInventory(temporary, catalog);
    expect(inventory.errors.some((error) => error.includes('prérequis introuvable'))).toBe(true);
  });
});

describe('génération déterministe', () => {
  const state = createState(ROOT);

  it('produit la même sortie entre deux exécutions', () => {
    const first = [...generateArtifacts(ROOT, state).entries()];
    const second = [...generateArtifacts(ROOT, state).entries()];
    expect(second).toEqual(first);
  });

  it('synchronise les statistiques et le manifest', () => {
    const manifest = buildManifest(state.catalog, state.paths, state.inventory.records);
    const map = buildMap(state.catalog, state.inventory.records);
    const pathsPage = buildPathsPage(state.paths, state.catalog, state.inventory.records);
    expect(manifest.counts.fiches).toBe(state.inventory.records.length);
    expect(map).toContain(`**${manifest.counts.fiches} fiches**`);
    expect(pathsPage).toContain(`${manifest.counts.courses} cursus`);
  });

  it('préserve la configuration MkDocs hors navigation', () => {
    const source = 'site_name: Test\ntheme:\n  name: material\nnav:\n  - Ancien: old.md\n';
    const navigation = buildNavigation(state.catalog, state.inventory.records);
    const result = replaceNavigation(source, navigation);
    expect(result).toContain('site_name: Test');
    expect(result).toContain('name: material');
    expect(result).not.toContain('old.md');
  });

  it('détecte une région générée périmée sans écriture', () => {
    const source = '<!-- BEGIN GENERATED:test -->\nancien\n<!-- END GENERATED:test -->';
    expect(replaceGeneratedRegion(source, 'test', 'nouveau')).toContain('nouveau');
    expect(source).toContain('ancien');
  });

  it('exécute le mode --check sans écrire', () => {
    const target = path.join(ROOT, 'docs', 'assets', 'curriculum-v2.json');
    const before = fs.readFileSync(target, 'utf8');
    execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'generate-curriculum-v2.js'), '--check']);
    expect(fs.readFileSync(target, 'utf8')).toBe(before);
  });

  it('ne duplique aucune fiche dans la navigation', () => {
    const navigation = buildNavigation(state.catalog, state.inventory.records);
    for (const fiche of state.inventory.records) {
      expect(navigation.split(fiche.path)).toHaveLength(2);
    }
  });
});

describe('orientation locale', () => {
  function memoryStorage(initial) {
    const values = new Map(Object.entries(initial || {}));
    return { setItem: (key, value) => values.set(key, value), getItem: (key) => values.get(key) || null, removeItem: (key) => values.delete(key) };
  }

  it('fonctionne sans localStorage et tolère un JSON corrompu', () => {
    expect(orientation.loadPreferences({ setItem() { throw new Error('indisponible'); } })).toEqual({ objectiveId: '', knownCourseIds: [], knownFicheIds: [] });
    const storage = memoryStorage({ [orientation.STORAGE_KEY]: '{' });
    expect(orientation.loadPreferences(storage)).toEqual({ objectiveId: '', knownCourseIds: [], knownFicheIds: [] });
  });

  it('réinitialise les préférences locales', () => {
    const storage = memoryStorage();
    expect(orientation.savePreferences(storage, { objectiveId: 'x', knownCourseIds: [], knownFicheIds: [] })).toBe(true);
    expect(orientation.resetPreferences(storage)).toBe(true);
    expect(orientation.loadPreferences(storage).objectiveId).toBe('');
  });

  it('propose plusieurs chemins et permet de commencer malgré un prérequis', () => {
    const manifest = {
      courses: [{ id: 'a' }, { id: 'b' }],
      paths: [{ id: 'goal', entry_course_ids: ['a', 'b'], recommendations: [] }],
      fiches: [
        { id: 'a.one', course_id: 'a', order: 1, requires_ids: ['missing'], requires_course_ids: [] },
        { id: 'b.one', course_id: 'b', order: 1, requires_ids: [], requires_course_ids: [] },
      ],
    };
    const result = orientation.recommend(manifest, { objectiveId: 'goal', knownCourseIds: [], knownFicheIds: [] }, 6);
    expect(result).toHaveLength(2);
    expect(result.some((item) => item.missingIds.length === 1)).toBe(true);
  });
});
