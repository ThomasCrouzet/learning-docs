---
tags:
  - PHP
  - Intermédiaire
  - Pratique
description: "Les conditions (if, else, switch, match)"
estimated_time: "80 min"
fiche_number: 4
total_fiches: 14
cursus: "PHP"
id: "web.php.conditions"
course_id: "web.php"
content_type: "lesson"
order: 4
---

# 04 - Les conditions (if, else, switch, match)

> **En bref** : À la fin de cette fiche, tu sauras écrire des conditions avec if, else, elseif, switch et match pour que ton code prenne des décisions différentes selon les valeurs des variables. Lecture estimée : 80 min.


## Prérequis

- Fiche [02-php/01 - Introduction à PHP et premiers pas](01-introduction-php.md)
- Fiche [02-php/02 - Les variables et types de données](02-variables-types.md)
- Savoir créer des variables de différents types (string, integer, boolean)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des conditions avec `if`, `else`, `elseif`, `switch` et `match` pour que ton code prenne des décisions différentes selon les valeurs des variables.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une condition ?

**Définition** : Une condition est une instruction qui permet au programme de prendre des décisions. Le code s'exécute ou non selon qu'une expression est vraie ou fausse.

**Le problème que les conditions résolvent** :

Sans conditions, voici les problèmes rencontrés :

1. **Pas de personnalisation** : Le même code s'exécute pour tout le monde, peu importe les données.

2. **Pas de validation** : Tu ne peux pas vérifier si les données sont valides avant de les utiliser.

3. **Pas de gestion d'erreur** : Tu ne peux pas réagir différemment selon qu'une opération a réussi ou échoué.

4. **Programme linéaire** : Le code fait toujours la même chose, sans adaptation.

**Comment les conditions résolvent ces problèmes** :

| Problème            | Solution avec les conditions                        |
| ------------------- | --------------------------------------------------- |
| Pas de personnalisation | Affiche un message différent selon l'utilisateur |
| Pas de validation   | Vérifie les données avant de les traiter            |
| Pas de gestion d'erreur | Affiche un message d'erreur si quelque chose échoue |
| Programme linéaire  | Le code s'adapte aux situations                     |

**Analogie concrète** : Une condition fonctionne comme un aiguillage de train. Selon que le feu est vert ou rouge, le train prend le chemin de gauche ou de droite. En programmation, selon que la condition est vraie ou fausse, le code emprunte un chemin ou l'autre.

Le diagramme suivant illustre le flux de décision dans une structure if / elseif / else :

<div class="diagram-design">
<p><a href="../../diagrams/02-php-04-conditions-1.html">Qu&#x27;est-ce qu&#x27;une condition ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/02-php-04-conditions-1.html" title="Qu&#x27;est-ce qu&#x27;une condition ?" style="width:100%;min-height:516px;border:0;background:transparent"></iframe>
</div>

---

### Les opérateurs de comparaison

Pour créer une condition, tu dois comparer des valeurs. PHP utilise des opérateurs de comparaison qui retournent `true` (vrai) ou `false` (faux).

**Liste des opérateurs de comparaison** :

| Opérateur | Nom | Description | Exemple | Résultat |
| --------- | --- | ----------- | ------- | -------- |
| `==` | Égal | Vérifie si les valeurs sont égales | `5 == 5` | `true` |
| `===` | Identique | Vérifie valeurs ET types égaux | `5 === "5"` | `false` |
| `!=` | Différent | Vérifie si les valeurs sont différentes | `5 != 3` | `true` |
| `!==` | Non identique | Vérifie valeurs OU types différents | `5 !== "5"` | `true` |
| `<` | Inférieur | Vérifie si gauche < droite | `3 < 5` | `true` |
| `>` | Supérieur | Vérifie si gauche > droite | `5 > 3` | `true` |
| `<=` | Inférieur ou égal | Vérifie si gauche ≤ droite | `5 <= 5` | `true` |
| `>=` | Supérieur ou égal | Vérifie si gauche ≥ droite | `5 >= 3` | `true` |

**Différence entre == et ===** :

C'est une distinction importante en PHP :

| Comparaison | Opérateur | Résultat | Explication |
| ----------- | --------- | -------- | ----------- |
| `5 == "5"` | `==` | `true` | Les valeurs sont converties, 5 égale 5 |
| `5 === "5"` | `===` | `false` | Le type diffère (integer vs string) |
| `0 == false` | `==` | `true` | 0 est considéré comme "faux" |
| `0 === false` | `===` | `false` | integer n'est pas boolean |

