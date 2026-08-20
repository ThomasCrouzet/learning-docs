---
tags:
  - TypeScript
  - Intermédiaire
  - Concept
description: "Maîtriser les types génériques, les contraintes, et les utility types (Partial, Required, Pick, Omit, Record)."
estimated_time: "90 min"
fiche_number: 10
total_fiches: 15
cursus: "TypeScript"
---

# 10 - Generics

> **En bref** : Apprendre à créer des types génériques réutilisables, à poser des contraintes sur les paramètres de type, et à utiliser les utility types intégrés de TypeScript. Lecture estimée : 90 min.

## Prérequis

- [09 - Enums et littéraux](09-enums-litteraux.md)
- [05 - Objets et interfaces](05-objets-interfaces.md)
- [07 - Fonctions typées](07-fonctions-typees.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des fonctions et des types génériques, poser des contraintes sur les paramètres de type, et utiliser les utility types `Partial`, `Required`, `Pick`, `Omit` et `Record`.

---

## Concepts

### Qu'est-ce qu'un type générique ?

**Définition** : Un type générique est un type paramétré. Au lieu de fixer un type concret (comme `string` ou `number`), on utilise un **paramètre de type** (souvent nommé `T`) qui sera remplacé par un type concret au moment de l'utilisation. Les generics permettent d'écrire du code qui fonctionne avec n'importe quel type tout en conservant la vérification de type.

**Le problème que les generics résolvent** :

Sans generics, voici les problèmes rencontrés :

1. **Code dupliqué** : On écrit la même fonction plusieurs fois pour différents types. Une fonction `premierElement` pour un tableau de `string`, une autre pour un tableau de `number`, une autre pour `boolean`, etc.
2. **Perte de typage avec `any`** : Pour éviter la duplication, on utilise `any`, mais on perd toute vérification de type. TypeScript ne peut plus détecter les erreurs.
3. **Pas de relation entre entrée et sortie** : Avec `any`, TypeScript ne sait pas que si l'entrée est un `string[]`, la sortie devrait être un `string`.

**Comment les generics résolvent ces problèmes** :

| Problème | Solution apportée par les generics |
| -------- | ---------------------------------- |
| Code dupliqué | Une seule définition fonctionne pour tous les types |
| Perte de typage avec `any` | Le type est préservé et vérifié à chaque utilisation |
| Pas de relation entrée/sortie | Le paramètre de type `T` lie l'entrée à la sortie |

**Analogie concrète** : Un generic est comme un moule à gâteau ajustable. Le moule a toujours la même forme (la logique du code), mais tu choisis la taille (le type) au moment de l'utiliser. Un même moule peut produire un petit gâteau (type `string`) ou un grand gâteau (type `Utilisateur`), avec la garantie que la forme est toujours correcte.

**Ce qu'un generic n'est PAS** :

- Un generic n'est pas `any`. Avec `any`, TypeScript abandonne la vérification de type. Avec un generic, TypeScript vérifie le type à chaque utilisation.
- Un generic n'est pas un type union. Un type union accepte plusieurs types en même temps (`string | number`). Un generic est remplacé par un seul type concret à chaque utilisation.

**Comparaison generic vs any** :

| Generic (`T`) | `any` |
| ------------- | ----- |
| Type vérifié à chaque utilisation | Aucune vérification |
| Autocomplétion précise | Pas d'autocomplétion |
| Relation entrée/sortie préservée | Aucune relation |
| Erreurs détectées à la compilation | Erreurs à l'exécution |

Le schéma suivant illustre comment un generic est remplacé par un type concret à chaque utilisation :

<div class="diagram-design">
<p><a href="../../diagrams/07-typescript-10-generics-1.html">Qu&#x27;est-ce qu&#x27;un type générique ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/07-typescript-10-generics-1.html" title="Qu&#x27;est-ce qu&#x27;un type générique ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce qu'une contrainte de type ?

**Définition** : Une contrainte de type (keyword `extends`) limite les types qu'un paramètre générique peut accepter. Au lieu d'accepter n'importe quel type, on exige que le type possède certaines propriétés ou étende un certain type.

**Le problème que les contraintes résolvent** :

Sans contraintes, voici les problèmes rencontrés :

1. **Accès impossible aux propriétés** : Dans une fonction générique `T`, on ne peut accéder à aucune propriété de `T` car TypeScript ne sait pas ce que `T` contient.
2. **Types invalides acceptés** : Un generic sans contrainte accepte `number`, `string`, `boolean`, etc., même quand la logique requiert un objet avec des propriétés spécifiques.

**Comment les contraintes résolvent ces problèmes** :

| Problème | Solution apportée par les contraintes |
| -------- | ------------------------------------- |
| Accès impossible aux propriétés | `extends { nom: string }` garantit que `T` a une propriété `nom` |
| Types invalides acceptés | TypeScript refuse les types qui ne satisfont pas la contrainte |

**Analogie concrète** : Une contrainte de type est comme un filtre à l'entrée d'un parking souterrain. Le parking accepte tous les véhicules (generic), mais la barre de hauteur (contrainte) refuse les camions trop hauts. Tu peux garer une voiture, un SUV ou une moto (ils passent sous la barre), mais pas un camion. La contrainte `extends { nom: string }` est la barre de hauteur : seuls les types qui ont une propriété `nom` de type `string` sont acceptés.

---

### Que sont les utility types ?

**Définition** : Les utility types sont des types génériques intégrés à TypeScript. Ils transforment un type existant pour créer un nouveau type. Les plus utilisés sont `Partial`, `Required`, `Pick`, `Omit` et `Record`.

**Le problème que les utility types résolvent** :

Sans utility types, voici les problèmes rencontrés :

1. **Interfaces dupliquées** : Pour un formulaire de mise à jour, on doit créer une nouvelle interface avec toutes les propriétés optionnelles, en recopiant l'interface d'origine.
2. **Synchronisation manuelle** : Quand l'interface d'origine change, il faut penser à mettre à jour toutes les interfaces dérivées.

**Comment les utility types résolvent ces problèmes** :

| Problème | Solution apportée par les utility types |
| -------- | --------------------------------------- |
| Interfaces dupliquées | `Partial<Utilisateur>` crée automatiquement une version avec toutes les propriétés optionnelles |
| Synchronisation manuelle | La version dérivée est toujours synchronisée avec l'original |

**Analogie concrète** : Les utility types sont comme des filtres photo sur un appareil. Tu as une photo originale (le type de base). Au lieu de retoucher la photo manuellement à chaque fois, tu appliques un filtre prédéfini : "noir et blanc" (`Readonly`, tout en lecture seule), "recadrage" (`Pick`, sélectionner certaines zones), "flou sur une zone" (`Omit`, masquer certaines parties). La photo originale n'est pas modifiée, et le filtre crée une nouvelle version automatiquement.

**Les principaux utility types** :

| Utility type | Description | Exemple |
| ------------ | ----------- | ------- |
| `Partial<T>` | Rend toutes les propriétés optionnelles | `Partial<Utilisateur>` : `{ nom?: string; age?: number }` |
| `Required<T>` | Rend toutes les propriétés obligatoires | `Required<Config>` : aucune propriété optionnelle |
| `Pick<T, K>` | Sélectionne certaines propriétés | `Pick<Utilisateur, "nom" \| "email">` |
| `Omit<T, K>` | Exclut certaines propriétés | `Omit<Utilisateur, "motDePasse">` |
| `Record<K, V>` | Crée un objet avec des clés de type `K` et des valeurs de type `V` | `Record<string, number>` |
| `Readonly<T>` | Rend toutes les propriétés en lecture seule | `Readonly<Config>` |

---

## Étapes Pratiques

### Étape 1 : Fonctions génériques de base

Crée un fichier `src/generics-base.ts` :

```typescript
// src/generics-base.ts
// Fonctions génériques : un seul code pour plusieurs types

// Sans generic : on doit écrire une fonction par type
function premierString(tableau: string[]): string | undefined {
  return tableau[0];
}

function premierNumber(tableau: number[]): number | undefined {
  return tableau[0];
}

// Avec generic : une seule fonction pour tous les types
// <T> déclare un paramètre de type nommé T
// T est remplacé par le type réel à l'utilisation
function premier<T>(tableau: T[]): T | undefined {
  return tableau[0];
}

// TypeScript infère le type T automatiquement
const mot: string | undefined = premier(["bonjour", "monde"]);
const nombre: number | undefined = premier([42, 100, 7]);
const bool: boolean | undefined = premier([true, false]);

console.log("Premier mot :", mot);
console.log("Premier nombre :", nombre);
console.log("Premier bool :", bool);

// On peut aussi spécifier le type explicitement
const explicite: string | undefined = premier<string>(["a", "b", "c"]);
console.log("Explicite :", explicite);

// Fonction générique avec deux paramètres de type
function creerPaire<A, B>(premier: A, second: B): [A, B] {
  return [premier, second];
}

const paire1: [string, number] = creerPaire("age", 25);
const paire2: [number, boolean] = creerPaire(42, true);

console.log("\nPaire 1 :", paire1);
console.log("Paire 2 :", paire2);

// Fonction générique qui transforme un tableau
function transformer<T, U>(tableau: T[], fn: (element: T) => U): U[] {
  return tableau.map(fn);
}

const nombres: number[] = [1, 2, 3, 4, 5];
const chaines: string[] = transformer(nombres, (n: number): string => `#${n}`);
const doubles: number[] = transformer(nombres, (n: number): number => n * 2);

console.log("\nTransformé en chaînes :", chaines);
console.log("Transformé en doubles :", doubles);
```

Compile et exécute :

```bash
npx tsc && node dist/generics-base.js
```

**Résultat attendu** :

```text
Premier mot : bonjour
Premier nombre : 42
Premier bool : true
Explicite : a

Paire 1 : [ 'age', 25 ]
Paire 2 : [ 42, true ]

Transformé en chaînes : [ '#1', '#2', '#3', '#4', '#5' ]
Transformé en doubles : [ 2, 4, 6, 8, 10 ]
```

---

### Étape 2 : Interfaces et types génériques

Crée un fichier `src/generics-interfaces.ts` :

```typescript
// src/generics-interfaces.ts
// Interfaces et types génériques

// Interface générique pour un résultat d'opération
interface Resultat<T> {
  succes: boolean;
  donnees: T | null;
  message: string;
}

// Utilisation avec différents types
function rechercherUtilisateur(id: number): Resultat<{ nom: string; email: string }> {
  if (id === 1) {
    return {
      succes: true,
      donnees: { nom: "Alice", email: "alice@test.fr" },
      message: "Utilisateur trouvé",
    };
  }
  return {
    succes: false,
    donnees: null,
    message: "Utilisateur non trouvé",
  };
}

function rechercherProduit(code: string): Resultat<{ nom: string; prix: number }> {
  if (code === "CLV-01") {
    return {
      succes: true,
      donnees: { nom: "Clavier", prix: 49.99 },
      message: "Produit trouvé",
    };
  }
  return {
    succes: false,
    donnees: null,
    message: "Produit non trouvé",
  };
}

const user: Resultat<{ nom: string; email: string }> = rechercherUtilisateur(1);
const produit: Resultat<{ nom: string; prix: number }> = rechercherProduit("CLV-01");
const inconnu: Resultat<{ nom: string; email: string }> = rechercherUtilisateur(99);

console.log("Utilisateur :", user);
console.log("Produit :", produit);
console.log("Inconnu :", inconnu);

// Interface générique pour une collection paginée
interface PageResultat<T> {
  elements: T[];
  page: number;
  totalPages: number;
  totalElements: number;
}

function paginer<T>(elements: T[], page: number, parPage: number): PageResultat<T> {
  const debut: number = (page - 1) * parPage;
  const fin: number = debut + parPage;
  const elementsPage: T[] = elements.slice(debut, fin);
  const totalPages: number = Math.ceil(elements.length / parPage);

  return {
    elements: elementsPage,
    page: page,
    totalPages: totalPages,
    totalElements: elements.length,
  };
}

const noms: string[] = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"];
const page1: PageResultat<string> = paginer(noms, 1, 2);
const page2: PageResultat<string> = paginer(noms, 2, 2);

console.log("\n--- Pagination ---");
console.log(`Page ${page1.page}/${page1.totalPages} :`, page1.elements);
console.log(`Page ${page2.page}/${page2.totalPages} :`, page2.elements);

// Type générique (type alias)
type Paire<A, B> = {
  gauche: A;
  droite: B;
};

const coordonnees: Paire<number, number> = { gauche: 48.8566, droite: 2.3522 };
const etiquette: Paire<string, number> = { gauche: "score", droite: 95 };

console.log("\nCoordonnées :", coordonnees);
console.log("Étiquette :", etiquette);
```

Compile et exécute :

```bash
npx tsc && node dist/generics-interfaces.js
```

**Résultat attendu** :

```text
Utilisateur : { succes: true, donnees: { nom: 'Alice', email: 'alice@test.fr' }, message: 'Utilisateur trouvé' }
Produit : { succes: true, donnees: { nom: 'Clavier', prix: 49.99 }, message: 'Produit trouvé' }
Inconnu : { succes: false, donnees: null, message: 'Utilisateur non trouvé' }

--- Pagination ---
Page 1/3 : [ 'Alice', 'Bob' ]
Page 2/3 : [ 'Charlie', 'Diana' ]

Coordonnées : { gauche: 48.8566, droite: 2.3522 }
Étiquette : { gauche: 'score', droite: 95 }
```

---

### Étape 3 : Contraintes avec `extends`

Crée un fichier `src/generics-contraintes.ts` :

```typescript
// src/generics-contraintes.ts
// Contraintes de type : limiter les types acceptés par un generic

// Sans contrainte : on ne peut pas accéder aux propriétés
// function afficherNom<T>(objet: T): void {
//   console.log(objet.nom); // Erreur : Property 'nom' does not exist on type 'T'
// }

// Avec contrainte : T doit avoir une propriété 'nom' de type string
function afficherNom<T extends { nom: string }>(objet: T): void {
  console.log(`Nom : ${objet.nom}`);
}

afficherNom({ nom: "Alice", age: 25 }); // OK : a une propriété 'nom'
afficherNom({ nom: "Clavier", prix: 49.99 }); // OK : a une propriété 'nom'
// afficherNom({ age: 25 }); // Erreur : Property 'nom' is missing
// afficherNom("texte"); // Erreur : string n'a pas de propriété 'nom'

// Contrainte avec une interface
interface Identifiable {
  id: number;
}

function trouverParId<T extends Identifiable>(elements: T[], id: number): T | undefined {
  return elements.find((element: T): boolean => element.id === id);
}

interface Utilisateur extends Identifiable {
  nom: string;
  email: string;
}

interface Produit extends Identifiable {
  nom: string;
  prix: number;
}

const utilisateurs: Utilisateur[] = [
  { id: 1, nom: "Alice", email: "alice@test.fr" },
  { id: 2, nom: "Bob", email: "bob@test.fr" },
];

const produits: Produit[] = [
  { id: 10, nom: "Clavier", prix: 49.99 },
  { id: 11, nom: "Souris", prix: 29.99 },
];

// La fonction fonctionne avec tout type qui a un 'id'
const alice: Utilisateur | undefined = trouverParId(utilisateurs, 1);
const clavier: Produit | undefined = trouverParId(produits, 10);

console.log("\n--- Recherche ---");
console.log("Alice :", alice);
console.log("Clavier :", clavier);

// Contrainte keyof : T est une clé de l'objet
function obtenirPropriete<T, K extends keyof T>(objet: T, cle: K): T[K] {
  return objet[cle];
}

const user: Utilisateur = { id: 1, nom: "Alice", email: "alice@test.fr" };

const nom: string = obtenirPropriete(user, "nom"); // Retourne string
const id: number = obtenirPropriete(user, "id"); // Retourne number
// obtenirPropriete(user, "age"); // Erreur : "age" n'est pas une clé de Utilisateur

console.log("\n--- keyof ---");
console.log("Nom :", nom);
console.log("ID :", id);

// Contrainte multiple
function fusionner<T extends object, U extends object>(objet1: T, objet2: U): T & U {
  return { ...objet1, ...objet2 };
}

const resultat = fusionner(
  { nom: "Alice", age: 25 },
  { email: "alice@test.fr", actif: true }
);

console.log("\n--- Fusion ---");
console.log("Résultat :", resultat);
// TypeScript connaît toutes les propriétés : nom, age, email, actif
console.log("Nom :", resultat.nom);
console.log("Email :", resultat.email);
```

Compile et exécute :

```bash
npx tsc && node dist/generics-contraintes.js
```

**Résultat attendu** :

```text
Nom : Alice
Nom : Clavier

--- Recherche ---
Alice : { id: 1, nom: 'Alice', email: 'alice@test.fr' }
Clavier : { id: 10, nom: 'Clavier', prix: 49.99 }

--- keyof ---
Nom : Alice
ID : 1

--- Fusion ---
Résultat : { nom: 'Alice', age: 25, email: 'alice@test.fr', actif: true }
Nom : Alice
Email : alice@test.fr
```

---

### Étape 4 : Classes génériques

Crée un fichier `src/generics-classes.ts` :

```typescript
// src/generics-classes.ts
// Classes génériques : des classes réutilisables avec n'importe quel type

// Pile (stack) générique
class Pile<T> {
  private elements: T[] = [];

  public empiler(element: T): void {
    this.elements.push(element);
  }

  public depiler(): T | undefined {
    return this.elements.pop();
  }

  public sommet(): T | undefined {
    return this.elements[this.elements.length - 1];
  }

  public estVide(): boolean {
    return this.elements.length === 0;
  }

  public taille(): number {
    return this.elements.length;
  }

  public afficher(): void {
    console.log(`  Pile (${this.taille()}) :`, [...this.elements].reverse());
  }
}

// Pile de nombres
const pileNombres = new Pile<number>();
pileNombres.empiler(10);
pileNombres.empiler(20);
pileNombres.empiler(30);

console.log("Pile de nombres :");
pileNombres.afficher();
console.log("  Sommet :", pileNombres.sommet());
console.log("  Dépilé :", pileNombres.depiler());
pileNombres.afficher();

// Pile de chaînes
const pileChaines = new Pile<string>();
pileChaines.empiler("premier");
pileChaines.empiler("deuxième");

console.log("\nPile de chaînes :");
pileChaines.afficher();

// Stockage clé-valeur générique
class Stockage<K, V> {
  private donnees: Map<K, V> = new Map();

  public definir(cle: K, valeur: V): void {
    this.donnees.set(cle, valeur);
  }

  public obtenir(cle: K): V | undefined {
    return this.donnees.get(cle);
  }

  public supprimer(cle: K): boolean {
    return this.donnees.delete(cle);
  }

  public taille(): number {
    return this.donnees.size;
  }

  public toutesLesCles(): K[] {
    return Array.from(this.donnees.keys());
  }
}

const scores = new Stockage<string, number>();
scores.definir("Alice", 95);
scores.definir("Bob", 82);
scores.definir("Charlie", 91);

console.log("\n--- Stockage ---");
console.log("Score Alice :", scores.obtenir("Alice"));
console.log("Score Bob :", scores.obtenir("Bob"));
console.log("Toutes les clés :", scores.toutesLesCles());
console.log("Taille :", scores.taille());
```

Compile et exécute :

```bash
npx tsc && node dist/generics-classes.js
```

**Résultat attendu** :

```text
Pile de nombres :
  Pile (3) : [ 30, 20, 10 ]
  Sommet : 30
  Dépilé : 30
  Pile (2) : [ 20, 10 ]

Pile de chaînes :
  Pile (2) : [ 'deuxième', 'premier' ]

--- Stockage ---
Score Alice : 95
Score Bob : 82
Toutes les clés : [ 'Alice', 'Bob', 'Charlie' ]
Taille : 3
```

---

### Étape 5 : Utility types

Crée un fichier `src/utility-types.ts` :

```typescript
// src/utility-types.ts
// Utility types : types intégrés à TypeScript pour transformer des types

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  age: number;
  motDePasse: string;
}

