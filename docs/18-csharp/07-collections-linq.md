---
tags:
  - C#
  - Intermédiaire
  - Pratique
description: "Maîtriser les collections C# (List, Dictionary, IEnumerable) et les requêtes LINQ (Where, Select, OrderBy, GroupBy)."
estimated_time: "75 min"
fiche_number: 7
total_fiches: 10
cursus: "C#"
---

# 07 - Collections et LINQ

> **En bref** : Apprendre à utiliser les collections génériques et à interroger des données avec LINQ pour filtrer, trier et transformer des ensembles de données. Lecture estimée : 75 min.

## Prérequis

- Avoir terminé la fiche **[06 - Héritage et interfaces](06-heritage-interfaces.md)**
- Savoir créer des classes et utiliser les interfaces
- Connaître les boucles `foreach`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les collections génériques (`List<T>`, `Dictionary<TKey, TValue>`), parcourir des données avec `IEnumerable<T>` et écrire des requêtes LINQ pour filtrer, trier, projeter et grouper des données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une collection générique ?

**Définition** : Une collection générique est un conteneur typé qui stocke un ensemble d'éléments du même type. Le `<T>` (paramètre de type) garantit que seuls des éléments du bon type peuvent être ajoutés.

**Le problème que les collections génériques résolvent** :

Sans collections génériques, voici les problèmes rencontrés :

1. **Pas de vérification de type** : Les anciennes collections (`ArrayList`) stockent des `object`. On peut mélanger des entiers, des chaînes et des dates dans la même liste, ce qui provoque des erreurs à l'exécution.
2. **Performance dégradée** : Stocker un `int` dans un `object` nécessite un "boxing" (conversion coûteuse en mémoire et en temps).
3. **Casts manuels** : À chaque lecture, il faut convertir l'élément de `object` vers le bon type.

**Comment les collections génériques résolvent ces problèmes** :

| Problème | Solution apportée par les génériques |
| -------- | ------------------------------------ |
| Pas de vérification de type | `List<int>` n'accepte que des `int` - vérifié à la compilation |
| Performance dégradée | Pas de boxing/unboxing pour les types valeur |
| Casts manuels | Les éléments sortent déjà typés |

**Analogie concrète** : Les collections génériques fonctionnent comme des classeurs étiquetés. Un classeur étiqueté "Factures" (`List<Facture>`) n'accepte que des factures. Tu ne peux pas y glisser accidentellement une fiche de paie.

**Les collections principales** :

| Collection | Description | Équivalent Java |
| ---------- | ----------- | --------------- |
| `List<T>` | Liste ordonnée, taille dynamique | `ArrayList<T>` |
| `Dictionary<TKey, TValue>` | Paires clé-valeur | `HashMap<K, V>` |
| `HashSet<T>` | Ensemble sans doublons | `HashSet<T>` |
| `Queue<T>` | File d'attente (FIFO) | `Queue<T>` |
| `Stack<T>` | Pile (LIFO) | `Stack<T>` |

---

### Qu'est-ce que LINQ ?

**Définition** : LINQ (Language Integrated Query) est un ensemble de méthodes intégrées au langage C# qui permettent d'interroger n'importe quelle collection de données avec une syntaxe uniforme. LINQ fonctionne sur les listes, les tableaux, les fichiers XML, les bases de données et bien plus.

**Le problème que LINQ résout** :

Sans LINQ, voici les problèmes rencontrés :

1. **Boucles complexes** : Filtrer, trier et transformer des données nécessite des boucles imbriquées avec des variables temporaires.
2. **Code non réutilisable** : Chaque opération sur les données est codée à la main, sans pattern standard.
3. **Langages différents** : Interroger une base de données (SQL), un fichier XML (XPath) et une liste (boucle) utilise trois syntaxes différentes.

**Comment LINQ résout ces problèmes** :

| Problème | Solution apportée par LINQ |
| -------- | -------------------------- |
| Boucles complexes | `Where()`, `Select()`, `OrderBy()` remplacent les boucles |
| Code non réutilisable | Les opérations sont chaînées et composables |
| Langages différents | Une syntaxe unique pour toutes les sources de données |

