---
tags:
  - JavaScript
  - Symfony
  - Débutant
  - Pratique
description: "Webpack Encore - Installation"
estimated_time: "80 min"
fiche_number: 2
total_fiches: 7
cursus: "JavaScript"
---

# 02 - Webpack Encore - Installation

> **En bref** : À la fin de cette fiche, tu sauras installer Webpack Encore dans un projet Symfony et compiler tes fichiers CSS et JavaScript. Lecture estimée : 80 min.


## Prérequis

- Avoir lu la fiche **[01 - JavaScript dans Symfony](01-javascript-dans-symfony.md)**
- Avoir un projet Symfony fonctionnel avec Docker Compose démarré
- Savoir utiliser le terminal (ligne de commande)

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Symfony | 7.4 LTS |
| Node.js | 22 LTS |
| PHP | 8.3 |
| Webpack Encore | 5.x / 6.x (API CJS de cette fiche ; 7.x est ESM-only depuis juin 2026) |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer Webpack Encore dans un projet Symfony et compiler tes fichiers CSS et JavaScript.

---

> **Contexte 2025-2026** : Depuis Symfony 6.3, les nouveaux projets créés avec `symfony new` utilisent **AssetMapper** par défaut.
> AssetMapper ne requiert pas de bundler Node.js : il s'appuie sur les import maps du navigateur.
> Webpack Encore reste fonctionnel, maintenu, et très utilisé dans les projets existants - c'est pourquoi il est couvert ici.
> Si tu crées un projet Symfony 7.4 LTS en partant de zéro et que tu ne trouves pas de `webpack.config.js`, c'est normal : ton projet utilise AssetMapper.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Webpack ?

**Définition** : Webpack est un outil qui prend tous tes fichiers CSS et JavaScript, les combine, les optimise, et produit des fichiers prêts pour le navigateur.

**Le problème que Webpack résout** :

Sans Webpack, gérer les fichiers CSS et JavaScript d'un projet pose ces problèmes :

1. **Trop de fichiers à charger** : Un projet contient souvent des dizaines de fichiers CSS et JS. Le navigateur doit télécharger chaque fichier séparément, ce qui ralentit la page.

2. **Pas de gestion des dépendances** : Si ton fichier `menu.js` utilise une fonction définie dans `utils.js`, tu dois manuellement t'assurer que `utils.js` est chargé avant `menu.js`.

3. **Code non optimisé** : Les fichiers contiennent des espaces, des commentaires, des noms de variables longs. Tout ce contenu inutile alourdit le téléchargement.

**Comment Webpack résout ces problèmes** :

| Problème | Solution Webpack |
| --- | --- |
| Trop de fichiers à charger | Webpack combine tous les fichiers en un seul (ou quelques-uns) |
| Pas de gestion des dépendances | Webpack analyse les imports et charge les fichiers dans le bon ordre |
| Code non optimisé | Webpack minifie le code (supprime espaces, commentaires, raccourcit les noms) |

**Analogie concrète** : Imagine que tu déménages. Tu as 50 petits cartons éparpillés dans la maison. Webpack est le déménageur qui trie tes affaires, les range dans quelques grands cartons bien organisés, jette les emballages inutiles, et étiquette chaque carton pour que tu retrouves tout facilement dans ta nouvelle maison.

**Ce que Webpack n'est PAS** :

- Webpack n'est pas un langage de programmation. C'est un outil de construction (_build tool_) qui transforme des fichiers existants.
- Webpack n'est pas un serveur web. Il prépare les fichiers que le serveur (Nginx) distribue au navigateur.

---

### Qu'est-ce que Webpack Encore ?

**Définition** : Webpack Encore est un outil créé par Symfony qui simplifie la configuration de Webpack. C'est une surcouche (_wrapper_) qui fournit une API claire et des valeurs par défaut adaptées à Symfony.

**Le problème que Webpack Encore résout** :

Sans Encore, configurer Webpack directement pose ces problèmes :

1. **Configuration complexe** : Le fichier de configuration Webpack brut peut faire des centaines de lignes. Chaque fonctionnalité (CSS, images, polices) nécessite un "loader" avec sa propre configuration.