// --- Partial<T> : toutes les propriétés deviennent optionnelles ---
// Utile pour les mises à jour partielles
type MiseAJourUtilisateur = Partial<Utilisateur>;
// Équivaut à :
// { id?: number; nom?: string; email?: string; age?: number; motDePasse?: string }

function mettreAJour(id: number, modifications: Partial<Utilisateur>): void {
  console.log(`  Mise à jour utilisateur #${id} :`, modifications);
}

mettreAJour(1, { nom: "Alice Dupont" }); // Seul le nom change
mettreAJour(1, { email: "nouveau@test.fr", age: 26 }); // Email et age changent

// --- Required<T> : toutes les propriétés deviennent obligatoires ---
interface Config {
  theme?: string;
  langue?: string;
  notifications?: boolean;
}

type ConfigComplete = Required<Config>;
// Équivaut à :
// { theme: string; langue: string; notifications: boolean }

const configDefaut: ConfigComplete = {
  theme: "clair",
  langue: "fr",
  notifications: true,
};

console.log("\nConfig par défaut :", configDefaut);

// --- Pick<T, K> : sélectionne certaines propriétés ---
type ProfilPublic = Pick<Utilisateur, "id" | "nom">;
// Équivaut à :
// { id: number; nom: string }

const profil: ProfilPublic = {
  id: 1,
  nom: "Alice",
};

