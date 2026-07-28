---
tags:
  - TypeScript
  - Débutant
  - Concept
description: "Découvrir TypeScript, comprendre pourquoi le typage statique résout les problèmes du JavaScript dynamique."
estimated_time: "45 min"
fiche_number: 1
total_fiches: 15
cursus: "TypeScript"
---

# 01 - Introduction à TypeScript

> **En bref** : Comprendre pourquoi TypeScript existe et les avantages du typage statique par rapport au JavaScript dynamique. Lecture estimée : 45 min.

## Prérequis

- Avoir terminé le [cursus JavaScript Moderne](../06-javascript-moderne/index.md)
- Connaître les bases de JavaScript : variables, fonctions, objets, tableaux

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer ce qu'est TypeScript, pourquoi il a été créé, et quels problèmes du JavaScript il résout grâce au typage statique.

---

## Concepts

### Qu'est-ce que TypeScript ?

**Définition** : TypeScript est un langage de programmation créé par Microsoft en 2012. C'est un **sur-ensemble de JavaScript** : tout code JavaScript valide est aussi du code TypeScript valide. TypeScript ajoute un système de **typage statique** au JavaScript.

**Le problème que TypeScript résout** :

Sans TypeScript, voici les problèmes rencontrés en JavaScript :

1. **Erreurs à l'exécution** : JavaScript ne signale pas les erreurs de type avant d'exécuter le code. Une faute de frappe dans un nom de propriété ne sera détectée que lorsque l'utilisateur rencontrera le bug.
2. **Manque de documentation du code** : En lisant une fonction JavaScript, on ne sait pas quel type de données elle attend ni ce qu'elle retourne. Il faut lire tout le code pour comprendre.
3. **Refactoring risqué** : Renommer une propriété ou changer la structure d'un objet peut casser du code à des endroits invisibles. Sans typage, l'éditeur ne peut pas détecter tous les endroits impactés.
4. **Autocomplétion limitée** : L'éditeur de code ne peut pas proposer les bonnes suggestions s'il ne connaît pas le type d'une variable.

**Comment TypeScript résout ces problèmes** :

| Problème | Solution apportée par TypeScript |
| -------- | -------------------------------- |
| Erreurs à l'exécution | Le compilateur détecte les erreurs **avant** l'exécution |
| Manque de documentation | Les types servent de documentation intégrée au code |
| Refactoring risqué | Le compilateur signale tous les endroits impactés par un changement |
| Autocomplétion limitée | L'éditeur connaît les types et propose des suggestions précises |

**Analogie concrète** : Imagine que tu remplis un formulaire papier. En JavaScript, le formulaire n'a aucune indication : tu peux écrire n'importe quoi dans n'importe quelle case. Tu ne découvriras les erreurs que quand quelqu'un essaiera de traiter le formulaire. En TypeScript, chaque case du formulaire indique clairement ce qu'elle attend (nom, date de naissance, numéro de téléphone). Si tu écris une date dans la case "numéro de téléphone", tu vois immédiatement que c'est une erreur.

**Ce que TypeScript n'est PAS** :

- TypeScript n'est pas un langage différent de JavaScript. C'est du JavaScript avec des types en plus. Tout code JavaScript fonctionne en TypeScript.
- TypeScript n'est pas exécuté directement. Il est **compilé** (transformé) en JavaScript avant d'être exécuté par Node.js ou le navigateur.
- TypeScript n'est pas un framework. C'est un langage. Il fonctionne avec n'importe quel framework (React, Express, Angular, etc.).

---

### Qu'est-ce que le typage statique ?

**Définition** : Le typage statique signifie que le type de chaque variable est vérifié **avant** l'exécution du programme, pendant la phase de compilation. Le typage dynamique (JavaScript) vérifie les types **pendant** l'exécution.

**Le problème que le typage statique résout** :

Sans typage statique, voici les problèmes rencontrés :

