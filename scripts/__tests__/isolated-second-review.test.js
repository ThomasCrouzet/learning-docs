import { describe, it, expect } from 'vitest';
import isolated from '../lib/isolated-second-review-paths.js';

const SENS = (p) =>
  /^(cybersecurite|crypto-monnaies|26-droit-rgpd|22-cloud|competences-metier|ia\/)/.test(
    p
  );

describe('isolated second-review path set', () => {
  it('is an explicit path list, not the SENS() prefix regex', () => {
    expect(isolated.has('15-python/01-introduction-python.md')).toBe(false);
    expect(SENS('15-python/01-introduction-python.md')).toBe(false);
    expect(
      isolated.has('cybersecurite/01-fondamentaux-informatiques/03-reseaux-protocoles.md')
    ).toBe(true);
    expect(isolated.has('26-droit-rgpd/01-introduction-rgpd.md')).toBe(true);
    expect(isolated.has('26-droit-rgpd/04-conformite-pratique.md')).toBe(true);
  });

  it('does not treat every SENS prefix as a completed second review', () => {
    const fakeSensOnly = 'competences-metier/BC99-does-not-exist.md';
    expect(SENS(fakeSensOnly)).toBe(true);
    expect(isolated.has(fakeSensOnly)).toBe(false);
  });
});
