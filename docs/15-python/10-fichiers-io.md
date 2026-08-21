---
tags:
  - Python
  - Intermédiaire
  - Pratique
description: "Lire et écrire des fichiers texte, CSV et JSON, manipuler les chemins avec pathlib et gérer l'encodage UTF-8."
estimated_time: "75 min"
fiche_number: 10
total_fiches: 12
cursus: "Python fondamentaux"
id: "web.python.fichiers-io"
course_id: "web.python"
content_type: "lesson"
order: 10
---

# 10 - Fichiers et entrées/sorties

> **En bref** : Lire et écrire des fichiers texte avec `open()`, manipuler les chemins avec `pathlib`, travailler avec les formats CSV et JSON, et gérer l'encodage UTF-8. Lecture estimée : 75 min.

## Prérequis

- Fiche précédente : [09 - Gestion des erreurs](09-gestion-erreurs.md)
- Savoir utiliser `try`/`except` et le gestionnaire de contexte `with`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire et écrire des fichiers texte, utiliser `pathlib` pour manipuler les chemins de fichiers, et travailler avec les formats CSV et JSON.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'ouverture de fichiers ?

**Définition** : L'ouverture de fichiers en Python se fait avec la fonction `open()`. Elle crée un objet fichier qui permet de lire ou écrire des données. Chaque ouverture utilise un mode qui détermine l'opération autorisée.

**Les modes d'ouverture** :

| Mode | Signification | Comportement si le fichier existe | Comportement si le fichier n'existe pas |
| ---- | ------------- | --------------------------------- | --------------------------------------- |
| `"r"` | Lecture (read) | Ouvre le fichier | Lève `FileNotFoundError` |
| `"w"` | Écriture (write) | Écrase le contenu existant | Crée le fichier |
| `"a"` | Ajout (append) | Ajoute à la fin du fichier | Crée le fichier |
| `"x"` | Création exclusive | Lève `FileExistsError` | Crée le fichier |

**Le problème que la gestion de fichiers résout** :

Sans la gestion de fichiers, voici les problèmes rencontrés :

1. **Données perdues** : toutes les variables disparaissent quand le programme s'arrête.
2. **Pas de partage** : impossible de transmettre des données entre deux exécutions du programme.
3. **Pas de volume** : impossible de traiter de grandes quantités de données qui ne tiennent pas en mémoire.

**Comment la gestion de fichiers résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Données perdues | Les fichiers persistent sur le disque après l'arrêt du programme |
| Pas de partage | Les fichiers sont lisibles par d'autres programmes et utilisateurs |
| Pas de volume | On peut lire un fichier ligne par ligne sans tout charger en mémoire |

**Analogie concrète** : Ouvrir un fichier, c'est comme ouvrir un cahier. Le mode `"r"` = tu lis le cahier sans écrire. Le mode `"w"` = tu prends un cahier neuf et tu écris (l'ancien contenu est effacé). Le mode `"a"` = tu ouvres le cahier à la dernière page écrite et tu continues.

---

### La lecture de fichiers

**Définition** : Python propose plusieurs méthodes pour lire le contenu d'un fichier ouvert en mode `"r"`.

**Les méthodes de lecture** :

| Méthode | Ce qu'elle retourne | Quand l'utiliser |
| ------- | ------------------- | ---------------- |
| `read()` | Tout le contenu en une seule chaîne | Petits fichiers |
| `readline()` | Une seule ligne (avec le `\n` final) | Lecture séquentielle |
| `readlines()` | Liste de toutes les lignes | Quand on veut indexer les lignes |
| `for ligne in fichier:` | Une ligne par itération | Gros fichiers (économe en mémoire) |

**Ce que la lecture n'est PAS** :

- Lire un fichier n'est pas comme lire une variable. Le fichier est sur le disque, pas en mémoire. La lecture transfère les données du disque vers la mémoire.
- `read()` n'est pas adapté aux gros fichiers. Si le fichier fait 2 Go, `read()` essaiera de tout charger en mémoire. Utilise plutôt une boucle `for ligne in fichier:`.

---

### L'écriture de fichiers

**Définition** : Python permet d'écrire dans un fichier avec les méthodes `write()` et `writelines()`.

