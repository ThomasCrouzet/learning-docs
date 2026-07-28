---
tags:
  - TypeScript
  - Débutant
  - Pratique
description: "Installer TypeScript, configurer tsconfig.json et compiler un premier fichier."
estimated_time: "60 min"
fiche_number: 2
total_fiches: 15
cursus: "TypeScript"
---

# 02 - Installation et configuration

> **En bref** : Installer TypeScript, comprendre et configurer tsconfig.json, compiler et exécuter un premier programme. Lecture estimée : 60 min.

## Prérequis

- [01 - Introduction à TypeScript](01-introduction-typescript.md)
- Node.js 22 LTS installé sur ta machine
- npm (installé automatiquement avec Node.js)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer TypeScript, créer un fichier `tsconfig.json` configuré, compiler un fichier `.ts` en `.js` et l'exécuter avec Node.js.

---

## Concepts

### Qu'est-ce que le compilateur `tsc` ?

**Définition** : `tsc` (TypeScript Compiler) est l'outil en ligne de commande qui transforme les fichiers TypeScript (`.ts`) en fichiers JavaScript (`.js`). Il est installé avec le package `typescript` via npm.

**Le problème que `tsc` résout** :

Sans `tsc`, voici les problèmes rencontrés :

1. **Incompatibilité** : Node.js et les navigateurs ne comprennent pas TypeScript directement. Il faut un outil pour traduire le code.
2. **Vérification de types** : Sans compilateur, les annotations de type ne sont que des commentaires inutiles. C'est `tsc` qui vérifie que les types sont corrects.
3. **Compatibilité** : Le JavaScript moderne (ES2020+) n'est pas supporté par tous les environnements. `tsc` peut transformer le code en une version plus ancienne de JavaScript.

**Comment `tsc` résout ces problèmes** :

| Problème | Solution apportée par `tsc` |
| -------- | --------------------------- |
| Incompatibilité | Génère du JavaScript standard exécutable partout |
| Vérification de types | Analyse le code et signale les erreurs de type |
| Compatibilité | Cible la version de JavaScript souhaitée (ES5, ES6, ES2020, etc.) |

**Analogie concrète** : `tsc` fonctionne comme un correcteur de documents. Tu écris ton texte (TypeScript), le correcteur vérifie l'orthographe et la grammaire (vérification des types), puis il produit une version propre du document (JavaScript). Si le correcteur trouve des erreurs, il te les signale avant de produire le document final.

**Ce que `tsc` n'est PAS** :

- `tsc` n'est pas un outil d'exécution. Il ne lance pas ton programme. Il le transforme seulement.
- `tsc` n'est pas un bundler (comme Webpack). Il ne regroupe pas tes fichiers en un seul. Il transforme chaque fichier `.ts` en un fichier `.js` correspondant.

---

### Qu'est-ce que `tsconfig.json` ?

**Définition** : `tsconfig.json` est le fichier de configuration du compilateur TypeScript. Il se place à la racine du projet et définit les options de compilation : version de JavaScript cible, niveau de rigueur des vérifications, dossiers source et sortie.

**Le problème que `tsconfig.json` résout** :

Sans `tsconfig.json`, voici les problèmes rencontrés :

1. **Options en ligne de commande** : Sans fichier de configuration, il faudrait passer toutes les options à chaque commande `tsc`. C'est long et source d'erreurs.
2. **Incohérence** : Chaque développeur pourrait compiler avec des options différentes, produisant des résultats différents.
3. **Portée du projet** : Sans configuration, `tsc` ne sait pas quels fichiers compiler et où placer les fichiers générés.

**Comment `tsconfig.json` résout ces problèmes** :

| Problème | Solution apportée par `tsconfig.json` |
| -------- | ------------------------------------- |
| Options en ligne de commande | Toutes les options sont centralisées dans un fichier |
| Incohérence | Le fichier est versionné avec le projet, tous utilisent les mêmes options |
| Portée du projet | Les options `rootDir` et `outDir` définissent les dossiers source et sortie |

