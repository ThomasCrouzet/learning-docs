---
tags:
  - JavaScript
  - Intermédiaire
  - Pratique
description: "Les événements"
estimated_time: "35 min"
fiche_number: 4
total_fiches: 4
cursus: "JavaScript"
id: "fundamentals.javascript.evenements"
course_id: "fundamentals.javascript"
content_type: "lesson"
order: 4
---

# 04 - Les événements

> **En bref** : À la fin de cette fiche, tu sauras gérer les interactions utilisateur avec les événements JavaScript. Lecture estimée : 35 min.


## Prérequis

- Fiche [05-javascript/01 - Introduction à JavaScript](01-introduction-js.md)
- Fiche [05-javascript/02 - Variables et fonctions](02-variables-fonctions.md)
- Fiche [05-javascript/03 - Manipulation du DOM](03-dom-manipulation.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras gérer les interactions utilisateur avec les événements JavaScript.

---

## Concepts

### Qu'est-ce qu'un événement ?

**Définition** : Un événement est une action qui se produit dans le navigateur (clic, frappe clavier, soumission de formulaire, etc.) à laquelle JavaScript peut réagir.

**Analogie concrète** : Un événement fonctionne comme une sonnette de porte. Quand un visiteur appuie sur la sonnette (l'action), un signal est envoyé, et toi tu décides quoi faire en réponse : ouvrir la porte, regarder par le judas, ou ignorer. En JavaScript, tu "installes une sonnette" sur un bouton (`addEventListener`), et tu définis ce qui se passe quand quelqu'un "appuie dessus" (la fonction de callback).

**Le problème que les événements résolvent** :

Sans événements, le code JavaScript s'exécute une seule fois au chargement. Impossible de réagir aux actions de l'utilisateur.

**Exemples d'événements courants** :

| Événement | Déclencheur |
| --------- | ----------- |
| `click` | Clic sur un élément |
| `dblclick` | Double-clic |
| `mouseover` | Survol de la souris |
| `mouseout` | Sortie de la souris |
| `keydown` | Touche enfoncée |
| `keyup` | Touche relâchée |
| `submit` | Soumission de formulaire |
| `change` | Changement de valeur (input, select) |
| `input` | Saisie dans un champ |
| `focus` | Élément qui reçoit le focus |
| `blur` | Élément qui perd le focus |
| `load` | Page chargée |
| `scroll` | Défilement |

---

### addEventListener()

**Syntaxe** :

```javascript
element.addEventListener("nomEvenement", fonction);
```

**Exemple** :

```javascript
let bouton = document.querySelector("#monBouton");

bouton.addEventListener("click", function() {
    console.log("Bouton cliqué !");
});
```

**Avec une fonction nommée** :

```javascript
function gererClic() {
    console.log("Bouton cliqué !");
}

bouton.addEventListener("click", gererClic);
```

**Avec une fonction fléchée** :

```javascript
bouton.addEventListener("click", () => {
    console.log("Bouton cliqué !");
});
```

---

### L'objet event

**Définition** : Quand un événement se produit, JavaScript crée un objet `event` contenant des informations sur l'événement.

**Analogie concrète** : L'objet `event` est comme le rapport d'un détecteur de mouvement. Quand quelqu'un passe devant le détecteur, celui-ci enregistre les détails : qui a déclenché l'alerte, à quelle heure, à quel endroit. L'objet `event` fournit les mêmes informations : quel élément a été cliqué (`target`), quel type d'action (`type`), à quelle position (`clientX`, `clientY`).

```javascript
bouton.addEventListener("click", function(event) {
    console.log(event);           // Objet event complet
    console.log(event.type);      // "click"
    console.log(event.target);    // L'élément cliqué
});
```

**Propriétés utiles de event** :

| Propriété | Description |
| --------- | ----------- |
| `event.target` | Élément qui a déclenché l'événement |
| `event.type` | Type d'événement ("click", "submit", etc.) |
| `event.key` | Touche pressée (pour keydown/keyup) |
| `event.clientX`, `event.clientY` | Position de la souris |

**Empêcher le comportement par défaut** :

```javascript
// Empêcher la soumission d'un formulaire
form.addEventListener("submit", function(event) {
    event.preventDefault();
    // Traitement personnalisé
});

// Empêcher un lien de naviguer
lien.addEventListener("click", function(event) {
    event.preventDefault();
    console.log("Navigation bloquée");
});
```

---

### Événements de souris

```javascript
let element = document.querySelector("#zone");

// Clic
element.addEventListener("click", () => {
    console.log("Cliqué");
});

// Survol
element.addEventListener("mouseover", () => {
    element.style.backgroundColor = "yellow";
});

element.addEventListener("mouseout", () => {
    element.style.backgroundColor = "";
});
```

---

### Événements de clavier

```javascript
let input = document.querySelector("#recherche");

// À chaque touche pressée
input.addEventListener("keydown", function(event) {
    console.log("Touche:", event.key);

    // Détecter Entrée
    if (event.key === "Enter") {
        console.log("Recherche lancée");
    }
});

// À chaque saisie
input.addEventListener("input", function(event) {
    console.log("Valeur actuelle:", event.target.value);
});
```

---

### Événements de formulaire

```javascript
let form = document.querySelector("form");
let email = document.querySelector("#email");

// Soumission
form.addEventListener("submit", function(event) {
    event.preventDefault();  // Empêche le rechargement

    let donnees = {
        email: email.value
    };
    console.log("Données:", donnees);
});

// Changement (quand on quitte le champ)
email.addEventListener("change", function(event) {
    console.log("Email changé:", event.target.value);
});

// Focus et blur
email.addEventListener("focus", () => {
    email.style.borderColor = "blue";
});

email.addEventListener("blur", () => {
    email.style.borderColor = "";
});
```

---

### Supprimer un événement

```javascript
function gererClic() {
    console.log("Cliqué");
}

// Ajouter
bouton.addEventListener("click", gererClic);

// Retirer
bouton.removeEventListener("click", gererClic);
```

**Important** : Pour retirer un événement, il faut une référence à la même fonction. Les fonctions anonymes ne peuvent pas être retirées.

---

## Étapes Pratiques

### HTML

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Événements</title>
    <style>
        .active { background-color: lightgreen; }
        .error { border: 2px solid red; }
        #compteur { font-size: 2rem; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>Gestion des événements</h1>

    <div id="compteur">0</div>
    <button id="incrementer">+1</button>
    <button id="decrementer">-1</button>
    <button id="reset">Reset</button>

    <hr>

    <form id="monForm">
        <label for="nom">Nom :</label>
        <input type="text" id="nom" required>
        <button type="submit">Envoyer</button>
    </form>

    <p id="message"></p>

    <script src="script.js"></script>
</body>
</html>
```

### Script

```javascript
// --- Compteur ---
let compteur = 0;
let affichage = document.querySelector("#compteur");
let btnPlus = document.querySelector("#incrementer");
let btnMoins = document.querySelector("#decrementer");
let btnReset = document.querySelector("#reset");

function mettreAJour() {
    affichage.textContent = compteur;
}

btnPlus.addEventListener("click", () => {
    compteur++;
    mettreAJour();
});

btnMoins.addEventListener("click", () => {
    compteur--;
    mettreAJour();
});

btnReset.addEventListener("click", () => {
    compteur = 0;
    mettreAJour();
});

// --- Formulaire ---
let form = document.querySelector("#monForm");
let inputNom = document.querySelector("#nom");
let message = document.querySelector("#message");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    let nom = inputNom.value.trim();

    if (nom.length < 2) {
        inputNom.classList.add("error");
        message.textContent = "Le nom doit avoir au moins 2 caractères";
        return;
    }

    inputNom.classList.remove("error");
    message.textContent = `Bonjour ${nom} !`;
    inputNom.value = "";
});