2. **Intégration manuelle avec Symfony** : Il faut manuellement faire le lien entre les fichiers compilés par Webpack et les templates Twig.

3. **Beaucoup de connaissances requises** : Les concepts de loaders, plugins, chunks, et tree-shaking sont complexes pour un débutant.

**Comment Encore résout ces problèmes** :

| Problème | Solution Encore |
| --- | --- |
| Configuration complexe | Encore fournit des méthodes simples comme `.addEntry()` et `.enableSassLoader()` |
| Intégration avec Symfony | Encore génère un fichier `manifest.json` que Twig lit automatiquement |
| Connaissances requises | Encore masque la complexité de Webpack derrière une API simple |

**Analogie concrète** : Webpack est comme une machine industrielle avec des centaines de boutons et de réglages. Encore est le panneau de contrôle simplifié posé devant cette machine : il n'a que les boutons essentiels, et chaque bouton est clairement étiqueté. Tu obtiens le même résultat sans devoir comprendre le fonctionnement interne de la machine.

**Comparaison Webpack brut vs Webpack Encore** :

| Webpack brut | Webpack Encore |
| --- | --- |
| Configuration manuelle de chaque loader | Méthodes prêtes à l'emploi (`.enableSassLoader()`) |
| Pas d'intégration Symfony | Intégration automatique avec Twig |
| Fichier de configuration long et complexe | Fichier de configuration court et lisible |
| Demande une expertise Webpack | Accessible aux débutants |

Le schéma suivant illustre le pipeline de compilation de Webpack Encore :

<div class="diagram-design">
<p><a href="../../diagrams/05-javascript-02-webpack-encore-installation-1.html">Qu&#x27;est-ce que Webpack Encore ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/05-javascript-02-webpack-encore-installation-1.html" title="Qu&#x27;est-ce que Webpack Encore ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que Node.js et npm ?

**Définition** : Node.js est un environnement d'exécution JavaScript en dehors du navigateur. npm (_Node Package Manager_) est le gestionnaire de paquets de Node.js, utilisé pour installer des bibliothèques JavaScript.

**Pourquoi Node.js est nécessaire** :

Webpack et Encore sont des programmes JavaScript. Pour les exécuter sur ton ordinateur (pas dans un navigateur), tu as besoin de Node.js. npm sert à télécharger et installer Webpack, Encore, et toutes leurs dépendances.

**Analogie concrète** : Node.js est comme PHP pour JavaScript : il permet d'exécuter du code en ligne de commande. npm est comme Composer pour JavaScript : il télécharge et gère les bibliothèques.

**Comparaison avec l'écosystème PHP** :

| Écosystème PHP | Écosystème JavaScript |
| --- | --- |
| PHP (interpréteur) | Node.js (interpréteur) |
| Composer (gestionnaire de paquets) | npm (gestionnaire de paquets) |
| `composer.json` (liste des dépendances) | `package.json` (liste des dépendances) |
| `composer.lock` (versions exactes) | `package-lock.json` (versions exactes) |
| `vendor/` (dossier des dépendances) | `node_modules/` (dossier des dépendances) |

---

### Qu'est-ce que le fichier `manifest.json` ?

**Définition** : Le fichier `manifest.json` est un fichier généré par Webpack Encore qui associe le nom d'un fichier source à son nom compilé. C'est une table de correspondance.

**Le problème que `manifest.json` résout** :

Quand Webpack compile tes fichiers en production, il ajoute un hash (une suite de caractères aléatoires) au nom du fichier. Par exemple, `app.css` devient `app.abc123.css`. Ce hash force le navigateur à télécharger la nouvelle version au lieu d'utiliser son cache. Mais comment Twig sait-il quel nom de fichier utiliser ?

Le fichier `manifest.json` contient la correspondance :

```json
{
  "build/app.css": "/build/app.abc123.css",
  "build/app.js": "/build/app.def456.js"
}
```

Quand Twig utilise `encore_entry_link_tags('app')`, il consulte ce fichier pour trouver le vrai nom du fichier CSS à inclure dans le HTML.

**Analogie concrète** : `manifest.json` est comme le registre d'un hôtel. Chaque client (fichier source) a un nom connu (`app.css`), mais sa chambre change à chaque visite (le hash). Le registre permet au réceptionniste (Twig) de toujours retrouver la bonne chambre.

