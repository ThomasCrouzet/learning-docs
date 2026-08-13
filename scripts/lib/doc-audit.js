/**
 * Detecteurs purs pour l'audit documentaire unifie.
 *
 * Couvre (criteres deterministes, sans LLM) :
 *  - inventaire des pages Markdown ;
 *  - liens internes cassés (chemins .md) ;
 *  - ancres invalides (vers un heading local ou cible) ;
 *  - pages orphelines (aucune reference depuis une autre page ni la nav MkDocs) ;
 *  - entrees de navigation MkDocs pointant vers des fichiers absents ;
 *  - titres H1 manquants ou incoherents avec le nom de fichier ;
 *  - blocs de code d'ouverture sans langage ;
 *  - gaps structurels pedagogiques (prerequis, objectif, exemple, exercice/checklist) ;
 *  - formulations vagues et promesses excessives (heuristiques) ;
 *  - mentions temporelles / versions suspectes (heuristiques) ;
 *  - doublons de titre H1 dans un meme dossier.
 *
 * Les fonctions sont pures ou recoivent un filesystem injecte pour rester testables.
 */

const path = require('path');
const { isFiche, NON_CONTENT_DIRS } = require('./structure');
const { extractFrontmatter } = require('./frontmatter');

/**
 * Dossiers exclus de l'inventaire pedagogique.
 * `includes/` est conserve (glossary) ; stylesheets/javascripts/overrides/fonts exclus.
 */
const SKIP_DIRS = new Set(['overrides', 'stylesheets', 'javascripts', 'fonts', 'node_modules', '.git']);

/** Patterns de formulations vagues (heuristique, sevérité basse). */
const VAGUE_PHRASES = [
  /\bil suffit de\b/i,
  /\bévidemment\b/i,
  /\bevidemment\b/i,
  /\bcomme tu le sais (déjà )?déjà\b/i,
  /\bcomme tu le sais\b/i,
  /\bcomme vous le savez\b/i,
  /\bconfigure correctement\b/i,
  /\bc'est simple,? il suffit\b/i,
  /\btu devrais pouvoir\b/i,
  /\ben gros\b/i,
];

/** Promesses excessives / formulation trompeuse. */
const OVERPROMISE_PHRASES = [
  /\bdevenir\s+(un\s+)?expert\b/i,
  /\bdevenir\s+(un\s+)?professionnel\b/i,
  /\bexpert\s+en\s+\w+\s+en\s+\d+\s*(h|heures|jours|semaines)\b/i,
  /\bmaîtrise(?:r)?\s+compl[eè]te\b/i,
  /\bniveau\s+professionnel\s+garanti\b/i,
];

/**
 * Disclaimers qui nient explicitement une promesse d'expertise / professionnalisation.
 * Intentionnellement étroit : un simple « n'est pas » sur la même ligne ne suffit pas
 * (ex. « Ce n'est pas difficile : tu vas devenir expert » doit rester signalé).
 * Ignore le marquage Markdown d'emphase pour la détection.
 * @param {string} line
 * @returns {boolean}
 */
function isOverpromiseNegated(line) {
  const plain = String(line).replace(/\*+/g, '').replace(/_+/g, '');
  return (
    /\bpas\s+une\s+promesse\s+de\s+devenir\b/i.test(plain) ||
    /\bn['']?est\s+pas\s+une\s+promesse\b/i.test(plain) ||
    /\baucune\s+promesse\s+de\s+devenir\b/i.test(plain) ||
    /\bne\s+promet\s+pas\s+de\s+devenir\b/i.test(plain) ||
    /\bsans\s+promesse\s+de\s+devenir\b/i.test(plain) ||
    /\bne\s+constitue\s+pas\s+une\s+promesse\b/i.test(plain)
  );
}

/**
 * Mentions temporelles potentiellement perimees (annees avant 2024).
 * Ne s'applique qu'avec un contexte "actualité / version courante" (voir isTemporalStaleContext).
 */
