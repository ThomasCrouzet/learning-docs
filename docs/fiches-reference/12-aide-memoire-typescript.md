---
tags:
  - Référence
  - TypeScript
description: "Aide-mémoire TypeScript : types, interfaces, generics et configuration"
estimated_time: "20 min"
fiche_number: 12
total_fiches: 18
cursus: "Fiches de référence"
---

# Aide-mémoire TypeScript

> **En bref** : Aide-mémoire TypeScript. Lecture estimée : 20 min.

Fiche de référence rapide pour TypeScript : types, interfaces, generics, utility types et configuration.

**Version** : TypeScript 6.x / 7.x / Node.js 22 LTS

---

## Commandes essentielles

| Commande | Action |
| -------- | ------ |
| `npx tsc` | Compiler le projet (selon `tsconfig.json`) |
| `npx tsc --watch` | Recompiler automatiquement à chaque modification |
| `npx tsc --noEmit` | Vérifier les types sans générer de fichiers |
| `npx tsc --init` | Créer un `tsconfig.json` par défaut |
| `npx ts-node fichier.ts` | Exécuter un fichier TypeScript directement |
| `npx tsc fichier.ts` | Compiler un seul fichier (ignore `tsconfig.json`) |

---

## Types primitifs

| Type | Exemple |
| ---- | ------- |
| `string` | `const nom: string = "Alice";` |
| `number` | `const age: number = 25;` |
| `boolean` | `const actif: boolean = true;` |
| `null` | `const vide: null = null;` |
| `undefined` | `const absent: undefined = undefined;` |
| `void` | `function log(): void { ... }` |
| `never` | `function erreur(): never { throw ... }` |
| `any` | Désactive le typage (à éviter) |
| `unknown` | Comme `any` mais force une vérification |

---

## Tableaux et tuples

```typescript
// Tableaux
const nombres: number[] = [1, 2, 3];
const noms: Array<string> = ["Alice", "Bob"];
const lecture: readonly string[] = ["a", "b"];

// Tuples - taille et types fixes
const coord: [number, number] = [48.85, 2.35];
const personne: [string, number] = ["Alice", 25];
const opt: [string, number?] = ["Alice"];
```

---

## Interfaces et types

```typescript
// Interface
interface Utilisateur {
  readonly id: number;
  nom: string;
  email: string;
  bio?: string; // optionnel
}

// Extension
interface Admin extends Utilisateur {
  role: string;
}

// Type alias
type Point = { x: number; y: number };
type ID = string | number;

// Index signature
interface Dictionnaire {
  [cle: string]: string;
}
```

| Interface | Type alias |
| --------- | ---------- |
| `extends` pour hériter | `&` pour combiner |
| Peut être ré-ouverte (déclaration merging) | Figé après déclaration |
| Préféré pour les objets | Préféré pour les unions/intersections |

---

## Union et intersection

```typescript
// Union - OU
type Resultat = string | number;
type Direction = "nord" | "sud" | "est" | "ouest";

// Intersection - ET
type PersonneEmploye = Personne & Employe;

// Discriminated union
interface Cercle { type: "cercle"; rayon: number }
interface Rectangle { type: "rectangle"; largeur: number; hauteur: number }
type Forme = Cercle | Rectangle;
```

### Type guards

```typescript
// typeof
if (typeof valeur === "string") { ... }

// in
if ("rayon" in forme) { /* Cercle */ }

// instanceof
if (erreur instanceof ErreurValidation) { ... }

// Prédicat personnalisé
function estPoisson(a: Animal): a is Poisson {
  return "nager" in a;
}
```

---

## Fonctions

```typescript
// Paramètres typés
function add(a: number, b: number): number { return a + b; }

// Arrow function
const mult: (a: number, b: number) => number = (a, b) => a * b;

// Type de fonction
type Operation = (a: number, b: number) => number;

// Paramètre optionnel et valeur par défaut
function paginer(items: string[], page: number = 1, limite?: number): string[] { ... }

// Rest parameters
function somme(...n: number[]): number { ... }

// Surcharge
function convertir(v: string): string;
function convertir(v: number): number;
function convertir(v: string | number): string | number { ... }
```

---

## Classes

```typescript
class Produit {
  // Raccourci : déclaration dans le constructeur
  constructor(
    public nom: string,
    private prix: number,
    public readonly id: number
  ) {}
}

// Héritage
class Voiture extends Vehicule {
  constructor(marque: string, public portes: number) {
    super(marque);
  }
}

// Classe abstraite
abstract class Forme {
  abstract aire(): number;
}

// Implémentation d'interface
class Chat implements Animal, Serialisable { ... }
```