**Analogie concrète** : LINQ fonctionne comme un tableur Excel. Tu as un tableau de données (collection), et tu appliques des filtres (Where), des tris (OrderBy) et des formules (Select) pour obtenir exactement les données que tu veux, sans manipuler les lignes une par une.

**Ce que LINQ n'est PAS** :

- LINQ n'est pas SQL. Même si la syntaxe ressemble à SQL, LINQ est du C# compilé. Il fonctionne sur des objets en mémoire (LINQ to Objects) et pas uniquement sur des bases de données.
- LINQ n'est pas lent. Pour les collections en mémoire, LINQ est optimisé et l'évaluation est paresseuse (lazy) : les données ne sont traitées que quand on les lit.

---

### Qu'est-ce que IEnumerable ?

**Définition** : `IEnumerable<T>` est l'interface de base de toutes les collections en C#. Elle représente une séquence d'éléments qu'on peut parcourir un par un. C'est le type de retour de toutes les opérations LINQ.

**Le problème que IEnumerable résout** :

Sans `IEnumerable<T>`, voici les problèmes rencontrés :

1. **Couplage au type de collection** : Une méthode qui prend un `List<int>` ne fonctionne pas avec un `int[]` ou un `HashSet<int>`.
2. **Évaluation immédiate** : Toutes les données sont chargées en mémoire immédiatement, même si on n'en a besoin que d'une partie.

**Comment IEnumerable résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Couplage au type | `IEnumerable<T>` est compatible avec tous les types de collection |
| Évaluation immédiate | L'évaluation paresseuse ne traite les éléments que quand on les lit |

---

## Étapes Pratiques

### Étape 1 : List - la collection de base

```bash
dotnet new console -n collections-demo
cd collections-demo
```

```csharp
// Créer une liste typée
List<string> prenoms = new() { "Alice", "Bob", "Charlie", "Diana" };

// Ajouter des éléments
prenoms.Add("Eve");
prenoms.AddRange(new[] { "Frank", "Grace" });

// Accéder par index
Console.WriteLine($"Premier : {prenoms[0]}");
Console.WriteLine($"Dernier : {prenoms[^1]}");  // ^1 = index depuis la fin

// Propriétés utiles
Console.WriteLine($"Nombre d'éléments : {prenoms.Count}");
Console.WriteLine($"Contient 'Bob' : {prenoms.Contains("Bob")}");
Console.WriteLine($"Index de 'Charlie' : {prenoms.IndexOf("Charlie")}");

// Supprimer des éléments
prenoms.Remove("Bob");          // Supprime par valeur
prenoms.RemoveAt(0);            // Supprime par index (Alice)

Console.WriteLine("\nListe après suppressions :");
foreach (string prenom in prenoms)
{
    Console.WriteLine($"  - {prenom}");
}

// Trier
prenoms.Sort();
Console.WriteLine("\nListe triée :");
foreach (string prenom in prenoms)
{
    Console.WriteLine($"  - {prenom}");
}
```

**Résultat attendu** :

```text
Premier : Alice
Dernier : Grace
Nombre d'éléments : 7
Contient 'Bob' : True
Index de 'Charlie' : 2
Liste après suppressions :
  - Charlie
  - Diana
  - Eve
  - Frank
  - Grace

Liste triée :
  - Charlie
  - Diana
  - Eve
  - Frank
  - Grace
```

---

### Étape 2 : Dictionary - paires clé-valeur

