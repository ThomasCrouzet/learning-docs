---
tags:
  - Git
  - Avancé
  - Pratique
description: "Commandes Git avancées pour un workflow professionnel"
estimated_time: "140 min"
fiche_number: 5
total_fiches: 5
cursus: "Git"
---

# 05 - Git avancé

> **En bref** : À la fin de cette fiche, tu sauras maîtriser les commandes Git avancées (rebase, stash, cherry-pick, tags, reflog, reset, revert) pour un workflow professionnel. Lecture estimée : 140 min.


## Prérequis

- Fiche [04 - Résolution de conflits](04-resolution-conflits.md)
- Savoir créer des branches, faire des commits, fusionner et résoudre des conflits
- Savoir utiliser `git log`, `git status` et `git diff`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras maîtriser les commandes Git avancées (rebase, stash, cherry-pick, tags, reflog, reset, revert) pour un workflow professionnel.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que git rebase ?

**Définition** : `git rebase` déplace une série de commits d'une branche pour les réappliquer sur une autre base. Au lieu de créer un commit de merge, rebase réécrit l'historique pour obtenir une ligne droite de commits.

**Le problème que rebase résout** :

Sans rebase, voici les problèmes rencontrés :

1. **Historique encombré** : Chaque merge crée un commit supplémentaire, ce qui rend le `git log` difficile à lire quand il y a beaucoup de branches.

2. **Graphe illisible** : Avec de nombreux merge, le graphe Git ressemble à un plat de spaghetti. Il devient difficile de comprendre l'ordre des modifications.

3. **Revue de code compliquée** : Quand un collègue relit ton travail, un historique linéaire est plus facile à suivre qu'un historique avec des croisements de branches.

**Comment rebase résout ces problèmes** :

| Problème | Solution apportée par rebase |
| -------- | ---------------------------- |
| Historique encombré | Pas de commit de merge supplémentaire |
| Graphe illisible | L'historique devient une ligne droite |
| Revue de code compliquée | Les commits sont ordonnés logiquement |

**Analogie concrète** : Imagine que tu prends des notes pendant un cours. Tu as des notes sur des feuilles volantes (tes commits sur ta branche). Avec merge, tu insères tes feuilles au milieu du classeur en ajoutant un post-it "feuilles ajoutées ici". Avec rebase, tu réécris tes notes à la suite des dernières pages du classeur, comme si tu les avais prises directement après. Le résultat est un classeur propre, dans l'ordre chronologique.

**Ce que rebase n'est PAS** :

- Rebase n'est pas un merge. Un merge combine deux branches en gardant les deux historiques visibles. Rebase réécrit l'historique pour créer une ligne droite.
- Rebase ne supprime pas de commits. Il les déplace et les réapplique. Les anciens commits existent encore temporairement dans le reflog.

**Comparaison merge vs rebase** :

| Merge | Rebase |
| ----- | ------ |
| Crée un commit de merge | Pas de commit supplémentaire |
| Préserve l'historique complet | Réécrit l'historique |
| Graphe avec des branches visibles | Graphe linéaire (ligne droite) |
| Sûr sur les branches partagées | Dangereux sur les branches partagées |

**Schéma : merge vs rebase** :

```text
AVANT (situation de départ) :

main :      A --- B --- C
                   \
feature :           D --- E

─────────────────────────────────────────

APRÈS MERGE (git checkout main && git merge feature) :

main :      A --- B --- C --- M    (M = commit de merge)
                   \         /
feature :           D --- E

─────────────────────────────────────────

APRÈS REBASE (git checkout feature && git rebase main) :

main :      A --- B --- C
                         \
feature :                 D' --- E'   (D' et E' = copies de D et E)

Puis fast-forward (git checkout main && git merge feature) :

main :      A --- B --- C --- D' --- E'   (ligne droite)
```

---

### Qu'est-ce que git stash ?

**Définition** : `git stash` met de côté temporairement les modifications en cours (non commitées) pour te permettre de travailler sur autre chose, puis de récupérer ces modifications plus tard.

**Le problème que stash résout** :

Sans stash, voici les problèmes rencontrés :

1. **Changement de branche impossible** : Tu as des modifications non commitées et Git refuse de changer de branche car il y a un risque de perte de données.
2. **Commit de travail en cours** : Tu es obligé de faire un commit incomplet ("WIP", "travail en cours") juste pour pouvoir changer de branche. Cela pollue l'historique.
3. **Perte de contexte** : Si tu annules tes modifications pour changer de branche, tu perds ton travail en cours.

