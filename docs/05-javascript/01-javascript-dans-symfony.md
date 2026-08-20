---
tags:
  - JavaScript
  - Symfony
  - Débutant
  - Pratique
description: "JavaScript dans Symfony"
estimated_time: "60 min"
fiche_number: 1
total_fiches: 7
cursus: "JavaScript"
---

# 01 - JavaScript dans Symfony

> **En bref** : À la fin de cette fiche, tu sauras comment JavaScript s'intègre dans un projet Symfony, où placer tes fichiers JS et comment les inclure dans tes templates Twig. Lecture estimée : 60 min.


## Prérequis

- Avoir lu les fiches **[Introduction à JavaScript](../fondamentaux/05-javascript/01-introduction-js.md)**, **[Variables et fonctions](../fondamentaux/05-javascript/02-variables-fonctions.md)**, **[Manipulation du DOM](../fondamentaux/05-javascript/03-dom-manipulation.md)** et **[Événements](../fondamentaux/05-javascript/04-evenements.md)** (bases JS, DOM, événements)
- Avoir lu la fiche **[03 - Templates Twig](../03-symfony/03-templates-twig.md)** (héritage de templates, blocs, fonctions Twig)
- Avoir un projet Symfony fonctionnel avec un serveur de développement accessible

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Symfony | 7.4 LTS |
| PHP | 8.3 |
| Twig | 3.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras comment JavaScript s'intègre dans un projet Symfony, où placer tes fichiers JS et comment les inclure dans tes templates Twig.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le frontend et le backend dans Symfony ?

**Définition** : Dans un projet Symfony, le **backend** désigne le code PHP exécuté sur le serveur (contrôleurs, entités, services). Le **frontend** désigne le code exécuté dans le navigateur de l'utilisateur (HTML, CSS, JavaScript).

**Le problème que cette séparation résout** :

Sans séparation claire entre frontend et backend :

1. **Mélange des responsabilités** : Le code PHP gère à la fois la logique métier et l'interactivité de la page.
2. **Maintenance difficile** : Un changement d'animation dans la page oblige à toucher le code serveur.
3. **Performances dégradées** : Chaque interaction utilisateur nécessite un rechargement complet de la page.

**Comment cette séparation résout ces problèmes** :

| Problème | Solution apportée par la séparation |
| -------- | ----------------------------------- |
| Mélange des responsabilités | PHP gère les données, JS gère l'interactivité |
| Maintenance difficile | Modifier le JS n'impacte pas le PHP, et inversement |
| Performances dégradées | JS réagit instantanément sans recharger la page |

**Analogie concrète** : Imagine un restaurant. La cuisine (backend/PHP) prépare les plats et gère les stocks. La salle (frontend/JS) s'occupe de l'expérience client : présentation des plats, interaction avec le serveur, ambiance. La cuisine n'a pas besoin de savoir comment la table est décorée. La salle n'a pas besoin de savoir comment le plat est cuisiné. Chacun a son rôle.

**Ce que la séparation n'est PAS** :

- La séparation frontend/backend ne signifie pas que les deux parties sont indépendantes. Le frontend dépend du backend pour recevoir les données.
- La séparation ne signifie pas deux projets séparés. Dans Symfony, le frontend et le backend coexistent dans le même projet.

Le schéma suivant illustre comment le navigateur, Symfony et JavaScript interagissent dans cette architecture :

<div class="diagram-design">
<p><a href="../../diagrams/05-javascript-01-javascript-dans-symfony-1.html">Qu&#x27;est-ce que le frontend et le backend dans Symfony ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/05-javascript-01-javascript-dans-symfony-1.html" title="Qu&#x27;est-ce que le frontend et le backend dans Symfony ?" style="width:100%;min-height:564px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que le dossier `assets/` ?

**Définition** : Le dossier `assets/` est le répertoire source où tu places tes fichiers JavaScript, CSS et images avant qu'ils soient traités (compilés, minifiés) pour la production.

**Le problème que le dossier `assets/` résout** :

Sans dossier `assets/` dédié :

1. **Fichiers sources accessibles** : Les fichiers JS de développement sont directement visibles par les visiteurs.
2. **Pas de compilation** : Impossible d'utiliser `import`/`export` ES6 ou SCSS.
3. **Organisation chaotique** : Pas de convention claire pour les fichiers frontend.

