---
tags:
  - Node.js
  - Débutant
  - Pratique
description: "Modules et imports"
estimated_time: "80 min"
fiche_number: 3
total_fiches: 10
cursus: "Node.js"
id: "fundamentals.nodejs.modules-imports"
course_id: "fundamentals.nodejs"
content_type: "lesson"
order: 3
---

# 03 - Modules et imports

> **En bref** : À la fin de cette fiche, tu sauras créer tes propres modules, exporter des fonctions et variables, et les importer dans d'autres fichiers. Lecture estimée : 80 min.


## Prérequis

- Fiche [07-nodejs/01 - Introduction à Node.js](01-introduction-nodejs.md)
- Fiche [07-nodejs/02 - npm et gestion des packages](02-npm-packages.md)
- Savoir créer un fichier JavaScript

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer tes propres modules, exporter des fonctions et variables, et les importer dans d'autres fichiers.

---

## Concepts

### Qu'est-ce qu'un module ?

**Définition** : Un module est un fichier JavaScript qui contient du code (fonctions, variables, classes) pouvant être réutilisé dans d'autres fichiers.

**Le problème que les modules résolvent** :

Sans modules, voici les problèmes rencontrés :

1. **Fichiers énormes** : Tout le code dans un seul fichier de milliers de lignes.
2. **Conflits de noms** : Deux fonctions avec le même nom causent des erreurs.
3. **Pas de réutilisation** : Impossible de partager du code entre fichiers.
4. **Maintenance difficile** : Trouver et modifier du code devient un cauchemar.

**Comment les modules résolvent ces problèmes** :

| Problème | Solution apportée par les modules |
| -------- | --------------------------------- |
| Fichiers énormes | Code divisé en fichiers thématiques |
| Conflits de noms | Chaque module a son propre espace |
| Pas de réutilisation | Un module peut être importé partout |
| Maintenance difficile | Un fichier = une responsabilité |

**Analogie concrète** : Un module, c'est comme une boîte à outils spécialisée. Tu as une boîte pour la plomberie (fonctions de base de données), une pour l'électricité (fonctions de réseau), une pour la menuiserie (fonctions de manipulation de fichiers). Quand tu travailles sur un projet, tu prends uniquement les boîtes dont tu as besoin.

---

### CommonJS vs ES Modules

**Deux systèmes de modules existent** :

| CommonJS (CJS) | ES Modules (ESM) |
| -------------- | ---------------- |
| Ancien système de Node.js | Standard JavaScript moderne |
| `require()` et `module.exports` | `import` et `export` |
| Synchrone | Peut être asynchrone |
| Pas besoin de config | Nécessite `"type": "module"` |
| Extension `.js` ou `.cjs` | Extension `.js` ou `.mjs` |

**Analogie concrète** : CommonJS et ES Modules sont comme deux formats de prises électriques (type E et type G). Les deux alimentent les appareils, mais le format diffère. CommonJS est l'ancien format de Node.js, ES Modules est le format standard du web. Dans un nouveau projet, choisis ES Modules comme on choisirait le format de prise universel.

**Recommandation** : Utilise ES Modules (import/export) pour les nouveaux projets. C'est le standard moderne.

**Comment choisir** :

| Situation | Système à utiliser |
| --------- | ------------------ |
| Nouveau projet | ES Modules |
| Projet existant en CommonJS | Rester en CommonJS |
| Package qui supporte les deux | ES Modules |
| Script rapide sans package.json | CommonJS |

---

### Export et Import

**Deux types d'export** :

1. **Export nommé** : Exporter plusieurs éléments avec leurs noms
2. **Export par défaut** : Exporter un élément principal

**Tableau récapitulatif** :

| Type | Export | Import |
| ---- | ------ | ------ |
| Nommé | `export const x = 1` | `import { x } from './file.js'` |
| Par défaut | `export default x` | `import x from './file.js'` |
| Les deux | `export { x }; export default y` | `import y, { x } from './file.js'` |

---

## Étapes Pratiques

### Étape 1 : Configurer le projet pour ES Modules

Crée un nouveau projet :

```bash
mkdir projet-modules
cd projet-modules
npm init -y
```

Modifie `package.json` pour activer ES Modules :

```json
{
  "name": "projet-modules",
  "version": "1.0.0",
  "type": "module"
}
```

---

### Étape 2 : Créer un module avec exports nommés

Crée un fichier `math.js` :

