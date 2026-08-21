---
tags:
  - Node.js
  - Débutant
  - Pratique
description: "npm et gestion des packages"
estimated_time: "60 min"
fiche_number: 2
total_fiches: 10
cursus: "Node.js"
id: "fundamentals.nodejs.npm-packages"
course_id: "fundamentals.nodejs"
content_type: "lesson"
order: 2
---

# 02 - npm et gestion des packages

> **En bref** : À la fin de cette fiche, tu sauras initialiser un projet Node.js, installer des packages avec npm, et utiliser des bibliothèques externes dans ton code. Lecture estimée : 60 min.


## Prérequis

- Fiche [07-nodejs/01 - Introduction à Node.js](01-introduction-nodejs.md)
- Savoir exécuter un script avec `node fichier.js`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras initialiser un projet Node.js, installer des packages avec npm, et utiliser des bibliothèques externes dans ton code.

---

## Concepts

### Qu'est-ce que npm ?

**Définition** : npm (Node Package Manager) est le gestionnaire de packages de Node.js. Il permet d'installer, gérer et partager des bibliothèques de code.

**Le problème que npm résout** :

Sans npm, voici les problèmes rencontrés :

1. **Réinventer la roue** : Tu devrais coder toi-même des fonctionnalités courantes (dates, requêtes HTTP, validation...).
2. **Gestion manuelle** : Télécharger manuellement les fichiers de chaque bibliothèque.
3. **Pas de versioning** : Difficile de savoir quelle version de chaque bibliothèque est utilisée.
4. **Dépendances complexes** : Une bibliothèque peut avoir besoin d'autres bibliothèques.

**Comment npm résout ces problèmes** :

| Problème | Solution apportée par npm |
| -------- | ------------------------- |
| Réinventer la roue | Plus de 2 millions de packages disponibles |
| Gestion manuelle | Une commande installe tout |
| Pas de versioning | Versions exactes dans package.json |
| Dépendances complexes | npm installe automatiquement les sous-dépendances |

**Analogie concrète** : npm est comme un supermarché pour développeurs. Au lieu de cultiver tes légumes (écrire tout le code), tu achètes des produits finis (packages) que d'autres ont préparés. Tu as un ticket de caisse (package.json) qui liste exactement ce que tu as pris.

---

### Le fichier package.json

**Définition** : `package.json` est le fichier de configuration central d'un projet Node.js. Il contient les métadonnées du projet et la liste des dépendances.

**Analogie concrète** : Le `package.json` est comme l'étiquette d'un colis : il liste le contenu, l'expéditeur et les instructions de livraison. Sans cette étiquette, personne ne sait ce que contient le colis ni comment le manipuler.

**Structure de base** :

```json
{
  "name": "mon-projet",
  "version": "1.0.0",
  "description": "Description du projet",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.21.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**Explication de chaque champ** :

| Champ | Obligatoire | Description |
| ----- | ----------- | ----------- |
| `name` | Oui | Nom du projet (minuscules, sans espaces) |
| `version` | Oui | Version du projet (format X.Y.Z) |
| `description` | Non | Description courte |
| `main` | Non | Point d'entrée du projet |
| `scripts` | Non | Commandes personnalisées |
| `dependencies` | Non | Packages nécessaires en production |
| `devDependencies` | Non | Packages pour le développement uniquement |

---

### dependencies vs devDependencies

**Définition** :

- **dependencies** : Packages nécessaires pour que l'application fonctionne.
- **devDependencies** : Packages utilisés uniquement pendant le développement.

**Exemples** :

| dependencies | devDependencies |
| ------------ | --------------- |
| express (serveur web) | nodemon (redémarrage auto) |
| axios (requêtes HTTP) | jest (tests) |
| dotenv (variables d'env) | eslint (qualité du code) |

**Règle simple** : Si l'application a besoin du package pour fonctionner → `dependencies`. Si c'est un outil de développement → `devDependencies`.

---

### Le dossier node_modules

**Définition** : `node_modules` est le dossier où npm installe tous les packages et leurs dépendances.

**Analogie concrète** : Le dossier `node_modules` est comme un entrepôt de pièces détachées. Tu ne le transportes pas quand tu déménages (on ne le met pas dans Git), mais tu peux le reconstituer à tout moment à partir du bon de commande (`package.json`).

**Caractéristiques importantes** :

- Ce dossier peut devenir très volumineux (des centaines de Mo)
- Il ne doit **jamais** être commité dans Git
- Il peut être recréé à tout moment avec `npm install`

**Règle absolue** : Ajoute `node_modules/` à ton fichier `.gitignore`.

---

### Le fichier package-lock.json

**Définition** : `package-lock.json` enregistre les versions exactes de tous les packages installés, y compris les sous-dépendances.

**Pourquoi il existe** :

- `package.json` peut dire "express version ^4.21.0" (n'importe quelle 4.21.x ou 4.x compatible)
- `package-lock.json` dit la version exacte installée (ex. 4.21.2)

**Règle** : Commite toujours `package-lock.json` dans Git. Cela garantit que tout le monde installe exactement les mêmes versions.

---

### Versioning sémantique (SemVer)

**Définition** : Les versions de packages suivent le format **X.Y.Z** (Majeur.Mineur.Patch).

| Numéro | Signification | Exemple de changement |
| ------ | ------------- | --------------------- |
| X (Majeur) | Changements incompatibles | API complètement modifiée |
| Y (Mineur) | Nouvelles fonctionnalités | Nouvelle fonction ajoutée |
| Z (Patch) | Corrections de bugs | Bug corrigé |

**Analogie concrète** : Le versioning sémantique fonctionne comme le numéro de version d'une recette de cuisine. Un changement de patch (1.0.1), c'est corriger une faute de frappe. Un changement mineur (1.1.0), c'est ajouter une astuce en marge. Un changement majeur (2.0.0), c'est réécrire la recette avec des ingrédients différents.

**Symboles dans package.json** :

| Symbole | Signification | Exemple |
| ------- | ------------- | ------- |
| `^4.18.2` | Compatible avec 4.x.x | Installe 4.18.2 ou 4.19.0, pas 5.0.0 |
| `~4.18.2` | Compatible avec 4.18.x | Installe 4.18.2 ou 4.18.3, pas 4.19.0 |
| `4.18.2` | Version exacte | Installe uniquement 4.18.2 |

**Recommandation** : Le symbole `^` (par défaut) convient à la majorité des projets.

---

## Étapes Pratiques

### Étape 1 : Initialiser un projet

Crée un nouveau dossier et initialise le projet :

```bash
mkdir mon-projet-npm
cd mon-projet-npm
npm init -y
```

L'option `-y` répond "oui" à toutes les questions et crée un `package.json` par défaut.

**Résultat attendu** :

```text
Wrote to /chemin/mon-projet-npm/package.json:

{
  "name": "mon-projet-npm",
  "version": "1.0.0",
  ...
}
```

Un fichier `package.json` est maintenant créé.

---

### Étape 2 : Examiner le package.json

Ouvre le fichier `package.json` créé :

```json
{
  "name": "mon-projet-npm",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

---

### Étape 3 : Installer un package

Installons `chalk`, un package pour colorer le texte dans le terminal :

```bash
npm install chalk
```

**Résultat attendu** :

```text
added 1 package in 1s
```

**Ce qui s'est passé** :

1. npm a téléchargé `chalk` et ses dépendances
2. Un dossier `node_modules/` a été créé
3. `package.json` a été modifié pour ajouter la dépendance
4. `package-lock.json` a été créé

Vérifie `package.json` :

```json
{
  "dependencies": {
    "chalk": "^5.3.0"
  }
}
```

---

### Étape 4 : Utiliser le package installé

Crée un fichier `index.js` :

```javascript
// index.js - Utiliser chalk pour colorer le texte

// Importer le package chalk
// Note: chalk v5+ utilise ESM, on doit utiliser import
import chalk from 'chalk';

// Texte coloré
console.log(chalk.blue('Ce texte est bleu'));
console.log(chalk.red('Ce texte est rouge'));
console.log(chalk.green.bold('Ce texte est vert et gras'));
console.log(chalk.bgYellow.black('Fond jaune, texte noir'));

// Combinaisons
console.log(chalk.red('Erreur:'), 'Quelque chose ne va pas');
console.log(chalk.green('Succès:'), 'Opération réussie');
```

**Important** : chalk v5+ utilise les modules ES. Ajoute cette ligne dans `package.json` :

```json
{
  "type": "module"
}
```

Le `package.json` complet :

```json
{
  "name": "mon-projet-npm",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "chalk": "^5.3.0"
  }
}
```

Exécute le script :

```bash
node index.js
```

**Résultat attendu** : Du texte coloré dans le terminal.

---

### Étape 5 : Installer une devDependency

Installons `nodemon`, un outil qui redémarre automatiquement le script quand tu modifies le code :

```bash
npm install --save-dev nodemon
```

Ou en version courte :

```bash
npm install -D nodemon
```

Vérifie `package.json` :

```json
{
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

### Étape 6 : Créer un script npm

Modifie `package.json` pour ajouter des scripts :

```json
{
  "name": "mon-projet-npm",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "chalk": "^5.3.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

Maintenant tu peux exécuter :

```bash
npm start      # Exécute une fois
npm run dev    # Exécute et surveille les changements
```

**Note** : `npm start` fonctionne sans `run`, mais les autres scripts nécessitent `npm run nom-du-script`.

---

### Étape 7 : Créer le fichier .gitignore

Crée un fichier `.gitignore` à la racine du projet :

```text
# Dépendances
node_modules/

# Logs
*.log
npm-debug.log*

# Variables d'environnement
.env
.env.local

# Fichiers système
.DS_Store
Thumbs.db
```

---

### Étape 8 : Simuler un nouveau développeur

Supprime le dossier `node_modules` :

```bash
rm -rf node_modules
```

Réinstalle toutes les dépendances :

```bash
npm install
```

**Résultat** : npm lit `package.json` et `package-lock.json`, puis réinstalle exactement les mêmes packages.

---

## Commandes npm Essentielles

| Commande | Description |
| -------- | ----------- |
| `npm init -y` | Créer un package.json |
| `npm install` | Installer toutes les dépendances |
| `npm install package` | Installer un package en dependency |
| `npm install -D package` | Installer en devDependency |
| `npm uninstall package` | Désinstaller un package |
| `npm update` | Mettre à jour les packages |
| `npm list` | Lister les packages installés |
| `npm list --depth=0` | Lister uniquement les packages directs |
| `npm outdated` | Voir les packages à mettre à jour |
| `npm run script` | Exécuter un script du package.json |

---

## Pièges Fréquents

### Piège 1 : Commiter node_modules

⚠️ **Problème** : Le dossier `node_modules` est dans Git, rendant le dépôt énorme.

✅ **Solution** : Ajoute `node_modules/` dans `.gitignore` avant le premier commit.

```bash
echo "node_modules/" >> .gitignore
```

---

### Piège 2 : require vs import

⚠️ **Problème** : `require is not defined` ou `Cannot use import statement`.

✅ **Solution** :

Pour utiliser `import` (ES Modules), ajoute `"type": "module"` dans package.json :

```json
{
  "type": "module"
}
```

Pour utiliser `require` (CommonJS), ne mets pas de type ou mets `"type": "commonjs"`.

**Tableau de correspondance** :

| CommonJS (ancien) | ES Modules (moderne) |
| ----------------- | -------------------- |
| `const x = require('pkg')` | `import x from 'pkg'` |
| `module.exports = x` | `export default x` |
| Pas besoin de config | Nécessite `"type": "module"` |

---

### Piège 3 : Package non trouvé

⚠️ **Problème** : `Error: Cannot find module 'package-name'`.

✅ **Solution** :

1. Vérifie que tu es dans le bon dossier (là où se trouve package.json)
2. Exécute `npm install` pour installer les dépendances
3. Vérifie que le package est listé dans package.json

---

### Piège 4 : Confondre npm install global et local

⚠️ **Problème** : `npm install -g package` installe globalement, pas dans le projet.

✅ **Solution** : N'utilise `-g` que pour les outils CLI que tu veux utiliser partout. Pour les dépendances de projet, utilise `npm install package` (sans `-g`).

---

### Piège 5 : Oublier npm install après un clone

⚠️ **Problème** : Après avoir cloné un projet, les scripts ne fonctionnent pas.

✅ **Solution** : Exécute toujours `npm install` après avoir cloné un projet Node.js.

```bash
git clone url-du-projet
cd projet
npm install    # Obligatoire !
npm start
```

---

## Checklist de Validation

- [ ] J'ai créé un projet avec `npm init -y`
- [ ] J'ai installé un package avec `npm install`
- [ ] Je comprends la différence entre dependencies et devDependencies
- [ ] J'ai créé un fichier `.gitignore` avec `node_modules/`
- [ ] J'ai créé et exécuté un script npm
- [ ] Je sais réinstaller les dépendances avec `npm install`

---

## Exercice Pratique

**Énoncé** : Crée un projet qui utilise deux packages :

1. `dayjs` pour manipuler les dates
2. `figlet` pour afficher du texte en art ASCII

Le script doit afficher :

- L'heure actuelle formatée
- Un message de bienvenue en art ASCII

**Indications** :

```bash
npm install dayjs figlet
```

- dayjs : `dayjs().format('HH:mm:ss')`
- figlet : `figlet.textSync('Hello')`

**Résultat attendu** :

```text
Il est: 14:30:45

  _   _      _ _
 | | | | ___| | | ___
 | |_| |/ _ \ | |/ _ \
 |  _  |  __/ | | (_) |
 |_| |_|\___|_|_|\___/
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**package.json** :

```json
{
  "name": "exercice-npm",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "dayjs": "^1.11.10",
    "figlet": "^1.7.0"
  }
}
```

**index.js** :

```javascript
// index.js - Exercice npm

// Importer les packages
import dayjs from 'dayjs';
import figlet from 'figlet';

// Afficher l'heure actuelle formatée
const heureActuelle = dayjs().format('HH:mm:ss');
console.log('Il est:', heureActuelle);
console.log('');  // Ligne vide

// Afficher "Hello" en art ASCII
const texteAscii = figlet.textSync('Hello');
console.log(texteAscii);
```

**Exécution** :

```bash
npm start
```

---

## Navigation

← Fiche précédente : **[Introduction à Node.js](01-introduction-nodejs.md)**

→ Fiche suivante : **[Modules et imports](03-modules-imports.md)**
