---
tags:
  - Ansible
  - Avancé
  - Pratique
description: "Ansible Galaxy"
estimated_time: "170 min"
fiche_number: 11
total_fiches: 14
cursus: "Ansible"
---

# 11 - Ansible Galaxy

> **En bref** : À la fin de cette fiche, tu sauras rechercher, installer et utiliser des rôles et collections Ansible Galaxy dans tes projets. Lecture estimée : 170 min.


## Prérequis

- [Fiches 01 à 10](../index.md) lues et comprises
- Ansible installé et fonctionnel sur ta machine de contrôle
- Savoir créer et utiliser des rôles Ansible ([fiche 10](10-roles.md))
- Savoir utiliser le terminal (commandes `cd`, `ls`, `mkdir`, `cp`)
- **Connexion internet requise** pour les étapes 1 à 5, 7 et 10. Les étapes 6 et 8 sont réalisables offline. L'étape 9 explique la procédure offline complète.

## Objectif de cette fiche

À la fin de cette fiche, tu sauras rechercher, installer et utiliser des rôles et collections Ansible Galaxy dans tes projets.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'Ansible Galaxy ?

**Définition** : Ansible Galaxy est une plateforme communautaire accessible à l'adresse `galaxy.ansible.com` qui héberge des rôles et des collections Ansible prêts à l'emploi, partagés par la communauté.

**Le problème qu'Ansible Galaxy résout** :

Sans Ansible Galaxy, voici les problèmes rencontrés :

1. **Réinvention de la roue** : Tu dois écrire toi-même chaque rôle depuis zéro, même pour des tâches courantes comme installer Nginx, configurer PostgreSQL ou gérer des utilisateurs. Des milliers d'administrateurs ont déjà résolu ces problèmes avant toi.

2. **Temps de développement** : Écrire un rôle complet, testé et compatible avec plusieurs distributions Linux prend des heures, voire des jours. Multiplié par le nombre de rôles nécessaires dans un projet, le temps s'accumule.

3. **Maintenance en solitaire** : Tu dois maintenir et corriger tes rôles toi-même. Quand une nouvelle version de Debian ou de Nginx sort, tu dois adapter chaque rôle manuellement.

4. **Pas de standardisation** : Sans référence commune, chaque équipe écrit ses rôles différemment. Les conventions varient, les structures diffèrent, la réutilisation est difficile.

**Comment Ansible Galaxy résout ces problèmes** :

| Problème | Solution apportée par Ansible Galaxy |
| --- | --- |
| Réinvention de la roue | Des milliers de rôles prêts à l'emploi, testés par la communauté |
| Temps de développement | Installation en une commande. Tu paramètres le rôle au lieu de l'écrire |
| Maintenance en solitaire | Les auteurs maintiennent les rôles. Les mises à jour sont publiées régulièrement |
| Pas de standardisation | Galaxy impose une structure standard pour les rôles et les collections |

**Analogie concrète** : Galaxy est comme un magasin de pièces détachées standardisées pour Ansible. Au lieu de fabriquer chaque pièce toi-même (rôle Nginx, rôle PostgreSQL, rôle pare-feu), tu achètes des pièces prêtes à l'emploi, fabriquées par des spécialistes, et tu les assembles dans ton projet. Tu choisis la taille et la couleur (les variables du rôle), mais tu ne refais pas la pièce entière.

**Ce qu'Ansible Galaxy n'est PAS** :

- Ansible Galaxy n'est pas la même chose que la commande `ansible-galaxy`. Galaxy est la _plateforme web_ (le magasin). `ansible-galaxy` est l'_outil en ligne de commande_ (le client) qui interagit avec cette plateforme. La commande `ansible-galaxy` peut aussi créer des rôles locaux, sans jamais contacter la plateforme.
- Ansible Galaxy n'est pas un outil d'exécution. Galaxy ne lance aucune tâche sur tes serveurs. Il fournit des rôles et des collections que tu utilises ensuite dans tes playbooks.
- Ansible Galaxy n'est pas un dépôt privé. Tout ce qui est publié sur Galaxy est public et accessible à tous. Pour un usage privé, il faut utiliser Ansible Automation Hub ou un dépôt Pulp (voir la section "Alternatives offline").

**Comparaison Galaxy vs rôles locaux** :

| Critère | Rôle Galaxy (téléchargé) | Rôle local (écrit à la main) |
| --- | --- | --- |
| Temps de mise en place | Quelques secondes (une commande) | Heures ou jours |
| Personnalisation | Via les variables du rôle | Totale (tu contrôles chaque ligne) |
| Maintenance | Assurée par l'auteur et la communauté | Assurée par toi seul |
| Compatibilité multi-OS | Souvent incluse (Debian, Ubuntu, Red Hat) | Tu dois la coder toi-même |
| Connexion internet | Requise au téléchargement | Non requise |
| Contrôle du code | Tu dépends d'un tiers | Tu maîtrises tout |

---

### Qu'est-ce qu'une collection Ansible ?

**Définition** : Une collection Ansible est un package de distribution qui regroupe des rôles, des modules, des plugins et de la documentation dans un seul paquet installable. Le format d'une collection est `namespace.nom_collection` (par exemple `community.general`, `ansible.posix`).

**Le problème que les collections résolvent** :

Sans collections, voici les problèmes rencontrés :

1. **Rôles isolés** : Avant les collections, chaque rôle était distribué individuellement sur Galaxy. Un projet utilisant 15 rôles nécessitait 15 installations séparées, sans lien entre eux.

2. **Modules éparpillés** : Les modules custom (non inclus dans Ansible core) n'avaient pas de mécanisme de distribution standardisé. Les utilisateurs devaient copier des fichiers manuellement.

3. **Pas de versioning cohérent** : Chaque rôle avait son propre numéro de version. Impossible de garantir la compatibilité entre un rôle et un module custom du même auteur.

**Comment les collections résolvent ces problèmes** :

| Problème | Solution apportée par les collections |
| --- | --- |
| Rôles isolés | Une collection regroupe plusieurs rôles liés dans un seul paquet |
| Modules éparpillés | Les modules custom sont inclus dans la collection et installés automatiquement |
| Pas de versioning cohérent | La collection a un numéro de version unique. Tous ses composants sont compatibles entre eux |

**Analogie concrète** : Si un rôle est un outil individuel (un tournevis, une clé), une collection est une boîte à outils complète (un coffret de mécanique). Le coffret contient des tournevis, des clés, des embouts, et un mode d'emploi. Tout est vendu ensemble, compatible, et versionné. Tu sais que le coffret version 3.0 contient tous les outils mis à jour.

