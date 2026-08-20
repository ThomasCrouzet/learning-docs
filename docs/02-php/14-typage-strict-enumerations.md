---
tags:
  - PHP
  - Avancé
  - Pratique
description: "Typage strict et énumérations"
estimated_time: "55 min"
fiche_number: 14
total_fiches: 14
cursus: "PHP"
---

# 14 - Typage strict et énumérations

> **En bref** : À la fin de cette fiche, tu sauras activer le typage strict en PHP, utiliser les types avancés (nullable, union, intersection), et créer des énumérations (enum) pour remplacer les constantes de classe par des types plus sûrs. Lecture estimée : 55 min.


## Prérequis

- Fiche **[02 - Variables et types](02-variables-types.md)**
- Fiche **[08 - Les classes en détail](08-classes-en-detail.md)**
- Comprendre les types de base (int, string, float, bool, array)
- Savoir créer des classes avec des propriétés et des méthodes

## Objectif de cette fiche

À la fin de cette fiche, tu sauras activer le typage strict en PHP, utiliser les types avancés (nullable, union, intersection), et créer des énumérations (enum) pour remplacer les constantes de classe par des types plus sûrs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le typage strict ?

**Définition** : Le typage strict oblige PHP à vérifier que les types des arguments et des retours correspondent exactement à ce qui est déclaré. Sans typage strict, PHP convertit automatiquement les types (coercition).

**Le problème que le typage strict résout** :

Sans typage strict, voici les problèmes rencontrés :

1. **Conversions silencieuses** : PHP convertit `"42"` en `42` sans prévenir, ce qui peut produire des résultats inattendus.

2. **Bugs difficiles à trouver** : Une chaîne `"0"` est convertie en `0`, un booléen `false` est converti en `0`, ce qui crée des bugs subtils.

3. **Moins de confiance** : Tu ne peux pas être sûr que ta fonction reçoit bien le type attendu.

**Comment le typage strict résout ces problèmes** :

| Problème | Solution apportée par le typage strict |
| -------- | -------------------------------------- |
| Conversions silencieuses | PHP lance un `TypeError` si le type ne correspond pas |
| Bugs difficiles à trouver | L'erreur se produit immédiatement, à l'endroit exact du problème |
| Moins de confiance | Le type est garanti, pas besoin de vérifier manuellement |

**Analogie concrète** : Le typage strict est comme un contrôleur de billets à l'entrée d'un cinéma. En mode normal (coercition), le contrôleur accepte un ticket froissé, un ticket photocopié, ou même un bout de papier avec un numéro écrit à la main. En mode strict, il n'accepte que le ticket original, dans le bon format. Si tu présentes autre chose, il te refuse l'entrée immédiatement.

**Ce que le typage strict n'est PAS** :

- Le typage strict n'est pas activé par défaut. Tu dois l'activer explicitement dans chaque fichier.
- Le typage strict ne change pas le comportement de PHP en général. Il ne s'applique qu'aux appels de fonctions dans le fichier qui contient `declare(strict_types=1)`.

---

### La coercition de types (mode par défaut)

En mode par défaut, PHP convertit automatiquement les types :

```php
<?php

// Sans strict_types, PHP convertit silencieusement

function additionner(int $a, int $b): int
{
    return $a + $b;
}

echo additionner(5, 3);       // 8 (OK)
echo additionner("5", "3");   // 8 (PHP convertit "5" en 5 et "3" en 3)
echo additionner(5.7, 3.2);   // dépréciation PHP 8.1+ (conversion float -> int avec perte) ; TypeError prévue en PHP 9
echo additionner(true, false); // 1 (PHP convertit true en 1 et false en 0)
```

Sans `strict_types`, PHP convertit ces valeurs. Depuis PHP 8.1, passer un `float` à un paramètre `int` (ici `5.7` et `3.2`) déclenche une dépréciation, car la conversion perd la partie décimale. En PHP 9 cette conversion sera une `TypeError`. Les conversions `string` numérique et `bool` restent silencieuses sans `strict_types`.

---

### Activer le typage strict

Pour activer le typage strict, ajoute cette déclaration en toute première ligne du fichier (après `<?php`) :

```php
<?php

declare(strict_types=1);

function additionner(int $a, int $b): int
{
    return $a + $b;
}

echo additionner(5, 3);       // 8 (OK)
echo additionner("5", "3");   // TypeError ! "5" n'est pas un int
echo additionner(5.7, 3.2);   // TypeError ! 5.7 n'est pas un int
```

