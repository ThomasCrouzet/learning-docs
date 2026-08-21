---
tags:
  - Python
  - Intermédiaire
  - Projet
description: "Projet intégrateur : créer un gestionnaire de tâches CLI complet combinant argparse, JSON, POO, gestion d'erreurs, type hints et tests pytest."
estimated_time: "120 min"
fiche_number: 12
total_fiches: 12
cursus: "Python fondamentaux"
---

# 12 - Projet intégrateur

> **En bref** : Construire un gestionnaire de tâches en ligne de commande qui combine tous les concepts du cursus : argparse, stockage JSON, classes, gestion d'erreurs, type hints et tests pytest. Lecture estimée : 120 min.

## Prérequis

- Fiche précédente : [11 - Outils de qualité](11-outils-qualite.md)
- Maîtriser les fonctions, les classes, la gestion des erreurs, les fichiers et les outils de qualité

## Objectif de cette fiche

À la fin de cette fiche, tu auras créé un programme CLI complet et structuré en Python, en utilisant tous les concepts appris dans ce cursus.

---

## Concepts

Cette section explique les concepts nécessaires pour structurer un projet CLI. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'architecture d'un projet CLI ?

**Définition** : L'architecture d'un projet CLI (Command Line Interface) est l'organisation du code en fichiers et modules, chacun ayant une responsabilité claire. Un bon projet CLI sépare la logique métier de l'interface utilisateur.

**Le problème que l'architecture résout** :

Sans architecture claire, voici les problèmes rencontrés :

1. **Fichier monolithique** : tout le code dans un seul fichier devient ingérable au-delà de 200 lignes.
2. **Impossible à tester** : si la logique est mélangée avec les `print` et les `input`, les tests automatisés sont impossibles.
3. **Difficile à faire évoluer** : ajouter une fonctionnalité nécessite de modifier du code partout.

**Comment l'architecture résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Fichier monolithique | Chaque module a une responsabilité unique |
| Impossible à tester | La logique métier est isolée et testable indépendamment |
| Difficile à faire évoluer | On ajoute un module sans toucher aux autres |

**Analogie concrète** : C'est comme un restaurant. La cuisine (logique métier) est séparée de la salle (interface utilisateur). Le chef (la classe `TaskManager`) ne parle pas aux clients directement. Le serveur (le module CLI) fait le lien entre les deux. Si on change le menu (les données), la cuisine et la salle restent identiques.

**Structure type d'un projet CLI** :

```text
todo/
├── models.py          # Classes métier (Task)
├── manager.py         # Logique métier (TaskManager)
├── cli.py             # Interface ligne de commande (argparse)
├── __main__.py        # Point d'entrée
└── tests/
    ├── test_models.py
    └── test_manager.py
```

---

### Qu'est-ce que argparse ?

**Définition** : `argparse` est un module de la bibliothèque standard Python qui permet de définir et analyser les arguments passés en ligne de commande. Il génère automatiquement l'aide (`--help`) et valide les arguments.

**Le problème que argparse résout** :

Sans argparse, voici les problèmes rencontrés :

1. **Analyse manuelle** : parser `sys.argv` à la main est fastidieux et source d'erreurs.
2. **Pas d'aide** : l'utilisateur ne sait pas quelles options sont disponibles.
3. **Pas de validation** : il faut vérifier manuellement que les arguments sont présents et du bon type.

**Comment argparse résout ces problèmes** :

| Problème | Solution apportée par argparse |
| -------- | ------------------------------ |
| Analyse manuelle | `argparse` parse automatiquement les arguments |
| Pas d'aide | `--help` est généré automatiquement |
| Pas de validation | Les types et arguments obligatoires sont vérifiés |

**Ce que argparse n'est PAS** :

- argparse n'est pas un framework comme Click ou Typer. Il fait partie de la bibliothèque standard et ne nécessite aucune installation. Click et Typer offrent plus de fonctionnalités mais sont des dépendances externes.
- argparse ne gère pas les interfaces graphiques. Il est conçu uniquement pour la ligne de commande.

---

### Qu'est-ce que la structuration en modules ?

