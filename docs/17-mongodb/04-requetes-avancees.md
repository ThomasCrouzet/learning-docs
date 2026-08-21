---
tags:
  - MongoDB
  - Intermédiaire
  - Pratique
description: "Maîtriser les opérateurs de requête avances, la projection, le tri et la pagination dans MongoDB"
estimated_time: "60 min"
fiche_number: 4
total_fiches: 8
cursus: "MongoDB"
id: "web.mongodb.requetes-avancees"
course_id: "web.mongodb"
content_type: "lesson"
order: 4
---

# 04 - Requêtes avancées

> **En bref** : À la fin de cette fiche, tu sauras utiliser les opérateurs de requête avances (`$gt`, `$in`, `$regex`, `$or`...), projeter les champs a retourner, trier les résultats et paginer avec limit et skip. Lecture estimée : 60 min.

## Prérequis

- [Fiche précédente : Opérations CRUD](03-crud-operations.md)
- Savoir utiliser `find()`, `findOne()` et les filtres simples

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| MongoDB | 8.x |
| mongosh | 2.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras construire des requêtes complexes avec des opérateurs logiques, des expressions régulières, des projections pour limiter les champs retournes, et des méthodes de tri et pagination.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une projection ?

**Définition** : Une projection est le deuxième argument de `find()`. Elle indique a MongoDB quels champs inclure ou exclure dans les résultats. Sans projection, MongoDB retourne tous les champs de chaque document.

**Le problème que la projection résout** :

Sans projection, voici les problèmes rencontrés :

1. **Données inutiles** : tu veux juste le nom et le prix d'un produit, mais MongoDB retourne 20 champs, y compris des sous-documents volumineux.
2. **Performance réseau** : transporter des documents entiers sur le réseau est plus lent que transporter uniquement les champs nécessaires.
3. **Sécurité** : tu ne veux pas exposer certains champs (comme un mot de passe hash) dans les résultats d'une API.

**Comment la projection résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Données inutiles | N'inclure que les champs nécessaires |
| Performance réseau | Documents plus petits = transfert plus rapide |
| Sécurité | Exclure les champs sensibles |

**Syntaxe** :

```javascript
// Inclure uniquement certains champs (1 = inclure)
db.produits.find({}, { nom: 1, prix: 1 })

// Exclure certains champs (0 = exclure)
db.produits.find({}, { caracteristiques: 0 })
```

**Règle importante** : tu ne peux pas melanger inclusion et exclusion dans la même projection, sauf pour `_id` :

```javascript
// Correct : inclure nom et prix, exclure _id
db.produits.find({}, { nom: 1, prix: 1, _id: 0 })

// Incorrect : melanger 1 et 0 (sauf _id)
db.produits.find({}, { nom: 1, prix: 0 })  // Erreur
```

---

### Les opérateurs logiques

**Définition** : Les opérateurs logiques permettent de combiner plusieurs conditions dans un filtre. Par défaut, quand tu mets plusieurs conditions dans un filtre, c'est un ET logique. Les opérateurs logiques ajoutent le OU, le NON et le NON-OU.

**Les quatre opérateurs logiques** :

| Opérateur | Signification | Syntaxe |
| --------- | ------------- | ------- |
| `$and` | Toutes les conditions doivent être vraies | `{ $and: [cond1, cond2] }` |
| `$or` | Au moins une condition doit être vraie | `{ $or: [cond1, cond2] }` |
| `$not` | La condition doit être fausse | `{ champ: { $not: { $gt: 100 } } }` |
| `$nor` | Aucune condition ne doit être vraie | `{ $nor: [cond1, cond2] }` |

**Analogie concrète** : Pense a un moteur de recherche d'annonces immobilieres. "Appartement ET Paris" filtre les annonces qui sont des appartements situes a Paris. "Appartement OU Maison" montre les annonces qui sont des appartements ou des maisons. "PAS Paris" montre toutes les annonces sauf celles de Paris.

---

