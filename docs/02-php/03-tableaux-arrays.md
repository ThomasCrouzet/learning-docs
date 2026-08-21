---
tags:
  - PHP
  - Débutant
  - Pratique
description: "Les tableaux (arrays)"
estimated_time: "80 min"
fiche_number: 3
total_fiches: 14
cursus: "PHP"
id: "web.php.tableaux-arrays"
course_id: "web.php"
content_type: "lesson"
order: 3
---

# 03 - Les tableaux (arrays)

> **En bref** : À la fin de cette fiche, tu sauras créer des tableaux, accéder à leurs éléments, ajouter des valeurs, et parcourir un tableau avec une boucle foreach. Lecture estimée : 80 min.


## Prérequis

- Fiche [02-php/01 - Introduction à PHP et premiers pas](01-introduction-php.md)
- Fiche [02-php/02 - Les variables et types de données](02-variables-types.md)
- Savoir créer des variables et utiliser `echo`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des tableaux, accéder à leurs éléments, ajouter des valeurs, et parcourir un tableau avec une boucle `foreach`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un tableau ?

**Définition** : Un tableau (array) est une variable qui peut contenir plusieurs valeurs. Chaque valeur est stockée à une position identifiée par un index ou une clé.

**Le problème que les tableaux résolvent** :

Sans tableaux, voici les problèmes rencontrés :

1. **Multiplication des variables** : Pour stocker 10 prénoms, tu dois créer 10 variables différentes (`$prenom1`, `$prenom2`, ...).

2. **Pas de traitement en série** : Tu ne peux pas appliquer la même opération à toutes les valeurs.

3. **Quantité inconnue** : Si tu ne sais pas à l'avance combien de valeurs tu auras, tu ne peux pas créer les variables.

4. **Pas de regroupement logique** : Les données liées sont éparpillées dans des variables séparées.

**Comment les tableaux résolvent ces problèmes** :

| Problème                | Solution avec les tableaux                        |
| ----------------------- | ------------------------------------------------- |
| Multiplication des variables | Une seule variable contient toutes les valeurs |
| Pas de traitement en série | Une boucle peut traiter toutes les valeurs      |
| Quantité inconnue       | Le tableau s'adapte, tu peux ajouter des éléments |
| Pas de regroupement     | Les données liées sont dans le même tableau       |

**Analogie concrète** : Un tableau est comme une armoire avec des tiroirs numérotés. L'armoire (le tableau) est une seule unité. Chaque tiroir (index) contient un objet (valeur). Tu peux ouvrir n'importe quel tiroir en connaissant son numéro.

**Ce qu'un tableau n'est PAS** :

- Un tableau n'est pas une base de données. Un tableau existe uniquement pendant l'exécution du script PHP. Il disparaît ensuite.
- Un tableau n'est pas limité à un seul type. Tu peux mélanger des strings, des integers, des booleans dans le même tableau (même si ce n'est pas recommandé).

---

### Les deux types de tableaux

PHP a deux types de tableaux :

| Type | Description | Exemple d'index |
| ---- | ----------- | --------------- |
| Tableau indexé | Les éléments sont numérotés automatiquement | 0, 1, 2, 3... |
| Tableau associatif | Les éléments ont des clés nommées | "nom", "age", "ville" |

---

### Tableau indexé (numéroté)

**Définition** : Un tableau indexé utilise des numéros comme index. Ces numéros commencent à 0 (pas à 1).

**Règle importante** : Le premier élément est à l'index 0, le deuxième à l'index 1, etc.

| Position humaine | Index PHP |
| ---------------- | --------- |
| Premier élément | Index 0 |
| Deuxième élément | Index 1 |
| Troisième élément | Index 2 |
| n-ième élément | Index n-1 |

**Syntaxe pour créer un tableau indexé** :

```php
<?php
// Méthode 1 : Avec la fonction array()
$fruits = array("pomme", "banane", "orange");

// Méthode 2 : Avec les crochets (syntaxe moderne, recommandée)
$fruits = ["pomme", "banane", "orange"];
```

**Visualisation du tableau** :

| Index | Valeur |
| ----- | ------ |
| 0 | "pomme" |
| 1 | "banane" |
| 2 | "orange" |

**Accéder à un élément** :

```php
<?php
$fruits = ["pomme", "banane", "orange"];

echo $fruits[0];  // Affiche : pomme
echo $fruits[1];  // Affiche : banane
echo $fruits[2];  // Affiche : orange
```

