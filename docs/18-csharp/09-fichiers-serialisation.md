---
tags:
  - C#
  - Intermédiaire
  - Pratique
description: "Lire et écrire des fichiers en C#, sérialiser des objets en JSON avec System.Text.Json et utiliser les opérations async."
estimated_time: "75 min"
fiche_number: 9
total_fiches: 10
cursus: "C#"
id: "web.csharp.fichiers-serialisation"
course_id: "web.csharp"
content_type: "lesson"
order: 9
---

# 09 - Fichiers et sérialisation

> **En bref** : Apprendre à lire et écrire des fichiers, sérialiser des objets en JSON avec System.Text.Json et utiliser les opérations asynchrones pour les I/O. Lecture estimée : 75 min.

## Prérequis

- Avoir terminé la fiche **[08 - Gestion des erreurs](08-gestion-erreurs.md)**
- Savoir utiliser try/catch et le pattern using/IDisposable
- Connaître les classes et les records

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire et écrire des fichiers texte, manipuler le système de fichiers, sérialiser et désérialiser des objets en JSON avec System.Text.Json, et utiliser async/await pour les opérations d'entrée/sortie.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que les I/O en C# ?

**Définition** : Les I/O (Input/Output, entrées/sorties) désignent toutes les opérations de lecture et d'écriture de données en dehors de la mémoire du programme : fichiers sur le disque, flux réseau, console.

**Le problème que les I/O structurées résolvent** :

Sans API d'I/O structurée, voici les problèmes rencontrés :

1. **Gestion manuelle des buffers** : En C, il faut allouer des buffers de lecture, gérer leur taille et les libérer manuellement.
2. **Encodage complexe** : Lire un fichier UTF-8 en Windows (qui utilise UTF-16 en interne) nécessite des conversions manuelles.
3. **Fuites de ressources** : Oublier de fermer un fichier bloque la ressource pour les autres processus.

**Comment C# résout ces problèmes** :

| Problème | Solution apportée par C# |
| -------- | ------------------------ |
| Gestion manuelle des buffers | `File.ReadAllText()` lit tout le fichier en une ligne |
| Encodage complexe | L'encodage UTF-8 est le défaut, configurable facilement |
| Fuites de ressources | Le pattern `using` ferme automatiquement les fichiers |

**Les classes principales** :

| Classe | Rôle |
| ------ | ---- |
| `File` | Méthodes statiques pour lire/écrire des fichiers |
| `Directory` | Méthodes statiques pour manipuler les répertoires |
| `Path` | Méthodes statiques pour manipuler les chemins |
| `StreamReader` | Lire un fichier ligne par ligne |
| `StreamWriter` | Écrire dans un fichier ligne par ligne |

---

### Qu'est-ce que la sérialisation JSON ?

**Définition** : La sérialisation est le processus de conversion d'un objet C# en une chaîne de texte (JSON, XML, binaire). La désérialisation est l'opération inverse : reconstituer un objet à partir d'un texte.

**Le problème que la sérialisation résout** :

Sans sérialisation, voici les problèmes rencontrés :

1. **Persistance impossible** : Un objet en mémoire disparaît quand le programme s'arrête. Impossible de le sauvegarder.
2. **Communication entre programmes** : Deux programmes ne peuvent pas échanger des objets directement.
3. **Format ad hoc** : Chaque développeur invente son propre format de sauvegarde, rendant l'interopérabilité impossible.

**Comment la sérialisation résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Persistance impossible | Sérialiser l'objet en JSON et le sauvegarder dans un fichier |
| Communication entre programmes | JSON est lisible par tous les langages |
| Format ad hoc | JSON est un standard universel (RFC 8259) |

**Analogie concrète** : La sérialisation fonctionne comme un meuble IKEA. L'objet assemblé (en mémoire) est démonté en pièces numérotées (sérialisation JSON) avec une notice de montage. N'importe qui peut remonter le meuble (désérialisation) en suivant la notice, même dans un autre pays (un autre programme).

**Ce que System.Text.Json n'est PAS** :

- Ce n'est pas Newtonsoft.Json (Json.NET). System.Text.Json est la bibliothèque JSON intégrée à .NET, plus performante mais avec moins de fonctionnalités que Newtonsoft.
- Ce n'est pas un outil de validation de schéma JSON. Il sérialise et désérialise, mais ne valide pas la structure du JSON par rapport à un schéma.

---

### Qu'est-ce que async/await ?

