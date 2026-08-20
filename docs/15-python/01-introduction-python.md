---
tags:
  - Python
  - Débutant
  - Concept
description: "Découvrir Python, installer l'interpréteur, utiliser le REPL et exécuter un premier script."
estimated_time: "60 min"
fiche_number: 1
total_fiches: 12
cursus: "Python fondamentaux"
---

# 01 - Introduction à Python

> **En bref** : Installer Python 3, comprendre ce qui rend ce langage unique et exécuter ton premier programme. Lecture estimée : 60 min.

## Prérequis

- Aucune connaissance préalable de Python n'est requise (tout est expliqué ci-dessous)
- Savoir ouvrir un terminal (invite de commandes)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer Python 3, utiliser le REPL interactif et créer puis exécuter un script Python.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Python ?

**Définition** : Python est un langage de programmation interprété, à typage dynamique, créé par Guido van Rossum en 1991. Sa syntaxe privilégie la lisibilité du code.

**Le problème que Python résout** :

Sans Python (ou un langage similaire de haut niveau), voici les problèmes rencontrés :

1. **Syntaxe complexe** : des langages comme C ou Java imposent beaucoup de code répétitif (accolades, points-virgules, déclarations de types) avant de pouvoir écrire la moindre instruction utile.
2. **Courbe d'apprentissage abrupte** : configurer un environnement de compilation, comprendre les types statiques et gérer la mémoire sont des obstacles pour un débutant.
3. **Prototypage lent** : écrire un petit programme de test nécessite souvent de créer plusieurs fichiers, de compiler, puis d'exécuter.

**Comment Python résout ces problèmes** :

| Problème | Solution apportée par Python |
| --- | --- |
| Syntaxe complexe | Syntaxe épurée, proche de l'anglais, sans accolades ni points-virgules obligatoires |
| Courbe d'apprentissage abrupte | Pas de compilation, pas de déclaration de types obligatoire, retour immédiat dans le REPL |
| Prototypage lent | Un seul fichier `.py` suffit, exécution directe avec `python3 fichier.py` |

**Analogie concrète** : Imagine que tu veux écrire une lettre. Avec un langage comme C, tu dois d'abord acheter du papier spécial, un stylo particulier, et suivre un format strict (marge de 2 cm, police imposée). Avec Python, tu prends n'importe quel papier, n'importe quel stylo, et tu écris directement ce que tu veux dire.

**Ce que Python n'est PAS** :

- Python n'est pas un langage compilé. Le code n'est pas transformé en binaire avant l'exécution. L'interpréteur lit et exécute le code ligne par ligne.
- Python n'est pas limité aux scripts simples. Des entreprises comme Instagram, Spotify et Netflix utilisent Python en production pour des systèmes complexes.
- Python n'est pas lent par défaut pour tout. Pour le calcul scientifique, des bibliothèques comme NumPy exécutent du code optimisé en C sous le capot.

**Langage interprété vs compilé** :

| Langage interprété (Python) | Langage compilé (C, Java) |
| --- | --- |
| Exécution directe ligne par ligne | Compilation nécessaire avant exécution |
| Retour immédiat des erreurs | Erreurs détectées à la compilation |
| Plus lent à l'exécution | Plus rapide à l'exécution |
| Fichier source suffit | Fichier binaire généré |

---

### Qu'est-ce que l'indentation obligatoire ?

**Définition** : En Python, l'indentation (les espaces en début de ligne) fait partie de la syntaxe. Elle délimite les blocs de code à la place des accolades utilisées dans d'autres langages.

**Le problème que l'indentation obligatoire résout** :

Sans indentation obligatoire, voici les problèmes rencontrés :

1. **Code illisible** : dans beaucoup de langages, rien n'empêche d'écrire tout le code sans aucune indentation. Le code fonctionne mais devient impossible à lire.
2. **Incohérence entre développeurs** : chaque développeur choisit son propre style d'indentation (2 espaces, 4 espaces, tabulations), ce qui crée des fichiers incohérents.

**Comment l'indentation obligatoire résout ces problèmes** :

| Problème | Solution apportée par l'indentation obligatoire |
| --- | --- |
| Code illisible | Python refuse d'exécuter du code mal indenté, ce qui force la lisibilité |
| Incohérence entre développeurs | La convention standard est de 4 espaces par niveau, appliquée partout |

**Analogie concrète** : Imagine un classeur de documents. Sans règle d'organisation, chacun range les feuilles n'importe comment. Avec l'indentation obligatoire de Python, c'est comme si le classeur refusait de se fermer tant que les feuilles ne sont pas correctement alignées et triées.

**Ce que l'indentation obligatoire n'est PAS** :

