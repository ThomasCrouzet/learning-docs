---
tags:
  - Docker
  - Débutant
  - Projet
description: "Lancer le projet et initialiser Git"
estimated_time: "105 min"
fiche_number: 2
total_fiches: 2
cursus: "Docker"
id: "web.docker.lancement-projet-git"
course_id: "web.docker"
content_type: "lesson"
order: 2
---

# 02 - Lancer le projet et initialiser Git

> **En bref** : À la fin de cette fiche, tu sauras lancer ton projet Symfony avec Docker, initialiser un dépôt Git avec les bonnes pratiques, et connecter ton projet à GitHub pour sauvegarder ton code en ligne. Lecture estimée : 105 min.


## Prérequis

- Avoir complété la fiche **[01 - Créer un environnement Docker Compose pour Symfony](01-docker-compose-symfony.md)**
- Avoir Docker Desktop installé et fonctionnel
- Avoir les fichiers `docker-compose.yml`, `Dockerfile` et `default.conf` créés
- Aucune connaissance préalable de Git n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lancer ton projet Symfony avec Docker, initialiser un dépôt Git avec les bonnes pratiques, et connecter ton projet à GitHub pour sauvegarder ton code en ligne.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que lancer un projet Docker ?

**Définition** : Lancer un projet Docker signifie démarrer les conteneurs pour que l'application fonctionne et soit accessible.

**Le problème que le lancement résout** :

Les fichiers de configuration (`docker-compose.yml`, `Dockerfile`) décrivent comment l'environnement doit être construit. Mais ces fichiers ne font rien par eux-mêmes. Il faut une commande pour :

1. **Construire les images** : Transformer les instructions du Dockerfile en images utilisables.

2. **Créer les conteneurs** : Instancier des conteneurs à partir des images.

3. **Démarrer les conteneurs** : Lancer les programmes à l'intérieur des conteneurs.

**Comment le lancement résout ces problèmes** :

| Problème                  | Solution                                              |
| ------------------------- | ----------------------------------------------------- |
| Images non construites    | `docker compose up --build` construit les images      |
| Conteneurs non créés      | `docker compose up` crée les conteneurs               |
| Conteneurs non démarrés   | `docker compose up -d` démarre en arrière-plan        |

**Analogie concrète** : Pense à une voiture garée. "Créer" le conteneur, c'est comme avoir la voiture garée dans le garage. "Démarrer" le conteneur, c'est mettre le contact et faire tourner le moteur. La voiture existe dans les deux cas, mais elle ne fonctionne que quand le moteur tourne.

**Ce que lancer un projet n'est PAS** :

- Lancer un projet ne modifie pas ton code. Le code reste tel quel, mais il devient accessible via le navigateur.
- Lancer un projet n'est pas permanent. Si tu éteins ton ordinateur, les conteneurs s'arrêtent. Tu devras les relancer.

**Cycle de vie d'un conteneur** :

Le diagramme suivant représente les différents états d'un conteneur Docker et les commandes qui permettent de passer de l'un à l'autre :

<div class="diagram-design">
<p><a href="../../diagrams/01-docker-02-lancement-projet-git-1.html">Qu&#x27;est-ce que lancer un projet Docker ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/01-docker-02-lancement-projet-git-1.html" title="Qu&#x27;est-ce que lancer un projet Docker ?" style="width:100%;min-height:676px;border:0;background:transparent"></iframe>
</div>

En résumé sous forme textuelle :

```text
[Non existant] → docker compose up → [En cours d'exécution]
                                            ↓
                                     docker compose stop
                                            ↓
                                      [Arrêté]
                                            ↓
                                     docker compose start
                                            ↓
                                     [En cours d'exécution]
                                            ↓
                                     docker compose down
                                            ↓
                                     [Supprimé]
```

---

### Qu'est-ce que Git ?

**Définition** : Git est un système de contrôle de version. Il enregistre l'historique de toutes les modifications apportées aux fichiers d'un projet.

**Le problème que Git résout** :

Sans Git, voici les problèmes rencontrés :

1. **Perte de travail** : Tu modifies un fichier, tu fais une erreur, et tu ne peux pas revenir en arrière.

2. **Pas d'historique** : Tu ne sais plus quand ni pourquoi une modification a été faite.

