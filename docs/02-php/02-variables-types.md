---
tags:
  - PHP
  - Débutant
  - Pratique
description: "Les variables et types de données"
estimated_time: "80 min"
fiche_number: 2
total_fiches: 14
cursus: "PHP"
---

# 02 - Les variables et types de données

> **En bref** : À la fin de cette fiche, tu sauras créer des variables, leur assigner des valeurs de différents types (texte, nombres, booléens), et les afficher. Lecture estimée : 80 min.


## Prérequis

- Fiche [02-php/01 - Introduction à PHP et premiers pas](01-introduction-php.md)
- Savoir créer un fichier PHP dans le dossier `public/`
- Savoir utiliser `echo` pour afficher du texte

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des variables, leur assigner des valeurs de différents types (texte, nombres, booléens), et les afficher.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une variable ?

**Définition** : Une variable est un espace de stockage nommé qui contient une valeur. Cette valeur peut changer au cours du programme.

**Le problème que les variables résolvent** :

Sans variables, voici les problèmes rencontrés :

1. **Répétition** : Tu dois réécrire la même valeur partout. Si tu veux afficher "Bonjour Marie" 10 fois, tu écris "Marie" 10 fois.

2. **Modification difficile** : Si tu veux changer "Marie" en "Pierre", tu dois modifier 10 endroits dans ton code.

3. **Pas de calculs** : Tu ne peux pas stocker un résultat pour l'utiliser plus tard. Chaque calcul doit être refait.

4. **Pas de données dynamiques** : Tu ne peux pas stocker une valeur qui vient de l'utilisateur ou de la base de données.

**Comment les variables résolvent ces problèmes** :

| Problème            | Solution avec variables                                    |
| ------------------- | ---------------------------------------------------------- |
| Répétition          | Tu stockes la valeur une fois et tu utilises la variable   |
| Modification difficile | Tu modifies la valeur à un seul endroit                  |
| Pas de calculs      | Tu stockes le résultat dans une variable pour le réutiliser |
| Pas de données dynamiques | Tu stockes les données reçues dans des variables      |

**Analogie concrète** : Une variable est comme une boîte étiquetée. L'étiquette est le nom de la variable (exemple : "prénom"). Le contenu de la boîte est la valeur (exemple : "Marie"). Tu peux :

- Lire le contenu de la boîte (utiliser la variable)
- Remplacer le contenu (modifier la valeur)
- Avoir plusieurs boîtes avec des étiquettes différentes

**Ce qu'une variable n'est PAS** :

- Une variable n'est pas permanente. Quand le script PHP termine son exécution, toutes les variables disparaissent. Pour stocker des données de façon permanente, tu utilises une base de données.
- Une variable n'est pas partagée entre les requêtes. Si un visiteur A crée une variable, le visiteur B ne la voit pas.

---

### La syntaxe des variables en PHP

**Règle fondamentale** : En PHP, toutes les variables commencent par le signe dollar `$`.

**Syntaxe pour créer une variable** :

```php
<?php
$nomDeLaVariable = valeur;
```

**Les trois parties** :

| Partie | Exemple | Explication |
| ------ | ------- | ----------- |
| `$` | `$` | Obligatoire, indique que c'est une variable |
| Nom | `prenom` | Le nom que tu choisis pour identifier la variable |
| `=` | `=` | L'opérateur d'affectation (met la valeur dans la variable) |
| Valeur | `"Marie"` | Ce que tu stockes dans la variable |

**Règles de nommage des variables** :

| Règle | Exemple correct | Exemple incorrect |
| ----- | --------------- | ----------------- |
| Commence par `$` | `$age` | `age` |
| Après `$`, une lettre ou underscore | `$nom`, `$_nom` | `$1nom` |
| Peut contenir lettres, chiffres, underscore | `$prenom2`, `$mon_age` | `$mon-age` (tiret interdit) |
| Sensible à la casse | `$nom` et `$Nom` sont différentes | - |
| Pas d'espaces | `$monNom` | `$mon nom` |
| Pas d'accents (recommandé) | `$prenom` | `$prénom` |

**Convention de nommage recommandée : camelCase**

