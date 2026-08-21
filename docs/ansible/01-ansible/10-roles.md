---
tags:
  - Ansible
  - Avancé
  - Pratique
description: "Les Rôles"
estimated_time: "125 min"
fiche_number: 10
total_fiches: 14
cursus: "Ansible"
---

# 10 - Les Rôles

> **En bref** : À la fin de cette fiche, tu sauras structurer ton code Ansible en rôles réutilisables et maintenables. Lecture estimée : 125 min.


## Prérequis

- [Fiches 01 à 09](index.md) du cursus Ansible
- Savoir écrire un playbook avec des tâches, des handlers et des templates (fiches [05](05-playbooks-fondamentaux.md), [09](09-handlers-tags.md), [08](08-templates-jinja2.md))
- Savoir utiliser les variables et les fichiers Jinja2 (fiches [06](06-variables-facts.md), [08](08-templates-jinja2.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras structurer ton code Ansible en rôles réutilisables et maintenables.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un rôle Ansible ?

**Définition** : Un rôle Ansible est une structure de répertoires standardisée qui regroupe des tâches, des handlers, des templates, des fichiers, des variables et des valeurs par défaut pour une fonction spécifique (par exemple : installer et configurer Nginx, ou installer et configurer PostgreSQL).

**Le problème que les rôles résolvent** :

Sans rôles, voici les problèmes rencontrés :

1. **Playbooks volumineux** : Quand un playbook contient 200 tâches pour configurer un serveur web, une base de données et un pare-feu, le fichier devient difficile à lire et à maintenir.

2. **Code dupliqué** : Si tu as besoin d'installer Nginx sur 3 projets différents, tu copies-colles les mêmes tâches dans 3 playbooks. Quand tu corriges un bug dans un playbook, tu dois penser à corriger les deux autres.

3. **Organisation chaotique** : Les templates, les fichiers de configuration et les variables sont mélangés dans un seul répertoire. Tu ne sais plus quel template correspond à quelle tâche.

4. **Pas de réutilisation** : Sans structure standardisée, partager du code Ansible entre projets ou entre collègues est difficile. Chaque projet a sa propre organisation.

**Comment les rôles résolvent ces problèmes** :

| Problème              | Solution apportée par les rôles                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| Playbooks volumineux  | Chaque rôle est un répertoire séparé. Le playbook principal fait 10 lignes au lieu de 200           |
| Code dupliqué         | Un rôle est écrit une seule fois et utilisé dans tous les projets qui en ont besoin                 |
| Organisation chaotique | Chaque rôle a sa propre arborescence : ses tâches, ses templates, ses variables                    |
| Pas de réutilisation  | La structure standardisée permet de partager un rôle tel quel, sans modification                    |

**Analogie concrète** : Un rôle Ansible fonctionne comme les pièces détachées d'un meuble IKEA. Quand tu achètes une bibliothèque, chaque sachet contient tout le nécessaire pour une partie du meuble : vis, planches, chevilles et notice de montage. Tu peux monter chaque partie indépendamment. Un rôle "nginx" contient tout pour Nginx : tâches d'installation, templates de configuration, handlers de redémarrage et variables par défaut. Tu peux l'utiliser dans n'importe quel projet.

**Ce qu'un rôle n'est PAS** :

- Un rôle n'est pas un playbook. Un playbook est un fichier YAML qui décrit _quelles machines_ configurer et _quels rôles_ appliquer. Un rôle est un _composant_ utilisé par un playbook. Le playbook dit "applique le rôle nginx sur les serveurs web". Le rôle contient les instructions détaillées pour installer et configurer Nginx.
- Un rôle n'est pas une collection. Une collection Ansible regroupe plusieurs rôles, des plugins, des modules et de la documentation dans un seul paquet distribuable. Un rôle est un élément unique qui gère une fonction spécifique.

---

### Quelle est la structure d'un rôle ?

**Définition** : Un rôle Ansible est un répertoire qui suit une arborescence précise. Chaque sous-répertoire a un rôle spécifique. Le fichier principal de chaque sous-répertoire doit s'appeler `main.yml`.

**Structure complète d'un rôle** :

```text
roles/
└── nginx/
    ├── tasks/
    │   └── main.yml
    ├── handlers/
    │   └── main.yml
    ├── templates/
    │   └── nginx.conf.j2
    ├── files/
    │   └── index.html
    ├── vars/
    │   └── main.yml
    ├── defaults/
    │   └── main.yml
    ├── meta/
    │   └── main.yml
    └── README.md
```

**Rôle de chaque répertoire** :

| Répertoire   | Contenu                                                                                                        | Fichier principal |
| ------------ | -------------------------------------------------------------------------------------------------------------- | ----------------- |
| `tasks/`     | Les tâches à exécuter (installer des paquets, copier des fichiers, démarrer des services)                      | `main.yml`        |
| `handlers/`  | Les handlers déclenchés par les tâches (redémarrer un service, recharger une configuration)                    | `main.yml`        |
| `templates/` | Les fichiers Jinja2 (`.j2`) qui seront générés dynamiquement avec des variables                                | Pas de main.yml   |
| `files/`     | Les fichiers statiques copiés tels quels sur les machines cibles (sans traitement Jinja2)                      | Pas de main.yml   |
| `vars/`      | Les variables internes du rôle (priorité haute, pas destinées à être modifiées par l'utilisateur)              | `main.yml`        |
| `defaults/`  | Les valeurs par défaut des variables (priorité basse, destinées à être surchargées par l'utilisateur)          | `main.yml`        |
| `meta/`      | Les métadonnées du rôle : dépendances vers d'autres rôles, version minimale d'Ansible, plateformes supportées | `main.yml`        |
| `README.md`  | La documentation du rôle (description, variables disponibles, exemples d'utilisation)                          | -                 |

Le schéma suivant illustre la structure d'un rôle Ansible et ses sous-répertoires :

<div class="diagram-design">
<p><a href="../../../diagrams/ansible-01-ansible-10-roles-1.html">Quelle est la structure d&#x27;un rôle ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ansible-01-ansible-10-roles-1.html" title="Quelle est la structure d&#x27;un rôle ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Chaque sous-répertoire a un rôle précis : `tasks/` contient les actions, `handlers/` les réactions aux changements, `templates/` les fichiers dynamiques, `vars/` et `defaults/` les variables, `files/` les fichiers statiques, et `meta/` les métadonnées.

**Règle importante** : Tous les sous-répertoires sont optionnels. Si ton rôle n'a pas besoin de handlers, tu n'es pas obligé de créer le répertoire `handlers/`. Ansible ignore les répertoires absents.

**Règle de nommage** : Le fichier d'entrée de chaque répertoire doit s'appeler `main.yml`. C'est le fichier qu'Ansible charge automatiquement. Tu peux créer d'autres fichiers et les inclure depuis `main.yml` avec `ansible.builtin.import_tasks` ou `ansible.builtin.include_tasks`.

---

### Quelle est la différence entre defaults/ et vars/ ?

**Définition** : `defaults/` et `vars/` contiennent tous les deux des variables, mais leur priorité et leur usage sont différents. `defaults/` contient les valeurs par défaut que l'utilisateur du rôle peut surcharger. `vars/` contient les variables internes que l'utilisateur ne doit pas modifier.

**Le problème que cette distinction résout** :

Sans cette séparation, voici les problèmes rencontrés :

1. **Confusion sur ce qui est configurable** : Si toutes les variables sont au même endroit, l'utilisateur du rôle ne sait pas lesquelles il peut modifier et lesquelles sont internes au fonctionnement du rôle.

2. **Écrasement accidentel** : Si une variable interne (comme le nom du service systemd) est modifiable par l'utilisateur, il peut la changer par erreur et casser le rôle.

**Comment cette distinction résout ces problèmes** :

| Problème                       | Solution                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| Confusion sur la configuration | `defaults/` = configurable par l'utilisateur. `vars/` = interne au rôle                  |
| Écrasement accidentel          | `vars/` a une priorité plus haute que `defaults/`, ce qui protège les variables internes   |

**Comparaison defaults/ vs vars/** :

| Critère            | `defaults/`                                 | `vars/`                                          |
| ------------------ | ------------------------------------------- | ------------------------------------------------ |
| Priorité           | Basse (priorité 2 sur 22)                   | Haute (priorité 14 sur 22)                       |
| Usage              | Valeurs par défaut configurables            | Variables internes au rôle                        |
| Modifiable par     | L'utilisateur du rôle                       | Le développeur du rôle uniquement                 |
| Exemple            | `nginx_port: 80` (l'utilisateur peut changer le port) | `nginx_service_name: nginx` (nom fixe du service) |
| Surcharge possible | Oui, par l'inventaire, le playbook, la ligne de commande | Difficilement (nécessite une priorité encore plus haute) |

**Règle pratique** : Si la variable est destinée à être personnalisée par l'utilisateur du rôle, place-la dans `defaults/`. Si la variable est un détail d'implémentation interne, place-la dans `vars/`.

---

### Qu'est-ce que import_role vs include_role ?

**Définition** : `import_role` et `include_role` sont deux façons d'utiliser un rôle dans une section `tasks:` d'un playbook. La différence est le moment où Ansible charge le rôle : au moment de l'analyse du playbook (_statique_) ou au moment de l'exécution (_dynamique_).

**Le problème que cette distinction résout** :

Sans cette distinction, voici les problèmes rencontrés :

1. **Besoin de charger un rôle conditionnellement** : Tu veux exécuter un rôle uniquement si une condition est remplie (par exemple, installer Nginx seulement si la variable `install_webserver` est `true`). Le chargement statique ne le permet pas.

2. **Besoin de charger un rôle dans une boucle** : Tu veux appliquer un rôle plusieurs fois avec des paramètres différents (par exemple, créer plusieurs utilisateurs). Le chargement statique ne le permet pas.

**Comment import_role et include_role résolvent ces problèmes** :

| Problème                   | Solution                                                                                           |
| -------------------------- | -------------------------------------------------------------------------------------------------- |
| Chargement conditionnel    | `include_role` évalue la condition `when` au moment de l'exécution                                 |
| Chargement dans une boucle | `include_role` supporte `loop`, `import_role` ne le supporte pas                                   |

**Comparaison import_role vs include_role** :

| Critère                    | `import_role` (statique)                                     | `include_role` (dynamique)                                |
| -------------------------- | ------------------------------------------------------------ | --------------------------------------------------------- |
| Moment du chargement       | Au moment de l'analyse du playbook (avant l'exécution)       | Au moment de l'exécution (quand Ansible arrive à la tâche) |
| Tags                       | Les tags s'appliquent à toutes les tâches du rôle            | Les tags s'appliquent uniquement à la tâche `include_role` |
| Condition `when`           | La condition est copiée sur chaque tâche du rôle             | La condition est évaluée une seule fois avant le chargement |
| Boucle `loop`              | Non supporté                                                 | Supporté                                                  |
| Handlers                   | Les handlers du rôle sont disponibles immédiatement          | Les handlers du rôle sont disponibles après le chargement  |
| Performance                | Plus rapide (chargé une seule fois à l'analyse)              | Légèrement plus lent (chargé à chaque exécution)          |

**Règle pratique** : Utilise `import_role` par défaut. Utilise `include_role` uniquement si tu as besoin d'un comportement dynamique (condition `when`, boucle `loop`, ou nom de rôle stocké dans une variable).

**Exemple avec import_role (statique)** :

```yaml
---
- name: Configurer le serveur
  hosts: webservers
  become: true
  tasks:
    # Le rôle nginx est chargé au moment de l'analyse du playbook
    # Toutes ses tâches sont insérées ici comme si elles étaient écrites directement
    - name: Importer le rôle nginx
      ansible.builtin.import_role:
        name: nginx
```

**Exemple avec include_role (dynamique)** :

```yaml
---
- name: Configurer le serveur
  hosts: webservers
  become: true
  tasks:
    # Le rôle nginx est chargé uniquement si install_webserver est true
    # La condition est évaluée au moment de l'exécution
    - name: Inclure le rôle nginx si nécessaire
      ansible.builtin.include_role:
        name: nginx
      when: install_webserver | bool
```

---

### Qu'est-ce que les dépendances de rôles ?

**Définition** : Les dépendances de rôles sont des rôles qui doivent être exécutés _avant_ le rôle courant. Elles sont déclarées dans le fichier `meta/main.yml` du rôle. Ansible exécute automatiquement les dépendances avant d'exécuter les tâches du rôle principal.

**Le problème que les dépendances de rôles résolvent** :

Sans dépendances, voici les problèmes rencontrés :

1. **Ordre d'exécution manuel** : Si le rôle "wordpress" a besoin que Nginx et PHP soient installés, tu dois te souvenir d'ajouter ces rôles dans le playbook _avant_ le rôle "wordpress". Si tu oublies, l'exécution échoue.

2. **Documentation incomplète** : Sans déclaration formelle des dépendances, le seul moyen de savoir qu'un rôle en nécessite un autre est de lire le README (s'il existe) ou de découvrir l'erreur à l'exécution.

**Comment les dépendances de rôles résolvent ces problèmes** :

| Problème                   | Solution                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| Ordre d'exécution manuel   | Ansible exécute automatiquement les dépendances avant le rôle principal                           |
| Documentation incomplète   | Le fichier `meta/main.yml` sert de documentation formelle et lisible des dépendances              |

**Analogie concrète** : Les dépendances de rôles fonctionnent comme les prérequis d'un cours universitaire. Pour suivre le cours "Développement Web Avancé", tu dois d'abord avoir validé "HTML/CSS" et "JavaScript de base". L'université vérifie automatiquement que tu as ces prérequis avant de t'inscrire. De la même façon, quand tu utilises le rôle "wordpress", Ansible vérifie et exécute automatiquement les rôles "nginx" et "php" en prérequis.

**Exemple de fichier meta/main.yml** :

```yaml
---
# Le rôle wordpress dépend de nginx et de php
# Ansible exécutera nginx et php AVANT wordpress
dependencies:
  - role: nginx
  - role: php
    vars:
      php_version: "8.3"
```

**Règle importante** : Par défaut, Ansible n'exécute pas un rôle dépendant deux fois. Si le rôle "wordpress" et le rôle "api" dépendent tous les deux de "nginx", Ansible n'exécutera "nginx" qu'une seule fois. Ce comportement est contrôlé par le paramètre `allow_duplicates` dans `meta/main.yml` (par défaut : `false`).

---

## Étapes Pratiques

### Étape 1 : Créer la structure d'un rôle avec ansible-galaxy init

La commande `ansible-galaxy init` crée automatiquement l'arborescence complète d'un rôle.

Crée un répertoire pour le projet et initialise le rôle :

```bash
# Crée le répertoire du projet
mkdir -p ~/ansible-roles-exercice/roles

# Initialise le rôle nginx avec ansible-galaxy
ansible-galaxy init ~/ansible-roles-exercice/roles/nginx
```

**Résultat attendu** :

```text
- Role ~/ansible-roles-exercice/roles/nginx was created successfully
```

Vérifie la structure créée :

```bash
# Affiche l'arborescence du rôle
tree ~/ansible-roles-exercice/roles/nginx
```

**Résultat attendu** :

```text
/home/loic/ansible-roles-exercice/roles/nginx
├── defaults
│   └── main.yml
├── files
├── handlers
│   └── main.yml
├── meta
│   └── main.yml
├── README.md
├── tasks
│   └── main.yml
├── templates
├── tests
│   ├── inventory
│   └── test.yml
└── vars
    └── main.yml
```

Ansible a créé tous les répertoires et fichiers principaux. Les fichiers `main.yml` sont vides (ils contiennent uniquement des commentaires). Le répertoire `tests/` contient un inventaire et un playbook de test minimal.

---

### Étape 2 : Écrire les tâches du rôle (tasks/main.yml)

Ouvre le fichier `~/ansible-roles-exercice/roles/nginx/tasks/main.yml` et remplace son contenu par :

```yaml
---
# Tâches principales du rôle nginx

# Étape 1 : Installer le paquet nginx
- name: Installer nginx
  ansible.builtin.apt:
    name: nginx
    state: present
    update_cache: true
    cache_valid_time: 3600

# Étape 2 : Copier le fichier de configuration principal
# Le template Jinja2 sera généré avec les variables du rôle
- name: Déployer la configuration nginx
  ansible.builtin.template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    owner: root
    group: root
    mode: "0644"
  notify: Recharger nginx

# Étape 3 : Déployer la configuration du virtual host
- name: Déployer la configuration du virtual host
  ansible.builtin.template:
    src: default.conf.j2
    dest: /etc/nginx/sites-available/default
    owner: root
    group: root
    mode: "0644"
  notify: Recharger nginx

# Étape 4 : Activer le virtual host (lien symbolique)
- name: Activer le virtual host
  ansible.builtin.file:
    src: /etc/nginx/sites-available/default
    dest: /etc/nginx/sites-enabled/default
    state: link
  notify: Recharger nginx

# Étape 5 : Copier la page d'accueil par défaut (fichier statique)
- name: Déployer la page d'accueil
  ansible.builtin.copy:
    src: index.html
    dest: "{{ nginx_document_root }}/index.html"
    owner: www-data
    group: www-data
    mode: "0644"

# Étape 6 : S'assurer que nginx est démarré et activé au boot
- name: Démarrer et activer nginx
  ansible.builtin.service:
    name: nginx
    state: started
    enabled: true
```

**Explication des tâches** :

| Tâche | Module utilisé | Rôle |
| ----- | -------------- | ---- |
| Installer nginx | `apt` | Installe le paquet via le gestionnaire de paquets Debian/Ubuntu |
| Déployer la configuration | `template` | Génère le fichier de config à partir du template Jinja2 |
| Déployer le virtual host | `template` | Génère la config du site à partir du template Jinja2 |
| Activer le virtual host | `file` | Crée le lien symbolique dans `sites-enabled` |
| Déployer la page d'accueil | `copy` | Copie un fichier statique depuis `files/` |
| Démarrer nginx | `service` | Démarre le service et l'active au démarrage |

---

### Étape 3 : Écrire les handlers (handlers/main.yml)

Ouvre le fichier `~/ansible-roles-exercice/roles/nginx/handlers/main.yml` et remplace son contenu par :

```yaml
---
# Handlers du rôle nginx
# Ces handlers sont déclenchés par "notify" dans les tâches

# Recharger nginx applique la nouvelle configuration sans couper les connexions actives
- name: Recharger nginx
  ansible.builtin.service:
    name: nginx
    state: reloaded

# Redémarrer nginx coupe toutes les connexions et redémarre le processus
# Utilisé uniquement quand un rechargement ne suffit pas
- name: Redémarrer nginx
  ansible.builtin.service:
    name: nginx
    state: restarted
```

**Rappel** : Un handler ne s'exécute que si une tâche qui le notifie a effectivement modifié quelque chose (statut `changed`). Si le template n'a pas changé, le handler n'est pas déclenché.

---

### Étape 4 : Créer les templates (templates/)

Crée le fichier `~/ansible-roles-exercice/roles/nginx/templates/nginx.conf.j2` :

```jinja2
# Configuration nginx générée par Ansible
# Ne pas modifier manuellement - toute modification sera écrasée

user www-data;
worker_processes {{ nginx_worker_processes }};
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
    worker_connections {{ nginx_worker_connections }};
}

http {
    # Paramètres de base
    sendfile on;
    tcp_nopush on;
    types_hash_max_size 2048;
    server_tokens off;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/xml;

    # Virtual hosts
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

Crée le fichier `~/ansible-roles-exercice/roles/nginx/templates/default.conf.j2` :

```jinja2
# Virtual host par défaut - généré par Ansible
# Ne pas modifier manuellement

server {
    listen {{ nginx_port }} default_server;
    listen [::]:{{ nginx_port }} default_server;

    server_name {{ nginx_server_name }};
    root {{ nginx_document_root }};
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    # Désactiver l'accès aux fichiers cachés
    location ~ /\. {
        deny all;
    }
}
```

**Explication** : Les variables entre `{{ }}` seront remplacées par les valeurs définies dans `defaults/main.yml` ou surchargées par l'utilisateur du rôle. Ansible utilise le moteur de templates Jinja2 pour effectuer ces remplacements.

---

### Étape 5 : Définir les variables par défaut (defaults/main.yml)

Ouvre le fichier `~/ansible-roles-exercice/roles/nginx/defaults/main.yml` et remplace son contenu par :

```yaml
---
# Variables par défaut du rôle nginx
# Ces valeurs peuvent être surchargées par l'utilisateur du rôle

# Port d'écoute du serveur web
nginx_port: 80

# Nom du serveur (utilisé dans la directive server_name)
nginx_server_name: localhost

# Répertoire racine des fichiers web
nginx_document_root: /var/www/html

# Nombre de processus worker nginx
# "auto" = un worker par coeur de processeur
nginx_worker_processes: auto

# Nombre maximum de connexions simultanées par worker
nginx_worker_connections: 768
```

**Explication** : Ces variables ont la priorité la plus basse. L'utilisateur du rôle peut les surcharger dans son playbook, dans son inventaire, ou en ligne de commande. Chaque variable est documentée par un commentaire qui explique son rôle.

---

### Étape 6 : Créer le fichier statique (files/)

Crée le fichier `~/ansible-roles-exercice/roles/nginx/files/index.html` :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Serveur configuré par Ansible</title>
</head>
<body>
    <h1>Le serveur fonctionne</h1>
    <p>Ce serveur a été configuré automatiquement par le rôle Ansible nginx.</p>
</body>
</html>
```

**Explication** : Ce fichier est copié tel quel sur les machines cibles par le module `copy`. Contrairement aux templates, les fichiers dans `files/` ne subissent aucun traitement Jinja2.

---

### Étape 7 : Utiliser le rôle dans un playbook

Crée le fichier `~/ansible-roles-exercice/playbook.yml` :

```yaml
---
# Playbook principal qui utilise le rôle nginx
- name: Configurer le serveur web
  hosts: webservers
  become: true
  roles:
    - nginx
```

**Explication** : Le playbook fait 6 lignes. Toute la logique d'installation et de configuration est dans le rôle. Le playbook se contente de dire "applique le rôle nginx sur les machines du groupe webservers".

Ansible cherche le rôle `nginx` dans les emplacements suivants (dans cet ordre) :

1. Le répertoire `roles/` situé au même niveau que le playbook
2. Les chemins définis dans `roles_path` dans `ansible.cfg`
3. Le répertoire `~/.ansible/roles/`
4. Le répertoire `/etc/ansible/roles/`

---

### Étape 8 : Passer des variables au rôle

Tu peux surcharger les variables par défaut du rôle directement dans le playbook.

**Méthode 1 : Dans la section rôles** :

```yaml
---
- name: Configurer le serveur web
  hosts: webservers
  become: true
  roles:
    # Le rôle nginx est utilisé avec des valeurs personnalisées
    - role: nginx
      vars:
        nginx_port: 8080
        nginx_server_name: monsite.local
        nginx_document_root: /var/www/monsite
```

**Méthode 2 : Dans la section vars du playbook** :

```yaml
---
- name: Configurer le serveur web
  hosts: webservers
  become: true
  vars:
    nginx_port: 8080
    nginx_server_name: monsite.local
  roles:
    - nginx
```

**Méthode 3 : En ligne de commande** :

```bash
# Les variables passées avec -e ont la priorité la plus haute
ansible-playbook playbook.yml -e "nginx_port=8080 nginx_server_name=monsite.local"
```

**Ordre de priorité (de la plus basse à la plus haute)** :

1. `defaults/main.yml` du rôle (priorité la plus basse)
2. Variables de l'inventaire (host_vars, group_vars)
3. Variables du playbook (`vars:`)
4. Variables passées au rôle (`role: nginx, vars:`)
5. Variables de la ligne de commande `-e` (priorité la plus haute)

---

### Étape 9 : Utiliser include_role et import_role dans les tâches

Au lieu de la section `roles:`, tu peux utiliser les rôles dans la section `tasks:` avec `import_role` ou `include_role`.

**Exemple avec import_role (statique)** :

```yaml
---
- name: Configurer le serveur web
  hosts: webservers
  become: true
  tasks:
    # import_role : le rôle est chargé au moment de l'analyse du playbook
    - name: Appliquer le rôle nginx
      ansible.builtin.import_role:
        name: nginx
```

**Exemple avec include_role (dynamique et conditionnel)** :

```yaml
---
- name: Configurer le serveur web
  hosts: webservers
  become: true
  tasks:
    # include_role : le rôle est chargé uniquement si la condition est vraie
    - name: Inclure le rôle nginx si nécessaire
      ansible.builtin.include_role:
        name: nginx
      when: install_webserver | bool

    # include_role avec une boucle : applique le rôle plusieurs fois
    - name: Créer plusieurs utilisateurs avec un rôle
      ansible.builtin.include_role:
        name: create_user
      vars:
        username: "{{ item.name }}"
        user_groups: "{{ item.groups }}"
      loop:
        - { name: "alice", groups: "sudo,www-data" }
        - { name: "bob", groups: "www-data" }
```

**Quand utiliser quelle approche** :

| Approche                 | Quand l'utiliser                                                        |
| ------------------------ | ----------------------------------------------------------------------- |
| Section `roles:`         | Cas standard : appliquer un ou plusieurs rôles dans un playbook         |
| `import_role` (statique) | Quand tu veux insérer un rôle au milieu d'autres tâches                 |
| `include_role` (dynamique) | Quand tu as besoin de conditions `when`, de boucles `loop`, ou de noms de rôles dynamiques |

---

### Étape 10 : Définir les dépendances (meta/main.yml)

Ouvre le fichier `~/ansible-roles-exercice/roles/nginx/meta/main.yml` et remplace son contenu par :

```yaml
---
# Métadonnées du rôle nginx

# Version minimale d'Ansible requise
min_ansible_version: "2.14"

# Plateformes supportées
galaxy_info:
  author: loic
  description: "Installe et configure Nginx sur Debian/Ubuntu"
  license: MIT
  min_ansible_version: "2.14"
  platforms:
    - name: Debian
      versions:
        - bullseye
        - bookworm
    - name: Ubuntu
      versions:
        - jammy
        - noble

# Dépendances : ces rôles sont exécutés AVANT le rôle nginx
dependencies: []
```

Pour un rôle qui a des dépendances (par exemple, un rôle "wordpress"), le fichier `meta/main.yml` ressemblerait à ceci :

```yaml
---
galaxy_info:
  author: loic
  description: "Installe et configure WordPress"
  license: MIT
  min_ansible_version: "2.14"

# Ansible exécutera ces rôles dans l'ordre AVANT les tâches de wordpress
dependencies:
  - role: common
  - role: nginx
  - role: php
    vars:
      php_version: "8.3"
      php_extensions:
        - php-mysql
        - php-xml
        - php-mbstring
  - role: ssl
    vars:
      ssl_domain: "{{ wordpress_domain }}"
```

**Explication** :

- Quand tu exécutes le rôle "wordpress", Ansible exécute d'abord `common`, puis `nginx`, puis `php`, puis `ssl`, et enfin `wordpress`
- Les variables passées aux dépendances (`php_version`, `ssl_domain`) sont spécifiques à cette utilisation
- Si un autre rôle dépend aussi de `nginx`, Ansible ne l'exécutera qu'une seule fois (sauf si `allow_duplicates: true` est défini)

---

### Étape 11 : Créer un deuxième rôle (common) pour pratiquer

Crée un rôle "common" qui installe les paquets de base et configure le système.

Initialise le rôle :

```bash
# Initialise le rôle common
ansible-galaxy init ~/ansible-roles-exercice/roles/common
```

**Résultat attendu** :

```text
- Role ~/ansible-roles-exercice/roles/common was created successfully
```

Ouvre le fichier `~/ansible-roles-exercice/roles/common/defaults/main.yml` et remplace son contenu par :

```yaml
---
# Variables par défaut du rôle common

# Liste des paquets de base à installer sur tous les serveurs
common_packages:
  - vim
  - curl
  - wget
  - htop
  - tree
  - unzip
  - git

# Fuseau horaire
common_timezone: "Europe/Paris"

# Nom de l'utilisateur administrateur à créer
common_admin_user: "admin"

# Groupes de l'utilisateur administrateur
common_admin_groups: "sudo"
```

Ouvre le fichier `~/ansible-roles-exercice/roles/common/tasks/main.yml` et remplace son contenu par :

```yaml
---
# Tâches principales du rôle common

# Étape 1 : Mettre à jour le cache des paquets
- name: Mettre à jour le cache apt
  ansible.builtin.apt:
    update_cache: true
    cache_valid_time: 3600

# Étape 2 : Installer les paquets de base
- name: Installer les paquets de base
  ansible.builtin.apt:
    name: "{{ common_packages }}"
    state: present

# Étape 3 : Configurer le fuseau horaire
- name: Configurer le fuseau horaire
  community.general.timezone:
    name: "{{ common_timezone }}"

# Étape 4 : Créer l'utilisateur administrateur
- name: Créer l'utilisateur administrateur
  ansible.builtin.user:
    name: "{{ common_admin_user }}"
    groups: "{{ common_admin_groups }}"
    append: true
    shell: /bin/bash
    create_home: true

# Étape 5 : Autoriser l'utilisateur admin à utiliser sudo sans mot de passe
- name: Configurer sudo pour l'administrateur
  ansible.builtin.lineinfile:
    path: /etc/sudoers.d/{{ common_admin_user }}
    line: "{{ common_admin_user }} ALL=(ALL) NOPASSWD:ALL"
    create: true
    mode: "0440"
    validate: "visudo -cf %s"
```

---

### Étape 12 : Utiliser les deux rôles dans un playbook

Crée le fichier `~/ansible-roles-exercice/site.yml` :

```yaml
---
# Playbook principal qui utilise les deux rôles
- name: Configurer les serveurs web
  hosts: webservers
  become: true
  roles:
    # Le rôle common est exécuté en premier (paquets de base, utilisateur admin)
    - common
    # Le rôle nginx est exécuté ensuite (installation et configuration du serveur web)
    - role: nginx
      vars:
        nginx_port: 80
        nginx_server_name: monsite.local
```

Vérifie la syntaxe du playbook :

```bash
# Vérifie que le playbook est syntaxiquement correct
ansible-playbook ~/ansible-roles-exercice/site.yml --syntax-check
```

**Résultat attendu** :

```text
playbook: /home/loic/ansible-roles-exercice/site.yml
```

Si le résultat affiche le chemin du playbook sans erreur, la syntaxe est correcte.

Vérifie la structure finale du projet :

```bash
# Affiche l'arborescence complète du projet
tree ~/ansible-roles-exercice --dirsfirst
```

**Résultat attendu** :

```text
/home/loic/ansible-roles-exercice
├── roles
│   ├── common
│   │   ├── defaults
│   │   │   └── main.yml
│   │   ├── handlers
│   │   │   └── main.yml
│   │   ├── meta
│   │   │   └── main.yml
│   │   ├── tasks
│   │   │   └── main.yml
│   │   ├── templates
│   │   ├── tests
│   │   │   ├── inventory
│   │   │   └── test.yml
│   │   ├── vars
│   │   │   └── main.yml
│   │   └── README.md
│   └── nginx
│       ├── defaults
│       │   └── main.yml
│       ├── files
│       │   └── index.html
│       ├── handlers
│       │   └── main.yml
│       ├── meta
│       │   └── main.yml
│       ├── tasks
│       │   └── main.yml
│       ├── templates
│       │   ├── default.conf.j2
│       │   └── nginx.conf.j2
│       ├── tests
│       │   ├── inventory
│       │   └── test.yml
│       ├── vars
│       │   └── main.yml
│       └── README.md
├── playbook.yml
└── site.yml
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `ansible-galaxy init roles/<nom>` | Crée la structure complète d'un rôle dans le répertoire `roles/` |
| `ansible-galaxy list` | Liste les rôles installés sur ta machine |
| `ansible-galaxy role list` | Liste les rôles installés avec leur chemin |
| `ansible-playbook site.yml --syntax-check` | Vérifie la syntaxe du playbook et des rôles sans rien exécuter |
| `ansible-playbook site.yml --list-tasks` | Liste toutes les tâches qui seront exécutées (y compris celles des rôles) |
| `ansible-playbook site.yml --roles-path ./roles` | Spécifie un chemin personnalisé pour chercher les rôles |
| `ansible-playbook site.yml --start-at-task "Nom de la tâche"` | Démarre l'exécution à une tâche spécifique dans un rôle |

---

## Pièges Fréquents

### Piège 1 : Mettre les variables configurables dans vars/ au lieu de defaults/

**Problème** : Tu places les variables que l'utilisateur du rôle devrait pouvoir surcharger (comme `nginx_port`) dans `vars/main.yml` au lieu de `defaults/main.yml`.

**Explication** : Les variables dans `vars/` ont une priorité haute (14 sur 22). Elles sont très difficiles à surcharger. L'utilisateur qui passe `nginx_port: 8080` dans son playbook ne comprendra pas pourquoi le port reste à 80.

**Solution** : Place dans `defaults/main.yml` toutes les variables que l'utilisateur du rôle peut avoir besoin de personnaliser. Réserve `vars/main.yml` aux variables internes (noms de services systemd, chemins système fixes).

```yaml
# defaults/main.yml - Variables configurables par l'utilisateur
nginx_port: 80
nginx_server_name: localhost

# vars/main.yml - Variables internes au rôle
nginx_service_name: nginx
nginx_config_path: /etc/nginx
```

---

### Piège 2 : Dépendances circulaires entre rôles

**Problème** : Le rôle A dépend du rôle B, et le rôle B dépend du rôle A. Ansible entre dans une boucle infinie et l'exécution échoue.

**Explication** : Si `meta/main.yml` du rôle "nginx" contient une dépendance vers "ssl", et que `meta/main.yml` du rôle "ssl" contient une dépendance vers "nginx", Ansible ne peut pas résoudre l'ordre d'exécution.

**Solution** : Repense l'architecture de tes rôles. Si deux rôles ont besoin de fonctionnalités communes, extrais ces fonctionnalités dans un troisième rôle dont les deux dépendent. Par exemple :

```text
Incorrect :       nginx <-> ssl (dépendance circulaire)

Correct :         common-ssl (certificats)
                  /          \
               nginx          ssl-termination
```

---

### Piège 3 : Oublier de nommer le fichier main.yml

**Problème** : Tu crées un fichier `tasks/nginx.yml` ou `tasks/install.yml` au lieu de `tasks/main.yml`. Ansible ne trouve pas les tâches du rôle.

**Explication** : Ansible charge automatiquement le fichier `main.yml` dans chaque sous-répertoire du rôle. Si le fichier s'appelle autrement, Ansible l'ignore.

**Solution** : Le fichier d'entrée de chaque sous-répertoire doit toujours s'appeler `main.yml`. Si tu veux découper tes tâches en plusieurs fichiers, crée un `main.yml` qui inclut les autres :

```yaml
---
# tasks/main.yml - fichier d'entrée qui inclut les sous-fichiers
- name: Inclure les tâches d'installation
  ansible.builtin.import_tasks: install.yml

- name: Inclure les tâches de configuration
  ansible.builtin.import_tasks: configure.yml

- name: Inclure les tâches de démarrage du service
  ansible.builtin.import_tasks: service.yml
```

---

### Piège 4 : Comportement inattendu des tags avec import_role vs include_role

**Problème** : Tu appliques un tag à une tâche `import_role`, mais toutes les tâches du rôle s'exécutent même quand tu filtres par un autre tag.

**Explication** : Avec `import_role` (statique), les tags sont copiés sur _chaque tâche_ du rôle. Si tu tagges l'import avec `tags: webserver`, toutes les tâches du rôle reçoivent ce tag. Avec `include_role` (dynamique), le tag s'applique uniquement à la tâche d'inclusion elle-même.

**Solution** : Si tu utilises des tags pour filtrer l'exécution, utilise `include_role` pour un contrôle précis, ou ajoute des tags à l'intérieur du rôle (dans `tasks/main.yml`) plutôt que sur l'import.

---

### Piège 5 : Ansible ne trouve pas le rôle

**Problème** : L'exécution du playbook échoue avec l'erreur `ERROR! the role 'nginx' was not found`.

**Explication** : Ansible cherche les rôles dans un ordre précis. Si ton répertoire `roles/` n'est pas au bon endroit, Ansible ne le trouve pas.

**Solution** : Vérifie les points suivants dans cet ordre :

1. Le répertoire `roles/` est-il au même niveau que ton playbook ?
2. Le nom du répertoire du rôle correspond-il exactement au nom utilisé dans le playbook ?
3. Si le répertoire est ailleurs, as-tu défini `roles_path` dans ton `ansible.cfg` ?

```bash
# Vérifie la configuration actuelle de roles_path
ansible-config dump | grep ROLES_PATH
```

```text
DEFAULT_ROLES_PATH(default) = ['/home/loic/.ansible/roles', '/usr/share/ansible/roles', '/etc/ansible/roles']
```

Tu peux ajouter un chemin personnalisé dans `ansible.cfg` :

```ini
[defaults]
roles_path = ./roles:/home/loic/.ansible/roles
```

---

## Checklist de Validation

- [ ] J'ai créé un rôle avec `ansible-galaxy init`
- [ ] Mon rôle contient des tâches dans `tasks/main.yml`
- [ ] Mon rôle contient des handlers dans `handlers/main.yml`
- [ ] Mon rôle contient des templates dans `templates/`
- [ ] Mon rôle contient des variables par défaut dans `defaults/main.yml`
- [ ] J'ai utilisé le rôle dans un playbook avec la section `roles:`
- [ ] J'ai personnalisé le rôle en passant des variables
- [ ] J'ai défini une dépendance de rôle dans `meta/main.yml`
- [ ] Je sais faire la différence entre `defaults/` (configurable) et `vars/` (interne)
- [ ] Je sais faire la différence entre `import_role` (statique) et `include_role` (dynamique)

---

## Exercice Pratique

**Énoncé** : Crée deux rôles Ansible et un playbook qui les utilise.

**Spécifications** :

**Rôle 1 : common**

Ce rôle prépare un serveur avec la configuration de base :

- Installer les paquets de base : `vim`, `curl`, `wget`, `htop`, `tree`, `unzip`, `git`, `ufw`
- Créer un utilisateur administrateur avec accès sudo sans mot de passe
- Configurer le fuseau horaire
- Configurer SSH : désactiver l'authentification par mot de passe root (`PermitRootLogin prohibit-password`)
- Activer le pare-feu ufw et autoriser SSH (port 22)

Variables par défaut à définir :

- `common_packages` : liste des paquets à installer
- `common_timezone` : fuseau horaire (défaut : `Europe/Paris`)
- `common_admin_user` : nom de l'utilisateur admin (défaut : `admin`)
- `common_admin_groups` : groupes de l'utilisateur admin (défaut : `sudo`)
- `common_ssh_permit_root_login` : valeur de PermitRootLogin (défaut : `prohibit-password`)

**Rôle 2 : webapp**

Ce rôle installe Nginx et déploie une application web :

- Installer Nginx
- Déployer un template de virtual host Jinja2 (server_name, port, document_root configurables)
- Déployer un fichier `index.html` statique
- S'assurer que Nginx est démarré et activé au boot
- Déclarer une dépendance vers le rôle `common` dans `meta/main.yml`

Variables par défaut à définir :

- `webapp_port` : port d'écoute (défaut : `80`)
- `webapp_server_name` : nom du serveur (défaut : `localhost`)
- `webapp_document_root` : répertoire racine (défaut : `/var/www/webapp`)

Handlers à créer :

- `Recharger nginx` : recharge la configuration Nginx

**Playbook : site.yml**

- Applique les deux rôles sur le groupe `webservers`
- Surcharge les variables : `webapp_port: 8080`, `webapp_server_name: mon-app.local`

**Indications** :

- Utilise `ansible-galaxy init` pour créer la structure de chaque rôle
- Place les rôles dans un répertoire `roles/` au même niveau que le playbook
- Le rôle `webapp` dépend de `common` : déclare cette dépendance dans `meta/main.yml`
- Chaque tâche doit avoir un `name` descriptif
- Chaque variable configurable doit être dans `defaults/main.yml`
- Vérifie la syntaxe avec `ansible-playbook site.yml --syntax-check`

**Résultat attendu** :

- La commande `tree roles/` affiche deux rôles avec la structure complète
- La commande `ansible-playbook site.yml --syntax-check` ne retourne aucune erreur
- La commande `ansible-playbook site.yml --list-tasks` affiche les tâches des deux rôles dans le bon ordre (common puis webapp)

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Structure finale attendue** :

```text
exercice-roles/
├── roles/
│   ├── common/
│   │   ├── defaults/
│   │   │   └── main.yml
│   │   ├── handlers/
│   │   │   └── main.yml
│   │   └── tasks/
│   │       └── main.yml
│   └── webapp/
│       ├── defaults/
│       │   └── main.yml
│       ├── files/
│       │   └── index.html
│       ├── handlers/
│       │   └── main.yml
│       ├── meta/
│       │   └── main.yml
│       ├── tasks/
│       │   └── main.yml
│       └── templates/
│           └── vhost.conf.j2
└── site.yml
```

**Étape 1 : Créer les rôles** :

```bash
# Crée le répertoire du projet
mkdir -p ~/exercice-roles/roles

# Initialise les deux rôles
ansible-galaxy init ~/exercice-roles/roles/common
ansible-galaxy init ~/exercice-roles/roles/webapp
```

**Étape 2 : Rôle common - defaults/main.yml** :

```yaml
---
# Variables par défaut du rôle common

# Liste des paquets de base à installer
common_packages:
  - vim
  - curl
  - wget
  - htop
  - tree
  - unzip
  - git
  - ufw

# Fuseau horaire
common_timezone: "Europe/Paris"

# Utilisateur administrateur
common_admin_user: "admin"
common_admin_groups: "sudo"

# Configuration SSH
common_ssh_permit_root_login: "prohibit-password"
```

**Étape 3 : Rôle common - tasks/main.yml** :

```yaml
---
# Tâches du rôle common

# Installer les paquets de base
- name: Mettre à jour le cache apt
  ansible.builtin.apt:
    update_cache: true
    cache_valid_time: 3600

- name: Installer les paquets de base
  ansible.builtin.apt:
    name: "{{ common_packages }}"
    state: present

# Configurer le fuseau horaire
- name: Configurer le fuseau horaire
  community.general.timezone:
    name: "{{ common_timezone }}"

# Créer l'utilisateur administrateur
- name: Créer l'utilisateur administrateur
  ansible.builtin.user:
    name: "{{ common_admin_user }}"
    groups: "{{ common_admin_groups }}"
    append: true
    shell: /bin/bash
    create_home: true

# Configurer sudo sans mot de passe pour l'administrateur
- name: Configurer sudo pour l'administrateur
  ansible.builtin.lineinfile:
    path: "/etc/sudoers.d/{{ common_admin_user }}"
    line: "{{ common_admin_user }} ALL=(ALL) NOPASSWD:ALL"
    create: true
    mode: "0440"
    validate: "visudo -cf %s"

# Configurer SSH : désactiver l'authentification root par mot de passe
- name: Configurer PermitRootLogin dans sshd_config
  ansible.builtin.lineinfile:
    path: /etc/ssh/sshd_config
    regexp: "^#?PermitRootLogin"
    line: "PermitRootLogin {{ common_ssh_permit_root_login }}"
    state: present
  notify: Redémarrer sshd

# Activer le pare-feu ufw
- name: Autoriser SSH dans ufw
  community.general.ufw:
    rule: allow
    port: "22"
    proto: tcp

- name: Activer ufw
  community.general.ufw:
    state: enabled
    policy: deny
```

**Étape 4 : Rôle common - handlers/main.yml** :

```yaml
---
# Handlers du rôle common

- name: Redémarrer sshd
  ansible.builtin.service:
    name: sshd
    state: restarted
```

**Étape 5 : Rôle webapp - defaults/main.yml** :

```yaml
---
# Variables par défaut du rôle webapp

# Port d'écoute du serveur web
webapp_port: 80

# Nom du serveur (directive server_name de Nginx)
webapp_server_name: localhost

# Répertoire racine des fichiers web
webapp_document_root: /var/www/webapp
```

**Étape 6 : Rôle webapp - tasks/main.yml** :

```yaml
---
# Tâches du rôle webapp

# Installer Nginx
- name: Installer nginx
  ansible.builtin.apt:
    name: nginx
    state: present
    update_cache: true
    cache_valid_time: 3600

# Créer le répertoire racine de l'application
- name: Créer le répertoire document root
  ansible.builtin.file:
    path: "{{ webapp_document_root }}"
    state: directory
    owner: www-data
    group: www-data
    mode: "0755"

# Déployer le template du virtual host
- name: Déployer la configuration du virtual host
  ansible.builtin.template:
    src: vhost.conf.j2
    dest: /etc/nginx/sites-available/webapp
    owner: root
    group: root
    mode: "0644"
  notify: Recharger nginx

# Activer le virtual host (lien symbolique)
- name: Activer le virtual host
  ansible.builtin.file:
    src: /etc/nginx/sites-available/webapp
    dest: /etc/nginx/sites-enabled/webapp
    state: link
  notify: Recharger nginx

# Supprimer le virtual host par défaut
- name: Supprimer le virtual host par défaut
  ansible.builtin.file:
    path: /etc/nginx/sites-enabled/default
    state: absent
  notify: Recharger nginx

# Déployer la page d'accueil (fichier statique)
- name: Déployer la page d'accueil
  ansible.builtin.copy:
    src: index.html
    dest: "{{ webapp_document_root }}/index.html"
    owner: www-data
    group: www-data
    mode: "0644"

# S'assurer que Nginx est démarré et activé au boot
- name: Démarrer et activer nginx
  ansible.builtin.service:
    name: nginx
    state: started
    enabled: true
```

**Étape 7 : Rôle webapp - handlers/main.yml** :

```yaml
---
# Handlers du rôle webapp

- name: Recharger nginx
  ansible.builtin.service:
    name: nginx
    state: reloaded
```

**Étape 8 : Rôle webapp - templates/vhost.conf.j2** :

```jinja2
# Virtual host généré par Ansible - rôle webapp
# Ne pas modifier manuellement

server {
    listen {{ webapp_port }} default_server;
    listen [::]:{{ webapp_port }} default_server;

    server_name {{ webapp_server_name }};
    root {{ webapp_document_root }};
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ /\. {
        deny all;
    }
}
```

**Étape 9 : Rôle webapp - files/index.html** :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Application Web</title>
</head>
<body>
    <h1>Application déployée avec Ansible</h1>
    <p>Cette application a été déployée automatiquement par le rôle Ansible webapp.</p>
</body>
</html>
```

**Étape 10 : Rôle webapp - meta/main.yml** :

```yaml
---
# Métadonnées du rôle webapp

galaxy_info:
  author: loic
  description: "Installe Nginx et déploie une application web"
  license: MIT
  min_ansible_version: "2.14"

# Le rôle webapp dépend du rôle common
# Ansible exécutera common AVANT webapp
dependencies:
  - role: common
```

**Étape 11 : Playbook site.yml** :

```yaml
---
# Playbook principal
- name: Déployer l'application web
  hosts: webservers
  become: true
  roles:
    # Le rôle common sera exécuté automatiquement grâce à la dépendance
    # déclarée dans meta/main.yml de webapp
    # Il n'est pas nécessaire de le lister ici, mais le faire est explicite
    - role: webapp
      vars:
        webapp_port: 8080
        webapp_server_name: mon-app.local
```

**Vérification de la syntaxe** :

```bash
# Vérifie la syntaxe du playbook et des rôles
cd ~/exercice-roles && ansible-playbook site.yml --syntax-check
```

**Résultat attendu** :

```text
playbook: /home/loic/exercice-roles/site.yml
```

**Liste des tâches** :

```bash
# Affiche toutes les tâches dans l'ordre d'exécution
cd ~/exercice-roles && ansible-playbook site.yml --list-tasks
```

**Résultat attendu** :

```text
playbook: /home/loic/exercice-roles/site.yml

  play #1 (webservers): Déployer l'application web    TAGS: []
    tasks:
      common : Mettre à jour le cache apt              TAGS: []
      common : Installer les paquets de base           TAGS: []
      common : Configurer le fuseau horaire            TAGS: []
      common : Créer l'utilisateur administrateur      TAGS: []
      common : Configurer sudo pour l'administrateur   TAGS: []
      common : Configurer PermitRootLogin dans sshd_config  TAGS: []
      common : Autoriser SSH dans ufw                  TAGS: []
      common : Activer ufw                             TAGS: []
      webapp : Installer nginx                         TAGS: []
      webapp : Créer le répertoire document root       TAGS: []
      webapp : Déployer la configuration du virtual host  TAGS: []
      webapp : Activer le virtual host                 TAGS: []
      webapp : Supprimer le virtual host par défaut    TAGS: []
      webapp : Déployer la page d'accueil              TAGS: []
      webapp : Démarrer et activer nginx               TAGS: []
```

Les tâches du rôle `common` apparaissent en premier (grâce à la dépendance déclarée dans `meta/main.yml` de `webapp`), suivies des tâches du rôle `webapp`.

---

## Navigation

← Fiche précédente : **[Handlers et Tags](09-handlers-tags.md)**

→ Fiche suivante : **[Ansible Galaxy](11-ansible-galaxy.md)**