**Comment le dossier `assets/` résout ces problèmes** :

| Problème | Solution apportée par `assets/` |
| -------- | ------------------------------- |
| Fichiers sources accessibles | Les sources restent privées dans `assets/`, seuls les fichiers compilés vont dans `public/` |
| Pas de compilation | `assets/` est le point d'entrée pour Webpack Encore |
| Organisation chaotique | Convention claire : tout le frontend est dans `assets/` |

**Analogie concrète** : Le dossier `assets/` est comme l'arrière-boutique d'un magasin. C'est là que tu stockes les produits bruts et les prépares. Le dossier `public/` est la vitrine : seuls les produits prêts à être vendus y sont exposés.

**Structure typique du dossier `assets/`** :

```text
assets/
├── app.js              # Point d'entrée JavaScript principal
├── styles/
│   └── app.css         # Feuille de style principale
├── controllers/        # Contrôleurs Stimulus (JS interactif)
│   └── hello_controller.js
└── images/             # Images sources (optionnel)
    └── logo.png
```

**Règle** : Ne modifie jamais directement les fichiers dans `public/build/`. Modifie toujours les fichiers dans `assets/` puis lance la compilation.

---

### Qu'est-ce que le dossier `public/` et `public/build/` ?

**Définition** : Le dossier `public/` est le seul dossier accessible depuis le navigateur. C'est la racine web du serveur. Le sous-dossier `public/build/` contient les fichiers CSS et JS compilés par Webpack Encore.

| Dossier | Accessible par le navigateur | Contenu |
| ------- | ---------------------------- | ------- |
| `assets/` | Non | Fichiers sources (JS, CSS) |
| `public/` | Oui | `index.php`, images, fichiers statiques |
| `public/build/` | Oui | Fichiers compilés par Webpack Encore |

**Règle** : Le dossier `public/build/` est généré automatiquement. Il est listé dans `.gitignore` et ne doit pas être versionné.

---

### Qu'est-ce que la fonction `asset()` de Twig ?

**Définition** : La fonction `asset()` est une fonction Twig fournie par Symfony qui génère le chemin correct vers un fichier statique dans le dossier `public/`.

**Le problème que `asset()` résout** :

Sans la fonction `asset()` :

1. **Chemins cassés** : Si l'application est dans un sous-dossier, les chemins en dur ne fonctionnent plus.
2. **Pas de cache-busting** : Le navigateur garde en cache l'ancien fichier après une modification.

**Comment `asset()` résout ces problèmes** :

| Problème | Solution apportée par `asset()` |
| -------- | ------------------------------- |
| Chemins cassés | Génère automatiquement le chemin correct selon la configuration |
| Pas de cache-busting | Ajoute un suffixe de version pour forcer le rechargement |

**Exemple concret** :

```twig
{# Sans asset() - chemin en dur (fragile) #}
<script src="/js/app.js"></script>

{# Avec asset() - chemin généré par Symfony (robuste) #}
<script src="{{ asset('js/app.js') }}"></script>
```

**Règle** : Utilise toujours `asset()` pour référencer des fichiers dans `public/`. Ne mets jamais de chemin en dur dans tes templates.

---

### Qu'est-ce que le bloc `javascripts` dans Twig ?

**Définition** : Le bloc `{% block javascripts %}` est un bloc défini dans le template de base (`base.html.twig`) qui permet aux templates enfants d'ajouter des fichiers JavaScript spécifiques à chaque page.

**Le problème que ce bloc résout** :

Sans bloc `javascripts` :

1. **Tous les JS sur toutes les pages** : Charger tous les fichiers JavaScript même s'ils ne sont pas nécessaires.
2. **Pas de contrôle par page** : Impossible d'ajouter un script uniquement sur une page spécifique.

**Comment le bloc `javascripts` résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Tous les JS sur toutes les pages | Chaque template enfant ajoute uniquement les JS dont il a besoin |
| Pas de contrôle par page | Le bloc permet un contrôle fin par template |

**Analogie concrète** : Le bloc `javascripts` est comme un emplacement réservé dans un classeur. Le classeur (template de base) a un onglet "Scripts" à la fin. Chaque fiche (template enfant) peut glisser ses propres scripts dans cet onglet.

---

### Qu'est-ce que Webpack Encore ?

