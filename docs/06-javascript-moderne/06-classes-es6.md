---
tags:
  - JavaScript
  - Intermédiaire
  - Concept
description: "Maîtriser les classes ES6 : syntaxe, constructeur, héritage, méthodes statiques, getters/setters et champs privés."
estimated_time: "75 min"
fiche_number: 6
total_fiches: 14
cursus: "JavaScript Moderne"
---

# 06 - Classes ES6

> **En bref** : Comprendre la syntaxe des classes ES6, l'héritage avec `extends`/`super`, les méthodes statiques, les getters/setters et les champs privés (`#`). Lecture estimée : 75 min.

## Prérequis

- Fiche 01 : [let, const et portée](01-let-const-portee.md)
- Fiche 02 : [Arrow functions et this](02-arrow-functions-this.md)
- Fiche 05 : [Modules ES (import/export)](05-modules-es.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des classes avec constructeur, méthodes et héritage, utiliser les champs privés pour l'encapsulation, et comparer les classes avec les fonctions constructeur.

---

## Concepts

### Qu'est-ce qu'une classe en JavaScript ?

**Définition** : Une classe est un modèle (un plan) pour créer des objets qui partagent la même structure et les mêmes comportements. En JavaScript, les classes sont du "sucre syntaxique" au-dessus du système de prototypes existant.

**Le problème que les classes résolvent** :

Sans les classes, voici les problèmes rencontrés :

1. **Syntaxe confuse** : les fonctions constructeur et la manipulation de `prototype` sont difficiles à lire et à comprendre.
2. **Héritage complexe** : implémenter l'héritage avec les prototypes nécessite plusieurs lignes de code technique.
3. **Pas d'encapsulation native** : aucun moyen de rendre des propriétés réellement privées.

**Comment les classes résolvent ces problèmes** :

| Problème | Solution apportée par les classes |
| -------- | --------------------------------- |
| Syntaxe confuse | Syntaxe `class` claire et familière |
| Héritage complexe | `extends` et `super` pour l'héritage en une ligne |
| Pas d'encapsulation | Champs privés avec `#` (ES2022) |

**Analogie concrète** : Une classe est comme un plan d'architecte pour une maison. Le plan décrit les pièces (propriétés) et les fonctionnalités (méthodes). Chaque maison construite à partir de ce plan est une instance. Le plan peut être basé sur un plan plus simple (héritage) : un plan de "maison avec piscine" hérite du plan de "maison" et ajoute la piscine.

**Ce qu'une classe n'est PAS** :

- Une classe JavaScript n'est pas une classe au sens de Java ou C++. En JavaScript, les classes sont construites sur les prototypes, pas sur un vrai système de classes.
- Une classe n'est pas un objet. C'est un modèle pour créer des objets. L'objet créé avec `new` est l'instance.

---

### Syntaxe de base d'une classe

**Définition** : Une classe se déclare avec le mot-clé `class`, suivi d'un nom et d'un corps entre accolades contenant un `constructor` et des méthodes.

```javascript
// Déclaration d'une classe
class Utilisateur {
  // Le constructeur est appelé automatiquement par "new"
  constructor(nom, email) {
    // "this" fait référence à l'instance en cours de création
    this.nom = nom;
    this.email = email;
    this.actif = true; // Valeur par défaut
  }

  // Méthode : disponible sur chaque instance
  sePresenter() {
    return `Je suis ${this.nom} (${this.email})`;
  }

  // Méthode pour désactiver le compte
  desactiver() {
    this.actif = false;
  }
}

// Créer une instance avec "new"
const alice = new Utilisateur("Alice", "alice@example.com");
console.log(alice.sePresenter()); // "Je suis Alice (alice@example.com)"
console.log(alice.actif); // true
```

---

Le diagramme suivant représente la hiérarchie d'héritage entre une classe parente et ses sous-classes.

<div class="diagram-design">
<p><a href="../../diagrams/06-javascript-moderne-06-classes-es6-1.html">Syntaxe de base d&#x27;une classe (HTML + SVG)</a></p>
<iframe src="../../diagrams/06-javascript-moderne-06-classes-es6-1.html" title="Syntaxe de base d&#x27;une classe" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

### Héritage avec `extends` et `super`

**Définition** : `extends` permet à une classe d'hériter des propriétés et méthodes d'une autre classe (la classe parente). `super` permet d'appeler le constructeur ou les méthodes de la classe parente.

```javascript
// Classe parente
class Animal {
  constructor(nom, type) {
    this.nom = nom;
    this.type = type;
  }

  decrire() {
    return `${this.nom} est un ${this.type}`;
  }
}

// Classe enfant : hérite de Animal avec "extends"
class Chien extends Animal {
  constructor(nom, race) {
    // super() appelle le constructeur de la classe parente
    // Il DOIT être appelé avant d'utiliser "this"
    super(nom, "chien");
    this.race = race; // Propriété spécifique au Chien
  }

  // Méthode spécifique au Chien
  aboyer() {
    return `${this.nom} : Woof !`;
  }

  // On peut surcharger (override) une méthode parente
  decrire() {
    // super.decrire() appelle la méthode de la classe parente
    return `${super.decrire()} de race ${this.race}`;
  }
}

const rex = new Chien("Rex", "Berger Allemand");
console.log(rex.decrire()); // "Rex est un chien de race Berger Allemand"
console.log(rex.aboyer()); // "Rex : Woof !"
```

---

### Méthodes et propriétés statiques

**Définition** : Une méthode ou propriété statique appartient à la classe elle-même, pas aux instances. On y accède avec `Classe.methode()` et non `instance.methode()`.

```javascript
class MathUtils {
  // Propriété statique : appartient à la classe
  static PI = 3.14159265359;

  // Méthode statique : appelée sur la classe, pas sur une instance
  static arrondir(nombre, decimales = 2) {
    const facteur = 10 ** decimales;
    return Math.round(nombre * facteur) / facteur;
  }

  static max(...nombres) {
    return Math.max(...nombres);
  }
}

// Utilisation : on appelle directement sur la classe
console.log(MathUtils.PI); // 3.14159265359
console.log(MathUtils.arrondir(3.14159, 3)); // 3.142
console.log(MathUtils.max(5, 3, 8, 1)); // 8

// On ne peut PAS appeler une méthode statique sur une instance
// const m = new MathUtils();
// m.arrondir(3.14); // TypeError: m.arrondir is not a function
```

**Quand utiliser `static`** :

| Utilisation | Exemple |
| ----------- | ------- |
| Fonction utilitaire liée à la classe | `MathUtils.arrondir()` |
| Méthode de fabrication (factory) | `Utilisateur.depuis(json)` |
| Constante liée à la classe | `HttpStatus.OK = 200` |
| Compteur d'instances | `Utilisateur.compteur` |

---

### Getters et setters

**Définition** : Les getters (`get`) et setters (`set`) sont des méthodes qui se comportent comme des propriétés. Ils permettent d'exécuter du code quand on lit ou écrit une valeur.

```javascript
class Temperature {
  constructor(celsius) {
    this._celsius = celsius; // Convention : _ = propriété "privée"
  }

  // Getter : s'utilise comme une propriété (sans parenthèses)
  get celsius() {
    return this._celsius;
  }

  // Setter : s'utilise avec l'opérateur d'affectation
  set celsius(valeur) {
    if (valeur < -273.15) {
      throw new Error("Température impossible (en dessous du zéro absolu)");
    }
    this._celsius = valeur;
  }

  // Getter calculé : convertit en Fahrenheit à la volée
  get fahrenheit() {
    return this._celsius * 9 / 5 + 32;
  }

  // Setter qui convertit depuis Fahrenheit
  set fahrenheit(valeur) {
    this._celsius = (valeur - 32) * 5 / 9;
  }
}

const temp = new Temperature(20);
console.log(temp.celsius); // 20 - appelle le getter
console.log(temp.fahrenheit); // 68 - appelle le getter calculé

temp.fahrenheit = 100; // Appelle le setter
console.log(temp.celsius); // 37.78 (environ)
```

---

### Champs privés (`#`)

**Définition** : Les champs privés (ES2022) utilisent le préfixe `#` pour rendre une propriété ou méthode inaccessible en dehors de la classe. C'est une vraie encapsulation, contrairement à la convention `_`.

```javascript
class CompteBancaire {
  // Champ privé : accessible uniquement dans la classe
  #solde;
  #titulaire;

  constructor(titulaire, soldeInitial = 0) {
    this.#titulaire = titulaire;
    this.#solde = soldeInitial;
  }

  // Méthode publique pour déposer
  deposer(montant) {
    if (montant <= 0) throw new Error("Le montant doit être positif");
    this.#solde += montant;
    return this.#solde;
  }

  // Méthode publique pour retirer
  retirer(montant) {
    if (montant <= 0) throw new Error("Le montant doit être positif");
    if (montant > this.#solde) throw new Error("Solde insuffisant");
    this.#solde -= montant;
    return this.#solde;
  }

  // Getter pour lire le solde (lecture seule)
  get solde() {
    return this.#solde;
  }

  // Méthode privée : inaccessible depuis l'extérieur
  #formaterSolde() {
    return `${this.#solde.toFixed(2)} €`;
  }

  // Méthode publique qui utilise la méthode privée
  afficher() {
    return `${this.#titulaire} : ${this.#formaterSolde()}`;
  }
}

