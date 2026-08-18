---
tags:
  - Redis
  - Avancé
  - Concept
description: "Comprendre et appliquer les stratégies de cache : cache-aside, write-through, invalidation et protection contre le stampede"
estimated_time: "75 min"
fiche_number: 6
total_fiches: 8
cursus: "Redis et Cache"
---

# 06 - Stratégies de cache

> **En bref** : À la fin de cette fiche, tu connaîtras les principales stratégies de cache (cache-aside, write-through, write-behind), tu sauras gérer l'invalidation du cache et protéger ton application contre le cache stampede. Lecture estimée : 75 min.

## Prérequis

- Fiche [01 - Introduction à Redis](01-introduction-redis.md)
- Fiche [04 - Redis dans Symfony - Cache](04-redis-symfony-cache.md)
- Comprendre le fonctionnement du composant Cache de Symfony
- Comprendre les concepts de TTL et d'expiration

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Redis | 7.x |
| Symfony | 7.4 LTS |
| PHP | 8.3 |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir la bonne stratégie de cache selon le cas d'utilisation, gérer l'invalidation du cache de manière efficace et protéger ton application contre les problèmes courants (stampede, données obsolètes).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une stratégie de cache ?

**Définition** : Une stratégie de cache définit quand et comment les données sont écrites dans le cache, lues depuis le cache et invalidées (supprimées du cache).

**Le problème que les stratégies de cache résolvent** :

Sans stratégie de cache définie, voici les problèmes rencontrés :

1. **Données obsolètes** : Le cache contient des données périmées que l'utilisateur voit.
2. **Cache inefficace** : Le cache est rempli de données inutiles qui ne sont jamais lues.
3. **Incohérence** : La base de données et le cache contiennent des données différentes.
4. **Surcharge** : Quand le cache expire, des centaines de requêtes frappent la base de données en même temps.

**Comment les stratégies de cache résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Données obsolètes | Stratégie d'invalidation adaptée |
| Cache inefficace | Cacher uniquement les données fréquemment lues |
| Incohérence | Write-through ou invalidation immédiate |
| Surcharge | Protection contre le stampede |

**Analogie concrète** : Une stratégie de cache est comme une politique de stock dans un magasin. Tu dois décider : quels produits garder en rayon (cache), quand réapprovisionner (rafraîchir le cache), et quand retirer un produit périmé (invalider le cache). Une mauvaise stratégie = des rayons vides (cache miss) ou des produits périmés (données obsolètes).

---

### Cache-aside (Lazy Loading)

**Définition** : Le cache-aside est la stratégie la plus courante. L'application vérifie d'abord le cache. Si la donnée est en cache (cache hit), elle est retournée. Sinon (cache miss), l'application lit la base de données, stocke le résultat dans le cache, puis le retourne.

**Schéma de fonctionnement** :

<div class="diagram-design">
<p><a href="../../diagrams/13-redis-06-strategies-cache-1.html">Cache-aside (Lazy Loading) (HTML + SVG)</a></p>
<iframe src="../../diagrams/13-redis-06-strategies-cache-1.html" title="Cache-aside (Lazy Loading)" style="width:100%;min-height:600px;border:0;background:transparent"></iframe>
</div>

**Avantages** :

- Simple à implémenter
- Seules les données demandées sont mises en cache (pas de gaspillage)
- Si Redis tombe en panne, l'application fonctionne toujours (elle lit la base)

**Inconvénients** :

- Premier accès toujours lent (cache miss)
- Données potentiellement obsolètes jusqu'à l'expiration du TTL

**Implémentation Symfony** :

```php
// Le cache-aside est la stratégie par défaut de Symfony Cache
$products = $cache->get('all_products', function (ItemInterface $item) use ($repo) {
    // Ce callback n'est exécuté que lors d'un cache miss
    $item->expiresAfter(3600);
    return $repo->findAll();
});
```

---

### Write-through

**Définition** : Dans la stratégie write-through, chaque écriture en base de données est immédiatement suivie d'une écriture dans le cache. Le cache est toujours synchronisé avec la base de données.

**Schéma de fonctionnement** :

<div class="diagram-design">
<p><a href="../../diagrams/13-redis-06-strategies-cache-2.html">Write-through (HTML + SVG)</a></p>
<iframe src="../../diagrams/13-redis-06-strategies-cache-2.html" title="Write-through" style="width:100%;min-height:520px;border:0;background:transparent"></iframe>
</div>

