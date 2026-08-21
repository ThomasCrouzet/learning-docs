---
tags:
  - JavaScript
  - Intermédiaire
  - Concept
description: "Comprendre le protocole itérateur, Symbol.iterator, for...of, les générateurs (function*) et yield."
estimated_time: "75 min"
fiche_number: 8
total_fiches: 14
cursus: "JavaScript Moderne"
id: "web.javascript-modern.iterateurs-generateurs"
course_id: "web.javascript-modern"
content_type: "lesson"
order: 8
---

# 08 - Itérateurs et générateurs

> **En bref** : Comprendre le protocole itérateur, implémenter `Symbol.iterator`, maîtriser `for...of` vs `for...in`, et créer des générateurs avec `function*` et `yield`. Lecture estimée : 75 min.

## Prérequis

- Fiche 01 : [let, const et portée](01-let-const-portee.md)
- Fiche 06 : [Classes ES6](06-classes-es6.md)
- Fiche 07 : [Symboles, Map et Set](07-symboles-map-set.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est un itérateur, comment rendre un objet itérable avec `Symbol.iterator`, utiliser `for...of` correctement, et créer des générateurs pour produire des séquences de valeurs à la demande.

---

## Concepts

### Qu'est-ce qu'un itérateur ?

**Définition** : Un itérateur est un objet qui possède une méthode `next()`. Chaque appel à `next()` retourne un objet `{ value, done }` où `value` est la valeur courante et `done` indique si la séquence est terminée.

**Le problème que les itérateurs résolvent** :

Sans les itérateurs, voici les problèmes rencontrés :

1. **Pas de protocole standard** : chaque structure de données a sa propre façon d'être parcourue (boucle `for`, accès par index, `forEach`).
2. **Pas de parcours paresseux** : on doit stocker toutes les valeurs en mémoire, même pour de grandes séquences.
3. **Duplication de logique** : chaque consommateur de données doit connaître la structure interne de la collection.

**Comment les itérateurs résolvent ces problèmes** :

| Problème | Solution apportée par les itérateurs |
| -------- | ------------------------------------ |
| Pas de protocole standard | Interface uniforme `{ next() }` pour toutes les collections |
| Pas de parcours paresseux | Les valeurs sont produites une à une, à la demande |
| Duplication de logique | Le consommateur appelle `next()` sans connaître la structure interne |

**Analogie concrète** : Un itérateur est comme un distributeur de tickets numérotés. Tu appuies sur le bouton (appeler `next()`), et il te donne le ticket suivant (la valeur). Quand il n'y a plus de tickets, il affiche "terminé" (`done: true`). Tu n'as pas besoin de savoir combien de tickets il contient ni comment ils sont rangés à l'intérieur.

**Ce qu'un itérateur n'est PAS** :

- Un itérateur n'est pas un tableau. Il ne stocke pas toutes les valeurs en mémoire. Il produit les valeurs une par une.
- Un itérateur n'est pas réutilisable. Une fois épuisé (`done: true`), il faut en créer un nouveau.

Le schéma suivant illustre le protocole itérateur, de l'objet itérable jusqu'à l'épuisement de la séquence :

<div class="diagram-design">
<p><a href="../../diagrams/06-javascript-moderne-08-iterateurs-generateurs-1.html">Qu&#x27;est-ce qu&#x27;un itérateur ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/06-javascript-moderne-08-iterateurs-generateurs-1.html" title="Qu&#x27;est-ce qu&#x27;un itérateur ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

```javascript
// Créer un itérateur manuellement
const creerCompteur = (debut, fin) => {
  let valeur = debut;
  return {
    next() {
      if (valeur <= fin) {
        return { value: valeur++, done: false };
      }
      return { value: undefined, done: true };
    },
  };
};

const compteur = creerCompteur(1, 3);
console.log(compteur.next()); // { value: 1, done: false }
console.log(compteur.next()); // { value: 2, done: false }
console.log(compteur.next()); // { value: 3, done: false }
console.log(compteur.next()); // { value: undefined, done: true }
```

---

### Qu'est-ce qu'un itérable ?

**Définition** : Un itérable est un objet qui possède une méthode `[Symbol.iterator]()` retournant un itérateur. Les tableaux, chaînes, Map, Set sont des itérables natifs.

**Itérables natifs en JavaScript** :

| Type | Itérable ? | Ce qui est itéré |
| ---- | ---------- | ----------------- |
| `Array` | Oui | Les éléments |
| `String` | Oui | Les caractères |
| `Map` | Oui | Les paires `[clé, valeur]` |
| `Set` | Oui | Les valeurs |
| `Object` | Non | Utilise `Object.entries()` |
| `arguments` | Oui | Les arguments |
| `NodeList` | Oui | Les nœuds DOM |

**Les constructions qui utilisent les itérables** :

- `for...of`
- Spread operator `[...iterable]`
- Destructuring `const [a, b] = iterable`
- `Array.from(iterable)`
- `new Map(iterable)` et `new Set(iterable)`
- `Promise.all(iterable)` et `Promise.race(iterable)`

---

### `for...of` vs `for...in`

**Définition** : `for...of` itère sur les valeurs d'un itérable. `for...in` itère sur les clés (propriétés énumérables) d'un objet.

**Comparaison `for...of` vs `for...in`** :

| `for...of` | `for...in` |
| ---------- | ---------- |
| Itère sur les **valeurs** | Itère sur les **clés** (noms de propriétés) |
| Fonctionne sur les itérables | Fonctionne sur tous les objets |
| `for (const val of tableau)` | `for (const cle in objet)` |
| Ne parcourt pas les propriétés héritées | Parcourt les propriétés héritées |
| Erreur si l'objet n'est pas itérable | Fonctionne toujours |

```javascript
// for...of : les VALEURS
const fruits = ["pomme", "banane", "cerise"];
for (const fruit of fruits) {
  console.log(fruit); // "pomme", "banane", "cerise"
}

// for...in : les CLÉS (index pour un tableau)
for (const index in fruits) {
  console.log(index); // "0", "1", "2" - ce sont des strings !
}

// for...in sur un objet : les noms de propriétés
const personne = { nom: "Alice", age: 25 };
for (const cle in personne) {
  console.log(`${cle} : ${personne[cle]}`); // "nom : Alice", "age : 25"
}

// for...of sur un objet : ERREUR
// for (const val of personne) {} // TypeError: personne is not iterable
// Solution : for...of avec Object.entries()
for (const [cle, val] of Object.entries(personne)) {
  console.log(`${cle} : ${val}`);
}
```

---

### Comment rendre un objet itérable ?

**Définition** : Pour rendre un objet itérable, il faut lui ajouter une méthode `[Symbol.iterator]()` qui retourne un itérateur (un objet avec `next()`).

```javascript
// Rendre un objet personnalisé itérable
class Intervalle {
  constructor(debut, fin) {
    this.debut = debut;
    this.fin = fin;
  }

  // La méthode [Symbol.iterator] rend l'objet itérable
  [Symbol.iterator]() {
    let courant = this.debut;
    const fin = this.fin;

    return {
      next() {
        if (courant <= fin) {
          return { value: courant++, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

const intervalle = new Intervalle(1, 5);

// Maintenant on peut utiliser for...of
for (const n of intervalle) {
  console.log(n); // 1, 2, 3, 4, 5
}

// Et le spread operator
console.log([...intervalle]); // [1, 2, 3, 4, 5]

// Et le destructuring
const [premier, deuxieme] = intervalle;
console.log(premier, deuxieme); // 1, 2
```

---

### Qu'est-ce qu'un générateur ?

**Définition** : Un générateur est une fonction spéciale déclarée avec `function*` qui peut suspendre son exécution avec `yield` et la reprendre ensuite. Elle retourne automatiquement un itérateur.

**Le problème que les générateurs résolvent** :

Sans les générateurs, voici les problèmes rencontrés :

1. **Itérateurs complexes** : écrire manuellement un itérateur avec `next()` et la gestion de l'état interne est verbeux et sujet aux erreurs.
2. **Séquences infinies** : impossible de créer facilement une séquence infinie sans un générateur.
3. **Évaluation paresseuse** : calculer toutes les valeurs d'avance gaspille de la mémoire.

**Comment les générateurs résolvent ces problèmes** :

| Problème | Solution apportée par les générateurs |
| -------- | ------------------------------------- |
| Itérateurs complexes | `function*` + `yield` crée automatiquement un itérateur |
| Séquences infinies | Le générateur ne calcule la valeur suivante que quand on la demande |
| Évaluation paresseuse | Chaque `yield` suspend l'exécution jusqu'au prochain appel de `next()` |

**Analogie concrète** : Un générateur est comme un narrateur qui lit un livre chapitre par chapitre. Il lit un chapitre (`yield`), puis s'arrête et attend que tu lui dises "continue" (appel à `next()`). Il ne lit pas tout le livre d'un coup.

```javascript
// Générateur simple
function* compteur(debut, fin) {
  for (let i = debut; i <= fin; i++) {
    yield i; // Suspend l'exécution et retourne la valeur
  }
}

const gen = compteur(1, 5);
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
// ...

// Un générateur est itérable : on peut utiliser for...of
for (const n of compteur(1, 5)) {
  console.log(n); // 1, 2, 3, 4, 5
}
```

---

### `yield*` pour déléguer à un autre itérable

**Définition** : `yield*` délègue l'itération à un autre itérable ou générateur. Chaque valeur de l'itérable délégué est produite comme si elle venait du générateur courant.

```javascript
function* lettres() {
  yield "a";
  yield "b";
  yield "c";
}

function* chiffres() {
  yield 1;
  yield 2;
  yield 3;
}

// yield* délègue à un autre générateur
function* toutEnsemble() {
  yield* lettres(); // Produit a, b, c
  yield "-";
  yield* chiffres(); // Produit 1, 2, 3
}

console.log([...toutEnsemble()]); // ["a", "b", "c", "-", 1, 2, 3]

// yield* fonctionne aussi avec les tableaux et autres itérables
function* avecTableau() {
  yield* [10, 20, 30]; // Produit chaque élément du tableau
}
console.log([...avecTableau()]); // [10, 20, 30]
```

---

## Étapes Pratiques

### Étape 1 : Créer un itérateur manuel

Crée le fichier `08-iterateurs.js` :

```javascript
// Itérateur manuel pour un compte à rebours
const compteARebours = (debut) => ({
  [Symbol.iterator]() {
    let valeur = debut;
    return {
      next() {
        if (valeur >= 0) {
          return { value: valeur--, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
});

// Utiliser l'itérable avec for...of
console.log("Compte à rebours :");
for (const n of compteARebours(5)) {
  console.log(n);
}

// Utiliser avec le spread
console.log("Spread :", [...compteARebours(3)]);
```

```bash
node ~/js-moderne/08-iterateurs.js
```

**Résultat attendu** :

```text
Compte à rebours :
5
4
3
2
1
0
Spread : [ 3, 2, 1, 0 ]
```

---

### Étape 2 : Rendre une classe itérable

```javascript
// Classe Collection itérable
class Collection {
  #elements = [];

  ajouter(...elements) {
    this.#elements.push(...elements);
    return this; // Permet le chaînage
  }

  get taille() {
    return this.#elements.length;
  }

  // Rendre la collection itérable
  [Symbol.iterator]() {
    let index = 0;
    const elements = this.#elements;

    return {
      next() {
        if (index < elements.length) {
          return { value: elements[index++], done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

const maCollection = new Collection();
maCollection.ajouter("alpha", "beta", "gamma").ajouter("delta");

// for...of fonctionne grâce à Symbol.iterator
console.log("Collection :");
for (const element of maCollection) {
  console.log(`- ${element}`);
}

// Le spread fonctionne aussi
console.log("Spread :", [...maCollection]);

// Le destructuring aussi
const [premier, second] = maCollection;
console.log(`Premier : ${premier}, Second : ${second}`);
```

```bash
node ~/js-moderne/08-iterateurs.js
```

**Résultat attendu** :

```text
Collection :
- alpha
- beta
- gamma
- delta
Spread : [ 'alpha', 'beta', 'gamma', 'delta' ]
Premier : alpha, Second : beta
```

---

### Étape 3 : Créer un générateur simple

```javascript
// Générateur de la suite de Fibonacci
function* fibonacci(limite = Infinity) {
  let a = 0;
  let b = 1;
  let compteur = 0;

  while (compteur < limite) {
    yield a; // Retourne la valeur courante et suspend l'exécution
    [a, b] = [b, a + b]; // Calcule le terme suivant
    compteur++;
  }
}

// Les 10 premiers termes de Fibonacci
console.log("Fibonacci (10 termes) :");
for (const n of fibonacci(10)) {
  console.log(n);
}

// Avec le spread
console.log("Fibonacci :", [...fibonacci(8)]);

// Le générateur est paresseux : il calcule à la demande
const fib = fibonacci();
console.log("\nÀ la demande :");
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3
```

```bash
node ~/js-moderne/08-iterateurs.js
```

**Résultat attendu** :

```text
Fibonacci (10 termes) :
0
1
1
2
3
5
8
13
21
34
Fibonacci : [ 0, 1, 1, 2, 3, 5, 8, 13 ]

À la demande :
0
1
1
2
3
```

---

### Étape 4 : Générateur infini avec prise de valeurs

```javascript
// Générateur infini de nombres pairs
function* pairsInfini(debut = 0) {
  let n = debut % 2 === 0 ? debut : debut + 1;
  while (true) {
    yield n;
    n += 2;
  }
}

// Prendre les 5 premiers pairs à partir de 10
const gen = pairsInfini(10);
const cinqPairs = [];
for (let i = 0; i < 5; i++) {
  cinqPairs.push(gen.next().value);
}
console.log("5 pairs à partir de 10 :", cinqPairs);

// Fonction utilitaire pour prendre N éléments d'un itérable
function* prendre(iterable, n) {
  let compteur = 0;
  for (const valeur of iterable) {
    if (compteur >= n) return;
    yield valeur;
    compteur++;
  }
}

console.log("Prendre 7 pairs :", [...prendre(pairsInfini(0), 7)]);

// Générateur infini de puissances de 2
function* puissancesDeDeux() {
  let n = 1;
  while (true) {
    yield n;
    n *= 2;
  }
}

console.log("Puissances de 2 :", [...prendre(puissancesDeDeux(), 10)]);
```

```bash
node ~/js-moderne/08-iterateurs.js
```

**Résultat attendu** :

```text
5 pairs à partir de 10 : [ 10, 12, 14, 16, 18 ]
Prendre 7 pairs : [ 0, 2, 4, 6, 8, 10, 12 ]
Puissances de 2 : [ 1, 2, 4, 8, 16, 32, 64, 128, 256, 512 ]
```

---

### Étape 5 : yield* pour composer des générateurs

```javascript
// Générateurs composables avec yield*

function* intervalle(debut, fin) {
  for (let i = debut; i <= fin; i++) {
    yield i;
  }
}

function* repetition(valeur, fois) {
  for (let i = 0; i < fois; i++) {
    yield valeur;
  }
}

// Composer des générateurs avec yield*
function* sequence() {
  yield* intervalle(1, 3); // 1, 2, 3
  yield* repetition("X", 2); // "X", "X"
  yield* intervalle(8, 10); // 8, 9, 10
}

console.log("Séquence composée :", [...sequence()]);

// Aplatir un tableau de tableaux avec un générateur
function* aplatir(tableau) {
  for (const element of tableau) {
    if (Array.isArray(element)) {
      yield* aplatir(element); // Récursion avec yield*
    } else {
      yield element;
    }
  }
}

const imbrique = [1, [2, 3], [4, [5, [6, 7]]], 8];
console.log("Aplati :", [...aplatir(imbrique)]);
```

```bash
node ~/js-moderne/08-iterateurs.js
```

**Résultat attendu** :

```text
Séquence composée : [ 1, 2, 3, 'X', 'X', 8, 9, 10 ]
Aplati : [ 1, 2, 3, 4, 5, 6, 7, 8 ]
```

---

### Étape 6 : Passer des valeurs au générateur avec next()

```javascript
// On peut envoyer des valeurs au générateur via next(valeur)
// La valeur envoyée remplace le résultat du yield précédent

function* dialogue() {
  const nom = yield "Comment t'appelles-tu ?";
  const age = yield `Bonjour ${nom} ! Quel âge as-tu ?`;
  yield `${nom}, ${age} ans. Enchanté !`;
}

const conv = dialogue();

// Premier appel : démarre le générateur, retourne la première question
console.log(conv.next().value); // "Comment t'appelles-tu ?"

// Deuxième appel : envoie "Alice" comme réponse au premier yield
console.log(conv.next("Alice").value); // "Bonjour Alice ! Quel âge as-tu ?"

// Troisième appel : envoie "25" comme réponse au deuxième yield
console.log(conv.next("25").value); // "Alice, 25 ans. Enchanté !"
```

```bash
node ~/js-moderne/08-iterateurs.js
```

**Résultat attendu** :

```text
Comment t'appelles-tu ?
Bonjour Alice ! Quel âge as-tu ?
Alice, 25 ans. Enchanté !
```

---

### Étape 7 : Générateur comme itérateur simplifié pour une classe

```javascript
// Utiliser un générateur pour simplifier Symbol.iterator
class Playlist {
  #morceaux = [];

  ajouter(titre, artiste) {
    this.#morceaux.push({ titre, artiste });
  }

  // Générateur comme méthode [Symbol.iterator]
  *[Symbol.iterator]() {
    for (const morceau of this.#morceaux) {
      yield `${morceau.titre} - ${morceau.artiste}`;
    }
  }

  // Générateur pour itérer en ordre inverse
  *inverse() {
    for (let i = this.#morceaux.length - 1; i >= 0; i--) {
      yield `${this.#morceaux[i].titre} - ${this.#morceaux[i].artiste}`;
    }
  }
}