**Comment stash résout ces problèmes** :

| Problème | Solution apportée par stash |
| -------- | --------------------------- |
| Changement de branche impossible | Stash sauvegarde tes modifications et nettoie le répertoire |
| Commit de travail en cours | Pas besoin de commit : stash les garde à part |
| Perte de contexte | Stash conserve tes modifications pour les récupérer plus tard |

**Analogie concrète** : Tu es en train de cuisiner un gâteau (ton travail en cours). On sonne à la porte et tu dois t'occuper d'autre chose. Tu mets tous tes ingrédients et ustensiles dans un tiroir étiqueté (stash). Tu gères la situation. Quand tu reviens, tu rouvres le tiroir et tu reprends exactement là où tu en étais.

**Ce que stash n'est PAS** :

- Stash n'est pas un commit. Les modifications stashées ne font pas partie de l'historique Git. Elles sont stockées dans une pile temporaire.
- Stash n'est pas permanent. Si tu supprimes le stash ou réinitialises le dépôt, les modifications sont perdues.

**Commandes stash** :

| Commande | Action |
| -------- | ------ |
| `git stash` ou `git stash push` | Mettre de côté les modifications en cours |
| `git stash push -m "description"` | Mettre de côté avec un message descriptif |
| `git stash list` | Lister tous les stashs enregistrés |
| `git stash pop` | Récupérer le dernier stash et le supprimer de la pile |
| `git stash apply` | Récupérer le dernier stash sans le supprimer de la pile |
| `git stash drop` | Supprimer le dernier stash sans l'appliquer |
| `git stash drop stash@{2}` | Supprimer un stash spécifique |

---

### Qu'est-ce que git cherry-pick ?

**Définition** : `git cherry-pick` copie un commit spécifique d'une branche et l'applique sur ta branche actuelle. Cela crée un nouveau commit avec le même contenu mais un SHA (identifiant) différent.

**Le problème que cherry-pick résout** :

Sans cherry-pick, voici les problèmes rencontrés :

1. **Besoin d'un seul commit** : Tu as besoin d'une correction de bug qui se trouve sur une autre branche, mais tu ne veux pas fusionner toute la branche.
2. **Merge trop large** : Fusionner une branche entière apporterait des fonctionnalités non finies ou non testées.
3. **Hotfix rapide** : Un bug critique est corrigé sur une branche de développement et tu dois appliquer uniquement cette correction en production.

**Comment cherry-pick résout ces problèmes** :

| Problème | Solution apportée par cherry-pick |
| -------- | --------------------------------- |
| Besoin d'un seul commit | Cherry-pick copie exactement le commit voulu |
| Merge trop large | Pas de merge : seul le commit ciblé est copié |
| Hotfix rapide | Application précise d'une correction spécifique |

**Analogie concrète** : Imagine un livre de recettes (une branche) qui contient 50 recettes. Tu ne veux copier qu'une seule recette (un commit) dans ton propre carnet (ta branche). Cherry-pick te permet de photocopier cette recette précise sans prendre tout le livre.

**Ce que cherry-pick n'est PAS** :

- Cherry-pick ne déplace pas un commit. Il le copie. Le commit original reste sur sa branche d'origine.
- Cherry-pick ne crée pas le même commit. Le nouveau commit a un SHA différent, même si le contenu est identique.

---

### Qu'est-ce qu'un tag ?

**Définition** : Un tag est un marqueur permanent posé sur un commit précis de l'historique. Il sert à identifier un point important, comme une version de release (v1.0, v2.0).

**Le problème que les tags résolvent** :

Sans tags, voici les problèmes rencontrés :

1. **Identification des versions** : Tu dois te souvenir du SHA du commit correspondant à la version 1.0 de ton projet (par exemple `a1b2c3d`).

2. **Communication dans l'équipe** : Dire "la version du commit a1b2c3d" est moins clair que "la version v1.0".

3. **Retour à une version** : Sans repère, revenir à une version précise demande de fouiller dans l'historique.

**Comment les tags résolvent ces problèmes** :

| Problème | Solution apportée par les tags |
| -------- | ------------------------------ |
| Identification des versions | Un nom lisible (v1.0) au lieu d'un SHA |
| Communication dans l'équipe | Tout le monde parle de "v1.0" |
| Retour à une version | `git checkout v1.0` suffit |

**Analogie concrète** : Les tags sont comme des marque-pages dans un livre. Au lieu de dire "page 247", tu mets un marque-page étiqueté "Chapitre important". Tu peux retrouver cette page instantanément.

