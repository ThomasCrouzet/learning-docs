---
tags:
  - Python
  - Intermédiaire
  - Pratique
description: "Utiliser les type hints, le linting avec ruff, le formatage avec black et les tests avec pytest pour améliorer la qualité du code Python."
estimated_time: "60 min"
fiche_number: 11
total_fiches: 12
cursus: "Python fondamentaux"
id: "web.python.outils-qualite"
course_id: "web.python"
content_type: "lesson"
order: 11
---

# 11 - Outils de qualité

> **En bref** : Ajouter des annotations de type avec les type hints, détecter les erreurs avec ruff, formater le code avec black et écrire des tests avec pytest. Lecture estimée : 60 min.

## Prérequis

- Fiche précédente : [10 - Fichiers et entrées/sorties](10-fichiers-io.md)
- Savoir créer des fonctions, des classes et manipuler des fichiers

## Objectif de cette fiche

À la fin de cette fiche, tu sauras annoter tes fonctions avec des type hints, utiliser ruff pour détecter les erreurs, formater ton code avec black et écrire des tests unitaires avec pytest.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que les type hints ?

**Définition** : Les type hints (annotations de type) sont des indications ajoutées au code Python pour préciser le type attendu des variables, des paramètres et des valeurs de retour. Python ne les vérifie pas à l'exécution - ce sont des informations pour les développeurs et les outils d'analyse.

**Le problème que les type hints résolvent** :

Sans les type hints, voici les problèmes rencontrés :

1. **Ambiguïté** : en lisant `def calculer(a, b)`, impossible de savoir si `a` et `b` sont des nombres, des chaînes ou des listes.
2. **Erreurs tardives** : une erreur de type n'est détectée qu'à l'exécution, parfois en production.
3. **Documentation manquante** : il faut lire tout le code ou le docstring pour comprendre les types attendus.

**Comment les type hints résolvent ces problèmes** :

| Problème | Solution apportée par les type hints |
| -------- | ------------------------------------ |
| Ambiguïté | `def calculer(a: int, b: int) -> int` est explicite |
| Erreurs tardives | Des outils d'analyse statique détectent les erreurs de type avant l'exécution |
| Documentation manquante | Les types sont visibles directement dans la signature de la fonction |

**Analogie concrète** : Les type hints sont comme les étiquettes sur les tiroirs d'une commode. Le tiroir (la variable) peut contenir n'importe quoi, mais l'étiquette (le type hint) indique ce qu'on s'attend à y trouver. Si quelqu'un met des chaussettes dans le tiroir étiqueté "T-shirts", l'outil d'analyse te prévient.

**Ce que les type hints ne sont PAS** :

- Les type hints ne sont pas des contraintes d'exécution. Python n'empêche pas de passer un `str` là où un `int` est annoté. Ce n'est pas comme en Java ou TypeScript.
- Les type hints ne ralentissent pas le programme. Python les ignore à l'exécution. Ils n'ont aucun impact sur les performances.

> **Note** : Les outils de vérification statique de types comme `mypy` ou `pyright` permettent de valider les annotations avant l'exécution, mais ils ne font pas partie de ce cursus. Cette fiche couvre uniquement l'écriture des type hints et leur bénéfice pour la lisibilité du code.

---

### Qu'est-ce que le linting ?

**Définition** : Le linting est l'analyse statique du code source pour détecter des erreurs potentielles, des problèmes de style et des pratiques déconseillées, sans exécuter le programme.

**Le problème que le linting résout** :

Sans linting, voici les problèmes rencontrés :

1. **Erreurs évidentes** : une variable mal orthographiée ou un import inutilisé passent inaperçus.
2. **Incohérence de style** : chaque développeur formate le code différemment.
3. **Mauvaises pratiques** : utilisation de `except:` sans type, variables inutilisées, comparaisons avec `==` au lieu de `is` pour `None`.

**Comment le linting résout ces problèmes** :