| Méthode | Ce qu'elle fait | Ajoute un retour à la ligne |
| ------- | --------------- | --------------------------- |
| `write(texte)` | Écrit une chaîne dans le fichier | Non (il faut ajouter `\n` manuellement) |
| `writelines(liste)` | Écrit une liste de chaînes | Non (il faut inclure `\n` dans chaque élément) |

---

### Le module pathlib

**Définition** : Le module `pathlib` fournit la classe `Path` qui représente un chemin de fichier ou de dossier. Il remplace les fonctions de `os.path` avec une interface orientée objet plus lisible.

**Le problème que pathlib résout** :

Sans `pathlib`, voici les problèmes rencontrés :

1. **Séparateurs différents** : Windows utilise `\`, Linux et macOS utilisent `/`. Il faut gérer les deux.
2. **Code verbeux** : combiner des chemins avec `os.path.join()` est long à écrire.
3. **Pas intuitif** : `os.path.exists()`, `os.path.isdir()`, `os.path.basename()` sont des fonctions dispersées.

**Comment pathlib résout ces problèmes** :

| Problème | Solution apportée par pathlib |
| -------- | ----------------------------- |
| Séparateurs différents | `Path` gère automatiquement le bon séparateur |
| Code verbeux | L'opérateur `/` combine les chemins : `Path("dossier") / "fichier.txt"` |
| Pas intuitif | Tout est regroupé dans la classe `Path` : `.exists()`, `.is_dir()`, `.name` |

**Analogie concrète** : `pathlib` est comme un GPS pour ton système de fichiers. Au lieu de donner des instructions rue par rue (`os.path.join("rue1", "rue2")`), tu donnes une adresse complète et le GPS gère le trajet (le séparateur de chemin, l'existence du dossier, etc.).

---

### Les formats structurés : CSV et JSON

**Définition** : CSV (Comma-Separated Values) et JSON (JavaScript Object Notation) sont deux formats de fichiers pour stocker des données structurées.

**Comparaison CSV vs JSON** :

| CSV | JSON |
| --- | ---- |
| Données tabulaires (lignes et colonnes) | Données imbriquées (objets et listes) |
| Léger, lisible avec un tableur | Lisible par les API web |
| Pas de typage (tout est texte) | Types préservés (int, str, bool, null) |
| Pas d'imbrication possible | Imbrication illimitée |

**Ce que CSV et JSON ne sont PAS** :

- CSV n'est pas une base de données. Il ne gère pas les relations entre les tables ni les requêtes.
- JSON n'est pas du code Python. Même si la syntaxe ressemble aux dictionnaires Python, les règles sont différentes (les clés doivent être des chaînes, pas de commentaires, `true`/`false` au lieu de `True`/`False`).

---

## Étapes Pratiques

### Étape 1 : Lire et écrire des fichiers texte

Écris un fichier texte, puis relis-le.

```python
# Écrire dans un fichier texte
# Le mode "w" crée le fichier s'il n'existe pas, ou écrase son contenu
with open("journal.txt", "w", encoding="utf-8") as fichier:
    fichier.write("Jour 1 : j'apprends Python.\n")
    fichier.write("Jour 2 : je manipule des fichiers.\n")
    fichier.write("Jour 3 : je lis et j'écris du CSV.\n")

# Lire tout le contenu d'un coup
with open("journal.txt", "r", encoding="utf-8") as fichier:
    contenu = fichier.read()
    print("--- Lecture complète ---")
    print(contenu)

# Lire ligne par ligne (économe en mémoire)
with open("journal.txt", "r", encoding="utf-8") as fichier:
    print("--- Lecture ligne par ligne ---")
    for numero, ligne in enumerate(fichier, start=1):
        # strip() supprime le \n à la fin de chaque ligne
        print(f"Ligne {numero} : {ligne.strip()}")

# Ajouter du contenu à la fin (mode "a")
with open("journal.txt", "a", encoding="utf-8") as fichier:
    fichier.write("Jour 4 : je maîtrise les fichiers !\n")

# Vérifier l'ajout
with open("journal.txt", "r", encoding="utf-8") as fichier:
    print("\n--- Après ajout ---")
    print(fichier.read())
```

**Résultat attendu** :

```text
--- Lecture complète ---
Jour 1 : j'apprends Python.
Jour 2 : je manipule des fichiers.
Jour 3 : je lis et j'écris du CSV.

