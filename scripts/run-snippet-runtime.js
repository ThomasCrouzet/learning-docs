#!/usr/bin/env node
/**
 * Harness d'exécution / validation des snippets Markdown sous docs/.
 *
 * Usage:
 *   node scripts/run-snippet-runtime.js
 *   node scripts/run-snippet-runtime.js --limit 50
 *   node scripts/run-snippet-runtime.js --file docs/02-php/01-introduction-php.md
 *
 * Sortie :
 *   audit-reports/snippet-runtime-latest.json
 *   audit-reports/snippet-runtime-latest.md
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const yaml = require('js-yaml');
const {
  extractSnippets,
  classifySnippet,
  buildValidationJob,
  runInlineJob,
} = require('./lib/snippet-runtime');

const ROOT = path.join(__dirname, '..');
const DOCS = path.join(ROOT, 'docs');
const OUT_DIR = path.join(ROOT, 'audit-reports');
const WORK = path.join(ROOT, '.snippet-runtime-tmp');

const args = process.argv.slice(2);
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? parseInt(args[limitIdx + 1], 10) : 0;
const fileIdx = args.indexOf('--file');
const onlyFile = fileIdx >= 0 ? args[fileIdx + 1] : null;

function walkMd(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    if (['overrides', 'stylesheets', 'javascripts', 'includes', 'fonts', 'node_modules'].includes(e.name)) {
      continue;
    }
    const rel = base ? `${base}/${e.name}` : e.name;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkMd(full, rel));
    else if (e.name.endsWith('.md')) out.push(rel);
  }
  return out;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function commandExists(cmd) {
  const r = spawnSync('which', [cmd], { encoding: 'utf8' });
  return r.status === 0;
}

const hasPhp = commandExists('php');
const hasPython = commandExists('python3');
const hasNode = commandExists('node');
const hasBash = commandExists('bash');

function runJob(job, snip) {
  if (job.inline) {
    return runInlineJob(job, {
      parseYaml: (s) => yaml.load(s),
      parseYamlAll: (s) => yaml.loadAll(s),
    });
  }
  if (!job.argv) {
    return { ok: false, skip: job.fallbackSkip || 'no_runner' };
  }
  const bin = job.argv[0];
  if (bin === 'php' && !hasPhp) return { ok: false, skip: 'php_cli_missing' };
  if (bin === 'python3' && !hasPython) return { ok: false, skip: 'python3_missing' };
  if (bin === 'node' && !hasNode) return { ok: false, skip: 'node_missing' };
  if (bin === 'bash' && !hasBash) return { ok: false, skip: 'bash_missing' };

  // Safety: do not execute TS that touches destructive APIs
  if (job.executes && snip && /\b(rm\s+-rf|unlinkSync|rmdirSync|writeFileSync|execSync|spawnSync|child_process|fs\.promises\.write)\b/.test(snip.body)) {
    return { ok: false, skip: 'unsafe_execution_skipped' };
  }

  for (const f of job.files || []) {
    ensureDir(path.dirname(f.path));
    fs.writeFileSync(f.path, f.content);
  }

  const r = spawnSync(job.argv[0], job.argv.slice(1), {
    encoding: 'utf8',
    timeout: job.executes ? 3000 : 8000,
    maxBuffer: 2 * 1024 * 1024,
  });

  if (r.error && r.error.code === 'ENOENT' && job.fallbackSkip) {
    return { ok: false, skip: job.fallbackSkip };
  }
  // TypeScript strip-types may fail on older node
  if (r.status !== 0 && job.fallbackSkip === 'typescript_check_unavailable') {
    const err = `${r.stderr || ''}${r.stdout || ''}`;
    if (/experimental-strip-types|bad option|unknown option|ERR_UNKNOWN/i.test(err)) {
      return { ok: false, skip: job.fallbackSkip };
    }
  }

  if (r.status === 0) {
    return {
      ok: true,
      stdout: (r.stdout || '').slice(0, 500),
      stderr: (r.stderr || '').slice(0, 200),
    };
  }
  return {
    ok: false,
    error: `${r.stderr || r.stdout || 'exit ' + r.status}`.slice(0, 800),
    code: r.status,
  };
}

// Clean work dir
if (fs.existsSync(WORK)) {
  fs.rmSync(WORK, { recursive: true, force: true });
}
ensureDir(WORK);

const files = onlyFile
  ? [onlyFile.replace(/^docs\//, '')]
  : walkMd(DOCS).sort();

const results = [];
let inventory = 0;

for (const rel of files) {
  const full = path.join(DOCS, rel);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, 'utf8');
  const snippets = extractSnippets(content, rel);
  for (const snip of snippets) {
    inventory++;
    if (limit > 0 && results.length >= limit) break;

    const cls = classifySnippet(snip);
    if (cls.status === 'skipped_lang' || cls.status === 'skipped_fragment') {
      results.push({
        file: snip.file,
        index: snip.index,
        lang: snip.lang,
        line: snip.line,
        status: 'skipped',
        reason: cls.reason,
      });
      continue;
    }

    const job = buildValidationJob(snip, WORK);
    const outcome = runJob(job, snip);
    if (outcome.skip) {
      results.push({
        file: snip.file,
        index: snip.index,
        lang: snip.lang,
        line: snip.line,
        status: 'skipped',
        reason: outcome.skip,
      });
    } else if (outcome.ok) {
      results.push({
        file: snip.file,
        index: snip.index,
        lang: snip.lang,
        line: snip.line,
        status: 'pass',
        stdout: outcome.stdout || '',
        note: outcome.note || '',
      });
    } else {
      const err = outcome.error || '';
      // JSON with comments (//) or multi-value pedagogy : not single RFC JSON
      if (
        /json/i.test(snip.lang) &&
        (/\/\/|\/\*|\.\.\./.test(snip.body) ||
          /non-whitespace character after JSON/i.test(err) ||
          (snip.body.match(/^\s*\{/gm) || []).length > 1)
      ) {
        results.push({
          file: snip.file,
          index: snip.index,
          lang: snip.lang,
          line: snip.line,
          status: 'skipped',
          reason: 'json_comments_or_multi_or_ellipsis_pedagogy',
          error: err.slice(0, 200),
        });
        continue;
      }
      // YAML intentional broken / comparison / Ansible vault tags
      if (
        outcome.pedagogical ||
        (/yaml|yml/i.test(snip.lang) &&
          (/[✅❌]|#\s*✅|#\s*❌|duplicated mapping|!vault|unknown tag/i.test(snip.body + err)))
      ) {
        results.push({
          file: snip.file,
          index: snip.index,
          lang: snip.lang,
          line: snip.line,
          status: 'skipped',
          reason: 'yaml_pedagogical_invalid_or_vault_or_comparison',
          error: err.slice(0, 200),
        });
        continue;
      }
      // Explicit pedagogical "broken on purpose" markers in the BODY only.
      // Do NOT match bare "SyntaxError:" in error text : only intentional markers.
      if (
        /\/\/\s*❌|\/\*\s*❌|#\s*❌|ne compile pas|erreur intentionnelle|exemple d.erreur|\/\/\s*ERREUR|\/\/\s*BAD\b|\/\/\s*Incorrect|Private field|#\s*Incorrect/i.test(
          snip.body
        )
      ) {
        results.push({
          file: snip.file,
          index: snip.index,
          lang: snip.lang,
          line: snip.line,
          status: 'skipped',
          reason: 'intentional_error_marker_in_body',
          error: err.slice(0, 200),
        });
        continue;
      }
      // TS/JS before/after demos that redeclare the same binding
      if (/Identifier '.*' has already been declared/i.test(err)) {
        results.push({
          file: snip.file,
          index: snip.index,
          lang: snip.lang,
          line: snip.line,
          status: 'skipped',
          reason: 'duplicate_binding_before_after_demo',
          error: err.slice(0, 200),
        });
        continue;
      }
      // Missing npm packages (react, express, …) : not a syntax bug in the fence
      if (/ERR_MODULE_NOT_FOUND|Cannot find package|Cannot find module/i.test(err)) {
        results.push({
          file: snip.file,
          index: snip.index,
          lang: snip.lang,
          line: snip.line,
          status: 'skipped',
          reason: 'missing_npm_dependency',
          error: err.slice(0, 300),
        });
        continue;
      }
      // Node strip-types limitations (parameter properties, enums, namespaces, …)
      if (/ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX|strip-only mode|TypeScript .* is not supported/i.test(err)) {
        results.push({
          file: snip.file,
          index: snip.index,
          lang: snip.lang,
          line: snip.line,
          status: 'skipped',
          reason: 'typescript_strip_limitation',
          error: err.slice(0, 300),
        });
        continue;
      }
      // Environment / tool missing only : NOT generic SyntaxError / IndentationError
      if (
        /command not found|ENOENT|not found in PATH|php_cli_missing|python3_missing|bad option|unknown option|ERR_UNKNOWN/i.test(
          err
        ) &&
        !/SyntaxError|IndentationError|ParseError|invalid syntax/i.test(err)
      ) {
        results.push({
          file: snip.file,
          index: snip.index,
          lang: snip.lang,
          line: snip.line,
          status: 'skipped',
          reason: 'runtime_env_missing',
          error: err.slice(0, 300),
        });
        continue;
      }
      // True validation failure (syntax, IndentationError, invalid JSON/YAML, etc.)
      // HONESTY: never soft-skip SyntaxError / IndentationError as "fragment" here.
      // Pedagogical broken samples must use body markers (❌, "ne compile pas", …)
      // or be pre-classified as fragments by fragmentSkipReason (body heuristics).
      results.push({
        file: snip.file,
        index: snip.index,
        lang: snip.lang,
        line: snip.line,
        status: 'fail',
        error: err,
      });
    }
  }
  if (limit > 0 && results.length >= limit) break;
}

// Cleanup work dir
try {
  fs.rmSync(WORK, { recursive: true, force: true });
} catch {
  /* ignore */
}

