const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv2020 = require('ajv/dist/2020');
const { extractFrontmatter } = require('./frontmatter');
const { isFiche } = require('./structure');

const CONTENT_TYPES = new Set(['lesson', 'lab', 'project', 'review', 'reference']);
const GENERATED_HEADER = '<!-- Généré depuis curriculum/catalog.yml et curriculum/paths.yml. Ne pas modifier directement. -->';

function listMarkdownFiles(directory, base = directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (['includes', 'javascripts', 'stylesheets', 'overrides', 'fonts', 'assets', 'diagrams'].includes(entry.name)) continue;
      files.push(...listMarkdownFiles(absolute, base));
    } else if (entry.name.endsWith('.md')) {
      files.push(path.relative(base, absolute).replace(/\\/g, '/'));
    }
  }
  return files.sort((a, b) => a.localeCompare(b, 'fr'));
}

function loadYaml(filePath) {
  return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

function validateSchema(data, schema, label) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  if (validate(data)) return [];
  return validate.errors.map((error) => `${label}${error.instancePath || '/'} ${error.message}`);
}

function loadCurriculum(root) {
  const catalogPath = path.join(root, 'curriculum', 'catalog.yml');
  const pathsPath = path.join(root, 'curriculum', 'paths.yml');
  const catalog = loadYaml(catalogPath);
  const paths = loadYaml(pathsPath);
  const catalogSchema = JSON.parse(fs.readFileSync(path.join(root, 'curriculum', 'schemas', 'catalog.schema.json'), 'utf8'));
  const pathsSchema = JSON.parse(fs.readFileSync(path.join(root, 'curriculum', 'schemas', 'paths.schema.json'), 'utf8'));
  const errors = [
    ...validateSchema(catalog, catalogSchema, 'catalogue'),
    ...validateSchema(paths, pathsSchema, 'parcours'),
  ];
  return { catalog, paths, errors };
}

function assertUnique(items, kind, errors, globalIds) {
  const local = new Set();
  for (const item of items) {
    if (local.has(item.id)) errors.push(`${kind}: identifiant dupliqué ${item.id}`);
    if (globalIds.has(item.id)) errors.push(`identifiant partagé entre types: ${item.id}`);
    local.add(item.id);
    globalIds.add(item.id);
  }
}

function validateCatalogRelations(catalog, paths) {
  const errors = [];
  const globalIds = new Set();
  assertUnique(catalog.domains, 'domaine', errors, globalIds);
  assertUnique(catalog.courses, 'cursus', errors, globalIds);
  assertUnique(catalog.modules, 'module', errors, globalIds);
  assertUnique(catalog.collections, 'collection', errors, globalIds);
  assertUnique(paths.paths, 'parcours', errors, globalIds);
  const domainIds = new Set(catalog.domains.map((item) => item.id));
  const courseIds = new Set(catalog.courses.map((item) => item.id));
  for (const course of catalog.courses) {
    if (!domainIds.has(course.domain_id)) errors.push(`${course.id}: domaine inconnu ${course.domain_id}`);
    for (const requirement of course.requires) {
      if (!courseIds.has(requirement)) errors.push(`${course.id}: cursus requis inconnu ${requirement}`);
      if (requirement === course.id) errors.push(`${course.id}: auto-dépendance interdite`);
    }
  }
  for (const module of catalog.modules) {
    if (!courseIds.has(module.course_id)) errors.push(`${module.id}: cursus parent inconnu ${module.course_id}`);
  }
  for (const collection of catalog.collections) {
    for (const courseId of collection.course_ids) if (!courseIds.has(courseId)) errors.push(`${collection.id}: cursus inconnu ${courseId}`);
  }
  for (const curriculumPath of paths.paths) {
    const referenced = [
      ...curriculumPath.entry_course_ids,
      ...curriculumPath.recommendations.flatMap((item) => item.course_ids),
    ];
    for (const courseId of referenced) if (!courseIds.has(courseId)) errors.push(`${curriculumPath.id}: cursus inconnu ${courseId}`);
  }
  const courseCycles = findCycles(catalog.courses.map((course) => ({ id: course.id, requires_ids: course.requires })));
  for (const cycle of courseCycles) errors.push(`cycle entre cursus: ${cycle.join(' -> ')}`);
  for (const list of [catalog.domains, catalog.courses, catalog.modules, catalog.collections, paths.paths]) {
    const orders = new Set();
    for (const item of list) {
      const key = `${item.domain_id || item.course_id || 'root'}:${item.order}`;
      if (orders.has(key) && item.order !== undefined) errors.push(`ordre dupliqué ${key}`);
      orders.add(key);
    }
  }
  return errors;
}