**Définition** : Webpack Encore est un outil Symfony qui compile, optimise et regroupe les fichiers CSS et JavaScript du dossier `assets/` pour produire des fichiers prêts pour la production dans `public/build/`.

**Le problème que Webpack Encore résout** :

Sans Webpack Encore :

1. **Pas de modules JS** : Impossible d'utiliser `import`/`export` pour organiser le code.
2. **Pas de minification** : Les fichiers JS et CSS restent volumineux en production.
3. **Pas de SCSS/Sass** : Impossible d'utiliser des préprocesseurs CSS.

**Comment Webpack Encore résout ces problèmes** :

| Problème | Solution apportée par Webpack Encore |
| -------- | ------------------------------------ |
| Pas de modules JS | Supporte `import`/`export` ES6 |
| Pas de minification | Minifie automatiquement en production |
| Pas de SCSS/Sass | Compile SCSS en CSS |

**Analogie concrète** : Webpack Encore est comme un robot de cuisine. Tu mets les ingrédients bruts dedans (fichiers sources dans `assets/`). Le robot les découpe, les mélange et les assaisonne. À la sortie, tu obtiens un plat prêt à servir (fichiers optimisés dans `public/build/`).

**Ce que Webpack Encore n'est PAS** :

- Webpack Encore n'est pas obligatoire pour utiliser JavaScript dans Symfony. Tu peux très bien ajouter des fichiers JS manuellement dans `public/` et les inclure avec des balises `<script>`.
- Webpack Encore n'est pas Webpack. C'est une surcouche simplifiée au-dessus de Webpack, créée par Symfony pour faciliter la configuration.

**Règle** : Cette fiche te montre comment intégrer du JS **sans** Webpack Encore. La fiche suivante traite de l'installation et de l'utilisation de Webpack Encore.

> **Limites de la méthode `public/js/`** : Placer des fichiers JavaScript directement dans `public/js/` est fonctionnel pour apprendre ou pour des scripts simples et ponctuels. Cette méthode ne bénéficie pas du versioning automatique (cache-busting), de la minification, ni de la gestion des modules `import`/`export`. Pour un projet en production, utilise Webpack Encore (fiche 02) ou AssetMapper.

---

### Qu'est-ce que Stimulus ?

**Définition** : Stimulus est un framework JavaScript léger recommandé par Symfony pour ajouter de l'interactivité aux pages HTML. Il est intégré à Symfony via le package Symfony UX.

**Pourquoi mentionner Stimulus ici** : Tu le rencontreras dans les projets Symfony modernes. Une fiche dédiée existe, mais il est important de savoir qu'il existe dès maintenant.

**Comparaison des approches JavaScript dans Symfony** :

| Approche | Complexité | Cas d'usage |
| -------- | ---------- | ----------- |
| `<script>` inline dans Twig | Faible | Prototype rapide, script ponctuel |
| Fichier JS externe avec `asset()` | Faible | Scripts simples, sans dépendances |
| Webpack Encore + `import` | Moyenne | Projet structuré avec plusieurs fichiers JS |
| Stimulus (Symfony UX) | Moyenne | Interactivité déclarative, composants réutilisables |

**Règle** : Pour un projet Symfony en production, la combinaison recommandée est Webpack Encore + Stimulus. Pour cette fiche d'introduction, on commence par les bases (scripts inline et fichiers externes).

---

## Étapes Pratiques

### Étape 1 : Identifier la structure JavaScript d'un projet Symfony

Ouvre un terminal à la racine de ton projet Symfony et examine la structure :

```bash
# Afficher la structure des dossiers liés au frontend
ls -la assets/
ls -la public/
```

**Résultat attendu** :

```text
assets/                          public/
├── app.js          (source)     ├── index.php    (point d'entrée PHP)
├── styles/                      ├── build/       (fichiers compilés)
│   └── app.css                  └── favicon.ico
└── controllers/
```

---

### Étape 2 : Comprendre le template de base

Ouvre le fichier `templates/base.html.twig` :

```bash
cat templates/base.html.twig
```

**Contenu typique** :

```twig
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>{% block title %}Mon Site{% endblock %}</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 128 128%22><text y=%221.2em%22 font-size=%2296%22>⚫</text></svg>">
        {% block stylesheets %}
        {% endblock %}
    </head>
    <body>
        {% block body %}{% endblock %}

        {% block javascripts %}
        {% endblock %}
    </body>
</html>
```

