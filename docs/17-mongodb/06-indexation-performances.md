---
tags:
  - MongoDB
  - Intermédiaire
  - Concept
description: "Comprendre et créer des index MongoDB pour optimiser les performances des requêtes"
estimated_time: "60 min"
fiche_number: 6
total_fiches: 8
cursus: "MongoDB"
---

# 06 - Indexation et performances

> **En bref** : À la fin de cette fiche, tu sauras créer des index dans MongoDB, analyser les performances d'une requête avec explain() et appliquer les bonnes stratégies d'optimisation. Lecture estimée : 60 min.

## Prérequis

- [Fiche précédente : Pipeline d'agrégation](05-agregation.md)
- Savoir utiliser `find()` avec des filtres et des tris

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| MongoDB | 8.x |
| mongosh | 2.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer ce qu'est un index, créer des index simples, composes et texte, utiliser explain() pour analyser les performances, et choisir les bons index pour tes requêtes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un index ?

**Définition** : Un index est une structure de données que MongoDB maintient en parallele de tes documents. Il permet de trouver rapidement des documents sans parcourir toute la collection. C'est comme l'index d'un livre : au lieu de lire toutes les pages pour trouver un mot, tu vas directement a la page indiquee dans l'index.

**Le problème que les index résolvent** :

Sans index, voici les problèmes rencontrés :

1. **Scan complet (Collection Scan)** : pour trouver un document, MongoDB parcourt chaque document de la collection un par un. Sur 1 million de documents, cela signifie lire 1 million de documents.
2. **Requêtes lentes** : a mesure que la collection grossit, les requêtes deviennent de plus en plus lentes.
3. **Tri coûteux** : trier des milliers de documents en mémoire consomme beaucoup de RAM.

**Comment les index résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Scan complet | L'index pointe directement vers les documents correspondants |
| Requêtes lentes | Temps de recherche logarithmique (O(log n)) au lieu de linéaire (O(n)) |
| Tri coûteux | L'index est déjà trie, pas besoin de trier en mémoire |

**Analogie concrète** : Imagine une bibliothèque avec 100 000 livres ranges sur des etageres. Sans index (catalogue), pour trouver un livre spécifique, tu dois parcourir chaque etagere une par une. Avec un index (catalogue par auteur ou par titre), tu cherches dans le catalogue, tu trouves l'emplacement en quelques secondes, et tu vas directement a l'etagere.

**Ce qu'un index n'est PAS** :

- Un index n'est pas gratuit. Chaque index consomme de la mémoire (RAM) et ralentit les opérations d'écriture (insertions, mises à jour, suppressions) car MongoDB doit mettre a jour l'index a chaque modification.
- Un index n'est pas une solution universelle. Trop d'index sur une collection est contre-productif.

---

### Types d'index MongoDB

**Définition** : MongoDB propose plusieurs types d'index adaptes a différents cas d'usage.

| Type | Description | Cas d'usage |
| ---- | ----------- | ----------- |
| Index simple | Un seul champ | Recherche sur un champ (`{ email: 1 }`) |
| Index compose | Plusieurs champs | Requêtes combinant plusieurs critères (`{ ville: 1, age: -1 }`) |
| Index unique | Empeche les doublons | Champs qui doivent être uniques (`{ email: 1 }`, unique) |
| Index texte | Recherche plein texte | Recherche de mots dans des textes (`{ description: "text" }`) |
| Index TTL | Suppression automatique | Documents a expiration (sessions, logs) |
| Index partiel | Indexe uniquement certains documents | Indexer uniquement les documents actifs |

**Comparaison avec SQL** :

| MongoDB | PostgreSQL |
| ------- | ---------- |
| `db.col.createIndex({ champ: 1 })` | `CREATE INDEX idx ON table (champ)` |
| `db.col.createIndex({ champ: 1 }, { unique: true })` | `CREATE UNIQUE INDEX idx ON table (champ)` |
| `db.col.createIndex({ champ: "text" })` | `CREATE INDEX idx ON table USING gin(to_tsvector('french', champ))` |
| `db.col.getIndexes()` | `\d table` |
| `db.col.dropIndex("nom_index")` | `DROP INDEX idx` |

---

### Qu'est-ce qu'explain() ?

**Définition** : `explain()` est une méthode qui montre comment MongoDB execute une requête. Elle revele si un index est utilise, combien de documents sont scannes, et combien de temps la requête prend.

**Les informations importantes dans explain()** :

| Champ | Signification |
| ----- | ------------- |
| `stage: "COLLSCAN"` | Scan complet de la collection (pas d'index utilise) |
| `stage: "IXSCAN"` | Scan d'index (un index est utilise) |
| `totalDocsExamined` | Nombre de documents lus |
| `totalKeysExamined` | Nombre d'entrées d'index lues |
| `executionTimeMillis` | Temps d'exécution en millisecondes |
| `nReturned` | Nombre de documents retournes |

**La règle d'or** : le ratio `nReturned / totalDocsExamined` doit être le plus proche possible de 1. Si tu retournes 10 documents mais en scannes 100 000, ta requête est inefficace.

---

## Étapes Pratiques

### Étape 1 : Préparer les données de test

Pour observer l'impact des index, nous avons besoin d'une collection avec beaucoup de documents :

```bash
docker run --name mongo-index -d -p 27017:27017 mongo:8
docker exec -it mongo-index mongosh
```

```text
use performance

// Genere 10 000 documents de test
const noms = ["Dupont", "Martin", "Durand", "Petit", "Moreau", "Simon", "Laurent", "Lefebvre", "Michel", "Garcia"]
const villes = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice", "Nantes", "Bordeaux", "Lille", "Rennes", "Strasbourg"]
const departements = ["IT", "RH", "Marketing", "Finance", "Commercial"]

const employes = []
for (let i = 0; i < 10000; i++) {
  employes.push({
    nom: noms[Math.floor(Math.random() * noms.length)],
    prenom: "Employe" + i,
    email: `employe${i}@example.com`,
    age: Math.floor(Math.random() * 40) + 20,
    ville: villes[Math.floor(Math.random() * villes.length)],
    departement: departements[Math.floor(Math.random() * departements.length)],
    salaire: Math.floor(Math.random() * 50000) + 25000,
    date_embauche: new Date(2015 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    actif: Math.random() > 0.1
  })
}
db.employes.insertMany(employes)

// Verifie le nombre de documents
db.employes.countDocuments()
// 10000
```

---

### Étape 2 : Analyser une requête sans index (COLLSCAN)

```javascript
// Recherche les employes de Paris
db.employes.find({ ville: "Paris" }).explain("executionStats")
```

**Résultat attendu** (extrait des parties importantes) :

```text
{
  executionStats: {
    executionSuccess: true,
    nReturned: ~1000,
    executionTimeMillis: ...,
    totalKeysExamined: 0,
    totalDocsExamined: 10000,
    ...
    executionStages: {
      stage: 'COLLSCAN',
      ...
    }
  }
}
```

**Analyse** :

- `stage: 'COLLSCAN'` : MongoDB a fait un scan complet de la collection
- `totalDocsExamined: 10000` : MongoDB a lu les 10 000 documents
- `totalKeysExamined: 0` : aucun index n'a été utilise
- `nReturned: ~1000` : seuls environ 1 000 documents correspondent

Le ratio nReturned/totalDocsExamined est d'environ 1/10. MongoDB a lu 10 fois plus de documents que nécessaire.

---

### Étape 3 : Créer un index simple

```javascript
// Cree un index sur le champ "ville"
// 1 = ordre croissant, -1 = ordre decroissant
db.employes.createIndex({ ville: 1 })
```

**Résultat attendu** :

```text
ville_1
```

MongoDB retourne le nom de l'index créé. Par défaut, le nom est `nomDuChamp_direction`.

---

### Étape 4 : Analyser la même requête avec index (IXSCAN)

```javascript
// La meme requete, maintenant avec l'index
db.employes.find({ ville: "Paris" }).explain("executionStats")
```

**Résultat attendu** (extrait) :

```text
{
  executionStats: {
    nReturned: ~1000,
    executionTimeMillis: ...,
    totalKeysExamined: ~1000,
    totalDocsExamined: ~1000,
    executionStages: {
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        indexName: 'ville_1',
        ...
      }
    }
  }
}
```

**Analyse** :

- `stage: 'IXSCAN'` : MongoDB utilise l'index
- `totalKeysExamined: ~1000` : MongoDB a lu environ 1 000 entrées d'index
- `totalDocsExamined: ~1000` : MongoDB a lu uniquement les documents correspondants
- Le ratio nReturned/totalDocsExamined est maintenant de 1/1. C'est optimal.

---

### Étape 5 : Lister et supprimer des index

```javascript
// Liste tous les index de la collection
db.employes.getIndexes()
```

**Résultat attendu** :

```text
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { ville: 1 }, name: 'ville_1' }
]
```

L'index `_id_` est créé automatiquement par MongoDB sur le champ `_id`. Il ne peut pas être supprime.

```javascript
// Supprime un index par son nom
db.employes.dropIndex("ville_1")
```

**Résultat attendu** :

```text
{ nIndexesWas: 2, ok: 1 }
```

---

### Étape 6 : Créer un index compose

Un index compose couvre plusieurs champs. Il est utile pour les requêtes qui filtrent sur plusieurs critères :

```javascript
// Index compose : departement + ville
db.employes.createIndex({ departement: 1, ville: 1 })
```

```javascript
// Requete qui utilise l'index compose
db.employes.find({ departement: "IT", ville: "Lyon" }).explain("executionStats")
```

**Résultat attendu** : `IXSCAN` sur l'index `departement_1_ville_1`, avec un nombre minimal de documents scannes.

**Règle de l'ordre** : dans un index compose, l'ordre des champs compte. L'index `{ departement: 1, ville: 1 }` est utilise pour :

- `find({ departement: "IT" })` - oui (préfixe de l'index)
- `find({ departement: "IT", ville: "Lyon" })` - oui (les deux champs)
- `find({ ville: "Lyon" })` - non (ville n'est pas le préfixe)

```text
Index { departement: 1, ville: 1 }

Utilise pour :
  { departement: "IT" }                    ✅ (prefixe)
  { departement: "IT", ville: "Lyon" }     ✅ (prefixe + deuxieme champ)

NON utilise pour :
  { ville: "Lyon" }                        ❌ (pas le prefixe)
```

---

### Étape 7 : Créer un index unique

```javascript
// Index unique sur le champ email (empeche les doublons)
db.employes.createIndex({ email: 1 }, { unique: true })
```

```javascript
// Tenter d'inserer un doublon
db.employes.insertOne({
  nom: "Test",
  email: "employe0@example.com",  // Ce mail existe deja
  ville: "Paris"
})
```

**Résultat attendu** :

```text
MongoServerError: E11000 duplicate key error collection: performance.employes
index: email_1 dup key: { email: "employe0@example.com" }
```

L'index unique empêche l'insertion d'un document avec un email qui existe déjà.

---

### Étape 8 : Créer un index texte

```javascript
// Ajoute un champ "description" a certains employes
db.employes.updateMany(
  { departement: "IT" },
  { $set: { description: "Developpeur logiciel specialise en applications web" } }
)
db.employes.updateMany(
  { departement: "Marketing" },
  { $set: { description: "Responsable campagnes marketing et communication digitale" } }
)

// Cree un index texte sur le champ description
// default_language: "french" active le stemming et la suppression
// des mots vides en francais (sinon MongoDB utilise l'anglais par defaut)
db.employes.createIndex(
  { description: "text" },
  { default_language: "french" }
)
```

```javascript
// Recherche plein texte
db.employes.find({ $text: { $search: "developpeur web" } })
```

**Résultat attendu** : Tous les employés IT dont la description contient "développeur" ou "web".

```javascript
// Recherche avec pertinence (score)
db.employes.find(
  { $text: { $search: "developpeur web" } },
  { score: { $meta: "textScore" }, nom: 1, description: 1, _id: 0 }
).sort({ score: { $meta: "textScore" } })
```

**Limitation** : une collection ne peut avoir qu'un seul index texte. Si tu as besoin de chercher dans plusieurs champs, créé un index texte compose :

```javascript
// Index texte sur plusieurs champs (apres avoir supprime le precedent)
db.employes.dropIndex("description_text")
db.employes.createIndex(
  { nom: "text", description: "text" },
  { default_language: "french" }
)
```

---

### Étape 9 : Créer un index TTL

Un index TTL (Time To Live) supprime automatiquement les documents après un certain temps :

```javascript
// Collection de sessions avec expiration automatique
db.sessions.insertMany([
  {
    session_id: "abc123",
    utilisateur: "Alice",
    cree_le: new Date(),
    donnees: { page: "/accueil" }
  },
  {
    session_id: "def456",
    utilisateur: "Bob",
    cree_le: new Date(Date.now() - 3600000),  // Il y a 1 heure
    donnees: { page: "/produits" }
  }
])

// Cree un index TTL : supprime les documents 1800 secondes (30 min) apres la valeur de "cree_le"
db.sessions.createIndex({ cree_le: 1 }, { expireAfterSeconds: 1800 })
```

MongoDB vérifie les documents expires toutes les 60 secondes et les supprime automatiquement.

---

### Étape 10 : Créer un index partiel

Un index partiel n'indexe que les documents qui correspondent a un filtre :

```javascript
// Indexe uniquement les employes actifs
db.employes.createIndex(
  { nom: 1 },
  { partialFilterExpression: { actif: true } }
)
```

**Avantage** : l'index est plus petit (il n'indexe que 90 % des documents dans notre cas) et consomme moins de mémoire.

```javascript
// Cette requete utilise l'index partiel
db.employes.find({ nom: "Dupont", actif: true }).explain("executionStats")

// Cette requete N'UTILISE PAS l'index partiel (pas de filtre sur actif)
db.employes.find({ nom: "Dupont" }).explain("executionStats")
```

---

### Étape 11 : Stratégies d'optimisation

**Règle 1 : Indexer les champs les plus filtres**

```javascript
// Verifie quels champs sont le plus utilises dans les requetes
// et cree des index dessus
db.employes.createIndex({ departement: 1 })
db.employes.createIndex({ salaire: 1 })
```

**Règle 2 : Utiliser un index couvert (covered query)**

Un index couvert est une requête ou toutes les données proviennent de l'index, sans lire les documents :

```javascript
// Cree un index sur ville + salaire
db.employes.createIndex({ ville: 1, salaire: 1 })

// Requete couverte : tous les champs demandes sont dans l'index
db.employes.find(
  { ville: "Paris" },
  { ville: 1, salaire: 1, _id: 0 }
).explain("executionStats")
```

**Résultat attendu** : `totalDocsExamined: 0`. MongoDB n'a même pas besoin de lire les documents.

**Règle 3 : Limiter le nombre d'index**

Chaque index consomme de la mémoire et ralentit les ecritures. En général, vise entre 3 et 7 index par collection.

---

### Étape 12 : Nettoyage

```javascript
exit
```

```bash
docker rm -f mongo-index
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `db.col.createIndex({ champ: 1 })` | Créé un index croissant |
| `db.col.createIndex({ champ: -1 })` | Créé un index decroissant |
| `db.col.createIndex({ a: 1, b: 1 })` | Créé un index compose |
| `db.col.createIndex({ champ: 1 }, { unique: true })` | Créé un index unique |
| `db.col.createIndex({ champ: "text" })` | Créé un index texte |
| `db.col.createIndex({ date: 1 }, { expireAfterSeconds: N })` | Créé un index TTL |
| `db.col.getIndexes()` | Liste les index |
| `db.col.dropIndex("nom")` | Supprime un index |
| `db.col.find({}).explain("executionStats")` | Analyse les performances |

---

## Pièges Fréquents

### Piège 1 : Créer trop d'index

⚠️ **Problème** : Tu créés un index sur chaque champ de la collection. Les insertions et mises à jour deviennent lentes car MongoDB doit mettre a jour tous les index a chaque écriture.

✅ **Solution** : Créé des index uniquement pour les requêtes fréquentes. Analyse les requêtes de ton application et créé des index cibles. En général, 3 a 7 index par collection suffisent.

---

### Piège 2 : Ignorer l'ordre d'un index compose

⚠️ **Problème** : Tu créés l'index `{ ville: 1, departement: 1 }` mais tes requêtes filtrent souvent sur `departement` sans `ville`. L'index n'est pas utilise.

✅ **Solution** : Place le champ le plus filtre en premier dans l'index compose. Applique la règle ESR (Equality, Sort, Range) : d'abord les champs d'égalité, puis les champs de tri, puis les champs de plage.

```javascript
// Requete typique : filtrer par departement, trier par salaire, plage d'age
db.employes.find({
  departement: "IT",
  age: { $gte: 25, $lte: 40 }
}).sort({ salaire: -1 })

// Index optimal (ESR) :
// E = departement (egalite)
// S = salaire (tri)
// R = age (plage)
db.employes.createIndex({ departement: 1, salaire: -1, age: 1 })
```

---

### Piège 3 : Ne pas vérifier avec explain()

⚠️ **Problème** : Tu créés un index et supposes qu'il est utilise par tes requêtes. En réalité, MongoDB choisit un autre plan d'exécution.

✅ **Solution** : Utilise toujours `explain("executionStats")` après avoir créé un index pour vérifier qu'il est bien utilise. Vérifie que `stage` est `IXSCAN` et non `COLLSCAN`.

---

### Piège 4 : Index texte sans configuration de langue

⚠️ **Problème** : Tu créés un index texte sur du contenu en français mais la langue par défaut est l'anglais. Les mots comme "développeur" ne sont pas correctement lemmatises.

✅ **Solution** : Specifie la langue lors de la création de l'index texte :

```javascript
// Index texte avec langue francaise
db.articles.createIndex(
  { contenu: "text" },
  { default_language: "french" }
)
```

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est un index et pourquoi il est important
- [ ] Je sais créer un index simple avec createIndex
- [ ] Je sais créer un index compose et je comprends l'importance de l'ordre des champs
- [ ] Je sais créer un index unique
- [ ] Je sais créer un index texte pour la recherche plein texte
- [ ] Je sais utiliser explain("executionStats") pour analyser les performances
- [ ] Je sais interpréter les résultats d'explain (COLLSCAN vs IXSCAN)
- [ ] Je connais la règle ESR pour les index composes
- [ ] Je sais quand créer et quand ne pas créer un index

---

## Exercice Pratique

**Énoncé** : Optimise les performances d'une collection de produits.

**Indications** :

- Créé une collection `produits` avec 5 000 documents generes (nom, catégorie, prix, stock, date_ajout, description)
- Execute une requête qui filtre par catégorie et trie par prix sans index, note le nombre de documents scannes
- Créé l'index adapte et observe l'amelioration
- Créé un index unique sur un champ identifiant
- Créé un index texte sur la description et fais une recherche plein texte
- Vérifie que tous tes index sont bien utilises avec explain()

**Résultat attendu** : Tu as observe la difference de performance entre COLLSCAN et IXSCAN, et tu sais choisir les bons index.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
docker run --name mongo-perf -d -p 27017:27017 mongo:8
docker exec -it mongo-perf mongosh
```

```javascript
use optimisation

// Generer 5000 produits
const categories = ["Electronique", "Vetements", "Alimentation", "Sport", "Maison"]
const produits = []
for (let i = 0; i < 5000; i++) {
  produits.push({
    ref: `PRD-${String(i).padStart(5, "0")}`,
    nom: `Produit ${i}`,
    categorie: categories[Math.floor(Math.random() * categories.length)],
    prix: Math.round((Math.random() * 500 + 5) * 100) / 100,
    stock: Math.floor(Math.random() * 200),
    date_ajout: new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    description: `Description du produit ${i} dans la categorie ${categories[Math.floor(Math.random() * categories.length)]}`
  })
}
db.produits.insertMany(produits)

// Sans index : filtrer par categorie et trier par prix
db.produits.find({ categorie: "Electronique" }).sort({ prix: 1 }).explain("executionStats")
// totalDocsExamined: 5000, stage: COLLSCAN

// Creer l'index compose adapte (ESR : categorie = egalite, prix = tri)
db.produits.createIndex({ categorie: 1, prix: 1 })

// Avec index
db.produits.find({ categorie: "Electronique" }).sort({ prix: 1 }).explain("executionStats")
// totalDocsExamined: ~1000, stage: IXSCAN

// Index unique sur la reference
db.produits.createIndex({ ref: 1 }, { unique: true })

// Tester le doublon
db.produits.insertOne({ ref: "PRD-00000", nom: "Test" })
// Erreur E11000

// Index texte sur la description
db.produits.createIndex({ description: "text" })

// Recherche plein texte
db.produits.find({ $text: { $search: "Electronique" } }).limit(5)

// Verifier les index
db.produits.getIndexes()
// 4 index : _id_, categorie_1_prix_1, ref_1, description_text

exit
```

```bash
docker rm -f mongo-perf
```

---

## Navigation

← Fiche précédente : **[Pipeline d'agrégation](05-agregation.md)**

→ Fiche suivante : **[Mongoose avec Node.js](07-mongoose-nodejs.md)**
