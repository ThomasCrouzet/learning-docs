---
tags:
  - API
  - Intermédiaire
  - Pratique
description: "Documenter une API avec la spécification OpenAPI 3.1, Swagger UI et NelmioApiDocBundle dans Symfony."
estimated_time: "90 min"
fiche_number: 4
total_fiches: 10
cursus: "API Design et Documentation"
id: "web.api-design.openapi-swagger"
course_id: "web.api-design"
content_type: "lesson"
order: 4
---

# 04 - OpenAPI et Swagger

> **En bref** : Cette fiche couvre la spécification OpenAPI 3.1, l'écriture d'un fichier openapi.yaml, les paths, schémas, composants réutilisables, Swagger UI pour tester l'API, et la génération automatique avec NelmioApiDocBundle dans Symfony. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche **[01 - Principes REST avancés](01-principes-rest-avances.md)** (méthodes HTTP, codes de statut)
- Avoir lu la fiche **[03 - Gestion des erreurs API](03-gestion-erreurs-api.md)** (format des erreurs)
- Connaître le format YAML (syntaxe de base)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire un fichier OpenAPI complet décrivant ton API, utiliser Swagger UI pour tester les endpoints, configurer NelmioApiDocBundle pour générer la documentation automatiquement depuis le code Symfony, et comprendre les composants réutilisables (schémas, responses, parameters).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'OpenAPI ?

**Définition** : OpenAPI (anciennement Swagger Specification) est un standard de description d'API REST. C'est un fichier YAML ou JSON qui décrit de façon exhaustive les endpoints, les paramètres, les réponses et les modèles de données d'une API.

**Le problème qu'OpenAPI résout** :

Sans OpenAPI, voici les problèmes rencontrés :

1. **Documentation manuelle** : la documentation est écrite à la main, se désynchronise du code, et devient obsolète.
2. **Pas de contrat** : le front-end et le back-end n'ont pas de référence commune pour les formats de données.
3. **Tests manuels** : tester chaque endpoint nécessite d'écrire des requêtes curl à la main.

**Comment OpenAPI résout ces problèmes** :

| Problème | Solution apportée par OpenAPI |
| -------- | ----------------------------- |
| Documentation manuelle | La documentation est générée depuis le fichier de spécification |
| Pas de contrat | Le fichier OpenAPI sert de contrat entre front-end et back-end |
| Tests manuels | Swagger UI permet de tester les endpoints depuis le navigateur |

**Analogie concrète** : OpenAPI est comme le plan d'architecte d'une maison. Le plan décrit chaque pièce (endpoint), ses dimensions (paramètres), ses entrées/sorties (requête/réponse). L'entrepreneur (développeur front-end) peut construire sans avoir besoin de demander au client (développeur back-end) à chaque étape.

**Ce qu'OpenAPI n'est PAS** :

- OpenAPI n'est pas un framework. C'est un fichier de description. Il ne génère pas de code par défaut (même si des outils le peuvent).
- OpenAPI n'est pas limité à REST. La version 3.1 est alignée sur JSON Schema, ce qui la rend très flexible. Mais elle est principalement utilisée pour les API REST.

**Comparaison OpenAPI 3.0 vs 3.1** :

| OpenAPI 3.0 | OpenAPI 3.1 |
| ----------- | ----------- |
| Schémas « quasi JSON Schema » | Schémas 100% compatibles JSON Schema |
| `nullable: true` pour les champs null | `type: ["string", "null"]` |
| Pas de `$ref` dans certains endroits | `$ref` autorisé partout |
| Sortie en 2017 | Sortie en 2021 |

---

### Swagger UI

**Définition** : Swagger UI est une interface web interactive qui affiche la documentation OpenAPI et permet de tester les endpoints directement dans le navigateur.

**Le problème que Swagger UI résout** :

Sans Swagger UI :

1. **Documentation statique** : la documentation est un fichier texte que personne ne lit.
2. **Tests via curl** : tester un endpoint nécessite de taper une commande curl avec tous les headers et le body.

**Comment Swagger UI résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Documentation statique | Interface web interactive avec navigation par endpoint |
| Tests via curl | Formulaires pour remplir les paramètres et bouton « Try it out » |

**Ce que Swagger UI n'est PAS** :

