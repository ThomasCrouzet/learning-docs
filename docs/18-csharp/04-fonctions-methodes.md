---
tags:
  - C#
  - Débutant
  - Pratique
description: "Maîtriser les fonctions et méthodes en C# : paramètres, ref/out, surcharge, méthodes d'extension et tuples."
estimated_time: "60 min"
fiche_number: 4
total_fiches: 10
cursus: "C#"
id: "web.csharp.fonctions-methodes"
course_id: "web.csharp"
content_type: "lesson"
order: 4
---

# 04 - Fonctions et méthodes

> **En bref** : Apprendre à déclarer et utiliser des fonctions en C#, avec les paramètres ref/out, la surcharge, les méthodes d'extension et les tuples de retour. Lecture estimée : 60 min.

## Prérequis

- Avoir terminé la fiche **[03 - Conditions et boucles](03-conditions-boucles.md)**
- Savoir utiliser les structures de contrôle (if/else, boucles)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déclarer des méthodes avec différents types de paramètres, utiliser la surcharge, retourner plusieurs valeurs avec des tuples et créer des méthodes d'extension.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une méthode ?

**Définition** : Une méthode (ou fonction) est un bloc de code nommé qui effectue une tâche précise. Elle peut recevoir des données en entrée (paramètres) et retourner un résultat.

**Le problème que les méthodes résolvent** :

Sans méthodes, voici les problèmes rencontrés :

1. **Duplication de code** : Le même bloc de code est copié-collé à plusieurs endroits. Une correction doit être faite partout.
2. **Code illisible** : Un fichier de 500 lignes sans découpage est impossible à comprendre.
3. **Tests impossibles** : Sans méthode isolée, on ne peut pas tester un comportement précis.

**Comment les méthodes résolvent ces problèmes** :

| Problème | Solution apportée par les méthodes |
| -------- | ---------------------------------- |
| Duplication de code | Écrire le code une fois, l'appeler plusieurs fois |
| Code illisible | Chaque méthode a un nom descriptif et une responsabilité unique |
| Tests impossibles | Chaque méthode peut être testée indépendamment |

**Analogie concrète** : Une méthode fonctionne comme une recette de cuisine. Tu écris la recette une fois (déclaration), puis tu la suis à chaque fois que tu veux préparer le plat (appel). Les ingrédients sont les paramètres, le plat terminé est la valeur de retour.

**Ce qu'une méthode n'est PAS** :

- Une méthode n'est pas un programme complet. C'est un morceau de programme réutilisable.
- En C#, "fonction" et "méthode" désignent la même chose. Le terme "méthode" est utilisé parce que le code est toujours à l'intérieur d'une classe (même implicitement avec les top-level statements).

---

### Qu'est-ce que ref et out ?

**Définition** : `ref` et `out` sont des modificateurs de paramètres qui permettent à une méthode de modifier la variable originale de l'appelant, au lieu de travailler sur une copie.

**Le problème que ref/out résolvent** :

Sans `ref` et `out`, voici les problèmes rencontrés :

1. **Copie par valeur** : Les types valeur (int, bool, struct) sont copiés quand on les passe à une méthode. La modification dans la méthode ne change pas la variable originale.
2. **Retour unique** : Une méthode ne peut retourner qu'une seule valeur avec `return`. Pour retourner plusieurs informations, il faut créer une classe ou un objet spécial.

**Comment ref/out résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Copie par valeur | `ref` passe la variable par référence - la méthode modifie l'original |
| Retour unique | `out` permet à une méthode de "retourner" plusieurs valeurs via ses paramètres |

**Différence entre ref et out** :

| `ref` | `out` |
| ----- | ----- |
| La variable doit être initialisée avant l'appel | La variable peut ne pas être initialisée |
| La méthode peut lire et modifier la valeur | La méthode doit obligatoirement assigner une valeur |
| Utilisé pour modifier une valeur existante | Utilisé pour retourner une valeur additionnelle |

**Analogie concrète** : `ref` fonctionne comme prêter un carnet à quelqu'un - il peut lire ce qui est écrit et ajouter des notes. `out` fonctionne comme donner un carnet vide à quelqu'un avec l'obligation d'y écrire quelque chose avant de le rendre.

---

### Qu'est-ce qu'une méthode d'extension ?

**Définition** : Une méthode d'extension permet d'ajouter des méthodes à un type existant (comme `string` ou `int`) sans modifier son code source. La méthode s'utilise comme si elle faisait partie du type original.

**Le problème que les méthodes d'extension résolvent** :

