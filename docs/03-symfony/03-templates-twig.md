---
tags:
  - Symfony
  - Débutant
  - Pratique
description: "Templates Twig"
estimated_time: "70 min"
fiche_number: 3
total_fiches: 21
cursus: "Symfony"
---

# 03 - Templates Twig

> **En bref** : À la fin de cette fiche, tu sauras créer et modifier des templates Twig pour afficher des pages HTML dynamiques dans Symfony. Lecture estimée : 70 min.


## Prérequis

- Avoir lu la fiche **[01 - Architecture Symfony](01-architecture-symfony.md)**
- Avoir lu la fiche **[02 - Contrôleurs et routes](02-controleurs-routes.md)**
- Comprendre les variables PHP (fiche **[02-php/02 - Variables et types](../02-php/02-variables-types.md)**)
- Comprendre les boucles PHP (fiche **[02-php/05 - Les boucles](../02-php/05-boucles.md)**)
- Comprendre les conditions PHP (fiche **[02-php/04 - Les conditions](../02-php/04-conditions.md)**)

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Twig | 3.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et modifier des templates Twig pour afficher des pages HTML dynamiques dans Symfony.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Twig ?

**Définition** : Twig est un moteur de templates pour PHP. Il permet de générer des pages HTML en mélangeant du HTML statique avec des données dynamiques provenant de PHP.

**Le problème que Twig résout** :

Sans Twig, voici les problèmes rencontrés :

1. **Mélange code PHP et HTML** : Le code devient illisible avec des `<?php ?>` partout dans le HTML.
2. **Risques de sécurité** : Oublier d'échapper les données utilisateur expose aux failles XSS.
3. **Duplication de code** : Copier-coller le header et footer dans chaque page.
4. **Syntaxe verbeuse** : Écrire `<?php echo htmlspecialchars($variable); ?>` pour chaque affichage.

**Comment Twig résout ces problèmes** :

| Problème | Solution apportée par Twig |
| -------- | -------------------------- |
| Mélange PHP/HTML | Syntaxe dédiée claire : `{{ variable }}` |
| Risques de sécurité | Échappement automatique de toutes les variables |
| Duplication de code | Héritage de templates (un layout réutilisable) |
| Syntaxe verbeuse | Syntaxe concise et lisible |

**Analogie concrète** : Imagine un formulaire administratif pré-rempli. Le formulaire (template) contient des cases vides avec des étiquettes (placeholders). Tu remplis les cases avec tes informations (données). Le résultat final est un document complet (page HTML). Twig est comme ce système de formulaire : il a une structure fixe avec des emplacements pour les données variables.

**Ce que Twig n'est PAS** :

- Twig n'est pas du PHP. C'est un langage de template avec sa propre syntaxe. Tu ne peux pas écrire du PHP directement dans un fichier Twig.
- Twig n'est pas un framework. C'est uniquement un moteur de templates, utilisé par Symfony pour la partie "Vue" du MVC.

---

### Les trois types de balises Twig

Twig utilise trois types de balises, chacune avec un rôle précis.

#### 1. Affichage : `{{ }}`

Les doubles accolades affichent le contenu d'une variable ou le résultat d'une expression.

```twig
{# Affiche la valeur de la variable "username" #}
<p>Bonjour {{ username }}</p>

{# Affiche le résultat d'un calcul #}
<p>Total : {{ price * quantity }} €</p>
```

**Règle** : Tout ce qui est entre `{{ }}` sera affiché dans la page HTML.

#### 2. Logique : `{% %}`

Les accolades avec pourcentage exécutent des instructions (conditions, boucles, définitions).

```twig
{# Condition : affiche un message différent selon la valeur #}
{% if age >= 18 %}
    <p>Tu es majeur.</p>
{% else %}
    <p>Tu es mineur.</p>
{% endif %}

{# Boucle : répète un bloc pour chaque élément #}
{% for product in products %}
    <p>{{ product.name }}</p>
{% endfor %}
```

**Règle** : Les balises `{% %}` ne produisent pas de sortie directe. Elles contrôlent ce qui sera affiché.

