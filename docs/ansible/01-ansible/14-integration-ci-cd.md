---
tags:
  - Ansible
  - Avancé
  - Pratique
description: "Intégration CI/CD"
estimated_time: "150 min"
fiche_number: 14
total_fiches: 14
cursus: "Ansible"
---

# 14 - Intégration CI/CD

> **En bref** : À la fin de cette fiche, tu sauras intégrer Ansible dans un pipeline CI/CD pour valider, tester et déployer automatiquement ton infrastructure. Lecture estimée : 150 min.


## Prérequis

- Fiches [01 - Introduction à Ansible](01-introduction-ansible.md) à [10 - Les Rôles](10-roles.md) de ce cursus (lues et comprises)
- Fiche **[12 - Ansible Vault](12-ansible-vault.md)** (gestion des secrets)
- Fiche **[13 - Gestion Multi-Environnement](13-gestion-multi-environnement.md)** (inventaires staging/production)
- Savoir utiliser Git (commit, push, branches)
- Avoir un accès SSH fonctionnel vers tes machines cibles
- Avoir Docker installé sur ta machine locale (pour les tests Molecule)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras intégrer Ansible dans un pipeline CI/CD pour valider, tester et déployer automatiquement ton infrastructure.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'intégration CI/CD pour Ansible ?

**Définition** : L'intégration CI/CD (Continuous Integration / Continuous Deployment) pour Ansible consiste à automatiser le cycle complet de validation et de déploiement du code Ansible via un pipeline. À chaque commit dans le dépôt Git, le pipeline exécute automatiquement une série d'étapes : lint, vérification de syntaxe, tests, puis déploiement.

**Le problème que l'intégration CI/CD résout** :

Sans CI/CD, voici les problèmes rencontrés :

1. **Erreurs de syntaxe non détectées** : Un playbook contenant une erreur YAML ou une indentation incorrecte est poussé dans Git. L'erreur n'est découverte qu'au moment du déploiement, en production.

2. **Playbooks non testés** : Les rôles et playbooks sont écrits sans être testés sur un environnement de validation. Un rôle qui fonctionne sur Debian peut échouer sur Ubuntu car un nom de paquet diffère.

3. **Déploiements manuels risqués** : Un administrateur exécute `ansible-playbook` manuellement depuis sa machine. Il peut se tromper d'inventaire (staging au lieu de production), oublier le mot de passe Vault, ou exécuter une version obsolète du code.

4. **Pas de traçabilité** : Impossible de savoir qui a déployé quoi, quand, et dans quel état était le code au moment du déploiement.

5. **Bonnes pratiques non appliquées** : Chaque membre de l'équipe écrit du code Ansible à sa façon. Certains utilisent les FQCN, d'autres non. Certains évitent `command`, d'autres l'utilisent systématiquement.

**Comment l'intégration CI/CD résout ces problèmes** :

| Problème                         | Solution apportée par la CI/CD                                                          |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| Erreurs de syntaxe non détectées | Le pipeline exécute `--syntax-check` et `ansible-lint` à chaque commit                  |
| Playbooks non testés             | Molecule crée des conteneurs éphémères et vérifie que les rôles fonctionnent             |
| Déploiements manuels risqués     | Le pipeline déploie automatiquement avec l'inventaire et les variables corrects          |
| Pas de traçabilité               | Chaque déploiement est associé à un commit Git et un pipeline avec logs complets         |
| Bonnes pratiques non appliquées  | `ansible-lint` bloque le pipeline si les règles ne sont pas respectées                   |

**Analogie concrète** : Imagine une chaîne de montage automobile. Chaque voiture passe par des postes de contrôle : vérification de la carrosserie, test du moteur, contrôle de l'électronique, test de freinage. Si un poste détecte un défaut, la voiture est arrêtée et corrigée avant de passer au suivant. Sans cette chaîne, chaque voiture serait assemblée à la main et livrée sans vérification. Le pipeline CI/CD est cette chaîne de montage pour ton code Ansible.

Le diagramme suivant montre le flux d'un pipeline CI/CD Ansible, du push Git jusqu'au déploiement sur les serveurs.

<div class="diagram-design">
<p><a href="../../../diagrams/ansible-01-ansible-14-integration-ci-cd-1.html">Qu&#x27;est-ce que l&#x27;intégration CI/CD pour Ansible ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ansible-01-ansible-14-integration-ci-cd-1.html" title="Qu&#x27;est-ce que l&#x27;intégration CI/CD pour Ansible ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Ce que l'intégration CI/CD n'est PAS** :

- L'intégration CI/CD n'est pas un outil Ansible. Ansible est l'outil de déploiement. La CI/CD est le système qui _déclenche_ et _orchestre_ l'exécution d'Ansible automatiquement.
- L'intégration CI/CD ne remplace pas les tests manuels. Elle automatise les vérifications reproductibles. Les tests exploratoires (vérifier qu'une application fonctionne correctement dans un navigateur, par exemple) restent manuels.

**Remarque importante sur l'environnement offline** : La CI/CD nécessite un serveur avec accès internet (GitHub Actions, GitLab CI) ou un serveur GitLab auto-hébergé sur ton réseau. En environnement offline, les validations locales (`ansible-lint`, `--syntax-check`, Molecule avec images Docker déjà téléchargées) restent possibles et constituent déjà une amélioration significative. Cette fiche couvre les deux cas : validations locales (offline) et pipelines CI/CD (nécessitent un serveur).

---

### Qu'est-ce qu'ansible-lint ?

**Définition** : `ansible-lint` est un outil d'analyse statique qui vérifie que tes playbooks et rôles Ansible respectent les bonnes pratiques. Il ne vérifie pas seulement la syntaxe YAML : il détecte les mauvaises habitudes, les modules dépréciés, les noms manquants et les problèmes de formatage.

**Le problème qu'ansible-lint résout** :

Sans ansible-lint, voici les problèmes rencontrés :

1. **Syntaxe dépréciée non détectée** : Tu utilises `apt` au lieu de `ansible.builtin.apt` (FQCN manquant). Le playbook fonctionne aujourd'hui, mais pourrait échouer dans une version future d'Ansible.

2. **Commandes risquées non signalées** : Tu utilises `ansible.builtin.command` ou `ansible.builtin.shell` alors qu'un module dédié existe (par exemple, `command: apt install nginx` au lieu du module `apt`).

3. **Incohérence de style** : Dans un projet d'équipe, chaque personne nomme les tâches différemment, indente les fichiers différemment, utilise ou non les FQCN.

4. **Noms de tâches manquants** : Des tâches sans attribut `name` rendent les logs d'exécution illisibles.

**Comment ansible-lint résout ces problèmes** :

| Problème                          | Solution apportée par ansible-lint                                    |
| --------------------------------- | --------------------------------------------------------------------- |
| Syntaxe dépréciée non détectée    | Signale les modules sans FQCN et les syntaxes obsolètes               |
| Commandes risquées non signalées  | Détecte `command` ou `shell` quand un module natif existe              |
| Incohérence de style              | Applique un ensemble de règles uniformes à tout le projet              |
| Noms de tâches manquants          | Signale les tâches sans `name`                                         |

