import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {
  leftoverMermaidFences,
  iframeTargets,
  inspectDiagramHtml,
  publishedDiagramHref,
  resolvePublishedSrc,
} = require('../lib/diagram-design');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DOCS = path.join(ROOT, 'docs');
const DIAGRAMS = path.join(DOCS, 'diagrams');

describe('diagram-design (shipped docs)', () => {
  it('docs/ no longer publishes mermaid fences', () => {
    expect(leftoverMermaidFences(DOCS)).toEqual([]);
  });

  it('carte-cursus embeds the diagram-design HTML', () => {
    const md = fs.readFileSync(path.join(DOCS, 'carte-cursus.md'), 'utf8');
    expect(md).toContain('../diagrams/carte-cursus-1.html');
    expect(md).not.toMatch(/```mermaid\b/);
  });

  it('detects mermaid leftover syntax in SVG text via inspectDiagramHtml', () => {
    const slop = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      'fixtures/mermaid-slop.html',
    );
    expect(inspectDiagramHtml(slop).hasMermaidSlop).toBe(true);
  });

  it('flags raw mermaid node quotes even without ER tokens', () => {
    const slop = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      'fixtures/mermaid-slop-quotes.html',
    );
    const html = fs.readFileSync(slop, 'utf8');
    expect(html).not.toContain('}o --');
    expect(html).toContain('Lint Backend"]');
    expect(html).toContain('L2["lint-js"]');
    expect(inspectDiagramHtml(slop).hasMermaidSlop).toBe(true);
  });

  it('CI/CD replacement figures no longer leak mermaid node syntax', () => {
    const ci = inspectDiagramHtml(path.join(DIAGRAMS, '11-ci-cd-10-projet-integrateur-2.html'));
    const gitlab = inspectDiagramHtml(path.join(DIAGRAMS, '11-ci-cd-06-gitlab-ci-introduction-1.html'));
    const m2m = inspectDiagramHtml(path.join(DIAGRAMS, '03-symfony-07-relations-entites-2.html'));
    expect(ci.hasMermaidSlop).toBe(false);
    expect(gitlab.hasMermaidSlop).toBe(false);
    expect(m2m.hasMermaidSlop).toBe(false);
    const ciHtml = fs.readFileSync(ci.file, 'utf8');
    const glHtml = fs.readFileSync(gitlab.file, 'utf8');
    const erHtml = fs.readFileSync(m2m.file, 'utf8');
    expect(ciHtml).toContain('Lint Backend');
    expect(ciHtml).toContain('Lint Frontend');
    expect(ciHtml).toContain('ETAPE 2 : CD (MAIN UNIQUEMENT)');
    expect(glHtml).toContain('lint-php');
    expect(glHtml).toContain('lint-js');
    expect(glHtml).toContain('lint-md');
    expect(glHtml).toContain('test-php');
    expect(glHtml).toContain('test-js');
    expect(erHtml).toContain('N:N');
    expect(erHtml).toContain('BOOK');
    expect(erHtml).toContain('AUTHOR');
  });

  it('jointures ER keeps entity names and readable cardinalities', () => {
    const html = fs.readFileSync(
      path.join(DIAGRAMS, '04-postgresql-03-jointures-1.html'),
      'utf8',
    );
    expect(html).toContain('USERS');
    expect(html).toContain('ARTICLES');
    expect(html).toContain('COMMENTS');
    expect(html).toContain('écrit 1:N');
    expect(html).not.toMatch(/\|\|\s*--/);
    expect(inspectDiagramHtml(path.join(DIAGRAMS, '04-postgresql-03-jointures-1.html')).hasMermaidSlop).toBe(false);
  });

  it('iframe src is the MkDocs directory-URL path, not the markdown dirname', () => {
    const fiche = path.join(DOCS, '04-postgresql/03-jointures.md');
    const href = publishedDiagramHref(DOCS, fiche, '04-postgresql-03-jointures-1.html');
    expect(href).toBe('../../diagrams/04-postgresql-03-jointures-1.html');
    const md = fs.readFileSync(fiche, 'utf8');
    expect(md).toContain(`src="${href}"`);
    const abs = resolvePublishedSrc(DOCS, fiche, href);
    expect(fs.existsSync(abs)).toBe(true);
    const fromPublishedPage = path.normalize(
      path.join(DOCS, '04-postgresql/03-jointures', href),
    );
    expect(fromPublishedPage).toBe(abs);
    const fromMarkdownDir = path.normalize(
      path.join(DOCS, '04-postgresql', href),
    );
    expect(fromMarkdownDir).not.toBe(abs);
  });

  it('every docs/diagrams HTML is an accessible static SVG', () => {
    const files = fs.readdirSync(DIAGRAMS).filter((n) => n.endsWith('.html'));
    expect(files.length).toBeGreaterThan(10);
    for (const name of files) {
      const info = inspectDiagramHtml(path.join(DIAGRAMS, name));
      expect(info.hasSvg, name).toBe(true);
      expect(info.hasRoleImg, name).toBe(true);
      expect(info.hasTitle, name).toBe(true);
      expect(info.hasDesc, name).toBe(true);
      expect(info.hasMermaidFence, name).toBe(false);
      expect(info.hasMermaidRuntime, name).toBe(false);
      expect(info.hasGoogleFonts, name).toBe(false);
      expect(info.hasMermaidSlop, name).toBe(false);
    }
  });

  it('every iframe in docs points at an existing diagram HTML', () => {
    const targets = iframeTargets(DOCS).filter((t) => t.href.includes('diagrams/'));
    expect(targets.length).toBeGreaterThan(10);
    const missing = targets.filter((t) => !fs.existsSync(t.abs));
    expect(missing).toEqual([]);
  });

  it('diagram filenames and iframe hrefs stay ASCII', () => {
    const nonAscii = /[^\u0000-\u007f]/;
    const files = fs.readdirSync(DIAGRAMS).filter((n) => n.endsWith('.html'));
    expect(files.filter((n) => nonAscii.test(n))).toEqual([]);
    const accentedHrefs = iframeTargets(DOCS)
      .filter((t) => t.href.includes('diagrams/') && nonAscii.test(path.basename(t.href)))
      .map((t) => t.href);
    expect(accentedHrefs).toEqual([]);
  });
});
