---
tags:
  - PostgreSQL
  - Débutant
  - Pratique
description: "Les fonctions d'agrégation"
estimated_time: "165 min"
fiche_number: 5
total_fiches: 8
cursus: "PostgreSQL"
---

# 05 - Les fonctions d'agrégation

> **En bref** : À la fin de cette fiche, tu sauras utiliser les fonctions d'agrégation (COUNT, SUM, AVG, MIN, MAX) avec GROUP BY et HAVING pour analyser tes données. Lecture estimée : 165 min.


## Prérequis

- Avoir lu la fiche **[01 - Introduction à PostgreSQL](01-introduction-postgresql.md)**
- Avoir lu la fiche **[02 - Requêtes SELECT](02-requetes-select.md)**
- Avoir lu la fiche **[03 - Les jointures](03-jointures.md)**
- Savoir écrire une requête SELECT avec WHERE et ORDER BY

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les fonctions d'agrégation (COUNT, SUM, AVG, MIN, MAX) avec GROUP BY et HAVING pour analyser tes données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une fonction d'agrégation ?

**Définition** : Une fonction d'agrégation est une fonction SQL qui prend un ensemble de lignes en entrée et retourne une seule valeur en sortie (un total, une moyenne, un comptage, etc.).

**Le problème que les fonctions d'agrégation résolvent** :

Sans fonctions d'agrégation, voici les problèmes rencontrés :

1. **Compter manuellement** : Pour savoir combien de produits existent, il faudrait lister tous les produits et les compter un par un.
2. **Calculer à la main** : Pour connaître le prix moyen, il faudrait additionner tous les prix et diviser par le nombre de produits soi-même.
3. **Chercher les extrêmes** : Pour trouver le produit le plus cher, il faudrait trier et regarder le premier résultat.

**Comment les fonctions d'agrégation résolvent ces problèmes** :

| Problème | Solution apportée par les fonctions d'agrégation |
| -------- | ------------------------------------------------- |
| Compter manuellement | `COUNT(*)` compte automatiquement les lignes |
| Calculer à la main | `SUM()`, `AVG()` font le calcul en une requête |
| Chercher les extrêmes | `MIN()`, `MAX()` trouvent directement la valeur |

**Analogie concrète** : Imagine un tableur Excel avec 1000 lignes de ventes. En bas du tableur, tu peux ajouter des formules : SOMME pour le total, MOYENNE pour la moyenne, NB pour compter les lignes. Les fonctions d'agrégation SQL fonctionnent exactement comme ces formules de tableur : elles résument toute une colonne en un seul chiffre.

**Ce qu'une fonction d'agrégation n'est PAS** :

- Une fonction d'agrégation n'est pas un filtre. Elle ne supprime pas de lignes, elle résume les données existantes en une seule valeur.
- Une fonction d'agrégation n'est pas une fonction qui s'applique ligne par ligne. Elle prend _toutes_ les lignes (ou un groupe de lignes) et retourne _un seul_ résultat.

---

### Les 5 fonctions d'agrégation principales

Voici les 5 fonctions d'agrégation que tu utiliseras le plus souvent :

| Fonction | Action | Exemple de résultat |
| -------- | ------ | ------------------- |
| `COUNT(*)` | Compte toutes les lignes | `42` |
| `COUNT(colonne)` | Compte les valeurs non NULL | `38` |
| `SUM(colonne)` | Additionne les valeurs | `1250.50` |
| `AVG(colonne)` | Calcule la moyenne | `29.77` |
| `MIN(colonne)` | Trouve la plus petite valeur | `5.99` |
| `MAX(colonne)` | Trouve la plus grande valeur | `199.99` |

**Différence entre COUNT(\*) et COUNT(colonne)** :

- `COUNT(*)` compte _toutes_ les lignes, y compris celles avec des valeurs NULL.
- `COUNT(colonne)` compte uniquement les lignes où cette colonne n'est pas NULL.

```sql
-- Table avec 10 lignes dont 3 ont description = NULL

SELECT COUNT(*) FROM product;            -- Résultat : 10
SELECT COUNT(description) FROM product;  -- Résultat : 7
```

---

### Qu'est-ce que GROUP BY ?

**Définition** : GROUP BY est une clause SQL qui regroupe les lignes ayant la même valeur dans une ou plusieurs colonnes, pour appliquer une fonction d'agrégation à chaque groupe séparément.

