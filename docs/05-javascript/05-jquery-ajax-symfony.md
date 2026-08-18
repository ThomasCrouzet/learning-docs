---
tags:
  - JavaScript
  - Symfony
  - Intermédiaire
  - Pratique
description: "jQuery et AJAX dans Symfony"
estimated_time: "50 min"
fiche_number: 5
total_fiches: 7
cursus: "JavaScript"
---

# 05 - jQuery et AJAX dans Symfony

> **En bref** : À la fin de cette fiche, tu sauras envoyer des requêtes AJAX depuis jQuery vers des contrôleurs Symfony, gérer les réponses JSON et mettre à jour la page sans rechargement. Lecture estimée : 50 min.


## Prérequis

- Avoir lu la fiche **[04 - Introduction à jQuery](04-introduction-jquery.md)** (sélecteurs, événements, manipulation DOM)
- Avoir lu la fiche **[02 - Les contrôleurs et les routes](../03-symfony/02-controleurs-routes.md)** (créer un contrôleur, définir une route, retourner une réponse)
- Savoir utiliser la console du navigateur (onglet Network / Réseau)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras envoyer des requêtes AJAX depuis jQuery vers des contrôleurs Symfony, gérer les réponses JSON et mettre à jour la page sans rechargement.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'AJAX ?

**Définition** : AJAX (Asynchronous JavaScript And XML) est une technique qui permet d'envoyer une requête HTTP au serveur et de recevoir une réponse **sans recharger la page entière**.

**Le problème qu'AJAX résout** :

| Sans AJAX | Avec AJAX |
| --------- | --------- |
| Chaque action recharge toute la page | Seule la donnée nécessaire est échangée |
| Écran blanc pendant le rechargement | La page reste affichée, une partie est mise à jour |
| Scroll et champs perdus à chaque rechargement | L'état de la page est conservé |

**Analogie concrète** : Au restaurant, sans AJAX, à chaque fois que tu veux du pain, le serveur débarrasse toute la table et rapporte tout le repas avec le pain en plus. Avec AJAX, le serveur va chercher uniquement le pain sans toucher au reste.

**Ce qu'AJAX n'est PAS** : AJAX n'est pas un langage de programmation, c'est une **technique**. Et malgré le "X" de XML, le format d'échange standard est aujourd'hui **JSON**.

Le schéma suivant illustre le cycle complet d'une requête AJAX entre le navigateur et un contrôleur Symfony :

<div class="diagram-design">
<p><a href="../../diagrams/05-javascript-05-jquery-ajax-symfony-1.html">Qu&#x27;est-ce qu&#x27;AJAX ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/05-javascript-05-jquery-ajax-symfony-1.html" title="Qu&#x27;est-ce qu&#x27;AJAX ?" style="width:100%;min-height:480px;border:0;background:transparent"></iframe>
</div>

---

### JSON : le format d'échange

**Définition** : JSON (JavaScript Object Notation) est un format texte pour représenter des données structurées, standard pour les échanges navigateur/serveur.

```json
{"id": 42, "nom": "Clavier sans fil", "prix": 29.99, "enStock": true}
```

**Pourquoi JSON et pas HTML ?** Le serveur envoie uniquement les données brutes. JavaScript construit le HTML côté client. Cela sépare les données de l'affichage et permet de réutiliser la même API (application mobile, etc.).

---

### La méthode `$.ajax()` de jQuery

**Définition** : `$.ajax()` est la méthode principale de jQuery pour envoyer des requêtes HTTP asynchrones.

```javascript
$.ajax({
    url: '/api/products',        // L'URL du contrôleur Symfony
    method: 'GET',               // La méthode HTTP (GET, POST, PUT, DELETE)
    data: { search: 'clavier' }, // Les données envoyées au serveur
    success: function(response) {
        console.log(response);   // Appelé si la requête réussit
    },
    error: function(xhr, status, error) {
        console.error(error);    // Appelé si la requête échoue
    }
});
```