const playlist = new Playlist();
playlist.ajouter("Bohemian Rhapsody", "Queen");
playlist.ajouter("Stairway to Heaven", "Led Zeppelin");
playlist.ajouter("Hotel California", "Eagles");

console.log("Playlist :");
for (const morceau of playlist) {
  console.log(`  ${morceau}`);
}

console.log("\nEn ordre inverse :");
for (const morceau of playlist.inverse()) {
  console.log(`  ${morceau}`);
}

console.log("\nSpread :", [...playlist]);
```

```bash
node ~/js-moderne/08-iterateurs.js
```

**Résultat attendu** :

```text
Playlist :
  Bohemian Rhapsody - Queen
  Stairway to Heaven - Led Zeppelin
  Hotel California - Eagles

En ordre inverse :
  Hotel California - Eagles
  Stairway to Heaven - Led Zeppelin
  Bohemian Rhapsody - Queen

Spread : [ 'Bohemian Rhapsody - Queen', 'Stairway to Heaven - Led Zeppelin', 'Hotel California - Eagles' ]
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `for (const val of iterable)` | Itère sur les valeurs d'un itérable |
| `for (const cle in objet)` | Itère sur les clés d'un objet |
| `[Symbol.iterator]() { ... }` | Rend un objet itérable |
| `function* nom() { ... }` | Déclare un générateur |
| `yield valeur` | Suspend et retourne une valeur |
| `yield* iterable` | Délègue à un autre itérable |
| `gen.next()` | Avance d'une étape dans le générateur |
| `gen.next(valeur)` | Avance et envoie une valeur |
| `gen.return(valeur)` | Termine le générateur |

