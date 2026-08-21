---
tags:
  - Redis
  - Intermédiaire
  - Pratique
description: "Configurer et utiliser Redis comme système de cache dans une application Symfony"
estimated_time: "90 min"
fiche_number: 4
total_fiches: 8
cursus: "Redis et Cache"
---

# 04 - Redis dans Symfony - Cache

> **En bref** : À la fin de cette fiche, tu sauras configurer Redis comme système de cache dans Symfony, utiliser CacheInterface et TagAwareCacheInterface, invalider le cache par tag et mettre en place le cache HTTP. Lecture estimée : 90 min.

## Prérequis

- Fiche [01 - Introduction à Redis](01-introduction-redis.md)
- Fiche [02 - Installation et CLI redis](02-installation-cli-redis.md)
- Fiche [03 - Structures de données](03-structures-donnees.md)
- Cursus Symfony terminé jusqu'à la fiche [13 - Services et injection de dépendances](../03-symfony/13-services-injection-dependances.md)
- Savoir créer un projet Symfony avec Docker Compose

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Redis | 7.x |
| Symfony | 7.4 LTS |
| PHP | 8.3 |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer le composant Cache de Symfony avec Redis, mettre en cache des résultats de requêtes, invalider le cache manuellement et par tags, et configurer le cache HTTP pour les réponses.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le composant Cache de Symfony ?

**Définition** : Le composant Cache de Symfony est une abstraction qui te permet de stocker et récupérer des données depuis différents systèmes de cache (Redis, Memcached, fichiers, APCu) sans changer ton code. Il implémente le standard PSR-6 et PSR-16.

**Le problème que le composant Cache résout** :

Sans composant Cache, voici les problèmes rencontrés :

1. **Code couplé à Redis** : Si tu utilises directement l'extension PHP Redis, ton code est lié à Redis. Changer de système de cache oblige à réécrire tout le code.

2. **Pas de standard** : Chaque bibliothèque de cache a sa propre API. Il n'y a pas de manière unifiée de mettre en cache.

3. **Gestion manuelle du TTL** : Tu dois gérer toi-même l'expiration, la sérialisation et la désérialisation des données.

**Comment le composant Cache résout ces problèmes** :

| Problème | Solution Symfony Cache |
| -------- | --------------------- |
| Code couplé à Redis | Abstraction : change d'adaptateur sans toucher au code |
| Pas de standard | Implémente PSR-6 et PSR-16 |
| Gestion manuelle du TTL | Le composant gère TTL, sérialisation et invalidation |

**Analogie concrète** : Le composant Cache est comme une prise électrique universelle. Que tu branches un appareil français, américain ou anglais, l'adaptateur gère la conversion. De la même façon, que tu utilises Redis, Memcached ou des fichiers, l'interface `CacheInterface` reste la même.

**Flux de lecture du cache** :

<div class="diagram-design">
<p><a href="../../diagrams/13-redis-04-redis-symfony-cache-1.html">Qu&#x27;est-ce que le composant Cache de Symfony ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/13-redis-04-redis-symfony-cache-1.html" title="Qu&#x27;est-ce que le composant Cache de Symfony ?" style="width:100%;min-height:616px;border:0;background:transparent"></iframe>
</div>

En cas de cache hit, la base de données n'est pas sollicitée. En cas de cache miss, le résultat est stocké en cache pour les prochaines requêtes.

**Ce que le composant Cache n'est PAS** :

- Ce n'est pas Redis lui-même. C'est une couche d'abstraction au-dessus de Redis (ou d'un autre système).
- Ce n'est pas automatique. Tu dois explicitement décider quelles données mettre en cache dans ton code.

---

### Les cache pools

**Définition** : Un cache pool est un espace de stockage nommé pour le cache. Symfony permet de créer plusieurs pools pour séparer différents types de données mises en cache.

**Pourquoi plusieurs pools ?** :

| Pool | Usage | TTL typique |
| ---- | ----- | ----------- |
| `cache.app` | Cache applicatif général | Variable |
| `cache.system` | Cache interne de Symfony (routes, annotations) | Long |
| Pool personnalisé | Cache spécifique à un besoin | Défini par toi |

**Exemple de pools séparés** :

```text
cache.products   → Cache des produits (TTL: 1 heure)
cache.users      → Cache des utilisateurs (TTL: 15 minutes)
cache.api        → Cache des réponses API externes (TTL: 5 minutes)
```

Séparer les pools permet d'invalider le cache des produits sans toucher au cache des utilisateurs.

