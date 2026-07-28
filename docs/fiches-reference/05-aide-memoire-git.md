---
tags:
  - Référence
  - Git
description: "Aide-mémoire Git"
estimated_time: "10 min"
fiche_number: 5
total_fiches: 18
cursus: "Fiches de référence"
---

# Aide-mémoire Git

> **En bref** : Aide-mémoire Git. Lecture estimée : 10 min.

Fiche de référence rapide pour les commandes Git quotidiennes.

---

## Configuration

| Commande | Action |
| -------- | ------ |
| `git config --global user.name "Nom"` | Définir le nom d'utilisateur |
| `git config --global user.email "email@ex.com"` | Définir l'adresse email |
| `git config --global core.editor "code --wait"` | Définir VS Code comme éditeur |
| `git config --list` | Voir la configuration actuelle |

---

## Créer un dépôt

| Commande | Action |
| -------- | ------ |
| `git init` | Initialiser un dépôt dans le dossier courant |
| `git clone url` | Cloner un dépôt distant |
| `git clone url mon-dossier` | Cloner dans un dossier spécifique |

---

## Workflow quotidien

| Commande | Action |
| -------- | ------ |
| `git status` | Voir l'état des fichiers (modifiés, suivis, non suivis) |
| `git add fichier` | Ajouter un fichier à la zone de staging |
| `git add .` | Ajouter tous les fichiers modifiés |
| `git commit -m "message"` | Créer un commit avec un message |
| `git push` | Envoyer les commits vers le dépôt distant |
| `git pull` | Récupérer et fusionner les changements distants |
| `git fetch` | Récupérer les changements distants (sans fusionner) |

---

## Voir l'historique

| Commande | Action |
| -------- | ------ |
| `git log` | Voir l'historique des commits |
| `git log --oneline` | Historique compact (une ligne par commit) |
| `git log --oneline --graph` | Historique avec graphe des branches |
| `git log -5` | Les 5 derniers commits |
| `git diff` | Voir les modifications non indexées |
| `git diff --staged` | Voir les modifications indexées (prêtes à commit) |
| `git diff branch1..branch2` | Comparer deux branches |
| `git show sha` | Voir le détail d'un commit |

---

## Branches

| Commande | Action |
| -------- | ------ |
| `git branch` | Lister les branches locales |
| `git branch -a` | Lister toutes les branches (locales et distantes) |
| `git branch nom` | Créer une nouvelle branche |
| `git switch nom` | Changer de branche |
| `git switch -c nom` | Créer une branche et basculer dessus |
| `git checkout nom` | Changer de branche (ancienne syntaxe) |
| `git checkout -b nom` | Créer et basculer (ancienne syntaxe) |
| `git merge nom` | Fusionner une branche dans la branche courante |
| `git branch -d nom` | Supprimer une branche (si fusionnée) |
| `git branch -D nom` | Supprimer une branche (forcer) |

---

## Résolution de conflits

Lors d'un conflit de fusion, Git insère des marqueurs dans le fichier :

```text
<<<<<<< HEAD
ton code (branche courante)
=======
le code de l'autre branche
>>>>>>> nom-branche
```

| Commande | Action |
| -------- | ------ |
| `git merge --abort` | Annuler la fusion en cours |
| `git checkout --ours fichier` | Garder la version de la branche courante |
| `git checkout --theirs fichier` | Garder la version de l'autre branche |
| `git add fichier` | Marquer le conflit comme résolu |
| `git commit` | Finaliser la fusion après résolution |

---

## Stash

| Commande | Action |
| -------- | ------ |
| `git stash` | Mettre de côté les modifications en cours |
| `git stash push -m "description"` | Stash avec un message descriptif |
| `git stash list` | Lister tous les stashs |
| `git stash pop` | Restaurer le dernier stash et le supprimer |
| `git stash apply` | Restaurer le dernier stash (sans le supprimer) |
| `git stash drop` | Supprimer le dernier stash |
| `git stash clear` | Supprimer tous les stashs |

---

## Annuler des changements

| Commande | Action |
| -------- | ------ |
| `git restore fichier` | Annuler les modifications d'un fichier |
| `git restore --staged fichier` | Retirer un fichier de la zone de staging |
| `git reset --soft HEAD~1` | Annuler le dernier commit (garder les fichiers indexés) |
| `git reset --mixed HEAD~1` | Annuler le dernier commit (garder les fichiers modifiés) |
| `git reset --hard HEAD~1` | Annuler le dernier commit (tout supprimer) |
| `git revert sha` | Créer un commit qui annule un commit précédent |

**Attention** : `git reset --hard` supprime les modifications de manière irréversible !

---

## Rebase

| Commande | Action |
| -------- | ------ |
| `git rebase main` | Rejouer les commits de la branche courante sur main |
| `git rebase --abort` | Annuler un rebase en cours |
| `git rebase --continue` | Continuer après résolution d'un conflit |
| `git rebase --skip` | Ignorer le commit en conflit |

---

## Cherry-pick

| Commande | Action |
| -------- | ------ |
| `git cherry-pick sha` | Appliquer un commit spécifique sur la branche courante |
| `git cherry-pick sha1 sha2` | Appliquer plusieurs commits |
| `git cherry-pick --abort` | Annuler un cherry-pick en cours |

---

## Tags

| Commande | Action |
| -------- | ------ |
| `git tag` | Lister tous les tags |
| `git tag v1.0` | Créer un tag léger |
| `git tag -a v1.0 -m "Version 1.0"` | Créer un tag annoté |
| `git push origin v1.0` | Envoyer un tag vers le dépôt distant |
| `git push origin --tags` | Envoyer tous les tags |
| `git tag -d v1.0` | Supprimer un tag local |

---

## Remote

| Commande | Action |
| -------- | ------ |
| `git remote -v` | Voir les dépôts distants configurés |
| `git remote add origin url` | Ajouter un dépôt distant |
| `git remote remove origin` | Supprimer un dépôt distant |
| `git push -u origin branche` | Pousser et lier la branche au distant |
| `git remote show origin` | Voir les détails du dépôt distant |

---

## Reflog

| Commande | Action |
| -------- | ------ |
| `git reflog` | Voir l'historique de toutes les actions Git |
| `git checkout sha` | Revenir à un état précédent |
| `git branch rescue sha` | Créer une branche depuis un état perdu |

Le reflog permet de retrouver des commits perdus après un `reset --hard` ou un `rebase`.

---

## Raccourcis utiles

Ajoute ces alias dans ton `~/.gitconfig` :

```text
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    lg = log --oneline --graph --all
    last = log -1 HEAD
    unstage = restore --staged
```

Puis utilise :

```bash
git st
git co main
git br feature
git ci -m "message"
git lg
```

---

## Navigation

← Fiche précédente : **[Aide-mémoire PostgreSQL](04-aide-memoire-postgresql.md)**

→ Fiche suivante : **[Guide tmux](06-guide-tmux.md)**
