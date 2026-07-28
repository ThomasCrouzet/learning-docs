const fs = require('fs');
const path = require('path');
const { isValidFilename, isValidDirname } = require('./lib/filenames');

const DOCS_DIR = path.join(__dirname, '..', 'docs');

function checkDirectory(dir, depth = 0) {
  const errors = [];

  let items;
  try {
    items = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return [`Cannot read directory: ${dir}`];
  }

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relativePath = path.relative(DOCS_DIR, fullPath);

    if (item.isDirectory()) {
      // Ignorer certains dossiers
      if (item.name === 'node_modules' || item.name.startsWith('.')) {
        continue;
      }

      if (!isValidDirname(item.name)) {
        errors.push(`Nom de dossier invalide: ${relativePath}`);
      }

      // Parcourir r\u00e9cursivement
      errors.push(...checkDirectory(fullPath, depth + 1));

    } else if (item.name.endsWith('.md')) {
      if (!isValidFilename(item.name)) {
        errors.push(`Nom de fichier invalide: ${relativePath}`);
      }
    }
  }

  return errors;
}

// Ex\u00e9cution
console.log('V\u00e9rification de la nomenclature des fichiers...\n');

const errors = checkDirectory(DOCS_DIR);

if (errors.length > 0) {
  console.error(`${errors.length} erreur(s) trouv\u00e9e(s):\n`);
  errors.forEach(e => console.error(`  - ${e}`));
  console.log('\nFormat attendu:');
  console.log('  - Fichiers: [00-99]-[nom-en-kebab-case].md');
  console.log('  - Dossiers: [00-99]-[nom-en-kebab-case]');
  process.exit(1);
} else {
  console.log('Tous les fichiers respectent la convention de nommage.');
  process.exit(0);
}
