---
tags:
  - API
  - Intermédiaire
  - Concept
description: "Maîtriser les principes REST avancés : niveaux de maturité, conventions de nommage, méthodes HTTP, codes de statut, idempotence et HATEOAS."
estimated_time: "60 min"
fiche_number: 1
total_fiches: 10
cursus: "API Design et Documentation"
---

# 01 - Principes REST avancés

> **En bref** : Cette fiche approfondit les principes REST : niveaux de maturité de Richardson, conventions de nommage des URL, méthodes HTTP, codes de statut, idempotence et HATEOAS. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche **[16 - API JSON](../03-symfony/16-api-json.md)** du cursus Symfony
- Connaître les bases du protocole HTTP (requête, réponse, headers)
- Savoir créer un contrôleur Symfony qui retourne du JSON

## Objectif de cette fiche

À la fin de cette fiche, tu sauras concevoir des URL REST conformes aux bonnes pratiques, choisir la bonne méthode HTTP pour chaque opération, utiliser les codes de statut appropriés, et comprendre les niveaux de maturité REST.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que REST ?

**Définition** : REST (REpresentational State Transfer) est un style d'architecture logicielle pour concevoir des API web. Il repose sur des contraintes précises : client-serveur, sans état (stateless), mise en cache, interface uniforme et système en couches.

**Le problème que REST résout** :

Sans REST, voici les problèmes rencontrés :

1. **Incohérence des URL** : chaque développeur invente ses propres conventions (`/getUser`, `/fetch_articles`, `/deletePost/5`), ce qui rend l'API imprévisible.
2. **Mauvaise utilisation du protocole HTTP** : tout passe par GET ou POST, les codes de statut sont ignorés.
3. **Couplage client-serveur** : le client doit connaître la structure interne du serveur pour communiquer.

**Comment REST résout ces problèmes** :

| Problème | Solution apportée par REST |
| -------- | -------------------------- |
| Incohérence des URL | Conventions de nommage standardisées (noms au pluriel, pas de verbes) |
| Mauvaise utilisation HTTP | Chaque méthode HTTP a un rôle précis (GET = lire, POST = créer, etc.) |
| Couplage client-serveur | Interface uniforme : les ressources sont identifiées par des URL, les actions par des méthodes HTTP |

**Analogie concrète** : REST fonctionne comme un système de bibliothèque. Chaque livre (ressource) a une cote unique (URL). Pour emprunter un livre, tu utilises un formulaire standardisé (méthode HTTP). La bibliothèque te répond avec un reçu clair (code de statut + données). Tu n'as pas besoin de savoir comment la bibliothèque organise ses étagères en interne.

**Ce que REST n'est PAS** :

- REST n'est pas un protocole. C'est un style d'architecture. HTTP est le protocole. REST est un ensemble de règles pour bien utiliser HTTP.
- REST n'est pas un standard officiel. Il n'y a pas de spécification W3C. Ce sont des conventions largement adoptées par l'industrie.
- REST n'est pas la seule façon de faire des API. GraphQL, gRPC et SOAP sont des alternatives.

---

### Les niveaux de maturité de Richardson

**Définition** : Le modèle de maturité de Richardson classe les API web en 4 niveaux (0 à 3), du moins RESTful au plus RESTful. Il permet d'évaluer à quel point une API respecte les principes REST.

**Le problème que ce modèle résout** :

Sans ce modèle, voici les problèmes rencontrés :

1. **Pas de référence commune** : impossible de mesurer la qualité REST d'une API.
2. **Confusion sur le terme REST** : beaucoup d'API se disent REST sans en respecter les principes.

**Les 4 niveaux** :

| Niveau | Nom | Description | Exemple |
| ------ | --- | ----------- | ------- |
| 0 | Le marais | Une seule URL, une seule méthode (POST) | `POST /api` avec une action dans le body |
| 1 | Ressources | Des URL distinctes par ressource | `POST /articles`, `POST /users` |
| 2 | Méthodes HTTP | Utilisation correcte de GET, POST, PUT, DELETE | `GET /articles`, `POST /articles`, `DELETE /articles/5` |
| 3 | HATEOAS | Les réponses contiennent des liens vers les actions possibles | La réponse inclut `"_links": {"self": "/articles/5"}` |

