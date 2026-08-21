---
tags:
  - Rust
  - Avancé
  - Pratique
description: "Programmation Asynchrone"
estimated_time: "70 min"
fiche_number: 13
total_fiches: 16
cursus: "Rust"
id: "fundamentals.rust.programmation-asynchrone"
course_id: "fundamentals.rust"
content_type: "lesson"
order: 13
---

# 13 - Programmation Asynchrone

> **En bref** : À la fin de cette fiche, tu sauras écrire du code asynchrone avec async/await, utiliser le runtime Tokio, et gérer des opérations concurrentes. Lecture estimée : 70 min.


## Prérequis

- Fiche **[08 - Gestion des erreurs](08-gestion-erreurs.md)**
- Fiche **[10 - Traits et génériques](10-traits-generiques.md)**
- Comprendre les closures (fonctions anonymes)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire du code asynchrone avec `async`/`await`, utiliser le runtime Tokio, et gérer des opérations concurrentes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la programmation asynchrone ?

**Définition** : La programmation asynchrone permet d'exécuter des opérations qui attendent (I/O, réseau) sans bloquer le programme.

**Le problème que l'asynchrone résout** :

Sans asynchrone (code synchrone), voici les problèmes :

1. **Blocage** : Pendant qu'on attend une réponse réseau, le programme est bloqué.
2. **Gaspillage** : Le CPU ne fait rien pendant l'attente.
3. **Scalabilité limitée** : Un thread par connexion = beaucoup de mémoire.

**Comment l'asynchrone résout ces problèmes** :

| Problème | Solution apportée par l'asynchrone |
| --- | --- |
| Blocage | Le programme continue d'autres tâches pendant l'attente |
| Gaspillage | Le CPU peut exécuter d'autres tâches |
| Scalabilité limitée | Des milliers de tâches sur peu de threads |

**Analogie concrète** : Dans un restaurant, un serveur synchrone attendrait à côté de la cuisine que chaque plat soit prêt. Un serveur asynchrone prend plusieurs commandes, les envoie en cuisine, et sert les plats quand ils sont prêts.

---

### async et await

| Mot-clé | Rôle |
| --- | --- |
| `async` | Marque une fonction comme asynchrone. Elle retourne un `Future` |
| `await` | Attend la complétion d'un `Future` |

