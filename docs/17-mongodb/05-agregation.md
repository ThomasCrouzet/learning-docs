---
tags:
  - MongoDB
  - Intermédiaire
  - Pratique
description: "Maîtriser le pipeline d'agrégation MongoDB avec $match, $group, $sort, $project, $lookup et $unwind"
estimated_time: "75 min"
fiche_number: 5
total_fiches: 8
cursus: "MongoDB"
id: "web.mongodb.agregation"
course_id: "web.mongodb"
content_type: "lesson"
order: 5
---

# 05 - Pipeline d'agrégation

> **En bref** : À la fin de cette fiche, tu sauras construire des pipelines d'agrégation MongoDB pour transformer, grouper et analyser tes données, y compris des jointures entre collections avec `$lookup`. Lecture estimée : 75 min.

## Prérequis

- [Fiche précédente : Requêtes avancées](04-requetes-avancees.md)
- Savoir utiliser `find()` avec des filtres, des projections et du tri

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| MongoDB | 8.x |
| mongosh | 2.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser le pipeline d'agrégation pour filtrer, grouper, trier, projeter et joindre des données entre collections.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le pipeline d'agrégation ?

**Définition** : Le pipeline d'agrégation est une suite d'étapes (stages) qui transforment les documents les uns après les autres, comme une chaîne de montage. Chaque étape reçoit les documents de l'étape précédente, les transforme, et passe le résultat a l'étape suivante.

**Le problème que le pipeline d'agrégation résout** :

Sans pipeline d'agrégation, voici les problèmes rencontrés :

1. **Calculs impossibles avec find** : `find()` retourne des documents bruts. Tu ne peux pas calculer une moyenne, une somme ou un comptage par catégorie.
2. **Transformation cote client** : sans agrégation, tu dois récupérer tous les documents et faire les calculs dans ton application Node.js. C'est lent et consomme de la mémoire.
3. **Jointures impossibles** : `find()` ne peut pas combiner des données de deux collections différentes.

**Comment le pipeline d'agrégation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Calculs impossibles | `$group` avec `$sum`, `$avg`, `$min`, `$max`, `$count` |
| Transformation cote client | Les calculs sont faits par MongoDB, sur le serveur |
| Jointures impossibles | `$lookup` joint des documents de collections différentes |

**Analogie concrète** : Imagine une usine de tri postal. Les lettres arrivent en vrac (les documents). La première étape filtre les lettres par region (`$match`). La deuxième étape les regroupe par ville (`$group`). La troisième étape les trie par ordre alphabetique (`$sort`). Chaque étape fait un seul travail, et le résultat d'une étape passe a la suivante.

**Ce que le pipeline d'agrégation n'est PAS** :

- Ce n'est pas un remplacement de `find()`. Pour des recherches simples, `find()` est plus rapide et plus lisible.
- Ce n'est pas du SQL. La syntaxe est complètement différente, même si les concepts (GROUP BY, JOIN, ORDER BY) sont similaires.

**Syntaxe** :

```text
db.collection.aggregate([
  { $stage1: { ... } },   // Etape 1
  { $stage2: { ... } },   // Etape 2
  { $stage3: { ... } }    // Etape 3
])
```

---

### Les étapes principales du pipeline

**Définition** : Chaque étape est un opérateur qui commence par `$`. Voici les étapes les plus courantes.

| Étape | Equivalent SQL | Description |
| ----- | -------------- | ----------- |
| `$match` | `WHERE` | Filtre les documents |
| `$group` | `GROUP BY` | Regroupe et calcule des agregats |
| `$sort` | `ORDER BY` | Trie les résultats |
| `$project` | `SELECT` | Choisit ou transforme les champs |
| `$limit` | `LIMIT` | Limite le nombre de résultats |
| `$skip` | `OFFSET` | Saute les premiers résultats |
| `$lookup` | `JOIN` | Joint des données d'une autre collection |
| `$unwind` | - | Deconstruit un tableau en documents individuels |
| `$count` | `COUNT(*)` | Compte le nombre de documents |
| `$addFields` | - | Ajoute des champs calcules |

---

### Les accumulateurs de `$group`

**Définition** : Les accumulateurs sont des fonctions utilisées dans l'étape `$group` pour calculer des valeurs agregees.

