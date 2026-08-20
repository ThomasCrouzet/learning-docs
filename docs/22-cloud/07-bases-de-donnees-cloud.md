---
tags:
  - Cloud
  - Intermédiaire
  - Pratique
description: "Bases de données managées dans le cloud : RDS, DynamoDB, ElastiCache, choix entre SQL et NoSQL, configuration et bonnes pratiques."
estimated_time: "75 min"
fiche_number: 7
total_fiches: 13
cursus: "Cloud"
---

# 07 - Bases de données cloud

> **En bref** : Tu découvriras les services de bases de données managées dans le cloud (RDS, DynamoDB, ElastiCache), tu comprendras quand choisir SQL ou NoSQL, et tu apprendras a déployer et configurer une base de données managée. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [06 - Infrastructure as Code](06-infrastructure-as-code.md)
- Avoir un compte AWS configure avec le CLI (fiche [01 - Introduction au Cloud](01-introduction-cloud.md))
- Connaissances de base en SQL (SELECT, INSERT, CREATE TABLE)

## Objectif de cette fiche

A la fin de cette fiche, tu sauras créer une base de données RDS (PostgreSQL), une table DynamoDB et un cluster ElastiCache, et tu sauras choisir le bon type de base de données selon ton cas d'usage.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une base de données managée ?

**Définition** : Une base de données managée est un service cloud ou le fournisseur gère l'infrastructure sous-jacente (serveur, système d'exploitation, mises à jour, sauvegardes, replication). Tu te concentres uniquement sur tes données et tes requêtes.

**Le problème que les bases de données managées résolvent** :

Sans base de données managée, voici les problèmes rencontres :

1. **Administration complexe** : Tu dois installer le moteur de base de données, configurer les paramètres système, gérer les mises à jour de sécurité, et surveiller les performances. Cela demande des compétences spécifiques en administration de bases de données.
2. **Sauvegardes manuelles** : Tu dois configurer et tester toi-meme les sauvegardes. Un oubli ou une erreur peut entrainer une perte de données irreversible.
3. **Haute disponibilité complexe** : Mettre en place la replication, le basculement automatique (failover) et la répartition de charge entre plusieurs instances demande un travail considerable.

**Comment les bases de données managées résolvent ces problèmes** :

| Problème | Solution apportée par les bases de données managées |
| --- | --- |
| Administration complexe | Le fournisseur cloud gère le serveur, le système d'exploitation et les mises à jour. Tu n'as qu'a choisir le moteur et la taille de l'instance |
| Sauvegardes manuelles | Les sauvegardes automatiques sont activees par défaut. Tu peux restaurer a n'importe quel point dans le temps |
| Haute disponibilité complexe | Un clic suffit pour activer le Multi-AZ (replique dans une autre zone de disponibilité avec basculement automatique) |

**Analogie concrète** : Gérer ta propre base de données, c'est comme posséder ta propre boulangerie. Tu dois acheter les fours, les entretenir, gérer les pannes, et t'assurer que tout fonctionne. Une base de données managée, c'est comme acheter ton pain chez le boulanger. Tu choisis le type de pain et la quantité, et le boulanger s'occupe de tout le reste.

**Ce qu'une base de données managée n'est PAS** :

- Une base de données managée n'est pas gratuite. Tu paies pour l'instance (calcul), le stockage et les transferts de données. Les coûts peuvent augmenter rapidement si tu ne surveilles pas la taille de l'instance.
- Une base de données managée ne te dispense pas de la conception. Tu dois toujours concevoir tes schémas, tes index et tes requêtes correctement. Le cloud ne corrige pas un mauvais modèle de données.

---

### Qu'est-ce que Amazon RDS ?

**Définition** : Amazon RDS (Relational Database Service) est un service managé qui permet de déployer, opérer et faire évoluer une base de données relationnelle dans le cloud. Le guide RDS (hors Aurora) liste six moteurs : IBM Db2, MariaDB, Microsoft SQL Server, MySQL, Oracle Database et PostgreSQL. Amazon Aurora (compatible MySQL ou PostgreSQL) est un service voisin, documenté dans le guide Aurora, pas comme un septième moteur RDS classique.

**Caractéristiques principales** :

