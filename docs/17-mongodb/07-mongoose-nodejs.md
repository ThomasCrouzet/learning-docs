---
tags:
  - MongoDB
  - Intermédiaire
  - Pratique
description: "Utiliser Mongoose pour connecter une application Node.js a MongoDB avec des schémas, validations et relations"
estimated_time: "75 min"
fiche_number: 7
total_fiches: 8
cursus: "MongoDB"
---

# 07 - Mongoose avec Node.js

> **En bref** : À la fin de cette fiche, tu sauras utiliser Mongoose pour définir des schémas, valider les données, créer des relations entre documents et interagir avec MongoDB depuis une application Node.js. Lecture estimée : 75 min.

## Prérequis

- [Fiche précédente : Indexation et performances](06-indexation-performances.md)
- [Cursus Node.js](../epitech/07-nodejs/index.md) termine (npm, modules, Express, API REST)
- Savoir créer un projet Node.js avec npm et utiliser les modules ES

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| MongoDB | 8.x |
| Node.js | 20 LTS |
| Mongoose | 8.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras connecter une application Node.js a MongoDB avec Mongoose, définir des schémas avec validation, utiliser les middleware, et créer des relations entre documents avec populate.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Mongoose ?

**Définition** : Mongoose est une bibliothèque Node.js qui fournit une couche d'abstraction au-dessus du driver MongoDB natif. Elle permet de définir des schémas (la structure des documents), de valider les données avant insertion, et de gérer les relations entre documents.

**Le problème que Mongoose résout** :

Sans Mongoose, voici les problèmes rencontrés :

1. **Pas de schéma** : MongoDB n'impose pas de schéma. Sans Mongoose, rien n'empêche d'insérer un document avec un champ `nom` dans une requête et `name` dans une autre. Les erreurs sont détectées trop tard.

2. **Validation manuelle** : sans Mongoose, tu dois écrire toi-même le code qui vérifie que l'email est valide, que le prix est un nombre positif, que le nom n'est pas vide, etc.

3. **Relations complexes** : le driver MongoDB natif ne gère pas les relations entre documents. Tu dois écrire plusieurs requêtes manuellement pour charger un article et ses commentaires.

**Comment Mongoose résout ces problèmes** :

| Problème | Solution Mongoose |
| -------- | ----------------- |
| Pas de schéma | Les schémas définissent la structure attendue |
| Validation manuelle | Validators integres (required, min, max, enum, custom) |
| Relations complexes | Populate charge les documents lies automatiquement |

**Analogie concrète** : MongoDB sans Mongoose c'est comme un tableur sans mise en forme - tu peux écrire n'importe quoi dans n'importe quelle cellule. Mongoose c'est comme un formulaire structure avec des champs obligatoires, des listes deroulantes et des vérifications - les données sont validees avant d'être enregistrées.

**Ce que Mongoose n'est PAS** :

- Mongoose n'est pas un ORM (Object-Relational Mapping) car MongoDB n'est pas une base relationnelle. C'est un ODM (Object-Document Mapping).
- Mongoose n'est pas obligatoire. Tu peux utiliser le driver MongoDB natif (`mongodb` sur npm) directement. Mongoose ajoute une couche de confort, pas une fonctionnalité impossible autrement.

---

### Schéma, Model et Document

**Définition** : Mongoose utilise trois concepts centraux pour interagir avec MongoDB.

| Concept | Description | Analogie |
| ------- | ----------- | -------- |
| Schéma | Définition de la structure (champs, types, validation) | Le plan de la maison |
| Model | Classe JavaScript générée a partir du schéma | Le constructeur de maisons |
| Document | Instance d'un model (un document MongoDB) | Une maison construite |

**Flux de travail** :

```text
Schema → Model → Document
  ↓        ↓        ↓
Definir   Compiler  Creer/Lire/Modifier/Supprimer
```

---

### Les types Mongoose

**Définition** : Mongoose supporte les types suivants pour les champs d'un schéma.

| Type Mongoose | Type JavaScript | Exemple |
| ------------- | --------------- | ------- |
| `String` | Chaîne de caractères | `"Alice"` |
| `Number` | Nombre | `42`, `3.14` |
| `Boolean` | Booléen | `true`, `false` |
| `Date` | Date | `new Date()` |
| `Buffer` | Données binaires | Fichiers, images |
| `ObjectId` | Identifiant MongoDB | `Schema.Types.ObjectId` |
| `Array` | Tableau | `[1, 2, 3]` |
| `Map` | Map clé-valeur | `new Map()` |
| `Schema.Types.Mixed` | Type libre (pas de validation) | N'importe quoi |