**Ce qu'une collection n'est PAS** :

- Une collection n'est pas un simple rôle renommé. Une collection _peut_ contenir des rôles, mais elle contient aussi des modules, des plugins de filtre, des plugins de lookup, et d'autres composants qu'un rôle seul ne peut pas distribuer.
- Une collection n'est pas obligatoire. Tu peux continuer à utiliser des rôles individuels. Les collections sont le format de distribution _recommandé_ depuis Ansible 2.10, mais les rôles classiques fonctionnent toujours.

**Comparaison rôle vs collection** :

| Critère | Rôle | Collection |
| --- | --- | --- |
| Contenu | Tâches, handlers, templates, variables | Rôles + modules + plugins + documentation |
| Format de nom | `auteur.nom_role` | `namespace.nom_collection` |
| Installation | `ansible-galaxy install auteur.role` | `ansible-galaxy collection install namespace.collection` |
| Emplacement par défaut | `~/.ansible/roles/` | `~/.ansible/collections/` |
| Versioning | Version du rôle uniquement | Version unique pour tous les composants |
| Depuis quand | Ansible 1.x | Ansible 2.10 (2020) |

**Exemples de collections courantes** :

| Collection | Contenu | Usage |
| --- | --- | --- |
| `ansible.builtin` | Modules de base (copy, file, apt, yum, service) | Incluse par défaut dans Ansible |
| `ansible.posix` | Modules POSIX (acl, at, cron, sysctl) | Gestion système Linux/Unix |
| `community.general` | Modules communautaires variés (timezone, ufw, npm) | Outillage général |
| `community.postgresql` | Modules PostgreSQL (postgresql_db, postgresql_user) | Gestion de bases PostgreSQL |
| `community.docker` | Modules Docker (docker_container, docker_image) | Gestion de conteneurs Docker |

---

### Qu'est-ce que le fichier requirements.yml ?

**Définition** : Le fichier `requirements.yml` est un fichier YAML qui liste toutes les dépendances Galaxy d'un projet (rôles et collections), avec leurs versions. Il permet d'installer toutes les dépendances en une seule commande.

**Le problème que le fichier requirements.yml résout** :

Sans fichier requirements.yml, voici les problèmes rencontrés :

1. **Installation manuelle** : Chaque membre de l'équipe doit connaître et exécuter manuellement chaque commande `ansible-galaxy install` pour installer les dépendances. Si le projet utilise 10 rôles et 5 collections, ce sont 15 commandes à taper.

2. **Pas de reproductibilité** : Sans liste écrite des dépendances, deux machines peuvent avoir des versions différentes des mêmes rôles. Un rôle mis à jour sur la machine de ton collègue peut ne pas fonctionner sur la tienne.

3. **Documentation implicite** : Les dépendances du projet ne sont documentées nulle part. Un nouveau membre de l'équipe ne sait pas quels rôles installer.

**Comment le fichier requirements.yml résout ces problèmes** :

| Problème | Solution apportée par requirements.yml |
| --- | --- |
| Installation manuelle | Une seule commande installe tout : `ansible-galaxy install -r requirements.yml` |
| Pas de reproductibilité | Les versions sont épinglées. Tout le monde installe la même version |
| Documentation implicite | Le fichier requirements.yml _est_ la liste des dépendances. Il se lit comme une table des matières |

**Analogie concrète** : Le fichier `requirements.yml` est la liste de courses du projet. Au lieu de se souvenir de mémoire de ce qu'il faut acheter (installer), tu écris une liste précise avec le nom du produit et la quantité exacte (la version). N'importe qui peut prendre cette liste et revenir avec exactement les mêmes produits.

**Comparaison avec d'autres gestionnaires de dépendances** :

| Outil | Fichier de dépendances | Commande d'installation |
| --- | --- | --- |
| Ansible Galaxy | `requirements.yml` | `ansible-galaxy install -r requirements.yml` |
| npm (Node.js) | `package.json` | `npm install` |
| pip (Python) | `requirements.txt` | `pip install -r requirements.txt` |
| Composer (PHP) | `composer.json` | `composer install` |

---

### Alternatives offline

**Définition** : Les alternatives offline sont des méthodes pour utiliser des rôles et collections Galaxy dans un environnement sans connexion internet.

**Le problème que les alternatives offline résolvent** :

Sans alternative offline, voici les problèmes rencontrés :

1. **Blocage total** : Si ta machine de contrôle n'a pas accès à internet, tu ne peux ni rechercher ni installer de rôles Galaxy. La commande `ansible-galaxy install` échoue.

2. **Environnements sécurisés** : Les environnements de production sont souvent isolés du réseau internet pour des raisons de sécurité. Installer des rôles depuis Galaxy est impossible.

**Comment les alternatives offline résolvent ces problèmes** :

| Problème | Solution offline |
| --- | --- |
| Blocage total | Télécharger les rôles sur une machine connectée, puis les transférer via clé USB ou partage réseau |
| Environnements sécurisés | Héberger un serveur Galaxy privé (Automation Hub, Pulp) sur le réseau interne |

**Les trois méthodes offline** :

| Méthode | Complexité | Quand l'utiliser |
| --- | --- | --- |
| Transfert manuel (clé USB / archive) | Faible | Projet ponctuel, peu de dépendances |
| Rôles stockés directement dans le projet | Faible | Projet versionné dans Git, rôles stables |
| Serveur Galaxy privé (Automation Hub, Pulp) | Élevée | Entreprise, nombreux projets, mises à jour fréquentes |

**Méthode 1 : Transfert manuel**

1. Sur une machine avec internet, télécharge les rôles et collections
2. Copie le dossier téléchargé sur une clé USB ou une archive
3. Sur la machine offline, copie les fichiers dans le projet

**Méthode 2 : Rôles dans le projet**

Place les rôles directement dans le dossier `roles/` du projet. Ansible les trouve automatiquement sans téléchargement. C'est la méthode la plus simple pour un environnement offline permanent.

**Méthode 3 : Serveur Galaxy privé**

Installe un serveur Ansible Automation Hub ou Pulp sur ton réseau interne. Ce serveur sert de miroir local de Galaxy. Les commandes `ansible-galaxy` sont configurées pour pointer vers ce serveur au lieu de `galaxy.ansible.com`.

---

## Étapes Pratiques

### Étape 1 : Rechercher un rôle sur Galaxy