**Le problème que GROUP BY résout** :

Sans GROUP BY, les fonctions d'agrégation s'appliquent à _toute_ la table :

```sql
-- Sans GROUP BY : une seule valeur pour toute la table
SELECT COUNT(*) FROM product;
-- Résultat : 10
```

Avec GROUP BY, on obtient un résultat _par groupe_ :

```sql
-- Avec GROUP BY : une valeur par catégorie
SELECT category_id, COUNT(*) FROM product GROUP BY category_id;
-- Résultat : une ligne par catégorie
```

**Analogie concrète** : Imagine un professeur qui corrige des copies. Sans GROUP BY, il calcule la moyenne générale de toute la classe. Avec GROUP BY, il calcule la moyenne par groupe de TP : groupe A = 14/20, groupe B = 12/20, groupe C = 15/20.

**Règle importante** : Quand tu utilises GROUP BY, tu ne peux sélectionner que :

- Les colonnes listées dans GROUP BY
- Des fonctions d'agrégation

```sql
-- ❌ Incorrect : "name" n'est pas dans GROUP BY ni une agrégation
SELECT category_id, name, COUNT(*)
FROM product
GROUP BY category_id;

-- ✅ Correct : seulement category_id (dans GROUP BY) et COUNT (agrégation)
SELECT category_id, COUNT(*)
FROM product
GROUP BY category_id;
```

---

### Qu'est-ce que HAVING ?

**Définition** : HAVING est une clause SQL qui filtre les groupes _après_ l'agrégation. C'est le WHERE des groupes.

**Le problème que HAVING résout** :

WHERE filtre les lignes _avant_ le regroupement. Dans certains cas, on veut filtrer _après_ le calcul :

1. **Filtrer sur un total** : "Les catégories qui ont plus de 5 produits" → impossible avec WHERE car COUNT n'existe pas encore au moment du WHERE.
2. **Filtrer sur une moyenne** : "Les catégories dont le prix moyen dépasse 50€" → impossible avec WHERE pour la même raison.

**Comment HAVING résout ces problèmes** :

| Besoin | Clause à utiliser |
| ------ | ----------------- |
| Filtrer les lignes individuelles | `WHERE` (avant GROUP BY) |
| Filtrer les groupes après calcul | `HAVING` (après GROUP BY) |

**Analogie concrète** : Imagine que tu classes tes dépenses par mois (GROUP BY mois). Ensuite tu veux voir uniquement les mois où tu as dépensé plus de 500€. Tu ne peux pas décider ça avant d'avoir additionné toutes les dépenses du mois. HAVING intervient après le calcul pour filtrer les résultats.

**Ordre d'exécution complet d'une requête SQL** :

Le diagramme suivant illustre l'ordre dans lequel PostgreSQL traite une requête avec GROUP BY :

<div class="diagram-design">
<p><a href="../../diagrams/04-postgresql-05-fonctions-agrégation-1.html">Qu&#x27;est-ce que HAVING ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/04-postgresql-05-fonctions-agrégation-1.html" title="Qu&#x27;est-ce que HAVING ?" style="width:100%;min-height:700px;border:0;background:transparent"></iframe>
</div>

En détail :

```text
1. FROM       → Identifie la table
2. WHERE      → Filtre les lignes individuelles
3. GROUP BY   → Regroupe les lignes restantes
4. HAVING     → Filtre les groupes
5. SELECT     → Calcule les colonnes et agrégations
6. ORDER BY   → Trie les résultats
7. LIMIT      → Limite le nombre de résultats
```

---

### La fonction ROUND()

**Définition** : ROUND() arrondit un nombre décimal au nombre de décimales spécifié.

**Le problème que ROUND() résout** :

Les fonctions AVG() et SUM() retournent souvent des résultats avec beaucoup de décimales :

```text
-- Résultat sans ROUND :
 prix_moyen
-----------------
 46.6633333333333
```

Ce résultat est difficile à lire. ROUND() le formate proprement.

**Syntaxe** :

```sql
ROUND(valeur, nombre_de_décimales)
```

**Exemples** :

```sql
SELECT ROUND(46.6633, 2);   -- Résultat : 46.66
SELECT ROUND(46.6633, 0);   -- Résultat : 47
SELECT ROUND(46.6633, 1);   -- Résultat : 46.7
```