const compte = new CompteBancaire("Alice", 1000);
compte.deposer(500);
console.log(compte.afficher()); // "Alice : 1500.00 €"
console.log(compte.solde); // 1500

// Les champs privés sont vraiment privés
// console.log(compte.#solde); // SyntaxError: Private field '#solde'
// compte.#solde = 999999; // SyntaxError
```

**Comparaison convention `_` vs champs privés `#`** :

| Convention `_` | Champs privés `#` |
| -------------- | ----------------- |
| Simple convention, pas d'enforcement | Vraie encapsulation par le moteur |
| `this._solde` est accessible depuis l'extérieur | `this.#solde` provoque une erreur hors de la classe |
| Historique, largement utilisé | Moderne (ES2022), supporté partout |
| Compatible avec toutes les versions | Nécessite un moteur JS moderne (Node.js actuel ou navigateur récent) |

---

## Étapes Pratiques

### Étape 1 : Créer une classe simple

Crée le fichier `06-classes.js` :

```javascript
// Classe simple avec constructeur et méthodes
class Produit {
  constructor(nom, prix, quantite = 0) {
    this.nom = nom;
    this.prix = prix;
    this.quantite = quantite;
  }

  // Méthode pour calculer le stock total
  valeurStock() {
    return this.prix * this.quantite;
  }

  // Méthode pour afficher le produit
  toString() {
    return `${this.nom} - ${this.prix.toFixed(2)} € (stock: ${this.quantite})`;
  }
}

// Créer des instances
const clavier = new Produit("Clavier mécanique", 89.99, 15);
const souris = new Produit("Souris ergonomique", 49.99, 25);

console.log(clavier.toString());
console.log(souris.toString());
console.log(`Valeur stock clavier : ${clavier.valeurStock().toFixed(2)} €`);
```

