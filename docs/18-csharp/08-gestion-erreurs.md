---
tags:
  - C#
  - Intermédiaire
  - Concept
description: "Maîtriser la gestion des erreurs en C# : try/catch/finally, exceptions personnalisées, using et IDisposable."
estimated_time: "60 min"
fiche_number: 8
total_fiches: 10
cursus: "C#"
---

# 08 - Gestion des erreurs

> **En bref** : Apprendre à gérer les erreurs en C# avec try/catch/finally, créer des exceptions personnalisées et libérer les ressources avec using/IDisposable. Lecture estimée : 60 min.

## Prérequis

- Avoir terminé la fiche **[07 - Collections et LINQ](07-collections-linq.md)**
- Connaître les classes, l'héritage et les interfaces
- Connaître les concepts d'exceptions du [cursus Java](../fondamentaux/01-java/11-exceptions-java.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras intercepter et gérer les exceptions, créer tes propres types d'exception, utiliser les filtres d'exception et libérer proprement les ressources avec le pattern `using`/`IDisposable`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une exception ?

**Définition** : Une exception est un objet qui représente une erreur survenue pendant l'exécution d'un programme. Quand une erreur se produit, le programme "lance" (throw) une exception. Si personne ne l'"attrape" (catch), le programme s'arrête.

**Le problème que les exceptions résolvent** :

Sans exceptions, voici les problèmes rencontrés :

1. **Codes de retour ambigus** : Une fonction retourne `-1` pour signaler une erreur, mais `-1` pourrait aussi être un résultat valide.
2. **Erreurs ignorées** : Le code appelant peut ignorer le code de retour et continuer avec des données corrompues.
3. **Contexte perdu** : Un simple code numérique ne dit pas où l'erreur s'est produite ni pourquoi.

**Comment les exceptions résolvent ces problèmes** :

| Problème | Solution apportée par les exceptions |
| -------- | ------------------------------------ |
| Codes de retour ambigus | Les exceptions sont des objets typés (pas des nombres) |
| Erreurs ignorées | Une exception non attrapée arrête le programme - impossible de l'ignorer |
| Contexte perdu | L'exception contient le message, la pile d'appels et la cause originale |

**Analogie concrète** : Les exceptions fonctionnent comme un système d'alarme incendie. Quand un détecteur (throw) détecte de la fumée (erreur), il déclenche l'alarme. Les pompiers (catch) interviennent pour gérer la situation. Si personne n'intervient, l'immeuble (programme) est évacué (arrêté).

**Ce que les exceptions ne sont PAS** :