| Caractéristique | Description |
| --- | --- |
| **Moteurs supportés (RDS)** | IBM Db2, MariaDB, SQL Server, MySQL, Oracle, PostgreSQL (Aurora : service séparé) |
| **Sauvegardes automatiques** | Sauvegarde quotidienne avec retention configurable (1 a 35 jours) |
| **Multi-AZ** | Replique synchrone dans une autre zone de disponibilité pour la haute disponibilité |
| **Replicas en lecture** | Jusqu'a 15 replicas pour repartir la charge de lecture |
| **Chiffrement** | Chiffrement au repos (KMS) et en transit (SSL/TLS) |
| **Scaling vertical** | Changement de taille d'instance avec quelques minutes d'arrêt |

**Classes d'instances courantes** :

| Classe | vCPU | RAM | Cas d'usage |
| --- | --- | --- | --- |
| `db.t3.micro` | 2 | 1 Go | Développement, tests, free tier |
| `db.t3.small` | 2 | 2 Go | Applications legeres |
| `db.t3.medium` | 2 | 4 Go | Applications moyennes |
| `db.r6g.large` | 2 | 16 Go | Production, requêtes complexes |
| `db.r6g.xlarge` | 4 | 32 Go | Charges de travail intensives |

---

### Qu'est-ce que Amazon DynamoDB ?

**Définition** : DynamoDB est une base de données NoSQL serverless et entièrement managée. Elle stocke les données sous forme de paires clé-valeur et de documents JSON. Elle est conçue pour des performances constantes a n'importe quelle échelle.

**Le problème que DynamoDB résout** :

Sans DynamoDB, voici les problèmes rencontres :

1. **Latence variable** : Les bases de données relationnelles ralentissent quand le volume de données augmente. Les jointures complexes sur des millions de lignes prennent de plus en plus de temps.
2. **Mise a l'échelle difficile** : Scaler une base relationnelle horizontalement (ajouter des serveurs) est complexe. Le sharding necessite de modifier l'application.
3. **Gestion de la capacité** : Tu dois prevoir la charge a l'avance et dimensionner tes serveurs en conséquence. Un pic de trafic imprevue peut provoquer une panne.

**Comment DynamoDB résout ces problèmes** :

| Problème | Solution apportée par DynamoDB |
| --- | --- |
| Latence variable | Temps de réponse constant en millisecondes, quelle que soit la taille de la table |
| Mise a l'échelle difficile | Scaling horizontal automatique et transparent. Pas de sharding manuel |
| Gestion de la capacité | Mode "a la demande" (on-demand) qui s'adapte automatiquement au trafic |

**Analogie concrète** : DynamoDB, c'est comme un casier de gare. Chaque casier a un numéro unique (la clé). Tu déposés un objet (la valeur) dans un casier, et tu le retrouves instantanément avec le numéro. Tu n'as pas besoin de fouiller tous les casiers. Peu importe que la gare ait 100 ou 100 000 casiers, retrouver le tien prend le même temps.

**Comparaison RDS vs DynamoDB** :

| Critère | RDS (SQL) | DynamoDB (NoSQL) |
| --- | --- | --- |
| Modèle de données | Tables avec colonnes fixes et relations | Documents JSON flexibles avec clé primaire |
| Requêtes | SQL complet (JOIN, GROUP BY, etc.) | Accès par clé primaire ou index secondaire |
| Schéma | Rigide, défini a l'avance | Flexible, chaque élément peut avoir des attributs différents |
| Scaling | Vertical (instance plus grosse) | Horizontal (automatique) |
| Cas d'usage | Relations complexes, transactions, rapports | Sessions, paniers, IoT, jeux, haute performance |
| Coût | A l'heure (instance toujours allumee) | A la requête ou a la capacité reservee |

---

### Qu'est-ce que Amazon ElastiCache ?

**Définition** : ElastiCache est un service de cache en mémoire entièrement managé. Il supporte trois moteurs : Valkey, Redis OSS et Memcached. Il stocke les données les plus fréquemment consultées en mémoire vive pour réduire le temps de réponse. Valkey est le successeur open source de Redis promu par AWS pour les nouveaux clusters ; Redis OSS reste disponible.

**Le problème que ElastiCache résout** :

Sans cache, voici les problèmes rencontres :

1. **Requêtes repetitives coûteuses** : Ton application execute la même requête SQL des milliers de fois par minute. Chaque requête mobilise des ressources de la base de données.
2. **Latence élevée** : Les utilisateurs attendent que la base de données reponde. Sur des requêtes complexes, cela peut prendre plusieurs secondes.
3. **Surcharge de la base de données** : Lors des pics de trafic, la base de données sature car elle reçoit plus de requêtes qu'elle ne peut en traiter.

