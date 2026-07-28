---
tags:
  - Architecture
  - Doctrine
  - Intermédiaire
description: "Soft delete : supprimer logiquement sans effacer physiquement. Conformité RGPD, audit, traçabilité et restauration."
estimated_time: "60 min"
fiche_number: 13
total_fiches: 17
cursus: "Architecture et Design Patterns"
---

# 13 - Soft delete : supprimer sans effacer

> **En bref** : Au lieu de supprimer physiquement une ligne en base, on la marque comme supprimée. Cette approche préserve l'historique, simplifie la restauration et facilite la conformité réglementaire. Lecture estimée : 60 min.

## Prérequis

- Fiche 12 : [Multi-tenancy](12-multi-tenancy.md)
- Cursus Symfony (Doctrine, Entity, Repository)
- Cursus PostgreSQL (index, contraintes uniques)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras implémenter un soft delete avec Doctrine, filtrer automatiquement les entités supprimées, gérer les contraintes uniques face au soft delete, et choisir entre soft delete et hard delete selon le besoin métier.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un soft delete ?

**Définition** : Un soft delete (suppression logique) est une technique qui consiste à marquer une ligne en base de données comme supprimée plutôt que de l'effacer physiquement. La ligne reste présente sur le disque, mais elle est filtrée par défaut dans les requêtes applicatives.

**Le problème que le soft delete résout** :

Sans soft delete, voici les problèmes rencontrés :

1. **Perte irréversible d'historique** : une fois la ligne supprimée, on ne peut plus consulter l'état antérieur, ni savoir qui possédait quoi.
2. **Erreurs humaines difficiles à réparer** : une suppression accidentelle nécessite une restauration de backup, opération longue et risquée.
3. **Audit impossible a posteriori** : on ne peut plus prouver qu'un compte a existé, ni à quel moment il a été supprimé.

**Comment le soft delete résout ces problèmes** :

| Problème | Solution apportée par le soft delete |
| --- | --- |
| Perte irréversible d'historique | La ligne reste en base, on peut la consulter |
| Erreurs humaines difficiles à réparer | Une restauration se fait en une requête `UPDATE` |
| Audit impossible a posteriori | La date de suppression est conservée |

**Analogie concrète** : Pense à la corbeille de ton ordinateur. Quand tu supprimes un fichier, il n'est pas effacé du disque : il est déplacé dans la corbeille. Tu peux le restaurer tant que la corbeille n'a pas été vidée. Le soft delete fonctionne pareil : la donnée existe encore, mais elle est masquée par défaut.

**Ce qu'un soft delete n'est PAS** :

- Le soft delete n'est pas un système de versioning. Il garde la dernière version uniquement, pas l'historique des modifications.
- Le soft delete n'est pas une sauvegarde. Si la base est corrompue, la donnée soft delete est perdue avec le reste.
- Le soft delete n'est pas un cache. Une ligne soft delete n'est pas plus rapide à consulter qu'une ligne active.

---

### Soft delete vs hard delete

**Définition** : Le hard delete est la suppression physique classique (`DELETE FROM users WHERE id = 1`). Le soft delete est la suppression logique par marqueur (`UPDATE users SET deleted_at = NOW() WHERE id = 1`).

**Le problème que la comparaison résout** :

Sans comprendre la différence, on choisit par défaut le hard delete pour toutes les entités, ce qui pose problème dès qu'on a besoin de traçabilité ou de récupération.

**Comparaison directe** :

| Critère | Soft delete | Hard delete |
| --- | --- | --- |
| Récupération possible | Oui | Non (sauf backup) |
| Place disque | Conservée | Libérée |
| Performance des requêtes | Légèrement plus lente (filtre) | Optimale |
| Audit / RGPD | Compatible | Demande purge explicite |
| Risque d'oubli de filtre | Élevé | Nul |

**Analogie concrète** : Le hard delete, c'est jeter un document directement dans le broyeur. Le soft delete, c'est le ranger dans une boîte d'archives marquée "à détruire dans un an". L'un est immédiat et irréversible, l'autre garde une fenêtre de récupération.

**Ce que le hard delete n'est PAS** :

- Le hard delete n'est pas synonyme de "purge". Une purge peut être un hard delete planifié après un soft delete préalable.
- Le hard delete n'est pas toujours mauvais. Pour des données techniques (sessions expirées, jobs terminés), il reste pertinent.