**Règles importantes** :

| Règle | Explication |
| ----- | ----------- |
| `declare(strict_types=1)` doit être la première instruction | Avant tout autre code (après `<?php`) |
| S'applique au fichier appelant | C'est le fichier qui appelle la fonction qui détermine le mode |
| Doit être dans chaque fichier | Pas de configuration globale |
| Affecte les paramètres ET les retours | Les deux sont vérifiés |

---

### Les types nullable

**Définition** : Un type nullable accepte la valeur `null` en plus du type déclaré. On le note avec un `?` devant le type.

```php
<?php

declare(strict_types=1);

// Le paramètre peut être un string OU null
function saluer(?string $nom): string
{
    if ($nom === null) {
        return "Bonjour, inconnu !";
    }

    return "Bonjour, " . $nom . " !";
}

echo saluer("Hugo");  // Bonjour, Hugo !
echo saluer(null);     // Bonjour, inconnu !
// echo saluer(42);    // TypeError : int donné, string|null attendu
```

**Utilisation dans les classes** :

```php
<?php

declare(strict_types=1);

class User
{
    // L'ID est null tant que l'utilisateur n'est pas sauvegardé en base
    private ?int $id = null;
    private string $nom;
    private ?string $telephone = null;

    public function __construct(string $nom)
    {
        $this->nom = $nom;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(?string $telephone): void
    {
        $this->telephone = $telephone;
    }
}
```

---

### Les union types (PHP 8.0+)

**Définition** : Un union type permet de déclarer qu'un paramètre ou un retour peut être de plusieurs types, séparés par `|`.

```php
<?php

declare(strict_types=1);

// Le paramètre peut être un int OU un string
function afficherId(int|string $id): string
{
    return "ID : " . $id;
}

echo afficherId(42);       // ID : 42
echo afficherId("abc-123"); // ID : abc-123
// echo afficherId(3.14);   // TypeError : float n'est pas int|string
```

**Cas d'utilisation courants** :

| Union type | Cas d'utilisation |
| ---------- | ----------------- |
| `int\|string` | Identifiants (numériques ou UUID) |
| `string\|array` | Configuration (valeur simple ou tableau) |
| `int\|float` | Calculs numériques |
| `string\|bool` | Résultat ou indicateur d'échec |

---

### Les types intersection (PHP 8.1+)

**Définition** : Un type intersection impose qu'une valeur satisfasse **simultanément** plusieurs interfaces, séparées par `&`.

```php
<?php

declare(strict_types=1);

interface Affichable
{
    public function __toString(): string;
}

interface Denombrable
{
    public function nombre(): int;
}

// La classe doit implémenter les DEUX interfaces pour satisfaire le type intersection
class Panier implements Affichable, Denombrable
{
    public function __construct(private array $articles) {}

    public function nombre(): int
    {
        return count($this->articles);
    }

    public function __toString(): string
    {
        return implode(', ', $this->articles);
    }
}

// Le paramètre doit implémenter TOUTES les interfaces listées
function traiterCollection(Affichable&Denombrable $collection): string
{
    return "Taille : " . $collection->nombre() . " - " . $collection;
}

echo traiterCollection(new Panier(['pommes', 'pain'])); // Taille : 2 - pommes, pain
```

**Différence avec union types** :

| | Union `A\|B` | Intersection `A&B` |
| - | ------------ | ------------------ |
| Signification | A **ou** B (l'un ou l'autre suffit) | A **et** B (les deux sont requis) |
| Types autorisés | Classes, interfaces, scalaires | Interfaces uniquement |
| Usage courant | Paramètres polyvalents | Contraintes multi-interfaces |

**Usage dans Symfony 7.x** : tu rencontreras les types intersection dans des services qui implémentent plusieurs interfaces de contrat (par exemple un service à la fois `LoggerAwareInterface` et `EventSubscriberInterface`).

---

### Les types de retour spéciaux

| Type | Signification | Exemple |
| ---- | ------------- | ------- |
| `void` | La fonction ne retourne rien | `function sauvegarder(): void` |
| `never` | La fonction ne retourne jamais (exception ou exit) | `function erreurFatale(): never` |
| `static` | Retourne une instance de la classe appelée | `function creer(): static` |
| `self` | Retourne une instance de la classe qui déclare la méthode | `function creer(): self` |
| `mixed` | Accepte n'importe quel type | `function traiter(): mixed` |

