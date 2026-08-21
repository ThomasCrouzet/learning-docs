---
tags:
  - Python
  - Débutant
  - Pratique
description: "Maîtriser les structures de contrôle : conditions if/elif/else, boucles for et while, break et continue."
estimated_time: "60 min"
fiche_number: 4
total_fiches: 12
cursus: "Python fondamentaux"
id: "web.python.conditions-boucles"
course_id: "web.python"
content_type: "lesson"
order: 4
---

# 04 - Conditions et boucles

> **En bref** : Contrôler le flux d'exécution d'un programme avec les conditions et les boucles Python. Lecture estimée : 60 min.

## Prérequis

- [Fiche 03 - Listes, tuples et dictionnaires](03-structures-donnees.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des conditions avec `if`/`elif`/`else`, itérer avec les boucles `for` et `while`, et utiliser `break`, `continue` et `enumerate()`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une condition ?

**Définition** : Une condition est une instruction qui exécute un bloc de code uniquement si une expression booléenne est vraie (`True`). En Python, on utilise `if`, `elif` (sinon si) et `else` (sinon).

**Le problème que les conditions résolvent** :

Sans conditions, voici les problèmes rencontrés :

1. **Exécution linéaire** : le programme exécute toutes les lignes dans l'ordre, sans possibilité de choisir un chemin plutôt qu'un autre.
2. **Pas de décision** : impossible de réagir différemment selon les données (par exemple, afficher "majeur" ou "mineur" selon l'âge).
3. **Pas de validation** : impossible de vérifier qu'une saisie utilisateur est correcte avant de l'utiliser.

**Comment les conditions résolvent ces problèmes** :

| Problème | Solution apportée par les conditions |
| --- | --- |
| Exécution linéaire | Le programme choisit quel bloc exécuter selon une condition |
| Pas de décision | `if`/`elif`/`else` permet de traiter chaque cas séparément |
| Pas de validation | On vérifie la saisie avant de l'utiliser |

**Analogie concrète** : Une condition est comme un carrefour routier. Selon le panneau (la condition), tu tournes a gauche, a droite ou tu continues tout droit. Le programme choisit une seule direction a chaque carrefour.

**Ce qu'une condition n'est PAS** :

- Une condition n'exécute pas tous les blocs. Un seul bloc parmi `if`/`elif`/`else` est exécuté a chaque passage. Dès qu'une condition est vraie, les suivantes sont ignorées.
- Une condition n'est pas une boucle. Elle s'exécute une seule fois, pas en boucle.

**Opérateurs de comparaison** :

| Opérateur | Signification | Exemple |
| --- | --- | --- |
| `==` | Égal a | `age == 18` |
| `!=` | Différent de | `age != 18` |
| `<` | Inférieur a | `age < 18` |
| `>` | Supérieur a | `age > 18` |
| `<=` | Inférieur ou égal a | `age <= 18` |
| `>=` | Supérieur ou égal a | `age >= 18` |

**Opérateurs logiques** :

| Opérateur | Signification | Exemple |
| --- | --- | --- |
| `and` | ET logique (les deux conditions doivent être vraies) | `age >= 18 and age <= 65` |
| `or` | OU logique (au moins une condition doit être vraie) | `age < 18 or age > 65` |
| `not` | Négation (inverse la condition) | `not est_majeur` |

---

### Qu'est-ce que la boucle `for` ?

**Définition** : La boucle `for` parcourt les éléments d'une séquence (liste, tuple, chaîne, range) un par un et exécute un bloc de code pour chaque élément.

**Le problème que la boucle `for` résout** :

Sans boucle `for`, voici les problèmes rencontrés :

1. **Répétition de code** : pour afficher 100 éléments d'une liste, il faudrait écrire 100 lignes `print()`.
2. **Code non adaptable** : si la liste passe de 100 a 200 éléments, il faut ajouter 100 lignes supplémentaires.

**Comment la boucle `for` résout ces problèmes** :

| Problème | Solution apportée par la boucle `for` |
| --- | --- |
| Répétition de code | Une seule boucle traite tous les éléments, peu importe leur nombre |
| Code non adaptable | La boucle s'adapte automatiquement a la taille de la séquence |

**Analogie concrète** : La boucle `for` est comme un facteur qui distribue le courrier. Il prend chaque lettre (élément) de son sac (la liste), la livre a la bonne adresse (exécute le code), puis passe a la lettre suivante. Il s'arrête quand le sac est vide.

**Ce que la boucle `for` n'est PAS** :

- La boucle `for` ne tourne pas indéfiniment. Elle s'arrête quand tous les éléments de la séquence ont été parcourus.
- La boucle `for` ne modifie pas la séquence d'origine (sauf si tu modifies explicitement les éléments).

---

### Qu'est-ce que la boucle `while` ?

**Définition** : La boucle `while` répète un bloc de code tant qu'une condition est vraie. Elle s'arrête dès que la condition devient fausse.

**Le problème que la boucle `while` résout** :

Sans boucle `while`, voici les problèmes rencontrés :

1. **Nombre d'itérations inconnu** : on ne sait pas a l'avance combien de fois il faudra répéter (par exemple, demander un mot de passe jusqu'à ce qu'il soit correct).
2. **Attente d'un événement** : on doit attendre qu'une condition spécifique soit remplie avant de continuer.

**Comment la boucle `while` résout ces problèmes** :

| Problème | Solution apportée par la boucle `while` |
| --- | --- |
| Nombre d'itérations inconnu | La boucle continue jusqu'à ce que la condition devienne fausse |
| Attente d'un événement | La boucle vérifie la condition a chaque tour |

**Comparaison `for` vs `while`** :

| Boucle `for` | Boucle `while` |
| --- | --- |
| Nombre d'itérations connu ou déterminé par une séquence | Nombre d'itérations inconnu a l'avance |
| Parcourt une séquence (liste, range) | Teste une condition a chaque tour |
| S'arrête automatiquement a la fin de la séquence | Nécessite une condition de sortie explicite |
| Utilisée pour : parcourir une liste, répéter N fois | Utilisée pour : attendre une saisie correcte, jeu |

---

### Qu'est-ce que `break` et `continue` ?

**Définition** : `break` interrompt immédiatement la boucle en cours. `continue` saute le reste du tour actuel et passe au tour suivant.

**Le problème que `break` et `continue` résolvent** :

Sans `break` et `continue`, voici les problèmes rencontrés :

1. **Sortie anticipée impossible** : si tu trouves l'élément cherché au 3e tour, la boucle continue inutilement les 97 tours restants.
2. **Code imbriqué** : pour ignorer certains cas, il faut imbriquer des `if` dans la boucle, rendant le code plus profond et difficile a lire.

**Comment `break` et `continue` résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Sortie anticipée impossible | `break` arrête la boucle dès que le résultat est trouvé |
| Code imbriqué | `continue` saute les cas a ignorer sans ajouter de niveau d'indentation |

**Analogie concrète** : Imagine que tu cherches un livre précis dans une bibliothèque. `break`, c'est arrêter de chercher dès que tu trouves le livre. `continue`, c'est passer un rayon qui ne contient que des magazines (pas ce que tu cherches) et aller directement au rayon suivant.

---

## Étapes Pratiques

### Étape 1 : Écrire des conditions simples

Crée un fichier `conditions.py` :

```python
# conditions.py - Conditions if/elif/else

# Condition simple
age = 20

if age >= 18:
    print("Tu es majeur.")
else:
    print("Tu es mineur.")

# Conditions multiples avec elif
note = 15

if note >= 16:
    mention = "Très bien"
elif note >= 14:
    mention = "Bien"
elif note >= 12:
    mention = "Assez bien"
elif note >= 10:
    mention = "Passable"
else:
    mention = "Insuffisant"

print(f"Note : {note}/20 - Mention : {mention}")

# Opérateurs logiques
age = 25
revenu = 2000

if age >= 18 and revenu >= 1500:
    print("Éligible au prêt bancaire.")
elif age >= 18 and revenu < 1500:
    print("Majeur mais revenu insuffisant.")
else:
    print("Non éligible (mineur).")

# Opérateur not
est_connecte = False

if not est_connecte:
    print("Veuillez vous connecter.")

# Vérifier si une valeur est None
resultat = None

if resultat is None:
    print("Aucun résultat disponible.")
```

```bash
python3 conditions.py
```

**Résultat attendu** :

```text
Tu es majeur.
Note : 15/20 - Mention : Bien
Éligible au prêt bancaire.
Veuillez vous connecter.
Aucun résultat disponible.
```

---

### Étape 2 : Conditions imbriquées

Crée un fichier `conditions_imbriquees.py` :

```python
# conditions_imbriquees.py - Conditions imbriquées et validation

# Validation de saisie
saisie = input("Entre ton âge : ")

# Vérifier que la saisie est un nombre
if saisie.isdigit():
    age = int(saisie)

    # Vérifier la tranche d'âge
    if age < 0:
        print("Un âge ne peut pas être négatif.")
    elif age < 13:
        print("Catégorie : Enfant")
    elif age < 18:
        print("Catégorie : Adolescent")
    elif age < 65:
        print("Catégorie : Adulte")
    else:
        print("Catégorie : Senior")
else:
    print(f"'{saisie}' n'est pas un nombre valide.")

# Conditions avec in (vérifier l'appartenance)
jour = "lundi"
jours_travail = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"]

if jour in jours_travail:
    print(f"{jour} est un jour de travail.")
else:
    print(f"{jour} est un jour de repos.")

# Expression ternaire (condition sur une seule ligne)
age = 20
statut = "majeur" if age >= 18 else "mineur"
print(f"Statut : {statut}")
```

```bash
python3 conditions_imbriquees.py
```

**Résultat attendu** (en tapant `25`) :

```text
Entre ton âge : 25
Catégorie : Adulte
lundi est un jour de travail.
Statut : majeur
```

---

### Étape 3 : Boucle `for` avec listes et `range()`

Crée un fichier `boucle_for.py` :

```python
# boucle_for.py - Boucle for sur différentes séquences

# Parcourir une liste
fruits = ["pomme", "banane", "cerise", "orange"]

print("=== Fruits ===")
for fruit in fruits:
    print(f"  - {fruit}")

# Parcourir avec range()
print("\n=== Compteur de 1 à 5 ===")
for i in range(1, 6):  # range(début, fin) - fin est exclue
    print(f"  {i}")

# range() avec 3 arguments : range(début, fin, pas)
print("\n=== Nombres pairs de 0 à 10 ===")
for i in range(0, 11, 2):
    print(f"  {i}")

# Parcourir une chaîne de caractères
print("\n=== Lettres ===")
mot = "Python"
for lettre in mot:
    print(f"  {lettre}")

# enumerate() : obtenir l'index et la valeur
print("\n=== Fruits numérotés ===")
for index, fruit in enumerate(fruits):
    print(f"  {index + 1}. {fruit}")

# enumerate() avec un index de départ
print("\n=== Fruits numérotés (start=1) ===")
for numero, fruit in enumerate(fruits, start=1):
    print(f"  {numero}. {fruit}")

# Parcourir un dictionnaire
etudiant = {"nom": "Alice", "age": 25, "ville": "Paris"}

print("\n=== Dictionnaire ===")
for cle, valeur in etudiant.items():
    print(f"  {cle} : {valeur}")
```

```bash
python3 boucle_for.py
```

**Résultat attendu** :

```text
=== Fruits ===
  - pomme
  - banane
  - cerise
  - orange

=== Compteur de 1 à 5 ===
  1
  2
  3
  4
  5

=== Nombres pairs de 0 à 10 ===
  0
  2
  4
  6
  8
  10

=== Lettres ===
  P
  y
  t
  h
  o
  n

=== Fruits numérotés ===
  1. pomme
  2. banane
  3. cerise
  4. orange

=== Fruits numérotés (start=1) ===
  1. pomme
  2. banane
  3. cerise
  4. orange

=== Dictionnaire ===
  nom : Alice
  age : 25
  ville : Paris
```

---

### Étape 4 : Boucle `while`

Crée un fichier `boucle_while.py` :

```python
# boucle_while.py - Boucle while avec condition de sortie

# Compteur simple
print("=== Compteur ===")
compteur = 1
while compteur <= 5:
    print(f"  Tour {compteur}")
    compteur += 1  # Ne pas oublier d'incrémenter, sinon boucle infinie

# Validation de saisie avec while
print("\n=== Validation de saisie ===")
while True:
    saisie = input("Entre un nombre entre 1 et 10 : ")

    # Vérifier que c'est un nombre
    if not saisie.isdigit():
        print("Ce n'est pas un nombre. Réessaie.")
        continue  # Retourne au début de la boucle

    nombre = int(saisie)

    if 1 <= nombre <= 10:
        print(f"Merci ! Tu as choisi {nombre}.")
        break  # Sort de la boucle
    else:
        print("Le nombre doit être entre 1 et 10. Réessaie.")

# Accumulation avec while
print("\n=== Somme cumulative ===")
total = 0
i = 1
while i <= 100:
    total += i  # Ajoute i au total
    i += 1
print(f"La somme de 1 à 100 est : {total}")
```

```bash
python3 boucle_while.py
```

**Résultat attendu** (en tapant `abc` puis `15` puis `7`) :

```text
=== Compteur ===
  Tour 1
  Tour 2
  Tour 3
  Tour 4
  Tour 5

=== Validation de saisie ===
Entre un nombre entre 1 et 10 : abc
Ce n'est pas un nombre. Réessaie.
Entre un nombre entre 1 et 10 : 15
Le nombre doit être entre 1 et 10. Réessaie.
Entre un nombre entre 1 et 10 : 7
Merci ! Tu as choisi 7.

=== Somme cumulative ===
La somme de 1 à 100 est : 5050
```

---

### Étape 5 : `break` et `continue`

Crée un fichier `break_continue.py` :

```python
# break_continue.py - Contrôle du flux dans les boucles

# break : arrêter la boucle quand on trouve ce qu'on cherche
print("=== Recherche avec break ===")
nombres = [4, 7, 2, 9, 1, 5, 8, 3]
cible = 9

for nombre in nombres:
    print(f"  Vérifie {nombre}...")
    if nombre == cible:
        print(f"  Trouvé : {cible} !")
        break  # Sort de la boucle immédiatement
# Sans break, la boucle aurait continué avec 1, 5, 8, 3

# continue : sauter certains éléments
print("\n=== Nombres impairs avec continue ===")
for i in range(1, 11):
    if i % 2 == 0:
        continue  # Saute les nombres pairs, passe au tour suivant
    print(f"  {i}")

# Combinaison for + if + break : trouver le premier multiple de 7
print("\n=== Premier multiple de 7 après 50 ===")
for n in range(51, 100):
    if n % 7 == 0:
        print(f"  Le premier multiple de 7 après 50 est : {n}")
        break

# Boucle for avec else (le else s'exécute si pas de break)
print("\n=== Recherche avec else ===")
liste = [2, 4, 6, 8]
cherche = 5

for element in liste:
    if element == cherche:
        print(f"  {cherche} trouvé !")
        break
else:
    # Ce bloc s'exécute uniquement si la boucle n'a PAS été interrompue par break
    print(f"  {cherche} n'est pas dans la liste.")
```

```bash
python3 break_continue.py
```

**Résultat attendu** :

```text
=== Recherche avec break ===
  Vérifie 4...
  Vérifie 7...
  Vérifie 2...
  Vérifie 9...
  Trouvé : 9 !

=== Nombres impairs avec continue ===
  1
  3
  5
  7
  9

=== Premier multiple de 7 après 50 ===
  Le premier multiple de 7 après 50 est : 56

=== Recherche avec else ===
  5 n'est pas dans la liste.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `if condition:` | Exécute le bloc si la condition est vraie |
| `elif condition:` | Teste une condition supplémentaire |
| `else:` | Bloc exécuté si aucune condition précédente n'est vraie |
| `for x in sequence:` | Parcourt chaque élément de la séquence |
| `while condition:` | Répète tant que la condition est vraie |
| `range(n)` | Génère les nombres de 0 a n-1 |
| `range(a, b)` | Génère les nombres de a a b-1 |
| `range(a, b, pas)` | Génère les nombres de a a b-1 avec un pas |
| `enumerate(seq)` | Retourne l'index et la valeur de chaque élément |
| `break` | Interrompt la boucle immédiatement |
| `continue` | Saute au tour suivant de la boucle |

---

## Pièges Fréquents

### Piège 1 : Boucle `while` infinie

**Problème** : Oublier d'incrémenter le compteur dans une boucle `while` crée une boucle qui ne s'arrête jamais. Le programme semble bloqué.

**Solution** : Toujours s'assurer que la condition de la boucle `while` finira par devenir fausse. Pour arrêter une boucle infinie accidentelle, appuie sur `Ctrl+C` dans le terminal.

```python
# Incorrect : boucle infinie
# compteur = 0
# while compteur < 5:
#     print(compteur)  # compteur ne change jamais !

# Correct : le compteur est incrémenté
compteur = 0
while compteur < 5:
    print(compteur)
    compteur += 1  # Incrémentation obligatoire
```

---

### Piège 2 : Utiliser `=` au lieu de `==` dans une condition

**Problème** : `=` est l'opérateur d'assignation, `==` est l'opérateur de comparaison. Utiliser `=` dans un `if` génère une erreur `SyntaxError`.

**Solution** : Toujours utiliser `==` pour comparer deux valeurs.

```python
age = 18

# Incorrect : SyntaxError
# if age = 18:  # Assignation, pas comparaison

# Correct : comparaison
if age == 18:
    print("Tu as exactement 18 ans.")
```

---

### Piège 3 : `range()` exclut la borne supérieure

**Problème** : `range(1, 5)` génère `1, 2, 3, 4` (pas `5`). C'est une source fréquente d'erreur "off by one".

**Solution** : Pour inclure la borne supérieure, ajouter 1 : `range(1, 6)` génère `1, 2, 3, 4, 5`.

```python
# Affiche 1 à 5 (pas 1 à 4)
for i in range(1, 6):  # 6 est exclu, donc on va jusqu'à 5
    print(i)
```

---

### Piège 4 : Comparer avec `is` au lieu de `==`

**Problème** : `is` compare l'identité (même objet en mémoire), `==` compare la valeur. Pour les nombres et chaînes, `is` peut fonctionner par hasard mais ce n'est pas fiable.

**Solution** : Utiliser `==` pour comparer des valeurs. Réserver `is` pour `None` uniquement (`if x is None`).

```python
# Correct : utiliser == pour les valeurs
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)  # True (mêmes valeurs)
print(a is b)  # False (objets différents en mémoire)

# Correct : utiliser is pour None
resultat = None
if resultat is None:
    print("Pas de résultat")
```

---

## Checklist de Validation

- [ ] Je sais écrire une condition `if`/`elif`/`else`
- [ ] Je connais les opérateurs de comparaison (`==`, `!=`, `<`, `>`, `<=`, `>=`)
- [ ] Je sais utiliser les opérateurs logiques `and`, `or`, `not`
- [ ] Je sais parcourir une liste avec `for`
- [ ] Je maîtrise `range()` avec 1, 2 ou 3 arguments
- [ ] Je sais utiliser `enumerate()` pour avoir l'index et la valeur
- [ ] Je sais écrire une boucle `while` avec une condition de sortie
- [ ] Je comprends la différence entre `break` et `continue`
- [ ] Je sais utiliser `==` pour comparer et `is` uniquement pour `None`

---

## Exercice Pratique

**Énoncé** : Crée un script `devinette.py` qui implémente un jeu de devinette. Le programme choisit un nombre aléatoire entre 1 et 100, et l'utilisateur doit le deviner. À chaque tentative, le programme indique si le nombre cherché est "plus grand" ou "plus petit". Le programme affiche le nombre de tentatives a la fin.

**Indications** :

- Utilise `import random` et `random.randint(1, 100)` pour générer un nombre aléatoire
- Utilise une boucle `while True` pour les tentatives
- Utilise `break` quand le nombre est trouvé
- Compte le nombre de tentatives avec un compteur
- Valide que la saisie est un nombre avec `isdigit()`

**Résultat attendu** :

```text
=== Jeu de devinette ===
Je pense à un nombre entre 1 et 100.

Ton essai : 50
C'est plus grand !
Ton essai : 75
C'est plus petit !
Ton essai : 62
C'est plus grand !
Ton essai : 68
Bravo ! Tu as trouvé 68 en 4 tentatives !
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
# devinette.py - Jeu de devinette (nombre entre 1 et 100)

# Importe le module random pour générer un nombre aléatoire
import random

# Génère un nombre aléatoire entre 1 et 100 (bornes incluses)
nombre_secret = random.randint(1, 100)

# Compteur de tentatives
tentatives = 0

print("=== Jeu de devinette ===")
print("Je pense à un nombre entre 1 et 100.\n")

# Boucle principale du jeu
while True:
    # Demande une tentative a l'utilisateur
    saisie = input("Ton essai : ")

    # Vérifie que la saisie est un nombre
    if not saisie.isdigit():
        print("Entre un nombre valide.")
        continue  # Retourne au début de la boucle sans compter de tentative

    # Convertit la saisie en entier
    essai = int(saisie)

    # Incrémente le compteur de tentatives
    tentatives += 1

    # Compare l'essai avec le nombre secret
    if essai < nombre_secret:
        print("C'est plus grand !")
    elif essai > nombre_secret:
        print("C'est plus petit !")
    else:
        # Le nombre est trouvé
        print(f"Bravo ! Tu as trouvé {nombre_secret} en {tentatives} tentatives !")
        break  # Sort de la boucle
```

```bash
# Exécute le jeu
python3 devinette.py
```

**Explication du code** :

1. `import random` charge le module `random` de la bibliothèque standard Python.
2. `random.randint(1, 100)` génère un entier aléatoire entre 1 et 100 (bornes incluses).
3. `while True` crée une boucle infinie qui ne s'arrête que lorsque le joueur trouve le bon nombre.
4. `continue` est utilisé pour ignorer les saisies non numériques sans incrémenter le compteur.
5. `break` sort de la boucle quand `essai == nombre_secret`.
6. La f-string `f"Bravo ! Tu as trouvé {nombre_secret} en {tentatives} tentatives !"` affiche le résultat final avec les variables intégrées dans le texte.

---

## Navigation

← Fiche précédente : **[03 - Listes, tuples et dictionnaires](03-structures-donnees.md)**

→ Fiche suivante : **[05 - Fonctions](05-fonctions.md)**