**Comment ElastiCache résout ces problèmes** :

| Problème | Solution apportée par ElastiCache |
| --- | --- |
| Requêtes repetitives coûteuses | Le résultat est stocke en cache. Les requêtes suivantes lisent le cache au lieu de la base de données |
| Latence élevée | La mémoire vive répond en microsecondes au lieu de millisecondes ou secondes |
| Surcharge de la base de données | Le cache absorbe la majorité des lectures, reduisant la charge sur la base de données |

**Analogie concrète** : ElastiCache, c'est comme le comptoir d'un bar. Les bouteilles les plus demandees sont sur le comptoir (le cache), a portée de main. Le barman n'a pas besoin d'aller les chercher dans la réserve (la base de données) a chaque commande. Les bouteilles rarement commandees restent dans la réserve. Si une bouteille du comptoir est vide, le barman va la chercher dans la réserve et la remet sur le comptoir.

**Valkey / Redis OSS vs Memcached** :

| Critère | Valkey ou Redis OSS | Memcached |
| --- | --- | --- |
| Structures de données | Strings, listes, sets, hashes, sorted sets | Strings uniquement |
| Persistance | Oui (sauvegarde sur disque) | Non (mémoire uniquement) |
| Replication | Oui (replicas en lecture) | Non |
| Pub/Sub | Oui | Non |
| Cas d'usage | Sessions, classements, files d'attente, cache | Cache simple, objets volumineux |

---

### Comment choisir le bon service ?

**Arbre de décision** :

<div class="diagram-design">
<p><a href="../../diagrams/22-cloud-07-bases-de-donnees-cloud-1.html">Comment choisir le bon service ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/22-cloud-07-bases-de-donnees-cloud-1.html" title="Comment choisir le bon service ?" style="width:100%;min-height:532px;border:0;background:transparent"></iframe>
</div>

**Tableau récapitulatif** :

| Besoin | Service recommande |
| --- | --- |
| Application web classique (utilisateurs, commandes, produits) | RDS PostgreSQL |
| Sessions utilisateur, panier d'achat | DynamoDB ou ElastiCache Redis |
| Cache de requêtes SQL | ElastiCache Redis |
| Données IoT a très haut volume | DynamoDB |
| Classements en temps réel | ElastiCache Redis (sorted sets) |
| Stockage de documents JSON flexibles | DynamoDB |

---

## Étapes Pratiques

### Étape 1 : Creer une instance RDS PostgreSQL

```bash
# Creer un groupe de sous-reseaux pour RDS
# RDS a besoin d'au moins deux sous-reseaux dans deux zones de disponibilite
aws rds create-db-subnet-group \
  --db-subnet-group-name demo-subnet-group \
  --db-subnet-group-description "Sous-reseaux pour RDS demo" \
  --subnet-ids subnet-xxxxxxxx subnet-yyyyyyyy
```

```bash
# Creer l'instance RDS PostgreSQL
aws rds create-db-instance \
  --db-instance-identifier demo-postgres \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16.14 \
  --master-username admin_user \
  --master-user-password MonMotDePasse123! \
  --allocated-storage 20 \
  --storage-type gp3 \
  --no-publicly-accessible \
  --backup-retention-period 7 \
  --tags Key=Environment,Value=dev Key=ManagedBy,Value=cli
```

**Résultat attendu** :

```text
{
    "DBInstance": {
        "DBInstanceIdentifier": "demo-postgres",
        "DBInstanceClass": "db.t3.micro",
        "Engine": "postgres",
        "DBInstanceStatus": "creating",
        ...
    }
}
```

La création prend 5 a 10 minutes. Verifie le statut :

```bash
# Verifier le statut de l'instance
aws rds describe-db-instances \
  --db-instance-identifier demo-postgres \
  --query "DBInstances[0].DBInstanceStatus"
```

**Résultat attendu** (après quelques minutes) :

```text
"available"
```

---

### Étape 2 : Se connecter a l'instance RDS

```bash
# Recuperer l'endpoint de l'instance
aws rds describe-db-instances \
  --db-instance-identifier demo-postgres \
  --query "DBInstances[0].Endpoint.Address" \
  --output text
```

**Résultat attendu** :

```text
demo-postgres.xxxxxxxxxxxx.eu-west-3.rds.amazonaws.com
```

```bash
# Se connecter avec psql (depuis une instance EC2 dans le meme VPC)
psql -h demo-postgres.xxxxxxxxxxxx.eu-west-3.rds.amazonaws.com \
  -U admin_user \
  -d postgres
```

