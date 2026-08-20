/**
 * Gate lint:campaign-final - manifeste compact, hashes, partitions,
 * run_id distincts, transitions, closure.
 *
 * `verified` exige des sources suffisantes (pas de tampon `[locator for`),
 * deux run_id distincts, et une seconde relecture substantive. Un run_id
 * hostile-2026-08-20-A..D sans artefact par page n'est pas une seconde
 * relecture. Un dossier never_verified ou pedagogical_verdict.verified=false
 * ne peut pas être verified.
 */

const {
  identityEquation,
  partitionProof,
  pageIdFromDocsRel,
} = require('./campaign-inventory');
const {
  sourcesQualifyAsProof,
  sourceFingerprint,
  isScopePathStamp,
  isLocatorStampExcerpt,
  sourceIsSufficientProof,
} = require('./campaign-sources');

const FINAL_STATUSES = new Set(['verified']);
const NON_FINAL = new Set([
  'unstarted',
  'researching',
  'reviewed',
  'corrected',
  'blocked',
  'moved',
  'merged',
  'removed',
  'split',
  'pending',
  'audited',
]);

const BANNED_PROOF = new Set([
  'regex',
  'lint',
  'batch_note',
  'scope_path',
  'homepage',
  'copied_stamp',
  'locator_stamp',
]);

/** Run ids assigned by repair-and-seal from counter-lot membership. */
const SEAL_HOSTILE_BAND = /^hostile-2026-08-20-[A-D]$/;

