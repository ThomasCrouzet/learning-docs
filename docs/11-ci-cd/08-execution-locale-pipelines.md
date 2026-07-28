---
tags:
  - CI/CD
  - Intermédiaire
  - Pratique
description: "Exécuter les pipelines CI/CD en local avec act (GitHub Actions) et gitlab-ci-local (GitLab CI)"
estimated_time: "75 min"
fiche_number: 8
total_fiches: 10
cursus: "CI/CD Pipelines"
---

# 08 - Exécution locale des pipelines

> **En bref** : Cette fiche t'apprend à exécuter les pipelines CI/CD localement avec `act` (GitHub Actions) et `gitlab-ci-local` (GitLab CI, alternatif communautaire depuis la suppression de `gitlab-runner exec` dans Runner 16+), à comprendre les avantages et limitations du test local. Lecture estimée : 75 min.

## Prérequis

- Avoir lu les fiches sur GitHub Actions ([02](02-github-actions-premiers-pas.md) à [05](05-github-actions-avance.md)) et GitLab CI ([06](06-gitlab-ci-introduction.md) à [07](07-gitlab-ci-pipeline-complet.md))
- Avoir Docker installé et fonctionnel sur ton ordinateur
- Savoir utiliser le terminal (ligne de commande)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras exécuter des workflows GitHub Actions localement avec `act`, comprendre pourquoi `gitlab-runner exec` a été supprimé dans Runner 16+ et quelles alternatives utiliser (`gitlab-ci-local`, runner local), comprendre les avantages et les limitations de l'exécution locale, et diagnostiquer les problèmes Docker-in-Docker.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Pourquoi exécuter les pipelines localement ?

**Définition** : L'exécution locale consiste à lancer les pipelines CI/CD sur ton propre ordinateur, sans pousser le code vers GitHub ou GitLab. Les outils `act` et `gitlab-runner exec` simulent l'environnement CI en utilisant Docker.

**Le problème que l'exécution locale résout** :

Sans exécution locale, voici les problèmes rencontrés :

1. **Cycle lent** : Tu modifies le workflow, pousses le code, attends que le pipeline s'exécute (2-5 minutes), lis les logs, corriges, re-pousses. Chaque itération prend plusieurs minutes.

2. **Historique pollué** : Chaque tentative crée un commit ("fix ci", "fix ci again", "fix ci for real"). L'historique Git devient illisible.

3. **Minutes consommées** : Sur GitHub et GitLab, les minutes de CI sont limitées (surtout sur les plans gratuits). Chaque exécution consomme des minutes.

**Comment l'exécution locale résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Cycle lent | L'exécution locale prend quelques secondes, pas besoin de push |
| Historique pollué | Pas de commit nécessaire pour tester le workflow |
| Minutes consommées | L'exécution est gratuite, sur ta machine |

**Analogie concrète** : Imagine un pilote d'avion qui s'entraîne. Sans simulateur, il doit prendre un vrai avion à chaque fois qu'il veut tester une manoeuvre. Avec un simulateur (exécution locale), il teste dans un environnement sûr, rapide et gratuit.

**Ce que l'exécution locale n'est PAS** :

- L'exécution locale n'est pas identique à l'exécution en CI. Certaines fonctionnalités (secrets, permissions, marketplace complet) ne sont pas disponibles localement.
- L'exécution locale ne remplace pas les tests en CI. Elle sert à déboguer et à itérer rapidement. Le pipeline final doit toujours être validé en CI.

---

### Qu'est-ce que act ?

**Définition** : `act` est un outil open source qui exécute les workflows GitHub Actions localement en utilisant Docker. Il lit les fichiers `.github/workflows/*.yml` et simule l'environnement d'un runner GitHub.

**Le problème que act résout** :

Sans `act`, la seule façon de tester un workflow GitHub Actions est de le pousser sur GitHub et d'attendre le résultat. Avec `act`, tu testes en quelques secondes sans push.

**Ce que act n'est PAS** :