```javascript
// math.js - Module de fonctions mathématiques

// Export nommé : chaque fonction est exportée avec son nom
export const PI = 3.14159;

export function addition(a, b) {
    return a + b;
}

export function soustraction(a, b) {
    return a - b;
}

export function multiplication(a, b) {
    return a * b;
}

export function division(a, b) {
    if (b === 0) {
        throw new Error("Division par zéro impossible");
    }
    return a / b;
}
```

---

### Étape 3 : Importer les exports nommés

Crée un fichier `index.js` :

```javascript
// index.js - Fichier principal

// Importer des fonctions spécifiques
import { addition, multiplication, PI } from './math.js';

console.log("PI =", PI);
console.log("5 + 3 =", addition(5, 3));
console.log("4 x 7 =", multiplication(4, 7));
```

Exécute :

```bash
node index.js
```

**Résultat attendu** :

```text
PI = 3.14159
5 + 3 = 8
4 x 7 = 28
```

---

### Étape 4 : Importer tout le module

Tu peux importer tout le module sous un nom :

```javascript
// index.js - Importer tout le module

import * as MathUtils from './math.js';

console.log("PI =", MathUtils.PI);
console.log("10 - 4 =", MathUtils.soustraction(10, 4));
console.log("20 / 5 =", MathUtils.division(20, 5));
```

**Résultat attendu** :

```text
PI = 3.14159
10 - 4 = 6
20 / 5 = 4
```

---

### Étape 5 : Export par défaut

Crée un fichier `calculatrice.js` :

```javascript
// calculatrice.js - Module avec export par défaut

// Une classe exportée par défaut
export default class Calculatrice {
    constructor() {
        this.resultat = 0;
    }

    ajouter(n) {
        this.resultat += n;
        return this;  // Permet le chaînage
    }

    soustraire(n) {
        this.resultat -= n;
        return this;
    }

    multiplier(n) {
        this.resultat *= n;
        return this;
    }

    reset() {
        this.resultat = 0;
        return this;
    }

    getResultat() {
        return this.resultat;
    }
}
```

Utilise ce module dans `index.js` :

```javascript
// index.js - Utiliser l'export par défaut

// Pas de { } pour l'import par défaut
// Tu peux choisir le nom que tu veux
import Calculatrice from './calculatrice.js';

const calc = new Calculatrice();

calc.ajouter(10)
    .multiplier(3)
    .soustraire(5);

console.log("Résultat:", calc.getResultat());  // 25
```

**Résultat attendu** :

```text
Résultat: 25
```

---

### Étape 6 : Combiner export par défaut et exports nommés

Crée un fichier `utils.js` :

```javascript
// utils.js - Module avec les deux types d'exports

// Fonction utilitaire exportée par défaut
export default function afficherMessage(message) {
    console.log(`[INFO] ${message}`);
}

// Fonctions supplémentaires en exports nommés
export function capitaliser(texte) {
    return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function inverser(texte) {
    return texte.split('').reverse().join('');
}

export const VERSION = '1.0.0';
```

Utilise ce module :

```javascript
// index.js

// Import par défaut + imports nommés
import afficher, { capitaliser, inverser, VERSION } from './utils.js';

afficher("Démarrage de l'application");
console.log("Version:", VERSION);
console.log("Capitalisé:", capitaliser("bonjour"));
console.log("Inversé:", inverser("hello"));
```

**Résultat attendu** :

```text
[INFO] Démarrage de l'application
Version: 1.0.0
Capitalisé: Bonjour
Inversé: olleh
```

---

### Étape 7 : Organiser en dossiers

Structure recommandée pour un projet plus grand :

```text
projet-modules/
├── package.json
├── index.js
└── src/
    ├── utils/
    │   ├── string.js
    │   └── date.js
    └── services/
        └── calculator.js
```

Crée le dossier `src/utils` :

```bash
mkdir -p src/utils
```

Crée `src/utils/string.js` :

```javascript
// src/utils/string.js

export function capitaliser(texte) {
    return texte.charAt(0).toUpperCase() + texte.slice(1).toLowerCase();
}

export function slugify(texte) {
    return texte
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')      // Remplace les espaces par des tirets
        .replace(/[^\w\-]+/g, ''); // Supprime les caractères spéciaux
}

export function tronquer(texte, longueur) {
    if (texte.length <= longueur) {
        return texte;
    }
    return texte.slice(0, longueur) + '...';
}
```

Crée `src/utils/date.js` :

