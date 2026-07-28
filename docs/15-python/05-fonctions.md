---
tags:
  - Python
  - Débutant
  - Pratique
description: "Définir et utiliser des fonctions en Python : paramètres, return, *args/**kwargs, fonctions lambda et docstrings."
estimated_time: "75 min"
fiche_number: 5
total_fiches: 12
cursus: "Python fondamentaux"
---

# 05 - Fonctions

> **En bref** : Apprendre à créer des fonctions réutilisables en Python avec `def`, `return`, les paramètres positionnels et nommés, `*args`/`**kwargs`, les fonctions lambda et les docstrings. Lecture estimée : 75 min.

## Prérequis

- Fiche 04 : [Conditions et boucles](04-conditions-boucles.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras définir des fonctions avec différents types de paramètres, retourner des valeurs, utiliser `*args` et `**kwargs`, écrire des fonctions lambda et documenter ton code avec des docstrings.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une fonction ?

**Définition** : Une fonction est un bloc de code réutilisable qui effectue une tâche précise. On la définit une fois avec le mot-clé `def`, puis on l'appelle autant de fois que nécessaire.

**Le problème que les fonctions résolvent** :

Sans fonctions, voici les problèmes rencontrés :

1. **Duplication de code** : le même bloc de code est copié-collé à plusieurs endroits. Si une correction est nécessaire, il faut la faire partout.
2. **Code illisible** : un programme de 500 lignes sans structure est difficile à comprendre et à maintenir.
3. **Pas de réutilisation** : impossible de partager un comportement entre différentes parties du programme.

**Comment les fonctions résolvent ces problèmes** :

| Problème | Solution apportée par les fonctions |
| -------- | ----------------------------------- |
| Duplication de code | On écrit le code une seule fois dans la fonction et on l'appelle partout (principe DRY - Don't Repeat Yourself) |
| Code illisible | Chaque fonction a un nom descriptif qui explique ce qu'elle fait |
| Pas de réutilisation | Une fonction peut être appelée depuis n'importe quel endroit du programme |

**Analogie concrète** : Une fonction est comme une recette de cuisine. Tu écris la recette une fois (définition), puis chaque fois que tu veux préparer le plat, tu suis la recette (appel). Tu peux ajuster les ingrédients (paramètres) pour varier le résultat, mais les étapes restent les mêmes.

**Ce qu'une fonction n'est PAS** :

- Une fonction n'est pas un programme complet. C'est un morceau de programme qui effectue une seule tâche bien définie.
- Une fonction n'est pas une classe. Une classe regroupe des données et des fonctions. Une fonction seule ne contient que du comportement.

---

### Paramètres et arguments

**Définition** : Les paramètres sont les variables déclarées dans la définition d'une fonction. Les arguments sont les valeurs concrètes passées lors de l'appel de la fonction.

**Le problème que les paramètres résolvent** :

Sans paramètres, une fonction ferait toujours exactement la même chose avec les mêmes données. Les paramètres permettent de rendre une fonction flexible et adaptable.

**Types de paramètres en Python** :

| Type | Syntaxe | Description |
| ---- | ------- | ----------- |
| Positionnel | `def f(a, b)` | L'ordre des arguments détermine quel paramètre reçoit quelle valeur |
| Nommé (keyword) | `f(b=2, a=1)` | On précise le nom du paramètre lors de l'appel |
| Valeur par défaut | `def f(a, b=10)` | Le paramètre a une valeur si aucun argument n'est fourni |

**Analogie concrète** : Les paramètres sont comme les cases d'un formulaire. Certaines cases sont obligatoires (paramètres positionnels), d'autres sont pré-remplies avec une valeur par défaut que tu peux changer si nécessaire (paramètres avec valeur par défaut).

---

### `*args` et `**kwargs`

**Définition** : `*args` permet de passer un nombre variable d'arguments positionnels à une fonction. `**kwargs` permet de passer un nombre variable d'arguments nommés. Ce sont des conventions de nommage - les noms `args` et `kwargs` ne sont pas obligatoires, seuls les `*` et `**` comptent.

**Le problème que `*args` et `**kwargs` résolvent** :

Sans ces mécanismes, tu devrais connaître à l'avance le nombre exact d'arguments que la fonction recevra. Cela rend impossible la création de fonctions flexibles comme `print()` qui accepte un nombre quelconque d'arguments.

**Comparaison `*args` vs `**kwargs`** :

| `*args` | `**kwargs` |
| ------- | ---------- |
| Reçoit des arguments positionnels | Reçoit des arguments nommés |
| Stocké dans un tuple | Stocké dans un dictionnaire |
| Accès par index : `args[0]` | Accès par clé : `kwargs["nom"]` |
| Syntaxe d'appel : `f(1, 2, 3)` | Syntaxe d'appel : `f(a=1, b=2)` |

