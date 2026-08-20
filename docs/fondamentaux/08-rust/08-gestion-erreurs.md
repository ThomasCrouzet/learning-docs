---
tags:
  - Rust
  - Avancé
  - Pratique
description: "Gestion des Erreurs"
estimated_time: "70 min"
fiche_number: 8
total_fiches: 16
cursus: "Rust"
---

# 08 - Gestion des Erreurs

> **En bref** : À la fin de cette fiche, tu sauras utiliser `Result<T, E>` pour gérer les erreurs, propager les erreurs avec ?, et créer tes propres types d'erreurs. Lecture estimée : 70 min.


## Prérequis

- Fiche **[07 - Enums et pattern matching](07-enums-pattern-matching.md)**
- Comprendre `Option<T>` et le pattern matching

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser `Result<T, E>` pour gérer les erreurs, propager les erreurs avec `?`, et créer tes propres types d'erreurs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Types d'erreurs en Rust

Rust distingue deux catégories d'erreurs :

| Type | Description | Gestion |
| --- | --- | --- |
| Erreurs récupérables | L'opération a échoué mais on peut continuer | `Result<T, E>` |
| Erreurs irrécupérables | Bug, état incohérent, impossible de continuer | `panic!` |

**Exemples** :

- Fichier non trouvé → Récupérable (on peut demander un autre chemin)
- Index hors limites dans un tableau → Irrécupérable (bug dans le code)

---

### Qu'est-ce que `Result<T, E>` ?

**Définition** : `Result<T, E>` est un enum qui représente soit un succès avec une valeur de type `T`, soit une erreur de type `E`.

```rust
enum Result<T, E> {
    Ok(T),      // Succès : contient la valeur
    Err(E),     // Erreur : contient l'information sur l'erreur
}
```

**Le problème que Result résout** :

Sans Result (avec des codes de retour comme en C), voici les problèmes :

1. **Erreurs ignorées** : On oublie de vérifier le code de retour.
2. **Valeurs magiques** : -1 signifie erreur, mais ce n'est pas explicite.
3. **Perte d'information** : On ne sait pas quelle erreur s'est produite.

**Comment Result résout ces problèmes** :

| Problème | Solution apportée par Result |
| --- | --- |
| Erreurs ignorées | Le compilateur avertit si tu ignores un Result |
| Valeurs magiques | `Ok` et `Err` sont explicites et typés |
| Perte d'information | `E` contient le détail de l'erreur |

**Analogie concrète** : `Result` est comme le résultat d'un examen médical. Soit tout va bien (`Ok` avec les résultats), soit il y a un problème (`Err` avec le diagnostic).

---

### Qu'est-ce que panic! ?

**Définition** : `panic!` arrête immédiatement le programme et affiche un message d'erreur.

**Quand utiliser panic!** :

- Situation impossible qui ne devrait jamais arriver (bug)
- État incohérent qu'on ne peut pas corriger
- Prototype ou tests où la gestion d'erreur n'est pas encore implémentée

**Quand NE PAS utiliser panic!** :