- Les exceptions ne sont pas un mécanisme de contrôle de flux. On ne lance pas une exception pour dire "fin de liste" - on utilise un `if` ou une boucle.
- Les exceptions ne sont pas gratuites en performance. Lancer et attraper des exceptions est coûteux. Elles sont réservées aux situations exceptionnelles (d'où leur nom).

**Comparaison C# vs Java** :

| C# | Java |
| -- | ---- |
| Pas de checked exceptions | Checked exceptions obligatoires |
| Filtres d'exception (`when`) | Pas d'équivalent |
| `using` pour IDisposable | `try-with-resources` |
| Toutes les exceptions héritent de `Exception` | `Exception` et `Error` séparés |

---

### Qu'est-ce que IDisposable ?

**Définition** : `IDisposable` est une interface qui définit une méthode `Dispose()` pour libérer les ressources non gérées (fichiers ouverts, connexions réseau, handles système). Le mot-clé `using` appelle automatiquement `Dispose()` à la fin du bloc.

**Le problème que IDisposable résout** :

Sans IDisposable, voici les problèmes rencontrés :

1. **Fuites de ressources** : Un fichier ouvert n'est jamais fermé si une exception se produit avant l'appel à `Close()`.
2. **Oubli de nettoyage** : Le développeur oublie d'appeler `Close()` ou `Dispose()`, les ressources restent bloquées.

**Comment IDisposable résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Fuites de ressources | `using` garantit que `Dispose()` est appelé, même en cas d'exception |
| Oubli de nettoyage | La syntaxe `using` rend le nettoyage automatique et obligatoire |

**Analogie concrète** : `using` fonctionne comme une consigne automatique. Tu empruntes un casier (ressource), tu l'utilises, et quand tu quittes la zone (fin du bloc using), le casier est automatiquement libéré, même si tu pars précipitamment.

---

## Étapes Pratiques

### Étape 1 : try/catch de base

```bash
dotnet new console -n erreurs-demo
cd erreurs-demo
```

```csharp
// --- Attraper une exception ---
try
{
    Console.Write("Entre un nombre : ");
    int nombre = int.Parse(Console.ReadLine()!);
    int resultat = 100 / nombre;
    Console.WriteLine($"100 / {nombre} = {resultat}");
}
catch (FormatException)
{
    // L'utilisateur a saisi du texte au lieu d'un nombre
    Console.WriteLine("Erreur : ce n'est pas un nombre valide.");
}
catch (DivideByZeroException)
{
    // L'utilisateur a saisi 0
    Console.WriteLine("Erreur : division par zéro impossible.");
}
catch (Exception ex)
{
    // Attrape toutes les autres exceptions
    Console.WriteLine($"Erreur inattendue : {ex.Message}");
}

Console.WriteLine("Le programme continue normalement.");
```

**Résultat attendu** (saisie "abc") :

```text
Entre un nombre : abc
Erreur : ce n'est pas un nombre valide.
Le programme continue normalement.
```

**Résultat attendu** (saisie "0") :

```text
Entre un nombre : 0
Erreur : division par zéro impossible.
Le programme continue normalement.
```

---

### Étape 2 : try/catch/finally

```csharp
// finally s'exécute toujours, qu'il y ait une exception ou non
Console.WriteLine("--- Démonstration de finally ---");

try
{
    Console.WriteLine("1. Début du try");
    int[] tableau = { 1, 2, 3 };
    Console.WriteLine($"2. Élément : {tableau[5]}");  // IndexOutOfRangeException
    Console.WriteLine("3. Cette ligne n'est pas atteinte");
}
catch (IndexOutOfRangeException ex)
{
    Console.WriteLine($"4. Exception attrapée : {ex.Message}");
}
finally
{
    // Ce bloc s'exécute TOUJOURS (avec ou sans exception)
    Console.WriteLine("5. Finally : nettoyage effectué");
}

Console.WriteLine("6. Suite du programme");

// --- Cas sans exception ---
Console.WriteLine("\n--- Cas sans exception ---");
try
{
    Console.WriteLine("Tout va bien.");
}
catch (Exception)
{
    Console.WriteLine("Cette ligne n'est pas atteinte.");
}
finally
{
    Console.WriteLine("Finally s'exécute quand même.");
}
```

**Résultat attendu** :

```text
--- Démonstration de finally ---
1. Début du try
4. Exception attrapée : Index was outside the bounds of the array.
5. Finally : nettoyage effectué
6. Suite du programme

--- Cas sans exception ---
Tout va bien.
Finally s'exécute quand même.
```

---

### Étape 3 : Lancer des exceptions (throw)

```csharp
// Méthode qui valide les données et lance une exception si invalides
static void CreerUtilisateur(string nom, int age, string email)
{
    // Validation des paramètres
    if (string.IsNullOrWhiteSpace(nom))
        throw new ArgumentException("Le nom ne peut pas être vide.", nameof(nom));

    if (age < 0 || age > 150)
        throw new ArgumentOutOfRangeException(nameof(age), age, "L'âge doit être entre 0 et 150.");

    if (!email.Contains('@'))
        throw new ArgumentException("L'email doit contenir un @.", nameof(email));

    Console.WriteLine($"Utilisateur créé : {nom}, {age} ans, {email}");
}

// Appels avec gestion d'erreur
string[] tests = { "Alice,25,alice@test.com", ",25,test@test.com", "Bob,-5,bob@test.com", "Charlie,30,charlie" };

foreach (string test in tests)
{
    string[] parts = test.Split(',');
    try
    {
        CreerUtilisateur(parts[0], int.Parse(parts[1]), parts[2]);
    }
    catch (ArgumentException ex)
    {
        Console.WriteLine($"Erreur : {ex.Message}");
    }
}
```

**Résultat attendu** :

```text
Utilisateur créé : Alice, 25 ans, alice@test.com
Erreur : Le nom ne peut pas être vide. (Parameter 'nom')
Erreur : L'âge doit être entre 0 et 150. (Parameter 'age')
Actual value was -5.
Erreur : L'email doit contenir un @. (Parameter 'email')
```

---

### Étape 4 : Exceptions personnalisées

```csharp
// Définir une exception personnalisée
class SoldeInsuffisantException : Exception
{
    public decimal SoldeActuel { get; }
    public decimal MontantDemande { get; }

    public SoldeInsuffisantException(decimal solde, decimal montant)
        : base($"Solde insuffisant : {solde:C} disponible, {montant:C} demandé.")
    {
        SoldeActuel = solde;
        MontantDemande = montant;
    }
}

class MontantInvalideException : Exception
{
    public MontantInvalideException(decimal montant)
        : base($"Le montant {montant:C} est invalide (doit être positif).")
    {
    }
}

// Classe qui utilise les exceptions personnalisées
class Compte
{
    public string Proprietaire { get; }
    public decimal Solde { get; private set; }

    public Compte(string proprietaire, decimal soldeInitial)
    {
        Proprietaire = proprietaire;
        Solde = soldeInitial;
    }

    public void Retirer(decimal montant)
    {
        if (montant <= 0)
            throw new MontantInvalideException(montant);

        if (montant > Solde)
            throw new SoldeInsuffisantException(Solde, montant);

        Solde -= montant;
        Console.WriteLine($"Retrait de {montant:C}. Solde : {Solde:C}");
    }
}

// Utilisation
Compte compte = new("Alice", 500m);

decimal[] retraits = { 200m, 400m, -50m, 100m };

foreach (decimal montant in retraits)
{
    try
    {
        compte.Retirer(montant);
    }
    catch (SoldeInsuffisantException ex)
    {
        Console.WriteLine($"Refusé : {ex.Message}");
        Console.WriteLine($"  Il manque {ex.MontantDemande - ex.SoldeActuel:C}");
    }
    catch (MontantInvalideException ex)
    {
        Console.WriteLine($"Erreur : {ex.Message}");
    }
}
```

**Résultat attendu** :

```text
Retrait de 200,00 €. Solde : 300,00 €
Refusé : Solde insuffisant : 300,00 € disponible, 400,00 € demandé.
  Il manque 100,00 €
Erreur : Le montant -50,00 € est invalide (doit être positif).
Retrait de 100,00 €. Solde : 200,00 €
```

---

### Étape 5 : Filtres d'exception (when)

```csharp
// Les filtres when permettent d'attraper une exception selon une condition
static void TraiterRequete(int codeErreur)
{
    throw new HttpRequestException($"Erreur HTTP {codeErreur}", null, (System.Net.HttpStatusCode)codeErreur);
}

int[] codes = { 404, 500, 401, 200 };

foreach (int code in codes)
{
    try
    {
        if (code == 200)
        {
            Console.WriteLine($"Code {code} : Succès");
            continue;
        }
        TraiterRequete(code);
    }
    catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
    {
        Console.WriteLine($"Code {code} : Page non trouvée");
    }
    catch (HttpRequestException ex) when (ex.StatusCode == System.Net.HttpStatusCode.Unauthorized)
    {
        Console.WriteLine($"Code {code} : Accès non autorisé");
    }
    catch (HttpRequestException ex) when ((int?)ex.StatusCode >= 500)
    {
        Console.WriteLine($"Code {code} : Erreur serveur - {ex.Message}");
    }
    catch (HttpRequestException ex)
    {
        Console.WriteLine($"Code {code} : Erreur non classifiée - {ex.Message}");
    }
}
```

**Résultat attendu** :

```text
Code 404 : Page non trouvée
Code 500 : Erreur serveur - Erreur HTTP 500
Code 401 : Accès non autorisé
Code 200 : Succès
```

---

### Étape 6 : using et IDisposable

```csharp
// Classe qui implémente IDisposable
class Connexion : IDisposable
{
    public string Serveur { get; }
    private bool _disposed = false;

    public Connexion(string serveur)
    {
        Serveur = serveur;
        Console.WriteLine($"  Connexion ouverte vers {Serveur}");
    }

    public void EnvoyerRequete(string requete)
    {
        if (_disposed)
            throw new ObjectDisposedException(nameof(Connexion));

        Console.WriteLine($"  Requête envoyée : {requete}");
    }

    // Méthode Dispose appelée automatiquement par using
    public void Dispose()
    {
        if (!_disposed)
        {
            Console.WriteLine($"  Connexion fermée vers {Serveur}");
            _disposed = true;
        }
    }
}

// --- Syntaxe using classique (bloc) ---
Console.WriteLine("--- Using avec bloc ---");
using (Connexion conn = new("serveur-a"))
{
    conn.EnvoyerRequete("SELECT * FROM users");
    conn.EnvoyerRequete("SELECT * FROM produits");
}  // Dispose() est appelé automatiquement ici
Console.WriteLine("  Après le bloc using\n");

// --- Syntaxe using déclaration (C# 8+) ---
Console.WriteLine("--- Using déclaration ---");
{
    using Connexion conn2 = new("serveur-b");
    conn2.EnvoyerRequete("INSERT INTO logs");
    // Dispose() sera appelé à la fin du scope englobant
}
Console.WriteLine("  Après le scope\n");

// --- using avec exception ---
Console.WriteLine("--- Using avec exception ---");
try
{
    using Connexion conn3 = new("serveur-c");
    conn3.EnvoyerRequete("DELETE FROM temp");
    throw new InvalidOperationException("Erreur simulée !");
    // Dispose() est quand même appelé avant que l'exception ne se propage
}
catch (InvalidOperationException ex)
{
    Console.WriteLine($"  Exception : {ex.Message}");
}
```

**Résultat attendu** :

```text
--- Using avec bloc ---
  Connexion ouverte vers serveur-a
  Requête envoyée : SELECT * FROM users
  Requête envoyée : SELECT * FROM produits
  Connexion fermée vers serveur-a
  Après le bloc using

--- Using déclaration ---
  Connexion ouverte vers serveur-b
  Requête envoyée : INSERT INTO logs
  Connexion fermée vers serveur-b
  Après le scope

--- Using avec exception ---
  Connexion ouverte vers serveur-c
  Requête envoyée : DELETE FROM temp
  Connexion fermée vers serveur-c
  Exception : Erreur simulée !
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `dotnet run` | Compiler et exécuter le projet |
| `dotnet build` | Compiler sans exécuter |

---

## Pièges Fréquents

### Piège 1 : Attraper Exception trop large

**Problème** : Attraper `Exception` sans filtre masque toutes les erreurs, y compris celles qu'on ne sait pas gérer.

```csharp
// Mauvais : on ne sait pas quelle erreur s'est produite
try { /* ... */ }
catch (Exception) { Console.WriteLine("Une erreur est survenue."); }
```

**Solution** : Attraper les exceptions spécifiques d'abord, puis `Exception` en dernier recours avec un log du message.

```csharp
try { /* ... */ }
catch (FormatException ex) { Console.WriteLine($"Format invalide : {ex.Message}"); }
catch (Exception ex) { Console.WriteLine($"Erreur inattendue : {ex.Message}"); }
```

---

### Piège 2 : Avaler les exceptions (catch vide)

**Problème** : Un catch vide supprime l'erreur silencieusement. Le programme continue avec des données potentiellement corrompues.

```csharp
// Très dangereux : l'erreur est ignorée
try { /* ... */ }
catch (Exception) { }
```

**Solution** : Toujours au minimum journaliser l'erreur.

```csharp
try { /* ... */ }
catch (Exception ex)
{
    Console.Error.WriteLine($"Erreur ignorée : {ex.Message}");
}
```

---

### Piège 3 : Oublier de relancer l'exception originale

**Problème** : Utiliser `throw ex;` au lieu de `throw;` réinitialise la pile d'appels, rendant le débogage difficile.

```csharp
// Mauvais : throw ex réinitialise la pile d'appels
try { /* ... */ }
catch (Exception ex)
{
    Console.WriteLine(ex.Message);
    throw ex;  // La pile d'appels originale est perdue
}

// Correct : throw seul préserve la pile d'appels
try { /* ... */ }
catch (Exception ex)
{
    Console.WriteLine(ex.Message);
    throw;  // Relance avec la pile d'appels complète
}
```

---

### Piège 4 : Ne pas libérer les ressources

**Problème** : Sans `using`, les fichiers, connexions et autres ressources ne sont pas libérés en cas d'exception.

```csharp
// Risque de fuite si une exception se produit entre Open et Close
StreamReader reader = new("fichier.txt");
string contenu = reader.ReadToEnd();
reader.Close();  // Pas atteint si ReadToEnd lance une exception
```

**Solution** : Toujours utiliser `using`.

```csharp
using StreamReader reader = new("fichier.txt");
string contenu = reader.ReadToEnd();
// Dispose/Close appelé automatiquement
```

---

## Checklist de Validation

- [ ] Je sais utiliser `try/catch` pour attraper des exceptions spécifiques
- [ ] Je comprends le rôle de `finally` (exécution garantie)
- [ ] Je sais lancer des exceptions avec `throw`
- [ ] Je sais créer des exceptions personnalisées qui héritent de `Exception`
- [ ] Je sais utiliser les filtres `when` dans un catch
- [ ] Je comprends `IDisposable` et le pattern `using`
- [ ] Je sais différencier `throw;` (relance) et `throw ex;` (réinitialisation)

---

## Exercice Pratique

**Énoncé** : Crée un système de validation de formulaire avec des exceptions personnalisées :

1. Crée une classe abstraite `ValidationException` qui hérite de `Exception`
2. Crée trois exceptions : `ChampVideException`, `EmailInvalideException`, `AgeInvalideException`
3. Crée une méthode `ValiderFormulaire(string nom, string email, int age)` qui lance les exceptions appropriées
4. Teste avec plusieurs jeux de données et affiche les messages d'erreur

**Indications** :

- Chaque exception personnalisée doit contenir le nom du champ concerné
- Valide que l'email contient "@" et un point après le "@"
- L'âge doit être entre 13 et 120 ans

**Résultat attendu** :

```text
Test 1 : Formulaire valide pour Alice (alice@test.com, 25 ans)
Test 2 : Erreur - Le champ 'nom' ne peut pas être vide.
Test 3 : Erreur - L'email 'invalide' n'est pas valide (doit contenir @ et un domaine).
Test 4 : Erreur - L'âge 10 est invalide (doit être entre 13 et 120).
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```csharp
// Classe de base pour les erreurs de validation
abstract class ValidationException : Exception
{
    public string NomChamp { get; }

    protected ValidationException(string nomChamp, string message)
        : base(message)
    {
        NomChamp = nomChamp;
    }
}

// Exception : champ vide
class ChampVideException : ValidationException
{
    public ChampVideException(string nomChamp)
        : base(nomChamp, $"Le champ '{nomChamp}' ne peut pas être vide.")
    {
    }
}

// Exception : email invalide
class EmailInvalideException : ValidationException
{
    public string Email { get; }

    public EmailInvalideException(string email)
        : base("email", $"L'email '{email}' n'est pas valide (doit contenir @ et un domaine).")
    {
        Email = email;
    }
}

// Exception : âge invalide
class AgeInvalideException : ValidationException
{
    public int Age { get; }

    public AgeInvalideException(int age)
        : base("age", $"L'âge {age} est invalide (doit être entre 13 et 120).")
    {
        Age = age;
    }
}

// Méthode de validation
static void ValiderFormulaire(string nom, string email, int age)
{
    if (string.IsNullOrWhiteSpace(nom))
        throw new ChampVideException("nom");

    if (!email.Contains('@') || !email.Substring(email.IndexOf('@')).Contains('.'))
        throw new EmailInvalideException(email);

    if (age < 13 || age > 120)
        throw new AgeInvalideException(age);

    Console.WriteLine($"Formulaire valide pour {nom} ({email}, {age} ans)");
}

// Tests
var tests = new (string nom, string email, int age)[]
{
    ("Alice", "alice@test.com", 25),
    ("", "test@test.com", 30),
    ("Bob", "invalide", 25),
    ("Charlie", "charlie@test.com", 10),
};

for (int i = 0; i < tests.Length; i++)
{
    try
    {
        Console.Write($"Test {i + 1} : ");
        ValiderFormulaire(tests[i].nom, tests[i].email, tests[i].age);
    }
    catch (ValidationException ex)
    {
        Console.WriteLine($"Erreur - {ex.Message}");
    }
}
```

---

## Navigation

← Fiche précédente : **[Collections et LINQ](07-collections-linq.md)**

→ Fiche suivante : **[Fichiers et sérialisation](09-fichiers-serialisation.md)**
