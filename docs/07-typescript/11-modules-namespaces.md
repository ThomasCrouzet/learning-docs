---
tags:
  - TypeScript
  - Intermédiaire
  - Concept
description: "Maîtriser les modules TypeScript : import/export, déclaration files (.d.ts), @types et résolution de modules."
estimated_time: "75 min"
fiche_number: 11
total_fiches: 15
cursus: "TypeScript"
id: "web.typescript.modules-namespaces"
course_id: "web.typescript"
content_type: "lesson"
order: 11
---

# 11 - Modules et namespaces

> **En bref** : Apprendre à organiser le code TypeScript en modules avec import/export, comprendre les fichiers de déclaration (.d.ts) et le système @types. Lecture estimée : 75 min.

## Prérequis

- [10 - Generics](10-generics.md)
- Connaître les modules JavaScript ES (import/export)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras organiser du code TypeScript en modules, utiliser les import/export nommés et par défaut, créer des fichiers de déclaration `.d.ts`, et installer des types pour les bibliothèques JavaScript via `@types`.

---

## Concepts

### Qu'est-ce qu'un module TypeScript ?

**Définition** : Un module TypeScript est un fichier qui contient au moins une instruction `import` ou `export`. Chaque module a sa propre portée (scope) : les variables, fonctions et types déclarés dans un module ne sont pas visibles de l'extérieur, sauf s'ils sont explicitement exportés.

**Le problème que les modules résolvent** :

Sans modules, voici les problèmes rencontrés :

1. **Collisions de noms** : Deux fichiers qui déclarent une variable `config` ou une fonction `valider()` entrent en conflit. La deuxième déclaration écrase la première.
2. **Dépendances implicites** : On ne sait pas quels fichiers dépendent de quels autres fichiers. L'ordre de chargement est fragile.
3. **Tout est global** : Toutes les variables et fonctions sont accessibles partout, ce qui crée des effets de bord imprévisibles.

**Comment les modules résolvent ces problèmes** :

| Problème | Solution apportée par les modules |
| -------- | --------------------------------- |
| Collisions de noms | Chaque module a sa propre portée isolée |
| Dépendances implicites | `import` déclare explicitement les dépendances |
| Tout est global | Seuls les éléments exportés sont accessibles |

**Analogie concrète** : Un module est comme un appartement dans un immeuble. Chaque appartement a son propre espace (variables locales). Pour emprunter un outil à ton voisin, tu dois le lui demander explicitement (import). Le voisin choisit ce qu'il te prête (export). Tu ne peux pas accéder à ses affaires sans sa permission.

**Ce qu'un module n'est PAS** :

- Un module n'est pas un namespace. Les namespaces sont une ancienne fonctionnalité TypeScript pour organiser le code. Les modules ES sont le standard actuel.
- Un module n'est pas un package npm. Un package npm peut contenir plusieurs modules. Un module est un seul fichier.

---

### Que sont les fichiers de déclaration (.d.ts) ?

**Définition** : Un fichier de déclaration (extension `.d.ts`) contient uniquement des descriptions de types, sans code exécutable. Il décrit la forme (les types) d'un module JavaScript existant, pour que TypeScript puisse vérifier le code qui l'utilise.

**Le problème que les fichiers .d.ts résolvent** :

Sans fichiers de déclaration, voici les problèmes rencontrés :

1. **Bibliothèques JS non typées** : Les milliers de bibliothèques JavaScript existantes n'ont pas de types TypeScript. Sans fichier `.d.ts`, TypeScript ne peut pas vérifier leur utilisation.
2. **`any` partout** : Sans types, TypeScript traite toutes les importations de bibliothèques JavaScript comme `any`, ce qui annule les avantages du typage.

**Comment les fichiers .d.ts résolvent ces problèmes** :

| Problème | Solution apportée par les fichiers .d.ts |
| -------- | ---------------------------------------- |
| Bibliothèques JS non typées | Le fichier `.d.ts` décrit les types de la bibliothèque |
| `any` partout | TypeScript utilise les types du `.d.ts` pour la vérification |

**Analogie concrète** : Un fichier `.d.ts` est comme une notice d'utilisation. Le produit (la bibliothèque JavaScript) existe déjà et fonctionne. La notice (le fichier `.d.ts`) décrit comment l'utiliser correctement : quels boutons existent, quelles entrées il accepte, quelles sorties il produit.