---

## Étapes Pratiques

### Étape 1 : Vérifier que Node.js et npm sont installés

Avant d'installer Encore, tu dois vérifier que Node.js et npm sont disponibles dans ton conteneur Docker ou sur ta machine.

Commande :

```bash
# Vérifier la version de Node.js
node --version
```

**Résultat attendu** :

```text
v22.x.x
```

```bash
# Vérifier la version de npm
npm --version
```

**Résultat attendu** :

```text
10.x.x
```

Si ces commandes échouent, Node.js n'est pas installé. Tu dois l'installer avant de continuer.

---

### Étape 2 : Installer le bundle Webpack Encore

Le bundle Symfony fournit l'intégration entre Encore et Twig (les fonctions `encore_entry_script_tags` et `encore_entry_link_tags`).

Commande :

```bash
# Installer le bundle Webpack Encore via Composer
composer require symfony/webpack-encore-bundle
```

**Résultat attendu** :

```text
Using version ^2.x for symfony/webpack-encore-bundle
./composer.json has been updated
Loading composer repositories with package information
...
Symfony operations: 1 recipe
  - Configuring symfony/webpack-encore-bundle (>=2.0): From github.com/symfony/recipes...
```

**Ce que cette commande fait** : elle ajoute le bundle dans `composer.json`, le télécharge, puis exécute la recette Symfony Flex qui crée automatiquement `webpack.config.js`, le dossier `assets/`, `package.json`, et `config/packages/webpack_encore.yaml`.

---

### Étape 3 : Installer les dépendances npm

Le fichier `package.json` créé par la recette Flex liste les paquets JavaScript nécessaires. Tu dois les télécharger avec npm.

Commande :

```bash
# Installer toutes les dépendances JavaScript
npm install
```

**Résultat attendu** :

```text
added 500+ packages, and audited 500+ packages in 30s
found 0 vulnerabilities
```

**Ce que cette commande fait** : elle lit `package.json`, télécharge les paquets dans `node_modules/`, et crée `package-lock.json` (versions exactes). Le dossier `node_modules/` est volumineux et déjà listé dans `.gitignore`.

---

### Étape 4 : Comprendre la structure du dossier `assets/`

Après l'installation, le dossier `assets/` contient les fichiers source de ton CSS et JavaScript. Voici sa structure :

```text
assets/
├── app.js            # Point d'entrée JavaScript principal
├── bootstrap.js      # Initialisation de Stimulus (optionnel)
├── controllers/      # Contrôleurs Stimulus (optionnel)
│   └── hello_controller.js
├── controllers.json  # Configuration des contrôleurs Stimulus (optionnel)
└── styles/
    └── app.css       # Fichier CSS principal
```

**Fichier `assets/app.js`** :

C'est le point d'entrée principal. Webpack commence ici et suit les imports pour trouver tous les fichiers nécessaires.

```javascript
// assets/app.js

// Importe le fichier CSS principal
// Webpack sait gérer les imports CSS dans un fichier JS
import './styles/app.css';

// Tu peux ajouter ton code JavaScript ici
console.log('Webpack Encore fonctionne !');
```

**Fichier `assets/styles/app.css`** :

C'est le fichier CSS principal de ton application.

```css
/* assets/styles/app.css */

body {
    background-color: #f5f5f5;
    font-family: Arial, sans-serif;
}
```

**Point important** : Tu ne modifies jamais les fichiers dans `public/build/`. Tu travailles uniquement dans `assets/`. Webpack compile les fichiers de `assets/` vers `public/build/`.

---

### Étape 5 : Comprendre le fichier `webpack.config.js`

Ce fichier est le cœur de la configuration d'Encore. Il se trouve à la racine du projet.

