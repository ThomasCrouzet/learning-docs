---
tags:
  - PostgreSQL
  - Intermédiaire
  - Pratique
description: "Les transactions"
estimated_time: "110 min"
fiche_number: 8
total_fiches: 8
cursus: "PostgreSQL"
id: "web.postgresql.transactions"
course_id: "web.postgresql"
content_type: "lesson"
order: 8
---

# 08 - Les transactions

> **En bref** : À la fin de cette fiche, tu sauras utiliser les transactions (BEGIN, COMMIT, ROLLBACK, SAVEPOINT) pour garantir la cohérence de tes données lors d'opérations multiples, et tu comprendras comment Doctrine gère les transactions dans Symfony. Lecture estimée : 110 min.


## Prérequis

- Avoir lu la fiche **[04 - INSERT, UPDATE, DELETE](04-insert-update-delete.md)**
- Savoir insérer, modifier et supprimer des données dans PostgreSQL

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les transactions (BEGIN, COMMIT, ROLLBACK, SAVEPOINT) pour garantir la cohérence de tes données lors d'opérations multiples, et tu comprendras comment Doctrine gère les transactions dans Symfony.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une transaction ?

**Définition** : Une transaction est un ensemble d'opérations SQL (INSERT, UPDATE, DELETE) qui forment un tout indivisible. Soit toutes les opérations réussissent et sont enregistrées, soit aucune n'est enregistrée. Il n'y a pas d'état intermédiaire.

**Le problème que les transactions résolvent** :

Sans transactions, voici les problèmes rencontrés :

1. **Opération incomplète** : Un virement bancaire débite le compte A mais plante avant de créditer le compte B. L'argent disparaît.
2. **Données incohérentes** : Tu crées une commande et ses lignes de commande. Si l'insertion d'une ligne échoue, la commande existe mais est incomplète.
3. **Lectures contradictoires** : Pendant qu'un processus modifie des données, un autre processus lit un état intermédiaire.

**Comment les transactions résolvent ces problèmes** :

| Problème | Solution apportée par les transactions |
| -------- | -------------------------------------- |
| Opération incomplète | Si une opération échoue, toutes les autres sont annulées |
| Données incohérentes | Les données passent d'un état valide à un autre, jamais d'état intermédiaire |
| Lectures contradictoires | Les autres utilisateurs ne voient pas les modifications tant que la transaction n'est pas terminée |

**Analogie concrète** : Imagine un virement bancaire au guichet. Le guichetier note sur un brouillon : "retirer 100 euros du compte A" et "ajouter 100 euros au compte B". Il vérifie que tout est correct, puis il applique les deux opérations en même temps. Si un problème survient (compte A bloqué, erreur de numéro), il jette le brouillon et rien ne change. C'est le principe d'une transaction : on prépare tout, puis on valide tout d'un coup, ou on annule tout.

**Ce qu'une transaction n'est PAS** :

- Une transaction n'est pas un outil de sauvegarde. Elle ne protège pas contre la perte de données en cas de crash disque. Pour cela, il faut des sauvegardes (backups).
- Une transaction n'est pas un verrou permanent. Elle ne bloque pas indéfiniment les autres utilisateurs. Elle garantit la cohérence pendant la durée de l'opération.

---

### Les propriétés ACID

**Définition** : ACID est un acronyme qui décrit les quatre propriétés qu'une transaction doit respecter pour garantir la fiabilité des données.

| Propriété | Signification | Explication |
| --------- | ------------- | ----------- |
| **A** - Atomicité | Tout ou rien | Soit toutes les opérations réussissent, soit aucune n'est appliquée |
| **C** - Cohérence | État valide à état valide | Les contraintes (NOT NULL, FOREIGN KEY, CHECK) sont respectées avant et après |
| **I** - Isolation | Transactions indépendantes | Les transactions en cours ne voient pas les modifications des autres transactions non terminées |
| **D** - Durabilité | Permanent après COMMIT | Une fois validée, les données sont enregistrées définitivement, même en cas de panne |

