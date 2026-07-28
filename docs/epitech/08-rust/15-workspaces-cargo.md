---
tags:
  - Rust
  - Avancé
  - Pratique
description: "Workspaces Cargo : organiser un projet en plusieurs crates"
estimated_time: "55 min"
fiche_number: 15
total_fiches: 16
cursus: "Rust"
---

# 15 - Workspaces Cargo (projets multi-crates)

> **En bref** : À la fin de cette fiche, tu sauras regrouper plusieurs crates dans un workspace Cargo, partager leurs dépendances, et compiler une crate précise avec `cargo build -p`. Lecture estimée : 55 min.

## Prérequis

- Fiche **[01 - Introduction et installation](01-introduction-installation.md)** (Cargo et la toolchain installés)
- Fiche **[11 - Modules et organisation](11-modules-organisation.md)** (différence entre binary crate et library crate)
- Savoir compiler et lancer un projet avec `cargo build` et `cargo run`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un workspace Cargo contenant une bibliothèque et un exécutable, déclarer ses membres, partager des dépendances entre les crates, et cibler une crate précise lors de la compilation.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un workspace ?

**Définition** : Un workspace est un ensemble de plusieurs crates gérées ensemble par Cargo. Ces crates partagent un même fichier de verrouillage des versions (`Cargo.lock`) et un même dossier de compilation (`target/`).

**Le problème que les workspaces résolvent** :

Sans workspace, voici les problèmes rencontrés quand un projet grossit :

1. **Tout dans une seule crate** : Le code de la bibliothèque et celui de l'exécutable sont mélangés, ce qui rend le projet difficile à lire.
2. **Versions de dépendances incohérentes** : Si tu sépares ton projet en plusieurs dossiers indépendants, chacun peut utiliser une version différente de la même dépendance.
3. **Compilation redondante** : Chaque projet indépendant recompile ses dépendances dans son propre dossier `target/`, ce qui prend du temps et de l'espace disque.

**Comment les workspaces résolvent ces problèmes** :

| Problème | Solution apportée par les workspaces |
| --- | --- |
| Tout dans une seule crate | Chaque crate a sa responsabilité (une bibliothèque, un exécutable) |
| Versions incohérentes | Un seul `Cargo.lock` aligne les versions pour toutes les crates |
| Compilation redondante | Un seul dossier `target/` partagé, les dépendances ne sont compilées qu'une fois |

**Analogie concrète** : Un workspace est comme un classeur à intercalaires. Chaque intercalaire (crate) regroupe des documents liés, mais tous partagent la même reliure (le `Cargo.lock` et le dossier `target/`). Tu peux travailler sur un intercalaire à la fois, sans sortir les feuilles des autres.

**Ce qu'un workspace n'est PAS** :

- Un workspace n'est pas une crate. C'est un conteneur de crates ; il n'a pas de code propre dans le cas le plus courant.
- Un workspace n'est pas obligatoire. Pour un petit projet à une seule crate, tu n'en as pas besoin. Il devient utile quand le projet se divise en plusieurs morceaux réutilisables.

---

### La crate racine et les membres

**Définition** : Un workspace est décrit par un fichier `Cargo.toml` placé à la racine, qui contient une section `[workspace]`. Les crates listées dans cette section sont les **membres** du workspace.

| Élément | Rôle |
| --- | --- |
| `Cargo.toml` racine | Déclare le workspace et liste ses membres |
| `members` | La liste des dossiers contenant les crates du workspace |
| Crate membre | Un dossier avec son propre `Cargo.toml` et son code (`src/`) |
| `Cargo.lock` | Unique, à la racine, partagé par tous les membres |
| `target/` | Unique, à la racine, partagé par tous les membres |

**Point important** : chaque crate membre garde son propre `Cargo.toml` (avec son nom, sa version, ses dépendances). Le `Cargo.toml` racine, lui, ne décrit que le workspace.

---

### Le Cargo.toml racine d'un workspace

**Définition** : La section `[workspace]` indique à Cargo que ce dossier est la racine d'un workspace et énumère ses membres.

```toml
# Cargo.toml a la racine du workspace

[workspace]
# La version "2" du resolver est recommandee pour l'edition 2021
resolver = "2"

# Liste des crates membres (chemins relatifs vers leurs dossiers)
members = [
    "ma-lib",
    "mon-app",
]
```

