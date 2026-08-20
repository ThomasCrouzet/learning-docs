---
tags:
  - C#
  - Intermédiaire
  - Concept
description: "Maîtriser les classes et objets en C# : propriétés, constructeurs, encapsulation, membres statiques et records."
estimated_time: "75 min"
fiche_number: 5
total_fiches: 10
cursus: "C#"
---

# 05 - Classes et objets

> **En bref** : Comprendre et utiliser les classes, propriétés, constructeurs, encapsulation, membres statiques et records en C#. Lecture estimée : 75 min.

## Prérequis

- Avoir terminé la fiche **[04 - Fonctions et méthodes](04-fonctions-methodes.md)**
- Connaître les concepts de base de la POO grâce au [cursus Java](../fondamentaux/01-java/index.md) (classes, objets, constructeurs)
- Savoir déclarer et appeler des méthodes

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des classes avec des propriétés automatiques, des constructeurs, l'encapsulation avec les modificateurs d'accès, des membres statiques et des records pour les objets immuables.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une classe en C# ?

**Définition** : Une classe est un modèle (blueprint) qui définit la structure et le comportement d'un objet. En C#, une classe contient des propriétés (données), des méthodes (comportements) et des constructeurs (initialisation).

**Le problème que les classes résolvent** :

Sans classes, voici les problèmes rencontrés :