**Exemple concret pour chaque propriété** :

```text
Virement de 100€ du compte A (500€) vers le compte B (300€) :

Atomicité : Si le crédit échoue → le débit est annulé. Le compte A garde 500€.
Cohérence : Avant = 800€ total. Après = 800€ total. Le total est préservé.
Isolation  : Pendant le virement, les autres voient encore A=500€, B=300€.
Durabilité : Après COMMIT, même si le serveur redémarre, A=400€ et B=400€.
```

---

### BEGIN, COMMIT et ROLLBACK

**Définition** : Ce sont les trois commandes qui contrôlent une transaction.

| Commande | Action |
| -------- | ------ |
| `BEGIN` | Démarre une transaction |
| `COMMIT` | Valide et enregistre toutes les modifications |
| `ROLLBACK` | Annule toutes les modifications depuis BEGIN |

**Syntaxe** :

```sql
-- Démarrer une transaction
BEGIN;

-- Opérations SQL...
UPDATE comptes SET solde = solde - 100 WHERE id = 1;
UPDATE comptes SET solde = solde + 100 WHERE id = 2;

-- Valider (enregistrer)
COMMIT;
```

```sql
-- Démarrer une transaction
BEGIN;

-- Opérations SQL...
UPDATE comptes SET solde = solde - 100 WHERE id = 1;

-- Quelque chose ne va pas → annuler tout
ROLLBACK;
-- Le solde du compte 1 revient à sa valeur initiale
```

**Règle** : Entre BEGIN et COMMIT, les modifications ne sont visibles que par la session qui a ouvert la transaction. Les autres sessions voient les anciennes valeurs.

Le schéma suivant illustre le cycle de vie d'une transaction :

<div class="diagram-design">
<p><a href="../../diagrams/04-postgresql-08-transactions-1.html">BEGIN, COMMIT et ROLLBACK (HTML + SVG)</a></p>
<iframe src="../../diagrams/04-postgresql-08-transactions-1.html" title="BEGIN, COMMIT et ROLLBACK" style="width:100%;min-height:596px;border:0;background:transparent"></iframe>
</div>

---

### SAVEPOINT (points de sauvegarde)

**Définition** : Un SAVEPOINT est un point de sauvegarde intermédiaire à l'intérieur d'une transaction. Il permet d'annuler une partie de la transaction sans annuler le tout.

**Syntaxe** :

```sql
BEGIN;

INSERT INTO ...;

-- Créer un point de sauvegarde
SAVEPOINT mon_point;

UPDATE ...;   -- Si cette opération échoue...

-- Revenir au point de sauvegarde (INSERT conservé, UPDATE annulé)
ROLLBACK TO SAVEPOINT mon_point;

-- Continuer avec d'autres opérations
INSERT INTO ...;

COMMIT;  -- Valider le tout
```

**Supprimer un SAVEPOINT** (libérer les ressources sans annuler) :

```sql
RELEASE SAVEPOINT mon_point;
```

**Analogie concrète** : Imagine que tu rédiges un document. Tu enregistres une première version (SAVEPOINT). Tu continues à écrire. Si le nouveau texte ne te convient pas, tu reviens à la version enregistrée (ROLLBACK TO SAVEPOINT) sans perdre ce que tu avais écrit avant. Quand tout est bon, tu enregistres définitivement (COMMIT).

---

### Autocommit

**Définition** : Par défaut, PostgreSQL fonctionne en mode autocommit. Chaque commande SQL individuelle est automatiquement enveloppée dans sa propre transaction et validée immédiatement.

**Ce que cela signifie** :

- Sans `BEGIN` explicite, chaque commande est sa propre transaction.
- Si tu exécutes 3 INSERT sans `BEGIN`, chacun est une transaction indépendante.
- Si le 2e INSERT échoue, le 1er est déjà enregistré (il ne sera pas annulé).