En PHP, la convention est d'écrire les variables en "camelCase" :

- Premier mot en minuscules
- Chaque mot suivant commence par une majuscule
- Pas d'underscore entre les mots

| camelCase (recommandé) | Autres styles (à éviter) |
| ---------------------- | ------------------------ |
| `$firstName` | `$first_name` (snake_case) |
| `$dateOfBirth` | `$dateofbirth` (illisible) |
| `$totalPrice` | `$TotalPrice` (PascalCase, réservé aux classes) |

---

### Les types de données

Le diagramme suivant présente la classification des types de données en PHP :

<div class="diagram-design">
<p><a href="../../diagrams/02-php-02-variables-types-1.html">Les types de données (HTML + SVG)</a></p>
<iframe src="../../diagrams/02-php-02-variables-types-1.html" title="Les types de données" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Définition** : Le type de données définit quelle sorte de valeur une variable contient. PHP détermine automatiquement le type selon la valeur assignée.

**Les types principaux en PHP** :

| Type | Nom anglais | Description | Exemple |
| ---- | ----------- | ----------- | ------- |
| Chaîne de caractères | string | Du texte | `"Bonjour"` |
| Nombre entier | integer (int) | Un nombre sans virgule | `42` |
| Nombre décimal | float (double) | Un nombre avec virgule | `3.14` |
| Booléen | boolean (bool) | Vrai ou faux | `true` ou `false` |
| Tableau | array | Une liste de valeurs | (fiche suivante) |
| Null | null | Absence de valeur | `null` |

**PHP est "faiblement typé"** :

Cela signifie que :

- Tu ne déclares pas le type à l'avance
- PHP devine le type selon la valeur
- Le type peut changer si tu assignes une nouvelle valeur différente

```php
<?php
$x = 42;       // $x est un integer
$x = "texte";  // maintenant $x est un string (le type a changé)
```

---

### Le type string (chaîne de caractères)

**Définition** : Un string est une suite de caractères (lettres, chiffres, symboles, espaces). C'est le type utilisé pour le texte.

**Syntaxe** : Le texte doit être entre guillemets doubles `"texte"` ou simples `'texte'`.

**Différence entre guillemets doubles et simples** :

| Guillemets doubles `"..."` | Guillemets simples `'...'` |
| -------------------------- | -------------------------- |
| Interprète les variables | N'interprète pas les variables |
| Interprète les caractères spéciaux (`\n`) | N'interprète pas les caractères spéciaux |

**Exemples** :

```php
<?php
$prenom = "Marie";

// Guillemets doubles : la variable est remplacée par sa valeur
echo "Bonjour $prenom";  // Affiche : Bonjour Marie

// Guillemets simples : la variable n'est pas interprétée
echo 'Bonjour $prenom';  // Affiche : Bonjour $prenom (littéralement)
```

**Caractères spéciaux dans les strings** :

| Caractère | Signification | Fonctionne avec |
| --------- | ------------- | --------------- |
| `\n` | Retour à la ligne | Guillemets doubles seulement |
| `\t` | Tabulation | Guillemets doubles seulement |
| `\\` | Affiche un backslash | Les deux |
| `\"` | Affiche un guillemet double | Guillemets doubles |
| `\'` | Affiche un guillemet simple | Guillemets simples |

**Exemple de caractères spéciaux** :

```php
<?php
// \n crée un retour à la ligne dans le code source HTML
echo "Ligne 1\nLigne 2";

// Pour afficher un guillemet dans un string
echo "Il a dit \"Bonjour\"";  // Affiche : Il a dit "Bonjour"
```

---

### Le type integer (nombre entier)

**Définition** : Un integer est un nombre entier, positif ou négatif, sans virgule.

**Syntaxe** : Écris le nombre directement, sans guillemets.

```php
<?php
$age = 25;           // Nombre positif
$temperature = -5;   // Nombre négatif
$zero = 0;           // Zéro
```

**Attention** : Si tu mets des guillemets, ce n'est plus un integer mais un string.

```php
<?php
$nombre = 42;    // Ceci est un integer
$texte = "42";   // Ceci est un string (même si ça ressemble à un nombre)
```

