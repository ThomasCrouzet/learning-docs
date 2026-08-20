---
tags:
  - Rust
  - Intermédiaire
  - Pratique
description: "Borrowing et Références"
estimated_time: "85 min"
fiche_number: 5
total_fiches: 16
cursus: "Rust"
---

# 05 - Borrowing et Références

> **En bref** : À la fin de cette fiche, tu sauras utiliser les références pour emprunter des valeurs sans prendre la propriété, et tu comprendras la différence entre références immutables et mutables. Lecture estimée : 85 min.


## Prérequis

- Fiche **[04 - Ownership (propriété)](04-ownership.md)**
- Comprendre les concepts de move et de propriété

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les références pour emprunter des valeurs sans prendre la propriété, et tu comprendras la différence entre références immutables et mutables.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une référence ?

**Définition** : Une référence est un pointeur vers une valeur possédée par une autre variable. Elle permet d'accéder à la valeur sans en prendre la propriété.

**Syntaxe** :

```rust
let s1 = String::from("hello");
let r = &s1;        // r est une référence vers s1
```

**Le problème que les références résolvent** :

Sans références, voici les problèmes rencontrés :

1. **Perte de propriété** : Passer une valeur à une fonction la rend inutilisable ensuite.
2. **Clones coûteux** : Copier des données volumineuses est lent.
3. **Code verbeux** : Devoir retourner les valeurs pour garder la propriété alourdit le code.

**Comment les références résolvent ces problèmes** :

| Problème | Solution apportée par les références |
| --- | --- |
| Perte de propriété | On prête la valeur, on ne la donne pas |
| Clones coûteux | Une référence ne copie qu'un pointeur (8 octets) |
| Code verbeux | On passe des références au lieu de retourner des valeurs |

**Analogie concrète** : Une référence est comme prêter un livre. Tu prêtes ton livre à un ami, mais il te le rendra. Pendant le prêt, tu ne peux pas le lire, mais tu en restes le propriétaire.

---

### Qu'est-ce que le borrowing (emprunt) ?

**Définition** : Le borrowing est l'action de créer une référence vers une valeur. On dit qu'on "emprunte" la valeur.

**Terminologie** :

| Terme | Signification |
| --- | --- |
| Propriétaire (owner) | La variable qui possède la valeur |
| Emprunteur (borrower) | La référence qui accède temporairement à la valeur |
| Emprunt (borrow) | L'action de créer une référence |

---

### Références immutables vs mutables

Le diagramme suivant montre la différence entre emprunt immutable et emprunt mutable.

<div class="diagram-design">
<p><a href="../../../diagrams/fondamentaux-08-rust-05-borrowing-references-1.html">Références immutables vs mutables (HTML + SVG)</a></p>
<iframe src="../../../diagrams/fondamentaux-08-rust-05-borrowing-references-1.html" title="Références immutables vs mutables" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

| Référence immutable `&T` | Référence mutable `&mut T` |
| --- | --- |
| Permet de lire la valeur | Permet de lire ET modifier la valeur |
| On peut en avoir plusieurs simultanément | On ne peut en avoir qu'une seule à la fois |
| Créée avec `&` | Créée avec `&mut` |

---

### Les règles du borrowing

Ces règles sont **absolues** en Rust.

| Règle | Description |
| --- | --- |
| **Règle 1** | Tu peux avoir SOIT plusieurs références immutables (`&T`) SOIT une seule référence mutable (`&mut T`), mais pas les deux en même temps |
| **Règle 2** | Les références doivent toujours être valides (pas de référence vers une valeur qui a été libérée) |

**Pourquoi ces règles ?**

- **Règle 1** : Empêche les data races (deux accès simultanés dont au moins un est une écriture)
- **Règle 2** : Empêche les dangling pointers (pointeurs vers de la mémoire libérée)

**Analogie concrète** : Imagine un document partagé.

- Plusieurs personnes peuvent lire le document en même temps (références immutables).
- Mais si quelqu'un veut modifier le document, personne d'autre ne doit y accéder (référence mutable unique).

---

### Qu'est-ce qu'un dangling pointer ?

**Définition** : Un dangling pointer (pointeur pendant) est une référence vers de la mémoire qui a été libérée.

**En Rust, c'est impossible** : Le compilateur empêche de créer des références vers des valeurs qui n'existent plus.

```rust
fn dangling() -> &String {      // Erreur de compilation
    let s = String::from("hello");
    &s      // s sera libéré à la fin de la fonction
}           // La référence pointerait vers de la mémoire libérée
```

---

### Slices

**Définition** : Un slice est une référence vers une portion contiguë d'une collection (comme un tableau ou une String).

**Syntaxe** :

```rust
let s = String::from("hello world");
let hello = &s[0..5];       // Slice de l'index 0 à 4 (5 exclu)
let world = &s[6..11];      // Slice de l'index 6 à 10
```

**Types de slices** :

| Type | Description |
| --- | --- |
| `&str` | Slice de String (chaîne de caractères) |
| `&[T]` | Slice de tableau ou vecteur |

---

## Étapes Pratiques

### Étape 1 : Créer une référence immutable

