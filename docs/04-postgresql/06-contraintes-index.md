---
tags:
  - PostgreSQL
  - Intermédiaire
  - Pratique
description: "Les contraintes et les index"
estimated_time: "130 min"
fiche_number: 6
total_fiches: 8
cursus: "PostgreSQL"
---

# 06 - Les contraintes et les index

> **En bref** : À la fin de cette fiche, tu sauras utiliser les contraintes (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL) pour protéger l'intégrité de tes données, et les index pour améliorer les performances des requêtes. Lecture estimée : 130 min.


## Prérequis

- Avoir lu la fiche **[01 - Introduction à PostgreSQL](01-introduction-postgresql.md)**
- Avoir lu la fiche **[04 - INSERT, UPDATE, DELETE](04-insert-update-delete.md)**
- Savoir créer une table avec `CREATE TABLE` et insérer des données avec `INSERT`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les contraintes (PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL) pour protéger l'intégrité de tes données, et les index pour améliorer les performances des requêtes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une contrainte ?

**Définition** : Une contrainte est une règle définie sur une colonne (ou un ensemble de colonnes) d'une table. PostgreSQL vérifie automatiquement cette règle à chaque insertion ou modification de données. Si la règle n'est pas respectée, l'opération est refusée avec une erreur.

**Le problème que les contraintes résolvent** :

Sans contraintes, voici les problèmes rencontrés :

1. **Doublons incontrôlés** : Deux utilisateurs avec le même email peuvent être insérés.
2. **Données manquantes** : Un produit peut être créé sans nom ni prix.
3. **Références cassées** : Un produit peut référencer une catégorie qui n'existe pas.
4. **Données incohérentes** : Un prix négatif ou une quantité de -5 peuvent être enregistrés.

**Comment les contraintes résolvent ces problèmes** :

| Problème | Contrainte | Solution |
| -------- | ---------- | -------- |
| Doublons incontrôlés | UNIQUE | Interdit deux valeurs identiques dans une colonne |
| Données manquantes | NOT NULL | Oblige à fournir une valeur |
| Références cassées | FOREIGN KEY | Vérifie que la référence existe dans l'autre table |
| Données incohérentes | CHECK | Vérifie une condition (prix > 0, quantité >= 0) |

**Analogie concrète** : Les contraintes sont comme les règles d'un formulaire papier. Avant d'accepter ta feuille, le guichetier vérifie : "Le nom est-il rempli ?" (NOT NULL), "Ce numéro de dossier existe-t-il ?" (FOREIGN KEY), "L'âge est-il supérieur à 0 ?" (CHECK). Si une règle n'est pas respectée, le formulaire est refusé.

**Ce qu'une contrainte n'est PAS** :

- Une contrainte n'est pas une validation côté application (PHP/Symfony). Les contraintes SQL sont la **dernière ligne de défense** dans la base de données. Il faut les deux : validation applicative ET contraintes SQL.
- Une contrainte n'est pas un index. Une contrainte protège l'intégrité des données. Un index améliore la vitesse des recherches (mais certaines contraintes comme PRIMARY KEY et UNIQUE créent automatiquement un index).

---

### Qu'est-ce qu'un index ?

**Définition** : Un index est une structure de données interne à PostgreSQL qui accélère la recherche de lignes dans une table. C'est un "raccourci" que PostgreSQL utilise pour trouver des données sans parcourir toute la table.

**Le problème que les index résolvent** :

Sans index, voici les problèmes rencontrés :

1. **Recherche lente** : PostgreSQL doit lire chaque ligne de la table pour trouver un résultat (scan séquentiel).
2. **Requêtes de jointure lentes** : Les jointures entre grandes tables prennent beaucoup de temps.
3. **Tri coûteux** : Trier des milliers de lignes par date nécessite un tri complet en mémoire.

**Comment les index résolvent ces problèmes** :

| Problème | Solution apportée par les index |
| -------- | ------------------------------- |
| Recherche lente | PostgreSQL trouve directement la bonne ligne via l'index |
| Jointures lentes | L'index accélère la correspondance entre les tables |
| Tri coûteux | Si un index existe sur la colonne de tri, les données sont déjà ordonnées |

**Analogie concrète** : Un index SQL fonctionne comme l'index alphabétique à la fin d'un livre. Sans index, pour trouver le mot "PostgreSQL", tu dois lire le livre page par page. Avec l'index, tu cherches "PostgreSQL" dans la liste alphabétique et tu trouves directement "page 42". L'index prend un peu de place en fin de livre, mais il fait gagner beaucoup de temps.

**Ce qu'un index n'est PAS** :

