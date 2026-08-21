---
tags:
  - MongoDB
  - Débutant
  - Pratique
description: "Maîtriser les quatre opérations fondamentales de MongoDB : créer, lire, mettre a jour et supprimer des documents"
estimated_time: "75 min"
fiche_number: 3
total_fiches: 8
cursus: "MongoDB"
id: "web.mongodb.crud-operations"
course_id: "web.mongodb"
content_type: "lesson"
order: 3
---

# 03 - Opérations CRUD

> **En bref** : À la fin de cette fiche, tu maitriseras les quatre opérations fondamentales de MongoDB - Create, Read, Update, Delete - avec les méthodes insertOne, insertMany, find, updateOne, updateMany, deleteOne et deleteMany. Lecture estimée : 75 min.

## Prérequis

- [Fiche précédente : Installation et mongosh](02-installation-mongosh.md)
- Un conteneur MongoDB qui tourne dans Docker
- Savoir se connecter avec mongosh

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| MongoDB | 8.x |
| mongosh | 2.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras insérer un ou plusieurs documents, les rechercher avec des filtres, les mettre a jour (partiellement ou complètement) et les supprimer.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que CRUD ?

**Définition** : CRUD est un acronyme pour les quatre opérations de base sur les données : Create (créer), Read (lire), Update (mettre a jour), Delete (supprimer). Toute application qui manipule des données utilise ces quatre opérations.

**Correspondance CRUD / MongoDB / SQL** :

| CRUD | MongoDB | SQL |
| ---- | ------- | --- |
| Create | `insertOne()`, `insertMany()` | `INSERT INTO` |
| Read | `find()`, `findOne()` | `SELECT` |
| Update | `updateOne()`, `updateMany()`, `replaceOne()` | `UPDATE` |
| Delete | `deleteOne()`, `deleteMany()` | `DELETE FROM` |

**Analogie concrète** : CRUD c'est comme gérer un carnet d'adresses. Tu peux ajouter un contact (Create), chercher un contact (Read), modifier son numéro de telephone (Update) ou rayer un contact (Delete).

---

### Les filtres MongoDB

**Définition** : Un filtre est un objet JSON qui décrit les critères de recherche. Il se place en premier argument des méthodes `find()`, `updateOne()`, `deleteOne()`, etc.

**Le problème que les filtres résolvent** :

Sans filtres, voici les problèmes rencontrés :

1. **Récupérer tout** : sans filtre, `find()` retourne tous les documents. Sur une collection de millions de documents, c'est inutilisable.
2. **Modifier le mauvais document** : sans filtre précis, `updateOne()` pourrait modifier un document que tu ne voulais pas changer.
3. **Suppression accidentelle** : sans filtre, `deleteMany({})` supprime tous les documents de la collection.

**Comment les filtres résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Récupérer tout | Le filtre sélectionne uniquement les documents correspondants |
| Modifier le mauvais document | Le filtre cible précisément le document a modifier |
| Suppression accidentelle | Le filtre limite la suppression aux documents voulus |

**Syntaxe des filtres** :

```javascript
// Filtre vide : tous les documents
{}

// Filtre simple : un champ egal a une valeur
{ nom: "Alice" }

// Filtre sur plusieurs champs (ET logique)
{ nom: "Alice", ville: "Paris" }

// Filtre sur un sous-document
{ "adresse.ville": "Lyon" }

// Filtre avec operateur
{ age: { $gt: 25 } }
```

**Point important** : pour accéder a un champ dans un sous-document, utilise la notation a points (`"adresse.ville"`) entre guillemets.

---

### Les opérateurs de mise à jour

**Définition** : Les opérateurs de mise à jour indiquent a MongoDB comment modifier un document. Le plus courant est `$set` qui modifie la valeur d'un champ.

**Principaux opérateurs** :

| Opérateur | Action | Exemple |
| --------- | ------ | ------- |
| `$set` | Modifie la valeur d'un champ (ou le créé s'il n'existe pas) | `{ $set: { age: 30 } }` |
| `$unset` | Supprime un champ du document | `{ $unset: { age: "" } }` |
| `$inc` | Incrémente la valeur d'un champ numérique | `{ $inc: { age: 1 } }` |
| `$push` | Ajoute un élément à un tableau | `{ $push: { competences: "Go" } }` |
| `$pull` | Retire un élément d'un tableau | `{ $pull: { competences: "Go" } }` |
| `$rename` | Renomme un champ | `{ $rename: { nom: "name" } }` |

---

## Étapes Pratiques

### Étape 1 : Préparer l'environnement

Lance le conteneur MongoDB et connecte-toi :

