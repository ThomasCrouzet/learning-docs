---
tags:
  - Rust
  - Avancé
  - Pratique
description: "Traits et Génériques"
estimated_time: "70 min"
fiche_number: 10
total_fiches: 16
cursus: "Rust"
id: "fundamentals.rust.traits-generiques"
course_id: "fundamentals.rust"
content_type: "lesson"
order: 10
---

# 10 - Traits et Génériques

> **En bref** : À la fin de cette fiche, tu sauras créer des types génériques, définir et implémenter des traits, et utiliser les traits bounds pour contraindre les types génériques. Lecture estimée : 70 min.


## Prérequis

- Fiche **[06 - Structs (structures)](06-structs.md)**
- Fiche **[07 - Enums et pattern matching](07-enums-pattern-matching.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des types génériques, définir et implémenter des traits, et utiliser les traits bounds pour contraindre les types génériques.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un type générique ?

**Définition** : Un type générique est un placeholder pour un type concret qui sera déterminé à l'utilisation. Il permet d'écrire du code qui fonctionne avec plusieurs types.

**Le problème que les génériques résolvent** :

Sans génériques, voici les problèmes rencontrés :

1. **Duplication de code** : Tu dois écrire la même fonction pour chaque type.
2. **Maintenance difficile** : Un changement doit être fait dans plusieurs endroits.
3. **Pas de réutilisation** : Impossible de créer des structures de données génériques.

**Comment les génériques résolvent ces problèmes** :

| Problème | Solution apportée par les génériques |
| --- | --- |
| Duplication de code | Une seule implémentation pour tous les types |
| Maintenance difficile | Un seul endroit à modifier |
| Pas de réutilisation | `Vec<T>`, `Option<T>`, `Result<T, E>` fonctionnent avec tout |

**Analogie concrète** : Un moule à gâteau générique peut faire des gâteaux au chocolat, à la vanille ou aux fruits. Le moule est le même, seul l'ingrédient (`T`) change.

---

### Qu'est-ce qu'un trait ?

**Définition** : Un trait définit un comportement partagé par plusieurs types. C'est un contrat qui spécifie les méthodes qu'un type doit implémenter.

**Le problème que les traits résolvent** :

Sans traits, voici les problèmes rencontrés :

1. **Pas de polymorphisme** : Impossible de traiter différents types de la même façon.
2. **Interfaces non définies** : Pas de garantie qu'un type a certaines méthodes.
3. **Code non réutilisable** : Impossible d'écrire des fonctions qui acceptent "tout type qui sait faire X".

**Comment les traits résolvent ces problèmes** :

| Problème | Solution apportée par les traits |
| --- | --- |
| Pas de polymorphisme | Différents types peuvent implémenter le même trait |
| Interfaces non définies | Le trait définit les méthodes requises |
| Code non réutilisable | Fonctions avec trait bounds acceptent tout type compatible |

**Analogie concrète** : Un trait est comme un certificat de compétence. Si quelqu'un a le certificat "sait cuisiner" (trait `Cuisiner`), tu sais qu'il peut préparer des plats, peu importe si c'est un chef professionnel ou un amateur.

**Ce qu'un trait n'est PAS** :

- Un trait n'est pas une classe (pas de données propres)
- Un trait n'est pas de l'héritage (pas de hiérarchie parent-enfant)

---

### Traits standards importants

| Trait | Méthode | Usage |
| --- | --- | --- |
| `Debug` | Format avec `{:?}` | Affichage pour le debug |
| `Clone` | `.clone()` | Copie profonde |
| `Copy` | Copie implicite | Types copiables automatiquement |
| `PartialEq` | `==`, `!=` | Comparaison d'égalité |
| `Eq` | - | Égalité réflexive (complète) |
| `PartialOrd` | `<`, `>`, `<=`, `>=` | Comparaison d'ordre |
| `Ord` | Ordre total | Tri |
| `Default` | `.default()` | Valeur par défaut |
| `Display` | Format avec `{}` | Affichage pour l'utilisateur |

---

### Qu'est-ce qu'un trait bound ?

**Définition** : Un trait bound est une contrainte qui spécifie qu'un type générique doit implémenter certains traits.

**Syntaxe** :

```rust
fn fonction<T: Trait>(arg: T) { }           // Syntaxe courte
fn fonction<T>(arg: T) where T: Trait { }   // Syntaxe where
```

---

## Étapes Pratiques

### Étape 1 : Fonction générique simple

```rust
// T est un type générique
fn afficher<T: std::fmt::Debug>(valeur: T) {
    println!("Valeur : {:?}", valeur);
}

fn main() {
    afficher(42);           // T = i32
    afficher("hello");      // T = &str
    afficher(vec![1, 2, 3]); // T = Vec<i32>
}
```

**Résultat attendu** :

```text
Valeur : 42
Valeur : "hello"
Valeur : [1, 2, 3]
```

---

### Étape 2 : Struct générique

```rust
#[derive(Debug)]
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let entier = Point { x: 5, y: 10 };
    let flottant = Point { x: 1.5, y: 4.2 };

    println!("Point entier : {:?}", entier);
    println!("Point flottant : {:?}", flottant);
}
```

**Résultat attendu** :

```text
Point entier : Point { x: 5, y: 10 }
Point flottant : Point { x: 1.5, y: 4.2 }
```

---

### Étape 3 : Struct avec plusieurs types génériques

```rust
#[derive(Debug)]
struct Paire<T, U> {
    premier: T,
    second: U,
}

fn main() {
    let p1 = Paire { premier: 5, second: "hello" };
    let p2 = Paire { premier: 'a', second: 3.14 };

    println!("p1 : {:?}", p1);
    println!("p2 : {:?}", p2);
}
```

**Résultat attendu** :

```text
p1 : Paire { premier: 5, second: "hello" }
p2 : Paire { premier: 'a', second: 3.14 }
```

---

### Étape 4 : Méthodes sur une struct générique

```rust
#[derive(Debug)]
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn new(x: T, y: T) -> Point<T> {
        Point { x, y }
    }

    fn x(&self) -> &T {
        &self.x
    }

    fn y(&self) -> &T {
        &self.y
    }
}

fn main() {
    let p = Point::new(3, 4);
    println!("x = {}, y = {}", p.x(), p.y());
}
```

**Résultat attendu** :

```text
x = 3, y = 4
```

---

### Étape 5 : Méthode spécifique à un type

```rust
#[derive(Debug)]
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn new(x: T, y: T) -> Point<T> {
        Point { x, y }
    }
}

// Méthode seulement pour Point<f64>
impl Point<f64> {
    fn distance_origine(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}

fn main() {
    let p = Point::new(3.0, 4.0);
    println!("Distance à l'origine : {}", p.distance_origine());

    let p2 = Point::new(3, 4);      // Point<i32>
    // p2.distance_origine();       // Erreur : méthode non disponible pour i32
}
```

**Résultat attendu** :

```text
Distance à l'origine : 5
```

---

### Étape 6 : Définir un trait

```rust
// Définition du trait
trait Animal {
    fn nom(&self) -> &str;
    fn cri(&self) -> &str;

    // Méthode avec implémentation par défaut
    fn presenter(&self) {
        println!("Je suis {} et je fais : {}", self.nom(), self.cri());
    }
}

struct Chien {
    nom: String,
}

struct Chat {
    nom: String,
}

// Implémentation du trait pour Chien
impl Animal for Chien {
    fn nom(&self) -> &str {
        &self.nom
    }

    fn cri(&self) -> &str {
        "Wouf !"
    }
}

// Implémentation du trait pour Chat
impl Animal for Chat {
    fn nom(&self) -> &str {
        &self.nom
    }

    fn cri(&self) -> &str {
        "Miaou !"
    }
}

fn main() {
    let chien = Chien { nom: String::from("Rex") };
    let chat = Chat { nom: String::from("Minou") };

    chien.presenter();
    chat.presenter();
}
```

**Résultat attendu** :

```text
Je suis Rex et je fais : Wouf !
Je suis Minou et je fais : Miaou !
```

---

### Étape 7 : Trait bounds

```rust
use std::fmt::Display;

// T doit implémenter Display
fn afficher_plus_grand<T: PartialOrd + Display>(a: T, b: T) {
    if a > b {
        println!("Le plus grand est : {}", a);
    } else {
        println!("Le plus grand est : {}", b);
    }
}

fn main() {
    afficher_plus_grand(5, 10);
    afficher_plus_grand(3.14, 2.71);
    afficher_plus_grand("abc", "xyz");
}
```

**Résultat attendu** :

```text
Le plus grand est : 10
Le plus grand est : 3.14
Le plus grand est : xyz
```

---

### Étape 8 : Syntaxe where pour des bounds complexes

```rust
use std::fmt::Display;

// Syntaxe where pour la lisibilité
fn traiter<T, U>(t: T, u: U) -> String
where
    T: Display + Clone,
    U: Display,
{
    format!("{} et {}", t, u)
}

fn main() {
    let resultat = traiter(42, "hello");
    println!("{}", resultat);
}
```

**Résultat attendu** :

```text
42 et hello
```

---

### Étape 9 : derive pour implémenter des traits automatiquement

```rust
#[derive(Debug, Clone, PartialEq)]
struct Personne {
    nom: String,
    age: u32,
}

fn main() {
    let p1 = Personne {
        nom: String::from("Alice"),
        age: 30,
    };

    // Debug : affichage avec {:?}
    println!("Debug : {:?}", p1);

    // Clone : copie
    let p2 = p1.clone();
    println!("Clone : {:?}", p2);

    // PartialEq : comparaison
    println!("p1 == p2 : {}", p1 == p2);

    let p3 = Personne {
        nom: String::from("Bob"),
        age: 25,
    };
    println!("p1 == p3 : {}", p1 == p3);
}
```

**Résultat attendu** :

```text
Debug : Personne { nom: "Alice", age: 30 }
Clone : Personne { nom: "Alice", age: 30 }
p1 == p2 : true
p1 == p3 : false
```

---

### Étape 10 : Implémenter Display manuellement

```rust
use std::fmt;

struct Point {
    x: f64,
    y: f64,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "({}, {})", self.x, self.y)
    }
}

impl fmt::Debug for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Point {{ x: {}, y: {} }}", self.x, self.y)
    }
}

fn main() {
    let p = Point { x: 3.0, y: 4.0 };

    println!("Display : {}", p);    // Utilise Display
    println!("Debug : {:?}", p);    // Utilise Debug
}
```

**Résultat attendu** :

```text
Display : (3, 4)
Debug : Point { x: 3, y: 4 }
```

---

### Étape 11 : Trait comme paramètre de fonction

```rust
trait Resumable {
    fn resume(&self) -> String;
}

struct Article {
    titre: String,
    contenu: String,
}

struct Tweet {
    auteur: String,
    texte: String,
}

impl Resumable for Article {
    fn resume(&self) -> String {
        format!("{} - {}", self.titre, &self.contenu[..50.min(self.contenu.len())])
    }
}

impl Resumable for Tweet {
    fn resume(&self) -> String {
        format!("@{}: {}", self.auteur, self.texte)
    }
}

// Accepte tout type qui implémente Resumable
fn afficher_resume(item: &impl Resumable) {
    println!("Résumé : {}", item.resume());
}

fn main() {
    let article = Article {
        titre: String::from("Rust est génial"),
        contenu: String::from("Rust est un langage de programmation moderne et sûr."),
    };

    let tweet = Tweet {
        auteur: String::from("rustlang"),
        texte: String::from("Nouvelle version de Rust disponible !"),
    };

    afficher_resume(&article);
    afficher_resume(&tweet);
}
```

**Résultat attendu** :

```text
Résumé : Rust est génial - Rust est un langage de programmation moderne et s
Résumé : @rustlang: Nouvelle version de Rust disponible !
```

---

### Étape 12 : Retourner un type qui implémente un trait

```rust
trait Resumable {
    fn resume(&self) -> String;
}

struct Article {
    titre: String,
}

impl Resumable for Article {
    fn resume(&self) -> String {
        self.titre.clone()
    }
}

// Retourne un type qui implémente Resumable
fn creer_article() -> impl Resumable {
    Article {
        titre: String::from("Titre de l'article"),
    }
}

fn main() {
    let article = creer_article();
    println!("Résumé : {}", article.resume());
}
```

**Résultat attendu** :

```text
Résumé : Titre de l'article
```

---

### Étape 13 : Default trait

```rust
#[derive(Debug, Default)]
struct Configuration {
    debug: bool,
    port: u16,
    nom: String,
}

fn main() {
    // Utilise les valeurs par défaut
    let config_defaut = Configuration::default();
    println!("Défaut : {:?}", config_defaut);

    // Override certaines valeurs
    let config_custom = Configuration {
        port: 8080,
        ..Default::default()    // Reste des valeurs par défaut
    };
    println!("Custom : {:?}", config_custom);
}
```

**Résultat attendu** :

```text
Défaut : Configuration { debug: false, port: 0, nom: "" }
Custom : Configuration { debug: false, port: 8080, nom: "" }
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo run` | Compile et exécute le programme |
| `cargo check` | Vérifie la syntaxe sans compiler |

---

## Pièges Fréquents

### Piège 1 : Oublier le trait bound

**Problème** : Tu utilises une méthode qui nécessite un trait.

```rust
fn afficher<T>(valeur: T) {
    println!("{}", valeur);     // Erreur : T n'implémente pas Display
}
```

**Solution** : Ajoute le trait bound :

```rust
fn afficher<T: std::fmt::Display>(valeur: T) {
    println!("{}", valeur);
}
```

---

### Piège 2 : derive ne fonctionne pas pour tous les traits

**Problème** : Tu essaies de derive un trait qui nécessite une implémentation manuelle.

```rust
#[derive(Display)]      // Erreur : Display ne peut pas être derived
struct Point { x: i32 }
```

**Solution** : Implémente le trait manuellement.

---

### Piège 3 : Trait bounds manquants sur les champs

**Problème** : Tu derives un trait mais un champ ne l'implémente pas.

```rust
#[derive(Clone)]
struct Container {
    data: SomeTypeWithoutClone,     // Erreur si SomeType n'implémente pas Clone
}
```

**Solution** : Assure-toi que tous les champs implémentent le trait.

---

## Checklist de Validation

- [ ] Je sais créer une fonction générique avec `<T>`
- [ ] Je sais créer une struct générique
- [ ] Je sais définir un trait
- [ ] Je sais implémenter un trait pour un type
- [ ] Je comprends les trait bounds (`T: Trait`)
- [ ] Je sais utiliser `derive` pour implémenter des traits automatiquement
- [ ] Je sais implémenter `Display` et `Debug` manuellement

---

## Exercice Pratique

**Énoncé** : Crée un trait `Forme` avec :

1. Une méthode `aire(&self) -> f64`
2. Une méthode `perimetre(&self) -> f64`
3. Une méthode par défaut `description(&self)` qui affiche l'aire et le périmètre

Implémente ce trait pour `Rectangle` et `Cercle`.

**Résultat attendu** :

```text
Rectangle : aire = 50.00, périmètre = 30.00
Cercle : aire = 78.54, périmètre = 31.42
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```rust
use std::f64::consts::PI;

trait Forme {
    fn aire(&self) -> f64;
    fn perimetre(&self) -> f64;

    fn description(&self) {
        println!("Aire = {:.2}, périmètre = {:.2}", self.aire(), self.perimetre());
    }
}

struct Rectangle {
    largeur: f64,
    hauteur: f64,
}

struct Cercle {
    rayon: f64,
}

impl Forme for Rectangle {
    fn aire(&self) -> f64 {
        self.largeur * self.hauteur
    }

    fn perimetre(&self) -> f64 {
        2.0 * (self.largeur + self.hauteur)
    }
}

impl Forme for Cercle {
    fn aire(&self) -> f64 {
        PI * self.rayon * self.rayon
    }

    fn perimetre(&self) -> f64 {
        2.0 * PI * self.rayon
    }
}

fn main() {
    let rect = Rectangle { largeur: 10.0, hauteur: 5.0 };
    let cercle = Cercle { rayon: 5.0 };

    print!("Rectangle : ");
    rect.description();

    print!("Cercle : ");
    cercle.description();
}
```

---

## Navigation

← Fiche précédente : **[Collections](09-collections.md)**

→ Fiche suivante : **[Modules et Organisation du Code](11-modules-organisation.md)**