- Swagger UI n'est pas un outil de test automatisé. C'est un outil de test manuel interactif. Pour les tests automatisés, utilise PHPUnit ou Postman.

---

### NelmioApiDocBundle

**Définition** : NelmioApiDocBundle est un bundle Symfony qui génère automatiquement la spécification OpenAPI depuis les attributs PHP de tes contrôleurs et entités. Il inclut aussi Swagger UI.

**Le problème que NelmioApiDocBundle résout** :

Sans ce bundle :

1. **Double travail** : tu écris le code PHP ET le fichier OpenAPI séparément.
2. **Désynchronisation** : le code change mais la documentation n'est pas mise à jour.

**Comment NelmioApiDocBundle résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Double travail | La documentation est générée depuis les attributs du code PHP |
| Désynchronisation | La documentation reflète toujours l'état actuel du code |

---

Le diagramme suivant montre le pipeline de documentation API : du code annoté vers la spécification OpenAPI, puis vers Swagger UI et la génération de clients.

<div class="diagram-design">
<p><a href="../../diagrams/12-api-design-04-openapi-swagger-1.html">NelmioApiDocBundle (HTML + SVG)</a></p>
<iframe src="../../diagrams/12-api-design-04-openapi-swagger-1.html" title="NelmioApiDocBundle" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

## Étapes Pratiques

### Étape 1 : Écrire un fichier OpenAPI basique

Crée un fichier `openapi.yaml` à la racine de ton projet.

