---
tags:
  - Git
  - Débutant
  - Pratique
description: "Workflow Git basique"
estimated_time: "55 min"
fiche_number: 2
total_fiches: 5
cursus: "Git"
---

# 02 - Workflow Git basique

> **En bref** : À la fin de cette fiche, tu sauras appliquer le workflow Git quotidien : modifier, ajouter, commiter, et consulter l'historique. Lecture estimée : 55 min.


## Prérequis

- Fiche [03-git/01 - Les concepts de Git](01-concepts-git.md)
- Savoir initialiser un repository et créer des commits

## Objectif de cette fiche

À la fin de cette fiche, tu sauras appliquer le workflow Git quotidien : modifier, ajouter, commiter, et consulter l'historique.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Le workflow quotidien

**Les étapes répétitives** :

```text
1. Modifier des fichiers
2. Vérifier les modifications (git status, git diff)
3. Ajouter les modifications (git add)
4. Commiter (git commit)
5. Répéter
```

Le diagramme suivant montre le cycle add-commit-push utilisé au quotidien.

<div class="diagram-design">
<p><a href="../../../diagrams/epitech-03-git-02-workflow-basique-1.html">Le workflow quotidien (HTML + SVG)</a></p>
<iframe src="../../../diagrams/epitech-03-git-02-workflow-basique-1.html" title="Le workflow quotidien" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### git status en détail

**Définition** : `git status` montre l'état de chaque fichier par rapport au dernier commit.

**Analogie concrète** : `git status` fonctionne comme un inventaire de magasin. Il te montre trois catégories : les articles déjà emballés et prêts à être expédiés (staging area), les articles modifiés mais pas encore emballés (modified), et les nouveaux articles jamais enregistrés dans le stock (untracked).

**Les sections de git status** :

```text
On branch main

Changes to be committed:           ← Staging area (prêt à commiter)
  (use "git restore --staged <file>..." to unstage)
        modified:   fichier1.txt
        new file:   fichier2.txt

Changes not staged for commit:     ← Modified mais pas staged
  (use "git add <file>..." to update what will be committed)
        modified:   fichier3.txt

Untracked files:                   ← Nouveaux fichiers non suivis
  (use "git add <file>..." to include in what will be committed)
        fichier4.txt
```

---

### git diff - Voir les modifications

**Définition** : `git diff` affiche les différences entre les fichiers.

**Analogie concrète** : `git diff` fonctionne comme la fonction "Comparer les documents" dans un traitement de texte. Il met en évidence ce qui a été ajouté (en vert) et ce qui a été supprimé (en rouge) entre deux versions d'un même fichier.

**Les variantes de git diff** :

| Commande | Compare |
| -------- | ------- |
| `git diff` | Working directory vs Staging area |
| `git diff --staged` | Staging area vs Dernier commit |
| `git diff HEAD` | Working directory vs Dernier commit |
| `git diff commit1 commit2` | Deux commits entre eux |

**Lecture du diff** :

```text
diff --git a/fichier.txt b/fichier.txt
index 1234567..89abcde 100644
--- a/fichier.txt
+++ b/fichier.txt
@@ -1,3 +1,4 @@
 Ligne inchangée
-Ligne supprimée
+Ligne ajoutée
+Nouvelle ligne
 Autre ligne inchangée
```

| Symbole | Signification |
| ------- | ------------- |
| `-` (rouge) | Ligne supprimée |
| `+` (vert) | Ligne ajoutée |
| (sans symbole) | Ligne inchangée (contexte) |

---

### git add en détail

**Les différentes façons d'ajouter** :

| Commande | Action |
| -------- | ------ |
| `git add fichier.txt` | Ajoute un fichier spécifique |
| `git add fichier1 fichier2` | Ajoute plusieurs fichiers |
| `git add dossier/` | Ajoute tout le dossier |
| `git add .` | Ajoute tous les fichiers modifiés et nouveaux |
| `git add -A` | Ajoute tout (y compris suppressions) |
| `git add -p` | Mode interactif (choisir les lignes) |

**Retirer de la staging area** :

```bash
git restore --staged fichier.txt
```

---

### git commit en détail

**Les options de git commit** :

| Commande | Action |
| -------- | ------ |
| `git commit -m "message"` | Commit avec message inline |
| `git commit -am "message"` | Add + Commit (fichiers déjà suivis) |
| `git commit --amend` | Modifier le dernier commit |

**Écrire de bons messages de commit** :

Structure recommandée :

```text
Titre court (50 caractères max)

Description détaillée si nécessaire.
Expliquer le pourquoi, pas le quoi.
```

**Exemples** :