---

### Les propriétés readonly (PHP 8.1+)

**Définition** : Le modificateur `readonly` interdit la modification d'une propriété après son initialisation. Une fois assignée (dans le constructeur), la valeur est permanente.

```php
<?php

declare(strict_types=1);

class Commande
{
    public readonly string $reference;
    public readonly \DateTimeImmutable $createdAt;

    public function __construct(string $reference)
    {
        $this->reference = $reference;              // Initialisation autorisée
        $this->createdAt = new \DateTimeImmutable(); // Initialisation autorisée
    }
}

$commande = new Commande('CMD-001');
echo $commande->reference;  // CMD-001

// $commande->reference = 'CMD-002';  // Error: readonly property
```

**Avec la promotion de propriétés (PHP 8.0+ pour la promotion, readonly depuis PHP 8.1)** :

```php
<?php
class Commande
{
    public function __construct(
        public readonly string $reference,
        public readonly \DateTimeImmutable $createdAt = new \DateTimeImmutable()
    ) {}
}
// Plus besoin de $this->x = $x dans le corps du constructeur
```

**Différence entre readonly property et readonly class (PHP 8.2+)** :

| | `readonly` sur une propriété | `readonly` sur la classe |
| - | --------------------------- | ------------------------ |
| Portée | Une propriété spécifique | Toutes les propriétés de la classe |
| Flexibilité | Certaines propriétés mutables | Aucune propriété mutable |
| Exemple | `public readonly string $id;` | `readonly class Point { ... }` |

**Usage dans Symfony 7.x** : les DTOs (Data Transfer Objects) et les Value Objects utilisent massivement `readonly` pour garantir l'immutabilité des données transmises entre les couches de l'application.

---

### Qu'est-ce qu'une énumération ?

**Définition** : Une énumération (enum) est un type qui contient un ensemble fixe de valeurs possibles. Chaque valeur est un "cas" (case) de l'enum.

**Le problème que les énumérations résolvent** :

Sans énumérations, voici les problèmes rencontrés :

1. **Constantes fragiles** : Les constantes de classe sont de simples chaînes ou entiers. Rien n'empêche de passer une valeur invalide.

2. **Pas de validation du type** : `function setStatus(string $status)` accepte n'importe quelle chaîne, même invalide.

3. **Pas de méthodes** : Les constantes ne peuvent pas avoir de méthodes associées.

**Comment les énumérations résolvent ces problèmes** :

| Problème | Solution apportée par les énumérations |
| -------- | -------------------------------------- |
| Constantes fragiles | L'enum ne peut contenir que les cas définis |
| Pas de validation du type | Le typage `function setStatus(Status $status)` n'accepte que les valeurs de l'enum |
| Pas de méthodes | Les enum peuvent avoir des méthodes |

**Analogie concrète** : Imagine un feu de circulation. Il ne peut être que rouge, orange ou vert. Avec des constantes, tu pourrais accidentellement écrire `"bleu"` et personne ne te préviendrait. Avec un enum, seuls `Feu::ROUGE`, `Feu::ORANGE` et `Feu::VERT` existent. Toute autre valeur est impossible.

**Ce qu'une énumération n'est PAS** :

- Une énumération n'est pas une classe. Tu ne peux pas l'instancier avec `new`.
- Une énumération n'est pas une simple constante. Chaque cas est un objet singleton (il n'existe qu'une seule instance de chaque cas).

---

### Pure enum vs Backed enum

PHP propose deux types d'énumérations :

**Pure enum** : Pas de valeur associée. Chaque cas est un objet unique.

```php
<?php

enum Couleur
{
    case ROUGE;
    case VERT;
    case BLEU;
}

$maCouleur = Couleur::ROUGE;
echo $maCouleur->name; // "ROUGE"
```

**Backed enum** : Chaque cas a une valeur scalaire (string ou int).

```php
<?php

enum Status: string
{
    case BROUILLON = 'draft';
    case PUBLIE = 'published';
    case ARCHIVE = 'archived';
}

$status = Status::BROUILLON;
echo $status->value; // "draft"
echo $status->name;  // "BROUILLON"
```

**Comparaison pure enum vs backed enum** :