- L'indentation n'est pas optionnelle en Python. Contrairement à JavaScript ou PHP où l'indentation est une bonne pratique mais pas obligatoire, Python génère une erreur `IndentationError` si l'indentation est incorrecte.
- L'indentation n'est pas qu'esthétique. Elle définit la structure logique du programme (quelles lignes appartiennent a quel bloc).

```python
# Correct : le bloc if est indenté de 4 espaces
age = 18
if age >= 18:
    print("Tu es majeur")  # 4 espaces d'indentation
    print("Tu peux voter")  # même niveau = même bloc

# Incorrect : Python génère une erreur IndentationError
# if age >= 18:
# print("Tu es majeur")  # pas d'indentation = erreur
```

---

### Qu'est-ce que le REPL ?

**Définition** : Le REPL (Read-Eval-Print Loop) est un environnement interactif qui lit une instruction Python, l'évalue, affiche le résultat, puis attend l'instruction suivante.

**Le problème que le REPL résout** :

Sans REPL, voici les problèmes rencontrés :

1. **Cycle long pour tester** : il faut créer un fichier, écrire le code, sauvegarder, puis exécuter le fichier pour voir le résultat d'une seule ligne.
2. **Difficile d'explorer** : pour découvrir ce que fait une fonction ou tester une syntaxe, il faut à chaque fois modifier un fichier et le relancer.

**Comment le REPL résout ces problèmes** :

| Problème | Solution apportée par le REPL |
| --- | --- |
| Cycle long pour tester | Tu tapes une instruction et le résultat s'affiche immédiatement |
| Difficile d'explorer | Tu peux tester n'importe quelle expression Python en direct |

**Analogie concrète** : Le REPL est comme une calculatrice. Tu tapes une opération, tu appuies sur "=", et le résultat s'affiche immédiatement. Tu n'as pas besoin de créer un document pour chaque calcul.

**Ce que le REPL n'est PAS** :

- Le REPL n'est pas un éditeur de code. Il ne permet pas de sauvegarder un programme. Pour un vrai programme, il faut créer un fichier `.py`.
- Le REPL n'est pas persistant. Quand tu le fermes, toutes les variables et fonctions que tu as définies disparaissent.

---

## Étapes Pratiques

### Étape 1 : Installer Python 3

**Sur macOS** (avec Homebrew) :

```bash
# Installe Python 3 via Homebrew
brew install python

# Vérifie que Python est bien installé
python3 --version
```

**Sur Linux (Debian/Ubuntu)** :

```bash
# Met à jour la liste des paquets
sudo apt update

# Installe Python 3 et pip (le gestionnaire de paquets Python)
sudo apt install python3 python3-pip

# Vérifie que Python est bien installé
python3 --version
```

**Sur Windows** :

```bash
# Télécharge l'installateur depuis https://www.python.org/downloads/
# Coche "Add Python to PATH" pendant l'installation

# Vérifie que Python est bien installé
python --version
```

**Résultat attendu** :

```text
Python 3.14.x
```

Le numéro exact peut varier (3.12, 3.13, 3.14…), mais il doit commencer par `3.`. Python 3.12+ est recommandé pour ce cursus. La version stable actuelle sur python.org est la branche 3.14 (bugfix) ; 3.13 est aussi en bugfix et 3.12 en corrections de sécurité jusqu'en octobre 2028.

---

### Étape 2 : Utiliser le REPL

```bash
# Lance le REPL Python
python3
```

**Résultat attendu** :

```text
Python 3.14.x (main, ...)
[GCC ...] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Le symbole `>>>` est l'invite du REPL. Tu peux taper des instructions Python :

```python
# Tape ces instructions une par une dans le REPL
>>> 2 + 3
5
>>> "Bonjour" + " " + "Python"
'Bonjour Python'
>>> print("Hello, World!")
Hello, World!
>>> type(42)
<class 'int'>
>>> exit()
```

**Résultat attendu** : chaque instruction affiche immédiatement son résultat. `exit()` ferme le REPL.

---

### Étape 3 : Créer un premier script Python

Crée un fichier nommé `bonjour.py` avec le contenu suivant :

```python
# bonjour.py - Mon premier script Python

# Affiche un message dans le terminal
print("Bonjour, Python !")

# Effectue un calcul et affiche le résultat
resultat = 10 + 20
print("10 + 20 =", resultat)

# Affiche le type de la variable resultat
print("Le type de resultat est :", type(resultat))
```

---

### Étape 4 : Exécuter le script

```bash
# Exécute le script Python
python3 bonjour.py
```

**Résultat attendu** :

```text
Bonjour, Python !
10 + 20 = 30
Le type de resultat est : <class 'int'>
```

---

### Étape 5 : Comprendre les erreurs courantes

Crée un fichier `erreur.py` avec une erreur volontaire :

```python
# erreur.py - Démonstration d'une erreur d'indentation
# ❌ Erreur intentionnelle : indentation manquante (provoque une erreur à l'exécution)