console.log("\nProfil public :", profil);

// --- Omit<T, K> : exclut certaines propriétés ---
type UtilisateurSansMotDePasse = Omit<Utilisateur, "motDePasse">;
// Équivaut à :
// { id: number; nom: string; email: string; age: number }

const utilisateurSecurise: UtilisateurSansMotDePasse = {
  id: 1,
  nom: "Alice",
  email: "alice@test.fr",
  age: 25,
};

console.log("Sans mot de passe :", utilisateurSecurise);

// --- Record<K, V> : crée un objet typé avec des clés et valeurs ---
type StatutCommande = "en_attente" | "expediee" | "livree" | "annulee";

const descriptions: Record<StatutCommande, string> = {
  en_attente: "La commande est en attente de traitement",
  expediee: "La commande a été expédiée",
  livree: "La commande a été livrée",
  annulee: "La commande a été annulée",
};

console.log("\n--- Record ---");
console.log("En attente :", descriptions.en_attente);
console.log("Livrée :", descriptions.livree);

// Record avec des objets comme valeurs
interface InfoProduit {
  nom: string;
  prix: number;
  stock: number;
}

const catalogue: Record<string, InfoProduit> = {
  "CLV-01": { nom: "Clavier", prix: 49.99, stock: 15 },
  "SRS-01": { nom: "Souris", prix: 29.99, stock: 42 },
  "ECR-01": { nom: "Écran", prix: 299.99, stock: 7 },
};

