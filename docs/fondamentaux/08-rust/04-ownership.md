---
tags:
  - Rust
  - Intermédiaire
  - Pratique
description: "Ownership (Propriété)"
estimated_time: "65 min"
fiche_number: 4
total_fiches: 16
cursus: "Rust"
---

# 04 - Ownership (Propriété)

> **En bref** : À la fin de cette fiche, tu comprendras le système d'ownership de Rust, le concept de "move", et comment Rust gère la mémoire sans garbage collector. Lecture estimée : 65 min.


## Prérequis

- Fiche **[01 - Introduction à Rust et Installation](01-introduction-installation.md)**
- Fiche **[02 - Variables et types de données](02-variables-types.md)**
- Fiche **[03 - Fonctions et contrôle de flux](03-fonctions-controle-flux.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu comprendras le système d'ownership de Rust, le concept de "move", et comment Rust gère la mémoire sans garbage collector.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'ownership ?

**Définition** : L'ownership (propriété) est un ensemble de règles qui détermine comment Rust gère la mémoire. Chaque valeur a un propriétaire unique, et la mémoire est libérée quand le propriétaire sort du scope.

**Le problème que l'ownership résout** :

Sans ownership (en C par exemple), voici les problèmes rencontrés :

1. **Fuites de mémoire** : Tu oublies de libérer la mémoire après utilisation.
2. **Double libération** : Tu libères la même mémoire deux fois, causant un crash.
3. **Utilisation après libération** : Tu accèdes à de la mémoire déjà libérée.
4. **Garbage collector** : Certains langages (Java, Python) utilisent un GC qui cause des pauses.

**Comment l'ownership résout ces problèmes** :

| Problème | Solution apportée par l'ownership |
| --- | --- |
| Fuites de mémoire | La mémoire est libérée automatiquement à la fin du scope |
| Double libération | Une seule variable possède la valeur, donc une seule libération |
| Utilisation après libération | Le compilateur empêche d'utiliser une valeur après un move |
| Garbage collector | Pas besoin de GC, la libération est déterministe |

**Analogie concrète** : L'ownership fonctionne comme un livre de bibliothèque. Un livre ne peut avoir qu'un seul emprunteur à la fois. Quand tu passes le livre à quelqu'un d'autre, tu ne l'as plus. Quand l'emprunteur rend le livre (sort du scope), le livre est rangé (mémoire libérée).

---

### Les trois règles de l'ownership

Ces règles sont **absolues** en Rust. Il n'y a pas d'exception.

| Règle | Description |
| --- | --- |
| **Règle 1** | Chaque valeur a une variable qui est son _propriétaire_ (owner) |
| **Règle 2** | Il ne peut y avoir qu'un seul propriétaire à la fois |
| **Règle 3** | Quand le propriétaire sort du scope, la valeur est supprimée (drop) |

---

### Qu'est-ce que le scope ?

**Définition** : Le scope (portée) est la zone du code où une variable est valide.

```rust
{                       // Le scope commence ici
    let s = "hello";    // s est valide à partir d'ici
    // on peut utiliser s
}                       // Le scope se termine, s n'est plus valide
```

**Règle** : Une variable est valide depuis sa déclaration jusqu'à la fin du bloc `{}` qui la contient.

---

### Qu'est-ce qu'un move ?

**Définition** : Un move (déplacement) transfère la propriété d'une valeur d'une variable à une autre. Après un move, la variable d'origine n'est plus utilisable.

Le diagramme suivant montre ce qui se passe quand une valeur est moved d'une variable à une autre.

<div class="diagram-design">
<p><a href="../../../diagrams/fondamentaux-08-rust-04-ownership-1.html">Qu&#x27;est-ce qu&#x27;un move ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/fondamentaux-08-rust-04-ownership-1.html" title="Qu&#x27;est-ce qu&#x27;un move ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Exemple** :

```rust
let s1 = String::from("hello");
let s2 = s1;        // move : s1 transfère la propriété à s2
// s1 n'est plus utilisable ici
```

**Analogie concrète** : Imagine que tu donnes ta voiture à quelqu'un. Après le don, tu n'as plus de voiture. Tu ne peux pas conduire une voiture que tu as donnée.

**Ce qu'un move n'est PAS** :

- Un move n'est pas une copie. La valeur n'est pas dupliquée.
- Un move n'est pas un pointeur partagé. La variable d'origine devient invalide.

---

### Stack vs Heap

Pour comprendre l'ownership, il faut comprendre où les données sont stockées.

| Stack (pile) | Heap (tas) |
| --- | --- |
| Données de taille fixe connue à la compilation | Données de taille variable ou inconnue |
| Allocation très rapide | Allocation plus lente |
| Accès très rapide | Accès plus lent |
| Nettoyé automatiquement à la fin du scope | Doit être libéré explicitement (ou par Rust) |

**Exemples** :

| Type | Stockage | Raison |
| --- | --- | --- |
| `i32`, `f64`, `bool`, `char` | Stack | Taille fixe connue |
| `String` | Heap (données) + Stack (pointeur) | Taille variable |
| Tableaux fixes `[i32; 5]` | Stack | Taille fixe connue |
| Vecteurs `Vec<i32>` | Heap (données) + Stack (pointeur) | Taille variable |

---

### Copy vs Move

Certains types sont copiés automatiquement au lieu d'être moved.

**Types qui implémentent `Copy`** (copiés automatiquement) :

- Tous les types entiers (`i32`, `u8`, etc.)
- Les booléens (`bool`)
- Les flottants (`f32`, `f64`)
- Les caractères (`char`)
- Les tuples contenant uniquement des types `Copy`

**Types qui sont moved** (pas copiés) :

- `String`
- `Vec<T>` (vecteurs)
- Tout type qui alloue sur le heap

**Règle** : Si un type implémente le trait `Copy`, il est copié automatiquement. Sinon, il est moved.

---

### Qu'est-ce que clone ?

**Définition** : `clone()` crée une copie profonde (deep copy) des données sur le heap. Les deux variables deviennent indépendantes.

```rust
let s1 = String::from("hello");
let s2 = s1.clone();    // Copie profonde
// s1 et s2 sont tous deux valides
```

**Différence entre Copy et Clone** :

| Copy | Clone |
| --- | --- |
| Automatique et implicite | Explicite avec `.clone()` |
| Copie rapide (stack uniquement) | Peut être lent (copie le heap) |
| Types simples uniquement | Tous les types qui implémentent Clone |

---

## Étapes Pratiques

### Étape 1 : Observer le scope

```rust
fn main() {
    {                               // Début du scope interne
        let s = String::from("hello");
        println!("s = {}", s);
    }                               // Fin du scope, s est libéré (dropped)

    // println!("s = {}", s);       // Erreur : s n'existe plus ici
    println!("Fin du programme");
}
```

**Résultat attendu** :

```text
s = hello
Fin du programme
```

---

### Étape 2 : Comprendre le move

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;        // Move : s1 transfère la propriété à s2

    println!("s2 = {}", s2);
    // println!("s1 = {}", s1);     // Erreur : s1 n'est plus valide
}
```

**Résultat attendu** :

```text
s2 = hello
```

---

### Étape 3 : Voir l'erreur de move

Décommente la ligne avec `s1` pour voir l'erreur :

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;

    println!("s1 = {}", s1);    // Erreur !
}
```