**Recommandation** : Utilise `===` et `!==` par défaut pour éviter les surprises. N'utilise `==` que si tu veux explicitement ignorer le type.

---

### La structure if

**Définition** : La structure `if` exécute un bloc de code uniquement si la condition est vraie.

**Syntaxe** :

```php
<?php
if (condition) {
    // Code exécuté si la condition est vraie
}
```

**Les trois parties** :

| Partie | Description |
| ------ | ----------- |
| `if` | Mot-clé qui introduit la condition |
| `(condition)` | L'expression à évaluer (entre parenthèses) |
| `{ ... }` | Le bloc de code à exécuter si vrai (entre accolades) |

**Exemple** :

```php
<?php
$age = 20;

if ($age >= 18) {
    echo "Tu es majeur.";
}
```

**Explication** :

- La condition `$age >= 18` est évaluée
- 20 >= 18 est vrai (`true`)
- Donc le message "Tu es majeur." est affiché

---

### La structure if...else

**Définition** : La structure `if...else` permet d'exécuter un code si la condition est vraie, et un autre code si elle est fausse.

**Syntaxe** :

```php
<?php
if (condition) {
    // Code exécuté si la condition est vraie
} else {
    // Code exécuté si la condition est fausse
}
```

**Exemple** :

```php
<?php
$age = 15;

if ($age >= 18) {
    echo "Tu es majeur.";
} else {
    echo "Tu es mineur.";
}

// Affiche : Tu es mineur.
```

**Explication** :

- La condition `$age >= 18` est évaluée
- 15 >= 18 est faux (`false`)
- Donc le bloc `else` est exécuté

---

### La structure if...elseif...else

**Définition** : Quand tu as plus de deux possibilités, tu utilises `elseif` pour ajouter des conditions intermédiaires.

**Syntaxe** :

```php
<?php
if (condition1) {
    // Code si condition1 est vraie
} elseif (condition2) {
    // Code si condition1 est fausse ET condition2 est vraie
} elseif (condition3) {
    // Code si condition1 et condition2 sont fausses ET condition3 est vraie
} else {
    // Code si toutes les conditions sont fausses
}
```

**Règle importante** : Les conditions sont évaluées dans l'ordre. Dès qu'une condition est vraie, son bloc est exécuté et les autres sont ignorés.

**Exemple : notes et mentions** :

```php
<?php
$note = 15;

if ($note >= 16) {
    echo "Mention Très Bien";
} elseif ($note >= 14) {
    echo "Mention Bien";
} elseif ($note >= 12) {
    echo "Mention Assez Bien";
} elseif ($note >= 10) {
    echo "Passable";
} else {
    echo "Insuffisant";
}

// Affiche : Mention Bien
```

**Explication** :

- `$note >= 16` (15 >= 16) est faux → on passe à la suite
- `$note >= 14` (15 >= 14) est vrai → on exécute ce bloc
- Les autres conditions ne sont pas évaluées

---

### Les opérateurs logiques

Les opérateurs logiques permettent de combiner plusieurs conditions.

**Liste des opérateurs logiques** :

| Opérateur | Nom | Description | Exemple |
| --------- | --- | ----------- | ------- |
| `&&` | ET | Vraie si les deux conditions sont vraies | `$a > 0 && $a < 10` |
| `\|\|` | OU | Vraie si au moins une condition est vraie | `$a == 0 \|\| $a == 1` |
| `!` | NON | Inverse la valeur (vrai devient faux) | `!$estConnecte` |

**Note** : Tu peux aussi écrire `and` au lieu de `&&`, et `or` au lieu de `||`, mais `&&` et `||` sont plus courants.

**Tables de vérité** :

**ET (&&)** - Les deux doivent être vraies :

| Condition A | Condition B | A && B |
| ----------- | ----------- | ------ |
| true | true | true |
| true | false | false |
| false | true | false |
| false | false | false |

**OU (||)** - Au moins une doit être vraie :

| Condition A | Condition B | A \|\| B |
| ----------- | ----------- | -------- |
| true | true | true |
| true | false | true |
| false | true | true |
| false | false | false |

**NON (!)** - Inverse la valeur :

| Condition A | !A |
| ----------- | -- |
| true | false |
| false | true |

**Exemple avec ET** :

