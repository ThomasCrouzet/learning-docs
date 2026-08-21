---
tags:
  - Symfony
  - Avancé
  - Pratique
description: "Créer des endpoints API JSON dans Symfony"
estimated_time: "85 min"
fiche_number: 16
total_fiches: 21
cursus: "Symfony"
id: "web.symfony.api-json"
course_id: "web.symfony"
content_type: "lesson"
order: 16
---

# 16 - API JSON

> **En bref** : Créer des endpoints JSON dans Symfony 7.4, sérialiser/désérialiser, valider les entrées, et consommer l'API en JavaScript (jQuery/AJAX dans cette fiche ; `fetch` est vu dans le cursus JavaScript). Lecture estimée : 85 min.


## Prérequis

- Avoir lu la fiche **[02 - Contrôleurs et routes](02-controleurs-routes.md)**
- Avoir lu la fiche **[08 - Repository et CRUD](08-repository-crud.md)**
- _(Optionnel)_ Connaître les bases de JavaScript et jQuery (fiche **[05 - jQuery et AJAX](../05-javascript/05-jquery-ajax-symfony.md)**) - uniquement nécessaire pour la section « Consommer l'API depuis JavaScript »

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des endpoints JSON dans Symfony 7.4, sérialiser et désérialiser des objets PHP, valider les données d'entrée, et consommer l'API depuis JavaScript avec jQuery/AJAX.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une API ?

**Définition** : Une API (Application Programming Interface) est une interface qui permet à deux programmes de communiquer. Dans le contexte web, une API reçoit des requêtes HTTP et retourne des données (en JSON dans la majorité des cas) au lieu de pages HTML.

**Le problème que les API résolvent** :

Sans API, voici les problèmes rencontrés :

1. **Interface web uniquement** : L'application ne peut être utilisée que depuis un navigateur. Impossible de l'utiliser depuis une application mobile ou un script.
2. **Rechargement complet de la page** : Chaque action recharge la page entière, ce qui est lent.
3. **Couplage entre données et affichage** : Le contrôleur génère du HTML, mélangeant logique de données et présentation.

**Comment les API résolvent ces problèmes** :

| Problème | Solution apportée par les API |
| -------- | ----------------------------- |
| Interface web uniquement | L'API retourne des données consommables par n'importe quel client |
| Rechargement complet | JavaScript appelle l'API en arrière-plan (AJAX) |
| Couplage données/affichage | L'API retourne les données, le client gère l'affichage |

**Analogie concrète** : Une API est comme un serveur de restaurant. Tu (le client) passes ta commande au serveur (la requête). Le serveur transmet à la cuisine (le back-end). La cuisine prépare le plat (le traitement). Le serveur te ramène le résultat (la réponse). Tu ne rentres jamais dans la cuisine.

**Ce qu'une API n'est PAS** :

- Une API n'est pas un site web. Un site retourne du HTML pour un navigateur. Une API retourne des données brutes (JSON) pour un programme.
- Une API n'est pas une base de données. L'API est la couche intermédiaire qui contrôle quelles données sont accessibles.

**Comparaison API JSON vs contrôleur classique** :

| API JSON | Contrôleur classique |
| -------- | -------------------- |
| Retourne du JSON | Retourne du HTML (Twig) |
| Consommé par JS, mobile, scripts | Consommé par un navigateur |
| `JsonResponse` | `$this->render()` |

---

### Le format JSON

**Définition** : JSON (JavaScript Object Notation) est un format de données texte, léger et lisible. C'est le format standard pour les API web.

**Structure de base** :

```json
{
    "id": 1,
    "title": "Mon article",
    "published": true,
    "tags": ["php", "symfony"],
    "author": {
        "id": 42,
        "name": "John"
    }
}
```

**Types de données JSON** :

| Type | Exemple | Équivalent PHP |
| ---- | ------- | -------------- |
| Chaîne | `"Mon texte"` | `string` |
| Nombre entier | `42` | `int` |
| Nombre décimal | `3.14` | `float` |
| Booléen | `true` / `false` | `bool` |
| Null | `null` | `null` |
| Tableau | `["a", "b"]` | `array` |
| Objet | `{"key": "value"}` | `array` ou `object` |

**Conversion PHP vers JSON** :