---

### CacheInterface vs TagAwareCacheInterface

**Définition** : Symfony fournit deux interfaces principales pour interagir avec le cache.

**CacheInterface** (base) :

- Méthode `get(clé, callback)` : récupère la valeur en cache ou exécute le callback si la clé n'existe pas
- Méthode `delete(clé)` : supprime une clé spécifique

**TagAwareCacheInterface** (avancée) :

- Toutes les méthodes de `CacheInterface`
- En plus : possibilité de taguer les éléments du cache
- Méthode `invalidateTags([tags])` : supprime tous les éléments ayant un ou plusieurs tags donnés

**Le problème que les tags résolvent** :

Sans tags, voici le problème : tu as 500 éléments en cache liés aux produits. Un produit est modifié, et tu veux invalider tous les caches liés aux produits. Sans tags, tu dois connaître et supprimer chaque clé individuellement.

**Comment les tags résolvent ce problème** :

Avec les tags, tu assignes le tag `products` à chaque élément de cache lié aux produits. Pour invalider, tu appelles `invalidateTags(['products'])` et tous les éléments tagués sont supprimés en une seule opération.

```text
Clé: cache_product_42     → Tags: ["products", "category_electronics"]
Clé: cache_product_43     → Tags: ["products", "category_books"]
Clé: cache_top_products   → Tags: ["products"]
Clé: cache_category_list  → Tags: ["categories"]

invalidateTags(["products"]) → supprime les 3 premières clés
invalidateTags(["categories"]) → supprime uniquement la 4e clé
```

**Comparaison** :

| CacheInterface | TagAwareCacheInterface |
| -------------- | ---------------------- |
| Invalidation par clé uniquement | Invalidation par clé ou par tag |
| Plus simple à configurer | Nécessite un adaptateur compatible (Redis) |
| Suffisant pour du cache simple | Indispensable pour du cache complexe |

---

### Le cache HTTP

**Définition** : Le cache HTTP est un mécanisme intégré au protocole HTTP. Il permet au navigateur et aux proxies de stocker les réponses et de ne pas refaire la requête au serveur tant que le cache est valide.

**Différence cache applicatif vs cache HTTP** :

| Cache applicatif (Redis) | Cache HTTP |
| ------------------------ | ---------- |
| Côté serveur | Côté client (navigateur) ou proxy |
| Réduit les requêtes à la base de données | Réduit les requêtes au serveur |
| Géré par ton code PHP | Géré par les en-têtes HTTP |
| Invisible pour le client | Visible dans les en-têtes de réponse |

**En-têtes HTTP de cache** :

| En-tête | Rôle | Exemple |
| ------- | ---- | ------- |
| `Cache-Control` | Définit la stratégie de cache | `max-age=3600, public` |
| `Expires` | Date d'expiration du cache | `Thu, 01 Jan 2026 00:00:00 GMT` |
| `ETag` | Identifiant unique de la version | `"abc123"` |
| `Last-Modified` | Date de dernière modification | `Wed, 15 Jan 2025 10:00:00 GMT` |

---

## Étapes Pratiques

### Étape 1 : Préparer le projet Symfony avec Redis

Crée un fichier `docker-compose.yml` qui inclut PHP, PostgreSQL et Redis :

```yaml
# ~/redis-lab/docker-compose.yml
services:
  php:
    image: php:8.3-fpm
    volumes:
      - ./app:/var/www/html
    depends_on:
      - redis
      - database

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  redis_data:
  db_data:
```

---

### Étape 2 : Installer les dépendances

Dans ton projet Symfony, installe le composant Cache et l'extension PHP Redis :

```bash
# Installe le composant Cache de Symfony
composer require symfony/cache
```

L'extension PHP `redis` (phpredis) ou la bibliothèque `predis/predis` est nécessaire pour que Symfony communique avec Redis :

```bash
# Option 1 : Predis (bibliothèque PHP pure, pas besoin d'extension C)
composer require predis/predis
```

---

### Étape 3 : Configurer la connexion Redis

Configure l'URL de connexion Redis dans le fichier `.env` :

```env
# .env
# URL de connexion à Redis
# redis:// est le protocole
# redis est le nom du service Docker (ou localhost si Redis tourne sur la machine)
# 6379 est le port par défaut de Redis
REDIS_URL=redis://redis:6379
```

---

### Étape 4 : Configurer le cache Symfony avec Redis

Modifie le fichier de configuration du cache :