La commande `ansible-galaxy search` interroge la plateforme Galaxy pour trouver des rôles correspondant à un mot-clé.

**Cette étape nécessite une connexion internet.**

Commande :

```bash
# Recherche tous les rôles contenant le mot "nginx"
ansible-galaxy search nginx
```

**Résultat attendu** :

```text
Found 349 roles matching your search:

 Name                                   Description
 ----                                   -----------
 0x5a17ed.ansible_role_nginx            Ansible role for managing nginx
 1it.nginx                              Install and configure nginx
 aanno.nginx                            Nginx installation for CentOS/RHEL
 abdennour.nginx                        Nginx Role
 ...
 geerlingguy.nginx                      Nginx installation for Linux
 ...
```

Le nombre de résultats et la liste exacte varient dans le temps. Le rôle `geerlingguy.nginx` est l'un des plus populaires et les mieux maintenus.

**Filtrer par plateforme** :

```bash
# Recherche les rôles nginx compatibles avec Ubuntu
ansible-galaxy search nginx --platforms Ubuntu
```

**Résultat attendu** :

```text
Found 187 roles matching your search:

 Name                                   Description
 ----                                   -----------
 geerlingguy.nginx                      Nginx installation for Linux
 ...
```

Le filtre `--platforms` réduit les résultats aux rôles qui déclarent la compatibilité avec la plateforme spécifiée.

**Autres options de recherche utiles** :

| Option | Action | Exemple |
| --- | --- | --- |
| `--author` | Filtre par auteur | `ansible-galaxy search nginx --author geerlingguy` |
| `--platforms` | Filtre par plateforme | `ansible-galaxy search nginx --platforms Debian` |
| `--galaxy-tags` | Filtre par tag | `ansible-galaxy search nginx --galaxy-tags web` |

---

### Étape 2 : Obtenir des informations sur un rôle

Avant d'installer un rôle, consulte ses métadonnées pour vérifier qu'il correspond à tes besoins.

**Cette étape nécessite une connexion internet.**

Commande :

```bash
# Affiche les métadonnées du rôle geerlingguy.nginx
ansible-galaxy info geerlingguy.nginx
```

**Résultat attendu** :

```text
Role: geerlingguy.nginx
        description: Nginx installation for Linux
        active: True
        commit: xxxxxxx
        commit_message: ...
        company: Midwestern Mac, LLC
        created: 2013-10-31T00:00:00.000000Z
        download_count: 12345678
        github_branch: master
        github_repo: ansible-role-nginx
        github_user: geerlingguy
        license: license (BSD, MIT)
        min_ansible_version: 2.4
        modified: 2024-01-15T00:00:00.000000Z
        platforms: [{'name': 'Debian', 'versions': ['all']}, {'name': 'Ubuntu', 'versions': ['all']}, ...]
        ...
```

**Informations à vérifier avant d'installer un rôle** :

| Information | Pourquoi c'est important |
| --- | --- |
| `platforms` | Vérifie que ta distribution Linux est supportée |
| `min_ansible_version` | Vérifie que ta version d'Ansible est suffisante |
| `download_count` | Un nombre élevé indique un rôle populaire et éprouvé |
| `modified` | Une date récente indique un rôle activement maintenu |
| `license` | Vérifie que la licence est compatible avec ton usage |

---

### Étape 3 : Installer un rôle

La commande `ansible-galaxy install` télécharge un rôle depuis Galaxy et l'installe localement.

**Cette étape nécessite une connexion internet.**

**Installation dans le répertoire par défaut** :

```bash
# Installe le rôle geerlingguy.nginx dans le répertoire par défaut
ansible-galaxy install geerlingguy.nginx
```

**Résultat attendu** :

```text
Starting galaxy role install process
- downloading role 'nginx', owned by geerlingguy
- downloading role from https://github.com/geerlingguy/ansible-role-nginx/archive/3.2.0.tar.gz
- extracting geerlingguy.nginx to /home/user/.ansible/roles/geerlingguy.nginx
- geerlingguy.nginx (3.2.0) was installed successfully
```

Le rôle est installé dans `~/.ansible/roles/` par défaut. Ce répertoire est celui qu'Ansible consulte automatiquement quand tu références un rôle dans un playbook.

**Installation dans le dossier du projet** :

```bash
# Installe le rôle dans le dossier roles/ du projet courant
ansible-galaxy install geerlingguy.nginx -p roles/
```

**Résultat attendu** :

```text
Starting galaxy role install process
- downloading role 'nginx', owned by geerlingguy
- downloading role from https://github.com/geerlingguy/ansible-role-nginx/archive/3.2.0.tar.gz
- extracting geerlingguy.nginx to /home/user/mon-projet/roles/geerlingguy.nginx
- geerlingguy.nginx (3.2.0) was installed successfully
```

L'option `-p roles/` installe le rôle dans le dossier `roles/` du répertoire courant. C'est la méthode recommandée pour les projets versionnés dans Git, car le rôle est inclus dans le dépôt.

**Installation d'une version spécifique** :

```bash
# Installe une version précise du rôle
ansible-galaxy install geerlingguy.nginx,3.2.0
```

La virgule suivie du numéro de version force l'installation de cette version exacte, au lieu de la dernière version disponible.

**Répertoires d'installation par défaut** :

| Type | Répertoire par défaut | Configurable via |
| --- | --- | --- |
| Rôle | `~/.ansible/roles/` | Option `-p` ou variable `roles_path` dans `ansible.cfg` |
| Collection | `~/.ansible/collections/` | Option `-p` ou variable `collections_path` dans `ansible.cfg` |

---

### Étape 4 : Lister les rôles installés

La commande `ansible-galaxy list` affiche tous les rôles installés et leurs versions.

Commande :

```bash
# Liste tous les rôles installés
ansible-galaxy list
```

**Résultat attendu** :

```text
# /home/user/.ansible/roles
- geerlingguy.nginx, 3.2.0
- geerlingguy.postgresql, 3.5.0
```

La sortie indique le chemin d'installation, le nom du rôle et sa version. Si aucun rôle n'est installé, la sortie est vide.

**Lister les rôles dans un répertoire spécifique** :

```bash
# Liste les rôles installés dans le dossier roles/ du projet
ansible-galaxy list -p roles/
```

**Résultat attendu** :

```text
# /home/user/mon-projet/roles
- geerlingguy.nginx, 3.2.0
```

---

### Étape 5 : Installer une collection

Les collections s'installent avec la sous-commande `collection install`.

**Cette étape nécessite une connexion internet.**

