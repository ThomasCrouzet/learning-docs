---
tags:
  - Git
  - Intermédiaire
  - Pratique
description: "Résolution de conflits Git"
estimated_time: "115 min"
fiche_number: 4
total_fiches: 5
cursus: "Git"
id: "fundamentals.git.resolution-conflits"
course_id: "fundamentals.git"
content_type: "lesson"
order: 4
---

# 04 - Résolution de conflits

> **En bref** : À la fin de cette fiche, tu sauras détecter, comprendre et résoudre les conflits de merge dans Git. Lecture estimée : 115 min.


## Prérequis

- Fiche [03 - Branches et merge](03-branches-merge.md)
- Savoir créer des branches, faire des commits et fusionner avec `git merge`
- Savoir utiliser `git status` et `git log`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras détecter, comprendre et résoudre les conflits de merge dans Git.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un conflit ?

**Définition** : Un conflit Git se produit quand deux branches modifient la même zone d'un même fichier de manières différentes. Git ne peut pas décider automatiquement quelle version garder, et te demande de choisir.

**Le problème que la résolution de conflits résout** :

Sans mécanisme de résolution de conflits, voici les problèmes rencontrés :

1. **Perte de travail** : Git pourrait écraser les modifications d'une branche sans prévenir.

2. **Incohérence du code** : Git pourrait mélanger les deux versions de manière aléatoire, créant du code qui ne fonctionne pas.

3. **Aucune collaboration possible** : Si deux personnes ne peuvent pas modifier les mêmes fichiers, le travail en équipe devient impossible.

**Comment la résolution de conflits résout ces problèmes** :

| Problème | Solution apportée par la résolution de conflits |
| -------- | ------------------------------------------------ |
| Perte de travail | Git s'arrête et te montre les deux versions |
| Incohérence du code | C'est toi qui décides du résultat final |
| Collaboration impossible | Les modifications sont combinées intelligemment |

**Analogie concrète** : Imagine que tu partages un document avec un collègue. Tu modifies le paragraphe 3 pour écrire "Le serveur utilise le port 8080". Ton collègue modifie le même paragraphe pour écrire "Le serveur utilise le port 3000". Quand tu combines vos modifications, quelqu'un doit décider quel port utiliser. C'est exactement ce que fait un conflit Git : il te demande de trancher.

**Ce qu'un conflit n'est PAS** :

- Un conflit n'est pas une erreur. C'est un comportement normal quand deux personnes modifient le même endroit. Git te protège en te demandant de vérifier.
- Un conflit n'est pas irréversible. Tu peux toujours annuler le merge en cours et revenir à l'état précédent avec `git merge --abort`.

---

### Quand un conflit se produit

Un conflit peut se produire lors de plusieurs opérations Git :

**Opérations qui peuvent provoquer un conflit** :

| Opération | Situation |
| --------- | --------- |
| `git merge` | Fusionner deux branches qui modifient la même zone |
| `git rebase` | Réappliquer des commits sur une base modifiée |
| `git cherry-pick` | Appliquer un commit spécifique qui touche une zone modifiée |
| `git pull` | Récupérer des modifications distantes (pull = fetch + merge) |

**Quand un conflit ne se produit PAS** :

Git est intelligent. Il fusionne automatiquement dans ces cas :

1. **Fichiers différents** : Si la branche A modifie `header.html` et la branche B modifie `footer.html`, Git fusionne sans conflit.

2. **Zones différentes du même fichier** : Si la branche A modifie la ligne 5 et la branche B modifie la ligne 50, Git fusionne sans conflit.

3. **Ajouts sans chevauchement** : Si les deux branches ajoutent du contenu à des endroits différents, Git gère la fusion automatiquement.

**Résumé visuel** :

```text
Conflit :
  Branche A modifie la ligne 10 → "port = 8080"
  Branche B modifie la ligne 10 → "port = 3000"
  → CONFLIT (même ligne, contenus différents)

Pas de conflit :
  Branche A modifie la ligne 10 → "port = 8080"
  Branche B modifie la ligne 50 → "debug = true"
  → FUSION AUTOMATIQUE (zones différentes)
```

---

### Les marqueurs de conflit

**Définition** : Quand un conflit se produit, Git insère des marqueurs spéciaux dans le fichier pour te montrer les deux versions en concurrence.

