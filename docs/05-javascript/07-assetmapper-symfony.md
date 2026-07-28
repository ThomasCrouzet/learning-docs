---
tags:
  - JavaScript
  - Symfony
  - Avancé
  - Concept
description: "Symfony AssetMapper : gérer les assets sans bundler grâce aux importmaps, le remplaçant de Webpack Encore."
estimated_time: "75 min"
fiche_number: 7
total_fiches: 7
cursus: "JavaScript"
---

# 07 - Symfony AssetMapper

> **En bref** : À la fin de cette fiche, tu sauras utiliser AssetMapper pour gérer les fichiers JavaScript et CSS d'un projet Symfony sans outil de build, en t'appuyant sur les importmaps du navigateur. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche **[03 - Webpack Encore : Utilisation au quotidien](03-webpack-encore-utilisation.md)** (points d'entrée, imports, compilation)
- Avoir lu la fiche **[06 - Stimulus et Symfony UX](06-stimulus-symfony.md)** (contrôleurs Stimulus, `data-controller`)
- Avoir lu la fiche **[02 - Les contrôleurs et les routes](../03-symfony/02-controleurs-routes.md)** (créer un contrôleur, définir une route, retourner une réponse)
- Savoir utiliser un terminal et la console `php bin/console`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras initialiser AssetMapper dans un projet Symfony 7.4, ajouter des dépendances JavaScript avec `importmap:require`, intégrer Stimulus et Turbo, et choisir entre AssetMapper et Webpack Encore selon ton projet.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'AssetMapper ?

**Définition** : AssetMapper est le composant officiel de Symfony qui gère les fichiers statiques (JavaScript, CSS, images) sans aucun outil de build (pas de Webpack, pas de bundler, pas de Node.js en production). Il sert directement les fichiers au navigateur et utilise les importmaps, une fonctionnalité native des navigateurs modernes.

AssetMapper est disponible depuis Symfony 6.3. Il est le choix par défaut quand tu crées un nouveau projet Symfony 7.4.

**Le problème qu'AssetMapper résout** :

Sans AssetMapper, voici les problèmes rencontrés :

1. **Chaîne de build complexe** : Webpack Encore nécessite Node.js, npm, un fichier `webpack.config.js`, et une étape de compilation (`npm run build`) avant chaque déploiement.

2. **Node.js en production** : L'environnement de déploiement doit installer Node.js et des centaines de paquets npm juste pour produire des fichiers statiques.

3. **Temps de compilation** : Chaque modification de JavaScript ou de CSS demande une recompilation. Sur un gros projet, l'attente devient pénible.

4. **Dépendances lourdes** : Le dossier `node_modules` peut peser plusieurs centaines de mégaoctets pour un projet simple.

**Comment AssetMapper résout ces problèmes** :

| Problème | Solution apportée par AssetMapper |
| -------- | --------------------------------- |
| Chaîne de build complexe | Aucun build : les fichiers sont servis tels quels |
| Node.js en production | Tout est géré par PHP, pas besoin de Node.js |
| Temps de compilation | Aucune compilation, rechargement immédiat |
| Dépendances lourdes | Les paquets sont téléchargés à la demande dans `assets/vendor/` |

**Analogie concrète** : Webpack Encore, c'est comme une cuisine industrielle qui prépare des plats à emporter : tu dois cuisiner (compiler) tous les plats à l'avance, les emballer, et les stocker avant de servir. AssetMapper, c'est comme un buffet en libre-service : les ingrédients (les fichiers) sont posés directement sur la table, et chacun se sert au moment où il en a besoin. Pas de préparation à l'avance, pas d'emballage.

**Ce qu'AssetMapper n'est PAS** :

- AssetMapper n'est pas un bundler. Un bundler (comme Webpack) regroupe plusieurs fichiers en un seul gros fichier. AssetMapper garde les fichiers séparés et laisse le navigateur les charger individuellement grâce au HTTP/2.
- AssetMapper n'est pas un transpileur. Il ne transforme pas le code TypeScript ou JSX en JavaScript. Il sert du JavaScript que le navigateur comprend directement.
- AssetMapper n'est pas réservé aux petits projets. Il convient à la majorité des projets Symfony, y compris ceux qui utilisent Stimulus et Turbo.

---

### Qu'est-ce qu'une importmap ?

**Définition** : Une importmap est une fonctionnalité native des navigateurs modernes. C'est un fichier JSON, inséré dans le HTML, qui indique au navigateur où trouver chaque module JavaScript importé par son nom. Elle permet d'écrire `import { Controller } from '@hotwired/stimulus'` directement dans le navigateur, sans bundler.

**Le problème que les importmaps résolvent** :

Sans importmaps, voici les problèmes rencontrés :

1. **Le navigateur ne connaît pas les noms de paquets** : En JavaScript natif, `import { Controller } from '@hotwired/stimulus'` échoue. Le navigateur ne sait pas que `@hotwired/stimulus` correspond à un fichier précis.

2. **Chemins relatifs fragiles** : Sans importmap, tu dois écrire des chemins complets comme `import { Controller } from '/assets/vendor/@hotwired/stimulus/stimulus.index.js'`. Si le chemin change, tout casse.

**Comment les importmaps résolvent ces problèmes** :

| Problème | Solution apportée par les importmaps |
| -------- | ------------------------------------ |
| Noms de paquets inconnus | L'importmap associe chaque nom à un fichier précis |
| Chemins relatifs fragiles | Tu importes par nom, le chemin est géré dans l'importmap |

**Analogie concrète** : Une importmap est comme le répertoire téléphonique d'une entreprise. Quand tu veux joindre "le service comptabilité", tu ne composes pas un numéro complet de mémoire : tu cherches le nom dans le répertoire, qui te donne le bon numéro. L'importmap fait pareil : tu écris `@hotwired/stimulus` (le nom), et le navigateur consulte l'importmap pour trouver le bon fichier (le numéro).

**Exemple d'importmap générée dans le HTML** :

```html
<script type="importmap">
{
    "imports": {
        "app": "/assets/app-3d4e5f.js",
        "@hotwired/stimulus": "/assets/vendor/@hotwired/stimulus/stimulus.index-a1b2c3.js",
        "@hotwired/turbo": "/assets/vendor/@hotwired/turbo/turbo.index-d4e5f6.js"
    }
}
</script>
```

Chaque nom de module pointe vers un fichier réel. Les suffixes comme `-3d4e5f` sont des versions (voir la section sur les assets versionnés plus bas).

---

### Le fichier `importmap.php`

**Définition** : Le fichier `importmap.php`, à la racine du projet, déclare toutes les dépendances JavaScript du projet. C'est l'équivalent du fichier `package.json` pour AssetMapper, mais géré en PHP.

**Exemple de fichier `importmap.php`** :

```php
<?php

// importmap.php
// Déclare les dépendances JavaScript du projet

return [
    // Le point d'entrée principal de l'application
    'app' => [
        'path' => './assets/app.js',
        'entrypoint' => true,
    ],
    // La librairie Stimulus, téléchargée dans assets/vendor/
    '@hotwired/stimulus' => [
        'version' => '3.2.2',
    ],
    // La librairie Turbo
    '@hotwired/turbo' => [
        'version' => '8.0.4',
    ],
];
```

| Champ | Rôle |
| ----- | ---- |
| `path` | Chemin vers un fichier local du projet |
| `entrypoint` | `true` si c'est un point d'entrée (chargé directement dans le HTML) |
| `version` | Version d'un paquet téléchargé depuis un CDN |

**Règle** : Tu ne modifies presque jamais ce fichier à la main. Les commandes `php bin/console importmap:require` et `importmap:remove` le mettent à jour pour toi.

---

### AssetMapper vs Webpack Encore

| Critère | Webpack Encore | AssetMapper |
| ------- | -------------- | ----------- |
| Build nécessaire | Oui (`npm run build`) | Non |
| Node.js requis | Oui | Non (uniquement PHP) |
| Transpilation TypeScript/JSX | Oui | Non |
| Regroupement (bundling) | Oui (un gros fichier) | Non (fichiers séparés) |
| Gestion des dépendances | `package.json` + npm | `importmap.php` + console |
| Optimisation production | Minification, tree-shaking | Versionnage, compression serveur |
| Compatibilité navigateurs | Très large (IE inclus possible) | Navigateurs modernes uniquement |

**Quand utiliser quoi ?**

- **AssetMapper** : nouveaux projets Symfony, sites avec du JavaScript modéré (Stimulus, Turbo, quelques librairies), équipes qui veulent éviter Node.js, déploiements simplifiés.
- **Webpack Encore** : projets qui ont besoin de TypeScript ou JSX (React, Vue avec compilation), applications front lourdes, projets existants déjà sous Encore, support de navigateurs très anciens.

**Règle simple** : pour un projet Symfony 7.4 classique qui utilise Stimulus et Turbo, AssetMapper suffit. Choisis Webpack Encore seulement si tu as besoin de transpilation (TypeScript, JSX) ou d'un front très complexe.

---

### Les assets versionnés

**Définition** : Le versionnage des assets consiste à ajouter une empreinte (un code unique calculé à partir du contenu du fichier) dans le nom du fichier servi. Par exemple, `app.js` devient `app-3d4e5f.js`. Quand le contenu change, l'empreinte change, donc le nom de fichier change.

**Le problème que le versionnage résout** :

Sans versionnage, le navigateur garde en cache l'ancienne version d'un fichier. Quand tu déploies une nouvelle version de ton JavaScript, l'utilisateur continue d'utiliser l'ancienne tant que son cache n'a pas expiré.

**Comment le versionnage résout ce problème** :

Quand le contenu change, le nom de fichier change aussi (`app-3d4e5f.js` devient `app-9z8y7x.js`). Le navigateur considère que c'est un nouveau fichier et le télécharge. L'ancien cache devient inutile automatiquement.

**Analogie concrète** : Le versionnage est comme un numéro d'édition sur un livre. Si une bibliothèque commande "Le Petit Prince, édition 2024", elle reçoit exactement cette édition. Quand une "édition 2025" sort avec un nouveau numéro, la bibliothèque sait que c'est une version différente et peut la commander sans confusion avec l'ancienne.

**En pratique** : AssetMapper gère le versionnage automatiquement. Tu n'as rien à configurer. La commande `php bin/console asset-map:compile` génère les versions pour la production.

---

## Étapes Pratiques

### Étape 1 : Vérifier ou installer AssetMapper

Dans un projet Symfony 7.4 récent, AssetMapper est souvent déjà installé. Vérifie sa présence :

```bash
# Vérifie que le composant AssetMapper est disponible
php bin/console debug:asset-map
```

**Résultat attendu** (si AssetMapper est installé) :

```text
 Asset Mapper Paths
 ------------------

 --------- -----------------
  Path      Namespace prefix
 --------- -----------------
  assets/
 --------- -----------------
```

Si la commande affiche une erreur indiquant que la commande n'existe pas, installe le composant :

```bash
# Installe le composant AssetMapper
composer require symfony/asset-mapper symfony/asset symfony/twig-pack
```

---

### Étape 2 : Comprendre la structure des fichiers

Avec AssetMapper, la structure des assets est plus simple qu'avec Webpack Encore :

```text
mon-projet/
├── assets/
│   ├── app.js              # Point d'entrée JavaScript principal
│   ├── controllers/        # Tes contrôleurs Stimulus
│   │   └── hello_controller.js
│   ├── controllers.json    # Contrôleurs des packages UX
│   ├── styles/
│   │   └── app.css         # Feuille de styles principale
│   └── vendor/             # Dépendances téléchargées (généré, gitignoré)
├── importmap.php           # Déclaration des dépendances JavaScript
└── config/
    └── packages/
        └── asset_mapper.yaml
```

**Points importants** :

- Le dossier `assets/vendor/` est généré automatiquement. Il contient les librairies téléchargées (Stimulus, Turbo). Il est ajouté au `.gitignore` par défaut.
- Il n'y a pas de fichier `webpack.config.js`.
- Il n'y a pas de dossier `node_modules`.

---

### Étape 3 : Configurer le point d'entrée dans le template

Dans le template de base, AssetMapper insère les balises nécessaires avec une seule fonction Twig.

Ouvre `templates/base.html.twig` :

```twig
{# templates/base.html.twig #}

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>{% block title %}Bienvenue{% endblock %}</title>

        {% block stylesheets %}{% endblock %}

        {% block javascripts %}
            {# importmap('app') génère l'importmap ET charge le point d'entrée 'app' #}
            {{ importmap('app') }}
        {% endblock %}
    </head>
    <body>
        {% block body %}{% endblock %}
    </body>
</html>
```

**Ce que fait `importmap('app')`** :

1. Insère la balise `<script type="importmap">` avec tous les modules déclarés.
2. Insère un `<script type="module">` qui démarre le point d'entrée `app`.
3. Ajoute les balises de préchargement (`modulepreload`) pour accélérer le chargement.

**Règle** : `importmap('app')` remplace les anciennes fonctions `encore_entry_script_tags()` et `encore_entry_link_tags()` de Webpack Encore.

---

### Étape 4 : Écrire le point d'entrée `app.js`

Le fichier `assets/app.js` est le point de départ de ton JavaScript :

```javascript
// assets/app.js
// Point d'entrée principal de l'application

// Importer la feuille de styles (AssetMapper la sert automatiquement)
import './styles/app.css';

// Importer et démarrer Stimulus (voir l'étape suivante)
import './bootstrap.js';

// Ton code applicatif
console.log('Application démarrée avec AssetMapper');
```

Pour importer une librairie externe, tu utilises son nom (grâce à l'importmap) :

```javascript
// assets/app.js

// Import par nom : l'importmap résout le chemin réel
import { Application } from '@hotwired/stimulus';

console.log('Stimulus est disponible :', Application);
```

**Important** : L'import par nom (`'@hotwired/stimulus'`) ne fonctionne que si le paquet a été déclaré dans `importmap.php`. Tu déclares un paquet avec `importmap:require` (étape suivante).

---

### Étape 5 : Ajouter une dépendance avec `importmap:require`

Pour ajouter une librairie JavaScript, tu utilises la commande `importmap:require`. Elle télécharge la librairie et met à jour `importmap.php`.

```bash
# Ajoute la librairie de dates "date-fns"
php bin/console importmap:require date-fns
```

**Résultat attendu** :

```text
 [OK] Updated importmap.php and downloaded 1 new package.
```

La commande a :

1. Ajouté `date-fns` dans `importmap.php`.
2. Téléchargé le fichier dans `assets/vendor/date-fns/`.

Tu peux maintenant importer la librairie par son nom :

```javascript
// assets/app.js

// Import par nom : AssetMapper a téléchargé date-fns localement
import { format } from 'date-fns';

// Formater la date du jour
const aujourdhui = format(new Date(), 'dd/MM/yyyy');
console.log('Date du jour :', aujourdhui);
```

**Commandes associées** :

| Commande | Action |
| -------- | ------ |
| `php bin/console importmap:require nom` | Ajoute un paquet |
| `php bin/console importmap:remove nom` | Retire un paquet |
| `php bin/console importmap:update` | Met à jour tous les paquets |
| `php bin/console importmap:audit` | Vérifie les failles de sécurité connues |

---

### Étape 6 : Intégrer Stimulus avec AssetMapper

Symfony UX fonctionne avec AssetMapper de la même manière qu'avec Webpack Encore. Si tu installes le bundle Stimulus, tout est configuré automatiquement.

```bash
# Installe Symfony UX Stimulus pour AssetMapper
composer require symfony/stimulus-bundle
```

Cette commande crée ou met à jour le fichier `assets/bootstrap.js` :

```javascript
// assets/bootstrap.js
// Initialisation de Stimulus avec AssetMapper

import { startStimulusApp } from '@symfony/stimulus-bundle';

// Démarre Stimulus et charge automatiquement les contrôleurs
// du dossier assets/controllers/ et de controllers.json
const app = startStimulusApp();

export { app };
```

Crée un contrôleur Stimulus de test dans `assets/controllers/hello_controller.js` :

```javascript
// assets/controllers/hello_controller.js

import { Controller } from '@hotwired/stimulus';

// hello_controller.js → data-controller="hello"
export default class extends Controller {
    static targets = ['output'];

    greet() {
        // Affiche un message dans le target "output"
        this.outputTarget.textContent = 'Bonjour depuis AssetMapper !';
    }
}
```

Utilise le contrôleur dans un template :

```twig
{# templates/hello/index.html.twig #}

{% extends 'base.html.twig' %}

{% block body %}
    {# data-controller="hello" active le contrôleur hello_controller.js #}
    <div data-controller="hello">
        <button data-action="click->hello#greet">Dire bonjour</button>
        <p data-hello-target="output"></p>
    </div>
{% endblock %}
```

**Résultat attendu** :

1. Tu charges la page dans le navigateur.
2. Tu cliques sur "Dire bonjour".
3. Le paragraphe affiche "Bonjour depuis AssetMapper !".

**Important** : Aucune compilation n'est nécessaire. Tu recharges simplement la page du navigateur après avoir modifié un fichier.

---

### Étape 7 : Intégrer Turbo

Turbo accélère la navigation entre les pages sans recharger toute la page. Il s'installe en une commande avec AssetMapper.

```bash
# Installe Symfony UX Turbo
composer require symfony/ux-turbo
```

La commande met à jour `importmap.php` et `assets/controllers.json`. Turbo est actif immédiatement, sans configuration supplémentaire.

Vérifie que Turbo est chargé en ajoutant un log dans `assets/app.js` :

```javascript
// assets/app.js

import './bootstrap.js';

// Turbo émet un événement quand une page est chargée
document.addEventListener('turbo:load', () => {
    // Cet événement se déclenche à chaque navigation Turbo
    console.log('Page chargée via Turbo');
});
```

**Résultat attendu** :

1. Tu navigues entre deux pages de ton site.
2. La page ne fait pas de rechargement complet (pas de flash blanc).
3. La console affiche "Page chargée via Turbo" à chaque navigation.

---

### Étape 8 : Compiler les assets pour la production

En développement, AssetMapper sert les fichiers à la volée. En production, tu compiles les assets une fois pour générer les versions et améliorer les performances.

```bash
# Compile les assets pour la production
php bin/console asset-map:compile
```

**Résultat attendu** :

```text
 [OK] Compiled 12 assets in public/assets.
```

Cette commande :

1. Copie tous les assets dans `public/assets/`.
2. Ajoute les empreintes de version aux noms de fichiers.
3. Génère l'importmap finale avec les chemins versionnés.

**Règle de déploiement** : Exécute `asset-map:compile` lors de chaque déploiement en production, après avoir mis à jour le code. En développement, ne lance jamais cette commande (elle empêche le rechargement à la volée). Pour annuler une compilation locale, supprime le dossier `public/assets/`.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console debug:asset-map` | Liste les chemins et assets connus |
| `php bin/console importmap:require nom` | Ajoute une dépendance JavaScript |
| `php bin/console importmap:remove nom` | Retire une dépendance JavaScript |
| `php bin/console importmap:update` | Met à jour toutes les dépendances |
| `php bin/console importmap:audit` | Vérifie les failles de sécurité |
| `php bin/console asset-map:compile` | Compile les assets pour la production |
| `composer require symfony/stimulus-bundle` | Installe Stimulus pour AssetMapper |
| `composer require symfony/ux-turbo` | Installe Turbo |

---

## Pièges Fréquents

### Piège 1 : Importer un paquet non déclaré dans `importmap.php`

⚠️ **Problème** : Dans la console du navigateur, tu vois une erreur du type `Failed to resolve module specifier "lodash"`. Le navigateur ne trouve pas le module.

✅ **Solution** : Tout paquet importé par son nom doit d'abord être déclaré avec `importmap:require`.

```bash
# Avant d'écrire import ... from 'lodash', déclare le paquet
php bin/console importmap:require lodash
```

```javascript
// Maintenant cet import fonctionne
import _ from 'lodash';
```

---

### Piège 2 : Lancer `asset-map:compile` en développement

⚠️ **Problème** : Après avoir lancé `asset-map:compile` en local, tes modifications de JavaScript ou de CSS ne s'affichent plus, même après rechargement.

✅ **Solution** : En développement, Symfony sert d'abord les fichiers compilés du dossier `public/assets/` s'ils existent. Supprime ce dossier pour revenir au mode développement.

```bash
# Supprime les assets compilés pour réactiver le rechargement à la volée
rm -rf public/assets
```

---

### Piège 3 : Oublier `{{ importmap('app') }}` dans le template

⚠️ **Problème** : Aucun JavaScript ne s'exécute. La console du navigateur ne montre aucune erreur, mais rien ne se passe.

✅ **Solution** : Le template de base doit contenir l'appel `{{ importmap('app') }}`. Sans lui, l'importmap n'est pas insérée et aucun module n'est chargé.

```twig
{# Dans templates/base.html.twig, dans le <head> #}
{% block javascripts %}
    {{ importmap('app') }}
{% endblock %}
```

---

### Piège 4 : Confondre AssetMapper et Webpack Encore dans un même projet

⚠️ **Problème** : Tu utilises `{{ encore_entry_script_tags('app') }}` (Webpack Encore) alors que le projet est configuré avec AssetMapper. La page plante avec une erreur Twig "Unknown function".

✅ **Solution** : Un projet utilise l'un ou l'autre, pas les deux. Vérifie quel composant est installé.

| Webpack Encore | AssetMapper |
| -------------- | ----------- |
| `{{ encore_entry_script_tags('app') }}` | `{{ importmap('app') }}` |
| `{{ encore_entry_link_tags('app') }}` | (inclus dans `importmap('app')`) |
| `package.json` + `npm run build` | `importmap.php` + aucun build |

---

### Piège 5 : Vouloir transpiler du TypeScript avec AssetMapper

⚠️ **Problème** : Tu crées un fichier `app.ts` en TypeScript et tu t'attends à ce qu'AssetMapper le compile. Le navigateur affiche une erreur de syntaxe.

✅ **Solution** : AssetMapper ne transpile pas le TypeScript. Il sert uniquement du JavaScript que le navigateur comprend. Si tu as besoin de TypeScript, utilise Webpack Encore (voir la fiche [02 - Webpack Encore : Installation](02-webpack-encore-installation.md)).

---

## Checklist de Validation

- [ ] Je comprends qu'AssetMapper fonctionne sans build et sans Node.js
- [ ] Je sais ce qu'est une importmap et à quoi elle sert
- [ ] Je sais que `importmap.php` déclare les dépendances JavaScript
- [ ] Je sais ajouter une dépendance avec `php bin/console importmap:require`
- [ ] Je sais utiliser `{{ importmap('app') }}` dans le template de base
- [ ] Je sais intégrer Stimulus avec `symfony/stimulus-bundle`
- [ ] Je sais intégrer Turbo avec `symfony/ux-turbo`
- [ ] Je sais compiler les assets pour la production avec `asset-map:compile`
- [ ] Je sais choisir entre AssetMapper et Webpack Encore selon le projet

---

## Exercice Pratique

**Énoncé** : Configure un mini-projet Symfony avec AssetMapper et un compteur interactif.

**Fonctionnalités demandées** :

1. Une page avec un bouton "Incrémenter" et un affichage du compteur.
2. Un contrôleur Stimulus `counter` qui incrémente un nombre à chaque clic.
3. L'utilisation de la librairie `date-fns` pour afficher la date et l'heure du dernier clic.

**Indications** :

- Ajoute `date-fns` avec `php bin/console importmap:require date-fns`
- Crée un contrôleur `counter_controller.js` dans `assets/controllers/`
- Utilise une value `count` de type `Number` et un target `display`
- Importe `format` depuis `date-fns` dans le contrôleur
- Affiche la date au format `HH:mm:ss` après chaque clic

**Résultat attendu** :

1. Tu charges la page : le compteur affiche "0 clic".
2. Tu cliques sur "Incrémenter" : le compteur affiche "1 clic" et l'heure du clic.
3. Tu cliques encore : le compteur affiche "2 clics" et l'heure mise à jour.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1** : Ajoute la dépendance `date-fns` :

```bash
php bin/console importmap:require date-fns
```

**Étape 2** : Crée le contrôleur `assets/controllers/counter_controller.js` :

```javascript
// assets/controllers/counter_controller.js

import { Controller } from '@hotwired/stimulus';
// Import par nom : date-fns a été déclaré avec importmap:require
import { format } from 'date-fns';

export default class extends Controller {
    // Déclarer les targets accessibles dans le contrôleur
    static targets = ['display', 'time'];

    // Déclarer la value count, typée Number, valeur par défaut 0
    static values = {
        count: { type: Number, default: 0 },
    };

    connect() {
        // Afficher l'état initial au chargement
        this.render();
    }

    increment() {
        // Incrémenter la value (déclenche countValueChanged)
        this.countValue += 1;

        // Formater l'heure du clic avec date-fns
        const heure = format(new Date(), 'HH:mm:ss');
        this.timeTarget.textContent = 'Dernier clic : ' + heure;
    }

    // Callback automatique appelé quand countValue change
    countValueChanged() {
        this.render();
    }

    render() {
        // Accorder le mot "clic" au pluriel si nécessaire
        const motClic = this.countValue > 1 ? 'clics' : 'clic';
        this.displayTarget.textContent = this.countValue + ' ' + motClic;
    }
}
```

**Étape 3** : Crée le template `templates/counter/index.html.twig` :

```twig
{% extends 'base.html.twig' %}

{% block body %}
    {# data-controller="counter" active le contrôleur counter_controller.js #}
    <div data-controller="counter">
        <h1>Compteur AssetMapper</h1>

        {# Affichage du compteur (target "display") #}
        <p data-counter-target="display">0 clic</p>

        {# Affichage de l'heure du dernier clic (target "time") #}
        <p data-counter-target="time"></p>

        {# Au clic, appelle la méthode increment() #}
        <button data-action="click->counter#increment">Incrémenter</button>
    </div>
{% endblock %}
```

**Étape 4** : Crée le contrôleur Symfony (PHP) qui affiche la page. Crée `src/Controller/CounterController.php` :

```php
<?php

// src/Controller/CounterController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CounterController extends AbstractController
{
    // Définit la route /compteur
    #[Route('/compteur', name: 'app_counter')]
    public function index(): Response
    {
        // Retourne le template, sans données à passer ici
        return $this->render('counter/index.html.twig');
    }
}
```

**Étape 5** : Lance le serveur et teste :

```bash
# Démarre le serveur de développement Symfony
symfony server:start
```

Ouvre `http://localhost:8000/compteur` dans le navigateur. Clique sur "Incrémenter" pour voir le compteur augmenter et l'heure du dernier clic s'afficher.

**Résultat attendu dans le navigateur** :

```text
Compteur AssetMapper

2 clics
Dernier clic : 14:32:08

[Incrémenter]
```

Aucune compilation n'est nécessaire : si tu modifies le contrôleur Stimulus, recharge simplement la page.

---

## Navigation

← Fiche précédente : **[06 - Stimulus et Symfony UX](06-stimulus-symfony.md)**

→ Cursus suivant : **[JavaScript Moderne](../06-javascript-moderne/index.md)**