**Analogie concrète** : `tsconfig.json` est comme le tableau de bord d'une machine à laver. Au lieu de régler la température, la vitesse d'essorage et la durée à chaque lavage, tu sélectionnes un programme prédéfini. Le `tsconfig.json` est ton programme de lavage : il définit tous les réglages une seule fois.

---

### Qu'est-ce que `ts-node` ?

**Définition** : `ts-node` est un outil qui permet d'exécuter directement des fichiers TypeScript sans les compiler manuellement au préalable. Il compile le code en mémoire et l'exécute immédiatement.

**Le problème que `ts-node` résout** :

Sans `ts-node`, voici les problèmes rencontrés :

1. **Deux étapes** : Il faut d'abord compiler avec `tsc`, puis exécuter avec `node`. C'est deux commandes à chaque test.
2. **Fichiers intermédiaires** : La compilation crée des fichiers `.js` qu'il faut gérer et nettoyer.

**Comment `ts-node` résout ces problèmes** :

| Problème | Solution apportée par `ts-node` |
| -------- | ------------------------------- |
| Deux étapes | Une seule commande pour compiler et exécuter |
| Fichiers intermédiaires | La compilation se fait en mémoire, aucun fichier `.js` n'est créé |

**Analogie concrète** : Sans `ts-node`, c'est comme si tu devais d'abord photocopier un document, puis lire la photocopie. Avec `ts-node`, tu lis directement l'original.

**Ce que `ts-node` n'est PAS** :

- `ts-node` n'est pas recommandé pour la production. En production, on compile d'abord avec `tsc` puis on exécute le JavaScript généré.
- `ts-node` n'est pas plus rapide que `tsc` + `node`. Il fait les mêmes étapes, mais en une seule commande.

---

## Étapes Pratiques

### Étape 1 : Vérifier l'installation de Node.js

Vérifie que Node.js et npm sont installés :

```bash
# Affiche la version de Node.js installée
node --version

# Affiche la version de npm installée
npm --version
```

**Résultat attendu** :

```text
v22.x.x
10.x.x
```

Les numéros exacts peuvent varier, mais Node.js doit être en version 22 LTS (ou au minimum 20).

---

### Étape 2 : Créer un dossier de projet

Crée un dossier pour ton premier projet TypeScript :

```bash
# Crée un nouveau dossier
mkdir mon-premier-ts

# Entre dans le dossier
cd mon-premier-ts

# Initialise un projet npm (crée package.json)
# L'option -y accepte tous les paramètres par défaut
npm init -y
```

**Résultat attendu** :

```text
Wrote to /chemin/vers/mon-premier-ts/package.json:

{
  "name": "mon-premier-ts",
  "version": "1.0.0",
  ...
}
```

---

### Étape 3 : Installer TypeScript

Installe TypeScript comme dépendance de développement :

```bash
# Installe TypeScript localement dans le projet
# --save-dev signifie que c'est une dépendance de développement
# (pas nécessaire en production)
npm install --save-dev typescript
```

**Résultat attendu** :

```text
added 1 package, and audited 2 packages in 2s

found 0 vulnerabilities
```

Vérifie que TypeScript est bien installé :

```bash
# Affiche la version de TypeScript installée
# npx exécute l'outil installé localement
npx tsc --version
```

**Résultat attendu** :

```text
Version 5.x.x ou 6.x.x
```

> **Note versions** : TypeScript 6.0 est stable depuis mars 2026. Si tu installes `typescript@latest`, tu obtiendras `6.x.x`. Les deux versions sont compatibles avec ce cursus. TypeScript 7.0 (beta, réécriture du compilateur en Go) n'est pas encore à utiliser en production.

---

### Étape 4 : Créer le fichier `tsconfig.json`

Génère un fichier de configuration TypeScript :

```bash
# Crée un tsconfig.json avec toutes les options commentées
npx tsc --init
```

**Résultat attendu** :

```text
Created a new tsconfig.json with:

  target: es2016
  module: commonjs
  strict: true
  esModuleInterop: true
  skipLibCheck: true
  forceConsistentCasingInFileNames: true
```

Le fichier généré contient de nombreuses options commentées. Remplace son contenu par cette configuration simplifiée et commentée :