```bash
node ~/js-moderne/06-classes.js
```

**Résultat attendu** :

```text
Clavier mécanique - 89.99 € (stock: 15)
Souris ergonomique - 49.99 € (stock: 25)
Valeur stock clavier : 1349.85 €
```

---

### Étape 2 : Héritage avec `extends` et `super`

```javascript
// Classe parente
class Forme {
  constructor(couleur = "noir") {
    this.couleur = couleur;
  }

  decrire() {
    return `Forme de couleur ${this.couleur}`;
  }
}

// Classe enfant Rectangle
class Rectangle extends Forme {
  constructor(largeur, hauteur, couleur) {
    super(couleur); // Appelle le constructeur de Forme
    this.largeur = largeur;
    this.hauteur = hauteur;
  }

  aire() {
    return this.largeur * this.hauteur;
  }

  perimetre() {
    return 2 * (this.largeur + this.hauteur);
  }

  decrire() {
    return `${super.decrire()} - Rectangle ${this.largeur}x${this.hauteur}`;
  }
}

// Classe enfant Cercle
class Cercle extends Forme {
  constructor(rayon, couleur) {
    super(couleur);
    this.rayon = rayon;
  }

  aire() {
    return Math.PI * this.rayon ** 2;
  }

  perimetre() {
    return 2 * Math.PI * this.rayon;
  }

  decrire() {
    return `${super.decrire()} - Cercle rayon ${this.rayon}`;
  }
}

// Tester l'héritage
const rect = new Rectangle(10, 5, "bleu");
const cercle = new Cercle(7, "rouge");

console.log(rect.decrire());
console.log(`Aire : ${rect.aire()}, Périmètre : ${rect.perimetre()}`);

console.log(cercle.decrire());
console.log(`Aire : ${cercle.aire().toFixed(2)}, Périmètre : ${cercle.perimetre().toFixed(2)}`);

// instanceof vérifie la chaîne d'héritage
console.log("\nrect instanceof Rectangle :", rect instanceof Rectangle); // true
console.log("rect instanceof Forme :", rect instanceof Forme); // true
```