---

## Étapes Pratiques

### Étape 1 : Préparer le projet

Lance MongoDB et créé un projet Node.js :

```bash
# Lance MongoDB dans Docker
docker run --name mongo-mongoose -d -p 27017:27017 mongo:8
```

```bash
# Cree un dossier pour le projet
mkdir mongoose-demo && cd mongoose-demo

# Initialise le projet Node.js
npm init -y

# Installe Mongoose (version courante 9.x en 2026)
npm install mongoose
```

Active les modules ES dans `package.json` :

```json
{
  "name": "mongoose-demo",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "mongoose": "^9.0.0"
  }
}
```

**Note (Mongoose 9)** : depuis Mongoose 9, les middleware `pre` ne reçoivent plus le paramètre `next()`. Utilise une fonction synchrone sans `next()`, ou une fonction `async`. Les exemples de cette fiche suivent ce style.

---

### Étape 2 : Se connecter a MongoDB

Créé un fichier `index.js` :

```javascript
// index.js
import mongoose from "mongoose";

// Connexion a MongoDB
// mongoose.connect retourne une promesse
async function main() {
  try {
    await mongoose.connect("mongodb://localhost:27017/mongoose-demo");
    console.log("Connecte a MongoDB");

    // Le reste du code ira ici

    // Ferme la connexion a la fin
    await mongoose.disconnect();
    console.log("Deconnecte de MongoDB");
  } catch (error) {
    console.error("Erreur de connexion :", error.message);
    process.exit(1);
  }
}

main();
```

```bash
node index.js
```

**Résultat attendu** :

```text
Connecte a MongoDB
Deconnecte de MongoDB
```

---

### Étape 3 : Définir un schéma et un model

```javascript
// index.js
import mongoose from "mongoose";

// Definition du schema Utilisateur
const utilisateurSchema = new mongoose.Schema({
  // Champ obligatoire de type String
  nom: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true,              // Supprime les espaces en debut et fin
    minlength: [2, "Le nom doit faire au moins 2 caracteres"]
  },

  // Champ avec validation par email
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,            // Index unique (pas de doublons)
    lowercase: true,         // Convertit en minuscules automatiquement
    match: [/^\S+@\S+\.\S+$/, "Format d'email invalide"]
  },

  // Champ numerique avec min et max
  age: {
    type: Number,
    min: [0, "L'age ne peut pas etre negatif"],
    max: [150, "L'age ne peut pas depasser 150"]
  },

  // Champ avec valeur par defaut
  role: {
    type: String,
    enum: ["utilisateur", "moderateur", "admin"],  // Valeurs autorisees
    default: "utilisateur"
  },

  // Champ booleen avec valeur par defaut
  actif: {
    type: Boolean,
    default: true
  },

  // Sous-document
  adresse: {
    rue: String,
    ville: String,
    code_postal: String
  },

  // Tableau de chaines
  competences: [String],

  // Date avec valeur par defaut
  inscription: {
    type: Date,
    default: Date.now    // Fonction appelee a l'insertion
  }
});

// Compilation du schema en model
// "Utilisateur" = nom du model, Mongoose cree la collection "utilisateurs" (pluriel minuscule)
const Utilisateur = mongoose.model("Utilisateur", utilisateurSchema);
```

---

### Étape 4 : Créer des documents (Create)

```javascript
async function main() {
  await mongoose.connect("mongodb://localhost:27017/mongoose-demo");
  console.log("Connecte a MongoDB");

  // Methode 1 : creer et sauvegarder en deux etapes
  const alice = new Utilisateur({
    nom: "Alice Dupont",
    email: "alice@example.com",
    age: 28,
    adresse: { rue: "12 rue de la Paix", ville: "Paris", code_postal: "75002" },
    competences: ["JavaScript", "Node.js", "MongoDB"]
  });
  await alice.save();  // Sauvegarde dans MongoDB
  console.log("Alice creee :", alice._id);

  // Methode 2 : creer et sauvegarder en une seule etape
  const bob = await Utilisateur.create({
    nom: "Bob Martin",
    email: "bob@example.com",
    age: 35,
    role: "moderateur",
    adresse: { rue: "5 avenue des Champs", ville: "Lyon", code_postal: "69001" },
    competences: ["Python", "Docker"]
  });
  console.log("Bob cree :", bob._id);

  // Methode 3 : creer plusieurs documents
  const autres = await Utilisateur.create([
    {
      nom: "Charlie Durand",
      email: "charlie@example.com",
      age: 22,
      competences: ["HTML", "CSS", "JavaScript"]
    },
    {
      nom: "Diana Petit",
      email: "diana@example.com",
      age: 40,
      role: "admin",
      competences: ["Management", "Scrum"]
    }
  ]);
  console.log(`${autres.length} utilisateurs crees`);

  await mongoose.disconnect();
}
```

