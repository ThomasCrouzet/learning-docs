---
tags:
  - PostgreSQL
  - Débutant
  - Concept
description: "Introduction à PostgreSQL"
estimated_time: "70 min"
fiche_number: 1
total_fiches: 8
cursus: "PostgreSQL"
---

# 01 - Introduction à PostgreSQL

> **En bref** : À la fin de cette fiche, tu sauras te connecter à PostgreSQL via Docker et explorer la structure de la base de données (tables, colonnes). Lecture estimée : 70 min.


## Prérequis

- Avoir un environnement Docker fonctionnel (fiche **[01-docker/01 - Docker Compose Symfony](../01-docker/01-docker-compose-symfony.md)**)
- Comprendre ce qu'est une entité Doctrine (fiche **[03-symfony/04 - Introduction à Doctrine](../03-symfony/04-introduction-doctrine.md)**)
- Aucune connaissance préalable de SQL n'est requise (tout est expliqué ci-dessous)

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| PostgreSQL | 16 |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras te connecter à PostgreSQL via Docker et explorer la structure de la base de données (tables, colonnes).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que PostgreSQL ?

**Définition** : PostgreSQL (souvent appelé "Postgres") est un système de gestion de base de données relationnelle (SGBDR). Il stocke les données de ton application de manière structurée.

**Le problème que PostgreSQL résout** :

Sans base de données, voici les problèmes rencontrés :

1. **Stockage volatil** : Les données en mémoire PHP disparaissent à chaque requête.
2. **Pas de structure** : Stocker dans des fichiers texte devient vite chaotique.
3. **Pas de recherche efficace** : Parcourir des fichiers pour trouver une donnée est lent.
4. **Pas de relations** : Difficile de lier un utilisateur à ses commandes.

**Comment PostgreSQL résout ces problèmes** :

| Problème | Solution apportée par PostgreSQL |
| -------- | -------------------------------- |
| Stockage volatil | Données persistantes sur disque |
| Pas de structure | Tables avec colonnes typées |
| Recherche inefficace | Index et optimisation des requêtes |
| Pas de relations | Clés étrangères et jointures |

**Analogie concrète** : PostgreSQL est comme un classeur de bureau avec des dossiers suspendus. Chaque dossier (table) contient des fiches (lignes) avec des informations standardisées (colonnes). Tu peux trouver une fiche grâce à un système d'étiquettes (index) et relier des fiches entre elles (relations).

**Ce que PostgreSQL n'est PAS** :

- PostgreSQL n'est pas un langage de programmation. C'est un serveur qui répond à des requêtes SQL.
- PostgreSQL n'est pas Doctrine. Doctrine est un ORM PHP qui communique avec PostgreSQL.

---

### Qu'est-ce que SQL ?

**Définition** : SQL (Structured Query Language) est le langage utilisé pour communiquer avec une base de données relationnelle.

**Les quatre types d'opérations SQL** :

| Type | Commandes | Action |
| ---- | --------- | ------ |
| DDL (Data Definition) | CREATE, ALTER, DROP | Modifier la structure |
| DML (Data Manipulation) | SELECT, INSERT, UPDATE, DELETE | Manipuler les données |
| DCL (Data Control) | GRANT, REVOKE | Gérer les permissions |
| TCL (Transaction Control) | COMMIT, ROLLBACK | Gérer les transactions |

**Dans cette fiche**, on se concentre sur la consultation (SELECT) et l'exploration.

---

### Structure d'une base de données

Une base de données est organisée en plusieurs niveaux :

```text
Serveur PostgreSQL
└── Base de données (ex: "app")
    ├── Table "product"
    │   ├── Colonne "id" (integer)
    │   ├── Colonne "name" (varchar)
    │   └── Colonne "price" (decimal)
    ├── Table "category"
    │   ├── Colonne "id" (integer)
    │   └── Colonne "name" (varchar)
    └── Table "user"
        ├── Colonne "id" (integer)
        ├── Colonne "email" (varchar)
        └── Colonne "password" (varchar)
```

**Vocabulaire** :