```bash
node ~/js-moderne/06-classes.js
```

**Résultat attendu** :

```text
Forme de couleur bleu - Rectangle 10x5
Aire : 50, Périmètre : 30
Forme de couleur rouge - Cercle rayon 7
Aire : 153.94, Périmètre : 43.98
rect instanceof Rectangle : true
rect instanceof Forme : true
```

---

### Étape 3 : Méthodes statiques et factory pattern

```javascript
// Classe avec méthodes statiques
class Utilisateur {
  static compteur = 0;

  constructor(nom, email) {
    Utilisateur.compteur++;
    this.id = Utilisateur.compteur;
    this.nom = nom;
    this.email = email;
  }

  // Factory method : crée une instance à partir de données JSON
  static depuisJSON(json) {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    return new Utilisateur(data.nom, data.email);
  }

  // Factory method : crée un utilisateur anonyme
  static anonyme() {
    return new Utilisateur("Anonyme", "anonyme@example.com");
  }

  toString() {
    return `#${this.id} ${this.nom} <${this.email}>`;
  }
}

// Créer des instances de différentes façons
const u1 = new Utilisateur("Alice", "alice@example.com");
const u2 = Utilisateur.depuisJSON('{"nom": "Bob", "email": "bob@example.com"}');
const u3 = Utilisateur.anonyme();

console.log(u1.toString());
console.log(u2.toString());
console.log(u3.toString());
console.log("Total utilisateurs :", Utilisateur.compteur);
```

```bash
node ~/js-moderne/06-classes.js
```

**Résultat attendu** :

```text
#1 Alice <alice@example.com>
#2 Bob <bob@example.com>
#3 Anonyme <anonyme@example.com>
Total utilisateurs : 3
```

---

### Étape 4 : Getters et setters

```javascript
// Classe avec getters et setters pour la validation
class Personne {
  #nom;
  #dateNaissance;

  constructor(nom, dateNaissance) {
    this.nom = nom; // Utilise le setter pour valider
    this.#dateNaissance = new Date(dateNaissance);
  }

  // Getter pour le nom
  get nom() {
    return this.#nom;
  }

  // Setter avec validation
  set nom(valeur) {
    if (typeof valeur !== "string" || valeur.trim().length < 2) {
      throw new Error("Le nom doit contenir au moins 2 caractères");
    }
    this.#nom = valeur.trim();
  }

  // Getter calculé : l'âge est calculé dynamiquement
  get age() {
    const aujourdhui = new Date();
    let age = aujourdhui.getFullYear() - this.#dateNaissance.getFullYear();
    const moisDiff = aujourdhui.getMonth() - this.#dateNaissance.getMonth();
    if (moisDiff < 0 || (moisDiff === 0 && aujourdhui.getDate() < this.#dateNaissance.getDate())) {
      age--;
    }
    return age;
  }

  // Getter calculé : vérifie si la personne est majeure
  get estMajeur() {
    return this.age >= 18;
  }
}

const alice = new Personne("Alice", "2000-06-15");
console.log(`${alice.nom}, ${alice.age} ans`);
console.log(`Majeur : ${alice.estMajeur}`);

// Le setter valide les données
try {
  alice.nom = "A"; // Trop court - erreur
} catch (e) {
  console.log("Erreur :", e.message);
}

alice.nom = "Alicia"; // Valide
console.log(`Nouveau nom : ${alice.nom}`);
```

```bash
node ~/js-moderne/06-classes.js
```

**Résultat attendu** :

```text
Alice, [age calculé] ans
Majeur : true
Erreur : Le nom doit contenir au moins 2 caractères
Nouveau nom : Alicia
```

---

### Étape 5 : Champs privés et encapsulation

```javascript
// Classe avec encapsulation complète
class ListeDeCourses {
  // Champs privés
  #articles = [];
  #budgetMax;