```javascript
// webpack.config.js

// API CJS Encore 5.x / 6.x (cette fiche).
// Encore 7 : fichier ESM + `export default await Encore.getWebpackConfig()`.
const Encore = require('@symfony/webpack-encore');

if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // Dossier de sortie des fichiers compilés
    .setOutputPath('public/build/')

    // Chemin public utilisé par le serveur web
    .setPublicPath('/build')

    // Point d'entrée : Webpack part de ce fichier et suit les imports
    .addEntry('app', './assets/app.js')

    // Découpage automatique du code en plusieurs fichiers
    .splitEntryChunks()

    // Nécessaire pour splitEntryChunks()
    .enableSingleRuntimeChunk()

    // Source maps en développement (pour le débogage)
    .enableSourceMaps(!Encore.isProduction())

    // Versionnage des fichiers en production (hash dans le nom)
    .enableVersioning(Encore.isProduction())
;

module.exports = Encore.getWebpackConfig();
```

**Explication de chaque section** :

| Méthode | Rôle |
| --- | --- |
| `.setOutputPath('public/build/')` | Définit où Webpack écrit les fichiers compilés |
| `.setPublicPath('/build')` | Définit l'URL publique pour accéder aux fichiers |
| `.addEntry('app', './assets/app.js')` | Déclare un point d'entrée (un fichier JS principal) |
| `.splitEntryChunks()` | Sépare le code partagé entre plusieurs entrées |
| `.enableSingleRuntimeChunk()` | Crée un fichier runtime nécessaire au fonctionnement des chunks |
| `.enableSourceMaps()` | Génère des fichiers `.map` pour le débogage |
| `.enableVersioning()` | Ajoute un hash aux noms de fichiers pour invalider le cache |

---

### Étape 6 : Intégrer les fichiers compilés dans Twig

Pour que le navigateur charge les fichiers CSS et JavaScript compilés par Encore, tu dois les inclure dans ton template Twig de base.

Ouvre le fichier `templates/base.html.twig` :

```twig
{# templates/base.html.twig #}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{% block title %}Mon Application{% endblock %}</title>

    {% block stylesheets %}
        {# Inclut les fichiers CSS compilés pour l'entrée 'app' #}
        {{ encore_entry_link_tags('app') }}
    {% endblock %}
</head>
<body>
    {% block body %}{% endblock %}

    {% block javascripts %}
        {# Inclut les fichiers JavaScript compilés pour l'entrée 'app' #}
        {{ encore_entry_script_tags('app') }}
    {% endblock %}
</body>
</html>
```

**Explication des fonctions Twig** :

| Fonction Twig | Ce qu'elle génère |
| --- | --- |
| `encore_entry_link_tags('app')` | Des balises `<link rel="stylesheet">` pour chaque fichier CSS de l'entrée 'app' |
| `encore_entry_script_tags('app')` | Des balises `<script>` pour chaque fichier JS de l'entrée 'app' |

Le nom `'app'` passé à ces fonctions correspond au premier argument de `.addEntry('app', './assets/app.js')` dans `webpack.config.js`. En développement, Twig génère `<link href="/build/app.css">`. En production, il génère `<link href="/build/app.abc123.css">` (avec le hash).

---

### Étape 7 : Compiler les fichiers (première compilation)

Maintenant que tout est configuré, tu peux lancer la compilation.

Commande :

```bash
# Compiler les fichiers en mode développement
npm run dev
```

**Résultat attendu** :

```text
 DONE  Compiled successfully in 1200ms

 3 files written to public/build
  - app.js
  - app.css
  - runtime.js
```

**Ce que cette commande fait** : elle lit `webpack.config.js`, part de `assets/app.js`, suit les imports (dont `app.css`), compile et combine les fichiers, puis écrit le résultat dans `public/build/` avec le fichier `manifest.json`.

---

### Étape 8 : Vérifier le dossier de sortie `public/build/`

Après la compilation, le dossier `public/build/` contient les fichiers prêts pour le navigateur :

```text
public/build/
├── app.css              # CSS compilé
├── app.js               # JavaScript compilé
├── runtime.js           # Code de gestion des modules Webpack
├── manifest.json        # Table de correspondance des fichiers
└── entrypoints.json     # Liste des fichiers par point d'entrée
```

**Le fichier `manifest.json`** :

```json
{
  "build/app.css": "/build/app.css",
  "build/app.js": "/build/app.js",
  "build/runtime.js": "/build/runtime.js"
}
```

**Le fichier `entrypoints.json`** :