**Options principales** :

| Option | Type | Description |
| ------ | ---- | ----------- |
| `url` | string | L'adresse du endpoint (route Symfony) |
| `method` | string | `GET`, `POST`, `PUT`, `DELETE` |
| `data` | object | Les données à envoyer au serveur |
| `dataType` | string | Le format attendu en retour (`json`, `html`, `text`) |
| `success` | function | Fonction appelée quand la requête réussit (code 200) |
| `error` | function | Fonction appelée quand la requête échoue |
| `complete` | function | Fonction appelée dans tous les cas (succès ou erreur) |
| `headers` | object | En-têtes HTTP supplémentaires (ex : token CSRF) |

---

### Les raccourcis : `$.get()` et `$.post()`

jQuery fournit des raccourcis pour les requêtes les plus courantes :

```javascript
// Requête GET
$.get('/api/products', { category: 'info' }, function(response) {
    console.log(response);
});

// Requête POST
$.post('/api/cart/add', { productId: 42 }, function(response) {
    console.log(response);
});
```

| Méthode | Quand l'utiliser |
| ------- | ---------------- |
| `$.ajax()` | Quand tu as besoin de toutes les options (headers, error, complete) |
| `$.get()` | Pour une requête GET simple |
| `$.post()` | Pour une requête POST simple |

---

### `JsonResponse` dans Symfony

**Définition** : `JsonResponse` est une classe Symfony qui convertit automatiquement un tableau PHP en JSON et définit le header `Content-Type: application/json`.

---

## Étapes Pratiques

### Étape 1 : Créer un contrôleur Symfony qui retourne du JSON

Crée `src/Controller/ApiProductController.php` :

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ApiProductController extends AbstractController
{
    #[Route('/api/products', name: 'api_product_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        // Données en dur pour l'exemple
        $products = [
            ['id' => 1, 'nom' => 'Clavier sans fil', 'prix' => 29.99],
            ['id' => 2, 'nom' => 'Souris ergonomique', 'prix' => 45.00],
            ['id' => 3, 'nom' => 'Écran 27 pouces', 'prix' => 299.99],
        ];

        return new JsonResponse($products);
    }
}
```

**Résultat attendu** : en accédant à `http://localhost:8080/api/products`, tu obtiens un tableau JSON avec les trois produits.

---

### Étape 2 : Appeler le contrôleur depuis jQuery

Dans ton fichier JavaScript (ex : `assets/app.js`) :

```javascript
$(document).ready(function() {
    $('#btn-load-products').on('click', function() {
        $.ajax({
            url: '/api/products',
            method: 'GET',
            dataType: 'json',
            success: function(products) {
                $('#product-list').empty();
                $.each(products, function(index, product) {
                    // Échappe le texte pour éviter l'injection HTML/XSS si le serveur
                    // renvoie des données non fiables (ne jamais concaténer du HTML brut).
                    const $item = $('<li></li>').text(
                        product.nom + ' - ' + product.prix + ' €'
                    );
                    $('#product-list').append($item);
                });
            },
            error: function(xhr, status, error) {
                alert('Erreur lors du chargement.');
            }
        });
    });
});
```

Le template Twig correspondant :

```twig
{# templates/product/index.html.twig #}
{% extends 'base.html.twig' %}

{% block body %}
    <h1>Catalogue</h1>
    <button id="btn-load-products" type="button">Charger les produits</button>
    <ul id="product-list"></ul>
{% endblock %}
```

---

### Étape 3 : Envoyer des données avec POST

```php
// Dans src/Controller/ApiCartController.php

#[Route('/api/cart/add', name: 'api_cart_add', methods: ['POST'])]
public function add(Request $request): JsonResponse
{
    $productId = $request->request->get('productId');
    $quantity = $request->request->get('quantity', 1);

    if (!$productId) {
        return new JsonResponse(
            ['error' => 'Le paramètre productId est requis.'],
            JsonResponse::HTTP_BAD_REQUEST  // Code 400
        );
    }

    return new JsonResponse([
        'success' => true,
        'message' => 'Produit ' . $productId . ' ajouté (x' . $quantity . ').',
    ]);
}
```

