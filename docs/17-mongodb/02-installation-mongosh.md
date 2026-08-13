---
tags:
  - MongoDB
  - Débutant
  - Pratique
description: "Installer MongoDB avec Docker, se connecter avec mongosh et découvrir MongoDB Compass"
estimated_time: "60 min"
fiche_number: 2
total_fiches: 8
cursus: "MongoDB"
---

# 02 - Installation et mongosh

> **En bref** : À la fin de cette fiche, tu auras un serveur MongoDB qui tourne dans Docker, tu sauras te connecter avec mongosh et insérer tes premiers documents. Lecture estimée : 60 min.

## Prérequis

- [Fiche précédente : Introduction à MongoDB](01-introduction-mongodb.md)
- Docker installé et fonctionnel sur ta machine

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| MongoDB | 8.x |
| Docker | 24+ |
| mongosh | 2.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lancer un serveur MongoDB dans Docker, te connecter avec le shell interactif mongosh, créer une base de données et insérer tes premiers documents.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que mongosh ?

**Définition** : mongosh (MongoDB Shell) est le client en ligne de commande officiel de MongoDB. C'est un terminal interactif qui te permet d'envoyer des commandes au serveur MongoDB, d'exécuter des requêtes et d'administrer les bases de données.

**Le problème que mongosh résout** :

Sans mongosh, voici les problèmes rencontrés :

1. **Pas d'interface directe** : le serveur MongoDB tourne en arrière-plan. Sans outil client, tu n'as aucun moyen d'interagir avec lui.

2. **Tests et exploration** : quand tu developpes, tu veux tester des requêtes rapidement avant de les intégrer dans ton application Node.js. Sans mongosh, tu devrais écrire du code a chaque fois.

3. **Administration** : créer des bases, des utilisateurs, vérifier l'état du serveur - tout cela nécessite un outil d'administration.

**Comment mongosh résout ces problèmes** :

| Problème | Solution mongosh |
| -------- | ---------------- |
| Pas d'interface | Terminal interactif connecté au serveur |
| Tests et exploration | Exécuter des requêtes à la volée, voir les résultats immédiatement |
| Administration | Commandes de gestion des bases, utilisateurs, index |

**Analogie concrète** : mongosh est a MongoDB ce que `psql` est a PostgreSQL ou `redis-cli` est a Redis. C'est le terminal qui te permet de parler directement a la base de données.

**Ce que mongosh n'est PAS** :

- mongosh n'est pas une interface graphique. C'est un outil en ligne de commande. Pour une interface graphique, il y a MongoDB Compass.
- mongosh n'est pas le serveur MongoDB. C'est un client qui se connecté au serveur. Le serveur (`mongod`) doit tourner séparément.

---

### Qu'est-ce que MongoDB Compass ?

**Définition** : MongoDB Compass est l'interface graphique officielle de MongoDB. Elle permet de visualiser les données, d'exécuter des requêtes et de gérer les bases de données avec une interface visuelle.

**Comparaison mongosh vs Compass** :

| mongosh (CLI) | Compass (GUI) |
| ------------- | ------------- |
| Ligne de commande | Interface graphique |
| Léger, rapide | Plus lourd, mais plus visuel |
| Scriptable (automatisation) | Clic-clic (exploration) |
| Indispensable en production | Utile pour le développement |
| Inclus dans l'image Docker | A installer séparément |

**En pratique** : dans ce cursus, on utilise principalement mongosh car il est inclus dans le conteneur Docker et te permet de comprendre exactement ce qui se passe. Compass est un complement utile pour visualiser les données.

---

### Docker et MongoDB

**Définition** : Docker permet de lancer un serveur MongoDB sans l'installer directement sur ta machine. Le serveur tourne dans un conteneur isole avec tout ce qu'il faut.

**Le problème que Docker résout pour MongoDB** :

Sans Docker, voici les problèmes rencontrés :

1. **Installation complexe** : installer MongoDB directement sur macOS, Windows ou Linux nécessite des étapes différentes pour chaque système.
2. **Conflits de versions** : si tu travailles sur deux projets qui utilisent des versions différentes de MongoDB, tu as un conflit.
3. **Nettoyage** : desinstaller MongoDB laisse souvent des fichiers residuels sur le système.

**Comment Docker résout ces problèmes** :

| Problème | Solution Docker |
| -------- | --------------- |
| Installation complexe | Une seule commande `docker run` |
| Conflits de versions | Chaque conteneur a sa propre version |
| Nettoyage | `docker rm` supprime tout proprement |

**Architecture Docker pour MongoDB** :

