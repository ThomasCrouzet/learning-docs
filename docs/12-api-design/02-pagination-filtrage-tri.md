---
tags:
  - API
  - Intermédiaire
  - Pratique
description: "Implémenter la pagination, le filtrage et le tri dans une API REST Symfony."
estimated_time: "75 min"
fiche_number: 2
total_fiches: 10
cursus: "API Design et Documentation"
id: "web.api-design.pagination-filtrage-tri"
course_id: "web.api-design"
content_type: "lesson"
order: 2
---

# 02 - Pagination, filtrage et tri

> **En bref** : Cette fiche couvre la pagination (offset et cursor), le filtrage par query parameters, le tri multi-critères et les headers de réponse paginée dans une API REST Symfony. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche **[01 - Principes REST avancés](01-principes-rest-avances.md)**
- Connaître Doctrine ORM et les repositories (fiche **[08 - Repository et CRUD](../03-symfony/08-repository-crud.md)**)
- Savoir créer un contrôleur API Symfony

## Objectif de cette fiche

À la fin de cette fiche, tu sauras implémenter la pagination offset et cursor, ajouter des filtres par query parameters, trier les résultats sur plusieurs critères, et enrichir tes réponses avec les headers de pagination standards.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la pagination ?

**Définition** : La pagination est une technique qui consiste à diviser un ensemble de résultats en pages de taille fixe. Au lieu de retourner 10 000 articles en une seule réponse, on retourne 20 articles par page.

**Le problème que la pagination résout** :

Sans pagination, voici les problèmes rencontrés :

1. **Performance** : charger 10 000 résultats en une seule requête est lent pour le serveur et pour le client.
2. **Consommation mémoire** : le serveur doit charger tous les objets en mémoire pour les sérialiser.
3. **Bande passante** : transférer une réponse JSON de plusieurs mégaoctets est inutile si l'utilisateur ne consulte que les 20 premiers résultats.

**Comment la pagination résout ces problèmes** :

| Problème | Solution apportée par la pagination |
| -------- | ----------------------------------- |
| Performance | Le serveur ne charge que les résultats de la page demandée |
| Consommation mémoire | Seulement 20 objets en mémoire au lieu de 10 000 |
| Bande passante | La réponse fait quelques Ko au lieu de plusieurs Mo |

**Analogie concrète** : La pagination fonctionne comme un livre. Tu ne lis pas les 500 pages d'un coup. Tu ouvres à la page 42 et tu lis les 20 lignes de cette page. Si tu veux la suite, tu tournes la page.

**Ce que la pagination n'est PAS** :

- La pagination n'est pas un cache. Un cache stocke des données pour les réutiliser. La pagination découpe les résultats en morceaux.
- La pagination n'est pas du filtrage. Le filtrage réduit le nombre total de résultats. La pagination découpe le résultat (filtré ou non) en pages.

---

### Pagination offset vs cursor

**Définition** : Il existe deux stratégies principales de pagination. La pagination offset utilise un numéro de page ou un décalage (offset). La pagination cursor utilise un identifiant de référence pour récupérer les éléments suivants.

**Pagination offset** :

```text
GET /api/articles?page=1&limit=20   → Articles 1 à 20
GET /api/articles?page=2&limit=20   → Articles 21 à 40
GET /api/articles?page=3&limit=20   → Articles 41 à 60
```

Le serveur calcule : `OFFSET = (page - 1) * limit`. Pour la page 3 avec un limit de 20, le serveur saute les 40 premiers résultats.

**Pagination cursor** :

```text
GET /api/articles?limit=20                    → Articles 1 à 20 (cursor: "abc123")
GET /api/articles?limit=20&after=abc123       → Articles 21 à 40 (cursor: "def456")
GET /api/articles?limit=20&after=def456       → Articles 41 à 60 (cursor: "ghi789")
```