const TEMPORAL_SUSPECT = /\b(en|depuis|jusqu'?à|avant|après)\s+(19\d{2}|20[01]\d|202[0-3])\b/i;

/**
 * Contexte historique légitime : origine d'une techno, fait daté, RFC, epoch, etc.
 * @param {string} line
 * @returns {boolean}
 */
function isTemporalHistoricalOk(line) {
  return /\b(cr[ée]{1,2}(?:e|es|é|ée|és|ées)?|lanc[ée]|fond[ée]|invent[ée]|publi[ée]|introduit|introduction|apparition|naissance|historique|chronologie|epoch|timestamp|unix|RFC\s*\d+|remplac[ée]e?\s+par|sorti[e]?\s+en|sortie\s+en|depuis\s+19\d{2}|Bitcoin\s+2009|Mt\.?\s*Gox|Genesis|bloc\s+genesis|copie(?:e)?\s+sur|vieille|ancien(?:ne)?\s+(API|objet|syntaxe)|fin\s+de\s+support|EOL|obsol[eè]te|maintenance\s+de\s+s[ée]curit[ée]|avant\s+Let.s\s+Encrypt|épuisement|IPv4)\b/i.test(
    line
  );
}

/**
 * Contexte où une date ancienne suggère une info encore présentée comme "courante".
 * @param {string} line
 * @returns {boolean}
 */
function isTemporalStaleContext(line) {
  return /\b(version\s+actuelle|actuellement|aujourd.hui|en\s+production\s+depuis|toujours\s+utilis|derni[eè]re\s+version|LTS\s+jusqu|support[ée]e?\s+jusqu|à\s+jour\s+en\s+20|recommand[ée]e?\s+en\s+20[01]|minimum\s+requis\s*:\s*20[01])\b/i.test(
    line
  );
}

/** Versions majeures souvent depassées en 2026 selon le dépôt (heuristique). */
const STALE_VERSION_PATTERNS = [
  { re: /\bPHP\s*7\.[0-4]\b/i, label: 'PHP 7.x (EOL ; référence dépôt : 8.3)' },
  { re: /\bNode\.?js\s*(1[0-6]|[89])\b/i, label: 'Node.js < 18 (référence dépôt : 22 LTS)' },
  { re: /\bSymfony\s*[345]\b/i, label: 'Symfony < 6 (référence dépôt : 7.4 LTS)' },
  { re: /\bPython\s*2\.\d/i, label: 'Python 2.x (EOL)' },
  { re: /\bPostgreSQL\s*(9|1[0-3])\b/i, label: 'PostgreSQL < 14 (référence dépôt : 16)' },
  { re: /\bdocker-compose\s+(up|down|build|ps)\b/, label: 'docker-compose (v1) ; préférer `docker compose`' },
];

/**
 * Indique si une ligne qui matche une version "stale" est en fait un contexte
 * pedagogique volontaire (avertissement, historique, comparaison).
 * @param {string} line
 * @returns {boolean}
 */
function isHistoricalContext(line) {
  return /\b(obsol[eè]te|ancienne|historique|deprecated|déprécié|deprecie|EOL|fin de support|au lieu de|n'est plus|ne crée plus|reste fonctionnelle|compatib|nécessite|nécessitait|introduite|depuis\s+(PHP|PostgreSQL|Node|Symfony)|avant\s+Symfony|Symfony\s*5\b.*\b(au lieu|ancien)|PHP\s*7\.\d\+|Node\.?js\s*\d+\+|warning|⚠️|n'utilise|interdit|éviter|eviter|différence entre|difference entre|supprime aussi|perds toutes|flag\s+`-v`|avec le flag|recommandée depuis|syntaxe SQL)\b/i.test(
    line
  );
}

/**
 * Convertit un titre Markdown en ancre de style MkDocs / Python-Markdown.
 * Approximation : minuscules, accents strippes, espaces -> tirets, retire non-alnum.
 * @param {string} title
 * @returns {string}
 */
function slugifyHeading(title) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s]+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Extrait les titres (niveau, texte, ancre) d'un contenu Markdown.
 * Ignore les titres a l'interieur de blocs de code.
 * @param {string} content
 * @returns {{ level: number, text: string, slug: string, line: number }[]}
 */
