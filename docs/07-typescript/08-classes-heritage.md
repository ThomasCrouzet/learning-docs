---
tags:
  - TypeScript
  - Intermédiaire
  - Concept
description: "Maîtriser les classes TypeScript : modifieurs d'accès, classes abstraites, implements et parameter properties."
estimated_time: "90 min"
fiche_number: 8
total_fiches: 15
cursus: "TypeScript"
id: "web.typescript.classes-heritage"
course_id: "web.typescript"
content_type: "lesson"
order: 8
---

# 08 - Classes et héritage

> **En bref** : Apprendre les classes TypeScript avec les modifieurs d'accès, les classes abstraites, l'implémentation d'interfaces et les parameter properties. Lecture estimée : 90 min.

## Prérequis

- [07 - Fonctions typées](07-fonctions-typees.md)
- [05 - Objets et interfaces](05-objets-interfaces.md)
- Connaître les classes JavaScript (class, constructor, extends)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les modifieurs d'accès `public`, `private` et `protected`, créer des classes abstraites, implémenter des interfaces avec `implements`, et utiliser les parameter properties.

---

## Concepts

### Que sont les modifieurs d'accès ?

**Définition** : Les modifieurs d'accès (`public`, `private`, `protected`) contrôlent la visibilité des propriétés et méthodes d'une classe. Ils déterminent quelles parties du code peuvent lire ou modifier ces membres.

**Le problème que les modifieurs d'accès résolvent** :

Sans modifieurs d'accès, voici les problèmes rencontrés :

1. **Accès non contrôlé** : En JavaScript, toutes les propriétés d'un objet sont accessibles de l'extérieur. N'importe quel code peut modifier les données internes d'un objet.
2. **Encapsulation impossible** : On ne peut pas cacher les détails d'implémentation. Le code extérieur peut dépendre de propriétés internes qui changent.
3. **API floue** : Sans distinction public/privé, l'utilisateur de la classe ne sait pas quelles propriétés il peut utiliser et lesquelles sont internes.

**Comment les modifieurs d'accès résolvent ces problèmes** :

| Problème | Solution apportée par les modifieurs |
| -------- | ------------------------------------ |
| Accès non contrôlé | `private` empêche l'accès depuis l'extérieur |
| Encapsulation impossible | `private` cache les détails internes |
| API floue | `public` définit clairement l'API accessible |

**Les trois modifieurs** :

| Modifieur | Accessible depuis la classe | Accessible depuis les sous-classes | Accessible de l'extérieur |
| --------- | --------------------------- | ---------------------------------- | ------------------------- |
| `public` | Oui | Oui | Oui |
| `protected` | Oui | Oui | Non |
| `private` | Oui | Non | Non |

**Analogie concrète** : Imagine une entreprise. `public` est le hall d'accueil : tout le monde y a accès. `protected` est la salle de réunion interne : seuls les employés et leurs stagiaires (sous-classes) y ont accès. `private` est le coffre-fort du directeur : seul le directeur (la classe elle-même) y a accès.

---

### Qu'est-ce qu'une classe abstraite ?

**Définition** : Une classe abstraite est une classe qui ne peut pas être instanciée directement. Elle sert de modèle pour d'autres classes. Elle peut contenir des méthodes concrètes (avec implémentation) et des méthodes abstraites (sans implémentation, que les sous-classes doivent obligatoirement implémenter).

**Le problème que les classes abstraites résolvent** :

Sans classes abstraites, voici les problèmes rencontrés :

1. **Code dupliqué** : Plusieurs classes partagent du code commun mais ont des comportements différents sur certains points.
2. **Instanciation invalide** : Une classe de base qui n'a pas de sens seule (comme "Forme") peut être instanciée par erreur.
3. **Contrat non garanti** : On ne peut pas forcer les sous-classes à implémenter certaines méthodes.

**Comment les classes abstraites résolvent ces problèmes** :