--- Lecture ligne par ligne ---
Ligne 1 : Jour 1 : j'apprends Python.
Ligne 2 : Jour 2 : je manipule des fichiers.
Ligne 3 : Jour 3 : je lis et j'écris du CSV.

--- Après ajout ---
Jour 1 : j'apprends Python.
Jour 2 : je manipule des fichiers.
Jour 3 : je lis et j'écris du CSV.
Jour 4 : je maîtrise les fichiers !
```

---

### Étape 2 : Utiliser pathlib pour les chemins

Le module `pathlib` simplifie la manipulation des chemins.

```python
from pathlib import Path

# Créer un objet Path
dossier = Path("mon_projet")

# Créer le dossier s'il n'existe pas
# exist_ok=True évite une erreur si le dossier existe déjà
dossier.mkdir(exist_ok=True)
print(f"Dossier créé : {dossier}")

# Combiner des chemins avec l'opérateur /
fichier = dossier / "notes.txt"
print(f"Chemin du fichier : {fichier}")

# Écrire dans le fichier via pathlib
fichier.write_text("Première note.\nDeuxième note.\n", encoding="utf-8")
print(f"Fichier créé : {fichier.exists()}")

# Lire le contenu via pathlib
contenu = fichier.read_text(encoding="utf-8")
print(f"Contenu :\n{contenu}")

# Propriétés utiles de Path
print(f"Nom du fichier : {fichier.name}")
print(f"Extension : {fichier.suffix}")
print(f"Nom sans extension : {fichier.stem}")
print(f"Dossier parent : {fichier.parent}")
print(f"Chemin absolu : {fichier.resolve()}")

# Lister les fichiers d'un dossier
print("\nFichiers dans le dossier :")
for element in dossier.iterdir():
    print(f"  - {element.name} ({'dossier' if element.is_dir() else 'fichier'})")

# Rechercher des fichiers avec glob
# Créons d'abord quelques fichiers supplémentaires
(dossier / "rapport.txt").write_text("Rapport", encoding="utf-8")
(dossier / "donnees.csv").write_text("col1,col2", encoding="utf-8")

print("\nFichiers .txt trouvés :")
for fichier_txt in dossier.glob("*.txt"):
    print(f"  - {fichier_txt.name}")
```

**Résultat attendu** :

```text
Dossier créé : mon_projet
Chemin du fichier : mon_projet/notes.txt
Fichier créé : True
Contenu :
Première note.
Deuxième note.

Nom du fichier : notes.txt
Extension : .txt
Nom sans extension : notes
Dossier parent : mon_projet
Chemin absolu : /chemin/complet/mon_projet/notes.txt

Fichiers dans le dossier :
  - notes.txt (fichier)

Fichiers .txt trouvés :
  - notes.txt
  - rapport.txt
```

---

### Étape 3 : Lire et écrire du CSV

Le module `csv` facilite la lecture et l'écriture de fichiers CSV.

```python
import csv

# --- Écriture CSV ---
# Données sous forme de liste de listes
employes = [
    ["nom", "poste", "salaire"],
    ["Alice", "Développeuse", "45000"],
    ["Bob", "Designer", "42000"],
    ["Charlie", "Chef de projet", "50000"],
]

with open("employes.csv", "w", encoding="utf-8", newline="") as fichier:
    # newline="" évite les lignes vides supplémentaires sur Windows
    writer = csv.writer(fichier)
    # writerows écrit toutes les lignes d'un coup
    writer.writerows(employes)

print("Fichier CSV écrit.")

# --- Lecture CSV ---
with open("employes.csv", "r", encoding="utf-8") as fichier:
    reader = csv.reader(fichier)
    for ligne in reader:
        # Chaque ligne est une liste de chaînes
        print(ligne)

print()

# --- Lecture CSV avec DictReader ---
# DictReader utilise la première ligne comme clés
with open("employes.csv", "r", encoding="utf-8") as fichier:
    reader = csv.DictReader(fichier)
    for employe in reader:
        # Chaque ligne est un dictionnaire
        print(f"{employe['nom']} - {employe['poste']} ({employe['salaire']} euros)")

print()

# --- Écriture CSV avec DictWriter ---
nouveaux = [
    {"nom": "Diana", "poste": "DevOps", "salaire": "48000"},
    {"nom": "Eve", "poste": "Data Analyst", "salaire": "46000"},
]

