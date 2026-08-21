---
tags:
  - Rust
  - Avancé
  - Pratique
description: "Tests"
estimated_time: "65 min"
fiche_number: 12
total_fiches: 16
cursus: "Rust"
id: "fundamentals.rust.tests"
course_id: "fundamentals.rust"
content_type: "lesson"
order: 12
---

# 12 - Tests

> **En bref** : À la fin de cette fiche, tu sauras écrire des tests unitaires, des tests d'intégration, et utiliser les assertions pour valider ton code. Lecture estimée : 65 min.


## Prérequis

- Fiche **[08 - Gestion des erreurs](08-gestion-erreurs.md)** (Result, panic)
- Fiche **[11 - Modules et organisation du code](11-modules-organisation.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des tests unitaires, des tests d'intégration, et utiliser les assertions pour valider ton code.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un test ?

**Définition** : Un test est une fonction qui vérifie qu'une partie du code fonctionne comme attendu. Il exécute du code et vérifie le résultat.

**Le problème que les tests résolvent** :

Sans tests, voici les problèmes rencontrés :

1. **Régressions** : Une modification casse du code qui fonctionnait.
2. **Refactoring risqué** : Tu n'oses pas améliorer le code de peur de tout casser.
3. **Documentation manquante** : Difficile de comprendre comment utiliser une fonction.

**Comment les tests résolvent ces problèmes** :

| Problème | Solution apportée par les tests |
| --- | --- |
| Régressions | Les tests détectent immédiatement les problèmes |
| Refactoring risqué | Tu peux modifier en confiance si les tests passent |
| Documentation manquante | Les tests montrent des exemples d'utilisation |

**Analogie concrète** : Les tests sont comme une checklist de vérification avant le décollage d'un avion. Chaque item (test) vérifie qu'un système fonctionne correctement.

---

### Types de tests en Rust

| Type | Emplacement | But |
| --- | --- | --- |
| Tests unitaires | Dans le même fichier que le code | Tester une fonction/module isolément |
| Tests d'intégration | Dossier `tests/` | Tester l'API publique comme un utilisateur |
| Tests de documentation | Dans les commentaires `///` | Vérifier que les exemples fonctionnent |

---

### Les macros d'assertion

| Macro | Usage | Exemple |
| --- | --- | --- |
| `assert!` | Vérifie qu'une expression est vraie | `assert!(x > 0)` |
| `assert_eq!` | Vérifie l'égalité de deux valeurs | `assert_eq!(2 + 2, 4)` |
| `assert_ne!` | Vérifie l'inégalité de deux valeurs | `assert_ne!(x, y)` |

**Note** : Si l'assertion échoue, le test panic et est marqué comme échoué.

---

### L'attribut #[test]

**Définition** : `#[test]` marque une fonction comme étant un test. Cargo exécute ces fonctions avec `cargo test`.

```rust
#[test]
fn mon_test() {
    assert_eq!(2 + 2, 4);
}
```

---

### L'attribut #[cfg(test)]

**Définition** : `#[cfg(test)]` indique que le code ne doit être compilé que pendant les tests.

```rust
#[cfg(test)]
mod tests {
    // Ce module n'existe que pendant cargo test
}
```

---

## Étapes Pratiques

### Étape 1 : Premier test

```rust
fn addition(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;       // Importe les fonctions du module parent

    #[test]
    fn test_addition() {
        let resultat = addition(2, 3);
        assert_eq!(resultat, 5);
    }
}
```

**Exécution** :

```bash
cargo test
```

**Résultat attendu** :

```text
running 1 test
test tests::test_addition ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out
```

---

### Étape 2 : Test qui échoue

```rust
fn addition(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_qui_echoue() {
        let resultat = addition(2, 3);
        assert_eq!(resultat, 6);    // Faux ! 2 + 3 = 5, pas 6
    }
}
```

**Résultat attendu** :

```text
running 1 test
test tests::test_qui_echoue ... FAILED

failures:

---- tests::test_qui_echoue stdout ----
thread 'tests::test_qui_echoue' panicked at 'assertion failed: `(left == right)`
  left: `5`,
 right: `6`', src/main.rs:12:9

failures:
    tests::test_qui_echoue

test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out
```

---

### Étape 3 : Message personnalisé dans les assertions

```rust
fn division(a: i32, b: i32) -> i32 {
    a / b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_division() {
        let resultat = division(10, 2);
        assert_eq!(
            resultat, 5,
            "La division de 10 par 2 devrait être 5, mais on a obtenu {}", resultat
        );
    }
}
```

---

### Étape 4 : Utiliser assert

```rust
fn est_pair(n: i32) -> bool {
    n % 2 == 0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_est_pair() {
        assert!(est_pair(4), "4 devrait être pair");
        assert!(!est_pair(3), "3 ne devrait pas être pair");
    }
}
```

---

### Étape 5 : Tester qu'une fonction panic

```rust
fn division(a: i32, b: i32) -> i32 {
    if b == 0 {
        panic!("Division par zéro !");
    }
    a / b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic]
    fn test_division_par_zero() {
        division(10, 0);    // Doit provoquer un panic
    }

    #[test]
    #[should_panic(expected = "Division par zéro")]
    fn test_message_panic() {
        division(10, 0);    // Vérifie aussi le message
    }
}
```

---

### Étape 6 : Tester avec Result

```rust
fn parser(s: &str) -> Result<i32, std::num::ParseIntError> {
    s.parse()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parser_valide() -> Result<(), std::num::ParseIntError> {
        let nombre = parser("42")?;
        assert_eq!(nombre, 42);
        Ok(())
    }

    #[test]
    fn test_parser_invalide() {
        let resultat = parser("pas un nombre");
        assert!(resultat.is_err());
    }
}
```

---

### Étape 7 : Ignorer un test

```rust
#[cfg(test)]
mod tests {
    #[test]
    #[ignore]
    fn test_lent() {
        // Test qui prend beaucoup de temps
        std::thread::sleep(std::time::Duration::from_secs(10));
    }

    #[test]
    fn test_rapide() {
        assert_eq!(2 + 2, 4);
    }
}
```

**Exécution** :

```bash
# Exécute seulement les tests non ignorés
cargo test

# Exécute aussi les tests ignorés
cargo test -- --ignored

# Exécute TOUS les tests (normaux + ignorés)
cargo test -- --include-ignored
```

---

### Étape 8 : Exécuter des tests spécifiques

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn test_addition() {
        assert_eq!(2 + 2, 4);
    }

    #[test]
    fn test_soustraction() {
        assert_eq!(5 - 3, 2);
    }

    #[test]
    fn test_multiplication() {
        assert_eq!(3 * 4, 12);
    }
}
```

**Commandes** :

```bash
# Exécute tous les tests
cargo test