---

### Fonctions lambda

**Définition** : Une fonction lambda est une fonction anonyme (sans nom) écrite sur une seule ligne avec le mot-clé `lambda`. Elle prend des paramètres et retourne une expression.

**Le problème que les fonctions lambda résolvent** :

Parfois, tu as besoin d'une fonction simple pour une opération ponctuelle (tri, filtrage, transformation). Définir une fonction complète avec `def` pour une seule ligne de logique alourdit le code inutilement.

**Ce qu'une fonction lambda n'est PAS** :

- Une lambda n'est pas un remplacement des fonctions `def`. Elle est limitée à une seule expression. Pour de la logique complexe, utilise `def`.
- Une lambda n'est pas plus performante qu'une fonction `def`. C'est uniquement une question de lisibilité et de concision.

---

### Les docstrings

**Définition** : Une docstring est une chaîne de caractères placée immédiatement après la ligne `def`. Elle documente ce que fait la fonction, ses paramètres et sa valeur de retour. Python la rend accessible via `help()` et l'attribut `__doc__`.

**Le problème que les docstrings résolvent** :

Sans documentation, il faut lire le code source pour comprendre ce qu'une fonction fait, quels paramètres elle accepte et ce qu'elle retourne. Cela ralentit considérablement le travail en équipe et la maintenance.

**Analogie concrète** : Une docstring est comme la notice d'utilisation d'un appareil. Sans elle, tu dois démonter l'appareil (lire le code) pour comprendre comment il fonctionne. Avec elle, tu lis simplement le mode d'emploi.

---

## Étapes Pratiques

### Étape 1 : Définir et appeler une fonction simple

Une fonction se définit avec `def`, un nom, des parenthèses et un deux-points. Le corps est indenté.

```python
# Définition d'une fonction sans paramètre
def dire_bonjour():
    print("Bonjour, bienvenue en Python !")

# Appel de la fonction
dire_bonjour()
dire_bonjour()
```

**Résultat attendu** :

```text
Bonjour, bienvenue en Python !
Bonjour, bienvenue en Python !
```

---

### Étape 2 : Utiliser `return` pour renvoyer une valeur

Le mot-clé `return` permet à la fonction de renvoyer un résultat. Sans `return`, la fonction renvoie `None` par défaut.

```python
# Fonction qui retourne une valeur
def additionner(a, b):
    resultat = a + b
    return resultat

# On stocke le résultat dans une variable
somme = additionner(5, 3)
print(f"5 + 3 = {somme}")

# On peut aussi utiliser le retour directement
print(f"10 + 20 = {additionner(10, 20)}")

# Fonction sans return : retourne None
def afficher_message(message):
    print(message)

retour = afficher_message("Test")
print(f"Valeur de retour : {retour}")
```

**Résultat attendu** :

```text
5 + 3 = 8
10 + 20 = 30
Test
Valeur de retour : None
```

---

### Étape 3 : Paramètres avec valeur par défaut

Les paramètres avec valeur par défaut doivent être placés après les paramètres obligatoires.

```python
# Paramètre avec valeur par défaut
def saluer(prenom, formule="Bonjour"):
    return f"{formule}, {prenom} !"

# Appel avec la valeur par défaut
print(saluer("Alice"))

# Appel en remplaçant la valeur par défaut
print(saluer("Bob", "Salut"))

# Appel avec argument nommé
print(saluer(formule="Bonsoir", prenom="Charlie"))
```

**Résultat attendu** :

```text
Bonjour, Alice !
Salut, Bob !
Bonsoir, Charlie !
```

---

### Étape 4 : Retourner plusieurs valeurs

Python permet de retourner plusieurs valeurs sous forme de tuple.

```python
# Fonction qui retourne plusieurs valeurs
def analyser_liste(nombres):
    minimum = min(nombres)
    maximum = max(nombres)
    moyenne = sum(nombres) / len(nombres)
    return minimum, maximum, moyenne

# Déballage du tuple retourné
mini, maxi, moy = analyser_liste([4, 8, 2, 15, 7])
print(f"Min : {mini}, Max : {maxi}, Moyenne : {moy}")
```

**Résultat attendu** :

```text
Min : 2, Max : 15, Moyenne : 7.2
```

---

### Étape 5 : Utiliser `*args` et `**kwargs`

```python
# *args : nombre variable d'arguments positionnels
def calculer_somme(*args):
    print(f"Arguments reçus : {args}")
    print(f"Type : {type(args)}")
    return sum(args)

print(calculer_somme(1, 2, 3))
print(calculer_somme(10, 20, 30, 40, 50))

print("---")

# **kwargs : nombre variable d'arguments nommés
def creer_profil(**kwargs):
    print(f"Arguments reçus : {kwargs}")
    for cle, valeur in kwargs.items():
        print(f"  {cle} : {valeur}")

creer_profil(nom="Alice", age=25, ville="Paris")

print("---")

# Combinaison des deux
def fonction_flexible(obligatoire, *args, **kwargs):
    print(f"Obligatoire : {obligatoire}")
    print(f"Args : {args}")
    print(f"Kwargs : {kwargs}")

fonction_flexible("premier", 2, 3, 4, option="active", debug=True)
```