L'appel jQuery :

```javascript
$('.btn-add-to-cart').on('click', function() {
    var productId = $(this).data('id');

    $.post('/api/cart/add', { productId: productId, quantity: 1 }, function(response) {
        if (response.success) { alert(response.message); }
    });
});
```

---

### Étape 4 : Gérer le token CSRF dans les requêtes AJAX

Symfony protège contre les attaques CSRF. Pour les requêtes POST en AJAX, tu dois inclure ce token.

**Passer le token via un attribut `data-*`** :

```twig
<button class="btn-delete" data-id="42"
    data-csrf-token="{{ csrf_token('delete-product') }}">
    Supprimer
</button>
```

```javascript
$('.btn-delete').on('click', function() {
    var productId = $(this).data('id');
    var csrfToken = $(this).data('csrf-token');

    $.ajax({
        url: '/api/product/' + productId + '/delete',
        method: 'POST',
        data: { _token: csrfToken },
        success: function(response) {
            if (response.success) {
                $('#product-row-' + productId).fadeOut(300, function() {
                    $(this).remove();
                });
            }
        }
    });
});
```

Le contrôleur qui vérifie le token :

```php
#[Route('/api/product/{id}/delete', name: 'api_product_delete', methods: ['POST'])]
public function delete(int $id, Request $request): JsonResponse
{
    $token = $request->request->get('_token');

    if (!$this->isCsrfTokenValid('delete-product', $token)) {
        return new JsonResponse(
            ['error' => 'Token CSRF invalide.'],
            JsonResponse::HTTP_FORBIDDEN  // Code 403
        );
    }

    // Supprimer le produit en base de données ici...

    return new JsonResponse(['success' => true, 'message' => 'Produit supprimé.']);
}
```

**Alternative : token global via `<meta>`** :

```twig
{# Dans base.html.twig, dans le <head> #}
<meta name="csrf-token" content="{{ csrf_token('ajax') }}">
```

```javascript
// Configurer jQuery pour envoyer le token dans toutes les requêtes
// Attention : Symfony ne lit PAS automatiquement l'en-tête X-CSRF-Token.
// Dans le contrôleur, il faut lire le header explicitement :
// $token = $request->headers->get('X-CSRF-Token');
// puis $this->isCsrfTokenValid('ajax', $token);
// Sans cette lecture côté serveur, le token dans le header est ignoré.
$.ajaxSetup({
    headers: { 'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content') }
});
```

**Règle** : pour un premier projet, préfère la méthode `data-csrf-token` + champ `_token` (ci-dessus). Elle fonctionne avec `$request->request->get('_token')` sans configuration supplémentaire.

---

### Étape 5 : Indicateur de chargement et callback `complete`

Pendant une requête AJAX, l'utilisateur ne voit rien se passer. Il faut afficher un spinner.

```javascript
$('#btn-search').on('click', function() {
    var $spinner = $('#spinner');
    var $button = $(this);

    $spinner.show();
    $button.prop('disabled', true);

    $.ajax({
        url: '/api/products/search',
        method: 'GET',
        data: { q: $('#search-input').val() },
        success: function(response) {
            var $results = $('#results').empty();
            $.each(response.products, function(i, p) {
                $results.append($('<p></p>').text(p.nom));
            });
        },
        error: function() {
            $('#results').html('<p>Erreur lors de la recherche.</p>');
        },
        complete: function() {
            // Appelé dans TOUS les cas (succès ET erreur)
            $spinner.hide();
            $button.prop('disabled', false);
        }
    });
});
```

**Point important** : le callback `complete` est l'endroit idéal pour cacher le spinner et réactiver le bouton, car il est exécuté que la requête réussisse ou échoue.

---

### Étape 6 : Recherche en temps réel (live search avec debounce)