#### 3. Commentaires : `{# #}`

Les accolades avec dièse créent des commentaires invisibles dans le HTML final.

```twig
{# Ce commentaire n'apparaît pas dans le code source de la page #}
<p>Contenu visible</p>

{# TODO: Ajouter le prix ici #}
```

**Règle** : Les commentaires Twig `{# #}` sont différents des commentaires HTML `<!-- -->`. Les commentaires Twig n'apparaissent jamais dans le HTML envoyé au navigateur.

**Tableau récapitulatif** :

| Balise | Rôle | Exemple |
| ------ | ---- | ------- |
| `{{ }}` | Afficher une valeur | `{{ username }}` |
| `{% %}` | Exécuter une instruction | `{% if condition %}` |
| `{# #}` | Commenter (invisible) | `{# Note pour plus tard #}` |

---

### L'héritage de templates

**Définition** : L'héritage de templates permet de créer un template parent (layout) contenant la structure commune, et des templates enfants qui remplissent les zones variables.

**Le problème que l'héritage résout** :

Sans héritage de templates :

1. **Duplication** : Copier le `<head>`, le menu et le footer dans chaque page.
2. **Maintenance difficile** : Modifier le menu oblige à changer 50 fichiers.
3. **Incohérence** : Risque d'oublier une modification dans certains fichiers.

**Comment l'héritage résout ces problèmes** :

Le template parent définit la structure avec des "blocs" vides. Chaque template enfant remplit uniquement ses blocs.

**Structure de l'héritage** :

Le diagramme suivant montre comment le template parent définit les blocs, et comment chaque template enfant remplit ses propres blocs :

<div class="diagram-design">
<p><a href="../../diagrams/03-symfony-03-templates-twig-1.html">L&#x27;héritage de templates (HTML + SVG)</a></p>
<iframe src="../../diagrams/03-symfony-03-templates-twig-1.html" title="L&#x27;héritage de templates" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Sous forme textuelle :

```text
base.html.twig (parent)
    ├── Contient : <html>, <head>, menu, footer
    ├── Définit : {% block title %}, {% block body %}
    │
    ├── home.html.twig (enfant)
    │       └── Remplit : block title, block body
    │
    ├── about.html.twig (enfant)
    │       └── Remplit : block title, block body
    │
    └── contact.html.twig (enfant)
            └── Remplit : block title, block body
```

**Analogie concrète** : Imagine un classeur avec des intercalaires. Le classeur (template parent) a une couverture, une reliure et des séparateurs identiques pour tous les documents. Chaque document (template enfant) remplit les pages entre les intercalaires avec son propre contenu. Si tu changes la couverture du classeur, tous les documents bénéficient du changement.

---

### Les filtres Twig

**Définition** : Un filtre transforme une valeur avant de l'afficher. On applique un filtre avec le caractère pipe `|`.

**Syntaxe** : `{{ variable|filtre }}`

**Filtres courants** :

| Filtre | Action | Exemple | Résultat |
| ------ | ------ | ------- | -------- |
| `upper` | Majuscules | `{{ 'bonjour'\|upper }}` | BONJOUR |
| `lower` | Minuscules | `{{ 'BONJOUR'\|lower }}` | bonjour |
| `capitalize` | Première lettre majuscule | `{{ 'bonjour'\|capitalize }}` | Bonjour |
| `length` | Nombre d'éléments | `{{ products\|length }}` | 5 |
| `date` | Formater une date | `{{ createdAt\|date('d/m/Y') }}` | 15/01/2026 |
| `default` | Valeur par défaut si vide | `{{ name\|default('Anonyme') }}` | Anonyme |
| `trim` | Supprimer les espaces | `{{ '  texte  '\|trim }}` | texte |
| `raw` | Ne pas échapper (dangereux) | `{{ html\|raw }}` | HTML brut |

**Enchaîner les filtres** :

Tu peux appliquer plusieurs filtres à la suite :