| Pure enum | Backed enum |
| --------- | ----------- |
| Pas de valeur associée | Valeur `string` ou `int` |
| Accès au nom : `->name` | Accès au nom : `->name` et à la valeur : `->value` |
| Pas de conversion depuis une chaîne | Conversion avec `::from()` et `::tryFrom()` |
| Pour les cas sans représentation en BDD | Pour stocker en base de données ou en JSON |

---

### Méthodes sur les enum

Les enum peuvent avoir des méthodes, des constantes et implémenter des interfaces :

```php
<?php

enum Status: string
{
    case BROUILLON = 'draft';
    case PUBLIE = 'published';
    case ARCHIVE = 'archived';

    // Méthode sur l'enum
    public function label(): string
    {
        return match ($this) {
            self::BROUILLON => 'Brouillon',
            self::PUBLIE => 'Publié',
            self::ARCHIVE => 'Archivé',
        };
    }

    public function couleur(): string
    {
        return match ($this) {
            self::BROUILLON => '#6c757d',
            self::PUBLIE => '#28a745',
            self::ARCHIVE => '#ffc107',
        };
    }

    // Méthode statique pour obtenir tous les cas
    public static function tousLesLabels(): array
    {
        $labels = [];
        foreach (self::cases() as $case) {
            $labels[$case->value] = $case->label();
        }
        return $labels;
    }
}
```

---

## Étapes Pratiques

### Étape 1 : Activer le typage strict

Crée un fichier `public/typage-strict.php` :

```php
<?php

declare(strict_types=1);

// Étape 1 : Voir la différence entre mode coercition et mode strict

function multiplier(int $a, int $b): int
{
    return $a * $b;
}

echo "<h1>Typage strict</h1>";

// Appel avec des entiers : fonctionne
echo "<h2>Appel correct</h2>";
echo "<p>multiplier(5, 3) = " . multiplier(5, 3) . "</p>";

// Appel avec des chaînes : TypeError en mode strict
echo "<h2>Appel avec des chaînes</h2>";

try {
    $resultat = multiplier("5", "3");
    echo "<p>multiplier('5', '3') = " . $resultat . "</p>";
} catch (\TypeError $e) {
    echo "<p style='color: red;'>TypeError : " . $e->getMessage() . "</p>";
}

// Appel avec des flottants : TypeError en mode strict
echo "<h2>Appel avec des flottants</h2>";

try {
    $resultat = multiplier(5.7, 3.2);
    echo "<p>multiplier(5.7, 3.2) = " . $resultat . "</p>";
} catch (\TypeError $e) {
    echo "<p style='color: red;'>TypeError : " . $e->getMessage() . "</p>";
}
```

**Résultat attendu** :

```text
Typage strict

Appel correct
multiplier(5, 3) = 15

Appel avec des chaînes
TypeError : multiplier(): Argument #1 ($a) must be of type int, string given

Appel avec des flottants
TypeError : multiplier(): Argument #1 ($a) must be of type int, float given
```

---

### Étape 2 : Créer un enum basique (pure enum)

Crée un fichier `public/enum-basique.php` :

```php
<?php

declare(strict_types=1);

echo "<h1>Enum basique (pure enum)</h1>";

// Déclaration d'un pure enum
enum Direction
{
    case NORD;
    case SUD;
    case EST;
    case OUEST;
}

// Utilisation
$maDirection = Direction::NORD;

echo "<p>Direction choisie : " . $maDirection->name . "</p>";

// Comparaison
if ($maDirection === Direction::NORD) {
    echo "<p>Tu vas vers le nord.</p>";
}

// Lister tous les cas
echo "<h2>Tous les cas</h2>";
echo "<ul>";
foreach (Direction::cases() as $direction) {
    echo "<li>" . $direction->name . "</li>";
}
echo "</ul>";

// Typage dans une fonction
function decrireDirection(Direction $direction): string
{
    return match ($direction) {
        Direction::NORD => "Tu montes vers le haut de la carte.",
        Direction::SUD => "Tu descends vers le bas de la carte.",
        Direction::EST => "Tu vas vers la droite.",
        Direction::OUEST => "Tu vas vers la gauche.",
    };
}

echo "<h2>Descriptions</h2>";
echo "<ul>";
foreach (Direction::cases() as $direction) {
    echo "<li>" . $direction->name . " : " . decrireDirection($direction) . "</li>";
}
echo "</ul>";
```

---

### Étape 3 : Créer un backed enum (string)