**Deux types de tags** :

| Tag léger | Tag annoté |
| --------- | ---------- |
| Simple pointeur vers un commit | Objet Git complet avec métadonnées |
| Pas de message, pas d'auteur | Contient un message, un auteur et une date |
| `git tag v1.0` | `git tag -a v1.0 -m "Release 1.0"` |
| Pour un usage local ou temporaire | Pour les releases officielles |

---

### Qu'est-ce que git reflog ?

**Définition** : `git reflog` (référence log) est un journal qui enregistre toutes les actions qui ont déplacé le pointeur HEAD dans ton dépôt. Il garde une trace de chaque checkout, commit, rebase, reset, merge et amend.

**Le problème que reflog résout** :

Sans reflog, voici les problèmes rencontrés :

1. **Commits "perdus"** : Après un `git reset --hard`, les commits supprimés semblent irrécupérables.

2. **Rebase raté** : Un rebase qui a mal tourné semble irréversible.

3. **Branche supprimée** : Une branche supprimée par erreur et ses commits semblent perdus.

**Comment reflog résout ces problèmes** :

| Problème | Solution apportée par reflog |
| -------- | ---------------------------- |
| Commits "perdus" | Reflog contient le SHA de chaque état précédent |
| Rebase raté | Tu peux revenir à l'état avant le rebase |
| Branche supprimée | Les commits sont retrouvables via reflog |

**Analogie concrète** : Reflog est comme l'historique de navigation de ton navigateur web. Même si tu fermes un onglet (supprimes un commit), tu peux retrouver la page dans l'historique et la rouvrir. Reflog garde une trace de tous les endroits où HEAD est passé.

**Ce que reflog n'est PAS** :

- Reflog n'est pas permanent. Les entrées sont automatiquement nettoyées après 90 jours par défaut.
- Reflog n'est pas partagé. Chaque dépôt local a son propre reflog. Il n'est pas envoyé au serveur distant.

---

### Qu'est-ce que git reset ?

**Définition** : `git reset` déplace le pointeur HEAD (et optionnellement la branche) vers un commit précédent. Selon l'option utilisée, il modifie aussi l'index (staging area) et le répertoire de travail.

**Le problème que reset résout** :

Sans reset, voici les problèmes rencontrés :

1. **Commit erroné** : Tu as fait un commit avec du code incorrect ou un mauvais message.

2. **Fichiers ajoutés par erreur** : Tu as fait `git add` sur des fichiers que tu ne voulais pas inclure.

3. **Retour en arrière** : Tu veux revenir à un état précédent de ton projet.

**Les trois modes de reset** :

| Mode | Commande | HEAD | Index (staging) | Répertoire de travail |
| ---- | -------- | ---- | --------------- | --------------------- |
| `--soft` | `git reset --soft HEAD~1` | Déplacé | Inchangé | Inchangé |
| `--mixed` | `git reset HEAD~1` | Déplacé | Réinitialisé | Inchangé |
| `--hard` | `git reset --hard HEAD~1` | Déplacé | Réinitialisé | Réinitialisé |

**Explication de chaque mode** :

- **`--soft`** : Annule le commit, mais garde les modifications dans le staging (prêtes à être commitées à nouveau). Utile pour modifier le message d'un commit ou regrouper plusieurs commits.
- **`--mixed`** (par défaut) : Annule le commit et retire les fichiers du staging, mais garde les modifications dans le répertoire de travail. Utile pour revoir ce que tu veux inclure avant de refaire le commit.
- **`--hard`** : Annule le commit et supprime toutes les modifications. Le répertoire de travail revient exactement à l'état du commit ciblé. Les modifications non commitées sont perdues définitivement.

**Analogie concrète** : Imagine que tu écris une lettre. Tu as écrit le brouillon (répertoire de travail), mis la lettre dans une enveloppe (staging), et posté l'enveloppe (commit).

- `--soft` : Tu récupères l'enveloppe dans la boîte aux lettres. La lettre est toujours dans l'enveloppe, prête à être repostée.
- `--mixed` : Tu récupères l'enveloppe et tu sors la lettre. Tu peux la relire et la modifier avant de la remettre dans une enveloppe.
- `--hard` : Tu récupères l'enveloppe et tu jettes la lettre. Tu repars de zéro.

---

### Qu'est-ce que git revert ?

**Définition** : `git revert` annule les modifications d'un commit en créant un nouveau commit qui fait l'inverse. L'historique est préservé : on voit le commit original et le commit d'annulation.

**Le problème que revert résout** :