**Définition** : Structurer le code en modules signifie répartir les fonctionnalités dans plusieurs fichiers Python (modules), chacun regroupant les classes et fonctions liées à un même sujet.

**Comparaison fichier unique vs modules** :

| Fichier unique | Modules séparés |
| -------------- | --------------- |
| Tout dans un seul fichier | Chaque fichier a une responsabilité |
| Difficile à naviguer | Facile de trouver le code pertinent |
| Impossible à réutiliser | On peut importer un module dans un autre projet |
| Tests mélangés avec le code | Tests dans un dossier dédié |

---

## Étapes Pratiques

Tu vas construire un gestionnaire de tâches (todo list) en ligne de commande. Le projet utilise les sous-commandes `add`, `list`, `done`, `delete`.

### Étape 1 : Créer la structure du projet

Commence par créer les dossiers et fichiers du projet.

```bash
# Créer la structure du projet
mkdir -p todo/tests
touch todo/__init__.py
touch todo/models.py
touch todo/manager.py
touch todo/cli.py
touch todo/__main__.py
touch todo/tests/__init__.py
touch todo/tests/test_models.py
touch todo/tests/test_manager.py
```

**Résultat attendu** :

```text
todo/
├── __init__.py
├── __main__.py
├── cli.py
├── manager.py
├── models.py
└── tests/
    ├── __init__.py
    ├── test_manager.py
    └── test_models.py
```

---

### Étape 2 : Créer le modèle Task

Le fichier `models.py` contient la classe `Task` qui représente une tâche.

```python
# todo/models.py - Modèle de données pour une tâche
from datetime import datetime


class Task:
    """Représente une tâche dans le gestionnaire."""

    def __init__(self, titre: str, task_id: int = 0) -> None:
        """Crée une nouvelle tâche.

        Args:
            titre: Le titre de la tâche.
            task_id: L'identifiant unique (attribué par le manager).
        """
        self.task_id: int = task_id
        self.titre: str = titre
        self.fait: bool = False
        # La date de création au format ISO 8601
        self.date_creation: str = datetime.now().isoformat()

    def marquer_fait(self) -> None:
        """Marque la tâche comme terminée."""
        self.fait = True

    def vers_dict(self) -> dict[str, int | str | bool]:
        """Convertit la tâche en dictionnaire pour le stockage JSON."""
        return {
            "id": self.task_id,
            "titre": self.titre,
            "fait": self.fait,
            "date_creation": self.date_creation,
        }

    @classmethod
    def depuis_dict(cls, donnees: dict[str, int | str | bool]) -> "Task":
        """Crée une tâche à partir d'un dictionnaire JSON.

        Args:
            donnees: Dictionnaire contenant les données de la tâche.

        Returns:
            Une instance de Task.
        """
        tache = cls(titre=str(donnees["titre"]), task_id=int(donnees["id"]))
        tache.fait = bool(donnees["fait"])
        tache.date_creation = str(donnees["date_creation"])
        return tache

    def __str__(self) -> str:
        """Représentation textuelle de la tâche."""
        statut = "[x]" if self.fait else "[ ]"
        return f"{statut} #{self.task_id} - {self.titre}"

    def __repr__(self) -> str:
        """Représentation technique de la tâche."""
        return f"Task(id={self.task_id}, titre='{self.titre}', fait={self.fait})"
```

---

### Étape 3 : Créer le gestionnaire TaskManager

Le fichier `manager.py` contient la logique métier : ajouter, lister, terminer et supprimer des tâches.

