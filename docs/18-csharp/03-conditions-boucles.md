---
tags:
  - C#
  - Débutant
  - Pratique
description: "Maîtriser les structures de contrôle en C# : if/else, switch avec pattern matching, for, foreach et while."
estimated_time: "60 min"
fiche_number: 3
total_fiches: 10
cursus: "C#"
---

# 03 - Conditions et boucles

> **En bref** : Maîtriser les structures de contrôle en C# pour prendre des décisions et répéter des actions. Lecture estimée : 60 min.

## Prérequis

- Avoir terminé la fiche **[02 - Variables et types](02-variables-types.md)**
- Savoir déclarer des variables et utiliser les types de base en C#

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les conditions (`if/else`, `switch` avec pattern matching), les boucles (`for`, `foreach`, `while`) et l'opérateur ternaire pour contrôler le flux d'exécution de tes programmes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une structure de contrôle ?

**Définition** : Une structure de contrôle est une instruction qui modifie l'ordre d'exécution du code. Sans structure de contrôle, le code s'exécute ligne par ligne du début à la fin. Les structures de contrôle permettent de sauter des lignes (conditions) ou de répéter des lignes (boucles).

**Le problème que les structures de contrôle résolvent** :

Sans structures de contrôle, voici les problèmes rencontrés :

1. **Exécution linéaire** : Chaque instruction s'exécute une seule fois, dans l'ordre. Impossible de réagir à des données différentes.
2. **Répétition de code** : Pour exécuter la même action 100 fois, il faut écrire 100 fois la même ligne.
3. **Logique rigide** : Le programme ne peut pas s'adapter au contexte (utilisateur connecté ou non, panier vide ou plein).

**Comment les structures de contrôle résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Exécution linéaire | `if/else` et `switch` permettent de choisir quel code exécuter |
| Répétition de code | `for`, `foreach` et `while` répètent un bloc de code automatiquement |
| Logique rigide | Les conditions permettent d'adapter le comportement aux données |

**Analogie concrète** : Les structures de contrôle fonctionnent comme un GPS. Le GPS ne te fait pas toujours suivre le même chemin : il prend des décisions (conditions) en fonction du trafic et peut recalculer plusieurs fois (boucles) jusqu'à trouver le meilleur itinéraire.

---

### Qu'est-ce que le pattern matching ?

**Définition** : Le pattern matching est une fonctionnalité de C# qui permet de tester la structure et le contenu d'une valeur en une seule expression. C'est une version enrichie du `switch` classique.

**Le problème que le pattern matching résout** :

Sans pattern matching, voici les problèmes rencontrés :

1. **Cascades de if/else** : Tester plusieurs conditions produit du code profondément imbriqué et difficile à lire.
2. **Vérifications de type verbeuses** : Vérifier le type d'un objet, puis le convertir, puis accéder à ses propriétés nécessite plusieurs lignes.

**Comment le pattern matching résout ces problèmes** :

| Problème | Solution apportée par le pattern matching |
| -------- | ----------------------------------------- |
| Cascades de if/else | Un seul `switch` avec des patterns clairs |
| Vérifications de type verbeuses | Le pattern teste et convertit en une seule ligne |

**Analogie concrète** : Le pattern matching fonctionne comme un tri postal. Au lieu de lire chaque lettre et de vérifier chaque critère un par un (pays, puis ville, puis code postal), tu utilises un système de tri automatique qui reconnaît le format complet de l'adresse en un coup d'oeil.

**Ce que le pattern matching n'est PAS** :

- Le pattern matching n'est pas un remplacement total de `if/else`. Pour les conditions simples (un seul test), `if/else` reste plus lisible.
- Le pattern matching n'est pas des expressions régulières. Il ne traite pas le contenu des chaînes de caractères, mais la structure des données.

---

## Étapes Pratiques

### Étape 1 : Conditions if/else

Crée un nouveau projet et écris les exemples suivants :

```bash
dotnet new console -n conditions-demo
cd conditions-demo
```

```csharp
// Condition simple
int age = 20;

if (age >= 18)
{
    Console.WriteLine("Tu es majeur.");
}

// Condition avec else
int temperature = 5;

if (temperature > 25)
{
    Console.WriteLine("Il fait chaud.");
}
else
{
    Console.WriteLine("Il ne fait pas chaud.");
}

// Condition avec else if
int note = 15;

if (note >= 16)
{
    Console.WriteLine("Très bien");
}
else if (note >= 14)
{
    Console.WriteLine("Bien");
}
else if (note >= 12)
{
    Console.WriteLine("Assez bien");
}
else if (note >= 10)
{
    Console.WriteLine("Passable");
}
else
{
    Console.WriteLine("Insuffisant");
}

// Opérateurs logiques : && (ET), || (OU), ! (NON)
int heure = 14;
bool estWeekend = false;

if (heure >= 9 && heure <= 17 && !estWeekend)
{
    Console.WriteLine("Heures de bureau.");
}
else
{
    Console.WriteLine("Hors heures de bureau.");
}
```

