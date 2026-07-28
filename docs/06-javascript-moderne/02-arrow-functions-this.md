---
tags:
  - JavaScript
  - Débutant
  - Concept
description: "Comprendre les arrow functions, le retour implicite et la liaison lexicale de this en ES6+."
estimated_time: "60 min"
fiche_number: 2
total_fiches: 14
cursus: "JavaScript Moderne"
---

# 02 - Arrow functions et this

> **En bref** : Comprendre la syntaxe des arrow functions, leur retour implicite et la différence fondamentale avec les fonctions classiques pour la liaison de `this`. Lecture estimée : 60 min.

## Prérequis

- Fiche 01 : [let, const et portée](01-let-const-portee.md)
- Connaître les fonctions classiques JavaScript (`function`)
- Connaître les bases des objets JavaScript

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des arrow functions, comprendre leur retour implicite, et savoir quand les utiliser (et quand ne pas les utiliser) en fonction du comportement de `this`.

---

## Concepts

### Qu'est-ce qu'une arrow function ?

**Définition** : Une arrow function est une syntaxe plus courte pour écrire une fonction en JavaScript, introduite en ES6. Elle s'écrit avec une flèche `=>` au lieu du mot-clé `function`.

**Le problème que les arrow functions résolvent** :

Sans les arrow functions, voici les problèmes rencontrés :

1. **Syntaxe verbeuse** : les fonctions anonymes passées en callback nécessitent beaucoup de caractères (`function() { return ... }`).
2. **Liaison de `this` imprévisible** : dans les fonctions classiques, `this` change selon la façon dont la fonction est appelée, ce qui provoque des bugs fréquents.
3. **Variables intermédiaires** : pour contourner le problème de `this`, les développeurs devaient créer des variables comme `const self = this;`.

**Comment les arrow functions résolvent ces problèmes** :

| Problème | Solution apportée par les arrow functions |
| -------- | ----------------------------------------- |
| Syntaxe verbeuse | Syntaxe courte avec `=>` et retour implicite |
| Liaison de `this` imprévisible | `this` est capturé du contexte englobant (liaison lexicale) |
| Variables intermédiaires | Plus besoin de `const self = this;` |

**Analogie concrète** : Imagine que tu écris une lettre. Une fonction classique est comme une lettre officielle avec en-tête, formule de politesse et signature (beaucoup de formalités). Une arrow function est comme un post-it rapide : tu écris directement l'essentiel. Le post-it n'a pas sa propre adresse (pas de `this` propre) ; il utilise l'adresse de la pièce où il se trouve.

**Ce qu'une arrow function n'est PAS** :