Crée un fichier `public/enum-backed.php` :

```php
<?php

declare(strict_types=1);

echo "<h1>Backed enum (string)</h1>";

// Enum avec valeurs string (pour stockage en BDD)
enum Status: string
{
    case BROUILLON = 'draft';
    case EN_REVISION = 'review';
    case PUBLIE = 'published';
    case ARCHIVE = 'archived';
}

$status = Status::BROUILLON;

echo "<h2>Propriétés</h2>";
echo "<p>Nom : " . $status->name . "</p>";    // BROUILLON
echo "<p>Valeur : " . $status->value . "</p>"; // draft

// Conversion depuis une chaîne
echo "<h2>Conversion from() et tryFrom()</h2>";

// from() : lance une ValueError si la valeur n'existe pas
$statusFromDb = Status::from('published');
echo "<p>Status::from('published') → " . $statusFromDb->name . "</p>";

// tryFrom() : retourne null si la valeur n'existe pas
$statusInconnu = Status::tryFrom('supprime');
echo "<p>Status::tryFrom('supprime') → " . ($statusInconnu?->name ?? 'null') . "</p>";

// Test avec from() et une valeur invalide
echo "<h2>Valeur invalide avec from()</h2>";

try {
    $status = Status::from('invalide');
} catch (\ValueError $e) {
    echo "<p style='color: red;'>" . $e->getMessage() . "</p>";
}

// Lister tous les cas avec nom et valeur
echo "<h2>Tous les cas</h2>";
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Nom (name)</th><th>Valeur (value)</th></tr>";
foreach (Status::cases() as $case) {
    echo "<tr><td>" . $case->name . "</td><td>" . $case->value . "</td></tr>";
}
echo "</table>";
```

---

### Étape 4 : Enum avec méthodes

Crée un fichier `public/enum-methodes.php` :

```php
<?php

declare(strict_types=1);

echo "<h1>Enum avec méthodes</h1>";

enum Priorite: int
{
    case BASSE = 1;
    case MOYENNE = 2;
    case HAUTE = 3;
    case CRITIQUE = 4;

    // Méthode : retourne un label lisible
    public function label(): string
    {
        return match ($this) {
            self::BASSE => 'Basse',
            self::MOYENNE => 'Moyenne',
            self::HAUTE => 'Haute',
            self::CRITIQUE => 'Critique',
        };
    }

    // Méthode : retourne une couleur CSS
    public function couleur(): string
    {
        return match ($this) {
            self::BASSE => '#6c757d',
            self::MOYENNE => '#17a2b8',
            self::HAUTE => '#fd7e14',
            self::CRITIQUE => '#dc3545',
        };
    }

    // Méthode : vérifie si c'est urgent
    public function estUrgent(): bool
    {
        return $this === self::HAUTE || $this === self::CRITIQUE;
    }

    // Méthode statique : retourne les options pour un formulaire
    public static function optionsFormulaire(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[$case->value] = $case->label();
        }
        return $options;
    }
}

// Utilisation
$priorite = Priorite::HAUTE;

echo "<p>Priorité : " . $priorite->label() . "</p>";
echo "<p style='color: " . $priorite->couleur() . ";'>Couleur associée</p>";
echo "<p>Urgent ? " . ($priorite->estUrgent() ? 'Oui' : 'Non') . "</p>";

// Options pour formulaire
echo "<h2>Options formulaire</h2>";
echo "<select>";
foreach (Priorite::optionsFormulaire() as $valeur => $label) {
    echo "<option value='" . $valeur . "'>" . $label . "</option>";
}
echo "</select>";

// Tableau récapitulatif
echo "<h2>Tableau récapitulatif</h2>";
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Valeur</th><th>Label</th><th>Couleur</th><th>Urgent</th></tr>";
foreach (Priorite::cases() as $case) {
    echo "<tr>";
    echo "<td>" . $case->value . "</td>";
    echo "<td>" . $case->label() . "</td>";
    echo "<td style='background-color: " . $case->couleur() . "; color: white;'>"
         . $case->couleur() . "</td>";
    echo "<td>" . ($case->estUrgent() ? 'Oui' : 'Non') . "</td>";
    echo "</tr>";
}
echo "</table>";
```

---

### Étape 5 : Utiliser un enum dans une classe

Crée un fichier `public/enum-doctrine.php` :