**Analogie concrète** : Imagine un restaurant. Au niveau 0, il n'y a qu'un comptoir et tu cries ta commande. Au niveau 1, il y a des comptoirs séparés (pizzas, boissons, desserts). Au niveau 2, chaque comptoir a des actions claires (commander, modifier, annuler). Au niveau 3, le serveur te donne le menu avec les prochaines étapes possibles (« Voulez-vous un dessert ? Voici la carte »).

**Progression des niveaux** :

<div class="diagram-design">
<p><a href="../../diagrams/12-api-design-01-principes-rest-avances-1.html">Les niveaux de maturité de Richardson (HTML + SVG)</a></p>
<iframe src="../../diagrams/12-api-design-01-principes-rest-avances-1.html" title="Les niveaux de maturité de Richardson" style="width:100%;min-height:596px;border:0;background:transparent"></iframe>
</div>

La majorité des API en production sont au niveau 2. Le niveau 2 est le minimum recommandé.

**Ce que les niveaux de maturité ne sont PAS** :

- Le niveau 3 n'est pas obligatoire pour avoir une bonne API. La majorité des API en production sont au niveau 2. Le niveau 2 est le minimum recommandé.
- Les niveaux ne sont pas des notes de qualité absolue. Une API niveau 2 bien conçue vaut mieux qu'une API niveau 3 mal implémentée.

---

### Conventions de nommage des URL

**Définition** : Les conventions de nommage REST définissent comment structurer les URL pour identifier les ressources de façon cohérente et prévisible.

**Règles fondamentales** :

| Règle | Bon exemple | Mauvais exemple | Explication |
| ----- | ----------- | --------------- | ----------- |
| Noms au pluriel | `/articles` | `/article` | Une collection contient plusieurs éléments |
| Pas de verbes | `/articles` | `/getArticles` | Le verbe est porté par la méthode HTTP |
| Kebab-case | `/blog-posts` | `/blogPosts`, `/blog_posts` | Convention URL standard |
| Minuscules | `/articles` | `/Articles` | Les URL sont sensibles à la casse |
| Hiérarchie par slash | `/articles/5/comments` | `/articleComments?articleId=5` | Les sous-ressources s'expriment par imbrication |
| Pas d'extension | `/articles/5` | `/articles/5.json` | Le format se négocie via le header `Accept` |
| Pas de slash final | `/articles` | `/articles/` | Évite les confusions et les redirections |

**Exemples de routes pour une ressource Article** :

```text
GET    /articles          → Liste tous les articles
GET    /articles/5        → Récupère l'article avec l'id 5
POST   /articles          → Crée un nouvel article
PUT    /articles/5        → Remplace entièrement l'article 5
PATCH  /articles/5        → Modifie partiellement l'article 5
DELETE /articles/5        → Supprime l'article 5
```

**Exemples de sous-ressources** :

```text
GET    /articles/5/comments      → Liste les commentaires de l'article 5
POST   /articles/5/comments      → Ajoute un commentaire à l'article 5
GET    /articles/5/comments/12   → Récupère le commentaire 12 de l'article 5
DELETE /articles/5/comments/12   → Supprime le commentaire 12 de l'article 5
```

---

### Méthodes HTTP en détail

**Définition** : Les méthodes HTTP (aussi appelées verbes HTTP) indiquent l'action à effectuer sur une ressource. REST en utilise principalement cinq : GET, POST, PUT, PATCH et DELETE.

**Tableau détaillé des méthodes** :

| Méthode | Action | Corps (body) | Idempotente | Sûre | Code succès typique |
| ------- | ------ | ------------ | ----------- | ---- | ------------------- |
| GET | Lire une ressource | Non | Oui | Oui | 200 |
| POST | Créer une ressource | Oui | Non | Non | 201 |
| PUT | Remplacer entièrement | Oui | Oui | Non | 200 |
| PATCH | Modifier partiellement | Oui | Non | Non | 200 |
| DELETE | Supprimer | Non | Oui | Non | 204 |

**Différence entre PUT et PATCH** :

| PUT | PATCH |
| --- | ----- |
| Remplace la ressource entière | Modifie uniquement les champs envoyés |
| Tu dois envoyer tous les champs | Tu envoies seulement les champs à modifier |
| Si tu oublies un champ, il prend sa valeur par défaut | Les champs non envoyés restent inchangés |

**Exemple concret** :

```json
// Ressource actuelle
{
    "id": 5,
    "title": "Mon article",
    "content": "Contenu complet",
    "published": true
}
```