```php
$data = ['id' => 1, 'title' => 'Mon article'];
$json = json_encode($data);         // {"id":1,"title":"Mon article"}
$data = json_decode($json, true);   // ['id' => 1, 'title' => 'Mon article']
```

---

### JsonResponse dans Symfony

**Définition** : `JsonResponse` crée une réponse HTTP avec le header `Content-Type: application/json` et encode automatiquement les données.

```php
// Méthode 1 : JsonResponse directement
use Symfony\Component\HttpFoundation\JsonResponse;
return new JsonResponse(['id' => 1, 'title' => 'Mon article']);

// Méthode 2 : Méthode json() du contrôleur (recommandé)
return $this->json(['id' => 1, 'title' => 'Mon article']);
```

---

### Sérialisation

**Définition** : La sérialisation transforme un objet PHP en JSON. Le Serializer de Symfony gère cette conversion automatiquement grâce aux groupes de sérialisation.

```php
// ❌ Sans Serializer : construction manuelle
$data = [];
foreach ($articles as $article) {
    $data[] = [
        'id' => $article->getId(),
        'title' => $article->getTitle(),
    ];
}
return $this->json($data);

// ✅ Avec Serializer : conversion automatique
return $this->json($articles, 200, [], ['groups' => ['api:read']]);
```

**Les groupes de sérialisation** contrôlent quels champs sont inclus dans la réponse :

```php
use Symfony\Component\Serializer\Attribute\Groups;

class Article
{
    #[Groups(['api:read'])]
    private ?int $id = null;

    #[Groups(['api:read', 'api:write'])]
    private string $title;

    #[Groups(['api:read'])]
    private string $slug;

    // Pas de groupe → jamais exposé dans l'API
    private string $internalNote;
}
```

| Groupe | Quand l'utiliser | Champs inclus |
| ------ | ---------------- | ------------- |
| `api:read` | Lecture (GET) | id, title, slug |
| `api:write` | Écriture (POST, PUT) | title |

---

### Désérialisation

**Définition** : La désérialisation transforme du JSON en objet PHP. Le client envoie du JSON, Symfony le convertit en entité.

```php
// Approche 1 : Manuelle
$data = json_decode($request->getContent(), true);
$article = new Article();
$article->setTitle($data['title']);

// Approche 2 : Avec le Serializer (recommandé)
$article = $serializer->deserialize(
    $request->getContent(),
    Article::class,
    'json',
    ['groups' => ['api:write']]
);
```

---

### Les codes HTTP

**Définition** : Les codes HTTP indiquent au client le résultat de sa requête.

| Code | Nom | Quand l'utiliser |
| ---- | --- | ---------------- |
| `200` | OK | Requête réussie (GET, PUT) |
| `201` | Created | Nouvelle ressource créée (POST) |
| `204` | No Content | Succès sans contenu (DELETE) |
| `400` | Bad Request | Requête mal formée (JSON invalide) |
| `404` | Not Found | Ressource inexistante |
| `422` | Unprocessable Entity | Données invalides (validation) |
| `500` | Internal Server Error | Bug côté serveur |

```php
return $this->json($article, 201, [], ['groups' => ['api:read']]);  // Création
return $this->json(['errors' => $errors], 422);                     // Validation
return new JsonResponse(null, 204);                                 // Suppression
```

---

### Validation des données d'entrée

**Définition** : La validation vérifie que les données envoyées par le client respectent les règles métier avant enregistrement en base.

```text
1. Le client envoie du JSON (ex : {"title": ""})
2. Tu désérialises le JSON en objet Article
3. Tu valides l'objet avec ValidatorInterface
4. Si erreurs → code 422 avec la liste des erreurs
5. Si valide → enregistre en base, code 201
```

Les contraintes se définissent sur l'entité (voir fiche 11) :

```php
use Symfony\Component\Validator\Constraints as Assert;

class Article
{
    #[Assert\NotBlank(message: 'Le titre ne peut pas être vide.')]
    #[Assert\Length(max: 255)]
    private string $title;
}
```

---

## Étapes Pratiques

### Étape 1 : Créer un endpoint GET /api/articles

**Objectif** : Retourner la liste de tous les articles en JSON.