### Le tri et la pagination

**Définition** : Le tri (`sort`) ordonne les résultats, et la pagination (`skip` + `limit`) divise les résultats en pages.

**Le problème que le tri et la pagination résolvent** :

Sans tri ni pagination :

1. **Ordre imprevisible** : les documents sont retournes dans un ordre non garanti.
2. **Trop de résultats** : sur une collection de 10 000 documents, afficher tout d'un coup est inutilisable.

**Comment le tri et la pagination résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Ordre imprevisible | `sort()` ordonne les résultats par un ou plusieurs champs |
| Trop de résultats | `limit()` limite le nombre de résultats, `skip()` saute les premiers |

**Syntaxe** :

```javascript
// Tri ascendant par prix (1 = croissant)
db.produits.find().sort({ prix: 1 })

// Tri descendant par prix (-1 = decroissant)
db.produits.find().sort({ prix: -1 })

// Page 1 : les 10 premiers resultats
db.produits.find().sort({ prix: 1 }).skip(0).limit(10)

// Page 2 : les 10 suivants
db.produits.find().sort({ prix: 1 }).skip(10).limit(10)
```

---

## Étapes Pratiques

### Étape 1 : Préparer les données de test

Lance MongoDB et insere un jeu de données :

```bash
docker run --name mongo-requetes -d -p 27017:27017 mongo:8
docker exec -it mongo-requetes mongosh
```

```text
use magasin

// Insere un jeu de donnees complet
db.produits.insertMany([
  {
    nom: "MacBook Pro 14",
    marque: "Apple",
    prix: 2399,
    stock: 12,
    categorie: "Ordinateurs",
    note: 4.8,
    date_ajout: new Date("2025-01-15"),
    tags: ["laptop", "apple", "pro"]
  },
  {
    nom: "ThinkPad X1 Carbon",
    marque: "Lenovo",
    prix: 1599,
    stock: 25,
    categorie: "Ordinateurs",
    note: 4.5,
    date_ajout: new Date("2025-02-01"),
    tags: ["laptop", "business", "lenovo"]
  },
  {
    nom: "Galaxy S24",
    marque: "Samsung",
    prix: 899,
    stock: 50,
    categorie: "Smartphones",
    note: 4.3,
    date_ajout: new Date("2025-01-20"),
    tags: ["smartphone", "android", "samsung"]
  },
  {
    nom: "iPhone 16",
    marque: "Apple",
    prix: 1199,
    stock: 35,
    categorie: "Smartphones",
    note: 4.6,
    date_ajout: new Date("2025-03-01"),
    tags: ["smartphone", "apple", "ios"]
  },
  {
    nom: "iPad Air",
    marque: "Apple",
    prix: 799,
    stock: 40,
    categorie: "Tablettes",
    note: 4.4,
    date_ajout: new Date("2025-02-10"),
    tags: ["tablette", "apple", "m2"]
  },
  {
    nom: "Pixel 9",
    marque: "Google",
    prix: 799,
    stock: 0,
    categorie: "Smartphones",
    note: 4.2,
    date_ajout: new Date("2025-01-05"),
    tags: ["smartphone", "android", "google"]
  },
  {
    nom: "Surface Pro",
    marque: "Microsoft",
    prix: 1299,
    stock: 8,
    categorie: "Tablettes",
    note: 4.1,
    date_ajout: new Date("2025-03-15"),
    tags: ["tablette", "windows", "2-en-1"]
  },
  {
    nom: "AirPods Pro",
    marque: "Apple",
    prix: 279,
    stock: 100,
    categorie: "Audio",
    note: 4.7,
    date_ajout: new Date("2024-12-01"),
    tags: ["ecouteurs", "apple", "anc"]
  },
  {
    nom: "WH-1000XM5",
    marque: "Sony",
    prix: 349,
    stock: 30,
    categorie: "Audio",
    note: 4.8,
    date_ajout: new Date("2025-01-10"),
    tags: ["casque", "sony", "anc"]
  },
  {
    nom: "Galaxy Tab S9",
    marque: "Samsung",
    prix: 649,
    stock: 18,
    categorie: "Tablettes",
    note: 4.0,
    date_ajout: new Date("2025-02-20"),
    tags: ["tablette", "android", "samsung"]
  }
])
```