```python
# todo/manager.py - Logique métier du gestionnaire de tâches
import json
from pathlib import Path

from todo.models import Task


class TaskNotFoundError(Exception):
    """Exception levée quand une tâche n'est pas trouvée."""

    def __init__(self, task_id: int) -> None:
        self.task_id = task_id
        super().__init__(f"Tâche #{task_id} introuvable.")


class TaskManager:
    """Gère la liste des tâches et leur persistance."""

    def __init__(self, fichier: Path | None = None) -> None:
        """Initialise le gestionnaire.

        Args:
            fichier: Chemin du fichier JSON de stockage.
                     Par défaut : todo_data.json dans le dossier courant.
        """
        self.fichier: Path = fichier or Path("todo_data.json")
        self.taches: list[Task] = []
        self._prochain_id: int = 1
        # Charger les tâches existantes
        self._charger()

    def _charger(self) -> None:
        """Charge les tâches depuis le fichier JSON."""
        if not self.fichier.exists():
            return

        try:
            contenu = self.fichier.read_text(encoding="utf-8")
            donnees = json.loads(contenu)
            self.taches = [Task.depuis_dict(d) for d in donnees]
            # Le prochain ID est le max des IDs existants + 1
            if self.taches:
                self._prochain_id = max(t.task_id for t in self.taches) + 1
        except (json.JSONDecodeError, KeyError) as e:
            print(f"Attention : fichier corrompu ({e}), réinitialisation.")
            self.taches = []

    def _sauvegarder(self) -> None:
        """Sauvegarde les tâches dans le fichier JSON."""
        donnees = [t.vers_dict() for t in self.taches]
        contenu = json.dumps(donnees, indent=2, ensure_ascii=False)
        self.fichier.write_text(contenu, encoding="utf-8")

    def ajouter(self, titre: str) -> Task:
        """Ajoute une nouvelle tâche.

        Args:
            titre: Le titre de la tâche.

        Returns:
            La tâche créée.

        Raises:
            ValueError: Si le titre est vide.
        """
        if not titre.strip():
            raise ValueError("Le titre ne peut pas être vide.")

        tache = Task(titre=titre.strip(), task_id=self._prochain_id)
        self._prochain_id += 1
        self.taches.append(tache)
        self._sauvegarder()
        return tache

    def lister(self, tout: bool = True) -> list[Task]:
        """Retourne la liste des tâches.

        Args:
            tout: Si True, retourne toutes les tâches.
                  Si False, retourne uniquement les tâches non terminées.

        Returns:
            Liste des tâches filtrées.
        """
        if tout:
            return list(self.taches)
        return [t for t in self.taches if not t.fait]

    def terminer(self, task_id: int) -> Task:
        """Marque une tâche comme terminée.

        Args:
            task_id: L'identifiant de la tâche.

        Returns:
            La tâche modifiée.

        Raises:
            TaskNotFoundError: Si la tâche n'existe pas.
        """
        tache = self._trouver(task_id)
        tache.marquer_fait()
        self._sauvegarder()
        return tache

    def supprimer(self, task_id: int) -> Task:
        """Supprime une tâche.

        Args:
            task_id: L'identifiant de la tâche.

        Returns:
            La tâche supprimée.

        Raises:
            TaskNotFoundError: Si la tâche n'existe pas.
        """
        tache = self._trouver(task_id)
        self.taches.remove(tache)
        self._sauvegarder()
        return tache

    def _trouver(self, task_id: int) -> Task:
        """Trouve une tâche par son identifiant.

        Args:
            task_id: L'identifiant de la tâche.

        Returns:
            La tâche trouvée.

        Raises:
            TaskNotFoundError: Si la tâche n'existe pas.
        """
        for tache in self.taches:
            if tache.task_id == task_id:
                return tache
        raise TaskNotFoundError(task_id)
```

---

### Étape 4 : Créer l'interface CLI avec argparse

Le fichier `cli.py` gère l'interaction avec l'utilisateur via la ligne de commande.

