---
tags:
  - Rust
  - Débutant
  - Pratique
description: "Variables et Types de Données"
estimated_time: "80 min"
fiche_number: 2
total_fiches: 16
cursus: "Rust"
---

# 02 - Variables et Types de Données

> **En bref** : À la fin de cette fiche, tu sauras déclarer des variables, comprendre la mutabilité, et utiliser les types de données primitifs de Rust. Lecture estimée : 80 min.


## Prérequis

- Fiche **[01 - Introduction à Rust et Installation](01-introduction-installation.md)**
- Avoir un projet Rust créé avec `cargo new`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déclarer des variables, comprendre la mutabilité, et utiliser les types de données primitifs de Rust.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une variable ?

**Définition** : Une variable est un espace de stockage nommé qui contient une valeur.

**Le problème que les variables résolvent** :

Sans variables, tu devrais utiliser des adresses mémoire brutes (comme `0x7fff5fbff8ac`) pour stocker et retrouver tes données. Les variables donnent des noms lisibles à ces emplacements mémoire, ce qui rend le code compréhensible et maintenable.

**Analogie concrète** : Une variable est comme une boîte étiquetée. L'étiquette est le nom de la variable, et le contenu de la boîte est la valeur.

---

### Qu'est-ce que l'immutabilité par défaut ?

**Définition** : En Rust, les variables sont **immutables par défaut**. Une fois qu'une valeur est assignée, elle ne peut plus être modifiée.

**Le problème que l'immutabilité résout** :

Sans immutabilité par défaut, voici les problèmes rencontrés :

1. **Bugs difficiles à trouver** : Une variable est modifiée quelque part dans le code, et tu ne sais pas où.
2. **Code imprévisible** : Tu lis une valeur, mais elle a changé entre-temps.
3. **Parallélisme dangereux** : Plusieurs threads modifient la même variable simultanément.

**Comment l'immutabilité résout ces problèmes** :

| Problème | Solution apportée par l'immutabilité |
| --- | --- |
| Bugs difficiles à trouver | Si une variable change, c'est explicite (`mut`) |
| Code imprévisible | Une variable sans `mut` ne changera jamais |
| Parallélisme dangereux | Le compilateur empêche les modifications concurrentes |

**Analogie concrète** : Imagine que tu écris un contrat. Par défaut, le contrat est signé et scellé (immutable). Si tu veux pouvoir le modifier plus tard, tu dois explicitement ajouter une clause "modifiable" (`mut`).

**Ce que l'immutabilité n'est PAS** :

- L'immutabilité n'est pas une constante. Une variable immutable peut avoir une valeur différente à chaque exécution. Une constante a toujours la même valeur.

**Comparaison variable immutable vs constante** :

| Variable immutable (`let x = 5;`) | Constante (`const X: i32 = 5;`) |
| --- | --- |
| Valeur calculée à l'exécution | Valeur connue à la compilation |
| Peut être différente à chaque exécution | Toujours la même valeur |
| Pas besoin de type explicite | Type obligatoire |
| Peut être "shadowed" (réassignée) | Ne peut pas être shadowed |

---

### Qu'est-ce que le mot-clé `mut` ?

**Définition** : `mut` (abréviation de "mutable") permet de déclarer une variable qui peut être modifiée.

**Analogie concrète** : Déclarer une variable `mut` est comme mettre un post-it sur une boîte pour dire qu'on peut changer son contenu. Sans ce post-it, la boîte est scellée : on peut regarder dedans, mais pas modifier ce qu'elle contient.

**Syntaxe** :

```rust
let mut x = 5;  // Variable mutable
x = 10;         // Modification autorisée
```

**Règle** : Utilise `mut` uniquement quand tu as besoin de modifier la variable. Sinon, garde-la immutable.

---

### Qu'est-ce que le shadowing ?

**Définition** : Le shadowing permet de redéclarer une variable avec le même nom, créant une nouvelle variable qui "masque" l'ancienne.

**Exemple** :