**Analogie concrète** : `ansible-lint` est comme un correcteur orthographique et grammatical pour un texte. Le correcteur ne vérifie pas seulement que les mots sont correctement écrits (cela, c'est la vérification de syntaxe YAML). Il vérifie aussi que les phrases sont bien construites, que la ponctuation est correcte, et que le style est cohérent dans tout le document.

**Ce qu'ansible-lint n'est PAS** :

- `ansible-lint` n'est pas `--syntax-check`. L'option `--syntax-check` vérifie uniquement que le YAML est valide et que la structure Ansible est correcte. `ansible-lint` va plus loin en vérifiant les bonnes pratiques.
- `ansible-lint` n'exécute aucune tâche. Il ne se connecte jamais aux machines cibles. Il analyse uniquement le code source.

**Comparaison ansible-lint vs --syntax-check** :

| ansible-lint                                 | --syntax-check                             |
| -------------------------------------------- | ------------------------------------------ |
| Vérifie les bonnes pratiques                 | Vérifie uniquement la syntaxe              |
| Détecte les FQCN manquants                   | Ne vérifie pas les FQCN                    |
| Signale les modules risqués (command, shell) | Ne signale pas les choix de modules         |
| Vérifie le nommage des tâches                | Ne vérifie pas le nommage                   |
| Outil externe (`pip install ansible-lint`)   | Intégré à Ansible (`ansible-playbook`)      |

**Installation** :

```bash
# ansible-lint s'installe via pip
pip install ansible-lint
```

**Remarque offline** : `ansible-lint` s'installe via `pip`. Si tu es en environnement offline, télécharge le paquet `.whl` depuis une machine connectée et installe-le avec `pip install ansible_lint-*.whl`.

---

### Qu'est-ce que yamllint ?

**Définition** : `yamllint` est un outil d'analyse statique pour les fichiers YAML. Il vérifie le formatage, l'indentation, la longueur des lignes et la syntaxe YAML.

**Le problème que yamllint résout** :

Sans yamllint, voici les problèmes rencontrés :

1. **Indentation incohérente** : Certains fichiers utilisent 2 espaces, d'autres 4 espaces, d'autres mélangent les deux.
2. **Lignes trop longues** : Des lignes de 300 caractères rendent le code illisible sans défilement horizontal.
3. **Espaces en fin de ligne** : Des espaces invisibles en fin de ligne causent des différences inutiles dans Git.

**Comment yamllint résout ces problèmes** :

| Problème                  | Solution apportée par yamllint                     |
| ------------------------- | -------------------------------------------------- |
| Indentation incohérente   | Impose un nombre fixe d'espaces pour l'indentation |
| Lignes trop longues       | Signale les lignes dépassant la limite configurée   |
| Espaces en fin de ligne   | Détecte et signale les espaces invisibles            |

**Installation** :

```bash
pip install yamllint
```

---

### Qu'est-ce que Molecule ?

**Définition** : Molecule est un framework de test pour les rôles Ansible. Il crée des instances éphémères (conteneurs Docker, machines virtuelles Vagrant), exécute ton rôle dessus, vérifie le résultat, puis détruit les instances. Tout ce processus est automatisé.

**Le problème que Molecule résout** :

Sans Molecule, voici les problèmes rencontrés :

1. **Tests manuels lents** : Pour tester un rôle, tu dois créer une VM, exécuter le rôle, vérifier manuellement que tout fonctionne, puis supprimer la VM. Cela prend 20 à 30 minutes.

2. **Tests non reproductibles** : La VM de test accumule des modifications au fil des exécutions. Un rôle peut sembler fonctionner parce qu'un fichier de configuration créé lors d'un test précédent est encore présent.

3. **Idempotence non vérifiée** : Tu exécutes le rôle une seule fois. Tu ne vérifies jamais qu'une deuxième exécution n'introduit pas de changements inattendus.

4. **Pas de vérification automatisée** : Tu vérifies manuellement (avec `curl`, `systemctl status`, etc.) que le rôle a produit le résultat attendu. Ces vérifications ne sont pas documentées et ne sont pas reproductibles.

**Comment Molecule résout ces problèmes** :

| Problème                            | Solution apportée par Molecule                                             |
| ----------------------------------- | -------------------------------------------------------------------------- |
| Tests manuels lents                 | Conteneurs Docker créés et détruits en quelques secondes                    |
| Tests non reproductibles            | Chaque test démarre avec une instance vierge                                |
| Idempotence non vérifiée            | Molecule exécute le rôle deux fois et vérifie que la 2e exécution = 0 changements |
| Pas de vérification automatisée     | Un fichier `verify.yml` contient les assertions à vérifier automatiquement  |

**Analogie concrète** : Tester un rôle Ansible manuellement, c'est comme tester une recette en goûtant dans la casserole, sans mesurer les ingrédients ni chronométrer la cuisson. Molecule est un laboratoire de test culinaire : il prépare une cuisine propre (instance vierge), suit ta recette à la lettre (converge), vérifie que le plat correspond aux critères (verify), puis nettoie la cuisine (destroy). Si tu modifies la recette, tu peux la retester dans les mêmes conditions.

**Ce que Molecule n'est PAS** :

- Molecule n'est pas un outil de déploiement. Il ne déploie rien en production. Il teste uniquement des rôles dans des environnements éphémères.
- Molecule ne teste pas les playbooks complets. Il est conçu pour tester des rôles individuels. Pour tester un playbook entier, tu utilises un pipeline CI/CD avec un environnement de staging.

**Le cycle de vie Molecule** :

Molecule exécute les étapes suivantes dans cet ordre :

| Étape       | Action                                                              |
| ----------- | ------------------------------------------------------------------- |
| `create`    | Crée les instances de test (conteneurs Docker ou VMs)               |
| `converge`  | Exécute le rôle Ansible sur les instances                            |
| `idempotence` | Exécute le rôle une deuxième fois et vérifie que `changed=0`     |
| `verify`    | Exécute les tests de vérification (`verify.yml`)                     |
| `destroy`   | Détruit les instances de test                                        |

La commande `molecule test` exécute toutes ces étapes dans l'ordre. Si une étape échoue, les suivantes ne sont pas exécutées (sauf `destroy`, qui est toujours exécutée pour nettoyer).

**Drivers disponibles** :

| Driver   | Instance créée          | Prérequis                | Vitesse        |
| -------- | ----------------------- | ------------------------ | -------------- |
| Docker   | Conteneur Docker        | Docker installé          | Rapide (secondes) |
| Podman   | Conteneur Podman        | Podman installé          | Rapide (secondes) |
| Vagrant  | Machine virtuelle       | Vagrant + VirtualBox     | Lent (minutes)    |

Le driver Docker est le plus courant et le plus rapide.

**Remarque offline** : Molecule avec le driver Docker fonctionne offline une fois que les images Docker sont téléchargées et mises en cache. Télécharge les images nécessaires sur une machine connectée (`docker pull ubuntu:22.04`), puis exporte-les (`docker save`) pour les importer sur ta machine offline (`docker load`).

---

### Pipeline CI/CD typique pour Ansible

**Définition** : Un pipeline CI/CD pour Ansible est une séquence d'étapes automatisées qui s'exécutent à chaque commit ou merge request. Chaque étape valide un aspect différent du code avant d'autoriser le déploiement.

**Les 5 étapes d'un pipeline Ansible** :

```text
┌──────────┐    ┌────────────────┐    ┌───────────┐    ┌─────────────────┐    ┌─────────────────────┐
│  1. Lint  │───>│ 2. Syntax Check│───>│  3. Test   │───>│ 4. Deploy Staging│───>│ 5. Deploy Production │
└──────────┘    └────────────────┘    └───────────┘    └─────────────────┘    └─────────────────────┘
  ansible-lint     --syntax-check       Molecule          Automatique            Manuel (approbation)
  yamllint                                                sur branche develop    sur branche main
```

**Détail de chaque étape** :

| Étape                   | Outils utilisés                             | Déclencheur               | Bloquant |
| ----------------------- | ------------------------------------------- | ------------------------- | -------- |
| 1. Lint                 | `ansible-lint`, `yamllint`                  | Chaque commit             | Oui      |
| 2. Syntax Check         | `ansible-playbook --syntax-check`           | Chaque commit             | Oui      |
| 3. Test unitaire        | `molecule test`                              | Chaque commit             | Oui      |
| 4. Deploy staging       | `ansible-playbook -i inventories/staging/`   | Merge sur `develop`       | Oui      |
| 5. Deploy production    | `ansible-playbook -i inventories/production/`| Merge sur `main` + approbation manuelle | Oui |

**Règle** : L'étape 5 (déploiement en production) doit toujours nécessiter une approbation manuelle. Aucun déploiement en production ne doit être entièrement automatique.

---

## Étapes Pratiques

### Étape 1 : Installer ansible-lint et yamllint

**Ce que fait cette étape** : Tu installes les deux outils de validation statique qui seront utilisés dans le pipeline.

**Commande** :

```bash
# Installe ansible-lint et yamllint via pip
pip install ansible-lint yamllint
```

**Résultat attendu** :

```text
Successfully installed ansible-lint-26.x.x yamllint-1.x.x
```

**Vérification** :

```bash
# Vérifie que les outils sont installés
ansible-lint --version
yamllint --version
```

**Résultat attendu** :

```text
ansible-lint 26.x.x using ansible-core:2.x.x
yamllint 1.x.x
```

---

### Étape 2 : Configurer yamllint

**Ce que fait cette étape** : Tu crées un fichier de configuration qui définit les règles de formatage YAML pour ton projet.

Crée le fichier `.yamllint` à la racine de ton projet Ansible :

```yaml
---
rules:
  # Longueur maximale des lignes : 200 caractères
  # (la valeur par défaut de 80 est trop restrictive pour Ansible)
  line-length:
    max: 200
    level: warning

  # Indentation : 2 espaces obligatoires
  indentation:
    spaces: 2
    indent-sequences: true
    check-multi-line-strings: false

  # Pas d'espaces en fin de ligne
  trailing-spaces: enable

  # Un saut de ligne à la fin du fichier
  new-line-at-end-of-file: enable

  # Pas de lignes vides multiples (2 maximum)
  empty-lines:
    max: 2

  # Les booléens doivent utiliser true/false (pas yes/no)
  truthy:
    allowed-values:
      - "true"
      - "false"
    check-keys: false
```

**Structure du projet après cette étape** :

```text
ansible-project/
├── .yamllint           # Configuration yamllint
├── inventories/
├── playbooks/
└── roles/
```

---

### Étape 3 : Configurer ansible-lint

**Ce que fait cette étape** : Tu crées un fichier de configuration qui définit quelles règles ansible-lint doit appliquer, ignorer ou considérer comme des avertissements.

Crée le fichier `.ansible-lint` à la racine de ton projet :

```yaml
---
# Règles à ignorer complètement
# (ne génèrent ni erreur ni avertissement)
skip_list:
  # Ignorer la vérification de longueur de ligne YAML
  # (déjà gérée par yamllint avec une limite plus haute)
  - yaml[line-length]

# Règles qui génèrent un avertissement au lieu d'une erreur
# (le pipeline ne s'arrête pas, mais tu vois le problème)
warn_list:
  # Avertir si command/shell est utilisé au lieu d'un module natif
  - command-instead-of-module
  # Avertir si un nom de tâche ne commence pas par une majuscule
  - name[casing]

# Chemins à exclure de l'analyse
exclude_paths:
  - .cache/
  - .github/
  - .gitlab/

# Profil de règles : "production" applique toutes les règles
# Autres options : "min", "basic", "moderate", "safety", "shared"
profile: moderate
```

**Les profils ansible-lint** :

| Profil       | Nombre de règles | Usage recommandé                                 |
| ------------ | ----------------- | ------------------------------------------------ |
| `min`        | Très peu          | Projet qui découvre ansible-lint                  |
| `basic`      | Quelques-unes     | Projet en cours de migration                      |
| `moderate`   | Modéré            | Projet en développement actif                     |
| `safety`     | Beaucoup          | Projet en pré-production                          |
| `shared`     | Beaucoup          | Rôles partagés (Ansible Galaxy)                   |
| `production` | Toutes            | Projet en production, qualité maximale             |

**Conseil** : Commence avec le profil `moderate`. Tu pourras passer à `production` progressivement en corrigeant les erreurs au fil du temps.

---

### Étape 4 : Exécuter ansible-lint sur tes playbooks

**Ce que fait cette étape** : Tu exécutes ansible-lint pour détecter les problèmes dans tes playbooks et rôles existants.

**Commandes** :

```bash
# Lint un playbook spécifique
ansible-lint playbooks/site.yml

# Lint tous les rôles
ansible-lint roles/

# Lint tout le projet (depuis la racine)
ansible-lint
```

**Exemple de sortie avec erreurs** :

```text
WARNING  Listing 4 violation(s) that are fatal
fqcn[action-core]: Use FQCN for builtin module actions (apt).
playbooks/site.yml:12 Task/Handler: Install nginx

name[missing]: All tasks should be named.
roles/nginx/tasks/main.yml:8 Task/Handler: ansible.builtin.apt

yaml[truthy]: Truthy value should be one of [false, true]
roles/nginx/defaults/main.yml:3

risky-file-permissions: File permissions unset or incorrect.
roles/nginx/tasks/main.yml:15 Task/Handler: Copy nginx configuration

Read documentation for instructions on how to fix these violations.

Finished with 4 failure(s), 0 warning(s) on 5 files.
```

**Comment lire cette sortie** :

Chaque ligne d'erreur suit le format :

```text
règle[sous-règle]: Description du problème
fichier:ligne Contexte
```

**Comment corriger les erreurs ci-dessus** :

| Erreur                       | Fichier et ligne                     | Correction                                                   |
| ---------------------------- | ------------------------------------ | ------------------------------------------------------------ |
| `fqcn[action-core]`         | `playbooks/site.yml:12`             | Remplacer `apt:` par `ansible.builtin.apt:`                  |
| `name[missing]`             | `roles/nginx/tasks/main.yml:8`      | Ajouter `name: Installer les paquets nginx` à la tâche       |
| `yaml[truthy]`              | `roles/nginx/defaults/main.yml:3`   | Remplacer `yes` par `true` ou `no` par `false`               |
| `risky-file-permissions`    | `roles/nginx/tasks/main.yml:15`     | Ajouter `mode: "0644"` à la tâche `copy` ou `template`      |

---

### Étape 5 : Exécuter yamllint

**Ce que fait cette étape** : Tu exécutes yamllint pour vérifier le formatage YAML de tous tes fichiers.

**Commande** :

```bash
# Lint tous les fichiers YAML du projet
yamllint .
```

**Exemple de sortie avec erreurs** :

```text
./roles/nginx/tasks/main.yml
  3:1       warning  missing document start "---"  (document-start)
  15:81     warning  line too long (95 > 80 characters)  (line-length)
  22:17     error    wrong indentation: expected 4 but found 6  (indentation)
```

**Comment lire cette sortie** :

```text
fichier
  ligne:colonne  niveau  description (règle)
```

Les niveaux possibles sont `warning` (avertissement, non bloquant) et `error` (erreur, bloquant).

---

### Étape 6 : Utiliser --syntax-check

**Ce que fait cette étape** : Tu vérifies que la structure Ansible de ton playbook est valide, indépendamment des bonnes pratiques.

**Commande** :

```bash
# Vérifier la syntaxe d'un playbook
ansible-playbook playbooks/site.yml --syntax-check
```

**Résultat attendu si la syntaxe est correcte** :

```text
playbook: playbooks/site.yml
```

**Résultat attendu si la syntaxe est incorrecte** :

```text
ERROR! Syntax Error while loading YAML.
  mapping values are not allowed in this context

The error appears to be in 'playbooks/site.yml': line 15, column 8
```

**Différence avec ansible-lint** : `--syntax-check` est rapide et ne nécessite pas d'installation supplémentaire. Il détecte les erreurs qui empêchent l'exécution du playbook. `ansible-lint` est plus lent mais détecte les problèmes de qualité qui n'empêchent pas l'exécution.

**Conseil** : Exécute toujours `--syntax-check` avant `ansible-lint` dans un pipeline, car il est plus rapide et détecte les erreurs les plus graves.

---

### Étape 7 : Installer Molecule

**Ce que fait cette étape** : Tu installes Molecule avec le driver Docker pour pouvoir tester tes rôles Ansible dans des conteneurs éphémères.

**Commande** :

```bash
# Installe Molecule avec le plugin Docker
pip install molecule molecule-plugins[docker]
```

**Résultat attendu** :

```text
Successfully installed molecule-26.x.x molecule-plugins-26.x.x
```

**Vérification** :

```bash
# Vérifie que Molecule est installé
molecule --version
```

**Résultat attendu** :

```text
molecule 26.x.x using python 3.x
    ansible:2.x.x
    default:26.x.x from molecule
    docker:26.x.x from molecule_plugins
```

**Remarque offline** : Si tu es en environnement offline, télécharge les paquets suivants depuis une machine connectée et installe-les manuellement :

```bash
# Sur la machine connectée : télécharger les paquets
pip download molecule molecule-plugins[docker] -d ./molecule-packages/

# Sur la machine offline : installer depuis le dossier
pip install --no-index --find-links=./molecule-packages/ molecule molecule-plugins[docker]
```

---

### Étape 8 : Initialiser Molecule pour un rôle

**Ce que fait cette étape** : Tu initialises un scénario de test Molecule dans un rôle existant. Molecule crée la structure de fichiers nécessaire pour les tests.

**Commande** :

```bash
# Place-toi dans le répertoire du rôle à tester
cd roles/nginx

# Initialise un scénario Molecule avec le driver Docker
molecule init scenario --driver-name docker
```

**Résultat attendu** :

```text
INFO     Initializing new scenario default...
INFO     Initialized scenario in /home/loic/ansible-project/roles/nginx/molecule/default successfully.
```

**Structure créée par Molecule** :

```text
roles/nginx/
├── defaults/
│   └── main.yml
├── handlers/
│   └── main.yml
├── molecule/
│   └── default/             # Scénario de test "default"
│       ├── converge.yml     # Playbook qui exécute le rôle
│       ├── create.yml       # (optionnel) Personnalisation de la création
│       ├── destroy.yml      # (optionnel) Personnalisation de la destruction
│       ├── molecule.yml     # Configuration du scénario
│       └── verify.yml       # Tests de vérification (à écrire)
├── tasks/
│   └── main.yml
├── templates/
└── vars/
```

**Description de chaque fichier** :

| Fichier          | Rôle                                                                       |
| ---------------- | -------------------------------------------------------------------------- |
| `molecule.yml`   | Configuration du scénario : driver, plateformes, provisioner                |
| `converge.yml`   | Playbook minimal qui applique le rôle sur les instances de test             |
| `verify.yml`     | Playbook qui contient les assertions pour vérifier le résultat              |
| `create.yml`     | (optionnel) Playbook personnalisé pour créer les instances                  |
| `destroy.yml`    | (optionnel) Playbook personnalisé pour détruire les instances               |

---

### Étape 9 : Configurer le scénario Molecule

**Ce que fait cette étape** : Tu configures le fichier `molecule.yml` pour définir les instances de test, le driver et les options du provisioner.

Remplace le contenu de `molecule/default/molecule.yml` :

```yaml
---
driver:
  # Utilise Docker comme driver pour créer les instances de test
  name: docker

platforms:
  # Définit une instance de test basée sur Ubuntu 22.04
  - name: instance
    image: ubuntu:22.04
    # Utilise l'image telle quelle (sans Dockerfile personnalisé)
    pre_build_image: true
    # Lance /sbin/init comme processus principal
    # (nécessaire pour que systemd fonctionne dans le conteneur)
    command: /sbin/init
    # Mode privilégié : nécessaire pour systemd dans un conteneur
    privileged: true
    # Volumes pour que systemd fonctionne correctement
    volumes:
      - /sys/fs/cgroup:/sys/fs/cgroup:rw
    # Commande qui permet à systemd de démarrer
    cgroupns_mode: host

provisioner:
  # Utilise Ansible comme provisioner (c'est le seul supporté par Molecule)
  name: ansible

verifier:
  # Utilise Ansible pour les vérifications (au lieu de testinfra ou goss)
  name: ansible
```

**Explication des paramètres importants** :

- `pre_build_image: true` : Molecule utilise directement l'image Docker spécifiée dans `image`, sans la construire. Si tu mets `false`, Molecule cherche un `Dockerfile` pour construire une image personnalisée.
- `command: /sbin/init` : Par défaut, un conteneur Docker ne lance pas `systemd`. En spécifiant `/sbin/init` comme commande de démarrage et `privileged: true`, tu permets au conteneur d'utiliser `systemd`, ce qui est nécessaire pour tester des services (nginx, postgresql, etc.).
- `verifier: name: ansible` : Les tests de vérification sont écrits sous forme de playbook Ansible (`verify.yml`).

---

### Étape 10 : Vérifier le fichier converge.yml

**Ce que fait cette étape** : Tu vérifies que le fichier `converge.yml` appelle correctement ton rôle.

Le fichier `molecule/default/converge.yml` doit contenir :

```yaml
---
- name: Converge
  hosts: all
  become: true
  tasks:
    - name: "Include nginx"
      ansible.builtin.include_role:
        name: nginx
```

Ce playbook fait une seule chose : il applique le rôle `nginx` sur toutes les instances de test. C'est le strict minimum. Si ton rôle nécessite des variables, tu les ajoutes ici :

```yaml
---
- name: Converge
  hosts: all
  become: true
  vars:
    # Variables nécessaires pour le rôle
    nginx_port: 80
    nginx_server_name: test.local
  tasks:
    - name: "Include nginx"
      ansible.builtin.include_role:
        name: nginx
```

---

### Étape 11 : Écrire des tests de vérification

**Ce que fait cette étape** : Tu écris le fichier `verify.yml` qui contient les assertions automatisées. Ces assertions vérifient que le rôle a produit le résultat attendu.

Remplace le contenu de `molecule/default/verify.yml` :

```yaml
---
- name: Verify
  hosts: all
  # Pas de become ici car on vérifie l'état, on ne modifie rien
  gather_facts: true
  tasks:
    - name: Vérifier que nginx est installé
      ansible.builtin.command: nginx -v
      register: nginx_version
      # changed_when: false car cette commande ne modifie rien
      changed_when: false

    - name: Afficher la version de nginx
      ansible.builtin.debug:
        msg: "Nginx version : {{ nginx_version.stderr }}"

    - name: Récupérer la liste des services
      ansible.builtin.service_facts:

    - name: Vérifier que le service nginx est démarré
      ansible.builtin.assert:
        that:
          # Vérifie que le service nginx existe dans la liste des services
          - "'nginx.service' in ansible_facts.services"
          # Vérifie que le service nginx est en état "running"
          - "ansible_facts.services['nginx.service'].state == 'running'"
        fail_msg: "nginx n'est pas démarré"
        success_msg: "nginx est démarré correctement"

    - name: Vérifier que le port 80 est en écoute
      ansible.builtin.command: ss -tlnp
      register: listening_ports
      changed_when: false

    - name: Assert port 80 is listening
      ansible.builtin.assert:
        that:
          - "':80' in listening_ports.stdout"
        fail_msg: "Le port 80 n'est pas en écoute"
        success_msg: "Le port 80 est en écoute"

    - name: Vérifier que le fichier de configuration existe
      ansible.builtin.stat:
        path: /etc/nginx/sites-enabled/default
      register: nginx_config

    - name: Assert le fichier de configuration existe
      ansible.builtin.assert:
        that:
          - nginx_config.stat.exists
        fail_msg: "Le fichier de configuration nginx n'existe pas"
        success_msg: "Le fichier de configuration nginx existe"
```

**Explication des modules utilisés pour les tests** :

| Module                         | Usage dans les tests                                                    |
| ------------------------------ | ----------------------------------------------------------------------- |
| `ansible.builtin.command`      | Exécuter une commande et capturer la sortie avec `register`             |
| `ansible.builtin.service_facts`| Collecter l'état de tous les services (systemd)                         |
| `ansible.builtin.stat`         | Vérifier l'existence et les propriétés d'un fichier                     |
| `ansible.builtin.assert`       | Vérifier qu'une condition est vraie. Fait échouer le test si la condition est fausse |
| `ansible.builtin.debug`        | Afficher une information dans les logs (pour le diagnostic)             |

---

### Étape 12 : Exécuter Molecule

**Ce que fait cette étape** : Tu exécutes le cycle complet de test Molecule.

**Commande pour le cycle complet** :

```bash
# Depuis le répertoire du rôle (roles/nginx/)
molecule test
```

**Résultat attendu** :

```text
INFO     default scenario test matrix: dependency, cleanup, destroy, syntax, create, prepare, converge, idempotence, side_effect, verify, cleanup, destroy
INFO     Running default > dependency
...
INFO     Running default > create
INFO     Running default > converge

PLAY [Converge] ****************************************************************

TASK [Gathering Facts] *********************************************************
ok: [instance]

TASK [Include nginx] ***********************************************************
included: /home/loic/ansible-project/roles/nginx/tasks/main.yml for instance

TASK [Installer nginx] *********************************************************
changed: [instance]

TASK [Démarrer nginx] **********************************************************
changed: [instance]

PLAY RECAP *********************************************************************
instance                   : ok=4    changed=2    unreachable=0    failed=0

INFO     Running default > idempotence

PLAY [Converge] ****************************************************************
...
PLAY RECAP *********************************************************************
instance                   : ok=4    changed=0    unreachable=0    failed=0

INFO     Idempotence completed successfully.
INFO     Running default > verify

PLAY [Verify] ******************************************************************

TASK [Vérifier que nginx est installé] *****************************************
ok: [instance]

TASK [Vérifier que le service nginx est démarré] *******************************
ok: [instance]

TASK [Assert port 80 is listening] *********************************************
ok: [instance]

PLAY RECAP *********************************************************************
instance                   : ok=8    changed=0    unreachable=0    failed=0

INFO     Verifier completed successfully.
INFO     Running default > destroy
INFO     Pruning extra files from scenario ephemeral directory
```

**Commandes individuelles** :

Tu peux exécuter chaque étape séparément. C'est utile pendant le développement pour ne pas tout relancer à chaque modification.

```bash
# Créer les instances de test uniquement
molecule create

# Appliquer le rôle sur les instances (sans créer/détruire)
molecule converge

# Exécuter les tests de vérification uniquement
molecule verify

# Détruire les instances de test
molecule destroy

# Se connecter à une instance pour déboguer
molecule login
```

**Ordre d'utilisation pendant le développement** :

1. `molecule create` : Crée les instances (une seule fois)
2. `molecule converge` : Applique le rôle (à chaque modification du rôle)
3. `molecule verify` : Vérifie le résultat (à chaque modification des tests)
4. `molecule destroy` : Nettoie quand tu as terminé

Cet ordre évite de recréer les instances à chaque test, ce qui accélère le développement.

---

### Étape 13 : Créer un pipeline GitLab CI

**Ce que fait cette étape** : Tu crées un fichier `.gitlab-ci.yml` à la racine de ton projet. GitLab CI exécute ce pipeline automatiquement à chaque commit.

**Remarque** : Cette étape nécessite un serveur GitLab (hébergé ou auto-hébergé). Si tu es en environnement offline, un GitLab auto-hébergé sur ton réseau local est une option. Sinon, passe à l'étape 15 pour la validation locale.

Crée le fichier `.gitlab-ci.yml` à la racine de ton projet :

```yaml
---
# Définition des étapes du pipeline, dans l'ordre d'exécution
stages:
  - lint
  - test
  - deploy

# ============================================================
# Étape 1 : Lint
# Vérifie le formatage YAML et les bonnes pratiques Ansible
# ============================================================
lint:
  stage: lint
  image: python:3.12
  before_script:
    # Installe les outils de lint
    - pip install 'ansible>=14.0,<15.0' ansible-lint yamllint
  script:
    # Vérifie le formatage YAML de tous les fichiers
    - yamllint .
    # Vérifie les bonnes pratiques Ansible
    - ansible-lint

# ============================================================
# Étape 2 : Test
# Exécute les tests Molecule pour chaque rôle
# ============================================================
test-nginx:
  stage: test
  image: python:3.12
  services:
    # Docker-in-Docker : nécessaire pour que Molecule puisse
    # créer des conteneurs Docker à l'intérieur du conteneur CI
    - docker:dind
  variables:
    # URL du démon Docker (Docker-in-Docker)
    DOCKER_HOST: tcp://docker:2375
    DOCKER_TLS_CERTDIR: ""
  before_script:
    - pip install 'ansible>=14.0,<15.0' molecule molecule-plugins[docker]
  script:
    # Exécute les tests Molecule pour le rôle nginx
    - cd roles/nginx && molecule test

# ============================================================
# Étape 3a : Déploiement staging
# Déploie automatiquement sur l'environnement staging
# Se déclenche uniquement sur la branche develop
# ============================================================
deploy-staging:
  stage: deploy
  image: python:3.12
  before_script:
    - pip install 'ansible>=14.0,<15.0'
    # Crée le fichier de mot de passe Vault à partir de la variable CI/CD
    - echo "$VAULT_PASSWORD" > .vault_pass
    # Restreint les permissions du fichier (lecture seule pour le propriétaire)
    - chmod 600 .vault_pass
    # Configure la clé SSH pour la connexion aux serveurs
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_ed25519
    - chmod 600 ~/.ssh/id_ed25519
    # Désactive la vérification de la clé hôte
    # (nécessaire car les serveurs ne sont pas dans known_hosts du runner CI)
    - echo "Host *" > ~/.ssh/config
    - echo "  StrictHostKeyChecking no" >> ~/.ssh/config
  script:
    - ansible-playbook
        -i inventories/staging/hosts.yml
        --vault-password-file .vault_pass
        playbooks/site.yml
  after_script:
    # Supprime les fichiers sensibles après l'exécution
    - rm -f .vault_pass ~/.ssh/id_ed25519
  environment:
    name: staging
  rules:
    # Ce job ne s'exécute que sur la branche develop
    - if: $CI_COMMIT_BRANCH == "develop"

# ============================================================
# Étape 3b : Déploiement production
# Déploiement manuel sur l'environnement production
# Se déclenche uniquement sur la branche main, après approbation
# ============================================================
deploy-production:
  stage: deploy
  image: python:3.12
  before_script:
    - pip install 'ansible>=14.0,<15.0'
    - echo "$VAULT_PASSWORD" > .vault_pass
    - chmod 600 .vault_pass
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_ed25519
    - chmod 600 ~/.ssh/id_ed25519
    - echo "Host *" > ~/.ssh/config
    - echo "  StrictHostKeyChecking no" >> ~/.ssh/config
  script:
    - ansible-playbook
        -i inventories/production/hosts.yml
        --vault-password-file .vault_pass
        playbooks/site.yml
  after_script:
    - rm -f .vault_pass ~/.ssh/id_ed25519
  environment:
    name: production
  rules:
    # Ce job ne s'exécute que sur la branche main
    # "when: manual" signifie qu'un humain doit cliquer sur "Play"
    # dans l'interface GitLab pour déclencher ce job
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
```

**Variables CI/CD à configurer dans GitLab** :

Tu dois configurer ces variables dans GitLab (Settings > CI/CD > Variables). Ces variables ne doivent pas être dans le code source.

| Variable          | Type     | Masquée | Description                                    |
| ----------------- | -------- | ------- | ---------------------------------------------- |
| `VAULT_PASSWORD`  | Variable | Oui     | Mot de passe Ansible Vault                      |
| `SSH_PRIVATE_KEY` | Variable | Oui     | Clé privée SSH pour se connecter aux serveurs   |

**Comment configurer les variables dans GitLab** :

1. Ouvre ton projet dans GitLab
2. Va dans **Settings** > **CI/CD**
3. Développe la section **Variables**
4. Clique **Add variable**
5. Pour chaque variable :
   - **Key** : nom de la variable (ex. `VAULT_PASSWORD`)
   - **Value** : la valeur
   - Coche **Mask variable** pour que la valeur n'apparaisse pas dans les logs
   - Coche **Protect variable** pour limiter aux branches protégées (main, develop)

---

### Étape 14 : Créer un pipeline GitHub Actions

**Ce que fait cette étape** : Tu crées un workflow GitHub Actions équivalent au pipeline GitLab CI.

**Remarque** : GitHub Actions nécessite un compte GitHub et un accès internet. Si tu utilises GitLab auto-hébergé, utilise le pipeline de l'étape 13.

Crée le fichier `.github/workflows/ansible.yml` :

```yaml
---
name: Ansible CI/CD

# Déclenche le pipeline sur push et pull request vers main et develop
on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  # ============================================================
  # Job 1 : Lint
  # ============================================================
  lint:
    name: Lint Ansible
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout du code
        uses: actions/checkout@v5

      - name: Installer Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Installer les outils de lint
        run: pip install 'ansible>=14.0,<15.0' ansible-lint yamllint

      - name: Exécuter yamllint
        run: yamllint .

      - name: Exécuter ansible-lint
        run: ansible-lint

  # ============================================================
  # Job 2 : Test Molecule
  # ============================================================
  test:
    name: Test Molecule
    runs-on: ubuntu-22.04
    # Ce job ne s'exécute que si le job lint a réussi
    needs: lint
    steps:
      - name: Checkout du code
        uses: actions/checkout@v5

      - name: Installer Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Installer Molecule et ses dépendances
        run: pip install 'ansible>=14.0,<15.0' molecule molecule-plugins[docker]

      - name: Exécuter Molecule pour le rôle nginx
        run: cd roles/nginx && molecule test

  # ============================================================
  # Job 3 : Déploiement staging
  # S'exécute uniquement sur push vers develop
  # ============================================================
  deploy-staging:
    name: Deploy Staging
    runs-on: ubuntu-22.04
    needs: test
    if: github.ref == 'refs/heads/develop' && github.event_name == 'push'
    environment: staging
    steps:
      - name: Checkout du code
        uses: actions/checkout@v5

      - name: Installer Python et Ansible
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Installer Ansible
        run: pip install 'ansible>=14.0,<15.0'

      - name: Configurer la clé SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          echo "Host *" > ~/.ssh/config
          echo "  StrictHostKeyChecking no" >> ~/.ssh/config

      - name: Créer le fichier vault password
        run: |
          echo "${{ secrets.VAULT_PASSWORD }}" > .vault_pass
          chmod 600 .vault_pass

      - name: Déployer sur staging
        run: >
          ansible-playbook
          -i inventories/staging/hosts.yml
          --vault-password-file .vault_pass
          playbooks/site.yml

      - name: Nettoyer les fichiers sensibles
        if: always()
        run: rm -f .vault_pass ~/.ssh/id_ed25519

  # ============================================================
  # Job 4 : Déploiement production
  # S'exécute uniquement sur push vers main, avec approbation manuelle
  # ============================================================
  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-22.04
    needs: test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    # L'environment "production" doit avoir une règle de protection
    # dans GitHub (Settings > Environments > production > Required reviewers)
    environment: production
    steps:
      - name: Checkout du code
        uses: actions/checkout@v5

      - name: Installer Python et Ansible
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Installer Ansible
        run: pip install 'ansible>=14.0,<15.0'

      - name: Configurer la clé SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          echo "Host *" > ~/.ssh/config
          echo "  StrictHostKeyChecking no" >> ~/.ssh/config

      - name: Créer le fichier vault password
        run: |
          echo "${{ secrets.VAULT_PASSWORD }}" > .vault_pass
          chmod 600 .vault_pass

      - name: Déployer sur production
        run: >
          ansible-playbook
          -i inventories/production/hosts.yml
          --vault-password-file .vault_pass
          playbooks/site.yml

      - name: Nettoyer les fichiers sensibles
        if: always()
        run: rm -f .vault_pass ~/.ssh/id_ed25519
```

**Secrets GitHub à configurer** :

Configure ces secrets dans GitHub (Settings > Secrets and variables > Actions) :

| Secret             | Description                                    |
| ------------------ | ---------------------------------------------- |
| `VAULT_PASSWORD`   | Mot de passe Ansible Vault                      |
| `SSH_PRIVATE_KEY`  | Clé privée SSH pour se connecter aux serveurs   |

**Approbation manuelle pour la production** :

Pour que le déploiement en production nécessite une approbation :

1. Va dans **Settings** > **Environments**
2. Crée un environment nommé `production`
3. Coche **Required reviewers**
4. Ajoute les personnes autorisées à approuver le déploiement

---

### Étape 15 : Gérer les secrets dans le pipeline

**Ce que fait cette étape** : Tu configures la gestion du mot de passe Ansible Vault dans le pipeline CI/CD.

**Le problème** : Le pipeline CI/CD doit déchiffrer les fichiers chiffrés par Ansible Vault. Le mot de passe Vault ne doit jamais apparaître dans le code source ni dans les logs du pipeline.

**La solution** : Le mot de passe Vault est stocké comme variable secrète dans GitLab CI ou GitHub Actions. Le pipeline crée un fichier temporaire contenant le mot de passe, l'utilise pour le déploiement, puis le supprime.

**Méthode détaillée** :

```bash
# 1. Créer le fichier de mot de passe à partir de la variable d'environnement CI/CD
# $VAULT_PASSWORD est défini comme variable secrète dans GitLab/GitHub
echo "$VAULT_PASSWORD" > .vault_pass

# 2. Restreindre les permissions du fichier
# Seul le propriétaire peut lire le fichier (pas de lecture par le groupe ou les autres)
chmod 600 .vault_pass

# 3. Utiliser le fichier de mot de passe pour le déploiement
ansible-playbook \
    -i inventories/staging/hosts.yml \
    --vault-password-file .vault_pass \
    playbooks/site.yml

# 4. Supprimer le fichier de mot de passe après utilisation
rm -f .vault_pass
```

**Règles de sécurité** :

- Le fichier `.vault_pass` ne doit jamais être commité dans Git. Ajoute-le au `.gitignore` :

```text
# Fichier de mot de passe Vault (ne jamais commiter)
.vault_pass
```

- La variable CI/CD doit être masquée (masked) pour ne pas apparaître dans les logs
- La variable CI/CD doit être protégée (protected) pour n'être accessible que sur les branches protégées (main, develop)

---

### Étape 16 : Configurer la clé SSH dans le pipeline

**Ce que fait cette étape** : Tu configures l'accès SSH depuis le runner CI/CD vers tes serveurs cibles.

**Le problème** : Le runner CI/CD est une machine éphémère qui n'a pas accès à tes serveurs. Il faut lui fournir une clé SSH pour qu'il puisse se connecter.

**La solution** :

**Étape A** : Crée une paire de clés SSH dédiée au CI/CD :

```bash
# Crée une clé SSH dédiée au pipeline CI/CD
# Le commentaire identifie cette clé comme étant utilisée par le CI
ssh-keygen -t ed25519 -C "ci-cd-ansible" -f ~/.ssh/ci_cd_key -N ""
```

**Étape B** : Copie la clé publique sur chaque serveur cible :

```bash
# Copie la clé publique sur les serveurs de staging et production
ssh-copy-id -i ~/.ssh/ci_cd_key.pub deploy@staging-web1
ssh-copy-id -i ~/.ssh/ci_cd_key.pub deploy@production-web1
```

**Étape C** : Stocke la clé privée comme variable CI/CD secrète :

```bash
# Affiche la clé privée pour la copier dans GitLab/GitHub
cat ~/.ssh/ci_cd_key
```

**Étape D** : Copie l'intégralité de la sortie (y compris les lignes `-----BEGIN` et `-----END`) et colle-la comme valeur de la variable `SSH_PRIVATE_KEY` dans les paramètres CI/CD.

**Conseil de sécurité** : Crée un utilisateur dédié (`deploy`) sur chaque serveur cible, avec des permissions limitées. Ne réutilise pas ta clé SSH personnelle pour le CI/CD.

---

### Étape 17 : Validation locale (environnement offline)

**Ce que fait cette étape** : Tu crées un script de validation locale qui reproduit les étapes du pipeline CI/CD, sans nécessiter de serveur CI.

Crée le fichier `scripts/validate.sh` à la racine de ton projet :

```bash
#!/bin/bash
# Script de validation locale pour Ansible
# Reproduit les étapes lint et test du pipeline CI/CD
# Peut être exécuté en environnement offline

set -e  # Arrêter le script à la première erreur

echo "========================================"
echo "  Étape 1/4 : yamllint"
echo "========================================"
yamllint .
echo "yamllint : OK"
echo ""

echo "========================================"
echo "  Étape 2/4 : ansible-lint"
echo "========================================"
ansible-lint
echo "ansible-lint : OK"
echo ""

echo "========================================"
echo "  Étape 3/4 : syntax-check"
echo "========================================"
# Vérifie la syntaxe de chaque playbook
for playbook in playbooks/*.yml; do
    echo "  Vérification de $playbook..."
    ansible-playbook "$playbook" --syntax-check
done
echo "syntax-check : OK"
echo ""

echo "========================================"
echo "  Étape 4/4 : Molecule (rôles)"
echo "========================================"
# Teste chaque rôle qui contient un scénario Molecule
for role_dir in roles/*/; do
    if [ -d "${role_dir}molecule" ]; then
        role_name=$(basename "$role_dir")
        echo "  Test du rôle $role_name..."
        (cd "$role_dir" && molecule test)
    fi
done
echo "Molecule : OK"
echo ""

echo "========================================"
echo "  Toutes les validations ont réussi"
echo "========================================"
```

Rends le script exécutable :

```bash
chmod +x scripts/validate.sh
```

Exécute le script :

```bash
./scripts/validate.sh
```

**Résultat attendu** :

```text
========================================
  Étape 1/4 : yamllint
========================================
yamllint : OK

========================================
  Étape 2/4 : ansible-lint
========================================
ansible-lint : OK

========================================
  Étape 3/4 : syntax-check
========================================
  Vérification de playbooks/site.yml...
playbook: playbooks/site.yml
syntax-check : OK

========================================
  Étape 4/4 : Molecule (rôles)
========================================
  Test du rôle nginx...
...
Molecule : OK

========================================
  Toutes les validations ont réussi
========================================
```

**Utilisation recommandée** : Exécute ce script avant chaque commit. Tu peux aussi le configurer comme hook pre-commit Git pour qu'il s'exécute automatiquement :

```bash
# Crée un hook pre-commit qui exécute la validation
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Hook pre-commit : valide le code Ansible avant chaque commit
echo "Exécution de la validation Ansible..."
./scripts/validate.sh
EOF

# Rends le hook exécutable
chmod +x .git/hooks/pre-commit
```

---

## Commandes Utiles

| Commande                                      | Action                                                        |
| --------------------------------------------- | ------------------------------------------------------------- |
| `pip install ansible-lint yamllint`            | Installer les outils de lint                                  |
| `pip install molecule molecule-plugins[docker]`| Installer Molecule avec le driver Docker                      |
| `ansible-lint`                                 | Analyser tous les fichiers Ansible du projet                  |
| `ansible-lint playbooks/site.yml`              | Analyser un playbook spécifique                                |
| `ansible-lint roles/`                          | Analyser tous les rôles                                        |
| `yamllint .`                                   | Vérifier le formatage YAML de tous les fichiers                |
| `ansible-playbook playbooks/site.yml --syntax-check` | Vérifier la syntaxe d'un playbook                       |
| `molecule init scenario --driver-name docker`  | Initialiser un scénario Molecule dans un rôle                  |
| `molecule test`                                | Exécuter le cycle complet : create, converge, verify, destroy  |
| `molecule create`                              | Créer les instances de test uniquement                         |
| `molecule converge`                            | Appliquer le rôle sur les instances                            |
| `molecule verify`                              | Exécuter les tests de vérification uniquement                  |
| `molecule destroy`                             | Détruire les instances de test                                 |
| `molecule login`                               | Se connecter à une instance pour déboguer                      |
| `molecule list`                                | Lister les instances et leur état                              |

---

## Pièges Fréquents

### Piège 1 : Oublier d'installer Ansible dans l'image CI

**Problème** : Le pipeline échoue avec `ansible-playbook: command not found`. L'image Docker utilisée par le runner CI (par exemple `python:3.12`) ne contient pas Ansible par défaut.

**Solution** : Ajoute toujours `pip install 'ansible>=14.0,<15.0'` dans la section `before_script` de chaque job qui utilise Ansible (borne alignée sur Ansible 14 / core 2.21).

```yaml
# ❌ Incorrect : Ansible n'est pas installé
script:
  - ansible-playbook playbooks/site.yml

# ✅ Correct : Ansible est installé avant utilisation
before_script:
  - pip install 'ansible>=14.0,<15.0'
script:
  - ansible-playbook playbooks/site.yml
```

---

### Piège 2 : Mot de passe Vault non disponible dans le pipeline

**Problème** : Le pipeline échoue avec `ERROR! Attempting to decrypt but no vault secrets found`. Le playbook utilise des fichiers chiffrés avec Vault, mais le mot de passe n'est pas accessible dans le pipeline.

**Solution** : Configure la variable `VAULT_PASSWORD` dans les paramètres CI/CD (GitLab : Settings > CI/CD > Variables ; GitHub : Settings > Secrets) et crée le fichier `.vault_pass` dans le pipeline.

```yaml
before_script:
  # Crée le fichier de mot de passe à partir de la variable CI/CD
  - echo "$VAULT_PASSWORD" > .vault_pass
  - chmod 600 .vault_pass
script:
  - ansible-playbook --vault-password-file .vault_pass playbooks/site.yml
after_script:
  # Supprime le fichier après utilisation
  - rm -f .vault_pass
```

---

### Piège 3 : Clés SSH non configurées pour les étapes de déploiement

**Problème** : Le pipeline échoue avec `Permission denied (publickey)` ou `Host key verification failed`. Le runner CI ne possède pas de clé SSH pour se connecter aux serveurs cibles.

**Solution** : Stocke la clé privée SSH comme variable CI/CD secrète et configure-la dans le pipeline (voir étape 16).

---

### Piège 4 : Molecule nécessite Docker-in-Docker dans le CI

**Problème** : Molecule échoue avec `Cannot connect to the Docker daemon` dans le pipeline CI. Le runner CI s'exécute lui-même dans un conteneur Docker, et Molecule essaie de créer des conteneurs à l'intérieur de ce conteneur.

**Solution (GitLab CI)** : Active le service `docker:dind` (Docker-in-Docker) et configure la variable `DOCKER_HOST`.

```yaml
test:
  stage: test
  image: python:3.12
  services:
    # Active Docker-in-Docker
    - docker:dind
  variables:
    # Indique à Docker de se connecter au service dind
    DOCKER_HOST: tcp://docker:2375
    DOCKER_TLS_CERTDIR: ""
  script:
    - pip install 'ansible>=14.0,<15.0' molecule molecule-plugins[docker]
    - cd roles/nginx && molecule test
```

**Solution (GitHub Actions)** : Docker est déjà disponible sur les runners `ubuntu-22.04`. Aucune configuration supplémentaire n'est nécessaire.

---

### Piège 5 : Règles ansible-lint trop strictes au démarrage

**Problème** : Tu lances `ansible-lint` sur un projet existant et tu obtiens des centaines d'erreurs. Cela peut être décourageant et ralentir l'adoption de l'outil.

**Solution** : Commence avec un profil permissif et augmente progressivement la rigueur.

```yaml
# .ansible-lint - Phase 1 : Adoption progressive
---
profile: min
skip_list:
  - yaml[line-length]
  - name[casing]
warn_list:
  - fqcn[action-core]
  - command-instead-of-module
```

Après avoir corrigé toutes les erreurs du profil `min`, passe au profil `basic`, puis `moderate`, puis `production`.

| Phase   | Profil       | Objectif                                          |
| ------- | ------------ | ------------------------------------------------- |
| Phase 1 | `min`        | Corriger les erreurs les plus graves               |
| Phase 2 | `basic`      | Ajouter les règles de base                         |
| Phase 3 | `moderate`   | Appliquer les bonnes pratiques courantes           |
| Phase 4 | `production` | Appliquer toutes les règles pour la production     |

---

### Piège 6 : Déploiement en production sans approbation manuelle

**Problème** : Le pipeline déploie automatiquement en production à chaque merge sur `main`. Un merge accidentel ou une erreur non détectée par les tests cause un incident en production.

**Solution** : Le déploiement en production doit toujours nécessiter une action manuelle.

- **GitLab CI** : Ajoute `when: manual` au job de déploiement production.
- **GitHub Actions** : Configure un environment `production` avec `Required reviewers`.

Cette règle est non négociable. Aucun déploiement en production ne doit être entièrement automatique.

---

## Checklist de Validation

- [ ] J'ai installé `ansible-lint` et `yamllint` sur ma machine
- [ ] J'ai créé les fichiers de configuration `.ansible-lint` et `.yamllint`
- [ ] J'ai exécuté `ansible-lint` sur mes playbooks et corrigé toutes les erreurs
- [ ] J'ai exécuté `yamllint` et corrigé les erreurs de formatage
- [ ] J'ai exécuté `ansible-playbook --syntax-check` sans erreur
- [ ] J'ai installé Molecule avec le driver Docker
- [ ] J'ai initialisé un scénario Molecule pour au moins un rôle
- [ ] J'ai écrit des tests de vérification dans `verify.yml`
- [ ] La commande `molecule test` passe avec succès (create, converge, idempotence, verify, destroy)
- [ ] J'ai créé un fichier de pipeline CI/CD (`.gitlab-ci.yml` ou `.github/workflows/ansible.yml`)
- [ ] Le pipeline contient les étapes lint, test et deploy (staging + production)
- [ ] Le déploiement en production nécessite une approbation manuelle
- [ ] Les secrets (vault password, clé SSH) sont stockés comme variables CI/CD, pas dans le code

---

## Exercice Pratique

**Énoncé** : Configure un environnement de validation complet pour ton projet Ansible existant. L'exercice comporte 5 parties.

**Partie 1 : Lint**

1. Crée les fichiers de configuration `.yamllint` et `.ansible-lint` à la racine de ton projet
2. Exécute `yamllint .` et corrige toutes les erreurs
3. Exécute `ansible-lint` et corrige toutes les erreurs

**Partie 2 : Molecule**

1. Initialise un scénario Molecule pour ton rôle `nginx` (ou un rôle de ton choix)
2. Écris un fichier `verify.yml` qui vérifie les conditions suivantes :
   - Le paquet nginx est installé
   - Le service nginx est en état `running`
   - Le port 80 est en écoute
3. Exécute `molecule test` et vérifie que tout passe

**Partie 3 : Pipeline CI/CD**

1. Crée un fichier `.gitlab-ci.yml` ou `.github/workflows/ansible.yml` avec les étapes suivantes :
   - Stage `lint` : yamllint + ansible-lint
   - Stage `test` : molecule test pour le rôle nginx
   - Stage `deploy-staging` : déploiement automatique sur staging (branche develop)
   - Stage `deploy-production` : déploiement manuel sur production (branche main)

**Partie 4 : Gestion des secrets**

1. Assure-toi que `.vault_pass` est dans le `.gitignore`
2. Documente les variables CI/CD nécessaires (`VAULT_PASSWORD`, `SSH_PRIVATE_KEY`) dans un fichier `README.md` ou dans les commentaires du pipeline

**Partie 5 : Validation locale**

1. Crée le script `scripts/validate.sh` qui exécute yamllint, ansible-lint, syntax-check et molecule test
2. Exécute le script et vérifie que toutes les étapes passent

**Résultat attendu** :

- `yamllint .` ne retourne aucune erreur
- `ansible-lint` ne retourne aucune erreur
- `molecule test` passe avec succès (toutes les assertions de `verify.yml` sont vertes)
- Le fichier de pipeline CI/CD est syntaxiquement correct
- Le script `scripts/validate.sh` se termine avec le message "Toutes les validations ont réussi"

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Partie 1 : Fichiers de configuration lint**

**Fichier `.yamllint`** :

```yaml
---
rules:
  line-length:
    max: 200
    level: warning
  indentation:
    spaces: 2
    indent-sequences: true
    check-multi-line-strings: false
  trailing-spaces: enable
  new-line-at-end-of-file: enable
  empty-lines:
    max: 2
  truthy:
    allowed-values:
      - "true"
      - "false"
    check-keys: false
```

**Fichier `.ansible-lint`** :

```yaml
---
skip_list:
  - yaml[line-length]
warn_list:
  - command-instead-of-module
  - name[casing]
exclude_paths:
  - .cache/
  - .github/
  - .gitlab/
profile: moderate
```

---

**Partie 2 : Scénario Molecule**

**Initialisation** :

```bash
cd roles/nginx
molecule init scenario --driver-name docker
```

**Fichier `roles/nginx/molecule/default/molecule.yml`** :

```yaml
---
driver:
  name: docker

platforms:
  - name: instance
    image: ubuntu:22.04
    pre_build_image: true
    command: /sbin/init
    privileged: true
    volumes:
      - /sys/fs/cgroup:/sys/fs/cgroup:rw
    cgroupns_mode: host

provisioner:
  name: ansible

verifier:
  name: ansible
```

**Fichier `roles/nginx/molecule/default/converge.yml`** :

```yaml
---
- name: Converge
  hosts: all
  become: true
  tasks:
    - name: "Include nginx"
      ansible.builtin.include_role:
        name: nginx
```

**Fichier `roles/nginx/molecule/default/verify.yml`** :

```yaml
---
- name: Verify
  hosts: all
  gather_facts: true
  tasks:
    - name: Vérifier que nginx est installé
      ansible.builtin.command: nginx -v
      register: nginx_version
      changed_when: false

    - name: Afficher la version de nginx
      ansible.builtin.debug:
        msg: "Nginx version : {{ nginx_version.stderr }}"

    - name: Récupérer la liste des services
      ansible.builtin.service_facts:

    - name: Vérifier que le service nginx est démarré
      ansible.builtin.assert:
        that:
          - "'nginx.service' in ansible_facts.services"
          - "ansible_facts.services['nginx.service'].state == 'running'"
        fail_msg: "nginx n'est pas démarré"
        success_msg: "nginx est démarré correctement"

    - name: Vérifier que le port 80 est en écoute
      ansible.builtin.command: ss -tlnp
      register: listening_ports
      changed_when: false

    - name: Assert port 80 is listening
      ansible.builtin.assert:
        that:
          - "':80' in listening_ports.stdout"
        fail_msg: "Le port 80 n'est pas en écoute"
        success_msg: "Le port 80 est en écoute"

    - name: Vérifier que la page par défaut répond
      ansible.builtin.uri:
        url: http://localhost
        status_code: 200
      register: nginx_response

    - name: Assert la page par défaut répond en HTTP 200
      ansible.builtin.assert:
        that:
          - nginx_response.status == 200
        fail_msg: "nginx ne répond pas sur http://localhost"
        success_msg: "nginx répond correctement sur http://localhost"
```

**Exécution** :

```bash
cd roles/nginx
molecule test
```

---

**Partie 3 : Pipeline GitLab CI**

**Fichier `.gitlab-ci.yml`** :

```yaml
---
stages:
  - lint
  - test
  - deploy

lint:
  stage: lint
  image: python:3.12
  before_script:
    - pip install 'ansible>=14.0,<15.0' ansible-lint yamllint
  script:
    - yamllint .
    - ansible-lint

test-nginx:
  stage: test
  image: python:3.12
  services:
    - docker:dind
  variables:
    DOCKER_HOST: tcp://docker:2375
    DOCKER_TLS_CERTDIR: ""
  before_script:
    - pip install 'ansible>=14.0,<15.0' molecule molecule-plugins[docker]
  script:
    - cd roles/nginx && molecule test

deploy-staging:
  stage: deploy
  image: python:3.12
  before_script:
    - pip install 'ansible>=14.0,<15.0'
    - echo "$VAULT_PASSWORD" > .vault_pass
    - chmod 600 .vault_pass
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_ed25519
    - chmod 600 ~/.ssh/id_ed25519
    - echo "Host *" > ~/.ssh/config
    - echo "  StrictHostKeyChecking no" >> ~/.ssh/config
  script:
    - ansible-playbook
        -i inventories/staging/hosts.yml
        --vault-password-file .vault_pass
        playbooks/site.yml
  after_script:
    - rm -f .vault_pass ~/.ssh/id_ed25519
  environment:
    name: staging
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"

deploy-production:
  stage: deploy
  image: python:3.12
  before_script:
    - pip install 'ansible>=14.0,<15.0'
    - echo "$VAULT_PASSWORD" > .vault_pass
    - chmod 600 .vault_pass
    - mkdir -p ~/.ssh
    - echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_ed25519
    - chmod 600 ~/.ssh/id_ed25519
    - echo "Host *" > ~/.ssh/config
    - echo "  StrictHostKeyChecking no" >> ~/.ssh/config
  script:
    - ansible-playbook
        -i inventories/production/hosts.yml
        --vault-password-file .vault_pass
        playbooks/site.yml
  after_script:
    - rm -f .vault_pass ~/.ssh/id_ed25519
  environment:
    name: production
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
```

---

**Partie 4 : Gestion des secrets**

Ajoute cette ligne au fichier `.gitignore` à la racine du projet :

```text
# Mot de passe Ansible Vault (ne jamais commiter)
.vault_pass
```

---

**Partie 5 : Script de validation locale**

**Fichier `scripts/validate.sh`** :

```bash
#!/bin/bash
# Script de validation locale pour Ansible
# Reproduit les étapes lint et test du pipeline CI/CD
# Peut être exécuté en environnement offline (si les images Docker sont en cache)

set -e

echo "========================================"
echo "  Étape 1/4 : yamllint"
echo "========================================"
yamllint .
echo "yamllint : OK"
echo ""

echo "========================================"
echo "  Étape 2/4 : ansible-lint"
echo "========================================"
ansible-lint
echo "ansible-lint : OK"
echo ""

echo "========================================"
echo "  Étape 3/4 : syntax-check"
echo "========================================"
for playbook in playbooks/*.yml; do
    echo "  Vérification de $playbook..."
    ansible-playbook "$playbook" --syntax-check
done
echo "syntax-check : OK"
echo ""

echo "========================================"
echo "  Étape 4/4 : Molecule (rôles)"
echo "========================================"
for role_dir in roles/*/; do
    if [ -d "${role_dir}molecule" ]; then
        role_name=$(basename "$role_dir")
        echo "  Test du rôle $role_name..."
        (cd "$role_dir" && molecule test)
    fi
done
echo "Molecule : OK"
echo ""

echo "========================================"
echo "  Toutes les validations ont réussi"
echo "========================================"
```

**Rendre le script exécutable et l'exécuter** :

```bash
chmod +x scripts/validate.sh
./scripts/validate.sh
```

**Structure finale du projet** :

```text
ansible-project/
├── .ansible-lint                        # Configuration ansible-lint
├── .gitignore                           # Inclut .vault_pass
├── .gitlab-ci.yml                       # Pipeline GitLab CI
├── .yamllint                            # Configuration yamllint
├── inventories/
│   ├── production/
│   │   └── hosts.yml
│   └── staging/
│       └── hosts.yml
├── playbooks/
│   └── site.yml
├── roles/
│   └── nginx/
│       ├── defaults/
│       │   └── main.yml
│       ├── handlers/
│       │   └── main.yml
│       ├── molecule/
│       │   └── default/
│       │       ├── converge.yml         # Applique le rôle
│       │       ├── molecule.yml         # Configuration Molecule
│       │       └── verify.yml           # Tests de vérification
│       ├── tasks/
│       │   └── main.yml
│       └── templates/
└── scripts/
    └── validate.sh                      # Script de validation locale
```

---

## Navigation

← Fiche précédente : **[Gestion Multi-Environnement](13-gestion-multi-environnement.md)**
