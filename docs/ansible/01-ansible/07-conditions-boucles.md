---
tags:
  - Ansible
  - Intermédiaire
  - Pratique
description: "Conditions et Boucles"
estimated_time: "65 min"
fiche_number: 7
total_fiches: 14
cursus: "Ansible"
---

# 07 - Conditions et Boucles

> **En bref** : À la fin de cette fiche, tu sauras utiliser les conditions et les boucles dans tes playbooks pour créer une logique d'exécution adaptative. Lecture estimée : 65 min.


## Prérequis

- Fiches [01 - Introduction à Ansible](01-introduction-ansible.md) à [06 - Variables et Facts](06-variables-facts.md) de ce cursus (lues et comprises)
- Connaître les variables et facts Ansible ([fiche 06](06-variables-facts.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les conditions et les boucles dans tes playbooks pour créer une logique d'exécution adaptative.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une condition (`when`) ?

**Définition** : Une condition est une directive qui contrôle si une tâche est exécutée ou non, en fonction d'une expression booléenne (vrai ou faux).

**Le problème que les conditions résolvent** :

Sans conditions, voici les problèmes rencontrés :

1. **Tâches inadaptées** : Une tâche `apt` s'exécute sur un serveur RedHat et échoue, car RedHat utilise `yum`.
2. **Exécutions inutiles** : Un service est redémarré même quand sa configuration n'a pas changé.
3. **Playbooks dupliqués** : Tu dois écrire un playbook par distribution au lieu d'un seul playbook universel.

**Comment les conditions résolvent ces problèmes** :

| Problème            | Solution apportée par `when`                                        |
| ------------------- | ------------------------------------------------------------------- |
| Tâches inadaptées   | La tâche ne s'exécute que sur l'OS cible (`when: os_family == ...`) |
| Exécutions inutiles | La tâche ne s'exécute que si un changement a eu lieu                |
| Playbooks dupliqués | Un seul playbook gère toutes les distributions                      |

**Analogie concrète** : Imagine une liste de courses avec des annotations. À côté de "parapluie", tu as écrit "seulement s'il pleut". Tu parcours ta liste, et tu n'achètes le parapluie que si la condition est remplie. La directive `when` fonctionne de la même façon.

**Syntaxe de base** :

```yaml
- name: Nom de la tâche
  ansible.builtin.module:
    paramètre: valeur
  when: expression_booléenne
```

**Règle importante** : Dans une clause `when`, tu écris directement une expression Jinja2 **sans** les doubles accolades `{{ }}`. La clause `when` est déjà évaluée comme une expression Jinja2.

Le diagramme suivant montre le flux d'exécution conditionnelle d'une tâche Ansible.

<div class="diagram-design">
<p><a href="../../../diagrams/ansible-01-ansible-07-conditions-boucles-1.html">Qu&#x27;est-ce qu&#x27;une condition (`when`) ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/ansible-01-ansible-07-conditions-boucles-1.html" title="Qu&#x27;est-ce qu&#x27;une condition (`when`) ?" style="width:100%;min-height:448px;border:0;background:transparent"></iframe>
</div>

**Ce qu'une condition n'est PAS** :

- Une condition `when` n'est pas un langage de programmation complet. Elle ne supporte que des expressions booléennes.
- Une condition `when` n'est pas un `if/else`. Il n'existe pas de `else` dans Ansible. Pour le cas contraire, tu écris une deuxième tâche avec la condition inversée.

---

### Conditions multiples

**Définition** : Tu peux combiner plusieurs conditions avec les opérateurs `and`, `or` et `not`.

| Opérateur | Signification | Exemple                             |
| --------- | ------------- | ----------------------------------- |
| `and`     | ET logique    | `when: condition_A and condition_B` |
| `or`      | OU logique    | `when: condition_A or condition_B`  |
| `not`     | Négation      | `when: not condition_A`             |

**Deux syntaxes pour `and`** (équivalentes) :

```yaml
# Forme 1 : opérateur and sur une seule ligne
when: ansible_facts['os_family'] == "Debian" and ansible_facts['distribution_major_version'] == "12"

# Forme 2 : liste (AND implicite entre chaque élément)
when:
  - ansible_facts['os_family'] == "Debian"
  - ansible_facts['distribution_major_version'] == "12"
```

La forme 2 (liste) est préférable quand tu as plusieurs conditions, car elle est plus lisible.

**Parenthèses pour grouper** :

```yaml
when: (ansible_facts['os_family'] == "Debian" or ansible_facts['os_family'] == "RedHat") and install_webserver
```

---

### Qu'est-ce qu'une boucle (`loop`) ?

**Définition** : Une boucle répète une tâche pour chaque élément d'une liste. À chaque itération, l'élément courant est accessible via `{{ item }}`.

**Le problème que les boucles résolvent** :

Sans boucles, voici les problèmes rencontrés :

1. **Duplication de tâches** : Tu écris 10 tâches identiques pour installer 10 paquets.
2. **Maintenance difficile** : Ajouter un paquet oblige à copier-coller une tâche entière.
3. **Playbooks longs** : 200 lignes pourraient en faire 30 avec des boucles.

**Comment les boucles résolvent ces problèmes** :

| Problème              | Solution apportée par `loop`                                |
| --------------------- | ----------------------------------------------------------- |
| Duplication de tâches | Une seule tâche gère tous les éléments de la liste          |
| Maintenance difficile | Pour ajouter un élément, tu ajoutes une ligne dans la liste |
| Playbooks longs       | Le playbook est court et lisible                            |

**Analogie concrète** : Imagine une liste de courses au supermarché. L'action est toujours la même : "mettre dans le caddie". Tu parcours la liste, et pour chaque article, tu fais la même action. La directive `loop` fonctionne pareil.

**Ce qu'une boucle n'est PAS** :

- Une boucle `loop` n'est pas un `for` imbriqué. Ansible ne supporte pas nativement les boucles dans les boucles.
- `loop` remplace l'ancienne syntaxe `with_items` (dépréciée depuis Ansible 2.5). Pour tout nouveau code, utilise `loop`.

---

### Boucles sur des dictionnaires (`dict2items`)

**Définition** : Le filtre `dict2items` transforme un dictionnaire en une liste d'objets avec les propriétés `key` et `value`, ce qui permet de boucler dessus.

**Fonctionnement** :

Le dictionnaire :

```yaml
users:
  alice:
    groups: admin
  bob:
    groups: developer
```

Après `dict2items`, Ansible obtient :

```yaml
- key: alice
  value:
    groups: admin
- key: bob
  value:
    groups: developer
```

Tu accèdes ensuite aux propriétés avec `{{ item.key }}` et `{{ item.value.groups }}`.

---

### Contrôle d'erreurs (`failed_when`, `changed_when`)

**Définition** : Ces directives redéfinissent les critères qu'Ansible utilise pour décider si une tâche a échoué ou a modifié quelque chose.

**Le problème que ces directives résolvent** :

1. **Faux échecs** : `grep` retourne le code 1 quand il ne trouve rien. Ansible considère cela comme une erreur.
2. **Faux changements** : `nginx -t` affiche "changed" alors qu'il ne modifie rien.
3. **Playbook interrompu** : Ansible s'arrête à la première erreur, même bénigne.

| Directive        | Rôle                                              | Usage courant                                |
| ---------------- | ------------------------------------------------- | -------------------------------------------- |
| `changed_when`   | Contrôle quand la tâche est marquée "changed"     | Commandes de vérification qui ne changent rien |
| `failed_when`    | Contrôle quand la tâche est marquée "failed"      | Commandes dont le code retour est trompeur   |
| `ignore_errors`  | Continue même en cas d'erreur (dernier recours)   | Quand l'échec est acceptable                 |

**Règle** : Utilise `failed_when` et `changed_when` en priorité. Réserve `ignore_errors: true` aux cas où tu ne peux pas prédire le code de sortie.

---

## Étapes Pratiques

### Étape 1 : Condition simple avec `when`

Crée un fichier `conditions.yml` :

```yaml
---
- name: Installer Apache selon l'OS
  hosts: all
  become: true

  tasks:
    # S'exécute uniquement sur Debian/Ubuntu
    - name: Installer Apache sur Debian
      ansible.builtin.apt:
        name: apache2
        state: present
        update_cache: true
      when: ansible_facts['os_family'] == "Debian"

    # S'exécute uniquement sur RedHat/CentOS/Rocky
    - name: Installer Apache sur RedHat
      ansible.builtin.yum:
        name: httpd
        state: present
      when: ansible_facts['os_family'] == "RedHat"
```

```bash
ansible-playbook -i inventory.ini conditions.yml
```

**Résultat attendu** (sur un serveur Debian) :

```text
TASK [Installer Apache sur Debian] ********************************************
changed: [serveur-debian]

TASK [Installer Apache sur RedHat] ********************************************
skipping: [serveur-debian]
```

La deuxième tâche est ignorée (`skipping`) car la condition `os_family == "RedHat"` est fausse.

---

### Étape 2 : Conditions multiples

Crée un fichier `conditions-multiples.yml` :

```yaml
---
- name: Exemples de conditions multiples
  hosts: all
  become: true

  vars:
    install_webserver: true
    environment_type: "production"

  tasks:
    # AND sous forme de liste (recommandé)
    - name: Installer Nginx sur Debian 12 uniquement
      ansible.builtin.apt:
        name: nginx
        state: present
      when:
        - ansible_facts['os_family'] == "Debian"
        - ansible_facts['distribution_major_version'] == "12"

    # OR sur une seule ligne
    - name: Installer curl sur Debian ou RedHat
      ansible.builtin.package:
        name: curl
        state: present
      when: ansible_facts['os_family'] == "Debian" or ansible_facts['os_family'] == "RedHat"

    # Variable booléenne + comparaison de chaîne
    - name: Installer Nginx en production si demandé
      ansible.builtin.apt:
        name: nginx
        state: present
      when:
        - install_webserver
        - environment_type == "production"

    # Négation avec !=
    - name: Installer les outils de debug (hors production)
      ansible.builtin.apt:
        name: strace
        state: present
      when: environment_type != "production"

    # Parenthèses pour grouper and et or
    - name: Configurer le firewall en production
      ansible.builtin.debug:
        msg: "Configuration du firewall"
      when: (ansible_facts['os_family'] == "Debian" or ansible_facts['os_family'] == "RedHat") and environment_type == "production"
```

---

### Étape 3 : Condition basée sur `register`

Crée un fichier `conditions-register.yml` :

```yaml
---
- name: Conditions basées sur register
  hosts: all
  become: true

  tasks:
    # stat retourne des informations sur un fichier
    - name: Vérifier si nginx.conf existe
      ansible.builtin.stat:
        path: /etc/nginx/nginx.conf
      register: nginx_conf

    # nginx_conf.stat.exists vaut true ou false
    - name: Afficher un message si nginx est configuré
      ansible.builtin.debug:
        msg: "Le fichier de configuration nginx existe"
      when: nginx_conf.stat.exists

    - name: Installer nginx si pas encore configuré
      ansible.builtin.apt:
        name: nginx
        state: present
      when: not nginx_conf.stat.exists

    # Condition basée sur le code retour d'une commande
    - name: Vérifier si git est installé
      ansible.builtin.command: git --version
      register: git_check
      failed_when: false
      changed_when: false

    # rc == 0 : commande réussie (git installé)
    # rc != 0 : commande échouée (git absent)
    - name: Installer git si absent
      ansible.builtin.apt:
        name: git
        state: present
      when: git_check.rc != 0
```

**Résultat attendu** (si nginx est installé mais pas git) :

```text
TASK [Vérifier si nginx.conf existe] ******************************************
ok: [serveur]

TASK [Afficher un message si nginx est configuré] *****************************
ok: [serveur] => {
    "msg": "Le fichier de configuration nginx existe"
}

TASK [Installer nginx si pas encore configuré] ********************************
skipping: [serveur]

TASK [Vérifier si git est installé] *******************************************
ok: [serveur]

TASK [Installer git si absent] ************************************************
changed: [serveur]
```

---

### Étape 4 : Boucle simple avec `loop`

Crée un fichier `boucles.yml` :

```yaml
---
- name: Installer des paquets avec une boucle
  hosts: all
  become: true

  tasks:
    # Une seule tâche au lieu de quatre
    - name: Installer plusieurs paquets
      ansible.builtin.apt:
        name: "{{ item }}"
        state: present
        update_cache: true
      loop:
        - nginx
        - curl
        - htop
        - git

    - name: Créer les répertoires de l'application
      ansible.builtin.file:
        path: "{{ item }}"
        state: directory
        owner: www-data
        group: www-data
        mode: "0755"
      loop:
        - /var/www/app
        - /var/www/app/public
        - /var/www/app/logs
        - /var/www/app/config
```

**Résultat attendu** :

```text
TASK [Installer plusieurs paquets] ********************************************
changed: [serveur] => (item=nginx)
changed: [serveur] => (item=curl)
changed: [serveur] => (item=htop)
changed: [serveur] => (item=git)
```

Chaque élément est traité un par un. Le nom apparaît entre parenthèses dans la sortie.

---

### Étape 5 : Boucle sur une variable liste

Crée un fichier `boucles-variables.yml` :

```yaml
---
- name: Boucles sur des variables
  hosts: all
  become: true

  vars:
    # Pour ajouter un paquet, modifie cette liste, pas les tâches
    packages_base:
      - vim
      - curl
      - wget
      - unzip

    # Liste d'éléments complexes (dictionnaires)
    app_directories:
      - path: /var/www/app
        owner: www-data
        mode: "0755"
      - path: /var/www/app/uploads
        owner: www-data
        mode: "0775"
      - path: /var/log/app
        owner: root
        mode: "0750"

  tasks:
    - name: Installer les paquets de base
      ansible.builtin.apt:
        name: "{{ item }}"
        state: present
      loop: "{{ packages_base }}"

    # Chaque élément est un dictionnaire avec path, owner, mode
    - name: Créer les répertoires
      ansible.builtin.file:
        path: "{{ item.path }}"
        state: directory
        owner: "{{ item.owner }}"
        mode: "{{ item.mode }}"
      loop: "{{ app_directories }}"
```

---

### Étape 6 : Boucle avec dictionnaire (`dict2items`)

Crée un fichier `boucles-dict.yml` :

```yaml
---
- name: Créer des utilisateurs avec dict2items
  hosts: all
  become: true

  vars:
    users:
      alice:
        groups: sudo
        shell: /bin/bash
        comment: "Alice Martin - Administratrice"
      bob:
        groups: developer
        shell: /bin/zsh
        comment: "Bob Dupont - Développeur"
      charlie:
        groups: developer
        shell: /bin/bash
        comment: "Charlie Durand - Développeur"

  tasks:
    # dict2items transforme le dictionnaire en liste
    # Chaque élément a .key (nom) et .value (propriétés)
    - name: Créer les utilisateurs
      ansible.builtin.user:
        name: "{{ item.key }}"
        groups: "{{ item.value.groups }}"
        shell: "{{ item.value.shell }}"
        comment: "{{ item.value.comment }}"
        create_home: true
      loop: "{{ users | dict2items }}"
```

**Résultat attendu** :

```text
TASK [Créer les utilisateurs] *************************************************
changed: [serveur] => (item={'key': 'alice', 'value': {'groups': 'sudo', ...}})
changed: [serveur] => (item={'key': 'bob', 'value': {'groups': 'developer', ...}})
changed: [serveur] => (item={'key': 'charlie', 'value': {'groups': 'developer', ...}})
```

---

### Étape 7 : Combiner conditions et boucles

Quand tu combines `when` et `loop`, la condition est évaluée **pour chaque élément** de la boucle.

Crée un fichier `conditions-boucles.yml` :

```yaml
---
- name: Combiner conditions et boucles
  hosts: all
  become: true

  vars:
    packages:
      - name: apache2
        state: present
        os_family: Debian
      - name: httpd
        state: present
        os_family: RedHat
      - name: nginx
        state: present
        os_family: all

    team_members:
      - name: alice
        active: true
        groups: sudo
      - name: bob
        active: true
        groups: developer
      - name: charlie
        active: false
        groups: developer

  tasks:
    # Seuls les paquets correspondant à l'OS actuel (ou "all") sont installés
    - name: Gérer les paquets selon l'OS
      ansible.builtin.apt:
        name: "{{ item.name }}"
        state: "{{ item.state }}"
      loop: "{{ packages }}"
      when: item.os_family == ansible_facts['os_family'] or item.os_family == "all"

    # Seuls les membres actifs sont créés
    - name: Créer uniquement les utilisateurs actifs
      ansible.builtin.user:
        name: "{{ item.name }}"
        groups: "{{ item.groups }}"
        state: present
      loop: "{{ team_members }}"
      when: item.active
```

**Résultat attendu** (sur Debian) :

```text
TASK [Gérer les paquets selon l'OS] *******************************************
changed: [serveur] => (item={'name': 'apache2', ...})
skipping: [serveur] => (item={'name': 'httpd', ...})
changed: [serveur] => (item={'name': 'nginx', ...})

TASK [Créer uniquement les utilisateurs actifs] *******************************
changed: [serveur] => (item={'name': 'alice', ...})
changed: [serveur] => (item={'name': 'bob', ...})
skipping: [serveur] => (item={'name': 'charlie', ...})
```

---

### Étape 8 : Utiliser `changed_when` et `failed_when`

Crée un fichier `controle-erreurs.yml` :

```yaml
---
- name: Contrôle d'erreurs
  hosts: all
  become: true

  tasks:
    # nginx -t vérifie la syntaxe sans rien modifier
    # changed_when: false évite le faux "changed"
    - name: Vérifier la syntaxe nginx
      ansible.builtin.command: nginx -t
      register: nginx_syntax
      changed_when: false
      failed_when: nginx_syntax.rc != 0

    # grep retourne 1 quand il ne trouve rien (pas une vraie erreur)
    # Seul le code 2 (erreur réelle de grep) est un échec
    - name: Chercher une ligne dans un fichier
      ansible.builtin.command: grep "server_name" /etc/nginx/nginx.conf
      register: grep_result
      changed_when: false
      failed_when: grep_result.rc == 2

    # changed_when avec une condition dynamique
    - name: Exécuter un script de déploiement
      ansible.builtin.command: /opt/scripts/deploy.sh
      register: deploy_result
      changed_when: "'created' in deploy_result.stdout"
      failed_when: "'ERROR' in deploy_result.stdout"

    # ignore_errors : le playbook continue même si la tâche échoue
    - name: Tenter d'arrêter un service qui n'existe peut-être pas
      ansible.builtin.systemd:
        name: old-service
        state: stopped
      ignore_errors: true
      register: stop_result

    - name: Signaler si le service n'existe pas
      ansible.builtin.debug:
        msg: "Le service old-service n'existe pas (ce n'est pas un problème)"
      when: stop_result is failed
```

**Résultat attendu** :

```text
TASK [Vérifier la syntaxe nginx] **********************************************
ok: [serveur]

TASK [Tenter d'arrêter un service qui n'existe peut-être pas] *****************
fatal: [serveur]: FAILED! ... ...ignoring

TASK [Signaler si le service n'existe pas] ************************************
ok: [serveur] => {
    "msg": "Le service old-service n'existe pas (ce n'est pas un problème)"
}
```

La tâche nginx affiche `ok` (pas `changed`) grâce à `changed_when: false`.

---

## Commandes Utiles

### Expressions de test Jinja2 pour `when`

| Expression       | Signification                                    | Exemple                                  |
| ---------------- | ------------------------------------------------ | ---------------------------------------- |
| `==`             | Égal à                                           | `when: variable == "valeur"`             |
| `!=`             | Différent de                                     | `when: variable != "valeur"`             |
| `>`              | Supérieur à                                      | `when: variable > 10`                    |
| `<`              | Inférieur à                                      | `when: variable < 10`                    |
| `>=`             | Supérieur ou égal à                              | `when: variable >= 10`                   |
| `<=`             | Inférieur ou égal à                              | `when: variable <= 10`                   |
| `in`             | Contenu dans une liste ou chaîne                 | `when: "'nginx' in packages"`            |
| `not in`         | Non contenu dans une liste ou chaîne             | `when: "'nginx' not in packages"`        |
| `is defined`     | La variable existe                               | `when: my_var is defined`                |
| `is not defined` | La variable n'existe pas                         | `when: my_var is not defined`            |
| `is match`       | Correspond à une regex (début de chaîne)         | `when: variable is match("^web")`        |
| `is search`      | Contient une regex (n'importe où)                | `when: variable is search("nginx")`      |

### Propriétés utiles de `register`

| Propriété           | Type   | Description                                 |
| ------------------- | ------ | ------------------------------------------- |
| `result.rc`         | int    | Code retour de la commande (0 = succès)     |
| `result.stdout`     | string | Sortie standard de la commande              |
| `result.stderr`     | string | Sortie d'erreur de la commande              |
| `result.changed`    | bool   | `true` si la tâche a modifié quelque chose  |
| `result.failed`     | bool   | `true` si la tâche a échoué                 |
| `result.stat.exists` | bool  | `true` si le fichier existe (module `stat`) |

### Variables de boucle

| Variable                     | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| `{{ item }}`                 | Élément courant de la boucle                   |
| `{{ ansible_loop.index }}`   | Numéro de l'itération (commence à 1)           |
| `{{ ansible_loop.index0 }}`  | Numéro de l'itération (commence à 0)           |
| `{{ ansible_loop.first }}`   | `true` si c'est la première itération          |
| `{{ ansible_loop.last }}`    | `true` si c'est la dernière itération          |
| `{{ ansible_loop.length }}`  | Nombre total d'éléments                        |

Pour accéder à `ansible_loop`, ajoute `extended: true` dans `loop_control` :

```yaml
- name: Afficher le numéro de chaque élément
  ansible.builtin.debug:
    msg: "Élément {{ ansible_loop.index }}/{{ ansible_loop.length }} : {{ item }}"
  loop:
    - premier
    - deuxième
    - troisième
  loop_control:
    extended: true
```

---

## Pièges Fréquents

### Piège 1 : Utiliser `{{ }}` dans une clause `when`

**Problème** : Tu écris `when: "{{ variable }}" == "valeur"`. Le comportement est imprévisible.

**Solution** : Ne jamais utiliser `{{ }}` dans `when`. La clause est déjà un contexte Jinja2.

```yaml
# Incorrect
when: "{{ my_var }}" == "valeur"

# Correct
when: my_var == "valeur"
```

---

### Piège 2 : Tester une variable qui n'existe pas

**Problème** : Tu écris `when: my_var == "valeur"` mais `my_var` n'est pas définie. Ansible affiche l'erreur `undefined variable`.

**Solution** : Vérifier d'abord que la variable existe.

```yaml
# Incorrect : erreur si my_var n'est pas définie
when: my_var == "valeur"

# Correct : vérification préalable
when: my_var is defined and my_var == "valeur"
```

---

### Piège 3 : Comparer des chaînes et des entiers

**Problème** : `ansible_facts['distribution_major_version']` est une chaîne (`"12"`), pas un entier (`12`). La comparaison `"12" == 12` retourne `false`.

**Solution** : Comparer des types identiques.

```yaml
# Incorrect : compare chaîne avec entier
when: ansible_facts['distribution_major_version'] == 12

# Correct : deux chaînes
when: ansible_facts['distribution_major_version'] == "12"

# Correct : conversion avec le filtre int
when: ansible_facts['distribution_major_version'] | int >= 12
```

---

### Piège 4 : Utiliser `with_items` au lieu de `loop`

**Problème** : `with_items` est dépréciée depuis Ansible 2.5 (2018).

**Solution** : Toujours utiliser `loop` pour tout nouveau code.

```yaml
# Déprécié
with_items:
  - nginx
  - curl

# Correct
loop:
  - nginx
  - curl
```

---

### Piège 5 : Oublier `changed_when: false` pour les vérifications

**Problème** : `ansible.builtin.command` affiche toujours "changed" même si la commande ne modifie rien (ex : `php -v`, `nginx -t`).

**Solution** : Ajouter `changed_when: false` à toute commande qui ne modifie rien.

```yaml
# Incorrect : affiche "changed" pour rien
- name: Vérifier la version de PHP
  ansible.builtin.command: php -v
  register: php_version

# Correct : affiche "ok"
- name: Vérifier la version de PHP
  ansible.builtin.command: php -v
  register: php_version
  changed_when: false
```

---

## Checklist de Validation

- [ ] J'ai utilisé `when` pour exécuter une tâche conditionnellement
- [ ] J'ai combiné plusieurs conditions avec `and` et `or`
- [ ] J'ai utilisé `register` pour stocker un résultat et l'utiliser comme condition
- [ ] J'ai créé une boucle simple avec `loop`
- [ ] J'ai utilisé une variable liste dans une boucle
- [ ] J'ai utilisé `dict2items` pour boucler sur un dictionnaire
- [ ] J'ai combiné `when` et `loop` dans une même tâche
- [ ] J'ai utilisé `changed_when` et `failed_when`

---

## Exercice Pratique

**Énoncé** : Crée un playbook `exercice-conditions-boucles.yml` qui effectue les actions suivantes :

1. Installe des paquets différents selon la famille d'OS (Debian ou RedHat)
2. Crée plusieurs utilisateurs à partir d'une variable liste avec une boucle
3. Crée des répertoires uniquement s'ils n'existent pas (en utilisant `stat` + `when`)
4. Utilise `changed_when` pour éviter les faux rapports "changed"

**Indications** :

- Définis les paquets, les utilisateurs et les répertoires dans la section `vars`
- Utilise le module `ansible.builtin.stat` pour vérifier l'existence d'un répertoire
- Utilise `register` pour stocker le résultat de `stat`
- `register` dans une boucle stocke les résultats dans une liste `.results`
- Pense à `changed_when: false` sur les tâches de vérification

**Résultat attendu** :

- Sur Debian : les paquets Debian sont installés, les paquets RedHat sont ignorés
- Les utilisateurs sont créés
- Les répertoires sont créés uniquement s'ils n'existaient pas
- Aucune tâche de vérification n'affiche "changed"

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```yaml
---
- name: Exercice - Conditions et boucles
  hosts: all
  become: true

  vars:
    packages_debian:
      - apache2
      - libapache2-mod-php
      - php-pgsql

    packages_redhat:
      - httpd
      - php
      - php-pgsql

    app_users:
      - name: deploy
        groups: www-data
        shell: /bin/bash
      - name: monitoring
        groups: adm
        shell: /bin/bash
      - name: backup
        groups: www-data
        shell: /bin/sh

    app_directories:
      - /var/www/myapp
      - /var/www/myapp/public
      - /var/www/myapp/storage
      - /var/log/myapp

  tasks:
    # -- Partie 1 : Installation conditionnelle selon l'OS --

    - name: Installer les paquets pour Debian
      ansible.builtin.apt:
        name: "{{ item }}"
        state: present
        update_cache: true
      loop: "{{ packages_debian }}"
      when: ansible_facts['os_family'] == "Debian"

    - name: Installer les paquets pour RedHat
      ansible.builtin.yum:
        name: "{{ item }}"
        state: present
      loop: "{{ packages_redhat }}"
      when: ansible_facts['os_family'] == "RedHat"

    # -- Partie 2 : Création d'utilisateurs avec boucle --

    - name: Créer les utilisateurs de l'application
      ansible.builtin.user:
        name: "{{ item.name }}"
        groups: "{{ item.groups }}"
        shell: "{{ item.shell }}"
        create_home: true
        state: present
      loop: "{{ app_users }}"

    # -- Partie 3 : Création conditionnelle de répertoires --

    # register dans une boucle stocke les résultats dans dir_check.results
    - name: Vérifier l'existence des répertoires
      ansible.builtin.stat:
        path: "{{ item }}"
      register: dir_check
      loop: "{{ app_directories }}"
      changed_when: false

    # On boucle sur dir_check.results
    # item.item contient le chemin original, item.stat.exists le résultat
    - name: Créer les répertoires manquants
      ansible.builtin.file:
        path: "{{ item.item }}"
        state: directory
        owner: www-data
        group: www-data
        mode: "0755"
      loop: "{{ dir_check.results }}"
      when: not item.stat.exists

    # -- Partie 4 : Vérification avec changed_when --

    - name: Vérifier que le serveur web est installé
      ansible.builtin.command: apache2 -v
      register: apache_check
      changed_when: false
      failed_when: apache_check.rc != 0
      when: ansible_facts['os_family'] == "Debian"

    - name: Afficher la version du serveur web
      ansible.builtin.debug:
        msg: "Serveur web installé : {{ apache_check.stdout_lines[0] }}"
      when:
        - ansible_facts['os_family'] == "Debian"
        - apache_check is defined
        - apache_check.rc == 0
```

**Explication des points importants** :

- **Partie 1** : Deux tâches avec `loop` et `when`. Seule la tâche correspondant à l'OS s'exécute.
- **Partie 2** : Boucle sur une liste de dictionnaires. Chaque élément a `name`, `groups`, `shell`.
- **Partie 3** : `register` dans une boucle crée une liste `.results`. La deuxième tâche boucle sur cette liste. `item.item` contient le chemin original (l'élément de la boucle précédente).
- **Partie 4** : `changed_when: false` sur `apache2 -v` car cette commande ne modifie rien.

---

## Navigation

← Fiche précédente : **[Variables et Facts](06-variables-facts.md)**

→ Fiche suivante : **[Templates Jinja2](08-templates-jinja2.md)**