```yaml
# config/packages/cache.yaml

framework:
    cache:
        # Utilise Redis comme adaptateur par défaut pour le cache applicatif
        app: cache.adapter.redis

        # URL de connexion Redis (lue depuis .env)
        default_redis_provider: '%env(REDIS_URL)%'

        # Pools personnalisés
        pools:
            # Pool pour le cache des produits
            cache.products:
                adapter: cache.adapter.redis_tag_aware
                default_lifetime: 3600  # 1 heure en secondes

            # Pool pour le cache des utilisateurs
            cache.users:
                adapter: cache.adapter.redis_tag_aware
                default_lifetime: 900  # 15 minutes en secondes

            # Pool pour le cache des réponses API
            cache.api:
                adapter: cache.adapter.redis
                default_lifetime: 300  # 5 minutes en secondes
```

**Explication de chaque paramètre** :

| Paramètre | Rôle |
| --------- | ---- |
| `app: cache.adapter.redis` | Le pool par défaut utilise Redis |
| `default_redis_provider` | L'URL de connexion Redis |
| `adapter: cache.adapter.redis_tag_aware` | Active le support des tags pour ce pool |
| `default_lifetime` | Durée de vie par défaut des éléments en secondes |

---

### Étape 5 : Utiliser CacheInterface dans un contrôleur

Crée un contrôleur qui utilise le cache pour stocker le résultat d'une requête coûteuse :

```php
<?php
// src/Controller/ProductController.php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class ProductController extends AbstractController
{
    #[Route('/products', name: 'product_list')]
    public function list(
        // Symfony injecte automatiquement le pool cache.app
        CacheInterface $cache,
        ProductRepository $productRepository,
    ): Response {
        // La méthode get() vérifie si la clé existe dans le cache.
        // Si oui, elle retourne la valeur en cache.
        // Si non, elle exécute le callback, stocke le résultat et le retourne.
        $products = $cache->get('product_list_all', function (ItemInterface $item) use ($productRepository) {
            // Ce callback n'est exécuté que si la clé n'est PAS en cache

            // Définit la durée de vie de cet élément à 1 heure
            $item->expiresAfter(3600);

            // Exécute la requête SQL (opération coûteuse)
            return $productRepository->findAll();
        });

        return $this->render('product/list.html.twig', [
            'products' => $products,
        ]);
    }
}
```

**Comment ça fonctionne** :

```text
Première visite :
1. $cache->get('product_list_all', ...) → clé pas en cache
2. Le callback s'exécute → requête SQL → résultat obtenu
3. Le résultat est stocké dans Redis avec la clé 'product_list_all'
4. Le résultat est retourné au contrôleur

Visites suivantes (pendant 1 heure) :
1. $cache->get('product_list_all', ...) → clé en cache
2. Le callback n'est PAS exécuté
3. Le résultat est lu directement depuis Redis (< 1 ms)
4. Le résultat est retourné au contrôleur
```

---

### Étape 6 : Utiliser un pool personnalisé

Pour injecter un pool spécifique au lieu du pool par défaut, utilise l'attribut `#[Autowire]` :

```php
<?php
// src/Controller/ProductController.php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class ProductController extends AbstractController
{
    #[Route('/products', name: 'product_list')]
    public function list(
        // Injecte le pool personnalisé 'cache.products' au lieu de 'cache.app'
        #[Autowire(service: 'cache.products')]
        CacheInterface $productCache,
        ProductRepository $productRepository,
    ): Response {
        $products = $productCache->get('all_products', function (ItemInterface $item) use ($productRepository) {
            // La durée de vie par défaut du pool (3600s) s'applique
            // Tu peux la surcharger ici si besoin :
            // $item->expiresAfter(1800);

            return $productRepository->findAll();
        });

        return $this->render('product/list.html.twig', [
            'products' => $products,
        ]);
    }
}
```

---

### Étape 7 : Supprimer le cache manuellement

Pour invalider le cache quand les données changent :

```php
<?php
// src/Controller/ProductController.php

namespace App\Controller;

use App\Entity\Product;
use App\Form\ProductType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Cache\CacheInterface;

class ProductController extends AbstractController
{
    #[Route('/products/new', name: 'product_new', methods: ['GET', 'POST'])]
    public function new(
        Request $request,
        EntityManagerInterface $em,
        #[Autowire(service: 'cache.products')]
        CacheInterface $productCache,
    ): Response {
        $product = new Product();
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($product);
            $em->flush();

            // Invalide le cache des produits
            // La prochaine requête recalculera la liste
            $productCache->delete('all_products');

            return $this->redirectToRoute('product_list');
        }

        return $this->render('product/new.html.twig', [
            'form' => $form,
        ]);
    }
}
```