**Message d'erreur** :

```text
error[E0382]: borrow of moved value: `s1`
 --> src/main.rs:5:24
  |
2 |     let s1 = String::from("hello");
  |         -- move occurs because `s1` has type `String`, which does not implement the `Copy` trait
3 |     let s2 = s1;
  |              -- value moved here
4 |
5 |     println!("s1 = {}", s1);
  |                         ^^ value borrowed here after move
```

**Explication du message** :

| Partie | Signification |
| --- | --- |
| `borrow of moved value: s1` | Tu essaies d'utiliser `s1` qui a été moved |
| `move occurs because s1 has type String` | `String` ne supporte pas `Copy`, donc c'est un move |
| `value moved here` | Le move a eu lieu à la ligne `let s2 = s1` |
| `value borrowed here after move` | Tu essaies d'utiliser `s1` après le move |

---

### Étape 4 : Copy avec les types primitifs

```rust
fn main() {
    let x = 5;
    let y = x;          // Copy : x est copié dans y (pas de move)

    println!("x = {}", x);  // x est toujours valide
    println!("y = {}", y);
}
```

**Résultat attendu** :

```text
x = 5
y = 5
```

**Explication** : `i32` implémente `Copy`, donc `x` est copié automatiquement. Les deux variables sont indépendantes.

---

### Étape 5 : Utiliser clone

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();    // Clone : copie profonde

    println!("s1 = {}", s1);    // s1 est toujours valide
    println!("s2 = {}", s2);    // s2 est une copie indépendante
}
```

**Résultat attendu** :

```text
s1 = hello
s2 = hello
```

---

### Étape 6 : Move lors d'un appel de fonction

```rust
fn afficher(s: String) {
    println!("{}", s);
}   // s est libéré ici

fn main() {
    let s = String::from("hello");
    afficher(s);            // Move : s est transféré à la fonction

    // println!("{}", s);   // Erreur : s n'est plus valide
}
```

**Résultat attendu** :

```text
hello
```

**Explication** : Passer une `String` à une fonction transfère la propriété. La variable originale n'est plus utilisable.

---

### Étape 7 : Retourner une valeur pour transférer la propriété

```rust
fn creer_chaine() -> String {
    let s = String::from("hello");
    s       // La propriété est transférée à l'appelant
}

fn main() {
    let s = creer_chaine();     // s devient propriétaire
    println!("{}", s);
}
```

**Résultat attendu** :

```text
hello
```

---

### Étape 8 : Prendre et retourner pour garder la propriété

```rust
fn calculer_longueur(s: String) -> (String, usize) {
    let longueur = s.len();
    (s, longueur)       // Retourne la String ET la longueur
}