Sans méthodes d'extension, voici les problèmes rencontrés :

1. **Types non modifiables** : Tu ne peux pas ajouter de méthode à `string` ou `int` car ce sont des types du framework .NET.
2. **Méthodes utilitaires dispersées** : Les fonctions helper sont appelées avec une syntaxe `Helper.Methode(objet)` au lieu de `objet.Methode()`.

**Comment les méthodes d'extension résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Types non modifiables | Les méthodes d'extension ajoutent des méthodes sans modifier le type |
| Syntaxe dispersée | La méthode s'appelle directement sur l'objet : `"texte".MaMethode()` |

**Ce que les méthodes d'extension ne sont PAS** :

- Elles ne modifient pas le type original. Elles sont compilées comme des méthodes statiques classiques.
- Elles n'ont pas accès aux membres privés du type. Elles ne peuvent utiliser que l'API publique.

---

## Étapes Pratiques

### Étape 1 : Déclarer et appeler des méthodes simples

```bash
dotnet new console -n methodes-demo
cd methodes-demo
```

```csharp
// --- Méthode sans paramètre et sans retour (void) ---
static void AfficherBienvenue()
{
    Console.WriteLine("=========================");
    Console.WriteLine("  Bienvenue dans le programme !");
    Console.WriteLine("=========================");
}

// --- Méthode avec paramètres et retour ---
static double Additionner(double a, double b)
{
    return a + b;
}

// --- Méthode avec expression body (raccourci pour une seule expression) ---
static double Multiplier(double a, double b) => a * b;

// --- Méthode qui retourne un booléen ---
static bool EstPair(int nombre) => nombre % 2 == 0;

// --- Appels des méthodes ---
AfficherBienvenue();

double somme = Additionner(3.5, 2.7);
Console.WriteLine($"3.5 + 2.7 = {somme}");

double produit = Multiplier(4, 5);
Console.WriteLine($"4 x 5 = {produit}");

Console.WriteLine($"10 est pair : {EstPair(10)}");
Console.WriteLine($"7 est pair : {EstPair(7)}");
```

**Résultat attendu** :

```text
=========================
  Bienvenue dans le programme !
=========================
3.5 + 2.7 = 6.2
4 x 5 = 20
10 est pair : True
7 est pair : False
```

---

### Étape 2 : Paramètres par défaut et paramètres nommés

```csharp
// Méthode avec paramètres par défaut
static string Saluer(string prenom, string formule = "Bonjour", bool majuscules = false)
{
    string message = $"{formule}, {prenom} !";
    return majuscules ? message.ToUpper() : message;
}

// Appel avec tous les paramètres
Console.WriteLine(Saluer("Alice", "Salut", true));

// Appel avec les paramètres par défaut
Console.WriteLine(Saluer("Bob"));

// Appel avec paramètres nommés (ordre libre)
Console.WriteLine(Saluer(prenom: "Charlie", majuscules: true));

// Appel avec mélange positionnels et nommés
Console.WriteLine(Saluer("Diana", formule: "Coucou"));
```

**Résultat attendu** :

```text
SALUT, ALICE !
Bonjour, Bob !
BONJOUR, CHARLIE !
Coucou, Diana !
```

---

### Étape 3 : Paramètres ref et out

```csharp
// --- ref : modifier la variable originale ---
static void Doubler(ref int nombre)
{
    nombre *= 2;  // Modifie directement la variable de l'appelant
}

int valeur = 10;
Console.WriteLine($"Avant Doubler : {valeur}");  // 10
Doubler(ref valeur);                              // Passer par référence
Console.WriteLine($"Après Doubler : {valeur}");   // 20

// --- out : retourner plusieurs valeurs ---
static void Diviser(int dividende, int diviseur, out int quotient, out int reste)
{
    quotient = dividende / diviseur;
    reste = dividende % diviseur;
}

Diviser(17, 5, out int q, out int r);
Console.WriteLine($"17 / 5 = {q} reste {r}");

// --- Exemple concret : TryParse utilise out ---
Console.Write("Entre un nombre : ");
if (int.TryParse(Console.ReadLine(), out int nombre))
{
    Console.WriteLine($"Tu as entré : {nombre}");
}
else
{
    Console.WriteLine("Ce n'est pas un nombre valide.");
}

// --- out avec discard (_) : ignorer une valeur de sortie ---
Diviser(20, 3, out int quotientSeul, out _);  // On ignore le reste
Console.WriteLine($"20 / 3 = {quotientSeul} (reste ignoré)");
```