| Problème | Solution apportée par les classes abstraites |
| -------- | -------------------------------------------- |
| Code dupliqué | Le code commun est dans la classe abstraite |
| Instanciation invalide | `abstract` empêche l'instanciation directe |
| Contrat non garanti | Les méthodes `abstract` doivent être implémentées |

**Analogie concrète** : Une classe abstraite est comme un patron de couture. Le patron définit la forme générale (code commun) et indique où il faut choisir le tissu (méthodes abstraites). On ne porte pas le patron lui-même : on l'utilise pour fabriquer un vêtement concret.

---

### Qu'est-ce que `implements` ?

**Définition** : Le mot-clé `implements` déclare qu'une classe respecte le contrat défini par une interface. La classe doit implémenter toutes les propriétés et méthodes de l'interface.

**Le problème que `implements` résout** :

Sans `implements`, voici les problèmes rencontrés :

1. **Contrat non vérifié** : Une classe peut prétendre respecter une interface sans que TypeScript ne le vérifie.
2. **Polymorphisme limité** : On ne peut pas garantir que différentes classes ont la même API.

**Comment `implements` résout ces problèmes** :

| Problème | Solution apportée par `implements` |
| -------- | ---------------------------------- |
| Contrat non vérifié | TypeScript vérifie que la classe implémente toute l'interface |
| Polymorphisme limité | Toute classe qui `implements` une interface peut être utilisée là où l'interface est attendue |

**Comparaison `extends` vs `implements`** :

| `extends` | `implements` |
| --------- | ------------ |
| Hérite du code (propriétés et méthodes) | Ne fournit aucun code |
| Une seule classe parente | Plusieurs interfaces possibles |
| La sous-classe est un type de la classe parente | La classe respecte le contrat de l'interface |
| `class Chien extends Animal` | `class Chien implements Bruyant` |

---

## Étapes Pratiques

### Étape 1 : Classe de base avec modifieurs

Crée un fichier `src/classes-base.ts` :

```typescript
// src/classes-base.ts
// Classes TypeScript avec modifieurs d'accès

class CompteBancaire {
  // public : accessible partout (par défaut)
  public titulaire: string;

  // private : accessible uniquement dans cette classe
  private solde: number;

  // protected : accessible dans cette classe et ses sous-classes
  protected banque: string;

  // readonly : ne peut pas être modifié après l'initialisation
  public readonly numero: string;

  constructor(
    titulaire: string,
    solde: number,
    banque: string,
    numero: string
  ) {
    this.titulaire = titulaire;
    this.solde = solde;
    this.banque = banque;
    this.numero = numero;
  }

  // Méthode publique : accessible de l'extérieur
  public deposer(montant: number): void {
    // On peut accéder à this.solde ici (même classe)
    if (montant <= 0) {
      console.log("  Erreur : le montant doit être positif");
      return;
    }
    this.solde += montant;
    this.journaliser(`Dépôt de ${montant} €`);
  }

  public retirer(montant: number): void {
    if (montant <= 0) {
      console.log("  Erreur : le montant doit être positif");
      return;
    }
    if (montant > this.solde) {
      console.log("  Erreur : solde insuffisant");
      return;
    }
    this.solde -= montant;
    this.journaliser(`Retrait de ${montant} €`);
  }

  public consulterSolde(): number {
    // Méthode publique qui expose le solde en lecture seule
    return this.solde;
  }

  // Méthode privée : accessible uniquement dans cette classe
  private journaliser(message: string): void {
    const date: string = new Date().toLocaleDateString("fr-FR");
    console.log(`  [${date}] ${message} (solde: ${this.solde} €)`);
  }
}

// Utilisation
const compte = new CompteBancaire("Alice", 1000, "BNP", "FR76-1234");

console.log("Titulaire :", compte.titulaire); // OK : public
console.log("Numéro :", compte.numero); // OK : public readonly

// compte.solde; // Erreur : Property 'solde' is private
// compte.banque; // Erreur : Property 'banque' is protected
// compte.journaliser("test"); // Erreur : Method 'journaliser' is private
// compte.numero = "autre"; // Erreur : Cannot assign to 'numero' (readonly)

console.log("Solde :", compte.consulterSolde(), "€");
compte.deposer(500);
compte.retirer(200);
console.log("Solde final :", compte.consulterSolde(), "€");
compte.retirer(2000); // Solde insuffisant
```