with open("nouveaux.csv", "w", encoding="utf-8", newline="") as fichier:
    champs = ["nom", "poste", "salaire"]
    writer = csv.DictWriter(fichier, fieldnames=champs)
    # Écrire la ligne d'en-tête
    writer.writeheader()
    # Écrire toutes les lignes de données
    writer.writerows(nouveaux)

print("Fichier CSV avec DictWriter écrit.")
```

**Résultat attendu** :

```text
Fichier CSV écrit.
['nom', 'poste', 'salaire']
['Alice', 'Développeuse', '45000']
['Bob', 'Designer', '42000']
['Charlie', 'Chef de projet', '50000']

Alice - Développeuse (45000 euros)
Bob - Designer (42000 euros)
Charlie - Chef de projet (50000 euros)

Fichier CSV avec DictWriter écrit.
```

---

### Étape 4 : Lire et écrire du JSON

Le module `json` permet de convertir entre objets Python et format JSON.

```python
import json

# --- Écriture JSON ---
contacts = {
    "contacts": [
        {
            "nom": "Alice Martin",
            "email": "alice@exemple.com",
            "age": 28,
            "actif": True,
        },
        {
            "nom": "Bob Dupont",
            "email": "bob@exemple.com",
            "age": 35,
            "actif": False,
        },
    ]
}

# Écrire dans un fichier JSON
with open("contacts.json", "w", encoding="utf-8") as fichier:
    # indent=2 rend le JSON lisible (indenté avec 2 espaces)
    # ensure_ascii=False préserve les accents français
    json.dump(contacts, fichier, indent=2, ensure_ascii=False)

print("Fichier JSON écrit.")

# --- Lecture JSON ---
with open("contacts.json", "r", encoding="utf-8") as fichier:
    donnees = json.load(fichier)

# donnees est un dictionnaire Python classique
print(f"Nombre de contacts : {len(donnees['contacts'])}")

for contact in donnees["contacts"]:
    statut = "actif" if contact["actif"] else "inactif"
    print(f"  {contact['nom']} ({contact['email']}) - {statut}")

print()

# --- Conversion chaîne JSON <-> objet Python ---
# Convertir un dictionnaire en chaîne JSON
chaine_json = json.dumps({"nom": "Charlie", "age": 30}, ensure_ascii=False)
print(f"Chaîne JSON : {chaine_json}")
print(f"Type : {type(chaine_json)}")

# Convertir une chaîne JSON en dictionnaire Python
objet = json.loads(chaine_json)
print(f"Objet Python : {objet}")
print(f"Type : {type(objet)}")
```

**Résultat attendu** :

```text
Fichier JSON écrit.
Nombre de contacts : 2
  Alice Martin (alice@exemple.com) - actif
  Bob Dupont (bob@exemple.com) - inactif

Chaîne JSON : {"nom": "Charlie", "age": 30}
Type : <class 'str'>
Objet Python : {'nom': 'Charlie', 'age': 30}
Type : <class 'dict'>
```

---

### Étape 5 : Gérer l'encodage UTF-8

L'encodage détermine comment les caractères sont stockés en octets dans le fichier.

```python
# Toujours spécifier encoding="utf-8" pour supporter les accents
with open("accents.txt", "w", encoding="utf-8") as fichier:
    fichier.write("Les caractères spéciaux : é, è, ê, ë, à, ç, ù, ô\n")
    fichier.write("日本語のテキスト (texte japonais)\n")

# Relire avec le bon encodage
with open("accents.txt", "r", encoding="utf-8") as fichier:
    print(fichier.read())

# Que se passe-t-il sans le bon encodage ?
try:
    with open("accents.txt", "r", encoding="ascii") as fichier:
        contenu = fichier.read()
except UnicodeDecodeError as e:
    print(f"Erreur d'encodage : {e}")
```

**Résultat attendu** :

```text
Les caractères spéciaux : é, è, ê, ë, à, ç, ù, ô
日本語のテキスト (texte japonais)

