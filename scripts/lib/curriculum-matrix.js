/**
 * Matrice concept / prérequis / objectif terminal / recouvrement / lacune
 * par cursus, à partir du Markdown (pas un verdict radar).
 */

function extractPrereqLines(body) {
  const m = String(body).match(/## Prérequis\n+([\s\S]*?)(?:\n## |\n---\n)/);
  if (!m) return [];
  return m[1]
    .split('\n')
    .map((l) => l.replace(/^[-*]\s+/, '').trim())
    .filter((l) => l && !l.startsWith('#'));
}

function extractObjective(body) {
  const m = String(body).match(/## Objectif de cette fiche\n+([^\n]+)/);
  return m ? m[1].trim() : '';
}

function extractConceptHeadings(body) {
  const out = [];
  const re = /^### (.+)$/gm;
  let m;
  while ((m = re.exec(body))) {
    const t = m[1].trim();
    if (/^Qu'est-ce que|^Qu’est-ce que|^Étape /i.test(t) || t.startsWith('Piège')) {
      out.push(t);
    } else if (!/^Étape/.test(t)) {
      out.push(t);
    }
  }
  return [...new Set(out)];
}

function buildCursusMatrix({ cursus, pages }) {
  const concepts = [];
  const objectives = [];
  const prereqs = [];
  for (const p of pages || []) {
    concepts.push(...(p.concepts || []).map((c) => ({ concept: c, page: p.path })));
    if (p.objective) objectives.push({ path: p.path, objective: p.objective });
    for (const r of p.prereqs || []) prereqs.push({ path: p.path, prereq: r });
  }
  const seen = new Map();
  const overlaps = [];
  for (const { concept, page } of concepts) {
    const key = concept.toLowerCase();
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push(page);
  }
  for (const [concept, paths] of seen) {
    if (paths.length > 1) overlaps.push({ concept, paths });
  }
  return {
    cursus,
    page_count: (pages || []).length,
    terminal_objectives: objectives,
    concepts,
    prereqs,
    overlaps,
    gaps: [],
  };
}

module.exports = {
  extractPrereqLines,
  extractObjective,
  extractConceptHeadings,
  buildCursusMatrix,
};