Sans revert, voici les problèmes rencontrés :

1. **Annulation sur branche partagée** : `git reset` réécrit l'historique, ce qui pose problème si d'autres personnes travaillent sur la même branche.

2. **Traçabilité** : Avec reset, on ne voit pas qu'un commit a été annulé. Avec revert, l'annulation est visible dans l'historique.

**Comment revert résout ces problèmes** :

| Problème | Solution apportée par revert |
| -------- | ---------------------------- |
| Annulation sur branche partagée | Revert ajoute un commit, il ne réécrit pas l'historique |
| Traçabilité | Le commit d'annulation est visible dans le log |

**Analogie concrète** : Reset, c'est comme effacer une ligne dans un cahier (personne ne sait qu'elle a existé). Revert, c'est comme barrer une ligne et écrire la correction en dessous. Tout le monde peut voir ce qui a été modifié et pourquoi.

**Comparaison reset vs revert** :

| Reset | Revert |
| ----- | ------ |
| Réécrit l'historique | Ajoute un nouveau commit |
| Dangereux sur branche partagée | Sûr sur branche partagée |
| Les commits supprimés disparaissent du log | Le commit original reste visible |
| Utilisé en local | Utilisé en local et sur les branches partagées |

---

## Étapes Pratiques

### Étape 1 : Préparer le projet de test

Crée un dépôt Git avec quelques commits pour servir de base aux exercices.

```bash
# Créer un dossier de test
mkdir ~/git-avance
cd ~/git-avance
git init
# Forcer le nom de branche principale pour coller aux exemples (main)
git branch -M main

# Créer un fichier initial
cat > app.txt << 'EOF'
# Application
version = 1.0
auteur = John
statut = dev
EOF

git add app.txt
git commit -m "Commit initial : app.txt version 1.0"

# Ajouter un deuxième commit
cat > app.txt << 'EOF'
# Application
version = 1.1
auteur = John
statut = dev
fonctionnalite = login
EOF

git add app.txt
git commit -m "Ajout fonctionnalité login, version 1.1"

# Ajouter un troisième commit
cat > app.txt << 'EOF'
# Application
version = 1.2
auteur = John
statut = dev
fonctionnalite = login
theme = sombre
EOF

git add app.txt
git commit -m "Ajout thème sombre, version 1.2"
```

Vérifie l'historique :

```bash
git log --oneline
```

**Résultat attendu** :

```text
ghi9012 (HEAD -> main) Ajout thème sombre, version 1.2
def5678 Ajout fonctionnalité login, version 1.1
abc1234 Commit initial : app.txt version 1.0
```

---

### Étape 2 : Rebase simple

Tu vas créer une branche, faire des commits dessus, puis la rebaser sur `main` après que `main` a avancé.

```bash
# Créer une branche feature depuis main
git checkout -b feature/api

# Ajouter un commit sur feature/api
cat > api.txt << 'EOF'
# API
endpoint = /users
methode = GET
EOF

git add api.txt
git commit -m "Ajout endpoint GET /users"

# Ajouter un deuxième commit sur feature/api
cat >> api.txt << 'EOF'
endpoint2 = /products
methode2 = POST
EOF

git add api.txt
git commit -m "Ajout endpoint POST /products"
```

Maintenant, simule un avancement de `main` :

```bash
# Revenir sur main et ajouter un commit
git checkout main

cat > config.txt << 'EOF'
# Configuration
database = postgresql
port = 5432
EOF

git add config.txt
git commit -m "Ajout configuration base de données"
```

Les deux branches ont divergé depuis `ghi9012`. Maintenant, rebase `feature/api` sur `main` :

```bash
# Se placer sur la branche feature
git checkout feature/api

# Rebaser sur main
git rebase main
```

**Résultat attendu** :

```text
Successfully rebased and updated refs/heads/feature/api.
```

Vérifie le graphe :

```bash
git log --oneline --graph --all
```

```text
* stu5678 (HEAD -> feature/api) Ajout endpoint POST /products
* vwx9012 Ajout endpoint GET /users
* jkl3456 (main) Ajout configuration base de données
* ghi9012 Ajout thème sombre, version 1.2
* def5678 Ajout fonctionnalité login, version 1.1
* abc1234 Commit initial : app.txt version 1.0
```

L'historique est linéaire. Les commits de `feature/api` sont maintenant après le commit de `main`.

```bash
# Finaliser : merger feature/api dans main (fast-forward)
git checkout main
git merge feature/api
```