**Installation dans le répertoire par défaut** :

```bash
# Installe la collection community.general
ansible-galaxy collection install community.general
```

**Résultat attendu** :

```text
Starting galaxy collection install process
Process install dependency map
Starting collection install process
Downloading https://galaxy.ansible.com/api/v3/plugin/ansible/content/published/collections/artifacts/community-general-8.5.0.tar.gz to /home/user/.ansible/tmp/...
Installing 'community.general:8.5.0' to '/home/user/.ansible/collections/ansible_collections/community/general'
community.general:8.5.0 was installed successfully
```

**Installation dans le dossier du projet** :

```bash
# Installe la collection dans le dossier collections/ du projet courant
ansible-galaxy collection install community.general -p ./collections/
```

**Résultat attendu** :

```text
Starting galaxy collection install process
Process install dependency map
Starting collection install process
Installing 'community.general:8.5.0' to '/home/user/mon-projet/collections/ansible_collections/community/general'
community.general:8.5.0 was installed successfully
```

**Lister les collections installées** :

```bash
# Liste toutes les collections installées
ansible-galaxy collection list
```

**Résultat attendu** :

```text
Collection               Version
------------------------ -------
amazon.aws               7.2.0
ansible.builtin          (built-in)
ansible.posix            1.5.4
community.general        8.5.0
community.postgresql     3.3.0
...
```

La collection `ansible.builtin` est toujours présente car elle est intégrée à Ansible. Les autres collections dépendent de ton installation.

---

### Étape 6 : Créer un fichier requirements.yml

Le fichier `requirements.yml` centralise toutes les dépendances Galaxy de ton projet. Crée-le à la racine de ton projet Ansible.

Commande :

```bash
# Crée le répertoire de travail
mkdir -p ~/ansible-galaxy-exercice && cd ~/ansible-galaxy-exercice

# Crée le fichier requirements.yml
cat > requirements.yml << 'EOF'
---
# Dépendances du projet : rôles Galaxy
roles:
  # Rôle pour installer et configurer Nginx
  - name: geerlingguy.nginx
    version: "3.2.0"

  # Rôle pour installer et configurer PostgreSQL
  - name: geerlingguy.postgresql
    version: "3.5.0"

  # Rôle pour configurer le pare-feu (firewalld)
  - name: geerlingguy.firewall
    version: "2.7.0"

# Dépendances du projet : collections Galaxy
collections:
  # Collection communautaire avec des modules utilitaires
  - name: community.general
    version: ">=8.0.0"

  # Collection de modules POSIX (cron, sysctl, etc.)
  - name: ansible.posix
    version: "1.5.4"

  # Collection pour la gestion de PostgreSQL
  - name: community.postgresql
    version: "3.3.0"
EOF
```

**Explication du fichier ligne par ligne** :

| Élément | Signification |
| --- | --- |
| `roles:` | Section qui liste les rôles à installer |
| `name: geerlingguy.nginx` | Nom complet du rôle sur Galaxy (auteur.nom) |
| `version: "3.2.0"` | Version exacte à installer. Les guillemets sont recommandés |
| `collections:` | Section qui liste les collections à installer |
| `version: ">=8.0.0"` | Contrainte de version : installe la version 8.0.0 ou supérieure |
| `version: "1.5.4"` | Version exacte : installe précisément cette version |

**Syntaxe des contraintes de version** :

| Contrainte | Signification | Exemple |
| --- | --- | --- |
| `"3.2.0"` | Version exacte | Installe 3.2.0 et rien d'autre |
| `">=3.2.0"` | Version minimale | Installe 3.2.0 ou plus récent |
| `">=3.0.0,<4.0.0"` | Plage de versions | Installe entre 3.0.0 et 3.x.x (pas 4.x.x) |
| (absent) | Dernière version | Installe la version la plus récente disponible |

**Règle importante** : Épingle toujours les versions dans `requirements.yml`. Sans version épinglée, `ansible-galaxy install` télécharge la dernière version disponible. Si cette version introduit un changement incompatible, ton playbook peut casser sans que tu aies modifié quoi que ce soit.

---

### Étape 7 : Installer depuis requirements.yml

Une fois le fichier `requirements.yml` créé, installe toutes les dépendances en une seule commande.

**Cette étape nécessite une connexion internet.**

**Installer les rôles** :

```bash
# Installe tous les rôles listés dans requirements.yml
ansible-galaxy install -r requirements.yml
```

**Résultat attendu** :

```text
Starting galaxy role install process
- downloading role 'nginx', owned by geerlingguy
- downloading role from https://github.com/geerlingguy/ansible-role-nginx/archive/3.2.0.tar.gz
- extracting geerlingguy.nginx to /home/user/.ansible/roles/geerlingguy.nginx
- geerlingguy.nginx (3.2.0) was installed successfully
- downloading role 'postgresql', owned by geerlingguy
- downloading role from https://github.com/geerlingguy/ansible-role-postgresql/archive/3.5.0.tar.gz
- extracting geerlingguy.postgresql to /home/user/.ansible/roles/geerlingguy.postgresql
- geerlingguy.postgresql (3.5.0) was installed successfully
- downloading role 'firewall', owned by geerlingguy
- downloading role from https://github.com/geerlingguy/ansible-role-firewall/archive/2.7.0.tar.gz
- extracting geerlingguy.firewall to /home/user/.ansible/roles/geerlingguy.firewall
- geerlingguy.firewall (2.7.0) was installed successfully
```

**Installer les collections** :

```bash
# Installe toutes les collections listées dans requirements.yml
ansible-galaxy collection install -r requirements.yml
```

**Résultat attendu** :

```text
Starting galaxy collection install process
Process install dependency map
Starting collection install process
Downloading https://galaxy.ansible.com/.../community-general-8.5.0.tar.gz
Installing 'community.general:8.5.0' to '/home/user/.ansible/collections/ansible_collections/community/general'
Downloading https://galaxy.ansible.com/.../ansible-posix-1.5.4.tar.gz
Installing 'ansible.posix:1.5.4' to '/home/user/.ansible/collections/ansible_collections/ansible/posix'
Downloading https://galaxy.ansible.com/.../community-postgresql-3.3.0.tar.gz
Installing 'community.postgresql:3.3.0' to '/home/user/.ansible/collections/ansible_collections/community/postgresql'
```

**Installer les rôles dans le dossier du projet** :

```bash
# Installe les rôles dans le dossier roles/ du projet
ansible-galaxy install -r requirements.yml -p roles/
```

**Forcer la réinstallation** :