---

### Trois stratégies de marqueur

**Définition** : Le marqueur de soft delete est le champ qui indique qu'une ligne est supprimée. Trois stratégies coexistent dans la pratique.

**Le problème que le choix du marqueur résout** :

Sans choix réfléchi, on prend le premier qui vient (souvent un booléen) et on regrette ensuite de ne pas avoir conservé la date de suppression ou de ne pas avoir intégré la suppression dans un cycle de vie plus large.

**Comparaison des stratégies** :

| Stratégie | Champ ajouté | Avantage |
| --- | --- | --- |
| Boolean | `is_deleted BOOLEAN DEFAULT FALSE` | Simple |
| Timestamp | `deleted_at TIMESTAMP NULL` | On garde la date |
| Statut métier | `status VARCHAR` avec valeur `'deleted'` | Intégré au cycle de vie |

Le timestamp est généralement préféré : il garde la date, on peut purger les anciens, et la valeur `NULL` distingue clairement les actives des supprimées.

**Analogie concrète** : Imagine trois façons de marquer un dossier classé : un autocollant rouge "archivé" (booléen), un cachet avec la date d'archivage (timestamp), ou une étiquette qui passe de "en cours" à "archivé" parmi cinq statuts possibles (statut métier). Chaque méthode donne une information différente : la dernière est plus riche, la première plus simple.

**Ce que le marqueur n'est PAS** :

- Le marqueur n'est pas une colonne qu'on peut ajouter et oublier. Il doit être pris en compte dans chaque requête, chaque index et chaque contrainte.
- Le marqueur n'est pas un champ métier visible. Il reste un détail technique de persistance.

---

### Soft delete et contraintes uniques

**Définition** : Une contrainte unique garantit qu'aucune ligne ne partage une même valeur sur un champ donné. Avec un soft delete, cette garantie entre en conflit avec la réutilisation d'une valeur après suppression.

**Le problème que la gestion des contraintes uniques résout** :

Sans adaptation, voici les problèmes rencontrés :

1. **Inscription bloquée** : si un user `alice@example.com` est supprimé puis qu'Alice veut recréer un compte, la contrainte `UNIQUE` la bloque.
2. **Données fantômes** : on est tenté de modifier le champ pendant la suppression (`email = 'deleted-...'`), ce qui altère la donnée originale.
3. **Réconciliation impossible** : on ne peut plus relier l'ancien compte au nouveau s'il a fallu modifier l'email.

**Solutions disponibles** :

| Solution | Mécanisme | Quand l'utiliser |
| --- | --- | --- |
| Index unique partiel | `WHERE deleted_at IS NULL` | PostgreSQL, SQL Server (recommandé) |
| Renommage à la suppression | `email = 'deleted-{id}@...'` | MySQL sans index partiel |
| Champ technique séparé | `email_canonical` non unique | Cas particulier de réconciliation |

Sur PostgreSQL, l'index unique partiel est la solution la plus propre : il préserve la donnée originale et autorise la réutilisation.

**Analogie concrète** : Pense à la liste des élèves d'une classe. Si tu interdis "deux élèves du même nom" en absolu, tu bloques l'arrivée d'un nouvel élève dont l'homonyme a quitté l'école il y a deux ans. Si tu interdis "deux élèves actuels du même nom", tu autorises la réutilisation après départ. L'index unique partiel exprime cette nuance.

**Ce que la gestion des contraintes uniques n'est PAS** :

- Ce n'est pas une option : c'est obligatoire dès que tu ajoutes un soft delete sur une table avec des champs uniques.
- Ce n'est pas une simple suppression de la contrainte : il faut conserver l'unicité parmi les lignes actives.

---

### Soft delete et conformité RGPD

**Définition** : Le RGPD (Règlement Général sur la Protection des Données) impose le droit à l'effacement : un utilisateur peut demander la suppression effective de ses données. Le soft delete seul ne satisfait pas cette exigence.

**Le problème que la conformité RGPD résout** :

Sans procédure de purge, voici les problèmes rencontrés :

1. **Données personnelles conservées indéfiniment** : un soft delete laisse les données en base, ce qui contrevient au droit à l'oubli.
2. **Sanctions réglementaires** : la CNIL peut sanctionner une rétention non justifiée.
3. **Croissance non maîtrisée** : la table grossit sans limite si rien ne purge les lignes anciennes.