```bash
# Lance MongoDB (si pas deja en cours)
docker run --name mongo-crud -d -p 27017:27017 -v mongo-crud-data:/data/db mongo:8

# Connecte-toi avec mongosh
docker exec -it mongo-crud mongosh
```

```text
// Cree et bascule vers la base de test
use boutique
```

**Résultat attendu** :

```text
switched to db boutique
```

---

### Étape 2 : Create - Insérer un document (insertOne)

```javascript
// Insere un seul produit dans la collection "produits"
db.produits.insertOne({
  nom: "Clavier mecanique",
  marque: "Keychron",
  prix: 89.99,
  stock: 45,
  categorie: "Peripheriques",
  caracteristiques: {
    type: "mecanique",
    switches: "Gateron Brown",
    retroeclairage: true
  },
  tags: ["clavier", "mecanique", "usb-c"]
})
```

**Résultat attendu** :

```text
{
  acknowledged: true,
  insertedId: ObjectId('...')
}
```

---

### Étape 3 : Create - Insérer plusieurs documents (insertMany)

```javascript
// Insere plusieurs produits en une seule operation
db.produits.insertMany([
  {
    nom: "Souris ergonomique",
    marque: "Logitech",
    prix: 59.99,
    stock: 120,
    categorie: "Peripheriques",
    caracteristiques: {
      type: "sans-fil",
      capteur: "optique",
      dpi: 4000
    },
    tags: ["souris", "ergonomique", "sans-fil"]
  },
  {
    nom: "Ecran 27 pouces",
    marque: "Dell",
    prix: 349.99,
    stock: 15,
    categorie: "Ecrans",
    caracteristiques: {
      taille: "27 pouces",
      resolution: "2560x1440",
      dalle: "IPS"
    },
    tags: ["ecran", "27-pouces", "qhd"]
  },
  {
    nom: "Casque audio",
    marque: "Sony",
    prix: 249.99,
    stock: 30,
    categorie: "Audio",
    caracteristiques: {
      type: "circum-aural",
      reduction_bruit: true,
      autonomie: "30h"
    },
    tags: ["casque", "sans-fil", "anc"]
  },
  {
    nom: "Webcam HD",
    marque: "Logitech",
    prix: 79.99,
    stock: 0,
    categorie: "Peripheriques",
    caracteristiques: {
      resolution: "1080p",
      fps: 60,
      autofocus: true
    },
    tags: ["webcam", "hd", "streaming"]
  },
  {
    nom: "Clavier compact",
    marque: "Keychron",
    prix: 69.99,
    stock: 80,
    categorie: "Peripheriques",
    caracteristiques: {
      type: "mecanique",
      switches: "Gateron Red",
      retroeclairage: true
    },
    tags: ["clavier", "mecanique", "compact"]
  }
])
```

**Résultat attendu** :

```text
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('...'),
    '1': ObjectId('...'),
    '2': ObjectId('...'),
    '3': ObjectId('...'),
    '4': ObjectId('...')
  }
}
```

```javascript
// Verifie le nombre total de documents
db.produits.countDocuments()
```

**Résultat attendu** :

```text
6
```

---

### Étape 4 : Read - Lire tous les documents (find)

```javascript
// Retourne tous les documents de la collection
db.produits.find()
```

Cette commande affiche tous les 6 produits. Par défaut, mongosh affiche les documents par lots de 20.

---

### Étape 5 : Read - Lire avec un filtre

```javascript
// Trouve tous les produits de la marque Logitech
db.produits.find({ marque: "Logitech" })
```

**Résultat attendu** : 2 documents (souris ergonomique et webcam HD).

```javascript
// Trouve les produits de la categorie "Peripheriques"
db.produits.find({ categorie: "Peripheriques" })
```

**Résultat attendu** : 4 documents.

```javascript
// Trouve les produits a moins de 80 euros
db.produits.find({ prix: { $lt: 80 } })
```

**Résultat attendu** : 3 documents (souris, webcam, clavier compact).

```javascript
// Filtre sur un sous-document : produits avec retroeclairage
db.produits.find({ "caracteristiques.retroeclairage": true })
```

**Résultat attendu** : 2 documents (les deux claviers).

---

### Étape 6 : Read - Lire un seul document (findOne)

```javascript
// Retourne le premier document qui correspond au filtre
db.produits.findOne({ marque: "Sony" })
```

**Résultat attendu** :

```text
{
  _id: ObjectId('...'),
  nom: 'Casque audio',
  marque: 'Sony',
  prix: 249.99,
  stock: 30,
  categorie: 'Audio',
  caracteristiques: {
    type: 'circum-aural',
    reduction_bruit: true,
    autonomie: '30h'
  },
  tags: [ 'casque', 'sans-fil', 'anc' ]
}
```