```php
<?php

declare(strict_types=1);

echo "<h1>Enum dans une classe (style Doctrine)</h1>";

// L'enum pour le statut de commande
enum OrderStatus: string
{
    case EN_ATTENTE = 'pending';
    case CONFIRMEE = 'confirmed';
    case EXPEDIEE = 'shipped';
    case LIVREE = 'delivered';
    case ANNULEE = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::EN_ATTENTE => 'En attente',
            self::CONFIRMEE => 'Confirmée',
            self::EXPEDIEE => 'Expédiée',
            self::LIVREE => 'Livrée',
            self::ANNULEE => 'Annulée',
        };
    }

    public function peutEtreAnnulee(): bool
    {
        // On ne peut annuler que si la commande n'est pas encore expédiée
        return $this === self::EN_ATTENTE || $this === self::CONFIRMEE;
    }
}

// Classe qui utilise l'enum
class Commande
{
    private static int $compteur = 0;
    private int $id;
    private string $produit;
    private OrderStatus $status;

    public function __construct(string $produit)
    {
        self::$compteur++;
        $this->id = self::$compteur;
        $this->produit = $produit;
        $this->status = OrderStatus::EN_ATTENTE;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getProduit(): string
    {
        return $this->produit;
    }

    public function getStatus(): OrderStatus
    {
        return $this->status;
    }

    public function confirmer(): void
    {
        $this->status = OrderStatus::CONFIRMEE;
    }

    public function expedier(): void
    {
        $this->status = OrderStatus::EXPEDIEE;
    }

    public function livrer(): void
    {
        $this->status = OrderStatus::LIVREE;
    }

    public function annuler(): void
    {
        if (!$this->status->peutEtreAnnulee()) {
            throw new RuntimeException(
                sprintf(
                    "Impossible d'annuler la commande #%d : statut actuel '%s'",
                    $this->id,
                    $this->status->label()
                )
            );
        }

        $this->status = OrderStatus::ANNULEE;
    }
}

// Test du workflow
$commande1 = new Commande("Laptop");
echo "<h2>Commande #" . $commande1->getId() . " : " . $commande1->getProduit() . "</h2>";
echo "<p>Statut initial : " . $commande1->getStatus()->label() . "</p>";

$commande1->confirmer();
echo "<p>Après confirmation : " . $commande1->getStatus()->label() . "</p>";

$commande1->expedier();
echo "<p>Après expédition : " . $commande1->getStatus()->label() . "</p>";

// Tentative d'annulation après expédition
echo "<h2>Tentative d'annulation après expédition</h2>";

try {
    $commande1->annuler();
} catch (RuntimeException $e) {
    echo "<p style='color: red;'>" . $e->getMessage() . "</p>";
}

// Annulation réussie
echo "<h2>Annulation d'une commande en attente</h2>";

$commande2 = new Commande("Clavier");
echo "<p>Commande #" . $commande2->getId() . " : " . $commande2->getStatus()->label() . "</p>";
$commande2->annuler();
echo "<p>Après annulation : " . $commande2->getStatus()->label() . "</p>";
```

---

## Pièges Fréquents

### Piège 1 : strict_types s'applique au fichier appelant

**Problème** : Tu actives `strict_types` dans le fichier qui définit la fonction, mais pas dans le fichier qui l'appelle. Le typage strict ne s'applique pas.

**Solution** : Active `strict_types` dans chaque fichier qui appelle des fonctions typées.

```php
<?php
// fichier: fonctions.php
declare(strict_types=1);

function doubler(int $n): int
{
    return $n * 2;
}
```

```php
<?php
// fichier: appel.php
// PAS de declare(strict_types=1) ici

require 'fonctions.php';

echo doubler("5"); // Fonctionne ! Car APPEL.PHP n'est pas en mode strict
```

```php
<?php
// fichier: appel-strict.php
declare(strict_types=1);

require 'fonctions.php';

echo doubler("5"); // TypeError ! Car APPEL-STRICT.PHP est en mode strict
```

---

### Piège 2 : Confondre pure enum et backed enum

**Problème** : Tu essaies d'accéder à `->value` sur un pure enum.

**Solution** : Seuls les backed enum ont une propriété `value`.