- Une arrow function n'est pas un remplacement universel de `function`. Elle ne peut pas être utilisée comme constructeur (pas de `new`), ni comme méthode d'objet (car `this` ne pointe pas vers l'objet).
- Une arrow function n'est pas "meilleure" qu'une fonction classique. Elle est différente, avec des cas d'utilisation spécifiques.

---

### Les différentes syntaxes d'arrow function

**Définition** : Les arrow functions ont plusieurs formes selon le nombre de paramètres et la complexité du corps.

**Forme complète** :

```javascript
// Forme complète : parenthèses, accolades, return explicite
const additionner = (a, b) => {
  return a + b;
};
```

**Forme avec retour implicite** :

```javascript
// Retour implicite : pas d'accolades, pas de "return"
// Le résultat de l'expression est retourné automatiquement
const additionner = (a, b) => a + b;
```

**Forme avec un seul paramètre** :

```javascript
// Un seul paramètre : les parenthèses sont optionnelles
const doubler = x => x * 2;

// Équivalent avec parenthèses (recommandé pour la lisibilité)
const doubler2 = (x) => x * 2;
```

**Forme sans paramètre** :

```javascript
// Pas de paramètre : les parenthèses sont obligatoires
const direBonjour = () => "Bonjour !";
```

**Retour implicite d'un objet** :

```javascript
// Pour retourner un objet, il faut l'entourer de parenthèses
// Sinon JavaScript confond les accolades de l'objet avec celles du corps de la fonction
const creerUtilisateur = (nom, age) => ({ nom: nom, age: age });

// ❌ Sans parenthèses : JavaScript croit que c'est le corps de la fonction
// const creerUtilisateur = (nom, age) => { nom: nom, age: age }; // Erreur
```

**Tableau récapitulatif des formes** :

| Situation | Syntaxe | Exemple |
| --------- | ------- | ------- |
| Plusieurs paramètres, corps simple | `(a, b) => expression` | `(a, b) => a + b` |
| Plusieurs paramètres, corps complexe | `(a, b) => { ... }` | `(a, b) => { const r = a + b; return r; }` |
| Un seul paramètre, corps simple | `x => expression` | `x => x * 2` |
| Pas de paramètre | `() => expression` | `() => "Bonjour"` |
| Retour d'un objet | `() => ({ ... })` | `() => ({ nom: "Alice" })` |

---

### Qu'est-ce que `this` en JavaScript ?

**Définition** : `this` est un mot-clé spécial qui fait référence à un objet. Cet objet change selon le contexte dans lequel `this` est utilisé.

**Le problème que `this` pose avec les fonctions classiques** :

Sans la liaison lexicale des arrow functions, voici les problèmes rencontrés :

1. **`this` change selon l'appel** : la même fonction peut avoir un `this` différent selon comment elle est appelée.
2. **Perte de `this` dans les callbacks** : quand tu passes une méthode comme callback, `this` ne pointe plus vers l'objet d'origine.
3. **Solutions de contournement** : il faut utiliser `.bind()`, `const self = this;` ou stocker la référence manuellement.

**Comment `this` fonctionne dans une fonction classique** :

| Contexte d'appel | Valeur de `this` |
| ---------------- | ---------------- |
| Appel simple (`maFonction()`) | `undefined` (mode strict) ou `window`/`global` |
| Méthode d'objet (`objet.methode()`) | L'objet qui contient la méthode |
| Constructeur (`new MaClasse()`) | Le nouvel objet créé |
| `.call()` / `.apply()` / `.bind()` | L'objet passé en premier argument |

```javascript
// Démonstration : this change selon le contexte d'appel
const personne = {
  nom: "Alice",
  // Méthode classique : this pointe vers "personne"
  direBonjour: function () {
    console.log("Bonjour, je suis " + this.nom);
  },
};

personne.direBonjour(); // "Bonjour, je suis Alice" - this = personne

// Si on extrait la méthode, this est perdu
const fn = personne.direBonjour;
// fn(); // "Bonjour, je suis undefined" - this n'est plus personne
```

**Analogie concrète** : `this` dans une fonction classique est comme un badge "Visiteur" dans un bâtiment. Le badge change de couleur selon la porte par laquelle tu entres (la façon dont la fonction est appelée). Si tu entres par la porte principale (appel via l'objet), le badge est vert. Si tu entres par la porte de service (appel direct), le badge est rouge. C'est déroutant.

---

### Comment les arrow functions gèrent `this` ?

**Définition** : Les arrow functions n'ont pas leur propre `this`. Elles héritent du `this` du contexte dans lequel elles ont été créées. C'est ce qu'on appelle la liaison lexicale de `this`.

**Le problème que la liaison lexicale résout** :

Sans la liaison lexicale, voici les problèmes rencontrés :

1. **`this` perdu dans les callbacks** : quand tu utilises `setTimeout` ou `addEventListener` dans une méthode, `this` ne pointe plus vers l'objet.
2. **Code verbeux** : tu dois écrire `const self = this;` ou utiliser `.bind(this)`.

**Comment la liaison lexicale résout ces problèmes** :

| Problème | Solution apportée par la liaison lexicale |
| -------- | ----------------------------------------- |
| `this` perdu dans les callbacks | L'arrow function hérite automatiquement du `this` englobant |
| Code verbeux | Plus besoin de `self` ou `.bind()` |

```javascript
// Problème avec une fonction classique dans un callback
const minuteur = {
  secondes: 0,
  demarrer: function () {
    // ❌ Fonction classique : this ne pointe plus vers "minuteur"
    setInterval(function () {
      this.secondes++; // this = undefined ou window, pas minuteur
      console.log(this.secondes); // NaN
    }, 1000);
  },
};

// Solution avec une arrow function
const minuteur2 = {
  secondes: 0,
  demarrer: function () {
    // ✅ Arrow function : this hérite du contexte de "demarrer"
    // Donc this pointe vers minuteur2
    setInterval(() => {
      this.secondes++; // this = minuteur2
      console.log(this.secondes); // 1, 2, 3...
    }, 1000);
  },
};
```

**Analogie concrète** : L'arrow function est comme un employé qui garde toujours le badge de son bureau d'origine, peu importe dans quelle salle de réunion il va. Il ne reçoit pas un nouveau badge à chaque porte (contrairement à une fonction classique).

**Comparaison fonction classique vs arrow function pour `this`** :

| Fonction classique (`function`) | Arrow function (`=>`) |
| ------------------------------- | --------------------- |
| `this` dépend de l'appel | `this` dépend du lieu de création |
| Peut être utilisée comme constructeur | Ne peut pas être utilisée comme constructeur |
| A son propre `arguments` | N'a pas de `arguments` (utilise `...rest`) |
| Peut être utilisée comme méthode d'objet | Ne devrait PAS être utilisée comme méthode d'objet |

---

### Quand utiliser quelle forme ?

**Règles simples** :

| Situation | Forme recommandée | Raison |
| --------- | ------------------ | ------ |
| Callback court (map, filter, forEach) | Arrow function | Syntaxe courte, `this` hérité |
| Méthode d'objet littéral | Fonction classique ou méthode raccourcie | `this` doit pointer vers l'objet |
| Constructeur | Fonction classique ou `class` | Une arrow function ne peut pas être utilisée avec `new` |
| Gestionnaire d'événement DOM | Dépend du besoin en `this` | Si tu veux `this` = élément DOM, utilise `function` |
| Fonction utilitaire pure | Arrow function | Pas besoin de `this` |

---

## Étapes Pratiques

### Étape 1 : Écrire les différentes formes d'arrow function

Crée le fichier `02-arrow-functions.js` :

```javascript
// Forme 1 : plusieurs paramètres, corps avec accolades
const additionner = (a, b) => {
  const resultat = a + b;
  return resultat;
};
console.log("Addition :", additionner(3, 5)); // 8

// Forme 2 : retour implicite (pas d'accolades)
const multiplier = (a, b) => a * b;
console.log("Multiplication :", multiplier(4, 6)); // 24

// Forme 3 : un seul paramètre (parenthèses optionnelles)
const carre = (x) => x * x;
console.log("Carré de 7 :", carre(7)); // 49

// Forme 4 : pas de paramètre
const horodatage = () => new Date().toLocaleTimeString();
console.log("Heure :", horodatage());

// Forme 5 : retour d'un objet (parenthèses autour de l'objet)
const creerProduit = (nom, prix) => ({ nom, prix, enStock: true });
console.log("Produit :", creerProduit("Clavier", 49.99));
```

```bash
node ~/js-moderne/02-arrow-functions.js
```

**Résultat attendu** :

```text
Addition : 8
Multiplication : 24
Carré de 7 : 49
Heure : [heure actuelle]
Produit : { nom: 'Clavier', prix: 49.99, enStock: true }
```

---

### Étape 2 : Utiliser les arrow functions avec les méthodes de tableau

```javascript
// Les arrow functions sont idéales pour les callbacks de tableau
const nombres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// .map() transforme chaque élément
const doubles = nombres.map((n) => n * 2);
console.log("Doubles :", doubles);

// .filter() garde les éléments qui passent le test
const pairs = nombres.filter((n) => n % 2 === 0);
console.log("Pairs :", pairs);

// .reduce() accumule une valeur
const somme = nombres.reduce((acc, n) => acc + n, 0);
console.log("Somme :", somme);

// Chaînage : filtrer puis transformer
const carresPairs = nombres
  .filter((n) => n % 2 === 0) // Garde les pairs : [2, 4, 6, 8, 10]
  .map((n) => n * n); // Calcule le carré : [4, 16, 36, 64, 100]
console.log("Carrés des pairs :", carresPairs);

// .find() trouve le premier élément correspondant
const premierGrand = nombres.find((n) => n > 7);
console.log("Premier > 7 :", premierGrand);

// .some() vérifie si au moins un élément passe le test
const aDesNegatifs = nombres.some((n) => n < 0);
console.log("A des négatifs :", aDesNegatifs);

// .every() vérifie si TOUS les éléments passent le test
const tousPositifs = nombres.every((n) => n > 0);
console.log("Tous positifs :", tousPositifs);
```

```bash
node ~/js-moderne/02-arrow-functions.js
```

**Résultat attendu** :

```text
Doubles : [ 2, 4, 6, 8, 10, 12, 14, 16, 18, 20 ]
Pairs : [ 2, 4, 6, 8, 10 ]
Somme : 55
Carrés des pairs : [ 4, 16, 36, 64, 100 ]
Premier > 7 : 8
A des négatifs : false
Tous positifs : true
```

---

### Étape 3 : Comprendre la liaison lexicale de `this`

```javascript
// Démonstration de la liaison lexicale de this

const compteur = {
  valeur: 0,
  // Méthode classique : this = compteur
  incrementer: function () {
    console.log("Avant :", this.valeur);

    // ❌ Fonction classique dans setTimeout : this est perdu
    // setTimeout(function() {
    //   this.valeur++;
    //   console.log("Après (classique) :", this.valeur); // NaN
    // }, 100);

    // ✅ Arrow function dans setTimeout : this est hérité
    setTimeout(() => {
      this.valeur++; // this = compteur (hérité de la méthode incrementer)
      console.log("Après (arrow) :", this.valeur);
    }, 100);
  },
};

compteur.incrementer();
// Affiche "Avant : 0" immédiatement
// Affiche "Après (arrow) : 1" après 100ms
```

```bash
node ~/js-moderne/02-arrow-functions.js
```

**Résultat attendu** :

```text
Avant : 0
Après (arrow) : 1
```

---

### Étape 4 : Ne PAS utiliser les arrow functions comme méthodes d'objet

```javascript
// ❌ Arrow function comme méthode : this ne pointe pas vers l'objet
const utilisateurMauvais = {
  nom: "Alice",
  direBonjour: () => {
    // this n'est PAS utilisateurMauvais - c'est le this du contexte englobant
    console.log("Bonjour, je suis " + this.nom); // undefined
  },
};
utilisateurMauvais.direBonjour(); // "Bonjour, je suis undefined"

// ✅ Méthode raccourcie ES6 : this pointe vers l'objet
const utilisateurBon = {
  nom: "Alice",
  // Syntaxe raccourcie ES6 (équivalent à direBonjour: function() {...})
  direBonjour() {
    console.log("Bonjour, je suis " + this.nom); // "Alice"
  },
};
utilisateurBon.direBonjour(); // "Bonjour, je suis Alice"
```

```bash
node ~/js-moderne/02-arrow-functions.js
```

**Résultat attendu** :

```text
Bonjour, je suis undefined
Bonjour, je suis Alice
```

---

### Étape 5 : Arrow functions et `arguments`

```javascript
// Les arrow functions n'ont pas d'objet "arguments"

// Fonction classique : a accès à "arguments"
function sommeClassique() {
  // "arguments" est un objet semblable à un tableau contenant tous les arguments
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
console.log("Somme classique :", sommeClassique(1, 2, 3, 4)); // 10

// Arrow function : utilise le rest parameter (...args)
const sommeArrow = (...args) => {
  // "args" est un vrai tableau (pas un objet semblable à un tableau)
  return args.reduce((acc, n) => acc + n, 0);
};
console.log("Somme arrow :", sommeArrow(1, 2, 3, 4)); // 10

// L'avantage de ...args : c'est un vrai tableau
// On peut utiliser directement .reduce(), .map(), etc.
// Avec "arguments", il fallait d'abord convertir :
// Array.from(arguments) ou [...arguments]
```

```bash
node ~/js-moderne/02-arrow-functions.js
```

**Résultat attendu** :

```text
Somme classique : 10
Somme arrow : 10
```

---

### Étape 6 : Arrow functions avec tri et comparaison

```javascript
// Les arrow functions rendent les tris très lisibles

const fruits = ["banane", "cerise", "abricot", "datte", "figue"];

// Tri alphabétique
const triAlpha = [...fruits].sort((a, b) => a.localeCompare(b));
console.log("Tri alphabétique :", triAlpha);

// Tri par longueur de mot
const triLongueur = [...fruits].sort((a, b) => a.length - b.length);
console.log("Tri par longueur :", triLongueur);

// Tri d'objets par propriété
const produits = [
  { nom: "Clavier", prix: 49.99 },
  { nom: "Souris", prix: 29.99 },
  { nom: "Écran", prix: 299.99 },
  { nom: "Casque", prix: 79.99 },
];

// Tri par prix croissant
const triPrix = [...produits].sort((a, b) => a.prix - b.prix);
console.log(
  "Tri par prix :",
  triPrix.map((p) => `${p.nom} (${p.prix} €)`)
);

// Tri par nom
const triNom = [...produits].sort((a, b) => a.nom.localeCompare(b.nom));
console.log(
  "Tri par nom :",
  triNom.map((p) => p.nom)
);
```

```bash
node ~/js-moderne/02-arrow-functions.js
```

**Résultat attendu** :

```text
Tri alphabétique : [ 'abricot', 'banane', 'cerise', 'datte', 'figue' ]
Tri par longueur : [ 'datte', 'figue', 'banane', 'cerise', 'abricot' ]
Tri par prix : [ 'Souris (29.99 €)', 'Clavier (49.99 €)', 'Casque (79.99 €)', 'Écran (299.99 €)' ]
Tri par nom : [ 'Casque', 'Clavier', 'Souris', 'Écran' ]
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `node fichier.js` | Exécute un fichier JavaScript avec Node.js |
| `const fn = (x) => x * 2` | Arrow function avec un paramètre |
| `const fn = () => "texte"` | Arrow function sans paramètre |
| `const fn = (a, b) => ({ a, b })` | Arrow function qui retourne un objet |
| `tableau.map(x => x * 2)` | Transformation de tableau avec arrow function |

---

## Pièges Fréquents

### Piège 1 : Utiliser une arrow function comme méthode d'objet

**Problème** : Tu utilises une arrow function pour définir une méthode d'objet, et `this` ne pointe pas vers l'objet.

**Solution** : Utilise la syntaxe raccourcie ES6 (`methode() { ... }`) pour les méthodes d'objet.

```javascript
// ❌ Arrow function comme méthode
const obj = {
  valeur: 42,
  getValeur: () => this.valeur, // this n'est pas obj
};

// ✅ Méthode raccourcie ES6
const obj2 = {
  valeur: 42,
  getValeur() {
    return this.valeur;
  }, // this est obj2
};
```

---

### Piège 2 : Oublier les parenthèses pour retourner un objet

**Problème** : Tu écris `() => { nom: "Alice" }` en pensant retourner un objet, mais JavaScript interprète les accolades comme le corps de la fonction.

**Solution** : Entoure l'objet de parenthèses : `() => ({ nom: "Alice" })`.

```javascript
// ❌ Retourne undefined (les accolades sont le corps de la fonction)
const mauvais = () => {
  nom: "Alice";
};
console.log(mauvais()); // undefined

// ✅ Retourne l'objet (parenthèses autour de l'objet)
const bon = () => ({ nom: "Alice" });
console.log(bon()); // { nom: "Alice" }
```

---

### Piège 3 : Vouloir utiliser `new` avec une arrow function

**Problème** : Tu essaies de créer une instance avec `new` sur une arrow function.

**Solution** : Utilise une fonction classique ou une classe ES6 pour les constructeurs.

```javascript
// ❌ Arrow function ne peut pas être un constructeur
const Personne = (nom) => {
  this.nom = nom;
};
// new Personne("Alice"); // TypeError: Personne is not a constructor

// ✅ Classe ES6 ou fonction classique
class PersonneOK {
  constructor(nom) {
    this.nom = nom;
  }
}
const alice = new PersonneOK("Alice");
```

---

### Piège 4 : Confondre retour implicite et corps de fonction

**Problème** : Tu veux écrire plusieurs instructions avec un retour implicite.

**Solution** : Le retour implicite ne fonctionne qu'avec une seule expression. Pour plusieurs instructions, utilise des accolades et un `return` explicite.

```javascript
// ❌ Plusieurs instructions sans accolades : erreur de syntaxe
// const fn = (x) => const y = x * 2; return y;

// ✅ Plusieurs instructions : accolades + return
const fn = (x) => {
  const y = x * 2;
  return y;
};
```

---

## Checklist de Validation

- [ ] Je sais écrire une arrow function avec retour implicite
- [ ] Je sais retourner un objet avec des parenthèses `() => ({ ... })`
- [ ] Je comprends que les arrow functions héritent du `this` englobant
- [ ] Je sais que les arrow functions ne doivent pas être utilisées comme méthodes d'objet
- [ ] Je sais que les arrow functions ne peuvent pas être des constructeurs
- [ ] Je sais utiliser `...args` au lieu de `arguments` dans les arrow functions
- [ ] J'utilise les arrow functions pour les callbacks de tableau (map, filter, reduce)

---

## Exercice Pratique

**Énoncé** : Crée un programme de gestion de notes d'étudiants.

1. Crée un tableau d'objets `{ nom, notes }` pour 4 étudiants (chaque étudiant a un tableau de 3 notes).
2. Utilise `.map()` avec une arrow function pour calculer la moyenne de chaque étudiant.
3. Utilise `.filter()` pour garder les étudiants avec une moyenne supérieure ou égale à 10.
4. Utilise `.sort()` pour trier les résultats par moyenne décroissante.
5. Affiche le classement final.

**Indications** :

- Utilise `const` pour toutes les variables sauf si la réaffectation est nécessaire.
- Utilise les arrow functions pour chaque callback.
- La moyenne se calcule avec `.reduce()` : `notes.reduce((acc, n) => acc + n, 0) / notes.length`.

**Résultat attendu** :

```text
=== Résultats ===
1. Alice - Moyenne : 15.33/20
2. Charlie - Moyenne : 12.00/20
3. Diana - Moyenne : 10.33/20
=== Étudiants sous la moyenne ===
Bob - Moyenne : 8.67/20
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// Données : 4 étudiants avec leurs notes
const etudiants = [
  { nom: "Alice", notes: [14, 16, 16] },
  { nom: "Bob", notes: [7, 9, 10] },
  { nom: "Charlie", notes: [12, 11, 13] },
  { nom: "Diana", notes: [9, 11, 11] },
];

// Étape 1 : Calculer la moyenne de chaque étudiant avec .map()
const avecMoyennes = etudiants.map((etudiant) => ({
  nom: etudiant.nom,
  // reduce additionne toutes les notes, puis on divise par le nombre de notes
  moyenne: etudiant.notes.reduce((acc, n) => acc + n, 0) / etudiant.notes.length,
}));

// Étape 2 : Filtrer les étudiants avec une moyenne >= 10
const audessus = avecMoyennes.filter((e) => e.moyenne >= 10);

// Étape 3 : Filtrer les étudiants avec une moyenne < 10
const endessous = avecMoyennes.filter((e) => e.moyenne < 10);

// Étape 4 : Trier par moyenne décroissante
const classement = audessus.sort((a, b) => b.moyenne - a.moyenne);

// Étape 5 : Affichage du classement
console.log("=== Résultats ===");
classement.forEach((etudiant, index) => {
  // toFixed(2) arrondit à 2 décimales
  console.log(`${index + 1}. ${etudiant.nom} - Moyenne : ${etudiant.moyenne.toFixed(2)}/20`);
});

// Affichage des étudiants sous la moyenne
console.log("=== Étudiants sous la moyenne ===");
endessous.forEach((etudiant) => {
  console.log(`${etudiant.nom} - Moyenne : ${etudiant.moyenne.toFixed(2)}/20`);
});
```

---

## Navigation

← Fiche précédente : **[let, const et portée](01-let-const-portee.md)**

→ Fiche suivante : **[Destructuring et spread](03-destructuring-spread.md)**
