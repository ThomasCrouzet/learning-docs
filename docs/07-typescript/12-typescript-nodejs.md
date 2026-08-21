---
tags:
  - TypeScript
  - Intermédiaire
  - Pratique
description: "Configurer un projet Node.js en TypeScript avec ts-node, tsx et un workflow de développement complet."
estimated_time: "60 min"
fiche_number: 12
total_fiches: 15
cursus: "TypeScript"
id: "web.typescript.typescript-nodejs"
course_id: "web.typescript"
content_type: "lesson"
order: 12
---

# 12 - TypeScript avec Node.js

> **En bref** : Apprendre à configurer un projet Node.js complet en TypeScript, utiliser ts-node et tsx pour le développement, et structurer un projet professionnel. Lecture estimée : 60 min.

## Prérequis

- [11 - Modules et namespaces](11-modules-namespaces.md)
- Connaître les bases de Node.js (modules, npm, scripts)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras initialiser un projet Node.js avec TypeScript, configurer `tsconfig.json` pour Node.js, utiliser `ts-node` et `tsx` pour exécuter du TypeScript directement, et mettre en place un workflow de développement avec compilation et rechargement automatique.

---

## Concepts

### Qu'est-ce que ts-node ?

**Définition** : `ts-node` est un outil qui permet d'exécuter des fichiers TypeScript directement avec Node.js, sans étape de compilation manuelle. Il compile le TypeScript en mémoire et l'exécute immédiatement.

**Le problème que ts-node résout** :

Sans ts-node, voici les problèmes rencontrés :

1. **Compilation manuelle** : À chaque modification, il faut exécuter `npx tsc` puis `node dist/fichier.js`. Ce cycle est lent et répétitif.
2. **Deux étapes distinctes** : La compilation et l'exécution sont séparées. On peut oublier de recompiler et exécuter une ancienne version du code.

**Comment ts-node résout ces problèmes** :

| Problème | Solution apportée par ts-node |
| -------- | ----------------------------- |
| Compilation manuelle | Compile en mémoire automatiquement |
| Deux étapes distinctes | Une seule commande : `npx ts-node src/fichier.ts` |

**Analogie concrète** : Sans ts-node, c'est comme écrire une lettre, la photocopier, puis la donner au destinataire. Avec ts-node, c'est comme parler directement au destinataire : pas d'étape intermédiaire.

**Ce que ts-node n'est PAS** :

- ts-node n'est pas pour la production. En production, on compile avec `tsc` et on exécute le JavaScript compilé pour de meilleures performances.
- ts-node n'est pas un bundler. Il ne regroupe pas les fichiers ni ne les optimise.
- ts-node n'est pas le seul moyen d'exécuter du `.ts`. Depuis Node.js 22.18, `node fichier.ts` strippe la syntaxe TypeScript effaçable. La documentation Node.js présente `tsx` comme exemple d'exécuteur pour une prise en charge complète (enums, namespaces, `tsconfig.json`).

---

### Qu'est-ce que tsx ?

**Définition** : `tsx` est une alternative moderne à `ts-node`. Il est plus rapide car il utilise `esbuild` (un compilateur écrit en Go) au lieu du compilateur TypeScript standard. Il prend aussi en charge le rechargement automatique (watch mode).

**Le problème que tsx résout** :

Sans tsx, voici les problèmes rencontrés :

1. **ts-node est lent** : Le compilateur TypeScript standard analyse et vérifie tous les types à chaque exécution. Pour un fichier simple, l'attente peut durer plusieurs secondes.
2. **Pas de watch mode intégré** : Avec ts-node, il faut installer un outil supplémentaire (comme `nodemon`) pour recompiler automatiquement quand un fichier change.
3. **Configuration complexe** : ts-node nécessite souvent des ajustements dans `tsconfig.json` pour fonctionner correctement (options `esModuleInterop`, `module`, etc.).

**Comment tsx résout ces problèmes** :

| Problème | Solution apportée par tsx |
| -------- | ------------------------ |
| ts-node est lent | esbuild compile en quelques millisecondes |
| Pas de watch mode intégré | `tsx watch src/index.ts` surveille les fichiers automatiquement |
| Configuration complexe | Fonctionne sans configuration supplémentaire |