Compile et exécute :

```bash
npx tsc && node dist/classes-base.js
```

**Résultat attendu** :

```text
Titulaire : Alice
Numéro : FR76-1234
Solde : 1000 €
  [20/03/2026] Dépôt de 500 € (solde: 1500 €)
  [20/03/2026] Retrait de 200 € (solde: 1300 €)
Solde final : 1300 €
  Erreur : solde insuffisant
```

---

### Étape 2 : Parameter properties

Crée un fichier `src/parameter-properties.ts` :

```typescript
// src/parameter-properties.ts
// Raccourci TypeScript pour déclarer et initialiser les propriétés

// Sans parameter properties (version longue)
class ProduitLong {
  public nom: string;
  private prix: number;
  public readonly id: number;

  constructor(nom: string, prix: number, id: number) {
    this.nom = nom;
    this.prix = prix;
    this.id = id;
  }

  public afficher(): string {
    return `[${this.id}] ${this.nom} - ${this.prix} €`;
  }
}

// Avec parameter properties (version courte)
// En ajoutant un modifieur devant le paramètre du constructeur,
// TypeScript crée automatiquement la propriété ET l'initialise
class Produit {
  constructor(
    public nom: string,
    private prix: number,
    public readonly id: number
  ) {
    // Pas besoin de this.nom = nom; etc.
    // TypeScript le fait automatiquement grâce aux modifieurs
  }

  public afficher(): string {
    return `[${this.id}] ${this.nom} - ${this.prix} €`;
  }

  public getPrix(): number {
    return this.prix;
  }
}

// Les deux classes sont fonctionnellement identiques
const produit = new Produit("Clavier", 49.99, 1);
console.log(produit.afficher());
console.log("Nom :", produit.nom); // OK : public
console.log("Prix :", produit.getPrix()); // Via méthode publique
console.log("ID :", produit.id); // OK : public readonly

// Combinaison : parameter properties + propriétés classiques
class Utilisateur {
  // Propriété classique avec valeur par défaut
  public dateInscription: Date = new Date();

  constructor(
    public readonly id: number,
    public nom: string,
    private email: string,
    public actif: boolean = true // Valeur par défaut dans le constructeur
  ) {}

  public afficher(): void {
    console.log(`[${this.id}] ${this.nom} (${this.email})`);
    console.log(`  Actif : ${this.actif}`);
    console.log(
      `  Inscrit le : ${this.dateInscription.toLocaleDateString("fr-FR")}`
    );
  }
}

const alice = new Utilisateur(1, "Alice", "alice@test.fr");
const bob = new Utilisateur(2, "Bob", "bob@test.fr", false);

console.log("\n--- Utilisateurs ---");
alice.afficher();
bob.afficher();
```

Compile et exécute :

```bash
npx tsc && node dist/parameter-properties.js
```

**Résultat attendu** :

```text
[1] Clavier - 49.99 €
Nom : Clavier
Prix : 49.99
ID : 1

--- Utilisateurs ---
[1] Alice (alice@test.fr)
  Actif : true
  Inscrit le : 20/03/2026
[2] Bob (bob@test.fr)
  Actif : false
  Inscrit le : 20/03/2026
```

---

### Étape 3 : Héritage avec `extends`

Crée un fichier `src/heritage.ts` :

