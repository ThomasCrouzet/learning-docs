#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createState, buildNavigation, generateArtifacts, replaceNavigation } = require('./lib/curriculum-v2');

const ROOT = path.join(__dirname, '..');
if (process.argv.includes('--check')) {
  require('./check-curriculum-v2');
} else {
  const state = createState(ROOT);
  if (state.errors.length) {
    console.error(`Génération impossible: ${state.errors.length} erreur(s)`);
    for (const error of state.errors) console.error(`- ${error}`);
    process.exit(1);
  }
  const artifacts = generateArtifacts(ROOT, state);
  const mkdocsPath = path.join(ROOT, 'mkdocs.yml');
  artifacts.set(mkdocsPath, replaceNavigation(fs.readFileSync(mkdocsPath, 'utf8'), buildNavigation(state.catalog, state.inventory.records)));
  for (const [filePath, content] of artifacts) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
  }
  console.log(`Cursus v2 généré: ${state.catalog.domains.length} domaines, ${state.catalog.courses.length} cursus, ${state.catalog.modules.length} modules, ${state.inventory.records.length} fiches.`);
}