```php
<?php
// src/Controller/ApiArticleController.php

namespace App\Controller;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_')]
class ApiArticleController extends AbstractController
{
    #[Route('/articles', name: 'article_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $articles = $em->getRepository(Article::class)->findAll();

        // Construction manuelle du tableau (sans Serializer)
        $data = [];
        foreach ($articles as $article) {
            $data[] = [
                'id' => $article->getId(),
                'title' => $article->getTitle(),
                'slug' => $article->getSlug(),
                'content' => $article->getContent(),
                'status' => $article->getStatus(),
            ];
        }

        return $this->json($data);
    }
}
```

```bash
curl -X GET http://localhost:8080/api/articles
```

**Résultat attendu** :

```json
[
    {
        "id": 1,
        "title": "Premier article",
        "slug": "premier-article",
        "content": "Contenu du premier article.",
        "status": "published"
    }
]
```

---

### Étape 2 : Utiliser le Serializer avec les groupes

**Objectif** : Remplacer la construction manuelle par le Serializer et les groupes `#[Groups]`.

Ajouter les groupes sur l'entité :

```php
<?php
// src/Entity/Article.php

namespace App\Entity;

use App\Repository\ArticleRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
class Article
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['api:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['api:read', 'api:write'])]
    #[Assert\NotBlank(message: 'Le titre ne peut pas être vide.')]
    #[Assert\Length(max: 255)]
    private string $title;

    #[ORM\Column(length: 255)]
    #[Groups(['api:read'])]
    private string $slug;

    #[ORM\Column(type: 'text')]
    #[Groups(['api:read', 'api:write'])]
    #[Assert\NotBlank(message: 'Le contenu ne peut pas être vide.')]
    private string $content;

    #[ORM\Column(length: 50)]
    #[Groups(['api:read', 'api:write'])]
    private string $status = 'draft';

    // Getters et setters...
}
```

Modifier le contrôleur :

```php
#[Route('/articles', name: 'article_index', methods: ['GET'])]
public function index(EntityManagerInterface $em): JsonResponse
{
    $articles = $em->getRepository(Article::class)->findAll();

    // Le Serializer sélectionne les champs marqués api:read
    return $this->json($articles, 200, [], [
        'groups' => ['api:read'],
    ]);
}
```

---

### Étape 3 : Créer un endpoint GET /api/articles/{id}

**Objectif** : Retourner un article unique par son identifiant.

```php
#[Route('/articles/{id}', name: 'article_show', methods: ['GET'])]
public function show(int $id, EntityManagerInterface $em): JsonResponse
{
    $article = $em->getRepository(Article::class)->find($id);

    if ($article === null) {
        return $this->json(['error' => 'Article non trouvé.'], 404);
    }

    return $this->json($article, 200, [], ['groups' => ['api:read']]);
}
```

```bash
curl -X GET http://localhost:8080/api/articles/1
curl -X GET http://localhost:8080/api/articles/999
```

**Résultat attendu (article existant)** :

```json
{
    "id": 1,
    "title": "Premier article",
    "slug": "premier-article",
    "content": "Contenu du premier article.",
    "status": "published"
}
```

**Résultat attendu (article inexistant, code 404)** :

```json
{
    "error": "Article non trouvé."
}
```

---

### Étape 4 : Créer un endpoint POST /api/articles

**Objectif** : Recevoir du JSON, valider, créer un article et retourner l'article créé.

```php
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/articles', name: 'article_create', methods: ['POST'])]
public function create(
    Request $request,
    EntityManagerInterface $em,
    SerializerInterface $serializer,
    ValidatorInterface $validator,
): JsonResponse {
    $json = $request->getContent();

    if (empty($json)) {
        return $this->json(['error' => 'Le corps de la requête est vide.'], 400);
    }

    // Désérialiser le JSON en objet Article
    try {
        $article = $serializer->deserialize(
            $json, Article::class, 'json',
            ['groups' => ['api:write']]
        );
    } catch (\Exception $e) {
        return $this->json(['error' => 'JSON invalide.'], 400);
    }

    // Valider l'objet
    $errors = $validator->validate($article);

    if (count($errors) > 0) {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = [
                'field' => $error->getPropertyPath(),
                'message' => $error->getMessage(),
            ];
        }

        return $this->json(['errors' => $errorMessages], 422);
    }

    // Générer le slug
    $slug = strtolower($article->getTitle());
    $slug = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $slug);
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
    $article->setSlug(trim($slug, '-'));

    // Sauvegarder en base
    $em->persist($article);
    $em->flush();

    // Retourner l'article créé avec le code 201
    return $this->json($article, 201, [], ['groups' => ['api:read']]);
}
```