```bash
# Force la réinstallation même si le rôle est déjà installé
ansible-galaxy install -r requirements.yml --force
```

L'option `--force` réinstalle les rôles même s'ils sont déjà présents. C'est utile quand tu veux t'assurer que tout est à jour par rapport au fichier requirements.yml.

---

### Étape 8 : Utiliser un rôle Galaxy dans un playbook

Une fois le rôle installé, tu l'utilises dans un playbook exactement comme un rôle local. Ansible le trouve automatiquement dans `~/.ansible/roles/` ou dans le dossier `roles/` du projet.

**Créer un playbook qui utilise le rôle Nginx** :

```bash
# Crée le playbook
cat > playbook-nginx.yml << 'EOF'
---
# Playbook qui installe et configure Nginx avec le rôle Galaxy
- name: Configurer le serveur web
  hosts: webservers
  become: true

  roles:
    # Utilise le rôle Galaxy geerlingguy.nginx
    # Les variables ci-dessous personnalisent le comportement du rôle
    - role: geerlingguy.nginx
      vars:
        # Liste des virtual hosts Nginx à configurer
        nginx_vhosts:
          - listen: "80"
            server_name: "monsite.local"
            root: "/var/www/monsite"
            index: "index.html index.php"

        # Retirer la configuration par défaut de Nginx
        nginx_remove_default_vhost: true

        # Nombre de processus workers Nginx
        nginx_worker_processes: "auto"

        # Nombre maximum de connexions par worker
        nginx_worker_connections: "1024"
EOF
```

**Explication du playbook** :

| Ligne | Signification |
| --- | --- |
| `hosts: webservers` | Exécute le playbook sur toutes les machines du groupe `webservers` |
| `become: true` | Exécute les tâches avec les droits root (sudo) |
| `role: geerlingguy.nginx` | Appelle le rôle Galaxy installé |
| `vars:` | Variables passées au rôle pour personnaliser son comportement |
| `nginx_vhosts` | Variable du rôle qui définit les virtual hosts Nginx |
| `nginx_remove_default_vhost` | Variable du rôle qui supprime la configuration par défaut |

**Comment connaître les variables disponibles d'un rôle** :

Chaque rôle Galaxy bien écrit possède un fichier `defaults/main.yml` qui liste toutes les variables configurables avec leurs valeurs par défaut. Consulte ce fichier après l'installation :

```bash
# Affiche les variables par défaut du rôle geerlingguy.nginx
cat ~/.ansible/roles/geerlingguy.nginx/defaults/main.yml
```

**Résultat attendu** (extrait) :

```yaml
---
nginx_vhosts: []
nginx_remove_default_vhost: false
nginx_worker_processes: "{{ ansible_processor_vcpus | default(ansible_processor_count) }}"
nginx_worker_connections: "1024"
nginx_extra_http_options: ""
# ...
```

Chaque variable a une valeur par défaut. Tu ne surcharges que celles que tu veux modifier.

**Utiliser un rôle Galaxy avec pre_tasks et post_tasks** :

```yaml
---
# Playbook avec des tâches avant et après le rôle
- name: Configurer le serveur web complet
  hosts: webservers
  become: true

  pre_tasks:
    # Tâche exécutée AVANT le rôle
    - name: Mettre à jour le cache APT
      ansible.builtin.apt:
        update_cache: true
        cache_valid_time: 3600

  roles:
    - role: geerlingguy.nginx
      vars:
        nginx_vhosts:
          - listen: "80"
            server_name: "monsite.local"
            root: "/var/www/monsite"

  post_tasks:
    # Tâche exécutée APRÈS le rôle
    - name: Vérifier que Nginx répond
      ansible.builtin.uri:
        url: "http://localhost"
        status_code: 200
      register: result
      retries: 3
      delay: 5
      until: result.status == 200
```

**Utiliser un module d'une collection dans un playbook** :

Les modules d'une collection s'appellent avec leur nom complet (FQCN - Fully Qualified Collection Name) :

```yaml
---
# Playbook qui utilise des modules de la collection community.general
- name: Configurer le système
  hosts: all
  become: true

  tasks:
    # Module de la collection community.general
    - name: Configurer le fuseau horaire
      community.general.timezone:
        name: Europe/Paris

    # Module de la collection ansible.posix
    - name: Configurer une tâche cron
      ansible.posix.cron:
        name: "Sauvegarde quotidienne"
        minute: "0"
        hour: "2"
        job: "/usr/local/bin/backup.sh"

    # Module de la collection community.postgresql
    - name: Créer une base de données PostgreSQL
      community.postgresql.postgresql_db:
        name: mon_application
        state: present
```

Le format `namespace.collection.module` (par exemple `community.general.timezone`) est appelé FQCN. C'est la manière recommandée d'appeler les modules depuis Ansible 2.10. Le FQCN évite les ambiguïtés quand deux collections contiennent un module portant le même nom.

---

### Étape 9 : Utilisation offline

Cette étape explique comment préparer et transférer des rôles et collections Galaxy pour un environnement sans connexion internet.

**Méthode A : Télécharger et transférer des rôles**

Sur une machine avec internet :

```bash
# Crée un dossier pour stocker les rôles à transférer
mkdir -p ~/roles-offline

# Installe les rôles dans ce dossier
ansible-galaxy install geerlingguy.nginx -p ~/roles-offline/
ansible-galaxy install geerlingguy.postgresql -p ~/roles-offline/
ansible-galaxy install geerlingguy.firewall -p ~/roles-offline/

# Crée une archive pour le transfert
tar czf ~/roles-offline.tar.gz -C ~/roles-offline .
```

**Résultat attendu** :

```text
Starting galaxy role install process
- downloading role 'nginx', owned by geerlingguy
- extracting geerlingguy.nginx to /home/user/roles-offline/geerlingguy.nginx
- geerlingguy.nginx (3.2.0) was installed successfully
...
```

Transfert et installation sur la machine offline :

```bash
# Copie l'archive sur la machine offline (via clé USB, scp, etc.)
# Puis sur la machine offline :

# Crée le dossier roles/ dans le projet
mkdir -p ~/mon-projet-ansible/roles

# Extrait les rôles dans le projet
tar xzf roles-offline.tar.gz -C ~/mon-projet-ansible/roles/

# Vérifie que les rôles sont bien présents
ls ~/mon-projet-ansible/roles/
```

**Résultat attendu** :

```text
geerlingguy.firewall  geerlingguy.nginx  geerlingguy.postgresql
```