Le code jQuery avec debounce (le contrôleur Symfony filtre les produits via `$request->query->get('q')` et retourne un `JsonResponse`) :

```javascript
var searchTimer = null;

$('#search-input').on('keyup', function() {
    var query = $(this).val();
    clearTimeout(searchTimer);  // Annuler le timer précédent

    if (query.length === 0) {
        $('#results').empty();
        return;
    }

    // Attendre 300ms après la dernière frappe avant d'envoyer la requête
    searchTimer = setTimeout(function() {
        $.get('/api/products/search', { q: query }, function(response) {
            var $results = $('#results').empty();
            if (response.products.length === 0) {
                $results.html('<p>Aucun résultat.</p>');
                return;
            }
            $.each(response.products, function(i, p) {
                $results.append($('<p></p>').text(p.nom));
            });
        });
    }, 300);
});
```

**Pourquoi le debounce ?** Sans debounce, taper "clavier" envoie 7 requêtes (une par lettre). Avec un debounce de 300ms, une seule requête est envoyée après la dernière frappe.

---

### Étape 7 : Gérer les erreurs HTTP

```javascript
$.ajax({
    url: '/api/products',
    method: 'GET',
    success: function(response) {
        console.log('Données reçues :', response);
    },
    error: function(xhr) {
        // xhr.status contient le code HTTP
        if (xhr.status === 0) {
            alert('Serveur injoignable. Vérifie ta connexion.');
        } else if (xhr.responseJSON && xhr.responseJSON.error) {
            alert('Erreur : ' + xhr.responseJSON.error);
        } else {
            alert('Erreur inattendue (code ' + xhr.status + ').');
        }
    }
});
```

**Codes HTTP à connaître** :

| Code | Signification | Cause fréquente |
| ---- | ------------- | --------------- |
| 200 | OK | Requête réussie |
| 400 | Bad Request | Données manquantes ou invalides |
| 403 | Forbidden | Token CSRF invalide |
| 404 | Not Found | URL incorrecte ou route mal définie |
| 405 | Method Not Allowed | GET au lieu de POST (ou inversement) |
| 500 | Internal Server Error | Bug PHP dans le contrôleur |

---

### Étape 8 : L'API `fetch()` comme alternative moderne

`fetch()` est l'API native du navigateur. Elle ne nécessite pas jQuery.

| Critère | `$.ajax()` | `fetch()` |
| ------- | ---------- | --------- |
| Nécessite jQuery | Oui | Non (natif) |
| Syntaxe | Callbacks | Promises (`.then()`, `.catch()`) |
| Gestion erreurs HTTP | Automatique via `error` | Manuelle (vérifier `response.ok`) |

```javascript
fetch('/api/products')
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Erreur HTTP : ' + response.status);
        }
        return response.json();
    })
    .then(function(products) {
        console.log(products);
    })
    .catch(function(error) {
        console.error('Erreur :', error.message);
    });
```

**Quand utiliser quoi ?** Si tu utilises déjà jQuery dans ton projet, reste sur `$.ajax()`. Si tu démarres un projet sans jQuery, utilise `fetch()`.

---

## Commandes Utiles

| Commande / Code | Action |
| ---------------- | ------ |
| `$.ajax({ url, method, success, error })` | Requête AJAX complète |
| `$.get(url, data, callback)` | Raccourci GET |
| `$.post(url, data, callback)` | Raccourci POST |
| `new JsonResponse($data)` | Réponse JSON dans Symfony |
| `new JsonResponse($data, 400)` | Réponse JSON avec code HTTP personnalisé |
| `$request->request->get('key')` | Paramètre POST dans Symfony |
| `$request->query->get('key')` | Paramètre GET dans Symfony |
| `$this->isCsrfTokenValid('id', $token)` | Vérifier un token CSRF |
| `{{ csrf_token('id') }}` | Générer un token CSRF en Twig |

---

## Pièges Fréquents

### Piège 1 : La route retourne du HTML au lieu de JSON