```python
# todo/cli.py - Interface ligne de commande
import argparse
import sys

from todo.manager import TaskManager, TaskNotFoundError


def creer_parser() -> argparse.ArgumentParser:
    """Crée et configure le parser d'arguments."""
    # Le parser principal
    parser = argparse.ArgumentParser(
        prog="todo",
        description="Gestionnaire de tâches en ligne de commande.",
    )

    # Les sous-commandes (add, list, done, delete)
    sous_commandes = parser.add_subparsers(dest="commande", help="Commande à exécuter")

    # Sous-commande : add
    parser_add = sous_commandes.add_parser("add", help="Ajouter une tâche")
    parser_add.add_argument("titre", type=str, help="Titre de la tâche")

    # Sous-commande : list
    parser_list = sous_commandes.add_parser("list", help="Lister les tâches")
    parser_list.add_argument(
        "--todo",
        action="store_true",
        help="Afficher uniquement les tâches non terminées",
    )

    # Sous-commande : done
    parser_done = sous_commandes.add_parser("done", help="Marquer une tâche comme faite")
    parser_done.add_argument("id", type=int, help="Identifiant de la tâche")

    # Sous-commande : delete
    parser_delete = sous_commandes.add_parser("delete", help="Supprimer une tâche")
    parser_delete.add_argument("id", type=int, help="Identifiant de la tâche")

    return parser


def executer_commande(args: argparse.Namespace) -> None:
    """Exécute la commande correspondant aux arguments.

    Args:
        args: Les arguments parsés par argparse.
    """
    manager = TaskManager()

    try:
        if args.commande == "add":
            tache = manager.ajouter(args.titre)
            print(f"Tâche ajoutée : {tache}")

        elif args.commande == "list":
            # Si --todo est passé, on n'affiche que les tâches non terminées
            taches = manager.lister(tout=not args.todo)
            if not taches:
                print("Aucune tâche.")
                return
            for tache in taches:
                print(tache)
            # Résumé
            total = len(manager.lister())
            faites = len([t for t in manager.lister() if t.fait])
            print(f"\n{faites}/{total} tâche(s) terminée(s).")

        elif args.commande == "done":
            tache = manager.terminer(args.id)
            print(f"Tâche terminée : {tache}")

        elif args.commande == "delete":
            tache = manager.supprimer(args.id)
            print(f"Tâche supprimée : {tache}")

        else:
            # Aucune sous-commande fournie
            print("Utilise --help pour voir les commandes disponibles.")

    except TaskNotFoundError as e:
        print(f"Erreur : {e}")
        sys.exit(1)
    except ValueError as e:
        print(f"Erreur : {e}")
        sys.exit(1)


def main() -> None:
    """Point d'entrée principal du CLI."""
    parser = creer_parser()
    args = parser.parse_args()
    executer_commande(args)
```

---

### Étape 5 : Créer le point d'entrée

Le fichier `__main__.py` permet d'exécuter le module avec `python -m todo`.

```python
# todo/__main__.py - Point d'entrée du module
from todo.cli import main

# Ce fichier permet d'exécuter le projet avec : python -m todo
main()
```

---

### Étape 6 : Tester le projet

Utilise le projet en ligne de commande.

```bash
# Ajouter des tâches
python -m todo add "Apprendre Python"
python -m todo add "Lire la fiche sur les fichiers"
python -m todo add "Créer un projet CLI"

# Lister toutes les tâches
python -m todo list

# Marquer une tâche comme terminée
python -m todo done 1

# Lister uniquement les tâches non terminées
python -m todo list --todo

# Supprimer une tâche
python -m todo delete 2

# Lister après suppression
python -m todo list

# Afficher l'aide
python -m todo --help
python -m todo add --help
```

**Résultat attendu** :

```text
$ python -m todo add "Apprendre Python"
Tâche ajoutée : [ ] #1 - Apprendre Python

$ python -m todo add "Lire la fiche sur les fichiers"
Tâche ajoutée : [ ] #2 - Lire la fiche sur les fichiers

$ python -m todo add "Créer un projet CLI"
Tâche ajoutée : [ ] #3 - Créer un projet CLI

$ python -m todo list
[ ] #1 - Apprendre Python
[ ] #2 - Lire la fiche sur les fichiers
[ ] #3 - Créer un projet CLI

0/3 tâche(s) terminée(s).

$ python -m todo done 1
Tâche terminée : [x] #1 - Apprendre Python

$ python -m todo list --todo
[ ] #2 - Lire la fiche sur les fichiers
[ ] #3 - Créer un projet CLI

1/3 tâche(s) terminée(s).

$ python -m todo delete 2
Tâche supprimée : [ ] #2 - Lire la fiche sur les fichiers

$ python -m todo list
[x] #1 - Apprendre Python
[ ] #3 - Créer un projet CLI

1/2 tâche(s) terminée(s).
```