**Résultat attendu** :

```text
Avant Doubler : 10
Après Doubler : 20
17 / 5 = 3 reste 2
Entre un nombre : 42
Tu as entré : 42
20 / 3 = 6 (reste ignoré)
```

---

### Étape 4 : Surcharge de méthodes (overloading)

La surcharge permet de définir plusieurs méthodes avec le même nom mais des paramètres différents :

```csharp
// Surcharge 1 : deux entiers
static int Additionner(int a, int b)
{
    Console.Write($"  int + int : ");
    return a + b;
}

// Surcharge 2 : trois entiers
static int Additionner(int a, int b, int c)
{
    Console.Write($"  int + int + int : ");
    return a + b + c;
}

// Surcharge 3 : deux chaînes (concaténation)
static string Additionner(string a, string b)
{
    Console.Write($"  string + string : ");
    return a + " " + b;
}

// Le compilateur choisit la bonne surcharge selon les arguments
Console.WriteLine(Additionner(3, 5));
Console.WriteLine(Additionner(1, 2, 3));
Console.WriteLine(Additionner("Hello", "World"));
```

**Résultat attendu** :

```text
  int + int : 8
  int + int + int : 6
  string + string : Hello World
```

---

### Étape 5 : Tuples - retourner plusieurs valeurs

```csharp
// Méthode qui retourne un tuple nommé
static (string nom, int age, string ville) ObtenirProfil()
{
    return ("Alice", 25, "Lyon");
}

// Méthode qui retourne un tuple pour des statistiques
static (int min, int max, double moyenne) CalculerStats(int[] nombres)
{
    int min = nombres[0];
    int max = nombres[0];
    int somme = 0;

    foreach (int n in nombres)
    {
        if (n < min) min = n;
        if (n > max) max = n;
        somme += n;
    }

    double moyenne = (double)somme / nombres.Length;
    return (min, max, moyenne);
}

// Utiliser le tuple complet
var profil = ObtenirProfil();
Console.WriteLine($"Nom : {profil.nom}, Âge : {profil.age}, Ville : {profil.ville}");

// Déconstruction du tuple en variables séparées
var (nom, age, ville) = ObtenirProfil();
Console.WriteLine($"{nom} a {age} ans et vit à {ville}");

// Statistiques
int[] notes = { 12, 18, 7, 15, 9, 14 };
var stats = CalculerStats(notes);
Console.WriteLine($"Notes : min={stats.min}, max={stats.max}, moyenne={stats.moyenne:F1}");

// Déconstruction partielle avec discard
var (_, _, moy) = CalculerStats(notes);
Console.WriteLine($"Moyenne seule : {moy:F1}");
```

**Résultat attendu** :

```text
Nom : Alice, Âge : 25, Ville : Lyon
Alice a 25 ans et vit à Lyon
Notes : min=7, max=18, moyenne=12.5
Moyenne seule : 12.5
```

---

### Étape 6 : Méthodes d'extension

```csharp
// Les méthodes d'extension doivent être dans une classe statique
static class StringExtensions
{
    // Le mot-clé "this" devant le premier paramètre en fait une méthode d'extension
    public static string Inverser(this string texte)
    {
        char[] caracteres = texte.ToCharArray();
        Array.Reverse(caracteres);
        return new string(caracteres);
    }

    // Méthode d'extension qui compte les mots
    public static int CompterMots(this string texte)
    {
        if (string.IsNullOrWhiteSpace(texte))
            return 0;
        return texte.Split(' ', StringSplitOptions.RemoveEmptyEntries).Length;
    }

    // Méthode d'extension qui tronque un texte
    public static string Tronquer(this string texte, int longueurMax)
    {
        if (texte.Length <= longueurMax)
            return texte;
        return texte.Substring(0, longueurMax - 3) + "...";
    }
}

// Utilisation des méthodes d'extension
// Elles s'appellent comme si elles faisaient partie du type string
string phrase = "Le C# est un langage moderne";

Console.WriteLine($"Original : {phrase}");
Console.WriteLine($"Inversé : {phrase.Inverser()}");
Console.WriteLine($"Nombre de mots : {phrase.CompterMots()}");
Console.WriteLine($"Tronqué (15) : {phrase.Tronquer(15)}");
Console.WriteLine($"Tronqué (50) : {phrase.Tronquer(50)}");
```

**Résultat attendu** :