```bash
# Création réussie
curl -X POST http://localhost:8080/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title": "Nouvel article", "content": "Contenu.", "status": "draft"}'

# Erreur de validation
curl -X POST http://localhost:8080/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title": "", "content": "Contenu."}'
```

**Résultat attendu (code 201)** :

```json
{
    "id": 4,
    "title": "Nouvel article",
    "slug": "nouvel-article",
    "content": "Contenu.",
    "status": "draft"
}
```

**Résultat attendu (code 422)** :

```json
{
    "errors": [
        {
            "field": "title",
            "message": "Le titre ne peut pas être vide."
        }
    ]
}
```

---

### Étape 5 : Créer un endpoint PUT /api/articles/{id}

**Objectif** : Modifier un article existant.

```php
#[Route('/articles/{id}', name: 'article_update', methods: ['PUT'])]
public function update(
    int $id,
    Request $request,
    EntityManagerInterface $em,
    ValidatorInterface $validator,
): JsonResponse {
    $article = $em->getRepository(Article::class)->find($id);

    if ($article === null) {
        return $this->json(['error' => 'Article non trouvé.'], 404);
    }

    $data = json_decode($request->getContent(), true);

    if ($data === null) {
        return $this->json(['error' => 'JSON invalide.'], 400);
    }

    // Mettre à jour uniquement les champs fournis
    if (isset($data['title'])) {
        $article->setTitle($data['title']);

        // Regénérer le slug
        $slug = strtolower($data['title']);
        $slug = transliterator_transliterate('Any-Latin; Latin-ASCII; Lower()', $slug);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        $article->setSlug(trim($slug, '-'));
    }
    if (isset($data['content'])) {
        $article->setContent($data['content']);
    }
    if (isset($data['status'])) {
        $article->setStatus($data['status']);
    }

    // Valider
    $errors = $validator->validate($article);
    if (count($errors) > 0) {
        $errorMessages = [];
        foreach ($errors as $error) {
            $errorMessages[] = [
                'field' => $error->getPropertyPath(),
                'message' => $error->getMessage(),
            ];
        }

        return $this->json(['errors' => $errorMessages], 422);
    }

    $em->flush();

    return $this->json($article, 200, [], ['groups' => ['api:read']]);
}
```

```bash
curl -X PUT http://localhost:8080/api/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Titre modifié"}'
```

---

### Étape 6 : Créer un endpoint DELETE /api/articles/{id}

**Objectif** : Supprimer un article existant.

```php
#[Route('/articles/{id}', name: 'article_delete', methods: ['DELETE'])]
public function delete(int $id, EntityManagerInterface $em): JsonResponse
{
    $article = $em->getRepository(Article::class)->find($id);

    if ($article === null) {
        return $this->json(['error' => 'Article non trouvé.'], 404);
    }

    $em->remove($article);
    $em->flush();

    return new JsonResponse(null, 204);
}
```

```bash
curl -X DELETE http://localhost:8080/api/articles/1 -v
```

**Résultat attendu** :

```text
HTTP/1.1 204 No Content
```

---

### Étape 7 : Consommer l'API depuis jQuery/AJAX

**Objectif** : Créer une page HTML qui consomme l'API sans rechargement de page.

Contrôleur pour afficher la page :

```php
<?php
// src/Controller/ArticlePageController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ArticlePageController extends AbstractController
{
    #[Route('/articles/spa', name: 'article_spa')]
    public function spa(): Response
    {
        return $this->render('article/spa.html.twig');
    }
}
```

Template Twig avec jQuery :