**Difference entre find et findOne** :

| `find()` | `findOne()` |
| -------- | ----------- |
| Retourne un curseur (liste de documents) | Retourne un seul document (ou `null`) |
| Peut retourner 0 a N documents | Retourne le premier qui correspond |
| Supporte `.sort()`, `.limit()`, `.skip()` | Pas de chainable |

---

### Étape 7 : Read - Filtres avec opérateurs de comparaison

```javascript
// Produits dont le prix est superieur ou egal a 100
db.produits.find({ prix: { $gte: 100 } })
```

**Résultat attendu** : 2 documents (écran et casque).

```javascript
// Produits dont le stock est egal a 0 (en rupture)
db.produits.find({ stock: { $eq: 0 } })
```

**Résultat attendu** : 1 document (webcam).

```javascript
// Produits dont le prix est entre 50 et 100 (inclus)
db.produits.find({
  prix: { $gte: 50, $lte: 100 }
})
```

**Résultat attendu** : 4 documents.

**Resume des opérateurs de comparaison** :

| Opérateur | Signification | Exemple |
| --------- | ------------- | ------- |
| `$eq` | Egal a | `{ prix: { $eq: 89.99 } }` |
| `$ne` | Différent de | `{ marque: { $ne: "Sony" } }` |
| `$gt` | Strictement supérieur à | `{ prix: { $gt: 100 } }` |
| `$gte` | Supérieur ou egal a | `{ prix: { $gte: 100 } }` |
| `$lt` | Strictement inférieur a | `{ stock: { $lt: 20 } }` |
| `$lte` | Inférieur ou egal a | `{ stock: { $lte: 20 } }` |
| `$in` | Dans une liste de valeurs | `{ marque: { $in: ["Sony", "Dell"] } }` |
| `$nin` | Pas dans une liste | `{ marque: { $nin: ["Sony"] } }` |

---

### Étape 8 : Update - Modifier un document (updateOne)

```javascript
// Modifie le prix du casque audio
db.produits.updateOne(
  { nom: "Casque audio" },           // Filtre : quel document modifier
  { $set: { prix: 229.99 } }         // Mise a jour : quoi modifier
)
```

**Résultat attendu** :

```text
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

- `matchedCount: 1` : un document correspond au filtre
- `modifiedCount: 1` : un document a été modifie

```javascript
// Verifie la modification
db.produits.findOne({ nom: "Casque audio" })
```

Le prix est maintenant 229.99.

---

### Étape 9 : Update - Ajouter un champ et incrementer

```javascript
// Ajoute un champ "promotion" au casque audio
db.produits.updateOne(
  { nom: "Casque audio" },
  { $set: { promotion: true, prix_avant: 249.99 } }
)
```

```javascript
// Incremente le stock de la webcam de 50 unites
db.produits.updateOne(
  { nom: "Webcam HD" },
  { $inc: { stock: 50 } }
)
```

```javascript
// Verifie : le stock est passe de 0 a 50
db.produits.findOne({ nom: "Webcam HD" })
```

---

### Étape 10 : Update - Modifier un tableau

```javascript
// Ajoute un tag au casque audio
db.produits.updateOne(
  { nom: "Casque audio" },
  { $push: { tags: "promotion" } }
)
```

```javascript
// Verifie : le tableau tags contient maintenant "promotion"
db.produits.findOne({ nom: "Casque audio" })
```

```javascript
// Retire le tag "promotion" du casque
db.produits.updateOne(
  { nom: "Casque audio" },
  { $pull: { tags: "promotion" } }
)
```

---

### Étape 11 : Update - Modifier plusieurs documents (updateMany)

```javascript
// Augmente le stock de 10 pour tous les produits Keychron
db.produits.updateMany(
  { marque: "Keychron" },
  { $inc: { stock: 10 } }
)
```

**Résultat attendu** :

```text
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 2,
  modifiedCount: 2,
  upsertedCount: 0
}
```

2 documents ont été modifies (les deux claviers Keychron).

---

### Étape 12 : Update - Remplacer un document (replaceOne)

```javascript
// Remplace entierement un document (attention : tous les champs non specifies sont perdus)
db.produits.replaceOne(
  { nom: "Webcam HD" },
  {
    nom: "Webcam Pro",
    marque: "Logitech",
    prix: 129.99,
    stock: 50,
    categorie: "Peripheriques",
    caracteristiques: {
      resolution: "4K",
      fps: 60,
      autofocus: true,
      champ_vision: "90 degres"
    },
    tags: ["webcam", "4k", "streaming", "pro"]
  }
)
```

**Difference entre updateOne et replaceOne** :

| `updateOne` avec `$set` | `replaceOne` |
| ----------------------- | ------------ |
| Modifie uniquement les champs specifies | Remplace le document entier |
| Les autres champs sont conserves | Les champs non specifies disparaissent |
| Utilise des opérateurs (`$set`, `$inc`) | Prend un document complet |

---

### Étape 13 : Delete - Supprimer un document (deleteOne)

```javascript
// Supprime le casque audio
db.produits.deleteOne({ nom: "Casque audio" })
```

**Résultat attendu** :

```text
{
  acknowledged: true,
  deletedCount: 1
}
```

```javascript
// Verifie : le casque n'existe plus
db.produits.findOne({ nom: "Casque audio" })
```

**Résultat attendu** :

```text
null
```

---

### Étape 14 : Delete - Supprimer plusieurs documents (deleteMany)

```javascript
// Supprime tous les produits dont le stock est inferieur a 20
db.produits.deleteMany({ stock: { $lt: 20 } })
```

**Résultat attendu** :

```text
{
  acknowledged: true,
  deletedCount: 1
}
```

(L'écran avec 15 en stock est supprime.)

```javascript
// Verifie le nombre de documents restants
db.produits.countDocuments()
```

**Résultat attendu** :

```text
4
```

---

### Étape 15 : Nettoyage

```javascript
// Quitte mongosh
exit
```

```bash
# Arrete et supprime le conteneur
docker rm -f mongo-crud

