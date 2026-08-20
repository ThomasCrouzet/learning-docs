---
tags:
  - Rust
  - Intermédiaire
  - Pratique
description: "Structs (Structures)"
estimated_time: "70 min"
fiche_number: 6
total_fiches: 16
cursus: "Rust"
---

# 06 - Structs (Structures)

> **En bref** : À la fin de cette fiche, tu sauras créer des structures de données personnalisées avec struct, implémenter des méthodes, et utiliser les tuple structs. Lecture estimée : 70 min.


## Prérequis

- Fiche **[04 - Ownership (propriété)](04-ownership.md)**
- Fiche **[05 - Borrowing et références](05-borrowing-references.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des structures de données personnalisées avec `struct`, implémenter des méthodes, et utiliser les tuple structs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une struct ?

**Définition** : Une struct (structure) est un type de données personnalisé qui regroupe plusieurs valeurs liées sous un même nom.

**Le problème que les structs résolvent** :

Sans structs, voici les problèmes rencontrés :

1. **Données éparpillées** : Les informations liées sont dans des variables séparées.
2. **Code peu lisible** : Difficile de comprendre que des variables vont ensemble.
3. **Erreurs faciles** : On peut mélanger les paramètres (largeur vs hauteur).

**Comment les structs résolvent ces problèmes** :

| Problème | Solution apportée par les structs |
| --- | --- |
| Données éparpillées | Toutes les données liées sont dans un seul objet |
| Code peu lisible | Le nom de la struct donne du sens |
| Erreurs faciles | Chaque champ a un nom explicite |

**Analogie concrète** : Une struct est comme une fiche de renseignements. Au lieu d'avoir le nom, l'âge et l'email sur des papiers séparés, tu as une fiche "Personne" avec tous les champs.

---

### Types de structs

Rust propose trois types de structs :

| Type | Description | Exemple |
| --- | --- | --- |
| Struct classique | Champs nommés | `struct Point { x: i32, y: i32 }` |
| Tuple struct | Champs sans nom | `struct Color(i32, i32, i32)` |
| Unit struct | Pas de champs | `struct Marker;` |

---

### Qu'est-ce qu'une méthode ?

**Définition** : Une méthode est une fonction associée à une struct. Elle a accès à `self`, qui représente l'instance sur laquelle elle est appelée.

**Syntaxe** :

```rust
impl NomStruct {
    fn methode(&self) {
        // Code qui utilise self
    }
}
```

**Différence entre fonction et méthode** :

| Fonction | Méthode |
| --- | --- |
| Appelée avec `fonction(args)` | Appelée avec `instance.methode(args)` |
| Pas d'accès à `self` | A accès à `self` |
| Définie en dehors de `impl` | Définie dans un bloc `impl` |

---

### Les trois formes de self

| Forme | Signification | Quand l'utiliser |
| --- | --- | --- |
| `&self` | Référence immutable | Lecture seule |
| `&mut self` | Référence mutable | Modification de l'instance |
| `self` | Propriété (ownership) | Transformation ou consommation de l'instance |

---

### Qu'est-ce qu'une fonction associée ?

**Définition** : Une fonction associée est une fonction dans un bloc `impl` qui ne prend pas `self`. Elle est appelée sur le type, pas sur une instance.

**Exemple typique** : Les constructeurs

```rust
impl Point {
    fn new(x: i32, y: i32) -> Point {   // Pas de self
        Point { x, y }
    }
}

let p = Point::new(3, 4);   // Appelée avec :: sur le type
```

---

## Étapes Pratiques

### Étape 1 : Définir une struct

```rust
// Définition de la struct
struct Utilisateur {
    nom: String,
    email: String,
    age: u32,
    actif: bool,
}

fn main() {
    // Création d'une instance
    let user1 = Utilisateur {
        nom: String::from("Emma"),
        email: String::from("alex@example.com"),
        age: 20,
        actif: true,
    };

    println!("Nom : {}", user1.nom);
    println!("Email : {}", user1.email);
    println!("Âge : {}", user1.age);
    println!("Actif : {}", user1.actif);
}
```

**Résultat attendu** :

```text
Nom : Emma
Email : alex@example.com
Âge : 20
Actif : true
```

---

### Étape 2 : Modifier une struct mutable

```rust
struct Utilisateur {
    nom: String,
    email: String,
    age: u32,
    actif: bool,
}

fn main() {
    let mut user1 = Utilisateur {      // mut pour pouvoir modifier
        nom: String::from("Emma"),
        email: String::from("alex@example.com"),
        age: 20,
        actif: true,
    };

    user1.age = 21;                     // Modification d'un champ
    println!("Nouvel âge : {}", user1.age);
}
```

**Résultat attendu** :

```text
Nouvel âge : 21
```

**Règle** : Toute l'instance doit être mutable. On ne peut pas avoir un seul champ mutable.

---

### Étape 3 : Créer une instance avec la syntaxe raccourcie

```rust
struct Utilisateur {
    nom: String,
    email: String,
    age: u32,
}

fn creer_utilisateur(nom: String, email: String, age: u32) -> Utilisateur {
    Utilisateur {
        nom,        // Équivalent à nom: nom
        email,      // Équivalent à email: email
        age,        // Équivalent à age: age
    }
}

fn main() {
    let user = creer_utilisateur(
        String::from("Emma"),
        String::from("alex@example.com"),
        20,
    );

    println!("Utilisateur : {} ({})", user.nom, user.email);
}
```

**Résultat attendu** :

```text
Utilisateur : Emma (alex@example.com)
```

---

### Étape 4 : Créer une instance à partir d'une autre

```rust
struct Utilisateur {
    nom: String,
    email: String,
    age: u32,
    actif: bool,
}

fn main() {
    let user1 = Utilisateur {
        nom: String::from("Emma"),
        email: String::from("alex@example.com"),
        age: 20,
        actif: true,
    };

    // Crée user2 avec un nouvel email, mais les autres champs de user1
    let user2 = Utilisateur {
        email: String::from("nouveau@example.com"),
        ..user1     // Prend le reste des champs de user1
    };

    println!("User2 : {} ({})", user2.nom, user2.email);
    // Note : user1.nom n'est plus utilisable (moved)
}
```

**Résultat attendu** :

```text
User2 : Emma (nouveau@example.com)
```

---

### Étape 5 : Tuple structs

```rust
struct Couleur(i32, i32, i32);      // RGB
struct Point(i32, i32);              // Coordonnées

fn main() {
    let noir = Couleur(0, 0, 0);
    let origine = Point(0, 0);

    println!("Noir : R={}, G={}, B={}", noir.0, noir.1, noir.2);
    println!("Origine : x={}, y={}", origine.0, origine.1);
}
```

**Résultat attendu** :

```text
Noir : R=0, G=0, B=0
Origine : x=0, y=0
```

**Note** : Les champs sont accessibles par index (`0`, `1`, `2`...) au lieu de noms.

---

### Étape 6 : Afficher une struct avec Debug

```rust
#[derive(Debug)]        // Permet d'afficher la struct avec {:?}
struct Rectangle {
    largeur: u32,
    hauteur: u32,
}

fn main() {
    let rect = Rectangle {
        largeur: 30,
        hauteur: 50,
    };

    println!("Rectangle : {:?}", rect);         // Format compact
    println!("Rectangle : {:#?}", rect);        // Format étendu
}
```

**Résultat attendu** :

```text
Rectangle : Rectangle { largeur: 30, hauteur: 50 }
Rectangle : Rectangle {
    largeur: 30,
    hauteur: 50,
}
```

---

### Étape 7 : Ajouter des méthodes avec impl

```rust
#[derive(Debug)]
struct Rectangle {
    largeur: u32,
    hauteur: u32,
}

impl Rectangle {
    // Méthode qui calcule l'aire
    fn aire(&self) -> u32 {
        self.largeur * self.hauteur
    }

    // Méthode qui calcule le périmètre
    fn perimetre(&self) -> u32 {
        2 * (self.largeur + self.hauteur)
    }
}

fn main() {
    let rect = Rectangle {
        largeur: 30,
        hauteur: 50,
    };

    println!("Aire : {}", rect.aire());
    println!("Périmètre : {}", rect.perimetre());
}
```

**Résultat attendu** :

```text
Aire : 1500
Périmètre : 160
```

---

### Étape 8 : Méthode avec paramètres

```rust
#[derive(Debug)]
struct Rectangle {
    largeur: u32,
    hauteur: u32,
}

impl Rectangle {
    // Vérifie si ce rectangle peut contenir un autre
    fn peut_contenir(&self, autre: &Rectangle) -> bool {
        self.largeur > autre.largeur && self.hauteur > autre.hauteur
    }
}

fn main() {
    let rect1 = Rectangle { largeur: 30, hauteur: 50 };
    let rect2 = Rectangle { largeur: 10, hauteur: 40 };
    let rect3 = Rectangle { largeur: 60, hauteur: 45 };

    println!("rect1 peut contenir rect2 ? {}", rect1.peut_contenir(&rect2));
    println!("rect1 peut contenir rect3 ? {}", rect1.peut_contenir(&rect3));
}
```

**Résultat attendu** :

```text
rect1 peut contenir rect2 ? true
rect1 peut contenir rect3 ? false
```

---

### Étape 9 : Fonction associée (constructeur)

```rust
#[derive(Debug)]
struct Rectangle {
    largeur: u32,
    hauteur: u32,
}

impl Rectangle {
    // Fonction associée : crée un carré
    fn carre(taille: u32) -> Rectangle {
        Rectangle {
            largeur: taille,
            hauteur: taille,
        }
    }

    // Fonction associée : constructeur standard
    fn new(largeur: u32, hauteur: u32) -> Rectangle {
        Rectangle { largeur, hauteur }
    }

    fn aire(&self) -> u32 {
        self.largeur * self.hauteur
    }
}

fn main() {
    let carre = Rectangle::carre(10);       // Appel avec ::
    let rect = Rectangle::new(30, 50);      // Appel avec ::

    println!("Carré : {:?}, aire = {}", carre, carre.aire());
    println!("Rectangle : {:?}, aire = {}", rect, rect.aire());
}
```

**Résultat attendu** :

```text
Carré : Rectangle { largeur: 10, hauteur: 10 }, aire = 100
Rectangle : Rectangle { largeur: 30, hauteur: 50 }, aire = 1500
```

---

### Étape 10 : Méthode qui modifie l'instance

```rust
#[derive(Debug)]
struct Compteur {
    valeur: u32,
}

impl Compteur {
    fn new() -> Compteur {
        Compteur { valeur: 0 }
    }

    fn incrementer(&mut self) {     // &mut self pour modifier
        self.valeur += 1;
    }

    fn valeur(&self) -> u32 {       // &self pour lire
        self.valeur
    }
}

fn main() {
    let mut compteur = Compteur::new();

    compteur.incrementer();
    compteur.incrementer();
    compteur.incrementer();

    println!("Valeur : {}", compteur.valeur());
}
```

**Résultat attendu** :

```text
Valeur : 3
```

---

### Étape 11 : Plusieurs blocs impl

```rust
#[derive(Debug)]
struct Rectangle {
    largeur: u32,
    hauteur: u32,
}

impl Rectangle {
    fn new(largeur: u32, hauteur: u32) -> Rectangle {
        Rectangle { largeur, hauteur }
    }
}

impl Rectangle {
    fn aire(&self) -> u32 {
        self.largeur * self.hauteur
    }
}

impl Rectangle {
    fn est_carre(&self) -> bool {
        self.largeur == self.hauteur
    }
}

fn main() {
    let rect = Rectangle::new(10, 10);
    println!("Aire : {}", rect.aire());
    println!("Est un carré ? {}", rect.est_carre());
}
```

**Résultat attendu** :

```text
Aire : 100
Est un carré ? true
```

**Note** : On peut avoir plusieurs blocs `impl` pour la même struct. C'est utile pour organiser le code.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo run` | Compile et exécute le programme |
| `cargo check` | Vérifie la syntaxe sans compiler |

---

## Pièges Fréquents

### Piège 1 : Oublier les types des champs

**Problème** : Chaque champ doit avoir un type explicite.

```rust
struct Point {
    x,      // Erreur : type manquant
    y,
}
```

**Solution** :

```rust
struct Point {
    x: i32,
    y: i32,
}
```

---

### Piège 2 : Oublier #[derive(Debug)] pour afficher

**Problème** : Tu essaies d'afficher une struct avec `{:?}` mais ça ne compile pas.

**Solution** : Ajoute `#[derive(Debug)]` avant la définition de la struct.

---

### Piège 3 : Oublier `mut` pour modifier

**Problème** : Tu essaies de modifier un champ d'une instance non mutable.

```rust
let rect = Rectangle { largeur: 10, hauteur: 20 };
rect.largeur = 30;      // Erreur : rect n'est pas mutable
```

**Solution** :

```rust
let mut rect = Rectangle { largeur: 10, hauteur: 20 };
rect.largeur = 30;      // OK
```

---

### Piège 4 : Confondre &self et self

**Problème** : Tu utilises `self` alors que tu veux juste lire les données.

```rust
impl Rectangle {
    fn aire(self) -> u32 {      // Prend la propriété !
        self.largeur * self.hauteur
    }
}
```

**Solution** : Utilise `&self` pour emprunter :

```rust
impl Rectangle {
    fn aire(&self) -> u32 {     // Emprunte, ne consomme pas
        self.largeur * self.hauteur
    }
}
```

---

## Checklist de Validation

- [ ] Je sais définir une struct avec des champs nommés
- [ ] Je sais créer une instance de struct
- [ ] Je sais accéder aux champs avec `.`
- [ ] Je sais modifier une instance mutable
- [ ] Je connais les tuple structs
- [ ] Je sais utiliser `#[derive(Debug)]`
- [ ] Je sais créer des méthodes avec `impl`
- [ ] Je comprends la différence entre `&self`, `&mut self` et `self`
- [ ] Je sais créer des fonctions associées (constructeurs)

---

## Exercice Pratique

**Énoncé** : Crée une struct `Cercle` avec :

1. Un champ `rayon` de type `f64`
2. Une fonction associée `new` qui crée un cercle
3. Une méthode `aire` qui retourne l'aire (π × rayon²)
4. Une méthode `circonference` qui retourne la circonférence (2 × π × rayon)

**Indications** :

- Utilise `std::f64::consts::PI` pour la valeur de π
- La signature de `new` : `fn new(rayon: f64) -> Cercle`

**Résultat attendu** (pour un rayon de 5.0) :

```text
Cercle de rayon 5
Aire : 78.53981633974483
Circonférence : 31.41592653589793
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```rust
use std::f64::consts::PI;

#[derive(Debug)]
struct Cercle {
    rayon: f64,
}

impl Cercle {
    fn new(rayon: f64) -> Cercle {
        Cercle { rayon }
    }

    fn aire(&self) -> f64 {
        PI * self.rayon * self.rayon
    }

    fn circonference(&self) -> f64 {
        2.0 * PI * self.rayon
    }
}

fn main() {
    let cercle = Cercle::new(5.0);

    println!("Cercle de rayon {}", cercle.rayon);
    println!("Aire : {}", cercle.aire());
    println!("Circonférence : {}", cercle.circonference());
}
```

---

## Navigation

← Fiche précédente : **[Borrowing et Références](05-borrowing-references.md)**

→ Fiche suivante : **[Enums et Pattern Matching](07-enums-pattern-matching.md)**