---

### Tableau associatif (avec clés nommées)

**Définition** : Un tableau associatif utilise des noms (clés) au lieu de numéros pour identifier chaque élément. C'est utile pour des données structurées.

**Syntaxe** : Utilise la flèche `=>` pour associer une clé à une valeur.

```php
<?php
$personne = [
    "prenom" => "Clara",
    "nom" => "Martin",
    "age" => 23,
    "ville" => "Lyon"
];
```

**Visualisation du tableau** :

| Clé | Valeur |
| --- | ------ |
| `"prenom"` | "Clara" |
| "nom" | "Martin" |
| "age" | 23 |
| "ville" | "Lyon" |

**Accéder à un élément** :

```php
<?php
$personne = [
    "prenom" => "Clara",
    "nom" => "Martin",
    "age" => 23
];

echo $personne["prenom"];  // Affiche : Clara
echo $personne["age"];     // Affiche : 23
```

**Différence clé importante** :

| Tableau indexé | Tableau associatif |
| -------------- | ------------------ |
| `$fruits[0]` | `$personne["prenom"]` |
| Index numérique entre crochets | Clé string entre guillemets dans les crochets |

---

### Ajouter un élément à un tableau

**Pour un tableau indexé** : Utilise `[]` à la fin du nom pour ajouter automatiquement à la suite.

```php
<?php
$fruits = ["pomme", "banane"];

// Ajoute "orange" à l'index 2
$fruits[] = "orange";

// Le tableau contient maintenant : ["pomme", "banane", "orange"]
```

**Pour un tableau associatif** : Spécifie la clé.

```php
<?php
$personne = [
    "prenom" => "Clara",
    "nom" => "Martin"
];

// Ajoute une nouvelle paire clé/valeur
$personne["age"] = 23;

// Le tableau contient maintenant : ["prenom" => "Clara", "nom" => "Martin", "age" => 23]
```

---

### Modifier un élément

Pour modifier un élément, assigne une nouvelle valeur à son index ou sa clé :

```php
<?php
// Tableau indexé
$fruits = ["pomme", "banane", "orange"];
$fruits[1] = "kiwi";  // Remplace "banane" par "kiwi"

// Tableau associatif
$personne = ["prenom" => "Clara", "age" => 23];
$personne["age"] = 24;  // Change l'âge de 23 à 24
```

---

### Parcourir un tableau avec foreach

**Définition** : La boucle `foreach` permet de parcourir tous les éléments d'un tableau, un par un. C'est la méthode la plus courante pour traiter les tableaux en PHP.

**Syntaxe pour un tableau indexé** :

```php
<?php
foreach ($tableau as $valeur) {
    // Code à exécuter pour chaque valeur
}
```

**Exemple** :

```php
<?php
$fruits = ["pomme", "banane", "orange"];

foreach ($fruits as $fruit) {
    echo $fruit . "<br>";
}

// Affiche :
// pomme
// banane
// orange
```

**Explication** :

- `$fruits` : le tableau à parcourir
- `as` : mot-clé obligatoire
- `$fruit` : variable temporaire qui contient la valeur actuelle à chaque tour

**Syntaxe pour un tableau associatif (avec clé et valeur)** :

```php
<?php
foreach ($tableau as $cle => $valeur) {
    // Code avec accès à la clé et à la valeur
}
```

**Exemple** :

```php
<?php
$personne = [
    "prenom" => "Clara",
    "nom" => "Martin",
    "age" => 23
];

foreach ($personne as $cle => $valeur) {
    echo $cle . " : " . $valeur . "<br>";
}

// Affiche :
// prenom : Clara
// nom : Martin
// age : 23
```

---

### Fonctions utiles pour les tableaux

PHP fournit de nombreuses fonctions pour manipuler les tableaux :

| Fonction | Description | Exemple |
| -------- | ----------- | ------- |
| `count($array)` | Compte le nombre d'éléments | `count($fruits)` → 3 |
| `array_push($array, $val)` | Ajoute un élément à la fin | `array_push($fruits, "kiwi")` |
| `in_array($val, $array)` | Vérifie si une valeur existe | `in_array("pomme", $fruits)` → true |
| `array_keys($array)` | Retourne toutes les clés | `array_keys($personne)` → `["prenom", "nom", "age"]` |
| `array_values($array)` | Retourne toutes les valeurs | `array_values($personne)` → ["Clara", "Martin", 23] |
| `isset($array[$key])` | Vrai si la clé existe et la valeur n'est pas `null` | `isset($personne["prenom"])` → true |
| `array_key_exists($key, $array)` | Vrai si la clé existe, même si la valeur est `null` | `array_key_exists("prenom", $personne)` |
| `unset($array[$key])` | Supprime un élément | `unset($fruits[0])` |
| `sort($array)` | Trie par valeur (croissant) | `sort($fruits)` |
| `array_merge($a, $b)` | Fusionne deux tableaux | `array_merge($fruits, $legumes)` |