```mermaid
flowchart LR
    APP["Application Node.js"] -->|port 27017| MONGO["Conteneur MongoDB\n(mongod)"]
    CLI["mongosh\n(dans le conteneur)"] --> MONGO
    COMPASS["MongoDB Compass\n(sur ta machine)"] -->|port 27017| MONGO
```

**Port par défaut** : MongoDB écoute sur le port **27017**. C'est l'équivalent du port 5432 pour PostgreSQL ou du port 6379 pour Redis.

---

### La chaîne de connexion MongoDB

**Définition** : La chaîne de connexion (connection string) est l'URL qui indique au client comment se connecter au serveur MongoDB. Elle contient l'adresse du serveur, le port, et les eventuels identifiants.

**Format** :

```text
mongodb://utilisateur:motdepasse@hote:port/base_de_donnees
```

**Exemples** :

```text
# Connexion locale sans authentification
mongodb://localhost:27017

# Connexion locale a une base specifique
mongodb://localhost:27017/monapp

# Connexion avec authentification
mongodb://admin:secret@localhost:27017/monapp?authSource=admin

# Connexion a un serveur distant
mongodb://admin:secret@192.168.1.10:27017/monapp
```

**En développement avec Docker** : la chaîne de connexion sera généralement `mongodb://localhost:27017/nomdelabase` car le conteneur expose le port 27017 sur ta machine.

---

## Étapes Pratiques

### Étape 1 : Verifier que Docker fonctionne

Avant de travailler avec MongoDB, vérifie que Docker est installé et fonctionne :

```bash
# Affiche la version de Docker installee
docker --version
```

**Résultat attendu** :

```text
Docker version 24.0.x, build xxxxxxx
```

Si tu obtiens une erreur, revois le cursus Docker.

---

### Étape 2 : Lancer un conteneur MongoDB

Lance un conteneur MongoDB pour tes premiers tests :

```bash
# Telecharge l'image MongoDB 8 et lance le conteneur
# --name mongo-test : donne un nom au conteneur
# -d : lance en arriere-plan (detached)
# -p 27017:27017 : expose le port 27017 sur ta machine
# -v mongo-data:/data/db : cree un volume pour persister les donnees
docker run --name mongo-test -d -p 27017:27017 -v mongo-data:/data/db mongo:8
```

**Résultat attendu** :

```text
Unable to find image 'mongo:8' locally
8: Pulling from library/mongo
...
Status: Downloaded newer image for mongo:8
<identifiant-du-conteneur>
```

**Note** : l'option `-v mongo-data:/data/db` créé un volume Docker nomme `mongo-data`. Les données MongoDB sont stockées dans `/data/db` a l'intérieur du conteneur. Sans ce volume, les données seraient perdues a la suppression du conteneur.

---

### Étape 3 : Verifier que le conteneur fonctionne

```bash
# Liste les conteneurs en cours d'execution
docker ps
```

**Résultat attendu** :

```text
CONTAINER ID   IMAGE     COMMAND                  STATUS          PORTS
abc123def456   mongo:8   "docker-entrypoint.s..."  Up 10 seconds   0.0.0.0:27017->27017/tcp
```

---

### Étape 4 : Se connecter avec mongosh

mongosh est inclus dans l'image Docker de MongoDB. Tu peux l'utiliser directement dans le conteneur :

```bash
# Ouvre un terminal interactif dans le conteneur et lance mongosh
docker exec -it mongo-test mongosh
```

**Résultat attendu** :

```text
Current Mongosh Log ID: 661234567890abcdef012345
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
Using MongoDB:          8.0.x
Using Mongosh:          2.x.x

test>
```

Le prompt `test>` indique que tu es connecté à la base de données `test` (base par défaut).

---

### Étape 5 : Explorer les commandes de base

Dans mongosh, execute les commandes suivantes :

```javascript
// Affiche les bases de donnees existantes
show dbs
```

**Résultat attendu** :

```text
admin   40.00 KiB
config  72.00 KiB
local   40.00 KiB
```

Ces trois bases sont créées automatiquement par MongoDB :

- `admin` : administration du serveur
- `config` : configuration interne
- `local` : données locales au serveur

```text
// Cree et bascule vers une nouvelle base de donnees
use monapp
```

**Résultat attendu** :

```text
switched to db monapp
```

**Important** : la base `monapp` n'apparaît pas encore dans `show dbs` car elle est vide. MongoDB créé réellement la base quand tu y inseres le premier document.

---

### Étape 6 : Insérer un premier document

```javascript
// Insere un document dans la collection "utilisateurs"
// La collection est creee automatiquement si elle n'existe pas
db.utilisateurs.insertOne({
  nom: "Alice Dupont",
  email: "alice@example.com",
  age: 28,
  ville: "Paris"
})
```