| Accumulateur | Description | Exemple |
| ------------ | ----------- | ------- |
| `$sum` | Somme des valeurs | `{ $sum: "$prix" }` |
| `$avg` | Moyenne des valeurs | `{ $avg: "$note" }` |
| `$min` | Valeur minimale | `{ $min: "$prix" }` |
| `$max` | Valeur maximale | `{ $max: "$prix" }` |
| `$count` | Nombre de documents | `{ $count: {} }` |
| `$push` | Collecte les valeurs dans un tableau | `{ $push: "$nom" }` |
| `$first` | Première valeur du groupe | `{ $first: "$nom" }` |
| `$last` | Dernière valeur du groupe | `{ $last: "$nom" }` |

**Note** : le `$` devant un nom de champ (`"$prix"`) signifie "la valeur du champ prix du document". C'est une référence au champ.

---

## Étapes Pratiques

### Étape 1 : Préparer les données de test

```bash
docker run --name mongo-agreg -d -p 27017:27017 mongo:8
docker exec -it mongo-agreg mongosh
```

```text
use ecommerce

// Collection de commandes
db.commandes.insertMany([
  {
    client: "Alice",
    produit: "Laptop",
    categorie: "Informatique",
    prix: 1200,
    quantite: 1,
    date: new Date("2025-01-15"),
    statut: "livree"
  },
  {
    client: "Bob",
    produit: "Clavier",
    categorie: "Informatique",
    prix: 89,
    quantite: 2,
    date: new Date("2025-01-20"),
    statut: "livree"
  },
  {
    client: "Alice",
    produit: "Casque",
    categorie: "Audio",
    prix: 250,
    quantite: 1,
    date: new Date("2025-02-01"),
    statut: "livree"
  },
  {
    client: "Charlie",
    produit: "Ecran",
    categorie: "Informatique",
    prix: 450,
    quantite: 1,
    date: new Date("2025-02-10"),
    statut: "en_cours"
  },
  {
    client: "Bob",
    produit: "Souris",
    categorie: "Informatique",
    prix: 59,
    quantite: 3,
    date: new Date("2025-02-15"),
    statut: "livree"
  },
  {
    client: "Alice",
    produit: "Enceinte",
    categorie: "Audio",
    prix: 180,
    quantite: 1,
    date: new Date("2025-03-01"),
    statut: "en_cours"
  },
  {
    client: "Diana",
    produit: "Tablette",
    categorie: "Informatique",
    prix: 599,
    quantite: 1,
    date: new Date("2025-03-05"),
    statut: "annulee"
  },
  {
    client: "Charlie",
    produit: "Microphone",
    categorie: "Audio",
    prix: 150,
    quantite: 2,
    date: new Date("2025-03-10"),
    statut: "livree"
  },
  {
    client: "Bob",
    produit: "Webcam",
    categorie: "Informatique",
    prix: 120,
    quantite: 1,
    date: new Date("2025-03-15"),
    statut: "livree"
  },
  {
    client: "Alice",
    produit: "Ecouteurs",
    categorie: "Audio",
    prix: 79,
    quantite: 1,
    date: new Date("2025-03-20"),
    statut: "livree"
  }
])
```

---

### Étape 2 : `$match` - Filtrer les documents

```javascript
// Filtrer les commandes livrees
db.commandes.aggregate([
  { $match: { statut: "livree" } }
])
```

**Résultat attendu** : 7 documents (toutes les commandes avec le statut "livree").

`$match` fonctionne exactement comme le filtre de `find()`. Utilise les memes opérateurs (`$gt`, `$in`, `$regex`, etc.).

---

### Étape 3 : `$group` - Regrouper et calculer

```javascript
// Nombre de commandes par client
db.commandes.aggregate([
  {
    $group: {
      _id: "$client",          // Grouper par le champ "client"
      nombre_commandes: { $count: {} }  // Compter les documents par groupe
    }
  }
])
```

**Résultat attendu** :

```text
[
  { _id: 'Diana', nombre_commandes: 1 },
  { _id: 'Charlie', nombre_commandes: 2 },
  { _id: 'Bob', nombre_commandes: 3 },
  { _id: 'Alice', nombre_commandes: 4 }
]
```

**Explication** : `_id: "$client"` signifie "créé un groupe pour chaque valeur unique du champ client". Le `$` devant `client` indique que c'est une référence a un champ du document.

---

### Étape 4 : `$group` - Somme et moyenne

```javascript
// Chiffre d'affaires total et prix moyen par categorie
db.commandes.aggregate([
  {
    $group: {
      _id: "$categorie",
      chiffre_affaires: { $sum: { $multiply: ["$prix", "$quantite"] } },
      prix_moyen: { $avg: "$prix" },
      nb_commandes: { $count: {} }
    }
  }
])
```