---

## Pièges Fréquents

### Piège 1 : Utiliser `for...in` sur un tableau

**Problème** : `for...in` itère sur les indices (clés) du tableau, qui sont des chaînes de caractères, et parcourt aussi les propriétés héritées.

**Solution** : Utilise toujours `for...of` pour les tableaux.

```javascript
// ❌ for...in sur un tableau
const arr = ["a", "b", "c"];
for (const i in arr) {
  console.log(typeof i, i); // "string" "0", "string" "1", "string" "2"
}

// ✅ for...of sur un tableau
for (const val of arr) {
  console.log(val); // "a", "b", "c"
}
```

---

### Piège 2 : Oublier que les itérateurs sont à usage unique

**Problème** : Tu stockes le résultat d'un générateur et tu essaies de l'itérer deux fois.

**Solution** : Crée un nouvel itérateur à chaque parcours, ou convertis en tableau avec `[...gen]`.

```javascript
function* nums() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = nums();
console.log([...gen]); // [1, 2, 3]
console.log([...gen]); // [] - épuisé !

// ✅ Créer un nouveau générateur à chaque fois
console.log([...nums()]); // [1, 2, 3]
console.log([...nums()]); // [1, 2, 3]
```

---

### Piège 3 : Essayer de spread un générateur infini

