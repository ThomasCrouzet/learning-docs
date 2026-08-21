---
tags:
  - Rust
  - Débutant
  - Pratique
description: "Fonctions et Contrôle de Flux"
estimated_time: "105 min"
fiche_number: 3
total_fiches: 16
cursus: "Rust"
id: "fundamentals.rust.fonctions-controle-flux"
course_id: "fundamentals.rust"
content_type: "lesson"
order: 3
---

# 03 - Fonctions et Contrôle de Flux

> **En bref** : À la fin de cette fiche, tu sauras créer des fonctions, utiliser les conditions if/else, le pattern matching avec match, et les boucles loop, while et for. Lecture estimée : 105 min.


## Prérequis

- Fiche **[01 - Introduction à Rust et Installation](01-introduction-installation.md)**
- Fiche **[02 - Variables et types de données](02-variables-types.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des fonctions, utiliser les conditions `if/else`, le pattern matching avec `match`, et les boucles `loop`, `while` et `for`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une fonction ?

**Définition** : Une fonction est un bloc de code réutilisable qui effectue une tâche spécifique.

**Anatomie d'une fonction Rust** :

```rust
fn nom_fonction(parametre: Type) -> TypeRetour {
    // Corps de la fonction
    valeur_de_retour
}
```

| Élément | Description |
| --- | --- |
| `fn` | Mot-clé pour déclarer une fonction |
| `nom_fonction` | Nom en snake_case (minuscules avec underscores) |
| `parametre: Type` | Paramètre avec son type (obligatoire) |
| `-> TypeRetour` | Type de la valeur retournée (optionnel si pas de retour) |
| `valeur_de_retour` | Dernière expression sans point-virgule = valeur retournée |

**Analogie concrète** : Une fonction est comme une recette de cuisine. Elle a un nom (le titre de la recette), des ingrédients (les paramètres), et produit un plat (la valeur de retour).

---

### Expressions vs Instructions

**Définition** :

- Une **instruction** exécute une action mais ne retourne pas de valeur. Elle se termine par `;`.
- Une **expression** calcule et retourne une valeur. Elle ne se termine PAS par `;`.

**Analogie concrète** : Une instruction est comme dire "range cette assiette" : c'est une action, point. Une expression est comme une question "combien font 3 + 2 ?" : elle produit une réponse (5) que tu peux utiliser. En Rust, ajouter un `;` à la fin transforme une question en simple action, et la réponse est perdue.

**Exemples** :

```rust
let x = 5;          // Instruction (ne retourne rien)
x + 1               // Expression (retourne 6)
x + 1;              // Instruction (le ; transforme l'expression en instruction)
```

**Règle importante** : En Rust, la dernière expression d'une fonction (sans `;`) est automatiquement retournée.

```rust
fn cinq() -> i32 {
    5           // Expression retournée (pas de ; ni de return)
}
```

---

### Qu'est-ce que le pattern matching ?

**Définition** : Le pattern matching permet de comparer une valeur à plusieurs motifs (patterns) et d'exécuter du code selon le motif correspondant.

**Le problème que le pattern matching résout** :

Sans pattern matching, voici les problèmes rencontrés :

1. **Chaînes de if/else longues** : Le code devient illisible avec beaucoup de conditions.
2. **Oubli de cas** : Tu peux oublier de gérer certaines valeurs possibles.
3. **Erreurs à l'exécution** : Les cas non gérés provoquent des bugs.

**Comment le pattern matching résout ces problèmes** :

| Problème | Solution apportée par `match` |
| --- | --- |
| Chaînes de if/else | Syntaxe claire et structurée |
| Oubli de cas | Le compilateur t'oblige à couvrir tous les cas |
| Erreurs à l'exécution | Erreur de compilation si un cas manque |

**Analogie concrète** : `match` est comme un aiguillage de train. Selon la destination affichée sur le wagon (la valeur), le wagon est dirigé vers la bonne voie (le bon bloc de code).

---

### Les trois types de boucles

**Analogie concrète** : Les boucles sont comme les tâches répétitives du quotidien. `loop` est un réveil qui sonne en boucle jusqu'à ce que tu appuies sur le bouton stop (`break`). `while` est "tant qu'il reste des assiettes sales, je fais la vaisselle". `for` est "pour chaque lettre dans la boîte aux lettres, je la lis".

| Boucle | Utilisation | Condition d'arrêt |
| --- | --- | --- |
| `loop` | Boucle infinie | Tu dois utiliser `break` explicitement |
| `while` | Tant qu'une condition est vraie | Quand la condition devient `false` |
| `for` | Parcourir une collection | Quand tous les éléments ont été parcourus |

---

## Étapes Pratiques

### Étape 1 : Créer une fonction simple

```rust
// Définition d'une fonction qui affiche un message
fn dire_bonjour() {
    println!("Bonjour !");
}

fn main() {
    dire_bonjour();     // Appel de la fonction
    dire_bonjour();     // On peut l'appeler plusieurs fois
}
```

**Résultat attendu** :

```text
Bonjour !
Bonjour !
```

---

### Étape 2 : Fonction avec paramètre

```rust
// La fonction prend un paramètre "nom" de type &str (chaîne de caractères)
fn dire_bonjour_a(nom: &str) {
    println!("Bonjour, {} !", nom);
}

fn main() {
    dire_bonjour_a("Bob");
    dire_bonjour_a("Alice");
}
```

**Note** : `&str` est le type pour les chaînes de caractères littérales. On l'expliquera en détail plus tard.

**Résultat attendu** :

```text
Bonjour, Bob !
Bonjour, Alice !
```

---

### Étape 3 : Fonction avec plusieurs paramètres

```rust
// Chaque paramètre doit avoir son type explicite
fn afficher_info(nom: &str, age: u32) {
    println!("{} a {} ans", nom, age);
}

fn main() {
    afficher_info("Bob", 20);
    afficher_info("Bob", 25);
}
```

**Résultat attendu** :

```text
Bob a 20 ans
Bob a 25 ans
```

---

### Étape 4 : Fonction avec valeur de retour

```rust
// -> i32 indique que la fonction retourne un entier 32 bits
fn additionner(a: i32, b: i32) -> i32 {
    a + b       // Pas de ; = cette valeur est retournée
}

fn main() {
    let resultat = additionner(5, 3);
    println!("5 + 3 = {}", resultat);
}
```

**Résultat attendu** :

```text
5 + 3 = 8
```

---

### Étape 5 : Utiliser `return` explicitement

```rust
fn valeur_absolue(n: i32) -> i32 {
    if n < 0 {
        return -n;      // return explicite pour sortir tôt
    }
    n                   // Dernière expression retournée
}

fn main() {
    println!("|-5| = {}", valeur_absolue(-5));
    println!("|3| = {}", valeur_absolue(3));
}
```

**Règle** : Utilise `return` pour sortir tôt de la fonction. Sinon, la dernière expression (sans `;`) est retournée.

**Résultat attendu** :

```text
|-5| = 5
|3| = 3
```

---

### Étape 6 : Condition if/else

```rust
fn main() {
    let nombre = 7;

    if nombre > 0 {
        println!("{} est positif", nombre);
    } else if nombre < 0 {
        println!("{} est négatif", nombre);
    } else {
        println!("{} est zéro", nombre);
    }
}
```

**Règles pour `if`** :

1. La condition **ne doit pas** être entre parenthèses (contrairement à C/Java)
2. La condition doit être un `bool` (pas de conversion implicite)
3. Les accolades `{}` sont **obligatoires** même pour une seule ligne

**Résultat attendu** :

```text
7 est positif
```

---

### Étape 7 : if comme expression

En Rust, `if` est une expression qui retourne une valeur :

```rust
fn main() {
    let nombre = 5;

    // if retourne une valeur qu'on assigne à "message"
    let message = if nombre > 0 {
        "positif"       // Pas de ; car c'est la valeur retournée
    } else {
        "non positif"
    };                  // ; car c'est une instruction let

    println!("Le nombre est {}", message);
}
```

**Règle importante** : Les deux branches doivent retourner le même type.

**Résultat attendu** :

```text
Le nombre est positif
```

---

### Étape 8 : Pattern matching avec match

```rust
fn main() {
    let nombre = 2;

    match nombre {
        1 => println!("Un"),
        2 => println!("Deux"),
        3 => println!("Trois"),
        _ => println!("Autre chose"),   // _ capture tous les autres cas
    }
}
```

**Syntaxe de `match`** :

```rust
match valeur {
    motif1 => expression1,
    motif2 => expression2,
    _ => expression_par_defaut,     // _ = "tout le reste"
}
```

**Résultat attendu** :

```text
Deux
```

---

### Étape 9 : match avec plusieurs valeurs

```rust
fn main() {
    let nombre = 5;

    match nombre {
        1 | 2 | 3 => println!("Entre 1 et 3"),      // | signifie "ou"
        4..=6 => println!("Entre 4 et 6"),          // ..= signifie "de 4 à 6 inclus"
        _ => println!("Autre"),
    }
}
```

**Résultat attendu** :

```text
Entre 4 et 6
```

---

### Étape 10 : match comme expression

```rust
fn main() {
    let nombre = 1;

    let texte = match nombre {
        1 => "un",
        2 => "deux",
        _ => "autre",
    };

    println!("Le nombre est : {}", texte);
}
```

**Résultat attendu** :

```text
Le nombre est : un
```

---

### Étape 11 : Boucle loop

```rust
fn main() {
    let mut compteur = 0;

    loop {
        compteur += 1;
        println!("Compteur : {}", compteur);

        if compteur == 3 {
            break;      // Sort de la boucle
        }
    }

    println!("Fin de la boucle");
}
```

**Résultat attendu** :

```text
Compteur : 1
Compteur : 2
Compteur : 3
Fin de la boucle
```

---

### Étape 12 : loop qui retourne une valeur

```rust
fn main() {
    let mut compteur = 0;

    let resultat = loop {
        compteur += 1;

        if compteur == 10 {
            break compteur * 2;     // break avec une valeur
        }
    };

    println!("Résultat : {}", resultat);
}
```

**Résultat attendu** :

```text
Résultat : 20
```

---

### Étape 13 : Boucle while

```rust
fn main() {
    let mut nombre = 3;

    while nombre > 0 {
        println!("{} !", nombre);
        nombre -= 1;
    }

    println!("Décollage !");
}
```

**Résultat attendu** :

```text
3 !
2 !
1 !
Décollage !
```

---

### Étape 14 : Boucle for avec range

```rust
fn main() {
    // 1..4 = de 1 à 3 (4 exclu)
    for i in 1..4 {
        println!("i = {}", i);
    }

    println!("---");

    // 1..=4 = de 1 à 4 (4 inclus)
    for i in 1..=4 {
        println!("i = {}", i);
    }
}
```

**Résultat attendu** :

```text
i = 1
i = 2
i = 3
---
i = 1
i = 2
i = 3
i = 4
```

---

### Étape 15 : Boucle for avec tableau

```rust
fn main() {
    let nombres = [10, 20, 30, 40, 50];

    for nombre in nombres {
        println!("Valeur : {}", nombre);
    }
}
```

**Résultat attendu** :

```text
Valeur : 10
Valeur : 20
Valeur : 30
Valeur : 40
Valeur : 50
```

---

### Étape 16 : continue et break

```rust
fn main() {
    for i in 1..=10 {
        if i == 3 {
            continue;       // Passe à l'itération suivante
        }
        if i == 7 {
            break;          // Sort de la boucle
        }
        println!("i = {}", i);
    }
}
```

**Résultat attendu** :

```text
i = 1
i = 2
i = 4
i = 5
i = 6
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo run` | Compile et exécute le programme |
| `cargo check` | Vérifie la syntaxe sans compiler |

---

## Pièges Fréquents

### Piège 1 : Oublier le type des paramètres

**Problème** : Erreur `expected one of ':', '@', or '|'`.

```rust
fn addition(a, b) -> i32 {  // Erreur : types manquants
    a + b
}
```

**Solution** : Ajoute les types pour chaque paramètre :

```rust
fn addition(a: i32, b: i32) -> i32 {
    a + b
}
```

---

### Piège 2 : Mettre un ; après la valeur de retour

**Problème** : La fonction retourne `()` au lieu de la valeur attendue.

```rust
fn cinq() -> i32 {
    5;      // Erreur : le ; fait que 5 n'est pas retourné
}
```

**Solution** : Retire le `;` :

```rust
fn cinq() -> i32 {
    5       // Correct : 5 est retourné
}
```

---

### Piège 3 : Mettre des parenthèses autour du if

**Problème** : Bien que ça compile, c'est du style non-idiomatique en Rust.

```rust
if (x > 5) {    // Les parenthèses sont inutiles
    // ...
}
```

**Solution** : Retire les parenthèses :

```rust
if x > 5 {      // Style Rust correct
    // ...
}
```

---

### Piège 4 : match non exhaustif

**Problème** : Erreur `non-exhaustive patterns`.

```rust
fn main() {
    let x = 5;
    match x {
        1 => println!("Un"),
        2 => println!("Deux"),
        // Erreur : il manque les autres cas possibles
    }
}
```

**Solution** : Ajoute un cas par défaut avec `_` :

```rust
fn main() {
    let x = 5;
    match x {
        1 => println!("Un"),
        2 => println!("Deux"),
        _ => println!("Autre"),     // Capture tous les autres cas
    }
}
```

---

### Piège 5 : Types différents dans les branches de if

**Problème** : Erreur `if and else have incompatible types`.

```rust
let x = if condition {
    5           // i32
} else {
    "texte"     // &str - type différent !
};
```

**Solution** : Les deux branches doivent retourner le même type.

---

## Checklist de Validation

- [ ] Je sais déclarer une fonction avec `fn`
- [ ] Je sais ajouter des paramètres typés à une fonction
- [ ] Je sais retourner une valeur avec `-> Type`
- [ ] Je comprends la différence entre expression et instruction
- [ ] Je sais utiliser `if`, `else if`, `else`
- [ ] Je sais utiliser `match` pour le pattern matching
- [ ] Je sais utiliser les boucles `loop`, `while` et `for`
- [ ] Je sais utiliser `break` et `continue`

---

## Exercice Pratique

**Énoncé** : Crée une fonction `fizzbuzz` qui prend un nombre et retourne :

- `"Fizz"` si le nombre est divisible par 3
- `"Buzz"` si le nombre est divisible par 5
- `"FizzBuzz"` si le nombre est divisible par 3 ET par 5
- Le nombre converti en texte sinon

Utilise cette fonction pour afficher FizzBuzz de 1 à 15.

**Indications** :

- Utilise `%` pour le modulo (reste de la division)
- `n % 3 == 0` vérifie si `n` est divisible par 3
- `n.to_string()` convertit un nombre en chaîne
- La fonction doit retourner `String` (on verra ce type plus tard)

**Résultat attendu** :

```text
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```rust
fn fizzbuzz(n: u32) -> String {
    if n % 3 == 0 && n % 5 == 0 {
        String::from("FizzBuzz")        // Divisible par 3 ET 5
    } else if n % 3 == 0 {
        String::from("Fizz")            // Divisible par 3 uniquement
    } else if n % 5 == 0 {
        String::from("Buzz")            // Divisible par 5 uniquement
    } else {
        n.to_string()                   // Sinon, retourne le nombre en texte
    }
}

fn main() {
    for i in 1..=15 {
        println!("{}", fizzbuzz(i));
    }
}
```

**Alternative avec match** :

```rust
fn fizzbuzz(n: u32) -> String {
    match (n % 3, n % 5) {
        (0, 0) => String::from("FizzBuzz"),
        (0, _) => String::from("Fizz"),
        (_, 0) => String::from("Buzz"),
        _ => n.to_string(),
    }
}

fn main() {
    for i in 1..=15 {
        println!("{}", fizzbuzz(i));
    }
}
```

---

## Navigation

← Fiche précédente : **[Variables et Types de Données](02-variables-types.md)**

→ Fiche suivante : **[Ownership (Propriété)](04-ownership.md)**
