---
tags:
  - Symfony
  - Intermédiaire
  - Concept
description: "Introduction à Doctrine"
estimated_time: "65 min"
fiche_number: 4
total_fiches: 21
cursus: "Symfony"
---

# 04 - Introduction à Doctrine

> **En bref** : À la fin de cette fiche, tu comprendras le rôle de Doctrine dans Symfony et comment il fait le lien entre les classes PHP et les tables de la base de données. Lecture estimée : 65 min.


## Prérequis

- Avoir lu la fiche **[01 - Architecture Symfony](01-architecture-symfony.md)**
- Comprendre les classes PHP (fiche **[02-php/07 - Introduction à la POO](../02-php/07-introduction-poo.md)**)
- Comprendre les attributs PHP (fiche **[02-php/10 - Les attributs PHP](../02-php/10-attributs-php.md)**)
- Avoir des notions de base de données (savoir ce qu'est une table, une colonne, une ligne)

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Doctrine ORM | 3.x |

## Objectif de cette fiche

À la fin de cette fiche, tu comprendras le rôle de Doctrine dans Symfony et comment il fait le lien entre les classes PHP et les tables de la base de données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un ORM ?

**Définition** : Un ORM (Object-Relational Mapping) est un outil qui fait la correspondance entre les objets PHP et les tables d'une base de données relationnelle.

**Le problème que l'ORM résout** :

Sans ORM, voici les problèmes rencontrés :

1. **Écrire du SQL partout** : Chaque opération nécessite une requête SQL manuelle.
2. **Risques d'injection SQL** : Construire des requêtes avec des variables est dangereux.
3. **Code répétitif** : Transformer les résultats SQL en objets PHP à chaque fois.
4. **Dépendance à la base** : Changer de base de données oblige à réécrire toutes les requêtes.

**Comment l'ORM résout ces problèmes** :

| Problème | Solution apportée par l'ORM |
| -------- | --------------------------- |
| Écrire du SQL partout | Tu manipules des objets PHP, l'ORM génère le SQL |
| Risques d'injection SQL | L'ORM échappe automatiquement les valeurs |
| Code répétitif | L'ORM convertit automatiquement les résultats en objets |
| Dépendance à la base | L'ORM abstrait les différences entre MySQL, PostgreSQL, etc. |

**Analogie concrète** : Imagine un traducteur automatique. Tu parles français (objets PHP), ton correspondant parle anglais (base de données SQL). Le traducteur (ORM) convertit automatiquement tes messages dans les deux sens. Tu n'as pas besoin d'apprendre l'anglais pour communiquer.

**Ce qu'un ORM n'est PAS** :

- Un ORM n'est pas une base de données. Il communique avec une base de données existante (PostgreSQL, MySQL, SQLite...).
- Un ORM n'est pas obligatoire. Tu peux écrire du SQL manuellement, mais l'ORM simplifie le travail.

Le schéma suivant illustre comment Doctrine fait le pont entre tes classes PHP et les tables SQL :

```mermaid
graph LR
    phpClass[Classe PHP<br>Article] <--> doctrine[Doctrine ORM]
    doctrine <--> table[(Table SQL<br>article)]

    phpClass -.-> prop1[propriété title]
    table -.-> col1[colonne title]
```

---

### Qu'est-ce que Doctrine ?

**Définition** : Doctrine est l'ORM utilisé par Symfony. C'est une bibliothèque PHP indépendante que Symfony intègre par défaut.

**Les composants de Doctrine** :

| Composant | Rôle |
| --------- | ---- |
| Doctrine ORM | Fait la correspondance objets ↔ tables |
| Doctrine DBAL | Couche d'abstraction pour les bases de données |
| Doctrine Migrations | Gère les modifications de structure de la base |

**Ce que Doctrine te permet de faire** :

1. Créer des tables à partir de classes PHP
2. Sauvegarder des objets en base de données
3. Récupérer des données sous forme d'objets
4. Modifier et supprimer des données
5. Définir des relations entre tables (1-N, N-N)

---

### Le concept d'Entité

**Définition** : Une entité est une classe PHP qui représente une table de la base de données. Chaque propriété de la classe correspond à une colonne de la table.

**Correspondance classe ↔ table** :

```text
Classe PHP (Entité)              Table SQL
─────────────────────            ─────────────────────
class Product                    TABLE product
  - $id                            - id (INT, PK)
  - $name                          - name (VARCHAR)
  - $price                         - price (DECIMAL)
  - $description                   - description (TEXT)
```

**Exemple d'entité** :

```php
<?php
// src/Entity/Product.php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]                    // Cette classe est une entité Doctrine
#[ORM\Table(name: 'product')]    // Elle correspond à la table "product"
class Product
{
    #[ORM\Id]                           // Clé primaire
    #[ORM\GeneratedValue]               // Valeur auto-générée
    #[ORM\Column(type: 'integer')]      // Type entier
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]   // VARCHAR(255)
    private string $name;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]  // DECIMAL(10,2)
    private string $price;

    // Getters et setters...
}
```

**Les attributs Doctrine** :

| Attribut | Rôle |
| -------- | ---- |
| `#[ORM\Entity]` | Déclare la classe comme une entité |
| `#[ORM\Table(name: 'xxx')]` | Nom de la table (optionnel si identique à la classe) |
| `#[ORM\Id]` | Marque la propriété comme clé primaire |
| `#[ORM\GeneratedValue]` | La valeur sera générée automatiquement (auto-increment) |
| `#[ORM\Column]` | Déclare la propriété comme une colonne |

---

### Le concept de Repository

**Définition** : Un repository est une classe qui contient les méthodes pour récupérer des entités depuis la base de données.

**Le problème que les repositories résolvent** :

Sans repository, tu devrais écrire le code de récupération des données partout dans tes contrôleurs. Le repository centralise ce code.

**Analogie concrète** : Imagine une bibliothèque. Le repository est le bibliothécaire. Tu lui demandes "Donne-moi tous les livres de science-fiction" ou "Donne-moi le livre avec l'ISBN 12345". Il sait où chercher et te rapporte ce que tu demandes.

**Méthodes par défaut d'un repository** :

| Méthode | Action | Exemple |
| ------- | ------ | ------- |
| `find($id)` | Trouve une entité par son ID | `find(5)` → Product avec id=5 |
| `findAll()` | Récupère toutes les entités | `findAll()` → Tous les Products |
| `findBy([...])` | Filtre par critères | `findBy(['price' => 10])` |
| `findOneBy([...])` | Un seul résultat par critères | `findOneBy(['name' => 'Clavier'])` |
| `count([...])` | Compte les entités | `count(['available' => true])` |

**Exemple d'utilisation** :

```php
// Dans un contrôleur

// Récupérer le repository
$repository = $entityManager->getRepository(Product::class);

// Trouver un produit par son ID
$product = $repository->find(5);

// Trouver tous les produits
$allProducts = $repository->findAll();

// Trouver les produits à 29.99€
$cheapProducts = $repository->findBy(['price' => 29.99]);

// Trouver un produit par son nom
$keyboard = $repository->findOneBy(['name' => 'Clavier']);
```

---

### L'EntityManager

**Définition** : L'EntityManager est le service central de Doctrine. Il gère toutes les opérations sur les entités : sauvegarde, modification, suppression.

**Le problème que l'EntityManager résout** :

L'EntityManager fait le lien entre tes objets PHP et la base de données. Il "surveille" les objets et applique les changements en base.

**Analogie concrète** : Imagine un chef de chantier. Tu lui donnes des instructions ("construis cette maison", "modifie ce mur", "détruis ce garage") et il coordonne les ouvriers pour exécuter le travail. L'EntityManager est ce chef de chantier : tu lui donnes des objets et des instructions, il gère les requêtes SQL.

**Méthodes principales** :

| Méthode | Action | Quand l'utiliser |
| ------- | ------ | ---------------- |
| `persist($entity)` | Prépare une entité à être sauvegardée | Nouvelle entité à créer |
| `remove($entity)` | Prépare une entité à être supprimée | Entité à supprimer |
| `flush()` | Exécute les opérations en attente | Après persist/remove |
| `getRepository($class)` | Récupère le repository d'une entité | Pour faire des recherches |

**Flux de travail type** :

```text
1. Créer ou modifier un objet PHP
           ↓
2. persist($objet) - Dire à Doctrine de surveiller l'objet
           ↓
3. flush() - Doctrine exécute le SQL (INSERT, UPDATE, DELETE)
           ↓
4. Les données sont en base
```

**Exemple complet** :

```php
// Créer un nouveau produit
$product = new Product();
$product->setName('Clavier');
$product->setPrice(49.99);

// Dire à Doctrine de préparer la sauvegarde
$entityManager->persist($product);

// Exécuter réellement le SQL INSERT
$entityManager->flush();

// Maintenant $product a un ID généré par la base
echo $product->getId(); // Affiche l'ID, par exemple 1
```

---

### La configuration de la base de données

Doctrine a besoin de savoir comment se connecter à la base de données.

**Fichier de configuration** : `.env` à la racine du projet.

**Variable DATABASE_URL** :

```env
# Format général
DATABASE_URL="driver://user:password@host:port/database_name"

# Exemple PostgreSQL
DATABASE_URL="postgresql://app:secret@database:5432/app?serverVersion=16"

# Exemple MySQL
DATABASE_URL="mysql://root:password@127.0.0.1:3306/my_database"
```

**Décomposition de l'URL** :

| Partie | Signification | Exemple |
| ------ | ------------- | ------- |
| `postgresql://` | Type de base de données | PostgreSQL |
| `app` | Nom d'utilisateur | app |
| `secret` | Mot de passe | secret |
| `database` | Hôte (serveur) | database (nom du conteneur Docker) |
| `5432` | Port | 5432 (port par défaut PostgreSQL) |
| `app` | Nom de la base | app |
| `?serverVersion=16` | Version du serveur | PostgreSQL 16 |

---

### Le schéma de la base de données

**Définition** : Le schéma est la structure de la base de données : les tables, leurs colonnes, les types de données, les relations.

**Comment Doctrine gère le schéma** :

1. Tu crées des entités (classes PHP avec attributs Doctrine)
2. Doctrine analyse les entités
3. Doctrine génère ou met à jour les tables correspondantes

**Commandes pour le schéma** :

| Commande | Action |
| -------- | ------ |
| `php bin/console doctrine:schema:validate` | Vérifie si le schéma est synchronisé |
| `php bin/console doctrine:schema:update --dump-sql` | Affiche le SQL nécessaire |
| `php bin/console doctrine:schema:update --force` | Exécute les modifications |

**Note importante** : En production, on n'utilise pas `doctrine:schema:update`. On utilise les **migrations** (voir [fiche 06 - Les migrations](06-migrations.md)).

---

## Étapes Pratiques

### Étape 1 : Vérifier la configuration de la base de données

Ouvre le fichier `.env` à la racine de ton projet et vérifie la variable `DATABASE_URL` :

```bash
# Afficher la ligne DATABASE_URL
grep DATABASE_URL .env
```

**Résultat attendu** (exemple avec PostgreSQL) :

```text
DATABASE_URL="postgresql://app:!ChangeMe!@database:5432/app?serverVersion=16&charset=utf8"
```

Si tu utilises Docker avec la configuration standard, cette URL devrait fonctionner avec le conteneur `database`.

---

### Étape 2 : Tester la connexion à la base

Exécute cette commande pour vérifier que Doctrine peut se connecter :

```bash
php bin/console doctrine:database:create --if-not-exists
```

**Résultat attendu** :

```text
Created database `app` for connection named default
```

Ou si la base existe déjà :

```text
Database `app` for connection named default already exists. Skipped.
```

---

### Étape 3 : Explorer les entités existantes

Liste les entités présentes dans ton projet :

```bash
php bin/console doctrine:mapping:info
```

**Résultat attendu** (si des entités existent) :

```text
 Found X mapped entities:

 [OK]   App\Entity\Product
 [OK]   App\Entity\User
```

Si aucune entité n'existe encore :

```text
 [CAUTION] You do not have any mapped Doctrine ORM entities according to the current configuration.
```

---

### Étape 4 : Examiner une entité existante

Si ton projet contient déjà des entités, ouvre-en une pour observer sa structure :

```bash
ls src/Entity/
```

**Structure typique d'une entité** :

```text
src/Entity/
├── Product.php
├── Category.php
└── User.php
```

Chaque fichier `.php` est une entité qui correspond à une table.

---

### Étape 5 : Vérifier le mapping

L'étape précédente liste tes entités. Pour vérifier en plus que leur mapping est correct et que le schéma de la base est bien synchronisé avec elles, utilise :

```bash
php bin/console doctrine:schema:validate
```

**Résultat attendu si tout est synchronisé** :

```text
Mapping
-------
 [OK] The mapping files are correct.

Database
--------
 [OK] The database schema is in sync with the mapping files.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console doctrine:database:create` | Crée la base de données |
| `php bin/console doctrine:database:drop --force` | Supprime la base de données |
| `php bin/console doctrine:schema:validate` | Vérifie la synchronisation entités/tables |
| `php bin/console doctrine:schema:update --dump-sql` | Affiche le SQL nécessaire pour synchroniser |
| `php bin/console doctrine:mapping:info` | Liste les entités mappées et leur état |
| `php bin/console doctrine:query:sql "SELECT * FROM product"` | Exécute une requête SQL directe |

---

## Pièges Fréquents

### Piège 1 : Erreur de connexion à la base

**Problème** : Message "Connection refused" ou "could not connect to server".

**Causes possibles** :

1. Le conteneur de base de données n'est pas démarré
2. L'URL de connexion est incorrecte
3. Le port est mauvais

**Solutions** :

```bash
# 1. Vérifier que les conteneurs sont lancés
docker compose ps

# 2. Vérifier que le conteneur database est en cours d'exécution
docker compose logs database

# 3. Vérifier l'URL dans .env
grep DATABASE_URL .env
```

---

### Piège 2 : Oublier flush()

**Problème** : Tu appelles `persist()` mais les données n'apparaissent pas en base.

**Cause** : `persist()` prépare la sauvegarde, mais c'est `flush()` qui exécute réellement le SQL.

```php
// ❌ Incorrect : manque flush()
$product = new Product();
$product->setName('Clavier');
$entityManager->persist($product);
// Les données ne sont PAS en base

// ✅ Correct
$product = new Product();
$product->setName('Clavier');
$entityManager->persist($product);
$entityManager->flush();  // Maintenant les données sont en base
```

**Règle** : Toujours appeler `flush()` après `persist()` ou `remove()`.

---

### Piège 3 : Confondre entité et repository

**Problème** : Essayer de faire une recherche sur l'entité elle-même.

```php
// ❌ Incorrect : Product est une entité, pas un repository
$products = Product::findAll();

// ✅ Correct : utiliser le repository
$repository = $entityManager->getRepository(Product::class);
$products = $repository->findAll();
```

**Règle** :

- Entité = représente UNE ligne de la table (un objet)
- Repository = permet de RECHERCHER des lignes (des objets)

---

### Piège 4 : Schéma non synchronisé

**Problème** : Tu ajoutes une propriété à une entité mais la colonne n'existe pas en base.

**Cause** : Doctrine ne modifie pas automatiquement la base de données.

**Solution** :

```bash
# Voir les différences
php bin/console doctrine:schema:update --dump-sql

# Appliquer les modifications (dev uniquement)
php bin/console doctrine:schema:update --force
```

**Note** : En production, utilise les migrations (voir fiche 06).

---

## Checklist de Validation

- [ ] Je comprends ce qu'est un ORM et pourquoi on l'utilise
- [ ] Je comprends la correspondance entre entité PHP et table SQL
- [ ] Je sais ce qu'est un repository et ses méthodes de base
- [ ] Je comprends le rôle de l'EntityManager (persist, flush)
- [ ] Je sais où se configure la connexion à la base (DATABASE_URL)
- [ ] Je sais vérifier si le schéma est synchronisé

---

## Exercice Pratique

**Énoncé** : Analyse le schéma de ta base de données et réponds aux questions.

**Étapes** :

1. Liste les entités de ton projet avec `php bin/console doctrine:mapping:info`
2. Vérifie si le schéma est synchronisé avec `php bin/console doctrine:schema:validate`
3. Affiche le SQL qui serait généré pour une mise à jour : `php bin/console doctrine:schema:update --dump-sql`

**Questions à te poser** :

- Combien d'entités existe-t-il dans le projet ?
- Le schéma est-il synchronisé ?
- Y a-t-il des différences entre les entités et les tables ?

**Résultat attendu** : Tu dois pouvoir identifier :

- Les entités présentes (ou l'absence d'entités)
- L'état de synchronisation du schéma
- Les éventuelles modifications à appliquer

---

## Solution de l'Exercice

> **Note** : Cette section décrit les résultats possibles. Tes résultats dépendront de l'état de ton projet.

---

**Commande 1** : Liste des entités

```bash
php bin/console doctrine:mapping:info
```

**Résultats possibles** :

- Message "[CAUTION] You do not have any mapped Doctrine ORM entities" → Aucune entité créée (normal pour un nouveau projet)
- Liste d'entités → Le projet contient déjà des entités

**Commande 2** : Validation du schéma

```bash
php bin/console doctrine:schema:validate
```

**Résultats possibles** :

- "[OK] The mapping files are correct" et "[OK] The database schema is in sync" → Tout est synchronisé
- "[ERROR] The database schema is not in sync" → Des différences existent

**Commande 3** : SQL de mise à jour

```bash
php bin/console doctrine:schema:update --dump-sql
```

**Résultats possibles** :

- "Nothing to update" → Aucune modification nécessaire
- Des requêtes SQL affichées → Ces requêtes synchroniseraient la base avec les entités

---

## Navigation

← Fiche précédente : **[Templates Twig](03-templates-twig.md)**

→ Fiche suivante : **[Créer des entités](05-creer-entites.md)**