**Résultat attendu** :

```text
[
  {
    _id: 'Audio',
    chiffre_affaires: 809,
    prix_moyen: 164.75,
    nb_commandes: 4
  },
  {
    _id: 'Informatique',
    chiffre_affaires: 2724,
    prix_moyen: 419.5,
    nb_commandes: 6
  }
]
```

`$multiply: ["$prix", "$quantite"]` multiplie le prix par la quantité pour chaque document avant de faire la somme.

---

### Étape 5 : Combiner `$match`, `$group` et `$sort`

```javascript
// Top des clients par montant total depense (commandes livrees uniquement)
db.commandes.aggregate([
  // Etape 1 : filtrer les commandes livrees
  { $match: { statut: "livree" } },

  // Etape 2 : grouper par client et calculer le total
  {
    $group: {
      _id: "$client",
      total_depense: { $sum: { $multiply: ["$prix", "$quantite"] } },
      nb_commandes: { $count: {} }
    }
  },

  // Etape 3 : trier par total decroissant
  { $sort: { total_depense: -1 } }
])
```

**Résultat attendu** :

```text
[
  { _id: 'Alice', total_depense: 1529, nb_commandes: 3 },
  { _id: 'Bob', total_depense: 475, nb_commandes: 3 },
  { _id: 'Charlie', total_depense: 300, nb_commandes: 1 }
]
```

---

### Étape 6 : `$project` - Transformer les champs

```javascript
// Reformater les resultats du pipeline precedent
db.commandes.aggregate([
  { $match: { statut: "livree" } },
  {
    $group: {
      _id: "$client",
      total_depense: { $sum: { $multiply: ["$prix", "$quantite"] } },
      nb_commandes: { $count: {} }
    }
  },
  { $sort: { total_depense: -1 } },

  // Etape 4 : reformater la sortie
  {
    $project: {
      _id: 0,                      // Masquer _id
      client: "$_id",              // Renommer _id en "client"
      total_depense: 1,            // Garder tel quel
      nb_commandes: 1,             // Garder tel quel
      panier_moyen: {              // Champ calcule
        $round: [{ $divide: ["$total_depense", "$nb_commandes"] }, 2]
      }
    }
  }
])
```

**Résultat attendu** :

```text
[
  { client: 'Alice', total_depense: 1529, nb_commandes: 3, panier_moyen: 509.67 },
  { client: 'Bob', total_depense: 475, nb_commandes: 3, panier_moyen: 158.33 },
  { client: 'Charlie', total_depense: 300, nb_commandes: 1, panier_moyen: 300 }
]
```

---

### Étape 7 : `$lookup` - Jointure entre collections

Créé d'abord une collection de clients :

```javascript
// Collection de clients avec des informations supplementaires
db.clients.insertMany([
  { nom: "Alice", ville: "Paris", membre_premium: true },
  { nom: "Bob", ville: "Lyon", membre_premium: false },
  { nom: "Charlie", ville: "Marseille", membre_premium: true },
  { nom: "Diana", ville: "Bordeaux", membre_premium: false }
])
```

```javascript
// Joindre les commandes avec les informations client
db.commandes.aggregate([
  {
    $lookup: {
      from: "clients",           // Collection a joindre
      localField: "client",      // Champ de la collection source (commandes)
      foreignField: "nom",       // Champ de la collection cible (clients)
      as: "info_client"          // Nom du tableau de resultats
    }
  },
  // $lookup retourne un tableau, on prend le premier element
  { $unwind: "$info_client" },

  // Projection pour un resultat lisible
  {
    $project: {
      _id: 0,
      client: 1,
      produit: 1,
      prix: 1,
      ville_client: "$info_client.ville",
      premium: "$info_client.membre_premium"
    }
  },

  { $limit: 5 }
])
```

**Résultat attendu** :

```text
[
  { client: 'Alice', produit: 'Laptop', prix: 1200, ville_client: 'Paris', premium: true },
  { client: 'Bob', produit: 'Clavier', prix: 89, ville_client: 'Lyon', premium: false },
  { client: 'Alice', produit: 'Casque', prix: 250, ville_client: 'Paris', premium: true },
  { client: 'Charlie', produit: 'Ecran', prix: 450, ville_client: 'Marseille', premium: true },
  { client: 'Bob', produit: 'Souris', prix: 59, ville_client: 'Lyon', premium: false }
]
```