**Analogie concrète** : ts-node est comme un traducteur humain qui lit chaque mot, vérifie la grammaire et traduit soigneusement. tsx est comme un traducteur automatique instantané : il traduit en une fraction de seconde, mais ne vérifie pas la grammaire (les types). Pour le développement au quotidien, la vitesse de tsx est plus confortable. Pour la vérification finale, on utilise `tsc --noEmit` séparément.

**Comparaison ts-node vs tsx** :

| ts-node | tsx |
| ------- | --- |
| Compilateur TypeScript standard | Compilateur esbuild (plus rapide) |
| Vérifie les types à l'exécution (optionnel) | Ne vérifie pas les types (vitesse) |
| Configuration plus complexe | Fonctionne sans configuration |
| Plus ancien, très utilisé | Plus récent ; exemple officiel Node pour le TypeScript complet |

---

### Comment structurer un projet Node.js TypeScript ?

**Définition** : Un projet Node.js TypeScript suit une structure conventionnelle avec les sources TypeScript dans un dossier `src/`, le code compilé dans `dist/`, et une configuration `tsconfig.json` adaptée à Node.js.

**Le problème que la structure projet résout** :

Sans structure conventionnelle, voici les problèmes rencontrés :

1. **Fichiers mélangés** : Les fichiers source TypeScript (`.ts`) et les fichiers compilés JavaScript (`.js`) se retrouvent dans le même dossier. On ne sait plus quels fichiers modifier et lesquels sont générés automatiquement.
2. **Déploiement pollué** : En production, on envoie les fichiers TypeScript alors que seul le JavaScript compilé est nécessaire.
3. **Configuration incohérente** : Sans convention, chaque développeur organise le projet différemment, ce qui rend la collaboration difficile.

**Comment la structure projet résout ces problèmes** :

| Problème | Solution apportée par la structure |
| -------- | ---------------------------------- |
| Fichiers mélangés | `src/` contient les sources, `dist/` contient le compilé |
| Déploiement pollué | On déploie uniquement `dist/`, pas `src/` |
| Configuration incohérente | Convention standard reconnue par tous les outils |

**Analogie concrète** : La structure d'un projet TypeScript est comme l'organisation d'un atelier de couture. Le dossier `src/` est la table de travail avec les patrons et les tissus (code source). Le dossier `dist/` est le portant avec les vêtements terminés (code compilé). Le fichier `tsconfig.json` est la fiche d'instructions qui dit à la machine à coudre comment assembler les pièces. On ne mélange jamais les patrons avec les vêtements finis.

**Structure standard** :

```text
mon-projet/
├── src/           → Code source TypeScript
│   ├── index.ts   → Point d'entrée
│   └── utils/     → Modules utilitaires
├── dist/          → Code JavaScript compilé (généré)
├── node_modules/  → Dépendances npm
├── package.json   → Configuration du projet
├── tsconfig.json  → Configuration TypeScript
└── .gitignore     → Ignore dist/ et node_modules/
```

---

## Étapes Pratiques

### Étape 1 : Initialiser un projet Node.js TypeScript

Crée un nouveau dossier de projet et initialise-le :

```bash
mkdir mon-projet-ts
cd mon-projet-ts
npm init -y
```

Installe TypeScript et les types Node.js :

```bash
npm install --save-dev typescript @types/node ts-node tsx
```

Crée le fichier `tsconfig.json` adapté à Node.js :

```bash
npx tsc --init
```

Modifie le fichier `tsconfig.json` avec cette configuration :

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Explication de chaque option :

| Option | Valeur | Rôle |
| ------ | ------ | ---- |
| `target` | `ES2022` | Version JavaScript de sortie (Node.js 22 prend en charge ES2022) |
| `module` | `commonjs` | Système de modules (Node.js utilise CommonJS par défaut) |
| `lib` | `["ES2022"]` | APIs JavaScript disponibles |
| `outDir` | `./dist` | Dossier de sortie pour le JavaScript compilé |
| `rootDir` | `./src` | Dossier racine du code source |
| `strict` | `true` | Active toutes les vérifications strictes |
| `esModuleInterop` | `true` | Compatibilité import/export avec CommonJS |
| `resolveJsonModule` | `true` | Permet d'importer des fichiers JSON |
| `declaration` | `true` | Génère les fichiers `.d.ts` |
| `sourceMap` | `true` | Fichiers `.map` pour le débogage |

---

### Étape 2 : Configurer les scripts npm

