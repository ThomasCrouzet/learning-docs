---
tags:
  - EasyAdmin
  - Avancé
  - Pratique
description: "Personnalisation visuelle avancée d'EasyAdmin"
estimated_time: "35 min"
fiche_number: 7
total_fiches: 7
cursus: "EasyAdmin"
---

# 07 - Personnalisation visuelle avancée d'EasyAdmin

> **En bref** : À la fin de cette fiche, tu sauras personnaliser l'apparence d'EasyAdmin : changer le logo et le titre, ajouter ton propre CSS, et surcharger les templates Twig. Lecture estimée : 35 min.


## Prérequis

- Avoir complété la fiche **[06 - Actions personnalisées dans EasyAdmin](06-easyadmin-actions-personnalisees.md)**
- Avoir un projet EasyAdmin fonctionnel
- Les conteneurs Docker doivent être en cours d'exécution (`docker compose up -d`)

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| EasyAdmin | 4.x |
| PHP | 8.3 |
| Symfony | 7.4 |

## Objectif de cette fiche

EasyAdmin est beau par défaut, mais il ressemble à tous les autres EasyAdmin.
Pour que ton client ou ton utilisateur se sente chez lui, tu dois mettre l'interface à ses couleurs.

À la fin de cette fiche, tu sauras :

1. Changer le logo et le titre.
2. Ajouter ton propre CSS pour modifier les couleurs.
3. Surcharger les templates Twig pour modifier la structure HTML.

---

## Concepts

### L'Héritage de Templates Twig

EasyAdmin est construit avec **Twig**, le moteur de template de Symfony.
Toute l'interface est composée de petits fichiers `.html.twig` (un pour le menu, un pour le tableau, un pour la pagination...).

Pour modifier une partie de l'interface, on ne modifie **JAMAIS** les fichiers du dossier `vendor/` (le code source d'EasyAdmin).
À la place, on utilise l'héritage :

1. On crée un fichier Twig dans notre dossier `templates/`.
2. On dit à EasyAdmin d'utiliser _notre_ fichier à la place du sien.
3. Dans notre fichier, on peut étendre le fichier original pour ne modifier qu'une petite partie.

**Analogie concrète** : Imagine un appartement meublé que tu loues. Tu n'as pas le droit de casser les murs ou de remplacer la plomberie (les fichiers dans `vendor/`). Par contre, tu peux poser tes propres rideaux, ajouter des tableaux au mur, et changer la housse du canapé (tes fichiers dans `templates/`). Tu personnalises l'apparence sans toucher à la structure d'origine. Et si tu retires tes décorations, l'appartement revient exactement comme avant.

### Les Assets (CSS / JS)

Pour changer les couleurs, les polices ou les espacements, on utilise du **CSS**.
EasyAdmin permet d'injecter facilement tes propres fichiers `.css` ou `.js` dans l'interface d'administration.