```text
Updating jkl3456..stu5678
Fast-forward
 api.txt | 5 +++++
 1 file changed, 5 insertions(+)
 create mode 100644 api.txt
```

Pas de commit de merge. L'historique reste une ligne droite.

---

### Étape 3 : Stash

Tu vas modifier un fichier, mettre les modifications de côté, puis les récupérer.

```bash
# Modifier un fichier sans commiter
cat > app.txt << 'EOF'
# Application
version = 2.0
auteur = John
statut = production
fonctionnalite = login
theme = sombre
nouvelle_feature = dashboard
EOF

# Vérifier que les modifications existent
git status
```

**Résultat attendu** :

```text
On branch main
Changes not staged for commit:
        modified:   app.txt
```

```bash
# Mettre les modifications de côté avec un message
git stash push -m "Dashboard en cours de développement"

# Vérifier que le répertoire est propre
git status
```

**Résultat attendu** :

```text
Saved working directory and index state On main: Dashboard en cours de développement
On branch main
nothing to commit, working tree clean
```

Les modifications ont disparu du répertoire de travail. Elles sont stockées dans le stash.

```bash
# Lister les stashs puis récupérer
git stash list
git stash pop
```

**Résultat attendu** :

```text
stash@{0}: On main: Dashboard en cours de développement
On branch main
Changes not staged for commit:
        modified:   app.txt
Dropped refs/stash@{0} (abc123def456)
```

Le fichier `app.txt` contient à nouveau les modifications du dashboard. Le stash a été supprimé de la pile.

```bash
# Annuler les modifications pour repartir propre
git restore app.txt
```

---

### Étape 4 : Cherry-pick

Tu vas copier un commit spécifique d'une branche vers une autre.

```bash
# Créer une branche avec un bug fix
git checkout -b bugfix/correction-port

cat > config.txt << 'EOF'
# Configuration
database = postgresql
port = 5433
EOF

git add config.txt
git commit -m "Fix : correction du port PostgreSQL (5433)"

# Ajouter un autre commit (fonctionnalité non finie)
cat > config.txt << 'EOF'
# Configuration
database = postgresql
port = 5433
cache = redis
EOF

git add config.txt
git commit -m "WIP : ajout redis (non terminé)"
```

Tu veux uniquement le fix du port sur `main`, pas le commit redis non terminé.

```bash
# Trouver le SHA du commit de fix
git log --oneline -2
```

```text
yza3456 (HEAD -> bugfix/correction-port) WIP : ajout redis (non terminé)
bcd7890 Fix : correction du port PostgreSQL (5433)
```

```bash
# Revenir sur main et cherry-pick uniquement le commit de fix
git checkout main
git cherry-pick bcd7890
```

**Résultat attendu** :

```text
[main efg1234] Fix : correction du port PostgreSQL (5433)
 1 file changed, 1 insertion(+), 1 deletion(-)
```

Seul le fix du port est appliqué sur `main`. Le commit redis est resté sur `bugfix/correction-port`.

```bash
# Nettoyer la branche de test
git branch -D bugfix/correction-port
```

---

### Étape 5 : Créer des tags

```bash
# Créer un tag léger
git tag v1.0

# Créer un tag annoté avec un message
git tag -a v1.1 -m "Release 1.1 : ajout API et fix port"

# Lister tous les tags
git tag
```

**Résultat attendu** :

```text
v1.0
v1.1
```

```bash
# Voir les détails d'un tag annoté
git show v1.1
```

```text
tag v1.1
Tagger: John <john@example.com>
Date:   ...

Release 1.1 : ajout API et fix port
commit efg1234...
```

Le tag annoté contient l'auteur, la date et le message. Le tag léger ne contient que la référence au commit.

```bash
# Supprimer puis recréer un tag
git tag -d v1.0
git tag v1.0
```

---

### Étape 6 : Utiliser reflog pour retrouver un commit perdu

Tu vas "perdre" un commit avec `reset --hard`, puis le retrouver grâce à `reflog`.

```bash
# Vérifier l'historique actuel
git log --oneline -3
```

```text
efg1234 (HEAD -> main, tag: v1.1, tag: v1.0) Fix : correction du port PostgreSQL (5433)
stu5678 Ajout endpoint POST /products
vwx9012 Ajout endpoint GET /users
```

```bash
# "Perdre" le dernier commit avec reset --hard
git reset --hard HEAD~1

# Vérifier que le commit a disparu
git log --oneline -3
```

```text
stu5678 (HEAD -> main) Ajout endpoint POST /products
vwx9012 Ajout endpoint GET /users
jkl3456 Ajout configuration base de données
```