```json
{
  "compilerOptions": {
    // Version de JavaScript en sortie
    // "ES2020" est compatible avec Node.js 22
    "target": "ES2020",

    // Système de modules utilisé
    // "commonjs" est le standard Node.js (require/module.exports)
    "module": "commonjs",

    // Active TOUTES les vérifications strictes
    // C'est la configuration recommandée pour tout nouveau projet
    "strict": true,

    // Dossier contenant les fichiers TypeScript source
    "rootDir": "./src",

    // Dossier où seront placés les fichiers JavaScript compilés
    "outDir": "./dist",

    // Permet d'importer des modules CommonJS avec la syntaxe ES modules
    "esModuleInterop": true,

    // Vérifie que les imports respectent la casse des noms de fichiers
    "forceConsistentCasingInFileNames": true,

    // Ignore la vérification de type des fichiers .d.ts des bibliothèques
    // Accélère la compilation
    "skipLibCheck": true,

    // Génère des fichiers .d.ts (déclarations de types)
    // Utile si ton projet est une bibliothèque
    "declaration": false,

    // Génère des source maps pour le débogage
    // Permet de voir le code TypeScript original dans le débogueur
    "sourceMap": true
  },
  // Dossiers et fichiers à inclure dans la compilation
  "include": ["src/**/*"],
  // Dossiers à exclure de la compilation
  "exclude": ["node_modules", "dist"]
}
```

---

### Étape 5 : Comprendre chaque option de `tsconfig.json`

Voici un tableau détaillé des options principales :

| Option | Valeur | Explication |
| ------ | ------ | ----------- |
| `target` | `"ES2020"` | Le JavaScript généré utilisera la syntaxe ES2020. Node.js 22 prend en charge cette version. |
| `module` | `"commonjs"` | Utilise le système de modules `require()` / `module.exports` de Node.js. |
| `strict` | `true` | Active toutes les vérifications strictes. Équivaut à activer 8 options individuelles. |
| `rootDir` | `"./src"` | Les fichiers TypeScript source sont dans le dossier `src/`. |
| `outDir` | `"./dist"` | Les fichiers JavaScript compilés sont placés dans le dossier `dist/`. |
| `esModuleInterop` | `true` | Permet `import express from 'express'` au lieu de `import * as express from 'express'`. |
| `forceConsistentCasingInFileNames` | `true` | Empêche d'importer `./MonFichier` et `./monfichier` comme deux fichiers différents. |
| `skipLibCheck` | `true` | Ne vérifie pas les types dans `node_modules`. Accélère la compilation. |
| `sourceMap` | `true` | Crée des fichiers `.js.map` pour le débogage. |

**Les 8 options activées par `strict: true`** :

| Option | Effet |
| ------ | ----- |
| `strictNullChecks` | Interdit d'utiliser `null` ou `undefined` là où un autre type est attendu |
| `strictFunctionTypes` | Vérifie strictement les types des paramètres de fonctions |
| `strictBindCallApply` | Vérifie les types pour `bind`, `call` et `apply` |
| `strictPropertyInitialization` | Oblige à initialiser les propriétés de classe dans le constructeur |
| `noImplicitAny` | Interdit les variables sans type (qui seraient implicitement `any`) |
| `noImplicitThis` | Interdit `this` quand son type est implicitement `any` |
| `alwaysStrict` | Ajoute `"use strict"` en haut de chaque fichier JavaScript généré |
| `useUnknownInCatchVariables` | Le paramètre `catch(e)` est de type `unknown` au lieu de `any` |

**`"module": "commonjs"` vs `"module": "NodeNext"`** :

| Option | Quand l'utiliser |
| ------ | ---------------- |
| `"commonjs"` | Projet Node.js classique avec `require()`, compatible `ts-node` et `tsx` sans configuration supplémentaire. Recommandé pour débuter. |
| `"NodeNext"` | Projet Node.js moderne avec modules ES natifs (`import`/`export`, fichiers `.mjs`). Nécessite aussi `"moduleResolution": "NodeNext"`. À utiliser quand le `package.json` contient `"type": "module"`. |