**Méthode B : Télécharger et transférer des collections**

Sur une machine avec internet :

```bash
# Crée un dossier pour stocker les collections à transférer
mkdir -p ~/collections-offline

# Télécharge les collections sous forme d'archives (sans les installer)
ansible-galaxy collection download community.general -p ~/collections-offline/
ansible-galaxy collection download ansible.posix -p ~/collections-offline/
ansible-galaxy collection download community.postgresql -p ~/collections-offline/

# Vérifie le contenu du dossier
ls ~/collections-offline/
```

**Résultat attendu** :

```text
community-general-8.5.0.tar.gz
ansible-posix-1.5.4.tar.gz
community-postgresql-3.3.0.tar.gz
requirements.yml
```

La commande `collection download` télécharge les archives `.tar.gz` sans les installer. Elle génère aussi un fichier `requirements.yml` dans le dossier de destination.

Transfert et installation sur la machine offline :

```bash
# Sur la machine offline, après avoir copié le dossier collections-offline/

# Installe les collections depuis les archives locales
ansible-galaxy collection install -r ~/collections-offline/requirements.yml -p ./collections/

# Alternative : installe une collection depuis un fichier tar.gz directement
ansible-galaxy collection install ~/collections-offline/community-general-8.5.0.tar.gz -p ./collections/
```

**Méthode C : Stocker les rôles directement dans Git**

Si tes rôles Galaxy sont stables et ne changent pas souvent, la méthode la plus simple est de les inclure directement dans le dépôt Git du projet :

```bash
# Installe les rôles dans le dossier roles/ du projet
ansible-galaxy install -r requirements.yml -p roles/

# Ajoute les rôles au dépôt Git
git add roles/
git commit -m "Ajout des rôles Galaxy pour usage offline"
```

Avantage : n'importe quel clone du dépôt contient les rôles, sans aucun téléchargement supplémentaire. Inconvénient : le dépôt Git grossit, et les mises à jour des rôles nécessitent un nouveau commit.

**Structure du projet après configuration offline** :

```text
mon-projet-ansible/
├── ansible.cfg
├── inventory.yml
├── requirements.yml
├── playbook.yml
├── roles/
│   ├── geerlingguy.nginx/
│   │   ├── defaults/
│   │   ├── handlers/
│   │   ├── tasks/
│   │   ├── templates/
│   │   └── meta/
│   ├── geerlingguy.postgresql/
│   └── geerlingguy.firewall/
└── collections/
    └── ansible_collections/
        ├── community/
        │   ├── general/
        │   └── postgresql/
        └── ansible/
            └── posix/
```

---

### Étape 10 : Supprimer un rôle

La commande `ansible-galaxy remove` supprime un rôle installé.

Commande :

```bash
# Supprime le rôle geerlingguy.nginx du répertoire par défaut
ansible-galaxy remove geerlingguy.nginx
```

**Résultat attendu** :

```text
- successfully removed geerlingguy.nginx
```

**Supprimer un rôle installé dans un répertoire spécifique** :

```bash
# Supprime le rôle du dossier roles/ du projet
ansible-galaxy remove geerlingguy.nginx -p roles/
```

**Supprimer une collection** :

Il n'existe pas de commande `ansible-galaxy collection remove`. Pour supprimer une collection, supprime manuellement son dossier :

```bash
# Supprime la collection community.general
rm -rf ~/.ansible/collections/ansible_collections/community/general

# Vérifie que la collection a été supprimée
ansible-galaxy collection list | grep community.general
```

**Résultat attendu** :

```text
# Aucune sortie. La collection n'apparaît plus dans la liste.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `ansible-galaxy search nginx` | Recherche des rôles contenant "nginx" sur Galaxy |
| `ansible-galaxy search nginx --platforms Ubuntu` | Recherche des rôles nginx compatibles Ubuntu |
| `ansible-galaxy info geerlingguy.nginx` | Affiche les métadonnées d'un rôle |
| `ansible-galaxy install geerlingguy.nginx` | Installe un rôle dans le répertoire par défaut |
| `ansible-galaxy install geerlingguy.nginx -p roles/` | Installe un rôle dans un dossier spécifique |
| `ansible-galaxy install -r requirements.yml` | Installe tous les rôles du fichier requirements.yml |
| `ansible-galaxy install -r requirements.yml --force` | Réinstalle tous les rôles même s'ils existent déjà |
| `ansible-galaxy list` | Liste tous les rôles installés |
| `ansible-galaxy remove geerlingguy.nginx` | Supprime un rôle installé |
| `ansible-galaxy init mon_role` | Crée un nouveau rôle vide avec la structure standard |
| `ansible-galaxy collection install community.general` | Installe une collection |
| `ansible-galaxy collection install -r requirements.yml` | Installe toutes les collections du fichier requirements.yml |
| `ansible-galaxy collection list` | Liste toutes les collections installées |
| `ansible-galaxy collection download community.general -p ./offline/` | Télécharge une collection en archive pour transfert offline |

---

## Pièges Fréquents

### Piège 1 : Ne pas épingler les versions dans requirements.yml

**Problème** : Tu listes des rôles et collections dans `requirements.yml` sans spécifier de version. L'installation fonctionne, mais quelques semaines plus tard, un collègue installe les dépendances et obtient des versions plus récentes qui introduisent des changements incompatibles. Le playbook cesse de fonctionner alors qu'aucun fichier du projet n'a été modifié.

**Exemple d'erreur** :

```yaml
# ❌ Incorrect : pas de version épinglée
roles:
  - name: geerlingguy.nginx
  - name: geerlingguy.postgresql
```

**Solution** :

```yaml
# ✅ Correct : versions épinglées
roles:
  - name: geerlingguy.nginx
    version: "3.2.0"
  - name: geerlingguy.postgresql
    version: "3.5.0"
```

Épingle toujours les versions. Pour mettre à jour un rôle, modifie le numéro de version dans `requirements.yml`, teste le playbook, puis commite le changement.

---

### Piège 2 : Oublier d'installer les dépendances avant d'exécuter un playbook

**Problème** : Tu clones un projet Ansible et tu exécutes directement `ansible-playbook`. Le playbook échoue car les rôles Galaxy ne sont pas installés.

**Message d'erreur typique** :

```text
ERROR! the role 'geerlingguy.nginx' was not found in /home/user/mon-projet/roles:/home/user/.ansible/roles:/usr/share/ansible/roles