```sql
-- Sans BEGIN : chaque INSERT est indépendant
INSERT INTO product VALUES (1, 'A', 10);  -- Enregistré immédiatement
INSERT INTO product VALUES (2, 'B', -5);  -- Échoue (CHECK price > 0)
-- Le produit A existe, le produit B non → état potentiellement incohérent

-- Avec BEGIN : les deux INSERT forment un tout
BEGIN;
INSERT INTO product VALUES (1, 'A', 10);
INSERT INTO product VALUES (2, 'B', -5);  -- Échoue
ROLLBACK;  -- Annule tout, même le produit A
-- Aucun produit n'existe → état cohérent
```

**Quand utiliser BEGIN explicitement** : Quand tu as **plusieurs opérations** qui doivent réussir ou échouer ensemble, ou quand tu veux pouvoir **annuler** un ensemble de modifications.

---

### Lien avec Doctrine (Symfony)

Dans un projet Symfony, Doctrine gère les transactions automatiquement. Quand tu appelles `$entityManager->flush()`, Doctrine ouvre une transaction, exécute toutes les requêtes SQL, puis fait un COMMIT.

**Fonctionnement automatique** :

```php
$product = new Product();
$product->setName('Clavier');
$product->setPrice(49.99);
$entityManager->persist($product);

$orderItem = new OrderItem();
$orderItem->setProduct($product);
$orderItem->setQuantity(2);
$entityManager->persist($orderItem);

// flush() = BEGIN + INSERT product + INSERT order_item + COMMIT
$entityManager->flush();
```

Si une erreur survient pendant le flush, Doctrine fait automatiquement un ROLLBACK.

**Transaction manuelle avec Doctrine** :

```php
$entityManager->getConnection()->beginTransaction();

try {
    $compte1 = $repository->find(1);
    $compte2 = $repository->find(2);

    if ($compte1->getSolde() < $amount) {
        throw new \RuntimeException('Solde insuffisant');
    }

    $compte1->setSolde($compte1->getSolde() - $amount);
    $compte2->setSolde($compte2->getSolde() + $amount);

    $entityManager->flush();
    $entityManager->getConnection()->commit();
} catch (\Exception $e) {
    $entityManager->getConnection()->rollBack();
    throw $e;
}
```

**Correspondance SQL → Doctrine** :

| SQL | Doctrine |
| --- | -------- |
| `BEGIN` | `$em->getConnection()->beginTransaction()` |
| `COMMIT` | `$em->getConnection()->commit()` |
| `ROLLBACK` | `$em->getConnection()->rollBack()` |
| `flush()` | `BEGIN` + toutes les requêtes + `COMMIT` (automatique) |

---

## Étapes Pratiques

### Données d'exemple

Pour toutes les étapes pratiques, on utilise une table de comptes bancaires :

```text
Table: compte
+----+---------+--------+
| id | owner   | solde  |
+----+---------+--------+
|  1 | Alice   | 500.00 |
|  2 | Bob     | 300.00 |
|  3 | Charlie | 150.00 |
+----+---------+--------+
```

Connecte-toi à PostgreSQL et crée la table :

```bash
docker compose exec database psql -U symfony_user -d symfony_db
```

```sql
CREATE TABLE compte (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner VARCHAR(100) NOT NULL,
    solde NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (solde >= 0)
);

INSERT INTO compte (owner, solde) VALUES
('Alice', 500.00),
('Bob', 300.00),
('Charlie', 150.00);
```

**Résultat attendu** :

```text
CREATE TABLE
INSERT 0 3
```

---

### Étape 1 : Transaction simple (virement entre 2 comptes)

**Objectif** : Transférer 100 euros d'Alice vers Bob. Les deux opérations doivent réussir ensemble.

```sql
-- Vérifier les soldes avant
SELECT owner, solde FROM compte WHERE id IN (1, 2);
```

**Résultat avant** :

```text
 owner | solde
-------+--------
 Alice | 500.00
 Bob   | 300.00
```

