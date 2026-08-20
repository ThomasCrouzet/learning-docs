/**
 * Gates HTTP pour audit:routes / audit:links.
 * Une 404 joliment rendue n'est pas un succès.
 */

const PRETTY_404 = [
  /page non trouv/i,
  /page not found/i,
  /\b404\b/,
  /cette page n['']existe pas/i,
  /document not found/i,
];

function siteFileToRoute(relFromSite) {
  const p = String(relFromSite || '').replace(/\\/g, '/').replace(/^\.\//, '');
  if (!p.endsWith('.html')) return null;
  if (p === 'index.html') return '/';
  if (p.endsWith('/index.html')) return `/${p.slice(0, -'index.html'.length)}`;
  return `/${p.replace(/\.html$/, '/')}`;
}

function listHtmlRoutes(files) {
  const routes = [];
  for (const f of files || []) {
    const r = siteFileToRoute(f);
    if (r) routes.push(r);
  }
  return [...new Set(routes)].sort();
}

/**
 * @param {number} status
 * @param {string} body
 * @param {string} [contentType]
 */
function assertHttpDocumentOk(status, body, contentType = '') {
  if (status !== 200) {
    return { ok: false, reason: `http_${status}` };
  }
  const text = String(body || '');
  if (PRETTY_404.some((re) => re.test(text))) {
    return { ok: false, reason: 'pretty_404' };
  }
  if (contentType && /html/i.test(contentType) && !/<h1[\s>]/i.test(text) && !/<title[\s>]/i.test(text)) {
    return { ok: false, reason: 'missing_title_or_h1' };
  }
  return { ok: true, reason: 'http_200' };
}

function classifyLinkResult({ status, error, redirected, url }) {
  if (error) {
    const msg = String(error);
    if (/timeout|ETIMEDOUT|ECONNRESET|ENETUNREACH|temporarily/i.test(msg)) {
      return 'transient_unreachable';
    }
    if (/ENOTFOUND|EAI_AGAIN/i.test(msg)) return 'dead';
    if (/401|403|unauthorized|forbidden/i.test(msg)) return 'auth_required';
    if (/waf|cloudflare|blocked/i.test(msg)) return 'waf_blocked';
    return 'dead';
  }
  if (status === 401 || status === 403) return 'auth_required';
  if (status === 404 || status === 410) return 'dead';
  if (status === 429) return 'transient_unreachable';
  if (status >= 500) return 'transient_unreachable';
  if (redirected) return 'redirected';
  if (status >= 200 && status < 300) return 'ok';
  return 'dead';
}

function forbiddenAxeViolations(axeResult, { failOnIncomplete = false } = {}) {
  const violations = (axeResult && axeResult.violations) || [];
  const forbidden = violations.filter((v) => v && v.id);
  const incomplete = failOnIncomplete ? (axeResult.incomplete || []) : [];
  return { violations: forbidden, incomplete, fail: forbidden.length > 0 };
}

module.exports = {
  PRETTY_404,
  siteFileToRoute,
  listHtmlRoutes,
  assertHttpDocumentOk,
  classifyLinkResult,
  forbiddenAxeViolations,
};
