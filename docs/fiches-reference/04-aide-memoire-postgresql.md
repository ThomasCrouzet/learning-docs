---
tags:
  - Référence
  - PostgreSQL
description: "Aide-mémoire PostgreSQL"
estimated_time: "5 min"
fiche_number: 4
total_fiches: 18
cursus: "Fiches de référence"
id: "references.quick-reference.aide-memoire-postgresql"
course_id: "references.quick-reference"
content_type: "reference"
order: 4
---

# Aide-mémoire PostgreSQL

> **En bref** : Aide-mémoire PostgreSQL. Lecture estimée : 5 min.

Fiche de référence rapide pour les commandes SQL et psql les plus courantes.

---

## Connexion psql

| Commande | Action |
| -------- | ------ |
| `psql -U user -d dbname` | Se connecter à une base |
| `psql -U user -d dbname -h localhost` | Se connecter via un hôte |
| `psql -U user -d dbname -p 5432` | Se connecter via un port |
| `\q` | Quitter psql |
| `\c dbname` | Changer de base de données |

---

## Commandes psql

| Commande | Action |
| -------- | ------ |
| `\l` | Lister toutes les bases de données |
| `\dt` | Lister les tables du schéma courant |
| `\dt+` | Lister les tables avec taille et description |
| `\d table` | Décrire la structure d'une table |
| `\d+ table` | Décrire avec détails (taille, stockage) |
| `\dn` | Lister les schémas |
| `\di` | Lister les index |
| `\du` | Lister les rôles (utilisateurs) |
| `\dv` | Lister les vues |
| `\x` | Activer/désactiver l'affichage étendu |
| `\i fichier.sql` | Exécuter un fichier SQL |

---

## SELECT

| Syntaxe | Action |
| ------- | ------ |
| `SELECT * FROM table` | Sélectionner toutes les colonnes |
| `SELECT col1, col2 FROM table` | Sélectionner des colonnes précises |
| `WHERE col = 'valeur'` | Filtrer les résultats |
| `WHERE col > 10 AND col < 50` | Conditions multiples |
| `WHERE col LIKE 'A%'` | Filtre avec motif (sensible à la casse) |
| `WHERE col ILIKE 'a%'` | Filtre avec motif (insensible à la casse) |
| `WHERE col BETWEEN 10 AND 50` | Valeur dans un intervalle |
| `WHERE col IN ('a', 'b', 'c')` | Valeur dans une liste |
| `ORDER BY col ASC` | Trier par ordre croissant |
| `ORDER BY col DESC` | Trier par ordre décroissant |
| `LIMIT 10` | Limiter à 10 résultats |
| `OFFSET 20` | Sauter les 20 premiers résultats |
| `SELECT DISTINCT col FROM table` | Supprimer les doublons |

---

## Agrégation

| Syntaxe | Action |
| ------- | ------ |
| `COUNT(*)` | Nombre total de lignes |
| `COUNT(col)` | Nombre de valeurs non NULL |
| `SUM(col)` | Somme des valeurs |
| `AVG(col)` | Moyenne des valeurs |
| `MIN(col)` | Valeur minimale |
| `MAX(col)` | Valeur maximale |
| `GROUP BY col` | Grouper les résultats par colonne |
| `HAVING COUNT(*) > 5` | Filtrer les groupes (après agrégation) |

---

## Jointures

| Syntaxe | Action |
| ------- | ------ |
| `INNER JOIN t2 ON t1.id = t2.t1_id` | Lignes correspondantes des deux tables |
| `LEFT JOIN t2 ON t1.id = t2.t1_id` | Toutes les lignes de t1 + correspondances de t2 |
| `RIGHT JOIN t2 ON t1.id = t2.t1_id` | Toutes les lignes de t2 + correspondances de t1 |
| `FULL JOIN t2 ON t1.id = t2.t1_id` | Toutes les lignes des deux tables |
| `CROSS JOIN t2` | Produit cartésien (chaque ligne avec chaque ligne) |

---

## Modification de données

| Syntaxe | Action |
| ------- | ------ |
| `INSERT INTO table (col1, col2) VALUES ('a', 'b')` | Insérer une ligne |
| `INSERT INTO table (col1) VALUES ('a'), ('b')` | Insérer plusieurs lignes |
| `UPDATE table SET col = 'valeur' WHERE id = 1` | Modifier une ligne |
| `DELETE FROM table WHERE id = 1` | Supprimer une ligne |
| `DELETE FROM table` | Supprimer toutes les lignes |
| `TRUNCATE table` | Vider la table (plus rapide que DELETE) |

---

## Sous-requêtes