**Avantages** :

- Le cache est toujours à jour (pas de données obsolètes)
- Les lectures sont toujours rapides (pas de cache miss après la première écriture)

**Inconvénients** :

- Chaque écriture est plus lente (double écriture : base + cache)
- Le cache contient potentiellement des données qui ne seront jamais lues

**Implémentation Symfony** :

```php
<?php
// src/Service/ProductService.php

namespace App\Service;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class ProductService
{
    public function __construct(
        private EntityManagerInterface $em,
        private CacheInterface $cache,
        private ProductRepository $productRepository,
    ) {
    }

    public function createProduct(Product $product): void
    {
        // 1. Écrit en base de données
        $this->em->persist($product);
        $this->em->flush();

        // 2. Écrit immédiatement dans le cache
        $this->cache->get(
            "product_{$product->getId()}",
            function (ItemInterface $item) use ($product) {
                $item->expiresAfter(3600);
                return [
                    'id' => $product->getId(),
                    'name' => $product->getName(),
                    'price' => $product->getPrice(),
                ];
            }
        );

        // 3. Invalide la liste des produits pour forcer le recalcul
        $this->cache->delete('all_products');
    }

    public function updateProduct(Product $product): void
    {
        // 1. Met à jour en base de données
        $this->em->flush();

        // 2. Met à jour le cache immédiatement
        // On supprime l'ancien cache et on le recrée
        $this->cache->delete("product_{$product->getId()}");
        $this->cache->get(
            "product_{$product->getId()}",
            function (ItemInterface $item) use ($product) {
                $item->expiresAfter(3600);
                return [
                    'id' => $product->getId(),
                    'name' => $product->getName(),
                    'price' => $product->getPrice(),
                ];
            }
        );

        // 3. Invalide la liste
        $this->cache->delete('all_products');
    }
}
```

---

### Write-behind (Write-back)

**Définition** : Dans la stratégie write-behind, l'application écrit dans le cache et retourne immédiatement au client. Les données sont écrites en base de données de manière asynchrone (en arrière-plan), par lots ou après un délai.

**Schéma de fonctionnement** :

<div class="diagram-design">
<p><a href="../../diagrams/13-redis-06-strategies-cache-3.html">Write-behind (Write-back) (HTML + SVG)</a></p>
<iframe src="../../diagrams/13-redis-06-strategies-cache-3.html" title="Write-behind (Write-back)" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Avantages** :

