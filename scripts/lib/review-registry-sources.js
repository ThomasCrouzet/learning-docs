/**
 * Path-prefix → primary official sources for the review registry.
 * Most specific prefixes first. Used by enrich + check to avoid lot-level
 * topic mismatch (e.g. Python pages citing MongoDB aggregation).
 */

const DATE = '2026-07-28';

/** @typedef {{ url: string, topic: string, date: string, scope?: string }} ReviewSource */

/** @type {Array<[string, ReviewSource[]]>} */
const PATH_PREFIX_SOURCES = [
  ['15-python/', [
    { url: 'https://docs.python.org/3/', topic: 'Python 3 documentation', date: DATE },
  ]],
  ['16-python-data/', [
    { url: 'https://pandas.pydata.org/docs/', topic: 'pandas documentation', date: DATE },
    { url: 'https://numpy.org/doc/stable/', topic: 'NumPy documentation', date: DATE },
  ]],
  ['17-mongodb/', [
    { url: 'https://www.mongodb.com/docs/', topic: 'MongoDB documentation', date: DATE },
  ]],
  ['18-csharp/', [
    { url: 'https://learn.microsoft.com/dotnet/', topic: '.NET documentation', date: DATE },
  ]],
  ['19-langage-c/', [
    { url: 'https://en.cppreference.com/w/c', topic: 'C language reference', date: DATE },
  ]],
  ['04-postgresql/', [
    { url: 'https://www.postgresql.org/docs/16/', topic: 'PostgreSQL 16 docs', date: DATE },
  ]],
  ['13-redis/', [
    { url: 'https://redis.io/docs/', topic: 'Redis documentation', date: DATE },
    { url: 'https://symfony.com/doc/current/components/cache.html', topic: 'Symfony Cache', date: DATE },
  ]],
  ['02-php/', [
    { url: 'https://www.php.net/manual/en/', topic: 'PHP manual', date: DATE },
    { url: 'https://www.php.net/supported-versions.php', topic: 'PHP supported versions', date: DATE },
  ]],
  ['03-symfony/', [
    { url: 'https://symfony.com/doc/current/index.html', topic: 'Symfony current docs', date: DATE },
    { url: 'https://symfony.com/releases/7.4', topic: 'Symfony 7.4 LTS', date: DATE },
  ]],
  ['03-easyadmin/', [
    { url: 'https://symfony.com/bundles/EasyAdminBundle/current/index.html', topic: 'EasyAdmin docs', date: DATE },
  ]],
  ['05-javascript/', [
    { url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript', topic: 'MDN JavaScript', date: DATE },
  ]],
  ['06-javascript-moderne/', [
    { url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript', topic: 'MDN JavaScript', date: DATE },
  ]],
  ['07-typescript/', [
    { url: 'https://www.typescriptlang.org/docs/', topic: 'TypeScript handbook', date: DATE },
  ]],
  ['08-react/', [
    { url: 'https://react.dev/', topic: 'React official docs', date: DATE },
  ]],
  ['23-dev-mobile/', [
    { url: 'https://docs.expo.dev/', topic: 'Expo docs', date: DATE },
  ]],
  ['09-testing/', [
    { url: 'https://phpunit.de', topic: 'PHPUnit', date: DATE },
    { url: 'https://jestjs.io/docs/getting-started', topic: 'Jest docs', date: DATE },
  ]],
  ['10-architecture/', [
    { url: 'https://martinfowler.com/architecture/', topic: 'Software architecture (Fowler)', date: DATE },
  ]],
  ['11-ci-cd/', [
    { url: 'https://docs.github.com/en/actions', topic: 'GitHub Actions docs', date: DATE },
  ]],
  ['12-api-design/', [
    { url: 'https://www.openapis.org/', topic: 'OpenAPI', date: DATE },
    { url: 'https://www.rfc-editor.org/rfc/9457', topic: 'RFC 9457 problem+json', date: DATE },
  ]],
  ['01-docker/', [
    { url: 'https://docs.docker.com/compose/', topic: 'Docker Compose', date: DATE },
  ]],
  ['devops/01-podman/', [
    { url: 'https://docs.podman.io/', topic: 'Podman docs', date: DATE },
  ]],
  ['devops/02-openshift/', [
    { url: 'https://docs.openshift.com/', topic: 'OpenShift docs', date: DATE },
  ]],
  ['devops/03-kubernetes/', [
    { url: 'https://kubernetes.io/docs/home/', topic: 'Kubernetes documentation', date: DATE },
    { url: 'https://helm.sh/docs/', topic: 'Helm documentation', date: DATE },
  ]],
  ['ansible/', [
    { url: 'https://docs.ansible.com/', topic: 'Ansible documentation', date: DATE },
  ]],
  ['14-monitoring/', [
    { url: 'https://prometheus.io/docs/', topic: 'Prometheus docs', date: DATE },
    { url: 'https://grafana.com/docs/', topic: 'Grafana docs', date: DATE },
  ]],
  ['22-cloud/', [
    { url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html', topic: 'AWS IAM intro', date: DATE },
  ]],
  ['24-virtualisation/', [
    { url: 'https://www.qemu.org/docs/master/', topic: 'QEMU docs', date: DATE },
  ]],
  ['20-reseaux/', [
    { url: 'https://www.rfc-editor.org/rfc/rfc791', topic: 'RFC 791 Internet Protocol', date: DATE },
  ]],
  ['21-services-systeme/', [
    { url: 'https://www.freedesktop.org/software/systemd/man/', topic: 'systemd man pages', date: DATE },
  ]],
  ['epitech/01-java/', [
    { url: 'https://docs.oracle.com/en/java/javase/21/', topic: 'Java 21 documentation', date: DATE },
  ]],
  ['epitech/02-unix-bash/', [
    { url: 'https://www.gnu.org/software/bash/manual/', topic: 'Bash manual', date: DATE },
  ]],
  ['epitech/03-git/', [
    { url: 'https://git-scm.com/doc', topic: 'Git documentation', date: DATE },
  ]],
  ['epitech/04-html-css/', [
    { url: 'https://developer.mozilla.org/fr/docs/Web/HTML', topic: 'MDN HTML', date: DATE },
  ]],
  ['epitech/05-javascript/', [
    { url: 'https://developer.mozilla.org/fr/docs/Web/JavaScript', topic: 'MDN JavaScript', date: DATE },
  ]],
  ['epitech/07-nodejs/', [
    { url: 'https://nodejs.org/docs/latest-v22.x/api/', topic: 'Node.js 22 API', date: DATE },
  ]],
  ['epitech/08-rust/', [
    { url: 'https://doc.rust-lang.org/book/', topic: 'The Rust Book', date: DATE },
  ]],
  ['epitech/', [
    { url: 'https://git-scm.com/doc', topic: 'Git / tooling (Epitech track)', date: DATE },
  ]],
  ['cybersecurite/', [
    { url: 'https://owasp.org/www-project-top-ten/', topic: 'OWASP Top 10', date: DATE },
  ]],
  ['crypto-monnaies/', [
    { url: 'https://www.amf-france.org/', topic: 'AMF (régulation, pas un conseil)', date: DATE },
    { url: 'https://www.impots.gouv.fr/', topic: 'impots.gouv.fr (fiscalité)', date: DATE },
  ]],
  ['26-droit-rgpd/', [
    { url: 'https://www.cnil.fr/fr/reglement-europeen-protection-donnees', topic: 'CNIL / RGPD', date: DATE },
  ]],
  ['27-ux-design/', [
    { url: 'https://www.w3.org/WAI/standards-guidelines/wcag/', topic: 'WCAG overview (W3C)', date: DATE },
  ]],
  ['25-gestion-projet/', [
    { url: 'https://www.iso.org/standard/82870.html', topic: 'ISO 21502 project management (ref)', date: DATE },
  ]],
  ['28-audit-qualite/', [
    { url: 'https://martinfowler.com/articles/practical-test-pyramid.html', topic: 'Test pyramid (Fowler)', date: DATE },
  ]],
  ['00-outils-ia/', [
    { url: 'https://www.nist.gov/itl/ai-risk-management-framework', topic: 'NIST AI RMF (usage responsable)', date: DATE },
  ]],
  ['ia/', [
    { url: 'https://www.nist.gov/itl/ai-risk-management-framework', topic: 'NIST AI Risk Management Framework', date: DATE },
  ]],
  ['faust/', [
    { url: 'https://faust.grame.fr/doc/', topic: 'Faust official docs', date: DATE },
  ]],
  ['00-blocs-competences/', [
    { url: 'https://www.francecompetences.fr/', topic: 'France compétences / RNCP', date: DATE },
  ]],
  ['fiches-reference/', [
    { url: 'https://developer.mozilla.org/', topic: 'MDN (référence web)', date: DATE },
  ]],
  ['commencer/', [
    { url: 'https://creativecommons.org/licenses/by/4.0/', topic: 'CC BY 4.0 (projet)', date: DATE },
  ]],
  ['stack-symfony/', [
    { url: 'https://symfony.com/doc/current/index.html', topic: 'Symfony docs', date: DATE },
  ]],
];

/**
 * @param {string} rel path relative to docs/
 * @returns {ReviewSource[]}
 */
function sourcesForPath(rel) {
  const p = String(rel || '').replace(/^docs\//, '');
  for (const [prefix, sources] of PATH_PREFIX_SOURCES) {
    if (p === prefix || p.startsWith(prefix)) {
      return sources.map((s) => ({ ...s, scope: `path:${prefix}` }));
    }
  }
  return [
    {
      url: 'https://creativecommons.org/licenses/by/4.0/',
      topic: 'CC BY 4.0 (meta / unmapped path)',
      date: DATE,
      scope: 'fallback',
    },
  ];
}

/**
 * True if at least one source looks path-bound (scope starts with path:)
 * or URL host is not a known cross-lot mismatch for this path.
 * @param {string} rel
 * @param {Array<{url?: string, topic?: string, scope?: string}>} sources
 */
function sourcesMatchPath(rel, sources) {
  if (!Array.isArray(sources) || sources.length === 0) return false;
  const p = String(rel || '').replace(/^docs\//, '');
  const expected = sourcesForPath(p);
  const expectedHosts = new Set(
    expected.map((s) => {
      try {
        return new URL(s.url).hostname;
      } catch {
        return '';
      }
    }).filter(Boolean)
  );
  // Accept if any source host matches expected path hosts, or scope is path:
  for (const s of sources) {
    if (s && typeof s.scope === 'string' && s.scope.startsWith('path:')) return true;
    try {
      const host = new URL(s.url).hostname;
      if (expectedHosts.has(host)) return true;
    } catch {
      /* ignore */
    }
  }
  // Known mismatch fingerprints (historical theater)
  const blob = JSON.stringify(sources);
  if (p.startsWith('15-python') || p.startsWith('16-python-data')) {
    if (blob.includes('mongodb.com') && !blob.includes('python.org') && !blob.includes('pandas') && !blob.includes('numpy')) {
      return false;
    }
  }
  if (p.startsWith('19-langage-c') && blob.includes('rust-lang.org') && !blob.includes('cppreference')) {
    return false;
  }
  if (p.startsWith('devops/03-kubernetes') && blob.includes('docs.docker.com/compose') && !blob.includes('kubernetes.io')) {
    return false;
  }
  if (p.startsWith('00-outils-ia') && blob.includes('arxiv.org') && !blob.includes('nist.gov')) {
    return false;
  }
  // If scope is only domain: and we have no path match, still accept multi-source domain lots
  // when at least one host is plausible for the lot (caller may be lenient).
  return expectedHosts.size === 0;
}

function isGenericPerishableOnly(perishableClaims) {
  if (!Array.isArray(perishableClaims) || perishableClaims.length !== 1) return false;
  const c = perishableClaims[0];
  const claim = typeof c === 'string' ? c : c && c.claim;
  return typeof claim === 'string' && claim.includes('no_perishable_flagged_in_lot_pass');
}

function stringifyReserve(item) {
  if (item == null) return '';
  if (typeof item === 'string') return item;
  if (typeof item === 'object') {
    try {
      return JSON.stringify(item);
    } catch {
      return String(item);
    }
  }
  return String(item);
}

module.exports = {
  DATE,
  PATH_PREFIX_SOURCES,
  sourcesForPath,
  sourcesMatchPath,
  isGenericPerishableOnly,
  stringifyReserve,
};