3. **Fichiers en double** : Tu crées des copies comme `projet_v1`, `projet_v2`, `projet_final`, `projet_final_vraiment_final`.

4. **Collaboration difficile** : Deux personnes modifient le même fichier et leurs changements s'écrasent.

**Comment Git résout ces problèmes** :

| Problème               | Solution apportée par Git                              |
| ---------------------- | ------------------------------------------------------ |
| Perte de travail       | Tu peux revenir à n'importe quelle version précédente  |
| Pas d'historique       | Chaque modification est enregistrée avec date et motif |
| Fichiers en double     | Une seule version du projet avec tout l'historique     |
| Collaboration difficile| Git fusionne intelligemment les modifications          |

**Analogie concrète** : Git fonctionne comme un carnet de notes avec des pages numérotées. Chaque fois que tu fais une modification importante, tu écris une nouvelle page avec la date et ce que tu as changé. Tu peux toujours revenir aux pages précédentes pour voir ce que tu avais écrit avant.

**Ce que Git n'est PAS** :

- Git n'est pas GitHub. Git est le logiciel qui tourne sur ton ordinateur. GitHub est un site web qui héberge des dépôts Git en ligne.
- Git n'est pas une sauvegarde automatique. Tu dois explicitement dire à Git d'enregistrer tes modifications (avec un "commit").
- Git n'est pas un outil de synchronisation comme Dropbox. Il ne synchronise pas automatiquement.

---

### Qu'est-ce qu'un dépôt Git (repository) ?

**Définition** : Un dépôt Git (ou "repository", souvent abrégé "repo") est un dossier dont l'historique des modifications est suivi par Git.

**Le problème que le dépôt résout** :

Sans dépôt, voici les problèmes rencontrés :

1. **Pas de délimitation** : Git ne suit pas automatiquement tous les dossiers de ton ordinateur. Il faut lui dire lequel surveiller.

2. **Pas de stockage d'historique** : Sans dépôt, Git ne sait pas où stocker les informations de versionnement.

3. **Confusion entre projets** : Sans délimitation claire, les fichiers de différents projets pourraient se mélanger.

**Comment le dépôt résout ces problèmes** :

| Problème               | Solution Dépôt                                        |
| ---------------------- | ----------------------------------------------------- |
| Pas de délimitation    | Le dépôt définit la zone surveillée par Git           |
| Pas de stockage        | Le dossier `.git` stocke tout l'historique            |
| Confusion entre projets| Chaque projet a son propre dépôt indépendant          |

**Comment reconnaître un dépôt Git** :

Un dossier est un dépôt Git s'il contient un sous-dossier caché nommé `.git`. Ce dossier contient toute la base de données de l'historique.

```text
mon-projet/
├── .git/           ← Ce dossier fait de "mon-projet" un dépôt Git
├── docker-compose.yml
├── app/
└── docker/
```

**Analogie concrète** : Le dépôt Git est comme une zone sous vidéosurveillance. Tout ce qui se passe dans cette zone est enregistré. Le dossier `.git` est la salle où sont stockées toutes les bandes de surveillance.

**Ce qu'un dépôt n'est PAS** :

- Le dépôt n'est pas le dossier `.git` lui-même. Le dépôt est tout le dossier projet. Le dossier `.git` est juste la base de données interne.
- Le dépôt n'est pas sur internet par défaut. Un dépôt est local à ton ordinateur jusqu'à ce que tu le "push" vers un serveur.

---

### Qu'est-ce qu'un commit ?

**Définition** : Un commit est un point de sauvegarde dans l'historique Git. Il enregistre l'état de tous les fichiers à un moment précis.

**Le problème que les commits résolvent** :

Sans commits, voici les problèmes rencontrés :

1. **État unique** : Tu aurais seulement l'état actuel du projet, sans historique.

2. **Pas de retour arrière** : Impossible de revenir à une version qui fonctionnait.

3. **Pas de traçabilité** : Tu ne saurais pas pourquoi une modification a été faite.

**Comment les commits résolvent ces problèmes** :

| Problème           | Solution Commit                                          |
| ------------------ | -------------------------------------------------------- |
| État unique        | Chaque commit capture un état complet du projet          |
| Pas de retour      | Tu peux revenir à n'importe quel commit précédent        |
| Pas de traçabilité | Chaque commit a un message expliquant la modification    |