```twig
{# Applique upper puis slice (extrait les 3 premiers caractères) #}
{{ 'bonjour'|upper|slice(0, 3) }}
{# Résultat : BON #}
```

**Règle** : Les filtres s'appliquent de gauche à droite.

---

### Les variables dans Twig

**Comment les variables arrivent dans Twig** :

Les variables sont passées par le contrôleur via la méthode `render()` :

```php
// Dans le contrôleur
return $this->render('page.html.twig', [
    'username' => 'Omar',           // Variable simple
    'age' => 23,                   // Nombre
    'products' => $productsList,   // Tableau
    'user' => $userObject,         // Objet
]);
```

**Accéder aux données** :

| Type de donnée | Syntaxe PHP | Syntaxe Twig |
| -------------- | ----------- | ------------ |
| Variable simple | `$username` | `{{ username }}` |
| Tableau indexé | `$products[0]` | `{{ products[0] }}` |
| Tableau associatif | `$user['name']` | `{{ user.name }}` ou `{{ user['name'] }}` |
| Propriété d'objet | `$user->getName()` | `{{ user.name }}` |

**Règle importante** : En Twig, on utilise le point `.` pour accéder aux propriétés, que ce soit un tableau associatif ou un objet. Twig appelle automatiquement le getter si nécessaire.

```twig
{# Ces deux écritures sont équivalentes pour un objet User #}
{{ user.name }}
{{ user.getName() }}

{# À NE PAS faire sur un objet : la notation crochets ne marche
   que sur un tableau associatif. Sur un objet, elle renvoie vide. #}
{{ user['name'] }}  {# rend une valeur vide ici #}
```

---

## Étapes Pratiques

### Étape 1 : Comprendre la structure des templates

Les templates Twig se trouvent dans le dossier `templates/` à la racine du projet.

**Structure typique** :

```text
templates/
├── base.html.twig          # Layout principal (parent)
├── home/
│   └── index.html.twig     # Page d'accueil
├── product/
│   ├── list.html.twig      # Liste des produits
│   └── show.html.twig      # Détail d'un produit
└── user/
    └── profile.html.twig   # Profil utilisateur
```

**Convention de nommage** :

- Dossier = nom du contrôleur (sans "Controller")
- Fichier = nom de l'action (sans "Action")
- Extension = `.html.twig`

Exemple : `ProductController::list()` → `templates/product/list.html.twig`

---

### Étape 2 : Examiner le template de base

Ouvre le fichier `templates/base.html.twig` dans ton projet :

```bash
# Depuis la racine du projet
cat templates/base.html.twig
```

**Contenu typique d'un base.html.twig** :

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

**Explication de chaque bloc** :

| Bloc | Rôle | Contenu par défaut |
| ---- | ---- | ------------------ |
| `title` | Titre de la page (onglet navigateur) | "Mon Site" |
| `stylesheets` | Fichiers CSS supplémentaires | Vide |
| `body` | Contenu principal de la page | Vide |
| `javascripts` | Fichiers JavaScript supplémentaires | Vide |

---

### Étape 3 : Créer un template enfant

Crée un nouveau fichier `templates/demo/hello.html.twig` :

**Étape 3a** : Crée le dossier s'il n'existe pas :

```bash
mkdir -p templates/demo
```

**Étape 3b** : Crée le fichier avec ce contenu :

```twig
{# templates/demo/hello.html.twig #}

{# On hérite du template base.html.twig #}
{% extends 'base.html.twig' %}

{# On remplit le bloc "title" #}
{% block title %}Page de démonstration{% endblock %}

{# On remplit le bloc "body" #}
{% block body %}
    <h1>Bonjour {{ name }} !</h1>
    <p>Tu as {{ age }} ans.</p>
{% endblock %}
```

**Explication ligne par ligne** :

1. `{% extends 'base.html.twig' %}` : Ce template hérite de base.html.twig
2. `{% block title %}...{% endblock %}` : Remplace le titre par défaut
3. `{% block body %}...{% endblock %}` : Remplace le contenu vide par notre HTML
4. `{{ name }}` et `{{ age }}` : Affiche les variables passées par le contrôleur