---

## Étapes Pratiques

### Données d'exemple

Pour toutes les étapes pratiques, on utilise ces 3 tables :

```text
Table: category
+----+------------------+
| id | name             |
+----+------------------+
|  1 | Informatique     |
|  2 | Audio            |
|  3 | Mobilier         |
+----+------------------+

Table: product
+----+------------------+--------+-------+-------------+
| id | name             | price  | stock | category_id |
+----+------------------+--------+-------+-------------+
|  1 | Clavier          |  49.99 |    25 |           1 |
|  2 | Souris           |  29.99 |    50 |           1 |
|  3 | Casque audio     |  79.99 |    15 |           2 |
|  4 | Webcam           |  59.99 |    30 |           1 |
|  5 | Écran 24 pouces  | 199.99 |    10 |           1 |
|  6 | Microphone       |  89.99 |     8 |           2 |
|  7 | Bureau ajustable | 349.99 |     5 |           3 |
|  8 | Chaise gaming    | 249.99 |     7 |           3 |
|  9 | Câble USB        |   9.99 |   100 |        NULL |
| 10 | Tapis de souris  |  14.99 |    60 |        NULL |
+----+------------------+--------+-------+-------------+

Table: order_item
+----+------------+----------+----------+
| id | product_id | quantity | order_id |
+----+------------+----------+----------+
|  1 |          1 |        2 |        1 |
|  2 |          2 |        3 |        1 |
|  3 |          3 |        1 |        2 |
|  4 |          1 |        1 |        3 |
|  5 |          5 |        1 |        3 |
|  6 |          2 |        2 |        4 |
|  7 |          7 |        1 |        5 |
|  8 |          4 |        4 |        6 |
|  9 |          1 |        1 |        7 |
| 10 |          6 |        2 |        7 |
+----+------------+----------+----------+
```

---

### Étape 1 : COUNT() - Compter les lignes

**Compter tous les produits** :

```sql
SELECT COUNT(*) AS total_produits
FROM product;
```

**Résultat attendu** :

```text
 total_produits
----------------
             10
```

**Compter les produits qui ont une catégorie** :

```sql
SELECT COUNT(category_id) AS produits_avec_categorie
FROM product;
```

**Résultat attendu** :

```text
 produits_avec_categorie
-------------------------
                       8
```

Les 2 produits sans catégorie (Câble USB et Tapis de souris) ne sont pas comptés.

**Compter avec une condition WHERE** :

```sql
-- Nombre de produits avec un stock supérieur à 20
SELECT COUNT(*) AS produits_stock_eleve
FROM product
WHERE stock > 20;
```

**Résultat attendu** :

```text
 produits_stock_eleve
----------------------
                    5
```

Les 5 produits concernés incluent Câble USB et Tapis de souris : `WHERE stock > 20` ne filtre pas sur `category_id`, contrairement au `COUNT(category_id)` vu plus haut.

**Compter les valeurs distinctes** :

```sql
-- Nombre de catégories différentes utilisées (sans les NULL)
SELECT COUNT(DISTINCT category_id) AS nb_categories
FROM product;
```

**Résultat attendu** :

```text
 nb_categories
---------------
             3
```

---

### Étape 2 : SUM() - Additionner des valeurs

**Valeur totale du stock** :

```sql
SELECT SUM(price * stock) AS valeur_stock_total
FROM product;
```

**Résultat attendu** :

```text
 valeur_stock_total
--------------------
           13866.90
```

**Somme du stock par catégorie** :

```sql
SELECT category_id, SUM(stock) AS stock_total
FROM product
WHERE category_id IS NOT NULL
GROUP BY category_id;
```

**Résultat attendu** :

```text
 category_id | stock_total
-------------+-------------
           1 |         115
           2 |          23
           3 |          12
```

---

### Étape 3 : AVG() - Calculer la moyenne

**Prix moyen de tous les produits** :

```sql
SELECT ROUND(AVG(price), 2) AS prix_moyen
FROM product;
```

**Résultat attendu** :

```text
 prix_moyen
------------
     113.49
```

**Prix moyen par catégorie** :

```sql
SELECT category_id, ROUND(AVG(price), 2) AS prix_moyen
FROM product
WHERE category_id IS NOT NULL
GROUP BY category_id
ORDER BY prix_moyen DESC;
```