```sql
BEGIN;

-- Débiter Alice de 100€
UPDATE compte SET solde = solde - 100 WHERE id = 1;

-- Créditer Bob de 100€
UPDATE compte SET solde = solde + 100 WHERE id = 2;

-- Valider la transaction
COMMIT;

-- Vérifier les soldes après
SELECT owner, solde FROM compte WHERE id IN (1, 2);
```

**Résultat après COMMIT** :

```text
 owner | solde
-------+--------
 Alice | 400.00
 Bob   | 400.00
```

Les modifications sont définitivement enregistrées.

---

### Étape 2 : ROLLBACK en cas d'erreur (solde insuffisant)

**Objectif** : Tenter un virement qui échoue et annuler la transaction.

```sql
-- Tenter un virement de 200€ de Charlie vers Alice
BEGIN;

UPDATE compte SET solde = solde - 200 WHERE id = 3;
```

**Résultat** :

```text
ERROR:  new row for relation "compte" violates check constraint "compte_solde_check"
DETAIL:  Failing row contains (3, Charlie, -50.00).
```

La contrainte `CHECK (solde >= 0)` empêche le solde de passer en négatif.

```sql
-- La transaction est en erreur, on doit faire ROLLBACK
ROLLBACK;

-- Vérifier que rien n'a changé
SELECT owner, solde FROM compte WHERE id = 3;
```

**Résultat** :

```text
  owner  | solde
---------+--------
 Charlie | 150.00
```

Le solde de Charlie est intact. Le ROLLBACK a annulé toute la transaction.

**Note** : Quand une erreur survient dans une transaction PostgreSQL, toutes les commandes suivantes sont rejetées jusqu'au ROLLBACK.

---

### Étape 3 : SAVEPOINT (transfert multi-étapes avec point de retour)

**Objectif** : Effectuer un virement en deux étapes avec un point de sauvegarde intermédiaire.

Scénario : Alice veut transférer 50 euros à Bob, puis 30 euros à Charlie. Si le transfert vers Charlie échoue, on annule uniquement cette partie.

```sql
BEGIN;

-- Transfert 1 : Alice → Bob (50€)
UPDATE compte SET solde = solde - 50 WHERE id = 1;
UPDATE compte SET solde = solde + 50 WHERE id = 2;

-- Créer un point de sauvegarde après le premier transfert
SAVEPOINT apres_transfert_1;

-- Transfert 2 : Alice → Charlie (400€) - trop élevé !
UPDATE compte SET solde = solde - 400 WHERE id = 1;
```

**Résultat** :

```text
ERROR:  new row for relation "compte" violates check constraint "compte_solde_check"
```

Le transfert 2 échoue car Alice n'a que 350 euros (400 - 50 du premier transfert).

```sql
-- Revenir au point de sauvegarde (annuler uniquement le transfert 2)
ROLLBACK TO SAVEPOINT apres_transfert_1;

-- Vérifier que le transfert 1 est toujours valide
SELECT owner, solde FROM compte ORDER BY id;
```

**Résultat** :

```text
  owner  | solde
---------+--------
 Alice   | 350.00
 Bob     | 450.00
 Charlie | 150.00
```

Le transfert 1 (Alice vers Bob, 50 euros) est conservé.

```sql
-- Faire un transfert 2 plus petit : Alice → Charlie (30€)
UPDATE compte SET solde = solde - 30 WHERE id = 1;
UPDATE compte SET solde = solde + 30 WHERE id = 3;

-- Valider toute la transaction
COMMIT;

SELECT * FROM compte ORDER BY id;
```

**Résultat final** :

```text
 id |  owner  | solde
----+---------+--------
  1 | Alice   | 320.00
  2 | Bob     | 450.00
  3 | Charlie | 180.00
```

---

### Étape 4 : Observer l'isolation (2 sessions psql)

**Objectif** : Voir que les modifications d'une transaction ne sont pas visibles par les autres sessions avant le COMMIT.

Ouvre **deux terminaux** connectés à la même base de données :