**Point clé** : Le bloc `{% block javascripts %}` est placé juste avant la fermeture de `</body>`. C'est l'emplacement standard pour les scripts JavaScript. Placer les scripts en fin de `<body>` permet au HTML de se charger avant l'exécution du JS.

---

### Étape 3 : Ajouter du JavaScript inline dans un template

Crée un fichier `templates/demo/js-demo.html.twig` :

Crée le dossier si nécessaire (`mkdir -p templates/demo`), puis crée le fichier avec ce contenu :

```twig
{# templates/demo/js-demo.html.twig #}

{% extends 'base.html.twig' %}

{% block title %}Démo JavaScript{% endblock %}

{% block body %}
    <h1>Démonstration JavaScript</h1>
    <p id="message">Ce texte va changer.</p>
    <button id="btn-change">Cliquer ici</button>
{% endblock %}

{% block javascripts %}
    {# On appelle parent() pour conserver les scripts du template de base #}
    {{ parent() }}

    <script>
        // On attend que le DOM soit chargé
        document.addEventListener('DOMContentLoaded', function() {
            // On récupère le bouton par son id
            const bouton = document.getElementById('btn-change');

            // On ajoute un écouteur d'événement sur le clic
            bouton.addEventListener('click', function() {
                // On modifie le texte du paragraphe
                document.getElementById('message').textContent = 'Le texte a été modifié par JavaScript !';
            });
        });
    </script>
{% endblock %}
```

**Explication ligne par ligne** :

1. `{% block javascripts %}` : On ouvre le bloc JavaScript.
2. `{{ parent() }}` : On inclut le contenu du bloc `javascripts` du template parent. C'est important pour ne pas écraser les scripts globaux (comme ceux de Webpack Encore).
3. `<script>...</script>` : Le code JavaScript inline, directement dans le template.
4. `document.addEventListener('DOMContentLoaded', ...)` : On attend que tout le HTML soit chargé avant d'exécuter le JS.

**Règle importante** : Appelle toujours `{{ parent() }}` au début du bloc `javascripts` dans les templates enfants. Sans cela, tu écrases les scripts définis dans le template parent.

---

### Étape 4 : Créer le contrôleur pour la démo

Crée le fichier `src/Controller/DemoController.php` (ou ajoute la méthode si le contrôleur existe déjà) :

```php
<?php
// src/Controller/DemoController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/demo')]
class DemoController extends AbstractController
{
    #[Route('/js', name: 'demo_js')]
    public function jsDemo(): Response
    {
        // On rend le template sans données supplémentaires
        return $this->render('demo/js-demo.html.twig');
    }
}
```

**Test** : Accède à `http://localhost:8080/demo/js` dans ton navigateur.

**Résultat attendu** :

```text
Page avec :
- Titre "Démo JavaScript" dans l'onglet
- Un titre h1 "Démonstration JavaScript"
- Un paragraphe "Ce texte va changer."
- Un bouton "Cliquer ici"

Après clic sur le bouton :
- Le paragraphe affiche "Le texte a été modifié par JavaScript !"
```

---

### Étape 5 : Utiliser un fichier JavaScript externe avec `asset()`

Au lieu d'écrire le JS directement dans le template (inline), on va le placer dans un fichier séparé.

Crée le dossier (`mkdir -p public/js`), puis crée le fichier `public/js/demo.js` :

```javascript
// public/js/demo.js

// Ce fichier contient le JavaScript de la page de démonstration
document.addEventListener('DOMContentLoaded', function() {
    // On récupère le bouton par son id
    const bouton = document.getElementById('btn-change');

    // On vérifie que le bouton existe sur la page
    if (bouton) {
        // On ajoute un écouteur d'événement sur le clic
        bouton.addEventListener('click', function() {
            // On modifie le texte du paragraphe
            const message = document.getElementById('message');
            message.textContent = 'Texte modifié par un fichier JS externe !';

            // On change aussi la couleur pour bien voir la différence
            message.style.color = 'green';
        });
    }
});
```

Modifie le template pour utiliser le fichier externe :