**Résultat attendu** :

```text
Arguments reçus : (1, 2, 3)
Type : <class 'tuple'>
6
Arguments reçus : (10, 20, 30, 40, 50)
Type : <class 'tuple'>
150
---
Arguments reçus : {'nom': 'Alice', 'age': 25, 'ville': 'Paris'}
  nom : Alice
  age : 25
  ville : Paris
---
Obligatoire : premier
Args : (2, 3, 4)
Kwargs : {'option': 'active', 'debug': True}
```

---

### Étape 6 : Écrire une fonction lambda

```python
# Lambda simple : élever au carré
carre = lambda x: x ** 2
print(f"Carré de 5 : {carre(5)}")

# Lambda avec plusieurs paramètres
multiplier = lambda a, b: a * b
print(f"3 x 7 = {multiplier(3, 7)}")

# Utilisation courante : tri personnalisé
etudiants = [
    {"nom": "Alice", "note": 15},
    {"nom": "Bob", "note": 12},
    {"nom": "Charlie", "note": 18},
]

# Trier par note (croissant)
etudiants_tries = sorted(etudiants, key=lambda e: e["note"])
for e in etudiants_tries:
    print(f"  {e['nom']} : {e['note']}")

print("---")

# Utilisation avec filter : garder les notes >= 15
bons_etudiants = list(filter(lambda e: e["note"] >= 15, etudiants))
for e in bons_etudiants:
    print(f"  {e['nom']} : {e['note']}")
```

**Résultat attendu** :

```text
Carré de 5 : 25
3 x 7 = 21
  Bob : 12
  Alice : 15
  Charlie : 18
---
  Alice : 15
  Charlie : 18
```

---

### Étape 7 : Documenter avec des docstrings

```python
def calculer_imc(poids_kg, taille_m):
    """Calcule l'indice de masse corporelle (IMC).

    Args:
        poids_kg: Le poids de la personne en kilogrammes.
        taille_m: La taille de la personne en mètres.

    Returns:
        L'IMC arrondi à une décimale.

    Raises:
        ValueError: Si le poids ou la taille est négatif ou nul.
    """
    if poids_kg <= 0 or taille_m <= 0:
        raise ValueError("Le poids et la taille doivent être positifs.")
    return round(poids_kg / (taille_m ** 2), 1)

# Utiliser la fonction
print(calculer_imc(70, 1.75))

# Consulter la documentation
help(calculer_imc)
```

**Résultat attendu** :

```text
22.9
Help on function calculer_imc in module __main__:

calculer_imc(poids_kg, taille_m)
    Calcule l'indice de masse corporelle (IMC).

    Args:
        poids_kg: Le poids de la personne en kilogrammes.
        taille_m: La taille de la personne en mètres.

    Returns:
        L'IMC arrondi à une décimale.

    Raises:
        ValueError: Si le poids ou la taille est négatif ou nul.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `help(nom_fonction)` | Affiche la docstring de la fonction |
| `nom_fonction.__doc__` | Accède directement à la docstring |
| `nom_fonction.__name__` | Récupère le nom de la fonction sous forme de chaîne |
| `type(nom_fonction)` | Retourne `<class 'function'>` |

---

## Pièges Fréquents

### Piège 1 : Valeur par défaut mutable

**Problème** : Utiliser une liste ou un dictionnaire comme valeur par défaut provoque un comportement inattendu. La valeur par défaut est créée une seule fois et partagée entre tous les appels.

**Solution** : Utiliser `None` comme valeur par défaut et créer la liste dans le corps de la fonction.

```python
# Incorrect : la liste est partagée entre les appels
def ajouter_element_mauvais(element, liste=[]):
    liste.append(element)
    return liste

print(ajouter_element_mauvais(1))  # [1]
print(ajouter_element_mauvais(2))  # [1, 2] au lieu de [2] !

# Correct : créer une nouvelle liste à chaque appel
def ajouter_element(element, liste=None):
    if liste is None:
        liste = []
    liste.append(element)
    return liste

print(ajouter_element(1))  # [1]
print(ajouter_element(2))  # [2]
```

---

### Piège 2 : Oublier `return`

**Problème** : Si tu oublies `return`, la fonction renvoie `None`. Cela peut provoquer des erreurs silencieuses.

**Solution** : Vérifie toujours que ta fonction contient un `return` si tu as besoin de récupérer un résultat.

```python
# Incorrect : pas de return
def doubler_mauvais(n):
    n * 2  # Le résultat est calculé mais perdu