```rust
let x = 5;       // Première variable x
let x = x + 1;   // Nouvelle variable x qui masque la première
let x = x * 2;   // Nouvelle variable x qui masque la deuxième
```

**Différence entre shadowing et mutabilité** :

| Shadowing (`let x = ...`) | Mutabilité (`let mut x = ...`) |
| --- | --- |
| Crée une nouvelle variable | Modifie la même variable |
| Peut changer le type | Le type reste le même |
| Utilise `let` à chaque fois | Utilise `=` pour modifier |

**Analogie concrète** : Avec le shadowing, tu prends une nouvelle boîte avec la même étiquette. L'ancienne boîte existe toujours mais tu ne peux plus y accéder. Avec la mutabilité, tu changes le contenu de la même boîte.

---

### Types de données primitifs

Rust est un langage **fortement typé**. Chaque valeur a un type précis.

#### Types entiers

| Type | Taille | Plage de valeurs |
| --- | --- | --- |
| `i8` | 8 bits | -128 à 127 |
| `i16` | 16 bits | -32 768 à 32 767 |
| `i32` | 32 bits | -2 147 483 648 à 2 147 483 647 |
| `i64` | 64 bits | -9 223 372 036 854 775 808 à ... |
| `i128` | 128 bits | Très grand |
| `isize` | Dépend de l'architecture | 32 ou 64 bits selon le système |
| `u8` | 8 bits | 0 à 255 |
| `u16` | 16 bits | 0 à 65 535 |
| `u32` | 32 bits | 0 à 4 294 967 295 |
| `u64` | 64 bits | 0 à 18 446 744 073 709 551 615 |
| `u128` | 128 bits | Très grand |
| `usize` | Dépend de l'architecture | 32 ou 64 bits selon le système |

**Règle de nommage** :

- `i` = "integer" signé (peut être négatif)
- `u` = "unsigned" non signé (toujours positif ou zéro)
- Le nombre = taille en bits

**Type par défaut** : Si tu ne précises pas le type, Rust utilise `i32` pour les entiers.

#### Types flottants

| Type | Taille | Précision |
| --- | --- | --- |
| `f32` | 32 bits | Simple précision |
| `f64` | 64 bits | Double précision |

**Type par défaut** : Si tu ne précises pas le type, Rust utilise `f64` pour les nombres décimaux.

#### Type booléen

| Type | Valeurs possibles |
| --- | --- |
| `bool` | `true` ou `false` |

#### Type caractère

| Type | Description |
| --- | --- |
| `char` | Un caractère Unicode (4 octets) |

**Important** : Un `char` utilise des apostrophes simples `'a'`, pas des guillemets `"a"`.

---

### Qu'est-ce que l'inférence de type ?

**Définition** : L'inférence de type permet au compilateur de déduire automatiquement le type d'une variable à partir de sa valeur.

**Exemple** :

```rust
let x = 5;        // Le compilateur déduit i32
let y = 3.14;     // Le compilateur déduit f64
let z = true;     // Le compilateur déduit bool
```

**Quand préciser le type explicitement** :

1. Quand le compilateur ne peut pas déduire le type
2. Quand tu veux un type différent du type par défaut
3. Pour la clarté du code

**Syntaxe pour préciser le type** :

```rust
let x: i64 = 5;           // Annotation de type après le nom
let y = 5_i64;            // Suffixe de type après la valeur
let z: f32 = 3.14;        // Annotation de type
```

---

## Étapes Pratiques

### Étape 1 : Créer un fichier de test

Ouvre le fichier `src/main.rs` de ton projet et remplace son contenu par :

```rust
fn main() {
    // Le code des exemples ira ici
}
```

---

### Étape 2 : Déclarer une variable immutable

```rust
fn main() {
    let x = 5;              // Déclare une variable immutable x avec la valeur 5
    println!("x = {}", x);  // Affiche la valeur de x
}
```

**Explication de `println!`** :

- `{}` est un placeholder (emplacement réservé)
- La valeur de `x` remplace `{}` dans l'affichage

