---
tags:
  - Référence
  - JavaScript
description: "Aide-mémoire JavaScript ES6+ : syntaxe moderne et fonctions courantes"
estimated_time: "20 min"
fiche_number: 8
total_fiches: 18
cursus: "Fiches de référence"
---

# Aide-mémoire JavaScript ES6+

> **En bref** : Aide-mémoire JavaScript ES6+. Lecture estimée : 20 min.

Fiche de référence rapide pour la syntaxe JavaScript moderne (ES6+).

---

## Déclaration de variables

| Mot-clé | Portée | Réassignable | Quand l'utiliser |
| ------- | ------ | ------------ | ---------------- |
| `const` | Bloc | Non | Par défaut |
| `let` | Bloc | Oui | Quand la valeur change |
| `var` | Fonction | Oui | A éviter |

---

## Fonctions fléchées

```javascript
// Fonction classique
function add(a, b) {
  return a + b;
}

// Fonction fléchée
const add = (a, b) => a + b;

// Avec un corps de fonction
const greet = (name) => {
  const message = `Bonjour ${name}`;
  return message;
};
```

---

## Destructuring

### Objets

```javascript
const user = { name: "Alex", age: 25, email: "alex@example.com" };

// Extraire des propriétés
const { name, age } = user;

// Renommer
const { name: userName } = user;

// Valeur par défaut
const { role = "user" } = user;
```

### Tableaux

```javascript
const colors = ["rouge", "vert", "bleu"];

const [first, second] = colors;
const [, , third] = colors; // Ignorer des éléments
const [head, ...rest] = colors; // rest = ["vert", "bleu"]
```

---

## Spread et Rest

```javascript
// Spread : décomposer un tableau ou un objet
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]

const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }

// Rest : collecter les arguments restants
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
```

---

## Template literals

```javascript
const name = "Alex";
const age = 25;

// Interpolation
const message = `Bonjour ${name}, tu as ${age} ans`;

// Multi-ligne
const html = `
  <div>
    <p>${message}</p>
  </div>
`;
```

---

## Méthodes de tableau

| Méthode | Action | Retourne |
| ------- | ------ | -------- |
| `map(fn)` | Transforme chaque élément | Nouveau tableau |
| `filter(fn)` | Garde les éléments qui passent le test | Nouveau tableau |
| `reduce(fn, init)` | Accumule les éléments en une valeur | Valeur unique |
| `find(fn)` | Trouve le premier élément qui passe le test | Elément ou `undefined` |
| `findIndex(fn)` | Trouve l'index du premier élément | Index ou `-1` |
| `some(fn)` | Au moins un élément passe le test | `boolean` |
| `every(fn)` | Tous les éléments passent le test | `boolean` |
| `includes(val)` | Vérifie si la valeur existe | `boolean` |
| `forEach(fn)` | Exécute une fonction sur chaque élément | `undefined` |
| `flat(depth)` | Aplatit les sous-tableaux | Nouveau tableau |
| `sort(fn)` | Trie le tableau (en place) | Le tableau trié |

### Exemples

```javascript
const numbers = [1, 2, 3, 4, 5];

// map : doubler chaque nombre
const doubled = numbers.map((n) => n * 2); // [2, 4, 6, 8, 10]

// filter : garder les pairs
const evens = numbers.filter((n) => n % 2 === 0); // [2, 4]

// reduce : somme
const sum = numbers.reduce((total, n) => total + n, 0); // 15

// find : premier nombre > 3
const found = numbers.find((n) => n > 3); // 4

// Chaînage
const result = numbers
  .filter((n) => n > 2)
  .map((n) => n * 10); // [30, 40, 50]
```

---

## Promesses et async/await

### Promesses

```javascript
// Créer une promesse
const promise = new Promise((resolve, reject) => {
  // Opération asynchrone
  resolve("succès");
});

// Consommer une promesse
promise
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => console.log("terminé"));
```

### async/await

```javascript
// Fonction asynchrone
async function fetchUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Erreur :", error);
  }
}

// Appels parallèles
const [users, posts] = await Promise.all([
  fetch("/api/users").then((r) => r.json()),
  fetch("/api/posts").then((r) => r.json()),
]);
```

---

## Fetch API

```javascript
// GET
const response = await fetch("/api/users");
const data = await response.json();

// POST
const response = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Alex", email: "alex@example.com" }),
});

// Vérifier le statut
if (!response.ok) {
  throw new Error(`Erreur HTTP : ${response.status}`);
}
```

---

## Optional chaining et nullish coalescing

```javascript
// Optional chaining (?.)
const city = user?.address?.city; // undefined si un maillon manque

// Nullish coalescing (??)
const name = user.name ?? "Anonyme"; // "Anonyme" si null ou undefined

// Combinaison
const street = user?.address?.street ?? "Adresse inconnue";
```

---

## Modules (import/export)

```javascript
// Export nommé
export const API_URL = "/api";
export function fetchUsers() { /* ... */ }

// Export par défaut
export default class UserService { /* ... */ }

// Import nommé
import { API_URL, fetchUsers } from "./api.js";

// Import par défaut
import UserService from "./UserService.js";

// Import avec renommage
import { fetchUsers as getUsers } from "./api.js";
```

---

## Navigation

← Fiche précédente : **[Aide-mémoire PHP](07-aide-memoire-php.md)**

→ Fiche suivante : **[Aide-mémoire React](09-aide-memoire-react.md)**