Erreur d'encodage : 'ascii' codec can't decode byte 0xc3 in position 10: ordinal not in range(128)
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `open("f.txt", "r", encoding="utf-8")` | Ouvrir un fichier en lecture |
| `open("f.txt", "w", encoding="utf-8")` | Ouvrir un fichier en écriture (écrase) |
| `open("f.txt", "a", encoding="utf-8")` | Ouvrir un fichier en ajout |
| `Path("dossier").mkdir(exist_ok=True)` | Créer un dossier |
| `Path("dossier") / "fichier.txt"` | Combiner des chemins |
| `Path("fichier").exists()` | Vérifier si un fichier existe |
| `Path("dossier").glob("*.txt")` | Rechercher des fichiers par motif |
| `json.dump(objet, fichier, indent=2)` | Écrire du JSON dans un fichier |
| `json.load(fichier)` | Lire du JSON depuis un fichier |
| `csv.DictReader(fichier)` | Lire un CSV comme dictionnaires |
| `csv.DictWriter(fichier, fieldnames=...)` | Écrire un CSV depuis des dictionnaires |

---

## Pièges Fréquents

### Piège 1 : Oublier l'encodage

**Problème** : Sans `encoding="utf-8"`, Python utilise l'encodage par défaut du système. Sur Windows, c'est souvent `cp1252`, ce qui provoque des erreurs avec les accents.

**Solution** : Toujours spécifier `encoding="utf-8"` dans `open()`.

```python
# Mauvais : encodage par défaut (peut varier selon le système)
with open("fichier.txt", "r") as f:
    contenu = f.read()

# Bon : encodage explicite
with open("fichier.txt", "r", encoding="utf-8") as f:
    contenu = f.read()
```

### Piège 2 : Utiliser le mode "w" au lieu de "a"

**Problème** : Le mode `"w"` écrase tout le contenu existant du fichier. Si tu voulais ajouter des données, elles sont perdues.

**Solution** : Utiliser le mode `"a"` (append) pour ajouter du contenu sans écraser.

```python
# Écrase le fichier à chaque exécution
with open("log.txt", "w", encoding="utf-8") as f:
    f.write("Nouvelle entrée\n")

# Ajoute à la fin du fichier
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("Nouvelle entrée\n")
```

### Piège 3 : Oublier newline="" avec csv.writer sur Windows

**Problème** : Sans `newline=""`, le module `csv` ajoute des lignes vides supplémentaires sur Windows.

**Solution** : Toujours passer `newline=""` quand tu ouvres un fichier pour le module `csv`.

```python
# Mauvais : peut ajouter des lignes vides sur Windows
with open("data.csv", "w", encoding="utf-8") as f:
    writer = csv.writer(f)

# Bon : fonctionne correctement sur tous les systèmes
with open("data.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f)
```

### Piège 4 : Charger un gros fichier en mémoire avec read()

**Problème** : `fichier.read()` charge tout le contenu en mémoire. Pour un fichier de plusieurs Go, cela peut faire planter le programme.

**Solution** : Lire le fichier ligne par ligne avec une boucle `for`.

```python
# Mauvais : charge tout en mémoire
with open("gros_fichier.txt", "r", encoding="utf-8") as f:
    contenu = f.read()  # Peut consommer plusieurs Go de RAM

# Bon : lit une ligne à la fois
with open("gros_fichier.txt", "r", encoding="utf-8") as f:
    for ligne in f:
        traiter(ligne)  # Consomme très peu de mémoire
```

---

## Checklist de Validation

- [ ] Je sais ouvrir un fichier en lecture, écriture et ajout
- [ ] Je comprends la différence entre les modes `"r"`, `"w"`, `"a"` et `"x"`
- [ ] Je sais utiliser `pathlib` pour manipuler les chemins
- [ ] Je sais lire et écrire des fichiers CSV
- [ ] Je sais lire et écrire des fichiers JSON
- [ ] Je spécifie toujours `encoding="utf-8"` dans `open()`
- [ ] Je sais lire un gros fichier ligne par ligne sans le charger entièrement en mémoire

---

## Exercice Pratique

**Énoncé** : Crée un carnet de contacts qui stocke les données dans un fichier JSON. Le programme doit permettre d'ajouter, lister, rechercher et supprimer des contacts.

**Fonctionnalités requises** :

- **Ajouter** un contact (nom, téléphone, email)
- **Lister** tous les contacts
- **Rechercher** un contact par nom (recherche partielle)
- **Supprimer** un contact par nom exact
- Les données doivent persister entre les exécutions (fichier JSON)

**Indications** :

- Utilise un fichier `contacts.json` pour stocker les données
- Charge les contacts au démarrage et sauvegarde après chaque modification
- Utilise `pathlib` pour vérifier l'existence du fichier
- Gère les erreurs (fichier corrompu, contact inexistant)

