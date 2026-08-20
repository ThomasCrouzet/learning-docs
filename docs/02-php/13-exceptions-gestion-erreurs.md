---
tags:
  - PHP
  - Avancé
  - Pratique
description: "Les exceptions et la gestion d'erreurs"
estimated_time: "55 min"
fiche_number: 13
total_fiches: 14
cursus: "PHP"
---

# 13 - Les exceptions et la gestion d'erreurs

> **En bref** : À la fin de cette fiche, tu sauras gérer les erreurs en PHP avec les exceptions : attraper une exception, en lancer une, créer des exceptions personnalisées, et mettre en place une gestion d'erreurs robuste dans tes projets. Lecture estimée : 55 min.


## Prérequis

- Fiche **[08 - Les classes en détail](08-classes-en-detail.md)**
- Savoir créer des classes avec des propriétés, des méthodes et de l'héritage
- Comprendre la visibilité (`public`, `private`, `protected`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras gérer les erreurs en PHP avec les exceptions : attraper une exception, en lancer une, créer des exceptions personnalisées, et mettre en place une gestion d'erreurs robuste dans tes projets.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une exception ?

**Définition** : Une exception est un objet qui représente une erreur survenue pendant l'exécution d'un programme. Quand une erreur se produit, PHP "lance" (throw) une exception. Tu peux ensuite "attraper" (catch) cette exception pour la traiter au lieu de laisser le programme planter.

**Le problème que les exceptions résolvent** :

Sans exceptions, voici les problèmes rencontrés :

1. **Arrêt brutal** : Une erreur non gérée arrête le programme avec un message cryptique.

2. **Vérifications manuelles** : Tu dois tester chaque valeur de retour pour détecter les erreurs, ce qui alourdit le code.

3. **Propagation difficile** : Si une erreur se produit dans une fonction appelée par une autre fonction, tu dois manuellement transmettre l'erreur à chaque niveau.

**Comment les exceptions résolvent ces problèmes** :

| Problème | Solution apportée par les exceptions |
| -------- | ------------------------------------ |
| Arrêt brutal | Le bloc `catch` intercepte l'erreur et exécute un traitement alternatif |
| Vérifications manuelles | L'exception remonte automatiquement la pile d'appels |
| Propagation difficile | L'exception traverse les fonctions jusqu'au premier `catch` |

**Analogie concrète** : Imagine une chaîne de production dans une usine. Si une machine détecte un défaut, elle active une alarme (throw). Le superviseur le plus proche (catch) peut alors décider : corriger le défaut, mettre la pièce de côté, ou arrêter la chaîne. Sans alarme, la pièce défectueuse passerait inaperçue et contaminerait le reste de la production.

**Ce qu'une exception n'est PAS** :

- Une exception n'est pas un `echo` ou un `die()`. Elle est un objet structuré avec un message, un code et une trace d'appels.
- Une exception n'est pas toujours fatale. Tu peux l'attraper, la traiter et continuer l'exécution du programme.

---

### Erreurs PHP vs Exceptions

PHP possède deux systèmes de gestion d'erreurs :

1. **Les erreurs (Error)** : Erreurs internes de PHP (division par zéro, type incorrect, mémoire insuffisante).
2. **Les exceptions (Exception)** : Erreurs métier lancées par le développeur ou les bibliothèques.

**Depuis PHP 7**, les deux implémentent l'interface `Throwable` :

```text
Throwable (interface)
├── Error (erreurs internes PHP)
│   ├── TypeError
│   ├── DivisionByZeroError
│   ├── ArgumentCountError
│   └── ...
└── Exception (erreurs métier)
    ├── RuntimeException
    │   ├── OverflowException
    │   ├── UnderflowException
    │   └── OutOfBoundsException
    ├── LogicException
    │   ├── DomainException
    │   ├── InvalidArgumentException
    │   ├── LengthException
    │   ├── BadMethodCallException
    │   └── OutOfRangeException
    └── ...
```

Le diagramme suivant représente cette hiérarchie sous forme visuelle :

<div class="diagram-design">
<p><a href="../../diagrams/02-php-13-exceptions-gestion-erreurs-1.html">Erreurs PHP vs Exceptions (HTML + SVG)</a></p>
<iframe src="../../diagrams/02-php-13-exceptions-gestion-erreurs-1.html" title="Erreurs PHP vs Exceptions" style="width:100%;min-height:532px;border:0;background:transparent"></iframe>
</div>

- `Throwable` est l'interface racine commune aux erreurs et aux exceptions
- `Error` regroupe les erreurs internes de PHP (TypeError, ParseError)
- `Exception` regroupe les erreurs métier que tu lances dans ton code

**Comparaison Error vs Exception** :

| Error | Exception |
| ----- | --------- |
| Lancée par PHP lui-même | Lancée par le développeur ou les bibliothèques |
| Erreur grave (souvent non récupérable) | Erreur métier (récupérable) |
| TypeError, DivisionByZeroError | RuntimeException, InvalidArgumentException |
| Attraper uniquement si nécessaire | Attraper systématiquement dans le code métier |

---

### Le bloc try/catch/finally

**Définition** : `try/catch` est la structure qui permet d'attraper une exception. `finally` exécute du code dans tous les cas, qu'il y ait eu une exception ou non.

**Syntaxe** :

```php
<?php

try {
    // Code qui peut lancer une exception
    $resultat = faireQuelqueChose();
} catch (\Exception $e) {
    // Code exécuté si une exception est lancée
    echo "Erreur : " . $e->getMessage();
} finally {
    // Code exécuté dans tous les cas (optionnel)
    echo "Nettoyage terminé.";
}
```

**Les méthodes de l'objet Exception** :

| Méthode | Description | Exemple de retour |
| ------- | ----------- | ----------------- |
| `getMessage()` | Le message d'erreur | `"Fichier non trouvé"` |
| `getCode()` | Le code d'erreur | `404` |
| `getFile()` | Le fichier où l'erreur s'est produite | `"/app/src/Service.php"` |
| `getLine()` | La ligne de l'erreur | `42` |
| `getTrace()` | La pile d'appels (tableau) | `[...]` |
| `getTraceAsString()` | La pile d'appels (texte) | `"#0 /app/src/..."` |
| `getPrevious()` | L'exception précédente (chaînage) | `Exception` ou `null` |

---

### Le bloc catch multiple

**Définition** : Tu peux attraper différents types d'exceptions avec plusieurs blocs `catch`.

```php
<?php

try {
    $resultat = traiterDonnees($input);
} catch (\InvalidArgumentException $e) {
    // Erreur de paramètre
    echo "Paramètre invalide : " . $e->getMessage();
} catch (\RuntimeException $e) {
    // Erreur d'exécution
    echo "Erreur d'exécution : " . $e->getMessage();
} catch (\Exception $e) {
    // Toute autre exception
    echo "Erreur inattendue : " . $e->getMessage();
}
```

**Règle importante** : Place les exceptions les plus spécifiques en premier, les plus générales en dernier. PHP teste les `catch` dans l'ordre. Si tu mets `\Exception` en premier, les autres `catch` ne seront jamais atteints.

**Depuis PHP 7.1**, tu peux aussi combiner des types dans un seul catch :

```php
<?php

try {
    $resultat = traiterDonnees($input);
} catch (\InvalidArgumentException | \RangeException $e) {
    // Attrape InvalidArgumentException OU RangeException
    echo "Erreur de validation : " . $e->getMessage();
}
```

---

### Lancer une exception (throw)

**Définition** : Le mot-clé `throw` permet de lancer une exception. Le programme arrête immédiatement l'exécution du code en cours et remonte la pile d'appels jusqu'au premier `catch`.

```php
<?php

function diviser(float $a, float $b): float
{
    if ($b === 0.0) {
        // On lance une exception au lieu de retourner une valeur incorrecte
        throw new \InvalidArgumentException("Division par zéro impossible");
    }

    return $a / $b;
}
```

**Quand lancer une exception** :

| Situation | Type d'exception recommandé |
| --------- | --------------------------- |
| Paramètre invalide | `\InvalidArgumentException` |
| Opération impossible dans l'état actuel | `\RuntimeException` |
| Violation d'une règle métier | `\LogicException` ou exception personnalisée |
| Ressource introuvable | `\RuntimeException` ou exception personnalisée |
| Méthode non implémentée | `\BadMethodCallException` |

---

### Les exceptions personnalisées

**Définition** : Une exception personnalisée est une classe qui hérite de `\Exception` (ou d'une de ses sous-classes). Elle permet de créer des types d'erreurs spécifiques à ton application.

```php
<?php

namespace App\Exception;

class ProduitIndisponibleException extends \RuntimeException
{
    private string $nomProduit;

    public function __construct(string $nomProduit, int $code = 0, ?\Throwable $previous = null)
    {
        $this->nomProduit = $nomProduit;

        // On appelle le constructeur parent avec un message clair
        $message = sprintf("Le produit '%s' n'est pas disponible en stock.", $nomProduit);
        parent::__construct($message, $code, $previous);
    }

    public function getNomProduit(): string
    {
        return $this->nomProduit;
    }
}
```

**Pourquoi créer des exceptions personnalisées** :

1. **Clarté** : Le nom de l'exception décrit exactement le problème.
2. **Données supplémentaires** : Tu peux stocker des informations contextuelles.
3. **Catch ciblé** : Tu attrapes uniquement les erreurs qui t'intéressent.

---

### Le gestionnaire global (set_exception_handler)

**Définition** : `set_exception_handler()` définit une fonction qui sera appelée pour toute exception non attrapée par un `catch`.

```php
<?php

set_exception_handler(function (\Throwable $e) {
    // Ce code s'exécute si une exception n'est attrapée nulle part
    echo "Erreur fatale : " . $e->getMessage() . "\n";
    echo "Fichier : " . $e->getFile() . " ligne " . $e->getLine() . "\n";

    // En production, on logge l'erreur dans un fichier
    error_log($e->getMessage(), 3, '/var/log/app/errors.log');
});
```

**Utilisation typique** : En production, tu définis un gestionnaire global qui affiche une page d'erreur propre à l'utilisateur et enregistre les détails techniques dans un fichier de log. Symfony fait cela automatiquement.

---

## Étapes Pratiques

### Étape 1 : Attraper une exception simple

Crée un fichier `public/exceptions-base.php` :

```php
<?php

// Étape 1 : try/catch basique

echo "<h1>Gestion d'exceptions - Base</h1>";

// Exemple 1 : Division par zéro
echo "<h2>Division par zéro</h2>";

function diviser(float $a, float $b): float
{
    if ($b === 0.0) {
        throw new InvalidArgumentException("Division par zéro impossible");
    }

    return $a / $b;
}

try {
    $resultat = diviser(10, 3);
    echo "<p>10 / 3 = " . $resultat . "</p>";

    $resultat = diviser(10, 0);
    echo "<p>10 / 0 = " . $resultat . "</p>"; // Cette ligne ne sera pas exécutée
} catch (InvalidArgumentException $e) {
    echo "<p style='color: red;'>Erreur attrapée : " . $e->getMessage() . "</p>";
}

echo "<p>Le programme continue son exécution après le catch.</p>";
```

**Résultat attendu** :

```text
Gestion d'exceptions - Base

Division par zéro

10 / 3 = 3.3333333333333
Erreur attrapée : Division par zéro impossible
Le programme continue son exécution après le catch.
```

---

### Étape 2 : Catch multiple

Crée un fichier `public/exceptions-catch-multiple.php` :

```php
<?php

// Étape 2 : Attraper différents types d'exceptions

echo "<h1>Catch multiple</h1>";

function traiterAge(mixed $age): string
{
    // Vérification du type
    if (!is_int($age)) {
        throw new InvalidArgumentException(
            "L'âge doit être un entier, reçu : " . gettype($age)
        );
    }

    // Vérification de la plage
    if ($age < 0 || $age > 150) {
        throw new RangeException(
            "L'âge doit être entre 0 et 150, reçu : " . $age
        );
    }

    // Règle métier
    if ($age < 18) {
        throw new RuntimeException("L'utilisateur doit être majeur");
    }

    return "Âge valide : " . $age . " ans";
}

// Test avec différentes valeurs
$tests = [25, "vingt", -5, 200, 15, 30];

foreach ($tests as $valeur) {
    echo "<h2>Test avec : " . var_export($valeur, true) . "</h2>";

    try {
        $resultat = traiterAge($valeur);
        echo "<p style='color: green;'>" . $resultat . "</p>";
    } catch (InvalidArgumentException $e) {
        echo "<p style='color: red;'>Type invalide : " . $e->getMessage() . "</p>";
    } catch (RangeException $e) {
        echo "<p style='color: orange;'>Hors limites : " . $e->getMessage() . "</p>";
    } catch (RuntimeException $e) {
        echo "<p style='color: blue;'>Règle métier : " . $e->getMessage() . "</p>";
    }
}
```

**Résultat attendu** :

```text
Catch multiple

Test avec : 25
Âge valide : 25 ans

Test avec : 'vingt'
Type invalide : L'âge doit être un entier, reçu : string

Test avec : -5
Hors limites : L'âge doit être entre 0 et 150, reçu : -5

Test avec : 200
Hors limites : L'âge doit être entre 0 et 150, reçu : 200

Test avec : 15
Règle métier : L'utilisateur doit être majeur

Test avec : 30
Âge valide : 30 ans
```

---

### Étape 3 : Le bloc finally

Crée un fichier `public/exceptions-finally.php` :

```php
<?php

// Étape 3 : Le bloc finally s'exécute toujours

echo "<h1>Le bloc finally</h1>";

function lireFichier(string $chemin): string
{
    echo "<p>Tentative d'ouverture de : " . $chemin . "</p>";

    if (!file_exists($chemin)) {
        throw new RuntimeException("Fichier introuvable : " . $chemin);
    }

    return file_get_contents($chemin);
}

// Test 1 : Fichier qui n'existe pas
echo "<h2>Test 1 : Fichier inexistant</h2>";

try {
    $contenu = lireFichier('/chemin/qui/nexiste/pas.txt');
    echo "<p>Contenu : " . $contenu . "</p>";
} catch (RuntimeException $e) {
    echo "<p style='color: red;'>Erreur : " . $e->getMessage() . "</p>";
} finally {
    // Ce bloc s'exécute dans tous les cas
    echo "<p style='color: gray;'>Finally : nettoyage effectué (fichier fermé).</p>";
}

// Test 2 : Fichier qui existe
echo "<h2>Test 2 : Fichier existant</h2>";

try {
    // On utilise un fichier qui existe toujours en PHP
    $contenu = lireFichier(__FILE__);
    echo "<p>Le fichier a été lu (" . strlen($contenu) . " caractères).</p>";
} catch (RuntimeException $e) {
    echo "<p style='color: red;'>Erreur : " . $e->getMessage() . "</p>";
} finally {
    echo "<p style='color: gray;'>Finally : nettoyage effectué (fichier fermé).</p>";
}

echo "<hr>";
echo "<p>Le finally s'est exécuté dans les deux cas, erreur ou pas.</p>";
```

**Résultat attendu** :

```text
Le bloc finally

Test 1 : Fichier inexistant
Tentative d'ouverture de : /chemin/qui/nexiste/pas.txt
Erreur : Fichier introuvable : /chemin/qui/nexiste/pas.txt
Finally : nettoyage effectué (fichier fermé).

Test 2 : Fichier existant
Tentative d'ouverture de : /var/www/html/public/exceptions-finally.php
Le fichier a été lu (XXX caractères).
Finally : nettoyage effectué (fichier fermé).
```

---

### Étape 4 : Lancer une exception dans une classe

Crée un fichier `public/exceptions-classe.php` :

```php
<?php

// Étape 4 : Lancer des exceptions dans des méthodes de classe

echo "<h1>Exceptions dans une classe</h1>";

class CompteBancaire
{
    private float $solde;
    private string $titulaire;

    public function __construct(string $titulaire, float $soldeInitial = 0.0)
    {
        if ($soldeInitial < 0) {
            throw new InvalidArgumentException(
                "Le solde initial ne peut pas être négatif : " . $soldeInitial
            );
        }

        $this->titulaire = $titulaire;
        $this->solde = $soldeInitial;
    }

    public function deposer(float $montant): void
    {
        if ($montant <= 0) {
            throw new InvalidArgumentException(
                "Le montant du dépôt doit être positif, reçu : " . $montant
            );
        }

        $this->solde += $montant;
    }

    public function retirer(float $montant): void
    {
        if ($montant <= 0) {
            throw new InvalidArgumentException(
                "Le montant du retrait doit être positif, reçu : " . $montant
            );
        }

        if ($montant > $this->solde) {
            throw new RuntimeException(
                sprintf(
                    "Solde insuffisant. Solde actuel : %.2f €, retrait demandé : %.2f €",
                    $this->solde,
                    $montant
                )
            );
        }

        $this->solde -= $montant;
    }

    public function getSolde(): float
    {
        return $this->solde;
    }

    public function getTitulaire(): string
    {
        return $this->titulaire;
    }
}

// Test : opérations normales
echo "<h2>Opérations normales</h2>";

try {
    $compte = new CompteBancaire("Hugo", 500.0);
    echo "<p>Compte de " . $compte->getTitulaire() . " créé avec " . $compte->getSolde() . " €</p>";

    $compte->deposer(200);
    echo "<p>Après dépôt de 200 € : " . $compte->getSolde() . " €</p>";

    $compte->retirer(100);
    echo "<p>Après retrait de 100 € : " . $compte->getSolde() . " €</p>";
} catch (Exception $e) {
    echo "<p style='color: red;'>Erreur : " . $e->getMessage() . "</p>";
}

// Test : solde insuffisant
echo "<h2>Solde insuffisant</h2>";

try {
    $compte = new CompteBancaire("Marie", 100.0);
    $compte->retirer(500); // Doit échouer
} catch (RuntimeException $e) {
    echo "<p style='color: red;'>" . $e->getMessage() . "</p>";
}

// Test : montant négatif
echo "<h2>Montant négatif</h2>";

try {
    $compte = new CompteBancaire("Pierre", 100.0);
    $compte->deposer(-50); // Doit échouer
} catch (InvalidArgumentException $e) {
    echo "<p style='color: red;'>" . $e->getMessage() . "</p>";
}
```

**Résultat attendu** :

```text
Exceptions dans une classe

Opérations normales
Compte de Hugo créé avec 500 €
Après dépôt de 200 € : 700 €
Après retrait de 100 € : 600 €

Solde insuffisant
Solde insuffisant. Solde actuel : 100.00 €, retrait demandé : 500.00 €

Montant négatif
Le montant du dépôt doit être positif, reçu : -50
```

---

### Étape 5 : Créer une exception personnalisée

Crée un fichier `public/exceptions-personnalisees.php` :

```php
<?php

// Étape 5 : Exceptions personnalisées

echo "<h1>Exceptions personnalisées</h1>";

// Exception personnalisée pour la validation de formulaire
class FormValidationException extends RuntimeException
{
    /** @var array<string, string> */
    private array $erreurs;

    /**
     * @param array<string, string> $erreurs Tableau associatif [champ => message]
     */
    public function __construct(array $erreurs, int $code = 0, ?\Throwable $previous = null)
    {
        $this->erreurs = $erreurs;

        $message = "Erreurs de validation : " . implode(', ', $erreurs);
        parent::__construct($message, $code, $previous);
    }

    /** @return array<string, string> */
    public function getErreurs(): array
    {
        return $this->erreurs;
    }

    public function aDesErreurs(): bool
    {
        return count($this->erreurs) > 0;
    }
}

// Classe qui utilise l'exception personnalisée
class Inscription
{
    public function valider(string $nom, string $email, string $motDePasse): void
    {
        $erreurs = [];

        if (strlen($nom) < 2) {
            $erreurs['nom'] = "Le nom doit avoir au moins 2 caractères";
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $erreurs['email'] = "L'adresse email n'est pas valide";
        }

        if (strlen($motDePasse) < 8) {
            $erreurs['motDePasse'] = "Le mot de passe doit avoir au moins 8 caractères";
        }

        if (!preg_match('/[A-Z]/', $motDePasse)) {
            $erreurs['motDePasse'] = "Le mot de passe doit contenir au moins une majuscule";
        }

        // Si des erreurs existent, on lance l'exception
        if (count($erreurs) > 0) {
            throw new FormValidationException($erreurs);
        }
    }
}

$inscription = new Inscription();

// Test 1 : Données valides
echo "<h2>Test 1 : Données valides</h2>";

try {
    $inscription->valider("Hugo Martin", "hugo@example.com", "MonMotDePasse1");
    echo "<p style='color: green;'>Inscription réussie.</p>";
} catch (FormValidationException $e) {
    echo "<p style='color: red;'>" . $e->getMessage() . "</p>";
}

// Test 2 : Données invalides
echo "<h2>Test 2 : Données invalides</h2>";

try {
    $inscription->valider("H", "pas-un-email", "abc");
    echo "<p style='color: green;'>Inscription réussie.</p>";
} catch (FormValidationException $e) {
    echo "<ul style='color: red;'>";
    foreach ($e->getErreurs() as $champ => $message) {
        echo "<li><strong>" . $champ . "</strong> : " . $message . "</li>";
    }
    echo "</ul>";
}

// Test 3 : Email invalide uniquement
echo "<h2>Test 3 : Email invalide uniquement</h2>";

try {
    $inscription->valider("Hugo Martin", "hugo@", "MonMotDePasse1");
    echo "<p style='color: green;'>Inscription réussie.</p>";
} catch (FormValidationException $e) {
    echo "<ul style='color: red;'>";
    foreach ($e->getErreurs() as $champ => $message) {
        echo "<li><strong>" . $champ . "</strong> : " . $message . "</li>";
    }
    echo "</ul>";
}
```

**Résultat attendu** :

```text
Exceptions personnalisées

Test 1 : Données valides
Inscription réussie.

Test 2 : Données invalides
- nom : Le nom doit avoir au moins 2 caractères
- email : L'adresse email n'est pas valide
- motDePasse : Le mot de passe doit contenir au moins une majuscule

Test 3 : Email invalide uniquement
- email : L'adresse email n'est pas valide
```

---

## Pièges Fréquents

### Piège 1 : Catch trop large

**Problème** : Tu attrapes `\Exception` partout, ce qui masque les vrais problèmes.

**Solution** : Attrape les exceptions les plus spécifiques possible.

```php
<?php

// Incorrect : attrape TOUT, impossible de savoir ce qui s'est passé
try {
    $produit = trouverProduit($id);
    $commande = creerCommande($produit);
} catch (\Exception $e) {
    echo "Quelque chose a échoué"; // Trop vague
}

// Correct : attrape chaque type séparément
try {
    $produit = trouverProduit($id);
    $commande = creerCommande($produit);
} catch (ProduitIntrouvableException $e) {
    echo "Produit non trouvé : " . $e->getMessage();
} catch (StockInsuffisantException $e) {
    echo "Stock insuffisant : " . $e->getMessage();
} catch (\Exception $e) {
    // Dernier recours pour les erreurs inattendues
    echo "Erreur inattendue : " . $e->getMessage();
}
```

---

### Piège 2 : Oublier finally pour le nettoyage

**Problème** : Si une exception est lancée, le code de nettoyage (fermeture de connexion, libération de ressource) n'est pas exécuté.

**Solution** : Placer le nettoyage dans le bloc `finally`.

```php
<?php

$connexion = null;

try {
    $connexion = new PDO('pgsql:host=localhost;dbname=test', 'user', 'pass');
    // Requête qui peut échouer
    $connexion->exec("INSERT INTO ...");
} catch (\PDOException $e) {
    echo "Erreur BDD : " . $e->getMessage();
} finally {
    // La connexion est fermée même si une exception se produit
    $connexion = null;
}
```

---

### Piège 3 : Confondre Error et Exception

**Problème** : Tu essaies d'attraper un `TypeError` avec `catch (\Exception $e)`, mais il n'est pas attrapé.

**Solution** : `TypeError` hérite de `\Error`, pas de `\Exception`. Utilise `\Throwable` pour attraper les deux.

```php
<?php

function additionner(int $a, int $b): int
{
    return $a + $b;
}

// Incorrect : TypeError n'est pas une Exception
try {
    additionner("texte", 5);
} catch (\Exception $e) {
    echo "Attrapé !"; // Ne sera PAS exécuté
}

// Correct : TypeError hérite de Error, utilise Throwable
try {
    additionner("texte", 5);
} catch (\TypeError $e) {
    echo "TypeError attrapé : " . $e->getMessage();
}

// Ou attraper les deux avec Throwable
try {
    additionner("texte", 5);
} catch (\Throwable $e) {
    echo "Attrapé : " . $e->getMessage();
}
```

---

### Piège 4 : Avaler les exceptions (catch vide)

**Problème** : Tu attrapes une exception mais ne fais rien, ce qui masque le problème.

**Solution** : Au minimum, logge l'erreur.

```php
<?php

// Incorrect : l'erreur est complètement ignorée
try {
    $resultat = operationCritique();
} catch (\Exception $e) {
    // Rien ! Le problème est invisible
}

// Correct : au minimum, logge l'erreur
try {
    $resultat = operationCritique();
} catch (\Exception $e) {
    error_log("Erreur dans operationCritique : " . $e->getMessage());
    // Si tu ne peux pas traiter, relance l'exception
    throw $e;
}
```

---

## Checklist de Validation

- [ ] Je comprends la différence entre `Error` et `Exception`
- [ ] Je sais écrire un bloc `try/catch`
- [ ] Je sais attraper plusieurs types d'exceptions avec des `catch` multiples
- [ ] Je sais utiliser le bloc `finally`
- [ ] Je sais lancer une exception avec `throw new`
- [ ] Je sais créer une exception personnalisée qui hérite de `\Exception` ou `\RuntimeException`
- [ ] Je sais ajouter des données supplémentaires dans une exception personnalisée
- [ ] Je comprends la hiérarchie `Throwable > Error / Exception`
- [ ] Je sais utiliser `set_exception_handler()` pour un gestionnaire global

---

## Exercice Pratique

**Énoncé** : Crée un système de validation de formulaire avec des exceptions personnalisées.

**Indications** :

- Crée un fichier `public/exercice-exceptions.php`
- Crée une classe `FormValidationException` qui hérite de `\RuntimeException` :
  - Propriété privée `$erreurs` (tableau associatif `[champ => message]`)
  - Méthode `getErreurs()` qui retourne le tableau
  - Méthode `hasErreur(string $champ)` qui vérifie si un champ a une erreur
  - Méthode `getErreur(string $champ)` qui retourne le message d'erreur d'un champ
- Crée une classe `ValidateurInscription` avec une méthode `valider(array $donnees)` :
  - Vérifie que `nom` existe et a au moins 2 caractères
  - Vérifie que `email` est un email valide
  - Vérifie que `age` est un entier entre 13 et 120
  - Vérifie que `motDePasse` a au moins 8 caractères et contient au moins un chiffre
  - Lance `FormValidationException` si des erreurs existent
- Teste avec trois jeux de données : un valide, un partiellement invalide, un complètement invalide

**Résultat attendu** :

```text
Test 1 (valide) : Inscription réussie !

Test 2 (email et mot de passe invalides) :
  - email : L'adresse email n'est pas valide
  - motDePasse : Le mot de passe doit contenir au moins un chiffre

Test 3 (tout invalide) :
  - nom : Le nom doit avoir au moins 2 caractères
  - email : L'adresse email n'est pas valide
  - age : L'âge doit être entre 13 et 120
  - motDePasse : Le mot de passe doit avoir au moins 8 caractères
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// Fichier : public/exercice-exceptions.php

// Exception personnalisée pour la validation de formulaire
class FormValidationException extends RuntimeException
{
    /** @var array<string, string> */
    private array $erreurs;

    /**
     * @param array<string, string> $erreurs Tableau [champ => message d'erreur]
     */
    public function __construct(array $erreurs, int $code = 0, ?\Throwable $previous = null)
    {
        $this->erreurs = $erreurs;
        $message = "Erreurs de validation : " . implode(', ', $erreurs);
        parent::__construct($message, $code, $previous);
    }

    /** @return array<string, string> */
    public function getErreurs(): array
    {
        return $this->erreurs;
    }

    public function hasErreur(string $champ): bool
    {
        return array_key_exists($champ, $this->erreurs);
    }

    public function getErreur(string $champ): ?string
    {
        return $this->erreurs[$champ] ?? null;
    }
}

// Validateur d'inscription
class ValidateurInscription
{
    /**
     * Valide les données d'inscription.
     *
     * @param array<string, mixed> $donnees Les données du formulaire
     * @throws FormValidationException Si des erreurs de validation existent
     */
    public function valider(array $donnees): void
    {
        $erreurs = [];

        // Validation du nom
        $nom = $donnees['nom'] ?? '';
        if (strlen($nom) < 2) {
            $erreurs['nom'] = "Le nom doit avoir au moins 2 caractères";
        }

        // Validation de l'email
        $email = $donnees['email'] ?? '';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $erreurs['email'] = "L'adresse email n'est pas valide";
        }

        // Validation de l'âge
        $age = $donnees['age'] ?? null;
        if (!is_int($age) || $age < 13 || $age > 120) {
            $erreurs['age'] = "L'âge doit être entre 13 et 120";
        }

        // Validation du mot de passe
        $motDePasse = $donnees['motDePasse'] ?? '';
        if (strlen($motDePasse) < 8) {
            $erreurs['motDePasse'] = "Le mot de passe doit avoir au moins 8 caractères";
        } elseif (!preg_match('/[0-9]/', $motDePasse)) {
            $erreurs['motDePasse'] = "Le mot de passe doit contenir au moins un chiffre";
        }

        // Si des erreurs existent, on lance l'exception
        if (count($erreurs) > 0) {
            throw new FormValidationException($erreurs);
        }
    }
}

// --- Tests ---

$validateur = new ValidateurInscription();

// Test 1 : Données valides
echo "<h2>Test 1 (valide)</h2>";

try {
    $validateur->valider([
        'nom' => 'Hugo Martin',
        'email' => 'hugo@example.com',
        'age' => 23,
        'motDePasse' => 'MonPass123',
    ]);
    echo "<p style='color: green;'>Inscription réussie !</p>";
} catch (FormValidationException $e) {
    echo "<ul style='color: red;'>";
    foreach ($e->getErreurs() as $champ => $message) {
        echo "<li><strong>" . $champ . "</strong> : " . $message . "</li>";
    }
    echo "</ul>";
}

// Test 2 : Email et mot de passe invalides
echo "<h2>Test 2 (email et mot de passe invalides)</h2>";

try {
    $validateur->valider([
        'nom' => 'Hugo Martin',
        'email' => 'pas-valide',
        'age' => 23,
        'motDePasse' => 'SansChiffre',
    ]);
    echo "<p style='color: green;'>Inscription réussie !</p>";
} catch (FormValidationException $e) {
    echo "<ul style='color: red;'>";
    foreach ($e->getErreurs() as $champ => $message) {
        echo "<li><strong>" . $champ . "</strong> : " . $message . "</li>";
    }
    echo "</ul>";
}

// Test 3 : Tout invalide
echo "<h2>Test 3 (tout invalide)</h2>";

try {
    $validateur->valider([
        'nom' => 'H',
        'email' => 'nope',
        'age' => 5,
        'motDePasse' => 'abc',
    ]);
    echo "<p style='color: green;'>Inscription réussie !</p>";
} catch (FormValidationException $e) {
    echo "<ul style='color: red;'>";
    foreach ($e->getErreurs() as $champ => $message) {
        echo "<li><strong>" . $champ . "</strong> : " . $message . "</li>";
    }
    echo "</ul>";

    // Démonstration des méthodes hasErreur et getErreur
    echo "<h3>Vérification ciblée</h3>";
    echo "<p>A une erreur sur 'email' ? " . ($e->hasErreur('email') ? 'Oui' : 'Non') . "</p>";
    echo "<p>Erreur email : " . $e->getErreur('email') . "</p>";
    echo "<p>A une erreur sur 'telephone' ? " . ($e->hasErreur('telephone') ? 'Oui' : 'Non') . "</p>";
}
```

**Explication de la solution** :

| Élément | Explication |
| ------- | ----------- |
| `FormValidationException` | Hérite de `RuntimeException`, stocke un tableau d'erreurs |
| `getErreurs()` | Retourne toutes les erreurs pour affichage en liste |
| `hasErreur()` | Vérifie si un champ spécifique a une erreur |
| `getErreur()` | Retourne le message d'erreur d'un champ précis |
| `ValidateurInscription` | Collecte toutes les erreurs avant de lancer l'exception |
| `elseif` dans le mot de passe | Évite de vérifier le contenu si la longueur est insuffisante |

---

## Navigation

← Fiche précédente : **[Les traits](12-traits.md)**

→ Fiche suivante : **[Typage strict et énumérations](14-typage-strict-enumerations.md)**
