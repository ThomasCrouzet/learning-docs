---
tags:
  - Symfony
  - Intermédiaire
  - Pratique
description: "Les migrations"
estimated_time: "90 min"
fiche_number: 6
total_fiches: 21
cursus: "Symfony"
---

# 06 - Les migrations

> **En bref** : À la fin de cette fiche, tu sauras créer et exécuter des migrations pour modifier la structure de ta base de données de manière contrôlée. Lecture estimée : 90 min.


## Prérequis

- Avoir lu la fiche **[04 - Introduction à Doctrine](04-introduction-doctrine.md)**
- Avoir lu la fiche **[05 - Créer des entités](05-creer-entites.md)**
- Comprendre ce qu'est une base de données (tables, colonnes)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et exécuter des migrations pour modifier la structure de ta base de données de manière contrôlée.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une migration ?

**Définition** : Une migration est un fichier PHP qui contient les instructions pour modifier la structure de la base de données (créer une table, ajouter une colonne, supprimer un index...).

**Le problème que les migrations résolvent** :

Sans migrations, voici les problèmes rencontrés :

1. **Modifications manuelles** : Tu dois écrire le SQL à la main et l'exécuter sur chaque serveur.
2. **Pas d'historique** : Impossible de savoir quand et pourquoi une modification a été faite.
3. **Synchronisation difficile** : Chaque développeur doit appliquer les mêmes changements manuellement.
4. **Pas de retour en arrière** : Si une modification casse quelque chose, difficile de revenir à l'état précédent.

**Comment les migrations résolvent ces problèmes** :

| Problème | Solution apportée par les migrations |
| -------- | ------------------------------------ |
| Modifications manuelles | Génération automatique du SQL |
| Pas d'historique | Fichiers versionnés avec date et description |
| Synchronisation difficile | Une commande applique toutes les migrations manquantes |
| Pas de retour en arrière | Méthode `down()` pour annuler chaque migration |

**Analogie concrète** : Imagine un journal de bord de rénovation d'une maison. Chaque entrée décrit une modification : "15 janvier - Ajout d'une prise électrique dans la cuisine", "20 janvier - Suppression du mur entre salon et cuisine". Tu peux relire l'historique, et si un changement pose problème, tu sais exactement quoi annuler. Les migrations sont ce journal de bord pour la base de données.

**Ce que les migrations ne sont PAS** :

- Les migrations ne sont pas les données. Elles modifient la structure (tables, colonnes), pas le contenu (les lignes de données).
- Les migrations ne remplacent pas les sauvegardes. Elles permettent de recréer une structure, pas de restaurer des données perdues.

---

### Le cycle de vie des migrations

Voici comment les migrations s'intègrent dans le développement :

```text
1. Tu modifies une entité (ajout propriété, modification type...)
              ↓
2. Tu crées une migration : php bin/console make:migration
              ↓
3. Tu vérifies le SQL généré dans le fichier de migration
              ↓
4. Tu exécutes la migration : php bin/console doctrine:migrations:migrate
              ↓
5. La base de données est mise à jour
              ↓
6. Tu commits la migration avec ton code
```

Le diagramme suivant détaille les interactions entre le développeur, l'entité, la migration et la base de données :

<div class="diagram-design">
<p><a href="../../diagrams/03-symfony-06-migrations-1.html">Le cycle de vie des migrations (HTML + SVG)</a></p>
<iframe src="../../diagrams/03-symfony-06-migrations-1.html" title="Le cycle de vie des migrations" style="width:100%;min-height:480px;border:0;background:transparent"></iframe>
</div>

**Point important** : Les migrations doivent être versionnées dans Git avec le code. Ainsi, quand un collègue récupère tes modifications, il peut appliquer les migrations pour avoir la même structure de base.

---

### Structure d'un fichier de migration

Chaque migration est un fichier PHP dans `migrations/` :

```php
<?php
// migrations/Version20260113120000.php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260113120000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Crée la table product';
    }

    public function up(Schema $schema): void
    {
        // Ce SQL est exécuté quand on applique la migration
        $this->addSql('CREATE TABLE product (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL
        )');
    }

    public function down(Schema $schema): void
    {
        // Ce SQL est exécuté quand on annule la migration
        $this->addSql('DROP TABLE product');
    }
}
```

**Les trois méthodes** :

| Méthode | Rôle |
| ------- | ---- |
| `getDescription()` | Description lisible de la migration |
| `up()` | Instructions pour appliquer la migration |
| `down()` | Instructions pour annuler la migration (optionnel) |

---

### La table doctrine_migration_versions

Doctrine garde la trace des migrations exécutées dans une table spéciale.

**Contenu de la table** :