**Détail de chaque ligne** :

- `[workspace]` : déclare que ce dossier est un workspace.
- `resolver = "2"` : choisit la deuxième version du résolveur de dépendances, recommandée à partir de l'édition 2021.
- `members` : la liste des dossiers (chemins relatifs) contenant les crates membres.

> **Note** : Quand ce `Cargo.toml` racine ne contient qu'une section `[workspace]` sans section `[package]`, on parle de workspace « virtuel » : la racine n'est pas une crate, c'est juste un conteneur.

---

### Les dépendances partagées (workspace.dependencies)

**Définition** : La section `[workspace.dependencies]` permet de déclarer une version d'une dépendance **une seule fois** à la racine. Chaque membre la réutilise ensuite sans répéter le numéro de version.

**Le problème résolu** : sans cette section, si trois crates utilisent `serde`, tu écris `serde = "1.0"` dans trois `Cargo.toml` différents. Le jour où tu changes de version, tu dois modifier les trois fichiers et risquer un oubli.

**Dans le Cargo.toml racine** :

```toml
[workspace]
resolver = "2"
members = ["ma-lib", "mon-app"]

# Versions partagees : declarees une seule fois ici
[workspace.dependencies]
serde = { version = "1.0", features = ["derive"] }
```

**Dans le Cargo.toml d'un membre** :

```toml
[package]
name = "mon-app"
version = "0.1.0"
edition = "2021"

[dependencies]
# Reutilise la version definie a la racine du workspace
serde = { workspace = true }
```

Le mot-clé `workspace = true` dit à Cargo : « prends la définition de cette dépendance dans le `Cargo.toml` racine ». Une seule source de vérité pour la version.

---

### Une crate membre dépend d'une autre

**Définition** : Dans un workspace, un membre peut dépendre d'un autre membre en indiquant son chemin relatif avec la clé `path`.

```toml
[dependencies]
# mon-app utilise la bibliotheque ma-lib, situee dans le dossier voisin
ma-lib = { path = "../ma-lib" }
```

C'est ce qui permet de séparer une bibliothèque (`ma-lib`) de l'exécutable qui l'utilise (`mon-app`), tout en gardant les deux dans le même workspace.

---

## Étapes Pratiques

L'objectif de ces étapes est de construire un workspace contenant une bibliothèque `calculs` et un exécutable `app` qui l'utilise.

### Étape 1 : Créer le dossier racine du workspace

```bash
# Cree le dossier du workspace et entre dedans
mkdir mon-workspace
cd mon-workspace
```

Ce dossier ne contiendra pas de code directement : il accueillera les crates membres et le `Cargo.toml` racine.

---

### Étape 2 : Créer la bibliothèque et l'exécutable

```bash
# Cree une library crate nommee "calculs"
cargo new calculs --lib

# Cree une binary crate nommee "app"
cargo new app
```

**Résultat attendu** :

```text
    Creating library `calculs` package
    Creating binary (application) `app` package
```