```bash
# Terminal 1
docker compose exec database psql -U symfony_user -d symfony_db

# Terminal 2
docker compose exec database psql -U symfony_user -d symfony_db
```

**Séquence d'actions** :

**1. Terminal 1** : Démarrer une transaction et modifier une donnée.

```sql
-- Terminal 1
BEGIN;
UPDATE compte SET solde = solde - 50 WHERE id = 1;
SELECT owner, solde FROM compte WHERE id = 1;
```

**Résultat Terminal 1** : Alice = 270.00 (320 - 50).

**2. Terminal 2** : Lire la même donnée.

```sql
-- Terminal 2
SELECT owner, solde FROM compte WHERE id = 1;
```

**Résultat Terminal 2** : Alice = 320.00. La modification de Terminal 1 n'est pas visible car la transaction n'a pas été validée.

**3. Terminal 1** : Valider la transaction.

```sql
-- Terminal 1
COMMIT;
```

**4. Terminal 2** : Relire la même donnée.

```sql
-- Terminal 2
SELECT owner, solde FROM compte WHERE id = 1;
```

**Résultat Terminal 2** : Alice = 270.00. Le COMMIT a rendu la modification visible.

---

### Étape 5 : Nettoyage

```sql
DROP TABLE IF EXISTS compte;
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `BEGIN` | Démarre une transaction |
| `COMMIT` | Valide et enregistre toutes les modifications |
| `ROLLBACK` | Annule toutes les modifications depuis BEGIN |
| `SAVEPOINT nom` | Crée un point de sauvegarde intermédiaire |
| `ROLLBACK TO SAVEPOINT nom` | Revient au point de sauvegarde |
| `RELEASE SAVEPOINT nom` | Supprime le point de sauvegarde (libère les ressources) |
| `SELECT txid_current()` | Affiche l'identifiant de la transaction en cours |
| `SELECT * FROM pg_stat_activity` | Liste les connexions et transactions actives |

---

## Pièges Fréquents

### Piège 1 : Oublier COMMIT (transaction qui reste ouverte)

**Problème** : Tu fais un BEGIN et des modifications, mais tu oublies le COMMIT. La transaction reste ouverte indéfiniment. Les modifications ne sont pas visibles et les verrous ne sont pas libérés.

```sql
-- ❌ Transaction oubliée
BEGIN;
UPDATE compte SET solde = 0 WHERE id = 1;
-- ... tu fais autre chose, tu oublies le COMMIT
```

**Conséquences** : Les autres sessions qui tentent de modifier les mêmes lignes sont bloquées.

**Solution** : Toujours terminer une transaction par COMMIT ou ROLLBACK. Tu peux détecter les transactions oubliées :

```sql
SELECT pid, state, query, age(NOW(), xact_start) AS duree
FROM pg_stat_activity
WHERE state = 'idle in transaction'
ORDER BY xact_start;
```

---

### Piège 2 : Transaction longue = verrous

**Problème** : Une transaction qui dure longtemps bloque les autres utilisateurs. PostgreSQL pose des verrous sur les lignes modifiées. Les autres sessions qui veulent modifier ces mêmes lignes doivent attendre.

**Solution** : Garde tes transactions aussi courtes que possible. Fais tous les calculs et vérifications AVANT le BEGIN, puis exécute les modifications et COMMIT rapidement.

```sql
-- ❌ Transaction longue
BEGIN;
-- Calculs complexes pendant 5 minutes...
UPDATE compte SET solde = resultat WHERE id = 1;
COMMIT;