| version | executed_at | execution_time |
| ------- | ----------- | -------------- |
| DoctrineMigrations\Version20260110120000 | 2026-01-10 12:00:00 | 150 |
| DoctrineMigrations\Version20260113120000 | 2026-01-13 14:30:00 | 85 |

**Comment Doctrine utilise cette table** :

1. Doctrine liste les fichiers dans `migrations/`
2. Il compare avec les versions dans `doctrine_migration_versions`
3. Il exécute uniquement les migrations non présentes dans la table

---

## Étapes Pratiques

### Étape 1 : Vérifier l'état des migrations

Avant de créer une migration, vérifie l'état actuel :

```bash
php bin/console doctrine:migrations:status
```

**Résultat attendu** :

```text
+----------------------+----------------------+------------------------------------------------------------------------+
| Configuration                                                                                                         |
+----------------------+----------------------+------------------------------------------------------------------------+
| Storage              | Type                 | Doctrine\Migrations\Metadata\Storage\TableMetadataStorageConfiguration |
| Storage              | Table Name           | doctrine_migration_versions                                            |
| Storage              | Column Name          | version                                                                |
|                                                                                                                       |
| Database             | Driver               | Doctrine\DBAL\Driver\PDO\PgSQL\Driver                                  |
| Database             | Name                 | app                                                                    |
|                                                                                                                       |
| Versions             | Previous             | DoctrineMigrations\Version20260110120000                               |
| Versions             | Current              | DoctrineMigrations\Version20260113120000                               |
| Versions             | Next                 | Already at latest version                                              |
| Versions             | Latest               | DoctrineMigrations\Version20260113120000                               |
|                                                                                                                       |
| Migrations           | Executed             | 2                                                                      |
| Migrations           | Executed Unavailable | 0                                                                      |
| Migrations           | Available            | 2                                                                      |
| Migrations           | New                  | 0                                                                      |
+----------------------+----------------------+------------------------------------------------------------------------+
```

**Informations clés** :

- `Executed` : Nombre de migrations déjà exécutées
- `New` : Nombre de migrations en attente d'exécution

---

### Étape 2 : Créer une migration

Suppose que tu as créé ou modifié une entité. Pour créer la migration :

```bash
php bin/console make:migration
```

**Résultat attendu** :

```text
Success!

Next: Review the new migration "migrations/Version20260113143000.php"
Then: Run the migration with php bin/console doctrine:migrations:migrate
```

**Ce qui se passe** :

1. Doctrine compare les entités PHP avec la structure actuelle de la base
2. Il génère le SQL nécessaire pour synchroniser
3. Il crée un fichier de migration avec ce SQL

---

### Étape 3 : Examiner la migration générée

Ouvre le fichier créé dans `migrations/`. Par exemple :

```php
<?php
// migrations/Version20260113143000.php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260113143000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE book (
            id SERIAL NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT DEFAULT NULL,
            page_count INT NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            published_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL,
            is_available BOOLEAN NOT NULL,
            PRIMARY KEY(id)
        )');
        $this->addSql('COMMENT ON COLUMN book.published_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE book');
    }
}
```

**Vérifications à faire** :

1. Le SQL dans `up()` correspond à ce que tu attends
2. Le SQL dans `down()` fait l'inverse de `up()`
3. Aucune donnée importante ne sera supprimée

---

### Étape 4 : Ajouter une description

Modifie la méthode `getDescription()` pour documenter ta migration :

```php
public function getDescription(): string
{
    return 'Crée la table book avec les colonnes title, description, page_count, price, published_at, is_available';
}
```

---

### Étape 5 : Exécuter la migration

Une fois le fichier vérifié, exécute la migration :

```bash
php bin/console doctrine:migrations:migrate
```

**Dialogue** :

```text
WARNING! You are about to execute a migration in database "app" that could result in schema changes and data loss.
Are you sure you want to continue? (yes/no) [yes]:
> yes

[notice] Migrating up to DoctrineMigrations\Version20260113143000
[notice] finished in 85.2ms, used 20M memory, 1 migrations executed, 2 sql queries
```

**Résultat** : La table `book` existe maintenant dans la base de données.

---

### Étape 6 : Vérifier l'exécution

Après la migration, vérifie que tout est synchronisé :

```bash
php bin/console doctrine:schema:validate
```

**Résultat attendu** :

```text
Mapping
-------
 [OK] The mapping files are correct.

Database
--------
 [OK] The database schema is in sync with the mapping files.
```

---

### Étape 7 : Voir l'historique des migrations

Liste toutes les migrations et leur état :

```bash
php bin/console doctrine:migrations:list
```

**Résultat attendu** :

```text
+-------------------------------------------+---------------------+---------------------+
| Migration Versions                                                                    |
+-------------------------------------------+---------------------+---------------------+
| DoctrineMigrations\Version20260110120000  | migrated            | 2026-01-10 12:00:00 |
| DoctrineMigrations\Version20260113143000  | migrated            | 2026-01-13 14:30:00 |
+-------------------------------------------+---------------------+---------------------+
```