Pour ce cursus, `"commonjs"` est utilisé car il est compatible avec la majorité des outils et plus simple à configurer.

---

### Étape 6 : Créer la structure de dossiers

Crée les dossiers source et sortie :

```bash
# Crée le dossier pour les fichiers TypeScript source
mkdir src

# Le dossier dist sera créé automatiquement par tsc lors de la compilation
```

**Résultat attendu** :

```text
mon-premier-ts/
├── node_modules/
├── src/           ← tes fichiers TypeScript ici
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

### Étape 7 : Écrire le premier fichier TypeScript

Crée le fichier `src/index.ts` :

```typescript
// src/index.ts
// Premier programme TypeScript

// Déclaration d'une variable avec son type
const message: string = "Bienvenue dans TypeScript !";

// Fonction avec types de paramètres et type de retour
function addition(a: number, b: number): number {
  // a et b doivent être des nombres
  // La fonction retourne un nombre
  return a + b;
}

// Utilisation de la fonction
const resultat: number = addition(5, 3);

// Affichage dans le terminal
console.log(message);
console.log("5 + 3 =", resultat);

// Interface pour définir la structure d'un objet
interface Personne {
  nom: string;
  age: number;
  ville: string;
}

// Création d'un objet qui respecte l'interface Personne
const alice: Personne = {
  nom: "Alice",
  age: 25,
  ville: "Lyon",
};

// Fonction qui utilise l'interface
function presenter(personne: Personne): string {
  // personne doit être un objet de type Personne
  return `${personne.nom} a ${personne.age} ans et habite à ${personne.ville}.`;
}

console.log(presenter(alice));
```

---

### Étape 8 : Compiler le fichier TypeScript

Compile le projet :

```bash
# Compile tous les fichiers TypeScript du projet
# tsc utilise automatiquement le tsconfig.json
npx tsc
```

**Résultat attendu** :

```text
(aucune sortie = compilation réussie)
```

Si la compilation réussit, aucun message n'est affiché. Vérifie que le fichier JavaScript a été créé :

```bash
# Liste les fichiers dans le dossier dist
ls dist/
```

**Résultat attendu** :

```text
index.js
index.js.map
```

Regarde le contenu du fichier JavaScript généré :

```bash
# Affiche le contenu du fichier compilé
cat dist/index.js
```

**Résultat attendu** :

```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message = "Bienvenue dans TypeScript !";
function addition(a, b) {
    return a + b;
}
const resultat = addition(5, 3);
console.log(message);
console.log("5 + 3 =", resultat);
const alice = {
    nom: "Alice",
    age: 25,
    ville: "Lyon",
};
function presenter(personne) {
    return `${personne.nom} a ${personne.age} ans et habite à ${personne.ville}.`;
}
console.log(presenter(alice));
```

Observe que **tous les types ont disparu** du JavaScript généré. C'est l'effacement de types (type erasure).

---

### Étape 9 : Exécuter le programme

Exécute le fichier JavaScript compilé :

```bash
# Exécute le fichier JavaScript avec Node.js
node dist/index.js
```

**Résultat attendu** :

```text
Bienvenue dans TypeScript !
5 + 3 = 8
Alice a 25 ans et habite à Lyon.
```

---

### Étape 10 : Installer et utiliser `ts-node`

Installe `ts-node` pour exécuter directement du TypeScript :

```bash
# Installe ts-node comme dépendance de développement
npm install --save-dev ts-node
```

**Résultat attendu** :

```text
added X packages, and audited X packages in Xs

found 0 vulnerabilities
```

Exécute directement le fichier TypeScript :

```bash
# Exécute le TypeScript directement, sans compilation manuelle
npx ts-node src/index.ts
```

**Résultat attendu** :

```text
Bienvenue dans TypeScript !
5 + 3 = 8
Alice a 25 ans et habite à Lyon.
```

Le résultat est identique, mais sans créer de fichier `.js` intermédiaire.

---

### Étape 11 : Ajouter des scripts npm

Modifie le fichier `package.json` pour ajouter des scripts pratiques :

```json
{
  "name": "mon-premier-ts",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "watch": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^6.0.0",
    "ts-node": "^10.0.0"
  }
}
```

Maintenant tu peux utiliser ces commandes :

```bash
# Compiler le projet
npm run build