**Résultat attendu** :

```text
 category_id | prix_moyen
-------------+------------
           3 |     299.99
           1 |      84.99
           2 |      84.99
```

---

### Étape 4 : MIN() et MAX() - Trouver les extrêmes

**Produit le moins cher et le plus cher** :

```sql
SELECT
    MIN(price) AS prix_minimum,
    MAX(price) AS prix_maximum
FROM product;
```

**Résultat attendu** :

```text
 prix_minimum | prix_maximum
--------------+--------------
         9.99 |       349.99
```

**Écart de prix par catégorie** :

```sql
SELECT
    category_id,
    MIN(price) AS prix_min,
    MAX(price) AS prix_max,
    MAX(price) - MIN(price) AS ecart_prix
FROM product
WHERE category_id IS NOT NULL
GROUP BY category_id
ORDER BY ecart_prix DESC;
```

**Résultat attendu** :

```text
 category_id | prix_min | prix_max | ecart_prix
-------------+----------+----------+------------
           1 |    29.99 |   199.99 |     170.00
           3 |   249.99 |   349.99 |     100.00
           2 |    79.99 |    89.99 |      10.00
```

---

### Étape 5 : GROUP BY - Regrouper les résultats

**Nombre de produits par catégorie** :

```sql
SELECT category_id, COUNT(*) AS nombre_produits
FROM product
GROUP BY category_id
ORDER BY nombre_produits DESC;
```

**Résultat attendu** :

```text
 category_id | nombre_produits
-------------+-----------------
           1 |               4
           2 |               2
           3 |               2
        NULL |               2
```

**Statistiques complètes par catégorie** :

```sql
SELECT
    category_id,
    COUNT(*) AS nombre,
    ROUND(AVG(price), 2) AS prix_moyen,
    SUM(stock) AS stock_total,
    MIN(price) AS prix_min,
    MAX(price) AS prix_max
FROM product
WHERE category_id IS NOT NULL
GROUP BY category_id
ORDER BY nombre DESC;
```

**Résultat attendu** :

```text
 category_id | nombre | prix_moyen | stock_total | prix_min | prix_max
-------------+--------+------------+-------------+----------+----------
           1 |      4 |      84.99 |         115 |    29.99 |   199.99
           2 |      2 |      84.99 |          23 |    79.99 |    89.99
           3 |      2 |     299.99 |          12 |   249.99 |   349.99
```

**GROUP BY sur plusieurs colonnes** :

```sql
-- Si tu avais une colonne "available", tu pourrais grouper par catégorie ET disponibilité
SELECT category_id, COUNT(*) AS nombre
FROM product
GROUP BY category_id
ORDER BY category_id;
```

---

### Étape 6 : HAVING - Filtrer les groupes

**Catégories avec plus de 2 produits** :

```sql
SELECT category_id, COUNT(*) AS nombre
FROM product
GROUP BY category_id
HAVING COUNT(*) > 2;
```

**Résultat attendu** :

```text
 category_id | nombre
-------------+--------
           1 |      4
```

**Catégories dont le prix moyen dépasse 100€** :

```sql
SELECT category_id, ROUND(AVG(price), 2) AS prix_moyen
FROM product
WHERE category_id IS NOT NULL
GROUP BY category_id
HAVING AVG(price) > 100
ORDER BY prix_moyen DESC;
```

**Résultat attendu** :

```text
 category_id | prix_moyen
-------------+------------
           3 |     299.99
```

**Combiner WHERE et HAVING** :

```sql
-- Catégories dont les produits en stock (stock > 0) ont un prix moyen > 50€
SELECT
    category_id,
    COUNT(*) AS nombre,
    ROUND(AVG(price), 2) AS prix_moyen
FROM product
WHERE stock > 0 AND category_id IS NOT NULL
GROUP BY category_id
HAVING AVG(price) > 50
ORDER BY prix_moyen DESC;
```

**Résultat attendu** :

```text
 category_id | nombre | prix_moyen
-------------+--------+------------
           3 |      2 |     299.99
           1 |      4 |      84.99
           2 |      2 |      84.99
```

**Explication de l'ordre d'exécution** :