**Anatomie d'un conflit** :

```text
<<<<<<< HEAD
Contenu de ta branche actuelle (celle sur laquelle tu es)
=======
Contenu de la branche que tu essaies de fusionner
>>>>>>> nom-de-la-branche
```

**Les trois marqueurs** :

| Marqueur | Signification |
| -------- | ------------- |
| `<<<<<<< HEAD` | Début de la version de ta branche actuelle |
| `=======` | Séparation entre les deux versions |
| `>>>>>>> nom-de-la-branche` | Fin de la version de l'autre branche |

**Exemple concret** :

Tu es sur `main` et tu fais `git merge feature/api` :

```text
const API_URL = "https://api.example.com";
<<<<<<< HEAD
const PORT = 8080;
const DEBUG = false;
=======
const PORT = 3000;
const DEBUG = true;
>>>>>>> feature/api
const TIMEOUT = 5000;
```

Ici :

- Les lignes 1 et 7 (`API_URL` et `TIMEOUT`) ne sont pas en conflit.
- Les lignes entre les marqueurs sont en conflit : `main` dit port 8080 et debug false, `feature/api` dit port 3000 et debug true.

---

### Résolution manuelle

**Définition** : Résoudre un conflit manuellement consiste à éditer le fichier pour produire le résultat final souhaité, puis supprimer les marqueurs de conflit.

**Trois stratégies possibles** :

**1. Garder ta version (current)** :

Supprimer les marqueurs et le contenu de l'autre branche :

```text
const PORT = 8080;
const DEBUG = false;
```

**2. Garder l'autre version (incoming)** :

Supprimer les marqueurs et ton contenu :

```text
const PORT = 3000;
const DEBUG = true;
```

**3. Combiner les deux versions** :

Supprimer les marqueurs et écrire un nouveau contenu qui intègre les deux :

```text
const PORT = 3000;
const DEBUG = false;
```

Dans tous les cas, le fichier final ne doit contenir aucun marqueur de conflit (`<<<<<<<`, `=======`, `>>>>>>>`).

---

### Les commandes de résolution

Quand un conflit se produit, Git se met dans un état spécial appelé "merge en cours". Voici les commandes pour gérer cet état.

**Diagnostiquer** :

| Commande | Action |
| -------- | ------ |
| `git status` | Liste les fichiers en conflit (marqués "both modified") |
| `git diff` | Montre les différences avec les marqueurs de conflit |

**Résoudre** :

| Commande | Action |
| -------- | ------ |
| `git add fichier` | Marque un fichier comme résolu après édition |
| `git commit` | Finalise le merge après résolution de tous les conflits |

**Annuler** :

| Commande | Action |
| -------- | ------ |
| `git merge --abort` | Annule le merge en cours et revient à l'état précédent |

**Flux de résolution complet** :

```text
1. git merge feature     → Conflit détecté
2. git status            → Voir les fichiers en conflit
3. (éditer les fichiers) → Supprimer les marqueurs, choisir le contenu
4. git add fichier       → Marquer comme résolu
5. git commit            → Finaliser le merge
```

---

### Stratégies de résolution rapide

En plus de la résolution manuelle, Git et VS Code offrent des raccourcis pour résoudre les conflits plus rapidement.

**Dans VS Code** :

Quand tu ouvres un fichier en conflit dans VS Code, l'éditeur affiche des boutons cliquables au-dessus de chaque conflit :

- **Accept Current Change** : garder ta version (HEAD)
- **Accept Incoming Change** : garder la version de l'autre branche
- **Accept Both Changes** : garder les deux versions l'une après l'autre
- **Compare Changes** : voir les deux versions côte à côte

**En ligne de commande** :

Pour résoudre un fichier entier en choisissant une version complète :

| Commande | Action |
| -------- | ------ |
| `git checkout --ours fichier` | Garder entièrement ta version |
| `git checkout --theirs fichier` | Garder entièrement l'autre version |

**Attention** : `--ours` et `--theirs` remplacent le fichier entier, pas seulement les zones en conflit. Utilise-les uniquement quand tu veux garder une version complète sans aucune modification de l'autre branche.

---

### Prévenir les conflits

**Définition** : La meilleure façon de gérer les conflits est de les éviter. Voici les bonnes pratiques.

**Bonnes pratiques** :