**Cycle de vie recommandé** :

| Étape | Action | Délai typique |
| --- | --- | --- |
| Suppression | Soft delete (marqueur + masquage) | Immédiat à la demande |
| Anonymisation | Effacement des champs personnels, conservation de l'agrégat | 30 jours |
| Purge | Hard delete complet | 1 an ou selon obligation légale |

**Analogie concrète** : Pense à un dossier confidentiel. À la demande de fermeture, tu le mets dans un classeur "à archiver" (soft delete). Un mois plus tard, tu masques les noms (anonymisation). Au bout d'un an, tu passes l'ensemble au broyeur (purge). Chaque étape correspond à un niveau de protection différent.

**Ce que la conformité RGPD n'est PAS** :

- Ce n'est pas l'affaire du seul soft delete. Il faut une procédure complète : suppression, anonymisation, purge.
- Ce n'est pas un délai uniforme. Selon le type de donnée (facture, log de connexion, message), les délais légaux varient.

---

## Étapes Pratiques

### Étape 1 : Ajouter le champ deleted_at

Cette étape ajoute le marqueur de soft delete à une entité Doctrine existante.

Code de l'entité :

```php
<?php

// Entité User avec champ deletedAt nullable
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'users')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private string $email;

    // Champ de soft delete : NULL = actif, date = supprimé
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $deletedAt = null;

    public function getDeletedAt(): ?\DateTimeImmutable
    {
        return $this->deletedAt;
    }

    // Marque l'entité comme supprimée
    public function softDelete(): void
    {
        $this->deletedAt = new \DateTimeImmutable();
    }

    // Vérifie si l'entité est supprimée
    public function isDeleted(): bool
    {
        return $this->deletedAt !== null;
    }

    // Annule la suppression
    public function restore(): void
    {
        $this->deletedAt = null;
    }
}
```

Générer et appliquer la migration :

```bash
# Générer la migration Doctrine à partir des changements d'entité
php bin/console make:migration

# Appliquer la migration sur la base de données
php bin/console doctrine:migrations:migrate
```

**Résultat attendu** :

```text
Generated new migration class to "migrations/Version20260518120000.php"
Migration migrations/Version20260518120000.php executed successfully
```

---

### Étape 2 : Filtrer dans le Repository

Cette étape adapte le Repository pour ignorer par défaut les entités supprimées.

```php
<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    // Récupère tous les utilisateurs actifs uniquement
    public function findAllActive(): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.deletedAt IS NULL')
            ->getQuery()
            ->getResult();
    }

    // Recherche un utilisateur actif par email
    public function findOneActiveByEmail(string $email): ?User
    {
        return $this->createQueryBuilder('u')
            ->where('u.deletedAt IS NULL')
            ->andWhere('u.email = :email')
            ->setParameter('email', $email)
            ->getQuery()
            ->getOneOrNullResult();
    }

    // Récupère uniquement les utilisateurs supprimés (corbeille)
    public function findOnlyTrashed(): array
    {
        return $this->createQueryBuilder('u')
            ->where('u.deletedAt IS NOT NULL')
            ->getQuery()
            ->getResult();
    }

    // Récupère les actifs ET les supprimés (administration)
    public function findWithTrashed(): array
    {
        return $this->createQueryBuilder('u')
            ->getQuery()
            ->getResult();
    }
}
```

**Résultat attendu** : trois variantes claires de récupération. L'appelant choisit explicitement ce qu'il veut voir.

---

### Étape 3 : Adapter l'index unique sur email

Cette étape modifie la contrainte d'unicité pour autoriser plusieurs lignes supprimées partageant le même email.

```sql
-- Supprimer l'index unique global existant
DROP INDEX IF EXISTS users_email_unique;

-- Créer un index unique partiel sur les lignes actives uniquement
CREATE UNIQUE INDEX users_email_active_unique
    ON users (email)
    WHERE deleted_at IS NULL;
```

**Résultat attendu** :

```text
DROP INDEX
CREATE INDEX
```

Cela permet à plusieurs lignes supprimées de partager le même email, mais une seule ligne active à la fois. Tu peux donc recréer un compte avec un email d'un utilisateur précédemment supprimé.

---

### Étape 4 : Soft delete via un listener Doctrine

Cette étape automatise la conversion d'un `remove()` en soft delete pour les entités marquées.