**Structure d'un commit** :

Chaque commit contient :

| Élément        | Description                                          |
| -------------- | ---------------------------------------------------- |
| Identifiant    | Un code unique (ex: `a1b2c3d`)                       |
| Auteur         | Qui a fait le commit                                 |
| Date           | Quand le commit a été créé                           |
| Message        | Une description de ce qui a été modifié              |
| Contenu        | L'état des fichiers au moment du commit              |

**Analogie concrète** : Un commit est comme une photo de groupe lors d'un événement. La photo capture qui était présent et comment ils étaient habillés à ce moment précis. Tu peux prendre plusieurs photos au cours de l'événement pour voir l'évolution.

**Ce qu'un commit n'est PAS** :

- Un commit n'est pas une sauvegarde automatique. Tu dois le créer explicitement avec `git commit`.
- Un commit n'est pas modifiable une fois créé. Si tu fais une erreur, tu crées un nouveau commit pour la corriger.
- Un commit n'est pas envoyé sur internet automatiquement. Il reste local jusqu'à ce que tu fasses `git push`.

**Bonnes pratiques pour les messages de commit** :

| Règle                               | Exemple bon                 | Exemple mauvais              |
| ----------------------------------- | --------------------------- | ---------------------------- |
| Décrire ce qui a été fait           | "Add user authentication"   | "Update"                     |
| Être concis (50 caractères max)     | "Fix login button color"    | "Changed the color..."       |
| Utiliser l'impératif                | "Add feature"               | "Added feature"              |
| Un commit = une modification logique| Un commit par fonctionnalité| 50 changements dans un commit|

---

### Qu'est-ce que le fichier .gitignore ?

**Définition** : Le fichier `.gitignore` est une liste de fichiers et dossiers que Git doit ignorer. Ces fichiers ne seront jamais inclus dans l'historique.

**Le problème que .gitignore résout** :

Certains fichiers ne doivent pas être versionnés :

1. **Dépendances téléchargées** (`vendor/`) : Ces fichiers peuvent être régénérés avec `composer install`.

2. **Fichiers de cache** (`var/cache/`) : Ces fichiers sont temporaires et spécifiques à ta machine.

3. **Fichiers sensibles** (`.env.local`) : Ces fichiers contiennent des mots de passe et secrets.

4. **Fichiers générés** (`public/build/`) : Ces fichiers sont recréés automatiquement.

**Pourquoi ne pas versionner ces fichiers** :

| Type de fichier      | Problème si versionné                                |
| -------------------- | ---------------------------------------------------- |
| vendor/              | Alourdit le dépôt (des milliers de fichiers)         |
| var/cache/           | Crée des conflits inutiles entre développeurs        |
| .env.local           | Expose des mots de passe publiquement                |
| node_modules/        | Encore plus lourd que vendor/                        |

**Syntaxe du fichier .gitignore** :

```text
# Ceci est un commentaire

# Ignorer un fichier spécifique
.env.local

# Ignorer un dossier entier (le / à la fin est important)
vendor/
var/
node_modules/

# Ignorer tous les fichiers avec une extension
*.log

# Ignorer un dossier mais pas un fichier du même nom
/build/
```

**Ce que .gitignore n'est PAS** :

- .gitignore ne supprime pas les fichiers déjà suivis. Si tu as déjà commité `vendor/`, ajouter `vendor/` au .gitignore ne le supprimera pas de l'historique.
- .gitignore n'est pas secret. Le fichier lui-même est versionné et visible par tous.

---

### Qu'est-ce qu'un dépôt distant (remote) ?

**Définition** : Un dépôt distant est une copie de ton dépôt Git hébergée sur un serveur accessible via Internet. GitHub est le service le plus utilisé pour héberger des dépôts distants.

**Le problème que les dépôts distants résolvent** :

Avec seulement un dépôt local :

1. **Pas de sauvegarde** : Si ton disque dur lâche, tu perds tout.

2. **Pas de partage** : Impossible de collaborer avec d'autres développeurs.

3. **Pas d'accès à distance** : Tu ne peux travailler que sur un seul ordinateur.

**Comment les dépôts distants résolvent ces problèmes** :

