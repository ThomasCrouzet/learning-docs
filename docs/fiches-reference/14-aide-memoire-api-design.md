---
tags:
  - Référence
  - API
description: "Aide-mémoire API Design : REST, codes HTTP, OpenAPI et GraphQL"
estimated_time: "20 min"
fiche_number: 14
total_fiches: 18
cursus: "Fiches de référence"
---

# Aide-mémoire API Design

> **En bref** : Aide-mémoire API Design. Lecture estimée : 20 min.

Fiche de référence rapide pour la conception d'API : méthodes HTTP, codes de retour, conventions REST, OpenAPI et GraphQL.

---

## Méthodes HTTP

| Méthode | Action | Idempotente | Corps |
| ------- | ------ | ----------- | ----- |
| `GET` | Lire une ressource | Oui | Non |
| `POST` | Créer une ressource | Non | Oui |
| `PUT` | Remplacer entièrement | Oui | Oui |
| `PATCH` | Modifier partiellement | Non | Oui |
| `DELETE` | Supprimer | Oui | Non |

---

## Codes de retour HTTP

### 2xx - Succès

| Code | Signification | Quand l'utiliser |
| ---- | ------------- | ---------------- |
| `200` | OK | GET, PUT, PATCH réussis |
| `201` | Created | POST réussi (ressource créée) |
| `204` | No Content | DELETE réussi |

### 4xx - Erreur client

| Code | Signification | Quand l'utiliser |
| ---- | ------------- | ---------------- |
| `400` | Bad Request | JSON mal formé ou invalide |
| `401` | Unauthorized | Pas de token ou token invalide |
| `403` | Forbidden | Authentifié mais non autorisé |
| `404` | Not Found | Ressource inexistante |
| `409` | Conflict | Doublon, violation d'unicité |
| `422` | Unprocessable Entity | Validation des données échouée |

### 5xx - Erreur serveur

| Code | Signification |
| ---- | ------------- |
| `500` | Internal Server Error |

---

## Conventions REST

### Nommage des endpoints

| Règle | Correct | Incorrect |
| ----- | ------- | --------- |
| Noms au pluriel | `/articles` | `/article` |
| Pas de verbes dans l'URL | `/articles/5` | `/getArticle/5` |
| Kebab-case | `/blog-posts` | `/blogPosts` |
| Minuscules | `/articles` | `/Articles` |
| Hiérarchie par slash | `/articles/5/comments` | `/articleComments?id=5` |

### Routes CRUD standard

```text
GET    /api/articles           Liste
GET    /api/articles/{id}      Détail
POST   /api/articles           Créer
PATCH  /api/articles/{id}      Modifier
PUT    /api/articles/{id}      Remplacer
DELETE /api/articles/{id}      Supprimer
```

### Sous-ressources

```text
GET    /api/articles/5/comments        Liste des commentaires
POST   /api/articles/5/comments        Ajouter un commentaire
DELETE /api/articles/5/comments/12     Supprimer un commentaire
```

---

## Pagination

### Offset (par page)

```text
GET /api/articles?page=2&limit=20
```

### Cursor (par curseur)

```text
GET /api/articles?limit=20&after=abc123
```

| Offset | Cursor |
| ------ | ------ |
| Accès direct à une page | Performances constantes |
| Lent sur grands offsets | Pas d'accès direct par page |
| Instable si données changent | Stable avec données changeantes |

---

## Filtrage et tri

| Type | Exemple |
| ---- | ------- |
| Égalité | `?status=published` |
| Recherche partielle | `?title=symfony` |
| Plage | `?minPrice=10&maxPrice=50` |
| Valeurs multiples | `?genre=php,javascript` |
| Booléen | `?published=true` |
| Date | `?createdAfter=2026-01-01` |
| Tri descendant | `?sort=-createdAt` |
| Tri multiple | `?sort=status,-createdAt` |

---

## Headers courants

| Header | Rôle | Exemple |
| ------ | ---- | ------- |
| `Content-Type` | Format du corps | `application/json` |
| `Accept` | Format attendu | `application/json` |
| `Authorization` | Authentification | `Bearer eyJhbG...` |
| `X-Total-Count` | Nombre total d'éléments | `243` |
| `Deprecation` | API dépréciée | `true` |
| `Sunset` | Date de retrait | `Sat, 01 Jan 2027 00:00:00 GMT` |