- Erreurs "normales" comme fichier non trouvé, entrée invalide
- Code de bibliothèque (laisse l'appelant décider)
- Situations récupérables

---

### L'opérateur ?

**Définition** : L'opérateur `?` propage automatiquement l'erreur si `Result` est `Err`, sinon extrait la valeur de `Ok`.

**Avant** (sans `?`) :

```rust
fn lire_fichier() -> Result<String, io::Error> {
    let f = File::open("fichier.txt");
    let mut f = match f {
        Ok(fichier) => fichier,
        Err(e) => return Err(e),    // Propagation manuelle
    };
    // ...
}
```

**Après** (avec `?`) :

```rust
fn lire_fichier() -> Result<String, io::Error> {
    let mut f = File::open("fichier.txt")?;     // ? propage l'erreur
    // ...
}
```

**Règles de `?`** :

1. Ne peut être utilisé que dans une fonction qui retourne `Result` ou `Option`
2. Le type d'erreur doit être compatible avec le type de retour

---

### unwrap et expect

| Méthode | Comportement si `Err` | Utilisation |
| --- | --- | --- |
| `unwrap()` | Panic avec message générique | Prototypes, tests, quand tu sais que ça ne peut pas échouer |
| `expect("msg")` | Panic avec ton message | Meilleur que unwrap car le message aide au debug |

**Règle** : N'utilise `unwrap()`/`expect()` que si :

- Tu es certain que l'erreur ne peut pas se produire
- C'est un prototype ou un test
- Tu préfères crasher plutôt que de continuer avec des données incorrectes

---

## Étapes Pratiques

### Étape 1 : Comprendre Result avec une division

```rust
fn diviser(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Division par zéro"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    let resultat1 = diviser(10.0, 2.0);
    let resultat2 = diviser(10.0, 0.0);

    println!("10 / 2 = {:?}", resultat1);
    println!("10 / 0 = {:?}", resultat2);
}
```

**Résultat attendu** :

```text
10 / 2 = Ok(5.0)
10 / 0 = Err("Division par zéro")
```

---

### Étape 2 : Traiter Result avec match

```rust
fn diviser(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Division par zéro"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    let resultat = diviser(10.0, 2.0);

    match resultat {
        Ok(valeur) => println!("Résultat : {}", valeur),
        Err(erreur) => println!("Erreur : {}", erreur),
    }

    let resultat2 = diviser(10.0, 0.0);

    match resultat2 {
        Ok(valeur) => println!("Résultat : {}", valeur),
        Err(erreur) => println!("Erreur : {}", erreur),
    }
}
```

**Résultat attendu** :

```text
Résultat : 5
Erreur : Division par zéro
```

---

### Étape 3 : Utiliser unwrap_or et unwrap_or_else

```rust
fn diviser(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Division par zéro"))
    } else {
        Ok(a / b)
    }
}

fn main() {
    // unwrap_or : valeur par défaut
    let r1 = diviser(10.0, 0.0).unwrap_or(0.0);
    println!("Avec unwrap_or : {}", r1);

    // unwrap_or_else : calcul de la valeur par défaut
    let r2 = diviser(10.0, 0.0).unwrap_or_else(|err| {
        println!("Erreur capturée : {}", err);
        -1.0    // Valeur de remplacement
    });
    println!("Avec unwrap_or_else : {}", r2);
}
```

**Résultat attendu** :

```text
Avec unwrap_or : 0
Erreur capturée : Division par zéro
Avec unwrap_or_else : -1
```

---

### Étape 4 : Lire un fichier avec gestion d'erreur

```rust
use std::fs::File;
use std::io::Read;

fn main() {
    // Tente d'ouvrir un fichier qui n'existe pas
    let fichier = File::open("inexistant.txt");

    match fichier {
        Ok(mut f) => {
            let mut contenu = String::new();
            match f.read_to_string(&mut contenu) {
                Ok(_) => println!("Contenu : {}", contenu),
                Err(e) => println!("Erreur de lecture : {}", e),
            }
        }
        Err(e) => println!("Erreur d'ouverture : {}", e),
    }
}
```

**Résultat attendu** :

```text
Erreur d'ouverture : No such file or directory (os error 2)
```

---

### Étape 5 : Utiliser l'opérateur ?

```rust
use std::fs::File;
use std::io::{self, Read};

fn lire_fichier(chemin: &str) -> Result<String, io::Error> {
    let mut fichier = File::open(chemin)?;      // ? propage l'erreur si échec
    let mut contenu = String::new();
    fichier.read_to_string(&mut contenu)?;      // ? propage l'erreur si échec
    Ok(contenu)
}

fn main() {
    match lire_fichier("inexistant.txt") {
        Ok(contenu) => println!("Contenu : {}", contenu),
        Err(e) => println!("Erreur : {}", e),
    }
}
```

**Résultat attendu** :

```text
Erreur : No such file or directory (os error 2)
```

---

### Étape 6 : Chaîner avec ?

```rust
use std::fs::File;
use std::io::{self, Read};

fn lire_fichier(chemin: &str) -> Result<String, io::Error> {
    let mut contenu = String::new();
    File::open(chemin)?.read_to_string(&mut contenu)?;
    Ok(contenu)
}

fn main() {
    match lire_fichier("test.txt") {
        Ok(c) => println!("Contenu : {}", c),
        Err(e) => println!("Erreur : {}", e),
    }
}
```

**Explication** : On peut chaîner les opérations avec `?`. Si une étape échoue, l'erreur est propagée immédiatement.

---

### Étape 7 : Utiliser ? dans main

```rust
use std::fs::File;
use std::io::{self, Read};

fn main() -> Result<(), io::Error> {    // main peut retourner Result
    let mut fichier = File::open("test.txt")?;
    let mut contenu = String::new();
    fichier.read_to_string(&mut contenu)?;
    println!("Contenu : {}", contenu);
    Ok(())      // Tout s'est bien passé
}
```

**Note** : Si main retourne `Err`, le programme affiche l'erreur et termine avec un code d'erreur non-nul.

---

### Étape 8 : panic! pour les erreurs irrécupérables

```rust
fn main() {
    // Ne pas exécuter ce code en production !
    // panic!("Crash volontaire !");

    let v = vec![1, 2, 3];
    // Ceci provoque un panic automatique :
    // let element = v[99];     // Index hors limites

    // Version sûre avec get() qui retourne Option
    match v.get(99) {
        Some(valeur) => println!("Valeur : {}", valeur),
        None => println!("Index hors limites"),
    }
}
```

**Résultat attendu** :

```text
Index hors limites
```

---

### Étape 9 : expect pour un meilleur message

```rust
use std::fs::File;

fn main() {
    // expect donne un message personnalisé en cas de panic
    let _fichier = File::open("config.txt")
        .expect("Le fichier config.txt doit exister");
}
```

**Résultat attendu** (si le fichier n'existe pas) :

```text
thread 'main' panicked at 'Le fichier config.txt doit exister: Os { code: 2, kind: NotFound, message: "No such file or directory" }', src/main.rs:5:10
```

---

### Étape 10 : Créer un type d'erreur personnalisé

```rust
use std::fmt;

#[derive(Debug)]
enum MonErreur {
    DivisionParZero,
    NombreNegatif,
    ValeurTropGrande(i32),
}

impl fmt::Display for MonErreur {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            MonErreur::DivisionParZero => write!(f, "Division par zéro"),
            MonErreur::NombreNegatif => write!(f, "Le nombre ne peut pas être négatif"),
            MonErreur::ValeurTropGrande(val) => {
                write!(f, "La valeur {} est trop grande (max 100)", val)
            }
        }
    }
}

fn calculer(a: i32, b: i32) -> Result<i32, MonErreur> {
    if b == 0 {
        return Err(MonErreur::DivisionParZero);
    }
    if a < 0 || b < 0 {
        return Err(MonErreur::NombreNegatif);
    }
    let resultat = a / b;
    if resultat > 100 {
        return Err(MonErreur::ValeurTropGrande(resultat));
    }
    Ok(resultat)
}

fn main() {
    println!("10 / 2 = {:?}", calculer(10, 2));
    println!("10 / 0 = {:?}", calculer(10, 0));
    println!("-5 / 2 = {:?}", calculer(-5, 2));
    println!("1000 / 5 = {:?}", calculer(1000, 5));
}
```

**Résultat attendu** :

```text
10 / 2 = Ok(5)
10 / 0 = Err(DivisionParZero)
-5 / 2 = Err(NombreNegatif)
1000 / 5 = Err(ValeurTropGrande(200))
```

---

### Étape 11 : Convertir entre types d'erreurs

```rust
use std::fs::File;
use std::io::{self, Read};
use std::num::ParseIntError;

fn lire_nombre(chemin: &str) -> Result<i32, String> {
    // Convertit io::Error en String avec map_err
    let mut fichier = File::open(chemin)
        .map_err(|e| format!("Erreur d'ouverture : {}", e))?;

    let mut contenu = String::new();
    fichier.read_to_string(&mut contenu)
        .map_err(|e| format!("Erreur de lecture : {}", e))?;

    // Convertit ParseIntError en String
    let nombre: i32 = contenu.trim().parse()
        .map_err(|e: ParseIntError| format!("Erreur de parsing : {}", e))?;

    Ok(nombre)
}

fn main() {
    match lire_nombre("nombre.txt") {
        Ok(n) => println!("Nombre lu : {}", n),
        Err(e) => println!("Erreur : {}", e),
    }
}
```

---

### Étape 12 : Méthodes utiles de Result

```rust
fn diviser(a: i32, b: i32) -> Result<i32, &'static str> {
    if b == 0 { Err("Division par zéro") } else { Ok(a / b) }
}

fn main() {
    let r = diviser(10, 2);

    // is_ok() et is_err()
    println!("is_ok: {}", r.is_ok());       // true
    println!("is_err: {}", r.is_err());     // false

    // ok() convertit en Option
    let opt: Option<i32> = r.ok();
    println!("ok(): {:?}", opt);            // Some(5)

    // map() transforme la valeur Ok
    let double = diviser(10, 2).map(|v| v * 2);
    println!("map: {:?}", double);          // Ok(10)

    // and_then() chaîne les opérations
    let chaine = diviser(10, 2).and_then(|v| diviser(v, 1));
    println!("and_then: {:?}", chaine);     // Ok(5)
}
```

**Résultat attendu** :

```text
is_ok: true
is_err: false
ok(): Some(5)
map: Ok(10)
and_then: Ok(5)
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo run` | Compile et exécute le programme |
| `RUST_BACKTRACE=1 cargo run` | Affiche la pile d'appels en cas de panic |

---

## Pièges Fréquents

### Piège 1 : Ignorer un Result

**Problème** : Le compilateur avertit si tu ignores un Result.

```rust
use std::fs::File;
File::open("test.txt");     // Warning : Result non utilisé
```

**Solution** : Gère le Result ou ignore-le explicitement :

```rust
let _ = File::open("test.txt");     // Ignoré volontairement
```

---

### Piège 2 : Utiliser ? hors d'une fonction Result

**Problème** : `?` ne peut être utilisé que dans une fonction qui retourne Result ou Option.

```rust
fn main() {
    let f = File::open("test.txt")?;    // Erreur : main ne retourne pas Result
}
```

**Solution** : Change la signature de main ou utilise match :

```rust
fn main() -> Result<(), io::Error> {
    let f = File::open("test.txt")?;
    Ok(())
}
```

---

### Piège 3 : Abuser de unwrap

**Problème** : `unwrap()` crash le programme si le Result est Err.

**Solution** : Utilise `unwrap()` uniquement quand :

- Tu es certain que l'erreur ne peut pas arriver
- C'est un prototype ou un test
- Tu préfères crasher

---

### Piège 4 : Types d'erreurs incompatibles

**Problème** : Tu ne peux pas utiliser `?` si les types d'erreurs sont différents.

```rust
fn exemple() -> Result<(), String> {
    let f = File::open("test.txt")?;    // Erreur : io::Error != String
    Ok(())
}
```

**Solution** : Convertis l'erreur avec `map_err()` :

```rust
fn exemple() -> Result<(), String> {
    let f = File::open("test.txt")
        .map_err(|e| e.to_string())?;
    Ok(())
}
```

---

## Checklist de Validation

- [ ] Je comprends la différence entre erreurs récupérables (Result) et irrécupérables (panic)
- [ ] Je sais créer une fonction qui retourne Result
- [ ] Je sais traiter Result avec match
- [ ] Je sais utiliser l'opérateur `?` pour propager les erreurs
- [ ] Je connais les méthodes `unwrap_or`, `map_err`, `ok()`
- [ ] Je sais quand utiliser `unwrap()`/`expect()` vs gestion propre
- [ ] Je sais créer un type d'erreur personnalisé

---

## Exercice Pratique

**Énoncé** : Crée une fonction `parser_age` qui :

1. Prend une chaîne de caractères
2. La convertit en nombre
3. Vérifie que l'âge est entre 0 et 150
4. Retourne `Result<u8, String>`

Types d'erreurs à gérer :

- Chaîne vide → "L'entrée est vide"
- Pas un nombre → "'{entrée}' n'est pas un nombre valide"
- Négatif ou > 150 → "L'âge doit être entre 0 et 150"

**Résultat attendu** :

```text
"25" -> Ok(25)
"" -> Err("L'entrée est vide")
"abc" -> Err("'abc' n'est pas un nombre valide")
"200" -> Err("L'âge doit être entre 0 et 150")
"-5" -> Err("'-5' n'est pas un nombre valide")
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```rust
fn parser_age(input: &str) -> Result<u8, String> {
    // Vérifie si l'entrée est vide
    if input.is_empty() {
        return Err(String::from("L'entrée est vide"));
    }

    // Tente de parser en i32 d'abord (pour détecter les négatifs)
    let nombre: i32 = input.parse()
        .map_err(|_| format!("'{}' n'est pas un nombre valide", input))?;

    // Vérifie la plage
    if nombre < 0 || nombre > 150 {
        return Err(String::from("L'âge doit être entre 0 et 150"));
    }

    // Convertit en u8 (safe car on a vérifié la plage)
    Ok(nombre as u8)
}

fn main() {
    let tests = vec!["25", "", "abc", "200", "-5"];

    for test in tests {
        println!("{:?} -> {:?}", test, parser_age(test));
    }
}
```

---

## Navigation

← Fiche précédente : **[Enums et Pattern Matching](07-enums-pattern-matching.md)**

→ Fiche suivante : **[Collections](09-collections.md)**