if True:
print("Cette ligne n'est pas indentée")  # Erreur volontaire
```

```bash
# Exécute le script avec l'erreur
python3 erreur.py
```

**Résultat attendu** :

```text
  File "erreur.py", line 5
    print("Cette ligne n'est pas indentée")
    ^
IndentationError: expected an indented block after 'if' statement on line 4
```

Python t'indique le fichier, le numéro de ligne et le type d'erreur. Corrige le fichier en ajoutant 4 espaces devant `print` :

```python
# erreur.py - Version corrigée

if True:
    print("Cette ligne est correctement indentée")  # 4 espaces
```

```bash
# Exécute le script corrigé
python3 erreur.py
```

**Résultat attendu** :

```text
Cette ligne est correctement indentée
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `python3 --version` | Affiche la version de Python installée |
| `python3` | Lance le REPL interactif |
| `python3 fichier.py` | Exécute un script Python |
| `exit()` | Quitte le REPL |
| `pip3 install nom_paquet` | Installe un paquet Python |
| `pip3 list` | Liste les paquets installés |

---

## Pièges Fréquents

### Piège 1 : Utiliser `python` au lieu de `python3`

**Problème** : Sur certains systèmes (notamment Linux), la commande `python` pointe vers Python 2 (obsolète depuis 2020) ou n'existe pas.

**Solution** : Toujours utiliser `python3` pour s'assurer d'utiliser Python 3.

```bash
# Vérifie quelle version est liée à chaque commande
python --version   # Peut afficher Python 2.7.x ou ne pas exister
python3 --version  # Affiche Python 3.x.x
```

---

### Piège 2 : Mélanger tabulations et espaces

**Problème** : Python refuse d'exécuter un fichier qui mélange des tabulations et des espaces pour l'indentation. L'erreur `TabError: inconsistent use of tabs and spaces` apparaît.

**Solution** : Configurer ton éditeur pour utiliser 4 espaces (pas de tabulations). Dans VS Code, vérifie le réglage en bas de la fenêtre : il doit afficher "Spaces: 4".

---

### Piège 3 : Oublier les deux-points après `if`, `for`, `def`

**Problème** : Python attend un `:` à la fin des lignes qui introduisent un bloc (conditions, boucles, fonctions). Sans `:`, l'erreur `SyntaxError: expected ':'` apparaît.

**Solution** : Toujours terminer les lignes `if`, `elif`, `else`, `for`, `while`, `def`, `class` par `:`.

```python
# Incorrect : il manque le ':'
# if age >= 18
#     print("Majeur")

# Correct
if age >= 18:
    print("Majeur")
```

---

## Checklist de Validation

- [ ] J'ai installé Python 3 et vérifié la version avec `python3 --version`
- [ ] Je sais lancer le REPL avec `python3` et le quitter avec `exit()`
- [ ] J'ai exécuté un script `.py` avec `python3 fichier.py`
- [ ] Je comprends que l'indentation (4 espaces) est obligatoire en Python
- [ ] Je sais lire un message d'erreur Python (fichier, ligne, type d'erreur)
- [ ] Je connais la différence entre un langage interprété et un langage compilé

---

## Exercice Pratique

**Énoncé** : Crée un script `salutation.py` qui demande le prénom de l'utilisateur avec `input()` et affiche un message personnalisé.

**Indications** :

- Utilise `input("Texte affiché : ")` pour demander une saisie
- Stocke la réponse dans une variable
- Utilise `print()` pour afficher le message
- Le programme doit afficher exactement : `Bonjour, [prénom] ! Bienvenue en Python.`

**Résultat attendu** :

```text
Quel est ton prénom ? Alice
Bonjour, Alice ! Bienvenue en Python.
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
# salutation.py - Demande le prénom et affiche un message personnalisé

# Demande le prénom de l'utilisateur
# input() affiche le texte entre parenthèses et attend une saisie clavier
prenom = input("Quel est ton prénom ? ")

# Affiche le message personnalisé
# La virgule dans print() ajoute un espace entre les éléments
print("Bonjour,", prenom + " ! Bienvenue en Python.")
```

```bash
# Exécute le script
python3 salutation.py
```

**Résultat attendu** :

```text
Quel est ton prénom ? Alice
Bonjour, Alice ! Bienvenue en Python.
```

**Explication du code** :

1. `input("Quel est ton prénom ? ")` affiche le texte et attend que l'utilisateur tape quelque chose puis appuie sur Entrée. La valeur saisie est stockée dans la variable `prenom`.
2. `print("Bonjour,", prenom + " ! Bienvenue en Python.")` affiche le message. L'opérateur `+` colle le prénom et le reste du texte sans espace, tandis que la virgule dans `print()` ajoute un espace entre `"Bonjour,"` et le prénom.

---

## Navigation

→ Fiche suivante : **[02 - Variables et types de données](02-variables-types.md)**