console.log("Catalogue :", catalogue);

// --- Readonly<T> : toutes les propriétés en lecture seule ---
type UtilisateurReadonly = Readonly<Utilisateur>;

const immuable: UtilisateurReadonly = {
  id: 1,
  nom: "Alice",
  email: "alice@test.fr",
  age: 25,
  motDePasse: "secret",
};

// immuable.nom = "Bob"; // Erreur : Cannot assign to 'nom' (readonly)
console.log("\nImmuable :", immuable.nom);

// --- Combinaison de utility types ---
// Un formulaire de création : pas d'id (auto-généré), pas de mot de passe
type FormulaireCreation = Omit<Utilisateur, "id" | "motDePasse">;

// Un formulaire de mise à jour : tout optionnel sauf l'id
type FormulaireMiseAJour = Pick<Utilisateur, "id"> & Partial<Omit<Utilisateur, "id">>;

const creation: FormulaireCreation = {
  nom: "Charlie",
  email: "charlie@test.fr",
  age: 30,
};

const miseAJour: FormulaireMiseAJour = {
  id: 3,
  nom: "Charlie Dupont",
  // email, age et motDePasse sont optionnels
};

console.log("\n--- Combinaisons ---");
console.log("Création :", creation);
console.log("Mise à jour :", miseAJour);
```

Compile et exécute :

```bash
npx tsc && node dist/utility-types.js
```

**Résultat attendu** :

```text
  Mise à jour utilisateur #1 : { nom: 'Alice Dupont' }
  Mise à jour utilisateur #1 : { email: 'nouveau@test.fr', age: 26 }

