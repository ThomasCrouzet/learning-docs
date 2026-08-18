---
tags:
  - Python
  - Intermédiaire
  - Concept
description: "Comprendre la programmation orientée objet en Python : classes, constructeur, self, héritage et méthodes spéciales."
estimated_time: "90 min"
fiche_number: 7
total_fiches: 12
cursus: "Python fondamentaux"
---

# 07 - Programmation orientée objet

> **En bref** : Comprendre les fondamentaux de la POO en Python avec les classes, le constructeur `__init__`, `self`, l'héritage, `super()` et les méthodes spéciales `__str__` et `__repr__`. Lecture estimée : 90 min.

## Prérequis

- Fiche 06 : [Modules et packages](06-modules-packages.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des classes avec des attributs et des méthodes, utiliser le constructeur `__init__` et `self`, implémenter l'héritage entre classes, et personnaliser l'affichage des objets avec les méthodes spéciales.

---

## Concepts

### Qu'est-ce que la POO ?

**Définition** : La programmation orientée objet (POO) est un paradigme de programmation qui organise le code autour d'objets. Un objet regroupe des données (attributs) et des comportements (méthodes) dans une seule entité.

**Le problème que la POO résout** :

Sans POO, voici les problèmes rencontrés :

1. **Données et fonctions dispersées** : les variables et les fonctions qui concernent une même entité (un utilisateur, un produit) sont éparpillées dans le code sans lien explicite.
2. **Pas de structure** : rien ne garantit qu'un "utilisateur" a bien un nom, un email et un mot de passe. Les données sont stockées dans des dictionnaires sans validation.
3. **Duplication de logique** : pour gérer un "client" et un "administrateur" qui partagent des caractéristiques, on duplique le code commun.

**Comment la POO résout ces problèmes** :

| Problème | Solution apportée par la POO |
| -------- | ---------------------------- |
| Données et fonctions dispersées | Un objet regroupe ses données et ses comportements |
| Pas de structure | La classe définit un modèle avec des attributs obligatoires |
| Duplication de logique | L'héritage permet de réutiliser et spécialiser le code |

**Analogie concrète** : La POO fonctionne comme un plan de construction d'une maison. Le plan (la classe) définit que chaque maison a une adresse, un nombre de pièces et une surface. Chaque maison construite à partir du plan (un objet) a ses propres valeurs pour ces caractéristiques. Toutes les maisons partagent la même structure, mais chacune est unique.

**Ce que la POO n'est PAS** :

- La POO n'est pas la seule façon de programmer. Python supporte aussi la programmation fonctionnelle et procédurale. On choisit le paradigme adapté au problème.
- La POO n'est pas toujours nécessaire. Pour des scripts simples ou des transformations de données, les fonctions suffisent.

---

<div class="diagram-design">
<p><a href="../../diagrams/15-python-07-poo-python-1.html">Qu&#x27;est-ce que la POO ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/15-python-07-poo-python-1.html" title="Qu&#x27;est-ce que la POO ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce qu'une classe ?

**Définition** : Une classe est un modèle (ou plan) qui définit la structure et le comportement d'un type d'objet. Elle contient des attributs (les données) et des méthodes (les fonctions). Un objet est une instance concrète créée à partir d'une classe.

**Le problème que les classes résolvent** :

Sans classes, on utilise des dictionnaires pour représenter des entités. Rien ne garantit la cohérence des données :

```python
# Sans classe : aucune structure garantie
utilisateur1 = {"nom": "Alice", "age": 25}
utilisateur2 = {"name": "Bob"}  # Clé différente, pas d'âge
```

Avec une classe, chaque objet a obligatoirement les mêmes attributs.

**Analogie concrète** : Une classe est comme un moule à gâteau. Le moule définit la forme (les attributs et méthodes), et chaque gâteau produit (objet) a la même forme mais peut avoir un goût différent (valeurs différentes). Tu peux créer autant de gâteaux que tu veux avec le même moule.

**Comparaison classe vs dictionnaire** :

| Classe | Dictionnaire |
| ------ | ------------ |
| Structure définie et garantie | Structure libre, aucune validation |
| Méthodes intégrées | Fonctions externes séparées |
| Héritage possible | Pas d'héritage |
| Autocomplétion dans l'IDE | Pas d'autocomplétion |

---

### Qu'est-ce que l'héritage ?

**Définition** : L'héritage est un mécanisme qui permet à une classe (classe enfant) de récupérer tous les attributs et méthodes d'une autre classe (classe parent) et de les compléter ou les modifier.

**Le problème que l'héritage résout** :

Sans héritage, voici les problèmes rencontrés :

1. **Code dupliqué** : les classes `Client` et `Administrateur` répètent les mêmes attributs (nom, email) et méthodes (se connecter).
2. **Modifications multiples** : si la logique de connexion change, il faut la modifier dans chaque classe séparément.

**Comment l'héritage résout ces problèmes** :

| Problème | Solution apportée par l'héritage |
| -------- | -------------------------------- |
| Code dupliqué | Les attributs communs sont dans la classe parent |
| Modifications multiples | On modifie une seule fois dans la classe parent |

**Analogie concrète** : L'héritage est comme une fiche de poste dans une entreprise. La fiche "Employé" liste les responsabilités communes à tous (arriver à l'heure, suivre les règles). La fiche "Développeur" hérite de la fiche "Employé" et ajoute des responsabilités spécifiques (écrire du code, faire des revues). Un développeur est un employé avec des compétences supplémentaires.