- Les écritures sont très rapides (pas d'attente de la base de données)
- La base de données reçoit des lots d'écritures (moins de charge)

**Inconvénients** :

- Risque de perte de données si Redis crash avant l'écriture en base
- Plus complexe à implémenter
- Possibles incohérences temporaires

**Cas d'utilisation** :

- Compteurs de vues (on ne perd pas grand-chose si quelques vues sont perdues)
- Logs d'activité
- Données analytiques

**Implémentation simplifiée** :

```php
<?php
// src/Service/ViewCounterService.php

namespace App\Service;

class ViewCounterService
{
    public function __construct(
        private \Redis $redis,
    ) {
    }

    // Incrémente le compteur dans Redis (rapide)
    public function incrementViews(int $articleId): void
    {
        // L'écriture en Redis est quasi instantanée
        $this->redis->incr("views:article:{$articleId}");
    }

    // Méthode appelée périodiquement (CRON ou commande Symfony)
    // pour écrire les compteurs en base de données
    public function flushToDatabase(\PDO $pdo): void
    {
        // Parcours toutes les clés de compteurs
        $cursor = null;
        do {
            $keys = $this->redis->scan($cursor, 'views:article:*', 100);
            if ($keys !== false) {
                foreach ($keys as $key) {
                    // Extraire l'ID de l'article depuis la clé
                    $articleId = (int) str_replace('views:article:', '', $key);

                    // Lire et remettre à zéro atomiquement
                    // set() avec l'option 'GET' retourne l'ancienne valeur avant de l'écraser
                    // (équivalent de la commande Redis : SET key 0 GET)
                    $views = (int) $this->redis->set($key, '0', ['GET']);

                    if ($views > 0) {
                        // Écrire en base de données
                        $stmt = $pdo->prepare(
                            'UPDATE article SET views = views + :views WHERE id = :id'
                        );
                        $stmt->execute(['views' => $views, 'id' => $articleId]);
                    }
                }
            }
        } while ($cursor > 0);
    }
}
```

---

### Comparaison des trois stratégies

| Critère | Cache-aside | Write-through | Write-behind |
| ------- | ----------- | ------------- | ------------ |
| Cohérence cache/base | Avec TTL | Immédiate | Retardée |
| Vitesse d'écriture | Normale | Plus lente (double écriture) | Très rapide |
| Vitesse de lecture | Cache miss au 1er accès | Toujours rapide | Toujours rapide |
| Risque de perte | Aucun | Aucun | Oui (entre cache et base) |
| Complexité | Faible | Moyenne | Élevée |
| Cas d'utilisation | Usage général | Données critiques | Compteurs, logs |

---

### L'invalidation du cache

**Définition** : L'invalidation du cache consiste à supprimer ou mettre à jour les données en cache quand les données sources changent. C'est considéré comme l'un des problèmes les plus difficiles en informatique.

> "There are only two hard things in Computer Science: cache invalidation and naming things." - Phil Karlton

**Les approches d'invalidation** :

#### 1. Invalidation par TTL

La donnée expire automatiquement après un temps défini.

```text
Avantage : Simple, aucun code d'invalidation à écrire
Inconvénient : Données obsolètes entre la modification et l'expiration du TTL
Usage : Données qui peuvent être légèrement obsolètes (pages de contenu, listes)
```

#### 2. Invalidation explicite

Tu supprimes manuellement la clé de cache quand la donnée source change.

```text
Avantage : Le cache est toujours à jour
Inconvénient : Tu dois identifier toutes les clés à invalider
Usage : Données critiques (prix, stock, informations utilisateur)
```

#### 3. Invalidation par tags

Tu assignes des tags aux éléments du cache. Quand une donnée change, tu invalides un tag et tous les éléments associés sont supprimés.

```text
Avantage : Invalide de nombreuses clés en une opération
Inconvénient : Nécessite un adaptateur compatible (Redis TagAware)
Usage : Données liées entre elles (produits d'une catégorie, articles d'un auteur)
```

#### 4. Invalidation par événement

Un événement Doctrine (postUpdate, postRemove) déclenche automatiquement l'invalidation du cache.

```text
Avantage : Automatique, pas besoin de penser à invalider manuellement
Inconvénient : Couplage entre Doctrine et le cache
Usage : Toute donnée gérée par Doctrine
```

**Tableau récapitulatif** :

| Approche | Fraîcheur des données | Complexité | Automatique |
| -------- | --------------------- | ---------- | ----------- |
| TTL | Retardée | Très faible | Oui |
| Explicite | Immédiate | Moyenne | Non |
| Tags | Immédiate | Moyenne | Semi |
| Événement | Immédiate | Faible | Oui |

---

### Le TTL optimal

**Définition** : Le TTL (Time To Live) détermine combien de temps une donnée reste en cache avant d'être automatiquement supprimée. Choisir le bon TTL est un compromis entre performance et fraîcheur des données.

**Guide de décision** :

| Type de données | Fréquence de changement | TTL recommandé |
| --------------- | ----------------------- | -------------- |
| Configuration site | Très rarement | 24 heures (86400s) |
| Page d'accueil | Quelques fois par jour | 1 heure (3600s) |
| Liste de produits | Plusieurs fois par jour | 15-30 minutes (900-1800s) |
| Résultat de recherche | À chaque recherche | 5 minutes (300s) |
| Données API externe | Selon l'API | 5-60 minutes |
| Données en temps réel | Constamment | Pas de cache ou TTL très court (10-30s) |

**Formule mentale** : Le TTL devrait être le temps maximum pendant lequel tu acceptes que les données soient obsolètes.

---

### Le cache stampede

**Définition** : Un cache stampede (aussi appelé "dog-pile effect" ou "thundering herd") se produit quand une clé de cache expire et que de nombreuses requêtes simultanées tentent toutes de recalculer la même donnée en même temps.

**Le problème** :

```text
Situation normale :
  100 requêtes → Redis (cache hit) → Réponse rapide

Cache stampede (la clé expire) :
  100 requêtes → Redis (cache miss) → 100 requêtes vers PostgreSQL
  PostgreSQL est surchargé, temps de réponse explose
  Toutes les 100 requêtes recalculent la même donnée en parallèle
```

**Analogie concrète** : Imagine un distributeur automatique qui se vide. 50 personnes attendent. Quand le technicien arrive pour le remplir, les 50 personnes se précipitent en même temps. Résultat : embouteillage. Il aurait mieux valu qu'une seule personne achète pendant que les autres attendent, puis que le distributeur soit rempli pour les suivants.

**Solutions** :

#### 1. Locking (verrouillage)

Quand une clé expire, le premier processus qui tente de la recalculer pose un verrou. Les autres processus attendent ou utilisent une valeur périmée.

```php
<?php
// src/Service/CacheService.php

namespace App\Service;

use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class CacheService
{
    public function __construct(
        private CacheInterface $cache,
    ) {
    }

    public function getWithLock(string $key, callable $callback, int $ttl = 3600): mixed
    {
        return $this->cache->get($key, function (ItemInterface $item) use ($callback, $ttl) {
            $item->expiresAfter($ttl);
            return $callback();
        });
        // Symfony Cache gère automatiquement le locking via le "cache contract"
        // Le premier processus recalcule, les autres attendent le résultat
    }
}
```

#### 2. Early expiration (expiration anticipée)

Le cache est rafraîchi avant l'expiration réelle du TTL. Un processus aléatoire (basé sur une probabilité) recalcule la donnée avant qu'elle expire.

```php
// Symfony supporte l'early expiration nativement via la beta du cache item
$products = $cache->get('all_products', function (ItemInterface $item) use ($repo) {
    $item->expiresAfter(3600);

    // Active l'early expiration
    // Le cache sera recalculé de manière probabiliste avant le TTL réel
    // La valeur 1.0 signifie : probabilité de recalcul augmente
    // quand on approche de l'expiration
    $item->tag(['products']);

    return $repo->findAll();
});
```

#### 3. Cache warming (préchauffage)

Un processus en arrière-plan rafraîchit régulièrement les clés de cache avant qu'elles n'expirent.

```php
<?php
// src/Command/CacheWarmProductsCommand.php

namespace App\Command;

use App\Repository\ProductRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

#[AsCommand(
    name: 'app:cache:warm-products',
    description: 'Préchauffage du cache des produits',
)]
class CacheWarmProductsCommand extends Command
{
    public function __construct(
        private CacheInterface $cache,
        private ProductRepository $productRepository,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Supprime l'ancien cache
        $this->cache->delete('all_products');

        // Recrée le cache avec les données fraîches
        $this->cache->get('all_products', function (ItemInterface $item) {
            $item->expiresAfter(3600);
            return $this->productRepository->findAll();
        });

        $io->success('Cache des produits réchauffé.');

        return Command::SUCCESS;
    }
}
```

```bash
# Exécute le préchauffage manuellement
php bin/console app:cache:warm-products

# Ou configure un CRON pour exécuter toutes les 50 minutes
# (avant l'expiration du TTL de 60 minutes)
# */50 * * * * cd /var/www && php bin/console app:cache:warm-products
```

---

## Étapes Pratiques

### Étape 1 : Implémenter le cache-aside

```php
<?php
// src/Service/ArticleCacheService.php

namespace App\Service;

use App\Repository\ArticleRepository;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

class ArticleCacheService
{
    public function __construct(
        #[Autowire(service: 'cache.articles')]
        private TagAwareCacheInterface $cache,
        private ArticleRepository $articleRepository,
    ) {
    }

    // Cache-aside : le cache est rempli à la demande (lazy loading)
    public function getArticle(int $id): ?array
    {
        return $this->cache->get("article_{$id}", function (ItemInterface $item) use ($id) {
            // Ce code n'est exécuté que lors d'un cache miss
            $item->expiresAfter(1800); // 30 minutes
            $item->tag(['articles', "article_{$id}"]);

            $article = $this->articleRepository->find($id);

            if (!$article) {
                return null;
            }

            // Retourne un tableau simple (pas l'entité Doctrine)
            return [
                'id' => $article->getId(),
                'title' => $article->getTitle(),
                'content' => $article->getContent(),
            ];
        });
    }

    // Cache-aside pour une liste
    public function getAllArticles(): array
    {
        return $this->cache->get('all_articles', function (ItemInterface $item) {
            $item->expiresAfter(900); // 15 minutes
            $item->tag(['articles']);

            $articles = $this->articleRepository->findBy([], ['createdAt' => 'DESC']);

            return array_map(fn($a) => [
                'id' => $a->getId(),
                'title' => $a->getTitle(),
            ], $articles);
        });
    }
}
```

---

### Étape 2 : Implémenter l'invalidation par événement Doctrine

```php
<?php
// src/EventListener/ArticleCacheListener.php

namespace App\EventListener;

use App\Entity\Article;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

// Cet attribut enregistre automatiquement ce listener pour l'entité Article
#[AsEntityListener(event: Events::postUpdate, entity: Article::class)]
#[AsEntityListener(event: Events::postPersist, entity: Article::class)]
#[AsEntityListener(event: Events::postRemove, entity: Article::class)]
class ArticleCacheListener
{
    public function __construct(
        #[Autowire(service: 'cache.articles')]
        private TagAwareCacheInterface $cache,
    ) {
    }

    // Appelé après la mise à jour d'un article
    public function postUpdate(Article $article): void
    {
        $this->invalidateCache($article);
    }

    // Appelé après la création d'un article
    public function postPersist(Article $article): void
    {
        // Invalide la liste des articles (pour inclure le nouvel article)
        $this->cache->invalidateTags(['articles']);
    }

    // Appelé après la suppression d'un article
    public function postRemove(Article $article): void
    {
        $this->invalidateCache($article);
    }

    private function invalidateCache(Article $article): void
    {
        // Invalide le cache de cet article spécifique ET la liste
        $this->cache->invalidateTags([
            'articles',
            "article_{$article->getId()}",
        ]);
    }
}
```

---

### Étape 3 : Implémenter le cache warming

```php
<?php
// src/Command/CacheWarmArticlesCommand.php

namespace App\Command;

use App\Service\ArticleCacheService;
use App\Repository\ArticleRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:cache:warm-articles',
    description: 'Préchauffage du cache des articles',
)]
class CacheWarmArticlesCommand extends Command
{
    public function __construct(
        private ArticleCacheService $articleCacheService,
        private ArticleRepository $articleRepository,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // 1. Rafraîchit la liste des articles
        $io->info('Préchauffage de la liste des articles...');
        $articles = $this->articleCacheService->getAllArticles();
        $io->info(sprintf('%d articles mis en cache.', count($articles)));

        // 2. Rafraîchit chaque article individuellement
        $io->info('Préchauffage des articles individuels...');
        $allArticles = $this->articleRepository->findAll();
        $count = 0;

        foreach ($allArticles as $article) {
            $this->articleCacheService->getArticle($article->getId());
            $count++;
        }

        $io->success(sprintf('Cache préchauffé : %d articles.', $count));

        return Command::SUCCESS;
    }
}
```

---

### Étape 4 : Implémenter un compteur avec write-behind

```php
<?php
// src/Service/ViewCounterService.php

namespace App\Service;

class ViewCounterService
{
    public function __construct(
        private \Redis $redis,
    ) {
    }

    // Incrémente le compteur dans Redis (très rapide)
    public function incrementViews(int $articleId): int
    {
        // INCR est atomique : pas de problème de concurrence
        return (int) $this->redis->incr("views:article:{$articleId}");
    }

    // Lit le compteur depuis Redis
    public function getViews(int $articleId): int
    {
        return (int) $this->redis->get("views:article:{$articleId}");
    }

    // Lit les compteurs de plusieurs articles
    public function getMultipleViews(array $articleIds): array
    {
        $keys = array_map(
            fn(int $id) => "views:article:{$id}",
            $articleIds
        );

        $values = $this->redis->mget($keys);

        $result = [];
        foreach ($articleIds as $index => $id) {
            $result[$id] = (int) ($values[$index] ?? 0);
        }

        return $result;
    }
}
```

---

### Étape 5 : Choisir la bonne stratégie

Voici un tableau de décision pour choisir la bonne stratégie :

```text
La donnée est-elle critique (prix, stock, solde) ?
├── OUI → Write-through (cache toujours à jour)
└── NON
    La donnée est-elle lue très fréquemment ?
    ├── OUI
    │   La donnée change-t-elle fréquemment ?
    │   ├── OUI → Cache-aside avec TTL court (1-5 min)
    │   └── NON → Cache-aside avec TTL long (30-60 min) + cache warming
    └── NON → Pas de cache (la base de données suffit)

La donnée est-elle un compteur ou un log ?
├── OUI → Write-behind (écriture asynchrone)
└── NON → Voir ci-dessus
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `$cache->get('clé', $callback)` | Cache-aside avec Symfony |
| `$cache->delete('clé')` | Invalidation explicite |
| `$cache->invalidateTags(['tag'])` | Invalidation par tags |
| `php bin/console cache:pool:clear cache.products` | Vide un pool entier |
| `php bin/console cache:pool:list` | Liste les pools |
| `MONITOR` (redis-cli) | Observe les commandes en temps réel |

---

## Pièges Fréquents

### Piège 1 : TTL trop long sur des données qui changent souvent

⚠️ **Problème** : Tu mets un TTL de 1 heure sur le prix d'un produit. Le prix change, mais les utilisateurs voient l'ancien prix pendant 1 heure maximum.

✅ **Solution** : Combine TTL et invalidation explicite. Le TTL est un filet de sécurité, mais l'invalidation immédiate garantit la fraîcheur :

```php
// 1. TTL comme filet de sécurité
$item->expiresAfter(3600);

// 2. Invalidation immédiate quand le prix change
$this->cache->invalidateTags(["product_{$productId}"]);
```

---

### Piège 2 : Ignorer le cache stampede

⚠️ **Problème** : Une clé de cache populaire expire. 500 requêtes simultanées tentent de recalculer la même donnée. PostgreSQL reçoit 500 requêtes identiques en même temps.

✅ **Solution** : Symfony Cache gère automatiquement le locking grâce au "cache contract" (`CacheInterface::get()`). Le premier processus recalcule, les autres attendent le résultat. Utilise toujours `$cache->get()` et non les méthodes PSR-6 directes.

---

### Piège 3 : Invalider tout le cache au lieu d'être précis

⚠️ **Problème** : Tu fais un `FLUSHDB` à chaque modification pour "être sûr que le cache est à jour". Toutes les données en cache sont perdues, les performances s'effondrent temporairement.

✅ **Solution** : Utilise les tags pour invalider uniquement ce qui a changé :

```php
// ❌ Tout invalider
$redis->flushDb();

// ✅ Invalider uniquement les caches liés aux produits
$cache->invalidateTags(['products']);
```

---

### Piège 4 : Mettre en cache des données qui changent constamment

⚠️ **Problème** : Tu mets en cache le solde bancaire d'un utilisateur qui fait des transactions toutes les secondes. Le cache est invalidé plus souvent qu'il n'est lu.

✅ **Solution** : Ne mets en cache que les données dont le ratio lecture/écriture est favorable. Si une donnée est modifiée plus souvent qu'elle n'est lue, le cache ajoute de la complexité sans bénéfice.

```text
Bon candidat pour le cache :
  Lectures: 1000/min  |  Écritures: 1/min  → Ratio 1000:1 ✅

Mauvais candidat pour le cache :
  Lectures: 5/min     |  Écritures: 10/min → Ratio 0.5:1 ❌
```

---

## Checklist de Validation

- [ ] Je sais expliquer les trois stratégies principales (cache-aside, write-through, write-behind)
- [ ] Je sais choisir la bonne stratégie selon le cas d'utilisation
- [ ] Je comprends les quatre approches d'invalidation (TTL, explicite, tags, événement)
- [ ] Je sais choisir un TTL adapté à la fréquence de changement des données
- [ ] Je comprends le problème du cache stampede et ses solutions
- [ ] Je sais implémenter un cache warming avec une commande Symfony
- [ ] Je sais implémenter l'invalidation automatique avec un listener Doctrine

---

## Exercice Pratique

**Énoncé** : Implémente un système de cache complet pour un catalogue de produits avec les stratégies appropriées.

**Indications** :

- Crée un `ProductCacheService` qui utilise le cache-aside pour les lectures
- Configure un listener Doctrine qui invalide le cache par tags quand un produit est modifié
- Crée un compteur de vues avec la stratégie write-behind (INCR dans Redis)
- Crée une commande de cache warming qui pré-remplit le cache des 100 produits les plus vus
- Teste que :
  - La première lecture d'un produit fait une requête SQL (cache miss)
  - La deuxième lecture est servie depuis Redis (cache hit)
  - La modification d'un produit invalide automatiquement le cache
  - Le compteur de vues s'incrémente sans toucher à PostgreSQL

**Résultat attendu** : Le catalogue de produits utilise Redis de manière optimale avec des stratégies adaptées à chaque type de donnée.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```yaml
# config/packages/cache.yaml
framework:
    cache:
        app: cache.adapter.redis
        default_redis_provider: '%env(REDIS_URL)%'
        pools:
            cache.products:
                adapter: cache.adapter.redis_tag_aware
                default_lifetime: 1800
```

```php
<?php
// src/Service/ProductCacheService.php

namespace App\Service;

use App\Repository\ProductRepository;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

class ProductCacheService
{
    public function __construct(
        #[Autowire(service: 'cache.products')]
        private TagAwareCacheInterface $cache,
        private ProductRepository $productRepository,
        private \Redis $redis,
    ) {
    }

    // Cache-aside pour un produit
    public function getProduct(int $id): ?array
    {
        return $this->cache->get("product_{$id}", function (ItemInterface $item) use ($id) {
            $item->expiresAfter(1800);
            $item->tag(['products', "product_{$id}"]);

            $product = $this->productRepository->find($id);
            if (!$product) {
                return null;
            }

            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'views' => $this->getViews($id),
            ];
        });
    }

    // Cache-aside pour la liste
    public function getTopProducts(int $limit = 100): array
    {
        return $this->cache->get("top_products_{$limit}", function (ItemInterface $item) use ($limit) {
            $item->expiresAfter(900);
            $item->tag(['products']);

            $products = $this->productRepository->findBy([], ['id' => 'DESC'], $limit);

            return array_map(fn($p) => [
                'id' => $p->getId(),
                'name' => $p->getName(),
                'price' => $p->getPrice(),
            ], $products);
        });
    }

    // Write-behind : compteur de vues
    public function incrementViews(int $productId): int
    {
        return (int) $this->redis->incr("views:product:{$productId}");
    }

    public function getViews(int $productId): int
    {
        return (int) $this->redis->get("views:product:{$productId}");
    }
}
```

```php
<?php
// src/EventListener/ProductCacheListener.php

