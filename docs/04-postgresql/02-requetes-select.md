---
tags:
  - PostgreSQL
  - Débutant
  - Pratique
description: "Requêtes SELECT"
estimated_time: "95 min"
fiche_number: 2
total_fiches: 8
cursus: "PostgreSQL"
---

# 02 - Requêtes SELECT

> **En bref** : À la fin de cette fiche, tu sauras écrire des requêtes SELECT pour rechercher, filtrer et trier les données dans une base de données. Lecture estimée : 95 min.


## Prérequis

- Avoir lu la fiche **[01 - Introduction à PostgreSQL](01-introduction-postgresql.md)**
- Savoir se connecter à PostgreSQL via Docker
- Comprendre les conditions PHP (fiche **[02-php/04 - Les conditions](../02-php/04-conditions.md)**)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des requêtes SELECT pour rechercher, filtrer et trier les données dans une base de données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### La structure d'une requête SELECT

**Définition** : La requête SELECT permet de lire des données dans une ou plusieurs tables.

**Structure complète** :

```sql
SELECT colonnes           -- Quoi récupérer
FROM table                -- Où chercher
WHERE conditions          -- Filtrer les lignes
ORDER BY colonne          -- Trier les résultats
LIMIT nombre              -- Limiter le nombre de résultats
OFFSET nombre;            -- Sauter des résultats (pagination)
```

**Ordre d'exécution** (différent de l'ordre d'écriture) :

```text
1. FROM    → Identifie la table
2. WHERE   → Filtre les lignes
3. SELECT  → Choisit les colonnes
4. ORDER BY → Trie les résultats
5. LIMIT/OFFSET → Limite le nombre
```

Le schéma suivant illustre l'ordre réel dans lequel PostgreSQL exécute les clauses d'un SELECT :

<div class="diagram-design">
<p><a href="../../diagrams/04-postgresql-02-requêtes-select-1.html">La structure d&#x27;une requête SELECT (HTML + SVG)</a></p>
<iframe src="../../diagrams/04-postgresql-02-requêtes-select-1.html" title="La structure d&#x27;une requête SELECT" style="width:100%;min-height:784px;border:0;background:transparent"></iframe>
</div>

**Analogie concrète** : Imagine une bibliothèque. SELECT est comme dire au bibliothécaire :

- "Je cherche **des livres** (SELECT)
- **dans le rayon science-fiction** (FROM)
- **publiés après 2020** (WHERE)
- **triés par auteur** (ORDER BY)
- **donne-moi les 10 premiers**" (LIMIT)

---

### Les opérateurs de comparaison

Pour filtrer les données avec WHERE, on utilise des opérateurs :

**Opérateurs de base** :

| Opérateur | Signification | Exemple |
| --------- | ------------- | ------- |
| `=` | Égal à | `price = 10` |
| `<>` ou `!=` | Différent de | `status <> 'draft'` |
| `>` | Supérieur à | `price > 50` |
| `<` | Inférieur à | `price < 100` |
| `>=` | Supérieur ou égal | `quantity >= 1` |
| `<=` | Inférieur ou égal | `quantity <= 10` |

**Opérateurs spéciaux** :

| Opérateur | Signification | Exemple |
| --------- | ------------- | ------- |
| `BETWEEN x AND y` | Entre x et y (inclus) | `price BETWEEN 10 AND 50` |
| `IN (a, b, c)` | Dans la liste | `status IN ('draft', 'published')` |
| `LIKE 'pattern'` | Correspond au motif | `name LIKE 'Clavier%'` |
| `ILIKE 'pattern'` | LIKE insensible à la casse | `name ILIKE '%gaming%'` |
| `IS NULL` | Est vide | `description IS NULL` |
| `IS NOT NULL` | N'est pas vide | `description IS NOT NULL` |

**Caractères spéciaux pour LIKE** :

| Caractère | Signification | Exemple |
| --------- | ------------- | ------- |
| `%` | N'importe quels caractères | `'%gaming%'` → contient "gaming" |
| `_` | Un seul caractère | `'_a%'` → 2ème lettre est "a" |

---

### Les opérateurs logiques

Pour combiner plusieurs conditions :

| Opérateur | Signification | Exemple |
| --------- | ------------- | ------- |
| `AND` | ET (les deux vraies) | `price > 10 AND available = true` |
| `OR` | OU (au moins une vraie) | `status = 'draft' OR status = 'review'` |
| `NOT` | Négation | `NOT available` |

**Priorité** : `NOT` > `AND` > `OR`

**Utilise des parenthèses pour être explicite** :

