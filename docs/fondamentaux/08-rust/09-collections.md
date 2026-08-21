---
tags:
  - Rust
  - Avancé
  - Pratique
description: "Collections"
estimated_time: "75 min"
fiche_number: 9
total_fiches: 16
cursus: "Rust"
id: "fundamentals.rust.collections"
course_id: "fundamentals.rust"
content_type: "lesson"
order: 9
---

# 09 - Collections

> **En bref** : À la fin de cette fiche, tu sauras utiliser les trois collections principales de Rust : `Vec<T>` (vecteurs), `String` (chaînes), et `HashMap<K, V>` (tables de hachage). Lecture estimée : 75 min.


## Prérequis

- Fiche **[04 - Ownership (propriété)](04-ownership.md)**
- Fiche **[05 - Borrowing et références](05-borrowing-references.md)**
- Fiche **[07 - Enums et pattern matching](07-enums-pattern-matching.md)** (pour Option)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les trois collections principales de Rust : `Vec<T>` (vecteurs), `String` (chaînes), et `HashMap<K, V>` (tables de hachage).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Les trois collections principales

| Collection | Description | Analogie |
| --- | --- | --- |
| `Vec<T>` | Liste dynamique d'éléments du même type | Liste de courses extensible |
| `String` | Chaîne de caractères UTF-8 extensible | Texte modifiable |
| `HashMap<K, V>` | Paires clé-valeur | Dictionnaire |

---

### Qu'est-ce qu'un `Vec<T>` ?

**Définition** : Un vecteur (`Vec<T>`) est une collection qui stocke plusieurs valeurs du même type, alignées en mémoire. Sa taille peut changer dynamiquement.

**Le problème que Vec résout** :

Sans Vec (avec des tableaux fixes), voici les problèmes :

1. **Taille fixe** : Tu dois connaître la taille à la compilation.
2. **Pas d'ajout** : Impossible d'ajouter des éléments après la création.
3. **Allocation manuelle** : En C, tu dois gérer `malloc`/`free`.

**Comment Vec résout ces problèmes** :

| Problème | Solution apportée par Vec |
| --- | --- |
| Taille fixe | La taille grandit automatiquement |
| Pas d'ajout | Méthodes `push`, `pop`, `insert` |
| Allocation manuelle | Géré automatiquement par l'ownership |

**Analogie concrète** : Un `Vec` est comme un tiroir extensible. Tu peux y ajouter des chaussettes tant que tu veux, le tiroir s'agrandit.

---

### Qu'est-ce qu'une String ?

**Définition** : `String` est une chaîne de caractères UTF-8 extensible, stockée sur le heap.

**Le problème que String résout** :

Les chaînes littérales (`&str`) ont une taille fixe connue à la compilation. Quand tu as besoin de construire un texte dynamiquement (saisie utilisateur, concaténation, lecture de fichier), tu as besoin d'une chaîne qui peut grandir et que tu possèdes : c'est le rôle de `String`.

**Différence entre String et &str** :

| `String` | `&str` |
| --- | --- |
| Possédé (ownership) | Emprunté (référence) |
| Modifiable (si mut) | Immutable |
| Stocké sur le heap | Peut pointer vers heap, stack, ou données statiques |
| Peut grandir | Taille fixe |

**Quand utiliser quoi** :

- `String` : quand tu dois posséder ou modifier la chaîne
- `&str` : quand tu veux juste lire une chaîne

---

### Qu'est-ce qu'un HashMap ?

**Définition** : Un `HashMap<K, V>` associe des clés de type `K` à des valeurs de type `V`. Chaque clé est unique.

**Le problème que HashMap résout** :

Avec un `Vec`, pour trouver un élément par son nom, tu dois parcourir toute la liste un par un. Un `HashMap` permet de retrouver une valeur directement à partir de sa clé, sans parcourir les autres éléments. C'est la différence entre chercher un mot dans un dictionnaire (accès direct par la lettre) et chercher dans une liste non triée (parcours complet).

**Analogie concrète** : Un `HashMap` est comme un carnet d'adresses. Le nom (clé) te donne accès au numéro (valeur).

