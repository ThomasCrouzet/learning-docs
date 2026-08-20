---
tags:
  - Git
  - Débutant
  - Pratique
description: "Branches et merge"
estimated_time: "70 min"
fiche_number: 3
total_fiches: 5
cursus: "Git"
---

# 03 - Branches et merge

> **En bref** : À la fin de cette fiche, tu sauras créer des branches, naviguer entre elles, et fusionner les modifications. Lecture estimée : 70 min.


## Prérequis

- Fiche [03-git/01 - Les concepts de Git](01-concepts-git.md)
- Fiche [03-git/02 - Workflow Git basique](02-workflow-basique.md)
- Savoir créer des commits et consulter l'historique

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des branches, naviguer entre elles, et fusionner les modifications.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une branche ?

**Définition** : Une branche est une ligne de développement indépendante. C'est un pointeur vers un commit qui avance automatiquement à chaque nouveau commit.

**Le problème que les branches résolvent** :

Sans branches, voici les problèmes rencontrés :

1. **Travail en équipe** : Deux personnes ne peuvent pas travailler en même temps sur le même code.

2. **Expérimentation risquée** : Tester une nouvelle fonctionnalité peut casser le code stable.

3. **Versions parallèles** : Impossible de maintenir une version stable pendant le développement.

**Comment les branches résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Travail en équipe | Chaque personne travaille sur sa branche |
| Expérimentation risquée | Les expériences sont sur une branche séparée |
| Versions parallèles | La branche `main` reste stable |

**Analogie concrète** : Une branche est comme un brouillon d'un document. Tu copies le document (crée une branche), tu fais tes modifications sur la copie, et une fois satisfait, tu intègres les changements dans l'original (merge). Pendant ce temps, l'original reste intact.

---

### Visualisation des branches

Le diagramme suivant montre comment les commits divergent sur une branche et se rejoignent lors du merge.

<div class="diagram-design">
<p><a href="../../../diagrams/fondamentaux-03-git-03-branches-merge-1.html">Visualisation des branches (HTML + SVG)</a></p>
<iframe src="../../../diagrams/fondamentaux-03-git-03-branches-merge-1.html" title="Visualisation des branches" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Une branche linéaire** :

```text
A ← B ← C ← D (main)
```

**Avec une branche de fonctionnalité** :

```text
          E ← F (feature)
         /
A ← B ← C ← D (main)
```

**Après fusion** :

```text
          E ← F
         /     \
A ← B ← C ← D ← G (main, merge commit)
```

---

### HEAD et les branches

**Définition** : HEAD est un pointeur vers la branche actuelle (et donc vers son commit le plus récent).

**Visualisation** :

```text
A ← B ← C (main) ← HEAD
         \
          D ← E (feature)
```

Ici, HEAD pointe vers `main`, donc vers le commit C.

Après `git checkout feature` :

```text
A ← B ← C (main)
         \
          D ← E (feature) ← HEAD
```

HEAD pointe maintenant vers `feature`, donc vers E.

---

### Les commandes de base pour les branches

**Créer et naviguer** :

| Commande | Action |
| -------- | ------ |
| `git branch` | Liste les branches locales |
| `git branch nom` | Crée une nouvelle branche |
| `git checkout nom` | Bascule vers une branche |
| `git checkout -b nom` | Crée et bascule (raccourci) |
| `git switch nom` | Bascule vers une branche (moderne) |
| `git switch -c nom` | Crée et bascule (moderne) |

**Supprimer** :

| Commande | Action |
| -------- | ------ |
| `git branch -d nom` | Supprime une branche (si mergée) |
| `git branch -D nom` | Force la suppression |

---

### Le merge (fusion)

**Définition** : Le merge intègre les modifications d'une branche dans une autre.

**Types de merge** :

**1. Fast-forward** (avance rapide) :

Quand la branche cible n'a pas de nouveaux commits :

```text
Avant :
A ← B ← C (main) ← D ← E (feature)

Après git merge feature :
A ← B ← C ← D ← E (main, feature)
```

Git avance le pointeur `main`.

**2. Merge commit** (commit de fusion) :

Quand les deux branches ont divergé :

```text
Avant :
          E ← F (feature)
         /
A ← B ← C ← D (main)

Après git merge feature :
          E ← F ────┐
         /          ▼
A ← B ← C ← D ← G (main, merge commit)
```

Git crée un commit de fusion qui combine les deux historiques.