1. `FROM product` → prend la table product
2. `WHERE stock > 0 AND category_id IS NOT NULL` → exclut les produits sans stock et sans catégorie
3. `GROUP BY category_id` → regroupe par catégorie
4. `HAVING AVG(price) > 50` → garde uniquement les groupes avec un prix moyen > 50
5. `SELECT ...` → calcule les colonnes
6. `ORDER BY prix_moyen DESC` → trie par prix moyen décroissant

---

### Étape 7 : Agrégation avec jointures

**Nombre de produits par nom de catégorie** :

```sql
SELECT c.name AS categorie, COUNT(p.id) AS nombre_produits
FROM category c
LEFT JOIN product p ON c.id = p.category_id
GROUP BY c.name
ORDER BY nombre_produits DESC;
```

**Résultat attendu** :

```text
   categorie   | nombre_produits
---------------+-----------------
 Informatique  |               4
 Audio         |               2
 Mobilier      |               2
```

On utilise LEFT JOIN pour afficher aussi les catégories qui n'ont aucun produit (elles auraient un comptage de 0).

**Statistiques complètes par catégorie avec le nom** :

```sql
SELECT
    c.name AS categorie,
    COUNT(p.id) AS nombre,
    ROUND(AVG(p.price), 2) AS prix_moyen,
    SUM(p.stock) AS stock_total
FROM category c
LEFT JOIN product p ON c.id = p.category_id
GROUP BY c.name
HAVING COUNT(p.id) > 0
ORDER BY nombre DESC;
```

**Résultat attendu** :

```text
   categorie   | nombre | prix_moyen | stock_total
---------------+--------+------------+-------------
 Informatique  |      4 |      84.99 |         115
 Audio         |      2 |      84.99 |          23
 Mobilier      |      2 |     299.99 |          12
```

**Top 3 des produits les plus commandés** :

```sql
SELECT
    p.name AS produit,
    SUM(oi.quantity) AS total_commande
FROM product p
INNER JOIN order_item oi ON p.id = oi.product_id
GROUP BY p.id, p.name
ORDER BY total_commande DESC
LIMIT 3;
```

**Résultat attendu** :

```text
  produit  | total_commande
-----------+----------------
 Souris    |              5
 Webcam    |              4
 Clavier   |              4
```

**Chiffre d'affaires par catégorie** :

```sql
SELECT
    c.name AS categorie,
    SUM(oi.quantity * p.price) AS chiffre_affaires,
    SUM(oi.quantity) AS total_articles_vendus
FROM category c
INNER JOIN product p ON c.id = p.category_id
INNER JOIN order_item oi ON p.id = oi.product_id
GROUP BY c.name
ORDER BY chiffre_affaires DESC;
```

**Résultat attendu** :

```text
   categorie   | chiffre_affaires | total_articles_vendus
---------------+------------------+-----------------------
 Informatique  |           789.86 |                    14
 Mobilier      |           349.99 |                     1
 Audio         |           259.97 |                     3
```

---

### Étape 8 : Combiner plusieurs agrégations

**Rapport complet sur les ventes** :

```sql
SELECT
    c.name AS categorie,
    COUNT(DISTINCT p.id) AS nb_produits,
    COUNT(DISTINCT oi.order_id) AS nb_commandes,
    SUM(oi.quantity) AS articles_vendus,
    ROUND(SUM(oi.quantity * p.price), 2) AS chiffre_affaires,
    ROUND(AVG(p.price), 2) AS prix_moyen_produit
FROM category c
INNER JOIN product p ON c.id = p.category_id
INNER JOIN order_item oi ON p.id = oi.product_id
GROUP BY c.name
ORDER BY chiffre_affaires DESC;
```

**Résultat attendu** :

```text
   categorie   | nb_produits | nb_commandes | articles_vendus | chiffre_affaires | prix_moyen_produit
---------------+-------------+--------------+-----------------+------------------+--------------------
 Informatique  |           4 |            5 |              14 |           789.86 |              67.13
 Mobilier      |           1 |            1 |               1 |           349.99 |             349.99
 Audio         |           2 |            2 |               3 |           259.97 |              84.99
```

**Note** : `COUNT(DISTINCT p.id)` compte les produits uniques (pas les doublons dus aux jointures). `COUNT(DISTINCT oi.order_id)` compte les commandes uniques.