---

### Étape 8 : Exécuter les migrations en mode non-interactif

Pour les scripts ou le déploiement, tu peux éviter la confirmation :

```bash
php bin/console doctrine:migrations:migrate --no-interaction
```

**Attention** : Utilise cette option uniquement quand tu es sûr des migrations à exécuter.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console make:migration` | Génère une migration à partir des entités |
| `php bin/console doctrine:migrations:diff` | Génère une migration à partir des entités (équivalent pratique de make:migration) |
| `php bin/console doctrine:migrations:migrate` | Exécute toutes les migrations en attente |
| `php bin/console doctrine:migrations:execute --up VERSION` | Exécute une migration précise (sens montée) |
| `php bin/console doctrine:migrations:execute --down VERSION` | Annule une migration précise (sens descente) |
| `php bin/console doctrine:migrations:migrate prev` | Revient à la migration précédente (rollback) |
| `php bin/console doctrine:migrations:migrate first` | Annule toutes les migrations (retour à zéro) |
| `php bin/console doctrine:migrations:status` | Affiche l'état des migrations (exécutées / en attente) |
| `php bin/console doctrine:migrations:list` | Liste toutes les migrations connues |
| `php bin/console doctrine:migrations:rollup` | Réinitialise le suivi : marque l'unique migration restante comme déjà exécutée (après consolidation manuelle des fichiers) |

---

## Commandes Avancées

### Exécuter une migration spécifique

Pour exécuter jusqu'à une version précise :

```bash
# Migrer vers une version spécifique
php bin/console doctrine:migrations:migrate 'DoctrineMigrations\Version20260113143000'
```

### Revenir en arrière

Pour annuler la dernière migration :

```bash
# Revenir à la version précédente
php bin/console doctrine:migrations:migrate prev
```

Pour annuler toutes les migrations :

```bash
# Revenir au début (supprime toutes les tables)
php bin/console doctrine:migrations:migrate first
```

### Voir le SQL sans l'exécuter

Pour voir ce qui serait exécuté sans appliquer :

```bash
php bin/console doctrine:migrations:migrate --dry-run
```

---

## Pièges Fréquents

### Piège 1 : Oublier de créer la migration après modification d'entité

**Problème** : Tu modifies une entité mais les changements n'apparaissent pas en base.

**Cause** : Modifier l'entité ne modifie pas automatiquement la base.

**Solution** : Toujours suivre le cycle :

```bash
# 1. Modifier l'entité
# 2. Créer la migration
php bin/console make:migration
# 3. Vérifier le fichier généré
# 4. Exécuter
php bin/console doctrine:migrations:migrate
```

---

### Piège 2 : Migration vide

**Problème** : `make:migration` dit "No database changes were detected".

**Causes possibles** :

1. Aucune modification n'a été faite aux entités
2. La base est déjà synchronisée
3. Tu as utilisé `doctrine:schema:update --force` au lieu des migrations

**Solution** :

```bash
# Vérifier l'état de synchronisation
php bin/console doctrine:schema:validate

# Si "The database schema is in sync", il n'y a rien à migrer
```

---

### Piège 3 : Conflits de migrations en équipe

**Problème** : Deux développeurs créent des migrations en même temps avec des horodatages proches.

**Cause** : Les migrations sont nommées avec un timestamp. Si deux personnes créent une migration au même moment, il peut y avoir des conflits.

**Solution** :

1. Communiquer avec l'équipe avant de créer des migrations
2. Récupérer les dernières modifications avant de créer une migration :

```bash
git pull
php bin/console doctrine:migrations:migrate
# Puis seulement après :
php bin/console make:migration
```

---

### Piège 4 : Perte de données lors d'une modification de colonne

**Problème** : Une migration supprime une colonne avec des données importantes.

**Cause** : `make:migration` génère automatiquement le SQL. Si tu supprimes une propriété d'une entité, le SQL contiendra `DROP COLUMN`.

**Prévention** :

1. **Toujours vérifier le fichier de migration avant d'exécuter**
2. Faire une sauvegarde avant les migrations importantes
3. Tester sur un environnement de développement d'abord

**Exemple dangereux** :

```php
// Cette migration supprime la colonne "old_field" et ses données
public function up(Schema $schema): void
{
    $this->addSql('ALTER TABLE product DROP COLUMN old_field');
}
```

---

### Piège 5 : Migration qui ne passe pas en production

**Problème** : La migration fonctionne en dev mais échoue en production.

**Causes possibles** :

1. Données existantes incompatibles avec les nouvelles contraintes
2. Différences de version de base de données
3. Timeout sur de grosses tables

**Solution** : Ajouter des vérifications dans la migration :

```php
public function up(Schema $schema): void
{
    // D'abord, mettre à jour les données existantes
    $this->addSql("UPDATE product SET status = 'active' WHERE status IS NULL");

    // Ensuite, ajouter la contrainte NOT NULL
    $this->addSql('ALTER TABLE product ALTER COLUMN status SET NOT NULL');
}
```

---

## Bonnes Pratiques

### 1. Une migration = un changement logique

Regroupe les modifications liées dans une seule migration :

```text
✅ Bon : Une migration "Ajoute la table order et order_item"
❌ Mauvais : 10 migrations séparées pour chaque colonne
```

### 2. Toujours vérifier avant d'exécuter

Lis le fichier de migration avant `doctrine:migrations:migrate`.

### 3. Tester le rollback

Vérifie que `down()` fonctionne :

```bash
# Appliquer
php bin/console doctrine:migrations:migrate

