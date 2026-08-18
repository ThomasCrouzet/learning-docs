---
tags:
  - Git
  - Débutant
  - Concept
description: "Les concepts de Git"
estimated_time: "55 min"
fiche_number: 1
total_fiches: 5
cursus: "Git"
---

# 01 - Les concepts de Git

> **En bref** : À la fin de cette fiche, tu comprendras les concepts fondamentaux de Git : repository, commit, staging area, et historique. Lecture estimée : 55 min.


## Prérequis

- Fiche [02-unix-bash/01 - Le système de fichiers Unix/Linux](../02-unix-bash/01-systeme-fichiers.md)
- Fiche [02-unix-bash/03 - Les commandes de base Unix](../02-unix-bash/03-commandes-base.md)
- Savoir utiliser le terminal
- Aucune connaissance préalable de Git n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu comprendras les concepts fondamentaux de Git : repository, commit, staging area, et historique.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Git ?

**Définition** : Git est un système de contrôle de version distribué qui permet de suivre les modifications apportées aux fichiers d'un projet au fil du temps.

**Le problème que Git résout** :

Sans Git (ou outil similaire), voici les problèmes rencontrés :

1. **Perte de modifications** : Si tu fais une erreur, tu ne peux pas revenir en arrière.

2. **Versions multiples** : Tu te retrouves avec `projet_v1.zip`, `projet_v2_final.zip`, `projet_v2_final_vraiment.zip`.

3. **Travail en équipe** : Impossible de savoir qui a modifié quoi, et les modifications se perdent quand plusieurs personnes travaillent en même temps.

**Comment Git résout ces problèmes** :

| Problème | Solution apportée par Git |
| -------- | ------------------------- |
| Perte de modifications | Git conserve l'historique complet, tu peux revenir à n'importe quel état |
| Versions multiples | Un seul dossier, avec tout l'historique stocké par Git |
| Travail en équipe | Git fusionne les modifications et identifie les auteurs |

**Analogie concrète** : Git est comme un système de sauvegarde automatique d'un document avec un historique illimité. Imagine un traitement de texte qui garde toutes les versions de ton document depuis sa création. Tu peux voir qui a écrit chaque phrase, quand, et pourquoi. Tu peux revenir à n'importe quelle version passée en un clic.

**Ce que Git n'est PAS** :

- Git n'est pas GitHub. Git est l'outil, GitHub est un service en ligne qui héberge des projets Git.
- Git n'est pas un système de sauvegarde automatique. Tu décides quand créer un point de sauvegarde (commit).
- Git n'est pas réservé au code. Tu peux l'utiliser pour tout projet textuel.

---

### Le repository (dépôt)

**Définition** : Un repository (ou dépôt) est un dossier de projet suivi par Git. Il contient tous les fichiers du projet plus un dossier caché `.git` qui stocke l'historique.

**Structure d'un repository** :

```text
mon-projet/
├── .git/              ← Dossier caché de Git (ne pas toucher)
│   ├── objects/       ← Stockage des commits
│   ├── refs/          ← Références des branches
│   └── ...
├── src/               ← Tes fichiers
├── docs/
└── readme.md
```

**Types de repositories** :

| Type | Description |
| ---- | ----------- |
| Repository local | Sur ton ordinateur |
| Repository distant (remote) | Sur un serveur (GitHub, GitLab, etc.) |

**Analogie** : Le repository est comme un classeur complet de ton projet. Le dossier `.git` est comme un index caché qui garde la trace de toutes les modifications de chaque document du classeur.

---

### Le commit

**Définition** : Un commit est un instantané (snapshot) de ton projet à un moment donné. C'est un point de sauvegarde avec un identifiant unique et un message descriptif.

**Contenu d'un commit** :

| Élément | Description |
| ------- | ----------- |
| ID (hash) | Identifiant unique (ex: `a1b2c3d4...`) |
| Message | Description des modifications |
| Auteur | Qui a fait le commit |
| Date | Quand le commit a été créé |
| Modifications | Liste des changements |
| Parent | Le commit précédent |

**Exemple de visualisation** :

```text
commit a1b2c3d4e5f6...
Author: Omar Martin <alex@email.com>
Date:   Mon Jan 15 10:30:00 2024

    Ajout de la fonctionnalité de connexion

    - Création du formulaire de login
    - Ajout de la validation des champs
```