```sql
-- Creer une base de donnees
CREATE DATABASE mon_application;

-- Se connecter a la base
\c mon_application

-- Creer une table
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserer des donnees
INSERT INTO utilisateurs (nom, email) VALUES ('Alice', 'alice@exemple.fr');
INSERT INTO utilisateurs (nom, email) VALUES ('Bob', 'bob@exemple.fr');

-- Verifier les donnees
SELECT * FROM utilisateurs;
```

**Résultat attendu** :

```text
 id |  nom  |       email       |       date_creation
----+-------+-------------------+----------------------------
  1 | Alice | alice@exemple.fr  | 2025-01-15 14:30:00.000000
  2 | Bob   | bob@exemple.fr    | 2025-01-15 14:30:01.000000
```

---

### Étape 3 : Creer une table DynamoDB

```bash
# Creer une table DynamoDB pour des sessions utilisateur
aws dynamodb create-table \
  --table-name sessions \
  --attribute-definitions \
    AttributeName=session_id,AttributeType=S \
  --key-schema \
    AttributeName=session_id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --tags Key=Environment,Value=dev Key=ManagedBy,Value=cli
```

**Résultat attendu** :

```text
{
    "TableDescription": {
        "TableName": "sessions",
        "TableStatus": "CREATING",
        "KeySchema": [
            {
                "AttributeName": "session_id",
                "KeyType": "HASH"
            }
        ],
        "BillingModeSummary": {
            "BillingMode": "PAY_PER_REQUEST"
        }
    }
}
```

---

### Étape 4 : Lire et écrire dans DynamoDB

```bash
# Ecrire un element dans la table
aws dynamodb put-item \
  --table-name sessions \
  --item '{
    "session_id": {"S": "sess-abc123"},
    "user_id": {"S": "user-42"},
    "created_at": {"S": "2025-01-15T14:30:00Z"},
    "data": {"M": {
      "page_courante": {"S": "/accueil"},
      "panier": {"L": [
        {"S": "produit-1"},
        {"S": "produit-2"}
      ]}
    }}
  }'
```

```bash
# Lire un element par sa cle primaire
aws dynamodb get-item \
  --table-name sessions \
  --key '{"session_id": {"S": "sess-abc123"}}'
```

**Résultat attendu** :

```text
{
    "Item": {
        "session_id": {"S": "sess-abc123"},
        "user_id": {"S": "user-42"},
        "created_at": {"S": "2025-01-15T14:30:00Z"},
        "data": {"M": {
            "page_courante": {"S": "/accueil"},
            "panier": {"L": [
                {"S": "produit-1"},
                {"S": "produit-2"}
            ]}
        }}
    }
}
```

---

### Étape 5 : Creer un cluster ElastiCache Redis

```bash
# Creer un cluster ElastiCache Redis
aws elasticache create-cache-cluster \
  --cache-cluster-id demo-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --tags Key=Environment,Value=dev Key=ManagedBy,Value=cli
```

**Résultat attendu** :

```text
{
    "CacheCluster": {
        "CacheClusterId": "demo-redis",
        "CacheClusterStatus": "creating",
        "Engine": "redis",
        "CacheNodeType": "cache.t3.micro"
    }
}
```

```bash
# Verifier le statut
aws elasticache describe-cache-clusters \
  --cache-cluster-id demo-redis \
  --query "CacheClusters[0].CacheClusterStatus"
```

---

### Étape 6 : Utiliser Redis comme cache

```bash
# Recuperer l'endpoint Redis
aws elasticache describe-cache-clusters \
  --cache-cluster-id demo-redis \
  --show-cache-node-info \
  --query "CacheClusters[0].CacheNodes[0].Endpoint"
```

```bash
# Se connecter avec redis-cli (depuis une instance EC2 dans le meme VPC)
redis-cli -h demo-redis.xxxxxx.0001.euw3.cache.amazonaws.com -p 6379
```

```bash
# Stocker une valeur dans le cache (TTL de 300 secondes)
SET "user:42:profil" '{"nom":"Alice","email":"alice@exemple.fr"}' EX 300

# Lire la valeur
GET "user:42:profil"

# Verifier le TTL restant
TTL "user:42:profil"

# Stocker un compteur de visites
INCR "page:/accueil:visites"
INCR "page:/accueil:visites"
GET "page:/accueil:visites"
```

**Résultat attendu** :

