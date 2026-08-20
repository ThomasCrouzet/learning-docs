/**
 * Preuve de source page-owned pour la campagne.
 * Un `scope: path:...`, une homepage de documentation ou trois URL copiées
 * ne constituent jamais une preuve suffisante.
 */

const GENERIC_PATH_RE =
  /^(fr|en|docs?|documentation|home|index\.html?|manual|current|\d+)$/i;

/**
 * @param {string} url
 * @returns {boolean}
 */
function isGenericHomepage(url) {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return true;
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return true;
    if (parts.length === 1 && GENERIC_PATH_RE.test(parts[0])) return true;
    if (parts.length === 2 && /^(fr|en)$/i.test(parts[0]) && GENERIC_PATH_RE.test(parts[1])) {
      return true;
    }
    if (/\/docs\/?(home)?\/?$/i.test(u.pathname) && parts.length <= 2) return true;
    return false;
  } catch {
    return true;
  }
}

/**
 * True if the value is a `scope: path:...` stamp rather than a locator.
 * @param {unknown} scope
 */
function isScopePathStamp(scope) {
  return typeof scope === 'string' && /^\s*path:/.test(scope);
}

function locatorText(source) {
  if (!source || typeof source !== 'object') return '';
  const parts = [source.section, source.anchor, source.excerpt, source.passage, source.locator];
  return parts
    .filter((x) => typeof x === 'string' && x.trim().length > 0)
    .join(' ')
    .trim();
}

/**
 * Batch stamp of the form `[locator for path]` glued onto an excerpt.
 * Length >= 8 is not proof; the bracketed path is a scope stamp.
 * @param {unknown} text
 * @returns {boolean}
 */
function isLocatorStampExcerpt(text) {
  if (typeof text !== 'string') return false;
  return /\[locator for\b/i.test(text);
}

/**
 * Remove a glued `[locator for path]` stamp; the remaining excerpt may still
 * be used only if it is otherwise sufficient proof.
 * @param {unknown} text
 * @returns {string}
 */
function stripLocatorStamp(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/\s*\[locator for[^\]]*\]\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripLocatorStampFromSource(source) {
  if (!source || typeof source !== 'object') return source;
  const next = { ...source };
  for (const key of ['excerpt', 'locator', 'section', 'passage']) {
    if (typeof next[key] === 'string' && isLocatorStampExcerpt(next[key])) {
      next[key] = stripLocatorStamp(next[key]);
    }
  }
  return next;
}

/**
 * A source is sufficient proof only when it has a deep URL, a precise locator,
 * and a claim_id. Homepages, path-scope stamps, and `[locator for` excerpts
 * never qualify.
 * @param {object} source
 * @returns {boolean}
 */
function sourceIsSufficientProof(source) {
  if (!source || typeof source !== 'object') return false;
  const url = source.url;
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return false;
  if (isGenericHomepage(url)) return false;
  const loc = locatorText(source);
  if (loc.length < 8) return false;
  if (isLocatorStampExcerpt(loc)) return false;
  if (isLocatorStampExcerpt(source.excerpt) || isLocatorStampExcerpt(source.locator)) {
    return false;
  }
  const claimId = source.claim_id;
  if (claimId == null || String(claimId).trim() === '') return false;
  // scope:path may exist as metadata but is never the proof
  if (isScopePathStamp(source.scope) && loc.length < 8) return false;
  return true;
}

/**
 * At least one source must be sufficient; a set that only has scope stamps
 * or homepages is rejected even if hosts look on-topic.
 * @param {string} _rel
 * @param {unknown} sources
 */
function sourcesQualifyAsProof(_rel, sources) {
  if (!Array.isArray(sources) || sources.length === 0) return false;
  if (sources.some((s) => sourceIsSufficientProof(s))) return true;
  return false;
}

/**
 * Detect a copied three-URL stamp reused across pages.
 * @param {Array<{url?: string}>} sources
 * @returns {string}
 */
function sourceFingerprint(sources) {
  if (!Array.isArray(sources)) return '';
  const urls = sources
    .map((s) => (s && typeof s.url === 'string' ? s.url : ''))
    .filter(Boolean)
    .sort();
  return urls.join('|');
}

module.exports = {
  GENERIC_PATH_RE,
  isGenericHomepage,
  isScopePathStamp,
  isLocatorStampExcerpt,
  stripLocatorStamp,
  stripLocatorStampFromSource,
  locatorText,
  sourceIsSufficientProof,
  sourcesQualifyAsProof,
  sourceFingerprint,
};