```yaml
# openapi.yaml
# Ce fichier décrit l'API au format OpenAPI 3.1

# Version de la spécification OpenAPI utilisée
openapi: "3.1.0"

# Informations générales sur l'API
info:
  title: "API Bibliothèque"
  description: "API REST pour gérer une bibliothèque de livres."
  version: "1.0.0"
  contact:
    name: "Support API"
    email: "api@example.com"

# Serveurs disponibles
servers:
  # Serveur de développement local
  - url: "http://localhost:8000"
    description: "Serveur de développement"

# Les paths décrivent chaque endpoint de l'API
paths:
  # Endpoint pour la collection de livres
  /api/books:
    # Méthode GET : lister les livres
    get:
      summary: "Lister les livres"
      description: "Retourne la liste paginée de tous les livres."
      operationId: "getBooks"
      tags:
        - "Livres"
      # Les paramètres de query string
      parameters:
        - name: "page"
          in: "query"
          description: "Numéro de la page"
          required: false
          schema:
            type: "integer"
            default: 1
            minimum: 1
        - name: "limit"
          in: "query"
          description: "Nombre de résultats par page"
          required: false
          schema:
            type: "integer"
            default: 20
            minimum: 1
            maximum: 100
        - name: "sort"
          in: "query"
          description: "Champ de tri (préfixe - pour descendant)"
          required: false
          schema:
            type: "string"
            example: "-publishedYear"
      # Les réponses possibles
      responses:
        "200":
          description: "Liste des livres retournée avec succès"
          headers:
            X-Total-Count:
              description: "Nombre total de livres"
              schema:
                type: "integer"
          content:
            application/json:
              schema:
                type: "object"
                properties:
                  data:
                    type: "array"
                    items:
                      $ref: "#/components/schemas/BookSummary"
                  meta:
                    $ref: "#/components/schemas/PaginationMeta"

    # Méthode POST : créer un livre
    post:
      summary: "Créer un livre"
      description: "Crée un nouveau livre dans la bibliothèque."
      operationId: "createBook"
      tags:
        - "Livres"
      # Le corps de la requête
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BookCreate"
      responses:
        "201":
          description: "Livre créé avec succès"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/BookDetail"
        "400":
          description: "JSON invalide"
          content:
            application/problem+json:
              schema:
                $ref: "#/components/schemas/ProblemDetails"
        "422":
          description: "Données invalides"
          content:
            application/problem+json:
              schema:
                $ref: "#/components/schemas/ValidationError"
        "409":
          description: "ISBN déjà existant"
          content:
            application/problem+json:
              schema:
                $ref: "#/components/schemas/ProblemDetails"

  # Endpoint pour un livre spécifique
  /api/books/{id}:
    # Méthode GET : afficher un livre
    get:
      summary: "Afficher un livre"
      description: "Retourne les détails d'un livre par son identifiant."
      operationId: "getBook"
      tags:
        - "Livres"
      parameters:
        - name: "id"
          in: "path"
          description: "Identifiant unique du livre"
          required: true
          schema:
            type: "integer"
      responses:
        "200":
          description: "Détails du livre"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/BookDetail"
        "404":
          description: "Livre non trouvé"
          content:
            application/problem+json:
              schema:
                $ref: "#/components/schemas/ProblemDetails"

    # Méthode PATCH : modifier partiellement un livre
    patch:
      summary: "Modifier un livre"
      description: "Modifie partiellement un livre existant."
      operationId: "updateBook"
      tags:
        - "Livres"
      parameters:
        - name: "id"
          in: "path"
          required: true
          schema:
            type: "integer"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/BookUpdate"
      responses:
        "200":
          description: "Livre modifié avec succès"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/BookDetail"
        "404":
          description: "Livre non trouvé"
          content:
            application/problem+json:
              schema:
                $ref: "#/components/schemas/ProblemDetails"
        "422":
          description: "Données invalides"
          content:
            application/problem+json:
              schema:
                $ref: "#/components/schemas/ValidationError"

    # Méthode DELETE : supprimer un livre
    delete:
      summary: "Supprimer un livre"
      description: "Supprime un livre de la bibliothèque."
      operationId: "deleteBook"
      tags:
        - "Livres"
      parameters:
        - name: "id"
          in: "path"
          required: true
          schema:
            type: "integer"
      responses:
        "204":
          description: "Livre supprimé avec succès"
        "404":
          description: "Livre non trouvé"
          content:
            application/problem+json:
              schema:
                $ref: "#/components/schemas/ProblemDetails"

# Les composants réutilisables
components:
  # Les schemas décrivent la structure des données
  schemas:
    # Résumé d'un livre (utilisé dans les listes)
    BookSummary:
      type: "object"
      properties:
        id:
          type: "integer"
          example: 1
        title:
          type: "string"
          example: "Clean Code"
        author:
          type: "string"
          example: "Robert C. Martin"
        genre:
          type: ["string", "null"]
          example: "Programmation"

    # Détails complets d'un livre
    BookDetail:
      type: "object"
      properties:
        id:
          type: "integer"
          example: 1
        title:
          type: "string"
          example: "Clean Code"
        author:
          type: "string"
          example: "Robert C. Martin"
        isbn:
          type: ["string", "null"]
          example: "9780132350884"
        publishedYear:
          type: ["integer", "null"]
          example: 2008
        genre:
          type: ["string", "null"]
          example: "Programmation"

    # Données pour créer un livre
    BookCreate:
      type: "object"
      required:
        - "title"
        - "author"
      properties:
        title:
          type: "string"
          minLength: 1
          maxLength: 255
          example: "Clean Code"
        author:
          type: "string"
          minLength: 1
          maxLength: 255
          example: "Robert C. Martin"
        isbn:
          type: ["string", "null"]
          minLength: 10
          maxLength: 13
          example: "9780132350884"
        publishedYear:
          type: ["integer", "null"]
          example: 2008
        genre:
          type: ["string", "null"]
          example: "Programmation"

    # Données pour modifier un livre (tous les champs optionnels)
    BookUpdate:
      type: "object"
      properties:
        title:
          type: "string"
          minLength: 1
          maxLength: 255
        author:
          type: "string"
          minLength: 1
          maxLength: 255
        isbn:
          type: ["string", "null"]
        publishedYear:
          type: ["integer", "null"]
        genre:
          type: ["string", "null"]

    # Métadonnées de pagination
    PaginationMeta:
      type: "object"
      properties:
        currentPage:
          type: "integer"
          example: 1
        perPage:
          type: "integer"
          example: 20
        totalItems:
          type: "integer"
          example: 43
        totalPages:
          type: "integer"
          example: 3

    # Format d'erreur RFC 7807
    ProblemDetails:
      type: "object"
      properties:
        type:
          type: "string"
          format: "uri"
          example: "https://api.example.com/errors/not-found"
        title:
          type: "string"
          example: "Ressource non trouvée"
        status:
          type: "integer"
          example: 404
        detail:
          type: "string"
          example: "Le livre avec l'identifiant 99 n'existe pas."

    # Erreur de validation (extension de ProblemDetails)
    ValidationError:
      type: "object"
      properties:
        type:
          type: "string"
          format: "uri"
        title:
          type: "string"
        status:
          type: "integer"
          example: 422
        detail:
          type: "string"
        violations:
          type: "array"
          items:
            type: "object"
            properties:
              field:
                type: "string"
                example: "title"
              message:
                type: "string"
                example: "Le titre est obligatoire."
              code:
                type: "string"
                example: "FIELD_REQUIRED"
```

