import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DOCS = path.join(ROOT, 'docs');

function walk(dir) {
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

describe('content guards (shipped docs)', () => {
  const files = walk(DOCS);

  it('does not pin PHPUnit verbose="true" (removed in PHPUnit 10+)', () => {
    const hits = [];
    for (const f of files) {
      const t = fs.readFileSync(f, 'utf8');
      if (t.includes('verbose="true"')) hits.push(path.relative(ROOT, f));
    }
    expect(hits).toEqual([]);
  });

  it('does not document messenger:failed:retry --all (option does not exist)', () => {
    const hits = [];
    for (const f of files) {
      const t = fs.readFileSync(f, 'utf8');
      if (t.includes('failed:retry --all')) hits.push(path.relative(ROOT, f));
    }
    expect(hits).toEqual([]);
  });

  it('does not teach the AMF PSAN register as the live 2026 check', () => {
    const hits = [];
    for (const f of files) {
      const t = fs.readFileSync(f, 'utf8');
      if (/Liste des PSAN enregistr/i.test(t) || /liste des PSAN de l'AMF/i.test(t)) {
        hits.push(path.relative(ROOT, f));
      }
    }
    expect(hits).toEqual([]);
  });

  it('does not keep micro-BNC 77 700 as the current 2026 threshold', () => {
    const hits = [];
    for (const f of files) {
      const t = fs.readFileSync(f, 'utf8');
      if (t.includes('77 700')) hits.push(path.relative(ROOT, f));
    }
    expect(hits).toEqual([]);
  });

  it('does not present Amazon 746 M EUR as a standing fine', () => {
    const hits = [];
    for (const f of files) {
      const t = fs.readFileSync(f, 'utf8');
      if (t.includes('746 M') && !/annul/i.test(t)) hits.push(path.relative(ROOT, f));
    }
    expect(hits).toEqual([]);
  });

  it('does not state the ICO British Airways fine as 22 M GBP', () => {
    const hits = [];
    for (const f of files) {
      const t = fs.readFileSync(f, 'utf8');
      if (/British Airways/.test(t) && /22 M GBP/.test(t)) {
        hits.push(path.relative(ROOT, f));
      }
    }
    expect(hits).toEqual([]);
  });

  it('does not label RFC 1918 172.16/12 as Class B or 192.168/16 as Class C', () => {
    const hits = [];
    for (const f of files) {
      const t = fs.readFileSync(f, 'utf8');
      if (/172\.16\.0\.0[^\n]*\|\s*B\s*\|/.test(t) || /\|\s*B\s*\|[^\n]*172\.16\.0\.0/.test(t)) {
        hits.push(path.relative(ROOT, f));
      }
    }
    expect(hits).toEqual([]);
  });

  it('states the DORA Art. 19 initial clock as 4 hours', () => {
    const f = path.join(
      DOCS,
      'cybersecurite/08-expertise-leadership/02-grc-avancee.md'
    );
    const t = fs.readFileSync(f, 'utf8');
    expect(t).toMatch(/4 heures/);
    expect(t).not.toMatch(
      /Notification initiale : dès que l'incident majeur est classifié\n/
    );
  });

  it('does not answer audience analytics with legitimate interest alone', () => {
    const f = path.join(DOCS, '26-droit-rgpd/01-introduction-rgpd.md');
    const t = fs.readFileSync(f, 'utf8');
    expect(t).not.toMatch(
      /Analyse de navigation → Intérêts légitimes \(si proportionné/
    );
  });

  it('pins Grafana Tempo 3.0.x in the monitoring integrator versions table and compose image', () => {
    const f = path.join(DOCS, '14-monitoring/10-projet-integrateur.md');
    const t = fs.readFileSync(f, 'utf8');
    expect(t).toMatch(/\|\s*Grafana Tempo\s*\|\s*3\.0\.x\s*\|/);
    expect(t).not.toMatch(/\|\s*Grafana Tempo\s*\|\s*2\.5/);
    expect(t).toMatch(/grafana\/tempo:3\.0\.0/);
  });

  it('uses local JSON for TanStack Query steps, not JSONPlaceholder', () => {
    const f = path.join(DOCS, '08-react/18-tanstack-query.md');
    const t = fs.readFileSync(f, 'utf8');
    expect(t).toMatch(/\/api\/posts\.json/);
    expect(t).not.toMatch(/jsonplaceholder/i);
  });
});

describe('course-focus branding (shipped scanner)', () => {
  it('flags school and diploma tokens in sample text', () => {
    const { scanText } = require('../lib/course-focus-branding.js');
    const hits = scanText(
      'Cursus Epitech\nTitre RNCP38114\nFrance Compétences\nETNA\nBC01\nmoulinette',
      'sample.md'
    );
    const ids = hits.map((h) => h.id).sort();
    expect(ids).toEqual(
      ['bc-code', 'epitech', 'etna', 'france-competences', 'moulinette', 'rncp'].sort()
    );
  });

  it('does not flag ordinary course vocabulary', () => {
    const { scanText } = require('../lib/course-focus-branding.js');
    const hits = scanText(
      'Cursus Java, Git et Unix/Bash. Ce wiki n\'est pas une certification professionnelle.',
      'sample.md'
    );
    expect(hits).toEqual([]);
  });

  it('scans the published wiki and reports zero school or diploma branding', () => {
    const { scanCourseFocusBranding } = require('../lib/course-focus-branding.js');
    const { hits, structural } = scanCourseFocusBranding(ROOT);
    expect(structural).toEqual([]);
    expect(hits).toEqual([]);
  });
});