```twig
{# templates/demo/js-demo.html.twig #}

{% extends 'base.html.twig' %}

{% block title %}Démo JavaScript{% endblock %}

{% block body %}
    <h1>Démonstration JavaScript</h1>
    <p id="message">Ce texte va changer.</p>
    <button id="btn-change">Cliquer ici</button>
{% endblock %}

{% block javascripts %}
    {{ parent() }}

    {# On charge le fichier JS externe avec la fonction asset() #}
    <script src="{{ asset('js/demo.js') }}"></script>
{% endblock %}
```

**Explication** :

- `{{ asset('js/demo.js') }}` : Symfony génère le chemin correct vers `public/js/demo.js`.
- Le chemin passé à `asset()` est **relatif au dossier `public/`**. Le fichier se trouve à `public/js/demo.js`, donc on écrit `asset('js/demo.js')`.

**Test** : Rafraîchis la page `http://localhost:8080/demo/js`. Le comportement doit être identique.

---

### Étape 6 : Comparer inline vs externe

| Critère | Inline | Externe |
| ------- | ------ | ------- |
| Quantité de code | Moins de 10 lignes | Plus de 10 lignes |
| Réutilisation | Script utilisé sur une seule page | Script utilisé sur plusieurs pages |
| Débogage | Difficile (code mélangé au HTML) | Facile (fichier dédié) |
| Mise en cache | Pas de cache (rechargé à chaque page) | Mis en cache par le navigateur |
| Accès aux variables Twig | Oui (directement) | Non (il faut utiliser `data-*` ou une autre technique) |

**Règle** : Préfère toujours les fichiers externes. Le JS inline est acceptable uniquement pour des scripts très courts ou pour passer des données Twig au JS.

---

### Étape 7 : Passer des données Twig au JavaScript

Pour certaines fonctionnalités (afficher une carte, initialiser un graphique, pré-remplir un formulaire JS), tu as besoin de transmettre des données du serveur (PHP/Twig) au JavaScript. Voici la technique recommandée avec les attributs `data-*` :

**Dans le contrôleur** :

```php
#[Route('/js/data', name: 'demo_js_data')]
public function jsData(): Response
{
    return $this->render('demo/js-data.html.twig', [
        'username' => 'Omar',
        'userId' => 42,
    ]);
}
```

**Dans le template** `templates/demo/js-data.html.twig` :

```twig
{% extends 'base.html.twig' %}

{% block title %}Démo JS avec données{% endblock %}

{% block body %}
    {# On stocke les données PHP dans des attributs data-* #}
    <div id="app-data"
         data-username="{{ username }}"
         data-user-id="{{ userId }}">
        <p>Bienvenue, <span id="display-name">{{ username }}</span> !</p>
        <button id="btn-greet">Saluer</button>
    </div>
{% endblock %}

{% block javascripts %}
    {{ parent() }}

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // On récupère les données depuis les attributs data-*
            const appData = document.getElementById('app-data');
            const username = appData.dataset.username;     // 'Omar'
            const userId = appData.dataset.userId;         // '42'

            document.getElementById('btn-greet').addEventListener('click', function() {
                alert('Bonjour ' + username + ' ! (ID: ' + userId + ')');
            });
        });
    </script>
{% endblock %}
```

**Explication** :

- `data-username="{{ username }}"` : L'attribut HTML `data-username` reçoit la valeur de la variable Twig.
- `appData.dataset.username` : En JavaScript, on lit l'attribut `data-username` via la propriété `dataset`.
- Convention de nommage : `data-user-id` en HTML devient `dataset.userId` en JavaScript (camelCase).

**Règle** : Ne mets jamais de données sensibles (mots de passe, tokens) dans les attributs `data-*`. Ils sont visibles dans le code source de la page.

---

### Étape 8 : Ajouter plusieurs fichiers JS sur une page

Tu peux inclure plusieurs fichiers JavaScript dans le même bloc :

```twig
{% block javascripts %}
    {{ parent() }}

    {# Bibliothèque utilitaire chargée en premier #}
    <script src="{{ asset('js/utils.js') }}"></script>

    {# Script spécifique à la page chargé ensuite #}
    <script src="{{ asset('js/formulaire.js') }}"></script>
{% endblock %}
```