```json
// PUT /articles/5 → tu dois envoyer TOUS les champs
{
    "title": "Titre modifié",
    "content": "Contenu complet",
    "published": true
}
```

```json
// PATCH /articles/5 → tu envoies SEULEMENT le champ à modifier
{
    "title": "Titre modifié"
}
```

---

### Idempotence

**Définition** : Une opération est idempotente si l'exécuter une fois ou plusieurs fois produit le même résultat. La ressource finale est identique, quel que soit le nombre d'appels.

**Le problème que l'idempotence résout** :

Sans idempotence, voici les problèmes rencontrés :

1. **Doublons accidentels** : si le réseau coupe pendant un POST, le client ne sait pas si la requête a abouti. Il renvoie la requête et crée un doublon.
2. **Résultats imprévisibles** : exécuter deux fois la même requête peut produire des résultats différents.

**Tableau d'idempotence** :

| Méthode | Idempotente ? | Explication |
| ------- | ------------- | ----------- |
| GET | Oui | Lire une ressource 10 fois donne toujours le même résultat |
| PUT | Oui | Remplacer une ressource par les mêmes données 10 fois donne le même résultat |
| DELETE | Oui | Supprimer une ressource déjà supprimée ne change rien (même si le code retourné change : 204 puis 404) |
| POST | Non | Créer une ressource 10 fois crée 10 ressources |
| PATCH | Non | Modifier un compteur avec `{"views": "+1"}` donne un résultat différent à chaque appel |

**Analogie concrète** : Appuyer sur le bouton « étage 3 » dans un ascenseur est idempotent. Que tu appuies 1 fois ou 10 fois, l'ascenseur va au 3e étage. Appuyer sur le bouton « ajouter un article au panier » n'est pas idempotent : chaque appui ajoute un article supplémentaire.

**Ce que l'idempotence n'est PAS** :

- L'idempotence ne signifie pas que le code de statut sera identique. Un DELETE retourne 204 la première fois, puis 404 les fois suivantes. Mais la ressource est dans le même état (supprimée).
- L'idempotence ne signifie pas qu'il n'y a pas d'effet de bord. Un GET peut être journalisé. Mais l'état de la ressource ne change pas.

---

### Codes de statut HTTP

**Définition** : Les codes de statut HTTP sont des nombres à trois chiffres envoyés par le serveur pour indiquer le résultat d'une requête. Ils sont regroupés en 5 familles.

**Les 5 familles** :

| Famille | Signification | Exemples courants |
| ------- | ------------- | ----------------- |
| 1xx | Information | 100 Continue |
| 2xx | Succès | 200, 201, 204 |
| 3xx | Redirection | 301, 304 |
| 4xx | Erreur client | 400, 401, 403, 404, 409, 422 |
| 5xx | Erreur serveur | 500, 502, 503 |

**Codes essentiels pour une API REST** :

| Code | Nom | Quand l'utiliser |
| ---- | --- | ---------------- |
| 200 | OK | Requête réussie (GET, PUT, PATCH) |
| 201 | Created | Ressource créée avec succès (POST) |
| 204 | No Content | Succès sans contenu à retourner (DELETE) |
| 400 | Bad Request | La requête est mal formée (JSON invalide) |
| 401 | Unauthorized | Authentification requise (pas de token ou token invalide) |
| 403 | Forbidden | Authentifié mais pas autorisé (droits insuffisants) |
| 404 | Not Found | La ressource demandée n'existe pas |
| 409 | Conflict | Conflit avec l'état actuel (doublon, violation d'unicité) |
| 422 | Unprocessable Entity | JSON valide mais données invalides (validation échouée) |
| 500 | Internal Server Error | Erreur côté serveur (bug, exception non gérée) |

**Différence entre 401 et 403** :

| 401 Unauthorized | 403 Forbidden |
| ---------------- | ------------- |
| Pas d'authentification fournie | Authentification fournie mais insuffisante |
| « Qui es-tu ? » | « Je sais qui tu es, mais tu n'as pas le droit » |
| Solution : se connecter | Solution : demander des droits supplémentaires |

**Différence entre 400 et 422** :

| 400 Bad Request | 422 Unprocessable Entity |
| --------------- | ------------------------ |
| Le JSON est cassé ou la requête est mal formée | Le JSON est valide mais les données ne respectent pas les règles |
| Problème de syntaxe | Problème de sémantique |
| Exemple : `{title: }` (JSON invalide) | Exemple : `{"title": ""}` (titre vide, validation échouée) |