**Résultat attendu** :

```text
{
  acknowledged: true,
  insertedId: ObjectId('507f1f77bcf86cd799439011')
}
```

- `acknowledged: true` signifie que MongoDB a bien reçu et enregistre le document.
- `insertedId` est l'identifiant unique (`_id`) généré automatiquement pour ce document.

---

### Étape 7 : Verifier l'insertion

```javascript
// Affiche tous les documents de la collection "utilisateurs"
db.utilisateurs.find()
```

**Résultat attendu** :

```text
[
  {
    _id: ObjectId('507f1f77bcf86cd799439011'),
    nom: 'Alice Dupont',
    email: 'alice@example.com',
    age: 28,
    ville: 'Paris'
  }
]
```

```javascript
// Verifie que la base apparait maintenant dans la liste
show dbs
```

**Résultat attendu** :

```text
admin   40.00 KiB
config  72.00 KiB
local   40.00 KiB
monapp   8.00 KiB
```

La base `monapp` apparaît car elle contient maintenant un document.

---

### Étape 8 : Insérer un document avec des sous-documents

```javascript
// Insere un document avec un sous-document et un tableau
db.utilisateurs.insertOne({
  nom: "Bob Martin",
  email: "bob@example.com",
  age: 35,
  adresse: {
    rue: "5 avenue des Champs",
    ville: "Lyon",
    code_postal: "69001"
  },
  competences: ["JavaScript", "Node.js", "React"]
})
```

**Résultat attendu** :

```text
{
  acknowledged: true,
  insertedId: ObjectId('507f1f77bcf86cd799439012')
}
```

```javascript
// Affiche le document avec un formatage lisible
db.utilisateurs.find().pretty()
```

---

### Étape 9 : Utiliser les commandes d'information

```javascript
// Affiche les collections de la base courante
show collections
```

**Résultat attendu** :

```text
utilisateurs
```

```javascript
// Compte le nombre de documents dans la collection
db.utilisateurs.countDocuments()
```

**Résultat attendu** :

```text
2
```

```javascript
// Affiche les statistiques de la collection
db.utilisateurs.stats()
```

---

### Étape 10 : Quitter et nettoyer

```javascript
// Quitte mongosh
exit
```

Pour supprimer le conteneur et le volume (uniquement si tu veux repartir de zéro) :

```bash
# Arrete et supprime le conteneur
docker rm -f mongo-test

# Supprime le volume de donnees
docker volume rm mongo-data
```

---

## Docker Compose pour MongoDB

Pour un projet réel, utilise Docker Compose au lieu de `docker run`. Voici un fichier de configuration type :

```yaml
# docker-compose.yml
services:
  mongodb:
    image: mongo:8
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    environment:
      # Identifiants de l'administrateur (optionnel en dev)
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret
    restart: unless-stopped

volumes:
  mongo-data:
```

Pour lancer :

```bash
# Lance MongoDB en arriere-plan
docker compose up -d
```

Pour se connecter avec authentification :

```bash
# Connexion avec identifiants
docker exec -it mongodb mongosh -u admin -p secret
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `docker run --name mongo -d -p 27017:27017 mongo:8` | Lance un conteneur MongoDB |
| `docker exec -it mongo mongosh` | Se connecté à mongosh |
| `show dbs` | Liste les bases de données |
| `use nombase` | Bascule vers une base (la créé si nécessaire) |
| `show collections` | Liste les collections de la base courante |
| `db.collection.insertOne({})` | Insere un document |
| `db.collection.find()` | Liste tous les documents |
| `db.collection.countDocuments()` | Compte les documents |
| `db.dropDatabase()` | Supprime la base courante |
| `exit` | Quitte mongosh |

---

## Pièges Fréquents

### Piège 1 : Oublier le volume Docker

⚠️ **Problème** : Tu lances MongoDB sans volume (`-v`). Quand tu supprimes le conteneur, toutes tes données sont perdues.

✅ **Solution** : Utilise toujours un volume pour persister les données :

```bash
# Avec un volume nomme
docker run --name mongo -d -p 27017:27017 -v mongo-data:/data/db mongo:8
```

---

### Piège 2 : Confondre la base et la collection

⚠️ **Problème** : Tu tapes `db.find()` au lieu de `db.utilisateurs.find()`. Tu confonds la base de données (`db`) et la collection.

✅ **Solution** : La syntaxe est toujours `db.nomCollection.methode()`. `db` représente la base de données courante, pas une collection :

```javascript
// Mauvais : db n'est pas une collection
db.find()