**Ce qu'un fichier .d.ts n'est PAS** :

- Un fichier `.d.ts` n'est pas un fichier `.ts` normal. Un fichier `.ts` contient du code exécutable (fonctions, classes, logique) qui sera compilé en JavaScript. Un fichier `.d.ts` contient uniquement des descriptions de types (interfaces, signatures de fonctions avec `declare`), sans aucun code exécutable. Il ne produit pas de fichier JavaScript après compilation.
- Un fichier `.d.ts` n'est pas nécessaire pour du code TypeScript. Si ton code est écrit en TypeScript (`.ts`), les types sont déjà intégrés. Les fichiers `.d.ts` servent uniquement à ajouter des types à du code JavaScript existant.

---

### Que sont les packages @types ?

**Définition** : Les packages `@types` sont des packages npm qui contiennent des fichiers de déclaration `.d.ts` pour des bibliothèques JavaScript populaires. Ils sont maintenus par la communauté dans le dépôt DefinitelyTyped.

**Le problème que @types résout** :

Sans `@types`, voici le problème rencontré :

1. **Écrire ses propres types** : Pour chaque bibliothèque JavaScript utilisée, il faudrait écrire manuellement un fichier `.d.ts` complet. C'est un travail considérable et sujet aux erreurs.

**Comment @types résout ce problème** :

| Problème | Solution apportée par @types |
| -------- | ---------------------------- |
| Écrire ses propres types | La communauté maintient les types pour des milliers de bibliothèques |

**Analogie concrète** : Les packages `@types` sont comme des traducteurs professionnels. Tu achètes un appareil fabriqué à l'étranger (bibliothèque JavaScript) et le mode d'emploi est dans une langue que tu ne lis pas (pas de types). Au lieu de traduire toi-même chaque page, tu télécharges la traduction officielle faite par un traducteur professionnel (`@types/nom-du-package`). La traduction est maintenue à jour par une équipe de traducteurs bénévoles (la communauté DefinitelyTyped).

---

## Étapes Pratiques

### Étape 1 : Export et import nommés

Crée un dossier `src/modules/` avec plusieurs fichiers.

Crée `src/modules/math-utils.ts` :

```typescript
// src/modules/math-utils.ts
// Export nommé : chaque élément est exporté individuellement

// Export d'une constante
export const PI: number = 3.14159265;

// Export d'une fonction
export function additionner(a: number, b: number): number {
  return a + b;
}

export function multiplier(a: number, b: number): number {
  return a * b;
}

// Export d'une interface
export interface Point {
  x: number;
  y: number;
}

// Export d'un type
export type Operation = (a: number, b: number) => number;

// Cette fonction n'est PAS exportée : elle reste privée au module
function validerNombre(n: number): boolean {
  return !isNaN(n) && isFinite(n);
}

// Export d'une fonction qui utilise la fonction privée
export function diviser(a: number, b: number): number | null {
  if (!validerNombre(a) || !validerNombre(b) || b === 0) {
    return null;
  }
  return a / b;
}
```

Crée `src/modules/string-utils.ts` :

```typescript
// src/modules/string-utils.ts
// Autre module avec des utilitaires pour les chaînes

export function capitaliser(texte: string): string {
  if (texte.length === 0) return texte;
  return texte.charAt(0).toUpperCase() + texte.slice(1).toLowerCase();
}

export function inverser(texte: string): string {
  return texte.split("").reverse().join("");
}

export function compterMots(texte: string): number {
  if (texte.trim().length === 0) return 0;
  return texte.trim().split(/\s+/).length;
}

// Export d'un type
export type TransformationTexte = (texte: string) => string;
```

Crée `src/modules/demo-imports.ts` :