| Problème           | Solution Dépôt Distant                              |
| ------------------ | --------------------------------------------------- |
| Pas de sauvegarde  | Le code est copié sur les serveurs GitHub           |
| Pas de partage     | D'autres développeurs peuvent cloner le dépôt       |
| Pas d'accès distant| Tu peux cloner le dépôt sur n'importe quel ordi     |

**Comment ça fonctionne** :

```text
Ton ordinateur                          GitHub (serveur)
┌─────────────────┐                    ┌─────────────────┐
│  Dépôt local    │  ←── git pull ───  │  Dépôt distant  │
│                 │  ─── git push ──→  │                 │
└─────────────────┘                    └─────────────────┘
```

**Analogie concrète** : Le dépôt distant est comme un coffre-fort à la banque. Tu gardes tes documents importants chez toi (dépôt local), mais tu en mets une copie au coffre (dépôt distant). Si ta maison brûle, tes documents sont en sécurité à la banque.

**Ce que GitHub n'est PAS** :

- GitHub n'est pas Git. Git est le logiciel de versionnement. GitHub est un service d'hébergement.
- GitHub n'est pas le seul service. Il existe aussi GitLab, Bitbucket, et d'autres.
- GitHub n'est pas obligatoire. Tu peux utiliser Git sans jamais utiliser GitHub.

**Comparaison des services d'hébergement** :

| Service   | Particularité                                    |
| --------- | ------------------------------------------------ |
| GitHub    | Le plus populaire, racheté par Microsoft         |
| GitLab    | Peut être auto-hébergé, CI/CD intégré            |
| Bitbucket | Intégré avec les outils Atlassian (Jira)         |

---

### Qu'est-ce que push et pull ?

**Définition push** : `git push` envoie les commits de ton dépôt local vers le dépôt distant.

**Définition pull** : `git pull` récupère les commits du dépôt distant vers ton dépôt local.

**Le problème que push et pull résolvent** :

Les dépôts local et distant sont indépendants :

1. **Pas de synchronisation automatique** : Quand tu crées un commit, il existe uniquement sur ton ordinateur.

2. **Pas de récupération automatique** : Si quelqu'un d'autre modifie le code sur GitHub, tu ne le vois pas.

**Comment push et pull résolvent ces problèmes** :

| Problème                  | Solution                                        |
| ------------------------- | ----------------------------------------------- |
| Commit local seulement    | `git push` envoie le commit sur GitHub          |
| Modifications distantes   | `git pull` récupère les modifications           |

**Analogie concrète** : Push et pull fonctionnent comme la synchronisation d'un téléphone avec le cloud. Quand tu prends une photo (commit), elle est sur ton téléphone. Tu dois la "pousser" vers le cloud (push). Quand quelqu'un d'autre met une photo dans le cloud partagé, tu dois la "tirer" vers ton téléphone (pull).

**Ce que push et pull ne sont PAS** :

- Push ne modifie pas ton code local. Il copie tes commits vers le serveur.
- Pull n'écrase pas ton travail. Git fusionne intelligemment les modifications.

**Quand utiliser push et pull** :

| Action | Quand l'utiliser                                              |
| ------ | ------------------------------------------------------------- |
| push   | Après avoir créé un ou plusieurs commits locaux               |
| pull   | Avant de commencer à travailler (pour avoir la dernière version) |

---

## Récapitulatif des concepts

| Concept        | À retenir                                                    |
| -------------- | ------------------------------------------------------------ |
| Lancer Docker  | `docker compose up -d` démarre les conteneurs                |
| Git            | Système qui enregistre l'historique des modifications        |
| Dépôt          | Dossier dont Git suit l'historique (contient `.git`)         |
| Commit         | Point de sauvegarde avec un message explicatif               |
| .gitignore     | Liste des fichiers que Git doit ignorer                      |
| Dépôt distant  | Copie du dépôt sur un serveur (GitHub)                       |
| Push           | Envoie les commits locaux vers le dépôt distant              |
| Pull           | Récupère les commits distants vers le dépôt local            |

---

## Étapes Pratiques

### Partie 1 : Lancer le projet Docker

#### Étape 1.1 : Vérifier que Docker Desktop est démarré

Avant toute chose, Docker Desktop doit être en cours d'exécution.

