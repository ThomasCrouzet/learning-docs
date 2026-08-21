---
tags:
  - Rust
  - Intermédiaire
  - Pratique
description: "Enums et Pattern Matching"
estimated_time: "85 min"
fiche_number: 7
total_fiches: 16
cursus: "Rust"
id: "fundamentals.rust.enums-pattern-matching"
course_id: "fundamentals.rust"
content_type: "lesson"
order: 7
---

# 07 - Enums et Pattern Matching

> **En bref** : À la fin de cette fiche, tu sauras créer des enums avec ou sans données associées, utiliser le pattern matching avancé, et comprendre les types Option et Result. Lecture estimée : 85 min.


## Prérequis

- Fiche **[03 - Fonctions et contrôle de flux](03-fonctions-controle-flux.md)** (introduction à `match`)
- Fiche **[06 - Structs (structures)](06-structs.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des enums avec ou sans données associées, utiliser le pattern matching avancé, et comprendre les types `Option` et `Result`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un enum ?

**Définition** : Un enum (énumération) est un type qui peut avoir une valeur parmi un ensemble fini de variantes.

**Le problème que les enums résolvent** :

Sans enums, voici les problèmes rencontrés :

1. **Valeurs magiques** : On utilise des nombres (0, 1, 2) ou des strings pour représenter des états.
2. **Pas de validation** : Rien n'empêche d'utiliser une valeur invalide.
3. **Code fragile** : Un changement de valeur casse le code silencieusement.

**Comment les enums résolvent ces problèmes** :

| Problème | Solution apportée par les enums |
| --- | --- |
| Valeurs magiques | Variantes nommées et explicites |
| Pas de validation | Le compilateur accepte uniquement les variantes définies |
| Code fragile | Le compilateur t'oblige à gérer tous les cas avec `match` |

**Analogie concrète** : Un enum est comme un feu de signalisation. Il peut être ROUGE, ORANGE ou VERT. Pas d'autre valeur possible.

---

### Enums avec données associées

**Définition** : En Rust, chaque variante d'un enum peut contenir des données de types différents.

```rust
enum Message {
    Quit,                           // Pas de données
    Move { x: i32, y: i32 },       // Struct anonyme
    Write(String),                  // Une String
    ChangeColor(i32, i32, i32),    // Trois entiers
}
```

**Ce que les enums Rust ne sont PAS** :

- Ce ne sont pas de simples constantes comme en C/Java
- Chaque variante peut avoir sa propre "forme" de données

---

### Qu'est-ce que `Option<T>` ?

**Définition** : `Option<T>` est un enum standard de Rust qui représente une valeur qui peut être présente (`Some(valeur)`) ou absente (`None`).

```rust
enum Option<T> {
    None,       // Pas de valeur
    Some(T),    // Une valeur de type T
}
```

**Le problème que Option résout** :

Sans Option (avec `null` comme en Java/C), voici les problèmes :

1. **NullPointerException** : Accéder à une valeur qui n'existe pas provoque un crash.
2. **Vérifications oubliées** : On oublie de tester si la valeur est null.
3. **Null silencieux** : On ne sait pas si null est volontaire ou une erreur.

**Comment Option résout ces problèmes** :

| Problème | Solution apportée par Option |
| --- | --- |
| NullPointerException | Impossible d'accéder à la valeur sans gérer le cas `None` |
| Vérifications oubliées | Le compilateur t'oblige à gérer `None` |
| Null silencieux | `None` est explicite et typé |

**Analogie concrète** : `Option` est comme une boîte qui peut être vide ou contenir un objet. Tu dois ouvrir la boîte et vérifier son contenu avant d'utiliser l'objet.

---

### Qu'est-ce que `Result<T, E>` ?

**Définition** : `Result<T, E>` est un enum qui représente soit un succès (`Ok(valeur)`), soit une erreur (`Err(erreur)`).

```rust
enum Result<T, E> {
    Ok(T),      // Succès avec une valeur de type T
    Err(E),     // Erreur avec une valeur de type E
}
```

**Utilisation** : Toute opération qui peut échouer retourne un `Result`.

---

### Pattern matching avancé

| Pattern | Description | Exemple |
| --- | --- | --- |
| Valeur exacte | Correspond à une valeur précise | `1 => ...` |
| Multiple | Plusieurs valeurs avec `\|` | `1 \| 2 \| 3 => ...` |
| Range | Plage de valeurs | `1..=5 => ...` |
| Wildcard | N'importe quelle valeur | `_ => ...` |
| Variable | Capture la valeur | `n => println!("{}", n)` |
| Guard | Condition supplémentaire | `n if n > 10 => ...` |
| Destructuring | Extrait les données | `Some(x) => ...` |

---

## Étapes Pratiques

### Étape 1 : Définir un enum simple

```rust
enum Direction {
    Nord,
    Sud,
    Est,
    Ouest,
}

fn main() {
    let dir = Direction::Nord;

    match dir {
        Direction::Nord => println!("Vers le nord"),
        Direction::Sud => println!("Vers le sud"),
        Direction::Est => println!("Vers l'est"),
        Direction::Ouest => println!("Vers l'ouest"),
    }
}
```

**Résultat attendu** :

```text
Vers le nord
```

---

### Étape 2 : Enum avec données associées

```rust
enum Message {
    Quitter,
    Deplacer { x: i32, y: i32 },
    Ecrire(String),
    ChangerCouleur(i32, i32, i32),
}

fn main() {
    let msg1 = Message::Quitter;
    let msg2 = Message::Deplacer { x: 10, y: 20 };
    let msg3 = Message::Ecrire(String::from("Bonjour"));
    let msg4 = Message::ChangerCouleur(255, 0, 0);

    traiter_message(msg1);
    traiter_message(msg2);
    traiter_message(msg3);
    traiter_message(msg4);
}

fn traiter_message(msg: Message) {
    match msg {
        Message::Quitter => {
            println!("Quitter le programme");
        }
        Message::Deplacer { x, y } => {
            println!("Déplacer vers x={}, y={}", x, y);
        }
        Message::Ecrire(texte) => {
            println!("Message : {}", texte);
        }
        Message::ChangerCouleur(r, g, b) => {
            println!("Couleur RGB : ({}, {}, {})", r, g, b);
        }
    }
}
```

**Résultat attendu** :

```text
Quitter le programme
Déplacer vers x=10, y=20
Message : Bonjour
Couleur RGB : (255, 0, 0)
```

---

### Étape 3 : Utiliser Option

```rust
fn main() {
    let nombre = Some(5);       // Option<i32> avec une valeur
    let rien: Option<i32> = None;   // Option<i32> sans valeur

    println!("nombre : {:?}", nombre);
    println!("rien : {:?}", rien);
}
```

**Résultat attendu** :

```text
nombre : Some(5)
rien : None
```

---

### Étape 4 : Match sur Option

```rust
fn plus_un(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,               // Si pas de valeur, retourne None
        Some(i) => Some(i + 1),     // Si valeur, retourne valeur + 1
    }
}

fn main() {
    let cinq = Some(5);
    let six = plus_un(cinq);
    let aucun = plus_un(None);

    println!("cinq + 1 = {:?}", six);
    println!("None + 1 = {:?}", aucun);
}
```

**Résultat attendu** :

```text
cinq + 1 = Some(6)
None + 1 = None
```

---

### Étape 5 : Méthodes de Option

```rust
fn main() {
    let x: Option<i32> = Some(5);
    let y: Option<i32> = None;

    // is_some() et is_none()
    println!("x.is_some() = {}", x.is_some());      // true
    println!("y.is_none() = {}", y.is_none());      // true

    // unwrap_or() : valeur par défaut si None
    println!("x.unwrap_or(0) = {}", x.unwrap_or(0)); // 5
    println!("y.unwrap_or(0) = {}", y.unwrap_or(0)); // 0

    // unwrap() : extrait la valeur (panic si None !)
    println!("x.unwrap() = {}", x.unwrap());        // 5
    // y.unwrap();  // PANIC ! N'utilise jamais unwrap sur un None potentiel
}
```

**Résultat attendu** :

```text
x.is_some() = true
y.is_none() = true
x.unwrap_or(0) = 5
y.unwrap_or(0) = 0
x.unwrap() = 5
```

---

### Étape 6 : if let pour match simple

```rust
fn main() {
    let config_max = Some(3u8);

    // Avec match (verbeux pour un seul cas)
    match config_max {
        Some(max) => println!("Maximum configuré : {}", max),
        _ => (),    // Ne fait rien
    }

    // Avec if let (plus concis)
    if let Some(max) = config_max {
        println!("Maximum configuré : {}", max);
    }
}
```

**Résultat attendu** :

```text
Maximum configuré : 3
Maximum configuré : 3
```

**Règle** : Utilise `if let` quand tu ne t'intéresses qu'à un seul pattern.

---

### Étape 7 : if let avec else

```rust
fn main() {
    let valeur: Option<i32> = None;

    if let Some(v) = valeur {
        println!("Valeur trouvée : {}", v);
    } else {
        println!("Aucune valeur");
    }
}
```

**Résultat attendu** :

```text
Aucune valeur
```

---

### Étape 8 : Pattern matching avec guards

```rust
fn main() {
    let nombre = Some(7);

    match nombre {
        Some(n) if n < 5 => println!("{} est petit", n),
        Some(n) if n < 10 => println!("{} est moyen", n),
        Some(n) => println!("{} est grand", n),
        None => println!("Pas de nombre"),
    }
}
```

**Résultat attendu** :

```text
7 est moyen
```

---

### Étape 9 : Pattern matching avec ranges

```rust
fn main() {
    let note = 75;

    let appreciation = match note {
        0..=49 => "Insuffisant",
        50..=69 => "Passable",
        70..=84 => "Bien",
        85..=100 => "Excellent",
        _ => "Note invalide",
    };

    println!("Note {} : {}", note, appreciation);
}
```

**Résultat attendu** :

```text
Note 75 : Bien
```

---

### Étape 10 : Destructuring dans match

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 0, y: 7 };

    match p {
        Point { x: 0, y: 0 } => println!("À l'origine"),
        Point { x: 0, y } => println!("Sur l'axe Y à y={}", y),
        Point { x, y: 0 } => println!("Sur l'axe X à x={}", x),
        Point { x, y } => println!("Point ({}, {})", x, y),
    }
}
```

**Résultat attendu** :

```text
Sur l'axe Y à y=7
```

---

### Étape 11 : Ignorer des valeurs avec _

```rust
fn main() {
    let nombres = (1, 2, 3, 4, 5);

    match nombres {
        (premier, _, troisieme, _, cinquieme) => {
            println!("Premier : {}, Troisième : {}, Cinquième : {}",
                premier, troisieme, cinquieme);
        }
    }
}
```

**Résultat attendu** :

```text
Premier : 1, Troisième : 3, Cinquième : 5
```

---

### Étape 12 : Enum avec méthodes

```rust
enum Statut {
    EnAttente,
    EnCours { progression: u8 },
    Termine,
    Erreur(String),
}

