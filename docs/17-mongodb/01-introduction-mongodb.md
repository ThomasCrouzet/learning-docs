---
tags:
  - MongoDB
  - Débutant
  - Concept
description: "Comprendre ce qu'est MongoDB, le modèle NoSQL oriente document et ses differences avec les bases relationnelles"
estimated_time: "60 min"
fiche_number: 1
total_fiches: 8
cursus: "MongoDB"
---

# 01 - Introduction à MongoDB

> **En bref** : À la fin de cette fiche, tu comprendras ce qu'est MongoDB, pourquoi on l'utilise et dans quels cas il est preferable a une base de données relationnelle comme PostgreSQL. Lecture estimée : 60 min.

## Prérequis

- [Cursus Node.js](../fondamentaux/07-nodejs/index.md) termine (npm, modules, Express, API REST)
- Savoir ce qu'est une base de données et une requête SQL basique

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| MongoDB | 8.x |
| Docker | 24+ |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer ce qu'est MongoDB, décrire le modèle de données oriente document, et choisir entre MongoDB et une base relationnelle selon le cas d'usage.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que NoSQL ?

**Définition** : NoSQL (Not Only SQL) désigne une famille de bases de données qui n'utilisent pas le modèle relationnel classique (tables, colonnes, lignes, SQL). Il existe plusieurs types de bases NoSQL : clé-valeur (Redis), document (MongoDB), colonnes (Cassandra), graphe (Neo4j).

**Le problème que NoSQL résout** :

Sans NoSQL, voici les problèmes rencontrés :

1. **Schéma rigide** : dans une base relationnelle, tu dois définir la structure exacte de chaque table (colonnes, types) avant d'insérer des données. Modifier cette structure sur une table avec des millions de lignes est lent et risque.

2. **Données hétérogènes** : quand chaque enregistrement a une structure différente (un produit "livre" a un champ `auteur`, un produit "television" a un champ `taille_ecran`), le modèle relationnel oblige à créer des colonnes nullables ou des tables supplémentaires.

3. **Scalabilite horizontale** : les bases relationnelles sont conçues pour tourner sur un seul serveur puissant (scalabilité verticale). Repartir les données sur plusieurs serveurs est complexe.

**Comment NoSQL résout ces problèmes** :

| Problème | Solution NoSQL |
| -------- | -------------- |
| Schéma rigide | Schéma flexible, chaque document peut avoir une structure différente |
| Données hétérogènes | Chaque document contient exactement les champs nécessaires |
| Scalabilite horizontale | Conçu pour repartir les données sur plusieurs serveurs (sharding) |

**Ce que NoSQL n'est PAS** :

- NoSQL n'est pas un remplacement des bases relationnelles. Les bases relationnelles restent le meilleur choix pour les données fortement structurees avec des relations complexes (système bancaire, comptabilité).
- NoSQL n'est pas "sans SQL". Certaines bases NoSQL proposent des langages de requête similaires a SQL. Le terme signifie "Not Only SQL".

---

### Qu'est-ce que MongoDB ?

**Définition** : MongoDB est une base de données NoSQL orientee document. Elle stocke les données sous forme de documents JSON (techniquement BSON - Binary JSON) regroupes dans des collections. C'est la base de données NoSQL la plus populaire au monde.

**Le problème que MongoDB résout** :

Sans MongoDB, voici les problèmes rencontrés :

1. **Développement web moderne** : les applications web manipulent des données au format JSON. Avec une base relationnelle, tu dois convertir les données JSON en lignes/colonnes (ORM), puis reconvertir en JSON pour l'API. Ces conversions ajoutent de la complexité et du code.

2. **Évolution du schéma** : ton application évolue, tu ajoutes un champ `avatar` aux utilisateurs. Avec PostgreSQL, tu dois écrire une migration, l'exécuter en production, gérer les anciennes lignes sans ce champ. Avec MongoDB, tu ajoutes le champ aux nouveaux documents, sans migration.

3. **Données imbriquées** : un article de blog a un titre, un contenu, et une liste de commentaires. En SQL, tu crées une table `articles` et une table `commentaires` avec une clé étrangère. En MongoDB, les commentaires sont directement imbriqués dans le document de l'article.

**Comment MongoDB résout ces problèmes** :