fn main() {
    let s1 = String::from("hello");
    let (s2, longueur) = calculer_longueur(s1);

    println!("La longueur de '{}' est {}", s2, longueur);
}
```

**Résultat attendu** :

```text
La longueur de 'hello' est 5
```

**Note** : Cette méthode est fastidieuse. La fiche suivante présente une meilleure solution : le borrowing (emprunt).

---

### Étape 9 : Scope et libération automatique

```rust
fn main() {
    let s1 = String::from("première");

    {
        let s2 = String::from("deuxième");
        println!("Dans le bloc : s1 = {}, s2 = {}", s1, s2);
    }   // s2 est libéré ici

    println!("Après le bloc : s1 = {}", s1);
    // println!("s2 = {}", s2);    // Erreur : s2 n'existe plus
}   // s1 est libéré ici
```

**Résultat attendu** :

```text
Dans le bloc : s1 = première, s2 = deuxième
Après le bloc : s1 = première
```

---

### Étape 10 : Move dans une boucle

```rust
fn main() {
    let mots = vec!["un", "deux", "trois"];     // vec! crée un vecteur

    for mot in mots {           // Move : mots transfère chaque élément
        println!("{}", mot);
    }

    // println!("{:?}", mots);  // Erreur : mots a été moved
}
```

**Résultat attendu** :

```text
un
deux
trois
```

**Solution pour éviter le move** : Utiliser une référence (voir fiche suivante).

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo run` | Compile et exécute le programme |
| `cargo check` | Vérifie la syntaxe sans compiler |

---

## Pièges Fréquents

### Piège 1 : Utiliser une variable après un move

**Problème** : Erreur `borrow of moved value`.

```rust
let s1 = String::from("hello");
let s2 = s1;
println!("{}", s1);     // Erreur : s1 a été moved
```

**Solutions** :

1. Utiliser `s2` au lieu de `s1`
2. Utiliser `.clone()` pour copier : `let s2 = s1.clone();`
3. Utiliser des références (fiche suivante)

---

### Piège 2 : Passer une String à une fonction plusieurs fois

**Problème** : La variable est moved au premier appel.

```rust
fn afficher(s: String) {
    println!("{}", s);
}

fn main() {
    let s = String::from("hello");
    afficher(s);
    afficher(s);    // Erreur : s a déjà été moved
}
```

**Solutions** :

1. Utiliser `.clone()` : `afficher(s.clone());`
2. Utiliser des références (fiche suivante)

---

### Piège 3 : Confondre Copy et Clone

**Problème** : Tu penses qu'une `String` est copiée automatiquement.

```rust
let s1 = String::from("hello");
let s2 = s1;    // Move, pas Copy !
```

**Solution** : Souviens-toi que seuls les types primitifs (nombres, bool, char) sont `Copy`. Les types comme `String` et `Vec` nécessitent `.clone()` explicite.

---

### Piège 4 : Oublier que les fonctions prennent la propriété

**Problème** : Tu passes une variable à une fonction et essaies de l'utiliser après.

**Solution** : Soit la fonction retourne la valeur, soit tu utilises des références (fiche suivante).

---

## Checklist de Validation

- [ ] Je connais les trois règles de l'ownership
- [ ] Je sais ce qu'est un scope et quand une variable est libérée
- [ ] Je comprends ce qu'est un move
- [ ] Je sais quels types sont Copy (primitifs) et lesquels sont moved (String, Vec)
- [ ] Je sais utiliser `.clone()` pour copier des données
- [ ] Je comprends pourquoi passer une String à une fonction la rend invalide

---

## Exercice Pratique

**Énoncé** : Crée un programme qui :

1. Crée une `String` contenant ton prénom
2. Passe cette `String` à une fonction `saluer` qui affiche "Bonjour, [prénom] !"
3. Après l'appel, affiche "Prénom utilisé : [prénom]" dans `main`

**Contrainte** : Tu dois pouvoir utiliser le prénom après l'appel à `saluer`.

**Indications** :

- Tu as deux options : utiliser `.clone()` ou faire retourner la `String` par la fonction
- Choisis l'approche qui te semble la plus appropriée

**Résultat attendu** :

```text
Bonjour, Clara !
Prénom utilisé : Clara
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Solution 1 : Avec clone**

```rust
fn saluer(nom: String) {
    println!("Bonjour, {} !", nom);
}

fn main() {
    let prenom = String::from("Clara");
    saluer(prenom.clone());                     // On passe une copie
    println!("Prénom utilisé : {}", prenom);    // L'original est toujours valide
}
```

**Solution 2 : En retournant la String**

```rust
fn saluer(nom: String) -> String {
    println!("Bonjour, {} !", nom);
    nom     // Retourne la String pour rendre la propriété
}

fn main() {
    let prenom = String::from("Clara");
    let prenom = saluer(prenom);                // On récupère la propriété
    println!("Prénom utilisé : {}", prenom);
}
```

**Note** : Ces deux solutions fonctionnent, mais la solution idiomatique en Rust utilise les **références** (borrowing), que nous verrons dans la fiche suivante. Les références permettent de "prêter" une valeur sans transférer la propriété.

---

## Navigation

← Fiche précédente : **[Fonctions et Contrôle de Flux](03-fonctions-controle-flux.md)**

→ Fiche suivante : **[Borrowing et Références](05-borrowing-references.md)**