**Règle** : L'ordre des balises `<script>` est important. Le navigateur exécute les scripts dans l'ordre où ils apparaissent. Si `formulaire.js` utilise une fonction définie dans `utils.js`, alors `utils.js` doit être chargé en premier.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `ls assets/` | Voir les fichiers sources frontend |
| `ls public/` | Voir les fichiers accessibles par le navigateur |
| `ls public/build/` | Voir les fichiers compilés par Webpack Encore |
| `php bin/console debug:twig` | Lister les fonctions et filtres Twig disponibles |
| `php bin/console assets:install` | Copier les assets des bundles dans `public/` |

---

## Pièges Fréquents

### Piège 1 : Oublier `{{ parent() }}` dans le bloc `javascripts`

**Problème** : Le JavaScript global (scripts du template de base, Webpack Encore) ne fonctionne plus sur une page.

**Solution** : Ajoute toujours `{{ parent() }}` au début du bloc `javascripts` :

```twig
{# ❌ Incorrect - écrase les scripts du parent #}
{% block javascripts %}
    <script src="{{ asset('js/mon-script.js') }}"></script>
{% endblock %}

{# ✅ Correct - conserve les scripts du parent #}
{% block javascripts %}
    {{ parent() }}
    <script src="{{ asset('js/mon-script.js') }}"></script>
{% endblock %}
```

---

### Piège 2 : Mettre le fichier JS dans `assets/` au lieu de `public/`

**Problème** : Le navigateur affiche une erreur 404 pour le fichier JS.

**Solution** : Sans Webpack Encore, les fichiers JS doivent être dans `public/` (le seul dossier accessible par le navigateur). Le dossier `assets/` est uniquement pour les fichiers sources traités par Webpack Encore.

```text
❌ assets/js/demo.js          → Inaccessible par le navigateur
✅ public/js/demo.js          → Accessible via asset('js/demo.js')
```

---

### Piège 3 : Chemin incorrect dans `asset()`

**Problème** : Le fichier JS n'est pas chargé.

**Solution** : Le chemin dans `asset()` est relatif au dossier `public/`. Ne pas inclure `public/` dans le chemin.

```twig
{# ❌ Incorrect - le chemin inclut "public/" #}
<script src="{{ asset('public/js/demo.js') }}"></script>

{# ❌ Incorrect - chemin absolu du système de fichiers #}
<script src="{{ asset('/var/www/project/public/js/demo.js') }}"></script>

{# ✅ Correct - chemin relatif à public/ #}
<script src="{{ asset('js/demo.js') }}"></script>
```

---

### Piège 4 : JavaScript exécuté avant le chargement du DOM

**Problème** : Le script essaie de manipuler un élément HTML qui n'existe pas encore.

**Solution** : Entoure toujours ton code avec `DOMContentLoaded` ou place le script en fin de `<body>` (ce que fait le bloc `javascripts`).

```javascript
// ❌ Incorrect - l'élément n'existe peut-être pas encore
const btn = document.getElementById('mon-bouton');
btn.addEventListener('click', function() { /* ... */ });

// ✅ Correct - on attend que le DOM soit prêt
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('mon-bouton');
    btn.addEventListener('click', function() { /* ... */ });
});
```

---

### Piège 5 : Utiliser `asset()` pour les fichiers dans `public/build/`

**Problème** : Quand tu utilises Webpack Encore, les noms de fichiers dans `public/build/` contiennent un hash (ex: `app.abc123.js`). Le chemin change à chaque compilation.

**Solution** : Pour les fichiers compilés par Webpack Encore, n'utilise pas `asset()`. Utilise les fonctions Twig dédiées `encore_entry_script_tags()` et `encore_entry_link_tags()`. Ceci sera détaillé dans la fiche sur Webpack Encore.

```twig
{# ❌ Incorrect pour les fichiers Webpack Encore #}
<script src="{{ asset('build/app.js') }}"></script>

{# ✅ Correct pour les fichiers Webpack Encore #}
{{ encore_entry_script_tags('app') }}
```

---

## Checklist de Validation