---

### Étape 7 : Écrire les tests

Crée des tests unitaires pour les modèles et le gestionnaire.

```python
# todo/tests/test_models.py
from todo.models import Task


def test_creation_tache():
    """Vérifie la création d'une tâche."""
    tache = Task("Apprendre Python", task_id=1)
    assert tache.titre == "Apprendre Python"
    assert tache.task_id == 1
    assert tache.fait is False


def test_marquer_fait():
    """Vérifie qu'on peut marquer une tâche comme faite."""
    tache = Task("Test", task_id=1)
    tache.marquer_fait()
    assert tache.fait is True


def test_vers_dict():
    """Vérifie la conversion en dictionnaire."""
    tache = Task("Test", task_id=1)
    d = tache.vers_dict()
    assert d["id"] == 1
    assert d["titre"] == "Test"
    assert d["fait"] is False
    assert "date_creation" in d


def test_depuis_dict():
    """Vérifie la création depuis un dictionnaire."""
    donnees = {
        "id": 5,
        "titre": "Ma tâche",
        "fait": True,
        "date_creation": "2025-01-15T10:30:00",
    }
    tache = Task.depuis_dict(donnees)
    assert tache.task_id == 5
    assert tache.titre == "Ma tâche"
    assert tache.fait is True


def test_str_non_fait():
    """Vérifie l'affichage d'une tâche non terminée."""
    tache = Task("Test", task_id=3)
    assert str(tache) == "[ ] #3 - Test"


def test_str_fait():
    """Vérifie l'affichage d'une tâche terminée."""
    tache = Task("Test", task_id=3)
    tache.marquer_fait()
    assert str(tache) == "[x] #3 - Test"
```

```python
# todo/tests/test_manager.py
from pathlib import Path

import pytest

from todo.manager import TaskManager, TaskNotFoundError


@pytest.fixture
def manager(tmp_path: Path) -> TaskManager:
    """Crée un TaskManager avec un fichier temporaire.

    tmp_path est un fixture pytest qui fournit un dossier temporaire unique.
    """
    fichier = tmp_path / "test_tasks.json"
    return TaskManager(fichier=fichier)


def test_ajouter_tache(manager: TaskManager):
    """Vérifie l'ajout d'une tâche."""
    tache = manager.ajouter("Apprendre Python")
    assert tache.titre == "Apprendre Python"
    assert tache.task_id == 1
    assert len(manager.taches) == 1


def test_ajouter_titre_vide(manager: TaskManager):
    """Vérifie qu'un titre vide lève une erreur."""
    with pytest.raises(ValueError, match="titre ne peut pas être vide"):
        manager.ajouter("")


def test_lister_taches(manager: TaskManager):
    """Vérifie le listage des tâches."""
    manager.ajouter("Tâche 1")
    manager.ajouter("Tâche 2")
    manager.ajouter("Tâche 3")
    assert len(manager.lister()) == 3


def test_lister_non_terminees(manager: TaskManager):
    """Vérifie le filtre sur les tâches non terminées."""
    manager.ajouter("Tâche 1")
    manager.ajouter("Tâche 2")
    manager.terminer(1)
    # tout=False retourne uniquement les non terminées
    non_terminees = manager.lister(tout=False)
    assert len(non_terminees) == 1
    assert non_terminees[0].titre == "Tâche 2"


def test_terminer_tache(manager: TaskManager):
    """Vérifie la complétion d'une tâche."""
    manager.ajouter("Tâche à terminer")
    tache = manager.terminer(1)
    assert tache.fait is True


def test_terminer_inexistante(manager: TaskManager):
    """Vérifie l'erreur quand la tâche n'existe pas."""
    with pytest.raises(TaskNotFoundError):
        manager.terminer(999)


def test_supprimer_tache(manager: TaskManager):
    """Vérifie la suppression d'une tâche."""
    manager.ajouter("Tâche à supprimer")
    tache = manager.supprimer(1)
    assert tache.titre == "Tâche à supprimer"
    assert len(manager.taches) == 0


def test_persistance(tmp_path: Path):
    """Vérifie que les tâches sont sauvegardées et rechargées."""
    fichier = tmp_path / "persist.json"

    # Créer un manager et ajouter des tâches
    manager1 = TaskManager(fichier=fichier)
    manager1.ajouter("Tâche persistante")
    manager1.terminer(1)

    # Créer un nouveau manager avec le même fichier
    manager2 = TaskManager(fichier=fichier)
    assert len(manager2.taches) == 1
    assert manager2.taches[0].titre == "Tâche persistante"
    assert manager2.taches[0].fait is True
```