| Problème | Solution MongoDB |
| -------- | ---------------- |
| Conversion JSON | Les documents MongoDB sont du JSON natif |
| Évolution du schéma | Pas de migration, les documents coexistent avec des structures différentes |
| Données imbriquées | Les sous-documents sont stockes directement dans le document parent |

**Analogie concrète** : Imagine un classeur a tiroirs. PostgreSQL, c'est un classeur ou chaque tiroir a des separateurs fixes identiques - chaque fiche doit avoir exactement les memes champs, dans le même ordre. MongoDB, c'est un classeur ou chaque fiche est une feuille libre - tu écris ce que tu veux sur chaque fiche, avec les champs qui ont du sens pour cette fiche en particulier.

**Ce que MongoDB n'est PAS** :

- MongoDB n'est pas adapte aux transactions complexes impliquant plusieurs collections (même si MongoDB supporte les transactions multi-documents depuis la version 4.0, ce n'est pas son point fort).
- MongoDB n'est pas un remplacement de PostgreSQL pour les cas où les relations entre données sont au coeur du modèle (système de facturation, ERP).

---

### Le modèle de données oriente document

**Définition** : Dans MongoDB, une donnée est un document. Un document est un objet JSON avec des paires clé-valeur. Les documents sont regroupes dans des collections (l'équivalent des tables en SQL).

**Vocabulaire MongoDB vs SQL** :

| SQL (PostgreSQL) | MongoDB | Description |
| ---------------- | ------- | ----------- |
| Base de données | Base de données | Conteneur de niveau supérieur |
| Table | Collection | Groupe de données du même type |
| Ligne (row) | Document | Une entrée individuelle |
| Colonne | Champ (field) | Un attribut de l'entrée |
| Clé primaire | `_id` | Identifiant unique de l'entrée |
| Jointure (JOIN) | `$lookup` / imbrication | Lier des données entre elles |
| Schéma (CREATE TABLE) | Pas de schéma obligatoire | Structure des données |

**Exemple de document MongoDB** :

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nom": "Alice Dupont",
  "email": "alice@example.com",
  "age": 28,
  "adresse": {
    "rue": "12 rue de la Paix",
    "ville": "Paris",
    "code_postal": "75002"
  },
  "competences": ["JavaScript", "Node.js", "MongoDB"],
  "inscription": "2025-01-15T10:30:00Z"
}
```

**Points importants** :

- Chaque document a un champ `_id` unique généré automatiquement par MongoDB (un ObjectId de 24 caractères hexadécimaux).
- Un document peut contenir des sous-documents (`adresse` dans l'exemple).
- Un document peut contenir des tableaux (`competences` dans l'exemple).
- Les types supportés : string, number, boolean, array, object, date, null, ObjectId, et d'autres types BSON.

---

### Qu'est-ce que BSON ?

**Définition** : BSON (Binary JSON) est le format binaire que MongoDB utilise pour stocker les documents. C'est du JSON converti en binaire pour un stockage et une lecture plus rapides.

**Le problème que BSON résout** :

Sans BSON, voici les problèmes rencontrés :

1. **Performance** : le JSON texte est lisible par un humain, mais lent a parser pour un ordinateur. Chaque lecture de document necessiterait de parser du texte.

2. **Types limites** : le JSON standard ne supporte que 6 types (string, number, boolean, null, array, object). MongoDB a besoin de types supplémentaires comme les dates, les ObjectId, les entiers 64 bits ou les données binaires.

**Comment BSON résout ces problèmes** :

| Problème | Solution BSON |
| -------- | ------------- |
| Performance | Format binaire, parsing beaucoup plus rapide |
| Types limites | 18+ types supportés (Date, ObjectId, Int64, Decimal128, Binary, etc.) |

**Analogie concrète** : JSON c'est comme un texte écrit en français - n'importe qui peut le lire, mais c'est long a traiter pour un ordinateur. BSON c'est comme un code-barres - illisible pour un humain, mais un scanner le lit instantanément.

**En pratique** : tu écris tes documents en JSON (format lisible), et MongoDB les convertit automatiquement en BSON pour le stockage. Tu n'as jamais besoin de manipuler du BSON directement.

---

### Les cas d'usage de MongoDB

**Définition** : MongoDB est adapte a certains types d'applications. Voici les cas d'usage les plus courants.

#### 1. Applications web et API REST

**Le cas** : Une API REST qui sert des données JSON a un frontend React ou une application mobile. Les données sont naturellement au format JSON, et le schéma evolue fréquemment au début du projet.

**Pourquoi MongoDB** : Les documents MongoDB sont du JSON natif. Pas de conversion nécessaire entre la base de données et l'API.

#### 2. Gestion de contenu (CMS)

**Le cas** : Un système de gestion de contenu ou chaque type de contenu a une structure différente (article, page, produit, événement). Chaque type a des champs spécifiques.

**Pourquoi MongoDB** : Le schéma flexible permet de stocker des contenus de structures différentes dans la même collection.

#### 3. Internet des Objets (IoT)

**Le cas** : Des milliers de capteurs envoient des données toutes les secondes. Chaque capteur peut envoyer des données de structure différente (température, humidité, pression).

**Pourquoi MongoDB** : La capacité a gérer de gros volumes d'écriture et le schéma flexible s'adaptent bien aux données IoT.

#### 4. Catalogues de produits (e-commerce)

**Le cas** : Un site e-commerce vend des livres, des vetements et de l'electronique. Chaque catégorie a des attributs différents (auteur pour un livre, taille pour un vetement, resolution pour un écran).

**Pourquoi MongoDB** : Les documents peuvent avoir des champs différents selon la catégorie, sans colonnes nullables.

---

### MongoDB vs PostgreSQL : quand choisir quoi ?

**Définition** : MongoDB et PostgreSQL ne sont pas en competition directe. Ils répondent a des besoins différents. Le choix dépend de la nature de tes données et de tes besoins.

| Critère | PostgreSQL | MongoDB |
| ------- | ---------- | ------- |
| Structure des données | Fixe, schéma strict | Flexible, schéma libre |
| Relations entre données | Jointures SQL performantes | Imbrication ou `$lookup` |
| Transactions | ACID complet, multi-tables | ACID sur un document, multi-documents possible |
| Langage de requête | SQL standard | Requêtes JSON / MQL |
| Scalabilite | Verticale principalement | Horizontale (sharding) |
| Format natif | Lignes et colonnes | Documents JSON/BSON |
| Cas d'usage idéal | Données relationnelles, transactions complexes | Données hétérogènes, API REST, prototypage rapide |

**Quand choisir PostgreSQL** :

- Système bancaire ou comptable (transactions ACID critiques)
- Données fortement liees entre elles (utilisateurs, commandes, produits, factures)
- Requêtes analytiques complexes avec jointures sur de nombreuses tables
- Besoin d'intégrité référentielle stricte (clés étrangères)

**Quand choisir MongoDB** :

- API REST servant du JSON a un frontend
- Schéma qui evolue souvent (début de projet, prototypage)
- Données hétérogènes (catalogue multi-catégories)
- Gros volumes de données avec besoin de scalabilité horizontale
- Données naturellement imbriquées (articles avec commentaires)

<div class="diagram-design">
<p><a href="../../diagrams/17-mongodb-01-introduction-mongodb-1.html">MongoDB vs PostgreSQL : quand choisir quoi ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/17-mongodb-01-introduction-mongodb-1.html" title="MongoDB vs PostgreSQL : quand choisir quoi ?" style="width:100%;min-height:448px;border:0;background:transparent"></iframe>
</div>

---

## Étapes Pratiques

### Étape 1 : Comparer un schéma SQL et un document MongoDB

Pour bien comprendre la difference, compare ces deux representations des memes données.

**En SQL (PostgreSQL)** :

```sql
-- Creer la table des utilisateurs
CREATE TABLE utilisateurs (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    age INTEGER
);

