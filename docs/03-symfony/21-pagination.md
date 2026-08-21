---
tags:
  - Symfony
  - Avancé
  - Pratique
description: "Paginer de grandes listes dans Symfony : problème des requêtes lourdes, KnpPaginatorBundle, alternative Pagerfanta, pagination Doctrine manuelle, intégration Twig et pagination d'API JSON."
estimated_time: "70 min"
fiche_number: 21
total_fiches: 21
cursus: "Symfony"
id: "web.symfony.pagination"
course_id: "web.symfony"
content_type: "lesson"
order: 21
---

# 21 - Pagination des résultats

> **En bref** : Découper une grande liste de résultats en pages pour éviter de tout charger d'un coup. Tu apprendras à paginer avec KnpPaginatorBundle, à connaître l'alternative Pagerfanta, à écrire une pagination Doctrine manuelle, à l'afficher dans Twig et à paginer une réponse d'API JSON. Lecture estimée : 70 min.

## Prérequis

- Avoir lu la fiche **[08 - Repository et CRUD](08-repository-crud.md)**
- Avoir lu la fiche **[03 - Templates Twig](03-templates-twig.md)**
- Avoir lu la fiche **[16 - API JSON](16-api-json.md)** (pour la pagination d'API)
- Savoir écrire une requête simple avec un repository Doctrine

## Objectif de cette fiche

À la fin de cette fiche, tu sauras pourquoi paginer, installer et utiliser KnpPaginatorBundle, écrire une pagination Doctrine manuelle avec `Paginator`, afficher des liens de pages dans Twig, et construire une réponse JSON paginée pour une API.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la pagination ?

**Définition** : La pagination est le découpage d'un grand ensemble de résultats en sous-ensembles de taille fixe (les pages). L'utilisateur consulte une page à la fois et navigue entre elles avec des liens.

**Le problème que la pagination résout** :

Sans pagination, voici les problèmes rencontrés :

1. **Surcharge mémoire** : Charger 50 000 articles d'un coup remplit la mémoire du serveur PHP et peut provoquer une erreur fatale.
2. **Page lente** : Le navigateur doit afficher des milliers de lignes, ce qui fige la page côté client.
3. **Transfert inutile** : L'utilisateur ne regarde que les premiers résultats, mais le serveur transfère l'intégralité de la liste.

**Comment la pagination résout ces problèmes** :

| Problème | Solution apportée par la pagination |
| ------------------- | ---------------------------------------------- |
| Surcharge mémoire | Seuls N résultats sont chargés à la fois |
| Page lente | Le navigateur affiche une page de taille fixe |
| Transfert inutile | Seule la page demandée est transmise |

**Analogie concrète** : Pense à un livre. Tu ne lis pas un roman sur une seule feuille de papier de plusieurs mètres : le texte est découpé en pages numérotées. Tu lis la page 12, puis tu tournes vers la page 13. La pagination d'une liste fonctionne pareil : tu affiches une page de résultats et tu navigues vers la suivante.

**Ce que la pagination n'est PAS** :

- La pagination n'est pas un filtre. Un filtre réduit l'ensemble selon un critère (ex : articles publiés). La pagination découpe l'ensemble complet en pages. Les deux se combinent souvent.
- La pagination n'est pas du cache. Le cache stocke un résultat pour le réutiliser. La pagination limite ce qui est récupéré à chaque requête.

---

### LIMIT, OFFSET et numéro de page

**Définition** : `LIMIT` est le nombre maximum de lignes à récupérer. `OFFSET` est le nombre de lignes à sauter avant de commencer. Ensemble, ils permettent de récupérer une page précise depuis la base de données.

**Le problème que LIMIT et OFFSET résolvent** :

La base de données peut contenir des millions de lignes. Il faut un moyen de dire "donne-moi seulement les lignes 41 à 60". `LIMIT` et `OFFSET` expriment exactement cette demande.

**La formule du calcul** :

```text
OFFSET = (numéro_de_page - 1) × résultats_par_page

Exemple avec 20 résultats par page :
  Page 1 -> OFFSET = (1 - 1) × 20 = 0   (lignes 1 à 20)
  Page 2 -> OFFSET = (2 - 1) × 20 = 20  (lignes 21 à 40)
  Page 3 -> OFFSET = (3 - 1) × 20 = 40  (lignes 41 à 60)
```

**Comment ça se traduit en SQL** :

```sql
-- Page 3, 20 résultats par page
SELECT * FROM article
ORDER BY created_at DESC
LIMIT 20 OFFSET 40;
```

**Analogie concrète** : Imagine une pile de 1000 photos. `OFFSET 40` signifie "écarte les 40 premières photos". `LIMIT 20` signifie "prends ensuite les 20 suivantes". Tu obtiens les photos 41 à 60 sans manipuler les 940 autres.

**Ce que LIMIT et OFFSET ne sont PAS** :

- `LIMIT`/`OFFSET` ne garantissent pas un ordre stable sans `ORDER BY`. Sans tri explicite, la base peut renvoyer les lignes dans un ordre variable, et une même ligne pourrait apparaître sur deux pages. Toujours associer un `ORDER BY`.

---

### Le compte total et le nombre de pages

**Définition** : Pour afficher des liens de navigation (page 1, 2, 3... dernière page), il faut connaître le nombre total de résultats. Le nombre de pages se calcule à partir de ce total et du nombre de résultats par page.

**Le problème que le compte total résout** :

Afficher une page suffit pour LIMIT/OFFSET. Mais pour construire la barre de navigation, l'application doit savoir combien de pages existent au total. Cela nécessite une requête de comptage.

**La formule du nombre de pages** :

```text
nombre_de_pages = arrondi_au_supérieur(total_résultats / résultats_par_page)

Exemple : 95 résultats, 20 par page
  95 / 20 = 4,75
  arrondi au supérieur -> 5 pages
```

**Comment Doctrine fournit ce compte** :

L'objet `Paginator` de Doctrine exécute au minimum deux requêtes : un `COUNT` pour le total, et une requête pour récupérer les résultats de la page (avec LIMIT/OFFSET). Selon le mode actif (voir le piège sur les jointures `fetch`), la récupération de la page peut se faire en deux requêtes plutôt qu'une. La fonction PHP `count($paginator)` renvoie le total complet, pas seulement la page courante.

**Analogie concrète** : Le compte total est comme le numéro de la dernière page imprimé au bas d'un document ("page 3 sur 12"). Sans ce "sur 12", tu ne saurais pas combien il reste de pages à lire. La requête `COUNT` fournit ce "sur 12".

**Ce que le compte total n'est PAS** :

- Le compte total n'est pas gratuit. La requête `COUNT` a un coût. Sur des tables énormes, ce coût peut devenir notable. Certaines stratégies (pagination par curseur) évitent le `COUNT` global, mais sortent du cadre de cette fiche.

---

### KnpPaginatorBundle vs Pagerfanta

**Définition** : Symfony n'inclut pas de paginateur prêt à l'emploi. Deux bundles populaires comblent ce manque : **KnpPaginatorBundle** et **Pagerfanta**. Les deux gèrent le calcul des pages et l'affichage des liens.

**Le problème que ces bundles résolvent** :

Écrire à la main le calcul de l'OFFSET, la requête de comptage et le rendu des liens de pages est répétitif et source d'erreurs. Ces bundles encapsulent cette mécanique.

**Comparaison KnpPaginatorBundle vs Pagerfanta** :

| Caractéristique | KnpPaginatorBundle | Pagerfanta |
| --------------------- | ---------------------------------- | ----------------------------------- |
| Mise en route | Très simple, une méthode `paginate()` | Un peu plus de configuration |
| Lecture des paramètres | Lit la requête HTTP automatiquement | Tu passes la page explicitement |
| Souplesse | Bonne pour les cas courants | Très flexible, nombreux adaptateurs |
| Rendu Twig | Fonction `knp_pagination_render()` | Fonction `pagerfanta()` |
| Cas d'usage | Listes web classiques | Cas avancés, sources de données variées |

**Analogie concrète** : Choisir entre ces deux bundles, c'est comme choisir entre deux modèles de cafetière. KnpPaginatorBundle est la cafetière à un bouton : tu appuies, ça marche pour le café quotidien. Pagerfanta est la machine à expresso avec réglages : plus de possibilités, un peu plus à apprendre. Pour une liste web standard, KnpPaginatorBundle suffit largement.

**Ce que ces bundles ne sont PAS** :

- Ces bundles ne sont pas incompatibles avec Doctrine. Au contraire, ils s'appuient sur les requêtes Doctrine. Tu leur passes une requête (un `QueryBuilder` ou une `Query`), ils gèrent le découpage.

---

## Étapes Pratiques

### Étape 1 : Installer KnpPaginatorBundle

Installe le bundle avec Composer. Symfony Flex enregistre automatiquement le bundle.

```bash
# Installe le paginateur KnpPaginatorBundle
composer require knplabs/knp-paginator-bundle
```

**Résultat attendu** :

```text
Using version ^6.6 for knplabs/knp-paginator-bundle
./composer.json has been updated
Symfony operations: 1 recipe
  - Configuring knplabs/knp-paginator-bundle
Package operations: 1 install, 0 updates, 0 removals
```

Le service `PaginatorInterface` est désormais disponible pour l'autowiring.

---

### Étape 2 : Préparer une requête paginable dans le repository

Le paginateur prend en entrée une requête, pas un tableau de résultats. Expose un `QueryBuilder` (sans exécuter la requête) depuis le repository.

```php
<?php
// src/Repository/ArticleRepository.php

namespace App\Repository;

use App\Entity\Article;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

class ArticleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Article::class);
    }

    /**
     * Retourne le QueryBuilder des articles publiés, du plus récent au plus ancien.
     * On ne renvoie PAS les résultats : le paginateur a besoin de la requête
     * pour appliquer lui-même le LIMIT et l'OFFSET.
     */
    public function createPublishedQueryBuilder(): QueryBuilder
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.status = :status')
            ->setParameter('status', 'published')
            ->orderBy('a.createdAt', 'DESC');  // Tri obligatoire pour un ordre stable
    }
}
```

**Résultat attendu** : Une méthode qui retourne un `QueryBuilder` configuré, prêt à être paginé. La requête n'est pas encore exécutée à ce stade.

---

### Étape 3 : Paginer dans le contrôleur

Injecte `PaginatorInterface` et appelle `paginate()` en lui passant la requête, le numéro de page lu dans l'URL, et le nombre de résultats par page.

```php
<?php
// src/Controller/ArticleController.php

namespace App\Controller;

use App\Repository\ArticleRepository;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ArticleController extends AbstractController
{
    #[Route('/articles', name: 'article_list', methods: ['GET'])]
    public function list(
        Request $request,
        ArticleRepository $articleRepository,
        PaginatorInterface $paginator,  // Le paginateur, injecté par autowiring
    ): Response {
        // Récupère la requête (QueryBuilder) à paginer
        $query = $articleRepository->createPublishedQueryBuilder();

        // Lit le numéro de page dans l'URL (?page=2), 1 par défaut
        $pageNumber = $request->query->getInt('page', 1);

        // paginate() applique le LIMIT/OFFSET et exécute la requête de comptage
        $pagination = $paginator->paginate(
            $query,        // La requête à paginer
            $pageNumber,   // La page demandée
            20,            // Nombre de résultats par page
        );

        return $this->render('article/list.html.twig', [
            'pagination' => $pagination,
        ]);
    }
}
```

**Résultat attendu** :

```text
GET /articles         -> page 1 (résultats 1 à 20)
GET /articles?page=2  -> page 2 (résultats 21 à 40)
GET /articles?page=3  -> page 3 (résultats 41 à 60)
```

---

### Étape 4 : Afficher la pagination dans Twig

L'objet `pagination` est itérable (il contient les résultats de la page) et fournit une fonction Twig pour afficher les liens de navigation.

```twig
{# templates/article/list.html.twig #}

<h1>Liste des articles</h1>

<ul>
    {# On itère sur les résultats de la page courante #}
    {% for article in pagination %}
        <li>{{ article.title }}</li>
    {% endfor %}
</ul>

{# Affiche les liens de navigation (précédent, numéros, suivant) #}
<div class="pagination">
    {{ knp_pagination_render(pagination) }}
</div>
```

**Résultat attendu** : La page affiche 20 articles et une barre de navigation cliquable. Chaque lien conserve les autres paramètres de l'URL (filtres, tri) en plus de `?page=N`.

```html
<div class="pagination">
    <span class="prev disabled">Précédent</span>
    <span class="current">1</span>
    <a href="/articles?page=2">2</a>
    <a href="/articles?page=3">3</a>
    <a class="next" href="/articles?page=2">Suivant</a>
</div>
```

---

### Étape 5 : Trier de façon cliquable avec KnpPaginatorBundle

KnpPaginatorBundle gère aussi le tri par colonne. Déclare les champs triables dans `paginate()`, puis génère des en-têtes cliquables dans Twig.

```php
<?php

// Dans le contrôleur, autorise le tri sur certains champs
$pagination = $paginator->paginate(
    $query,
    $pageNumber,
    20,
    [
        // Liste blanche des champs autorisés au tri (évite l'injection)
        'sortFieldAllowList' => ['a.title', 'a.createdAt'],
    ],
);
```

Dans le template, génère des liens de tri :

```twig
{# En-têtes de colonne cliquables pour trier #}
<table>
    <thead>
        <tr>
            <th>{{ knp_pagination_sortable(pagination, 'Titre', 'a.title') }}</th>
            <th>{{ knp_pagination_sortable(pagination, 'Date', 'a.createdAt') }}</th>
        </tr>
    </thead>
    <tbody>
        {% for article in pagination %}
            <tr>
                <td>{{ article.title }}</td>
                <td>{{ article.createdAt|date('d/m/Y') }}</td>
            </tr>
        {% endfor %}
    </tbody>
</table>
```

**Résultat attendu** : Cliquer sur l'en-tête "Titre" recharge la liste triée par titre. L'URL devient `?page=1&sort=a.title&direction=asc`. Un second clic inverse le sens du tri.

---

### Étape 6 : Pagination Doctrine manuelle (sans bundle)

Tu peux paginer sans bundle avec l'objet `Paginator` fourni par Doctrine. Utile pour comprendre le mécanisme ou éviter une dépendance.

```php
<?php
// src/Repository/ArticleRepository.php (méthode ajoutée)

use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * Pagination manuelle : retourne un objet Paginator de Doctrine.
 *
 * @return Paginator<Article>
 */
public function findPaginated(int $page, int $perPage): Paginator
{
    // Construit la requête avec LIMIT et OFFSET calculés
    $query = $this->createQueryBuilder('a')
        ->orderBy('a.createdAt', 'DESC')
        ->setFirstResult(($page - 1) * $perPage)  // OFFSET
        ->setMaxResults($perPage)                 // LIMIT
        ->getQuery();

    // L'objet Paginator gère la requête de page ET la requête COUNT
    return new Paginator($query);
}
```

Dans le contrôleur :

```php
<?php

$page = $request->query->getInt('page', 1);
$perPage = 20;

// Récupère l'objet Paginator
$paginator = $articleRepository->findPaginated($page, $perPage);

// count() renvoie le TOTAL des résultats (pas seulement la page)
$total = count($paginator);

// Calcule le nombre de pages (division arrondie au supérieur)
$lastPage = (int) ceil($total / $perPage);

return $this->render('article/list_manual.html.twig', [
    'articles' => $paginator,   // Itérable : contient les résultats de la page
    'page' => $page,
    'lastPage' => $lastPage,
    'total' => $total,
]);
```

**Résultat attendu** :

```text
total = 95, perPage = 20
  -> lastPage = ceil(95 / 20) = 5
  -> page 1 affiche les articles 1 à 20
  -> page 5 affiche les articles 81 à 95
```

---

### Étape 7 : Afficher une pagination manuelle dans Twig

Sans bundle, tu construis toi-même les liens de navigation à partir des variables `page` et `lastPage`.

```twig
{# templates/article/list_manual.html.twig #}

<ul>
    {% for article in articles %}
        <li>{{ article.title }}</li>
    {% endfor %}
</ul>

<nav class="pagination">
    {# Lien vers la page précédente, masqué sur la première page #}
    {% if page > 1 %}
        <a href="{{ path('article_list', {page: page - 1}) }}">Précédent</a>
    {% endif %}

    {# Indicateur "page X sur Y" #}
    <span>Page {{ page }} sur {{ lastPage }}</span>

    {# Lien vers la page suivante, masqué sur la dernière page #}
    {% if page < lastPage %}
        <a href="{{ path('article_list', {page: page + 1}) }}">Suivant</a>
    {% endif %}
</nav>
```

**Résultat attendu** :

```text
Sur la page 3 (sur 5) :
  [Précédent]  Page 3 sur 5  [Suivant]

Sur la page 1 :
  Page 1 sur 5  [Suivant]    (pas de "Précédent")

Sur la page 5 :
  [Précédent]  Page 5 sur 5  (pas de "Suivant")
```

---

### Étape 8 : Paginer une réponse d'API JSON

Pour une API, tu ne renvoies pas de HTML : tu structures la réponse JSON avec les données et les métadonnées de pagination.

```php
<?php
// src/Controller/Api/ArticleApiController.php

namespace App\Controller\Api;

use App\Repository\ArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class ArticleApiController extends AbstractController
{
    #[Route('/api/articles', name: 'api_article_list', methods: ['GET'])]
    public function list(
        Request $request,
        ArticleRepository $articleRepository,
    ): JsonResponse {
        $page = max(1, $request->query->getInt('page', 1));
        $perPage = 20;

        // Réutilise la pagination Doctrine manuelle de l'étape 6
        $paginator = $articleRepository->findPaginated($page, $perPage);
        $total = count($paginator);

        // Transforme chaque entité en tableau simple pour le JSON
        $items = [];
        foreach ($paginator as $article) {
            $items[] = [
                'id' => $article->getId(),
                'title' => $article->getTitle(),
            ];
        }

        // Structure la réponse : données + métadonnées de pagination
        return $this->json([
            'data' => $items,
            'pagination' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => (int) ceil($total / $perPage),
            ],
        ]);
    }
}
```

**Résultat attendu** :

```json
{
    "data": [
        { "id": 41, "title": "Titre de l'article 41" },
        { "id": 42, "title": "Titre de l'article 42" }
    ],
    "pagination": {
        "page": 3,
        "per_page": 20,
        "total": 95,
        "last_page": 5
    }
}
```

> **Note** : Pour une API REST complète, le format des métadonnées de pagination et les liens de navigation (`next`, `prev`) sont approfondis dans la fiche **[Pagination, filtrage et tri](../12-api-design/02-pagination-filtrage-tri.md)** du cursus API Design.

---

## Commandes Utiles

| Commande ou expression | Action |
| -------------------------------------------------- | --------------------------------------------- |
| `composer require knplabs/knp-paginator-bundle` | Installer KnpPaginatorBundle |
| `composer require babdev/pagerfanta-bundle` | Installer Pagerfanta (alternative) |
| `$paginator->paginate($query, $page, $perPage)` | Paginer une requête avec Knp |
| `new Paginator($query)` | Paginer manuellement avec Doctrine |
| `count($paginator)` | Obtenir le total de résultats |
| `setFirstResult($offset)` | Définir l'OFFSET sur un QueryBuilder |
| `setMaxResults($limit)` | Définir le LIMIT sur un QueryBuilder |
| `knp_pagination_render(pagination)` | Afficher les liens de pages dans Twig |

---

## Pièges Fréquents

### Piège 1 : Pagination sans ORDER BY

⚠️ **Problème** : Tu pagines une liste sans tri explicite. Un même article apparaît parfois sur deux pages, ou disparaît entre deux navigations.

✅ **Solution** : Sans `ORDER BY`, la base de données n'a aucune obligation de renvoyer les lignes dans un ordre constant. Le LIMIT/OFFSET découpe alors un ensemble instable. Ajoute toujours un tri sur un champ unique ou quasi unique.

```php
<?php

// ❌ Ordre non garanti : pagination instable
$this->createQueryBuilder('a')->setMaxResults(20);

// ✅ Tri explicite : pagination stable
$this->createQueryBuilder('a')
    ->orderBy('a.createdAt', 'DESC')
    ->addOrderBy('a.id', 'DESC')  // Départage les dates identiques
    ->setMaxResults(20);
```

---

### Piège 2 : Charger tous les résultats avant de paginer

⚠️ **Problème** : Tu fais `findAll()` puis tu découpes le tableau en PHP avec `array_slice()`. La base charge quand même toutes les lignes en mémoire.

✅ **Solution** : La pagination doit se faire au niveau de la requête SQL (LIMIT/OFFSET), pas en PHP après coup. Passe une requête non exécutée au paginateur.

```php
<?php

// ❌ Charge les 50 000 articles puis en garde 20 : surcharge mémoire
$all = $repository->findAll();
$page = array_slice($all, 0, 20);

// ✅ La base ne renvoie que 20 lignes
$pagination = $paginator->paginate($queryBuilder, 1, 20);
```

---

### Piège 3 : Numéro de page invalide non contrôlé

⚠️ **Problème** : Un utilisateur passe `?page=0` ou `?page=-5`. L'OFFSET calculé devient négatif et la requête échoue ou renvoie un résultat inattendu.

✅ **Solution** : Force un minimum de 1 sur le numéro de page lu depuis l'URL.

```php
<?php

// max(1, ...) garantit que la page vaut au moins 1
$page = max(1, $request->query->getInt('page', 1));
```

Pour une API, tu peux aussi renvoyer une erreur 400 si la page demandée dépasse `last_page`.

---

### Piège 4 : Pagination cassée avec les jointures fetch

⚠️ **Problème** : Tu utilises une jointure `fetch` (chargement d'une collection liée) avec un LIMIT. Le nombre de résultats par page est faux, car la jointure multiplie les lignes SQL.

✅ **Solution** : L'objet `Paginator` de Doctrine gère ce cas grâce à son mode `fetchJoinCollection`. Avec KnpPaginatorBundle, le comportement est automatique. En pagination manuelle, active l'option dans le constructeur.

```php
<?php

use Doctrine\ORM\Tools\Pagination\Paginator;

// Le deuxième argument true active la gestion des jointures de collection
$paginator = new Paginator($query, fetchJoinCollection: true);
```

---

### Piège 5 : Oublier de conserver les filtres dans les liens de page

⚠️ **Problème** : Ta liste est filtrée (`?category=php`), mais cliquer sur "page 2" perd le filtre et réaffiche tous les articles.

✅ **Solution** : Les liens de pagination doivent conserver tous les paramètres de l'URL. KnpPaginatorBundle le fait automatiquement. En pagination manuelle, repasse explicitement les paramètres existants.

```twig
{# Conserve le filtre category en plus du numéro de page #}
<a href="{{ path('article_list', {page: page + 1, category: app.request.query.get('category')}) }}">
    Suivant
</a>
```

---

## Checklist de Validation

- [ ] Je comprends pourquoi paginer (mémoire, performance, transfert)
- [ ] Je connais le rôle de `LIMIT`, `OFFSET` et la formule de l'OFFSET
- [ ] Je sais calculer le nombre de pages à partir du total
- [ ] J'ai installé KnpPaginatorBundle et utilisé `PaginatorInterface`
- [ ] Je sais passer un `QueryBuilder` non exécuté au paginateur
- [ ] Je sais afficher les liens de pages dans Twig avec `knp_pagination_render`
- [ ] Je sais écrire une pagination Doctrine manuelle avec `Paginator`
- [ ] Je connais l'alternative Pagerfanta
- [ ] Je sais structurer une réponse JSON paginée (data + pagination)
- [ ] Je pense toujours à mettre un `ORDER BY` stable

---

## Exercice Pratique

**Énoncé** : Pagine une liste de produits (`Product`) à la fois pour une page web (avec KnpPaginatorBundle) et pour une API JSON (avec pagination Doctrine manuelle).

**Spécifications** :

1. Dans `ProductRepository`, crée une méthode `createActiveQueryBuilder()` qui retourne un `QueryBuilder` des produits actifs (`status = 'active'`), triés par `name` croissant.
2. Crée une route web `GET /products` dans `ProductController` qui :
   - Lit la page dans `?page=` (1 par défaut).
   - Pagine avec `PaginatorInterface`, 15 produits par page.
   - Rend un template `product/list.html.twig` affichant les produits et `knp_pagination_render`.
3. Ajoute dans `ProductRepository` une méthode `findPaginated(int $page, int $perPage): Paginator` (pagination Doctrine manuelle, triée par `name`).
4. Crée une route API `GET /api/products` qui renvoie un JSON structuré avec `data` (id, name de chaque produit) et `pagination` (page, per_page, total, last_page), 15 par page.
5. Protège le numéro de page avec `max(1, ...)`.

**Indications** :

- Le `QueryBuilder` web ne doit pas être exécuté avant `paginate()`.
- En manuel, `count($paginator)` donne le total, `ceil($total / $perPage)` donne la dernière page.
- Pense au tri (`ORDER BY name`) pour une pagination stable.

**Résultat attendu** : `GET /products?page=2` affiche les produits 16 à 30 avec une barre de navigation. `GET /api/products?page=2` renvoie un JSON avec les 15 produits de la page 2 et les métadonnées correctes.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 et 3 : Le repository `src/Repository/ProductRepository.php`**

```php
<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    /**
     * QueryBuilder des produits actifs, triés par nom (pour la pagination web).
     */
    public function createActiveQueryBuilder(): QueryBuilder
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.status = :status')
            ->setParameter('status', 'active')
            ->orderBy('p.name', 'ASC');
    }

    /**
     * Pagination Doctrine manuelle (pour l'API JSON).
     *
     * @return Paginator<Product>
     */
    public function findPaginated(int $page, int $perPage): Paginator
    {
        $query = $this->createQueryBuilder('p')
            ->orderBy('p.name', 'ASC')
            ->setFirstResult(($page - 1) * $perPage)
            ->setMaxResults($perPage)
            ->getQuery();

        return new Paginator($query);
    }
}
```

**Étape 2 : Le contrôleur web `src/Controller/ProductController.php`**

```php
<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ProductController extends AbstractController
{
    #[Route('/products', name: 'product_list', methods: ['GET'])]
    public function list(
        Request $request,
        ProductRepository $productRepository,
        PaginatorInterface $paginator,
    ): Response {
        $query = $productRepository->createActiveQueryBuilder();
        $page = max(1, $request->query->getInt('page', 1));

        $pagination = $paginator->paginate($query, $page, 15);

        return $this->render('product/list.html.twig', [
            'pagination' => $pagination,
        ]);
    }
}
```

**Template `templates/product/list.html.twig`** :

```twig
<h1>Produits</h1>

<ul>
    {% for product in pagination %}
        <li>{{ product.name }}</li>
    {% endfor %}
</ul>

<div class="pagination">
    {{ knp_pagination_render(pagination) }}
</div>
```

**Étape 4 : Le contrôleur API `src/Controller/Api/ProductApiController.php`**

```php
<?php

namespace App\Controller\Api;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

final class ProductApiController extends AbstractController
{
    #[Route('/api/products', name: 'api_product_list', methods: ['GET'])]
    public function list(
        Request $request,
        ProductRepository $productRepository,
    ): JsonResponse {
        $page = max(1, $request->query->getInt('page', 1));
        $perPage = 15;

        $paginator = $productRepository->findPaginated($page, $perPage);
        $total = count($paginator);

        $items = [];
        foreach ($paginator as $product) {
            $items[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
            ];
        }

        return $this->json([
            'data' => $items,
            'pagination' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'last_page' => (int) ceil($total / $perPage),
            ],
        ]);
    }
}
```

**Vérification du comportement** :

```text
GET /products?page=2 :
  Affiche les produits 16 à 30 (triés par nom)
  Barre de navigation cliquable

GET /api/products?page=2 (total = 47 produits) :
  data : 15 produits de la page 2
  pagination : { page: 2, per_page: 15, total: 47, last_page: 4 }
```

**Explication de la solution** :

| Élément | Rôle |
| ----------------------------- | ------------------------------------------------- |
| `createActiveQueryBuilder()` | Requête non exécutée, passée au paginateur web |
| `PaginatorInterface::paginate` | Applique LIMIT/OFFSET et le COUNT automatiquement |
| `knp_pagination_render` | Génère les liens de pages dans Twig |
| `findPaginated()` + `Paginator` | Pagination manuelle pour l'API |
| `count($paginator)` | Total des résultats (pas la page) |
| `max(1, ...)` | Protège contre les numéros de page invalides |
| `ORDER BY name` | Garantit une pagination stable |

---

## Navigation

← Fiche précédente : **[Traductions et internationalisation](20-traductions.md)**

→ Retour à l'index : **[Cursus Symfony](index.md)**