**Problème** : Tu reçois du HTML (page d'erreur Symfony ou page de login) au lieu de JSON.

**Solution** : Vérifie que ton contrôleur retourne un `JsonResponse` et non un `$this->render(...)`. Teste l'URL directement dans le navigateur.

---

### Piège 2 : Erreur 405 Method Not Allowed

**Problème** : La méthode HTTP dans `$.ajax()` ne correspond pas à celle de la route Symfony.

**Solution** : Si la route déclare `methods: ['POST']`, utilise `$.post()` ou `method: 'POST'`.

---

### Piège 3 : Les données POST sont vides dans le contrôleur

**Problème** : `$request->request->get('key')` retourne `null`.

**Solution** : Si tu envoies du JSON brut (`contentType: 'application/json'`), Symfony ne remplit pas `$request->request`. Il faut décoder manuellement :

```php
$data = json_decode($request->getContent(), true);
$productId = $data['productId'];
```

**Règle** : ne définis pas `contentType: 'application/json'` sauf besoin spécifique. Le format par défaut de jQuery fonctionne directement avec `$request->request->get()`.

---

### Piège 4 : Token CSRF invalide

**Problème** : Erreur 403.

**Solution** : Vérifie que l'identifiant est identique dans Twig (`csrf_token('delete-product')`) et dans le contrôleur (`isCsrfTokenValid('delete-product', $token)`). Vérifie aussi dans l'onglet Network que le token est bien envoyé.

---

### Piège 5 : Le spinner reste affiché après une erreur

**Problème** : Le spinner ou le bouton désactivé ne revient pas à la normale si la requête échoue.

**Solution** : Utilise `complete` (pas `success`) pour rétablir l'interface, car `complete` est appelé dans tous les cas.

---

## Checklist de Validation

- [ ] Je sais créer un contrôleur Symfony qui retourne un `JsonResponse`
- [ ] Je sais envoyer une requête GET avec `$.ajax()` ou `$.get()`
- [ ] Je sais envoyer une requête POST avec `$.ajax()` ou `$.post()`
- [ ] Je sais récupérer les données POST avec `$request->request->get()`
- [ ] Je sais inclure un token CSRF dans une requête AJAX
- [ ] Je sais afficher un spinner et le cacher dans `complete`
- [ ] Je sais gérer les erreurs HTTP dans le callback `error`
- [ ] Je comprends la différence entre `$.ajax()` et `fetch()`

---

## Exercice Pratique

**Énoncé** : Crée une page "Gestion des tâches" qui permet d'ajouter et de supprimer des tâches sans recharger la page.

**Fonctionnalités demandées** :

1. Un champ texte et un bouton "Ajouter" pour créer une tâche (requête POST).
2. Chaque tâche a un bouton "Supprimer" (requête POST avec token CSRF).
3. Un spinner s'affiche pendant chaque requête.
4. Les erreurs sont affichées à l'utilisateur.

**Indications** :

- Crée un contrôleur `ApiTaskController` avec trois actions : `list` (GET), `add` (POST), `delete` (POST).
- Utilise un tableau en session pour stocker les tâches (pas besoin de base de données).
- Génère le token CSRF dans le template Twig.
- Utilise `complete` pour gérer le spinner.

**Résultat attendu** : Tu peux ajouter "Faire les courses", voir la tâche apparaître, puis la supprimer, le tout sans rechargement.

---

## Solution de l'Exercice

> **Note** : Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Le contrôleur** `src/Controller/ApiTaskController.php` :

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ApiTaskController extends AbstractController
{
    #[Route('/api/tasks', name: 'api_task_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $tasks = $request->getSession()->get('tasks', []);
        return new JsonResponse(['tasks' => $tasks]);
    }

    #[Route('/api/tasks/add', name: 'api_task_add', methods: ['POST'])]
    public function add(Request $request): JsonResponse
    {
        $title = $request->request->get('title');

        if (!$title || trim($title) === '') {
            return new JsonResponse(
                ['error' => 'Le titre est requis.'],
                JsonResponse::HTTP_BAD_REQUEST
            );
        }

        $session = $request->getSession();
        $tasks = $session->get('tasks', []);
        $task = ['id' => uniqid(), 'title' => trim($title)];
        $tasks[] = $task;
        $session->set('tasks', $tasks);

        return new JsonResponse(['success' => true, 'task' => $task]);
    }

    #[Route('/api/tasks/{id}/delete', name: 'api_task_delete', methods: ['POST'])]
    public function delete(string $id, Request $request): JsonResponse
    {
        $token = $request->request->get('_token');
        if (!$this->isCsrfTokenValid('delete-task', $token)) {
            return new JsonResponse(
                ['error' => 'Token CSRF invalide.'],
                JsonResponse::HTTP_FORBIDDEN
            );
        }

        $session = $request->getSession();
        $tasks = $session->get('tasks', []);
        $tasks = array_values(array_filter($tasks, fn($t) => $t['id'] !== $id));
        $session->set('tasks', $tasks);

        return new JsonResponse(['success' => true]);
    }
}
```

**Le template** `templates/task/index.html.twig` :

```twig
{% extends 'base.html.twig' %}