**Attention** : seul `COUNT(DISTINCT ...)` est protégé contre les doublons de la jointure. La colonne `prix_moyen_produit` utilise `AVG(p.price)` : comme la jointure répète chaque produit autant de fois qu'il apparaît dans `order_item` (le Clavier compte 3 fois, la Souris 2 fois), la moyenne est biaisée.
Ici elle vaut `67.13` au lieu de `84.99` (la vraie moyenne des 4 produits distincts). `SUM` subit le même biais. Pour une moyenne correcte sur les produits distincts, calcule-la dans une requête séparée sur la table `product`.

---

### Étape 9 : Lien avec Doctrine QueryBuilder

Dans Symfony, tu utiliseras le QueryBuilder de Doctrine pour écrire ces requêtes. Voici la correspondance SQL → Doctrine :

**COUNT : compter les produits** :

SQL :

```sql
SELECT COUNT(*) FROM product;
```

Doctrine :

```php
// Dans ProductRepository
$count = $this->createQueryBuilder('p')
    ->select('COUNT(p.id)')  // COUNT sur une colonne, pas *
    ->getQuery()
    ->getSingleScalarResult();  // Retourne une seule valeur (le nombre)
```

**AVG : prix moyen par catégorie** :

SQL :

```sql
SELECT c.name, ROUND(AVG(p.price), 2)
FROM product p
INNER JOIN category c ON p.category_id = c.id
GROUP BY c.name;
```

Doctrine :

```php
// Dans ProductRepository
$results = $this->createQueryBuilder('p')
    ->select('c.name AS categorie', 'ROUND(AVG(p.price), 2) AS prix_moyen')
    ->innerJoin('p.category', 'c')    // Jointure via la relation Doctrine
    ->groupBy('c.name')
    ->getQuery()
    ->getResult();
```

**SUM avec HAVING** :

SQL :

```sql
SELECT category_id, SUM(stock)
FROM product
GROUP BY category_id
HAVING SUM(stock) > 20;
```

Doctrine :

```php
// Dans ProductRepository
$results = $this->createQueryBuilder('p')
    ->select('IDENTITY(p.category) AS category_id', 'SUM(p.stock) AS stock_total')
    ->groupBy('p.category')
    ->having('SUM(p.stock) > :minStock')  // HAVING avec paramètre
    ->setParameter('minStock', 20)
    ->getQuery()
    ->getResult();
```

**Correspondance SQL → Doctrine** :

| SQL | Doctrine QueryBuilder |
| --- | --------------------- |
| `SELECT COUNT(p.id)` | `->select('COUNT(p.id)')` |
| `SELECT SUM(p.price)` | `->select('SUM(p.price)')` |
| `SELECT AVG(p.price)` | `->select('AVG(p.price)')` |
| `SELECT MIN(p.price)` | `->select('MIN(p.price)')` |
| `SELECT MAX(p.price)` | `->select('MAX(p.price)')` |
| `GROUP BY category_id` | `->groupBy('p.category')` |
| `HAVING COUNT(*) > 5` | `->having('COUNT(p.id) > 5')` |
| `INNER JOIN` | `->innerJoin('p.category', 'c')` |
| `LEFT JOIN` | `->leftJoin('p.category', 'c')` |

---

## Commandes Utiles

| Requête | Action |
| ------- | ------ |
| `SELECT COUNT(*) FROM table` | Compter toutes les lignes |
| `SELECT COUNT(colonne) FROM table` | Compter les valeurs non NULL |
| `SELECT COUNT(DISTINCT colonne) FROM table` | Compter les valeurs uniques |
| `SELECT SUM(colonne) FROM table` | Additionner une colonne |
| `SELECT ROUND(AVG(colonne), 2) FROM table` | Moyenne arrondie à 2 décimales |
| `SELECT MIN(colonne), MAX(colonne) FROM table` | Valeurs extrêmes |
| `SELECT col, COUNT(*) FROM table GROUP BY col` | Compter par groupe |
| `SELECT col, COUNT(*) FROM table GROUP BY col HAVING COUNT(*) > n` | Filtrer les groupes |

---

## Pièges Fréquents

### Piège 1 : Colonne non agrégée dans le SELECT avec GROUP BY

**Problème** : Erreur "column must appear in the GROUP BY clause or be used in an aggregate function".