**Opérations sur les integers** :

| Opération | Symbole | Exemple | Résultat |
| --------- | ------- | ------- | -------- |
| Addition | `+` | `5 + 3` | `8` |
| Soustraction | `-` | `5 - 3` | `2` |
| Multiplication | `*` | `5 * 3` | `15` |
| Division | `/` | `6 / 3` | `2` |
| Modulo (reste) | `%` | `7 % 3` | `1` |

---

### Le type float (nombre décimal)

**Définition** : Un float est un nombre avec une partie décimale (après la virgule). En programmation, on utilise le point `.` et non la virgule `,` pour les décimales.

**Syntaxe** :

```php
<?php
$prix = 19.99;        // Nombre décimal positif
$temperature = -3.5;  // Nombre décimal négatif
$pi = 3.14159;        // Nombre avec plusieurs décimales
```

**Attention au point** : En PHP (et dans la plupart des langages), le séparateur décimal est le point, pas la virgule.

```php
<?php
$correct = 3.14;    // Correct
// $incorrect = 3,14;  // Incorrect (erreur de syntaxe)
```

---

### Le type boolean (booléen)

**Définition** : Un boolean ne peut avoir que deux valeurs : `true` (vrai) ou `false` (faux). Il sert à représenter des états binaires.

**Syntaxe** : Écris `true` ou `false` sans guillemets.

```php
<?php
$estConnecte = true;    // L'utilisateur est connecté
$estAdmin = false;      // L'utilisateur n'est pas administrateur
```

**Ce que boolean n'est PAS** :

- `"true"` (avec guillemets) n'est pas un boolean, c'est un string
- `1` n'est pas un boolean, c'est un integer (même si PHP les traite comme équivalents dans un contexte booléen)

**Utilisation** : Les booléens sont utilisés principalement dans les conditions (fiche 04).

```php
<?php
$majeur = true;

// Si $majeur est vrai, affiche le message
if ($majeur) {
    echo "Vous pouvez entrer.";
}
```

---

### Le type null

**Définition** : `null` représente l'absence de valeur. Une variable qui vaut `null` existe mais ne contient rien.

**Syntaxe** :

```php
<?php
$valeur = null;  // La variable existe mais n'a pas de valeur
```

**Différence entre null et autres valeurs "vides"** :

| Valeur | Type | Signification |
| ------ | ---- | ------------- |
| `null` | null | Absence de valeur (variable non définie) |
| `""` | string | Chaîne vide (texte sans caractères) |
| `0` | integer | Le nombre zéro |
| `false` | boolean | Valeur fausse |

---

### La concaténation

**Définition** : La concaténation est l'action de coller plusieurs chaînes de caractères bout à bout. En PHP, on utilise le point `.` pour concaténer.

**Syntaxe** :

```php
<?php
$resultat = "texte1" . "texte2";  // Résultat : "texte1texte2"
```

**Exemples** :

```php
<?php
$prenom = "Marie";
$nom = "Dupont";

// Concaténation de variables et de texte
$nomComplet = $prenom . " " . $nom;
echo $nomComplet;  // Affiche : Marie Dupont

// Concaténation dans un echo
echo "Bonjour " . $prenom . " !";  // Affiche : Bonjour Marie !
```

**Alternative avec les guillemets doubles** :

Avec les guillemets doubles, tu peux insérer des variables directement sans concaténation :

```php
<?php
$prenom = "Marie";

// Ces deux lignes produisent le même résultat
echo "Bonjour " . $prenom . " !";  // Avec concaténation
echo "Bonjour $prenom !";          // Avec interpolation (guillemets doubles)
```

**L'opérateur `.=` (concaténation et affectation)** :

Cet opérateur ajoute du texte à la fin d'une variable existante.

```php
<?php
$message = "Bonjour";
$message .= " Marie";  // Équivalent à : $message = $message . " Marie"
$message .= " !";

echo $message;  // Affiche : Bonjour Marie !
```

---

### Connaître le type d'une variable

PHP fournit des fonctions pour connaître le type d'une variable :