**Sur Mac** : Cherche l'icône Docker (une baleine) dans la barre de menu en haut à droite.

**Sur Windows** : Cherche l'icône Docker dans la zone de notification en bas à droite.

Si Docker n'est pas démarré, lance l'application Docker Desktop et attends qu'elle soit prête (l'icône arrête de s'animer).

---

#### Étape 1.2 : Ouvrir un terminal dans le dossier du projet

Ouvre un terminal et navigue vers ton dossier projet :

```bash
cd chemin/vers/mon-projet
```

Remplace `chemin/vers/mon-projet` par le chemin réel vers ton dossier.

**Vérification** : La commande `ls` doit afficher tes fichiers :

```bash
ls
```

**Résultat attendu** :

```text
app                 docker              docker-compose.yml
```

---

#### Étape 1.3 : Démarrer les conteneurs

Exécute la commande suivante :

```bash
docker compose up -d
```

**Explication** :

- `docker compose` : Utilise Docker Compose
- `up` : Démarre les services définis dans `docker-compose.yml`
- `-d` : Mode "detached" (les conteneurs tournent en arrière-plan)

**Résultat attendu** (première exécution) :

```text
[+] Running 3/3
 ✔ Container symfony_database  Started
 ✔ Container symfony_php       Started
 ✔ Container symfony_nginx     Started
```

---

#### Étape 1.4 : Vérifier que tout fonctionne

Exécute :

```bash
docker compose ps
```

**Résultat attendu** :

```text
NAME                STATUS              PORTS
symfony_database    Up                  0.0.0.0:5432->5432/tcp
symfony_nginx       Up                  0.0.0.0:8080->80/tcp
symfony_php         Up                  9000/tcp
```

Les trois conteneurs doivent avoir le statut "Up".

---

#### Étape 1.5 : Accéder au site

Ouvre ton navigateur et va à l'adresse :

```text
http://localhost:8080
```

**Résultat attendu** : Tu vois la page d'accueil de Symfony.

---

### Partie 2 : Initialiser Git

#### Étape 2.1 : Vérifier que Git est installé

Git doit être installé sur ton ordinateur (pas dans le conteneur Docker).

```bash
git --version
```

**Résultat attendu** :

```text
git version 2.39.0
```

Le numéro de version peut être différent. L'important est qu'une version s'affiche.

**Si Git n'est pas installé** :

- **Mac** : Installe les outils en ligne de commande Xcode avec `xcode-select --install`
- **Windows** : Télécharge Git depuis <https://git-scm.com/download/win>

---

#### Étape 2.2 : Configurer Git (si pas déjà fait)

Git a besoin de savoir qui tu es pour enregistrer l'auteur des commits.

```bash
# Configure ton nom (remplace par ton vrai nom)
git config --global user.name "Ton Nom"

# Configure ton email (utilise le même que ton compte GitHub)
git config --global user.email "ton.email@example.com"

# Définit 'main' comme nom de branche par défaut pour tes futurs dépôts
git config --global init.defaultBranch main
```

**Pourquoi cette dernière ligne** : sans elle, `git init` crée une branche nommée `master`. Avec elle, la branche initiale s'appellera `main`, ce qui correspond aux commandes de cette fiche.

**Vérification** :

```bash
git config --global --list
```

**Résultat attendu** :

```text
user.name=Ton Nom
user.email=ton.email@example.com
init.defaultbranch=main
```

Note : Git affiche la clé en minuscules (`init.defaultbranch`), c'est normal.

---

#### Étape 2.3 : Initialiser le dépôt Git

Place-toi dans le dossier du projet et initialise Git :

```bash
# Assure-toi d'être dans le bon dossier
cd chemin/vers/mon-projet

# Initialise le dépôt Git
git init
```

**Résultat attendu** :

```text
Initialized empty Git repository in /chemin/vers/mon-projet/.git/
```

Comme tu as configuré `init.defaultBranch` à l'étape précédente, la branche initiale s'appelle `main`.

**Si tu avais déjà fait `git init` avant de configurer `init.defaultBranch`** : ta branche s'appelle encore `master`. Renomme-la avec :

```bash
git branch -m master main
```

**Vérification** : Le dossier `.git` a été créé :

```bash
ls -la
```

Tu dois voir un dossier `.git` dans la liste.

---