```typescript
// src/modules/demo-imports.ts
// Import nommé : on choisit exactement ce qu'on importe

// Import de plusieurs éléments nommés
import { additionner, multiplier, diviser, PI } from "./math-utils";
import type { Point, Operation } from "./math-utils";

// Import de tout un module avec un alias
import * as StringUtils from "./string-utils";

// Import avec renommage (alias)
import { capitaliser as majuscule } from "./string-utils";

// Utilisation des imports nommés
console.log("--- Math Utils ---");
console.log(`PI = ${PI}`);
console.log(`3 + 4 = ${additionner(3, 4)}`);
console.log(`3 * 4 = ${multiplier(3, 4)}`);
console.log(`10 / 3 = ${diviser(10, 3)}`);
console.log(`10 / 0 = ${diviser(10, 0)}`);

// Utilisation du type importé
const origine: Point = { x: 0, y: 0 };
const calculer: Operation = additionner;

console.log("Origine :", origine);
console.log("Calculer(5, 3) :", calculer(5, 3));

// Utilisation de l'import avec alias
console.log("\n--- String Utils ---");
console.log(`Capitaliser : ${StringUtils.capitaliser("bonjour MONDE")}`);
console.log(`Inverser : ${StringUtils.inverser("TypeScript")}`);
console.log(`Compter mots : ${StringUtils.compterMots("Bonjour le monde")}`);

// Utilisation de l'import renommé
console.log(`Majuscule : ${majuscule("typescript")}`);
```

Compile et exécute :

```bash
npx tsc && node dist/modules/demo-imports.js
```

**Résultat attendu** :

```text
--- Math Utils ---
PI = 3.14159265
3 + 4 = 7
3 * 4 = 12
10 / 3 = 3.3333333333333335
10 / 0 = null

Origine : { x: 0, y: 0 }
Calculer(5, 3) : 8

--- String Utils ---
Capitaliser : Bonjour monde
Inverser : tpircSepyT
Compter mots : 3
Majuscule : Typescript
```

---

### Étape 2 : Export par défaut

Crée `src/modules/logger.ts` :

```typescript
// src/modules/logger.ts
// Export par défaut : un seul élément principal par module

// Un module ne peut avoir qu'un seul export default
export default class Logger {
  private prefixe: string;

  constructor(prefixe: string) {
    this.prefixe = prefixe;
  }

  public info(message: string): void {
    console.log(`[${this.prefixe}] INFO: ${message}`);
  }

  public erreur(message: string): void {
    console.log(`[${this.prefixe}] ERREUR: ${message}`);
  }

  public debug(message: string): void {
    console.log(`[${this.prefixe}] DEBUG: ${message}`);
  }
}

// On peut aussi avoir des exports nommés en plus du default
export type NiveauLog = "info" | "erreur" | "debug";

export function creerLogger(prefixe: string): Logger {
  return new Logger(prefixe);
}
```

Crée `src/modules/demo-default.ts` :

```typescript
// src/modules/demo-default.ts
// Import par défaut : on choisit le nom qu'on veut

// L'import par défaut n'utilise pas d'accolades
// On peut donner n'importe quel nom à l'import
import MonLogger from "./logger";

// On peut combiner import par défaut et imports nommés
import Logger, { creerLogger, NiveauLog } from "./logger";

// Utilisation de l'import par défaut (avec le nom qu'on a choisi)
const log = new MonLogger("App");
log.info("Application démarrée");
log.debug("Mode debug activé");

// Utilisation de la fonction nommée
const logDB: Logger = creerLogger("Database");
logDB.info("Connexion établie");
logDB.erreur("Timeout de la requête");

// Utilisation du type nommé
const niveau: NiveauLog = "info";
console.log(`\nNiveau actuel : ${niveau}`);
```

Compile et exécute :

```bash
npx tsc && node dist/modules/demo-default.js
```

**Résultat attendu** :

```text
[App] INFO: Application démarrée
[App] DEBUG: Mode debug activé
[Database] INFO: Connexion établie
[Database] ERREUR: Timeout de la requête

Niveau actuel : info
```

---

### Étape 3 : Réexporter depuis un fichier index

Crée `src/modules/models/utilisateur.ts` :

```typescript
// src/modules/models/utilisateur.ts

export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
}

export function creerUtilisateur(nom: string, email: string): Utilisateur {
  return {
    id: Date.now(),
    nom: nom,
    email: email,
  };
}
```

Crée `src/modules/models/produit.ts` :

```typescript
// src/modules/models/produit.ts

export interface Produit {
  id: number;
  nom: string;
  prix: number;
}

export function creerProduit(nom: string, prix: number): Produit {
  return {
    id: Date.now(),
    nom: nom,
    prix: prix,
  };
}
```

Crée `src/modules/models/index.ts` (fichier barrel) :

