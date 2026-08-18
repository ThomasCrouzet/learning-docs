---
tags:
  - JavaScript
  - Débutant
  - Concept
description: "Comprendre let, const et la portée des variables en JavaScript moderne (ES6+)."
estimated_time: "60 min"
fiche_number: 1
total_fiches: 14
cursus: "JavaScript Moderne"
---

# 01 - let, const et portée

> **En bref** : Comprendre les trois mots-clés de déclaration de variables (`var`, `let`, `const`), leurs différences de portée et savoir lequel utiliser. Lecture estimée : 60 min.

## Prérequis

- Connaître les bases de JavaScript : variables, types, fonctions, boucles
- Avoir suivi le [cursus JavaScript Stack Symfony](../05-javascript/index.md) ou [JavaScript Epitech](../epitech/05-javascript/index.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déclarer des variables avec `let` et `const`, comprendre la portée par bloc, et choisir le bon mot-clé selon le contexte.

---

## Concepts

### Qu'est-ce que la portée (scope) ?

**Définition** : La portée est la zone du code dans laquelle une variable est accessible. En dehors de cette zone, la variable n'existe pas.

**Le problème que la portée résout** :

Sans portée, voici les problèmes rencontrés :

1. **Conflits de noms** : deux parties du code utilisent le même nom de variable et se perturbent mutuellement.
2. **Fuites de données** : une variable temporaire reste accessible partout dans le programme, ce qui rend le code imprévisible.
3. **Débogage difficile** : impossible de savoir quelle partie du code a modifié une variable si elle est accessible partout.

**Comment la portée résout ces problèmes** :

| Problème | Solution apportée par la portée |
| -------- | ------------------------------- |
| Conflits de noms | Chaque bloc a ses propres variables, isolées des autres blocs |
| Fuites de données | Une variable déclarée dans un bloc disparaît à la fin de ce bloc |
| Débogage difficile | On sait exactement où une variable peut être modifiée |

**Analogie concrète** : Imagine un immeuble avec des appartements. Chaque appartement est un bloc de code. Les objets dans un appartement (variables locales) ne sont pas visibles depuis un autre appartement. Seuls les objets dans les parties communes (variables globales) sont accessibles par tous.

**Ce que la portée n'est PAS** :

- La portée n'est pas la durée de vie d'une variable. La durée de vie concerne le moment où la mémoire est libérée. La portée concerne les endroits du code où la variable est utilisable.
- La portée n'est pas le type de la variable. Le type (`string`, `number`) décrit la valeur stockée. La portée décrit où cette valeur est accessible.

---

### Qu'est-ce que `var` et pourquoi l'éviter ?

**Définition** : `var` est le mot-clé historique de JavaScript pour déclarer une variable. Il a une portée de fonction (function scope) : la variable est accessible dans toute la fonction où elle est déclarée.

**Le problème que `var` pose** :

Sans alternative à `var`, voici les problèmes rencontrés :

1. **Portée trop large** : une variable déclarée dans un `if` ou une boucle `for` est accessible en dehors de ce bloc.
2. **Hoisting silencieux** : `var` remonte la déclaration en haut de la fonction, ce qui permet d'utiliser une variable avant sa ligne de déclaration (elle vaut `undefined`).
3. **Redéclaration autorisée** : on peut déclarer deux fois la même variable avec `var` sans erreur, ce qui masque des bugs.

**Exemple du problème de portée avec `var`** :

```javascript
// Problème : la variable "i" fuit hors de la boucle
for (var i = 0; i < 3; i++) {
  // "i" est censée n'exister que dans la boucle
}

console.log(i); // 3 - "i" est encore accessible ici, ce qui est inattendu
```

**Exemple du hoisting avec `var`** :

```javascript
// Le hoisting remonte la déclaration (pas l'affectation) en haut de la fonction
console.log(nom); // undefined - pas d'erreur, mais valeur inattendue
var nom = "Alice";

// Ce que JavaScript exécute réellement :
// var nom;           <-- déclaration remontée
// console.log(nom);  <-- undefined
// nom = "Alice";     <-- affectation reste à sa place
```

**Analogie concrète** : `var` est comme un badge d'accès qui ouvre toutes les portes d'un étage entier (la fonction). Même si tu l'as obtenu dans la salle de réunion (un bloc `if`), tu peux l'utiliser dans le couloir et les autres salles. Ce n'est pas toujours souhaitable.

---

Le diagramme suivant montre comment la portée par bloc fonctionne avec `let`/`const` par rapport à `var`.

<div class="diagram-design">
<p><a href="../../diagrams/06-javascript-moderne-01-let-const-portée-1.html">Qu&#x27;est-ce que `var` et pourquoi l&#x27;éviter ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/06-javascript-moderne-01-let-const-portée-1.html" title="Qu&#x27;est-ce que `var` et pourquoi l&#x27;éviter ?" style="width:100%;min-height:448px;border:0;background:transparent"></iframe>
</div>

### Qu'est-ce que `let` ?

**Définition** : `let` est le mot-clé ES6 pour déclarer une variable dont la valeur peut changer. Il a une portée de bloc (block scope) : la variable n'est accessible que dans le bloc `{}` où elle est déclarée.

**Le problème que `let` résout** :

Sans `let`, voici les problèmes rencontrés :

1. **Variables qui fuient hors des blocs** : avec `var`, une variable déclarée dans un `if` ou un `for` est accessible en dehors.
2. **Hoisting trompeur** : avec `var`, la variable existe avant sa déclaration avec la valeur `undefined`.
3. **Redéclaration accidentelle** : avec `var`, on peut redéclarer la même variable sans erreur.

**Comment `let` résout ces problèmes** :

| Problème | Solution apportée par `let` |
| -------- | --------------------------- |
| Variables qui fuient | `let` limite la variable au bloc `{}` le plus proche |
| Hoisting trompeur | `let` crée une "temporal dead zone" : utiliser la variable avant sa déclaration provoque une erreur |
| Redéclaration accidentelle | `let` interdit de déclarer deux fois la même variable dans le même bloc |

**Exemple de portée de bloc avec `let`** :

```javascript
// "let" limite la variable au bloc où elle est déclarée
for (let i = 0; i < 3; i++) {
  // "i" n'existe que dans cette boucle
  console.log(i); // 0, 1, 2
}

// console.log(i); // ReferenceError: i is not defined
// "i" n'existe plus ici - c'est le comportement attendu
```

**Ce que `let` n'est PAS** :

- `let` ne rend pas la variable constante. La valeur peut changer avec une nouvelle affectation (`let x = 1; x = 2;` est valide).
- `let` n'empêche pas la modification du contenu d'un objet ou d'un tableau. Seule la réaffectation de la variable elle-même est permise.

---

### Qu'est-ce que `const` ?

**Définition** : `const` est le mot-clé ES6 pour déclarer une variable dont la référence ne peut pas être réaffectée. Comme `let`, il a une portée de bloc.

**Le problème que `const` résout** :

Sans `const`, voici les problèmes rencontrés :

1. **Réaffectation accidentelle** : rien n'empêche de réaffecter une variable qui ne devrait pas changer.
2. **Intention floue** : en lisant le code, on ne sait pas si une variable est censée changer ou rester fixe.
3. **Bugs silencieux** : une réaffectation accidentelle ne provoque aucune erreur avec `var` ou `let`.

**Comment `const` résout ces problèmes** :

| Problème | Solution apportée par `const` |
| -------- | ----------------------------- |
| Réaffectation accidentelle | `const` provoque une erreur si on tente de réaffecter la variable |
| Intention floue | `const` signale clairement que la référence ne changera pas |
| Bugs silencieux | L'erreur est immédiate et explicite : `TypeError: Assignment to constant variable` |

**Point important** : `const` empêche la réaffectation de la référence, mais pas la modification du contenu.

```javascript
// const empêche la réaffectation
const nom = "Alice";
// nom = "Bob"; // TypeError: Assignment to constant variable

// Mais const n'empêche PAS la modification du contenu d'un objet
const utilisateur = { nom: "Alice", age: 25 };
utilisateur.age = 26; // Valide - on modifie une propriété, pas la référence
console.log(utilisateur.age); // 26

// Même chose pour les tableaux
const fruits = ["pomme", "banane"];
fruits.push("cerise"); // Valide - on modifie le contenu du tableau
console.log(fruits); // ["pomme", "banane", "cerise"]

// Mais on ne peut pas réaffecter le tableau entier
// fruits = ["kiwi"]; // TypeError: Assignment to constant variable
```

**Analogie concrète** : `const` est comme une étiquette collée sur une boîte. L'étiquette est fixe : tu ne peux pas la décoller pour la mettre sur une autre boîte (réaffectation interdite). Mais tu peux ouvrir la boîte et changer ce qu'il y a dedans (modification du contenu autorisée).

**Ce que `const` n'est PAS** :

- `const` ne rend pas la valeur immuable. Un objet déclaré avec `const` peut voir ses propriétés modifiées. Pour rendre un objet réellement immuable, il faut utiliser `Object.freeze()`.
- `const` n'est pas réservé aux "constantes mathématiques" comme `PI`. En JavaScript moderne, `const` est le choix par défaut pour toute variable dont la référence ne change pas.

**Comparaison `let` vs `const`** :

| `let` | `const` |
| ----- | ------- |
| Réaffectation autorisée | Réaffectation interdite |
| Pour les valeurs qui changent (compteurs, résultats de calcul) | Pour les valeurs qui ne sont pas réaffectées (la plupart des cas) |
| Portée de bloc | Portée de bloc |
| Pas de hoisting utilisable (temporal dead zone) | Pas de hoisting utilisable (temporal dead zone) |

---

### Qu'est-ce que la Temporal Dead Zone (TDZ) ?

**Définition** : La Temporal Dead Zone est la période entre l'entrée dans un bloc et la ligne de déclaration d'une variable `let` ou `const`. Pendant cette période, la variable existe mais est inaccessible.

**Le problème que la TDZ résout** :

Sans la TDZ, voici les problèmes rencontrés :

1. **Utilisation avant déclaration** : avec `var`, on peut utiliser une variable avant sa déclaration et obtenir `undefined` sans erreur.
2. **Bugs cachés** : le code semble fonctionner mais produit des résultats incorrects.

**Comment la TDZ résout ces problèmes** :

| Problème | Solution apportée par la TDZ |
| -------- | ---------------------------- |
| Utilisation avant déclaration | Une erreur `ReferenceError` est levée immédiatement |
| Bugs cachés | L'erreur force le développeur à corriger l'ordre du code |

```javascript
// Exemple de Temporal Dead Zone
{
  // Début du bloc - début de la TDZ pour "message"
  // console.log(message); // ReferenceError: Cannot access 'message' before initialization
  // La variable "message" est dans la TDZ : elle existe mais on ne peut pas y accéder

  let message = "Bonjour"; // Fin de la TDZ - la variable est initialisée
  console.log(message); // "Bonjour" - maintenant l'accès est autorisé
}
```

**Analogie concrète** : La TDZ est comme une file d'attente au cinéma. Tu sais que la salle existe (la variable est "connue" par le moteur JavaScript), mais tu ne peux pas y entrer tant que la porte n'est pas ouverte (la ligne de déclaration n'a pas été atteinte).

---

### Quelle règle suivre pour choisir entre `let` et `const` ?

**Règle simple en deux étapes** :

1. **Utilise `const` par défaut** pour toutes tes variables.
2. **Passe à `let` uniquement** si tu dois réaffecter la variable (compteur de boucle, accumulateur, variable qui change de valeur).

**Ne jamais utiliser `var`** dans du code moderne.

**Tableau récapitulatif** :

| Mot-clé | Portée | Réaffectation | Redéclaration | Hoisting | Usage recommandé |
| ------- | ------ | ------------- | ------------- | -------- | ---------------- |
| `var` | Fonction | Oui | Oui | Oui (`undefined`) | Ne pas utiliser |
| `let` | Bloc | Oui | Non | Non (TDZ) | Valeurs qui changent |
| `const` | Bloc | Non | Non | Non (TDZ) | Choix par défaut |

---

## Étapes Pratiques

### Étape 1 : Préparer l'environnement

Crée un dossier de travail et un fichier JavaScript.

```bash
# Crée un dossier pour les exercices du cursus
mkdir -p ~/js-moderne

# Crée le fichier pour cette fiche
touch ~/js-moderne/01-let-const.js
```

**Résultat attendu** :

```text
Le dossier ~/js-moderne/ est créé avec un fichier 01-let-const.js vide.
```

---

### Étape 2 : Tester la portée de `var`

Ouvre `01-let-const.js` dans VS Code et écris ce code :

```javascript
// Démonstration : var a une portée de fonction, pas de bloc
function testVar() {
  if (true) {
    var message = "Je suis dans le if"; // Déclaré dans le bloc if
  }

  // La variable "message" est accessible en dehors du if
  // car var a une portée de fonction
  console.log(message); // "Je suis dans le if"
}

testVar();
```

Exécute le fichier :

```bash
# Exécute le fichier JavaScript avec Node.js
node ~/js-moderne/01-let-const.js
```

**Résultat attendu** :

```text
Je suis dans le if
```

La variable `message` est accessible en dehors du bloc `if` car `var` a une portée de fonction.

---

### Étape 3 : Tester la portée de `let`

Remplace le contenu du fichier par ce code :

```javascript
// Démonstration : let a une portée de bloc
function testLet() {
  if (true) {
    let message = "Je suis dans le if"; // Déclaré dans le bloc if
    console.log(message); // "Je suis dans le if" - accessible dans le bloc
  }

  // La variable "message" n'est PAS accessible en dehors du if
  // car let a une portée de bloc
  try {
    console.log(message);
  } catch (erreur) {
    console.log("Erreur :", erreur.message); // "message is not defined"
  }
}

testLet();
```

```bash
node ~/js-moderne/01-let-const.js
```

**Résultat attendu** :

```text
Je suis dans le if
Erreur : message is not defined
```

La variable `message` n'existe plus en dehors du bloc `if`.

---

### Étape 4 : Tester `const` avec des valeurs primitives

Remplace le contenu du fichier :

```javascript
// Démonstration : const empêche la réaffectation
const prenom = "Alice";
console.log(prenom); // "Alice"

// Tentative de réaffectation - cela provoque une erreur
try {
  // La ligne suivante utilise eval pour simuler la réaffectation
  // car une erreur de syntaxe arrêterait le programme entier
  const prenom2 = "Bob";
  // prenom = "Charlie"; // Décommente cette ligne pour voir l'erreur
  console.log("const empêche la réaffectation de la référence");
} catch (erreur) {
  console.log("Erreur :", erreur.message);
}

// const oblige à initialiser la variable immédiatement
// const age; // SyntaxError: Missing initializer in const declaration
// Décommente la ligne ci-dessus pour voir l'erreur
```

```bash
node ~/js-moderne/01-let-const.js
```

**Résultat attendu** :

```text
Alice
const empêche la réaffectation de la référence
```

---

### Étape 5 : Tester `const` avec des objets et tableaux

Remplace le contenu du fichier :

```javascript
// Démonstration : const n'empêche pas la modification du CONTENU
const utilisateur = {
  nom: "Alice",
  age: 25,
};

// Modifier une propriété est autorisé
utilisateur.age = 26;
console.log("Âge modifié :", utilisateur.age); // 26

// Ajouter une propriété est autorisé
utilisateur.ville = "Paris";
console.log("Ville ajoutée :", utilisateur.ville); // "Paris"

// Réaffecter l'objet entier est INTERDIT
try {
  // utilisateur = { nom: "Bob" }; // TypeError: Assignment to constant variable
  console.log("On ne peut pas réaffecter un objet const");
} catch (erreur) {
  console.log("Erreur :", erreur.message);
}

// Même comportement avec les tableaux
const couleurs = ["rouge", "vert"];
couleurs.push("bleu"); // Autorisé - on modifie le contenu
console.log("Couleurs :", couleurs); // ["rouge", "vert", "bleu"]

// couleurs = ["jaune"]; // TypeError - réaffectation interdite
```

```bash
node ~/js-moderne/01-let-const.js
```

**Résultat attendu** :

```text
Âge modifié : 26
Ville ajoutée : Paris
On ne peut pas réaffecter un objet const
Couleurs : [ 'rouge', 'vert', 'bleu' ]
```

---

### Étape 6 : Tester la Temporal Dead Zone

Remplace le contenu du fichier :

```javascript
// Démonstration de la Temporal Dead Zone (TDZ)

// Avec var : pas d'erreur, la variable vaut undefined
console.log("=== Test avec var ===");
console.log("Avant déclaration var :", typeof avantVar); // "undefined"
var avantVar = "valeur var";
console.log("Après déclaration var :", avantVar); // "valeur var"

// Avec let : erreur si on accède avant la déclaration
console.log("\n=== Test avec let ===");
try {
  // Cette ligne provoque une ReferenceError
  // car "avantLet" est dans la Temporal Dead Zone
  console.log("Avant déclaration let :", avantLet);
} catch (erreur) {
  console.log("Erreur TDZ (let) :", erreur.message);
}
let avantLet = "valeur let";
console.log("Après déclaration let :", avantLet); // "valeur let"

// Avec const : même comportement que let
console.log("\n=== Test avec const ===");
try {
  console.log("Avant déclaration const :", avantConst);
} catch (erreur) {
  console.log("Erreur TDZ (const) :", erreur.message);
}
const avantConst = "valeur const";
console.log("Après déclaration const :", avantConst); // "valeur const"
```

```bash
node ~/js-moderne/01-let-const.js
```

**Résultat attendu** :

```text
=== Test avec var ===
Avant déclaration var : undefined
Après déclaration var : valeur var

=== Test avec let ===
Erreur TDZ (let) : Cannot access 'avantLet' before initialization
Après déclaration let : valeur let

=== Test avec const ===
Erreur TDZ (const) : Cannot access 'avantConst' before initialization
Après déclaration const : valeur const
```

---

### Étape 7 : Tester `let` dans les boucles

Remplace le contenu du fichier :

```javascript
// Démonstration : let crée une variable distincte à chaque itération

// Problème classique avec var dans une boucle
console.log("=== Boucle avec var ===");
const fonctionsVar = [];
for (var i = 0; i < 3; i++) {
  // Chaque fonction capture la MÊME variable "i"
  fonctionsVar.push(function () {
    return i;
  });
}
// À ce stade, i vaut 3 (la valeur finale de la boucle)
console.log(fonctionsVar[0]()); // 3 - pas 0 !
console.log(fonctionsVar[1]()); // 3 - pas 1 !
console.log(fonctionsVar[2]()); // 3 - pas 2 !

// Solution avec let
console.log("\n=== Boucle avec let ===");
const fonctionsLet = [];
for (let j = 0; j < 3; j++) {
  // Chaque itération crée une NOUVELLE variable "j"
  fonctionsLet.push(function () {
    return j;
  });
}
console.log(fonctionsLet[0]()); // 0 - correct !
console.log(fonctionsLet[1]()); // 1 - correct !
console.log(fonctionsLet[2]()); // 2 - correct !
```

```bash
node ~/js-moderne/01-let-const.js
```

**Résultat attendu** :

```text
=== Boucle avec var ===
3
3
3

=== Boucle avec let ===
0
1
2
```

---

### Étape 8 : Rendre un objet immuable avec `Object.freeze()`

Remplace le contenu du fichier :

```javascript
// Démonstration : Object.freeze() pour rendre un objet immuable

const config = Object.freeze({
  port: 3000,
  host: "localhost",
  debug: false,
});

// Tentative de modification - silencieusement ignorée en mode normal
config.port = 8080;
console.log("Port :", config.port); // 3000 - la modification est ignorée

// Tentative d'ajout de propriété - silencieusement ignorée
config.nom = "MonApp";
console.log("Nom :", config.nom); // undefined - la propriété n'a pas été ajoutée

// En mode strict, ces tentatives provoquent une erreur TypeError
// "use strict";
// config.port = 8080; // TypeError: Cannot assign to read only property

// Attention : Object.freeze() est superficiel (shallow)
const configProfonde = Object.freeze({
  serveur: {
    port: 3000,
    host: "localhost",
  },
});

// Les objets imbriqués ne sont PAS gelés
configProfonde.serveur.port = 8080;
console.log("Port profond :", configProfonde.serveur.port); // 8080 - modifié !
```

```bash
node ~/js-moderne/01-let-const.js
```

**Résultat attendu** :

```text
Port : 3000
Nom : undefined
Port profond : 8080
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `node fichier.js` | Exécute un fichier JavaScript avec Node.js |
| `node -e "console.log(typeof x)"` | Exécute du JavaScript en ligne de commande |
| `node --version` | Affiche la version de Node.js installée |

---

## Pièges Fréquents

### Piège 1 : Croire que `const` rend un objet immuable

**Problème** : Tu déclares un objet avec `const` en pensant que personne ne pourra modifier ses propriétés.

**Solution** : `const` empêche la réaffectation de la variable, pas la modification du contenu. Utilise `Object.freeze()` si tu veux un objet immuable. Souviens-toi que `Object.freeze()` est superficiel : les objets imbriqués ne sont pas gelés.

```javascript
// ❌ Ce que l'on croit
const user = { nom: "Alice" };
// "user est constant, personne ne peut le modifier"

// ✅ Ce qui se passe réellement
user.nom = "Bob"; // Autorisé - seule la référence est constante
console.log(user.nom); // "Bob"
```

---

### Piège 2 : Utiliser `var` dans une boucle avec des callbacks

**Problème** : Les fonctions créées dans une boucle `for` avec `var` capturent toutes la même variable.

**Solution** : Utilise `let` dans la boucle. Chaque itération crée une nouvelle variable.

```javascript
// ❌ Avec var : toutes les fonctions renvoient la même valeur
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100);
}
// Affiche : 3, 3, 3