**Définition** : `async` et `await` sont des mots-clés C# qui permettent d'écrire du code asynchrone qui ne bloque pas le thread principal pendant les opérations lentes (lecture de fichier, requête réseau).

**Le problème que async/await résout** :

Sans async/await, voici les problèmes rencontrés :

1. **Blocage du thread** : Lire un gros fichier gèle l'interface utilisateur ou empêche le serveur de traiter d'autres requêtes.
2. **Code callback complexe** : L'alternative asynchrone classique utilise des callbacks imbriqués (callback hell), illisibles.

**Comment async/await résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Blocage du thread | `await` libère le thread pendant l'attente, il peut traiter d'autres tâches |
| Code callback complexe | Le code asynchrone ressemble au code synchrone, facile à lire |

**Analogie concrète** : async/await fonctionne comme commander un plat au restaurant. Tu passes ta commande (await), puis tu continues à discuter (le thread est libre). Quand le plat arrive (l'opération I/O est terminée), tu le reçois et tu manges (le code continue).

---

## Étapes Pratiques

### Étape 1 : Lire et écrire des fichiers texte

```bash
dotnet new console -n fichiers-demo
cd fichiers-demo
```

```csharp
// --- Écrire dans un fichier avec File ---
string chemin = "exemple.txt";

// WriteAllText : écrire tout le contenu d'un coup (écrase le fichier existant)
File.WriteAllText(chemin, "Première ligne\nDeuxième ligne\nTroisième ligne");
Console.WriteLine($"Fichier '{chemin}' créé.");

// AppendAllText : ajouter du contenu à la fin
File.AppendAllText(chemin, "\nQuatrième ligne (ajoutée)");
Console.WriteLine("Contenu ajouté.");

// --- Lire un fichier ---
// ReadAllText : lire tout le contenu
string contenu = File.ReadAllText(chemin);
Console.WriteLine($"\nContenu complet :\n{contenu}");

// ReadAllLines : lire ligne par ligne dans un tableau
string[] lignes = File.ReadAllLines(chemin);
Console.WriteLine($"\nNombre de lignes : {lignes.Length}");
for (int i = 0; i < lignes.Length; i++)
{
    Console.WriteLine($"  Ligne {i + 1} : {lignes[i]}");
}

// --- Vérifications ---
Console.WriteLine($"\nLe fichier existe : {File.Exists(chemin)}");
Console.WriteLine($"Taille : {new FileInfo(chemin).Length} octets");
Console.WriteLine($"Dernière modification : {File.GetLastWriteTime(chemin):dd/MM/yyyy HH:mm}");
```

**Résultat attendu** :

```text
Fichier 'exemple.txt' créé.
Contenu ajouté.

Contenu complet :
Première ligne
Deuxième ligne
Troisième ligne
Quatrième ligne (ajoutée)

Nombre de lignes : 4
  Ligne 1 : Première ligne
  Ligne 2 : Deuxième ligne
  Ligne 3 : Troisième ligne
  Ligne 4 : Quatrième ligne (ajoutée)

Le fichier existe : True
Taille : 82 octets
Dernière modification : 07/04/2026 14:30
```

---

### Étape 2 : StreamReader et StreamWriter

```csharp
// --- StreamWriter : écrire ligne par ligne avec using ---
string chemin = "journal.log";

using (StreamWriter writer = new(chemin))
{
    writer.WriteLine($"[{DateTime.Now:HH:mm:ss}] Démarrage de l'application");
    writer.WriteLine($"[{DateTime.Now:HH:mm:ss}] Chargement de la configuration");
    writer.WriteLine($"[{DateTime.Now:HH:mm:ss}] Application prête");
}
// Le fichier est fermé automatiquement ici

// Ajouter au fichier existant (append: true)
using (StreamWriter writer = new(chemin, append: true))
{
    writer.WriteLine($"[{DateTime.Now:HH:mm:ss}] Nouvelle entrée ajoutée");
}

// --- StreamReader : lire ligne par ligne ---
Console.WriteLine("Journal :");
using (StreamReader reader = new(chemin))
{
    string? ligne;
    int numero = 1;

    // ReadLine retourne null à la fin du fichier
    while ((ligne = reader.ReadLine()) != null)
    {
        Console.WriteLine($"  {numero}. {ligne}");
        numero++;
    }
}

// Nettoyage
File.Delete(chemin);
Console.WriteLine($"\nFichier '{chemin}' supprimé.");
```

**Résultat attendu** :

```text
Journal :
  1. [14:30:00] Démarrage de l'application
  2. [14:30:00] Chargement de la configuration
  3. [14:30:00] Application prête
  4. [14:30:00] Nouvelle entrée ajoutée

Fichier 'journal.log' supprimé.
```

---

### Étape 3 : Manipuler les répertoires et les chemins

```csharp
// --- Chemins avec Path ---
string fichier = @"/home/user/documents/rapport.pdf";

Console.WriteLine($"Nom du fichier : {Path.GetFileName(fichier)}");
Console.WriteLine($"Extension : {Path.GetExtension(fichier)}");
Console.WriteLine($"Sans extension : {Path.GetFileNameWithoutExtension(fichier)}");
Console.WriteLine($"Répertoire : {Path.GetDirectoryName(fichier)}");

// Combiner des chemins (gère les séparateurs automatiquement)
string dossier = "données";
string nom = "export.csv";
string cheminComplet = Path.Combine(dossier, nom);
Console.WriteLine($"\nChemin combiné : {cheminComplet}");

// --- Répertoires avec Directory ---
string dirTest = "test_dossier/sous-dossier";

// Créer un répertoire (y compris les parents)
Directory.CreateDirectory(dirTest);
Console.WriteLine($"\nRépertoire '{dirTest}' créé.");

// Créer des fichiers de test
File.WriteAllText(Path.Combine("test_dossier", "fichier1.txt"), "contenu 1");
File.WriteAllText(Path.Combine("test_dossier", "fichier2.txt"), "contenu 2");
File.WriteAllText(Path.Combine("test_dossier", "données.csv"), "a,b,c");

// Lister les fichiers
Console.WriteLine("\nFichiers dans test_dossier :");
foreach (string f in Directory.GetFiles("test_dossier"))
{
    Console.WriteLine($"  {Path.GetFileName(f)}");
}

// Lister avec filtre
Console.WriteLine("\nFichiers .txt uniquement :");
foreach (string f in Directory.GetFiles("test_dossier", "*.txt"))
{
    Console.WriteLine($"  {Path.GetFileName(f)}");
}

// Lister les sous-répertoires
Console.WriteLine($"\nSous-répertoires :");
foreach (string d in Directory.GetDirectories("test_dossier"))
{
    Console.WriteLine($"  {Path.GetFileName(d)}/");
}

// Nettoyage
Directory.Delete("test_dossier", recursive: true);
Console.WriteLine("\nRépertoire test supprimé.");
```

**Résultat attendu** :

```text
Nom du fichier : rapport.pdf
Extension : .pdf
Sans extension : rapport
Répertoire : /home/user/documents

Chemin combiné : données/export.csv

Répertoire 'test_dossier/sous-dossier' créé.

Fichiers dans test_dossier :
  fichier1.txt
  fichier2.txt
  données.csv

Fichiers .txt uniquement :
  fichier1.txt
  fichier2.txt

Sous-répertoires :
  sous-dossier/

Répertoire test supprimé.
```

---

### Étape 4 : Sérialisation JSON avec System.Text.Json

```csharp
using System.Text.Json;

// Record pour la sérialisation
record Utilisateur(string Nom, string Email, int Age, List<string> Roles);

// --- Sérialiser un objet en JSON ---
Utilisateur alice = new("Alice Dupont", "alice@test.com", 25, new() { "admin", "editeur" });

// Options pour un JSON lisible (indenté)
JsonSerializerOptions options = new()
{
    WriteIndented = true,                           // JSON indenté
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase // camelCase au lieu de PascalCase
};

string json = JsonSerializer.Serialize(alice, options);
Console.WriteLine("JSON sérialisé :");
Console.WriteLine(json);

// --- Désérialiser du JSON en objet ---
string jsonEntree = """
{
    "nom": "Bob Martin",
    "email": "bob@test.com",
    "age": 30,
    "roles": ["lecteur"]
}
""";

Utilisateur? bob = JsonSerializer.Deserialize<Utilisateur>(jsonEntree, options);
Console.WriteLine($"\nDésérialisé : {bob?.Nom}, {bob?.Email}, {bob?.Age} ans");
Console.WriteLine($"Rôles : {string.Join(", ", bob?.Roles ?? new())}");

// --- Sérialiser une liste ---
List<Utilisateur> utilisateurs = new()
{
    new("Alice", "alice@test.com", 25, new() { "admin" }),
    new("Bob", "bob@test.com", 30, new() { "lecteur" }),
    new("Charlie", "charlie@test.com", 22, new() { "editeur", "lecteur" })
};

string jsonListe = JsonSerializer.Serialize(utilisateurs, options);
Console.WriteLine($"\nListe JSON :\n{jsonListe}");
```

**Résultat attendu** :

```text
JSON sérialisé :
{
  "nom": "Alice Dupont",
  "email": "alice@test.com",
  "age": 25,
  "roles": [
    "admin",
    "editeur"
  ]
}

Désérialisé : Bob Martin, bob@test.com, 30 ans
Rôles : lecteur

Liste JSON :
[
  {
    "nom": "Alice",
    "email": "alice@test.com",
    "age": 25,
    "roles": [
      "admin"
    ]
  },
  {
    "nom": "Bob",
    "email": "bob@test.com",
    "age": 30,
    "roles": [
      "lecteur"
    ]
  },
  {
    "nom": "Charlie",
    "email": "charlie@test.com",
    "age": 22,
    "roles": [
      "editeur",
      "lecteur"
    ]
  }
]
```

---

### Étape 5 : Sauvegarder et charger depuis un fichier JSON

```csharp
using System.Text.Json;

record Tache(string Titre, bool Terminee, DateTime DateCreation);

// Options de sérialisation
JsonSerializerOptions options = new()
{
    WriteIndented = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

string fichier = "taches.json";

// --- Sauvegarder une liste de tâches ---
List<Tache> taches = new()
{
    new("Apprendre C#", false, DateTime.Now),
    new("Lire la documentation", true, DateTime.Now.AddDays(-1)),
    new("Créer un projet", false, DateTime.Now.AddDays(-2))
};

string json = JsonSerializer.Serialize(taches, options);
File.WriteAllText(fichier, json);
Console.WriteLine($"Sauvegardé {taches.Count} tâches dans '{fichier}'");

// --- Charger les tâches depuis le fichier ---
string jsonLu = File.ReadAllText(fichier);
List<Tache>? tachesChargees = JsonSerializer.Deserialize<List<Tache>>(jsonLu, options);

Console.WriteLine($"\nChargé {tachesChargees?.Count} tâches :");
if (tachesChargees != null)
{
    foreach (Tache tache in tachesChargees)
    {
        string statut = tache.Terminee ? "Terminée" : "En cours";
        Console.WriteLine($"  [{statut}] {tache.Titre} (créée le {tache.DateCreation:dd/MM/yyyy})");
    }
}

// Nettoyage
File.Delete(fichier);
```

**Résultat attendu** :

```text
Sauvegardé 3 tâches dans 'taches.json'

Chargé 3 tâches :
  [En cours] Apprendre C# (créée le 07/04/2026)
  [Terminée] Lire la documentation (créée le 06/04/2026)
  [En cours] Créer un projet (créée le 05/04/2026)
```

---

### Étape 6 : Opérations asynchrones

```csharp
using System.Text.Json;

record Note(string Titre, string Contenu, DateTime Date);

// Méthode asynchrone pour sauvegarder
static async Task SauvegarderAsync(string fichier, List<Note> notes)
{
    JsonSerializerOptions options = new() { WriteIndented = true };
    string json = JsonSerializer.Serialize(notes, options);

    // WriteAllTextAsync ne bloque pas le thread
    await File.WriteAllTextAsync(fichier, json);
    Console.WriteLine($"  Sauvegarde async terminée ({notes.Count} notes)");
}

// Méthode asynchrone pour charger
static async Task<List<Note>> ChargerAsync(string fichier)
{
    if (!File.Exists(fichier))
        return new List<Note>();

    string json = await File.ReadAllTextAsync(fichier);
    return JsonSerializer.Deserialize<List<Note>>(json) ?? new List<Note>();
}

// Programme principal async
string fichier = "notes.json";

// Sauvegarder de manière asynchrone
List<Note> notes = new()
{
    new("Réunion", "Préparer la présentation", DateTime.Now),
    new("Courses", "Lait, pain, beurre", DateTime.Now),
};

Console.WriteLine("Sauvegarde asynchrone :");
await SauvegarderAsync(fichier, notes);

// Charger de manière asynchrone
Console.WriteLine("\nChargement asynchrone :");
List<Note> notesChargees = await ChargerAsync(fichier);
foreach (Note note in notesChargees)
{
    Console.WriteLine($"  {note.Titre} : {note.Contenu}");
}

// Lire un fichier ligne par ligne de manière asynchrone
File.WriteAllText("lignes.txt", "Ligne 1\nLigne 2\nLigne 3");

Console.WriteLine("\nLecture async ligne par ligne :");
await foreach (string ligne in File.ReadLinesAsync("lignes.txt"))
{
    Console.WriteLine($"  > {ligne}");
}

// Nettoyage
File.Delete(fichier);
File.Delete("lignes.txt");
```

**Résultat attendu** :

```text
Sauvegarde asynchrone :
  Sauvegarde async terminée (2 notes)

Chargement asynchrone :
  Réunion : Préparer la présentation
  Courses : Lait, pain, beurre

Lecture async ligne par ligne :
  > Ligne 1
  > Ligne 2
  > Ligne 3
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `dotnet run` | Compiler et exécuter le projet |
| `dotnet add package NomPaquet` | Ajouter un paquet NuGet (ex: Newtonsoft.Json) |

---

## Pièges Fréquents

### Piège 1 : Chemins relatifs vs absolus

**Problème** : Les chemins relatifs dépendent du répertoire de travail, qui peut changer selon comment le programme est lancé.

```csharp
// Relatif : peut ne pas trouver le fichier
File.ReadAllText("config.json");

// Absolu : fonctionne toujours
File.ReadAllText("/home/user/app/config.json");
```

**Solution** : Utiliser `AppContext.BaseDirectory` ou `Path.Combine` pour construire des chemins fiables.

```csharp
string baseDir = AppContext.BaseDirectory;
string config = Path.Combine(baseDir, "config.json");
```

---

### Piège 2 : Casse des propriétés JSON

**Problème** : Par défaut, System.Text.Json utilise PascalCase (C#), mais beaucoup de JSON utilisent camelCase.

```json
{ "nom": "Alice" }
```

```csharp
record Personne(string Nom);
// La désérialisation échoue car "nom" != "Nom"
```

**Solution** : Configurer `PropertyNamingPolicy` ou utiliser l'attribut `[JsonPropertyName]`.

```csharp
JsonSerializerOptions options = new()
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};
```

> **Piège dans les records positionnels** : Avec un record positionnel (`record Utilisateur(string Nom, string Email)`), la désérialisation camelCase peut retourner `null` silencieusement si les noms de paramètres du constructeur primaire ne correspondent pas exactement à la casse des clés JSON. En cas de doute, utilise l'attribut `[JsonPropertyName("nom")]` sur chaque paramètre, ou remplace le record positionnel par un record avec propriétés nommées.

---

### Piège 3 : Oublier async dans le Main

**Problème** : Appeler une méthode async sans `await` ne produit aucune erreur mais le code n'attend pas le résultat.

```csharp
// Le fichier n'est pas encore écrit quand on essaie de le lire
File.WriteAllTextAsync("test.txt", "contenu");  // Pas d'await !
string contenu = File.ReadAllText("test.txt");   // Fichier peut être vide
```

**Solution** : Toujours utiliser `await` avec les méthodes async.

```csharp
await File.WriteAllTextAsync("test.txt", "contenu");
string contenu = await File.ReadAllTextAsync("test.txt");
```

---

### Piège 4 : Fichier verrouillé par un autre processus

**Problème** : Un fichier ouvert par un programme ne peut pas être lu/écrit par un autre.

**Solution** : Utiliser `using` pour fermer les fichiers dès que possible, ou utiliser `File.Open` avec des options de partage.

```csharp
using FileStream fs = File.Open("fichier.txt", FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
```

---

## Checklist de Validation

- [ ] Je sais lire et écrire des fichiers avec `File.ReadAllText` et `File.WriteAllText`
- [ ] Je sais utiliser `StreamReader` et `StreamWriter` avec `using`
- [ ] Je sais manipuler les chemins avec `Path` et les répertoires avec `Directory`
- [ ] Je sais sérialiser un objet en JSON avec `JsonSerializer.Serialize`
- [ ] Je sais désérialiser du JSON en objet avec `JsonSerializer.Deserialize`
- [ ] Je sais configurer les options JSON (indentation, camelCase)
- [ ] Je comprends `async/await` et je sais utiliser les méthodes I/O asynchrones

---

## Exercice Pratique

**Énoncé** : Crée un programme de carnet de contacts qui persiste les données en JSON :

1. Crée un record `Contact` avec : `Nom`, `Telephone`, `Email`, `DateAjout`
2. Implémente les opérations : ajouter, lister, rechercher, supprimer
3. Sauvegarde automatiquement dans `contacts.json` après chaque modification
4. Charge les contacts depuis le fichier au démarrage

**Indications** :

- Utilise `File.Exists()` pour vérifier si le fichier existe au démarrage
- Utilise une boucle `do-while` avec un menu pour les opérations
- Sauvegarde avec `JsonSerializer.Serialize` et `File.WriteAllText`

**Résultat attendu** :

```text
Carnet de contacts (0 contacts)
1. Ajouter  2. Lister  3. Rechercher  4. Supprimer  5. Quitter
Choix : 1
Nom : Alice Dupont
Téléphone : 0612345678
Email : alice@test.com
Contact ajouté et sauvegardé.

Carnet de contacts (1 contact)
1. Ajouter  2. Lister  3. Rechercher  4. Supprimer  5. Quitter
Choix : 2
  1. Alice Dupont - 0612345678 - alice@test.com (ajouté le 07/04/2026)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```csharp
using System.Text.Json;

record Contact(string Nom, string Telephone, string Email, DateTime DateAjout);

// Configuration JSON
JsonSerializerOptions jsonOptions = new()
{
    WriteIndented = true,
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

string fichier = "contacts.json";

// Charger les contacts existants
List<Contact> contacts;
if (File.Exists(fichier))
{
    string json = File.ReadAllText(fichier);
    contacts = JsonSerializer.Deserialize<List<Contact>>(json, jsonOptions) ?? new();
}
else
{
    contacts = new();
}

// Méthode pour sauvegarder
void Sauvegarder()
{
    string json = JsonSerializer.Serialize(contacts, jsonOptions);
    File.WriteAllText(fichier, json);
}

// Menu principal
bool continuer = true;
while (continuer)
{
    Console.WriteLine($"\nCarnet de contacts ({contacts.Count} contact{(contacts.Count > 1 ? "s" : "")})");
    Console.WriteLine("1. Ajouter  2. Lister  3. Rechercher  4. Supprimer  5. Quitter");
    Console.Write("Choix : ");

    switch (Console.ReadLine())
    {
        case "1": // Ajouter
            Console.Write("Nom : ");
            string nom = Console.ReadLine() ?? "";
            Console.Write("Téléphone : ");
            string tel = Console.ReadLine() ?? "";
            Console.Write("Email : ");
            string email = Console.ReadLine() ?? "";

            contacts.Add(new Contact(nom, tel, email, DateTime.Now));
            Sauvegarder();
            Console.WriteLine("Contact ajouté et sauvegardé.");
            break;

        case "2": // Lister
            if (contacts.Count == 0)
            {
                Console.WriteLine("Aucun contact.");
            }
            else
            {
                for (int i = 0; i < contacts.Count; i++)
                {
                    var c = contacts[i];
                    Console.WriteLine($"  {i + 1}. {c.Nom} - {c.Telephone} - {c.Email} (ajouté le {c.DateAjout:dd/MM/yyyy})");
                }
            }
            break;

        case "3": // Rechercher
            Console.Write("Rechercher : ");
            string recherche = Console.ReadLine() ?? "";
            var resultats = contacts.Where(c =>
                c.Nom.Contains(recherche, StringComparison.OrdinalIgnoreCase) ||
                c.Email.Contains(recherche, StringComparison.OrdinalIgnoreCase)
            ).ToList();

            Console.WriteLine($"{resultats.Count} résultat(s) :");
            foreach (var r in resultats)
            {
                Console.WriteLine($"  {r.Nom} - {r.Telephone} - {r.Email}");
            }
            break;

        case "4": // Supprimer
            Console.Write("Numéro du contact à supprimer : ");
            if (int.TryParse(Console.ReadLine(), out int index) && index >= 1 && index <= contacts.Count)
            {
                string nomSupprime = contacts[index - 1].Nom;
                contacts.RemoveAt(index - 1);
                Sauvegarder();
                Console.WriteLine($"Contact '{nomSupprime}' supprimé.");
            }
            else
            {
                Console.WriteLine("Numéro invalide.");
            }
            break;

        case "5": // Quitter
            continuer = false;
            Console.WriteLine("Au revoir !");
            break;

        default:
            Console.WriteLine("Choix invalide.");
            break;
    }
}

// Nettoyage du fichier de test
if (File.Exists(fichier))
{
    File.Delete(fichier);
}
```

---

## Navigation

← Fiche précédente : **[Gestion des erreurs](08-gestion-erreurs.md)**

→ Fiche suivante : **[Projet intégrateur](10-projet-integrateur.md)**