| Fonction | Description | Exemple de retour |
| -------- | ----------- | ----------------- |
| `gettype($var)` | Retourne le type en texte | `"string"`, `"integer"`, `"boolean"` |
| `var_dump($var)` | Affiche le type ET la valeur | `string(5) "Marie"` |

**Exemple avec `var_dump`** :

```php
<?php
$prenom = "Marie";
$age = 25;
$estEtudiant = true;

var_dump($prenom);     // Affiche : string(5) "Marie"
var_dump($age);        // Affiche : int(25)
var_dump($estEtudiant); // Affiche : bool(true)
```

**Explication de `var_dump`** :

- `string(5)` : type string, 5 caractères
- `"Marie"` : la valeur
- `int(25)` : type integer, valeur 25
- `bool(true)` : type boolean, valeur true

---

## Étapes Pratiques

### Étape 1 : Créer des variables de différents types

Crée un fichier `public/variables.php` :

```php
<?php
// Création de variables de différents types

// Type string (texte)
$prenom = "Bob";
$ville = "Lyon";

// Type integer (nombre entier)
$age = 23;
$anneeNaissance = 2001;

// Type float (nombre décimal)
$taille = 1.65;
$moyenne = 14.5;

// Type boolean (vrai/faux)
$estEtudiante = true;
$aPermis = false;

// Type null
$adresse = null;

// Affichage pour vérifier
echo "Prénom : " . $prenom;
```

**Résultat attendu** :

```text
Prénom : Bob
```

---

### Étape 2 : Utiliser les variables dans des phrases

Modifie le fichier `public/variables.php` pour ajouter à la fin :

```php
<?php
// ... (garde le code précédent)

// Affichage des informations
echo "<h1>Fiche de présentation</h1>";

echo "<p>Je m'appelle " . $prenom . " et j'ai " . $age . " ans.</p>";

echo "<p>J'habite à " . $ville . ".</p>";

echo "<p>Je mesure " . $taille . " mètre.</p>";

echo "<p>Ma moyenne est de " . $moyenne . "/20.</p>";
```

**Résultat attendu dans le navigateur** :

```text
Fiche de présentation

Je m'appelle Bob et j'ai 23 ans.

J'habite à Lyon.

Je mesure 1.65 mètre.

Ma moyenne est de 14.5/20.
```

---

### Étape 3 : Faire des calculs avec les variables

Crée un fichier `public/calculs.php` :

```php
<?php
// Calculs avec des variables numériques

$prixUnitaire = 29.99;
$quantite = 3;

// Calcul du total
$total = $prixUnitaire * $quantite;

// Affichage
echo "<h1>Facture</h1>";
echo "<p>Prix unitaire : " . $prixUnitaire . " euros</p>";
echo "<p>Quantité : " . $quantite . "</p>";
echo "<p>Total : " . $total . " euros</p>";

// Calcul avec réduction
$reduction = 10;  // Réduction de 10%
$montantReduction = $total * $reduction / 100;
$totalApresReduction = $total - $montantReduction;

echo "<h2>Avec réduction de " . $reduction . "%</h2>";
echo "<p>Montant de la réduction : " . $montantReduction . " euros</p>";
echo "<p>Total après réduction : " . $totalApresReduction . " euros</p>";
```

**Résultat attendu** :

```text
Facture

Prix unitaire : 29.99 euros
Quantité : 3
Total : 89.97 euros

Avec réduction de 10%
Montant de la réduction : 8.997 euros
Total après réduction : 80.973 euros
```

---

### Étape 4 : Modifier une variable

Crée un fichier `public/modification.php` :

```php
<?php
// Démonstration de la modification d'une variable

$compteur = 0;
echo "Valeur initiale : " . $compteur . "<br>";

// Modification de la variable
$compteur = 1;
echo "Après modification : " . $compteur . "<br>";

// Ajout à la variable existante
$compteur = $compteur + 1;  // Équivalent : $compteur += 1
echo "Après ajout de 1 : " . $compteur . "<br>";

// Raccourci pour ajouter 1
$compteur++;  // Équivalent à : $compteur = $compteur + 1
echo "Après incrément : " . $compteur . "<br>";

// Raccourci pour soustraire 1
$compteur--;  // Équivalent à : $compteur = $compteur - 1
echo "Après décrément : " . $compteur . "<br>";
```