---

## Étapes Pratiques

### Étape 1 : Créer un vecteur

```rust
fn main() {
    // Création avec Vec::new()
    let mut v1: Vec<i32> = Vec::new();
    v1.push(1);
    v1.push(2);
    v1.push(3);

    // Création avec la macro vec!
    let v2 = vec![1, 2, 3];     // Le type est inféré

    println!("v1 : {:?}", v1);
    println!("v2 : {:?}", v2);
}
```

**Résultat attendu** :

```text
v1 : [1, 2, 3]
v2 : [1, 2, 3]
```

---

### Étape 2 : Accéder aux éléments d'un vecteur

```rust
fn main() {
    let v = vec![10, 20, 30, 40, 50];

    // Méthode 1 : avec l'index [] (panic si hors limites)
    let troisieme = v[2];
    println!("Troisième élément : {}", troisieme);

    // Méthode 2 : avec get() qui retourne Option (plus sûr)
    match v.get(2) {
        Some(valeur) => println!("Troisième élément : {}", valeur),
        None => println!("Pas d'élément à cet index"),
    }

    // Index hors limites
    match v.get(100) {
        Some(valeur) => println!("Élément : {}", valeur),
        None => println!("Index 100 : hors limites"),
    }
}
```

**Résultat attendu** :

```text
Troisième élément : 30
Troisième élément : 30
Index 100 : hors limites
```

---

### Étape 3 : Modifier un vecteur

```rust
fn main() {
    let mut v = vec![1, 2, 3];
    println!("Avant : {:?}", v);

    // Ajouter à la fin
    v.push(4);
    println!("Après push(4) : {:?}", v);

    // Retirer le dernier élément
    let dernier = v.pop();
    println!("Après pop() : {:?}, retiré : {:?}", v, dernier);

    // Insérer à un index
    v.insert(1, 10);    // Insère 10 à l'index 1
    println!("Après insert(1, 10) : {:?}", v);

    // Retirer à un index
    let retire = v.remove(1);
    println!("Après remove(1) : {:?}, retiré : {}", v, retire);
}
```

**Résultat attendu** :

```text
Avant : [1, 2, 3]
Après push(4) : [1, 2, 3, 4]
Après pop() : [1, 2, 3], retiré : Some(4)
Après insert(1, 10) : [1, 10, 2, 3]
Après remove(1) : [1, 2, 3], retiré : 10
```

---

### Étape 4 : Parcourir un vecteur

```rust
fn main() {
    let v = vec![10, 20, 30];

    // Parcours immutable
    println!("Parcours immutable :");
    for element in &v {
        println!("  {}", element);
    }

    // Le vecteur est toujours utilisable
    println!("Vecteur après parcours : {:?}", v);

    // Parcours mutable
    let mut v2 = vec![1, 2, 3];
    for element in &mut v2 {
        *element *= 2;      // Double chaque élément
    }
    println!("Après modification : {:?}", v2);
}
```

**Résultat attendu** :

```text
Parcours immutable :
  10
  20
  30
Vecteur après parcours : [10, 20, 30]
Après modification : [2, 4, 6]
```

---

### Étape 5 : Méthodes utiles des vecteurs

```rust
fn main() {
    let v = vec![3, 1, 4, 1, 5, 9, 2, 6];

    println!("Longueur : {}", v.len());
    println!("Est vide : {}", v.is_empty());
    println!("Contient 4 : {}", v.contains(&4));
    println!("Premier : {:?}", v.first());
    println!("Dernier : {:?}", v.last());

    // Créer un vecteur trié (ne modifie pas l'original)
    let mut v_trie = v.clone();
    v_trie.sort();
    println!("Trié : {:?}", v_trie);

    // Inverser
    let mut v_inverse = v.clone();
    v_inverse.reverse();
    println!("Inversé : {:?}", v_inverse);
}
```

**Résultat attendu** :

```text
Longueur : 8
Est vide : false
Contient 4 : true
Premier : Some(3)
Dernier : Some(6)
Trié : [1, 1, 2, 3, 4, 5, 6, 9]
Inversé : [6, 2, 9, 5, 1, 4, 1, 3]
```