**Résultat attendu** :

```text
x = 5
```

---

### Étape 3 : Tenter de modifier une variable immutable

```rust
fn main() {
    let x = 5;
    x = 10;  // Erreur : on ne peut pas modifier une variable immutable
    println!("x = {}", x);
}
```

**Résultat attendu** (erreur de compilation) :

```text
error[E0384]: cannot assign twice to immutable variable `x`
 --> src/main.rs:3:5
  |
2 |     let x = 5;
  |         -
  |         |
  |         first assignment to `x`
  |         help: consider making this binding mutable: `mut x`
3 |     x = 10;
  |     ^^^^^^ cannot assign twice to immutable variable
```

**Lecture du message d'erreur** :

- `E0384` : Code de l'erreur (utile pour chercher de l'aide)
- `cannot assign twice to immutable variable` : Tu ne peux pas réassigner une variable immutable
- `help: consider making this binding mutable: mut x` : Rust suggère d'ajouter `mut`

---

### Étape 4 : Déclarer une variable mutable

```rust
fn main() {
    let mut x = 5;          // mut permet de modifier la variable
    println!("x = {}", x);
    x = 10;                 // Modification autorisée
    println!("x = {}", x);
}
```

**Résultat attendu** :

```text
x = 5
x = 10
```

---

### Étape 5 : Utiliser le shadowing

```rust
fn main() {
    let x = 5;
    println!("x = {}", x);

    let x = x + 1;          // Nouvelle variable x qui masque la première
    println!("x = {}", x);

    let x = x * 2;          // Nouvelle variable x qui masque la deuxième
    println!("x = {}", x);
}
```

**Résultat attendu** :

```text
x = 5
x = 6
x = 12
```

---

### Étape 6 : Changer de type avec le shadowing

```rust
fn main() {
    let spaces = "   ";         // spaces est une chaîne (&str)
    let spaces = spaces.len();  // spaces est maintenant un nombre (usize)
    println!("Nombre d'espaces : {}", spaces);
}
```

**Résultat attendu** :

```text
Nombre d'espaces : 3
```

**Note** : Ceci serait impossible avec `mut` car le type doit rester le même.

---

### Étape 7 : Utiliser les types entiers

```rust
fn main() {
    let a: i8 = 127;          // Entier signé 8 bits
    let b: u8 = 255;          // Entier non signé 8 bits
    let c: i32 = -1000;       // Entier signé 32 bits (type par défaut)
    let d = 1_000_000;        // Underscore pour la lisibilité (ignoré par Rust)

    println!("a = {}", a);
    println!("b = {}", b);
    println!("c = {}", c);
    println!("d = {}", d);
}
```

**Résultat attendu** :

```text
a = 127
b = 255
c = -1000
d = 1000000
```

---

### Étape 8 : Utiliser les types flottants

```rust
fn main() {
    let x = 2.5;              // f64 par défaut
    let y: f32 = 3.14;        // f32 explicite

    println!("x = {}", x);
    println!("y = {}", y);
}
```

**Résultat attendu** :

```text
x = 2.5
y = 3.14
```

---

### Étape 9 : Utiliser les booléens

```rust
fn main() {
    let vrai = true;
    let faux = false;
    let resultat = 10 > 5;    // Une comparaison retourne un bool

    println!("vrai = {}", vrai);
    println!("faux = {}", faux);
    println!("10 > 5 = {}", resultat);
}
```

**Résultat attendu** :

```text
vrai = true
faux = false
10 > 5 = true
```

---

### Étape 10 : Utiliser les caractères

```rust
fn main() {
    let lettre = 'a';         // Apostrophes simples pour char
    let emoji = '😀';         // Les emojis sont des char valides
    let coeur = '❤';

    println!("lettre = {}", lettre);
    println!("emoji = {}", emoji);
    println!("coeur = {}", coeur);
}
```

**Résultat attendu** :

```text
lettre = a
emoji = 😀
coeur = ❤
```

