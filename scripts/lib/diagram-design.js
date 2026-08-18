/**
 * Garde-fous des figures diagram-design (HTML + SVG) dans docs/.
 */

const fs = require('fs');
const path = require('path');

const FENCE = /```mermaid\b/;

function walkMarkdown(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (name === 'javascripts' || name === 'stylesheets' || name === 'overrides') continue;
      out.push(...walkMarkdown(p));
    } else if (name.endsWith('.md')) {
      out.push(p);
    }
  }
  return out;
}

/**
 * MkDocs use_directory_urls: docs/a/b.md is served as a/b/index.html.
 * Relative links must be computed from that published page, not from the .md.
 */
function publishedPageDir(docsDir, mdFile) {
  const rel = path.relative(docsDir, mdFile).replace(/\\/g, '/');
  let page = rel.replace(/\.md$/i, '');
  if (page === 'index' || page.endsWith('/index')) {
    page = page.replace(/\/?index$/, '');
  }
  return page;
}

function publishedDiagramHref(docsDir, mdFile, htmlName) {
  const page = publishedPageDir(docsDir, mdFile);
  const depth = page === '' ? 0 : page.split('/').filter(Boolean).length;
  return `${'../'.repeat(depth)}diagrams/${htmlName}`;
}

function resolvePublishedSrc(docsDir, mdFile, src) {
  const pageDir = publishedPageDir(docsDir, mdFile);
  return path.normalize(path.join(docsDir, pageDir, src));
}

function leftoverMermaidFences(docsDir) {
  const hits = [];
  for (const file of walkMarkdown(docsDir)) {
    const text = fs.readFileSync(file, 'utf8');
    if (FENCE.test(text)) hits.push(path.relative(docsDir, file));
  }
  return hits;
}

function iframeTargets(docsDir) {
  const targets = [];
  const re = /src="([^"]+\.html)"/g;
  for (const file of walkMarkdown(docsDir)) {
    const text = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = re.exec(text))) {
      const abs = resolvePublishedSrc(docsDir, file, match[1]);
      targets.push({ from: file, href: match[1], abs });
    }
  }
  return targets;
}

function inspectDiagramHtml(file) {
  const text = fs.readFileSync(file, 'utf8');
  return {
    file,
    exists: true,
    hasSvg: /<svg[\s>]/.test(text),
    hasRoleImg: /role="img"/.test(text),
    hasTitle: /<title\s+id="[^"]+"/.test(text),
    hasDesc: /<desc\s+id="[^"]+"/.test(text),
    hasMermaidFence: FENCE.test(text),
    hasMermaidRuntime: /mermaid\.min\.js|mermaid\.initialize/.test(text),
    hasGoogleFonts: /fonts\.googleapis\.com/.test(text),
    // Quotes brutes ([" / "]) : fuite mermaid A["label"] copiée telle quelle dans le SVG.
    hasMermaidSlop: /<text\b[^>]*>[^<]*(?:--&gt;|-->|\|\|\s*--|\[&quot;|&quot;\]|\["|"\]|}o --|o\{|&lt;\|--|&lt;\|\.\.|--\|&gt;)/.test(text),
  };
}

module.exports = {
  leftoverMermaidFences,
  iframeTargets,
  inspectDiagramHtml,
  walkMarkdown,
  publishedDiagramHref,
  resolvePublishedSrc,
  publishedPageDir,
};
