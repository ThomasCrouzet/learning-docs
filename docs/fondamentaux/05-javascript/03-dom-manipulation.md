---
tags:
  - JavaScript
  - Débutant
  - Pratique
description: "Manipulation du DOM"
estimated_time: "45 min"
fiche_number: 3
total_fiches: 4
cursus: "JavaScript"
id: "fundamentals.javascript.dom-manipulation"
course_id: "fundamentals.javascript"
content_type: "lesson"
order: 3
---

# 03 - Manipulation du DOM

> **En bref** : À la fin de cette fiche, tu sauras sélectionner des éléments HTML et modifier leur contenu avec JavaScript. Lecture estimée : 45 min.


## Prérequis

- Fiche [05-javascript/01 - Introduction à JavaScript](01-introduction-js.md)
- Fiche [05-javascript/02 - Variables et fonctions](02-variables-fonctions.md)
- Fiche [04-html-css/01 - Structure de base HTML](../04-html-css/01-structure-html.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras sélectionner des éléments HTML et modifier leur contenu avec JavaScript.

---

## Concepts

### Qu'est-ce que le DOM ?

**Définition** : Le DOM (Document Object Model) est une représentation de la page HTML sous forme d'arbre d'objets que JavaScript peut manipuler.

**Le problème que le DOM résout** :

Sans le DOM, JavaScript ne pourrait pas interagir avec la page HTML.

**Analogie concrète** : Imagine la page HTML comme un immeuble. Le DOM est le plan de l'immeuble : il montre chaque appartement (élément), comment ils sont organisés, et permet de trouver et modifier n'importe quel appartement.

**Structure DOM** :

```text
document
└── html
    ├── head
    │   └── title
    └── body
        ├── h1
        ├── p
        └── div
            └── span
```

---

### Sélectionner des éléments

**getElementById()** :

```javascript
// Sélectionne un élément par son ID
let element = document.getElementById("monId");
```

```html
<div id="monId">Contenu</div>
```

**querySelector()** (recommandé) :

```javascript
// Sélectionne le PREMIER élément correspondant au sélecteur CSS
let element = document.querySelector(".maClasse");
let element = document.querySelector("#monId");
let element = document.querySelector("div");
let element = document.querySelector("div.card");
```

**querySelectorAll()** :

```javascript
// Sélectionne TOUS les éléments correspondants
let elements = document.querySelectorAll(".maClasse");
let elements = document.querySelectorAll("p");

// Parcourir les résultats
elements.forEach(function(element) {
    console.log(element);
});
```

**Tableau comparatif** :

| Méthode | Retourne | Sélecteur |
| ------- | -------- | --------- |
| `getElementById()` | Un élément | ID uniquement |
| `querySelector()` | Un élément | CSS |
| `querySelectorAll()` | Liste d'éléments | CSS |

---

### Modifier le contenu

**textContent** :

```javascript
let element = document.querySelector("h1");

// Lire le contenu texte
console.log(element.textContent);

// Modifier le contenu texte
element.textContent = "Nouveau titre";
```

**innerHTML** :

```javascript
let element = document.querySelector("div");

// Lire le HTML interne
console.log(element.innerHTML);

// Modifier avec du HTML
element.innerHTML = "<strong>Texte en gras</strong>";
```

**Différence textContent vs innerHTML** :

| textContent | innerHTML |
| ----------- | --------- |
| Texte brut uniquement | Interprète le HTML |
| Plus sécurisé | Risque XSS si données utilisateur |
| Plus rapide | Plus lent |

---

### Modifier les attributs

**getAttribute() et setAttribute()** :

```javascript
let lien = document.querySelector("a");

// Lire un attribut
let url = lien.getAttribute("href");

// Modifier un attribut
lien.setAttribute("href", "https://example.com");
lien.setAttribute("target", "_blank");
```

**Accès direct aux attributs courants** :

```javascript
let image = document.querySelector("img");
image.src = "nouvelle-image.jpg";
image.alt = "Description";

let input = document.querySelector("input");
input.value = "Nouvelle valeur";
input.disabled = true;
```

---

### Modifier les styles

**style (inline)** :

```javascript
let element = document.querySelector("div");

// Modifier un style
element.style.color = "red";
element.style.backgroundColor = "yellow";  // camelCase !
element.style.fontSize = "20px";
```

**classList (recommandé)** :

```javascript
let element = document.querySelector("div");

// Ajouter une classe
element.classList.add("active");

// Retirer une classe
element.classList.remove("hidden");

// Basculer une classe (ajoute si absente, retire si présente)
element.classList.toggle("visible");

// Vérifier si une classe existe
if (element.classList.contains("active")) {
    console.log("L'élément est actif");
}
```

**Avantage de classList** :

| style | classList |
| ----- | --------- |
| Styles inline (priorité haute) | Utilise les classes CSS |
| Difficile à maintenir | Séparation HTML/CSS |
| Une propriété à la fois | Plusieurs styles d'un coup |

---

### Créer des éléments

**createElement()** :

```javascript
// Créer un élément
let nouveauParagraphe = document.createElement("p");
nouveauParagraphe.textContent = "Nouveau paragraphe";
nouveauParagraphe.classList.add("nouveau");

// Ajouter à la page
let conteneur = document.querySelector("#conteneur");
conteneur.appendChild(nouveauParagraphe);
```

**insertAdjacentHTML()** :

```javascript
let element = document.querySelector("div");

// Position : beforebegin, afterbegin, beforeend, afterend
element.insertAdjacentHTML("beforeend", "<p>Nouveau</p>");
```

```text
<!-- beforebegin -->
<div>
    <!-- afterbegin -->
    Contenu existant
    <!-- beforeend -->
</div>
<!-- afterend -->
```

---

### Supprimer des éléments

```javascript
// Méthode moderne
let element = document.querySelector(".a-supprimer");
element.remove();

// Ancienne méthode (compatibilité)
let parent = element.parentNode;
parent.removeChild(element);
```

---

## Étapes Pratiques

### HTML de base

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>DOM</title>
    <style>
        .highlight { background-color: yellow; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <h1 id="titre">Mon titre</h1>
    <p class="texte">Premier paragraphe</p>
    <p class="texte">Deuxième paragraphe</p>
    <button id="btn">Cliquer</button>
    <div id="resultat"></div>

    <script src="script.js"></script>
</body>
</html>
```

### Script de manipulation

```javascript
// Sélection
let titre = document.querySelector("#titre");
let paragraphes = document.querySelectorAll(".texte");
let bouton = document.querySelector("#btn");
let resultat = document.querySelector("#resultat");

// Modifier le titre
titre.textContent = "Titre modifié par JavaScript";
titre.style.color = "blue";

// Modifier tous les paragraphes
paragraphes.forEach(function(p) {
    p.classList.add("highlight");
});

// Créer du contenu dynamique
let liste = document.createElement("ul");
let fruits = ["Pomme", "Banane", "Orange"];

fruits.forEach(function(fruit) {
    let li = document.createElement("li");
    li.textContent = fruit;
    liste.appendChild(li);
});

resultat.appendChild(liste);
```

---

## Commandes Utiles

| Code | Description |
| ---- | ----------- |
| `document.querySelector(sel)` | Sélectionne le premier élément |
| `document.querySelectorAll(sel)` | Sélectionne tous les éléments |
| `element.textContent` | Contenu texte |
| `element.innerHTML` | Contenu HTML |
| `element.classList.add(cls)` | Ajoute une classe |
| `element.classList.remove(cls)` | Retire une classe |
| `element.classList.toggle(cls)` | Bascule une classe |
| `document.createElement(tag)` | Crée un élément |
| `parent.appendChild(child)` | Ajoute un enfant |
| `element.remove()` | Supprime l'élément |

---

## Pièges Fréquents

### Piège 1 : Script exécuté avant le HTML

⚠️ **Problème** : `document.querySelector()` retourne `null`.

✅ **Solution** : Placer le script en fin de body ou utiliser `defer`.

### Piège 2 : Oublier que querySelectorAll retourne une liste

⚠️ **Problème** : On ne peut pas appliquer directement `.textContent` sur le résultat.

```javascript
// ❌ Ne fonctionne pas
let elements = document.querySelectorAll("p");
elements.textContent = "Nouveau";

// ✅ Correct
elements.forEach(el => el.textContent = "Nouveau");
```

### Piège 3 : innerHTML avec des données utilisateur

⚠️ **Problème** : Risque de faille XSS si on insère du contenu non vérifié.

✅ **Solution** : Utiliser `textContent` pour du texte simple.

```javascript
// ❌ Dangereux
element.innerHTML = userInput;

// ✅ Sécurisé
element.textContent = userInput;
```

---

## Checklist de Validation

- [ ] Je sais sélectionner des éléments avec `querySelector`
- [ ] Je sais modifier le contenu avec `textContent` et `innerHTML`
- [ ] Je sais manipuler les classes avec `classList`
- [ ] Je sais créer et ajouter des éléments
- [ ] Je comprends la différence entre `textContent` et `innerHTML`

---

## Exercice Pratique

**Énoncé** : Créer une liste de tâches (todo list) en JavaScript pur. La page contient un champ de saisie et un bouton "Ajouter". Quand l'utilisateur clique sur le bouton, la tâche saisie apparaît dans une `<ul>` avec un bouton "Supprimer" à côté. Cliquer sur "Supprimer" retire la tâche de la liste.

**Indications** :

- Utilise `document.createElement()` pour créer les éléments `<li>` et `<button>`
- Utilise `appendChild()` pour ajouter les éléments dans le DOM
- Utilise la méthode `remove()` pour supprimer un élément
- Pense à vider le champ de saisie après l'ajout

**Résultat attendu** : Une page avec un champ de saisie, un bouton "Ajouter", et une liste qui se remplit dynamiquement. Chaque tâche a un bouton "Supprimer" qui la retire de la liste.

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
    <title>Todo List</title>
    <style>
        body { font-family: sans-serif; max-width: 500px; margin: 50px auto; }
        li { padding: 8px 0; display: flex; justify-content: space-between; align-items: center; }
        .btn-supprimer { background: #e74c3c; color: white; border: none; padding: 4px 10px; cursor: pointer; }
    </style>
</head>
<body>
    <h1>Liste de tâches</h1>
    <input type="text" id="saisie" placeholder="Nouvelle tâche...">
    <button id="btn-ajouter">Ajouter</button>
    <ul id="liste"></ul>

    <script src="script.js"></script>
</body>
</html>
```

`script.js` :

```javascript
// Sélectionner les éléments de la page
let saisie = document.getElementById("saisie");
let btnAjouter = document.getElementById("btn-ajouter");
let liste = document.getElementById("liste");

// Fonction qui ajoute une tâche à la liste
function ajouterTache() {
    // Récupérer le texte saisi et retirer les espaces inutiles
    let texte = saisie.value.trim();

    // Ne rien faire si le champ est vide
    if (texte === "") {
        return;
    }

    // Créer un élément <li> pour la tâche
    let li = document.createElement("li");

    // Créer un <span> pour le texte de la tâche
    let span = document.createElement("span");
    span.textContent = texte;

    // Créer un bouton "Supprimer"
    let btnSupprimer = document.createElement("button");
    btnSupprimer.textContent = "Supprimer";
    btnSupprimer.classList.add("btn-supprimer");

    // Quand on clique sur "Supprimer", retirer le <li> de la liste
    btnSupprimer.addEventListener("click", function() {
        li.remove();
    });

    // Assembler les éléments : ajouter le span et le bouton dans le <li>
    li.appendChild(span);
    li.appendChild(btnSupprimer);

    // Ajouter le <li> dans la <ul>
    liste.appendChild(li);

    // Vider le champ de saisie
    saisie.value = "";

    // Remettre le focus sur le champ de saisie
    saisie.focus();
}

// Ajouter une tâche au clic sur le bouton
btnAjouter.addEventListener("click", ajouterTache);

// Ajouter une tâche quand on appuie sur Entrée dans le champ
saisie.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        ajouterTache();
    }
});
```

---

## Navigation

← Fiche précédente : **[Variables et fonctions](02-variables-fonctions.md)**

→ Fiche suivante : **[Les événements](04-evenements.md)**