// Retirer l'erreur à la saisie
inputNom.addEventListener("input", () => {
    inputNom.classList.remove("error");
});
```

---

## Commandes Utiles

| Code | Description |
| ---- | ----------- |
| `element.addEventListener(type, fn)` | Ajoute un écouteur |
| `element.removeEventListener(type, fn)` | Retire un écouteur |
| `event.preventDefault()` | Empêche l'action par défaut |
| `event.target` | Élément qui a déclenché l'événement |
| `event.key` | Touche pressée |

---

## Pièges Fréquents

### Piège 1 : Oublier preventDefault() sur les formulaires

⚠️ **Problème** : La page se recharge à chaque soumission.

✅ **Solution** : Toujours appeler `event.preventDefault()` au début du handler de submit.

### Piège 2 : Utiliser onclick au lieu de addEventListener

⚠️ **Problème** : `onclick` écrase les handlers précédents.

```javascript
// ❌ Seul le dernier s'exécute
bouton.onclick = function() { console.log("Premier"); };
bouton.onclick = function() { console.log("Deuxième"); };

// ✅ Les deux s'exécutent
bouton.addEventListener("click", () => console.log("Premier"));
bouton.addEventListener("click", () => console.log("Deuxième"));
```

### Piège 3 : Appeler la fonction au lieu de la passer

⚠️ **Problème** : La fonction s'exécute immédiatement au lieu d'attendre l'événement.

```javascript
// ❌ Incorrect - exécute immédiatement
bouton.addEventListener("click", maFonction());