```twig
{# templates/article/spa.html.twig #}

{% extends 'base.html.twig' %}

{% block title %}Articles - API{% endblock %}

{% block body %}
<div class="container mt-4">
    <h1>Gestion des articles</h1>

    {# Formulaire de création #}
    <div class="card mb-4">
        <div class="card-body">
            <h2>Créer un article</h2>
            <form id="create-form">
                <div class="mb-3">
                    <label for="title" class="form-label">Titre</label>
                    <input type="text" class="form-control" id="title" required>
                </div>
                <div class="mb-3">
                    <label for="content" class="form-label">Contenu</label>
                    <textarea class="form-control" id="content" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Créer</button>
            </form>
            <div id="create-message" class="mt-2"></div>
        </div>
    </div>

    <h2>Liste des articles</h2>
    <div id="articles-list"><p>Chargement...</p></div>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script>
$(document).ready(function () { loadArticles(); });

function loadArticles() {
    $.ajax({
        url: '/api/articles',
        method: 'GET',
        dataType: 'json',
        success: function (articles) {
            if (articles.length === 0) {
                $('#articles-list').html('<p>Aucun article.</p>');
                return;
            }
            var html = '<table class="table"><thead><tr>';
            html += '<th>ID</th><th>Titre</th><th>Statut</th><th>Actions</th>';
            html += '</tr></thead><tbody>';
            articles.forEach(function (a) {
                html += '<tr><td>' + a.id + '</td><td>' + a.title + '</td>';
                html += '<td>' + a.status + '</td><td>';
                html += '<button class="btn btn-danger btn-sm" ';
                html += 'onclick="deleteArticle(' + a.id + ')">Supprimer</button>';
                html += '</td></tr>';
            });
            html += '</tbody></table>';
            $('#articles-list').html(html);
        }
    });
}

$('#create-form').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
        url: '/api/articles',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            title: $('#title').val(),
            content: $('#content').val(),
            status: 'draft'
        }),
        success: function (article) {
            $('#create-message').html(
                '<div class="alert alert-success">Article créé (ID: ' + article.id + ')</div>'
            );
            $('#title').val('');
            $('#content').val('');
            loadArticles();
        },
        error: function (xhr) {
            var msg = 'Erreur lors de la création.';
            if (xhr.responseJSON && xhr.responseJSON.errors) {
                msg = '';
                xhr.responseJSON.errors.forEach(function (err) {
                    msg += err.field + ' : ' + err.message + '<br>';
                });
            }
            $('#create-message').html('<div class="alert alert-danger">' + msg + '</div>');
        }
    });
});

function deleteArticle(id) {
    if (!confirm('Supprimer cet article ?')) return;
    $.ajax({
        url: '/api/articles/' + id,
        method: 'DELETE',
        success: function () { loadArticles(); }
    });
}
</script>
{% endblock %}
```

**Résultat attendu** : Une page avec un formulaire et un tableau d'articles. Les créations et suppressions se font sans rechargement de page.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console debug:router` | Lister les routes (filtre le chemin `/api` dans la sortie ; pas d'option `--path` en 7.4) |
| `curl -X GET http://localhost:8080/api/articles` | Tester un endpoint GET |
| `curl -X POST url -H "Content-Type: application/json" -d '{...}'` | Tester un endpoint POST |

---

## Pièges Fréquents

### Piège 1 : Référence circulaire dans la sérialisation

**Problème** : Erreur `A circular reference has been detected`.

**Cause** : Article a une relation vers Category, et Category a une relation vers Article. Le Serializer boucle : Article -> Category -> Articles -> ...

```php
// ❌ Les deux côtés de la relation ont le même groupe
class Article
{
    #[Groups(['api:read'])]
    private Category $category;
}
class Category
{
    #[Groups(['api:read'])]
    private Collection $articles;  // Boucle infinie !
}

// ✅ Retirer le groupe d'un côté de la relation
class Category
{
    #[Groups(['api:read'])]
    private string $name;       // Sérialisé

    private Collection $articles;  // PAS de groupe → pas de boucle
}
```

**Règle** : Ne mets jamais le même groupe sur les deux côtés d'une relation bidirectionnelle.

---

### Piège 2 : Oublier le header Content-Type

**Problème** : Le serveur ne comprend pas les données envoyées.

```bash
# ❌ Sans Content-Type
curl -X POST http://localhost:8080/api/articles \
  -d '{"title": "Mon article"}'

# ✅ Avec Content-Type
curl -X POST http://localhost:8080/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title": "Mon article"}'
```