---

### Étape 2 : Opérateur `$or` (OU logique)

```javascript
// Produits Apple OU Sony
db.produits.find({
  $or: [
    { marque: "Apple" },
    { marque: "Sony" }
  ]
})
```

**Résultat attendu** : 5 documents (4 Apple + 1 Sony).

```javascript
// Produits a moins de 300 euros OU en rupture de stock
db.produits.find({
  $or: [
    { prix: { $lt: 300 } },
    { stock: 0 }
  ]
})
```

**Résultat attendu** : 2 documents (AirPods Pro et Pixel 9).

---

### Étape 3 : Combiner `$or` et `$and`

```javascript
// Produits Apple avec un prix > 1000 OU produits Samsung avec un prix < 700
db.produits.find({
  $or: [
    { $and: [{ marque: "Apple" }, { prix: { $gt: 1000 } }] },
    { $and: [{ marque: "Samsung" }, { prix: { $lt: 700 } }] }
  ]
})
```

**Résultat attendu** : 3 documents (MacBook Pro, iPhone 16, Galaxy Tab S9).

**Note** : le `$and` explicite est nécessaire ici car les deux branches du `$or` ont des conditions différentes. Dans les cas simples, le `$and` est implicite (voir fiche 03).

---

### Étape 4 : Opérateur `$in` (dans une liste)

```javascript
// Produits des marques Apple, Samsung ou Google
db.produits.find({
  marque: { $in: ["Apple", "Samsung", "Google"] }
})
```

**Résultat attendu** : 7 documents.

`$in` est un raccourci pratique pour un `$or` sur le même champ :

```javascript
// Equivalent avec $or (plus verbose)
db.produits.find({
  $or: [
    { marque: "Apple" },
    { marque: "Samsung" },
    { marque: "Google" }
  ]
})
```

---

### Étape 5 : Opérateur `$regex` (expressions régulières)

```javascript
// Produits dont le nom contient "Pro" (sensible a la casse)
db.produits.find({
  nom: { $regex: "Pro" }
})
```

**Résultat attendu** : 3 documents (MacBook Pro 14, AirPods Pro, Surface Pro).

```javascript
// Produits dont le nom commence par "Galaxy" (insensible a la casse)
db.produits.find({
  nom: { $regex: "^galaxy", $options: "i" }
})
```

**Résultat attendu** : 2 documents (Galaxy S24, Galaxy Tab S9).

```javascript
// Produits dont le nom se termine par un chiffre
db.produits.find({
  nom: { $regex: "\\d+$" }
})
```

**Résultat attendu** : Les produits dont le nom finit par un nombre (MacBook Pro 14, Galaxy S24, iPhone 16, Pixel 9, etc.).

**Options de `$regex`** :

| Option | Signification |
| ------ | ------------- |
| `i` | Insensible a la casse |
| `m` | Mode multi-lignes |
| `s` | Le point (.) inclut les sauts de ligne |

---

### Étape 6 : Opérateur `$exists` (vérifier l'existence d'un champ)

```javascript
// Ajoute un champ "promotion" a certains produits
db.produits.updateMany(
  { marque: "Apple" },
  { $set: { promotion: true } }
)

// Trouve les produits qui ont un champ "promotion"
db.produits.find({ promotion: { $exists: true } })
```

**Résultat attendu** : 4 documents (tous les produits Apple).

```javascript
// Trouve les produits qui n'ont PAS de champ "promotion"
db.produits.find({ promotion: { $exists: false } })
```

**Résultat attendu** : 6 documents.

---

### Étape 7 : Requêtes sur les tableaux

```javascript
// Produits qui ont le tag "apple"
db.produits.find({ tags: "apple" })
```