```sql
-- Ambigu : AND est prioritaire sur OR
WHERE a = 1 OR b = 2 AND c = 3

-- Clair : avec parenthèses
WHERE a = 1 OR (b = 2 AND c = 3)
WHERE (a = 1 OR b = 2) AND c = 3
```

---

### Les fonctions d'agrégation

Les fonctions d'agrégation calculent une valeur à partir de plusieurs lignes :

| Fonction | Action | Exemple |
| -------- | ------ | ------- |
| `COUNT(*)` | Compte les lignes | `SELECT COUNT(*) FROM product` |
| `COUNT(colonne)` | Compte les valeurs non NULL | `SELECT COUNT(description) FROM product` |
| `SUM(colonne)` | Somme des valeurs | `SELECT SUM(price) FROM product` |
| `AVG(colonne)` | Moyenne | `SELECT AVG(price) FROM product` |
| `MIN(colonne)` | Valeur minimum | `SELECT MIN(price) FROM product` |
| `MAX(colonne)` | Valeur maximum | `SELECT MAX(price) FROM product` |

---

### GROUP BY : regrouper les résultats

**Définition** : GROUP BY regroupe les lignes qui ont la même valeur dans une colonne et permet d'appliquer des fonctions d'agrégation à chaque groupe.

**Exemple concret** :

```sql
-- Nombre de produits par catégorie
SELECT category_id, COUNT(*) as nombre
FROM product
GROUP BY category_id;
```

**Résultat** :

```text
 category_id | nombre
-------------+--------
           1 |      5
           2 |      3
           3 |      7
```

**Règle importante** : Avec GROUP BY, tu ne peux sélectionner que :

- Les colonnes dans GROUP BY
- Des fonctions d'agrégation

```sql
-- ❌ Incorrect : "name" n'est pas dans GROUP BY
SELECT category_id, name, COUNT(*)
FROM product
GROUP BY category_id;

-- ✅ Correct
SELECT category_id, COUNT(*)
FROM product
GROUP BY category_id;
```

---

### HAVING : filtrer les groupes

**Définition** : HAVING filtre les groupes après agrégation (comme WHERE mais pour les groupes).

**Différence WHERE vs HAVING** :

| Clause | Quand elle filtre | Sur quoi |
| ------ | ----------------- | -------- |
| `WHERE` | Avant GROUP BY | Les lignes individuelles |
| `HAVING` | Après GROUP BY | Les groupes agrégés |

**Exemple** :

```sql
-- Catégories avec plus de 5 produits
SELECT category_id, COUNT(*) as nombre
FROM product
GROUP BY category_id
HAVING COUNT(*) > 5;
```

---

## Étapes Pratiques

### Étape 1 : Connexion à PostgreSQL

```bash
docker compose exec database psql -U symfony_user -d symfony_db
```

Pour les exemples suivants, on suppose une table `product` avec les colonnes :

- `id` (integer)
- `name` (varchar)
- `price` (decimal)
- `description` (text)
- `available` (boolean)
- `category_id` (integer)
- `created_at` (timestamp)

---

### Étape 2 : SELECT de base

**Toutes les colonnes** :

```sql
SELECT * FROM product;
```

**Colonnes spécifiques** :

```sql
SELECT name, price FROM product;
```

**Avec alias (renommer la colonne dans le résultat)** :

```sql
SELECT name AS nom_produit, price AS prix FROM product;
```

---

### Étape 3 : Filtrer avec WHERE

**Égalité** :

```sql
-- Produits disponibles
SELECT * FROM product WHERE available = true;

-- Produit avec un ID précis
SELECT * FROM product WHERE id = 5;
```

**Comparaison numérique** :

```sql
-- Produits à plus de 50€
SELECT * FROM product WHERE price > 50;

-- Produits entre 20€ et 100€
SELECT * FROM product WHERE price BETWEEN 20 AND 100;
```

**Recherche textuelle** :

```sql
-- Nom exact
SELECT * FROM product WHERE name = 'Clavier RGB';

-- Nom qui commence par "Clavier"
SELECT * FROM product WHERE name LIKE 'Clavier%';

-- Nom qui contient "gaming" (insensible à la casse)
SELECT * FROM product WHERE name ILIKE '%gaming%';
```

**Valeurs NULL** :

```sql
-- Produits sans description
SELECT * FROM product WHERE description IS NULL;

-- Produits avec description
SELECT * FROM product WHERE description IS NOT NULL;
```

---

### Étape 4 : Combiner les conditions

**Avec AND** :

```sql
-- Produits disponibles à moins de 50€
SELECT * FROM product
WHERE available = true AND price < 50;
```

**Avec OR** :