---

### Tableaux multidimensionnels

**Définition** : Un tableau multidimensionnel est un tableau qui contient d'autres tableaux. C'est utile pour représenter des données complexes.

**Exemple : liste de personnes** :

```php
<?php
$personnes = [
    [
        "prenom" => "Clara",
        "age" => 23
    ],
    [
        "prenom" => "John",
        "age" => 35
    ],
    [
        "prenom" => "Marie",
        "age" => 28
    ]
];
```

**Accéder aux données** :

```php
<?php
// Accéder au premier élément du tableau (une personne)
echo $personnes[0]["prenom"];  // Affiche : Clara

// Accéder à la deuxième personne
echo $personnes[1]["age"];     // Affiche : 35
```

**Parcourir un tableau multidimensionnel** :

```php
<?php
foreach ($personnes as $personne) {
    echo $personne["prenom"] . " a " . $personne["age"] . " ans.<br>";
}

// Affiche :
// Clara a 23 ans.
// John a 35 ans.
// Marie a 28 ans.
```

---

### Afficher un tableau avec print_r

**Définition** : `print_r()` affiche la structure complète d'un tableau de façon lisible. C'est utile pour débuguer.

**Syntaxe** :

```php
<?php
$fruits = ["pomme", "banane", "orange"];
print_r($fruits);
```

**Résultat** :

```text
Array
(
    [0] => pomme
    [1] => banane
    [2] => orange
)
```

**Astuce** : Entoure `print_r()` de balises `<pre>` pour un affichage formaté dans le navigateur :

```php
<?php
echo "<pre>";
print_r($fruits);
echo "</pre>";
```

---

## Étapes Pratiques

### Étape 1 : Créer un tableau indexé

Crée un fichier `public/tableaux.php` :

```php
<?php
// Création d'un tableau indexé de fruits

$fruits = ["pomme", "banane", "orange", "kiwi", "mangue"];

// Affichage de tous les éléments avec leur index
echo "<h1>Liste des fruits</h1>";
echo "<ul>";

echo "<li>Index 0 : " . $fruits[0] . "</li>";
echo "<li>Index 1 : " . $fruits[1] . "</li>";
echo "<li>Index 2 : " . $fruits[2] . "</li>";
echo "<li>Index 3 : " . $fruits[3] . "</li>";
echo "<li>Index 4 : " . $fruits[4] . "</li>";

echo "</ul>";

// Nombre d'éléments
echo "<p>Nombre de fruits : " . count($fruits) . "</p>";
```

**Résultat attendu** :

```text
Liste des fruits

• Index 0 : pomme
• Index 1 : banane
• Index 2 : orange
• Index 3 : kiwi
• Index 4 : mangue

Nombre de fruits : 5
```

---

### Étape 2 : Parcourir avec foreach

Modifie le fichier `public/tableaux.php` pour utiliser `foreach` :

```php
<?php
// Création d'un tableau indexé de fruits

$fruits = ["pomme", "banane", "orange", "kiwi", "mangue"];

echo "<h1>Liste des fruits (avec foreach)</h1>";
echo "<ul>";

// Parcours du tableau avec foreach
foreach ($fruits as $fruit) {
    echo "<li>" . $fruit . "</li>";
}

echo "</ul>";

echo "<p>Nombre de fruits : " . count($fruits) . "</p>";
```

**Résultat attendu** :

```text
Liste des fruits (avec foreach)

• pomme
• banane
• orange
• kiwi
• mangue

Nombre de fruits : 5
```

---

### Étape 3 : Créer un tableau associatif

Crée un fichier `public/associatif.php` :