---

### HATEOAS

**Définition** : HATEOAS (Hypermedia As The Engine Of Application State) est le niveau 3 du modèle de Richardson. Le serveur inclut dans ses réponses des liens hypertexte vers les actions possibles. Le client n'a pas besoin de connaître les URL à l'avance.

**Le problème que HATEOAS résout** :

Sans HATEOAS, voici les problèmes rencontrés :

1. **URL codées en dur** : le client doit connaître toutes les URL de l'API à l'avance.
2. **Logique métier dupliquée** : le client doit savoir quelles actions sont possibles selon l'état de la ressource.

**Comment HATEOAS résout ces problèmes** :

| Problème | Solution apportée par HATEOAS |
| -------- | ----------------------------- |
| URL codées en dur | Le serveur fournit les liens dans chaque réponse |
| Logique métier dupliquée | Le serveur indique quelles actions sont disponibles |

**Exemple sans HATEOAS** :

```json
{
    "id": 5,
    "title": "Mon article",
    "status": "draft"
}
```

Le client doit savoir que pour publier, il faut appeler `POST /articles/5/publish`. Cette URL est codée en dur dans le code client.

**Exemple avec HATEOAS** :

```json
{
    "id": 5,
    "title": "Mon article",
    "status": "draft",
    "_links": {
        "self": {
            "href": "/articles/5"
        },
        "publish": {
            "href": "/articles/5/publish",
            "method": "POST"
        },
        "edit": {
            "href": "/articles/5",
            "method": "PUT"
        },
        "delete": {
            "href": "/articles/5",
            "method": "DELETE"
        }
    }
}
```

Le serveur indique au client les actions possibles. Si l'article est déjà publié, le lien `publish` disparaît.

**Analogie concrète** : HATEOAS fonctionne comme un distributeur automatique. Après avoir inséré de l'argent, le distributeur allume les boutons des produits disponibles (les actions possibles). Si un produit est épuisé, son bouton reste éteint. Tu n'as pas besoin de mémoriser quels produits sont disponibles : la machine te le montre.

**Ce que HATEOAS n'est PAS** :

- HATEOAS n'est pas obligatoire pour une API REST fonctionnelle. La majorité des API s'arrêtent au niveau 2.
- HATEOAS n'est pas simple à implémenter. Il nécessite une réflexion sur la machine d'états de chaque ressource.

---

## Étapes Pratiques

### Étape 1 : Créer un contrôleur API avec les bonnes conventions

Crée un contrôleur Symfony qui respecte les conventions REST.