function extractHeadings(content) {
  const lines = content.split('\n');
  const headings = [];
  let inCode = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (m) {
      const text = m[2].replace(/\s+#+\s*$/, '').trim();
      headings.push({
        level: m[1].length,
        text,
        slug: slugifyHeading(text),
        line: i + 1,
      });
    }
  }
  return headings;
}

/**
 * Extrait les liens Markdown [texte](cible) hors blocs de code.
 * @param {string} content
 * @returns {{ text: string, href: string, line: number }[]}
 */
function extractMarkdownLinks(content) {
  const lines = content.split('\n');
  const links = [];
  let inCode = false;
  const re = /\[([^\]]*)\]\(([^)]+)\)/g;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(line)) !== null) {
      links.push({ text: m[1], href: m[2].trim(), line: i + 1 });
    }
  }
  return links;
}

/**
 * Extrait les balises d'ouverture de blocs de code et leur langage.
 * Respecte la longueur des clôtures (``` vs ````) pour les blocs imbriqués.
 * @param {string} content
 * @returns {{ lang: string|null, line: number, bare: boolean, fenceLen: number }[]}
 */
function extractCodeFences(content) {
  const lines = content.split('\n');
  const fences = [];
  let openLen = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^(`{3,})(.*)$/);
    if (!m) continue;
    const len = m[1].length;
    const rest = m[2].trim();
    if (openLen === 0) {
      const lang = rest === '' ? null : rest.split(/\s+/)[0];
      fences.push({ lang, line: i + 1, bare: lang === null, fenceLen: len });
      openLen = len;
    } else if (len >= openLen && rest === '') {
      openLen = 0;
    }
    // Sinon : fence intérieure plus courte (contenu d'exemple) : ignorée.
  }
  return fences;
}

/**
 * Detecte la presence de sections pedagogiques cles.
 * @param {string} content
 * @returns {object}
 */
function detectPedagogySections(content) {
  const headings = extractHeadings(content);
  const texts = headings.map((h) => h.text.toLowerCase());
  const has = (re) => texts.some((t) => re.test(t));
  const body = content;

  return {
    hasPrerequis: has(/^prérequis$|^prerequis$/i) || has(/^prérequis\b|^prerequis\b/i),
    hasObjectif: has(/^objectif/),
    hasConcepts: has(/^concepts?$/),
    hasEtapes: has(/^étapes?\s+pratiques?/) || has(/^etapes?\s+pratiques?/),
    hasExemple:
      /```[a-zA-Z]/.test(body) ||
      has(/exemple/) ||
      /\*\*exemple\b/i.test(body) ||
      // Exemple non-code : analogie travaillée, scénario, ou résultat attendu explicite.
      /\*\*Analogie concr[eè]te\*\*/i.test(body) ||
      /\*\*Résultat attendu\*\*/i.test(body) ||
      /\bexemples?\s+concrets?\b/i.test(body) ||
      /\bexemple concret\b/i.test(body),
    hasExercice: has(/^exercice/),
    hasChecklist: has(/^checklist/),
    hasNavigation: has(/^navigation$/),
    hasEnBref: /^>\s*\*\*En bref\*\*/m.test(body) || /\*\*En bref\*\*/.test(body),
    hasPieges: has(/^pi[eè]ges?/),
  };
}

/**
 * Heuristiques de formulations vagues / promesses / versions.
 * @param {string} content
 * @param {string} relPath
 * @returns {object[]} findings
 */
