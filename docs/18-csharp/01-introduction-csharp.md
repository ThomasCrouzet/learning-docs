---
tags:
  - C#
  - Débutant
  - Concept
description: "Découvrir C# et la plateforme .NET, installer le SDK, créer et exécuter un premier programme Hello World."
estimated_time: "60 min"
fiche_number: 1
total_fiches: 10
cursus: "C#"
---

# 01 - Introduction à C\#

> **En bref** : Découvrir C# et la plateforme .NET, installer le SDK et créer ton premier programme Hello World. Lecture estimée : 60 min.

## Prérequis

- Avoir terminé le [cursus Java](../fondamentaux/01-java/index.md) (les concepts de POO sont similaires)
- Savoir ouvrir un terminal (invite de commandes)
- Savoir créer un fichier texte avec un éditeur (VS Code ou autre)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer le SDK .NET, créer un projet C# avec la CLI dotnet et exécuter un programme qui affiche du texte dans le terminal.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que C# ?

**Définition** : C# (prononcé "C sharp") est un langage de programmation orienté objet créé par Microsoft en 2000. Il fait partie de la plateforme .NET et permet de créer des applications console, web, mobiles et de bureau.

**Le problème que C# résout** :

Sans C# (ou un langage similaire), voici les problèmes rencontrés :

1. **Développement fragmenté** : Créer une application web, une application mobile et une application de bureau nécessite d'apprendre trois langages différents et trois écosystèmes séparés.

2. **Gestion mémoire manuelle** : Dans des langages comme C ou C++, le programmeur doit allouer et libérer la mémoire manuellement. Des erreurs provoquent des fuites mémoire ou des plantages.

3. **Outillage dispersé** : Sans plateforme unifiée, il faut assembler soi-même les outils de compilation, de gestion de dépendances et de tests.

**Comment C# résout ces problèmes** :

| Problème | Solution apportée par C# |
| -------- | ------------------------ |
| Développement fragmenté | .NET permet de cibler le web (ASP.NET), le mobile (MAUI), le bureau (WPF) et les jeux (Unity) avec un seul langage |
| Gestion mémoire manuelle | Le ramasse-miettes (garbage collector) de .NET gère automatiquement la mémoire |
| Outillage dispersé | La CLI `dotnet` fournit un outil unique pour créer, compiler, tester et publier des projets |

**Analogie concrète** : Imagine une boîte à outils universelle. Au lieu d'avoir une boîte pour la plomberie, une pour l'électricité et une pour la menuiserie, tu as une seule boîte qui contient tous les outils nécessaires. C# et .NET sont cette boîte à outils universelle pour le développement logiciel.

**Ce que C# n'est PAS** :

- C# n'est pas C ni C++. Malgré le nom similaire, C# est un langage géré (managed) avec un ramasse-miettes, contrairement à C et C++ qui nécessitent une gestion manuelle de la mémoire.
- C# n'est pas réservé à Windows. Depuis .NET 6 (2021), C# fonctionne sur Windows, macOS et Linux de manière identique.
- C# n'est pas un langage propriétaire fermé. Le SDK .NET et le compilateur sont open source sous licence MIT.

**Comparaison C# vs Java** :

| C# | Java |
| -- | ---- |
| Plateforme .NET | Plateforme JVM |
| Propriétés intégrées (`get; set;`) | Getters/setters manuels |
| LINQ pour les requêtes sur les collections | Streams API (depuis Java 8) |
| Types valeur (`struct`) et types référence (`class`) | Tout est objet (types primitifs wrappés) |
| `async/await` natif | `CompletableFuture` |
| Nullable référence types (`string?`) | `Optional<T>` |

---

### Qu'est-ce que .NET ?

**Définition** : .NET est la plateforme d'exécution (runtime) et l'ensemble des bibliothèques qui permettent de compiler et d'exécuter du code C#. Le SDK .NET inclut le compilateur, la CLI `dotnet` et les bibliothèques de base.

**Le problème que .NET résout** :

Sans une plateforme unifiée, voici les problèmes rencontrés :

1. **Portabilité limitée** : Un programme compilé pour Windows ne fonctionne pas sur Linux sans réécriture.
2. **Dépendances système** : Chaque bibliothèque externe doit être téléchargée et configurée manuellement.
3. **Pas de standard** : Chaque projet utilise des outils de build différents, rendant la collaboration difficile.