```rust
fn main() {
    let s1 = String::from("hello");
    let r = &s1;        // r emprunte s1 (référence immutable)

    println!("s1 = {}", s1);    // s1 est toujours utilisable
    println!("r = {}", r);       // r pointe vers s1
}
```

**Résultat attendu** :

```text
s1 = hello
r = hello
```

---

### Étape 2 : Passer une référence à une fonction

```rust
fn calculer_longueur(s: &String) -> usize {
    s.len()     // On peut lire s, mais pas le modifier
}   // s (la référence) sort du scope, mais la String originale n'est pas libérée

fn main() {
    let s1 = String::from("hello");
    let longueur = calculer_longueur(&s1);  // On passe une référence, pas la propriété

    println!("La longueur de '{}' est {}", s1, longueur);
}
```

**Résultat attendu** :

```text
La longueur de 'hello' est 5
```

**Explication** :

- `&String` dans la signature signifie "une référence vers une String"
- `&s1` crée une référence vers `s1`
- `s1` reste valide après l'appel car on n'a pas transféré la propriété

---

### Étape 3 : Plusieurs références immutables

```rust
fn main() {
    let s = String::from("hello");

    let r1 = &s;        // Première référence immutable
    let r2 = &s;        // Deuxième référence immutable
    let r3 = &s;        // Troisième référence immutable

    println!("r1 = {}, r2 = {}, r3 = {}", r1, r2, r3);
}
```

**Résultat attendu** :

```text
r1 = hello, r2 = hello, r3 = hello
```

**Règle** : On peut avoir autant de références immutables qu'on veut.

---

### Étape 4 : Créer une référence mutable

```rust
fn main() {
    let mut s = String::from("hello");  // La variable doit être mut
    let r = &mut s;                      // Référence mutable

    r.push_str(", world");              // On peut modifier via la référence

    println!("r = {}", r);
}
```

**Résultat attendu** :

```text
r = hello, world
```

**Note** : Pour créer une référence mutable, la variable originale doit être déclarée avec `mut`.

---

### Étape 5 : Une seule référence mutable à la fois

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &mut s;
    // let r2 = &mut s;     // Erreur : deux références mutables simultanées

    r1.push_str(", world");
    println!("{}", r1);
}
```

**Résultat attendu** :

```text
hello, world
```

Décommente `r2` pour voir l'erreur :

```text
error[E0499]: cannot borrow `s` as mutable more than once at a time
```

---

### Étape 6 : Références mutables et immutables ne se mélangent pas

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s;            // Référence immutable
    let r2 = &s;            // Autre référence immutable
    // let r3 = &mut s;     // Erreur : référence mutable alors que des immutables existent

    println!("{} et {}", r1, r2);
}
```

Décommente `r3` pour voir l'erreur :

```text
error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
```

---

### Étape 7 : Les références ont une portée (scope)

```rust
fn main() {
    let mut s = String::from("hello");

    let r1 = &s;
    let r2 = &s;
    println!("{} et {}", r1, r2);
    // r1 et r2 ne sont plus utilisés après cette ligne

    let r3 = &mut s;        // OK : r1 et r2 ne sont plus en scope
    r3.push_str(", world");
    println!("{}", r3);
}
```

**Résultat attendu** :

```text
hello et hello
hello, world
```

**Règle** : Une référence est valide jusqu'à sa dernière utilisation, pas jusqu'à la fin du bloc. C'est le "Non-Lexical Lifetimes" (NLL).

---

### Étape 8 : Modifier via une fonction avec référence mutable

```rust
fn ajouter_exclamation(s: &mut String) {
    s.push_str("!");
}

fn main() {
    let mut message = String::from("Bonjour");
    ajouter_exclamation(&mut message);      // On passe une référence mutable

    println!("{}", message);
}
```

**Résultat attendu** :

```text
Bonjour!
```

---

### Étape 9 : Empêcher les dangling pointers

```rust
// Cette fonction ne compile pas :
// fn dangling() -> &String {
//     let s = String::from("hello");
//     &s      // Erreur : s sera libéré à la fin de la fonction
// }

// Solution : retourner la String directement (transfert de propriété)
fn pas_dangling() -> String {
    let s = String::from("hello");
    s       // On retourne la String, pas une référence
}

fn main() {
    let s = pas_dangling();
    println!("{}", s);
}
```

**Résultat attendu** :

```text
hello
```

---

### Étape 10 : String slices

```rust
fn main() {
    let s = String::from("hello world");

    let hello = &s[0..5];       // De l'index 0 à 4
    let world = &s[6..11];      // De l'index 6 à 10

    println!("Première partie : {}", hello);
    println!("Deuxième partie : {}", world);
}
```

**Résultat attendu** :

```text
Première partie : hello
Deuxième partie : world
```

**Syntaxes de slice** :

| Syntaxe | Signification |
| --- | --- |
| `&s[0..5]` | De l'index 0 à 4 (5 exclu) |
| `&s[..5]` | Du début à l'index 4 |
| `&s[6..]` | De l'index 6 à la fin |
| `&s[..]` | Toute la chaîne |

---

### Étape 11 : Fonction qui retourne un slice