---

### Étape 5 : Tester la validation

```javascript
// Tenter de creer un utilisateur invalide
try {
  await Utilisateur.create({
    // nom manquant (required)
    email: "invalide",       // Format incorrect
    age: -5                  // Negatif (min: 0)
  });
} catch (error) {
  console.log("Erreurs de validation :");
  // Mongoose fournit des messages d'erreur detailles
  for (const champ in error.errors) {
    console.log(`  - ${champ} : ${error.errors[champ].message}`);
  }
}
```

**Résultat attendu** :

```text
Erreurs de validation :
  - nom : Le nom est obligatoire
  - email : Format d'email invalide
  - age : L'age ne peut pas etre negatif
```

---

### Étape 6 : Lire des documents (Read)

```javascript
// Tous les utilisateurs
const tous = await Utilisateur.find();
console.log(`${tous.length} utilisateurs trouves`);

// Un seul utilisateur par filtre
const alice = await Utilisateur.findOne({ nom: "Alice Dupont" });
console.log("Trouve :", alice.nom, alice.email);

// Par _id
const parId = await Utilisateur.findById(alice._id);
console.log("Par ID :", parId.nom);

// Avec filtre, projection et tri
const resultats = await Utilisateur.find(
  { age: { $gte: 25 } },          // Filtre : age >= 25
  { nom: 1, age: 1, _id: 0 }      // Projection : nom et age
).sort({ age: -1 });               // Tri : age decroissant

console.log("Resultats :", resultats);

// Avec pagination
const page1 = await Utilisateur.find()
  .sort({ nom: 1 })
  .skip(0)
  .limit(2);
console.log("Page 1 :", page1.map(u => u.nom));
```

---

### Étape 7 : Modifier des documents (Update)

```javascript
// Modifier un document et recuperer le resultat
const modifie = await Utilisateur.findOneAndUpdate(
  { email: "alice@example.com" },            // Filtre
  { $set: { age: 29 }, $push: { competences: "TypeScript" } },  // Modification
  { new: true }                               // Retourne le document modifie (pas l'ancien)
);
console.log("Alice modifiee :", modifie.age, modifie.competences);

// Modifier plusieurs documents
const resultat = await Utilisateur.updateMany(
  { role: "utilisateur" },
  { $set: { actif: true } }
);
console.log(`${resultat.modifiedCount} utilisateurs modifies`);

// Modifier par _id
await Utilisateur.findByIdAndUpdate(
  modifie._id,
  { $set: { "adresse.ville": "Marseille" } }
);
```

---

### Étape 8 : Supprimer des documents (Delete)

```javascript
// Supprimer un document
const supprime = await Utilisateur.findOneAndDelete({ email: "charlie@example.com" });
console.log("Supprime :", supprime.nom);

// Supprimer plusieurs documents
const resultat = await Utilisateur.deleteMany({ actif: false });
console.log(`${resultat.deletedCount} documents supprimes`);

// Supprimer par _id
await Utilisateur.findByIdAndDelete("507f1f77bcf86cd799439011");
```

---

### Étape 9 : Middleware (hooks)

Les middleware Mongoose sont des fonctions exécutées avant ou après certaines opérations :

```javascript
// Middleware "pre" : execute AVANT la sauvegarde
// Mongoose 9 : pas de next() ; pour de l'async, utilise async function ()
utilisateurSchema.pre("save", function () {
  // "this" est le document en cours de sauvegarde
  console.log(`Sauvegarde de l'utilisateur : ${this.nom}`);

  // Exemple : mettre la premiere lettre en majuscule
  if (this.nom) {
    this.nom = this.nom.charAt(0).toUpperCase() + this.nom.slice(1);
  }
});

// Middleware "post" : execute APRES la sauvegarde
utilisateurSchema.post("save", function (doc) {
  console.log(`Utilisateur ${doc.nom} sauvegarde avec l'id ${doc._id}`);
});