**Explication de `$lookup`** :

| Paramètre | Description |
| --------- | ----------- |
| `from` | Nom de la collection a joindre |
| `localField` | Champ de la collection source pour la correspondance |
| `foreignField` | Champ de la collection cible pour la correspondance |
| `as` | Nom du champ qui contiendra les documents joints (tableau) |

---

### Étape 8 : `$unwind` - Deconstruire un tableau

```javascript
// Ajoute des tags aux commandes
db.commandes.updateMany(
  { categorie: "Informatique" },
  { $set: { tags: ["tech", "bureau"] } }
)
db.commandes.updateMany(
  { categorie: "Audio" },
  { $set: { tags: ["son", "multimedia"] } }
)

// $unwind cree un document par element du tableau
db.commandes.aggregate([
  { $match: { client: "Alice" } },
  { $unwind: "$tags" },
  {
    $project: {
      _id: 0,
      produit: 1,
      tag: "$tags"
    }
  }
])
```

**Résultat attendu** :

```text
[
  { produit: 'Laptop', tag: 'tech' },
  { produit: 'Laptop', tag: 'bureau' },
  { produit: 'Casque', tag: 'son' },
  { produit: 'Casque', tag: 'multimedia' },
  { produit: 'Enceinte', tag: 'son' },
  { produit: 'Enceinte', tag: 'multimedia' },
  { produit: 'Ecouteurs', tag: 'son' },
  { produit: 'Ecouteurs', tag: 'multimedia' }
]
```

**Explication** : `$unwind` prend un document avec un tableau de 2 éléments et créé 2 documents (un par élément). C'est utile pour faire des agrégations sur les éléments d'un tableau.

---

### Étape 9 : `$addFields` - Ajouter des champs calcules

```javascript
// Ajouter un champ "montant_total" a chaque commande
db.commandes.aggregate([
  {
    $addFields: {
      montant_total: { $multiply: ["$prix", "$quantite"] }
    }
  },
  {
    $project: {
      _id: 0,
      client: 1,
      produit: 1,
      prix: 1,
      quantite: 1,
      montant_total: 1
    }
  },
  { $limit: 5 }
])
```

**Résultat attendu** :

```text
[
  { client: 'Alice', produit: 'Laptop', prix: 1200, quantite: 1, montant_total: 1200 },
  { client: 'Bob', produit: 'Clavier', prix: 89, quantite: 2, montant_total: 178 },
  { client: 'Alice', produit: 'Casque', prix: 250, quantite: 1, montant_total: 250 },
  { client: 'Charlie', produit: 'Ecran', prix: 450, quantite: 1, montant_total: 450 },
  { client: 'Bob', produit: 'Souris', prix: 59, quantite: 3, montant_total: 177 }
]
```

---

### Étape 10 : Pipeline complet - Rapport de ventes

```javascript
// Rapport : chiffre d'affaires mensuel par categorie (commandes livrees)
db.commandes.aggregate([
  // 1. Filtrer les commandes livrees
  { $match: { statut: "livree" } },

  // 2. Ajouter le montant total et le mois
  {
    $addFields: {
      montant: { $multiply: ["$prix", "$quantite"] },
      mois: { $month: "$date" }
    }
  },

  // 3. Grouper par mois et categorie
  {
    $group: {
      _id: { mois: "$mois", categorie: "$categorie" },
      ca: { $sum: "$montant" },
      nb_commandes: { $count: {} }
    }
  },

  // 4. Trier par mois puis par CA decroissant
  { $sort: { "_id.mois": 1, ca: -1 } },

  // 5. Reformater la sortie
  {
    $project: {
      _id: 0,
      mois: "$_id.mois",
      categorie: "$_id.categorie",
      chiffre_affaires: "$ca",
      nb_commandes: 1
    }
  }
])
```

**Résultat attendu** :

```text
[
  { nb_commandes: 2, mois: 1, categorie: 'Informatique', chiffre_affaires: 1378 },
  { nb_commandes: 1, mois: 2, categorie: 'Audio', chiffre_affaires: 250 },
  { nb_commandes: 1, mois: 2, categorie: 'Informatique', chiffre_affaires: 177 },
  { nb_commandes: 2, mois: 3, categorie: 'Audio', chiffre_affaires: 379 },
  { nb_commandes: 1, mois: 3, categorie: 'Informatique', chiffre_affaires: 120 }
]
```

---

### Étape 11 : Nettoyage

```javascript
exit
```