**Bonnes pratiques pour les messages de commit** :

| Faire | Ne pas faire |
| ----- | ------------ |
| "Ajout de la validation email" | "Modifications" |
| "Correction du bug #123" | "fix" |
| "Refactoring du module utilisateur" | "changements divers" |

**Analogie** : Un commit est comme une photo de ton projet à un instant T, avec une étiquette qui dit pourquoi tu as pris cette photo. Tu peux parcourir l'album photo pour voir l'évolution du projet.

---

### La staging area (zone de transit)

**Définition** : La staging area (ou index) est une zone intermédiaire où tu places les modifications que tu veux inclure dans le prochain commit.

**Les trois zones de Git** :

Le diagramme suivant montre comment les fichiers circulent entre les trois zones de Git.

<div class="diagram-design">
<p><a href="../../../diagrams/epitech-03-git-01-concepts-git-1.html">La staging area (zone de transit) (HTML + SVG)</a></p>
<iframe src="../../../diagrams/epitech-03-git-01-concepts-git-1.html" title="La staging area (zone de transit)" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Pourquoi une staging area ?**

Sans staging area :

- Tu commites tout ou rien
- Impossible de séparer les modifications en plusieurs commits

Avec staging area :

- Tu choisis précisément ce qui va dans chaque commit
- Tu peux faire plusieurs modifications et les commiter séparément

**Analogie** : Imagine que tu prépares un colis postal. Le working directory est ta table de travail avec plein d'objets. La staging area est le colis ouvert où tu places ce que tu veux envoyer. Le commit est le colis fermé et expédié. Tu peux mettre plusieurs objets dans le colis (git add), puis fermer et envoyer (git commit).

---

### L'historique

**Définition** : L'historique est la suite de tous les commits, formant une chaîne où chaque commit pointe vers son parent.

**Visualisation de l'historique** :

```text
Commit 1 ← Commit 2 ← Commit 3 ← Commit 4 (HEAD)
(initial)                           │
                                    └── Position actuelle
```

**HEAD** : C'est un pointeur vers le commit actuel sur lequel tu travailles.

---

### Les états d'un fichier

**Les quatre états possibles** :

| État | Description |
| ---- | ----------- |
| Untracked | Nouveau fichier, pas encore suivi par Git |
| Modified | Fichier modifié depuis le dernier commit |
| Staged | Modifications ajoutées à la staging area |
| Committed | Modifications enregistrées dans un commit |

**Cycle de vie** :

```text
Untracked ──git add──→ Staged ──git commit──→ Committed
    ↑                     ↑                       │
    │                     │                       │
    │                  Modification               │
    │                     │                       │
    └─────────────── Modified ←───────────────────┘
```

---

## Étapes Pratiques

### Étape 1 : Vérifier que Git est installé

```bash
git --version
```

**Résultat attendu** :

```text
git version 2.42.0
```

Si Git n'est pas installé, installe-le selon ton système :

- Linux : `sudo apt install git`
- macOS : `xcode-select --install`
- Windows : Télécharge depuis git-scm.com

---

### Étape 2 : Configurer Git

```bash
# Configuration obligatoire : ton identité
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.com"

# Vérifier la configuration
git config --list
```

---

### Étape 3 : Créer un premier repository

```bash
# Créer un dossier de projet
mkdir ~/mon-premier-repo
cd ~/mon-premier-repo

# Initialiser Git
git init
# Nommer la branche principale main (homogène avec les exemples du cursus)
git branch -M main

# Vérifier
ls -la
```

**Résultat attendu** :

```text
drwxr-xr-x  7 alex alex 4096 jan 15 10:30 .git
```

Le dossier `.git` a été créé.

---

### Étape 4 : Vérifier le statut

```bash
git status
```

**Résultat attendu** :

```text
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

> **Note** : selon ta version de Git et ta configuration (`init.defaultBranch`), la branche initiale peut s'appeler `main` (défaut courant) ou `master` (ancien défaut). Les deux jouent le même rôle de branche principale. Dans ce cursus, les exemples utilisent `main` ; si ton dépôt affiche `master`, remplace simplement le nom dans les commandes.

---

### Étape 5 : Créer des fichiers et voir leur état

```bash
# Créer des fichiers
echo "# Mon Projet" > readme.md
echo "print('Hello')" > main.py

# Vérifier le statut
git status
```

**Résultat attendu** :

```text
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        main.py
        readme.md