Modifie la section `scripts` du fichier `package.json` :

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "dev:ts-node": "ts-node src/index.ts",
    "lint": "tsc --noEmit"
  }
}
```

Explication de chaque script :

| Script | Commande | Usage |
| ------ | -------- | ----- |
| `build` | `tsc` | Compile tout le projet en JavaScript dans `dist/` |
| `start` | `node dist/index.js` | Exécute la version compilée (production) |
| `dev` | `tsx watch src/index.ts` | Développement avec rechargement automatique |
| `dev:ts-node` | `ts-node src/index.ts` | Exécution directe avec ts-node |
| `lint` | `tsc --noEmit` | Vérifie les types sans compiler |

---

### Étape 3 : Créer le point d'entrée

Crée le dossier `src/` et le fichier principal.

```bash
mkdir -p src
```

Crée `src/index.ts` :

```typescript
// src/index.ts
// Point d'entrée de l'application Node.js TypeScript

import { afficherBienvenue, calculerStats } from "./utils/helpers";
import { Tache, creerTache, terminerTache } from "./models/tache";

// Afficher un message de bienvenue
afficherBienvenue("Gestionnaire de Tâches");

// Créer quelques tâches
const taches: Tache[] = [
  creerTache("Apprendre TypeScript", "haute"),
  creerTache("Configurer le projet", "moyenne"),
  creerTache("Écrire des tests", "haute"),
  creerTache("Documenter le code", "basse"),
];

// Terminer certaines tâches
taches[1] = terminerTache(taches[1]);

// Afficher les tâches
console.log("\nListe des tâches :");
taches.forEach((tache: Tache): void => {
  const icone: string = tache.terminee ? "[x]" : "[ ]";
  console.log(`  ${icone} ${tache.titre} (${tache.priorite})`);
});

// Afficher les statistiques
const stats = calculerStats(taches);
console.log("\nStatistiques :");
console.log(`  Total : ${stats.total}`);
console.log(`  Terminées : ${stats.terminees}`);
console.log(`  En cours : ${stats.enCours}`);
console.log(`  Taux : ${stats.tauxCompletion}%`);
```

---

### Étape 4 : Créer les modules

Crée d'abord les dossiers des modules :

```bash
mkdir -p src/models src/utils
```

Crée `src/models/tache.ts` :

```typescript
// src/models/tache.ts
// Modèle de données pour une tâche

export type Priorite = "haute" | "moyenne" | "basse";

export interface Tache {
  id: number;
  titre: string;
  terminee: boolean;
  priorite: Priorite;
  dateCreation: Date;
}

// Compteur global pour les identifiants
let compteur: number = 0;

export function creerTache(titre: string, priorite: Priorite): Tache {
  compteur++;
  return {
    id: compteur,
    titre: titre,
    terminee: false,
    priorite: priorite,
    dateCreation: new Date(),
  };
}

export function terminerTache(tache: Tache): Tache {
  return {
    ...tache,
    terminee: true,
  };
}
```

Crée `src/utils/helpers.ts` :

```typescript
// src/utils/helpers.ts
// Fonctions utilitaires

import type { Tache } from "../models/tache";

export interface Stats {
  total: number;
  terminees: number;
  enCours: number;
  tauxCompletion: number;
}

export function afficherBienvenue(nomApp: string): void {
  const separateur: string = "=".repeat(nomApp.length + 4);
  console.log(separateur);
  console.log(`  ${nomApp}`);
  console.log(separateur);
}

export function calculerStats(taches: Tache[]): Stats {
  const total: number = taches.length;
  const terminees: number = taches.filter(
    (t: Tache): boolean => t.terminee
  ).length;
  const enCours: number = total - terminees;
  const tauxCompletion: number =
    total > 0 ? Math.round((terminees / total) * 100) : 0;

  return { total, terminees, enCours, tauxCompletion };
}
```

---

### Étape 5 : Exécuter et compiler

Exécute en mode développement avec tsx (rechargement automatique) :

```bash
npm run dev
```

Pour une exécution unique sans watch, `npm run dev:ts-node` lance `ts-node`. Sur Node.js 22.18+, `node src/index.ts` suffit si le code n'utilise que de la syntaxe TypeScript effaçable (pas d'`enum` ni de namespace avec du code).

**Résultat attendu** :

```text
============================
  Gestionnaire de Tâches
============================

