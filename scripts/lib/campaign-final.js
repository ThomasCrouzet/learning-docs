/**
 * Gate lint:campaign-final - manifeste compact, hashes, partitions,
 * run_id distincts, transitions, closure.
 */

const {
  identityEquation,
  partitionProof,
  pageIdFromDocsRel,
} = require('./campaign-inventory');
const { sourcesQualifyAsProof, sourceFingerprint, isScopePathStamp } = require('./campaign-sources');

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
]);

function asDocsRel(p) {
  return pageIdFromDocsRel(String(p || '').replace(/^docs\//, ''));
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
    }
    if (!sourcesQualifyAsProof(key, e.sources || [])) {
      errors.push(`${key}: sources are not sufficient proof (homepage/scope stamp/missing locator)`);
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
};