Tu as maintenant deux sous-dossiers : `calculs/` (la bibliothèque) et `app/` (l'exécutable), chacun avec son propre `Cargo.toml`.

---

### Étape 3 : Écrire le Cargo.toml racine du workspace

Crée un fichier `Cargo.toml` à la racine de `mon-workspace` (à côté des dossiers `calculs` et `app`) :

```toml
# Cargo.toml a la racine du workspace

[workspace]
resolver = "2"

# Les deux crates membres
members = [
    "calculs",
    "app",
]
```

---

### Étape 4 : Écrire le code de la bibliothèque

Remplace le contenu de `calculs/src/lib.rs` par :

```rust
// Additionne deux entiers et renvoie le resultat
pub fn additionner(a: i32, b: i32) -> i32 {
    a + b
}

// Multiplie deux entiers et renvoie le resultat
pub fn multiplier(a: i32, b: i32) -> i32 {
    a * b
}
```

Ces deux fonctions sont publiques (`pub`), donc utilisables depuis une autre crate.

---

### Étape 5 : Déclarer la bibliothèque comme dépendance de l'exécutable

Ouvre `app/Cargo.toml` et ajoute la dépendance vers `calculs` :

```toml
[package]
name = "app"
version = "0.1.0"
edition = "2021"

[dependencies]
# Depend de la crate membre voisine "calculs"
calculs = { path = "../calculs" }
```

Le chemin `../calculs` remonte d'un niveau (vers la racine du workspace) puis entre dans le dossier `calculs`.

---

### Étape 6 : Utiliser la bibliothèque dans l'exécutable

Remplace le contenu de `app/src/main.rs` par :

```rust
// Importe les fonctions de la crate membre "calculs"
use calculs::{additionner, multiplier};

fn main() {
    let somme = additionner(4, 6);
    let produit = multiplier(4, 6);

    println!("4 + 6 = {}", somme);
    println!("4 * 6 = {}", produit);
}
```

---

### Étape 7 : Compiler tout le workspace

Depuis la racine `mon-workspace`, lance :

```bash
# Compile toutes les crates membres du workspace
cargo build
```

**Résultat attendu** (extrait) :

```text
   Compiling calculs v0.1.0 (/chemin/mon-workspace/calculs)
   Compiling app v0.1.0 (/chemin/mon-workspace/app)
    Finished `dev` profile [unoptimized + debuginfo] target(s)
```

Un seul dossier `target/` est créé à la racine, partagé par les deux crates. Aucun `target/` n'apparaît dans `calculs/` ou `app/`.

---

### Étape 8 : Lancer l'exécutable du workspace

Quand un workspace contient plusieurs crates, tu dois préciser laquelle lancer avec `-p` (pour « package ») :

```bash
# Lance la crate "app" (la bibliotheque calculs n'est pas executable)
cargo run -p app
```

**Résultat attendu** :

```text
4 + 6 = 10
4 * 6 = 24
```

---

### Étape 9 : Compiler une seule crate avec -p

L'option `-p` cible une crate précise, sans recompiler les autres si ce n'est pas nécessaire :

```bash
# Compile uniquement la bibliotheque calculs
cargo build -p calculs

# Compile uniquement l'executable app
cargo build -p app
```

C'est utile dans un gros workspace : tu vérifies une crate à la fois sans attendre la compilation de toutes les autres.

---

### Étape 10 : Ajouter une dépendance partagée

Imagine que `calculs` et `app` aient besoin de la même bibliothèque externe. Déclare sa version une seule fois à la racine.

**Cargo.toml racine** :

```toml
[workspace]
resolver = "2"
members = ["calculs", "app"]

# Version partagee par tous les membres
[workspace.dependencies]
rand = "0.8"
```

**calculs/Cargo.toml** :

```toml
[package]
name = "calculs"
version = "0.1.0"
edition = "2021"

[dependencies]
# Reutilise la version "0.8" definie a la racine
rand = { workspace = true }
```

**app/Cargo.toml** :

```toml
[dependencies]
calculs = { path = "../calculs" }
# Meme version partagee, sans repeter le numero
rand = { workspace = true }
```

Le jour où tu passes `rand` à une nouvelle version, tu ne modifies que la ligne du `Cargo.toml` racine.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo new nom --lib` | Crée une library crate (membre potentiel) |
| `cargo new nom` | Crée une binary crate (membre potentiel) |
| `cargo build` | Compile toutes les crates du workspace |
| `cargo build -p nom` | Compile uniquement la crate `nom` |
| `cargo run -p nom` | Lance l'exécutable de la crate `nom` |
| `cargo test` | Lance les tests de toutes les crates du workspace |
| `cargo test -p nom` | Lance les tests de la crate `nom` seulement |

---

## Pièges Fréquents

### Piège 1 : Oublier d'ajouter une crate dans members

⚠️ **Problème** : Tu crées un nouveau dossier de crate mais tu oublies de l'ajouter à la liste `members` du `Cargo.toml` racine. Cargo ne la compile pas et ne la considère pas comme partie du workspace.

✅ **Solution** : À chaque nouvelle crate, ajoute son dossier dans `members` :

```toml
[workspace]
members = [
    "calculs",
    "app",
    "nouvelle-crate",
]
```

---

### Piège 2 : Lancer cargo run sans -p dans un workspace à plusieurs binaires

⚠️ **Problème** : Si le workspace contient plusieurs exécutables, `cargo run` ne sait pas lequel lancer et affiche une erreur demandant de préciser le package.

✅ **Solution** : Indique toujours la crate visée avec `-p` :

```bash
cargo run -p app
```

---

### Piège 3 : Répéter les numéros de version dans chaque membre

⚠️ **Problème** : Déclarer `serde = "1.0"` dans chaque `Cargo.toml` de membre. Au moindre changement de version, tu dois modifier tous les fichiers et un oubli crée une incohérence.

✅ **Solution** : Déclare la version une seule fois dans `[workspace.dependencies]` à la racine, puis utilise `serde = { workspace = true }` dans chaque membre.

---

### Piège 4 : Confondre le Cargo.toml racine et celui d'un membre

⚠️ **Problème** : Ajouter une section `[dependencies]` directement dans le `Cargo.toml` racine d'un workspace virtuel (qui n'a pas de `[package]`). Cargo ne sait pas à quelle crate rattacher ces dépendances.

✅ **Solution** : Les dépendances applicatives vont dans le `Cargo.toml` d'un **membre**. À la racine, n'utilise que `[workspace]` et, si besoin, `[workspace.dependencies]` pour les versions partagées.

---

## Checklist de Validation

- [ ] Je comprends qu'un workspace regroupe plusieurs crates avec un `Cargo.lock` et un `target/` partagés
- [ ] Je sais écrire un `Cargo.toml` racine avec la section `[workspace]` et la liste `members`
- [ ] Je sais faire dépendre un membre d'un autre avec `path`
- [ ] Je sais compiler tout le workspace avec `cargo build`
- [ ] Je sais cibler une crate précise avec `cargo build -p` et `cargo run -p`
- [ ] Je sais partager une version de dépendance avec `[workspace.dependencies]` et `workspace = true`
- [ ] Je distingue le rôle du `Cargo.toml` racine de celui d'un membre

---

## Exercice Pratique

**Énoncé** : Crée un workspace `texte-workspace` contenant deux crates :

1. Une bibliothèque `texte` avec une fonction publique `compter_mots(phrase: &str) -> usize` qui renvoie le nombre de mots d'une phrase.
2. Un exécutable `cli` qui dépend de `texte` et affiche le nombre de mots d'une phrase de ton choix.

**Indications** :

- Utilise `cargo new texte --lib` et `cargo new cli`.
- La méthode `split_whitespace()` d'une `&str` découpe une phrase en mots ; `count()` compte les éléments d'un itérateur.
- N'oublie pas de déclarer `texte` dans `members` et comme dépendance `path` de `cli`.

**Résultat attendu** : `cargo run -p cli` affiche le nombre de mots de la phrase, par exemple :

```text
La phrase contient 4 mots
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Structure du workspace** :

```text
texte-workspace/
├── Cargo.toml
├── texte/
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs
└── cli/
    ├── Cargo.toml
    └── src/
        └── main.rs
```

**Cargo.toml racine** :

```toml
[workspace]
resolver = "2"
members = [
    "texte",
    "cli",
]
```

**texte/src/lib.rs** :

```rust
// Compte le nombre de mots dans une phrase
pub fn compter_mots(phrase: &str) -> usize {
    // split_whitespace decoupe sur les espaces, count compte les morceaux
    phrase.split_whitespace().count()
}
```

**cli/Cargo.toml** :

```toml
[package]
name = "cli"
version = "0.1.0"
edition = "2021"

[dependencies]
# Depend de la bibliotheque membre "texte"
texte = { path = "../texte" }
```

**cli/src/main.rs** :

```rust
use texte::compter_mots;

fn main() {
    let phrase = "Rust est un langage";
    let nombre = compter_mots(phrase);

    println!("La phrase contient {} mots", nombre);
}
```

**Lancement** :

```bash
# Depuis la racine texte-workspace
cargo run -p cli
```

**Résultat attendu** :

```text
La phrase contient 4 mots
```

---

## Navigation

← Fiche précédente : **[Outils de qualité : clippy et rustfmt](14-outils-qualite.md)**

→ Fiche suivante : **[Macros Rust](16-macros.md)**