function detectHeuristicIssues(content, relPath) {
  const findings = [];
  const lines = content.split('\n');
  let inCode = false;
  // Skip frontmatter
  let start = 0;
  if (lines[0] === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === '---') {
        start = i + 1;
        break;
      }
    }
  }

  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    for (const re of VAGUE_PHRASES) {
      if (re.test(line)) {
        findings.push({
          category: 'vague_phrase',
          severity: 'low',
          file: relPath,
          line: i + 1,
          message: `formulation vague : "${line.trim().slice(0, 80)}"`,
        });
        break;
      }
    }
    for (const re of OVERPROMISE_PHRASES) {
      if (re.test(line) && !isOverpromiseNegated(line)) {
        findings.push({
          category: 'overpromise',
          severity: 'medium',
          file: relPath,
          line: i + 1,
          message: `promesse potentiellement excessive : "${line.trim().slice(0, 100)}"`,
        });
        break;
      }
    }
    if (TEMPORAL_SUSPECT.test(line) && !isTemporalHistoricalOk(line) && isTemporalStaleContext(line)) {
      findings.push({
        category: 'temporal_suspect',
        severity: 'low',
        file: relPath,
        line: i + 1,
        message: `mention temporelle à vérifier : "${line.trim().slice(0, 100)}"`,
      });
    }
    for (const { re, label } of STALE_VERSION_PATTERNS) {
      if (re.test(line) && !isHistoricalContext(line)) {
        findings.push({
          category: 'stale_version',
          severity: 'medium',
          file: relPath,
          line: i + 1,
          message: `${label} : "${line.trim().slice(0, 80)}"`,
        });
        break;
      }
    }
  }
  return findings;
}

/**
 * Verifie les gaps pedagogiques pour une fiche numerotee.
 * @param {string} content
 * @param {string} relPath
 * @returns {object[]}
 */
function checkPedagogyGaps(content, relPath) {
  if (!isFiche(relPath)) return [];
  // Aide-mémoires / fiches de référence : format court volontairement allégé.
  if (relPath.includes('fiches-reference/')) return [];
  const sections = detectPedagogySections(content);
  const findings = [];
  const push = (category, message) => {
    findings.push({
      category,
      severity: 'medium',
      file: relPath,
      line: null,
      message,
    });
  };

  if (!sections.hasPrerequis) push('missing_prerequis', 'section Prérequis absente');
  if (!sections.hasObjectif) push('missing_objectif', 'section Objectif absente');
  if (!sections.hasExemple) push('missing_exemple', 'aucun exemple pratique (bloc de code ou section Exemple) détecté');
  if (!sections.hasExercice && !sections.hasChecklist) {
    push('missing_validation', 'ni Exercice ni Checklist de validation détectés');
  }
  if (!sections.hasEnBref) push('missing_en_bref', 'bloc En bref absent');
  if (!sections.hasNavigation) push('missing_navigation', 'section Navigation absente');

  const headings = extractHeadings(content);
  if (!headings.some((h) => h.level === 1)) {
    push('missing_h1', 'titre H1 absent');
  }

  return findings;
}

/**
 * Resolut un href relatif par rapport au fichier source.
 * @param {string} fromRel - chemin relatif a docs/
 * @param {string} href
 * @returns {{ path: string|null, anchor: string|null, external: boolean, absolute: boolean }}
 */