---

### Étape 4 : Créer le contrôleur correspondant

Crée le fichier `src/Controller/DemoController.php` :

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
    #[Route('/hello/{name}', name: 'demo_hello')]
    public function hello(string $name = 'visiteur'): Response
    {
        // On passe les variables au template
        return $this->render('demo/hello.html.twig', [
            'name' => $name,  // La variable "name" sera accessible dans Twig
            'age' => 23,      // La variable "age" sera accessible dans Twig
        ]);
    }
}
```

**Test** : Accède à `http://localhost:8080/demo/hello/Omar` dans ton navigateur.

**Résultat attendu** :

```text
Page avec le titre "Page de démonstration"
Contenu :
    Bonjour Omar !
    Tu as 23 ans.
```

---

### Étape 5 : Utiliser les conditions

Modifie le template pour ajouter une condition :

```twig
{# templates/demo/hello.html.twig #}

{% extends 'base.html.twig' %}

{% block title %}Page de démonstration{% endblock %}

{% block body %}
    <h1>Bonjour {{ name }} !</h1>

    {# Condition : message différent selon l'âge #}
    {% if age >= 18 %}
        <p>Tu es majeur(e) ({{ age }} ans).</p>
    {% else %}
        <p>Tu es mineur(e) ({{ age }} ans).</p>
    {% endif %}

    {# Condition avec plusieurs cas #}
    {% if age < 12 %}
        <p>Catégorie : Enfant</p>
    {% elseif age < 18 %}
        <p>Catégorie : Adolescent</p>
    {% elseif age < 65 %}
        <p>Catégorie : Adulte</p>
    {% else %}
        <p>Catégorie : Senior</p>
    {% endif %}
{% endblock %}
```

**Syntaxe des conditions** :

| Structure | Syntaxe Twig |
| --------- | ------------ |
| Si | `{% if condition %}...{% endif %}` |
| Si / Sinon | `{% if condition %}...{% else %}...{% endif %}` |
| Si / Sinon si / Sinon | `{% if %}...{% elseif %}...{% else %}...{% endif %}` |

---

### Étape 6 : Utiliser les boucles

Modifie le contrôleur pour passer un tableau :

```php
#[Route('/products', name: 'demo_products')]
public function products(): Response
{
    // Tableau de produits (données factices)
    $products = [
        ['name' => 'Clavier', 'price' => 49.99],
        ['name' => 'Souris', 'price' => 29.99],
        ['name' => 'Écran', 'price' => 199.99],
    ];

    return $this->render('demo/products.html.twig', [
        'products' => $products,
    ]);
}
```

Crée le template `templates/demo/products.html.twig` :

```twig
{# templates/demo/products.html.twig #}

{% extends 'base.html.twig' %}

{% block title %}Liste des produits{% endblock %}

{% block body %}
    <h1>Nos produits</h1>

    {# Vérifier si la liste n'est pas vide #}
    {% if products is empty %}
        <p>Aucun produit disponible.</p>
    {% else %}
        <p>{{ products|length }} produit(s) disponible(s) :</p>

        <ul>
            {# Boucle sur chaque produit #}
            {% for product in products %}
                <li>
                    {{ product.name }} - {{ product.price }} €
                </li>
            {% endfor %}
        </ul>
    {% endif %}
{% endblock %}
```

**Test** : Accède à `http://localhost:8080/demo/products`.

**Résultat attendu** :

```text
Nos produits

3 produit(s) disponible(s) :

• Clavier - 49.99 €
• Souris - 29.99 €
• Écran - 199.99 €
```

---

### Étape 7 : Variables spéciales dans les boucles

Twig fournit une variable spéciale `loop` dans les boucles `for` :

```twig
{% for product in products %}
    <p>
        Produit n°{{ loop.index }} : {{ product.name }}
        {% if loop.first %} (Premier !) {% endif %}
        {% if loop.last %} (Dernier !) {% endif %}
    </p>
{% endfor %}
```

**Propriétés de `loop`** :