**Cause** : Tu sélectionnes une colonne qui n'est ni dans GROUP BY ni dans une fonction d'agrégation.

```sql
-- ❌ Erreur : "name" n'est pas dans GROUP BY
SELECT category_id, name, COUNT(*)
FROM product
GROUP BY category_id;

-- ✅ Solution 1 : ajouter name dans GROUP BY
SELECT category_id, name, COUNT(*)
FROM product
GROUP BY category_id, name;

-- ✅ Solution 2 : retirer name du SELECT
SELECT category_id, COUNT(*)
FROM product
GROUP BY category_id;
```

---

### Piège 2 : Utiliser WHERE au lieu de HAVING pour filtrer un agrégat

**Problème** : Erreur "aggregate functions are not allowed in WHERE".

**Cause** : WHERE s'exécute _avant_ GROUP BY, donc les fonctions d'agrégation n'existent pas encore.

```sql
-- ❌ Erreur : COUNT n'est pas utilisable dans WHERE
SELECT category_id, COUNT(*) AS nombre
FROM product
WHERE COUNT(*) > 2
GROUP BY category_id;

-- ✅ Correct : HAVING s'exécute après GROUP BY
SELECT category_id, COUNT(*) AS nombre
FROM product
GROUP BY category_id
HAVING COUNT(*) > 2;
```

---

### Piège 3 : Utiliser l'alias dans HAVING

**Problème** : En PostgreSQL, tu ne peux pas utiliser un alias défini dans SELECT à l'intérieur de HAVING.

```sql
-- ❌ Ne fonctionne pas dans PostgreSQL
SELECT category_id, COUNT(*) AS nombre
FROM product
GROUP BY category_id
HAVING nombre > 2;

-- ✅ Correct : répéter la fonction d'agrégation
SELECT category_id, COUNT(*) AS nombre
FROM product
GROUP BY category_id
HAVING COUNT(*) > 2;
```

**Note** : L'alias fonctionne dans ORDER BY mais pas dans HAVING.

---

### Piège 4 : COUNT(\*) vs COUNT(colonne) avec les NULL

**Problème** : Le résultat n'est pas celui attendu.

**Cause** : `COUNT(*)` et `COUNT(colonne)` ne comptent pas la même chose.

```sql
-- Table avec 10 produits dont 2 sans catégorie (category_id = NULL)

-- COUNT(*) compte TOUTES les lignes
SELECT COUNT(*) FROM product;             -- Résultat : 10

-- COUNT(category_id) ignore les NULL
SELECT COUNT(category_id) FROM product;   -- Résultat : 8
```

**Règle** :

- `COUNT(*)` → "combien de lignes au total ?"
- `COUNT(colonne)` → "combien de lignes ont une valeur dans cette colonne ?"

---

### Piège 5 : Oublier ROUND() avec AVG()

**Problème** : Le résultat a trop de décimales et n'est pas lisible.

```sql
-- ❌ Résultat illisible : 46.6633333333333
SELECT AVG(price) FROM product;

-- ✅ Résultat propre : 46.66
SELECT ROUND(AVG(price), 2) AS prix_moyen FROM product;
```

---

### Piège 6 : LEFT JOIN avec HAVING COUNT = 0

**Problème** : Tu veux les catégories sans produit mais HAVING élimine les résultats.

```sql
-- ❌ Ne retourne rien car HAVING filtre les groupes avec COUNT = 0
SELECT c.name, COUNT(p.id)
FROM category c
LEFT JOIN product p ON c.id = p.category_id
GROUP BY c.name
HAVING COUNT(p.id) = 0;

-- ✅ Correct : utiliser WHERE ... IS NULL (pas besoin de GROUP BY)
SELECT c.name
FROM category c
LEFT JOIN product p ON c.id = p.category_id
WHERE p.id IS NULL;
```

---

## Checklist de Validation

- [ ] Je sais utiliser COUNT(\*) pour compter toutes les lignes
- [ ] Je sais utiliser COUNT(colonne) pour compter les valeurs non NULL
- [ ] Je sais utiliser SUM() pour additionner des valeurs
- [ ] Je sais utiliser AVG() avec ROUND() pour calculer une moyenne lisible
- [ ] Je sais utiliser MIN() et MAX() pour trouver les extrêmes
- [ ] Je sais utiliser GROUP BY pour regrouper les résultats
- [ ] Je sais la différence entre WHERE (filtre les lignes) et HAVING (filtre les groupes)
- [ ] Je sais combiner des fonctions d'agrégation avec des jointures
- [ ] Je sais écrire l'équivalent Doctrine QueryBuilder d'une requête d'agrégation

