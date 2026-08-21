---
tags:
  - Python
  - Débutant
  - Pratique
description: "Organiser son code avec les modules et packages Python, gérer les dépendances avec pip et les environnements virtuels."
estimated_time: "60 min"
fiche_number: 6
total_fiches: 12
cursus: "Python fondamentaux"
---

# 06 - Modules et packages

> **En bref** : Comprendre comment organiser son code en modules et packages, utiliser les imports, gérer les environnements virtuels avec `venv` et les dépendances avec `pip` et `requirements.txt`. Lecture estimée : 60 min.

## Prérequis

- Fiche 05 : [Fonctions](05-fonctions.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras importer des modules standard, créer tes propres modules, organiser ton code en packages, créer un environnement virtuel et gérer les dépendances de ton projet.

---

## Concepts

### Qu'est-ce qu'un module ?

**Définition** : Un module est un fichier `.py` qui contient des fonctions, des classes et des variables. Tu peux importer un module dans un autre fichier pour réutiliser son contenu sans le réécrire.

**Le problème que les modules résolvent** :

Sans modules, voici les problèmes rencontrés :

1. **Fichiers trop longs** : tout le code est dans un seul fichier de milliers de lignes, impossible à maintenir.
2. **Pas de réutilisation** : le même code utilitaire est copié dans chaque projet.
3. **Conflits de noms** : les fonctions de différentes parties du programme peuvent avoir le même nom et entrer en conflit.

**Comment les modules résolvent ces problèmes** :

| Problème | Solution apportée par les modules |
| -------- | --------------------------------- |
| Fichiers trop longs | On découpe le code en fichiers thématiques |
| Pas de réutilisation | On importe les fonctions depuis un module partagé |
| Conflits de noms | Chaque module crée un espace de noms séparé |

**Analogie concrète** : Un module est comme un tiroir étiqueté dans une caisse à outils. Le tiroir "tournevis" contient tous les tournevis, le tiroir "clés" contient toutes les clés. Quand tu as besoin d'un tournevis cruciforme, tu ouvres le bon tiroir (`import tournevis`) et tu prends l'outil précis (`tournevis.cruciforme`).

**Ce qu'un module n'est PAS** :

- Un module n'est pas un package. Un package est un dossier contenant plusieurs modules. Un module est un seul fichier `.py`.
- Un module n'est pas une bibliothèque externe. Les modules standards sont inclus avec Python. Les bibliothèques externes s'installent avec `pip`.

---

<div class="diagram-design">
<p><a href="../../diagrams/15-python-06-modules-packages-1.html">Qu&#x27;est-ce qu&#x27;un module ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/15-python-06-modules-packages-1.html" title="Qu&#x27;est-ce qu&#x27;un module ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce qu'un package ?

**Définition** : Un package est un dossier contenant un fichier `__init__.py` (qui peut être vide) et un ou plusieurs modules. Il permet d'organiser les modules en une hiérarchie logique.

**Le problème que les packages résolvent** :

Quand un projet grandit, avoir tous les modules au même niveau dans un seul dossier devient chaotique. Les packages ajoutent un niveau d'organisation.

**Analogie concrète** : Si les modules sont des tiroirs, un package est une armoire entière. L'armoire "cuisine" contient les tiroirs "couverts", "ustensiles" et "épices". Cela permet de retrouver chaque chose à sa place, même dans une grande maison.

**Ce qu'un package n'est PAS** :

- Un package n'est pas un package pip (comme `requests` ou `flask`). Un package Python est un dossier avec `__init__.py`. Un package pip est un package distribué et installable.

---

### Les environnements virtuels (`venv`)

**Définition** : Un environnement virtuel est un dossier isolé qui contient une copie de l'interpréteur Python et ses propres packages. Chaque projet peut avoir son environnement virtuel avec ses propres dépendances, sans affecter les autres projets.

**Le problème que les environnements virtuels résolvent** :

Sans environnements virtuels, voici les problèmes rencontrés :

1. **Conflits de versions** : le projet A a besoin de `requests 2.28` et le projet B de `requests 2.31`. Une seule version peut être installée globalement.
2. **Pollution du système** : installer des packages avec `pip` les ajoute au Python système, ce qui peut casser d'autres programmes.
3. **Reproductibilité impossible** : impossible de savoir exactement quels packages sont nécessaires pour un projet.

**Comment les environnements virtuels résolvent ces problèmes** :

| Problème | Solution apportée par `venv` |
| -------- | ---------------------------- |
| Conflits de versions | Chaque projet a ses propres versions de packages |
| Pollution du système | Les packages sont installés dans un dossier isolé |
| Reproductibilité impossible | `pip freeze` liste les versions exactes installées |

**Analogie concrète** : Un environnement virtuel est comme un atelier séparé pour chaque projet de bricolage. L'atelier "étagère" a ses propres vis, clous et outils. L'atelier "table" a les siens. On ne mélange pas les matériaux entre les projets.

---

### `pip` et `requirements.txt`

**Définition** : `pip` est le gestionnaire de packages Python. Il permet d'installer, de mettre à jour et de supprimer des packages depuis PyPI (Python Package Index). Le fichier `requirements.txt` liste toutes les dépendances d'un projet avec leurs versions.

**Le problème que `requirements.txt` résout** :

Sans fichier de dépendances, un nouveau développeur doit deviner quels packages installer. Avec `requirements.txt`, une seule commande installe tout ce qui est nécessaire.

### Alternative moderne : `uv` (optionnel)

**Définition** : `uv` est un gestionnaire de packages et d'environnements Python écrit en Rust. Il remplace souvent `pip` + `venv` (et d'autres outils) avec les mêmes idées : environnement isolé, installation de dépendances, fichier de verrouillage.