**Analogie concrète** : Imagine que tu organises une fête dans une salle des fêtes. La salle a déjà des tables, des chaises et un éclairage de base (le style par défaut d'EasyAdmin). Les assets, ce sont les décorations que tu apportes toi-même : des nappes colorées (CSS pour les couleurs), des guirlandes lumineuses (CSS pour les animations), et une playlist musicale (JS pour les interactions). Tu les déposes dans la salle, et elle prend immédiatement ton style personnel.

---

## Étapes Pratiques

### Partie 1 : Personnalisation basique du Dashboard

Commence par le titre et le favicon.

Ouvre `src/Controller/Admin/DashboardController.php`.

Modifie la méthode `configureDashboard` :

```php
    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            // 1. Titre simple (texte)
            // ->setTitle('Mon Super Projet')
            
            // 2. Titre avec HTML (ex: mettre une image/logo)
            // Note : le chemin de l'image doit être dans 'public/'
            ->setTitle('<img src="images/logo.png" width="50"> Mon Projet <span class="text-small">v1.0</span>')
            
            // 3. Changer le favicon (l'icône dans l'onglet du navigateur)
            ->setFaviconPath('favicon.ico')
            
            // 4. Désactiver le switch "Mode Sombre / Mode Clair" (si tu veux forcer un mode)
            // ->disableDarkMode()
            
            // 5. Traduction (par défaut 'messages')
            ->setTranslationDomain('admin');
    }
```

**Teste** : Actualise la page. Si tu as mis du HTML dans `setTitle`, tu devrais voir le changement immédiatement (même si l'image est cassée si tu n'as pas mis de fichier réel, c'est normal pour l'instant).

---

### Partie 2 : Ajouter du CSS personnalisé

Tu vas changer la couleur de fond de la barre latérale (menu) pour la mettre en bleu nuit.

#### Étape 2.1 : Créer le fichier CSS

Crée un nouveau fichier : `public/css/admin.css`.

Ajoute ce contenu CSS :

```css
/* public/css/admin.css */

/* Change la couleur de fond du menu latéral */
:root {
    /* Noms pris dans variables-theme.css d'EasyAdmin 4.x */
    --sidebar-bg: #1a237e; /* Bleu nuit */
    --sidebar-menu-color: #ffffff;
    --sidebar-logo-color: #ffeb3b; /* Jaune */
}

/* Exemple : Mettre les badges en plus gros */
.badge {
    font-size: 1em !important;
    padding: 0.5em 1em !important;
}

/* Exemple : Bordure arrondie sur les images */
.field-image img {
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

> **Astuce** : Pour connaître les variables CSS disponibles, ouvre l'inspecteur de ton navigateur sur l'admin, cherche la balise `<body>` ou `:root`, et regarde la liste des variables (`--primary-color`, etc.).

#### Étape 2.2 : Charger le CSS dans EasyAdmin

Retourne dans `DashboardController.php`.

Ajoute cet import en haut du fichier :

```php
use EasyCorp\Bundle\EasyAdminBundle\Config\Assets;
```

Puis ajoute la méthode `configureAssets` :

```php
    public function configureAssets(Assets $assets): Assets
    {
        return $assets
            // Ajoute ton fichier CSS
            ->addCssFile('css/admin.css');
            // Tu pourrais aussi ajouter du JS :
            // ->addJsFile('js/admin.js')
    }
```

**Teste** : Vide le cache (`php bin/console cache:clear`) et actualise. Ton menu devrait être bleu !

---

### Partie 3 : Surcharger un Template (Niveau Avancé)

Dans certains cas, le CSS ne suffit pas. Tu veux changer la structure HTML d'une page ou d'un champ.

Imaginons que tu veux afficher les **images des produits en grand** dans la liste, pas juste en miniature.

EasyAdmin utilise des templates pour chaque type de champ. Tu vas dire au `ProductCrudController` d'utiliser _ton_ template pour le champ Image, mais uniquement pour ce contrôleur.

#### Étape 3.1 : Identifier le template à surcharger

Pour les champs, EasyAdmin cherche des templates standards.
Tu vas créer un template spécifique pour afficher une image différemment.

Crée le fichier : `templates/admin/field/big_image.html.twig`.

```twig
{# templates/admin/field/big_image.html.twig #}

{# field.value contient le nom du fichier image #}
{# field.formattedValue contient le chemin complet (géré par EasyAdmin) #}

{% if field.value %}
    <div class="big-image-container" style="text-align: center;">
        <a href="{{ asset(field.formattedValue) }}" target="_blank">
            <img src="{{ asset(field.formattedValue) }}" 
                 alt="Image produit" 
                 style="max-width: 150px; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.2);">
        </a>
        <div class="small text-muted mt-1">{{ field.value }}</div>
    </div>
{% else %}
    <span class="badge badge-secondary">Pas d'image</span>
{% endif %}
```

> **Note** : `asset()` est une fonction Twig qui génère le bon chemin vers le dossier `public/`. Ici, `field.formattedValue` contient le chemin relatif (défini par `setBasePath` dans le contrôleur). Si l'image ne s'affiche pas, vérifie que `setBasePath` dans ton contrôleur correspond bien au chemin réel dans `public/`.
> Si `formattedValue` contient déjà `uploads/images/...`, alors `asset()` fonctionnera.

#### Étape 3.2 : Appliquer ce template au champ

Ouvre `src/Controller/Admin/ProductCrudController.php`.

Dans `configureFields`, modifie ton `ImageField` :

```php
    ImageField::new('imageFilename')
        ->setBasePath('uploads/images/products')
        ->setUploadDir('public/uploads/images/products')
        // C'est ici que la magie opère :
        ->setTemplatePath('admin/field/big_image.html.twig')
```

**Teste** : Actualise la liste des produits. Tes images devraient maintenant utiliser ton nouveau design (plus grandes, avec bordure et nom du fichier en dessous).

---

### Partie 4 : Surcharger le Layout global (Expert)

Si tu veux ajouter un élément présent sur **toutes** les pages (ex: un pied de page avec "Copyright MonEntreprise 2024"), tu dois surcharger le layout principal.

#### Étape 4.1 : Créer le template layout

Crée `templates/admin/layout.html.twig`.

```twig
{# On étend le layout de base d'EasyAdmin #}
{% extends '@EasyAdmin/layout.html.twig' %}

{# On surcharge le bloc 'content_footer_wrapper' (pied de page) #}
{% block content_footer_wrapper %}
    <div class="admin-footer" style="padding: 20px; text-align: center; color: #666; border-top: 1px solid #eee; margin-top: 50px;">
        <p>&copy; {{ 'now'|date('Y') }} - Mon Entreprise - <a href="#">Support Technique</a></p>
        <p class="small">Interface générée pour l'apprenant</p>
    </div>
{% endblock %}

{# Tu peux aussi ajouter des choses dans le <head> #}
{% block head_stylesheets %}
    {{ parent() }}
    <style>
        /* CSS spécifique injecté directement */
        .admin-footer a { color: #1a237e; text-decoration: none; }
    </style>
{% endblock %}
```

#### Étape 4.2 : Configurer le Dashboard pour utiliser ce layout

Ouvre `src/Controller/Admin/DashboardController.php`.

Dans `configureCrud` (ajoute la méthode si elle n'existe pas).

Ajoute cet import en haut du fichier :

```php
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
```

Puis la méthode :

```php
    public function configureCrud(): Crud
    {
        return Crud::new()
            // On dit à EasyAdmin d'utiliser notre layout pour TOUT l'admin
            ->overrideTemplate('layout', 'admin/layout.html.twig');
    }
```

**Teste** : Actualise n'importe quelle page de l'admin. Tu devrais voir ton pied de page tout en bas.

---

## Récapitulatif

Tu as appris à personnaliser EasyAdmin à trois niveaux :

1. **Configuration PHP** : Titre, Favicon, Assets (`configureDashboard`, `configureAssets`).
2. **CSS** : Modification des couleurs et styles (`admin.css`).
3. **Templates Twig** : Modification structurelle des champs ou du layout global (`setTemplatePath`, `overrideTemplate`).

Avec ces outils, tu peux transformer complètement l'apparence de l'outil pour qu'il ne ressemble plus à un "site par défaut".

---

## Checklist de Validation

- [ ] J'ai changé le titre du Dashboard (et éventuellement mis un logo).
- [ ] J'ai créé un fichier `admin.css` et changé la couleur du menu.
- [ ] J'ai créé un template personnalisé pour un champ (ex: image).
- [ ] J'ai ajouté un pied de page personnalisé via le layout.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console cache:clear` | Vider le cache Symfony (obligatoire après modification de templates ou CSS) |
| `php bin/console debug:twig` | Lister toutes les fonctions et filtres Twig disponibles |
| `php bin/console debug:router` | Vérifier les routes admin générées (EasyAdmin 4 se configure surtout en PHP, pas en YAML) |

---

## Pièges Fréquents

### Piège 1 : Le cache navigateur empêche de voir les modifications CSS

⚠️ **Problème** : Tu modifies ton fichier `admin.css`, tu actualises la page, mais rien ne change. Les anciennes couleurs persistent.

✅ **Solution** : Le navigateur met en cache les fichiers CSS. Deux solutions :

1. **Actualisation forcée** : appuie sur `Ctrl + Shift + R` (Windows/Linux) ou `Cmd + Shift + R` (Mac) pour forcer le rechargement sans cache.
2. **Astuce développeur** : Ouvre les outils développeur (F12), va dans l'onglet "Network" et coche "Disable cache" pendant le développement.

### Piège 2 : Oublier cache:clear après modification d'un template Twig

⚠️ **Problème** : Tu crées ou modifies un template Twig (`templates/admin/...`), mais EasyAdmin continue d'utiliser l'ancien template.

✅ **Solution** : En environnement `dev`, Symfony recompile les templates Twig automatiquement. Si le changement ne s'applique pas, exécute :

```bash
php bin/console cache:clear
```

En environnement `prod`, cette commande est **obligatoire** après chaque modification de template.

### Piège 3 : Chemin CSS incorrect dans configureAssets

⚠️ **Problème** : Tu ajoutes ton fichier CSS avec `addCssFile('public/css/admin.css')` et le fichier n'est pas chargé. La page admin garde son style par défaut.

✅ **Solution** : Le chemin passé à `addCssFile()` est relatif au dossier `public/`. Ne mets pas `public/` dans le chemin :

```php
// Incorrect : le navigateur cherchera /public/css/admin.css
$assets->addCssFile('public/css/admin.css');

// Correct : le navigateur cherchera /css/admin.css (qui pointe vers public/css/admin.css)
$assets->addCssFile('css/admin.css');
```

### Piège 4 : Les variables CSS EasyAdmin ne s'appliquent pas

⚠️ **Problème** : Tu définis `--sidebar-bg: #1a237e;` dans ton fichier CSS, mais la couleur de la sidebar ne change pas.

✅ **Solution** : Les variables CSS EasyAdmin changent entre les versions. Ouvre l'inspecteur de ton navigateur (F12), sélectionne l'élément `:root` ou `body`, et regarde les noms exacts des variables utilisées. Les noms courants en EasyAdmin 4.x sont :

```css
:root {
    --sidebar-bg: #1a237e;
    --sidebar-menu-color: #ffffff;
    --sidebar-menu-active-item-bg: rgba(255, 255, 255, 0.1);
}
```

Les noms exacts dans `vendor/easycorp/easyadmin-bundle/assets/css/easyadmin-theme/variables-theme.css` (branche 4.x) sont `--sidebar-bg`, `--sidebar-menu-color`, `--sidebar-menu-active-item-bg` et `--sidebar-logo-color`. Il n'existe pas de `--sidebar-color` ni de `--sidebar-link-color`.

Si ces noms ne fonctionnent pas dans ta version, utilise l'inspecteur pour trouver les bons sélecteurs CSS et cible-les directement.

---

## Exercice Pratique

**Énoncé** : Personnalise l'interface EasyAdmin de ton projet en réalisant les trois modifications suivantes :

1. Change la couleur primaire du thème (couleur de la sidebar et des boutons principaux)
2. Ajoute un logo personnalisé dans le header du Dashboard (utilise une image ou du texte HTML stylisé)
3. Crée un template personnalisé pour afficher le champ `price` des produits avec un format spécial (badge vert si le prix est inférieur à 50, badge rouge sinon)

**Indications** :

- Pour le logo, utilise `setTitle()` avec du HTML dans `configureDashboard()`
- Pour les couleurs, modifie les variables CSS dans `public/css/admin.css`
- Pour le template de prix, crée un fichier `templates/admin/field/price_badge.html.twig`
- Utilise `setTemplatePath()` sur le champ prix dans `configureFields()`
- Dans le template Twig, utilise `field.value` pour accéder à la valeur du prix

**Résultat attendu** : La sidebar a une couleur personnalisée, le header affiche ton logo/texte stylisé, et les prix dans la liste des produits s'affichent sous forme de badges colorés selon leur montant.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Étape 1 : Modifier les couleurs du thème

Ouvre (ou crée) le fichier `public/css/admin.css` :

```css
/* public/css/admin.css */

/* Couleurs personnalisées de la sidebar */
:root {
    --sidebar-bg: #2c3e50;                    /* Gris-bleu foncé */
    --sidebar-menu-color: #ecf0f1;            /* Blanc cassé */
    --sidebar-menu-active-item-bg: rgba(255, 255, 255, 0.15);
}

/* Couleur primaire des boutons et liens */
.btn-primary {
    background-color: #2c3e50 !important;
    border-color: #2c3e50 !important;
}

/* Style du header/logo */
.sidebar-header .app-brand-name {
    font-weight: bold;
    font-size: 1.2em;
}
```

### Étape 2 : Ajouter le logo dans le Dashboard

Ouvre `src/Controller/Admin/DashboardController.php` :

```php
public function configureDashboard(): Dashboard
{
    return Dashboard::new()
        // Logo en HTML : une icône FontAwesome + texte stylisé
        ->setTitle('<i class="fa fa-store"></i> Ma Boutique <span style="font-size: 0.6em; color: #95a5a6;">v1.0</span>')
        ->setFaviconPath('favicon.ico');
}

public function configureAssets(Assets $assets): Assets
{
    return $assets
        ->addCssFile('css/admin.css');
}
```

### Étape 3 : Créer le template de prix personnalisé

Crée le fichier `templates/admin/field/price_badge.html.twig` :

```twig
{# templates/admin/field/price_badge.html.twig #}
{# Dans ce cursus, le prix est stocké en euros (DECIMAL) avec setStoredAsCents(false). #}
{# field.value est déjà en euros. #}

{% if field.value is not null %}
    {% set prix_euros = field.value %}
    {% if prix_euros < 50 %}
        {# Badge vert pour les prix inférieurs à 50 euros #}
        <span class="badge" style="background-color: #27ae60; color: white; font-size: 1em; padding: 0.4em 0.8em;">
            {{ prix_euros|number_format(2, ',', ' ') }} €
        </span>
    {% else %}
        {# Badge rouge pour les prix de 50 euros et plus #}
        <span class="badge" style="background-color: #e74c3c; color: white; font-size: 1em; padding: 0.4em 0.8em;">
            {{ prix_euros|number_format(2, ',', ' ') }} €
        </span>
    {% endif %}
{% else %}
    <span class="text-muted">Non défini</span>
{% endif %}
```

### Étape 4 : Appliquer le template au champ prix

Dans `src/Controller/Admin/ProductCrudController.php`, modifie le champ prix dans `configureFields` :

```php
MoneyField::new('price')
    ->setCurrency('EUR')
    ->setStoredAsCents(false)
    // Utilise notre template personnalisé pour l'affichage en liste
    ->setTemplatePath('admin/field/price_badge.html.twig')
```

### Étape 5 : Tester

1. Vide le cache : `php bin/console cache:clear`
2. Actualise la page admin avec `Ctrl + Shift + R` (pour forcer le rechargement CSS)
3. Vérifie que la sidebar a ta couleur personnalisée
4. Vérifie que le header affiche ton logo/texte
5. Va sur la liste des produits et vérifie que les prix s'affichent en badges colorés

---

## Navigation

← Fiche précédente : **[Actions personnalisées dans EasyAdmin](06-easyadmin-actions-personnalisees.md)**