```php
<?php
// Création d'un tableau associatif pour une personne

$etudiant = [
    "prenom" => "Clara",
    "nom" => "Martin",
    "age" => 23,
    "ville" => "Lyon",
    "formation" => "informatique"
];

echo "<h1>Fiche étudiant</h1>";

// Accès direct aux valeurs
echo "<p><strong>Prénom :</strong> " . $etudiant["prenom"] . "</p>";
echo "<p><strong>Nom :</strong> " . $etudiant["nom"] . "</p>";
echo "<p><strong>Âge :</strong> " . $etudiant["age"] . " ans</p>";
echo "<p><strong>Ville :</strong> " . $etudiant["ville"] . "</p>";
echo "<p><strong>Formation :</strong> " . $etudiant["formation"] . "</p>";
```

**Résultat attendu** :

```text
Fiche étudiant

Prénom : Clara
Nom : Martin
Âge : 23 ans
Ville : Lyon
Formation : informatique
```

---

### Étape 4 : Parcourir un tableau associatif avec clé et valeur

Modifie `public/associatif.php` pour utiliser `foreach` avec clé et valeur :

```php
<?php
$etudiant = [
    "prenom" => "Clara",
    "nom" => "Martin",
    "age" => 23,
    "ville" => "Lyon",
    "formation" => "informatique"
];

echo "<h1>Fiche étudiant (avec foreach)</h1>";
echo "<table border='1'>";
echo "<tr><th>Champ</th><th>Valeur</th></tr>";

// Parcours avec accès à la clé et à la valeur
foreach ($etudiant as $champ => $valeur) {
    echo "<tr>";
    echo "<td>" . $champ . "</td>";
    echo "<td>" . $valeur . "</td>";
    echo "</tr>";
}

echo "</table>";
```

**Résultat attendu** : Un tableau HTML avec deux colonnes (Champ et Valeur).

---

### Étape 5 : Ajouter et modifier des éléments

Crée un fichier `public/modification-tableau.php` :

```php
<?php
// Tableau initial
$courses = ["pain", "lait", "beurre"];

echo "<h1>Liste de courses</h1>";

// Affichage initial
echo "<h2>Liste initiale</h2>";
echo "<pre>";
print_r($courses);
echo "</pre>";

// Ajouter un élément
$courses[] = "oeufs";

echo "<h2>Après ajout de 'oeufs'</h2>";
echo "<pre>";
print_r($courses);
echo "</pre>";

// Modifier un élément
$courses[0] = "baguette";  // Remplace "pain" par "baguette"

echo "<h2>Après modification de l'index 0</h2>";
echo "<pre>";
print_r($courses);
echo "</pre>";

// Supprimer un élément
unset($courses[1]);  // Supprime "lait"

echo "<h2>Après suppression de l'index 1</h2>";
echo "<pre>";
print_r($courses);
echo "</pre>";
```

**Résultat attendu** :

```text
Liste de courses

Liste initiale
Array
(
    [0] => pain
    [1] => lait
    [2] => beurre
)

Après ajout de 'oeufs'
Array
(
    [0] => pain
    [1] => lait
    [2] => beurre
    [3] => oeufs
)

Après modification de l'index 0
Array
(
    [0] => baguette
    [1] => lait
    [2] => beurre
    [3] => oeufs
)

Après suppression de l'index 1
Array
(
    [0] => baguette
    [2] => beurre
    [3] => oeufs
)
```

**Note** : Après `unset()`, l'index 1 n'existe plus. Les index ne sont pas réorganisés.

---

### Étape 6 : Utiliser in_array et isset

Crée un fichier `public/recherche-tableau.php` :

```php
<?php
$fruits = ["pomme", "banane", "orange", "kiwi"];

echo "<h1>Recherche dans un tableau</h1>";

// Vérifier si une valeur existe
$fruitRecherche = "banane";
if (in_array($fruitRecherche, $fruits)) {
    echo "<p>'$fruitRecherche' est dans la liste.</p>";
} else {
    echo "<p>'$fruitRecherche' n'est pas dans la liste.</p>";
}

// Vérifier si un index existe
if (isset($fruits[2])) {
    echo "<p>L'index 2 existe et contient : " . $fruits[2] . "</p>";
}

// Vérifier un index qui n'existe pas
if (isset($fruits[10])) {
    echo "<p>L'index 10 existe.</p>";
} else {
    echo "<p>L'index 10 n'existe pas.</p>";
}
```

**Résultat attendu** :

```text
Recherche dans un tableau

'banane' est dans la liste.

L'index 2 existe et contient : orange

L'index 10 n'existe pas.
```

---

### Étape 7 : Tableau multidimensionnel (liste de personnes)

Crée un fichier `public/multi-tableau.php` :