Liste des tâches :
  [ ] Apprendre TypeScript (haute)
  [x] Configurer le projet (moyenne)
  [ ] Écrire des tests (haute)
  [ ] Documenter le code (basse)

Statistiques :
  Total : 4
  Terminées : 1
  En cours : 3
  Taux : 25%
```

Compile pour la production :

```bash
npm run build
```

Vérifie le dossier `dist/` :

```bash
ls dist/
```

**Résultat attendu** :

```text
index.d.ts
index.d.ts.map
index.js
index.js.map
models/
utils/
```

Le dossier `dist/` contient le JavaScript compilé, les fichiers de déclaration `.d.ts`, et les source maps `.map`.

Exécute la version compilée :

```bash
npm start
```

Le résultat est identique à l'exécution avec ts-node.

---

### Étape 6 : Vérifier les types sans compiler

La commande `lint` vérifie les types sans générer de fichiers :

```bash
npm run lint
```

Si tout est correct, la commande ne produit aucune sortie. S'il y a des erreurs de type, elles sont affichées :

```text
src/index.ts(5,10): error TS2322: Type 'string' is not assignable to type 'number'.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npm run build` | Compile le projet TypeScript en JavaScript |
| `npm start` | Exécute la version compilée |
| `npm run dev` | Développement avec rechargement automatique (tsx) |
| `npm run dev:ts-node` | Exécution directe avec ts-node |
| `npm run lint` | Vérifie les types sans compiler |
| `npx tsc --showConfig` | Affiche la configuration TypeScript complète |
| `node src/index.ts` | Type stripping natif (Node.js 22.18+, syntaxe effaçable uniquement) |

---

## Pièges Fréquents

### Piège 1 : Oublier d'installer @types/node

⚠️ **Problème** : Les types de Node.js (process, path, fs, etc.) ne sont pas reconnus.

```text
Cannot find module 'path' or its corresponding type declarations.
```

✅ **Solution** : Installe les types Node.js.

```bash
npm install --save-dev @types/node
```

---

### Piège 2 : Mauvais chemin d'import après compilation

⚠️ **Problème** : Les imports fonctionnent en développement mais pas après compilation car les chemins relatifs ne correspondent plus.

✅ **Solution** : Vérifie que `rootDir` et `outDir` dans `tsconfig.json` sont correctement configurés. La structure des dossiers dans `dist/` doit reproduire celle de `src/`.

---

### Piège 3 : Utiliser ts-node en production

⚠️ **Problème** : Exécuter `ts-node` en production au lieu du JavaScript compilé. ts-node compile à chaque exécution, ce qui est plus lent.

✅ **Solution** : En production, compile d'abord avec `npm run build`, puis exécute avec `npm start` (qui lance `node dist/index.js`).

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

---

### Piège 4 : Utiliser `tsx` sans vérifier les types

⚠️ **Problème** : `tsx` utilise `esbuild` pour transpiler TypeScript en JavaScript. Il est très rapide mais ne vérifie **pas** les types. Utiliser `tsx` en développement sans jamais lancer `tsc --noEmit` peut masquer des erreurs de type silencieuses.

```bash
# tsx exécute le code sans vérification des types
npm run dev        # rapide, mais pas de contrôle des types

# Exemple d'erreur silencieuse avec tsx :
# Une variable attendant un number reçoit un string -> tsx execute quand même
```

✅ **Solution** : Lance régulièrement `tsc --noEmit` (ou `npm run lint`) pour vérifier les types séparément de l'exécution.

```bash
# Vérification des types sans compilation
npm run lint       # équivaut à : tsc --noEmit
```

> **Rappel** : Le script `lint` est déjà configuré dans `package.json` depuis l'étape 2. C'est la commande à lancer avant chaque commit pour s'assurer qu'aucune erreur de type ne s'est glissée dans le code.

---

## Checklist de Validation

- [ ] Je sais initialiser un projet Node.js avec TypeScript
- [ ] Je sais configurer `tsconfig.json` pour Node.js
- [ ] Je sais utiliser ts-node pour le développement
- [ ] Je sais utiliser tsx pour le développement avec watch mode
- [ ] Je sais compiler le projet avec `tsc`
- [ ] Je sais configurer les scripts npm (build, start, dev, lint)
- [ ] Je comprends la différence entre le mode développement et la production

---

## Exercice Pratique

**Énoncé** : Crée un mini-projet Node.js TypeScript qui gère un carnet de contacts :

1. Initialise le projet avec `npm init -y` et installe les dépendances TypeScript
2. Crée une interface `Contact` avec : `id`, `nom`, `telephone`, `email` (optionnel)
3. Crée un module `src/contact-service.ts` avec : `ajouterContact()`, `rechercherParNom()`, `listerContacts()`
4. Crée un module `src/affichage.ts` avec : `afficherContact()`, `afficherListe()`
5. Crée le point d'entrée `src/index.ts` qui ajoute 3 contacts, recherche par nom, et affiche la liste
6. Configure les scripts npm : `build`, `start`, `dev`

**Indications** :

- Stocke les contacts dans un tableau en mémoire (pas de fichier)
- La recherche par nom doit être insensible à la casse
- Utilise `Partial<Contact>` pour les mises à jour

**Résultat attendu** :

```text
Contact ajouté : Alice Dupont
Contact ajouté : Bob Martin
Contact ajouté : Charlie Durand