**Résultat attendu** : un fichier `openapi.yaml` complet qui décrit l'API de bibliothèque avec tous les endpoints, paramètres, réponses et schémas.

---

### Étape 2 : Installer et configurer NelmioApiDocBundle

Installe le bundle qui génère la documentation OpenAPI depuis le code Symfony.

```bash
# Installer NelmioApiDocBundle
composer require nelmio/api-doc-bundle
```

```bash
# Installer le composant Asset pour Swagger UI
composer require symfony/asset
```

Configure le bundle :

```yaml
# config/packages/nelmio_api_doc.yaml

nelmio_api_doc:
    documentation:
        # Informations générales de l'API
        info:
            title: "API Bibliothèque"
            description: "API REST pour gérer une bibliothèque de livres."
            version: "1.0.0"
        # Schéma de sécurité (pour la fiche 08)
        components:
            securitySchemes:
                Bearer:
                    type: "http"
                    scheme: "bearer"
                    bearerFormat: "JWT"
    areas:
        # On documente uniquement les routes commençant par /api/
        default:
            path_patterns:
                - "^/api/"
```

Ajoute la route pour Swagger UI :

```yaml
# config/routes/nelmio_api_doc.yaml

app.swagger_ui:
    path: /api/doc
    methods: GET
    defaults:
        _controller: nelmio_api_doc.controller.swagger_ui

app.swagger_json:
    path: /api/doc.json
    methods: GET
    defaults:
        _controller: nelmio_api_doc.controller.swagger
```

**Résultat attendu** : Swagger UI est accessible à `http://localhost:8000/api/doc`.

---

### Étape 3 : Annoter les contrôleurs avec les attributs OpenAPI

Ajoute les attributs OpenAPI directement dans le code PHP.

```php
<?php
// src/Controller/Api/BookController.php

namespace App\Controller\Api;

use App\Entity\Book;
use App\Repository\BookRepository;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/books')]
// Le tag regroupe tous les endpoints de ce contrôleur dans Swagger UI
#[OA\Tag(name: 'Livres')]
class BookController extends AbstractController
{
    // GET /api/books - Liste les livres
    #[Route('', methods: ['GET'])]
    #[OA\Get(
        summary: 'Lister les livres',
        description: 'Retourne la liste paginée de tous les livres.'
    )]
    #[OA\Parameter(
        name: 'page',
        in: 'query',
        description: 'Numéro de la page',
        schema: new OA\Schema(type: 'integer', default: 1)
    )]
    #[OA\Parameter(
        name: 'limit',
        in: 'query',
        description: 'Nombre de résultats par page (max 100)',
        schema: new OA\Schema(type: 'integer', default: 20)
    )]
    #[OA\Parameter(
        name: 'sort',
        in: 'query',
        description: 'Champ de tri (préfixe - pour descendant)',
        schema: new OA\Schema(type: 'string', example: '-publishedYear')
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste des livres',
        content: new OA\JsonContent(
            type: 'object',
            properties: [
                new OA\Property(
                    property: 'data',
                    type: 'array',
                    items: new OA\Items(ref: new Model(type: Book::class))
                ),
                new OA\Property(
                    property: 'meta',
                    type: 'object',
                    properties: [
                        new OA\Property(property: 'currentPage', type: 'integer'),
                        new OA\Property(property: 'perPage', type: 'integer'),
                        new OA\Property(property: 'totalItems', type: 'integer'),
                        new OA\Property(property: 'totalPages', type: 'integer'),
                    ]
                ),
            ]
        )
    )]
    public function index(
        Request $request,
        BookRepository $repository
    ): JsonResponse {
        // ... implémentation (voir fiches précédentes)
        return $this->json([]);
    }

    // POST /api/books - Créer un livre
    #[Route('', methods: ['POST'])]
    #[OA\Post(
        summary: 'Créer un livre',
        description: 'Crée un nouveau livre dans la bibliothèque.'
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['title', 'author'],
            properties: [
                new OA\Property(
                    property: 'title',
                    type: 'string',
                    example: 'Clean Code'
                ),
                new OA\Property(
                    property: 'author',
                    type: 'string',
                    example: 'Robert C. Martin'
                ),
                new OA\Property(
                    property: 'isbn',
                    type: 'string',
                    example: '9780132350884',
                    nullable: true
                ),
                new OA\Property(
                    property: 'publishedYear',
                    type: 'integer',
                    example: 2008,
                    nullable: true
                ),
                new OA\Property(
                    property: 'genre',
                    type: 'string',
                    example: 'Programmation',
                    nullable: true
                ),
            ]
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Livre créé avec succès',
        content: new OA\JsonContent(ref: new Model(type: Book::class))
    )]
    #[OA\Response(
        response: 400,
        description: 'JSON invalide'
    )]
    #[OA\Response(
        response: 422,
        description: 'Données invalides'
    )]
    #[OA\Response(
        response: 409,
        description: 'ISBN déjà existant'
    )]
    public function create(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        // ... implémentation
        return $this->json([], Response::HTTP_CREATED);
    }

    // GET /api/books/{id} - Afficher un livre
    #[Route('/{id}', methods: ['GET'])]
    #[OA\Get(
        summary: 'Afficher un livre',
        description: 'Retourne les détails d\'un livre par son identifiant.'
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        description: 'Identifiant unique du livre',
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Détails du livre',
        content: new OA\JsonContent(ref: new Model(type: Book::class))
    )]
    #[OA\Response(response: 404, description: 'Livre non trouvé')]
    public function show(Book $book): JsonResponse
    {
        // ... implémentation
        return $this->json([]);
    }

    // DELETE /api/books/{id} - Supprimer un livre
    #[Route('/{id}', methods: ['DELETE'])]
    #[OA\Delete(
        summary: 'Supprimer un livre',
        description: 'Supprime un livre de la bibliothèque.'
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(response: 204, description: 'Livre supprimé')]
    #[OA\Response(response: 404, description: 'Livre non trouvé')]
    public function delete(
        Book $book,
        EntityManagerInterface $em
    ): JsonResponse {
        // ... implémentation
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
```