| Bon message | Mauvais message |
| ----------- | --------------- |
| "Ajout de la validation du formulaire de contact" | "fix" |
| "Correction du bug d'affichage sur mobile" | "modifications" |
| "Refactoring du service d'authentification" | "update" |

---

### git log en détail

**Les options de git log** :

| Commande | Affichage |
| -------- | --------- |
| `git log` | Historique complet |
| `git log --oneline` | Une ligne par commit |
| `git log -n 5` | Les 5 derniers commits |
| `git log --graph` | Graphe des branches |
| `git log --stat` | Avec statistiques des fichiers |
| `git log -p` | Avec les diffs complets |
| `git log --author="Nom"` | Filtrer par auteur |

**Exemple de git log --oneline** :

```text
a1b2c3d (HEAD -> main) Ajout de la validation
e4f5g6h Correction du bug d'affichage
i7j8k9l Création du formulaire
```

---

### Annuler des modifications

**Annuler les modifications non stagées** :

```bash
# Restaurer un fichier à son état du dernier commit
git restore fichier.txt

# Restaurer tous les fichiers
git restore .
```

**Retirer de la staging area (sans perdre les modifications)** :

```bash
git restore --staged fichier.txt
```

**Modifier le dernier commit** (uniquement si non pushé) :

```bash
# Ajouter des fichiers oubliés
git add fichier_oublie.txt
git commit --amend --no-edit

# Modifier le message
git commit --amend -m "Nouveau message"
```

---

### Le fichier .gitignore

**Définition** : `.gitignore` liste les fichiers que Git doit ignorer (ne pas suivre).

**Analogie concrète** : `.gitignore` fonctionne comme une liste "Ne pas emballer" lors d'un déménagement. Tu y inscris les objets que les déménageurs doivent laisser sur place (poubelle, produits ménagers). Git consulte cette liste et ignore automatiquement les fichiers qui y figurent.

**Syntaxe** :

```text
# Commentaire

# Ignorer un fichier spécifique
secret.txt

# Ignorer tous les fichiers .log
*.log

# Ignorer un dossier
node_modules/
__pycache__/

# Ignorer tous les fichiers d'un type dans tous les dossiers
**/*.tmp

# Exception : ne pas ignorer ce fichier
!important.log
```

**Fichiers à ignorer typiquement** :

| Type | Exemples |
| ---- | -------- |
| Dépendances | `node_modules/`, `vendor/` |
| Build | `dist/`, `build/`, `*.class` |
| IDE | `.idea/`, `.vscode/` |
| Système | `.DS_Store`, `Thumbs.db` |
| Secrets | `.env`, `config.local.php` |
| Logs | `*.log`, `logs/` |

---

## Étapes Pratiques

### Étape 1 : Créer un projet de test

```bash
mkdir ~/workflow-git
cd ~/workflow-git
git init
git branch -M main

# Créer des fichiers initiaux
echo "# Mon Projet" > readme.md
echo "console.log('hello');" > app.js
mkdir src
echo "// Code source" > src/main.js

# Commit initial
git add .
git commit -m "Initial commit"
```

---

### Étape 2 : Modifier et voir les différences

```bash
# Modifier un fichier
echo "console.log('world');" >> app.js

# Voir le statut
git status

# Voir les différences
git diff
```

**Résultat attendu du diff** :

```text
diff --git a/app.js b/app.js
index 1234567..89abcde 100644
--- a/app.js
+++ b/app.js
@@ -1 +1,2 @@
 console.log('hello');
+console.log('world');
```

---

### Étape 3 : Ajouter et vérifier le staging

```bash
# Ajouter à la staging area
git add app.js

# Voir le statut
git status

# Voir les différences stagées
git diff --staged
```

---

### Étape 4 : Commiter

```bash
git commit -m "Ajout du message world"

# Vérifier l'historique
git log --oneline
```

---

### Étape 5 : Créer un .gitignore

```bash
# Créer des fichiers à ignorer
echo "DEBUG=true" > .env
echo "erreur 1" > debug.log
mkdir node_modules
touch node_modules/package.txt

# Voir le statut (tous apparaissent)
git status

# Créer .gitignore
cat > .gitignore << 'EOF'
# Variables d'environnement
.env

# Logs
*.log

# Dépendances
node_modules/
EOF

# Voir le statut (les fichiers ignorés n'apparaissent plus)
git status

# Commiter le .gitignore
git add .gitignore
git commit -m "Ajout du fichier .gitignore"
```

---

### Étape 6 : Workflow complet

```bash
# Modifier plusieurs fichiers
echo "## Installation" >> readme.md
echo "// Nouvelle fonction" >> src/main.js

# Voir toutes les modifications
git status
git diff

# Commiter séparément (bonne pratique)
git add readme.md
git commit -m "Documentation : ajout section installation"

git add src/main.js
git commit -m "Ajout d'une nouvelle fonction"

# Vérifier l'historique
git log --oneline -5
```