---

## Exercice Pratique

**Énoncé** : Écris les requêtes SQL d'agrégation suivantes.

**Contexte** :

- Table `product` (id, name, price, stock, category_id)
- Table `category` (id, name)
- Table `order_item` (id, product_id, quantity, order_id)

**Requêtes à écrire** :

1. Le nombre total de produits dans la base
2. Le prix moyen de tous les produits (arrondi à 2 décimales)
3. Le produit le moins cher et le plus cher (prix uniquement)
4. Le nombre de produits par catégorie, avec le nom de la catégorie (pas l'id), trié par nombre décroissant
5. Les catégories qui ont strictement plus de 2 produits
6. Le chiffre d'affaires total par catégorie (prix × quantité commandée), trié du plus élevé au plus bas
7. Les produits qui ont été commandés plus de 3 fois au total (somme des quantités)

**Indications** :

- Pour les requêtes 4, 5 et 6 : utilise une jointure pour afficher le nom de la catégorie
- Pour la requête 6 : tu as besoin de joindre 3 tables (category, product, order_item)
- Pour la requête 7 : GROUP BY sur le produit, HAVING sur la somme des quantités

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Nombre total de produits** :

```sql
SELECT COUNT(*) AS total_produits
FROM product;
```

**Résultat** :

```text
 total_produits
----------------
             10
```

---

**2. Prix moyen arrondi** :

```sql
SELECT ROUND(AVG(price), 2) AS prix_moyen
FROM product;
```

**Résultat** :

```text
 prix_moyen
------------
     113.49
```

---

**3. Prix minimum et maximum** :

```sql
SELECT
    MIN(price) AS prix_minimum,
    MAX(price) AS prix_maximum
FROM product;
```

**Résultat** :

```text
 prix_minimum | prix_maximum
--------------+--------------
         9.99 |       349.99
```

---

**4. Nombre de produits par catégorie (avec nom)** :

```sql
SELECT c.name AS categorie, COUNT(p.id) AS nombre_produits
FROM category c
LEFT JOIN product p ON c.id = p.category_id
GROUP BY c.name
ORDER BY nombre_produits DESC;
```

**Résultat** :

```text
   categorie   | nombre_produits
---------------+-----------------
 Informatique  |               4
 Audio         |               2
 Mobilier      |               2
```

---

**5. Catégories avec plus de 2 produits** :

```sql
SELECT c.name AS categorie, COUNT(p.id) AS nombre_produits
FROM category c
INNER JOIN product p ON c.id = p.category_id
GROUP BY c.name
HAVING COUNT(p.id) > 2;
```

**Résultat** :

```text
   categorie   | nombre_produits
---------------+-----------------
 Informatique  |               4
```

---

**6. Chiffre d'affaires par catégorie** :

```sql
SELECT
    c.name AS categorie,
    ROUND(SUM(oi.quantity * p.price), 2) AS chiffre_affaires
FROM category c
INNER JOIN product p ON c.id = p.category_id
INNER JOIN order_item oi ON p.id = oi.product_id
GROUP BY c.name
ORDER BY chiffre_affaires DESC;
```

**Résultat** :

```text
   categorie   | chiffre_affaires
---------------+------------------
 Informatique  |           789.86
 Mobilier      |           349.99
 Audio         |           259.97
```

---

**7. Produits commandés plus de 3 fois** :

```sql
SELECT
    p.name AS produit,
    SUM(oi.quantity) AS total_commande
FROM product p
INNER JOIN order_item oi ON p.id = oi.product_id
GROUP BY p.id, p.name
HAVING SUM(oi.quantity) > 3
ORDER BY total_commande DESC;
```

**Résultat** :

```text
  produit  | total_commande
-----------+----------------
 Souris    |              5
 Webcam    |              4
 Clavier   |              4
```

---

## Navigation

← Fiche précédente : **[INSERT, UPDATE et DELETE](04-insert-update-delete.md)**

→ Fiche suivante : **[Les contraintes et les index](06-contraintes-index.md)**