// ✅ Correct - passe la référence
bouton.addEventListener("click", maFonction);
```

---

## Checklist de Validation

- [ ] Je sais ajouter un écouteur avec `addEventListener`
- [ ] Je sais utiliser l'objet `event`
- [ ] Je sais empêcher le comportement par défaut avec `preventDefault()`
- [ ] Je sais gérer les événements de formulaire
- [ ] Je sais gérer les événements clavier

---

## Exercice Pratique

**Énoncé** : Créer un compteur interactif avec 3 boutons (-1, Reset, +1) et un affichage du compteur. Le compteur ne peut pas descendre en dessous de 0. Ajouter des raccourcis clavier : flèche gauche pour -1, flèche droite pour +1, Escape pour reset.

**Indications** :

- Utilise `addEventListener("click", ...)` pour les 3 boutons
- Utilise `addEventListener("keydown", ...)` sur `document` pour les raccourcis clavier
- Vérifie la propriété `event.key` pour identifier la touche pressée (`"ArrowLeft"`, `"ArrowRight"`, `"Escape"`)
- Avant de décrémenter, vérifie que le compteur est supérieur à 0

**Résultat attendu** : Un compteur qui s'incrémente, se décrémente (sans passer sous 0) et se remet à zéro, via les boutons ou les touches du clavier.

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
    <title>Compteur interactif</title>
    <style>
        body { font-family: sans-serif; text-align: center; margin-top: 50px; }
        #affichage { font-size: 4rem; margin: 20px 0; }
        button { font-size: 1.5rem; padding: 10px 20px; margin: 0 10px; cursor: pointer; }
        .info { color: #888; font-size: 0.9rem; margin-top: 30px; }
    </style>
</head>
<body>
    <h1>Compteur interactif</h1>
    <div id="affichage">0</div>
    <button id="btn-moins">-1</button>
    <button id="btn-reset">Reset</button>
    <button id="btn-plus">+1</button>
    <p class="info">Raccourcis : ← (-1) | → (+1) | Escape (reset)</p>

    <script src="script.js"></script>
</body>
</html>
```

`script.js` :

```javascript
// Variable qui stocke la valeur actuelle du compteur
let compteur = 0;

// Sélectionner les éléments de la page
let affichage = document.getElementById("affichage");
let btnMoins = document.getElementById("btn-moins");
let btnReset = document.getElementById("btn-reset");
let btnPlus = document.getElementById("btn-plus");

// Fonction qui met à jour l'affichage du compteur
function mettreAJour() {
    affichage.textContent = compteur;
}

// Fonction pour incrémenter le compteur
function incrementer() {
    compteur++;
    mettreAJour();
}

// Fonction pour décrémenter le compteur (minimum 0)
function decrementer() {
    if (compteur > 0) {
        compteur--;
        mettreAJour();
    }
}

// Fonction pour remettre le compteur à zéro
function reset() {
    compteur = 0;
    mettreAJour();
}

// Écouteurs sur les boutons
btnPlus.addEventListener("click", incrementer);
btnMoins.addEventListener("click", decrementer);
btnReset.addEventListener("click", reset);

// Écouteur sur le clavier pour les raccourcis
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowRight") {
        incrementer();
    } else if (event.key === "ArrowLeft") {
        decrementer();
    } else if (event.key === "Escape") {
        reset();
    }
});
```

---

## Navigation

← Fiche précédente : **[Manipulation du DOM](03-dom-manipulation.md)**