| Problème | Solution apportée par le linting |
| -------- | -------------------------------- |
| Erreurs évidentes | Le linter signale les variables non définies, les imports manquants |
| Incohérence de style | Le linter applique des règles uniformes à tout le projet |
| Mauvaises pratiques | Le linter connaît les anti-patterns et les signale |

**Comparaison ruff vs pylint** :

| ruff | pylint |
| ---- | ------ |
| Écrit en Rust, très rapide | Écrit en Python, plus lent |
| Remplace flake8, isort, pyupgrade | Outil historique, très complet |
| Configuration simple (pyproject.toml) | Configuration complexe (.pylintrc) |
| Détecte et corrige automatiquement | Détection uniquement |

**Analogie concrète** : Le linter est comme un correcteur orthographique pour ton code. Il souligne les "fautes" (erreurs de style, variables inutilisées) avant que tu ne rendes ta "copie" (que tu n'exécutes le programme).

---

### Qu'est-ce que le formatage automatique ?

**Définition** : Le formatage automatique transforme le code source pour qu'il respecte un style uniforme (indentation, espaces, longueur de ligne) sans modifier son comportement.

**Le problème que le formatage automatique résout** :

Sans formatage automatique, voici les problèmes rencontrés :

1. **Débats de style** : les développeurs perdent du temps à discuter des espaces, des guillemets, de la longueur des lignes.
2. **Revues de code polluées** : les diff affichent des changements de style au lieu des changements de logique.

**Comment le formatage automatique résout ces problèmes** :

| Problème | Solution apportée par black |
| -------- | --------------------------- |
| Débats de style | black impose un style unique, sans option de configuration |
| Revues de code polluées | Le code est toujours formaté de la même manière, les diff ne montrent que la logique |

**Ce que le formatage automatique n'est PAS** :

- Le formatage ne corrige pas les bugs. Il ne modifie que l'apparence du code (espaces, retours à la ligne), pas sa logique.
- black n'est pas un linter. Il ne détecte pas les erreurs, il reformate le code. ruff et black sont complémentaires.

---

### Qu'est-ce que pytest ?

**Définition** : pytest est un framework de tests pour Python. Il permet d'écrire des tests unitaires - des petits programmes qui vérifient qu'une fonction fait ce qu'on attend d'elle.

**Le problème que les tests résolvent** :

Sans tests, voici les problèmes rencontrés :

1. **Régression** : en modifiant une fonction, tu peux casser une autre partie du programme sans t'en rendre compte.
2. **Vérification manuelle** : il faut tester manuellement chaque scénario après chaque modification.
3. **Peur de modifier** : sans tests, on hésite à refactoriser le code par peur de tout casser.

**Comment pytest résout ces problèmes** :

| Problème | Solution apportée par pytest |
| -------- | ---------------------------- |
| Régression | Les tests détectent automatiquement les fonctions cassées |
| Vérification manuelle | Les tests s'exécutent en une commande |
| Peur de modifier | Les tests donnent confiance pour refactoriser |

**Analogie concrète** : Les tests sont comme une checklist de vérification avant un vol. Le pilote (le développeur) vérifie chaque instrument (chaque fonction) avant de décoller (de livrer le code). Si un instrument ne répond pas correctement, le vol est annulé (le test échoue).

**Ce que pytest n'est PAS** :

- pytest ne garantit pas l'absence de bugs. Il vérifie uniquement les scénarios que tu as écrits. Si tu n'as pas testé un cas particulier, pytest ne le détectera pas.
- pytest n'est pas un outil de performance. Il vérifie que le résultat est correct, pas que le code est rapide.

---

## Étapes Pratiques

### Étape 1 : Ajouter des type hints à des fonctions

Les type hints s'ajoutent avec la syntaxe `: type` pour les paramètres et `-> type` pour la valeur de retour.

```python
# Sans type hints : ambiguïté sur les types
def saluer(nom):
    return f"Bonjour {nom} !"


# Avec type hints : les types sont explicites
def saluer_type(nom: str) -> str:
    """Retourne un message de salutation."""
    return f"Bonjour {nom} !"


# Types courants
def additionner(a: int, b: int) -> int:
    """Additionne deux entiers."""
    return a + b


def est_majeur(age: int) -> bool:
    """Vérifie si la personne est majeure."""
    return age >= 18


def afficher_info(nom: str, age: int) -> None:
    """Affiche les informations (ne retourne rien)."""
    print(f"{nom} a {age} ans.")


# Types complexes : listes, dictionnaires, optionnels
def moyenne(notes: list[float]) -> float:
    """Calcule la moyenne d'une liste de notes."""
    if not notes:
        return 0.0
    return sum(notes) / len(notes)


def compter_mots(texte: str) -> dict[str, int]:
    """Compte les occurrences de chaque mot."""
    compteur: dict[str, int] = {}
    for mot in texte.lower().split():
        compteur[mot] = compteur.get(mot, 0) + 1
    return compteur


# Paramètre optionnel avec valeur par défaut
def chercher(nom: str, contacts: list[dict[str, str]] | None = None) -> str | None:
    """Cherche un contact par nom. Retourne l'email ou None."""
    if contacts is None:
        return None
    for contact in contacts:
        if contact.get("nom") == nom:
            return contact.get("email")
    return None


# Test
print(saluer_type("Alice"))
print(additionner(3, 7))
print(est_majeur(25))
print(moyenne([15.0, 12.5, 18.0, 14.0]))
print(compter_mots("le chat mange le poisson"))
```

**Résultat attendu** :

```text
Bonjour Alice !
10
True
14.875
{'le': 2, 'chat': 1, 'mange': 1, 'poisson': 1}
```

---

### Étape 2 : Installer et configurer ruff

ruff est un linter rapide écrit en Rust qui remplace flake8, isort et d'autres outils.

```bash
# Installer ruff
pip install ruff
```

Crée un fichier `exemple_lint.py` avec des problèmes volontaires :

```python
# exemple_lint.py - fichier avec des problèmes de qualité
import os
import sys
import json

def calculer(x,y):
    resultat = x+y
    temp = 42
    return resultat

nom = "Alice"
if nom == None:
    print("pas de nom")

liste = [1,2,3,4,5]
```

Lance ruff pour détecter les problèmes :

```bash
# Analyser le fichier
ruff check exemple_lint.py
```

**Résultat attendu** :

```text
exemple_lint.py:2:8: F401 [*] `os` imported but unused
exemple_lint.py:3:8: F401 [*] `sys` imported but unused
exemple_lint.py:4:8: F401 [*] `json` imported but unused
exemple_lint.py:8:5: F841 Local variable `temp` is assigned to but never used
exemple_lint.py:12:8: E711 Comparison to `None` (use `is` or `is not`)
Found 5 errors.
[*] 3 fixable with the `--fix` option.
```

Corrige automatiquement les problèmes réparables :

```bash
# Corriger automatiquement
ruff check --fix exemple_lint.py

# Vérifier le résultat
ruff check exemple_lint.py
```

Pour configurer ruff dans un projet, ajoute une section dans `pyproject.toml` :

```toml
[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "W", "I", "N", "UP"]
# E = erreurs de style (pycodestyle)
# F = erreurs logiques (pyflakes)
# W = avertissements (pycodestyle)
# I = ordre des imports (isort)
# N = conventions de nommage (pep8-naming)
# UP = modernisation du code (pyupgrade)
```

---

### Étape 3 : Formater du code avec black

black reformate le code pour qu'il respecte un style uniforme.

> **Note** : depuis ruff 0.1+, `ruff format` peut remplacer black (API compatible). Ce cursus présente black car il reste très répandu ; en projet neuf, `ruff check` + `ruff format` suffit souvent.

```bash
# Installer black
pip install black
```

Crée un fichier `exemple_format.py` mal formaté :

```python
# exemple_format.py - code mal formaté
def   calculer( a,b,   c ):
    resultat=a+b*c
    dico = {'nom':'Alice','age':25,  'ville':'Lyon','email':'alice@exemple.com'}
    if resultat>100:
        print(   "Grand nombre"  )
    return resultat

liste_longue = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
```

Formate avec black :

```bash
# Voir les modifications sans les appliquer
black --diff exemple_format.py

# Appliquer le formatage
black exemple_format.py
```

**Résultat attendu** (fichier reformaté) :

```python
# exemple_format.py - code mal formaté
def calculer(a, b, c):
    resultat = a + b * c
    dico = {
        "nom": "Alice",
        "age": 25,
        "ville": "Lyon",
        "email": "alice@exemple.com",
    }
    if resultat > 100:
        print("Grand nombre")
    return resultat


liste_longue = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
]
```

Les changements appliqués par black :

- Espaces autour des opérateurs (`a+b` devient `a + b`)
- Guillemets doubles uniformes (`'Alice'` devient `"Alice"`)
- Dictionnaires longs éclatés sur plusieurs lignes
- Listes longues éclatées sur plusieurs lignes
- Suppression des espaces superflus

---

### Étape 4 : Écrire et exécuter des tests avec pytest

pytest détecte automatiquement les fichiers de test (préfixés par `test_`) et les fonctions de test (préfixées par `test_`).

```bash
# Installer pytest
pip install pytest
```

Crée d'abord un module à tester (`calculs.py`) :

```python
# calculs.py - module à tester
def additionner(a: int, b: int) -> int:
    """Additionne deux nombres."""
    return a + b


def diviser(a: float, b: float) -> float:
    """Divise a par b. Lève ValueError si b vaut 0."""
    if b == 0:
        raise ValueError("Division par zéro impossible.")
    return a / b


def est_palindrome(texte: str) -> bool:
    """Vérifie si un texte est un palindrome (insensible à la casse)."""
    texte_nettoye = texte.lower().replace(" ", "")
    return texte_nettoye == texte_nettoye[::-1]
```

Crée le fichier de tests (`test_calculs.py`) :

```python
# test_calculs.py - tests pour le module calculs
import pytest
from calculs import additionner, diviser, est_palindrome


# --- Tests de additionner ---

def test_additionner_positifs():
    """Vérifie l'addition de deux nombres positifs."""
    assert additionner(2, 3) == 5


def test_additionner_negatifs():
    """Vérifie l'addition avec des nombres négatifs."""
    assert additionner(-1, -2) == -3


def test_additionner_zero():
    """Vérifie l'addition avec zéro."""
    assert additionner(0, 0) == 0


# --- Tests de diviser ---

def test_diviser_normal():
    """Vérifie une division normale."""
    assert diviser(10, 2) == 5.0


def test_diviser_par_zero():
    """Vérifie que la division par zéro lève une exception."""
    # pytest.raises vérifie qu'une exception est levée
    with pytest.raises(ValueError, match="Division par zéro"):
        diviser(10, 0)


# --- Tests de est_palindrome ---

def test_palindrome_simple():
    """Vérifie un palindrome simple."""
    assert est_palindrome("kayak") is True


def test_palindrome_avec_majuscules():
    """Vérifie que la casse est ignorée."""
    assert est_palindrome("Kayak") is True


def test_non_palindrome():
    """Vérifie un mot qui n'est pas un palindrome."""
    assert est_palindrome("python") is False


def test_palindrome_avec_espaces():
    """Vérifie un palindrome avec des espaces."""
    assert est_palindrome("esope reste ici et se repose") is True
```

Exécute les tests :

```bash
# Lancer tous les tests
pytest test_calculs.py -v
```

**Résultat attendu** :

```text
test_calculs.py::test_additionner_positifs PASSED
test_calculs.py::test_additionner_negatifs PASSED
test_calculs.py::test_additionner_zero PASSED
test_calculs.py::test_diviser_normal PASSED
test_calculs.py::test_diviser_par_zero PASSED
test_calculs.py::test_palindrome_simple PASSED
test_calculs.py::test_palindrome_avec_majuscules PASSED
test_calculs.py::test_non_palindrome PASSED
test_calculs.py::test_palindrome_avec_espaces PASSED

9 passed
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `pip install ruff black pytest` | Installer les trois outils |
| `ruff check .` | Analyser tout le projet avec ruff |
| `ruff check --fix .` | Corriger automatiquement les erreurs détectées |
| `black .` | Formater tout le projet avec black |
| `black --check .` | Vérifier le formatage sans modifier les fichiers |
| `black --diff fichier.py` | Voir les modifications sans les appliquer |
| `pytest` | Lancer tous les tests du projet |
| `pytest -v` | Lancer les tests avec le détail de chaque test |
| `pytest test_fichier.py` | Lancer les tests d'un fichier spécifique |
| `pytest -k "palindrome"` | Lancer uniquement les tests dont le nom contient "palindrome" |

---

## Pièges Fréquents

### Piège 1 : Confondre type hints et vérification de type

**Problème** : Les type hints ne bloquent pas l'exécution. Passer un `str` là où un `int` est annoté ne provoque pas d'erreur Python.

**Solution** : Utiliser un vérificateur de type comme mypy ou pyright pour détecter les incohérences.

```python
def additionner(a: int, b: int) -> int:
    return a + b

# Python exécute ce code sans erreur, même si les types sont faux
resultat = additionner("hello", "world")  # Retourne "helloworld"
# Seul mypy ou pyright signalerait l'erreur
```

### Piège 2 : Oublier le préfixe test_ dans les noms

**Problème** : pytest ne détecte que les fichiers commençant par `test_` et les fonctions commençant par `test_`.

**Solution** : Toujours nommer les fichiers `test_*.py` et les fonctions `test_*`.

```python
# Ce test ne sera PAS détecté par pytest
def verifier_addition():
    assert 1 + 1 == 2

# Ce test SERA détecté par pytest
def test_verifier_addition():
    assert 1 + 1 == 2
```

### Piège 3 : Tester plusieurs choses dans un seul test

**Problème** : Un test qui vérifie plusieurs comportements est difficile à comprendre quand il échoue.

**Solution** : Un test = un comportement. Le nom du test décrit ce qu'il vérifie.

```python
# Mauvais : teste trois choses à la fois
def test_calculatrice():
    assert additionner(1, 2) == 3
    assert diviser(10, 2) == 5
    assert est_palindrome("kayak") is True

# Bon : un test par comportement
def test_additionner_deux_positifs():
    assert additionner(1, 2) == 3

def test_diviser_nombres_pairs():
    assert diviser(10, 2) == 5

def test_kayak_est_palindrome():
    assert est_palindrome("kayak") is True
```

---

## Checklist de Validation

- [ ] Je sais ajouter des type hints aux paramètres et valeurs de retour
- [ ] Je sais utiliser les types complexes (`list[int]`, `dict[str, int]`, `str | None`)
- [ ] Je sais installer et utiliser ruff pour analyser mon code
- [ ] Je sais formater du code avec black
- [ ] Je sais écrire des tests avec pytest et les exécuter
- [ ] Je sais tester qu'une exception est levée avec `pytest.raises`
- [ ] Je nomme mes fichiers de test `test_*.py` et mes fonctions `test_*`

---

## Exercice Pratique

**Énoncé** : Tu reçois le script suivant, qui contient des problèmes de qualité. Tu dois l'améliorer en ajoutant des type hints, en corrigeant les erreurs ruff, en formatant avec black, et en écrivant 3 tests pytest.

**Script à améliorer** (`gestionnaire_notes.py`) :

```python
import os
import math

def calculer_moyenne(notes):
    total = 0
    for note in notes:
        total = total + note
    moyenne = total / len(notes)
    return moyenne

def note_lettre(note):
    if note >= 16:
        return 'A'
    elif note>=14:
        return 'B'
    elif note >=12:
        return 'C'
    elif note>=10:
        return 'D'
    else:
        return 'F'

def bulletin(nom,notes):
    moy = calculer_moyenne(notes)
    lettre = note_lettre(moy)
    temp = None
    resultat = {'nom':nom,'moyenne':moy,'lettre':lettre,'notes':notes}
    return resultat
```

**Indications** :

- Supprime les imports inutilisés (`os`, `math`)
- Supprime la variable inutilisée (`temp`)
- Ajoute des type hints à toutes les fonctions
- Formate le code avec black
- Écris au moins 3 tests : `test_calculer_moyenne`, `test_note_lettre_a`, `test_bulletin_complet`

**Résultat attendu** : les 3 tests passent et ruff ne signale aucune erreur.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier amélioré** (`gestionnaire_notes.py`) :

```python
# gestionnaire_notes.py - version améliorée
# Imports inutilisés supprimés (os, math)


def calculer_moyenne(notes: list[float]) -> float:
    """Calcule la moyenne d'une liste de notes."""
    total = 0.0
    for note in notes:
        total = total + note
    moyenne = total / len(notes)
    return moyenne


def note_lettre(note: float) -> str:
    """Convertit une note numérique en lettre."""
    if note >= 16:
        return "A"
    elif note >= 14:
        return "B"
    elif note >= 12:
        return "C"
    elif note >= 10:
        return "D"
    else:
        return "F"


def bulletin(nom: str, notes: list[float]) -> dict[str, str | float | list[float]]:
    """Génère un bulletin avec la moyenne et la lettre.

    Variable inutilisée temp supprimée.
    """
    moy = calculer_moyenne(notes)
    lettre = note_lettre(moy)
    resultat = {"nom": nom, "moyenne": moy, "lettre": lettre, "notes": notes}
    return resultat
```

**Fichier de tests** (`test_gestionnaire_notes.py`) :

```python
# test_gestionnaire_notes.py
from gestionnaire_notes import bulletin, calculer_moyenne, note_lettre


def test_calculer_moyenne():
    """Vérifie le calcul de la moyenne."""
    assert calculer_moyenne([10.0, 20.0]) == 15.0
    assert calculer_moyenne([15.0, 15.0, 15.0]) == 15.0
    assert calculer_moyenne([0.0]) == 0.0


def test_note_lettre_a():
    """Vérifie que 16 et plus donne A."""
    assert note_lettre(16.0) == "A"
    assert note_lettre(20.0) == "A"
    assert note_lettre(15.9) == "B"


def test_note_lettre_toutes():
    """Vérifie toutes les lettres."""
    assert note_lettre(18.0) == "A"
    assert note_lettre(14.0) == "B"
    assert note_lettre(12.0) == "C"
    assert note_lettre(10.0) == "D"
    assert note_lettre(5.0) == "F"


def test_bulletin_complet():
    """Vérifie la génération du bulletin."""
    resultat = bulletin("Alice", [16.0, 18.0, 14.0])
    assert resultat["nom"] == "Alice"
    assert resultat["moyenne"] == 16.0
    assert resultat["lettre"] == "A"
    assert resultat["notes"] == [16.0, 18.0, 14.0]
```

Vérification :

```bash
# Vérifier qu'il n'y a plus d'erreurs ruff
ruff check gestionnaire_notes.py

# Vérifier le formatage
black --check gestionnaire_notes.py

# Lancer les tests
pytest test_gestionnaire_notes.py -v
```

**Résultat attendu** :

```text
test_gestionnaire_notes.py::test_calculer_moyenne PASSED
test_gestionnaire_notes.py::test_note_lettre_a PASSED
test_gestionnaire_notes.py::test_note_lettre_toutes PASSED
test_gestionnaire_notes.py::test_bulletin_complet PASSED

4 passed
```

---

## Navigation

← Fiche précédente : **[10 - Fichiers et entrées/sorties](10-fichiers-io.md)**

→ Fiche suivante : **[12 - Projet intégrateur](12-projet-integrateur.md)**