-- Creer la table des adresses (relation 1-1)
CREATE TABLE adresses (
    id SERIAL PRIMARY KEY,
    utilisateur_id INTEGER REFERENCES utilisateurs(id),
    rue VARCHAR(200),
    ville VARCHAR(100),
    code_postal VARCHAR(10)
);

-- Creer la table des competences (relation N-N)
CREATE TABLE competences (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE utilisateur_competences (
    utilisateur_id INTEGER REFERENCES utilisateurs(id),
    competence_id INTEGER REFERENCES competences(id),
    PRIMARY KEY (utilisateur_id, competence_id)
);
```

Pour récupérer un utilisateur avec son adresse et ses compétences en SQL, il faut une requête avec deux jointures sur quatre tables.

**En MongoDB** :

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nom": "Alice Dupont",
  "email": "alice@example.com",
  "age": 28,
  "adresse": {
    "rue": "12 rue de la Paix",
    "ville": "Paris",
    "code_postal": "75002"
  },
  "competences": ["JavaScript", "Node.js", "MongoDB"]
}
```

En MongoDB, toutes les données sont dans un seul document. Une seule requête suffit pour tout récupérer.

---

### Étape 2 : Comprendre la structure d'une base MongoDB

Voici la hiérarchie d'une base MongoDB :

```text
Serveur MongoDB
└── Base de donnees "monapp"
    ├── Collection "utilisateurs"
    │   ├── Document { _id: 1, nom: "Alice", ... }
    │   ├── Document { _id: 2, nom: "Bob", ... }
    │   └── Document { _id: 3, nom: "Charlie", ... }
    ├── Collection "articles"
    │   ├── Document { _id: 1, titre: "Mon premier article", ... }
    │   └── Document { _id: 2, titre: "MongoDB en pratique", ... }
    └── Collection "commentaires"
        └── Document { _id: 1, contenu: "Super article !", ... }
```

**Points clés** :

- Un serveur MongoDB peut contenir plusieurs bases de données
- Une base de données contient des collections
- Une collection contient des documents
- Les collections ne sont pas créées explicitement : elles sont créées automatiquement quand tu inseres le premier document

---

### Étape 3 : Identifier le bon choix pour des cas concrets

Lis chaque scénario et détermine si MongoDB ou PostgreSQL est le meilleur choix.

**Scénario 1** : Un site de recettes de cuisine. Chaque recette a un titre, une liste d'ingrédients (avec quantités), des étapes de preparation, et des commentaires des utilisateurs.

**Réponse** : MongoDB. Les données sont naturellement imbriquées (ingrédients, étapes, commentaires dans la recette). Le schéma peut varier (certaines recettes ont une video, d'autres non).

**Scénario 2** : Un logiciel de comptabilité. Chaque facture est liee a un client, contient des lignes de produits, et doit être tracable (qui a modifie quoi et quand). Les calculs doivent être coherents à tout moment.

**Réponse** : PostgreSQL. L'intégrité référentielle et les transactions ACID sont essentielles pour la comptabilité.

**Scénario 3** : Une API pour une application mobile de suivi sportif. Chaque utilisateur enregistre des seances d'entrainement avec des exercices différents (course, musculation, natation), chacun ayant des métriques différentes.

**Réponse** : MongoDB. Les données de chaque type d'exercice ont une structure différente, et l'API sert du JSON.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `mongosh` | Lance le shell interactif MongoDB |
| `show dbs` | Liste les bases de données |
| `use nombase` | Se connecter a une base (la créé si elle n'existe pas) |
| `show collections` | Liste les collections de la base courante |
| `db.collection.find()` | Liste les documents d'une collection |
| `db.collection.insertOne({})` | Insere un document |

---

## Pièges Fréquents

### Piège 1 : Vouloir utiliser MongoDB pour tout

⚠️ **Problème** : Tu choisis MongoDB par défaut pour tous tes projets, même ceux avec des relations complexes entre les données.

✅ **Solution** : Analyse tes données avant de choisir. Si tes données ont des relations complexes (un utilisateur a plusieurs commandes, chaque commande a plusieurs produits, chaque produit a un fournisseur), PostgreSQL sera plus adapte. MongoDB est idéal quand tes données sont naturellement imbriquées ou hétérogènes.

---

### Piège 2 : Confondre "pas de schéma" et "pas de structure"

⚠️ **Problème** : Parce que MongoDB n'impose pas de schéma, tu inseres des documents avec des noms de champs différents pour la même donnée (`nom`, `name`, `prenom`, `firstName`).

✅ **Solution** : MongoDB n'impose pas de schéma, mais tu dois quand même définir une structure coherente dans ton application. En pratique, tu utiliseras Mongoose (fiche 07) pour définir des schémas au niveau de l'application.

```json
// Mauvais : noms de champs incoherents
{ "nom": "Alice" }
{ "name": "Bob" }
{ "prenom": "Charlie", "lastName": "Dupont" }

// Bon : structure coherente
{ "nom": "Alice", "prenom": "Dupont" }
{ "nom": "Bob", "prenom": "Martin" }
{ "nom": "Charlie", "prenom": "Durand" }
```

---

### Piège 3 : Tout imbriquer dans un seul document

⚠️ **Problème** : Tu imbriques toutes les données dans un seul document. Par exemple, un document utilisateur qui contient tous ses articles, tous les commentaires de chaque article, et les profils de tous les utilisateurs qui ont commente.

✅ **Solution** : Un document MongoDB a une limite de taille de 16 Mo. Si un document grossit de maniere illimitée (liste de commentaires qui grandit indéfiniment), il faut créer une collection séparée. La règle : imbriquer les données qui sont toujours lues ensemble, et séparer les données qui grossissent de maniere illimitée.

---

### Piège 4 : Ignorer les index

⚠️ **Problème** : Tu ne créés pas d'index et tes requêtes deviennent lentes sur les grosses collections.

✅ **Solution** : Comme pour PostgreSQL, MongoDB a besoin d'index pour rechercher efficacement dans les documents. On abordera ce sujet en détail dans la fiche 06.

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est NoSQL en une phrase
- [ ] Je sais ce qu'est un document MongoDB et une collection
- [ ] Je connais la correspondance entre les termes SQL et MongoDB (table/collection, ligne/document, colonne/champ)
- [ ] Je sais ce qu'est BSON et pourquoi MongoDB l'utilise
- [ ] Je peux citer au moins 3 cas d'usage adaptes a MongoDB
- [ ] Je sais quand choisir MongoDB plutôt que PostgreSQL (et inversement)
- [ ] Je comprends le concept de schéma flexible

---

## Exercice Pratique

**Énoncé** : Modelise les données d'une application de gestion de bibliothèque en MongoDB.

**Indications** :

- Créé un document JSON pour un livre avec : titre, auteur (nom et prénom), date de publication, ISBN, catégorie, resume, et une liste d'avis de lecteurs (chaque avis a un auteur, une note sur 5 et un commentaire)
- Créé un document JSON pour un emprunteur avec : nom, prénom, email, date d'inscription, et une liste des emprunts en cours (chaque emprunt a un titre de livre, une date d'emprunt et une date de retour prévue)
- Identifie quelles données tu imbriques et lesquelles tu mettrais dans une collection séparée

**Résultat attendu** : Deux documents JSON bien structures avec des sous-documents et des tableaux.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Document livre** :

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "titre": "Le Petit Prince",
  "auteur": {
    "prenom": "Antoine",
    "nom": "de Saint-Exupery"
  },
  "date_publication": "1943-04-06",
  "isbn": "978-2-07-040850-4",
  "categorie": "Fiction",
  "resume": "Un aviateur echoue dans le desert rencontre un petit garcon venu d'une autre planete.",
  "avis": [
    {
      "auteur": "Marie",
      "note": 5,
      "commentaire": "Un chef-d'oeuvre intemporel."
    },
    {
      "auteur": "Paul",
      "note": 4,
      "commentaire": "Tres poetique, a relire plusieurs fois."
    }
  ]
}
```

**Document emprunteur** :

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "prenom": "Alice",
  "nom": "Dupont",
  "email": "alice@example.com",
  "date_inscription": "2025-01-15",
  "emprunts_en_cours": [
    {
      "livre_id": "507f1f77bcf86cd799439011",
      "titre": "Le Petit Prince",
      "date_emprunt": "2025-03-01",
      "date_retour_prevue": "2025-03-22"
    }
  ]
}
```

**Pourquoi cette structure** :

- Les **avis** sont imbriques dans le document livre car ils sont toujours lus avec le livre. La liste peut grandir, mais un livre a rarement plus de quelques centaines d'avis (loin de la limite de 16 Mo).
- Les **emprunts en cours** sont imbriques dans l'emprunteur car un utilisateur a rarement plus de 5-10 emprunts en cours. On stocke le `titre` en plus du `livre_id` pour éviter une requête supplémentaire lors de l'affichage.
- Si on voulait un **historique complet** de tous les emprunts (qui peut être illimité), on creerait une collection séparée `emprunts` avec un champ `emprunteur_id`.

---

## Navigation

→ Fiche suivante : **[Installation et mongosh](02-installation-mongosh.md)**