---

### Étape 7 : Annuler des modifications

```bash
# Faire une modification
echo "erreur" >> app.js

# Voir la modification
git diff

# Annuler (revenir au dernier commit)
git restore app.js

# Vérifier
git diff  # Aucune différence
cat app.js  # Le mot "erreur" a disparu
```

---

### Étape 8 : Retirer de la staging area

```bash
# Modifier et ajouter par erreur
echo "test" >> app.js
git add app.js
git status  # app.js est staged

# Retirer de la staging area (garder la modification)
git restore --staged app.js
git status  # app.js est modified mais plus staged

# Annuler aussi la modification
git restore app.js
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `git status` | État des fichiers |
| `git diff` | Différences non stagées |
| `git diff --staged` | Différences stagées |
| `git add .` | Ajouter tous les fichiers |
| `git commit -m "msg"` | Créer un commit |
| `git log --oneline` | Historique condensé |
| `git restore fichier` | Annuler modifications |
| `git restore --staged fichier` | Retirer du staging |

---

## Pièges Fréquents

### Piège 1 : Commiter des fichiers sensibles

⚠️ **Problème** : `.env`, mots de passe, clés API dans l'historique.

✅ **Solution** : Créer `.gitignore` AVANT le premier commit.

```bash
# Si déjà commité, retirer du suivi (garder le fichier)
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "Suppression de .env du suivi"
```

---

### Piège 2 : git add . ajoute trop de fichiers

⚠️ **Problème** : Des fichiers non désirés sont ajoutés.

✅ **Solution** : Toujours `git status` avant `git commit`.

```bash
git add .
git status  # Vérifier ce qui sera commité
# Si nécessaire :
git restore --staged fichier_non_voulu
```

---

### Piège 3 : Modifier le mauvais fichier

⚠️ **Problème** : Tu as modifié un fichier par erreur.

✅ **Solution** : `git restore` pour annuler.

```bash
# Annuler les modifications d'un fichier
git restore fichier.txt

# Annuler toutes les modifications
git restore .
```

---

### Piège 4 : Commit avec le mauvais message

⚠️ **Problème** : Faute de frappe ou message incorrect.

✅ **Solution** : `git commit --amend` (seulement si non pushé).

```bash
git commit --amend -m "Message corrigé"
```

---

## Checklist de Validation

- [ ] Je sais utiliser `git status` pour voir l'état des fichiers
- [ ] Je sais utiliser `git diff` pour voir les modifications
- [ ] Je sais ajouter des fichiers avec `git add`
- [ ] Je sais créer un commit avec un bon message
- [ ] Je sais consulter l'historique avec `git log`
- [ ] Je sais annuler des modifications avec `git restore`
- [ ] Je sais créer et utiliser un fichier `.gitignore`

---

## Exercice Pratique

**Énoncé** : Simule un workflow de développement complet.

**Indications** :

1. Crée un projet `mon-site` avec Git
2. Crée `index.html`, `style.css`, `.gitignore`
3. Dans `.gitignore`, ignore `*.log` et `.env`
4. Commit initial avec tous les fichiers
5. Crée un fichier `debug.log` (il doit être ignoré)
6. Modifie `index.html` pour ajouter un titre
7. Commite cette modification
8. Modifie `style.css` par erreur, puis annule la modification
9. Affiche l'historique

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Créer le projet
mkdir mon-site
cd mon-site
git init

# 2-3. Créer les fichiers
echo "<html><body></body></html>" > index.html
echo "body { margin: 0; }" > style.css
cat > .gitignore << 'EOF'
*.log
.env
EOF

# 4. Commit initial
git add .
git commit -m "Initial commit : structure du site"

# 5. Créer debug.log (ignoré)
echo "debug info" > debug.log
git status  # debug.log ne doit pas apparaître

# 6. Modifier index.html
echo "<html><body><h1>Mon Site</h1></body></html>" > index.html

# 7. Commiter
git add index.html
git commit -m "Ajout du titre principal"

# 8. Modifier et annuler
echo "erreur" >> style.css
git diff  # Voir la modification
git restore style.css
git diff  # Plus de modification

# 9. Historique
git log --oneline
```

**Résultat attendu de git log** :

```text
a1b2c3d (HEAD -> main) Ajout du titre principal
e4f5g6h Initial commit : structure du site
```

---

## Navigation

← Fiche précédente : **[Les concepts de Git](01-concepts-git.md)**

→ Fiche suivante : **[Branches et merge](03-branches-merge.md)**