| Modificateur | Classe | Enfant | Extérieur |
| ------------ | ------ | ------ | --------- |
| `public` | Oui | Oui | Oui |
| `protected` | Oui | Oui | Non |
| `private` | Oui | Non | Non |
| `readonly` | Lecture seule après initialisation | | |

---

## Enums et littéraux

```typescript
// String enum (recommandé)
enum Statut {
  AFaire = "a_faire",
  EnCours = "en_cours",
  Termine = "termine",
}

// Const enum (inliné à la compilation)
const enum Role {
  Admin = "ADMIN",
  Lecteur = "LECTEUR",
}

// Alternative sans enum : as const
const THEMES = { clair: "clair", sombre: "sombre" } as const;
type Theme = (typeof THEMES)[keyof typeof THEMES];
```

---

## Generics

```typescript
// Fonction générique
function premier<T>(tableau: T[]): T | undefined {
  return tableau[0];
}

// Avec contrainte
function longueur<T extends { length: number }>(item: T): number {
  return item.length;
}

// Interface générique
interface Reponse<T> {
  donnees: T;
  succes: boolean;
}

// Type générique
type Result<T, E = string> =
  | { succes: true; donnees: T }
  | { succes: false; erreur: E };
```

---

## Utility types

| Type | Description | Exemple |
| ---- | ----------- | ------- |
| `Partial<T>` | Toutes les propriétés optionnelles | `Partial<User>` |
| `Required<T>` | Toutes les propriétés obligatoires | `Required<Config>` |
| `Readonly<T>` | Toutes les propriétés en lecture seule | `Readonly<User>` |
| `Pick<T, K>` | Sélectionne certaines propriétés | `Pick<User, "nom" \| "email">` |
| `Omit<T, K>` | Exclut certaines propriétés | `Omit<User, "motDePasse">` |
| `Record<K, V>` | Objet avec clés K et valeurs V | `Record<string, number>` |
| `ReturnType<F>` | Type de retour d'une fonction | `ReturnType<typeof fn>` |
| `Parameters<F>` | Types des paramètres d'une fonction | `Parameters<typeof fn>` |
| `NonNullable<T>` | Exclut `null` et `undefined` | `NonNullable<string \| null>` |
| `Awaited<T>` | Type résolu d'une Promise | `Awaited<Promise<User>>` |
| `Extract<T, U>` | Types de T assignables à U | `Extract<A \| B, A>` |
| `Exclude<T, U>` | Types de T non assignables à U | `Exclude<A \| B, A>` |

---

## Configuration tsconfig.json

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
    "resolveJsonModule": true,
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

| Option | Rôle |
| ------ | ---- |
| `strict: true` | Active toutes les vérifications strictes |
| `target` | Version JavaScript en sortie |
| `outDir` | Dossier de sortie de la compilation |
| `rootDir` | Dossier racine des sources |
| `declaration` | Génère les fichiers `.d.ts` |
| `sourceMap` | Génère les fichiers `.js.map` |
| `esModuleInterop` | Compatibilité import ES modules |

---

## Pièges courants

| Piège | Solution |
| ----- | -------- |
| Exécuter `.ts` avec `node` | Compiler d'abord (`tsc`) ou utiliser `ts-node` |
| `tsc fichier.ts` ignore `tsconfig.json` | Utiliser `tsc` sans argument |
| Utiliser `any` par facilité | Utiliser `unknown` avec vérification de type |
| `catch` reçoit `unknown`, pas `Error` | Vérifier avec `instanceof Error` |
| `private` n'existe qu'à la compilation | Utiliser `#champ` pour une vraie confidentialité |
| Tableau vide sans annotation = `any[]` | Toujours annoter : `const t: string[] = []` |
| `instanceof` ne fonctionne pas avec les interfaces | Utiliser un type guard personnalisé |
| `ts-node` en production | Toujours compiler puis exécuter avec `node` |

---

## Liens utiles

- [01 - Introduction TypeScript](../07-typescript/01-introduction-typescript.md)
- [03 - Types primitifs](../07-typescript/03-types-primitifs-annotations.md)
- [05 - Interfaces](../07-typescript/05-objets-interfaces.md)
- [06 - Union et intersection](../07-typescript/06-types-union-intersection.md)
- [10 - Generics](../07-typescript/10-generics.md)
- [12 - TypeScript et Node.js](../07-typescript/12-typescript-nodejs.md)

---

## Navigation

← Fiche précédente : **[Aide-mémoire Ansible](11-aide-memoire-ansible.md)**

→ Fiche suivante : **[Aide-mémoire CI/CD](13-aide-memoire-cicd.md)**