```php
<?php

// Pure enum : PAS de valeur
enum Couleur
{
    case ROUGE;
}

// echo Couleur::ROUGE->value;  // Erreur ! Pas de propriété value
echo Couleur::ROUGE->name;     // "ROUGE" (OK)

// Backed enum : A une valeur
enum Status: string
{
    case ACTIF = 'active';
}

echo Status::ACTIF->value;  // "active" (OK)
echo Status::ACTIF->name;   // "ACTIF" (OK)
```

---

### Piège 3 : Oublier que les enum sont des singletons

**Problème** : Tu essaies de créer un enum avec `new` ou de le cloner.

**Solution** : Les enum ne sont pas instanciables. Utilise directement les cas.

```php
<?php

enum Status: string
{
    case ACTIF = 'active';
}

// Incorrect
// $s = new Status('active');  // Erreur ! Les enum ne sont pas instanciables

// Correct : accès direct
$s = Status::ACTIF;

// Correct : conversion depuis une valeur
$s = Status::from('active');

// Comparaison : utilise === (même objet)
$s1 = Status::ACTIF;
$s2 = Status::ACTIF;
var_dump($s1 === $s2);  // true (même instance singleton)
```

---

### Piège 4 : Oublier from() vs tryFrom()

**Problème** : Tu utilises `from()` avec une valeur qui peut ne pas exister, ce qui lance une `ValueError`.

**Solution** : Utilise `tryFrom()` quand la valeur peut être invalide.

```php
<?php

enum Status: string
{
    case ACTIF = 'active';
}

// from() lance une exception si la valeur n'existe pas
// Status::from('inconnu');  // ValueError !

// tryFrom() retourne null si la valeur n'existe pas
$status = Status::tryFrom('inconnu');
if ($status === null) {
    echo "Statut inconnu, utilisation du défaut.";
    $status = Status::ACTIF;
}
```

---

## Checklist de Validation

- [ ] Je sais activer le typage strict avec `declare(strict_types=1)`
- [ ] Je comprends la différence entre coercition et typage strict
- [ ] Je sais utiliser les types nullable (`?string`)
- [ ] Je sais utiliser les union types (`int|string`)
- [ ] Je comprends les types de retour `void`, `never`, `static`
- [ ] Je sais créer un pure enum
- [ ] Je sais créer un backed enum (string ou int)
- [ ] Je sais utiliser `from()` et `tryFrom()` pour convertir une valeur en enum
- [ ] Je sais ajouter des méthodes à un enum
- [ ] Je sais utiliser un enum comme type de paramètre dans une fonction ou une classe

---

## Exercice Pratique

**Énoncé** : Crée un système de statuts de commande avec un backed enum `OrderStatus`.

**Indications** :

- Crée un fichier `public/exercice-enum.php`
- Active `declare(strict_types=1)`
- Crée un backed enum `OrderStatus` avec les cas :
  - `EN_ATTENTE` = `'pending'`
  - `PAYEE` = `'paid'`
  - `EN_PREPARATION` = `'preparing'`
  - `EXPEDIEE` = `'shipped'`
  - `LIVREE` = `'delivered'`
  - `ANNULEE` = `'cancelled'`
- Ajoute les méthodes :
  - `label()` : retourne le libellé en français
  - `color()` : retourne un code couleur hexadécimal
  - `prochainStatus()` : retourne le prochain statut possible (ou null si terminal)
- Crée une classe `Commande` qui utilise l'enum et a une méthode `avancer()` qui passe au prochain statut
- Affiche un tableau HTML avec toutes les commandes et leur statut

**Résultat attendu** :

