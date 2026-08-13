---
tags:
  - Python
  - Intermédiaire
  - Concept
description: "Comprendre et utiliser le système d'exceptions Python : try/except/finally, raise, exceptions personnalisées et gestionnaire de contexte with."
estimated_time: "60 min"
fiche_number: 9
total_fiches: 12
cursus: "Python fondamentaux"
---

# 09 - Gestion des erreurs

> **En bref** : Comprendre le mécanisme des exceptions en Python, capturer les erreurs avec `try`/`except`/`else`/`finally`, lever des exceptions avec `raise`, créer des exceptions personnalisées et utiliser le gestionnaire de contexte `with`. Lecture estimée : 60 min.

## Prérequis

- Fiche précédente : [08 - POO avancée](08-poo-avancee.md)
- Savoir créer des classes et utiliser l'héritage

## Objectif de cette fiche

À la fin de cette fiche, tu sauras capturer et gérer les erreurs dans tes programmes Python, créer tes propres exceptions et utiliser le gestionnaire de contexte `with` pour gérer les ressources de manière sûre.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une exception ?

**Définition** : Une exception est un événement qui se produit pendant l'exécution d'un programme et qui interrompt le flux normal des instructions. En Python, les exceptions sont des objets qui contiennent des informations sur l'erreur survenue.

**Le problème que les exceptions résolvent** :

Sans les exceptions, voici les problèmes rencontrés :

1. **Crash brutal** : le programme s'arrête sans explication claire pour l'utilisateur.
2. **Erreurs silencieuses** : sans mécanisme de remontée, une erreur dans une fonction peut passer inaperçue et corrompre les données.
3. **Code défensif partout** : il faudrait tester chaque opération avec des `if` imbriqués, rendant le code illisible.

**Comment les exceptions résolvent ces problèmes** :

| Problème | Solution apportée par les exceptions |
| -------- | ------------------------------------ |
| Crash brutal | On capture l'erreur et on affiche un message compréhensible |
| Erreurs silencieuses | L'exception remonte automatiquement jusqu'à être traitée |
| Code défensif partout | On sépare le code normal du code de gestion d'erreur |