Config par défaut : { theme: 'clair', langue: 'fr', notifications: true }

Profil public : { id: 1, nom: 'Alice' }
Sans mot de passe : { id: 1, nom: 'Alice', email: 'alice@test.fr', age: 25 }

--- Record ---
En attente : La commande est en attente de traitement
Livrée : La commande a été livrée
Catalogue : {
  'CLV-01': { nom: 'Clavier', prix: 49.99, stock: 15 },
  'SRS-01': { nom: 'Souris', prix: 29.99, stock: 42 },
  'ECR-01': { nom: 'Écran', prix: 299.99, stock: 7 }
}

Immuable : Alice

--- Combinaisons ---
Création : { nom: 'Charlie', email: 'charlie@test.fr', age: 30 }
Mise à jour : { id: 3, nom: 'Charlie Dupont' }
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

### Piège 1 : Confondre generic et `any`

⚠️ **Problème** : Utiliser `any` quand un generic serait plus approprié.

```typescript
// Mauvais : on perd le type de retour
function identite(valeur: any): any {
  return valeur;
}
const resultat = identite("bonjour"); // Type : any (pas string)

// Bon : le type est préservé
function identiteTypee<T>(valeur: T): T {
  return valeur;
}
const resultat2 = identiteTypee("bonjour"); // Type : string
```