function matchParent(filePath, catalog) {
  const modules = [...catalog.modules].sort((a, b) => b.content_root.length - a.content_root.length);
  const module = modules.find((item) => filePath.startsWith(`${item.content_root}/`));
  if (module) return { course: catalog.courses.find((item) => item.id === module.course_id), module };
  const courses = [...catalog.courses].sort((a, b) => b.content_root.length - a.content_root.length);
  const course = courses.find((item) => filePath.startsWith(`${item.content_root}/`));
  return course ? { course, module: null } : null;
}

function slugFromPath(filePath) {
  return path.basename(filePath, '.md').replace(/^\d{2}-/, '').replace(/[^a-z0-9-]/g, '-');
}

function inferContentType(filePath, frontmatter) {
  const basename = path.basename(filePath, '.md').toLowerCase();
  const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map((tag) => String(tag).toLowerCase()) : [];
  if (filePath.includes('fiches-reference') || tags.includes('référence')) return 'reference';
  if (/projet-integrateur|fil-rouge/.test(basename) || filePath.startsWith('fondamentaux/06-projets/')) return 'project';
  if (/atelier|laboratoire|\blab\b|exercice-guide/.test(basename)) return 'lab';
  if (/revision|revue|quiz|evaluation|auto-evaluation/.test(basename)) return 'review';
  return 'lesson';
}

function expectedMetadata(filePath, frontmatter, catalog) {
  const parent = matchParent(filePath, catalog);
  if (!parent) return null;
  const prefix = parent.module ? parent.module.id : parent.course.id;
  return {
    id: `${prefix}.${slugFromPath(filePath)}`,
    course_id: parent.course.id,
    ...(parent.module ? { module_id: parent.module.id } : {}),
    content_type: inferContentType(filePath, frontmatter),
    order: Number(frontmatter.fiche_number),
  };
}

function extractTitle(content, filePath) {
  const match = content.match(/^#\s+(.+)$/m);
  return (match ? match[1] : path.basename(filePath, '.md')).replace(/^\d+\s*-\s*/, '').trim();
}

function prerequisiteSection(content) {
  const match = content.match(/^## Prérequis\s*$\n([\s\S]*?)(?=^## |^---\s*$|$(?![\s\S]))/m);
  return match ? match[1] : '';
}

function extractPrerequisiteLinks(content) {
  const section = prerequisiteSection(content);
  return [...section.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
}

function normalizeTarget(sourcePath, rawLink) {
  const clean = rawLink.split('#')[0].split('?')[0];
  if (!clean || /^[a-z][a-z0-9+.-]*:/i.test(clean)) return null;
  return path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), decodeURI(clean)));
}

function findCycles(records) {
  const graph = new Map(records.map((record) => [record.id, record.requires_ids]));
  const state = new Map();
  const stack = [];
  const cycles = [];
  function visit(id) {
    state.set(id, 1);
    stack.push(id);
    for (const requirement of graph.get(id) || []) {
      if (!state.has(requirement)) visit(requirement);
      else if (state.get(requirement) === 1) cycles.push([...stack.slice(stack.indexOf(requirement)), requirement]);
    }
    stack.pop();
    state.set(id, 2);
  }
  for (const id of graph.keys()) if (!state.has(id)) visit(id);
  return cycles;
}