```php
<?php
$age = 25;
$aPermis = true;

if ($age >= 18 && $aPermis) {
    echo "Tu peux conduire.";
} else {
    echo "Tu ne peux pas conduire.";
}

// Affiche : Tu peux conduire.
```

**Exemple avec OU** :

```php
<?php
$estAdmin = false;
$estModerateur = true;

if ($estAdmin || $estModerateur) {
    echo "Tu as accès au panneau de gestion.";
}

// Affiche : Tu as accès au panneau de gestion.
```

**Exemple avec NON** :

```php
<?php
$estConnecte = false;

if (!$estConnecte) {
    echo "Veuillez vous connecter.";
}

// Affiche : Veuillez vous connecter.
```

---

### La structure switch

**Définition** : La structure `switch` permet de comparer une variable à plusieurs valeurs possibles. C'est une alternative à une longue série de `if...elseif`.

**Quand utiliser switch vs if** :

| Utilise switch | Utilise if/elseif |
| -------------- | ----------------- |
| Comparaison d'égalité avec plusieurs valeurs | Comparaisons avec <, >, <=, >= |
| Une seule variable testée | Plusieurs variables ou conditions complexes |
| Beaucoup de cas possibles (>3) | Peu de cas (2-3) |

**Syntaxe** :

```php
<?php
switch ($variable) {
    case valeur1:
        // Code si $variable == valeur1
        break;
    case valeur2:
        // Code si $variable == valeur2
        break;
    default:
        // Code si aucun case ne correspond
        break;
}
```

**Les parties du switch** :

| Partie | Description |
| ------ | ----------- |
| `switch ($variable)` | La variable à tester |
| `case valeur:` | Une valeur possible |
| `break;` | Sort du switch (obligatoire) |
| `default:` | Cas par défaut si aucun case ne correspond |

**Règle importante** : N'oublie jamais le `break;` après chaque case. Sans `break`, le code continue dans les cases suivants (comportement appelé "fall-through").

**Exemple** :

```php
<?php
$jour = "mardi";

switch ($jour) {
    case "lundi":
        echo "Début de semaine";
        break;
    case "mardi":
        echo "Deuxième jour";
        break;
    case "mercredi":
        echo "Milieu de semaine";
        break;
    case "jeudi":
        echo "Avant-dernier jour";
        break;
    case "vendredi":
        echo "Fin de semaine";
        break;
    case "samedi":
    case "dimanche":
        echo "Week-end";
        break;
    default:
        echo "Jour inconnu";
        break;
}

// Affiche : Deuxième jour
```

**Note** : Les cases "samedi" et "dimanche" partagent le même code. C'est volontaire (pas de break entre eux).

---


### La structure match (PHP 8+)

**Définition** : `match` compare une expression à plusieurs branches et **retourne une valeur**. Contrairement à `switch`, la comparaison est stricte (`===`), il n'y a pas de "fall-through" (pas de `break` à oublier), et une valeur non gérée lève une erreur (`UnhandledMatchError`) sauf si tu ajoutes un bras `default`.

**Quand utiliser match vs switch** :

| Utilise `match` | Utilise `switch` |
| --------------- | ---------------- |
| Tu veux une **valeur de retour** | Tu veux exécuter des **blocs d'instructions** longs |
| Comparaison stricte souhaitée | Tu as besoin de fall-through volontaire (rare) |
| PHP 8+ | Code plus ancien ou style impératif |

**Exemple** :

```php
$httpCode = 404;
$message = match ($httpCode) {
    200 => 'OK',
    404 => 'Introuvable',
    500 => 'Erreur serveur',
    default => 'Code inconnu',
};
echo $message; // Introuvable
```

**Ce que match n'est PAS** :

- Ce n'est pas un simple raccourci cosmétique de `switch` : le comportement (strict, sans fall-through, expression) est différent.
- Ce n'est pas un remplacement de tous les `if` : pour des conditions complexes (`>`, `&&`, etc.), garde `if` / `elseif`.

### L'opérateur ternaire

**Définition** : L'opérateur ternaire est une forme courte de `if...else` qui tient sur une ligne. Il retourne une valeur.

**Syntaxe** :

```php
<?php
$resultat = (condition) ? valeur_si_vrai : valeur_si_faux;
```

**Les trois parties** :

| Partie | Description |
| ------ | ----------- |
| `condition` | L'expression à évaluer |
| `?` | Séparateur "alors" |
| `valeur_si_vrai` | Retournée si la condition est vraie |
| `:` | Séparateur "sinon" |
| `valeur_si_faux` | Retournée si la condition est fausse |