```typescript
// src/heritage.ts
// Héritage de classes avec extends

class Vehicule {
  constructor(
    public marque: string,
    public modele: string,
    protected vitesseMax: number,
    private vitesseActuelle: number = 0
  ) {}

  public accelerer(increment: number): void {
    const nouvelleVitesse: number = this.vitesseActuelle + increment;
    if (nouvelleVitesse > this.vitesseMax) {
      this.vitesseActuelle = this.vitesseMax;
      console.log(
        `  ${this.marque} ${this.modele} : vitesse max atteinte (${this.vitesseMax} km/h)`
      );
    } else {
      this.vitesseActuelle = nouvelleVitesse;
      console.log(
        `  ${this.marque} ${this.modele} : ${this.vitesseActuelle} km/h`
      );
    }
  }

  public freiner(decrement: number): void {
    this.vitesseActuelle = Math.max(0, this.vitesseActuelle - decrement);
    console.log(
      `  ${this.marque} ${this.modele} : freinage → ${this.vitesseActuelle} km/h`
    );
  }

  public getVitesse(): number {
    return this.vitesseActuelle;
  }

  public decrire(): string {
    return `${this.marque} ${this.modele} (max: ${this.vitesseMax} km/h)`;
  }
}

// Sous-classe Voiture
class Voiture extends Vehicule {
  constructor(
    marque: string,
    modele: string,
    vitesseMax: number,
    public nombrePortes: number
  ) {
    // super() appelle le constructeur de la classe parente
    super(marque, modele, vitesseMax);
  }

  // Override : remplace la méthode de la classe parente
  public decrire(): string {
    // On peut accéder à vitesseMax (protected) depuis une sous-classe
    return `Voiture ${this.marque} ${this.modele} (${this.nombrePortes} portes, max: ${this.vitesseMax} km/h)`;
  }
}

// Sous-classe Moto
class Moto extends Vehicule {
  constructor(
    marque: string,
    modele: string,
    vitesseMax: number,
    public cylindree: number
  ) {
    super(marque, modele, vitesseMax);
  }

  public decrire(): string {
    return `Moto ${this.marque} ${this.modele} (${this.cylindree} cc, max: ${this.vitesseMax} km/h)`;
  }

  // Méthode spécifique à Moto
  public faireWheelie(): void {
    console.log(`  ${this.marque} ${this.modele} fait un wheelie !`);
  }
}

// Utilisation
const voiture = new Voiture("Peugeot", "308", 220, 5);
const moto = new Moto("Yamaha", "MT-07", 200, 689);

console.log(voiture.decrire());
voiture.accelerer(100);
voiture.accelerer(150);
voiture.freiner(50);

console.log("\n" + moto.decrire());
moto.accelerer(80);
moto.faireWheelie();

// Polymorphisme : un tableau de Vehicule peut contenir Voiture et Moto
const vehicules: Vehicule[] = [voiture, moto];
console.log("\nTous les véhicules :");
vehicules.forEach((v: Vehicule): void => {
  console.log(`  ${v.decrire()}`);
});
```

Compile et exécute :

```bash
npx tsc && node dist/heritage.js
```

**Résultat attendu** :

```text
Voiture Peugeot 308 (5 portes, max: 220 km/h)
  Peugeot 308 : 100 km/h
  Peugeot 308 : vitesse max atteinte (220 km/h)
  Peugeot 308 : freinage → 170 km/h

Moto Yamaha MT-07 (689 cc, max: 200 km/h)
  Yamaha MT-07 : 80 km/h
  Yamaha MT-07 fait un wheelie !

Tous les véhicules :
  Voiture Peugeot 308 (5 portes, max: 220 km/h)
  Moto Yamaha MT-07 (689 cc, max: 200 km/h)
```

---

### Étape 4 : Classes abstraites

Le diagramme suivant montre la visibilité des membres dans une hiérarchie de classes TypeScript avec une classe abstraite.

<div class="diagram-design">
<p><a href="../../diagrams/07-typescript-08-classes-heritage-1.html">Étape 4 : Classes abstraites (HTML + SVG)</a></p>
<iframe src="../../diagrams/07-typescript-08-classes-heritage-1.html" title="Étape 4 : Classes abstraites" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Crée un fichier `src/classes-abstraites.ts` :