// Middleware sur les requetes (find, findOne, etc.)
utilisateurSchema.pre("find", function () {
  // Filtre automatique : ne retourne que les utilisateurs actifs
  this.where({ actif: true });
});
```

**Important** : les middleware doivent être définis **avant** la compilation du model (`mongoose.model()`).

---

### Étape 10 : Méthodes personnalisees

```javascript
// Methode d'instance (sur un document)
utilisateurSchema.methods.saluer = function () {
  return `Bonjour, je suis ${this.nom} et j'ai ${this.age} ans.`;
};

// Methode statique (sur le model)
utilisateurSchema.statics.trouverParVille = function (ville) {
  return this.find({ "adresse.ville": ville });
};

// Propriete virtuelle (calculee, pas stockee en base)
utilisateurSchema.virtual("estMajeur").get(function () {
  return this.age >= 18;
});

// Utilisation
const alice = await Utilisateur.findOne({ nom: "Alice Dupont" });
console.log(alice.saluer());
// "Bonjour, je suis Alice Dupont et j'ai 29 ans."

console.log(alice.estMajeur);
// true

const parisiens = await Utilisateur.trouverParVille("Paris");
console.log(`${parisiens.length} utilisateurs a Paris`);
```

---

### Étape 11 : Relations avec populate

Créé un schéma d'articles qui référence des utilisateurs :

```javascript
// Schema Article avec reference a Utilisateur
const articleSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },

  // Reference a un utilisateur (cle etrangere)
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur",        // Nom du model reference
    required: true
  },

  // Tableau de sous-documents (commentaires imbriques)
  commentaires: [{
    texte: { type: String, required: true },
    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Utilisateur"
    },
    date: { type: Date, default: Date.now }
  }],

  date_publication: { type: Date, default: Date.now }
});

const Article = mongoose.model("Article", articleSchema);
```

```javascript
// Creer un article
const alice = await Utilisateur.findOne({ email: "alice@example.com" });
const bob = await Utilisateur.findOne({ email: "bob@example.com" });

const article = await Article.create({
  titre: "Introduction a MongoDB",
  contenu: "MongoDB est une base de donnees NoSQL orientee document...",
  auteur: alice._id
});

// Ajouter un commentaire
article.commentaires.push({
  texte: "Super article, merci !",
  auteur: bob._id
});
await article.save();

// Lire l'article SANS populate : auteur est un ObjectId
const sansPop = await Article.findOne({ titre: "Introduction a MongoDB" });
console.log("Auteur (sans populate) :", sansPop.auteur);
// ObjectId('507f1f77bcf86cd799439011')

// Lire l'article AVEC populate : auteur est un objet complet
const avecPop = await Article.findOne({ titre: "Introduction a MongoDB" })
  .populate("auteur", "nom email")       // Charge l'auteur (uniquement nom et email)
  .populate("commentaires.auteur", "nom");  // Charge les auteurs des commentaires

console.log("Auteur (avec populate) :", avecPop.auteur.nom);
// "Alice Dupont"
console.log("Commentaire par :", avecPop.commentaires[0].auteur.nom);
// "Bob Martin"
```

**Explication de populate** :

| Paramètre | Description |
| --------- | ----------- |
| Premier argument | Chemin du champ a populer (`"auteur"`) |
| Deuxième argument | Projection - champs a inclure (`"nom email"`) |

**Ce que populate fait** : il remplace l'ObjectId par le document complet (ou les champs projetes) en faisant automatiquement une requête supplémentaire a MongoDB.

---

### Étape 12 : TypeScript avec Mongoose

Mongoose fonctionne bien avec TypeScript. Voici un exemple :

```typescript
// models/Utilisateur.ts
import mongoose, { Schema, Document } from "mongoose";

// Interface TypeScript pour le document
interface IUtilisateur extends Document {
  nom: string;
  email: string;
  age: number;
  role: "utilisateur" | "moderateur" | "admin";
  actif: boolean;
  competences: string[];
  inscription: Date;
}

// Schema avec les types verifies a la compilation ET a l'execution
const utilisateurSchema = new Schema<IUtilisateur>({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 },
  role: { type: String, enum: ["utilisateur", "moderateur", "admin"], default: "utilisateur" },
  actif: { type: Boolean, default: true },
  competences: [String],
  inscription: { type: Date, default: Date.now }
});

// Le model est type avec l'interface
const Utilisateur = mongoose.model<IUtilisateur>("Utilisateur", utilisateurSchema);

export default Utilisateur;
```

---

### Étape 13 : Nettoyage

```bash
# Supprime le conteneur MongoDB
docker rm -f mongo-mongoose

