---
tags:
  - Rust
  - Avancé
  - Pratique
description: "Macros Rust : macros déclaratives macro_rules! et aperçu des macros procédurales"
estimated_time: "60 min"
fiche_number: 16
total_fiches: 16
cursus: "Rust"
id: "fundamentals.rust.macros"
course_id: "fundamentals.rust"
content_type: "lesson"
order: 16
---

# 16 - Macros Rust

> **En bref** : À la fin de cette fiche, tu sauras écrire une macro déclarative avec `macro_rules!`, reconnaître les macros procédurales (comme `derive`), et décider quand une macro est justifiée ou non. Lecture estimée : 60 min.

## Prérequis

- Fiche **[03 - Fonctions et contrôle de flux](03-fonctions-controle-flux.md)** (pour comparer macro et fonction)
- Fiche **[10 - Traits et génériques](10-traits-generiques.md)** (pour comprendre `#[derive(...)]`)
- Fiche **[15 - Workspaces Cargo](15-workspaces-cargo.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire une macro déclarative avec `macro_rules!` (motifs et répétitions), distinguer une macro d'une fonction, reconnaître les trois sortes de macros procédurales, et juger quand l'usage d'une macro est pertinent.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une macro ?

**Définition** : Une macro est un morceau de code qui écrit du code à ta place. Au moment de la compilation, Rust remplace l'appel de macro par le code qu'elle génère. On parle d'**expansion** de la macro.

**Le problème que les macros résolvent** :

Sans macros, voici les problèmes rencontrés :

1. **Répétition impossible à factoriser avec une fonction** : Une fonction a un nombre fixe d'arguments d'un type fixe. Or `println!` accepte un nombre variable d'arguments de types variés : une fonction classique ne peut pas faire ça.
2. **Code répétitif** : Écrire dix fois la même structure (par exemple créer dix variantes de test très semblables) est fastidieux et source d'erreurs.
3. **Génération automatique de code** : Implémenter à la main le même comportement (par exemple l'affichage) pour chaque type est répétitif. `#[derive(Debug)]` génère ce code automatiquement.

**Comment les macros résolvent ces problèmes** :

| Problème | Solution apportée par les macros |
| --- | --- |
| Nombre d'arguments variable | Une macro accepte un nombre et des types d'arguments variables |
| Code répétitif | Une macro génère le code répétitif à partir d'un modèle |
| Génération automatique | `derive` ajoute du code (comportements) sans l'écrire à la main |

**Analogie concrète** : Une macro est comme un modèle de lettre type dans un traitement de texte. Tu remplis quelques champs (nom, date, montant) et le document complet est généré automatiquement, toujours selon la même structure. Tu n'écris pas la lettre entière à chaque fois.

**Comment reconnaître un appel de macro** : un appel de macro se termine par un point d'exclamation `!`, comme `println!`, `vec!` ou `format!`. C'est ce qui le distingue d'un appel de fonction.

**Ce qu'une macro n'est PAS** :

- Une macro n'est pas une fonction. Une fonction est appelée pendant l'exécution du programme ; une macro est expansée pendant la compilation, avant que le programme ne s'exécute.
- Une macro n'est pas magique. Elle se contente de produire du code Rust normal, que le compilateur vérifie ensuite comme n'importe quel autre code.

---

### Macro ou fonction ?

| Fonction | Macro |
| --- | --- |
| Appelée à l'exécution | Expansée à la compilation |
| Nombre d'arguments fixe | Nombre d'arguments variable possible |
| Arguments d'un type déterminé | Peut accepter des types variés |
| Plus simple à lire et déboguer | Plus puissante mais plus difficile à lire |
| Pas de `!` à l'appel | Se termine par `!` à l'appel |

**Règle pratique** : préfère une fonction par défaut. N'utilise une macro que lorsqu'une fonction ne peut pas faire le travail (arguments variables, génération de code).

---

### Les deux grandes familles de macros

**Définition** : Rust distingue deux grandes familles de macros.

| Famille | Définie avec | Exemples |
| --- | --- | --- |
| Macros déclaratives | `macro_rules!` | `vec!`, `println!`, `format!` |
| Macros procédurales | Du code Rust dans une crate dédiée | `#[derive(Debug)]`, attributs, macros de type fonction |

Cette fiche t'apprend à **écrire** des macros déclaratives (le cas le plus courant et le plus accessible) et te donne un **aperçu** des macros procédurales (que tu utiliseras surtout sans les écrire toi-même).

---

### Anatomie d'une macro déclarative

**Définition** : Une macro déclarative associe des **motifs** (patterns) à du code de remplacement. Quand un appel correspond à un motif, Rust le remplace par le code associé. C'est proche du pattern matching que tu connais avec `match`.

```rust
// Declare une macro nommee "saluer"
macro_rules! saluer {
    // Motif : aucun argument
    () => {
        println!("Bonjour");
    };
}

fn main() {
    // L'appel se termine par !
    saluer!();
}
```

**Décryptage** :

- `macro_rules! saluer` : déclare une macro nommée `saluer`.
- `() => { ... }` : un **bras** (arm). À gauche du `=>`, le motif `()` signifie « appel sans argument ». À droite, le code généré.
- À la compilation, `saluer!()` est remplacé par `println!("Bonjour");`.

---

### Les fragments : capturer des morceaux de code

**Définition** : Dans le motif d'une macro, tu captures des morceaux de code avec des variables préfixées par `$`. Chaque variable a un **type de fragment** qui indique quelle sorte de code elle accepte.

| Spécificateur | Capture | Exemple de ce qui correspond |
| --- | --- | --- |
| `expr` | Une expression | `2 + 2`, `nom`, `calcul()` |
| `ident` | Un identifiant | `ma_variable`, `Utilisateur` |
| `ty` | Un type | `i32`, `String`, `Vec<u8>` |
| `literal` | Une valeur littérale | `42`, `"texte"`, `true` |
| `tt` | Un « token tree » (morceau brut) | presque n'importe quoi |

```rust
// Macro qui prend une expression et l'affiche avec une etiquette
macro_rules! afficher {
    // $valeur capture une expression
    ($valeur:expr) => {
        println!("Valeur : {}", $valeur);
    };
}

fn main() {
    afficher!(2 + 3);   // Valeur : 5
    afficher!("texte"); // Valeur : texte
}
```

---

### Les répétitions : gérer un nombre variable d'arguments

**Définition** : Une macro peut accepter un nombre variable d'éléments grâce aux **répétitions**. La syntaxe `$( ... )*` signifie « répète ce motif zéro fois ou plus ».

| Symbole de répétition | Signification |
| --- | --- |
| `$(...)*` | Zéro répétition ou plus |
| `$(...)+` | Une répétition ou plus |
| `$(...),*` | Répétitions séparées par des virgules |

```rust
// Macro qui affiche chaque element qu'on lui passe
macro_rules! tout_afficher {
    // $($x:expr),* : une liste d'expressions separees par des virgules
    ( $( $x:expr ),* ) => {
        // Le bloc $(...)* est genere une fois par element capture
        $(
            println!("{}", $x);
        )*
    };
}

fn main() {
    tout_afficher!(1, 2, 3);
}
```

**Résultat** : la macro génère trois `println!`, un par valeur. C'est exactement le mécanisme derrière `vec![1, 2, 3]`.

---

### Aperçu des macros procédurales

**Définition** : Une macro procédurale est écrite comme du vrai code Rust qui reçoit du code en entrée et produit du code en sortie. Elle vit dans une crate spéciale (de type `proc-macro`). Tu en utilises tous les jours sans les écrire.

**Les trois sortes de macros procédurales** :

| Sorte | À quoi elle sert | Exemple d'utilisation |
| --- | --- | --- |
| Derive | Ajoute automatiquement un comportement à un type | `#[derive(Debug, Clone)]` |
| Attribut | Annote un élément pour modifier ou enrichir son code | `#[tokio::main]` (vu en fiche 13) |
| Fonction | S'appelle comme une macro déclarative mais avec une logique plus riche | `sqlx::query!(...)` |

**Le cas le plus courant : `derive`** :

```rust
// derive(Debug) genere automatiquement le code d'affichage de debogage
#[derive(Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 1, y: 2 };

    // {:?} utilise le code genere par derive(Debug)
    println!("{:?}", p);
}
```

**Résultat** :

```text
Point { x: 1, y: 2 }
```

Sans `#[derive(Debug)]`, il faudrait écrire à la main l'implémentation du trait `Debug` pour `Point`. La macro procédurale `derive` le fait pour toi.

**Ce que tu dois retenir** : écrire une macro procédurale demande une crate dédiée et des bibliothèques spécialisées. C'est un sujet avancé que tu n'abordes pas ici. En revanche, tu **utilises** ces macros (surtout `derive`) en permanence.

---

### Macros déclaratives ou procédurales : laquelle ?

| Macro déclarative (`macro_rules!`) | Macro procédurale |
| --- | --- |
| Définie dans un fichier ordinaire | Définie dans une crate `proc-macro` dédiée |
| Fonctionne par motifs et répétitions | Manipule le code comme une structure de données |
| Suffisante pour la plupart des besoins | Nécessaire pour `derive` et les transformations complexes |
| Accessible aux débutants en macros | Sujet avancé |

---

## Étapes Pratiques

### Étape 1 : Créer un projet de démonstration

```bash
# Cree un nouveau projet binaire et entre dedans
cargo new macros-demo
cd macros-demo
```

**Résultat attendu** :

```text
    Creating binary (application) `macros-demo` package
```

---

### Étape 2 : Écrire une première macro sans argument

Remplace le contenu de `src/main.rs` par :

```rust
// Macro la plus simple : aucun argument, un seul comportement
macro_rules! bonjour {
    () => {
        println!("Bonjour depuis une macro");
    };
}

fn main() {
    // Appel de la macro (note le !)
    bonjour!();
}
```

Lance le programme :

```bash
cargo run
```

**Résultat attendu** :

```text
Bonjour depuis une macro
```

---

### Étape 3 : Capturer une expression

Modifie `src/main.rs` pour que la macro accepte une valeur :

```rust
// $valeur capture une expression et l'affiche avec une etiquette
macro_rules! tracer {
    ($valeur:expr) => {
        println!("Trace : {}", $valeur);
    };
}

fn main() {
    tracer!(10 * 5);
    tracer!("message");
}
```

**Résultat attendu** :

```text
Trace : 50
Trace : message
```

La même macro accepte un calcul puis une chaîne : une fonction classique ne pourrait pas prendre ces deux types sans génériques.

---

### Étape 4 : Plusieurs bras dans une macro

Une macro peut avoir plusieurs motifs, comme un `match`. Le premier motif qui correspond est utilisé.

```rust
macro_rules! decrire {
    // Bras 1 : aucun argument
    () => {
        println!("Aucune valeur");
    };
    // Bras 2 : une expression
    ($valeur:expr) => {
        println!("Une valeur : {}", $valeur);
    };
}

fn main() {
    decrire!();      // Utilise le bras 1
    decrire!(42);    // Utilise le bras 2
}
```

**Résultat attendu** :

```text
Aucune valeur
Une valeur : 42
```

---

### Étape 5 : Gérer un nombre variable d'arguments

Écris une macro qui affiche chaque élément d'une liste de taille variable :

```rust
macro_rules! liste {
    // Capture une liste d'expressions separees par des virgules
    ( $( $element:expr ),* ) => {
        // Genere un println! par element
        $(
            println!("- {}", $element);
        )*
    };
}

fn main() {
    liste!("pommes", "poires", "bananes");
}
```

**Résultat attendu** :

```text
- pommes
- poires
- bananes
```

---

### Étape 6 : Recréer une mini-version de la macro vec

La macro standard `vec!` crée un `Vec` à partir d'une liste. Voici une version simplifiée pour comprendre son mécanisme :

```rust
// Reconstruit un Vec a partir d'une liste d'elements
macro_rules! mon_vec {
    ( $( $element:expr ),* ) => {
        {
            // Cree un vecteur vide
            let mut v = Vec::new();
            // Ajoute chaque element capture
            $(
                v.push($element);
            )*
            // La derniere expression du bloc est la valeur renvoyee
            v
        }
    };
}

fn main() {
    let nombres = mon_vec![1, 2, 3, 4];
    println!("{:?}", nombres);
}
```

**Résultat attendu** :

```text
[1, 2, 3, 4]
```

C'est, en simplifié, ce que fait la macro `vec!` fournie par la bibliothèque standard.

---

### Étape 7 : Utiliser une macro procédurale (derive)

Tu n'écris pas de macro procédurale, mais tu en utilises une très courante : `derive`.

```rust
// derive genere le code d'affichage de debogage pour ce type
#[derive(Debug)]
struct Article {
    nom: String,
    prix: f64,
}

fn main() {
    let article = Article {
        nom: String::from("Clavier"),
        prix: 49.90,
    };

    // {:#?} affiche la version "jolie" (pretty) du Debug genere
    println!("{:#?}", article);
}
```

**Résultat attendu** :

```text
Article {
    nom: "Clavier",
    prix: 49.9,
}
```

Le code d'affichage n'a pas été écrit à la main : la macro `derive(Debug)` l'a généré à la compilation.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo run` | Compile et lance le programme (expansion des macros incluse) |
| `cargo build` | Compile sans lancer |
| `cargo expand` | Affiche le code généré après expansion des macros (outil externe à installer) |

> **Note** : `cargo expand` n'est pas fourni par défaut. Il s'installe séparément et sert à visualiser le code produit par une macro, ce qui aide à comprendre et déboguer.

---

## Pièges Fréquents

### Piège 1 : Oublier le ! à l'appel

⚠️ **Problème** : Écrire `bonjour()` au lieu de `bonjour!()`. Rust cherche alors une fonction nommée `bonjour` et échoue car c'est une macro.

✅ **Solution** : Tout appel de macro se termine par `!` :

```rust
bonjour!();   // Correct : appel de macro
```

---

### Piège 2 : Choisir le mauvais spécificateur de fragment

⚠️ **Problème** : Utiliser `expr` là où il faut un `ident` (ou l'inverse). Par exemple, capturer un nom de variable à déclarer avec `expr` ne fonctionne pas, car `expr` ne peut pas servir de nom de déclaration.

✅ **Solution** : Choisis le fragment selon l'usage : `ident` pour un nom, `expr` pour une valeur calculée, `ty` pour un type. En cas de doute, relis le tableau des fragments.

---

### Piège 3 : Atteindre une macro avant sa définition

⚠️ **Problème** : Appeler une macro déclarative définie plus bas dans le fichier. Contrairement aux fonctions, une `macro_rules!` doit être définie **avant** son premier appel dans le même fichier.

✅ **Solution** : Place la définition de la macro au-dessus du code qui l'utilise (par exemple en haut du fichier).

---

### Piège 4 : Utiliser une macro là où une fonction suffit

⚠️ **Problème** : Écrire une macro pour une tâche qu'une simple fonction ferait. Le code devient plus difficile à lire, à déboguer et à maintenir, sans bénéfice réel.

✅ **Solution** : Préfère une fonction. Réserve les macros aux cas où une fonction est impossible : nombre d'arguments variable, types variés, génération de code répétitif.

---

## Checklist de Validation

- [ ] Je sais reconnaître un appel de macro à son `!` final
- [ ] Je comprends qu'une macro est expansée à la compilation, pas exécutée comme une fonction
- [ ] Je sais écrire une macro déclarative simple avec `macro_rules!`
- [ ] Je sais capturer une expression avec un fragment `expr`
- [ ] Je sais écrire une répétition avec `$( ... ),*`
- [ ] Je connais les trois sortes de macros procédurales (derive, attribut, fonction)
- [ ] Je sais utiliser `#[derive(Debug)]` et expliquer ce qu'elle génère
- [ ] Je sais décider quand une macro est justifiée plutôt qu'une fonction

---

## Exercice Pratique

**Énoncé** : Écris une macro déclarative `maximum!` qui accepte deux expressions et renvoie la plus grande des deux.

**Indications** :

- Le motif capture deux expressions séparées par une virgule : `($a:expr, $b:expr)`.
- Génère une expression conditionnelle `if $a > $b { $a } else { $b }`.
- Comme la macro produit une expression, tu peux l'affecter à une variable : `let m = maximum!(3, 7);`.

**Résultat attendu** : le programme affiche la plus grande des deux valeurs.

```text
Le maximum est 7
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**src/main.rs** :

```rust
// Macro qui renvoie la plus grande de deux expressions
macro_rules! maximum {
    // Capture deux expressions separees par une virgule
    ($a:expr, $b:expr) => {
        // Le bloc est une expression : sa derniere valeur est renvoyee
        if $a > $b {
            $a
        } else {
            $b
        }
    };
}

fn main() {
    // La macro produit une expression, affectable a une variable
    let m = maximum!(3, 7);
    println!("Le maximum est {}", m);
}
```

**Explication** :

- `($a:expr, $b:expr)` capture les deux valeurs passées à la macro.
- Le code généré est un `if/else` qui renvoie la plus grande valeur.
- Comme un `if/else` est une expression en Rust, son résultat est affecté à `m`.

**Lancement** :

```bash
cargo run
```

**Résultat attendu** :

```text
Le maximum est 7
```

---

## Navigation

← Fiche précédente : **[Workspaces Cargo (projets multi-crates)](15-workspaces-cargo.md)**