impl Statut {
    fn description(&self) -> String {
        match self {
            Statut::EnAttente => String::from("En attente de démarrage"),
            Statut::EnCours { progression } => {
                format!("En cours : {}%", progression)
            }
            Statut::Termine => String::from("Terminé avec succès"),
            Statut::Erreur(msg) => format!("Erreur : {}", msg),
        }
    }

    fn est_termine(&self) -> bool {
        matches!(self, Statut::Termine | Statut::Erreur(_))
    }
}

fn main() {
    let statuts = vec![
        Statut::EnAttente,
        Statut::EnCours { progression: 50 },
        Statut::Termine,
        Statut::Erreur(String::from("Fichier introuvable")),
    ];

    for statut in statuts {
        println!("{} (terminé: {})", statut.description(), statut.est_termine());
    }
}
```

**Résultat attendu** :

```text
En attente de démarrage (terminé: false)
En cours : 50% (terminé: false)
Terminé avec succès (terminé: true)
Erreur : Fichier introuvable (terminé: true)
```

---

### Étape 13 : while let

```rust
fn main() {
    let mut pile = vec![1, 2, 3];

    // pop() retourne Option<i32>
    while let Some(valeur) = pile.pop() {
        println!("Dépilé : {}", valeur);
    }

    println!("Pile vide");
}
```

**Résultat attendu** :

```text
Dépilé : 3
Dépilé : 2
Dépilé : 1
Pile vide
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo run` | Compile et exécute le programme |
| `cargo check` | Vérifie la syntaxe sans compiler |

---

## Pièges Fréquents

### Piège 1 : Match non exhaustif

**Problème** : Tu oublies de gérer tous les cas.

```rust
enum Couleur { Rouge, Vert, Bleu }