1. **Bugs silencieux** : JavaScript convertit automatiquement les types sans prévenir. `"5" + 3` donne `"53"` (une chaîne) au lieu de `8` (un nombre). Ce comportement cause des bugs difficiles à trouver.
2. **Erreurs tardives** : Les erreurs de type ne sont détectées qu'à l'exécution, parfois des semaines après l'écriture du code, quand un utilisateur tombe sur le cas problématique.
3. **Débogage long** : Sans indication de type, il faut ajouter des `console.log` partout pour comprendre quel type de donnée circule dans le programme.

**Comment le typage statique résout ces problèmes** :

| Problème | Solution apportée par le typage statique |
| -------- | ---------------------------------------- |
| Bugs silencieux | Le compilateur refuse les opérations entre types incompatibles |
| Erreurs tardives | Les erreurs sont détectées immédiatement dans l'éditeur |
| Débogage long | Le type de chaque variable est visible et vérifiable |

**Analogie concrète** : Le typage dynamique, c'est comme une prise électrique universelle : tu peux brancher n'importe quoi, mais si tu branches un appareil 110V sur du 220V, il grille. Le typage statique, c'est comme une prise avec une forme spécifique : seul l'appareil compatible peut se brancher. Si la fiche ne rentre pas, tu sais immédiatement qu'il y a un problème.

**Comparaison typage statique vs typage dynamique** :

| Typage statique (TypeScript) | Typage dynamique (JavaScript) |
| ---------------------------- | ----------------------------- |
| Erreurs détectées à la compilation | Erreurs détectées à l'exécution |
| Types déclarés explicitement ou inférés | Types déterminés à l'exécution |
| Autocomplétion précise dans l'éditeur | Autocomplétion limitée |
| Temps de développement initial plus long | Développement initial plus rapide |
| Moins de bugs en production | Plus de bugs potentiels en production |

---

### Qu'est-ce que la compilation TypeScript ?

**Définition** : La compilation TypeScript est le processus qui transforme du code TypeScript (fichiers `.ts`) en code JavaScript (fichiers `.js`). L'outil qui effectue cette transformation s'appelle `tsc` (TypeScript Compiler).

**Le problème que la compilation résout** :

Sans compilation, voici les problèmes rencontrés :

1. **Incompatibilité** : Ni Node.js ni les navigateurs ne comprennent directement le TypeScript. Ils ne comprennent que le JavaScript.
2. **Ciblage de versions** : Différents environnements prennent en charge différentes versions de JavaScript (ES5, ES6, ES2020, etc.). Il faut adapter le code à l'environnement cible.

**Comment la compilation résout ces problèmes** :

| Problème | Solution apportée par la compilation |
| -------- | ------------------------------------ |
| Incompatibilité | Le compilateur produit du JavaScript standard exécutable partout |
| Ciblage de versions | Le compilateur peut cibler n'importe quelle version de JavaScript |

**Analogie concrète** : La compilation TypeScript fonctionne comme un traducteur. Tu écris un livre en français (TypeScript), et le traducteur le transforme en anglais (JavaScript) pour que le public anglophone (Node.js, navigateurs) puisse le lire. Le livre traduit contient exactement les mêmes idées, mais dans un langage compréhensible par le lecteur.

**Ce que la compilation n'est PAS** :

- La compilation n'ajoute pas de vérifications de type à l'exécution. Les types sont vérifiés **uniquement** pendant la compilation, puis ils disparaissent du code JavaScript généré.
- La compilation ne modifie pas la logique de ton code. Le JavaScript généré fait exactement la même chose que ton TypeScript, mais sans les annotations de type.

---

### L'écosystème TypeScript

**Définition** : L'écosystème TypeScript comprend l'ensemble des outils, bibliothèques et ressources qui accompagnent le langage. Cet écosystème est intégré à celui de JavaScript : toute bibliothèque JavaScript peut être utilisée en TypeScript.

**Les composants principaux de l'écosystème** :