**Analogie concrète** : `async` est comme passer une commande en ligne : tu remplis le formulaire (tu définis ce qu'il faut faire), mais rien n'est livré tout de suite. `.await` est le moment où tu attends le livreur devant ta porte : tu ne fais rien d'autre tant que le colis n'est pas arrivé, mais le reste de la maison continue de fonctionner.

**Syntaxe** :

```rust
async fn operation_async() -> String {
    // ...
}

// Appel
let resultat = operation_async().await;
```

---

### Qu'est-ce qu'un Future ?

**Définition** : Un `Future` est une valeur qui sera disponible plus tard. C'est une promesse de résultat.

**Analogie concrète** : Un `Future` est comme un ticket de retrait au pressing. Tu déposes ton vêtement, on te donne un ticket (le Future). Le vêtement n'est pas encore prêt. Quand tu reviens avec le ticket (`.await`), tu récupères le vêtement nettoyé. Sans revenir avec le ticket, ton vêtement reste au pressing.

**Important** : Un Future ne fait rien tant qu'il n'est pas `.await` ou exécuté par un runtime.

---

### Qu'est-ce qu'un runtime ?

**Définition** : Un runtime asynchrone exécute les Futures et gère la planification des tâches.

**Analogie concrète** : Le runtime est comme le chef d'orchestre d'un restaurant. Les serveurs (Futures) prennent des commandes et attendent les plats, mais c'est le chef d'orchestre qui décide quel serveur va chercher quel plat en cuisine et dans quel ordre. Sans chef d'orchestre (sans runtime), les serveurs restent plantés dans la salle sans savoir quoi faire.

**Rust n'a pas de runtime intégré**. Les plus populaires sont :

| Runtime | Usage | Caractéristiques |
| --- | --- | --- |
| Tokio | Production, serveurs web | Complet, performant |
| async-std | Alternative à Tokio (peu maintenu depuis 2021) | API similaire à std |
| smol | Projets légers, embarqué | Minimal, simple |

> **Note** : `async-std` est peu maintenu depuis 2021 (dernier release majeur en 2021). Pour les nouveaux projets, préfère **Tokio** (écosystème le plus actif) ou **smol** pour les contextes embarqués.

---

### Différence entre parallélisme et concurrence

| Concurrence | Parallélisme |
| --- | --- |
| Plusieurs tâches progressent | Plusieurs tâches s'exécutent simultanément |
| Peut utiliser un seul thread | Nécessite plusieurs threads/CPU |
| Entrelacement des tâches | Exécution réellement simultanée |

**L'asynchrone = concurrence**, pas nécessairement parallélisme.

---

## Étapes Pratiques

### Étape 1 : Configurer Tokio

**Cargo.toml** :

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

---

### Étape 2 : Premier programme asynchrone

```rust
use tokio::time::{sleep, Duration};

async fn dire_bonjour() {
    println!("Bonjour !");
}

async fn attendre_et_dire(message: &str, secondes: u64) {
    sleep(Duration::from_secs(secondes)).await;
    println!("{}", message);
}

#[tokio::main]
async fn main() {
    dire_bonjour().await;
    attendre_et_dire("Après 2 secondes", 2).await;
    println!("Fin du programme");
}
```

**Résultat attendu** :

```text
Bonjour !
Après 2 secondes
Fin du programme
```

**Explication** :

- `#[tokio::main]` transforme `main` en fonction asynchrone
- `sleep().await` attend sans bloquer le thread

---

### Étape 3 : Exécuter des tâches séquentiellement

```rust
use tokio::time::{sleep, Duration, Instant};

async fn tache(nom: &str, duree: u64) {
    println!("{} commence", nom);
    sleep(Duration::from_secs(duree)).await;
    println!("{} terminée", nom);
}

#[tokio::main]
async fn main() {
    let debut = Instant::now();

    // Séquentiel : une après l'autre
    tache("Tâche 1", 2).await;
    tache("Tâche 2", 2).await;
    tache("Tâche 3", 2).await;

    println!("Durée totale : {:?}", debut.elapsed());
}
```

**Résultat attendu** :

```text
Tâche 1 commence
Tâche 1 terminée
Tâche 2 commence
Tâche 2 terminée
Tâche 3 commence
Tâche 3 terminée
Durée totale : 6.00s
```

---

### Étape 4 : Exécuter des tâches en parallèle avec join

```rust
use tokio::time::{sleep, Duration, Instant};

async fn tache(nom: &str, duree: u64) -> String {
    println!("{} commence", nom);
    sleep(Duration::from_secs(duree)).await;
    println!("{} terminée", nom);
    format!("{} OK", nom)
}

#[tokio::main]
async fn main() {
    let debut = Instant::now();

    // Parallèle : toutes en même temps
    let (r1, r2, r3) = tokio::join!(
        tache("Tâche 1", 2),
        tache("Tâche 2", 2),
        tache("Tâche 3", 2)
    );

    println!("Résultats : {}, {}, {}", r1, r2, r3);
    println!("Durée totale : {:?}", debut.elapsed());
}
```

**Résultat attendu** :

```text
Tâche 1 commence
Tâche 2 commence
Tâche 3 commence
Tâche 1 terminée
Tâche 2 terminée
Tâche 3 terminée
Résultats : Tâche 1 OK, Tâche 2 OK, Tâche 3 OK
Durée totale : 2.00s
```

**Note** : Les trois tâches s'exécutent en parallèle, donc 2 secondes au total au lieu de 6.

---

### Étape 5 : Créer des tâches avec spawn

```rust
use tokio::time::{sleep, Duration};

async fn tache_longue(id: u32) -> u32 {
    println!("Tâche {} démarre", id);
    sleep(Duration::from_secs(2)).await;
    println!("Tâche {} terminée", id);
    id * 10
}

#[tokio::main]
async fn main() {
    // spawn crée une tâche qui s'exécute en arrière-plan
    let handle1 = tokio::spawn(tache_longue(1));
    let handle2 = tokio::spawn(tache_longue(2));
    let handle3 = tokio::spawn(tache_longue(3));

    // Faire autre chose pendant que les tâches s'exécutent
    println!("Tâches lancées, on fait autre chose...");
    sleep(Duration::from_millis(500)).await;
    println!("Autre chose fait !");

    // Attendre les résultats
    let r1 = handle1.await.unwrap();
    let r2 = handle2.await.unwrap();
    let r3 = handle3.await.unwrap();

    println!("Résultats : {}, {}, {}", r1, r2, r3);
}
```

**Résultat attendu** :

```text
Tâches lancées, on fait autre chose...
Tâche 1 démarre
Tâche 2 démarre
Tâche 3 démarre
Autre chose fait !
Tâche 1 terminée
Tâche 2 terminée
Tâche 3 terminée
Résultats : 10, 20, 30
```

---

### Étape 6 : Gérer les erreurs avec Result

```rust
use tokio::time::{sleep, Duration};

async fn operation_qui_peut_echouer(reussir: bool) -> Result<String, String> {
    sleep(Duration::from_secs(1)).await;

    if reussir {
        Ok(String::from("Succès !"))
    } else {
        Err(String::from("Échec !"))
    }
}

#[tokio::main]
async fn main() {
    let resultat1 = operation_qui_peut_echouer(true).await;
    let resultat2 = operation_qui_peut_echouer(false).await;

    match resultat1 {
        Ok(msg) => println!("Opération 1 : {}", msg),
        Err(e) => println!("Opération 1 erreur : {}", e),
    }

    match resultat2 {
        Ok(msg) => println!("Opération 2 : {}", msg),
        Err(e) => println!("Opération 2 erreur : {}", e),
    }
}
```

**Résultat attendu** :

```text
Opération 1 : Succès !
Opération 2 erreur : Échec !
```

---

### Étape 7 : select! pour la première tâche complétée

```rust
use tokio::time::{sleep, Duration};

async fn tache_rapide() -> &'static str {
    sleep(Duration::from_secs(1)).await;
    "Tâche rapide"
}

async fn tache_lente() -> &'static str {
    sleep(Duration::from_secs(5)).await;
    "Tâche lente"
}

#[tokio::main]
async fn main() {
    // select! retourne dès que l'une des tâches est complétée
    tokio::select! {
        resultat = tache_rapide() => {
            println!("Première terminée : {}", resultat);
        }
        resultat = tache_lente() => {
            println!("Première terminée : {}", resultat);
        }
    }

    println!("Fin");
}
```

**Résultat attendu** :

```text
Première terminée : Tâche rapide
Fin
```

**Note** : La tâche lente est annulée quand la rapide termine.

---

### Étape 8 : Timeout

```rust
use tokio::time::{sleep, Duration, timeout};

async fn operation_lente() -> String {
    sleep(Duration::from_secs(5)).await;
    String::from("Terminé")
}

#[tokio::main]
async fn main() {
    // Timeout de 2 secondes
    let resultat = timeout(Duration::from_secs(2), operation_lente()).await;

    match resultat {
        Ok(valeur) => println!("Succès : {}", valeur),
        Err(_) => println!("Timeout ! L'opération a pris trop de temps"),
    }
}
```

**Résultat attendu** :

```text
Timeout ! L'opération a pris trop de temps
```

---

### Étape 9 : Lire un fichier de façon asynchrone

```rust
use tokio::fs::File;
use tokio::io::AsyncReadExt;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Crée un fichier de test
    tokio::fs::write("test.txt", "Contenu du fichier").await?;

    // Lecture asynchrone
    let mut fichier = File::open("test.txt").await?;
    let mut contenu = String::new();
    fichier.read_to_string(&mut contenu).await?;

    println!("Contenu : {}", contenu);

    // Nettoyage
    tokio::fs::remove_file("test.txt").await?;

    Ok(())
}
```

**Résultat attendu** :

```text
Contenu : Contenu du fichier
```

---

### Étape 10 : Requête HTTP asynchrone avec reqwest

**Cargo.toml** :

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
reqwest = { version = "0.11", features = ["json"] }
```

```rust
use reqwest;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Requête GET asynchrone
    let response = reqwest::get("https://httpbin.org/get").await?;

    println!("Status : {}", response.status());
    println!("Headers : {:?}", response.headers());

    let body = response.text().await?;
    println!("Corps (premiers 200 caractères) : {}...", &body[..200.min(body.len())]);

    Ok(())
}
```

---

### Étape 11 : Canaux asynchrones (channels)

```rust
use tokio::sync::mpsc;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    // Crée un canal avec une capacité de 32 messages
    let (tx, mut rx) = mpsc::channel::<String>(32);

    // Tâche productrice
    let producteur = tokio::spawn(async move {
        for i in 1..=5 {
            let message = format!("Message {}", i);
            println!("Envoi : {}", message);
            tx.send(message).await.unwrap();
            sleep(Duration::from_millis(500)).await;
        }
    });

    // Tâche consommatrice
    let consommateur = tokio::spawn(async move {
        while let Some(message) = rx.recv().await {
            println!("Reçu : {}", message);
        }
        println!("Canal fermé");
    });

    // Attendre les deux tâches
    let _ = tokio::join!(producteur, consommateur);
}
```

**Résultat attendu** :

```text
Envoi : Message 1
Reçu : Message 1
Envoi : Message 2
Reçu : Message 2
Envoi : Message 3
Reçu : Message 3
Envoi : Message 4
Reçu : Message 4
Envoi : Message 5
Reçu : Message 5
Canal fermé
```

---

### Étape 12 : Mutex asynchrone

```rust
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    // Compteur partagé protégé par un Mutex
    let compteur = Arc::new(Mutex::new(0));

    let mut handles = vec![];

    for i in 1..=5 {
        let compteur_clone = Arc::clone(&compteur);

        let handle = tokio::spawn(async move {
            sleep(Duration::from_millis(100 * i as u64)).await;

            // Verrouille le mutex, incrémente, déverrouille
            let mut valeur = compteur_clone.lock().await;
            *valeur += 1;
            println!("Tâche {} : compteur = {}", i, *valeur);
        });

        handles.push(handle);
    }

    // Attendre toutes les tâches
    for handle in handles {
        handle.await.unwrap();
    }

    println!("Valeur finale : {}", *compteur.lock().await);
}
```

**Résultat attendu** :

```text
Tâche 1 : compteur = 1
Tâche 2 : compteur = 2
Tâche 3 : compteur = 3
Tâche 4 : compteur = 4
Tâche 5 : compteur = 5
Valeur finale : 5
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cargo run` | Compile et exécute le programme |
| `cargo build --release` | Compile en mode optimisé |

---

## Pièges Fréquents

### Piège 1 : Oublier .await

**Problème** : Le Future n'est jamais exécuté.

```rust
async fn faire_quelque_chose() { }

