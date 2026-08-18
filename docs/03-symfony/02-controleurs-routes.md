---
tags:
  - Symfony
  - Débutant
  - Pratique
description: "Les contrôleurs et les routes"
estimated_time: "80 min"
fiche_number: 2
total_fiches: 21
cursus: "Symfony"
---

# 02 - Les contrôleurs et les routes

> **En bref** : À la fin de cette fiche, tu sauras créer un contrôleur, définir des routes avec l'attribut #[Route], et retourner différents types de réponses. Lecture estimée : 80 min.


## Prérequis

- Fiche [03-symfony/01 - Comprendre l'architecture Symfony](01-architecture-symfony.md)
- Fiche [02-php/10 - Les attributs PHP](../02-php/10-attributs-php.md)
- Savoir utiliser les attributs PHP et les namespaces

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un contrôleur, définir des routes avec l'attribut `#[Route]`, et retourner différents types de réponses.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un contrôleur ?

**Définition** : Un contrôleur est une classe PHP qui contient des méthodes (appelées "actions") qui gèrent les requêtes HTTP. Chaque action reçoit une requête et retourne une réponse.

**Le problème que les contrôleurs résolvent** :

Sans contrôleurs, voici les problèmes rencontrés :

1. **Code monolithique** : Tout le code est dans un seul fichier.

2. **Pas de séparation** : La logique métier, l'affichage et le traitement des requêtes sont mélangés.

3. **Difficile à tester** : Impossible de tester une partie isolément.

4. **Pas réutilisable** : Le code n'est pas organisé de manière modulaire.

**Comment les contrôleurs résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Code monolithique | Chaque contrôleur gère un domaine (Product, User...) |
| Pas de séparation | Le contrôleur ne fait que coordonner |
| Difficile à tester | Chaque action peut être testée individuellement |
| Pas réutilisable | Les services sont partagés entre contrôleurs |

**Analogie concrète** : Un contrôleur est comme le réceptionniste d'un hôtel. Il reçoit les demandes des clients (requêtes), consulte les différents services de l'hôtel (services, repositories), et donne une réponse au client. Il ne fait pas le ménage lui-même, il coordonne.

Le diagramme suivant résume le flux d'une requête HTTP dans Symfony, de la route jusqu'à la réponse :

<div class="diagram-design">
<p><a href="../../diagrams/03-symfony-02-controleurs-routes-1.html">Qu&#x27;est-ce qu&#x27;un contrôleur ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/03-symfony-02-controleurs-routes-1.html" title="Qu&#x27;est-ce qu&#x27;un contrôleur ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Structure d'un contrôleur

**Emplacement** : `src/Controller/`

**Convention de nommage** : `NomController.php` (ex: `ProductController.php`)

**Structure de base** :

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ProductController extends AbstractController
{
    #[Route('/products', name: 'product_list')]
    public function list(): Response
    {
        return $this->render('product/list.html.twig');
    }
}
```

**Les parties importantes** :

| Partie | Rôle |
| ------ | ---- |
| `namespace App\Controller` | Localisation dans `src/Controller/` |
| `extends AbstractController` | Hérite des méthodes utiles de Symfony |
| `#[Route(...)]` | Définit l'URL qui appelle cette méthode |
| `public function list()` | L'action qui s'exécute |
| `return Response` | Doit toujours retourner une Response |

---

### Qu'est-ce qu'une route ?

**Définition** : Une route est l'association entre une URL et une action de contrôleur. Elle définit quelle méthode doit s'exécuter quand l'utilisateur accède à une URL.

**Composants d'une route** :

| Composant | Description | Exemple |
| --------- | ----------- | ------- |
| Path | Le chemin de l'URL | `/products` |
| Name | Identifiant unique | `product_list` |
| Methods | Méthodes HTTP autorisées | `['GET']`, `['POST']` |
| Controller | La méthode à appeler | `ProductController::list` |

---

### L'attribut #[Route]

**Syntaxe de base** :

```php
#[Route('/chemin', name: 'nom_de_la_route')]
```

**Paramètres courants** :

| Paramètre | Type | Description | Exemple |
| --------- | ---- | ----------- | ------- |
| Premier argument | string | Chemin de l'URL | `'/products'` |
| `name` | string | Nom unique de la route | `'product_list'` |
| `methods` | array | Méthodes HTTP | `['GET', 'POST']` |
| `requirements` | array | Contraintes sur les paramètres | `['id' => '\d+']` |

**Exemples** :

```php
<?php

// Route simple
#[Route('/')]
public function home(): Response

// Route avec nom
#[Route('/products', name: 'product_list')]
public function list(): Response

// Route avec méthodes HTTP
#[Route('/products', name: 'product_list', methods: ['GET'])]
public function list(): Response

// Route avec paramètre
#[Route('/products/{id}', name: 'product_show')]
public function show(int $id): Response

// Route avec contrainte sur le paramètre
#[Route('/products/{id}', name: 'product_show', requirements: ['id' => '\d+'])]
public function show(int $id): Response
```

---

### Les paramètres de route

**Définition** : Un paramètre de route est une partie variable de l'URL, définie entre accolades `{param}`.

**Syntaxe** :

```php
#[Route('/products/{id}')]
public function show(int $id): Response
{
    // $id contient la valeur de l'URL
    // /products/42 → $id = 42
}
```

**Règles** :

1. Le nom du paramètre dans l'URL doit correspondre au nom du paramètre de la méthode
2. Symfony convertit automatiquement le type si possible

**Exemples** :

```php
<?php

// Paramètre obligatoire
#[Route('/products/{id}')]
public function show(int $id): Response
// /products/42 → OK
// /products    → Erreur 404

// Paramètre optionnel (avec valeur par défaut)
#[Route('/products/{page}')]
public function list(int $page = 1): Response
// /products/3 → $page = 3
// /products   → $page = 1

// Plusieurs paramètres
#[Route('/category/{category}/product/{id}')]
public function showInCategory(string $category, int $id): Response
// /category/electronics/product/42
```

---

### Les méthodes HTTP

**Les méthodes courantes** :

| Méthode | Utilisation | Exemple |
| ------- | ----------- | ------- |
| `GET` | Récupérer des données | Afficher une page |
| `POST` | Envoyer des données | Soumettre un formulaire |
| `PUT` | Remplacer une ressource | Modifier complètement |
| `PATCH` | Modifier partiellement | Modifier un champ |
| `DELETE` | Supprimer | Supprimer une ressource |

**Restreindre les méthodes** :

```php
<?php

// Seulement GET
#[Route('/products', methods: ['GET'])]
public function list(): Response

// GET et POST (formulaire)
#[Route('/products/new', methods: ['GET', 'POST'])]
public function new(): Response

// Seulement DELETE
#[Route('/products/{id}', methods: ['DELETE'])]
public function delete(int $id): Response
```

---

### AbstractController et ses méthodes

En héritant de `AbstractController`, tu as accès à des méthodes utiles :

| Méthode | Description | Retourne |
| ------- | ----------- | -------- |
| `render()` | Affiche un template Twig | `Response` |
| `redirectToRoute()` | Redirige vers une route | `RedirectResponse` |
| `json()` | Retourne du JSON | `JsonResponse` |
| `createNotFoundException()` | Crée une erreur 404 | `NotFoundHttpException` |
| `getUser()` | Récupère l'utilisateur connecté | `?UserInterface` |
| `addFlash()` | Ajoute un message flash | `void` |

**Exemples** :

```php
<?php

// Afficher un template
return $this->render('product/show.html.twig', [
    'product' => $product,
]);

// Rediriger vers une autre route
return $this->redirectToRoute('product_list');

// Rediriger avec paramètres
return $this->redirectToRoute('product_show', ['id' => 42]);

// Retourner du JSON
return $this->json(['success' => true, 'id' => 42]);

// Lever une erreur 404
throw $this->createNotFoundException('Product not found');
```

---

### Route sur la classe (préfixe)

Tu peux définir un préfixe commun pour toutes les routes d'un contrôleur :

```php
<?php

#[Route('/products')]  // Préfixe
class ProductController extends AbstractController
{
    #[Route('/', name: 'product_list')]  // URL finale : /products/
    public function list(): Response

    #[Route('/{id}', name: 'product_show')]  // URL finale : /products/{id}
    public function show(int $id): Response

    #[Route('/new', name: 'product_new')]  // URL finale : /products/new
    public function new(): Response
}
```

---

### L'objet Request

**Définition** : L'objet `Request` contient toutes les informations sur la requête HTTP (paramètres, headers, méthode...).

**Import** :

```php
use Symfony\Component\HttpFoundation\Request;
```

**Injection dans une action** :

```php
#[Route('/search')]
public function search(Request $request): Response
{
    // Symfony injecte automatiquement la requête
}
```

**Méthodes utiles de Request** :

| Méthode | Description | Exemple |
| ------- | ----------- | ------- |
| `$request->query->get('param')` | Paramètre GET (?param=value) | `$request->query->get('page')` |
| `$request->request->get('param')` | Paramètre POST | `$request->request->get('name')` |
| `$request->getMethod()` | Méthode HTTP | `'GET'`, `'POST'` |
| `$request->isMethod('POST')` | Vérifie la méthode | `true` ou `false` |
| `$request->headers->get('header')` | Header HTTP | `$request->headers->get('Accept')` |

**Exemple complet** :

```php
<?php

#[Route('/search', name: 'search', methods: ['GET'])]
public function search(Request $request): Response
{
    $query = $request->query->get('q', '');  // ?q=... avec défaut vide
    $page = $request->query->getInt('page', 1);  // Convertit en int

    // Recherche avec $query...

    return $this->render('search/results.html.twig', [
        'query' => $query,
        'page' => $page,
    ]);
}
```

---

### L'objet Response

**Définition** : L'objet `Response` représente la réponse HTTP envoyée au navigateur.

**Import** :

```php
use Symfony\Component\HttpFoundation\Response;
```

**Créer une Response manuellement** :

```php
<?php

// Response simple
return new Response('Hello World');

// Response avec code HTTP
return new Response('Not Found', 404);

// Response avec headers
return new Response(
    'Hello',
    200,
    ['Content-Type' => 'text/plain']
);
```

**Types de Response** :

| Classe | Usage |
| ------ | ----- |
| `Response` | Réponse générique |
| `JsonResponse` | Réponse JSON |
| `RedirectResponse` | Redirection |
| `BinaryFileResponse` | Téléchargement de fichier |

---

## Étapes Pratiques

### Étape 1 : Créer un contrôleur avec MakerBundle

```bash
# Dans Docker
docker compose exec php php bin/console make:controller TestController
```

**Résultat** : Symfony crée deux fichiers :

- `src/Controller/TestController.php`
- `templates/test/index.html.twig`

---

### Étape 2 : Examiner le contrôleur généré

Ouvre `src/Controller/TestController.php` :

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class TestController extends AbstractController
{
    #[Route('/test', name: 'app_test')]
    public function index(): Response
    {
        return $this->render('test/index.html.twig', [
            'controller_name' => 'TestController',
        ]);
    }
}
```

**Test** : Accède à `http://localhost:8080/test` dans ton navigateur.

---

### Étape 3 : Ajouter une action avec paramètre

Modifie `src/Controller/TestController.php` pour ajouter :

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/test')]
class TestController extends AbstractController
{
    #[Route('/', name: 'test_index')]
    public function index(): Response
    {
        return $this->render('test/index.html.twig', [
            'controller_name' => 'TestController',
        ]);
    }

    #[Route('/hello/{name}', name: 'test_hello')]
    public function hello(string $name): Response
    {
        return new Response('<html><body>Hello ' . htmlspecialchars($name) . '!</body></html>');
    }

    #[Route('/greet/{name}', name: 'test_greet')]
    public function greet(string $name = 'World'): Response
    {
        return $this->render('test/greet.html.twig', [
            'name' => $name,
        ]);
    }
}
```

---

### Étape 4 : Créer le template greet

Crée le fichier `templates/test/greet.html.twig` :

```twig
{% extends 'base.html.twig' %}

{% block title %}Greeting{% endblock %}

{% block body %}
    <h1>Hello {{ name }}!</h1>
    <p>Welcome to Symfony.</p>
{% endblock %}
```

**Test** :

- `http://localhost:8080/test/hello/Nadia` → "Hello Nadia!"
- `http://localhost:8080/test/greet/John` → Page avec "Hello John!"
- `http://localhost:8080/test/greet` → Page avec "Hello World!" (défaut)

---

### Étape 5 : Utiliser Request pour les paramètres GET

Ajoute cette action à `TestController` :

```php
<?php

use Symfony\Component\HttpFoundation\Request;

// ... dans la classe TestController

#[Route('/search', name: 'test_search', methods: ['GET'])]
public function search(Request $request): Response
{
    $query = $request->query->get('q', '');
    $page = $request->query->getInt('page', 1);

    return $this->render('test/search.html.twig', [
        'query' => $query,
        'page' => $page,
    ]);
}
```

Crée `templates/test/search.html.twig` :

```twig
{% extends 'base.html.twig' %}

{% block title %}Search{% endblock %}

{% block body %}
    <h1>Search Results</h1>

    {% if query %}
        <p>You searched for: <strong>{{ query }}</strong></p>
        <p>Page: {{ page }}</p>
    {% else %}
        <p>No search query provided.</p>
        <p>Try: <a href="{{ path('test_search', {q: 'symfony', page: 1}) }}">/test/search?q=symfony&page=1</a></p>
    {% endif %}
{% endblock %}
```

**Test** : `http://localhost:8080/test/search?q=symfony&page=2`

---

### Étape 6 : Retourner du JSON

Ajoute cette action :

```php
<?php

#[Route('/api/data', name: 'test_api')]
public function apiData(): Response
{
    $data = [
        'status' => 'success',
        'message' => 'Hello from API',
        'timestamp' => time(),
        'items' => [
            ['id' => 1, 'name' => 'Item 1'],
            ['id' => 2, 'name' => 'Item 2'],
        ],
    ];

    return $this->json($data);
}
```

**Test** : `http://localhost:8080/test/api/data`

**Résultat** : JSON formaté.

---

### Étape 7 : Redirection

Ajoute ces actions :

```php
<?php

#[Route('/old-page', name: 'test_old')]
public function oldPage(): Response
{
    // Redirige vers la nouvelle page
    return $this->redirectToRoute('test_index');
}

#[Route('/go-to-hello/{name}', name: 'test_go_hello')]
public function goToHello(string $name): Response
{
    // Redirige avec un paramètre
    return $this->redirectToRoute('test_hello', ['name' => $name]);
}
```

**Test** :

- `http://localhost:8080/test/old-page` → Redirige vers `/test/`
- `http://localhost:8080/test/go-to-hello/Nadia` → Redirige vers `/test/hello/Nadia`

---

### Étape 8 : Erreur 404

Ajoute cette action :

```php
<?php

#[Route('/product/{id}', name: 'test_product', requirements: ['id' => '\d+'])]
public function showProduct(int $id): Response
{
    // Simuler une recherche en base de données
    $products = [
        1 => 'Laptop',
        2 => 'Phone',
        3 => 'Tablet',
    ];

    if (!isset($products[$id])) {
        throw $this->createNotFoundException('Product #' . $id . ' not found');
    }

    return new Response('<html><body>Product: ' . $products[$id] . '</body></html>');
}
```

**Test** :

- `http://localhost:8080/test/product/1` → "Product: Laptop"
- `http://localhost:8080/test/product/99` → Page d'erreur 404

---

### Étape 9 : Vérifier les routes créées

```bash
docker compose exec php php bin/console debug:router
```

**Résultat** :

```text
 test_index        ANY        /test/
 test_hello        ANY        /test/hello/{name}
 test_greet        ANY        /test/greet/{name}
 test_search       GET        /test/search
 test_api          ANY        /test/api/data
 test_old          ANY        /test/old-page
 test_go_hello     ANY        /test/go-to-hello/{name}
 test_product      ANY        /test/product/{id}
```

---

## Commandes Utiles

| Commande | Description |
| -------- | ----------- |
| `php bin/console make:controller NomController` | Crée un contrôleur |
| `php bin/console debug:router` | Liste les routes |
| `php bin/console debug:router nom_route` | Détails d'une route |
| `php bin/console router:match /chemin` | Quelle route correspond à une URL |

---

## Pièges Fréquents

### Piège 1 : Oublier le type de retour Response

**Problème** : L'action ne retourne rien ou retourne un type incorrect.

**Solution** : Toujours retourner un objet `Response`.

```php
<?php

// Incorrect (ne retourne rien)
public function index(): Response
{
    $this->render('page.html.twig');  // Oubli du return !
}

// Correct
public function index(): Response
{
    return $this->render('page.html.twig');
}
```

---

### Piège 2 : Nom de route en double

**Problème** : Erreur "Route name already exists".

**Solution** : Chaque route doit avoir un nom unique.

```php
<?php

// Incorrect (même nom)
#[Route('/products', name: 'list')]
public function listProducts(): Response

#[Route('/categories', name: 'list')]  // Conflit !
public function listCategories(): Response

// Correct (noms uniques)
#[Route('/products', name: 'product_list')]
public function listProducts(): Response

#[Route('/categories', name: 'category_list')]
public function listCategories(): Response
```

---

### Piège 3 : Ordre des routes avec paramètres

**Problème** : Une route avec paramètre capture des URLs qui ne lui sont pas destinées.

**Solution** : Place les routes spécifiques avant les routes avec paramètres.

```php
<?php

// Incorrect (l'ordre pose problème)
#[Route('/{id}', name: 'product_show')]  // Capture tout !
public function show(int $id): Response

#[Route('/new', name: 'product_new')]  // Jamais atteint
public function new(): Response

// Correct (routes spécifiques en premier)
#[Route('/new', name: 'product_new')]
public function new(): Response

#[Route('/{id}', name: 'product_show')]
public function show(int $id): Response
```

---

### Piège 4 : Oublier l'import de Request

**Problème** : Erreur "Class Request not found".

**Solution** : Importe la classe Request.

```php
<?php

// Oubli de l'import
// use Symfony\Component\HttpFoundation\Request;

public function search(Request $request): Response  // Erreur !

// Correct
use Symfony\Component\HttpFoundation\Request;

public function search(Request $request): Response  // OK
```

---

### Piège 5 : Paramètre de route non typé

**Problème** : Le paramètre n'est pas converti au bon type.

**Solution** : Type le paramètre de la méthode.

```php
<?php

// Sans typage (string par défaut)
#[Route('/product/{id}')]
public function show($id): Response
{
    // $id est une string "42"
}

// Avec typage
#[Route('/product/{id}')]
public function show(int $id): Response
{
    // $id est un int 42
}
```

---

## Checklist de Validation

- [ ] Je sais créer un contrôleur avec `make:controller`
- [ ] Je comprends la structure d'un contrôleur (namespace, extends, actions)
- [ ] Je sais définir une route avec `#[Route]`
- [ ] Je sais ajouter des paramètres à une route `{param}`
- [ ] Je sais restreindre les méthodes HTTP (GET, POST...)
- [ ] Je sais utiliser l'objet Request pour les paramètres GET/POST
- [ ] Je sais retourner différents types de Response (HTML, JSON, redirect)
- [ ] Je sais lever une erreur 404
- [ ] Je sais lister les routes avec `debug:router`

---

## Exercice Pratique

**Énoncé** : Crée un contrôleur `BookController` pour gérer des livres.

**Indications** :

- Utilise `make:controller BookController`
- Ajoute un préfixe `/books` sur la classe
- Crée les actions suivantes :
  - `list()` : Affiche "Liste des livres" (GET /books/)
  - `show(int $id)` : Affiche "Livre #ID" (GET /books/{id})
  - `search(Request $request)` : Recherche par titre (GET /books/search?title=...)
  - `api()` : Retourne une liste JSON de 3 livres (GET /books/api)
- Vérifie les routes avec `debug:router`

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier `src/Controller/BookController.php`** :

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/books')]
class BookController extends AbstractController
{
    #[Route('/', name: 'book_list', methods: ['GET'])]
    public function list(): Response
    {
        return $this->render('book/list.html.twig');
    }

    #[Route('/search', name: 'book_search', methods: ['GET'])]
    public function search(Request $request): Response
    {
        $title = $request->query->get('title', '');

        return $this->render('book/search.html.twig', [
            'title' => $title,
        ]);
    }

    #[Route('/api', name: 'book_api', methods: ['GET'])]
    public function api(): Response
    {
        $books = [
            ['id' => 1, 'title' => 'Le Petit Prince', 'author' => 'Saint-Exupéry'],
            ['id' => 2, 'title' => '1984', 'author' => 'George Orwell'],
            ['id' => 3, 'title' => 'Harry Potter', 'author' => 'J.K. Rowling'],
        ];

        return $this->json($books);
    }

    #[Route('/{id}', name: 'book_show', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function show(int $id): Response
    {
        return $this->render('book/show.html.twig', [
            'id' => $id,
        ]);
    }
}
```

**Fichier `templates/book/list.html.twig`** :

```twig
{% extends 'base.html.twig' %}

{% block title %}Liste des livres{% endblock %}

{% block body %}
    <h1>Liste des livres</h1>
    <ul>
        <li><a href="{{ path('book_show', {id: 1}) }}">Livre #1</a></li>
        <li><a href="{{ path('book_show', {id: 2}) }}">Livre #2</a></li>
        <li><a href="{{ path('book_show', {id: 3}) }}">Livre #3</a></li>
    </ul>
    <p><a href="{{ path('book_search', {title: 'Harry'}) }}">Rechercher "Harry"</a></p>
    <p><a href="{{ path('book_api') }}">API JSON</a></p>
{% endblock %}
```

**Fichier `templates/book/show.html.twig`** :

```twig
{% extends 'base.html.twig' %}

{% block title %}Livre #{{ id }}{% endblock %}

{% block body %}
    <h1>Livre #{{ id }}</h1>
    <p><a href="{{ path('book_list') }}">Retour à la liste</a></p>
{% endblock %}
```

**Fichier `templates/book/search.html.twig`** :

```twig
{% extends 'base.html.twig' %}

{% block title %}Recherche{% endblock %}

{% block body %}
    <h1>Recherche de livres</h1>
    {% if title %}
        <p>Résultats pour : <strong>{{ title }}</strong></p>
    {% else %}
        <p>Aucun terme de recherche.</p>
    {% endif %}
    <p><a href="{{ path('book_list') }}">Retour à la liste</a></p>
{% endblock %}
```

**Vérification** :

```bash
docker compose exec php php bin/console debug:router | grep book
```

```text
 book_list      GET    /books/
 book_search    GET    /books/search
 book_api       GET    /books/api
 book_show      GET    /books/{id}
```

---

## Navigation

← Fiche précédente : **[Comprendre l'architecture Symfony](01-architecture-symfony.md)**

→ Fiche suivante : **[Templates Twig](03-templates-twig.md)**