```rust
fn premier_mot(s: &String) -> &str {
    let bytes = s.as_bytes();       // Convertit en tableau d'octets

    for (i, &item) in bytes.iter().enumerate() {
        if item == b' ' {           // b' ' = le byte de l'espace
            return &s[0..i];        // Retourne le slice jusqu'à l'espace
        }
    }

    &s[..]                          // Pas d'espace trouvé, retourne tout
}

fn main() {
    let phrase = String::from("hello world");
    let mot = premier_mot(&phrase);

    println!("Premier mot : {}", mot);
}
```

**Résultat attendu** :

```text
Premier mot : hello
```

---

### Étape 12 : Slices de tableaux

```rust
fn main() {
    let nombres = [1, 2, 3, 4, 5];
    let slice = &nombres[1..4];     // [2, 3, 4]

    println!("Slice : {:?}", slice);
}
```

**Résultat attendu** :

```text
Slice : [2, 3, 4]
```

**Note** : `{:?}` est le format de debug pour afficher des tableaux et slices.

---

### Étape 13 : &str vs String

```rust
fn main() {
    // String : type possédé, stocké sur le heap, modifiable
    let mut s1 = String::from("hello");
    s1.push_str(" world");

    // &str : slice de String, référence immutable
    let s2: &str = "hello";         // Littéral de chaîne = &str
    let s3: &str = &s1;             // Référence vers une String
    let s4: &str = &s1[0..5];       // Slice d'une String

    println!("s1 = {}", s1);
    println!("s2 = {}", s2);
    println!("s3 = {}", s3);
    println!("s4 = {}", s4);
}
```

**Résultat attendu** :

```text
s1 = hello world
s2 = hello
s3 = hello world
s4 = hello
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo run` | Compile et exécute le programme |
| `cargo check` | Vérifie la syntaxe sans compiler |

---

## Pièges Fréquents

### Piège 1 : Oublier le `&` pour créer une référence

**Problème** : Tu passes la valeur au lieu d'une référence.

```rust
fn afficher(s: &String) {
    println!("{}", s);
}

fn main() {
    let s = String::from("hello");
    afficher(s);    // Erreur : attendu &String, reçu String
}
```

**Solution** : Ajoute `&` devant la variable :

```rust
afficher(&s);
```

---

### Piège 2 : Créer une référence mutable sans `mut`

**Problème** : La variable originale n'est pas mutable.

```rust
fn main() {
    let s = String::from("hello");
    let r = &mut s;     // Erreur : s n'est pas mutable
}
```

**Solution** : Déclare la variable avec `mut` :

```rust
let mut s = String::from("hello");
let r = &mut s;
```

---

### Piège 3 : Mélanger références mutables et immutables

**Problème** : Tu as une référence immutable et essaies d'en créer une mutable.

**Solution** : Assure-toi que les références immutables ne sont plus utilisées avant de créer la référence mutable.

---

### Piège 4 : Modifier via une référence immutable

**Problème** : Tu essaies de modifier une valeur via `&T`.

```rust
fn main() {
    let s = String::from("hello");
    let r = &s;
    r.push_str(" world");   // Erreur : r est immutable
}
```

**Solution** : Utilise une référence mutable `&mut`:

```rust
let mut s = String::from("hello");
let r = &mut s;
r.push_str(" world");
```

---

### Piège 5 : Slice hors limites

**Problème** : L'index dépasse la taille de la chaîne.

```rust
let s = String::from("hi");
let slice = &s[0..10];      // Erreur à l'exécution : panic
```

**Solution** : Vérifie que les index sont dans les limites.

---

## Checklist de Validation

- [ ] Je sais créer une référence immutable avec `&`
- [ ] Je sais créer une référence mutable avec `&mut`
- [ ] Je comprends pourquoi on ne peut avoir qu'une seule référence mutable à la fois
- [ ] Je sais passer des références à des fonctions
- [ ] Je comprends ce qu'est un slice et comment en créer
- [ ] Je connais la différence entre `String` et `&str`

---

## Exercice Pratique

**Énoncé** : Crée une fonction `ajouter_salutation` qui :

1. Prend une référence mutable vers une `String`
2. Ajoute "Bonjour, " au début de la chaîne
3. Ajoute " !" à la fin

**Indications** :

- Utilise `insert_str(0, "texte")` pour insérer au début
- Utilise `push_str("texte")` pour ajouter à la fin
- La signature sera : `fn ajouter_salutation(s: &mut String)`

**Résultat attendu** :

```text
Avant : David
Après : Bonjour, David !
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```rust
fn ajouter_salutation(s: &mut String) {
    s.insert_str(0, "Bonjour, ");   // Insère au début (index 0)
    s.push_str(" !");                // Ajoute à la fin
}

fn main() {
    let mut nom = String::from("David");

    println!("Avant : {}", nom);
    ajouter_salutation(&mut nom);   // On passe une référence mutable
    println!("Après : {}", nom);
}
```

---

## Navigation

← Fiche précédente : **[Ownership (Propriété)](04-ownership.md)**

→ Fiche suivante : **[Structs (Structures)](06-structs.md)**