**Résultat attendu** : Swagger UI affiche tous les endpoints avec leurs paramètres, requêtes et réponses documentées.

---

### Étape 4 : Annoter les entités pour les schémas

Ajoute les attributs OpenAPI sur l'entité pour décrire le modèle de données.

```php
<?php
// src/Entity/Book.php - avec attributs OpenAPI

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use OpenApi\Attributes as OA;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
// Le schema OpenAPI décrit la structure de l'objet dans la documentation
#[OA\Schema(
    description: 'Représente un livre dans la bibliothèque.'
)]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[OA\Property(description: 'Identifiant unique du livre', example: 1)]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[OA\Property(
        description: 'Titre du livre',
        example: 'Clean Code',
        maxLength: 255
    )]
    private string $title = '';

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[OA\Property(
        description: 'Auteur du livre',
        example: 'Robert C. Martin',
        maxLength: 255
    )]
    private string $author = '';

    #[ORM\Column(length: 13, nullable: true, unique: true)]
    #[OA\Property(
        description: 'Code ISBN (10 ou 13 caractères)',
        example: '9780132350884',
        nullable: true
    )]
    private ?string $isbn = null;

    #[ORM\Column(nullable: true)]
    #[OA\Property(
        description: 'Année de publication',
        example: 2008,
        nullable: true
    )]
    private ?int $publishedYear = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[OA\Property(
        description: 'Genre littéraire',
        example: 'Programmation',
        nullable: true
    )]
    private ?string $genre = null;

    // Getters et setters...
    public function getId(): ?int { return $this->id; }
    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }
    public function getAuthor(): string { return $this->author; }
    public function setAuthor(string $author): self { $this->author = $author; return $this; }
    public function getIsbn(): ?string { return $this->isbn; }
    public function setIsbn(?string $isbn): self { $this->isbn = $isbn; return $this; }
    public function getPublishedYear(): ?int { return $this->publishedYear; }
    public function setPublishedYear(?int $year): self { $this->publishedYear = $year; return $this; }
    public function getGenre(): ?string { return $this->genre; }
    public function setGenre(?string $genre): self { $this->genre = $genre; return $this; }
}
```