function asDocsRel(p) {
  return pageIdFromDocsRel(String(p || '').replace(/^docs\//, ''));
}

function emptyArtifact(path) {
  return {
    path: asDocsRel(path),
    finding_ids: [],
    run_ids: [],
    reviewers: [],
    never_verified: false,
    file_never_verified: false,
    confirmed_ok: false,
  };
}

/**
 * Per-page second-review artifacts from hostile finding documents.
 * Lot membership and a pages[] roster with empty finding_ids are ignored.
 * @param {object[]} docs
 * @returns {Record<string, object>}
 */
function collectSecondReviewArtifacts(docs) {
  const map = {};
  const ensure = (p) => {
    const key = asDocsRel(p);
    if (!key) return null;
    if (!map[key]) map[key] = emptyArtifact(key);
    return map[key];
  };
  const add = (path, extra = {}) => {
    const e = ensure(path);
    if (!e) return;
    const run = extra.run_id;
    const reviewer = extra.reviewer;
    if (run && !e.run_ids.includes(run)) e.run_ids.push(run);
    if (reviewer && !e.reviewers.includes(reviewer)) e.reviewers.push(reviewer);
    if (extra.id && !e.finding_ids.includes(extra.id)) e.finding_ids.push(extra.id);
    if (extra.confirmed_ok) e.confirmed_ok = true;
    if (extra.never_verified) e.never_verified = true;
    if (extra.file_never_verified) {
      e.file_never_verified = true;
      e.never_verified = true;
    }
  };

  for (const doc of Array.isArray(docs) ? docs : []) {
    if (!doc || typeof doc !== 'object') continue;
    const run = doc.second_review_run_id || '';
    const reviewer = doc.second_reviewer || doc.reviewer || '';
    const fileNV =
      doc.never_verified === true ||
      doc.verification_status === 'not_verified' ||
      doc.status_never_set_verified === true;
    const base = { run_id: run, reviewer, file_never_verified: fileNV };

    for (const f of Array.isArray(doc.findings) ? doc.findings : []) {
      if (!f || typeof f !== 'object') continue;
      const extra = {
        ...base,
        id: f.id,
        never_verified: f.never_verified === true || f.verified === false,
      };
      if (typeof f.path === 'string') add(f.path, extra);
      for (const p of Array.isArray(f.pages) ? f.pages : []) add(p, extra);
    }
    for (const f of Array.isArray(doc.independently_confirmed_ok)
      ? doc.independently_confirmed_ok
      : []) {
      if (!f || typeof f !== 'object') continue;
      const extra = { ...base, id: f.id, confirmed_ok: true };
      if (typeof f.path === 'string') add(f.path, extra);
      for (const p of Array.isArray(f.pages) ? f.pages : []) add(p, extra);
    }
    for (const f of Array.isArray(doc.pages_with_findings) ? doc.pages_with_findings : []) {
      if (!f || typeof f !== 'object' || typeof f.path !== 'string') continue;
      const ids = Array.isArray(f.finding_ids) ? f.finding_ids : [];
      add(f.path, {
        ...base,
        id: ids[0],
        never_verified: f.never_verified !== false || f.verified === false,
      });
      for (const id of ids.slice(1)) add(f.path, { ...base, id });
    }
    for (const f of Array.isArray(doc.pages) ? doc.pages : []) {
      if (!f || typeof f !== 'object' || typeof f.path !== 'string') continue;
      const ids = Array.isArray(f.finding_ids) ? f.finding_ids : [];
      if (ids.length === 0) continue;
      add(f.path, {
        ...base,
        id: ids[0],
        never_verified: f.verified === false || f.never_verified === true,
      });
      for (const id of ids.slice(1)) add(f.path, { ...base, id });
    }
  }
  return map;
}

function secondReviewHasArtifact(rel, entry, artifacts) {
  const key = asDocsRel(rel);
  if (entry && Array.isArray(entry.second_review_findings) && entry.second_review_findings.length > 0) {
    return true;
  }
  if (entry && typeof entry.second_review_artifact === 'string' && entry.second_review_artifact.trim()) {
    return true;
  }
  const art = artifacts && artifacts[key];
  if (!art) return false;
  return art.finding_ids.length > 0 || art.confirmed_ok === true;
}

/**
 * A second review is substantive only with a reviewer, a distinct run_id,
 * and (for seal hostileBand ids) a per-page finding artifact.
 * @param {object} entry
 * @param {{ artifacts?: object, dossiers?: object }} [ctx]
 */
function secondReviewIsSubstantive(entry, ctx = {}) {
  if (!entry || typeof entry !== 'object') return false;
  const key = asDocsRel(entry.path || entry.page_id);
  const dossier = (ctx.dossiers && ctx.dossiers[key]) || null;
  const artifacts = ctx.artifacts || ctx.secondReviewArtifacts || {};
  const done = Boolean(
    entry.second_review_done === true || (dossier && dossier.second_review_done === true)
  );
  const run =
    entry.second_review_run_id ||
    entry.secondReviewRunId ||
    (dossier && dossier.second_review_run_id);
  const reviewer = entry.second_reviewer || (dossier && dossier.second_reviewer);
  if (!done || !run || !reviewer) return false;
  if (SEAL_HOSTILE_BAND.test(String(run))) {
    return secondReviewHasArtifact(key, entry, artifacts);
  }
  return true;
}

/**
 * True when a dossier or its hostile artifact forbids a verified stamp.
 * @param {object|null} dossier
 * @param {object|null} artifact
 */
function dossierBlocksVerified(dossier, artifact) {
  if (dossier && dossier.never_verified === true) return true;
  if (dossier && dossier.pedagogical_verdict && dossier.pedagogical_verdict.verified === false) {
    return true;
  }
  if (artifact && (artifact.never_verified === true || artifact.file_never_verified === true)) {
    return true;
  }
  if (artifact && artifact.verified === false) return true;
  return false;
}

/**
 * Honest second-review fields: keep the completion flag only when a finding
 * file lists this path. Clear seal-assigned hostileBand ids otherwise.
 * @param {string} rel
 * @param {object} dossier
 * @param {object} artifacts
 */
function honestSecondReviewFields(rel, dossier, artifacts) {
  const key = asDocsRel(rel);
  const art = artifacts && artifacts[key];
  const covered = Boolean(art && (art.finding_ids.length > 0 || art.confirmed_ok));
  if (covered) {
    return {
      second_review_required: true,
      second_review_done: true,
      second_review_run_id: (art.run_ids && art.run_ids[0]) || (dossier && dossier.second_review_run_id),
      second_reviewer: (art.reviewers && art.reviewers[0]) || (dossier && dossier.second_reviewer),
    };
  }
  const run = dossier && dossier.second_review_run_id;
  const reviewer = dossier && dossier.second_reviewer;
  const sealRun = SEAL_HOSTILE_BAND.test(String(run || ''));
  const sealReviewer = /^hostile-agent-[A-D]$/.test(String(reviewer || ''));
  return {
    second_review_required: true,
    second_review_done: false,
    second_review_run_id: sealRun ? undefined : run,
    second_reviewer: sealReviewer ? undefined : reviewer,
  };
}

function applyHonestSecondReviewToDossier(dossier, rel, artifacts) {
  const next = { ...(dossier || {}) };
  const fields = honestSecondReviewFields(rel, next, artifacts);
  next.second_review_required = true;
  next.second_review_done = fields.second_review_done;
  if (fields.second_review_run_id) next.second_review_run_id = fields.second_review_run_id;
  else delete next.second_review_run_id;
  if (fields.second_reviewer) next.second_reviewer = fields.second_reviewer;
  else delete next.second_reviewer;
  return next;
}

function pageSourcesHaveLocatorStamp(sources) {
  if (!Array.isArray(sources)) return false;
  return sources.some((s) => {
    if (!s || typeof s !== 'object') return false;
    return (
      isLocatorStampExcerpt(s.excerpt) ||
      isLocatorStampExcerpt(s.locator) ||
      isLocatorStampExcerpt(s.section) ||
      isLocatorStampExcerpt(s.passage)
    );
  });
}

/**
 * @param {object} input
 * @returns {{ ok: boolean, errors: string[], stats: object }}
 */
function validateCampaignFinal(input) {
  const errors = [];
  const inventoryPaths = (input.inventoryPaths || []).map(asDocsRel).sort();
  const pagesFinales = input.pagesFinales || [];
  const transitions = input.transitions || [];
  const initialPageIds = (input.initialPageIds || inventoryPaths).map(asDocsRel);
  const createdPageIds = (input.createdPageIds || []).map(asDocsRel);
  const primary = input.primaryPartition || [];
  const counter = input.counterPartition || [];
  const manifest = input.manifest || { pages: [] };
  const artifacts = input.secondReviewArtifacts || input.artifacts || {};
  const dossiers = input.dossiers || {};

  const byPath = new Map();
  for (const e of pagesFinales) {
    const key = asDocsRel(e.path || e.page_id);
    if (!key) {
      errors.push('pages_finales entry without path');
      continue;
    }
    if (byPath.has(key)) errors.push(`duplicate pages_finales path: ${key}`);
    byPath.set(key, e);

    const status = e.status || e.result;
    if (status !== 'verified') {
      errors.push(`${key}: pages_finales status=${status} (only verified is terminal)`);
    }
    if (NON_FINAL.has(status) && status !== 'verified') {
      errors.push(`${key}: non-terminal status in pages_finales`);
    }
    if (!e.content_hash && !e.hash) {
      errors.push(`${key}: missing content hash`);
    }
    const expectedHash = (input.hashes || {})[key];
    const got = e.content_hash || e.hash;
    if (expectedHash && got && expectedHash !== got) {
      errors.push(`${key}: stale hash`);
    }
    const proof = e.proof_kind || e.verification_kind;
    if (proof && BANNED_PROOF.has(proof)) {
      errors.push(`${key}: verified from banned proof_kind=${proof}`);
    }
    if (isScopePathStamp(e.proof_kind) || proof === 'scope: path') {
      errors.push(`${key}: scope path stamp is not proof`);
    }
    const primaryRun = e.primary_run_id || e.primaryRunId;
    const secondRun = e.second_review_run_id || e.secondReviewRunId;
    const pedagogical = e.kind ? e.kind === 'pedagogical_fiche' : true;
    if (pedagogical || e.require_second_review !== false) {
      if (!primaryRun || !secondRun) {
        errors.push(`${key}: missing primary_run_id or second_review_run_id`);
      } else if (primaryRun === secondRun) {
        errors.push(`${key}: primary and second run_id are identical`);
      }
      const pr = e.primary_reviewer || e.reviewer_primary;
      const sr = e.second_reviewer;
      if (pr && sr && pr === sr) {
        errors.push(`${key}: primary and second reviewer are identical`);
      }
      if (e.second_review_required && !e.second_review_done) {
        errors.push(`${key}: incomplete required second review`);
      }
      if (SEAL_HOSTILE_BAND.test(String(secondRun || ''))) {
        if (!secondReviewHasArtifact(key, e, artifacts)) {
          errors.push(
            `${key}: seal-assigned hostileBand run_id without per-page second-review artifact`
          );
        }
      }
      if (!secondReviewIsSubstantive(e, { artifacts, dossiers })) {
        errors.push(`${key}: second review is not substantive`);
      }
    }
    if (e.never_verified === true) {
      errors.push(`${key}: never_verified page cannot be verified`);
    }
    const dossier = dossiers[key];
    if (dossierBlocksVerified(dossier, artifacts[key])) {
      errors.push(
        `${key}: never_verified dossier or pedagogical_verdict.verified=false cannot be verified`
      );
    }
    if (pageSourcesHaveLocatorStamp(e.sources || [])) {
      errors.push(`${key}: sources contain [locator for stamp excerpts`);
    }
    if (!sourcesQualifyAsProof(key, e.sources || [])) {
      errors.push(
        `${key}: sources are not sufficient proof (homepage/scope stamp/locator stamp/missing locator)`
      );
    }
    const srcList = Array.isArray(e.sources) ? e.sources : [];
    if (srcList.some((s) => !sourceIsSufficientProof(s) && s && s.kind === 'confirmed')) {
      errors.push(`${key}: kind=confirmed is not a substitute for sufficient proof`);
    }
  }

  for (const p of inventoryPaths) {
    if (!byPath.has(p)) errors.push(`inventory path missing from pages_finales: ${p}`);
  }
  for (const p of byPath.keys()) {
    if (!inventoryPaths.includes(p)) {
      errors.push(`pages_finales path not in inventory: ${p}`);
    }
  }

  const eq = identityEquation({
    initialPageIds,
    createdPageIds,
    transitions,
    finalPageIds: [...byPath.keys()],
  });
  errors.push(...eq.errors);

  const parts = partitionProof(primary, counter, inventoryPaths);
  errors.push(...parts.errors);

  const manPages = Array.isArray(manifest.pages)
    ? manifest.pages
    : Array.isArray(manifest.entries)
      ? manifest.entries
      : [];
  const manSet = new Set(manPages.map((m) => asDocsRel(m.path || m.page_id)));
  for (const p of inventoryPaths) {
    if (!manSet.has(p)) errors.push(`manifest missing ${p}`);
  }
  if (manPages.length !== inventoryPaths.length && inventoryPaths.length > 0) {
    if (manPages.length !== byPath.size) {
      errors.push(
        `manifest size ${manPages.length} != inventory ${inventoryPaths.length}`
      );
    }
  }

  const fps = new Map();
  for (const e of pagesFinales) {
    const fp = sourceFingerprint(e.sources || []);
    if (!fp) continue;
    if (!fps.has(fp)) fps.set(fp, []);
    fps.get(fp).push(asDocsRel(e.path || e.page_id));
  }
  let copiedStamps = 0;
  for (const [, pages] of fps) {
    if (pages.length < 8) continue;
    const sample = pagesFinales.find((x) => asDocsRel(x.path || x.page_id) === pages[0]);
    const nsrc = sample && Array.isArray(sample.sources) ? sample.sources.length : 0;
    if (nsrc > 0 && nsrc <= 3) {
      copiedStamps += 1;
      errors.push(
        `copied source stamp on ${pages.length} pages (e.g. ${pages.slice(0, 3).join(', ')})`
      );
    }
  }

  const closure = input.closure || null;
  if (input.requireClosure) {
    if (!closure || typeof closure !== 'object') {
      errors.push('closure.json missing');
    } else {
      const binaries = closure.criteria || closure.gates || {};
      for (const [k, v] of Object.entries(binaries)) {
        if (v !== true) errors.push(`closure criterion ${k} is not true`);
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    stats: {
      inventory: inventoryPaths.length,
      pages_finales: pagesFinales.length,
      transitions: transitions.length,
      copied_source_groups: copiedStamps,
    },
  };
}

function assertFinalStatus(status) {
  return FINAL_STATUSES.has(status);
}

module.exports = {
  validateCampaignFinal,
  assertFinalStatus,
  FINAL_STATUSES,
  NON_FINAL,
  BANNED_PROOF,
  SEAL_HOSTILE_BAND,
  collectSecondReviewArtifacts,
  secondReviewHasArtifact,
  secondReviewIsSubstantive,
  dossierBlocksVerified,
  honestSecondReviewFields,
  applyHonestSecondReviewToDossier,
  pageSourcesHaveLocatorStamp,
};