```sql
-- Produits de catégorie 1 ou 2
SELECT * FROM product
WHERE category_id = 1 OR category_id = 2;

-- Équivalent avec IN
SELECT * FROM product
WHERE category_id IN (1, 2);
```

**Combinaison complexe** :

```sql
-- Produits disponibles à moins de 50€ OU produits de catégorie 1
SELECT * FROM product
WHERE (available = true AND price < 50) OR category_id = 1;
```

---

### Étape 5 : Trier avec ORDER BY

**Tri croissant (par défaut)** :

```sql
SELECT * FROM product ORDER BY price;
-- Équivalent à :
SELECT * FROM product ORDER BY price ASC;
```

**Tri décroissant** :

```sql
SELECT * FROM product ORDER BY price DESC;
```

**Tri sur plusieurs colonnes** :

```sql
-- D'abord par catégorie, puis par prix décroissant
SELECT * FROM product
ORDER BY category_id ASC, price DESC;
```

**Trier par une colonne non sélectionnée** :

```sql
SELECT name, price FROM product ORDER BY created_at DESC;
```

---

### Étape 6 : Limiter les résultats

**LIMIT** :

```sql
-- Les 10 premiers produits
SELECT * FROM product LIMIT 10;
```

**LIMIT avec OFFSET (pagination)** :

```sql
-- Page 1 : produits 1 à 10
SELECT * FROM product ORDER BY id LIMIT 10 OFFSET 0;

-- Page 2 : produits 11 à 20
SELECT * FROM product ORDER BY id LIMIT 10 OFFSET 10;

-- Page 3 : produits 21 à 30
SELECT * FROM product ORDER BY id LIMIT 10 OFFSET 20;
```

**Formule** : `OFFSET = (numéro_page - 1) * LIMIT`

---

### Étape 7 : Fonctions d'agrégation

**Compter** :

```sql
-- Nombre total de produits
SELECT COUNT(*) FROM product;

-- Nombre de produits disponibles
SELECT COUNT(*) FROM product WHERE available = true;
```

**Calculer** :

```sql
-- Prix moyen
SELECT AVG(price) FROM product;

-- Prix min et max
SELECT MIN(price), MAX(price) FROM product;

-- Somme des prix (inventaire total)
SELECT SUM(price) FROM product;
```

**Arrondir les résultats** :

```sql
-- Prix moyen arrondi à 2 décimales
SELECT ROUND(AVG(price), 2) as prix_moyen FROM product;
```

---

### Étape 8 : Grouper avec GROUP BY

**Compter par catégorie** :

```sql
SELECT category_id, COUNT(*) as nombre_produits
FROM product
GROUP BY category_id;
```

**Prix moyen par catégorie** :

```sql
SELECT category_id, ROUND(AVG(price), 2) as prix_moyen
FROM product
GROUP BY category_id
ORDER BY prix_moyen DESC;
```

**Avec HAVING** :

```sql
-- Catégories avec plus de 3 produits
SELECT category_id, COUNT(*) as nombre
FROM product
GROUP BY category_id
HAVING COUNT(*) > 3;
```

---

### Étape 9 : Requêtes combinées

**Exemple complet** :

```sql
-- Top 5 des catégories avec le plus de produits disponibles,
-- ayant un prix moyen supérieur à 30€
SELECT
    category_id,
    COUNT(*) as nombre_produits,
    ROUND(AVG(price), 2) as prix_moyen
FROM product
WHERE available = true
GROUP BY category_id
HAVING AVG(price) > 30
ORDER BY nombre_produits DESC
LIMIT 5;
```

**Ordre d'exécution de cette requête** :

1. `FROM product` → Prend la table product
2. `WHERE available = true` → Filtre les produits disponibles
3. `GROUP BY category_id` → Regroupe par catégorie
4. `HAVING AVG(price) > 30` → Garde les groupes avec prix moyen > 30
5. `SELECT ...` → Calcule les colonnes demandées
6. `ORDER BY nombre_produits DESC` → Trie par nombre décroissant
7. `LIMIT 5` → Garde les 5 premiers

---

## Commandes Utiles

| Requête | Action |
| ------- | ------ |
| `SELECT * FROM table;` | Tout afficher |
| `SELECT col FROM table WHERE condition;` | Filtrer |
| `SELECT * FROM table ORDER BY col DESC;` | Trier |
| `SELECT * FROM table LIMIT n OFFSET m;` | Paginer |
| `SELECT COUNT(*) FROM table;` | Compter |
| `SELECT col, COUNT(*) FROM table GROUP BY col;` | Regrouper |

---

## Pièges Fréquents