#### Étape 2.4 : Créer le fichier .gitignore

Crée un fichier `.gitignore` à la racine du projet avec ce contenu :

```text
# Dépendances installées par Composer
/app/vendor/

# Cache et logs Symfony
/app/var/

# Fichiers de configuration locale (contiennent des secrets)
/app/.env.local
/app/.env.local.php
/app/.env.*.local

# PHPUnit
/app/.phpunit.result.cache

# Fichiers générés par les IDE
.idea/
.vscode/
*.swp
*.swo
*~

# Fichiers système
.DS_Store
Thumbs.db
```

**Important** : Ce fichier doit être créé AVANT le premier commit.

---

#### Étape 2.5 : Vérifier l'état du dépôt

```bash
git status
```

**Résultat attendu** :

```text
On branch main

No commits yet

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .gitignore
        app/
        docker-compose.yml
        docker/

nothing added to commit but untracked files present (use "git add" to track)
```

Git voit les fichiers mais ne les suit pas encore. Le dossier `vendor/` n'apparaît pas car il est ignoré.

---

#### Étape 2.6 : Ajouter les fichiers au suivi

```bash
git add .
```

Le `.` signifie "tous les fichiers du dossier courant".

**Vérification** :

```bash
git status
```

**Résultat attendu** :

```text
On branch main

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   .gitignore
        new file:   app/.env
        new file:   app/bin/console
        ...
```

Les fichiers sont maintenant "staged" (prêts à être commités).

---

#### Étape 2.7 : Créer le premier commit

```bash
git commit -m "Initial commit: Symfony project with Docker setup"
```

**Résultat attendu** :

```text
[main (root-commit) a1b2c3d] Initial commit: Symfony project with Docker setup
 45 files changed, 1234 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 app/.env
 ...
```

---

#### Étape 2.8 : Vérifier l'historique

```bash
git log --oneline
```

**Résultat attendu** :

```text
a1b2c3d (HEAD -> main) Initial commit: Symfony project with Docker setup
```

Tu as maintenant un dépôt Git initialisé avec un premier commit.

---

### Partie 3 : Connecter à GitHub

#### Étape 3.1 : Créer un compte GitHub (si pas déjà fait)

1. Va sur <https://github.com>
2. Clique sur "Sign up"
3. Entre ton adresse email
4. Crée un mot de passe
5. Choisis un nom d'utilisateur (il sera visible publiquement)
6. Réponds au captcha
7. Vérifie ton email en cliquant sur le lien reçu

---

#### Étape 3.2 : Créer un nouveau repository sur GitHub

1. Connecte-toi à GitHub

2. Clique sur le bouton "+" en haut à droite, puis "New repository"

3. Remplis les informations :
   - **Repository name** : `mon-projet-symfony` (ou le nom de ton choix)
   - **Description** : (optionnel) "Projet Symfony avec Docker"
   - **Public/Private** : Choisis selon ta préférence
   - **Ne coche PAS** "Add a README file"
   - **Ne coche PAS** "Add .gitignore"
   - **Ne coche PAS** "Choose a license"

4. Clique sur "Create repository"

**Important** : Ne pas cocher ces options car tu as déjà ces fichiers localement.

---

#### Étape 3.3 : Créer un Personal Access Token

GitHub n'accepte plus les mots de passe pour les opérations Git. Tu dois créer un "token" (jeton d'accès).

1. Va sur GitHub → clique sur ta photo de profil → **Settings**

2. Dans le menu de gauche, descends jusqu'à **Developer settings** (tout en bas)

3. Clique sur **Personal access tokens** → **Tokens (classic)**

4. Clique sur **Generate new token** → **Generate new token (classic)**

5. Remplis les informations :
   - **Note** : "Mon ordinateur" (pour te souvenir à quoi sert ce token)
   - **Expiration** : 90 days (tu devras en créer un nouveau après)
   - **Select scopes** : Coche **repo** (cela coche automatiquement les sous-options)

6. Clique sur **Generate token**

7. **IMPORTANT** : Copie le token affiché (il commence par `ghp_`). Tu ne pourras plus le voir après.

8. Garde ce token dans un endroit sûr (gestionnaire de mots de passe par exemple)

---

#### Étape 3.4 : Copier l'URL du repository