function resolveHref(fromRel, href) {
  const clean = href.split(/\s+/)[0]; // strip title "..."
  if (/^(https?:|mailto:|tel:|#)/i.test(clean)) {
    if (clean.startsWith('#')) {
      return { path: fromRel, anchor: clean.slice(1), external: false, absolute: false };
    }
    return { path: null, anchor: null, external: true, absolute: false };
  }
  if (clean.startsWith('/')) {
    // Absolute from site root : treat as docs-relative without leading slash
    const stripped = clean.replace(/^\//, '');
    const [p, a] = stripped.split('#');
    return { path: p || null, anchor: a || null, external: false, absolute: true };
  }
  const [p, a] = clean.split('#');
  if (!p) {
    return { path: fromRel, anchor: a || null, external: false, absolute: false };
  }
  const fromDir = path.posix.dirname(fromRel);
  const resolved = path.posix.normalize(path.posix.join(fromDir === '.' ? '' : fromDir, p));
  return {
    path: resolved.replace(/^\.\//, ''),
    anchor: a || null,
    external: false,
    absolute: false,
  };
}

/**
 * Extrait les chemins .md references dans la nav MkDocs (YAML simplifie).
 * @param {string} mkdocsYml
 * @returns {string[]} chemins relatifs a docs/
 */
function extractMkdocsNavPaths(mkdocsYml) {
  const paths = [];
  const lines = mkdocsYml.split('\n');
  let inNav = false;
  let navIndent = 0;
  for (const line of lines) {
    if (/^nav\s*:/.test(line)) {
      inNav = true;
      navIndent = 0;
      continue;
    }
    if (inNav) {
      // fin de nav : cle top-level non indentée
      if (/^\S/.test(line) && !/^\s/.test(line) && line.trim() !== '') {
        inNav = false;
        continue;
      }
      // match ...: path.md or - path.md
      const m = line.match(/:\s*([A-Za-z0-9_./-]+\.md)\s*$/) || line.match(/-\s+([A-Za-z0-9_./-]+\.md)\s*$/);
      if (m) paths.push(m[1]);
    }
  }
  return [...new Set(paths)];
}

/**
 * Inventaire recursif des .md sous docsDir.
 * @param {string} docsDir
 * @param {(p: string) => string} readFile
 * @param {(p: string) => string[]} listDir - returns names
 * @param {(p: string) => boolean} isDir
 * @returns {string[]} chemins relatifs avec /
 */
function inventaireMarkdown(docsDir, { readFile, listDir, isDir, exists }) {
  const results = [];
  function walk(rel) {
    const full = rel ? path.join(docsDir, rel) : docsDir;
    let names;
    try {
      names = listDir(full);
    } catch {
      return;
    }
    for (const name of names) {
      if (name.startsWith('.')) continue;
      const childRel = rel ? `${rel}/${name}` : name;
      const childFull = path.join(docsDir, childRel);
      if (isDir(childFull)) {
        const base = name;
        if (SKIP_DIRS.has(base)) continue;
        walk(childRel);
      } else if (name.endsWith('.md')) {
        results.push(childRel.split(path.sep).join('/'));
      }
    }
  }
  walk('');
  return results.sort();
}

/**
 * Execute l'audit complet sur un jeu de fichiers.
 *
 * @param {object} opts
 * @param {string[]} opts.pages - chemins relatifs a docs/
 * @param {(rel: string) => string} opts.readContent
 * @param {(rel: string) => boolean} opts.fileExists
 * @param {string|null} [opts.mkdocsYml]
 * @param {object} [opts.options]
 * @returns {object} rapport structure
 */
function runDocAudit({ pages, readContent, fileExists, mkdocsYml = null, options = {} }) {
  const pageSet = new Set(pages);
  const findings = [];
  const pageStatus = {};
  const referenced = new Set();
  const h1ByDir = new Map(); // dir -> Map(h1Text -> [files])

  // Index headings par page pour validation d'ancres
  const headingsByPage = new Map();

  for (const rel of pages) {
    let content;
    try {
      content = readContent(rel);
    } catch {
      findings.push({
        category: 'unreadable',
        severity: 'high',
        file: rel,
        line: null,
        message: 'fichier illisible',
      });
      pageStatus[rel] = { audited: true, issues: 1 };
      continue;
    }

    const headings = extractHeadings(content);
    headingsByPage.set(rel, headings);

    const localFindings = [];

    // H1
    const h1s = headings.filter((h) => h.level === 1);
    if (h1s.length === 0 && isFiche(rel)) {
      localFindings.push({
        category: 'missing_h1',
        severity: 'high',
        file: rel,
        line: null,
        message: 'titre H1 absent',
      });
    } else if (h1s.length > 1) {
      localFindings.push({
        category: 'multiple_h1',
        severity: 'low',
        file: rel,
        line: h1s[1].line,
        message: `plusieurs H1 (${h1s.length})`,
      });
    }

    // Doublons H1 dans le dossier
    if (h1s[0]) {
      const dir = path.posix.dirname(rel);
      if (!h1ByDir.has(dir)) h1ByDir.set(dir, new Map());
      const map = h1ByDir.get(dir);
      const key = h1s[0].text.toLowerCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(rel);
    }

    // Code fences bare
    for (const fence of extractCodeFences(content)) {
      if (fence.bare) {
        localFindings.push({
          category: 'bare_code_fence',
          severity: 'medium',
          file: rel,
          line: fence.line,
          message: 'bloc de code sans langage',
        });
      }
    }

    // Pedagogie
    localFindings.push(...checkPedagogyGaps(content, rel));

    // Heuristiques
    if (options.heuristics !== false) {
      localFindings.push(...detectHeuristicIssues(content, rel));
    }

    // Liens internes
    for (const link of extractMarkdownLinks(content)) {
      const resolved = resolveHref(rel, link.href);
      if (resolved.external) continue;
      if (!resolved.path) continue;

      // Only check .md targets (and extensionless treated as not md)
      if (!resolved.path.endsWith('.md')) {
        // could be image or other asset : skip anchor checks for non-md
        if (fileExists(resolved.path)) {
          referenced.add(resolved.path);
        } else if (/\.(png|jpg|jpeg|gif|svg|webp|pdf)$/i.test(resolved.path)) {
          localFindings.push({
            category: 'broken_asset',
            severity: 'low',
            file: rel,
            line: link.line,
            message: `asset manquant : ${resolved.path}`,
          });
        }
        continue;
      }

      referenced.add(resolved.path);
      if (!fileExists(resolved.path) && !pageSet.has(resolved.path)) {
        localFindings.push({
          category: 'broken_internal_link',
          severity: 'high',
          file: rel,
          line: link.line,
          message: `lien interne cassé : ${link.href} -> ${resolved.path}`,
        });
        continue;
      }

      if (resolved.anchor) {
        // Validate anchor against target page headings (or self)
        const targetHeadings = headingsByPage.get(resolved.path);
        // If target not yet loaded, defer : second pass below
        if (targetHeadings) {
          const slug = slugifyHeading(decodeURIComponent(resolved.anchor));
          const ok = targetHeadings.some(
            (h) => h.slug === slug || h.slug === resolved.anchor.toLowerCase()
          );
          if (!ok) {
            localFindings.push({
              category: 'invalid_anchor',
              severity: 'medium',
              file: rel,
              line: link.line,
              message: `ancre invalide : #${resolved.anchor} dans ${resolved.path}`,
            });
          }
        }
      }
    }

    findings.push(...localFindings);
    pageStatus[rel] = {
      audited: true,
      issues: localFindings.length,
      isFiche: isFiche(rel),
    };
  }

  // Second pass : ancres vers pages chargees apres le source (already in headingsByPage)
  // Re-check deferred anchors : actually first pass only checks if target already processed.
  // Full re-scan for anchors only:
  for (const rel of pages) {
    let content;
    try {
      content = readContent(rel);
    } catch {
      continue;
    }
    for (const link of extractMarkdownLinks(content)) {
      const resolved = resolveHref(rel, link.href);
      if (resolved.external || !resolved.path || !resolved.anchor) continue;
      if (!resolved.path.endsWith('.md')) continue;
      if (!fileExists(resolved.path) && !pageSet.has(resolved.path)) continue;
      const targetHeadings = headingsByPage.get(resolved.path) || extractHeadings(readContent(resolved.path));
      const slug = slugifyHeading(decodeURIComponent(resolved.anchor));
      const ok = targetHeadings.some(
        (h) => h.slug === slug || h.slug === resolved.anchor.toLowerCase()
      );
      // Avoid duplicate findings from first pass
      if (!ok) {
        const already = findings.some(
          (f) =>
            f.category === 'invalid_anchor' &&
            f.file === rel &&
            f.line === link.line &&
            f.message.includes(resolved.anchor)
        );
        if (!already) {
          findings.push({
            category: 'invalid_anchor',
            severity: 'medium',
            file: rel,
            line: link.line,
            message: `ancre invalide : #${resolved.anchor} dans ${resolved.path}`,
          });
          pageStatus[rel].issues = (pageStatus[rel].issues || 0) + 1;
        }
      }
    }
  }

  // Doublons H1
  for (const [dir, map] of h1ByDir) {
    for (const [title, files] of map) {
      if (files.length > 1) {
        for (const f of files) {
          findings.push({
            category: 'duplicate_h1',
            severity: 'low',
            file: f,
            line: null,
            message: `titre H1 dupliqué dans ${dir}/ : "${title}" (${files.join(', ')})`,
          });
          pageStatus[f].issues = (pageStatus[f].issues || 0) + 1;
        }
      }
    }
  }

  // Navigation MkDocs
  const navMissing = [];
  const navPaths = mkdocsYml ? extractMkdocsNavPaths(mkdocsYml) : [];
  for (const p of navPaths) {
    referenced.add(p);
    if (!fileExists(p) && !pageSet.has(p)) {
      navMissing.push(p);
      findings.push({
        category: 'nav_missing_file',
        severity: 'high',
        file: 'mkdocs.yml',
        line: null,
        message: `entrée nav MkDocs absente : ${p}`,
      });
    }
  }

  // Pages orphelines : .md jamais referencees et hors nav, hors index racines utiles
  const ALWAYS_KEEP = new Set([
    'index.md',
    'tags.md',
    'parcours.md',
    'carte-cursus.md',
    'a-propos.md',
    'politique-fraicheur.md',
    'accessibility-audit.md',
    'includes/glossary.md',
    // Hub volontairement exclu de la pub MkDocs (exclude_docs) mais utile en source
    'ansible/01-ansible/index.md',
  ]);
  const orphans = [];
  for (const rel of pages) {
    if (ALWAYS_KEEP.has(rel)) continue;
    if (referenced.has(rel)) continue;
    // index.md de dossier souvent dans nav
    if (navPaths.includes(rel)) continue;
    orphans.push(rel);
    findings.push({
      category: 'orphan_page',
      severity: 'low',
      file: rel,
      line: null,
      message: 'page orpheline (aucune référence interne ni entrée nav détectée)',
    });
    if (pageStatus[rel]) {
      pageStatus[rel].issues = (pageStatus[rel].issues || 0) + 1;
    }
  }

  // Synthese
  const byCategory = {};
  for (const f of findings) {
    byCategory[f.category] = (byCategory[f.category] || 0) + 1;
  }

  const fiches = pages.filter(isFiche);
  const meta = pages.filter((p) => !isFiche(p));

  return {
    generated_at: new Date().toISOString(),
    inventory: {
      total_pages: pages.length,
      fiches: fiches.length,
      meta_pages: meta.length,
      nav_entries: navPaths.length,
    },
    controlled: {
      pages: pages.length,
      with_issues: Object.values(pageStatus).filter((s) => s.issues > 0).length,
      clean: Object.values(pageStatus).filter((s) => s.issues === 0).length,
    },
    findings_count: findings.length,
    by_category: byCategory,
    nav_missing: navMissing,
    orphans_count: orphans.length,
    confidence: {
      level: 'deterministic_heuristics',
      note:
        'Detecteurs structurels et heuristiques uniquement. Exactitude technique profonde et actualité web non garanties par cet outil.',
    },
    page_status: pageStatus,
    findings,
  };
}

/**
 * Formate un rapport Markdown compact a partir du rapport JSON.
 * @param {object} report
 * @param {object} [extra]
 * @returns {string}
 */
function formatReportMarkdown(report, extra = {}) {
  const lines = [];
  lines.push('# Rapport d\'audit documentaire');
  lines.push('');
  lines.push(`Date : ${report.generated_at}`);
  lines.push(`Niveau de confiance : ${report.confidence.level}`);
  lines.push('');
  lines.push(`> ${report.confidence.note}`);
  lines.push('');
  lines.push('## Inventaire');
  lines.push('');
  lines.push('| Métrique | Valeur |');
  lines.push('| -------- | ------ |');
  lines.push(`| Pages Markdown inventoriées | ${report.inventory.total_pages} |`);
  lines.push(`| Fiches numérotées | ${report.inventory.fiches} |`);
  lines.push(`| Pages méta / hubs | ${report.inventory.meta_pages} |`);
  lines.push(`| Entrées nav MkDocs | ${report.inventory.nav_entries} |`);
  lines.push(`| Pages contrôlées | ${report.controlled.pages} |`);
  lines.push(`| Pages sans finding | ${report.controlled.clean} |`);
  lines.push(`| Pages avec finding(s) | ${report.controlled.with_issues} |`);
  lines.push(`| Total findings | ${report.findings_count} |`);
  lines.push('');
  lines.push('## Problèmes par catégorie');
  lines.push('');
  lines.push('| Catégorie | Nombre |');
  lines.push('| --------- | ------ |');
  const cats = Object.entries(report.by_category).sort((a, b) => b[1] - a[1]);
  for (const [cat, n] of cats) {
    lines.push(`| ${cat} | ${n} |`);
  }
  if (cats.length === 0) lines.push('| (aucun) | 0 |');
  lines.push('');

  if (extra.corrections) {
    lines.push('## Corrections réalisées');
    lines.push('');
    lines.push(extra.corrections);
    lines.push('');
  }

  if (extra.remaining) {
    lines.push('## Éléments restant à vérifier');
    lines.push('');
    lines.push(extra.remaining);
    lines.push('');
  }

  // Echantillon findings hauts / moyens (cap pour lisibilite)
  const high = report.findings.filter((f) => f.severity === 'high');
  const medium = report.findings.filter((f) => f.severity === 'medium');
  lines.push('## Findings haute sévérité');
  lines.push('');
  if (high.length === 0) {
    lines.push('_Aucun._');
  } else {
    for (const f of high.slice(0, 100)) {
      lines.push(`- \`${f.file}\`${f.line ? `:${f.line}` : ''} ; ${f.message}`);
    }
    if (high.length > 100) lines.push(`- … et ${high.length - 100} autres`);
  }
  lines.push('');
  lines.push('## Findings moyenne sévérité (extrait, max 80)');
  lines.push('');
  for (const f of medium.slice(0, 80)) {
    lines.push(`- \`${f.file}\`${f.line ? `:${f.line}` : ''} ; [${f.category}] ${f.message}`);
  }
  if (medium.length > 80) lines.push(`- … et ${medium.length - 80} autres`);
  lines.push('');
  lines.push('## Couverture des pages');
  lines.push('');
  lines.push(
    `Toutes les ${report.inventory.total_pages} pages ont un statut \`audited\` automatique (structure + heuristiques). L'audit éditorial profond est journalisé séparément.`
  );
  lines.push('');
  return lines.join('\n');
}

module.exports = {
  SKIP_DIRS,
  VAGUE_PHRASES,
  OVERPROMISE_PHRASES,
  TEMPORAL_SUSPECT,
  STALE_VERSION_PATTERNS,
  isHistoricalContext,
  isTemporalHistoricalOk,
  isTemporalStaleContext,
  isOverpromiseNegated,
  slugifyHeading,
  extractHeadings,
  extractMarkdownLinks,
  extractCodeFences,
  detectPedagogySections,
  detectHeuristicIssues,
  checkPedagogyGaps,
  resolveHref,
  extractMkdocsNavPaths,
  inventaireMarkdown,
  runDocAudit,
  formatReportMarkdown,
  isFiche,
};