// Bon : specifier la collection
db.utilisateurs.find()
```

---

### Piège 3 : Croire que la base existe après use

⚠️ **Problème** : Tu tapes `use monapp` puis `show dbs` et la base n'apparaît pas. Tu crois qu'il y a une erreur.

✅ **Solution** : C'est normal. MongoDB ne créé réellement la base que quand tu y inseres un premier document. `use` te positionne simplement dans le contexte de cette base.

---

### Piège 4 : Ne pas exposer le port

⚠️ **Problème** : Tu lances le conteneur sans `-p 27017:27017`. Tu ne peux pas te connecter depuis ta machine avec Compass ou depuis une application Node.js.

✅ **Solution** : Expose toujours le port quand tu as besoin de te connecter depuis l'extérieur du conteneur :

```bash
# Sans -p : accessible uniquement depuis l'interieur du conteneur
docker run --name mongo -d mongo:8

# Avec -p : accessible depuis ta machine
docker run --name mongo -d -p 27017:27017 mongo:8
```

---

## Checklist de Validation

- [ ] J'ai lance un conteneur MongoDB avec Docker
- [ ] Je sais me connecter avec mongosh
- [ ] J'ai créé une base de données avec `use`
- [ ] J'ai insere un document avec `insertOne`
- [ ] J'ai vérifie l'insertion avec `find`
- [ ] Je connais les commandes `show dbs`, `show collections` et `countDocuments`
- [ ] Je comprends l'importance du volume Docker pour la persistance
- [ ] Je sais écrire un `docker-compose.yml` pour MongoDB

---

## Exercice Pratique

**Énoncé** : Configure un environnement MongoDB complet avec Docker Compose et insere des données de test.

**Indications** :

- Créé un fichier `docker-compose.yml` avec MongoDB et des identifiants admin
- Lance le conteneur avec `docker compose up -d`
- Connecte-toi avec mongosh en utilisant les identifiants
- Créé une base de données `bibliotheque`
- Insere 3 livres dans une collection `livres` (chaque livre a un titre, un auteur avec nom et prénom, une année de publication et un tableau de genres)
- Vérifie que les 3 livres sont bien inseres
- Compte le nombre de documents
- Arrete le conteneur, relance-le, et vérifie que les données sont toujours la (grâce au volume)

**Résultat attendu** : 3 documents dans la collection `livres`, persistants après redémarrage du conteneur.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Créé un fichier `docker-compose.yml` :

```yaml
services:
  mongodb:
    image: mongo:8
    container_name: mongo-biblio
    ports:
      - "27017:27017"
    volumes:
      - biblio-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret
    restart: unless-stopped

volumes:
  biblio-data:
```

```bash
# Lance le conteneur
docker compose up -d
```

```bash
# Connecte-toi avec les identifiants admin
docker exec -it mongo-biblio mongosh -u admin -p secret
```

Dans mongosh :

```text
// Bascule vers la base bibliotheque
use bibliotheque

// Insere 3 livres
db.livres.insertOne({
  titre: "Le Petit Prince",
  auteur: { prenom: "Antoine", nom: "de Saint-Exupery" },
  annee: 1943,
  genres: ["Fiction", "Conte philosophique"]
})

db.livres.insertOne({
  titre: "Les Miserables",
  auteur: { prenom: "Victor", nom: "Hugo" },
  annee: 1862,
  genres: ["Roman", "Historique", "Drame"]
})

db.livres.insertOne({
  titre: "L'Etranger",
  auteur: { prenom: "Albert", nom: "Camus" },
  annee: 1942,
  genres: ["Roman", "Philosophique"]
})

// Verifie les insertions
db.livres.find()

// Compte les documents
db.livres.countDocuments()
// 3

// Quitte mongosh
exit
```

Vérifie la persistance :

```bash
# Arrete le conteneur
docker compose down

# Relance le conteneur
docker compose up -d

# Reconnecte-toi
docker exec -it mongo-biblio mongosh -u admin -p secret
```

```text
// Verifie que les donnees sont toujours la
use bibliotheque
db.livres.countDocuments()
// 3

db.livres.find()
// Les 3 livres sont toujours presents

exit
```

```bash
# Arrêt (conserve le volume / les données)
docker compose down
```

⚠️ `docker compose down -v` détruirait le volume MongoDB. Ne l'utilise que pour un reset volontaire, jamais comme nettoyage habituel.

---

## Navigation

← Fiche précédente : **[Introduction à MongoDB](01-introduction-mongodb.md)**

→ Fiche suivante : **[Opérations CRUD](03-crud-operations.md)**