function buildInventory(root, catalog) {
  const docs = path.join(root, 'docs');
  const filePaths = listMarkdownFiles(docs).filter(isFiche);
  const errors = [];
  const records = [];
  const pathToId = new Map();
  const indexToCourseId = new Map();
  for (const course of catalog.courses) {
    indexToCourseId.set(course.index_path, course.id);
    indexToCourseId.set(`${course.content_root}/index.md`, course.id);
  }
  for (const module of catalog.modules) indexToCourseId.set(`${module.content_root}/index.md`, module.course_id);
  for (const filePath of filePaths) {
    const content = fs.readFileSync(path.join(docs, filePath), 'utf8');
    const frontmatter = extractFrontmatter(content) || {};
    const expected = expectedMetadata(filePath, frontmatter, catalog);
    if (!expected) {
      errors.push(`${filePath}: aucun cursus canonique`);
      continue;
    }
    for (const [key, value] of Object.entries(expected)) {
      if (frontmatter[key] !== value) errors.push(`${filePath}: ${key} attendu ${value}, obtenu ${frontmatter[key]}`);
    }
    if (!CONTENT_TYPES.has(frontmatter.content_type)) errors.push(`${filePath}: type de contenu invalide ${frontmatter.content_type}`);
    const record = {
      ...expected,
      title: extractTitle(content, filePath),
      path: filePath,
      href: filePath.replace(/index\.md$/, '').replace(/\.md$/, '/'),
      description: String(frontmatter.description || ''),
      estimated_time: String(frontmatter.estimated_time || ''),
      requires_ids: [],
      requires_course_ids: [],
      available_next_ids: [],
    };
    records.push(record);
    if (record.content_type === 'project' && !content.includes('**Projet facultatif**')) {
      errors.push(`${filePath}: un projet doit annoncer explicitement son caractère facultatif`);
    }
    if (pathToId.has(filePath)) errors.push(`${filePath}: fiche dupliquée`);
    pathToId.set(filePath, record.id);
  }
  const ids = new Set();
  for (const record of records) {
    if (ids.has(record.id)) errors.push(`identifiant de fiche dupliqué ${record.id}`);
    ids.add(record.id);
  }
  for (const record of records) {
    const content = fs.readFileSync(path.join(docs, record.path), 'utf8');
    for (const rawLink of extractPrerequisiteLinks(content)) {
      const target = normalizeTarget(record.path, rawLink);
      if (!target) continue;
      if (pathToId.has(target)) record.requires_ids.push(pathToId.get(target));
      else if (indexToCourseId.has(target)) record.requires_course_ids.push(indexToCourseId.get(target));
      else errors.push(`${record.path}: prérequis introuvable ${rawLink}`);
    }
    record.requires_ids = [...new Set(record.requires_ids)].sort();
    const canonicalCourse = catalog.courses.find((course) => course.id === record.course_id);
    record.requires_course_ids.push(...(canonicalCourse.requires || []));
    record.requires_course_ids = [...new Set(record.requires_course_ids)].sort();
  }
  const cycles = findCycles(records);
  for (const cycle of cycles) errors.push(`cycle de prérequis: ${cycle.join(' -> ')}`);
  const byId = new Map(records.map((record) => [record.id, record]));
  for (const record of records) {
    for (const requirement of record.requires_ids) byId.get(requirement).available_next_ids.push(record.id);
  }
  for (const record of records) record.available_next_ids.sort();
  records.sort((a, b) => a.course_id.localeCompare(b.course_id) || (a.module_id || '').localeCompare(b.module_id || '') || a.order - b.order || a.id.localeCompare(b.id));
  return { filePaths, records, errors, cycles };
}

function quoteYaml(value) {
  return JSON.stringify(String(value));
}

function buildNavigation(catalog, records) {
  const lines = [
    '# BEGIN CURRICULUM V2 NAV',
    '# Généré depuis curriculum/catalog.yml et le frontmatter des fiches.',
    'nav:',
    '  - Accueil: index.md',
    '  - Orientation: parcours.md',
  ];
  const byCourse = new Map(catalog.courses.map((course) => [course.id, records.filter((record) => record.course_id === course.id)]));
  const domains = [...catalog.domains].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
  for (const domain of domains) {
    lines.push(`  - ${quoteYaml(domain.title)}:`);
    if (domain.index_path) lines.push(`      - ${domain.index_path}`);
    const courses = catalog.courses.filter((course) => course.domain_id === domain.id).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
    for (const course of courses) {
      lines.push(`      - ${quoteYaml(course.title)}:`);
      if (course.index_path !== domain.index_path) lines.push(`          - ${course.index_path}`);
      const modules = catalog.modules.filter((module) => module.course_id === course.id).sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
      if (modules.length) {
        for (const module of modules) {
          lines.push(`          - ${quoteYaml(module.title)}:`);
          lines.push(`              - ${module.content_root}/index.md`);
          for (const record of byCourse.get(course.id).filter((item) => item.module_id === module.id)) lines.push(`              - ${quoteYaml(record.title)}: ${record.path}`);
        }
      } else {
        for (const record of byCourse.get(course.id)) lines.push(`          - ${quoteYaml(record.title)}: ${record.path}`);
      }
    }
    if (domain.id === 'references') {
      lines.push('      - "À propos": a-propos.md');
      lines.push('      - "Politique de fraîcheur": politique-fraicheur.md');
      lines.push('      - "Audit d’accessibilité": accessibility-audit.md');
      lines.push('      - "Carte des cursus": carte-cursus.md');
    }
  }
  lines.push('# END CURRICULUM V2 NAV', '');
  return lines.join('\n');
}

