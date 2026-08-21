---
tags:
  - Testing
  - Avancé
  - Pratique
description: "Tester une API REST avec PHPUnit et Postman/Newman, valider les réponses JSON et appliquer les contrats d'API."
estimated_time: "75 min"
fiche_number: 10
total_fiches: 15
cursus: "Testing et Qualité"
id: "web.testing.tests-api"
course_id: "web.testing"
content_type: "lesson"
order: 10
---

# 10 - Tests d'API

> **En bref** : Cette fiche te guide dans le test d'une API REST avec PHPUnit (tests fonctionnels Symfony) et Postman/Newman (collections exportées), la validation des réponses JSON et l'utilisation des contrats d'API pour garantir la compatibilité. Lecture estimée : 75 min.

## Prérequis

- [Fiche 05 - Tests fonctionnels Symfony](05-tests-fonctionnels-symfony.md) (client HTTP, assertions de réponse)
- Savoir créer une API REST avec Symfony (contrôleurs qui retournent du JSON)
- Comprendre les méthodes HTTP (GET, POST, PUT, DELETE) et les codes de statut (200, 201, 404, 422)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des tests d'API avec PHPUnit dans Symfony, créer et exécuter des collections Postman/Newman, valider la structure des réponses JSON et mettre en place des contrats d'API pour éviter les régressions.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un test d'API ?

**Définition** : Un test d'API vérifie qu'une API REST répond correctement aux requêtes HTTP. Il envoie une requête (GET, POST, PUT, DELETE) à un endpoint et vérifie la réponse : le code de statut HTTP, les headers et le corps JSON.

**Le problème que les tests d'API résolvent** :

Sans tests d'API, voici les problèmes rencontrés :

1. **Régressions silencieuses** : Tu modifies un contrôleur et un endpoint retourne maintenant un champ `userName` au lieu de `username`. Le frontend casse, mais aucun test backend ne le détecte.
2. **Validation manuelle lente** : Tu ouvres Postman, tu tapes l'URL, tu envoies la requête, tu vérifies la réponse à l'œil. Ça prend 2 minutes par endpoint, et tu as 40 endpoints.
3. **Documentation obsolète** : La documentation de l'API dit que `/api/products` retourne un champ `price`, mais le contrôleur retourne `unitPrice`. Personne ne le remarque.

**Comment les tests d'API résolvent ces problèmes** :

| Problème | Solution apportée par les tests d'API |
| --- | --- |
| Régressions silencieuses | Le test vérifie chaque champ de la réponse JSON |
| Validation manuelle lente | Les tests s'exécutent en quelques secondes |
| Documentation obsolète | Les tests servent de documentation vivante de l'API |

**Analogie concrète** : Imagine un guichet de poste. Tu donnes une lettre (requête) et tu attends un reçu (réponse). Le test d'API vérifie que pour chaque type de lettre, tu reçois le bon reçu : le bon montant, le bon timbre, la bonne date. Si le guichetier change sa procédure, le test le détecte immédiatement.

**Ce qu'un test d'API n'est PAS** :

- Un test d'API n'est pas un test unitaire. Le test d'API traverse toute la couche HTTP (routing, contrôleur, sérialisation). Le test unitaire teste une seule fonction isolée.
- Un test d'API n'est pas un test E2E. Le test d'API ne teste pas l'interface utilisateur (boutons, formulaires). Il teste uniquement les requêtes et réponses HTTP.

---

### Qu'est-ce qu'un contrat d'API ?

**Définition** : Un contrat d'API est un accord formel sur la structure des requêtes et des réponses d'une API. Il définit les endpoints, les méthodes HTTP, les paramètres, les codes de statut et la structure JSON exacte.

**Le problème que les contrats d'API résolvent** :

Sans contrats d'API, voici les problèmes rencontrés :

1. **Changements incompatibles** : Le développeur backend renomme un champ JSON. Le développeur frontend découvre le problème en production.
2. **Communication floue** : Le frontend attend un tableau `products`, le backend envoie un objet `{ data: [...] }`. Chacun pense avoir raison.

**Comment les contrats d'API résolvent ces problèmes** :

| Problème | Solution apportée par les contrats d'API |
| --- | --- |
| Changements incompatibles | Le contrat est testé automatiquement : tout changement de structure échoue |
| Communication floue | Le contrat est un document partagé qui fait référence |