- `act` ne reproduit pas parfaitement l'environnement GitHub. Certaines actions du marketplace ne fonctionnent pas localement. Les secrets GitHub ne sont pas disponibles (sauf si tu les fournis dans un fichier `.env`).
- `act` ne supporte pas toutes les fonctionnalités de GitHub Actions. Les fonctionnalités comme `environment`, les approbations, et certains contextes `github.*` ne sont pas simulés.

---

### Qu'est-ce que gitlab-runner exec ?

**Définition** : `gitlab-runner exec` était une commande du GitLab Runner qui permettait d'exécuter un job défini dans `.gitlab-ci.yml` localement en utilisant Docker.

> ⚠️ **Commande supprimée dans GitLab Runner 16+** : `gitlab-runner exec` a été dépréciée dès la version 10.0 du Runner et définitivement supprimée dans **GitLab Runner 16** (mai 2023, voir [issue #37492](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/37492)). Si tu utilises GitLab Runner 16 ou supérieur (ce qui est le cas par défaut en 2026), la commande n'existe plus. Il n'existe pas d'équivalent officiel. Pour tester un pipeline GitLab CI localement, deux alternatives existent :
>
> - **Runner local connecté** : installer un GitLab Runner sur ta machine et le connecter à ton instance GitLab pour exécuter les pipelines en conditions réelles.
> - **`gitlab-ci-local`** (outil communautaire tiers) : simule l'exécution d'un pipeline GitLab CI localement. Installe via `npm install -g gitlab-ci-local` ou `brew install gitlab-ci-local`. Voir [github.com/firecow/gitlab-ci-local](https://github.com/firecow/gitlab-ci-local).
>
> Les étapes 9 et 10 ci-dessous documentent `gitlab-runner exec` pour référence historique uniquement. Ne l'utilise pas si ton Runner est en version 16+.

**Limitations importantes de gitlab-runner exec** (version historique, Runner < 16) :

| Limitation | Explication |
| --- | --- |
| Un seul job à la fois | Tu ne peux pas exécuter un pipeline entier, seulement un job |
| Pas de services | Les services (PostgreSQL, Redis) ne sont pas lancés automatiquement |
| Pas de cache | Le cache GitLab n'est pas simulé |
| Pas d'artefacts entre jobs | Les artefacts du job précédent ne sont pas disponibles |
| Commande supprimée (Runner ≥16) | Absente des versions récentes du Runner |

---

### Qu'est-ce que Docker-in-Docker (DinD) ?

**Définition** : Docker-in-Docker est une technique qui permet d'exécuter Docker à l'intérieur d'un conteneur Docker. C'est nécessaire quand un job CI doit builder des images Docker, car le job lui-même s'exécute dans un conteneur.

**Le problème que DinD résout** :

Sans DinD, un job qui s'exécute dans un conteneur Docker ne peut pas utiliser la commande `docker build`. Le démon Docker du conteneur est isolé du démon Docker de la machine hôte.

**Deux approches pour DinD** :

| Approche | Fonctionnement | Avantage | Inconvénient |
| --- | --- | --- | --- |
| DinD vrai | Un démon Docker complet dans le conteneur | Isolation totale | Lent, consomme plus de ressources |
| Docker socket bind | Le conteneur partage le démon Docker de l'hôte | Rapide, pas de surcoût | Moins isolé, risques de sécurité |

**Analogie concrète** : Imagine une usine (l'hôte) avec des ateliers (les conteneurs). L'approche DinD installe une mini-usine complète dans chaque atelier. L'approche socket bind donne à chaque atelier un accès à la chaîne de production de l'usine principale.

---

## Étapes Pratiques

### Étape 1 : Installer act

Sur macOS avec Homebrew :

```bash
# Installe act via Homebrew
brew install act
```

Sur Linux :

```bash
# Télécharge et installe act
curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

Vérifie l'installation :

```bash
# Affiche la version de act
act --version
```

**Résultat attendu** :

```text
act version 0.2.x
```

---

### Étape 2 : Exécuter un workflow GitHub Actions avec act

Navigue vers un projet qui contient des workflows GitHub Actions :

```bash
# Va dans le dossier du projet
cd mon-projet-actions
```

Liste les workflows disponibles :

```bash
# Liste les workflows sans les exécuter
act --list
```

**Résultat attendu** :

```text
Stage  Job ID        Job name       Workflow name  Workflow file  Events
0      saluer        saluer         Hello World    hello.yml      push
0      verification  verification   Multi Jobs     multi-jobs.yml push
0      analyse       analyse        Multi Jobs     multi-jobs.yml push
1      rapport       rapport        Multi Jobs     multi-jobs.yml push
```

---

### Étape 3 : Exécuter un workflow spécifique avec act

```bash
# Exécuter tous les workflows déclenchés par l'événement "push"
act push
```

Si c'est la première exécution, `act` demande quelle image Docker utiliser :

```text
? Please choose the default image you want to use with act:
  - Large size image (18GB)
  - Medium size image (500MB)  ← Recommandé
  - Micro size image (200MB)
```

Choisis l'image **Medium** pour un bon équilibre entre fonctionnalités et taille.

**Résultat attendu** :

```text
[Hello World/saluer] 🚀  Start image=catthehacker/ubuntu:act-latest
[Hello World/saluer]   🐳  docker pull image=catthehacker/ubuntu:act-latest
[Hello World/saluer]   🐳  docker create image=catthehacker/ubuntu:act-latest
[Hello World/saluer] ⭐  Run Dire bonjour
[Hello World/saluer]   | Bonjour depuis GitHub Actions !
[Hello World/saluer]   ✅  Success - Dire bonjour
[Hello World/saluer] ⭐  Run Afficher la date
[Hello World/saluer]   | Fri Mar 20 10:30:00 UTC 2026
[Hello World/saluer]   ✅  Success - Afficher la date
```

---

### Étape 4 : Exécuter un seul job avec act

```bash
# Exécuter uniquement le job "saluer" du workflow "Hello World"
act push -j saluer
```

**Résultat attendu** :

```text
[Hello World/saluer] 🚀  Start image=catthehacker/ubuntu:act-latest
[Hello World/saluer] ⭐  Run Dire bonjour
[Hello World/saluer]   | Bonjour depuis GitHub Actions !
[Hello World/saluer]   ✅  Success - Dire bonjour
```

---

### Étape 5 : Fournir des secrets à act

Crée un fichier `.secrets` à la racine du projet (ajoute-le à `.gitignore`) :

```bash
# Crée le fichier .secrets (NE PAS committer ce fichier !)
cat > .secrets << 'EOF'
GITHUB_TOKEN=ghp_ton_token_ici
DATABASE_PASSWORD=mon_secret_local
API_KEY=ma_cle_api_locale
EOF

# Ajoute .secrets à .gitignore
echo ".secrets" >> .gitignore
```

Exécute act avec les secrets :

```bash
# Utilise le fichier .secrets pour fournir les secrets
act push --secret-file .secrets
```

Tu peux aussi passer les secrets individuellement :

```bash
# Passe un secret en ligne de commande
act push -s GITHUB_TOKEN=ghp_ton_token_ici
```

**Résultat attendu** :

```text
Les workflows qui utilisent ${{ secrets.GITHUB_TOKEN }} fonctionnent.
Les secrets sont masqués dans les logs (remplacés par ***).
```

---

### Étape 6 : Fournir des variables d'environnement à act

Crée un fichier `.env` pour les variables non sensibles :

```bash
# Crée le fichier .env
cat > .env << 'EOF'
APP_ENV=test
NODE_ENV=ci
PHP_VERSION=8.3
EOF
```

Exécute act avec les variables :

```bash
# Utilise le fichier .env pour les variables
act push --env-file .env
```

**Résultat attendu** :

```text
Les variables $APP_ENV, $NODE_ENV, $PHP_VERSION sont disponibles dans les workflows.
```

---

### Étape 7 : Déboguer un workflow qui échoue

```bash
# Mode verbose : affiche les détails de chaque étape
act push -v

# Mode très verbose : affiche les commandes Docker
act push -v -v
```

Si un step échoue, `act` affiche la sortie du conteneur Docker avec le message d'erreur.

Pour inspecter le conteneur après un échec :

```bash
# Garder le conteneur après l'exécution (ne pas le supprimer)
act push --reuse
```

Puis inspecte le conteneur :

```bash
# Liste les conteneurs act
docker ps -a | grep act

# Entre dans le conteneur pour déboguer
docker exec -it <container_id> bash
```

**Résultat attendu** :

```text
Tu peux entrer dans le conteneur et exécuter manuellement les commandes
qui échouent pour comprendre le problème.
```

---

### Étape 8 : Installer gitlab-runner localement

Sur macOS :

```bash
# Installe gitlab-runner via Homebrew
brew install gitlab-runner
```

Sur Linux (Debian/Ubuntu) :

```bash
# Ajoute le dépôt GitLab
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash

# Installe gitlab-runner
sudo apt-get install gitlab-runner
```

Vérifie l'installation :

```bash
# Affiche la version
gitlab-runner --version
```

**Résultat attendu** :

```text
Version:      17.x.x
Git revision: abc123
Git branch:   main
GO version:   go1.22.x
```

---

### Étape 9 : Exécuter un job GitLab CI localement (Runner < 16 uniquement)

> ⚠️ **Runner ≥ 16** : `gitlab-runner exec` est supprimé. Utilise `gitlab-ci-local` à la place (voir la note dans la section Concepts) ou connecte un Runner local à ton instance GitLab.

Sur un Runner de version antérieure à 16, navigue vers un projet avec un fichier `.gitlab-ci.yml` :

```bash
# Va dans le dossier du projet
cd mon-projet-gitlab

# Exécute un job spécifique (Runner < 16 uniquement)
gitlab-runner exec docker test-php
```

**Explication de la commande** :

```text
gitlab-runner exec docker test-php
                   │       │
                   │       └── Nom du job à exécuter
                   │           (doit correspondre à un job dans .gitlab-ci.yml)
                   │
                   └── Exécuteur à utiliser
                       (docker = exécuter dans un conteneur Docker)
```

**Résultat attendu** (Runner < 16) :

```text
Running with gitlab-runner 15.x.x
Using Docker executor with image php:8.3-cli...
Pulling docker image php:8.3-cli...
Running on runner-xxx-project-0-concurrent-0...
$ echo "Tests en cours..."
Tests en cours...
Job succeeded
```

**Alternative avec gitlab-ci-local** (Runner ≥ 16) :

```bash
# Installer gitlab-ci-local
npm install -g gitlab-ci-local

# Lister les jobs disponibles
gitlab-ci-local --list

# Exécuter un job spécifique
gitlab-ci-local test-php
```

---

### Étape 10 : Comprendre les limitations de l'exécution locale

Crée un tableau récapitulatif des limitations :

| Fonctionnalité | act | gitlab-runner exec |
| --- | --- | --- |
| Exécuter un job simple | Oui | Oui |
| Exécuter un pipeline complet | Oui | Non (un job à la fois) |
| Services (PostgreSQL, Redis) | Partiel | Non |
| Cache | Partiel | Non |
| Artefacts entre jobs | Partiel | Non |
| Secrets | Via `.env` | Via variables |
| Actions du marketplace | Partiel | N/A |
| Variables `$CI_*` | N/A | Simulées |
| Environments / approbations | Non | Non |
| Matrix builds | Oui | Non |
| Docker-in-Docker | Oui* | Oui* |

_Oui\* = supporté avec configuration supplémentaire_

---

### Étape 11 : Configurer act pour un projet réel

Crée le fichier `.actrc` à la racine du projet :

```bash
# Crée le fichier de configuration act
cat > .actrc << 'EOF'
# Image par défaut (medium)
-P ubuntu-latest=catthehacker/ubuntu:act-latest
-P ubuntu-22.04=catthehacker/ubuntu:act-22.04
-P ubuntu-20.04=catthehacker/ubuntu:act-20.04

# Fichier de secrets par défaut
--secret-file .secrets

# Fichier de variables par défaut
--env-file .env
EOF
```

Avec ce fichier, les commandes `act` utilisent automatiquement les bonnes images et les fichiers de secrets/variables.

```bash
# Plus besoin de préciser les options
act push
```

**Résultat attendu** :

```text
act utilise automatiquement :
- L'image catthehacker/ubuntu:act-latest pour ubuntu-latest
- Les secrets du fichier .secrets
- Les variables du fichier .env
```

---

### Étape 12 : Docker-in-Docker en local

Pour builder des images Docker dans `act`, tu dois configurer le bind du socket Docker :

```bash
# Exécuter act avec accès au démon Docker de l'hôte
act push --bind --container-daemon-socket /var/run/docker.sock
```

**Explication** :

```text
--bind
  → Monte le dossier du projet dans le conteneur (au lieu de copier)
  → Plus rapide, mais les modifications dans le conteneur affectent le dossier local

--container-daemon-socket /var/run/docker.sock
  → Partage le démon Docker de l'hôte avec le conteneur
  → Permet d'exécuter docker build à l'intérieur du conteneur
```

Pour `gitlab-runner exec`, le Docker socket est automatiquement monté quand tu utilises l'exécuteur `docker`.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `act --list` | Liste les workflows et jobs disponibles |
| `act push` | Exécute les workflows déclenchés par un push |
| `act push -j <job>` | Exécute un seul job |
| `act push -v` | Mode verbose |
| `act push --secret-file .secrets` | Fournit des secrets |
| `act push --reuse` | Garde les conteneurs après l'exécution |
| `act push --bind` | Monte le dossier local (au lieu de copier) |
| `gitlab-runner exec docker <job>` | Exécute un job GitLab CI localement (Runner < 16 uniquement, supprimé dans Runner ≥ 16) |
| `gitlab-ci-local --list` | Liste les jobs disponibles (alternative communautaire pour Runner ≥ 16) |
| `gitlab-ci-local <job>` | Exécute un job GitLab CI localement avec gitlab-ci-local |
| `gitlab-runner --version` | Affiche la version du runner |

---

## Pièges Fréquents

### Piège 1 : Action du marketplace incompatible avec act

⚠️ **Problème** : Tu utilises `actions/setup-php@v2` dans ton workflow. `act` échoue car cette action n'est pas compatible avec l'image Docker utilisée localement.

✅ **Solution** : Utilise l'image complète (Large) ou installe les outils manuellement dans un step conditionnel :

```yaml
steps:
  - name: Installer PHP (CI)
    if: ${{ !env.ACT }}
    uses: shivammathur/setup-php@v2
    with:
      php-version: "8.3"

  - name: Installer PHP (local)
    if: ${{ env.ACT }}
    run: |
      apt-get update && apt-get install -y php8.3-cli
```

La variable `ACT` est automatiquement définie par `act` dans l'environnement.

---

### Piège 2 : Espace disque insuffisant

⚠️ **Problème** : `act` télécharge de grosses images Docker (500 Mo à 18 Go). Ton disque dur est plein.

✅ **Solution** : Utilise l'image Micro (200 Mo) pour les tests simples. Nettoie régulièrement les images Docker :

```bash
# Supprime les images act inutilisées
docker image prune -a --filter "label=act"

# Vérifie l'espace utilisé par Docker
docker system df
```

---

### Piège 3 : Permissions de fichier différentes

⚠️ **Problème** : Les fichiers créés dans le conteneur `act` appartiennent à root. Sur ta machine macOS ou Linux, tu n'as pas les droits pour les modifier.

✅ **Solution** : Utilise l'option `--container-options` pour exécuter le conteneur avec ton UID :

```bash
# Exécuter act avec ton UID
act push --container-options "--user $(id -u):$(id -g)"
```

---

### Piège 4 : gitlab-runner exec introuvable (Runner ≥ 16)

⚠️ **Problème** : Tu tentes de lancer `gitlab-runner exec docker test-php` mais la commande n'existe pas. Le terminal affiche `command not found: exec` ou une erreur similaire.

✅ **Solution** : La commande `gitlab-runner exec` a été définitivement supprimée dans GitLab Runner 16 (2023). Tu ne peux plus l'utiliser. Utilise `gitlab-ci-local` à la place :

```bash
# Installer gitlab-ci-local
npm install -g gitlab-ci-local

# Exécuter un job spécifique
gitlab-ci-local test-php
```

Si tu es sur Runner < 16 et que l'image n'est pas trouvée, tire-la manuellement :

```bash
docker pull php:8.3-cli
gitlab-runner exec docker test-php  # Runner < 16 uniquement
```

---

## Checklist de Validation

- [ ] Je sais installer `act` sur ma machine
- [ ] Je sais exécuter un workflow GitHub Actions localement avec `act`
- [ ] Je sais fournir des secrets et des variables à `act`
- [ ] Je sais que `gitlab-runner exec` est supprimé dans Runner ≥ 16 et je connais les alternatives (`gitlab-ci-local`, runner local connecté)
- [ ] Je connais les limitations de l'exécution locale (services, cache, artefacts)
- [ ] Je sais déboguer un workflow qui échoue avec le mode verbose
- [ ] Je comprends la différence entre Docker-in-Docker et Docker socket bind

---

## Exercice Pratique

**Énoncé** : Configure et exécute localement un workflow GitHub Actions qui :

1. Vérifie le formatage d'un fichier Markdown
2. Affiche les informations du système (OS, architecture)
3. Crée un fichier de résultat dans un dossier `output/`

Ensuite :

1. Exécute le workflow avec `act`
2. Fournis une variable `APP_VERSION=1.0.0` via un fichier `.env`
3. Vérifie que le fichier de résultat a été créé

**Indications** :

- Crée un fichier `.github/workflows/local-test.yml`
- Utilise `run` pour les commandes shell
- Crée le fichier `.env` avec `APP_VERSION=1.0.0`
- Utilise `act push -j <nom_du_job>` pour exécuter le job
- Utilise `--bind` pour voir les fichiers créés dans ton dossier local

**Résultat attendu** : Le workflow s'exécute localement. Le fichier `output/result.txt` est créé avec la version et les informations système.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Fichier `.github/workflows/local-test.yml` :

```yaml
# Workflow pour tester l'exécution locale avec act
name: Test Local

on:
  push:
    branches:
      - main

jobs:
  local-check:
    runs-on: ubuntu-latest
    steps:
      # Récupérer le code
      - name: Récupérer le code
        uses: actions/checkout@v4

      # Vérifier le Markdown (vérification simple avec grep)
      - name: Vérifier le Markdown
        run: |
          echo "Vérification du README.md..."
          if grep -q "# " README.md; then
            echo "Le fichier contient un titre Markdown valide"
          else
            echo "Erreur : pas de titre trouvé"
            exit 1
          fi

      # Afficher les informations système
      - name: Informations système
        run: |
          echo "OS : $(uname -s)"
          echo "Architecture : $(uname -m)"
          echo "Utilisateur : $(whoami)"
          echo "Date : $(date)"
          echo "Version app : $APP_VERSION"
        env:
          APP_VERSION: ${{ env.APP_VERSION }}

      # Créer le fichier de résultat
      - name: Créer le résultat
        run: |
          mkdir -p output
          echo "Version: $APP_VERSION" > output/result.txt
          echo "OS: $(uname -s)" >> output/result.txt
          echo "Architecture: $(uname -m)" >> output/result.txt
          echo "Date: $(date)" >> output/result.txt
          echo "Fichier créé :"
          cat output/result.txt
        env:
          APP_VERSION: ${{ env.APP_VERSION }}
```

Fichier `.env` :

```text
APP_VERSION=1.0.0
```

Commandes pour exécuter :

```bash
# Exécuter le workflow localement avec act
act push -j local-check --bind --env-file .env
```

**Explication** :

- `--bind` monte le dossier local dans le conteneur (les fichiers créés sont visibles)
- `--env-file .env` fournit la variable `APP_VERSION`
- Le step "Créer le résultat" crée `output/result.txt` avec les informations
- Avec `--bind`, le fichier `output/result.txt` est visible dans ton dossier local après l'exécution

Vérification :

```bash
# Vérifie que le fichier a été créé
cat output/result.txt
```

**Résultat attendu** :

```text
Version: 1.0.0
OS: Linux
Architecture: x86_64
Date: Fri Mar 20 10:30:00 UTC 2026
```

---

## Navigation

← Fiche précédente : **[GitLab CI - Pipeline complet](07-gitlab-ci-pipeline-complet.md)**

→ Fiche suivante : **[Stratégies de déploiement](09-strategies-deploiement.md)**