Le commit "Fix : correction du port" ne semble plus exister. Mais reflog l'a enregistré.

```bash
git reflog
```

```text
stu5678 (HEAD -> main) HEAD@{0}: reset: moving to HEAD~1
efg1234 (tag: v1.1, tag: v1.0) HEAD@{1}: cherry-pick: Fix : correction du port PostgreSQL (5433)
...
```

`HEAD@{1}` pointait vers le commit perdu (`efg1234`).

```bash
# Récupérer le commit perdu
git reset --hard efg1234

# Vérifier que le commit est revenu
git log --oneline -3
```

**Résultat attendu** :

```text
efg1234 (HEAD -> main, tag: v1.1, tag: v1.0) Fix : correction du port PostgreSQL (5433)
stu5678 Ajout endpoint POST /products
vwx9012 Ajout endpoint GET /users
```

Le commit est récupéré. Reflog est ton filet de sécurité.

---

### Étape 7 : Reset --soft vs --mixed vs --hard

Tu vas observer les différences entre les trois modes de reset en créant un commit de test, puis en l'annulant de trois manières.

```bash
# Créer un commit de test
echo "fichier de test pour reset" > test.txt
git add test.txt
git commit -m "Ajout fichier test pour démonstration reset"
```

**Test `--soft`** : annule le commit, garde les modifications en staging.

```bash
git reset --soft HEAD~1
git status
```

```text
On branch main
Changes to be committed:
        new file:   test.txt
```

Le fichier est toujours dans le staging, prêt à être recommité.

```bash
# Recommiter pour tester le mode suivant
git commit -m "Ajout fichier test pour démonstration reset"
```

**Test `--mixed`** : annule le commit, retire du staging, garde les fichiers sur le disque.

```bash
git reset HEAD~1
git status
```

```text
On branch main
Untracked files:
        test.txt
```

Le fichier existe sur le disque mais n'est plus dans le staging.

```bash
# Recommiter pour tester le dernier mode
git add test.txt
git commit -m "Ajout fichier test pour démonstration reset"
```

**Test `--hard`** : annule le commit et supprime tout.

```bash
git reset --hard HEAD~1
ls test.txt 2>&1
```

```text
HEAD is now at efg1234 Fix : correction du port PostgreSQL (5433)
ls: test.txt: No such file or directory
```

Le fichier a été supprimé du disque. Les modifications sont perdues (sauf via reflog).

---

### Étape 8 : Revert un commit

Tu vas annuler un commit en créant un commit d'annulation.

```bash
# Ajouter un commit qu'on va annuler
cat > config.txt << 'EOF'
# Configuration
database = mysql
port = 3306
EOF

git add config.txt
git commit -m "Changement vers MySQL (erreur)"

# Annuler ce commit avec revert
git revert HEAD --no-edit
```

**Résultat attendu** :

```text
[main klm9012] Revert "Changement vers MySQL (erreur)"
 1 file changed, 2 insertions(+), 2 deletions(-)
```

Vérifie le contenu et l'historique :

```bash
cat config.txt
git log --oneline -4
```

```text
# Configuration
database = postgresql
port = 5433

klm9012 (HEAD -> main) Revert "Changement vers MySQL (erreur)"
hij5678 Changement vers MySQL (erreur)
efg1234 (tag: v1.1, tag: v1.0) Fix : correction du port PostgreSQL (5433)
stu5678 Ajout endpoint POST /products
```

Le commit d'erreur est toujours visible dans l'historique, mais un nouveau commit l'annule. C'est la méthode sûre pour annuler sur une branche partagée.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `git rebase main` | Rebaser la branche courante sur main |
| `git rebase --abort` | Annuler un rebase en cours |
| `git stash` | Mettre de côté les modifications en cours |
| `git stash push -m "message"` | Stash avec un message descriptif |
| `git stash list` | Lister tous les stashs |
| `git stash pop` | Récupérer et supprimer le dernier stash |
| `git stash apply` | Récupérer le dernier stash sans le supprimer |
| `git stash drop` | Supprimer le dernier stash |
| `git cherry-pick <SHA>` | Copier un commit spécifique sur la branche courante |
| `git tag v1.0` | Créer un tag léger |
| `git tag -a v1.0 -m "message"` | Créer un tag annoté |
| `git tag` | Lister tous les tags |
| `git tag -d v1.0` | Supprimer un tag local |
| `git push origin --tags` | Envoyer tous les tags au dépôt distant |
| `git reflog` | Afficher le journal de toutes les actions HEAD |
| `git reset --soft HEAD~1` | Annuler le dernier commit, garder les modifications en staging |
| `git reset HEAD~1` | Annuler le dernier commit, garder les modifications dans le répertoire |
| `git reset --hard HEAD~1` | Annuler le dernier commit et supprimer les modifications |
| `git revert <SHA>` | Annuler un commit en créant un commit d'annulation |