**Exemple** :

```php
<?php
$age = 20;

// Avec if...else
if ($age >= 18) {
    $statut = "majeur";
} else {
    $statut = "mineur";
}

// Équivalent avec l'opérateur ternaire
$statut = ($age >= 18) ? "majeur" : "mineur";

echo $statut;  // Affiche : majeur
```

**Quand utiliser l'opérateur ternaire** :

| Utilise le ternaire | Utilise if...else |
| ------------------- | ----------------- |
| Affectation simple | Bloc de code complexe |
| Une seule ligne | Plusieurs instructions |
| Code clair et lisible | Logique complexe |

---

### Les valeurs "falsy" et "truthy"

En PHP, certaines valeurs sont automatiquement considérées comme "fausses" (falsy) dans un contexte booléen :

**Valeurs falsy (considérées comme false)** :

| Valeur | Type |
| ------ | ---- |
| `false` | boolean |
| `0` | integer |
| `0.0` | float |
| `""` | string vide |
| `"0"` | string contenant zéro |
| `[]` | tableau vide |
| `null` | null |

**Tout le reste est truthy (considéré comme true)**.

**Exemple** :

```php
<?php
$valeur = "";  // String vide

if ($valeur) {
    echo "La valeur existe";
} else {
    echo "La valeur est vide ou fausse";
}

// Affiche : La valeur est vide ou fausse
```

**Attention au string "0"** :

```php
<?php
$texte = "0";

if ($texte) {
    echo "Vrai";
} else {
    echo "Faux";
}

// Affiche : Faux (car "0" est falsy)
```

---

## Étapes Pratiques

### Étape 1 : Premier if simple

Crée un fichier `public/conditions.php` :

```php
<?php
// Première condition simple

$temperature = 25;

echo "<h1>Météo</h1>";

if ($temperature > 20) {
    echo "<p>Il fait chaud.</p>";
}

echo "<p>Température : " . $temperature . "°C</p>";
```

**Résultat attendu** :

```text
Météo

Il fait chaud.

Température : 25°C
```

---

### Étape 2 : if...else

Modifie `public/conditions.php` :

```php
<?php
$temperature = 15;

echo "<h1>Météo</h1>";

if ($temperature > 20) {
    echo "<p>Il fait chaud. Prends de la crème solaire.</p>";
} else {
    echo "<p>Il fait frais. Prends une veste.</p>";
}

echo "<p>Température : " . $temperature . "°C</p>";
```

**Résultat attendu** :

```text
Météo

Il fait frais. Prends une veste.

Température : 15°C
```

---

### Étape 3 : if...elseif...else

Crée un fichier `public/notes.php` :

```php
<?php
// Système de notation avec mentions

$note = 14;

echo "<h1>Résultat de l'examen</h1>";
echo "<p>Note obtenue : " . $note . "/20</p>";

if ($note >= 16) {
    $mention = "Très Bien";
    $couleur = "green";
} elseif ($note >= 14) {
    $mention = "Bien";
    $couleur = "blue";
} elseif ($note >= 12) {
    $mention = "Assez Bien";
    $couleur = "orange";
} elseif ($note >= 10) {
    $mention = "Passable";
    $couleur = "gray";
} else {
    $mention = "Insuffisant";
    $couleur = "red";
}

echo "<p style='color: " . $couleur . ";'>Mention : " . $mention . "</p>";
```

**Résultat attendu** :

```text
Résultat de l'examen

Note obtenue : 14/20

Mention : Bien (en bleu)
```

---

### Étape 4 : Opérateurs logiques

Crée un fichier `public/acces.php` :

```php
<?php
// Vérification d'accès avec opérateurs logiques

$age = 20;
$aParenteAutorise = false;
$estMembre = true;

echo "<h1>Vérification d'accès</h1>";

// Condition avec ET (&&)
if ($age >= 18 && $estMembre) {
    echo "<p>Accès autorisé (majeur et membre).</p>";
}

// Condition avec OU (||)
if ($age >= 18 || $aParenteAutorise) {
    echo "<p>Accès autorisé (majeur OU accompagné).</p>";
}

// Condition combinée
if (($age >= 18 || $aParenteAutorise) && $estMembre) {
    echo "<p>Accès complet autorisé.</p>";
}

// Condition avec NON (!)
if (!$aParenteAutorise) {
    echo "<p>Aucun parent n'a donné son autorisation.</p>";
}
```

