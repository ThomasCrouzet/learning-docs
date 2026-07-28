---
tags:
  - Architecture
  - Doctrine
  - Avancé
description: "Filtres Doctrine : injecter automatiquement une clause WHERE sur toutes les requêtes d'une entité. Idéal pour soft delete et multi-tenancy."
estimated_time: "60 min"
fiche_number: 16
total_fiches: 17
cursus: "Architecture et Design Patterns"
---

# 16 - Filtres Doctrine : isolation transparente

> **En bref** : Un filtre Doctrine ajoute automatiquement une clause WHERE à toutes les requêtes d'une entité, sans intervention du développeur. Parfait pour appliquer soft delete et multi-tenancy de façon transparente et infaillible. Lecture estimée : 60 min.

## Prérequis

- Fiche 12 : [Multi-tenancy](12-multi-tenancy.md)
- Fiche 13 : [Soft delete](13-soft-delete.md)
- Fiche [Repository et CRUD](../03-symfony/08-repository-crud.md) du cursus Symfony

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un filtre Doctrine personnalisé, l'activer globalement, le désactiver ponctuellement (pour l'admin), et tester son comportement.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un filtre Doctrine ?

**Définition** : Un filtre Doctrine est un `SQLFilter` qui injecte automatiquement une clause SQL dans toutes les requêtes ORM ciblant une entité donnée. Le filtre s'active globalement et s'applique sans que le développeur n'ait à écrire la clause à chaque requête.

**Le problème que les filtres Doctrine résolvent** :

Sans filtre Doctrine, voici les problèmes rencontrés :

1. **Répétition fragile** : il faut écrire `WHERE tenant_id = X` ou `WHERE deleted_at IS NULL` dans chaque requête, chaque `findBy`, chaque DQL.
2. **Un oubli = une fuite** : un seul Repository qui oublie la clause expose les données d'un autre tenant ou affiche des entités supprimées.
3. **Difficile à auditer** : impossible de garantir par lecture que toutes les requêtes respectent la règle.

**Comment les filtres Doctrine résolvent ces problèmes** :

| Problème | Solution apportée par les filtres Doctrine |
| --- | --- |
| Répétition fragile | La clause est écrite une seule fois dans le filtre |
| Un oubli = une fuite | Le filtre s'applique automatiquement à toutes les requêtes |
| Difficile à auditer | Une seule classe à relire pour garantir la règle |

**Analogie concrète** : Pense à un filtre à café posé sur une cafetière. Chaque tasse que tu sers passe forcément par le filtre, sans que tu aies à le remettre à chaque fois. Le filtre Doctrine fait pareil avec tes requêtes SQL : il s'interpose entre l'application et la base de données, et chaque requête traverse le même tamis.

**Ce qu'un filtre Doctrine n'est PAS** :

- Un filtre Doctrine n'est pas un filtre de collection PHP comme `array_filter`. `array_filter` opère sur un tableau déjà chargé en mémoire. Un filtre Doctrine modifie la requête SQL avant l'exécution.
- Un filtre Doctrine n'est pas un Repository personnalisé. Un Repository expose des méthodes nommées (`findBy`, `findActiveUsers`). Un filtre Doctrine agit en amont sur toutes les requêtes, qu'elles passent par un Repository ou par une DQL ad hoc.

**Comparaison filtre Doctrine vs Repository** :

| Filtre Doctrine | Repository personnalisé |
| --- | --- |
| S'applique à toutes les requêtes | S'applique aux méthodes appelées |
| Invisible à l'appelant | Méthodes explicites (`findActive`) |
| Activé ou désactivé globalement | Choisi par méthode |
| Idéal pour règles transversales | Idéal pour requêtes nommées |

---

### Cas d'usage typiques