✅ **Solution** : Utilise un generic dès que tu veux préserver la relation entre le type d'entrée et le type de sortie.

---

### Piège 2 : Oublier la contrainte quand on accède à une propriété

⚠️ **Problème** : Accéder à une propriété dans un generic sans contrainte.

```typescript
function afficherLongueur<T>(valeur: T): void {
  // console.log(valeur.length); // Erreur : Property 'length' does not exist on type 'T'
}
```

✅ **Solution** : Ajoute une contrainte `extends` pour garantir que la propriété existe.

```typescript
function afficherLongueur<T extends { length: number }>(valeur: T): void {
  console.log(valeur.length); // OK : T a une propriété length
}
```

---

### Piège 3 : Trop de paramètres de type

⚠️ **Problème** : Utiliser des generics quand ce n'est pas nécessaire, rendant le code illisible.

```typescript
// Trop complexe : T n'apporte rien ici
function afficher<T extends string>(message: T): void {
  console.log(message);
}

// Plus simple et suffisant
function afficher(message: string): void {
  console.log(message);
}
```

✅ **Solution** : N'utilise un generic que quand le type doit être préservé ou quand la fonction doit fonctionner avec plusieurs types.

---

## Checklist de Validation

- [ ] Je sais créer une fonction générique avec `<T>`
- [ ] Je comprends la différence entre un generic et `any`
- [ ] Je sais créer une interface générique
- [ ] Je sais utiliser les contraintes avec `extends`
- [ ] Je sais utiliser `keyof` comme contrainte
- [ ] Je sais créer une classe générique
- [ ] Je sais utiliser `Partial`, `Required`, `Pick`, `Omit` et `Record`
- [ ] Je sais combiner des utility types