**Analogie concrète** : Un contrat d'API, c'est comme un bon de commande entre un fournisseur et un client. Le bon dit exactement : "Je veux 10 cartons de vis de 3 cm, livrés mardi". Si le fournisseur livre des vis de 4 cm, le bon de commande permet de constater l'erreur. Le contrat d'API fait la même chose avec les données JSON.

**Ce qu'un contrat d'API n'est PAS** :

- Un contrat n'est pas de la documentation. La documentation explique comment utiliser l'API. Le contrat vérifie automatiquement que l'API respecte ses promesses.

---

### Qu'est-ce que Postman et Newman ?

**Définition** : Postman est un outil graphique pour envoyer des requêtes HTTP et organiser des collections de tests d'API. Newman est l'exécuteur en ligne de commande de Postman : il lance les collections Postman sans interface graphique.

**Le problème que Postman/Newman résolvent** :

Sans Postman/Newman, voici les problèmes rencontrés :

1. **Tests uniquement en PHP** : Les tests PHPUnit testent l'API depuis le même langage que le backend. Ils ne testent pas l'API comme un vrai client HTTP externe le ferait.
2. **Pas de tests pour les équipes non-PHP** : Le développeur frontend veut tester l'API, mais il ne connaît pas PHPUnit.

**Comment Postman/Newman résolvent ces problèmes** :

| Problème | Solution apportée par Postman/Newman |
| --- | --- |
| Tests uniquement en PHP | Newman envoie de vraies requêtes HTTP, comme un client réel |
| Pas de tests pour les équipes non-PHP | Postman est universel, Newman tourne avec Node.js |

**Analogie concrète** : Postman est comme un client mystère qui visite un restaurant pour évaluer le service.
Il passe commande (envoie des requêtes), vérifie que le plat correspond au menu (valide la réponse) et note ses observations.
Newman, c'est le même client mystère, mais automatisé : il visite le restaurant chaque nuit sans intervention humaine et envoie un rapport le matin.
Les tests PHPUnit, en comparaison, c'est le chef cuisinier qui goûte ses plats en cuisine (test interne).
Le client mystère (Newman) teste comme un vrai client, depuis la salle du restaurant.

**Comparaison PHPUnit vs Newman** :

