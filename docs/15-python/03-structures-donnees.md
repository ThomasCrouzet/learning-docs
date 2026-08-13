---
tags:
  - Python
  - Débutant
  - Pratique
description: "Maîtriser les listes, tuples, dictionnaires et sets pour organiser les données en Python."
estimated_time: "75 min"
fiche_number: 3
total_fiches: 12
cursus: "Python fondamentaux"
---

# 03 - Listes, tuples et dictionnaires

> **En bref** : Apprendre à stocker, organiser et manipuler des collections de données avec les structures de données Python. Lecture estimée : 75 min.

## Prérequis

- [Fiche 02 - Variables et types de données](02-variables-types.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et manipuler des listes, des tuples, des dictionnaires et des sets, et tu maîtriseras les list compréhensions.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une liste ?

**Définition** : Une liste est une collection ordonnée et modifiable (mutable) d'éléments. Elle peut contenir des éléments de types différents et autorise les doublons.

**Le problème que les listes résolvent** :

Sans listes, voici les problèmes rencontrés :

1. **Multiplication des variables** : pour stocker 100 noms d'étudiants, il faudrait créer 100 variables (`etudiant1`, `etudiant2`, ..., `etudiant100`).
2. **Pas de traitement en lot** : impossible de parcourir tous les étudiants avec une boucle sans une structure regroupée.
3. **Taille fixe** : sans collection dynamique, il faut connaître a l'avance le nombre exact d'éléments.

**Comment les listes résolvent ces problèmes** :

| Problème | Solution apportée par les listes |
| --- | --- |
| Multiplication des variables | Une seule variable contient tous les éléments |
| Pas de traitement en lot | On peut parcourir la liste avec une boucle `for` |
| Taille fixe | La liste grandit et rétrécit dynamiquement |

**Analogie concrète** : Une liste est comme un tiroir a compartiments numérotés. Chaque compartiment (index) contient un objet. Tu peux ajouter un compartiment a la fin, retirer un objet d'un compartiment précis, ou réorganiser les compartiments.

**Ce qu'une liste n'est PAS** :

- Une liste n'est pas immuable. Contrairement à un tuple, tu peux modifier, ajouter et supprimer des éléments après la création.
- Une liste n'est pas un dictionnaire. Les éléments sont accessibles par leur position (index numérique), pas par un nom (clé).

---

### Qu'est-ce qu'un tuple ?

**Définition** : Un tuple est une collection ordonnée et non modifiable (immutable) d'éléments. Une fois créé, on ne peut ni ajouter, ni supprimer, ni modifier ses éléments.

**Le problème que les tuples résolvent** :

Sans tuples, voici les problèmes rencontrés :

1. **Modification accidentelle** : une liste peut être modifiée par erreur n'importe où dans le programme.
2. **Données qui ne doivent pas changer** : les coordonnées GPS d'un lieu, les jours de la semaine ou les couleurs d'un drapeau sont des données fixes.

**Comment les tuples résolvent ces problèmes** :

| Problème | Solution apportée par les tuples |
| --- | --- |
| Modification accidentelle | Python génère une erreur si on tente de modifier un tuple |
| Données fixes | Le tuple garantit que les données restent identiques |

**Analogie concrète** : Un tuple est comme un texte gravé dans la pierre. Une fois gravé, tu peux le lire autant de fois que tu veux, mais tu ne peux pas modifier ce qui est écrit.

**Comparaison liste vs tuple** :

| Liste (`list`) | Tuple (`tuple`) |
| --- | --- |
| Crochets `[1, 2, 3]` | Parenthèses `(1, 2, 3)` |
| Modifiable (mutable) | Non modifiable (immutable) |
| `append()`, `pop()`, etc. | Aucune méthode de modification |
| Plus lente (flexibilité a un coût) | Plus rapide (optimisée car figée) |

---

### Qu'est-ce qu'un dictionnaire ?

**Définition** : Un dictionnaire est une collection non ordonnée (depuis Python 3.7, l'ordre d'insertion est préservé) de paires clé-valeur. Chaque clé est unique et permet d'accéder directement a sa valeur associée.

**Le problème que les dictionnaires résolvent** :

Sans dictionnaires, voici les problèmes rencontrés :

1. **Accès par index peu lisible** : avec une liste, `etudiant[0]` ne dit rien sur ce que représente cet élément (nom ? âge ? note ?).
2. **Recherche lente** : pour trouver un élément dans une liste, il faut parcourir tous les éléments un par un.
3. **Pas d'association naturelle** : on ne peut pas associer un nom a un numéro de téléphone de façon explicite avec une liste.

**Comment les dictionnaires résolvent ces problèmes** :

| Problème | Solution apportée par les dictionnaires |
| --- | --- |
| Accès par index peu lisible | `etudiant["nom"]` est explicite et compréhensible |
| Recherche lente | Accès direct par clé en temps constant (O(1)) |
| Pas d'association naturelle | Chaque clé est explicitement liée a sa valeur |

**Analogie concrète** : Un dictionnaire est comme un vrai dictionnaire papier. Tu cherches un mot (la clé) et tu trouves directement sa définition (la valeur). Tu n'as pas besoin de lire toutes les pages pour trouver le mot qui t'intéresse.

**Ce qu'un dictionnaire n'est PAS** :

- Un dictionnaire n'est pas une liste. On accède aux éléments par clé (texte ou nombre), pas par position.
- Un dictionnaire n'autorise pas les clés en double. Si tu assignes deux fois la même clé, la deuxième valeur écrase la première.

---

### Qu'est-ce qu'un set ?

**Définition** : Un set est une collection non ordonnée d'éléments uniques. Il élimine automatiquement les doublons.

**Le problème que les sets résolvent** :

Sans sets, voici les problèmes rencontrés :

1. **Doublons dans les données** : une liste peut contenir le même élément plusieurs fois, ce qui fausse les comptages.
2. **Test d'appartenance lent** : vérifier si un élément existe dans une liste de 1 million d'éléments nécessite de parcourir toute la liste.

**Comment les sets résolvent ces problèmes** :

| Problème | Solution apportée par les sets |
| --- | --- |
| Doublons dans les données | Les sets éliminent automatiquement les doublons |
| Test d'appartenance lent | Vérification en temps constant (O(1)), comme les dictionnaires |

**Analogie concrète** : Un set est comme un tampon encreur. Tu peux tamponner "présent" a coté du nom d'un élève, mais tamponner deux fois le même nom ne crée pas de doublon : l'élève est soit présent, soit absent.

---

### Qu'est-ce qu'une list compréhension ?

**Définition** : Une list compréhension est une syntaxe compacte pour créer une nouvelle liste en transformant ou filtrant les éléments d'une séquence existante, le tout en une seule ligne.

**Le problème que les list compréhensions résolvent** :

Sans list compréhensions, voici les problèmes rencontrés :

1. **Code verbeux** : créer une liste filtrée nécessite 3 a 4 lignes (initialisation, boucle, condition, append).
2. **Répétition du pattern** : le même schéma "créer une liste vide, boucler, ajouter" se répète constamment.

**Comment les list compréhensions résolvent ces problèmes** :

| Problème | Solution apportée par les list compréhensions |
| --- | --- |
| Code verbeux | Une seule ligne au lieu de 4 |
| Répétition du pattern | Syntaxe dédiée et lisible |

**Syntaxe** :

```python
# Syntaxe de base
nouvelle_liste = [expression for element in sequence]

# Avec condition de filtre
nouvelle_liste = [expression for element in sequence if condition]
```

---

## Étapes Pratiques

### Étape 1 : Créer et manipuler des listes

Crée un fichier `listes.py` :

```python
# listes.py - Création et manipulation de listes

# Créer une liste
fruits = ["pomme", "banane", "cerise"]
print("Liste :", fruits)

# Accéder par index (commence à 0)
print("Premier fruit :", fruits[0])   # pomme
print("Dernier fruit :", fruits[-1])  # cerise

# Ajouter un élément à la fin
fruits.append("orange")
print("Après append :", fruits)

# Insérer à une position précise
fruits.insert(1, "mangue")  # Insère à l'index 1
print("Après insert :", fruits)

# Supprimer un élément par valeur
fruits.remove("banane")
print("Après remove :", fruits)

# Supprimer et récupérer le dernier élément
dernier = fruits.pop()
print("Élément retiré :", dernier)
print("Après pop :", fruits)

# Longueur de la liste
print("Nombre de fruits :", len(fruits))

# Vérifier si un élément existe
print("pomme dans la liste ?", "pomme" in fruits)  # True
print("kiwi dans la liste ?", "kiwi" in fruits)    # False

# Trier la liste (modifie la liste en place)
nombres = [3, 1, 4, 1, 5, 9, 2, 6]
nombres.sort()
print("Triée :", nombres)

# Inverser la liste
nombres.reverse()
print("Inversée :", nombres)
```

```bash
python3 listes.py
```

**Résultat attendu** :

```text
Liste : ['pomme', 'banane', 'cerise']
Premier fruit : pomme
Dernier fruit : cerise
Après append : ['pomme', 'banane', 'cerise', 'orange']
Après insert : ['pomme', 'mangue', 'banane', 'cerise', 'orange']
Après remove : ['pomme', 'mangue', 'cerise', 'orange']
Élément retiré : orange
Après pop : ['pomme', 'mangue', 'cerise']
Nombre de fruits : 3
pomme dans la liste ? True
kiwi dans la liste ? False
Triée : [1, 1, 2, 3, 4, 5, 6, 9]
Inversée : [9, 6, 5, 4, 3, 2, 1, 1]
```

---

### Étape 2 : Utiliser le slicing (découpage)

Crée un fichier `slicing.py` :

```python
# slicing.py - Découpage de listes avec la syntaxe [début:fin:pas]

nombres = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Syntaxe : liste[début:fin] (fin est exclue)
print(nombres[2:5])    # [2, 3, 4] - de l'index 2 à 4
print(nombres[:3])     # [0, 1, 2] - du début à l'index 2
print(nombres[7:])     # [7, 8, 9] - de l'index 7 à la fin
print(nombres[-3:])    # [7, 8, 9] - les 3 derniers éléments

# Avec un pas
print(nombres[::2])    # [0, 2, 4, 6, 8] - un élément sur deux
print(nombres[1::2])   # [1, 3, 5, 7, 9] - les éléments d'index impair

# Inverser une liste avec le slicing
print(nombres[::-1])   # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

# Copier une liste (copie superficielle)
copie = nombres[:]
copie.append(99)
print("Original :", nombres)  # Inchangé
print("Copie :", copie)       # Contient 99
```

```bash
python3 slicing.py
```

**Résultat attendu** :

```text
[2, 3, 4]
[0, 1, 2]
[7, 8, 9]
[7, 8, 9]
[0, 2, 4, 6, 8]
[1, 3, 5, 7, 9]
[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
Original : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
Copie : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 99]
```

---

### Étape 3 : Créer des tuples

Crée un fichier `tuples.py` :

```python
# tuples.py - Création et utilisation de tuples

# Créer un tuple
coordonnees = (48.8566, 2.3522)  # Latitude, longitude de Paris
print("Coordonnées :", coordonnees)
print("Latitude :", coordonnees[0])
print("Longitude :", coordonnees[1])

# Un tuple à un seul élément nécessite une virgule
singleton = (42,)  # La virgule est obligatoire
pas_un_tuple = (42)  # Sans virgule, c'est juste un int entre parenthèses
print(type(singleton))      # <class 'tuple'>
print(type(pas_un_tuple))   # <class 'int'>

# Déballage (unpacking) d'un tuple
x, y = coordonnees
print(f"x = {x}, y = {y}")

# Tuple avec des types différents
personne = ("Alice", 25, True)
nom, age, est_active = personne
print(f"{nom} a {age} ans, active : {est_active}")

# Tenter de modifier un tuple génère une erreur
# coordonnees[0] = 0  # TypeError: 'tuple' object does not support item assignment

# Compter et chercher
notes = (15, 12, 15, 18, 12, 15)
print("Nombre de 15 :", notes.count(15))  # 3
print("Index du 18 :", notes.index(18))   # 3
```

```bash
python3 tuples.py
```

**Résultat attendu** :

```text
Coordonnées : (48.8566, 2.3522)
Latitude : 48.8566
Longitude : 2.3522
<class 'tuple'>
<class 'int'>
x = 48.8566, y = 2.3522
Alice a 25 ans, active : True
Nombre de 15 : 3
Index du 18 : 3
```

---

### Étape 4 : Créer et manipuler des dictionnaires

Crée un fichier `dictionnaires.py` :

```python
# dictionnaires.py - Création et manipulation de dictionnaires

# Créer un dictionnaire
etudiant = {
    "nom": "Alice",
    "age": 25,
    "notes": [15, 12, 18],
    "active": True
}
print("Étudiant :", etudiant)

# Accéder à une valeur par sa clé
print("Nom :", etudiant["nom"])
print("Age :", etudiant["age"])

# Accès sécurisé avec get() (retourne None si la clé n'existe pas)
print("Email :", etudiant.get("email"))          # None
print("Email :", etudiant.get("email", "N/A"))   # N/A (valeur par défaut)

# Ajouter ou modifier une valeur
etudiant["email"] = "alice@exemple.com"  # Ajoute une nouvelle clé
etudiant["age"] = 26                      # Modifie une valeur existante
print("Après modification :", etudiant)

# Supprimer une clé
del etudiant["active"]
print("Après suppression :", etudiant)

# Récupérer les clés, valeurs et paires
print("Clés :", list(etudiant.keys()))
print("Valeurs :", list(etudiant.values()))
print("Paires :", list(etudiant.items()))

# Vérifier si une clé existe
print("nom existe ?", "nom" in etudiant)      # True
print("tel existe ?", "tel" in etudiant)       # False

# Longueur (nombre de paires clé-valeur)
print("Nombre de clés :", len(etudiant))
```

```bash
python3 dictionnaires.py
```

**Résultat attendu** :

```text
Étudiant : {'nom': 'Alice', 'age': 25, 'notes': [15, 12, 18], 'active': True}
Nom : Alice
Age : 25
Email : None
Email : N/A
Après modification : {'nom': 'Alice', 'age': 26, 'notes': [15, 12, 18], 'active': True, 'email': 'alice@exemple.com'}
Après suppression : {'nom': 'Alice', 'age': 26, 'notes': [15, 12, 18], 'email': 'alice@exemple.com'}
Clés : ['nom', 'age', 'notes', 'email']
Valeurs : ['Alice', 26, [15, 12, 18], 'alice@exemple.com']
Paires : [('nom', 'Alice'), ('age', 26), ('notes', [15, 12, 18]), ('email', 'alice@exemple.com')]
nom existe ? True
tel existe ? False
Nombre de clés : 4
```

---

### Étape 5 : Sets et list compréhensions

Crée un fichier `sets_comprehensions.py` :

```python
# sets_comprehensions.py - Sets et list comprehensions

# --- Sets ---
# Créer un set (les doublons sont automatiquement éliminés)
nombres = {1, 2, 3, 2, 1, 4, 5, 4}
print("Set :", nombres)  # {1, 2, 3, 4, 5} (sans doublons)

# Ajouter et supprimer
nombres.add(6)
nombres.discard(1)  # Supprime sans erreur si absent
print("Après modif :", nombres)

# Éliminer les doublons d'une liste
liste_avec_doublons = [1, 2, 2, 3, 3, 3, 4]
sans_doublons = list(set(liste_avec_doublons))
print("Sans doublons :", sans_doublons)

# Opérations ensemblistes
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
print("Union :", a | b)          # {1, 2, 3, 4, 5, 6}
print("Intersection :", a & b)   # {3, 4}
print("Différence :", a - b)     # {1, 2}

# --- List Comprehensions ---
# Créer une liste de carrés
carres = [x ** 2 for x in range(10)]
print("Carrés :", carres)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Filtrer avec une condition
pairs = [x for x in range(20) if x % 2 == 0]
print("Pairs :", pairs)  # [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Transformer des données
noms = ["alice", "bob", "charlie"]
noms_majuscules = [nom.upper() for nom in noms]
print("Majuscules :", noms_majuscules)  # ['ALICE', 'BOB', 'CHARLIE']

# Équivalent sans comprehension (plus verbeux)
noms_majuscules_v2 = []
for nom in noms:
    noms_majuscules_v2.append(nom.upper())
print("Même résultat :", noms_majuscules_v2)

# Dict comprehension
carres_dict = {x: x ** 2 for x in range(6)}
print("Dict carrés :", carres_dict)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

```bash
python3 sets_comprehensions.py
```

**Résultat attendu** :

```text
Set : {1, 2, 3, 4, 5}
Après modif : {2, 3, 4, 5, 6}
Sans doublons : [1, 2, 3, 4]
Union : {1, 2, 3, 4, 5, 6}
Intersection : {3, 4}
Différence : {1, 2}
Carrés : [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
Pairs : [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
Majuscules : ['ALICE', 'BOB', 'CHARLIE']
Même résultat : ['ALICE', 'BOB', 'CHARLIE']
Dict carrés : {0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `liste.append(x)` | Ajoute `x` a la fin de la liste |
| `liste.insert(i, x)` | Insère `x` a l'index `i` |
| `liste.pop()` | Retire et retourne le dernier élément |
| `liste.remove(x)` | Retire la première occurrence de `x` |
| `liste.sort()` | Trie la liste en place |
| `liste.reverse()` | Inverse la liste en place |
| `dict.get(cle, defaut)` | Retourne la valeur ou `defaut` si la clé n'existe pas |
| `dict.keys()` | Retourne les clés du dictionnaire |
| `dict.values()` | Retourne les valeurs du dictionnaire |
| `dict.items()` | Retourne les paires (clé, valeur) |
| `set.add(x)` | Ajoute `x` au set |
| `set.discard(x)` | Retire `x` du set (sans erreur si absent) |
| `len(collection)` | Retourne le nombre d'éléments |

---

## Pièges Fréquents

### Piège 1 : Modifier une liste pendant qu'on l'itère

**Problème** : Supprimer des éléments d'une liste avec `remove()` pendant une boucle `for` saute des éléments ou génère des résultats incohérents.

**Solution** : Créer une nouvelle liste avec une list compréhension.

```python
# Incorrect : résultat imprévisible
nombres = [1, 2, 3, 4, 5]
# for n in nombres:
#     if n % 2 == 0:
#         nombres.remove(n)  # Ne fais jamais ça

# Correct : list comprehension
nombres = [1, 2, 3, 4, 5]
impairs = [n for n in nombres if n % 2 != 0]
print(impairs)  # [1, 3, 5]
```

---

### Piège 2 : Confondre `dict["cle"]` et `dict.get("cle")`

**Problème** : `dict["cle"]` génère une erreur `KeyError` si la clé n'existe pas.

**Solution** : Utiliser `dict.get("cle")` qui retourne `None` au lieu de générer une erreur, ou `dict.get("cle", valeur_defaut)` pour fournir une valeur par défaut.

```python
personne = {"nom": "Alice"}

# Incorrect : génère KeyError
# print(personne["email"])  # KeyError: 'email'

# Correct : retourne None ou une valeur par défaut
print(personne.get("email"))          # None
print(personne.get("email", "N/A"))   # N/A
```

---

### Piège 3 : Oublier la virgule dans un tuple a un élément

**Problème** : `(42)` n'est pas un tuple, c'est l'entier `42` entre parenthèses. Sans la virgule, Python ne crée pas de tuple.

**Solution** : Toujours ajouter une virgule pour un tuple a un seul élément : `(42,)`.

```python
pas_tuple = (42)    # int
vrai_tuple = (42,)  # tuple

print(type(pas_tuple))   # <class 'int'>
print(type(vrai_tuple))  # <class 'tuple'>
```

---

## Checklist de Validation

- [ ] Je sais créer une liste et accéder aux éléments par index
- [ ] Je maîtrise les méthodes `append()`, `insert()`, `pop()`, `remove()`, `sort()`
- [ ] Je sais utiliser le slicing (`liste[2:5]`, `liste[::-1]`)
- [ ] Je comprends la différence entre liste (mutable) et tuple (immutable)
- [ ] Je sais créer un dictionnaire et accéder aux valeurs avec `["cle"]` et `.get()`
- [ ] Je sais parcourir un dictionnaire avec `.keys()`, `.values()`, `.items()`
- [ ] Je comprends l'utilité des sets pour éliminer les doublons
- [ ] Je sais écrire une list compréhension simple

---

## Exercice Pratique

**Énoncé** : Crée un script `inventaire.py` qui gère un inventaire de produits avec un dictionnaire. Le programme doit permettre d'ajouter un produit, de supprimer un produit, de lister tous les produits et de rechercher un produit par nom.

**Indications** :

- L'inventaire est un dictionnaire dont les clés sont les noms de produits et les valeurs sont les quantités
- Utilise une boucle `while True` avec `input()` pour afficher un menu
- Menu : 1=Ajouter, 2=Supprimer, 3=Lister, 4=Rechercher, 5=Quitter
- Pour ajouter : demande le nom et la quantité
- Pour supprimer : demande le nom et utilise `del`
- Pour lister : affiche tous les produits avec leur quantité
- Pour rechercher : vérifie si le nom existe avec `in`

**Résultat attendu** :

```text
=== Gestion d'inventaire ===
1. Ajouter un produit
2. Supprimer un produit
3. Lister les produits
4. Rechercher un produit
5. Quitter
Choix : 1
Nom du produit : Clavier
Quantité : 15
Clavier ajouté (quantité : 15).
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
# inventaire.py - Gestion d'inventaire avec un dictionnaire

# Le dictionnaire qui stocke les produits (nom -> quantité)
inventaire = {}

# Boucle principale du programme
while True:
    # Affiche le menu
    print("\n=== Gestion d'inventaire ===")
    print("1. Ajouter un produit")
    print("2. Supprimer un produit")
    print("3. Lister les produits")
    print("4. Rechercher un produit")
    print("5. Quitter")

    choix = input("Choix : ")

    if choix == "1":
        # Ajouter un produit
        nom = input("Nom du produit : ")
        quantite = int(input("Quantité : "))
        inventaire[nom] = quantite
        print(f"{nom} ajouté (quantité : {quantite}).")

    elif choix == "2":
        # Supprimer un produit
        nom = input("Nom du produit a supprimer : ")
        if nom in inventaire:
            del inventaire[nom]
            print(f"{nom} supprimé.")
        else:
            print(f"{nom} n'existe pas dans l'inventaire.")

    elif choix == "3":
        # Lister tous les produits
        if len(inventaire) == 0:
            print("L'inventaire est vide.")
        else:
            print("\nProduits en stock :")
            for nom, quantite in inventaire.items():
                print(f"  - {nom} : {quantite}")

    elif choix == "4":
        # Rechercher un produit
        nom = input("Nom du produit a rechercher : ")
        if nom in inventaire:
            print(f"{nom} : {inventaire[nom]} en stock.")
        else:
            print(f"{nom} n'est pas dans l'inventaire.")

    elif choix == "5":
        # Quitter le programme
        print("Au revoir !")
        break

    else:
        print("Choix invalide. Tape un nombre entre 1 et 5.")
```

```bash
# Exécute le gestionnaire d'inventaire
python3 inventaire.py
```

**Explication du code** :

1. `inventaire = {}` crée un dictionnaire vide qui va stocker les produits.
2. `while True` crée une boucle infinie qui s'arrête uniquement quand l'utilisateur tape `5` (le `break` sort de la boucle).
3. `inventaire[nom] = quantite` ajoute ou met a jour un produit dans le dictionnaire.
4. `del inventaire[nom]` supprime un produit par sa clé.
5. `inventaire.items()` retourne toutes les paires (nom, quantité) pour l'affichage.
6. `nom in inventaire` vérifie si la clé existe dans le dictionnaire.

---

## Navigation

← Fiche précédente : **[02 - Variables et types de données](02-variables-types.md)**

→ Fiche suivante : **[04 - Conditions et boucles](04-conditions-boucles.md)**