# Revenir en arrière
php bin/console doctrine:migrations:migrate prev

# Réappliquer
php bin/console doctrine:migrations:migrate
```

### 4. Ajouter des descriptions claires

Documente chaque migration :

```php
public function getDescription(): string
{
    return 'Ajoute le champ email unique à la table user (ticket #123)';
}
```

### 5. Ne jamais modifier une migration déjà exécutée

Une fois qu'une migration est en production :

- Ne la modifie jamais
- Crée une nouvelle migration pour les corrections

---

## Checklist de Validation

- [ ] Je sais créer une migration avec `make:migration`
- [ ] Je sais lire et comprendre le SQL généré dans une migration
- [ ] Je sais exécuter les migrations avec `doctrine:migrations:migrate`
- [ ] Je sais vérifier l'état des migrations avec `doctrine:migrations:status`
- [ ] Je comprends l'importance de vérifier une migration avant de l'exécuter
- [ ] Je sais que les migrations doivent être versionnées avec Git

---

## Exercice Pratique

**Énoncé** : Pratique le cycle complet de migration.

**Étapes** :

1. Crée une nouvelle entité `Category` avec :
   - `name` (string, 100, non nullable)
   - `description` (text, nullable)

2. Crée la migration correspondante

3. Vérifie le contenu du fichier de migration généré

4. Ajoute une description à la migration

5. Exécute la migration

6. Vérifie que la table existe

7. Modifie l'entité : ajoute une propriété `slug` (string, 100, non nullable, unique)

8. Crée une nouvelle migration

9. Exécute cette migration

10. Vérifie la structure finale de la table

**Résultat attendu** : Une table `category` avec les colonnes `id`, `name`, `description`, `slug`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Créer l'entité**

```bash
php bin/console make:entity Category
```

Dialogue :

```text
New property name:
> name
Field type [string]:
> string
Field length [255]:
> 100
Can this field be null [no]:
> no

New property name:
> description
Field type [string]:
> text
Can this field be null [no]:
> yes

New property name:
> (Entrée pour terminer)
```

**Étape 2 : Créer la migration**

```bash
php bin/console make:migration
```

**Étape 3 : Vérifier le fichier**

Ouvre `migrations/Version[timestamp].php` et vérifie le SQL :

```php
public function up(Schema $schema): void
{
    $this->addSql('CREATE TABLE category (
        id SERIAL NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT DEFAULT NULL,
        PRIMARY KEY(id)
    )');
}
```

**Étape 4 : Ajouter une description**

```php
public function getDescription(): string
{
    return 'Crée la table category avec name et description';
}
```

**Étape 5 : Exécuter la migration**

```bash
php bin/console doctrine:migrations:migrate
```

**Étape 6 : Vérifier**

```bash
php bin/console doctrine:schema:validate
```

**Étape 7 : Modifier l'entité**

```bash
php bin/console make:entity Category
```

Ajoute la propriété `slug` :

```text
New property name:
> slug
Field type [string]:
> string
Field length [255]:
> 100
Can this field be null [no]:
> no

Add unique constraint? [no]:
> yes
```

**Note** : Si `make:entity` ne propose pas l'option `unique`, modifie manuellement l'entité :

```php
#[ORM\Column(length: 100, unique: true)]
private ?string $slug = null;
```

**Étape 8 : Créer la nouvelle migration**

```bash
php bin/console make:migration
```

**Étape 9 : Exécuter**

```bash
php bin/console doctrine:migrations:migrate
```

**Étape 10 : Vérifier la structure**

```bash
php bin/console doctrine:schema:validate
```

La table `category` contient maintenant : `id`, `name`, `description`, `slug`.

---

## Navigation

← Fiche précédente : **[Créer des entités](05-creer-entites.md)**

→ Fiche suivante : **[Relations entre entités](07-relations-entites.md)**