---

## Format d'erreur (RFC 9457, anciennement RFC 7807)

```json
{
  "type": "https://api.example.com/errors/validation-failed",
  "title": "Validation des données échouée",
  "status": 422,
  "detail": "Le champ 'email' n'est pas valide.",
  "violations": [
    {
      "field": "email",
      "message": "Adresse email invalide.",
      "code": "EMAIL_INVALID"
    }
  ]
}
```

Content-Type : `application/problem+json`

---

## OpenAPI (structure minimale)

```yaml
openapi: "3.1.0"
info:
  title: "Mon API"
  version: "1.0.0"
paths:
  /api/articles:
    get:
      summary: "Lister les articles"
      tags: ["Articles"]
      responses:
        "200":
          description: "Liste des articles"
          content:
            application/json:
              schema:
                type: "array"
                items:
                  $ref: "#/components/schemas/Article"
components:
  schemas:
    Article:
      type: "object"
      properties:
        id: { type: "integer" }
        title: { type: "string" }
```

---

## API Platform (Symfony)

```php
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch(),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['book:read']],
    denormalizationContext: ['groups' => ['book:write']],
)]
#[ApiFilter(SearchFilter::class, properties: ['title' => 'partial'])]
#[ApiFilter(OrderFilter::class, properties: ['title', 'createdAt'])]
class Book { ... }
```

| Filtre | Exemple d'URL |
| ------ | ------------- |
| `SearchFilter` (partial) | `?title=symfony` |
| `BooleanFilter` | `?published=true` |
| `RangeFilter` | `?price[gte]=10&price[lte]=50` |
| `DateFilter` | `?createdAt[after]=2026-01-01` |
| `OrderFilter` | `?order[title]=asc` |
| `ExistsFilter` | `?isbn[exists]=true` |

---

## GraphQL - Syntaxe rapide

### Query (lecture)

```graphql
query {
  book(id: "/api/books/1") {
    title
    author
    reviews { rating, comment }
  }
}
```

### Mutation (écriture)

```graphql
mutation {
  createBook(title: "Clean Code", author: "Robert C. Martin") {
    id
    title
  }
}
```

### Types scalaires

| Type | Description |
| ---- | ----------- |
| `Int` | Entier 32 bits |
| `Float` | Nombre décimal |
| `String` | Chaîne UTF-8 |
| `Boolean` | `true` / `false` |
| `ID` | Identifiant unique |

### Modificateurs de type

| Syntaxe | Signification |
| ------- | ------------- |
| `String` | Nullable |
| `String!` | Non-nullable |
| `[String!]!` | Liste non-nullable de strings non-nullables |

---

## Pièges courants

| Piège | Solution |
| ----- | -------- |
| Verbes dans les URLs | Utiliser les méthodes HTTP pour l'action |
| `Content-Type: application/json` avec API Platform | Utiliser `application/ld+json` |
| Exposer tous les champs sans groupes de sérialisation | Toujours définir `normalizationContext` |
| Chercher un controller dans API Platform | Utiliser les State Processors |
| Versionner pour un changement mineur | Réserver le versioning aux breaking changes |
| Oublier le `errors` dans les réponses GraphQL | Les erreurs d'exécution restent souvent en HTTP 200 ; parse/validation : typiquement 400 (GraphQL over HTTP) |
| Utiliser des entiers au lieu d'IRI en GraphQL | Format : `"/api/books/1"` pas `1` |

---

## Liens utiles

- [01 - Principes REST avancés](../12-api-design/01-principes-rest-avances.md)
- [02 - Pagination et filtrage](../12-api-design/02-pagination-filtrage-tri.md)
- [03 - Gestion des erreurs](../12-api-design/03-gestion-erreurs-api.md)
- [04 - OpenAPI](../12-api-design/04-openapi-swagger.md)
- [05 - API Platform](../12-api-design/05-api-platform-introduction.md)
- [09 - GraphQL](../12-api-design/09-introduction-graphql.md)

---

## Navigation

← Fiche précédente : **[Aide-mémoire CI/CD](13-aide-memoire-cicd.md)**

→ Fiche suivante : **[Aide-mémoire Redis](15-aide-memoire-redis.md)**
