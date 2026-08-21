---
tags:
  - JavaScript
  - Débutant
  - Concept
description: "Maîtriser les template literals, les tagged templates et les nouvelles méthodes de String, Array et Object."
estimated_time: "45 min"
fiche_number: 4
total_fiches: 14
cursus: "JavaScript Moderne"
id: "web.javascript-modern.template-literals-methodes"
course_id: "web.javascript-modern"
content_type: "lesson"
order: 4
---

# 04 - Template literals et nouvelles méthodes

> **En bref** : Apprendre les template strings multi-lignes, l'interpolation, les tagged templates, et les nouvelles méthodes de String, Array et Object introduites en ES6+. Lecture estimée : 45 min.

## Prérequis

- Fiche 01 : [let, const et portée](01-let-const-portee.md)
- Fiche 02 : [Arrow functions et this](02-arrow-functions-this.md)
- Fiche 03 : [Destructuring et spread](03-destructuring-spread.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les template literals pour construire des chaînes de caractères, et tu connaîtras les méthodes modernes les plus utiles de `String`, `Array` et `Object`.

---

## Concepts

### Qu'est-ce qu'un template literal ?

**Définition** : Un template literal est une chaîne de caractères délimitée par des backticks (`` ` ``) au lieu de guillemets simples ou doubles. Il permet l'interpolation d'expressions et les chaînes multi-lignes.

**Le problème que les template literals résolvent** :

Sans les template literals, voici les problèmes rencontrés :

1. **Concaténation lourde** : construire une chaîne avec des variables nécessite `"Bonjour " + nom + ", tu as " + age + " ans."`.
2. **Pas de multi-lignes** : pour une chaîne sur plusieurs lignes, il faut utiliser `\n` ou concaténer plusieurs chaînes.
3. **Pas d'expressions intégrées** : impossible d'écrire un calcul directement dans la chaîne.

**Comment les template literals résolvent ces problèmes** :

| Problème | Solution apportée par les template literals |
| -------- | ------------------------------------------- |
| Concaténation lourde | Interpolation avec `${expression}` |
| Pas de multi-lignes | Les backticks supportent les retours à la ligne naturels |
| Pas d'expressions | `${2 + 3}` évalue l'expression dans la chaîne |

**Analogie concrète** : Imagine un formulaire pré-imprimé avec des cases vides à remplir. Le template literal est le formulaire : le texte fixe est déjà imprimé, et les `${...}` sont les cases vides où tu insères tes données.

**Ce qu'un template literal n'est PAS** :

- Un template literal n'est pas un moteur de templates comme Twig ou Handlebars. Il ne gère pas les boucles ni les conditions à l'intérieur de la chaîne (bien qu'on puisse y insérer des expressions ternaires).
- Un template literal n'est pas automatiquement sécurisé contre les injections. Si tu insères des données utilisateur dans du HTML, il faut les échapper.

---

### Qu'est-ce qu'un tagged template ?

**Définition** : Un tagged template est un template literal précédé d'un nom de fonction (le "tag"). La fonction reçoit les parties statiques et les valeurs interpolées séparément, ce qui permet de les traiter avant de construire le résultat.

```javascript
// Syntaxe d'un tagged template
// La fonction "tag" reçoit les parties statiques et les valeurs
function tag(strings, ...values) {
  // strings : tableau des parties statiques ["Bonjour ", ", tu as ", " ans."]
  // values : tableau des valeurs interpolées ["Alice", 25]
  console.log("Parties statiques :", strings);
  console.log("Valeurs :", values);

  // On reconstruit la chaîne manuellement
  let resultat = "";
  strings.forEach((str, i) => {
    resultat += str;
    if (i < values.length) {
      resultat += values[i];
    }
  });
  return resultat;
}

const nom = "Alice";
const age = 25;
const message = tag`Bonjour ${nom}, tu as ${age} ans.`;
console.log(message);
```

**Cas d'utilisation courant** : échapper du HTML pour éviter les injections XSS.

```javascript
// Fonction tag qui échappe les valeurs HTML
function html(strings, ...values) {
  const echapper = (str) =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  let resultat = "";
  strings.forEach((str, i) => {
    resultat += str;
    if (i < values.length) {
      resultat += echapper(values[i]); // Échappe les valeurs utilisateur
    }
  });
  return resultat;
}

const saisieUtilisateur = '<script>alert("XSS")</script>';
const pageHtml = html`<p>Message : ${saisieUtilisateur}</p>`;
console.log(pageHtml);
// <p>Message : &lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;</p>
```

---

### Nouvelles méthodes de String

**Définition** : ES6+ a ajouté des méthodes utilitaires sur `String.prototype` pour simplifier les opérations courantes sur les chaînes de caractères.

| Méthode | Description | Remplace |
| ------- | ----------- | -------- |
| `includes(str)` | Vérifie si la chaîne contient `str` | `indexOf(str) !== -1` |
| `startsWith(str)` | Vérifie si la chaîne commence par `str` | `indexOf(str) === 0` |
| `endsWith(str)` | Vérifie si la chaîne finit par `str` | `slice(-str.length) === str` |
| `repeat(n)` | Répète la chaîne `n` fois | Boucle manuelle |
| `padStart(n, car)` | Complète au début jusqu'à `n` caractères | Formatage manuel |
| `padEnd(n, car)` | Complète à la fin jusqu'à `n` caractères | Formatage manuel |
| `trimStart()` | Supprime les espaces au début | Regex |
| `trimEnd()` | Supprime les espaces à la fin | Regex |

---

### Nouvelles méthodes de Array

**Définition** : ES6+ a ajouté des méthodes sur `Array` et `Array.prototype` pour simplifier la recherche, la transformation et la création de tableaux.

| Méthode | Description | Particularité |
| ------- | ----------- | ------------- |
| `find(fn)` | Retourne le premier élément qui satisfait `fn` | Retourne l'élément (pas l'index) |
| `findIndex(fn)` | Retourne l'index du premier élément qui satisfait `fn` | Retourne -1 si non trouvé |
| `includes(val)` | Vérifie si le tableau contient `val` | Plus lisible que `indexOf !== -1` |
| `Array.from(itérable)` | Crée un tableau à partir d'un itérable | Convertit NodeList, arguments, etc. |
| `Array.of(a, b, c)` | Crée un tableau avec les arguments | Remplace `new Array()` sans ambiguïté |
| `flat(depth)` | Aplatit un tableau imbriqué | `depth` = 1 par défaut |
| `flatMap(fn)` | `map()` puis `flat(1)` en une étape | Plus performant que map+flat séparés |

---

### Nouvelles méthodes de Object

**Définition** : ES6+ a ajouté des méthodes statiques sur `Object` pour itérer sur les propriétés d'un objet.

| Méthode | Retourne | Exemple |
| ------- | -------- | ------- |
| `Object.keys(obj)` | Tableau des clés | `["nom", "age"]` |
| `Object.values(obj)` | Tableau des valeurs | `["Alice", 25]` |
| `Object.entries(obj)` | Tableau de paires `[clé, valeur]` | `[["nom", "Alice"], ["age", 25]]` |
| `Object.assign(cible, ...sources)` | Copie les propriétés des sources dans la cible | Remplacé par le spread `{ ...obj }` |
| `Object.fromEntries(entries)` | Crée un objet à partir de paires `[clé, valeur]` | Inverse de `Object.entries()` |

---

## Étapes Pratiques

### Étape 1 : Template literals et interpolation

Crée le fichier `04-template-literals.js` :

```javascript
// Template literal : interpolation de variables
const prenom = "Alice";
const age = 25;

// ❌ Ancienne méthode : concaténation
const message1 = "Bonjour " + prenom + ", tu as " + age + " ans.";
console.log(message1);

// ✅ Template literal : interpolation avec ${}
const message2 = `Bonjour ${prenom}, tu as ${age} ans.`;
console.log(message2);

// Expressions dans l'interpolation
console.log(`Dans 10 ans, tu auras ${age + 10} ans.`);
console.log(`Majeur : ${age >= 18 ? "oui" : "non"}`);
console.log(`Nom en majuscules : ${prenom.toUpperCase()}`);

// Multi-lignes
const carte = `
╔══════════════════╗
║  Carte de visite ║
║  Nom : ${prenom.padEnd(9)}║
║  Âge : ${String(age).padEnd(9)}║
╚══════════════════╝`;
console.log(carte);
```

```bash
node ~/js-moderne/04-template-literals.js
```

**Résultat attendu** :

```text
Bonjour Alice, tu as 25 ans.
Bonjour Alice, tu as 25 ans.
Dans 10 ans, tu auras 35 ans.
Majeur : oui
Nom en majuscules : ALICE

╔══════════════════╗
║  Carte de visite ║
║  Nom : Alice    ║
║  Âge : 25       ║
╚══════════════════╝
```

---

### Étape 2 : Méthodes de String modernes

```javascript
// includes, startsWith, endsWith
const url = "https://api.example.com/users/42";

console.log("Contient 'api' :", url.includes("api")); // true
console.log("Commence par 'https' :", url.startsWith("https")); // true
console.log("Finit par '42' :", url.endsWith("42")); // true

// repeat
const separateur = "-".repeat(40);
console.log(separateur);

// padStart et padEnd - utile pour l'alignement
const produits = [
  { nom: "Pain", prix: 1.5 },
  { nom: "Fromage", prix: 8.9 },
  { nom: "Vin rouge", prix: 12.5 },
];

console.log("Ticket de caisse :");
console.log(separateur);
produits.forEach(({ nom, prix }) => {
  // padEnd aligne le nom à gauche, padStart aligne le prix à droite
  const ligne = `${nom.padEnd(20)}${prix.toFixed(2).padStart(10)} €`;
  console.log(ligne);
});
console.log(separateur);

// trimStart et trimEnd
const saisie = "   Bonjour   ";
console.log(`[${saisie}]`); // [   Bonjour   ]
console.log(`[${saisie.trimStart()}]`); // [Bonjour   ]
console.log(`[${saisie.trimEnd()}]`); // [   Bonjour]
console.log(`[${saisie.trim()}]`); // [Bonjour]
```

```bash
node ~/js-moderne/04-template-literals.js
```

**Résultat attendu** :

```text
Contient 'api' : true
Commence par 'https' : true
Finit par '42' : true
----------------------------------------
Ticket de caisse :
----------------------------------------
Pain                      1.50 €
Fromage                   8.90 €
Vin rouge                12.50 €
----------------------------------------
[   Bonjour   ]
[Bonjour   ]
[   Bonjour]
[Bonjour]
```

---

### Étape 3 : Méthodes de Array modernes

```javascript
// find et findIndex
const utilisateurs = [
  { id: 1, nom: "Alice", age: 25 },
  { id: 2, nom: "Bob", age: 30 },
  { id: 3, nom: "Charlie", age: 22 },
];

// find : retourne le premier élément correspondant
const bob = utilisateurs.find((u) => u.nom === "Bob");
console.log("Trouvé :", bob);

// findIndex : retourne l'index du premier élément correspondant
const indexBob = utilisateurs.findIndex((u) => u.nom === "Bob");
console.log("Index de Bob :", indexBob); // 1

// includes : vérifie la présence d'une valeur
const nombres = [1, 2, 3, NaN];
console.log("Contient 2 :", nombres.includes(2)); // true
console.log("Contient NaN :", nombres.includes(NaN)); // true (indexOf échoue avec NaN)

// Array.from : crée un tableau à partir d'un itérable
const chaine = "Bonjour";
const lettres = Array.from(chaine);
console.log("Lettres :", lettres);

// Array.from avec fonction de transformation
const indices = Array.from({ length: 5 }, (_, i) => i + 1);
console.log("Indices :", indices); // [1, 2, 3, 4, 5]

// Array.of : crée un tableau sans ambiguïté
console.log("Array(3) :", Array(3)); // [<3 empty items>] - crée 3 cases vides
console.log("Array.of(3) :", Array.of(3)); // [3] - crée un tableau contenant 3

// flat : aplatit un tableau imbriqué
const imbrique = [1, [2, 3], [4, [5, 6]]];
console.log("flat(1) :", imbrique.flat()); // [1, 2, 3, 4, [5, 6]]
console.log("flat(2) :", imbrique.flat(2)); // [1, 2, 3, 4, 5, 6]

// flatMap : map puis flat(1)
const phrases = ["Bonjour le monde", "JavaScript moderne"];
const mots = phrases.flatMap((p) => p.split(" "));
console.log("Mots :", mots); // ["Bonjour", "le", "monde", "JavaScript", "moderne"]
```

```bash
node ~/js-moderne/04-template-literals.js
```

**Résultat attendu** :

```text
Trouvé : { id: 2, nom: 'Bob', age: 30 }
Index de Bob : 1
Contient 2 : true
Contient NaN : true
Lettres : [ 'B', 'o', 'n', 'j', 'o', 'u', 'r' ]
Indices : [ 1, 2, 3, 4, 5 ]
Array(3) : [ <3 empty items> ]
Array.of(3) : [ 3 ]
flat(1) : [ 1, 2, 3, 4, [ 5, 6 ] ]
flat(2) : [ 1, 2, 3, 4, 5, 6 ]
Mots : [ 'Bonjour', 'le', 'monde', 'JavaScript', 'moderne' ]
```

---

### Étape 4 : Méthodes de Object modernes

```javascript
// Object.keys, Object.values, Object.entries
const produit = {
  nom: "Clavier mécanique",
  prix: 89.99,
  marque: "KeyTech",
  enStock: true,
};

console.log("Clés :", Object.keys(produit));
console.log("Valeurs :", Object.values(produit));
console.log("Entrées :", Object.entries(produit));

// Itérer sur un objet avec Object.entries et destructuring
console.log("\n--- Détails du produit ---");
Object.entries(produit).forEach(([cle, valeur]) => {
  console.log(`${cle} : ${valeur}`);
});

// Object.fromEntries : créer un objet à partir de paires
const paires = [
  ["nom", "Alice"],
  ["age", 25],
  ["ville", "Paris"],
];
const personne = Object.fromEntries(paires);
console.log("\nPersonne :", personne);

// Cas pratique : transformer les valeurs d'un objet
const prix = { pain: 1.5, lait: 0.9, fromage: 3.2 };

// Augmenter tous les prix de 10%
const prixAugmentes = Object.fromEntries(
  Object.entries(prix).map(([produit, prix]) => [produit, +(prix * 1.1).toFixed(2)])
);
console.log("\nPrix augmentés :", prixAugmentes);

// Filtrer les propriétés d'un objet
const cher = Object.fromEntries(
  Object.entries(prix).filter(([, valeur]) => valeur > 1)
);
console.log("Articles chers :", cher);
```

```bash
node ~/js-moderne/04-template-literals.js
```

**Résultat attendu** :

```text
Clés : [ 'nom', 'prix', 'marque', 'enStock' ]
Valeurs : [ 'Clavier mécanique', 89.99, 'KeyTech', true ]
Entrées : [ [ 'nom', 'Clavier mécanique' ], [ 'prix', 89.99 ], [ 'marque', 'KeyTech' ], [ 'enStock', true ] ]

--- Détails du produit ---
nom : Clavier mécanique
prix : 89.99
marque : KeyTech
enStock : true

Personne : { nom: 'Alice', age: 25, ville: 'Paris' }

Prix augmentés : { pain: 1.65, lait: 0.99, fromage: 3.52 }
Articles chers : { pain: 1.5, fromage: 3.2 }
```

---

### Étape 5 : Tagged templates avancés

```javascript
// Tagged template pour formater des devises
function devise(strings, ...values) {
  let resultat = "";
  strings.forEach((str, i) => {
    resultat += str;
    if (i < values.length) {
      // Formater les nombres comme des prix
      if (typeof values[i] === "number") {
        resultat += values[i].toFixed(2) + " €";
      } else {
        resultat += values[i];
      }
    }
  });
  return resultat;
}

const article = "Clavier";
const prix = 49.9;
const quantite = 3;
const total = prix * quantite;

const facture = devise`Article : ${article}
Prix unitaire : ${prix}
Quantité : ${quantite}
Total : ${total}`;

console.log(facture);
```

```bash
node ~/js-moderne/04-template-literals.js
```

**Résultat attendu** :

```text
Article : Clavier
Prix unitaire : 49.90 €
Quantité : 3
Total : 149.70 €
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `` `texte ${variable}` `` | Template literal avec interpolation |
| `str.includes("mot")` | Vérifie si la chaîne contient "mot" |
| `str.startsWith("deb")` | Vérifie si la chaîne commence par "deb" |
| `str.padStart(10, "0")` | Complète au début avec des "0" jusqu'à 10 caractères |
| `arr.find(fn)` | Retourne le premier élément correspondant |
| `arr.includes(val)` | Vérifie si le tableau contient `val` |
| `Array.from({length: n}, (_, i) => i)` | Crée un tableau de 0 à n-1 |
| `Object.entries(obj)` | Retourne les paires `[clé, valeur]` |
| `Object.fromEntries(arr)` | Crée un objet à partir de paires |

---

## Pièges Fréquents

### Piège 1 : Oublier les backticks pour les template literals

**Problème** : Tu utilises des guillemets simples ou doubles au lieu des backticks, et l'interpolation `${}` n'est pas interprétée.

**Solution** : Utilise toujours les backticks `` ` `` pour les template literals. Sur un clavier AZERTY, le backtick est accessible avec AltGr + 7.

```javascript
// ❌ Guillemets : l'interpolation n'est pas interprétée
const msg1 = "Bonjour ${nom}";
console.log(msg1); // "Bonjour ${nom}" - texte littéral

// ✅ Backticks : l'interpolation fonctionne
const msg2 = `Bonjour ${nom}`;
console.log(msg2); // "Bonjour Alice"
```

---

### Piège 2 : `find()` retourne `undefined` si rien n'est trouvé

**Problème** : Tu utilises `find()` et tu ne vérifies pas si le résultat est `undefined`.

**Solution** : Vérifie toujours le résultat de `find()` avant de l'utiliser.

```javascript
const utilisateurs = [{ nom: "Alice" }, { nom: "Bob" }];

// ❌ Pas de vérification
const charlie = utilisateurs.find((u) => u.nom === "Charlie");
// console.log(charlie.nom); // TypeError: Cannot read properties of undefined

// ✅ Vérification avant utilisation
if (charlie) {
  console.log(charlie.nom);
} else {
  console.log("Charlie non trouvé");
}
```

---

### Piège 3 : `Array.from()` vs spread pour les itérables

**Problème** : Tu ne sais pas quand utiliser `Array.from()` et quand utiliser le spread `[...]`.

**Solution** : Les deux fonctionnent sur les itérables. Mais `Array.from()` accepte aussi les objets array-like (avec `length`) et permet une fonction de transformation en second argument.

```javascript
// Les deux fonctionnent sur un string
console.log([..."ABC"]); // ["A", "B", "C"]
console.log(Array.from("ABC")); // ["A", "B", "C"]

// Seul Array.from accepte un objet avec length + transformation
const cinqPairs = Array.from({ length: 5 }, (_, i) => (i + 1) * 2);
console.log(cinqPairs); // [2, 4, 6, 8, 10]
```

---

### Piège 4 : Confondre `Object.assign()` et le spread

**Problème** : `Object.assign()` modifie le premier objet (la cible), tandis que le spread crée toujours un nouvel objet.

**Solution** : Préfère le spread `{ ...obj }` pour créer des copies sans mutation. Utilise `Object.assign()` uniquement si tu veux modifier un objet existant.

```javascript
// ❌ Object.assign modifie le premier argument
const original = { a: 1 };
Object.assign(original, { b: 2 });
console.log(original); // { a: 1, b: 2 } - original a été modifié

// ✅ Spread crée un nouvel objet
const original2 = { a: 1 };
const enrichi = { ...original2, b: 2 };
console.log(original2); // { a: 1 } - original intact
```

---

## Checklist de Validation

- [ ] Je sais écrire un template literal avec des backticks et `${}`
- [ ] Je sais créer des chaînes multi-lignes avec les template literals
- [ ] Je comprends le principe des tagged templates
- [ ] Je connais `includes()`, `startsWith()`, `endsWith()`, `padStart()`, `padEnd()`
- [ ] Je sais utiliser `find()`, `findIndex()`, `includes()` sur les tableaux
- [ ] Je sais créer un tableau avec `Array.from()` et `Array.of()`
- [ ] Je sais itérer sur un objet avec `Object.entries()` et destructuring

---

## Exercice Pratique

**Énoncé** : Crée un programme de génération de facture formatée.

1. Crée un tableau d'articles : `{ nom, prix, quantite }`.
2. Utilise `Object.entries()` pour lister les propriétés de chaque article.
3. Utilise un template literal multi-lignes pour construire la facture.
4. Utilise `padStart()`/`padEnd()` pour aligner les colonnes.
5. Utilise `find()` pour identifier l'article le plus cher.
6. Calcule le total avec `reduce()`.

**Indications** :

- Utilise `.toFixed(2)` pour formater les prix.
- Utilise `.padEnd(20)` pour le nom et `.padStart(8)` pour les prix.
- Largeur totale de la facture : 40 caractères.

**Résultat attendu** :

```text
========================================
           FACTURE #2024-001
========================================
Article              Qté    Prix
----------------------------------------
Clavier                2    99.98 €
Souris                 1    29.99 €
Écran 27"              1   349.99 €
Câble HDMI             3    14.97 €
----------------------------------------
TOTAL                       494.93 €
========================================
Article le plus cher : Écran 27" (349.99 €)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// Données de la facture
const articles = [
  { nom: "Clavier", prix: 49.99, quantite: 2 },
  { nom: "Souris", prix: 29.99, quantite: 1 },
  { nom: "Écran 27\"", prix: 349.99, quantite: 1 },
  { nom: "Câble HDMI", prix: 4.99, quantite: 3 },
];

// Constantes de formatage
const LARGEUR = 40;
const SEP_DOUBLE = "=".repeat(LARGEUR);
const SEP_SIMPLE = "-".repeat(LARGEUR);

// Calculer le prix total de chaque article
const lignes = articles.map(({ nom, prix, quantite }) => {
  const total = (prix * quantite).toFixed(2);
  return `${nom.padEnd(20)}${String(quantite).padStart(5)}${(total + " €").padStart(15)}`;
});

// Trouver l'article le plus cher (prix unitaire)
const plusCher = articles.reduce((max, article) =>
  article.prix > max.prix ? article : max
);

// Calculer le total général
const totalGeneral = articles
  .reduce((acc, { prix, quantite }) => acc + prix * quantite, 0)
  .toFixed(2);

// Construire la facture avec un template literal multi-lignes
const facture = `${SEP_DOUBLE}
${"FACTURE #2024-001".padStart(28).padEnd(LARGEUR)}
${SEP_DOUBLE}
${"Article".padEnd(20)}${"Qté".padStart(5)}${"Prix".padStart(15)}
${SEP_SIMPLE}
${lignes.join("\n")}
${SEP_SIMPLE}
${"TOTAL".padEnd(20)}${(totalGeneral + " €").padStart(20)}
${SEP_DOUBLE}
Article le plus cher : ${plusCher.nom} (${plusCher.prix.toFixed(2)} €)`;

console.log(facture);
```

---

## Navigation

← Fiche précédente : **[Destructuring et spread](03-destructuring-spread.md)**

→ Fiche suivante : **[Modules ES (import/export)](05-modules-es.md)**