Sur la page de ton nouveau repository GitHub, copie l'URL HTTPS qui ressemble à :

```text
https://github.com/ton-username/mon-projet-symfony.git
```

---

#### Étape 3.5 : Ajouter le remote

De retour dans ton terminal :

```bash
git remote add origin https://github.com/ton-username/mon-projet-symfony.git
```

**Explication** :

- `git remote add` : Ajoute un dépôt distant
- `origin` : Nom conventionnel pour le dépôt distant principal
- L'URL : L'adresse de ton dépôt GitHub

**Vérification** :

```bash
git remote -v
```

**Résultat attendu** :

```text
origin  https://github.com/ton-username/mon-projet-symfony.git (fetch)
origin  https://github.com/ton-username/mon-projet-symfony.git (push)
```

---

#### Étape 3.6 : Pousser le code vers GitHub

```bash
git push -u origin main
```

**Explication** :

- `git push` : Envoie les commits vers le distant
- `-u` : Associe la branche locale à la branche distante (à faire une seule fois)
- `origin` : Le nom du remote
- `main` : Le nom de la branche

**Authentification** : Git te demandera tes identifiants :

- **Username** : Ton nom d'utilisateur GitHub
- **Password** : Colle ton Personal Access Token (pas ton mot de passe GitHub !)

**Résultat attendu** :

```text
Enumerating objects: 50, done.
Counting objects: 100% (50/50), done.
Delta compression using up to 8 threads
Compressing objects: 100% (40/40), done.
Writing objects: 100% (50/50), 15.00 KiB | 5.00 MiB/s, done.
Total 50 (delta 5), reused 0 (delta 0)
To https://github.com/ton-username/mon-projet-symfony.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

#### Étape 3.7 : Vérifier sur GitHub

Rafraîchis la page de ton repository sur GitHub. Tu dois voir tous tes fichiers.

---

## Commandes Utiles

### Commandes Docker Compose

| Commande                  | Action                                      |
| ------------------------- | ------------------------------------------- |
| `docker compose up -d`    | Démarre les conteneurs en arrière-plan      |
| `docker compose down`     | Arrête et supprime les conteneurs           |
| `docker compose ps`       | Liste les conteneurs en cours               |
| `docker compose logs`     | Affiche les logs de tous les conteneurs     |
| `docker compose logs php` | Affiche les logs du conteneur PHP           |

### Commandes Git

| Commande                        | Action                                         |
| ------------------------------- | ---------------------------------------------- |
| `git init`                      | Initialise un nouveau dépôt                    |
| `git status`                    | Affiche l'état des fichiers                    |
| `git add .`                     | Ajoute tous les fichiers modifiés              |
| `git add fichier.txt`           | Ajoute un fichier spécifique                   |
| `git commit -m "message"`       | Crée un commit avec un message                 |
| `git log`                       | Affiche l'historique complet                   |
| `git log --oneline`             | Affiche l'historique compact                   |
| `git diff`                      | Affiche les modifications non commitées        |
| `git remote add origin URL`     | Ajoute un dépôt distant                        |
| `git push -u origin main`       | Envoie vers GitHub (première fois)             |
| `git push`                      | Envoie vers GitHub (fois suivantes)            |
| `git pull`                      | Récupère les modifications depuis GitHub       |

---

## Pièges Fréquents

### Piège 1 : Git n'est pas installé

⚠️ **Problème** : La commande `git --version` affiche "command not found".

✅ **Solution** : Git doit être installé sur ton ordinateur, pas dans le conteneur Docker.

- **Mac** : `xcode-select --install`
- **Windows** : Télécharge depuis <https://git-scm.com/download/win>

---

### Piège 2 : Oublier le .gitignore avant le premier commit

⚠️ **Problème** : Tu as commité le dossier `vendor/` par erreur.

✅ **Solution** : Il faut supprimer les fichiers de l'historique Git :

```bash
# Supprime vendor/ de l'index Git (mais pas du disque)
git rm -r --cached app/vendor/