Exécute les tests :

```bash
# Lancer les tests avec le détail
pytest todo/tests/ -v
```

**Résultat attendu** :

```text
todo/tests/test_models.py::test_creation_tache PASSED
todo/tests/test_models.py::test_marquer_fait PASSED
todo/tests/test_models.py::test_vers_dict PASSED
todo/tests/test_models.py::test_depuis_dict PASSED
todo/tests/test_models.py::test_str_non_fait PASSED
todo/tests/test_models.py::test_str_fait PASSED
todo/tests/test_manager.py::test_ajouter_tache PASSED
todo/tests/test_manager.py::test_ajouter_titre_vide PASSED
todo/tests/test_manager.py::test_lister_taches PASSED
todo/tests/test_manager.py::test_lister_non_terminees PASSED
todo/tests/test_manager.py::test_terminer_tache PASSED
todo/tests/test_manager.py::test_terminer_inexistante PASSED
todo/tests/test_manager.py::test_supprimer_tache PASSED
todo/tests/test_manager.py::test_persistance PASSED

14 passed
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `python -m todo add "titre"` | Ajouter une tâche |
| `python -m todo list` | Lister toutes les tâches |
| `python -m todo list --todo` | Lister les tâches non terminées |
| `python -m todo done <id>` | Marquer une tâche comme terminée |
| `python -m todo delete <id>` | Supprimer une tâche |
| `python -m todo --help` | Afficher l'aide |
| `pytest todo/tests/ -v` | Lancer les tests |
| `ruff check todo/` | Vérifier la qualité du code |
| `black todo/` | Formater le code |

---

## Pièges Fréquents

### Piège 1 : Oublier le fichier \_\_init\_\_.py

**Problème** : Sans fichier `__init__.py`, Python ne reconnaît pas le dossier comme un package et les imports échouent avec `ModuleNotFoundError`.

**Solution** : Toujours créer un fichier `__init__.py` (même vide) dans chaque dossier de package.

```bash
# Le fichier peut être vide : il doit exister, même sans contenu
touch todo/__init__.py
touch todo/tests/__init__.py
```

### Piège 2 : Confondre python script.py et python -m module

**Problème** : `python todo/cli.py` ne fonctionne pas car les imports relatifs (`from todo.models import Task`) ne sont pas résolus.

**Solution** : Toujours exécuter avec `python -m todo` depuis le dossier parent du package.

```bash
# Mauvais : les imports relatifs échouent
python todo/cli.py

# Bon : Python résout les imports correctement
python -m todo add "Ma tâche"
```

### Piège 3 : Ne pas utiliser tmp_path dans les tests

**Problème** : Si les tests écrivent dans un fichier fixe (`todo_data.json`), ils interfèrent entre eux et avec les données réelles.

**Solution** : Utiliser le fixture `tmp_path` de pytest qui fournit un dossier temporaire unique pour chaque test.

```python
# Mauvais : les tests partagent le même fichier
def test_ajouter():
    manager = TaskManager()  # Utilise le fichier par défaut
    manager.ajouter("Test")

# Bon : chaque test a son propre fichier temporaire
def test_ajouter(tmp_path):
    fichier = tmp_path / "test.json"
    manager = TaskManager(fichier=fichier)
    manager.ajouter("Test")