async fn main() {
    faire_quelque_chose();      // Rien ne se passe !
}
```

**Solution** : Ajoute `.await` :

```rust
faire_quelque_chose().await;
```

---

### Piège 2 : Bloquer le runtime avec du code synchrone

**Problème** : `std::thread::sleep` bloque le thread.

```rust
async fn mauvais() {
    std::thread::sleep(Duration::from_secs(5));     // Bloque tout !
}
```

**Solution** : Utilise `tokio::time::sleep` :

```rust
async fn bon() {
    tokio::time::sleep(Duration::from_secs(5)).await;
}
```

---

### Piège 3 : Oublier #[tokio::main]

**Problème** : `main` doit être async, mais Rust ne permet pas de déclarer `main` comme `async fn main()` sans macro.

**Solution** : Utilise `#[tokio::main]` ou crée le runtime manuellement.

---

### Piège 4 : spawn avec des références

**Problème** : Les tâches spawn ne peuvent pas emprunter de données.

```rust
let data = String::from("test");
tokio::spawn(async {
    println!("{}", data);       // Erreur : data n'a pas 'static lifetime
});
```

**Solution** : Move la donnée ou utilise `Arc` :

```rust
let data = String::from("test");
tokio::spawn(async move {
    println!("{}", data);       // OK : data est moved
});
```

