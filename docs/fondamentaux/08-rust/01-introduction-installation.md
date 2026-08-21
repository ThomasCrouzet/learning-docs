---
tags:
  - Rust
  - Débutant
  - Concept
description: "Introduction à Rust et Installation"
estimated_time: "65 min"
fiche_number: 1
total_fiches: 16
cursus: "Rust"
id: "fundamentals.rust.introduction-installation"
course_id: "fundamentals.rust"
content_type: "lesson"
order: 1
---

# 01 - Introduction à Rust et Installation

> **En bref** : À la fin de cette fiche, tu sauras installer Rust, créer un projet avec Cargo, et exécuter ton premier programme Rust. Lecture estimée : 65 min.


## Prérequis

- Savoir utiliser un terminal (commandes `cd`, `ls`)
- Avoir un éditeur de code installé (VS Code recommandé)
- Aucune connaissance préalable de Rust n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer Rust, créer un projet avec Cargo, et exécuter ton premier programme Rust.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Rust ?

**Définition** : Rust est un langage de programmation compilé, conçu pour être rapide, sûr et concurrent.

**Le problème que Rust résout** :

Sans Rust (avec des langages comme C ou C++), voici les problèmes rencontrés :

1. **Erreurs de mémoire** : Accès à de la mémoire déjà libérée, fuites de mémoire, dépassements de tampon.
2. **Bugs difficiles à trouver** : Ces erreurs n'apparaissent souvent qu'à l'exécution, et leur manifestation dépend des conditions mémoire du moment.
3. **Sécurité compromise** : une part importante des vulnérabilités dans les logiciels (souvent citée autour de 70 % dans des analyses d'éditeurs comme Microsoft ou Google sur du code C/C++) vient d'erreurs de mémoire. Ce chiffre dépend du code base étudié : ce n'est pas une loi universelle.

**Comment Rust résout ces problèmes** :

| Problème | Solution apportée par Rust |
| --- | --- |
| Erreurs de mémoire | Le compilateur vérifie la mémoire AVANT l'exécution (dans le code sûr) |
| Bugs difficiles à trouver | Le code sûr qui compile n'a pas d'erreur de mémoire de type use-after-free, double free ou data race |
| Sécurité compromise | Ces classes d'erreurs deviennent beaucoup plus rares sans `unsafe` |

**Analogie concrète** : Imagine un correcteur orthographique qui vérifie ton texte pendant que tu écris. En C, tu écris ton texte et tu découvres les fautes quand quelqu'un le lit. En Rust, le correcteur refuse de te laisser terminer tant qu'il reste des fautes.

**Ce que Rust n'est PAS** :

- Rust n'est pas un langage interprété. Le code est compilé en binaire natif, comme C ou C++.
- Rust n'est pas un langage avec garbage collector. Il n'y a pas de pause pour nettoyer la mémoire (contrairement à Java ou Go).
- Rust n'est pas une garantie absolue d'absence de bugs. Le compilateur bloque beaucoup d'erreurs mémoire dans le code sûr, mais le code `unsafe`, les bugs de logique, les panics et les fuites volontaires restent possibles.

---

### Qu'est-ce que Cargo ?

**Définition** : Cargo est l'outil officiel de Rust pour gérer les projets, les dépendances et la compilation.

**Le problème que Cargo résout** :

Sans Cargo, voici les problèmes rencontrés :

1. **Compilation manuelle** : Tu dois taper des commandes complexes pour compiler.
2. **Gestion des dépendances** : Tu dois télécharger et configurer chaque bibliothèque manuellement.
3. **Structure de projet** : Chaque développeur organise son projet différemment.

**Comment Cargo résout ces problèmes** :

| Problème | Solution apportée par Cargo |
| --- | --- |
| Compilation manuelle | Une seule commande : `cargo build` |
| Gestion des dépendances | Fichier `Cargo.toml` qui liste les dépendances |
| Structure de projet | Structure standard générée automatiquement |

**Analogie concrète** : Cargo est comme un chef de chantier. Tu lui dis ce que tu veux construire (ton code), il s'occupe de commander les matériaux (dépendances), d'organiser le chantier (structure du projet) et de superviser la construction (compilation).

**Ce que Cargo n'est PAS** :

- Cargo n'est pas le compilateur. Le compilateur s'appelle `rustc`. Cargo utilise `rustc` en interne.
- Cargo n'est pas optionnel en pratique. Tous les projets Rust utilisent Cargo.

---

### Qu'est-ce que rustc ?

**Définition** : `rustc` est le compilateur Rust. Il transforme le code source `.rs` en fichier exécutable.

**Analogie concrète** : `rustc` est comme un traducteur. Tu lui donnes un texte en français (code Rust), il le traduit en langage machine (binaire exécutable).

**Ce que rustc n'est PAS** :

- `rustc` n'est pas utilisé directement en général. On passe par Cargo qui appelle `rustc` pour nous.

---

### Structure d'un projet Cargo

Quand tu crées un projet avec Cargo, voici la structure générée :

```text
mon-projet/
├── Cargo.toml      # Fichier de configuration du projet
├── Cargo.lock      # Versions exactes des dépendances (généré automatiquement)
└── src/
    └── main.rs     # Point d'entrée du programme
```

**Analogie concrète** : La structure d'un projet Cargo est comme un dossier administratif standardisé. Le `Cargo.toml` est la page de garde qui identifie le dossier et liste les documents joints (dépendances). Le dossier `src/` contient les documents eux-mêmes (ton code). Le `Cargo.lock` est le tampon du notaire qui certifie les versions exactes utilisées.

**Explication de chaque fichier** :

| Fichier | Rôle |
| --- | --- |
| `Cargo.toml` | Contient le nom du projet, sa version, et ses dépendances |
| `Cargo.lock` | Enregistre les versions exactes utilisées (ne pas modifier à la main) |
| `src/main.rs` | Fichier principal contenant la fonction `main()` |

---

## Étapes Pratiques

### Étape 1 : Installer Rust

Rust s'installe avec `rustup`, l'installateur officiel.

**Sur macOS ou Linux** :

```bash
# Télécharge et exécute l'installateur rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Pendant l'installation, choisis l'option par défaut (tape `1` puis Entrée).

**Après l'installation**, recharge ton terminal :

```bash
# Recharge les variables d'environnement
source ~/.cargo/env
```

**Résultat attendu** :

```text
Rust is installed now. Great!
```

---

### Étape 2 : Vérifier l'installation

```bash
# Affiche la version de Rust installée
rustc --version
```

**Résultat attendu** (la version peut varier) :

```text
rustc 1.85.0 (exemple de sortie ; ta version peut être plus récente)
```

```bash
# Affiche la version de Cargo
cargo --version
```

**Résultat attendu** :

```text
cargo 1.85.0 (exemple de sortie ; ta version peut être plus récente)
```

---

### Étape 3 : Créer un nouveau projet

```bash
# Crée un nouveau projet appelé "hello-rust"
cargo new hello-rust
```

**Résultat attendu** :

```text
     Created binary (application) `hello-rust` package
```

```bash
# Entre dans le dossier du projet
cd hello-rust
```

---

### Étape 4 : Explorer la structure du projet

```bash
# Affiche la structure du projet
ls -la
```

**Résultat attendu** :

```text
total 16
drwxr-xr-x  4 user  staff  128 Jan 23 10:00 .
drwxr-xr-x  3 user  staff   96 Jan 23 10:00 ..
-rw-r--r--  1 user  staff  174 Jan 23 10:00 Cargo.toml
drwxr-xr-x  3 user  staff   96 Jan 23 10:00 src
```

---

### Étape 5 : Examiner le fichier Cargo.toml

Ouvre le fichier `Cargo.toml` dans ton éditeur. Voici son contenu :

```toml
[package]
name = "hello-rust"        # Nom du projet
version = "0.1.0"          # Version du projet
edition = "2024"           # Édition de Rust (2024 est l'édition stable récente ; 2021 reste valide)

[dependencies]
# Les dépendances seront listées ici
```

---

### Étape 6 : Examiner le fichier main.rs

Ouvre le fichier `src/main.rs`. Cargo a généré un programme "Hello World" :

```rust
fn main() {
    println!("Hello, world!");
}
```

**Explication ligne par ligne** :

| Ligne | Explication |
| --- | --- |
| `fn main()` | Déclare la fonction principale. Tout programme Rust commence par `main()` |
| `{` | Début du bloc de code de la fonction |
| `println!("Hello, world!");` | Affiche le texte "Hello, world!" suivi d'un retour à la ligne |
| `}` | Fin du bloc de code de la fonction |

**Note importante** : `println!` se termine par un point d'exclamation `!`. Ce n'est pas une fonction, c'est une **macro**. Les macros en Rust se reconnaissent au `!` à la fin. Pour l'instant, retiens juste que `println!` affiche du texte.

---

### Étape 7 : Compiler et exécuter le programme

```bash
# Compile et exécute le programme en une seule commande
cargo run
```

**Résultat attendu** :

```text
   Compiling hello-rust v0.1.0 (/chemin/vers/hello-rust)
    Finished dev [unoptimized + debuginfo] target(s) in 0.50s
     Running `target/debug/hello-rust`
Hello, world!
```

**Explication de la sortie** :

| Ligne | Signification |
| --- | --- |
| `Compiling hello-rust v0.1.0` | Cargo compile ton projet |
| `Finished dev [unoptimized + debuginfo]` | Compilation terminée en mode développement |
| `Running target/debug/hello-rust` | Cargo exécute le binaire généré |
| `Hello, world!` | La sortie de ton programme |

---

### Étape 8 : Compiler sans exécuter

```bash
# Compile le projet sans l'exécuter
cargo build
```

**Résultat attendu** :

```text
    Finished dev [unoptimized + debuginfo] target(s) in 0.01s
```

Le binaire compilé se trouve dans `target/debug/hello-rust`.

---

### Étape 9 : Vérifier le code sans compiler

```bash
# Vérifie que le code est valide sans produire d'exécutable
cargo check
```

**Résultat attendu** :

```text
    Checking hello-rust v0.1.0 (/chemin/vers/hello-rust)
    Finished dev [unoptimized + debuginfo] target(s) in 0.10s
```

`cargo check` est plus rapide que `cargo build` car il ne génère pas de binaire. Utilise-le pour vérifier rapidement que ton code compile.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo new nom-projet` | Crée un nouveau projet |
| `cargo build` | Compile le projet |
| `cargo run` | Compile et exécute le projet |
| `cargo check` | Vérifie le code sans compiler |
| `cargo build --release` | Compile en mode optimisé (pour la production) |
| `rustc --version` | Affiche la version du compilateur |
| `rustup update` | Met à jour Rust vers la dernière version |

---

## Pièges Fréquents

### Piège 1 : Oublier de recharger le terminal après l'installation

**Problème** : Après l'installation de Rust, la commande `rustc` n'est pas reconnue.

**Solution** : Recharge les variables d'environnement :

```bash
source ~/.cargo/env
```

Ou ferme et rouvre ton terminal.

---

### Piège 2 : Oublier le point-virgule

**Problème** : Le code ne compile pas avec une erreur "expected `;`".

```rust
fn main() {
    println!("Hello")  // Erreur : il manque le point-virgule
}
```

**Solution** : En Rust, chaque instruction se termine par un point-virgule `;` :

```rust
fn main() {
    println!("Hello");  // Correct
}
```

---

### Piège 3 : Confondre `println!` et `println`

**Problème** : Le code ne compile pas avec une erreur "cannot find function `println`".

```rust
fn main() {
    println("Hello");  // Erreur : println sans ! n'existe pas
}
```

**Solution** : `println!` est une macro, pas une fonction. Le `!` est obligatoire :

```rust
fn main() {
    println!("Hello");  // Correct
}
```

---

## Checklist de Validation

- [ ] J'ai installé Rust avec `rustup`
- [ ] La commande `rustc --version` affiche une version
- [ ] La commande `cargo --version` affiche une version
- [ ] J'ai créé un projet avec `cargo new`
- [ ] J'ai exécuté mon premier programme avec `cargo run`
- [ ] J'ai compris la différence entre `cargo build`, `cargo run` et `cargo check`

---

## Exercice Pratique

**Énoncé** : Modifie le programme pour qu'il affiche ton prénom au lieu de "world".

**Indications** :

- Ouvre le fichier `src/main.rs`
- Modifie le texte entre les guillemets dans `println!`
- Exécute avec `cargo run`

**Résultat attendu** (si ton prénom est Alice) :

```text
Hello, Alice!
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Modifie le fichier `src/main.rs` :

```rust
fn main() {
    println!("Hello, Alice!");
}
```

Puis exécute :

```bash
cargo run
```

---

## Navigation

→ Fiche suivante : **[Variables et Types de Données](02-variables-types.md)**
