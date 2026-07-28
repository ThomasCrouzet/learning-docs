import { describe, it, expect } from 'vitest';
import {
  sourcesForPath,
  sourcesMatchPath,
  isGenericPerishableOnly,
  stringifyReserve,
} from '../lib/review-registry-sources.js';

describe('review-registry-sources (shipped path map)', () => {
  it('maps Python and data paths to official docs, not MongoDB', () => {
    const py = sourcesForPath('15-python/01-introduction.md');
    expect(py[0].url).toContain('python.org');
    const pd = sourcesForPath('16-python-data/01-introduction-data.md');
    expect(pd.some((s) => s.url.includes('pandas') || s.url.includes('numpy'))).toBe(
      true
    );
  });

  it('maps C and Kubernetes paths away from Rust / Compose-only stamps', () => {
    const c = sourcesForPath('19-langage-c/01-introduction-c.md');
    expect(c[0].url).toContain('cppreference');
    const k8s = sourcesForPath('devops/03-kubernetes/10-helm-gestionnaire-packages.md');
    expect(k8s.some((s) => s.url.includes('kubernetes.io') || s.url.includes('helm.sh'))).toBe(
      true
    );
  });

  it('maps 00-outils-ia to NIST, not LoRA arxiv alone', () => {
    const s = sourcesForPath('00-outils-ia/01-utiliser-ia-pour-apprendre.md');
    expect(s[0].url).toContain('nist.gov');
  });

  it('rejects known mismatched source sets', () => {
    expect(
      sourcesMatchPath('15-python/01.md', [
        {
          url: 'https://www.mongodb.com/docs/manual/aggregation/',
          topic: 'MongoDB aggregation',
        },
      ])
    ).toBe(false);
    expect(
      sourcesMatchPath('15-python/01.md', sourcesForPath('15-python/01.md'))
    ).toBe(true);
  });

  it('detects banned generic perishable ok stamp', () => {
    expect(
      isGenericPerishableOnly([
        { claim: 'no_perishable_flagged_in_lot_pass', status: 'ok' },
      ])
    ).toBe(true);
    expect(
      isGenericPerishableOnly([
        { claim: 'no_page_level_perishable_audit', status: 'unchecked' },
      ])
    ).toBe(false);
  });

  it('stringifies reserves without [object Object]', () => {
    expect(stringifyReserve({ a: 1 })).toBe('{"a":1}');
    expect(stringifyReserve('ok')).toBe('ok');
  });
});