# Exécuter le programme compilé
npm start

# Exécuter directement en TypeScript (développement)
npm run dev

# Compiler automatiquement à chaque modification
npm run watch
```

---

### Étape 12 : Tester la détection d'erreurs

Crée un fichier `src/erreur-test.ts` avec une erreur volontaire :

```typescript
// src/erreur-test.ts
// Ce fichier contient des erreurs de type volontaires

const age: number = "vingt-cinq"; // Erreur : string assigné à number

function multiplier(a: number, b: number): number {
  return a * b;
}

// Erreur : on passe une chaîne au lieu d'un nombre
const resultat = multiplier(5, "trois");
```

Compile le projet :

```bash
npx tsc
```

**Résultat attendu** :

```text
src/erreur-test.ts:4:7 - error TS2322: Type 'string' is not assignable to type 'number'.

4 const age: number = "vingt-cinq";
        ~~~

src/erreur-test.ts:10:35 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

10 const resultat = multiplier(5, "trois");
                                  ~~~~~~~

Found 2 errors in the same file, starting at: src/erreur-test.ts:4
```

TypeScript a détecté les deux erreurs **avant** l'exécution. Le fichier JavaScript n'a pas été généré.

Supprime le fichier de test :

```bash
rm src/erreur-test.ts
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npm install --save-dev typescript` | Installe TypeScript localement |
| `npx tsc --init` | Crée un `tsconfig.json` par défaut |
| `npx tsc` | Compile le projet selon `tsconfig.json` |
| `npx tsc --watch` | Recompile automatiquement à chaque modification |
| `npx tsc --noEmit` | Vérifie les types sans générer de fichier |
| `npx tsc fichier.ts` | Compile un seul fichier (ignore `tsconfig.json`) |
| `npx ts-node fichier.ts` | Exécute un fichier TypeScript directement |
| `npm run build` | Exécute le script `build` de `package.json` |

---

## Pièges Fréquents

### Piège 1 : Compiler un fichier unique avec `tsconfig.json`

**Problème** : Quand tu fais `npx tsc fichier.ts`, le fichier `tsconfig.json` est **ignoré**. Les options par défaut sont utilisées.

```bash
# Le tsconfig.json est IGNORÉ avec cette commande
npx tsc src/index.ts
```

**Solution** : Utilise `npx tsc` sans argument pour compiler tout le projet avec les options du `tsconfig.json`. Ou utilise `npx tsc --project tsconfig.json` si tu veux être explicite.

```bash
# Compile TOUT le projet avec les options du tsconfig.json
npx tsc
```

---

### Piège 2 : Oublier de créer le dossier `src/`

**Problème** : Si le dossier `src/` n'existe pas mais que `rootDir` pointe vers `./src`, la compilation échoue.

```text
error TS6059: File 'index.ts' is not under 'rootDir' 'src'.
```

**Solution** : Crée le dossier `src/` et place tes fichiers TypeScript dedans.

```bash
mkdir src
```

---

### Piège 3 : Mélanger `require` et `import`

**Problème** : Utiliser `require()` (CommonJS) dans un fichier TypeScript au lieu de `import` (ES modules).

```typescript
// Ne fais pas ceci en TypeScript
const fs = require("fs");
```

**Solution** : Utilise la syntaxe `import` standard de TypeScript.

```typescript
// Fais ceci en TypeScript
import fs from "fs";
// Ou pour un import nommé
import { readFileSync } from "fs";
```

---

### Piège 4 : Le dossier `dist/` n'est pas vidé avant recompilation

**Problème** : Si tu supprimes un fichier `.ts`, le fichier `.js` correspondant reste dans `dist/`. `tsc` ne nettoie pas les anciens fichiers.

**Solution** : Ajoute un script de nettoyage dans `package.json`.

```json
{
  "scripts": {
    "clean": "rm -rf dist",
    "build": "rm -rf dist && tsc"
  }
}
```

---

## Checklist de Validation

- [ ] Node.js 22+ est installé (`node --version`)
- [ ] TypeScript est installé localement (`npx tsc --version`)
- [ ] Le fichier `tsconfig.json` est créé et configuré
- [ ] Je comprends les options principales : `target`, `module`, `strict`, `rootDir`, `outDir`
- [ ] Je sais compiler avec `npx tsc`
- [ ] Je sais exécuter le JavaScript compilé avec `node dist/index.js`
- [ ] `ts-node` est installé et je sais l'utiliser avec `npx ts-node src/index.ts`
- [ ] Les scripts npm `build`, `start`, `dev` et `watch` sont configurés

---

## Exercice Pratique

**Énoncé** : Crée un projet TypeScript complet avec la structure suivante :

```text
mon-calculateur/
├── src/
│   └── calculateur.ts
├── package.json
└── tsconfig.json
```

Le fichier `calculateur.ts` doit contenir :

1. Une interface `Operation` avec les propriétés `a` (number), `b` (number) et `operateur` (string)
2. Une fonction `calculer` qui prend une `Operation` et retourne un `number`
3. La fonction doit prendre en charge les opérateurs `+`, `-`, `*`, `/`
4. Trois appels de test avec affichage du résultat

**Indications** :

- Commence par `npm init -y` et `npm install --save-dev typescript`
- Crée le `tsconfig.json` avec les options vues dans cette fiche
- Utilise un `switch` pour gérer les différents opérateurs
- N'oublie pas de gérer la division par zéro

**Résultat attendu** :

```text
10 + 5 = 15
20 - 8 = 12
6 * 7 = 42
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1** : Initialise le projet.