**Résultat attendu** : 4 documents Apple. Quand tu filtres sur un tableau, MongoDB vérifie si la valeur est presente dans le tableau.

```javascript
// Produits qui ont A LA FOIS les tags "smartphone" et "android"
db.produits.find({
  tags: { $all: ["smartphone", "android"] }
})
```

**Résultat attendu** : 2 documents (Galaxy S24 et Pixel 9).

```javascript
// Produits qui ont exactement 3 tags
db.produits.find({
  tags: { $size: 3 }
})
```

**Résultat attendu** : Tous les documents (chacun a 3 tags dans notre jeu de données).

---

### Étape 8 : Projection - Choisir les champs retournes

```javascript
// Retourne uniquement le nom et le prix (+ _id par defaut)
db.produits.find({}, { nom: 1, prix: 1 })
```

**Résultat attendu** :

```text
[
  { _id: ObjectId('...'), nom: 'MacBook Pro 14', prix: 2399 },
  { _id: ObjectId('...'), nom: 'ThinkPad X1 Carbon', prix: 1599 },
  ...
]
```

```javascript
// Retourne nom et prix SANS _id
db.produits.find({}, { nom: 1, prix: 1, _id: 0 })
```

**Résultat attendu** :

```text
[
  { nom: 'MacBook Pro 14', prix: 2399 },
  { nom: 'ThinkPad X1 Carbon', prix: 1599 },
  ...
]
```

```javascript
// Exclure les champs volumineux
db.produits.find({}, { tags: 0 })
```

---

### Étape 9 : Tri des résultats

```javascript
// Trier par prix croissant
db.produits.find({}, { nom: 1, prix: 1, _id: 0 }).sort({ prix: 1 })
```

**Résultat attendu** :

```text
[
  { nom: 'AirPods Pro', prix: 279 },
  { nom: 'WH-1000XM5', prix: 349 },
  { nom: 'Galaxy Tab S9', prix: 649 },
  { nom: 'iPad Air', prix: 799 },
  { nom: 'Pixel 9', prix: 799 },
  ...
]
```

```javascript
// Trier par note decroissante, puis par prix croissant
db.produits.find({}, { nom: 1, note: 1, prix: 1, _id: 0 }).sort({ note: -1, prix: 1 })
```

**Résultat attendu** : Les produits les mieux notes en premier. A note egale, les moins chers d'abord.

---

### Étape 10 : Pagination avec limit et skip

```javascript
// Page 1 : les 3 produits les moins chers
db.produits.find({}, { nom: 1, prix: 1, _id: 0 })
  .sort({ prix: 1 })
  .limit(3)
```

**Résultat attendu** :

```text
[
  { nom: 'AirPods Pro', prix: 279 },
  { nom: 'WH-1000XM5', prix: 349 },
  { nom: 'Galaxy Tab S9', prix: 649 }
]
```

```javascript
// Page 2 : les 3 suivants
db.produits.find({}, { nom: 1, prix: 1, _id: 0 })
  .sort({ prix: 1 })
  .skip(3)
  .limit(3)
```

**Résultat attendu** :

```text
[
  { nom: 'iPad Air', prix: 799 },
  { nom: 'Pixel 9', prix: 799 },
  { nom: 'Galaxy S24', prix: 899 }
]
```

**Formule de pagination** :

```text
Page N (base 1), taille T :
  skip = (N - 1) * T
  limit = T

Exemples avec T = 10 :
  Page 1 : skip(0).limit(10)
  Page 2 : skip(10).limit(10)
  Page 3 : skip(20).limit(10)
```

---

### Étape 11 : Compter les résultats filtres

```javascript
// Nombre de produits Apple
db.produits.countDocuments({ marque: "Apple" })
```

**Résultat attendu** :

```text
4
```

```javascript
// Nombre de produits a plus de 500 euros
db.produits.countDocuments({ prix: { $gt: 500 } })
```

---