---

## Pièges Fréquents

### Piège 1 : Rebase sur une branche partagée

**Problème** : Tu fais `git rebase` sur une branche que d'autres personnes utilisent (comme `main` ou `develop`). Rebase réécrit l'historique : les SHA des commits changent. Les autres développeurs ont toujours les anciens SHA, ce qui crée des conflits et de la confusion.

**Solution** : Ne jamais rebaser une branche partagée. Utilise rebase uniquement sur tes branches locales personnelles.

```bash
# MAUVAIS : rebaser main (branche partagée)
git checkout main
git rebase feature    # NE JAMAIS FAIRE

# BON : rebaser ta branche locale sur main
git checkout feature
git rebase main       # OK : tu réécrits seulement ta branche personnelle
```

**Règle** : Si quelqu'un d'autre a accès à la branche, utilise `merge`. Si c'est ta branche personnelle, tu peux utiliser `rebase`.

---

### Piège 2 : Stash oublié

**Problème** : Tu fais `git stash`, tu continues à travailler, et tu oublies de récupérer le stash. Plusieurs jours plus tard, tu ne te souviens plus de ce que contient le stash.

**Solution** : Toujours ajouter un message descriptif et vérifier régulièrement la liste des stashs.

```bash
# MAUVAIS : stash sans message
git stash

# BON : stash avec un message clair
git stash push -m "Formulaire inscription - validation email en cours"

# Vérifier régulièrement
git stash list
```

---

### Piège 3 : Cherry-pick crée un commit avec un SHA différent

**Problème** : Après un cherry-pick, tu penses que le commit est le même que l'original. Mais il a un SHA différent. Si tu merges plus tard la branche d'origine, Git peut voir les deux commits comme différents et créer des doublons ou des conflits.

**Solution** : Utilise cherry-pick uniquement quand un merge complet n'est pas souhaitable. Documente dans le message de commit que c'est un cherry-pick.

```bash
# Le commit original a le SHA abc1234
# Après cherry-pick, le nouveau commit a le SHA def5678
# Ce sont deux commits différents pour Git, même si le contenu est identique
```

---

### Piège 4 : Reset --hard perd les modifications

**Problème** : Tu fais `git reset --hard` et tes modifications non commitées sont supprimées définitivement. Contrairement aux commits, les modifications non commitées ne sont pas dans le reflog.

**Solution** : Avant un `reset --hard`, vérifie que tu n'as pas de modifications non commitées. En cas de doute, fais un stash d'abord.

```bash
# Vérifier avant un reset --hard
git status

# Si des modifications existent, les sauvegarder
git stash push -m "Sauvegarde avant reset"

# Maintenant le reset --hard est sûr
git reset --hard HEAD~1
```

---

### Piège 5 : Confondre reset et revert

**Problème** : Tu utilises `reset` sur une branche partagée (poussée sur le serveur). Les autres développeurs ont toujours les commits supprimés dans leur historique, ce qui crée des conflits lors du prochain `pull`.

**Solution** : Sur une branche partagée, utilise toujours `revert`. Utilise `reset` uniquement en local, avant d'avoir poussé tes commits.

| Situation | Commande à utiliser |
| --------- | ------------------- |
| Commit local (non poussé) | `git reset` |
| Commit poussé (branche partagée) | `git revert` |

---

## Checklist de Validation

- [ ] Je sais rebaser une branche sur une autre avec `git rebase`
- [ ] Je comprends la différence entre merge et rebase
- [ ] Je sais mettre des modifications de côté avec `git stash`
- [ ] Je sais récupérer un stash avec `git stash pop`
- [ ] Je sais copier un commit spécifique avec `git cherry-pick`
- [ ] Je sais créer un tag léger et un tag annoté
- [ ] Je sais utiliser `git reflog` pour retrouver un commit perdu
- [ ] Je comprends les trois modes de `git reset` (soft, mixed, hard)
- [ ] Je sais annuler un commit avec `git revert`
- [ ] Je sais quand utiliser reset vs revert

---

## Exercice Pratique

**Énoncé** : Effectue un workflow Git complet qui utilise toutes les commandes avancées de cette fiche.

**Indications** :