# Supprime le volume
docker volume rm mongo-crud-data
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `db.col.insertOne({doc})` | Insere un document |
| `db.col.insertMany([docs])` | Insere plusieurs documents |
| `db.col.find({filtre})` | Recherche avec filtre |
| `db.col.findOne({filtre})` | Retourne un seul document |
| `db.col.updateOne({filtre}, {$set: {champ: val}})` | Modifie un document |
| `db.col.updateMany({filtre}, {$set: {champ: val}})` | Modifie plusieurs documents |
| `db.col.replaceOne({filtre}, {doc})` | Remplace un document entier |
| `db.col.deleteOne({filtre})` | Supprime un document |
| `db.col.deleteMany({filtre})` | Supprime plusieurs documents |
| `db.col.countDocuments({filtre})` | Compte les documents correspondant au filtre |

---

## Pièges Fréquents

### Piège 1 : Oublier l'opérateur `$set` dans updateOne

⚠️ **Problème** : Tu écris `updateOne({nom: "Alice"}, {age: 30})` sans `$set`. Depuis MongoDB 5, `updateOne` exige un opérateur de mise à jour (`$set`, `$unset`, `$inc`, etc.). Un document nu provoque une erreur (`the update operation document must contain atomic operators`). Pour remplacer tout le document, utilise `replaceOne`.

✅ **Solution** : Utilise toujours `$set` (ou un autre opérateur) avec `updateOne` :

```javascript
// Mauvais : MongoDB 8 refuse un document sans opérateur
// db.utilisateurs.updateOne({ nom: "Alice" }, { age: 30 })
// MongoServerError: the update operation document must contain atomic operators

// Bon : modifie uniquement le champ age
db.utilisateurs.updateOne({ nom: "Alice" }, { $set: { age: 30 } })

// Remplacement complet du document : replaceOne
db.utilisateurs.replaceOne({ nom: "Alice" }, { nom: "Alice", age: 30 })
```

---

### Piège 2 : deleteMany avec un filtre vide

⚠️ **Problème** : Tu tapes `db.produits.deleteMany({})`. Le filtre vide `{}` correspond a tous les documents. La collection est entièrement videe.

✅ **Solution** : Vérifie toujours ton filtre avant un `deleteMany`. Teste-le d'abord avec `find` pour voir quels documents correspondent :

```javascript
// Etape 1 : verifie quels documents seront supprimes
db.produits.find({ stock: 0 })

// Etape 2 : supprime uniquement si le resultat est correct
db.produits.deleteMany({ stock: 0 })
```

---

### Piège 3 : Confondre updateOne et updateMany

⚠️ **Problème** : Tu utilises `updateOne` en croyant modifier tous les documents correspondant au filtre. Seul le premier est modifie.

✅ **Solution** : `updateOne` ne modifie que le premier document trouve. Pour modifier tous les documents correspondants, utilise `updateMany` :