// ✅ Avec let : chaque fonction a sa propre valeur
for (let i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i);
  }, 100);
}
// Affiche : 0, 1, 2
```

---

### Piège 3 : Oublier d'initialiser une variable `const`

**Problème** : Tu déclares une variable `const` sans lui donner de valeur.

**Solution** : `const` oblige à donner une valeur immédiatement. Si tu ne connais pas encore la valeur, utilise `let`.

```javascript
// ❌ Erreur de syntaxe
// const resultat; // SyntaxError: Missing initializer in const declaration

// ✅ Initialiser immédiatement
const resultat = calculer();

// ✅ Ou utiliser let si la valeur vient plus tard
let resultat2;
resultat2 = calculer();
```

---

### Piège 4 : Confondre Temporal Dead Zone et hoisting de `var`

**Problème** : Tu penses que `let` et `const` ne sont pas "hoistés" du tout.

**Solution** : `let` et `const` sont hoistés (le moteur JavaScript sait qu'ils existent), mais ils sont dans la Temporal Dead Zone jusqu'à leur déclaration. Contrairement à `var` qui vaut `undefined` pendant le hoisting, `let` et `const` provoquent une erreur.

---

## Checklist de Validation

- [ ] Je sais que `var` a une portée de fonction et que `let`/`const` ont une portée de bloc
- [ ] Je sais que `const` empêche la réaffectation mais pas la modification du contenu
- [ ] Je comprends la Temporal Dead Zone et pourquoi elle existe
- [ ] Je sais que `let` crée une nouvelle variable à chaque itération de boucle
- [ ] J'utilise `const` par défaut et `let` uniquement quand la réaffectation est nécessaire
- [ ] Je n'utilise jamais `var` dans du code moderne

---

## Exercice Pratique

**Énoncé** : Crée un programme qui gère un panier de courses.

1. Déclare une constante `PRIX_MAX` qui vaut `100`.
2. Déclare un panier (tableau) avec `const`.
3. Ajoute trois articles au panier (objets avec `nom` et `prix`).
4. Utilise une boucle `for` avec `let` pour calculer le total.
5. Compare le total à `PRIX_MAX` et affiche si le budget est respecté.

**Indications** :

- Utilise `const` pour le panier et les articles (leur référence ne change pas).
- Utilise `let` pour le compteur de boucle et le total (ils changent à chaque itération).
- Commente chaque ligne pour expliquer ton choix de `const` ou `let`.

**Résultat attendu** :

```text
Article : Pain - 2.50 €
Article : Lait - 1.20 €
Article : Fromage - 8.90 €
Total : 12.60 €
Budget respecté (max 100 €)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// Constante pour le budget maximum - ne changera jamais
const PRIX_MAX = 100;