```csharp
// Créer un dictionnaire
Dictionary<string, int> ages = new()
{
    ["Alice"] = 25,
    ["Bob"] = 30,
    ["Charlie"] = 22
};

// Ajouter une entrée
ages["Diana"] = 28;
ages.Add("Eve", 35);  // Lève une exception si la clé existe déjà

// Lire une valeur
Console.WriteLine($"Âge d'Alice : {ages["Alice"]}");

// Lecture sécurisée avec TryGetValue
if (ages.TryGetValue("Frank", out int ageFrank))
{
    Console.WriteLine($"Âge de Frank : {ageFrank}");
}
else
{
    Console.WriteLine("Frank n'est pas dans le dictionnaire.");
}

// Vérifier l'existence d'une clé
Console.WriteLine($"Bob existe : {ages.ContainsKey("Bob")}");
Console.WriteLine($"Nombre d'entrées : {ages.Count}");

// Parcourir un dictionnaire
Console.WriteLine("\nTous les âges :");
foreach (KeyValuePair<string, int> paire in ages)
{
    Console.WriteLine($"  {paire.Key} : {paire.Value} ans");
}

// Syntaxe de déconstruction dans le foreach
Console.WriteLine("\nAvec déconstruction :");
foreach (var (nom, age) in ages)
{
    Console.WriteLine($"  {nom} a {age} ans");
}

// Supprimer une entrée
ages.Remove("Charlie");
Console.WriteLine($"\nAprès suppression de Charlie : {ages.Count} entrées");
```

**Résultat attendu** :

```text
Âge d'Alice : 25
Frank n'est pas dans le dictionnaire.
Bob existe : True
Nombre d'entrées : 5

Tous les âges :
  Alice : 25 ans
  Bob : 30 ans
  Charlie : 22 ans
  Diana : 28 ans
  Eve : 35 ans

Avec déconstruction :
  Alice a 25 ans
  Bob a 30 ans
  Charlie a 22 ans
  Diana a 28 ans
  Eve a 35 ans

Après suppression de Charlie : 4 entrées
```

---

### Étape 3 : LINQ - Filtrer et trier

```csharp
// Données de départ
record Produit(string Nom, string Categorie, decimal Prix, int Stock);

List<Produit> produits = new()
{
    new("Clavier", "Informatique", 89.99m, 15),
    new("Souris", "Informatique", 45.50m, 30),
    new("Écran 27\"", "Informatique", 349.99m, 5),
    new("Cahier A4", "Bureau", 3.50m, 100),
    new("Stylo", "Bureau", 1.20m, 200),
    new("Casque audio", "Audio", 129.99m, 12),
    new("Enceinte BT", "Audio", 79.99m, 8),
    new("Webcam", "Informatique", 59.99m, 0)
};

// --- Where : filtrer ---
var produitsCher = produits.Where(p => p.Prix > 50);
Console.WriteLine("Produits > 50 € :");
foreach (var p in produitsCher)
{
    Console.WriteLine($"  {p.Nom} : {p.Prix} €");
}

// --- OrderBy / OrderByDescending : trier ---
var parPrix = produits.OrderBy(p => p.Prix);
Console.WriteLine("\nPar prix croissant :");
foreach (var p in parPrix)
{
    Console.WriteLine($"  {p.Nom} : {p.Prix} €");
}

// --- First, Last, Single ---
var plusCher = produits.OrderByDescending(p => p.Prix).First();
Console.WriteLine($"\nPlus cher : {plusCher.Nom} ({plusCher.Prix} €)");

var moinsCher = produits.MinBy(p => p.Prix);
Console.WriteLine($"Moins cher : {moinsCher?.Nom} ({moinsCher?.Prix} €)");

// --- Any et All ---
bool aDesRupturesStock = produits.Any(p => p.Stock == 0);
Console.WriteLine($"\nRuptures de stock : {aDesRupturesStock}");

bool tousEnStock = produits.All(p => p.Stock > 0);
Console.WriteLine($"Tous en stock : {tousEnStock}");

// --- Count ---
int nbInfo = produits.Count(p => p.Categorie == "Informatique");
Console.WriteLine($"Produits informatique : {nbInfo}");
```

**Résultat attendu** :

```text
Produits > 50 € :
  Clavier : 89.99 €
  Écran 27" : 349.99 €
  Casque audio : 129.99 €
  Enceinte BT : 79.99 €
  Webcam : 59.99 €

Par prix croissant :
  Stylo : 1.20 €
  Cahier A4 : 3.50 €
  Souris : 45.50 €
  Webcam : 59.99 €
  Enceinte BT : 79.99 €
  Clavier : 89.99 €
  Casque audio : 129.99 €
  Écran 27" : 349.99 €

Plus cher : Écran 27" (349.99 €)
Moins cher : Stylo (1.20 €)

Ruptures de stock : True
Tous en stock : False
Produits informatique : 4
```

