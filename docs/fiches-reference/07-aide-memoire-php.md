---
tags:
  - Référence
  - PHP
description: "Aide-mémoire PHP : types, opérateurs, fonctions et syntaxe POO"
estimated_time: "20 min"
fiche_number: 7
total_fiches: 18
cursus: "Fiches de référence"
id: "references.quick-reference.aide-memoire-php"
course_id: "references.quick-reference"
content_type: "reference"
order: 7
---

# Aide-mémoire PHP

> **En bref** : Aide-mémoire PHP. Lecture estimée : 20 min.

Fiche de référence rapide pour la syntaxe PHP, les types, les opérateurs et les fonctions les plus courantes.

---

## Types scalaires

| Type | Exemple | Description |
| ---- | ------- | ----------- |
| `int` | `42` | Nombre entier |
| `float` | `3.14` | Nombre décimal |
| `string` | `"texte"` | Chaîne de caractères |
| `bool` | `true`, `false` | Booléen |

---

## Types composites

| Type | Exemple | Description |
| ---- | ------- | ----------- |
| `array` | `[1, 2, 3]` | Tableau indexé ou associatif |
| `object` | `new User()` | Instance de classe |
| `callable` | `function() {}` | Fonction anonyme ou référence |

---

## Opérateurs

### Comparaison

| Opérateur | Signification | Exemple |
| --------- | ------------- | ------- |
| `==` | Égal (valeur) | `1 == "1"` est `true` |
| `===` | Identique (valeur et type) | `1 === "1"` est `false` |
| `!=` | Différent (valeur) | `1 != 2` est `true` |
| `!==` | Non identique (valeur ou type) | `1 !== "1"` est `true` |
| `<=>` | Comparaison combinée (spaceship) | Retourne -1, 0 ou 1 |
| `??` | Null coalescing | `$x ?? "défaut"` |
| `?:` | Elvis | `$x ?: "défaut"` |

### Logiques

| Opérateur | Signification |
| --------- | ------------- |
| `&&` | ET logique |
| `\|\|` | OU logique |
| `!` | NON logique |

---

## Fonctions sur les tableaux

| Fonction | Action |
| -------- | ------ |
| `count($arr)` | Nombre d'éléments |
| `in_array($val, $arr)` | Vérifie si la valeur existe |
| `array_key_exists($key, $arr)` | Vérifie si la clé existe |
| `array_push($arr, $val)` | Ajoute un élément à la fin |
| `array_pop($arr)` | Retire le dernier élément |
| `array_shift($arr)` | Retire le premier élément |
| `array_merge($a, $b)` | Fusionne deux tableaux |
| `array_map($fn, $arr)` | Applique une fonction à chaque élément |
| `array_filter($arr, $fn)` | Filtre les éléments selon une condition |
| `array_keys($arr)` | Retourne les clés |
| `array_values($arr)` | Retourne les valeurs |
| `sort($arr)` | Trie par valeur (modifie le tableau) |
| `usort($arr, $fn)` | Trie avec une fonction de comparaison |
| `array_slice($arr, $offset, $length)` | Extrait une portion |
| `array_unique($arr)` | Supprime les doublons |

---

## Fonctions sur les chaînes

| Fonction | Action |
| -------- | ------ |
| `strlen($str)` | Longueur de la chaîne |
| `strtolower($str)` | Convertit en minuscules |
| `strtoupper($str)` | Convertit en majuscules |
| `trim($str)` | Supprime les espaces en début et fin |
| `substr($str, $start, $length)` | Extrait une sous-chaîne |
| `str_replace($search, $replace, $str)` | Remplace une sous-chaîne |
| `str_contains($str, $needle)` | Vérifie si la chaîne contient (PHP 8+) |
| `str_starts_with($str, $prefix)` | Vérifie le début (PHP 8+) |
| `str_ends_with($str, $suffix)` | Vérifie la fin (PHP 8+) |
| `explode($sep, $str)` | Découpe en tableau |
| `implode($sep, $arr)` | Joint un tableau en chaîne |
| `sprintf($format, ...$args)` | Formatage de chaîne |
| `number_format($n, $dec)` | Formate un nombre |

---

## Syntaxe POO

### Déclaration de classe

```php
class User
{
    // Propriété avec promotion de constructeur (PHP 8+)
    public function __construct(
        private string $name,
        private string $email,
        private int $age = 0,
    ) {}

    // Méthode publique
    public function getName(): string
    {
        return $this->name;
    }
}
```

### Visibilité

| Mot-clé | Accès |
| ------- | ----- |
| `public` | Partout |
| `protected` | Classe + sous-classes |
| `private` | Classe uniquement |

### Héritage et interfaces

```php
// Interface
interface Printable
{
    public function toString(): string;
}

// Classe abstraite
abstract class Animal
{
    abstract public function speak(): string;
}

// Implémentation
class Dog extends Animal implements Printable
{
    public function speak(): string
    {
        return "Woof";
    }

    public function toString(): string
    {
        return "Dog";
    }
}
```

### Enum (PHP 8.1+)

```php
enum Status: string
{
    case Active = 'active';
    case Inactive = 'inactive';
}

// Utilisation
$status = Status::Active;
$value = $status->value; // 'active'
```

---

## Fonctions utiles

| Fonction | Action |
| -------- | ------ |
| `var_dump($var)` | Affiche le type et la valeur |
| `print_r($var)` | Affiche la valeur (lisible) |
| `isset($var)` | Vérifie si la variable existe et n'est pas null |
| `empty($var)` | Vérifie si la variable est vide |
| `gettype($var)` | Retourne le type en chaîne |
| `is_array($var)` | Vérifie si c'est un tableau |
| `is_string($var)` | Vérifie si c'est une chaîne |
| `intval($var)` | Convertit en entier |
| `floatval($var)` | Convertit en flottant |
| `json_encode($data)` | Encode en JSON |
| `json_decode($json, true)` | Décode du JSON en tableau |

---

## Navigation

← Fiche précédente : **[Guide tmux](06-guide-tmux.md)**

→ Fiche suivante : **[Aide-mémoire JavaScript ES6+](08-aide-memoire-javascript.md)**