---

## Checklist de Validation

- [ ] Je sais configurer Tokio dans Cargo.toml
- [ ] Je sais écrire une fonction async
- [ ] Je sais utiliser .await pour attendre un Future
- [ ] Je sais utiliser tokio::join! pour le parallélisme
- [ ] Je sais utiliser tokio::spawn pour créer des tâches
- [ ] Je sais utiliser tokio::select! pour la première complétion
- [ ] Je sais gérer les timeouts
- [ ] Je comprends la différence entre concurrence et parallélisme

---

## Exercice Pratique

**Énoncé** : Crée un programme qui :

1. Lance 3 "téléchargements" simulés en parallèle (sleep de durées différentes)
2. Affiche le temps de début et de fin de chaque téléchargement
3. Affiche le temps total d'exécution

Les téléchargements doivent avoir des durées de 1, 2 et 3 secondes.

**Résultat attendu** (temps approximatifs) :

```text
Téléchargement A (1s) démarre
Téléchargement B (2s) démarre
Téléchargement C (3s) démarre
Téléchargement A terminé après 1.00s
Téléchargement B terminé après 2.00s
Téléchargement C terminé après 3.00s
Temps total : 3.00s
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```rust
use tokio::time::{sleep, Duration, Instant};

async fn telecharger(nom: &str, duree_secs: u64, debut_global: Instant) {
    println!("Téléchargement {} ({}s) démarre", nom, duree_secs);
    sleep(Duration::from_secs(duree_secs)).await;
    println!(
        "Téléchargement {} terminé après {:.2}s",
        nom,
        debut_global.elapsed().as_secs_f64()
    );
}

#[tokio::main]
async fn main() {
    let debut = Instant::now();

    // Lance les 3 téléchargements en parallèle
    tokio::join!(
        telecharger("A", 1, debut),
        telecharger("B", 2, debut),
        telecharger("C", 3, debut)
    );

    println!("Temps total : {:.2}s", debut.elapsed().as_secs_f64());
}
```

---

## Conclusion

Tu as maintenant une base solide en Rust, couvrant :

- Les fondamentaux (variables, types, fonctions)
- Le système d'ownership et de borrowing
- Les structures de données (structs, enums)
- La gestion d'erreurs
- Les collections
- Les traits et génériques
- L'organisation du code en modules
- Les tests
- La programmation asynchrone

La fiche suivante présente les outils de qualité qui accompagnent ton travail au quotidien : le linter `clippy` et le formateur `rustfmt`. Continue ensuite à pratiquer et consulte la documentation officielle de Rust (doc.rust-lang.org) pour approfondir ces sujets.

---

## Navigation

← Fiche précédente : **[Tests](12-tests.md)**

→ Fiche suivante : **[Outils de qualité : clippy et rustfmt](14-outils-qualite.md)**