```typescript
// src/modules/models/index.ts
// Fichier barrel : réexporte tout depuis un seul point d'entrée

// Réexporter tous les exports nommés de chaque module
export { Utilisateur, creerUtilisateur } from "./utilisateur";
export { Produit, creerProduit } from "./produit";

// On peut aussi réexporter avec un alias
// export { Utilisateur as User } from "./utilisateur";
```

Crée `src/modules/demo-barrel.ts` :

```typescript
// src/modules/demo-barrel.ts
// Import depuis le fichier barrel : un seul chemin pour tout

// Au lieu de :
// import { Utilisateur } from "./models/utilisateur";
// import { Produit } from "./models/produit";

// On importe tout depuis le fichier index (barrel)
import { Utilisateur, creerUtilisateur, Produit, creerProduit } from "./models";
// TypeScript trouve automatiquement le fichier index.ts dans le dossier

const alice: Utilisateur = creerUtilisateur("Alice", "alice@test.fr");
const clavier: Produit = creerProduit("Clavier", 49.99);

console.log("Utilisateur :", alice);
console.log("Produit :", clavier);
```

Compile et exécute :

```bash
npx tsc && node dist/modules/demo-barrel.js
```

**Résultat attendu** :

```text
Utilisateur : { id: 1742489600000, nom: 'Alice', email: 'alice@test.fr' }
Produit : { id: 1742489600001, nom: 'Clavier', prix: 49.99 }
```

Note : les `id` seront différents car ils sont basés sur `Date.now()`.

---

### Étape 4 : Fichiers de déclaration (.d.ts)

Crée `src/modules/config-externe.js` (un fichier JavaScript sans types) :

```javascript
// src/modules/config-externe.js
// Ce fichier est du JavaScript pur, sans types

function chargerConfig(chemin) {
  return {
    port: 3000,
    host: "localhost",
    debug: false,
    chemin: chemin,
  };
}

function validerConfig(config) {
  return config.port > 0 && config.host.length > 0;
}

module.exports = { chargerConfig, validerConfig };
```

Crée `src/modules/config-externe.d.ts` (le fichier de déclaration correspondant) :

```typescript
// src/modules/config-externe.d.ts
// Ce fichier décrit les types du module JavaScript config-externe.js
// Il ne contient PAS de code exécutable, uniquement des descriptions de types

// L'interface décrit la forme de l'objet retourné par chargerConfig
export interface AppConfig {
  port: number;
  host: string;
  debug: boolean;
  chemin: string;
}

// Les fonctions sont déclarées avec 'declare' (pas d'implémentation)
export declare function chargerConfig(chemin: string): AppConfig;
export declare function validerConfig(config: AppConfig): boolean;
```

Crée `src/modules/demo-declaration.ts` :

```typescript
// src/modules/demo-declaration.ts
// Utilisation d'un module JavaScript avec son fichier .d.ts

// TypeScript utilise le fichier .d.ts pour connaître les types
// mais exécute le fichier .js à l'exécution
import { chargerConfig, validerConfig, AppConfig } from "./config-externe";

const config: AppConfig = chargerConfig("/app/config.json");
console.log("Config chargée :", config);
console.log("Config valide :", validerConfig(config));

// TypeScript connaît les propriétés grâce au .d.ts
console.log("Port :", config.port);
console.log("Host :", config.host);
console.log("Debug :", config.debug);

// config.portInexistant; // Erreur : Property 'portInexistant' does not exist
```

---

### Étape 5 : Packages @types

L'installation de packages `@types` se fait avec npm. Voici comment utiliser les types pour Node.js.

Commande d'installation (les packages sont déjà présents si tu as suivi la fiche 02) :

```bash
npm install --save-dev @types/node
```

Crée `src/modules/demo-types.ts` :

```typescript
// src/modules/demo-types.ts
// Utilisation des types Node.js fournis par @types/node

// Les types de Node.js sont automatiquement disponibles après
// l'installation de @types/node

// path : module Node.js pour manipuler les chemins de fichiers
import * as path from "path";

// Les types de path sont connus grâce à @types/node
const cheminComplet: string = path.join("/Users", "alice", "documents", "fichier.txt");
const extension: string = path.extname("image.png");
const dossier: string = path.dirname("/Users/alice/documents/fichier.txt");
const nomFichier: string = path.basename("/Users/alice/documents/fichier.txt");

console.log("Chemin complet :", cheminComplet);
console.log("Extension :", extension);
console.log("Dossier :", dossier);
console.log("Nom du fichier :", nomFichier);

// process : objet global Node.js, typé par @types/node
console.log("\n--- Process ---");
console.log("Version Node :", process.version);
console.log("Plateforme :", process.platform);
console.log("Dossier courant :", process.cwd());

// Les types empêchent les erreurs
// process.versionInexistante; // Erreur détectée par TypeScript
```

