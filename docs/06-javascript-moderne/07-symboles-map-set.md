---
tags:
  - JavaScript
  - Intermédiaire
  - Concept
description: "Comprendre les Symbols, Map, Set, WeakMap et WeakSet et leurs cas d'utilisation en ES6+."
estimated_time: "60 min"
fiche_number: 7
total_fiches: 14
cursus: "JavaScript Moderne"
id: "web.javascript-modern.symboles-map-set"
course_id: "web.javascript-modern"
content_type: "lesson"
order: 7
---

# 07 - Symboles, Map et Set

> **En bref** : Découvrir les types de données `Symbol`, `Map` et `Set` introduits en ES6, comprendre leurs différences avec les objets et tableaux classiques, et savoir quand les utiliser. Lecture estimée : 60 min.

## Prérequis

- Fiche 01 : [let, const et portée](01-let-const-portee.md)
- Fiche 03 : [Destructuring et spread](03-destructuring-spread.md)
- Fiche 06 : [Classes ES6](06-classes-es6.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et utiliser des `Symbol`, stocker des paires clé-valeur avec `Map`, gérer des collections de valeurs uniques avec `Set`, et comprendre les versions "faibles" (`WeakMap`, `WeakSet`).

---

## Concepts

### Qu'est-ce qu'un Symbol ?

**Définition** : Un `Symbol` est un type primitif unique et immuable introduit en ES6. Chaque appel à `Symbol()` crée une valeur garantie unique, même si la description est identique.

**Le problème que les Symbol résolvent** :

Sans les Symbol, voici les problèmes rencontrés :

1. **Collisions de propriétés** : deux bibliothèques ajoutent la même propriété à un objet, ce qui provoque un conflit.
2. **Pas de propriétés véritablement uniques** : les clés d'objet sont des chaînes de caractères, donc potentiellement en conflit.
3. **Métadonnées non protégées** : impossible d'ajouter des informations internes sans qu'elles apparaissent dans `Object.keys()` ou `for...in`.

**Comment les Symbol résolvent ces problèmes** :

| Problème | Solution apportée par les Symbol |
| -------- | -------------------------------- |
| Collisions de propriétés | Chaque Symbol est unique, pas de conflit possible |
| Pas de propriétés uniques | `Symbol()` garantit l'unicité |
| Métadonnées non protégées | Les propriétés Symbol n'apparaissent pas dans les itérations classiques |

**Analogie concrète** : Un Symbol est comme un numéro de série unique gravé sur un outil. Même si deux tournevis se ressemblent (même description), leurs numéros de série sont différents. Si tu utilises le numéro de série comme étiquette sur un casier, personne d'autre ne pourra accidentellement utiliser la même étiquette.

**Ce qu'un Symbol n'est PAS** :

- Un Symbol n'est pas un string. `Symbol("id")` ne crée pas la chaîne `"id"`, mais une valeur unique dont la description est `"id"`.
- Un Symbol n'est pas une façon de rendre une propriété "privée" au sens strict. On peut accéder aux propriétés Symbol avec `Object.getOwnPropertySymbols()`.

```javascript
// Créer des Symbols
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2); // false - chaque Symbol est unique

// Utiliser un Symbol comme clé d'objet
const utilisateur = {
  nom: "Alice",
  [id1]: 42, // Propriété Symbol - n'apparaît pas dans les itérations classiques
};

console.log(utilisateur[id1]); // 42
console.log(Object.keys(utilisateur)); // ["nom"] - le Symbol n'apparaît pas
console.log(Object.getOwnPropertySymbols(utilisateur)); // [Symbol(id)]
```

---

### Symbol.for() et le registre global

**Définition** : `Symbol.for(clé)` cherche un Symbol dans le registre global. S'il existe, il le retourne. Sinon, il en crée un nouveau et l'enregistre. Cela permet de partager des Symbols entre différentes parties du code.

```javascript
// Symbol.for() retourne le même Symbol pour la même clé
const s1 = Symbol.for("monApp.id");
const s2 = Symbol.for("monApp.id");
console.log(s1 === s2); // true - même Symbol du registre global

// Symbol.keyFor() retourne la clé d'un Symbol du registre
console.log(Symbol.keyFor(s1)); // "monApp.id"

// Les Symbols créés avec Symbol() ne sont PAS dans le registre
const s3 = Symbol("local");
console.log(Symbol.keyFor(s3)); // undefined
```

---

### Qu'est-ce qu'une Map ?

**Définition** : Une `Map` est une collection de paires clé-valeur où les clés peuvent être de n'importe quel type (pas seulement des chaînes de caractères comme pour les objets).

**Le problème que Map résout** :

Sans Map, voici les problèmes rencontrés :

1. **Clés limitées aux chaînes** : dans un objet, toutes les clés sont converties en chaînes de caractères.
2. **Pas de méthode `.size`** : pour connaître le nombre de propriétés d'un objet, il faut `Object.keys(obj).length`.
3. **Ordre d'itération** : l'ordre des propriétés d'un objet n'est pas toujours garanti pour les clés numériques.
4. **Propriétés héritées** : un objet a des propriétés héritées du prototype qui peuvent interférer.

**Comment Map résout ces problèmes** :

| Problème | Solution apportée par Map |
| -------- | ------------------------- |
| Clés limitées aux chaînes | Les clés peuvent être de n'importe quel type |
| Pas de `.size` | `map.size` retourne le nombre d'entrées |
| Ordre d'itération | L'ordre d'insertion est toujours respecté |
| Propriétés héritées | Map n'a pas de prototype qui interfère |

**Comparaison Map vs objet littéral** :

| Map | Objet littéral `{}` |
| --- | -------------------- |
| Clés de n'importe quel type | Clés converties en chaînes |
| `map.size` | `Object.keys(obj).length` |
| Ordre d'insertion garanti | Ordre partiellement garanti |
| Itérable nativement (`for...of`) | Nécessite `Object.entries()` |
| Pas de propriétés par défaut | Hérite de `Object.prototype` |
| Meilleur pour les ajouts/suppressions fréquents | Meilleur pour des structures fixes |

**Analogie concrète** : Une Map est comme un casier de consigne automatique. Chaque casier a une clé unique (de n'importe quel type : numéro, carte, empreinte) et contient une valeur. Tu peux ajouter un nouveau casier, ouvrir un casier avec sa clé, ou compter combien de casiers sont utilisés.

---

### Qu'est-ce qu'un Set ?

**Définition** : Un `Set` est une collection de valeurs uniques. Si tu essaies d'ajouter une valeur qui existe déjà, elle est ignorée.

**Le problème que Set résout** :

Sans Set, voici les problèmes rencontrés :

1. **Doublons dans les tableaux** : il faut manuellement vérifier si une valeur existe avant de l'ajouter.
2. **Suppression de doublons** : il faut filtrer le tableau avec `filter()` et `indexOf()`.
3. **Vérification de présence lente** : `array.includes(valeur)` parcourt tout le tableau (O(n)). `set.has(valeur)` est quasi instantané (O(1)).

**Comment Set résout ces problèmes** :

| Problème | Solution apportée par Set |
| -------- | ------------------------- |
| Doublons dans les tableaux | Set refuse automatiquement les doublons |
| Suppression de doublons | `new Set(tableau)` supprime les doublons |
| Vérification lente | `set.has()` est en O(1) |

**Analogie concrète** : Un Set est comme une liste d'invités à une fête. Si tu ajoutes "Alice" deux fois, son nom n'apparaît qu'une fois. La liste garantit que chaque invité est unique.

**Comparaison Set vs tableau** :

| Set | Tableau `[]` |
| --- | ------------ |
| Valeurs uniques garanties | Doublons possibles |
| `set.has()` très rapide (O(1)) | `arr.includes()` plus lent (O(n)) |
| Pas d'index, pas d'accès par position | Accès par index `arr[0]` |
| `set.size` | `arr.length` |
| Pas de `map()`, `filter()` directement | Toutes les méthodes de tableau |

---

### WeakMap et WeakSet

**Définition** : `WeakMap` et `WeakSet` sont des versions "faibles" de Map et Set. Leurs clés (WeakMap) ou valeurs (WeakSet) doivent être des objets, et ces références sont "faibles" : elles n'empêchent pas le ramasse-miettes (garbage collector) de libérer la mémoire.

**Quand utiliser les versions "faibles"** :

| Utilisation | Exemple |
| ----------- | ------- |
| Métadonnées associées à un objet | `WeakMap` pour stocker des données privées liées à un objet DOM |
| Cache temporaire | `WeakMap` pour cacher des résultats de calcul liés à un objet |
| Marquage d'objets | `WeakSet` pour savoir si un objet a déjà été traité |

```javascript
// WeakMap : les clés sont des objets, la mémoire est libérée quand l'objet disparaît
const metadonnees = new WeakMap();

let element = { type: "bouton", texte: "Cliquer" };
metadonnees.set(element, { clics: 0, dernierClic: null });

console.log(metadonnees.get(element)); // { clics: 0, dernierClic: null }

// Si "element" est mis à null, le garbage collector peut libérer la mémoire
// car WeakMap ne maintient pas de référence forte
element = null;
// metadonnees n'empêche plus "element" d'être collecté
```

---

## Étapes Pratiques

### Étape 1 : Créer et utiliser des Symbols

Crée le fichier `07-symbols-map-set.js` :

```javascript
// Créer des Symbols
const ID = Symbol("id");
const NOM_SECRET = Symbol("nomSecret");

// Utiliser des Symbols comme clés d'objet
const agent = {
  nom: "James Bond",
  [ID]: "007",
  [NOM_SECRET]: "James",
};

// Le Symbol est accessible avec la clé exacte
console.log("ID :", agent[ID]); // "007"
console.log("Nom secret :", agent[NOM_SECRET]); // "James"

// Les Symbols n'apparaissent pas dans les itérations classiques
console.log("Object.keys :", Object.keys(agent)); // ["nom"]
console.log("for...in :");
for (const cle in agent) {
  console.log(` ${cle} : ${agent[cle]}`);
}
// Seul "nom" apparaît

// Pour accéder aux Symbols, il faut Object.getOwnPropertySymbols
const symbols = Object.getOwnPropertySymbols(agent);
console.log("Symbols :", symbols);
symbols.forEach((sym) => {
  console.log(` ${sym.toString()} : ${agent[sym]}`);
});
```

```bash
node ~/js-moderne/07-symbols-map-set.js
```

**Résultat attendu** :

```text
ID : 007
Nom secret : James
Object.keys : [ 'nom' ]
for...in :
 nom : James Bond
Symbols : [ Symbol(id), Symbol(nomSecret) ]
 Symbol(id) : 007
 Symbol(nomSecret) : James
```

---

### Étape 2 : Utiliser Symbol.for() pour partager des Symbols

```javascript
// Symbol.for crée/récupère un Symbol du registre global
const CLE_CONFIG = Symbol.for("app.config");

// Dans un autre module, le même Symbol est récupéré
const memeCle = Symbol.for("app.config");
console.log("Même Symbol :", CLE_CONFIG === memeCle); // true

// Cas pratique : ajouter des métadonnées à des objets partagés
const config = {};
config[Symbol.for("app.version")] = "2.0.0";
config[Symbol.for("app.env")] = "production";

// N'importe où dans l'application, on peut retrouver ces valeurs
console.log("Version :", config[Symbol.for("app.version")]);
console.log("Env :", config[Symbol.for("app.env")]);
```

```bash
node ~/js-moderne/07-symbols-map-set.js
```

**Résultat attendu** :

```text
Même Symbol : true
Version : 2.0.0
Env : production
```

---

### Étape 3 : Créer et utiliser une Map

```javascript
// Créer une Map
const scores = new Map();

// Ajouter des entrées avec .set()
scores.set("Alice", 95);
scores.set("Bob", 82);
scores.set("Charlie", 91);

// Lire une valeur avec .get()
console.log("Score d'Alice :", scores.get("Alice")); // 95

// Vérifier l'existence avec .has()
console.log("Diana existe :", scores.has("Diana")); // false

// Taille de la Map
console.log("Nombre de joueurs :", scores.size); // 3

// Supprimer une entrée
scores.delete("Bob");
console.log("Après suppression de Bob :", scores.size); // 2

// Itérer sur une Map
console.log("\n--- Scores ---");
for (const [nom, score] of scores) {
  console.log(`${nom} : ${score}`);
}

// Les clés peuvent être de N'IMPORTE QUEL TYPE
const mapObjets = new Map();
const cle1 = { id: 1 }; // Objet comme clé
const cle2 = [1, 2, 3]; // Tableau comme clé
const cle3 = function () {}; // Fonction comme clé

mapObjets.set(cle1, "valeur pour objet");
mapObjets.set(cle2, "valeur pour tableau");
mapObjets.set(cle3, "valeur pour fonction");

console.log("\nClé objet :", mapObjets.get(cle1));
console.log("Clé tableau :", mapObjets.get(cle2));
```

```bash
node ~/js-moderne/07-symbols-map-set.js
```

**Résultat attendu** :

```text
Score d'Alice : 95
Diana existe : false
Nombre de joueurs : 3
Après suppression de Bob : 2

--- Scores ---
Alice : 95
Charlie : 91

Clé objet : valeur pour objet
Clé tableau : valeur pour tableau
```

---

### Étape 4 : Convertir entre Map et objet/tableau

```javascript
// Créer une Map depuis un tableau de paires
const mapDepuisTableau = new Map([
  ["cle1", "valeur1"],
  ["cle2", "valeur2"],
  ["cle3", "valeur3"],
]);
console.log("Map depuis tableau :", mapDepuisTableau);

// Créer une Map depuis un objet
const objet = { a: 1, b: 2, c: 3 };
const mapDepuisObjet = new Map(Object.entries(objet));
console.log("Map depuis objet :", mapDepuisObjet);

// Convertir une Map en objet
const objetDepuisMap = Object.fromEntries(mapDepuisObjet);
console.log("Objet depuis Map :", objetDepuisMap);

// Convertir une Map en tableau
const tableauDepuisMap = [...mapDepuisObjet];
console.log("Tableau depuis Map :", tableauDepuisMap);

// Méthodes d'itération
console.log("\nClés :", [...mapDepuisObjet.keys()]); // ["a", "b", "c"]
console.log("Valeurs :", [...mapDepuisObjet.values()]); // [1, 2, 3]
console.log("Entrées :", [...mapDepuisObjet.entries()]);
```

```bash
node ~/js-moderne/07-symbols-map-set.js
```

**Résultat attendu** :

```text
Map depuis tableau : Map(3) { 'cle1' => 'valeur1', 'cle2' => 'valeur2', 'cle3' => 'valeur3' }
Map depuis objet : Map(3) { 'a' => 1, 'b' => 2, 'c' => 3 }
Objet depuis Map : { a: 1, b: 2, c: 3 }
Tableau depuis Map : [ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] ]

Clés : [ 'a', 'b', 'c' ]
Valeurs : [ 1, 2, 3 ]
Entrées : [ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] ]
```

---

### Étape 5 : Créer et utiliser un Set

```javascript
// Créer un Set
const fruits = new Set(["pomme", "banane", "cerise"]);

// Ajouter des éléments
fruits.add("datte");
fruits.add("pomme"); // Ignoré - déjà présent
console.log("Fruits :", fruits);
console.log("Taille :", fruits.size); // 4, pas 5

// Vérifier la présence
console.log("A pomme :", fruits.has("pomme")); // true
console.log("A kiwi :", fruits.has("kiwi")); // false

// Supprimer un élément
fruits.delete("banane");
console.log("Après suppression :", fruits);

// Supprimer les doublons d'un tableau
const avecDoublons = [1, 2, 3, 2, 1, 4, 5, 3, 4];
const sansDoublons = [...new Set(avecDoublons)];
console.log("\nAvec doublons :", avecDoublons);
console.log("Sans doublons :", sansDoublons);

// Itérer sur un Set
console.log("\n--- Fruits restants ---");
for (const fruit of fruits) {
  console.log(`- ${fruit}`);
}
```

```bash
node ~/js-moderne/07-symbols-map-set.js
```

**Résultat attendu** :

```text
Fruits : Set(4) { 'pomme', 'banane', 'cerise', 'datte' }
Taille : 4
A pomme : true
A kiwi : false
Après suppression : Set(3) { 'pomme', 'cerise', 'datte' }

Avec doublons : [ 1, 2, 3, 2, 1, 4, 5, 3, 4 ]
Sans doublons : [ 1, 2, 3, 4, 5 ]

--- Fruits restants ---
- pomme
- cerise
- datte
```

---

### Étape 6 : Opérations ensemblistes avec Set

```javascript
// Opérations ensemblistes : union, intersection, différence
const setA = new Set([1, 2, 3, 4, 5]);
const setB = new Set([4, 5, 6, 7, 8]);

// Union : tous les éléments des deux ensembles
const union = new Set([...setA, ...setB]);
console.log("Union :", [...union]);

// Intersection : éléments communs aux deux ensembles
const intersection = new Set([...setA].filter((x) => setB.has(x)));
console.log("Intersection :", [...intersection]);

// Différence : éléments dans A mais pas dans B
const difference = new Set([...setA].filter((x) => !setB.has(x)));
console.log("Différence (A-B) :", [...difference]);

// Différence symétrique : éléments dans A ou B, mais pas les deux
const diffSymetrique = new Set(
  [...setA].filter((x) => !setB.has(x)).concat([...setB].filter((x) => !setA.has(x)))
);
console.log("Diff symétrique :", [...diffSymetrique]);

// Sous-ensemble : A est-il un sous-ensemble de B ?
const setC = new Set([4, 5]);
const estSousEnsemble = [...setC].every((x) => setA.has(x));
console.log("C ⊂ A :", estSousEnsemble); // true
```

```bash
node ~/js-moderne/07-symbols-map-set.js
```

**Résultat attendu** :

```text
Union : [ 1, 2, 3, 4, 5, 6, 7, 8 ]
Intersection : [ 4, 5 ]
Différence (A-B) : [ 1, 2, 3 ]
Diff symétrique : [ 1, 2, 3, 6, 7, 8 ]
C ⊂ A : true
```

---

### Étape 7 : WeakMap pour les métadonnées privées

```javascript
// WeakMap pour stocker des données privées associées à des objets
const donneesPrivees = new WeakMap();

class Composant {
  constructor(nom) {
    this.nom = nom;
    // Stocker les données privées dans la WeakMap
    donneesPrivees.set(this, {
      nombreRendus: 0,
      derniereModification: new Date(),
    });
  }

  rendre() {
    // Récupérer les données privées
    const donnees = donneesPrivees.get(this);
    donnees.nombreRendus++;
    donnees.derniereModification = new Date();
    console.log(`${this.nom} rendu (${donnees.nombreRendus} fois)`);
  }

  stats() {
    const donnees = donneesPrivees.get(this);
    return `${this.nom}: ${donnees.nombreRendus} rendus`;
  }
}

const header = new Composant("Header");
const footer = new Composant("Footer");

header.rendre();
header.rendre();
header.rendre();
footer.rendre();

console.log(header.stats());
console.log(footer.stats());

// Les données privées ne sont pas accessibles depuis l'extérieur
// sans la référence à l'objet original
```

```bash
node ~/js-moderne/07-symbols-map-set.js
```

**Résultat attendu** :

```text
Header rendu (1 fois)
Header rendu (2 fois)
Header rendu (3 fois)
Footer rendu (1 fois)
Header: 3 rendus
Footer: 1 rendus
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `Symbol("desc")` | Crée un Symbol unique |
| `Symbol.for("clé")` | Crée/récupère un Symbol du registre global |
| `new Map()` | Crée une Map vide |
| `map.set(clé, val)` | Ajoute une entrée |
| `map.get(clé)` | Lit une valeur |
| `map.has(clé)` | Vérifie l'existence |
| `map.delete(clé)` | Supprime une entrée |
| `map.size` | Nombre d'entrées |
| `new Set([valeurs])` | Crée un Set |
| `set.add(val)` | Ajoute une valeur |
| `set.has(val)` | Vérifie la présence |
| `[...new Set(arr)]` | Supprime les doublons d'un tableau |

---

## Pièges Fréquents

### Piège 1 : Comparer des Symbols

**Problème** : Deux `Symbol()` avec la même description ne sont pas égaux.

**Solution** : Utilise `Symbol.for()` si tu veux partager un Symbol entre différentes parties du code.

```javascript
// ❌ Deux Symbols différents malgré la même description
const a = Symbol("id");
const b = Symbol("id");
console.log(a === b); // false

// ✅ Symbol.for() retourne le même Symbol
const c = Symbol.for("id");
const d = Symbol.for("id");
console.log(c === d); // true
```

---

### Piège 2 : Objets comme clés dans un objet vs Map

**Problème** : Tu utilises un objet comme clé dans un objet littéral, et la clé est convertie en `"[object Object]"`.

**Solution** : Utilise une `Map` si tu veux des objets comme clés.

```javascript
// ❌ Objet littéral : les clés sont converties en chaînes
const obj = {};
const cle1 = { id: 1 };
const cle2 = { id: 2 };
obj[cle1] = "valeur1";
obj[cle2] = "valeur2";
console.log(Object.keys(obj)); // ["[object Object]"] - une seule clé !

// ✅ Map : les objets restent des clés distinctes
const map = new Map();
map.set(cle1, "valeur1");
map.set(cle2, "valeur2");
console.log(map.size); // 2 - deux clés distinctes
```

---

### Piège 3 : Set compare par référence pour les objets

**Problème** : Deux objets avec le même contenu sont considérés comme différents par Set.

**Solution** : Set utilise l'égalité de référence pour les objets. Deux objets différents en mémoire, même avec le même contenu, sont considérés comme distincts.

```javascript
const set = new Set();
set.add({ nom: "Alice" });
set.add({ nom: "Alice" }); // Objet différent en mémoire
console.log(set.size); // 2 - les deux objets sont distincts

// Pour dédupliquer des objets, utilise une Map avec une clé unique
const users = [
  { id: 1, nom: "Alice" },
  { id: 1, nom: "Alice" },
];
const uniques = [...new Map(users.map((u) => [u.id, u])).values()];
console.log(uniques.length); // 1
```

---

## Checklist de Validation

- [ ] Je sais créer un Symbol et l'utiliser comme clé d'objet
- [ ] Je comprends la différence entre `Symbol()` et `Symbol.for()`
- [ ] Je sais créer une Map et utiliser `.set()`, `.get()`, `.has()`, `.delete()`
- [ ] Je connais les avantages de Map par rapport aux objets littéraux
- [ ] Je sais créer un Set et supprimer les doublons d'un tableau
- [ ] Je sais réaliser des opérations ensemblistes (union, intersection, différence)
- [ ] Je comprends quand utiliser WeakMap et WeakSet

---

## Exercice Pratique

**Énoncé** : Crée un système de gestion de tags pour des articles de blog.

1. Crée une `Map` qui associe des articles (objets) à leurs tags (Set de chaînes).
2. Implémente les fonctions : `ajouterTag(article, tag)`, `supprimerTag(article, tag)`, `listerTags(article)`, `rechercherParTag(tag)`.
3. Utilise un `Set` pour les tags afin de garantir l'unicité.
4. Crée une fonction `tagsPopulaires()` qui retourne les tags triés par fréquence.

**Indications** :

- Utilise `Map` pour associer chaque article à son Set de tags.
- Utilise `Set` pour stocker les tags de chaque article (pas de doublons).
- Pour compter la fréquence, itère sur toutes les entrées de la Map.

**Résultat attendu** :

```text
Tags de "Intro ES6" : javascript, es6, tutoriel
Tags de "Async/Await" : javascript, async, promesses

Articles avec le tag "javascript" :
- Intro ES6
- Async/Await

Tags populaires :
- javascript (2 articles)
- es6 (1 articles)
- tutoriel (1 articles)
- async (1 articles)
- promesses (1 articles)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// Map associant les articles à leurs tags (Set)
const articlesTags = new Map();

// Ajouter un tag à un article
const ajouterTag = (article, tag) => {
  if (!articlesTags.has(article)) {
    articlesTags.set(article, new Set());
  }
  articlesTags.get(article).add(tag);
};

// Supprimer un tag d'un article
const supprimerTag = (article, tag) => {
  if (articlesTags.has(article)) {
    articlesTags.get(article).delete(tag);
  }
};

// Lister les tags d'un article
const listerTags = (article) => {
  const tags = articlesTags.get(article);
  return tags ? [...tags] : [];
};

// Rechercher les articles ayant un tag donné
const rechercherParTag = (tag) => {
  const resultats = [];
  for (const [article, tags] of articlesTags) {
    if (tags.has(tag)) {
      resultats.push(article);
    }
  }
  return resultats;
};

// Retourner les tags triés par fréquence
const tagsPopulaires = () => {
  const compteur = new Map();
  for (const [, tags] of articlesTags) {
    for (const tag of tags) {
      compteur.set(tag, (compteur.get(tag) || 0) + 1);
    }
  }
  return [...compteur.entries()].sort((a, b) => b[1] - a[1]);
};

// Scénario de test
const article1 = { titre: "Intro ES6" };
const article2 = { titre: "Async/Await" };

ajouterTag(article1, "javascript");
ajouterTag(article1, "es6");
ajouterTag(article1, "tutoriel");
ajouterTag(article1, "javascript"); // Doublon ignoré grâce au Set

ajouterTag(article2, "javascript");
ajouterTag(article2, "async");
ajouterTag(article2, "promesses");

console.log(`Tags de "${article1.titre}" :`, listerTags(article1).join(", "));
console.log(`Tags de "${article2.titre}" :`, listerTags(article2).join(", "));

const jsArticles = rechercherParTag("javascript");
console.log(`\nArticles avec le tag "javascript" :`);
jsArticles.forEach((a) => console.log(`- ${a.titre}`));

console.log("\nTags populaires :");
tagsPopulaires().forEach(([tag, count]) => {
  console.log(`- ${tag} (${count} articles)`);
});
```

---

## Navigation

← Fiche précédente : **[Classes ES6](06-classes-es6.md)**

→ Fiche suivante : **[Itérateurs et générateurs](08-iterateurs-generateurs.md)**