fn main() {
    let c = Couleur::Rouge;
    match c {
        Couleur::Rouge => println!("Rouge"),
        Couleur::Vert => println!("Vert"),
        // Erreur : Bleu n'est pas géré
    }
}
```

**Solution** : Ajoute tous les cas où utilise `_` :

```rust
match c {
    Couleur::Rouge => println!("Rouge"),
    _ => println!("Autre"),
}
```

---

### Piège 2 : Utiliser unwrap sans vérification

**Problème** : `unwrap()` sur `None` cause un panic.

```rust
let x: Option<i32> = None;
let v = x.unwrap();     // PANIC !
```

**Solution** : Utilise `match`, `if let`, ou `unwrap_or` :

```rust
let v = x.unwrap_or(0);     // Retourne 0 si None
```

---

### Piège 3 : Oublier d'importer les variantes

**Problème** : Tu dois toujours préfixer avec le nom de l'enum.

```rust
enum Direction { Nord, Sud }

fn main() {
    let d = Nord;       // Erreur : Nord n'existe pas dans ce scope
}
```

**Solution** : Utilise le nom complet ou importe les variantes :

```rust
use Direction::*;       // Importe toutes les variantes

fn main() {
    let d = Nord;       // OK
}
```

---

### Piège 4 : Confondre Some(x) et x

**Problème** : Tu oublies que la valeur est "emballée" dans Some.

```rust
let x: Option<i32> = Some(5);
let y = x + 1;      // Erreur : ne peut pas additionner Option<i32> et i32
```

**Solution** : Extrais la valeur d'abord :

```rust
if let Some(valeur) = x {
    let y = valeur + 1;
}
```

---

## Checklist de Validation

- [ ] Je sais définir un enum simple
- [ ] Je sais définir un enum avec données associées
- [ ] Je sais utiliser `match` pour traiter les variantes
- [ ] Je comprends `Option<T>` (Some et None)
- [ ] Je sais utiliser `if let` pour un pattern simple
- [ ] Je connais les méthodes de Option (`unwrap_or`, `is_some`, etc.)
- [ ] Je sais utiliser les guards dans match (`if condition`)
- [ ] Je sais utiliser les ranges dans match (`1..=10`)

---

## Exercice Pratique

**Énoncé** : Crée un enum `Operation` qui représente les quatre opérations mathématiques :

- `Addition(f64, f64)`
- `Soustraction(f64, f64)`
- `Multiplication(f64, f64)`
- `Division(f64, f64)`

Crée une fonction `calculer` qui prend une `Operation` et retourne `Option<f64>` (None si division par zéro).

**Résultat attendu** :

```text
5 + 3 = Some(8.0)
10 - 4 = Some(6.0)
6 * 7 = Some(42.0)
15 / 3 = Some(5.0)
10 / 0 = None
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```rust
enum Operation {
    Addition(f64, f64),
    Soustraction(f64, f64),
    Multiplication(f64, f64),
    Division(f64, f64),
}

fn calculer(op: Operation) -> Option<f64> {
    match op {
        Operation::Addition(a, b) => Some(a + b),
        Operation::Soustraction(a, b) => Some(a - b),
        Operation::Multiplication(a, b) => Some(a * b),
        Operation::Division(a, b) => {
            if b == 0.0 {
                None        // Division par zéro
            } else {
                Some(a / b)
            }
        }
    }
}

fn main() {
    println!("5 + 3 = {:?}", calculer(Operation::Addition(5.0, 3.0)));
    println!("10 - 4 = {:?}", calculer(Operation::Soustraction(10.0, 4.0)));
    println!("6 * 7 = {:?}", calculer(Operation::Multiplication(6.0, 7.0)));
    println!("15 / 3 = {:?}", calculer(Operation::Division(15.0, 3.0)));
    println!("10 / 0 = {:?}", calculer(Operation::Division(10.0, 0.0)));
}
```

---

## Navigation

← Fiche précédente : **[Structs (Structures)](06-structs.md)**

→ Fiche suivante : **[Gestion des Erreurs](08-gestion-erreurs.md)**