| Critère | Tests PHPUnit (Symfony) | Tests Newman (Postman) |
| --- | --- | --- |
| Type de requête | Simulée (kernel Symfony) | Réelle (HTTP via le réseau) |
| Vitesse | Rapide (pas de réseau) | Plus lent (requêtes réseau) |
| Serveur requis | Non | Oui (l'API doit tourner) |
| Langage | PHP | JavaScript (dans Postman) |
| Quand l'utiliser | Tests quotidiens en développement | Validation d'intégration, tests cross-équipe |

---

## Étapes Pratiques

### Étape 1 : Créer un contrôleur API Symfony à tester

Crée un contrôleur API pour un CRUD de produits. Ce contrôleur servira de base pour tous les tests.

```php
<?php
// src/Controller/Api/ProductController.php
// Contrôleur API REST pour les produits

namespace App\Controller\Api;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/products')]
class ProductController extends AbstractController
{
    // GET /api/products - Liste tous les produits
    #[Route('', methods: ['GET'])]
    public function list(ProductRepository $repository): JsonResponse
    {
        $products = $repository->findAll();

        // Transforme les entités en tableaux
        $data = array_map(function (Product $product) {
            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'category' => $product->getCategory(),
            ];
        }, $products);

        return $this->json($data);
    }

    // GET /api/products/{id} - Affiche un produit
    #[Route('/{id}', methods: ['GET'])]
    public function show(Product $product): JsonResponse
    {
        return $this->json([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'price' => $product->getPrice(),
            'category' => $product->getCategory(),
        ]);
    }

    // POST /api/products - Crée un produit
    #[Route('', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em
    ): JsonResponse {
        // Décode le corps JSON de la requête
        $data = json_decode($request->getContent(), true);

        // Validation basique
        if (empty($data['name']) || !isset($data['price'])) {
            return $this->json(
                ['error' => 'Les champs name et price sont obligatoires'],
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }

        // Crée le produit
        $product = new Product();
        $product->setName($data['name']);
        $product->setPrice((float) $data['price']);
        $product->setCategory($data['category'] ?? null);

        $em->persist($product);
        $em->flush();

        return $this->json(
            [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'category' => $product->getCategory(),
            ],
            Response::HTTP_CREATED
        );
    }

    // DELETE /api/products/{id} - Supprime un produit
    #[Route('/{id}', methods: ['DELETE'])]
    public function delete(
        Product $product,
        EntityManagerInterface $em
    ): JsonResponse {
        $em->remove($product);
        $em->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
```

---

### Étape 2 : Écrire des tests d'API avec PHPUnit

Crée `tests/Api/ProductApiTest.php` :

```php
<?php
// tests/Api/ProductApiTest.php
// Tests fonctionnels de l'API REST des produits

namespace App\Tests\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProductApiTest extends WebTestCase
{
    private $client;

    protected function setUp(): void
    {
        // Crée le client HTTP Symfony (pas de vraie requête réseau)
        $this->client = static::createClient();
    }

    // --- Tests de GET /api/products ---

    public function testListProductsReturns200(): void
    {
        // Envoie une requête GET à l'endpoint
        $this->client->request('GET', '/api/products');

        // Vérifie le code de statut HTTP
        $this->assertResponseStatusCodeSame(200);
    }

    public function testListProductsReturnsJson(): void
    {
        $this->client->request('GET', '/api/products');

        // Vérifie que la réponse est du JSON
        $this->assertResponseHeaderSame('content-type', 'application/json');
    }

    public function testListProductsReturnsArray(): void
    {
        $this->client->request('GET', '/api/products');

        // Décode la réponse JSON
        $data = json_decode(
            $this->client->getResponse()->getContent(),
            true
        );

        // Vérifie que la réponse est un tableau
        $this->assertIsArray($data);
    }

    public function testListProductsContainsExpectedFields(): void
    {
        $this->client->request('GET', '/api/products');

        $data = json_decode(
            $this->client->getResponse()->getContent(),
            true
        );

        // Si la liste n'est pas vide, vérifie la structure d'un produit
        if (count($data) > 0) {
            $product = $data[0];

            $this->assertArrayHasKey('id', $product);
            $this->assertArrayHasKey('name', $product);
            $this->assertArrayHasKey('price', $product);
            $this->assertArrayHasKey('category', $product);
        }
    }

    // --- Tests de POST /api/products ---

    public function testCreateProductReturns201(): void
    {
        // Envoie une requête POST avec un corps JSON
        $this->client->request(
            'POST',
            '/api/products',
            [],    // Paramètres de formulaire (vide)
            [],    // Fichiers uploadés (vide)
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Clavier mécanique',
                'price' => 89.99,
                'category' => 'Informatique',
            ])
        );

        // Vérifie le code 201 Created
        $this->assertResponseStatusCodeSame(201);
    }

    public function testCreateProductReturnsCreatedProduct(): void
    {
        $this->client->request(
            'POST',
            '/api/products',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'name' => 'Souris sans fil',
                'price' => 45.00,
                'category' => 'Informatique',
            ])
        );

        $data = json_decode(
            $this->client->getResponse()->getContent(),
            true
        );

        // Vérifie que la réponse contient les données envoyées
        $this->assertEquals('Souris sans fil', $data['name']);
        $this->assertEquals(45.00, $data['price']);
        $this->assertEquals('Informatique', $data['category']);

        // Vérifie qu'un ID a été attribué
        $this->assertArrayHasKey('id', $data);
        $this->assertIsInt($data['id']);
    }

    public function testCreateProductWithMissingNameReturns422(): void
    {
        $this->client->request(
            'POST',
            '/api/products',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'price' => 10.00,
                // 'name' est absent
            ])
        );

        // Vérifie le code 422 Unprocessable Entity
        $this->assertResponseStatusCodeSame(422);
    }

    public function testCreateProductWithMissingNameReturnsError(): void
    {
        $this->client->request(
            'POST',
            '/api/products',
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode([
                'price' => 10.00,
            ])
        );

        $data = json_decode(
            $this->client->getResponse()->getContent(),
            true
        );

        // Vérifie que la réponse contient un message d'erreur
        $this->assertArrayHasKey('error', $data);
        $this->assertStringContainsString('name', $data['error']);
    }

    // --- Tests de GET /api/products/{id} ---

    public function testShowNonExistingProductReturns404(): void
    {
        // L'ID 999999 n'existe pas
        $this->client->request('GET', '/api/products/999999');

        $this->assertResponseStatusCodeSame(404);
    }

    // --- Tests de DELETE /api/products/{id} ---

    public function testDeleteNonExistingProductReturns404(): void
    {
        $this->client->request('DELETE', '/api/products/999999');

        $this->assertResponseStatusCodeSame(404);
    }
}
```

Lance les tests :

```bash
# Lance uniquement les tests d'API
./vendor/bin/phpunit tests/Api/
```

**Résultat attendu** :

```text
PHPUnit 12.x.x by Sebastian Bergmann and contributors.

..........                                                        10 / 10 (100%)

Time: 00:00.350, Memory: 30.00 MB

OK (10 tests, 12 assertions)
```

---

### Étape 3 : Tester la structure JSON avec des assertions précises

Crée une méthode utilitaire pour valider la structure JSON de tes réponses :

```php
<?php
// tests/Api/ApiTestCase.php
// Classe de base avec des assertions JSON réutilisables

namespace App\Tests\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

abstract class ApiTestCase extends WebTestCase
{
    protected $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
    }

    // Envoie une requête GET et retourne les données JSON
    protected function get(string $url): array
    {
        $this->client->request('GET', $url);

        return json_decode(
            $this->client->getResponse()->getContent(),
            true
        );
    }

    // Envoie une requête POST avec un corps JSON
    protected function post(string $url, array $data): array
    {
        $this->client->request(
            'POST',
            $url,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($data)
        );

        return json_decode(
            $this->client->getResponse()->getContent(),
            true
        ) ?? [];
    }

    // Vérifie qu'un tableau a exactement les clés attendues
    protected function assertJsonStructure(
        array $expectedKeys,
        array $data
    ): void {
        foreach ($expectedKeys as $key) {
            $this->assertArrayHasKey(
                $key,
                $data,
                "La clé '$key' est absente de la réponse JSON"
            );
        }
    }

    // Vérifie le type d'un champ JSON
    protected function assertJsonFieldType(
        string $type,
        mixed $value,
        string $field
    ): void {
        match ($type) {
            'int' => $this->assertIsInt($value, "Le champ '$field' devrait être un entier"),
            'float' => $this->assertIsFloat($value, "Le champ '$field' devrait être un flottant"),
            'string' => $this->assertIsString($value, "Le champ '$field' devrait être une chaîne"),
            'bool' => $this->assertIsBool($value, "Le champ '$field' devrait être un booléen"),
            'array' => $this->assertIsArray($value, "Le champ '$field' devrait être un tableau"),
            'null' => $this->assertNull($value, "Le champ '$field' devrait être null"),
            default => $this->fail("Type inconnu : $type"),
        };
    }
}
```

Utilise cette classe de base dans tes tests :

```php
<?php
// tests/Api/ProductContractTest.php
// Tests de contrat pour l'API des produits

namespace App\Tests\Api;

class ProductContractTest extends ApiTestCase
{
    // Contrat : GET /api/products retourne un tableau d'objets produit
    public function testListProductsContract(): void
    {
        $data = $this->get('/api/products');

        // La réponse est un tableau
        $this->assertIsArray($data);

        // Chaque produit a la bonne structure
        foreach ($data as $product) {
            $this->assertJsonStructure(
                ['id', 'name', 'price', 'category'],
                $product
            );

            // Vérifie les types de chaque champ
            $this->assertJsonFieldType('int', $product['id'], 'id');
            $this->assertJsonFieldType('string', $product['name'], 'name');
        }
    }

    // Contrat : POST /api/products retourne le produit créé
    public function testCreateProductContract(): void
    {
        $data = $this->post('/api/products', [
            'name' => 'Écran 27 pouces',
            'price' => 349.99,
            'category' => 'Informatique',
        ]);

        $this->assertResponseStatusCodeSame(201);

        // La réponse a la bonne structure
        $this->assertJsonStructure(
            ['id', 'name', 'price', 'category'],
            $data
        );

        // Les valeurs correspondent à ce qu'on a envoyé
        $this->assertEquals('Écran 27 pouces', $data['name']);
        $this->assertEquals(349.99, $data['price']);
    }

    // Contrat : POST /api/products avec données invalides retourne une erreur
    public function testCreateProductErrorContract(): void
    {
        $data = $this->post('/api/products', []);

        $this->assertResponseStatusCodeSame(422);

        // La réponse d'erreur contient un champ "error"
        $this->assertJsonStructure(['error'], $data);
        $this->assertJsonFieldType('string', $data['error'], 'error');
    }
}
```

---

### Étape 4 : Créer une collection Postman

Crée un fichier de collection Postman au format JSON. Ce fichier peut être importé dans Postman ou exécuté avec Newman.

Crée `postman/products-api.json` :

```json
{
  "info": {
    "name": "Products API",
    "description": "Tests de l'API REST des produits",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8000"
    }
  ],
  "item": [
    {
      "name": "GET /api/products - Liste des produits",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/products"
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "// Vérifie le code de statut",
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "// Vérifie que la réponse est du JSON",
              "pm.test('Response is JSON', function () {",
              "    pm.response.to.be.json;",
              "});",
              "",
              "// Vérifie que la réponse est un tableau",
              "pm.test('Response is an array', function () {",
              "    const data = pm.response.json();",
              "    pm.expect(data).to.be.an('array');",
              "});",
              "",
              "// Vérifie la structure d'un produit",
              "pm.test('Products have correct structure', function () {",
              "    const data = pm.response.json();",
              "    if (data.length > 0) {",
              "        pm.expect(data[0]).to.have.property('id');",
              "        pm.expect(data[0]).to.have.property('name');",
              "        pm.expect(data[0]).to.have.property('price');",
              "        pm.expect(data[0]).to.have.property('category');",
              "    }",
              "});"
            ]
          }
        }
      ]
    },
    {
      "name": "POST /api/products - Créer un produit",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/products",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"Casque audio\", \"price\": 59.99, \"category\": \"Audio\"}"
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 201', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('Response contains created product', function () {",
              "    const data = pm.response.json();",
              "    pm.expect(data.name).to.equal('Casque audio');",
              "    pm.expect(data.price).to.equal(59.99);",
              "    pm.expect(data).to.have.property('id');",
              "});"
            ]
          }
        }
      ]
    },
    {
      "name": "POST /api/products - Données invalides",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/products",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"price\": 10}"
        }
      },
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 422', function () {",
              "    pm.response.to.have.status(422);",
              "});",
              "",
              "pm.test('Response contains error message', function () {",
              "    const data = pm.response.json();",
              "    pm.expect(data).to.have.property('error');",
              "});"
            ]
          }
        }
      ]
    }
  ]
}
```

---

### Étape 5 : Exécuter les tests avec Newman

Installe Newman et lance la collection :

```bash
# Installe Newman globalement
npm install -g newman

# Ou en dépendance de développement du projet
npm install --save-dev newman
```

Lance la collection (le serveur Symfony doit tourner) :

```bash
# Démarre le serveur Symfony en arrière-plan
symfony serve -d

# Lance la collection Newman
npx newman run postman/products-api.json
```

**Résultat attendu** :

```text
Products API

→ GET /api/products - Liste des produits
  GET http://localhost:8000/api/products [200 OK, 1.2kB, 45ms]
  ✓  Status code is 200
  ✓  Response is JSON
  ✓  Response is an array
  ✓  Products have correct structure

→ POST /api/products - Créer un produit
  POST http://localhost:8000/api/products [201 Created, 150B, 30ms]
  ✓  Status code is 201
  ✓  Response contains created product

→ POST /api/products - Données invalides
  POST http://localhost:8000/api/products [422 Unprocessable Entity, 100B, 15ms]
  ✓  Status code is 422
  ✓  Response contains error message

┌─────────────────────────┬──────────┬──────────┐
│                         │ executed │   failed │
├─────────────────────────┼──────────┼──────────┤
│           iterations    │        1 │        0 │
├─────────────────────────┼──────────┼──────────┤
│             requests    │        3 │        0 │
├─────────────────────────┼──────────┼──────────┤
│         test-scripts    │        3 │        0 │
├─────────────────────────┼──────────┼──────────┤
│             assertions  │        8 │        0 │
└─────────────────────────┴──────────┴──────────┘
```

---

### Étape 6 : Tester les différents codes HTTP

Crée des tests exhaustifs pour chaque code de statut :

```php
<?php
// tests/Api/ProductHttpStatusTest.php
// Tests des codes de statut HTTP de l'API

namespace App\Tests\Api;

class ProductHttpStatusTest extends ApiTestCase
{
    // --- Codes de succès ---

    public function testGetReturns200(): void
    {
        $this->client->request('GET', '/api/products');
        $this->assertResponseStatusCodeSame(200);
    }

    public function testPostReturns201(): void
    {
        $this->post('/api/products', [
            'name' => 'Test',
            'price' => 10.0,
        ]);
        $this->assertResponseStatusCodeSame(201);
    }

    public function testDeleteReturns204(): void
    {
        // Crée d'abord un produit
        $data = $this->post('/api/products', [
            'name' => 'À supprimer',
            'price' => 1.0,
        ]);

        // Supprime le produit
        $this->client->request('DELETE', '/api/products/' . $data['id']);
        $this->assertResponseStatusCodeSame(204);
    }

    // --- Codes d'erreur client ---

    public function testGetNonExistingReturns404(): void
    {
        $this->client->request('GET', '/api/products/999999');
        $this->assertResponseStatusCodeSame(404);
    }

    public function testPostInvalidDataReturns422(): void
    {
        $this->post('/api/products', []);
        $this->assertResponseStatusCodeSame(422);
    }

    public function testPostWithoutNameReturns422(): void
    {
        $this->post('/api/products', ['price' => 10.0]);
        $this->assertResponseStatusCodeSame(422);
    }

    public function testPostWithoutPriceReturns422(): void
    {
        $this->post('/api/products', ['name' => 'Test']);
        $this->assertResponseStatusCodeSame(422);
    }

    // --- Test de méthode non autorisée ---

    public function testPatchReturns405(): void
    {
        $this->client->request('PATCH', '/api/products');
        $this->assertResponseStatusCodeSame(405);
    }
}
```

---

### Étape 7 : Tester le contenu JSON en profondeur

Crée des tests qui vérifient précisément le contenu des réponses :

```php
<?php
// tests/Api/ProductContentTest.php
// Tests du contenu des réponses JSON

namespace App\Tests\Api;

class ProductContentTest extends ApiTestCase
{
    public function testCreatedProductHasCorrectData(): void
    {
        $input = [
            'name' => 'Webcam HD',
            'price' => 79.99,
            'category' => 'Informatique',
        ];

        $data = $this->post('/api/products', $input);

        // Vérifie chaque champ individuellement
        $this->assertSame('Webcam HD', $data['name']);
        $this->assertSame(79.99, $data['price']);
        $this->assertSame('Informatique', $data['category']);
        $this->assertGreaterThan(0, $data['id']);
    }

    public function testProductWithoutCategoryHasNullCategory(): void
    {
        $data = $this->post('/api/products', [
            'name' => 'Câble USB',
            'price' => 5.99,
            // Pas de catégorie
        ]);

        // Le champ category doit être null, pas absent
        $this->assertArrayHasKey('category', $data);
        $this->assertNull($data['category']);
    }

    public function testListIncludesNewlyCreatedProduct(): void
    {
        // Crée un produit
        $this->post('/api/products', [
            'name' => 'Produit unique ' . time(),
            'price' => 12.50,
        ]);

        // Récupère la liste
        $products = $this->get('/api/products');

        // Vérifie que la liste contient au moins 1 produit
        $this->assertNotEmpty($products);

        // Vérifie que chaque produit a un prix positif ou nul
        foreach ($products as $product) {
            $this->assertGreaterThanOrEqual(0, $product['price']);
        }
    }

    public function testErrorResponseHasCorrectFormat(): void
    {
        $data = $this->post('/api/products', []);

        // La réponse d'erreur doit contenir exactement un champ "error"
        $this->assertCount(1, $data);
        $this->assertArrayHasKey('error', $data);
        $this->assertNotEmpty($data['error']);
    }
}
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `./vendor/bin/phpunit tests/Api/` | Lancer les tests d'API PHPUnit |
| `./vendor/bin/phpunit --filter testCreate` | Filtrer les tests par nom |
| `npx newman run collection.json` | Lancer une collection Postman avec Newman |
| `npx newman run collection.json --reporters cli,html` | Newman avec rapport HTML |
| `npx newman run collection.json --env-var "baseUrl=http://localhost:8000"` | Newman avec variable d'environnement |
| `symfony serve -d` | Démarrer le serveur Symfony en arrière-plan |
| `symfony server:stop` | Arrêter le serveur Symfony |

---

## Pièges Fréquents

### Piège 1 : Oublier le Content-Type dans les requêtes POST

⚠️ **Problème** : Tu envoies un POST avec un corps JSON, mais tu oublies le header `Content-Type: application/json`. Symfony ne décode pas le corps et `$request->getContent()` retourne une chaîne vide.

✅ **Solution** : Toujours ajouter le header `Content-Type` :

```php
// ❌ Incorrect : pas de Content-Type
$this->client->request('POST', '/api/products', [], [], [], json_encode($data));

// ✅ Correct : Content-Type spécifié
$this->client->request(
    'POST',
    '/api/products',
    [],
    [],
    ['CONTENT_TYPE' => 'application/json'],
    json_encode($data)
);
```

---

### Piège 2 : Tests d'API qui dépendent de l'ordre d'exécution

⚠️ **Problème** : Le test "supprimer un produit" s'attend à ce que le test "créer un produit" ait été exécuté avant. Si tu lances les tests dans un ordre différent, ça échoue.

✅ **Solution** : Chaque test doit créer ses propres données. Le test de suppression doit d'abord créer un produit, puis le supprimer.

```php
// ✅ Correct : le test crée ses propres données
public function testDeleteProduct(): void
{
    // ARRANGE : crée un produit
    $data = $this->post('/api/products', [
        'name' => 'À supprimer',
        'price' => 1.0,
    ]);

    // ACT : supprime le produit
    $this->client->request('DELETE', '/api/products/' . $data['id']);

    // ASSERT
    $this->assertResponseStatusCodeSame(204);
}
```

---

### Piège 3 : Ne pas tester les cas d'erreur

⚠️ **Problème** : Tu testes uniquement les cas de succès (200, 201). Mais les cas d'erreur (400, 404, 422) ne sont pas testés. Un bug dans la gestion d'erreur passe inaperçu.

✅ **Solution** : Pour chaque endpoint, teste au minimum :

- Le cas de succès
- Les données manquantes ou invalides
- La ressource inexistante (404)
- La méthode HTTP non autorisée (405)

---

### Piège 4 : Newman échoue parce que le serveur n'est pas démarré

⚠️ **Problème** : Tu lances Newman sans démarrer le serveur Symfony. Toutes les requêtes échouent avec "ECONNREFUSED".

✅ **Solution** : Vérifie que le serveur tourne avant de lancer Newman :

```bash
# Vérifie que le serveur répond
curl -s http://localhost:8000/api/products > /dev/null && echo "OK" || echo "Serveur non démarré"

# Démarre le serveur si nécessaire
symfony serve -d
```

---

## Checklist de Validation

- [ ] Je sais écrire des tests d'API avec PHPUnit (requêtes GET, POST, DELETE)
- [ ] Je sais vérifier le code de statut HTTP dans un test
- [ ] Je sais vérifier la structure JSON d'une réponse
- [ ] Je sais créer une collection Postman au format JSON
- [ ] Je sais exécuter une collection avec Newman
- [ ] Je comprends la différence entre tests PHPUnit (simulés) et tests Newman (réseau réel)
- [ ] Je sais tester les cas d'erreur (422, 404, 405)
- [ ] Je comprends le concept de contrat d'API

---

## Exercice Pratique

**Énoncé** : Crée une suite de tests complète pour une API de gestion de tâches (todo list). L'API a les endpoints suivants :

1. `GET /api/tasks` - liste les tâches
2. `POST /api/tasks` - crée une tâche (`title` obligatoire, `done` optionnel par défaut `false`)
3. `PUT /api/tasks/{id}` - met à jour une tâche (modifier `title` ou `done`)
4. `DELETE /api/tasks/{id}` - supprime une tâche

**Indications** :

- Écris au minimum 12 tests PHPUnit couvrant tous les endpoints
- Teste les cas de succès et les cas d'erreur pour chaque endpoint
- Vérifie la structure JSON de chaque réponse (contrat)
- Crée une classe de base `ApiTestCase` avec des méthodes utilitaires (`get`, `post`, `put`, `delete`)
- Crée une collection Postman JSON avec les 4 requêtes et des scripts de test
- Teste que `done` est `false` par défaut quand on crée une tâche sans le spécifier

**Résultat attendu** : Tous les tests PHPUnit passent, et la collection Newman s'exécute sans erreur.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// tests/Api/TaskApiTest.php
// Tests complets de l'API de gestion de tâches

namespace App\Tests\Api;

class TaskApiTest extends ApiTestCase
{
    // Méthode utilitaire pour envoyer un PUT
    protected function put(string $url, array $data): array
    {
        $this->client->request(
            'PUT',
            $url,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($data)
        );

        return json_decode(
            $this->client->getResponse()->getContent(),
            true
        ) ?? [];
    }

    // Méthode utilitaire pour envoyer un DELETE
    protected function delete(string $url): void
    {
        $this->client->request('DELETE', $url);
    }

    // --- GET /api/tasks ---

    public function testListTasksReturns200(): void
    {
        $this->get('/api/tasks');
        $this->assertResponseStatusCodeSame(200);
    }

    public function testListTasksReturnsArray(): void
    {
        $data = $this->get('/api/tasks');
        $this->assertIsArray($data);
    }

    // --- POST /api/tasks ---

    public function testCreateTaskReturns201(): void
    {
        $this->post('/api/tasks', ['title' => 'Acheter du pain']);
        $this->assertResponseStatusCodeSame(201);
    }

    public function testCreateTaskReturnsCorrectData(): void
    {
        $data = $this->post('/api/tasks', ['title' => 'Faire les courses']);

        $this->assertJsonStructure(['id', 'title', 'done'], $data);
        $this->assertEquals('Faire les courses', $data['title']);
    }

    public function testCreateTaskDefaultDoneIsFalse(): void
    {
        // Pas de champ 'done' dans la requête
        $data = $this->post('/api/tasks', ['title' => 'Tâche test']);

        // 'done' doit être false par défaut
        $this->assertFalse($data['done']);
    }

    public function testCreateTaskWithoutTitleReturns422(): void
    {
        $this->post('/api/tasks', []);
        $this->assertResponseStatusCodeSame(422);
    }

    public function testCreateTaskErrorHasMessage(): void
    {
        $data = $this->post('/api/tasks', []);

        $this->assertArrayHasKey('error', $data);
    }

    // --- PUT /api/tasks/{id} ---

    public function testUpdateTaskTitle(): void
    {
        // Crée une tâche
        $created = $this->post('/api/tasks', ['title' => 'Ancien titre']);

        // Met à jour le titre
        $updated = $this->put(
            '/api/tasks/' . $created['id'],
            ['title' => 'Nouveau titre']
        );

        $this->assertEquals('Nouveau titre', $updated['title']);
    }

    public function testUpdateTaskDone(): void
    {
        // Crée une tâche (done = false par défaut)
        $created = $this->post('/api/tasks', ['title' => 'Tâche à terminer']);

        // Marque comme terminée
        $updated = $this->put(
            '/api/tasks/' . $created['id'],
            ['done' => true]
        );

        $this->assertTrue($updated['done']);
    }

    public function testUpdateNonExistingTaskReturns404(): void
    {
        $this->put('/api/tasks/999999', ['title' => 'Inexistant']);
        $this->assertResponseStatusCodeSame(404);
    }

    // --- DELETE /api/tasks/{id} ---

    public function testDeleteTaskReturns204(): void
    {
        $created = $this->post('/api/tasks', ['title' => 'À supprimer']);

        $this->delete('/api/tasks/' . $created['id']);
        $this->assertResponseStatusCodeSame(204);
    }

    public function testDeleteNonExistingTaskReturns404(): void
    {
        $this->delete('/api/tasks/999999');
        $this->assertResponseStatusCodeSame(404);
    }

    // --- Contrat : structure JSON ---

    public function testTaskContractStructure(): void
    {
        $data = $this->post('/api/tasks', [
            'title' => 'Tâche de contrat',
        ]);

        // Vérifie la structure exacte
        $this->assertJsonStructure(['id', 'title', 'done'], $data);
        $this->assertJsonFieldType('int', $data['id'], 'id');
        $this->assertJsonFieldType('string', $data['title'], 'title');
        $this->assertJsonFieldType('bool', $data['done'], 'done');
    }
}
```

Lance les tests :

```bash
./vendor/bin/phpunit tests/Api/TaskApiTest.php
```

**Résultat attendu** :

```text
OK (13 tests, 18 assertions)
```

---

## Navigation

← Fiche précédente : **[Couverture de code](09-couverture-code.md)**

→ Fiche suivante : **[Stratégie de test en équipe](11-strategie-test-equipe.md)**