```typescript
// src/classes-abstraites.ts
// Classes abstraites : modèles pour les sous-classes

// abstract empêche l'instanciation directe
abstract class Forme {
  constructor(
    public readonly nom: string,
    public couleur: string
  ) {}

  // Méthode abstraite : pas d'implémentation
  // Les sous-classes DOIVENT l'implémenter
  abstract aire(): number;
  abstract perimetre(): number;

  // Méthode concrète : a une implémentation
  // Les sous-classes l'héritent automatiquement
  public decrire(): string {
    return `${this.nom} ${this.couleur} (aire: ${this.aire().toFixed(2)}, périmètre: ${this.perimetre().toFixed(2)})`;
  }
}

// const forme = new Forme("test", "rouge"); // Erreur : Cannot create an instance of an abstract class

class Cercle extends Forme {
  constructor(
    couleur: string,
    public rayon: number
  ) {
    super("Cercle", couleur);
  }

  // Implémentation obligatoire de aire()
  aire(): number {
    return Math.PI * this.rayon * this.rayon;
  }

  // Implémentation obligatoire de perimetre()
  perimetre(): number {
    return 2 * Math.PI * this.rayon;
  }
}

class RectangleForme extends Forme {
  constructor(
    couleur: string,
    public largeur: number,
    public hauteur: number
  ) {
    super("Rectangle", couleur);
  }

  aire(): number {
    return this.largeur * this.hauteur;
  }

  perimetre(): number {
    return 2 * (this.largeur + this.hauteur);
  }
}

class TriangleForme extends Forme {
  constructor(
    couleur: string,
    public base: number,
    public hauteur: number,
    public coteA: number,
    public coteB: number
  ) {
    super("Triangle", couleur);
  }

  aire(): number {
    return (this.base * this.hauteur) / 2;
  }

  perimetre(): number {
    return this.base + this.coteA + this.coteB;
  }
}

// Polymorphisme : toutes les sous-classes peuvent être traitées comme Forme
const formes: Forme[] = [
  new Cercle("rouge", 5),
  new RectangleForme("bleu", 10, 4),
  new TriangleForme("vert", 6, 4, 5, 5),
];

console.log("Toutes les formes :");
formes.forEach((forme: Forme): void => {
  console.log(`  ${forme.decrire()}`);
});

// Fonction qui accepte n'importe quelle Forme
function aireTotale(formes: Forme[]): number {
  return formes.reduce(
    (total: number, forme: Forme): number => total + forme.aire(),
    0
  );
}

console.log(`\nAire totale : ${aireTotale(formes).toFixed(2)}`);
```

Compile et exécute :

```bash
npx tsc && node dist/classes-abstraites.js
```

**Résultat attendu** :

```text
Toutes les formes :
  Cercle rouge (aire: 78.54, périmètre: 31.42)
  Rectangle bleu (aire: 40.00, périmètre: 28.00)
  Triangle vert (aire: 12.00, périmètre: 16.00)

Aire totale : 130.54
```

---

### Étape 5 : Implémenter des interfaces

Crée un fichier `src/implements.ts` :