function buildMap(catalog, records) {
  const lines = [
    '---',
    'hide:',
    '  - navigation',
    '  - toc',
    `description: "Vue d’ensemble des ${records.length} fiches réparties dans ${catalog.courses.length} cursus."`,
    '---',
    '',
    GENERATED_HEADER,
    '',
    '# Carte des cursus',
    '',
    `> **En bref** : Cette carte présente ${catalog.courses.length} cursus et ${records.length} fiches sans compter les modules comme des cursus.`,
    '',
    `**${records.length} fiches**, **${catalog.courses.length} cursus**, **${catalog.modules.length} modules** et **${catalog.domains.length} domaines**.`,
    '',
    'Un module organise une partie d’un cursus long. Une collection regroupe des contenus sans devenir un cursus.',
    '',
    '## Dépendances entre cursus',
    '',
    '<div class="diagram-design">',
    '<p><a href="../diagrams/carte-cursus-1.html">Dépendances entre cursus (HTML + SVG)</a></p>',
    '<iframe src="../diagrams/carte-cursus-1.html" title="Dépendances entre cursus" style="width:100%;min-height:676px;border:0;background:transparent"></iframe>',
    '</div>',
    '',
  ];
  for (const domain of [...catalog.domains].sort((a, b) => a.order - b.order)) {
    lines.push(`## ${domain.title}`, '', '| Cursus | Fiches | Modules | Entrée |', '| ------ | -----: | ------: | ------ |');
    for (const course of catalog.courses.filter((item) => item.domain_id === domain.id).sort((a, b) => a.order - b.order)) {
      const count = records.filter((record) => record.course_id === course.id).length;
      const moduleCount = catalog.modules.filter((module) => module.course_id === course.id).length;
      lines.push(`| **[${course.title}](${course.index_path})** | ${count} | ${moduleCount || '-'} | ${course.requires.length ? 'Bases recommandées' : 'Accès direct'} |`);
    }
    lines.push('');
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

function buildPathsPage(paths, catalog, records) {
  const courseById = new Map(catalog.courses.map((course) => [course.id, course]));
  const lines = [
    '---',
    'hide:',
    '  - toc',
    'description: "Orientation facultative selon un objectif et les contenus déjà connus."',
    '---',
    '',
    GENERATED_HEADER,
    '',
    '# Choisir une prochaine étape',
    '',
    '> **En bref** : Choisis facultativement un objectif et indique ce que tu connais déjà. Tu peux toujours ignorer une recommandation et explorer librement.',
    '',
    'Aucun parcours n’est obligatoire. Il ne représente ni un diplôme, ni une preuve de niveau, ni un projet à terminer.',
    '',
    '<div id="curriculum-orientation" class="curriculum-orientation" data-manifest="../assets/curriculum-v2.json">',
    '<p>Chargement de l’orientation locale...</p>',
    '<p><a href="../carte-cursus/">Explorer librement</a></p>',
    '</div>',
    '',
    '## Deux manières de commencer',
    '',
    '- Si tu débutes avec les fichiers, le terminal et l’éditeur, commence par [Débuter de zéro](commencer/index.md), puis consulte Unix/Bash, Git et HTML/CSS.',
    '- Si tu connais déjà ces bases, choisis directement un domaine ou utilise l’outil ci-dessus.',
    '',
    '## Parcours facultatifs',
    '',
  ];
  for (const curriculumPath of paths.paths) {
    lines.push(`### ${curriculumPath.title}`, '', curriculumPath.objective, '', '**Points d’entrée possibles** :', '');
    for (const courseId of curriculumPath.entry_course_ids) {
      const course = courseById.get(courseId);
      lines.push(`- [${course.title}](${course.index_path})`);
    }
    lines.push('', 'Tu peux sauter un contenu déjà connu, commencer malgré un prérequis recommandé ou revenir à l’exploration libre.', '');
  }
  lines.push('## Repères', '', `Le catalogue comprend ${catalog.domains.length} domaines, ${catalog.courses.length} cursus, ${catalog.modules.length} modules et ${records.length} fiches. Ces nombres sont générés depuis les sources canoniques.`, '');
  return `${lines.join('\n').trimEnd()}\n`;
}

function buildManifest(catalog, paths, records) {
  return {
    schema_version: 2,
    counts: { domains: catalog.domains.length, courses: catalog.courses.length, modules: catalog.modules.length, paths: paths.paths.length, fiches: records.length },
    domains: catalog.domains,
    courses: catalog.courses,
    modules: catalog.modules,
    collections: catalog.collections,
    paths: paths.paths,
    fiches: records,
  };
}

function replaceGeneratedRegion(content, name, replacement) {
  const start = `<!-- BEGIN GENERATED:${name} -->`;
  const end = `<!-- END GENERATED:${name} -->`;
  const expression = new RegExp(`${start}[\\s\\S]*?${end}`);
  if (!expression.test(content)) throw new Error(`région générée absente: ${name}`);
  return content.replace(expression, `${start}\n${replacement}\n${end}`);
}

function generateArtifacts(root, state) {
  const { catalog, paths, inventory } = state;
  const manifest = buildManifest(catalog, paths, inventory.records);
  const readmePath = path.join(root, 'README.md');
  const indexPath = path.join(root, 'docs', 'index.md');
  const stats = `| Métrique | Valeur |\n| -------- | -----: |\n| Fiches pédagogiques | **${inventory.records.length}** |\n| Cursus | **${catalog.courses.length}** |\n| Modules | **${catalog.modules.length}** |\n| Domaines | **${catalog.domains.length}** |`;
  return new Map([
    [path.join(root, 'docs', 'assets', 'curriculum-v2.json'), `${JSON.stringify(manifest, null, 2)}\n`],
    [path.join(root, 'docs', 'carte-cursus.md'), buildMap(catalog, inventory.records)],
    [path.join(root, 'docs', 'parcours.md'), buildPathsPage(paths, catalog, inventory.records)],
    [readmePath, replaceGeneratedRegion(fs.readFileSync(readmePath, 'utf8'), 'curriculum-stats', stats)],
    [indexPath, replaceGeneratedRegion(fs.readFileSync(indexPath, 'utf8'), 'curriculum-stats', `<p class="home-stats">${inventory.records.length} fiches · ${catalog.courses.length} cursus · ${catalog.modules.length} modules · ${catalog.domains.length} domaines</p>`)],
  ]);
}

function replaceNavigation(mkdocsContent, navigation) {
  const marked = /# BEGIN CURRICULUM V2 NAV[\s\S]*?# END CURRICULUM V2 NAV\n?/;
  if (marked.test(mkdocsContent)) return mkdocsContent.replace(marked, navigation);
  const navStart = mkdocsContent.search(/^nav:\s*$/m);
  if (navStart === -1) throw new Error('section nav absente de mkdocs.yml');
  return `${mkdocsContent.slice(0, navStart)}${navigation}`;
}

function createState(root) {
  const loaded = loadCurriculum(root);
  const relationErrors = validateCatalogRelations(loaded.catalog, loaded.paths);
  const inventory = buildInventory(root, loaded.catalog);
  return { ...loaded, inventory, errors: [...loaded.errors, ...relationErrors, ...inventory.errors] };
}

module.exports = {
  CONTENT_TYPES,
  GENERATED_HEADER,
  listMarkdownFiles,
  loadCurriculum,
  validateCatalogRelations,
  matchParent,
  inferContentType,
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
};
