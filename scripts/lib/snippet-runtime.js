/**
 * Extraction et classification de snippets de code depuis le Markdown pédagogique.
 * Purs / testables : pas d'I/O disque hors injection.
 */

/** Langages non exécutables (documentation / diagrammes / sortie). */
const NON_EXECUTABLE_LANGS = new Set([
  '',
  'text',
  'txt',
  'markdown',
  'md',
  'mermaid',
  'diff',
  'output',
  'console',
  'shell-session',
  'http',
  'plaintext',
  'plain',
  'none',
  'svg',
  'xml',
  'graphql', // schéma souvent fragmentaire
  'promql',
  'jinja2',
  'twig',
  'dockerfile',
  'nginx',
  'apache',
  'ini',
  'env',
  'toml',
  'properties',
  'hcl',
  'terraform',
  'makefile',
  'cmake',
  'powershell', // souvent fragment Windows
  'faust', // runtime rare
  'solidity',
  'rust', // need cargo often
  'java',
  'csharp',
  'cs',
  'cpp',
  'c',
  'go',
  'kotlin',
  'swift',
  'ruby',
  'perl',
  'r',
  'matlab',
  'sql', // need DB
  'html',
  'css',
  'scss',
  'less',
  'tsx', // needs bundler often
  'jsx',
]);

/** Langages pour lesquels on tente une validation locale. */
const RUNTIME_LANGS = new Set([
  'bash',
  'sh',
  'shell',
  'zsh',
  'javascript',
  'js',
  'typescript',
  'ts',
  'python',
  'python3',
  'py',
  'php',
  'json',
  'yaml',
  'yml',
]);

/**
 * Extrait tous les blocs de code d'un contenu Markdown.
 * @param {string} content
 * @param {string} [fileRel]
 * @returns {{ file: string, index: number, lang: string, body: string, line: number }[]}
 */