**Problème** : `[...generateurInfini()]` essaie de collecter toutes les valeurs, ce qui bloque le programme.

**Solution** : Utilise une fonction `prendre(n)` pour limiter le nombre de valeurs.

```javascript
function* infini() {
  let n = 0;
  while (true) yield n++;
}

// ❌ Ne JAMAIS faire ça avec un générateur infini
// const tout = [...infini()]; // Boucle infinie, crash mémoire

// ✅ Limiter avec une fonction prendre
function* prendre(gen, n) {
  let i = 0;
  for (const val of gen) {
    if (i >= n) return;
    yield val;
    i++;
  }
}
console.log([...prendre(infini(), 5)]); // [0, 1, 2, 3, 4]
```

---

## Checklist de Validation

- [ ] Je sais ce qu'est un itérateur (objet avec `next()` retournant `{ value, done }`)
- [ ] Je sais ce qu'est un itérable (objet avec `[Symbol.iterator]()`)
- [ ] Je sais utiliser `for...of` et je connais la différence avec `for...in`
- [ ] Je sais rendre un objet itérable en implémentant `[Symbol.iterator]()`
- [ ] Je sais créer un générateur avec `function*` et `yield`
- [ ] Je sais utiliser `yield*` pour déléguer à un autre itérable
- [ ] Je sais passer des valeurs à un générateur avec `next(valeur)`