{% block body %}
    <h1>Gestion des tâches</h1>

    <input type="text" id="task-title" placeholder="Nouvelle tâche...">
    <button id="btn-add-task" type="button">Ajouter</button>
    <span id="spinner" style="display: none;">Chargement...</span>
    <div id="error-message" style="color: red; display: none;"></div>
    <ul id="task-list"></ul>
    <meta name="csrf-delete" content="{{ csrf_token('delete-task') }}">
{% endblock %}

{% block javascripts %}
    {{ parent() }}
    <script>
    $(document).ready(function() {
        var csrf = $('meta[name="csrf-delete"]').attr('content');

        // Charger les tâches existantes
        $.get('/api/tasks', function(r) {
            $.each(r.tasks, function(i, task) { appendTask(task); });
        });

        function appendTask(task) {
            // Construire le DOM sans concaténer de HTML brut (évite XSS)
            const $li = $('<li></li>').attr('id', 'task-' + task.id);
            $li.append(document.createTextNode(task.title + ' '));
            const $btn = $('<button type="button" class="btn-del"></button>')
                .text('Supprimer')
                .attr('data-id', task.id);
            $li.append($btn);
            $('#task-list').append($li);
        }

        // Ajouter une tâche
        $('#btn-add-task').on('click', function() {
            $('#error-message').hide();
            $('#spinner').show();

            $.ajax({
                url: '/api/tasks/add',
                method: 'POST',
                data: { title: $('#task-title').val() },
                success: function(r) {
                    appendTask(r.task);
                    $('#task-title').val('');
                },
                error: function(xhr) {
                    var msg = xhr.responseJSON ? xhr.responseJSON.error : 'Erreur.';
                    $('#error-message').text(msg).show();
                },
                complete: function() { $('#spinner').hide(); }
            });
        });

        // Supprimer (délégation pour les boutons ajoutés dynamiquement)
        $('#task-list').on('click', '.btn-del', function() {
            var id = $(this).data('id');
            $('#spinner').show();

            $.ajax({
                url: '/api/tasks/' + id + '/delete',
                method: 'POST',
                data: { _token: csrf },
                success: function() {
                    $('#task-' + id).fadeOut(300, function() { $(this).remove(); });
                },
                error: function(xhr) {
                    var msg = xhr.responseJSON ? xhr.responseJSON.error : 'Erreur.';
                    $('#error-message').text(msg).show();
                },
                complete: function() { $('#spinner').hide(); }
            });
        });
    });
    </script>
{% endblock %}
```

---

## Navigation

← Fiche précédente : **[04 - Introduction à jQuery](04-introduction-jquery.md)**

→ Fiche suivante : **[06 - Stimulus et Symfony UX](06-stimulus-symfony.md)**