Compile et exécute :

```bash
npx tsc && node dist/modules/demo-types.js
```

**Résultat attendu** :

```text
Chemin complet : /Users/alice/documents/fichier.txt
Extension : .png
Dossier : /Users/alice/documents
Nom du fichier : fichier.txt

--- Process ---
Version Node : v22.x.x
Plateforme : darwin
Dossier courant : /chemin/vers/ton/projet
```

Note : les valeurs de `process` varient selon ton environnement.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npx tsc && node dist/fichier.js` | Compile puis exécute |
| `npm install --save-dev @types/nom` | Installe les types pour une bibliothèque |
| `npx tsc --noEmit` | Vérifie les types sans compiler |

---

## Pièges Fréquents

### Piège 1 : Oublier d'exporter un type

⚠️ **Problème** : Déclarer un type ou une interface dans un module sans l'exporter.

```typescript
// math.ts
interface Resultat {
  valeur: number;
}

export function calculer(): Resultat {
  return { valeur: 42 };
}
```

```typescript
// main.ts
import { calculer } from "./math";
const r = calculer(); // Le type Resultat n'est pas importable directement
// import { Resultat } from "./math"; // Erreur : Resultat n'est pas exporté
```

✅ **Solution** : Exporte toujours les types et interfaces utilisés dans les signatures publiques.

```typescript
// math.ts
export interface Resultat {
  valeur: number;
}
```

---

### Piège 2 : Confondre export par défaut et export nommé à l'import

⚠️ **Problème** : Utiliser des accolades pour un import par défaut, ou oublier les accolades pour un import nommé.

```typescript
// Erreur : Logger est un export par défaut, pas besoin d'accolades
// import { Logger } from "./logger"; // Ceci importe un export NOMMÉ Logger

// Correct : import par défaut (sans accolades)
import Logger from "./logger";
```

✅ **Solution** : Retiens la règle : accolades = export nommé, pas d'accolades = export par défaut.

---

### Piège 3 : Les namespaces sont déconseillés

⚠️ **Problème** : Utiliser `namespace` pour organiser le code, alors que les modules ES sont le standard.

```typescript
// Déconseillé : namespace
namespace MathUtils {
  export function additionner(a: number, b: number): number {
    return a + b;
  }
}
```

✅ **Solution** : Utilise des modules ES (fichiers avec import/export). Les namespaces n'ont plus de raison d'être dans un projet moderne avec des modules.

```typescript
// Recommandé : module ES
// math-utils.ts
export function additionner(a: number, b: number): number {
  return a + b;
}
```

---

## Checklist de Validation

- [ ] Je sais utiliser les exports nommés (`export function`, `export interface`)
- [ ] Je sais utiliser les imports nommés avec accolades
- [ ] Je sais utiliser l'export par défaut (`export default`)
- [ ] Je sais importer tout un module avec `import * as`
- [ ] Je sais renommer un import avec `as`
- [ ] Je sais créer un fichier barrel (index.ts) pour réexporter
- [ ] Je comprends le rôle des fichiers `.d.ts`
- [ ] Je sais installer et utiliser des packages `@types`

---

## Exercice Pratique

**Énoncé** : Crée un mini-projet organisé en modules :

1. Module `src/modules/exercice/types.ts` : exporte les interfaces `Tache` (id, titre, terminee, priorité) et `Filtre` (statut: "toutes" | "actives" | "terminees", prioriteMin: number)
2. Module `src/modules/exercice/tache-service.ts` : exporte les fonctions `creerTache(titre, priorite)`, `terminerTache(tache)` et `filtrerTaches(taches, filtre)`
3. Module `src/modules/exercice/affichage.ts` : exporte une fonction `afficherTaches(taches)` qui affiche les taches formatées
4. Fichier barrel `src/modules/exercice/index.ts` : réexporte tout
5. Module principal `src/modules/exercice-main.ts` : crée 4 taches, en termine 2, filtre et affiche

**Indications** :

- Utilise des imports depuis le fichier barrel (index.ts)
- La fonction `creerTache` génère un `id` automatique (compteur)
- La fonction `filtrerTaches` filtre selon le statut et la priorité minimum

**Résultat attendu** :

```text
Toutes les tâches :
  [ ] #1 Installer TypeScript (priorité: 3)
  [x] #2 Configurer tsconfig (priorité: 2)
  [x] #3 Écrire des types (priorité: 1)
  [ ] #4 Créer des modules (priorité: 3)