**Comment .NET résout ces problèmes** :

| Problème | Solution apportée par .NET |
| -------- | -------------------------- |
| Portabilité limitée | Le runtime .NET existe pour Windows, macOS et Linux |
| Dépendances système | NuGet (le gestionnaire de paquets) installe les bibliothèques automatiquement |
| Pas de standard | La CLI `dotnet` standardise la création, compilation et exécution des projets |

**Analogie concrète** : Si C# est la langue dans laquelle tu écris, .NET est le bureau de poste. Le bureau de poste (runtime) sait lire ta lettre (ton code), la traduire si nécessaire et la livrer (l'exécuter) dans n'importe quel pays (système d'exploitation).

**Ce que .NET n'est PAS** :

- .NET n'est pas un langage. C'est une plateforme. Plusieurs langages peuvent cibler .NET (C#, F#, VB.NET).
- .NET n'est pas .NET Framework. .NET Framework (2002-2019) était réservé à Windows. .NET (anciennement .NET Core) est la version moderne et multiplateforme.

---

### Qu'est-ce que la CLI dotnet ?

**Définition** : La CLI (Command Line Interface) `dotnet` est l'outil en ligne de commande fourni avec le SDK .NET. Elle permet de créer, compiler, exécuter et publier des projets C# depuis le terminal.

**Les commandes essentielles** :

| Commande | Action |
| -------- | ------ |
| `dotnet new console` | Crée un nouveau projet console |
| `dotnet build` | Compile le projet |
| `dotnet run` | Compile et exécute le projet |
| `dotnet test` | Lance les tests unitaires |
| `dotnet add package X` | Ajoute une dépendance NuGet |
| `dotnet --version` | Affiche la version du SDK installé |

**Analogie concrète** : La CLI `dotnet` est comme une télécommande universelle. Au lieu de chercher les boutons sur différents appareils (compilateur, gestionnaire de paquets, lanceur de tests), tu utilises une seule télécommande qui contrôle tout.

---

## Étapes Pratiques

### Étape 1 : Vérifier l'installation du SDK .NET

Ouvre un terminal et vérifie que le SDK .NET est installé :

```bash
# Afficher la version du SDK .NET installé
dotnet --version
```

**Résultat attendu** :

```text
10.0.xxx
```

Le numéro de version peut varier (`8.0.x`, `9.0.x` ou `10.0.x`). L'important est d'avoir une version **8.0 ou supérieure**. En 2026, la version LTS courante est **.NET 10** (support jusqu'en novembre 2028). .NET 8 reste LTS jusqu'en novembre 2026.

Si la commande n'est pas reconnue, installe le SDK depuis le site officiel : `https://dotnet.microsoft.com/download`.

Sur macOS avec Homebrew :

```bash
# Installer le SDK .NET via Homebrew (installe en général la dernière version stable)
brew install dotnet
```

Sur Linux (Ubuntu/Debian) :

```bash
# Ajouter le dépôt Microsoft, puis installer le SDK LTS courant
sudo apt update
# Préférer le LTS actuel (.NET 10). .NET 8 reste valide tant qu'il est supporté.
sudo apt install -y dotnet-sdk-10.0
# Alternative encore supportée jusqu'en nov. 2026 :
# sudo apt install -y dotnet-sdk-8.0
```

---

### Étape 2 : Créer un projet console

Crée un nouveau répertoire et initialise un projet console C# :

```bash
# Créer un dossier pour le projet
mkdir hello-csharp

# Se déplacer dans le dossier
cd hello-csharp

# Créer un projet console C#
dotnet new console
```

**Résultat attendu** :

```text
The template "Console App" was created successfully.

Processing post-creation actions...
Restoring /home/user/hello-csharp/hello-csharp.csproj:
  Determining projects to restore...
  Restored /home/user/hello-csharp/hello-csharp.csproj (in 65 ms).
Restore succeeded.
```

Cette commande crée plusieurs fichiers :

```text
hello-csharp/
├── Program.cs          # Le fichier source principal
├── hello-csharp.csproj # Le fichier de configuration du projet
└── obj/                # Fichiers temporaires de compilation
```

---

### Étape 3 : Examiner le code généré

Ouvre le fichier `Program.cs` dans ton éditeur. Le contenu par défaut est :

```csharp
// Affiche "Hello, World!" dans le terminal
Console.WriteLine("Hello, World!");
```

Ce code utilise les **instructions de niveau supérieur** (top-level statements), une fonctionnalité de C# 9+. Le compilateur génère automatiquement la classe et la méthode `Main` en arrière-plan.

La version complète équivalente (avant C# 9) ressemble à ceci :

```csharp
// Importer l'espace de noms System (contient Console)
using System;

// Déclarer un espace de noms pour organiser le code
namespace HelloCsharp
{
    // Déclarer une classe (obligatoire en C#)
    class Program
    {
        // Point d'entrée du programme
        static void Main(string[] args)
        {
            // Afficher du texte dans le terminal
            Console.WriteLine("Hello, World!");
        }
    }
}
```

Les deux versions produisent exactement le même résultat. La version courte est recommandée pour les programmes simples.

---

### Étape 4 : Exécuter le programme

Compile et exécute le projet avec une seule commande :

```bash
# Compiler et exécuter le projet
dotnet run
```

**Résultat attendu** :

```text
Hello, World!
```

---

### Étape 5 : Modifier le programme

Remplace le contenu de `Program.cs` par un programme plus complet :

```csharp
// Afficher un message de bienvenue
Console.WriteLine("Bienvenue dans mon premier programme C# !");

// Demander le prénom de l'utilisateur
Console.Write("Quel est ton prénom ? ");

// Lire la saisie de l'utilisateur
string? prenom = Console.ReadLine();

// Afficher un message personnalisé avec interpolation de chaîne
Console.WriteLine($"Bonjour {prenom}, bienvenue en C# !");

// Afficher la date et l'heure actuelles
Console.WriteLine($"Nous sommes le {DateTime.Now:dd/MM/yyyy} à {DateTime.Now:HH:mm}");
```

Exécute le programme modifié :

```bash
dotnet run
```

**Résultat attendu** :

```text
Bienvenue dans mon premier programme C# !
Quel est ton prénom ? Thomas
Bonjour Thomas, bienvenue en C# !
Nous sommes le 07/04/2026 à 14:30
```

---

### Étape 6 : Comprendre le fichier de projet (.csproj)

Ouvre le fichier `hello-csharp.csproj` :

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <!-- Framework cible : net10.0 avec le SDK .NET 10 (net8.0 / net9.0 selon ton SDK) -->
    <TargetFramework>net10.0</TargetFramework>
    <!-- Activer les vérifications de nullabilité -->
    <Nullable>enable</Nullable>
    <!-- Importer automatiquement les espaces de noms courants -->
    <ImplicitUsings>enable</ImplicitUsings>
  </PropertyGroup>

</Project>
```

Ce fichier XML configure le projet :

| Propriété | Rôle |
| --------- | ---- |
| `TargetFramework` | Version de .NET ciblée (`net8.0`, `net9.0` ou `net10.0` selon le SDK installé) |
| `Nullable` | Active les avertissements pour les valeurs null |
| `ImplicitUsings` | Importe automatiquement `System`, `System.Collections.Generic`, `System.Linq`, etc. |

`dotnet new console` génère le TFM correspondant à ton SDK (souvent `net10.0` en 2026). Les exemples de ce cursus fonctionnent de la même façon avec `net8.0` ou `net10.0`.

---

### Étape 7 : Compiler séparément

Tu peux séparer la compilation de l'exécution :

```bash
# Compiler le projet sans l'exécuter
dotnet build
```

**Résultat attendu** :

```text
MSBuild version 17.x for .NET
  Determining projects to restore...
  All projects are up-to-date for restore.
  hello-csharp -> /home/user/hello-csharp/bin/Debug/net10.0/hello-csharp.dll
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

Le fichier compilé se trouve dans `bin/Debug/net10.0/` (ou `net8.0` / `net9.0` selon ton `TargetFramework`). C'est un fichier `.dll` (Dynamic Link Library) exécutable par le runtime .NET.

```bash
# Exécuter le fichier compilé directement (adapte le dossier netX.0 à ton TFM)
dotnet bin/Debug/net10.0/hello-csharp.dll
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `dotnet new console` | Créer un nouveau projet console |
| `dotnet new console -n MonProjet` | Créer un projet avec un nom spécifique |
| `dotnet run` | Compiler et exécuter le projet |
| `dotnet build` | Compiler sans exécuter |
| `dotnet clean` | Supprimer les fichiers de compilation |
| `dotnet --info` | Afficher les informations détaillées du SDK |
| `dotnet new list` | Lister tous les modèles de projet disponibles |

---

## Pièges Fréquents

### Piège 1 : Exécuter `dotnet run` hors du dossier du projet

**Problème** : Tu obtiens l'erreur "Couldn't find a project to run" parce que tu n'es pas dans le dossier contenant le fichier `.csproj`.

**Solution** : Vérifie que tu es dans le bon répertoire avec `ls` ou `dir`. Le fichier `.csproj` doit être visible.

```bash
# Vérifier le contenu du répertoire courant
ls *.csproj
```

---

### Piège 2 : Confondre .NET Framework et .NET

**Problème** : Tu trouves des tutoriels qui utilisent `.NET Framework 4.x` avec Visual Studio. Ces instructions ne fonctionnent pas avec le SDK .NET moderne.

**Solution** : Vérifie que la documentation mentionne `.NET 8`, `.NET 9` ou `.NET 10` (pas `.NET Framework`). Dans ce cursus, nous utilisons toujours .NET 8+ (LTS recommandé en 2026 : .NET 10).

---

### Piège 3 : Oublier le point-virgule

**Problème** : C# exige un point-virgule (`;`) à la fin de chaque instruction. L'oublier provoque une erreur de compilation.

```csharp
// Erreur : point-virgule manquant
Console.WriteLine("Bonjour")
```

**Solution** : Ajouter le point-virgule à la fin de chaque instruction.

```csharp
// Correct : point-virgule présent
Console.WriteLine("Bonjour");
```

---

### Piège 4 : Casse des noms (case sensitivity)

**Problème** : C# est sensible à la casse. `console.writeline` provoque une erreur.

```csharp
// Erreur : mauvaise casse
console.writeline("Bonjour");
```

**Solution** : Respecter la convention PascalCase de C#.

```csharp
// Correct : PascalCase
Console.WriteLine("Bonjour");
```

---

## Checklist de Validation

- [ ] J'ai installé le SDK .NET 8+ (idéalement .NET 10 LTS) et la commande `dotnet --version` fonctionne
- [ ] J'ai créé un projet console avec `dotnet new console`
- [ ] J'ai exécuté mon programme avec `dotnet run`
- [ ] J'ai modifié `Program.cs` et le résultat a changé
- [ ] Je comprends la différence entre C# (le langage) et .NET (la plateforme)
- [ ] Je comprends le rôle du fichier `.csproj`

---

## Exercice Pratique

**Énoncé** : Crée un programme console C# qui :

1. Affiche "Calculateur d'âge"
2. Demande l'année de naissance de l'utilisateur
3. Calcule et affiche son âge approximatif
4. Affiche un message différent selon que l'utilisateur est mineur ou majeur

**Indications** :

- Utilise `Console.ReadLine()` pour lire la saisie
- Utilise `int.Parse()` pour convertir une chaîne en nombre
- Utilise `DateTime.Now.Year` pour obtenir l'année en cours
- Utilise une condition `if/else` pour le message

**Résultat attendu** :

```text
Calculateur d'âge
Quelle est ton année de naissance ? 2000
Tu as environ 26 ans.
Tu es majeur.
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```csharp
// Afficher le titre du programme
Console.WriteLine("Calculateur d'âge");

// Demander l'année de naissance
Console.Write("Quelle est ton année de naissance ? ");

// Lire la saisie et la convertir en nombre entier
string? saisie = Console.ReadLine();
int anneeNaissance = int.Parse(saisie!);

// Calculer l'âge approximatif
int age = DateTime.Now.Year - anneeNaissance;

// Afficher l'âge
Console.WriteLine($"Tu as environ {age} ans.");

// Afficher un message selon la majorité
if (age >= 18)
{
    Console.WriteLine("Tu es majeur.");
}
else
{
    Console.WriteLine("Tu es mineur.");
}
```

---

## Navigation

→ Fiche suivante : **[Variables et types](02-variables-types.md)**