---

## Exercice Pratique

**Énoncé** : Crée un système de pagination avec des générateurs.

1. Crée un générateur `paginer(tableau, taillePage)` qui produit les éléments page par page (sous-tableaux).
2. Crée un générateur `numeros(debut, fin)` qui produit les numéros de `debut` à `fin`.
3. Crée une classe `BaseDeDonnees` avec un tableau de données et une méthode `*requete(filtre)` qui produit les résultats filtrés un par un.
4. Combine le tout : génère 50 éléments, filtre-les, et affiche-les page par page.

**Indications** :

- `paginer` doit utiliser `yield` pour retourner des sous-tableaux de taille `taillePage`.
- `*requete` est un générateur qui filtre et yield chaque résultat.
- Utilise `[...generateur]` pour collecter les résultats quand nécessaire.

**Résultat attendu** :

```text
=== Page 1 ===
- Utilisateur 2 (age: 22)
- Utilisateur 4 (age: 24)
- Utilisateur 6 (age: 26)

=== Page 2 ===
- Utilisateur 8 (age: 28)
- Utilisateur 10 (age: 30)
- Utilisateur 12 (age: 32)

(...)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// Générateur qui pagine un tableau
function* paginer(tableau, taillePage = 3) {
  for (let i = 0; i < tableau.length; i += taillePage) {
    // yield un sous-tableau (une page)
    yield tableau.slice(i, i + taillePage);
  }
}

// Générateur de numéros
function* numeros(debut, fin) {
  for (let i = debut; i <= fin; i++) {
    yield i;
  }
}

// Classe BaseDeDonnees avec générateur de requête
class BaseDeDonnees {
  #donnees = [];

  ajouter(...elements) {
    this.#donnees.push(...elements);
  }

  // Générateur qui filtre les données
  *requete(filtre) {
    for (const element of this.#donnees) {
      if (filtre(element)) {
        yield element;
      }
    }
  }
}

// Créer 50 utilisateurs
const bdd = new BaseDeDonnees();
for (const n of numeros(1, 50)) {
  bdd.ajouter({
    nom: `Utilisateur ${n}`,
    age: 20 + n,
  });
}

// Filtrer les utilisateurs avec un âge pair
const agesPairs = [...bdd.requete((u) => u.age % 2 === 0)];

// Paginer les résultats (3 par page)
let numeroDePage = 1;
for (const page of paginer(agesPairs, 3)) {
  console.log(`=== Page ${numeroDePage} ===`);
  page.forEach((u) => {
    console.log(`- ${u.nom} (age: ${u.age})`);
  });
  console.log();
  numeroDePage++;

  // Afficher seulement les 3 premières pages pour la démo
  if (numeroDePage > 3) {
    console.log("(...et plus)");
    break;
  }
}
```

---

## Navigation

← Fiche précédente : **[Symboles, Map et Set](07-symboles-map-set.md)**

→ Fiche suivante : **[Promises](09-promises.md)**