**Résultat attendu** :

```text
Tu es majeur.
Il ne fait pas chaud.
Bien
Heures de bureau.
```

---

### Étape 2 : Opérateur ternaire

L'opérateur ternaire est un raccourci pour un `if/else` simple sur une seule ligne :

```csharp
int age = 20;

// Forme longue avec if/else
string statut;
if (age >= 18)
{
    statut = "majeur";
}
else
{
    statut = "mineur";
}

// Forme courte avec l'opérateur ternaire
// Syntaxe : condition ? valeur_si_vrai : valeur_si_faux
string statutCourt = age >= 18 ? "majeur" : "mineur";

Console.WriteLine($"Statut (long) : {statut}");
Console.WriteLine($"Statut (court) : {statutCourt}");

// Utilisation directe dans une interpolation
Console.WriteLine($"Tu es {(age >= 18 ? "majeur" : "mineur")}.");
```

**Résultat attendu** :

```text
Statut (long) : majeur
Statut (court) : majeur
Tu es majeur.
```

---

### Étape 3 : Switch classique et pattern matching

```csharp
// --- Switch classique (valeurs exactes) ---
int jour = 3;

switch (jour)
{
    case 1:
        Console.WriteLine("Lundi");
        break;
    case 2:
        Console.WriteLine("Mardi");
        break;
    case 3:
        Console.WriteLine("Mercredi");
        break;
    case 4:
        Console.WriteLine("Jeudi");
        break;
    case 5:
        Console.WriteLine("Vendredi");
        break;
    case 6:
    case 7:
        Console.WriteLine("Week-end");
        break;
    default:
        Console.WriteLine("Jour invalide");
        break;
}

// --- Switch expression (C# 8+) ---
// Plus concis, retourne directement une valeur
string nomJour = jour switch
{
    1 => "Lundi",
    2 => "Mardi",
    3 => "Mercredi",
    4 => "Jeudi",
    5 => "Vendredi",
    6 or 7 => "Week-end",
    _ => "Jour invalide"  // _ est le cas par défaut (discard pattern)
};

Console.WriteLine($"Jour {jour} = {nomJour}");

// --- Pattern matching avec plages (C# 9+) ---
int score = 75;

string mention = score switch
{
    >= 90 => "Excellent",
    >= 80 => "Très bien",
    >= 70 => "Bien",
    >= 60 => "Assez bien",
    >= 50 => "Passable",
    _ => "Insuffisant"
};

Console.WriteLine($"Score {score} : {mention}");

// --- Pattern matching avec conditions multiples ---
int mois = 4;
string saison = mois switch
{
    3 or 4 or 5 => "Printemps",
    6 or 7 or 8 => "Été",
    9 or 10 or 11 => "Automne",
    12 or 1 or 2 => "Hiver",
    _ => "Mois invalide"
};

Console.WriteLine($"Mois {mois} : {saison}");
```

**Résultat attendu** :

```text
Mercredi
Jour 3 = Mercredi
Score 75 : Bien
Mois 4 : Printemps
```

---

### Étape 4 : Boucle for

```csharp
// Boucle for classique : afficher les nombres de 1 à 5
Console.WriteLine("--- Boucle for ---");
for (int i = 1; i <= 5; i++)
{
    Console.WriteLine($"Itération {i}");
}

// Boucle for décroissante
Console.WriteLine("\n--- Compte à rebours ---");
for (int i = 5; i >= 1; i--)
{
    Console.Write($"{i}... ");
}
Console.WriteLine("Décollage !");

// Boucle for avec pas de 2
Console.WriteLine("\n--- Nombres pairs de 0 à 10 ---");
for (int i = 0; i <= 10; i += 2)
{
    Console.Write($"{i} ");
}
Console.WriteLine();

// Boucle imbriquée : table de multiplication
Console.WriteLine("\n--- Table de multiplication (1 à 3) ---");
for (int i = 1; i <= 3; i++)
{
    for (int j = 1; j <= 5; j++)
    {
        Console.Write($"{i * j,4}");  // ,4 = largeur minimale de 4 caractères
    }
    Console.WriteLine();
}
```

