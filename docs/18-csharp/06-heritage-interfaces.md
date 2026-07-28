---
tags:
  - C#
  - Intermédiaire
  - Concept
description: "Maîtriser l'héritage, les classes abstraites, les interfaces, le polymorphisme et les classes sealed en C#."
estimated_time: "75 min"
fiche_number: 6
total_fiches: 10
cursus: "C#"
---

# 06 - Héritage et interfaces

> **En bref** : Comprendre l'héritage, les classes abstraites, les interfaces, le polymorphisme et les classes sealed pour structurer ton code C#. Lecture estimée : 75 min.

## Prérequis

- Avoir terminé la fiche **[05 - Classes et objets](05-classes-objets.md)**
- Connaître les classes, propriétés et constructeurs en C#
- Connaître les concepts d'héritage et d'interfaces du [cursus Java](../epitech/01-java/index.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des hiérarchies de classes avec l'héritage, définir des contrats avec les interfaces, utiliser le polymorphisme et protéger des classes avec `sealed`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'héritage ?

**Définition** : L'héritage permet à une classe (classe dérivée ou enfant) de récupérer les propriétés et méthodes d'une autre classe (classe de base ou parent). La classe enfant peut ajouter de nouvelles fonctionnalités ou modifier le comportement hérité.

**Le problème que l'héritage résout** :

Sans héritage, voici les problèmes rencontrés :

1. **Duplication de code** : Des classes similaires (Chien, Chat, Oiseau) répètent les mêmes propriétés (Nom, Age) et méthodes (Manger, Dormir).
2. **Incohérence** : Corriger un bug dans "Manger" nécessite de modifier chaque classe individuellement.
3. **Pas de hiérarchie** : Impossible de traiter un ensemble d'objets similaires de manière uniforme.

**Comment l'héritage résout ces problèmes** :

| Problème | Solution apportée par l'héritage |
| -------- | -------------------------------- |
| Duplication de code | Le code commun est dans la classe de base, hérité par les enfants |
| Incohérence | Une seule correction dans la classe de base s'applique partout |
| Pas de hiérarchie | Les classes enfants peuvent être traitées comme des instances de la classe parent |

**Analogie concrète** : L'héritage fonctionne comme un arbre généalogique. Un enfant hérite des caractéristiques de ses parents (yeux, cheveux) mais a aussi ses propres traits. En C#, une classe `Chien` hérite de `Animal` (Nom, Age) et ajoute ses propres propriétés (Race).

**Ce que l'héritage n'est PAS** :

- L'héritage n'est pas de la copie. La classe enfant ne copie pas le code du parent - elle y a accès dynamiquement.
- L'héritage n'est pas toujours la bonne solution. Quand la relation est "utilise" plutôt que "est un", la composition (avoir un objet comme propriété) est préférable.

**Comparaison C# vs Java** :

| C# | Java |
| -- | ---- |
| `:` pour hériter | `extends` pour hériter |
| `virtual` + `override` obligatoires | `@Override` optionnel |
| `sealed` pour empêcher l'héritage | `final` pour empêcher l'héritage |
| `base` pour appeler le parent | `super` pour appeler le parent |

---

### Qu'est-ce qu'une interface ?

**Définition** : Une interface est un contrat qui définit un ensemble de méthodes et propriétés qu'une classe doit implémenter. L'interface dit "quoi faire" mais pas "comment le faire".

**Le problème que les interfaces résolvent** :

Sans interfaces, voici les problèmes rencontrés :

1. **Héritage unique** : C# ne permet qu'un seul parent par classe. Impossible de combiner les comportements de plusieurs classes.
2. **Couplage fort** : Le code dépend d'implémentations concrètes, rendant les tests et les changements difficiles.

**Comment les interfaces résolvent ces problèmes** :

| Problème | Solution apportée par les interfaces |
| -------- | ------------------------------------ |
| Héritage unique | Une classe peut implémenter plusieurs interfaces |
| Couplage fort | Le code dépend du contrat (interface), pas de l'implémentation |

**Analogie concrète** : Une interface fonctionne comme une prise électrique. La norme (interface) définit la forme de la prise (les méthodes). Tout appareil (classe) qui respecte cette norme peut être branché (implémente l'interface), quel que soit son fonctionnement interne.

**Ce qu'une interface n'est PAS** :

- Une interface n'est pas une classe abstraite. Une interface ne peut pas avoir d'état (champs) ni de constructeur. Depuis C# 8, elle peut avoir des implémentations par défaut, mais c'est une exception.
- Une interface n'est pas de l'héritage. On dit qu'une classe "implémente" une interface, elle ne l'hérite pas.

---

### Qu'est-ce que sealed ?

**Définition** : Le mot-clé `sealed` empêche une classe d'être héritée. Aucune classe ne peut dériver d'une classe sealed.

**Le problème que sealed résout** :

Sans sealed, voici les problèmes rencontrés :

1. **Héritage abusif** : Des développeurs héritent de classes qui n'ont pas été conçues pour l'héritage, ce qui peut casser le comportement.
2. **Performance** : Les méthodes virtuelles sont légèrement plus lentes car le runtime doit déterminer quelle version appeler.

**Comment sealed résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Héritage abusif | `sealed` interdit explicitement l'héritage |
| Performance | Le compilateur peut optimiser les appels de méthode sur les classes sealed |

**Analogie concrète** : `sealed` fonctionne comme un coffre-fort verrouillé. Le contenu est utilisable tel quel, mais personne ne peut le modifier ou y ajouter quoi que ce soit.

---

## Étapes Pratiques

### Étape 1 : Héritage de base

```bash
dotnet new console -n heritage-demo
cd heritage-demo
```

```csharp
// Classe de base (parent)
class Animal
{
    public string Nom { get; set; }
    public int Age { get; set; }

    public Animal(string nom, int age)
    {
        Nom = nom;
        Age = age;
    }

    // Le mot-clé virtual autorise les classes enfants à redéfinir cette méthode
    public virtual string Crier()
    {
        return "...";
    }

    public void SePresenter()
    {
        Console.WriteLine($"{Nom} ({Age} ans) dit : {Crier()}");
    }
}

// Classe dérivée (enfant) - utilise : pour hériter
class Chien : Animal
{
    public string Race { get; set; }

    // Appeler le constructeur parent avec base()
    public Chien(string nom, int age, string race) : base(nom, age)
    {
        Race = race;
    }

    // Redéfinir le comportement du parent avec override
    public override string Crier()
    {
        return "Wouf !";
    }

    // Méthode propre au chien
    public void Rapporter()
    {
        Console.WriteLine($"{Nom} rapporte la balle !");
    }
}

// Autre classe dérivée
class Chat : Animal
{
    public bool EstInterieur { get; set; }

    public Chat(string nom, int age, bool estInterieur) : base(nom, age)
    {
        EstInterieur = estInterieur;
    }

    public override string Crier()
    {
        return "Miaou !";
    }
}

// Utilisation
Chien rex = new("Rex", 5, "Berger Allemand");
Chat minou = new("Minou", 3, true);

rex.SePresenter();    // Méthode héritée, utilise le Crier() du chien
minou.SePresenter();  // Méthode héritée, utilise le Crier() du chat

rex.Rapporter();      // Méthode propre au chien
// minou.Rapporter(); // Erreur : Rapporter n'existe pas pour Chat

// Polymorphisme : traiter les objets comme des Animal
Animal[] animaux = { rex, minou };
Console.WriteLine("\nTous les animaux :");
foreach (Animal animal in animaux)
{
    animal.SePresenter();  // Appelle le bon Crier() selon le type réel
}
```

**Résultat attendu** :

```text
Rex (5 ans) dit : Wouf !
Minou (3 ans) dit : Miaou !
Rex rapporte la balle !

Tous les animaux :
Rex (5 ans) dit : Wouf !
Minou (3 ans) dit : Miaou !
```

---

### Étape 2 : Classes abstraites

```csharp
// Classe abstraite : ne peut pas être instanciée directement
abstract class Forme
{
    public string Couleur { get; set; }

    protected Forme(string couleur)
    {
        Couleur = couleur;
    }

    // Méthode abstraite : pas de corps, les enfants doivent l'implémenter
    public abstract double CalculerAire();
    public abstract double CalculerPerimetre();

    // Méthode concrète : héritée telle quelle
    public void Afficher()
    {
        Console.WriteLine($"{GetType().Name} ({Couleur})");
        Console.WriteLine($"  Aire : {CalculerAire():F2}");
        Console.WriteLine($"  Périmètre : {CalculerPerimetre():F2}");
    }
}

// Classe concrète qui implémente les méthodes abstraites
class Cercle : Forme
{
    public double Rayon { get; set; }

    public Cercle(double rayon, string couleur) : base(couleur)
    {
        Rayon = rayon;
    }

    public override double CalculerAire() => Math.PI * Rayon * Rayon;
    public override double CalculerPerimetre() => 2 * Math.PI * Rayon;
}

class Rectangle : Forme
{
    public double Largeur { get; set; }
    public double Hauteur { get; set; }

    public Rectangle(double largeur, double hauteur, string couleur) : base(couleur)
    {
        Largeur = largeur;
        Hauteur = hauteur;
    }

    public override double CalculerAire() => Largeur * Hauteur;
    public override double CalculerPerimetre() => 2 * (Largeur + Hauteur);
}

// Forme forme = new Forme("rouge");  // Erreur : classe abstraite non instanciable

Forme[] formes = {
    new Cercle(5, "rouge"),
    new Rectangle(4, 6, "bleu"),
    new Cercle(3, "vert")
};

foreach (Forme forme in formes)
{
    forme.Afficher();
    Console.WriteLine();
}
```

**Résultat attendu** :

```text
Cercle (rouge)
  Aire : 78.54
  Périmètre : 31.42

Rectangle (bleu)
  Aire : 24.00
  Périmètre : 20.00

Cercle (vert)
  Aire : 28.27
  Périmètre : 18.85
```

---

### Étape 3 : Interfaces

```csharp
// Définir des interfaces (contrats)
interface IDeplacable
{
    void Deplacer(double x, double y);
    (double X, double Y) Position { get; }
}

interface IRedimensionnable
{
    void Redimensionner(double facteur);
}

// Une classe peut implémenter plusieurs interfaces
class CarreInteractif : IDeplacable, IRedimensionnable
{
    public double Cote { get; private set; }
    public (double X, double Y) Position { get; private set; }

    public CarreInteractif(double cote, double x = 0, double y = 0)
    {
        Cote = cote;
        Position = (x, y);
    }

    // Implémentation de IDeplacable
    public void Deplacer(double x, double y)
    {
        Position = (Position.X + x, Position.Y + y);
        Console.WriteLine($"Carré déplacé en ({Position.X}, {Position.Y})");
    }

    // Implémentation de IRedimensionnable
    public void Redimensionner(double facteur)
    {
        Cote *= facteur;
        Console.WriteLine($"Carré redimensionné : côté = {Cote:F1}");
    }

    public void Afficher()
    {
        Console.WriteLine($"Carré : côté={Cote:F1}, position=({Position.X}, {Position.Y})");
    }
}

class CercleInteractif : IDeplacable
{
    public double Rayon { get; set; }
    public (double X, double Y) Position { get; private set; }

    public CercleInteractif(double rayon, double x = 0, double y = 0)
    {
        Rayon = rayon;
        Position = (x, y);
    }

    public void Deplacer(double x, double y)
    {
        Position = (Position.X + x, Position.Y + y);
        Console.WriteLine($"Cercle déplacé en ({Position.X}, {Position.Y})");
    }
}

// Utilisation
CarreInteractif carre = new(10, 0, 0);
carre.Afficher();
carre.Deplacer(5, 3);
carre.Redimensionner(1.5);
carre.Afficher();

Console.WriteLine();

// Utiliser l'interface comme type : polymorphisme
IDeplacable[] elements = { carre, new CercleInteractif(5, 10, 10) };

Console.WriteLine("Déplacer tous les éléments :");
foreach (IDeplacable element in elements)
{
    element.Deplacer(1, 1);
}
```

**Résultat attendu** :

```text
Carré : côté=10.0, position=(0, 0)
Carré déplacé en (5, 3)
Carré redimensionné : côté = 15.0
Carré : côté=15.0, position=(5, 3)

Déplacer tous les éléments :
Carré déplacé en (6, 4)
Cercle déplacé en (11, 11)
```

---

### Étape 4 : Pattern matching avec les types (is et as)

```csharp
// Hiérarchie de classes
abstract class Vehicule
{
    public string Marque { get; set; } = "";
}

class Voiture : Vehicule
{
    public int NombrePortes { get; set; }
}

class Moto : Vehicule
{
    public int Cylindree { get; set; }
}

class Camion : Vehicule
{
    public double ChargeMax { get; set; }
}

// Méthode qui utilise le pattern matching pour traiter chaque type
static void DecrireVehicule(Vehicule vehicule)
{
    // Pattern matching avec switch expression
    string description = vehicule switch
    {
        Voiture v when v.NombrePortes > 4 => $"Monospace {v.Marque} ({v.NombrePortes} portes)",
        Voiture v => $"Voiture {v.Marque} ({v.NombrePortes} portes)",
        Moto m => $"Moto {m.Marque} ({m.Cylindree}cc)",
        Camion c => $"Camion {c.Marque} ({c.ChargeMax}t)",
        _ => $"Véhicule inconnu : {vehicule.Marque}"
    };

    Console.WriteLine(description);
}

// Pattern matching avec is
static void VerifierType(Vehicule vehicule)
{
    // is avec déclaration de variable
    if (vehicule is Voiture voiture)
    {
        Console.WriteLine($"  C'est une voiture avec {voiture.NombrePortes} portes");
    }
    else if (vehicule is Moto moto)
    {
        Console.WriteLine($"  C'est une moto de {moto.Cylindree}cc");
    }
}

// Test
Vehicule[] parc = {
    new Voiture { Marque = "Peugeot", NombrePortes = 5 },
    new Moto { Marque = "Yamaha", Cylindree = 600 },
    new Camion { Marque = "Renault", ChargeMax = 12.5 },
    new Voiture { Marque = "Toyota", NombrePortes = 3 }
};

foreach (Vehicule v in parc)
{
    DecrireVehicule(v);
    VerifierType(v);
}
```

**Résultat attendu** :

```text
Monospace Peugeot (5 portes)
  C'est une voiture avec 5 portes
Moto Yamaha (600cc)
  C'est une moto de 600cc
Camion Renault (12.5t)
Voiture Toyota (3 portes)
  C'est une voiture avec 3 portes
```

---

### Étape 5 : Classe sealed

```csharp
// Classe sealed : ne peut pas être héritée
sealed class Configuration
{
    public string Cle { get; }
    public string Valeur { get; }

    public Configuration(string cle, string valeur)
    {
        Cle = cle;
        Valeur = valeur;
    }

    public override string ToString() => $"{Cle} = {Valeur}";
}

// class MaConfig : Configuration { }  // Erreur : impossible d'hériter d'une classe sealed

Configuration config = new("database_host", "localhost");
Console.WriteLine(config);

// sealed override : empêcher la redéfinition dans les classes petites-filles
class Base
{
    public virtual void Afficher() => Console.WriteLine("Base");
}

class Intermediaire : Base
{
    // sealed override : les classes qui héritent de Intermediaire ne peuvent plus redéfinir Afficher
    public sealed override void Afficher() => Console.WriteLine("Intermédiaire");
}

// class Finale : Intermediaire
// {
//     public override void Afficher() { }  // Erreur : Afficher est sealed
// }

Intermediaire obj = new();
obj.Afficher();
```

**Résultat attendu** :

```text
database_host = localhost
Intermédiaire
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `dotnet run` | Compiler et exécuter le projet |
| `dotnet build` | Compiler sans exécuter |

---

## Pièges Fréquents

### Piège 1 : Oublier `virtual` sur la méthode parent

**Problème** : Sans `virtual`, la méthode ne peut pas être redéfinie avec `override`. Le mot-clé `new` cache la méthode au lieu de la redéfinir, ce qui casse le polymorphisme.

```csharp
class Parent
{
    public void Parler() => Console.WriteLine("Parent");  // Pas virtual !
}

class Enfant : Parent
{
    public new void Parler() => Console.WriteLine("Enfant");  // Cache, ne redéfinit pas
}

Parent obj = new Enfant();
obj.Parler();  // Affiche "Parent" (pas le comportement attendu !)
```

**Solution** : Utiliser `virtual` et `override`.

```csharp
class Parent
{
    public virtual void Parler() => Console.WriteLine("Parent");
}

class Enfant : Parent
{
    public override void Parler() => Console.WriteLine("Enfant");
}

Parent obj = new Enfant();
obj.Parler();  // Affiche "Enfant" (polymorphisme correct)
```

---

### Piège 2 : Oublier d'appeler le constructeur parent

**Problème** : Si la classe parent n'a pas de constructeur sans paramètre, la classe enfant doit appeler explicitement un constructeur du parent avec `base()`.

```csharp
class Animal
{
    public Animal(string nom) { }
}

// class Chien : Animal { }  // Erreur : pas de constructeur sans paramètre dans Animal
class Chien : Animal
{
    public Chien(string nom) : base(nom) { }  // Correct
}
```

---

### Piège 3 : Classe abstraite vs interface - quand utiliser quoi

**Problème** : Choisir entre classe abstraite et interface peut être déroutant.

**Solution** : Utilise ce guide de décision :

| Situation | Choix |
| --------- | ----- |
| Relation "est un" avec du code partagé | Classe abstraite |
| Contrat comportemental ("sait faire") | Interface |
| Besoin d'héritage multiple | Interface (C# n'a pas d'héritage multiple) |
| État partagé (champs, propriétés avec logique) | Classe abstraite |

---

## Checklist de Validation

- [ ] Je sais créer une classe dérivée avec `:` et appeler le constructeur parent avec `base()`
- [ ] Je comprends `virtual` et `override` pour le polymorphisme
- [ ] Je sais créer et utiliser des classes abstraites
- [ ] Je sais définir et implémenter des interfaces
- [ ] Je sais qu'une classe peut implémenter plusieurs interfaces
- [ ] Je sais utiliser le pattern matching avec `is` et `switch` sur les types
- [ ] Je comprends le rôle de `sealed` pour empêcher l'héritage

---

## Exercice Pratique

**Énoncé** : Crée un système de notifications avec des interfaces :

1. Définis une interface `INotification` avec : `string Destinataire`, `string Message`, `void Envoyer()`
2. Crée trois classes : `EmailNotification`, `SmsNotification`, `PushNotification`
3. Chaque classe implémente `Envoyer()` différemment (affiche le type d'envoi)
4. Crée une méthode `EnvoyerTout(INotification[])` qui envoie toutes les notifications

**Indications** :

- Utilise un tableau de `INotification` pour le polymorphisme
- Chaque classe peut avoir des propriétés additionnelles (ex: `Objet` pour l'email)

**Résultat attendu** :

```text
Envoi de 3 notifications :
[EMAIL] À : alice@test.com | Objet : Bienvenue | Message : Ton compte est créé.
[SMS] À : 0612345678 | Message : Code de vérification : 1234
[PUSH] À : user_42 | Message : Nouvelle mise à jour disponible
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```csharp
// Interface de notification
interface INotification
{
    string Destinataire { get; }
    string Message { get; }
    void Envoyer();
}

// Notification par email
class EmailNotification : INotification
{
    public string Destinataire { get; }
    public string Message { get; }
    public string Objet { get; }

    public EmailNotification(string destinataire, string objet, string message)
    {
        Destinataire = destinataire;
        Objet = objet;
        Message = message;
    }

    public void Envoyer()
    {
        Console.WriteLine($"[EMAIL] À : {Destinataire} | Objet : {Objet} | Message : {Message}");
    }
}

// Notification par SMS
class SmsNotification : INotification
{
    public string Destinataire { get; }
    public string Message { get; }

    public SmsNotification(string destinataire, string message)
    {
        Destinataire = destinataire;
        Message = message;
    }

    public void Envoyer()
    {
        Console.WriteLine($"[SMS] À : {Destinataire} | Message : {Message}");
    }
}

// Notification push
class PushNotification : INotification
{
    public string Destinataire { get; }
    public string Message { get; }

    public PushNotification(string destinataire, string message)
    {
        Destinataire = destinataire;
        Message = message;
    }

    public void Envoyer()
    {
        Console.WriteLine($"[PUSH] À : {Destinataire} | Message : {Message}");
    }
}

// Méthode qui envoie toutes les notifications (polymorphisme)
static void EnvoyerTout(INotification[] notifications)
{
    Console.WriteLine($"Envoi de {notifications.Length} notifications :");
    foreach (INotification notif in notifications)
    {
        notif.Envoyer();
    }
}

// Programme principal
INotification[] notifications = {
    new EmailNotification("alice@test.com", "Bienvenue", "Ton compte est créé."),
    new SmsNotification("0612345678", "Code de vérification : 1234"),
    new PushNotification("user_42", "Nouvelle mise à jour disponible")
};

EnvoyerTout(notifications);
```

---

## Navigation

← Fiche précédente : **[Classes et objets](05-classes-objets.md)**

→ Fiche suivante : **[Collections et LINQ](07-collections-linq.md)**