**Ce que l'héritage n'est PAS** :

- L'héritage n'est pas la seule façon de réutiliser du code. La composition (utiliser un objet comme attribut d'un autre) est souvent préférée.
- L'héritage ne signifie pas "copier le code". La classe enfant a accès au code du parent sans le dupliquer.

---

### Les méthodes spéciales (dunder methods)

**Définition** : Les méthodes spéciales sont des méthodes dont le nom commence et se termine par deux underscores (`__`). Elles permettent de personnaliser le comportement d'un objet dans certaines situations (affichage, comparaison, opérations mathématiques). On les appelle "dunder methods" (double underscore).

**Le problème que les méthodes spéciales résolvent** :

Sans méthodes spéciales, afficher un objet avec `print()` donne un résultat inutile comme `<__main__.Utilisateur object at 0x7f...>`. Les méthodes spéciales permettent de contrôler comment Python interagit avec tes objets.

**Méthodes spéciales courantes** :

| Méthode | Appelée par | Utilité |
| ------- | ----------- | ------- |
| `__init__` | Création de l'objet | Initialiser les attributs |
| `__str__` | `print()` et `str()` | Affichage lisible pour l'utilisateur |
| `__repr__` | `repr()` et terminal | Représentation technique pour le développeur |
| `__len__` | `len()` | Retourner la longueur |
| `__eq__` | `==` | Comparer deux objets |

---

## Étapes Pratiques

### Étape 1 : Créer une classe simple avec `__init__` et `self`

Le constructeur `__init__` est appelé automatiquement quand on crée un objet. Le paramètre `self` fait référence à l'objet en cours de création.

```python
class Voiture:
    # Le constructeur : appelé automatiquement à la création
    def __init__(self, marque, modele, annee):
        # self.attribut = valeur : crée un attribut sur l'objet
        self.marque = marque
        self.modele = modele
        self.annee = annee
        self.kilometrage = 0  # Valeur par défaut

# Créer un objet (une instance de la classe Voiture)
ma_voiture = Voiture("Renault", "Clio", 2022)

# Accéder aux attributs avec la notation pointée
print(f"Marque : {ma_voiture.marque}")
print(f"Modèle : {ma_voiture.modele}")
print(f"Année : {ma_voiture.annee}")
print(f"Kilométrage : {ma_voiture.kilometrage}")
```

**Résultat attendu** :

```text
Marque : Renault
Modèle : Clio
Année : 2022
Kilométrage : 0
```

---

### Étape 2 : Ajouter des méthodes

Une méthode est une fonction définie dans une classe. Elle prend toujours `self` comme premier paramètre.

```python
class Voiture:
    def __init__(self, marque, modele, annee):
        self.marque = marque
        self.modele = modele
        self.annee = annee
        self.kilometrage = 0

    def rouler(self, km):
        """Ajoute des kilomètres au compteur."""
        if km < 0:
            print("Erreur : les kilomètres ne peuvent pas être négatifs.")
            return
        self.kilometrage += km
        print(f"La {self.marque} {self.modele} a roulé {km} km.")

    def afficher_info(self):
        """Affiche les informations de la voiture."""
        print(f"{self.marque} {self.modele} ({self.annee})")
        print(f"  Kilométrage : {self.kilometrage} km")


# Utilisation
ma_voiture = Voiture("Peugeot", "208", 2023)
ma_voiture.afficher_info()

ma_voiture.rouler(150)
ma_voiture.rouler(230)
ma_voiture.afficher_info()
```

**Résultat attendu** :

```text
Peugeot 208 (2023)
  Kilométrage : 0 km
La Peugeot 208 a roulé 150 km.
La Peugeot 208 a roulé 230 km.
Peugeot 208 (2023)
  Kilométrage : 380 km
```

---

### Étape 3 : Implémenter `__str__` et `__repr__`

```python
class Produit:
    def __init__(self, nom, prix, stock):
        self.nom = nom
        self.prix = prix
        self.stock = stock

    def __str__(self):
        """Affichage lisible pour l'utilisateur (print, str)."""
        return f"{self.nom} - {self.prix:.2f} € ({self.stock} en stock)"

    def __repr__(self):
        """Représentation technique pour le développeur (debug)."""
        return f"Produit(nom='{self.nom}', prix={self.prix}, stock={self.stock})"


# Créer un produit
cafe = Produit("Café arabica", 8.50, 25)

# __str__ est appelé par print()
print(cafe)

# __repr__ est appelé dans le terminal interactif ou avec repr()
print(repr(cafe))

# __str__ est aussi utilisé dans les f-strings
print(f"Produit sélectionné : {cafe}")
```

**Résultat attendu** :

```text
Café arabica - 8.50 € (25 en stock)
Produit(nom='Café arabica', prix=8.5, stock=25)
Produit sélectionné : Café arabica - 8.50 € (25 en stock)
```

---

### Étape 4 : Créer une classe enfant avec héritage

```python
class Animal:
    """Classe de base pour tous les animaux."""

    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

    def parler(self):
        """Méthode à redéfinir dans les sous-classes."""
        return "..."

    def se_presenter(self):
        """Affiche les informations de l'animal."""
        return f"{self.nom}, {self.age} ans : {self.parler()}"

    def __str__(self):
        return self.se_presenter()


class Chien(Animal):
    """Un chien hérite d'Animal."""

    def __init__(self, nom, age, race):
        # super() appelle le __init__ de la classe parent
        super().__init__(nom, age)
        self.race = race  # Attribut spécifique au chien

    def parler(self):
        """Redéfinition (override) de la méthode parler."""
        return "Ouaf !"

    def rapporter(self):
        """Méthode spécifique au chien."""
        return f"{self.nom} rapporte la balle !"


class Chat(Animal):
    """Un chat hérite d'Animal."""

    def __init__(self, nom, age, couleur):
        super().__init__(nom, age)
        self.couleur = couleur

    def parler(self):
        return "Miaou !"

    def ronronner(self):
        return f"{self.nom} ronronne..."


# Créer des objets
rex = Chien("Rex", 5, "Berger Allemand")
felix = Chat("Félix", 3, "noir")

# Les méthodes héritées fonctionnent
print(rex)
print(felix)

# Les méthodes spécifiques fonctionnent
print(rex.rapporter())
print(felix.ronronner())

# Vérifier l'héritage
print(f"\nRex est un Chien ? {isinstance(rex, Chien)}")
print(f"Rex est un Animal ? {isinstance(rex, Animal)}")
print(f"Félix est un Chien ? {isinstance(felix, Chien)}")
```

**Résultat attendu** :

```text
Rex, 5 ans : Ouaf !
Félix, 3 ans : Miaou !
Rex rapporte la balle !
Félix ronronne...

Rex est un Chien ? True
Rex est un Animal ? True
Félix est un Chien ? False
```

---

### Étape 5 : Utiliser `super()` pour étendre le comportement parent

```python
class Employe:
    """Classe de base pour les employés."""

    def __init__(self, nom, salaire):
        self.nom = nom
        self.salaire = salaire

    def afficher(self):
        return f"{self.nom} - Salaire : {self.salaire:.2f} €"


class Developpeur(Employe):
    """Un développeur est un employé avec un langage de prédilection."""

    def __init__(self, nom, salaire, langage):
        # Appeler le constructeur parent pour initialiser nom et salaire
        super().__init__(nom, salaire)
        self.langage = langage

    def afficher(self):
        # Étendre (et non remplacer) la méthode parent
        base = super().afficher()
        return f"{base} - Langage : {self.langage}"


class Manager(Employe):
    """Un manager est un employé qui gère une équipe."""

    def __init__(self, nom, salaire):
        super().__init__(nom, salaire)
        self.equipe = []

    def ajouter_membre(self, employe):
        self.equipe.append(employe)

    def afficher(self):
        base = super().afficher()
        return f"{base} - Équipe : {len(self.equipe)} membres"


# Utilisation
dev = Developpeur("Alice", 45000, "Python")
manager = Manager("Bob", 55000)
manager.ajouter_membre(dev)

print(dev.afficher())
print(manager.afficher())
```

**Résultat attendu** :

```text
Alice - Salaire : 45000.00 € - Langage : Python
Bob - Salaire : 55000.00 € - Équipe : 1 membres
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `type(objet)` | Retourne la classe de l'objet |
| `isinstance(objet, Classe)` | Vérifie si l'objet est une instance de la classe |
| `issubclass(ClasseA, ClasseB)` | Vérifie si ClasseA hérite de ClasseB |
| `dir(objet)` | Liste tous les attributs et méthodes de l'objet |
| `vars(objet)` | Retourne le dictionnaire des attributs de l'objet |
| `hasattr(objet, "attribut")` | Vérifie si l'objet a un attribut donné |

---

## Pièges Fréquents

### Piège 1 : Oublier `self`

**Problème** : Oublier `self` comme premier paramètre d'une méthode provoque une `TypeError` à l'appel.

**Solution** : Toujours mettre `self` comme premier paramètre de chaque méthode d'instance.

```python
class Mauvais:
    def dire_bonjour():  # Manque self !
        print("Bonjour")

# Mauvais().dire_bonjour()  # TypeError

class Correct:
    def dire_bonjour(self):
        print("Bonjour")

Correct().dire_bonjour()  # Fonctionne
```

---

### Piège 2 : Attribut de classe vs attribut d'instance

**Problème** : Confondre les attributs définis dans la classe (partagés par tous les objets) et les attributs définis dans `__init__` (propres à chaque objet).

**Solution** : Utiliser les attributs de classe pour les constantes partagées, et `self.attribut` dans `__init__` pour les données propres à chaque instance.

```python
class Compteur:
    total = 0  # Attribut de classe : partagé par tous

    def __init__(self, nom):
        self.nom = nom  # Attribut d'instance : propre à chaque objet
        Compteur.total += 1

a = Compteur("A")
b = Compteur("B")
print(f"Total : {Compteur.total}")  # 2 (partagé)
print(f"Nom de a : {a.nom}")  # A (propre à a)
print(f"Nom de b : {b.nom}")  # B (propre à b)
```

---

### Piège 3 : Oublier `super().__init__()` dans une classe enfant

**Problème** : Si tu définis `__init__` dans la classe enfant sans appeler `super().__init__()`, les attributs du parent ne seront pas initialisés.

**Solution** : Toujours appeler `super().__init__()` dans le constructeur de la classe enfant.

```python
class Parent:
    def __init__(self):
        self.valeur = 42

class Enfant(Parent):
    def __init__(self):
        # Sans super().__init__(), self.valeur n'existe pas
        super().__init__()
        self.autre = 100

e = Enfant()
print(e.valeur)  # 42 (grâce à super().__init__())
print(e.autre)   # 100
```

---

## Checklist de Validation

- [ ] Je sais créer une classe avec `__init__` et `self`
- [ ] Je sais créer et utiliser des méthodes sur une classe
- [ ] Je comprends la différence entre attribut de classe et attribut d'instance
- [ ] Je sais implémenter `__str__` et `__repr__`
- [ ] Je sais créer une classe enfant avec héritage
- [ ] Je sais utiliser `super()` pour appeler les méthodes du parent
- [ ] Je connais `isinstance()` et `issubclass()`

---

## Exercice Pratique

**Énoncé** : Crée un système de gestion de bibliothèque avec les classes `Livre`, `Utilisateur` et `Bibliotheque`.

**Indications** :

- Classe `Livre` : attributs `titre`, `auteur`, `isbn`, `disponible` (booléen, `True` par défaut). Méthodes `__str__` et `__repr__`
- Classe `Utilisateur` : attributs `nom`, `numero_carte`, `livres_empruntes` (liste vide par défaut). Méthode `emprunter(livre)` et `retourner(livre)`
- Classe `Bibliotheque` : attribut `livres` (liste). Méthodes `ajouter_livre(livre)`, `rechercher(titre)`, `afficher_catalogue()`
- Un utilisateur ne peut pas emprunter plus de 3 livres
- Un livre indisponible ne peut pas être emprunté

**Résultat attendu** :

```text
=== Catalogue de Bibliothèque municipale ===
  [DISPO] Le Petit Prince - Antoine de Saint-Exupéry (ISBN: 978-2-07-040850-4)
  [DISPO] 1984 - George Orwell (ISBN: 978-2-07-036822-8)
  [DISPO] Dune - Frank Herbert (ISBN: 978-2-221-25847-3)

Alice emprunte "Le Petit Prince" : OK
Alice emprunte "1984" : OK

=== Livres empruntés par Alice ===
  - Le Petit Prince
  - 1984

Alice retourne "Le Petit Prince" : OK

=== Catalogue de Bibliothèque municipale ===
  [DISPO] Le Petit Prince - Antoine de Saint-Exupéry (ISBN: 978-2-07-040850-4)
  [EMPRUNTÉ] 1984 - George Orwell (ISBN: 978-2-07-036822-8)
  [DISPO] Dune - Frank Herbert (ISBN: 978-2-221-25847-3)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
class Livre:
    """Représente un livre dans la bibliothèque."""

    def __init__(self, titre, auteur, isbn):
        self.titre = titre
        self.auteur = auteur
        self.isbn = isbn
        self.disponible = True

    def __str__(self):
        statut = "DISPO" if self.disponible else "EMPRUNTÉ"
        return f"[{statut}] {self.titre} - {self.auteur} (ISBN: {self.isbn})"

    def __repr__(self):
        return f"Livre(titre='{self.titre}', auteur='{self.auteur}', isbn='{self.isbn}')"


class Utilisateur:
    """Représente un utilisateur de la bibliothèque."""

    MAX_EMPRUNTS = 3

    def __init__(self, nom, numero_carte):
        self.nom = nom
        self.numero_carte = numero_carte
        self.livres_empruntes = []

    def emprunter(self, livre):
        """Emprunte un livre si possible.

        Args:
            livre: L'objet Livre à emprunter.

        Returns:
            True si l'emprunt a réussi, False sinon.
        """
        if len(self.livres_empruntes) >= self.MAX_EMPRUNTS:
            print(f"Erreur : {self.nom} a déjà {self.MAX_EMPRUNTS} livres empruntés.")
            return False

        if not livre.disponible:
            print(f"Erreur : \"{livre.titre}\" n'est pas disponible.")
            return False

        livre.disponible = False
        self.livres_empruntes.append(livre)
        print(f"{self.nom} emprunte \"{livre.titre}\" : OK")
        return True

    def retourner(self, livre):
        """Retourne un livre emprunté.

        Args:
            livre: L'objet Livre à retourner.

        Returns:
            True si le retour a réussi, False sinon.
        """
        if livre not in self.livres_empruntes:
            print(f"Erreur : {self.nom} n'a pas emprunté \"{livre.titre}\".")
            return False

        livre.disponible = True
        self.livres_empruntes.remove(livre)
        print(f"{self.nom} retourne \"{livre.titre}\" : OK")
        return True

    def __str__(self):
        return f"Utilisateur({self.nom}, carte: {self.numero_carte})"


class Bibliotheque:
    """Gère une collection de livres."""

    def __init__(self, nom):
        self.nom = nom
        self.livres = []

    def ajouter_livre(self, livre):
        """Ajoute un livre au catalogue."""
        self.livres.append(livre)

    def rechercher(self, titre):
        """Recherche un livre par titre (recherche partielle).

        Args:
            titre: Le titre ou une partie du titre à rechercher.

        Returns:
            La liste des livres correspondants.
        """
        resultats = []
        for livre in self.livres:
            if titre.lower() in livre.titre.lower():
                resultats.append(livre)
        return resultats

    def afficher_catalogue(self):
        """Affiche tous les livres du catalogue."""
        print(f"\n=== Catalogue de {self.nom} ===")
        for livre in self.livres:
            print(f"  {livre}")


# Programme principal
biblio = Bibliotheque("Bibliothèque municipale")

# Ajouter des livres
livre1 = Livre("Le Petit Prince", "Antoine de Saint-Exupéry", "978-2-07-040850-4")
livre2 = Livre("1984", "George Orwell", "978-2-07-036822-8")
livre3 = Livre("Dune", "Frank Herbert", "978-2-221-25847-3")

biblio.ajouter_livre(livre1)
biblio.ajouter_livre(livre2)
biblio.ajouter_livre(livre3)

# Afficher le catalogue
biblio.afficher_catalogue()

# Créer un utilisateur et emprunter des livres
alice = Utilisateur("Alice", "U-001")
print()
alice.emprunter(livre1)
alice.emprunter(livre2)

# Afficher les livres empruntés
print(f"\n=== Livres empruntés par {alice.nom} ===")
for livre in alice.livres_empruntes:
    print(f"  - {livre.titre}")

# Retourner un livre
print()
alice.retourner(livre1)

# Afficher le catalogue après retour
biblio.afficher_catalogue()
```

---

## Navigation

← Fiche précédente : **[06 - Modules et packages](06-modules-packages.md)**

→ Fiche suivante : **[08 - POO avancée](08-poo-avancee.md)**
