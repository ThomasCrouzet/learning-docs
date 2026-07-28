---
tags:
  - API
  - Avancé
  - Concept
description: "Stratégies de versioning d'API REST : URL, header, media type, migration, dépréciation et compatibilité ascendante."
estimated_time: "60 min"
fiche_number: 7
total_fiches: 10
cursus: "API Design et Documentation"
---

# 07 - Versioning d'API

> **En bref** : Cette fiche couvre les stratégies de versioning d'API REST (URL, header Accept-Version, media type), la migration entre versions, la dépréciation progressive, et les règles de compatibilité ascendante. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche **[01 - Principes REST avancés](01-principes-rest-avances.md)**
- Avoir lu la fiche **[04 - OpenAPI et Swagger](04-openapi-swagger.md)**
- Connaître le système de routes Symfony

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir une stratégie de versioning adaptée à ton API, implémenter le versioning par URL et par header dans Symfony, migrer les clients entre deux versions, et déprécier une ancienne version sans casser les clients existants.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le versioning d'API ?

**Définition** : Le versioning d'API est la pratique qui consiste à maintenir plusieurs versions d'une API en parallèle. Quand l'API évolue de façon incompatible (changement de format, suppression de champ, modification de comportement), une nouvelle version est créée pour ne pas casser les clients existants.

**Le problème que le versioning résout** :

Sans versioning, voici les problèmes rencontrés :

1. **Clients cassés** : un changement dans l'API (renommage de champ, suppression d'endpoint) casse tous les clients qui utilisent l'ancienne structure.
2. **Migration forcée** : tous les clients doivent mettre à jour leur code en même temps que l'API, ce qui est impossible quand il y a des dizaines de clients différents.
3. **Pas de période de transition** : impossible de tester la nouvelle version pendant que l'ancienne reste stable.

**Comment le versioning résout ces problèmes** :

| Problème | Solution apportée par le versioning |
| -------- | ----------------------------------- |
| Clients cassés | L'ancienne version continue de fonctionner |
| Migration forcée | Chaque client migre à son rythme |
| Pas de période de transition | Les deux versions coexistent pendant une période définie |

**Analogie concrète** : Le versioning fonctionne comme les mises à jour d'une application mobile. Quand une nouvelle version sort (v2), l'ancienne version (v1) continue de fonctionner pendant quelques mois. Les utilisateurs migrent progressivement. Un jour, la v1 est retirée.

**Ce que le versioning n'est PAS** :

- Le versioning n'est pas nécessaire pour tous les changements. Ajouter un champ optionnel ou un nouveau endpoint ne casse pas les clients existants. Seuls les changements incompatibles nécessitent une nouvelle version.
- Le versioning ne signifie pas maintenir 10 versions en parallèle. En pratique, on maintient 2 versions maximum (la version actuelle et la version précédente).

---

### Les trois stratégies de versioning

**Définition** : Il existe trois stratégies principales pour identifier la version d'une API : par URL, par header, et par media type.

**Stratégie 1 : Versioning par URL** :

```text
GET /api/v1/books
GET /api/v2/books
```

La version est intégrée dans le chemin de l'URL.

**Stratégie 2 : Versioning par header** :

```text
GET /api/books
Accept-Version: 1
---
GET /api/books
Accept-Version: 2
```

La version est spécifiée dans un header HTTP personnalisé.

**Stratégie 3 : Versioning par media type** :

```text
GET /api/books
Accept: application/vnd.library.v1+json
---
GET /api/books
Accept: application/vnd.library.v2+json
```

La version est encodée dans le type de contenu accepté.

**Comparaison des trois stratégies** :