---

### Étape 6 : Créer une String

```rust
fn main() {
    // Différentes façons de créer une String
    let s1 = String::new();                     // Chaîne vide
    let s2 = String::from("Bonjour");          // À partir d'un littéral
    let s3 = "Monde".to_string();              // Conversion &str -> String
    let s4 = "Rust".to_owned();                // Équivalent à to_string()

    println!("s1 : '{}'", s1);
    println!("s2 : '{}'", s2);
    println!("s3 : '{}'", s3);
    println!("s4 : '{}'", s4);
}
```

**Résultat attendu** :

```text
s1 : ''
s2 : 'Bonjour'
s3 : 'Monde'
s4 : 'Rust'
```

---

### Étape 7 : Modifier une String

```rust
fn main() {
    let mut s = String::from("Hello");

    // Ajouter du texte
    s.push_str(", ");       // Ajoute une chaîne
    s.push('W');            // Ajoute un caractère
    s.push_str("orld!");

    println!("Résultat : {}", s);

    // Concaténation avec +
    let s1 = String::from("Hello, ");
    let s2 = String::from("World!");
    let s3 = s1 + &s2;      // Note : s1 est moved, s2 est emprunté
    println!("Concaténé : {}", s3);
    // println!("{}", s1);  // Erreur : s1 a été moved

    // Concaténation avec format!
    let s4 = String::from("Hello");
    let s5 = String::from("World");
    let s6 = format!("{}, {}!", s4, s5);    // Ni s4 ni s5 ne sont moved
    println!("Format : {}", s6);
}
```

**Résultat attendu** :

```text
Résultat : Hello, World!
Concaténé : Hello, World!
Format : Hello, World!
```

---

### Étape 8 : Accéder aux caractères d'une String

```rust
fn main() {
    let s = String::from("Bonjour");

    // Longueur en bytes (pas en caractères !)
    println!("Longueur en bytes : {}", s.len());

    // Parcourir les caractères
    println!("Caractères :");
    for c in s.chars() {
        println!("  '{}'", c);
    }

    // Parcourir avec les index
    println!("Avec index :");
    for (i, c) in s.chars().enumerate() {
        println!("  [{}] = '{}'", i, c);
    }

    // Attention aux caractères Unicode !
    let emoji = String::from("😀");
    println!("Emoji len() : {} bytes", emoji.len());    // 4 bytes !
    println!("Emoji chars : {}", emoji.chars().count()); // 1 caractère
}
```

**Résultat attendu** :

```text
Longueur en bytes : 7
Caractères :
  'B'
  'o'
  'n'
  'j'
  'o'
  'u'
  'r'
Avec index :
  [0] = 'B'
  [1] = 'o'
  [2] = 'n'
  [3] = 'j'
  [4] = 'o'
  [5] = 'u'
  [6] = 'r'
Emoji len() : 4 bytes
Emoji chars : 1
```

---

### Étape 9 : Méthodes utiles des String

```rust
fn main() {
    let s = String::from("  Hello, World!  ");

    println!("Original : '{}'", s);
    println!("trim() : '{}'", s.trim());
    println!("to_uppercase() : '{}'", s.to_uppercase());
    println!("to_lowercase() : '{}'", s.to_lowercase());
    println!("contains(\"World\") : {}", s.contains("World"));
    println!("starts_with(\"  H\") : {}", s.starts_with("  H"));
    println!("replace(\"World\", \"Rust\") : '{}'", s.replace("World", "Rust"));

    // Split
    let phrase = "un,deux,trois";
    let mots: Vec<&str> = phrase.split(',').collect();
    println!("Split : {:?}", mots);
}
```

**Résultat attendu** :

```text
Original : '  Hello, World!  '
trim() : 'Hello, World!'
to_uppercase() : '  HELLO, WORLD!  '
to_lowercase() : '  hello, world!  '
contains("World") : true
starts_with("  H") : true
replace("World", "Rust") : '  Hello, Rust!  '
Split : ["un", "deux", "trois"]
```