```text
OK
"{\"nom\":\"Alice\",\"email\":\"alice@exemple.fr\"}"
(integer) 295
(integer) 1
(integer) 2
"2"
```

---

### Étape 7 : Nettoyer les ressources

```bash
# Supprimer l'instance RDS
aws rds delete-db-instance \
  --db-instance-identifier demo-postgres \
  --skip-final-snapshot \
  --delete-automated-backups

# Supprimer la table DynamoDB
aws dynamodb delete-table --table-name sessions

# Supprimer le cluster ElastiCache
aws elasticache delete-cache-cluster --cache-cluster-id demo-redis

# Supprimer le groupe de sous-reseaux RDS
aws rds delete-db-subnet-group --db-subnet-group-name demo-subnet-group
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `aws rds describe-db-instances` | Lister toutes les instances RDS |
| `aws rds create-db-snapshot` | Creer un snapshot manuel |
| `aws rds restore-db-instance-from-db-snapshot` | Restaurer depuis un snapshot |
| `aws dynamodb list-tables` | Lister les tables DynamoDB |
| `aws dynamodb scan --table-name <nom>` | Lire tous les éléments d'une table |
| `aws dynamodb query` | Requeter une table par clé primaire |
| `aws elasticache describe-cache-clusters` | Lister les clusters ElastiCache |
| `aws elasticache describe-replication-groups` | Lister les groupes de replication Redis |

---

## Pièges Frequents

### Piège 1 : Choisir NoSQL par défaut

**Problème** : Tu choisis DynamoDB pour toutes tes données parce que "NoSQL est plus rapide". Mais ton application a besoin de relations complexes (utilisateurs, commandes, produits avec jointures). Tu finis par dupliquer les données partout et tu dois gérer la cohérence manuellement.

**Solution** : Utilise l'arbre de décision de la section Concepts. Si tes données ont des relations (un utilisateur a plusieurs commandes, une commande a plusieurs produits), une base relationnelle (RDS) est le bon choix. DynamoDB est idéal pour les accès par clé : sessions, panier, événements, IoT.

### Piège 2 : Oublier de chiffrer la base de données

**Problème** : Tu créés une instance RDS sans activer le chiffrement. Après avoir charge des données, tu realises que la conformité exige le chiffrement. Tu ne peux pas activer le chiffrement sur une instance existante.

**Solution** : Active toujours le chiffrement a la création de l'instance (option `--storage-encrypted`). Pour une instance existante non chiffree, tu dois créer un snapshot, copier le snapshot avec chiffrement, et restaurer une nouvelle instance depuis le snapshot chiffre.

### Piège 3 : Rendre la base de données accessible publiquement

**Problème** : Tu actives l'accès public sur ton instance RDS pour te connecter depuis ton poste. La base de données est exposee sur internet et des bots tentent de la compromettre.

**Solution** : Garde toujours `--no-publicly-accessible` sur RDS. Connecte-toi via un bastion host (une instance EC2 dans le meme VPC) ou un tunnel SSH. Pour le développement local, utilise un VPN ou AWS Session Manager.

### Piège 4 : Ne pas surveiller les coûts DynamoDB en mode On-Demand

**Problème** : Tu utilises DynamoDB en mode PAY_PER_REQUEST. Une boucle dans ton code execute des milliers de requêtes par seconde. Ta facture explose.

**Solution** : Configure des alertes CloudWatch sur les métriques ConsumedReadCapacityUnits et ConsumedWriteCapacityUnits. Si tu connais ta charge a l'avance, utilise le mode provisionne (moins cher). En mode on-demand, définis des limites d'utilisation dans tes budgets AWS.

---

## Checklist de Validation

- [ ] Je sais expliquer la difference entre une base de données managée et une base auto-hebergee
- [ ] Je sais créer une instance RDS PostgreSQL avec le CLI AWS
- [ ] Je sais me connecter a une instance RDS et exécuter des requêtes SQL
- [ ] Je sais créer une table DynamoDB et y lire/écrire des éléments
- [ ] Je comprends quand utiliser SQL (RDS) vs NoSQL (DynamoDB)
- [ ] Je sais créer un cluster ElastiCache Redis
- [ ] Je sais nettoyer les ressources pour éviter les coûts inutiles

---

## Exercice Pratique

**Enonce** : Deploie l'infrastructure de base de données pour une application de gestion de taches :

1. Créé une instance RDS PostgreSQL `db.t3.micro` nommee `todo-db` avec :
   - Le moteur PostgreSQL 16
   - 20 Go de stockage gp3
   - Sauvegardes automatiques avec 7 jours de retention
   - Chiffrement active
   - Accès non-public

2. Créé une table DynamoDB `todo-sessions` avec :
   - Une clé de partition `session_id` (type String)
   - Le mode de facturation a la demande

3. Écris 3 éléments dans la table DynamoDB avec des attributs différents (session_id, user_id, created_at, et des données spécifiques a chaque session).

4. Lis un élément par sa clé primaire et verifie le résultat.

**Indications** :

- Commence par créer le groupe de sous-réseaux pour RDS
- Utilise l'option `--storage-encrypted` pour le chiffrement
- Verifie le statut de chaque ressource après création
- Note les endpoints pour te connecter

**Résultat attendu** : Une instance RDS en statut "available", une table DynamoDB en statut "ACTIVE", et 3 éléments lisibles dans la table.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Creer l'instance RDS** :

```bash
# Creer l'instance RDS avec chiffrement
aws rds create-db-instance \
  --db-instance-identifier todo-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 16.14 \
  --master-username todo_admin \
  --master-user-password TodoPass2025! \
  --allocated-storage 20 \
  --storage-type gp3 \
  --storage-encrypted \
  --no-publicly-accessible \
  --backup-retention-period 7 \
  --tags Key=Application,Value=todo Key=Environment,Value=dev