### Piège 1 : Oublier les guillemets pour les chaînes

**Problème** : Erreur de syntaxe.

```sql
-- ❌ Incorrect (gaming n'est pas entre guillemets)
SELECT * FROM product WHERE name = gaming;

-- ✅ Correct (guillemets simples pour les chaînes)
SELECT * FROM product WHERE name = 'gaming';
```

**Règle** : Les chaînes de caractères sont entre guillemets simples `'`.

---

### Piège 2 : Confondre = et LIKE

**Problème** : La recherche ne trouve rien.

```sql
-- ❌ Ne trouve que les noms exactement égaux à "Clavier"
SELECT * FROM product WHERE name = 'Clavier';

-- ✅ Trouve les noms qui contiennent "Clavier"
SELECT * FROM product WHERE name LIKE '%Clavier%';
```

---

### Piège 3 : NULL et les comparaisons

**Problème** : Les valeurs NULL ne sont jamais égales à rien.

```sql
-- ❌ Ne fonctionne pas pour trouver les NULL
SELECT * FROM product WHERE description = NULL;

-- ✅ Correct
SELECT * FROM product WHERE description IS NULL;
```

**Règle** : Pour NULL, utilise `IS NULL` ou `IS NOT NULL`.

---

### Piège 4 : GROUP BY et colonnes non agrégées

**Problème** : Erreur "column must appear in GROUP BY clause".

```sql
-- ❌ Erreur : name n'est pas dans GROUP BY
SELECT category_id, name, COUNT(*)
FROM product
GROUP BY category_id;

-- ✅ Correct : seulement les colonnes GROUP BY + agrégats
SELECT category_id, COUNT(*)
FROM product
GROUP BY category_id;
```

---

### Piège 5 : HAVING sans GROUP BY

**Problème** : HAVING n'a de sens qu'avec GROUP BY.

```sql
-- ❌ HAVING sans GROUP BY (utilise WHERE à la place)
SELECT * FROM product HAVING price > 50;

-- ✅ Correct
SELECT * FROM product WHERE price > 50;
```

---

## Checklist de Validation

- [ ] Je sais écrire un SELECT avec des colonnes spécifiques
- [ ] Je sais filtrer avec WHERE et les opérateurs (=, >, <, LIKE, IN, BETWEEN)
- [ ] Je sais combiner des conditions avec AND et OR
- [ ] Je sais trier avec ORDER BY (ASC, DESC)
- [ ] Je sais paginer avec LIMIT et OFFSET
- [ ] Je sais utiliser COUNT, SUM, AVG, MIN, MAX
- [ ] Je sais regrouper avec GROUP BY et filtrer avec HAVING

---

## Exercice Pratique

**Énoncé** : Écris les requêtes SQL suivantes.

**Contexte** : Table `product` avec colonnes `id`, `name`, `price`, `available`, `category_id`, `created_at`.

**Requêtes à écrire** :

1. Tous les produits triés par prix croissant
2. Les 5 produits les plus chers
3. Les produits dont le nom contient "USB"
4. Les produits disponibles entre 20€ et 100€
5. Le nombre de produits par catégorie, triés par nombre décroissant
6. Les catégories ayant plus de 2 produits disponibles
7. Le prix moyen des produits disponibles, arrondi à 2 décimales

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Tous les produits triés par prix croissant** :

```sql
SELECT * FROM product ORDER BY price ASC;
```

**2. Les 5 produits les plus chers** :

```sql
SELECT * FROM product ORDER BY price DESC LIMIT 5;
```

**3. Les produits dont le nom contient "USB"** :

```sql
SELECT * FROM product WHERE name ILIKE '%USB%';
```

**4. Les produits disponibles entre 20€ et 100€** :

```sql
SELECT * FROM product
WHERE available = true AND price BETWEEN 20 AND 100;
```

**5. Nombre de produits par catégorie, triés par nombre décroissant** :

```sql
SELECT category_id, COUNT(*) as nombre
FROM product
GROUP BY category_id
ORDER BY nombre DESC;
```

**6. Catégories ayant plus de 2 produits disponibles** :

```sql
SELECT category_id, COUNT(*) as nombre
FROM product
WHERE available = true
GROUP BY category_id
HAVING COUNT(*) > 2;
```

**7. Prix moyen des produits disponibles, arrondi** :

```sql
SELECT ROUND(AVG(price), 2) as prix_moyen
FROM product
WHERE available = true;
```

---

## Navigation

← Fiche précédente : **[Introduction à PostgreSQL](01-introduction-postgresql.md)**

→ Fiche suivante : **[Les jointures](03-jointures.md)**