---

### Étape 10 : Créer un HashMap

```rust
use std::collections::HashMap;

fn main() {
    // Création et insertion
    let mut scores = HashMap::new();
    scores.insert(String::from("Bleu"), 10);
    scores.insert(String::from("Rouge"), 50);

    println!("Scores : {:?}", scores);

    // Création à partir de vecteurs
    let equipes = vec![String::from("Bleu"), String::from("Rouge")];
    let scores_initiaux = vec![10, 50];
    let scores2: HashMap<_, _> = equipes.into_iter()
        .zip(scores_initiaux.into_iter())
        .collect();

    println!("Scores2 : {:?}", scores2);
}
```

**Résultat attendu** :

```text
Scores : {"Rouge": 50, "Bleu": 10}
Scores2 : {"Bleu": 10, "Rouge": 50}
```

**Note** : L'ordre des éléments dans un HashMap n'est pas garanti.

---

### Étape 11 : Accéder aux valeurs d'un HashMap

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert(String::from("Bleu"), 10);
    scores.insert(String::from("Rouge"), 50);

    // Accès avec get() -> Option<&V>
    let equipe = String::from("Bleu");
    match scores.get(&equipe) {
        Some(score) => println!("Score de {} : {}", equipe, score),
        None => println!("Équipe {} non trouvée", equipe),
    }

    // Équipe inexistante
    match scores.get("Vert") {
        Some(score) => println!("Score de Vert : {}", score),
        None => println!("Équipe Vert non trouvée"),
    }
}
```

**Résultat attendu** :

```text
Score de Bleu : 10
Équipe Vert non trouvée
```

---

### Étape 12 : Modifier un HashMap

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert(String::from("Bleu"), 10);

    // Écraser une valeur
    scores.insert(String::from("Bleu"), 25);
    println!("Après écrasement : {:?}", scores);

    // Insérer seulement si la clé n'existe pas
    scores.entry(String::from("Bleu")).or_insert(50);     // Pas d'effet
    scores.entry(String::from("Vert")).or_insert(30);     // Ajouté
    println!("Après or_insert : {:?}", scores);

    // Modifier la valeur existante
    let compteur = scores.entry(String::from("Bleu")).or_insert(0);
    *compteur += 10;
    println!("Après modification : {:?}", scores);
}
```

**Résultat attendu** :

```text
Après écrasement : {"Bleu": 25}
Après or_insert : {"Bleu": 25, "Vert": 30}
Après modification : {"Bleu": 35, "Vert": 30}
```

---

### Étape 13 : Parcourir un HashMap

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();
    scores.insert(String::from("Bleu"), 10);
    scores.insert(String::from("Rouge"), 50);
    scores.insert(String::from("Vert"), 30);

    // Parcourir les paires clé-valeur
    println!("Tous les scores :");
    for (equipe, score) in &scores {
        println!("  {} : {}", equipe, score);
    }

    // Parcourir seulement les clés
    println!("Équipes : {:?}", scores.keys().collect::<Vec<_>>());

    // Parcourir seulement les valeurs
    println!("Scores : {:?}", scores.values().collect::<Vec<_>>());
}
```

**Résultat attendu** :

```text
Tous les scores :
  Vert : 30
  Bleu : 10
  Rouge : 50
Équipes : ["Vert", "Bleu", "Rouge"]
Scores : [30, 10, 50]
```

---

### Étape 14 : Exemple pratique - Compteur de mots

```rust
use std::collections::HashMap;

fn compter_mots(texte: &str) -> HashMap<String, i32> {
    let mut compteur = HashMap::new();

    for mot in texte.split_whitespace() {
        let mot_lower = mot.to_lowercase();
        let count = compteur.entry(mot_lower).or_insert(0);
        *count += 1;
    }

    compteur
}