Interface marqueur :

```php
<?php

namespace App\Entity;

// Marque une entité comme éligible au soft delete
interface SoftDeletableInterface
{
    public function softDelete(): void;
    public function isDeleted(): bool;
}
```

Listener Doctrine :

```php
<?php

namespace App\EventListener;

use App\Entity\SoftDeletableInterface;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PreRemoveEventArgs;
use Doctrine\ORM\Events;

// Listener déclenché avant chaque suppression Doctrine
#[AsDoctrineListener(event: Events::preRemove)]
final class SoftDeleteListener
{
    public function preRemove(PreRemoveEventArgs $args): void
    {
        $entity = $args->getObject();

        // On ne fait rien si l'entité n'est pas soft deletable
        if (!$entity instanceof SoftDeletableInterface) {
            return;
        }

        // On marque l'entité au lieu de la supprimer
        $entity->softDelete();
        $args->getObjectManager()->persist($entity);
    }
}
```

**Résultat attendu** : chaque appel à `$em->remove($user)` ne supprime plus physiquement mais marque l'entité.

**Note importante** : un listener `preRemove` ne peut pas annuler le remove. Il faut soit utiliser une autre approche (méthode dédiée comme `$userService->softDelete($user)`), soit accepter que `remove()` fasse un soft delete au lieu d'un hard delete. La seconde option est plus simple mais surprend les développeurs qui ne connaissent pas le mécanisme.

---

### Étape 5 : Filtre Doctrine global (transparent)

Doctrine propose des filtres SQL globaux qui ajoutent une condition `WHERE` à toutes les requêtes sur une entité donnée.

Filtre Doctrine :

```php
<?php

namespace App\Doctrine\Filter;

use App\Entity\SoftDeletableInterface;
use Doctrine\ORM\Mapping\ClassMetadata;
use Doctrine\ORM\Query\Filter\SQLFilter;

// Filtre SQL appliqué à toutes les requêtes sur des entités SoftDeletable
final class SoftDeleteFilter extends SQLFilter
{
    public function addFilterConstraint(ClassMetadata $targetEntity, $targetTableAlias): string
    {
        // On ne filtre que les entités qui implémentent l'interface
        if (!$targetEntity->reflClass->implementsInterface(SoftDeletableInterface::class)) {
            return '';
        }

        // Ajout automatique de la condition à chaque requête
        return sprintf('%s.deleted_at IS NULL', $targetTableAlias);
    }
}
```

Configuration `config/packages/doctrine.yaml` :

```yaml
doctrine:
    orm:
        filters:
            soft_delete:
                class: App\Doctrine\Filter\SoftDeleteFilter
                enabled: true
```

**Résultat attendu** : toutes les requêtes Doctrine sur une entité `SoftDeletableInterface` ignorent automatiquement les lignes supprimées, sans condition manuelle.

Pour désactiver ponctuellement le filtre (administration, corbeille) :

```php
<?php

// Désactiver le filtre pour récupérer aussi les supprimés
$this->em->getFilters()->disable('soft_delete');
$allUsers = $this->em->getRepository(User::class)->findAll();
$this->em->getFilters()->enable('soft_delete');
```

Voir la fiche suivante pour approfondir les filtres Doctrine et leurs cas d'usage.

---

### Étape 6 : Restaurer une entité soft deletée

Cette étape ajoute la possibilité de restaurer une entité supprimée.

```php
<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserRestoreService
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    // Restaure un utilisateur soft deletée
    public function restoreUser(int $id): void
    {
        // On doit désactiver le filtre pour retrouver les supprimés
        $this->em->getFilters()->disable('soft_delete');

        try {
            $user = $this->em->find(User::class, $id);

            if ($user === null) {
                throw new \DomainException('Utilisateur introuvable');
            }

            if (!$user->isDeleted()) {
                throw new \DomainException('Utilisateur non supprimé');
            }

            $user->restore();
            $this->em->flush();
        } finally {
            // Réactiver le filtre dans tous les cas
            $this->em->getFilters()->enable('soft_delete');
        }
    }
}
```

**Résultat attendu** :

```text
Utilisateur 42 restauré : deleted_at passé de "2026-05-10 14:30:00" à NULL
```

---

## Commandes Utiles

