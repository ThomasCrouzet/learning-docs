---
tags:
  - JavaScript
  - Débutant
  - Pratique
description: "Variables et fonctions"
estimated_time: "40 min"
fiche_number: 2
total_fiches: 4
cursus: "JavaScript"
---

# 02 - Variables et fonctions

> **En bref** : À la fin de cette fiche, tu sauras déclarer des variables, utiliser les types de données et créer des fonctions en JavaScript. Lecture estimée : 40 min.


## Prérequis

- Fiche [05-javascript/01 - Introduction à JavaScript](01-introduction-js.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déclarer des variables, utiliser les types de données et créer des fonctions en JavaScript.

---

## Concepts

### Les variables

**Définition** : Une variable est un conteneur nommé qui stocke une valeur.

**Analogie concrète** : Une variable est comme une boîte étiquetée dans un entrepôt. L'étiquette est le nom de la variable (`age`), et le contenu de la boîte est la valeur (`25`). Avec `let`, tu peux changer le contenu de la boîte quand tu veux. Avec `const`, le contenu est scellé : une fois rempli, tu ne peux plus le modifier.

**Déclaration avec let** :

```javascript
let nom = "Alice";    // Variable qui peut changer
let age = 25;
age = 26;             // OK : on peut modifier
```

**Déclaration avec const** :

```javascript
const PI = 3.14159;   // Constante : ne peut pas changer
PI = 3;               // ERREUR : impossible de modifier
```

**Règles de nommage** :

| Règle | Exemple valide | Exemple invalide |
| ----- | -------------- | ---------------- |
| Commence par lettre, _ ou `$` | `nom`, `_id`, `$prix` | `1nombre` |
| Pas d'espaces | `monNom` | `mon nom` |
| Pas de mots réservés | `maVariable` | `let`, `function` |
| Sensible à la casse | `nom` ≠ `Nom` | - |

**Convention** : camelCase (première lettre minuscule, majuscule pour chaque mot suivant).

```javascript
let prenomUtilisateur = "Alice";
let dateDeNaissance = "1999-05-15";
```

---

### Les types de données

**Types primitifs** :

| Type | Description | Exemple |
| ---- | ----------- | ------- |
| `string` | Chaîne de caractères | `"Hello"`, `'World'` |
| `number` | Nombre (entier ou décimal) | `42`, `3.14` |
| `boolean` | Vrai ou faux | `true`, `false` |
| `undefined` | Variable non définie | `let x;` |
| `null` | Absence de valeur | `let x = null;` |

**Vérifier le type** :

```javascript
console.log(typeof "Hello");   // "string"
console.log(typeof 42);        // "number"
console.log(typeof true);      // "boolean"
```

**Les chaînes de caractères** :

```javascript
// Trois façons de créer une chaîne
let simple = 'Guillemets simples';
let double = "Guillemets doubles";
let template = `Backticks (template literals)`;

// Concaténation
let prenom = "Alice";
let message = "Bonjour " + prenom;     // "Bonjour Alice"

// Template literals (recommandé)
let age = 25;
let phrase = `${prenom} a ${age} ans`; // "Alice a 25 ans"
```

**Les nombres** :

```javascript
let entier = 42;
let decimal = 3.14;

// Opérations
console.log(10 + 5);    // 15
console.log(10 - 5);    // 5
console.log(10 * 5);    // 50
console.log(10 / 5);    // 2
console.log(10 % 3);    // 1 (modulo : reste de la division)
```

**Les booléens** :

```javascript
let estMajeur = true;
let estConnecte = false;

// Comparaisons retournent des booléens
console.log(5 > 3);     // true
console.log(5 === 3);   // false
console.log(5 !== 3);   // true
```

---

### Les opérateurs de comparaison

| Opérateur | Description | Exemple |
| --------- | ----------- | ------- |
| `==` | Égal (valeur) | `5 == "5"` → true |
| `===` | Égal strict (valeur ET type) | `5 === "5"` → false |
| `!=` | Différent (valeur) | `5 != 3` → true |
| `!==` | Différent strict | `5 !== "5"` → true |
| `>` | Supérieur | `5 > 3` → true |
| `<` | Inférieur | `5 < 3` → false |
| `>=` | Supérieur ou égal | `5 >= 5` → true |
| `<=` | Inférieur ou égal | `5 <= 3` → false |

**Recommandation** : Toujours utiliser `===` et `!==` pour éviter les conversions implicites.

---

### Les fonctions

**Définition** : Une fonction est un bloc de code réutilisable qui effectue une tâche.

**Analogie concrète** : Une fonction est comme une recette de cuisine. La recette "Faire une omelette" prend des ingrédients en entrée (oeufs, sel) et produit un résultat (l'omelette). Tu l'écris une fois, et tu peux la réutiliser autant de fois que tu veux avec des ingrédients différents.

**Déclaration de fonction** :

```javascript
function direBonjour() {
    console.log("Bonjour !");
}

// Appel de la fonction
direBonjour();  // Affiche "Bonjour !"
```

**Fonction avec paramètres** :

```javascript
function saluer(prenom) {
    console.log("Bonjour " + prenom);
}

saluer("Alice");  // "Bonjour Alice"
saluer("Bob");    // "Bonjour Bob"
```

**Fonction avec valeur de retour** :

```javascript
function additionner(a, b) {
    return a + b;
}

let resultat = additionner(5, 3);
console.log(resultat);  // 8
```

**Fonctions fléchées (arrow functions)** :

```javascript
// Syntaxe classique
function carre(x) {
    return x * x;
}

// Syntaxe fléchée
const carre = (x) => {
    return x * x;
};

// Syntaxe fléchée courte (une seule expression)
const carre = (x) => x * x;

// Sans paramètre
const direHello = () => console.log("Hello");

// Un seul paramètre (parenthèses optionnelles)
const double = x => x * 2;
```

---

### Les tableaux (arrays)

**Définition** : Un tableau est une liste ordonnée de valeurs.

**Analogie concrète** : Un tableau est comme un train avec des wagons numérotés. Chaque wagon (index 0, 1, 2...) contient un passager (une valeur). Tu peux ajouter un wagon à la fin (`push`), retirer le dernier (`pop`), ou vérifier qui est dans le wagon numéro 2 (`fruits[2]`).

```javascript
let fruits = ["pomme", "banane", "orange"];
let nombres = [1, 2, 3, 4, 5];
let mixte = ["texte", 42, true];

// Accéder aux éléments (index commence à 0)
console.log(fruits[0]);  // "pomme"
console.log(fruits[1]);  // "banane"

// Modifier un élément
fruits[0] = "fraise";

// Longueur du tableau
console.log(fruits.length);  // 3
```

**Méthodes courantes** :

| Méthode | Description | Exemple |
| ------- | ----------- | ------- |
| `push()` | Ajoute à la fin | `fruits.push("kiwi")` |
| `pop()` | Retire le dernier | `fruits.pop()` |
| `shift()` | Retire le premier | `fruits.shift()` |
| `unshift()` | Ajoute au début | `fruits.unshift("citron")` |
| `indexOf()` | Trouve l'index | `fruits.indexOf("banane")` |
| `includes()` | Vérifie la présence | `fruits.includes("pomme")` |

---

### Les objets

**Définition** : Un objet est une collection de propriétés (paires clé-valeur).

**Analogie concrète** : Un objet est comme une fiche de contact dans un carnet d'adresses. Chaque fiche a des champs étiquetés : "Nom", "Téléphone", "Adresse". En JavaScript, ces étiquettes sont les clés (`prenom`, `age`, `ville`) et les informations écrites dessus sont les valeurs (`"Alice"`, `25`, `"Lyon"`).

```javascript
let personne = {
    prenom: "Alice",
    age: 25,
    ville: "Lyon"
};

// Accéder aux propriétés
console.log(personne.prenom);     // "Alice"
console.log(personne["age"]);     // 25

// Modifier une propriété
personne.age = 26;

// Ajouter une propriété
personne.email = "alice@example.com";
```

---

## Étapes Pratiques

### Script complet

```javascript
// Variables
let prenom = "Alice";
const AGE_MINIMUM = 18;

// Fonction
function estMajeur(age) {
    return age >= AGE_MINIMUM;
}

// Utilisation
let age = 25;
console.log(`${prenom} a ${age} ans`);

if (estMajeur(age)) {
    console.log("Cette personne est majeure");
} else {
    console.log("Cette personne est mineure");
}

// Tableau
let notes = [15, 12, 18, 14];
let somme = 0;
for (let i = 0; i < notes.length; i++) {
    somme += notes[i];
}
let moyenne = somme / notes.length;
console.log("Moyenne:", moyenne);

// Objet
let etudiant = {
    nom: prenom,
    notes: notes,
    moyenne: moyenne
};
console.log(etudiant);
```

---

## Pièges Fréquents

### Piège 1 : var vs let

⚠️ **Problème** : `var` a une portée différente et peut causer des bugs.

✅ **Solution** : Toujours utiliser `let` ou `const`.

### Piège 2 : Oublier return dans une fonction

⚠️ **Problème** : La fonction retourne `undefined`.

```javascript
function additionner(a, b) {
    a + b;  // Oubli de return
}
console.log(additionner(2, 3));  // undefined
```

✅ **Solution** : Toujours mettre `return` si on veut récupérer une valeur.

### Piège 3 : Confondre = et ===

⚠️ **Problème** : Utiliser `=` au lieu de `===` dans une condition.

```javascript
// ❌ Incorrect (affectation)
if (x = 5) { }

// ✅ Correct (comparaison)
if (x === 5) { }
```

---

## Checklist de Validation

- [ ] Je sais déclarer des variables avec `let` et `const`
- [ ] Je connais les types de données de base
- [ ] Je sais créer et appeler une fonction
- [ ] Je sais utiliser les paramètres et return
- [ ] Je sais manipuler les tableaux et les objets

---

## Exercice Pratique

**Énoncé** : Créer un mini-calculateur. Écrire 4 fonctions (`addition`, `soustraction`, `multiplication`, `division`) et une fonction `calculer(a, operateur, b)` qui utilise un `switch` pour appeler la bonne fonction. Tester chaque opération avec `console.log`. Gérer le cas de la division par zéro.

**Indications** :

- Chaque fonction prend deux paramètres et retourne le résultat
- La fonction `calculer` prend 3 paramètres : le premier nombre, l'opérateur sous forme de chaîne (`"+"`, `"-"`, `"*"`, `"/"`), et le deuxième nombre
- Utiliser un `switch` sur l'opérateur pour choisir quelle fonction appeler
- Si l'opérateur est inconnu, retourner un message d'erreur

**Résultat attendu** : `calculer(10, "+", 5)` affiche `15`, `calculer(10, "/", 0)` affiche un message d'erreur.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// Fonction addition : retourne la somme de a et b
function addition(a, b) {
    return a + b;
}

// Fonction soustraction : retourne la différence de a et b
function soustraction(a, b) {
    return a - b;
}

// Fonction multiplication : retourne le produit de a et b
function multiplication(a, b) {
    return a * b;
}

// Fonction division : retourne le quotient de a et b
// Gère le cas où b vaut 0
function division(a, b) {
    if (b === 0) {
        return "Erreur : division par zéro impossible";
    }
    return a / b;
}

// Fonction principale : appelle la bonne opération selon l'opérateur
function calculer(a, operateur, b) {
    switch (operateur) {
        case "+":
            return addition(a, b);
        case "-":
            return soustraction(a, b);
        case "*":
            return multiplication(a, b);
        case "/":
            return division(a, b);
        default:
            return "Erreur : opérateur inconnu (" + operateur + ")";
    }
}

// Tests de chaque opération
console.log("10 + 5 =", calculer(10, "+", 5));   // 15
console.log("10 - 5 =", calculer(10, "-", 5));   // 5
console.log("10 * 5 =", calculer(10, "*", 5));   // 50
console.log("10 / 5 =", calculer(10, "/", 5));   // 2
console.log("10 / 0 =", calculer(10, "/", 0));   // Erreur : division par zéro impossible
console.log("10 % 5 =", calculer(10, "%", 5));   // Erreur : opérateur inconnu (%)
```

**Résultat attendu dans la console** :

```text
10 + 5 = 15
10 - 5 = 5
10 * 5 = 50
10 / 5 = 2
10 / 0 = Erreur : division par zéro impossible
10 % 5 = Erreur : opérateur inconnu (%)
```

---

## Navigation

← Fiche précédente : **[Introduction à JavaScript](01-introduction-js.md)**

→ Fiche suivante : **[Manipulation du DOM](03-dom-manipulation.md)**
