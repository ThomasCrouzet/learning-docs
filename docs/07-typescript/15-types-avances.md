---
tags:
  - TypeScript
  - Avancé
  - Concept
description: "Types avancés de TypeScript : mapped types, conditional types, infer et template literal types."
estimated_time: "90 min"
fiche_number: 15
total_fiches: 15
cursus: "TypeScript"
id: "web.typescript.types-avances"
course_id: "web.typescript"
content_type: "lesson"
order: 15
---

# 15 - Types avancés (mapped, conditional, template literal)

> **En bref** : À la fin de cette fiche, tu sauras transformer des types avec les mapped types, choisir un type selon une condition avec les conditional types, extraire un type avec `infer`, et composer des chaînes typées avec les template literal types. Lecture estimée : 90 min.

## Prérequis

- [10 - Generics](10-generics.md)
- [05 - Objets et interfaces](05-objets-interfaces.md)
- [06 - Types union et intersection](06-types-union-intersection.md)
- [09 - Enums et littéraux](09-enums-litteraux.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des mapped types pour transformer un type existant, écrire des conditional types qui choisissent un type selon une condition, utiliser `infer` pour extraire un type, et composer des template literal types. Tu comprendras comment les utility types intégrés (`Partial`, `Pick`, `ReturnType`) sont construits à partir de ces mécanismes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un mapped type ?

**Définition** : Un mapped type est un type qui crée un nouveau type en parcourant les clés d'un type existant. La syntaxe `{ [K in keyof T]: ... }` signifie "pour chaque clé `K` du type `T`, génère une propriété". C'est le mécanisme qui permet de transformer toutes les propriétés d'un type d'un seul coup.

**Le problème que les mapped types résolvent** :

Sans mapped types, voici les problèmes rencontrés :

1. **Transformation propriété par propriété** : Pour rendre toutes les propriétés d'une interface en lecture seule, on doit réécrire chaque propriété manuellement avec `readonly`.
2. **Pas de réutilisation** : Une transformation écrite pour une interface ne s'applique pas automatiquement à une autre.
3. **Désynchronisation** : Quand l'interface d'origine gagne une propriété, la version transformée écrite à la main l'ignore.

**Comment les mapped types résolvent ces problèmes** :

| Problème | Solution apportée par les mapped types |
| -------- | -------------------------------------- |
| Transformation manuelle | Une seule règle s'applique à toutes les clés |
| Pas de réutilisation | Le mapped type fonctionne avec n'importe quel type `T` |
| Désynchronisation | La transformation suit automatiquement le type d'origine |

**Analogie concrète** : Un mapped type est comme une chaîne de production dans une usine. Tu poses une consigne unique ("emballer chaque produit qui passe sur le tapis"), et la machine l'applique à tous les produits, quels qu'ils soient. Tu n'emballes pas chaque produit à la main : tu définis la règle une fois, et elle s'applique à tout ce qui passe.

**Ce qu'un mapped type n'est PAS** :

- Un mapped type n'est pas une boucle exécutée à l'exécution. C'est une transformation appliquée à la compilation, par le compilateur TypeScript. Le code JavaScript produit ne contient aucune trace du mapped type.
- Un mapped type n'est pas un generic ordinaire. Un generic remplace `T` par un type concret. Un mapped type, lui, parcourt les clés de `T` pour construire un type entièrement nouveau.

---

### Qu'est-ce qu'un conditional type ?

**Définition** : Un conditional type choisit un type parmi deux selon une condition. La syntaxe `T extends U ? X : Y` se lit "si `T` est assignable à `U`, alors le type est `X`, sinon le type est `Y`". C'est l'équivalent d'un `if/else`, mais au niveau des types.

**Le problème que les conditional types résolvent** :

Sans conditional types, voici les problèmes rencontrés :

1. **Type de retour figé** : Une fonction générique ne peut pas retourner un type différent selon le type reçu en entrée.
2. **Surcharges multiples** : Pour adapter le type de retour, on doit écrire plusieurs signatures de fonction (surcharges), ce qui devient vite illisible.

**Comment les conditional types résolvent ces problèmes** :

| Problème | Solution apportée par les conditional types |
| -------- | ------------------------------------------- |
| Type de retour figé | Le type de retour s'adapte au type d'entrée |
| Surcharges multiples | Une seule définition couvre tous les cas |

**Analogie concrète** : Un conditional type est comme un aiguillage de chemin de fer. Le train (le type) arrive, et selon une condition (la couleur du train, par exemple), l'aiguillage l'envoie sur la voie A ou la voie B. La condition `T extends U` est l'aiguillage : selon que `T` correspond ou non à `U`, le type final emprunte une branche ou l'autre.

**Comparaison conditional type vs union** :

| Conditional type (`T extends U ? X : Y`) | Type union (`X \| Y`) |
| ---------------------------------------- | --------------------- |
| Choisit un seul type selon une condition | Accepte plusieurs types en même temps |
| Le résultat dépend de `T` | Le résultat est toujours `X` ou `Y` |
| Évalué à la compilation | Aucune évaluation, juste une combinaison |

---

### Qu'est-ce que `infer` ?

**Définition** : Le mot-clé `infer` s'utilise dans un conditional type pour capturer (extraire) un type à l'intérieur d'un autre type. On déclare une variable de type avec `infer R`, et TypeScript en déduit la valeur. Par exemple, `T extends Array<infer R> ? R : never` extrait le type des éléments d'un tableau.

**Le problème qu'`infer` résout** :

Sans `infer`, voici les problèmes rencontrés :

1. **Type interne inaccessible** : On sait qu'un type est un `Array<string>` ou une `Promise<number>`, mais on ne peut pas récupérer le type interne (`string`, `number`) de façon générique.
2. **Duplication des types** : On doit déclarer manuellement le type interne à chaque utilisation, au lieu de le laisser TypeScript le déduire.

**Comment `infer` résout ces problèmes** :

| Problème | Solution apportée par `infer` |
| -------- | ----------------------------- |
| Type interne inaccessible | `infer R` capture le type interne automatiquement |
| Duplication des types | Le type interne est déduit, pas réécrit |

**Analogie concrète** : `infer` est comme déballer un colis pour identifier ce qu'il contient. Tu reçois une boîte étiquetée "tableau de pommes". Avec `infer`, tu ouvres la boîte et tu déclares "le contenu est une pomme". Tu n'as pas eu besoin de savoir à l'avance que c'était une pomme : tu l'as déduit en regardant à l'intérieur du colis.

---

### Que sont les template literal types ?

**Définition** : Un template literal type construit un type chaîne de caractères à partir d'autres types, avec la même syntaxe que les littéraux de gabarit JavaScript (les backticks). Par exemple, `` `bonjour-${string}` `` est un type qui accepte toute chaîne commençant par `bonjour-`. On peut aussi combiner des types union pour générer toutes les combinaisons possibles.

**Le problème que les template literal types résolvent** :

Sans template literal types, voici les problèmes rencontrés :

1. **Chaînes non vérifiées** : Un nom d'événement comme `"onClick"` ou un identifiant comme `"user-123"` est un simple `string`. Une faute de frappe n'est pas détectée.
2. **Énumération manuelle fastidieuse** : Pour typer toutes les classes CSS d'une palette (`"text-rouge"`, `"text-bleu"`, `"bg-rouge"`...), on doit lister chaque combinaison à la main.

**Comment les template literal types résolvent ces problèmes** :

| Problème | Solution apportée par les template literal types |
| -------- | ------------------------------------------------ |
| Chaînes non vérifiées | Le compilateur valide le format de la chaîne |
| Énumération manuelle | Les combinaisons sont générées automatiquement |

**Analogie concrète** : Un template literal type est comme un tampon encreur à champs variables. Le tampon a une partie fixe ("FACTURE N° ___") et un champ à remplir. Chaque document tamponné suit le même modèle, avec une partie imposée et une partie libre. Le template literal type impose la partie fixe (`bonjour-`) et autorise une partie variable (`${string}`).

**Les utilitaires de transformation de chaînes** :

TypeScript fournit quatre utility types intégrés qui transforment la casse des template literal types :

| Utility type | Effet | Exemple |
| ------------ | ----- | ------- |
| `Uppercase<S>` | Met tout en majuscules | `Uppercase<"abc">` donne `"ABC"` |
| `Lowercase<S>` | Met tout en minuscules | `Lowercase<"ABC">` donne `"abc"` |
| `Capitalize<S>` | Met la première lettre en majuscule | `Capitalize<"abc">` donne `"Abc"` |
| `Uncapitalize<S>` | Met la première lettre en minuscule | `Uncapitalize<"Abc">` donne `"abc"` |

Le schéma suivant illustre comment ces quatre mécanismes se combinent pour construire les utility types intégrés de TypeScript :

<div class="diagram-design">
<p><a href="../../diagrams/07-typescript-15-types-avances-1.html">Que sont les template literal types ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/07-typescript-15-types-avances-1.html" title="Que sont les template literal types ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

## Étapes Pratiques

### Étape 1 : Mapped types de base

Crée un fichier `src/mapped-types.ts` :

```typescript
// src/mapped-types.ts
// Mapped types : transformer toutes les propriétés d'un type

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
}

// Mapped type qui rend toutes les propriétés en lecture seule
// [K in keyof T] parcourt chaque clé K de T
// T[K] est le type de la propriété à cette clé
type EnLectureSeule<T> = {
  readonly [K in keyof T]: T[K];
};

type UtilisateurFige = EnLectureSeule<Utilisateur>;
// Équivaut à :
// { readonly id: number; readonly nom: string; readonly email: string }

const user: UtilisateurFige = { id: 1, nom: "Alice", email: "alice@test.fr" };
// user.nom = "Bob"; // Erreur : Cannot assign to 'nom' (readonly)
console.log("Utilisateur figé :", user);

// Mapped type qui rend toutes les propriétés optionnelles
// Le point d'interrogation ? rend chaque propriété facultative
type Optionnel<T> = {
  [K in keyof T]?: T[K];
};

type UtilisateurPartiel = Optionnel<Utilisateur>;
// Équivaut à :
// { id?: number; nom?: string; email?: string }

const partiel: UtilisateurPartiel = { nom: "Charlie" };
console.log("Utilisateur partiel :", partiel);

// Mapped type qui transforme chaque propriété en chaîne
// Peu importe le type d'origine, tout devient string
type ToutEnChaine<T> = {
  [K in keyof T]: string;
};

type UtilisateurChaines = ToutEnChaine<Utilisateur>;
// Équivaut à :
// { id: string; nom: string; email: string }

const chaines: UtilisateurChaines = {
  id: "1",
  nom: "Alice",
  email: "alice@test.fr",
};
console.log("Utilisateur en chaînes :", chaines);
```

Compile et exécute :

```bash
npx tsc && node dist/mapped-types.js
```

**Résultat attendu** :

```text
Utilisateur figé : { id: 1, nom: 'Alice', email: 'alice@test.fr' }
Utilisateur partiel : { nom: 'Charlie' }
Utilisateur en chaînes : { id: '1', nom: 'Alice', email: 'alice@test.fr' }
```

---

### Étape 2 : Modificateurs et remappage de clés

Crée un fichier `src/mapped-avance.ts` :

```typescript
// src/mapped-avance.ts
// Mapped types avancés : retirer des modificateurs et renommer des clés

interface Config {
  readonly host?: string;
  readonly port?: number;
  readonly debug?: boolean;
}

// Le préfixe -readonly retire le modificateur readonly
// Le préfixe -? retire le modificateur optionnel
// Résultat : toutes les propriétés deviennent modifiables et obligatoires
type Concret<T> = {
  -readonly [K in keyof T]-?: T[K];
};

type ConfigConcrete = Concret<Config>;
// Équivaut à :
// { host: string; port: number; debug: boolean }

const config: ConfigConcrete = {
  host: "localhost",
  port: 8080,
  debug: true,
};
config.port = 9090; // OK : plus readonly
console.log("Config concrète :", config);

// Remappage de clés avec la clause "as"
// On génère un nom de getter pour chaque propriété
// Capitalize met la première lettre de la clé en majuscule
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Personne {
  nom: string;
  age: number;
}

type PersonneGetters = Getters<Personne>;
// Équivaut à :
// { getNom: () => string; getAge: () => number }

// Implémentation concrète des getters générés
const personne: PersonneGetters = {
  getNom: () => "Alice",
  getAge: () => 30,
};

console.log("\n--- Getters générés ---");
console.log("getNom() :", personne.getNom());
console.log("getAge() :", personne.getAge());
```

Compile et exécute :

```bash
npx tsc && node dist/mapped-avance.js
```

**Résultat attendu** :

```text
Config concrète : { host: 'localhost', port: 9090, debug: true }

--- Getters générés ---
getNom() : Alice
getAge() : 30
```

---

### Étape 3 : Conditional types de base

Crée un fichier `src/conditional-types.ts` :

```typescript
// src/conditional-types.ts
// Conditional types : choisir un type selon une condition

// T extends U ? X : Y se lit comme un if/else au niveau des types
// Si T est assignable à string, le résultat est "texte", sinon "autre"
type EstChaine<T> = T extends string ? "texte" : "autre";

type Test1 = EstChaine<string>; // "texte"
type Test2 = EstChaine<number>; // "autre"
type Test3 = EstChaine<"bonjour">; // "texte" (littéral assignable à string)

// On vérifie les types avec des valeurs concrètes
const t1: Test1 = "texte";
const t2: Test2 = "autre";
const t3: Test3 = "texte";

console.log("EstChaine<string> :", t1);
console.log("EstChaine<number> :", t2);
console.log('EstChaine<"bonjour"> :', t3);

// Conditional type qui retire null et undefined d'un type
// (c'est ainsi qu'est construit le utility type NonNullable)
type SansNull<T> = T extends null | undefined ? never : T;

type Test4 = SansNull<string | null>; // string
type Test5 = SansNull<number | undefined>; // number

const t4: Test4 = "valeur";
const t5: Test5 = 42;

console.log("\nSansNull<string | null> :", t4);
console.log("SansNull<number | undefined> :", t5);

// Conditional type distributif sur une union
// Quand T est une union, la condition s'applique à chaque membre séparément
type EnTableau<T> = T extends unknown ? T[] : never;

type Test6 = EnTableau<string | number>; // string[] | number[]

const t6a: Test6 = ["a", "b"]; // string[] est valide
const t6b: Test6 = [1, 2, 3]; // number[] est valide

console.log("\nEnTableau (chaînes) :", t6a);
console.log("EnTableau (nombres) :", t6b);
```

Compile et exécute :

```bash
npx tsc && node dist/conditional-types.js
```

**Résultat attendu** :

```text
EstChaine<string> : texte
EstChaine<number> : autre
EstChaine<"bonjour"> : texte

SansNull<string | null> : valeur
SansNull<number | undefined> : 42

EnTableau (chaînes) : [ 'a', 'b' ]
EnTableau (nombres) : [ 1, 2, 3 ]
```

---

### Étape 4 : Extraire un type avec `infer`

Crée un fichier `src/infer-types.ts` :

```typescript
// src/infer-types.ts
// infer : extraire un type interne dans un conditional type

// Extraire le type des éléments d'un tableau
// Si T est un tableau, infer R capture le type des éléments
type ElementDeTableau<T> = T extends Array<infer R> ? R : never;

type Test1 = ElementDeTableau<string[]>; // string
type Test2 = ElementDeTableau<number[]>; // number
type Test3 = ElementDeTableau<boolean[]>; // boolean

const t1: Test1 = "texte";
const t2: Test2 = 42;
const t3: Test3 = true;

console.log("Élément de string[] :", t1);
console.log("Élément de number[] :", t2);
console.log("Élément de boolean[] :", t3);

// Extraire le type résolu d'une Promise
// infer R capture le type contenu dans la Promise
type ResultatPromise<T> = T extends Promise<infer R> ? R : never;

type Test4 = ResultatPromise<Promise<string>>; // string
type Test5 = ResultatPromise<Promise<{ id: number }>>; // { id: number }

const t4: Test4 = "donnée résolue";
const t5: Test5 = { id: 1 };

console.log("\nRésultat de Promise<string> :", t4);
console.log("Résultat de Promise<objet> :", t5);

// Extraire le type de retour d'une fonction
// (c'est ainsi qu'est construit le utility type ReturnType)
type TypeRetour<T> = T extends (...args: never[]) => infer R ? R : never;

function creerUtilisateur() {
  return { id: 1, nom: "Alice", actif: true };
}

type Utilisateur = TypeRetour<typeof creerUtilisateur>;
// Équivaut à : { id: number; nom: string; actif: boolean }

const user: Utilisateur = { id: 1, nom: "Alice", actif: true };
console.log("\nType de retour extrait :", user);

// Extraire le type du premier paramètre d'une fonction
type PremierParametre<T> = T extends (premier: infer P, ...reste: never[]) => unknown
  ? P
  : never;

function saluer(nom: string, formel: boolean): string {
  return formel ? `Bonjour ${nom}` : `Salut ${nom}`;
}

type TypeNom = PremierParametre<typeof saluer>; // string

const nom: TypeNom = "Bob";
console.log("Premier paramètre extrait :", nom);
```

Compile et exécute :

```bash
npx tsc && node dist/infer-types.js
```

**Résultat attendu** :

```text
Élément de string[] : texte
Élément de number[] : 42
Élément de boolean[] : true

Résultat de Promise<string> : donnée résolue
Résultat de Promise<objet> : { id: 1 }

Type de retour extrait : { id: 1, nom: 'Alice', actif: true }
Premier paramètre extrait : Bob
```

---

### Étape 5 : Template literal types

Crée un fichier `src/template-literal-types.ts` :

```typescript
// src/template-literal-types.ts
// Template literal types : construire des types chaîne

// Type chaîne avec une partie fixe et une partie variable
// Accepte toute chaîne commençant par "user-"
type IdentifiantUtilisateur = `user-${number}`;

const id1: IdentifiantUtilisateur = "user-1"; // OK
const id2: IdentifiantUtilisateur = "user-42"; // OK
// const id3: IdentifiantUtilisateur = "admin-1"; // Erreur : ne commence pas par "user-"

console.log("Identifiant 1 :", id1);
console.log("Identifiant 2 :", id2);

// Combinaison de types union : toutes les combinaisons sont générées
type Couleur = "rouge" | "bleu" | "vert";
type Prefixe = "text" | "bg";

// ClasseCss génère les 6 combinaisons possibles
type ClasseCss = `${Prefixe}-${Couleur}`;
// "text-rouge" | "text-bleu" | "text-vert" | "bg-rouge" | "bg-bleu" | "bg-vert"

const classe1: ClasseCss = "text-rouge"; // OK
const classe2: ClasseCss = "bg-vert"; // OK
// const classe3: ClasseCss = "border-rouge"; // Erreur : combinaison invalide

console.log("\nClasse CSS 1 :", classe1);
console.log("Classe CSS 2 :", classe2);

// Génération de noms d'événements à partir de propriétés
type Evenements = "click" | "hover" | "focus";

// Chaque événement devient un nom de gestionnaire "onXxx"
type Gestionnaires = `on${Capitalize<Evenements>}`;
// "onClick" | "onHover" | "onFocus"

const gestionnaire: Gestionnaires = "onClick";
console.log("\nNom de gestionnaire :", gestionnaire);

// Utilisation des transformations de casse
type EnMajuscules = Uppercase<"bonjour">; // "BONJOUR"
type EnMinuscules = Lowercase<"BONJOUR">; // "bonjour"

const maj: EnMajuscules = "BONJOUR";
const min: EnMinuscules = "bonjour";

console.log("\nMajuscules :", maj);
console.log("Minuscules :", min);

// Mapped type combiné avec template literal pour typer un objet d'écouteurs
type EcouteursEvenements = {
  [K in Evenements as `on${Capitalize<K>}`]: () => void;
};
// Équivaut à :
// { onClick: () => void; onHover: () => void; onFocus: () => void }

const ecouteurs: EcouteursEvenements = {
  onClick: () => console.log("  Clic détecté"),
  onHover: () => console.log("  Survol détecté"),
  onFocus: () => console.log("  Focus détecté"),
};

console.log("\n--- Écouteurs typés ---");
ecouteurs.onClick();
ecouteurs.onHover();
```

Compile et exécute :

```bash
npx tsc && node dist/template-literal-types.js
```

**Résultat attendu** :

```text
Identifiant 1 : user-1
Identifiant 2 : user-42

Classe CSS 1 : text-rouge
Classe CSS 2 : bg-vert

Nom de gestionnaire : onClick

Majuscules : BONJOUR
Minuscules : bonjour

--- Écouteurs typés ---
  Clic détecté
  Survol détecté
```

---

### Étape 6 : Combiner les mécanismes

Crée un fichier `src/types-combines.ts` :

```typescript
// src/types-combines.ts
// Combiner mapped, conditional, infer et template literal

interface ReponseApi {
  utilisateur: { id: number; nom: string };
  produits: { id: number; prix: number }[];
  total: number;
  enStock: boolean;
}

// Mapped + conditional : rendre optionnelles seulement les propriétés tableau
// Pour chaque clé, on teste si la propriété est un tableau
type TableauxOptionnels<T> = {
  [K in keyof T]: T[K] extends unknown[] ? T[K] | undefined : T[K];
};

type ReponsePartielle = TableauxOptionnels<ReponseApi>;
// produits devient "tableau | undefined", les autres restent inchangés

const reponse: ReponsePartielle = {
  utilisateur: { id: 1, nom: "Alice" },
  produits: undefined, // OK : produits est optionnel
  total: 0,
  enStock: false,
};

console.log("Réponse partielle :", reponse);

// Mapped + infer : extraire le type des éléments de chaque propriété tableau
// Si la propriété est un tableau, on extrait son type d'élément avec infer
type TypesElements<T> = {
  [K in keyof T]: T[K] extends Array<infer R> ? R : T[K];
};

type ElementsReponse = TypesElements<ReponseApi>;
// produits devient { id: number; prix: number } au lieu d'un tableau

const elements: ElementsReponse = {
  utilisateur: { id: 1, nom: "Alice" },
  produits: { id: 10, prix: 49.99 }, // Un seul produit, pas un tableau
  total: 100,
  enStock: true,
};

console.log("\nÉléments de réponse :", elements);

// Conditional + infer : déballer un type imbriqué (tableau ou Promise)
type Deballer<T> = T extends Promise<infer R>
  ? R
  : T extends Array<infer R>
    ? R
    : T;

type Test1 = Deballer<Promise<string>>; // string
type Test2 = Deballer<number[]>; // number
type Test3 = Deballer<boolean>; // boolean (ni Promise ni tableau)

const v1: Test1 = "texte";
const v2: Test2 = 42;
const v3: Test3 = true;

console.log("\n--- Déballage ---");
console.log("Deballer<Promise<string>> :", v1);
console.log("Deballer<number[]> :", v2);
console.log("Deballer<boolean> :", v3);
```

Compile et exécute :

```bash
npx tsc && node dist/types-combines.js
```

**Résultat attendu** :

```text
Réponse partielle : {
  utilisateur: { id: 1, nom: 'Alice' },
  produits: undefined,
  total: 0,
  enStock: false
}

Éléments de réponse : {
  utilisateur: { id: 1, nom: 'Alice' },
  produits: { id: 10, prix: 49.99 },
  total: 100,
  enStock: true
}

--- Déballage ---
Deballer<Promise<string>> : texte
Deballer<number[]> : 42
Deballer<boolean> : true
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npx tsc && node dist/fichier.js` | Compile puis exécute |
| `npx tsc --noEmit` | Vérifie les types sans compiler |
| `node src/fichier.ts` ou `npx tsx src/fichier.ts` | Node 22.18+ : TS effaçable ; tsx pour enums/namespaces |

---

## Pièges Fréquents

### Piège 1 : Oublier `keyof` dans un mapped type

⚠️ **Problème** : Un mapped type sans `keyof` ne parcourt pas les clés du type et provoque une erreur de compilation.

```typescript
interface Utilisateur {
  id: number;
  nom: string;
}

// Erreur : K n'est pas lié aux clés de T
// type Mauvais<T> = { [K in T]: T[K] };
```

✅ **Solution** : Utilise `keyof T` pour parcourir les clés du type.

```typescript
// Correct : K parcourt les clés de T
type Bon<T> = { [K in keyof T]: T[K] };
```

---

### Piège 2 : Confondre `extends` de contrainte et `extends` de condition

⚠️ **Problème** : Le mot-clé `extends` a deux usages distincts. Confondre les deux mène à des types incorrects.

```typescript
// extends comme CONTRAINTE : limite les types acceptés par le generic
function premier<T extends unknown[]>(tableau: T): T[number] {
  return tableau[0];
}

// extends comme CONDITION : choisit un type selon un test
type EstTableau<T> = T extends unknown[] ? true : false;
```

✅ **Solution** : Retiens la position du `extends`.

- Dans `<T extends U>` (entre chevrons) : c'est une **contrainte**.
- Dans `T extends U ? X : Y` (suivi de `?`) : c'est une **condition**.

---

### Piège 3 : Utiliser `infer` en dehors d'un conditional type

⚠️ **Problème** : `infer` ne peut s'utiliser que dans la partie `extends` d'un conditional type. Ailleurs, il provoque une erreur.

```typescript
// Erreur : infer hors d'un conditional type
// type Mauvais<T> = Array<infer R>;
```

✅ **Solution** : Place toujours `infer` dans la clause `extends` d'un conditional type.

```typescript
// Correct : infer dans un conditional type
type Element<T> = T extends Array<infer R> ? R : never;
```

---

### Piège 4 : Template literal avec un type trop large

⚠️ **Problème** : Combiner un template literal avec des unions trop grandes génère un nombre énorme de combinaisons, ce qui ralentit le compilateur ou provoque une erreur.

```typescript
// Risqué : string génère un nombre infini de possibilités combinées
type Trop = `${string}-${string}-${string}`;
```

✅ **Solution** : Limite les parties variables à des unions de littéraux quand tu veux énumérer des combinaisons précises.

```typescript
type Couleur = "rouge" | "bleu";
type Taille = "s" | "m" | "l";

// Génère 6 combinaisons précises : "rouge-s", "rouge-m", ...
type Variante = `${Couleur}-${Taille}`;
```

---

## Checklist de Validation

- [ ] Je sais écrire un mapped type avec `{ [K in keyof T]: ... }`
- [ ] Je sais ajouter ou retirer les modificateurs `readonly` et `?`
- [ ] Je sais renommer des clés avec la clause `as` dans un mapped type
- [ ] Je sais écrire un conditional type `T extends U ? X : Y`
- [ ] Je comprends la distribution d'un conditional type sur une union
- [ ] Je sais extraire un type avec `infer`
- [ ] Je sais écrire un template literal type avec une partie fixe et variable
- [ ] Je sais combiner mapped, conditional, infer et template literal
- [ ] Je comprends comment `Partial`, `ReturnType` et `NonNullable` sont construits

---

## Exercice Pratique

**Énoncé** : Crée un ensemble de types avancés pour un système de formulaire :

1. Une interface `Formulaire` avec : `nom: string`, `email: string`, `age: number`, `actif: boolean`
2. Un mapped type `ChampsValidation<T>` qui, pour chaque propriété, génère une propriété de validation de type `(valeur: T[K]) => boolean`
3. Un mapped type `NomsErreurs<T>` qui, pour chaque clé, génère un nom d'erreur `` `erreur${Capitalize<K>}` `` de type `string`
4. Un conditional type `TypeChamp<T>` qui retourne `"texte"` si `T` est `string`, `"nombre"` si `T` est `number`, `"booleen"` si `T` est `boolean`, sinon `"inconnu"`
5. Implémente un objet `validateurs` du type `ChampsValidation<Formulaire>` avec des règles simples

**Indications** :

- Pour `ChampsValidation`, la valeur de chaque clé est une fonction `(valeur: T[K]) => boolean`
- Pour `NomsErreurs`, utilise la clause `as` avec un template literal et `Capitalize<string & K>`
- Pour `TypeChamp`, enchaîne plusieurs conditional types
- Une validation simple : le nom n'est pas vide, l'email contient `@`, l'âge est positif

**Résultat attendu** :

```text
Validation nom 'Alice' : true
Validation email 'alice@test.fr' : true
Validation age 25 : true
Validation age -5 : false
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```typescript
// src/formulaire-types.ts

// Interface de base du formulaire
interface Formulaire {
  nom: string;
  email: string;
  age: number;
  actif: boolean;
}

// Mapped type : pour chaque champ, une fonction de validation
// La fonction reçoit la valeur typée de la propriété et retourne un booléen
type ChampsValidation<T> = {
  [K in keyof T]: (valeur: T[K]) => boolean;
};

// Mapped type : pour chaque clé, un nom d'erreur "erreurXxx" de type string
// La clause "as" renomme la clé avec un template literal
type NomsErreurs<T> = {
  [K in keyof T as `erreur${Capitalize<string & K>}`]: string;
};

// Conditional type enchaîné : déterminer le type d'un champ
type TypeChamp<T> = T extends string
  ? "texte"
  : T extends number
    ? "nombre"
    : T extends boolean
      ? "booleen"
      : "inconnu";

// Vérification des types de champ avec des valeurs concrètes
const typeNom: TypeChamp<string> = "texte";
const typeAge: TypeChamp<number> = "nombre";
const typeActif: TypeChamp<boolean> = "booleen";

console.log("Type du champ nom :", typeNom);
console.log("Type du champ age :", typeAge);
console.log("Type du champ actif :", typeActif);

// Implémentation des validateurs (type ChampsValidation<Formulaire>)
const validateurs: ChampsValidation<Formulaire> = {
  // Le nom ne doit pas être vide
  nom: (valeur: string): boolean => valeur.trim().length > 0,
  // L'email doit contenir un arobase
  email: (valeur: string): boolean => valeur.includes("@"),
  // L'âge doit être positif
  age: (valeur: number): boolean => valeur > 0,
  // Le champ actif est toujours valide (booléen)
  actif: (valeur: boolean): boolean => typeof valeur === "boolean",
};

// Exemple d'objet d'erreurs (type NomsErreurs<Formulaire>)
const messagesErreurs: NomsErreurs<Formulaire> = {
  erreurNom: "Le nom est obligatoire",
  erreurEmail: "L'email est invalide",
  erreurAge: "L'âge doit être positif",
  erreurActif: "Le statut est invalide",
};

console.log("\n--- Validations ---");
console.log("Validation nom 'Alice' :", validateurs.nom("Alice"));
console.log("Validation email 'alice@test.fr' :", validateurs.email("alice@test.fr"));
console.log("Validation age 25 :", validateurs.age(25));
console.log("Validation age -5 :", validateurs.age(-5));

console.log("\n--- Messages d'erreur disponibles ---");
console.log("Erreur nom :", messagesErreurs.erreurNom);
console.log("Erreur email :", messagesErreurs.erreurEmail);
```

Compile et exécute :

```bash
npx tsc && node dist/formulaire-types.js
```

**Résultat attendu** :

```text
Type du champ nom : texte
Type du champ age : nombre
Type du champ actif : booleen

--- Validations ---
Validation nom 'Alice' : true
Validation email 'alice@test.fr' : true
Validation age 25 : true
Validation age -5 : false

--- Messages d'erreur disponibles ---
Erreur nom : Le nom est obligatoire
Erreur email : L'email est invalide
```

---

## Navigation

← Fiche précédente : **[14 - Projet intégrateur](14-projet-integrateur.md)**

→ Cursus suivant : **[React](../08-react/index.md)**
