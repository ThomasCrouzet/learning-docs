/**
 * Scan / fix French accents in crypto-monnaies docs.
 * Uses project applyRules (PHRASE_RULES + WORD_RULES) on:
 *  - outer prose
 *  - pedagogical fences: text, markdown, md, txt, empty
 * Skips real code fences (solidity, bash, javascript, …).
 */

const { applyRules } = require('./accents');

const PROSE_FENCE_LANGS = new Set(['', 'text', 'markdown', 'md', 'txt']);

/**
 * @param {string} content
 * @returns {{ content: string, hitCount: number, hits: { line: number, before: string, after: string }[] }}
 */
function processCryptoMarkdown(content) {
  const lines = content.split('\n');
  let fenceLang = null;
  let hitCount = 0;
  const hits = [];
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^(`{3,})(.*)$/);
    if (m) {
      const rest = m[2].trim();
      if (fenceLang === null) {
        fenceLang = rest === '' ? '' : rest.split(/\s+/)[0];
      } else if (rest === '') {
        fenceLang = null;
      }
      result.push(line);
      continue;
    }

    const processable = fenceLang === null || PROSE_FENCE_LANGS.has(fenceLang);
    if (!processable) {
      result.push(line);
      continue;
    }

    const fixed = applyRules(line);
    if (fixed !== line) {
      hitCount++;
      if (hits.length < 200) {
        hits.push({ line: i + 1, before: line, after: fixed });
      }
      result.push(fixed);
    } else {
      result.push(line);
    }
  }

  return {
    content: result.join('\n'),
    hitCount,
    hits,
  };
}

/**
 * @param {string} content
 * @param {string} [fileRel]
 */
function scanCryptoMarkdown(content, fileRel = '') {
  const { hitCount, hits } = processCryptoMarkdown(content);
  const byWord = {};
  for (const h of hits) {
    const beforeTokens = h.before.split(/(\s+)/);
    const afterTokens = h.after.split(/(\s+)/);
    const n = Math.min(beforeTokens.length, afterTokens.length);
    for (let i = 0; i < n; i++) {
      if (beforeTokens[i] !== afterTokens[i] && !/^\s+$/.test(beforeTokens[i])) {
        const w = beforeTokens[i].replace(/[^\wÀ-ÿ'-]/g, '');
        if (w.length >= 2) byWord[w] = (byWord[w] || 0) + 1;
      }
    }
  }
  return {
    hitCount,
    byWord,
    samples: hits.slice(0, 30).map((h) => ({
      file: fileRel,
      line: h.line,
      before: h.before.slice(0, 120),
      after: h.after.slice(0, 120),
    })),
  };
}

/**
 * @param {string[]} fileRels
 * @param {(rel: string) => string} readContent
 */
function scanCryptoTree(fileRels, readContent) {
  let hitCount = 0;
  const byWord = {};
  const samples = [];
  const byFile = {};

  for (const rel of fileRels) {
    const content = readContent(rel);
    const r = scanCryptoMarkdown(content, rel);
    if (r.hitCount === 0) continue;
    byFile[rel] = r.hitCount;
    hitCount += r.hitCount;
    for (const [w, n] of Object.entries(r.byWord)) {
      byWord[w] = (byWord[w] || 0) + n;
    }
    for (const s of r.samples) {
      if (samples.length < 50) samples.push(s);
    }
  }

  return {
    generated_at: new Date().toISOString(),
    hit_count: hitCount,
    files_with_hits: Object.keys(byFile).length,
    by_word: Object.fromEntries(Object.entries(byWord).sort((a, b) => b[1] - a[1])),
    by_file: byFile,
    sample_paths: samples,
  };
}

/**
 * @param {object} coverage
 */
function coverageSummary(coverage) {
  const pages = coverage.pages || [];
  const by = coverage.summary || {};
  const corrected =
    by.corrected ?? pages.filter((p) => p.editorial_status === 'corrected').length;
  const audited = by.audited ?? pages.filter((p) => p.editorial_status === 'audited').length;
  const uncertain =
    by.uncertain ?? pages.filter((p) => p.editorial_status === 'uncertain').length;
  const pending = by.pending ?? pages.filter((p) => p.editorial_status === 'pending').length;
  return {
    corrected,
    audited,
    uncertain,
    pending,
    total: pages.length,
  };
}

/**
 * @param {string} reportMd
 * @param {{ corrected: number, audited: number, uncertain: number, pending: number, total: number }} summary
 * @param {{ accentHitCount?: number|null }} [opts]
 */
function syncFinalReportMarkdown(reportMd, summary, opts = {}) {
  let out = reportMd;

  out = out.replace(
    /(\|\s*\*\*corrected\*\*\s*\|[^|]+\|\s*)\*\*\d+\*\*(\s*\|)/i,
    `$1**${summary.corrected}**$2`
  );
  out = out.replace(
    /(\|\s*\*\*audited\*\*\s*\|[^|]+\|\s*)\*\*\d+\*\*(\s*\|)/i,
    `$1**${summary.audited}**$2`
  );
  out = out.replace(
    /(\|\s*\*\*uncertain\*\*\s*\|[^|]+\|\s*)\*\*\d+\*\*(\s*\|)/i,
    `$1**${summary.uncertain}**$2`
  );
  out = out.replace(
    /(\|\s*\*\*pending\*\*\s*\|[^|]+\|\s*)\*\*\d+\*\*(\s*\|)/i,
    `$1**${summary.pending}**$2`
  );
  out = out.replace(
    /(\|\s*\*\*Total avec statut\*\*\s*\|[^|]*\|\s*)\*\*\d+\*\*(\s*\|)/i,
    `$1**${summary.total}**$2`
  );

  out = out.replace(
    /\*\*\d+\s+pages restent uncertain\*\*/gi,
    `**${summary.uncertain} pages restent uncertain**`
  );
  out = out.replace(
    /(\d+)\s+pages en \*\*uncertain\*\*/gi,
    `${summary.uncertain} pages en **uncertain**`
  );
  out = out.replace(
    /Les \*\*\d+\*\* audited|Les \d+ audited/gi,
    `Les **${summary.audited}** audited`
  );
  out = out.replace(
    /Deep-audit des (?:\*\*)?\d+(?:\*\*)? `uncertain`/gi,
    `Deep-audit des **${summary.uncertain}** \`uncertain\``
  );

  // Accent residual claim: driven by scanner, never hand-typed
  if (typeof opts.accentHitCount === 'number') {
    const n = opts.accentHitCount;
    const accentBlock =
      n === 0
        ? `- Accents crypto (prose + fences pédagogiques text/markdown) : **0 résiduel** selon \`audit-reports/editorial/crypto-accent-residual.json\` (scanner project \`applyRules\`)`
        : `- Accents crypto : **${n} ligne(s) résiduelle(s)** selon \`audit-reports/editorial/crypto-accent-residual.json\` (pas revendiqué complet)`;
    if (/Accents crypto\s*:/i.test(out)) {
      out = out.replace(/- Accents crypto[^\n]*/gi, accentBlock);
    }
    // Limites line
    if (n === 0) {
      out = out.replace(
        /- Accents crypto :[^\n]*/gi,
        (m) => (m.includes('Limites') ? m : null) || m
      );
      // Only in Limites section - replace lines mentioning residual formes rares
      out = out.replace(
        /- Accents crypto : passe[^\n]*/gi,
        `- Accents crypto : scanner résiduel = **0** (voir crypto-accent-residual.json)`
      );
    } else {
      out = out.replace(
        /- Accents crypto : passe[^\n]*/gi,
        `- Accents crypto : scanner résiduel = **${n}** (voir crypto-accent-residual.json) ; non revendiqué complet`
      );
    }
  }

  return out;
}

