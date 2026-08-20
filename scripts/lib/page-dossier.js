/**
 * Extraction déterministe d'un dossier de recherche page-owned :
 * questions spécifiques, claims, segments de lignes, snippets.
 * Ne produit jamais un verdict `verified`.
 */

const { extractSnippets, classifySnippet } = require('./snippet-runtime');
const { sha256, classifyDocsMarkdown } = require('./campaign-inventory');

const CODE_FENCE_RE = /^```/;

function extractH1(body) {
  const m = String(body).match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : '';
}

function extractVersions(body) {
  const hits =
    String(body).match(
      /\b(?:PHP|Symfony|Node(?:\.js)?|PostgreSQL|Python|Java|Ansible|ansible-core|Kubernetes|Helm|Grafana|React|TypeScript|MongoDB|\.NET|MkDocs Material|Vite|Expo|Wireshark|tshark|Docker|Podman|OpenShift|Redis|Twig|Doctrine|EasyAdmin|Nginx|Joomla)\s*[0-9]+(?:\.[0-9x]+)*[+]?(?:\.x)?\b/g
    ) || [];
  return [...new Set(hits)];
}

function extractCommands(body) {
  const hits = [];
  const re =
    /`((?:tshark|tcpdump|wireshark|dig|mtr|nmap|ss|ip|curl|git|docker|podman|kubectl|ansible(?:-playbook)?|php|python3?|node|npm|composer|symfony|psql)[^`]*)`/gi;
  let m;
  while ((m = re.exec(body))) hits.push(m[1].trim());
  return [...new Set(hits)].slice(0, 12);
}

function extractApis(body) {
  const hits =
    String(body).match(
      /\b(?:array_map|password_hash|fetch\(|useState|useEffect|Promise\.all|async function|SELECT\s+|CREATE TABLE|display filter|capture filter|BPF)\b/g
    ) || [];
  return [...new Set(hits)].slice(0, 12);
}

function pageSpecificQuestions(rel, { h1, versions, commands, apis, kind }) {
  const q = [];
  const title = h1 || rel;
  q.push(
    `Les affirmations techniques de « ${title} » (fichier ${rel}) sont-elles encore exactes en août 2026 ?`
  );
  for (const v of versions.slice(0, 6)) {
    q.push(
      `Le pin « ${v} » cité dans ${rel} est-il encore dans la politique de support officielle ?`
    );
  }
  for (const c of commands.slice(0, 5)) {
    q.push(`La commande « ${c} » enseignée dans ${rel} existe-t-elle encore avec ces flags ?`);
  }
  for (const a of apis.slice(0, 4)) {
    q.push(`Le symbole « ${a} » utilisé dans ${rel} est-il toujours l'interface recommandée ?`);
  }
  if (kind === 'pedagogical_fiche') {
    q.push(
      `L'exercice et la checklist de ${rel} sont-ils faisables uniquement avec ce que la fiche et ses prérequis enseignent ?`
    );
    q.push(
      `Quels pièges réels (issues upstream, erreurs fréquentes) manquent dans ${rel} ?`
    );
  } else {
    q.push(
      `Les effectifs, versions et liens de la page méta ${rel} correspondent-ils au corpus réel ?`
    );
  }
  return [...new Set(q)];
}

function lineSegments(content) {
  const lines = String(content).split('\n');
  const segs = [];
  let inFm = false;
  let inCode = false;
  let section = 'prose';
  const startFm = lines[0] === '---';

  for (let i = 0; i < lines.length; i++) {
    const n = i + 1;
    const line = lines[i];
    if (line.trim() === '') continue;

    if (i === 0 && startFm) inFm = true;
    if (inFm) {
      segs.push({ start: n, end: n, kind: 'frontmatter' });
      if (i > 0 && line.trim() === '---') inFm = false;
      continue;
    }
    if (CODE_FENCE_RE.test(line)) {
      inCode = !inCode;
      segs.push({ start: n, end: n, kind: 'code' });
      continue;
    }
    if (inCode) {
      segs.push({ start: n, end: n, kind: 'code' });
      continue;
    }
    if (/^#\s+/.test(line)) {
      segs.push({ start: n, end: n, kind: 'titre' });
      continue;
    }
    if (/^##\s+/.test(line)) {
      const h = line.replace(/^##\s+/, '').trim().toLowerCase();
      if (/navigation/.test(h)) section = 'navigation';
      else if (/pr[eé]requis/.test(h)) section = 'pedagogie';
      else if (/exercice|solution|checklist/.test(h)) section = 'pedagogie';
      else if (/pi[eè]ges/.test(h)) section = 'pedagogie';
      else section = 'prose';
      segs.push({ start: n, end: n, kind: 'titre' });
      continue;
    }
    if (/https?:\/\//.test(line) && /(EOL|LTS|support|version|RFC)/i.test(line)) {
      segs.push({ start: n, end: n, kind: 'fait_versionne' });
      continue;
    }
    if (/\b(rm\s+-rf|DROP TABLE|chmod 777|eval\(|curl .* \| sh)/i.test(line)) {
      segs.push({ start: n, end: n, kind: 'securite_normative' });
      continue;
    }
    if (/^\$\$/.test(line) || /\$[^$]+\$/.test(line)) {
      segs.push({ start: n, end: n, kind: 'calcul' });
      continue;
    }
    segs.push({
      start: n,
      end: n,
      kind: section === 'navigation' ? 'navigation' : section === 'pedagogie' ? 'pedagogie' : 'prose',
    });
  }

  const merged = [];
  for (const s of segs) {
    const last = merged[merged.length - 1];
    if (last && last.kind === s.kind && last.end === s.start - 1) {
      last.end = s.end;
    } else {
      merged.push({ ...s });
    }
  }
  return merged;
}

function segmentCoverageOk(content, segs) {
  const lines = String(content).split('\n');
  const covered = new Set();
  const overlap = [];
  for (const s of segs) {
    for (let n = s.start; n <= s.end; n++) {
      if (covered.has(n)) overlap.push(n);
      covered.add(n);
    }
  }
  const holes = [];
  for (let i = 0; i < lines.length; i++) {
    const n = i + 1;
    if (lines[i].trim() === '') continue;
    if (!covered.has(n)) holes.push(n);
  }
  return { ok: holes.length === 0 && overlap.length === 0, holes, overlap };
}

function snippetInventory(content, rel) {
  const snippets = extractSnippets(content, rel);
  return snippets.map((s) => {
    const cls = classifySnippet(s);
    return {
      file: s.file,
      index: s.index,
      lang: s.lang,
      line: s.line,
      hash: sha256(s.body || ''),
      classify: cls.status,
      reason: cls.reason || null,
    };
  });
}

function extractClaims(rel, body) {
  const claims = [];
  const h1 = extractH1(body);
  if (h1) claims.push({ id: 'c-h1', text: h1, stability: 'stable' });
  const enBref = body.match(/>\s*\*\*En bref\*\*\s*:\s*(.+)/i);
  if (enBref) {
    claims.push({
      id: 'c-enbref',
      text: enBref[1].trim().slice(0, 240),
      stability: 'stable',
    });
  }
  extractVersions(body).forEach((v, i) => {
    claims.push({ id: `c-ver-${i + 1}`, text: v, stability: 'versionnee' });
  });
  return claims;
}

function buildPageDossier(rel, content) {
  const kind = classifyDocsMarkdown(rel);
  const h1 = extractH1(content);
  const versions = extractVersions(content);
  const commands = extractCommands(content);
  const apis = extractApis(content);
  const questions = pageSpecificQuestions(rel, { h1, versions, commands, apis, kind });
  const segments = lineSegments(content);
  const coverage = segmentCoverageOk(content, segments);
  const claims = extractClaims(rel, content);
  return {
    schema_version: 1,
    page_id: rel,
    kind,
    content_hash: sha256(content),
    h1,
    questions,
    claims,
    versions,
    commands,
    apis,
    snippets: snippetInventory(content, rel),
    line_segments: segments,
    segment_coverage: coverage,
    status: 'unstarted',
    pedagogical_verdict: null,
    sources: [],
    claim_source_matrix: [],
  };
}

function questionsLookGeneric(questionLists) {
  if (!Array.isArray(questionLists) || questionLists.length < 3) return false;
  const sig = (qs) => (qs || []).map((q) => String(q).replace(/docs\/[^\s)]+/g, '').replace(/\s+/g, ' ')).join('|');
  const first = sig(questionLists[0]);
  return questionLists.every((qs) => sig(qs) === first);
}

module.exports = {
  extractH1,
  extractVersions,
  extractCommands,
  extractApis,
  pageSpecificQuestions,
  lineSegments,
  segmentCoverageOk,
  snippetInventory,
  extractClaims,
  buildPageDossier,
  questionsLookGeneric,
};