---

### Les conflits

**Définition** : Un conflit survient quand Git ne peut pas fusionner automatiquement car les mêmes lignes ont été modifiées différemment dans les deux branches.

**Anatomie d'un conflit** :

```text
<<<<<<< HEAD
Contenu de la branche actuelle
=======
Contenu de la branche à fusionner
>>>>>>> feature
```

**Résoudre un conflit** :

1. Ouvrir le fichier en conflit
2. Supprimer les marqueurs (`<<<<<<<`, `=======`, `>>>>>>>`)
3. Garder le code souhaité
4. Sauvegarder
5. `git add fichier`
6. `git commit`

---

### Workflow typique avec branches

**Feature branch workflow** :

```text
1. main : code stable
2. Créer une branche feature/nouvelle-fonctionnalite
3. Développer sur cette branche
4. Tester
5. Merger dans main
6. Supprimer la branche feature
```

**Noms de branches conventionnels** :

| Préfixe | Usage |
| ------- | ----- |
| `feature/` | Nouvelle fonctionnalité |
| `fix/` ou `bugfix/` | Correction de bug |
| `hotfix/` | Correction urgente |
| `release/` | Préparation de version |

---

## Étapes Pratiques

### Étape 1 : Créer un projet de test

```bash
mkdir ~/branches-git
cd ~/branches-git
git init
git branch -M main

# Créer un fichier initial
echo "# Mon Projet" > readme.md
git add .
git commit -m "Initial commit"
```

---

### Étape 2 : Voir les branches existantes

```bash
git branch
```

**Résultat attendu** :

```text
* main
```

L'astérisque `*` indique la branche actuelle.

---

### Étape 3 : Créer une nouvelle branche

```bash
# Créer la branche
git branch feature/header

# Voir les branches
git branch
```

**Résultat attendu** :

```text
  feature/header
* main
```

---

### Étape 4 : Basculer vers la nouvelle branche

```bash
# Méthode classique
git checkout feature/header

# Ou méthode moderne
git switch feature/header

# Vérifier
git branch
```

**Résultat attendu** :

```text
* feature/header
  main
```

---

### Étape 5 : Faire des commits sur la branche

```bash
# Ajouter du contenu
echo "<header>Mon Header</header>" > header.html
git add header.html
git commit -m "Ajout du header"

# Modifier
echo "<header><h1>Titre</h1></header>" > header.html
git add header.html
git commit -m "Ajout du titre dans le header"

# Voir l'historique
git log --oneline
```

---

### Étape 6 : Revenir à main et voir la différence

```bash
# Retourner à main
git checkout main

# Voir les fichiers
ls  # header.html n'existe pas

# Voir l'historique
git log --oneline  # Seulement le commit initial
```

---

### Étape 7 : Merger la branche

```bash
# S'assurer d'être sur main
git checkout main

# Merger feature/header
git merge feature/header

# Voir le résultat
ls  # header.html existe maintenant
git log --oneline  # Tous les commits sont là
```

**Résultat attendu** :

```text
a1b2c3d (HEAD -> main, feature/header) Ajout du titre dans le header
e4f5g6h Ajout du header
i7j8k9l Initial commit
```

---

### Étape 8 : Supprimer la branche mergée

```bash
# La branche n'est plus nécessaire
git branch -d feature/header

# Vérifier
git branch
```

**Résultat attendu** :

```text
* main
```

---

### Étape 9 : Créer un conflit (pour apprendre à le résoudre)

```bash
# Créer une branche
git checkout -b feature/footer

# Modifier readme.md sur la branche
echo "## Footer section" >> readme.md
git add readme.md
git commit -m "Ajout section footer dans readme"

# Retourner à main
git checkout main

# Modifier la même partie sur main
echo "## Main section" >> readme.md
git add readme.md
git commit -m "Ajout section main dans readme"

# Essayer de merger
git merge feature/footer
```

**Résultat attendu** :

```text
Auto-merging readme.md
CONFLICT (content): Merge conflict in readme.md
Automatic merge failed; fix conflicts and then commit the result.
```

---

### Étape 10 : Résoudre le conflit

```bash
# Voir le statut
git status

# Voir le fichier en conflit
cat readme.md
```

**Contenu du fichier** :

```text
# Mon Projet
<<<<<<< HEAD
## Main section
=======
## Footer section
>>>>>>> feature/footer
```