1. **Pull souvent** : Récupère les modifications des autres régulièrement pour éviter de diverger trop longtemps.

    ```bash
    # Avant de commencer à travailler
    git checkout main
    git pull
    git checkout ta-branche
    git merge main
    ```

2. **Branches courtes** : Plus une branche vit longtemps, plus elle risque de diverger. Fais des branches petites et merge-les rapidement.

3. **Communication dans l'équipe** : Préviens tes collègues quand tu modifies un fichier critique. Évitez de travailler sur les mêmes fichiers en même temps.

4. **Découper le code** : Des fichiers plus petits et plus ciblés réduisent les chances que deux personnes modifient le même fichier.

**Résumé** :

| Pratique | Effet |
| -------- | ----- |
| Pull régulier | Réduit la divergence entre branches |
| Branches courtes | Moins de modifications = moins de conflits |
| Communication | Évite le travail simultané sur les mêmes fichiers |
| Fichiers découpés | Réduit les zones de chevauchement |

---

## Étapes Pratiques

### Étape 1 : Créer un projet de test

```bash
# Créer un dossier de test
mkdir ~/conflits-git
cd ~/conflits-git
git init
git branch -M main

# Créer un fichier avec du contenu initial
cat > config.txt << 'EOF'
# Configuration du serveur
host = localhost
port = 5000
debug = false
timeout = 30
EOF

git add config.txt
git commit -m "Ajout de la configuration initiale"
```

**Résultat attendu** :

```text
[main (root-commit) abc1234] Ajout de la configuration initiale
 1 file changed, 5 insertions(+)
 create mode 100644 config.txt
```

---

### Étape 2 : Créer deux branches qui modifient la même ligne

```bash
# Créer une branche pour le développement
git checkout -b feature/dev-config

# Modifier le port et le debug sur cette branche
cat > config.txt << 'EOF'
# Configuration du serveur
host = localhost
port = 3000
debug = true
timeout = 30
EOF

git add config.txt
git commit -m "Config dev : port 3000 et debug activé"

# Revenir à main
git checkout main

# Créer une branche pour la production
git checkout -b feature/prod-config

# Modifier le port et le debug différemment
cat > config.txt << 'EOF'
# Configuration du serveur
host = localhost
port = 8080
debug = false
timeout = 60
EOF

git add config.txt
git commit -m "Config prod : port 8080 et timeout 60"
```

Tu as maintenant trois versions du fichier :

```text
main :               port = 5000, debug = false, timeout = 30
feature/dev-config : port = 3000, debug = true,  timeout = 30
feature/prod-config: port = 8080, debug = false, timeout = 60
```

---

### Étape 3 : Tenter le merge et observer le conflit

```bash
# Se placer sur main
git checkout main

# Merger d'abord la branche dev (pas de conflit : fast-forward ou merge simple)
git merge feature/dev-config -m "Merge config dev"

# Maintenant merger la branche prod (conflit attendu)
git merge feature/prod-config
```

**Résultat attendu** :

```text
Auto-merging config.txt
CONFLICT (content): Merge conflict in config.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Git a détecté que les deux branches modifient les mêmes lignes de `config.txt`.

---

### Étape 4 : Lire les marqueurs et comprendre les sections

```bash
# Voir le statut (les fichiers en conflit)
git status
```

**Résultat attendu** :

```text
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   config.txt

no changes added to commit (use "git add" and/or "git commit -a")
```

```bash
# Voir le contenu du fichier en conflit
cat config.txt
```

**Résultat attendu** :

```text
# Configuration du serveur
host = localhost
<<<<<<< HEAD
port = 3000
debug = true
timeout = 30
=======
port = 8080
debug = false
timeout = 60
>>>>>>> feature/prod-config
```

**Lecture des marqueurs** :

- `<<<<<<< HEAD` : début de la version actuelle (main, qui contient déjà le merge de dev-config)
- `port = 3000`, `debug = true`, `timeout = 30` : la version de ta branche actuelle
- `=======` : séparation entre les deux versions
- `port = 8080`, `debug = false`, `timeout = 60` : la version de `feature/prod-config`
- `>>>>>>> feature/prod-config` : fin du conflit

---

### Étape 5 : Résoudre manuellement dans l'éditeur

Tu vas combiner les deux versions pour créer la configuration finale souhaitée.

```bash
# Écrire le fichier résolu (on choisit de combiner les deux)
cat > config.txt << 'EOF'
# Configuration du serveur
host = localhost
port = 8080
debug = true
timeout = 60
EOF
```

Tu as choisi :

- Le port 8080 de la branche prod (plus adapté à la production)
- Le debug true de la branche dev (utile pendant le développement)
- Le timeout 60 de la branche prod

Vérifie que le fichier ne contient plus aucun marqueur :

```bash
# Vérifier qu'il n'y a plus de marqueurs de conflit
cat config.txt
```

**Résultat attendu** :

```text
# Configuration du serveur
host = localhost
port = 8080
debug = true
timeout = 60
```

Aucun `<<<<<<<`, `=======` ou `>>>>>>>` ne doit apparaître.

---

### Étape 6 : Finaliser le merge

```bash
# Marquer le fichier comme résolu
git add config.txt