```php
<?php
// src/Controller/Api/ArticleController.php

namespace App\Controller\Api;

use App\Entity\Article;
use App\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Le préfixe /api/articles est appliqué à toutes les routes de ce contrôleur
#[Route('/api/articles')]
class ArticleController extends AbstractController
{
    // GET /api/articles → Liste tous les articles
    // Code 200 : succès, on retourne la liste
    #[Route('', methods: ['GET'])]
    public function index(ArticleRepository $repository): JsonResponse
    {
        $articles = $repository->findAll();

        // On transforme chaque entité en tableau associatif
        $data = array_map(fn(Article $article) => [
            'id' => $article->getId(),
            'title' => $article->getTitle(),
            'slug' => $article->getSlug(),
            'createdAt' => $article->getCreatedAt()->format('c'),
        ], $articles);

        // 200 OK : la requête a réussi
        return $this->json($data, Response::HTTP_OK);
    }

    // GET /api/articles/{id} → Récupère un article par son identifiant
    // Code 200 : succès
    // Code 404 : si l'article n'existe pas
    #[Route('/{id}', methods: ['GET'])]
    public function show(Article $article): JsonResponse
    {
        // Symfony résout automatiquement l'id vers l'entité
        // Si l'article n'existe pas, Symfony retourne 404 automatiquement
        $data = [
            'id' => $article->getId(),
            'title' => $article->getTitle(),
            'content' => $article->getContent(),
            'slug' => $article->getSlug(),
            'published' => $article->isPublished(),
            'createdAt' => $article->getCreatedAt()->format('c'),
        ];

        return $this->json($data, Response::HTTP_OK);
    }

    // POST /api/articles → Crée un nouvel article
    // Code 201 : ressource créée avec succès
    // Code 400 : JSON invalide
    // Code 422 : données invalides
    #[Route('', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        // On décode le JSON envoyé par le client
        $payload = json_decode($request->getContent(), true);

        // Si le JSON est invalide, on retourne 400
        if ($payload === null) {
            return $this->json(
                ['error' => 'JSON invalide'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Validation manuelle (en production, utiliser le Validator)
        if (empty($payload['title'])) {
            return $this->json(
                ['error' => 'Le champ title est obligatoire'],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        $article = new Article();
        $article->setTitle($payload['title']);
        $article->setContent($payload['content'] ?? '');
        $article->setSlug($payload['slug'] ?? '');
        $article->setPublished($payload['published'] ?? false);

        $em->persist($article);
        $em->flush();

        // 201 Created : la ressource a été créée
        // On retourne la ressource créée avec son id
        return $this->json(
            ['id' => $article->getId(), 'title' => $article->getTitle()],
            Response::HTTP_CREATED
        );
    }

    // PUT /api/articles/{id} → Remplace entièrement un article
    // Code 200 : succès
    // Tous les champs doivent être fournis
    #[Route('/{id}', methods: ['PUT'])]
    public function replace(
        Article $article,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true);

        if ($payload === null) {
            return $this->json(
                ['error' => 'JSON invalide'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // PUT : on remplace TOUS les champs
        // Si un champ est absent, il prend sa valeur par défaut
        $article->setTitle($payload['title'] ?? '');
        $article->setContent($payload['content'] ?? '');
        $article->setSlug($payload['slug'] ?? '');
        $article->setPublished($payload['published'] ?? false);

        $em->flush();

        return $this->json(
            ['id' => $article->getId(), 'title' => $article->getTitle()],
            Response::HTTP_OK
        );
    }

    // PATCH /api/articles/{id} → Modifie partiellement un article
    // Code 200 : succès
    // Seuls les champs fournis sont modifiés
    #[Route('/{id}', methods: ['PATCH'])]
    public function update(
        Article $article,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true);

        if ($payload === null) {
            return $this->json(
                ['error' => 'JSON invalide'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // PATCH : on modifie SEULEMENT les champs présents dans le payload
        if (isset($payload['title'])) {
            $article->setTitle($payload['title']);
        }
        if (isset($payload['content'])) {
            $article->setContent($payload['content']);
        }
        if (isset($payload['published'])) {
            $article->setPublished($payload['published']);
        }

        $em->flush();

        return $this->json(
            ['id' => $article->getId(), 'title' => $article->getTitle()],
            Response::HTTP_OK
        );
    }

    // DELETE /api/articles/{id} → Supprime un article
    // Code 204 : succès sans contenu
    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(
        Article $article,
        EntityManagerInterface $em
    ): JsonResponse {
        $em->remove($article);
        $em->flush();

        // 204 No Content : la suppression a réussi, pas de contenu à retourner
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
```

**Résultat attendu** : un contrôleur API complet avec les 5 méthodes REST, chacune utilisant le bon code de statut HTTP.

---

### Étape 2 : Ajouter les sous-ressources

Crée un contrôleur pour gérer les commentaires comme sous-ressource des articles.

```php
<?php
// src/Controller/Api/CommentController.php

namespace App\Controller\Api;

use App\Entity\Article;
use App\Entity\Comment;
use App\Repository\CommentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Les commentaires sont des sous-ressources des articles
// L'URL reflète cette hiérarchie : /api/articles/{articleId}/comments
#[Route('/api/articles/{articleId}/comments')]
class CommentController extends AbstractController
{
    // GET /api/articles/5/comments → Liste les commentaires de l'article 5
    #[Route('', methods: ['GET'])]
    public function index(
        int $articleId,
        CommentRepository $repository
    ): JsonResponse {
        // On filtre les commentaires par article
        $comments = $repository->findBy(['article' => $articleId]);

        $data = array_map(fn(Comment $comment) => [
            'id' => $comment->getId(),
            'author' => $comment->getAuthor(),
            'content' => $comment->getContent(),
            'createdAt' => $comment->getCreatedAt()->format('c'),
        ], $comments);

        return $this->json($data, Response::HTTP_OK);
    }

    // POST /api/articles/5/comments → Ajoute un commentaire à l'article 5
    #[Route('', methods: ['POST'])]
    public function create(
        Article $article,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true);

        $comment = new Comment();
        $comment->setAuthor($payload['author'] ?? '');
        $comment->setContent($payload['content'] ?? '');
        // On lie le commentaire à l'article parent
        $comment->setArticle($article);

        $em->persist($comment);
        $em->flush();

        return $this->json(
            ['id' => $comment->getId()],
            Response::HTTP_CREATED
        );
    }
}
```