---

### Étape 8 : Utiliser TagAwareCacheInterface

Les tags permettent d'invalider plusieurs clés de cache en une seule opération :

```php
<?php
// src/Controller/ProductController.php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

class ProductController extends AbstractController
{
    #[Route('/products', name: 'product_list')]
    public function list(
        // Injecte un pool qui supporte les tags
        #[Autowire(service: 'cache.products')]
        TagAwareCacheInterface $productCache,
        ProductRepository $productRepository,
    ): Response {
        $products = $productCache->get('all_products', function (ItemInterface $item) use ($productRepository) {
            $item->expiresAfter(3600);

            // Assigne des tags à cet élément de cache
            // Si l'un de ces tags est invalidé, cet élément est supprimé
            $item->tag(['products', 'product_list']);

            return $productRepository->findAll();
        });

        return $this->render('product/list.html.twig', [
            'products' => $products,
        ]);
    }

    #[Route('/products/{id}', name: 'product_show')]
    public function show(
        int $id,
        #[Autowire(service: 'cache.products')]
        TagAwareCacheInterface $productCache,
        ProductRepository $productRepository,
    ): Response {
        $product = $productCache->get("product_{$id}", function (ItemInterface $item) use ($id, $productRepository) {
            $item->expiresAfter(3600);

            // Ce cache est tagué avec le tag général 'products'
            // et un tag spécifique au produit
            $item->tag(['products', "product_{$id}"]);

            return $productRepository->find($id);
        });

        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }
}
```

**Invalider par tags** :

```php
<?php
// src/EventListener/ProductListener.php

namespace App\EventListener;

use Doctrine\ORM\Event\PostUpdateEventArgs;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

class ProductListener
{
    public function __construct(
        #[Autowire(service: 'cache.products')]
        private TagAwareCacheInterface $productCache,
    ) {
    }

    // Cette méthode est appelée après la mise à jour d'un produit en base
    public function postUpdate(PostUpdateEventArgs $args): void
    {
        $entity = $args->getObject();

        // Vérifie que c'est bien un produit
        if (!$entity instanceof \App\Entity\Product) {
            return;
        }

        // Invalide tous les caches tagués 'products'
        // Cela supprime : all_products, product_42, product_43, etc.
        $this->productCache->invalidateTags(['products']);
    }
}
```

---

### Étape 9 : Cache HTTP dans un contrôleur

Le cache HTTP permet au navigateur de stocker la réponse et de ne pas refaire la requête :

```php
<?php
// src/Controller/ProductController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ProductController extends AbstractController
{
    #[Route('/products/catalog', name: 'product_catalog')]
    public function catalog(): Response
    {
        $response = $this->render('product/catalog.html.twig');

        // Cache public : le navigateur ET les proxies peuvent stocker la réponse
        // max-age: 3600 secondes (1 heure)
        $response->setPublic();
        $response->setMaxAge(3600);

        // Alternative : cache privé (seulement le navigateur, pas les proxies)
        // $response->setPrivate();
        // $response->setMaxAge(600);

        return $response;
    }
}
```

**En-têtes HTTP générés** :

```text
HTTP/1.1 200 OK
Cache-Control: public, max-age=3600
```

---

### Étape 10 : Vérifier le cache dans Redis

Tu peux vérifier que le cache Symfony est bien stocké dans Redis avec redis-cli :

```bash
# Connecte-toi à redis-cli
docker compose exec redis redis-cli
```

```bash
# Liste les clés de cache Symfony (dev uniquement : KEYS bloque Redis)
# En production, préfère : SCAN 0 MATCH cache:* COUNT 100
KEYS *
# Tu verras des clés avec des préfixes comme :
# 1) "cache:products:all_products"
# 2) "cache:products:product_42"
# 3) ...

# Vérifie le TTL d'une clé
TTL "cache:products:all_products"
# (integer) 3542

# Quitte
QUIT
```

---

## Commandes Utiles

| Commande Symfony | Action |
| ---------------- | ------ |
| `$cache->get('clé', $callback)` | Récupère ou calcule une valeur |
| `$cache->delete('clé')` | Supprime une clé du cache |
| `$item->expiresAfter(secondes)` | Définit le TTL d'un élément |
| `$item->tag(['tag1', 'tag2'])` | Ajoute des tags à un élément |
| `$cache->invalidateTags(['tag'])` | Invalide tous les éléments ayant ce tag |