**Résultat attendu** :

```text
Valeur initiale : 0
Après modification : 1
Après ajout de 1 : 2
Après incrément : 3
Après décrément : 2
```

---

### Étape 5 : Utiliser var_dump pour débuguer

Crée un fichier `public/debug.php` :

```php
<?php
// Utilisation de var_dump pour voir le type des variables

$texte = "Bonjour";
$nombre = 42;
$decimal = 3.14;
$vrai = true;
$faux = false;
$rien = null;

echo "<h1>Types des variables</h1>";

echo "<h2>String</h2>";
echo "<pre>";  // <pre> garde le formatage
var_dump($texte);
echo "</pre>";

echo "<h2>Integer</h2>";
echo "<pre>";
var_dump($nombre);
echo "</pre>";

echo "<h2>Float</h2>";
echo "<pre>";
var_dump($decimal);
echo "</pre>";

echo "<h2>Boolean true</h2>";
echo "<pre>";
var_dump($vrai);
echo "</pre>";

echo "<h2>Boolean false</h2>";
echo "<pre>";
var_dump($faux);
echo "</pre>";

echo "<h2>Null</h2>";
echo "<pre>";
var_dump($rien);
echo "</pre>";
```

**Résultat attendu** :

```text
Types des variables

String
string(7) "Bonjour"

Integer
int(42)

Float
float(3.14)

Boolean true
bool(true)

Boolean false
bool(false)

Null
NULL
```

---

### Étape 6 : Concaténation avec l'opérateur .=

Crée un fichier `public/concatenation.php` :

```php
<?php
// Construction d'un message étape par étape

$message = "";  // On commence avec un string vide

$message .= "<h1>Bienvenue</h1>";
$message .= "<p>Ce message est construit ";
$message .= "en plusieurs étapes.</p>";
$message .= "<p>Chaque ligne ajoute du texte.</p>";

// Affichage du résultat final
echo $message;
```

**Résultat attendu** :

```text
Bienvenue

Ce message est construit en plusieurs étapes.

Chaque ligne ajoute du texte.
```

---

## Commandes Utiles

| Fonction | Description | Exemple |
| -------- | ----------- | ------- |
| `echo $var` | Affiche la valeur | `echo $prenom;` |
| `var_dump($var)` | Affiche type et valeur | `var_dump($age);` |
| `gettype($var)` | Retourne le type | `echo gettype($age);` |

---

## Pièges Fréquents

### Piège 1 : Oublier le `$` devant le nom de variable

**Problème** : Erreur "Undefined constant" ou comportement inattendu.

**Solution** : Toujours mettre le signe dollar `$` devant le nom de la variable.

```php
<?php
// Incorrect
// prenom = "Marie";  // Erreur

// Correct
$prenom = "Marie";
```

---

### Piège 2 : Utiliser des guillemets simples avec des variables

**Problème** : La variable n'est pas remplacée par sa valeur.

**Solution** : Utilise les guillemets doubles ou la concaténation.

```php
<?php
$nom = "Marie";

// Incorrect (affiche littéralement $nom)
echo 'Bonjour $nom';  // Affiche : Bonjour $nom

// Correct (affiche la valeur de $nom)
echo "Bonjour $nom";  // Affiche : Bonjour Marie
echo 'Bonjour ' . $nom;  // Affiche : Bonjour Marie
```

---

### Piège 3 : Confondre = et ==

**Problème** : `=` est l'affectation, `==` est la comparaison (fiche 04).

**Solution** : Un seul `=` pour mettre une valeur dans une variable.

```php
<?php
// Affectation (met la valeur dans la variable)
$age = 25;

// Comparaison (vérifie si les valeurs sont égales) - voir fiche 04
// if ($age == 25) { ... }
```

---

### Piège 4 : Variables sensibles à la casse

**Problème** : `$nom` et `$Nom` sont deux variables différentes.

**Solution** : Fais attention à la casse. Utilise une convention cohérente (camelCase).