```json
{
  "entrypoints": {
    "app": {
      "css": ["/build/app.css"],
      "js": ["/build/runtime.js", "/build/app.js"]
    }
  }
}
```

Quand tu appelles `encore_entry_script_tags('app')`, Twig lit ce fichier et génère les balises `<script>` correspondantes.

---

### Étape 9 : Les trois modes de compilation

Encore fournit trois commandes de compilation adaptées à différentes situations.

**Les trois commandes** :

```bash
npm run dev     # Compile une seule fois, sans minification
npm run watch   # Compile et recompile automatiquement à chaque modification
npm run build   # Compile avec toutes les optimisations (production)
```

**Comparaison des trois modes** :

| Mode | Commande | Minification | Watch | Versionnage | Utilisation |
| --- | --- | --- | --- | --- | --- |
| Dev | `npm run dev` | Non | Non | Non | Test rapide |
| Watch | `npm run watch` | Non | Oui | Non | Développement quotidien |
| Build | `npm run build` | Oui | Non | Oui | Production |

---

### Étape 10 : Vérifier dans le navigateur

Ouvre ton navigateur et accède à ton application Symfony. Ouvre la console de développement (`F12`, onglet "Console").

**Résultat attendu** : Le message `Webpack Encore fonctionne !` apparaît dans la console (il vient du `console.log` dans `assets/app.js`). La page a un fond gris clair (`#f5f5f5`), ce qui confirme que le CSS est chargé.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `composer require symfony/webpack-encore-bundle` | Installe le bundle Encore dans Symfony |
| `npm install` | Installe les dépendances JavaScript |
| `npm run dev` | Compile les fichiers une seule fois (développement) |
| `npm run watch` | Compile et surveille les modifications |
| `npm run build` | Compile avec optimisations (production) |
| `node --version` | Affiche la version de Node.js |
| `npm --version` | Affiche la version de npm |
| `npm cache clean --force` | Vide le cache npm (en cas de problème) |

---

## Pièges Fréquents

### Piège 1 : Oublier `npm install` après le `composer require`

**Problème** : Tu lances `npm run dev` juste après `composer require symfony/webpack-encore-bundle` et tu obtiens une erreur.

```text
sh: encore: command not found
```

**Solution** : Le `composer require` crée le fichier `package.json` mais ne télécharge pas les paquets JavaScript. Tu dois exécuter `npm install` avant de pouvoir compiler.

```bash
# Toujours exécuter npm install après avoir installé le bundle
npm install
npm run dev
```

---

### Piège 2 : Le dossier `public/build/` n'existe pas

**Problème** : Symfony affiche une erreur dans le navigateur :

```text
An exception has been thrown during the rendering of a template
("Could not find the entrypoints file from Webpack").
```

**Solution** : Le dossier `public/build/` est créé par la compilation. Il faut d'abord compiler les fichiers :

```bash
npm run dev
```

---

### Piège 3 : Modifier les fichiers dans `public/build/` au lieu de `assets/`

**Problème** : Tu modifies directement `public/build/app.css`. Tes modifications disparaissent à la prochaine compilation.

**Solution** : Travaille toujours dans le dossier `assets/`. Le dossier `public/build/` est généré automatiquement par Webpack. Toute modification manuelle dans `public/build/` sera écrasée.

```text
assets/styles/app.css     ← Tu modifies ici
public/build/app.css      ← Webpack génère ici (ne pas toucher)
```

---

### Piège 4 : Le nom de l'entrée Twig ne correspond pas à `webpack.config.js`

**Problème** : Tu appelles `encore_entry_link_tags('main')` dans Twig, mais dans `webpack.config.js` l'entrée s'appelle `'app'`.

```text
Could not find the entry "main" in entrypoints.json.
```

**Solution** : Le nom passé aux fonctions Twig doit correspondre exactement au premier argument de `.addEntry()` :

```javascript
// webpack.config.js
.addEntry('app', './assets/app.js')  // Le nom est 'app'
```

```twig
{# Le nom dans Twig doit être identique #}
{{ encore_entry_link_tags('app') }}
{{ encore_entry_script_tags('app') }}
```

---

### Piège 5 : `npm run watch` ne détecte pas les modifications