| Composant | Rôle | Exemple |
| --------- | ---- | ------- |
| `tsc` | Compilateur officiel | Transforme `.ts` en `.js` |
| `tsconfig.json` | Configuration du projet | Définit les options de compilation |
| DefinitelyTyped | Dépôt de définitions de types | Fournit les types pour les bibliothèques JS existantes |
| `@types/*` | Packages de types | `@types/node`, `@types/express` |
| `ts-node` | Exécution directe | Exécute du TypeScript sans étape de compilation manuelle |
| VS Code | Éditeur recommandé | Support TypeScript intégré nativement |

**L'adoption de TypeScript** :

TypeScript est utilisé par de nombreux projets majeurs :

- Angular (Google) : entièrement écrit en TypeScript
- VS Code (Microsoft) : entièrement écrit en TypeScript
- Deno : runtime qui prend en charge TypeScript nativement
- Les principales bibliothèques npm fournissent des types TypeScript

---

## Étapes Pratiques

### Étape 1 : Observer un bug JavaScript classique

Crée un fichier `bug-demo.js` :

```javascript
// Ce fichier montre un bug classique en JavaScript
// La fonction calcule le prix total avec une remise
function calculerPrixTotal(prix, remise) {
  // On s'attend à recevoir des nombres
  // Mais JavaScript ne vérifie pas les types
  return prix - (prix * remise) / 100;
}

// Utilisation correcte : prix 100, remise 20%
const resultat1 = calculerPrixTotal(100, 20);
console.log("Résultat correct :", resultat1);

// Utilisation incorrecte : on passe une chaîne au lieu d'un nombre
// JavaScript ne signale aucune erreur
const resultat2 = calculerPrixTotal("100", "20");
console.log("Résultat incorrect :", resultat2);

// Autre bug : propriété mal orthographiée
const utilisateur = {
  nom: "Alice",
  age: 25,
};

// JavaScript ne signale pas la faute de frappe "nmo" au lieu de "nom"
console.log("Nom :", utilisateur.nmo);
```

Exécute ce fichier :

```bash
node bug-demo.js
```

**Résultat attendu** :

```text
Résultat correct : 80
Résultat incorrect : 80
Nom : undefined
```

Le deuxième résultat semble correct par hasard, mais le calcul est fait avec des chaînes. La propriété `nmo` retourne `undefined` sans aucune erreur. Ces bugs sont difficiles à détecter dans un grand programme.

---

### Étape 2 : Observer la même situation en TypeScript