nothing added to commit but untracked files present (use "git add" to track)
```

Les fichiers sont "Untracked" (non suivis).

---

### Étape 6 : Ajouter à la staging area

```bash
# Ajouter un fichier
git add readme.md

# Vérifier
git status
```

**Résultat attendu** :

```text
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   readme.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        main.py
```

`readme.md` est maintenant "staged" (prêt à être commité).

---

### Étape 7 : Créer le premier commit

```bash
# Ajouter tous les fichiers
git add main.py

# Créer le commit
git commit -m "Initial commit : ajout de readme et main.py"

# Vérifier
git status
```

**Résultat attendu** :

```text
[main (root-commit) a1b2c3d] Initial commit : ajout de readme et main.py
 2 files changed, 2 insertions(+)
 create mode 100644 main.py
 create mode 100644 readme.md
```

---

### Étape 8 : Voir l'historique

```bash
git log
```

**Résultat attendu** :

```text
commit a1b2c3d4e5f6g7h8i9j0... (HEAD -> main)
Author: Ton Nom <ton@email.com>
Date:   Mon Jan 15 10:30:00 2024

    Initial commit : ajout de readme et main.py
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `git init` | Initialise un repository |
| `git status` | Affiche l'état des fichiers |
| `git add fichier` | Ajoute à la staging area |
| `git add .` | Ajoute tous les fichiers modifiés |
| `git commit -m "message"` | Crée un commit |
| `git log` | Affiche l'historique |
| `git log --oneline` | Historique condensé |

---

## Pièges Fréquents

### Piège 1 : Oublier de configurer Git

⚠️ **Problème** : Erreur "Please tell me who you are".

✅ **Solution** : Configurer user.name et user.email.

```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.com"
```

---

### Piège 2 : Oublier git add avant commit

⚠️ **Problème** : "nothing to commit, working tree clean" alors que tu as modifié des fichiers.

✅ **Solution** : Toujours faire `git add` avant `git commit`.

```bash
git add fichier.txt
git commit -m "Message"
```

---

### Piège 3 : Message de commit vide

⚠️ **Problème** : Git ouvre un éditeur que tu ne sais pas utiliser.

✅ **Solution** : Toujours utiliser `-m "message"`.

```bash
# Éviter (ouvre vim ou nano)
git commit

# Préférer
git commit -m "Mon message"
```

---

## Checklist de Validation

- [ ] J'ai compris ce qu'est un repository
- [ ] J'ai compris ce qu'est un commit
- [ ] J'ai compris le rôle de la staging area
- [ ] J'ai configuré Git avec mon nom et email
- [ ] J'ai créé un repository avec `git init`
- [ ] J'ai ajouté des fichiers avec `git add`
- [ ] J'ai créé un commit avec `git commit -m`
- [ ] J'ai consulté l'historique avec `git log`

---

## Exercice Pratique

**Énoncé** : Crée un repository avec plusieurs commits.

**Indications** :

1. Crée un nouveau dossier `projet-exercice`
2. Initialise Git
3. Crée un fichier `index.html` avec du contenu basique
4. Commit avec le message "Création de la page d'accueil"
5. Crée un fichier `style.css`
6. Commit avec le message "Ajout des styles"
7. Modifie `index.html` pour ajouter un titre
8. Commit avec le message "Ajout du titre principal"
9. Affiche l'historique

**Résultat attendu** (3 commits dans l'historique) :

```text
a1b2c3d Ajout du titre principal
e4f5g6h Ajout des styles
i7j8k9l Création de la page d'accueil
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Créer le dossier
mkdir projet-exercice
cd projet-exercice

# 2. Initialiser Git
git init

# 3. Créer index.html
echo "<html><body>Hello</body></html>" > index.html

# 4. Premier commit
git add index.html
git commit -m "Création de la page d'accueil"

# 5. Créer style.css
echo "body { font-family: Arial; }" > style.css

# 6. Deuxième commit
git add style.css
git commit -m "Ajout des styles"

# 7. Modifier index.html
echo "<html><body><h1>Mon Site</h1></body></html>" > index.html

# 8. Troisième commit
git add index.html
git commit -m "Ajout du titre principal"

# 9. Afficher l'historique
git log --oneline
```

---

## Navigation

→ Fiche suivante : **[Workflow Git basique](02-workflow-basique.md)**