**Problème** : Tu modifies un fichier dans `assets/` mais rien ne se recompile.

**Solution** : Arrête `watch` (`Ctrl+C`) et relance-le. Vérifie aussi que le fichier modifié est importé (directement ou indirectement) depuis un point d'entrée déclaré dans `webpack.config.js`.

---

## Checklist de Validation

- [ ] Node.js et npm sont installés et fonctionnels (`node --version` affiche `v22.x.x`)
- [ ] Le bundle `symfony/webpack-encore-bundle` est installé via Composer
- [ ] Les dépendances npm sont installées (`npm install` exécuté sans erreur)
- [ ] Le fichier `webpack.config.js` existe à la racine du projet
- [ ] Le dossier `assets/` contient `app.js` et `styles/app.css`
- [ ] La commande `npm run dev` compile sans erreur
- [ ] Le dossier `public/build/` contient les fichiers compilés et `manifest.json`
- [ ] Les fonctions `encore_entry_link_tags('app')` et `encore_entry_script_tags('app')` sont dans `base.html.twig`
- [ ] La page s'affiche correctement dans le navigateur avec le CSS appliqué

---

## Exercice Pratique

**Énoncé** : Ajoute un deuxième point d'entrée Webpack pour une page d'administration.

Voici les étapes à réaliser :

1. Crée un fichier `assets/admin.js`
2. Crée un fichier `assets/styles/admin.css`
3. Importe le fichier CSS dans `admin.js`
4. Déclare une nouvelle entrée `'admin'` dans `webpack.config.js`
5. Compile les fichiers avec `npm run dev`
6. Vérifie que `public/build/` contient les fichiers `admin.js` et `admin.css`

**Indications** :

- Le fichier `admin.js` doit importer `./styles/admin.css` (même principe que `app.js`)
- Dans `webpack.config.js`, ajoute un `.addEntry('admin', './assets/admin.js')` en dessous du `.addEntry('app', ...)`
- Le CSS de la page admin doit avoir un fond de couleur différent (par exemple `#e8f0fe`)
- Ajoute un `console.log('Page admin chargée')` dans `admin.js`

**Résultat attendu** :

- La commande `npm run dev` compile sans erreur et affiche 5+ fichiers écrits
- Le fichier `public/build/entrypoints.json` contient deux entrées : `app` et `admin`
- Tu peux utiliser `encore_entry_link_tags('admin')` dans un template Twig dédié à l'admin

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Créer le fichier `assets/admin.js`** :

```javascript
// assets/admin.js

// Importe le CSS spécifique à l'administration
import './styles/admin.css';

console.log('Page admin chargée');
```

**Étape 2 : Créer le fichier `assets/styles/admin.css`** :

```css
/* assets/styles/admin.css */

body {
    background-color: #e8f0fe;
    font-family: 'Segoe UI', Tahoma, sans-serif;
}

h1 {
    color: #1a73e8;
}
```

**Étape 3 : Modifier `webpack.config.js`** :

```javascript
Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')

    // Entrée principale de l'application
    .addEntry('app', './assets/app.js')

    // Nouvelle entrée pour la section administration
    .addEntry('admin', './assets/admin.js')

    .splitEntryChunks()
    .enableSingleRuntimeChunk()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
;
```

**Étape 4 : Compiler** :

```bash
npm run dev
```

**Résultat attendu** :

```text
 DONE  Compiled successfully in 1500ms

 5 files written to public/build
  - app.js
  - app.css
  - admin.js
  - admin.css
  - runtime.js
```

**Étape 5 : Vérifier `entrypoints.json`** :

```json
{
  "entrypoints": {
    "app": {
      "css": ["/build/app.css"],
      "js": ["/build/runtime.js", "/build/app.js"]
    },
    "admin": {
      "css": ["/build/admin.css"],
      "js": ["/build/runtime.js", "/build/admin.js"]
    }
  }
}
```

---

## Navigation

← Fiche précédente : **[01 - JavaScript dans Symfony](01-javascript-dans-symfony.md)**

→ Fiche suivante : **[03 - Webpack Encore : Utilisation au quotidien](03-webpack-encore-utilisation.md)**