The error appears to be in '/home/user/mon-projet/playbook.yml': line 8, column 7
```

**Solution** : Installe toujours les dépendances avant d'exécuter un playbook :

```bash
# Étape 1 : Installer les rôles et collections
ansible-galaxy install -r requirements.yml
ansible-galaxy collection install -r requirements.yml

# Étape 2 : Exécuter le playbook
ansible-playbook -i inventory.yml playbook.yml
```

Ajoute ces commandes dans un script `setup.sh` ou dans le fichier `README` du projet pour que chaque membre de l'équipe suive la même procédure.

---

### Piège 3 : Conflit de noms entre un rôle local et un rôle Galaxy

**Problème** : Tu as un rôle local nommé `nginx` dans ton dossier `roles/` et tu installes aussi le rôle Galaxy `geerlingguy.nginx`. Quand ton playbook référence `nginx`, Ansible utilise le rôle local et ignore le rôle Galaxy. Le comportement n'est pas celui que tu attends.

**Explication** : Ansible cherche les rôles dans cet ordre :

1. Le dossier `roles/` du projet (prioritaire)
2. Les répertoires listés dans `roles_path` de `ansible.cfg`
3. Le répertoire par défaut `~/.ansible/roles/`

Si un rôle local porte le même nom qu'un rôle Galaxy, le rôle local est toujours utilisé en premier.

**Solution** : Utilise toujours le nom complet (avec le préfixe auteur) quand tu références un rôle Galaxy dans un playbook :

```yaml
# ❌ Ambigu : Ansible peut confondre avec un rôle local "nginx"
roles:
  - nginx

# ✅ Explicite : pas d'ambiguïté possible
roles:
  - geerlingguy.nginx
```

Si tu as un rôle local et un rôle Galaxy pour la même fonction, supprime l'un des deux pour éviter toute confusion.

---

### Piège 4 : Utiliser la mauvaise commande pour les collections

**Problème** : Tu essaies d'installer une collection avec `ansible-galaxy install` au lieu de `ansible-galaxy collection install`. La commande échoue ou installe autre chose.

**Exemple d'erreur** :

```bash
# ❌ Incorrect : "install" sans "collection" cherche un rôle, pas une collection
ansible-galaxy install community.general
```

**Message d'erreur** :

```text
ERROR! - the role 'community.general' was not found on the Galaxy server.
```

**Solution** : Utilise la sous-commande `collection` pour les collections :

```bash
# ✅ Correct pour un rôle
ansible-galaxy install geerlingguy.nginx

# ✅ Correct pour une collection
ansible-galaxy collection install community.general
```

Règle simple : si le nom contient un point et suit le format `namespace.collection`, c'est une collection. Si le nom suit le format `auteur.role`, c'est un rôle. Mais pour éviter toute erreur, utilise toujours `requirements.yml` qui sépare clairement les sections `roles:` et `collections:`.

---

### Piège 5 : Oublier de pré-télécharger les dépendances en environnement offline

**Problème** : Tu prépares un projet Ansible pour un environnement offline, mais tu oublies de télécharger les rôles Galaxy avant de te déconnecter d'internet. Sur la machine offline, `ansible-galaxy install -r requirements.yml` échoue.

**Message d'erreur** :

```text
ERROR! - the role 'geerlingguy.nginx' was not found on the Galaxy server.
Could not connect to Galaxy server.
```

**Solution** : Avant de passer en offline, exécute systématiquement :

```bash
# Sur une machine avec internet
# Étape 1 : Télécharger les rôles
ansible-galaxy install -r requirements.yml -p ./roles-transfer/

# Étape 2 : Télécharger les collections
ansible-galaxy collection download -r requirements.yml -p ./collections-transfer/

# Étape 3 : Archiver le tout
tar czf dependencies-offline.tar.gz roles-transfer/ collections-transfer/

# Étape 4 : Transférer l'archive sur la machine offline
```

Ajoute cette procédure dans la documentation du projet pour ne pas l'oublier.

---

## Checklist de Validation

- [ ] J'ai recherché un rôle sur Galaxy avec `ansible-galaxy search`
- [ ] J'ai consulté les métadonnées d'un rôle avec `ansible-galaxy info`
- [ ] J'ai installé un rôle avec `ansible-galaxy install`
- [ ] J'ai listé les rôles installés avec `ansible-galaxy list`
- [ ] J'ai installé une collection avec `ansible-galaxy collection install`
- [ ] J'ai créé un fichier `requirements.yml` avec des versions épinglées
- [ ] J'ai installé toutes les dépendances depuis `requirements.yml`
- [ ] J'ai utilisé un rôle Galaxy dans un playbook avec des variables personnalisées
- [ ] J'ai utilisé un module de collection avec son FQCN dans un playbook
- [ ] Je connais la procédure pour télécharger et transférer des rôles en environnement offline

---

## Exercice Pratique

**Énoncé** : Crée un projet Ansible complet qui utilise des rôles et des collections Galaxy pour configurer un serveur web avec Nginx et PostgreSQL.

**Spécifications** :

1. **Créer un fichier `requirements.yml`** qui contient :
   - Le rôle `geerlingguy.nginx` en version `3.2.0`
   - Le rôle `geerlingguy.postgresql` en version `3.5.0`
   - La collection `community.general` en version `>=8.0.0`
   - La collection `community.postgresql` en version `3.3.0`

2. **Installer toutes les dépendances** avec les commandes appropriées

3. **Créer un playbook `site.yml`** avec trois plays :

   **Play 1 - Nginx** (groupe `webservers`) :

   - Un virtual host qui écoute sur le port 80
   - Le server_name est `app.local`
   - Le root est `/var/www/app`
   - La suppression du virtual host par défaut est activée

   **Play 2 - PostgreSQL** (groupe `databases`) :

   - Une base de données nommée `app_production`
   - Un utilisateur nommé `app_user`

   **Play 3 - Timezone** (toutes les machines) :

   - Utilise le module `community.general.timezone` pour configurer le fuseau horaire sur `Europe/Paris`

4. **Documenter la procédure offline** : Crée un fichier `OFFLINE.md` qui décrit les étapes pour transférer les dépendances sur une machine sans internet

**Indications** :

- Consulte les fichiers `defaults/main.yml` des rôles installés pour connaître les noms exacts des variables
- Utilise le FQCN (nom complet) pour les modules de collection
- Le playbook `site.yml` peut contenir plusieurs plays (un par groupe de machines)
- Pour la documentation offline, utilise les commandes vues à l'étape 9

**Résultat attendu** :

- `requirements.yml` est syntaxiquement valide et contient les 4 dépendances avec leurs versions
- `ansible-galaxy list` affiche les 2 rôles installés avec leurs versions
- `ansible-galaxy collection list` affiche les 2 collections installées
- `site.yml` est un playbook valide qui référence les rôles Galaxy et les modules de collection
- `ansible-playbook site.yml --syntax-check` ne retourne aucune erreur

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Structure du projet

```text
ansible-galaxy-exercice/
├── requirements.yml
├── inventory.yml
├── site.yml
├── group_vars/
│   ├── all.yml
│   ├── webservers.yml
│   └── databases.yml
└── OFFLINE.md
```

### Fichier requirements.yml

```yaml
---
# Dépendances Galaxy du projet