---

### Étape 4 : LINQ - Projeter et transformer avec Select

```csharp
// Réutiliser les données de l'étape précédente
record Produit(string Nom, string Categorie, decimal Prix, int Stock);

List<Produit> produits = new()
{
    new("Clavier", "Informatique", 89.99m, 15),
    new("Souris", "Informatique", 45.50m, 30),
    new("Écran 27\"", "Informatique", 349.99m, 5),
    new("Cahier A4", "Bureau", 3.50m, 100),
    new("Stylo", "Bureau", 1.20m, 200),
    new("Casque audio", "Audio", 129.99m, 12),
};

// --- Select : transformer chaque élément ---
var descriptions = produits.Select(p => $"{p.Nom} ({p.Prix} €)");
Console.WriteLine("Descriptions :");
foreach (string desc in descriptions)
{
    Console.WriteLine($"  {desc}");
}

// --- Select avec un type anonyme ---
var resume = produits.Select(p => new
{
    p.Nom,
    PrixTTC = p.Prix * 1.20m,
    Disponible = p.Stock > 0
});

Console.WriteLine("\nRésumé avec TVA :");
foreach (var item in resume)
{
    string dispo = item.Disponible ? "En stock" : "Rupture";
    Console.WriteLine($"  {item.Nom} : {item.PrixTTC:F2} € TTC ({dispo})");
}

// --- Chaîner les opérations ---
var topProduits = produits
    .Where(p => p.Stock > 0)                          // Filtrer : en stock uniquement
    .OrderByDescending(p => p.Prix)                    // Trier : du plus cher au moins cher
    .Take(3)                                           // Limiter : 3 premiers
    .Select(p => $"{p.Nom} - {p.Prix} €");             // Projeter : format texte

Console.WriteLine("\nTop 3 des produits les plus chers en stock :");
foreach (string produit in topProduits)
{
    Console.WriteLine($"  {produit}");
}

// --- Agrégations ---
decimal totalStock = produits.Sum(p => p.Prix * p.Stock);
decimal prixMoyen = produits.Average(p => p.Prix);

Console.WriteLine($"\nValeur totale du stock : {totalStock:F2} €");
Console.WriteLine($"Prix moyen : {prixMoyen:F2} €");
```

**Résultat attendu** :

```text
Descriptions :
  Clavier (89.99 €)
  Souris (45.50 €)
  Écran 27" (349.99 €)
  Cahier A4 (3.50 €)
  Stylo (1.20 €)
  Casque audio (129.99 €)

Résumé avec TVA :
  Clavier : 107.99 € TTC (En stock)
  Souris : 54.60 € TTC (En stock)
  Écran 27" : 419.99 € TTC (En stock)
  Cahier A4 : 4.20 € TTC (En stock)
  Stylo : 1.44 € TTC (En stock)
  Casque audio : 155.99 € TTC (En stock)

Top 3 des produits les plus chers en stock :
  Écran 27" - 349.99 €
  Casque audio - 129.99 €
  Clavier - 89.99 €

Valeur totale du stock : 7254.60 €
Prix moyen : 95.02 €
```

---

### Étape 5 : LINQ - GroupBy

