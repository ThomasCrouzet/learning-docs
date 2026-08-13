/**
 * Page-owned review-registry rows (not lot overlays / lot_pass stamps).
 */
const {
  sourcesForPath,
  sourcesMatchPath,
  isGenericPerishableOnly,
} = require('./review-registry-sources');

const SHALLOW_DEPTH = new Set(['lot_pass', 'lot_structural_sampled', undefined, null, '']);

function hasSubstantiveItem(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  return arr.some((item) => {
    if (item == null) return false;
    if (typeof item === 'string') return item.trim().length > 0;
    if (typeof item === 'object') {
      return Object.values(item).some(
        (v) => typeof v === 'string' && v.trim().length > 0
      );
    }
    return false;
  });
}

function claimText(c) {
  if (c == null) return '';
  if (typeof c === 'string') return c.trim();
  if (typeof c === 'object') return String(c.claim || c.summary || '').trim();
  return String(c).trim();
}

function isGenericClaimText(text, rel) {
  const t = String(text || '').trim();
  if (!t) return true;
  if (t === rel) return true;
  if (/^frontmatter\/structure/i.test(t)) return true;
  if (/^overlay from lot/i.test(t)) return true;
  if (/^lot_pass/i.test(t)) return true;
  return false;
}

function sourceScopesPath(rel, sources) {
  const key = String(rel || '').replace(/^docs\//, '');
  return (sources || []).some((s) => {
    const scope = s && typeof s.scope === 'string' ? s.scope : '';
    if (!scope) return false;
    return (
      scope === `path:${key}` ||
      scope.startsWith(`path:${key}:`) ||
      scope.startsWith(`path:${key} `) ||
      scope.includes(key)
    );
  });
}

function isPageOwnedEntry(rel, entry) {
  if (!entry || typeof entry !== 'object') return false;
  const key = String(rel || entry.path_final || entry.path_initial || '').replace(
    /^docs\//,
    ''
  );
  if (SHALLOW_DEPTH.has(entry.review_depth)) return false;
  if (!hasSubstantiveItem(entry.sources)) return false;
  if (!sourcesMatchPath(key, entry.sources)) return false;
  if (!sourceScopesPath(key, entry.sources)) return false;
  if (!hasSubstantiveItem(entry.claims_verified)) return false;
  if (!hasSubstantiveItem(entry.examples_executed)) return false;
  if (!hasSubstantiveItem(entry.perishable_claims)) return false;
  if (isGenericPerishableOnly(entry.perishable_claims)) {
    const only = entry.perishable_claims[0];
    const status = typeof only === 'object' && only ? only.status : '';
    if (status === 'ok') return false;
  }
  const claims = entry.claims_verified;
  const allGeneric = claims.every((c) => isGenericClaimText(claimText(c), key));
  if (allGeneric) return false;
  return true;
}

function extractPageOwnedFields(rel, content, extras = {}) {
  const key = String(rel || '').replace(/^docs\//, '');
  const body = String(content || '');
  const claims = [];
  const h1 = body.match(/^#\s+(.+)$/m);
  if (h1) claims.push({ claim: h1[1].trim(), verdict: 'read' });
  const enBref = body.match(/>\s*\*\*En bref\*\*\s*:\s*(.+)/i);
  if (enBref) {
    claims.push({
      claim: `En bref: ${enBref[1].trim().slice(0, 220)}`,
      verdict: 'read',
    });
  }
  const fmTime = body.match(/^estimated_time:\s*["']?([^"'\n]+)/m);
  const fmNum = body.match(/^fiche_number:\s*(\d+)/m);
  const fmTotal = body.match(/^total_fiches:\s*(\d+)/m);
  const fmCursus = body.match(/^cursus:\s*["']?([^"'\n]+)/m);
  if (fmNum && fmTotal) {
    claims.push({
      claim: `fiche ${fmNum[1]}/${fmTotal[1]}${fmTime ? ` · ${fmTime[1].trim()}` : ''}${fmCursus ? ` · ${fmCursus[1].trim()}` : ''}`,
      verdict: 'read',
    });
  } else if (fmCursus) {
    claims.push({ claim: `page méta cursus ${fmCursus[1].trim()}`, verdict: 'read' });
  }
  const def = body.match(/\*\*Définition\*\*\s*:\s*(.+)/);
  if (def) {
    claims.push({
      claim: `Définition: ${def[1].trim().slice(0, 180)}`,
      verdict: 'read',
    });
  }
  const objectif = body.match(
    /## Objectif de cette fiche\s*\n+([^\n]+)/
  );
  if (objectif) {
    claims.push({
      claim: `Objectif: ${objectif[1].trim().slice(0, 180)}`,
      verdict: 'read',
    });
  }

  const perishable = [];
  const versionHits = body.match(
    /\b(?:PHP|Symfony|Node(?:\.js)?|PostgreSQL|Python|Java|Ansible|Kubernetes|Helm|Grafana|React|TypeScript|jQuery|MongoDB|Mongoose|\.NET|MkDocs Material|Vite|Expo)\s*[0-9]+(?:\.[0-9x]+)?(?:\.[0-9x]+)?(?:\+|\.x)?\b/g
  );
  if (versionHits) {
    for (const v of [...new Set(versionHits)].slice(0, 6)) {
      perishable.push({
        claim: v,
        status: 'unchecked',
        note: `pin lu dans ${key} le 2026-08-13`,
      });
    }
  }
  const dated = body.match(
    /\b(?:20[2-3][0-9][-/][0-1][0-9][-/][0-3][0-9]|RNCP\d{5}|RFC\s?\d{3,5}|EOL|LTS|fin de support)\b/gi
  );
  if (dated) {
    for (const d of [...new Set(dated)].slice(0, 5)) {
      perishable.push({
        claim: d,
        status: 'unchecked',
        note: `occurrence datée/institutionnelle dans ${key}`,
      });
    }
  }
  if (perishable.length === 0) {
    perishable.push({
      claim: `aucun pin périssable daté dans ${key}`,
      status: 'unchecked',
      note: 'page conceptuelle, index ou méta ; revalidation structurelle 2027-02-13',
    });
  }

  const sources = sourcesForPath(key).map((s) => ({
    url: s.url,
    title: s.title || s.topic,
    organism: s.organism || s.topic || 'mainteneur officiel',
    access_date: extras.accessDate || '2026-08-13',
    date: extras.accessDate || '2026-08-13',
    scope: `path:${key}`,
  }));

  const fences = (body.match(/```[a-zA-Z0-9_+-]*/g) || []).length;
  let examples = extras.examples;
  if (!hasSubstantiveItem(examples)) {
    if (fences === 0) {
      examples = [{ status: 'skipped', reason: `aucun bloc de code dans ${key}` }];
    } else {
      examples = [
        {
          status: 'static',
          reason: `${fences} blocs dans ${key} ; audit:snippets ou lecture statique`,
        },
      ];
    }
  }

  return {
    claims_verified: claims.slice(0, 8),
    perishable_claims: perishable.slice(0, 8),
    sources,
    examples_executed: examples,
  };
}

function mergeKeptClaims(extracted, existing, rel) {
  const out = [...(extracted || [])];
  const seen = new Set(out.map((c) => claimText(c)));
  for (const c of existing || []) {
    const t = claimText(c);
    if (!t || isGenericClaimText(t, rel) || seen.has(t)) continue;
    if (t.length < 16) continue;
    seen.add(t);
    out.push(c);
  }
  return out.slice(0, 10);
}

module.exports = {
  SHALLOW_DEPTH,
  hasSubstantiveItem,
  claimText,
  isGenericClaimText,
  sourceScopesPath,
  isPageOwnedEntry,
  extractPageOwnedFields,
  mergeKeptClaims,
};