-- ✅ Transaction courte
-- Calculs complexes AVANT la transaction
BEGIN;
UPDATE compte SET solde = resultat WHERE id = 1;
COMMIT;  -- Quelques millisecondes
```

---

### Piège 3 : Deadlock (interblocage)

**Problème** : Deux transactions se bloquent mutuellement. La Session 1 verrouille la ligne A et attend la ligne B. La Session 2 verrouille la ligne B et attend la ligne A. Aucune des deux ne peut continuer.

```text
Session 1:                          Session 2:
BEGIN;                              BEGIN;
UPDATE ... WHERE id=1;              UPDATE ... WHERE id=2;
-- (verrouille ligne 1)             -- (verrouille ligne 2)
UPDATE ... WHERE id=2;              UPDATE ... WHERE id=1;
-- BLOQUÉ (attend ligne 2)          -- BLOQUÉ (attend ligne 1)
```

**Solution** : PostgreSQL détecte automatiquement les deadlocks et annule une des deux transactions. Pour les éviter, accède toujours aux lignes dans le même ordre.

```sql
-- ❌ Ordre différent = risque de deadlock
-- Session 1 : ligne 1 puis ligne 2
-- Session 2 : ligne 2 puis ligne 1

-- ✅ Même ordre = pas de deadlock
-- Session 1 : ligne 1 puis ligne 2
-- Session 2 : ligne 1 puis ligne 2
```

---

### Piège 4 : Ne pas gérer les erreurs dans une transaction

**Problème** : Quand une erreur survient dans une transaction, elle passe en état "aborted". Toute commande SQL suivante est rejetée.

```sql
BEGIN;
INSERT INTO compte (owner, solde) VALUES ('Test', 100);
INSERT INTO compte (owner, solde) VALUES ('Test', -50);  -- Erreur : CHECK solde >= 0

SELECT * FROM compte;
-- ERROR:  current transaction is aborted, commands ignored until end of transaction block
```

**Solution** : Après une erreur, faire ROLLBACK ou utiliser un SAVEPOINT.

```sql
-- Solution 1 : ROLLBACK complet
ROLLBACK;

-- Solution 2 : SAVEPOINT pour protéger les opérations précédentes
BEGIN;
INSERT INTO compte (owner, solde) VALUES ('Test', 100);
SAVEPOINT avant_insert_2;
INSERT INTO compte (owner, solde) VALUES ('Test', -50);  -- Erreur
ROLLBACK TO SAVEPOINT avant_insert_2;
-- L'INSERT de 'Test' (100) est toujours valide
COMMIT;
```

---

## Checklist de Validation

- [ ] Je comprends ce qu'est une transaction et pourquoi elle est nécessaire
- [ ] Je sais expliquer les 4 propriétés ACID
- [ ] Je sais démarrer une transaction avec BEGIN
- [ ] Je sais valider une transaction avec COMMIT
- [ ] Je sais annuler une transaction avec ROLLBACK
- [ ] Je sais créer un SAVEPOINT et revenir à un SAVEPOINT
- [ ] Je comprends le mode autocommit de PostgreSQL
- [ ] Je sais observer l'isolation entre deux sessions psql
- [ ] Je comprends comment Doctrine gère les transactions automatiquement
- [ ] Je sais écrire une transaction manuelle en Doctrine

---

## Exercice Pratique

**Énoncé** : Crée un système de réservation de places pour un événement avec des places limitées.

**Tables à créer** :

```sql
CREATE TABLE evenement (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    places_totales INTEGER NOT NULL CHECK (places_totales > 0),
    places_restantes INTEGER NOT NULL CHECK (places_restantes >= 0)
);