| Critère | URL (/v1/) | Header (Accept-Version) | Media Type (vnd.) |
| ------- | ---------- | ----------------------- | ----------------- |
| Simplicité | Très simple | Moyen | Complexe |
| Visibilité | Visible dans l'URL | Invisible dans l'URL | Invisible dans l'URL |
| Cache HTTP | Facile (URL différente) | Nécessite Vary header | Nécessite Vary header |
| Testable avec navigateur | Oui | Non (besoin de curl) | Non (besoin de curl) |
| RESTful | Moins pur (la version n'est pas une ressource) | Plus pur | Le plus pur |
| Cas d'usage | API publiques, débutants | API internes | APIs très matures |
| Utilisé par | GitHub (partiellement), Stripe | Microsoft, Slack | GitHub (officiel) |

---

### Changements compatibles vs incompatibles

**Définition** : Un changement compatible (backward-compatible) ne casse pas les clients existants. Un changement incompatible (breaking change) nécessite une nouvelle version.

**Changements compatibles (pas de nouvelle version nécessaire)** :

| Changement | Pourquoi c'est compatible |
| ---------- | ------------------------- |
| Ajouter un champ dans la réponse | Les clients ignorent les champs inconnus |
| Ajouter un endpoint | Les clients n'appellent pas un endpoint qu'ils ne connaissent pas |
| Ajouter un paramètre optionnel | Les clients existants n'envoient pas ce paramètre |
| Assouplir une validation | Les données existantes restent valides |
| Ajouter un nouveau code d'erreur | Les clients gèrent déjà les erreurs HTTP génériques |

**Changements incompatibles (nouvelle version nécessaire)** :

| Changement | Pourquoi c'est incompatible |
| ---------- | --------------------------- |
| Renommer un champ | Les clients cherchent l'ancien nom |
| Supprimer un champ | Les clients s'attendent à le recevoir |
| Changer le type d'un champ | Les clients parsent le champ avec l'ancien type |
| Supprimer un endpoint | Les clients appellent un endpoint qui n'existe plus |
| Renforcer une validation | Les données existantes peuvent devenir invalides |
| Changer le format de date | Les clients parsent avec l'ancien format |

**Ce que la compatibilité ascendante n'est PAS** :

- La compatibilité ascendante ne signifie pas que tu ne peux jamais changer ton API. Tu peux la faire évoluer, mais les changements doivent être additifs (ajouter, pas supprimer ou modifier).

---

### Dépréciation

**Définition** : La dépréciation est le processus qui consiste à annoncer qu'un endpoint, un champ ou une version sera retiré dans le futur. Pendant la période de dépréciation, l'élément fonctionne encore mais les clients sont avertis qu'il faut migrer.

**Le problème que la dépréciation résout** :

Sans dépréciation :

1. **Surprise** : les clients découvrent qu'un endpoint a disparu du jour au lendemain.
2. **Pas de temps de migration** : les clients n'ont pas le temps de mettre à jour leur code.

**Comment signaler une dépréciation** :

| Méthode | Description | Exemple |
| ------- | ----------- | ------- |
| Header `Deprecation` | Header HTTP standard (RFC 8594) | `Deprecation: true` |
| Header `Sunset` | Date de retrait prévue | `Sunset: Sat, 01 Jan 2027 00:00:00 GMT` |
| Documentation OpenAPI | Attribut `deprecated: true` | Dans la spécification OpenAPI |
| Champ dans la réponse | Message d'avertissement | `"_deprecated": "Utilisez /v2/books"` |

---

## Étapes Pratiques

### Étape 1 : Implémenter le versioning par URL

Crée deux versions de l'API avec des préfixes d'URL différents.

```php
<?php
// src/Controller/Api/V1/BookController.php

namespace App\Controller\Api\V1;

use App\Entity\Book;
use App\Repository\BookRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Version 1 : le format de réponse original
#[Route('/api/v1/books')]
class BookController extends AbstractController
{
    // GET /api/v1/books/{id}
    #[Route('/{id}', methods: ['GET'])]
    public function show(Book $book): JsonResponse
    {
        // V1 : format original avec le champ "publishedYear"
        $data = [
            'id' => $book->getId(),
            'title' => $book->getTitle(),
            'author' => $book->getAuthor(),
            'isbn' => $book->getIsbn(),
            // V1 utilise "publishedYear" (entier)
            'publishedYear' => $book->getPublishedYear(),
            'genre' => $book->getGenre(),
        ];

        $response = $this->json($data, Response::HTTP_OK);

        // Header Deprecation : cette version est dépréciée
        $response->headers->set('Deprecation', 'true');
        // Header Sunset : date de retrait prévue
        $response->headers->set('Sunset', 'Sat, 01 Jan 2027 00:00:00 GMT');

        return $response;
    }

    // GET /api/v1/books
    #[Route('', methods: ['GET'])]
    public function index(BookRepository $repository): JsonResponse
    {
        $books = $repository->findAll();

        $data = array_map(fn(Book $book) => [
            'id' => $book->getId(),
            'title' => $book->getTitle(),
            'author' => $book->getAuthor(),
            'publishedYear' => $book->getPublishedYear(),
        ], $books);

        $response = $this->json($data, Response::HTTP_OK);
        $response->headers->set('Deprecation', 'true');
        $response->headers->set('Sunset', 'Sat, 01 Jan 2027 00:00:00 GMT');

        return $response;
    }
}
```

```php
<?php
// src/Controller/Api/V2/BookController.php

namespace App\Controller\Api\V2;

use App\Entity\Book;
use App\Repository\BookRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Version 2 : format de réponse mis à jour
#[Route('/api/v2/books')]
class BookController extends AbstractController
{
    // GET /api/v2/books/{id}
    #[Route('/{id}', methods: ['GET'])]
    public function show(Book $book): JsonResponse
    {
        // V2 : format modifié
        $data = [
            'id' => $book->getId(),
            'title' => $book->getTitle(),
            // V2 : "author" devient un objet (breaking change)
            'author' => [
                'name' => $book->getAuthor(),
            ],
            'isbn' => $book->getIsbn(),
            // V2 : "publishedYear" devient "publication" avec un objet
            'publication' => [
                'year' => $book->getPublishedYear(),
            ],
            'genre' => $book->getGenre(),
            // V2 : nouveau champ ajouté
            'metadata' => [
                'version' => 'v2',
                'createdAt' => $book->getCreatedAt()->format('c'),
            ],
        ];

        return $this->json($data, Response::HTTP_OK);
    }

    // GET /api/v2/books
    #[Route('', methods: ['GET'])]
    public function index(BookRepository $repository): JsonResponse
    {
        $books = $repository->findAll();

        $data = array_map(fn(Book $book) => [
            'id' => $book->getId(),
            'title' => $book->getTitle(),
            'author' => [
                'name' => $book->getAuthor(),
            ],
            'publication' => [
                'year' => $book->getPublishedYear(),
            ],
        ], $books);

        return $this->json($data, Response::HTTP_OK);
    }
}
```

**Résultat attendu** :

```bash
# V1 (dépréciée)
curl -i http://localhost:8000/api/v1/books/1
```

```text
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Jan 2027 00:00:00 GMT

{"id":1,"title":"Clean Code","author":"Robert C. Martin","publishedYear":2008}
```

```bash
# V2 (actuelle)
curl http://localhost:8000/api/v2/books/1
```

```json
{
    "id": 1,
    "title": "Clean Code",
    "author": {"name": "Robert C. Martin"},
    "publication": {"year": 2008},
    "metadata": {"version": "v2", "createdAt": "2026-03-20T10:00:00+00:00"}
}
```

---

### Étape 2 : Implémenter le versioning par header

Utilise un EventListener pour router vers la bonne version selon le header.

```php
<?php
// src/EventListener/ApiVersionListener.php

namespace App\EventListener;

use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

// Ce listener lit le header Accept-Version et stocke la version
// dans les attributs de la requête pour utilisation ultérieure.
// Il ajoute aussi le header Vary: Accept-Version sur la réponse
// pour que les proxys et CDN n'utilisent pas une réponse v1 pour
// un client qui demande v2 (ou inversement).
class ApiVersionListener
{
    // Version par défaut si le header n'est pas fourni
    private const DEFAULT_VERSION = '2';
    // Versions supportées
    private const SUPPORTED_VERSIONS = ['1', '2'];

    // Priorité haute pour lire la version avant les autres listeners
    #[AsEventListener(priority: 100)]
    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();

        // On ne traite que les requêtes API
        if (!str_starts_with($request->getPathInfo(), '/api/')) {
            return;
        }

        // On lit le header Accept-Version
        $version = $request->headers->get(
            'Accept-Version',
            self::DEFAULT_VERSION
        );

        // On vérifie que la version est supportée
        if (!in_array($version, self::SUPPORTED_VERSIONS, true)) {
            $version = self::DEFAULT_VERSION;
        }

        // On stocke la version dans les attributs de la requête
        // Les contrôleurs peuvent y accéder avec $request->attributes->get()
        $request->attributes->set('api_version', $version);
    }

    // On définit Vary: Accept-Version sur toutes les réponses API
    // Sans ce header, un proxy peut servir une réponse v1 à un client v2
    #[AsEventListener]
    public function onKernelResponse(ResponseEvent $event): void
    {
        $request = $event->getRequest();

        if (!str_starts_with($request->getPathInfo(), '/api/')) {
            return;
        }

        $event->getResponse()->headers->set('Vary', 'Accept-Version');
    }
}
```

Utilisation dans un contrôleur unique :

```php
<?php
// src/Controller/Api/BookController.php

namespace App\Controller\Api;

use App\Entity\Book;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/books')]
class BookController extends AbstractController
{
    #[Route('/{id}', methods: ['GET'])]
    public function show(Book $book, Request $request): JsonResponse
    {
        // On récupère la version depuis les attributs de la requête
        $version = $request->attributes->get('api_version', '2');

        // On sérialise selon la version
        $data = match ($version) {
            '1' => $this->serializeV1($book),
            '2' => $this->serializeV2($book),
            default => $this->serializeV2($book),
        };

        $response = $this->json($data, Response::HTTP_OK);

        // Si le client utilise la v1, on ajoute les headers de dépréciation
        if ($version === '1') {
            $response->headers->set('Deprecation', 'true');
            $response->headers->set('Sunset', 'Sat, 01 Jan 2027 00:00:00 GMT');
        }

        return $response;
    }

    // Format V1 : structure plate
    private function serializeV1(Book $book): array
    {
        return [
            'id' => $book->getId(),
            'title' => $book->getTitle(),
            'author' => $book->getAuthor(),
            'publishedYear' => $book->getPublishedYear(),
        ];
    }

    // Format V2 : structure enrichie
    private function serializeV2(Book $book): array
    {
        return [
            'id' => $book->getId(),
            'title' => $book->getTitle(),
            'author' => ['name' => $book->getAuthor()],
            'publication' => ['year' => $book->getPublishedYear()],
            'metadata' => [
                'version' => 'v2',
                'createdAt' => $book->getCreatedAt()->format('c'),
            ],
        ];
    }
}
```

**Résultat attendu** :

```bash
# Sans header → version 2 (par défaut)
curl http://localhost:8000/api/books/1

# Avec header → version 1
curl -H "Accept-Version: 1" http://localhost:8000/api/books/1

# Avec header → version 2
curl -H "Accept-Version: 2" http://localhost:8000/api/books/1
```

---

### Étape 3 : Documenter la dépréciation dans OpenAPI

Marque les endpoints dépréciés dans la spécification OpenAPI.

```yaml
# openapi.yaml - extrait

paths:
  /api/v1/books:
    get:
      summary: "Lister les livres (V1)"
      # L'attribut deprecated signale que cet endpoint est déprécié
      deprecated: true
      description: |
        **DÉPRÉCIÉ** - Utilisez `/api/v2/books` à la place.
        Cet endpoint sera retiré le 1er janvier 2027.
      tags:
        - "Livres (V1 - Déprécié)"
      responses:
        "200":
          description: "Liste des livres (format V1)"

  /api/v2/books:
    get:
      summary: "Lister les livres (V2)"
      description: "Retourne la liste paginée des livres au format V2."
      tags:
        - "Livres"
      responses:
        "200":
          description: "Liste des livres (format V2)"
```

En PHP avec NelmioApiDocBundle :

```php
<?php
// Contrôleur V1 - marquer comme déprécié
#[OA\Get(
    summary: 'Lister les livres (V1)',
    description: 'DÉPRÉCIÉ - Utilisez /api/v2/books.',
    deprecated: true
)]
```

**Résultat attendu** : dans Swagger UI, les endpoints V1 sont barrés et marqués comme « Deprecated ».

---

### Étape 4 : Planifier le cycle de vie des versions

Crée un fichier de politique de versioning pour ton équipe.

```yaml
# docs/api-versioning-policy.yaml

# Politique de versioning de l'API Bibliothèque
policy:
  # Durée de support d'une version après le lancement de la suivante
  deprecation_period: "12 mois"

  # Nombre maximum de versions maintenues en parallèle
  max_concurrent_versions: 2

  # Processus de dépréciation
  steps:
    - step: 1
      action: "Annoncer la dépréciation"
      details: "Ajouter les headers Deprecation et Sunset sur la version N-1"
    - step: 2
      action: "Documenter la migration"
      details: "Publier un guide de migration V(N-1) → V(N)"
    - step: 3
      action: "Période de transition"
      details: "Les deux versions coexistent pendant 12 mois"
    - step: 4
      action: "Retrait"
      details: "La version N-1 retourne 410 Gone au lieu des données"

# Historique des versions
versions:
  - version: "1"
    released: "2025-06-01"
    deprecated: "2026-03-01"
    sunset: "2027-01-01"
    status: "deprecated"
  - version: "2"
    released: "2026-03-01"
    deprecated: null
    sunset: null
    status: "current"
```

---

### Étape 5 : Retirer une version (code 410 Gone)

Quand une version est retirée, retourne 410 Gone au lieu de 404 pour indiquer que l'endpoint a existé mais n'est plus disponible.

```php
<?php
// src/Controller/Api/V1/DeprecatedController.php

namespace App\Controller\Api\V1;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Ce contrôleur remplace tous les endpoints V1 après le retrait
#[Route('/api/v1')]
class DeprecatedController extends AbstractController
{
    // Toutes les requêtes V1 retournent 410 Gone
    #[Route('/{path}', requirements: ['path' => '.+'], methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])]
    public function gone(): JsonResponse
    {
        return $this->json([
            'type' => 'https://api.example.com/errors/version-retired',
            'title' => 'Version retirée',
            'status' => 410,
            'detail' => 'La version 1 de l\'API a été retirée. Utilisez /api/v2/ à la place.',
            'migration_guide' => 'https://api.example.com/docs/migration-v1-v2',
        ], Response::HTTP_GONE);
    }
}
```

**Résultat attendu** :

```bash
curl -i http://localhost:8000/api/v1/books
```

```text
HTTP/1.1 410 Gone
Content-Type: application/json

{
    "type": "https://api.example.com/errors/version-retired",
    "title": "Version retirée",
    "status": 410,
    "detail": "La version 1 de l'API a été retirée. Utilisez /api/v2/ à la place.",
    "migration_guide": "https://api.example.com/docs/migration-v1-v2"
}
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console debug:router \| grep v1` | Lister les routes de la version 1 |
| `php bin/console debug:router \| grep v2` | Lister les routes de la version 2 |
| `curl -i -H "Accept-Version: 1" URL` | Tester avec un header de version |
| `php bin/console debug:event-dispatcher kernel.request` | Lister les listeners de requête |

---

## Pièges Fréquents

### Piège 1 : Versionner trop tôt

⚠️ **Problème** : Tu crées une v2 pour un changement mineur (ajout d'un champ optionnel) alors que la v1 aurait suffi.

✅ **Solution** : Ne crée une nouvelle version que pour les changements incompatibles (breaking changes). Les ajouts de champs, endpoints ou paramètres optionnels sont compatibles.

### Piège 2 : Maintenir trop de versions

⚠️ **Problème** : Tu maintiens v1, v2, v3 et v4 en parallèle. Chaque correction de bug doit être appliquée 4 fois.

✅ **Solution** : Limite à 2 versions en parallèle maximum. Retire les versions obsolètes après la période de dépréciation.

### Piège 3 : Ne pas documenter le guide de migration

⚠️ **Problème** : Tu publies la v2 mais les clients ne savent pas quels changements ont été faits ni comment adapter leur code.

✅ **Solution** : Publie un guide de migration listant chaque changement incompatible avec l'ancien et le nouveau format.

```text
# Guide de migration V1 → V2

## Changements incompatibles

### 1. Le champ "author" est devenu un objet
- V1 : "author": "Robert C. Martin"
- V2 : "author": {"name": "Robert C. Martin"}

### 2. Le champ "publishedYear" a été renommé
- V1 : "publishedYear": 2008
- V2 : "publication": {"year": 2008}
```

### Piège 4 : Oublier les headers de dépréciation

⚠️ **Problème** : La v1 est dépréciée mais rien ne l'indique dans les réponses HTTP. Les clients ne sont pas avertis.

✅ **Solution** : Ajoute les headers `Deprecation: true` et `Sunset: <date>` sur tous les endpoints de la version dépréciée.

---

## Checklist de Validation

- [ ] Je sais différencier un changement compatible d'un changement incompatible
- [ ] Je connais les trois stratégies de versioning (URL, header, media type)
- [ ] J'ai implémenté le versioning par URL avec deux contrôleurs séparés
- [ ] J'ai implémenté le versioning par header avec un EventListener
- [ ] Les endpoints dépréciés ont les headers `Deprecation` et `Sunset`
- [ ] Les endpoints dépréciés sont marqués `deprecated: true` dans OpenAPI
- [ ] Je sais retirer une version avec le code 410 Gone
- [ ] J'ai un guide de migration documenté

---

## Exercice Pratique

**Énoncé** : Implémente le versioning de l'API de bibliothèque avec les deux stratégies (URL et header).

**Spécifications** :

- Version 1 (dépréciée) : format plat `{"author": "Nom", "publishedYear": 2008}`
- Version 2 (actuelle) : format enrichi `{"author": {"name": "Nom"}, "publication": {"year": 2008}, "createdAt": "2026-..."}`
- Stratégie URL : `/api/v1/books` et `/api/v2/books`
- Stratégie header : `Accept-Version: 1` ou `Accept-Version: 2` sur `/api/books`
- La v1 doit avoir les headers `Deprecation: true` et `Sunset`
- La spec OpenAPI doit marquer les endpoints v1 comme `deprecated`
- Si `Accept-Version` n'est pas fourni, la version par défaut est 2

**Indications** :

- Crée deux namespaces : `App\Controller\Api\V1` et `App\Controller\Api\V2`
- Crée un `ApiVersionListener` qui lit le header `Accept-Version`
- Dans le contrôleur principal (`/api/books`), utilise `$request->attributes->get('api_version')` pour choisir le format

**Résultat attendu** : les deux stratégies fonctionnent en parallèle. Les headers de dépréciation sont présents sur la v1.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

La solution complète est présentée dans les étapes pratiques 1 et 2 de cette fiche. Voici un résumé de la structure de fichiers :

```text
src/Controller/Api/
├── V1/
│   └── BookController.php       ← /api/v1/books (déprécié)
├── V2/
│   └── BookController.php       ← /api/v2/books (actuel)
└── BookController.php           ← /api/books (versioning par header)

src/EventListener/
└── ApiVersionListener.php       ← Lit le header Accept-Version
```

Tests complets :

```bash
# Stratégie URL - V1 (dépréciée)
curl -i http://localhost:8000/api/v1/books/1
# → 200 + headers Deprecation + Sunset + format V1

# Stratégie URL - V2 (actuelle)
curl http://localhost:8000/api/v2/books/1
# → 200 + format V2

# Stratégie header - V1
curl -H "Accept-Version: 1" http://localhost:8000/api/books/1
# → 200 + headers Deprecation + format V1

# Stratégie header - V2
curl -H "Accept-Version: 2" http://localhost:8000/api/books/1
# → 200 + format V2

# Stratégie header - pas de header (défaut = V2)
curl http://localhost:8000/api/books/1
# → 200 + format V2
```

---

## Navigation

← Fiche précédente : **[06 - API Platform - Avancé](06-api-platform-avance.md)**

→ Fiche suivante : **[08 - Authentification API](08-authentification-api.md)**