```typescript
// src/implements.ts
// implements : une classe respecte le contrat d'une interface

interface Serialisable {
  versJSON(): string;
  depuisJSON?(json: string): void;
}

interface Affichable {
  afficher(): void;
}

interface Comparable<T> {
  comparerAvec(autre: T): number; // -1, 0 ou 1
}

// Une classe peut implémenter plusieurs interfaces
class Etudiant implements Serialisable, Affichable, Comparable<Etudiant> {
  constructor(
    public nom: string,
    public note: number,
    public filiere: string
  ) {}

  // De Serialisable
  versJSON(): string {
    return JSON.stringify({
      nom: this.nom,
      note: this.note,
      filiere: this.filiere,
    });
  }

  // De Affichable
  afficher(): void {
    console.log(`  ${this.nom} - ${this.note}/20 (${this.filiere})`);
  }

  // De Comparable
  comparerAvec(autre: Etudiant): number {
    if (this.note > autre.note) return 1;
    if (this.note < autre.note) return -1;
    return 0;
  }
}

// Créer des étudiants
const etudiants: Etudiant[] = [
  new Etudiant("Alice", 16, "Informatique"),
  new Etudiant("Bob", 14, "Mathématiques"),
  new Etudiant("Charlie", 18, "Informatique"),
  new Etudiant("Diana", 15, "Physique"),
];

// Utiliser l'interface Affichable
console.log("Étudiants :");
etudiants.forEach((e: Etudiant): void => e.afficher());

// Utiliser l'interface Comparable pour trier
const tries: Etudiant[] = [...etudiants].sort(
  (a: Etudiant, b: Etudiant): number => b.comparerAvec(a)
);

console.log("\nClassement par note :");
tries.forEach((e: Etudiant, i: number): void => {
  console.log(`  ${i + 1}. ${e.nom} (${e.note}/20)`);
});

// Utiliser l'interface Serialisable
console.log("\nJSON du premier :");
console.log(`  ${etudiants[0].versJSON()}`);

// Fonction qui accepte n'importe quel Affichable
function afficherTout(items: Affichable[]): void {
  items.forEach((item: Affichable): void => item.afficher());
}

console.log("\nAffichage via interface :");
afficherTout(etudiants);
```

Compile et exécute :

```bash
npx tsc && node dist/implements.js
```

**Résultat attendu** :

```text
Étudiants :
  Alice - 16/20 (Informatique)
  Bob - 14/20 (Mathématiques)
  Charlie - 18/20 (Informatique)
  Diana - 15/20 (Physique)

Classement par note :
  1. Charlie (18/20)
  2. Alice (16/20)
  3. Diana (15/20)
  4. Bob (14/20)

JSON du premier :
  {"nom":"Alice","note":16,"filiere":"Informatique"}

Affichage via interface :
  Alice - 16/20 (Informatique)
  Bob - 14/20 (Mathématiques)
  Charlie - 18/20 (Informatique)
  Diana - 15/20 (Physique)
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npx tsc && node dist/fichier.js` | Compile puis exécute |
| `npx tsc --noEmit` | Vérifie les types sans compiler |
| `node src/fichier.ts` ou `npx tsx src/fichier.ts` | Node 22.18+ : TS effaçable ; tsx pour enums/namespaces |

---

## Pièges Fréquents

### Piège 1 : `private` TypeScript vs `#` JavaScript

**Problème** : TypeScript a deux syntaxes pour le privé. `private` est vérifié uniquement à la compilation. `#` (champ privé JavaScript) est vérifié à l'exécution.

```typescript
class Exemple {
  private tsPrive: string = "a"; // Vérifié à la compilation seulement
  #jsPrive: string = "b"; // Vérifié à l'exécution aussi
}
```

**Solution** : Utilise `private` de TypeScript pour la plupart des cas. Utilise `#` si tu as besoin d'une isolation garantie à l'exécution.

---

### Piège 2 : Oublier `super()` dans le constructeur d'une sous-classe

**Problème** : Ne pas appeler `super()` dans le constructeur d'une classe qui extends une autre.

```typescript
class Parent {
  constructor(public nom: string) {}
}

class Enfant extends Parent {
  constructor(nom: string, public age: number) {
    // Erreur si on oublie super(nom) ici
    super(nom); // Obligatoire
  }
}
```

**Solution** : Toujours appeler `super()` en premier dans le constructeur d'une sous-classe, avant d'accéder à `this`.

---

### Piège 3 : `implements` ne fournit pas d'implémentation

**Problème** : Croire que `implements` hérite du code de l'interface.

```typescript
interface Loggable {
  log(message: string): void;
}

class Service implements Loggable {
  // Il FAUT implémenter log() ici
  // implements ne fournit aucun code
  log(message: string): void {
    console.log(`[Service] ${message}`);
  }
}
```

**Solution** : `implements` vérifie la structure, mais ne fournit pas de code. Il faut écrire l'implémentation de chaque méthode.

---

## Checklist de Validation