# Vérifier le statut
git status
```

**Résultat attendu** :

```text
On branch main
All conflicts fixed but you are still merging.
  (use "git commit" to conclude merge)

Changes to be committed:
        modified:   config.txt
```

```bash
# Finaliser le merge avec un commit
git commit -m "Merge feature/prod-config : config combinée dev+prod"

# Voir l'historique
git log --oneline --graph
```

**Résultat attendu** :

```text
*   f1e2d3c (HEAD -> main) Merge feature/prod-config : config combinée dev+prod
|\
| * a1b2c3d (feature/prod-config) Config prod : port 8080 et timeout 60
* |   e4f5g6h Merge config dev
|\ \
| |/
|/|
| * i7j8k9l (feature/dev-config) Config dev : port 3000 et debug activé
|/
* m1n2o3p Ajout de la configuration initiale
```

---

### Étape 7 : Annuler un merge en cours

Il arrive que tu réalises en plein conflit que tu ne veux pas fusionner maintenant. Tu peux tout annuler.

```bash
# Créer un nouveau conflit pour tester l'annulation
git checkout -b feature/test-abort

cat > config.txt << 'EOF'
# Configuration du serveur
host = localhost
port = 9090
debug = true
timeout = 60
EOF

git add config.txt
git commit -m "Test : port 9090"

# Revenir à main et modifier aussi
git checkout main

cat > config.txt << 'EOF'
# Configuration du serveur
host = localhost
port = 4000
debug = true
timeout = 60
EOF

git add config.txt
git commit -m "Master : port 4000"

# Tenter le merge
git merge feature/test-abort
```

**Résultat attendu** :

```text
Auto-merging config.txt
CONFLICT (content): Merge conflict in config.txt
Automatic merge failed; fix conflicts and then commit the result.
```

```bash
# Annuler le merge en cours
git merge --abort

# Vérifier que tout est revenu à l'état précédent
git status
cat config.txt
```

**Résultat attendu** :

```text
On branch main
nothing to commit, working tree clean
```

Le fichier `config.txt` est revenu à son état avant le merge. Aucun conflit, aucun marqueur.

---

### Étape 8 : Résoudre avec --ours ou --theirs

Au lieu de résoudre manuellement, tu peux choisir de garder entièrement une version.

```bash
# Relancer le merge
git merge feature/test-abort
```

```text
Auto-merging config.txt
CONFLICT (content): Merge conflict in config.txt
Automatic merge failed; fix conflicts and then commit the result.
```

```bash
# Garder entièrement la version de l'autre branche (theirs)
git checkout --theirs config.txt

# Vérifier le contenu
cat config.txt
```

**Résultat attendu** :

```text
# Configuration du serveur
host = localhost
port = 9090
debug = true
timeout = 60
```

Le fichier contient la version complète de `feature/test-abort` (port 9090).

```bash
# Marquer comme résolu et finaliser
git add config.txt
git commit -m "Merge feature/test-abort : garder config test"

# Nettoyer les branches de test
git branch -d feature/dev-config
git branch -d feature/prod-config
git branch -d feature/test-abort
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `git status` | Voir les fichiers en conflit (marqués "both modified") |
| `git diff` | Voir les différences avec marqueurs de conflit |
| `git add fichier` | Marquer un fichier comme résolu |
| `git commit` | Finaliser le merge après résolution |
| `git merge --abort` | Annuler le merge en cours |
| `git checkout --ours fichier` | Garder ta version du fichier entier |
| `git checkout --theirs fichier` | Garder la version de l'autre branche |
| `git log --merge` | Voir les commits qui causent le conflit |
| `git diff --name-only --diff-filter=U` | Lister uniquement les fichiers en conflit |