```text
| # | Produit  | Statut        | Couleur | Prochain statut  |
| 1 | Laptop   | En attente    | gris    | Payée            |
| 2 | Clavier  | Payée         | bleu    | En préparation   |
| 3 | Souris   | Livrée        | vert    | (terminal)       |
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// Fichier : public/exercice-enum.php
declare(strict_types=1);

enum OrderStatus: string
{
    case EN_ATTENTE = 'pending';
    case PAYEE = 'paid';
    case EN_PREPARATION = 'preparing';
    case EXPEDIEE = 'shipped';
    case LIVREE = 'delivered';
    case ANNULEE = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::EN_ATTENTE => 'En attente',
            self::PAYEE => 'Payée',
            self::EN_PREPARATION => 'En préparation',
            self::EXPEDIEE => 'Expédiée',
            self::LIVREE => 'Livrée',
            self::ANNULEE => 'Annulée',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::EN_ATTENTE => '#6c757d',
            self::PAYEE => '#17a2b8',
            self::EN_PREPARATION => '#fd7e14',
            self::EXPEDIEE => '#007bff',
            self::LIVREE => '#28a745',
            self::ANNULEE => '#dc3545',
        };
    }

    public function prochainStatus(): ?self
    {
        return match ($this) {
            self::EN_ATTENTE => self::PAYEE,
            self::PAYEE => self::EN_PREPARATION,
            self::EN_PREPARATION => self::EXPEDIEE,
            self::EXPEDIEE => self::LIVREE,
            self::LIVREE => null,      // Terminal
            self::ANNULEE => null,     // Terminal
        };
    }
}

class Commande
{
    private static int $compteur = 0;
    private int $id;
    private string $produit;
    private OrderStatus $status;

    public function __construct(string $produit)
    {
        self::$compteur++;
        $this->id = self::$compteur;
        $this->produit = $produit;
        $this->status = OrderStatus::EN_ATTENTE;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getProduit(): string
    {
        return $this->produit;
    }

    public function getStatus(): OrderStatus
    {
        return $this->status;
    }

    public function avancer(): void
    {
        $prochain = $this->status->prochainStatus();

        if ($prochain === null) {
            throw new RuntimeException(
                sprintf(
                    "La commande #%d est en statut terminal '%s' et ne peut pas avancer.",
                    $this->id,
                    $this->status->label()
                )
            );
        }

        $this->status = $prochain;
    }

    public function annuler(): void
    {
        if ($this->status === OrderStatus::LIVREE || $this->status === OrderStatus::ANNULEE) {
            throw new RuntimeException(
                sprintf("Impossible d'annuler la commande #%d (statut : %s).", $this->id, $this->status->label())
            );
        }

        $this->status = OrderStatus::ANNULEE;
    }
}

// --- Création et manipulation des commandes ---

$commande1 = new Commande("Laptop");
$commande1->avancer();  // EN_ATTENTE → PAYEE
$commande1->avancer();  // PAYEE → EN_PREPARATION
$commande1->avancer();  // EN_PREPARATION → EXPEDIEE

$commande2 = new Commande("Clavier");
$commande2->avancer();  // EN_ATTENTE → PAYEE

$commande3 = new Commande("Souris");
$commande3->avancer();  // EN_ATTENTE → PAYEE
$commande3->avancer();  // PAYEE → EN_PREPARATION
$commande3->avancer();  // EN_PREPARATION → EXPEDIEE
$commande3->avancer();  // EXPEDIEE → LIVREE

$commandes = [$commande1, $commande2, $commande3];

// --- Affichage ---

echo "<h1>Commandes</h1>";
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>#</th><th>Produit</th><th>Statut</th><th>Prochain statut</th></tr>";

foreach ($commandes as $commande) {
    $status = $commande->getStatus();
    $prochain = $status->prochainStatus();

    echo "<tr>";
    echo "<td>" . $commande->getId() . "</td>";
    echo "<td>" . $commande->getProduit() . "</td>";
    echo "<td style='color: " . $status->color() . ";'>"
         . $status->label() . "</td>";
    echo "<td>" . ($prochain !== null ? $prochain->label() : '(terminal)') . "</td>";
    echo "</tr>";
}

echo "</table>";

// Test d'avancement d'une commande terminale
echo "<h2>Test : avancer une commande livrée</h2>";

try {
    $commande3->avancer();
} catch (RuntimeException $e) {
    echo "<p style='color: red;'>" . $e->getMessage() . "</p>";
}
```

**Explication de la solution** :

| Élément | Explication |
| ------- | ----------- |
| `OrderStatus: string` | Backed enum avec des valeurs string pour le stockage en BDD |
| `label()`, `color()` | Méthodes sur l'enum qui utilisent `match` pour retourner la valeur correspondante |
| `prochainStatus()` | Retourne le prochain cas de l'enum ou `null` si terminal |
| `Commande::avancer()` | Utilise `prochainStatus()` de l'enum pour progresser |
| `?self` | Type de retour nullable : retourne un `OrderStatus` ou `null` |

---

## Fin du module PHP

Tu as terminé le module PHP. Continue avec le module **[Symfony](../03-symfony/index.md)** pour mettre tes connaissances en pratique.

---

## Navigation

← Fiche précédente : **[Les exceptions et la gestion d'erreurs](13-exceptions-gestion-erreurs.md)**