- Un index n'est pas une contrainte. Il n'empêche pas l'insertion de données invalides.
- Un index n'est pas gratuit. Chaque index consomme de l'espace disque et ralentit légèrement les opérations d'écriture (INSERT, UPDATE, DELETE), car PostgreSQL doit mettre à jour l'index à chaque modification.

**Comparaison contrainte vs index** :

| Contrainte | Index |
| ---------- | ----- |
| Protège l'intégrité des données | Améliore la vitesse des requêtes |
| Refuse les données invalides | Ne refuse rien, ne fait qu'accélérer |
| Obligatoire pour la cohérence | Optionnel, ajouté pour la performance |
| Exemples : NOT NULL, UNIQUE, CHECK | Exemple : CREATE INDEX |

Le diagramme suivant présente les cinq types de contraintes SQL et leur rôle :

<div class="diagram-design">
<p><a href="../../diagrams/04-postgresql-06-contraintes-index-1.html">Qu&#x27;est-ce qu&#x27;un index ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/04-postgresql-06-contraintes-index-1.html" title="Qu&#x27;est-ce qu&#x27;un index ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

## Les six types de contraintes

### PRIMARY KEY (clé primaire)

**Rôle** : Identifie de manière unique chaque ligne d'une table. Combine NOT NULL + UNIQUE. Chaque table doit avoir exactement une clé primaire.

```sql
-- La colonne id est la clé primaire
-- Elle est automatiquement NOT NULL et UNIQUE
CREATE TABLE category (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
```

**Ce que fait `INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY`** :

- `INTEGER GENERATED ALWAYS AS IDENTITY` : génère automatiquement un entier auto-incrémenté (1, 2, 3...) - syntaxe recommandée depuis PostgreSQL 10 (SQL standard)
- `PRIMARY KEY` : garantit que chaque id est unique et non nul
- PostgreSQL crée automatiquement un index sur cette colonne

**Note** : L'ancienne syntaxe `SERIAL PRIMARY KEY` reste fonctionnelle mais n'est plus recommandée dans les nouvelles applications depuis PostgreSQL 10. `GENERATED ALWAYS AS IDENTITY` est la syntaxe SQL standard (ISO/IEC 9075).

---

### NOT NULL

**Rôle** : Interdit les valeurs NULL dans une colonne. La colonne doit obligatoirement contenir une valeur.

```sql
CREATE TABLE product (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,       -- Le nom est obligatoire
    description TEXT,                   -- La description est facultative (NULL autorisé)
    price NUMERIC(10,2) NOT NULL       -- Le prix est obligatoire
);
```

**Exemple de rejet** :

```sql
-- ❌ Cette requête échoue car name est NOT NULL
INSERT INTO product (name, price) VALUES (NULL, 19.99);
```

**Message d'erreur** :

```text
ERROR:  null value in column "name" of relation "product" violates not-null constraint
```

**Explication du message** : PostgreSQL t'indique que la valeur NULL dans la colonne "name" de la table "product" viole la contrainte NOT NULL.

---

### UNIQUE

**Rôle** : Interdit les doublons dans une colonne. Deux lignes ne peuvent pas avoir la même valeur dans cette colonne.

```sql
CREATE TABLE category (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,  -- Chaque catégorie a un nom unique
    slug VARCHAR(100) NOT NULL UNIQUE   -- L'identifiant URL est aussi unique
);
```

**Exemple de rejet** :

```sql
-- Première insertion : OK
INSERT INTO category (name, slug) VALUES ('Informatique', 'informatique');

-- ❌ Deuxième insertion : échoue car 'Informatique' existe déjà
INSERT INTO category (name, slug) VALUES ('Informatique', 'informatique-2');
```

**Message d'erreur** :

```text
ERROR:  duplicate key value violates unique constraint "category_name_key"
DETAIL:  Key (name)=(Informatique) already exists.
```