# Crée un commit pour enregistrer cette suppression
git commit -m "Remove vendor/ from Git tracking"
```

---

### Piège 3 : Branche main vs master

⚠️ **Problème** : Git dit que la branche `main` n'existe pas.

**Explication** : Par défaut, `git init` crée une branche nommée `master`. Le passage à `main` comme nom par défaut est prévu pour Git 3.0, mais ce n'est pas encore le cas en ligne de commande. Pour utiliser `main` dès maintenant, définis-le une fois sur ta machine avant `git init` : `git config --global init.defaultBranch main` (déjà fait à l'Étape 2.2). Si ton dépôt existe déjà en `master`, renomme la branche avec `git branch -m master main`.

✅ **Solution** : Vérifie le nom de ta branche :

```bash
git branch
```

Si c'est `master`, utilise `master` au lieu de `main` dans les commandes, ou renomme :

```bash
git branch -m master main
```

---

### Piège 4 : GitHub demande un mot de passe et échoue

⚠️ **Problème** : `git push` demande un mot de passe et échoue avec "Authentication failed".

**Explication** : GitHub n'accepte plus les mots de passe. Il faut utiliser un Personal Access Token.

✅ **Solution** :

1. Crée un token (voir Étape 3.3)
2. Utilise le token comme mot de passe lors du push

---

### Piège 5 : Le token n'est pas accepté

⚠️ **Problème** : Même avec le token, l'authentification échoue.

✅ **Solutions possibles** :

1. Vérifie que tu as coché "repo" lors de la création du token
2. Vérifie que le token n'a pas expiré
3. Vérifie que tu n'as pas de caractères en trop (espaces, retours à la ligne)

---

## Pour aller plus loin

Ces concepts ne sont pas nécessaires pour ce projet, mais tu peux les explorer si tu veux approfondir :

- **Branches Git** : Permet de travailler sur plusieurs fonctionnalités en parallèle sans mélanger le code. Chaque branche est une ligne de développement indépendante.

- **Merge et conflits** : Comment fusionner du code provenant de différentes branches et résoudre les situations où deux personnes ont modifié le même fichier.

- **Pull Requests** : Mécanisme de GitHub pour proposer des modifications et les faire valider par d'autres développeurs avant de les intégrer.

- **GitHub Actions** : Automatisation des tests et du déploiement à chaque push. Permet de vérifier que ton code fonctionne avant de l'intégrer.

- **Git stash** : Mettre de côté temporairement des modifications non commitées pour y revenir plus tard. Utile quand tu dois changer de branche rapidement.

- **Git rebase** : Alternative au merge qui permet un historique plus linéaire et plus lisible. Technique avancée mais puissante.

---

## Checklist de Validation

- [ ] Docker Desktop est démarré
- [ ] Les 3 conteneurs sont "Up" (`docker compose ps`)
- [ ] Le site est accessible sur `http://localhost:8080`
- [ ] Git est initialisé (le dossier `.git` existe)
- [ ] Le fichier `.gitignore` existe et contient `vendor/`
- [ ] Au moins un commit existe (`git log` fonctionne)
- [ ] Le dépôt GitHub est créé
- [ ] Le remote est configuré (`git remote -v` montre l'URL)
- [ ] Le code est visible sur GitHub

---

## Exercice Pratique

**Énoncé** : Modifie le fichier `app/templates/base.html.twig` pour changer le titre de la page, puis crée un nouveau commit et pousse-le sur GitHub.

**Indications** :

- Le fichier se trouve dans `app/templates/base.html.twig`
- Modifie la balise `<title>` pour mettre le nom de ton choix
- Utilise les commandes `git add`, `git commit`, et `git push`

**Résultat attendu** : Sur GitHub, tu vois un deuxième commit avec ta modification.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Modifier le fichier**

Ouvre `app/templates/base.html.twig` et modifie :

```html
<title>{% block title %}Mon Projet{% endblock %}</title>
```

**Étape 2 : Vérifier les modifications**

```bash
git status
```

Tu dois voir `app/templates/base.html.twig` en rouge (modifié).

**Étape 3 : Ajouter et commiter**

```bash
git add app/templates/base.html.twig
git commit -m "Update page title in base template"
```

**Étape 4 : Pousser vers GitHub**

```bash
git push
```

**Étape 5 : Vérifier sur GitHub**

Rafraîchis la page de ton repository. Tu dois voir le nouveau commit.

---

## Navigation

← Fiche précédente : **[Créer un environnement Docker Compose pour Symfony](01-docker-compose-symfony.md)**