**Résultat attendu** :

```text
=== Carnet de contacts ===
1. Ajouter un contact
2. Lister les contacts
3. Rechercher un contact
4. Supprimer un contact
5. Quitter
Choix : 1
Nom : Alice Martin
Téléphone : 06 12 34 56 78
Email : alice@exemple.com
Contact ajouté.

Choix : 2
--- Liste des contacts ---
1. Alice Martin - 06 12 34 56 78 - alice@exemple.com
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```python
import json
from pathlib import Path


FICHIER_CONTACTS = Path("contacts.json")


def charger_contacts():
    """Charge les contacts depuis le fichier JSON.

    Retourne une liste vide si le fichier n'existe pas ou est corrompu.
    """
    if not FICHIER_CONTACTS.exists():
        return []

    try:
        contenu = FICHIER_CONTACTS.read_text(encoding="utf-8")
        donnees = json.loads(contenu)
        # Vérifier que c'est bien une liste
        if not isinstance(donnees, list):
            print("Attention : format de fichier inattendu, réinitialisation.")
            return []
        return donnees
    except json.JSONDecodeError:
        print("Attention : fichier corrompu, réinitialisation.")
        return []


def sauvegarder_contacts(contacts):
    """Sauvegarde les contacts dans le fichier JSON."""
    contenu = json.dumps(contacts, indent=2, ensure_ascii=False)
    FICHIER_CONTACTS.write_text(contenu, encoding="utf-8")


def ajouter_contact(contacts):
    """Demande les informations et ajoute un contact."""
    nom = input("Nom : ").strip()
    if not nom:
        print("Le nom ne peut pas être vide.")
        return

    telephone = input("Téléphone : ").strip()
    email = input("Email : ").strip()

    contact = {
        "nom": nom,
        "telephone": telephone,
        "email": email,
    }
    contacts.append(contact)
    sauvegarder_contacts(contacts)
    print("Contact ajouté.")


def lister_contacts(contacts):
    """Affiche tous les contacts."""
    if not contacts:
        print("Aucun contact enregistré.")
        return

    print("--- Liste des contacts ---")
    for i, contact in enumerate(contacts, start=1):
        print(f"{i}. {contact['nom']} - {contact['telephone']} - {contact['email']}")


def rechercher_contact(contacts):
    """Recherche un contact par nom (recherche partielle, insensible à la casse)."""
    terme = input("Rechercher : ").strip().lower()
    if not terme:
        print("Le terme de recherche ne peut pas être vide.")
        return

    resultats = [
        c for c in contacts
        if terme in c["nom"].lower()
    ]

    if not resultats:
        print(f"Aucun contact trouvé pour '{terme}'.")
        return

    print(f"--- {len(resultats)} résultat(s) ---")
    for contact in resultats:
        print(f"  {contact['nom']} - {contact['telephone']} - {contact['email']}")


def supprimer_contact(contacts):
    """Supprime un contact par nom exact."""
    nom = input("Nom exact du contact à supprimer : ").strip()

    # Chercher le contact par nom exact
    for i, contact in enumerate(contacts):
        if contact["nom"] == nom:
            contacts.pop(i)
            sauvegarder_contacts(contacts)
            print(f"Contact '{nom}' supprimé.")
            return

    print(f"Aucun contact nommé '{nom}'.")


def menu_principal():
    """Boucle principale du programme."""
    contacts = charger_contacts()

    while True:
        print("\n=== Carnet de contacts ===")
        print("1. Ajouter un contact")
        print("2. Lister les contacts")
        print("3. Rechercher un contact")
        print("4. Supprimer un contact")
        print("5. Quitter")

        choix = input("Choix : ").strip()

        if choix == "1":
            ajouter_contact(contacts)
        elif choix == "2":
            lister_contacts(contacts)
        elif choix == "3":
            rechercher_contact(contacts)
        elif choix == "4":
            supprimer_contact(contacts)
        elif choix == "5":
            print("Au revoir.")
            break
        else:
            print("Choix invalide. Entre un nombre entre 1 et 5.")


# Point d'entrée du programme
if __name__ == "__main__":
    menu_principal()
```

---

## Navigation

← Fiche précédente : **[09 - Gestion des erreurs](09-gestion-erreurs.md)**

→ Fiche suivante : **[11 - Outils de qualité](11-outils-qualite.md)**
