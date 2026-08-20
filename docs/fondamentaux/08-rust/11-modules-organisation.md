---
tags:
  - Rust
  - Avancé
  - Pratique
description: "Modules et Organisation du Code"
estimated_time: "85 min"
fiche_number: 11
total_fiches: 16
cursus: "Rust"
---

# 11 - Modules et Organisation du Code

> **En bref** : À la fin de cette fiche, tu sauras organiser ton code en modules, contrôler la visibilité avec pub, et structurer un projet Rust avec plusieurs fichiers. Lecture estimée : 85 min.


## Prérequis

- Fiche **[06 - Structs (structures)](06-structs.md)**
- Fiche **[10 - Traits et génériques](10-traits-generiques.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras organiser ton code en modules, contrôler la visibilité avec `pub`, et structurer un projet Rust avec plusieurs fichiers.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un module ?

**Définition** : Un module est un conteneur qui regroupe du code lié (fonctions, structs, traits, etc.) et contrôle sa visibilité.

**Le problème que les modules résolvent** :

Sans modules, voici les problèmes rencontrés :

1. **Tout est global** : Tous les noms sont dans le même espace, risque de collision.
2. **Pas d'encapsulation** : Tout le code est accessible de partout.
3. **Organisation difficile** : Un seul fichier devient ingérable.

**Comment les modules résolvent ces problèmes** :

| Problème | Solution apportée par les modules |
| --- | --- |
| Tout est global | Chaque module a son propre espace de noms |
| Pas d'encapsulation | `pub` contrôle ce qui est visible de l'extérieur |
| Organisation difficile | Code réparti dans plusieurs fichiers/dossiers |

**Analogie concrète** : Un module est comme un bureau avec des tiroirs. Chaque tiroir (module) contient des documents liés. Certains tiroirs sont verrouillés (privés), d'autres sont ouverts (publics).

---

### Visibilité : public vs privé

| Mot-clé | Visibilité | Accès |
| --- | --- | --- |
| (rien) | Privé | Seulement dans le module et ses sous-modules |
| `pub` | Public | De n'importe où |
| `pub(crate)` | Crate-public | Seulement dans la même crate |
| `pub(super)` | Parent-public | Seulement dans le module parent |

**Règle par défaut** : Tout est privé. Tu dois explicitement ajouter `pub` pour rendre quelque chose public.

---

### Qu'est-ce qu'une crate ?

**Définition** : Une crate est l'unité de compilation de Rust. C'est soit un binaire (exécutable) soit une bibliothèque.

| Type de crate | Point d'entrée | Produit |
| --- | --- | --- |
| Binary crate | `src/main.rs` | Fichier exécutable |
| Library crate | `src/lib.rs` | Bibliothèque réutilisable |

---

### Structure d'un projet Rust

```text
mon-projet/
├── Cargo.toml
└── src/
    ├── main.rs         # Point d'entrée (binary crate)
    ├── lib.rs          # Point d'entrée (library crate)
    ├── module1.rs      # Module dans un fichier
    └── module2/        # Module dans un dossier
        ├── mod.rs      # Déclaration du module (ancienne convention)
        └── sous_module.rs
```

---

### use et chemins

| Chemin | Signification |
| --- | --- |
| `crate::module` | À partir de la racine de la crate courante |
| `self::module` | À partir du module courant |
| `super::module` | À partir du module parent |

---

## Étapes Pratiques

### Étape 1 : Définir un module inline

```rust
// Module défini directement dans le fichier
mod mathematiques {
    pub fn addition(a: i32, b: i32) -> i32 {
        a + b
    }

    pub fn soustraction(a: i32, b: i32) -> i32 {
        a - b
    }

    // Fonction privée (pas de pub)
    fn aide_interne() {
        println!("Fonction interne");
    }
}

fn main() {
    // Accès avec le chemin complet
    let resultat = mathematiques::addition(5, 3);
    println!("5 + 3 = {}", resultat);

    // mathematiques::aide_interne();  // Erreur : fonction privée
}
```

**Résultat attendu** :

```text
5 + 3 = 8
```

---

### Étape 2 : Utiliser use pour raccourcir les chemins

```rust
mod mathematiques {
    pub fn addition(a: i32, b: i32) -> i32 {
        a + b
    }

    pub fn multiplication(a: i32, b: i32) -> i32 {
        a * b
    }
}

// Importe les fonctions dans le scope courant
use mathematiques::addition;
use mathematiques::multiplication;

fn main() {
    // Plus besoin du préfixe mathematiques::
    println!("5 + 3 = {}", addition(5, 3));
    println!("5 * 3 = {}", multiplication(5, 3));
}
```

**Résultat attendu** :

```text
5 + 3 = 8
5 * 3 = 15
```

---

### Étape 3 : Importer plusieurs éléments

```rust
mod mathematiques {
    pub fn addition(a: i32, b: i32) -> i32 { a + b }
    pub fn soustraction(a: i32, b: i32) -> i32 { a - b }
    pub fn multiplication(a: i32, b: i32) -> i32 { a * b }
    pub fn division(a: i32, b: i32) -> i32 { a / b }
}

// Import groupé avec {}
use mathematiques::{addition, soustraction, multiplication};

// Import de tout avec *
// use mathematiques::*;

fn main() {
    println!("Addition : {}", addition(10, 5));
    println!("Soustraction : {}", soustraction(10, 5));
    println!("Multiplication : {}", multiplication(10, 5));

    // division n'est pas importé, utilise le chemin complet
    println!("Division : {}", mathematiques::division(10, 5));
}
```

**Résultat attendu** :

```text
Addition : 15
Soustraction : 5
Multiplication : 50
Division : 2
```

---

### Étape 4 : Renommer avec as

```rust
mod francais {
    pub fn bonjour() -> &'static str { "Bonjour" }
}

mod anglais {
    pub fn bonjour() -> &'static str { "Hello" }
}

// Renommage pour éviter les conflits
use francais::bonjour as bonjour_fr;
use anglais::bonjour as bonjour_en;

fn main() {
    println!("{}", bonjour_fr());
    println!("{}", bonjour_en());
}
```

**Résultat attendu** :

```text
Bonjour
Hello
```

---

### Étape 5 : Modules imbriqués

```rust
mod restaurant {
    pub mod cuisine {
        pub fn preparer_plat() {
            println!("Préparation du plat...");
            cuisson_interne();      // Peut appeler des fonctions privées du module
        }

        fn cuisson_interne() {
            println!("  Cuisson en cours...");
        }
    }

    pub mod service {
        pub fn servir_plat() {
            println!("Service du plat");
        }
    }

    // Module privé
    mod comptabilite {
        pub fn calculer_prix() -> f64 {
            25.0
        }
    }

    // Fonction publique qui utilise un module privé
    pub fn prix_menu() -> f64 {
        comptabilite::calculer_prix()
    }
}

fn main() {
    restaurant::cuisine::preparer_plat();
    restaurant::service::servir_plat();
    println!("Prix : {} €", restaurant::prix_menu());

    // restaurant::comptabilite::calculer_prix();  // Erreur : module privé
}
```

**Résultat attendu** :

```text
Préparation du plat...
  Cuisson en cours...
Service du plat
Prix : 25 €
```

---

### Étape 6 : super pour accéder au parent

```rust
mod parent {
    pub fn fonction_parent() {
        println!("Je suis dans le parent");
    }

    pub mod enfant {
        pub fn appeler_parent() {
            // super:: remonte au module parent
            super::fonction_parent();
        }
    }
}

fn main() {
    parent::enfant::appeler_parent();
}
```

**Résultat attendu** :

```text
Je suis dans le parent
```

---

### Étape 7 : Structs avec champs publics

```rust
mod utilisateurs {
    pub struct Utilisateur {
        pub nom: String,        // Champ public
        email: String,          // Champ privé
    }

    impl Utilisateur {
        // Constructeur public (nécessaire car email est privé)
        pub fn new(nom: String, email: String) -> Utilisateur {
            Utilisateur { nom, email }
        }

        // Getter public pour le champ privé
        pub fn email(&self) -> &str {
            &self.email
        }
    }
}

fn main() {
    let user = utilisateurs::Utilisateur::new(
        String::from("Alice"),
        String::from("alice@example.com"),
    );

    println!("Nom : {}", user.nom);         // OK : champ public
    println!("Email : {}", user.email());   // OK : via getter

    // println!("{}", user.email);          // Erreur : champ privé
}
```

**Résultat attendu** :

```text
Nom : Alice
Email : alice@example.com
```

---

### Étape 8 : Module dans un fichier séparé

**Structure du projet** :

```text
src/
├── main.rs
└── mathematiques.rs
```

**src/mathematiques.rs** :

```rust
pub fn addition(a: i32, b: i32) -> i32 {
    a + b
}

pub fn multiplication(a: i32, b: i32) -> i32 {
    a * b
}
```

**src/main.rs** :

```rust
// Déclare le module (cherche mathematiques.rs ou mathematiques/mod.rs)
mod mathematiques;

use mathematiques::{addition, multiplication};

fn main() {
    println!("5 + 3 = {}", addition(5, 3));
    println!("5 * 3 = {}", multiplication(5, 3));
}
```

**Résultat attendu** :

```text
5 + 3 = 8
5 * 3 = 15
```

---

### Étape 9 : Module dans un dossier

**Structure du projet** :

```text
src/
├── main.rs
└── geometrie/
    ├── mod.rs          # Fichier principal du module
    ├── rectangle.rs
    └── cercle.rs
```

**src/geometrie/mod.rs** :

```rust
// Déclare les sous-modules
pub mod rectangle;
pub mod cercle;

// Réexporte pour un accès plus simple
pub use rectangle::Rectangle;
pub use cercle::Cercle;
```

**src/geometrie/rectangle.rs** :

```rust
pub struct Rectangle {
    pub largeur: f64,
    pub hauteur: f64,
}

impl Rectangle {
    pub fn new(largeur: f64, hauteur: f64) -> Rectangle {
        Rectangle { largeur, hauteur }
    }

    pub fn aire(&self) -> f64 {
        self.largeur * self.hauteur
    }
}
```

**src/geometrie/cercle.rs** :

```rust
use std::f64::consts::PI;

pub struct Cercle {
    pub rayon: f64,
}

impl Cercle {
    pub fn new(rayon: f64) -> Cercle {
        Cercle { rayon }
    }

    pub fn aire(&self) -> f64 {
        PI * self.rayon * self.rayon
    }
}
```

**src/main.rs** :

```rust
mod geometrie;

use geometrie::{Rectangle, Cercle};

fn main() {
    let rect = Rectangle::new(10.0, 5.0);
    let cercle = Cercle::new(3.0);

    println!("Aire du rectangle : {}", rect.aire());
    println!("Aire du cercle : {:.2}", cercle.aire());
}
```

**Résultat attendu** :

```text
Aire du rectangle : 50
Aire du cercle : 28.27
```

---

### Étape 10 : pub use pour réexporter

```rust
mod internal {
    pub mod utils {
        pub fn helper() {
            println!("Helper appelé");
        }
    }
}

// Réexporte au niveau supérieur
pub use internal::utils::helper;

fn main() {
    // Accès simplifié grâce au réexport
    helper();

    // L'ancien chemin fonctionne toujours
    internal::utils::helper();
}
```

**Résultat attendu** :

```text
Helper appelé
Helper appelé
```

---

### Étape 11 : Créer une library crate

**Structure du projet** :

```text
ma-lib/
├── Cargo.toml
└── src/
    └── lib.rs
```

**src/lib.rs** :

```rust
//! Ma bibliothèque de calculs.
//!
//! # Exemple
//! ```
//! use ma_lib::calculer;
//! let resultat = calculer(5, 3);
//! assert_eq!(resultat, 8);
//! ```

/// Additionne deux nombres.
pub fn calculer(a: i32, b: i32) -> i32 {
    a + b
}

/// Module pour les opérations avancées.
pub mod avance {
    /// Calcule le carré d'un nombre.
    pub fn carre(n: i32) -> i32 {
        n * n
    }
}
```

**Utilisation depuis un autre projet** (après ajout dans Cargo.toml) :

```rust
use ma_lib::{calculer, avance};

fn main() {
    println!("5 + 3 = {}", calculer(5, 3));
    println!("5² = {}", avance::carre(5));
}
```

---

### Étape 12 : Utiliser des crates externes

**Cargo.toml** :

```toml
[dependencies]
rand = "0.8"
```

**src/main.rs** :

```rust
use rand::Rng;

fn main() {
    let mut rng = rand::thread_rng();

    // Génère un nombre aléatoire entre 1 et 100
    let nombre: i32 = rng.gen_range(1..=100);
    println!("Nombre aléatoire : {}", nombre);
}
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo new nom --lib` | Crée une nouvelle library crate |
| `cargo build` | Compile le projet |
| `cargo doc --open` | Génère et ouvre la documentation |

---

## Pièges Fréquents

### Piège 1 : Oublier mod pour déclarer un fichier

**Problème** : Le fichier existe mais Rust ne le trouve pas.

```text
src/
├── main.rs
└── utils.rs       # Existe mais non déclaré
```

**Solution** : Ajoute `mod utils;` dans `main.rs`.

---

### Piège 2 : Oublier pub

**Problème** : Tu ne peux pas accéder à une fonction/struct depuis l'extérieur.

**Solution** : Ajoute `pub` devant les éléments à exposer.

---

### Piège 3 : Struct publique avec champs privés

**Problème** : Tu ne peux pas créer l'instance directement.

```rust
pub struct Config {
    host: String,   // Privé !
}

// Dans un autre module :
let c = Config { host: String::from("localhost") };  // Erreur
```

**Solution** : Crée un constructeur `pub fn new()`.

---

### Piège 4 : Chemin incorrect avec self, super, crate

**Problème** : Confusion entre les différents préfixes.

**Solution** :

- `crate::` = racine de la crate
- `super::` = module parent
- `self::` = module courant (souvent optionnel)

---

## Checklist de Validation

- [ ] Je sais créer un module inline avec `mod`
- [ ] Je sais utiliser `use` pour importer des éléments
- [ ] Je comprends la visibilité `pub` vs privé
- [ ] Je sais créer un module dans un fichier séparé
- [ ] Je sais créer un module dans un dossier avec `mod.rs`
- [ ] Je sais utiliser `super::` et `crate::`
- [ ] Je sais réexporter avec `pub use`

---

## Exercice Pratique

**Énoncé** : Crée un projet avec la structure suivante :

1. Un module `formes` contenant :
   - Un sous-module `rectangle` avec une struct `Rectangle`
   - Un sous-module `cercle` avec une struct `Cercle`
2. Les deux structs doivent avoir une méthode `aire()`
3. Réexporte les structs au niveau de `formes` pour un accès simplifié

**Structure attendue** :

```text
src/
├── main.rs
└── formes/
    ├── mod.rs
    ├── rectangle.rs
    └── cercle.rs
```

**Résultat attendu** :

```text
Aire du rectangle : 20
Aire du cercle : 28.27
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**src/formes/mod.rs** :

```rust
pub mod rectangle;
pub mod cercle;

pub use rectangle::Rectangle;
pub use cercle::Cercle;
```

**src/formes/rectangle.rs** :

```rust
pub struct Rectangle {
    pub largeur: f64,
    pub hauteur: f64,
}

impl Rectangle {
    pub fn new(largeur: f64, hauteur: f64) -> Rectangle {
        Rectangle { largeur, hauteur }
    }

    pub fn aire(&self) -> f64 {
        self.largeur * self.hauteur
    }
}
```

**src/formes/cercle.rs** :

```rust
use std::f64::consts::PI;

pub struct Cercle {
    pub rayon: f64,
}

impl Cercle {
    pub fn new(rayon: f64) -> Cercle {
        Cercle { rayon }
    }

    pub fn aire(&self) -> f64 {
        PI * self.rayon * self.rayon
    }
}
```

**src/main.rs** :

```rust
mod formes;

use formes::{Rectangle, Cercle};

fn main() {
    let rect = Rectangle::new(4.0, 5.0);
    let cercle = Cercle::new(3.0);

    println!("Aire du rectangle : {}", rect.aire());
    println!("Aire du cercle : {:.2}", cercle.aire());
}
```

---

## Navigation

← Fiche précédente : **[Traits et Génériques](10-traits-generiques.md)**

→ Fiche suivante : **[Tests](12-tests.md)**