```csharp
record Produit(string Nom, string Categorie, decimal Prix, int Stock);

List<Produit> produits = new()
{
    new("Clavier", "Informatique", 89.99m, 15),
    new("Souris", "Informatique", 45.50m, 30),
    new("Écran 27\"", "Informatique", 349.99m, 5),
    new("Cahier A4", "Bureau", 3.50m, 100),
    new("Stylo", "Bureau", 1.20m, 200),
    new("Casque audio", "Audio", 129.99m, 12),
    new("Enceinte BT", "Audio", 79.99m, 8),
};

// --- GroupBy : regrouper par catégorie ---
var parCategorie = produits.GroupBy(p => p.Categorie);

Console.WriteLine("Produits par catégorie :");
foreach (var groupe in parCategorie)
{
    Console.WriteLine($"\n  {groupe.Key} ({groupe.Count()} produits) :");
    foreach (var produit in groupe)
    {
        Console.WriteLine($"    - {produit.Nom} : {produit.Prix} €");
    }
    Console.WriteLine($"    Total : {groupe.Sum(p => p.Prix):F2} €");
}

// --- ToDictionary : convertir un résultat LINQ en dictionnaire ---
Dictionary<string, decimal> prixParNom = produits.ToDictionary(
    p => p.Nom,       // Clé
    p => p.Prix        // Valeur
);

Console.WriteLine("\nDictionnaire des prix :");
foreach (var (nom, prix) in prixParNom)
{
    Console.WriteLine($"  {nom} = {prix} €");
}

// --- ToList : matérialiser un résultat LINQ ---
List<string> nomsEnStock = produits
    .Where(p => p.Stock > 0)
    .Select(p => p.Nom)
    .ToList();  // Force l'évaluation et crée une List<string>

Console.WriteLine($"\nProduits en stock : {string.Join(", ", nomsEnStock)}");
```

**Résultat attendu** :

```text
Produits par catégorie :

  Informatique (3 produits) :
    - Clavier : 89.99 €
    - Souris : 45.50 €
    - Écran 27" : 349.99 €
    Total : 485.48 €

  Bureau (2 produits) :
    - Cahier A4 : 3.50 €
    - Stylo : 1.20 €
    Total : 4.70 €

  Audio (2 produits) :
    - Casque audio : 129.99 €
    - Enceinte BT : 79.99 €
    Total : 209.98 €

Dictionnaire des prix :
  Clavier = 89.99 €
  Souris = 45.50 €
  Écran 27" = 349.99 €
  Cahier A4 = 3.50 €
  Stylo = 1.20 €
  Casque audio = 129.99 €
  Enceinte BT = 79.99 €

Produits en stock : Clavier, Souris, Écran 27", Cahier A4, Stylo, Casque audio, Enceinte BT
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `dotnet run` | Compiler et exécuter le projet |
| `dotnet build` | Compiler sans exécuter |

---

## Pièges Fréquents

### Piège 1 : Évaluation paresseuse de LINQ

**Problème** : Les opérations LINQ ne sont pas exécutées immédiatement. Elles sont évaluées au moment où on parcourt le résultat. Si la source change entre-temps, le résultat change aussi.

```csharp
List<int> nombres = new() { 1, 2, 3, 4, 5 };
var pairs = nombres.Where(n => n % 2 == 0);

nombres.Add(6);  // Ajouté APRÈS la requête LINQ

// Le résultat inclut 6 car l'évaluation est paresseuse
foreach (int n in pairs)
{
    Console.Write($"{n} ");  // 2 4 6
}
```

**Solution** : Utiliser `.ToList()` ou `.ToArray()` pour matérialiser le résultat immédiatement.

```csharp
var pairs = nombres.Where(n => n % 2 == 0).ToList();  // Évalué maintenant
nombres.Add(6);  // N'affecte plus le résultat
```

---

### Piège 2 : Accéder à une clé inexistante dans un Dictionary

**Problème** : `dict["clé"]` lève une `KeyNotFoundException` si la clé n'existe pas.

```csharp
Dictionary<string, int> scores = new() { ["Alice"] = 10 };
// int s = scores["Bob"];  // KeyNotFoundException !
```

**Solution** : Utiliser `TryGetValue()` ou `GetValueOrDefault()`.

```csharp
int score = scores.GetValueOrDefault("Bob", 0);  // 0 si absent
```

---

### Piège 3 : Confondre Select et Where

**Problème** : `Where` filtre les éléments (garde/rejette), `Select` transforme les éléments (change la forme).

```csharp
int[] nombres = { 1, 2, 3, 4, 5 };

// Where : filtre (garde uniquement les pairs)
var pairs = nombres.Where(n => n % 2 == 0);    // { 2, 4 }