```php
<?php
// Tableau de personnes (tableau multidimensionnel)
$etudiants = [
    [
        "prenom" => "Clara",
        "nom" => "Martin",
        "note" => 15
    ],
    [
        "prenom" => "John",
        "nom" => "Bernard",
        "note" => 17
    ],
    [
        "prenom" => "Marie",
        "nom" => "Dupont",
        "note" => 14
    ]
];

echo "<h1>Liste des étudiants</h1>";
echo "<table border='1'>";
echo "<tr><th>Prénom</th><th>Nom</th><th>Note</th></tr>";

// Parcours du tableau de tableaux
foreach ($etudiants as $etudiant) {
    echo "<tr>";
    echo "<td>" . $etudiant["prenom"] . "</td>";
    echo "<td>" . $etudiant["nom"] . "</td>";
    echo "<td>" . $etudiant["note"] . "/20</td>";
    echo "</tr>";
}

echo "</table>";

// Calcul de la moyenne de classe
$sommeNotes = 0;
foreach ($etudiants as $etudiant) {
    $sommeNotes = $sommeNotes + $etudiant["note"];
}
$moyenneClasse = $sommeNotes / count($etudiants);

echo "<p>Moyenne de la classe : " . $moyenneClasse . "/20</p>";
```

**Résultat attendu** : Un tableau HTML avec la liste des étudiants et la moyenne de classe.

---

## Commandes Utiles

| Fonction | Description | Exemple |
| -------- | ----------- | ------- |
| `count($array)` | Nombre d'éléments | `count($fruits)` |
| `print_r($array)` | Affiche la structure du tableau | `print_r($fruits)` |
| `var_dump($array)` | Affiche structure avec types | `var_dump($fruits)` |
| `in_array($val, $array)` | Vérifie si valeur existe | `in_array("pomme", $fruits)` |
| `isset($array[$key])` | Vérifie si index/clé existe | `isset($fruits[0])` |
| `array_push($array, $val)` | Ajoute à la fin | `array_push($fruits, "kiwi")` |
| `unset($array[$key])` | Supprime un élément | `unset($fruits[0])` |

---

## Pièges Fréquents

### Piège 1 : Les index commencent à 0, pas à 1

**Problème** : Tu essaies d'accéder au premier élément avec `$array[1]`.

**Solution** : Le premier élément est à l'index 0.

```php
<?php
$fruits = ["pomme", "banane", "orange"];

// Incorrect (c'est le deuxième élément)
echo $fruits[1];  // Affiche : banane

// Correct (premier élément)
echo $fruits[0];  // Affiche : pomme
```

---

### Piège 2 : Accéder à un index qui n'existe pas

**Problème** : Erreur "Undefined array key" ou "Undefined offset".

**Solution** : Vérifie d'abord avec `isset()` si l'index existe.

```php
<?php
$fruits = ["pomme", "banane"];

// Incorrect (erreur car l'index 5 n'existe pas)
// echo $fruits[5];

// Correct (vérification préalable)
if (isset($fruits[5])) {
    echo $fruits[5];
} else {
    echo "Cet index n'existe pas.";
}
```

---

### Piège 3 : Oublier les guillemets pour les clés string

**Problème** : Erreur ou comportement inattendu avec un tableau associatif.

**Solution** : Les clés string doivent être entre guillemets.

```php
<?php
$personne = ["prenom" => "Clara"];

// Incorrect : sans guillemets, prenom est traité comme une constante (Error: Undefined constant en PHP 8.x)
// echo $personne[prenom];

// Correct
echo $personne["prenom"];
```

---

### Piège 4 : Confondre [] et array()

**Problème** : Les deux syntaxes existent mais `[]` est plus moderne.

**Solution** : Utilise `[]` (syntaxe courte, recommandée depuis PHP 5.4).

```php
<?php
// Ancienne syntaxe (fonctionne encore)
$fruits = array("pomme", "banane");

// Nouvelle syntaxe (recommandée)
$fruits = ["pomme", "banane"];
```

---

### Piège 5 : Modifier le tableau pendant foreach

**Problème** : Résultats imprévisibles si tu modifies le tableau pendant la boucle.

**Solution** : Ne modifie pas directement le tableau dans un `foreach`. Crée une copie ou utilise une autre méthode.

