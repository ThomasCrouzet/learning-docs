---
tags:
  - JavaScript
  - Symfony
  - Avancé
  - Pratique
description: "Stimulus et Symfony UX"
estimated_time: "75 min"
fiche_number: 6
total_fiches: 7
cursus: "JavaScript"
---

# 06 - Stimulus et Symfony UX

> **En bref** : À la fin de cette fiche, tu sauras utiliser Stimulus pour ajouter des comportements JavaScript interactifs dans un projet Symfony, en organisant ton code par composants réutilisables. Lecture estimée : 75 min.


## Prérequis

- Avoir lu la fiche **[03 - Webpack Encore : Utilisation au quotidien](03-webpack-encore-utilisation.md)** (points d'entrée, imports, compilation)
- Avoir lu la fiche **[02 - Les contrôleurs et les routes](../03-symfony/02-controleurs-routes.md)** (créer un contrôleur, définir une route, retourner une réponse)
- Savoir utiliser les outils de développement du navigateur (console JavaScript)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser Stimulus pour ajouter des comportements JavaScript interactifs dans un projet Symfony, en organisant ton code par composants réutilisables.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Stimulus ?

**Définition** : Stimulus est un framework JavaScript léger créé par Basecamp (les créateurs de Ruby on Rails). Il est conçu pour ajouter des comportements interactifs au HTML existant, sans réécrire toute la page en JavaScript.

**Le problème que Stimulus résout** :

Sans Stimulus, voici les problèmes rencontrés :

1. **Code JavaScript éparpillé** : Le JavaScript est réparti dans des fichiers séparés, dans des balises `<script>` en bas de page, et dans des attributs `onclick`. Il n'y a pas de structure claire.

2. **Sélecteurs CSS fragiles** : Tu utilises `document.querySelector('.btn-toggle')` ou `$('#menu')`. Si un collègue change une classe CSS, le JavaScript casse sans avertissement.

3. **Code non réutilisable** : Un comportement (toggle, compteur, filtrage) est codé pour un seul endroit. Pour le réutiliser ailleurs, tu dois copier-coller le code.

4. **Initialisation manuelle** : Tu dois appeler des fonctions d'initialisation au bon moment (`DOMContentLoaded`, après un chargement AJAX...).

**Comment Stimulus résout ces problèmes** :

| Problème | Solution apportée par Stimulus |
| -------- | ------------------------------ |
| Code éparpillé | Chaque comportement est dans un contrôleur dédié |
| Sélecteurs CSS fragiles | Les targets remplacent les sélecteurs CSS |
| Code non réutilisable | Un contrôleur est réutilisable partout avec `data-controller` |
| Initialisation manuelle | Stimulus détecte automatiquement les contrôleurs dans le DOM |

**Analogie concrète** : Avec jQuery, c'est comme avoir une boîte à outils générale. Tu fouilles dedans pour trouver l'outil qu'il te faut et tu l'utilises où tu veux. Avec Stimulus, c'est comme avoir un assistant spécialisé pour chaque tâche : un assistant pour le menu déroulant, un pour le formulaire de recherche, un pour le panier. Chaque assistant sait exactement quoi faire et sur quels éléments agir.

**Ce que Stimulus n'est PAS** :

- Stimulus n'est pas un framework SPA (Single Page Application) comme React ou Vue. Il ne gère pas le rendu HTML. Ton HTML vient de Twig (côté serveur), Stimulus ajoute les interactions côté client.
- Stimulus n'est pas un remplacement de jQuery pour tout. Si tu as besoin de manipulations DOM complexes ponctuelles, jQuery reste utilisable. Stimulus brille pour organiser les comportements récurrents.

---

### Symfony UX

**Définition** : Symfony UX est l'intégration officielle de Stimulus dans Symfony. Il fournit un bridge (`@symfony/stimulus-bridge`) qui connecte automatiquement les contrôleurs Stimulus à Webpack Encore, plus des packages prêts à l'emploi.

**Ce que Symfony UX ajoute** :

| Fonctionnalité | Description |
| -------------- | ----------- |
| Chargement automatique | Les contrôleurs dans `assets/controllers/` sont détectés automatiquement |
| `stimulus_controller()` | Fonction Twig pour générer les attributs `data-*` proprement |
| `stimulus_action()` | Fonction Twig pour générer les attributs `data-action` |
| `stimulus_target()` | Fonction Twig pour générer les attributs `data-*-target` |
| Packages UX | Composants prêts à l'emploi (Turbo, Autocomplete, etc.) |

**Fichier `assets/controllers.json`** : Ce fichier déclare les contrôleurs fournis par les packages Symfony UX installés. Il est généré automatiquement par Flex.

```json
{
    "controllers": {
        "@symfony/ux-turbo": {
            "turbo-core": {
                "enabled": true,
                "fetch": "eager"
            }
        }
    },
    "entrypoints": []
}
```

---

### Les 3 concepts clés de Stimulus

Stimulus repose sur trois concepts fondamentaux. Tous les trois sont déclarés dans le HTML avec des attributs `data-*`.

**1. Controllers (contrôleurs)** :

Un contrôleur est une classe JavaScript liée à un élément HTML. Il est activé par l'attribut `data-controller`.

```html
<!-- Le contrôleur "hello" est activé sur cette div -->
<div data-controller="hello">
    <!-- Tout le contenu ici est géré par le contrôleur hello -->
</div>
```

**2. Targets (cibles)** :

Un target est un élément HTML auquel le contrôleur a besoin d'accéder. Il remplace `document.querySelector()`.

```html
<div data-controller="hello">
    <!-- Ce span est un target nommé "output" du contrôleur "hello" -->
    <span data-hello-target="output"></span>
</div>
```

**3. Values (valeurs)** :

Une value est une donnée passée depuis le HTML (ou Twig) vers le contrôleur JavaScript. Elle remplace les attributs `data-*` manuels.

```html
<div data-controller="hello"
     data-hello-name-value="John">
</div>
```

**Récapitulatif** :

| Concept | Attribut HTML | Rôle |
| ------- | ------------- | ---- |
| Controller | `data-controller="nom"` | Active un contrôleur sur un élément |
| Target | `data-nom-target="cible"` | Référence un élément dans le contrôleur |
| Value | `data-nom-clé-value="donnée"` | Passe une donnée au contrôleur |

---

### Le cycle de vie d'un contrôleur

**Définition** : Chaque contrôleur Stimulus a des méthodes de cycle de vie qui sont appelées automatiquement à des moments précis.

| Méthode | Quand elle est appelée |
| ------- | ---------------------- |
| `connect()` | Quand l'élément `data-controller` apparaît dans le DOM |
| `disconnect()` | Quand l'élément `data-controller` est retiré du DOM |
| `[nom]TargetConnected(element)` | Quand un target apparaît dans le DOM |
| `[nom]TargetDisconnected(element)` | Quand un target est retiré du DOM |

**Pourquoi c'est utile ?**

- `connect()` : initialiser un composant (charger des données, ajouter un écouteur global).
- `disconnect()` : nettoyer (supprimer un intervalle, fermer une connexion WebSocket).

Le schéma suivant illustre les transitions entre les différents états du cycle de vie d'un contrôleur Stimulus :

<div class="diagram-design">
<p><a href="../../diagrams/05-javascript-06-stimulus-symfony-1.html">Le cycle de vie d&#x27;un contrôleur (HTML + SVG)</a></p>
<iframe src="../../diagrams/05-javascript-06-stimulus-symfony-1.html" title="Le cycle de vie d&#x27;un contrôleur" style="width:100%;min-height:676px;border:0;background:transparent"></iframe>
</div>

```javascript
// assets/controllers/clock_controller.js

import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    connect() {
        // Appelé quand le contrôleur apparaît dans le DOM
        // Démarre un timer qui met à jour l'heure chaque seconde
        this.timer = setInterval(() => {
            this.element.textContent = new Date().toLocaleTimeString();
        }, 1000);
    }

    disconnect() {
        // Appelé quand le contrôleur est retiré du DOM
        // Arrête le timer pour éviter les fuites de mémoire
        clearInterval(this.timer);
    }
}
```

---

### Les actions

**Définition** : Une action lie un événement DOM (click, input, submit...) à une méthode du contrôleur. L'attribut `data-action` utilise la syntaxe `événement->contrôleur#méthode`.

**Syntaxe** :

```text
data-action="événement->contrôleur#méthode"
```

**Exemples** :

```html
<!-- Clic sur un bouton -->
<button data-action="click->hello#greet">Dire bonjour</button>

<!-- Saisie dans un champ -->
<input data-action="input->search#filter" type="text">

<!-- Soumission d'un formulaire -->
<form data-action="submit->form#save">

<!-- Plusieurs actions sur un même élément -->
<input data-action="input->search#filter keydown.enter->search#submit">
```

**Événements par défaut** : Stimulus définit un événement par défaut selon la balise. Si tu ne précises pas l'événement, Stimulus utilise celui-ci :

| Balise | Événement par défaut |
| ------ | -------------------- |
| `<button>` | `click` |
| `<a>` | `click` |
| `<input>` | `input` |
| `<select>` | `change` |
| `<form>` | `submit` |
| `<textarea>` | `input` |

```html
<!-- Ces deux lignes sont équivalentes -->
<button data-action="click->hello#greet">Dire bonjour</button>
<button data-action="hello#greet">Dire bonjour</button>
```

---

### Stimulus vs jQuery

| Critère | jQuery | Stimulus |
| ------- | ------ | -------- |
| Approche | Sélectionner des éléments et les manipuler | Déclarer des comportements dans le HTML |
| Organisation | Libre (souvent désorganisé) | Un contrôleur par comportement |
| Lien HTML/JS | Via des sélecteurs CSS (fragiles) | Via des attributs `data-*` (explicites) |
| Réutilisation | Copier-coller le code | Ajouter `data-controller` à un nouvel élément |
| Initialisation | Manuelle (`$(document).ready()`) | Automatique (Stimulus détecte le DOM) |
| Poids | ~87 Ko (minifié) / ~30 Ko (gzippé) | ~8 Ko (minifié) |

**Quand utiliser quoi ?**

- **Stimulus** : comportements interactifs récurrents (toggle, tabs, filtres, compteur, validation en temps réel).
- **jQuery** : projet existant qui l'utilise déjà, manipulation DOM ponctuelle, plugins jQuery spécifiques.

---

### Packages Symfony UX populaires

Symfony fournit des packages prêts à l'emploi qui s'intègrent avec Stimulus :

| Package | Description |
| ------- | ----------- |
| `@symfony/ux-turbo` | Navigation sans rechargement (remplace AJAX pour les pages) |
| `@symfony/ux-autocomplete` | Champ de recherche avec autocomplétion |
| `@symfony/ux-live-component` | Composants Twig interactifs sans écrire de JavaScript |
| `@symfony/ux-chartjs` | Graphiques avec Chart.js |
| `@symfony/ux-notify` | Notifications navigateur |

Ces packages ne sont pas détaillés dans cette fiche. L'objectif ici est de maîtriser Stimulus lui-même. Tu pourras ensuite ajouter ces packages selon tes besoins.

---

## Étapes Pratiques

### Étape 1 : Vérifier l'installation de Stimulus

Si tu as installé Webpack Encore avec `symfony/webpack-encore-bundle`, Stimulus est déjà configuré. Vérifie les fichiers suivants.

**Fichier `assets/bootstrap.js`** :

```javascript
// assets/bootstrap.js

import { startStimulusApp } from '@symfony/stimulus-bridge';

// Charge les contrôleurs depuis assets/controllers/ et controllers.json
export const app = startStimulusApp(require.context(
    '@symfony/stimulus-bridge/lazy-controller-loader!./controllers',
    true,
    /\.[jt]sx?$/
));
```

Ce fichier :

1. Importe le bridge Stimulus de Symfony.
2. Charge automatiquement tous les contrôleurs du dossier `assets/controllers/`.
3. Charge les contrôleurs déclarés dans `assets/controllers.json` (packages UX).

**Fichier `assets/app.js`** : Vérifie qu'il importe `bootstrap.js` :

```javascript
// assets/app.js

import './bootstrap';
import './styles/app.css';
```

**Fichier `assets/controllers.json`** : Ce fichier existe même si tu n'as installé aucun package UX :

```json
{
    "controllers": {},
    "entrypoints": []
}
```

**Structure attendue** :

```text
assets/
├── app.js                 # Point d'entrée principal
├── bootstrap.js           # Initialisation Stimulus
├── controllers/           # Tes contrôleurs Stimulus
│   └── hello_controller.js  # Contrôleur d'exemple (peut ne pas exister)
├── controllers.json       # Contrôleurs des packages UX
└── styles/
    └── app.css
```

Si le dossier `assets/controllers/` n'existe pas, crée-le :

```bash
mkdir -p assets/controllers
```

---

### Étape 2 : Créer un contrôleur hello

Crée le fichier `assets/controllers/hello_controller.js` :

```javascript
// assets/controllers/hello_controller.js

import { Controller } from '@hotwired/stimulus';

// Le nom du fichier détermine le nom du contrôleur :
// hello_controller.js → data-controller="hello"
export default class extends Controller {

    // Déclarer les targets que ce contrôleur utilise
    static targets = ['name', 'output'];

    // Méthode appelée par une action (data-action="hello#greet")
    greet() {
        // this.nameTarget accède au target "name"
        // this.outputTarget accède au target "output"
        const name = this.nameTarget.value;
        this.outputTarget.textContent = 'Bonjour, ' + name + ' !';
    }
}
```

**Convention de nommage des fichiers** :

| Nom du fichier | Nom du contrôleur |
| -------------- | ----------------- |
| `hello_controller.js` | `hello` |
| `search_filter_controller.js` | `search-filter` |
| `modal_dialog_controller.js` | `modal-dialog` |

**Règle** : Le nom du fichier utilise des underscores (`_`). Le nom dans le HTML utilise des tirets (`-`). Les underscores du fichier sont convertis en tirets dans le HTML.

---

### Étape 3 : Utiliser le contrôleur dans Twig

Crée un template qui utilise le contrôleur hello :

```twig
{# templates/hello/index.html.twig #}

{% extends 'base.html.twig' %}

{% block body %}
    {# data-controller="hello" active le contrôleur hello_controller.js #}
    <div data-controller="hello">
        <h1>Stimulus - Hello World</h1>

        {# data-hello-target="name" déclare ce champ comme target "name" #}
        <input data-hello-target="name"
               type="text"
               placeholder="Ton prénom">

        {# data-action="click->hello#greet" : au clic, appelle la méthode greet() #}
        <button data-action="click->hello#greet">Dire bonjour</button>

        {# data-hello-target="output" déclare ce paragraphe comme target "output" #}
        <p data-hello-target="output"></p>
    </div>
{% endblock %}
```

**Résultat attendu** :

1. Tu tapes "John" dans le champ.
2. Tu cliques sur "Dire bonjour".
3. Le paragraphe affiche "Bonjour, John !".

Compile avec Webpack Encore :

```bash
npm run watch
```

---

### Étape 4 : Les targets en détail

**Déclarer les targets** dans le contrôleur :

```javascript
// assets/controllers/list_controller.js

import { Controller } from '@hotwired/stimulus';

export default class extends Controller {

    // Déclarer les targets avec "static targets"
    // Chaque nom crée des propriétés d'accès automatiques
    static targets = ['item', 'count', 'empty'];

    connect() {
        // Appelé quand le contrôleur est attaché au DOM
        this.updateCount();
    }

    remove(event) {
        // event.currentTarget est l'élément qui a déclenché l'action
        // closest() remonte dans le DOM pour trouver l'ancêtre le plus proche
        const item = event.currentTarget.closest('[data-list-target="item"]');
        item.remove();
        this.updateCount();
    }

    updateCount() {
        // this.itemTargets (pluriel) retourne un tableau de tous les targets "item"
        const count = this.itemTargets.length;
        this.countTarget.textContent = count;

        // this.hasEmptyTarget vérifie si le target "empty" existe dans le DOM
        if (this.hasEmptyTarget) {
            this.emptyTarget.hidden = count > 0;
        }
    }
}
```

**Propriétés générées automatiquement** :

Pour un target nommé `item`, Stimulus crée :

| Propriété | Type | Description |
| --------- | ---- | ----------- |
| `this.itemTarget` | Élément | Le premier élément target "item" |
| `this.itemTargets` | Array | Tous les éléments target "item" |
| `this.hasItemTarget` | boolean | `true` s'il existe au moins un target "item" |

Le template Twig correspondant :

```twig
{# templates/list/index.html.twig #}

{% extends 'base.html.twig' %}

{% block body %}
    <div data-controller="list">
        <h1>Ma liste (<span data-list-target="count">0</span> éléments)</h1>

        <p data-list-target="empty">Aucun élément dans la liste.</p>

        <ul>
            <li data-list-target="item">
                Élément 1
                <button data-action="list#remove">Supprimer</button>
            </li>
            <li data-list-target="item">
                Élément 2
                <button data-action="list#remove">Supprimer</button>
            </li>
            <li data-list-target="item">
                Élément 3
                <button data-action="list#remove">Supprimer</button>
            </li>
        </ul>
    </div>
{% endblock %}
```

---

### Étape 5 : Les values (données depuis Twig)

**Déclarer les values** dans le contrôleur avec leur type :

```javascript
// assets/controllers/counter_controller.js

import { Controller } from '@hotwired/stimulus';

export default class extends Controller {

    // Déclarer les values avec leur type
    static values = {
        count: { type: Number, default: 0 },
        step: { type: Number, default: 1 },
        label: { type: String, default: 'Compteur' },
    };

    // Déclarer les targets
    static targets = ['display'];

    connect() {
        this.render();
    }

    increment() {
        // this.countValue accède à la value "count"
        // La modification est automatiquement typée (Number)
        this.countValue += this.stepValue;
    }

    decrement() {
        this.countValue -= this.stepValue;
    }

    // Callback automatique : appelé chaque fois que countValue change
    countValueChanged() {
        this.render();
    }

    render() {
        this.displayTarget.textContent = this.labelValue + ' : ' + this.countValue;
    }
}
```

**Types disponibles pour les values** :

| Type | Exemple HTML | Valeur JS |
| ---- | ------------ | --------- |
| `Number` | `data-counter-count-value="5"` | `5` (number) |
| `String` | `data-counter-label-value="Total"` | `"Total"` (string) |
| `Boolean` | `data-toggle-open-value="true"` | `true` (boolean) |
| `Array` | `data-list-items-value='["a","b"]'` | `["a", "b"]` (array) |
| `Object` | `data-config-options-value='{"k":"v"}'` | `{k: "v"}` (object) |

**Passer les values depuis Twig** :

```twig
{# Méthode 1 : attributs data-* manuels #}
<div data-controller="counter"
     data-counter-count-value="10"
     data-counter-step-value="5"
     data-counter-label-value="Score">
    <p data-counter-target="display"></p>
    <button data-action="counter#increment">+</button>
    <button data-action="counter#decrement">-</button>
</div>
```

```twig
{# Méthode 2 : la fonction Twig stimulus_controller() (recommandée) #}
<div {{ stimulus_controller('counter', {
    count: 10,
    step: 5,
    label: 'Score'
}) }}>
    <p data-counter-target="display"></p>
    <button data-action="counter#increment">+</button>
    <button data-action="counter#decrement">-</button>
</div>
```

La fonction `stimulus_controller()` génère automatiquement les attributs `data-controller` et `data-counter-*-value` correctement. Elle est plus sûre car elle échappe les valeurs.

**Callbacks de changement de value** :

Quand une value change, Stimulus appelle automatiquement la méthode `[nom]ValueChanged()` si elle existe :

| Value | Callback automatique |
| ----- | -------------------- |
| `count` | `countValueChanged()` |
| `label` | `labelValueChanged()` |
| `step` | `stepValueChanged()` |

---

### Étape 6 : Le cycle de vie en pratique

```javascript
// assets/controllers/tabs_controller.js

import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['tab', 'panel'];
    static values = {
        activeIndex: { type: Number, default: 0 },
    };

    connect() {
        // Appelé quand l'élément data-controller="tabs" apparaît
        // Initialise l'état : affiche le premier onglet
        this.showTab(this.activeIndexValue);
    }

    disconnect() {
        // Appelé quand l'élément est retiré du DOM
        // Nettoyer les ressources si nécessaire
        // (pas nécessaire ici, mais utile pour les timers, WebSockets, etc.)
    }

    select(event) {
        // Trouver l'index de l'onglet cliqué
        const index = this.tabTargets.indexOf(event.currentTarget);
        this.activeIndexValue = index;
    }

    // Callback : appelé quand activeIndexValue change
    activeIndexValueChanged() {
        this.showTab(this.activeIndexValue);
    }

    showTab(index) {
        // Mettre à jour les onglets
        this.tabTargets.forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });

        // Mettre à jour les panneaux
        this.panelTargets.forEach((panel, i) => {
            panel.hidden = i !== index;
        });
    }
}
```

Le template :

```twig
{# templates/components/tabs.html.twig #}

<div data-controller="tabs">
    <div class="tabs-nav">
        <button data-tabs-target="tab"
                data-action="tabs#select"
                class="active">Onglet 1</button>
        <button data-tabs-target="tab"
                data-action="tabs#select">Onglet 2</button>
        <button data-tabs-target="tab"
                data-action="tabs#select">Onglet 3</button>
    </div>

    <div data-tabs-target="panel">
        <p>Contenu de l'onglet 1.</p>
    </div>
    <div data-tabs-target="panel" hidden>
        <p>Contenu de l'onglet 2.</p>
    </div>
    <div data-tabs-target="panel" hidden>
        <p>Contenu de l'onglet 3.</p>
    </div>
</div>
```

---

### Étape 7 : Construire un composant complet (toggle de visibilité)

Ce composant affiche ou cache un contenu quand on clique sur un bouton. C'est un pattern très courant (FAQ, accordéon, menu déroulant).

**Le contrôleur** :

```javascript
// assets/controllers/toggle_controller.js

import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['content', 'button'];
    static values = {
        open: { type: Boolean, default: false },
        openText: { type: String, default: 'Masquer' },
        closeText: { type: String, default: 'Afficher' },
    };

    connect() {
        // Initialiser l'état au chargement
        this.render();
    }

    toggle() {
        // Inverser l'état
        this.openValue = !this.openValue;
    }

    // Callback automatique quand openValue change
    openValueChanged() {
        this.render();
    }

    render() {
        // Afficher ou cacher le contenu
        this.contentTarget.hidden = !this.openValue;

        // Mettre à jour le texte du bouton si le target existe
        if (this.hasButtonTarget) {
            this.buttonTarget.textContent = this.openValue
                ? this.openTextValue
                : this.closeTextValue;
        }
    }
}
```

**Le template** :

```twig
{# Un toggle simple #}
<div {{ stimulus_controller('toggle', { open: false }) }}>
    <button data-toggle-target="button"
            data-action="toggle#toggle">Afficher</button>

    <div data-toggle-target="content" hidden>
        <p>Ce contenu est affiché ou caché par le contrôleur toggle.</p>
    </div>
</div>

{# Un toggle personnalisé (FAQ) #}
<div {{ stimulus_controller('toggle', {
    open: false,
    openText: 'Fermer la réponse',
    closeText: 'Voir la réponse'
}) }}>
    <h3>Comment fonctionne Stimulus ?</h3>
    <button data-toggle-target="button"
            data-action="toggle#toggle">Voir la réponse</button>

    <div data-toggle-target="content" hidden>
        <p>Stimulus lie le HTML au JavaScript via des attributs data-*.</p>
    </div>
</div>
```

**Réutilisation** : Le même contrôleur `toggle` est utilisé deux fois avec des textes différents. Pas besoin de dupliquer le code JavaScript.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npm run watch` | Compiler et surveiller les modifications Stimulus |
| `npm run dev` | Compiler une fois en mode développement |
| `npm run build` | Compiler en mode production |
| `php bin/console debug:twig` | Vérifier que les fonctions `stimulus_*` sont disponibles |
| `mkdir -p assets/controllers` | Créer le dossier des contrôleurs si absent |

---

## Pièges Fréquents

### Piège 1 : Nom du contrôleur incorrect (kebab-case vs underscore)

**Problème** : Le contrôleur n'est pas détecté. Rien ne se passe quand tu interagis avec la page.

**Solution** : Le nom du fichier utilise des underscores, mais le HTML utilise des tirets.

```text
Fichier : search_filter_controller.js
HTML :    data-controller="search-filter"    ✅
HTML :    data-controller="search_filter"    ❌
HTML :    data-controller="searchFilter"     ❌
```

---

### Piège 2 : Oublier de déclarer les targets ou values avec `static`

**Problème** : Erreur "target not found" ou la value est toujours `undefined`.

**Solution** : Les targets et values doivent être déclarés avec le mot-clé `static`.

```javascript
// ❌ Incorrect : pas de static
export default class extends Controller {
    targets = ['name'];   // Ne fonctionne pas
    values = {};          // Ne fonctionne pas
}

// ✅ Correct : avec static
export default class extends Controller {
    static targets = ['name'];
    static values = {
        count: { type: Number, default: 0 },
    };
}
```

---

### Piège 3 : Webpack non recompilé après l'ajout d'un contrôleur

**Problème** : Tu crées un nouveau fichier dans `assets/controllers/`, mais le contrôleur n'est pas détecté.

**Solution** : Si `npm run watch` est en cours, il détecte automatiquement les nouveaux fichiers. Si ce n'est pas le cas, arrête avec Ctrl+C et relance :

```bash
npm run watch
```

Vérifie aussi que le fichier est dans le bon dossier (`assets/controllers/`) et que le nom se termine par `_controller.js`.

---

### Piège 4 : Confondre Stimulus et Turbo

**Problème** : Tu utilises `data-turbo-*` en pensant que c'est Stimulus, ou inversement.

**Solution** : Stimulus et Turbo sont deux outils différents fournis par le même écosystème (Hotwire).

| Stimulus | Turbo |
| -------- | ----- |
| Ajoute des **comportements** JS au HTML | Accélère la **navigation** entre pages |
| `data-controller`, `data-action` | `data-turbo-frame`, `data-turbo-stream` |
| Tu écris du JavaScript | Pas de JavaScript à écrire |
| Tu gères des interactions (clic, saisie) | Tu gères des chargements de page |

---

### Piège 5 : Le target est en dehors du scope du contrôleur

**Problème** : Erreur "Missing target" alors que l'élément existe dans la page.

**Solution** : Un target doit être à l'intérieur de l'élément qui a `data-controller`. Si le target est en dehors, le contrôleur ne le voit pas.

```html
<!-- ❌ Le target est en dehors du contrôleur -->
<div data-controller="hello">
    <button data-action="hello#greet">Dire bonjour</button>
</div>
<p data-hello-target="output"></p>  <!-- En dehors ! -->

<!-- ✅ Le target est à l'intérieur du contrôleur -->
<div data-controller="hello">
    <button data-action="hello#greet">Dire bonjour</button>
    <p data-hello-target="output"></p>  <!-- À l'intérieur -->
</div>
```

---

## Checklist de Validation

- [ ] Je sais vérifier que Stimulus est installé (`bootstrap.js`, `controllers.json`)
- [ ] Je sais créer un contrôleur dans `assets/controllers/`
- [ ] Je sais utiliser `data-controller` pour activer un contrôleur
- [ ] Je sais déclarer et utiliser des targets (`static targets`, `this.nomTarget`)
- [ ] Je sais déclarer et utiliser des values avec leurs types (`static values`)
- [ ] Je sais utiliser `data-action` pour lier un événement à une méthode
- [ ] Je sais utiliser `connect()` et `disconnect()` pour le cycle de vie
- [ ] Je sais utiliser `stimulus_controller()` dans Twig pour passer des values
- [ ] Je comprends la différence entre Stimulus et jQuery

---

## Exercice Pratique

**Énoncé** : Crée un composant "Panier d'achat" avec Stimulus.

**Fonctionnalités demandées** :

1. Une liste de 3 produits avec un bouton "Ajouter au panier" pour chacun.
2. Un panier qui affiche les articles ajoutés avec leur quantité.
3. Un bouton "Supprimer" pour chaque article du panier.
4. Un compteur du nombre total d'articles dans le panier.
5. Le total en euros du panier.

**Indications** :

- Crée un contrôleur `cart_controller.js` dans `assets/controllers/`
- Utilise les values pour stocker les données des produits (passées depuis Twig)
- Utilise les targets pour accéder au compteur, au total et à la liste du panier
- La liste des produits est statique (pas besoin de requête serveur)
- Les produits :
  - Clavier sans fil : 29.99 EUR
  - Souris ergonomique : 45.00 EUR
  - Casque audio : 79.99 EUR

**Résultat attendu** :

1. Tu cliques sur "Ajouter au panier" à côté de "Clavier sans fil".
2. Le panier affiche "Clavier sans fil x1 - 29.99 EUR" et le total "29.99 EUR".
3. Tu cliques encore sur "Ajouter au panier" pour le clavier.
4. Le panier affiche "Clavier sans fil x2 - 59.98 EUR" et le total "59.98 EUR".
5. Tu ajoutes "Souris ergonomique".
6. Le panier affiche 2 lignes, total "104.98 EUR", compteur "3 articles".
7. Tu cliques sur "Supprimer" à côté du clavier : il disparaît, total "45.00 EUR".

---

## Solution de l'Exercice

> **Note** : Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Le contrôleur** `assets/controllers/cart_controller.js` :

```javascript
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['cartList', 'cartCount', 'cartTotal', 'emptyMessage'];
    static values = {
        items: { type: Array, default: [] },
    };

    add(event) {
        // Récupérer les données du produit depuis les attributs data-*
        const button = event.currentTarget;
        const id = button.dataset.productId;
        const name = button.dataset.productName;
        const price = parseFloat(button.dataset.productPrice);

        // Copier le tableau actuel (Stimulus détecte le changement par référence)
        const items = [...this.itemsValue];

        // Chercher si le produit est déjà dans le panier
        const existing = items.find(item => item.id === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            items.push({ id: id, name: name, price: price, quantity: 1 });
        }

        // Mettre à jour la value (déclenche itemsValueChanged)
        this.itemsValue = items;
    }

    remove(event) {
        const id = event.currentTarget.dataset.productId;

        // Filtrer l'article supprimé
        this.itemsValue = this.itemsValue.filter(item => item.id !== id);
    }

    // Callback automatique : appelé quand itemsValue change
    itemsValueChanged() {
        this.render();
    }

    render() {
        const items = this.itemsValue;

        // Calculer le nombre total d'articles
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
        this.cartCountTarget.textContent = totalCount + ' article' + (totalCount > 1 ? 's' : '');

        // Calculer le total en euros
        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        this.cartTotalTarget.textContent = totalPrice.toFixed(2) + ' €';

        // Afficher ou cacher le message "panier vide"
        if (this.hasEmptyMessageTarget) {
            this.emptyMessageTarget.hidden = items.length > 0;
        }

        // Construire la liste HTML du panier
        this.cartListTarget.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            const subtotal = (item.price * item.quantity).toFixed(2);
            li.textContent = item.name + ' x' + item.quantity + ' - ' + subtotal + ' €  ';

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Supprimer';
            removeBtn.dataset.productId = item.id;
            removeBtn.dataset.action = 'cart#remove';
            li.appendChild(removeBtn);

            this.cartListTarget.appendChild(li);
        });
    }
}
```

**Le template** `templates/cart/index.html.twig` :

```twig
{% extends 'base.html.twig' %}

