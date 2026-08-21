---
tags:
  - C#
  - Intermédiaire
  - Projet
description: "Projet intégrateur C# : créer une application console complète combinant POO, collections, LINQ, fichiers JSON et gestion des erreurs."
estimated_time: "120 min"
fiche_number: 10
total_fiches: 10
cursus: "C#"
id: "web.csharp.projet-integrateur"
course_id: "web.csharp"
content_type: "project"
order: 10
---

# 10 - Projet intégrateur

> **En bref** : Construire une application console C# complète qui combine tous les concepts appris dans le cursus : POO, collections, LINQ, fichiers JSON et gestion des erreurs. Lecture estimée : 120 min.

**Projet facultatif** : Ce projet est autonome. Tu peux le réaliser, l’adapter ou le passer sans bloquer l’accès aux autres fiches.

## Prérequis

- Avoir terminé toutes les fiches précédentes du cursus C# :
  - **[01 - Introduction à C#](01-introduction-csharp.md)** : CLI dotnet, Hello World
  - **[02 - Variables et types](02-variables-types.md)** : types, constantes, nullable
  - **[03 - Conditions et boucles](03-conditions-boucles.md)** : if/else, switch, for, foreach
  - **[04 - Fonctions et méthodes](04-fonctions-methodes.md)** : paramètres, ref/out, tuples
  - **[05 - Classes et objets](05-classes-objets.md)** : propriétés, constructeurs, records
  - **[06 - Héritage et interfaces](06-heritage-interfaces.md)** : héritage, interfaces, polymorphisme
  - **[07 - Collections et LINQ](07-collections-linq.md)** : List, Dictionary, LINQ
  - **[08 - Gestion des erreurs](08-gestion-erreurs.md)** : try/catch, exceptions personnalisées, using
  - **[09 - Fichiers et sérialisation](09-fichiers-serialisation.md)** : fichiers, JSON, async

## Objectif de cette fiche

À la fin de cette fiche, tu auras créé une application console complète de gestion de bibliothèque qui utilise la POO, les collections, LINQ, la persistance JSON et la gestion des erreurs. Ce projet sert de révision de l'ensemble du cursus C#.

---

## Description du Projet

Tu vas créer **BiblioConsole**, une application de gestion de bibliothèque en ligne de commande qui permet de :

- Gérer un catalogue de livres (ajouter, modifier, supprimer)
- Gérer les membres de la bibliothèque
- Gérer les emprunts et retours de livres
- Rechercher et filtrer les livres avec LINQ
- Sauvegarder toutes les données en JSON
- Afficher des statistiques sur la bibliothèque

### Architecture du projet

```text
BiblioConsole/
├── Program.cs           # Point d'entrée et menu principal
├── Models/              # Classes de données
│   ├── Livre.cs
│   ├── Membre.cs
│   └── Emprunt.cs
├── Services/            # Logique métier
│   ├── BibliothequeService.cs
│   └── StockageService.cs
├── Exceptions/          # Exceptions personnalisées
│   └── BiblioException.cs
└── données.json         # Fichier de persistance (généré)
```

---

## Étapes Pratiques

### Étape 1 : Créer le projet et la structure

```bash
# Créer le projet
dotnet new console -n BiblioConsole
cd BiblioConsole

# Créer les dossiers
mkdir Models Services Exceptions
```

---

### Étape 2 : Définir les modèles de données (Models/)

Crée le fichier `Models/Livre.cs` :

```csharp
namespace BiblioConsole.Models;

// Record pour les livres : immuable, comparaison par valeur
public record Livre
{
    public string Isbn { get; init; } = "";
    public string Titre { get; init; } = "";
    public string Auteur { get; init; } = "";
    public int Annee { get; init; }
    public string Genre { get; init; } = "";
    public bool Disponible { get; set; } = true;

    // Méthode d'affichage formaté
    public string Resumer()
    {
        string statut = Disponible ? "Disponible" : "Emprunté";
        return $"[{Isbn}] {Titre} - {Auteur} ({Annee}) [{Genre}] ({statut})";
    }
}
```

Crée le fichier `Models/Membre.cs` :

```csharp
namespace BiblioConsole.Models;

// Record pour les membres
public record Membre
{
    public int Id { get; init; }
    public string Nom { get; init; } = "";
    public string Email { get; init; } = "";
    public DateTime DateInscription { get; init; } = DateTime.Now;

    public string Resumer()
    {
        return $"[{Id}] {Nom} ({Email}) - Inscrit le {DateInscription:dd/MM/yyyy}";
    }
}
```

Crée le fichier `Models/Emprunt.cs` :

```csharp
namespace BiblioConsole.Models;

// Record pour les emprunts
public record Emprunt
{
    public int Id { get; init; }
    public string Isbn { get; init; } = "";       // Référence au livre
    public int MembreId { get; init; }             // Référence au membre
    public DateTime DateEmprunt { get; init; } = DateTime.Now;
    public DateTime DateRetourPrevue { get; init; }
    public DateTime? DateRetourEffective { get; set; }  // null = pas encore retourné
    public bool EstRetourne => DateRetourEffective.HasValue;
    public bool EstEnRetard => !EstRetourne && DateTime.Now > DateRetourPrevue;
}
```

---

### Étape 3 : Créer les exceptions personnalisées (Exceptions/)

Crée le fichier `Exceptions/BiblioException.cs` :

```csharp
namespace BiblioConsole.Exceptions;

// Exception de base pour la bibliothèque
public class BiblioException : Exception
{
    public BiblioException(string message) : base(message) { }
}

// Livre non trouvé
public class LivreNonTrouveException : BiblioException
{
    public string Isbn { get; }

    public LivreNonTrouveException(string isbn)
        : base($"Aucun livre trouvé avec l'ISBN '{isbn}'.")
    {
        Isbn = isbn;
    }
}

// Livre déjà emprunté
public class LivreIndisponibleException : BiblioException
{
    public string Titre { get; }

    public LivreIndisponibleException(string titre)
        : base($"Le livre '{titre}' est déjà emprunté.")
    {
        Titre = titre;
    }
}

// Membre non trouvé
public class MembreNonTrouveException : BiblioException
{
    public int MembreId { get; }

    public MembreNonTrouveException(int id)
        : base($"Aucun membre trouvé avec l'ID {id}.")
    {
        MembreId = id;
    }
}

// Doublon ISBN
public class DoublonIsbnException : BiblioException
{
    public DoublonIsbnException(string isbn)
        : base($"Un livre avec l'ISBN '{isbn}' existe déjà.")
    {
    }
}

// Limite d'emprunts atteinte
public class LimiteEmpruntsException : BiblioException
{
    public LimiteEmpruntsException(string nomMembre, int limite)
        : base($"Le membre '{nomMembre}' a atteint la limite de {limite} emprunts simultanés.")
    {
    }
}
```

---

### Étape 4 : Créer le service de stockage JSON (Services/)

Crée le fichier `Services/StockageService.cs` :

```csharp
using System.Text.Json;
using BiblioConsole.Models;

namespace BiblioConsole.Services;

// Classe conteneur pour sérialiser toutes les données en un seul fichier
public class DonneesBibliotheque
{
    public List<Livre> Livres { get; set; } = new();
    public List<Membre> Membres { get; set; } = new();
    public List<Emprunt> Emprunts { get; set; } = new();
    public int ProchainMembreId { get; set; } = 1;
    public int ProchainEmpruntId { get; set; } = 1;
}

public class StockageService
{
    private readonly string _fichier;
    private readonly JsonSerializerOptions _options;

    public StockageService(string fichier = "données.json")
    {
        _fichier = fichier;
        _options = new JsonSerializerOptions
        {
            WriteIndented = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
    }

    // Charger les données depuis le fichier JSON
    public DonneesBibliotheque Charger()
    {
        if (!File.Exists(_fichier))
        {
            Console.WriteLine("Aucun fichier de données trouvé. Création d'une base vide.");
            return new DonneesBibliotheque();
        }

        try
        {
            string json = File.ReadAllText(_fichier);
            return JsonSerializer.Deserialize<DonneesBibliotheque>(json, _options)
                   ?? new DonneesBibliotheque();
        }
        catch (JsonException ex)
        {
            Console.WriteLine($"Erreur de lecture du fichier JSON : {ex.Message}");
            Console.WriteLine("Création d'une base vide.");
            return new DonneesBibliotheque();
        }
    }

    // Sauvegarder les données dans le fichier JSON
    public void Sauvegarder(DonneesBibliotheque données)
    {
        try
        {
            string json = JsonSerializer.Serialize(données, _options);
            File.WriteAllText(_fichier, json);
        }
        catch (IOException ex)
        {
            Console.WriteLine($"Erreur de sauvegarde : {ex.Message}");
        }
    }
}
```

---

### Étape 5 : Créer le service principal (Services/)

Crée le fichier `Services/BibliothequeService.cs` :

```csharp
using BiblioConsole.Models;
using BiblioConsole.Exceptions;

namespace BiblioConsole.Services;

public class BibliothequeService
{
    private readonly DonneesBibliotheque _données;
    private readonly StockageService _stockage;
    private const int MaxEmpruntsParMembre = 3;
    private const int DureeEmpruntJours = 21;

    public BibliothequeService(StockageService stockage)
    {
        _stockage = stockage;
        _données = stockage.Charger();
    }

    // Sauvegarder après chaque modification
    private void Sauvegarder() => _stockage.Sauvegarder(_données);

    // =====================
    // GESTION DES LIVRES
    // =====================

    public void AjouterLivre(string isbn, string titre, string auteur, int annee, string genre)
    {
        // Vérifier les doublons
        if (_données.Livres.Any(l => l.Isbn == isbn))
            throw new DoublonIsbnException(isbn);

        Livre livre = new()
        {
            Isbn = isbn,
            Titre = titre,
            Auteur = auteur,
            Annee = annee,
            Genre = genre
        };

        _données.Livres.Add(livre);
        Sauvegarder();
    }

    public void SupprimerLivre(string isbn)
    {
        Livre livre = TrouverLivre(isbn);

        if (!livre.Disponible)
            throw new BiblioException($"Impossible de supprimer '{livre.Titre}' : il est emprunté.");

        _données.Livres.Remove(livre);
        Sauvegarder();
    }

    public Livre TrouverLivre(string isbn)
    {
        return _données.Livres.FirstOrDefault(l => l.Isbn == isbn)
               ?? throw new LivreNonTrouveException(isbn);
    }

    public List<Livre> ListerLivres() => _données.Livres;

    public List<Livre> RechercherLivres(string terme)
    {
        return _données.Livres
            .Where(l => l.Titre.Contains(terme, StringComparison.OrdinalIgnoreCase)
                     || l.Auteur.Contains(terme, StringComparison.OrdinalIgnoreCase)
                     || l.Genre.Contains(terme, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    public List<Livre> FiltrerParGenre(string genre)
    {
        return _données.Livres
            .Where(l => l.Genre.Equals(genre, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    // =====================
    // GESTION DES MEMBRES
    // =====================

    public Membre AjouterMembre(string nom, string email)
    {
        Membre membre = new()
        {
            Id = _données.ProchainMembreId++,
            Nom = nom,
            Email = email,
            DateInscription = DateTime.Now
        };

        _données.Membres.Add(membre);
        Sauvegarder();
        return membre;
    }

    public Membre TrouverMembre(int id)
    {
        return _données.Membres.FirstOrDefault(m => m.Id == id)
               ?? throw new MembreNonTrouveException(id);
    }

    public List<Membre> ListerMembres() => _données.Membres;

    // =====================
    // GESTION DES EMPRUNTS
    // =====================

    public Emprunt Emprunter(int membreId, string isbn)
    {
        Membre membre = TrouverMembre(membreId);
        Livre livre = TrouverLivre(isbn);

        // Vérifier la disponibilité
        if (!livre.Disponible)
            throw new LivreIndisponibleException(livre.Titre);

        // Vérifier la limite d'emprunts
        int empruntsActifs = _données.Emprunts
            .Count(e => e.MembreId == membreId && !e.EstRetourne);

        if (empruntsActifs >= MaxEmpruntsParMembre)
            throw new LimiteEmpruntsException(membre.Nom, MaxEmpruntsParMembre);

        // Créer l'emprunt
        Emprunt emprunt = new()
        {
            Id = _données.ProchainEmpruntId++,
            Isbn = isbn,
            MembreId = membreId,
            DateEmprunt = DateTime.Now,
            DateRetourPrevue = DateTime.Now.AddDays(DureeEmpruntJours)
        };

        // Marquer le livre comme emprunté
        livre.Disponible = false;

        _données.Emprunts.Add(emprunt);
        Sauvegarder();
        return emprunt;
    }

    public void Retourner(string isbn)
    {
        Livre livre = TrouverLivre(isbn);

        // Trouver l'emprunt actif pour ce livre
        Emprunt? emprunt = _données.Emprunts
            .FirstOrDefault(e => e.Isbn == isbn && !e.EstRetourne);

        if (emprunt == null)
            throw new BiblioException($"Aucun emprunt actif pour le livre '{livre.Titre}'.");

        // Enregistrer le retour
        emprunt.DateRetourEffective = DateTime.Now;
        livre.Disponible = true;

        Sauvegarder();
    }

    public List<Emprunt> ListerEmpruntsActifs()
    {
        return _données.Emprunts
            .Where(e => !e.EstRetourne)
            .OrderBy(e => e.DateRetourPrevue)
            .ToList();
    }

    public List<Emprunt> ListerEmpruntsEnRetard()
    {
        return _données.Emprunts
            .Where(e => e.EstEnRetard)
            .OrderBy(e => e.DateRetourPrevue)
            .ToList();
    }

    // =====================
    // STATISTIQUES
    // =====================

    public void AfficherStatistiques()
    {
        int totalLivres = _données.Livres.Count;
        int disponibles = _données.Livres.Count(l => l.Disponible);
        int empruntes = totalLivres - disponibles;
        int totalMembres = _données.Membres.Count;
        int empruntsActifs = _données.Emprunts.Count(e => !e.EstRetourne);
        int empruntsRetard = _données.Emprunts.Count(e => e.EstEnRetard);
        int totalEmprunts = _données.Emprunts.Count;

        Console.WriteLine("\n========== STATISTIQUES ==========");
        Console.WriteLine($"  Livres : {totalLivres} total ({disponibles} disponibles, {empruntes} empruntés)");
        Console.WriteLine($"  Membres : {totalMembres}");
        Console.WriteLine($"  Emprunts : {empruntsActifs} actifs ({empruntsRetard} en retard), {totalEmprunts} total");

        // Top genres
        if (_données.Livres.Count > 0)
        {
            Console.WriteLine("\n  Répartition par genre :");
            var parGenre = _données.Livres
                .GroupBy(l => l.Genre)
                .OrderByDescending(g => g.Count());

            foreach (var genre in parGenre)
            {
                Console.WriteLine($"    {genre.Key} : {genre.Count()} livres");
            }
        }

        // Membres les plus actifs
        if (_données.Emprunts.Count > 0)
        {
            Console.WriteLine("\n  Membres les plus actifs :");
            var topMembres = _données.Emprunts
                .GroupBy(e => e.MembreId)
                .OrderByDescending(g => g.Count())
                .Take(3);

            foreach (var groupe in topMembres)
            {
                Membre? membre = _données.Membres.FirstOrDefault(m => m.Id == groupe.Key);
                Console.WriteLine($"    {membre?.Nom ?? "Inconnu"} : {groupe.Count()} emprunts");
            }
        }

        Console.WriteLine("==================================");
    }
}
```

---

### Étape 6 : Créer le programme principal (Program.cs)

Crée le fichier `Program.cs` :

```csharp
using BiblioConsole.Services;
using BiblioConsole.Exceptions;

// Initialiser les services
StockageService stockage = new();
BibliothequeService biblio = new(stockage);

Console.WriteLine("=== BiblioConsole - Gestion de bibliothèque ===\n");

bool continuer = true;

while (continuer)
{
    AfficherMenu();
    string? choix = Console.ReadLine();

    try
    {
        switch (choix)
        {
            case "1": AjouterLivre(); break;
            case "2": ListerLivres(); break;
            case "3": RechercherLivres(); break;
            case "4": AjouterMembre(); break;
            case "5": ListerMembres(); break;
            case "6": Emprunter(); break;
            case "7": Retourner(); break;
            case "8": VoirEmprunts(); break;
            case "9": biblio.AfficherStatistiques(); break;
            case "0":
                continuer = false;
                Console.WriteLine("\nAu revoir !");
                break;
            default:
                Console.WriteLine("Choix invalide.");
                break;
        }
    }
    catch (BiblioException ex)
    {
        Console.WriteLine($"\nErreur : {ex.Message}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"\nErreur inattendue : {ex.Message}");
    }
}

// === Fonctions d'interface ===

void AfficherMenu()
{
    Console.WriteLine("\n--- Menu ---");
    Console.WriteLine("1. Ajouter un livre       6. Emprunter un livre");
    Console.WriteLine("2. Lister les livres      7. Retourner un livre");
    Console.WriteLine("3. Rechercher un livre    8. Voir les emprunts");
    Console.WriteLine("4. Ajouter un membre      9. Statistiques");
    Console.WriteLine("5. Lister les membres     0. Quitter");
    Console.Write("Choix : ");
}

void AjouterLivre()
{
    Console.Write("ISBN : ");
    string isbn = Console.ReadLine() ?? "";
    Console.Write("Titre : ");
    string titre = Console.ReadLine() ?? "";
    Console.Write("Auteur : ");
    string auteur = Console.ReadLine() ?? "";
    Console.Write("Année : ");

    if (!int.TryParse(Console.ReadLine(), out int annee))
    {
        Console.WriteLine("Année invalide.");
        return;
    }

    Console.Write("Genre : ");
    string genre = Console.ReadLine() ?? "";

    biblio.AjouterLivre(isbn, titre, auteur, annee, genre);
    Console.WriteLine($"Livre '{titre}' ajouté avec succès.");
}

void ListerLivres()
{
    var livres = biblio.ListerLivres();

    if (livres.Count == 0)
    {
        Console.WriteLine("\nAucun livre dans la bibliothèque.");
        return;
    }

    Console.WriteLine($"\nCatalogue ({livres.Count} livres) :");
    foreach (var livre in livres)
    {
        Console.WriteLine($"  {livre.Resumer()}");
    }
}

void RechercherLivres()
{
    Console.Write("Terme de recherche : ");
    string terme = Console.ReadLine() ?? "";

    var resultats = biblio.RechercherLivres(terme);

    if (resultats.Count == 0)
    {
        Console.WriteLine($"Aucun résultat pour '{terme}'.");
        return;
    }

    Console.WriteLine($"\n{resultats.Count} résultat(s) pour '{terme}' :");
    foreach (var livre in resultats)
    {
        Console.WriteLine($"  {livre.Resumer()}");
    }
}

void AjouterMembre()
{
    Console.Write("Nom : ");
    string nom = Console.ReadLine() ?? "";
    Console.Write("Email : ");
    string email = Console.ReadLine() ?? "";

    var membre = biblio.AjouterMembre(nom, email);
    Console.WriteLine($"Membre '{nom}' ajouté (ID : {membre.Id}).");
}

void ListerMembres()
{
    var membres = biblio.ListerMembres();

    if (membres.Count == 0)
    {
        Console.WriteLine("\nAucun membre inscrit.");
        return;
    }

    Console.WriteLine($"\nMembres ({membres.Count}) :");
    foreach (var membre in membres)
    {
        Console.WriteLine($"  {membre.Resumer()}");
    }
}

void Emprunter()
{
    Console.Write("ID du membre : ");
    if (!int.TryParse(Console.ReadLine(), out int membreId))
    {
        Console.WriteLine("ID invalide.");
        return;
    }

    Console.Write("ISBN du livre : ");
    string isbn = Console.ReadLine() ?? "";

    var emprunt = biblio.Emprunter(membreId, isbn);
    Console.WriteLine($"Emprunt enregistré. Retour prévu le {emprunt.DateRetourPrevue:dd/MM/yyyy}.");
}

void Retourner()
{
    Console.Write("ISBN du livre à retourner : ");
    string isbn = Console.ReadLine() ?? "";

    biblio.Retourner(isbn);
    Console.WriteLine("Retour enregistré.");
}

void VoirEmprunts()
{
    var emprunts = biblio.ListerEmpruntsActifs();

    if (emprunts.Count == 0)
    {
        Console.WriteLine("\nAucun emprunt actif.");
        return;
    }

    Console.WriteLine($"\nEmprunts actifs ({emprunts.Count}) :");
    foreach (var emprunt in emprunts)
    {
        try
        {
            var livre = biblio.TrouverLivre(emprunt.Isbn);
            var membre = biblio.TrouverMembre(emprunt.MembreId);
            string retard = emprunt.EstEnRetard ? " [EN RETARD]" : "";
            Console.WriteLine($"  {livre.Titre} -> {membre.Nom} (retour : {emprunt.DateRetourPrevue:dd/MM/yyyy}){retard}");
        }
        catch (BiblioException)
        {
            Console.WriteLine($"  Emprunt #{emprunt.Id} (données incomplètes)");
        }
    }
}
```

---

### Étape 7 : Compiler et tester

```bash
# Compiler le projet
dotnet build
```

**Résultat attendu** :

```text
MSBuild version 17.8.3+195e7f5a3 for .NET
  Determining projects to restore...
  All projects are up-to-date for restore.
  BiblioConsole -> /home/user/BiblioConsole/bin/Debug/net10.0/BiblioConsole.dll
Build succeeded.
    0 Warning(s)
    0 Error(s)
```

```bash
# Exécuter le programme
dotnet run
```

**Scénario de test complet** :

```text
=== BiblioConsole - Gestion de bibliothèque ===

--- Menu ---
1. Ajouter un livre       6. Emprunter un livre
2. Lister les livres      7. Retourner un livre
3. Rechercher un livre    8. Voir les emprunts
4. Ajouter un membre      9. Statistiques
5. Lister les membres     0. Quitter
Choix : 1
ISBN : 978-2-07-040850-4
Titre : Le Petit Prince
Auteur : Saint-Exupéry
Année : 1943
Genre : Conte
Livre 'Le Petit Prince' ajouté avec succès.

Choix : 1
ISBN : 978-2-07-036024-5
Titre : L'Étranger
Auteur : Camus
Année : 1942
Genre : Roman
Livre 'L'Étranger' ajouté avec succès.

Choix : 4
Nom : Alice Dupont
Email : alice@test.com
Membre 'Alice Dupont' ajouté (ID : 1).

Choix : 6
ID du membre : 1
ISBN du livre : 978-2-07-040850-4
Emprunt enregistré. Retour prévu le 28/04/2026.

Choix : 2
Catalogue (2 livres) :
  [978-2-07-040850-4] Le Petit Prince - Saint-Exupéry (1943) [Conte] (Emprunté)
  [978-2-07-036024-5] L'Étranger - Camus (1942) [Roman] (Disponible)

Choix : 9
========== STATISTIQUES ==========
  Livres : 2 total (1 disponibles, 1 empruntés)
  Membres : 1
  Emprunts : 1 actifs (0 en retard), 1 total

  Répartition par genre :
    Conte : 1 livres
    Roman : 1 livres

  Membres les plus actifs :
    Alice Dupont : 1 emprunts
==================================

Choix : 0
Au revoir !
```

---

## Récapitulatif des Concepts Utilisés

Ce projet intègre tous les concepts appris dans les 9 fiches précédentes :

| Concept | Fiche | Utilisation dans le projet |
| ------- | ----- | ------------------------- |
| CLI dotnet, structure de projet | Fiche 1 | Création et compilation du projet |
| Types, constantes | Fiche 2 | Propriétés typées, constantes `MaxEmpruntsParMembre` |
| Conditions, switch | Fiche 3 | Menu principal, validation des saisies |
| Méthodes, paramètres | Fiche 4 | Fonctions de menu, méthodes de service |
| Classes, propriétés, records | Fiche 5 | Modèles `Livre`, `Membre`, `Emprunt` |
| Héritage, interfaces | Fiche 6 | Hiérarchie d'exceptions personnalisées |
| Collections, LINQ | Fiche 7 | `List<T>`, `Where`, `GroupBy`, `OrderBy`, `Count` |
| Gestion des erreurs | Fiche 8 | `try/catch`, exceptions personnalisées |
| Fichiers, JSON | Fiche 9 | Persistance `System.Text.Json`, `File.ReadAllText` |

---

## Améliorations Possibles

Si tu souhaites aller plus loin, voici des pistes d'amélioration :

| Amélioration | Concepts impliqués |
| ------------ | ------------------ |
| Ajouter la recherche par genre avec un sous-menu | Conditions, LINQ `Where` |
| Afficher l'historique complet des emprunts d'un membre | LINQ `Where`, `OrderBy` |
| Ajouter une date limite de retour configurable | Paramètres par défaut |
| Exporter le catalogue en CSV | `StreamWriter`, boucles |
| Ajouter un système de pénalités pour les retards | Propriétés calculées, `TimeSpan` |
| Ajouter les opérations async pour les I/O | `async/await`, `ReadAllTextAsync` |
| Valider les ISBN (format 13 chiffres) | Expressions régulières, validation |

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `dotnet new console -n NomProjet` | Créer un projet console |
| `dotnet build` | Compiler le projet |
| `dotnet run` | Compiler et exécuter |
| `dotnet clean` | Supprimer les fichiers de compilation |
| `dotnet publish -c Release` | Publier une version optimisée |

---

## Pièges Fréquents

### Piège 1 : Namespace manquant

**Problème** : Les classes dans des dossiers séparés doivent déclarer et importer les namespaces.

```csharp
// Dans Models/Livre.cs
namespace BiblioConsole.Models;  // Déclarer le namespace

// Dans Services/BibliothequeService.cs
using BiblioConsole.Models;      // Importer le namespace
```

---

### Piège 2 : Record mutable vs immuable

**Problème** : Les propriétés `init` ne sont pas modifiables après la construction. Pour les propriétés qui doivent changer (comme `Disponible`), utiliser `set`.

```csharp
// init : immuable après construction
public string Titre { get; init; }

// set : modifiable
public bool Disponible { get; set; }
```

> **Pourquoi cette asymétrie dans `Livre` ?** Le record `Livre` utilise `init` pour les propriétés identitaires (ISBN, titre, auteur, année, genre) qui ne changent jamais, et `set` uniquement pour `Disponible` qui doit être modifié à chaque emprunt ou retour.
> Ce choix est délibéré : il préserve l'immuabilité des données descriptives tout en autorisant la mutation de l'état fonctionnel. Si tu ajoutes un nouveau champ qui ne doit jamais changer (ex. `DateAcquisition`), utilise `init`. Si tu ajoutes un champ qui évolue au cours de la vie du livre (ex. `NombreLecteurs`), utilise `set`.

---

### Piège 3 : Fichier JSON corrompu

**Problème** : Si le fichier JSON est modifié manuellement avec une erreur, la désérialisation échoue.

**Solution** : Toujours entourer la désérialisation d'un `try/catch` et proposer de repartir d'une base vide (comme fait dans `StockageService.Charger()`).

---

## Checklist de Validation

- [ ] Le projet compile sans erreur avec `dotnet build`
- [ ] Je peux ajouter des livres et des membres
- [ ] Je peux emprunter et retourner des livres
- [ ] Les données sont sauvegardées en JSON et rechargées au redémarrage
- [ ] Les erreurs sont gérées proprement (ISBN en double, livre indisponible, etc.)
- [ ] La recherche LINQ fonctionne (par titre, auteur, genre)
- [ ] Les statistiques s'affichent correctement
- [ ] J'ai compris comment les 9 concepts se combinent dans un projet réel

---

## Navigation

← Fiche précédente : **[Fichiers et sérialisation](09-fichiers-serialisation.md)**

Fin du cursus C#. Tu maîtrises maintenant les fondamentaux du langage pour créer des applications console structurées.