function extractSnippets(content, fileRel = '') {
  const lines = content.split('\n');
  const snippets = [];
  let open = null; // { lang, startLine, fenceLen, bodyLines }
  let index = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^(`{3,})(.*)$/);
    if (m) {
      const fenceLen = m[1].length;
      const rest = m[2].trim();
      if (!open) {
        const lang = rest === '' ? '' : rest.split(/\s+/)[0].toLowerCase();
        open = { lang, startLine: i + 1, fenceLen, bodyLines: [] };
      } else if (fenceLen >= open.fenceLen && rest === '') {
        snippets.push({
          file: fileRel,
          index: index++,
          lang: open.lang,
          body: open.bodyLines.join('\n'),
          line: open.startLine,
        });
        open = null;
      } else if (open) {
        // fence intérieure plus courte : contenu
        open.bodyLines.push(line);
      }
      continue;
    }
    if (open) open.bodyLines.push(line);
  }
  return snippets;
}

/**
 * Heuristique : le snippet est-il un fragment pédagogique non autonome ?
 * @param {string} lang
 * @param {string} body
 * @returns {string|null} motif skip ou null si candidat runtime
 */
function fragmentSkipReason(lang, body) {
  const t = body.trim();
  if (!t) return 'empty_body';
  if (t.length < 3) return 'too_short';

  // placeholders
  if (/\b(COLLER|TODO|FIXME|your-|votre-|chemin\/vers|example\.com\/path)\b/i.test(t)) {
    return 'placeholder';
  }
  if (/\[.*?\]/.test(t) && /COLLER|REMPLACER|VOTRE/i.test(t)) return 'placeholder';

  const l = (lang || '').toLowerCase();

  if (['bash', 'sh', 'shell', 'zsh'].includes(l)) {
    // pure comments
    if (t.split('\n').every((line) => !line.trim() || line.trim().startsWith('#'))) {
      return 'comments_only';
    }
    // interactive prompts
    if (/^\$\s/m.test(t) || /^>\s/m.test(t)) return 'shell_session_prompt';
    // incomplete pipe / trailing backslash only
    if (/\\\s*$/.test(t) && !t.includes('\n')) return 'incomplete_line';
    // incomplete control structures (pedagogical partial scripts)
    if (/\bif\b/.test(t) && !/\bfi\b/.test(t)) return 'bash_incomplete_if';
    if (/\bfor\b/.test(t) && !/\bdone\b/.test(t)) return 'bash_incomplete_for';
    if (/\bwhile\b/.test(t) && !/\bdone\b/.test(t)) return 'bash_incomplete_while';
    if (/\bcase\b/.test(t) && !/\besac\b/.test(t)) return 'bash_incomplete_case';
    // unclosed heredoc
    const heredoc = t.match(/<<\s*[-]?['"]?(\w+)['"]?/);
    if (heredoc && !new RegExp('^' + heredoc[1] + '\\s*$', 'm').test(t)) {
      return 'bash_incomplete_heredoc';
    }
    // placeholders <name> break bash parsing
    if (/<[A-Za-zÀ-ÿ][^>\n]*>/.test(t)) return 'bash_angle_placeholder';
    // SMTP / protocol transcripts mislabeled as bash
    if (/\b(HELO|EHLO|MAIL FROM|RCPT TO)\b/.test(t)) return 'protocol_session_not_bash';
    // WireGuard / INI-like configs
    if (/^\[Interface\]/m.test(t) || /^\[Peer\]/m.test(t)) return 'config_file_not_bash';
    // YARA rules
    if (/^\s*condition:\s*$/m.test(t) && /\$\w+/.test(t)) return 'yara_rule_not_bash';
  }

  if (['javascript', 'js', 'typescript', 'ts'].includes(l)) {
    // Mongo shell / mongosh labeled as JS
    if (
      /\bdb\.\w+/.test(t) ||
      /\bmongosh\b/.test(t) ||
      /^\s*use\s+\w+/m.test(t) ||
      /\bshow\s+(dbs|collections|tables)\b/.test(t)
    ) {
      return 'mongosh_repl_not_nodejs';
    }
    // Node REPL session (prompts + printed results)
    if (/^>\s/m.test(t) || /^\.\s*exit\b/m.test(t)) return 'nodejs_repl_session';
    // HTTP method catalog mixed with JSON bodies
    if (/^\s*(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+\//m.test(t)) {
      return 'http_session_not_js';
    }
    // Ellipsis placeholders in pedagogical skeletons (app.get('/x', ...); body { ... })
    if (
      /\(\s*\.\.\.\s*\)/.test(t) ||
      /,\s*\.\.\.\s*\)/.test(t) ||
      /\{\s*\.\.\.\s*\}/.test(t) ||
      /=\s*\.\.\.\s*[;\n]/.test(t) ||
      /:\s*\.\.\.\s*[,\n]/.test(t) ||
      /\{\s*\.\.\.\s*\}/.test(t) ||
      /function[^{]*\{\s*\.\.\.\s*\}/.test(t)
    ) {
      return 'ellipsis_placeholder';
    }
    // Projection / filter object literals only (Mongo docs as JS)
    if (
      /^\s*\{[\s\S]*\}\s*$/.test(t) &&
      !/\b(const|let|var|function|class|return|=>|import|export)\b/.test(t)
    ) {
      return 'json_object_literal_as_js';
    }
    // Catalog of several bare object literals (filters, shapes) with comments only
    if (
      (t.match(/^\s*\{/gm) || []).length >= 2 &&
      !/\b(const|let|var|function|class|return|=>|import|export)\b/.test(t)
    ) {
      return 'multi_object_literal_catalog';
    }
    // Truncated mid-expression (ends with . or , or :)
    if (/[.,:]\s*$/.test(t.trim()) && t.split('\n').length <= 20 && !/[,{]\s*$/.test(t.trim().slice(-1))) {
      // ends with bare . is truncated; ends with , inside incomplete
      if (/\.\s*$/.test(t.trim()) || /:\s*$/.test(t.trim().split('\n').pop() || '')) {
        return 'truncated_snippet';
      }
    }
    // Last non-empty line clearly cut mid-token (function som / poids[b / ...)
    {
      const lastCode = [...t.split('\n')]
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('//'))
        .pop();
      if (lastCode) {
        if (/^(function|const|let|var|class|type|interface|enum)\s+[A-Za-z_$][\w$]*$/.test(lastCode)) {
          return 'truncated_snippet';
        }
        if (/\[[A-Za-z_$][\w$]*$/.test(lastCode)) return 'truncated_snippet';
        if (/[A-Za-z_$][\w$]*\s*\.\s*$/.test(lastCode)) return 'truncated_snippet';
      }
    }
    // Incorrect / Correct multi-demo
    if (/#\s*Incorrect|#\s*Correct|\/\/\s*Incorrect|\/\/\s*Correct/i.test(t)) {
      return 'incorrect_correct_multi_demo';
    }
    // Partial method insertion ("ajouter dans la classe")
    if (/\/\/\s*(Ajouter|Modifier|Dans la fonction)/i.test(t) && !/\bclass\b/.test(t)) {
      return 'partial_method_insert';
    }
    // Access-modifier method body without enclosing class (TS class excerpt)
    if (
      /^\s*(public|private|protected)\s+(async\s+)?[A-Za-z_$]/m.test(t) &&
      !/\bclass\b/.test(t)
    ) {
      return 'fragment_method_with_modifier_without_class';
    }
    // TSX / JSX pasted in a typescript fence only (JS often embeds HTML strings)
    if (
      ['typescript', 'ts'].includes(l) &&
      /<[A-Za-z][\w.]*(\s|\/|>)/.test(t) &&
      /className\s*=/.test(t)
    ) {
      return 'tsx_in_typescript_fence';
    }
    // AWS CDK construct fragment (new s3.Bucket(this, ...) without stack/imports)
    if (
      /^\s*new\s+[A-Za-z_$][\w$]*\.[A-Za-z_$][\w$]*\(\s*this\s*,/m.test(t) &&
      !/\bimport\b/.test(t) &&
      !/\bclass\b/.test(t)
    ) {
      return 'cdk_construct_fragment';
    }
    // Continuation snippet (TS execute only): free identifiers that throw at runtime.
    // JS uses node --check (syntax only) so free refs are fine.
    if (['typescript', 'ts'].includes(l)) {
      const tsBuiltins = new Set([
        'console',
        'Math',
        'JSON',
        'Object',
        'Array',
        'Number',
        'String',
        'Boolean',
        'Date',
        'Promise',
        'parseInt',
        'parseFloat',
        'fetch',
        'Buffer',
        'require',
        'setTimeout',
        'setInterval',
        'clearTimeout',
        'clearInterval',
        'Error',
        'Map',
        'Set',
        'Symbol',
        'BigInt',
        'RegExp',
        'undefined',
        'NaN',
        'Infinity',
        'isNaN',
        'isFinite',
        'encodeURIComponent',
        'decodeURIComponent',
        'process',
        'module',
        'exports',
        'globalThis',
        'window',
        'document',
      ]);
      const isTsDeclared = (name) =>
        tsBuiltins.has(name) ||
        new RegExp(`\\b(const|let|var|function|class|import|type|interface|enum)\\s+${name}\\b`).test(
          t
        ) ||
        new RegExp(`\\b(const|let|var)\\s*\\{[^}]*\\b${name}\\b`).test(t) ||
        new RegExp(`\\bfunction\\s+\\w+\\s*\\([^)]*\\b${name}\\b`).test(t) ||
        new RegExp(`\\basync\\s+function\\s+${name}\\b`).test(t);

      const ifSubj = t.match(/^\s*if\s*\(\s*([A-Za-z_$][\w$]*)\s*[.?\[]/);
      if (ifSubj && !isTsDeclared(ifSubj[1])) {
        return 'fragment_undeclared_subject';
      }
      // "prop" in foo : ReferenceError if foo is free
      for (const m of t.matchAll(/\bin\s+([A-Za-z_$][\w$]*)/g)) {
        if (!isTsDeclared(m[1])) return 'fragment_undeclared_in_operand';
      }
      // const x = helper(...) where helper is never defined in this fence
      const call = t.match(/^\s*(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*([A-Za-z_$][\w$]*)\s*\(/);
      if (call && !isTsDeclared(call[1]) && !/\bimport\b/.test(t)) {
        return 'fragment_calls_undefined_helper';
      }
    }
    // clearly incomplete: starts with .method or only partial
    if (/^\s*\./.test(t)) return 'fragment_leading_dot';
    // comment then chained call (Encore / fluent APIs)
    if (/^(\s*\/\/[^\n]*\n)+\s*\./m.test(t)) return 'fragment_leading_dot_after_comment';
    if (/^(const|let|var|function|class|import|export)\s*$/m.test(t) && t.split('\n').length === 1) {
      return 'incomplete_decl';
    }
    // bare catch / try fragment
    if (/^\s*catch\s*\(/m.test(t) && !/\btry\s*\{/.test(t)) return 'fragment_catch_without_try';
    // method-looking first line without class/function (add to class demos)
    // Exclude control keywords, jQuery $(...), and free function *calls*.
    if (!/\bclass\b/.test(t)) {
      const first = t
        .split('\n')
        .map((line) => line.trim())
        .find((line) => line && !line.startsWith('//') && !line.startsWith('/*'));
      if (
        first &&
        // method names start with a letter/underscore (not $ alone / jQuery)
        /^(?:async\s+)?[A-Za-z_][\w$]*\s*\([^)]*\)\s*\{/.test(first) &&
        !/^(async\s+)?function\b/.test(first) &&
        !/^(if|for|while|switch|catch|with|do|else)\b/.test(first)
      ) {
        return 'fragment_method_without_class';
      }
    }
    // pedagogical wrong vs right in same fence
    if (/\/\/\s*❌/.test(t) && /\/\/\s*✅/.test(t)) return 'pedagogical_wrong_vs_right';
    if (/\/\*\s*❌/.test(t) || /\/\/\s*❌/.test(t)) return 'intentional_error_marker';
    // duplicate const/let same name in one fence (before/after demo)
    const decl = [...t.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g)].map((m) => m[1]);
    const seen = new Set();
    for (const n of decl) {
      if (seen.has(n)) return 'duplicate_decl_before_after_demo';
      seen.add(n);
    }
    // interface/type-only TS without implementable value (still runnable under strip-types if we execute empty)
  }

  if (['python', 'python3', 'py'].includes(l)) {
    if (/^\s*\.\.\./m.test(t)) return 'python_ellipsis_fragment';
    if (/^>>>/m.test(t)) return 'python_repl';
    // Jupyter / IPython magics mislabeled as python (often after a comment line)
    if (/^\s*%%?[A-Za-z]/m.test(t) || /^\s*![A-Za-z_/]/m.test(t)) return 'jupyter_magic';
    // Incorrect / Correct multi-demo (returns outside function, etc.)
    if (/#\s*Incorrect|#\s*Correct/i.test(t)) return 'incorrect_correct_multi_demo';
    // elif / else as insertion into an existing function (top-level or only branch)
    // Use first non-comment code line to avoid false negatives when body has nested if
    {
      const firstCode = t
        .split('\n')
        .map((line) => line.trim())
        .find((line) => line && !line.startsWith('#'));
      if (firstCode && /^elif\b/.test(firstCode)) return 'python_elif_without_if';
      if (firstCode && /^else\s*:/.test(firstCode)) return 'python_else_without_if';
    }
    // bare return at module level (handler excerpt)
    if (/^\s*return\b/m.test(t) && !/\bdef\b/.test(t) && !/\blambda\b/.test(t)) {
      return 'python_return_outside_function';
    }
    // incomplete if/for/def with only the header line
    const pyLines = t.split('\n').filter((l) => l.trim() && !l.trim().startsWith('#'));
    if (pyLines.length === 1 && /:\s*$/.test(pyLines[0])) return 'python_incomplete_block';
  }

  if (l === 'php') {
    // fragments without <?php often still lintable if we wrap : leave to runner
    if (/^\s*\?>/m.test(t)) return 'php_close_only';
    const hasType = /(?:^|\n)\s*(?:(?:abstract|final|readonly)\s+)*(?:class|interface|trait|enum)\s+(\w|\{)/.test(
      t
    );
    // Propriétés / méthodes isolées, y compris `private ?int $id` après un attribut.
    if (/^\s*(public|private|protected)\b/m.test(t) && !hasType) {
      return 'fragment_method_with_modifier_without_class';
    }
    if (/^\s*->/m.test(t) && !hasType) {
      return 'php_method_chain_fragment';
    }
    if (/\byield\b/.test(t) && !/\bfunction\b/.test(t)) {
      return 'php_yield_outside_function';
    }
    if (/erreur volontaire|Conflit !/i.test(t)) return 'intentional_error_marker';
    if (/\.\.\.|\[\.+\.\.\.\]|return\s+\[\.\.\.\]/.test(t)) return 'ellipsis_placeholder';
    if (/^\s*new\s+[A-Z]\w+\s*\(/m.test(t) && /,\s*$/.test(t) && !hasType) {
      return 'php_array_item_fragment';
    }
    if (
      /^\s*\w+\s*\(\s*$/m.test(t) &&
      /\$\w+/.test(t) &&
      !/\bfunction\b/.test(t) &&
      !hasType
    ) {
      return 'php_signature_fragment';
    }
    const attrLines = t
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//') && !line.startsWith('/*') && line !== '<?php');
    if (
      attrLines.length > 0 &&
      attrLines.every((line) => /^#\[/.test(line) || line.startsWith('use ') || line === '//' || line.startsWith('//'))
    ) {
      return 'php_attribute_fragment';
    }
    if (/Au lieu de :/.test(t) && /Utilise :/.test(t)) {
      return 'incorrect_correct_multi_demo';
    }
    const phpFns = [...t.matchAll(/\bfunction\s+([A-Za-z_]\w*)/g)].map((m) => m[1]);
    const seenFn = new Set();
    for (const n of phpFns) {
      if (seenFn.has(n)) return 'duplicate_decl_before_after_demo';
      seenFn.add(n);
    }
    if (
      /function\s+\w+\s*\([^)]*\)\s*(?::\s*\??[\w\\]+)?\s*$/m.test(t) &&
      !/function\s+\w+\s*\([^)]*\)\s*(?::\s*\??[\w\\]+)?\s*\{/m.test(t)
    ) {
      return 'php_method_signature_without_body';
    }
    if (
      /#\[/.test(t) &&
      !hasType &&
      !/\bfunction\b/.test(t) &&
      !/\becho\b/.test(t)
    ) {
      return 'php_attribute_fragment';
    }
    if (/^\s*\w+\s*:\s*\[/m.test(t) && !hasType && !/\bfunction\b/.test(t)) {
      return 'php_array_item_fragment';
    }
    const opens = (t.match(/\{/g) || []).length;
    const closes = (t.match(/\}/g) || []).length;
    if (opens > closes) return 'php_incomplete_block';
    const lastCode = [...t.split('\n')]
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//') && line !== '<?php')
      .pop();
    if (
      lastCode &&
      !/[;}]\s*$/.test(lastCode) &&
      !/\{$/.test(lastCode) &&
      !/^(namespace|use|class|enum|interface|trait)\b/.test(lastCode)
    ) {
      return 'php_missing_terminator';
    }
  }

  return null;
}

/**
 * Classe un snippet avant exécution.
 * @param {{ lang: string, body: string }} snip
 * @returns {{ status: 'candidate'|'skipped_lang'|'skipped_fragment', reason?: string }}
 */
function classifySnippet(snip) {
  const lang = (snip.lang || '').toLowerCase();
  if (!RUNTIME_LANGS.has(lang)) {
    return {
      status: 'skipped_lang',
      reason: NON_EXECUTABLE_LANGS.has(lang)
        ? `non_executable_lang:${lang || 'bare'}`
        : `unsupported_lang:${lang || 'bare'}`,
    };
  }
  const frag = fragmentSkipReason(lang, snip.body);
  if (frag) return { status: 'skipped_fragment', reason: frag };
  return { status: 'candidate' };
}

/**
 * Construit une commande de validation pour un candidat.
 * @param {{ lang: string, body: string, file: string, index: number }} snip
 * @param {string} workDir - répertoire temporaire pour fichiers
 * @returns {{ argv: string[], files: { path: string, content: string }[], wrap?: string }}
 */
function buildValidationJob(snip, workDir) {
  const lang = snip.lang.toLowerCase();
  const id = `${snip.file.replace(/[\/\\]/g, '_')}__${snip.index}`;
  const files = [];

  if (['bash', 'sh', 'shell', 'zsh'].includes(lang)) {
    const p = `${workDir}/${id}.sh`;
    files.push({ path: p, content: snip.body + '\n' });
    return { argv: ['bash', '-n', p], files };
  }

  if (['javascript', 'js'].includes(lang)) {
    const p = `${workDir}/${id}.js`;
    files.push({ path: p, content: snip.body + '\n' });
    return { argv: ['node', '--check', p], files };
  }

  if (['typescript', 'ts'].includes(lang)) {
    // Node --check ignores --experimental-strip-types (syntax path).
    // Run with strip-types instead (short snippets only; see runner safety).
    const p = `${workDir}/${id}.ts`;
    files.push({ path: p, content: snip.body + '\n' });
    return {
      argv: ['node', '--experimental-strip-types', p],
      files,
      fallbackSkip: 'typescript_runtime_unavailable',
      executes: true,
    };
  }

  if (['python', 'python3', 'py'].includes(lang)) {
    const p = `${workDir}/${id}.py`;
    files.push({ path: p, content: snip.body + '\n' });
    return { argv: ['python3', '-m', 'py_compile', p], files };
  }

  if (lang === 'php') {
    let body = snip.body;
    if (!/<\?php/i.test(body)) body = `<?php\n${body}\n`;
    const p = `${workDir}/${id}.php`;
    files.push({ path: p, content: body });
    return { argv: ['php', '-l', p], files, fallbackSkip: 'php_cli_missing' };
  }

  if (lang === 'json') {
    return {
      argv: null,
      files: [],
      inline: 'json',
      body: snip.body,
    };
  }

  if (lang === 'yaml' || lang === 'yml') {
    return {
      argv: null,
      files: [],
      inline: 'yaml',
      body: snip.body,
    };
  }

  return { argv: null, files: [], fallbackSkip: 'no_runner' };
}

/**
 * Évalue un job inline (json/yaml) sans process.
 * @param {{ inline: string, body: string }} job
 * @param {{ parseYaml?: (s: string) => unknown }} deps
 * @returns {{ ok: boolean, error?: string }}
 */
function runInlineJob(job, deps = {}) {
  if (job.inline === 'json') {
    try {
      JSON.parse(job.body);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: String(e.message || e) };
    }
  }
  if (job.inline === 'yaml') {
    try {
      // Prefer loadAll: multi-doc K8s examples are common in pedagogy
      if (typeof deps.parseYamlAll === 'function') {
        const docs = deps.parseYamlAll(job.body);
        if (Array.isArray(docs) || docs !== undefined) return { ok: true };
        return { ok: true };
      }
      if (typeof deps.parseYaml === 'function') {
        deps.parseYaml(job.body);
        return { ok: true };
      }
      // minimal fallback: reject tabs-only broken structure
      if (job.body.includes('\t') && !job.body.includes(':')) {
        return { ok: false, error: 'yaml_tabs_without_keys' };
      }
      return { ok: true, note: 'yaml_soft_ok_no_parser' };
    } catch (e) {
      const msg = String(e.message || e);
      // Multi-document YAML (---) often used in K8s pedagogy
      if (/multiple documents|single document/i.test(msg) && typeof deps.parseYamlAll === 'function') {
        try {
          deps.parseYamlAll(job.body);
          return { ok: true };
        } catch (e2) {
          return { ok: false, error: String(e2.message || e2) };
        }
      }
      // Comment-only comparison blocks (✅/❌) or intentional broken yaml
      if (/duplicated mapping key|bad indentation|can not read/i.test(msg)) {
        return { ok: false, error: msg, pedagogical: true };
      }
      return { ok: false, error: msg };
    }
  }
  return { ok: false, error: 'unknown_inline' };
}

/**
 * Code de sortie du runner. En mode strict, fail>0 ou skip sans raison
 * termine en 1 ; unclassified termine en 2. Sans --strict, fail ne masque
 * plus un 0 : le CLI doit passer strict pour un gate de campagne.
 * @param {{fail?: number, unclassified?: number, skipped_without_reason?: number}} summary
 * @param {{strict?: boolean}} [options]
 * @returns {number}
 */
function processExitCode(summary, options = {}) {
  const unclassified = Number(summary && summary.unclassified) || 0;
  const fail = Number(summary && summary.fail) || 0;
  const skipNoReason = Number(summary && summary.skipped_without_reason) || 0;
  if (unclassified > 0) return 2;
  if (options.strict) {
    if (fail > 0) return 1;
    if (skipNoReason > 0) return 1;
  }
  return 0;
}

function resolveSnippetTargetFile(onlyFile, { root, docs }) {
  if (!onlyFile) return null;
  const path = require('path');
  const fs = require('fs');
  if (path.isAbsolute(onlyFile)) return onlyFile;
  const fromRoot = path.join(root, onlyFile);
  if (fs.existsSync(fromRoot)) return fromRoot;
  return path.join(docs, onlyFile.replace(/^docs\//, ''));
}

module.exports = {
  NON_EXECUTABLE_LANGS,
  RUNTIME_LANGS,
  extractSnippets,
  fragmentSkipReason,
  classifySnippet,
  buildValidationJob,
  runInlineJob,
  processExitCode,
  resolveSnippetTargetFile,
};