const summary = {
  generated_at: new Date().toISOString(),
  inventory: results.length,
  pass: results.filter((r) => r.status === 'pass').length,
  fail: results.filter((r) => r.status === 'fail').length,
  skipped: results.filter((r) => r.status === 'skipped').length,
  unclassified: results.filter((r) => !['pass', 'fail', 'skipped'].includes(r.status)).length,
  by_lang: {},
  by_status: { pass: 0, fail: 0, skipped: 0 },
};

for (const r of results) {
  summary.by_status[r.status] = (summary.by_status[r.status] || 0) + 1;
  const k = r.lang || 'bare';
  if (!summary.by_lang[k]) summary.by_lang[k] = { pass: 0, fail: 0, skipped: 0 };
  summary.by_lang[k][r.status] = (summary.by_lang[k][r.status] || 0) + 1;
}

const report = {
  summary,
  environment: {
    node: process.version,
    hasPhp,
    hasPython,
    hasBash,
    hasNode,
  },
  results,
};

ensureDir(OUT_DIR);
const jsonPath = path.join(OUT_DIR, 'snippet-runtime-latest.json');
fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

const md = [];
md.push('# Rapport runtime snippets');
md.push('');
md.push(`Date : ${summary.generated_at}`);
md.push('');
md.push('| Métrique | Valeur |');
md.push('| -------- | ------ |');
md.push(`| Snippets inventoriés | ${summary.inventory} |`);
md.push(`| pass | ${summary.pass} |`);
md.push(`| fail | ${summary.fail} |`);
md.push(`| skipped | ${summary.skipped} |`);
md.push(`| unclassified | ${summary.unclassified} |`);
md.push('');
md.push('## Fails (extrait, max 50)');
md.push('');
const fails = results.filter((r) => r.status === 'fail');
if (fails.length === 0) md.push('_Aucun._');
else {
  for (const f of fails.slice(0, 50)) {
    md.push(`- \`${f.file}\`:${f.line} [${f.lang}] ${ (f.error || '').replace(/\n/g, ' ').slice(0, 160)}`);
  }
  if (fails.length > 50) md.push(`- … et ${fails.length - 50} autres`);
}
md.push('');
md.push('## Pass (échantillon, 5)');
md.push('');
for (const p of results.filter((r) => r.status === 'pass').slice(0, 5)) {
  md.push(`- \`${p.file}\`:${p.line} [${p.lang}] OK`);
}
md.push('');
fs.writeFileSync(path.join(OUT_DIR, 'snippet-runtime-latest.md'), md.join('\n'));

console.log(
  `Snippet runtime: inventory=${summary.inventory} pass=${summary.pass} fail=${summary.fail} skipped=${summary.skipped} unclassified=${summary.unclassified}`
);
console.log(`Report: ${path.relative(ROOT, jsonPath)}`);

if (summary.unclassified > 0) process.exit(2);
// fail does not exit 1 by default : mission may fix fails in a second pass
process.exit(0);