Tâches actives (priorité >= 2) :
  [ ] #1 Installer TypeScript (priorité: 3)
  [ ] #4 Créer des modules (priorité: 3)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

`src/modules/exercice/types.ts` :

```typescript
// src/modules/exercice/types.ts

export interface Tache {
  id: number;
  titre: string;
  terminee: boolean;
  priorite: number;
}

export interface Filtre {
  statut: "toutes" | "actives" | "terminees";
  prioriteMin: number;
}
```

`src/modules/exercice/tache-service.ts` :

```typescript
// src/modules/exercice/tache-service.ts
import type { Tache, Filtre } from "./types";

let compteurId: number = 0;

export function creerTache(titre: string, priorite: number): Tache {
  compteurId++;
  return {
    id: compteurId,
    titre: titre,
    terminee: false,
    priorite: priorite,
  };
}

export function terminerTache(tache: Tache): Tache {
  return {
    ...tache,
    terminee: true,
  };
}

export function filtrerTaches(taches: Tache[], filtre: Filtre): Tache[] {
  return taches.filter((tache: Tache): boolean => {
    // Filtre par statut
    if (filtre.statut === "actives" && tache.terminee) return false;
    if (filtre.statut === "terminees" && !tache.terminee) return false;

    // Filtre par priorité minimum
    if (tache.priorite < filtre.prioriteMin) return false;

    return true;
  });
}
```

`src/modules/exercice/affichage.ts` :

```typescript
// src/modules/exercice/affichage.ts
import type { Tache } from "./types";

export function afficherTaches(taches: Tache[]): void {
  taches.forEach((tache: Tache): void => {
    const icone: string = tache.terminee ? "[x]" : "[ ]";
    console.log(`  ${icone} #${tache.id} ${tache.titre} (priorité: ${tache.priorite})`);
  });
}
```

`src/modules/exercice/index.ts` :

```typescript
// src/modules/exercice/index.ts
export type { Tache, Filtre } from "./types";
export { creerTache, terminerTache, filtrerTaches } from "./tache-service";
export { afficherTaches } from "./affichage";
```

`src/modules/exercice-main.ts` :

```typescript
// src/modules/exercice-main.ts
import {
  creerTache,
  terminerTache,
  filtrerTaches,
  afficherTaches,
  Tache,
  Filtre,
} from "./exercice";

// Créer 4 tâches
let taches: Tache[] = [
  creerTache("Installer TypeScript", 3),
  creerTache("Configurer tsconfig", 2),
  creerTache("Écrire des types", 1),
  creerTache("Créer des modules", 3),
];

// Terminer les tâches 2 et 3
taches[1] = terminerTache(taches[1]);
taches[2] = terminerTache(taches[2]);

// Afficher toutes les tâches
console.log("Toutes les tâches :");
afficherTaches(taches);

// Filtrer : tâches actives avec priorité >= 2
const filtre: Filtre = {
  statut: "actives",
  prioriteMin: 2,
};

const tachesFiltrees: Tache[] = filtrerTaches(taches, filtre);
console.log("\nTâches actives (priorité >= 2) :");
afficherTaches(tachesFiltrees);
```

Compile et exécute :

```bash
npx tsc && node dist/modules/exercice-main.js
```

**Résultat attendu** :

```text
Toutes les tâches :
  [ ] #1 Installer TypeScript (priorité: 3)
  [x] #2 Configurer tsconfig (priorité: 2)
  [x] #3 Écrire des types (priorité: 1)
  [ ] #4 Créer des modules (priorité: 3)

Tâches actives (priorité >= 2) :
  [ ] #1 Installer TypeScript (priorité: 3)
  [ ] #4 Créer des modules (priorité: 3)
```

---

## Navigation

← Fiche précédente : **[10 - Generics](10-generics.md)**

→ Fiche suivante : **[12 - TypeScript avec Node.js](12-typescript-nodejs.md)**