Crée un fichier `bug-demo.ts` (note l'extension `.ts`) :

```typescript
// Ce fichier montre comment TypeScript détecte les mêmes bugs
// La fonction attend explicitement des nombres
function calculerPrixTotal(prix: number, remise: number): number {
  // Les types sont déclarés : prix est un number, remise est un number
  // La fonction retourne un number
  return prix - (prix * remise) / 100;
}

// Utilisation correcte : aucune erreur
const resultat1: number = calculerPrixTotal(100, 20);
console.log("Résultat correct :", resultat1);

// Utilisation incorrecte : TypeScript signale une erreur
// Erreur : Argument of type 'string' is not assignable to parameter of type 'number'
// const resultat2 = calculerPrixTotal("100", "20");

// Définition d'un type pour l'utilisateur
interface Utilisateur {
  nom: string;
  age: number;
}

const utilisateur: Utilisateur = {
  nom: "Alice",
  age: 25,
};

// TypeScript signale une erreur : Property 'nmo' does not exist on type 'Utilisateur'
// console.log("Nom :", utilisateur.nmo);

// Utilisation correcte
console.log("Nom :", utilisateur.nom);
```

Ce fichier ne peut pas encore être exécuté (nous installerons TypeScript dans la fiche suivante). L'objectif est de voir la **syntaxe** des types : `: number`, `: string`, `interface`.

---

### Étape 3 : Comparer la syntaxe JavaScript et TypeScript

Voici un tableau comparatif côte à côte :

```typescript
// ============ JAVASCRIPT ============
// Aucune indication de type
let age = 25;
let nom = "Alice";
let estActif = true;

function saluer(personne) {
  return "Bonjour " + personne;
}

// ============ TYPESCRIPT ============
// Les types sont déclarés explicitement
let age: number = 25;
let nom: string = "Alice";
let estActif: boolean = true;

function saluer(personne: string): string {
  return "Bonjour " + personne;
}
```

**Résultat attendu** :

```text
La syntaxe TypeScript est identique à JavaScript,
avec des annotations de type en plus après les deux-points (:).
```

---

### Étape 4 : Comprendre le flux de travail TypeScript

Le flux de travail TypeScript suit toujours ces étapes :

```text
1. Écriture      →  Fichier .ts (TypeScript)
2. Compilation   →  tsc transforme .ts en .js
3. Vérification  →  tsc signale les erreurs de type
4. Exécution     →  Node.js ou navigateur exécute le .js
```

Voici un schéma du processus complet :

```text
  [code.ts]         [tsc]           [code.js]        [Node.js]
  TypeScript  →  Compilateur  →  JavaScript  →  Exécution
                     ↓
              Erreurs de type
              (s'il y en a)
```

**Point important** : Les types TypeScript n'existent **que** pendant la compilation. Le JavaScript généré ne contient aucune trace des types. C'est ce qu'on appelle l'**effacement de types** (type erasure).

```typescript
// Fichier TypeScript (avant compilation)
const age: number = 25;
const nom: string = "Alice";

function saluer(personne: string): string {
  return "Bonjour " + personne;
}
```

Après compilation, le fichier JavaScript généré :

```javascript
// Fichier JavaScript (après compilation)
// Les types ont disparu
const age = 25;
const nom = "Alice";

function saluer(personne) {
  return "Bonjour " + personne;
}
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `tsc fichier.ts` | Compile un fichier TypeScript en JavaScript |
| `tsc --init` | Crée un fichier `tsconfig.json` avec les options par défaut |
| `tsc --watch` | Compile automatiquement à chaque modification |
| `tsc --noEmit` | Vérifie les types sans générer de fichier JavaScript |
| `npx ts-node fichier.ts` | Exécute un fichier TypeScript directement (sans compilation manuelle) |

---

## Pièges Fréquents

### Piège 1 : Croire que TypeScript s'exécute directement

**Problème** : Essayer d'exécuter un fichier `.ts` avec `node` directement.

```bash
# Ceci ne fonctionne pas
node fichier.ts
```

**Solution** : Tu dois d'abord compiler le fichier en JavaScript, puis exécuter le JavaScript. Ou utiliser `ts-node` qui fait les deux étapes en une.

```bash
# Option 1 : compiler puis exécuter
tsc fichier.ts
node fichier.js

# Option 2 : utiliser ts-node
npx ts-node fichier.ts
```

---

### Piège 2 : Penser que les types existent à l'exécution

**Problème** : Écrire du code qui essaie de vérifier un type TypeScript pendant l'exécution.

```typescript
// Ceci ne fonctionne PAS
// Les interfaces n'existent pas à l'exécution
interface Chat {
  nom: string;
  miauler(): void;
}

// Erreur : 'Chat' only refers to a type, but is being used as a value
// if (animal instanceof Chat) { ... }
```

**Solution** : Utiliser des vérifications qui existent en JavaScript (`typeof`, `in`, `instanceof` avec des classes).

```typescript
// Ceci fonctionne : typeof existe en JavaScript
if (typeof valeur === "string") {
  console.log("C'est une chaîne :", valeur);
}

// Ceci fonctionne : vérifier si une propriété existe
if ("miauler" in animal) {
  console.log("C'est un chat");
}
```

---

### Piège 3 : Confondre TypeScript et JavaScript strict mode

**Problème** : Croire que TypeScript remplace le `"use strict"` de JavaScript.

**Solution** : TypeScript et le mode strict de JavaScript sont deux choses différentes. TypeScript ajoute un système de types. Le mode strict de JavaScript modifie le comportement du moteur d'exécution. TypeScript peut générer du JavaScript en mode strict (option `alwaysStrict` dans `tsconfig.json`), mais ce sont deux concepts séparés.

---

## Checklist de Validation

- [ ] Je sais que TypeScript est un sur-ensemble de JavaScript avec du typage statique
- [ ] Je comprends la différence entre typage statique et typage dynamique
- [ ] Je sais que TypeScript est compilé en JavaScript avant exécution
- [ ] Je comprends que les types disparaissent après compilation (type erasure)
- [ ] Je connais les principaux avantages de TypeScript : détection d'erreurs, documentation, autocomplétion
- [ ] Je sais que tout code JavaScript valide est aussi du code TypeScript valide

---

## Exercice Pratique

**Énoncé** : Analyse le code JavaScript suivant et identifie tous les bugs potentiels qu'un système de typage statique détecterait.

```javascript
function creerProfil(nom, age, email) {
  return {
    nom: nom,
    age: age,
    email: email,
    estMajeur: age >= 18,
  };
}

const profil1 = creerProfil("Alice", 25, "alice@exemple.fr");
const profil2 = creerProfil("Bob", "trente", "bob@exemple.fr");
const profil3 = creerProfil("Charlie", 17);

console.log(profil1.nom);
console.log(profil2.estMajeur);
console.log(profil3.emal);
console.log(profil1.age + profil2.age);
```

**Indications** :

- Cherche les paramètres avec un type incorrect
- Cherche les paramètres manquants
- Cherche les propriétés mal orthographiées
- Cherche les opérations entre types incompatibles

**Résultat attendu** : Une liste de 4 bugs avec explication de chacun.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Bug 1 : Type incorrect pour `age`**

```javascript
const profil2 = creerProfil("Bob", "trente", "bob@exemple.fr");
```

Le deuxième paramètre devrait être un nombre, mais on passe la chaîne `"trente"`. La comparaison `"trente" >= 18` retourne `false` en JavaScript (comparaison chaîne/nombre), ce qui est un résultat incorrect.

**Bug 2 : Paramètre manquant**

```javascript
const profil3 = creerProfil("Charlie", 17);
```

Le troisième paramètre `email` est manquant. JavaScript ne signale pas d'erreur : `email` vaudra `undefined`. TypeScript exigerait de fournir tous les paramètres obligatoires.

**Bug 3 : Propriété mal orthographiée**

```javascript
console.log(profil3.emal);
```

La propriété s'appelle `email`, pas `emal`. JavaScript retourne `undefined` silencieusement. TypeScript signalerait que `emal` n'existe pas sur le type du profil.

**Bug 4 : Opération entre types incompatibles**

```javascript
console.log(profil1.age + profil2.age);
```

`profil1.age` est `25` (nombre) et `profil2.age` est `"trente"` (chaîne). L'opération `25 + "trente"` donne `"25trente"` (concaténation) au lieu d'une addition. TypeScript aurait empêché de passer une chaîne pour `age`.

**Version TypeScript corrigée** :

```typescript
// Les types empêchent tous les bugs identifiés
interface Profil {
  nom: string;
  age: number;
  email: string;
  estMajeur: boolean;
}

function creerProfil(nom: string, age: number, email: string): Profil {
  return {
    nom: nom,
    age: age,
    email: email,
    estMajeur: age >= 18,
  };
}

// Correct
const profil1: Profil = creerProfil("Alice", 25, "alice@exemple.fr");

// Erreur : Argument of type 'string' is not assignable to parameter of type 'number'
// const profil2 = creerProfil("Bob", "trente", "bob@exemple.fr");

// Erreur : Expected 3 arguments, but got 2
// const profil3 = creerProfil("Charlie", 17);

// Correct
console.log(profil1.nom);

// Erreur : Property 'emal' does not exist on type 'Profil'. Did you mean 'email'?
// console.log(profil3.emal);
```

---

## Navigation

→ Fiche suivante : **[02 - Installation et configuration](02-installation-configuration.md)**