**Résultat attendu** : les commentaires sont accessibles via l'URL hiérarchique `/api/articles/{id}/comments`.

---

### Étape 3 : Ajouter des liens HATEOAS dans les réponses

Enrichis les réponses avec des liens HATEOAS.

```php
<?php
// src/Service/HateoasHelper.php

namespace App\Service;

use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

// Ce service génère les liens HATEOAS pour les réponses API
class HateoasHelper
{
    public function __construct(
        // Le générateur d'URL de Symfony transforme les noms de routes en URL
        private UrlGeneratorInterface $urlGenerator,
    ) {
    }

    // Génère les liens pour un article
    public function articleLinks(int $articleId): array
    {
        return [
            '_links' => [
                // Lien vers la ressource elle-même
                'self' => [
                    'href' => $this->urlGenerator->generate(
                        'api_article_show',
                        ['id' => $articleId]
                    ),
                ],
                // Lien vers la collection parente
                'collection' => [
                    'href' => $this->urlGenerator->generate(
                        'api_article_index'
                    ),
                ],
                // Lien vers les commentaires de cet article
                'comments' => [
                    'href' => $this->urlGenerator->generate(
                        'api_comment_index',
                        ['articleId' => $articleId]
                    ),
                ],
            ],
        ];
    }
}
```

Utilisation dans le contrôleur :

```php
<?php
// Dans ArticleController::show()

#[Route('/{id}', name: 'api_article_show', methods: ['GET'])]
public function show(
    Article $article,
    HateoasHelper $hateoas
): JsonResponse {
    $data = [
        'id' => $article->getId(),
        'title' => $article->getTitle(),
        'content' => $article->getContent(),
    ];

    // On fusionne les données de l'article avec les liens HATEOAS
    $data = array_merge($data, $hateoas->articleLinks($article->getId()));

    return $this->json($data, Response::HTTP_OK);
}
```

**Résultat attendu** :

```json
{
    "id": 5,
    "title": "Mon article",
    "content": "Contenu de l'article",
    "_links": {
        "self": {
            "href": "/api/articles/5"
        },
        "collection": {
            "href": "/api/articles"
        },
        "comments": {
            "href": "/api/articles/5/comments"
        }
    }
}
```

---

### Étape 4 : Tester avec curl

Teste ton API avec les commandes curl suivantes.

```bash
# Créer un article (POST)
curl -X POST http://localhost:8000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title": "Premier article", "content": "Contenu", "published": true}'
```

**Résultat attendu** :

```text
HTTP/1.1 201 Created
{"id":1,"title":"Premier article"}
```

```bash
# Lister les articles (GET)
curl http://localhost:8000/api/articles
```

**Résultat attendu** :

```text
HTTP/1.1 200 OK
[{"id":1,"title":"Premier article","slug":"","createdAt":"2026-03-20T10:00:00+00:00"}]
```

```bash
# Modifier partiellement un article (PATCH)
curl -X PATCH http://localhost:8000/api/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Titre modifié"}'
```

**Résultat attendu** :

```text
HTTP/1.1 200 OK
{"id":1,"title":"Titre modifié"}
```

```bash
# Supprimer un article (DELETE)
curl -X DELETE http://localhost:8000/api/articles/1
```

**Résultat attendu** :

```text
HTTP/1.1 204 No Content
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `curl -X GET http://localhost:8000/api/articles` | Lister les articles |
| `curl -X POST -H "Content-Type: application/json" -d '{}' URL` | Envoyer un POST avec du JSON |
| `curl -i URL` | Afficher les headers de réponse (dont le code de statut) |
| `curl -v URL` | Mode verbeux : affiche la requête ET la réponse complètes |
| `php bin/console debug:router` | Lister toutes les routes Symfony |
| `php bin/console debug:router --show-controllers` | Lister les routes avec leurs contrôleurs |

---

## Pièges Fréquents

### Piège 1 : Utiliser des verbes dans les URL

⚠️ **Problème** : Tu crées des routes comme `/api/getArticles`, `/api/deleteArticle/5` ou `/api/createUser`.

