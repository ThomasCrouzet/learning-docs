#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');
const errors = [];

function readFile(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath));
}

function compareFiles(publicPath, packagePath) {
  if (!readFile(publicPath).equals(readFile(packagePath))) {
    errors.push(`${publicPath} ne correspond pas à ${packagePath}`);
  }
}

function normalizeKaTeXCss(content) {
  // Le site ne distribue que les polices WOFF2 : on retire les fallbacks WOFF/TTF du CSS amont.
  return content.replace(
    /,url\(fonts\/[^)]*\.woff\) format\("woff"\),url\(fonts\/[^)]*\.ttf\) format\("truetype"\)/g,
    ''
  );
}

function compareKaTeXCss() {
  const publicCss = readFile('docs/stylesheets/katex.min.css').toString('utf8');
  const packageCss = readFile('node_modules/katex/dist/katex.min.css').toString('utf8');

  if (publicCss !== normalizeKaTeXCss(packageCss)) {
    errors.push('docs/stylesheets/katex.min.css ne correspond pas au CSS KaTeX normalisé');
  }
}

function compareKaTeXFonts() {
  const publicDir = path.join(repoRoot, 'docs/stylesheets/fonts');
  const packageDir = path.join(repoRoot, 'node_modules/katex/dist/fonts');
  const packageFonts = fs.readdirSync(packageDir)
    .filter(file => file.endsWith('.woff2'))
    .sort();
  const publicFonts = fs.readdirSync(publicDir)
    .filter(file => file.endsWith('.woff2'))
    .sort();

  if (JSON.stringify(publicFonts) !== JSON.stringify(packageFonts)) {
    errors.push('la liste des polices KaTeX WOFF2 ne correspond pas au paquet installé');
    return;
  }

  for (const font of packageFonts) {
    compareFiles(
      path.join('docs/stylesheets/fonts', font),
      path.join('node_modules/katex/dist/fonts', font)
    );
  }
}

compareFiles(
  'docs/javascripts/mermaid.min.js',
  'node_modules/mermaid/dist/mermaid.min.js'
);
compareFiles(
  'docs/javascripts/katex.min.js',
  'node_modules/katex/dist/katex.min.js'
);
compareFiles(
  'docs/javascripts/katex-auto-render.min.js',
  'node_modules/katex/dist/contrib/auto-render.min.js'
);
compareKaTeXCss();
compareKaTeXFonts();

if (errors.length > 0) {
  console.error('Les assets tiers embarqués ne sont pas synchronisés :');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Assets tiers synchronisés avec les dépendances installées.');