# Supprime le projet de demo (optionnel)
rm -rf mongoose-demo
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npm install mongoose` | Installe Mongoose |
| `mongoose.connect(url)` | Connexion a MongoDB |
| `mongoose.disconnect()` | Ferme la connexion |
| `new mongoose.Schema({})` | Définit un schéma |
| `mongoose.model("Nom", schema)` | Compile un model |
| `Model.create({})` | Créé et sauvegarde un document |
| `Model.find({})` | Recherche des documents |
| `Model.findOne({})` | Recherche un seul document |
| `Model.findById(id)` | Recherche par _id |
| `Model.findOneAndUpdate({}, {}, { new: true })` | Modifie et retourne |
| `Model.findOneAndDelete({})` | Supprime et retourne |
| `.populate("champ", "projection")` | Charge les documents lies |

---

## Pièges Fréquents

### Piège 1 : Oublier await sur les opérations Mongoose

⚠️ **Problème** : Tu appelles `Utilisateur.find()` sans `await`. La variable contient une promesse, pas les résultats.

✅ **Solution** : Toutes les opérations Mongoose retournent des promesses. Utilise toujours `await` :

```javascript
// Mauvais : resultats est une promesse
const resultats = Utilisateur.find();
console.log(resultats);  // Promise { <pending> }

// Bon : resultats est un tableau de documents
const resultats = await Utilisateur.find();
console.log(resultats);  // [ { nom: "Alice", ... }, ... ]
```

---

### Piège 2 : Définir les middleware après le model

⚠️ **Problème** : Tu définis un middleware `pre("save")` après `mongoose.model()`. Le middleware n'est jamais exécuté.

✅ **Solution** : Définis toujours les middleware, méthodes et virtuels **avant** la compilation du model :

```javascript
const schema = new mongoose.Schema({ nom: String });

// Bon : middleware AVANT model (sans next() depuis Mongoose 9)
schema.pre("save", function () { /* ... */ });

// Compilation du model
const Model = mongoose.model("Model", schema);
```

---

### Piège 3 : Ne pas gérer les erreurs de connexion

⚠️ **Problème** : MongoDB n'est pas lance ou le port est incorrect. L'application crash sans message clair.

✅ **Solution** : Entoure la connexion d'un try/catch et gère les erreurs :

```javascript
try {
  await mongoose.connect("mongodb://localhost:27017/monapp");
} catch (error) {
  console.error("Impossible de se connecter a MongoDB :", error.message);
  process.exit(1);
}
```

---

### Piège 4 : populate() sans ref dans le schéma

⚠️ **Problème** : Tu appelles `.populate("auteur")` mais le champ `auteur` dans le schéma n'a pas de `ref`. Mongoose ne sait pas dans quelle collection chercher.

✅ **Solution** : Vérifie que le champ a un `ref` qui pointe vers le nom du model :

```javascript
// Schema correct pour populate
const articleSchema = new mongoose.Schema({
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Utilisateur"    // Nom exact du model (sensible a la casse)
  }
});
```

---

## Checklist de Validation

- [ ] Je sais installer et configurer Mongoose dans un projet Node.js
- [ ] Je sais définir un schéma avec des types et des validations
- [ ] Je sais compiler un model à partir d'un schéma
- [ ] Je sais créer, lire, modifier et supprimer des documents avec Mongoose
- [ ] Je sais utiliser les middleware pre et post
- [ ] Je sais définir des méthodes d'instance et des méthodes statiques
- [ ] Je sais créer des relations avec ObjectId et ref
- [ ] Je sais utiliser populate pour charger les documents lies
- [ ] Je sais gérer les erreurs de validation

---

## Exercice Pratique

**Énoncé** : Créé une mini-application de blog avec Mongoose.

**Indications** :

- Définis un schéma `Auteur` (nom, email unique, bio, date_inscription)
- Définis un schéma `Article` (titre, contenu, auteur en référence, tags en tableau, publie en booléen, date_creation)
- Ajoute une validation personnalisee : le titre doit faire entre 5 et 100 caractères
- Ajoute un middleware pre("save") qui met `date_creation` a la date courante si non définie
- Créé 2 auteurs et 4 articles
- Affiche tous les articles avec les informations de l'auteur (populate)
- Affiche les articles d'un auteur spécifique
- Modifie le statut "publie" d'un article
- Supprime un article et vérifie

**Résultat attendu** : Une application fonctionnelle avec schémas valides, relations et populate.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
docker run --name mongo-blog -d -p 27017:27017 mongo:8
mkdir blog-demo && cd blog-demo
npm init -y
npm install mongoose
```