✅ **Solution** : Les verbes sont portés par les méthodes HTTP, pas par les URL. Utilise des noms au pluriel.

```text
# ❌ Incorrect
GET  /api/getArticles
POST /api/createArticle
GET  /api/deleteArticle/5

# ✅ Correct
GET    /api/articles
POST   /api/articles
DELETE /api/articles/5
```

### Piège 2 : Retourner 200 pour toutes les réponses

⚠️ **Problème** : Tu retournes toujours 200 avec un champ `success: true/false` dans le body.

✅ **Solution** : Utilise les codes de statut HTTP appropriés. Le code de statut est la première information que le client lit.

```php
<?php
// ❌ Incorrect : toujours 200, erreur dans le body
return $this->json(['success' => false, 'error' => 'Non trouvé'], 200);

// ✅ Correct : le code de statut reflète le résultat
return $this->json(['error' => 'Non trouvé'], 404);
```

### Piège 3 : Confondre PUT et PATCH

⚠️ **Problème** : Tu utilises PUT pour modifier un seul champ, mais les autres champs sont réinitialisés.

✅ **Solution** : PUT remplace la ressource entière (tous les champs doivent être envoyés). PATCH modifie uniquement les champs envoyés. Pour une modification partielle, utilise PATCH.

### Piège 4 : Oublier le header Content-Type

⚠️ **Problème** : Tu envoies du JSON sans le header `Content-Type: application/json`. Symfony ne décode pas le body correctement.

✅ **Solution** : Toujours envoyer le header `Content-Type: application/json` avec les requêtes POST, PUT et PATCH.

```bash
# ❌ Incorrect : pas de Content-Type
curl -X POST http://localhost:8000/api/articles -d '{"title": "Test"}'

# ✅ Correct : Content-Type explicite
curl -X POST http://localhost:8000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'
```

---

## Checklist de Validation

- [ ] Je connais les 4 niveaux de maturité de Richardson
- [ ] Mes URL utilisent des noms au pluriel, en kebab-case, sans verbes
- [ ] J'utilise la bonne méthode HTTP pour chaque opération (GET, POST, PUT, PATCH, DELETE)
- [ ] Je retourne le bon code de statut (200, 201, 204, 400, 404, 422)
- [ ] Je comprends la différence entre PUT et PATCH
- [ ] Je comprends le concept d'idempotence
- [ ] Je sais ce qu'est HATEOAS et quand l'utiliser

---

## Exercice Pratique

**Énoncé** : Crée une API REST complète pour gérer une bibliothèque de livres.

**Spécifications** :

- Entité `Book` avec les champs : `id`, `title`, `author`, `isbn`, `publishedYear`, `genre`
- Les 5 opérations CRUD : lister, afficher, créer, modifier (PATCH), supprimer
- Sous-ressource `Review` (avis) liée à `Book` : lister les avis d'un livre, ajouter un avis
- Codes de statut corrects pour chaque opération
- Validation : `title` et `author` obligatoires, `isbn` unique (retourner 409 si doublon)

**Indications** :

- URL de base : `/api/books`
- Sous-ressource : `/api/books/{id}/reviews`
- Utilise les attributs de route Symfony `#[Route]`
- Retourne 201 à la création, 204 à la suppression
- Retourne 422 si les champs obligatoires sont manquants

**Résultat attendu** : une API fonctionnelle testable avec curl, qui respecte toutes les conventions REST vues dans cette fiche.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/Controller/Api/BookController.php

namespace App\Controller\Api;

use App\Entity\Book;
use App\Repository\BookRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/books')]
class BookController extends AbstractController
{
    // GET /api/books → Liste tous les livres
    #[Route('', methods: ['GET'])]
    public function index(BookRepository $repository): JsonResponse
    {
        $books = $repository->findAll();

        $data = array_map(fn(Book $book) => [
            'id' => $book->getId(),
            'title' => $book->getTitle(),
            'author' => $book->getAuthor(),
            'isbn' => $book->getIsbn(),
            'publishedYear' => $book->getPublishedYear(),
            'genre' => $book->getGenre(),
        ], $books);

        return $this->json($data, Response::HTTP_OK);
    }

    // GET /api/books/{id} → Affiche un livre
    #[Route('/{id}', methods: ['GET'])]
    public function show(Book $book): JsonResponse
    {
        return $this->json([
            'id' => $book->getId(),
            'title' => $book->getTitle(),
            'author' => $book->getAuthor(),
            'isbn' => $book->getIsbn(),
            'publishedYear' => $book->getPublishedYear(),
            'genre' => $book->getGenre(),
        ], Response::HTTP_OK);
    }