  constructor(budgetMax = Infinity) {
    this.#budgetMax = budgetMax;
  }

  // Méthode publique pour ajouter un article
  ajouter(nom, prix) {
    const totalActuel = this.#calculerTotal();
    if (totalActuel + prix > this.#budgetMax) {
      throw new Error(
        `Budget dépassé ! Total actuel: ${totalActuel.toFixed(2)} €, article: ${prix.toFixed(2)} €, max: ${this.#budgetMax.toFixed(2)} €`
      );
    }
    this.#articles.push({ nom, prix });
  }

  // Méthode privée : inaccessible depuis l'extérieur
  #calculerTotal() {
    return this.#articles.reduce((acc, a) => acc + a.prix, 0);
  }

  // Getter pour le total (utilise la méthode privée)
  get total() {
    return this.#calculerTotal();
  }

  // Getter pour le nombre d'articles
  get taille() {
    return this.#articles.length;
  }

  // Affichage
  afficher() {
    console.log(`--- Liste de courses (budget: ${this.#budgetMax.toFixed(2)} €) ---`);
    this.#articles.forEach(({ nom, prix }, i) => {
      console.log(`${i + 1}. ${nom} - ${prix.toFixed(2)} €`);
    });
    console.log(`Total : ${this.total.toFixed(2)} € / ${this.#budgetMax.toFixed(2)} €`);
  }
}

const liste = new ListeDeCourses(20);
liste.ajouter("Pain", 1.5);
liste.ajouter("Lait", 1.2);
liste.ajouter("Fromage", 8.9);
liste.afficher();

// Tester le dépassement de budget
try {
  liste.ajouter("Vin", 15);
} catch (e) {
  console.log(`\nErreur : ${e.message}`);
}

// Les champs privés sont vraiment inaccessibles
// console.log(liste.#articles); // SyntaxError
```

```bash
node ~/js-moderne/06-classes.js
```

**Résultat attendu** :

```text
--- Liste de courses (budget: 20.00 €) ---
1. Pain - 1.50 €
2. Lait - 1.20 €
3. Fromage - 8.90 €
Total : 11.60 € / 20.00 €

Erreur : Budget dépassé ! Total actuel: 11.60 €, article: 15.00 €, max: 20.00 €
```

---

### Étape 6 : Comparaison avec les fonctions constructeur

```javascript
// Ancienne méthode : fonction constructeur + prototype
function VoitureAncien(marque, modele) {
  this.marque = marque;
  this.modele = modele;
}

VoitureAncien.prototype.decrire = function () {
  return `${this.marque} ${this.modele}`;
};

// Nouvelle méthode : classe ES6 (même résultat)
class VoitureModerne {
  constructor(marque, modele) {
    this.marque = marque;
    this.modele = modele;
  }

  decrire() {
    return `${this.marque} ${this.modele}`;
  }
}

const v1 = new VoitureAncien("Peugeot", "208");
const v2 = new VoitureModerne("Renault", "Clio");

console.log(v1.decrire()); // "Peugeot 208"
console.log(v2.decrire()); // "Renault Clio"

