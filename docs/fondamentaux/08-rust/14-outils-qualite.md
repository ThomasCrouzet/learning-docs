---
tags:
  - Rust
  - Intermédiaire
  - Pratique
description: "Outils de qualité : clippy et rustfmt"
estimated_time: "50 min"
fiche_number: 14
total_fiches: 16
cursus: "Rust"
id: "fundamentals.rust.outils-qualite"
course_id: "fundamentals.rust"
content_type: "lesson"
order: 14
---

# 14 - Outils de qualité : clippy et rustfmt

> **En bref** : À la fin de cette fiche, tu sauras utiliser `cargo clippy` pour détecter les défauts de ton code, `cargo fmt` pour le formater automatiquement, et intégrer ces vérifications dans une CI. Lecture estimée : 50 min.

## Prérequis

- Fiche **[01 - Introduction et installation](01-introduction-installation.md)** (Cargo et la toolchain installés)
- Fiche **[12 - Tests](12-tests.md)**
- Savoir compiler un projet avec `cargo build` et `cargo run`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lancer le linter `clippy` pour améliorer ton code, formater automatiquement tes fichiers avec `rustfmt`, configurer ces outils, et les exécuter dans une intégration continue.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un outil de qualité ?

**Définition** : Un outil de qualité est un programme qui analyse ton code source pour repérer des problèmes (erreurs probables, formulations maladroites, style incohérent) sans que tu aies à les chercher à la main.

**Le problème que les outils de qualité résolvent** :

Sans ces outils, voici les problèmes rencontrés :

1. **Relectures fastidieuses** : Repérer chaque maladresse ou incohérence de style à l'oeil prend du temps et laisse passer des erreurs.
2. **Style hétérogène** : Chaque développeur indente et espace différemment, ce qui rend le code difficile à lire et les différences Git bruyantes.
3. **Mauvaises habitudes** : On écrit du code qui compile mais qui n'exploite pas les bonnes pratiques du langage.

**Comment les outils de qualité résolvent ces problèmes** :

| Problème | Solution apportée par les outils |
| --- | --- |
| Relectures fastidieuses | L'analyse est automatique et instantanée |
| Style hétérogène | Le formatage est uniformisé pour toute l'équipe |
| Mauvaises habitudes | Le linter suggère des formulations idiomatiques |

**Analogie concrète** : Ces outils sont comme un correcteur orthographique et grammatical dans un traitement de texte. Le correcteur orthographique (rustfmt) uniformise la mise en forme ; le correcteur grammatical (clippy) signale les tournures à améliorer. Le texte reste le tien, mais il devient plus lisible et plus correct.

---

### Linter et formateur : deux rôles distincts

| Linter (clippy) | Formateur (rustfmt) |
| --- | --- |
| Analyse le **sens** du code | Analyse la **mise en forme** du code |
| Suggère des améliorations et repère des erreurs probables | Réorganise l'indentation et les espaces |
| Exemple : « utilise `is_empty()` au lieu de `len() == 0` » | Exemple : « aligne cette accolade, indente avec 4 espaces » |
| Ne change pas la présentation | Ne change pas le comportement |

**Ce qu'un linter n'est PAS** : un linter n'est pas un compilateur. Le compilateur refuse le code qui ne peut pas s'exécuter ; le linter accepte du code valide mais suggère de l'améliorer.

---

### Qu'est-ce que clippy ?

**Définition** : `clippy` est le linter officiel de Rust. Il analyse ton code et émet des avertissements (lints) lorsqu'il détecte des constructions douteuses, peu idiomatiques ou potentiellement boguées.

**Analogie concrète** : `clippy` est comme un collègue expérimenté qui relit ton code par-dessus ton épaule. Il ne réécrit rien à ta place, mais il te dit « ici, il y a une façon plus simple d'écrire ça » ou « attention, cette ligne risque de poser problème ».

**Les catégories de lints** : chaque lint appartient à une catégorie qui indique son niveau de sévérité par défaut.

| Catégorie | Signification | Comportement par défaut |
| --- | --- | --- |
| `correctness` | Code presque certainement faux | Erreur (bloque) |
| `suspicious` | Code probablement faux | Avertissement |
| `style` | Code non idiomatique | Avertissement |
| `complexity` | Code inutilement compliqué | Avertissement |
| `perf` | Code qui pourrait être plus rapide | Avertissement |
| `pedantic` | Lints stricts, désactivés par défaut | Désactivé |

**Exemple de suggestion clippy** :