| Terme | Définition | Équivalent Doctrine |
| ----- | ---------- | ------------------- |
| Table | Ensemble de données du même type | Entité |
| Colonne | Attribut d'une table | Propriété |
| Ligne (row) | Un enregistrement | Instance d'entité |
| Clé primaire | Identifiant unique d'une ligne | Propriété `$id` |
| Clé étrangère | Référence vers une autre table | Relation |

Le schéma suivant illustre la structure hiérarchique d'un serveur PostgreSQL :

<div class="diagram-design">
<p><a href="../../diagrams/04-postgresql-01-introduction-postgresql-1.html">Structure d&#x27;une base de données (HTML + SVG)</a></p>
<iframe src="../../diagrams/04-postgresql-01-introduction-postgresql-1.html" title="Structure d&#x27;une base de données" style="width:100%;min-height:516px;border:0;background:transparent"></iframe>
</div>

---

### psql : le client PostgreSQL

**Définition** : `psql` est le client en ligne de commande officiel de PostgreSQL. Il permet d'exécuter des requêtes SQL et d'explorer la base.

**Commandes spéciales psql** (commencent par `\`) :

| Commande | Action |
| -------- | ------ |
| `\l` | Liste les bases de données |
| `\c nom_base` | Se connecter à une base |
| `\dt` | Liste les tables |
| `\d nom_table` | Décrit une table (colonnes) |
| `\q` | Quitter psql |
| `\?` | Aide sur les commandes |

---

### Connexion via Docker

Dans un projet Symfony avec Docker, PostgreSQL tourne dans un conteneur. Pour y accéder, tu dois :

1. Entrer dans le conteneur PostgreSQL
2. Lancer `psql` avec les bons identifiants

**Schéma de connexion** :

```text
Ton terminal
    ↓ docker compose exec database
Conteneur "database"
    ↓ psql -U symfony_user -d symfony_db
Client psql connecté à PostgreSQL
```

---

## Étapes Pratiques

### Étape 1 : Vérifier que le conteneur PostgreSQL est lancé

```bash
docker compose ps
```

**Résultat attendu** :

```text
NAME                SERVICE     STATUS          PORTS
project-database-1  database    running         0.0.0.0:5432->5432/tcp
project-php-1       php         running         ...
```

Le conteneur `database` doit être en status `running`.

**Si le conteneur n'est pas lancé** :

```bash
docker compose up -d
```

---

### Étape 2 : Se connecter à PostgreSQL via Docker

```bash
docker compose exec database psql -U symfony_user -d symfony_db
```

**Explication de la commande** :

| Partie | Signification |
| ------ | ------------- |
| `docker compose exec` | Exécute une commande dans un conteneur |
| `database` | Nom du service (défini dans docker-compose.yml) |
| `psql` | Client PostgreSQL |
| `-U symfony_user` | Utilisateur défini dans le `docker-compose.yml` du cursus Docker |
| `-d symfony_db` | Base de données `symfony_db` (définie par `POSTGRES_DB` dans le même fichier) |

**Résultat attendu** :

```text
psql (16.x)
Type "help" for help.

symfony_db=#
```

Tu es maintenant connecté. Le prompt `symfony_db=#` indique que tu es dans la base `symfony_db`. Avec l'image `postgres:16-alpine` du cursus Docker, `POSTGRES_USER` (`symfony_user`) est superutilisateur : le prompt se termine par `=#`. Un utilisateur non superutilisateur afficherait `=>`.

---

### Étape 3 : Lister les tables

Une fois connecté, tape :

```sql
\dt
```

**Résultat attendu** (exemple) :

```text
             List of relations
 Schema |         Name          | Type  | Owner
--------+-----------------------+-------+-------
 public | category              | table | symfony_user
 public | doctrine_migration_versions | table | symfony_user
 public | product               | table | symfony_user
 public | user                  | table | symfony_user
(4 rows)
```

**Explication** :

- `Schema` : Espace de noms (par défaut "public")
- `Name` : Nom de la table
- `Type` : Type d'objet (table, view, etc.)
- `Owner` : Propriétaire de la table

**Note** : La table `doctrine_migration_versions` est créée automatiquement par Doctrine pour suivre les migrations.

---

### Étape 4 : Examiner la structure d'une table

Pour voir les colonnes d'une table :

```sql
\d product
```

**Résultat attendu** :

```text
                                     Table "public.product"
   Column    |          Type          | Collation | Nullable |               Default
-------------+------------------------+-----------+----------+-------------------------------------
 id          | integer                |           | not null | nextval('product_id_seq'::regclass)
 name        | character varying(255) |           | not null |
 price       | numeric(10,2)          |           | not null |
 description | text                   |           |          |
 available   | boolean                |           | not null |
 category_id | integer                |           |          |
Indexes:
    "product_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "fk_d34a04ad12469de2" FOREIGN KEY (category_id) REFERENCES category(id)
```

**Lecture du résultat** :

| Colonne | Signification |
| ------- | ------------- |
| Column | Nom de la colonne |
| Type | Type de données SQL |
| Nullable | Peut être NULL (vide) |
| Default | Valeur par défaut |

**Types SQL courants** :

| Type SQL | Description | Type Doctrine |
| -------- | ----------- | ------------- |
| `integer` | Nombre entier | integer |
| `character varying(n)` | Texte de max n caractères | string |
| `text` | Texte sans limite | text |
| `numeric(p,s)` | Décimal avec p chiffres dont s décimales | decimal |
| `boolean` | Vrai/Faux | boolean |
| `timestamp` | Date et heure | datetime |

---

### Étape 5 : Compter les lignes d'une table

```sql
SELECT COUNT(*) FROM product;
```

**Résultat attendu** :

```text
 count
-------
    15
(1 row)
```

La table `product` contient 15 lignes.

---

### Étape 6 : Voir quelques données

```sql
SELECT * FROM product LIMIT 5;
```

**Explication** :

- `SELECT *` : Sélectionne toutes les colonnes
- `FROM product` : Depuis la table product
- `LIMIT 5` : Limite à 5 résultats

**Résultat attendu** :

```text
 id |       name       | price  |    description    | available | category_id
----+------------------+--------+-------------------+-----------+-------------
  1 | Clavier RGB      |  89.99 | Clavier mécanique |     t     |           1
  2 | Souris gaming    |  49.99 | Souris ergonomique|     t     |           1
  3 | Écran 27 pouces  | 299.99 | Écran 4K          |     f     |           2
  4 | Webcam HD        |  59.99 | 1080p             |     t     |           3
  5 | Casque audio     |  79.99 | Sans fil          |     t     |           3
(5 rows)
```

**Note** : `t` = true, `f` = false pour les booléens.

---

### Étape 7 : Voir les colonnes spécifiques

```sql
SELECT name, price FROM product;
```

**Résultat attendu** :

```text
       name       | price
------------------+--------
 Clavier RGB      |  89.99
 Souris gaming    |  49.99
 Écran 27 pouces  | 299.99
 ...
```

---

### Étape 8 : Quitter psql

```sql
\q
```

Tu reviens dans le terminal normal.

---

### Étape 9 : Exécuter une requête sans entrer dans psql

Tu peux exécuter une requête directement depuis le terminal :

```bash
docker compose exec database psql -U symfony_user -d symfony_db -c "SELECT COUNT(*) FROM product;"
```

**L'option `-c`** permet d'exécuter une commande SQL et de quitter immédiatement.

---

### Étape 10 : Requête via Symfony (alternative)

Tu peux aussi utiliser la commande Symfony :

```bash
php bin/console doctrine:query:sql "SELECT * FROM product LIMIT 5"
```

Cette commande utilise la connexion configurée dans `.env`.

---

## Commandes Utiles

### Commandes Docker pour PostgreSQL

| Commande | Action |
| -------- | ------ |
| `docker compose exec database psql -U symfony_user -d symfony_db` | Ouvrir psql |
| `docker compose exec database psql -U symfony_user -d symfony_db -c "SQL"` | Exécuter une requête |
| `docker compose logs database` | Voir les logs PostgreSQL |
| `docker compose restart database` | Redémarrer PostgreSQL |

### Commandes psql

| Commande | Action |
| -------- | ------ |
| `\l` | Lister les bases de données |
| `\c base` | Se connecter à une base |
| `\dt` | Lister les tables |
| `\d table` | Décrire une table |
| `\di` | Lister les index |
| `\df` | Lister les fonctions |
| `\du` | Lister les utilisateurs |
| `\q` | Quitter |
| `\?` | Aide |

### Commandes SQL de base

| Commande | Action |
| -------- | ------ |
| `SELECT * FROM table;` | Voir toutes les données |
| `SELECT col1, col2 FROM table;` | Voir certaines colonnes |
| `SELECT COUNT(*) FROM table;` | Compter les lignes |
| `SELECT * FROM table LIMIT n;` | Limiter les résultats |

---

## Pièges Fréquents

### Piège 1 : Oublier le point-virgule

**Problème** : La commande ne s'exécute pas, psql attend la suite.

**Cause** : En SQL, chaque commande doit se terminer par `;`.

```sql
-- ❌ Incomplet (psql attend la suite)
SELECT * FROM product

-- ✅ Correct
SELECT * FROM product;
```

**Si tu oublies** : Tape `;` sur la ligne suivante et appuie sur Entrée.

---

### Piège 2 : Erreur "relation does not exist"

**Problème** : Message "ERROR: relation 'xxx' does not exist".

**Causes possibles** :

1. La table n'existe pas (vérifie avec `\dt`)
2. Tu n'es pas dans la bonne base (vérifie avec `\c`)
3. Erreur de frappe dans le nom

**Solution** :

```sql
-- Vérifier les tables existantes
\dt

-- Vérifier la base actuelle
SELECT current_database();
```

---

### Piège 3 : Erreur de connexion

**Problème** : "connection refused" ou "could not connect".

**Causes possibles** :

1. Le conteneur n'est pas lancé
2. Mauvais identifiants

**Solution** :

```bash
# Vérifier que le conteneur est lancé
docker compose ps

# Vérifier les logs
docker compose logs database

# Redémarrer si nécessaire
docker compose restart database
```

---

### Piège 4 : Confondre commandes psql et SQL

**Problème** : Tu mélanges les commandes.

**Règle** :

- Commandes psql : commencent par `\` (pas de `;`)
- Commandes SQL : finissent par `;`

```sql
-- ❌ Incorrect
\dt;           -- Pas de ; pour les commandes \
SELECT * FROM product   -- Manque le ;

-- ✅ Correct
\dt
SELECT * FROM product;
```

---

## Checklist de Validation

- [ ] Je sais lancer le conteneur PostgreSQL avec Docker
- [ ] Je sais me connecter à PostgreSQL avec `docker compose exec database psql -U symfony_user -d symfony_db`
- [ ] Je sais lister les tables avec `\dt`
- [ ] Je sais examiner une table avec `\d nom_table`
- [ ] Je sais exécuter une requête SELECT simple
- [ ] Je sais quitter psql avec `\q`

---

## Exercice Pratique

**Énoncé** : Explore la base de données de ton projet.

**Étapes** :

1. Connecte-toi à PostgreSQL via Docker
2. Liste toutes les tables de la base
3. Choisis une table et affiche sa structure
4. Compte le nombre de lignes dans cette table
5. Affiche les 3 premières lignes
6. Quitte psql

**Questions à noter** :

- Combien de tables as-tu ?
- Quelle est la table avec le plus de colonnes ?
- Quelle est la table avec le plus de lignes ?

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Connexion**

```bash
docker compose exec database psql -U symfony_user -d symfony_db
```

**Étape 2 : Lister les tables**

```sql
\dt
```

Note le nombre de tables affichées.

**Étape 3 : Structure d'une table**

```sql
\d product
```

Compte le nombre de colonnes.

**Étape 4 : Compter les lignes**

```sql
SELECT COUNT(*) FROM product;
```

**Étape 5 : Afficher 3 lignes**

```sql
SELECT * FROM product LIMIT 3;
```

**Étape 6 : Quitter**

```sql
\q
```

**Pour comparer toutes les tables** :

```sql
-- Nombre de lignes par table
SELECT 'product' as table_name, COUNT(*) FROM product
UNION ALL
SELECT 'category', COUNT(*) FROM category
UNION ALL
SELECT 'user', COUNT(*) FROM "user";
```

**Note** : `user` est entre guillemets car c'est un mot réservé en SQL.

---

## Navigation

→ Fiche suivante : **[Requêtes SELECT](02-requetes-select.md)**
