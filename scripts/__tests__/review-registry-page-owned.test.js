import { describe, it, expect } from 'vitest';
import {
  isPageOwnedEntry,
  extractPageOwnedFields,
  isGenericClaimText,
} from '../lib/review-registry-page-owned.js';

describe('page-owned review rows', () => {
  it('rejects lot_pass overlays and generic frontmatter stamps', () => {
    const rel = '15-python/01-introduction.md';
    expect(
      isPageOwnedEntry(rel, {
        review_depth: 'lot_pass',
        sources: [{ url: 'https://docs.python.org/3/', scope: `path:${rel}` }],
        claims_verified: [{ claim: 'frontmatter/structure 15-python/01-introduction.md' }],
        perishable_claims: [{ claim: 'no_perishable_flagged_in_lot_pass', status: 'ok' }],
        examples_executed: [{ status: 'skipped', reason: 'lot' }],
      })
    ).toBe(false);
    expect(isGenericClaimText('frontmatter/structure 15-python/01-introduction.md', rel)).toBe(
      true
    );
  });

  it('accepts a path-scoped entry with page-specific claims', () => {
    const rel = '15-python/01-introduction.md';
    expect(
      isPageOwnedEntry(rel, {
        review_depth: 'content_page',
        sources: [
          {
            url: 'https://docs.python.org/3/tutorial/appetite.html',
            scope: `path:${rel}`,
            section: '1. Whetting Your Appetite',
            excerpt:
              'If you do much work on computers, eventually you find that you want to automate some task.',
            claim_id: 'c-h1',
          },
        ],
        claims_verified: [{ claim: 'En bref: installer Python 3.12 et écrire un premier script' }],
        perishable_claims: [{ claim: 'Python 3.12', status: 'unchecked', note: rel }],
        examples_executed: [{ status: 'static', reason: '3 blocs dans ' + rel }],
      })
    ).toBe(true);
  });

  it('extracts unique H1 / En bref / path-scoped sources from a page body', () => {
    const rel = '15-python/99-fixture.md';
    const md = `---
estimated_time: "20 min"
fiche_number: 99
total_fiches: 99
cursus: "Python"
---

# 99 - Fixture unique

> **En bref** : Objectif unique de la fixture. Lecture estimée : 20 min.

## Objectif de cette fiche

À la fin de cette fiche, tu sauras extraire des claims.

### Qu'est-ce qu'une fixture ?

**Définition** : Une fixture est un texte de test déterministe.

PHP 8.3 n'apparaît pas ici. Python 3.12 est cité.
`;
    const fields = extractPageOwnedFields(rel, md);
    expect(fields.claims_verified.some((c) => c.claim.includes('Fixture unique'))).toBe(true);
    expect(fields.claims_verified.some((c) => String(c.claim).includes('Objectif unique'))).toBe(
      true
    );
    expect(fields.sources.every((s) => s.scope === `path:${rel}`)).toBe(true);
    expect(fields.sources.some((s) => s.url.includes('python.org'))).toBe(true);
    expect(isPageOwnedEntry(rel, { review_depth: 'content_page', ...fields })).toBe(true);
  });
});
