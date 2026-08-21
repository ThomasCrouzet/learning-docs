---
tags:
  - Python
  - Débutant
  - Concept
description: "Comprendre les variables, les types de données fondamentaux et les conversions de types en Python."
estimated_time: "60 min"
fiche_number: 2
total_fiches: 12
cursus: "Python fondamentaux"
---

# 02 - Variables et types de données

> **En bref** : Maîtriser les variables, les types de base (int, float, str, bool, None) et les conversions de types en Python. Lecture estimée : 60 min.

## Prérequis

- [Fiche 01 - Introduction à Python](01-introduction-python.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des variables, identifier les types de données fondamentaux, convertir entre types et manipuler les chaînes de caractères avec les f-strings.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une variable ?

**Définition** : Une variable est un nom qui pointe vers une valeur stockée en mémoire. En Python, on crée une variable en lui assignant une valeur avec le signe `=`.

**Le problème que les variables résolvent** :

Sans variables, voici les problèmes rencontrés :

1. **Répétition de valeurs** : si tu utilises le même nombre ou texte à plusieurs endroits, tu dois le retaper à chaque fois. Si la valeur change, tu dois la modifier partout.
2. **Code incompréhensible** : un calcul comme `3.14159 * 5 * 5` ne dit rien sur ce qu'il calcule. Impossible de savoir que `3.14159` est pi et `5` est un rayon.
3. **Pas de mémoire** : sans variable, le résultat d'un calcul est perdu immédiatement. Tu ne peux pas le réutiliser dans un autre calcul.

**Comment les variables résolvent ces problèmes** :

| Problème | Solution apportée par les variables |
| --- | --- |
| Répétition de valeurs | On modifie la variable une seule fois, tous les endroits qui l'utilisent sont mis à jour |
| Code incompréhensible | Le nom de la variable décrit ce qu'elle contient (`rayon`, `prix_total`) |
| Pas de mémoire | La valeur reste accessible tant que la variable existe |

**Analogie concrète** : Une variable est comme une étiquette collée sur une boîte. L'étiquette porte un nom (`rayon`) et la boîte contient une valeur (`5`). Tu peux à tout moment lire l'étiquette pour savoir ce que contient la boîte, ou remplacer le contenu de la boîte par une nouvelle valeur.

**Ce qu'une variable n'est PAS** :

- Une variable n'est pas une constante. En Python, rien n'empêche de changer la valeur d'une variable. Par convention, une constante est écrite en MAJUSCULES (`PI = 3.14159`), mais Python ne l'empêche pas d'être modifiée.
- Une variable n'est pas un conteneur fixe. Contrairement à des langages comme Java, une variable Python peut changer de type à tout moment (`x = 5` puis `x = "texte"` est valide).

**Conventions de nommage en Python** :

| Convention | Exemple | Usage |
| --- | --- | --- |
| `snake_case` | `nom_utilisateur` | Variables et fonctions |
| `UPPER_SNAKE_CASE` | `MAX_TENTATIVES` | Constantes (par convention) |
| `PascalCase` | `MonObjet` | Classes (vu dans la fiche POO) |

Règles obligatoires pour les noms de variables :

- Commence par une lettre ou un underscore (`_`), jamais par un chiffre
- Contient uniquement des lettres, chiffres et underscores
- Sensible a la casse (`age` et `Age` sont deux variables différentes)
- Ne peut pas être un mot réservé Python (`if`, `for`, `class`, `return`, etc.)

---

### Quels sont les types de base en Python ?

**Définition** : Un type de données définit la nature d'une valeur (nombre entier, nombre décimal, texte, vrai/faux) et les opérations possibles sur cette valeur.

**Le problème que les types résolvent** :

Sans système de types, voici les problèmes rencontrés :

1. **Opérations absurdes** : additionner un texte et un nombre n'a pas de sens, mais sans types, le programme ne peut pas le détecter.
2. **Résultats imprévisibles** : `"5" + 3` pourrait donner `"53"` (concaténation) ou `8` (addition) selon les langages. Sans types, impossible de prédire le comportement.

**Comment les types résolvent ces problèmes** :

| Problème | Solution apportée par les types |
| --- | --- |
| Opérations absurdes | Python génère une erreur `TypeError` quand une opération est impossible entre deux types |
| Résultats imprévisibles | Chaque type a des règles claires sur les opérations autorisées |

**Les 5 types fondamentaux** :

| Type | Nom Python | Exemple | Description |
| --- | --- | --- | --- |
| Entier | `int` | `42`, `-7`, `0` | Nombre sans virgule, précision illimitée |
| Décimal | `float` | `3.14`, `-0.5`, `1.0` | Nombre a virgule flottante |
| Chaîne | `str` | `"Bonjour"`, `'Python'` | Texte entre guillemets simples ou doubles |
| Booléen | `bool` | `True`, `False` | Valeur logique (vrai ou faux) |
| Rien | `NoneType` | `None` | Absence de valeur |

**Analogie concrète** : Les types sont comme les unités de mesure. Tu ne peux pas additionner 5 kilogrammes et 3 mètres, car ce sont des unités différentes. De la même façon, Python refuse d'additionner un texte et un nombre car ce sont des types différents.

---

### Qu'est-ce que le typage dynamique ?

**Définition** : Le typage dynamique signifie que le type d'une variable est déterminé automatiquement au moment de l'exécution, en fonction de la valeur qu'on lui assigne. Il n'est pas nécessaire de déclarer le type a l'avance.

**Le problème que le typage dynamique résout** :

Sans typage dynamique (dans un langage a typage statique comme Java), voici les problèmes rencontrés :

1. **Verbosité** : il faut écrire `int age = 25;` au lieu de `age = 25`. Chaque variable nécessite une déclaration de type.
2. **Rigidité** : une variable déclarée comme `int` ne peut jamais contenir un texte. Il faut créer une nouvelle variable.

**Comment le typage dynamique résout ces problèmes** :

| Problème | Solution apportée par le typage dynamique |
| --- | --- |
| Verbosité | Pas besoin de déclarer le type, Python le déduit de la valeur |
| Rigidité | Une variable peut changer de type à tout moment |

**Comparaison typage statique vs dynamique** :

| Typage statique (Java) | Typage dynamique (Python) |
| --- | --- |
| `int age = 25;` | `age = 25` |
| `String nom = "Alice";` | `nom = "Alice"` |
| Erreur a la compilation si mauvais type | Erreur a l'exécution si opération incompatible |
| Plus de code, moins de bugs de types | Moins de code, plus de flexibilité |

**Ce que le typage dynamique n'est PAS** :

- Le typage dynamique ne signifie pas "pas de types". Chaque valeur a un type précis. C'est juste que le type n'est pas déclaré explicitement par le développeur.
- Le typage dynamique ne signifie pas "tout est permis". `"texte" + 5` génère une erreur `TypeError`. Python vérifie les types au moment de l'exécution.

---

## Étapes Pratiques

### Étape 1 : Créer des variables

Crée un fichier `variables.py` :

```python
# variables.py - Création et utilisation de variables

# Entier (int)
age = 25
print("Age :", age)

# Décimal (float)
taille = 1.75
print("Taille :", taille)

# Chaîne de caractères (str)
prenom = "Alice"
print("Prénom :", prenom)

# Booléen (bool)
est_majeur = True
print("Est majeur :", est_majeur)

# None (absence de valeur)
resultat = None
print("Résultat :", resultat)
```

```bash
# Exécute le script
python3 variables.py
```

**Résultat attendu** :

```text
Age : 25
Taille : 1.75
Prénom : Alice
Est majeur : True
Résultat : None
```

---

### Étape 2 : Vérifier les types avec `type()`

Crée un fichier `types_check.py` :

```python
# types_check.py - Vérification des types de données

age = 25
taille = 1.75
prenom = "Alice"
est_majeur = True
resultat = None

# type() retourne le type de la valeur contenue dans la variable
print(type(age))         # <class 'int'>
print(type(taille))      # <class 'float'>
print(type(prenom))      # <class 'str'>
print(type(est_majeur))  # <class 'bool'>
print(type(resultat))    # <class 'NoneType'>

# Le typage dynamique permet de changer le type d'une variable
x = 10          # x est un int
print(type(x))  # <class 'int'>

x = "texte"     # x est maintenant un str
print(type(x))  # <class 'str'>
```

```bash
python3 types_check.py
```

**Résultat attendu** :

```text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
<class 'NoneType'>
<class 'int'>
<class 'str'>
```

---

### Étape 3 : Convertir entre types

Crée un fichier `conversions.py` :

```python
# conversions.py - Conversions de types (casting)

# str vers int
texte_nombre = "42"
nombre = int(texte_nombre)  # Convertit la chaîne "42" en entier 42
print(nombre, type(nombre))  # 42 <class 'int'>

# str vers float
texte_decimal = "3.14"
decimal = float(texte_decimal)  # Convertit la chaîne "3.14" en décimal
print(decimal, type(decimal))  # 3.14 <class 'float'>

# int vers str
age = 25
age_texte = str(age)  # Convertit l'entier 25 en chaîne "25"
print(age_texte, type(age_texte))  # 25 <class 'str'>

# int vers float
entier = 10
flottant = float(entier)  # Convertit 10 en 10.0
print(flottant, type(flottant))  # 10.0 <class 'float'>

# float vers int (attention : la partie décimale est tronquée, pas arrondie)
decimal = 3.99
entier = int(decimal)  # Tronque à 3, ne arrondit pas
print(entier, type(entier))  # 3 <class 'int'>

# input() retourne toujours un str
saisie = input("Entre un nombre : ")
print(type(saisie))  # <class 'str'> même si tu tapes "42"

# Pour l'utiliser comme nombre, il faut convertir
nombre_saisi = int(saisie)
print(nombre_saisi + 10)  # Maintenant l'addition fonctionne
```

```bash
python3 conversions.py
```

**Résultat attendu** (en tapant `5` quand demandé) :

```text
42 <class 'int'>
3.14 <class 'float'>
25 <class 'str'>
10.0 <class 'float'>
3 <class 'int'>
Entre un nombre : 5
<class 'str'>
15
```

---

### Étape 4 : Manipuler les chaînes de caractères

Crée un fichier `chaines.py` :

```python
# chaines.py - Opérations sur les chaînes de caractères

# Concaténation avec +
prenom = "Alice"
nom = "Dupont"
nom_complet = prenom + " " + nom  # Colle les chaînes ensemble
print(nom_complet)  # Alice Dupont

# F-strings (méthode recommandée depuis Python 3.6)
age = 25
message = f"Je m'appelle {prenom} et j'ai {age} ans."
print(message)  # Je m'appelle Alice et j'ai 25 ans.

# Les f-strings acceptent des expressions
prix = 19.99
quantite = 3
print(f"Total : {prix * quantite:.2f} euros")  # Total : 59.97 euros

# Méthodes de chaînes courantes
texte = "  Bonjour Python  "
print(texte.strip())      # "Bonjour Python" (supprime les espaces)
print(texte.upper())      # "  BONJOUR PYTHON  " (majuscules)
print(texte.lower())      # "  bonjour python  " (minuscules)
print(texte.replace("Python", "World"))  # "  Bonjour World  "

# Longueur d'une chaîne
print(len(prenom))  # 5

# Accéder à un caractère par son index (commence à 0)
print(prenom[0])  # A (premier caractère)
print(prenom[1])  # l (deuxième caractère)
print(prenom[-1]) # e (dernier caractère)

# Vérifier si une sous-chaîne est présente
print("Ali" in prenom)    # True
print("Bob" in prenom)    # False

# Découper une chaîne
phrase = "un,deux,trois"
morceaux = phrase.split(",")  # Découpe selon la virgule
print(morceaux)  # ['un', 'deux', 'trois']
```

```bash
python3 chaines.py
```

**Résultat attendu** :

```text
Alice Dupont
Je m'appelle Alice et j'ai 25 ans.
Total : 59.97 euros
Bonjour Python
  BONJOUR PYTHON
  bonjour python
  Bonjour World
5
A
l
e
True
False
['un', 'deux', 'trois']
```

---

### Étape 5 : Opérations arithmétiques

Crée un fichier `operations.py` :

```python
# operations.py - Opérateurs arithmétiques Python

a = 17
b = 5

print(f"{a} + {b} = {a + b}")   # Addition : 22
print(f"{a} - {b} = {a - b}")   # Soustraction : 12
print(f"{a} * {b} = {a * b}")   # Multiplication : 85
print(f"{a} / {b} = {a / b}")   # Division (retourne un float) : 3.4
print(f"{a} // {b} = {a // b}") # Division entière : 3
print(f"{a} % {b} = {a % b}")   # Modulo (reste de la division) : 2
print(f"{a} ** {b} = {a ** b}") # Puissance : 1419857

# Assignation combinée
compteur = 0
compteur += 1   # Équivalent à : compteur = compteur + 1
print(f"Compteur : {compteur}")  # 1

compteur *= 5   # Équivalent à : compteur = compteur * 5
print(f"Compteur : {compteur}")  # 5
```

```bash
python3 operations.py
```

**Résultat attendu** :

```text
17 + 5 = 22
17 - 5 = 12
17 * 5 = 85
17 / 5 = 3.4
17 // 5 = 3
17 % 5 = 2
17 ** 5 = 1419857
Compteur : 1
Compteur : 5
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `type(valeur)` | Retourne le type d'une valeur |
| `int(valeur)` | Convertit en entier |
| `float(valeur)` | Convertit en nombre décimal |
| `str(valeur)` | Convertit en chaîne de caractères |
| `bool(valeur)` | Convertit en booléen |
| `len(chaine)` | Retourne la longueur d'une chaîne |
| `input("texte")` | Demande une saisie à l'utilisateur (retourne un `str`) |

---

## Pièges Fréquents

### Piège 1 : `input()` retourne toujours un `str`

**Problème** : Tu tapes `42` dans `input()`, mais `saisie + 10` génère une erreur `TypeError` car `saisie` est un `str`, pas un `int`.

**Solution** : Toujours convertir le résultat de `input()` vers le type souhaité.

```python
# Incorrect : génère TypeError
# saisie = input("Nombre : ")
# resultat = saisie + 10  # TypeError: can only concatenate str to str

# Correct : convertir avant d'utiliser
saisie = input("Nombre : ")
nombre = int(saisie)  # Conversion str -> int
resultat = nombre + 10
print(resultat)
```

---

### Piège 2 : Division par zéro

**Problème** : `10 / 0` génère une erreur `ZeroDivisionError`.

**Solution** : Toujours vérifier que le diviseur n'est pas zéro avant de diviser.

```python
diviseur = 0
if diviseur != 0:
    resultat = 10 / diviseur
else:
    print("Impossible de diviser par zéro")
```

---

### Piège 3 : Conversion impossible

**Problème** : `int("abc")` génère une erreur `ValueError` car le texte `"abc"` ne peut pas être converti en nombre.

**Solution** : S'assurer que la chaîne contient bien un nombre valide avant de la convertir.

```python
texte = "abc"
if texte.isdigit():
    nombre = int(texte)
else:
    print(f"'{texte}' n'est pas un nombre valide")
```

---

### Piège 4 : Précision des `float`

**Problème** : `0.1 + 0.2` affiche `0.30000000000000004` au lieu de `0.3`. C'est dû a la représentation binaire des nombres décimaux en mémoire.

**Solution** : Utiliser `round()` pour arrondir le résultat, ou la fonction `f"{valeur:.2f}"` pour l'affichage.

```python
print(0.1 + 0.2)                 # 0.30000000000000004
print(round(0.1 + 0.2, 2))       # 0.3
print(f"{0.1 + 0.2:.2f}")        # 0.30
```

---

## Checklist de Validation

- [ ] Je sais créer une variable avec l'opérateur `=`
- [ ] Je connais les 5 types de base : `int`, `float`, `str`, `bool`, `None`
- [ ] Je sais vérifier le type d'une variable avec `type()`
- [ ] Je sais convertir entre types avec `int()`, `float()`, `str()`
- [ ] Je maîtrise les f-strings pour formater du texte
- [ ] Je connais les opérateurs arithmétiques (`+`, `-`, `*`, `/`, `//`, `%`, `**`)
- [ ] Je sais que `input()` retourne toujours un `str`

---

## Exercice Pratique

**Énoncé** : Crée un script `convertisseur.py` qui convertit une température de Celsius vers Fahrenheit. Le programme demande la température en Celsius a l'utilisateur et affiche le résultat en Fahrenheit.

**Indications** :

- Formule : `fahrenheit = celsius * 9/5 + 32`
- Utilise `input()` pour la saisie et `float()` pour la conversion
- Affiche le résultat avec 1 décimale en utilisant une f-string
- Le programme doit afficher : `XX.X °C = YY.Y °F`

**Résultat attendu** :

```text
Entre une température en Celsius : 100
100.0 °C = 212.0 °F
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
# convertisseur.py - Convertisseur Celsius vers Fahrenheit

# Demande la température en Celsius
# input() retourne un str, on le convertit en float pour accepter les décimales
saisie = input("Entre une température en Celsius : ")
celsius = float(saisie)

# Applique la formule de conversion
# Fahrenheit = Celsius * 9/5 + 32
fahrenheit = celsius * 9/5 + 32

# Affiche le résultat avec 1 décimale
# :.1f signifie "1 chiffre après la virgule"
print(f"{celsius:.1f} °C = {fahrenheit:.1f} °F")
```

```bash
# Exécute le convertisseur
python3 convertisseur.py
```

**Résultat attendu** (en tapant `100`) :

```text
Entre une température en Celsius : 100
100.0 °C = 212.0 °F
```

**Résultat attendu** (en tapant `0`) :

```text
Entre une température en Celsius : 0
0.0 °C = 32.0 °F
```

**Explication du code** :

1. `input()` récupère la saisie sous forme de texte (`str`).
2. `float(saisie)` convertit le texte en nombre décimal. On utilise `float` plutôt que `int` pour accepter des valeurs comme `36.6`.
3. La formule `celsius * 9/5 + 32` effectue la conversion. Python respecte les priorités mathématiques (multiplication et division avant addition).
4. `f"{celsius:.1f}"` formate le nombre avec exactement 1 chiffre après la virgule.

---

## Navigation

← Fiche précédente : **[01 - Introduction à Python](01-introduction-python.md)**

→ Fiche suivante : **[03 - Listes, tuples et dictionnaires](03-structures-donnees.md)**