| Commande console | Action |
| ---------------- | ------ |
| `php bin/console cache:clear` | Vide le cache Symfony (pas Redis) |
| `php bin/console cache:pool:clear cache.products` | Vide un pool spécifique |
| `php bin/console cache:pool:list` | Liste les pools configurés |

---

## Pièges Fréquents

### Piège 1 : Oublier de vider le cache après une modification de données

⚠️ **Problème** : Tu modifies un produit en base de données, mais le cache contient toujours l'ancienne version. Les utilisateurs voient des données obsolètes.

✅ **Solution** : Invalide le cache à chaque modification. Utilise les tags pour invalider facilement tous les caches liés à un type de données. Utilise un listener Doctrine pour automatiser l'invalidation.

---

### Piège 2 : Mettre en cache des objets Doctrine non sérialisables

⚠️ **Problème** : Tu mets en cache une entité Doctrine qui a des relations lazy-loaded. La sérialisation échoue ou produit des résultats incorrects.

✅ **Solution** : Mets en cache des données scalaires (tableaux, chaînes) plutôt que des objets Doctrine :

```php
// ❌ Mettre en cache une entité Doctrine (risque de problème de sérialisation)
$products = $cache->get('products', function (ItemInterface $item) use ($repo) {
    return $repo->findAll();
});

// ✅ Mettre en cache un tableau de données
$products = $cache->get('products', function (ItemInterface $item) use ($repo) {
    $item->expiresAfter(3600);
    $entities = $repo->findAll();

    // Convertir en tableau simple
    return array_map(fn($p) => [
        'id' => $p->getId(),
        'name' => $p->getName(),
        'price' => $p->getPrice(),
    ], $entities);
});
```

---

### Piège 3 : Cache trop long ou trop court

⚠️ **Problème** : Un TTL trop long affiche des données obsolètes. Un TTL trop court ne réduit pas la charge sur la base de données.

✅ **Solution** : Adapte le TTL à la fréquence de changement des données :

```text
Page d'accueil (change rarement)     → TTL: 1 heure (3600s)
Liste de produits (change quelques fois par jour) → TTL: 15 minutes (900s)
Résultat de recherche (change souvent) → TTL: 2 minutes (120s)
Données utilisateur en temps réel    → Pas de cache
```

---

### Piège 4 : Ne pas utiliser les tags avec redis_tag_aware

⚠️ **Problème** : Tu configures un pool avec `cache.adapter.redis` (sans tag) mais tu essaies d'utiliser `TagAwareCacheInterface`. Tu obtiens une erreur.

✅ **Solution** : Pour utiliser les tags, configure le pool avec `cache.adapter.redis_tag_aware` :

```yaml
# ❌ Pas de support des tags
pools:
    cache.products:
        adapter: cache.adapter.redis

# ✅ Support des tags
pools:
    cache.products:
        adapter: cache.adapter.redis_tag_aware
```

---

### Piège 5 : Politique d'éviction Redis incompatible avec redis_tag_aware

⚠️ **Problème** : Tu utilises `cache.adapter.redis_tag_aware` avec une politique Redis comme `allkeys-lru` ou `allkeys-lfu`. L'éviction peut casser les relations entre tags et entrées de cache.

✅ **Solution** : Avec `RedisTagAwareAdapter`, configure Redis avec `maxmemory-policy` à `noeviction` ou une politique `volatile-*` (par exemple `volatile-lru`). Exemple Docker :

```yaml
# docker-compose.yml
redis:
  image: redis:7-alpine
  command: redis-server --appendonly yes --maxmemory 100mb --maxmemory-policy noeviction
```

Documentation officielle Symfony : avec `RedisTagAwareAdapter`, il faut `noeviction` ou `volatile-*` pour maintenir les relations tags / items.

---

## Checklist de Validation

- [ ] J'ai configuré Redis comme adaptateur de cache dans `config/packages/cache.yaml`
- [ ] Je sais utiliser `CacheInterface` pour mettre en cache des résultats
- [ ] Je comprends le fonctionnement de `$cache->get('clé', $callback)`
- [ ] Je sais créer des pools de cache personnalisés
- [ ] Je sais injecter un pool spécifique avec `#[Autowire]`
- [ ] Je sais invalider le cache avec `delete()` et `invalidateTags()`
- [ ] Je comprends la différence entre `CacheInterface` et `TagAwareCacheInterface`
- [ ] Je sais configurer le cache HTTP dans un contrôleur
- [ ] Je sais vérifier le contenu du cache dans Redis avec redis-cli