**Résultat attendu** :

```text
--- Boucle for ---
Itération 1
Itération 2
Itération 3
Itération 4
Itération 5

--- Compte à rebours ---
5... 4... 3... 2... 1... Décollage !

--- Nombres pairs de 0 à 10 ---
0 2 4 6 8 10

--- Table de multiplication (1 à 3) ---
   1   2   3   4   5
   2   4   6   8  10
   3   6   9  12  15
```

---

### Étape 5 : Boucle foreach

La boucle `foreach` parcourt chaque élément d'une collection :

```csharp
// Parcourir un tableau de chaînes
string[] fruits = { "Pomme", "Banane", "Cerise", "Datte" };

Console.WriteLine("--- Fruits ---");
foreach (string fruit in fruits)
{
    Console.WriteLine($"- {fruit}");
}

// Parcourir un tableau de nombres avec calcul
int[] notes = { 12, 15, 8, 17, 14 };
int somme = 0;

foreach (int note in notes)
{
    somme += note;
}

double moyenne = (double)somme / notes.Length;
Console.WriteLine($"\nMoyenne des notes : {moyenne:F1}");

// Parcourir une chaîne de caractères (une string est une collection de char)
string mot = "C#";
Console.WriteLine($"\nCaractères de \"{mot}\" :");
foreach (char c in mot)
{
    Console.WriteLine($"  '{c}' (code ASCII : {(int)c})");
}
```

**Résultat attendu** :

```text
--- Fruits ---
- Pomme
- Banane
- Cerise
- Datte

Moyenne des notes : 13.2

Caractères de "C#" :
  'C' (code ASCII : 67)
  '#' (code ASCII : 35)
```

---

### Étape 6 : Boucles while et do-while

```csharp
// --- Boucle while : vérifier une condition avant chaque itération ---
Console.WriteLine("--- Boucle while ---");
int compteur = 1;

while (compteur <= 5)
{
    Console.WriteLine($"Compteur : {compteur}");
    compteur++;
}

// --- Boucle do-while : exécuter au moins une fois ---
Console.WriteLine("\n--- Saisie avec do-while ---");
string? saisie;
int nombre;

do
{
    Console.Write("Entre un nombre entre 1 et 10 : ");
    saisie = Console.ReadLine();
} while (!int.TryParse(saisie, out nombre) || nombre < 1 || nombre > 10);

Console.WriteLine($"Tu as choisi : {nombre}");

// --- break et continue ---
Console.WriteLine("\n--- break et continue ---");
for (int i = 1; i <= 10; i++)
{
    // Sauter les nombres pairs
    if (i % 2 == 0)
    {
        continue;  // Passer à l'itération suivante
    }

    // Arrêter si on dépasse 7
    if (i > 7)
    {
        break;  // Sortir de la boucle
    }

    Console.Write($"{i} ");
}
Console.WriteLine();
```

**Résultat attendu** :