---

## Exercice Pratique

**Énoncé** : Crée un système de cache générique :

1. Crée une interface `ElementCache<T>` avec : `valeur: T`, `expiration: number` (timestamp), `cle: string`
2. Crée une classe `Cache<T>` avec : `definir(cle, valeur, dureeMs)`, `obtenir(cle)` (retourne `T | null`), `supprimer(cle)`, `nettoyer()` (supprime les éléments expirés)
3. Crée une interface `Produit` avec : `id`, `nom`, `prix`
4. Utilise `Omit<Produit, "id">` pour un type de création de produit
5. Teste le cache avec des produits : ajoute 3 produits, récupère un produit, nettoie les expirés

**Indications** :

- Utilise `Date.now()` pour les timestamps
- Un élément est expiré quand `Date.now() > element.expiration`
- La durée est en millisecondes

**Résultat attendu** :

```text
Cache après ajout de 3 produits : 3 éléments
Produit 'clavier' : { id: 1, nom: 'Clavier', prix: 49.99 }
Produit 'inexistant' : null
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```typescript
// src/cache.ts

interface ElementCache<T> {
  valeur: T;
  expiration: number;
  cle: string;
}

class Cache<T> {
  private elements: Map<string, ElementCache<T>> = new Map();

  public definir(cle: string, valeur: T, dureeMs: number): void {
    const element: ElementCache<T> = {
      valeur: valeur,
      expiration: Date.now() + dureeMs,
      cle: cle,
    };
    this.elements.set(cle, element);
  }