    // POST /api/books → Crée un livre
    #[Route('', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        BookRepository $repository
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true);

        // Validation : JSON invalide → 400
        if ($payload === null) {
            return $this->json(
                ['error' => 'JSON invalide'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // Validation : champs obligatoires → 422
        if (empty($payload['title']) || empty($payload['author'])) {
            return $this->json(
                ['error' => 'Les champs title et author sont obligatoires'],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        // Validation : ISBN unique → 409
        if (!empty($payload['isbn'])) {
            $existing = $repository->findOneBy(['isbn' => $payload['isbn']]);
            if ($existing !== null) {
                return $this->json(
                    ['error' => 'Un livre avec cet ISBN existe déjà'],
                    Response::HTTP_CONFLICT
                );
            }
        }

        $book = new Book();
        $book->setTitle($payload['title']);
        $book->setAuthor($payload['author']);
        $book->setIsbn($payload['isbn'] ?? null);
        $book->setPublishedYear($payload['publishedYear'] ?? null);
        $book->setGenre($payload['genre'] ?? null);

        $em->persist($book);
        $em->flush();

        // 201 Created
        return $this->json(
            ['id' => $book->getId(), 'title' => $book->getTitle()],
            Response::HTTP_CREATED
        );
    }

    // PATCH /api/books/{id} → Modifie partiellement un livre
    #[Route('/{id}', methods: ['PATCH'])]
    public function update(
        Book $book,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true);

        if ($payload === null) {
            return $this->json(
                ['error' => 'JSON invalide'],
                Response::HTTP_BAD_REQUEST
            );
        }

        // PATCH : on ne modifie que les champs présents
        if (isset($payload['title'])) {
            $book->setTitle($payload['title']);
        }
        if (isset($payload['author'])) {
            $book->setAuthor($payload['author']);
        }
        if (isset($payload['isbn'])) {
            $book->setIsbn($payload['isbn']);
        }
        if (isset($payload['publishedYear'])) {
            $book->setPublishedYear($payload['publishedYear']);
        }
        if (isset($payload['genre'])) {
            $book->setGenre($payload['genre']);
        }

        $em->flush();

        return $this->json(
            ['id' => $book->getId(), 'title' => $book->getTitle()],
            Response::HTTP_OK
        );
    }

    // DELETE /api/books/{id} → Supprime un livre
    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(
        Book $book,
        EntityManagerInterface $em
    ): JsonResponse {
        $em->remove($book);
        $em->flush();

        // 204 No Content
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
```

```php
<?php
// src/Controller/Api/BookReviewController.php

namespace App\Controller\Api;

use App\Entity\Book;
use App\Entity\Review;
use App\Repository\ReviewRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Sous-ressource : les avis sont liés à un livre
#[Route('/api/books/{bookId}/reviews')]
class BookReviewController extends AbstractController
{
    // GET /api/books/5/reviews → Liste les avis du livre 5
    #[Route('', methods: ['GET'])]
    public function index(
        int $bookId,
        ReviewRepository $repository
    ): JsonResponse {
        $reviews = $repository->findBy(['book' => $bookId]);

        $data = array_map(fn(Review $review) => [
            'id' => $review->getId(),
            'rating' => $review->getRating(),
            'comment' => $review->getComment(),
            'author' => $review->getAuthor(),
        ], $reviews);

        return $this->json($data, Response::HTTP_OK);
    }

    // POST /api/books/5/reviews → Ajoute un avis au livre 5
    #[Route('', methods: ['POST'])]
    public function create(
        Book $book,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true);

        if ($payload === null) {
            return $this->json(
                ['error' => 'JSON invalide'],
                Response::HTTP_BAD_REQUEST
            );
        }

        $review = new Review();
        $review->setRating($payload['rating'] ?? 0);
        $review->setComment($payload['comment'] ?? '');
        $review->setAuthor($payload['author'] ?? 'Anonyme');
        $review->setBook($book);

        $em->persist($review);
        $em->flush();

        return $this->json(
            ['id' => $review->getId()],
            Response::HTTP_CREATED
        );
    }
}
```

---

## Navigation

→ Fiche suivante : **[02 - Pagination, filtrage et tri](02-pagination-filtrage-tri.md)**