**Résultat attendu** : dans Swagger UI, la section « Schémas » affiche le modèle `Book` avec tous ses champs, types, exemples et descriptions.

---

### Étape 5 : Exporter et valider la spécification

Exporte la spécification OpenAPI générée et valide-la.

```bash
# Exporter la spécification OpenAPI en JSON
php bin/console nelmio:apidoc:dump --format=json > openapi.json
```

```bash
# Exporter en YAML
php bin/console nelmio:apidoc:dump --format=yaml > openapi.yaml
```

```bash
# Valider le fichier OpenAPI avec un outil externe
# Installer le validateur (nécessite Node.js)
npm install -g @redocly/cli
```

```bash
# Valider la spécification
redocly lint openapi.yaml
```

**Résultat attendu** :

```text
validating openapi.yaml...
openapi.yaml: validated successfully
```

---

### Étape 6 : Personnaliser Swagger UI

Personnalise l'apparence et le comportement de Swagger UI.

```yaml
# config/packages/nelmio_api_doc.yaml

nelmio_api_doc:
    documentation:
        info:
            title: "API Bibliothèque"
            description: |
                API REST pour gérer une bibliothèque de livres.

                ## Authentification
                L'API utilise des tokens JWT. Ajoutez le header :
                `Authorization: Bearer <token>`

                ## Pagination
                Tous les endpoints de liste supportent `?page=1&limit=20`.

                ## Erreurs
                Les erreurs suivent le format RFC 7807.
            version: "1.0.0"
        # Regrouper les endpoints par tag
        tags:
            - name: "Livres"
              description: "Gestion des livres"
            - name: "Avis"
              description: "Gestion des avis sur les livres"
        components:
            securitySchemes:
                Bearer:
                    type: "http"
                    scheme: "bearer"
                    bearerFormat: "JWT"
        security:
            - Bearer: []
    areas:
        default:
            path_patterns:
                - "^/api/"
            # Exclure les routes de documentation elles-mêmes
            host_patterns: []
```

**Résultat attendu** : Swagger UI affiche une description détaillée, des tags pour regrouper les endpoints, et un bouton « Authorize » pour saisir le token JWT.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `composer require nelmio/api-doc-bundle` | Installer NelmioApiDocBundle |
| `php bin/console nelmio:apidoc:dump --format=json` | Exporter la spec OpenAPI en JSON |
| `php bin/console nelmio:apidoc:dump --format=yaml` | Exporter la spec OpenAPI en YAML |
| `php bin/console debug:router \| grep api` | Lister les routes API |
| `redocly lint openapi.yaml` | Valider un fichier OpenAPI |

---

## Pièges Fréquents

### Piège 1 : Ne pas documenter les réponses d'erreur

⚠️ **Problème** : Swagger UI montre les réponses de succès (200, 201) mais pas les erreurs (400, 404, 422). Le développeur front-end ne sait pas quelles erreurs gérer.

✅ **Solution** : Documente systématiquement toutes les réponses possibles, y compris les erreurs.

```php
<?php
// ✅ Documenter toutes les réponses
#[OA\Response(response: 200, description: 'Succès')]
#[OA\Response(response: 400, description: 'JSON invalide')]
#[OA\Response(response: 404, description: 'Non trouvé')]
#[OA\Response(response: 422, description: 'Validation échouée')]
```

### Piège 2 : Dupliquer les schémas au lieu d'utiliser `$ref`

⚠️ **Problème** : Le même schéma est copié dans chaque endpoint. Si tu changes un champ, tu dois le modifier partout.

✅ **Solution** : Définis les schémas dans `components/schemas` et référence-les avec `$ref`.

```yaml
# ❌ Incorrect : schema dupliqué
paths:
  /api/books:
    get:
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  id: {type: integer}
                  title: {type: string}

# ✅ Correct : schema référencé
paths:
  /api/books:
    get:
      responses:
        "200":
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/BookSummary"
```

### Piège 3 : Oublier les exemples

⚠️ **Problème** : Swagger UI affiche des champs sans valeurs d'exemple. Le développeur front-end ne sait pas quel format de données envoyer.

✅ **Solution** : Ajoute des `example` sur chaque propriété du schéma.

### Piège 4 : Ne pas séparer les schémas de lecture et d'écriture