### Étape 12 : Nettoyage

```javascript
exit
```

```bash
docker rm -f mongo-requetes
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `find({}, { nom: 1, prix: 1 })` | Projection : inclure nom et prix |
| `find({}, { tags: 0 })` | Projection : exclure tags |
| `find({ $or: [c1, c2] })` | OU logique |
| `find({ champ: { $in: [v1, v2] } })` | Dans une liste |
| `find({ champ: { $regex: "pattern" } })` | Expression régulière |
| `find({ champ: { $exists: true } })` | Le champ existe |
| `find({ tags: { $all: [v1, v2] } })` | Tableau contient tous les éléments |
| `find().sort({ champ: 1 })` | Tri croissant |
| `find().sort({ champ: -1 })` | Tri decroissant |
| `find().skip(N).limit(T)` | Pagination |

---

## Pièges Fréquents

### Piège 1 : Melanger inclusion et exclusion dans une projection

⚠️ **Problème** : Tu écris `{ nom: 1, tags: 0 }`. MongoDB refuse car tu melanges 1 et 0.

✅ **Solution** : Choisis un mode : soit tu listes les champs a inclure (1), soit les champs a exclure (0). La seule exception est `_id` qui peut toujours être mis a 0 :

```javascript
// Correct : tout inclure sauf _id
{ nom: 1, prix: 1, _id: 0 }

// Correct : tout exclure sauf le reste
{ tags: 0, caracteristiques: 0 }

// Incorrect : melange interdit
{ nom: 1, tags: 0 }
```

---

### Piège 2 : skip élevé sur de grosses collections

⚠️ **Problème** : Tu utilises `skip(100000).limit(10)` pour accéder a la page 10001. MongoDB doit parcourir 100 000 documents avant de retourner les 10 suivants. C'est très lent.

✅ **Solution** : Pour de grosses collections, utilise la pagination par curseur (cursor-based pagination) au lieu de skip. Le principe : retenir le `_id` du dernier document de la page précédente et filtrer avec `{ _id: { $gt: dernierIdVu } }`.

```javascript
// Pagination par curseur (performante)
// Page 1
db.produits.find().sort({ _id: 1 }).limit(10)

// Page 2 : utiliser le _id du dernier document de la page 1
db.produits.find({ _id: { $gt: ObjectId("dernier_id_page_1") } })
  .sort({ _id: 1 })
  .limit(10)
```

---

### Piège 3 : `$regex` sans index

⚠️ **Problème** : Tu utilises `$regex` sur un champ sans index. MongoDB parcourt tous les documents (full scan), ce qui est lent sur de grosses collections.

✅ **Solution** : Créé un index sur le champ (voir fiche 06). Pour les regex qui commencent par `^` (ancre de début), MongoDB peut utiliser l'index efficacement. Les regex sans ancre (`".*mot.*"`) nécessitent toujours un full scan.

---

### Piège 4 : Oublier le tri avant la pagination

⚠️ **Problème** : Tu fais `find().skip(10).limit(10)` sans `sort()`. L'ordre des documents n'est pas garanti, donc les pages peuvent avoir des doublons ou des documents manquants.

✅ **Solution** : Trie toujours avant de paginer :

```javascript
// Mauvais : ordre non garanti
db.produits.find().skip(10).limit(10)