- [ ] Je sais utiliser `public`, `private` et `protected`
- [ ] Je comprends la différence entre les trois modifieurs d'accès
- [ ] Je sais utiliser les parameter properties dans le constructeur
- [ ] Je sais créer une sous-classe avec `extends` et `super()`
- [ ] Je sais overrider une méthode dans une sous-classe
- [ ] Je sais créer et utiliser une classe abstraite
- [ ] Je sais implémenter une interface avec `implements`
- [ ] Je comprends la différence entre `extends` et `implements`

---

## Exercice Pratique

**Énoncé** : Crée un système de gestion de tâches avec des classes :

1. Interface `Prioritaire` avec une méthode `getPriorite(): number`
2. Classe abstraite `TacheBase` avec : id (readonly), titre, terminee (boolean), méthode abstraite `estimer(): number` (temps en minutes), méthode concrète `terminer()`
3. Classe `TacheSimple extends TacheBase implements Prioritaire` avec une priorité fixe
4. Classe `TacheComplexe extends TacheBase implements Prioritaire` avec des sous-tâches (string[]) et une priorité calculée
5. Trie les tâches par priorité et affiche-les

**Indications** :

- La priorité de `TacheComplexe` est basée sur le nombre de sous-tâches
- `estimer()` pour `TacheSimple` retourne 30, pour `TacheComplexe` retourne 30 par sous-tâche

**Résultat attendu** :

```text
Tâches par priorité :
  1. [Complexe] Refactoring (3 sous-tâches, ~90 min) - Priorité: 3
  2. [Complexe] Tests (2 sous-tâches, ~60 min) - Priorité: 2
  3. [Simple] Corriger bug #42 (~30 min) - Priorité: 1
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```typescript
// src/gestion-taches.ts

interface Prioritaire {
  getPriorite(): number;
}

abstract class TacheBase {
  public terminee: boolean = false;

  constructor(
    public readonly id: number,
    public titre: string
  ) {}

  abstract estimer(): number;

  public terminer(): void {
    this.terminee = true;
    console.log(`  Tâche "${this.titre}" terminée`);
  }
}

class TacheSimple extends TacheBase implements Prioritaire {
  constructor(
    id: number,
    titre: string,
    private priorite: number
  ) {
    super(id, titre);
  }

  estimer(): number {
    return 30;
  }

  getPriorite(): number {
    return this.priorite;
  }

  public decrire(): string {
    return `[Simple] ${this.titre} (~${this.estimer()} min) - Priorité: ${this.getPriorite()}`;
  }
}

class TacheComplexe extends TacheBase implements Prioritaire {
  constructor(
    id: number,
    titre: string,
    public sousTaches: string[]
  ) {
    super(id, titre);
  }

  estimer(): number {
    return this.sousTaches.length * 30;
  }

  getPriorite(): number {
    return this.sousTaches.length;
  }

  public decrire(): string {
    return `[Complexe] ${this.titre} (${this.sousTaches.length} sous-tâches, ~${this.estimer()} min) - Priorité: ${this.getPriorite()}`;
  }
}

// Tests
const taches: (TacheSimple | TacheComplexe)[] = [
  new TacheSimple(1, "Corriger bug #42", 1),
  new TacheComplexe(2, "Refactoring", [
    "Extraire fonctions",
    "Renommer variables",
    "Ajouter types",
  ]),
  new TacheComplexe(3, "Tests", ["Tests unitaires", "Tests intégration"]),
];

// Trier par priorité décroissante
const triees = [...taches].sort(
  (a, b): number => b.getPriorite() - a.getPriorite()
);

console.log("Tâches par priorité :");
triees.forEach(
  (tache: TacheSimple | TacheComplexe, index: number): void => {
    console.log(`  ${index + 1}. ${tache.decrire()}`);
  }
);
```

---

## Navigation

← Fiche précédente : **[07 - Fonctions typées](07-fonctions-typees.md)**

→ Fiche suivante : **[09 - Enums et littéraux](09-enums-litteraux.md)**