{% block body %}
    <div {{ stimulus_controller('cart') }}>
        <h1>Boutique</h1>

        <h2>Produits</h2>
        <ul>
            <li>
                Clavier sans fil - 29.99 €
                <button data-action="cart#add"
                        data-product-id="1"
                        data-product-name="Clavier sans fil"
                        data-product-price="29.99">
                    Ajouter au panier
                </button>
            </li>
            <li>
                Souris ergonomique - 45.00 €
                <button data-action="cart#add"
                        data-product-id="2"
                        data-product-name="Souris ergonomique"
                        data-product-price="45.00">
                    Ajouter au panier
                </button>
            </li>
            <li>
                Casque audio - 79.99 €
                <button data-action="cart#add"
                        data-product-id="3"
                        data-product-name="Casque audio"
                        data-product-price="79.99">
                    Ajouter au panier
                </button>
            </li>
        </ul>

        <h2>Panier (<span data-cart-target="cartCount">0 article</span>)</h2>
        <p data-cart-target="emptyMessage">Le panier est vide.</p>
        <ul data-cart-target="cartList"></ul>
        <p><strong>Total : <span data-cart-target="cartTotal">0.00 €</span></strong></p>
    </div>
{% endblock %}
```

**Compilation et test** :

```bash
npm run watch
```

Accède à la page dans le navigateur. Clique sur "Ajouter au panier" pour vérifier que le panier se met à jour. Clique sur "Supprimer" pour retirer un article.

---

## Navigation

← Fiche précédente : **[05 - jQuery et AJAX dans Symfony](05-jquery-ajax-symfony.md)**

→ Fiche suivante : **[07 - Symfony AssetMapper](07-assetmapper-symfony.md)**