**Définition** : Les filtres Doctrine couvrent toutes les situations où une règle s'applique à toutes les lectures d'une entité, sans exception (ou avec une exception très bien délimitée comme l'admin).

**Le problème que ces cas d'usage résolvent** :

1. **Données sensibles exposées** : sans soft delete filtré, les entités supprimées remontent dans les listes utilisateur.
2. **Cross-tenant accidentel** : sans filtre tenant, un client peut voir les données d'un autre client.
3. **Brouillon visible** : sans filtre de publication, les articles non publiés apparaissent côté visiteur.

**Tableau des cas d'usage** :

| Cas | Filtre injecté |
| --- | --- |
| Soft delete | `entity.deleted_at IS NULL` |
| Multi-tenancy | `entity.tenant_id = :currentTenant` |
| Publication | `entity.status = 'published'` |
| Brouillon vs en ligne | `entity.published_at <= NOW()` |

**Analogie concrète** : Pense à la vitre teintée d'une voiture. De l'extérieur, on ne voit que ce que la vitre laisse passer. Le filtre Doctrine est cette vitre teintée appliquée à ta base de données : seules les lignes "visibles" remontent, sans que le code appelant ait à filtrer lui-même.

**Ce que ces cas d'usage ne sont PAS** :

- Ce n'est pas un mécanisme de permission au sens Symfony. Un filtre cache des données ; un Voter Symfony autorise ou interdit une action. Les deux se complètent.
- Ce n'est pas un remplacement pour la validation des entrées. Le filtre s'applique aux lectures, pas aux écritures.

---

### Activation et désactivation

**Définition** : L'API de filtres Doctrine permet d'activer, de désactiver et de paramétrer chaque filtre via l'`EntityManager`. Cette manipulation se fait au niveau du code, en cours d'exécution.

**Le problème que cette API résout** :

1. **Besoin d'exception ponctuelle** : la corbeille admin doit voir les éléments supprimés, donc désactiver temporairement le soft delete.
2. **Initialisation contextuelle** : le filtre tenant doit connaître le tenant courant, défini par la requête HTTP.
3. **Tests d'intégrité** : un test doit pouvoir vérifier le comportement avec et sans filtre.

**Tableau de l'API** :

| Action | API |
| --- | --- |
| Activer un filtre | `$em->getFilters()->enable('soft_delete')` |
| Désactiver | `$em->getFilters()->disable('soft_delete')` |
| Lire un paramètre | `$filter->getParameter('tenant')` |
| Définir un paramètre | `$filter->setParameter('tenant', $tenant)` |

**Analogie concrète** : Pense à un interrupteur de lumière. Tu peux l'allumer (enable), l'éteindre (disable), et il y a un variateur (setParameter) qui règle l'intensité. L'interrupteur reste en place ; tu agis dessus quand le contexte l'exige.

**Ce que cette API n'est PAS** :

- Ce n'est pas un mécanisme par requête SQL. Tu ne peux pas désactiver un filtre uniquement pour la prochaine requête : tu désactives globalement, puis tu réactives.
- Ce n'est pas thread-safe au sens classique. Dans un contexte PHP-FPM (une requête = un processus), le risque ne se pose pas. Dans un worker long (Messenger), il faut faire attention à restaurer l'état entre messages.

---

### Quand désactiver un filtre

**Définition** : Désactiver un filtre signifie autoriser temporairement les requêtes à voir l'ensemble des lignes, y compris celles que le filtre masque normalement. La désactivation doit être explicite, motivée et limitée à un périmètre clair.

**Le problème que cette décision résout** :

1. **Admin aveugle aux suppressions** : sans désactivation, l'admin ne peut pas restaurer une entité soft deletée.
2. **Migration de données impossible** : un script qui copie toutes les lignes doit voir toutes les lignes, soft deletées comprises.
3. **Audit cross-tenant légitime** : un super-admin doit pouvoir consolider les statistiques sur tous les tenants.

**Tableau des contextes** :

| Contexte | Filtre actif ? |
| --- | --- |
| Application normale (utilisateur) | OUI |
| Page admin / corbeille | NON pour soft delete |
| Migration de données | NON |
| Test fonctionnel d'isolation | OUI |
| Recherche transverse cross-tenant (audit) | NON |

**Analogie concrète** : Pense à la porte coupe-feu d'un bâtiment. Elle reste fermée 99% du temps, sauf pour les pompiers ou les techniciens. Quand on la franchit, c'est documenté, justifié, et limité dans le temps. Désactiver un filtre Doctrine, c'est franchir cette porte : on le fait pour une raison précise, et on referme derrière soi.

**Ce que la désactivation n'est PAS** :

- Ce n'est pas un raccourci de confort. Désactiver un filtre pour "simplifier une requête" est presque toujours une erreur ; la requête devrait passer par un Repository explicite.
- Ce n'est pas une solution à un mauvais design. Si tu désactives constamment le filtre, c'est que le filtre n'est probablement pas adapté au besoin.

---

### Filtre Doctrine vs filtre côté Repository

**Définition** : Le filtre Doctrine agit en amont de toutes les requêtes ; le filtre côté Repository agit dans chaque méthode qui en a besoin. Les deux approches répondent au même besoin de filtrage, mais avec des compromis différents.

**Le problème que cette comparaison résout** :

1. **Quand utiliser quoi** : tous les besoins ne justifient pas un filtre Doctrine ; certains restent mieux servis par un Repository dédié.
2. **Visibilité du SQL** : un filtre Doctrine cache des conditions, ce qui peut surprendre un développeur nouveau sur le projet.
3. **Surcharge ponctuelle** : un Repository spécialisé peut renvoyer des résultats hors filtre sans toucher à l'EntityManager global.

**Tableau comparatif** :

| Critère | Filtre Doctrine | WHERE manuel |
| --- | --- | --- |
| Risque d'oubli | Très faible | Élevé |
| Visibilité du SQL | Caché | Explicite |
| Surcharge ponctuelle | Désactivation globale | Repository dédié |
| Performance | Identique | Identique |
| Apprenant nouveau sur le projet | Doit savoir que le filtre existe | Lit le code |

**Analogie concrète** : Pense à la différence entre un thermostat central qui règle la température de toute la maison, et un radiateur ajusté pièce par pièce. Le thermostat (filtre Doctrine) garantit une règle homogène, mais reste invisible si on ne consulte pas le tableau de contrôle. Le radiateur (Repository) donne le contrôle local, au prix de la répétition.

**Ce que ce choix n'est PAS** :

- Ce n'est pas un choix exclusif. Un projet peut utiliser un filtre Doctrine pour le soft delete et un Repository spécialisé pour des cas plus pointus.
- Ce n'est pas un débat de performance. Les deux approches génèrent la même requête SQL finale ; le critère décisif est la maintenabilité.

---

## Étapes Pratiques

### Étape 1 : Créer un filtre soft delete

Crée la classe du filtre dans `src/Doctrine/Filter/SoftDeleteFilter.php`.

```php
<?php

namespace App\Doctrine\Filter;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Query\Filter\SQLFilter;

final class SoftDeleteFilter extends SQLFilter
{
    public function addFilterConstraint(ClassMetadata $targetEntity, $targetTableAlias): string
    {
        // Ne s'applique qu'aux entités qui ont un champ deletedAt
        if (!$targetEntity->hasField('deletedAt')) {
            return '';
        }

        return sprintf('%s.deleted_at IS NULL', $targetTableAlias);
    }
}
```

**Résultat attendu** :

```text
Le filtre est défini. Retourner une chaîne vide neutralise le filtre
sur les entités qui n'ont pas le champ deletedAt.
```

Note : retourner une chaîne vide est essentiel pour éviter d'injecter une clause SQL invalide sur les entités non concernées.

---

### Étape 2 : Déclarer le filtre dans Doctrine

Édite `config/packages/doctrine.yaml` pour enregistrer le filtre et l'activer par défaut.

```yaml
doctrine:
    orm:
        filters:
            soft_delete:
                class: App\Doctrine\Filter\SoftDeleteFilter
                enabled: true
```

**Résultat attendu** :

```text
Le filtre soft_delete est connu de Doctrine et actif au démarrage.
Toutes les requêtes ciblant une entité avec deletedAt seront filtrées.
```

---

### Étape 3 : Tester l'effet sur une requête

Écris un test fonctionnel qui vérifie que les entités soft deletées sont bien exclues.

```php
<?php

public function testFindAllExcludesSoftDeleted(): void
{
    $user1 = new User('actif@example.com');
    $user2 = new User('supprime@example.com');
    $user2->softDelete();

    $this->em->persist($user1);
    $this->em->persist($user2);
    $this->em->flush();

    $users = $this->userRepository->findAll();

    static::assertCount(1, $users);
    static::assertSame('actif@example.com', $users[0]->getEmail());
}
```

**Résultat attendu** :

```text
Le test passe. findAll() ne retourne que l'utilisateur actif,
même si la table contient deux lignes.
```

---

### Étape 4 : Désactiver le filtre dans l'admin

Crée un contrôleur qui désactive temporairement le filtre pour afficher la corbeille.

```php
<?php

namespace App\Controller\Admin;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class TrashController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    #[Route('/admin/utilisateurs/corbeille', name: 'admin_users_trash')]
    public function index(UserRepository $repo): Response
    {
        $this->em->getFilters()->disable('soft_delete');

        try {
            $allUsers = $repo->findAll(); // inclut les soft deletés
        } finally {
            $this->em->getFilters()->enable('soft_delete');
        }

        return $this->render('admin/trash.html.twig', ['users' => $allUsers]);
    }
}
```

**Résultat attendu** :

```text
La page corbeille liste tous les utilisateurs, y compris ceux dont
deleted_at est défini. Le filtre est réactivé après l'affichage,
même si une exception est levée durant l'exécution.
```

Le bloc `try/finally` garantit que le filtre est réactivé même si une exception est levée pendant `$repo->findAll()`.

---

### Étape 5 : Filtre avec paramètre (multi-tenancy)

Crée un filtre qui dépend d'une valeur dynamique, ici l'identifiant du tenant courant.

```php
<?php

namespace App\Doctrine\Filter;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Query\Filter\SQLFilter;

final class TenantFilter extends SQLFilter
{
    public function addFilterConstraint(ClassMetadata $targetEntity, $targetTableAlias): string
    {
        if (!$targetEntity->hasAssociation('tenant')) {
            return '';
        }

        return sprintf(
            '%s.tenant_id = %s',
            $targetTableAlias,
            $this->getParameter('tenantId')
        );
    }
}
```

Active et injecte le paramètre depuis un listener Symfony, déclenché à chaque requête HTTP.

```php
<?php

namespace App\EventListener;

use App\Tenant\CurrentTenantProvider;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

#[AsEventListener(event: KernelEvents::REQUEST, priority: 8)]
final class TenantFilterListener
{
    public function __construct(
        private EntityManagerInterface $em,
        private CurrentTenantProvider $tenantProvider,
    ) {
    }

    public function __invoke(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $tenant = $this->tenantProvider->getCurrent();
        $filter = $this->em->getFilters()->enable('tenant');
        $filter->setParameter('tenantId', $tenant->getId());
    }
}
```

**Résultat attendu** :

```text
À chaque requête principale, le filtre tenant est activé avec
l'identifiant du tenant courant. Toutes les requêtes ORM voient
uniquement les données du tenant identifié.
```

Déclare aussi le filtre `tenant` dans `doctrine.yaml` avec `enabled: false` (l'activation se fait au runtime via le listener).

---

### Étape 6 : Combiner plusieurs filtres

Doctrine combine automatiquement tous les filtres actifs avec un `AND`. Si soft delete et multi-tenancy sont actifs en même temps, la clause générée est :

```sql
WHERE tenant_id = :t AND deleted_at IS NULL
```

**Résultat attendu** :

```text
Chaque requête sur une entité concernée par les deux filtres
porte les deux clauses. Aucun ordre à gérer, Doctrine s'en occupe.
```

---

## Commandes Utiles

| Élément | Action |
| --- | --- |
| `class extends SQLFilter` | Créer un filtre personnalisé |
| `addFilterConstraint(ClassMetadata, $alias)` | Méthode à implémenter |
| `$em->getFilters()->enable('name')` | Active un filtre |
| `$em->getFilters()->disable('name')` | Désactive un filtre |
| `$filter->setParameter('p', $val)` | Définit un paramètre du filtre |
| `$filter->getParameter('p')` | Lit un paramètre |
| `try/finally` autour de `disable/enable` | Garantir la restauration |

---

## Pièges Fréquents

### Piège 1 : Filtre activé sans paramètre

⚠️ **Problème** : Le filtre attend un paramètre `tenantId` mais celui-ci n'est pas défini. À la première requête, Doctrine lève une exception car le SQL généré référence un paramètre absent.

✅ **Solution** : Toujours initialiser les paramètres avant d'activer le filtre, ou activer le filtre seulement après avoir défini le paramètre. Dans un listener, valider que le tenant courant existe avant d'activer.

```php
<?php

if ($tenant === null) {
    return; // Pas de tenant identifié, on n'active pas le filtre
}

$filter = $this->em->getFilters()->enable('tenant');
$filter->setParameter('tenantId', $tenant->getId());
```

---

### Piège 2 : Désactivation oubliée

⚠️ **Problème** : Tu désactives le filtre dans un contrôleur, une exception est levée, et le filtre reste désactivé pour la suite de la requête. Les actions suivantes voient des données qui devraient être masquées.

✅ **Solution** : Toujours encadrer le bloc de désactivation par `try/finally` pour garantir la réactivation, même en cas d'exception.

```php
<?php

$this->em->getFilters()->disable('soft_delete');

try {
    // Code qui a besoin du filtre désactivé
} finally {
    $this->em->getFilters()->enable('soft_delete');
}
```

---

### Piège 3 : Filtre actif pendant les fixtures

⚠️ **Problème** : Tes fixtures essaient d'insérer des données mais aucun tenant courant n'est défini. Le filtre tenant échoue, ou pire, les fixtures s'exécutent à moitié et laissent la base dans un état incohérent.

✅ **Solution** : Désactiver explicitement le filtre tenant au début des fixtures, puis le réactiver à la fin si besoin.

```php
<?php

public function load(ObjectManager $manager): void
{
    $manager->getConnection()->getConfiguration()->setSQLLogger(null);

    if ($manager->getFilters()->isEnabled('tenant')) {
        $manager->getFilters()->disable('tenant');
    }

    // Création des fixtures
    $manager->flush();
}
```

---

### Piège 4 : Confondre filtre Doctrine et Voter Symfony

⚠️ **Problème** : Tu utilises un filtre Doctrine pour gérer les permissions d'accès à une page, en pensant qu'il protège suffisamment. Ou inversement, tu utilises un Voter pour cacher des lignes en base.

✅ **Solution** : Distingue les deux responsabilités. Le filtre cache les données au niveau ORM ; le voter contrôle l'autorisation sur une action. Les deux sont complémentaires et nécessaires.

| Outil | Rôle |
| --- | --- |
| Filtre Doctrine | Filtrer les lignes lues depuis la base |
| Voter Symfony | Autoriser ou refuser une action sur une ressource |

---

### Piège 5 : Filtre conditionnel mal écrit

⚠️ **Problème** : La méthode `addFilterConstraint` peut retourner du SQL invalide selon les cas (champ absent, alias mal formé). Toute la requête plante avec une erreur SQL difficile à diagnostiquer.

✅ **Solution** : Toujours retourner `''` (chaîne vide) si le filtre ne s'applique pas à l'entité visée. Ne retourner du SQL qu'après avoir vérifié les conditions nécessaires.

```php
<?php

public function addFilterConstraint(ClassMetadata $targetEntity, $targetTableAlias): string
{
    if (!$targetEntity->hasField('deletedAt')) {
        return ''; // Filtre neutralisé pour cette entité
    }

    return sprintf('%s.deleted_at IS NULL', $targetTableAlias);
}
```

---

## Checklist de Validation

- [ ] Je sais créer un filtre Doctrine en étendant `SQLFilter`
- [ ] Je sais déclarer le filtre dans `doctrine.yaml`
- [ ] Je sais activer un filtre globalement ou ponctuellement
- [ ] Je sais désactiver un filtre dans un contexte admin avec `try/finally`
- [ ] Je sais passer un paramètre à un filtre depuis un listener
- [ ] Je sais combiner plusieurs filtres (soft delete + tenant)

---

## Exercice Pratique

**Énoncé** : Tu disposes d'une entité `Article` avec une propriété `publishedAt` (nullable, type `DateTimeImmutable`). Tu veux que par défaut, les utilisateurs ne voient que les articles déjà publiés (`publishedAt <= NOW()`). L'admin doit pouvoir voir tous les articles, y compris les brouillons et les articles programmés.

**Indications** :

1. Crée un filtre `PublishedFilter` dans `src/Doctrine/Filter/`.
2. Déclare-le dans `config/packages/doctrine.yaml` avec `enabled: true`.
3. Active le filtre par défaut pour les requêtes utilisateur.
4. Crée un endpoint admin `/admin/articles/all` qui désactive ponctuellement le filtre avec `try/finally`.
5. Écris un test fonctionnel qui prouve qu'un article avec `publishedAt = null` (brouillon) ou `publishedAt > NOW()` (programmé) n'apparaît pas pour un utilisateur normal.

**Résultat attendu** : Un filtre fonctionnel, une configuration valide, un contrôleur admin sûr, et un test vert qui couvre les trois cas (publié, brouillon, programmé).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Filtre `PublishedFilter`** :

```php
<?php

namespace App\Doctrine\Filter;

use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Query\Filter\SQLFilter;

final class PublishedFilter extends SQLFilter
{
    public function addFilterConstraint(ClassMetadata $targetEntity, $targetTableAlias): string
    {
        // Ne s'applique qu'aux entités qui ont publishedAt
        if (!$targetEntity->hasField('publishedAt')) {
            return '';
        }

        // publishedAt non nul ET dans le passé ou présent
        return sprintf(
            '%s.published_at IS NOT NULL AND %s.published_at <= CURRENT_TIMESTAMP',
            $targetTableAlias,
            $targetTableAlias
        );
    }
}
```

**Configuration `config/packages/doctrine.yaml`** :

```yaml
doctrine:
    orm:
        filters:
            published:
                class: App\Doctrine\Filter\PublishedFilter
                enabled: true
```

**Contrôleur admin avec désactivation sécurisée** :

```php
<?php

namespace App\Controller\Admin;

use App\Repository\ArticleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AdminArticleController extends AbstractController
{
    public function __construct(private EntityManagerInterface $em)
    {
    }

    #[Route('/admin/articles/all', name: 'admin_articles_all')]
    public function all(ArticleRepository $repo): Response
    {
        $this->em->getFilters()->disable('published');

        try {
            $allArticles = $repo->findAll();
        } finally {
            $this->em->getFilters()->enable('published');
        }

        return $this->render('admin/article/all.html.twig', [
            'articles' => $allArticles,
        ]);
    }
}
```

**Test fonctionnel** :

```php
<?php

namespace App\Tests\Functional;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

final class PublishedFilterTest extends KernelTestCase
{
    private EntityManagerInterface $em;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->em = self::getContainer()->get(EntityManagerInterface::class);
    }

    public function testUserSeesOnlyPublishedArticles(): void
    {
        // Article publié il y a 1 jour : visible
        $publie = new Article('Article publié');
        $publie->publish(new \DateTimeImmutable('-1 day'));

        // Brouillon : publishedAt null, invisible
        $brouillon = new Article('Brouillon');

        // Article programmé dans le futur : invisible
        $programme = new Article('Article programmé');
        $programme->publish(new \DateTimeImmutable('+1 day'));

        $this->em->persist($publie);
        $this->em->persist($brouillon);
        $this->em->persist($programme);
        $this->em->flush();

        $articles = $this->em->getRepository(Article::class)->findAll();

        static::assertCount(1, $articles);
        static::assertSame('Article publié', $articles[0]->getTitle());
    }

    public function testAdminSeesAllArticlesWhenFilterDisabled(): void
    {
        $publie = new Article('Article publié');
        $publie->publish(new \DateTimeImmutable('-1 day'));

        $brouillon = new Article('Brouillon');

        $programme = new Article('Article programmé');
        $programme->publish(new \DateTimeImmutable('+1 day'));

        $this->em->persist($publie);
        $this->em->persist($brouillon);
        $this->em->persist($programme);
        $this->em->flush();

        // Désactivation explicite pour l'admin
        $this->em->getFilters()->disable('published');

        try {
            $articles = $this->em->getRepository(Article::class)->findAll();
        } finally {
            $this->em->getFilters()->enable('published');
        }

        static::assertCount(3, $articles);
    }
}
```

**Explication des choix** :

- Le filtre vérifie deux conditions : `publishedAt IS NOT NULL` (exclut les brouillons) et `published_at <= CURRENT_TIMESTAMP` (exclut les articles programmés).
- `CURRENT_TIMESTAMP` est la fonction SQL standard évaluée par la base de données à chaque requête. Pas besoin d'injecter `NOW()` côté PHP.
- Le test admin désactive explicitement le filtre avec `try/finally` pour garantir la réactivation, même si l'assertion échoue.
- Le test utilisateur n'a rien à faire : le filtre est actif par défaut grâce à `enabled: true` dans `doctrine.yaml`.

---

## Navigation

← Fiche précédente : **[URLs signées et tokens d'accès anonyme](15-urls-signees-tokens.md)**

→ Fiche suivante : **[Projet intégrateur](17-projet-integrateur.md)**