---

## Pièges Fréquents

### Piège 1 : Oublier de supprimer les marqueurs de conflit

**Problème** : Tu résous le conflit mais tu laisses les marqueurs `<<<<<<<`, `=======` ou `>>>>>>>` dans le fichier.

**Solution** : Toujours vérifier le contenu du fichier après résolution.

```bash
# Chercher les marqueurs restants dans tous les fichiers
grep -rn "<<<<<<< \|=======$\|>>>>>>> " .
```

Si cette commande n'affiche rien, tous les marqueurs ont été supprimés.

---

### Piège 2 : Ne pas tester après résolution

**Problème** : Tu résous le conflit mais le code combiné ne fonctionne pas.

**Solution** : Après résolution, toujours relire le fichier et tester le code.

```bash
# Relire le fichier complet après résolution
cat fichier-resolu.txt

# Si c'est du code, l'exécuter pour vérifier
# Exemple pour un fichier Python :
# python script.py
```

La résolution d'un conflit ne consiste pas seulement à supprimer les marqueurs. Il faut que le résultat final soit cohérent.

---

### Piège 3 : Faire git add sur un fichier non résolu

**Problème** : Tu fais `git add` sur un fichier qui contient encore des marqueurs de conflit. Git ne vérifie pas que les marqueurs ont été supprimés.

**Solution** : Toujours vérifier le contenu avant de faire `git add`.

```bash
# MAUVAIS : faire add sans vérifier
git add config.txt  # Le fichier contient peut-être encore des marqueurs

# BON : vérifier d'abord
cat config.txt      # Lire le contenu
git add config.txt  # Ajouter seulement si les marqueurs sont supprimés
```

---

### Piège 4 : Confondre --ours et --theirs

**Problème** : Tu utilises `--ours` en pensant garder l'autre branche, ou l'inverse.

**Solution** : Retenir cette règle simple.

| Option | Signification |
| ------ | ------------- |
| `--ours` | Ta branche actuelle (celle sur laquelle tu es, HEAD) |
| `--theirs` | L'autre branche (celle que tu essaies de merger) |

```bash
# Tu es sur main et tu fais git merge feature
# --ours   = main (ta branche)
# --theirs = feature (l'autre branche)
```

**Attention** : Avec `git rebase`, c'est inversé. Pendant un rebase, `--ours` est la branche sur laquelle tu rebases et `--theirs` est ta branche. Cette inversion est une source de confusion fréquente.

---

### Piège 5 : Paniquer et forcer

**Problème** : Face à un conflit complexe, tu essaies des commandes destructrices comme `git checkout .` ou `git reset --hard`.

**Solution** : Utilise `git merge --abort` pour annuler proprement le merge. Tu peux toujours recommencer plus tard.

```bash
# Si tu es perdu pendant un conflit
git merge --abort  # Revient à l'état avant le merge

# Prends le temps de comprendre, puis recommence
git merge feature
```

---

## Checklist de Validation

- [ ] Je sais reconnaître un message de conflit dans le terminal
- [ ] Je comprends les trois marqueurs de conflit (`<<<<<<<`, `=======`, `>>>>>>>`)
- [ ] Je sais identifier la version HEAD et la version de l'autre branche
- [ ] Je sais résoudre un conflit manuellement en éditant le fichier
- [ ] Je sais utiliser `git add` + `git commit` pour finaliser un merge
- [ ] Je sais annuler un merge en cours avec `git merge --abort`
- [ ] Je sais utiliser `git checkout --ours` et `git checkout --theirs`
- [ ] Je connais les bonnes pratiques pour éviter les conflits

---

## Exercice Pratique

**Énoncé** : Simule un projet avec des conflits dans plusieurs fichiers et résous-les de différentes manières.

**Indications** :