**Note** : UNIQUE autorise plusieurs valeurs NULL (car NULL n'est pas considéré comme égal à NULL en SQL).

---

### FOREIGN KEY (clé étrangère)

**Rôle** : Garantit qu'une valeur dans une colonne correspond à une valeur existante dans une autre table. C'est le mécanisme qui crée les **relations** entre tables.

```sql
-- La table category doit exister AVANT de créer product
CREATE TABLE category (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- category_id référence la colonne id de la table category
CREATE TABLE product (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    category_id INTEGER NOT NULL REFERENCES category(id)
);
```

**Exemple de rejet** :

```sql
-- Insérer une catégorie
INSERT INTO category (name) VALUES ('Informatique');
-- La catégorie id=1 existe

-- ✅ OK : la catégorie 1 existe
INSERT INTO product (name, price, category_id) VALUES ('Clavier', 49.99, 1);

-- ❌ Échoue : la catégorie 999 n'existe pas
INSERT INTO product (name, price, category_id) VALUES ('Souris', 29.99, 999);
```

**Message d'erreur** :

```text
ERROR:  insert or update on table "product" violates foreign key constraint "product_category_id_fkey"
DETAIL:  Key (category_id)=(999) is not present in table "category".
```

**Protection en cascade** : Par défaut, PostgreSQL empêche de supprimer une catégorie si des produits y sont rattachés. Tu peux changer ce comportement :

```sql
-- ON DELETE CASCADE : supprimer la catégorie supprime aussi ses produits
category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE CASCADE

-- ON DELETE SET NULL : supprimer la catégorie met category_id à NULL
category_id INTEGER REFERENCES category(id) ON DELETE SET NULL

-- ON DELETE NO ACTION (défaut PostgreSQL) : refuse si des enfants existent
-- (le contrôle peut être différé jusqu'à la fin de la transaction)
category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE NO ACTION

-- ON DELETE RESTRICT : même refus, mais le contrôle n'est pas différable
category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE RESTRICT
```

| Comportement | Effet | Cas d'usage |
| ------------ | ----- | ----------- |
| `NO ACTION` (défaut) | Refuse la suppression du parent (contrôle différable) | Comportement SQL standard |
| `RESTRICT` | Refuse immédiatement, non différable | Sécurité maximale dans la transaction |
| `CASCADE` | Supprime aussi les enfants | Suppression en chaîne voulue |
| `SET NULL` | Met la clé étrangère à NULL | L'enfant peut exister sans parent |

---

### CHECK

**Rôle** : Vérifie qu'une condition est vraie pour chaque ligne. Permet de définir des règles métier directement dans la base.

```sql
CREATE TABLE product (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);
```

**Exemple de rejet** :

```sql
-- ❌ Échoue : le prix doit être supérieur à 0
INSERT INTO product (name, price, stock) VALUES ('Clavier', -5.00, 10);
```

**Message d'erreur** :

```text
ERROR:  new row for relation "product" violates check constraint "product_price_check"
DETAIL:  Failing row contains (1, Clavier, -5.00, 10).
```

**Conditions possibles avec CHECK** :

```sql
-- Vérifier une plage de valeurs
CHECK (price BETWEEN 0.01 AND 99999.99)

-- Vérifier une liste de valeurs autorisées
CHECK (status IN ('draft', 'published', 'archived'))

-- Vérifier une longueur minimale
CHECK (LENGTH(name) >= 2)

-- Combiner plusieurs conditions
CHECK (price > 0 AND stock >= 0)
```

---

### DEFAULT

**Rôle** : Définit une valeur par défaut quand aucune valeur n'est fournie lors de l'insertion.

**Note** : DEFAULT n'est pas une contrainte au sens strict (elle ne refuse rien), mais elle est définie de la même manière et participe à l'intégrité des données.

```sql
CREATE TABLE product (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Utilisation** :

```sql
-- stock, is_active et created_at utilisent leurs valeurs par défaut
INSERT INTO product (name, price) VALUES ('Clavier', 49.99);

-- Vérifier les valeurs par défaut
SELECT name, price, stock, is_active, created_at FROM product;
```

**Résultat attendu** :

```text
  name   | price | stock | is_active |         created_at
---------+-------+-------+-----------+----------------------------
 Clavier | 49.99 |     0 | t         | 2025-03-17 10:30:00.000000
```

---

## Étapes Pratiques

### Étape 1 : Créer les tables avec contraintes

On va créer trois tables liées : `category`, `product` et `order_item`.

Connecte-toi à PostgreSQL :

```bash
docker compose exec database psql -U symfony_user -d symfony_db
```

Crée les tables dans l'ordre (les tables référencées doivent exister avant celles qui les référencent) :

```sql
-- Table 1 : category (aucune dépendance)
CREATE TABLE category (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE
);

-- Table 2 : product (dépend de category)
CREATE TABLE product (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price > 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    category_id INTEGER NOT NULL REFERENCES category(id) ON DELETE RESTRICT
);

-- Table 3 : order_item (dépend de product)
CREATE TABLE order_item (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price > 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Résultat attendu** :

```text
CREATE TABLE
CREATE TABLE
CREATE TABLE
```

---

### Étape 2 : Vérifier la structure des tables

Utilise la commande `\d` pour examiner les contraintes créées :

```sql
\d product
```

**Résultat attendu** :

```text
                                       Table "public.product"
   Column    |            Type             | Collation | Nullable |               Default
-------------+-----------------------------+-----------+----------+-------------------------------------
 id          | integer                     |           | not null | generated always as identity
 name        | character varying(255)      |           | not null |
 price       | numeric(10,2)               |           | not null |
 stock       | integer                     |           | not null | 0
 is_active   | boolean                     |           | not null | true
 created_at  | timestamp without time zone |           | not null | now()
 category_id | integer                     |           | not null |
Indexes:
    "product_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "product_price_check" CHECK (price > 0::numeric)
    "product_stock_check" CHECK (stock >= 0)
Foreign-key constraints:
    "product_category_id_fkey" FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE RESTRICT
```

**Ce qu'on observe** :

- La colonne `Nullable` indique `not null` pour les colonnes avec NOT NULL
- La colonne `Default` montre les valeurs par défaut
- Les sections en bas listent les index, les CHECK et les FOREIGN KEY

---

### Étape 3 : Tester les contraintes avec des données

Insère d'abord des données valides :

```sql
-- Insérer des catégories
INSERT INTO category (name, slug) VALUES ('Informatique', 'informatique');
INSERT INTO category (name, slug) VALUES ('Audio', 'audio');

-- Insérer des produits (category_id=1 correspond à 'Informatique')
INSERT INTO product (name, price, stock, category_id)
VALUES ('Clavier mécanique', 89.99, 25, 1);

INSERT INTO product (name, price, stock, category_id)
VALUES ('Souris sans fil', 34.99, 50, 1);

INSERT INTO product (name, price, category_id)
VALUES ('Casque Bluetooth', 59.99, 2);
-- stock prend la valeur par défaut 0

-- Insérer des lignes de commande
INSERT INTO order_item (product_id, quantity, unit_price)
VALUES (1, 2, 89.99);
```

**Résultat attendu** : Chaque INSERT affiche `INSERT 0 1`.

Maintenant, teste les rejets :

```sql
-- Test 1 : NOT NULL - nom manquant
INSERT INTO product (name, price, category_id) VALUES (NULL, 19.99, 1);
-- ERREUR : null value in column "name"

-- Test 2 : CHECK - prix négatif
INSERT INTO product (name, price, category_id) VALUES ('Test', -5.00, 1);
-- ERREUR : violates check constraint "product_price_check"

-- Test 3 : FOREIGN KEY - catégorie inexistante
INSERT INTO product (name, price, category_id) VALUES ('Test', 19.99, 999);
-- ERREUR : violates foreign key constraint

-- Test 4 : UNIQUE - catégorie en double
INSERT INTO category (name, slug) VALUES ('Informatique', 'info-2');
-- ERREUR : duplicate key value violates unique constraint

-- Test 5 : CHECK - quantité à 0
INSERT INTO order_item (product_id, quantity, unit_price) VALUES (1, 0, 10.00);
-- ERREUR : violates check constraint (quantity > 0)

-- Test 6 : FOREIGN KEY - supprimer une catégorie utilisée
DELETE FROM category WHERE id = 1;
-- ERREUR : violates foreign key constraint (des produits utilisent cette catégorie)
```

Chaque requête ci-dessus produit une erreur. C'est le comportement attendu : les contraintes protègent tes données.

---

### Étape 4 : Créer des index

Les index améliorent la vitesse des requêtes. Crée des index sur les colonnes que tu utilises fréquemment dans les clauses `WHERE`, `JOIN` ou `ORDER BY` :

```sql
-- Index sur le nom du produit (recherche fréquente par nom)
CREATE INDEX idx_product_name ON product(name);

-- Index sur category_id (utilisé dans les jointures et les filtres)
CREATE INDEX idx_product_category_id ON product(category_id);

-- Index sur created_at (tri fréquent par date)
CREATE INDEX idx_product_created_at ON product(created_at);

-- Index sur is_active (filtre fréquent : afficher les produits actifs)
CREATE INDEX idx_product_is_active ON product(is_active);
```

**Résultat attendu** : Chaque commande affiche `CREATE INDEX`.

**Vérifier les index** :

```sql
\di
```

**Résultat attendu** :

```text
                          List of relations
 Schema |           Name            | Type  | Owner | Table
--------+---------------------------+-------+-------+------------
 public | category_name_key         | index | app   | category
 public | category_pkey             | index | app   | category
 public | category_slug_key         | index | app   | category
 public | idx_product_category_id   | index | app   | product
 public | idx_product_created_at    | index | app   | product
 public | idx_product_is_active     | index | app   | product
 public | idx_product_name          | index | app   | product
 public | order_item_pkey           | index | app   | order_item
 public | product_pkey              | index | app   | product
```

**Observation** : Les index `category_pkey`, `category_name_key`, `category_slug_key` et `product_pkey` ont été créés automatiquement par les contraintes PRIMARY KEY et UNIQUE.

---

### Étape 5 : Vérifier qu'un index est utilisé avec EXPLAIN

La commande `EXPLAIN` montre comment PostgreSQL exécute une requête :

```sql
-- Sans index pertinent : scan séquentiel
EXPLAIN SELECT * FROM product WHERE price > 50;
```

**Résultat attendu** :

```text
                       QUERY PLAN
---------------------------------------------------------
 Seq Scan on product  (cost=0.00..1.04 rows=1 width=100)
   Filter: (price > 50)
```

`Seq Scan` signifie que PostgreSQL parcourt toute la table (scan séquentiel). C'est normal ici car il n'y a pas d'index sur `price`.

```sql
-- Avec un index : scan d'index
EXPLAIN SELECT * FROM product WHERE name = 'Clavier mécanique';
```

**Résultat attendu** (avec peu de données, PostgreSQL peut choisir un Seq Scan même avec un index ; avec plus de données, il utilisera l'index) :

```text
                                   QUERY PLAN
--------------------------------------------------------------------------------
 Index Scan using idx_product_name on product  (cost=0.15..8.17 rows=1 width=100)
   Index Cond: ((name)::text = 'Clavier mécanique'::text)
```

`Index Scan` signifie que PostgreSQL utilise l'index pour trouver directement la ligne.

**Note** : Avec très peu de données (2-3 lignes), PostgreSQL peut décider qu'un Seq Scan est plus rapide qu'un Index Scan. C'est un comportement normal. L'avantage des index apparaît sur des tables de centaines ou milliers de lignes.

---

### Étape 6 : Modifier les contraintes avec ALTER TABLE

Tu peux ajouter ou supprimer des contraintes sur une table existante :

**Ajouter une contrainte NOT NULL** :

```sql
-- Ajouter NOT NULL sur une colonne existante
-- ATTENTION : toutes les valeurs existantes doivent être non nulles
ALTER TABLE product ALTER COLUMN description SET NOT NULL;
```

**Supprimer une contrainte NOT NULL** :

```sql
-- Rendre une colonne nullable
ALTER TABLE product ALTER COLUMN description DROP NOT NULL;
```

**Ajouter une contrainte UNIQUE** :

```sql
-- Ajouter une contrainte UNIQUE sur une colonne existante
ALTER TABLE product ADD CONSTRAINT product_name_unique UNIQUE (name);
```

**Ajouter une contrainte CHECK** :

```sql
-- Ajouter une contrainte CHECK
ALTER TABLE product ADD CONSTRAINT product_price_max CHECK (price <= 99999.99);
```

**Supprimer une contrainte (par son nom)** :

```sql
-- Supprimer une contrainte CHECK ou UNIQUE
ALTER TABLE product DROP CONSTRAINT product_price_max;
```

**Ajouter une clé étrangère** :

```sql
-- Ajouter une clé étrangère sur une colonne existante
ALTER TABLE product
ADD CONSTRAINT product_category_fk FOREIGN KEY (category_id)
REFERENCES category(id) ON DELETE RESTRICT;
```

**Supprimer un index** :

```sql
-- Supprimer un index
DROP INDEX idx_product_is_active;
```

**Ajouter une valeur par défaut** :

```sql
-- Ajouter une valeur par défaut
ALTER TABLE product ALTER COLUMN is_active SET DEFAULT true;

-- Supprimer une valeur par défaut
ALTER TABLE product ALTER COLUMN is_active DROP DEFAULT;
```

---

### Étape 7 : Contraintes et Doctrine (Symfony)

Dans un projet Symfony, Doctrine crée automatiquement les contraintes SQL à partir de tes entités PHP. Voici la correspondance :

**Entité Doctrine** :

```php
// src/Entity/Product.php
#[ORM\Entity]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;           // → INTEGER GENERATED ... AS IDENTITY + PRIMARY KEY(id)

    #[ORM\Column(length: 255)]
    private ?string $name = null;       // → VARCHAR(255) NOT NULL

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private ?string $price = null;      // → NUMERIC(10,2) NOT NULL

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null; // → TEXT (nullable, pas de NOT NULL)

    #[ORM\Column(unique: true)]
    private ?string $slug = null;       // → VARCHAR(255) NOT NULL UNIQUE

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;  // → INTEGER NOT NULL REFERENCES category(id)
}
```

**Correspondance Doctrine → SQL** :

| Annotation Doctrine | Contrainte SQL générée |
| ------------------- | ---------------------- |
| `#[ORM\Id]` + `#[ORM\GeneratedValue]` | `INTEGER GENERATED ... AS IDENTITY` + `PRIMARY KEY(id)` (Doctrine ORM 3 / PostgreSQL 16) |
| `#[ORM\Column]` (sans nullable) | `NOT NULL` |
| `#[ORM\Column(nullable: true)]` | Pas de NOT NULL |
| `#[ORM\Column(unique: true)]` | `UNIQUE` |
| `#[ORM\ManyToOne]` + `#[ORM\JoinColumn(nullable: false)]` | `FOREIGN KEY ... NOT NULL` |
| `#[ORM\ManyToOne]` (sans JoinColumn) | `FOREIGN KEY ... NULL autorisé` |

**Générer la migration Doctrine** :

```bash
# Doctrine génère le SQL correspondant à tes entités
php bin/console doctrine:migrations:diff
```

**Migration générée** (exemple) :

```php
// migrations/Version20250317100000.php
public function up(Schema $schema): void
{
    $this->addSql('CREATE TABLE product (
        id INT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10,2) NOT NULL,
        description TEXT DEFAULT NULL,
        slug VARCHAR(255) NOT NULL,
        category_id INTEGER NOT NULL,
        PRIMARY KEY(id),
        CONSTRAINT FK_D34A04AD12469DE2 FOREIGN KEY (category_id)
            REFERENCES category (id) NOT DEFERRABLE INITIALLY IMMEDIATE
    )');
    $this->addSql('CREATE UNIQUE INDEX UNIQ_D34A04AD989D9B62 ON product (slug)');
    $this->addSql('CREATE INDEX IDX_D34A04AD12469DE2 ON product (category_id)');
}
```

**Ce que Doctrine crée automatiquement** :

- Un index sur chaque clé étrangère (`IDX_...`)
- Un index unique sur chaque colonne `unique: true` (`UNIQ_...`)
- Les contraintes NOT NULL selon `nullable: true/false`

**Ce que Doctrine ne crée PAS automatiquement** :

- Les contraintes CHECK (prix > 0, stock >= 0)
- Les index sur les colonnes de recherche ou de tri
- Les valeurs DEFAULT personnalisées

Pour ces cas, tu dois ajouter le SQL manuellement dans une migration ou utiliser des attributs Doctrine avancés.

---

### Étape 8 : Nettoyage

Pour supprimer les tables créées dans cette fiche (dans l'ordre inverse de création, à cause des clés étrangères) :

```sql
DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS category;
```

---

## Quand créer un index ?

| Situation | Créer un index ? | Raison |
| --------- | ---------------- | ------ |
| Colonne utilisée dans `WHERE` fréquemment | Oui | Accélère la recherche |
| Colonne utilisée dans `JOIN` (clé étrangère) | Oui (Doctrine le fait) | Accélère les jointures |
| Colonne utilisée dans `ORDER BY` fréquemment | Oui | Évite le tri en mémoire |
| Colonne rarement utilisée dans les requêtes | Non | L'index coûte de l'espace sans bénéfice |
| Table avec très peu de lignes (< 100) | Non | Le Seq Scan est déjà rapide |
| Colonne modifiée très fréquemment | Prudence | L'index ralentit les écritures |

**Règle simple** : Crée un index quand une requête est lente et qu'elle filtre ou trie sur une colonne sans index. Ne crée pas d'index "au cas où".

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `\d nom_table` | Affiche la structure d'une table avec ses contraintes |
| `\di` | Liste tous les index de la base (le motif optionnel filtre les **noms d'index**, pas les tables) |
| `\d nom_table` | Affiche la table, y compris ses index et contraintes |
| `EXPLAIN SELECT ...` | Montre comment PostgreSQL exécute la requête |
| `ALTER TABLE t ADD CONSTRAINT ...` | Ajoute une contrainte sur une table existante |
| `ALTER TABLE t DROP CONSTRAINT nom` | Supprime une contrainte par son nom |
| `ALTER TABLE t ALTER COLUMN c SET NOT NULL` | Rend une colonne obligatoire |
| `ALTER TABLE t ALTER COLUMN c DROP NOT NULL` | Rend une colonne facultative |
| `CREATE INDEX nom ON table(colonne)` | Crée un index |
| `DROP INDEX nom` | Supprime un index |

---

## Pièges Fréquents

### Piège 1 : Ordre de création des tables

⚠️ **Problème** : Tu crées une table avec une clé étrangère vers une table qui n'existe pas encore.

```sql
-- ❌ Échoue : la table category n'existe pas encore
CREATE TABLE product (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id INTEGER REFERENCES category(id)
);
CREATE TABLE category (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
```

✅ **Solution** : Crée d'abord les tables qui sont référencées, puis les tables qui contiennent les clés étrangères.

```sql
-- ✅ Correct : category d'abord, product ensuite
CREATE TABLE category (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);
CREATE TABLE product (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_id INTEGER REFERENCES category(id)
);
```

---

### Piège 2 : Ajouter NOT NULL sur une colonne avec des valeurs NULL

⚠️ **Problème** : Tu ajoutes NOT NULL sur une colonne qui contient déjà des valeurs NULL.

```sql
-- ❌ Échoue si des lignes ont description = NULL
ALTER TABLE product ALTER COLUMN description SET NOT NULL;
```

**Message d'erreur** :

```text
ERROR:  column "description" of relation "product" contains null values
```

✅ **Solution** : Mets à jour les valeurs NULL avant d'ajouter la contrainte.

```sql
-- Étape 1 : remplir les valeurs NULL
UPDATE product SET description = '' WHERE description IS NULL;

-- Étape 2 : ajouter la contrainte
ALTER TABLE product ALTER COLUMN description SET NOT NULL;
```

---

### Piège 3 : Supprimer une table référencée par une clé étrangère

⚠️ **Problème** : Tu supprimes une table alors qu'une autre table la référence.

```sql
-- ❌ Échoue : product a une clé étrangère vers category
DROP TABLE category;
```

✅ **Solution** : Supprime d'abord les tables qui contiennent les clés étrangères, ou utilise `CASCADE`.

```sql
-- Option 1 : supprimer dans l'ordre inverse
DROP TABLE product;
DROP TABLE category;

-- Option 2 : CASCADE supprime aussi les clés étrangères qui référencent cette table
DROP TABLE category CASCADE;
-- ATTENTION : cela supprime les contraintes FK dans product, pas la table product
```

---

### Piège 4 : Trop d'index

⚠️ **Problème** : Tu crées un index sur chaque colonne "au cas où". Résultat : les INSERT et UPDATE deviennent lents car PostgreSQL doit mettre à jour tous les index.

✅ **Solution** : Crée des index uniquement sur les colonnes réellement utilisées dans `WHERE`, `JOIN` et `ORDER BY`. Utilise `EXPLAIN` pour vérifier si un index est utilisé.

---

### Piège 5 : Oublier le nom de la contrainte pour la supprimer

⚠️ **Problème** : Tu veux supprimer une contrainte mais tu ne connais pas son nom.

✅ **Solution** : Utilise `\d nom_table` pour voir le nom des contraintes.

```sql
-- Affiche toutes les contraintes de la table product
\d product

-- Puis supprime par le nom affiché
ALTER TABLE product DROP CONSTRAINT product_price_check;
```

---

## Checklist de Validation

- [ ] Je sais créer une table avec PRIMARY KEY, NOT NULL, UNIQUE, CHECK et DEFAULT
- [ ] Je sais créer une clé étrangère avec REFERENCES
- [ ] Je comprends la différence entre ON DELETE RESTRICT, CASCADE et SET NULL
- [ ] Je sais tester qu'une contrainte rejette les données invalides
- [ ] Je sais créer un index avec CREATE INDEX
- [ ] Je sais vérifier les index d'une table avec `\di`
- [ ] Je sais utiliser EXPLAIN pour voir si un index est utilisé
- [ ] Je sais ajouter et supprimer une contrainte avec ALTER TABLE
- [ ] Je comprends comment Doctrine génère les contraintes automatiquement

---

## Exercice Pratique

**Énoncé** : Crée un schéma de base de données pour une bibliothèque avec les contraintes appropriées.

**Tables à créer** :

1. `author` : id, first_name (obligatoire), last_name (obligatoire)
2. `book` : id, title (obligatoire, unique), isbn (obligatoire, unique, 13 caractères exactement), price (obligatoire, supérieur à 0), published_year (entre 1450 et 2026), author_id (clé étrangère vers author, obligatoire)
3. `borrowing` : id, book_id (clé étrangère vers book), borrower_name (obligatoire), borrowed_at (défaut : maintenant), returned_at (facultatif)

**Consignes** :

- Crée les tables dans le bon ordre
- Ajoute un index sur `book.title` (recherche fréquente)
- Ajoute un index sur `book.author_id` (jointures)
- Insère 2 auteurs, 3 livres et 1 emprunt
- Teste au moins 3 rejets de contraintes différents
- Vérifie la structure avec `\d book`

**Résultat attendu** : Les insertions valides réussissent, les insertions invalides sont rejetées avec des messages d'erreur explicites.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Créer les tables**

```sql
-- Table author (aucune dépendance)
CREATE TABLE author (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL
);

-- Table book (dépend de author)
CREATE TABLE book (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    isbn CHAR(13) NOT NULL UNIQUE,
    price NUMERIC(8,2) NOT NULL CHECK (price > 0),
    published_year INTEGER CHECK (published_year BETWEEN 1450 AND 2026),
    author_id INTEGER NOT NULL REFERENCES author(id) ON DELETE RESTRICT
);

-- Table borrowing (dépend de book)
CREATE TABLE borrowing (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES book(id) ON DELETE RESTRICT,
    borrower_name VARCHAR(255) NOT NULL,
    borrowed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    returned_at TIMESTAMP
);
```

**Étape 2 : Créer les index**

```sql
CREATE INDEX idx_book_title ON book(title);
CREATE INDEX idx_book_author_id ON book(author_id);
CREATE INDEX idx_borrowing_book_id ON borrowing(book_id);
```

**Étape 3 : Insérer des données valides**

```sql
-- 2 auteurs
INSERT INTO author (first_name, last_name) VALUES ('Victor', 'Hugo');
INSERT INTO author (first_name, last_name) VALUES ('Albert', 'Camus');

-- 3 livres
INSERT INTO book (title, isbn, price, published_year, author_id)
VALUES ('Les Misérables', '9782070409228', 12.50, 1862, 1);

INSERT INTO book (title, isbn, price, published_year, author_id)
VALUES ('Notre-Dame de Paris', '9782070411856', 9.90, 1831, 1);

INSERT INTO book (title, isbn, price, published_year, author_id)
VALUES ('L''Étranger', '9782070360024', 7.50, 1942, 2);

-- 1 emprunt
INSERT INTO borrowing (book_id, borrower_name)
VALUES (1, 'Marie Dupont');
```

**Étape 4 : Tester les rejets**

```sql
-- Test 1 : UNIQUE - titre en double
INSERT INTO book (title, isbn, price, published_year, author_id)
VALUES ('Les Misérables', '9782070409229', 15.00, 1862, 1);
-- ERREUR : duplicate key value violates unique constraint "book_title_key"

-- Test 2 : CHECK - prix négatif
INSERT INTO book (title, isbn, price, published_year, author_id)
VALUES ('Test', '1234567890123', -5.00, 2020, 1);
-- ERREUR : violates check constraint "book_price_check"

-- Test 3 : CHECK - année hors plage
INSERT INTO book (title, isbn, price, published_year, author_id)
VALUES ('Test', '1234567890123', 10.00, 1200, 1);
-- ERREUR : violates check constraint "book_published_year_check"

-- Test 4 : FOREIGN KEY - auteur inexistant
INSERT INTO book (title, isbn, price, published_year, author_id)
VALUES ('Test', '1234567890123', 10.00, 2020, 999);
-- ERREUR : violates foreign key constraint

-- Test 5 : NOT NULL - titre manquant
INSERT INTO book (title, isbn, price, author_id)
VALUES (NULL, '1234567890123', 10.00, 1);
-- ERREUR : null value in column "title" violates not-null constraint
```

**Étape 5 : Vérifier la structure**

```sql
\d book
```

**Résultat attendu** :

```text
                                      Table "public.book"
     Column     |          Type          | Collation | Nullable |             Default
----------------+------------------------+-----------+----------+----------------------------------
 id             | integer                |           | not null | generated always as identity
 title          | character varying(255) |           | not null |
 isbn           | character(13)          |           | not null |
 price          | numeric(8,2)           |           | not null |
 published_year | integer                |           |          |
 author_id      | integer                |           | not null |
Indexes:
    "book_pkey" PRIMARY KEY, btree (id)
    "book_isbn_key" UNIQUE CONSTRAINT, btree (isbn)
    "book_title_key" UNIQUE CONSTRAINT, btree (title)
    "idx_book_author_id" btree (author_id)
    "idx_book_title" btree (title)
Check constraints:
    "book_price_check" CHECK (price > 0::numeric)
    "book_published_year_check" CHECK (published_year >= 1450 AND published_year <= 2026)
Foreign-key constraints:
    "book_author_id_fkey" FOREIGN KEY (author_id) REFERENCES author(id) ON DELETE RESTRICT
Referenced by:
    TABLE "borrowing" CONSTRAINT "borrowing_book_id_fkey" FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE RESTRICT
```

**Étape 6 : Nettoyage**

```sql
DROP TABLE IF EXISTS borrowing;
DROP TABLE IF EXISTS book;
DROP TABLE IF EXISTS author;
```

---

## Navigation

← Fiche précédente : **[Les fonctions d'agrégation](05-fonctions-agregation.md)**

→ Fiche suivante : **[Les sous-requêtes et les vues](07-sous-requetes-vues.md)**