```bash
# Éditer le fichier pour résoudre (garder les deux)
cat > readme.md << 'EOF'
# Mon Projet
## Main section
## Footer section
EOF

# Marquer comme résolu
git add readme.md

# Terminer le merge
git commit -m "Merge feature/footer : ajout des deux sections"

# Vérifier
git log --oneline
cat readme.md
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `git branch` | Liste les branches |
| `git branch nom` | Crée une branche |
| `git checkout nom` | Bascule vers une branche |
| `git checkout -b nom` | Crée et bascule |
| `git merge branche` | Fusionne une branche |
| `git branch -d nom` | Supprime une branche |
| `git log --graph --oneline` | Visualise les branches |

---

## Pièges Fréquents

### Piège 1 : Travailler sur la mauvaise branche

⚠️ **Problème** : Tu fais des commits sur `main` au lieu de ta branche.

✅ **Solution** : Toujours vérifier avec `git branch` avant de commiter.

```bash
# Vérifier la branche actuelle
git branch

# Si sur la mauvaise branche, déplacer les commits
git stash
git checkout bonne-branche
git stash pop
```

---

### Piège 2 : Supprimer une branche non mergée

⚠️ **Problème** : Erreur "branch not fully merged".

✅ **Solution** : Merger d'abord, ou forcer avec `-D` si tu es sûr.

```bash
# Si tu veux vraiment supprimer sans merger
git branch -D branche-a-supprimer
```

---

### Piège 3 : Conflit non résolu

⚠️ **Problème** : Oublier de résoudre tous les fichiers en conflit.

✅ **Solution** : Toujours `git status` après avoir résolu.

```bash
# Voir tous les fichiers en conflit
git status

# Après résolution de chaque fichier
git add fichier_resolu

# Quand tout est résolu
git commit
```

---

### Piège 4 : Merger dans le mauvais sens

⚠️ **Problème** : Tu veux merger A dans B mais tu fais l'inverse.

✅ **Solution** : Se placer sur la branche de destination.

```bash
# Pour merger feature dans main :
# 1. Aller sur main
git checkout main
# 2. Merger feature
git merge feature

# PAS l'inverse (sauf cas particulier)
```

---

## Checklist de Validation

- [ ] Je sais créer une branche avec `git branch`
- [ ] Je sais basculer entre branches avec `git checkout` ou `git switch`
- [ ] Je sais créer et basculer en une commande avec `-b`
- [ ] Je sais fusionner une branche avec `git merge`
- [ ] Je comprends la différence entre fast-forward et merge commit
- [ ] Je sais résoudre un conflit de merge
- [ ] Je sais supprimer une branche mergée

---

## Exercice Pratique

**Énoncé** : Simule un workflow de développement avec plusieurs branches.

**Indications** :

1. Crée un projet `blog` avec un `index.html` initial
2. Crée une branche `feature/articles` et ajoute `articles.html`
3. Crée une branche `feature/contact` (depuis main) et ajoute `contact.html`
4. Merge `feature/articles` dans `main`
5. Merge `feature/contact` dans `main`
6. Supprime les branches de feature
7. Affiche l'historique avec le graphe

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Créer le projet
mkdir blog && cd blog
git init
echo "<html>Blog</html>" > index.html
git add . && git commit -m "Initial commit"

# 2. Branche articles
git checkout -b feature/articles
echo "<html>Articles</html>" > articles.html
git add . && git commit -m "Ajout de la page articles"

# 3. Branche contact (depuis main)
git checkout main
git checkout -b feature/contact
echo "<html>Contact</html>" > contact.html
git add . && git commit -m "Ajout de la page contact"

# 4. Merge articles
git checkout main
git merge feature/articles -m "Merge feature/articles"

# 5. Merge contact
git merge feature/contact -m "Merge feature/contact"

# 6. Supprimer les branches
git branch -d feature/articles
git branch -d feature/contact

# 7. Historique avec graphe
git log --graph --oneline --all
```

**Résultat attendu** :

```text
*   a1b2c3d (HEAD -> main) Merge feature/contact
|\
| * e4f5g6h Ajout de la page contact
* |   i7j8k9l Merge feature/articles
|\ \
| |/
|/|
| * m1n2o3p Ajout de la page articles
|/
* q4r5s6t Initial commit
```

---

## Navigation

← Fiche précédente : **[Workflow Git basique](02-workflow-basique.md)**

→ Fiche suivante : **[Résolution de conflits](04-resolution-conflits.md)**