// Bon : ordre garanti
db.produits.find().sort({ _id: 1 }).skip(10).limit(10)
```

---

## Checklist de Validation

- [ ] Je sais utiliser `$or`, `$and`, `$not` et `$nor`
- [ ] Je sais utiliser `$in` et `$nin`
- [ ] Je sais faire des recherches avec `$regex`
- [ ] Je sais vérifier l'existence d'un champ avec `$exists`
- [ ] Je sais utiliser `$all` et `$size` pour les requêtes sur les tableaux
- [ ] Je sais faire une projection pour choisir les champs retournes
- [ ] Je sais trier les résultats avec sort (ascendant et descendant)
- [ ] Je sais paginer avec skip et limit
- [ ] Je connais la formule de pagination (skip = (page - 1) * taille)

---

## Exercice Pratique

**Énoncé** : Construis des requêtes avancées sur une collection d'employés.

**Indications** :

- Créé une collection `employes` avec 8 employés ayant : nom, prénom, département (IT, RH, Marketing, Finance), salaire, date_embauche, compétences (tableau), et actif (booléen)
- Trouve les employés du département IT OU Marketing
- Trouve les employés avec un salaire entre 35000 et 50000
- Trouve les employés qui ont la compétence "JavaScript"
- Affiche uniquement le nom, prénom et salaire des employés, tries par salaire decroissant
- Affiche la page 2 avec 3 employés par page, tries par nom
- Compte le nombre d'employés actifs

**Résultat attendu** : Toutes les requêtes retournent les résultats corrects.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
docker run --name mongo-employes -d -p 27017:27017 mongo:8
docker exec -it mongo-employes mongosh
```

```text
use entreprise

db.employes.insertMany([
  {
    nom: "Dupont", prenom: "Alice", departement: "IT",
    salaire: 45000, date_embauche: new Date("2022-03-15"),
    competences: ["JavaScript", "Node.js", "MongoDB"], actif: true
  },
  {
    nom: "Martin", prenom: "Bob", departement: "RH",
    salaire: 38000, date_embauche: new Date("2021-06-01"),
    competences: ["Recrutement", "Formation"], actif: true
  },
  {
    nom: "Durand", prenom: "Charlie", departement: "Marketing",
    salaire: 42000, date_embauche: new Date("2023-01-10"),
    competences: ["SEO", "Analytics", "Redaction"], actif: true
  },
  {
    nom: "Petit", prenom: "Diana", departement: "IT",
    salaire: 52000, date_embauche: new Date("2020-09-01"),
    competences: ["Python", "Docker", "Kubernetes"], actif: true
  },
  {
    nom: "Moreau", prenom: "Eve", departement: "Finance",
    salaire: 48000, date_embauche: new Date("2019-11-20"),
    competences: ["Excel", "Comptabilite", "SAP"], actif: false
  },
  {
    nom: "Leroy", prenom: "Frank", departement: "IT",
    salaire: 35000, date_embauche: new Date("2024-02-01"),
    competences: ["JavaScript", "React", "CSS"], actif: true
  },
  {
    nom: "Simon", prenom: "Grace", departement: "Marketing",
    salaire: 40000, date_embauche: new Date("2022-07-15"),
    competences: ["Social Media", "Design", "Canva"], actif: true
  },
  {
    nom: "Bernard", prenom: "Hugo", departement: "Finance",
    salaire: 55000, date_embauche: new Date("2018-04-01"),
    competences: ["Excel", "Audit", "Reporting"], actif: true
  }
])

// Employes IT ou Marketing
db.employes.find({
  departement: { $in: ["IT", "Marketing"] }
})
// 5 resultats

// Salaire entre 35000 et 50000
db.employes.find({
  salaire: { $gte: 35000, $lte: 50000 }
})
// 6 resultats

// Competence JavaScript
db.employes.find({
  competences: "JavaScript"
})
// 2 resultats (Alice et Frank)

// Nom, prenom et salaire tries par salaire decroissant
db.employes.find(
  {},
  { nom: 1, prenom: 1, salaire: 1, _id: 0 }
).sort({ salaire: -1 })

// Page 2, 3 par page, tries par nom
db.employes.find(
  {},
  { nom: 1, prenom: 1, _id: 0 }
).sort({ nom: 1 }).skip(3).limit(3)

// Nombre d'employes actifs
db.employes.countDocuments({ actif: true })
// 7

exit
```

```bash
docker rm -f mongo-employes
```

---

## Navigation

← Fiche précédente : **[Opérations CRUD](03-crud-operations.md)**

→ Fiche suivante : **[Pipeline d'agrégation](05-agregation.md)**