---

### Étape 11 : Déclarer une constante

```rust
const MAX_POINTS: u32 = 100_000;  // Constante : type obligatoire, MAJUSCULES

fn main() {
    println!("Maximum de points : {}", MAX_POINTS);
}
```

**Règles pour les constantes** :

1. Le mot-clé `const` (pas `let`)
2. Le type est **obligatoire**
3. Le nom est en **MAJUSCULES_AVEC_UNDERSCORES**
4. La valeur doit être connue à la compilation (pas de calcul à l'exécution)

**Résultat attendu** :

```text
Maximum de points : 100000
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo run` | Compile et exécute le programme |
| `cargo check` | Vérifie la syntaxe sans compiler |

---

## Pièges Fréquents

### Piège 1 : Oublier `mut` pour modifier une variable

**Problème** : Erreur `cannot assign twice to immutable variable`.

**Solution** : Ajoute `mut` après `let` :

```rust
let mut x = 5;  // Maintenant modifiable
```

---

### Piège 2 : Confondre `char` et `&str`

**Problème** : Tu utilises des guillemets doubles pour un caractère.

```rust
let c = "a";  // Ceci est une chaîne (&str), pas un char
```

**Solution** : Utilise des apostrophes simples pour `char` :

```rust
let c = 'a';  // Ceci est un char
```

---

### Piège 3 : Dépassement de capacité

**Problème** : Tu assignes une valeur trop grande pour le type.

```rust
let x: u8 = 256;  // Erreur : u8 va de 0 à 255
```

**Solution** : Utilise un type plus grand :

```rust
let x: u16 = 256;  // u16 va de 0 à 65535
```

---

### Piège 4 : Oublier le type pour une constante

**Problème** : Erreur `error[E0282]: type annotations needed for const item`.

```rust
const MAX = 100;  // Erreur : type obligatoire
```

**Solution** : Ajoute le type :

```rust
const MAX: i32 = 100;  // Correct
```

---

## Checklist de Validation

- [ ] Je sais déclarer une variable immutable avec `let`
- [ ] Je sais déclarer une variable mutable avec `let mut`
- [ ] Je comprends la différence entre shadowing et mutabilité
- [ ] Je connais les types entiers (`i32`, `u8`, etc.)
- [ ] Je connais les types flottants (`f32`, `f64`)
- [ ] Je sais utiliser `bool` et `char`
- [ ] Je sais déclarer une constante avec `const`

---

## Exercice Pratique

**Énoncé** : Crée un programme qui :

1. Déclare ton âge dans une variable
2. Affiche ton âge
3. Augmente ton âge de 1 (simule un anniversaire)
4. Affiche ton nouvel âge

**Indications** :

- Utilise `let mut` car tu vas modifier la variable
- Utilise `+` pour l'addition
- Tu peux réassigner avec `age = age + 1` ou `age += 1`

**Résultat attendu** (si tu as 20 ans) :

```text
J'ai 20 ans
Joyeux anniversaire !
J'ai maintenant 21 ans
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```rust
fn main() {
    let mut age = 20;                       // Déclare l'âge (mutable car on va le modifier)
    println!("J'ai {} ans", age);           // Affiche l'âge actuel

    age += 1;                               // Augmente l'âge de 1 (équivalent à age = age + 1)
    println!("Joyeux anniversaire !");
    println!("J'ai maintenant {} ans", age); // Affiche le nouvel âge
}
```

**Alternative avec shadowing** (sans `mut`) :

```rust
fn main() {
    let age = 20;
    println!("J'ai {} ans", age);

    let age = age + 1;                      // Shadowing : nouvelle variable age
    println!("Joyeux anniversaire !");
    println!("J'ai maintenant {} ans", age);
}
```

---

## Navigation

← Fiche précédente : **[Introduction à Rust et Installation](01-introduction-installation.md)**

→ Fiche suivante : **[Fonctions et Contrôle de Flux](03-fonctions-controle-flux.md)**