```javascript
// Ne modifie qu'UN seul produit Logitech
db.produits.updateOne({ marque: "Logitech" }, { $set: { promotion: true } })

// Modifie TOUS les produits Logitech
db.produits.updateMany({ marque: "Logitech" }, { $set: { promotion: true } })
```

---

### Piège 4 : Notation a points sans guillemets

⚠️ **Problème** : Tu écris `{ adresse.ville: "Paris" }` sans guillemets. MongoDB renvoie une erreur de syntaxe.

✅ **Solution** : La notation a points doit toujours être entre guillemets :

```text
// Mauvais : erreur de syntaxe
db.utilisateurs.find({ adresse.ville: "Paris" })

// Bon : guillemets obligatoires
db.utilisateurs.find({ "adresse.ville": "Paris" })
```

---

## Checklist de Validation

- [ ] Je sais insérer un document avec `insertOne`
- [ ] Je sais insérer plusieurs documents avec `insertMany`
- [ ] Je sais rechercher des documents avec `find` et `findOne`
- [ ] Je sais utiliser des filtres simples et avec opérateurs de comparaison
- [ ] Je sais accéder aux sous-documents avec la notation a points
- [ ] Je sais modifier un document avec `updateOne` et `$set`
- [ ] Je sais utiliser `$inc`, `$push` et `$pull`
- [ ] Je connais la différence entre `updateOne` et `replaceOne`
- [ ] Je sais supprimer des documents avec `deleteOne` et `deleteMany`

---

## Exercice Pratique

**Énoncé** : Gère un catalogue de films dans MongoDB.

**Indications** :

- Créé une base `cinema` avec une collection `films`
- Insere 5 films avec : titre, realisateur (nom et prénom), année, genre (tableau), note (sur 10), et un boolen `vu`
- Recherche tous les films d'un genre spécifique
- Recherche les films avec une note supérieure à 8
- Modifie la note d'un film
- Marque tous les films comme "vus" (`vu: true`)
- Ajoute un genre supplémentaire a un film
- Supprime les films avec une note inférieure à 5
- Vérifie le nombre de films restants

**Résultat attendu** : Tu as manipule toutes les opérations CRUD sur la collection `films`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
docker run --name mongo-cinema -d -p 27017:27017 mongo:8
docker exec -it mongo-cinema mongosh
```

```text
use cinema

// Insere 5 films
db.films.insertMany([
  {
    titre: "Inception",
    realisateur: { prenom: "Christopher", nom: "Nolan" },
    annee: 2010,
    genre: ["Science-fiction", "Thriller"],
    note: 9,
    vu: true
  },
  {
    titre: "Parasite",
    realisateur: { prenom: "Bong", nom: "Joon-ho" },
    annee: 2019,
    genre: ["Thriller", "Drame"],
    note: 8.5,
    vu: false
  },
  {
    titre: "Le Fabuleux Destin d'Amelie Poulain",
    realisateur: { prenom: "Jean-Pierre", nom: "Jeunet" },
    annee: 2001,
    genre: ["Comedie", "Romance"],
    note: 8,
    vu: true
  },
  {
    titre: "Sharknado",
    realisateur: { prenom: "Anthony", nom: "Ferrante" },
    annee: 2013,
    genre: ["Horreur", "Science-fiction"],
    note: 3,
    vu: false
  },
  {
    titre: "Interstellar",
    realisateur: { prenom: "Christopher", nom: "Nolan" },
    annee: 2014,
    genre: ["Science-fiction", "Drame"],
    note: 9.2,
    vu: false
  }
])

// Recherche les films de science-fiction
db.films.find({ genre: "Science-fiction" })
// 3 films : Inception, Sharknado, Interstellar

// Recherche les films avec une note > 8
db.films.find({ note: { $gt: 8 } })
// 3 films : Inception (9), Parasite (8.5), Interstellar (9.2)

// Modifie la note de Parasite
db.films.updateOne(
  { titre: "Parasite" },
  { $set: { note: 9 } }
)

// Marque tous les films comme vus
db.films.updateMany(
  {},
  { $set: { vu: true } }
)

// Ajoute le genre "Aventure" a Interstellar
db.films.updateOne(
  { titre: "Interstellar" },
  { $push: { genre: "Aventure" } }
)

// Supprime les films avec une note < 5
db.films.deleteMany({ note: { $lt: 5 } })
// 1 film supprime (Sharknado)

// Verifie le nombre restant
db.films.countDocuments()
// 4

exit
```

```bash
docker rm -f mongo-cinema
```

---

## Navigation

← Fiche précédente : **[Installation et mongosh](02-installation-mongosh.md)**

→ Fiche suivante : **[Requêtes avancées](04-requetes-avancees.md)**