roles:
  # Rôle pour installer et configurer Nginx
  - name: geerlingguy.nginx
    version: "3.2.0"

  # Rôle pour installer et configurer PostgreSQL
  - name: geerlingguy.postgresql
    version: "3.5.0"

collections:
  # Collection communautaire (timezone, ufw, etc.)
  - name: community.general
    version: ">=8.0.0"

  # Collection pour la gestion de PostgreSQL
  - name: community.postgresql
    version: "3.3.0"
```

### Fichier inventory.yml

```yaml
all:
  children:
    webservers:
      hosts:
        web1:
          ansible_host: 192.168.64.2
    databases:
      hosts:
        db1:
          ansible_host: 192.168.64.4
```

### Fichier group_vars/all.yml

```yaml
---
# Variables communes à toutes les machines
ansible_user: deploy
ansible_python_interpreter: /usr/bin/python3
timezone: Europe/Paris
```

### Fichier group_vars/webservers.yml

```yaml
---
# Variables pour les serveurs web
nginx_remove_default_vhost: true
nginx_vhosts:
  - listen: "80"
    server_name: "app.local"
    root: "/var/www/app"
    index: "index.html index.php"
```

### Fichier group_vars/databases.yml

```yaml
---
# Variables pour les serveurs de base de données
postgresql_databases:
  - name: app_production

postgresql_users:
  - name: app_user
    db: app_production
    priv: "ALL"
```

### Fichier site.yml

```yaml
---
# Play 1 : Configurer le fuseau horaire sur toutes les machines
- name: Configuration commune à toutes les machines
  hosts: all
  become: true

  tasks:
    # Utilise le module de la collection community.general
    - name: Configurer le fuseau horaire
      community.general.timezone:
        name: "{{ timezone }}"

# Play 2 : Configurer Nginx sur les serveurs web
- name: Configurer le serveur web Nginx
  hosts: webservers
  become: true

  pre_tasks:
    # Met à jour le cache APT avant d'installer des paquets
    - name: Mettre à jour le cache APT
      ansible.builtin.apt:
        update_cache: true
        cache_valid_time: 3600

  roles:
    # Le rôle utilise les variables définies dans group_vars/webservers.yml
    - role: geerlingguy.nginx

  post_tasks:
    # Crée le répertoire racine du site web
    - name: Créer le répertoire racine du site
      ansible.builtin.file:
        path: /var/www/app
        state: directory
        owner: www-data
        group: www-data
        mode: "0755"

# Play 3 : Configurer PostgreSQL sur les serveurs de base de données
- name: Configurer le serveur PostgreSQL
  hosts: databases
  become: true

  pre_tasks:
    # Met à jour le cache APT avant d'installer des paquets
    - name: Mettre à jour le cache APT
      ansible.builtin.apt:
        update_cache: true
        cache_valid_time: 3600

  roles:
    # Le rôle utilise les variables définies dans group_vars/databases.yml
    - role: geerlingguy.postgresql
```

### Installation des dépendances

```bash
# Étape 1 : Installer les rôles
ansible-galaxy install -r requirements.yml
```

**Résultat attendu** :

```text
Starting galaxy role install process
- downloading role 'nginx', owned by geerlingguy
- extracting geerlingguy.nginx to /home/user/.ansible/roles/geerlingguy.nginx
- geerlingguy.nginx (3.2.0) was installed successfully
- downloading role 'postgresql', owned by geerlingguy
- extracting geerlingguy.postgresql to /home/user/.ansible/roles/geerlingguy.postgresql
- geerlingguy.postgresql (3.5.0) was installed successfully
```

```bash
# Étape 2 : Installer les collections
ansible-galaxy collection install -r requirements.yml
```

**Résultat attendu** :

```text
Starting galaxy collection install process
Process install dependency map
Starting collection install process
Installing 'community.general:8.5.0' to '/home/user/.ansible/collections/ansible_collections/community/general'
Installing 'community.postgresql:3.3.0' to '/home/user/.ansible/collections/ansible_collections/community/postgresql'
```

### Vérification

```bash
# Vérifie que les rôles sont installés
ansible-galaxy list
```

**Résultat attendu** :

```text
# /home/user/.ansible/roles
- geerlingguy.nginx, 3.2.0
- geerlingguy.postgresql, 3.5.0
```

```bash
# Vérifie que les collections sont installées
ansible-galaxy collection list | grep -E "community.general|community.postgresql"
```

**Résultat attendu** :

```text
community.general        8.5.0
community.postgresql     3.3.0
```

```bash
# Vérifie la syntaxe du playbook
ansible-playbook -i inventory.yml site.yml --syntax-check
```

**Résultat attendu** :

```text
playbook: site.yml
```

Si la sortie affiche uniquement le nom du playbook sans erreur, la syntaxe est valide.

### Fichier OFFLINE.md (procédure de transfert offline)

```text
Procédure de transfert des dépendances Galaxy en mode offline
=============================================================

1. Sur une machine avec connexion internet :

   ansible-galaxy install -r requirements.yml -p ./roles-transfer/
   ansible-galaxy collection download -r requirements.yml -p ./collections-transfer/
   tar czf galaxy-dependencies.tar.gz roles-transfer/ collections-transfer/

2. Transférer l'archive galaxy-dependencies.tar.gz sur la machine offline
   (clé USB, partage réseau interne, etc.)

3. Sur la machine offline :

   tar xzf galaxy-dependencies.tar.gz
   cp -r roles-transfer/* roles/
   ansible-galaxy collection install -r collections-transfer/requirements.yml -p ./collections/

4. Vérification :

   ansible-galaxy list -p roles/
   ansible-galaxy collection list -p ./collections/
```

---

## Navigation

← Fiche précédente : **[Les Rôles](10-roles.md)**

→ Fiche suivante : **[Ansible Vault](12-ansible-vault.md)**