1. Crée un nouveau dossier `exercice-git-avance` et initialise un dépôt Git
2. Crée un fichier `projet.txt` avec un contenu initial et fais un commit
3. Crée une branche `feature/auth` et fais 2 commits dessus (ajout login, ajout logout)
4. Reviens sur `main` et fais 1 commit (ajout config)
5. Rebase `feature/auth` sur `main` et fais un fast-forward merge
6. Modifie `projet.txt` sans commiter, puis utilise `stash` pour mettre de côté
7. Crée une branche `feature/ui` avec 2 commits (ajout header, ajout footer)
8. Reviens sur `main` et cherry-pick uniquement le commit "ajout header"
9. Récupère le stash
10. Crée un tag annoté `v1.0` avec le message "Première release"
11. Fais un commit "erreur volontaire" puis annule-le avec `revert`
12. Fais un autre commit "test reset" puis annule-le avec `reset --soft`
13. Consulte le reflog pour voir tout l'historique des actions

**Résultat attendu** :

- L'historique montre un workflow propre avec rebase, cherry-pick et revert
- Le reflog contient toutes les actions effectuées
- Le tag `v1.0` est présent
- Le fichier contient les modifications récupérées du stash

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Créer le projet
mkdir ~/exercice-git-avance
cd ~/exercice-git-avance
git init

# 2. Fichier initial
cat > projet.txt << 'EOF'
# Mon Projet
description = Application web
version = 0.1
EOF

git add projet.txt
git commit -m "Commit initial : projet.txt"

# 3. Branche feature/auth avec 2 commits
git checkout -b feature/auth
echo "login = actif" >> projet.txt
git add projet.txt && git commit -m "Ajout fonctionnalité login"
echo "logout = actif" >> projet.txt
git add projet.txt && git commit -m "Ajout fonctionnalité logout"

# 4. Revenir sur main et ajouter un commit
git checkout main
cat > config.txt << 'EOF'
# Config
env = development
debug = true
EOF
git add config.txt && git commit -m "Ajout fichier de configuration"

# 5. Rebase feature/auth sur main et fast-forward
git checkout feature/auth
git rebase main
git checkout main
git merge feature/auth

# 6. Modifier sans commiter puis stash
echo "cache = redis" >> projet.txt
git stash push -m "Ajout cache redis en cours"

# 7. Branche feature/ui avec 2 commits
git checkout -b feature/ui
echo "<header>Mon Application</header>" > header.html
git add header.html && git commit -m "Ajout du header"
echo "<footer>Copyright 2026</footer>" > footer.html
git add footer.html && git commit -m "Ajout du footer"

# 8. Cherry-pick uniquement le header sur main
# Noter le SHA du commit "Ajout du header"
HEADER_SHA=$(git log --oneline -2 | tail -1 | cut -d' ' -f1)
git checkout main
git cherry-pick $HEADER_SHA

# 9. Récupérer le stash et commiter
git stash pop
git add projet.txt && git commit -m "Ajout cache redis"

# 10. Créer un tag annoté
git tag -a v1.0 -m "Première release"

# 11. Commit erreur + revert
echo "erreur = oui" >> projet.txt
git add projet.txt && git commit -m "Erreur volontaire"
git revert HEAD --no-edit

# 12. Commit test + reset --soft
echo "test = reset" >> config.txt
git add config.txt && git commit -m "Test reset"
git reset --soft HEAD~1
# Nettoyer
git reset HEAD config.txt
git restore config.txt

# 13. Consulter le reflog
git reflog
```

**Résultat attendu du reflog** (les SHA varient) :

```text
... HEAD@{0}: reset: moving to HEAD
... HEAD@{1}: reset: moving to HEAD~1
... HEAD@{2}: commit: Test reset
... HEAD@{3}: revert: Revert "Erreur volontaire"
... HEAD@{4}: commit: Erreur volontaire
... HEAD@{5}: commit: Ajout cache redis
... HEAD@{6}: cherry-pick: Ajout du header
...
```

```bash
# Vérifier l'historique final
git log --oneline --graph
```

```text
* ... Revert "Erreur volontaire"
* ... Erreur volontaire
* ... Ajout cache redis
* ... Ajout du header
* ... Ajout fonctionnalité logout
* ... Ajout fonctionnalité login
* ... Ajout fichier de configuration
* ... Commit initial : projet.txt
```

```bash
# Nettoyer
git branch -D feature/auth
git branch -D feature/ui
```

---

## Navigation

← Fiche précédente : **[Résolution de conflits](04-resolution-conflits.md)**