```javascript
// src/utils/date.js

export function formatDate(date) {
    const d = new Date(date);
    const jour = String(d.getDate()).padStart(2, '0');
    const mois = String(d.getMonth() + 1).padStart(2, '0');
    const annee = d.getFullYear();
    return `${jour}/${mois}/${annee}`;
}

export function estWeekend(date) {
    const d = new Date(date);
    const jour = d.getDay();
    return jour === 0 || jour === 6;  // 0 = dimanche, 6 = samedi
}

export function joursEntre(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2 - d1);
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}
```

Utilise ces modules dans `index.js` :

```javascript
// index.js

import { capitaliser, slugify, tronquer } from './src/utils/string.js';
import { formatDate, estWeekend, joursEntre } from './src/utils/date.js';

// Tester les fonctions string
console.log("=== Fonctions String ===");
console.log(capitaliser("bonjour"));        // Bonjour
console.log(slugify("Mon Article de Blog")); // mon-article-de-blog
console.log(tronquer("Un texte très long", 10)); // Un texte ...

// Tester les fonctions date
console.log("\n=== Fonctions Date ===");
console.log(formatDate(new Date()));         // 23/01/2025
console.log("Aujourd'hui est weekend?", estWeekend(new Date()));

const debut = new Date('2025-01-01');
const fin = new Date('2025-01-23');
console.log("Jours depuis le 1er janvier:", joursEntre(debut, fin));
```

---

### Étape 8 : Créer un fichier index pour réexporter

Pour simplifier les imports, crée un fichier `src/utils/index.js` qui réexporte tout :

```javascript
// src/utils/index.js - Réexporte tous les utils

export { capitaliser, slugify, tronquer } from './string.js';
export { formatDate, estWeekend, joursEntre } from './date.js';
```

Maintenant tu peux importer depuis un seul endroit :

```javascript
// index.js - Import simplifié

import {
    capitaliser,
    slugify,
    formatDate,
    estWeekend
} from './src/utils/index.js';

console.log(capitaliser("test"));
console.log(formatDate(new Date()));
```

---

## Syntaxe CommonJS (pour référence)

Si tu travailles sur un projet existant en CommonJS :

**Exporter (CommonJS)** :

```javascript
// math.js (CommonJS)

const PI = 3.14159;

function addition(a, b) {
    return a + b;
}

// Exporter plusieurs éléments
module.exports = {
    PI,
    addition
};

// Ou exporter un seul élément
module.exports = addition;
```

**Importer (CommonJS)** :

```javascript
// index.js (CommonJS)

// Importer tout le module
const math = require('./math.js');
console.log(math.PI);
console.log(math.addition(2, 3));

// Ou avec déstructuration
const { PI, addition } = require('./math.js');
console.log(PI);
```

---

## Commandes et Syntaxes Utiles

| Syntaxe ES Modules | Description |
| ------------------ | ----------- |
| `export const x = 1` | Export nommé direct |
| `export { x, y }` | Export nommé groupé |
| `export default x` | Export par défaut |
| `import { x } from './file.js'` | Import nommé |
| `import x from './file.js'` | Import par défaut |
| `import * as mod from './file.js'` | Import de tout |
| `import x, { y } from './file.js'` | Import mixte |
| `export { x } from './file.js'` | Réexport |

---

## Pièges Fréquents

### Piège 1 : Oublier l'extension .js

⚠️ **Problème** : `import { x } from './math'` échoue avec ES Modules.

✅ **Solution** : Toujours inclure l'extension `.js` avec ES Modules.

```javascript
// ❌ Ne fonctionne pas en ESM
import { x } from './math';

// ✅ Correct
import { x } from './math.js';
```

---

### Piège 2 : Confondre {} et pas de {}

⚠️ **Problème** : `import { maFonction }` quand c'est un export par défaut.

✅ **Solution** :

```javascript
// Si le module fait : export default function maFonction()
import maFonction from './module.js';  // Sans { }

// Si le module fait : export function maFonction()
import { maFonction } from './module.js';  // Avec { }
```

---

### Piège 3 : Chemin relatif manquant

⚠️ **Problème** : `import { x } from 'module.js'` (sans `./`) cherche dans node_modules.

✅ **Solution** : Utilise `./` pour les fichiers locaux.

```javascript
// ❌ Cherche dans node_modules
import { x } from 'utils.js';

// ✅ Fichier local
import { x } from './utils.js';
```

---

### Piège 4 : Export par défaut multiples