1. **Données dispersées** : Les informations liées (nom, âge, email d'un utilisateur) sont stockées dans des variables séparées sans lien entre elles.
2. **Comportements détachés** : Les fonctions qui manipulent ces données ne sont pas regroupées avec les données qu'elles traitent.
3. **Réutilisation impossible** : Pour créer un deuxième utilisateur, il faut dupliquer toutes les variables.

**Comment les classes résolvent ces problèmes** :

| Problème | Solution apportée par les classes |
| -------- | --------------------------------- |
| Données dispersées | Les propriétés regroupent les données liées dans un seul objet |
| Comportements détachés | Les méthodes sont déclarées dans la classe, à côté des données |
| Réutilisation impossible | On crée autant d'objets (instances) que nécessaire à partir du modèle |

**Analogie concrète** : Une classe fonctionne comme un formulaire vierge. Le formulaire définit les champs à remplir (propriétés) et les instructions (méthodes). Chaque formulaire rempli est un objet (instance). Tu peux remplir autant de formulaires que nécessaire à partir du même modèle.

**Comparaison C# vs Java pour les classes** :

| C# | Java |
| -- | ---- |
| Propriétés avec `get; set;` | Getters/setters manuels |
| Constructeur primaire (C# 12) | Pas d'équivalent direct |
| `record` pour les objets de données | `record` (depuis Java 16) |
| `init` pour les propriétés en lecture seule après construction | Pas d'équivalent direct |

---

### Qu'est-ce qu'une propriété en C# ?

**Définition** : Une propriété est un membre de classe qui encapsule un champ (variable) avec un accesseur en lecture (`get`) et/ou en écriture (`set`). En C#, les propriétés remplacent les getters/setters manuels de Java.

**Le problème que les propriétés résolvent** :

Sans propriétés, voici les problèmes rencontrés :

1. **Code verbeux** : En Java, chaque champ nécessite un getter et un setter séparés (6-8 lignes par champ).
2. **Pas de validation** : Un champ public est modifiable sans contrôle. Un champ privé avec getter/setter est verbeux.

**Comment les propriétés résolvent ces problèmes** :

| Problème | Solution apportée par les propriétés |
| -------- | ------------------------------------ |
| Code verbeux | `public string Nom { get; set; }` remplace 8 lignes de Java |
| Pas de validation | Le `set` peut contenir de la logique de validation |

**Ce que les propriétés ne sont PAS** :

- Les propriétés ne sont pas des champs publics. Elles ressemblent syntaxiquement à des champs, mais le compilateur génère des méthodes get/set en arrière-plan.
- Elles ne sont pas un simple sucre syntaxique sans intérêt. Elles permettent d'ajouter de la validation sans changer l'interface publique de la classe.

---

### Qu'est-ce qu'un record ?

**Définition** : Un `record` est un type spécial de classe conçu pour les objets de données immuables. Le compilateur génère automatiquement `Equals()`, `GetHashCode()`, `ToString()` et la déconstruction.

**Le problème que les records résolvent** :

Sans records, voici les problèmes rencontrés :

1. **Code boilerplate** : Pour un simple objet de données, il faut écrire manuellement `Equals()`, `GetHashCode()` et `ToString()`.
2. **Mutabilité accidentelle** : Les classes standard sont modifiables par défaut, ce qui peut causer des bugs quand un objet est partagé entre plusieurs parties du code.

**Comment les records résolvent ces problèmes** :

| Problème | Solution apportée par les records |
| -------- | --------------------------------- |
| Code boilerplate | Le compilateur génère tout automatiquement |
| Mutabilité accidentelle | Les propriétés sont en lecture seule par défaut (`init`) |

**Analogie concrète** : Un record est comme une carte d'identité. Une fois imprimée, on ne peut pas modifier les informations dessus (immuable). Si un détail change, on imprime une nouvelle carte (nouvelle instance avec `with`).

---

## Étapes Pratiques

### Étape 1 : Créer une classe simple avec des propriétés

```bash
dotnet new console -n classes-demo
cd classes-demo
```

```csharp
// Déclarer une classe avec des propriétés automatiques
class Personne
{
    // Propriétés automatiques : le compilateur génère le champ privé
    public string Prenom { get; set; } = "";    // Valeur par défaut
    public string Nom { get; set; } = "";
    public int Age { get; set; }

    // Méthode d'instance
    public string SePresenter()
    {
        return $"Je suis {Prenom} {Nom}, j'ai {Age} ans.";
    }
}

// Créer un objet (instance) de la classe
Personne alice = new Personne();
alice.Prenom = "Alice";
alice.Nom = "Dupont";
alice.Age = 25;

Console.WriteLine(alice.SePresenter());

// Syntaxe d'initialisation d'objet (object initializer)
Personne bob = new Personne
{
    Prenom = "Bob",
    Nom = "Martin",
    Age = 30
};

Console.WriteLine(bob.SePresenter());

// Syntaxe courte avec new() quand le type est connu
Personne charlie = new()
{
    Prenom = "Charlie",
    Nom = "Durand",
    Age = 22
};

Console.WriteLine(charlie.SePresenter());
```

**Résultat attendu** :

```text
Je suis Alice Dupont, j'ai 25 ans.
Je suis Bob Martin, j'ai 30 ans.
Je suis Charlie Durand, j'ai 22 ans.
```

---

### Étape 2 : Constructeurs

```csharp
class Produit
{
    // Propriétés
    public string Nom { get; set; }
    public decimal Prix { get; set; }
    public int Stock { get; set; }

    // Constructeur principal
    public Produit(string nom, decimal prix, int stock)
    {
        Nom = nom;
        Prix = prix;
        Stock = stock;
    }

    // Constructeur secondaire (appelle le constructeur principal avec this)
    public Produit(string nom, decimal prix) : this(nom, prix, 0)
    {
        // Stock initialisé à 0 par le constructeur principal
    }

    // Méthode pour afficher les informations
    public void Afficher()
    {
        string disponibilite = Stock > 0 ? $"{Stock} en stock" : "Rupture de stock";
        Console.WriteLine($"{Nom} - {Prix:C} ({disponibilite})");
    }
}

// Utiliser le constructeur principal
Produit clavier = new Produit("Clavier mécanique", 89.99m, 15);
clavier.Afficher();

// Utiliser le constructeur secondaire
Produit souris = new Produit("Souris sans fil", 45.50m);
souris.Afficher();
```

**Résultat attendu** :

```text
Clavier mécanique - 89,99 € (15 en stock)
Souris sans fil - 45,50 € (Rupture de stock)
```

> **Note** : Le format `{Prix:C}` dépend de la locale du système (`CultureInfo`). Sur un système configuré en français, la sortie sera `89,99 €`. Sur un système en anglais américain, tu obtiendras `$89.99`. Pour forcer la locale française quelle que soit la machine, utilise `{Prix.ToString("C", new System.Globalization.CultureInfo("fr-FR"))}`.

---

### Étape 3 : Encapsulation et modificateurs d'accès

```csharp
class CompteBancaire
{
    // Propriété publique en lecture seule (pas de set public)
    public string Titulaire { get; }

    // Propriété avec set privé : modifiable uniquement depuis la classe
    public decimal Solde { get; private set; }

    // Champ privé : invisible de l'extérieur
    private readonly List<string> _historique = new();

    // Constructeur
    public CompteBancaire(string titulaire, decimal soldeInitial)
    {
        Titulaire = titulaire;
        Solde = soldeInitial;
        _historique.Add($"Ouverture du compte avec {soldeInitial:C}");
    }

    // Méthode publique : déposer de l'argent
    public void Deposer(decimal montant)
    {
        if (montant <= 0)
        {
            Console.WriteLine("Erreur : le montant doit être positif.");
            return;
        }

        Solde += montant;
        _historique.Add($"Dépôt de {montant:C}");
        Console.WriteLine($"Dépôt de {montant:C}. Nouveau solde : {Solde:C}");
    }

    // Méthode publique : retirer de l'argent
    public bool Retirer(decimal montant)
    {
        if (montant <= 0)
        {
            Console.WriteLine("Erreur : le montant doit être positif.");
            return false;
        }

        if (montant > Solde)
        {
            Console.WriteLine($"Erreur : solde insuffisant ({Solde:C}).");
            return false;
        }

        Solde -= montant;
        _historique.Add($"Retrait de {montant:C}");
        Console.WriteLine($"Retrait de {montant:C}. Nouveau solde : {Solde:C}");
        return true;
    }

    // Méthode publique : afficher l'historique
    public void AfficherHistorique()
    {
        Console.WriteLine($"\nHistorique de {Titulaire} :");
        foreach (string entree in _historique)
        {
            Console.WriteLine($"  - {entree}");
        }
        Console.WriteLine($"  Solde actuel : {Solde:C}");
    }
}

// Utilisation
CompteBancaire compte = new("Alice Dupont", 1000m);
compte.Deposer(500m);
compte.Retirer(200m);
compte.Retirer(2000m);  // Refusé
compte.AfficherHistorique();

// compte.Solde = 9999m;      // Erreur : set est privé
// compte._historique.Clear(); // Erreur : _historique est privé
```

**Résultat attendu** :

```text
Dépôt de 500,00 €. Nouveau solde : 1 500,00 €
Retrait de 200,00 €. Nouveau solde : 1 300,00 €
Erreur : solde insuffisant (1 300,00 €).

Historique de Alice Dupont :
  - Ouverture du compte avec 1 000,00 €
  - Dépôt de 500,00 €
  - Retrait de 200,00 €
  Solde actuel : 1 300,00 €
```

---

### Étape 4 : Propriétés avec validation

```csharp
class Etudiant
{
    // Propriété avec champ backing et validation dans le set
    private string _nom = "";
    public string Nom
    {
        get => _nom;
        set
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Le nom ne peut pas être vide.");
            _nom = value.Trim();
        }
    }

    // Propriété avec validation de plage
    private int _note;
    public int Note
    {
        get => _note;
        set
        {
            if (value < 0 || value > 20)
                throw new ArgumentOutOfRangeException(nameof(value), "La note doit être entre 0 et 20.");
            _note = value;
        }
    }

    // Propriété calculée (lecture seule, pas de set)
    public string Mention => Note switch
    {
        >= 16 => "Très bien",
        >= 14 => "Bien",
        >= 12 => "Assez bien",
        >= 10 => "Passable",
        _ => "Insuffisant"
    };

    // Propriété init-only : modifiable uniquement à l'initialisation
    public int NumeroEtudiant { get; init; }
}

// Utilisation
Etudiant etudiant = new()
{
    Nom = "Alice Martin",
    Note = 16,
    NumeroEtudiant = 12345
};

Console.WriteLine($"{etudiant.Nom} (n°{etudiant.NumeroEtudiant})");
Console.WriteLine($"Note : {etudiant.Note}/20 - Mention : {etudiant.Mention}");

// etudiant.NumeroEtudiant = 99999;  // Erreur : init-only après la construction

// Test de validation
try
{
    etudiant.Note = 25;  // Hors plage
}
catch (ArgumentOutOfRangeException ex)
{
    Console.WriteLine($"Erreur : {ex.Message}");
}
```

**Résultat attendu** :

```text
Alice Martin (n°12345)
Note : 16/20 - Mention : Très bien
Erreur : La note doit être entre 0 et 20. (Parameter 'value')
```

---

### Étape 5 : Membres statiques

```csharp
class Compteur
{
    // Champ statique : partagé entre toutes les instances
    private static int _totalInstances = 0;

    // Propriété statique : accessible sans créer d'instance
    public static int TotalInstances => _totalInstances;

    // Propriété d'instance : propre à chaque objet
    public int Numero { get; }
    public string Nom { get; }

    // Constructeur : incrémente le compteur statique
    public Compteur(string nom)
    {
        _totalInstances++;
        Numero = _totalInstances;
        Nom = nom;
    }

    // Méthode statique : appelée sur la classe, pas sur un objet
    public static void AfficherTotal()
    {
        Console.WriteLine($"Nombre total d'instances créées : {TotalInstances}");
    }

    // Méthode d'instance
    public void Afficher()
    {
        Console.WriteLine($"  Instance n°{Numero} : {Nom}");
    }
}

// Les méthodes statiques s'appellent sur la classe
Compteur.AfficherTotal();  // 0

// Créer des instances
Compteur a = new("Alpha");
Compteur b = new("Beta");
Compteur c = new("Gamma");

a.Afficher();
b.Afficher();
c.Afficher();

// Le compteur statique a été incrémenté par chaque constructeur
Compteur.AfficherTotal();  // 3
```

**Résultat attendu** :

```text
Nombre total d'instances créées : 0
  Instance n°1 : Alpha
  Instance n°2 : Beta
  Instance n°3 : Gamma
Nombre total d'instances créées : 3
```

---

### Étape 6 : Records

```csharp
// Déclarer un record : le compilateur génère Equals, GetHashCode, ToString
record Coordonnee(double Latitude, double Longitude);

// Record avec propriétés additionnelles
record Adresse(string Rue, string Ville, string CodePostal)
{
    // Propriété calculée ajoutée au record
    public string AdresseComplete => $"{Rue}, {CodePostal} {Ville}";
}

// Créer des instances de record
Coordonnee paris = new(48.8566, 2.3522);
Coordonnee lyon = new(45.7640, 4.8357);
Coordonnee parisCopie = new(48.8566, 2.3522);

// ToString() est généré automatiquement
Console.WriteLine($"Paris : {paris}");
Console.WriteLine($"Lyon : {lyon}");

// Equals() compare les valeurs (pas les références)
Console.WriteLine($"paris == parisCopie : {paris == parisCopie}");   // True
Console.WriteLine($"paris == lyon : {paris == lyon}");               // False

// Créer une copie modifiée avec "with"
Adresse adresse1 = new("12 Rue de la Paix", "Paris", "75002");
Adresse adresse2 = adresse1 with { Ville = "Lyon", CodePostal = "69001" };

Console.WriteLine($"\nAdresse 1 : {adresse1.AdresseComplete}");
Console.WriteLine($"Adresse 2 : {adresse2.AdresseComplete}");

// L'original n'est pas modifié (immuable)
Console.WriteLine($"Adresse 1 inchangée : {adresse1.Ville}");

// Déconstruction d'un record
var (lat, lon) = paris;
Console.WriteLine($"\nDéconstruction : lat={lat}, lon={lon}");
```

**Résultat attendu** :

```text
Paris : Coordonnee { Latitude = 48.8566, Longitude = 2.3522 }
Lyon : Coordonnee { Latitude = 45.764, Longitude = 4.8357 }
paris == parisCopie : True
paris == lyon : False

Adresse 1 : 12 Rue de la Paix, 75002 Paris
Adresse 2 : 12 Rue de la Paix, 69001 Lyon
Adresse 1 inchangée : Paris

Déconstruction : lat=48.8566, lon=2.3522
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `dotnet run` | Compiler et exécuter le projet |
| `dotnet build` | Compiler sans exécuter |

---

## Pièges Fréquents

### Piège 1 : Oublier d'initialiser les propriétés string

**Problème** : Les propriétés `string` non initialisées valent `null`, ce qui génère un avertissement de nullabilité.

```csharp
class Personne
{
    public string Nom { get; set; }  // Warning : peut être null
}
```

**Solution** : Initialiser avec une valeur par défaut ou le marquer nullable.

```csharp
class Personne
{
    public string Nom { get; set; } = "";      // Valeur par défaut
    public string? Surnom { get; set; }         // Explicitement nullable
}
```

---

### Piège 2 : Confondre `record` et `class`

**Problème** : Un `record` compare par valeur, une `class` compare par référence. Utiliser le mauvais type peut causer des bugs subtils.

```csharp
// Avec class : comparaison par référence
class PointClasse { public int X { get; set; } public int Y { get; set; } }
var p1 = new PointClasse { X = 1, Y = 2 };
var p2 = new PointClasse { X = 1, Y = 2 };
Console.WriteLine(p1 == p2);  // False (références différentes)

// Avec record : comparaison par valeur
record PointRecord(int X, int Y);
var r1 = new PointRecord(1, 2);
var r2 = new PointRecord(1, 2);
Console.WriteLine(r1 == r2);  // True (mêmes valeurs)
```

---

### Piège 3 : Modifier une propriété init-only

**Problème** : Les propriétés `init` ne sont modifiables que pendant l'initialisation de l'objet.

```csharp
class Config
{
    public string Cle { get; init; } = "";
}

var config = new Config { Cle = "abc" };
// config.Cle = "xyz";  // Erreur de compilation
```

**Solution** : Utiliser `set` si la propriété doit être modifiable après la construction, ou `with` sur un record pour créer une copie modifiée.

---

## Checklist de Validation

- [ ] Je sais créer une classe avec des propriétés automatiques
- [ ] Je sais écrire des constructeurs et les chaîner avec `this`
- [ ] Je comprends les modificateurs d'accès (`public`, `private`, `protected`)
- [ ] Je sais utiliser `private set` et `init` pour contrôler la modification
- [ ] Je sais créer des propriétés calculées (lecture seule)
- [ ] Je comprends la différence entre membres statiques et membres d'instance
- [ ] Je sais utiliser les records pour les objets de données immuables

---

## Exercice Pratique

**Énoncé** : Crée une classe `Bibliotheque` qui gère une collection de livres :

1. Crée un record `Livre` avec les propriétés : `Titre`, `Auteur`, `Annee`, `Isbn`
2. Crée une classe `Bibliotheque` avec :
   - Une liste privée de livres
   - Une méthode `AjouterLivre(Livre)` qui refuse les doublons (même ISBN)
   - Une méthode `RechercherParAuteur(string)` qui retourne les livres d'un auteur
   - Une propriété `NombreLivres` en lecture seule
   - Une méthode `AfficherCatalogue()` qui affiche tous les livres

**Indications** :

- Utilise un `record` pour `Livre` (comparaison par valeur automatique)
- Utilise `List<Livre>` pour stocker les livres
- Utilise LINQ `Any()` pour vérifier les doublons

**Résultat attendu** :

```text
Livre ajouté : Le Petit Prince
Livre ajouté : L'Étranger
Livre ajouté : Vol de nuit
Doublon refusé : Le Petit Prince (ISBN existant)

Livres de Saint-Exupéry :
  - Le Petit Prince (1943)
  - Vol de nuit (1931)

Catalogue (3 livres) :
  - Le Petit Prince par Saint-Exupéry (1943)
  - L'Étranger par Camus (1942)
  - Vol de nuit par Saint-Exupéry (1931)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```csharp
// Record pour représenter un livre
record Livre(string Titre, string Auteur, int Annee, string Isbn);

// Classe pour gérer la bibliothèque
class Bibliotheque
{
    // Liste privée de livres
    private readonly List<Livre> _livres = new();

    // Propriété en lecture seule
    public int NombreLivres => _livres.Count;

    // Ajouter un livre (refuse les doublons par ISBN)
    public bool AjouterLivre(Livre livre)
    {
        if (_livres.Any(l => l.Isbn == livre.Isbn))
        {
            Console.WriteLine($"Doublon refusé : {livre.Titre} (ISBN existant)");
            return false;
        }

        _livres.Add(livre);
        Console.WriteLine($"Livre ajouté : {livre.Titre}");
        return true;
    }

    // Rechercher les livres d'un auteur
    public List<Livre> RechercherParAuteur(string auteur)
    {
        return _livres
            .Where(l => l.Auteur.Contains(auteur, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }

    // Afficher le catalogue complet
    public void AfficherCatalogue()
    {
        Console.WriteLine($"\nCatalogue ({NombreLivres} livres) :");
        foreach (Livre livre in _livres)
        {
            Console.WriteLine($"  - {livre.Titre} par {livre.Auteur} ({livre.Annee})");
        }
    }
}

// Programme principal
Bibliotheque biblio = new();

biblio.AjouterLivre(new Livre("Le Petit Prince", "Saint-Exupéry", 1943, "978-2-07-040850-4"));
biblio.AjouterLivre(new Livre("L'Étranger", "Camus", 1942, "978-2-07-036024-5"));
biblio.AjouterLivre(new Livre("Vol de nuit", "Saint-Exupéry", 1931, "978-2-07-036068-9"));
biblio.AjouterLivre(new Livre("Le Petit Prince", "Saint-Exupéry", 1943, "978-2-07-040850-4"));

// Recherche par auteur
List<Livre> livresSaintEx = biblio.RechercherParAuteur("Saint-Exupéry");
Console.WriteLine($"\nLivres de Saint-Exupéry :");
foreach (Livre livre in livresSaintEx)
{
    Console.WriteLine($"  - {livre.Titre} ({livre.Annee})");
}

// Catalogue complet
biblio.AfficherCatalogue();
```

---

## Navigation

← Fiche précédente : **[Fonctions et méthodes](04-fonctions-methodes.md)**

→ Fiche suivante : **[Héritage et interfaces](06-heritage-interfaces.md)**