```text
Original : Le C# est un langage moderne
Inversé : enredom egagnal nu tse #C eL
Nombre de mots : 6
Tronqué (15) : Le C# est un...
Tronqué (50) : Le C# est un langage moderne
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `dotnet run` | Compiler et exécuter le projet |
| `dotnet build` | Compiler sans exécuter |

---

## Pièges Fréquents

### Piège 1 : Oublier `ref` à l'appel

**Problème** : Le mot-clé `ref` doit être présent à la fois dans la déclaration ET dans l'appel.

```csharp
static void Doubler(ref int n) { n *= 2; }

int x = 5;
// Doubler(x);      // Erreur de compilation
Doubler(ref x);     // Correct
```

---

### Piège 2 : Confondre surcharge et paramètres par défaut

**Problème** : Deux surcharges avec des paramètres par défaut peuvent créer une ambiguïté.

```csharp
// Ambiguïté possible
static void Afficher(string msg) { }
static void Afficher(string msg, int fois = 1) { }

// Afficher("test");  // Erreur : le compilateur ne sait pas quelle version choisir
```

**Solution** : Éviter les paramètres par défaut quand une surcharge sans ce paramètre existe déjà.

---

### Piège 3 : Modifier un type valeur sans ref

**Problème** : Passer un `int` sans `ref` crée une copie. La modification dans la méthode n'affecte pas l'original.

```csharp
static void Incrementer(int n) { n++; }  // Modifie la copie

int x = 5;
Incrementer(x);
Console.WriteLine(x);  // 5 (inchangé !)
```

**Solution** : Utiliser `ref` si la méthode doit modifier la variable originale.

```csharp
static void Incrementer(ref int n) { n++; }

int x = 5;
Incrementer(ref x);
Console.WriteLine(x);  // 6 (modifié)
```

---

## Checklist de Validation

- [ ] Je sais déclarer une méthode avec des paramètres et une valeur de retour
- [ ] Je sais utiliser les paramètres par défaut et les paramètres nommés
- [ ] Je comprends la différence entre `ref` et `out`
- [ ] Je sais utiliser la surcharge de méthodes
- [ ] Je sais retourner plusieurs valeurs avec des tuples
- [ ] Je sais créer et utiliser des méthodes d'extension

---

## Exercice Pratique

**Énoncé** : Crée un ensemble de méthodes utilitaires pour les chaînes de caractères :

1. Une méthode `EstPalindrome(string)` qui vérifie si un mot est un palindrome (se lit pareil dans les deux sens)
2. Une méthode `CompterVoyelles(string)` qui compte les voyelles (a, e, i, o, u, y)
3. Une méthode `Analyser(string)` qui retourne un tuple avec : le nombre de caractères, le nombre de voyelles et si c'est un palindrome
4. Crée ces méthodes comme méthodes d'extension de `string`

**Indications** :

- Utilise `ToLower()` pour ignorer la casse
- Un palindrome se lit pareil de gauche à droite et de droite à gauche
- Teste avec les mots : "kayak", "bonjour", "radar"

**Résultat attendu** :

```text
"kayak" : 5 caractères, 2 voyelles, palindrome : True
"bonjour" : 7 caractères, 3 voyelles, palindrome : False
"radar" : 5 caractères, 2 voyelles, palindrome : True
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```csharp
// Classe statique pour les méthodes d'extension
static class AnalyseStringExtensions
{
    // Vérifier si un mot est un palindrome
    public static bool EstPalindrome(this string texte)
    {
        string minuscule = texte.ToLower();
        char[] inverse = minuscule.ToCharArray();
        Array.Reverse(inverse);
        return minuscule == new string(inverse);
    }

    // Compter les voyelles dans un texte
    public static int CompterVoyelles(this string texte)
    {
        int compteur = 0;
        foreach (char c in texte.ToLower())
        {
            if ("aeiouy".Contains(c))
            {
                compteur++;
            }
        }
        return compteur;
    }

    // Analyser un texte et retourner un tuple
    public static (int longueur, int voyelles, bool palindrome) Analyser(this string texte)
    {
        return (texte.Length, texte.CompterVoyelles(), texte.EstPalindrome());
    }
}

// Tester les méthodes
string[] mots = { "kayak", "bonjour", "radar" };

foreach (string mot in mots)
{
    var (longueur, voyelles, palindrome) = mot.Analyser();
    Console.WriteLine($"\"{mot}\" : {longueur} caractères, {voyelles} voyelles, palindrome : {palindrome}");
}
```

---

## Navigation

← Fiche précédente : **[Conditions et boucles](03-conditions-boucles.md)**

→ Fiche suivante : **[Classes et objets](05-classes-objets.md)**