**Pourquoi en parler** : en 2025-2026, `uv` est devenu un outil très courant (beaucoup plus rapide que `pip`). Pour ce cursus, `venv` + `pip` restent le socle standard de la bibliothèque Python. Tu peux utiliser `uv` si tu le souhaites :

```bash
# Creer un environnement (equivalent de python3 -m venv .venv)
uv venv

# Installer un package dans l'environnement actif
uv pip install requests

# Installer depuis requirements.txt
uv pip install -r requirements.txt
```

Documentation officielle : [docs.astral.sh/uv](https://docs.astral.sh/uv/)

**Ce que `uv` n'impose pas** : tu n'es pas obligé d'utiliser `uv` pour suivre ce cursus. Toutes les commandes des fiches utilisent `python3 -m venv` et `pip`.

---

## Étapes Pratiques

### Étape 1 : Importer des modules standard

Python inclut une bibliothèque standard riche. Voici les imports les plus courants.

```python
# Import classique : on accède au module avec son nom
import os
print(f"Dossier courant : {os.getcwd()}")

# Import avec alias : raccourcir un nom long
import datetime as dt
maintenant = dt.datetime.now()
print(f"Date actuelle : {maintenant.strftime('%d/%m/%Y %H:%M')}")

# Import ciblé : on importe une fonction précise
from math import sqrt, pi
print(f"Racine de 16 : {sqrt(16)}")
print(f"Pi : {pi:.4f}")

# Import de tout (déconseillé : pollue l'espace de noms)
# from math import *

# Module random : générer des valeurs aléatoires
import random
print(f"Nombre aléatoire : {random.randint(1, 100)}")
print(f"Choix aléatoire : {random.choice(['pomme', 'banane', 'cerise'])}")

# Module sys : informations sur l'interpréteur
import sys
print(f"Version Python : {sys.version}")
```

**Résultat attendu** :

```text
Dossier courant : /home/utilisateur/mon_projet
Date actuelle : 07/04/2026 14:30
Racine de 16 : 4.0
Pi : 3.1416
Nombre aléatoire : 42
Choix aléatoire : banane
Version Python : 3.12.3 (main, Apr  9 2024, 08:00:00) [GCC 13.2.0]
```

---

### Étape 2 : Créer son propre module

Crée un fichier `utils.py` dans ton dossier de projet.

```python
# Fichier : utils.py
"""Module utilitaire avec des fonctions de formatage."""


def formater_nom(prenom, nom):
    """Formate un nom complet avec majuscules.

    Args:
        prenom: Le prénom de la personne.
        nom: Le nom de famille.

    Returns:
        Le nom formaté : "PRENOM Nom".
    """
    return f"{prenom.capitalize()} {nom.upper()}"


def formater_prix(montant, devise="EUR"):
    """Formate un prix avec deux décimales et le symbole de devise.

    Args:
        montant: Le montant numérique.
        devise: Le code de la devise (défaut : EUR).

    Returns:
        Le prix formaté sous forme de chaîne.
    """
    symboles = {"EUR": "€", "USD": "$", "GBP": "£"}
    symbole = symboles.get(devise, devise)
    return f"{montant:.2f} {symbole}"


# Variable du module
VERSION = "1.0.0"
```

Crée un fichier `main.py` qui utilise ce module.

```python
# Fichier : main.py
import utils

# Utiliser les fonctions du module
nom_complet = utils.formater_nom("alice", "dupont")
print(nom_complet)

prix = utils.formater_prix(19.99)
print(prix)

print(f"Version du module : {utils.VERSION}")
```

**Résultat attendu** :

```text
Alice DUPONT
19.99 €
Version du module : 1.0.0
```

---

### Étape 3 : Créer un package

Crée la structure suivante :

```text
mon_projet/
├── main.py
└── calculs/
    ├── __init__.py
    ├── base.py
    └── avance.py
```

```python
# Fichier : calculs/__init__.py
"""Package de calculs mathématiques."""

# Rendre les fonctions principales accessibles directement
from .base import additionner, soustraire
```

```python
# Fichier : calculs/base.py
"""Opérations mathématiques de base."""


def additionner(a, b):
    """Retourne la somme de a et b."""
    return a + b


def soustraire(a, b):
    """Retourne la différence a - b."""
    return a - b
```

```python
# Fichier : calculs/avance.py
"""Opérations mathématiques avancées."""

import math


def calculer_hypotenuse(a, b):
    """Calcule l'hypoténuse d'un triangle rectangle."""
    return math.sqrt(a ** 2 + b ** 2)


def factorielle(n):
    """Calcule la factorielle de n."""
    return math.factorial(n)
```

```python
# Fichier : main.py
# Import depuis le package (via __init__.py)
from calculs import additionner, soustraire

print(additionner(10, 5))
print(soustraire(10, 5))

# Import d'un module spécifique du package
from calculs.avance import calculer_hypotenuse, factorielle

print(calculer_hypotenuse(3, 4))
print(factorielle(5))
```

**Résultat attendu** :

```text
15
5
5.0
120
```

---

### Étape 4 : Créer et activer un environnement virtuel

```bash
# Créer un environnement virtuel nommé "venv"
python3 -m venv venv

# Activer l'environnement virtuel
# Sur Linux/macOS :
source venv/bin/activate

# Sur Windows :
# venv\Scripts\activate

# Vérifier que l'environnement est actif
# Le prompt affiche (venv) au début
which python
```

**Résultat attendu** :

```text
(venv) $ which python
/home/utilisateur/mon_projet/venv/bin/python
```

---

### Étape 5 : Installer des packages avec `pip`

```bash
# Vérifier que pip est disponible
pip --version

# Installer un package
pip install requests

# Installer une version spécifique
pip install requests==2.31.0

# Lister les packages installés
pip list

# Afficher les détails d'un package
pip show requests
```

**Résultat attendu** :

```text
pip 24.x from .../site-packages/pip (python 3.12)
Successfully installed requests-2.32.x
Package    Version
---------- -------
certifi    2024.x.x
charset-normalizer 3.x.x
idna       3.x
requests   2.32.x
urllib3    2.x.x
```

Les numéros de version exacts évoluent. L'important est que `requests` s'installe sans erreur.

---

### Étape 6 : Créer un `requirements.txt`

```bash
# Générer le fichier à partir des packages installés
pip freeze > requirements.txt

# Afficher le contenu
cat requirements.txt
```

**Résultat attendu** :

```text
certifi==2024.2.2
charset-normalizer==3.3.2
idna==3.6
requests==2.31.0
urllib3==2.2.1
```

```bash
# Sur une nouvelle machine : installer toutes les dépendances
pip install -r requirements.txt

# Désactiver l'environnement virtuel
deactivate
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `python3 -m venv venv` | Crée un environnement virtuel |
| `source venv/bin/activate` | Active l'environnement virtuel (Linux/macOS) |
| `deactivate` | Désactive l'environnement virtuel |
| `pip install package` | Installe un package |
| `pip install -r requirements.txt` | Installe toutes les dépendances listées |
| `pip freeze > requirements.txt` | Sauvegarde les dépendances installées |
| `pip list` | Liste les packages installés |
| `pip show package` | Affiche les détails d'un package |
| `pip uninstall package` | Désinstalle un package |
| `python -c "import module; print(module.__file__)"` | Localise un module |

---

## Pièges Fréquents

### Piège 1 : Import circulaire

**Problème** : Le module A importe le module B, et le module B importe le module A. Python entre dans une boucle et lève une `ImportError`.

**Solution** : Réorganiser le code pour éliminer la dépendance circulaire. Extraire le code commun dans un troisième module.

```python
# Incorrect : import circulaire
# fichier_a.py
# from fichier_b import fonction_b  # fichier_b importe fichier_a !

# Correct : extraire dans un module commun
# commun.py (contient le code partagé)
# fichier_a.py (importe commun)
# fichier_b.py (importe commun)
```

---

### Piège 2 : Oublier `__init__.py`

**Problème** : Sans fichier `__init__.py`, Python (avant 3.3) ne reconnaît pas le dossier comme un package. Même en Python 3.3+, où les "namespace packages" existent, il est recommandé de toujours créer `__init__.py` pour la compatibilité et la clarté.

**Solution** : Toujours créer un fichier `__init__.py` dans chaque dossier de package, même s'il est vide.

---

### Piège 3 : Installer des packages sans `venv`

**Problème** : Installer des packages avec `pip install` sans environnement virtuel les installe globalement, ce qui peut créer des conflits entre projets.

**Solution** : Toujours créer et activer un environnement virtuel avant d'installer des packages.

```bash
# Vérifier si un venv est actif (le prompt commence par (venv))
# Si non actif :
python3 -m venv venv
source venv/bin/activate
pip install mon_package
```

---

### Piège 4 : Nommer son fichier comme un module standard

**Problème** : Si tu crées un fichier `random.py` dans ton projet, `import random` importera ton fichier au lieu du module standard Python.

**Solution** : Ne jamais donner à tes fichiers le même nom qu'un module standard (`random.py`, `os.py`, `sys.py`, `math.py`, etc.).

---

## Checklist de Validation

- [ ] Je sais importer un module avec `import` et `from ... import`
- [ ] Je sais créer mon propre module (fichier `.py` avec des fonctions)
- [ ] Je sais créer un package (dossier avec `__init__.py`)
- [ ] Je sais créer et activer un environnement virtuel avec `venv`
- [ ] Je sais installer des packages avec `pip`
- [ ] Je sais générer et utiliser un fichier `requirements.txt`
- [ ] Je connais les pièges des imports circulaires et du nommage

---

## Exercice Pratique

**Énoncé** : Crée un projet structuré avec un module utilitaire personnalisé, un environnement virtuel et un fichier `requirements.txt`.

**Indications** :

- Crée un dossier `mon_projet/` avec la structure suivante :

```text
mon_projet/
├── main.py
├── utils/
│   ├── __init__.py
│   ├── texte.py
│   └── date.py
├── requirements.txt
└── venv/
```

- Le module `texte.py` doit contenir : `compter_mots(texte)`, `inverser_texte(texte)`, `est_palindrome(texte)`
- Le module `date.py` doit contenir : `date_formatee()` (retourne la date au format "jour/mois/année"), `jours_avant_noel()` (retourne le nombre de jours avant le 25 décembre)
- Le fichier `__init__.py` doit exposer les fonctions principales
- `main.py` importe et utilise toutes les fonctions
- Crée un `venv`, installe `requests` et génère le `requirements.txt`

**Résultat attendu** :

```text
=== Utilitaires texte ===
Nombre de mots : 4
Texte inversé : nohtyP neib emia'j ,ruojnoB
Est palindrome ('radar') : True
Est palindrome ('python') : False

=== Utilitaires date ===
Date : JJ/MM/AAAA
Jours avant Noël : N
```

`split()` coupe sur les espaces : `"Bonjour, j'aime bien Python"` donne 4 mots (`Bonjour,`, `j'aime`, `bien`, `Python`). La date et le nombre de jours avant Noël dépendent du jour d'exécution (le 13 août 2026 : `13/08/2026` et `134` jours).

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
# Fichier : utils/texte.py
"""Fonctions utilitaires pour la manipulation de texte."""


def compter_mots(texte):
    """Compte le nombre de mots dans un texte.

    Args:
        texte: La chaîne de caractères à analyser.

    Returns:
        Le nombre de mots.
    """
    return len(texte.split())


def inverser_texte(texte):
    """Inverse une chaîne de caractères.

    Args:
        texte: La chaîne à inverser.

    Returns:
        La chaîne inversée.
    """
    return texte[::-1]


def est_palindrome(texte):
    """Vérifie si un texte est un palindrome.

    Args:
        texte: Le texte à vérifier.

    Returns:
        True si le texte est un palindrome, False sinon.
    """
    texte_propre = texte.lower().replace(" ", "")
    return texte_propre == texte_propre[::-1]
```

```python
# Fichier : utils/date.py
"""Fonctions utilitaires pour les dates."""

import datetime


def date_formatee():
    """Retourne la date actuelle au format jour/mois/année.

    Returns:
        La date formatée en chaîne de caractères.
    """
    return datetime.date.today().strftime("%d/%m/%Y")


def jours_avant_noel():
    """Calcule le nombre de jours avant le 25 décembre.

    Returns:
        Le nombre de jours restants avant Noël.
    """
    aujourdhui = datetime.date.today()
    noel = datetime.date(aujourdhui.year, 12, 25)

    # Si Noël est passé, calculer pour l'année prochaine
    if aujourdhui > noel:
        noel = datetime.date(aujourdhui.year + 1, 12, 25)

    return (noel - aujourdhui).days
```

```python
# Fichier : utils/__init__.py
"""Package utilitaire du projet."""

from .texte import compter_mots, inverser_texte, est_palindrome
from .date import date_formatee, jours_avant_noel
```

```python
# Fichier : main.py
"""Point d'entrée du projet."""

from utils import (
    compter_mots,
    inverser_texte,
    est_palindrome,
    date_formatee,
    jours_avant_noel,
)

print("=== Utilitaires texte ===")
texte = "Bonjour, j'aime bien Python"
print(f"Nombre de mots : {compter_mots(texte)}")
print(f"Texte inversé : {inverser_texte(texte)}")
print(f"Est palindrome ('radar') : {est_palindrome('radar')}")
print(f"Est palindrome ('python') : {est_palindrome('python')}")

print()
print("=== Utilitaires date ===")
print(f"Date : {date_formatee()}")
print(f"Jours avant Noël : {jours_avant_noel()}")
```

```bash
# Commandes pour créer l'environnement
mkdir -p mon_projet/utils
cd mon_projet
python3 -m venv venv
source venv/bin/activate
pip install requests
pip freeze > requirements.txt
python main.py
```

---

## Navigation

← Fiche précédente : **[05 - Fonctions](05-fonctions.md)**

→ Fiche suivante : **[07 - Programmation orientée objet](07-poo-python.md)**