```php
<?php
$nom = "Marie";
$Nom = "Pierre";

echo $nom;  // Affiche : Marie
echo $Nom;  // Affiche : Pierre (c'est une autre variable !)
```

---

### Piège 5 : Utiliser une virgule au lieu d'un point pour les décimaux

**Problème** : Erreur de syntaxe.

**Solution** : Utilise le point `.` pour les nombres décimaux.

```php
<?php
// Incorrect
// $prix = 19,99;  // Erreur de syntaxe

// Correct
$prix = 19.99;
```

---

### Piège 6 : Mettre des guillemets autour des nombres

**Problème** : Le nombre devient un string et les calculs ne fonctionnent pas comme prévu.

**Solution** : N'utilise pas de guillemets pour les nombres.

```php
<?php
// Incorrect (c'est un string, pas un nombre)
$age = "25";

// Correct (c'est un integer)
$age = 25;

// Problème potentiel avec les strings
$a = "10";
$b = "5";
echo $a . $b;  // Affiche : 105 (concaténation, pas addition !)

// Avec des vrais nombres
$a = 10;
$b = 5;
echo $a + $b;  // Affiche : 15 (addition)
```

---

## Checklist de Validation

- [ ] J'ai compris qu'une variable stocke une valeur qui peut changer
- [ ] J'ai compris que toutes les variables commencent par `$`
- [ ] J'ai compris les règles de nommage (camelCase, pas d'espaces, pas de tirets)
- [ ] J'ai compris les différents types : string, integer, float, boolean, null
- [ ] J'ai compris la différence entre guillemets simples et doubles
- [ ] J'ai créé des variables de différents types
- [ ] J'ai utilisé `var_dump()` pour voir le type d'une variable
- [ ] J'ai fait des calculs avec des variables numériques
- [ ] J'ai utilisé la concaténation avec le point `.`

---

## Exercice Pratique

**Énoncé** : Crée une calculatrice de notes.

**Indications** :

- Crée un fichier `public/notes.php`
- Crée des variables pour 5 notes (entre 0 et 20)
- Calcule la somme des notes
- Calcule la moyenne (somme divisée par 5)
- Affiche chaque note, la somme et la moyenne
- Utilise `var_dump()` pour afficher le type de la moyenne

**Résultat attendu** : Une page qui affiche les 5 notes, leur somme et leur moyenne.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// Fichier : public/notes.php
// Calculatrice de notes

// Les 5 notes
$note1 = 15;
$note2 = 12;
$note3 = 18;
$note4 = 9;
$note5 = 14;

// Calcul de la somme
$somme = $note1 + $note2 + $note3 + $note4 + $note5;

// Calcul de la moyenne
$moyenne = $somme / 5;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Calculatrice de notes</title>
</head>
<body>
    <h1>Mes notes</h1>

    <ul>
        <li>Note 1 : <?php echo $note1; ?>/20</li>
        <li>Note 2 : <?php echo $note2; ?>/20</li>
        <li>Note 3 : <?php echo $note3; ?>/20</li>
        <li>Note 4 : <?php echo $note4; ?>/20</li>
        <li>Note 5 : <?php echo $note5; ?>/20</li>
    </ul>

    <h2>Résultats</h2>

    <p>Somme des notes : <?php echo $somme; ?></p>
    <p>Moyenne : <?php echo $moyenne; ?>/20</p>

    <h2>Type de la moyenne</h2>

    <pre><?php var_dump($moyenne); ?></pre>
</body>
</html>
```

**Explication de la solution** :

| Élément | Explication |
| ------- | ----------- |
| `$note1` à `$note5` | Variables integer pour chaque note |
| `$somme = $note1 + ...` | Addition des 5 notes |
| `$moyenne = $somme / 5` | Division pour obtenir la moyenne |
| `var_dump($moyenne)` | Affiche `float(13.6)` car la moyenne est un nombre décimal |

**Note** : La moyenne est un float (13.6) même si toutes les notes sont des integers, car la division peut produire un nombre décimal.

---

## Navigation

← Fiche précédente : **[Introduction à PHP et premiers pas](01-introduction-php.md)**

→ Fiche suivante : **[Les tableaux (arrays)](03-tableaux-arrays.md)**