```rust
// Code que clippy va signaler
let liste: Vec<i32> = Vec::new();
if liste.len() == 0 {
    println!("vide");
}
```

clippy proposera d'utiliser `liste.is_empty()`, plus lisible et plus clair que `len() == 0`.

---

### Désactiver un lint avec #[allow]

**Définition** : Parfois, un lint signale un cas que tu assumes volontairement. L'attribut `#[allow(...)]` désactive un lint précis sur un élément (une fonction, un module) ou sur tout un fichier.

**Exemple** :

```rust
// Désactive le lint "dead_code" pour cette fonction précise
#[allow(dead_code)]
fn fonction_pas_encore_utilisee() {
    // ...
}
```

Pour désactiver un lint clippy, on préfixe son nom par `clippy::` :

```rust
// Autorise l'écriture len() == 0 ici, malgré la suggestion de clippy
#[allow(clippy::len_zero)]
fn verifier(liste: &[i32]) -> bool {
    liste.len() == 0
}
```

> **Note** : Utilise `#[allow(...)]` avec parcimonie et seulement quand le choix est justifié. Désactiver un lint sans raison revient à ignorer le conseil d'un relecteur compétent.

---

### Qu'est-ce que rustfmt ?

**Définition** : `rustfmt` est le formateur officiel de Rust. Il réécrit la mise en forme de ton code (indentation, espaces, retours à la ligne) selon un style standard, sans changer ce que fait le code. On l'invoque via `cargo fmt`.

**Le problème que rustfmt résout** :

Décider à la main où mettre les espaces et comment indenter est une perte d'énergie, et chaque personne fait des choix différents. `rustfmt` impose un style unique et automatique, ce qui met fin aux débats de présentation et rend les différences Git plus propres.

**Analogie concrète** : `rustfmt` est comme la fonction « justifier le texte » d'un traitement de texte. Tu écris tes phrases comme elles viennent, et la mise en page (marges, alignement) est appliquée d'un coup, identique pour tout le document.

**Avant `cargo fmt`** :

```rust
fn additionner(a:i32,b:i32)->i32{a+b}
```

**Après `cargo fmt`** :

```rust
fn additionner(a: i32, b: i32) -> i32 {
    a + b
}
```

---

### cargo check ou cargo build ?

**Définition** :

- `cargo check` vérifie que le code compile (analyse et typage) **sans produire de fichier exécutable**.
- `cargo build` fait la même vérification **puis génère le binaire**.

**Comparaison** :

| `cargo check` | `cargo build` |
| --- | --- |
| Vérifie la compilation | Vérifie et produit le binaire |
| Ne génère aucun exécutable | Génère l'exécutable dans `target/` |
| Plus rapide | Plus lent (étape de génération en plus) |
| Idéal pendant l'écriture du code | Nécessaire pour exécuter le programme |

**Analogie concrète** : `cargo check` est comme relire une lettre pour vérifier qu'elle n'a pas de fautes ; `cargo build` est comme la relire **puis** l'imprimer. Tant que tu corriges encore le texte, la relecture seule (plus rapide) suffit.

---

## Étapes Pratiques

### Étape 1 : Créer un projet de démonstration

```bash
# Crée un nouveau projet binaire et entre dedans
cargo new qualite-demo
cd qualite-demo
```

**Résultat attendu** :

```text
    Creating binary (application) `qualite-demo` package
```

---

### Étape 2 : Écrire du code volontairement perfectible

Remplace le contenu de `src/main.rs` par ce code, qui compile mais que clippy va critiquer :

```rust
fn main() {
    // Vec vide pour la démonstration
    let nombres: Vec<i32> = Vec::new();

    // clippy préfère is_empty() à len() == 0
    if nombres.len() == 0 {
        println!("La liste est vide");
    }

    // clippy signale le return inutile en fin de fonction
    let total = additionner(2, 3);
    println!("Total : {}", total);
}

fn additionner(a: i32, b: i32) -> i32 {
    // return explicite inutile : la dernière expression suffit
    return a + b;
}
```

---

### Étape 3 : Installer clippy et rustfmt si nécessaire

`clippy` et `rustfmt` sont des composants de la toolchain. Avec une installation via `rustup`, ils sont en général déjà présents. Pour t'en assurer :

```bash
# Ajoute les composants à la toolchain active (sans effet s'ils sont déjà là)
rustup component add clippy rustfmt
```

**Résultat attendu** :

```text
info: component 'clippy' is up to date
info: component 'rustfmt' is up to date
```

---