**Analogie concrète** : Imagine que tu cuisines. Si tu renverses une casserole (erreur), tu ne quittes pas la cuisine immédiatement. Tu nettoies (gestion d'erreur), puis tu décides si tu recommences ou si tu passes à autre chose. Sans gestion d'erreur, c'est comme si chaque incident te forçait à quitter la cuisine définitivement.

**Ce qu'une exception n'est PAS** :

- Une exception n'est pas un bug. Un bug est une erreur de logique dans le code. Une exception est un mécanisme prévu pour gérer les situations anormales (fichier introuvable, division par zéro, entrée utilisateur invalide).
- Une exception n'est pas un message `print`. Un `print` affiche un texte, mais ne modifie pas le flux d'exécution du programme. Une exception interrompt le flux et cherche un gestionnaire adapté.

---

### La hiérarchie des exceptions

**Définition** : En Python, toutes les exceptions sont des classes organisées en une hiérarchie d'héritage. La classe de base est `BaseException`, et la plupart des exceptions que tu utiliseras héritent de `Exception`.

**Les exceptions les plus courantes** :

| Exception | Quand elle survient | Exemple |
| --------- | ------------------- | ------- |
| `ValueError` | Valeur incorrecte pour le type attendu | `int("abc")` |
| `TypeError` | Opération sur un type incompatible | `"hello" + 42` |
| `KeyError` | Clé absente d'un dictionnaire | `d["inexistant"]` |
| `IndexError` | Index hors limites d'une liste | `liste[999]` |
| `FileNotFoundError` | Fichier introuvable | `open("inexistant.txt")` |
| `ZeroDivisionError` | Division par zéro | `10 / 0` |
| `AttributeError` | Attribut inexistant sur un objet | `"hello".inexistant` |
| `NameError` | Variable non définie | `print(variable_inexistante)` |

**Hiérarchie simplifiée** :

```text
BaseException
├── SystemExit
├── KeyboardInterrupt
└── Exception
    ├── ValueError
    ├── TypeError
    ├── KeyError
    ├── IndexError
    ├── FileNotFoundError (hérite de OSError)
    ├── ZeroDivisionError (hérite de ArithmeticError)
    └── AttributeError
```

**Pourquoi c'est important** : quand tu captures `Exception`, tu captures aussi toutes ses sous-classes. Capturer `BaseException` est déconseillé car cela intercepte aussi `KeyboardInterrupt` (Ctrl+C) et `SystemExit`.

---

### Le bloc try/except/else/finally

**Définition** : Le bloc `try`/`except` permet de tenter d'exécuter du code (`try`) et de capturer les exceptions qui surviennent (`except`). Les blocs `else` et `finally` sont optionnels.

**Le rôle de chaque bloc** :

| Bloc | Quand il s'exécute | Obligatoire |
| ---- | ------------------ | ----------- |
| `try` | Toujours (contient le code à surveiller) | Oui |
| `except` | Uniquement si une exception survient dans `try` | Oui (au moins un) |
| `else` | Uniquement si aucune exception ne survient dans `try` | Non |
| `finally` | Toujours, qu'il y ait une exception ou non | Non |

**Analogie concrète** : C'est comme un essai sportif. `try` = tu tentes le saut. `except` = si tu tombes, voici comment te rattraper. `else` = si le saut est réussi, on passe à la suite. `finally` = dans tous les cas, on range le matériel.

---

### Le mot-clé raise

**Définition** : Le mot-clé `raise` permet de lever (déclencher) une exception volontairement. C'est utile quand ton code détecte une situation anormale et doit signaler une erreur.

**Ce que raise n'est PAS** :

- `raise` n'est pas un `return`. `return` renvoie une valeur à l'appelant. `raise` interrompt le flux normal et cherche un bloc `except` capable de traiter l'exception.
- `raise` n'est pas un `print`. `print` affiche un message sans interrompre le programme. `raise` interrompt l'exécution.

---

### Les exceptions personnalisées

**Définition** : Une exception personnalisée est une classe que tu crées en héritant de `Exception`. Elle te permet de définir des erreurs spécifiques à ton application.

**Le problème que les exceptions personnalisées résolvent** :

Sans exceptions personnalisées, voici les problèmes rencontrés :

1. **Messages génériques** : les exceptions standards ne décrivent pas précisément le problème métier.
2. **Capture trop large** : impossible de distinguer une erreur de validation d'une erreur de calcul si toutes deux lèvent `ValueError`.

**Comment les exceptions personnalisées résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Messages génériques | On crée une exception avec un nom explicite (`AgeInvalideError`) |
| Capture trop large | On peut capturer séparément chaque type d'erreur métier |

---

### Le gestionnaire de contexte with

**Définition** : Le mot-clé `with` crée un bloc de code qui garantit que les ressources (fichiers, connexions, verrous) sont correctement libérées, même en cas d'exception.

**Le problème que with résout** :

Sans `with`, voici les problèmes rencontrés :

1. **Oubli de fermeture** : si tu oublies `fichier.close()`, le fichier reste ouvert et consomme des ressources.
2. **Fermeture manquée en cas d'erreur** : si une exception survient entre `open()` et `close()`, le fichier n'est jamais fermé.

**Comment with résout ces problèmes** :

| Problème | Solution apportée par with |
| -------- | -------------------------- |
| Oubli de fermeture | La fermeture est automatique à la fin du bloc `with` |
| Fermeture manquée en cas d'erreur | `with` garantit la fermeture même si une exception survient |

**Analogie concrète** : C'est comme une porte automatique dans un magasin. Tu entres (début du bloc `with`), tu fais tes courses (ton code), et la porte se ferme automatiquement quand tu sors, que tu partes normalement ou en courant (exception).

---

## Étapes Pratiques

### Étape 1 : Capturer des exceptions courantes

Le bloc `try`/`except` le plus simple capture une exception et affiche un message.

```python
# Capturer une ValueError
try:
    # L'utilisateur tape "abc" au lieu d'un nombre
    nombre = int("abc")
except ValueError:
    # Ce bloc s'exécute car "abc" ne peut pas être converti en entier
    print("Erreur : la valeur saisie n'est pas un nombre valide.")
```

**Résultat attendu** :

```text
Erreur : la valeur saisie n'est pas un nombre valide.
```

Tu peux aussi récupérer le message de l'exception :

```python
# Récupérer les détails de l'exception avec "as"
try:
    resultat = 10 / 0
except ZeroDivisionError as e:
    # "e" contient l'objet exception avec son message
    print(f"Erreur : {e}")
```

**Résultat attendu** :

```text
Erreur : division by zero
```

---

### Étape 2 : Capturer plusieurs types d'exceptions

Tu peux capturer différents types d'exceptions avec plusieurs blocs `except`.

```python
def diviser(a, b):
    """Divise a par b avec gestion des erreurs."""
    try:
        # On tente la division
        resultat = a / b
    except ZeroDivisionError:
        # Division par zéro
        print("Erreur : impossible de diviser par zéro.")
        return None
    except TypeError:
        # Types incompatibles (ex: "hello" / 2)
        print("Erreur : les deux arguments doivent être des nombres.")
        return None
    else:
        # S'exécute uniquement si aucune exception n'a été levée
        print(f"Résultat : {resultat}")
        return resultat
    finally:
        # S'exécute toujours, qu'il y ait une erreur ou non
        print("Fin de l'opération de division.")


# Test avec des valeurs valides
diviser(10, 3)

# Test avec division par zéro
diviser(10, 0)

# Test avec un type invalide
diviser("hello", 2)
```

**Résultat attendu** :

```text
Résultat : 3.3333333333333335
Fin de l'opération de division.
Erreur : impossible de diviser par zéro.
Fin de l'opération de division.
Erreur : les deux arguments doivent être des nombres.
Fin de l'opération de division.
```

Tu peux aussi capturer plusieurs exceptions dans un seul bloc :

```python
try:
    valeur = int(input("Entre un nombre : "))
    resultat = 100 / valeur
except (ValueError, ZeroDivisionError) as e:
    # Capture les deux types d'erreur dans le même bloc
    print(f"Entrée invalide : {e}")
```

---

### Étape 3 : Utiliser else et finally

Le bloc `else` s'exécute quand aucune exception ne survient dans le `try`. Le bloc `finally` s'exécute toujours.

```python
def lire_age(texte):
    """Lit un âge saisi par l'utilisateur."""
    try:
        age = int(texte)
    except ValueError:
        print("Ce n'est pas un nombre valide.")
        return None
    else:
        # Ce bloc s'exécute uniquement si int() a réussi
        # On y place les vérifications qui dépendent du succès de try
        if age < 0 or age > 150:
            print("L'âge doit être entre 0 et 150.")
            return None
        print(f"Âge enregistré : {age}")
        return age
    finally:
        # S'exécute toujours, même si on a fait un return avant
        print("Traitement terminé.")


# Test avec une valeur valide
lire_age("25")
print("---")

# Test avec une valeur invalide
lire_age("abc")
print("---")

# Test avec un âge hors limites
lire_age("200")
```

**Résultat attendu** :

```text
Âge enregistré : 25
Traitement terminé.
---
Ce n'est pas un nombre valide.
Traitement terminé.
---
L'âge doit être entre 0 et 150.
Traitement terminé.
```

---

### Étape 4 : Créer et lever des exceptions personnalisées

Crée tes propres exceptions en héritant de `Exception`.

```python
# Définition des exceptions personnalisées
class AgeInvalideError(Exception):
    """Exception levée quand l'âge est hors limites."""

    def __init__(self, age, message=None):
        # On stocke l'âge pour pouvoir le récupérer plus tard
        self.age = age
        if message is None:
            message = f"L'âge {age} n'est pas valide (doit être entre 0 et 150)."
        # On appelle le constructeur parent avec le message
        super().__init__(message)


class EmailInvalideError(Exception):
    """Exception levée quand l'email ne contient pas de @."""

    def __init__(self, email):
        self.email = email
        super().__init__(f"L'email '{email}' est invalide : il doit contenir un @.")


# Fonctions qui utilisent ces exceptions
def valider_age(age):
    """Valide que l'âge est un entier entre 0 et 150."""
    if not isinstance(age, int):
        raise TypeError("L'âge doit être un entier.")
    if age < 0 or age > 150:
        # On lève notre exception personnalisée
        raise AgeInvalideError(age)
    return age


def valider_email(email):
    """Valide que l'email contient un @."""
    if "@" not in email:
        raise EmailInvalideError(email)
    return email


# Utilisation
try:
    valider_age(200)
except AgeInvalideError as e:
    print(f"Erreur d'âge : {e}")
    print(f"Âge reçu : {e.age}")

try:
    valider_email("thomas.exemple.com")
except EmailInvalideError as e:
    print(f"Erreur d'email : {e}")
    print(f"Email reçu : {e.email}")
```

**Résultat attendu** :

```text
Erreur d'âge : L'âge 200 n'est pas valide (doit être entre 0 et 150).
Âge reçu : 200
Erreur d'email : L'email 'thomas.exemple.com' est invalide : il doit contenir un @.
Email reçu : thomas.exemple.com
```

---

### Étape 5 : Utiliser with pour les fichiers

Le gestionnaire de contexte `with` garantit la fermeture du fichier.

```python
# Écrire dans un fichier avec with
with open("exemple.txt", "w", encoding="utf-8") as fichier:
    # Le fichier est ouvert en mode écriture
    fichier.write("Bonjour depuis Python !\n")
    fichier.write("Le fichier sera fermé automatiquement.\n")
# Ici, le fichier est déjà fermé, même si une erreur survient

# Lire le fichier avec with
with open("exemple.txt", "r", encoding="utf-8") as fichier:
    contenu = fichier.read()
    print(contenu)
```

**Résultat attendu** :

```text
Bonjour depuis Python !
Le fichier sera fermé automatiquement.
```

Combiner `with` et `try`/`except` :

```python
try:
    with open("fichier_inexistant.txt", "r", encoding="utf-8") as fichier:
        contenu = fichier.read()
except FileNotFoundError:
    print("Le fichier n'existe pas.")
```

**Résultat attendu** :

```text
Le fichier n'existe pas.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `try: ... except: ...` | Capturer une exception |
| `except ValueError as e:` | Capturer une exception et récupérer ses détails |
| `except (TypeError, ValueError):` | Capturer plusieurs types d'exceptions |
| `raise ValueError("message")` | Lever une exception |
| `raise` (sans argument dans un except) | Re-lever l'exception courante |
| `with open(...) as f:` | Ouvrir un fichier avec fermeture automatique |

---

## Pièges Fréquents

### Piège 1 : Capturer toutes les exceptions avec un except nu

**Problème** : Utiliser `except:` sans préciser le type d'exception capture tout, y compris `KeyboardInterrupt` (Ctrl+C) et `SystemExit`.

**Solution** : Toujours préciser le type d'exception, ou au minimum utiliser `except Exception:`.

```python
# Mauvais : capture tout, même Ctrl+C
try:
    resultat = int(input("Nombre : "))
except:
    print("Erreur")

# Bon : capture uniquement les exceptions standards
try:
    resultat = int(input("Nombre : "))
except Exception as e:
    print(f"Erreur : {e}")
```

### Piège 2 : Ignorer silencieusement les erreurs

**Problème** : Capturer une exception sans rien faire (`pass`) masque les bugs.

**Solution** : Au minimum, journaliser l'erreur.

```python
# Mauvais : l'erreur disparaît silencieusement
try:
    valeur = int("abc")
except ValueError:
    pass

# Bon : on informe au moins dans les logs
import logging

try:
    valeur = int("abc")
except ValueError as e:
    logging.warning("Conversion échouée : %s", e)
    valeur = 0  # Valeur par défaut explicite
```

### Piège 3 : Mettre trop de code dans le try

**Problème** : Un bloc `try` trop large peut capturer des exceptions qui ne viennent pas de l'opération visée.

**Solution** : Limiter le bloc `try` au strict minimum.

```python
# Mauvais : on ne sait pas quelle ligne a provoqué le ValueError
try:
    texte = input("Nombre : ")
    nombre = int(texte)
    resultat = nombre * 2
    print(resultat)
except ValueError:
    print("Erreur de conversion")

# Bon : seule la conversion est dans le try
texte = input("Nombre : ")
try:
    nombre = int(texte)
except ValueError:
    print("Erreur de conversion")
else:
    resultat = nombre * 2
    print(resultat)
```

---

## Checklist de Validation

- [ ] Je sais capturer une exception avec `try`/`except`
- [ ] Je sais capturer plusieurs types d'exceptions
- [ ] Je comprends le rôle de `else` et `finally`
- [ ] Je sais lever une exception avec `raise`
- [ ] Je sais créer une exception personnalisée
- [ ] Je sais utiliser `with` pour ouvrir des fichiers
- [ ] Je ne capture jamais `except:` sans préciser le type

---

## Exercice Pratique

**Énoncé** : Crée un programme de saisie sécurisée qui valide les entrées utilisateur. Le programme demande un âge, un email et un mot de passe. Chaque validation utilise une exception personnalisée.

**Règles de validation** :

- **Âge** : doit être un entier entre 13 et 120
- **Email** : doit contenir exactement un `@` et au moins un `.` après le `@`
- **Mot de passe** : doit avoir au moins 8 caractères, contenir au moins une majuscule et au moins un chiffre

**Indications** :

- Crée trois exceptions personnalisées : `AgeError`, `EmailError`, `MotDePasseError`
- Chaque exception stocke la valeur reçue et un message descriptif
- Crée une fonction `valider_inscription(age, email, mot_de_passe)` qui lève l'exception appropriée
- Le programme principal capture chaque exception et affiche le message d'erreur

**Résultat attendu** (exemple avec des valeurs invalides) :

```text
Validation de l'inscription...
Erreur d'âge : L'âge 10 n'est pas valide (doit être au moins 13).
Erreur d'email : L'email 'test.exemple.com' est invalide (doit contenir un @).
Erreur de mot de passe : Le mot de passe est invalide (trop court (3 caractères, minimum 8)).
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
# --- Exceptions personnalisées ---

class AgeError(Exception):
    """Exception levée quand l'âge est invalide."""

    def __init__(self, age, raison):
        self.age = age
        self.raison = raison
        super().__init__(f"L'âge {age} n'est pas valide ({raison}).")


class EmailError(Exception):
    """Exception levée quand l'email est invalide."""

    def __init__(self, email, raison):
        self.email = email
        self.raison = raison
        super().__init__(f"L'email '{email}' est invalide ({raison}).")


class MotDePasseError(Exception):
    """Exception levée quand le mot de passe est invalide."""

    def __init__(self, raison):
        self.raison = raison
        super().__init__(f"Le mot de passe est invalide ({raison}).")


# --- Fonctions de validation ---

def valider_age(age_texte):
    """Valide et convertit l'âge."""
    # Étape 1 : convertir en entier
    try:
        age = int(age_texte)
    except ValueError:
        raise AgeError(age_texte, "doit être un nombre entier")

    # Étape 2 : vérifier les limites
    if age < 13:
        raise AgeError(age, "doit être au moins 13")
    if age > 120:
        raise AgeError(age, "doit être au maximum 120")

    return age


def valider_email(email):
    """Valide le format de l'email."""
    if "@" not in email:
        raise EmailError(email, "doit contenir un @")

    # Séparer la partie avant et après le @
    parties = email.split("@")
    if len(parties) != 2:
        raise EmailError(email, "doit contenir exactement un @")

    avant, apres = parties
    if not avant:
        raise EmailError(email, "la partie avant @ ne peut pas être vide")
    if "." not in apres:
        raise EmailError(email, "doit contenir un . après le @")

    return email


def valider_mot_de_passe(mot_de_passe):
    """Valide la robustesse du mot de passe."""
    if len(mot_de_passe) < 8:
        raise MotDePasseError(
            f"trop court ({len(mot_de_passe)} caractères, minimum 8)"
        )

    # Vérifier la présence d'une majuscule
    if not any(c.isupper() for c in mot_de_passe):
        raise MotDePasseError("doit contenir au moins une majuscule")

    # Vérifier la présence d'un chiffre
    if not any(c.isdigit() for c in mot_de_passe):
        raise MotDePasseError("doit contenir au moins un chiffre")

    return mot_de_passe


def valider_inscription(age_texte, email, mot_de_passe):
    """Valide toutes les données d'inscription.

    Collecte toutes les erreurs avant de les afficher.
    """
    erreurs = []

    # Valider chaque champ indépendamment
    try:
        valider_age(age_texte)
    except AgeError as e:
        erreurs.append(f"Erreur d'âge : {e}")

    try:
        valider_email(email)
    except EmailError as e:
        erreurs.append(f"Erreur d'email : {e}")

    try:
        valider_mot_de_passe(mot_de_passe)
    except MotDePasseError as e:
        erreurs.append(f"Erreur de mot de passe : {e}")

    return erreurs


# --- Programme principal ---

print("Validation de l'inscription...")
print()

# Test avec des valeurs invalides
erreurs = valider_inscription("10", "test.exemple.com", "abc")

if erreurs:
    for erreur in erreurs:
        print(erreur)
else:
    print("Inscription valide.")

print()

# Test avec des valeurs valides
print("Test avec des valeurs valides :")
erreurs = valider_inscription("25", "thomas@exemple.com", "MonPass42")

if erreurs:
    for erreur in erreurs:
        print(erreur)
else:
    print("Inscription valide.")
```

**Résultat attendu** :

```text
Validation de l'inscription...

Erreur d'âge : L'âge 10 n'est pas valide (doit être au moins 13).
Erreur d'email : L'email 'test.exemple.com' est invalide (doit contenir un @).
Erreur de mot de passe : Le mot de passe est invalide (trop court (3 caractères, minimum 8)).

Test avec des valeurs valides :
Inscription valide.
```

---

## Navigation

← Fiche précédente : **[08 - POO avancée](08-poo-avancee.md)**

→ Fiche suivante : **[10 - Fichiers et entrées/sorties](10-fichiers-io.md)**