⚠️ **Problème** : Un module peut avoir plusieurs `export default`.

✅ **Solution** : Un seul `export default` par fichier. Utilise les exports nommés pour le reste.

```javascript
// ❌ Erreur : deux export default
export default function a() {}
export default function b() {}

// ✅ Correct
export default function a() {}
export function b() {}
```

---

### Piège 5 : Import dans le mauvais ordre

⚠️ **Problème** : L'ordre des imports cause des problèmes quand des modules ont des effets de bord (initialisation globale, modification de prototypes).

✅ **Solution** : Place les imports dans cet ordre :

1. Modules Node.js natifs (`fs`, `path`...)
2. Packages npm (`express`, `chalk`...)
3. Modules locaux (`./utils.js`...)

```javascript
// Ordre recommandé
import fs from 'fs';                    // 1. Node.js natif
import express from 'express';          // 2. Package npm
import { maFonction } from './lib.js';  // 3. Module local
```

---

## Checklist de Validation

- [ ] J'ai configuré mon projet avec `"type": "module"`
- [ ] Je sais créer un module avec des exports nommés
- [ ] Je sais créer un module avec un export par défaut
- [ ] Je sais importer des exports nommés avec `{ }`
- [ ] Je sais importer un export par défaut sans `{ }`
- [ ] Je n'oublie pas l'extension `.js` dans mes imports
- [ ] Je sais organiser mes modules en dossiers

---

## Exercice Pratique

**Énoncé** : Crée une mini-bibliothèque de validation avec deux modules :

1. `validators/string.js` : fonctions `estVide(str)`, `estEmail(str)`, `longueurMin(str, min)`
2. `validators/number.js` : fonctions `estPositif(n)`, `estPair(n)`, `estDansIntervalle(n, min, max)`

Crée aussi un fichier `validators/index.js` qui réexporte tout.

Teste les fonctions dans `index.js`.

**Indications** :

- `estEmail` : vérifie si la chaîne contient `@` et `.`
- `estPair` : utilise l'opérateur modulo `%`

**Résultat attendu** :

```text
=== Validation Strings ===
estVide(""):  true
estVide("test"):  false
estEmail("user@mail.com"):  true
longueurMin("abc", 5):  false

=== Validation Numbers ===
estPositif(5):  true
estPair(4):  true
estDansIntervalle(15, 10, 20):  true
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Structure du projet** :

```text
projet-validation/
├── package.json
├── index.js
└── validators/
    ├── index.js
    ├── string.js
    └── number.js
```

**package.json** :

```json
{
  "name": "projet-validation",
  "version": "1.0.0",
  "type": "module"
}
```

**validators/string.js** :

```javascript
// validators/string.js

export function estVide(str) {
    return str === '' || str === null || str === undefined;
}

export function estEmail(str) {
    // Vérification simple : contient @ et au moins un .
    return str.includes('@') && str.includes('.');
}

export function longueurMin(str, min) {
    return str.length >= min;
}
```

**validators/number.js** :

```javascript
// validators/number.js

export function estPositif(n) {
    return n > 0;
}

export function estPair(n) {
    return n % 2 === 0;
}

export function estDansIntervalle(n, min, max) {
    return n >= min && n <= max;
}
```

**validators/index.js** :

```javascript
// validators/index.js - Réexporte tout

export { estVide, estEmail, longueurMin } from './string.js';
export { estPositif, estPair, estDansIntervalle } from './number.js';
```

**index.js** :

```javascript
// index.js - Tests de la bibliothèque de validation

import {
    estVide,
    estEmail,
    longueurMin,
    estPositif,
    estPair,
    estDansIntervalle
} from './validators/index.js';

console.log("=== Validation Strings ===");
console.log('estVide(""):        ', estVide(""));
console.log('estVide("test"):    ', estVide("test"));
console.log('estEmail("user@mail.com"):', estEmail("user@mail.com"));
console.log('longueurMin("abc", 5):', longueurMin("abc", 5));

console.log("\n=== Validation Numbers ===");
console.log('estPositif(5):      ', estPositif(5));
console.log('estPair(4):         ', estPair(4));
console.log('estDansIntervalle(15, 10, 20):', estDansIntervalle(15, 10, 20));
```

**Exécution** :

```bash
node index.js
```

---

## Navigation

← Fiche précédente : **[npm et gestion des packages](02-npm-packages.md)**

→ Fiche suivante : **[Programmation asynchrone](04-programmation-asynchrone.md)**
