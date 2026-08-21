---
tags:
  - C#
  - Débutant
  - Concept
description: "Comprendre les types de données en C# : int, string, bool, decimal, var, constantes et types nullable."
estimated_time: "60 min"
fiche_number: 2
total_fiches: 10
cursus: "C#"
id: "web.csharp.variables-types"
course_id: "web.csharp"
content_type: "lesson"
order: 2
---

# 02 - Variables et types

> **En bref** : Comprendre les types de données en C#, déclarer des variables, utiliser les constantes et gérer les valeurs null. Lecture estimée : 60 min.

## Prérequis

- Avoir terminé la fiche **[01 - Introduction à C#](01-introduction-csharp.md)**
- Savoir créer et exécuter un projet console avec `dotnet run`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déclarer des variables avec les bons types, utiliser les constantes, distinguer les types valeur des types référence et gérer les valeurs null avec le type nullable.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un type de données ?

**Définition** : Un type de données définit la nature d'une valeur (nombre entier, texte, nombre décimal, vrai/faux) et les opérations possibles sur cette valeur. En C#, chaque variable doit avoir un type connu au moment de la compilation.

**Le problème que le typage résout** :

Sans typage strict, voici les problèmes rencontrés :

1. **Opérations absurdes** : Rien n'empêche d'additionner un texte et une date, ce qui n'a aucun sens.
2. **Bugs silencieux** : Le programme continue de fonctionner avec des données corrompues au lieu de signaler l'erreur.
3. **Allocation mémoire inefficace** : Sans connaître le type, le programme ne peut pas optimiser l'espace mémoire utilisé.

**Comment le typage résout ces problèmes** :

| Problème | Solution apportée par le typage |
| -------- | ------------------------------- |
| Opérations absurdes | Le compilateur refuse les opérations entre types incompatibles |
| Bugs silencieux | Les erreurs de type sont détectées avant l'exécution |
| Allocation mémoire inefficace | Le compilateur connaît la taille exacte de chaque type |

**Analogie concrète** : Les types de données fonctionnent comme les unités de mesure en cuisine. Tu ne mélanges pas 200 grammes avec 3 minutes - ce sont des unités (types) différentes. Le compilateur C# joue le rôle du chef cuisinier qui vérifie que tu ne fais pas d'erreur d'unité.

---

### Les types numériques

C# propose plusieurs types numériques selon la précision et la plage de valeurs nécessaires :

**Types entiers** :

| Type | Taille | Plage de valeurs | Utilisation courante |
| ---- | ------ | ---------------- | -------------------- |
| `byte` | 1 octet | 0 à 255 | Données binaires, couleurs |
| `short` | 2 octets | -32 768 à 32 767 | Petits nombres |
| `int` | 4 octets | -2,1 milliards à 2,1 milliards | Choix par défaut pour les entiers |
| `long` | 8 octets | Très grandes valeurs | Identifiants, timestamps |

**Types décimaux** :

| Type | Taille | Précision | Utilisation courante |
| ---- | ------ | --------- | -------------------- |
| `float` | 4 octets | 6-7 chiffres significatifs | Calculs scientifiques (approximatifs) |
| `double` | 8 octets | 15-16 chiffres significatifs | Choix par défaut pour les décimaux |
| `decimal` | 16 octets | 28-29 chiffres significatifs | Calculs financiers (précision exacte) |

---

### Types valeur vs types référence

**Définition** : En C#, les types se divisent en deux catégories fondamentales. Les **types valeur** stockent directement la donnée en mémoire (pile). Les **types référence** stockent une adresse qui pointe vers la donnée en mémoire (tas).

**Le problème que cette distinction résout** :

Sans cette distinction, voici les problèmes rencontrés :

1. **Performance dégradée** : Stocker tous les petits nombres dans le tas (heap) avec une référence est inefficace.
2. **Comportement imprévisible** : Sans savoir si une variable contient la valeur elle-même ou une référence, on ne peut pas prédire le résultat d'une copie.

**Comment cette distinction résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Performance dégradée | Les types valeur (int, bool, struct) vivent sur la pile, rapide d'accès |
| Comportement imprévisible | La règle est claire : valeur = copie indépendante, référence = même objet |

**Analogie concrète** : Un type valeur, c'est comme photocopier un document - la copie et l'original sont indépendants. Un type référence, c'est comme donner l'adresse d'un bureau - deux personnes avec la même adresse arrivent au même bureau.

| Types valeur | Types référence |
| ------------ | --------------- |
| `int`, `double`, `bool`, `char`, `decimal` | `string`, `object`, `int[]`, classes |
| `struct`, `enum` | Interfaces, delegates |
| Copie = nouvelle valeur indépendante | Copie = même objet partagé |
| Ne peut pas être `null` (sauf nullable) | Peut être `null` |

---

### Qu'est-ce qu'un type nullable ?

**Définition** : Un type nullable est un type valeur auquel on ajoute la possibilité d'être `null` (absence de valeur). En C#, on l'indique avec un point d'interrogation (`?`) après le type : `int?`.

**Le problème que les types nullable résolvent** :

Sans types nullable, voici les problèmes rencontrés :

1. **Valeurs sentinelles** : Pour représenter "pas de valeur", on utilise des conventions comme `-1` ou `0`, ce qui peut être confondu avec une vraie valeur.
2. **Erreurs silencieuses** : Un `int` vaut toujours `0` par défaut, même quand l'utilisateur n'a rien saisi.

**Comment les types nullable résolvent ces problèmes** :

| Problème | Solution apportée par nullable |
| -------- | ------------------------------ |
| Valeurs sentinelles | `null` signifie explicitement "pas de valeur" |
| Erreurs silencieuses | Le compilateur t'oblige à vérifier si la valeur existe avant de l'utiliser |

**Analogie concrète** : Imagine un formulaire avec un champ "Numéro de téléphone secondaire". Ce champ peut être rempli (une valeur) ou laissé vide (null). Un type nullable, c'est un champ qui accepte d'être vide.

**Ce que nullable n'est PAS** :

- Nullable ne signifie pas "égal à zéro". `null` veut dire "aucune valeur", tandis que `0` est une valeur (le nombre zéro).
- Nullable ne rend pas le code dangereux. Au contraire, il rend les absences de valeur explicites et vérifiables.

---

## Étapes Pratiques

### Étape 1 : Déclarer des variables avec des types explicites

Crée un nouveau projet et remplace le contenu de `Program.cs` :

```bash
# Créer un nouveau projet
dotnet new console -n types-demo
cd types-demo
```

```csharp
// --- Types entiers ---
int age = 25;                    // Nombre entier (choix par défaut)
long population = 8_000_000_000; // Nombre très grand (séparateur _ pour la lisibilité)
byte octet = 255;                // Petit nombre positif (0 à 255)

Console.WriteLine($"Âge : {age}");
Console.WriteLine($"Population mondiale : {population}");
Console.WriteLine($"Octet max : {octet}");

// --- Types décimaux ---
double pi = 3.141592653589793;   // Nombre décimal (choix par défaut)
float temperature = 36.6f;       // Décimal moins précis (suffixe f obligatoire)
decimal prix = 19.99m;           // Précision financière (suffixe m obligatoire)

Console.WriteLine($"Pi : {pi}");
Console.WriteLine($"Température : {temperature}°C");
Console.WriteLine($"Prix : {prix} €");

// --- Autres types ---
bool estActif = true;            // Vrai ou faux
char initiale = 'T';             // Un seul caractère (guillemets simples)
string nom = "Thomas";           // Chaîne de caractères (guillemets doubles)

Console.WriteLine($"Actif : {estActif}");
Console.WriteLine($"Initiale : {initiale}");
Console.WriteLine($"Nom : {nom}");
```

```bash
dotnet run
```

**Résultat attendu** :

```text
Âge : 25
Population mondiale : 8000000000
Octet max : 255
Pi : 3.141592653589793
Température : 36.6°C
Prix : 19.99 €
Actif : True
Initiale : T
Nom : Thomas
```

---

### Étape 2 : Utiliser `var` (inférence de type)

Le mot-clé `var` demande au compilateur de déduire le type automatiquement :

```csharp
// Le compilateur déduit le type à partir de la valeur assignée
var compteur = 0;           // int (déduit)
var message = "Bonjour";    // string (déduit)
var actif = true;           // bool (déduit)
var montant = 49.99m;       // decimal (déduit grâce au suffixe m)

// Afficher les types réels pour vérification
Console.WriteLine($"compteur est un {compteur.GetType().Name} = {compteur}");
Console.WriteLine($"message est un {message.GetType().Name} = {message}");
Console.WriteLine($"actif est un {actif.GetType().Name} = {actif}");
Console.WriteLine($"montant est un {montant.GetType().Name} = {montant}");

// Attention : var nécessite une initialisation immédiate
// var x;          // Erreur : le compilateur ne peut pas déduire le type
// var y = null;   // Erreur : null n'a pas de type
```

**Résultat attendu** :

```text
compteur est un Int32 = 0
message est un String = Bonjour
actif est un Boolean = True
montant est un Decimal = 49.99
```

---

### Étape 3 : Constantes

Les constantes sont des valeurs qui ne changent jamais après leur déclaration :

```csharp
// Déclarer une constante avec le mot-clé const
const double TauxTVA = 0.20;          // 20% de TVA
const int AgeMaximum = 150;           // Valeur maximale acceptée
const string NomApplication = "MonApp"; // Nom de l'application

Console.WriteLine($"TVA : {TauxTVA * 100}%");
Console.WriteLine($"Âge max : {AgeMaximum}");
Console.WriteLine($"Application : {NomApplication}");

// Utiliser la constante dans un calcul
double prixHT = 100.0;
double prixTTC = prixHT * (1 + TauxTVA);
Console.WriteLine($"Prix HT : {prixHT} € -> Prix TTC : {prixTTC} €");

// Tenter de modifier une constante provoque une erreur de compilation
// TauxTVA = 0.055;  // Erreur : impossible de modifier une constante
```

**Résultat attendu** :

```text
TVA : 20%
Âge max : 150
Application : MonApp
Prix HT : 100 € -> Prix TTC : 120 €
```

---

### Étape 4 : Types nullable

```csharp
// Déclarer un int nullable avec le suffixe ?
int? nombreOptional = null;
Console.WriteLine($"Valeur : {nombreOptional}");           // Affiche rien (null)
Console.WriteLine($"A une valeur : {nombreOptional.HasValue}"); // False

// Assigner une valeur
nombreOptional = 42;
Console.WriteLine($"Valeur : {nombreOptional}");           // 42
Console.WriteLine($"A une valeur : {nombreOptional.HasValue}"); // True
Console.WriteLine($"Valeur extraite : {nombreOptional.Value}"); // 42

// Opérateur ?? : fournir une valeur par défaut si null
int? score = null;
int scoreAffiche = score ?? 0;  // Si score est null, utiliser 0
Console.WriteLine($"Score : {scoreAffiche}");  // 0

score = 85;
scoreAffiche = score ?? 0;
Console.WriteLine($"Score : {scoreAffiche}");  // 85

// Opérateur ??= : assigner seulement si null
int? niveau = null;
niveau ??= 1;  // niveau est null, donc on assigne 1
Console.WriteLine($"Niveau : {niveau}");  // 1

niveau ??= 5;  // niveau n'est plus null (vaut 1), on ne change rien
Console.WriteLine($"Niveau : {niveau}");  // 1 (inchangé)
```

**Résultat attendu** :

```text
Valeur :
A une valeur : False
Valeur : 42
A une valeur : True
Valeur extraite : 42
Score : 0
Score : 85
Niveau : 1
Niveau : 1
```

---

### Étape 5 : Conversions de types

```csharp
// --- Conversion implicite (sans perte de données) ---
int entier = 42;
double decimal1 = entier;  // int -> double : OK, pas de perte
Console.WriteLine($"int {entier} -> double {decimal1}");

// --- Conversion explicite (cast) - risque de perte ---
double pi = 3.14159;
int arrondi = (int)pi;  // double -> int : la partie décimale est perdue
Console.WriteLine($"double {pi} -> int {arrondi}");

// --- Conversion avec les méthodes Parse ---
string texteNombre = "123";
int nombre = int.Parse(texteNombre);  // string -> int
Console.WriteLine($"string \"{texteNombre}\" -> int {nombre}");

// --- Conversion sécurisée avec TryParse ---
string saisie = "abc";  // Ce n'est pas un nombre valide
bool reussi = int.TryParse(saisie, out int resultat);
Console.WriteLine($"Conversion de \"{saisie}\" réussie : {reussi}, valeur : {resultat}");

string saisieValide = "456";
reussi = int.TryParse(saisieValide, out resultat);
Console.WriteLine($"Conversion de \"{saisieValide}\" réussie : {reussi}, valeur : {resultat}");

// --- Conversion en string avec ToString ---
int age = 25;
string ageTexte = age.ToString();
Console.WriteLine($"int {age} -> string \"{ageTexte}\"");
```

**Résultat attendu** :

```text
int 42 -> double 42
double 3.14159 -> int 3
string "123" -> int 123
Conversion de "abc" réussie : False, valeur : 0
Conversion de "456" réussie : True, valeur : 456
int 25 -> string "25"
```

---

### Étape 6 : Opérations sur les chaînes de caractères

```csharp
string prenom = "Thomas";
string nom = "Dupont";

// Concaténation avec +
string nomComplet = prenom + " " + nom;
Console.WriteLine($"Concaténation : {nomComplet}");

// Interpolation de chaîne (recommandé)
string presentation = $"Je m'appelle {prenom} {nom}";
Console.WriteLine(presentation);

// Propriétés et méthodes utiles
Console.WriteLine($"Longueur : {prenom.Length}");           // 6
Console.WriteLine($"Majuscules : {prenom.ToUpper()}");      // THOMAS
Console.WriteLine($"Minuscules : {prenom.ToLower()}");      // thomas
Console.WriteLine($"Contient 'om' : {prenom.Contains("om")}"); // True
Console.WriteLine($"Commence par 'Th' : {prenom.StartsWith("Th")}"); // True
Console.WriteLine($"Position de 'a' : {prenom.IndexOf('a')}");  // 4
Console.WriteLine($"Sous-chaîne : {prenom.Substring(0, 3)}");   // Tho
Console.WriteLine($"Remplacement : {prenom.Replace("Th", "R")}"); // Romas

// Chaîne vide vs null
string vide = "";
string? nulle = null;
Console.WriteLine($"Vide est null ou vide : {string.IsNullOrEmpty(vide)}");    // True
Console.WriteLine($"Nulle est null ou vide : {string.IsNullOrEmpty(nulle)}");  // True

// Chaîne verbatim (raw string) - utile pour les chemins de fichiers
string chemin = @"C:\Users\Thomas\Documents";
Console.WriteLine($"Chemin : {chemin}");
```

**Résultat attendu** :

```text
Concaténation : Thomas Dupont
Je m'appelle Thomas Dupont
Longueur : 6
Majuscules : THOMAS
Minuscules : thomas
Contient 'om' : True
Commence par 'Th' : True
Position de 'a' : 4
Sous-chaîne : Tho
Remplacement : Romas
Vide est null ou vide : True
Nulle est null ou vide : True
Chemin : C:\Users\Thomas\Documents
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `dotnet new console -n NomProjet` | Créer un projet avec un nom spécifique |
| `dotnet run` | Compiler et exécuter |
| `dotnet build` | Compiler sans exécuter |

---

## Pièges Fréquents

### Piège 1 : Oublier le suffixe des littéraux décimaux

**Problème** : Sans suffixe, `19.99` est un `double`, pas un `decimal`. Le code suivant provoque une erreur de compilation.

```csharp
// Erreur : impossible de convertir double en decimal implicitement
decimal prix = 19.99;
```

**Solution** : Ajouter le suffixe `m` pour `decimal` et `f` pour `float`.

```csharp
decimal prix = 19.99m;    // Suffixe m pour decimal
float temperature = 36.6f; // Suffixe f pour float
```

---

### Piège 2 : Utiliser `==` pour comparer des chaînes

**Problème** : En Java, `==` compare les références, pas les valeurs des chaînes. En C#, `==` compare les valeurs, ce qui est le comportement attendu.

```csharp
// En C#, cette comparaison fonctionne correctement
string a = "hello";
string b = "hello";
Console.WriteLine(a == b);  // True (comparaison de valeurs)
```

Ce n'est pas un piège en C#, mais un point à connaître si tu viens de Java.

---

### Piège 3 : Utiliser Parse au lieu de TryParse

**Problème** : `int.Parse()` lève une exception si la chaîne n'est pas un nombre valide.

```csharp
// Plantage si l'utilisateur saisit "abc"
int nombre = int.Parse(Console.ReadLine()!);
```

**Solution** : Utiliser `int.TryParse()` pour une conversion sécurisée.

```csharp
// Conversion sécurisée sans risque de plantage
if (int.TryParse(Console.ReadLine(), out int nombre))
{
    Console.WriteLine($"Nombre valide : {nombre}");
}
else
{
    Console.WriteLine("Ce n'est pas un nombre valide.");
}
```

---

### Piège 4 : Confondre `null` et chaîne vide

**Problème** : `null` (aucune valeur) et `""` (chaîne vide) sont deux choses différentes.

**Solution** : Utiliser `string.IsNullOrEmpty()` ou `string.IsNullOrWhiteSpace()` pour vérifier les deux cas.

```csharp
string? saisie = Console.ReadLine();

// Vérifie null ET chaîne vide ET espaces uniquement
if (string.IsNullOrWhiteSpace(saisie))
{
    Console.WriteLine("Tu n'as rien saisi.");
}
```

---

## Checklist de Validation

- [ ] Je sais déclarer des variables avec un type explicite (`int`, `string`, `bool`, `decimal`)
- [ ] Je comprends la différence entre `float`, `double` et `decimal`
- [ ] Je sais utiliser `var` et je comprends que le type est quand même fixé à la compilation
- [ ] Je sais déclarer des constantes avec `const`
- [ ] Je comprends la différence entre type valeur et type référence
- [ ] Je sais utiliser les types nullable (`int?`) et l'opérateur `??`
- [ ] Je sais convertir entre types avec `Parse`, `TryParse` et le cast `(int)`

---

## Exercice Pratique

**Énoncé** : Crée un programme qui simule un convertisseur de devises :

1. Déclare une constante pour le taux de conversion EUR -> USD (1.08)
2. Demande à l'utilisateur un montant en euros
3. Utilise `TryParse` pour valider la saisie
4. Calcule et affiche le montant en dollars avec 2 décimales
5. Gère le cas où l'utilisateur saisit un texte invalide

**Indications** :

- Utilise `decimal` pour les montants (précision financière)
- Utilise `decimal.TryParse()` pour la conversion sécurisée
- Utilise `:F2` dans l'interpolation pour afficher 2 décimales : `$"{montant:F2}"`

**Résultat attendu** :

```text
Convertisseur EUR -> USD
Taux de conversion : 1 EUR = 1.08 USD
Entre un montant en euros : 100
100.00 EUR = 108.00 USD
```

Cas d'erreur :

```text
Convertisseur EUR -> USD
Taux de conversion : 1 EUR = 1.08 USD
Entre un montant en euros : abc
Erreur : "abc" n'est pas un montant valide.
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```csharp
// Constante : taux de conversion EUR -> USD
const decimal TauxEurUsd = 1.08m;

// Afficher l'en-tête
Console.WriteLine("Convertisseur EUR -> USD");
Console.WriteLine($"Taux de conversion : 1 EUR = {TauxEurUsd} USD");

// Demander le montant
Console.Write("Entre un montant en euros : ");
string? saisie = Console.ReadLine();

// Valider la saisie avec TryParse
if (decimal.TryParse(saisie, out decimal montantEur))
{
    // Calculer le montant en dollars
    decimal montantUsd = montantEur * TauxEurUsd;

    // Afficher le résultat avec 2 décimales
    Console.WriteLine($"{montantEur:F2} EUR = {montantUsd:F2} USD");
}
else
{
    // Gérer la saisie invalide
    Console.WriteLine($"Erreur : \"{saisie}\" n'est pas un montant valide.");
}
```

---

## Navigation

← Fiche précédente : **[Introduction à C#](01-introduction-csharp.md)**

→ Fiche suivante : **[Conditions et boucles](03-conditions-boucles.md)**
