#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createState, buildNavigation, generateArtifacts, replaceNavigation } = require('./lib/curriculum-v2');

const ROOT = path.join(__dirname, '..');
const state = createState(ROOT);
const errors = [...state.errors];
if (!errors.length) {
  const artifacts = generateArtifacts(ROOT, state);
  const mkdocsPath = path.join(ROOT, 'mkdocs.yml');
  artifacts.set(mkdocsPath, replaceNavigation(fs.readFileSync(mkdocsPath, 'utf8'), buildNavigation(state.catalog, state.inventory.records)));
  for (const [filePath, expected] of artifacts) {
    const actual = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
    if (actual !== expected) errors.push(`${path.relative(ROOT, filePath)}: artefact généré périmé`);
  }
}
if (errors.length) {
  console.error(`Validation du cursus v2: ${errors.length} erreur(s)`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Cursus v2 valide: ${state.catalog.domains.length} domaines, ${state.catalog.courses.length} cursus, ${state.catalog.modules.length} modules, ${state.paths.paths.length} parcours, ${state.inventory.records.length} fiches, aucun cycle.`);