En jQuery :

```javascript
// ❌ Sans contentType
$.ajax({ url: '/api/articles', method: 'POST', data: JSON.stringify({title: 'Test'}) });

// ✅ Avec contentType
$.ajax({ url: '/api/articles', method: 'POST',
    contentType: 'application/json', data: JSON.stringify({title: 'Test'}) });
```

---

### Piège 3 : Ne pas valider les données d'entrée

**Problème** : Des données invalides sont enregistrées en base (titres vides, contenus de 50 000 caractères).

```php
// ❌ Pas de validation
$article = $serializer->deserialize($json, Article::class, 'json');
$em->persist($article);
$em->flush();

// ✅ Avec validation
$article = $serializer->deserialize($json, Article::class, 'json');
$errors = $validator->validate($article);
if (count($errors) > 0) {
    return $this->json(['errors' => $errorMessages], 422);
}
$em->persist($article);
$em->flush();
```

**Règle** : Valide toujours les données avant l'enregistrement. Les données venant de l'extérieur ne sont jamais fiables.

---

### Piège 4 : Ne pas protéger les endpoints

**Problème** : N'importe qui peut créer, modifier ou supprimer des données.

**Solution minimale** :

```php
#[Route('/articles', name: 'article_create', methods: ['POST'])]
public function create(Request $request): JsonResponse
{
    // Vérifier que l'utilisateur est connecté
    $this->denyAccessUnlessGranted('ROLE_USER');
    // ...
}
```

**Règle** : Les endpoints GET peuvent être publics. Les endpoints POST, PUT et DELETE doivent être protégés (voir fiche 12 sur la sécurité).

---

## Checklist de Validation

- [ ] Je sais ce qu'est une API et la différence avec un contrôleur classique
- [ ] Je comprends le format JSON et les types de données
- [ ] Je sais retourner du JSON avec `$this->json()` et `JsonResponse`
- [ ] Je sais utiliser le Serializer avec les groupes `#[Groups]`
- [ ] Je sais désérialiser du JSON en objet PHP
- [ ] Je connais les codes HTTP essentiels (200, 201, 204, 400, 404, 422)
- [ ] Je sais valider les données d'entrée avec `ValidatorInterface`
- [ ] Je sais créer des endpoints GET, POST, PUT et DELETE
- [ ] Je sais consommer l'API depuis jQuery/AJAX

---

## Exercice Pratique

**Énoncé** : Crée une API CRUD complète pour une entité Product et une page HTML avec jQuery qui consomme cette API.

**Spécifications** :

1. Entité `Product` avec les champs :
   - `id` (auto-généré), `name` (string 255, obligatoire), `description` (text, obligatoire)
   - `price` (float, minimum 0.01), `stock` (integer, minimum 0), `createdAt` (datetime_immutable)

2. Groupes : `api:read` (id, name, description, price, stock, createdAt), `api:write` (name, description, price, stock)

3. Cinq endpoints dans `ApiProductController` :
   - `GET /api/products` et `GET /api/products/{id}`
   - `POST /api/products` (avec validation)
   - `PUT /api/products/{id}` (avec validation)
   - `DELETE /api/products/{id}`

4. Page HTML `/products/spa` avec jQuery : tableau des produits, formulaire de création, bouton de suppression

**Résultat attendu** :

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Clavier", "description": "Clavier RGB", "price": 89.99, "stock": 50}'
```

```json
{
    "id": 1,
    "name": "Clavier",
    "description": "Clavier RGB",
    "price": 89.99,
    "stock": 50,
    "createdAt": "2026-03-19T10:00:00+00:00"
}
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Entité `src/Entity/Product.php`** :

L'entité suit la même structure que l'entité Article : attributs ORM, groupes de sérialisation `#[Groups]`, contraintes de validation `#[Assert]`, et getters/setters classiques. Les points clés :