CREATE TABLE reservation (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    evenement_id INTEGER NOT NULL REFERENCES evenement(id),
    nom_client VARCHAR(255) NOT NULL,
    nb_places INTEGER NOT NULL CHECK (nb_places > 0),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Données initiales** :

```sql
INSERT INTO evenement (name, places_totales, places_restantes) VALUES
('Concert Rock', 100, 100),
('Théâtre Classique', 50, 50),
('Conférence Tech', 30, 30);
```

**Exercices** :

1. **Réservation simple** : Réserve 3 places pour "Alice" au "Concert Rock" dans une transaction. Débite les places restantes ET crée la ligne de réservation.
2. **Réservation refusée** : Tente de réserver 40 places pour "Bob" à la "Conférence Tech" (30 places seulement). La transaction doit échouer sans modifier les données.
3. **Réservations multiples avec SAVEPOINT** : Dans une seule transaction :
    - 10 places pour "Charlie" au "Concert Rock"
    - 60 places pour "Charlie" au "Théâtre Classique" (doit échouer : 50 places max)
    - Utilise un SAVEPOINT, puis réserve 5 places au "Théâtre Classique" (doit réussir)
4. **Vue de suivi** : Crée une vue `vue_occupation` qui affiche pour chaque événement : le nom, les places totales, les places restantes, le nombre de réservations et le taux d'occupation en pourcentage.

**Résultat attendu** :

- Concert Rock = 87 places restantes (100 - 3 - 10)
- Théâtre Classique = 45 places restantes (50 - 5)
- Conférence Tech = 30 places restantes (inchangé)

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Réservation simple** :

```sql
BEGIN;

UPDATE evenement SET places_restantes = places_restantes - 3 WHERE id = 1;

INSERT INTO reservation (evenement_id, nom_client, nb_places)
VALUES (1, 'Alice', 3);

COMMIT;
```

**Vérification** : Concert Rock = 97 places restantes.

---

**2. Réservation refusée** :

```sql
BEGIN;

-- Tenter de réserver 40 places (seulement 30 disponibles)
UPDATE evenement SET places_restantes = places_restantes - 40 WHERE id = 3;
-- ERROR: violates check constraint "evenement_places_restantes_check"

ROLLBACK;
```

**Vérification** : Conférence Tech = 30 places restantes (inchangé).

---

**3. Réservations multiples avec SAVEPOINT** :

```sql
BEGIN;

-- Réservation 1 : 10 places pour Charlie au Concert Rock
UPDATE evenement SET places_restantes = places_restantes - 10 WHERE id = 1;
INSERT INTO reservation (evenement_id, nom_client, nb_places)
VALUES (1, 'Charlie', 10);

SAVEPOINT apres_resa_1;

-- Réservation 2 : 60 places au Théâtre (50 max → échec)
UPDATE evenement SET places_restantes = places_restantes - 60 WHERE id = 2;
-- ERROR: violates check constraint

-- Revenir au SAVEPOINT
ROLLBACK TO SAVEPOINT apres_resa_1;

-- Réservation 2 (corrigée) : 5 places au Théâtre
UPDATE evenement SET places_restantes = places_restantes - 5 WHERE id = 2;
INSERT INTO reservation (evenement_id, nom_client, nb_places)
VALUES (2, 'Charlie', 5);

COMMIT;
```

**Vérification** :

```sql
SELECT name, places_restantes FROM evenement;
```

**Résultat** :

```text
       name       | places_restantes
------------------+------------------
 Concert Rock     |               87
 Théâtre Classique|               45
 Conférence Tech  |               30
```

---

**4. Vue de suivi** :

```sql
CREATE VIEW vue_occupation AS
SELECT
    e.name AS evenement,
    e.places_totales,
    e.places_restantes,
    COUNT(r.id) AS nb_reservations,
    ROUND(
        (e.places_totales - e.places_restantes)::NUMERIC
        / e.places_totales * 100, 1
    ) AS taux_occupation
FROM evenement e
LEFT JOIN reservation r ON e.id = r.evenement_id
GROUP BY e.id, e.name, e.places_totales, e.places_restantes;
```

**Vérification** :

```sql
SELECT * FROM vue_occupation ORDER BY taux_occupation DESC;
```

**Résultat** :

```text
    evenement     | places_totales | places_restantes | nb_reservations | taux_occupation
------------------+----------------+------------------+-----------------+-----------------
 Concert Rock     |            100 |               87 |               2 |            13.0
 Théâtre Classique|             50 |               45 |               1 |            10.0
 Conférence Tech  |             30 |               30 |               0 |             0.0
```

---

**Nettoyage** :

```sql
DROP VIEW IF EXISTS vue_occupation;
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS evenement;
```

---

## Navigation

← Fiche précédente : **[Les sous-requêtes et les vues](07-sous-requetes-vues.md)**