// Select : transforme (multiplie chaque élément par 2)
var doubles = nombres.Select(n => n * 2);       // { 2, 4, 6, 8, 10 }
```

---

## Checklist de Validation

- [ ] Je sais utiliser `List<T>` pour stocker et manipuler des éléments
- [ ] Je sais utiliser `Dictionary<TKey, TValue>` pour les paires clé-valeur
- [ ] Je comprends la différence entre `IEnumerable<T>` et `List<T>`
- [ ] Je sais filtrer avec `Where()` et trier avec `OrderBy()`
- [ ] Je sais transformer avec `Select()` et regrouper avec `GroupBy()`
- [ ] Je sais utiliser les agrégations (`Sum`, `Average`, `Count`, `Min`, `Max`)
- [ ] Je comprends l'évaluation paresseuse et quand utiliser `ToList()`

---

## Exercice Pratique

**Énoncé** : Crée un programme de gestion d'étudiants qui utilise LINQ :

1. Crée un record `Etudiant` avec : `Nom`, `Filiere`, `Moyenne`
2. Crée une liste de 8 étudiants dans 3 filières différentes
3. Affiche les étudiants qui ont la moyenne (>= 10), triés par moyenne décroissante
4. Affiche la moyenne par filière
5. Affiche le major de chaque filière (meilleure moyenne)
6. Affiche le nombre d'étudiants admis et recalés

**Indications** :

- Utilise `GroupBy` pour regrouper par filière
- Utilise `OrderByDescending` + `First()` pour trouver le major
- Utilise `Count` avec un prédicat pour les admis/recalés

**Résultat attendu** (les données exactes dépendent de ta liste) :

```text
Admis (moyenne >= 10) :
  1. Alice - 17.5 (Informatique)
  2. Bob - 15.0 (Mathématiques)
  ...

Moyenne par filière :
  Informatique : 13.25
  Mathématiques : 12.00
  ...

Major par filière :
  Informatique : Alice (17.5)
  ...

Résultat : 6 admis, 2 recalés
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```csharp
record Etudiant(string Nom, string Filiere, double Moyenne);

List<Etudiant> etudiants = new()
{
    new("Alice", "Informatique", 17.5),
    new("Bob", "Mathématiques", 15.0),
    new("Charlie", "Informatique", 12.0),
    new("Diana", "Physique", 14.5),
    new("Eve", "Mathématiques", 8.5),
    new("Frank", "Physique", 11.0),
    new("Grace", "Informatique", 9.0),
    new("Henri", "Mathématiques", 16.0),
};

// 1. Admis triés par moyenne décroissante
var admis = etudiants
    .Where(e => e.Moyenne >= 10)
    .OrderByDescending(e => e.Moyenne)
    .ToList();

Console.WriteLine("Admis (moyenne >= 10) :");
for (int i = 0; i < admis.Count; i++)
{
    Console.WriteLine($"  {i + 1}. {admis[i].Nom} - {admis[i].Moyenne:F1} ({admis[i].Filiere})");
}

// 2. Moyenne par filière
Console.WriteLine("\nMoyenne par filière :");
foreach (var groupe in etudiants.GroupBy(e => e.Filiere))
{
    Console.WriteLine($"  {groupe.Key} : {groupe.Average(e => e.Moyenne):F2}");
}

// 3. Major par filière
Console.WriteLine("\nMajor par filière :");
foreach (var groupe in etudiants.GroupBy(e => e.Filiere))
{
    var major = groupe.OrderByDescending(e => e.Moyenne).First();
    Console.WriteLine($"  {groupe.Key} : {major.Nom} ({major.Moyenne:F1})");
}

// 4. Bilan admis/recalés
int nbAdmis = etudiants.Count(e => e.Moyenne >= 10);
int nbRecales = etudiants.Count(e => e.Moyenne < 10);
Console.WriteLine($"\nRésultat : {nbAdmis} admis, {nbRecales} recalés");
```

---

## Navigation

← Fiche précédente : **[Héritage et interfaces](06-heritage-interfaces.md)**

→ Fiche suivante : **[Gestion des erreurs](08-gestion-erreurs.md)**