```

---

## Checklist de Validation

- [ ] J'ai créé la structure du projet avec les bons fichiers
- [ ] La classe `Task` convertit correctement vers et depuis un dictionnaire
- [ ] Le `TaskManager` ajoute, liste, termine et supprime des tâches
- [ ] Les données persistent entre les exécutions (fichier JSON)
- [ ] Le CLI fonctionne avec les sous-commandes `add`, `list`, `done`, `delete`
- [ ] Les erreurs (tâche inexistante, titre vide) sont gérées proprement
- [ ] Tous les tests passent
- [ ] Le code a des type hints sur toutes les fonctions
- [ ] ruff ne signale aucune erreur

---

## Exercice Pratique

**Énoncé** : Étends le gestionnaire de tâches avec une fonctionnalité supplémentaire au choix parmi les suivantes.

**Option A - Priorités** :

- Ajouter un champ `priorite` (haute, moyenne, basse) à la classe `Task`
- Ajouter l'option `--priorite` à la sous-commande `add`
- Ajouter l'option `--sort` à la sous-commande `list` pour trier par priorité
- Écrire 2 tests pour les priorités

**Option B - Catégories** :

- Ajouter un champ `categorie` à la classe `Task`
- Ajouter l'option `--categorie` à la sous-commande `add`
- Ajouter l'option `--categorie` à la sous-commande `list` pour filtrer par catégorie
- Écrire 2 tests pour les catégories

**Option C - Export CSV** :

- Ajouter une sous-commande `export` qui génère un fichier CSV
- Le CSV contient les colonnes : id, titre, statut, date_creation
- Ajouter l'option `--fichier` pour choisir le nom du fichier de sortie
- Écrire 2 tests pour l'export

**Option D - Recherche** :

- Ajouter une sous-commande `search` qui prend un terme de recherche
- La recherche est insensible à la casse et cherche dans le titre
- Afficher les résultats avec le nombre de correspondances
- Écrire 2 tests pour la recherche

**Indications** :

- Modifie les fichiers existants plutôt que d'en créer de nouveaux
- Mets à jour les tests existants si nécessaire
- Vérifie que tous les tests passent après tes modifications

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution de l'option D (recherche). Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Modification de `manager.py`** - ajouter la méthode `rechercher` :

```python
def rechercher(self, terme: str) -> list[Task]:
    """Recherche des tâches par titre (insensible à la casse).

    Args:
        terme: Le terme à rechercher dans les titres.

    Returns:
        Liste des tâches dont le titre contient le terme.
    """
    terme_lower = terme.lower()
    return [t for t in self.taches if terme_lower in t.titre.lower()]
```

**Modification de `cli.py`** - ajouter la sous-commande `search` :

```python
# Dans la fonction creer_parser(), ajouter après parser_delete :
parser_search = sous_commandes.add_parser("search", help="Rechercher des tâches")
parser_search.add_argument("terme", type=str, help="Terme de recherche")
```

```python
# Dans la fonction executer_commande(), ajouter avant le else :
elif args.commande == "search":
    resultats = manager.rechercher(args.terme)
    if not resultats:
        print(f"Aucune tâche trouvée pour '{args.terme}'.")
        return
    print(f"--- {len(resultats)} résultat(s) pour '{args.terme}' ---")
    for tache in resultats:
        print(tache)
```

**Tests** (`todo/tests/test_manager.py`) :

```python
def test_rechercher_trouve(manager: TaskManager):
    """Vérifie la recherche par titre."""
    manager.ajouter("Apprendre Python")
    manager.ajouter("Lire un livre")
    manager.ajouter("Apprendre JavaScript")
    resultats = manager.rechercher("apprendre")
    assert len(resultats) == 2


def test_rechercher_aucun_resultat(manager: TaskManager):
    """Vérifie la recherche sans résultat."""
    manager.ajouter("Apprendre Python")
    resultats = manager.rechercher("javascript")
    assert len(resultats) == 0
```

---

## Navigation

← Fiche précédente : **[11 - Outils de qualité](11-outils-qualite.md)**

Tu as terminé le cursus **Python fondamentaux**. Tu maîtrises maintenant les bases du langage, la programmation orientée objet, la gestion des erreurs, la manipulation de fichiers et les outils de qualité.

→ Cursus suivant : **[Python Data](../16-python-data/index.md)**