```text
--- Boucle while ---
Compteur : 1
Compteur : 2
Compteur : 3
Compteur : 4
Compteur : 5

--- Saisie avec do-while ---
Entre un nombre entre 1 et 10 : 5
Tu as choisi : 5

--- break et continue ---
1 3 5 7
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `dotnet run` | Compiler et exécuter le projet |
| `dotnet build` | Compiler sans exécuter |

---

## Pièges Fréquents

### Piège 1 : Oublier le `break` dans un switch classique

**Problème** : Sans `break`, l'exécution "tombe" dans le cas suivant (fall-through). En C#, contrairement au C, cela provoque une erreur de compilation si le cas n'est pas vide.

```csharp
// Erreur de compilation en C#
switch (jour)
{
    case 1:
        Console.WriteLine("Lundi");
        // Erreur : break manquant
    case 2:
        Console.WriteLine("Mardi");
        break;
}
```

**Solution** : Toujours ajouter `break` à la fin de chaque cas, ou utiliser une switch expression.

```csharp
// Correct avec break
switch (jour)
{
    case 1:
        Console.WriteLine("Lundi");
        break;
    case 2:
        Console.WriteLine("Mardi");
        break;
}
```

---

### Piège 2 : Boucle infinie avec while

**Problème** : Si la condition du `while` ne devient jamais fausse, le programme tourne indéfiniment.

```csharp
// Boucle infinie : compteur n'est jamais modifié
int compteur = 0;
while (compteur < 5)
{
    Console.WriteLine(compteur);
    // Oubli de compteur++ !
}
```

**Solution** : Toujours s'assurer que la condition finit par devenir fausse.

```csharp
int compteur = 0;
while (compteur < 5)
{
    Console.WriteLine(compteur);
    compteur++;  // Incrémenter pour sortir de la boucle
}
```

---

### Piège 3 : Modifier une collection pendant un foreach

**Problème** : Ajouter ou supprimer des éléments dans une collection pendant qu'on la parcourt provoque une exception.

```csharp
// Erreur à l'exécution : InvalidOperationException
List<string> noms = new List<string> { "Alice", "Bob", "Charlie" };
foreach (string nom in noms)
{
    if (nom == "Bob")
    {
        noms.Remove(nom);  // Interdit pendant un foreach !
    }
}
```

**Solution** : Utiliser une boucle `for` à l'envers, ou créer une nouvelle liste.

```csharp
// Solution : boucle for à l'envers
for (int i = noms.Count - 1; i >= 0; i--)
{
    if (noms[i] == "Bob")
    {
        noms.RemoveAt(i);
    }
}
```

---

### Piège 4 : Confusion entre `=` et `==`

**Problème** : `=` est l'assignation, `==` est la comparaison. En C#, le compilateur refuse `=` dans un `if` (sauf pour les booléens), mais c'est une source fréquente d'erreurs logiques.

```csharp
int x = 5;
// if (x = 10)  // Erreur de compilation en C# (sauf bool)
if (x == 10)    // Correct : comparaison
{
    Console.WriteLine("x vaut 10");
}
```

---

## Checklist de Validation

- [ ] Je sais utiliser `if`, `else if` et `else` pour des conditions
- [ ] Je sais utiliser l'opérateur ternaire `? :`
- [ ] Je sais écrire un `switch` classique et une switch expression
- [ ] Je comprends le pattern matching avec plages (`>= 90`) et patterns multiples (`or`)
- [ ] Je sais utiliser les boucles `for`, `foreach`, `while` et `do-while`
- [ ] Je sais utiliser `break` et `continue`
- [ ] Je connais les opérateurs logiques `&&`, `||` et `!`

---

## Exercice Pratique

**Énoncé** : Crée un programme de jeu "Devine le nombre" :

1. Le programme choisit un nombre aléatoire entre 1 et 100
2. L'utilisateur a 7 essais pour deviner le nombre
3. Après chaque essai, le programme indique si le nombre est "trop grand" ou "trop petit"
4. Affiche le nombre d'essais utilisés en cas de victoire
5. Révèle le nombre secret en cas de défaite

**Indications** :

- Utilise `Random` pour générer un nombre : `new Random().Next(1, 101)`
- Utilise une boucle `while` ou `do-while` avec un compteur d'essais
- Utilise `int.TryParse` pour valider la saisie

**Résultat attendu** :

```text
Devine le nombre (entre 1 et 100) - 7 essais
Essai 1/7 : 50
Trop grand !
Essai 2/7 : 25
Trop petit !
Essai 3/7 : 37
Bravo ! Tu as trouvé 37 en 3 essais !
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```csharp
// Générer un nombre aléatoire entre 1 et 100
int nombreSecret = new Random().Next(1, 101);
const int MaxEssais = 7;
int essais = 0;
bool trouve = false;

Console.WriteLine($"Devine le nombre (entre 1 et 100) - {MaxEssais} essais");

// Boucle de jeu
while (essais < MaxEssais && !trouve)
{
    essais++;
    Console.Write($"Essai {essais}/{MaxEssais} : ");

    // Valider la saisie
    if (!int.TryParse(Console.ReadLine(), out int proposition))
    {
        Console.WriteLine("Entre un nombre valide !");
        essais--;  // Ne pas compter cet essai
        continue;
    }

    // Comparer avec le nombre secret
    if (proposition == nombreSecret)
    {
        trouve = true;
        Console.WriteLine($"Bravo ! Tu as trouvé {nombreSecret} en {essais} essai{(essais > 1 ? "s" : "")} !");
    }
    else if (proposition > nombreSecret)
    {
        Console.WriteLine("Trop grand !");
    }
    else
    {
        Console.WriteLine("Trop petit !");
    }
}

// Message de défaite
if (!trouve)
{
    Console.WriteLine($"Perdu ! Le nombre était {nombreSecret}.");
}
```

---

## Navigation

← Fiche précédente : **[Variables et types](02-variables-types.md)**

→ Fiche suivante : **[Fonctions et méthodes](04-fonctions-methodes.md)**