// Les deux utilisent le même mécanisme sous le capot (prototypes)
console.log(typeof VoitureAncien); // "function"
console.log(typeof VoitureModerne); // "function" - une classe EST une fonction
```

```bash
node ~/js-moderne/06-classes.js
```

**Résultat attendu** :

```text
Peugeot 208
Renault Clio
function
function
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `class Nom { ... }` | Déclarer une classe |
| `constructor(args) { ... }` | Définir le constructeur |
| `extends ClasseParente` | Hériter d'une classe |
| `super(args)` | Appeler le constructeur parent |
| `super.methode()` | Appeler une méthode du parent |
| `static methode() { ... }` | Méthode statique |
| `get prop() { ... }` | Getter |
| `set prop(val) { ... }` | Setter |
| `#champPrive` | Champ privé |
| `new Classe(args)` | Créer une instance |
| `instance instanceof Classe` | Vérifier le type |

---

## Pièges Fréquents

### Piège 1 : Oublier `super()` dans le constructeur d'une classe enfant

**Problème** : Tu ne rappelles pas `super()` dans le constructeur d'une classe qui utilise `extends`.

**Solution** : Appelle toujours `super()` en premier dans le constructeur d'une classe enfant, avant d'utiliser `this`.

```javascript
// ❌ Erreur : super() manquant
class Enfant extends Parent {
  constructor() {
    // this.prop = "valeur"; // ReferenceError: Must call super constructor
  }
}

// ✅ Correct : super() en premier
class Enfant2 extends Parent {
  constructor() {
    super(); // Toujours en premier
    this.prop = "valeur";
  }
}
```

---

### Piège 2 : Confondre méthode d'instance et méthode statique

**Problème** : Tu appelles une méthode statique sur une instance ou une méthode d'instance sur la classe.

**Solution** : Les méthodes `static` s'appellent sur la classe. Les autres méthodes s'appellent sur les instances.

```javascript
class Exemple {
  static methodeStatique() {
    return "statique";
  }
  methodeInstance() {
    return "instance";
  }
}

const ex = new Exemple();
console.log(Exemple.methodeStatique()); // "statique"
console.log(ex.methodeInstance()); // "instance"
// Exemple.methodeInstance(); // TypeError
// ex.methodeStatique(); // TypeError
```

---

### Piège 3 : Les classes ne sont pas hoistées

**Problème** : Tu utilises une classe avant sa déclaration.

**Solution** : Déclare toujours la classe avant de l'utiliser. Contrairement aux fonctions déclarées avec `function`, les classes ne sont pas hoistées.

```javascript
// ❌ Erreur : la classe n'est pas hoistée
// const a = new Animal("Rex"); // ReferenceError
// class Animal { ... }

// ✅ Déclarer avant d'utiliser
class Animal {
  constructor(nom) {
    this.nom = nom;
  }
}
const a = new Animal("Rex");
```

---

### Piège 4 : `this` dans les méthodes passées comme callback

**Problème** : Tu passes une méthode de classe comme callback, et `this` est perdu.

**Solution** : Utilise `.bind(this)` dans le constructeur ou utilise une arrow function comme propriété de classe.

```javascript
class Bouton {
  constructor(label) {
    this.label = label;
    // Lier la méthode au constructeur
    this.cliquer = this.cliquer.bind(this);
  }

  cliquer() {
    console.log(`Bouton "${this.label}" cliqué`);
  }
}

// Alternative : propriété arrow function
class Bouton2 {
  constructor(label) {
    this.label = label;
  }

  // Arrow function : this est toujours l'instance
  cliquer = () => {
    console.log(`Bouton "${this.label}" cliqué`);
  };
}
```

---

## Checklist de Validation

- [ ] Je sais déclarer une classe avec `constructor` et des méthodes
- [ ] Je sais utiliser `extends` et `super` pour l'héritage
- [ ] Je sais créer des méthodes statiques et savoir quand les utiliser
- [ ] Je sais utiliser les getters et setters pour la validation
- [ ] Je sais utiliser les champs privés `#` pour l'encapsulation
- [ ] Je comprends que les classes sont du sucre syntaxique sur les prototypes
- [ ] Je sais quand utiliser `.bind(this)` ou une arrow function pour les callbacks

---

## Exercice Pratique

**Énoncé** : Crée un système de gestion de bibliothèque avec des classes.