/**
 * @param {string} reportMd
 */
function parseFinalReportCoverageClaims(reportMd) {
  const grab = (label) => {
    const re = new RegExp(
      `\\|\\s*\\*\\*${label}\\*\\*\\s*\\|[^|]+\\|\\s*\\*\\*(\\d+)\\*\\*\\s*\\|`,
      'i'
    );
    const m = reportMd.match(re);
    return m ? parseInt(m[1], 10) : null;
  };
  return {
    corrected: grab('corrected'),
    audited: grab('audited'),
    uncertain: grab('uncertain'),
  };
}

/**
 * True if report language claims zero residual accents / complete fences.
 * @param {string} reportMd
 */
function reportClaimsZeroCryptoAccents(reportMd) {
  // Explicit non-zero residual disclaimer wins
  if (/residual\s*=\s*\*\*[1-9]\d*\*\*|scanner résiduel = \*\*[1-9]/i.test(reportMd)) {
    return false;
  }
  if (/pas revendiqué complet|non revendiqué complet/i.test(reportMd)) {
    return false;
  }
  return /0 résiduel|r[eé]siduel\s*=\s*\*\*0\*\*|residual\s*=\s*\*\*0\*\*|hit_count["']?\s*:\s*0|accents? crypto[^\n]*0 r[eé]sidu/i.test(
    reportMd
  );
}

module.exports = {
  PROSE_FENCE_LANGS,
  processCryptoMarkdown,
  scanCryptoMarkdown,
  scanCryptoTree,
  coverageSummary,
  syncFinalReportMarkdown,
  parseFinalReportCoverageClaims,
  reportClaimsZeroCryptoAccents,
};