### Étape 4 : Lancer clippy

```bash
# Analyse le code et affiche les suggestions
cargo clippy
```

**Résultat attendu** (extrait) :

```text
warning: length comparison to zero
 --> src/main.rs:6:8
  |
6 |     if nombres.len() == 0 {
  |        ^^^^^^^^^^^^^^^^^^ help: using `is_empty` is clearer: `nombres.is_empty()`
  |
  = note: `#[warn(clippy::len_zero)]` on by default

warning: unneeded `return` statement
 --> src/main.rs:16:5
  |
16 |     return a + b;
  |     ^^^^^^^^^^^^^ help: remove `return`: `a + b`
```

clippy indique le fichier, la ligne, le problème et la correction suggérée.

---

### Étape 5 : Corriger selon les suggestions

Applique les deux suggestions de clippy :

```rust
fn main() {
    let nombres: Vec<i32> = Vec::new();

    // Correction : is_empty() au lieu de len() == 0
    if nombres.is_empty() {
        println!("La liste est vide");
    }

    let total = additionner(2, 3);
    println!("Total : {}", total);
}

fn additionner(a: i32, b: i32) -> i32 {
    // Correction : la dernière expression sert de valeur de retour
    a + b
}
```

Relance clippy :

```bash
cargo clippy
```

**Résultat attendu** :

```text
    Finished `dev` profile [unoptimized + debuginfo] target(s)
```

Plus aucun avertissement : le code est propre.

---

### Étape 6 : Échouer la compilation sur le moindre avertissement

En CI, on veut souvent qu'un simple avertissement fasse échouer la vérification. L'option `-D warnings` transforme tous les avertissements en erreurs.

```bash
# -- sépare les options de cargo de celles passées à clippy
# -D warnings transforme chaque warning en erreur
cargo clippy -- -D warnings
```

Si le code est propre, la commande réussit. S'il reste un avertissement, elle échoue avec un code d'erreur, ce qui arrête la CI.

---

### Étape 7 : Vérifier le formatage sans modifier

`rustfmt` peut signaler les fichiers mal formatés sans y toucher, grâce à `--check`. Saisis d'abord du code mal formaté dans `src/main.rs` (par exemple une ligne compacte) puis lance :

```bash
# --check liste les différences sans modifier les fichiers
cargo fmt --check
```

**Résultat attendu** (si le code est mal formaté) :

```text
Diff in /chemin/qualite-demo/src/main.rs at line 14:
-fn additionner(a:i32,b:i32)->i32{a+b}
+fn additionner(a: i32, b: i32) -> i32 {
+    a + b
+}
```

La commande échoue avec un code d'erreur tant qu'un fichier n'est pas conforme.

---

### Étape 8 : Formater automatiquement

```bash
# Réécrit tous les fichiers du projet au format standard
cargo fmt
```

Aucune sortie en cas de succès : les fichiers sont reformatés sur place. Relance `cargo fmt --check` pour confirmer :

```bash
cargo fmt --check
```

**Résultat attendu** : aucune sortie, et la commande réussit (le code est conforme).

---

### Étape 9 : Configurer rustfmt avec rustfmt.toml

Tu peux ajuster quelques options de formatage avec un fichier `rustfmt.toml` à la racine du projet. Crée-le :

```toml
# rustfmt.toml - Options de formatage du projet

# Largeur maximale d'une ligne (par défaut 100)
max_width = 100

# Nombre d'espaces par niveau d'indentation
tab_spaces = 4

# Utiliser des espaces, jamais des tabulations
hard_tabs = false
```

Relance `cargo fmt` : le formatage respecte désormais ces réglages. La plupart des projets gardent les valeurs par défaut et n'ajoutent ce fichier que pour des besoins précis.

---

### Étape 10 : Intégrer les vérifications en CI

Dans une intégration continue, on enchaîne formatage, lint et compilation. Voici un exemple de séquence à placer dans un script CI :

```bash
# 1. Vérifie le formatage sans modifier (échoue si non conforme)
cargo fmt --check

# 2. Lance clippy en mode strict (échoue au moindre avertissement)
cargo clippy -- -D warnings

# 3. Vérifie que le projet compile, plus rapide que build
cargo check