# Exécute seulement test_addition
cargo test test_addition

# Exécute tous les tests qui contiennent "test_"
cargo test test_

# Exécute les tests du module "tests"
cargo test tests::
```

---

### Étape 9 : Tester du code privé

```rust
fn fonction_publique(x: i32) -> i32 {
    fonction_privee(x) * 2
}

fn fonction_privee(x: i32) -> i32 {
    x + 1
}

#[cfg(test)]
mod tests {
    use super::*;

    // On peut tester les fonctions privées !
    #[test]
    fn test_fonction_privee() {
        assert_eq!(fonction_privee(5), 6);
    }

    #[test]
    fn test_fonction_publique() {
        assert_eq!(fonction_publique(5), 12);   // (5 + 1) * 2 = 12
    }
}
```

---

### Étape 10 : Tests d'intégration

**Structure du projet** :

```text
mon-projet/
├── Cargo.toml
├── src/
│   └── lib.rs
└── tests/
    └── integration_test.rs
```

**src/lib.rs** :

```rust
pub fn addition(a: i32, b: i32) -> i32 {
    a + b
}

pub fn multiplication(a: i32, b: i32) -> i32 {
    a * b
}
```

**tests/integration_test.rs** :

```rust
// Les tests d'intégration importent ta crate comme un utilisateur
use mon_projet::*;

#[test]
fn test_addition_integration() {
    assert_eq!(addition(10, 20), 30);
}

#[test]
fn test_operations_combinees() {
    let a = addition(5, 5);
    let b = multiplication(a, 2);
    assert_eq!(b, 20);
}
```

**Note** : Les tests d'intégration ne peuvent accéder qu'à l'API publique.

---

### Étape 11 : Tests de documentation

```rust
/// Additionne deux nombres.
///
/// # Exemples
///
/// ```
/// use mon_projet::addition;
/// let resultat = addition(2, 3);
/// assert_eq!(resultat, 5);
/// ```
pub fn addition(a: i32, b: i32) -> i32 {
    a + b
}
```

**Exécution** :

```bash
cargo test --doc
```

Les exemples dans la documentation sont compilés et exécutés comme des tests.

---

### Étape 12 : Organiser les tests d'intégration

**Structure** :

```text
tests/
├── common/
│   └── mod.rs          # Code partagé entre les tests
├── test_addition.rs
└── test_multiplication.rs
```

**tests/common/mod.rs** :

```rust
pub fn setup() {
    // Initialisation commune
    println!("Setup exécuté");
}
```

**tests/test_addition.rs** :

```rust
mod common;

use mon_projet::addition;

#[test]
fn test_avec_setup() {
    common::setup();
    assert_eq!(addition(1, 1), 2);
}
```

---

### Étape 13 : Afficher les sorties pendant les tests

```rust
fn greet(name: &str) -> String {
    println!("Création du message pour {}", name);    // Caché par défaut (visible avec --nocapture)
    format!("Hello, {}!", name)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_greet() {
        let message = greet("Alice");
        assert_eq!(message, "Hello, Alice!");
    }
}
```

**Exécution** :

```bash
# Par défaut, les println! sont cachés pour les tests qui passent
cargo test

# Pour voir les sorties :
cargo test -- --nocapture
```

---

### Étape 14 : Tests avec des données de test

```rust
struct Calculatrice {
    memoire: i32,
}

impl Calculatrice {
    fn new() -> Calculatrice {
        Calculatrice { memoire: 0 }
    }