  public obtenir(cle: string): T | null {
    const element: ElementCache<T> | undefined = this.elements.get(cle);

    // L'élément n'existe pas
    if (element === undefined) {
      return null;
    }

    // L'élément est expiré
    if (Date.now() > element.expiration) {
      this.elements.delete(cle);
      return null;
    }

    return element.valeur;
  }

  public supprimer(cle: string): boolean {
    return this.elements.delete(cle);
  }

  public nettoyer(): number {
    let supprimes: number = 0;
    const maintenant: number = Date.now();

    for (const [cle, element] of this.elements) {
      if (maintenant > element.expiration) {
        this.elements.delete(cle);
        supprimes++;
      }
    }

    return supprimes;
  }

  public taille(): number {
    return this.elements.size;
  }
}

// Utilisation avec un type Produit
interface Produit {
  id: number;
  nom: string;
  prix: number;
}

type CreationProduit = Omit<Produit, "id">;

// Créer un cache de produits avec 10 secondes d'expiration
const cacheProduits = new Cache<Produit>();

cacheProduits.definir("clavier", { id: 1, nom: "Clavier", prix: 49.99 }, 10000);
cacheProduits.definir("souris", { id: 2, nom: "Souris", prix: 29.99 }, 10000);
cacheProduits.definir("ecran", { id: 3, nom: "Écran", prix: 299.99 }, 10000);

console.log(`Cache après ajout de 3 produits : ${cacheProduits.taille()} éléments`);

const clavier: Produit | null = cacheProduits.obtenir("clavier");
console.log("Produit 'clavier' :", clavier);

const inexistant: Produit | null = cacheProduits.obtenir("inexistant");
console.log("Produit 'inexistant' :", inexistant);
```

Compile et exécute :

```bash
npx tsc && node dist/cache.js
```

**Résultat attendu** :

```text
Cache après ajout de 3 produits : 3 éléments
Produit 'clavier' : { id: 1, nom: 'Clavier', prix: 49.99 }
Produit 'inexistant' : null
```

---

## Pour aller plus loin

### Utility types pour les fonctions

Les utility types `ReturnType<T>` et `Awaited<T>` sont particulièrement utiles dans les projets Node.js TypeScript (vus dans la fiche 12).

```typescript
// ReturnType<T> : extrait le type de retour d'une fonction
function obtenirUtilisateur() {
  return { id: 1, nom: "Alice", role: "admin" };
}

type Utilisateur = ReturnType<typeof obtenirUtilisateur>;
// Equivaut à : type Utilisateur = { id: number; nom: string; role: string }

// Awaited<T> : résout le type d'une Promise (utile avec async/await)
async function chargerDonnees(): Promise<string[]> {
  return ["a", "b", "c"];
}

type DonneesChargees = Awaited<ReturnType<typeof chargerDonnees>>;
// Equivaut à : type DonneesChargees = string[]
```

Ces utility types évitent de dupliquer les définitions de types quand le type de retour est déjà déclaré dans la signature de la fonction.

---

## Navigation

← Fiche précédente : **[09 - Enums et littéraux](09-enums-litteraux.md)**

→ Fiche suivante : **[11 - Modules et namespaces](11-modules-namespaces.md)**