```bash
docker rm -f mongo-agreg
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `aggregate([stages])` | Execute un pipeline d'agrégation |
| `$match: { filtre }` | Filtre les documents |
| `$group: { _id, accum }` | Regroupe et calcule |
| `$sort: { champ: 1/-1 }` | Trie les résultats |
| `$project: { champs }` | Choisit ou transforme les champs |
| `$lookup: { from, localField, foreignField, as }` | Jointure |
| `$unwind: "$tableau"` | Deconstruit un tableau |
| `$addFields: { champs }` | Ajoute des champs calcules |
| `$limit: N` | Limite a N résultats |
| `$count: "nom"` | Compte les documents |

---

## Pièges Fréquents

### Piège 1 : Oublier le `$` devant les noms de champs

⚠️ **Problème** : Tu écris `_id: "client"` au lieu de `_id: "$client"` dans un `$group`. MongoDB utilise la chaîne de caractères "client" au lieu de la valeur du champ.

✅ **Solution** : Dans les étapes du pipeline, les références aux champs commencent toujours par `$` :

```javascript
// Mauvais : la chaine "client" est utilisee comme valeur
{ $group: { _id: "client" } }

// Bon : la valeur du champ "client" est utilisee
{ $group: { _id: "$client" } }
```

---

### Piège 2 : Ordre des étapes du pipeline

⚠️ **Problème** : Tu mets `$sort` avant `$group` en pensant trier les résultats finaux. En réalité, tu tries les documents d'entrée avant le regroupement.

✅ **Solution** : L'ordre des étapes est crucial. Place `$match` le plus tot possible (pour performance) et `$sort` après le `$group` :

```javascript
// Bon ordre
aggregate([
  { $match: { ... } },     // 1. Filtrer d'abord (performance)
  { $group: { ... } },     // 2. Regrouper
  { $sort: { ... } },      // 3. Trier les resultats
  { $project: { ... } }    // 4. Formater la sortie
])
```

---

### Piège 3 : `$lookup` retourne un tableau

⚠️ **Problème** : Après un `$lookup`, tu accedes au champ joint comme un objet (`info_client.ville`), mais c'est un tableau.

✅ **Solution** : `$lookup` retourne toujours un tableau (même avec un seul résultat). Utilise `$unwind` pour le convertir en objet :

```javascript
// Apres $lookup, info_client est un tableau : [{ ville: "Paris", ... }]
// $unwind le convertit en objet : { ville: "Paris", ... }
{ $unwind: "$info_client" }
```

---

### Piège 4 : Pipeline trop long et illisible

⚠️ **Problème** : Tu écris un pipeline de 10 étapes en une seule expression. C'est difficile a lire, deboguer et maintenir.

✅ **Solution** : Stocke les étapes dans des variables et compose le pipeline :

```javascript
const filtreActifs = { $match: { statut: "livree" } }
const groupeParClient = {
  $group: {
    _id: "$client",
    total: { $sum: "$prix" }
  }
}
const triParTotal = { $sort: { total: -1 } }

db.commandes.aggregate([filtreActifs, groupeParClient, triParTotal])
```

---

## Checklist de Validation

- [ ] Je sais ce qu'est un pipeline d'agrégation et comment il fonctionne
- [ ] Je sais utiliser `$match` pour filtrer les documents
- [ ] Je sais utiliser `$group` avec `$sum`, `$avg`, `$min`, `$max` et `$count`
- [ ] Je sais trier les résultats agrages avec `$sort`
- [ ] Je sais utiliser `$project` pour reformater la sortie
- [ ] Je sais faire une jointure entre collections avec `$lookup`
- [ ] Je sais deconstruire un tableau avec `$unwind`
- [ ] Je sais combiner plusieurs étapes dans un pipeline complet
- [ ] Je sais utiliser `$addFields` pour ajouter des champs calcules

---

## Exercice Pratique

**Énoncé** : Analyse les données d'une librairie en ligne.

**Indications** :

- Créé une collection `ventes` avec 10 ventes (livre, auteur, catégorie, prix, quantité, date, client)
- Créé une collection `auteurs` avec les informations des auteurs (nom, nationalite)
- Calcule le chiffre d'affaires total par catégorie
- Trouve le top 3 des livres les plus vendus (par quantité)
- Calcule le panier moyen par client
- Utilise `$lookup` pour ajouter la nationalite de l'auteur aux ventes
- Génère un rapport mensuel du chiffre d'affaires

**Résultat attendu** : 5 pipelines d'agrégation fonctionnels.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
docker run --name mongo-librairie -d -p 27017:27017 mongo:8
docker exec -it mongo-librairie mongosh
```