| Élément | Action |
| --- | --- |
| `$user->softDelete()` | Marquer comme supprimé |
| `$user->restore()` | Annuler la suppression |
| `findAllActive()` | Récupérer les non-supprimés |
| `findWithTrashed()` | Inclure les supprimés (administration) |
| `findOnlyTrashed()` | Seulement les supprimés (corbeille) |
| Index unique partiel | Permet l'unicité parmi les actifs uniquement |
| `$em->getFilters()->disable('soft_delete')` | Désactiver le filtre globalement |
| `$em->getFilters()->enable('soft_delete')` | Réactiver le filtre globalement |

---

## Pièges Fréquents

### Piège 1 : Oublier le filtre dans une requête

⚠️ **Problème** : Un repository qui filtre dans `findAllActive` mais pas dans `findOneById` permet de récupérer un user supprimé par accès direct, ce qui crée des incohérences (un user supprimé qui peut se connecter, par exemple).

✅ **Solution** : Centraliser le filtre via le filtre Doctrine global. Toutes les requêtes héritent automatiquement de la condition `deleted_at IS NULL`, sans risque d'oubli.

```php
<?php

// Configuration unique dans doctrine.yaml suffit
// Plus besoin de répéter "WHERE deleted_at IS NULL" partout
```

---

### Piège 2 : Contraintes uniques non adaptées

⚠️ **Problème** : `UNIQUE (email)` empêche la recréation d'un compte avec le même email après suppression. L'utilisateur ne peut plus s'inscrire.

✅ **Solution** : Utiliser un index unique partiel qui ne s'applique qu'aux lignes actives.

```sql
-- Index unique partiel : unicité parmi les actifs uniquement
CREATE UNIQUE INDEX users_email_active_unique
    ON users (email)
    WHERE deleted_at IS NULL;
```

---

### Piège 3 : Supprimer en cascade sans réflexion

⚠️ **Problème** : Si `User` possède plusieurs `Post`, et qu'on soft delete le User, que doit-il advenir des Posts ? Les supprimer aussi, ou les conserver pour préserver l'historique des contributions ?

✅ **Solution** : Trancher explicitement la question métier avant l'implémentation. Documenter la décision dans le code et les tests.

```php
<?php

// Option 1 : soft delete en cascade (cohérent avec le user)
public function softDelete(): void
{
    $this->deletedAt = new \DateTimeImmutable();
    foreach ($this->posts as $post) {
        $post->softDelete();
    }
}

// Option 2 : conserver les posts (préserver l'historique)
public function softDelete(): void
{
    $this->deletedAt = new \DateTimeImmutable();
    // Les posts restent actifs, mais leur author est marqué supprimé
}
```

---

### Piège 4 : Confondre soft delete et désactivation

⚠️ **Problème** : Un compte "désactivé" et un compte "supprimé" sont mélangés dans la même colonne. Résultat : on ne sait plus si un utilisateur veut revenir un jour ou s'il a vraiment demandé la suppression.

✅ **Solution** : Garder deux champs distincts. `is_active` pour la désactivation temporaire, `deleted_at` pour la suppression définitive.

| Champ | Sens | Réactivation par l'utilisateur |
| --- | --- | --- |
| `is_active = false` | Compte désactivé | Possible (mot de passe oublié, etc.) |
| `deleted_at != NULL` | Compte supprimé | Demande d'administration |

---

### Piège 5 : Soft delete sans purge

⚠️ **Problème** : Sans calendrier de purge, la table grossit indéfiniment. Au bout de plusieurs années, les performances chutent et le stockage explose.

✅ **Solution** : Définir une politique de rétention claire et l'automatiser avec une commande planifiée.

```bash
# Commande planifiée (cron ou Symfony Messenger)
# Purge les entrées soft delete de plus d'un an
php bin/console app:users:purge --older-than=365
```

---

## Checklist de Validation

- [ ] Je sais ajouter un champ `deletedAt` à une entité Doctrine
- [ ] Je sais filtrer les entités supprimées dans un Repository
- [ ] Je sais créer un index unique partiel pour gérer les contraintes
- [ ] Je sais implémenter un listener Doctrine de soft delete
- [ ] Je sais configurer un filtre Doctrine global et le désactiver ponctuellement
- [ ] Je sais restaurer une entité soft deletée
- [ ] Je connais la différence entre soft delete et désactivation
- [ ] Je sais que le soft delete seul ne suffit pas pour la conformité RGPD