| Propriété | Description | Exemple (3 éléments) |
| --------- | ----------- | -------------------- |
| `loop.index` | Position actuelle (commence à 1) | 1, 2, 3 |
| `loop.index0` | Position actuelle (commence à 0) | 0, 1, 2 |
| `loop.first` | `true` si premier élément | true, false, false |
| `loop.last` | `true` si dernier élément | false, false, true |
| `loop.length` | Nombre total d'éléments | 3, 3, 3 |

---

### Étape 8 : Inclure un template partiel

Les "partials" sont des petits templates réutilisables.

Crée le fichier `templates/partials/_product_card.html.twig` :

```twig
{# templates/partials/_product_card.html.twig #}
{# Le underscore _ indique que c'est un partial (convention) #}

<div class="product-card">
    <h3>{{ product.name }}</h3>
    <p class="price">{{ product.price }} €</p>
</div>
```

Utilise-le dans ton template principal :

```twig
{# templates/demo/products.html.twig #}

{% extends 'base.html.twig' %}

{% block body %}
    <h1>Nos produits</h1>

    {% for product in products %}
        {# Inclure le partial en lui passant la variable "product" #}
        {{ include('partials/_product_card.html.twig', { 'product': product }) }}
    {% endfor %}
{% endblock %}
```

**Avantage** : Si tu modifies `_product_card.html.twig`, toutes les pages qui l'utilisent sont mises à jour.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console debug:twig` | Liste toutes les fonctions et filtres Twig disponibles |
| `php bin/console cache:clear` | Vide le cache (utile si les changements ne s'affichent pas) |
| `php bin/console lint:twig templates/` | Vérifie la syntaxe des templates Twig |

---

## Pièges Fréquents

### Piège 1 : Oublier `{% extends %}`

**Problème** : La page s'affiche sans le layout (pas de `<html>`, pas de CSS).

**Cause** : Tu as oublié la ligne `{% extends 'base.html.twig' %}` au début du template.

**Solution** : Ajoute toujours `{% extends %}` comme première instruction (hors commentaires).

```twig
{# ✅ Correct #}
{% extends 'base.html.twig' %}

{% block body %}
    <p>Contenu</p>
{% endblock %}
```

---

### Piège 2 : Contenu hors des blocs

**Problème** : Du contenu n'apparaît pas dans la page.

**Cause** : Tu as écrit du HTML en dehors d'un bloc `{% block %}`.

```twig
{# ❌ Incorrect : ce paragraphe n'apparaîtra pas #}
{% extends 'base.html.twig' %}

<p>Ce texte est ignoré car il est hors d'un bloc</p>

{% block body %}
    <p>Seul ce texte apparaît</p>
{% endblock %}
```

**Solution** : Tout le contenu doit être dans un bloc défini par le parent.

---

### Piège 3 : Confondre `{{ }}` et `{% %}`

**Problème** : La condition ou la boucle s'affiche comme du texte.

**Cause** : Tu as utilisé `{{ }}` au lieu de `{% %}`.

```twig
{# ❌ Incorrect : affiche "if age >= 18" comme texte #}
{{ if age >= 18 }}

{# ✅ Correct : exécute la condition #}
{% if age >= 18 %}
```

**Règle** : `{{ }}` = afficher, `{% %}` = exécuter.

---

### Piège 4 : Variable non définie

**Problème** : Erreur "Variable 'xxx' does not exist".

**Cause** : Le contrôleur n'a pas passé cette variable au template.

**Solutions** :

1. Vérifier le tableau passé à `render()` dans le contrôleur
2. Utiliser le filtre `default` pour une valeur par défaut :

```twig
{# Si "username" n'existe pas, affiche "Invité" #}
{{ username|default('Invité') }}
```

---

### Piège 5 : Le cache Twig

**Problème** : Les modifications du template ne s'affichent pas.

**Cause** : Symfony met les templates en cache pour de meilleures performances.

**Solution** : Vider le cache :

```bash
php bin/console cache:clear
```

**Note** : En mode développement (`APP_ENV=dev`), Twig recompile automatiquement un template dès que tu le modifies (option `auto_reload`). Tu n'as donc normalement pas besoin de vider le cache en dev. Si tes modifications ne s'affichent toujours pas, vérifie que ton fichier `.env` contient bien `APP_ENV=dev`.

---

## Checklist de Validation

- [ ] Je comprends les trois types de balises : `{{ }}`, `{% %}`, `{# #}`
- [ ] Je sais créer un template qui hérite de `base.html.twig`
- [ ] Je sais afficher une variable passée par le contrôleur
- [ ] Je sais écrire une condition `{% if %}`
- [ ] Je sais écrire une boucle `{% for %}`
- [ ] Je sais utiliser un filtre avec `|`
- [ ] Je sais inclure un template partiel

---

## Exercice Pratique

**Énoncé** : Crée une page qui affiche une liste de livres avec leurs auteurs.

**Spécifications** :

1. Crée un contrôleur `BookController` avec une méthode `list()`
2. La route doit être `/books`
3. Le contrôleur passe un tableau de livres au template
4. Chaque livre a : `title`, `author`, `year`, `available` (booléen)
5. Le template affiche :
   - Le titre de chaque livre en gras
   - L'auteur et l'année
   - "Disponible" en vert ou "Indisponible" en rouge selon `available`
   - Le nombre total de livres

**Données de test** :

```php
$books = [
    ['title' => 'Le Petit Prince', 'author' => 'Saint-Exupéry', 'year' => 1943, 'available' => true],
    ['title' => '1984', 'author' => 'George Orwell', 'year' => 1949, 'available' => false],
    ['title' => 'Dune', 'author' => 'Frank Herbert', 'year' => 1965, 'available' => true],
];
```

**Résultat attendu** :

```text
Notre bibliothèque (3 livres)

• Le Petit Prince
  Par Saint-Exupéry (1943)
  Disponible

• 1984
  Par George Orwell (1949)
  Indisponible

• Dune
  Par Frank Herbert (1965)
  Disponible
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier `src/Controller/BookController.php`** :

```php
<?php
// src/Controller/BookController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/books')]
class BookController extends AbstractController
{
    #[Route('/', name: 'book_list')]
    public function list(): Response
    {
        // Données de test (plus tard, ces données viendront de la base)
        $books = [
            ['title' => 'Le Petit Prince', 'author' => 'Saint-Exupéry', 'year' => 1943, 'available' => true],
            ['title' => '1984', 'author' => 'George Orwell', 'year' => 1949, 'available' => false],
            ['title' => 'Dune', 'author' => 'Frank Herbert', 'year' => 1965, 'available' => true],
        ];

        return $this->render('book/list.html.twig', [
            'books' => $books,
        ]);
    }
}
```

**Fichier `templates/book/list.html.twig`** :

```twig
{# templates/book/list.html.twig #}

{% extends 'base.html.twig' %}

{% block title %}Notre bibliothèque{% endblock %}

{% block body %}
    <h1>Notre bibliothèque ({{ books|length }} livres)</h1>

    {% if books is empty %}
        <p>Aucun livre dans la bibliothèque.</p>
    {% else %}
        <ul>
            {% for book in books %}
                <li>
                    {# Titre en gras #}
                    <strong>{{ book.title }}</strong>
                    <br>

                    {# Auteur et année #}
                    Par {{ book.author }} ({{ book.year }})
                    <br>

                    {# Disponibilité avec couleur #}
                    {% if book.available %}
                        <span style="color: green;">Disponible</span>
                    {% else %}
                        <span style="color: red;">Indisponible</span>
                    {% endif %}
                </li>
            {% endfor %}
        </ul>
    {% endif %}
{% endblock %}
```

**Crée le dossier si nécessaire** :

```bash
mkdir -p templates/book
```

**Test** : Accède à `http://localhost:8080/books`.

---

## Navigation

← Fiche précédente : **[Les contrôleurs et les routes](02-controleurs-routes.md)**

→ Fiche suivante : **[Introduction à Doctrine](04-introduction-doctrine.md)**