---

## Exercice Pratique

**Énoncé** : Ajoute un système de cache complet à un contrôleur Symfony.

**Indications** :

- Configure un pool `cache.articles` avec `redis_tag_aware` et un TTL de 30 minutes
- Crée un contrôleur `ArticleController` avec trois actions :
  - `list` : liste tous les articles (cache avec tag `articles`)
  - `show(id)` : affiche un article (cache avec tags `articles` et `article_{id}`)
  - `new` : crée un article (invalide le tag `articles` après création)
- Ajoute le cache HTTP sur l'action `list` (cache public, 10 minutes)
- Vérifie dans redis-cli que les clés sont créées avec les bons TTL

**Résultat attendu** : La liste des articles est servie depuis le cache Redis. Quand un nouvel article est créé, le cache est invalidé et la prochaine requête recalcule la liste.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Configuration du pool :

```yaml
# config/packages/cache.yaml
framework:
    cache:
        app: cache.adapter.redis
        default_redis_provider: '%env(REDIS_URL)%'
        pools:
            cache.articles:
                adapter: cache.adapter.redis_tag_aware
                default_lifetime: 1800  # 30 minutes
```

Contrôleur :

```php
<?php
// src/Controller/ArticleController.php

namespace App\Controller;

use App\Entity\Article;
use App\Form\ArticleType;
use App\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

#[Route('/articles')]
class ArticleController extends AbstractController
{
    public function __construct(
        #[Autowire(service: 'cache.articles')]
        private TagAwareCacheInterface $articleCache,
    ) {
    }

    #[Route('', name: 'article_list')]
    public function list(ArticleRepository $articleRepository): Response
    {
        // Récupère la liste depuis le cache ou la base
        $articles = $this->articleCache->get('all_articles', function (ItemInterface $item) use ($articleRepository) {
            $item->expiresAfter(1800);
            $item->tag(['articles']);

            $entities = $articleRepository->findAll();

            return array_map(fn($a) => [
                'id' => $a->getId(),
                'title' => $a->getTitle(),
                'createdAt' => $a->getCreatedAt()->format('Y-m-d'),
            ], $entities);
        });

        $response = $this->render('article/list.html.twig', [
            'articles' => $articles,
        ]);

        // Cache HTTP public, 10 minutes
        $response->setPublic();
        $response->setMaxAge(600);

        return $response;
    }

    #[Route('/{id}', name: 'article_show', requirements: ['id' => '\d+'])]
    public function show(int $id, ArticleRepository $articleRepository): Response
    {
        $article = $this->articleCache->get("article_{$id}", function (ItemInterface $item) use ($id, $articleRepository) {
            $item->expiresAfter(1800);
            $item->tag(['articles', "article_{$id}"]);

            $entity = $articleRepository->find($id);

            if (!$entity) {
                return null;
            }

            return [
                'id' => $entity->getId(),
                'title' => $entity->getTitle(),
                'content' => $entity->getContent(),
                'createdAt' => $entity->getCreatedAt()->format('Y-m-d'),
            ];
        });

        if (!$article) {
            throw $this->createNotFoundException('Article non trouvé');
        }

        return $this->render('article/show.html.twig', [
            'article' => $article,
        ]);
    }

    #[Route('/new', name: 'article_new', methods: ['GET', 'POST'])]
    public function new(
        Request $request,
        EntityManagerInterface $em,
    ): Response {
        $article = new Article();
        $form = $this->createForm(ArticleType::class, $article);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($article);
            $em->flush();

            // Invalide tous les caches tagués "articles"
            $this->articleCache->invalidateTags(['articles']);

            return $this->redirectToRoute('article_list');
        }

        return $this->render('article/new.html.twig', [
            'form' => $form,
        ]);
    }
}
```

Vérification dans redis-cli :

```bash
# Connecte-toi à redis-cli
docker compose exec redis redis-cli

# Liste les clés de cache (dev uniquement ; en prod : SCAN 0 MATCH *article* COUNT 100)
KEYS *article*

# Vérifie le TTL
TTL "cache:articles:all_articles"
# (integer) ~1800

# Quitte
QUIT
```

---

## Navigation

← Fiche précédente : **[Structures de données](03-structures-donnees.md)**

→ Fiche suivante : **[Redis dans Symfony - Sessions](05-redis-symfony-sessions.md)**