**Résultat attendu** :

```text
Vérification d'accès

Accès autorisé (majeur et membre).
Accès autorisé (majeur OU accompagné).
Accès complet autorisé.
Aucun parent n'a donné son autorisation.
```

---

### Étape 5 : Structure switch

Crée un fichier `public/jour.php` :

```php
<?php
// Affichage selon le jour de la semaine

// date("l") retourne le jour en anglais (Monday, Tuesday, etc.)
$jourAnglais = date("l");

echo "<h1>Programme du jour</h1>";
echo "<p>Aujourd'hui : " . $jourAnglais . "</p>";

switch ($jourAnglais) {
    case "Monday":
        echo "<p>Réunion d'équipe à 9h.</p>";
        break;
    case "Tuesday":
        echo "<p>Formation PHP.</p>";
        break;
    case "Wednesday":
        echo "<p>Travail sur le projet.</p>";
        break;
    case "Thursday":
        echo "<p>Code review.</p>";
        break;
    case "Friday":
        echo "<p>Démo et rétrospective.</p>";
        break;
    case "Saturday":
    case "Sunday":
        echo "<p>Repos ! Profite de ton week-end.</p>";
        break;
    default:
        echo "<p>Jour non reconnu.</p>";
        break;
}
```

**Résultat attendu** : Le programme correspondant au jour actuel.

---

### Étape 6 : Opérateur ternaire

Crée un fichier `public/ternaire.php` :

```php
<?php
// Utilisation de l'opérateur ternaire

$heure = date("H");  // Heure actuelle (0-23)

echo "<h1>Salutation</h1>";
echo "<p>Il est " . $heure . "h.</p>";

// Opérateur ternaire pour le message de salutation
$salutation = ($heure < 12) ? "Bonjour" : "Bonsoir";

echo "<p>" . $salutation . " !</p>";

// Autre exemple : stock
$stock = 5;
$message = ($stock > 0) ? "En stock (" . $stock . " disponibles)" : "Rupture de stock";

echo "<p>Statut : " . $message . "</p>";

// Dans un contexte HTML
$estActif = true;
?>

<p class="<?php echo $estActif ? 'actif' : 'inactif'; ?>">
    Statut du compte : <?php echo $estActif ? 'Actif' : 'Inactif'; ?>
</p>
```

**Résultat attendu** : Salutation adaptée à l'heure et statut du stock.

---

### Étape 7 : Conditions imbriquées

Crée un fichier `public/imbrique.php` :

```php
<?php
// Conditions imbriquées (une condition dans une autre)

$estConnecte = true;
$estAdmin = false;
$estModerateur = true;

echo "<h1>Panneau de contrôle</h1>";

if ($estConnecte) {
    echo "<p>Bienvenue sur votre espace.</p>";

    if ($estAdmin) {
        echo "<p>Accès administrateur : Tous les droits.</p>";
    } elseif ($estModerateur) {
        echo "<p>Accès modérateur : Gestion des contenus.</p>";
    } else {
        echo "<p>Accès utilisateur : Consultation uniquement.</p>";
    }

} else {
    echo "<p>Veuillez vous connecter pour accéder à cette page.</p>";
}
```

**Résultat attendu** :

```text
Panneau de contrôle

Bienvenue sur votre espace.

Accès modérateur : Gestion des contenus.
```

---

## Commandes Utiles

| Opérateur/Structure | Description | Exemple |
| ------------------- | ----------- | ------- |
| `==` | Égalité (valeur) | `$a == $b` |
| `===` | Identité (valeur + type) | `$a === $b` |
| `!=` | Différent (valeur) | `$a != $b` |
| `!==` | Non identique (valeur ou type) | `$a !== $b` |
| `&&` | ET logique | `$a && $b` |
| `\|\|` | OU logique | `$a \|\| $b` |
| `!` | NON logique | `!$a` |
| `? :` | Opérateur ternaire | `$a ? 'oui' : 'non'` |

---

## Pièges Fréquents

### Piège 1 : Confondre = et ==

**Problème** : Tu utilises `=` (affectation) au lieu de `==` (comparaison).

**Solution** : `=` assigne une valeur, `==` compare deux valeurs.