Le serveur utilise le cursor (souvent l'id du dernier élément encodé) pour savoir où reprendre.

**Comparaison offset vs cursor** :

| Critère | Offset | Cursor |
| ------- | ------ | ------ |
| Simplicité | Simple à implémenter | Plus complexe |
| Accès direct à une page | Oui (`?page=42`) | Non (il faut parcourir depuis le début) |
| Performance sur gros volumes | Se dégrade (OFFSET 100000 est lent) | Stable (utilise un index) |
| Données qui changent | Résultats incohérents si des éléments sont ajoutés/supprimés entre deux pages | Résultats cohérents |
| Cas d'usage typique | Back-office, admin, listes statiques | Flux en temps réel, infinite scroll |

**Analogie concrète** : La pagination offset fonctionne comme numéroter les pages d'un livre. Tu peux sauter à la page 42 directement. La pagination cursor fonctionne comme un marque-page. Tu sais reprendre là où tu t'es arrêté, mais tu ne peux pas sauter à un endroit précis.

---

Le diagramme suivant compare les deux stratégies de pagination : offset (accès direct par numéro de page) et cursor (parcours séquentiel par identifiant).

<div class="diagram-design">
<p><a href="../../diagrams/12-api-design-02-pagination-filtrage-tri-1.html">Pagination offset vs cursor (HTML + SVG)</a></p>
<iframe src="../../diagrams/12-api-design-02-pagination-filtrage-tri-1.html" title="Pagination offset vs cursor" style="width:100%;min-height:688px;border:0;background:transparent"></iframe>
</div>

### Filtrage par query parameters

**Définition** : Le filtrage permet au client de restreindre les résultats retournés par l'API selon des critères précis. Les critères sont passés en query parameters dans l'URL.

**Le problème que le filtrage résout** :

Sans filtrage, voici les problèmes rencontrés :

1. **Données inutiles** : le client reçoit tous les résultats alors qu'il en veut seulement une partie.
2. **Filtrage côté client** : le client doit charger toutes les données puis les filtrer localement, ce qui est lent.

**Conventions de filtrage** :

| Type de filtre | Exemple d'URL | SQL équivalent |
| -------------- | ------------- | -------------- |
| Égalité exacte | `?status=published` | `WHERE status = 'published'` |
| Recherche partielle | `?title=symfony` | `WHERE title LIKE '%symfony%'` |
| Plage de valeurs | `?minPrice=10&maxPrice=50` | `WHERE price BETWEEN 10 AND 50` |
| Valeurs multiples | `?genre=php,javascript` | `WHERE genre IN ('php', 'javascript')` |
| Existence | `?hasComments=true` | `WHERE comment_count > 0` |
| Date | `?createdAfter=2026-01-01` | `WHERE created_at > '2026-01-01'` |

**Ce que le filtrage n'est PAS** :

- Le filtrage n'est pas de la recherche full-text. Un filtre `?title=symfony` fait un LIKE simple. La recherche full-text utilise des index spécialisés (tsvector en PostgreSQL).
- Le filtrage n'est pas de la pagination. Le filtrage réduit le nombre total de résultats. La pagination découpe les résultats filtrés en pages.

---

### Tri multi-critères

**Définition** : Le tri permet au client de choisir l'ordre des résultats retournés par l'API. Le tri peut s'appliquer sur un ou plusieurs champs, en ordre ascendant ou descendant.

**Conventions courantes** :

```text
# Tri simple : par date de création, descendant
GET /api/articles?sort=-createdAt

# Tri multi-critères : d'abord par statut (ascendant), puis par date (descendant)
GET /api/articles?sort=status,-createdAt
```

Le préfixe `-` signifie ordre descendant (DESC). Pas de préfixe signifie ascendant (ASC).

**Autre convention (plus explicite)** :

```text
GET /api/articles?sortBy=createdAt&sortOrder=desc
```

**Ce que le tri n'est PAS** :

- Le tri n'est pas du filtrage. Le tri change l'ordre des résultats. Le filtrage change quels résultats sont retournés.

---

### Headers de pagination

**Définition** : Les headers HTTP de pagination fournissent des métadonnées sur la pagination (nombre total de résultats, liens vers les pages suivante/précédente) sans encombrer le body de la réponse.

**Headers standards** :

| Header | Description | Exemple |
| ------ | ----------- | ------- |
| `X-Total-Count` | Nombre total de résultats (avant pagination) | `X-Total-Count: 243` |
| `X-Page` | Page actuelle | `X-Page: 3` |
| `X-Per-Page` | Nombre de résultats par page | `X-Per-Page: 20` |
| `Link` | Liens vers les pages (standard RFC 8288) | Voir ci-dessous |

**Format du header Link (RFC 8288)** :

```text
Link: <https://api.example.com/articles?page=4&limit=20>; rel="next",
      <https://api.example.com/articles?page=2&limit=20>; rel="prev",
      <https://api.example.com/articles?page=1&limit=20>; rel="first",
      <https://api.example.com/articles?page=13&limit=20>; rel="last"
```

**Alternative : pagination dans le body** :

```json
{
    "data": [
        {"id": 1, "title": "Article 1"},
        {"id": 2, "title": "Article 2"}
    ],
    "meta": {
        "currentPage": 3,
        "perPage": 20,
        "totalItems": 243,
        "totalPages": 13
    },
    "links": {
        "first": "/api/articles?page=1&limit=20",
        "prev": "/api/articles?page=2&limit=20",
        "next": "/api/articles?page=4&limit=20",
        "last": "/api/articles?page=13&limit=20"
    }
}
```

**Comparaison headers vs body** :

| Headers | Body |
| ------- | ---- |
| Sépare les métadonnées des données | Tout est dans un seul JSON |
| Standard HTTP (RFC 8288) | Pas de standard universel |
| Plus difficile à lire pour le débutant | Plus facile à lire |
| Utilisé par GitHub, GitLab | Utilisé par API Platform, Laravel |

---

## Étapes Pratiques

### Étape 1 : Implémenter la pagination offset

Crée un service de pagination réutilisable.

```php
<?php
// src/Service/PaginationService.php

namespace App\Service;

use Doctrine\ORM\QueryBuilder;

// Ce service gère la pagination offset pour tout type d'entité
class PaginationService
{
    // Limite par défaut : 20 résultats par page
    private const DEFAULT_LIMIT = 20;
    // Limite maximale : le client ne peut pas demander plus de 100 résultats
    private const MAX_LIMIT = 100;

    // Applique la pagination à un QueryBuilder Doctrine
    // Retourne un tableau avec les résultats et les métadonnées
    public function paginate(
        QueryBuilder $qb,
        int $page = 1,
        int $limit = self::DEFAULT_LIMIT
    ): array {
        // Sécurité : la page doit être >= 1
        $page = max(1, $page);

        // Sécurité : le limit doit être entre 1 et MAX_LIMIT
        $limit = min(max(1, $limit), self::MAX_LIMIT);

        // On clone le QueryBuilder pour compter le total sans affecter la requête
        $countQb = clone $qb;
        $totalItems = (int) $countQb
            ->select('COUNT(DISTINCT ' . $qb->getRootAliases()[0] . '.id)')
            ->getQuery()
            ->getSingleScalarResult();

        // On calcule le nombre total de pages
        $totalPages = (int) ceil($totalItems / $limit);

        // On applique l'offset et la limite
        // OFFSET = (page - 1) * limit
        $results = $qb
            ->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit)
            ->getQuery()
            ->getResult();

        return [
            'data' => $results,
            'meta' => [
                'currentPage' => $page,
                'perPage' => $limit,
                'totalItems' => $totalItems,
                'totalPages' => $totalPages,
            ],
        ];
    }
}
```

**Résultat attendu** : un service réutilisable qui ajoute la pagination à n'importe quel QueryBuilder.

---

### Étape 2 : Utiliser la pagination dans le contrôleur

Modifie le contrôleur pour utiliser le service de pagination.

```php
<?php
// src/Controller/Api/ArticleController.php

namespace App\Controller\Api;

use App\Repository\ArticleRepository;
use App\Service\PaginationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/articles')]
class ArticleController extends AbstractController
{
    // GET /api/articles?page=2&limit=10
    #[Route('', methods: ['GET'])]
    public function index(
        Request $request,
        ArticleRepository $repository,
        PaginationService $pagination
    ): JsonResponse {
        // On lit les paramètres de pagination depuis l'URL
        // page=1 par défaut, limit=20 par défaut
        $page = $request->query->getInt('page', 1);
        $limit = $request->query->getInt('limit', 20);

        // On crée un QueryBuilder pour pouvoir ajouter pagination et filtres
        $qb = $repository->createQueryBuilder('a');

        // On applique la pagination
        $result = $pagination->paginate($qb, $page, $limit);

        // On sérialise les entités en tableaux
        $data = array_map(fn($article) => [
            'id' => $article->getId(),
            'title' => $article->getTitle(),
            'slug' => $article->getSlug(),
            'createdAt' => $article->getCreatedAt()->format('c'),
        ], $result['data']);

        // On construit la réponse avec métadonnées de pagination
        $response = $this->json([
            'data' => $data,
            'meta' => $result['meta'],
        ], Response::HTTP_OK);

        // On ajoute les headers de pagination
        $response->headers->set('X-Total-Count', (string) $result['meta']['totalItems']);
        $response->headers->set('X-Page', (string) $result['meta']['currentPage']);
        $response->headers->set('X-Per-Page', (string) $result['meta']['perPage']);

        return $response;
    }
}
```

**Résultat attendu** :

```bash
curl -i "http://localhost:8000/api/articles?page=2&limit=10"
```

```text
HTTP/1.1 200 OK
X-Total-Count: 43
X-Page: 2
X-Per-Page: 10
Content-Type: application/json

{
    "data": [
        {"id": 11, "title": "Article 11", "slug": "article-11", "createdAt": "2026-03-15T10:00:00+00:00"},
        {"id": 12, "title": "Article 12", "slug": "article-12", "createdAt": "2026-03-14T10:00:00+00:00"}
    ],
    "meta": {
        "currentPage": 2,
        "perPage": 10,
        "totalItems": 43,
        "totalPages": 5
    }
}
```

---

### Étape 3 : Ajouter le filtrage

Ajoute des filtres au contrôleur.

```php
<?php
// Dans ArticleController::index()

#[Route('', methods: ['GET'])]
public function index(
    Request $request,
    ArticleRepository $repository,
    PaginationService $pagination
): JsonResponse {
    $page = $request->query->getInt('page', 1);
    $limit = $request->query->getInt('limit', 20);

    $qb = $repository->createQueryBuilder('a');

    // Filtre par statut de publication
    // GET /api/articles?published=true
    if ($request->query->has('published')) {
        $published = $request->query->getBoolean('published');
        $qb->andWhere('a.published = :published')
           ->setParameter('published', $published);
    }

    // Filtre par recherche dans le titre
    // GET /api/articles?title=symfony
    if ($request->query->has('title')) {
        $title = $request->query->get('title');
        // LIKE %...% pour une recherche partielle
        $qb->andWhere('a.title LIKE :title')
           ->setParameter('title', '%' . $title . '%');
    }

    // Filtre par date de création (après une date donnée)
    // GET /api/articles?createdAfter=2026-01-01
    if ($request->query->has('createdAfter')) {
        $date = $request->query->get('createdAfter');
        $qb->andWhere('a.createdAt >= :createdAfter')
           ->setParameter('createdAfter', new \DateTimeImmutable($date));
    }

    // Filtre par genre (valeurs multiples séparées par des virgules)
    // GET /api/articles?genre=php,javascript
    if ($request->query->has('genre')) {
        $genres = explode(',', $request->query->get('genre'));
        $qb->andWhere('a.genre IN (:genres)')
           ->setParameter('genres', $genres);
    }

    $result = $pagination->paginate($qb, $page, $limit);

    $data = array_map(fn($article) => [
        'id' => $article->getId(),
        'title' => $article->getTitle(),
        'published' => $article->isPublished(),
        'createdAt' => $article->getCreatedAt()->format('c'),
    ], $result['data']);

    return $this->json([
        'data' => $data,
        'meta' => $result['meta'],
    ], Response::HTTP_OK);
}
```

**Résultat attendu** :

```bash
# Filtrer les articles publiés contenant "symfony" dans le titre
curl "http://localhost:8000/api/articles?published=true&title=symfony&page=1&limit=10"
```

```json
{
    "data": [
        {"id": 3, "title": "Débuter avec Symfony", "published": true, "createdAt": "2026-03-10T10:00:00+00:00"},
        {"id": 7, "title": "Symfony et Doctrine", "published": true, "createdAt": "2026-03-05T10:00:00+00:00"}
    ],
    "meta": {
        "currentPage": 1,
        "perPage": 10,
        "totalItems": 2,
        "totalPages": 1
    }
}
```

---

### Étape 4 : Ajouter le tri

Ajoute le tri multi-critères.

```php
<?php
// src/Service/SortService.php

namespace App\Service;

use Doctrine\ORM\QueryBuilder;

// Ce service gère le tri des résultats
class SortService
{
    // Liste blanche des champs autorisés pour le tri
    // Empêche l'injection de noms de colonnes arbitraires
    private const ALLOWED_FIELDS = [
        'id',
        'title',
        'createdAt',
        'publishedYear',
        'status',
    ];

    // Applique le tri à un QueryBuilder
    // Le paramètre $sort contient les critères séparés par des virgules
    // Préfixe - pour DESC, pas de préfixe pour ASC
    // Exemple : "title,-createdAt" → ORDER BY title ASC, createdAt DESC
    public function apply(QueryBuilder $qb, string $sort): void
    {
        // On récupère l'alias racine du QueryBuilder (ex: "a" pour Article)
        $alias = $qb->getRootAliases()[0];

        // On découpe les critères de tri
        $fields = explode(',', $sort);

        foreach ($fields as $field) {
            $field = trim($field);

            // On détecte l'ordre : - en préfixe = DESC
            $direction = 'ASC';
            if (str_starts_with($field, '-')) {
                $direction = 'DESC';
                // On retire le préfixe -
                $field = substr($field, 1);
            }

            // Sécurité : on n'autorise que les champs de la liste blanche
            if (!in_array($field, self::ALLOWED_FIELDS, true)) {
                // On ignore silencieusement les champs non autorisés
                continue;
            }

            $qb->addOrderBy($alias . '.' . $field, $direction);
        }
    }
}
```

Utilisation dans le contrôleur :

```php
<?php
// Dans ArticleController::index()

// Tri des résultats
// GET /api/articles?sort=-createdAt,title
if ($request->query->has('sort')) {
    $sortService->apply($qb, $request->query->get('sort'));
} else {
    // Tri par défaut si aucun tri n'est demandé
    $qb->orderBy('a.createdAt', 'DESC');
}
```

**Résultat attendu** :

```bash
# Trier par titre ascendant, puis par date descendante
curl "http://localhost:8000/api/articles?sort=title,-createdAt"
```

---

### Étape 5 : Implémenter la pagination cursor

Implémente la pagination cursor pour un flux en temps réel.

```php
<?php
// src/Service/CursorPaginationService.php

namespace App\Service;

use Doctrine\ORM\QueryBuilder;

// Ce service gère la pagination cursor (basée sur un identifiant)
class CursorPaginationService
{
    private const DEFAULT_LIMIT = 20;
    private const MAX_LIMIT = 100;

    // Applique la pagination cursor à un QueryBuilder
    // Le cursor est l'id du dernier élément de la page précédente
    public function paginate(
        QueryBuilder $qb,
        ?int $after = null,
        int $limit = self::DEFAULT_LIMIT
    ): array {
        $alias = $qb->getRootAliases()[0];
        $limit = min(max(1, $limit), self::MAX_LIMIT);

        // Si un cursor est fourni, on récupère les éléments APRÈS ce cursor
        if ($after !== null) {
            $qb->andWhere($alias . '.id > :after')
               ->setParameter('after', $after);
        }

        // On trie par id ASC pour garantir un ordre stable
        $qb->orderBy($alias . '.id', 'ASC');

        // On demande limit + 1 pour savoir s'il y a une page suivante
        $results = $qb
            ->setMaxResults($limit + 1)
            ->getQuery()
            ->getResult();

        // S'il y a plus de résultats que le limit, il y a une page suivante
        $hasNextPage = count($results) > $limit;

        // On retire l'élément en trop
        if ($hasNextPage) {
            array_pop($results);
        }

        // Le cursor de la prochaine page est l'id du dernier élément
        $nextCursor = null;
        if ($hasNextPage && count($results) > 0) {
            $lastItem = end($results);
            $nextCursor = $lastItem->getId();
        }

        return [
            'data' => $results,
            'meta' => [
                'hasNextPage' => $hasNextPage,
                'nextCursor' => $nextCursor,
                'perPage' => $limit,
            ],
        ];
    }
}
```

Utilisation dans le contrôleur :

```php
<?php
// GET /api/articles/stream?after=42&limit=20

#[Route('/stream', methods: ['GET'])]
public function stream(
    Request $request,
    ArticleRepository $repository,
    CursorPaginationService $cursorPagination
): JsonResponse {
    $after = $request->query->getInt('after', 0) ?: null;
    $limit = $request->query->getInt('limit', 20);

    $qb = $repository->createQueryBuilder('a');
    $result = $cursorPagination->paginate($qb, $after, $limit);

    $data = array_map(fn($article) => [
        'id' => $article->getId(),
        'title' => $article->getTitle(),
    ], $result['data']);

    return $this->json([
        'data' => $data,
        'meta' => $result['meta'],
    ], Response::HTTP_OK);
}
```

**Résultat attendu** :

```json
{
    "data": [
        {"id": 43, "title": "Article 43"},
        {"id": 44, "title": "Article 44"},
        {"id": 45, "title": "Article 45"}
    ],
    "meta": {
        "hasNextPage": true,
        "nextCursor": 45,
        "perPage": 20
    }
}
```

Le client appelle ensuite `GET /api/articles/stream?after=45&limit=20` pour la page suivante.

> **Limite de cette implémentation** : le curseur est basé sur l'`id` et le tri est forcé par `id ASC`. Si tu veux trier par un autre champ (par exemple `?sort=-createdAt`), le curseur `id > :after` ne fonctionne plus correctement. Il faut alors baser le curseur sur le champ trié (ex. `created_at < :after_date`), ce qui rend l'implémentation plus complexe. Pour les flux simples triés par id, cette approche est suffisante.

---

### Étape 6 : Ajouter le header Link (RFC 8288)

Ajoute le header Link standardisé à tes réponses paginées.

```php
<?php
// src/Service/LinkHeaderBuilder.php

namespace App\Service;

use Symfony\Component\HttpFoundation\Request;

// Ce service génère le header Link selon la RFC 8288
class LinkHeaderBuilder
{
    // Génère le header Link pour une réponse paginée
    public function build(
        Request $request,
        int $currentPage,
        int $totalPages,
        int $limit
    ): string {
        // On récupère l'URL de base (sans les paramètres page et limit)
        $baseUrl = $request->getSchemeAndHttpHost() . $request->getPathInfo();

        // On conserve les autres query parameters (filtres, tri)
        $params = $request->query->all();
        unset($params['page'], $params['limit']);

        $links = [];

        // Lien "first" : première page
        $links[] = $this->formatLink($baseUrl, $params, 1, $limit, 'first');

        // Lien "prev" : page précédente (si on n'est pas sur la première)
        if ($currentPage > 1) {
            $links[] = $this->formatLink(
                $baseUrl, $params, $currentPage - 1, $limit, 'prev'
            );
        }

        // Lien "next" : page suivante (si on n'est pas sur la dernière)
        if ($currentPage < $totalPages) {
            $links[] = $this->formatLink(
                $baseUrl, $params, $currentPage + 1, $limit, 'next'
            );
        }

        // Lien "last" : dernière page
        $links[] = $this->formatLink($baseUrl, $params, $totalPages, $limit, 'last');

        // On joint tous les liens avec des virgules
        return implode(', ', $links);
    }

    // Formate un lien individuel selon la RFC 8288
    private function formatLink(
        string $baseUrl,
        array $params,
        int $page,
        int $limit,
        string $rel
    ): string {
        $params['page'] = $page;
        $params['limit'] = $limit;
        $url = $baseUrl . '?' . http_build_query($params);

        return '<' . $url . '>; rel="' . $rel . '"';
    }
}
```

Utilisation dans le contrôleur :

```php
<?php
// Dans ArticleController::index(), après la pagination

// On ajoute le header Link si la pagination est active
if ($result['meta']['totalPages'] > 1) {
    $linkHeader = $linkHeaderBuilder->build(
        $request,
        $result['meta']['currentPage'],
        $result['meta']['totalPages'],
        $result['meta']['perPage']
    );
    $response->headers->set('Link', $linkHeader);
}
```

**Résultat attendu** :

```text
HTTP/1.1 200 OK
X-Total-Count: 43
Link: <http://localhost:8000/api/articles?published=true&page=1&limit=10>; rel="first",
  <http://localhost:8000/api/articles?published=true&page=1&limit=10>; rel="prev",
  <http://localhost:8000/api/articles?published=true&page=3&limit=10>; rel="next",
  <http://localhost:8000/api/articles?published=true&page=5&limit=10>; rel="last"
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `curl "http://localhost:8000/api/articles?page=2&limit=10"` | Page 2, 10 résultats |
| `curl "http://localhost:8000/api/articles?published=true"` | Filtrer les articles publiés |
| `curl "http://localhost:8000/api/articles?sort=-createdAt"` | Trier par date décroissante |
| `curl "http://localhost:8000/api/articles?title=symfony&sort=title"` | Filtrer et trier |
| `curl -i URL` | Afficher les headers (dont Link, X-Total-Count) |

---

## Pièges Fréquents

### Piège 1 : Ne pas limiter le paramètre limit

⚠️ **Problème** : Le client envoie `?limit=999999` et le serveur charge tous les résultats en mémoire.

✅ **Solution** : Toujours plafonner le limit avec une valeur maximale (par exemple 100).

```php
<?php
// ❌ Incorrect : pas de limite maximale
$limit = $request->query->getInt('limit', 20);

// ✅ Correct : on plafonne à 100
$limit = min($request->query->getInt('limit', 20), 100);
```

### Piège 2 : OFFSET élevé sur de gros volumes

⚠️ **Problème** : `SELECT * FROM articles OFFSET 100000 LIMIT 20` est très lent. La base de données doit scanner et ignorer 100 000 lignes.

✅ **Solution** : Pour de très gros volumes (> 100 000 résultats), utilise la pagination cursor au lieu de la pagination offset.

### Piège 3 : Permettre le tri sur n'importe quel champ

⚠️ **Problème** : Le client envoie `?sort=passwordHash` et peut trier sur des champs sensibles, ou le tri sur un champ non indexé ralentit la base de données.

✅ **Solution** : Utilise une liste blanche de champs autorisés pour le tri. Ignore les champs non autorisés.

```php
<?php
// ❌ Incorrect : tri sur n'importe quel champ
$qb->orderBy('a.' . $request->query->get('sort'), 'ASC');

// ✅ Correct : liste blanche
$allowed = ['title', 'createdAt', 'status'];
$field = $request->query->get('sort');
if (in_array($field, $allowed, true)) {
    $qb->orderBy('a.' . $field, 'ASC');
}
```

### Piège 4 : Oublier le tri par défaut

⚠️ **Problème** : Sans tri par défaut, l'ordre des résultats dépend de la base de données et peut varier entre deux requêtes identiques. La pagination devient incohérente.

✅ **Solution** : Toujours définir un tri par défaut (typiquement par id ou par date de création).

```php
<?php
// ✅ Toujours un tri par défaut
if (!$request->query->has('sort')) {
    $qb->orderBy('a.createdAt', 'DESC');
}
```

### Piège 5 : Ne pas exposer le total dans la réponse

⚠️ **Problème** : Le client ne sait pas combien de pages existent et ne peut pas afficher une barre de pagination.

✅ **Solution** : Inclure le total soit dans le body (`meta.totalItems`), soit dans un header (`X-Total-Count`).

---

## Checklist de Validation

- [ ] Ma pagination offset fonctionne avec les paramètres `page` et `limit`
- [ ] Le paramètre `limit` est plafonné à une valeur maximale
- [ ] Je sais implémenter la pagination cursor
- [ ] Mes filtres utilisent des query parameters dans l'URL
- [ ] Le tri utilise une liste blanche de champs autorisés
- [ ] Un tri par défaut est défini quand aucun tri n'est demandé
- [ ] Les headers `X-Total-Count` et `Link` sont présents dans les réponses paginées
- [ ] Je comprends quand utiliser offset vs cursor

---

## Exercice Pratique

**Énoncé** : Ajoute la pagination, le filtrage et le tri à l'API de livres créée dans la fiche précédente.

**Spécifications** :

- Pagination offset avec `page` et `limit` (par défaut : page 1, limit 20, maximum 50)
- Filtres : `author` (égalité exacte), `title` (recherche partielle), `genre` (valeurs multiples séparées par virgules), `minYear` et `maxYear` (plage)
- Tri : champs autorisés `title`, `publishedYear`, `author` (convention préfixe `-` pour DESC)
- Réponse avec `data`, `meta` (currentPage, perPage, totalItems, totalPages) et headers `X-Total-Count`, `Link`

**Indications** :

- Crée un service `PaginationService` réutilisable
- Crée un service `SortService` avec liste blanche
- Utilise `QueryBuilder` pour combiner filtres, tri et pagination
- Teste avec : `curl "http://localhost:8000/api/books?genre=fantasy,sf&minYear=2020&sort=-publishedYear&page=1&limit=10"`

**Résultat attendu** : une réponse JSON paginée, filtrée et triée, avec les métadonnées complètes.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/Controller/Api/BookController.php - méthode index complète

#[Route('', methods: ['GET'])]
public function index(
    Request $request,
    BookRepository $repository,
    PaginationService $pagination,
    SortService $sortService
): JsonResponse {
    $page = $request->query->getInt('page', 1);
    // Plafond à 50 pour cette API
    $limit = min($request->query->getInt('limit', 20), 50);

    $qb = $repository->createQueryBuilder('b');

    // Filtre par auteur (égalité exacte)
    if ($request->query->has('author')) {
        $qb->andWhere('b.author = :author')
           ->setParameter('author', $request->query->get('author'));
    }

    // Filtre par titre (recherche partielle)
    if ($request->query->has('title')) {
        $qb->andWhere('b.title LIKE :title')
           ->setParameter('title', '%' . $request->query->get('title') . '%');
    }

    // Filtre par genre (valeurs multiples)
    if ($request->query->has('genre')) {
        $genres = explode(',', $request->query->get('genre'));
        $qb->andWhere('b.genre IN (:genres)')
           ->setParameter('genres', $genres);
    }

    // Filtre par année minimum
    if ($request->query->has('minYear')) {
        $qb->andWhere('b.publishedYear >= :minYear')
           ->setParameter('minYear', $request->query->getInt('minYear'));
    }

    // Filtre par année maximum
    if ($request->query->has('maxYear')) {
        $qb->andWhere('b.publishedYear <= :maxYear')
           ->setParameter('maxYear', $request->query->getInt('maxYear'));
    }

    // Tri
    if ($request->query->has('sort')) {
        $sortService->apply($qb, $request->query->get('sort'));
    } else {
        $qb->orderBy('b.id', 'DESC');
    }

    // Pagination
    $result = $pagination->paginate($qb, $page, $limit);

    $data = array_map(fn($book) => [
        'id' => $book->getId(),
        'title' => $book->getTitle(),
        'author' => $book->getAuthor(),
        'isbn' => $book->getIsbn(),
        'publishedYear' => $book->getPublishedYear(),
        'genre' => $book->getGenre(),
    ], $result['data']);

    $response = $this->json([
        'data' => $data,
        'meta' => $result['meta'],
    ], Response::HTTP_OK);

    // Headers de pagination
    $response->headers->set(
        'X-Total-Count',
        (string) $result['meta']['totalItems']
    );

    return $response;
}
```

---

## Navigation

← Fiche précédente : **[01 - Principes REST avancés](01-principes-rest-avances.md)**

→ Fiche suivante : **[03 - Gestion des erreurs API](03-gestion-erreurs-api.md)**