fn main() {
    let texte = "le chat mange le poisson et le chien mange la viande";
    let compteur = compter_mots(texte);

    println!("Compteur de mots :");
    for (mot, count) in &compteur {
        println!("  '{}' : {}", mot, count);
    }
}
```

**Résultat attendu** :

```text
Compteur de mots :
  'le' : 3
  'chat' : 1
  'mange' : 2
  'poisson' : 1
  'et' : 1
  'chien' : 1
  'la' : 1
  'viande' : 1
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo run` | Compile et exécute le programme |
| `cargo check` | Vérifie la syntaxe sans compiler |

---

## Pièges Fréquents

### Piège 1 : Accès par index sur String

**Problème** : Tu ne peux pas accéder à un caractère par index avec `[]`.

```rust
let s = String::from("hello");
let c = s[0];       // Erreur !
```

**Solution** : Utilise `.chars()` :

```rust
let c = s.chars().nth(0);   // Retourne Option<char>
```

---

### Piège 2 : Ownership et HashMap

**Problème** : Les types qui n'implémentent pas `Copy` sont moved dans le HashMap.

```rust
let cle = String::from("clé");
let mut map = HashMap::new();
map.insert(cle, 10);
// println!("{}", cle);    // Erreur : cle a été moved
```

**Solution** : Clone la clé si tu en as encore besoin.

---

### Piège 3 : Modifier pendant l'itération

**Problème** : Tu ne peux pas modifier un vecteur pendant que tu itères dessus.

```rust
let mut v = vec![1, 2, 3];
for x in &v {
    v.push(x + 1);      // Erreur : emprunt mutable pendant emprunt immutable
}
```

**Solution** : Collecte les modifications et applique-les après.

---

### Piège 4 : len() sur String compte les bytes, pas les caractères

**Problème** : `len()` retourne la taille en bytes.

```rust
let s = String::from("café");
println!("{}", s.len());    // 5, pas 4 ! (é = 2 bytes)
```

**Solution** : Utilise `.chars().count()` pour les caractères.

---

## Checklist de Validation

- [ ] Je sais créer et utiliser un `Vec<T>`
- [ ] Je connais les méthodes `push`, `pop`, `get`, `insert`, `remove`
- [ ] Je sais parcourir un vecteur avec `for`
- [ ] Je connais la différence entre `String` et `&str`
- [ ] Je sais créer et modifier une `String`
- [ ] Je sais créer et utiliser un `HashMap<K, V>`
- [ ] Je connais `entry().or_insert()` pour les HashMap

---

## Exercice Pratique

**Énoncé** : Crée un programme de gestion de notes d'étudiants :

1. Utilise un `HashMap<String, Vec<f64>>` pour stocker les notes de chaque étudiant
2. Ajoute des notes pour plusieurs étudiants
3. Calcule et affiche la moyenne de chaque étudiant

**Indications** :

- `notes.entry(nom).or_insert(Vec::new()).push(note)` pour ajouter une note
- Utilise `.iter().sum::<f64>()` pour calculer la somme

**Résultat attendu** :

```text
Hugo : moyenne = 15.5
Alice : moyenne = 12.33
Bob : moyenne = 14.0
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```rust
use std::collections::HashMap;

fn main() {
    let mut notes: HashMap<String, Vec<f64>> = HashMap::new();

    // Ajouter des notes
    notes.entry(String::from("Hugo")).or_insert(Vec::new()).push(15.0);
    notes.entry(String::from("Hugo")).or_insert(Vec::new()).push(16.0);
    notes.entry(String::from("Alice")).or_insert(Vec::new()).push(10.0);
    notes.entry(String::from("Alice")).or_insert(Vec::new()).push(12.0);
    notes.entry(String::from("Alice")).or_insert(Vec::new()).push(15.0);
    notes.entry(String::from("Bob")).or_insert(Vec::new()).push(14.0);

    // Calculer et afficher les moyennes
    for (etudiant, liste_notes) in &notes {
        let somme: f64 = liste_notes.iter().sum();
        let moyenne = somme / liste_notes.len() as f64;
        println!("{} : moyenne = {:.2}", etudiant, moyenne);
    }
}
```

---

## Navigation

← Fiche précédente : **[Gestion des Erreurs](08-gestion-erreurs.md)**

→ Fiche suivante : **[Traits et Génériques](10-traits-generiques.md)**