```php
<?php
$age = 20;

// Incorrect (ceci assigne 18 à $age et est toujours vrai !)
if ($age = 18) {
    echo "Tu as 18 ans";  // S'affiche toujours !
}

// Correct (comparaison)
if ($age == 18) {
    echo "Tu as 18 ans";
}
```

---

### Piège 2 : Oublier les accolades

**Problème** : Sans accolades, seule la première instruction est conditionnelle.

**Solution** : Utilise toujours des accolades, même pour une seule instruction.

```php
<?php
$majeur = true;

// Problématique (seul le premier echo est conditionnel)
if ($majeur)
    echo "Tu es majeur.";
    echo "Tu peux voter.";  // Ceci s'exécute TOUJOURS

// Correct
if ($majeur) {
    echo "Tu es majeur.";
    echo "Tu peux voter.";
}
```

---

### Piège 3 : Oublier break dans switch

**Problème** : Sans `break`, le code continue dans les cases suivants.

**Solution** : Mets toujours un `break;` à la fin de chaque case.

```php
<?php
$fruit = "pomme";

// Incorrect (fall-through non voulu)
switch ($fruit) {
    case "pomme":
        echo "C'est une pomme.";
        // Manque le break !
    case "banane":
        echo "C'est une banane.";
        break;
}
// Affiche : C'est une pomme.C'est une banane.

// Correct
switch ($fruit) {
    case "pomme":
        echo "C'est une pomme.";
        break;
    case "banane":
        echo "C'est une banane.";
        break;
}
// Affiche : C'est une pomme.
```

---

### Piège 4 : Utiliser == au lieu de === avec des types différents

**Problème** : `==` fait des conversions de type qui peuvent surprendre.

**Solution** : Utilise `===` pour éviter les conversions automatiques.

```php
<?php
// Comparaisons avec == : résultats en PHP 8.3
var_dump(0 == "texte");    // bool(false) en PHP 8+ (était bool(true) en PHP 7)
var_dump(0 == false);      // bool(true)
var_dump("" == false);     // bool(true)
var_dump("0" == false);    // bool(true)

// Avec === (pas de conversion)
var_dump(0 === "texte");   // bool(false)
var_dump(0 === false);     // bool(false)
```

> **Note PHP 8 - comparaison entier/chaîne** : depuis PHP 8.0, comparer un entier à une chaîne non numérique avec `==` convertit l'entier en chaîne (au lieu de l'inverse en PHP 7). Ainsi `0 == "texte"` retourne `false` en PHP 8+. Les autres cas du tableau ci-dessus (`0 == false`, `"" == false`, `"0" == false`) restent vrais en PHP 8.3.

---

### Piège 5 : Conditions avec des strings vides

**Problème** : Un string vide `""` est considéré comme `false`.

**Solution** : Utilise `=== ""` pour vérifier explicitement un string vide.

```php
<?php
$nom = "";

// Problématique (un string vide est "falsy")
if ($nom) {
    echo "Le nom est défini";
} else {
    echo "Le nom est vide";  // S'affiche
}

// Plus explicite
if ($nom === "") {
    echo "Le nom est un string vide";
}

// Ou avec strlen()
if (strlen($nom) === 0) {
    echo "Le nom a 0 caractère";
}
```

---

### Piège 6 : Parenthèses manquantes avec les opérateurs logiques

**Problème** : L'ordre de priorité des opérateurs peut surprendre.

**Solution** : Utilise des parenthèses pour clarifier l'ordre.

```php
<?php
$a = true;
$b = false;
$c = true;

// Ambigu : est-ce (a ET b) OU c, ou a ET (b OU c) ?
if ($a && $b || $c) {
    echo "Vrai";
}

// Explicite avec parenthèses
if (($a && $b) || $c) {
    echo "Vrai";  // C'est ce qui s'exécute
}

if ($a && ($b || $c)) {
    echo "Vrai";  // Aussi vrai dans ce cas
}
```

---

## Checklist de Validation

- [ ] J'ai compris la différence entre `=` (affectation) et `==` (comparaison)
- [ ] J'ai compris la différence entre `==` et `===`
- [ ] J'ai écrit une condition `if` simple
- [ ] J'ai utilisé `if...else` pour deux alternatives
- [ ] J'ai utilisé `if...elseif...else` pour plusieurs alternatives
- [ ] J'ai compris les opérateurs logiques `&&`, `||`, `!`
- [ ] J'ai utilisé une structure `switch`
- [ ] J'ai compris l'opérateur ternaire `? :`
- [ ] Je sais que certaines valeurs sont "falsy" (`0`, `""`, `null`, `false`)