```php
#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['api:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['api:read', 'api:write'])]
    #[Assert\NotBlank(message: 'Le nom ne peut pas être vide.')]
    private string $name;

    #[ORM\Column(type: 'float')]
    #[Groups(['api:read', 'api:write'])]
    #[Assert\Positive(message: 'Le prix doit être supérieur à 0.')]
    private float $price;

    #[ORM\Column(type: 'integer')]
    #[Groups(['api:read', 'api:write'])]
    #[Assert\PositiveOrZero(message: 'Le stock ne peut pas être négatif.')]
    private int $stock;

    // + description (text, api:read + api:write, NotBlank)
    // + createdAt : private ?\DateTimeImmutable $createdAt = null; (#[ORM\Column] non-nullable, #[Groups(['api:read'])])
    // + __construct() : $this->createdAt = new \DateTimeImmutable(); (sinon le POST échoue au flush, comme vu fiche 08)
    // + getters et setters pour chaque propriété
}
```

**Contrôleur `src/Controller/ApiProductController.php`** :

```php
<?php

namespace App\Controller;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api', name: 'api_')]
class ApiProductController extends AbstractController
{
    #[Route('/products', name: 'product_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em): JsonResponse
    {
        $products = $em->getRepository(Product::class)->findAll();

        return $this->json($products, 200, [], ['groups' => ['api:read']]);
    }

    #[Route('/products/{id}', name: 'product_show', methods: ['GET'])]
    public function show(int $id, EntityManagerInterface $em): JsonResponse
    {
        $product = $em->getRepository(Product::class)->find($id);
        if ($product === null) {
            return $this->json(['error' => 'Produit non trouvé.'], 404);
        }

        return $this->json($product, 200, [], ['groups' => ['api:read']]);
    }

    #[Route('/products', name: 'product_create', methods: ['POST'])]
    public function create(
        Request $request, EntityManagerInterface $em,
        SerializerInterface $serializer, ValidatorInterface $validator,
    ): JsonResponse {
        try {
            $product = $serializer->deserialize(
                $request->getContent(), Product::class, 'json',
                ['groups' => ['api:write']]
            );
        } catch (\Exception $e) {
            return $this->json(['error' => 'JSON invalide.'], 400);
        }

        $errors = $validator->validate($product);
        if (count($errors) > 0) {
            $msgs = [];
            foreach ($errors as $err) {
                $msgs[] = ['field' => $err->getPropertyPath(), 'message' => $err->getMessage()];
            }
            return $this->json(['errors' => $msgs], 422);
        }

        $em->persist($product);
        $em->flush();

        return $this->json($product, 201, [], ['groups' => ['api:read']]);
    }

    #[Route('/products/{id}', name: 'product_update', methods: ['PUT'])]
    public function update(
        int $id, Request $request, EntityManagerInterface $em, ValidatorInterface $validator,
    ): JsonResponse {
        $product = $em->getRepository(Product::class)->find($id);
        if ($product === null) {
            return $this->json(['error' => 'Produit non trouvé.'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if ($data === null) {
            return $this->json(['error' => 'JSON invalide.'], 400);
        }

        if (isset($data['name'])) { $product->setName($data['name']); }
        if (isset($data['description'])) { $product->setDescription($data['description']); }
        if (isset($data['price'])) { $product->setPrice((float) $data['price']); }
        if (isset($data['stock'])) { $product->setStock((int) $data['stock']); }

        $errors = $validator->validate($product);
        if (count($errors) > 0) {
            $msgs = [];
            foreach ($errors as $err) {
                $msgs[] = ['field' => $err->getPropertyPath(), 'message' => $err->getMessage()];
            }
            return $this->json(['errors' => $msgs], 422);
        }

        $em->flush();

        return $this->json($product, 200, [], ['groups' => ['api:read']]);
    }

    #[Route('/products/{id}', name: 'product_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $product = $em->getRepository(Product::class)->find($id);
        if ($product === null) {
            return $this->json(['error' => 'Produit non trouvé.'], 404);
        }

        $em->remove($product);
        $em->flush();

        return new JsonResponse(null, 204);
    }
}
```

**Tester les endpoints** :

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Clavier", "description": "Clavier RGB", "price": 89.99, "stock": 50}'
curl -X GET http://localhost:8080/api/products
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" -d '{"price": 79.99}'
curl -X DELETE http://localhost:8080/api/products/1
```

---

## Navigation

← Fiche précédente : **[Commandes console](15-commandes-console.md)**

→ Fiche suivante : **[Les tests fonctionnels](17-tests-fonctionnels.md)**
