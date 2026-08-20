---
tags:
  - JavaScript
  - Débutant
  - Concept
description: "Introduction à JavaScript"
estimated_time: "35 min"
fiche_number: 1
total_fiches: 4
cursus: "JavaScript"
---

# 01 - Introduction à JavaScript

> **En bref** : À la fin de cette fiche, tu sauras intégrer JavaScript dans une page HTML et utiliser la console du navigateur. Lecture estimée : 35 min.


## Prérequis

- Fiche [04-html-css/01 - Structure de base HTML](../04-html-css/01-structure-html.md)
- Savoir créer et ouvrir un fichier HTML dans un navigateur

## Version de JavaScript

Cette documentation utilise la syntaxe **ES6+** (ECMAScript 2015 et versions ultérieures), compatible avec tous les navigateurs modernes.

## Objectif de cette fiche

À la fin de cette fiche, tu sauras intégrer JavaScript dans une page HTML et utiliser la console du navigateur.

---

## Concepts

### Qu'est-ce que JavaScript ?

**Définition** : JavaScript est un langage de programmation qui s'exécute dans le navigateur et permet de rendre les pages web interactives.

**Le problème que JavaScript résout** :

Sans JavaScript, voici les problèmes rencontrés :

1. **Pages statiques** : HTML et CSS ne peuvent pas réagir aux actions de l'utilisateur.
2. **Pas d'interactivité** : Impossible de valider un formulaire sans recharger la page.
3. **Pas de dynamisme** : Le contenu ne peut pas changer après le chargement.

**Comment JavaScript résout ces problèmes** :

| Problème | Solution apportée par JavaScript |
| -------- | -------------------------------- |
| Pages statiques | Réagit aux clics, survols, saisies |
| Pas d'interactivité | Valide les données côté client |
| Pas de dynamisme | Modifie le contenu en temps réel |

**Analogie concrète** : HTML et CSS construisent un décor de théâtre (les murs, les meubles, les couleurs). JavaScript est l'acteur sur scène : il peut déplacer les meubles, allumer les lumières, ouvrir les portes et réagir quand le public applaudit. Sans JavaScript, le décor reste figé.

**Ce que JavaScript n'est PAS** :

- JavaScript n'est pas Java. Ce sont deux langages différents.
- JavaScript n'est pas uniquement pour le web. Il peut aussi s'exécuter côté serveur (Node.js).

---

### Où écrire JavaScript ?

**3 façons d'intégrer JavaScript** :

**1. Script interne (dans la page)** :

```html
<body>
    <h1>Ma page</h1>

    <script>
        console.log("Hello World");
    </script>
</body>
```

**2. Script externe (recommandé)** :

```html
<body>
    <h1>Ma page</h1>

    <script src="script.js"></script>
</body>
```

**3. Inline (à éviter)** :

```html
<button onclick="alert('Cliqué')">Cliquer</button>
```

**Placement du script** :

| Emplacement | Avantage | Inconvénient |
| ----------- | -------- | ------------ |
| Dans `<head>` | Chargé en premier | Bloque le rendu de la page |
| Fin de `<body>` | Page affichée d'abord | - |
| Avec `defer` | Chargé après le HTML | Nécessite attribut |

**Recommandation** : Placer les scripts en fin de `<body>` ou utiliser `defer`.

```html
<script src="script.js" defer></script>
```

---

### La console du navigateur

**Définition** : La console est un outil de développement qui affiche les messages et erreurs JavaScript.

**Analogie concrète** : La console est comme le tableau de bord d'une voiture. Le conducteur (toi) ne voit pas le moteur (le code), mais le tableau de bord affiche les informations importantes : vitesse, niveau d'essence, voyants d'erreur. La console fait pareil : elle affiche ce que ton code fait et signale les problèmes.

**Ouvrir la console** :

- **Windows/Linux** : F12 puis onglet "Console"
- **Mac** : Cmd + Option + J
- Ou : Clic droit → Inspecter → Console

**console.log()** :

```javascript
console.log("Message à afficher");
console.log(42);
console.log("Valeur :", 42);
```

**Autres méthodes console** :

| Méthode | Usage |
| ------- | ----- |
| `console.log()` | Affiche un message |
| `console.error()` | Affiche une erreur (rouge) |
| `console.warn()` | Affiche un avertissement (jaune) |
| `console.table()` | Affiche des données en tableau |

---

### Syntaxe de base

**Instructions et point-virgule** :

```javascript
// Chaque instruction se termine par un point-virgule
let nom = "Alice";
console.log(nom);
```

**Commentaires** :

```javascript
// Commentaire sur une ligne

/*
   Commentaire
   sur plusieurs
   lignes
*/
```

**Sensibilité à la casse** :

```javascript
let nom = "Alice";
let Nom = "Bob";
// nom et Nom sont deux variables différentes
```

---

## Étapes Pratiques

### Étape 1 : Créer les fichiers

Crée un dossier avec deux fichiers :