```bash
mkdir mon-calculateur
cd mon-calculateur
npm init -y
npm install --save-dev typescript
npx tsc --init
mkdir src
```

**Étape 2** : Crée le fichier `tsconfig.json` :

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Étape 3** : Crée le fichier `src/calculateur.ts` :

```typescript
// src/calculateur.ts
// Calculateur simple avec TypeScript

// Interface qui définit la structure d'une opération mathématique
interface Operation {
  a: number; // Premier nombre
  b: number; // Deuxième nombre
  operateur: string; // L'opérateur : "+", "-", "*" ou "/"
}

// Fonction qui effectue le calcul selon l'opérateur
function calculer(operation: Operation): number {
  // On utilise un switch pour gérer chaque opérateur
  switch (operation.operateur) {
    case "+":
      // Addition
      return operation.a + operation.b;

    case "-":
      // Soustraction
      return operation.a - operation.b;

    case "*":
      // Multiplication
      return operation.a * operation.b;

    case "/":
      // Division : on vérifie que le diviseur n'est pas zéro
      if (operation.b === 0) {
        // On lance une erreur explicite plutôt que de retourner Infinity
        throw new Error("Division par zéro impossible");
      }
      return operation.a / operation.b;

    default:
      // Si l'opérateur n'est pas reconnu, on lance une erreur
      throw new Error(`Opérateur inconnu : ${operation.operateur}`);
  }
}

// Fonction qui affiche le résultat de manière lisible
function afficherResultat(operation: Operation): void {
  // void signifie que cette fonction ne retourne rien
  const resultat: number = calculer(operation);
  console.log(
    `${operation.a} ${operation.operateur} ${operation.b} = ${resultat}`
  );
}

// Tests avec trois opérations différentes
const addition: Operation = { a: 10, b: 5, operateur: "+" };
const soustraction: Operation = { a: 20, b: 8, operateur: "-" };
const multiplication: Operation = { a: 6, b: 7, operateur: "*" };

afficherResultat(addition);
afficherResultat(soustraction);
afficherResultat(multiplication);
```

**Étape 4** : Compile et exécute.

```bash
# Compile le projet
npx tsc

# Exécute le programme
node dist/calculateur.js
```

**Résultat attendu** :

```text
10 + 5 = 15
20 - 8 = 12
6 * 7 = 42
```

---

## Navigation

← Fiche précédente : **[01 - Introduction à TypeScript](01-introduction-typescript.md)**

→ Fiche suivante : **[03 - Types primitifs et annotations](03-types-primitifs-annotations.md)**