Ajoute `"type": "module"` dans `package.json`, puis créé `index.js` :

```javascript
import mongoose from "mongoose";

// --- Schemas ---

const auteurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  bio: { type: String, default: "" },
  date_inscription: { type: Date, default: Date.now }
});

const articleSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    minlength: [5, "Le titre doit faire au moins 5 caracteres"],
    maxlength: [100, "Le titre ne peut pas depasser 100 caracteres"]
  },
  contenu: { type: String, required: true },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: "Auteur", required: true },
  tags: [String],
  publie: { type: Boolean, default: false },
  date_creation: { type: Date }
});

// Middleware (style Mongoose 9 : pas de next())
articleSchema.pre("save", function () {
  if (!this.date_creation) {
    this.date_creation = new Date();
  }
});

// Models
const Auteur = mongoose.model("Auteur", auteurSchema);
const Article = mongoose.model("Article", articleSchema);

// --- Application ---

async function main() {
  await mongoose.connect("mongodb://localhost:27017/blog-demo");
  console.log("Connecte a MongoDB");

  // Nettoyage initial
  await Auteur.deleteMany({});
  await Article.deleteMany({});

  // Creer 2 auteurs
  const marie = await Auteur.create({
    nom: "Marie Curie",
    email: "marie@example.com",
    bio: "Passionnee de sciences et de technologie"
  });

  const paul = await Auteur.create({
    nom: "Paul Verlaine",
    email: "paul@example.com",
    bio: "Ecrivain et poete"
  });

  // Creer 4 articles
  await Article.create([
    {
      titre: "Introduction a MongoDB",
      contenu: "MongoDB est une base NoSQL orientee document...",
      auteur: marie._id,
      tags: ["mongodb", "nosql", "database"],
      publie: true
    },
    {
      titre: "Node.js et Express",
      contenu: "Express est un framework minimaliste pour Node.js...",
      auteur: marie._id,
      tags: ["nodejs", "express", "backend"],
      publie: true
    },
    {
      titre: "La poesie moderne",
      contenu: "La poesie moderne se distingue par sa liberte formelle...",
      auteur: paul._id,
      tags: ["poesie", "litterature"],
      publie: false
    },
    {
      titre: "Guide de TypeScript",
      contenu: "TypeScript ajoute le typage statique a JavaScript...",
      auteur: paul._id,
      tags: ["typescript", "javascript"],
      publie: true
    }
  ]);

  // Tous les articles avec populate
  const articles = await Article.find()
    .populate("auteur", "nom email")
    .sort({ date_creation: -1 });

  console.log("\n--- Tous les articles ---");
  articles.forEach(a => {
    console.log(`${a.titre} - par ${a.auteur.nom} (${a.publie ? "publie" : "brouillon"})`);
  });

  // Articles de Marie
  const articlesMarie = await Article.find({ auteur: marie._id })
    .populate("auteur", "nom");
  console.log(`\n--- Articles de Marie : ${articlesMarie.length} ---`);

  // Publier l'article brouillon
  await Article.findOneAndUpdate(
    { titre: "La poesie moderne" },
    { $set: { publie: true } }
  );
  console.log("\n'La poesie moderne' est maintenant publie");

  // Supprimer un article
  const supprime = await Article.findOneAndDelete({ titre: "Guide de TypeScript" });
  console.log(`\nArticle supprime : ${supprime.titre}`);

  // Verification finale
  const restants = await Article.countDocuments();
  console.log(`\nArticles restants : ${restants}`);

  await mongoose.disconnect();
}

main().catch(console.error);
```

```bash
node index.js
```

**Résultat attendu** :

```text
Connecte a MongoDB

--- Tous les articles ---
Guide de TypeScript - par Paul Verlaine (publie)
La poesie moderne - par Paul Verlaine (brouillon)
Node.js et Express - par Marie Curie (publie)
Introduction a MongoDB - par Marie Curie (publie)

--- Articles de Marie : 2 ---

'La poesie moderne' est maintenant publie

Article supprime : Guide de TypeScript

Articles restants : 3
```

```bash
docker rm -f mongo-blog
rm -rf blog-demo
```

---

## Navigation

← Fiche précédente : **[Indexation et performances](06-indexation-performances.md)**

→ Fiche suivante : **[Projet intégrateur](08-projet-integrateur.md)**