```text
mon-projet/
├── index.html
└── script.js
```

### Étape 2 : Écrire le HTML

`index.html` :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Introduction JavaScript</title>
</head>
<body>
    <h1>Ma première page JavaScript</h1>
    <p>Ouvre la console pour voir les messages.</p>

    <script src="script.js"></script>
</body>
</html>
```

### Étape 3 : Écrire le JavaScript

`script.js` :

```javascript
// Mon premier script JavaScript
console.log("Hello World!");

// Afficher plusieurs valeurs
console.log("Nom:", "Alice");
console.log("Age:", 25);

// Calculer quelque chose
console.log("2 + 2 =", 2 + 2);
```

### Étape 4 : Tester

1. Ouvre `index.html` dans le navigateur
2. Ouvre la console (F12)
3. Tu dois voir les messages affichés

**Résultat attendu dans la console** :

```text
Hello World!
Nom: Alice
Age: 25
2 + 2 = 4
```

---

## Commandes Utiles

| Code | Description |
| ---- | ----------- |
| `console.log(x)` | Affiche x dans la console |
| `console.error(x)` | Affiche x en rouge |
| `console.warn(x)` | Affiche x en jaune |
| `alert(x)` | Affiche une popup avec x |

---

## Pièges Fréquents

### Piège 1 : Script chargé avant le HTML

⚠️ **Problème** : Le script essaie d'accéder à des éléments qui n'existent pas encore.

✅ **Solution** : Placer le script en fin de `<body>` ou utiliser `defer`.

### Piège 2 : Oublier les guillemets pour les chaînes

⚠️ **Problème** : `console.log(Hello)` provoque une erreur.

✅ **Solution** : Les textes doivent être entre guillemets : `console.log("Hello")`.

### Piège 3 : Confondre =, == et ===

⚠️ **Problème** : `=` est l'affectation, `==` est la comparaison lâche (avec conversion de type), `===` est la comparaison stricte (sans conversion).

```javascript
console.log(5 == "5");   // true  - == convertit le type, comparaison dangereuse
console.log(5 === "5");  // false - === vérifie aussi le type, comparaison fiable
```

✅ **Solution** : Utilise toujours `===` (et `!==`). N'utilise `==` que si tu as une raison précise (cas très rares).

```javascript
let x = 5;           // Affectation
console.log(x === 5);  // Comparaison stricte : true (type et valeur identiques)
```

**Règle** : Toujours `===` et `!==` par défaut en JavaScript.

---

## Checklist de Validation

- [ ] J'ai créé un fichier JavaScript externe
- [ ] Je l'ai lié à mon HTML avec `<script src="...">`
- [ ] Je sais ouvrir la console du navigateur
- [ ] Je sais utiliser `console.log()`
- [ ] Je vois mes messages dans la console

---

## Exercice Pratique

**Énoncé** : Écrire un script qui demande l'age de l'utilisateur via `prompt()`, calcule l'année de naissance, et affiche le résultat dans la console ET dans un paragraphe HTML avec `document.getElementById`. Si l'utilisateur entre un texte non numérique, afficher un message d'erreur.

**Indications** :

- Utilise `prompt()` pour demander l'age
- Utilise `parseInt()` pour convertir le texte en nombre
- Utilise `isNaN()` pour vérifier si la conversion a échoué
- Utilise `new Date().getFullYear()` pour obtenir l'année actuelle

**Résultat attendu** : Si l'utilisateur entre "25", la console et le paragraphe HTML affichent "Vous êtes probablement né(e) en 2001". Si l'utilisateur entre "abc", un message d'erreur s'affiche.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

`index.html` :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exercice - Année de naissance</title>
</head>
<body>
    <h1>Calcul de l'année de naissance</h1>
    <p id="resultat">En attente...</p>

    <script src="script.js"></script>
</body>
</html>
```

`script.js` :

```javascript
// Récupérer le paragraphe qui affichera le résultat
let paragraphe = document.getElementById("resultat");

// Demander l'âge à l'utilisateur (tutoiement)
let saisie = prompt("Quel est ton âge ?");

// Convertir la saisie en nombre entier
let age = parseInt(saisie);

// Vérifier si la saisie est un nombre valide
if (isNaN(age)) {
    // La saisie n'est pas un nombre
    console.error("Erreur : entre un nombre valide.");
    paragraphe.textContent = "Erreur : entre un nombre valide.";
} else {
    // Calculer l'année de naissance approximative
    let anneeActuelle = new Date().getFullYear();
    let anneeNaissance = anneeActuelle - age;

    // Afficher le résultat dans la console
    console.log("Tu es probablement né(e) en " + anneeNaissance);

    // Afficher le résultat dans le paragraphe HTML
    paragraphe.textContent = "Tu es probablement né(e) en " + anneeNaissance;
}
```

---

## Navigation

→ Fiche suivante : **[Variables et fonctions](02-variables-fonctions.md)**