namespace App\EventListener;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

#[AsEntityListener(event: Events::postUpdate, entity: Product::class)]
#[AsEntityListener(event: Events::postPersist, entity: Product::class)]
#[AsEntityListener(event: Events::postRemove, entity: Product::class)]
class ProductCacheListener
{
    public function __construct(
        #[Autowire(service: 'cache.products')]
        private TagAwareCacheInterface $cache,
    ) {
    }

    public function postUpdate(Product $product): void
    {
        $this->cache->invalidateTags(['products', "product_{$product->getId()}"]);
    }

    public function postPersist(Product $product): void
    {
        $this->cache->invalidateTags(['products']);
    }

    public function postRemove(Product $product): void
    {
        $this->cache->invalidateTags(['products', "product_{$product->getId()}"]);
    }
}
```

```php
<?php
// src/Command/CacheWarmProductsCommand.php

namespace App\Command;

use App\Service\ProductCacheService;
use App\Repository\ProductRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:cache:warm-products',
    description: 'Préchauffage du cache des produits',
)]
class CacheWarmProductsCommand extends Command
{
    public function __construct(
        private ProductCacheService $productCacheService,
        private ProductRepository $productRepository,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Préchauffage de la liste
        $top = $this->productCacheService->getTopProducts(100);
        $io->info(sprintf('Liste de %d produits mise en cache.', count($top)));

        // Préchauffage individuel des 100 premiers produits
        $products = $this->productRepository->findBy([], ['id' => 'DESC'], 100);
        foreach ($products as $product) {
            $this->productCacheService->getProduct($product->getId());
        }

        $io->success(sprintf('Cache préchauffé : %d produits.', count($products)));

        return Command::SUCCESS;
    }
}
```

---

## Navigation

← Fiche précédente : **[Redis dans Symfony - Sessions](05-redis-symfony-sessions.md)**

→ Fiche suivante : **[Redis comme transport Messenger](07-redis-transport-messenger.md)**