// Le panier est un tableau - sa référence ne change pas, donc on utilise const
// On peut ajouter des éléments avec push sans problème
const panier = [];

// Chaque article est un objet - sa référence ne change pas
const article1 = { nom: "Pain", prix: 2.5 };
const article2 = { nom: "Lait", prix: 1.2 };
const article3 = { nom: "Fromage", prix: 8.9 };

// On ajoute les articles au panier (modification du contenu, pas de la référence)
panier.push(article1);
panier.push(article2);
panier.push(article3);

// Le total va changer à chaque itération - on utilise let
let total = 0;

// Le compteur "i" change à chaque itération - on utilise let
for (let i = 0; i < panier.length; i++) {
  // L'article courant ne change pas dans le corps de la boucle - on utilise const
  const article = panier[i];

  // Affiche le nom et le prix de l'article
  console.log(`Article : ${article.nom} - ${article.prix.toFixed(2)} €`);

  // Ajoute le prix au total
  total += article.prix;
}

// Affiche le total avec deux décimales
console.log(`Total : ${total.toFixed(2)} €`);

// Compare le total au budget maximum
if (total <= PRIX_MAX) {
  console.log(`Budget respecté (max ${PRIX_MAX} €)`);
} else {
  console.log(`Budget dépassé de ${(total - PRIX_MAX).toFixed(2)} €`);
}
```

---

## Navigation

→ Fiche suivante : **[Arrow functions et this](02-arrow-functions-this.md)**