1. Crée une classe `Livre` avec : titre, auteur, isbn, disponible (booléen).
2. Crée une classe `Bibliotheque` avec un champ privé `#livres` (tableau).
3. La bibliothèque doit avoir les méthodes : `ajouterLivre(livre)`, `rechercherParAuteur(auteur)`, `emprunter(isbn)`, `retourner(isbn)`, un getter `catalogue` et une méthode statique `depuis(tableauDeLivres)`.
4. Implémente la validation : pas de doublons d'ISBN, pas d'emprunt d'un livre indisponible.

**Indications** :

- Utilise `find()` pour chercher un livre par ISBN.
- Utilise `filter()` pour chercher par auteur.
- Utilise un getter pour retourner une copie du catalogue (pas la référence directe).

**Résultat attendu** :

```text
=== Catalogue (3 livres) ===
- "Le Petit Prince" par Saint-Exupéry [disponible]
- "1984" par Orwell [disponible]
- "L'Étranger" par Camus [disponible]

Emprunt de 1984...
Emprunt réussi.

Livres de Orwell : 1984 [emprunté]

Tentative de ré-emprunt...
Erreur : Ce livre est déjà emprunté

Retour de 1984...
1984 est de nouveau disponible.
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
class Livre {
  constructor(titre, auteur, isbn) {
    this.titre = titre;
    this.auteur = auteur;
    this.isbn = isbn;
    this.disponible = true;
  }

  toString() {
    const statut = this.disponible ? "disponible" : "emprunté";
    return `"${this.titre}" par ${this.auteur} [${statut}]`;
  }
}

class Bibliotheque {
  #livres = [];

  // Méthode statique factory
  static depuis(tableauDeLivres) {
    const biblio = new Bibliotheque();
    tableauDeLivres.forEach((l) => biblio.ajouterLivre(l));
    return biblio;
  }

  ajouterLivre(livre) {
    // Vérifier qu'il n'y a pas de doublon d'ISBN
    if (this.#livres.find((l) => l.isbn === livre.isbn)) {
      throw new Error(`Un livre avec l'ISBN ${livre.isbn} existe déjà`);
    }
    this.#livres.push(livre);
  }

  rechercherParAuteur(auteur) {
    return this.#livres.filter((l) =>
      l.auteur.toLowerCase().includes(auteur.toLowerCase())
    );
  }

  emprunter(isbn) {
    const livre = this.#livres.find((l) => l.isbn === isbn);
    if (!livre) throw new Error("Livre non trouvé");
    if (!livre.disponible) throw new Error("Ce livre est déjà emprunté");
    livre.disponible = false;
    return livre;
  }

  retourner(isbn) {
    const livre = this.#livres.find((l) => l.isbn === isbn);
    if (!livre) throw new Error("Livre non trouvé");
    livre.disponible = true;
    return livre;
  }

  // Getter : retourne une copie du catalogue
  get catalogue() {
    return [...this.#livres];
  }

  afficherCatalogue() {
    console.log(`=== Catalogue (${this.#livres.length} livres) ===`);
    this.#livres.forEach((l) => console.log(`- ${l.toString()}`));
  }
}

// Scénario de test
const biblio = Bibliotheque.depuis([
  new Livre("Le Petit Prince", "Saint-Exupéry", "978-0-1"),
  new Livre("1984", "Orwell", "978-0-2"),
  new Livre("L'Étranger", "Camus", "978-0-3"),
]);

biblio.afficherCatalogue();

console.log("\nEmprunt de 1984...");
biblio.emprunter("978-0-2");
console.log("Emprunt réussi.");

const orwell = biblio.rechercherParAuteur("Orwell");
console.log(`\nLivres de Orwell : ${orwell.map((l) => `${l.titre} [emprunté]`).join(", ")}`);

console.log("\nTentative de ré-emprunt...");
try {
  biblio.emprunter("978-0-2");
} catch (e) {
  console.log(`Erreur : ${e.message}`);
}

console.log("\nRetour de 1984...");
biblio.retourner("978-0-2");
console.log("1984 est de nouveau disponible.");
```

---

## Navigation

← Fiche précédente : **[Modules ES (import/export)](05-modules-es.md)**

→ Fiche suivante : **[Symboles, Map et Set](07-symboles-map-set.md)**