# 4. Lance les tests
cargo test
```

Si l'une de ces commandes échoue, la CI s'arrête et signale le problème. Cet ordre place les vérifications rapides (formatage, lint) avant les plus longues (tests).

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo clippy` | Analyse le code et affiche les suggestions |
| `cargo clippy -- -D warnings` | Échoue au moindre avertissement (CI) |
| `cargo fmt` | Formate tous les fichiers du projet |
| `cargo fmt --check` | Signale les fichiers mal formatés sans les modifier |
| `cargo check` | Vérifie la compilation sans produire de binaire |
| `cargo build` | Vérifie et produit le binaire |
| `rustup component add clippy rustfmt` | Installe les deux outils dans la toolchain |

---

## Pièges Fréquents

### Piège 1 : Confondre clippy et le compilateur

⚠️ **Problème** : Croire qu'un code sans avertissement clippy est forcément correct, ou qu'un code qui compile n'a rien à améliorer.

✅ **Solution** : `cargo build` vérifie que le code s'exécute ; `cargo clippy` vérifie qu'il est bien écrit. Lance les deux : ils ont des rôles différents et complémentaires.

---

### Piège 2 : Oublier le séparateur -- avant -D warnings

⚠️ **Problème** : Écrire `cargo clippy -D warnings` sans `--`. Cargo interprète alors `-D warnings` comme une option qui lui est destinée et renvoie une erreur.

✅ **Solution** : Le `--` sépare les options de cargo de celles transmises à clippy :

```bash
cargo clippy -- -D warnings
```

---

### Piège 3 : Lancer cargo fmt sans --check en CI

⚠️ **Problème** : En CI, utiliser `cargo fmt` (qui modifie les fichiers) au lieu de `cargo fmt --check`. La CI reformate dans son espace temporaire mais ne détecte pas que le code du dépôt est mal formaté.

✅ **Solution** : En CI, utilise toujours `cargo fmt --check`, qui échoue si un fichier n'est pas conforme sans rien modifier.

---

### Piège 4 : Désactiver des lints à tout-va

⚠️ **Problème** : Ajouter `#[allow(...)]` partout pour faire taire clippy au lieu de corriger le code. On perd alors tout le bénéfice du linter.

✅ **Solution** : Corrige le code signalé. Réserve `#[allow(...)]` aux rares cas où le choix est volontaire et justifié, et documente la raison par un commentaire.

---

## Checklist de Validation

- [ ] Je sais lancer `cargo clippy` et lire ses suggestions
- [ ] Je connais les principales catégories de lints
- [ ] Je sais désactiver un lint précis avec `#[allow(...)]`
- [ ] Je sais formater mon code avec `cargo fmt`
- [ ] Je sais vérifier le formatage sans modifier avec `cargo fmt --check`
- [ ] Je comprends la différence entre `cargo check` et `cargo build`
- [ ] Je sais enchaîner ces vérifications dans une CI

---

## Exercice Pratique

**Énoncé** : Pars d'un petit programme volontairement perfectible, puis nettoie-le entièrement avec clippy et rustfmt.

Code de départ (`src/main.rs`) :

```rust
fn main(){
let mots=vec!["bonjour","monde"];
if mots.len()==0{println!("aucun mot");}
for i in 0..mots.len(){println!("{}",mots[i]);}
}
```

Étapes à réaliser :

1. Lance `cargo clippy` et note chaque suggestion.
2. Corrige le code selon les suggestions (notamment la comparaison de longueur et la boucle par index).
3. Lance `cargo fmt` pour le formater.
4. Vérifie que `cargo clippy -- -D warnings` et `cargo fmt --check` réussissent tous les deux.

**Résultat attendu** : un programme propre, formaté, sans aucun avertissement clippy, qui affiche :

```text
bonjour
monde
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

clippy signale trois points : la comparaison `len() == 0`, la boucle par index (`for i in 0..mots.len()`) qui devrait itérer directement sur les éléments, et le formatage compact.

**Code corrigé et formaté (`src/main.rs`)** :

```rust
fn main() {
    let mots = vec!["bonjour", "monde"];

    // is_empty() au lieu de len() == 0
    if mots.is_empty() {
        println!("aucun mot");
    }

    // Itération directe sur les éléments au lieu d'un index
    for mot in &mots {
        println!("{}", mot);
    }
}
```

**Vérifications finales** :

```bash
# Aucun avertissement
cargo clippy -- -D warnings

# Formatage conforme
cargo fmt --check

# Exécution
cargo run
```

**Résultat attendu** :

```text
bonjour
monde
```

---

## Navigation

← Fiche précédente : **[Programmation Asynchrone](13-programmation-asynchrone.md)**

→ Fiche suivante : **[Workspaces Cargo (projets multi-crates)](15-workspaces-cargo.md)**