resultat = doubler_mauvais(5)
print(resultat)  # None

# Correct : avec return
def doubler(n):
    return n * 2

resultat = doubler(5)
print(resultat)  # 10
```

---

### Piège 3 : Ordre des paramètres

**Problème** : Les paramètres avec valeur par défaut doivent être placés après les paramètres obligatoires.

**Solution** : Respecter l'ordre : positionnels, puis `*args`, puis nommés avec défaut, puis `**kwargs`.

```python
# Incorrect : provoque une SyntaxError
# def mauvais(a=1, b):
#     pass

# Correct : paramètre par défaut en dernier
def correct(a, b, c=10):
    return a + b + c

# Ordre complet
def complet(obligatoire, *args, option=True, **kwargs):
    pass
```

---

## Checklist de Validation

- [ ] Je sais définir une fonction avec `def` et l'appeler
- [ ] Je comprends la différence entre paramètres et arguments
- [ ] Je sais utiliser `return` pour renvoyer une ou plusieurs valeurs
- [ ] Je sais utiliser des paramètres avec valeur par défaut
- [ ] Je comprends `*args` et `**kwargs` et sais les utiliser
- [ ] Je sais écrire une fonction lambda
- [ ] Je sais documenter une fonction avec une docstring
- [ ] Je connais le piège des valeurs par défaut mutables

---

## Exercice Pratique

**Énoncé** : Crée une calculatrice avec des fonctions pour chaque opération (addition, soustraction, multiplication, division) et une fonction principale qui gère le menu.

**Indications** :

- Chaque opération doit être une fonction séparée avec deux paramètres
- La division doit gérer le cas de la division par zéro
- La fonction principale affiche un menu, demande le choix de l'opération et les nombres, puis affiche le résultat
- Ajoute des docstrings à chaque fonction
- Utilise une boucle pour permettre plusieurs calculs à la suite
- Le programme s'arrête quand l'utilisateur choisit "quitter"

**Résultat attendu** :

```text
=== Calculatrice ===
1. Addition
2. Soustraction
3. Multiplication
4. Division
5. Quitter

Choix : 1
Premier nombre : 10
Deuxième nombre : 3
Résultat : 10.0 + 3.0 = 13.0

Choix : 4
Premier nombre : 10
Deuxième nombre : 0
Erreur : division par zéro impossible.

Choix : 5
Au revoir !
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
def addition(a, b):
    """Additionne deux nombres.

    Args:
        a: Premier nombre.
        b: Deuxième nombre.

    Returns:
        La somme de a et b.
    """
    return a + b


def soustraction(a, b):
    """Soustrait b de a.

    Args:
        a: Premier nombre.
        b: Deuxième nombre.

    Returns:
        La différence a - b.
    """
    return a - b


def multiplication(a, b):
    """Multiplie deux nombres.

    Args:
        a: Premier nombre.
        b: Deuxième nombre.

    Returns:
        Le produit de a et b.
    """
    return a * b


def division(a, b):
    """Divise a par b.

    Args:
        a: Numérateur.
        b: Dénominateur.

    Returns:
        Le quotient a / b, ou None si b vaut 0.
    """
    if b == 0:
        return None
    return a / b


def afficher_menu():
    """Affiche le menu de la calculatrice."""
    print("\n=== Calculatrice ===")
    print("1. Addition")
    print("2. Soustraction")
    print("3. Multiplication")
    print("4. Division")
    print("5. Quitter")


def calculatrice():
    """Fonction principale qui gère la boucle de la calculatrice."""
    # Dictionnaire associant le choix à la fonction et au symbole
    operations = {
        "1": (addition, "+"),
        "2": (soustraction, "-"),
        "3": (multiplication, "*"),
        "4": (division, "/"),
    }

    while True:
        afficher_menu()
        choix = input("\nChoix : ")

        # Quitter
        if choix == "5":
            print("Au revoir !")
            break

        # Vérifier que le choix est valide
        if choix not in operations:
            print("Choix invalide. Essaie un nombre entre 1 et 5.")
            continue

        # Demander les nombres
        try:
            a = float(input("Premier nombre : "))
            b = float(input("Deuxième nombre : "))
        except ValueError:
            print("Erreur : entre un nombre valide.")
            continue

        # Exécuter l'opération
        fonction, symbole = operations[choix]
        resultat = fonction(a, b)

        # Afficher le résultat
        if resultat is None:
            print("Erreur : division par zéro impossible.")
        else:
            print(f"Résultat : {a} {symbole} {b} = {resultat}")


# Lancer la calculatrice
calculatrice()
```

---

## Navigation

← Fiche précédente : **[04 - Conditions et boucles](04-conditions-boucles.md)**

→ Fiche suivante : **[06 - Modules et packages](06-modules-packages.md)**