| Syntaxe | Action |
| ------- | ------ |
| `WHERE col IN (SELECT col FROM t2)` | Filtrer avec une sous-requête |
| `WHERE EXISTS (SELECT 1 FROM t2 WHERE ...)` | Vrai si la sous-requête retourne des lignes |
| `SELECT (SELECT MAX(col) FROM t2) AS max_val` | Sous-requête scalaire (une seule valeur) |

---

## Tables et colonnes

| Syntaxe | Action |
| ------- | ------ |
| `CREATE TABLE t (id SERIAL PRIMARY KEY, nom VARCHAR(100))` | Créer une table |
| `ALTER TABLE t ADD COLUMN col VARCHAR(50)` | Ajouter une colonne |
| `ALTER TABLE t DROP COLUMN col` | Supprimer une colonne |
| `ALTER TABLE t RENAME COLUMN old TO new` | Renommer une colonne |
| `ALTER TABLE t RENAME TO new_name` | Renommer une table |
| `DROP TABLE t` | Supprimer une table |
| `DROP TABLE IF EXISTS t` | Supprimer si elle existe |

**Types courants** :

| Type | Description |
| ---- | ----------- |
| `INTEGER` | Entier (4 octets) |
| `BIGINT` | Entier long (8 octets) |
| `SERIAL` | Entier auto-incrémenté |
| `VARCHAR(n)` | Texte de longueur maximale n |
| `TEXT` | Texte sans limite de taille |
| `BOOLEAN` | Vrai ou faux |
| `DATE` | Date (AAAA-MM-JJ) |
| `TIMESTAMP` | Date et heure |
| `NUMERIC(p, s)` | Nombre décimal (précision, échelle) |

---

## Contraintes

| Syntaxe | Action |
| ------- | ------ |
| `col INTEGER PRIMARY KEY` | Clé primaire |
| `col INTEGER REFERENCES t2(id)` | Clé étrangère |
| `col VARCHAR(50) UNIQUE` | Valeur unique |
| `col VARCHAR(50) NOT NULL` | Interdit les valeurs NULL |
| `col INTEGER CHECK (col > 0)` | Condition de validation |
| `col INTEGER DEFAULT 0` | Valeur par défaut |

---

## Index

| Syntaxe | Action |
| ------- | ------ |
| `CREATE INDEX idx_nom ON table (col)` | Créer un index |
| `CREATE UNIQUE INDEX idx_nom ON table (col)` | Créer un index unique |
| `CREATE INDEX idx_nom ON table (col1, col2)` | Index multi-colonnes |
| `DROP INDEX idx_nom` | Supprimer un index |

---

## Vues

| Syntaxe | Action |
| ------- | ------ |
| `CREATE VIEW v AS SELECT ...` | Créer une vue |
| `CREATE OR REPLACE VIEW v AS SELECT ...` | Créer ou remplacer une vue |
| `DROP VIEW v` | Supprimer une vue |
| `DROP VIEW IF EXISTS v` | Supprimer si elle existe |

---

## Transactions

| Syntaxe | Action |
| ------- | ------ |
| `BEGIN` | Démarrer une transaction |
| `COMMIT` | Valider la transaction |
| `ROLLBACK` | Annuler la transaction |
| `SAVEPOINT nom` | Créer un point de sauvegarde |
| `ROLLBACK TO SAVEPOINT nom` | Revenir au point de sauvegarde |

---

## Fonctions utiles

| Fonction | Action |
| -------- | ------ |
| `NOW()` | Date et heure actuelles |
| `CURRENT_DATE` | Date actuelle |
| `CURRENT_TIMESTAMP` | Date et heure actuelles (alias de NOW) |
| `COALESCE(col, 'défaut')` | Première valeur non NULL |
| `NULLIF(a, b)` | NULL si a = b, sinon a |
| `CAST(col AS INTEGER)` | Convertir le type d'une valeur |
| `col::INTEGER` | Convertir le type (syntaxe PostgreSQL) |
| `UPPER('texte')` | Convertir en majuscules |
| `LOWER('TEXTE')` | Convertir en minuscules |
| `LENGTH('texte')` | Longueur d'une chaîne |
| `TRIM('  texte  ')` | Supprimer les espaces en début et fin |
| `EXTRACT(YEAR FROM col)` | Extraire une partie d'une date |
| `CONCAT(col1, ' ', col2)` | Concaténer des chaînes |

---

## Navigation

← Fiche précédente : **[Guide de Debug](03-guide-debug.md)**

→ Fiche suivante : **[Aide-mémoire Git](05-aide-memoire-git.md)**