⚠️ **Problème** : Le même schéma est utilisé pour la création (POST) et l'affichage (GET). Le champ `id` apparaît dans le formulaire de création alors qu'il est généré automatiquement.

✅ **Solution** : Crée des schémas séparés : `BookCreate` (sans `id`), `BookDetail` (avec `id`), `BookUpdate` (tous champs optionnels).

---

## Checklist de Validation

- [ ] J'ai un fichier OpenAPI valide qui décrit tous mes endpoints
- [ ] Swagger UI est accessible et affiche tous les endpoints
- [ ] Chaque endpoint documente ses paramètres, requêtes et réponses (succès ET erreurs)
- [ ] Les schémas sont définis dans `components/schemas` et référencés avec `$ref`
- [ ] Les schémas de création, lecture et modification sont séparés
- [ ] Chaque propriété a un `example` et une `description`
- [ ] NelmioApiDocBundle génère la documentation depuis les attributs PHP

---

## Exercice Pratique

**Énoncé** : Documente l'API de bibliothèque complète avec OpenAPI et NelmioApiDocBundle.

**Spécifications** :

- Installe NelmioApiDocBundle dans ton projet Symfony
- Ajoute les attributs `#[OA\...]` sur le contrôleur `BookController` (tous les endpoints : GET liste, GET détail, POST, PATCH, DELETE)
- Ajoute les attributs `#[OA\Property]` sur l'entité `Book`
- Crée un endpoint `GET /api/books/{id}/reviews` et documente-le
- Exporte la spécification en YAML et valide-la
- Swagger UI doit afficher 2 tags : « Livres » et « Avis »

**Indications** :

- Utilise `#[OA\Tag(name: 'Livres')]` sur la classe du contrôleur
- Utilise `#[OA\Parameter]` pour les query parameters et les path parameters
- Utilise `#[OA\RequestBody]` pour les endpoints POST et PATCH
- Utilise `#[OA\Response]` pour chaque code de statut possible

**Résultat attendu** : Swagger UI affiche une documentation interactive complète avec tous les endpoints, paramètres, schémas et réponses documentés.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/Controller/Api/BookReviewController.php - avec attributs OpenAPI

namespace App\Controller\Api;

use App\Entity\Book;
use App\Entity\Review;
use App\Repository\ReviewRepository;
use Doctrine\ORM\EntityManagerInterface;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/books/{bookId}/reviews')]
#[OA\Tag(name: 'Avis')]
class BookReviewController extends AbstractController
{
    // GET /api/books/{bookId}/reviews - Liste les avis
    #[Route('', methods: ['GET'])]
    #[OA\Get(
        summary: 'Lister les avis d\'un livre',
        description: 'Retourne tous les avis associés à un livre.'
    )]
    #[OA\Parameter(
        name: 'bookId',
        in: 'path',
        description: 'Identifiant du livre',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste des avis',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'rating', type: 'integer', example: 4),
                    new OA\Property(property: 'comment', type: 'string', example: 'Excellent livre'),
                    new OA\Property(property: 'author', type: 'string', example: 'Jean'),
                ]
            )
        )
    )]
    #[OA\Response(response: 404, description: 'Livre non trouvé')]
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

    // POST /api/books/{bookId}/reviews - Ajouter un avis
    #[Route('', methods: ['POST'])]
    #[OA\Post(
        summary: 'Ajouter un avis',
        description: 'Ajoute un avis à un livre existant.'
    )]
    #[OA\Parameter(
        name: 'bookId',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['rating', 'comment'],
            properties: [
                new OA\Property(property: 'rating', type: 'integer', minimum: 1, maximum: 5, example: 4),
                new OA\Property(property: 'comment', type: 'string', example: 'Excellent livre'),
                new OA\Property(property: 'author', type: 'string', example: 'Jean', nullable: true),
            ]
        )
    )]
    #[OA\Response(response: 201, description: 'Avis créé')]
    #[OA\Response(response: 400, description: 'JSON invalide')]
    #[OA\Response(response: 404, description: 'Livre non trouvé')]
    #[OA\Response(response: 422, description: 'Données invalides')]
    public function create(
        Book $book,
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        $payload = json_decode($request->getContent(), true);

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

← Fiche précédente : **[03 - Gestion des erreurs API](03-gestion-erreurs-api.md)**

→ Fiche suivante : **[05 - API Platform - Introduction](05-api-platform-introduction.md)**