1. Crée un nouveau dossier `exercice-conflits` et initialise un dépôt Git
2. Crée deux fichiers : `serveur.conf` et `app.conf` avec du contenu initial
3. Fais un commit initial
4. Crée une branche `feature/production` et modifie les deux fichiers (ports, chemins, options)
5. Reviens sur `main` et modifie les mêmes lignes différemment
6. Tente le merge : deux conflits doivent apparaître
7. Résous `serveur.conf` manuellement en combinant les deux versions
8. Résous `app.conf` avec `git checkout --theirs`
9. Finalise le merge

**Résultat attendu** :

- Le merge est terminé avec succès
- `serveur.conf` contient un mélange des deux versions
- `app.conf` contient la version de `feature/production`
- `git log --graph --oneline` montre le merge commit

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Créer le projet
mkdir ~/exercice-conflits
cd ~/exercice-conflits
git init
```

```bash
# 2. Créer les fichiers initiaux
cat > serveur.conf << 'EOF'
# Configuration serveur
host = 0.0.0.0
port = 5000
workers = 2
log_level = info
EOF

cat > app.conf << 'EOF'
# Configuration application
app_name = MonApp
version = 1.0
database_url = postgres://localhost:5432/mydb
cache_enabled = false
EOF

# 3. Commit initial
git add serveur.conf app.conf
git commit -m "Configuration initiale serveur et app"
```

```bash
# 4. Branche production
git checkout -b feature/production

cat > serveur.conf << 'EOF'
# Configuration serveur
host = 0.0.0.0
port = 8080
workers = 8
log_level = warning
EOF

cat > app.conf << 'EOF'
# Configuration application
app_name = MonApp
version = 2.0
database_url = postgres://db-prod:5432/production
cache_enabled = true
EOF

git add serveur.conf app.conf
git commit -m "Config production : ports, workers, cache"
```

```bash
# 5. Revenir à main et modifier différemment
git checkout main

cat > serveur.conf << 'EOF'
# Configuration serveur
host = 0.0.0.0
port = 3000
workers = 4
log_level = debug
EOF

cat > app.conf << 'EOF'
# Configuration application
app_name = MonApp
version = 1.5
database_url = postgres://localhost:5432/dev
cache_enabled = false
EOF

git add serveur.conf app.conf
git commit -m "Config dev : debug, workers 4, base dev"
```

```bash
# 6. Tenter le merge
git merge feature/production
```

**Résultat attendu** :

```text
Auto-merging serveur.conf
CONFLICT (content): Merge conflict in serveur.conf
Auto-merging app.conf
CONFLICT (content): Merge conflict in app.conf
Automatic merge failed; fix conflicts and then commit the result.
```

```bash
# Vérifier les fichiers en conflit
git status
```

```text
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
        both modified:   app.conf
        both modified:   serveur.conf
```

```bash
# 7. Résoudre serveur.conf manuellement (combiner les deux)
cat > serveur.conf << 'EOF'
# Configuration serveur
host = 0.0.0.0
port = 8080
workers = 4
log_level = debug
EOF

# On a choisi :
# - port 8080 de production
# - workers 4 de dev (compromis)
# - log_level debug de dev (utile en développement)

git add serveur.conf
```

```bash
# 8. Résoudre app.conf avec --theirs (garder la version production)
git checkout --theirs app.conf
git add app.conf
```

```bash
# 9. Finaliser le merge
git commit -m "Merge feature/production : serveur combiné, app en version prod"

# Vérifier le résultat
echo "=== serveur.conf ==="
cat serveur.conf
echo ""
echo "=== app.conf ==="
cat app.conf
echo ""
git log --graph --oneline
```

**Résultat attendu** :

```text
=== serveur.conf ===
# Configuration serveur
host = 0.0.0.0
port = 8080
workers = 4
log_level = debug

=== app.conf ===
# Configuration application
app_name = MonApp
version = 2.0
database_url = postgres://db-prod:5432/production
cache_enabled = true

*   f1e2d3c (HEAD -> main) Merge feature/production : serveur combiné, app en version prod
|\
| * a1b2c3d (feature/production) Config production : ports, workers, cache
* | e4f5g6h Config dev : debug, workers 4, base dev
|/
* i7j8k9l Configuration initiale serveur et app
```

Le merge est terminé. `serveur.conf` contient un mélange des deux branches. `app.conf` contient la version de production.

---

## Navigation

← Fiche précédente : **[Branches et merge](03-branches-merge.md)**

→ Fiche suivante : **[Git avancé](05-git-avance.md)**
