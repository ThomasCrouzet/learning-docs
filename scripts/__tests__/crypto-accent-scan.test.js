const {
  processCryptoMarkdown,
  scanCryptoMarkdown,
  coverageSummary,
  syncFinalReportMarkdown,
  parseFinalReportCoverageClaims,
  reportClaimsZeroCryptoAccents,
} = require('../lib/crypto-accent-scan');

describe('processCryptoMarkdown', () => {
  it('fixes accents in prose and text fences, not in solidity', () => {
    const src = [
      '# Titre',
      '',
      'La securite est importante.',
      '',
      '```text',
      'Entree : Bonjour',
      'cle privee',
      '```',
      '',
      '```solidity',
      '// securite comment ignored',
      'uint256 securite = 1;',
      '```',
      '',
    ].join('\n');
    const { content, hitCount } = processCryptoMarkdown(src);
    expect(hitCount).toBeGreaterThan(0);
    expect(content).toContain('sécurité');
    expect(content).toContain('Entrée');
    expect(content).toContain('clé privée');
    // solidity body unchanged
    expect(content).toContain('uint256 securite = 1;');
    expect(content).toContain('// securite comment ignored');
  });

  it('is idempotent after fix', () => {
    const src = 'La securite et les prerequis.\n';
    const once = processCryptoMarkdown(src);
    const twice = processCryptoMarkdown(once.content);
    expect(twice.hitCount).toBe(0);
  });
});

describe('scanCryptoMarkdown', () => {
  it('reports hitCount when accents missing in text fence', () => {
    const r = scanCryptoMarkdown('```text\nVerifier la securite\n```\n', 'x.md');
    expect(r.hitCount).toBeGreaterThan(0);
  });
});

describe('coverageSummary + syncFinalReportMarkdown', () => {
  it('extracts summary and rewrites table counts', () => {
    const coverage = {
      summary: { corrected: 10, audited: 20, uncertain: 5, pending: 0 },
      pages: new Array(35).fill(0).map((_, i) => ({
        path: `p${i}.md`,
        editorial_status: i < 10 ? 'corrected' : i < 30 ? 'audited' : 'uncertain',
      })),
    };
    const s = coverageSummary(coverage);
    expect(s).toEqual({
      corrected: 10,
      audited: 20,
      uncertain: 5,
      pending: 0,
      total: 35,
    });

    const report = [
      '| Statut | Signification | Pages |',
      '| ------ | ------------- | ----: |',
      '| **corrected** | Diff | **999** |',
      '| **audited** | Vague | **888** |',
      '| **uncertain** | Sample | **777** |',
      '| **pending** | - | **1** |',
      '| **Total avec statut** | | **100** |',
      '',
      'Les 324 audited reposent sur les journaux.',
      '199 pages en **uncertain** (voir ci-dessus)',
      'Deep-audit des 199 `uncertain` (stack)',
      '- Accents crypto : claim bogus complete 0 résiduels mesurés',
    ].join('\n');

    const synced = syncFinalReportMarkdown(report, s, { accentHitCount: 0 });
    const claims = parseFinalReportCoverageClaims(synced);
    expect(claims).toEqual({ corrected: 10, audited: 20, uncertain: 5 });
    expect(synced).toContain('**10**');
    expect(synced).toContain('**20**');
    expect(synced).toContain('**5**');
    expect(synced).toMatch(/Deep-audit des \*\*5\*\* `uncertain`/);
    expect(synced).toMatch(/0 résiduel/);
  });

  it('detects zero-accent claims', () => {
    expect(reportClaimsZeroCryptoAccents('scanner résiduel = **0**')).toBe(true);
    expect(
      reportClaimsZeroCryptoAccents('scanner résiduel = **12** (pas revendiqué complet)')
    ).toBe(false);
  });
});

describe('gate: report claims must match coverage', () => {
  it('fails when table numbers diverge from summary', () => {
    const report = '| **corrected** | x | **1** |\n| **audited** | y | **2** |\n| **uncertain** | z | **3** |\n';
    const claims = parseFinalReportCoverageClaims(report);
    const summary = { corrected: 10, audited: 20, uncertain: 5 };
    const mismatch =
      claims.corrected !== summary.corrected ||
      claims.audited !== summary.audited ||
      claims.uncertain !== summary.uncertain;
    expect(mismatch).toBe(true);
  });
});