```text
use librairie

db.ventes.insertMany([
  { livre: "Dune", auteur: "Herbert", categorie: "SF", prix: 12, quantite: 3, date: new Date("2025-01-10"), client: "Marie" },
  { livre: "1984", auteur: "Orwell", categorie: "SF", prix: 9, quantite: 5, date: new Date("2025-01-15"), client: "Paul" },
  { livre: "Le Comte de Monte-Cristo", auteur: "Dumas", categorie: "Classique", prix: 15, quantite: 2, date: new Date("2025-01-20"), client: "Marie" },
  { livre: "Dune", auteur: "Herbert", categorie: "SF", prix: 12, quantite: 1, date: new Date("2025-02-05"), client: "Luc" },
  { livre: "Fondation", auteur: "Asimov", categorie: "SF", prix: 11, quantite: 4, date: new Date("2025-02-10"), client: "Paul" },
  { livre: "Les Fleurs du Mal", auteur: "Baudelaire", categorie: "Poesie", prix: 8, quantite: 2, date: new Date("2025-02-15"), client: "Marie" },
  { livre: "1984", auteur: "Orwell", categorie: "SF", prix: 9, quantite: 2, date: new Date("2025-03-01"), client: "Luc" },
  { livre: "Germinal", auteur: "Zola", categorie: "Classique", prix: 10, quantite: 3, date: new Date("2025-03-05"), client: "Paul" },
  { livre: "Dune", auteur: "Herbert", categorie: "SF", prix: 12, quantite: 2, date: new Date("2025-03-10"), client: "Marie" },
  { livre: "Fondation", auteur: "Asimov", categorie: "SF", prix: 11, quantite: 1, date: new Date("2025-03-15"), client: "Luc" }
])

db.auteurs.insertMany([
  { nom: "Herbert", nationalite: "Americain" },
  { nom: "Orwell", nationalite: "Britannique" },
  { nom: "Dumas", nationalite: "Francais" },
  { nom: "Asimov", nationalite: "Americain" },
  { nom: "Baudelaire", nationalite: "Francais" },
  { nom: "Zola", nationalite: "Francais" }
])

// 1. CA par categorie
db.ventes.aggregate([
  { $group: {
    _id: "$categorie",
    ca: { $sum: { $multiply: ["$prix", "$quantite"] } }
  }},
  { $sort: { ca: -1 } }
])

// 2. Top 3 livres les plus vendus
db.ventes.aggregate([
  { $group: {
    _id: "$livre",
    quantite_totale: { $sum: "$quantite" }
  }},
  { $sort: { quantite_totale: -1 } },
  { $limit: 3 }
])

// 3. Panier moyen par client
db.ventes.aggregate([
  { $addFields: { montant: { $multiply: ["$prix", "$quantite"] } } },
  { $group: {
    _id: "$client",
    total: { $sum: "$montant" },
    nb_achats: { $count: {} }
  }},
  { $project: {
    _id: 0,
    client: "$_id",
    panier_moyen: { $round: [{ $divide: ["$total", "$nb_achats"] }, 2] }
  }}
])

// 4. Jointure avec la nationalite de l'auteur
db.ventes.aggregate([
  { $lookup: {
    from: "auteurs",
    localField: "auteur",
    foreignField: "nom",
    as: "info_auteur"
  }},
  { $unwind: "$info_auteur" },
  { $project: {
    _id: 0,
    livre: 1,
    auteur: 1,
    nationalite: "$info_auteur.nationalite",
    prix: 1
  }},
  { $limit: 5 }
])

// 5. Rapport mensuel
db.ventes.aggregate([
  { $addFields: { montant: { $multiply: ["$prix", "$quantite"] } } },
  { $group: {
    _id: { $month: "$date" },
    ca_mensuel: { $sum: "$montant" },
    nb_ventes: { $count: {} }
  }},
  { $sort: { _id: 1 } },
  { $project: {
    _id: 0,
    mois: "$_id",
    chiffre_affaires: "$ca_mensuel",
    nombre_ventes: "$nb_ventes"
  }}
])

exit
```

```bash
docker rm -f mongo-librairie
```

---

## Navigation

← Fiche précédente : **[Requêtes avancées](04-requetes-avancees.md)**

→ Fiche suivante : **[Indexation et performances](06-indexation-performances.md)**