---

## Exercice Pratique

**Énoncé** : Crée un formulaire de calcul de prix avec réduction.

**Indications** :

- Crée un fichier `public/prix.php`
- Définis un prix de base (`$prixBase = 100`)
- Définis une quantité (`$quantite = 5`)
- Définis un code promo (`$codePromo = "SOLDES"`)
- Calcule le prix total (`$prixBase * $quantite`)
- Applique une réduction selon le code promo :
  - "SOLDES" : -20%
  - "ETE" : -15%
  - "NOUVEAU" : -10%
  - Autre : pas de réduction
- Applique une réduction supplémentaire de 5% si la quantité >= 10
- Affiche le détail du calcul

**Résultat attendu** : Une page montrant le calcul du prix avec les réductions appliquées.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// Fichier : public/prix.php
// Calculateur de prix avec réductions

// Données de départ
$prixBase = 100;
$quantite = 5;
$codePromo = "SOLDES";

// Calcul du prix total sans réduction
$prixTotal = $prixBase * $quantite;

// Déterminer la réduction selon le code promo
switch ($codePromo) {
    case "SOLDES":
        $pourcentagePromo = 20;
        break;
    case "ETE":
        $pourcentagePromo = 15;
        break;
    case "NOUVEAU":
        $pourcentagePromo = 10;
        break;
    default:
        $pourcentagePromo = 0;
        break;
}

// Calculer le montant de la réduction promo
$montantReductionPromo = $prixTotal * $pourcentagePromo / 100;

// Prix après réduction promo
$prixApresPromo = $prixTotal - $montantReductionPromo;

// Réduction quantité (5% si quantité >= 10)
if ($quantite >= 10) {
    $pourcentageQuantite = 5;
    $montantReductionQuantite = $prixApresPromo * $pourcentageQuantite / 100;
} else {
    $pourcentageQuantite = 0;
    $montantReductionQuantite = 0;
}

// Prix final
$prixFinal = $prixApresPromo - $montantReductionQuantite;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Calcul de prix</title>
</head>
<body>
    <h1>Détail de votre commande</h1>

    <h2>Informations</h2>
    <ul>
        <li>Prix unitaire : <?php echo $prixBase; ?> euros</li>
        <li>Quantité : <?php echo $quantite; ?></li>
        <li>Code promo : <?php echo ($codePromo !== "") ? $codePromo : "Aucun"; ?></li>
    </ul>

    <h2>Calcul</h2>
    <table border="1">
        <tr>
            <td>Prix total (avant réduction)</td>
            <td><?php echo $prixTotal; ?> euros</td>
        </tr>
        <?php if ($pourcentagePromo > 0): ?>
        <tr>
            <td>Réduction promo "<?php echo $codePromo; ?>" (-<?php echo $pourcentagePromo; ?>%)</td>
            <td>-<?php echo $montantReductionPromo; ?> euros</td>
        </tr>
        <?php endif; ?>
        <?php if ($pourcentageQuantite > 0): ?>
        <tr>
            <td>Réduction quantité (-<?php echo $pourcentageQuantite; ?>%)</td>
            <td>-<?php echo $montantReductionQuantite; ?> euros</td>
        </tr>
        <?php endif; ?>
        <tr>
            <td><strong>Prix final</strong></td>
            <td><strong><?php echo $prixFinal; ?> euros</strong></td>
        </tr>
    </table>

    <?php if ($quantite < 10): ?>
    <p><em>Astuce : commandez 10 articles ou plus pour bénéficier de 5% de réduction supplémentaire !</em></p>
    <?php endif; ?>
</body>
</html>
```

**Explication de la solution** :

| Élément | Explication |
| ------- | ----------- |
| `switch ($codePromo)` | Détermine le pourcentage selon le code |
| `$montantReductionPromo = $prixTotal * $pourcentagePromo / 100` | Calcul du montant en euros |
| `if ($quantite >= 10)` | Vérifie si la réduction quantité s'applique |
| `<?php if ($pourcentagePromo > 0): ?>` | Affiche la ligne seulement si une réduction existe |
| Opérateur ternaire | Affiche "Aucun" si le code promo est vide |

---

## Navigation

← Fiche précédente : **[Les tableaux (arrays)](03-tableaux-arrays.md)**

→ Fiche suivante : **[Les boucles (for, foreach, while)](05-boucles.md)**