Recherche "alice" :
  Alice Dupont - 01 23 45 67 89 (alice@test.fr)

Tous les contacts :
  #1 Alice Dupont - 01 23 45 67 89 (alice@test.fr)
  #2 Bob Martin - 06 12 34 56 78
  #3 Charlie Durand - 09 87 65 43 21 (charlie@test.fr)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

`src/models/contact.ts` :

```typescript
// src/models/contact.ts

export interface Contact {
  id: number;
  nom: string;
  telephone: string;
  email?: string;
}
```

`src/contact-service.ts` :

```typescript
// src/contact-service.ts
import type { Contact } from "./models/contact";

const contacts: Contact[] = [];
let compteur: number = 0;

export function ajouterContact(
  nom: string,
  telephone: string,
  email?: string
): Contact {
  compteur++;
  const contact: Contact = {
    id: compteur,
    nom: nom,
    telephone: telephone,
    email: email,
  };
  contacts.push(contact);
  console.log(`Contact ajouté : ${nom}`);
  return contact;
}

export function rechercherParNom(recherche: string): Contact[] {
  const rechercheLower: string = recherche.toLowerCase();
  return contacts.filter((contact: Contact): boolean =>
    contact.nom.toLowerCase().includes(rechercheLower)
  );
}

export function listerContacts(): Contact[] {
  return [...contacts];
}
```

`src/affichage.ts` :

```typescript
// src/affichage.ts
import type { Contact } from "./models/contact";

export function afficherContact(contact: Contact): void {
  const email: string = contact.email ? ` (${contact.email})` : "";
  console.log(`  ${contact.nom} - ${contact.telephone}${email}`);
}

export function afficherListe(contacts: Contact[]): void {
  contacts.forEach((contact: Contact): void => {
    const email: string = contact.email ? ` (${contact.email})` : "";
    console.log(
      `  #${contact.id} ${contact.nom} - ${contact.telephone}${email}`
    );
  });
}
```

`src/index.ts` :

```typescript
// src/index.ts
import { ajouterContact, rechercherParNom, listerContacts } from "./contact-service";
import { afficherContact, afficherListe } from "./affichage";

// Ajouter des contacts
ajouterContact("Alice Dupont", "01 23 45 67 89", "alice@test.fr");
ajouterContact("Bob Martin", "06 12 34 56 78");
ajouterContact("Charlie Durand", "09 87 65 43 21", "charlie@test.fr");

// Rechercher par nom
const resultats = rechercherParNom("alice");
console.log('\nRecherche "alice" :');
resultats.forEach(afficherContact);

// Lister tous les contacts
console.log("\nTous les contacts :");
afficherListe(listerContacts());
```

Compile et exécute :

```bash
npm run build && npm start
```

**Résultat attendu** :

```text
Contact ajouté : Alice Dupont
Contact ajouté : Bob Martin
Contact ajouté : Charlie Durand

Recherche "alice" :
  Alice Dupont - 01 23 45 67 89 (alice@test.fr)

Tous les contacts :
  #1 Alice Dupont - 01 23 45 67 89 (alice@test.fr)
  #2 Bob Martin - 06 12 34 56 78
  #3 Charlie Durand - 09 87 65 43 21 (charlie@test.fr)
```

---

## Navigation

← Fiche précédente : **[11 - Modules et namespaces](11-modules-namespaces.md)**

→ Fiche suivante : **[13 - Gestion d'erreurs typée](13-gestion-erreurs-typee.md)**