---

## Exercice Pratique

**Énoncé** : Tu disposes d'une entité `Article` avec les champs `title`, `slug` (UNIQUE) et `publishedAt`. Implémente le soft delete avec ces exigences.

**Indications** :

1. Ajoute un champ `deletedAt` à l'entité `Article`.
2. Adapte l'index unique sur `slug` pour permettre la recréation d'un article avec un slug déjà supprimé.
3. Ajoute une méthode `restore()` qui vérifie que `publishedAt` n'est pas dans le futur avant d'autoriser la restauration.
4. Écris une commande Symfony `app:articles:purge --days=365` qui hard delete les articles soft deletés depuis plus de 365 jours.

**Résultat attendu** : un article peut être supprimé puis restauré tant qu'il n'est pas planifié dans le futur, et une commande purge automatiquement les articles trop anciens.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Entité Article avec soft delete et garde sur restore** :

```php
<?php

namespace App\Entity;

use App\Repository\ArticleRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
#[ORM\Table(name: 'articles')]
class Article implements SoftDeletableInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 200)]
    private string $title;

    // Le slug est unique parmi les articles actifs
    #[ORM\Column(length: 200)]
    private string $slug;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $publishedAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $deletedAt = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPublishedAt(): ?\DateTimeImmutable
    {
        return $this->publishedAt;
    }

    public function getDeletedAt(): ?\DateTimeImmutable
    {
        return $this->deletedAt;
    }

    public function softDelete(): void
    {
        $this->deletedAt = new \DateTimeImmutable();
    }

    public function isDeleted(): bool
    {
        return $this->deletedAt !== null;
    }

    // Restauration avec garde métier : pas de restauration si publication future
    public function restore(): void
    {
        if (!$this->isDeleted()) {
            throw new \DomainException('Article non supprimé');
        }

        $now = new \DateTimeImmutable();

        if ($this->publishedAt !== null && $this->publishedAt > $now) {
            throw new \DomainException(
                'Impossible de restaurer un article planifié dans le futur'
            );
        }

        $this->deletedAt = null;
    }
}
```

**2. Migration SQL avec index unique partiel** :

```sql
-- Ajout du champ deleted_at
ALTER TABLE articles
    ADD COLUMN deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL;

-- Suppression de l'ancienne contrainte unique globale
DROP INDEX IF EXISTS articles_slug_unique;

-- Création de l'index unique partiel : unicité parmi les actifs
CREATE UNIQUE INDEX articles_slug_active_unique
    ON articles (slug)
    WHERE deleted_at IS NULL;
```

**3. Commande Symfony de purge** :

```php
<?php

namespace App\Command;

use App\Entity\Article;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:articles:purge',
    description: 'Purge les articles soft deletés depuis plus de N jours',
)]
final class PurgeArticlesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption(
            'days',
            null,
            InputOption::VALUE_REQUIRED,
            'Nombre de jours de rétention',
            365,
        );
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $days = (int) $input->getOption('days');

        if ($days < 1) {
            $io->error('La rétention doit être au moins de 1 jour');

            return Command::INVALID;
        }

        // Calcul de la date seuil
        $threshold = new \DateTimeImmutable(sprintf('-%d days', $days));

        // Désactiver le filtre pour cibler les supprimés
        $this->em->getFilters()->disable('soft_delete');

        try {
            // Hard delete des articles supprimés avant la date seuil
            $deleted = $this->em->createQueryBuilder()
                ->delete(Article::class, 'a')
                ->where('a.deletedAt IS NOT NULL')
                ->andWhere('a.deletedAt < :threshold')
                ->setParameter('threshold', $threshold)
                ->getQuery()
                ->execute();

            $io->success(sprintf(
                '%d articles purgés (supprimés avant %s)',
                $deleted,
                $threshold->format('Y-m-d'),
            ));
        } finally {
            $this->em->getFilters()->enable('soft_delete');
        }

        return Command::SUCCESS;
    }
}
```

**Résultat attendu** :

```text
$ php bin/console app:articles:purge --days=365

 [OK] 47 articles purgés (supprimés avant 2025-05-18)
```

---

## Navigation

← Fiche précédente : **[Multi-tenancy](12-multi-tenancy.md)**

→ Fiche suivante : **[Anti-énumération](14-anti-enumeration.md)**