    fn ajouter(&mut self, n: i32) {
        self.memoire += n;
    }

    fn resultat(&self) -> i32 {
        self.memoire
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    // Fonction helper pour créer une calculatrice initialisée
    fn setup_calculatrice() -> Calculatrice {
        let mut calc = Calculatrice::new();
        calc.ajouter(10);
        calc
    }

    #[test]
    fn test_ajouter() {
        let mut calc = setup_calculatrice();
        calc.ajouter(5);
        assert_eq!(calc.resultat(), 15);
    }

    #[test]
    fn test_memoire_initiale() {
        let calc = Calculatrice::new();
        assert_eq!(calc.resultat(), 0);
    }
}
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo test` | Exécute tous les tests |
| `cargo test nom_test` | Exécute les tests qui contiennent "nom_test" |
| `cargo test -- --nocapture` | Affiche les println! |
| `cargo test -- --ignored` | Exécute les tests ignorés |
| `cargo test -- --test-threads=1` | Exécute les tests en séquentiel |
| `cargo test --doc` | Exécute seulement les tests de documentation |

---

## Pièges Fréquents

### Piège 1 : Oublier use super::*

**Problème** : Les fonctions du module parent ne sont pas accessibles.

```rust
#[cfg(test)]
mod tests {
    #[test]
    fn test() {
        addition(1, 2);     // Erreur : addition non trouvé
    }
}
```

**Solution** : Ajoute `use super::*;`

---

### Piège 2 : Tests qui dépendent les uns des autres

**Problème** : Les tests s'exécutent en parallèle et dans un ordre aléatoire.

**Solution** : Chaque test doit être indépendant. Utilise des fonctions de setup.

---

### Piège 3 : Tester l'API privée dans les tests d'intégration

**Problème** : Les tests d'intégration ne peuvent pas accéder aux fonctions privées.

**Solution** : Mets les tests de fonctions privées dans le module `#[cfg(test)]` du même fichier.

---

### Piège 4 : assert_eq! avec des types qui n'implémentent pas Debug

**Problème** : `assert_eq!` a besoin de `Debug` pour afficher les valeurs en cas d'échec.

**Solution** : Ajoute `#[derive(Debug)]` à ta struct.

---

## Checklist de Validation

- [ ] Je sais écrire un test avec `#[test]`
- [ ] Je sais utiliser `assert!`, `assert_eq!`, `assert_ne!`
- [ ] Je sais tester qu'une fonction panic avec `#[should_panic]`
- [ ] Je sais écrire un test qui retourne `Result`
- [ ] Je sais ignorer un test avec `#[ignore]`
- [ ] Je sais exécuter des tests spécifiques
- [ ] Je sais créer des tests d'intégration dans le dossier `tests/`
- [ ] Je sais écrire des tests de documentation

---

## Exercice Pratique

**Énoncé** : Crée un module `banque` avec :

1. Une struct `CompteBancaire` avec un solde
2. Une méthode `deposer(montant)` qui ajoute au solde
3. Une méthode `retirer(montant) -> Result<(), String>` qui retire si le solde le permet
4. Des tests pour chaque cas :
   - Dépôt normal
   - Retrait normal
   - Retrait avec solde insuffisant (doit retourner `Err`)

**Résultat attendu** (cargo test) :

```text
running 3 tests
test tests::test_depot ... ok
test tests::test_retrait ... ok
test tests::test_retrait_insuffisant ... ok
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```rust
struct CompteBancaire {
    solde: f64,
}

impl CompteBancaire {
    fn new(solde_initial: f64) -> CompteBancaire {
        CompteBancaire { solde: solde_initial }
    }

    fn deposer(&mut self, montant: f64) {
        self.solde += montant;
    }

    fn retirer(&mut self, montant: f64) -> Result<(), String> {
        if montant > self.solde {
            Err(String::from("Solde insuffisant"))
        } else {
            self.solde -= montant;
            Ok(())
        }
    }

    fn solde(&self) -> f64 {
        self.solde
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_depot() {
        let mut compte = CompteBancaire::new(100.0);
        compte.deposer(50.0);
        assert_eq!(compte.solde(), 150.0);
    }

    #[test]
    fn test_retrait() {
        let mut compte = CompteBancaire::new(100.0);
        let resultat = compte.retirer(30.0);
        assert!(resultat.is_ok());
        assert_eq!(compte.solde(), 70.0);
    }

    #[test]
    fn test_retrait_insuffisant() {
        let mut compte = CompteBancaire::new(100.0);
        let resultat = compte.retirer(150.0);
        assert!(resultat.is_err());
        assert_eq!(resultat.unwrap_err(), "Solde insuffisant");
        assert_eq!(compte.solde(), 100.0);  // Le solde n'a pas changé
    }
}

fn main() {
    println!("Exécute 'cargo test' pour lancer les tests");
}
```

---

## Navigation

← Fiche précédente : **[Modules et Organisation du Code](11-modules-organisation.md)**

→ Fiche suivante : **[Programmation Asynchrone](13-programmation-asynchrone.md)**