```php
<?php
$nombres = [1, 2, 3, 4, 5];

// Incorrect (comportement imprévisible)
// foreach ($nombres as $nombre) {
//     $nombres[] = $nombre * 2;  // Ajoute pendant la boucle
// }

// Correct (crée un nouveau tableau)
$doubles = [];
foreach ($nombres as $nombre) {
    $doubles[] = $nombre * 2;
}
```

---

### Piège 6 : unset() ne réorganise pas les index

**Problème** : Après `unset()`, il y a des "trous" dans les index.

**Solution** : Utilise `array_values()` pour réindexer si nécessaire.

```php
<?php
$fruits = ["pomme", "banane", "orange"];
unset($fruits[1]);  // Supprime "banane"

// Le tableau a maintenant les index 0 et 2 (pas de 1)
print_r($fruits);
// Array ( [0] => pomme [2] => orange )

// Pour réindexer
$fruits = array_values($fruits);
print_r($fruits);
// Array ( [0] => pomme [1] => orange )
```

---

## Checklist de Validation

- [ ] J'ai compris la différence entre tableau indexé et tableau associatif
- [ ] J'ai compris que les index commencent à 0
- [ ] J'ai créé un tableau indexé avec `[]`
- [ ] J'ai créé un tableau associatif avec `"clé" => valeur`
- [ ] J'ai accédé à des éléments avec `$array[index]` ou `$array["clé"]`
- [ ] J'ai ajouté des éléments à un tableau
- [ ] J'ai parcouru un tableau avec `foreach`
- [ ] J'ai utilisé `count()` pour compter les éléments
- [ ] J'ai utilisé `print_r()` pour afficher la structure d'un tableau
- [ ] J'ai compris les tableaux multidimensionnels

---

## Exercice Pratique

**Énoncé** : Crée un carnet d'adresses simple.

**Indications** :

- Crée un fichier `public/carnet.php`
- Crée un tableau `$contacts` qui contient 3 contacts
- Chaque contact est un tableau associatif avec : "nom", "email", "telephone"
- Affiche la liste des contacts dans un tableau HTML
- Compte et affiche le nombre total de contacts
- Affiche les informations du premier contact séparément

**Résultat attendu** : Un tableau HTML avec 3 contacts et le nombre total affiché.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// Fichier : public/carnet.php
// Carnet d'adresses simple

// Création du tableau de contacts
$contacts = [
    [
        "nom" => "Marie Dupont",
        "email" => "marie.dupont@email.com",
        "telephone" => "06 12 34 56 78"
    ],
    [
        "nom" => "Jean Martin",
        "email" => "jean.martin@email.com",
        "telephone" => "06 98 76 54 32"
    ],
    [
        "nom" => "Sophie Bernard",
        "email" => "sophie.bernard@email.com",
        "telephone" => "06 11 22 33 44"
    ]
];
?>
<!DOCTYPE html>
<html>
<head>
    <title>Carnet d'adresses</title>
</head>
<body>
    <h1>Carnet d'adresses</h1>

    <p>Nombre de contacts : <?php echo count($contacts); ?></p>

    <table border="1">
        <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
        </tr>
        <?php foreach ($contacts as $contact): ?>
        <tr>
            <td><?php echo $contact["nom"]; ?></td>
            <td><?php echo $contact["email"]; ?></td>
            <td><?php echo $contact["telephone"]; ?></td>
        </tr>
        <?php endforeach; ?>
    </table>

    <h2>Premier contact</h2>

    <p>
        Le premier contact est <strong><?php echo $contacts[0]["nom"]; ?></strong>.
        Son email est <?php echo $contacts[0]["email"]; ?>.
    </p>
</body>
</html>
```

**Explication de la solution** :

| Élément | Explication |
| ------- | ----------- |
| `$contacts = [...]` | Tableau contenant 3 tableaux associatifs |
| `count($contacts)` | Retourne 3 (nombre de contacts) |
| `foreach ($contacts as $contact)` | Parcourt chaque contact |
| `$contact["nom"]` | Accède au nom du contact courant |
| `$contacts[0]["nom"]` | Accède au nom du premier contact (index 0) |
| `<?php foreach (...): ?>` | Syntaxe alternative de foreach (avec `:` et `endforeach`) |

**Note sur la syntaxe alternative** : `foreach (...):` avec `endforeach;` est équivalent à `foreach (...) { }`. Cette syntaxe est plus lisible quand on mélange PHP et HTML.

---

## Navigation

← Fiche précédente : **[Les variables et types de données](02-variables-types.md)**

→ Fiche suivante : **[Les conditions (if, else, switch)](04-conditions.md)**