- [ ] Je comprends la différence entre frontend (JS dans le navigateur) et backend (PHP sur le serveur)
- [ ] Je sais que `assets/` contient les fichiers sources et `public/` les fichiers accessibles
- [ ] Je sais écrire du JavaScript inline dans un bloc `{% block javascripts %}`
- [ ] Je n'oublie pas `{{ parent() }}` dans le bloc `javascripts`
- [ ] Je sais créer un fichier JS externe dans `public/js/`
- [ ] Je sais utiliser `{{ asset('js/mon-fichier.js') }}` pour inclure un fichier JS
- [ ] Je sais passer des données Twig au JavaScript avec les attributs `data-*`
- [ ] Je comprends pourquoi Webpack Encore est utile (même si je ne l'utilise pas encore)

---

## Exercice Pratique

**Énoncé** : Crée une page Symfony avec un compteur interactif.

La page doit afficher :

- Un titre "Mon compteur"
- Un nombre (initialisé à 0)
- Deux boutons : "+" (incrémenter) et "-" (décrémenter)
- Le nombre ne peut pas descendre en dessous de 0

**Contraintes** :

- Le JavaScript doit être dans un fichier externe `public/js/compteur.js`
- Le fichier JS doit être inclus avec `{{ asset() }}`
- Le template doit hériter de `base.html.twig`
- Le contrôleur doit passer la valeur initiale du compteur (0) via un attribut `data-*`

**Indications** :

- Crée un contrôleur `DemoController` avec une méthode `compteur()`
- Crée un template `templates/demo/compteur.html.twig`
- Crée un fichier `public/js/compteur.js`
- Utilise `dataset` pour lire la valeur initiale en JavaScript
- Utilise `textContent` pour modifier le nombre affiché

**Résultat attendu** :

```text
Page "Mon compteur" :
- Affiche "0" au centre
- Clic sur "+" → affiche "1", puis "2", etc.
- Clic sur "-" → affiche "0" (ne descend pas en dessous)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier 1** : Le contrôleur `src/Controller/DemoController.php`

```php
<?php
// src/Controller/DemoController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/demo')]
class DemoController extends AbstractController
{
    #[Route('/compteur', name: 'demo_compteur')]
    public function compteur(): Response
    {
        // On passe la valeur initiale du compteur au template
        return $this->render('demo/compteur.html.twig', [
            'valeurInitiale' => 0,
        ]);
    }
}
```

**Fichier 2** : Le template `templates/demo/compteur.html.twig`

```twig
{# templates/demo/compteur.html.twig #}

{% extends 'base.html.twig' %}

{% block title %}Mon compteur{% endblock %}

{% block body %}
    <div id="compteur-app" data-initial="{{ valeurInitiale }}">
        <h1>Mon compteur</h1>

        {# Le nombre affiché, initialisé avec la valeur du serveur #}
        <p style="font-size: 3em; text-align: center;">
            <span id="compteur-valeur">{{ valeurInitiale }}</span>
        </p>

        {# Les deux boutons #}
        <div style="text-align: center;">
            <button id="btn-decrementer" style="font-size: 1.5em; padding: 10px 20px;">-</button>
            <button id="btn-incrementer" style="font-size: 1.5em; padding: 10px 20px;">+</button>
        </div>
    </div>
{% endblock %}

{% block javascripts %}
    {{ parent() }}

    {# On charge le fichier JS externe #}
    <script src="{{ asset('js/compteur.js') }}"></script>
{% endblock %}
```

**Fichier 3** : Le fichier JavaScript `public/js/compteur.js`

```javascript
// public/js/compteur.js

// On attend que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {

    // On récupère la valeur initiale depuis l'attribut data-initial
    const appElement = document.getElementById('compteur-app');
    let compteur = parseInt(appElement.dataset.initial, 10);

    // On récupère les éléments du DOM
    const affichage = document.getElementById('compteur-valeur');
    const btnPlus = document.getElementById('btn-incrementer');
    const btnMoins = document.getElementById('btn-decrementer');

    // Fonction pour mettre à jour l'affichage
    function mettreAJour() {
        affichage.textContent = compteur;
    }

    // Écouteur sur le bouton "+"
    btnPlus.addEventListener('click', function() {
        compteur = compteur + 1;
        mettreAJour();
    });

    // Écouteur sur le bouton "-"
    btnMoins.addEventListener('click', function() {
        // On empêche le compteur de descendre en dessous de 0
        if (compteur > 0) {
            compteur = compteur - 1;
            mettreAJour();
        }
    });
});
```

**Test** : Accède à `http://localhost:8080/demo/compteur` et vérifie que le compteur fonctionne.

---

## Navigation

→ Fiche suivante : **[02 - Webpack Encore - Installation](02-webpack-encore-installation.md)**