```

**Creer la table DynamoDB** :

```bash
# Creer la table de sessions
aws dynamodb create-table \
  --table-name todo-sessions \
  --attribute-definitions \
    AttributeName=session_id,AttributeType=S \
  --key-schema \
    AttributeName=session_id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --tags Key=Application,Value=todo Key=Environment,Value=dev
```

**Ecrire les 3 éléments** :

```bash
# Element 1 : session avec une liste de taches
aws dynamodb put-item \
  --table-name todo-sessions \
  --item '{
    "session_id": {"S": "sess-001"},
    "user_id": {"S": "user-10"},
    "created_at": {"S": "2025-01-15T10:00:00Z"},
    "taches_visibles": {"L": [{"S": "tache-1"}, {"S": "tache-2"}]},
    "filtre_actif": {"S": "en-cours"}
  }'

# Element 2 : session avec un tri personnalise
aws dynamodb put-item \
  --table-name todo-sessions \
  --item '{
    "session_id": {"S": "sess-002"},
    "user_id": {"S": "user-20"},
    "created_at": {"S": "2025-01-15T11:30:00Z"},
    "tri": {"S": "date_echeance"},
    "page": {"N": "2"}
  }'

# Element 3 : session avec les preferences utilisateur
aws dynamodb put-item \
  --table-name todo-sessions \
  --item '{
    "session_id": {"S": "sess-003"},
    "user_id": {"S": "user-10"},
    "created_at": {"S": "2025-01-15T14:00:00Z"},
    "preferences": {"M": {
      "theme": {"S": "sombre"},
      "langue": {"S": "fr"}
    }}
  }'
```

**Lire un élément** :

```bash
# Lire la session sess-001
aws dynamodb get-item \
  --table-name todo-sessions \
  --key '{"session_id": {"S": "sess-001"}}'
```

**Résultat attendu** :

```text
{
    "Item": {
        "session_id": {"S": "sess-001"},
        "user_id": {"S": "user-10"},
        "created_at": {"S": "2025-01-15T10:00:00Z"},
        "taches_visibles": {"L": [{"S": "tache-1"}, {"S": "tache-2"}]},
        "filtre_actif": {"S": "en-cours"}
    }
}
```

**Verifier le statut des ressources** :

```bash
# Statut RDS
aws rds describe-db-instances \
  --db-instance-identifier todo-db \
  --query "DBInstances[0].{Status:DBInstanceStatus,Encrypted:StorageEncrypted}"

# Statut DynamoDB
aws dynamodb describe-table \
  --table-name todo-sessions \
  --query "Table.{Status:TableStatus,ItemCount:ItemCount}"
```

**Nettoyer** :

```bash
aws rds delete-db-instance \
  --db-instance-identifier todo-db \
  --skip-final-snapshot \
  --delete-automated-backups

aws dynamodb delete-table --table-name todo-sessions
```

---

## Navigation

← Fiche précédente : **[06 - Infrastructure as Code](06-infrastructure-as-code.md)**

→ Fiche suivante : **[08 - Conteneurs cloud](08-conteneurs-cloud.md)**
